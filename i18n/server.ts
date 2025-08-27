import 'server-only'

import { cookies } from 'next/headers'
import type { Locale } from '.'

export const getLocaleOnServer = (): Locale => {
  // 日本語のみの設定なので、常に'ja'を返す
  return 'ja'
}
