# RamBlog

3년 전(2023년경) 신입 시절에 만든 개발자용 블로그 사이드 프로젝트. 일기·포트폴리오 통합 컨셉.

**스택**: Next.js 13 App Router · TypeScript · Tailwind · SWR · Sanity CMS · NextAuth v4 (Google OAuth + Credentials) · Toast UI Editor · Vercel 배포

## 현재 상황 (2026-05~)

방치되어 있던 프로젝트를 다시 열어 **30일에 걸쳐 점진적으로 개선**하는 중. 진단 결과 4영역에 부채 누적:

| 카테고리      | 핵심 문제                                                                            |
| ------------- | ------------------------------------------------------------------------------------ |
| 🔴 **보안**   | IDOR(소유권 검증 0건), GROQ Injection 전 쿼리, bcrypt salt 2~4, 이미지 업로드 무인증 |
| 🟠 **SEO**    | sitemap·robots 사실상 부재, 홈이 CSR-only라 크롤러가 포스트 발견 불가, metadata 빈약 |
| 🟠 **렌더링** | 44/44 파일 `'use client'` — App Router 쓰면서 RSC 이점 0                             |
| 🟡 **DX**     | error.tsx 0, 테스트 0, CI 0, env 검증 없음, `Avartar` 오타 11파일 전파               |

## 진행 방식

- **Next 16 + Sanity 마이그레이션을 먼저** 하고, 그 위에서 보안·SEO·렌더링 패치 진행
- NextAuth v5(Auth.js) / Toast UI 교체는 표면적이 커서 30일 이후 별도 트랙
- 매일 1시간 단위 작업, 작업 후 빌드/스모크 테스트 검증
- 각 카테고리 완료 시 회고 블로그 글 발행 (총 9편 시리즈)
- **신규 배포 차단**: 기존 production 배포는 그대로 두고, 작업은 별도 브랜치(`refactor/migration` 등)에서 진행해 main에 머지하지 않음 → Vercel auto-deploy가 트리거되지 않음. 30일 작업이 모두 끝난 뒤 한 번에 머지/배포
- Day 9 이후 typegen 도입되면 `src/model/*.ts` 수동 타입은 점진 대체 — 새 파일에서 수동 타입 추가 금지

상세 일정·변경 파일·검증 방법은 [`.claude/docs/30-day-plan.md`](./.claude/docs/30-day-plan.md) 참조.

## 개발 가이드

### 개발 환경

- Node 20+, 패키지 매니저 **yarn** (`yarn.lock` 기준)
- 주요 명령어: `yarn dev` / `yarn build` (postbuild로 next-sitemap 자동 실행) / `yarn lint`
- `sanity-studio/` 는 별도 yarn 워크스페이스 — 루트 `yarn` 으로는 설치되지 않음
- 환경변수: `.env.local` 사용 (`.env.example` 참고)

### 아키텍처

```
src/
  app/             # App Router 페이지
    api/           # 도메인별 route.ts
    [user]/        # 동적 사용자 라우트
  components/      # 도메인별 폴더 (post, posts, comment, common, ui …)
  service/         # Sanity 호출 — 서버 전용
  hooks/           # SWR 훅
  context/         # Auth / SWR / DarkMode Provider
  utils/  model/  types/  asset/icons/
  lib/             # env 검증, api-handler 유틸 (Day 2~28에 추가)
```

- import alias: `@/*` → `./src/*` (`tsconfig.json` `paths`)

### 핵심 패턴

- **인증**: NextAuth v4 (`getServerSession(authOptions)`). API 보호는 세션 + 소유권 둘 다
- **데이터 페칭**: 서버(RSC/API 라우트)는 `service/*.ts` 직접 호출, 클라이언트 동적 갱신은 SWR
- **상태**: 별도 글로벌 store 없음. 서버 상태는 Sanity, 클라 캐시는 SWR
- **스타일**: Tailwind 유틸리티 + `@tailwindcss/typography` 만. CSS-in-JS 금지
- **테마**: `next-themes` `class` 전략, `dark:` prefix
- **검증**: zod (Day 2~). 외부 입력(API body, env)은 zod로 파싱

### 파일/폴더 네이밍

| 대상           | 규칙           | 예시                                        |
| -------------- | -------------- | ------------------------------------------- |
| 컴포넌트       | PascalCase     | `PostCard.tsx`                              |
| 훅/유틸/서비스 | camelCase      | `usePost.ts`, `mainImage.ts`                |
| 폴더           | 도메인 소문자  | `post/`, `comment/`                         |
| 라우트 파일    | Next.js 컨벤션 | `route.ts`, `page.tsx`, `[slug]`, `(group)` |

### 컴포넌트 작성 규칙

- **기본은 서버 컴포넌트**. `'use client'` 는 아래 경우에만, **인터랙션 잎(leaf)** 으로 분리해서 추가
  - 클라이언트 훅 (`useState`, `useEffect`, `useRouter`, `useTheme` 등)
  - 브라우저 이벤트 핸들러 (`onClick`, `onChange` 등)
- 페이지 이동: `<Link>` 우선. `useRouter().push` 는 폼 submit 후 등 필수적인 곳만
- semantic HTML: 클릭 가능한 요소는 `<button>` / `<Link>`. **`<div onClick>` 금지**
- 폼 input: `<label htmlFor>` 또는 `aria-label` 필수
- 이미지: `next/image` 사용. `priority` 는 LCP 후보(첫 카드/히어로)에만. `sizes` 속성 필수

### API 라우트 작성 규칙

- 모든 mutation: **세션 검증 + 리소스 소유자 일치** 둘 다 확인. `withSessionUser` 만으로 부족
- GROQ 쿼리: **반드시 파라미터 바인딩** 사용

  ```ts
  // ❌  client.fetch(`*[_id == "${id}"]`)
  // ✅  client.fetch(`*[_id == $id]`, { id })
  ```

- 비밀번호: `bcrypt` salt rounds **12 이상**
- 에러 응답: `NextResponse.json({ error }, { status })`. `JSON.stringify(error)` 금지
- mutation 후 `revalidateTag` 호출

### CSS 규칙

- Tailwind 유틸리티 우선. `global.css` 는 폰트 import / 최소 reset 외 변경 금지
- 다크모드: `dark:` prefix
- 임의 px 값 (`p-[13px]` 등)은 Tailwind 단위로 표현 불가능할 때만
- 본문 타이포그래피: `prose` 클래스 (`@tailwindcss/typography`)

### 작업 절차

1. `package.json` + 영향 받는 폴더의 기존 패턴 확인
2. 호출 그래프 파악 (service → api → hooks → components 어느 층에서 시작)
3. 구현
4. `yarn build && yarn lint` 통과 확인
5. 핵심 라우트 수동 스모크 테스트 (홈, 포스트 상세, 로그인, 글쓰기)
6. 진행 중인 Day 작업이면 `.claude/docs/30-day-plan.md` 검증 항목 확인
