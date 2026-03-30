<script setup>
import { computed } from 'vue'
import { useData } from 'vitepress'

const { page } = useData()

const lastUpdated = computed(() => {
  const ts = page.value.lastUpdated
  if (!ts) return ''
  return new Date(ts).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
})
</script>

<template>
  <div v-if="lastUpdated" class="stats-container">
    <div class="stat-item">
      <span class="stat-label">Last updated</span>
      <span class="stat-value-small">{{ lastUpdated }}</span>
    </div>
  </div>
</template>

<style scoped>
.stats-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin: 32px auto;
  padding: 16px 28px;
  background: var(--lg-glass-bg, rgba(255, 255, 255, 0.38));
  backdrop-filter: blur(48px) saturate(160%);
  -webkit-backdrop-filter: blur(48px) saturate(160%);
  border: 1px solid var(--lg-glass-border, rgba(255, 255, 255, 0.45));
  border-radius: 999px;
  max-width: 500px;
  font-size: 0.9em;
  box-shadow: var(--lg-glass-shadow, 0 8px 32px rgba(0,0,0,0.06)),
              inset 0 1px 1px rgba(255,255,255,0.6);
  animation: lg-stats-in 0.6s ease-out;
}

@keyframes lg-stats-in {
  from {
    opacity: 0;
    transform: translateY(16px) scale(0.97);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.stat-value-small {
  font-size: 0.95em;
  font-weight: 600;
  color: var(--lg-accent, #7b8cff);
  line-height: 1;
}

.stat-label {
  font-size: 0.82em;
  color: var(--lg-text-secondary, rgba(0,0,0,0.55));
  font-weight: 500;
  letter-spacing: 0.02em;
}

@media (max-width: 768px) {
  .stats-container {
    font-size: 0.85em;
    gap: 12px;
    padding: 12px 20px;
  }
}
</style>
