const SHARER_CODE_KEY = 'ai-persona-card:sharer-code'

/** 예전에 발급받은 케미 공유 코드가 있으면 돌려줘요. 없거나 저장소에 접근할 수 없으면 null이에요. */
export function getStoredSharerCode(): string | null {
  try {
    return window.localStorage.getItem(SHARER_CODE_KEY)
  } catch {
    return null
  }
}

/** 앱을 나갔다 다시 들어와도 같은 코드를 쓰도록 저장해요. 저장에 실패해도 공유 흐름은 계속돼요. */
export function storeSharerCode(code: string): void {
  try {
    window.localStorage.setItem(SHARER_CODE_KEY, code)
  } catch {
    // no-op
  }
}

/** 친구의 공유 링크로 들어왔는지 URL의 ?ref= 파라미터로 확인해요. */
export function getReferralCodeFromUrl(): string | null {
  try {
    return new URLSearchParams(window.location.search).get('ref')
  } catch {
    return null
  }
}
