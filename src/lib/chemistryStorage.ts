const SHARER_CODE_KEY = 'ai-persona-card:sharer-code'
const SHARER_NICKNAME_KEY = 'ai-persona-card:sharer-nickname'

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

/** 공유자(나) 본인이 남긴 닉네임이 있으면 돌려줘요. 없거나 저장소에 접근할 수 없으면 null이에요. */
export function getStoredSharerNickname(): string | null {
  try {
    return window.localStorage.getItem(SHARER_NICKNAME_KEY)
  } catch {
    return null
  }
}

/** 다음에 다시 들어와도 같은 닉네임으로 코드를 발급하도록 저장해요. 저장 실패해도 공유 흐름은 계속돼요. */
export function storeSharerNickname(nickname: string): void {
  try {
    window.localStorage.setItem(SHARER_NICKNAME_KEY, nickname)
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
