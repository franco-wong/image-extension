import { startUploading } from "./google-drive-apis";
import { findAndCreateFolder } from "./get-drive-folder";
import { launchWebAuthFlow, parseAuthResponse } from "./auth";
import { detectDomainInURL } from "../dom-link-selector/something";
import { RULE_SET } from "../dom-link-selector/rules";

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
      findAndCreateFolder(accessToken.code).then((folderId) => {
        // determines if the domain is a search engine, and will take page_source differently
        let source_domain = detectDomainInURL(sender.tab.url);
        let RULES_OBJ = JSON.parse(RULE_SET["rule_set"]);
        let result = "N/A";

        if(source_domain in RULES_OBJ) result = RULES_OBJ[source_domain];
        
        console.log("The rules for",source_domain,"is",result);

        imagePromisify = startUploading(
          accessToken.code,
          request.uploadImages,
          sender.tab.url,
          sender.tab.title,
          folderId
        );

        Promise.allSettled(imagePromisify).then(() => {
          sendResponse("All images has been uploaded!");
        });
      });
      console.log(request.uploadImages);
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
