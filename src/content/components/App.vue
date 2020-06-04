<template>
  <div class="app" v-if="showAppModal">
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
};
</script>

<style lang="scss">
#app-modal * {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

#app-modal {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  font-size: 14px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>

<style lang="scss" scoped>
.app {
  height: 100vh;
  width: 100vw;
}

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
