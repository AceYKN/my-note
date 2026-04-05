<script setup>
import { computed } from 'vue'
import { useData, withBase } from 'vitepress'

const { page, theme } = useData()

// 从整个侧边栏树中递归构建 link → text 的扁平映射
const sidebarTextMap = computed(() => {
  const map = new Map()
  const sidebar = theme.value.sidebar
  if (!sidebar) return map

  function walk(items) {
    if (!Array.isArray(items)) return
    for (const item of items) {
      if (item.link) {
        const normalized = item.link.replace(/\/$/, '').replace(/\.html$/, '')
        map.set(normalized, item.text)
      }
      if (item.items) walk(item.items)
    }
  }

  if (Array.isArray(sidebar)) {
    walk(sidebar)
  } else {
    for (const items of Object.values(sidebar)) {
      walk(items)
    }
  }

  return map
})

const breadcrumbs = computed(() => {
  const path = page.value.relativePath
  if (!path || path === 'index.md') return []

  const parts = path.replace(/\.md$/, '').split('/')
  const crumbs = [{ text: '首页', link: '/' }]

  let currentPath = ''
  parts.forEach((part, index) => {
    if (!part) return

    currentPath += `/${part}`
    const isLast = index === parts.length - 1

    // 优先从侧边栏数据查找，最后段回退到页面标题，否则用原始路径段
    const displayName = sidebarTextMap.value.get(currentPath)
      || (isLast ? page.value.title : null)
      || part

    crumbs.push({
      text: displayName,
      link: isLast ? '' : currentPath,
      active: isLast
    })
  })

  return crumbs
})
</script>

<template>
  <nav v-if="breadcrumbs.length > 1" class="breadcrumb" aria-label="Breadcrumb">
    <ol class="breadcrumb-list">
      <li 
        v-for="(crumb, index) in breadcrumbs" 
        :key="index"
        class="breadcrumb-item"
        :class="{ active: crumb.active }"
      >
        <a 
          v-if="crumb.link && !crumb.active" 
          :href="withBase(crumb.link)"
          class="breadcrumb-link"
        >
          {{ crumb.text }}
        </a>
        <span v-else class="breadcrumb-text">
          {{ crumb.text }}
        </span>
        <svg 
          v-if="index < breadcrumbs.length - 1" 
          class="breadcrumb-separator"
          xmlns="http://www.w3.org/2000/svg" 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          stroke-width="2" 
          stroke-linecap="round" 
          stroke-linejoin="round"
        >
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </li>
    </ol>
  </nav>
</template>

<style scoped>
.breadcrumb {
  margin-bottom: 24px;
  padding: 10px 16px;
  background: var(--lg-glass-bg, rgba(255,255,255,0.38));
  backdrop-filter: blur(32px) saturate(160%);
  -webkit-backdrop-filter: blur(32px) saturate(160%);
  border: 1px solid var(--lg-glass-border-subtle, rgba(255,255,255,0.22));
  border-radius: 999px;
  box-shadow: inset 0 1px 1px rgba(255,255,255,0.5);
  animation: fadeInDown 0.4s ease-out;
  display: inline-flex;
}

.breadcrumb-list {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
  list-style: none;
  padding: 0;
  margin: 0;
}

.breadcrumb-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.88em;
}

.breadcrumb-link {
  color: var(--lg-text-secondary, rgba(0,0,0,0.55));
  text-decoration: none;
  padding: 4px 8px;
  border-radius: 6px;
  transition: all 0.2s ease;
  font-weight: 500;
}

.breadcrumb-link:hover {
  color: var(--lg-accent, #7b8cff);
  background: rgba(255,255,255,0.25);
}

.breadcrumb-text {
  color: var(--lg-text-primary, rgba(0,0,0,0.88));
  font-weight: 600;
  padding: 4px 8px;
}

.breadcrumb-item.active .breadcrumb-text {
  color: var(--lg-accent, #7b8cff);
}

.breadcrumb-separator {
  color: var(--lg-text-tertiary, rgba(0,0,0,0.35));
  opacity: 0.5;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .breadcrumb {
    font-size: 0.85em;
  }
  
  .breadcrumb-link,
  .breadcrumb-text {
    padding: 2px 4px;
  }
}
</style>
