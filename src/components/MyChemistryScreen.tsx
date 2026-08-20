import { useEffect, useState } from 'react'
import { PERSONAS } from '../data/personas'
import { fetchMyVisitors } from '../lib/chemistryApi'
import { personaIcon } from '../lib/interpretation'
import type { ChemistryVisitor } from '../types'

export interface MyChemistryScreenProps {
  sharerCode: string
  onBack: () => void
}

type LoadState =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'success'; visitorCount: number; visitors: ChemistryVisitor[] }

/** 공유 코드로 들어온 방문자들의 케미 결과를 최신순으로 모아 보여주는 화면이에요. */
export function MyChemistryScreen({ sharerCode, onBack }: MyChemistryScreenProps) {
  const [state, setState] = useState<LoadState>({ status: 'loading' })

  useEffect(() => {
    let cancelled = false
    setState({ status: 'loading' })

    fetchMyVisitors(sharerCode)
      .then((data) => {
        if (cancelled) return
        const visitors = [...data.visitors].sort(
          (a, b) => new Date(b.visitedAt).getTime() - new Date(a.visitedAt).getTime(),
        )
        setState({ status: 'success', visitorCount: data.visitorCount, visitors })
      })
      .catch((error: unknown) => {
        if (cancelled) return
        console.error('내 케미 목록을 불러오지 못했어요', error)
        setState({ status: 'error' })
      })

    return () => {
      cancelled = true
    }
  }, [sharerCode])

  return (
    <div className="screen screen-my-chemistry">
      <div className="eyebrow">내 케미 모아보기</div>
      <h1 className="display display-sm">
        내 카드로
        <br />
        누가 케미를 봤을까요
      </h1>

      {state.status === 'loading' && <div className="chemistry-list-status">불러오고 있어요...</div>}

      {state.status === 'error' && (
        <div className="chemistry-list-status">
          목록을 불러오지 못했어요. 잠시 후 다시 시도해주세요.
        </div>
      )}

      {state.status === 'success' && state.visitorCount === 0 && (
        <div className="chemistry-list-status">
          아직 케미를 확인한 친구가 없어요, 카드를 더 공유해보세요
        </div>
      )}

      {state.status === 'success' && state.visitorCount > 0 && (
        <div className="chemistry-visitor-list">
          {state.visitors.map((visitor, index) => {
            const persona = PERSONAS[visitor.visitorType]
            return (
              <div className="chemistry-visitor-card" key={`${visitor.visitedAt}-${index}`}>
                <span className="chemistry-visitor-icon" aria-hidden="true">
                  {personaIcon(persona)}
                </span>
                <div className="chemistry-visitor-body">
                  <div className="chemistry-visitor-title">{persona.title}</div>
                  <p className="chemistry-visitor-desc">{visitor.compatibility.description}</p>
                </div>
                <div className="chemistry-visitor-score">{visitor.compatibility.score}</div>
              </div>
            )
          })}
        </div>
      )}

      <div className="spacer" />
      <button type="button" className="btn-ghost" onClick={onBack}>
        돌아가요
      </button>
    </div>
  )
}
