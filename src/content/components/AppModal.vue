<template>
  <div class="fixed w-full z-high" :style="{ height: '100vh' }">
    <transition name="fade">
      <div
        v-if="showAppModal"
        class="absolute w-full bg-black opacity-50"
        :style="{ height: '100%' }"
      />
    </transition>
    <transition name="fade">
      <div
        v-if="showAppModal"
        class="p-4 bg-gray-200 h-600px absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
      >
        <!-- <img alt="Vue logo" src="./assets/logo.png" /> -->
        <HelloWorld msg="Welcome to Your Vue.js App for web extension" />
        <h1 class="text-4xl font-bold text-white-500">Hello World!</h1>
      </div>
    </transition>
  </div>
</template>

<script>
import HelloWorld from './HelloWorld.vue'

export default {
  name: 'AppModal',
  props: {
    showAppModal: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    HelloWorld,
  },
  data() {
    return {}
  },
}
</script>

<style>
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';

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
