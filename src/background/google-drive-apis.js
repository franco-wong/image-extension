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

function generateRequestBody(imageObj) {
  return (
    REQUEST_BODY_DELIM.DELIMITER +
    "Content-Type: application/json; charset=UTF-8\r\n\r\n" +
    JSON.stringify(imageObj.metadata) +
    "\r\n" +
    REQUEST_BODY_DELIM.DELIMITER +
    `Content-Type: ${imageObj.contentType}\r\n` +
    "Content-Transfer-Encoding: base64\r\n\r\n" +
    imageObj.base64 +
    REQUEST_BODY_DELIM.CLOSE_DELIM
  );
}

function getBase64OfURL(imageObj) {
  window
    .fetch(imageObj.url)
    .then((response) => response.blob())
    .then((blob) => {
      let reader = new FileReader();
      reader.onloadend = function () {
        imageObj.base64 = ArrayBufferToBase64(reader.result);
        imageObj.length = blob.size;
        sendRequest(imageObj);
      };
      reader.readAsArrayBuffer(blob);
    });
}

function getHeaderJSON(imageObj) {
  let requestBody = generateRequestBody(imageObj);
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

function sendRequest(imageObj) {
  window
    .fetch(getFullUploadRequestURI(), getHeaderJSON(imageObj))
    .then((response) => {
      console.log(response);
    });
}

export function startUploading(accessToken, listOfImages = []) {
  access_token = accessToken;

  let url1 =
    "https://upload.wikimedia.org/wikipedia/commons/4/47/PNG_transparency_demonstration_1.png";

  let url2 =
    "https://png.pngtree.com/element_our/png/20180928/beautiful-hologram-water-color-frame-png_119551.jpg";
  let arr = [url1, url2];

  for (let url of arr) {
    let imageClass = new ImageClass(
      url,
      "image/png",
      "franco's test",
      "this is a test description"
    );
    getBase64OfURL(imageClass);
    console.log(imageClass);
  }
}
