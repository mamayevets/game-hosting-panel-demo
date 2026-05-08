import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import i18n, { availableLocales } from './i18n'
import './assets/main.css'

try {
  const saved = localStorage.getItem('locale')
  if (saved && availableLocales.some(l => l.code === saved)) {
    document.documentElement.lang = saved
  } else {
    document.documentElement.lang = 'uk'
  }
} catch (_) {}

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(i18n)
app.mount('#app')
