import Vue from 'vue';
import Vuex from 'vuex';
import App from './components/App.vue';
import StateTree from './store/store';

const root = document.createElement('div');
root.setAttribute('id', 'gd-sync-image-upload-app');
document.body.prepend(root);

Vue.config.productionTip = false;
Vue.use(Vuex);

const vm = new Vue({
  data: { showModal: false },
  store: new Vuex.Store(StateTree),
  render(createElement) {
    return createElement(App, {});
  },
}).$mount('#gd-sync-image-upload-app');

chrome.runtime.onMessage.addListener(onMessageListener);

/**
 * Listen on incoming messages coming from background
 */
function onMessageListener(/* request, sender, cb */) {
  vm.$store.commit('setShowApp', { status: !vm.$store.state.showApp });
}
