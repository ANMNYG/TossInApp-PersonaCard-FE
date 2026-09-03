# ai-persona-card

7개 질문에 답하면 4원소(불/물/땅/바람) 기반의 16가지 페르소나 카드를 만들고, 친구와 케미(궁합)까지 확인하는 앱인토스 미니앱이에요.

**스택**: React 19 · TypeScript · Vite 8 · Apps in Toss (Toss 미니앱 플랫폼)

프론트엔드 레포예요. 케미 API 백엔드는 별도 레포(`TossInApp-PersonaCard-BE`, Vercel 배포)로 관리해요.

## 주요 기능

- **원소 퀴즈 → 16타입**: 7문항에 답하면 원소별 점수를 매겨 1등(주원소)·2등(보조원소)을 뽑아요. 1·2등 점수차가 3 이상이면 순수형 4종, 미만이면 혼합형(주-보조) 12종 — 합쳐서 16타입이에요.
- **타로카드 스타일 결과 카드**: 서버 이미지 생성 없이 클라이언트 `<canvas>`에서 그려요. 점수 벡터로 만든 시드가 별자리·엠블럼 배치를 결정해서, 같은 답변은 항상 같은 카드가 나와요. 뒷면 → 앞면 3D flip으로 공개돼요.
- **개인화 해설**: "왜 이 타입일까요?" 박스에서 사용자가 실제로 고른 선택지를 인용해 근거·강점·어울리는 타입·반대 타입을 서술해요.
- **공유 잠금 성장 장치**: 결과 카드는 처음엔 블러·워터마크로 잠겨 있고, 공유하면 열려요. "공유 없이 그냥 볼게요"로 우회할 수도 있어요.
- **케미(궁합)**: 공유 시점에 공유자 코드를 발급받아 링크에 `?ref=<code>`로 붙여요. 링크로 들어온 방문자가 카드를 완성하면 두 사람의 궁합 점수와 서로의 타입·닉네임을 함께 보여줘요. 공유자는 "내 케미 모아보기"에서 방문자 목록을 최신순으로 확인해요.
- 고화질 PNG 저장, 로그인·쿠키 없음.

## 실행

```bash
npm install
npm run dev       # Vite 개발 서버
npm run lint      # oxlint
npm run build     # tsc -b && vite build && ait build
npm run deploy    # ait deploy
```

- `.env`: `VITE_BACKEND_URL` — 케미 API 백엔드 주소
- 플랫폼(앱 이름, 브랜드 컬러, 내비게이션 바) 설정은 `apps-in-toss.config.ts`에서 관리해요.

## 아키텍처

**형태**: 라우터·상태관리 라이브러리 없는 클라이언트 전용 React 19 SPA예요. `src/App.tsx` 하나가 상태 컨테이너로, 화면 전환(`intro → question → loading → result → share → my-chemistry`)과 케미 흐름을 오케스트레이션해요. 빌드 결과(`dist/`)를 `ait build`로 `.ait` 번들로 감싸 `ait deploy`로 배포해요.

**디렉터리 역할**

| 경로 | 역할 |
|---|---|
| `src/data/` | 정적 콘텐츠 — `questions.ts`(7문항), `personas.ts`(16타입 정의 + 원소 색상) |
| `src/lib/` | 순수 로직 — `scoring.ts`(결정론적 채점·랭킹·시드), `interpretation.ts`(해설 텍스트 생성), `drawPersonaCard.ts`(캔버스 카드 렌더), `chemistryApi.ts`(백엔드 클라이언트), `chemistryStorage.ts`(localStorage·URL `?ref=` 헬퍼), `korean.ts`(받침 기반 조사 선택) |
| `src/components/` | 화면·프레젠테이션 컴포넌트 (대부분 무상태) |
| `src/types.ts` | 공유 타입 전부 |

**데이터 흐름**: 메모리상의 답변 배열 → `computeResult(answers)` → 페르소나 키 + 시드 → 캔버스 렌더 + 해설 텍스트. 카드 이미지는 전부 클라이언트에서 생성하고 `canvas.toDataURL()`로 내보내요.

**백엔드**: 별도 레포·서비스이고, FE는 케미 엔드포인트 3종만 래핑해요.

| 엔드포인트 | 용도 |
|---|---|
| `POST /api/chemistry/generate-code` | 공유자 코드 발급 |
| `POST /api/chemistry/visit` | 방문 기록 + 궁합 점수 계산 |
| `GET /api/chemistry/my-visitors` | 내 링크로 들어온 방문자 목록 |

모든 케미 호출은 **실패해도 해당 섹션만 조용히 숨기고 카드 본 흐름은 끊지 않아요**(graceful degradation). 상태머신은 `ChemistryVisitState { idle | loading | success | error }`.

**클라이언트 저장**: `localStorage`만 써요 — `ai-persona-card:sharer-code`, `ai-persona-card:sharer-nickname`. 리퍼럴 코드는 URL `?ref=`에서 읽어요. 전부 try/catch로 감싸 실패해도 흐름이 안 깨져요. 로그인·인증·쿠키 없음.

**Apps in Toss SDK**: `Share.createLink` / `Share.sendMessage`(fire-and-forget라 성공·취소 신호가 없어서 공유 후 1.5초 딜레이 뒤 잠금 해제), `Screen.close`, `graniteEvent`(하드웨어 뒤로가기).

**빌드 파이프라인**: `tsc -b`(프로젝트 레퍼런스: `tsconfig.app.json` / `tsconfig.node.json`) → `vite build`(React Compiler 활성) → `ait build`.

## 트러블슈팅

### 1. AI 생성 카드 이미지 → 캔버스 렌더링으로 회귀
- **문제**: 결과 카드가 매번 로딩 스피너를 거쳐야 보이고, 백엔드·API 키 가용성에 기능이 좌우됐어요.
- **원인**: `ResultCard` 마운트 시 `POST /api/generate-card`(Pollinations)를 호출해 이미지를 받아오는 구조라 네트워크 왕복이 필수 경로에 들어갔어요.
- **해결**: `ResultCard`를 안정적인 props(`persona`, `seed`) 뒤로 격리해뒀기에 호출부 변경 없이 렌더 로직만 `src/lib/drawPersonaCard.ts` 캔버스 렌더로 교체했어요. 이제 즉시 그려지고 오프라인에서도 동작해요.

### 2. 친구 링크로 들어온 방문자가 케미 결과를 못 봄
- **문제**: `?ref=` 링크로 접속한 방문자가 카드를 완성해도 닉네임 입력창·케미 점수가 화면에 안 나타났어요.
- **원인**: `NicknamePrompt`와 케미 결과가 `ResultScreen`의 `locked`(공유 잠금) 분기 **안쪽**에 렌더링됐어요. 잠금 해제 조건은 "본인 카드 공유"인데, 방문자에겐 자기 카드를 공유할 동기가 약해서 잠금을 못 풀고 결과도 못 봤어요.
- **해결**: 방문자용 케미 섹션(닉네임 입력 → loading → success → error)을 잠금 분기 바깥으로 승격하고 `isVisitor` prop을 추가했어요. 조회 실패 시 안내 문구도 넣었어요.

### 3. 병합됐는데 main에 없는 기능 (스택 브랜치 사고)
- **문제**: 방문자 닉네임 기능 PR이 MERGED인데 `main`에는 코드가 없었어요.
- **원인**: `feature/visitor-nickname`을 아직 main에 안 들어간 `feature/chemistry-ui` 위에 쌓았고, 닉네임 PR은 feature 브랜치로, main 병합 PR은 닉네임 이전 커밋을 부모로 병합돼서 닉네임 커밋이 main 계보에서 누락됐어요.
- **해결**: `feature/visitor-nickname-v2`를 최신 `main`에서 새로 분기해 커밋을 재작성·rebase한 뒤 별도 PR로 재병합했어요. 교훈 — feature 브랜치는 다른 미병합 브랜치가 아니라 항상 `main`에서 분기해요.

### 4. 케미 닉네임이 아직 없는(별도 레포) 백엔드에 의존
- **문제**: 닉네임 입력 UI를 먼저 만들었지만, 배포된 백엔드가 `nickname`을 저장·반환하지 않았어요(마이그레이션·BE PR 미완). curl 검증 시 `generate-code` / `visit` / `my-visitors` 모두 `nickname`을 무시했어요(200).
- **원인**: 프론트·백엔드 레포 분리로 릴리스 타이밍이 어긋났어요.
- **해결**: graceful degradation. 응답 타입에 `sharerNickname?: string | null` 옵셔널 필드를 미리 넣고, `ChemistryResult`가 닉네임이 없으면 "OO 타입의 친구"로 자연스럽게 대체해요. 요청 body에는 `nickname`을 계속 실어 보내서, 백엔드가 저장·반환을 시작하는 순간 **프론트 코드 수정 없이** 닉네임 표시로 전환돼요.

### 5. 인트로의 가짜 사회적 증거 & 오해되는 예시 카드
- **문제**: 인트로 카드 프리뷰가 16타입 중 하나를 보여줘 "예시 결과"로 오해됐고, 하단 "오늘 12,384명이 만들었어요"는 하드코딩된 가짜 숫자였어요.
- **원인**: 프리뷰가 실제 페르소나 렌더러에 연결돼 특정 타입을 그렸고, 카운터는 근거 데이터 없이 문자열 상수였어요.
- **해결**: 시드·원소와 무관한 고정 브랜드 시그니처(`drawBrandSignature()`)로 교체하고, `StatusLine` 컴포넌트를 도입했어요 — `count` prop이 없으면 정직한 문구를 쓰고, 실제 카운트 시스템이 생기면 prop만 넘기면 돼요.

### 6. 카드 뒤집기 중 잠금 오버레이가 겹쳐 보임
- **문제**: 타로 카드 3D flip 애니메이션 도중 워터마크·잠금 오버레이가 회전과 함께 어색하게 나타났어요.
- **원인**: 오버레이 표시가 회전 시작 시점에 바로 트리거됐어요.
- **해결**: 뒷면 노출 → 회전 → 회전이 실제로 끝난 뒤 오버레이 페이드인 순으로 타이밍을 별도 상태로 분리했어요(`src/components/ResultCard.tsx`).

## 참고 자료

- `docs/persona-card-app.html` — React로 옮기기 전 만들었던 원본 프로토타입(정적 HTML/CSS/JS)이에요. 화면 흐름과 톤앤매너를 확인할 때 참고할 수 있어요.
