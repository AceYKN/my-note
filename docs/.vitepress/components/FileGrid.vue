<script setup>
import { withBase } from 'vitepress'

defineProps({
  sections: {
    type: Array,
    required: true
  }
})

function isExternal(link) {
  return /^https?:\/\//.test(link)
}

function href(link) {
  return isExternal(link) ? link : withBase(link)
}
</script>

<template>
  <div class="fg-wrapper">
    <div v-for="(section, i) in sections" :key="i" class="fg-section">
      <h2 class="fg-section-title">{{ section.title }}</h2>
      <div class="fg-grid">
        <a
          v-for="(item, j) in section.items"
          :key="j"
          :href="href(item.link)"
          class="fg-card"
          v-bind="isExternal(item.link) ? { target: '_blank', rel: 'noopener' } : {}"
        >
          <span class="fg-name">{{ item.name }}</span>
          <span v-if="item.desc" class="fg-desc">{{ item.desc }}</span>
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fg-section {
  margin-bottom: 2rem;
}

.fg-section-title {
  font-size: 1.1em !important;
  font-weight: 600 !important;
  margin-bottom: 1rem !important;
  padding: 0 !important;
  border: none !important;
  background: none !important;
  box-shadow: none !important;
  color: var(--lg-text-primary) !important;
}

.fg-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 0.85rem;
}

.fg-card {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  padding: 1rem 1.2rem;
  background: var(--lg-glass-bg, rgba(255, 255, 255, 0.38));
  backdrop-filter: blur(32px) saturate(160%);
  -webkit-backdrop-filter: blur(32px) saturate(160%);
  border: 1px solid var(--lg-glass-border, rgba(255, 255, 255, 0.45));
  border-radius: 12px;
  box-shadow: var(--lg-glass-shadow, 0 4px 16px rgba(0, 0, 0, 0.06));
  text-decoration: none;
  color: inherit;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.fg-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--lg-glass-shadow-elevated, 0 8px 32px rgba(0, 0, 0, 0.1));
  border-color: var(--lg-accent, #2a5fa0);
}

.fg-name {
  font-size: 0.98em;
  font-weight: 650;
  color: var(--lg-text-primary);
  letter-spacing: -0.01em;
}

.fg-desc {
  font-size: 0.78em;
  color: var(--lg-text-secondary);
  line-height: 1.4;
}
</style>
