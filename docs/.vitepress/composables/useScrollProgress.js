import { ref, onMounted, onUnmounted } from 'vue'

/**
 * Tracks scroll progress (0–100) and absolute scrollY.
 * Guards against height === 0 (short pages) to avoid NaN.
 */
export function useScrollProgress() {
  const scrollY = ref(0)
  const scrollProgress = ref(0)
  let ticking = false

  function onScroll() {
    if (!ticking) {
      ticking = true
      requestAnimationFrame(() => {
        const winScroll = document.documentElement.scrollTop || document.body.scrollTop
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight
        scrollY.value = winScroll
        scrollProgress.value = height > 0 ? (winScroll / height) * 100 : 0
        ticking = false
      })
    }
  }

  onMounted(() => {
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', onScroll)
  })

  return { scrollY, scrollProgress }
}
