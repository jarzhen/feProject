<template>
  <div class="db-type-test">
    <h2 class="page-title">dbType 共享变量测试</h2>

    <el-alert
      class="tip"
      title="点击 B、C 组件中的「当前查询 / 历史查询」按钮修改共享变量 dbType，再回到 A 组件点击「查看变量值」即可看到最新的值。"
      type="info"
      :closable="false"
      show-icon
    />

    <!-- 父组件视角（可选）：仅只读展示共享变量，不参与修改 -->
    <el-card class="parent-card" shadow="hover">
      <div slot="header" class="card-header">
        <span>父组件 index.vue</span>
        <el-tag type="info">只读展示</el-tag>
      </div>
      <div class="parent-body">
        当前共享变量 dbType = <span class="parent-value">{{ dbType }}</span>
      </div>
    </el-card>

    <!-- 三个子组件（标签页形式，默认显示 A） -->
    <el-card class="tabs-card" shadow="hover">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="子组件 A" name="a">
          <ChildA />
        </el-tab-pane>
        <el-tab-pane label="子组件 B" name="b">
          <ChildB />
        </el-tab-pane>
        <el-tab-pane label="子组件 C" name="c">
          <ChildC />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import ChildA from './a.vue';
import ChildB from './b.vue';
import ChildC from './c.vue';
import { dbTypeStore } from '@/store/dbType';

export default {
  name: 'DbTypeTest',
  components: {
    ChildA,
    ChildB,
    ChildC
  },
  data() {
    return {
      // 默认激活 A 标签页
      activeTab: 'a'
    };
  },
  computed: {
    // 父组件只读引用共享变量，仅用于展示，不直接管理 dbType
    dbType() {
      return dbTypeStore.dbType;
    }
  }
};
</script>

<style scoped>
.db-type-test {
  min-height: 100vh;
  padding: 24px;
  background: linear-gradient(135deg, #eef2f7 0%, #f7f9fc 100%);
}

.page-title {
  margin: 0 0 16px;
  font-size: 22px;
  color: #303133;
}

.tip {
  margin-bottom: 16px;
}

.parent-card {
  margin-bottom: 16px;
  border-radius: 8px;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: 600;
  color: #303133;
}

.parent-body {
  font-size: 15px;
  color: #606266;
}

.parent-value {
  font-size: 18px;
  font-weight: 700;
  color: #409eff;
}

.tabs-card {
  border-radius: 8px;
}
</style>
