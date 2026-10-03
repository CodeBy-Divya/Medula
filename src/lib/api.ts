'use client'

// Client-side API helpers — always relative paths (gateway-safe)

async function get<T>(url: string): Promise<T> {
  const res = await fetch(url, { cache: 'no-store' })
  if (!res.ok) throw new Error(`GET ${url} → ${res.status}`)
  return res.json()
}

async function post<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`POST ${url} → ${res.status}`)
  return res.json()
}

import type {
  Profile, DashboardPayload, GraphPayload, ConceptDetail, QuestionClient, AttemptResult,
  RevisionPayload, ProgressPayload, RoadmapPayload, SearchResults,
} from './types'

export const api = {
  getProfile: () => get<{ profile: Profile | null }>('/api/profile'),
  saveProfile: (p: Record<string, unknown>) => post<{ profile: Profile }>('/api/profile', p),
  dashboard: () => get<DashboardPayload>('/api/dashboard'),
  graph: (scope: string) => get<GraphPayload>(`/api/graph?scope=${encodeURIComponent(scope)}`),
  concept: (id: string) => get<ConceptDetail>(`/api/concepts/${id}`),
  subjects: () => get<{ subjects: import('./types').SubjectSummary[] }>('/api/subjects'),
  subject: (id: string) => get<{ subject: import('./types').SubjectSummary; topics: import('./types').TopicSummary[] }>(`/api/subjects/${id}`),
  questions: (params: { subjectCode?: string; system?: string; conceptId?: string; count?: number; qtype?: string; mode?: string }) => {
    const q = new URLSearchParams(Object.entries(params).filter(([, v]) => v != null).map(([k, v]) => [k, String(v)])).toString()
    return get<{ questions: QuestionClient[] }>(`/api/questions?${q}`)
  },
  attempt: (body: { questionId: string; selected: string; timeMs?: number; confidence?: number }) =>
    post<AttemptResult>('/api/attempts', body),
  logErrorType: (body: { questionId: string; errorType: string }) =>
    post<{ ok: boolean }>('/api/attempts/error-type', body),
  revision: () => get<RevisionPayload>('/api/revision'),
  reviewFlashcard: (body: { flashcardId: string; grade: number }) => post<{ ok: boolean }>('/api/revision/review', body),
  clearRevisionItem: (body: { conceptId: string; minutes: number }) => post<{ ok: boolean }>('/api/revision/clear', body),
  logSession: (body: { minutes: number; kind: string; label?: string }) => post<{ ok: boolean }>('/api/sessions', body),
  cases: () => get<{ cases: { id: string; title: string; specialty: string; system: string; difficulty: number; patient: { age: string; sex: string; occupation: string; complaint: string }; attempted: boolean; lastScore: number | null }[] }>('/api/cases'),
  caseDetail: (id: string) => get<{ id: string; title: string; specialty: string; system: string; difficulty: number; patient: Record<string, string>; steps: { id: string; phase: string; title: string; content: string[]; question?: string; options?: string[] }[]; learning: string[]; attempted: boolean; lastScore: number | null }>(`/api/cases/${id}`),
  caseStep: (id: string, body: { stepId: string; choice: number }) =>
    post<{ correct: boolean; answerId: number; teaching: string }>(`/api/cases/${id}/step`, body),
  caseComplete: (id: string, body: { correctSteps: number; totalSteps: number; detail: unknown[] }) =>
    post<{ score: number }>(`/api/cases/${id}/complete`, body),
  tutor: (body: { messages: { role: 'user' | 'assistant'; content: string }[]; mode: string; conceptId?: string }) =>
    post<{ reply: string }>('/api/tutor', body),
  auditStart: () => post<import('./types').AuditPayload>('/api/audit', {}),
  auditSubmit: (body: { results: { questionId: string; selected: string }[] }) =>
    post<import('./types').AuditResultPayload>('/api/audit/submit', body),
  logbook: () => get<{ entries: import('./types').LogbookEntryClient[] }>('/api/logbook'),
  logbookCreate: (body: { caseType: string; system: string; diagnosis: string; learned: string }) =>
    post<{ entry: import('./types').LogbookEntryClient }>('/api/logbook', body),
  logbookDelete: (id: string) => fetch(`/api/logbook?id=${encodeURIComponent(id)}`, { method: 'DELETE' }).then(r => r.json()) as Promise<{ ok: boolean }>,
  roadmap: () => get<RoadmapPayload>('/api/roadmap'),
  progress: () => get<ProgressPayload>('/api/progress'),
  mapInsights: () => get<import('@/app/api/map-insights/route').MapInsights>('/api/map-insights'),
  search: (q: string) => get<SearchResults>(`/api/search?q=${encodeURIComponent(q)}`),
}
