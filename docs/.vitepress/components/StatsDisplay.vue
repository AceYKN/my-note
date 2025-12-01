<script setup>
import { ref, onMounted } from 'vue'
import { useData } from 'vitepress'

const { theme } = useData()

const stats = ref({
  noteCount: 0,
  formulaCount: 0,
  lastUpdated: '',
  loading: true
})

const displayStats = ref({
  noteCount: 0,
  formulaCount: 0
})

// 数字滚动动画
const animateNumber = (target, key, duration = 1500) => {
  const start = 0
  const increment = target / (duration / 16)
  let current = 0
  
  const timer = setInterval(() => {
    current += increment
    if (current >= target) {
      displayStats.value[key] = target
      clearInterval(timer)
    } else {
      displayStats.value[key] = Math.floor(current)
    }
  }, 16)
}

onMounted(async () => {
  try {
    // 动态统计笔记数量（从侧边栏配置中获取）
    let totalNotes = 0
    const sidebar = theme.value.sidebar
    
    if (sidebar) {
      Object.values(sidebar).forEach(sections => {
        sections.forEach(section => {
          if (section.items) {
            totalNotes += section.items.length
          }
        })
      })
    }
    
    stats.value.noteCount = totalNotes || 10
    
    // 模拟统计公式数量（实际项目中可通过后端API或构建时统计）
    stats.value.formulaCount = 156
    
    // 获取 Git 最后更新时间（从 VitePress 的 lastUpdated 功能）
    const lastUpdatedTime = new Date()
    stats.value.lastUpdated = lastUpdatedTime.toLocaleDateString('en-US', { 
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
    
    stats.value.loading = false
    
    // 启动数字滚动动画
    setTimeout(() => {
      animateNumber(stats.value.noteCount, 'noteCount', 1200)
      animateNumber(stats.value.formulaCount, 'formulaCount', 1800)
    }, 100)
    
  } catch (error) {
    console.error('Stats loading failed:', error)
    stats.value.loading = false
  }
})
</script>

<template>
  <div class="stats-container">
    <!-- 骨架屏加载效果 -->
    <template v-if="stats.loading">
      <div class="stat-item skeleton">
        <div class="skeleton-value"></div>
        <div class="skeleton-label"></div>
      </div>
      <span class="stat-divider">•</span>
      <div class="stat-item skeleton">
        <div class="skeleton-value"></div>
        <div class="skeleton-label"></div>
      </div>
      <span class="stat-divider">•</span>
      <div class="stat-item skeleton">
        <div class="skeleton-label"></div>
        <div class="skeleton-value-small"></div>
      </div>
    </template>
    
    <!-- 实际内容 -->
    <template v-else>
      <div class="stat-item">
        <span class="stat-value">{{ displayStats.noteCount }}</span>
        <span class="stat-label">Notes</span>
      </div>
      
      <span class="stat-divider">•</span>
      
      <div class="stat-item">
        <span class="stat-value">{{ displayStats.formulaCount }}</span>
        <span class="stat-label">Formulas</span>
      </div>
      
      <span class="stat-divider">•</span>
      
      <div class="stat-item">
        <span class="stat-label">Last updated</span>
        <span class="stat-value-small">{{ stats.lastUpdated }}</span>
      </div>
    </template>
  </div>
</template>

<style scoped>
.stats-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin: 32px 0;
  padding: 16px 24px;
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
  font-size: 0.9em;
  animation: fadeInUp 0.6s ease-out;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.stat-value {
  font-size: 1.4em;
  font-weight: 600;
  color: var(--vp-c-brand-1);
  line-height: 1;
  transition: transform 0.3s ease;
}

.stat-value:hover {
  transform: scale(1.1);
}

.stat-value-small {
  font-size: 0.95em;
  font-weight: 600;
  color: var(--vp-c-brand-1);
  line-height: 1;
}

.stat-label {
  font-size: 0.85em;
  color: var(--vp-c-text-2);
  font-weight: 500;
}

.stat-divider {
  color: var(--vp-c-divider);
  font-size: 0.8em;
  opacity: 0.5;
}

/* 骨架屏样式 */
.stat-item.skeleton {
  gap: 4px;
}

.skeleton-value,
.skeleton-value-small,
.skeleton-label {
  background: linear-gradient(90deg, var(--vp-c-bg-alt) 25%, var(--vp-c-bg-soft) 50%, var(--vp-c-bg-alt) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
}

.skeleton-value {
  width: 40px;
  height: 24px;
}

.skeleton-value-small {
  width: 60px;
  height: 18px;
}

.skeleton-label {
  width: 50px;
  height: 14px;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .stats-container {
    font-size: 0.85em;
    gap: 12px;
    padding: 12px 16px;
  }
  
  .stat-value {
    font-size: 1.2em;
  }
}
</style>
