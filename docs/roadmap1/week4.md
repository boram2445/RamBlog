# Week 4: 성능·접근성·DX 마무리 (Day 22–30)

> 블로그 시리즈 목표: **6편** (RSC) + **7편** (priority + 접근성) + **8편** (종합 회고)

| D | 작업 | 변경 파일 |
|---|---|---|
| 22 | `PostIcons` 좋아요 중복 fetch 제거 (`getPostDetail`이 이미 포함한 `likes` 사용) + `getAllPostsData`/`getTagPosts`에 `next: { tags }` 추가 | `src/components/post/PostIcons.tsx:27`, `src/service/posts.ts:39,60` |
| 23 | **블로그 6편 발행** — RSC 진짜 이해하기 | (블로그) |
| 24 | `PostCard` priority 첫 N개에만 부여(인덱스 prop) + 모든 `next/image`에 `sizes` 추가 + Toast UI Editor `next/dynamic({ ssr: false })` 적용 | `PostCard.tsx`, `PostListCard.tsx`, `TuiEditors.tsx`, `WritePostForm.tsx` |
| 25 | `<div onClick>` 6곳을 `<button>`/`<Link>`로 교체 + 폼 input `htmlFor` 연결 | `PostUserProfile.tsx:22`, `PostListCard.tsx:31,52`, `PostCard.tsx:38,46`, 폼 컴포넌트 4개 |
| 26 | **블로그 7편 발행** — priority + 접근성 회고 | (블로그) |
| 27 | `app/error.tsx`, `app/not-found.tsx`, `app/global-error.tsx` 추가 + 도메인별 `error.tsx` 2~3개 | `src/app/error.tsx` 외 신규 |
| 28 | API 공통 `withErrorHandler` 래퍼 도입 — `JSON.stringify(error)` 전부 제거, NextResponse.json 통일 | `src/lib/api-handler.ts` (신규), `src/app/api/**/route.ts` 전체 |
| 29 | Prettier + Husky + lint-staged + GitHub Actions(lint + typecheck + build) 일괄 도입 | `.prettierrc`, `.husky/pre-commit`, `.github/workflows/ci.yml`, `package.json` |
| 30 | **블로그 8편 발행** — 종합 회고 + 다음 v2 계획 | (블로그) |

## 검증

- 빌드/린트/타입: `pnpm build && pnpm lint && pnpm exec tsc --noEmit` 무경고
- **렌더링 단계(Day 22)**: 브라우저 View Source에서 초기 HTML에 포스트 카드 링크 포함. Lighthouse Performance 80+, SEO 95+, Accessibility 95+
- **DX 단계(Day 27~29)**: PR 만들어서 CI 통과 확인, pre-commit 훅 동작 확인

---

## Day별 상세 할일

#### Day 22 — 중복 fetch 제거 + revalidate tags

| # | 할 일 | ✓ |
|---|---|---|
| 1 | `src/components/post/PostIcons.tsx:27` 좋아요 fetch 제거 → `getPostDetail`이 반환하는 `likes` 재사용 | [ ] |
| 2 | `src/service/posts.ts:39` `getAllPostsData`에 `next: { tags: ['posts'] }` 추가 | [ ] |
| 3 | `src/service/posts.ts:60` `getTagPosts`에 `next: { tags: ['posts', 'tags'] }` 추가 | [ ] |
| 4 | `pnpm build` 통과 + 좋아요 동작 스모크 | [ ] |

#### Day 23 — 블로그 6편 발행

| # | 할 일 | ✓ |
|---|---|---|
| 1 | `/write-blog-post day 6`로 6편(RSC 진짜 이해하기) 초안 생성 | [ ] |
| 2 | 초안 검토 및 내용 보완 (클라이언트 경계, 잎 패턴, Before/After) | [ ] |
| 3 | Sanity CMS에 발행 | [ ] |
| 4 | Day 20~22 summary 표 행에 ✅ 마킹 | [ ] |

#### Day 24 — 이미지 성능 최적화

| # | 할 일 | ✓ |
|---|---|---|
| 1 | `PostCard.tsx`에 `index` prop 추가 → `index < 3`일 때만 `priority` 부여 | [ ] |
| 2 | `PostCard.tsx`, `PostListCard.tsx` 모든 `next/image`에 `sizes` 속성 추가 | [ ] |
| 3 | `TuiEditors.tsx` `next/dynamic({ ssr: false })` 적용 | [ ] |
| 4 | `WritePostForm.tsx` 에디터 dynamic import 반영 | [ ] |
| 5 | `pnpm build` + Lighthouse Performance 점수 측정 | [ ] |

#### Day 25 — 시맨틱 HTML + 접근성

| # | 할 일 | ✓ |
|---|---|---|
| 1 | `src/components/post/PostUserProfile.tsx:22` `<div onClick>` → `<button>` 교체 | [ ] |
| 2 | `src/components/post/PostListCard.tsx:31,52` 동일 교체 | [ ] |
| 3 | `src/components/post/PostCard.tsx:38,46` 동일 교체 | [ ] |
| 4 | 폼 컴포넌트 4개 `<label htmlFor>` 또는 `aria-label` 연결 확인 및 추가 | [ ] |
| 5 | `pnpm build` + Lighthouse Accessibility 점수 측정 (목표: 95+) | [ ] |

#### Day 26 — 블로그 7편 발행

| # | 할 일 | ✓ |
|---|---|---|
| 1 | `/write-blog-post day 7`로 7편(priority + 접근성) 초안 생성 | [ ] |
| 2 | 초안 검토 및 내용 보완 (LCP, Core Web Vitals, div onClick 문제) | [ ] |
| 3 | Sanity CMS에 발행 | [ ] |
| 4 | Day 24~25 summary 표 행에 ✅ 마킹 | [ ] |

#### Day 27 — error 경계 추가

| # | 할 일 | ✓ |
|---|---|---|
| 1 | `src/app/error.tsx` 작성 (reset 버튼 포함) | [ ] |
| 2 | `src/app/not-found.tsx` 작성 | [ ] |
| 3 | `src/app/global-error.tsx` 작성 | [ ] |
| 4 | 도메인별 `error.tsx` 2~3개 추가 (`src/app/[user]/posts/error.tsx` 등) | [ ] |
| 5 | `pnpm build` 통과 + 잘못된 URL 접근 시 not-found 페이지 확인 | [ ] |

#### Day 28 — API 공통 에러 핸들러

| # | 할 일 | ✓ |
|---|---|---|
| 1 | `src/lib/api-handler.ts` 신규 작성 (`withErrorHandler` 래퍼 함수) | [ ] |
| 2 | `src/app/api/**/route.ts` 전체에서 `JSON.stringify(error)` 사용 부분 찾기 | [ ] |
| 3 | 각 route.ts에 `withErrorHandler` 래퍼 적용, `NextResponse.json({ error }, { status })` 통일 | [ ] |
| 4 | `pnpm build && pnpm lint` 통과 | [ ] |

#### Day 29 — CI / Husky / Prettier 인프라

| # | 할 일 | ✓ |
|---|---|---|
| 1 | `pnpm add -D prettier lint-staged husky` 설치 | [ ] |
| 2 | `.prettierrc` 작성 | [ ] |
| 3 | `npx husky init` + `.husky/pre-commit`에 `npx lint-staged` 설정 | [ ] |
| 4 | `package.json`에 `lint-staged` 설정 추가 (`.ts`, `.tsx` → eslint + prettier) | [ ] |
| 5 | `.github/workflows/ci.yml` 작성 (lint + typecheck + build) | [ ] |
| 6 | 테스트용 PR 생성 → GitHub Actions CI 통과 확인 | [ ] |
| 7 | 커밋 시 pre-commit 훅 동작 확인 | [ ] |

#### Day 30 — 블로그 8편 발행 + 마무리

| # | 할 일 | ✓ |
|---|---|---|
| 1 | `/write-blog-post day 8`로 8편(종합 회고) 초안 생성 | [ ] |
| 2 | Before/After 비교 정리 (보안 4종, SEO, 렌더링, DX) | [ ] |
| 3 | 다음 v2 계획 메모 (Track A~D) | [ ] |
| 4 | Sanity CMS에 발행 | [ ] |
| 5 | Day 27~29 summary 표 행에 ✅ 마킹 | [ ] |
| 6 | `ROADMAP.md` 완료 기준 6개 항목 체크 후 main 머지 준비 검토 | [ ] |
