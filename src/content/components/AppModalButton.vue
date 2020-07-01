<template>
  <div>
    <button @click="$emit('function', purpose)">{{ name }}</button>
  </div>  
</template>

<script>
export default {
  name: 'AppModalButton',
  props: ["name", "purpose"],
  methods: {}
}
</script>

<style scoped>

</style>