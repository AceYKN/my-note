<script setup>
import { computed } from 'vue'

const season = computed(() => {
  const month = new Date().getMonth() + 1 // 1-12
  const year = new Date().getFullYear()

  let kanji, en, color
  if (month >= 3 && month <= 5) {
    kanji = '春'; en = 'Spring'; color = 'sakura'
  } else if (month >= 6 && month <= 8) {
    kanji = '夏'; en = 'Summer'; color = 'wakakusa'
  } else if (month >= 9 && month <= 11) {
    kanji = '秋'; en = 'Autumn'; color = 'fuji'
  } else {
    kanji = '冬'; en = 'Winter'; color = 'ai'
  }

  return { kanji, en, color, year }
})
</script>

<template>
  <div class="season-badge-wrapper">
    <span class="season-badge" :class="`season-${season.color}`">
      {{ season.kanji }} · {{ season.en }} {{ season.year }}
    </span>
  </div>
</template>

<style scoped>
.season-badge-wrapper {
  display: flex;
  justify-content: center;
  margin: 8px auto 0;
}

.season-badge {
  display: inline-block;
  padding: 5px 18px;
  border-radius: 999px;
  font-size: 0.82em;
  font-family: 'Noto Serif JP', 'Hiragino Mincho ProN', serif;
  font-weight: 500;
  letter-spacing: 0.05em;
  background: var(--lg-glass-bg, rgba(255, 255, 255, 0.38));
  backdrop-filter: blur(24px) saturate(150%);
  -webkit-backdrop-filter: blur(24px) saturate(150%);
  border: 1px solid var(--lg-glass-border, rgba(255, 255, 255, 0.45));
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06),
              inset 0 1px 1px rgba(255, 255, 255, 0.6);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.season-badge:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1),
              inset 0 1px 1px rgba(255, 255, 255, 0.6);
}

/* 春 — 桜色 */
.season-sakura {
  color: #b85470;
  border-color: rgba(242, 167, 187, 0.55);
  background: rgba(242, 167, 187, 0.15);
}

/* 夏 — 若草色 */
.season-wakakusa {
  color: #4a6e1c;
  border-color: rgba(141, 178, 85, 0.55);
  background: rgba(141, 178, 85, 0.13);
}

/* 秋 — 藤色 */
.season-fuji {
  color: #5c4a8a;
  border-color: rgba(155, 142, 196, 0.55);
  background: rgba(155, 142, 196, 0.14);
}

/* 冬 — 藍色 */
.season-ai {
  color: #1e4d8a;
  border-color: rgba(91, 155, 213, 0.55);
  background: rgba(91, 155, 213, 0.13);
}

.dark .season-sakura { color: #f2a7bb; }
.dark .season-wakakusa { color: #a8d46f; }
.dark .season-fuji { color: #b8addf; }
.dark .season-ai { color: #7ab5e0; }
</style>
