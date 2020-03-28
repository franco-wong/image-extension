const listOfImgs = document.querySelectorAll("img");

let allImgs = [];
let currImgMetaData = {};

for(let img of listOfImgs){
    currImgMetaData["src"] = img.src;
    currImgMetaData["todaysDate"] = "";
    currImgMetaData["alt"] = img.alt;
    currImgMetaData["width"] = img.width;
    currImgMetaData["height"] = img.height;
    allImgs.push(currImgMetaData);
}

console.log(allImgs);
// src, alt, todays date, width, height