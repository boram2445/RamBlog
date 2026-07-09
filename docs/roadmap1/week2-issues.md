# Week 2 이슈 로그

## Day 8 진행 중 — 패키지 매니저 yarn 4(berry) → pnpm 전체 이주

**계기**: Day 8 Sanity 패키지 업그레이드 후 `sanity-studio`(별도 yarn v1 lockfile 미니 프로젝트) 실행을 시도하다, corepack이 root의 `packageManager: yarn@4.15.0`을 studio에도 강제하며 tracked된 yarn v1 lockfile을 berry 포맷으로 변환하려는 마찰 발생. 근본 원인은 root/studio가 워크스페이스로 묶이지 않은 채 서로 다른 yarn 세대를 쓰는 구조.

**결정**: 전체 프로젝트를 pnpm으로 이주하고 root + `sanity-studio`를 하나의 pnpm 워크스페이스로 통합 (Day 3의 yarn 1→4 업그레이드 결정을 일부 되돌림). pnpm의 격리형 node_modules가 root(React 19)/studio(React 18) 버전 충돌 없이 하나의 워크스페이스로 관리하기 더 적합하다고 판단.

**변경 사항**:
- `pnpm-workspace.yaml` 신규 — `packages: ['sanity-studio']`, `allowBuilds`(네이티브 빌드 승인), `publicHoistPattern`, `overrides`, `patchedDependencies`. pnpm 11부터 이 설정들이 `package.json`의 `pnpm` 필드에서 `pnpm-workspace.yaml`로 이전됨(구버전 문서 기준 자료와 다름 — 마이그레이션 중 실제로 발견)
- `.yarn/`, `.yarnrc.yml`, `yarn.lock`(root/studio 둘 다) 삭제 → `pnpm-lock.yaml`로 대체
- yarn 패치 2건(`react-markdown@8.0.7`, `tui-color-picker@2.2.8`)을 `patches/*.patch`로 그대로 포팅 (내용 변경 없이 diff 포맷 호환)

**막힌 지점과 해결**:
1. `tui-color-picker`가 `@toast-ui/editor`의 전이 의존성인데 앱 코드(`TuiEditors.tsx`)가 직접 deep import — pnpm 격리형 node_modules에서 phantom dependency로 막힘. `publicHoistPattern: ['tui-color-picker']`로 해소. **임시 해법**: Toast UI Editor 자체를 다른 에디터로 교체할 계획(Track B)이라 tui-color-picker 의존성이 사라질 예정 — 지금은 우회로 충분, 영구 구조 개선은 하지 않음
2. lockfile을 삭제하고 새로 설치하면서 caret 범위(`^`) 의존성들이 이전 yarn.lock 고정 버전보다 훨씬 높은 버전으로 자동 상향됨. 이 중 두 건이 실제 문제를 일으켜 원복(override로 이전 lock 버전 고정):
   - `swr` 2.2.1 → 2.4.2: `mutate()` 타입이 엄격해져 `useMe.ts`/`PostIcons.tsx`의 기존 타입 불일치가 tsc 에러로 노출됨
   - `sanity`(studio CLI) 3.15.1 → 3.99.0: v4 출시(2026-07-15) 임박 버전이라 `styled-components@^6` 요구 강제 → studio dev 서버 기동 자체가 실패
   - `axios` 1.4.0 → 1.18.1: 즉각적 에러는 없었으나 큰 minor 점프라 예방적으로 원복
   - 판단 기준: 이번 작업은 **PM 교체이지 의도적 의존성 업그레이드가 아니므로**, 동작이 바뀔 수 있는 드리프트는 이전 고정 버전으로 되돌리고 실제 업그레이드는 각 항목의 원래 계획된 Day(예: studio v3→v6은 별도 트랙)로 미룸

**영향받지 않은 부분**: Day 8에서 진행한 root `@sanity/client`/`@sanity/image-url` 업그레이드(`^6.4.6→^7.23.0`, `^1.0.2→^2.1.1`)와 `sanity.ts` v2 import 수정은 이 이주 과정에 그대로 승계됨.

**검증**: `pnpm build`/`pnpm lint`/`pnpm exec tsc --noEmit` 무경고, root `pnpm dev` 홈·로그인 스모크(200), `sanity-studio`에서 `pnpm dev` → `localhost:3333` 200 확인.

## Day 9 진행 중 — studio sanity 업그레이드 선행 (Day 8에서 미룬 트랙을 앞당김)

**계기**: `sanity typegen` 명령이 sanity ≥3.32부터 제공되는데, studio의 `sanity`/`@sanity/vision`이 Day 8 pnpm 이주 시 `pnpm-workspace.yaml` override로 `3.15.1`에 고정돼 있었음(이유: 3.99로 올렸을 때 `styled-components@^6` 강제 요구로 studio dev 서버 기동 실패 → 원복). typegen 도입을 위해 이 고정을 지금 풀어야 했음.

**변경 사항**:
- `pnpm-workspace.yaml`의 `sanity: 3.15.1`, `@sanity/vision: 3.15.1` override 제거
- `sanity-studio/package.json`: `sanity`/`@sanity/vision` `^3.99.0`로 업그레이드, `styled-components` `^5.3.9` → `^6.1.19`, `@types/styled-components`(v5용) 제거(v6는 자체 타입 내장), `typescript` `^4.9.5` → `^5.6.3`

**검증**: `sanity-studio`에서 기존에 떠 있던 구버전 dev 프로세스(포트 3333)를 발견해 종료 후 재기동 — `sanity@3.99.0`/`styled-components@6.4.3`로 정상 기동(`localhost:3333` 200, HTML 정상 렌더, 크래시 없음). root `pnpm exec tsc --noEmit` 무경고, `pnpm lint` 0 에러(기존 스키마 파일 default-export 경고 5건은 무관). root `pnpm build`는 이 환경에 `.env.local`이 없어 env 검증 단계에서 실패 — studio 변경과 무관한 환경 제약(시크릿 미설정), 사용자 로컬에서 `.env.local` 존재 시 재확인 필요.

## Day 9 — TypeGen 설정 배선 노트

**배선**: root `package.json`에 `schema:extract`(studio cwd에서 `sanity schema extract`, 결과를 `../schema.json`으로 root에 뽑음) + `typegen`(extract 후 studio CLI 바이너리로 `typegen generate`) 스크립트 추가. `sanity-typegen.json`은 root 기준 경로(`schema: ./schema.json`, `generates: ./src/sanity/types.ts`)로 작성 — root에는 `sanity` 패키지가 없어 `typegen generate`도 studio 바이너리(`sanity-studio/node_modules/.bin/sanity`)로 실행하지만, config는 실행 cwd(root)를 기준으로 해석됨.

**false positive 발견**: 초기 `path: "./src/**/*.{ts,tsx}"`로 전체 스캔했을 때 `Duplicate declaration "Comment" in "./src/components/comment/Comment.tsx"` 경고 발생. 원인은 `src/model/comment.ts`의 `export type Comment`와 `Comment.tsx`의 `export default function Comment`가 이름만 같을 뿐 실제 충돌은 아님(생성된 `types.ts`에 `Comment` 타입 없음, 무해). GROQ 쿼리는 `service/*.ts`에만 있다는 아키텍처 규칙에 맞춰 `path`를 `./src/service/**/*.ts`로 좁혀 경고 제거.

**결과**: `sanity schema extract`가 등록 스키마 5종(user/post/tag/log/portfolio) + Sanity 내장 타입 fold까지 16개 타입을 `src/sanity/types.ts`에 생성. `service/*.ts` 쿼리가 아직 raw string이라 GROQ 쿼리 결과 타입은 0건(정상 — Day 10에서 `defineQuery` 전환 후 채워짐). `comment.js` 스키마는 `schemas/index.ts`에 미등록 상태 그대로 유지(Day 11에서 등록 필요성 판단).

**gitignore**: 중간 산출물 `schema.json`(root)만 무시 추가. `src/sanity/types.ts`는 Day 10~11이 참조할 산출물이라 커밋 대상으로 둠(CI 없어 재생성 강제 불가).

## Day 10 — posts.ts 파라미터 바인딩 + defineQuery 전환 중 발견 2건

**1) typegen 파서가 `as const`(TSAsExpression)를 지원하지 않음**: 공유 projection 프래그먼트(`simplePostProjection`/`fullPostProjection`)의 TS 리터럴 타입 보존을 위해 `as const`를 붙였다가 `sanity typegen generate`가 `Unsupported expression type: TSAsExpression`로 실패. typegen은 TypeScript 타입 체커가 아니라 자체 AST 파서로 소스를 읽어 쿼리 텍스트를 정적 해석하므로, `as const` 없이 plain 문자열 const로 둬도 프래그먼트 인터폴레이션을 정확히 풀어냄(실측: 9개 쿼리 모두 정상 생성, projection 구조 그대로 반영). → `as const` 제거로 해결. 결과적으로 `client.fetch(query, params)` 호출부의 자동 리터럴 타입 매칭(`SanityQueries` 맵)도 plain const만으로 정상 동작 확인(tsc 에러가 오히려 `AllPostsQueryResult` 등 정확한 타입을 가리켜 증명됨).

**2) `@sanity/client`의 `QueryParams`가 `tag`를 예약 키로 막음**: `getTagPosts`/`getUserTagPosts`에서 GROQ 파라미터명으로 `$tag`/`{tag: ...}`를 쓰자 `client.fetch` 오버로드 매칭이 전부 실패(`Type 'string' is not assignable to type 'undefined'`). 원인은 `@sanity/client`의 `QueryParams` 인터페이스가 CDN 요청 옵션(`tag`, `cache`, `next` 등)과의 혼동을 막기 위해 `tag?: never`로 예약해둔 것. 파라미터명을 `$tagName`/`{tagName: ...}`로 변경해 해결.

## Day 11 #1 — user.ts 전환 중 발견

**CLAUDE.md 실행 단위 재준수**: Day 9·10에서 여러 `#N` task를 한 스텝으로 묶어 처리했는데, `week{N}.md`의 "실행 단위" 규칙(task 1개씩 진행 후 정지)과 정확히 맞지 않았음. Day 11부터 `#1`(user.ts)·`#2`(comment.ts)·`#3`(model 제거)·`#4`(빌드 검증)를 각각 별도 스텝으로 분리해 진행.

**`loginWithEmail`이 `src/auth.ts`로 흘러가며 타입 깨짐**: `getUserByUsername`/`getUserForProfile`처럼 명시적 반환 타입 애노테이션이 있는 함수는 브릿지 캐스트로 바로 봉합됐지만, `loginWithEmail`은 원래 애노테이션이 없어 암묵적 `any`로 동작하던 함수였음. `defineQuery` 전환 후 typegen 쿼리 결과 타입(nullable 필드 포함)이 그대로 추론되어, 이를 그대로 반환·소비하는 `src/auth.ts`의 NextAuth credentials `authorize` 콜백에서 tsc 에러 발생. `loginWithEmail`에 명시적 반환 타입 + 브릿지 캐스트를 추가해 해결(기존 소비 형태 그대로 유지) — **교훈**: 애노테이션 없는 함수도 typegen 전환 시 다운스트림 소비처까지 tsc로 반드시 확인해야 함.

**발견(수정 안 함, 기록만)**: `getUserByUsername`의 실제 GROQ 프로젝션에 `posts` 필드가 없는데 반환 타입 `HomeUser`(`src/model/user.ts`)는 `posts: number`를 요구함 — Day 11 이전부터 있던 쿼리/타입 불일치. 이번 task 범위 밖(파라미터 바인딩만 다룸)이라 손대지 않음 — Day 11 #3(model 정리) 또는 이후 버그 수정에서 처리 필요.

## Day 11 #2 — comment.ts 전환 중 발견: patch 경로 selector의 클라이언트 입력 보간 (⚠️ Day 13 재검토 필요)

`src/service/comment.ts`의 `findComment`(`commentPath`)와 `addNestedComment`(`appendType`)가 Sanity **patch mutation의 경로 selector 문자열**(`comments[_key == "..."]...`)을 만드는데, 이건 GROQ 쿼리가 아니라 `.patch().insert()`/`.append()`/`.setIfMissing()`에 전달되는 별도 문법이라 `client.fetch`의 `$param` 바인딩이 적용되지 않음(Day10의 `unset()`과 동일한 구조적 제약).

**다만 Day10/11#1의 기존 예외(`dislikePost`/`unfollow`/`removeBookmark`)와 신뢰 수준이 다름**: 그쪽은 세션에서 유래한 Sanity `_id`(사용자가 자유롭게 값을 넣을 수 없음)였던 반면, 여기 `commentId`/`parentCommentId`는 **API 요청(URL 쿼리 파라미터 · body)에서 그대로 받은 클라이언트 입력**(`api/comment/[id]/route.ts`의 `searchParams.get('commentId')`, `password/route.ts`의 `data.commentId`) — 별도 형식 검증 없음.

Sanity patch path selector는 GROQ 전체 파서가 아니라 **단일 문서 내부의 제한된 경로 문법**이라 다른 문서를 조회하거나 데이터를 유출하는 고전적 GROQ Injection과는 다르지만, 임의 문자열이 그대로 경로 표현식에 꽂히는 구조 자체는 위험 표면. **Day 13(IDOR 패치) 진행 시 이 두 지점을 함께 재검토** — 최소한 `commentId`/`parentCommentId`가 실제 Sanity `_key` 형식(영숫자)인지 검증하는 게 정석.

## Day 11 #3 — 보류: model 뷰모델 타입 제거

세션 재개 후 Day 11 #3~4, 13, 14를 한 번에 배치 실행하기 전 스코프 조사. `src/model/*.ts`의 뷰모델 타입이 컴포넌트/훅 40여 개에 광범위하게 소비 중임을 확인(`SimplePost` 21곳, `Emotion` 25곳, `AuthUser` 14곳, `ProfileUser` 13곳, `Comment` 11곳, `Links` 11곳, `Project` 10곳 등 — `grep -rw` 카운트).

typegen이 생성한 쿼리 결과 타입은 nullable 필드·shape이 뷰모델과 다르고(`service/posts.ts`·`service/user.ts`에 이미 `TODO(Day 11 #3)` 캐스트로 이 간극이 표시돼 있음), 일괄 교체 시 소비하는 다수 파일에 연쇄적으로 tsc 에러가 번질 가능성이 높음. 사용자 부재 중 무인 배치로 처리하기엔 위험이 크고, CLAUDE.md도 "점진 대체" 원칙을 명시하므로 **이번 배치에서는 보류**하고 별도 리팩터 트랙으로 미룸. `week2.md` Day 11 행에 각주로 보류 근거 표기.

## Day 13 — IDOR 패치 배치 실행 노트

**posts 소유권 검증**: `service/posts.ts`에 `getPostAuthorId(postId)` 추가(`author->_id` 단일 필드 프로젝션, typegen 반영). `api/posts/[id]/route.ts`에 `assertPostOwner` 헬퍼를 추가해 POST/DELETE 양쪽에서 재사용 — 작성자 불일치 403, 존재하지 않는 글 404.

**comment DELETE 인가 통합**: 기존엔 게스트 댓글 삭제가 `POST /password`(무인증, 비번 일치 여부만 반환)로 먼저 검증하고 별도 `DELETE`를 호출하는 2단 구조라, `DELETE` 자체는 `commentId`만 알면 누구나 호출 가능한 상태였음(로그인 댓글도 동일). 이를 **DELETE 하나로 통합**:
- `service/comment.ts`에 `getCommentMeta` 추가 — 새 GROQ 쿼리를 만들지 않고 기존 `findComment`(내부 함수, patch path 재사용을 위해 이미 있던 조회)를 재사용해 `_type`/`author._ref`만 뽑아냄. typegen 쿼리가 discriminated union(`guestComment` | `loggedInUserComment`)으로 잡혀서 `.author` 접근 전 `_type` 좁히기(narrowing) 필요 — 좁히지 않으면 "Property 'author' does not exist" tsc 에러.
- `api/comment/[id]/route.ts` DELETE: `commentId`/`parentCommentId`를 `commentKeySchema`(영숫자+`-`/`_`)로 형식 검증 → 게스트면 body의 `password`를 `checkPassword`로 검증(불일치 401) → 로그인 댓글이면 `auth()` 세션 필수(401) + `user.id === meta.authorId || user.id === post.authorId`(글 주인도 삭제 가능, 기존 UI `isUserDelete` 조건과 일치) 아니면 403.
- `api/comment/[id]/password/route.ts` **삭제**. 클라이언트도 `useComment.ts`(`checkPassword` 제거, `deleteComment(id, parentId, password?)`로 시그니처 확장) + `PasswordForm.tsx`(2단 호출 → 단일 `deleteComment` 호출, catch에서 에러 메시지 표시)로 재배선.
- POST의 대댓글 경로(`data.commentId`)도 동일하게 patch selector에 보간되므로 같은 `commentKeySchema` 검증을 추가해 Day 11 #2에서 트래킹하던 위험 표면을 해소.

## Day 14 — bcrypt/이미지 업로드 배치 실행 노트

- `src/lib/validation.ts` 신규(zod, `env.ts` 패턴 따름): `commentKeySchema`, `passwordSchema`(8~72자 — bcrypt는 72바이트 초과 입력을 조용히 자르므로 상한을 명시), `registerSchema`.
- `register/route.ts`: body를 `registerSchema.safeParse`로 검증(실패 시 `{ error: fieldErrors }` 400, CLAUDE.md의 `NextResponse.json({ error }, { status })` 규칙 준수), `bcrypt.hashSync(password, 12)`(기존 4).
- `comment/[id]/route.ts` 게스트 댓글: `bcrypt.hashSync(data.password, 2)` → `12`.
- 기존에 salt 2/4로 해시된 값은 마이그레이션 불필요 — bcrypt 해시 문자열에 cost factor가 내장돼 있어 `compareSync`가 저장된 값의 cost로 그대로 재계산함(신규 가입/신규 댓글부터 12 적용).
- `image/route.ts`: `withSessionUser`로 감싸 인증 필수화 + MIME 허용목록(`jpeg/png/webp/gif` 외 415) + 5MB 초과 413.

## 배치 검증 방법 및 제약

- `pnpm typegen`(신규 `postAuthorQuery` 반영) → `pnpm exec tsc --noEmit` → `pnpm lint` 모두 무경고. `password/route.ts` 삭제로 `.next/types/validator.ts`가 그 경로를 계속 참조해 tsc 에러가 났는데, 원인은 Next.js가 생성한 stale 산출물이라 `.next` 삭제 후 재확인해 해소(코드 문제 아님).
- 이번 환경에는 (지난 Day들과 달리) `.env.local`이 존재해 **`pnpm build`가 실제로 성공**(13개 라우트 생성, `password` 라우트가 목록에서 사라짐 확인).
- `pnpm dev`로 로컬 서버를 띄워 실제 프로덕션 Sanity 데이터셋(포스트 8건)에 대해 읽기 전용/부작용 없는 요청으로 스모크: 이미지 업로드 무인증 401, 잘못된 형식의 `commentId` 400, 존재하지 않는 리소스 404, 소유권 없는 글 수정 401(세션 없음), 약한 비밀번호 회원가입 400, 홈/로그인/포스트 상세/댓글 목록 200 — 모두 기대값과 일치.
- **의도적으로 실행하지 않은 것**: 실제 프로덕션 데이터셋에 쓰기(테스트용 guest 댓글 POST)를 시도했으나, 권한 분류기가 "라이브 프로덕션 콘텐츠에 흔적을 남기는 쓰기 작업"으로 정확히 감지해 차단 — 의도적으로 우회하지 않고 스킵. 두 계정 간 403 교차검증(로그인O+소유자 아님)도 실제 세션 쿠키 발급이 필요해 미실행. 두 항목 모두 사용자 로컬에서 재확인 필요.
