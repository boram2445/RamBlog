# Week 2 이슈 로그

## Day 8 진행 중 — 패키지 매니저 yarn 4(berry) → pnpm 전체 이주

**계기**: Day 8 Sanity 패키지 업그레이드 후 `sanity-studio`(별도 yarn v1 lockfile 미니 프로젝트) 실행을 시도하다, corepack이 root의 `packageManager: yarn@4.15.0`을 studio에도 강제하며 tracked된 yarn v1 lockfile을 berry 포맷으로 변환하려는 마찰 발생. 근본 원인은 root/studio가 워크스페이스로 묶이지 않은 채 서로 다른 yarn 세대를 쓰는 구조.

**결정**: 전체 프로젝트를 pnpm으로 이주하고 root + `sanity-studio`를 하나의 pnpm 워크스페이스로 통합 (Day 3의 yarn 1→4 업그레이드 결정을 일부 되돌림). pnpm의 격리형 node_modules가 root(React 19)/studio(React 18) 버전 충돌 없이 하나의 워크스페이스로 관리하기 더 적합하다고 판단.

**변경 사항**:
- `pnpm-workspace.yaml` 신규 — `packages: ['sanity-studio']`, `allowBuilds`(네이티브 빌드 승인), `publicHoistPattern`, `overrides`, `patchedDependencies`. pnpm 11부터 이 설정들이 `package.json`의 `pnpm` 필드에서 `pnpm-workspace.yaml`로 이전됨(구버전 문서 기준 자료와 다름 — 마이그레이션 중 실제로 발견)
- `.yarn/`, `.yarnrc.yml`, `yarn.lock`(root/studio 둘 다) 삭제 → `pnpm-lock.yaml`로 대체
- yarn 패치 2건(`react-markdown@8.0.7`, `tui-color-picker@2.2.8`)을 `patches/*.patch`로 그대로 포팅 (내용 변경 없이 diff 포맷 호환)

**막힌 지점과 해결**:
1. `tui-color-picker`가 `@toast-ui/editor`의 전이 의존성인데 앱 코드(`TuiEditors.tsx`)가 직접 deep import — pnpm 격리형 node_modules에서 phantom dependency로 막힘. `publicHoistPattern: ['tui-color-picker']`로 해소. **임시 해법**: Toast UI Editor 자체를 다른 에디터로 교체할 계획(Track B)이라 tui-color-picker 의존성이 사라질 예정 — 지금은 우회로 충분, 영구 구조 개선은 하지 않음
2. lockfile을 삭제하고 새로 설치하면서 caret 범위(`^`) 의존성들이 이전 yarn.lock 고정 버전보다 훨씬 높은 버전으로 자동 상향됨. 이 중 두 건이 실제 문제를 일으켜 원복(override로 이전 lock 버전 고정):
   - `swr` 2.2.1 → 2.4.2: `mutate()` 타입이 엄격해져 `useMe.ts`/`PostIcons.tsx`의 기존 타입 불일치가 tsc 에러로 노출됨
   - `sanity`(studio CLI) 3.15.1 → 3.99.0: v4 출시(2026-07-15) 임박 버전이라 `styled-components@^6` 요구 강제 → studio dev 서버 기동 자체가 실패
   - `axios` 1.4.0 → 1.18.1: 즉각적 에러는 없었으나 큰 minor 점프라 예방적으로 원복
   - 판단 기준: 이번 작업은 **PM 교체이지 의도적 의존성 업그레이드가 아니므로**, 동작이 바뀔 수 있는 드리프트는 이전 고정 버전으로 되돌리고 실제 업그레이드는 각 항목의 원래 계획된 Day(예: studio v3→v6은 별도 트랙)로 미룸

**영향받지 않은 부분**: Day 8에서 진행한 root `@sanity/client`/`@sanity/image-url` 업그레이드(`^6.4.6→^7.23.0`, `^1.0.2→^2.1.1`)와 `sanity.ts` v2 import 수정은 이 이주 과정에 그대로 승계됨.

**검증**: `pnpm build`/`pnpm lint`/`pnpm exec tsc --noEmit` 무경고, root `pnpm dev` 홈·로그인 스모크(200), `sanity-studio`에서 `pnpm dev` → `localhost:3333` 200 확인.
