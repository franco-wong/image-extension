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

export function getFullUploadRequestURI() {
  return `${REQUEST_URI}?uploadType=${UPLOAD_TYPE}`;
}
//?uploadType=${UPLOAD_TYPE}
export function getAuthBearer(accessToken) {
  return `Bearer ${accessToken}`;
}

//TODO: figure out the length of the file
export function getFileLength(file) {
  return file.length;
}

export function getHeaderJSON() {
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

export function pushImage(accessToken) {
  window.fetch(getFullUploadRequestURI()).then((response) => {
    console.log(response);
  });
}