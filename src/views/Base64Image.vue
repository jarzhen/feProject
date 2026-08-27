<template>
  <div class="base64-container">
    <el-card shadow="hover" class="base64-card">
      <div class="card-header">
        <i class="el-icon-picture"></i>
        <span>图片 Base64 编码转换与预览</span>
      </div>

      <!-- 上传图片转 base64 -->
      <div class="section">
        <h3 class="section-title">一、上传图片 → Base64</h3>
        <el-upload
          class="upload-area"
          drag
          action="#"
          :auto-upload="false"
          :show-file-list="false"
          accept="image/*"
          :on-change="handleFileChange"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将图片拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip" slot="tip">支持 jpg / png / gif / webp 等常见图片格式</div>
        </el-upload>

        <div v-if="uploadPreview" class="preview-row">
          <el-image
            class="preview-img"
            :src="uploadPreview"
            fit="contain"
            :preview-src-list="[uploadPreview]"
          />
          <div class="preview-info">
            <div class="info-line">
              <span class="info-label">文件名：</span>
              <span>{{ fileName }}</span>
            </div>
            <div class="info-line">
              <span class="info-label">文件大小：</span>
              <span>{{ fileSize }}</span>
            </div>
            <div class="info-line">
              <span class="info-label">Base64 长度：</span>
              <span>{{ base64Output.length }} 字符</span>
            </div>
          </div>
        </div>

        <div v-if="base64Output" class="textarea-row">
          <div class="textarea-header">
            <span>Base64 编码结果（可复制）</span>
            <el-button size="mini" type="primary" icon="el-icon-document-copy" @click="copyBase64">
              复制
            </el-button>
          </div>
          <el-input
            v-model="base64Output"
            type="textarea"
            :rows="4"
            readonly
          />
        </div>
      </div>

      <el-divider />

      <!-- 输入 base64 预览图片 -->
      <div class="section">
        <h3 class="section-title">二、输入 Base64 → 预览图片</h3>
        <div class="input-row">
          <el-input
            v-model="base64Input"
            type="textarea"
            :rows="5"
            placeholder="在此粘贴 Base64 编码（可带 data:image/xxx;base64, 前缀，也可不带）"
          />
        </div>
        <div class="btn-row">
          <el-button type="primary" icon="el-icon-view" @click="previewBase64">
            预览图片
          </el-button>
          <el-button icon="el-icon-refresh" @click="clearInput">清空</el-button>
        </div>

        <el-alert
          v-if="previewError"
          class="error-alert"
          type="error"
          :closable="false"
          show-icon
          :title="previewError"
        />

        <div v-if="decodePreview" class="preview-row">
          <el-image
            class="preview-img"
            :src="decodePreview"
            fit="contain"
            :preview-src-list="[decodePreview]"
          />
          <div class="preview-info">
            <div class="info-line">
              <span class="info-label">图片类型：</span>
              <span>{{ decodeType }}</span>
            </div>
            <div class="info-line">
              <span class="info-label">状态：</span>
              <span class="success-text">解码成功</span>
            </div>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Base64Image',
  data() {
    return {
      fileName: '',
      fileSize: '',
      uploadPreview: '',
      base64Output: '',
      base64Input: '',
      decodePreview: '',
      decodeType: '',
      previewError: '',
    };
  },
  methods: {
    /**
     * 上传图片，使用 FileReader 转换为 base64
     */
    handleFileChange(file) {
      const raw = file.raw;
      if (!raw) return;

      if (!raw.type.startsWith('image/')) {
        this.$message.warning('请选择图片文件');
        return;
      }

      this.fileName = raw.name;
      this.fileSize = this.formatFileSize(raw.size);

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target.result; // 形如 data:image/png;base64,xxx
        this.uploadPreview = result;
        this.base64Output = result;
        // 同步到下方输入框，方便双向测试
        this.base64Input = result;
        this.$message.success('转换成功');
      };
      reader.readAsDataURL(raw);
    },

    formatFileSize(bytes) {
      if (bytes === 0) return '0 B';
      const k = 1024;
      const sizes = ['B', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },

    /**
     * 预览输入的 base64
     */
    previewBase64() {
      this.previewError = '';
      this.decodePreview = '';

      let input = this.base64Input.trim();
      if (!input) {
        this.previewError = '请输入 Base64 编码内容';
        return;
      }

      // 去掉可能存在的 data:image/...;base64, 前缀
      let dataUrl = input;
      const match = input.match(/^data:([^;]+);base64,(.*)$/);
      if (match) {
        this.decodeType = match[1];
        dataUrl = input;
      } else {
        // 尝试自动识别图片类型
        const type = this.detectImageType(input);
        if (!type) {
          this.previewError = '无法识别的 Base64 编码，请检查内容是否为图片';
          return;
        }
        this.decodeType = type;
        dataUrl = `data:${type};base64,${input}`;
      }

      // 校验 base64 合法性
      if (!this.isValidBase64(match ? match[2] : input)) {
        this.previewError = 'Base64 编码格式不正确';
        return;
      }

      // 通过 Image 对象验证是否能正常解码
      const img = new Image();
      img.onload = () => {
        this.decodePreview = dataUrl;
      };
      img.onerror = () => {
        this.previewError = 'Base64 解码失败，无法生成图片';
      };
      img.src = dataUrl;
    },

    /**
     * 通过 base64 头字节自动识别图片类型
     */
    detectImageType(base64) {
      const str = base64.replace(/\s+/g, '');
      const map = [
        { type: 'image/png',  sig: 'iVBORw0KGgo' },
        { type: 'image/jpeg', sig: '/9j/' },
        { type: 'image/gif',  sig: 'R0lGOD' },
        { type: 'image/webp', sig: 'UklGR' },
        { type: 'image/bmp',  sig: 'Qk' },
        { type: 'image/svg+xml', sig: 'PHN2Zy' },
      ];
      for (const item of map) {
        if (str.startsWith(item.sig)) {
          return item.type;
        }
      }
      return '';
    },

    /**
     * 校验 base64 字符串合法性
     */
    isValidBase64(str) {
      const cleaned = str.replace(/\s+/g, '');
      if (cleaned.length === 0 || cleaned.length % 4 === 1) return false;
      return /^[A-Za-z0-9+/]*={0,2}$/.test(cleaned);
    },

    /**
     * 复制 base64 结果
     */
    copyBase64() {
      if (!this.base64Output) return;
      navigator.clipboard.writeText(this.base64Output).then(() => {
        this.$message.success('已复制到剪贴板');
      }).catch(() => {
        // 降级方案
        const textarea = document.createElement('textarea');
        textarea.value = this.base64Output;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        this.$message.success('已复制到剪贴板');
      });
    },

    clearInput() {
      this.base64Input = '';
      this.decodePreview = '';
      this.decodeType = '';
      this.previewError = '';
    },
  },
};
</script>

<style scoped>
.base64-container {
  display: flex;
  justify-content: center;
  min-height: 100vh;
  padding: 40px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.base64-card {
  width: 800px;
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

.section {
  margin-bottom: 8px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 16px;
}

.upload-area {
  margin-bottom: 16px;
}

.preview-row {
  display: flex;
  gap: 20px;
  align-items: flex-start;
  margin-top: 16px;
  padding: 16px;
  background: #f5f7fa;
  border-radius: 8px;
}

.preview-img {
  width: 200px;
  height: 200px;
  flex-shrink: 0;
  background: #fff;
  border: 1px dashed #dcdfe6;
  border-radius: 4px;
}

.preview-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-line {
  font-size: 14px;
  color: #606266;
}

.info-label {
  color: #909399;
}

.success-text {
  color: #67c23a;
}

.textarea-row {
  margin-top: 16px;
}

.textarea-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  font-size: 14px;
  color: #606266;
}

.input-row {
  margin-bottom: 12px;
}

.btn-row {
  display: flex;
  gap: 12px;
}

.error-alert {
  margin-top: 12px;
}
</style>
