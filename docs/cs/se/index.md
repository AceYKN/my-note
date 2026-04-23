---
title: Software Engineering
sidebar: false
description: 软件工程学习笔记，基于 Ian Sommerville 教材，涵盖软件过程模型、需求获取与分析、架构模式、需求追溯矩阵（RTM）等内容。
---

<div class="se-header">
  <h1>Software Engineering</h1>
  <p class="se-subtitle">软件工程</p>
</div>

<div class="se-section">
  <h2>📖 Notes by Chapter</h2>
  <div class="file-grid">
    <a class="file-card" href="/my-note/cs/se/notesbychap/chap3">
      <span class="file-icon">📄</span>
      <span class="file-name">Chapter 3</span>
      <span class="file-desc">Agile Software Development</span>
    </a>
    <a class="file-card" href="/my-note/cs/se/notesbychap/chap4">
      <span class="file-icon">📄</span>
      <span class="file-name">Chapter 4</span>
      <span class="file-desc">Requirements Engineering</span>
    </a>
    <a class="file-card" href="/my-note/cs/se/notesbychap/chap5">
      <span class="file-icon">📄</span>
      <span class="file-name">Chapter 5</span>
      <span class="file-desc">System Modeling</span>
    </a>
    <a class="file-card" href="/my-note/cs/se/notesbychap/chap6">
      <span class="file-icon">📄</span>
      <span class="file-name">Chapter 6</span>
      <span class="file-desc">Architectural Design</span>
    </a>
  </div>
</div>

<div class="se-section">
  <h2>📖 Notes</h2>
  <div class="file-grid">
    <a class="file-card" href="/my-note/cs/se/notes/2.1">
      <span class="file-icon">📄</span>
      <span class="file-name">2.1 Software Process Models</span>
      <span class="file-desc">软件过程模型</span>
    </a>
    <a class="file-card" href="/my-note/cs/se/notes/4.3">
      <span class="file-icon">📄</span>
      <span class="file-name">4.3 Requirements Elicitation</span>
      <span class="file-desc">需求获取与分析</span>
    </a>
    <a class="file-card" href="/my-note/cs/se/notes/6.3">
      <span class="file-icon">📄</span>
      <span class="file-name">6.3 Architectural Patterns</span>
      <span class="file-desc">架构模式</span>
    </a>
    <a class="file-card" href="/my-note/cs/se/notes/rtm">
      <span class="file-icon">📄</span>
      <span class="file-name">RTM</span>
      <span class="file-desc">Requirements Traceability Matrix</span>
    </a>
  </div>
</div>

<div class="se-section">
  <h2>📚 Course Book</h2>
  <div class="file-grid">
    <a class="file-card" href="https://dn790001.ca.archive.org/0/items/bme-vik-konyvek/Software%20Engineering%20-%20Ian%20Sommerville.pdf" target="_blank" rel="noopener">
      <span class="file-icon">📘</span>
      <span class="file-name">Software Engineering</span>
      <span class="file-desc">Ian Sommerville — PDF</span>
    </a>
  </div>
</div>

<style scoped>
.se-header {
  text-align: center;
  margin: 2rem 0 2.5rem;
}
.se-subtitle {
  color: var(--lg-text-secondary);
  font-size: 0.95em;
  margin-top: 0.5rem;
  letter-spacing: 0.01em;
}
.se-section {
  margin-bottom: 2rem;
}
.se-section h2 {
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
  text-decoration: none;
  color: inherit;
  transition: box-shadow 0.18s, transform 0.18s;
}
.file-card:hover {
  box-shadow: 0 4px 24px rgba(0,0,0,0.10);
  transform: translateY(-2px);
}
.file-icon {
  font-size: 1.3em;
}
.file-name {
  font-size: 0.92em;
  font-weight: 600;
  color: var(--lg-text-primary);
}
.file-desc {
  font-size: 0.8em;
  color: var(--lg-text-secondary);
}
</style>