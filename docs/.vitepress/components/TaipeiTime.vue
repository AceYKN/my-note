<template>
  <section class="taipei-time" aria-label="Taipei time widget">
    <div class="tt-header">
      <span class="tt-city">Taipei</span>
      <span class="tt-zone">UTC+8</span>
    </div>
    <p class="tt-time">{{ currentTime }}</p>
    <p class="tt-date">{{ currentDate }}</p>
  </section>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'

const currentTime = ref('--:--:--')
const currentDate = ref('----/--/--')
let tickTimerId = null
let resyncTimerId = null
let syncedEpochMs = null
let syncedAtPerfMs = null

const NETWORK_SYNC_INTERVAL_MS = 5 * 60 * 1000

async function fetchJsonWithTimeout(url, timeoutMs = 5000) {
  const controller = new AbortController()
  const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs)

  try {
    const response = await fetch(url, { signal: controller.signal })
    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`)
    }
    return await response.json()
  } finally {
    window.clearTimeout(timeoutId)
  }
}

function parseTimeApiTaipeiEpochMs(data) {
  if (
    typeof data?.year !== 'number' ||
    typeof data?.month !== 'number' ||
    typeof data?.day !== 'number' ||
    typeof data?.hour !== 'number' ||
    typeof data?.minute !== 'number' ||
    typeof data?.seconds !== 'number'
  ) {
    return null
  }

  const milliSeconds = typeof data.milliSeconds === 'number' ? data.milliSeconds : 0
  return Date.UTC(
    data.year,
    data.month - 1,
    data.day,
    data.hour - 8,
    data.minute,
    data.seconds,
    milliSeconds,
  )
}

async function getTaipeiEpochFromNetwork() {
  try {
    const worldTimeData = await fetchJsonWithTimeout('https://worldtimeapi.org/api/timezone/Asia/Taipei')
    if (typeof worldTimeData?.datetime === 'string') {
      const ms = Date.parse(worldTimeData.datetime)
      if (Number.isFinite(ms)) return ms
    }
    if (typeof worldTimeData?.unixtime === 'number') {
      return worldTimeData.unixtime * 1000
    }
  } catch {
    // Fallback to secondary provider.
  }

  const timeApiData = await fetchJsonWithTimeout('https://timeapi.io/api/Time/current/zone?timeZone=Asia/Taipei')
  const parsedMs = parseTimeApiTaipeiEpochMs(timeApiData)
  if (parsedMs === null) {
    throw new Error('Invalid time response')
  }
  return parsedMs
}

function getCurrentEpochMs() {
  if (syncedEpochMs === null || syncedAtPerfMs === null) {
    return Date.now()
  }
  return syncedEpochMs + (performance.now() - syncedAtPerfMs)
}

function updateTaipeiTime() {
  const now = new Date(getCurrentEpochMs())

  currentTime.value = new Intl.DateTimeFormat('zh-TW', {
    timeZone: 'Asia/Taipei',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(now)

  const datePart = new Intl.DateTimeFormat('zh-TW', {
    timeZone: 'Asia/Taipei',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now)

  const weekdayPart = new Intl.DateTimeFormat('ja-JP', {
    timeZone: 'Asia/Taipei',
    weekday: 'long',
  }).format(now)

  currentDate.value = `${datePart} ${weekdayPart}`
}

async function syncFromNetworkTime() {
  try {
    const networkEpochMs = await getTaipeiEpochFromNetwork()
    syncedEpochMs = networkEpochMs
    syncedAtPerfMs = performance.now()
  } catch {
    // Keep displaying local device time when network sync fails.
  }
  updateTaipeiTime()
}

onMounted(() => {
  updateTaipeiTime()
  tickTimerId = window.setInterval(updateTaipeiTime, 1000)

  void syncFromNetworkTime()
  resyncTimerId = window.setInterval(() => {
    void syncFromNetworkTime()
  }, NETWORK_SYNC_INTERVAL_MS)
})

onBeforeUnmount(() => {
  if (tickTimerId !== null) {
    window.clearInterval(tickTimerId)
    tickTimerId = null
  }
  if (resyncTimerId !== null) {
    window.clearInterval(resyncTimerId)
    resyncTimerId = null
  }
})
</script>

<style scoped>
.taipei-time {
  margin: 1.2rem auto 0;
  max-width: 22rem;
  padding: 0.95rem 1rem;
  border-radius: 16px;
  border: 1px solid color-mix(in srgb, var(--vp-c-divider) 65%, transparent);
  background: color-mix(in srgb, var(--vp-c-bg-soft) 82%, transparent);
  text-align: center;
}

.tt-header {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.35rem;
}

.tt-city {
  font-size: 0.86rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.tt-zone {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.15rem 0.45rem;
  border-radius: 999px;
  background: color-mix(in srgb, var(--vp-c-brand-1) 16%, transparent);
  color: var(--vp-c-brand-1);
}

.tt-time {
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
  line-height: 1.1;
  font-variant-numeric: tabular-nums;
}

.tt-date {
  margin: 0.25rem 0 0;
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
}

@media (max-width: 640px) {
  .taipei-time {
    max-width: 19rem;
  }

  .tt-time {
    font-size: 1.75rem;
  }
}
</style>
