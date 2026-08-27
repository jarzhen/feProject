<template>
  <div id="app">
    <ScrollLockTable />
  </div>
</template>

<script>
import ScrollLockTable from '@/views/ScrollLockTable.vue';

export default {
  name: 'App',
  components: {
    ScrollLockTable
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
