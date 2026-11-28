<template>
  <div id="app">
    <FormLabelWidth />
  </div>
</template>

<script>
import FormLabelWidth from '@/views/FormLabelWidth.vue';

export default {
  name: 'App',
  components: {
    FormLabelWidth
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
