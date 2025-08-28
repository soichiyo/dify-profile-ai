export interface ApiResponse<T = any> {
  data?: T
  error?: string
  success?: boolean
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  data: T[]
  meta: {
    total: number
    limit: number
    count: number
  }
}

export interface DatabaseTableResponse<T = any> {
  table: string
  count: number
  limit: number
  data: T[]
}

export interface LogEntry {
  message_id: string
  conversation_id: string
  query?: string
  answer?: string
}

export interface WorkflowLogEntry {
  workflow_run_id: string
  conversation_id: string
  message_id: string
  status: string
  error?: string
}

export interface NodeLogEntry {
  run_id: string
  node_id: string
  title?: string
  status: string
  error?: string
}