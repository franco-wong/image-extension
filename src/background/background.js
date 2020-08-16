import { startUploading } from './google-drive-apis';
import { launchWebAuthFlow, parseAuthResponse } from './auth';
import { retrieveGDriveFolderId } from '../utility/background_helpers';
// import {
//   identifyDomainInURL,
//   requestToSecondaryPageForImageSource,
// } from '../GetDomImageSource/IdentifyDomain';
// import { RULE_SET } from '../GetDomImageSource/DomainRules';

const now = new Date();
const accessToken = {
  code: '',
  expiry: 0,
  tokenType: '',
  scope: '',
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.command) {
    case 'UPLOAD_IMAGES':
      retrieveGDriveFolderId(accessToken.code).then((folderId) => {
        console.log('after gdrive call...', folderId);

        // Determines if the domain is a search engine, and will take page_source differently

        // let source_domain = identifyDomainInURL(sender.tab.url);
        // let RULES_OBJ = JSON.parse(RULE_SET['rule_set']);
        // let result = 'N/A';

        // if (source_domain in RULES_OBJ) {
        //   result = RULES_OBJ[source_domain];
        // }

        // console.log('The rules for', source_domain, 'is', result);

        const imagePromisify = startUploading(
          accessToken.code,
          request.images,
          sender.tab.url,
          sender.tab.title,
          folderId
        );

        Promise.allSettled(imagePromisify).then(() => {
          sendResponse('All images has been uploaded!');
        });
      });
      break;
  }

  return true; // to allow cb to be invoked later on
});

/**
 * When the user clicks the browser action to bring the image gallery up, it will take the image metadata
 * and the page source relative to the image tag (only if the domain is a search engine in the list).
 * If there is no relative href, the search engine page link will be used
 */
chrome.browserAction.onClicked.addListener((tab) => {
  const epochTime = Math.round(now.getTime() / 1000);

  // requestToSecondaryPageForImageSource().then((result) => console.log(result));

  if (epochTime < accessToken.expiry) {
    chrome.tabs.sendMessage(tab.id, '');
    return;
  }

  launchWebAuthFlow()
    .then((response) => {
      parseAuthResponse(response, accessToken, now);
    })
    .then(() => {
      chrome.tabs.sendMessage(tab.id, '');
    })
    .catch(console.error);
});
