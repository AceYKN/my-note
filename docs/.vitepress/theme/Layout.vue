<script setup>
import DefaultTheme from "vitepress/theme";
import ReadingProgress from "../components/ReadingProgress.vue";
import BackToTop from "../components/BackToTop.vue";
import { onMounted, onUnmounted } from "vue";

const { Layout } = DefaultTheme;

let lastScrollY = 0;
let ticking = false;

function onScroll() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    const currentY = window.scrollY;
    const nav = document.querySelector('.VPNav');
    const localNav = document.querySelector('.VPLocalNav');
    if (currentY > lastScrollY && currentY > 80) {
      nav?.classList.add('nav-hidden');
      localNav?.classList.add('local-nav-hidden');
    } else {
      nav?.classList.remove('nav-hidden');
      localNav?.classList.remove('local-nav-hidden');
    }
    lastScrollY = currentY;
    ticking = false;
  });
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll);
});
</script>

<template>
  <Layout>
    <template #layout-top>
      <ReadingProgress />
    </template>
    
    <template #layout-bottom>
      <BackToTop />
    </template>
  </Layout>
</template>

<style scoped>
</style>
