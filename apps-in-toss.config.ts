import { defineConfig } from '@apps-in-toss/web-framework/config';

export default defineConfig({
  appName: 'ai-persona-card',
  brand: {
    primaryColor: '#c9a227',
  },
  // 비게임 내비게이션 바: 좌측 뒤로가기 버튼 + 중앙 로고·앱 이름을 노출해요.
  // 국문 앱 이름("페르소나카드")과 로고는 앱인토스 콘솔의 앱 정보에 등록해야 반영돼요.
  navigationBar: {
    withBackButton: true,
    withTitle: true,
    theme: 'light',
  },
  permissions: [],
  webBundleDir: 'dist',
});
