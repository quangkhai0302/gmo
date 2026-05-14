import axios from 'axios'

export interface ApiErrorPayload {
  code?: number
  message?: string
  errors?: Record<string, string> | null
}

export interface ParsedApiError {
  summary: string
  fieldErrors: Record<string, string>
}

export function parseApiError(error: unknown, fallback: string): ParsedApiError {
  if (!axios.isAxiosError(error)) {
    return { summary: fallback, fieldErrors: {} }
  }

  const payload = error.response?.data as ApiErrorPayload | undefined
  const fieldErrors = payload?.errors ?? {}

  const summaryFromFields = Object.values(fieldErrors)[0]
  const summary = summaryFromFields ?? payload?.message ?? fallback

  return { summary, fieldErrors }
}
