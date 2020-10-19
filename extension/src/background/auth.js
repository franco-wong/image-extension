import { GOOGLE_API } from '@utilities/constants';
import {
  generateCodeVerifierAndChallenge,
  generateRandomString,
} from '@utilities/background_helpers';

export async function launchWebAuthFlow() {
  const [codeVerifier, codeChallenge] = await generateCodeVerifierAndChallenge();
  const params = {
    client_id: GOOGLE_API.ClientId,
    redirect_uri: chrome.identity.getRedirectURL(),
    response_type: 'code',
    scope: GOOGLE_API.Scope,
    state: generateRandomString(),
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
  };

  const queryParams = new URLSearchParams(Object.entries(params)).toString();
  const config = {
    url: `${GOOGLE_API.AuthDomain}?${queryParams}`,
    interactive: true,
  };

  // Step 1 - Launch auth flow (sign-in window) and retrieve code after permission(s) approval
  const authFlow = new Promise((resolve, reject) => {
    chrome.identity.launchWebAuthFlow(config, (response) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError.message);
      }
      resolve(response);
    });
  });

  try {
    const googleResponse = await authFlow.then();
    const url = new URL(googleResponse);
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');

    if (params.state !== state) {
      throw new Error('Response and request state do not match...');
    }

    // Step 2 - Exchange code for access token & refresh token
    const serverResponse = await fetch(WP_TOKEN_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        redirect_uri: params.redirect_uri,
        grant_type: 'authorization_code',
        code,
        code_verifier: codeVerifier,
      }),
    });

    const jsonResponse = await serverResponse.json();
    console.log(jsonResponse); // TODO: store the response somewhere
  }
  catch(err) {
    console.error(`${err.name}: ${err.message}`);
  }
}
