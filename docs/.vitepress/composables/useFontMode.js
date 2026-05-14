import { ref, watch } from 'vue'

const STORAGE_KEY = 'font-mode'
const DEFAULT_MODE = 'classic'

// 模块级单例：所有组件共享同一 ref
const mode = ref(DEFAULT_MODE)

// 仅在客户端初始化（SSR/SSG 构建时跳过）
if (typeof window !== 'undefined') {
  mode.value = localStorage.getItem(STORAGE_KEY) ?? DEFAULT_MODE
  document.documentElement.dataset.fontMode = mode.value

  watch(mode, (val) => {
    localStorage.setItem(STORAGE_KEY, val)
    document.documentElement.dataset.fontMode = val
  })

  // 跨 tab 同步：其他标签页修改 localStorage 时自动更新
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY && e.newValue) {
      mode.value = e.newValue
    }
  })
}

export function useFontMode() {
  return { mode }
}
