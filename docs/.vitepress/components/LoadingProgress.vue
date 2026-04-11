<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vitepress'

const visible = ref(false)
const progress = ref(0)
const done = ref(false)
let timer = null
let endTimer = null

function start() {
  clearTimeout(endTimer)
  done.value = false
  visible.value = true
  progress.value = 0

  // 快速推进到 80%，然后放缓
  let target = 80
  let step = () => {
    if (progress.value < target) {
      progress.value += (target - progress.value) * 0.06 + 0.4
      if (progress.value >= target) progress.value = target
      timer = setTimeout(step, 30)
    }
  }
  timer = setTimeout(step, 30)
}

function finish() {
  clearTimeout(timer)
  progress.value = 100
  done.value = true
  endTimer = setTimeout(() => {
    visible.value = false
    progress.value = 0
    done.value = false
  }, 400)
}

onMounted(() => {
  const router = useRouter()
  router.onBeforeRouteChange = () => { start() }
  router.onAfterRouteChanged = () => { finish() }
})
</script>

<template>
  <Transition name="lp-fade">
    <div
      v-if="visible"
      class="loading-progress-bar"
      :class="{ done }"
      :style="{ width: progress + '%' }"
    />
  </Transition>
</template>

<style scoped>
.loading-progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  height: 2px;
  background: linear-gradient(
    90deg,
    var(--lg-iridescent-1),
    var(--lg-iridescent-3),
    var(--lg-iridescent-2),
    var(--lg-iridescent-5)
  );
  background-size: 300% 100%;
  animation: lg-shimmer 2s ease-in-out infinite;
  z-index: 9999;
  transition: width 0.25s ease-out;
  box-shadow: 0 0 10px var(--lg-accent-glow, rgba(91, 155, 213, 0.5));
  pointer-events: none;
}

.loading-progress-bar.done {
  transition: width 0.15s ease-out;
}

.lp-fade-leave-active {
  transition: opacity 0.3s ease 0.05s;
}
.lp-fade-leave-to {
  opacity: 0;
}
</style>
