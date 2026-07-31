<template>
  <div class="pdf-container">
    <el-card class="pdf-card" shadow="hover">
      <div class="card-header">
        <i class="el-icon-document"></i>
        <span>PDF 文件打印 / 下载</span>
      </div>
      <div class="card-body">
        <div class="input-row">
          <el-input
            v-model="filePath"
            placeholder="请选择本地 PDF 文件"
            readonly
            clearable
            class="file-input"
          >
            <template slot="prepend">文件路径</template>
          </el-input>
          <el-button
            type="primary"
            icon="el-icon-folder-opened"
            @click="selectFile"
            class="select-btn"
          >
            选择文件
          </el-button>
        </div>

        <input
          ref="fileInput"
          type="file"
          accept=".pdf"
          style="display: none"
          @change="handleFileChange"
        />

        <div class="action-row">
          <el-button
            type="success"
            icon="el-icon-printer"
            :disabled="!fileBlob"
            @click="handlePrint(3)"
            :loading="printing"
          >
            {{ printing ? '处理中...' : '打印文件' }}
          </el-button>
          <el-button
            type="warning"
            icon="el-icon-download"
            :disabled="!fileBlob"
            @click="startBatchDownload(3)"
            :loading="downloading"
          >
            {{ downloading ? '下载中...' : '下载文件(3次)' }}
          </el-button>
          <span v-if="fileBlob" class="file-info">
            已选择: {{ fileName }} ({{ fileSize }})
          </span>
        </div>

        <el-alert
          v-if="message"
          :title="message"
          :type="messageType"
          :closable="false"
          show-icon
          class="alert"
        />
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data() {
    return {
      filePath: '',
      fileBlob: null,
      fileName: '',
      fileSize: '',
      printing: false,
      downloading: false,
      message: '',
      messageType: 'info',
      // 降级下载弹窗
      fallbackDownloadDialogVisible: false,
      fallbackDownloadFileName: '',
      fallbackDownloadResolve: null
    };
  },
  methods: {
    selectFile() {
      this.$refs.fileInput.click();
    },
    handleFileChange(e) {
      const file = e.target.files[0];
      if (!file) return;

      if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
        this.message = '请选择有效的 PDF 文件';
        this.messageType = 'warning';
        return;
      }

      this.fileName = file.name;
      this.fileSize = this.formatFileSize(file.size);
      this.fileBlob = file;
      this.filePath = file.name;
      this.message = '';
      // 重置 input 以便重复选择同一文件
      e.target.value = '';
    },
    formatFileSize(bytes) {
      if (bytes === 0) return '0 B';
      const k = 1024;
      const sizes = ['B', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },
    async sleep(ms) {
      return new Promise((resolve) => {
          setTimeout(resolve, ms);
      });
    },
    // ========== 打印：点击后循环3次，每次弹窗确认，确定弹出系统打印对话框，取消则退出 ==========
    async handlePrint(count = 3) {
      if (!this.fileBlob) return;

      this.printing = true;
      this.message = '';
      for (let i = 0; i < count; i++) {
        // 每次循环弹出确认框
        try {
          await this.$confirm(
            `即将进行第 ${i + 1}/${count} 次打印操作，是否继续？`,
            '确认打印',
            { confirmButtonText: '确定', cancelButtonText: '取消', type: 'info' }
          );
        } catch (e) {
          // 用户点击取消，退出循环
          this.message = `已取消，共完成 ${i} 次打印`;
          this.messageType = 'info';
          this.printing = false;
          return;
        }
        // 用户确认，弹出系统级打印对话框
        await this.openPrintDialog(this.fileBlob);
      }
      this.message = `${count} 次打印操作全部完成`;
      this.messageType = 'success';
      this.printing = false;
    },

    // 打开系统级打印对话框（通过 iframe 加载 PDF 后调用 window.print()）
    async openPrintDialog(blob) {
        const url = URL.createObjectURL(blob);
        const iframe = document.createElement('iframe');
        // 隐藏 iframe，但给足够大的宽度让超宽 PDF 完整渲染
        iframe.style.cssText = 'position:fixed;top:0;left:0;width:3000px;height:100vh;border:none;z-index:-1;opacity:0;';
        iframe.src = url;
        document.body.appendChild(iframe);
        const cleanup = () => {
          iframe.contentWindow && iframe.contentWindow.removeEventListener('afterprint', onAfterPrint);
          window.removeEventListener('afterprint', onAfterPrint);
          setTimeout(() => {
            try {
              if (iframe.parentNode) {
                document.body.removeChild(iframe);
              }
            } catch (e) {
              // 忽略移除失败
            }
            URL.revokeObjectURL(url);
          }, 300);
        };

        const onAfterPrint = () => {
          cleanup();
        };

        iframe.onload = () => {
          // 向 iframe 注入样式：屏幕渲染保持原始宽度不压缩，打印时也不缩放
          try {
            const style = iframe.contentDocument.createElement('style');
            style.textContent = `
              html, body {
                width: 100% !important;
                margin: 0 !important;
                padding: 0 !important;
              }
              embed {
                width: 100% !important;
                height: 100vh !important;
              }
              @media print {
                html, body {
                  width: auto !important;
                  min-width: 100% !important;
                  margin: 0 !important;
                  padding: 0 !important;
                  overflow: visible !important;
                }
                embed {
                  width: auto !important;
                  min-width: 100% !important;
                  height: auto !important;
                }
              }
            `;
            iframe.contentDocument.head.appendChild(style);
          } catch (e) {
            // 跨域无法操作 iframe 内容
          }

          // 检测 embed 实际宽度，动态扩大 iframe 宽度确保 PDF 完整渲染
          setTimeout(() => {
            try {
              const embed = iframe.contentDocument.querySelector('embed');
              if (embed) {
                const realWidth = embed.scrollWidth || embed.offsetWidth;
                if (realWidth > 3000) {
                  iframe.style.width = (realWidth + 40) + 'px';
                }
              }
            } catch (e) {
              // 忽略
            }
          }, 800);

          // 延迟确保 PDF 完全渲染后直接弹出系统打印对话框
          setTimeout(() => {
            iframe.contentWindow.addEventListener('afterprint', onAfterPrint);
            window.addEventListener('afterprint', onAfterPrint);
            try {
              iframe.contentWindow.focus();
              iframe.contentWindow.print();
            } catch (err) {
              window.print();
            }
          }, 500);
        };
        await this.sleep(800);
    },

    // 触发浏览器文件保存对话框
    async triggerFileDownload(blob, fileName) {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      await this.sleep(3000);
    },

    // ========== 下载：点击后循环3次，每次弹窗确认，确定弹出文件保存对话框，取消则退出 ==========
    async startBatchDownload(count = 3) {
      if (!this.fileBlob) return;

      this.downloading = true;
      this.message = '';

      for (let i = 0; i < count; i++) {
        try {
          await this.$confirm(
            `即将进行第 ${i + 1}/${count} 次文件下载操作，是否继续？`,
            '确认下载文件',
            { confirmButtonText: '确定', cancelButtonText: '取消', type: 'info' }
          );
        } catch (e) {
          this.message = `已取消，共完成 ${i} 次下载`;
          this.messageType = 'info';
          this.downloading = false;
          return;
        }
        await this.triggerFileDownload(this.fileBlob, this.fileName);
      }

      this.message = `${count} 次文件下载全部完成`;
      this.messageType = 'success';
      this.downloading = false;
    },
  }
};
</script>

<style scoped>
.pdf-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.pdf-card {
  width: 600px;
  border-radius: 12px;
}

.card-header {
  font-size: 20px;
  font-weight: 600;
  color: #303133;
  padding: 8px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.card-header i {
  font-size: 22px;
  color: #e6a23c;
}

.card-body {
  padding: 20px 0 0;
}

.input-row {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.file-input {
  flex: 1;
}

.select-btn {
  white-space: nowrap;
}

.action-row {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 12px;
}

.file-info {
  font-size: 13px;
  color: #909399;
}

.alert {
  margin-top: 16px;
}

/* 下载对话框样式 */
.download-dialog-content {
  text-align: center;
}

.dialog-tip {
  font-size: 14px;
  color: #606266;
  margin-bottom: 20px;
}

.filename-input {
  width: 100%;
}
</style>
