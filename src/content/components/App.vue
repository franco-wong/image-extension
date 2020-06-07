<template>
  <div class="ifn-app" style="">
    <transition name="fade">
      <div class="app__inactive-element" />
    </transition>
    <transition name="fade">
      <AppModal />
    </transition>
  </div>
</template>

<script>
import AppModal from './AppModal.vue';

export default {
  name: 'App',
  components: {
    AppModal,
  },
  props: {
    showAppModal: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    showAppModal(status) {
      console.log('called...', status);
    },
  },
};
</script>

<style lang="scss">
@import '../styles/resets';

.ifn-app {
  @include reset-ua-styles;

  font-family: Avenir, Helvetica, Arial, sans-serif;
  font-size: 14px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
}
</style>

<style lang="scss" scoped>
.app__inactive-element {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 10001;
}
</style>
