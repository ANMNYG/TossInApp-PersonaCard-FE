import { useState, type FormEvent } from 'react'

const NICKNAME_MAX_LENGTH = 10

export interface NicknamePromptProps {
  /** 닉네임을 입력하고 확인했을 때 호출돼요. */
  onSubmit: (nickname: string) => void
  /** 입력 없이 건너뛸 때 호출돼요. */
  onSkip: () => void
}

/** 방문자가 케미 결과를 보기 전에, 상대방이 알아볼 수 있도록 닉네임을 선택적으로 남기는 화면이에요. */
export function NicknamePrompt({ onSubmit, onSkip }: NicknamePromptProps) {
  const [nickname, setNickname] = useState('')

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    const trimmed = nickname.trim()
    if (trimmed.length === 0) {
      onSkip()
      return
    }
    onSubmit(trimmed)
  }

  return (
    <form className="nickname-box" onSubmit={handleSubmit}>
      <p className="nickname-guide">닉네임을 남기면 상대방이 더 쉽게 알아볼 수 있어요 (선택)</p>
      <input
        type="text"
        className="nickname-input"
        placeholder="닉네임 (최대 10자)"
        value={nickname}
        maxLength={NICKNAME_MAX_LENGTH}
        onChange={(event) => setNickname(event.target.value)}
      />
      <button type="submit" className="btn">
        확인
      </button>
      <button type="button" className="skip-link" onClick={onSkip}>
        건너뛰기
      </button>
    </form>
  )
}
