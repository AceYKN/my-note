<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const isVisible = ref(false)

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

const handleScroll = () => {
  requestAnimationFrame(() => {
    isVisible.value = window.scrollY > 300
  })
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  handleScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <Transition name="fade">
    <button
      v-if="isVisible"
      class="back-to-top"
      @click="scrollToTop"
      aria-label="Back to top"
      title="回到顶部"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="18 15 12 9 6 15"></polyline>
      </svg>
    </button>
  </Transition>
</template>

<style scoped>
.back-to-top {
  position: fixed;
  bottom: 40px;
  right: 40px;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--lg-glass-bg, rgba(255, 255, 255, 0.38));
  backdrop-filter: blur(24px) saturate(160%);
  -webkit-backdrop-filter: blur(24px) saturate(160%);
  color: var(--lg-accent, #2a5fa0);
  border: 1px solid var(--lg-glass-border, rgba(255, 255, 255, 0.45));
  cursor: pointer;
  box-shadow: var(--lg-glass-shadow, 0 8px 32px rgba(0, 0, 0, 0.06)),
              inset 0 1px 1px rgba(255, 255, 255, 0.6);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.back-to-top:hover {
  background: var(--lg-glass-bg-hover, rgba(255, 255, 255, 0.52));
  transform: translateY(-4px);
  box-shadow: var(--lg-glass-shadow-elevated, 0 16px 48px rgba(0, 0, 0, 0.1)),
              inset 0 1px 1px rgba(255, 255, 255, 0.6);
}

.back-to-top:active {
  transform: translateY(-2px);
}

.back-to-top svg {
  transition: transform 0.3s ease;
}

.back-to-top:hover svg {
  transform: translateY(-2px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.8);
}

@media (max-width: 768px) {
  .back-to-top {
    bottom: 20px;
    right: 20px;
    width: 44px;
    height: 44px;
  }
}
</style>
