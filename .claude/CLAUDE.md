# RamBlog

3년 전(2023년경) 신입 시절에 만든 개발자용 블로그 사이드 프로젝트. 일기·포트폴리오 통합 컨셉.

**스택**: Next.js 16 App Router · React 19 · TypeScript · Tailwind · SWR · Sanity CMS · NextAuth v5/Auth.js (Google OAuth + Credentials) · Toast UI Editor · Vercel 배포 · ESLint 9 flat config

## 현재 상황 (2026-05~)

방치되어 있던 프로젝트를 다시 열어 **30일에 걸쳐 점진적으로 개선**하는 중. 진단 결과 4영역에 부채 누적:

| 카테고리      | 핵심 문제                                                                            |
| ------------- | ------------------------------------------------------------------------------------ |
| 🔴 **보안**   | IDOR(소유권 검증 0건), GROQ Injection 전 쿼리, bcrypt salt 2~4, 이미지 업로드 무인증 |
| 🟠 **SEO**    | sitemap·robots 사실상 부재, 홈이 CSR-only라 크롤러가 포스트 발견 불가, metadata 빈약 |
| 🟠 **렌더링** | `'use client'` 45/161 (~28%) — 인터랙션 잎으로 더 잘게 쪼개 RSC 비중 확대 필요       |
| 🟡 **DX**     | error.tsx 0, 테스트 0, CI 0, ~~env 검증~~ ✅(Day 2), `Avartar` 오타 11파일 전파      |

## 진행 방식

- **Next 16 + Sanity 마이그레이션을 먼저** 하고, 그 위에서 보안·SEO·렌더링 패치 진행
- NextAuth v5(Auth.js) 전환은 Week 1에 앞당겨 완료. Toast UI 교체(`@uiw/react-md-editor`)는 Week 5 Day 31~32, 테스트는 성능 측정과 묶어 Week 6 예정
- 매일 1시간 단위 작업, 작업 후 빌드/스모크 테스트 검증
- 각 카테고리 완료 시 회고 블로그 글 발행 (총 9편 시리즈)
- **신규 배포 차단**: 기존 production 배포는 그대로 두고, 작업은 별도 브랜치(`refactor/migration` 등)에서 진행해 main에 머지하지 않음 → Vercel auto-deploy가 트리거되지 않음. 30일 작업이 모두 끝난 뒤 한 번에 머지/배포
- Day 9 이후 typegen 도입되면 `src/model/*.ts` 수동 타입은 점진 대체 — 새 파일에서 수동 타입 추가 금지

상세 일정·변경 파일·검증 방법은 [`docs/roadmap1/ROADMAP.md`](./docs/roadmap1/ROADMAP.md) 참조 (Week 5는 [`docs/roadmap1/week5.md`](./docs/roadmap1/week5.md)).

## 개발 가이드

### 개발 환경

- Node 20+, 패키지 매니저 **pnpm** (`pnpm-lock.yaml` 기준, `pnpm-workspace.yaml`로 root + `sanity-studio` 워크스페이스 통합)
- 주요 명령어: `pnpm dev` / `pnpm build` (postbuild로 next-sitemap 자동 실행) / `pnpm lint` / `pnpm exec tsc --noEmit` (typecheck — 스크립트 없어서 직접 실행) / `pnpm typegen` (Sanity 타입 재생성)
- **Sanity TypeGen 파이프라인**: `pnpm typegen` = `schema:extract`(studio 컨텍스트에서 `sanity schema extract` → 등록 스키마를 `schema.json`으로 추출) → `typegen generate`(`sanity-typegen.json` 설정대로 `schema.json` + `src/service/**/*.ts`의 GROQ 쿼리를 읽어 `src/sanity/types.ts` 생성). **`src/sanity/types.ts`는 생성물이라 직접 수정 금지** — 스키마(`sanity-studio/schemas/*.js`) 또는 쿼리를 고치고 `pnpm typegen` 재실행
- `sanity-studio/` 는 pnpm 워크스페이스 멤버 — 루트 `pnpm install` 한 번으로 함께 설치됨. React 18(studio) / React 19(root) 버전 충돌은 pnpm의 격리형 node_modules로 해결
- 의존성 버전 오버라이드·패치는 `pnpm-workspace.yaml`의 `overrides`/`patchedDependencies`/`allowBuilds`에서 관리 (patch 파일은 `patches/`)
- 환경변수: `.env.local` 사용 (`.env.example` 참고)

### 개발 규칙 (아키텍처·패턴·컴포넌트·API·CSS)

@rules/dev-conventions.md

### Git 규칙

- **커밋은 사용자가 명시적으로 요청할 때만** 실행. 작업 완료 후 자동 커밋 금지
- 커밋 메시지에 진행 단위(`Day N`, `Week N` 등) 표기 **금지**. 변경 내용(무엇이/왜 바뀌었는지)만 적기. roadmap 매핑은 `docs/roadmap1/week{N}.md`가 관리
- **커밋 author는 항상 사용자(Boram Kim)여야 함**. `--author` 플래그나 `Co-authored-by:` 트레일러로 Claude를 author/contributor에 추가하지 말 것.

## 작업 실행 규칙

작업 절차 · 실행 단위 · Learn by Doing(+`/auto`) · 2단 ask · 진행 표기 · 이슈 기록은 아래 rule 파일로 분리:

@rules/task-execution.md
