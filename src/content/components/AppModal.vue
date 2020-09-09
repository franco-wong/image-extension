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
      <span>Selected images: {{ selectedPageImages }}</span>
      <button @click="unselectAllImages" :disabled="areImageSelected">
        Unselect Images
      </button>
      <button @click="upload" class="primary" :disabled="areImageSelected">
        Upload Images
      </button>
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
    areImageSelected() {
      return !Boolean(this.selectedPageImages);
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
      const searchEngine = this.$store.state.searchEngine;
      const images = Object.values(stateImagesMap).map((img) => {
        return { 
          'image': img.src,
          'searchEngineImageSource': img.dataset.source,
          'searchEngineImageTitle': img.alt };
        });
      const payload = {
        command: 'UPLOAD_IMAGES',
        images,
        searchEngine,
      };

      chrome.runtime.sendMessage(payload, (response) => {
        console.log(response);
        this.unselectAllImages();
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import './../styles/button';

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
  display: flex;
  margin-top: auto;

  span:first-of-type {
    margin-right: 12px;
  }

  button {
    @include button-root;

    &:first-of-type {
      margin-left: auto;
      margin-right: 8px;
    }
  }
}

.primary {
  color: #fff;
  background-color: #1976d2;
}
</style>
