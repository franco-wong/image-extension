import { ImgMetaDataAPI } from "../utility/ImgMetaDataAPI";
import Sidebar from '../components/Sidebar';

const result = ImgMetaDataAPI.getImgMetaData();
const sidebar = new Sidebar();
sidebar.init();

/**
 * Listen on incoming messages coming from background
 */
chrome.runtime.onMessage.addListener((/* request, sender, cb */) => {
  if (!sidebar.isShown) {
    sidebar.openSidebar();
  }
  else {
    sidebar.closeSidebar();
  }
});
