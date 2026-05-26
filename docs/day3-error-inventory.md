# Day 3 에러 인벤토리 (Next 13 → 16 codemod 이후)

> 생성일: 2026-05-11  
> 빌드: Next 16.2.6, React 19.2.6, TypeScript 5.1.6  
> 목적: Day 4~6 수동 보정 작업의 입력. 이 단계에서 고치지 않는다.

---

## codemod 자동 변환 결과 요약

| codemod | 변환 파일 수 |
|---|---|
| `next-async-request-api` | **28** (async params/route context) |
| `next-og-import` | **24** (OG image import 경로 정리) |
| `metadata-to-viewport-export` | 0 (해당 패턴 없음) |
| `remove-experimental-ppr` | 0 |
| `next-lint-to-eslint-cli` | `package.json` scripts + `eslint.config.mjs` 생성 |
| 나머지 6개 | 0 |

---

## A. 빌드 에러 — Turbopack CSS 파싱 (즉시 처리 필요)

**발생 위치**: `node_modules/tui-color-picker/dist/tui-color-picker.css:59,66,76`  
**에러**: `Unexpected token Semicolon` — `*display: inline;` (IE 핵 CSS 문법)  
**원인**: `@toast-ui/editor-plugin-color-syntax` 가 의존하는 `tui-color-picker`가 IE 핵 CSS를 포함. Turbopack의 stricter CSS 파서가 거부.  
**트레이스**: `tui-color-picker.css` ← `TuiEditors.tsx` ← `WritePostForm.tsx` ← `write/[id]/page.tsx`  
**처리 예정**: Day 6 (Turbopack 빌드 통과 목표). 임시방편으로 `next.config.ts`에서 webpack 폴백 또는 `postcss.config.js`에서 해당 CSS 제외. 장기적으로 Track B (Toast UI 교체) 트리거 신호.

---

## B. TypeScript — `revalidateTag` 시그니처 변경 (12 sites)

**Next 16 변경**: `revalidateTag(tag: string, profile: string | CacheLifeConfig)` — 2번째 인자 `profile`이 타입상 필수.  
**에러**: `TS2554: Expected 2 arguments, but got 1`  

| 파일 | 라인 |
|---|---|
| `src/app/api/[user]/about/route.ts` | 20 |
| `src/app/api/[user]/logs/log/[id]/route.ts` | 27 |
| `src/app/api/[user]/logs/route.ts` | 42 |
| `src/app/api/[user]/me/profile/route.ts` | 62 |
| `src/app/api/bookmarks/route.ts` | 29 |
| `src/app/api/follow/route.ts` | 20 |
| `src/app/api/likes/route.ts` | 20 |
| `src/app/api/posts/[id]/like/route.ts` | 14 |
| `src/app/api/posts/[id]/route.ts` | 34, 35, 48, 49 |
| `src/app/api/posts/route.ts` | 35, 36 |

**처리 예정**: Day 6 (caching 정상화). 올바른 `profile` 값 확인 후 일괄 추가. 런타임에는 동작하므로 빌드 통과 전까지 비중요.

---

## C. TypeScript — React 19 `useRef()` → `useRef(null)` (3 sites)

**변경**: React 19에서 `useRef()` (인자 없음)가 deprecated — 초기값 필수.  
**에러**: `TS2554: Expected 1 arguments, but got 0`  

| 파일 | 라인 | 패턴 |
|---|---|---|
| `src/components/common/DropDownNav.tsx` | 20 | `useRef()` → `useRef<HTMLInputElement>(null)` |
| `src/components/ui/SelectBox.tsx` | 21 | `useRef()` → `useRef<HTMLElement>(null)` |
| `src/hooks/useScrollSpy.ts` | 5 | `useRef() as any` → `useRef<IntersectionObserver | null>(null)` |

**처리 예정**: Day 4 (async params 잔여 정리 시 함께).

---

## D. TypeScript — `react-markdown@8` React 19 미지원 (5개 에러)

**원인**: `react-markdown@8.0.7`이 React 19 타입(`JSX namespace` 제거, `FunctionComponent` 시그니처 변경)과 호환 불가.  

| 에러 위치 | 내용 |
|---|---|
| `node_modules/react-markdown/lib/complex-types.ts:25,26` | `Cannot find namespace 'JSX'` |
| `node_modules/react-markdown/lib/complex-types.ts:27` | `ElementType` 타입 불일치 |
| `src/components/post/MarkDownPost.tsx:26` | component map 타입 불일치 |
| `src/components/post/MarkDownPost.tsx:49,53,54,73` | `ReactMarkdownProps` 에 `src`/`alt` 없음 |

**처리 예정**: `react-markdown@9+` 로 업그레이드 (React 19 공식 지원) + `MarkDownPost.tsx` 컴포넌트 props 수정. Day 4 또는 별도 단발 작업.

---

## E. ESLint — React 19 엄격화된 hooks rules (5개 errors)

eslint-config-next 16 이 React 19 hooks rules를 강화. 기존에 통과하던 패턴들이 에러로 격상.

| 파일 | 라인 | 규칙 | 내용 |
|---|---|---|---|
| `src/components/post/WritePostForm.tsx` | 62 | `react-hooks/refs` | `editorRef.current` 를 렌더 중 접근 |
| `src/components/ui/DarkMode.tsx` | 14 | `react-hooks/set-state-in-effect` | `useEffect` body에서 `setMounted(true)` 동기 호출 |
| `src/components/ui/TextArea.tsx` | 21 | `react-hooks/immutability` | 선언 전 함수 참조 (`changeTextAreaHeight`) |
| `src/components/user/LinkButtons.tsx` | 20 | `react/jsx-key` | iterator 내 JSX에 `key` 누락 |
| `src/hooks/useHeadings.ts` | 21 | `react-hooks/set-state-in-effect` | `useEffect` body에서 `setHeadings` 동기 호출 |

**처리 예정**: Day 4~5 (잔여 수동 보정 단계). `DarkMode` / `useHeadings` 의 `set-state-in-effect` 는 `useLayoutEffect` 또는 초기화 패턴 변경으로 해결 가능.

---

## F. ESLint — `sanity-studio/` 스캔 부작용 (5개 warnings)

`next-lint-to-eslint-cli` 가 `eslint .` 로 스크립트를 변경 → sanity-studio 폴더가 새로 lint 범위에 포함됨.  
**경고**: `import/no-anonymous-default-export` in 5 sanity schema JS files.  
**처리 예정**: `eslint.config.mjs` 에 `ignores: ['sanity-studio/**']` 추가. Day 4 시작 전.

---

## G. 서드파티 peer 경고 (warnings — 런타임 영향 없음)

| 패키지 | 문제 |
|---|---|
| `@toast-ui/react-editor@3.2.3` | peer: `react@^17.0.1` (React 19와 불일치) |
| `next-auth@4.23.1` | peer: `next@^12.2.5 || ^13`, `react@^17||^18` |
| `react-spinners@0.13.8` | peer: `react@^16||^17||^18` |
| `swr@2.2.1` | peer: `react@^16||^17||^18` |
| `eslint-config-next@16.2.6` | peer: `eslint@>=9.0.0` (현재 `eslint: ^9` → 설치 시 충족) |

**NextAuth 호환**: Day 5에서 실제 세션 동작 검증. peer 경고만으로는 깨짐 확정 안 됨.  
**Toast UI**: Track B (Toast UI 교체)의 우선순위 재검토 신호. `@toast-ui/react-editor`가 React 19를 공식 미지원.

---

## H. 기타

- `next.config.js`: codemod 변경 없음. CommonJS 형식 유지. Turbopack이 기본 활성화됨(`▲ Next.js 16.2.6 (Turbopack)` 빌드 로그 확인).
- `eslint.config.mjs` 신규 생성: `next/core-web-vitals` flat config 형식.
- `.eslintrc.json` 은 그대로 존재 — ESLint 9 에서는 `eslint.config.*` 우선이므로 `.eslintrc.json` 은 무시됨. 삭제 예정 (Day 4).
- `caniuse-lite` 업데이트 권고 (빌드 경고): `npx update-browserslist-db@latest` — 필수 아님.

---

## Day별 처리 분배 요약

| Day | 처리 항목 |
|---|---|
| Day 4 | C (`useRef` 3건) + E ESLint 5건 + F sanity-studio ignore + `.eslintrc.json` 삭제 + react-markdown 업그레이드(D) |
| Day 5 | NextAuth v4 호환 검증 (G) + `cookies()`/`headers()` 없음 확인(0건) |
| Day 6 | A (Turbopack tui-color-picker 해결) + B (`revalidateTag` profile 추가) + fetch caching 명시화 |
