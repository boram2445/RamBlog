# Week 1: 노출 차단 → Next 16 마이그레이션 (Day 1–7)

> 블로그 시리즈 목표: **1편** — Next 13 → 16 마이그레이션기

| D | 작업 | 변경 파일 |
|---|---|---|
| ✅ 1 | **작업 브랜치 분리**(`git checkout -b refactor/migration`) + `.env.example` 작성. 기존 production 배포는 그대로 두되 30일간 main 머지 금지로 신규 배포 차단 | `.env.example`, git 브랜치 |
| ✅ 2 | `src/lib/env.ts` zod 환경변수 검증 도입, 흩어진 `process.env.X` 정리 | `src/lib/env.ts` (신규), `service/sanity.ts:5-11`, `api/auth/[...nextauth]/options.ts:10-11`, `app/layout.tsx:19` |
| ✅ 3 | **Next 마이그레이션 ① codemod 적용**: 새 브랜치 생성 → `npx @next/codemod@latest upgrade latest` 실행 → 자동 변경분 커밋 → 빌드/타입 에러 목록화 | `package.json`, codemod 변경 결과 전체, 빌드 로그 |
| ✅ 4·5 | **Next 마이그레이션 ② async params·타입 잔여** + **env 토큰 복구** + **NextAuth v4→v5(Auth.js) 앞당김**: Turbopack CSS 패치(tui-color-picker), React 19 타입 보정(useRef/img.src/JSX), revalidateTag 2번째 인자 추가, Sanity 토큰 mismatch 해소. Day 5 #4 결정("Track A 앞당길지")에서 v5 마이그레이션 즉시 진행으로 확정 → Day 4·5 통합 | `src/auth.ts`(신규), `src/app/api/auth/[...nextauth]/route.ts`, `src/utils/session.ts`, 호출부 전체 13개 파일, `.yarn/patches/` |
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

#### Day 4·5 — Next 16 마이그레이션

##### Step 1·2 — env / Sanity 토큰 + yarn 4 업그레이드

| # | 할 일 | ✓ |
|---|---|---|
| 1 | yarn 1.22.22 → 4.15.0 업그레이드 (corepack, `.yarnrc.yml`, `packageManager`, lockfile 재생성) | ✅ |
| 2 | Sanity Manage에서 Editor 권한 토큰 신규 발급, 이전 토큰 revoke | [x] |
| 3 | `.env.local`의 `SANITY_SECRET_TOKEN` 교체 | [x] |
| 4 | Google Cloud Console에서 OAuth Client Secret reset, redirect URI 확인 | [x] |
| 5 | `.env.local`의 `GOOGLE_OAUTH_ID`/`GOOGLE_OAUTH_SECRET` 교체 | [x] |
| 6 | `yarn build`로 zod env 검증 통과 확인 | [x] |

##### Step 3 — Next 16 호환성 패치 (Turbopack / React 19 타입 / async params / revalidateTag)

| # | 할 일 | ✓ |
|---|---|---|
| 1 | `[user]` 동적 라우트 page/layout `await params`/`await searchParams` 보정 | [x] |
| 2 | `[id]`, `[keyword]` 동적 라우트 동일 보정 | [x] |
| 3 | 동적 API 라우트 `params` await 보정 | [x] |
| 4 | `tui-color-picker.css` IE6 hack `yarn patch`로 제거 (Turbopack Lightning CSS 대응) | [x] |
| 5 | `react-markdown@8` React 19 JSX 글로벌 의존 — `yarn patch`로 `import type { JSX }` 추가 | [x] |
| 6 | `revalidateTag(tag, profile)` 2번째 인자 일괄 `'max'` 추가 (14개 호출 / 10 파일) | [x] |
| 7 | React 19 `useRef<T>(null)` no-arg 제거 대응 (4곳) | [x] |
| 8 | React 19 `img.src` 타입 확장 대응 (`MarkDownPost.tsx` narrowing) | [x] |

> 상세 이슈/해결 로그는 `week1-issues.md` Step 3 참조.

##### Step 4 — NextAuth v4 → v5(Auth.js) 마이그레이션 (Track A 앞당김)

| # | 할 일 | ✓ |
|---|---|---|
| 1 | `cookies()`/`headers()`/`draftMode()` 사용 파일 파악 — 사용처 없음 확인 | skip |
| 2 | (위 사용처 없으므로) async 전환 작업 skip | skip |
| 3 | `yarn build`로 NextAuth 관련 빌드/타입 에러 인벤토리 | [x] |
| 4 | Track A 앞당김 결정 — v4 호환 패치 대신 v5 즉시 마이그레이션 | [x] |
| 5 | `src/auth.ts` 신설 — `handlers/auth/signIn/signOut` export, `options.ts` 옵션 이관 (`NextAuthOptions` → `NextAuthConfig`) | [x] |
| 6 | `src/app/api/auth/[...nextauth]/route.ts` → `export { GET, POST } from '@/auth'` 한 줄로 축소 | [x] |
| 7 | `src/utils/session.ts`의 `getServerSession(authOptions)` → `auth()` 교체 (11개 consumer 무변경) | [x] |
| 8 | RSC 페이지 / API 라우트 12곳의 `getServerSession(authOptions)` → `auth()` 교체 | [x] |
| 9 | `src/types/next-auth.d.ts` — `DefaultUser`/`DefaultJWT` import 보강, augmentation 유지 | [x] |
| 10 | `next-auth/react` 클라이언트 훅(8개 파일) 변경 불필요 확인 | [x] |
| 11 | credentials 한국어 에러 메시지 v5 마스킹 대응 — `SigninForm` 에러 표시 분기 보정 | [x] |

##### Step 5·6 — 빌드 / 린트 / 타입체크 / 스모크

| # | 할 일 | ✓ |
|---|---|---|
| 1 | `yarn build && yarn lint && yarn typecheck` 무경고 통과 | [ ] |
| 2 | `yarn dev` 후 스모크: 홈, Google 로그인, 포스트 상세, 글쓰기(이미지 업로드 포함) | [ ] |
| 3 | credentials 로그인 스모크 + 한국어 에러 메시지 확인 | [ ] |
| 4 | 댓글/좋아요/북마크/팔로우 mutation 경로 1회 스모크 (`withSessionUser` 경로 검증) | [ ] |

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
