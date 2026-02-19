import { createI18n } from 'vue-i18n'
import en from './locales/en'
import es from './locales/es'

const savedLocale = localStorage.getItem('locale') || 'en'

export const i18n = createI18n({
  legacy: false,        // ✅ usar Composition API
  locale: savedLocale,
  fallbackLocale: 'en',
  messages: { en, es },
})