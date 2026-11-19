<template>
  <el-card class="child-card" shadow="hover">
    <div slot="header" class="card-header">
      <span>子组件 A</span>
      <el-tag size="small" type="success">使用 dbType</el-tag>
    </div>

    <div class="body">
      <!-- 指定显示区域：实时展示共享变量 dbType -->
      <div class="display-area" :class="{ highlight: highlight }">
        <div class="display-label">dbType 值</div>
        <div class="display-value">{{ dbType }}</div>
      </div>

      <el-button type="primary" icon="el-icon-view" @click="showValue">
        查看变量值
      </el-button>
    </div>
  </el-card>
</template>

<script>
import { dbTypeStore } from '@/store/dbType';

export default {
  name: 'ChildA',
  data() {
    return {
      highlight: false
    };
  },
  computed: {
    // 直接引用共享变量，B/C 修改后此处会实时更新
    dbType() {
      return dbTypeStore.dbType;
    }
  },
  methods: {
    showValue() {
      this.highlight = true;
      this.$message({
        message: `当前 dbType = ${this.dbType}`,
        type: 'success'
      });
      // 1 秒后取消高亮
      setTimeout(() => {
        this.highlight = false;
      }, 1000);
    }
  }
};
</script>

<style scoped>
.child-card {
  border-radius: 8px;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: 600;
  color: #303133;
}

.body {
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: stretch;
}

.display-area {
  padding: 20px;
  text-align: center;
  border: 1px dashed #dcdfe6;
  border-radius: 8px;
  background: #fafafa;
  transition: background 0.3s, border-color 0.3s;
}

.display-area.highlight {
  background: #ecf5ff;
  border-color: #409eff;
}

.display-label {
  font-size: 13px;
  color: #909399;
  margin-bottom: 8px;
}

.display-value {
  font-size: 32px;
  font-weight: 700;
  color: #409eff;
  line-height: 1;
}
</style>
