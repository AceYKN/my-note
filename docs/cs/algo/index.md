---
title: Algorithm Design & Analysis
description: 算法设计与分析学习笔记，涵盖递归、分治、动态规划等核心算法策略，附历年期末考试真题。
---

<div class="algo-header">
  <h1>Algorithm Design & Analysis</h1>
  <p class="algo-subtitle">算法设计与分析</p>
</div>

<div class="algo-section">
  <h2>📄 Past Papers</h2>
  <div class="file-grid">
    <a class="file-card" href="/my-note/cs/algo/pastpapers/2024-2025-se2">
      <span class="file-icon">📄</span>
      <span class="file-name">2024-2025 SE2</span>
      <span class="file-desc">期末试题</span>
    </a>
  </div>
</div>

<div class="algo-section">
  <h2>📖 Notes</h2>
  <div class="file-grid">
    <a class="file-card" href="/my-note/cs/algo/notes/chap2">
      <span class="file-icon">📄</span>
      <span class="file-name">Chap. 2 Note</span>
      <span class="file-desc">递归（Recursion）</span>
    </a>
    <a class="file-card" href="/my-note/cs/algo/notes/chap3">
      <span class="file-icon">📄</span>
      <span class="file-name">Chap. 3 Note</span>
      <span class="file-desc">分治（Divide and Conquer）</span>
    </a>
    <a class="file-card" href="/my-note/cs/algo/notes/chap4">
      <span class="file-icon">📄</span>
      <span class="file-name">Chap. 4 Note</span>
      <span class="file-desc">动态规划（Dynamic Programming）</span>
    </a>
  </div>
</div>

<style scoped>
.algo-header {
  text-align: center;
  margin: 2rem 0 2.5rem;
}
.algo-subtitle {
  color: var(--lg-text-secondary);
  font-size: 0.95em;
  margin-top: 0.5rem;
  letter-spacing: 0.01em;
}
.algo-section {
  margin-bottom: 2rem;
}
.algo-section h2 {
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
