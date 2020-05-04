import { ImgMetaDataAPI } from "../utility/ImgMetaDataAPI";
import { inlineCSS } from "../utility/helper";
import Sidebar from "../components/Sidebar";
import ShadowDOMContainer from "../components/ShadowDOMContainer";

HTMLDivElement.prototype.css = inlineCSS;

const results = ImgMetaDataAPI.getImgMetaData();
const shadowDOMContainer = new ShadowDOMContainer();
const sidebar = new Sidebar(shadowDOMContainer);

sidebar.init(results).then(() => {
  chrome.runtime.onMessage.addListener(onMessageListener);
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
