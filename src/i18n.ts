import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import uk from './locales/uk.json'

const savedLocale = localStorage.getItem('locale') || 'uk'

const i18n = createI18n({
  legacy: false,
  locale: savedLocale,
  fallbackLocale: 'en',
  messages: {
    en,
    uk,
  },
})

export default i18n

export function setLocale(locale: 'en' | 'uk') {
  i18n.global.locale.value = locale
  localStorage.setItem('locale', locale)
  document.documentElement.lang = locale
}

export type Locale = 'en' | 'uk'
export const availableLocales: { code: Locale; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'uk', label: 'Українська' },
]
