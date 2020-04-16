chrome.browserAction.onClicked.addListener((tab) => {
  // chrome.tabs.sendMessage(tab.id, "");
  let authUrl = 'https://accounts.google.com/o/oauth2/auth?';
  const params = {
    client_id: "422708725016-0hb05pfhev84hbd4nldvfkfrlbhmgmql.apps.googleusercontent.com",
    redirect_uri: chrome.identity.getRedirectURL(),
    response_type: 'token',
    scope: 'profile'
  };
  
  const urlParams = new URLSearchParams(Object.entries(params)).toString();

  chrome.identity.launchWebAuthFlow({ url: authUrl + urlParams, interactive: true, }, (response) => {
    // response is a string, the access token needs to parsed which is in the response string
    // here's an example:
    // https://hlblienepbdjkedmeiggjhobpaogfjmn.chromiumapp.org/#access_token=ya29.a0Ae4lvC1Odwd_9bO7qjVozxGOoQGc2gT4e2ZtgaRPSecxcDRkTWtPQs--YPYX3gUH_izqgiMINl8uUepf3uNYHSnx2CnsjoKvPMuETqmlNJTeDmMIA9OXvF5LLQCTalkxvNiDr_CKaN9uA98b-aT7NkPrl55MX7R1CsrcrKBy&token_type=Bearer&expires_in=3599&scope=profile%20https://www.googleapis.com/auth/userinfo.profile
    console.log(response);
  });
});



