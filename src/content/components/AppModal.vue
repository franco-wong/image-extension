<template>
  <div
    class="bg-gray-200 h-600px fixed top-1/2 left-1/2 z-9000 transform -translate-x-1/2 -translate-y-1/2"
  >
    <!-- <img alt="Vue logo" src="./assets/logo.png" /> -->
    <HelloWorld msg="Welcome to Your Vue.js App for web extension" />
    <h1 class="text-4xl font-bold text-white-500">Hello World!</h1>
  </div>
</template>

<script>
import HelloWorld from "./HelloWorld.vue";

export default {
  name: "AppModal",
  components: {
    HelloWorld
  }
};
</script>

<style>
@import "tailwindcss/base";
@import "tailwindcss/components";
@import "tailwindcss/utilities";

#app-modal {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
