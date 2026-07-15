# RamBlog 회고·개선 30일 플랜 (Next 16 + Sanity 마이그레이션 우선)

## Context

RamBlog은 2023년 신입 시절 만든 개인 블로그 사이드 프로젝트(Next.js 13 App Router · Sanity CMS · NextAuth v4)다. 일기와 포트폴리오를 한 곳에 담는 컨셉으로 만들었지만, 입사 후 손을 놓고 3년간 방치되어 있었다.

다시 열어 진단해 보니 4영역에 부채가 누적되어 있었다:

| 카테고리 | 핵심 문제 |
|---|---|
| 🔴 **보안** | IDOR(소유권 검증 0건), GROQ Injection 가능한 raw 쿼리, bcrypt salt 2~4, 이미지 업로드 무인증 |
| 🟠 **SEO** | sitemap·robots 사실상 부재, 홈이 CSR-only라 크롤러가 포스트 발견 불가, metadata 빈약 |
| 🟠 **렌더링** | `'use client'` 45/161 (~28%) — App Router를 쓰면서도 RSC 이점을 거의 살리지 못함 |
| 🟡 **DX** | error.tsx 0, 테스트 0, CI 0, env 검증 없음, `Avartar` 오타 11파일 전파 |

처음에는 "보안 → SEO → 마이그레이션" 순서를 고려했지만 **마이그레이션을 먼저 하기로 결정**한 이유는 두 가지:

1. 작업은 별도 브랜치(`refactor/migration`)에서 진행하고 30일간 main에 머지하지 않아 Vercel auto-deploy가 트리거되지 않는다 → 기존 배포의 부채는 그대로 살아 있지만 작업 중 변경분은 추가로 노출되지 않고, 트래픽·공격 표면이 좁아 실용적 위험이 낮다.
2. 보안 패치(GROQ 파라미터 바인딩)와 Sanity 클라이언트 업그레이드 + typegen 도입은 **같은 service 레이어를 재작성하는 작업**이라, 묶을 때 작업량이 절반이 된다.

따라서 본 플랜은 **Next 16 + Sanity 마이그레이션을 먼저** 하고, 그 위에서 보안·SEO·렌더링·DX 패치를 진행한다. 당초 **NextAuth v4 → v5 (Auth.js) 전환과 Toast UI Editor 교체는 30일 이후 별도 트랙**(Track A, B)으로 분리했으나, Track A는 Week 1(Day 4·5)에 앞당겨 완료됐고 Track B는 Week 5로 편입됐다 (아래 "30일 이후" 섹션 참조).

작업 자체뿐 아니라 과정을 9편의 회고 시리즈로 남기는 것도 본 플랜의 일부다 — 같은 함정에 빠질 다른 신입 개발자에게 참고가 되도록, 그리고 3년 전의 나와 지금의 나를 비교하는 회고로.

> **Note on Next 16**: Next.js 16은 비교적 최근 출시되어 변경점이 많고 일부는 아직 정착 중이다. 따라서 Day 3~6 마이그레이션은 **공식 codemod (`npx @next/codemod@latest upgrade latest`)** 를 베이스로 진행하고, codemod가 잡지 못한 잔여 작업(async `params`/`searchParams`, 서드파티 라이브러리 호환성, 타입 에러 등)만 수동 대응하는 방식으로 풀어간다.

## ✍️ 블로그 시리즈 주제 (총 9편)

| # | 제목 (가제) | 다룰 내용 |
|---|---|---|
| **0편** | 3년 전 내 사이드 프로젝트를 다시 열어봤다 | 진단 결과 요약, 부채 카테고리 4종, 30일 플랜 |
| **1편** | Next 13 → 16 마이그레이션기 — 3년 치 breaking changes 한 번에 받기 | 공식 codemod 적용기, async `params`/`searchParams` (15~), React 19+, caching/`fetch` 디폴트 변화, Turbopack |
| **2편** | Sanity 클라이언트 업그레이드 + TypeGen 도입 | `@sanity/client` 최신, sanity-codegen/TypeGen으로 GROQ projection 타입화 |
| **3편** | Sanity에도 Injection이 있다 — GROQ 파라미터 바인딩 | template literal의 함정, `client.fetch(query, params)`, typegen과 시너지 |
| **4편** | 내 블로그가 구글에 검색되지 않은 이유 — App Router SEO 함정 | sitemap 동적 생성, metadata API, JSON-LD, RSC와 SEO |
| **5편** | 신입 시절 만든 API에 IDOR이 있었다 — 인증과 인가는 다르다 | `withSessionUser`의 한계, 소유권 검증 패턴, OWASP BOLA |
| **6편** | 내 코드는 왜 다 `'use client'`였을까 — RSC 진짜 이해하기 | 클라이언트 경계, 잎(leaf)만 클라이언트 패턴, `<Link>` vs `useRouter().push` |
| **7편** | `next/image` priority를 모든 카드에 붙이면 안 된다 + `<div onClick>`은 죄악 | LCP, Core Web Vitals, semantic HTML, 접근성 |
| **8편** | 회고: 에러 바운더리 없이 운영한 3년, 그리고 지금의 나 | error.tsx, zod env, CI, Before/After 비교, 다음 v2 계획 |

## 📅 30일 작업 일정

상세 작업 내역은 주차별 파일 참조:

| 주차 | 테마 | 파일 |
|---|---|---|
| Week 1 (Day 1–7) | 노출 차단 → Next 16 마이그레이션 | [roadmap1/week1.md](./roadmap1/week1.md) |
| Week 2 (Day 8–14) | Sanity 마이그레이션 + 보안 패치 | [roadmap1/week2.md](./roadmap1/week2.md) |
| Week 3 (Day 15–21) | SEO 복구 + 렌더링 아키텍처 | [roadmap1/week3.md](./roadmap1/week3.md) |
| Week 4 (Day 22–30) | 성능·접근성·DX 마무리 | [roadmap1/week4.md](./roadmap1/week4.md) |
| Week 5 (Day 31–38) | 에디터 교체 + 타입·네이밍 부채 청산 | [roadmap1/week5.md](./roadmap1/week5.md) |
| Week 6 (Day 41–) | 위생 마무리(삭제 stale·toast·axios) + 테스트·성능 트랙 | [roadmap1/week6.md](./roadmap1/week6.md) |

## 🔭 30일 이후 (선택 트랙)

표면적이 커서 본 플랜에서 분리했던 트랙들의 현재 상태:

- ✅ **Track A (NextAuth v4 → v5 / Auth.js)**: Week 1(Day 4·5)에 앞당겨 완료 — `getServerSession` 0건, `src/auth.ts` v5 패턴 적용
- **Track B (Toast UI Editor 교체)** → **Week 5 Day 31~32로 편입** — `@uiw/react-md-editor`로 확정 (마크다운 저장 구조와 1:1 대응, 뷰어는 이미 react-markdown으로 분리돼 있어 표면적 최소)
- **Track C (테스트) 예정 위치**: Week 6(Day 44~)에서 Vitest 도입 + GROQ 파라미터 바인딩 회귀 테스트 + Playwright 핵심 플로우를 **성능 측정(Lighthouse 등)과 묶어** 진행 (상세는 착수 시 `week6.md`에 채움)
- ✅ **Track D (네이밍 정리)**: Week 5 Day 38에서 완료 — `Avartar` → `Avatar` 10파일 리네이밍, `components/posts` → `components/post` 최소 통합(dead code `CarouselPosts` 삭제 포함)

Week 5에 있던 Day 35(삭제 stale 수정)·39(toast 알림)·40(axios→fetch 위생)은 착수 전 Week 6(Day 41·42·43)으로 이월됐다.

## ✅ 검증 (각 Day 작업 후)

- 빌드/린트/타입: `pnpm build && pnpm lint && pnpm exec tsc --noEmit` 무경고
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
