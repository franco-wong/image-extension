import { GOOGLE_AUTH } from "../utility/constants";

export function launchWebAuthFlow() {
  const params = {
    client_id: GOOGLE_AUTH.ClientId,
    redirect_uri: chrome.identity.getRedirectURL(),
    response_type: "token",
    scope: GOOGLE_AUTH.Scope,
  };
  const queryParams = new URLSearchParams(Object.entries(params)).toString();

  return new Promise((resolve, reject) => {
    chrome.identity.launchWebAuthFlow(
      {
        url: `${GOOGLE_AUTH.AuthDomain}?${queryParams}`,
        interactive: true,
      },
      (response) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError.message);
        }
        resolve(response);
      }
    );
  });
}

export function parseAuthResponse(response, accessToken, now) {
  const qParams = new URLSearchParams(response); // Does not pick up fragment identifiers, need regex to parse token value
  accessToken.code = response.match(/(?<=#access_token=).*?(?=&)/g)[0];
  accessToken.expiry = parseInt(qParams.get("expires_in"), 10) + Math.round(now.getTime() / 1000); // prettier-ignore
  accessToken.tokenType = qParams.get("token_type");
  accessToken.scope = qParams.get("scope");
}
