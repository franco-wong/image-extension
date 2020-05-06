/*
Push images

POST https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart HTTP/1.1
Authorization: Bearer [YOUR_AUTH_TOKEN]
Content-Type: multipart/related; boundary=foo_bar_baz
Content-Length: [NUMBER_OF_BYTES_IN_ENTIRE_REQUEST_BODY]

--foo_bar_baz
Content-Type: application/json; charset=UTF-8

{
  "name": "myObject"
}

--foo_bar_baz
Content-Type: image/jpeg

[JPEG_DATA]
--foo_bar_baz--
*/

let access_token;
const BOUNDARY = "naween";
const REQUEST_BODY_DELIM = {
  DELIMITER: "\r\n--" + BOUNDARY + "\r\n",
  CLOSE_DELIM: "\r\n--" + BOUNDARY + "--",
};
const REQUEST_URI = "https://www.googleapis.com/upload/drive/v3/files";
const HEADER_CONTENT_TYPE = `multipart/related; boundary=${BOUNDARY}`;
const UPLOAD_TYPE = "multipart";

function getFullUploadRequestURI() {
  return `${REQUEST_URI}?uploadType=${UPLOAD_TYPE}`;
}

function getAuthBearer() {
  return `Bearer ${access_token}`;
}

// a base64 string will start with "data:[image/jpeg];base64,[/9j/4AAQS...]", the []s is what I'm extracting below
function buildRequestBody(base64, metaData) {
  const base64_data = base64.split(";");
  return `${
    REQUEST_BODY_DELIM.DELIMITER
  }Content-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(
    metaData
  )}\r\n${
    REQUEST_BODY_DELIM.DELIMITER
  }Content-Type: ${base64_data[0].split(":")[1]}\r\nContent-Transfer-Encoding: base64\r\n\r\n${base64_data[1].split(",")[1]}${
    REQUEST_BODY_DELIM.CLOSE_DELIM
  }`;
}

function getBase64Representation(imageBlob) {
  return new Promise((resolve, reject) => {
    let reader = new FileReader();
    reader.onloadend = function () {
      resolve(reader.result);
    };
    reader.readAsDataURL(imageBlob);
  });
}

function getImageBlob(url) {
  return window.fetch(url).then((response) => {
    return response.blob();
  });
}

function buildRequestHeader(requestBody) {
  return {
    method: "POST",
    headers: {
      Authorization: getAuthBearer(),
      "Content-Type": HEADER_CONTENT_TYPE,
      "Content-Length": requestBody.length,
    },
    body: requestBody,
  };
}

function sendGoogleApiRequest(requestHeader) {
  window.fetch(getFullUploadRequestURI(), requestHeader).then((response) => {
    console.log(response);
  });
}

function buildMetaDataString(metadata, pageSource){
  metadata = JSON.parse(metadata);
  return `Page Source: ${ pageSource }\nHeight: ${ metadata.height }px\nWidth: ${ metadata.width }px`;
}

function getTodaysDate(){
  const today = new Date();
  let month = (today.getMonth()+1).toString();
  month = month > "9" ? month : "0"+month;
  let date = today.getDate().toString();
  date = date > "9" ? date : "0"+date;
  return `${today.getFullYear()}-${month}-${date}_`;
}

export function startUploading(accessToken, listOfImages, pageSource, folderId) {
  access_token = accessToken;

  for (let image of listOfImages) {
    const metaData = {
      name: getTodaysDate()+image.alt,
      description: buildMetaDataString(image.metadata, pageSource),
      parents:[folderId]
    };
    getImageBlob(image.src)
      .then(getBase64Representation)
      .then((base64) => {
        return new Promise((resolve) =>
          resolve(buildRequestBody(base64, metaData, folderId))
        );
      })
      .then(buildRequestHeader)
      .then(sendGoogleApiRequest);
  }
}
