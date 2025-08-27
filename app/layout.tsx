import '@/i18n/i18next-config'
import I18nProvider from './components/i18n-provider'
import { getLocaleOnServer } from '@/i18n/server'

import './styles/globals.css'
import './styles/markdown.scss'

const LocaleLayout = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const locale = getLocaleOnServer()
  return (
    <html lang={locale ?? 'ja'} className="h-full">
      <body className="h-full">
        <I18nProvider>
          <div className="overflow-x-auto">
            <div className="w-screen h-screen min-w-[300px]">
              {children}
            </div>
          </div>
        </I18nProvider>
      </body>
    </html>
  )
}

export default LocaleLayout
