export class ImgMetaData {
  constructor(src, alt, width, height) {
    this.src = src;
    this.alt = alt;
    this.width = width;
    this.height = height;
  }
}

export class ImgMetaDataAPI {
  static getImgMetaData(node = document) {
    return Array.from(node.querySelectorAll("img")).map(
      (img) => new ImgMetaData(img.src, img.alt, img.width, img.height)
    );
  }
}
