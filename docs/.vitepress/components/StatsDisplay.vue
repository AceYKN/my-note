<script setup>
import { computed } from 'vue'

const season = computed(() => {
  const month = new Date().getMonth() + 1
  const year = new Date().getFullYear()
  if (month >= 3 && month <= 5)  return { kanji: '春', en: 'Spring', color: 'sakura', year }
  if (month >= 6 && month <= 8)  return { kanji: '夏', en: 'Summer', color: 'wakakusa', year }
  if (month >= 9 && month <= 11) return { kanji: '秋', en: 'Autumn', color: 'fuji', year }
  return { kanji: '冬', en: 'Winter', color: 'ai', year }
})

const greeting = computed(() => {
  const h = new Date().getHours()
  if (h >= 5 && h < 12)  return { text: 'おはよう', sub: 'Good morning' }
  if (h >= 12 && h < 18) return { text: 'こんにちは', sub: 'Good afternoon' }
  if (h >= 18 && h < 23) return { text: 'こんばんは', sub: 'Good evening' }
  return { text: 'おやすみ', sub: 'Good night' }
})
</script>

<template>
  <div class="stats-container">
    <div class="stat-item greeting-item">
      <span class="stat-greeting-text">{{ greeting.text }}</span>
      <span class="stat-greeting-sub">{{ greeting.sub }}</span>
    </div>
    <div class="stat-divider"></div>
    <div class="stat-item season-item" :class="`season-${season.color}`">
      <span class="stat-season-kanji">{{ season.kanji }}</span>
      <span class="stat-season-label">{{ season.en }} {{ season.year }}</span>
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

/* Greeting segment */
.stat-greeting-text {
  font-family: 'Noto Serif JP', 'Hiragino Mincho ProN', serif;
  font-size: 1.05em;
  font-weight: 700;
  line-height: 1;
  color: var(--lg-accent, #7b8cff);
}

.stat-greeting-sub {
  font-size: 0.75em;
  font-weight: 500;
  letter-spacing: 0.03em;
  opacity: 0.7;
  color: var(--lg-text-secondary, rgba(0,0,0,0.55));
}

/* Season segment */
.stat-season-kanji {
  font-family: 'Noto Serif JP', 'Hiragino Mincho ProN', serif;
  font-size: 1.15em;
  font-weight: 700;
  line-height: 1;
}

.stat-season-label {
  font-size: 0.78em;
  font-weight: 500;
  letter-spacing: 0.03em;
  opacity: 0.85;
}

.season-sakura  { color: #b85470; }
.season-wakakusa { color: #4a6e1c; }
.season-fuji    { color: #5c4a8a; }
.season-ai      { color: #1e4d8a; }
.dark .season-sakura   { color: #f2a7bb; }
.dark .season-wakakusa { color: #a8d46f; }
.dark .season-fuji     { color: #b8addf; }
.dark .season-ai       { color: #7ab5e0; }

/* Divider between segments */
.stat-divider {
  width: 1px;
  height: 28px;
  background: var(--lg-glass-border, rgba(0,0,0,0.12));
  border-radius: 1px;
  opacity: 0.6;
}

@media (max-width: 768px) {
  .stats-container {
    font-size: 0.85em;
    gap: 12px;
    padding: 12px 20px;
  }
}
</style>
