// import { inlineCSS } from "../utility/helper";
// import Sidebar from "../components-old/Sidebar";

// HTMLDivElement.prototype.css = inlineCSS;

// const sidebar = new Sidebar();

// sidebar.init().then(() => {
//   chrome.runtime.onMessage.addListener(onMessageListener);
// });

// /**
//  * Listen on incoming messages coming from background
//  */
// function onMessageListener(/* request, sender, cb */) {
//   if (!sidebar.isShown) {
//     sidebar.openSidebar();
//   } else {
//     sidebar.closeSidebar();
//   }
// }

import Vue from "vue";
import App from "./App.vue";

const root = document.createElement("div");
root.setAttribute("id", "gd-sync-image-upload-app");
document.body.prepend(root);

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
}).$mount("#gd-sync-image-upload-app");

console.log("coming from content...");
