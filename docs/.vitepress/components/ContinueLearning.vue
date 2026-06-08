<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { withBase } from 'vitepress'
import {
  clearLearningState,
  getContinueLearningItems,
  getLearningSummary,
  LEARNING_PROGRESS_STORAGE_KEY,
  LEARNING_PROGRESS_UPDATED_EVENT,
  readLearningState
} from '../utils/learningProgress.js'

const items = ref([])
const summary = ref({ totalVisited: 0, totalCompleted: 0 })

const hasItems = computed(() => items.value.length > 0)

function refresh() {
  const state = readLearningState()
  items.value = getContinueLearningItems(state, { limit: 3 })
  summary.value = getLearningSummary(state)
}

function progressLabel(item) {
  if (item.completed) return '読了'
  if (item.progress <= 5) return '読みはじめ'
  return `読書中 ${item.progress}%`
}

function handleStorage(event) {
  if (event.key === LEARNING_PROGRESS_STORAGE_KEY) refresh()
}

function clearProgress() {
  clearLearningState()
  refresh()
}

onMounted(() => {
  refresh()
  window.addEventListener(LEARNING_PROGRESS_UPDATED_EVENT, refresh)
  window.addEventListener('storage', handleStorage)
})

onUnmounted(() => {
  window.removeEventListener(LEARNING_PROGRESS_UPDATED_EVENT, refresh)
  window.removeEventListener('storage', handleStorage)
})
</script>

<template>
  <section class="continue-learning" aria-label="つづきから読む">
    <div class="cl-header">
      <div>
        <p class="cl-eyebrow">Resume</p>
        <h2 class="cl-title">つづきから読む</h2>
      </div>
      <div v-if="summary.totalVisited > 0" class="cl-summary" aria-label="読書統計">
        <span
          ><strong>{{ summary.totalCompleted }}</strong> 完了</span
        >
        <span
          ><strong>{{ summary.totalVisited }}</strong> 閲覧</span
        >
      </div>
    </div>

    <div v-if="hasItems" class="cl-grid">
      <a v-for="item in items" :key="item.path" class="cl-card" :href="withBase(item.resumeUrl)">
        <span class="cl-section">{{ item.section }}</span>
        <span class="cl-name">{{ item.title }}</span>
        <span class="cl-meta">{{ progressLabel(item) }}</span>
        <span class="cl-progress" aria-hidden="true">
          <span class="cl-progress-fill" :style="{ width: item.progress + '%' }"></span>
        </span>
      </a>
    </div>

    <div v-else class="cl-empty">
      <p>ノートを開くと、最近読んだページと進み具合がここに表示されます。</p>
    </div>

    <button v-if="hasItems" class="cl-clear" type="button" @click="clearProgress">
      履歴を消す
    </button>
  </section>
</template>

<style scoped>
.continue-learning {
  box-sizing: border-box;
  max-width: 1152px;
  margin: 2rem auto 0;
  padding: 0 24px;
}

.cl-header {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
}

.cl-eyebrow {
  margin: 0 0 0.25rem;
  color: var(--lg-text-tertiary, rgb(0 0 0 / 38%));
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0;
  text-transform: uppercase;
}

.cl-title {
  margin: 0;
  color: var(--lg-text-primary, rgb(0 0 0 / 88%));
  font-family: var(--lg-font-hand, 'Noto Serif TC', 'Noto Serif JP', serif);
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: 0;
}

.cl-summary {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  color: var(--lg-text-secondary, rgb(0 0 0 / 52%));
  font-size: 0.78rem;
  font-weight: 600;
  white-space: nowrap;
}

.cl-summary span {
  display: inline-flex;
  align-items: baseline;
  gap: 0.24rem;
}

.cl-summary span + span {
  padding-left: 0.55rem;
  border-left: 1px solid rgb(0 0 0 / 12%);
}

.cl-summary strong {
  color: var(--lg-text-primary, rgb(0 0 0 / 88%));
  font-size: 0.95rem;
  font-weight: 750;
}

.dark .cl-summary {
  color: rgb(232 238 247 / 52%);
}

.dark .cl-summary span + span {
  border-left-color: rgb(255 255 255 / 12%);
}

.dark .cl-summary strong {
  color: rgb(255 255 255 / 84%);
}

.cl-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.85rem;
}

.cl-card {
  display: flex;
  min-height: 7rem;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  border: 1px solid var(--lg-glass-border, rgb(255 255 255 / 45%));
  border-radius: 12px;
  background: var(--lg-glass-bg, rgb(255 255 255 / 38%));
  backdrop-filter: blur(32px) saturate(160%);
  -webkit-backdrop-filter: blur(32px) saturate(160%);
  box-shadow: var(--lg-glass-shadow, 0 4px 16px rgb(0 0 0 / 6%));
  color: inherit;
  text-decoration: none;
  transition:
    border-color 0.22s ease,
    box-shadow 0.22s ease,
    transform 0.22s ease;
}

.dark .cl-card {
  border-color: rgb(255 255 255 / 11%);
  background: rgb(18 24 32 / 58%);
  box-shadow: 0 12px 36px rgb(0 0 0 / 28%);
}

.cl-card:hover {
  border-color: var(--lg-accent, #2a5fa0);
  box-shadow: var(--lg-glass-shadow-elevated, 0 8px 32px rgb(0 0 0 / 10%));
  transform: translateY(-2px);
}

.dark .cl-card:hover {
  border-color: rgb(242 167 187 / 42%);
  box-shadow: 0 16px 42px rgb(0 0 0 / 36%);
}

.cl-card:focus-visible,
.cl-clear:focus-visible {
  outline: 2px solid var(--lg-accent, #2a5fa0);
  outline-offset: 3px;
}

.cl-section {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  align-self: flex-start;
  min-height: 1.35rem;
  padding: 0 0.48rem;
  border: 1px solid color-mix(in srgb, var(--lg-accent, #2a5fa0) 18%, transparent);
  border-radius: 7px;
  color: color-mix(in srgb, var(--lg-accent, #2a5fa0) 82%, var(--lg-text-secondary));
  background: color-mix(in srgb, var(--lg-accent, #2a5fa0) 8%, transparent);
  font-size: 0.68rem;
  font-weight: 700;
  line-height: 1;
  letter-spacing: 0;
  text-transform: uppercase;
}

.cl-section::before {
  width: 0.38rem;
  height: 0.38rem;
  border-radius: 50%;
  background: currentColor;
  content: '';
  opacity: 0.55;
}

.dark .cl-section {
  border-color: rgb(255 255 255 / 10%);
  color: rgb(232 238 247 / 72%);
  background: rgb(255 255 255 / 5%);
}

.dark .cl-section::before {
  color: rgb(242 167 187 / 78%);
  opacity: 1;
}

.cl-name {
  color: var(--lg-text-primary, rgb(0 0 0 / 88%));
  font-size: 0.98rem;
  font-weight: 650;
  line-height: 1.35;
}

.cl-meta {
  margin-top: auto;
  color: var(--lg-text-secondary, rgb(0 0 0 / 55%));
  font-size: 0.8rem;
  font-weight: 600;
}

.cl-progress {
  display: block;
  width: 100%;
  height: 4px;
  overflow: hidden;
  border-radius: 999px;
  background: rgb(0 0 0 / 8%);
}

.dark .cl-progress {
  background: rgb(255 255 255 / 10%);
}

.cl-progress-fill {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, var(--lg-iridescent-2), var(--lg-iridescent-4));
}

.dark .cl-progress-fill {
  background: linear-gradient(90deg, rgb(242 167 187 / 85%), rgb(122 181 224 / 88%));
}

.cl-empty {
  padding: 1.15rem 1.25rem;
  border: 1px dashed var(--lg-glass-border, rgb(255 255 255 / 45%));
  border-radius: 12px;
  color: var(--lg-text-secondary, rgb(0 0 0 / 55%));
  background: rgb(255 255 255 / 14%);
}

.dark .cl-empty {
  border-color: rgb(255 255 255 / 12%);
  color: rgb(232 238 247 / 66%);
  background: rgb(18 24 32 / 38%);
}

.cl-empty p {
  margin: 0;
  font-family: var(--lg-font-hand, 'Noto Serif TC', 'Noto Serif JP', serif);
  font-size: 0.92rem;
  letter-spacing: 0;
}

.cl-clear {
  display: block;
  margin: 0.85rem 0 0 auto;
  padding: 0.35rem 0.65rem;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: var(--lg-text-tertiary, rgb(0 0 0 / 38%));
  cursor: pointer;
  font-size: 0.78rem;
}

.cl-clear:hover {
  color: var(--lg-text-primary, rgb(0 0 0 / 88%));
  background: rgb(255 255 255 / 18%);
}

@media (max-width: 768px) {
  .continue-learning {
    padding: 0 18px;
  }

  .cl-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .cl-grid {
    grid-template-columns: 1fr;
  }
}
</style>
