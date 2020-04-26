import { ImgMetaDataAPI } from "../utility/ImgMetaDataAPI";
import { inlineCSS } from "../utility/helper";
import Sidebar from "../components/Sidebar";

HTMLDivElement.prototype.css = inlineCSS;

const results = ImgMetaDataAPI.getImgMetaData();
const sidebar = new Sidebar();

sidebar.init().then(() => {
  chrome.runtime.onMessage.addListener(onMessageListener);
  sidebar.loadImagesOntoGallery(results);
});

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
