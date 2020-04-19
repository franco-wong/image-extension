let isSidebarOpen = false; // TODO: Change this inefficient way of handling open and close
let accessToken = null;

chrome.browserAction.onClicked.addListener((tab) => {
  // if (!isSidebarOpen) {
  //   chrome.tabs.sendMessage(tab.id, "");
  //   return;
  // }

  launchWebAuthFlow()
    .then((response) => {
      isSidebarOpen = true;
      accessToken = response.match(/(?<=#access_token=).*?(?=&)/g)[0];
      console.log(accessToken);
      pushImage(accessToken);
      // chrome.tabs.sendMessage(tab.id, "");
    })
    .catch((error) => {
      isSidebarOpen = false;
      console.log(error);
    });
});

/*
TODO: Move to new file
*/

/*
Push images

POST https://www.googleapis.com/upload/drive/v3/files?uploadType=media HTTP/1.1
Content-Type: image/jpeg
Content-Length: [NUMBER_OF_BYTES_IN_FILE]
Authorization: Bearer [YOUR_AUTH_TOKEN]
*/
const REQUEST_URI = "https://www.googleapis.com/upload/drive/v3/files";
const CONTENT_TYPE = "image/png";
const UPLOAD_TYPE = "media";

function getFullUploadRequestURI() {
  return `${REQUEST_URI}?uploadType=${UPLOAD_TYPE}`;
}
//?uploadType=${UPLOAD_TYPE}
function getAuthBearer(accessToken) {
  return `Bearer ${accessToken}`;
}

//TODO: figure out the length of the file
function getFileLength(file) {
  return file.length;
}

function getHeaderJSON() {
  const formData = new FormData();
  const testImg = new Image();
  testImg.src = "./test.png";
  formData.append("img", testImg);
  return {
    headers: {
      "Content-Type": CONTENT_TYPE,
      // ,
      // "Content-Length": getFileLength(),
    },
    method: "POST",
    Authorization: getAuthBearer(),
    body: formData,
  };
}

function pushImage(accessToken) {
  window.fetch(getFullUploadRequestURI()).then((response) => {
    console.log(response);
  });
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
