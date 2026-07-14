# Week 5: 에디터 교체 + 타입·네이밍·UX 부채 청산 (Day 31–40)

> **전제**: Week 4(Day 23~30)의 잔여 작업(블로그 6·7·8편, 이미지 성능, 접근성, error 경계, API 핸들러, CI)이 끝난 뒤 착수한다.
>
> 구 "30일 이후 선택 트랙" 중 **Track B(에디터 교체)·Track D(네이밍 정리)** 를 이 주차로 편입. **Track C(테스트)는 성능 측정과 묶어 Week 6으로 분리** (상세 week6.md는 추후 작성).

| D | 작업 | 변경 파일 |
|---|---|---|
| ✅ 31 | **에디터 교체 1** — `@uiw/react-md-editor` 설치, `TuiEditors.tsx` → `MdEditor.tsx` 재작성 (value/onChange 제어, 이미지 업로드 drop/paste/툴바 → `POST /api/image`, 다크모드 `data-color-mode` 연동, 미리보기 `MarkDownPost` 통일, `remark-breaks` 도입), `WritePostForm.tsx` ref 로직 단순화 | `src/components/post/MdEditor.tsx`(신규), `mdEditor.css`(신규), `MarkDownPost.tsx`, `WritePostForm.tsx`, `package.json` |
| ✅ 32 | **에디터 교체 2** — `@toast-ui/*` 4패키지 + `prismjs`/`@types/prismjs` 제거, `pnpm-workspace.yaml`의 `tui-color-picker` override/patch/publicHoistPattern 제거, `patches/tui-color-picker@2.2.8.patch`·`tuiEditor.css`·`TuiEditors.tsx` 삭제, 글쓰기/수정 스모크 | `package.json`, `pnpm-workspace.yaml`, `patches/`, `src/components/post/` |
| ✅ 33 | **계정 중복 생성 수정(구글 재로그인 안정화)** — 근본원인: `@auth/core`가 OAuth 로그인마다 `user.id`를 `crypto.randomUUID()`로 재생성해 `_id`가 매번 바뀜(재로그인 시 예전 글 소유권도 깨짐). `account.providerAccountId`(구글 `sub`) 기반 canonical `_id`(`google.<sub>`)로 signIn·jwt 콜백 정합. email 기준 크로스 방식 병합은 하지 않음(방침 확정). 기존 중복 데이터 마이그레이션은 별도 스텝으로 분리 | `src/auth.ts`, `src/service/user.ts` |
| ✅ 34a | **identity/소유권 판정 `_id` 전환** — 좋아요·내 글·팔로우 여부·About 편집·로그 소유·댓글 삭제 판정을 username 문자열 비교에서 `_id`(`_ref`) 비교로 전환(username 중복 시 남의 콘텐츠에 소유 UI가 뜨는 false-positive 제거). URL 스킴/캐시/유일성은 34b로 분리 | `src/service/{posts,comment}.ts`, `src/components/{post,common,about,log,comment}/*` |
| 34b | **username → `_id` 라우팅/캐시 재설계** — `[user]`/`api/[user]` 라우트, 캐시태그, SWR키, 내부 링크·SEO 식별 기준을 username에서 고유 `_id`로 전환 + username 유일성 강제, 구 username URL 리다이렉트 | `src/app/[user]/**`, `src/app/api/[user]/**`, `src/service/{posts,user}.ts`, 링크/훅 다수, `sitemap`/`generateMetadata`, `sanity-studio/schemas/user.js` |
| 35 | **삭제 후 목록/상세 stale 수정(별도 태스크)** — 포스트 삭제 성공 시 목록·상세 캐시(SWR `mutate` + `revalidateTag`) 무효화로 stale 화면 제거 | `src/components/post/PostButtonList.tsx`, `src/hooks/useUserPost.ts`, service `revalidateTag` 호출부 |
| 36 | **typegen 채택 1** — `src/service/posts.ts` 반환 타입을 typegen 타입(`src/sanity/types.ts`)으로 전환, `as unknown as` 캐스트 2곳 제거 | `src/service/posts.ts`, `src/model/post.ts` 사용처 일부 |
| 37 | **typegen 채택 2** — `src/service/user.ts` 캐스트 3곳 + 나머지 service 전환, `src/model/*.ts` 사용처 점진 대체 (컴포넌트 파급 범위 확인하며 진행) | `src/service/user.ts` 외 service 전체, `src/model/*.ts` |
| 38 | **네이밍 정리(Track D)** — `Avartar` → `Avatar` 11파일 `git mv` + import 일괄 수정, `components/post` ↔ `components/posts` 폴더 통합 | `src/components/ui/Avartar.tsx` 외 10파일, `src/components/post*/` |
| 39 | **UX** — toast 알림 컴포넌트 신설 + `alert()` 12곳 교체 (`RegisterForm.tsx`의 "알림 컴포넌트 만들어야 함" 주석 해소) | toast 컴포넌트 (신규), `WritePostForm.tsx`·`PostIcons.tsx`·`CommentForm.tsx`·`SigninForm.tsx`·`RegisterForm.tsx`·`LogDetail.tsx`·`ProfileForm.tsx` |
| 40 | **위생 마무리** — axios 11파일 → fetch 일원화 후 `axios` 의존성 제거, 미사용 `@types/nodemailer` 제거, 좋아요 `_id` 기반 전환(week4 백로그) 착수 여부 재평가 | `src/hooks/*.ts`, 컴포넌트 8파일, `package.json` |

## 검증

- 빌드/린트/타입: `pnpm build && pnpm lint && pnpm exec tsc --noEmit` 무경고 (매 Day)
- **에디터 단계(Day 31~32)**: 글쓰기/수정 페이지에서 마크다운 작성·이미지 업로드·다크모드 전환 스모크. 기존 포스트가 새 에디터에서 깨짐 없이 로드되는지 확인. Day 32 후 `pnpm install` 클린 상태에서 빌드 재확인
- **계정 안정화(Day 33)**: 동일 구글 계정 재로그인 시 user 문서 1건 유지(재로그인 후 확인), `/api/[user]/me` 정상 응답
- **소유권 판정(Day 34a)**: 재로그인 후 내 글/좋아요/팔로우/About/로그/댓글에만 소유 UI 노출, `grep -rn "username ===\|=== .*username\|includes(.*username" src` 0건
- **라우팅 재설계(Day 34b)**: `/{userId}` 라우팅이 항상 본인 문서로 해석, 구 username URL 301 확인, username 유일성 제약 확인, `grep -rn "author->username" src` 0건
- **삭제 반영(Day 35)**: 글 삭제 즉시 목록/상세에서 사라지는지 확인(재조회·재접속 없이), SWR `mutate` + `revalidateTag` 이중 무효화 동작 확인
- **typegen 단계(Day 36~37)**: `pnpm typegen` 재생성 후 타입 에러 0. `as unknown as` 검색 결과 0건
- **네이밍 단계(Day 38)**: `grep -rn "Avartar" src` 0건, import 깨짐 없이 빌드 통과
- **UX 단계(Day 39~40)**: `grep -rn "alert(" src` 0건(핵심 플로우), `grep -rln "axios" src` 0건

---

## Day별 상세 할일

#### Day 31 — 에디터 교체 1 (@uiw/react-md-editor 도입)

| # | 할 일 | ✓ |
|---|---|---|
| 1 | `pnpm add @uiw/react-md-editor` 설치 | [x] |
| 2 | `src/components/post/MdEditor.tsx` 신규 작성 — value/onChange 제어 컴포넌트, `next/dynamic({ ssr: false })` 로드 | [x] |
| 3 | 이미지 업로드: drop/paste 핸들러에서 `POST /api/image` 호출 후 마크다운 이미지 문법 삽입 (기존 `addImageBlobHook` 대체) | [x] (범위 확장: 툴바 파일선택 버튼, 미리보기 렌더러를 `MarkDownPost`로 통일, `remark-breaks` 도입, 툴바 한국어 툴팁 — 상세는 `week5-issues.md` 참고) |
| 4 | 다크모드: `next-themes` theme → `data-color-mode` 속성 연동 | [x] (`resolvedTheme` 사용 — `theme`은 `"system"` 값을 가질 수 있어 실제 색상 계산엔 부적합) |
| 5 | `WritePostForm.tsx`를 ref(`getInstance().getMarkdown()`) 대신 state 기반으로 단순화 | [x] |
| 6 | `pnpm build` 통과 + 글쓰기/수정 스모크 (새 글 작성, 기존 글 로드) | [x] (`pnpm build && pnpm lint && pnpm exec tsc --noEmit` 무경고) |
| 7 | Day 작업 중 나온 개념 질문·답변 중 중요한 내용을 서브에이전트(general-purpose)에 위임해 `learning-notes.md`에 기록 | [ ] |

#### Day 32 — 에디터 교체 2 (TUI 의존성 청산)

| # | 할 일 | ✓ |
|---|---|---|
| 1 | `TuiEditors.tsx`, `tuiEditor.css` 삭제 | [x] |
| 2 | `package.json`에서 `@toast-ui/editor`, `@toast-ui/react-editor`, `@toast-ui/editor-plugin-*` 2종 제거 (`prismjs`는 다른 사용처 확인 후 판단) | [x] (조사 결과 `prismjs`의 유일한 직접 소비처가 `TuiEditors.tsx`였음 확인 — `@types/prismjs`와 함께 제거) |
| 3 | `pnpm-workspace.yaml`에서 `tui-color-picker` override·patchedDependencies·publicHoistPattern 제거, `patches/tui-color-picker@2.2.8.patch` 삭제 | [x] (`react-markdown@8.0.7.patch`는 `MarkDownPost.tsx`가 여전히 사용해 유지) |
| 4 | `pnpm install` 후 lockfile 정리 확인 | [x] (`CI=true pnpm install --no-frozen-lockfile` — overrides 변경으로 frozen-lockfile 불가해 재생성) |
| 5 | `pnpm build && pnpm lint && pnpm exec tsc --noEmit` 통과 + 글쓰기/수정/상세 스모크 | [x] (빌드/린트/타입체크 무경고. `grep -rn "@toast-ui\|prismjs\|tui-color-picker" src` 0건) |
| 6 | Day 작업 중 나온 개념 질문·답변 중 중요한 내용을 서브에이전트(general-purpose)에 위임해 `learning-notes.md`에 기록 | [ ] (이번 Day는 config/삭제 위주라 별도 기록할 신규 개념 없음 — 생략) |

#### Day 33 — 계정 중복 생성 수정 (구글 재로그인 안정화)

> 범위 조정(실행 중 확정): 근본원인은 크로스 방식(이메일가입 vs 구글) 중복이 아니라, **같은 구글 계정 재로그인마다** `@auth/core`가 `user.id`를 `crypto.randomUUID()`로 새로 발급해 `_id`가 매번 바뀌는 것(부수 효과로 재로그인 후 예전 글 소유권도 깨짐). email 기준 upsert/계정 링크는 사용자 방침("이메일가입과 구글로그인은 다른 계정")과 맞지 않아 채택 안 함. username/email 유일성 강제·기존 중복 데이터 정리는 이 버그와 무관하거나 별도 마이그레이션이 필요해 분리.

| # | 할 일 | ✓ |
|---|---|---|
| 1 | `src/auth.ts` `signIn`: `account` 구조분해 추가, canonical id 헬퍼(google → `` `google.${account.providerAccountId}` ``, 아니면 `user.id`) 도입, google일 때만 canonicalId로 `await addUser`(fail-closed), credentials는 addUser 호출 스킵 | [x] |
| 2 | `src/auth.ts` `jwt`: 동일 canonical id 헬퍼로 `token.id` 계산(google이면 canonicalId, 아니면 `user.id`) — `session.user.id == 문서 _id` 정합 | [x] |
| 3 | `pnpm build && pnpm lint && pnpm exec tsc --noEmit` 통과 + 스모크(동일 구글 계정 재로그인 시 문서 수 불변, `/api/[user]/me`·내 블로그 정상) | [x] (기존 세션은 옛 랜덤 `token.id`를 유지하므로 로그아웃 후 재로그인 필요 — 재로그인 후 정상 확인) |
| 4 | Day 작업 중 개념 질문·답변 중 중요한 내용을 서브에이전트(general-purpose)에 위임해 `learning-notes.md`에 기록 | [x] |

**별도 태스크(백로그, 이번 Day 범위 아님)**: 기존 중복 user 문서(랜덤 UUID) 마이그레이션 — canonical `_id` 선정 후 글·댓글·북마크·팔로우 참조 이전, 잔여 문서 삭제(백업/드라이런 필수). username/email 유일성 강제는 Day 34 선행조건으로 별도 처리.

#### Day 34a — identity/소유권 판정 username → `_id`

> 근본원인: username은 유일성 제약이 없어(구글 로그인은 `email.split('@')[0]` 자동 생성, 스키마에 `Rule.unique()` 없음) 중복 가능. 그런데 좋아요/내 글/팔로우/About/로그/댓글의 본인 판정이 전부 username 문자열 비교라 중복 시 남의 콘텐츠에 소유 UI(수정·삭제 등)가 뜨는 false-positive 발생. 저장/뮤테이션은 이미 `_id` 기준이라 데이터는 안 섞이지만 판정 게이트가 뚫림. Day 33에서 `_id`가 재로그인에도 고정되도록 안정화됐으므로 이제 `_id`를 신뢰 가능한 키로 판정 전환.
> 범위: 판정 비교만 전환(URL 스킴·캐시태그·SWR키·SEO·username 유일성 강제는 Day 34b). 참조 대상 id는 deref(`->_id`) 대신 `._ref`로 직접 취득(조인 없음, dangling에 안정).
> 재로그인 필요: Day 33 수정은 새 로그인에만 적용되므로 이 Day 스모크는 **재로그인 후** 진행.

| # | 할 일 | ✓ |
|---|---|---|
| 1 | 좋아요: `posts.ts`의 `fullPostProjection` `likes[]->username`을 `likes[]._ref`로, `PostIcons.tsx`의 username 비교/낙관적 배열을 `loggedInUser.id`로 전환 | [x] |
| 2 | 내 글 판정: `fullPostProjection`에 `"authorId":author._ref` 추가, `model/post.ts` 타입 반영, `PostDetail.tsx:32` id 비교로 전환 | [x] |
| 3 | 팔로우 여부: `FollowButton.tsx:26`을 `item.id===userId`로 전환(projection에 id 이미 존재, 같은 파일 :23 버튼 노출은 이미 id 비교라 정합) | [x] |
| 4 | About 편집 판정: `AboutHero.tsx`·`about/edit/page.tsx`에 프로필 `id` 전달·비교로 전환 | [x] |
| 5 | 로그 소유 판정: `LogList.tsx`에 owner `id` 전달·비교로 전환 | [x] |
| 6 | 댓글 삭제 판정: `comment.ts` projection에 `authorId`(`author._ref`, 게스트는 null) + 글 주인 id 추가, `Comment.tsx` id 비교로 전환(게스트 비밀번호 삭제 경로는 유지) | [x] |
| 7 | `pnpm build && pnpm lint && pnpm exec tsc --noEmit` 무경고 + `grep -rn "username ===\|=== .*username\|includes(.*username" src` 0건 + 재로그인 후 소유권 스모크 | [x] (스모크 중 추가 버그 4건 발견·수정 — 상세는 아래 노트) |
| 8 | Day 34a 개념 Q&A 서브에이전트(general-purpose) 위임해 `learning-notes.md` 기록 | [x] |

> **스모크 중 발견·수정한 추가 버그(범위 내 처리)**: (1) `PostIcons.tsx` — 좋아요 0개 글에서 `likes[]._ref`가 `null`이라 `if (!likes) return;` 가드에 걸려 클릭 무반응 → `initialLikes ?? []`로 정규화. (2) `useMe.ts`의 `toggleFollow`에 `setBookmark`처럼 `optimisticData` 추가 → 새로고침 없이 팔로우 버튼 즉시 반영. (3) `revalidateTag(tag, 'max')`가 즉시 무효화가 아니라 stale-while-revalidate라 낙관적 업데이트가 되돌아가고 중복 팔로우가 생기던 근본원인 확인(Next.js 16 공식 문서로 검증) → 프로젝트 전체 17개 호출부를 `revalidateTag(tag, { expire: 0 })`로 전환(`week5-issues.md`의 Day 31 백로그 항목 해소). (4) `FollowButton.tsx` UX 정리 — 반영이 즉시 되니 불필요해진 `PulseLoader` 스피너 제거, 그로 인한 flex stretch 레이아웃 깨짐 수정, `disabled` 시 텍스트 흐림 스타일 제거(`Button.tsx`에서 `disabled`를 실제로 쓰는 소비처가 이 컴포넌트뿐이라 안전).

#### Day 34b — username → `_id` 라우팅/조회/캐시 재설계 (별도 태스크)

> 범위 주의: username을 키로 쓰는 지점이 라우트 22개 + 컴포넌트/훅 20여 곳. 하루 초과 시 추가 분할.
> URL 스킴 결정 필요: `/{username}` → `/{userId}`로 바꾸면 가독성·기존 인덱싱 URL 영향. 구 username→`_id` 301 리다이렉트를 함께 넣거나, "표시용 username + 유일성 보장 + 내부 `_id` 조회" 방식 중 택1 (이 Day에서 username 유일성을 강제하면 후자로도 정합성 확보 가능).

| # | 할 일 | ✓ |
|---|---|---|
| 1 | `[user]`/`api/[user]` 동적 세그먼트를 `_id` 기준으로 해석 — service 조회 함수(`getUserByUsername`(user.ts:142) → `getUserById` 등)와 라우트 파라미터 처리 전환 | [ ] |
| 2 | `src/service/{posts,user,log,search,portfolio}.ts` GROQ의 `author->username == $username` 필터를 `_id`(`author->_ref == $id`) 기준으로 전환 | [ ] |
| 3 | 캐시태그 전환: `posts/${username}`·`tags/${username}`·`profile/${username}`·`about/${username}`·`log/${username}`(service + `revalidateTag` 호출 전부)를 `_id` 기반 키로 통일 | [ ] |
| 4 | SWR 키 전환: `useUserPost`(useUserPost.ts:11-12,31)·`useLogs`·`useLogDetail`·`useMe`(Header.tsx:30, useMe.ts:24)·`UserTagList`·`SearchList` 등 `/api/${username}/...` 키 → `_id` 기반 | [ ] |
| 5 | 내부 링크/네비 전환: `Header.tsx:37,40,45`·`UserCard`·`UserAvartar`·`Comment.tsx:74`·`FollowNumButtons`·`TabList`·`PostCard`/`PostListCard`/`AdjacentPostCard`/`PostUserProfile`·`WritePostForm.tsx:69`·`AboutForm`/`ProfileForm`/`LogDetail`의 `` `/${username}...` `` 전부 `_id` 기반으로 | [ ] |
| 6 | username 유일성 강제: `sanity-studio/schemas/user.js`에 `Rule.unique()` 추가, 구글 로그인 username 충돌 처리 | [ ] |
| 7 | SEO: `[user]/posts/[id]/page.tsx:61` canonical, `sitemap` 생성부, JSON-LD의 user URL을 `_id` 스킴으로 갱신 + 구 username URL 301 리다이렉트 | [ ] |
| 8 | `pnpm build && pnpm lint && pnpm exec tsc --noEmit` 통과 + 프로필/글목록/상세/글쓰기/팔로우 스모크 | [ ] |
| 9 | 스모크: 로그인 후 "내 블로그" 진입이 항상 본인 문서로 해석되는지 확인 | [ ] |
| 10 | Day 34b 개념 Q&A 서브에이전트(general-purpose) 위임해 `learning-notes.md` 기록 | [ ] |

#### Day 35 — 삭제 후 목록/상세 stale 수정 (별도 태스크)

| # | 할 일 | ✓ |
|---|---|---|
| 1 | `src/components/post/PostButtonList.tsx:25-37` 삭제 성공 후 SWR `mutate`로 목록 키 무효화 추가 (`useUserPost`의 `/api/.../posts` 키) | [ ] |
| 2 | `router.refresh()`/`router.push` 순서 및 `revalidateTag`(서버) ↔ SWR(클라) 이중 캐시 정합성 점검 | [ ] |
| 3 | 스모크: 글 삭제 즉시 목록·상세에서 사라지는지 확인 (재조회/재접속 없이) | [ ] |
| 4 | Day 작업 중 개념 질문·답변 중 중요한 내용을 서브에이전트(general-purpose)에 위임해 `learning-notes.md`에 기록 | [ ] |

#### Day 36 — typegen 채택 1 (posts service)

| # | 할 일 | ✓ |
|---|---|---|
| 1 | `src/sanity/types.ts`의 쿼리 결과 타입과 `src/model/post.ts` 수동 타입 간 차이 목록화 | [ ] |
| 2 | `src/service/posts.ts:86` `as unknown as SimplePost[]` 제거 — typegen 타입 기반으로 전환 | [ ] |
| 3 | `src/service/posts.ts:168` `as unknown as PostData` 제거 | [ ] |
| 4 | 파급된 컴포넌트/훅 타입 정리 (`SimplePost`/`PostData` 사용처) | [ ] |
| 5 | `pnpm typegen && pnpm exec tsc --noEmit` 통과 | [ ] |
| 6 | Day 작업 중 나온 개념 질문·답변 중 중요한 내용을 서브에이전트(general-purpose)에 위임해 `learning-notes.md`에 기록 | [ ] |

#### Day 37 — typegen 채택 2 (나머지 service + model 정리)

| # | 할 일 | ✓ |
|---|---|---|
| 1 | `src/service/user.ts:121,153,183` `as unknown as` 3곳 제거 | [ ] |
| 2 | `src/service/comment.ts`의 `any` 2곳(`:65`, `:78`) typegen 타입으로 대체 | [ ] |
| 3 | 사용처가 사라진 `src/model/*.ts` 타입 삭제 (전부 대체 안 되면 남는 것 목록화해 이슈 기록) | [ ] |
| 4 | `pnpm typegen && pnpm build && pnpm exec tsc --noEmit` 통과 | [ ] |
| 5 | Day 작업 중 나온 개념 질문·답변 중 중요한 내용을 서브에이전트(general-purpose)에 위임해 `learning-notes.md`에 기록 | [ ] |

#### Day 38 — 네이밍 정리 (Track D)

| # | 할 일 | ✓ |
|---|---|---|
| 1 | `git mv src/components/ui/Avartar.tsx src/components/ui/Avatar.tsx` + 컴포넌트/타입명 리네이밍 | [ ] |
| 2 | `UserAvartar.tsx` → `UserAvatar.tsx` 동일 처리 | [ ] |
| 3 | import하는 나머지 9파일 일괄 수정 (`grep -rn "Avartar" src` 0건 확인) | [ ] |
| 4 | `components/post` ↔ `components/posts` 폴더 역할 정리·통합 (도메인 기준 재배치) | [ ] |
| 5 | `pnpm build && pnpm lint` 통과 | [ ] |
| 6 | Day 작업 중 나온 개념 질문·답변 중 중요한 내용을 서브에이전트(general-purpose)에 위임해 `learning-notes.md`에 기록 | [ ] |

#### Day 39 — toast 알림 도입

| # | 할 일 | ✓ |
|---|---|---|
| 1 | toast 컴포넌트/컨텍스트 신설 (라이브러리 vs 자체 구현 결정 포함) | [ ] |
| 2 | `alert()` 12곳 교체 — `WritePostForm`(2) · `PostIcons`(2) · `CommentForm`(3) · `SigninForm`(1) · `RegisterForm`(1) · `LogDetail`(1) · `ProfileForm`(2) | [ ] |
| 3 | `RegisterForm.tsx`의 `//알림 컴포넌트 만들어야 함` 주석 제거 | [ ] |
| 4 | `pnpm build` 통과 + 성공/실패 토스트 노출 스모크 | [ ] |
| 5 | Day 작업 중 나온 개념 질문·답변 중 중요한 내용을 서브에이전트(general-purpose)에 위임해 `learning-notes.md`에 기록 | [ ] |

#### Day 40 — HTTP 클라이언트 일원화 + 의존성 위생

| # | 할 일 | ✓ |
|---|---|---|
| 1 | axios 사용 11파일(훅 3 + 컴포넌트 8)을 fetch 기반으로 전환 | [ ] |
| 2 | `axios` 의존성 제거 | [ ] |
| 3 | 미사용 `@types/nodemailer` 제거 | [ ] |
| 4 | 좋아요 `_id` 기반 전환(week4-issues.md 백로그) — Week 5에서 처리할지 Week 6 이후로 보낼지 재평가·기록 | [ ] |
| 5 | `pnpm build && pnpm lint && pnpm exec tsc --noEmit` 통과 + 좋아요/북마크/댓글/팔로우 스모크 | [ ] |
| 6 | Day 작업 중 나온 개념 질문·답변 중 중요한 내용을 서브에이전트(general-purpose)에 위임해 `learning-notes.md`에 기록 | [ ] |
