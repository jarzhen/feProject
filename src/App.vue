<template>
  <div id="app">
    <PdfPreview />
  </div>
</template>

<script>
import PdfPreview from '@/views/PdfPreview/index.vue';

export default {
  name: 'App',
  components: {
    PdfPreview
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
