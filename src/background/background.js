const now = new Date();
const accessToken = {
  code: '',
  expiry: 0
};

chrome.browserAction.onClicked.addListener((tab) => {
  const epochTime = Math.round(now.getTime() / 1000);

  if (epochTime < accessToken.expiry) {
    chrome.tabs.sendMessage(tab.id, "");
    return;
  }

  launchWebAuthFlow()
    .then(parseAuthResponse)
    .then(() => {
      chrome.tabs.sendMessage(tab.id, "");
      // TODO: section for your api calls if you needed
    })
    .catch(console.error);
});



function parseAuthResponse(response) {
  const qParams = new URLSearchParams(response); // Does not pick up fragment identifiers, need regex to parse token value
  accessToken.code = response.match(/(?<=#access_token=).*?(?=&)/g)[0];
  accessToken.expiry = parseInt(qParams.get('expires_in'), 10) + Math.round(now.getTime() / 1000);
}

function launchWebAuthFlow() {
  const params = {
    client_id:
      "422708725016-0hb05pfhev84hbd4nldvfkfrlbhmgmql.apps.googleusercontent.com",
    redirect_uri: chrome.identity.getRedirectURL(),
    response_type: "token",
    scope: "https://www.googleapis.com/auth/drive.file",
  };
  const queryParams = new URLSearchParams(Object.entries(params)).toString();

  return new Promise((resolve, reject) => {
    chrome.identity.launchWebAuthFlow(
      {
        url: `https://accounts.google.com/o/oauth2/auth?${queryParams}`,
        interactive: true,
      },
      (response) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError.message);
        }
        // response is a string, the access token needs to parsed which is in the response string here's an example:
        // https://hlblienepbdjkedmeiggjhobpaogfjmn.chromiumapp.org/#access_token= ya29.a0Ae4lvC1Odwd_9bO7qjVozxGOoQGc2gT4e2ZtgaRPSecxcDRkTWtPQs--YPYX3gUH_izqgiMINl8uUepf3uNYHSnx2CnsjoKvPMuETqmlNJTeDmMIA9OXvF5LLQCTalkxvNiDr_CKaN9uA98b-aT7NkPrl55MX7R1CsrcrKBy &token_type=Bearer&expires_in=3599&scope=profile%20https://www.googleapis.com/auth/userinfo.profile
        resolve(response);
      }
    );
  });
}
