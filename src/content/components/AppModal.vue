<template>
  <div class="fixed z-high" :style="{ height: '100vh', width: '100vw' }">
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
        :style="{ height: '550px', width: '700px' }"
        class="p-4 bg-gray-800 center-xy shadow-2xl"
      >
        <img alt="close modal" :src="closeBtnSrc" class="ml-auto mb-4" />
        <div class="flex" :style="{ height: '80%' }">
          <ImageGallery class="flex-1" />
          <div class="test" :style="{ width: '200px' }">Image Previewer</div>
        </div>
        <button class="ml-auto">Upload to Drive</button>
      </div>
    </transition>
  </div>
</template>

<script>
import ImageGallery from './ImageGallery.vue';

export default {
  name: 'AppModal',
  components: {
    ImageGallery,
  },
  props: {
    showAppModal: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {};
  },
  computed: {
    closeBtnSrc() {
      return chrome.extension.getURL('assets/close-icon.svg');
    },
  },
};
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

.test {
  border: 1px solid orange;
}
</style>
