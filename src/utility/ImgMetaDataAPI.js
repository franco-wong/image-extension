import { RULE_SET } from "../GetDomImageSource/DomainRules";

export class ImgMetaData {
  constructor(src, alt, width, height, img) {
    this.src = src;
    this.alt = alt;
    this.width = width;
    this.height = height;
    this.img = img; // I want to store the img tag because later we can get the navigate the dom to extract the page source, if 
  }
}

export class ImgMetaDataAPI {
  static getImgMetaData(node = document, domain) {
    return Array.from(node.querySelectorAll("img")).map(
      (img) => {
        let imgTag = null;
        // if(domain !== null) imgTag = findImageSourceInDom(domain, img);

        return new ImgMetaData(img.src, img.alt, img.width, img.height, imgTag);
      }
    );
  }
}
