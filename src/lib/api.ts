import { useAuth } from '@clerk/expo'
import { useCallback, useRef } from 'react'
import { API_URL } from './theme'

async function parse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error((body as { error?: string }).error ?? `Request failed: ${res.status}`)
  }
  return res.json() as Promise<T>
}

/** Unauthenticated request (public endpoints: articles, series, newsletter, contact). */
export async function publicRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
  })
  return parse<T>(res)
}

/** Authenticated request hook — attaches the Clerk session token as a Bearer header. */
export function useApi() {
  const { getToken } = useAuth()
  // Keep getToken in a ref so `request` is a stable function; otherwise effects re-run forever.
  const getTokenRef = useRef(getToken)
  getTokenRef.current = getToken
  const request = useCallback(
    async <T,>(path: string, options: RequestInit = {}): Promise<T> => {
      const token = await getTokenRef.current()
      const res = await fetch(`${API_URL}${path}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...options.headers,
        },
      })
      return parse<T>(res)
    },
    [],
  )
  return { request }
}

// ── Types (mirror confessed-api responses) ─────────────────────────────────
export interface SeriesRef { id?: string; name: string; slug: string; icon?: string | null }

export interface Article {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content?: string
  tags: string[] | null
  readingTimeMinutes: number | null
  publishedAt: string | null
  authorId: string
  series: SeriesRef | null
}

export interface Series { id: string; name: string; slug: string }

export function formatDate(iso: string | null | undefined) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}
