# Week 1 발생 이슈 기록

> step별 이슈/해결 로그. week1.md 본문과 분리 관리.

---

## Day 4 + Day 5 — Next 16 마이그레이션

### Step 1·2 (env / Sanity 토큰)

| 이슈 | 해결 |
|---|---|
| Sanity 401 "Session does not match project host" — 토큰을 다른 프로젝트(`bqaezrns`)에서 발급해 `SANITY_PROJECT_ID=v3rvpdy7`과 host 불일치 | 같은 `v3rvpdy7` 프로젝트에서 Editor 권한 토큰 재발급 후 `.env.local` 교체. production 토큰은 Revoke 안 함 |
| yarn 1.22.22 → 4.15.0 업그레이드 (Next 16 / corepack 호환) | corepack enable → `yarn set version 4.15.0` → `.yarnrc.yml`(`nodeLinker: node-modules`) + `packageManager` 필드 고정. commit `e479cac` |

### Step 3 (Next 16 호환성 패치)

| 이슈 | 해결 |
|---|---|
| Turbopack(Lightning CSS)이 `tui-color-picker.css`의 IE6 hack `*display: inline;`을 syntax error로 거부 → `yarn build` 실패 | `yarn patch tui-color-picker`로 해당 3줄 삭제, `.yarn/patches/`에 저장. (`next/dynamic({ ssr:false })` 우회는 Turbopack 정적 분석에 막혀 실패) |
| `react-markdown@8`이 글로벌 `JSX.IntrinsicElements` 참조 → React 19에서 글로벌 JSX 제거로 typecheck 실패 | `yarn patch react-markdown`으로 `import type { JSX } from 'react'` 추가. (v9 업그레이드는 API breaking change로 보류) |
| Next 16에서 `revalidateTag(tag, profile)` 2번째 인자 타입 필수화 | 14개 호출(10개 라우트 파일)에 `'max'` 추가 — deprecation 권장값. node 스크립트로 일괄 |
| React 19에서 `useRef<T>()` no-arg 오버로드 제거 → 4곳 컴파일 실패 | 각 호출을 attach 엘리먼트 타입에 맞춰 `useRef<T>(null)` 형태로 수정. `DropDownNav.btnRef` prop 타입은 `HTMLElement`로 broaden |
| React 19에서 `img.src`가 `string \| Blob \| undefined`로 확장 → `extractImageSize` 호출 타입 실패 | `MarkDownPost.tsx`에서 `typeof image.src === 'string'` narrowing 후 사용 |
| (참고) TUI editor 향후 교체 검토 — Toast UI(2018) 라이브러리 자체가 모던 CSS 파서 호환성 부채 | roadmap2(30일 이후) 항목으로 등록. TipTap·Lexical·MDEditor 검토 예정 |

### Step 4 (NextAuth v4 → v5)

(Step 4 진행 중 이슈 발생 시 누적)

### Step 5·6 (build·lint·smoke)

(Step 5·6 진행 중 이슈 발생 시 누적)
