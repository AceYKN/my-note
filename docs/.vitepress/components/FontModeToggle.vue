<script setup>
import { useFontMode } from '../composables/useFontMode.js'

const { mode } = useFontMode()
</script>

<template>
  <div class="font-mode-bar" role="group" aria-label="字体风格切换">
    <span class="font-mode-label-outer">字体</span>
    <div class="font-mode-track">
      <button
        class="font-mode-btn"
        :class="{ active: mode === 'classic' }"
        title="古典字体（思源宋体 + IBM Plex Serif）"
        aria-label="切换到古典字体"
        @click="mode = 'classic'"
      >
        <span class="font-mode-glyph">宋</span>
        <span class="font-mode-name">古典</span>
      </button>
      <span class="font-mode-sep" aria-hidden="true"></span>
      <button
        class="font-mode-btn"
        :class="{ active: mode === 'modern' }"
        title="现代字体（黑体 / Noto Sans）"
        aria-label="切换到现代字体"
        @click="mode = 'modern'"
      >
        <span class="font-mode-glyph">黑</span>
        <span class="font-mode-name">现代</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.font-mode-bar {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 56px;
  padding-top: 24px;
  border-top: 1px solid var(--vp-c-divider);
}

.font-mode-label-outer {
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--vp-c-text-3);
  font-family: 'Noto Serif TC', 'Noto Serif JP', serif;
  white-space: nowrap;
}

/* 轨道风格 */
.font-mode-track {
  display: inline-flex;
  align-items: stretch;
  border-radius: 10px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  overflow: hidden;
  backdrop-filter: blur(8px);
}

/* 分隔线 */
.font-mode-sep {
  width: 1px;
  background: var(--vp-c-divider);
  flex-shrink: 0;
}

.font-mode-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 18px;
  border: none;
  background: transparent;
  color: var(--vp-c-text-3);
  cursor: pointer;
  font-size: 12px;
  font-weight: 400;
  transition:
    background 0.25s,
    color 0.25s;
  line-height: 1;
  position: relative;
}

.font-mode-btn:hover {
  color: var(--vp-c-text-1);
  background: var(--vp-c-default-soft);
}

.font-mode-btn.active {
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg-elv);
  font-weight: 500;
}

/* 按钮图标 */
.font-mode-glyph {
  font-size: 15px;
  line-height: 1;
  opacity: 0.7;
}

.font-mode-btn:first-child .font-mode-glyph {
  font-family: 'Noto Serif TC', 'Noto Serif JP', serif;
}

.font-mode-btn:last-child .font-mode-glyph {
  font-family: 'PingFang TC', 'Noto Sans TC', sans-serif;
}

.font-mode-name {
  font-family: 'Noto Serif TC', 'Noto Serif JP', serif;
  letter-spacing: 0.04em;
  font-size: 12px;
}
</style>
