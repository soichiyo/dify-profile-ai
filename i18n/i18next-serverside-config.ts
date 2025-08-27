import { createInstance } from 'i18next'
import resourcesToBackend from 'i18next-resources-to-backend'
import { initReactI18next } from 'react-i18next/initReactI18next'

const initI18next = async (ns: string) => {
  const i18nInstance = createInstance()
  await i18nInstance
    .use(initReactI18next)
    .use(resourcesToBackend((language: string, namespace: string) => import(`./lang/${namespace}.ja.ts`)))
    .init({
      lng: 'ja',
      ns,
      fallbackLng: 'ja',
    })
  return i18nInstance
}

export async function useTranslation(ns = '', options: Record<string, any> = {}) {
  const i18nextInstance = await initI18next(ns)
  return {
    t: i18nextInstance.getFixedT('ja', ns, options.keyPrefix),
    i18n: i18nextInstance,
  }
}
