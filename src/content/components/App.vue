<template>
  <div class="ifn-app">
    <transition name="fade">
      <div
        v-show="showAppModal"
        class="shadowed-background"
        @click="$emit('change', false)"
      />
    </transition>
    <AppModal class="app-modal" :style="{ left: leftPosition }" />
  </div>
</template>

<script>
import AppModal from './AppModal.vue';

export default {
  name: 'App',
  components: {
    AppModal,
  },
  model: {
    prop: 'showAppModal',
    event: 'change',
  },
  computed: {
    leftPosition() {
      return this.showAppModal ? '50%' : '150%';
    },
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
.app-modal {
  transition: left 0.5s ease-in-out;
}

.shadowed-background {
  background-color: rgba(0, 0, 0, 0.5);
  bottom: 0;
  cursor: pointer;
  left: 0;
  position: fixed;
  right: 0;
  top: 0;
  z-index: 10001;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
