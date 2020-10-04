import { GOOGLE_API } from '@utilities/constants';
import {
  generateCodeChallenge,
  generateRandomString,
} from '@utilities/background_helpers';

export function launchWebAuthFlow() {
  const params = {
    client_id: GOOGLE_API.ClientId,
    redirect_uri: chrome.identity.getRedirectURL(),
    response_type: 'code',
    scope: GOOGLE_API.Scope,
    state: generateRandomString(),
    code_challenge: generateCodeChallenge(),
    code_challenge_method: 'S256',
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
            client_id: GOOGLE_API.ClientId,
            grant_type: 'authorization_code',
            code,
            code_verifier: param.code_challenge,
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
