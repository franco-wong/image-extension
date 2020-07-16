<template>
  <div class="image-gallery" ref="gallery">
    <div
      v-for="image in pageImages"
      :key="image.srcIndex"
      class="image-gallery__tile"
    >
      <div class="tile__image">
        <img
          :alt="image.alt"
          :src="image.src"
          :data-id="image.id"
          @click="handleImageClick"
          @load="handleImageLoaded"
          @error="handleImageError"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { fetchPageImages } from '@utilities/helper';

export default {
  name: 'ImageGallery',
  props: {},
  computed: {},
  mounted() {
    for (const image of document.querySelectorAll('img')) {
      if (image.width + image.naturalWidth < 10) {
        continue;
      }

      const source = image.src || image.dataset.src;

      this.pageImages.push({
        alt: image.alt,
        src: source,
        id: this.pageImages.length,
      });
    }
  },
  data() {
    return {
      pageImages: [],
    };
  },
  methods: {
    handleImageLoaded(e) {
      const tileElement = e.currentTarget.parentElement;

      const gallery = window.getComputedStyle(this.$refs.gallery);
      const height = tileElement.getBoundingClientRect().height;

      const gridAutoRows = parseInt(gallery.getPropertyValue('grid-auto-rows'));
      const gridRowGap = parseInt(gallery.getPropertyValue('grid-row-gap'));

      const spanValue = Math.ceil(
        (e.currentTarget.height + gridRowGap) / (gridAutoRows + gridRowGap)
      );

      e.currentTarget.parentElement.parentElement.style.gridRowEnd = `span ${spanValue}`;

      this.$store.commit('setImages', {
        type: 'ADD',
        element: e.currentTarget,
        id: e.currentTarget.dataset.id,
      });
    },
    handleImageError(e) {
      e.currentTarget.style.display = 'none';
      this.$store.commit('setImages', {
        type: 'REMOVE',
        id: e.currentTarget.dataset.id,
      });
    },
    handleImageClick({ currentTarget: imageElement }) {
      imageElement.classList.toggle('image-selected');

      const type = imageElement.classList.contains('image-selected')
        ? 'ADD'
        : 'REMOVE';

      this.$store.commit('setSelectedImages', {
        type,
        id: imageElement.dataset.id,
        imgSrc: imageElement.src,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.image-selected {
  box-shadow: 0 0 8px 4px #330a80 !important;
}

.image-gallery {
  border: 1px dotted gray;
  display: grid;
  grid-auto-rows: 8px;
  grid-column-gap: 8px;
  grid-row-gap: 8px;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  height: 450px;
  overflow-y: scroll;
  padding: 8px;
  width: 100%;

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
    border-radius: 8px;
    box-shadow: 0 0 16px #333;
    max-width: 100%;
    transition: all 0.3s ease;

    &:hover {
      box-shadow: 0 0 32px #333;
    }
  }
}
</style>
