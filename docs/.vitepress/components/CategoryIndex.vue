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
      <button class="chapter-header" @click="toggle(index)">
        <div class="header-left">
          <span class="chapter-icon">📂</span>
          <span class="chapter-title">{{ group.text }}</span>
        </div>
        <div class="header-right">
          <span class="count-badge">{{ group.items?.length || 0 }} 篇</span>
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
                <span class="note-icon">📄</span>
                <span class="note-title">{{ item.text }}</span>
              </div>
              <span class="arrow-icon">→</span>
            </a>
          </div>
        </div>
      </div>
    </div>

    <div v-if="items.length === 0" class="empty-state">

      <div class="empty-icon">📭</div>
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

/* --- 章节分组容器 --- */
.chapter-group {
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid transparent;
  transition: all 0.3s ease;
}

.chapter-group:hover {
  border-color: var(--vp-c-brand-soft);
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

.chapter-group.is-open {
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  box-shadow: 0 8px 24px rgba(0,0,0,0.08);
}

/* --- 标题栏 --- */
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
  background: var(--vp-c-bg-alt);
}

.chapter-group.is-open .chapter-header {
  border-bottom: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.chapter-icon {
  font-size: 1.4rem;
}

.chapter-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.count-badge {
  font-size: 0.8rem;
  color: var(--vp-c-text-2);
  background: var(--vp-c-bg-alt);
  padding: 2px 8px;
  border-radius: 10px;
  font-weight: 500;
}

/* 动态加减号图标 - 弹性旋转动画 */
.toggle-icon {
  width: 20px;
  height: 20px;
  position: relative;
  opacity: 0.6;
  transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.chapter-header:hover .toggle-icon {
  opacity: 1;
  transform: scale(1.1);
}

.toggle-icon::before, .toggle-icon::after {
  content: '';
  position: absolute;
  background-color: var(--vp-c-text-1);
  border-radius: 2px;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}
.toggle-icon::before { width: 12px; height: 2px; }
.toggle-icon::after { width: 2px; height: 12px; }

/* 展开时变成减号 - 带弹性旋转 */
.chapter-group.is-open .toggle-icon::after {
  transform: translate(-50%, -50%) rotate(90deg) scale(0);
}

.chapter-group.is-open .toggle-icon::before {
  transform: translate(-50%, -50%) rotate(180deg);
}

/* --- 内容区域 (折叠动画 - 弹性效果) --- */
.chapter-content {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  /* 弹性曲线: 展开时会略微超出再回弹 */
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
  gap: 12px;
  padding: 16px;
  background: var(--vp-c-bg-alt);
}


/* --- 笔记卡片 --- */
.note-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 18px;
  background: var(--vp-c-bg);
  border-radius: 8px;
  text-decoration: none !important;
  border: 1px solid transparent;
  transition: all 0.2s ease;
}

.note-card:hover {
  border-color: var(--vp-c-brand-1);
  transform: translateX(4px);
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

.note-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.note-title {
  font-size: 0.95rem;
  color: var(--vp-c-text-1);
  font-weight: 500;
}

.arrow-icon {
  color: var(--vp-c-brand-1);
  opacity: 0;
  transform: translateX(-10px);
  transition: all 0.2s ease;
  font-weight: bold;
}

.note-card:hover .arrow-icon {
  opacity: 1;
  transform: translateX(0);
}

/* --- 空状态 --- */
.empty-state {
  text-align: center;
  padding: 4rem 0;
  color: var(--vp-c-text-3);
}
.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}
</style>
