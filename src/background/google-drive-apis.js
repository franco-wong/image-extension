/*
Push images

POST https://www.googleapis.com/upload/drive/v3/files?uploadType=media HTTP/1.1
Content-Type: image/jpeg
Content-Length: [NUMBER_OF_BYTES_IN_FILE]
Authorization: Bearer [YOUR_AUTH_TOKEN]
*/
let ACCESS_TOKEN;
const REQUEST_URI = "https://www.googleapis.com/upload/drive/v3/files";
const CONTENT_TYPE = "image/png";
const UPLOAD_TYPE = "media";
const BASE64_IMAGES = {
  arrayBuffer: "",
  length: 0,
};

export function getFullUploadRequestURI() {
  return `${REQUEST_URI}?uploadType=${UPLOAD_TYPE}`;
}

export function getAuthBearer() {
  return `Bearer ${ACCESS_TOKEN}`;
}

//TODO: figure out the length of the file
export function getFileLength(file) {
  return file.length;
}

export function getBase64OfURL(url) {
  window
    .fetch(url)
    .then((response) => response.blob())
    .then((blob) => {
      var reader = new FileReader();
      reader.onloadend = function () {
        BASE64_IMAGES.arrayBuffer = reader.result;
        BASE64_IMAGES.length = blob.size;
        // Once the data has been loaded, call the google drive upload
        pushImages();
      };
      reader.readAsArrayBuffer(blob);
    });
}

export function getHeaderJSON() {
  return {
    method: "POST",
    headers: {
      Authorization: getAuthBearer(),
      "Content-Type": CONTENT_TYPE,
    },
    body: BASE64_IMAGES.arrayBuffer,
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
  );
}

export function startUploading(accessToken) {
  // include a list of images to download
  ACCESS_TOKEN = accessToken;

  downloadBase64Img();
}
