<template>
  <div id="app">
    <DbTypeTest />
  </div>
</template>

<script>
import DbTypeTest from '@/views/DbTypeTest/index.vue';

export default {
  name: 'App',
  components: {
    DbTypeTest
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
