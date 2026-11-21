<template>
  <div id="app">
    <TableSelectAll />
  </div>
</template>

<script>
import TableSelectAll from '@/views/TableSelectAll.vue';

export default {
  name: 'App',
  components: {
    TableSelectAll
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
