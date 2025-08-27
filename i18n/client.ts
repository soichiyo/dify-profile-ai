import type { Locale } from '.'

// 日本語のみの設定なので、常に'ja'を返す
export const getLocaleOnClient = (): Locale => {
  return 'ja'
}

export const setLocaleOnClient = (locale: Locale, notReload?: boolean) => {
  // 日本語のみの設定なので、何もしない
  if (!notReload)
    location.reload()
}
