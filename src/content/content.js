import { inlineCSS } from "../utility/helper";
import Sidebar from "../components/Sidebar";

HTMLDivElement.prototype.css = inlineCSS;

const sidebar = new Sidebar();

sidebar.init().then(() => {
  chrome.runtime.onMessage.addListener(onMessageListener);
});

/**
 * Listen on incoming messages coming from background
 */
function     onMessageListener(/* request, sender, cb */) {
  if (!sidebar.isShown) {
    sidebar.openSidebar();
  } else {
    sidebar.closeSidebar();
  }
}
