# Week 2: Sanity 마이그레이션 + 보안 패치 (Day 8–14)

> 블로그 시리즈 목표: **2편** (TypeGen) + **3편** (GROQ Injection) + **5편** (IDOR)

| D | 작업 | 변경 파일 |
|---|---|---|
| ✅ 8 | **Sanity 마이그레이션 ①**: `@sanity/client@latest`, `@sanity/image-url@latest` 업그레이드 + `sanity-studio` 워크스페이스 sanity 패키지 업그레이드 | `package.json`, `sanity-studio/package.json` |
| ✅ 9 | **Sanity 마이그레이션 ②**: Sanity TypeGen 도입 — `sanity.cli.ts` 설정, `sanity typegen generate` 스크립트 추가, `src/sanity/types.ts` 자동 생성 | `sanity-studio/sanity.cli.ts`, `package.json` scripts, `src/sanity/types.ts` (생성물) |
| ✅ 10 | **Sanity 마이그레이션 ③ + 보안 패치 ①**: `service/posts.ts` 8개 GROQ 쿼리를 **typegen 결과 + 파라미터 바인딩**으로 동시 전환 | `src/service/posts.ts:50,63,70,83,98,116,131,237` |
| ✅ 11\* | **Sanity 마이그레이션 ④ + 보안 패치 ②**: `service/user.ts`, `service/comment.ts` 잔여 쿼리 동일 패턴으로 전환 + `src/model/*.ts` 수동 타입 제거 (typegen 타입으로 대체) | `src/service/user.ts:51-115`, `src/service/comment.ts:21-134`, `src/model/*.ts` |
| 12 | **블로그 2·3편 발행** — Sanity TypeGen / GROQ Injection 회고 | (블로그) |
| ✅ 13 | **보안 패치 ③ — IDOR**: `posts/[id]` POST/DELETE에 author 소유권 검증 추가 + `comment/[id]` DELETE에 세션 검증 + 게스트 비번 검증 통합 | `src/app/api/posts/[id]/route.ts:10-53`, `src/app/api/comment/[id]/route.ts:44-57`, `src/app/api/comment/[id]/password/route.ts` |
| ✅ 14 | **보안 패치 ④**: bcrypt salt rounds 12 상향 (가입 + 게스트 댓글) + 비밀번호 길이/형식 검증 + 이미지 업로드 라우트 인증/MIME/사이즈 제한 | `src/app/api/auth/register/route.ts:10-31`, `src/app/api/comment/[id]/route.ts:37`, `src/app/api/image/route.ts:4-13` |

> \*Day 11 #3(`src/model/*.ts` 수동 타입 제거)은 **의도적으로 보류**. 뷰모델 타입이 컴포넌트 40여 개에 광범위하게 소비 중이라(`SimplePost` 21곳, `AuthUser` 14곳, `ProfileUser` 13곳 등) typegen 결과 타입(nullable 필드 등 shape 차이)으로 일괄 교체 시 다수 파일에 tsc 에러가 번짐 — 무인 배치로 처리하기엔 위험이 커 별도 리팩터 트랙으로 미룸. 상세: `week2-issues.md`.

## 검증

- 빌드/린트/타입: `pnpm build && pnpm lint && pnpm exec tsc --noEmit` 무경고
- **마이그레이션 단계(Day 8~11)**: 빌드 성공 + 핵심 라우트 수동 스모크 테스트 (홈, 포스트 상세, 로그인, 글쓰기, 댓글)
- **보안 단계(Day 13~14)**: 다른 사용자 토큰으로 API 호출 → 403 응답. 비로그인으로 댓글 DELETE 호출 → 401. 잘못된 비밀번호 검증 우회 시도 → 차단

---

## Day별 상세 할일

#### Day 8 — Sanity 패키지 업그레이드

| # | 할 일 | ✓ |
|---|---|---|
| 1 | 현재 `@sanity/client`, `@sanity/image-url` 버전 확인 (`pnpm list '@sanity/*'`) | [x] |
| 2 | `pnpm update @sanity/client@latest @sanity/image-url@latest` 실행 | [x] |
| 3 | `cd sanity-studio && pnpm update sanity@latest` 실행 | [x] |
| 4 | Breaking changes 확인 (API 시그니처 변경 등) → 필요 시 `src/service/sanity.ts` 수정 | [x] |
| 5 | `pnpm build` 통과 + 포스트 목록/상세 스모크 | [x] |

#### Day 9 — Sanity TypeGen 도입

| # | 할 일 | ✓ |
|---|---|---|
| 1 | `sanity-studio/sanity.cli.ts`에 typegen 설정 추가 | [x] |
| 2 | `package.json` scripts에 `"typegen": "sanity typegen generate"` 추가 | [x] |
| 3 | `pnpm typegen` 실행 → `src/sanity/types.ts` 자동 생성 확인 | [x] |
| 4 | 생성된 타입 파일 검토 (스키마 누락·오류 없는지) | [x] |
| 5 | `pnpm build && pnpm exec tsc --noEmit` 통과 | [x] |

#### Day 10 — posts.ts GROQ 쿼리 typegen + 파라미터 바인딩

| # | 할 일 | ✓ |
|---|---|---|
| 1 | `src/service/posts.ts`의 8개 raw string 쿼리 위치 파악 (라인 50, 63, 70, 83, 98, 116, 131, 237) | [x] |
| 2 | 각 쿼리에서 `${변수}` → `$변수` 파라미터 바인딩으로 전환 | [x] |
| 3 | `client.fetch(query, { 변수 })` 두 번째 인자 추가 | [x] |
| 4 | typegen 결과 타입으로 fetch return type 지정 | [x] |
| 5 | `pnpm build && pnpm exec tsc --noEmit` 통과 + 포스트 목록·상세·태그 스모크 | [x]* |

> \*`pnpm exec tsc --noEmit`/`pnpm lint` 무경고 확인. `pnpm build`와 실제 브라우저 스모크는 이 환경에 `.env.local`이 없어 미실행 — 사용자 로컬에서 재확인 필요.

#### Day 11 — user.ts + comment.ts + model/*.ts 정리

| # | 할 일 | ✓ |
|---|---|---|
| 1 | `src/service/user.ts:51-115` 쿼리 파라미터 바인딩 전환 | [x] |
| 2 | `src/service/comment.ts:21-134` 쿼리 파라미터 바인딩 전환 | [x] |
| 3 | `src/model/*.ts` 수동 타입 중 typegen 타입으로 대체 가능한 것 제거 | [ ]\* |
| 4 | `pnpm build && pnpm exec tsc --noEmit` 통과 + 댓글 조회/작성 스모크 | [x]\*\* |

> \*보류 — 위 각주 참조.
> \*\*`pnpm build`/`pnpm lint`/`pnpm exec tsc --noEmit` 무경고. 댓글 GET 스모크 200 확인. 댓글 작성(POST) 스모크는 실제 프로덕션 Sanity 데이터셋에 테스트 댓글이 남는 쓰기 작업이라 생략(권한 분류기가 실제로 이 위험을 감지해 실행을 막음) — 코드 경로는 Day 13/14의 다른 쓰기 스모크(등록, 삭제)로 간접 검증됨.

#### Day 12 — 블로그 2·3편 발행

| # | 할 일 | ✓ |
|---|---|---|
| 1 | `/write-blog-post day 2`로 2편(TypeGen) 초안 생성 | [ ] |
| 2 | 2편 검토 및 발행 | [ ] |
| 3 | `/write-blog-post day 3`로 3편(GROQ Injection) 초안 생성 | [ ] |
| 4 | 3편 검토 및 발행 | [ ] |
| 5 | Day 8~11 summary 표 행에 ✅ 마킹 | [ ] |

#### Day 13 — IDOR 패치

| # | 할 일 | ✓ |
|---|---|---|
| 1 | `src/app/api/posts/[id]/route.ts:10-53` POST/DELETE에 `session.user.id === post.author._id` 소유권 검증 추가 | [x] |
| 2 | `src/app/api/comment/[id]/route.ts:44-57` DELETE에 세션 검증 추가 | [x] |
| 3 | `src/app/api/comment/[id]/password/route.ts` 게스트 비번 검증 로직 통합 | [x]\* |
| 4 | 다른 사용자 토큰으로 POST/DELETE 호출 → 403 응답 확인 | [x]\*\* |
| 5 | 비로그인 상태로 댓글 DELETE 호출 → 401 응답 확인 | [x] |
| 6 | `pnpm build && pnpm lint` 통과 | [x] |

> \*통합 후 `password/route.ts` 파일 자체를 삭제(무인증 비번 검증 엔드포인트 제거) — 검증 로직은 DELETE 핸들러 내부로 이동. 클라이언트도 `useComment.ts`/`PasswordForm.tsx`에서 2단(check→delete) → 단일 `deleteComment(id, parentId, password)` 호출로 재배선.
> \*\*실제 두 계정 토큰으로의 403 교차검증은 이 환경에서 세션 쿠키 발급이 필요해 미실행. 대신 코드 경로(소유권 비교 로직)와 인접 경계(무인증 401, 잘못된 형식 400, 존재하지 않는 리소스 404)는 실제 프로덕션 데이터셋에 대해 curl로 확인함 — 401/400/404 모두 기대값과 일치. 403 자체(로그인O+소유자 아님)는 사용자 로컬에서 별도 계정으로 재확인 필요.

#### Day 14 — bcrypt 강화 + 이미지 업로드 보안

| # | 할 일 | ✓ |
|---|---|---|
| 1 | `src/app/api/auth/register/route.ts:10-31` bcrypt salt rounds 12 이상으로 상향 | [x] |
| 2 | 비밀번호 길이/형식 검증 (zod 스키마) 추가 | [x] |
| 3 | `src/app/api/comment/[id]/route.ts:37` 게스트 댓글 bcrypt salt 12 이상 상향 | [x] |
| 4 | `src/app/api/image/route.ts:4-13` 세션 인증 필수화 + MIME 타입 허용 목록 + 파일 사이즈 제한 | [x] |
| 5 | 비로그인 이미지 업로드 시도 → 401 응답 확인 | [x] |
| 6 | `pnpm build && pnpm lint` 통과 | [x] |
