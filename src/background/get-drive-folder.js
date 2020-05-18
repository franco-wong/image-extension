/*
  Find the "Image Extension" folder to upload images into


  GET https://www.googleapis.com/drive/v3/files?q=name%3D'Image%20Extension' HTTP/1.1

  Authorization: Bearer [YOUR_ACCESS_TOKEN]
  Accept: application/json

*/

/*
  Create the "Image Extension" folder if the folder doesn't already exist


  POST https://www.googleapis.com/drive/v3/files HTTP/1.1

  Authorization: Bearer [YOUR_ACCESS_TOKEN]
  Accept: application/json
  Content-Type: application/json

  {
    "mimeType": "application/vnd.google-apps.folder",
    "name": "Image Extension"
  }

*/
let access_token;
const REQUEST_URI = "https://www.googleapis.com/drive/v3/files";

function getAuthBearer() {
  return `Bearer ${access_token}`;
}

function getRequestURI(list) {
  if (list) {
    return `${REQUEST_URI}?q=mimeType%3D'application%2Fvnd.google-apps.folder'`; //?q=mimeType%3D'application%2Fvnd.google-apps.folder'
  }
  return REQUEST_URI;
}

function getRequestHeader() {
  return {
    method: "GET",
    headers: {
      Authorization: getAuthBearer(),
      Accept: "application/json",
    },
  };
}

function getCreateRequestHeader() {
  return {
    method: "POST",
    headers: {
      Authorization: getAuthBearer(),
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      mimeType: "application/vnd.google-apps.folder",
      name: "Image Extension",
    }),
  };
}

function sendListRequest() {
  return fetch(getRequestURI(true), getRequestHeader());
}

function createFolderRequest() {
  fetch(REQUEST_URI, getCreateRequestHeader())
    .then((response) => response.json())
    .then((json) => json.id);
}

export function findAndCreateFolder(accessToken) {
  access_token = accessToken;
  return sendListRequest()
    .then((response) => response.json())
    .then((json) => {
      if (json.files.length !== 0 && json.files[0].name === "Image Extension") {
        return json.files[0].id;
      }
    })
    .then((result) => {
      if (result) {
        return result;
      }
      return createFolderRequest();
    });
}
