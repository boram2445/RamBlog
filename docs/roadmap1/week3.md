# Week 3: SEO 복구 + 렌더링 아키텍처 (Day 15–21)

> 블로그 시리즈 목표: **4편** (App Router SEO) + **5편** (IDOR) + **6편** (RSC)

| D | 작업 | 변경 파일 |
|---|---|---|
| 15 | **블로그 5편 발행** — IDOR 회고 (인증 vs 인가) | (블로그) |
| 16 | `<html lang="ko">` 변경 + root layout metadata 보강 (`metadataBase`, OG, twitter, robots) | `src/app/layout.tsx:15-32` |
| 17 | 포스트 상세 `generateMetadata`에 OG 이미지(대표이미지)·canonical·article 메타 + JSON-LD `BlogPosting` 추가 | `src/app/[user]/posts/[id]/page.tsx:41-44`, `src/components/post/JsonLd.tsx` (신규) |
| 18 | `next-sitemap.config.js`를 동적 라우트(Sanity fetch로 포스트/유저/태그) 수집형으로 재작성 + `generateRobotsTxt: true` | `next-sitemap.config.js`, 보조 fetch 스크립트 |
| 19 | **블로그 4편 발행** — App Router SEO 함정 | (블로그) |
| 20 | `PostCard`, `PostListCard`의 `'use client'` 제거 → `useRouter().push` 를 `<Link>` 로 교체 | `src/components/post/PostCard.tsx`, `PostListCard.tsx` |
| 21 | 홈 페이지 서버 컴포넌트 전환 — `FullPosts`가 받은 초기 데이터를 서버에서 페칭, SWR `fallbackData`로 hydration | `src/app/page.tsx`, `src/components/post/FullPosts.tsx` |

## 검증

- 빌드/린트/타입: `pnpm build && pnpm lint && pnpm exec tsc --noEmit` 무경고
- **SEO 단계(Day 16~18)**: 빌드 후 `public/sitemap.xml`, `public/robots.txt` 존재 + 동적 URL 포함. Google Search Console URL 검사로 indexable
- **렌더링 단계(Day 20~21)**: 브라우저 View Source에서 초기 HTML에 포스트 카드 링크 포함. Lighthouse Performance 80+, SEO 95+, Accessibility 95+

---

## Day별 상세 할일

#### Day 15 — 블로그 5편 발행

| # | 할 일 | ✓ |
|---|---|---|
| 1 | `/write-blog-post day 5`로 5편(IDOR 회고) 초안 생성 | [ ] |
| 2 | 초안 검토 및 내용 보완 (인증 vs 인가, OWASP BOLA, 실제 패치 코드) | [ ] |
| 3 | Sanity CMS에 발행 | [ ] |
| 4 | Day 13~14 summary 표 행에 ✅ 마킹 | [ ] |

#### Day 16 — root layout metadata 보강

| # | 할 일 | ✓ |
|---|---|---|
| 1 | `src/app/layout.tsx:15` `<html lang="en">` → `<html lang="ko">` 변경 | [ ] |
| 2 | `export const metadata` 객체에 `metadataBase` 추가 (`new URL(process.env.NEXTAUTH_URL)`) | [ ] |
| 3 | OG(Open Graph), Twitter Card 기본 메타 추가 | [ ] |
| 4 | `robots` 메타 (`index: true, follow: true`) 추가 | [ ] |
| 5 | `pnpm build` 통과 + 빌드 후 홈 head 태그 검토 | [ ] |

#### Day 17 — 포스트 상세 metadata + JSON-LD

| # | 할 일 | ✓ |
|---|---|---|
| 1 | `src/app/[user]/posts/[id]/page.tsx` `generateMetadata` 함수에 OG 이미지(대표이미지) 추가 | [ ] |
| 2 | `canonical`, `article` 메타 추가 | [ ] |
| 3 | `src/components/post/JsonLd.tsx` 신규 생성 (`BlogPosting` JSON-LD 스키마) | [ ] |
| 4 | `[user]/posts/[id]/page.tsx`에서 `<JsonLd>` 컴포넌트 렌더 | [ ] |
| 5 | `pnpm build` + 포스트 상세 head 태그 / `<script type="application/ld+json">` 검토 | [ ] |

#### Day 18 — 동적 sitemap + robots.txt

| # | 할 일 | ✓ |
|---|---|---|
| 1 | `next-sitemap.config.js`에 `additionalPaths` 함수 작성 — Sanity fetch로 포스트/유저/태그 URL 수집 | [ ] |
| 2 | `generateRobotsTxt: true` 설정 추가 | [ ] |
| 3 | `pnpm build` 후 `public/sitemap.xml` 존재 확인 | [ ] |
| 4 | `public/sitemap.xml` 열어서 동적 포스트 URL 포함 여부 확인 | [ ] |
| 5 | `public/robots.txt` 존재 및 `Sitemap:` 항목 확인 | [ ] |

#### Day 19 — 블로그 4편 발행

| # | 할 일 | ✓ |
|---|---|---|
| 1 | `/write-blog-post day 4`로 4편(App Router SEO 함정) 초안 생성 | [ ] |
| 2 | 초안 검토 및 내용 보완 (sitemap, metadata API, JSON-LD, RSC와 SEO) | [ ] |
| 3 | Sanity CMS에 발행 | [ ] |
| 4 | Day 16~18 summary 표 행에 ✅ 마킹 | [ ] |

#### Day 20 — PostCard / PostListCard 서버 컴포넌트 전환

| # | 할 일 | ✓ |
|---|---|---|
| 1 | `src/components/post/PostCard.tsx` `'use client'` 제거 | [ ] |
| 2 | `PostCard.tsx`의 `useRouter().push` → `<Link href>` 교체 | [ ] |
| 3 | `src/components/post/PostListCard.tsx` 동일 처리 | [ ] |
| 4 | `pnpm build` 통과 | [ ] |
| 5 | 브라우저 View Source에서 포스트 카드 HTML(링크 등)이 초기 응답에 포함되는지 확인 | [ ] |

#### Day 21 — 홈 페이지 서버 컴포넌트 전환

| # | 할 일 | ✓ |
|---|---|---|
| 1 | `src/app/page.tsx`에서 서버 측 포스트 초기 데이터 페칭 추가 | [ ] |
| 2 | `src/components/post/FullPosts.tsx`가 `fallbackData` prop을 받아 SWR hydration하도록 수정 | [ ] |
| 3 | `pnpm build` 통과 | [ ] |
| 4 | Lighthouse Performance / SEO 점수 기록 (목표: Performance 80+, SEO 95+) | [ ] |
| 5 | Day 20~21 summary 표 행에 ✅ 마킹 | [ ] |
