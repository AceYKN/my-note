---
layout: doc
title: Computer Science
sidebar: false
---

<div class="cs-header">
  <h1>Computer Science</h1>
  <p class="cs-subtitle">計算機科学のノート・過去問・宿題をまとめています。</p>
</div>

<div class="course-grid">

  <a class="course-card" href="/my-note/cs/os/">
    <div class="course-icon">🖥️</div>
    <div class="course-body">
      <div class="course-name">Operating Systems</div>
      <div class="course-name-sub">操作系统</div>
      <div class="course-desc">Textbook: Stallings, 9th Edition. Homework solutions & notes.</div>
    </div>
    <div class="course-badge available">履修中</div>
  </a>

  <a class="course-card" href="/my-note/cs/algo/">
    <div class="course-icon">⚙️</div>
    <div class="course-body">
      <div class="course-name">Algorithm Design & Analysis</div>
      <div class="course-name-sub">算法设计与分析</div>
      <div class="course-desc">過去問・ノート。</div>
    </div>
    <div class="course-badge available">履修中</div>
  </a>

  <a class="course-card" href="/my-note/cs/db/">
    <div class="course-icon">💾</div>
    <div class="course-body">
      <div class="course-name">Database Systems</div>
      <div class="course-name-sub">数据库系统</div>
      <div class="course-desc">過去問・ノート。</div>
    </div>
    <div class="course-badge available">履修中</div>
  </a>

  <a class="course-card" href="/my-note/cs/se/">
    <div class="course-icon">🔧</div>
    <div class="course-body">
      <div class="course-name">Software Engineering</div>
      <div class="course-name-sub">软件工程</div>
      <div class="course-desc">ノート。</div>
    </div>
    <div class="course-badge available">履修中</div>
  </a>

</div>

<style scoped>
.cs-header {
  text-align: center;
  margin: 2rem 0 2.5rem;
}

.cs-subtitle {
  color: var(--lg-text-secondary);
  font-size: 1em;
  margin-top: 0.5rem;
  letter-spacing: 0.02em;
}

.course-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.2rem;
  margin-top: 1.5rem;
}

.course-card {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1.4rem 1.5rem;
  background: var(--lg-glass-bg, rgba(255,255,255,0.38));
  backdrop-filter: blur(48px) saturate(160%);
  -webkit-backdrop-filter: blur(48px) saturate(160%);
  border: 1px solid var(--lg-glass-border, rgba(255,255,255,0.45));
  border-radius: 16px;
  box-shadow: var(--lg-glass-shadow, 0 8px 32px rgba(0,0,0,0.06));
  text-decoration: none;
  color: inherit;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.course-card:not(.disabled):hover {
  transform: translateY(-3px);
  box-shadow: var(--lg-glass-shadow-elevated, 0 16px 48px rgba(0,0,0,0.1));
  border-color: var(--lg-accent, #2a5fa0);
}

.course-card.disabled {
  opacity: 0.55;
  cursor: not-allowed;
  pointer-events: none;
}

.course-icon {
  font-size: 1.8em;
  line-height: 1;
}

.course-body {
  flex: 1;
}

.course-name {
  font-size: 1.05em;
  font-weight: 700;
  color: var(--lg-text-primary);
  letter-spacing: -0.01em;
}

.course-name-sub {
  font-size: 0.82em;
  color: var(--lg-text-secondary);
  margin-top: 2px;
  letter-spacing: 0.01em;
}

.course-desc {
  font-size: 0.85em;
  color: var(--lg-text-secondary);
  margin-top: 0.5rem;
  line-height: 1.55;
}

.course-badge {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 0.75em;
  font-weight: 600;
  letter-spacing: 0.03em;
  align-self: flex-start;
}

.course-badge.available {
  background: var(--lg-accent-soft, rgba(42,95,160,0.13));
  color: var(--lg-accent, #2a5fa0);
  border: 1px solid var(--lg-accent-soft, rgba(42,95,160,0.2));
}

.course-badge.soon {
  background: rgba(180, 130, 60, 0.12);
  color: #8a6020;
  border: 1px solid rgba(180, 130, 60, 0.2);
}

.dark .course-badge.soon {
  color: #e0b060;
  background: rgba(200, 150, 60, 0.15);
  border-color: rgba(200, 150, 60, 0.25);
}
</style>
