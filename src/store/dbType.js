import Vue from 'vue';

/**
 * 轻量级全局共享状态（不依赖 Vuex）
 * 使用 Vue.observable 让普通对象变为响应式，
 * 任意组件修改 dbType，其他组件都能实时感知。
 *
 * dbType 取值约定：
 *   1 = 当前查询
 *   2 = 历史查询
 */
export const dbTypeStore = Vue.observable({
  dbType: 1
});

export function setDbType(value) {
  dbTypeStore.dbType = value;
}
