<template>
  <el-select
    :value="value"
    :placeholder="placeholder"
    :disabled="disabled"
    style="width: 100%;"
    @change="handleChange"
  >
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    />
  </el-select>
</template>

<script>
export default {
  name: 'CustomSelect',
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    value: {
      type: [String, Number, Boolean],
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      default: '请选择',
    },
    options: {
      type: Array,
      default: () => [],
      // 每项形如 { value, label }
    },
  },
  methods: {
    handleChange(val) {
      this.$emit('change', val);
    },
  },
};
</script>
