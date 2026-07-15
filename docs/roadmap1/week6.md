# Week 6: 위생 마무리 + 테스트·성능 트랙 (Day 41–)

> Week 5(Day 31–38)에서 착수 전 이월된 Day 41(삭제 stale 수정)·42(toast 알림)·43(axios→fetch 위생) + 원래 계획된 **Track C(테스트+성능 측정)** 를 이 주차에서 진행. 이월된 3개 Day는 번호만 41/42/43으로 바뀌었을 뿐 범위는 `week5.md`의 원안(Day 35/39/40)과 동일.

| D | 작업 | 변경 파일 |
|---|---|---|
| 41 | **삭제 후 목록/상세 stale 수정(별도 태스크)** — 포스트 삭제 성공 시 목록·상세 캐시(SWR `mutate` + `revalidateTag`) 무효화로 stale 화면 제거 | `src/components/post/PostButtonList.tsx`, `src/hooks/useUserPost.ts`, service `revalidateTag` 호출부 |
| 42 | **UX** — toast 알림 컴포넌트 신설 + `alert()` 12곳 교체 (`RegisterForm.tsx`의 "알림 컴포넌트 만들어야 함" 주석 해소) | toast 컴포넌트 (신규), `WritePostForm.tsx`·`PostIcons.tsx`·`CommentForm.tsx`·`SigninForm.tsx`·`RegisterForm.tsx`·`LogDetail.tsx`·`ProfileForm.tsx` |
| 43 | **위생 마무리** — axios 11파일 → fetch 일원화 후 `axios` 의존성 제거, 미사용 `@types/nodemailer` 제거, 좋아요 `_id` 기반 전환(week4 백로그) 착수 여부 재평가 | `src/hooks/*.ts`, 컴포넌트 8파일, `package.json` |
| 44~ | **Track C — 테스트 + 성능 측정** (상세 미정, 착수 시 이 파일에 작성) — Vitest 도입 + GROQ 파라미터 바인딩 회귀 테스트 + Playwright 핵심 플로우를 Lighthouse 등 성능 측정과 묶어 진행 | TBD |

## 검증

- 빌드/린트/타입: `pnpm build && pnpm lint && pnpm exec tsc --noEmit` 무경고 (매 Day)
- **삭제 반영(Day 41)**: 글 삭제 즉시 목록/상세에서 사라지는지 확인(재조회·재접속 없이), SWR `mutate` + `revalidateTag` 이중 무효화 동작 확인
- **UX 단계(Day 42~43)**: `grep -rn "alert(" src` 0건(핵심 플로우), `grep -rln "axios" src` 0건
- **Track C**: 착수 시 이 섹션에 구체 검증 기준 작성

---

## Day별 상세 할일

#### Day 41 — 삭제 후 목록/상세 stale 수정 (별도 태스크)

| # | 할 일 | ✓ |
|---|---|---|
| 1 | `src/components/post/PostButtonList.tsx:25-37` 삭제 성공 후 SWR `mutate`로 목록 키 무효화 추가 (`useUserPost`의 `/api/.../posts` 키) | [ ] |
| 2 | `router.refresh()`/`router.push` 순서 및 `revalidateTag`(서버) ↔ SWR(클라) 이중 캐시 정합성 점검 | [ ] |
| 3 | 스모크: 글 삭제 즉시 목록·상세에서 사라지는지 확인 (재조회/재접속 없이) | [ ] |
| 4 | Day 작업 중 개념 질문·답변 중 중요한 내용을 서브에이전트(general-purpose)에 위임해 `learning-notes.md`에 기록 | [ ] |

#### Day 42 — toast 알림 도입

| # | 할 일 | ✓ |
|---|---|---|
| 1 | toast 컴포넌트/컨텍스트 신설 (라이브러리 vs 자체 구현 결정 포함) | [ ] |
| 2 | `alert()` 12곳 교체 — `WritePostForm`(2) · `PostIcons`(2) · `CommentForm`(3) · `SigninForm`(1) · `RegisterForm`(1) · `LogDetail`(1) · `ProfileForm`(2) | [ ] |
| 3 | `RegisterForm.tsx`의 `//알림 컴포넌트 만들어야 함` 주석 제거 | [ ] |
| 4 | `pnpm build` 통과 + 성공/실패 토스트 노출 스모크 | [ ] |
| 5 | Day 작업 중 나온 개념 질문·답변 중 중요한 내용을 서브에이전트(general-purpose)에 위임해 `learning-notes.md`에 기록 | [ ] |

#### Day 43 — HTTP 클라이언트 일원화 + 의존성 위생

| # | 할 일 | ✓ |
|---|---|---|
| 1 | axios 사용 11파일(훅 3 + 컴포넌트 8)을 fetch 기반으로 전환 | [ ] |
| 2 | `axios` 의존성 제거 | [ ] |
| 3 | 미사용 `@types/nodemailer` 제거 | [ ] |
| 4 | 좋아요 `_id` 기반 전환(week4-issues.md 백로그) — 이번 주에 처리할지 이후로 보낼지 재평가·기록 | [ ] |
| 5 | `pnpm build && pnpm lint && pnpm exec tsc --noEmit` 통과 + 좋아요/북마크/댓글/팔로우 스모크 | [ ] |
| 6 | Day 작업 중 나온 개념 질문·답변 중 중요한 내용을 서브에이전트(general-purpose)에 위임해 `learning-notes.md`에 기록 | [ ] |

#### Day 44~ — Track C: 테스트 + 성능 측정 (상세 미정)

> 착수 시 Vitest 셋업, GROQ 파라미터 바인딩 회귀 테스트 범위, Playwright 핵심 플로우 목록, Lighthouse 비교 기준(기존 `lighthouse-comparison.md` 참고)을 이 섹션에 구체화한다.
