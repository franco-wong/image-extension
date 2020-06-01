<template>
  <div class="hello">
    <h1 class="text-blue-600">{{ msg }}</h1>
  </div>
</template>

<script>
export default {
  name: 'ImageGallery',
  props: {
    msg: {
      type: String,
      default: '',
    },
  },
}
</script>

<style scoped>
h1 {
  font-weight: 600;
  font-size: 24px;
}
</style>
