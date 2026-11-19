<template>
  <el-card class="child-card" shadow="hover">
    <div slot="header" class="card-header">
      <span>子组件 C</span>
      <el-tag size="small" type="danger">修改 dbType</el-tag>
    </div>

    <div class="body">
      <div class="desc">
        当前 dbType = <span class="value">{{ dbType }}</span>
      </div>

      <div class="btn-group">
        <el-button type="primary" @click="setCurrent">当前查询</el-button>
        <el-button type="danger" @click="setHistory">历史查询</el-button>
      </div>
    </div>
  </el-card>
</template>

<script>
import { dbTypeStore, setDbType } from '@/store/dbType';

export default {
  name: 'ChildC',
  computed: {
    dbType() {
      return dbTypeStore.dbType;
    }
  },
  methods: {
    setCurrent() {
      setDbType(1);
    },
    setHistory() {
      setDbType(2);
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

.desc {
  font-size: 14px;
  color: #606266;
  text-align: center;
}

.value {
  font-size: 18px;
  font-weight: 700;
  color: #f56c6c;
}

.btn-group {
  display: flex;
  gap: 12px;
  justify-content: center;
}
</style>
