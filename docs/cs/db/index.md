---
title: 课程概览
---

<div class="db-header">
  <h1>Database Systems</h1>
  <p class="db-subtitle">数据库系统</p>
</div>

<div class="db-section">
  <h2>📝 Past Papers</h2>
  <div class="file-grid">
    <a class="file-card" href="/my-note/cs/db/pastpapers/db-pastpaper-1">
      <span class="file-icon">📄</span>
      <span class="file-name">试题 1</span>
      <span class="file-desc">数据库系统综合练习题</span>
    </a>
  </div>
</div>

<div class="db-section">
  <h2>📖 Notes</h2>
  <div class="file-grid">
    <a class="file-card" href="/my-note/cs/db/pastpapers/normalization">
      <span class="file-icon">📄</span>
      <span class="file-name">数据库规范化流程</span>
      <span class="file-desc">从 E-R 图到 BCNF 的标准化推导步骤</span>
    </a>
  </div>
</div>

<style scoped>
.db-header {
  text-align: center;
  margin: 2rem 0 2.5rem;
}
.db-subtitle {
  color: var(--lg-text-secondary);
  font-size: 0.95em;
  margin-top: 0.5rem;
  letter-spacing: 0.01em;
}
.db-section {
  margin-bottom: 2rem;
}
.db-section h2 {
  font-size: 1.1em;
  font-weight: 600;
  margin-bottom: 1rem;
  padding: 0;
  border: none;
  background: none;
  box-shadow: none;
  color: var(--lg-text-primary);
}
.file-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 0.85rem;
}
.file-card {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  padding: 1rem 1.2rem;
  background: var(--lg-glass-bg, rgba(255,255,255,0.38));
  backdrop-filter: blur(32px) saturate(160%);
  -webkit-backdrop-filter: blur(32px) saturate(160%);
  border: 1px solid var(--lg-glass-border, rgba(255,255,255,0.45));
  border-radius: 12px;
  box-shadow: var(--lg-glass-shadow, 0 4px 16px rgba(0,0,0,0.06));
  text-decoration: none;
  color: inherit;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}
.file-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--lg-glass-shadow-elevated, 0 8px 32px rgba(0,0,0,0.1));
  border-color: var(--lg-accent, #2a5fa0);
}
.file-icon {
  font-size: 1.3em;
  line-height: 1;
}
.file-name {
  font-size: 0.98em;
  font-weight: 650;
  color: var(--lg-text-primary);
  letter-spacing: -0.01em;
}
.file-desc {
  font-size: 0.78em;
  color: var(--lg-text-secondary);
  line-height: 1.4;
}
</style>
