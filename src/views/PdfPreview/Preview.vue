<template>
  <el-card class="preview-card" shadow="hover">
    <div slot="header" class="card-header">
      <i class="el-icon-document"></i>
      <span>PDF 预览</span>
    </div>

    <!-- 工具栏：返回 / 上一页 / 下一页 / 页码 / 缩放 -->
    <div class="toolbar">
      <el-button size="small" icon="el-icon-back" @click="$emit('back')">
        返回
      </el-button>

      <el-button-group>
        <el-button
          size="small"
          icon="el-icon-arrow-left"
          :disabled="currentPage <= 1 || loading"
          @click="prevPage"
        >
          上一页
        </el-button>
        <el-button
          size="small"
          :disabled="currentPage >= totalPages || loading"
          @click="nextPage"
        >
          下一页<i class="el-icon-arrow-right el-icon--right"></i>
        </el-button>
      </el-button-group>

      <div class="page-nav">
        <el-input
          v-model="pageInput"
          size="small"
          class="page-input"
          @keyup.enter.native="goToPage"
        ></el-input>
        <span class="page-total">/ {{ totalPages }}</span>
      </div>

      <el-button
        size="small"
        :icon="fitMode === 'page' ? 'el-icon-full-screen' : 'el-icon-s-unfold'"
        @click="toggleFit"
      >
        {{ fitMode === 'page' ? '适应页面' : '适应宽度' }}
      </el-button>

      <div class="zoom">
        <el-button size="small" icon="el-icon-minus" @click="zoomOut"></el-button>
        <el-input
          v-model="scaleText"
          size="small"
          class="zoom-input"
          @keyup.enter.native="applyScaleInput"
          @blur="applyScaleInput"
        ></el-input>
        <span class="zoom-percent">%</span>
        <el-button size="small" icon="el-icon-plus" @click="zoomIn"></el-button>
      </div>
    </div>

    <!-- 画布区 -->
    <div ref="canvasWrap" class="canvas-wrap" v-loading="loading">
      <canvas ref="canvas"></canvas>
    </div>

    <el-alert
      v-if="errorMsg"
      class="error"
      :title="errorMsg"
      type="error"
      :closable="false"
      show-icon
    />
  </el-card>
</template>

<script>
import * as pdfjsLib from 'pdfjs-dist';

// 通过 webpack 将 worker 作为静态资源打包并设置其地址
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url
).toString();

export default {
  name: 'PdfPreviewView',
  props: {
    // 支持 File / Blob / 本地文件对象 / URL 字符串
    source: {
      required: true
    }
  },
  data() {
    return {
      pdfDoc: null,
      currentPage: 1,
      totalPages: 0,
      scale: 1.2,
      currentScale: 1.2, // 当前实际渲染的缩放比例（用于显示 / 精确调整）
      scaleText: '120', // 缩放百分比输入值
      fitMode: 'width', // width = 适应宽度，page = 适应页面，null = 手动缩放
      pageInput: '1', // 页码输入值
      loading: false,
      errorMsg: ''
    };
  },
  mounted() {
    this.initPdf();
  },
  methods: {
    initPdf() {
      this.loadDocument(this.source);
    },
    async loadDocument(source) {
      this.loading = true;
      this.errorMsg = '';
      try {
        const loadingTask = await this.buildLoadingTask(source);
        this.pdfDoc = await loadingTask.promise;
        this.totalPages = this.pdfDoc.numPages;
        this.currentPage = 1;
        await this.renderPage(1);
      } catch (e) {
        console.error(e);
        this.errorMsg = 'PDF 加载失败：' + (e && e.message ? e.message : e);
      } finally {
        this.loading = false;
      }
    },
    async buildLoadingTask(source) {
      if (typeof source === 'string') {
        try {
          // 优先 fetch（自动跟随重定向），拿到二进制数据再解析
          const data = await this.fetchPdfData(source);
          return pdfjsLib.getDocument({ data });
        } catch (e) {
          // fetch 失败（跨域 / 网络不通）时，回退为让 pdf.js 直接按 URL 加载
          console.warn('fetch 加载失败，回退为 pdf.js 直接加载 URL：', e);
          return pdfjsLib.getDocument({ url: source });
        }
      }
      const data = await this.resolvePdfData(source);
      return pdfjsLib.getDocument({ data });
    },
    resolvePdfData(source) {
      if (source instanceof Blob) {
        // 本地文件（File 继承自 Blob）
        return source.arrayBuffer();
      }
      if (source instanceof ArrayBuffer || ArrayBuffer.isView(source)) {
        return Promise.resolve(source);
      }
      return Promise.reject(new Error('不支持的 PDF 数据源类型'));
    },
    async fetchPdfData(url) {
      let response;
      try {
        // redirect: 'follow' 显式跟随重定向（302 等）
        response = await fetch(url, { redirect: 'follow' });
      } catch (e) {
        throw new Error(
          '网络请求失败（请确认地址可访问，若跨域请查看控制台 CORS 报错）：' +
            (e && e.message ? e.message : e)
        );
      }
      if (!response.ok) {
        throw new Error(`请求失败：HTTP ${response.status}`);
      }
      return response.arrayBuffer();
    },
    async renderPage(num) {
      if (!this.pdfDoc) return;
      this.loading = true;
      try {
        const page = await this.pdfDoc.getPage(num);
        const scale = this.resolveScale(page);
        const viewport = page.getViewport({ scale });
        const canvas = this.$refs.canvas;
        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;
        canvas.width = Math.floor(viewport.width * dpr);
        canvas.height = Math.floor(viewport.height * dpr);
        canvas.style.width = viewport.width + 'px';
        canvas.style.height = viewport.height + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        await page.render({ canvasContext: ctx, viewport }).promise;
        this.currentPage = num;
        this.currentScale = scale;
        this.scaleText = String(Math.round(scale * 100));
        this.pageInput = String(num);
      } catch (e) {
        console.error(e);
        this.errorMsg = '页面渲染失败：' + (e && e.message ? e.message : e);
      } finally {
        this.loading = false;
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.renderPage(this.currentPage - 1);
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.renderPage(this.currentPage + 1);
      }
    },
    zoomIn() {
      this.fitMode = null;
      this.scale = Math.min(4, this.currentScale + 0.2);
      this.renderPage(this.currentPage);
    },
    zoomOut() {
      this.fitMode = null;
      this.scale = Math.max(0.1, this.currentScale - 0.2);
      this.renderPage(this.currentPage);
    },
    goToPage() {
      if (!this.pdfDoc || this.totalPages <= 0) {
        this.pageInput = String(this.currentPage);
        return;
      }
      const val = parseInt(this.pageInput, 10);
      if (isNaN(val)) {
        this.pageInput = String(this.currentPage);
        return;
      }
      const page = Math.min(this.totalPages, Math.max(1, val));
      this.renderPage(page);
    },
    applyScaleInput() {
      const val = parseFloat(this.scaleText);
      if (isNaN(val) || val <= 0) {
        this.scaleText = String(Math.round(this.currentScale * 100));
        return;
      }
      const newScale = Math.min(4, Math.max(0.1, val / 100));
      this.fitMode = null;
      this.scale = newScale;
      this.renderPage(this.currentPage);
    },
    toggleFit() {
      this.fitMode = this.fitMode === 'page' ? 'width' : 'page';
      this.renderPage(this.currentPage);
    },
    resolveScale(page) {
      if (this.fitMode === 'width' || this.fitMode === 'page') {
        return this.calcFitScale(page);
      }
      return this.scale;
    },
    calcFitScale(page) {
      const base = page.getViewport({ scale: 1 });
      const pageWidth = base.width;
      const pageHeight = base.height;
      const wrap = this.$refs.canvasWrap;
      if (!wrap) return this.scale;

      const cs = window.getComputedStyle(wrap);
      const paddingX =
        (parseFloat(cs.paddingLeft) || 0) + (parseFloat(cs.paddingRight) || 0);
      const paddingY =
        (parseFloat(cs.paddingTop) || 0) + (parseFloat(cs.paddingBottom) || 0);
      // 垂直滚动条占用的宽度（offsetWidth 含边框与滚动条，clientWidth 含 padding 不含滚动条）
      const scrollbarWidth =
        wrap.offsetWidth -
        wrap.clientWidth -
        (parseFloat(cs.borderLeftWidth) || 0) -
        (parseFloat(cs.borderRightWidth) || 0);

      const containerWidth = wrap.clientWidth - paddingX - scrollbarWidth;
      const containerHeight = wrap.clientHeight - paddingY;

      if (containerWidth <= 0) return this.scale;
      if (this.fitMode === 'width') {
        // 预留 1px 余量，避免浮点误差导致出现横向滚动条
        return (containerWidth - 1) / pageWidth;
      }
      // 适应页面：宽高都完整显示
      const fit = Math.min(
        containerWidth / pageWidth,
        containerHeight / pageHeight
      );
      return fit || this.scale;
    }
  },
  beforeDestroy() {
    if (this.pdfDoc) {
      this.pdfDoc.destroy();
      this.pdfDoc = null;
    }
  }
};
</script>

<style scoped>
.preview-card {
  max-width: 960px;
  margin: 0 auto;
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

.toolbar {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.page-nav {
  display: flex;
  align-items: center;
  gap: 6px;
}

.page-input {
  width: 60px;
}

.page-total {
  font-size: 14px;
  color: #606266;
}

.zoom {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
}

.zoom-input {
  width: 64px;
}

.zoom-percent {
  font-size: 13px;
  color: #606266;
}

.canvas-wrap {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  height: calc(100vh - 300px);
  min-height: 300px;
  padding: 16px;
  background: #f5f7fa;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  overflow: auto;
}

.canvas-wrap canvas {
  flex-shrink: 0;
  max-width: 100%;
  background: #fff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
}

.error {
  margin-top: 16px;
}
</style>
