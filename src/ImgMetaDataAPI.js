class ImgMetaData{
    constructor(src, alt, width, height){
        this.src=src;
        this.alt=alt;
        this.width=width;
        this.height=height;
    }
}
class ImgMetaDataAPI{
    static getImgMetaData(){
        return Array.from(document.querySelectorAll("img"))
               .map((img) => new ImgMetaData(img.src, img.alt, img.width, img.height) );
    }
}

export{
    ImgMetaData,
    ImgMetaDataAPI
};