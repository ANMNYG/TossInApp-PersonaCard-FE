const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string

/**
 * 오늘 카드를 만든 방문자 수를 가져와요. 백엔드 스펙이 확정되면 응답 필드명만 맞춰주면 돼요.
 * 실패하면 호출하는 쪽에서 숫자 없는 문구로 자연스럽게 폴백해요.
 */
export async function fetchVisitorCount(): Promise<number> {
  const response = await fetch(`${BACKEND_URL}/api/stats/visitor-count`)
  if (!response.ok) {
    throw new Error(`방문자 수 API 요청에 실패했어요 (${response.status})`)
  }

  const data = (await response.json()) as { count?: unknown }
  if (typeof data.count !== 'number') {
    throw new Error('방문자 수 응답 형식이 예상과 달라요')
  }

  return data.count
}
