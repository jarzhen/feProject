<template>
  <div class="label-width-page">
    <el-card class="main-card" shadow="hover">
      <div slot="header" class="card-header">
        <i class="el-icon-s-operation"></i>
        <span>el-form label-width 属性测试</span>
      </div>

      <!-- 控制区 -->
      <div class="control-panel">
        <div class="control-row">
          <span class="control-label">label 宽度：</span>
          <el-input
            v-model="labelWidthInput"
            placeholder="支持数字(px) / 带单位 / auto"
            clearable
            class="width-input"
          >
            <template slot="append">实时生效</template>
          </el-input>
          <span class="current-value">
            当前生效：<b>{{ labelWidth }}</b>
          </span>
        </div>

        <div class="control-row">
          <span class="control-label">控件宽度：</span>
          <el-input
            v-model="inputWidthInput"
            placeholder="支持 100%、300px、20em 等"
            clearable
            class="width-input"
          >
            <template slot="append">实时生效</template>
          </el-input>
          <span class="current-value">
            当前生效：<b>{{ inputWidth }}</b>
          </span>
        </div>

        <div class="preset-row">
          <span class="control-label">快捷设置：</span>
          <el-button-group>
            <el-button size="small" @click="labelWidthInput = '80'">80px</el-button>
            <el-button size="small" @click="labelWidthInput = '100'">100px</el-button>
            <el-button size="small" @click="labelWidthInput = '120px'">120px</el-button>
            <el-button size="small" @click="labelWidthInput = '8em'">8em</el-button>
            <el-button size="small" @click="labelWidthInput = 'auto'">auto</el-button>
          </el-button-group>
        </div>

        <el-alert
          class="tip"
          title="输入纯数字按 px 处理；带单位字符串（如 120px / 8em）直接作为 CSS 宽度；auto 为自适应。调整即时生效。"
          type="info"
          :closable="false"
          show-icon
        />
      </div>

      <!-- 表单展示区 -->
      <div class="form-panel">
        <el-form :model="form" :label-width="labelWidth" label-position="right">
          <el-form-item label="用户名">
            <el-input
              v-model="form.name"
              placeholder="请输入用户名"
              :style="{ width: inputWidth }"
            />
          </el-form-item>
          <el-form-item label="所属部门">
            <el-select
              v-model="form.department"
              placeholder="请选择部门"
              :style="{ width: inputWidth }"
            >
              <el-option label="研发部" value="rd" />
              <el-option label="产品部" value="pm" />
              <el-option label="测试部" value="qa" />
              <el-option label="运维部" value="ops" />
            </el-select>
          </el-form-item>
          <el-form-item label="入职日期">
            <el-date-picker
              v-model="form.date"
              type="date"
              placeholder="选择日期"
              :style="{ width: inputWidth }"
            />
          </el-form-item>
          <el-form-item label="联系电话">
            <el-input
              v-model="form.phone"
              placeholder="请输入联系电话"
              :style="{ width: inputWidth }"
            />
          </el-form-item>
          <el-form-item label="详细地址">
            <el-input
              v-model="form.address"
              placeholder="请输入详细地址"
              :style="{ width: inputWidth }"
            />
          </el-form-item>
          <el-form-item label="备注说明">
            <el-input
              v-model="form.remark"
              type="textarea"
              :rows="3"
              placeholder="请输入备注说明"
              :style="{ width: inputWidth }"
            />
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'FormLabelWidth',
  data() {
    return {
      labelWidthInput: '100',
      inputWidthInput: '100%',
      form: {
        name: '',
        department: '',
        date: '',
        phone: '',
        address: '',
        remark: ''
      }
    };
  },
  computed: {
    // 解析 label-width：纯数字 -> number(px)，带单位/auto -> 原字符串
    labelWidth() {
      const v = String(this.labelWidthInput).trim();
      if (!v) return 'auto';
      if (/^\d+(\.\d+)?$/.test(v)) return Number(v);
      return v;
    },
    // 解析控件宽度：纯数字 -> px 字符串，空 -> 100%，带单位 -> 原字符串
    inputWidth() {
      const v = String(this.inputWidthInput).trim();
      if (!v) return '100%';
      if (/^\d+(\.\d+)?$/.test(v)) return v + 'px';
      return v;
    }
  }
};
</script>

<style scoped>
.label-width-page {
  min-height: 100vh;
  padding: 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.main-card {
  max-width: 720px;
  margin: 0 auto;
  border-radius: 12px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.card-header i {
  font-size: 20px;
  color: #409eff;
}

.control-panel {
  padding-bottom: 8px;
}

.control-row,
.preset-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.control-label {
  font-size: 14px;
  color: #606266;
  white-space: nowrap;
}

.width-input {
  width: 240px;
}

.current-value {
  font-size: 14px;
  color: #606266;
}

.current-value b {
  color: #409eff;
  font-size: 16px;
}

.tip {
  margin-bottom: 8px;
}

.form-panel {
  padding: 8px 0;
}

.form-panel .el-form-item {
  margin-bottom: 20px;
}
</style>
