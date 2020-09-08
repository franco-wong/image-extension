<template>
  <div class="image-gallery" ref="gallery">
    <div v-for="(image, uniqueId) in pageImages" :key="uniqueId">
      <div>
        <img
          :alt="image.alt"
          :src="resolveImageSource(image)"
          :data-id="uniqueId"
          :data-source="resolvePageSource(image)"
          @click="handleImageClick"
          @error="handleImageError"
          @load="handleImageLoaded"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { fetchPageImages } from '@utilities/helper';
import { SearchEngine, identifyDomainInURL } from '@rules/rules';
import { sha256 } from 'js-sha256';

const pageUrl = window.location.toString();

let searchEngineDomain = identifyDomainInURL(pageUrl);
let searchEngine = null;

if(searchEngineDomain){
  searchEngine = new SearchEngine(pageUrl, searchEngineDomain);
}

export default {
  name: 'ImageGallery',
  computed: {
    pageImages() {
      return this.$store.state.imagesMap;
    },
  },
  mounted() {
    // Create watcher
    this.$store.state.searchEngine = searchEngine;
    this.observer = new MutationObserver((mutationList) => {
      for (let mutation of mutationList) {
        if (
          // mutation.target.className !== 'image-gallery' && // Avoid infinite observer calls from removing image tiles
          mutation.type === 'childList'
        ) {
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
      imageWhitelist: [
        'b092c27a80a2fadb0907d2b6d6d2100618c71319cf4447112754961017247b72', // not show our own chrome extension images - temp solution
      ],
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
      image.parentElement.parentElement.style.display = 'none';
    },
    handleImageClick({ currentTarget: imageElement }) {
      const { id } = imageElement.dataset;
      let type;

      if (id in this.$store.state.selectedImageMap) {
        type = 'unselectImage';
      } else {
        type = 'selectImage';
      }

      imageElement.classList.toggle('image-selected');

      this.$store.commit({
        element: imageElement,
        type,
        id,
      });
    },
    handleMutationRecords(node) {
      let foundImages = Array.from(node.querySelectorAll('img'));

      if (!(foundImages.length)) return;

      let pageSource = pageUrl;

      // Converting array of elements into array of promises
      foundImages = foundImages.reduce((accum, image) => {
        if (searchEngine) {
          pageSource = searchEngine.navigateDOMToSource(image);
          if (!pageSource) return accum;
        }

        image.dataset.pageSource = pageSource;

        const source = image.src || image.dataset.src;
        const hash = sha256(source);

        if (image.width + image.naturalWidth < 10) {
          return accum;
        }

        if (hash in this.$store.state.imagesMap) {
          return accum;
        }

        accum.push({ image, hash, source });
        return accum;
      }, []);

      Promise.allSettled(foundImages)
        .then((results) => {
          return results.reduce((accum, result) => {
            if (result.status !== 'fulfilled') return accum;

            accum.push(result.value);
            return accum;
          }, []);
        })
        .then((filteredResults) => {
          for (const { image, hash } of filteredResults) {
            if (!this.imageWhitelist.includes(hash)) {
              this.$store.commit('setImages', {
                type: 'ADD',
                element: image,
                uniqueId: hash
              });
            }
          }
        })
        .catch(() => {});
    },
    resolveImageSource(image) {
      return image.src || image.dataset.src;
    },
    resolvePageSource(image) {
      return image.dataset.pageSource;
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
