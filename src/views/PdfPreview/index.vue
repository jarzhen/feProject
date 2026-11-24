<template>
  <div class="pdf-preview-page">
    <!-- 文件选取视图 -->
    <el-card v-if="currentView === 'select'" class="select-card" shadow="hover">
      <div slot="header" class="card-header">
        <i class="el-icon-document"></i>
        <span>PDF 预览 - 文件选取</span>
      </div>

      <div class="select-body">
        <div class="row">
          <el-input
            v-model="fileName"
            placeholder="请选择本地 PDF 文件"
            readonly
            clearable
            class="file-input"
          >
            <template slot="prepend">本地文件</template>
          </el-input>
          <el-button
            type="primary"
            icon="el-icon-folder-opened"
            class="select-btn"
            @click="selectFile"
          >
            选择文件
          </el-button>
        </div>

        <el-divider>或</el-divider>

        <div class="row">
          <el-input
            v-model="fileUrl"
            placeholder="请输入后端 PDF 文件地址，如 http://xxx/api/file.pdf"
            clearable
            class="file-input"
          >
            <template slot="prepend">后端 URL</template>
          </el-input>
          <el-button
            type="success"
            icon="el-icon-view"
            class="select-btn"
            @click="previewUrl"
          >
            预览 URL
          </el-button>
        </div>

        <el-alert
          class="tip"
          title="选择本地 PDF 文件后将自动跳转到预览页面；后端地址需可跨域访问。"
          type="info"
          :closable="false"
          show-icon
        />
      </div>

      <!-- 隐藏的文件输入框 -->
      <input
        ref="fileInput"
        type="file"
        accept="application/pdf,.pdf"
        style="display: none"
        @change="handleFileChange"
      />
    </el-card>

    <!-- 预览视图 -->
    <Preview v-else :source="pdfSource" @back="backToSelect" />
  </div>
</template>

<script>
import Preview from './Preview.vue';

export default {
  name: 'PdfPreview',
  components: {
    Preview
  },
  data() {
    return {
      currentView: 'select', // select = 选取，preview = 预览
      fileName: '',
      // 默认值：pdf.js 官方示例文件，免费且支持跨域（CORS）
      fileUrl: 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf',
      pdfSource: null // File 对象 或 URL 字符串
    };
  },
  methods: {
    selectFile() {
      this.$refs.fileInput.click();
    },
    handleFileChange(e) {
      const file = e.target.files[0];
      if (!file) return;

      const isPdf =
        file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
      if (!isPdf) {
        this.$message.warning('请选择 PDF 文件');
        e.target.value = '';
        return;
      }

      this.fileName = file.name;
      this.pdfSource = file;
      this.currentView = 'preview';
      // 重置 input，便于再次选择同一文件
      e.target.value = '';
    },
    previewUrl() {
      const url = this.fileUrl.trim();
      if (!url) {
        this.$message.warning('请输入 PDF 文件地址');
        return;
      }
      this.pdfSource = url;
      this.currentView = 'preview';
    },
    backToSelect() {
      this.currentView = 'select';
      this.pdfSource = null;
    }
  }
};
</script>

<style scoped>
.pdf-preview-page {
  min-height: 100vh;
  padding: 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.select-card {
  max-width: 640px;
  margin: 40px auto 0;
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
  color: #e6a23c;
}

.select-body {
  padding: 8px 0 0;
}

.row {
  display: flex;
  gap: 12px;
}

.file-input {
  flex: 1;
}

.select-btn {
  white-space: nowrap;
}

.tip {
  margin-top: 16px;
}
</style>
