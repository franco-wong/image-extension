/*
Push images

POST https://www.googleapis.com/upload/drive/v3/files?uploadType=media HTTP/1.1
Content-Type: image/jpeg
Content-Length: [NUMBER_OF_BYTES_IN_FILE]
Authorization: Bearer [YOUR_AUTH_TOKEN]
*/
var access_token;
const BOUNDARY = "naween";
const DELIMITER = "\r\n--" + BOUNDARY + "\r\n";
const CLOSE_DELIM = "\r\n--" + BOUNDARY + "--";
const REQUEST_URI = "https://www.googleapis.com/upload/drive/v3/files";
const HEADER_CONTENT_TYPE = `multipart/related; boundary=${BOUNDARY}`;
const UPLOAD_TYPE = "multipart";
const IMAGE_ARRAYBUFFER = {
  arrayBuffer: "",
  length: 0,
  metadata: {
    name: "test.png",
    description: "test test test",
  },
};

export function generateRequestBody(arrayBuffer) {
  var multipartRequestBody =
    DELIMITER +
    "Content-Type: application/json; charset=UTF-8\r\n\r\n" +
    JSON.stringify(IMAGE_ARRAYBUFFER.metadata) +
    "\r\n" +
    DELIMITER +
    "Content-Type: image/png\r\n" +
    "Content-Transfer-Encoding: base64\r\n\r\n" +
    arrayBuffer +
    CLOSE_DELIM;
  return multipartRequestBody;
}

export function getFullUploadRequestURI() {
  return `${REQUEST_URI}?uploadType=${UPLOAD_TYPE}`;
}

export function getAuthBearer() {
  return `Bearer ${access_token}`;
}

//TODO: figure out the length of the file
export function getFileLength() {
  return 1;
}

export function getBase64OfURL(url) {
  window
    .fetch(url)
    .then((response) => response.blob())
    .then((blob) => {
      var reader = new FileReader();
      reader.onloadend = function () {
        console.log(reader.result);
        IMAGE_ARRAYBUFFER.arrayBuffer = btoa(
          new Uint8Array(reader.result).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            ""
          )
        );
        //String.fromCharCode.apply(null, new Uint8Array(reader.result))
        IMAGE_ARRAYBUFFER.length = blob.size;
        // Once the data has been loaded, call the google drive upload
        pushImages();
      };
      reader.readAsArrayBuffer(blob);
    });
}

export function getHeaderJSON() {
  var requestBody = generateRequestBody(IMAGE_ARRAYBUFFER.arrayBuffer);
  console.log(requestBody);
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

export function pushImages() {
  window.fetch(getFullUploadRequestURI(), getHeaderJSON()).then((response) => {
    console.log(response);
  });
}

export function downloadBase64Img() {
  getBase64OfURL(
    "https://upload.wikimedia.org/wikipedia/commons/4/47/PNG_transparency_demonstration_1.png"
    // "https://png.pngtree.com/element_our/png/20180928/beautiful-hologram-water-color-frame-png_119551.jpg"
  );
}

export function startUploading(accessToken) {
  // include a list of images to download
  access_token = accessToken;

  downloadBase64Img();
}
