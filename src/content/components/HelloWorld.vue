<template>
  <div class="hello">
    <h1 class="text-blue-600">{{ msg }}</h1>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: {
      type: String,
      default: '',
    },
  },
  created() {
    console.log('test')
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1 {
  font-weight: 600;
  font-size: 24px;
}
</style>
