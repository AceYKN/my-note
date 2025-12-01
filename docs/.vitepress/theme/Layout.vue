<script setup>
import DefaultTheme from "vitepress/theme";
import { useData } from "vitepress";

const { Layout } = DefaultTheme;
// const { isDark } = useData();

// const toggleTheme = () => {
//   isDark.value = !isDark.value;
// };
</script>

<template>
  <Layout>
    <!-- <template #layout-bottom>
      <button class="theme-toggle-float" @click="toggleTheme" title="切换主题">
        <span v-if="isDark">🌙</span>
        <span v-else>☀️</span>
      </button>
    </template> -->
  </Layout>
</template>

<style scoped>
/* .theme-toggle-float {
  position: fixed;
  bottom: 40px;
  right: 40px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--vp-c-brand-1);
  color: white;
  border: none;
  font-size: 24px;
  cursor: pointer;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.theme-toggle-float:hover {
  transform: scale(1.1) rotate(15deg);
  background: var(--vp-c-brand-2);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.35);
}

.theme-toggle-float:active {
  transform: scale(0.95);
} */
</style>
