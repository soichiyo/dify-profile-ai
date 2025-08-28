export const API_TIMEOUTS = {
  CHAT_MESSAGE: 100000,
  FILE_UPLOAD: 300000,
  DEFAULT: 30000,
} as const

export const UI_CONSTANTS = {
  MAX_INPUT_LENGTH: 48,
  CHAT_SCROLL_THRESHOLD: 200,
  DEFAULT_PAGINATION_LIMIT: 50,
} as const

export const CONTENT_TYPES = {
  JSON: 'application/json',
  FORM_DATA: 'multipart/form-data',
  TEXT_STREAM: 'text/plain',
  EVENT_STREAM: 'text/event-stream',
} as const

export const HTTP_STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const

export const DATABASE_TABLES = [
  'ConversationMemory',
  'ConversationMemoryHistory',
  'MessageLog',
  'UserMemory',
  'WorkflowRunLog',
  'WorkflowNodeLog',
] as const