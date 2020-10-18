import { GOOGLE_API } from '@utilities/constants';
import {
  generateCodeChallenge,
  generateRandomString,
} from '@utilities/background_helpers';

export function launchWebAuthFlow() {
  const [codeVerifier, codeChallenge] = generateCodeChallenge(); // Returns a tuple
  const params = {
    client_id: GOOGLE_API.ClientId,
    redirect_uri: chrome.identity.getRedirectURL(),
    response_type: 'code',
    scope: GOOGLE_API.Scope,
    state: generateRandomString(),
    code_challenge: codeVerifier,
    code_challenge_method: 'plain',
  };
  const queryParams = new URLSearchParams(Object.entries(params)).toString();
  const config = {
    url: `${GOOGLE_API.AuthDomain}?${queryParams}`,
    interactive: true,
  };

  // Launch auth flow (sign-in)
  const authFlow = new Promise((resolve, reject) => {
    chrome.identity.launchWebAuthFlow(config, (response) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError.message);
      }

      resolve(response);
    });
  });

  // Exchange code for access token
  authFlow
    .then(async (response) => {
      const url = new URL(response);
      const code = url.searchParams.get('code');
      const state = url.searchParams.get('state');

      if (params.state !== state) {
        Promise.reject('Response and request state do not match..');
      }

      try {
        const response = await fetch(WP_TOKEN_ENDPOINT, {
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
        const jsonResponse = await response.json();
        console.log(jsonResponse);
      } catch (error) {
        console.error(error);
      }
    })
    .catch(console.error);
}
