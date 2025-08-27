import type { AppInfo } from '@/types/app'
export const APP_ID = `${process.env.NEXT_PUBLIC_APP_ID}`
export const API_KEY = `${process.env.NEXT_PUBLIC_APP_KEY}`
export const API_URL = `${process.env.NEXT_PUBLIC_API_URL}`
export const BETA_USER_ID = process.env.BETA_USER_ID || ''
export const MEMORY_PUSH_TOKEN = process.env.MEMORY_PUSH_TOKEN || ''
export const APP_INFO: AppInfo = {
  title: 'Prairie AI Beta',
  description: '私は、あなたの目標達成に最適な人物との出会いを創出するAI、Prairie AIです。',
  copyright: 'Studio Prairie Inc.',
  privacy_policy: '',
  default_language: 'ja',
}

export const isShowPrompt = false
export const promptTemplate = 'I want you to act as a javascript console.'

export const API_PREFIX = '/api'

export const LOCALE_COOKIE_NAME = 'locale'

export const DEFAULT_VALUE_MAX_LEN = 48
