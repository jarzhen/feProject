<template>
  <div class="multi-select-container">
    <el-card shadow="hover">
      <div class="card-header">
        <i class="el-icon-s-grid"></i>
        <span>el-table 多选顺序与跨页保持测试</span>
      </div>

      <el-table
        ref="tableRef"
        :data="currentPageData"
        row-key="id"
        @selection-change="handleSelectionChange"
        style="width: 100%; margin-top: 16px;"
      >
        <el-table-column type="selection" width="55" :reserve-selection="true" />
        <el-table-column type="index" width="60" label="序号" />
        <el-table-column prop="name" label="姓名" width="140" />
        <el-table-column prop="age" label="年龄" width="80" />
        <el-table-column prop="city" label="城市" width="140" />
        <el-table-column prop="email" label="邮箱" min-width="200" />
      </el-table>

      <div class="pagination-row">
        <el-pagination
          background
          layout="prev, pager, next, total"
          :total="total"
          :page-size="pageSize"
          :current-page.sync="currentPage"
          @current-change="handlePageChange"
        />
      </div>

      <!-- 操作按钮 -->
      <div class="action-row">
        <el-button type="primary" icon="el-icon-view" @click="showSelectionOrder">
          查看选中顺序
        </el-button>
        <el-button type="danger" icon="el-icon-delete" @click="clearAllSelection">
          清空所有页面选择
        </el-button>
      </div>

      <!-- 选中顺序展示 -->
      <el-alert
        v-if="selectionOrder.length"
        class="order-alert"
        type="success"
        :closable="false"
        show-icon
        title="前端实际记录的选中顺序"
      >
        <div class="order-list">
          <el-tag
            v-for="(item, index) in selectionOrder"
            :key="item.id"
            class="order-tag"
            type="info"
          >
            {{ index + 1 }}. {{ item.name }}
          </el-tag>
        </div>
      </el-alert>

      <!-- 测试步骤提示 -->
      <el-collapse class="tips" accordion>
        <el-collapse-item title="测试步骤说明" name="1">
          <ol class="tips-list">
            <li>在第 1 页点击几个不同顺序的行，例如先点"李四"再点"张三"；</li>
            <li>翻到第 2 页，再点几行；</li>
            <li>翻回第 1 页，确认之前勾选的行仍保持勾选状态；</li>
            <li>点击"查看选中顺序"，观察顺序是否与点击先后一致；</li>
            <li>点击"清空所有页面选择"，确认所有页面的勾选都被清空。</li>
          </ol>
        </el-collapse-item>
      </el-collapse>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'TableMultiSelect',
  data() {
    return {
      currentPage: 1,
      pageSize: 5,
      // 保存每页已勾选的行（按点击顺序），key 为行 id，value 为行数据
      selectedMap: {},
      // 记录点击先后顺序（用于展示）
      selectionOrder: [],
      allData: this.generateData(),
    };
  },
  computed: {
    total() {
      return this.allData.length;
    },
    currentPageData() {
      const start = (this.currentPage - 1) * this.pageSize;
      return this.allData.slice(start, start + this.pageSize);
    },
  },
  methods: {
    generateData() {
      const names = [
        '张三', '李四', '王五', '赵六', '孙七',
        '周八', '吴九', '郑十', '冯十一', '陈十二',
        '褚十三', '卫十四', '蒋十五', '沈十六', '韩十七',
        '杨十八', '朱十九', '秦二十', '许二一', '何二二',
        '吕二三', '施二四', '张二五', '孔二六', '曹二七',
      ];
      const cities = ['北京', '上海', '广州', '深圳', '杭州', '成都', '武汉', '南京', '西安', '长沙'];
      return names.map((name, index) => ({
        id: index + 1,
        name,
        age: 22 + (index % 20),
        city: cities[index % cities.length],
        email: `user${index + 1}@example.com`,
      }));
    },

    /**
     * 多选变化回调。
     * 注意：使用 reserve-selection 时，翻页会触发 selection-change，
     * 传入的 rows 是当前页勾选的行，而非全部勾选行。
     * 因此需要自行合并记录全局勾选状态。
     */
    handleSelectionChange(rows) {
      // 计算当前页的 id 集合
      const currentPageIds = this.currentPageData.map((r) => r.id);

      // 移除当前页中已取消勾选的项（保持顺序）
      for (const key of Object.keys(this.selectedMap)) {
        const id = Number(key);
        if (currentPageIds.includes(id)) {
          const stillSelected = rows.some((r) => r.id === id);
          if (!stillSelected) {
            delete this.selectedMap[key];
          }
        }
      }

      // 将当前页新勾选的项追加到末尾（保持点击顺序）
      rows.forEach((row) => {
        if (!this.selectedMap[row.id]) {
          this.selectedMap[row.id] = row;
        }
      });

      this.updateSelectionOrder();
    },

    updateSelectionOrder() {
      // 按插入顺序（对象 key 顺序）生成展示列表
      this.selectionOrder = Object.values(this.selectedMap);
    },

    showSelectionOrder() {
      if (!this.selectionOrder.length) {
        this.$message.warning('当前没有任何选中的行');
        return;
      }
      const names = this.selectionOrder.map((r) => r.name).join(' → ');
      this.$alert(`点击顺序：${names}`, '选中顺序', { confirmButtonText: '知道了' });
    },

    /**
     * 清空所有页面的选择
     */
    clearAllSelection() {
      this.$refs.tableRef.clearSelection();
      this.selectedMap = {};
      this.selectionOrder = [];
      this.$message.success('已清空所有页面的选择');
    },

    handlePageChange() {
      // 翻页后，等表格渲染完成，恢复当前页的勾选状态
      this.$nextTick(() => {
        this.restoreCurrentPageSelection();
      });
    },

    /**
     * 恢复当前页已勾选的行（保持选中状态）
     */
    restoreCurrentPageSelection() {
      const rows = this.currentPageData.filter((r) => this.selectedMap[r.id]);
      rows.forEach((row) => {
        this.$refs.tableRef.toggleRowSelection(row, true);
      });
    },
  },
};
</script>

<style scoped>
.multi-select-container {
  display: flex;
  justify-content: center;
  min-height: 100vh;
  padding: 40px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.multi-select-container > .el-card {
  width: 900px;
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

.pagination-row {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}

.action-row {
  margin-top: 16px;
  display: flex;
  gap: 12px;
}

.order-alert {
  margin-top: 16px;
}

.order-list {
  margin-top: 8px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.order-tag {
  cursor: default;
}

.tips {
  margin-top: 16px;
}

.tips-list {
  padding-left: 20px;
  line-height: 1.8;
  color: #606266;
}
</style>
