<template>
  <div class="select-test-container">
    <el-card class="test-card" shadow="hover">
      <div class="card-header">
        <i class="el-icon-s-operation"></i>
        <span>el-select 选中项自动置顶滚动测试</span>
      </div>

      <!-- 场景一：默认行为 -->
      <div class="section">
        <h3 class="section-title">场景一：默认行为</h3>
        <p class="section-desc">
          选择靠后的选项后，再次打开下拉框，滚动条停留在原位置，上次选中的项可能被遮挡看不到。
        </p>
        <div class="demo-row">
          <span class="label">默认：</span>
          <el-select v-model="value1" placeholder="请选择" style="width: 240px;">
            <el-option
              v-for="item in longOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <span class="result">选中：{{ value1 || '无' }}</span>
        </div>
      </div>

      <!-- 场景二：精确计算 scrollTop 置顶方案 -->
      <div class="section">
        <h3 class="section-title">场景二：精确计算 scrollTop 置顶</h3>
        <p class="section-desc">
          展开时通过选项索引精确计算 scrollTop，将选中项滚动到下拉列表的顶部位置。
        </p>
        <div class="demo-row">
          <span class="label">方案B：</span>
          <el-select
            v-model="value2"
            placeholder="请选择"
            style="width: 240px;"
            popper-class="popper-b"
            @visible-change="handleVisibleB"
          >
            <el-option
              v-for="item in longOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <span class="result">选中：{{ value2 || '无' }}</span>
        </div>
      </div>

      <el-divider />

      <div class="section">
        <h3 class="section-title">操作说明</h3>
        <el-steps direction="vertical" space="80px">
          <el-step>
            <template slot="description">
              1. 在两个场景中展开下拉，选择 <el-tag size="mini">选项7</el-tag>（靠后的选项）
            </template>
          </el-step>
          <el-step>
            <template slot="description">
              2. 再次展开场景一下拉 —— 选项7被遮挡，需要手动滚动才能看到
            </template>
          </el-step>
          <el-step>
            <template slot="description">
              3. 再次展开场景二下拉 —— 自动滚动，选项7出现在顶部
            </template>
          </el-step>
        </el-steps>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'SelectTest',
  data() {
    return {
      value1: '',
      value2: '',
      longOptions: [
        { value: 'option1', label: '选项1' },
        { value: 'option2', label: '选项2' },
        { value: 'option3', label: '选项3' },
        { value: 'option4', label: '选项4' },
        { value: 'option5', label: '选项5' },
        { value: 'option6', label: '选项6' },
        { value: 'option7', label: '选项7 - 选择此项测试' },
        { value: 'option8', label: '选项8' },
        { value: 'option9', label: '选项9' },
        { value: 'option10', label: '选项10' },
        { value: 'option11', label: '选项11' },
        { value: 'option12', label: '选项12' },
        { value: 'option13', label: '选项13' },
        { value: 'option14', label: '选项14' },
        { value: 'option15', label: '选项15' },
        { value: 'option16', label: '选项16' },
        { value: 'option17', label: '选项17' },
        { value: 'option18', label: '选项18' },
        { value: 'option19', label: '选项19' },
        { value: 'option20', label: '选项20' },
      ],
    };
  },
  methods: {
    /**
     * 获取选中项在 options 数组中的索引
     */
    getSelectedIndex(value) {
      return this.longOptions.findIndex((item) => item.value === value);
    },

    /**
     * 方案B：精确计算 scrollTop，选中项置顶
     */
    handleVisibleB(visible) {
      if (!visible || !this.value2) return;

      setTimeout(() => {
        const popper = document.querySelector('.popper-b');
        if (!popper) return;

        const scrollWrap = popper.querySelector('.el-scrollbar__wrap');
        if (!scrollWrap) return;

        const selectedItem = popper.querySelector('.el-select-dropdown__item.selected');
        if (!selectedItem) return;

        const itemHeight = selectedItem.offsetHeight;
        const selectedIndex = this.getSelectedIndex(this.value2);

        if (selectedIndex !== -1) {
          scrollWrap.scrollTop = selectedIndex * itemHeight;
        }
      }, 50);
    },
  },
};
</script>

<style scoped>
.select-test-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 100vh;
  padding: 40px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.test-card {
  width: 780px;
  max-width: 100%;
  border-radius: 12px;
}

.card-header {
  font-size: 22px;
  font-weight: 600;
  color: #303133;
  padding: 8px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.card-header i {
  font-size: 24px;
  color: #409eff;
}

.section {
  margin-bottom: 28px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 6px;
}

.section-desc {
  font-size: 13px;
  color: #909399;
  margin-bottom: 12px;
  line-height: 1.6;
}

.demo-row {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 16px;
  background: #f5f7fa;
  border-radius: 8px;
  flex-wrap: wrap;
}

.label {
  font-size: 14px;
  font-weight: 500;
  color: #606266;
  white-space: nowrap;
}

.result {
  font-size: 13px;
  color: #409eff;
  font-weight: 500;
  margin-left: auto;
}
</style>
