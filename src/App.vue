<template>
  <div id="app">
    <TableDetail />
  </div>
</template>

<script>
import TableDetail from '@/views/TableDetail.vue';

export default {
  name: 'App',
  components: {
    TableDetail
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
