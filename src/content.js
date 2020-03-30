import { ImgMetaDataAPI } from "./ImgMetaDataAPI";
import Sidebar from './Sidebar';

const result = ImgMetaDataAPI.getImgMetaData();
const sidebar = new Sidebar();

/**
 * Listen on incoming messages coming from background
 */
chrome.runtime.onMessage.addListener((request, sender) => {
  if (!sidebar.isShown) {
    sidebar.init();
  }
  else {
    sidebar.closeSidebar();
  }
});
