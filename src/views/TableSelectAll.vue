<template>
  <div class="table-select-container">
    <el-card class="table-card" shadow="hover">
      <div slot="header" class="card-header">
        <i class="el-icon-s-grid"></i>
        <span>{{ currentView === 'list' ? '表格多选（全选 / 全不选切换）' : '明细信息' }}</span>
      </div>

      <!-- 列表视图 -->
      <template v-if="currentView === 'list'">
        <el-table
          ref="table"
          :data="tableData"
          border
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <!-- 第一列：多选框 -->
          <el-table-column type="selection" width="55" align="center" />
          <!-- 第二列：序号 -->
          <el-table-column type="index" label="序号" width="80" align="center" />
          <el-table-column prop="name" label="姓名" align="center" />
          <el-table-column prop="age" label="年龄" width="100" align="center" />
          <el-table-column prop="city" label="城市" align="center" />
          <el-table-column prop="date" label="日期" align="center" />
        </el-table>

        <!-- 底部操作区 -->
        <div class="footer">
          <el-button type="primary" icon="el-icon-document" @click="goDetail">
            明细
          </el-button>
          <el-button
            type="primary"
            :icon="isAllSelected ? 'el-icon-remove-outline' : 'el-icon-circle-plus-outline'"
            :disabled="!tableData.length"
            @click="toggleAll"
          >
            {{ isAllSelected ? '全不选' : '全选' }}
          </el-button>
          <span class="selected-tip">
            已选 {{ multipleSelection.length }} / {{ tableData.length }} 条
          </span>
        </div>
      </template>

      <!-- 明细视图（带返回按钮） -->
      <div v-else class="detail-view">
        <div class="detail-toolbar">
          <el-button type="primary" icon="el-icon-back" @click="backToList">
            返回
          </el-button>
        </div>

        <el-descriptions title="选中记录明细" :column="2" border>
          <el-descriptions-item label="姓名">{{ detailData.name }}</el-descriptions-item>
          <el-descriptions-item label="年龄">{{ detailData.age }}</el-descriptions-item>
          <el-descriptions-item label="城市">{{ detailData.city }}</el-descriptions-item>
          <el-descriptions-item label="日期">{{ detailData.date }}</el-descriptions-item>
        </el-descriptions>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'TableSelectAll',
  data() {
    return {
      currentView: 'list', // list = 列表视图，detail = 明细视图
      detailData: null,
      multipleSelection: [],
      tableData: [
        { name: '张三', age: 28, city: '北京', date: '2026-01-01' },
        { name: '李四', age: 32, city: '上海', date: '2026-02-15' },
        { name: '王五', age: 25, city: '广州', date: '2026-03-20' },
        { name: '赵六', age: 30, city: '深圳', date: '2026-04-10' },
        { name: '孙七', age: 27, city: '杭州', date: '2026-05-05' },
        { name: '周八', age: 35, city: '成都', date: '2026-06-18' }
      ]
    };
  },
  computed: {
    isAllSelected() {
      return (
        this.tableData.length > 0 &&
        this.multipleSelection.length === this.tableData.length
      );
    }
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    toggleAll() {
      if (this.isAllSelected) {
        this.$refs.table.clearSelection();
      } else {
        this.$refs.table.toggleAllSelection();
      }
    },
    goDetail() {
      if (this.multipleSelection.length !== 1) {
        this.$message.warning('请选择一条记录！');
        return;
      }
      this.detailData = this.multipleSelection[0];
      this.currentView = 'detail';
    },
    backToList() {
      this.currentView = 'list';
    }
  }
};
</script>

<style scoped>
.table-select-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 100vh;
  padding: 40px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.table-card {
  width: 800px;
  max-width: 100%;
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

.footer {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 16px;
}

.selected-tip {
  font-size: 14px;
  color: #606266;
}

.detail-toolbar {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 16px;
}
</style>
