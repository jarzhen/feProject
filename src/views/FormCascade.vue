<template>
  <div class="form-cascade-container">
    <el-card shadow="hover" class="form-card">
      <div class="card-header">
        <i class="el-icon-s-order"></i>
        <span>el-form 自定义下拉组件级联禁用测试</span>
      </div>

      <el-alert
        class="tips"
        type="info"
        :closable="false"
        show-icon
        title="测试说明"
        description='A 组件选择"选项1"时，B 组件禁用不可选；A 选择其他选项或清空时，B 恢复可用。'
      />

      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
        style="margin-top: 20px;"
      >
        <el-form-item label="字段 A" prop="a">
          <CustomSelect
            v-model="form.a"
            :options="optionsA"
            placeholder="请选择 A"
          />
        </el-form-item>

        <el-form-item label="字段 B" prop="b">
          <CustomSelect
            v-model="form.b"
            :options="optionsB"
            placeholder="请选择 B"
            :disabled="isBDisabled"
          />
          <div v-if="isBDisabled" class="disabled-hint">A 选择了"选项1"，B 已被禁用</div>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSubmit">提交</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>

      <el-divider />

      <div class="result">
        <div class="result-item">
          <span class="label">A 当前值：</span>
          <el-tag>{{ form.a || '未选择' }}</el-tag>
        </div>
        <div class="result-item">
          <span class="label">B 当前值：</span>
          <el-tag :type="isBDisabled ? 'info' : 'success'">{{ form.b || '未选择' }}</el-tag>
        </div>
        <div class="result-item">
          <span class="label">B 状态：</span>
          <el-tag :type="isBDisabled ? 'danger' : 'success'">
            {{ isBDisabled ? '已禁用' : '可用' }}
          </el-tag>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import CustomSelect from '@/components/CustomSelect.vue';

export default {
  name: 'FormCascade',
  components: {
    CustomSelect,
  },
  /**
   * @returns {{
   *   form: { a: string, b: string },
   *   optionsA: Array<{ value: string, label: string }>,
   *   optionsB: Array<{ value: string, label: string }>,
   *   rules: { a: object[], b: object[] }
   * }}
   */
  data() {
    return {
      form: {
        a: '',
        b: '',
      },
      optionsA: [
        { value: 'a1', label: '选项1' },
        { value: 'a2', label: '选项2' },
        { value: 'a3', label: '选项3' },
        { value: 'a4', label: '选项4' },
      ],
      optionsB: [
        { value: 'b1', label: '选项一' },
        { value: 'b2', label: '选项二' },
        { value: 'b3', label: '选项三' },
        { value: 'b4', label: '选项四' },
      ],
      rules: {
        a: [{ required: true, message: '请选择 A', trigger: 'change' }],
        b: [{ required: true, message: '请选择 B', trigger: 'change' }],
      },
    };
  },
  computed: {
    /**
     * B 是否禁用：A 选择"选项1"时禁用
     */
    isBDisabled() {
      return this.form.a === 'a1';
    },
  },
  watch: {
    /**
     * 监听 B 禁用状态变化：禁用时清空 B 的旧值，避免脏数据
     */
    isBDisabled(val) {
      if (val) {
        this.form.b = '';
      }
    },
  },
  methods: {
    handleSubmit() {
      this.$refs.formRef.validate((valid) => {
        if (valid) {
          this.$message.success(`提交成功：A=${this.form.a}, B=${this.form.b}`);
        } else {
          this.$message.error('表单校验失败');
        }
      });
    },
    handleReset() {
      this.$refs.formRef.resetFields();
    },
  },
};
</script>

<style scoped>
.form-cascade-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 100vh;
  padding: 40px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.form-card {
  width: 600px;
  max-width: 100%;
}

.card-header {
  font-size: 20px;
  font-weight: 600;
  color: #303133;
  display: flex;
  align-items: center;
  gap: 8px;
}

.card-header i {
  font-size: 22px;
  color: #409eff;
}

.tips {
  margin-top: 12px;
}

.disabled-hint {
  font-size: 12px;
  color: #f56c6c;
  margin-top: 6px;
  line-height: 1.4;
}

.result {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  padding: 0 4px;
}

.result-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #606266;
}

.label {
  white-space: nowrap;
}
</style>
