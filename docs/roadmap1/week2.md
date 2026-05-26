# Week 2: Sanity 마이그레이션 + 보안 패치 (Day 8–14)

> 블로그 시리즈 목표: **2편** (TypeGen) + **3편** (GROQ Injection) + **5편** (IDOR)

| D | 작업 | 변경 파일 |
|---|---|---|
| 8 | **Sanity 마이그레이션 ①**: `@sanity/client@latest`, `@sanity/image-url@latest` 업그레이드 + `sanity-studio` 워크스페이스 sanity 패키지 업그레이드 | `package.json`, `sanity-studio/package.json` |
| 9 | **Sanity 마이그레이션 ②**: Sanity TypeGen 도입 — `sanity.cli.ts` 설정, `sanity typegen generate` 스크립트 추가, `src/sanity/types.ts` 자동 생성 | `sanity-studio/sanity.cli.ts`, `package.json` scripts, `src/sanity/types.ts` (생성물) |
| 10 | **Sanity 마이그레이션 ③ + 보안 패치 ①**: `service/posts.ts` 8개 GROQ 쿼리를 **typegen 결과 + 파라미터 바인딩**으로 동시 전환 | `src/service/posts.ts:50,63,70,83,98,116,131,237` |
| 11 | **Sanity 마이그레이션 ④ + 보안 패치 ②**: `service/user.ts`, `service/comment.ts` 잔여 쿼리 동일 패턴으로 전환 + `src/model/*.ts` 수동 타입 제거 (typegen 타입으로 대체) | `src/service/user.ts:51-115`, `src/service/comment.ts:21-134`, `src/model/*.ts` |
| 12 | **블로그 2·3편 발행** — Sanity TypeGen / GROQ Injection 회고 | (블로그) |
| 13 | **보안 패치 ③ — IDOR**: `posts/[id]` POST/DELETE에 author 소유권 검증 추가 + `comment/[id]` DELETE에 세션 검증 + 게스트 비번 검증 통합 | `src/app/api/posts/[id]/route.ts:10-53`, `src/app/api/comment/[id]/route.ts:44-57`, `src/app/api/comment/[id]/password/route.ts` |
| 14 | **보안 패치 ④**: bcrypt salt rounds 12 상향 (가입 + 게스트 댓글) + 비밀번호 길이/형식 검증 + 이미지 업로드 라우트 인증/MIME/사이즈 제한 | `src/app/api/auth/register/route.ts:10-31`, `src/app/api/comment/[id]/route.ts:37`, `src/app/api/image/route.ts:4-13` |

## 검증

- 빌드/린트/타입: `yarn build && yarn lint && yarn typecheck` 무경고
- **마이그레이션 단계(Day 8~11)**: 빌드 성공 + 핵심 라우트 수동 스모크 테스트 (홈, 포스트 상세, 로그인, 글쓰기, 댓글)
- **보안 단계(Day 13~14)**: 다른 사용자 토큰으로 API 호출 → 403 응답. 비로그인으로 댓글 DELETE 호출 → 401. 잘못된 비밀번호 검증 우회 시도 → 차단

---

## Day별 상세 할일

#### Day 8 — Sanity 패키지 업그레이드

| # | 할 일 | ✓ |
|---|---|---|
| 1 | 현재 `@sanity/client`, `@sanity/image-url` 버전 확인 (`yarn list --pattern @sanity`) | [ ] |
| 2 | `yarn upgrade @sanity/client@latest @sanity/image-url@latest` 실행 | [ ] |
| 3 | `cd sanity-studio && yarn upgrade sanity@latest` 실행 | [ ] |
| 4 | Breaking changes 확인 (API 시그니처 변경 등) → 필요 시 `src/service/sanity.ts` 수정 | [ ] |
| 5 | `yarn build` 통과 + 포스트 목록/상세 스모크 | [ ] |

#### Day 9 — Sanity TypeGen 도입

| # | 할 일 | ✓ |
|---|---|---|
| 1 | `sanity-studio/sanity.cli.ts`에 typegen 설정 추가 | [ ] |
| 2 | `package.json` scripts에 `"typegen": "sanity typegen generate"` 추가 | [ ] |
| 3 | `yarn typegen` 실행 → `src/sanity/types.ts` 자동 생성 확인 | [ ] |
| 4 | 생성된 타입 파일 검토 (스키마 누락·오류 없는지) | [ ] |
| 5 | `yarn build && yarn typecheck` 통과 | [ ] |

#### Day 10 — posts.ts GROQ 쿼리 typegen + 파라미터 바인딩

| # | 할 일 | ✓ |
|---|---|---|
| 1 | `src/service/posts.ts`의 8개 raw string 쿼리 위치 파악 (라인 50, 63, 70, 83, 98, 116, 131, 237) | [ ] |
| 2 | 각 쿼리에서 `${변수}` → `$변수` 파라미터 바인딩으로 전환 | [ ] |
| 3 | `client.fetch(query, { 변수 })` 두 번째 인자 추가 | [ ] |
| 4 | typegen 결과 타입으로 fetch return type 지정 | [ ] |
| 5 | `yarn build && yarn typecheck` 통과 + 포스트 목록·상세·태그 스모크 | [ ] |

#### Day 11 — user.ts + comment.ts + model/*.ts 정리

| # | 할 일 | ✓ |
|---|---|---|
| 1 | `src/service/user.ts:51-115` 쿼리 파라미터 바인딩 전환 | [ ] |
| 2 | `src/service/comment.ts:21-134` 쿼리 파라미터 바인딩 전환 | [ ] |
| 3 | `src/model/*.ts` 수동 타입 중 typegen 타입으로 대체 가능한 것 제거 | [ ] |
| 4 | `yarn build && yarn typecheck` 통과 + 댓글 조회/작성 스모크 | [ ] |

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
| 1 | `src/app/api/posts/[id]/route.ts:10-53` POST/DELETE에 `session.user.id === post.author._id` 소유권 검증 추가 | [ ] |
| 2 | `src/app/api/comment/[id]/route.ts:44-57` DELETE에 세션 검증 추가 | [ ] |
| 3 | `src/app/api/comment/[id]/password/route.ts` 게스트 비번 검증 로직 통합 | [ ] |
| 4 | 다른 사용자 토큰으로 POST/DELETE 호출 → 403 응답 확인 | [ ] |
| 5 | 비로그인 상태로 댓글 DELETE 호출 → 401 응답 확인 | [ ] |
| 6 | `yarn build && yarn lint` 통과 | [ ] |

#### Day 14 — bcrypt 강화 + 이미지 업로드 보안

| # | 할 일 | ✓ |
|---|---|---|
| 1 | `src/app/api/auth/register/route.ts:10-31` bcrypt salt rounds 12 이상으로 상향 | [ ] |
| 2 | 비밀번호 길이/형식 검증 (zod 스키마) 추가 | [ ] |
| 3 | `src/app/api/comment/[id]/route.ts:37` 게스트 댓글 bcrypt salt 12 이상 상향 | [ ] |
| 4 | `src/app/api/image/route.ts:4-13` 세션 인증 필수화 + MIME 타입 허용 목록 + 파일 사이즈 제한 | [ ] |
| 5 | 비로그인 이미지 업로드 시도 → 401 응답 확인 | [ ] |
| 6 | `yarn build && yarn lint` 통과 | [ ] |
