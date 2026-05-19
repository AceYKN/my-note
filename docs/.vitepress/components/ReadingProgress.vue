<script setup>
import { useScrollProgress } from '../composables/useScrollProgress.js'

const { scrollProgress } = useScrollProgress()
</script>

<template>
  <div class="reading-progress-bar" :style="{ width: scrollProgress + '%' }"></div>
</template>

<style scoped>
.reading-progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  height: 2px;
  background: linear-gradient(
    90deg,
    var(--lg-iridescent-1),
    var(--lg-iridescent-3),
    var(--lg-iridescent-2),
    var(--lg-iridescent-5)
  );
  background-size: 300% 100%;
  animation: lg-shimmer 4s ease-in-out infinite;
  z-index: 1000;
  transition: width 0.1s ease-out;
  box-shadow: 0 0 12px var(--lg-accent-glow);
}
</style>
