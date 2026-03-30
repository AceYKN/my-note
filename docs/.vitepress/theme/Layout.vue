<script setup>
import DefaultTheme from "vitepress/theme";
import ReadingProgress from "../components/ReadingProgress.vue";
import BackToTop from "../components/BackToTop.vue";
import { useScrollHideNav } from "../composables/useScrollHideNav";

const { Layout } = DefaultTheme;

useScrollHideNav();
</script>

<template>
  <!-- Liquid Glass animated iridescent background -->
  <div class="lg-background" aria-hidden="true"></div>

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
