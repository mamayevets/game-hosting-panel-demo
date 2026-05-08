import { createI18n } from 'vue-i18n'
import en from './locales/en.json'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en,
  },
})

export default i18n

export type Locale = 'en'
export const availableLocales: { code: Locale; label: string }[] = [
  { code: 'en', label: 'English' },
]
