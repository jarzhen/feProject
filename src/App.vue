<template>
  <div id="app">
    <TableMultiSelect />
  </div>
</template>

<script>
import TableMultiSelect from '@/views/TableMultiSelect.vue';

export default {
  name: 'App',
  components: {
    TableMultiSelect
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
