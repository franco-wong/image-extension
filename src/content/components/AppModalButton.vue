<template>
  <div>
    <button @click="$emit('function', name)">{{ name }}</button>
  </div>  
</template>

<script>
export default {
  name: 'AppModalButton',
  props: ["name", "function"],
  methods: {}
}
</script>

<style scoped>

</style>