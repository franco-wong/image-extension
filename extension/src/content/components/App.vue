<template>
  <div class="ifn-app">
    <transition name="fade">
      <div v-show="isAppShown" class="shadowed-background" />
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
  computed: {
    isAppShown() {
      return this.$store.state.showApp;
    },
    leftPosition() {
      return this.$store.state.showApp ? '50%' : '150%';
    },
  },
  methods: {},
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
  left: 0;
  position: fixed;
  right: 0;
  top: 0;
  z-index: calc(2147483647 - 1);
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
