<template>
  <div class="scroll-lock-container">
    <el-card shadow="hover" class="scroll-card">
      <div class="card-header">
        <i class="el-icon-s-grid"></i>
        <span>el-table 纵向触底防横向滚动测试</span>
      </div>

      <!-- 控制区 -->
      <div class="control-row">
        <el-switch
          v-model="preventHorizontalScroll"
          active-text="启用滚动锁定（触底后不横向滚动）"
          inactive-text="默认行为（触底后可横向滚动）"
          @change="handleToggleChange"
        />
      </div>

      <!-- 滚动位置监控 -->
      <div class="scroll-info">
        <el-tag type="info" size="medium">scrollTop: {{ scrollTop }}px</el-tag>
        <el-tag type="info" size="medium">scrollLeft: {{ scrollLeft }}px</el-tag>
        <el-tag
          :type="atVerticalBoundary ? 'warning' : 'success'"
          size="medium"
        >
          {{ atVerticalBoundary ? '纵向滚动条已触底' : '纵向可继续滚动' }}
        </el-tag>
      </div>

      <!-- 大表格：纵向(60行) + 横向(多列) 滚动 -->
      <el-table
        ref="tableRef"
        :data="tableData"
        height="420"
        style="width: 100%; margin-top: 8px;"
        @scroll="handleTableScroll"
      >
        <el-table-column prop="id" label="ID" width="70" fixed />
        <el-table-column prop="name" label="姓名" width="120" />
        <el-table-column
          v-for="col in dynamicCols"
          :key="col.prop"
          :prop="col.prop"
          :label="col.label"
          :width="col.width"
        />
        <el-table-column prop="remark" label="备注" width="200" />
      </el-table>

      <div class="tips">
        <el-alert
          type="info"
          :closable="false"
          show-icon
          title="测试方法"
          description="1. 关闭开关，纵向滚动到表格底部后再继续滚轮 —— 观察表格横向滚动条被带动（模拟真实项目 bug）；2. 打开开关后重复操作 —— 纵向触底后滚轮不再产生横向滚动。也可配合 shift+滚轮 / 触控板横向滑动测试正常横向滚动是否不受影响。"
        />
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'ScrollLockTable',
  data() {
    return {
      preventHorizontalScroll: true, // 是否启用滚动锁定
      scrollTop: 0,
      scrollLeft: 0,
      atVerticalBoundary: false,
      tableData: this.generateData(),
    };
  },
  computed: {
    dynamicCols() {
      const cols = [];
      for (let i = 1; i <= 10; i++) {
        cols.push({
          prop: `col${i}`,
          label: `字段${i}（较长表头）`,
          width: 150,
        });
      }
      return cols;
    },
  },
  mounted() {
    // 事件委托：绑定在表格根元素上（该元素不会被重建），capture 阶段拦截
    this.$refs.tableRef.$el.addEventListener('wheel', this.handleWrapWheel, {
      passive: false,
      capture: true,
    });
  },
  beforeDestroy() {
    if (this.$refs.tableRef) {
      this.$refs.tableRef.$el.removeEventListener('wheel', this.handleWrapWheel, {
        capture: true,
      });
    }
  },
  methods: {
    generateData() {
      const rows = [];
      for (let i = 1; i <= 60; i++) {
        const row = { id: i, name: `用户${i}` };
        for (let j = 1; j <= 10; j++) {
          row[`col${j}`] = `数据${i}-${j} 一些内容`;
        }
        row.remark = `备注 ${i}`;
        rows.push(row);
      }
      return rows;
    },

    /**
     * 滚动锁定核心逻辑（事件委托版）：
     * 监听器始终绑定在表格根元素上，实时读取开关状态；
     * 通过 e.target.closest 定位实际滚动容器（兼容 fixed 列生成的多个滚动区域）。
     */
    handleWrapWheel(e) {
      // 仅处理纵向滚动为主的事件（忽略横向滚轮/触控板横向滑动）
      if (Math.abs(e.deltaY) < Math.abs(e.deltaX)) return;

      // 找到事件源头所在的滚动容器（主 body 或 fixed 列的滚动区域）
      const wrap =
        e.target.closest('.el-scrollbar__wrap') ||
        e.target.closest('.el-table__fixed-body-wrapper') ||
        e.target.closest('.el-table__body-wrapper');
      if (!wrap) return;

      // 滚动方向：deltaY > 0 向下，deltaY < 0 向上
      const isScrollingDown = e.deltaY > 0;
      const isScrollingUp = e.deltaY < 0;

      const atBottom = wrap.scrollTop + wrap.clientHeight >= wrap.scrollHeight - 1;
      const atTop = wrap.scrollTop <= 0;

      // 仅当"沿滚动方向已无空间可滚"时进入处理，
      // 避免在顶部向下滚 / 在底部向上滚时被误拦截
      const atBoundary = (isScrollingDown && atBottom) || (isScrollingUp && atTop);
      if (!atBoundary) return;

      // 阻止默认行为，防止滚动链条继续传递到页面/父容器
      e.preventDefault();
      e.stopPropagation();

      if (this.preventHorizontalScroll) {
        // 开启锁定：不进行任何额外滚动（包括不转成横向滚动）
        return;
      }

      // 关闭锁定：模拟真实项目中的 bug ——
      // 纵向触底后继续滚动时，垂直增量被横向容器"消费"导致横向滚动
      wrap.scrollLeft += e.deltaY;
    },

    handleToggleChange() {
      // 无需重新绑定监听器，handler 会实时读取 preventHorizontalScroll 状态
      this.$message.success(
        this.preventHorizontalScroll ? '已启用滚动锁定' : '已关闭滚动锁定（模拟 bug：触底后转横向滚动）'
      );
    },

    /**
     * 表格滚动时更新监控信息
     */
    handleTableScroll({ scrollTop, scrollLeft }) {
      this.scrollTop = Math.round(scrollTop);
      this.scrollLeft = Math.round(scrollLeft);

      const wrap = this.$refs.tableRef
        ? this.$refs.tableRef.$el.querySelector('.el-scrollbar__wrap')
        : null;
      if (wrap) {
        this.atVerticalBoundary =
          wrap.scrollTop + wrap.clientHeight >= wrap.scrollHeight - 1;
      }
    },
  },
};
</script>

<style scoped>
.scroll-lock-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 100vh;
  padding: 40px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  /* 防止页面自身出现横向滚动，避免干扰测试 */
  overflow-x: hidden;
}

.scroll-card {
  width: 1100px;
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

.control-row {
  margin-top: 16px;
}

.scroll-info {
  display: flex;
  gap: 8px;
  margin-top: 12px;
  flex-wrap: wrap;
}

.tips {
  margin-top: 16px;
}
</style>
