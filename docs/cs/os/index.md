---
title: Operating Systems
description: 操作系统学习笔记与作业，教材 William Stallings《Operating Systems: Internals and Design Principles》第9版，涵盖进程、线程、内存管理、文件系统等核心章节。
---

<div class="os-header">
  <h1>Operating Systems</h1>
  <p class="os-subtitle">课程教材：<em>Operating Systems: Internals and Design Principles</em> — William Stallings, 9th Edition (2018)</p>
</div>

<div class="os-section">
  <h2>📝 Homework</h2>
  <div class="file-grid">
    <a class="file-card" href="/my-note/cs/os/HW/chap2-hw">
      <span class="file-icon">📄</span>
      <span class="file-name">Chap. 2 HW</span>
      <span class="file-desc">Operating System Overview</span>
    </a>
    <a class="file-card" href="/my-note/cs/os/HW/chap3-hw">
      <span class="file-icon">📄</span>
      <span class="file-name">Chap. 3 HW</span>
      <span class="file-desc">Process Description and Control</span>
    </a>
    <a class="file-card" href="/my-note/cs/os/HW/chap4-hw">
      <span class="file-icon">📄</span>
      <span class="file-name">Chap. 4 HW</span>
      <span class="file-desc">Threads</span>
    </a>
    <a class="file-card" href="/my-note/cs/os/HW/chap5-hw">
      <span class="file-icon">📄</span>
      <span class="file-name">Chap. 5 HW</span>
      <span class="file-desc">Concurrency: Mutual Exclusion and Synchronization</span>
    </a>
  </div>
</div>

<div class="os-section">
  <h2>📖 Notes</h2>
  <div class="file-grid">
    <a class="file-card" href="/my-note/cs/os/note/chap2">
      <span class="file-icon">📄</span>
      <span class="file-name">Chap. 2 Note</span>
      <span class="file-desc">Operating System Overview</span>
    </a>
    <a class="file-card" href="/my-note/cs/os/note/chap3">
      <span class="file-icon">📄</span>
      <span class="file-name">Chap. 3 Note</span>
      <span class="file-desc">Process Description and Control</span>
    </a>
    <a class="file-card" href="/my-note/cs/os/note/chap4">
      <span class="file-icon">📄</span>
      <span class="file-name">Chap. 4 Note</span>
      <span class="file-desc">Threads, SMP, and Microkernels</span>
    </a>
    <a class="file-card" href="/my-note/cs/os/note/chap5">
      <span class="file-icon">📄</span>
      <span class="file-name">Chap. 5 Note</span>
      <span class="file-desc">Concurrency: Mutual Exclusion and Synchronization</span>
    </a>
    <a class="file-card" href="/my-note/cs/os/note/chap6">
      <span class="file-icon">📄</span>
      <span class="file-name">Chap. 6 Note</span>
      <span class="file-desc">Concurrency: Deadlock and Starvation</span>
    </a>
  </div>
</div>

<style scoped>
.os-header {
  text-align: center;
  margin: 2rem 0 2.5rem;
}
.os-subtitle {
  color: var(--lg-text-secondary);
  font-size: 0.95em;
  margin-top: 0.5rem;
  letter-spacing: 0.01em;
}
.os-section {
  margin-bottom: 2rem;
}
.os-section h2 {
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

## Contents

- **Chap. 2**: Operating System Overview
- **Chap. 3**: Process Description and Control
- **Chap. 4**: Threads
- **Chap. 5**: Concurrency: Mutual Exclusion and Synchronization
- **Chap. 6**: Concurrency: Deadlock and Starvation
- **Midterm Exam**
- **Chap. 7**: Memory Management
- **Chap. 8**: Virtual Memory
- **Chap. 9**: Uniprocessor Scheduling
- **Chap. 10**: Multiprocessor, Multicore, and Real-Time Scheduling
- **Chap. 11**: I/O Management and Disk Scheduling
- **Chap. 12**: File Management
