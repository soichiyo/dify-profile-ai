import type { IOnCompleted, IOnData, IOnError, IOnFile, IOnMessageEnd, IOnMessageReplace, IOnNodeFinished, IOnNodeStarted, IOnThought, IOnWorkflowFinished, IOnWorkflowStarted } from './base'
import { get, post, ssePost } from './base'
import type { Feedbacktype } from '@/types/app'

export const sendChatMessage = async (
  body: Record<string, any>,
  {
    onData,
    onCompleted,
    onThought,
    onFile,
    onError,
    getAbortController,
    onMessageEnd,
    onMessageReplace,
    onWorkflowStarted,
    onNodeStarted,
    onNodeFinished,
    onWorkflowFinished,
  }: {
    onData: IOnData
    onCompleted: IOnCompleted
    onFile: IOnFile
    onThought: IOnThought
    onMessageEnd: IOnMessageEnd
    onMessageReplace: IOnMessageReplace
    onError: IOnError
    getAbortController?: (abortController: AbortController) => void
    onWorkflowStarted: IOnWorkflowStarted
    onNodeStarted: IOnNodeStarted
    onNodeFinished: IOnNodeFinished
    onWorkflowFinished: IOnWorkflowFinished
  },
) => {
  return ssePost('chat-messages', {
    body: {
      ...body,
      response_mode: 'streaming',
    },
  }, { onData, onCompleted, onThought, onFile, onError, getAbortController, onMessageEnd, onMessageReplace, onNodeStarted, onWorkflowStarted, onWorkflowFinished, onNodeFinished })
}

export const fetchConversations = async () => {
  return get('conversations', { params: { limit: 100, first_id: '' } })
}

export const fetchChatList = async (conversationId: string) => {
  return get('messages', { params: { conversation_id: conversationId, limit: 20, last_id: '' } })
}

// init value. wait for server update
export const fetchAppParams = async () => {
  return get('parameters')
}

export const updateFeedback = async ({ url, body }: { url: string; body: Feedbacktype }) => {
  return post(url, { body })
}

export const generationConversationName = async (id: string) => {
  return post(`conversations/${id}/name`, { body: { auto_generate: true } })
}

// ========== logging (local DB via Next API) ==========
export const logMessageEnd = async (body: { message_id: string; conversation_id: string; query?: string; answer?: string }) => {
  return post('logs/message', { body })
}

export const logWorkflowFinished = async (body: { workflow_run_id: string; conversation_id: string; message_id: string; status: string; error?: string }) => {
  return post('logs/workflow', { body })
}

export const logNodeFinished = async (body: { run_id: string; node_id: string; title?: string; status: string; error?: string }) => {
  return post('logs/node', { body })
}

// sync user memory from Dify conversation variables to local DB
export const syncMemoryFromConversation = async (conversationId: string, replace = false) => {
  const params = new URLSearchParams()
  params.set('conversation_id', conversationId)
  if (replace) params.set('replace', '1')
  return get(`memory/sync?${params.toString()}`)
}

// sync conversation memory from Dify conversation variables to local DB  
export const syncConversationMemoryFromDify = async (conversationId: string, replace = false) => {
  const params = new URLSearchParams()
  params.set('conversation_id', conversationId)
  if (replace) params.set('replace', '1')
  return get(`conversation-memory/sync?${params.toString()}`)
}

// get conversation memory from local DB
export const getConversationMemory = async (conversationId: string) => {
  const params = new URLSearchParams()
  params.set('conversation_id', conversationId)
  return get(`conversation-memory?${params.toString()}`)
}

// get conversation memory history from local DB
export const getConversationMemoryHistory = async (conversationId: string, limit = 50) => {
  const params = new URLSearchParams()
  params.set('conversation_id', conversationId)
  params.set('limit', limit.toString())
  return get(`conversation-memory/history?${params.toString()}`)
}
