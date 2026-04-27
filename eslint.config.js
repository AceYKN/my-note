import js from '@eslint/js'
import vue from 'eslint-plugin-vue'
import prettier from 'eslint-config-prettier'

export default [
  { ignores: ['docs/.vitepress/dist/**', 'docs/.vitepress/cache/**', 'node_modules/**'] },
  js.configs.recommended,
  ...vue.configs['flat/recommended'],
  {
    files: ['docs/.vitepress/**/*.mjs'],
    languageOptions: {
      globals: {
        console: 'readonly',
        process: 'readonly'
      }
    }
  },
  {
    files: ['docs/.vitepress/**/*.{js,vue}'],
    languageOptions: {
      globals: {
        window: 'readonly',
        document: 'readonly',
        fetch: 'readonly',
        AbortController: 'readonly',
        performance: 'readonly'
      }
    }
  },
  prettier,
  {
    rules: {
      'vue/multi-word-component-names': 'off'
    }
  }
]
