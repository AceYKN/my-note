import { ref, watch, onMounted, onUnmounted } from 'vue'

export function useScrollHideNav(threshold = 80) {
  const navHidden = ref(false)
  let lastScrollY = 0
  let ticking = false

  function onScroll() {
    if (ticking) return
    ticking = true
    requestAnimationFrame(() => {
      const currentY = window.scrollY
      navHidden.value = currentY > lastScrollY && currentY > threshold
      lastScrollY = currentY
      ticking = false
    })
  }

  // Sync reactive state to VitePress internal DOM elements
  watch(navHidden, (hidden) => {
    const nav = document.querySelector('.VPNav')
    const localNav = document.querySelector('.VPLocalNav')
    nav?.classList.toggle('nav-hidden', hidden)
    localNav?.classList.toggle('local-nav-hidden', hidden)
  })

  onMounted(() => {
    window.addEventListener('scroll', onScroll, { passive: true })
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', onScroll)
  })

  return { navHidden }
}
