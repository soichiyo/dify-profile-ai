import '@/i18n/i18next-config'
import I18nProvider from './components/i18n-provider'
import { getLocaleOnServer } from '@/i18n/server'

import './styles/globals.css'
import './styles/markdown.scss'
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

const LocaleLayout = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const locale = getLocaleOnServer()
  return (
    <html lang={locale ?? 'ja'} className="h-full">
      <body className={`h-full bg-gray-50 text-gray-900 antialiased ${inter.className}`}>
        <I18nProvider>
          <div className="overflow-x-hidden overflow-y-auto">
            <div className="w-screen h-[100dvh] min-w-[300px]">
              {children}
            </div>
          </div>
        </I18nProvider>
      </body>
    </html>
  )
}

export default LocaleLayout
