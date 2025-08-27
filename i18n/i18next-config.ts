'use client'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import commonJa from './lang/common.ja'
import appJa from './lang/app.ja'
import toolsJa from './lang/tools.ja'

const resources = {
  ja: {
    translation: {
      common: commonJa,
      app: appJa,
      tools: toolsJa,
    },
  },
}

i18n.use(initReactI18next)
  .init({
    lng: 'ja',
    fallbackLng: 'ja',
    resources,
  })

export default i18n
