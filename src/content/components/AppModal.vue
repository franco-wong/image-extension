<template>
  <div class="modal">
    <img
      class="modal__close-icon"
      alt="close modal"
      :src="closeIcon"
      @click="handleClose"
    />
    <div class="modal__gallery">
      <ImageGallery ref="gallery" />
    </div>
    <div class="modal__actions">
      <span>Images found: {{ pageImages }}</span>
      <br />
      <span>Selected images: {{ selectedPageImages }}</span>
      <button @click="unselectAllImages">Unselect Images</button>
      <button @click="upload">Upload Images</button>
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
  data() {
    return {};
  },
  computed: {
    closeIcon() {
      return chrome.extension.getURL('assets/close-icon.svg');
    },
    pageImages() {
      return this.$store.getters.imagesCount;
    },
    selectedPageImages() {
      return this.$store.getters.selectedImagesCount;
    },
  },
  methods: {
    handleClose() {
      this.$store.commit('setShowApp', { status: false });
    },
    unselectAllImages() {
      const elements = this.$refs.gallery.$el.querySelectorAll(
        '.image-selected'
      );

      for (const element of elements) {
        element.classList.toggle('image-selected');
      }

      this.$store.commit('unselectAllImages');
    },
    upload() {
      const stateImagesMap = this.$store.state.selectedImageMap;
      const images = Object.values(stateImagesMap).map((img) => img.src);
      const payload = {
        command: 'UPLOAD_IMAGES',
        images,
      };

      chrome.runtime.sendMessage(payload, (response) => {
        console.log(response);
      });
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
    border-width: 0;
    padding: 5px;
    display: inline-block;
    float: right;
    margin-left: 3px;
  }
}
</style>
