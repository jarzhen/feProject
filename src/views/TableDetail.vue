<template>
  <div class="table-detail-container">
    <!-- 表格页面 -->
    <div v-if="currentView === 'table'" class="table-page">
      <el-card shadow="hover">
        <div class="card-header">
          <i class="el-icon-s-grid"></i>
          <span>数据列表</span>
        </div>

        <el-table
          ref="tableRef"
          :data="tableData"
          highlight-current-row
          @current-change="handleCurrentChange"
          style="width: 100%; margin-top: 16px;"
          max-height="400"
        >
          <el-table-column type="index" width="60" label="序号" />
          <el-table-column prop="name" label="姓名" width="120" />
          <el-table-column prop="age" label="年龄" width="80" />
          <el-table-column prop="city" label="城市" width="140" />
          <el-table-column prop="email" label="邮箱" min-width="200" />
          <el-table-column prop="phone" label="电话" width="160" />
          <el-table-column label="操作" width="100" fixed="right">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="handleViewDetail(scope.row)">
                查看明细
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>

    <!-- 明细页面 -->
    <div v-if="currentView === 'detail'" class="detail-page">
      <el-card shadow="hover">
        <div class="detail-header">
          <el-button type="primary" icon="el-icon-back" size="small" @click="handleBack">
            返回列表
          </el-button>
          <span class="detail-title">用户明细</span>
        </div>

        <el-descriptions :column="2" border style="margin-top: 20px;">
          <el-descriptions-item label="姓名">{{ currentRow.name }}</el-descriptions-item>
          <el-descriptions-item label="年龄">{{ currentRow.age }}</el-descriptions-item>
          <el-descriptions-item label="城市">{{ currentRow.city }}</el-descriptions-item>
          <el-descriptions-item label="邮箱">{{ currentRow.email }}</el-descriptions-item>
          <el-descriptions-item label="电话">{{ currentRow.phone }}</el-descriptions-item>
          <el-descriptions-item label="地址">{{ currentRow.address }}</el-descriptions-item>
          <el-descriptions-item label="部门">{{ currentRow.department }}</el-descriptions-item>
          <el-descriptions-item label="职位">{{ currentRow.position }}</el-descriptions-item>
          <el-descriptions-item label="入职日期">{{ currentRow.joinDate }}</el-descriptions-item>
          <el-descriptions-item label="备注" :span="2">{{ currentRow.remark }}</el-descriptions-item>
        </el-descriptions>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TableDetail',
  data() {
    return {
      currentView: 'table',     // 'table' | 'detail'
      currentRow: {},           // 当前选中的行数据
      savedScrollTop: 0,        // 保存的表格滚动位置
      savedRow: null,           // 保存的选中行数据
      tableData: [
        { id: 1,  name: '张三', age: 28, city: '北京', email: 'zhangsan@example.com',  phone: '13800001001', address: '北京市朝阳区', department: '技术部', position: '前端工程师', joinDate: '2020-03-15', remark: '技术骨干' },
        { id: 2,  name: '李四', age: 32, city: '上海', email: 'lisi@example.com',      phone: '13800001002', address: '上海市浦东新区', department: '产品部', position: '产品经理',   joinDate: '2019-07-01', remark: '产品负责人' },
        { id: 3,  name: '王五', age: 26, city: '广州', email: 'wangwu@example.com',    phone: '13800001003', address: '广州市天河区', department: '技术部', position: '后端工程师', joinDate: '2021-01-10', remark: 'Java 开发' },
        { id: 4,  name: '赵六', age: 35, city: '深圳', email: 'zhaoliu@example.com',   phone: '13800001004', address: '深圳市南山区', department: '设计部', position: 'UI 设计师',  joinDate: '2018-05-20', remark: '资深设计' },
        { id: 5,  name: '孙七', age: 29, city: '杭州', email: 'sunqi@example.com',     phone: '13800001005', address: '杭州市西湖区', department: '运营部', position: '运营总监',   joinDate: '2020-09-12', remark: '运营主管' },
        { id: 6,  name: '周八', age: 31, city: '成都', email: 'zhouba@example.com',    phone: '13800001006', address: '成都市高新区', department: '技术部', position: '测试工程师', joinDate: '2019-11-08', remark: '自动化测试' },
        { id: 7,  name: '吴九', age: 27, city: '武汉', email: 'wujiu@example.com',     phone: '13800001007', address: '武汉市洪山区', department: '市场部', position: '市场经理',   joinDate: '2021-04-22', remark: '市场推广' },
        { id: 8,  name: '郑十', age: 33, city: '南京', email: 'zhengshi@example.com',  phone: '13800001008', address: '南京市鼓楼区', department: '技术部', position: '架构师',     joinDate: '2017-08-15', remark: '系统架构' },
        { id: 9,  name: '冯十一', age: 25, city: '西安', email: 'feng@example.com',    phone: '13800001009', address: '西安市雁塔区', department: '人事部', position: 'HR',         joinDate: '2022-02-14', remark: '招聘专员' },
        { id: 10, name: '陈十二', age: 30, city: '长沙', email: 'chen@example.com',    phone: '13800001010', address: '长沙市岳麓区', department: '技术部', position: '前端工程师', joinDate: '2020-06-18', remark: 'React 开发' },
        { id: 11, name: '褚十三', age: 34, city: '郑州', email: 'chu@example.com',     phone: '13800001011', address: '郑州市金水区', department: '财务部', position: '财务主管',   joinDate: '2018-12-03', remark: '财务管理' },
        { id: 12, name: '卫十四', age: 28, city: '苏州', email: 'wei@example.com',     phone: '13800001012', address: '苏州市工业园区', department: '技术部', position: 'DevOps',  joinDate: '2021-07-25', remark: '运维开发' },
        { id: 13, name: '蒋十五', age: 36, city: '天津', email: 'jiang@example.com',   phone: '13800001013', address: '天津市和平区', department: '管理层', position: '技术总监',   joinDate: '2016-04-10', remark: '技术管理' },
        { id: 14, name: '沈十六', age: 26, city: '重庆', email: 'shen@example.com',    phone: '13800001014', address: '重庆市渝中区', department: '技术部', position: '前端工程师', joinDate: '2022-05-30', remark: 'Vue 开发' },
        { id: 15, name: '韩十七', age: 29, city: '青岛', email: 'han@example.com',     phone: '13800001015', address: '青岛市市南区', department: '销售部', position: '销售经理',   joinDate: '2020-10-08', remark: '大客户销售' },
        { id: 16, name: '杨十八', age: 31, city: '大连', email: 'yang@example.com',    phone: '13800001016', address: '大连市中山区', department: '技术部', position: '数据工程师', joinDate: '2019-03-22', remark: '数据分析' },
        { id: 17, name: '朱十九', age: 33, city: '厦门', email: 'zhu@example.com',     phone: '13800001017', address: '厦门市思明区', department: '产品部', position: '产品总监',   joinDate: '2017-11-16', remark: '产品规划' },
        { id: 18, name: '秦二十', age: 27, city: '合肥', email: 'qin@example.com',     phone: '13800001018', address: '合肥市蜀山区', department: '技术部', position: '移动端开发', joinDate: '2021-08-05', remark: 'Flutter 开发' },
        { id: 19, name: '许二一', age: 35, city: '济南', email: 'xu@example.com',      phone: '13800001019', address: '济南市历下区', department: '技术部', position: '安全工程师', joinDate: '2018-01-28', remark: '网络安全' },
        { id: 20, name: '何二二', age: 30, city: '福州', email: 'he@example.com',      phone: '13800001020', address: '福州市鼓楼区', department: '客服部', position: '客服经理',   joinDate: '2020-04-17', remark: '客户服务' },
      ],
    };
  },
  methods: {
    handleCurrentChange(row) {
      this.savedRow = row;
    },

    /**
     * 点击"查看明细"按钮，切换到明细页
     * 保存当前表格的滚动位置和选中行
     */
    handleViewDetail(row) {
      // 保存当前表格滚动位置
      const tableBody = this.$refs.tableRef.$el.querySelector('.el-table__body-wrapper');
      if (tableBody) {
        this.savedScrollTop = tableBody.scrollTop;
      }

      // 保存当前选中行
      this.savedRow = row;
      this.currentRow = row;

      // 切换到明细页
      this.currentView = 'detail';
    },

    /**
     * 点击"返回"按钮，切换回表格页
     * 恢复表格的选中行和滚动位置
     */
    handleBack() {
      this.currentView = 'table';

      this.$nextTick(() => {
        if (this.savedRow) {
          this.$refs.tableRef.setCurrentRow(this.savedRow);
        }

        this.$refs.tableRef.doLayout();

        // 轮询等待表格滚动条出现后再恢复位置
        this.waitForScrollbarAndRestore();
      });
    },

    /**
     * 等待表格 body-wrapper 出现滚动条后，再恢复滚动位置
     */
    waitForScrollbarAndRestore() {
      const maxAttempts = 20;
      let attempts = 0;

      const check = () => {
        const tableBody = this.$refs.tableRef.$el.querySelector('.el-table__body-wrapper');
        if (tableBody && tableBody.scrollHeight > tableBody.clientHeight) {
          // 滚动条已出现，恢复位置
          tableBody.scrollTop = this.savedScrollTop;
          return;
        }
        attempts++;
        if (attempts < maxAttempts) {
          requestAnimationFrame(check);
        }
      };

      this.$nextTick(check);
    },
  },
};
</script>

<style scoped>
.table-detail-container {
  display: flex;
  justify-content: center;
  min-height: 100vh;
  padding: 40px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.table-page,
.detail-page {
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

.detail-header {
  display: flex;
  align-items: center;
  gap: 16px;
}

.detail-title {
  font-size: 20px;
  font-weight: 600;
  color: #303133;
}
</style>
