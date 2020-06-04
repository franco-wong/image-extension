<template>
  <div class="test">
    <img
      v-for="image in images"
      :key="image.src"
      :src="image.src"
      :alt="image.alt"
    />
  </div>
</template>

<script>
import { fetchPageImages } from '@utilities/helper';

export default {
  name: 'ImageGallery',
  props: {},
  created() {
    this.images = fetchPageImages();
  },
  data() {
    return {
      images: [],
    };
  },
};
</script>

<style lang="scss" scoped>
.test {
  border: 1px solid red;
  overflow-y: scroll;
  line-height: 0;
  column-count: 3;
  column-gap: 0px;
}
</style>
