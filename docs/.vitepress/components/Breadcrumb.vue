<script setup>
import { computed } from 'vue'
import { useData, withBase } from 'vitepress'

const { page, theme } = useData()

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
    
    // 从侧边栏或页面标题获取更友好的名称
    let displayName = part
    
    // 常见路径的中文映射
    const nameMap = {
      'math': '数学笔记',
      'code': '编程开发',
      'abstract_algebra': '抽象代数',
      'math_analysis': '数学分析',
      'ode': '常微分方程',
      'groupproblem': '特殊类型的群',
      'ring': '环的基本理论',
      'ringHW': '环的习题详解',
      'prob': '题目内容',
      '3-2&4-1 HW': '3-2 4-1 作业',
      '4-2HW': '4-2 作业',
      'Week13HW': 'Week 13 作业',
      'cpp-start': 'C++ 入门'
    }
    
    displayName = nameMap[part] || page.value.title || part
    
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
  padding: 12px 0;
  border-bottom: 1px solid var(--vp-c-divider);
  animation: fadeInDown 0.4s ease-out;
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
  font-size: 0.9em;
}

.breadcrumb-link {
  color: var(--vp-c-text-2);
  text-decoration: none;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.breadcrumb-link:hover {
  color: var(--vp-c-brand-1);
  background: var(--vp-c-bg-soft);
}

.breadcrumb-text {
  color: var(--vp-c-text-1);
  font-weight: 500;
  padding: 4px 8px;
}

.breadcrumb-item.active .breadcrumb-text {
  color: var(--vp-c-brand-1);
}

.breadcrumb-separator {
  color: var(--vp-c-text-3);
  opacity: 0.5;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
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
