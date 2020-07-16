<template>
  <div id="buttonDiv">
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

<style scoped lang="scss">
  * {
    margin: 0;
  }
  #buttonDiv {
    display: inline-block;
    padding: 0;
    float: right;
    margin-left: 5px;
  }
  button {
    padding: 5px;
    border: none;
  }
</style>