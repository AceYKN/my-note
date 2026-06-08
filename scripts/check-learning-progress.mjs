import assert from 'node:assert/strict'
import {
  LEARNING_PROGRESS_STORAGE_KEY,
  createResumeLearningUrl,
  createEmptyLearningState,
  getContinueLearningItems,
  getLearningPageProgress,
  recordLearningPageProgress,
  recordLearningPageVisit
} from '../docs/.vitepress/utils/learningProgress.js'

assert.equal(LEARNING_PROGRESS_STORAGE_KEY, 'studiorum.learning-progress.v1')

const first = recordLearningPageVisit(createEmptyLearningState(), {
  path: 'code/vue/08-pinia.md',
  title: 'Pinia 状态管理',
  url: '/my-note/code/vue/08-pinia',
  now: 1000
})

const progressed = recordLearningPageProgress(first, {
  path: 'code/vue/08-pinia.md',
  progress: 42,
  now: 1200
})

assert.equal(progressed.pages['code/vue/08-pinia.md'].progress, 42)
assert.equal(progressed.pages['code/vue/08-pinia.md'].url, '/code/vue/08-pinia')
assert.equal(progressed.pages['code/vue/08-pinia.md'].completedAt, null)

const capped = recordLearningPageProgress(progressed, {
  path: 'code/vue/08-pinia.md',
  progress: 8,
  now: 1300
})

assert.equal(capped.pages['code/vue/08-pinia.md'].progress, 42)

const completed = recordLearningPageProgress(capped, {
  path: 'code/vue/08-pinia.md',
  progress: 96,
  now: 1400
})

assert.equal(completed.pages['code/vue/08-pinia.md'].completedAt, 1400)

let state = completed
state = recordLearningPageVisit(state, {
  path: 'cs/os/note/chap9.md',
  title: 'chap9',
  url: '/cs/os/note/chap9',
  now: 2000
})
state = recordLearningPageVisit(state, {
  path: 'cs/db/100+70/Day06-数据库70题-试题01-11.md',
  title: 'Day06 数据库 70 题',
  url: '/cs/db/100+70/Day06-数据库70题-试题01-11',
  now: 3000
})
state = recordLearningPageVisit(state, {
  path: 'code/vue/08-pinia.md',
  title: 'Pinia 状态管理',
  url: '/code/vue/08-pinia',
  now: 4000
})

const items = getContinueLearningItems(state, { limit: 3 })

assert.deepEqual(
  items.map((item) => item.path),
  ['code/vue/08-pinia.md', 'cs/db/100+70/Day06-数据库70题-试题01-11.md', 'cs/os/note/chap9.md']
)
assert.equal(items[0].progress, 96)
assert.equal(items[0].completed, true)
assert.equal(items[0].resumeUrl, '/code/vue/08-pinia?resume=1')
assert.equal(items[1].section, 'DB')
assert.equal(items[2].section, 'OS')
assert.equal(getLearningPageProgress(state, 'code/vue/08-pinia.md'), 96)
assert.equal(
  createResumeLearningUrl('/my-note/cs/os/note/chap9.html?x=1'),
  '/cs/os/note/chap9?x=1&resume=1'
)

const notFoundState = recordLearningPageVisit(createEmptyLearningState(), {
  path: '404.md',
  title: 'Page Not Found',
  url: '/my-note/missing-page',
  now: 5000
})

assert.deepEqual(getContinueLearningItems(notFoundState), [])
