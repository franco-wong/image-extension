import { startUploading } from "./google-drive-apis";
import { findAndCreateFolder } from "./get-drive-folder";
const now = new Date();
const accessToken = {
  code: "",
  expiry: 0,
  tokenType: "",
  scope: "",
};

let imagePromisify;
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.command) {
    case "UPLOAD_IMAGES":
      // find and create a "Image Extension" folder if it doesn't current exist
      findAndCreateFolder(accessToken.code)
        .then(folderId => {
          imagePromisify = startUploading(accessToken.code, request.uploadImages, sender.tab.url, sender.tab.title, folderId);

          Promise.allSettled(imagePromisify)
            .then(()=>{
              sendResponse("All images has been uploaded!");
          });
        });
      console.log(request.uploadImages);
      return true;
  }
});

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
    })
    .catch(console.error);
});

function parseAuthResponse(response) {
  const qParams = new URLSearchParams(response); // Does not pick up fragment identifiers, need regex to parse token value
  accessToken.code = response.match(/(?<=#access_token=).*?(?=&)/g)[0];
  accessToken.expiry =
    parseInt(qParams.get("expires_in"), 10) + Math.round(now.getTime() / 1000);
  accessToken.tokenType = qParams.get("token_type");
  accessToken.scope = qParams.get("scope");
}

function launchWebAuthFlow() {
  const params = {
    client_id:
      "422708725016-0hb05pfhev84hbd4nldvfkfrlbhmgmql.apps.googleusercontent.com",
    redirect_uri: chrome.identity.getRedirectURL(),
    response_type: "token",
    scope: "https://www.googleapis.com/auth/drive",
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
        resolve(response);
      }
    );
  });
}
