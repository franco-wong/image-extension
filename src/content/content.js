import Vue from 'vue'
import AppModal from './components/AppModal.vue'

const root = document.createElement('div')
root.setAttribute('id', 'gd-sync-image-upload-app')
document.body.prepend(root)

Vue.config.productionTip = false

const vm = new Vue({
  data: { showModal: false },
  render(createElement) {
    return createElement(AppModal, {
      props: {
        showAppModal: this.showModal,
      },
    })
  },
}).$mount('#gd-sync-image-upload-app')

chrome.runtime.onMessage.addListener(onMessageListener)

/**
 * Listen on incoming messages coming from background
 */
function onMessageListener(/* request, sender, cb */) {
  vm.showModal = !vm.showModal
}
