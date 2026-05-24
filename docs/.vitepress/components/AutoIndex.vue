<script setup>
import { computed } from 'vue'
import { useData, withBase } from 'vitepress'
import AutoIndexBranch from './AutoIndexBranch.vue'

const props = defineProps({
  path: {
    type: String,
    required: true
  },
  variant: {
    type: String,
    default: 'sections',
    validator: (value) => ['sections', 'courses'].includes(value)
  },
  unwrapSingleGroup: {
    type: Boolean,
    default: false
  },
  hideSelf: {
    type: Boolean,
    default: true
  }
})

const { theme } = useData()

function ensureTrailingSlash(value) {
  if (!value) return '/'
  return value.endsWith('/') ? value : `${value}/`
}

function normalizeRoute(value) {
  if (!value) return ''
  const normalized = value
    .replace(/\.html$/, '')
    .replace(/\/index$/, '')
    .replace(/\/$/, '')
  return normalized || '/'
}

const rootPath = computed(() => ensureTrailingSlash(props.path))

const sidebarItems = computed(() => {
  const sidebar = theme.value.sidebar
  if (!sidebar || Array.isArray(sidebar)) return []
  return sidebar[rootPath.value] || []
})

function isSelfLink(link) {
  return normalizeRoute(link) === normalizeRoute(rootPath.value)
}

function cleanItem(item) {
  const children = Array.isArray(item.items) ? item.items.map(cleanItem).filter(Boolean) : []
  const isSelf = item.link && props.hideSelf && isSelfLink(item.link)

  if (isSelf && children.length === 0) return null
  if (!item.link && children.length === 0) return null

  return {
    text: item.text,
    link: isSelf ? null : item.link,
    items: children
  }
}

function collectLinks(item, links = []) {
  if (item.link) links.push(item.link)
  if (Array.isArray(item.items)) {
    item.items.forEach((child) => collectLinks(child, links))
  }
  return links
}

function inferGroupLink(item) {
  const links = collectLinks(item)
  const base = rootPath.value
  const internalLinks = links
    .filter((link) => link.startsWith(base) && normalizeRoute(link) !== normalizeRoute(base))
    .sort((a, b) => a.split('/').length - b.split('/').length)

  const firstLink = internalLinks[0] || item.link
  if (!firstLink) return base

  const rest = firstLink.slice(base.length).replace(/^\/+/, '')
  const firstSegment = rest.split('/').filter(Boolean)[0]
  return firstSegment ? `${base}${firstSegment}/` : ensureTrailingSlash(firstLink)
}

function countLinkedPages(item, excludedLink) {
  const excluded = normalizeRoute(excludedLink)
  return collectLinks(item).filter((link) => normalizeRoute(link) !== excluded).length
}

const sectionItems = computed(() => {
  const cleaned = sidebarItems.value.map(cleanItem).filter(Boolean)
  if (
    props.unwrapSingleGroup &&
    cleaned.length === 1 &&
    !cleaned[0].link &&
    Array.isArray(cleaned[0].items)
  ) {
    return cleaned[0].items
  }
  return cleaned
})

const courseCards = computed(() =>
  sidebarItems.value
    .map((item) => {
      const link = inferGroupLink(item)
      const count = countLinkedPages(item, link)
      return {
        text: item.text,
        link,
        count
      }
    })
    .filter((item) => item.link && item.text)
)
</script>

<template>
  <div class="auto-index">
    <div v-if="variant === 'courses' && courseCards.length > 0" class="auto-course-grid">
      <a
        v-for="card in courseCards"
        :key="card.link"
        :href="withBase(card.link)"
        class="auto-course-card"
      >
        <span class="auto-course-name">{{ card.text }}</span>
        <span class="auto-course-meta">{{ card.count }} 篇内容</span>
      </a>
    </div>

    <AutoIndexBranch v-else-if="sectionItems.length > 0" :items="sectionItems" />

    <p v-else class="auto-index-empty">暂无内容</p>
  </div>
</template>

<style scoped>
.auto-index {
  margin-top: 1.5rem;
}

.auto-course-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1rem;
}

.auto-course-card {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  min-height: 6.25rem;
  padding: 1.35rem 1.45rem;
  background: var(--lg-glass-bg, rgb(255 255 255 / 38%));
  backdrop-filter: blur(48px) saturate(160%);
  -webkit-backdrop-filter: blur(48px) saturate(160%);
  border: 1px solid var(--lg-glass-border, rgb(255 255 255 / 45%));
  border-radius: 16px;
  box-shadow: var(--lg-glass-shadow, 0 8px 32px rgb(0 0 0 / 6%));
  color: inherit;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.auto-course-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--lg-glass-shadow-elevated, 0 16px 48px rgb(0 0 0 / 10%));
  border-color: var(--lg-accent, #2a5fa0);
}

.auto-course-card:focus-visible {
  outline: 2px solid var(--lg-accent, #2a5fa0);
  outline-offset: 3px;
}

.auto-course-name {
  color: var(--lg-text-primary);
  font-size: 1.05rem;
  font-weight: 700;
}

.auto-course-meta {
  color: var(--lg-text-secondary);
  font-size: 0.84rem;
}

.auto-index-empty {
  color: var(--lg-text-secondary);
  text-align: center;
}
</style>
