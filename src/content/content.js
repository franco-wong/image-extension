import { ImgMetaDataAPI } from "../utility/ImgMetaDataAPI";
import { inlineCSS } from "../utility/helper";
import Sidebar from "../components/Sidebar";
import ShadowDOMContainer from "../components/ShadowDOMContainer";

HTMLDivElement.prototype.css = inlineCSS;

let results = removeImgWithNoSrc(ImgMetaDataAPI.getImgMetaData());
const shadowDOMContainer = new ShadowDOMContainer();
const sidebar = new Sidebar(shadowDOMContainer);

let gallaryReady = false;
sidebar.init(results).then(() => {
  chrome.runtime.onMessage.addListener(onMessageListener);
  gallaryReady = true;
});

function removeImgWithNoSrc(imgTags){
  let valid = [];
  for(let img of imgTags){
    if(img.src === ""){
      break;
    }
    valid.push(img);
  }
  return valid;
}

/**
 * Listen on incoming messages coming from background
 */
function onMessageListener(/* request, sender, cb */) {
  if (!sidebar.isShown) {
    sidebar.openSidebar();
  } else {
    sidebar.closeSidebar();
  }
}

/**
 * MutationObserver on the document
 */
const targetNode = document.querySelector("body");
const config = {
  attributes: true,
  childList: true,
  subtree: true
};
const callback = function(mutationList){
  let new_results = removeImgWithNoSrc(ImgMetaDataAPI.getImgMetaData());
  if(gallaryReady){
    sidebar.imageGallery.loadImagesOntoGallery(new_results.slice(results.length));
    results = new_results.slice();
  }
};
const observer = new MutationObserver(callback);

observer.observe(targetNode, config);