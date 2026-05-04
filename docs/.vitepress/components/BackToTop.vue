<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const isVisible = ref(false)
const scrollProgress = ref(0)

const RADIUS = 21
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

const strokeDashoffset = computed(() => CIRCUMFERENCE * (1 - scrollProgress.value / 100))

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const handleScroll = () => {
  window.requestAnimationFrame(() => {
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
      :aria-label="`Back to top (${Math.round(scrollProgress)}%)`"
      @click="scrollToTop"
    >
      <!-- Progress ring -->
      <svg class="progress-ring" width="48" height="48" viewBox="0 0 48 48" aria-hidden="true">
        <circle
          class="progress-ring__track"
          cx="24"
          cy="24"
          :r="RADIUS"
          fill="none"
          stroke-width="3"
        />
        <circle
          class="progress-ring__arc"
          cx="24"
          cy="24"
          :r="RADIUS"
          fill="none"
          stroke-width="3"
          stroke-linecap="round"
          :stroke-dasharray="CIRCUMFERENCE"
          :stroke-dashoffset="strokeDashoffset"
        />
      </svg>
      <!-- Up arrow -->
      <svg
        class="arrow-icon"
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
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
  background: rgb(255 255 255 / 70%);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: none;
  color: var(--lg-text-secondary);
  cursor: pointer;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  transition:
    opacity 0.25s ease,
    transform 0.25s ease;
  overflow: visible;
  box-shadow: 0 4px 20px rgb(0 0 0 / 8%);
}

.dark .back-to-top {
  background: rgb(255 255 255 / 7%);
  color: var(--lg-text-secondary);
  box-shadow: 0 4px 20px rgb(0 0 0 / 30%);
}

.back-to-top:hover {
  opacity: 0.85;
  transform: translateY(-3px);
  box-shadow: 0 8px 28px rgb(0 0 0 / 12%);
}

.dark .back-to-top:hover {
  box-shadow: 0 8px 28px rgb(0 0 0 / 40%);
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
  stroke: rgba(0, 0, 0, 0.14);
}

.dark .progress-ring__track {
  stroke: rgba(255, 255, 255, 0.18);
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
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
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
