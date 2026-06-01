import { ref, watch, onMounted } from 'vue'

const STORAGE_KEY = 'font-mode'
const DEFAULT_MODE = 'classic'

// 保持全局只有一个 ref
const mode = ref(DEFAULT_MODE)

if (typeof window !== 'undefined') {
  // 跨 tab 同步
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY && e.newValue) {
      mode.value = e.newValue
      document.documentElement.dataset.fontMode = e.newValue
    }
  })
}

export function useFontMode() {
  onMounted(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      mode.value = stored
    }

    // Mount 之后再去监听。因为 config.mjs 里 injected script 会处理首屏样式，这样防止 Hydration mismatch。
    watch(
      mode,
      (val) => {
        localStorage.setItem(STORAGE_KEY, val)
        document.documentElement.dataset.fontMode = val
      },
      { immediate: true }
    )
  })

  return { mode }
}
