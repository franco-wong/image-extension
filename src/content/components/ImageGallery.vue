<template>
  <div class="image-gallery" ref="gallery">
    <div
      class="image-gallery__tile"
      v-for="(image, index) in galleryImages"
      :key="index"
    >
      <div class="tile__image">
        <img :src="image.src" :alt="image.alt" @load="imageLoaded" />
      </div>
    </div>
  </div>
</template>

<script>
import { fetchPageImages } from '@utilities/helper';

export default {
  name: 'ImageGallery',
  props: {},
  computed: {
    galleryImages() {
      return this.images;
    },
  },
  mounted() {
    for (const image of document.querySelectorAll('img')) {
      if (image.width + image.naturalWidth < 10) {
        continue;
      }

      this.images.push({ alt: image.alt, src: image.src });
    }
  },
  data() {
    return {
      images: [],
    };
  },
  methods: {
    imageLoaded(image) {
      const tileElement = image.currentTarget.parentElement;

      const gallery = window.getComputedStyle(this.$refs.gallery);
      const height = tileElement.getBoundingClientRect().height;

      const gridAutoRows = parseInt(gallery.getPropertyValue('grid-auto-rows'));
      const gridRowGap = parseInt(gallery.getPropertyValue('grid-row-gap'));

      const spanValue = Math.ceil(
        (image.currentTarget.height + gridRowGap) / (gridAutoRows + gridRowGap)
      );

      image.currentTarget.parentElement.parentElement.style.gridRowEnd = `span ${spanValue}`;
    },
  },
};
</script>

<style lang="scss" scoped>
.image-gallery {
  display: grid;
  grid-column-gap: 8px;
  grid-row-gap: 8px;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  grid-auto-rows: 8px;
  height: 450px;
  width: 100%;
  border: 1px dotted gray;
  overflow-y: scroll;
  padding: 8px;

  .image-gallery__tile {
    padding: 4px;
    transition: grid-row-start 300ms linear;
    transition: transform 300ms ease;
    transition: all 0.5s ease;
    cursor: pointer;

    &:hover {
      transform: scale(1.025);
    }
  }

  img {
    max-width: 100%;
    border-radius: 8px;
    box-shadow: 0 0 16px #333;
    transition: all 1.5s ease;

    &:hover {
      box-shadow: 0 0 32px #333;
    }
  }
}
</style>
