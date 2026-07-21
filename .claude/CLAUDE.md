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

### 아키텍처

```
src/
  app/             # App Router 페이지
    api/           # 도메인별 route.ts
    [user]/        # 동적 사용자 라우트
  components/      # 도메인별 폴더 (post, posts, comment, common, ui …)
  service/         # Sanity 호출 — 서버 전용
  sanity/          # types.ts — typegen 생성물(직접 수정 금지), `pnpm typegen`으로 재생성
  hooks/           # SWR 훅
  context/         # Auth / SWR / DarkMode Provider
  utils/  model/  types/  asset/icons/
  lib/             # env.ts(완료 Day 1), api-handler 등 유틸 (Day 2~28에 점진 추가)
```

- import alias: `@/*` → `./src/*` (`tsconfig.json` `paths`)

### 핵심 패턴

- **인증**: NextAuth v5 (`auth()`). `src/auth.ts`에서 export. API 보호는 세션 + 소유권 둘 다
- **데이터 페칭**: 서버(RSC/API 라우트)는 `service/*.ts` 직접 호출, 클라이언트 동적 갱신은 SWR
- **상태**: 별도 글로벌 store 없음. 서버 상태는 Sanity, 클라 캐시는 SWR
- **스타일**: Tailwind 유틸리티 + `@tailwindcss/typography` 만. CSS-in-JS 금지
- **테마**: `next-themes` `class` 전략, `dark:` prefix
- **검증**: zod (Day 2~). 외부 입력(API body, env)은 zod로 파싱

### 파일/폴더 네이밍

컴포넌트 PascalCase, 훅/유틸/서비스 camelCase, 폴더 도메인 소문자, 라우트 파일 Next.js 컨벤션(`[slug]`, `(group)`)

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

Tailwind 유틸리티 전용. 다크모드 `dark:` prefix. 본문 `prose` 클래스. `global.css` 폰트·reset 외 금지.

**예외**: 서드파티 컴포넌트(예: `@uiw/react-md-editor`)의 내부 DOM 클래스를 오버라이드할 때는 전용 CSS 파일(예: `src/components/post/mdEditor.css`, 컴포넌트와 같은 폴더에 배치) 허용. 라이브러리 CSS import 뒤에 우리 CSS를 import해 명시도 경쟁에서 이기도록 순서 유지. 우리가 작성한 마크업/컴포넌트 스타일은 이 예외와 무관하게 여전히 Tailwind 유틸리티 우선.

### 작업 절차

1. `package.json` + 영향 받는 폴더의 기존 패턴 확인
2. 호출 그래프 파악 (service → api → hooks → components 어느 층에서 시작)
3. 구현 — 코드는 Learn by Doing 방식으로 사용자가 직접 작성하도록 단계별 유도 (아래 섹션)
4. `pnpm build && pnpm lint` 통과 확인
5. 핵심 라우트 수동 스모크 테스트 (홈, 포스트 상세, 로그인, 글쓰기)
6. 진행 중인 Day 작업이면 `docs/roadmap1/ROADMAP.md` 검증 항목 확인

### Learn by Doing

**모든 코드 작업에 적용.** Claude는 구현 코드를 직접 작성하지 않는다. 사용자가 순서대로 모든 코드를 작성하도록 유도한다. 블로그·문서·roadmap·config 등 비(非)구현 작업은 대상 아님.

**흐름:**

1. **계획 공유** — task를 2~5개 구현 단계로 쪼개 순서와 이유를 먼저 설명한다.
2. **단계별 요청** — 한 번에 한 단계씩 Learn by Doing 형식(Context / Your Task / Guidance)으로 요청한다. 사용자 응답 전 다음 단계로 넘어가지 않는다.
3. **검토 후 다음** — 사용자가 제출한 코드를 검토하고 인사이트를 한 줄 공유한 뒤, 다음 단계를 요청한다.
4. **완료** — 모든 단계가 끝나면 task 완료 보고로 마무리한다.

**제약:** Claude가 `TODO(human)` 플레이스홀더를 포함한 어떤 구현 코드도 작성하지 않는다. 파일 생성·타입 정의·import 추가도 사용자에게 요청한다.

**예외 — `/auto`:** 사용자가 `/auto`를 입력한 task에 한해 이 규칙을 건너뛰고 Claude가 코드를 직접 구현한다 (일회성, 다음 task부터 자동 복귀). 커맨드 정의는 `.claude/commands/auto.md`.

**기존 규칙과의 관계:**

- `작업 절차`의 `3. 구현`은 "사용자가 구현하도록 단계별 유도"로 대체된다.
- `30-day-plan 실행 단위`의 2단 ask와 중첩된다: 한 task **안에서** Learn by Doing 4단계가 돌고, task가 끝난 뒤 2단 ask를 수행한다.

### Git 규칙

- **커밋은 사용자가 명시적으로 요청할 때만** 실행. 작업 완료 후 자동 커밋 금지
- 커밋 메시지에 진행 단위(`Day N`, `Week N` 등) 표기 **금지**. 변경 내용(무엇이/왜 바뀌었는지)만 적기. roadmap 매핑은 `docs/roadmap1/week{N}.md`가 관리
- **커밋 author는 항상 사용자(Boram Kim)여야 함**. `--author` 플래그나 `Co-authored-by:` 트레일러로 Claude를 author/contributor에 추가하지 말 것.

### 30-day-plan 진행 표기

- `docs/roadmap1/week{N}.md`의 Day 작업을 완료하면 해당 행 앞에 ✅ 이모지 추가
- **week{N}.md 작성 형식** (week6부터 적용, week1~5는 소급 수정 안 함): Day별 상세 "할 일" 행은 파일 경로·심볼명 나열 없이 **서술형 문장**으로 쓰고, **변경 파일 목록은 각 Day 상세 섹션 맨 하단**에 `**변경 파일**: a · b · c` 한 줄로 붙인다. 상단 요약 테이블은 `| D | 작업 |` 두 열만 (변경 파일 열 없음)
- 작업 중 발생한 이슈는 `docs/roadmap1/week{N}-issues.md`에 기록 (week{N}.md 본문에는 적지 않음). **단, 스모크 테스트 중 우연히 발견해 즉시 고친 사소한 원라인 버그는 기록 제외** — 설계 결정·재발 가능한 함정·의도적으로 미룬 백로그만 기록 대상
- Learn by Doing 진행 중 사용자가 한 개념 질문과 답변은 `docs/roadmap1/learning-notes.md`에 Day별 섹션 + Q/A 형식으로 기록 (문서 작업이므로 Learn by Doing 예외 대상). Claude가 직접 쓰지 않고, Day task 종료 시점에 그 Day의 Q&A 쌍을 서브에이전트(general-purpose)에 넘겨 파일 추가를 위임 — 메인 컨텍스트는 코딩 흐름에 집중
  - 같은 기준으로, 실수 노트에도 사소한 원라인 버그 수정은 제외하고 설계 결정·함정·백로그만 남긴다

### 30-day-plan 실행 단위

`docs/roadmap1/week{N}.md`의 Day 작업은 `#1, #2, …` task로 쪼개져 있다. 실행 규칙:

- **task/step 1개 단위로만 진행 후 정지**. Day·week 단위로 묶어 실행 금지. "Day N 해줘" 같은 광범위 지시도 첫 task만 실행 후 멈춤
- task/step 종료 후 반드시 **2단 ask** 순서 준수. 침묵=동의 금지:
  1. 변경 파일 한 문장 요약 + **"코드 검토해 주시겠어요?"** → 사용자 검토 대기
  2. 검토 완료 후 **"다음 스텝 시작할까요? — `{다음 task/step 요약}`"** → `다음`/`진행`/`ok` 등 명시적 승인 대기
- task 안에 명시된 빌드 확인(`pnpm build`·`pnpm lint`)은 별도로 끊지 않고 그 task에 포함
