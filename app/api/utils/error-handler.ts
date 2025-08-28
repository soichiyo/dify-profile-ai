import { NextResponse } from 'next/server'

export const handleApiError = (error: any, customMessage?: string, statusCode: number = 500) => {
  const message = error?.message || customMessage || 'server error'
  console.error(`[API Error] ${message}`, error)
  
  return NextResponse.json({ error: message }, { status: statusCode })
}

export const handleValidationError = (message: string) => {
  return NextResponse.json({ error: message }, { status: 400 })
}

export const handleNotFoundError = (resource: string = 'Resource') => {
  return NextResponse.json({ error: `${resource} not found` }, { status: 404 })
}