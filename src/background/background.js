import { startUploading } from "./google-drive-apis";
import { findAndCreateFolder } from "./get-drive-folder";
import { launchWebAuthFlow, parseAuthResponse } from "./auth";

const now = new Date();
const accessToken = {
  code: "",
  expiry: 0,
  tokenType: "",
  scope: "",
};

let imagePromisify;
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log(request);
  switch (request.command) {
    case "UPLOAD_IMAGES":
      console.log("uploading images")
      // find and create a "Image Extension" folder if it doesn't current exist
      findAndCreateFolder(accessToken.code).then((folderId) => {
        imagePromisify = startUploading(
          accessToken.code,
          request.imagesObj,
          sender.tab.url,
          sender.tab.title,
          folderId
        );

        Promise.allSettled(imagePromisify).then(() => {
          sendResponse("All images has been uploaded!");
        });
      });
      break;
  }

  return true; // to allow cb to be invoked later on
});

chrome.browserAction.onClicked.addListener((tab) => {
  const epochTime = Math.round(now.getTime() / 1000);

  if (epochTime < accessToken.expiry) {
    chrome.tabs.sendMessage(tab.id, "");
    return;
  }

  launchWebAuthFlow()
    .then((response) => {
      parseAuthResponse(response, accessToken, now);
    })
    .then(() => {
      chrome.tabs.sendMessage(tab.id, "");
    })
    .catch(console.error);
});
