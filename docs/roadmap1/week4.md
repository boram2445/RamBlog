# Week 4: 성능·접근성·DX 마무리 (Day 22–30)

> 블로그 시리즈 목표: **6편** (RSC) + **7편** (priority + 접근성) + **8편** (종합 회고)

| D | 작업 | 변경 파일 |
|---|---|---|
| ✅ 22 | `PostIcons` 좋아요 중복 fetch 제거 (`getPostDetail`이 이미 포함한 `likes` 사용) + `getAllPostsData`/`getTagPosts`에 `next: { tags }` 확인 | `src/components/post/PostIcons.tsx`, `PostDetail.tsx`, `src/service/posts.ts` |
| 23 | **블로그 6편 발행** — RSC 진짜 이해하기 | (블로그) |
| 24 | `PostCard` priority 첫 N개에만 부여(인덱스 prop) + 모든 `next/image`에 `sizes` 추가 + Toast UI Editor `next/dynamic({ ssr: false })` 적용 | `PostCard.tsx`, `PostListCard.tsx`, `TuiEditors.tsx`, `WritePostForm.tsx` |
| ✅ 25 | `<div onClick>`/`<p onClick>` → `<Link>` 교체 + 폼 input `htmlFor`/`aria-label` 연결 | `PostUserProfile.tsx`, `CommentForm.tsx`, `SearchList.tsx`, `ProfileForm.tsx`, `ArticleForm.tsx`(+`DateForm.tsx`, `TextArea.tsx`), `LogForm.tsx` |
| 26 | **블로그 7편 발행** — priority + 접근성 회고 | (블로그) |
| ✅ 27 | `app/error.tsx`, `app/not-found.tsx`, `app/global-error.tsx` 추가 + 도메인별 `error.tsx`/`not-found.tsx` 2개 | `src/app/error.tsx`, `src/app/not-found.tsx`, `src/app/global-error.tsx`, `src/app/[user]/posts/error.tsx`, `src/app/[user]/not-found.tsx` |
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
| 1 | `src/components/post/PostIcons.tsx:27` 좋아요 fetch 제거 → `getPostDetail`이 반환하는 `likes` 재사용 (`useSWR` → `likes` prop + `useState` + optimistic/rollback) | [x] |
| 2 | `src/service/posts.ts:39` `getAllPostsData`에 `next: { tags: ['posts'] }` 추가 | [x] (기존에 이미 구현돼 있었음 — 확인만) |
| 3 | `src/service/posts.ts:60` `getTagPosts`에 `next: { tags: ['posts', 'tags'] }` 추가 | [x] (기존에 `next: { tags: ['posts'] }`로 이미 구현 — `'tags'` 태그는 미사용, `week4-issues.md` 참고) |
| 4 | `pnpm build` 통과 + 좋아요 동작 스모크 | [x] (`curl`로 `/api/posts/[id]/like` 404 확인, 서버 렌더 좋아요 카운트 초기 HTML 포함 확인) |

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
| 1 | `PostCard.tsx`에 `index` prop 추가 → `index < 3`일 때만 `priority` 부여 | [x] |
| 2 | `PostCard.tsx`, `PostListCard.tsx` 모든 `next/image`에 `sizes` 속성 추가 | [x] (`PostCard`만 실질적 필요 — `PostListCard`는 반응형 확장 클래스 없이 `width/height`가 실제 렌더 크기와 일치해 기본 동작이 이미 정확함, 변경 없음. 대신 `fill`인데 `sizes` 누락돼 있던 `ProjectModal.tsx`를 함께 수정) | [x] |
| 3 | `TuiEditors.tsx` `next/dynamic({ ssr: false })` 적용 | [x] (이미 `WritePostForm.tsx`에서 구현돼 있었음 — 확인만) |
| 4 | `WritePostForm.tsx` 에디터 dynamic import 반영 | [x] (위와 동일, 기존에 이미 반영됨) |
| 5 | `pnpm build` + Lighthouse Performance 점수 측정 | [x] (`pnpm build && pnpm lint && pnpm exec tsc --noEmit` 무경고. 홈페이지 SSR HTML로 `sizes`/`priority`(preload) 반영 스모크 확인. Lighthouse 정식 측정은 미실시 — 필요 시 별도 진행) |

#### Day 25 — 시맨틱 HTML + 접근성

> 로드맵 원문의 `PostCard`/`PostListCard` `<div onClick>`은 Day 20~22 RSC 전환 때 이미 `<Link>`로 교체되어 있어 실제 대상에서 제외(확인만). 실제 남은 건 `PostUserProfile` 1파일뿐. 폼도 "4개" 추정과 달리 실제 라벨 갭은 5개(`CommentForm`/`SearchList`/`ProfileForm`/`ArticleForm`/`LogForm`)였고, `ArticleForm`은 자식 컴포넌트(`DateForm`/`TextArea`)까지 prop 추가가 필요해 범위가 확장됨.

| # | 할 일 | ✓ |
|---|---|---|
| 1 | `PostUserProfile.tsx`의 `<div onClick>`+`<p onClick>`(아바타+username)를 단일 `<Link>`로 병합 (같은 목적지 중복 링크 방지) | [x] |
| 2 | `CommentForm.tsx`(3곳)·`SearchList.tsx`(1곳) — 라벨 없는 input/textarea에 `aria-label` 추가 | [x] |
| 3 | `ProfileForm.tsx`·`ArticleForm.tsx` label에 `htmlFor`/`id` 연결. `ArticleForm`의 `DateForm`(2개 인스턴스, 하드코딩 중복 `id` 버그도 함께 수정)·`TextArea`는 `id`/`aria-label` prop 신규 추가 | [x] |
| 4 | `LogForm.tsx`(날짜·제목·내용) `aria-label` 추가 | [x] |
| 5 | `pnpm build && pnpm lint && pnpm exec tsc --noEmit` 무경고 + 스모크(서버 렌더 HTML로 aria-label 확인) | [x] (`PostUserProfile`은 클라이언트 사이드 SWR 페칭 구조라 서버 HTML엔 미노출 — 브라우저 Tab+Enter 수동 확인 필요. `ProfileForm`/`ArticleForm`/`LogForm`은 인증 라우트라 curl 확인 불가 — 코드 리뷰로 대체) |

#### Day 26 — 블로그 7편 발행

| # | 할 일 | ✓ |
|---|---|---|
| 1 | `/write-blog-post day 7`로 7편(priority + 접근성) 초안 생성 | [ ] |
| 2 | 초안 검토 및 내용 보완 (LCP, Core Web Vitals, div onClick 문제) | [ ] |
| 3 | Sanity CMS에 발행 | [ ] |
| 4 | Day 24~25 summary 표 행에 ✅ 마킹 | [ ] |

#### Day 27 — error 경계 추가

> 도메인 경계는 2개로 확정: `[user]/posts/error.tsx`(포스트 페칭 실패), `[user]/not-found.tsx`(존재하지 않는 유저). 후자는 처음 `[user]/(home)/not-found.tsx`에 작성했으나, `notFound()`가 같은 폴더의 `(home)/layout.tsx`에서 호출되어 같은 세그먼트의 경계가 못 잡는 문제를 발견 — `[user]/` 바로 아래(route group `(home)` 밖)로 이동해 해결. 검증 중 `(home)/layout.tsx:25`의 `if (!user) notFound()`가 URL 파라미터(항상 truthy)를 검사하는 기존 버그도 발견해 `if (!userData?.username) notFound()`로 함께 수정(상세: `week4-issues.md`).

| # | 할 일 | ✓ |
|---|---|---|
| 1 | `src/app/error.tsx` 작성 (reset 버튼 포함) | [x] |
| 2 | `src/app/not-found.tsx` 작성 | [x] |
| 3 | `src/app/global-error.tsx` 작성 | [x] |
| 4 | 도메인별 error/not-found 경계 2개 추가 (`[user]/posts/error.tsx`, `[user]/not-found.tsx`) | [x] |
| 5 | `pnpm build && pnpm lint && pnpm exec tsc --noEmit` 무경고 + 잘못된 URL/존재하지 않는 유저 접근 시 not-found 페이지 확인 | [x] |

#### Day 28 — API 공통 에러 핸들러

| # | 할 일 | ✓ |
|---|---|---|
| 1 | `src/lib/api-handler.ts` 신규 작성 (`withErrorHandler` 래퍼 함수) | [ ] |
| 2 | `src/app/api/**/route.ts` 전체에서 `JSON.stringify(error)` 사용 부분 찾기 | [ ] |
| 3 | 각 route.ts에 `withErrorHandler` 래퍼 적용, `NextResponse.json({ error }, { status })` 통일 | [ ] |
| 4 | `pnpm build && pnpm lint` 통과 | [ ] |
| 5 | Day 작업 중 나온 개념 질문·답변 중 중요한 내용을 서브에이전트(general-purpose)에 위임해 `learning-notes.md`에 기록 | [ ] |

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
| 8 | Day 작업 중 나온 개념 질문·답변 중 중요한 내용을 서브에이전트(general-purpose)에 위임해 `learning-notes.md`에 기록 | [ ] |

#### Day 30 — 블로그 8편 발행 + 마무리

| # | 할 일 | ✓ |
|---|---|---|
| 1 | `/write-blog-post day 8`로 8편(종합 회고) 초안 생성 | [ ] |
| 2 | Before/After 비교 정리 (보안 4종, SEO, 렌더링, DX) | [ ] |
| 3 | 다음 v2 계획 메모 (Track A~D) | [ ] |
| 4 | Sanity CMS에 발행 | [ ] |
| 5 | Day 27~29 summary 표 행에 ✅ 마킹 | [ ] |
| 6 | `ROADMAP.md` 완료 기준 6개 항목 체크 후 main 머지 준비 검토 | [ ] |
