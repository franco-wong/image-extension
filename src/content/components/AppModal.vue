<template>
  <div class="modal">
    <img
      class="modal__close-icon"
      alt="close modal"
      :src="closeIcon"
      @click="handleClose"
    />
    <div class="modal__gallery">
      <ImageGallery />
    </div>
    <div class="modal__actions">
      <span>Images found: {{ pageImages }}</span>
      &nbsp;
      <span>Selected images: {{ selectedPageImages }}</span>
      <button>Upload to Drive</button>
    </div>
  </div>
</template>

<script>
import ImageGallery from '@components/ImageGallery.vue';

export default {
  name: 'AppModal',
  components: {
    ImageGallery,
  },
  computed: {
    closeIcon() {
      return chrome.extension.getURL('assets/close-icon.svg');
    },
    pageImages() {
      return this.$store.state.imagesCount;
    },
    selectedPageImages() {
      return this.$store.state.selectedImagesCount;
    },
  },
  methods: {
    handleClose() {
      this.$store.commit('setShowApp', { status: false });
    },
  },
};
</script>

<style lang="scss" scoped>
.modal {
  background-color: #fff;
  border-radius: 8px;
  // prettier-ignore
  box-shadow: 0px 11px 15px -7px rgba(0, 0, 0, 0.2),
    0px 24px 38px 3px rgba(0, 0, 0, 0.14),
    0px 9px 46px 8px rgba(0, 0, 0, 0.12);
  color: rgba(0, 0, 0, 0.87);
  display: flex;
  flex-direction: column;
  height: 550px;
  left: 50%;
  padding: 16px;
  position: fixed;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 800px;
  z-index: 10002;
}

.modal__close-icon {
  cursor: pointer;
  margin-left: auto;
}

.modal__gallery {
  display: flex;
  margin-top: 8px;
}

.modal__actions {
  margin-top: auto;

  button {
    display: block;
    margin-left: auto;
  }
}
</style>
