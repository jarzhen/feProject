<template>
  <div id="app">
    <HelloWorld />
  </div>
</template>

<script>
import HelloWorld from '@/views/HelloWorld.vue';

export default {
  name: 'App',
  components: {
    HelloWorld
  }
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB',
    'Microsoft YaHei', Arial, sans-serif;
}
</style>
