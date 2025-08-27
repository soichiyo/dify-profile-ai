import { type NextRequest } from 'next/server'
import { ChatClient } from 'dify-client'
import { v4 } from 'uuid'
import { API_KEY, API_URL, APP_ID, BETA_USER_ID } from '@/config'

const userPrefix = `user_${APP_ID}:`

export const getInfo = (request: NextRequest) => {
  // explicit override via query: ?user=...
  try {
    const u = new URL(request.url).searchParams.get('user')
    if (u) {
      return {
        sessionId: '',
        user: u,
      }
    }
  } catch {}

  if (BETA_USER_ID) {
    return {
      sessionId: '',
      user: BETA_USER_ID,
    }
  }
  const sessionId = request.cookies.get('session_id')?.value || v4()
  const user = userPrefix + sessionId
  return {
    sessionId,
    user,
  }
}

export const setSession = (sessionId: string) => {
  if (BETA_USER_ID)
    return {}
  return { 'Set-Cookie': `session_id=${sessionId}` }
}

export const client = new ChatClient(API_KEY, API_URL || undefined)
