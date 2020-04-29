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
let imageArray = [];
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

function buildRequestBody(base64, metaData, imageType) {
  return `${
    REQUEST_BODY_DELIM.DELIMITER
  }Content-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(
    metaData
  )}\r\n${
    REQUEST_BODY_DELIM.DELIMITER
  }Content-Type: ${imageType}\r\nContent-Transfer-Encoding: base64\r\n\r\n${base64}${
    REQUEST_BODY_DELIM.CLOSE_DELIM
  }`;
}

function getBase64Representation(imageBlob) {
  return new Promise((resolve, reject) => {
    let reader = new FileReader();
    reader.onloadend = function () {
      resolve(reader.result.split(";")[1].split(",")[1]);
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
  console.log(requestHeader);
  window.fetch(getFullUploadRequestURI(), requestHeader).then((response) => {
    console.log(response);
  });
}

export function startUploading(accessToken, listOfImages = []) {
  access_token = accessToken;

  let url1 =
    "https://upload.wikimedia.org/wikipedia/commons/4/47/PNG_transparency_demonstration_1.png";
  let url2 =
    "https://png.pngtree.com/element_our/png/20180928/beautiful-hologram-water-color-frame-png_119551.jpg";

  for (let url of [url1, url2]) {
    const imageType = "image/png";
    const metaData = {
      name: "franco's test",
      description: "this is a test description",
    };
    getImageBlob(url)
      .then(getBase64Representation)
      .then((base64) => {
        return new Promise((resolve) =>
          resolve(buildRequestBody(base64, metaData, imageType))
        );
      })
      .then(buildRequestHeader)
      .then(sendGoogleApiRequest);
  }
}
