<template>
  <div id="app">
    <FormCascade />
  </div>
</template>

<script>
import FormCascade from '@/views/FormCascade.vue';

export default {
  name: 'App',
  components: {
    FormCascade
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
