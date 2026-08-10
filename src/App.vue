<template>
  <div id="app">
    <SelectTest />
  </div>
</template>

<script>
import SelectTest from '@/views/SelectTest.vue';

export default {
  name: 'App',
  components: {
    SelectTest
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
