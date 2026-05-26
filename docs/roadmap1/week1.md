# Week 1: 노출 차단 → Next 16 마이그레이션 (Day 1–7)

> 블로그 시리즈 목표: **1편** — Next 13 → 16 마이그레이션기

| D | 작업 | 변경 파일 |
|---|---|---|
| ✅ 1 | **작업 브랜치 분리**(`git checkout -b refactor/migration`) + `.env.example` 작성. 기존 production 배포는 그대로 두되 30일간 main 머지 금지로 신규 배포 차단 | `.env.example`, git 브랜치 |
| ✅ 2 | `src/lib/env.ts` zod 환경변수 검증 도입, 흩어진 `process.env.X` 정리 | `src/lib/env.ts` (신규), `service/sanity.ts:5-11`, `api/auth/[...nextauth]/options.ts:10-11`, `app/layout.tsx:19` |
| ✅ 3 | **Next 마이그레이션 ① codemod 적용**: 새 브랜치 생성 → `npx @next/codemod@latest upgrade latest` 실행 → 자동 변경분 커밋 → 빌드/타입 에러 목록화 | `package.json`, codemod 변경 결과 전체, 빌드 로그 |
| 4 | **Next 마이그레이션 ② async params 잔여** + **env 토큰 복구**: codemod가 못 잡은 동적 라우트 (`[user]`, `[id]`, `[keyword]`) 의 `await params`/`await searchParams` 수동 보정 | `src/app/[user]/**/*.tsx`, `src/app/tags/[keyword]/page.tsx`, `src/app/api/**/[*]/route.ts` |
| 5 | **Next 마이그레이션 ③ async API 잔여**: `cookies()`, `headers()`, `draftMode()` async 호출 + NextAuth v4가 Next 16에서 안 깨지는지 검증 (깨지면 Track A를 앞당길지 결정) | `src/app/api/auth/[...nextauth]/options.ts`, 영향 받는 컴포넌트 |
| 6 | **Next 마이그레이션 ④ caching 정상화**: `fetch` 캐싱 디폴트가 Next 14~16 사이에 두 번 바뀌었으니 `service/*.ts` 전 fetch에 **명시적** `cache`/`next.revalidate`/`tags` 부여. Turbopack 빌드 통과 확인 | `src/service/*.ts` 전체, `next.config.js` |
| 7 | **블로그 1편 발행** — Next 13 → 16 마이그레이션기 | (블로그) |

## 검증

- 빌드/린트/타입: `yarn build && yarn lint && yarn typecheck` 무경고
- **마이그레이션 단계(Day 3~6)**: 빌드 성공 + 핵심 라우트 수동 스모크 테스트 (홈, 포스트 상세, 로그인, 글쓰기, 댓글)

---

## Day별 상세 할일

#### Day 1 ✅ — 작업 브랜치 분리 + `.env.example` 작성

| # | 할 일 | ✓ |
|---|---|---|
| 1 | `git checkout -b refactor/migration` 실행 | [x] |
| 2 | `.env.example` 파일 작성 (필요한 env key 목록 + 설명 주석) | [x] |
| 3 | `git push -u origin refactor/migration` | [x] |

#### Day 2 ✅ — zod 환경변수 검증 도입

| # | 할 일 | ✓ |
|---|---|---|
| 1 | `package.json`에 `zod` 패키지 존재 확인 → 없으면 `yarn add zod` | [x] |
| 2 | `src/lib/env.ts` 신규 작성 (zod schema + safeParse + throw on failure) | [x] |
| 3 | `src/service/sanity.ts:5-11` `process.env.X` → `env.X` 교체 | [x] |
| 4 | `src/app/api/auth/[...nextauth]/options.ts:10-11` 동일 교체 | [x] |
| 5 | `src/app/layout.tsx:19` 동일 교체 | [x] |
| 6 | `yarn build && yarn lint` 통과 확인 | [x] |

#### Day 3 ✅ — Next 마이그레이션 ① codemod

| # | 할 일 | ✓ |
|---|---|---|
| 1 | `npx @next/codemod@latest upgrade latest` 실행 | [x] |
| 2 | 자동 변경분 검토 (`package.json`, `next.config.*`, `tsconfig.json` 등) | [x] |
| 3 | `yarn build` 실행 → 빌드 에러/경고 목록 기록 | [x] |
| 4 | `yarn typecheck` 실행 → 타입 에러 목록 기록 (→ `day3-error-inventory.md`) | [x] |
| 5 | 변경분 커밋 | [x] |

#### Day 4 — async params 보정 + env 토큰 복구 + yarn 4 업그레이드

> env 토큰 복구를 먼저 해야 Day 4 이후 스모크 테스트가 가능합니다

| # | 할 일 | ✓ |
|---|---|---|
| 0 | yarn 1.22.22 → yarn 4.15.0 업그레이드<br>- corepack 활성화<br>- `.yarnrc.yml` 생성 (`nodeLinker: node-modules`)<br>- `package.json`에 `packageManager` 필드 고정<br>- `.gitignore` yarn 4 항목 추가<br>- lockfile 재생성 | ✅ |
| 1 | Sanity Manage (sanity.io/manage) → 해당 프로젝트 → API → Tokens → Editor 권한 토큰 신규 발급, 이전 토큰 revoke | [ ] |
| 2 | 발급한 값을 `.env.local`의 `SANITY_SECRET_TOKEN=` 에 채움 | [ ] |
| 3 | Google Cloud Console (console.cloud.google.com/apis/credentials) → 기존 OAuth 2.0 Client ID 열기, Client ID 복사 + Secret Reset하여 신규 값 확보 | [ ] |
| 4 | `.env.local`의 `GOOGLE_OAUTH_ID`, `GOOGLE_OAUTH_SECRET` 채움. Redirect URI에 `http://localhost:3000/api/auth/callback/google` 포함 여부 재확인 | [ ] |
| 5 | `yarn build` → `src/lib/env.ts` zod 검증 통과 확인 (실패 시 stderr에 어떤 키가 비었는지 표시됨) | [ ] |
| 6 | `yarn dev` 후 홈 `/`, Google 로그인 1회, 포스트 상세, 글쓰기(이미지 업로드 포함) 스모크 | [ ] |
| 7 | codemod가 못 잡은 `[user]` 동적 라우트 page/layout의 `params`/`searchParams` await 보정 (`src/app/[user]/**/*.tsx`) | [ ] |
| 8 | `[id]`, `[keyword]` 동적 라우트도 동일하게 await 보정 (`src/app/[user]/posts/[id]/**`, `src/app/tags/[keyword]/page.tsx`) | [ ] |
| 9 | 동적 API 라우트 `params` await 보정 (`src/app/api/**/[*]/route.ts`) | [ ] |
| 10 | `yarn build && yarn lint && yarn typecheck` 무경고 통과 + 스모크 재실행 | [ ] |

#### Day 5 — async API 잔여 + NextAuth v4 호환성 검증

| # | 할 일 | ✓ |
|---|---|---|
| 1 | `cookies()`, `headers()`, `draftMode()` 사용 파일 목록 파악 | [ ] |
| 2 | 각 파일에서 `const x = await cookies()` 패턴으로 전환 | [ ] |
| 3 | `yarn build` → NextAuth v4 관련 에러 여부 확인 | [ ] |
| 4 | NextAuth 에러 발생 시: 수동 패치 범위 파악 후 Track A 앞당길지 결정 | [ ] |
| 5 | `yarn build && yarn lint && yarn typecheck` 통과 + 로그인/세션 스모크 | [ ] |

#### Day 6 — fetch caching 정상화 + Turbopack 빌드

| # | 할 일 | ✓ |
|---|---|---|
| 1 | `src/service/*.ts` 전 fetch 호출 목록 파악 | [ ] |
| 2 | 각 fetch에 명시적 `cache: 'no-store'` 또는 `next: { revalidate, tags }` 부여 | [ ] |
| 3 | `next.config.js`(또는 `.ts`) Turbopack 관련 설정 검토 | [ ] |
| 4 | `yarn build` 통과 확인 | [ ] |
| 5 | `yarn dev --turbopack` (또는 `--turbo`) 실행 → 브라우저 정상 확인 | [ ] |
| 6 | `yarn lint && yarn typecheck` 무경고 | [ ] |

#### Day 7 — 블로그 1편 발행

| # | 할 일 | ✓ |
|---|---|---|
| 1 | `/write-blog-post day 1`로 초안 생성 (Next 13→16 마이그레이션기) | [ ] |
| 2 | 초안 검토 및 내용 보완 (codemod 결과, 에러 인벤토리, 해결 과정) | [ ] |
| 3 | Sanity CMS에 발행 | [ ] |
| 4 | Day 4~6 summary 표 행에 ✅ 마킹 | [ ] |
