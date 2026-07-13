# Week 4 이슈 로그

## Day 22 — 좋아요 식별자가 username 기반 (백로그)

`PostIcons`/`getPostDetail`의 좋아요 비교 로직이 유저의 안정적인 `_id`가 아니라 **username**을 기준으로 한다.

Sanity 저장 자체는 ID 기반이다 (`src/service/posts.ts`의 `likePost`/`dislikePost`가 `{ _ref: userId }` 참조를 추가/제거). 하지만 조회용 GROQ projection이 `"likes":likes[]->username`으로 **참조를 username으로 역참조**해서 클라이언트에 내려주기 때문에, `PostIcons`의 `likes.includes(loggedInUser?.username)` 비교가 username 문자열 기준이 됐다.

**지금 당장 버그는 아님**: 이 앱엔 username 변경 기능 자체가 없다 (`ProfileForm.tsx` 확인 — `title`/`introduce`/`name`/이미지/링크만 수정 가능). `->username` 역참조는 매 요청 시점의 실제 username을 가져오므로, 설령 나중에 username 변경 기능이 생겨도 비교 시점 기준으론 즉시 깨지지 않는다.

**그래도 원칙적으로는 개선 대상**: 표시 이름(변경 가능한 필드)에 식별 로직을 얹지 않고 안정적인 `_id`로 비교하는 게 더 견고하다. 고치려면 projection을 `_id` 기반으로 바꾸고 `PostIcons`/`PostDetail`/`loggedInUser` 쪽 비교 로직도 함께 손봐야 해서 범위가 커진다 — Day 22 스코프(중복 fetch 제거) 밖이라 별도 개선 트랙으로 남김.

## Day 22 — `getTagPosts` 태그가 로드맵 원문과 다름 (확인 후 문제없음)

로드맵 원문은 `getTagPosts`에 `next: { tags: ['posts', 'tags'] }`를 기대했지만, 실제 코드(`src/service/posts.ts:128`)는 이미 `next: { tags: ['posts'] }`만 쓰고 있었다. 좋아요/글 작성 mutation이 `posts`(및 `posts/${username}`) 태그만 `revalidateTag`하고 `tags`라는 별도 태그를 쓰는 mutation은 없으므로(grep 확인), 현행 `['posts']` 하나로 충분 — 코드 변경 없이 로드맵 표기만 정정.

## Day 24 — `Avartar.tsx`의 `sizes` prop에 Tailwind 클래스 문자열이 그대로 전달됨 (백로그)

`src/components/ui/Avartar.tsx:23`에서 `next/image`의 `sizes` prop에 `getSizeStyle(type)`을 그대로 넘긴다. 이 함수는 `w-8 h-8` 같은 Tailwind 클래스 문자열을 반환하는데, `sizes`는 `(min-width: ...) Npx` 형태의 미디어쿼리 문법을 기대하는 prop이라 실질적으로 무효한 값이 들어가고 있다 (Day 24 스모크 테스트 중 홈페이지 렌더 HTML에서 `sizes="w-8 h-8"`로 확인).

기능이 완전히 깨지는 건 아니다 — `sizes`가 파싱 불가능한 값이면 Next.js가 사실상 무시하고 기본 동작(100vw 가정 또는 `fill` 모드의 기본 처리)으로 폴백하는 것으로 보이며, 아바타 이미지 자체는 정상 표시된다. 다만 `sizes`가 의도한 최적화 효과(정확한 반응형 srcset 선택)를 전혀 내지 못하고 있다.

Day 24 스코프(`PostCard`/`PostListCard`/`ProjectModal`)는 로드맵에 명시된 파일로 한정했고, `Avartar.tsx`는 Day 35(네이밍 정리, `Avartar` → `Avatar` 리네이밍)에서 같은 파일을 다시 만지게 되므로 그때 함께 고치는 것으로 미룸. `getSizeStyle`은 타입(`small/medium/big/xl/max`)별로 `w-8 h-8`처럼 Tailwind 클래스 문자열만 반환하므로, `sizes`용으로는 타입별 실제 px 값(`32px`/`40px`/`56px`/`110px`/`135px`)을 반환하는 별도 매핑이 필요.

## Day 25 (착수 전) — main vs 현재 브랜치 Lighthouse 비교 중 발견된 백로그 3건

`docs/roadmap1/lighthouse-comparison.md`에 상세 측정 결과 기록. 요약:

1. **`/auth/signin`이 세션 없이도 홈으로 307 리다이렉트됨** (현재 브랜치만 재현, main은 정상 200). `src/app/auth/signin/page.tsx`의 `if (session) redirect('/')`에서 쿠키 없는 curl 요청인데도 `auth()`가 truthy 세션을 반환하는 것으로 추정 — NextAuth v4→v5 마이그레이션 과정에서 생긴 회귀 가능성. 원인 미조사 상태로 보류. 재현: 로컬 프로덕션 빌드(`pnpm build && pnpm start`) 후 쿠키 없이 `/auth/signin` 접근 시 항상 307.
2. **`TagList` 태그 pill 버튼의 터치 타겟 부족** (Lighthouse `target-size` 위반, 홈/태그 페이지에서 확인). `src/components/common/TagList.tsx`의 버튼이 `py-[1px]`로 매우 얇음. Day 25 스코프(`PostUserProfile`, 폼 5개) 밖이라 별도 개선 트랙으로 남김.
3. **포스트 상세 페이지(`/[user]/posts/[id]`) 성능 소폭 저하** — main 대비 current의 `total-byte-weight`(782KiB→842KiB), TBT(390ms→450ms)가 증가하고 Lighthouse Performance 점수도 일관되게 낮음(74 vs 59, 재측정 74 vs 63). 원인 미조사(TUI Editor 청크 또는 React 19/Next 16 런타임 차이로 추정). 추후 성능 트랙에서 확인 필요.

## Day 25 — 시맨틱 HTML + 접근성 작업 중 백로그/함정 2건

1. **`SearchList.tsx`의 검색어 지우기 버튼(아이콘 전용)에 접근 가능한 이름 없음** — `AiFillCloseCircle` 아이콘만 있고 텍스트/`aria-label` 없음. Day 25 스코프(사전 grep으로 확정한 5개 폼 파일) 밖이라 이번엔 건드리지 않고 별도 개선 트랙으로 남김.
2. **클라이언트 사이드 페칭 컴포넌트는 curl 기반 스모크 테스트로 검증 불가 (재발 가능한 함정)** — `PostUserProfile`은 `useUser`(`useSWR`)로 데이터를 클라이언트에서 받아오는 구조라, 서버 렌더 HTML(`curl`)에는 `{userProfile && (...)}` 블록 자체가 비어 있어 `<Link>` 병합 결과를 확인할 수 없었다. 이런 컴포넌트의 접근성/시맨틱 변경은 실제 브라우저(DevTools/키보드 Tab+Enter)로만 검증 가능 — 향후 유사 작업 시 curl 검증에 의존하지 말 것.

## Day 27 — error 경계 추가 중 발견한 기존 버그 2건 (지금 수정)

1. **`[user]/(home)/layout.tsx:25`의 `notFound()` 조건이 잘못된 값을 검사 (설계 결함)** — `if (!user) notFound();`에서 `user`는 URL 라우트 파라미터(문자열)라 존재하지 않는 유저 이름이 와도 항상 truthy이므로 이 조건은 사실상 절대 발동하지 않았다. 원래 의도는 `getUserForProfile(user)` 조회 결과가 없을 때 404를 띄우는 것. 게다가 `service/user.ts`의 `getUserForProfile`은 GROQ 조회 결과가 `null`이어도 `{ ...null, following: 0, followers: 0, links: {...} }` 형태로 **항상 truthy한 객체**를 반환하도록 짜여 있어, 단순히 `if (!userData) notFound()`로는 부족하고 `userData.username`처럼 실제 조회 성공 시에만 채워지는 필드로 검사해야 했다. `if (!userData?.username) notFound();`로 수정.
   - **영향**: 존재하지 않는 유저로 접근하면 `notFound()`가 호출되지 않고 `TabList`(`src/components/user/TabList.tsx:46-47`)가 `undefined` username으로 렌더링을 시도하다가 `path.includes(href)`에서 예외를 던져 **500 에러**로 이어졌다 (Day 27 이전엔 커스텀 error 경계가 없어 Next.js 기본 에러 화면, 이번 작업 중엔 전역 `error.tsx`가 그 예외를 잡아 500으로 응답 — 발견 계기).
2. **`not-found.tsx` 위치가 처음에 `[user]/(home)/not-found.tsx`였던 실수 (재발 가능한 함정)** — `error.tsx`와 마찬가지로 `not-found.tsx`도 **같은 폴더의 `layout.tsx`에서 발생한 `notFound()`는 못 잡는다** (같은 세그먼트가 아니라 한 단계 위 경계여야 함). `(home)/layout.tsx`가 `notFound()`를 호출하므로, 그 경계는 `(home)` 밖 `[user]/not-found.tsx`(route group 밖, 한 단계 위)에 둬야 했다. `error.tsx`/`not-found.tsx`를 도메인 세그먼트에 배치할 때는 항상 "실제 `notFound()`/throw가 발생하는 파일이 `page.tsx`인지 `layout.tsx`인지"부터 확인할 것 — `layout.tsx`라면 그 파일보다 한 단계 위에 경계를 둬야 한다.

## Day 28 — `withSessionUser`가 에러를 throw 대신 return해서 `withErrorHandler`를 우회 (재발 가능한 함정, 지금 수정)

`src/utils/session.ts`의 `withSessionUser`가 세션 없을 때 `throw`가 아니라 `return new Response('Authentication Error', { status: 401 })`로 직접 Response를 반환하고 있었다. `withErrorHandler`는 감싼 핸들러가 **throw한** 에러만 try/catch로 잡기 때문에, 핸들러 내부에서 **return된 Response**는 그대로 통과해버려 22개 라우트를 전부 `withErrorHandler`로 통일한 뒤에도 `posts/[id]`, `likes`, `follow`, `bookmarks`, `image` 등 `withSessionUser`를 쓰는 모든 mutation의 미인증 401 응답만 `text/plain "Authentication Error"`로 남아 있었다 (Day 28 Step 4 스모크 테스트 중 curl로 발견). `throw new HttpError(401, '로그인이 필요합니다.')`로 수정.

**재발 방지 포인트**: 에러 응답을 통일하는 래퍼(`withErrorHandler` 같은)를 도입할 때, 그 래퍼가 감싸는 함수 안에서 호출되는 다른 헬퍼 함수들이 **Response를 직접 return하는 방식**을 쓰고 있지 않은지 함께 확인해야 한다 — return은 wrapper의 catch를 우회하지만 throw는 그렇지 않다.

