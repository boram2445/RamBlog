# RamBlog 회고·개선 30일 플랜 (Next 16 + Sanity 마이그레이션 우선)

## Context

3년 전 신입 시절 만든 사이드 블로그 RamBlog (Next.js 13 App Router + Sanity + NextAuth)를 다시 열어보니 보안(IDOR/GROQ injection/bcrypt 약함)·SEO(sitemap 부재)·렌더링(44/44 'use client')·DX(error.tsx 0/테스트 0/`Avartar` 오타 11파일) 부채가 누적되어 있었다.

처음에는 "보안 → SEO → 마이그레이션" 순서를 고려했지만, **다음 두 가지가 만족되면 마이그레이션을 먼저 하는 게 더 합리적**이라는 결론:

1. 작업은 별도 브랜치에서 진행하고 30일 동안 main에 머지하지 않음 → Vercel auto-deploy가 트리거되지 않으므로, **기존 배포는 부채 그대로 살아있지만 작업 중 변경분이 추가로 노출되지는 않음** (방치 프로젝트라 트래픽·공격 표면이 좁아 실용적 위험 낮음)
2. 보안 패치(GROQ 파라미터 바인딩)와 Sanity 클라이언트 업그레이드 + typegen 도입은 **동일한 service 레이어 재작성**이라 묶을 때 작업량이 절반

따라서 본 플랜은 **Next 16 + Sanity 마이그레이션을 먼저** 하고, 그 위에서 보안·SEO·렌더링 패치를 진행한다. **NextAuth v4→v5(Auth.js)와 Toast UI 교체는 표면적이 커서 별도 트랙으로 분리**한다.

> ⚠️ **Note on Next 16**: Next.js 16은 본 플랜 작성자(AI)의 지식 컷오프(2026-01) 직후에 출시되어 일부 breaking changes는 정확히 알지 못함. 따라서 Day 3~6 마이그레이션은 **공식 codemod (`npx @next/codemod@latest upgrade latest`)** 를 베이스로 진행하고, 거기서 잡히지 않는 잔여 작업(서드파티 라이브러리 호환성, 타입 에러 등)만 수동 대응하는 방식으로 풀어간다.

## ✍️ 블로그 시리즈 주제 (총 9편)

| # | 제목 (가제) | 다룰 내용 |
|---|---|---|
| **0편** ✅ | 3년 전 내 사이드 프로젝트를 다시 열어봤다 | 진단 결과 요약, 부채 카테고리 4종, 30일 플랜 |
| **1편** | Next 13 → 16 마이그레이션기 — 3년 치 breaking changes 한 번에 받기 | 공식 codemod 적용기, async `params`/`searchParams` (15~), React 19+, caching/`fetch` 디폴트 변화, Turbopack |
| **2편** | Sanity 클라이언트 업그레이드 + TypeGen 도입 | `@sanity/client` 최신, sanity-codegen/TypeGen으로 GROQ projection 타입화 |
| **3편** | Sanity에도 Injection이 있다 — GROQ 파라미터 바인딩 | template literal의 함정, `client.fetch(query, params)`, typegen과 시너지 |
| **4편** | 내 블로그가 구글에 검색되지 않은 이유 — App Router SEO 함정 | sitemap 동적 생성, metadata API, JSON-LD, RSC와 SEO |
| **5편** | 신입 시절 만든 API에 IDOR이 있었다 — 인증과 인가는 다르다 | `withSessionUser`의 한계, 소유권 검증 패턴, OWASP BOLA |
| **6편** | 내 코드는 왜 다 `'use client'`였을까 — RSC 진짜 이해하기 | 클라이언트 경계, 잎(leaf)만 클라이언트 패턴, `<Link>` vs `useRouter().push` |
| **7편** | `next/image` priority를 모든 카드에 붙이면 안 된다 + `<div onClick>`은 죄악 | LCP, Core Web Vitals, semantic HTML, 접근성 |
| **8편** | 회고: 에러 바운더리 없이 운영한 3년, 그리고 지금의 나 | error.tsx, zod env, CI, Before/After 비교, 다음 v2 계획 |

## 📅 30일 작업 일정

### Week 1: 노출 차단 → Next 16 마이그레이션

| Day | 작업 | 변경 파일 |
|---|---|---|
| ✅ 1 | **작업 브랜치 분리**(`git checkout -b refactor/migration`) + `.env.example` 작성. 기존 production 배포는 그대로 두되 30일간 main 머지 금지로 신규 배포 차단 | `.env.example`, git 브랜치 |
| ✅ 2 | `src/lib/env.ts` zod 환경변수 검증 도입, 흩어진 `process.env.X` 정리 | `src/lib/env.ts` (신규), `service/sanity.ts:5-11`, `api/auth/[...nextauth]/options.ts:10-11`, `app/layout.tsx:19` |
| 3 | **Next 마이그레이션 ① codemod 적용**: 새 브랜치 생성 → `npx @next/codemod@latest upgrade latest` 실행 → 자동 변경분 커밋 → 빌드/타입 에러 목록화 | `package.json`, codemod 변경 결과 전체, 빌드 로그 |
| 4 | **Next 마이그레이션 ② async params 잔여**: codemod가 못 잡은 동적 라우트 (`[user]`, `[id]`, `[keyword]`) 의 `await params`/`await searchParams` 수동 보정 | `src/app/[user]/**/*.tsx`, `src/app/tags/[keyword]/page.tsx`, `src/app/api/**/[*]/route.ts` |
| 5 | **Next 마이그레이션 ③ async API 잔여**: `cookies()`, `headers()`, `draftMode()` async 호출 + NextAuth v4가 Next 16에서 안 깨지는지 검증 (깨지면 Track A를 앞당길지 결정) | `src/app/api/auth/[...nextauth]/options.ts`, 영향 받는 컴포넌트 |
| 6 | **Next 마이그레이션 ④ caching 정상화**: `fetch` 캐싱 디폴트가 Next 14~16 사이에 두 번 바뀌었으니 `service/*.ts` 전 fetch에 **명시적** `cache`/`next.revalidate`/`tags` 부여. Turbopack 빌드 통과 확인 | `src/service/*.ts` 전체, `next.config.js` |
| 7 | **블로그 1편 발행** — Next 13 → 16 마이그레이션기 | (블로그) |

### Week 2: Sanity 마이그레이션 + 보안 패치

| Day | 작업 | 변경 파일 |
|---|---|---|
| 8 | **Sanity 마이그레이션 ①**: `@sanity/client@latest`, `@sanity/image-url@latest` 업그레이드 + `sanity-studio` 워크스페이스 sanity 패키지 업그레이드 | `package.json`, `sanity-studio/package.json` |
| 9 | **Sanity 마이그레이션 ②**: Sanity TypeGen 도입 — `sanity.cli.ts` 설정, `sanity typegen generate` 스크립트 추가, `src/sanity/types.ts` 자동 생성 | `sanity-studio/sanity.cli.ts`, `package.json` scripts, `src/sanity/types.ts` (생성물) |
| 10 | **Sanity 마이그레이션 ③ + 보안 패치 ①**: `service/posts.ts` 8개 GROQ 쿼리를 **typegen 결과 + 파라미터 바인딩**으로 동시 전환 | `src/service/posts.ts:50,63,70,83,98,116,131,237` |
| 11 | **Sanity 마이그레이션 ④ + 보안 패치 ②**: `service/user.ts`, `service/comment.ts` 잔여 쿼리 동일 패턴으로 전환 + `src/model/*.ts` 수동 타입 제거 (typegen 타입으로 대체) | `src/service/user.ts:51-115`, `src/service/comment.ts:21-134`, `src/model/*.ts` |
| 12 | **블로그 2·3편 발행** — Sanity TypeGen / GROQ Injection 회고 | (블로그) |
| 13 | **보안 패치 ③ — IDOR**: `posts/[id]` POST/DELETE에 author 소유권 검증 추가 + `comment/[id]` DELETE에 세션 검증 + 게스트 비번 검증 통합 | `src/app/api/posts/[id]/route.ts:10-53`, `src/app/api/comment/[id]/route.ts:44-57`, `src/app/api/comment/[id]/password/route.ts` |
| 14 | **보안 패치 ④**: bcrypt salt rounds 12 상향 (가입 + 게스트 댓글) + 비밀번호 길이/형식 검증 + 이미지 업로드 라우트 인증/MIME/사이즈 제한 | `src/app/api/auth/register/route.ts:10-31`, `src/app/api/comment/[id]/route.ts:37`, `src/app/api/image/route.ts:4-13` |

### Week 3: SEO 복구 + 렌더링 아키텍처

| Day | 작업 | 변경 파일 |
|---|---|---|
| 15 | **블로그 5편 발행** — IDOR 회고 (인증 vs 인가) | (블로그) |
| 16 | `<html lang="ko">` 변경 + root layout metadata 보강 (`metadataBase`, OG, twitter, robots) | `src/app/layout.tsx:15-32` |
| 17 | 포스트 상세 `generateMetadata`에 OG 이미지(대표이미지)·canonical·article 메타 + JSON-LD `BlogPosting` 추가 | `src/app/[user]/posts/[id]/page.tsx:41-44`, `src/components/post/JsonLd.tsx` (신규) |
| 18 | `next-sitemap.config.js`를 동적 라우트(Sanity fetch로 포스트/유저/태그) 수집형으로 재작성 + `generateRobotsTxt: true` | `next-sitemap.config.js`, 보조 fetch 스크립트 |
| 19 | **블로그 4편 발행** — App Router SEO 함정 | (블로그) |
| 20 | `PostCard`, `PostListCard`의 `'use client'` 제거 → `useRouter().push` 를 `<Link>` 로 교체 | `src/components/post/PostCard.tsx`, `PostListCard.tsx` |
| 21 | 홈 페이지 서버 컴포넌트 전환 — `FullPosts`가 받은 초기 데이터를 서버에서 페칭, SWR `fallbackData`로 hydration | `src/app/page.tsx`, `src/components/post/FullPosts.tsx` |

### Week 4: 성능·접근성·DX 마무리

| Day | 작업 | 변경 파일 |
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

## 🔭 30일 이후 (선택 트랙)

표면적이 커서 본 플랜에서 분리. 진도와 흥미에 따라 진행:

- **Track A (NextAuth v4 → v5 / Auth.js)**: `getServerSession` → `auth()`, signIn API 시그니처 변경, 미들웨어 통합 — 1주 단위 작업
- **Track B (Toast UI Editor 교체)**: Tiptap 또는 Lexical로 마이그레이션 — 에디터 통합 코드 처음부터 재작성
- **Track C (테스트)**: Vitest 도입 + GROQ 파라미터 바인딩 회귀 테스트 + Playwright 핵심 플로우
- **Track D (네이밍 정리)**: `Avartar` → `Avatar` 11파일 일괄 리네이밍, `components/post` ↔ `components/posts` 통합

## ✅ 검증 (각 Day 작업 후)

- 빌드/린트/타입: `yarn build && yarn lint && yarn typecheck` 무경고
- **마이그레이션 단계(Day 3~11)**: 빌드 성공 + 핵심 라우트 수동 스모크 테스트 (홈, 포스트 상세, 로그인, 글쓰기, 댓글)
- **보안 단계(Day 13~14)**: 다른 사용자 토큰으로 API 호출 → 403 응답. 비로그인으로 댓글 DELETE 호출 → 401. 잘못된 비밀번호 검증 우회 시도 → 차단
- **SEO 단계(Day 16~18)**: 빌드 후 `public/sitemap.xml`, `public/robots.txt` 존재 + 동적 URL 포함. Google Search Console URL 검사로 indexable
- **렌더링 단계(Day 20~22)**: 브라우저 View Source에서 초기 HTML에 포스트 카드 링크 포함. Lighthouse Performance 80+, SEO 95+, Accessibility 95+
- **DX 단계(Day 27~29)**: PR 만들어서 CI 통과 확인, pre-commit 훅 동작 확인

## 🎯 완료 기준 (Day 30 시점)

1. Next.js 16 + React 19+ + Sanity 최신 클라이언트로 마이그레이션 완료, Turbopack 빌드 무경고
2. CRITICAL 보안 결함 4종 (IDOR, GROQ injection, bcrypt 약함, 이미지 업로드 무인증) 모두 패치
3. Google Search Console에 sitemap 등록, 포스트 1개 이상 indexed
4. Lighthouse SEO 95+, Accessibility 90+
5. 블로그 시리즈 9편 발행
6. CI/Husky/Prettier 회귀 방지 인프라 구축
