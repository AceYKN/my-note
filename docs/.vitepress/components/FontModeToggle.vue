<script setup>
import { useFontMode } from '../composables/useFontMode.js'

const { mode } = useFontMode()
</script>

<template>
  <div class="font-mode-bar" role="group" aria-label="書體風格選擇">
    <span class="font-mode-label-outer">書體</span>
    <div class="font-mode-track">
      <button
        class="font-mode-btn"
        :class="{ active: mode === 'classic' }"
        title="古韻書體（思源宋體 + IBM Plex Serif）"
        aria-label="切換至古韻書體"
        @click="mode = 'classic'"
      >
        <span class="font-mode-glyph">雅</span>
        <span class="font-mode-name">古韻</span>
      </button>
      <span class="font-mode-sep" aria-hidden="true"></span>
      <button
        class="font-mode-btn"
        :class="{ active: mode === 'modern' }"
        title="時新書體（苹方 / Noto Sans）"
        aria-label="切換至時新書體"
        @click="mode = 'modern'"
      >
        <span class="font-mode-glyph">今</span>
        <span class="font-mode-name">時新</span>
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

/* 分组容器：玻璃质感圆角矩形 */
.font-mode-track {
  display: inline-flex;
  align-items: stretch;
  border-radius: 10px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  overflow: hidden;
  backdrop-filter: blur(8px);
}

/* 中间分隔竖线 */
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

/* 大字：以不同衬线/无衬线预览当前模式字形 */
.font-mode-glyph {
  font-size: 15px;
  line-height: 1;
  opacity: 0.7;
}

/* 大字：以不同衬线/无衬线预览当前模式字形 */
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
