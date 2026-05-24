<script setup>
import { useData, withBase } from 'vitepress'
import { computed, ref } from 'vue'

const props = defineProps({
  path: {
    type: String,
    required: true
  }
})

const { theme } = useData()

const items = computed(() => {
  const sidebar = theme.value.sidebar
  return sidebar[props.path] || []
})

// 状态管理：记录展开的索引
// 默认全部折叠 (空 Set)
const expandedIndices = ref(new Set())

const toggle = (index) => {
  const newSet = new Set(expandedIndices.value)
  if (newSet.has(index)) {
    newSet.delete(index)
  } else {
    newSet.add(index)
  }
  expandedIndices.value = newSet
}

const isOpen = (index) => expandedIndices.value.has(index)
</script>

<template>
  <div class="category-container">
    <div
      v-for="(group, index) in items"
      :key="index"
      class="chapter-group"
      :class="{ 'is-open': isOpen(index) }"
    >
      <!-- 章节标题栏 (可点击) -->
      <button class="chapter-header" :aria-expanded="isOpen(index)" @click="toggle(index)">
        <div class="header-left">
          <span class="chapter-title">{{ group.text }}</span>
        </div>
        <div class="header-right">
          <span class="count-badge">{{ group.items?.length || 0 }} 本</span>
          <span class="toggle-icon"></span>
        </div>
      </button>

      <!-- 章节内容 (折叠区域) -->
      <div class="chapter-content" :class="{ 'is-expanded': isOpen(index) }">
        <div class="min-h-0-wrapper">
          <div class="card-grid">
            <a
              v-for="(item, i) in group.items"
              :key="i"
              :href="withBase(item.link)"
              class="note-card"
            >
              <div class="note-info">
                <span class="note-title">{{ item.text }}</span>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>

    <div v-if="items.length === 0" class="empty-state">
      <p>暂无内容</p>
    </div>
  </div>
</template>

<style scoped>
.category-container {
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

/* --- Chapter group — glass card --- */
.chapter-group {
  background: var(--lg-glass-bg, rgba(255, 255, 255, 0.38));
  backdrop-filter: blur(48px) saturate(160%);
  -webkit-backdrop-filter: blur(48px) saturate(160%);
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid var(--lg-glass-border, rgba(255, 255, 255, 0.45));
  box-shadow: var(--lg-glass-shadow, 0 8px 32px rgba(0, 0, 0, 0.06));
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.chapter-group:hover {
  box-shadow: var(--lg-glass-shadow-elevated, 0 16px 48px rgba(0, 0, 0, 0.1));
}

.chapter-group.is-open {
  border-color: var(--lg-glass-border, rgba(255, 255, 255, 0.45));
}

/* --- Header --- */
.chapter-header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.2rem 1.5rem;
  background: transparent;
  border: none;
  cursor: pointer;
  text-align: left;
  transition: background 0.2s;
}

.chapter-group:not(.is-open) .chapter-header:hover {
  background: var(--lg-glass-bg-hover, rgba(255, 255, 255, 0.52));
}

.chapter-group.is-open .chapter-header {
  border-bottom: 1px solid var(--lg-glass-border-subtle, rgba(255, 255, 255, 0.22));
}

.header-left {
  display: flex;
  align-items: center;
}

.chapter-title {
  font-size: 1.05rem;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: var(--lg-text-primary, rgba(0, 0, 0, 0.88));
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.count-badge {
  font-size: 0.78rem;
  color: var(--lg-text-secondary, rgba(0, 0, 0, 0.55));
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(12px);
  padding: 2px 10px;
  border-radius: 999px;
  font-weight: 500;
  border: 1px solid var(--lg-glass-border-subtle, rgba(255, 255, 255, 0.22));
}

/* Toggle icon */
.toggle-icon {
  width: 20px;
  height: 20px;
  position: relative;
  opacity: 0.5;
  transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.chapter-header:hover .toggle-icon {
  opacity: 0.8;
  transform: scale(1.1);
}

.toggle-icon::before,
.toggle-icon::after {
  content: '';
  position: absolute;
  background-color: var(--lg-text-primary, rgba(0, 0, 0, 0.88));
  border-radius: 2px;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}
.toggle-icon::before {
  width: 12px;
  height: 2px;
}
.toggle-icon::after {
  width: 2px;
  height: 12px;
}

.chapter-group.is-open .toggle-icon::after {
  transform: translate(-50%, -50%) rotate(90deg) scale(0);
}

.chapter-group.is-open .toggle-icon::before {
  transform: translate(-50%, -50%) rotate(180deg);
}

/* --- Content collapse --- */
.chapter-content {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.chapter-content.is-expanded {
  grid-template-rows: 1fr;
  transition: grid-template-rows 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.min-h-0-wrapper {
  overflow: hidden;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 10px;
  padding: 16px;
}

/* --- Note card — subtle glass --- */
.note-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 18px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(16px);
  border-radius: 12px;
  text-decoration: none !important;
  border: 1px solid var(--lg-glass-border-subtle, rgba(255, 255, 255, 0.22));
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.note-card:hover {
  background: var(--lg-glass-bg-hover, rgba(255, 255, 255, 0.52));
  transform: translateY(-2px);
  box-shadow: var(--lg-glass-shadow, 0 8px 32px rgba(0, 0, 0, 0.06));
}

.note-info {
  display: flex;
  align-items: center;
}

.note-title {
  font-size: 0.93rem;
  color: var(--lg-text-primary, rgba(0, 0, 0, 0.88));
  font-weight: 500;
  letter-spacing: -0.005em;
}

/* --- Empty state --- */
.empty-state {
  text-align: center;
  padding: 4rem 0;
  color: var(--lg-text-tertiary, rgba(0, 0, 0, 0.35));
}
</style>
