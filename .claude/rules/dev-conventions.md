# 개발 규칙

## 아키텍처

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

## 핵심 패턴

- **인증**: NextAuth v5 (`auth()`). `src/auth.ts`에서 export. API 보호는 세션 + 소유권 둘 다
- **데이터 페칭**: 서버(RSC/API 라우트)는 `service/*.ts` 직접 호출, 클라이언트 동적 갱신은 SWR
- **상태**: 별도 글로벌 store 없음. 서버 상태는 Sanity, 클라 캐시는 SWR
- **스타일**: Tailwind 유틸리티 + `@tailwindcss/typography` 만. CSS-in-JS 금지
- **테마**: `next-themes` `class` 전략, `dark:` prefix
- **검증**: zod (Day 2~). 외부 입력(API body, env)은 zod로 파싱

## 파일/폴더 네이밍

컴포넌트 PascalCase, 훅/유틸/서비스 camelCase, 폴더 도메인 소문자, 라우트 파일 Next.js 컨벤션(`[slug]`, `(group)`)

## 컴포넌트 작성 규칙

- **기본은 서버 컴포넌트**. `'use client'` 는 아래 경우에만, **인터랙션 잎(leaf)** 으로 분리해서 추가
  - 클라이언트 훅 (`useState`, `useEffect`, `useRouter`, `useTheme` 등)
  - 브라우저 이벤트 핸들러 (`onClick`, `onChange` 등)
- 페이지 이동: `<Link>` 우선. `useRouter().push` 는 폼 submit 후 등 필수적인 곳만
- semantic HTML: 클릭 가능한 요소는 `<button>` / `<Link>`. **`<div onClick>` 금지**
- 폼 input: `<label htmlFor>` 또는 `aria-label` 필수
- 이미지: `next/image` 사용. `priority` 는 LCP 후보(첫 카드/히어로)에만. `sizes` 속성 필수

## API 라우트 작성 규칙

- 모든 mutation: **세션 검증 + 리소스 소유자 일치** 둘 다 확인. `withSessionUser` 만으로 부족
- GROQ 쿼리: **반드시 파라미터 바인딩** 사용

  ```ts
  // ❌  client.fetch(`*[_id == "${id}"]`)
  // ✅  client.fetch(`*[_id == $id]`, { id })
  ```

- 비밀번호: `bcrypt` salt rounds **12 이상**
- 에러 응답: `NextResponse.json({ error }, { status })`. `JSON.stringify(error)` 금지
- mutation 후 `revalidateTag` 호출

## CSS 규칙

Tailwind 유틸리티 전용. 다크모드 `dark:` prefix. 본문 `prose` 클래스. `global.css` 폰트·reset 외 금지.

**예외**: 서드파티 컴포넌트(예: `@uiw/react-md-editor`)의 내부 DOM 클래스를 오버라이드할 때는 전용 CSS 파일(예: `src/components/post/mdEditor.css`, 컴포넌트와 같은 폴더에 배치) 허용. 라이브러리 CSS import 뒤에 우리 CSS를 import해 명시도 경쟁에서 이기도록 순서 유지. 우리가 작성한 마크업/컴포넌트 스타일은 이 예외와 무관하게 여전히 Tailwind 유틸리티 우선.
