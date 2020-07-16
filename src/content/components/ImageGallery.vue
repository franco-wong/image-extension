<template>
  <div class="image-gallery" ref="gallery">
    <div
      v-for="image in pageImages"
      :key="image.srcIndex"
      class="image-gallery__tile"
    >
      <div class="tile__image">
        {{ image }}
        <!-- <img
          :alt="image.alt"
          :src="image.src"
          :data-id="image.id"
          @click="handleImageClick"
          @load="handleImageLoaded"
          @error="handleImageError"
        /> -->
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
    pageImages() {
      console.log('called...', Array.from(this.$store.state.images.values()));
      return Array.from(this.$store.state.images.values());
    },
  },
  mounted() {
    // Create watcher
    this.observer = new MutationObserver((mutationList) => {
      for (let mutation of mutationList) {
        if (mutation.type === 'childList') {
          [].forEach.call(mutation.target.children, this.handleMutationRecords);
        }
      }
    });
    // Start watching the entire DOM tree
    this.observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  },
  data() {
    return {
      observer: null,
    };
  },
  methods: {
    handleImageLoaded({ currentTarget: image }) {
      const tileElement = image.parentElement;
      const gallery = window.getComputedStyle(this.$refs.gallery);
      const gridAutoRows = parseInt(gallery.getPropertyValue('grid-auto-rows'));
      const gridRowGap = parseInt(gallery.getPropertyValue('grid-row-gap'));

      const spanValue = Math.ceil(
        (image.height + gridRowGap) / (gridAutoRows + gridRowGap)
      );

      tileElement.parentElement.style.gridRowEnd = `span ${spanValue}`;
    },
    handleImageError({ currentTarget: image }) {
      image.style.display = 'none';

      this.$store.commit('setImages', {
        type: 'REMOVE',
        element: image,
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
    handleMutationRecords(node) {
      const nodeName = node.tagName.toLowerCase();
      let results = [];

      switch (nodeName) {
        case 'img':
          results.push(node);
          break;
        case 'div':
          results = Array.from(node.querySelectorAll('img'));
          break;
      }

      if (results.length > 0) {
        results.reduce((accum, image) => {
          if (this.$store.state.images.has(image.src)) {
            return accum;
          }

          accum.push(image);
          return accum;
        }, []);
      }

      if (!results.length) return;

      this.loadImagesOntoGallery(results);
    },
    loadImagesOntoGallery(images) {
      for (const image of images) {
        if (image.width + image.naturalWidth < 10) {
          continue;
        }

        this.$store.commit('setImages', {
          type: 'ADD',
          element: image,
        });
      }
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
