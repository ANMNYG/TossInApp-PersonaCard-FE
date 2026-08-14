# React + TypeScript + Vite

Vite에서 HMR과 몇 가지 Oxlint 규칙을 갖춘 React 개발 환경을 최소 구성으로 제공하는 템플릿이에요.

현재 두 가지 공식 플러그인을 사용할 수 있어요.

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) — [Oxc](https://oxc.rs)를 사용해요.
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) — [SWC](https://swc.rs/)를 사용해요.

## React Compiler

이 템플릿에는 React Compiler가 활성화돼 있어요. 자세한 내용은 [이 문서](https://react.dev/learn/react-compiler)를 참고하세요.

참고: React Compiler는 Vite 개발 서버와 빌드 성능에 영향을 줄 수 있어요.

## Oxlint 설정 확장하기

프로덕션 애플리케이션을 개발 중이라면 `oxlint-tsgolint`를 설치하고 `.oxlintrc.json`을 아래처럼 수정해서 타입 인식 린트 규칙을 활성화하는 걸 권장해요.

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

전체 규칙과 카테고리 목록은 [Oxlint 규칙 문서](https://oxc.rs/docs/guide/usage/linter/rules)를 참고하세요.

# ai-persona-card

7개 질문에 답하면 4가지 원소(불/물/땅/바람) 기반 페르소나 카드를 만들어주는 앱인토스 미니앱이에요.

## Apps in Toss

```bash
npm run dev
npm run build
npm run deploy
```

플랫폼 설정은 `apps-in-toss.config.ts`에서 관리해요.

## 참고 자료

- `docs/persona-card-app.html` — React로 옮기기 전 만들었던 원본 프로토타입(정적 HTML/CSS/JS) 파일이에요. 화면 흐름과 톤앤매너를 확인할 때 참고할 수 있어요.
