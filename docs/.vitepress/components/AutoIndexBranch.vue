<script setup>
import { computed } from 'vue'
import { withBase } from 'vitepress'

const props = defineProps({
  items: {
    type: Array,
    required: true
  },
  level: {
    type: Number,
    default: 1
  }
})

const linkedItems = computed(() => getLinkedItems(props.items))
const sections = computed(() => flattenSections(props.items))

function getLinkedItems(items) {
  return items.filter(
    (item) => item.link && (!Array.isArray(item.items) || item.items.length === 0)
  )
}

function getGroupedItems(items) {
  return items.filter((item) => Array.isArray(item.items) && item.items.length > 0)
}

function flattenSections(items, prefix = '') {
  const result = []

  for (const group of getGroupedItems(items)) {
    const title = prefix ? `${prefix} / ${group.text}` : group.text
    const directLinks = getLinkedItems(group.items)
    if (directLinks.length > 0) {
      result.push({
        title,
        count: leafCount(group),
        items: directLinks
      })
    }
    result.push(...flattenSections(group.items, title))
  }

  return result
}

function isExternal(link) {
  return /^https?:\/\//.test(link)
}

function href(link) {
  return isExternal(link) ? link : withBase(link)
}

function leafCount(item) {
  if (item.link && (!item.items || item.items.length === 0)) return 1
  if (!Array.isArray(item.items)) return 0
  return item.items.reduce((count, child) => count + leafCount(child), 0)
}
</script>

<template>
  <div class="auto-index-branch" :class="`auto-index-level-${level}`">
    <div v-if="linkedItems.length > 0" class="auto-index-grid">
      <a
        v-for="item in linkedItems"
        :key="item.link"
        class="auto-index-card"
        :href="href(item.link)"
        v-bind="isExternal(item.link) ? { target: '_blank', rel: 'noopener' } : {}"
      >
        <span class="auto-index-card-title">{{ item.text }}</span>
      </a>
    </div>

    <section v-for="section in sections" :key="section.title" class="auto-index-section">
      <div class="auto-index-section-header">
        <h2 class="auto-index-section-title">{{ section.title }}</h2>
        <span class="auto-index-count">{{ section.count }} 篇</span>
      </div>

      <div class="auto-index-grid">
        <a
          v-for="item in section.items"
          :key="item.link"
          class="auto-index-card"
          :href="href(item.link)"
          v-bind="isExternal(item.link) ? { target: '_blank', rel: 'noopener' } : {}"
        >
          <span class="auto-index-card-title">{{ item.text }}</span>
        </a>
      </div>
    </section>
  </div>
</template>

<style scoped>
.auto-index-branch {
  display: flex;
  flex-direction: column;
  gap: 1.35rem;
}

.auto-index-branch + .auto-index-branch {
  margin-top: 1.35rem;
}

.auto-index-section {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.auto-index-section-header {
  display: flex;
  align-items: center;
  gap: 0.65rem;
}

.auto-index-section-title {
  margin: 0 !important;
  padding: 0 !important;
  border: none !important;
  background: none !important;
  box-shadow: none !important;
  color: var(--lg-text-primary) !important;
  font-size: 1.1rem !important;
  font-weight: 650 !important;
}

.auto-index-count {
  margin-left: auto;
  padding: 0.15rem 0.55rem;
  border: 1px solid var(--lg-glass-border-subtle, rgb(255 255 255 / 22%));
  border-radius: 999px;
  color: var(--lg-text-secondary);
  background: rgb(255 255 255 / 14%);
  font-size: 0.75rem;
  font-weight: 600;
}

.auto-index-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 0.85rem;
}

.auto-index-card {
  display: flex;
  align-items: center;
  min-height: 3.75rem;
  padding: 1rem 1.1rem;
  background: var(--lg-glass-bg, rgb(255 255 255 / 38%));
  backdrop-filter: blur(32px) saturate(160%);
  -webkit-backdrop-filter: blur(32px) saturate(160%);
  border: 1px solid var(--lg-glass-border, rgb(255 255 255 / 45%));
  border-radius: 12px;
  box-shadow: var(--lg-glass-shadow, 0 4px 16px rgb(0 0 0 / 6%));
  color: inherit;
  text-decoration: none;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.auto-index-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--lg-glass-shadow-elevated, 0 8px 32px rgb(0 0 0 / 10%));
  border-color: var(--lg-accent, #2a5fa0);
}

.auto-index-card:focus-visible {
  outline: 2px solid var(--lg-accent, #2a5fa0);
  outline-offset: 3px;
}

.auto-index-card-title {
  color: var(--lg-text-primary);
  font-size: 0.95rem;
  font-weight: 600;
  line-height: 1.35;
}

.auto-index-level-2 {
  gap: 1rem;
}
</style>
