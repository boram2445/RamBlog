# Development Guidelines

> **이 문서는 AI Agent 전용이다.** 일반 개발자 가이드는 [`.claude/CLAUDE.md`](./.claude/CLAUDE.md) 참조.  
> 충돌 시 CLAUDE.md 우선. 30일 작업 일정·검증 기준은 [`docs/roadmap1/ROADMAP.md`](./docs/roadmap1/ROADMAP.md) 참조.

---

## 1. 프로젝트 개요

- 개인 개발자 블로그 (일기·포트폴리오 통합). 2023년 신입 시절 제작, 2026-05 부터 30일 개선 플랜 진행 중 (현재 Day 4/30).
- **스택**: Next.js 16 · React 19 · TypeScript · Tailwind · SWR · Sanity CMS · NextAuth v4 · Vercel
- **패키지 매니저**: yarn 4.15.0 (`yarn.lock` 기준)
- **현재 브랜치**: `refactor/migration` — Day 30 이전 `main` 머지 불가

## 2. 프로젝트 아키텍처

```
src/
  app/           # App Router 페이지 + api/ 라우트 (도메인별 route.ts)
  components/    # 도메인별 폴더: post/, posts/, comment/, common/, ui/
  service/       # Sanity 호출 서버 전용 (posts.ts, user.ts, comment.ts, sanity.ts)
  hooks/         # SWR 훅 — 클라이언트 전용
  context/       # Auth / SWR / DarkMode Provider
  lib/           # env.ts, api-handler 등 공통 유틸 (점진 추가)
  model/         # 수동 타입 — Day 9 typegen 도입 이후 신규 추가 금지
  utils/ types/ asset/icons/
```

- import alias: `@/*` → `./src/*`
- **계층 방향**: `service/` → `app/api/**/route.ts` → `hooks/` → `components/`. 역방향 import 금지.
- `sanity-studio/`는 별도 yarn 워크스페이스 — 루트 `yarn`으로 수정 금지.

## 3. 코드 표준

- **네이밍**: 컴포넌트 PascalCase, 훅·유틸·서비스 camelCase, 폴더 도메인 소문자, 라우트 파일 Next.js 컨벤션
- **CSS**: Tailwind 유틸리티만. `global.css`는 폰트·최소 reset 외 수정 금지. CSS-in-JS 도입 금지.
- **HTML**: 클릭 요소는 `<button>` 또는 `<Link>`. `<div onClick>` 금지.
- **이미지**: `next/image` 사용, `sizes` 속성 필수, `priority`는 LCP 후보에만.
- **폼**: `<label htmlFor>` 또는 `aria-label` 필수.
- **주석**: WHY가 non-obvious한 경우에만 한 줄. WHAT 설명 금지.

## 4. 기능 구현 표준

- **기본은 서버 컴포넌트**. `'use client'`는 인터랙션 잎(leaf)에만 — `useState` / `useEffect` / 브라우저 이벤트 핸들러가 있는 컴포넌트로 분리.
- 페이지 이동: `<Link>` 우선. `useRouter().push`는 폼 submit 후 등 필수적인 경우만.
- Sanity 데이터: `service/*.ts`를 통해서만 호출. SWR은 클라이언트 동적 갱신에만.
- 외부 입력(API body, 환경변수): zod로 파싱.
- 글로벌 상태 라이브러리(Redux, Zustand 등) 도입 금지.

## 5. 프레임워크·라이브러리 사용 표준

| 항목 | 규칙 |
|---|---|
| Next.js | App Router 전용. `pages/` 디렉토리 사용 금지 |
| 인증 | `getServerSession(authOptions)` — NextAuth v4. v5 `auth()` API 사용 금지 |
| Sanity | `service/*.ts`를 통해서만 호출 |
| GROQ 쿼리 | `client.fetch(query, { id })` 파라미터 바인딩 필수. `` `*[_id == "${id}"]` `` 금지 |
| bcrypt | salt rounds **12 이상** 필수 |
| 다크모드 | `next-themes` `class` 전략, `dark:` prefix |
| 타이포그래피 | `prose` 클래스 (`@tailwindcss/typography`) |
| 검증 | `zod` — API body, env 등 외부 경계만 |

## 6. 워크플로우 표준

- **패키지 명령어**: `yarn` 전용. npm/npx 금지.
- **검증 순서**: `yarn build && yarn lint && yarn typecheck` 무경고 → 핵심 라우트 수동 스모크 (홈, `/[user]/[slug]`, 로그인, 글쓰기, 댓글)
- **브랜치 정책**: `refactor/migration`에서만 작업. Day 30 이전 `main` 머지 금지.
- **커밋**: 사용자 명시적 요청 시에만. 작업 완료 후 자동 커밋 금지.
- **Day 완료 표기**: `docs/roadmap1/week{N}.md` 해당 행 앞에 ✅ 추가.
- **Day별 상세 할일**: [`docs/roadmap1/week1.md`](./docs/roadmap1/week1.md) ~ [`week4.md`](./docs/roadmap1/week4.md)

## 7. 핵심 파일 연동 표준

| 수정 파일 | 동시 확인 필수 |
|---|---|
| `src/service/posts.ts` | `src/app/api/posts/**/route.ts`, `src/hooks/usePost*.ts` |
| `src/service/user.ts` | `src/app/api/auth/**/route.ts`, `src/hooks/useUser.ts` |
| `src/service/comment.ts` | `src/app/api/comment/**/route.ts`, `src/hooks/useComment*.ts` |
| `src/app/api/**/route.ts` | 세션 검증 + 소유권 검증 둘 다 포함 확인 |
| `tsconfig.json` | `yarn build` end-to-end 재실행 |
| `eslint.config.mjs` | `yarn lint` 재실행 |
| `src/model/*.ts` | Day 9 이후: typegen 타입(`src/sanity/types.ts`) 대체 여부 판단 후 수정 |

## 8. AI 의사결정 표준

- **RSC vs Client**: 인터랙션(클릭·인풋·훅) 없으면 → 서버 컴포넌트 유지.
- **기존 유틸 재사용 우선**: `src/lib/env.ts`, `src/lib/api-handler.ts` 등 먼저 확인 후 구현.
- **새 의존성 추가 전**: 현재 스택으로 구현 가능한지 먼저 판단.
- **Day 9 이후 model 타입**: `src/model/*.ts` 신규 작성 대신 `src/sanity/types.ts` 사용.
- **에러 응답**: `NextResponse.json({ error }, { status })`. `JSON.stringify(error)` 금지.
- **mutation 후**: `revalidateTag` 호출 필수.
- **모호한 요청**: 코드베이스 먼저 읽고 기존 패턴 따름. 사용자에게 구현 방식 묻지 않음.

## 9. 금지 행동

- GROQ 쿼리에 template literal로 변수 삽입 (injection 위험)
- `<div onClick>` 사용
- 사용자 요청 없이 자동 커밋
- Day 30 이전 `refactor/migration` → `main` 머지
- `sanity-studio/`를 루트 `yarn`으로 수정
- Day 9 이후 `src/model/*.ts`에 수동 타입 신규 추가
- CSS-in-JS 라이브러리 추가
- Redux, Zustand 등 글로벌 상태 라이브러리 추가
- NextAuth v5 `auth()` API 사용
- bcrypt salt rounds 12 미만
- `--no-verify` 또는 `--no-gpg-sign` git 플래그 사용
- `global.css`에 컴포넌트 스타일 작성
