import type { ChemistryVisitResult, ChemistryVisitor, PersonaTypeKey } from '../types'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string

export interface GenerateCodeResponse {
  sharerCode: string
  sharerType: PersonaTypeKey
}

export interface MyVisitorsResponse {
  sharerCode: string
  sharerType: PersonaTypeKey
  /** 공유자가 남긴 닉네임을 마스킹한 값이에요. 백엔드가 아직 안 내려주면 undefined일 수 있어요. */
  sharerNickname?: string | null
  visitorCount: number
  visitors: ChemistryVisitor[]
}

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${BACKEND_URL}${path}`, init)
  if (!response.ok) {
    throw new Error(`케미 API 요청에 실패했어요 (${response.status})`)
  }
  return response.json() as Promise<T>
}

export function generateChemistryCode(
  sharerType: PersonaTypeKey,
  nickname?: string | null,
): Promise<GenerateCodeResponse> {
  return requestJson<GenerateCodeResponse>('/api/chemistry/generate-code', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sharerType, nickname: nickname ?? null }),
  })
}

export function visitChemistry(
  sharerCode: string,
  visitorType: PersonaTypeKey,
  nickname?: string | null,
): Promise<ChemistryVisitResult> {
  return requestJson<ChemistryVisitResult>('/api/chemistry/visit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sharerCode, visitorType, nickname: nickname ?? null }),
  })
}

export function fetchMyVisitors(code: string): Promise<MyVisitorsResponse> {
  return requestJson<MyVisitorsResponse>(`/api/chemistry/my-visitors?code=${encodeURIComponent(code)}`)
}
