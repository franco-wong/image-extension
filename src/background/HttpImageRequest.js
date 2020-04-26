export default class HttpImageRequest {
  constructor(url, contentType, name, description) {
    this.url = url;
    this.contentType = contentType;
    this.base64 = "";
    this.length = 0;
    this.metadata = {
      name,
      description,
    };
  }

  static ArrayBufferToBase64(ab) {
    return btoa(
      new Uint8Array(ab).reduce(
        (data, byte) => data + String.fromCharCode(byte),
        ""
      )
    );
  }
}
