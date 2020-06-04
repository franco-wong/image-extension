<template>
  <div class="modal">
    <img class="modal__close-icon" alt="close modal" :src="closeBtnSrc" />
    <div class="modal__gallery">
      <ImageGallery class="" />
      <!-- <div>Image Previewer</div> -->
    </div>
    <div class="modal__actions">
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
    closeBtnSrc() {
      return chrome.extension.getURL('assets/close-icon.svg');
    },
  },
};
</script>

<style lang="scss" scoped>
$first-layer: 0px 11px 15px -7px rgba(0, 0, 0, 0.2);
$second-layer: 0px 24px 38px 3px rgba(0, 0, 0, 0.14);
$third-layer: 0px 9px 46px 8px rgba(0, 0, 0, 0.12);

.modal {
  background-color: #fff;
  border-radius: 4px;
  box-shadow: $first-layer, $second-layer, $third-layer;
  color: rgba(0, 0, 0, 0.87);
  height: 550px;
  left: 50%;
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 800px;
  z-index: 10002;
}

.modal__close-icon {
  margin-left: auto;
}

.modal__gallery {
  display: flex;
}

.modal__actions {
}
</style>
