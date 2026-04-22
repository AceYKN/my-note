<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const isVisible = ref(false)
const scrollProgress = ref(0)

const RADIUS = 21
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

const strokeDashoffset = computed(() =>
  CIRCUMFERENCE * (1 - scrollProgress.value / 100)
)

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const handleScroll = () => {
  requestAnimationFrame(() => {
    const winScroll = document.documentElement.scrollTop || document.body.scrollTop
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight
    isVisible.value = winScroll > 300
    scrollProgress.value = height > 0 ? (winScroll / height) * 100 : 0
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
      :aria-label="`Back to top (${Math.round(scrollProgress)}%)`"
    >
      <!-- Progress ring -->
      <svg
        class="progress-ring"
        width="54"
        height="54"
        viewBox="0 0 54 54"
        aria-hidden="true"
      >
        <circle
          class="progress-ring__track"
          cx="27" cy="27" :r="RADIUS"
          fill="none"
          stroke-width="2.5"
        />
        <circle
          class="progress-ring__arc"
          cx="27" cy="27" :r="RADIUS"
          fill="none"
          stroke-width="2.5"
          stroke-linecap="round"
          :stroke-dasharray="CIRCUMFERENCE"
          :stroke-dashoffset="strokeDashoffset"
        />
      </svg>
      <!-- Up arrow -->
      <svg
        class="arrow-icon"
        xmlns="http://www.w3.org/2000/svg"
        width="18" height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
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
  /* SVG ring needs overflow visible */
  overflow: visible;
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

/* Progress ring — absolutely positioned, centered over button */
.progress-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(-90deg);
  pointer-events: none;
}

.progress-ring__track {
  stroke: rgba(0, 0, 0, 0.08);
}

.dark .progress-ring__track {
  stroke: rgba(255, 255, 255, 0.08);
}

.progress-ring__arc {
  stroke: var(--lg-iridescent-2, #f2a7bb); /* 桜色 light */
  transition: stroke-dashoffset 0.12s ease-out;
}

.dark .progress-ring__arc {
  stroke: var(--lg-accent, #f2a7bb); /* 桜色 dark (already overridden to sakura) */
}

.arrow-icon {
  position: relative;
  z-index: 1;
  transition: transform 0.3s ease;
}

.back-to-top:hover .arrow-icon {
  transform: translateY(-2px);
}

/* Appear/leave transition */
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
