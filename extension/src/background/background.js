import { startUploading } from './google-drive-apis';
import { launchWebAuthFlow } from './auth';
import { retrieveGDriveFolderId, getStorage } from '../utility/background_helpers';

const now = new Date();

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.command) {
    case 'UPLOAD_IMAGES':
      retrieveGDriveFolderId(accessToken.code).then((folderId) => {
        const imagePromisify = startUploading(
          request.images,
          sender.tab.url,
          sender.tab.title,
          folderId,
          request.searchEngine
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
  const currTime = Math.round(now.getTime() / 1000);
  const access_expiry = getStorage(["access_expiry"]);

  if (access_expiry !== undefined && currTime < access_expiry) {
    chrome.tabs.sendMessage(tab.id, { command: 'TOGGLE_APP_MODAL' });
    return;
  }

  launchWebAuthFlow();
});
