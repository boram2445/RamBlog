# Learning Notes

Learn by Doing 진행 중 나온 개념 질문과 답변을 Day별로 기록. 코드 변경 없음, 참고용.

## Day 16 — root layout metadata 보강

**Q. metadataBase는 왜 추가해야 하는거야?**

`openGraph`/`twitter`의 이미지·URL 필드는 상대 경로(`/images/og.png`)로 적어도 되게 설계돼 있는데, 링크 미리보기 크롤러(카카오톡, 슬랙, 트위터 등)는 절대 URL이 필요하다. `metadataBase`가 없으면 Next.js가 절대 URL로 못 만들거나 빌드 시 다음 경고가 뜬다:

```
metadataBase property in metadata export is not set for resolving social open graph or twitter images, using "http://localhost:3000"
```

root layout의 `metadata`에 설정하면 하위 페이지 `generateMetadata`에서 자동 상속되어, Day 17 포스트 상세 페이지에서도 재사용된다.

**Q. openGraph가 뭔데?**

페이스북이 만든 메타태그 프로토콜. 링크를 카카오톡·슬랙·트위터 등에 붙여넣었을 때 뜨는 미리보기 카드(제목/설명/썸네일)가 이 태그들로 만들어진다. Next.js의 `metadata.openGraph` 객체를 채우면 `<meta property="og:*">` 태그들을 자동 생성해준다.

**Q. robots는 true 안 해주면 검색이 안 되는거야?**

아니다. `robots` 필드가 없으면 대부분 검색엔진은 기본값을 "인덱싱 허용"으로 간주한다 — `noindex`가 명시될 때만 막힌다. 실제로 RamBlog엔 `next.config.js`/`middleware`/`vercel.json` 어디에도 인덱싱을 막는 설정이 없어 이미 인덱싱 가능한 상태였다.

그럼에도 명시적으로 `{ index: true, follow: true }`를 추가하는 이유:
1. 의도를 코드로 명시 (나중에 실수로 `noindex`가 들어가는 걸 방지하는 안전장치)
2. Vercel 프리뷰 배포는 종종 자동으로 `noindex` 헤더를 붙이는 경우가 있어, production에서 의도치 않게 막히는 걸 방지
3. CLAUDE.md 진단표의 "SEO — sitemap·robots 사실상 부재" 항목을 코드 레벨에서 명시적으로 해소

## Day 17 — 포스트 상세 metadata + JSON-LD

**Q. cache는 어떤 기능이야? 새로 추가된건가?**

`cache`는 React 19의 서버 전용 메모이제이션 함수. `src/app/[user]/posts/[id]/page.tsx`에서 이미 쓰이고 있던 기존 코드(신규 아님) — `git log`로 확인.

Next.js는 `generateMetadata`와 페이지 컴포넌트를 별도로 병렬 실행하는데, 같은 요청 안에서 둘 다 `getPostDetail(id, user)`를 호출하면 원래는 fetch가 2번 나간다. `cache(getPostDetail)`로 감싸두면 같은 요청 스코프 안에서 동일 인자 호출 시 결과를 재사용 — 요청이 끝나면 캐시는 사라진다(전역 캐시 아님).

**Q. next16에서는 페이지 내부에서 호출한 건 알아서 캐시되지 않아?**

아니다. Next.js의 자동 dedup(Request Memoization)은 **Next가 패치한 전역 Web `fetch()`를 직접 호출했을 때만** 동작한다. `getPostDetail`은 내부적으로 `@sanity/client`의 `client.fetch(...)`를 쓰는데, 이건 이름만 비슷할 뿐 Web `fetch()`가 아니라 `get-it`이라는 자체 HTTP 라이브러리를 통해 요청을 보낸다 — Next의 패치 대상이 아니라서 자동 dedup에서 빠진다.

그래서 이 프로젝트는 명시적으로 React `cache()`를 쓴다 — 이건 Web fetch인지 여부와 무관하게 임의의 함수를 인자 기준으로 메모이제이션하는 범용 기능이라, `get-it` 기반 Sanity 호출도 커버 가능하다.

| | 자동 캐시 대상 |
|---|---|
| Next.js Request Memoization | Web `fetch()` 직접 호출만 |
| React `cache()` | 임의의 함수(인자 기준) — Sanity client 포함 |

**Q. openGraph나 twitter 둘 다 리턴 해줘야 하는거야? alternates는 뭔데?**

`openGraph`와 `twitter`는 같은 정보를 표현하는 서로 다른 규격이다. OG는 페이스북 프로토콜이지만 카카오톡·슬랙·디스코드 등 대부분이 표준으로 채택해서 쓴다. 반면 Twitter(X)는 자기만의 `twitter:*` 메타태그 규격을 따로 갖고 있어서, OG 태그만 있으면 트위터에서 미리보기가 부실하게 뜨거나 아예 안 뜰 수 있다. 그래서 내용은 중복이어도(제목/설명/이미지 동일) 태그 namespace가 달라 둘 다 채운다.

`alternates.canonical`은 "이 콘텐츠의 진짜 원본 URL은 여기다"를 검색엔진에 알려주는 태그(`<link rel="canonical" href="...">`). 쿼리 파라미터(`?ref=share`), 프로토콜(`http` vs `https`), trailing slash 유무 등으로 같은 콘텐츠가 여러 URL로 접근 가능할 때, canonical이 없으면 Google이 각각을 다른 페이지로 인식해 SEO 점수가 분산되거나 중복 콘텐츠로 판단될 수 있다.

**Q. JSON-LD 이게 왜 필요한건데?**

JSON-LD는 검색엔진이 페이지 콘텐츠를 기계가 읽기 쉬운 구조화된 형태로 이해하도록 돕는 데이터다. `<script type="application/ld+json">` 안에 JSON으로 들어가며, 화면엔 안 보이고 크롤러만 읽는다.

앞서 넣은 `openGraph`/`twitter`(OG 태그)와는 목적과 소비 주체가 다르다: OG는 "링크 미리보기"용(카톡·슬랙에 붙여넣을 때 제목/썸네일이 뜨게 함)이고, JSON-LD는 "검색 결과 자체를 어떻게 보여줄지"를 구글에 알려주는 용도다.

JSON-LD 없이는 구글이 "텍스트가 있다" 정도만 안다. `BlogPosting` 스키마를 넣으면 "이건 블로그 글이고 제목/작성자/발행일이 이렇다"를 명시적으로 알려줘서:
1. 검색 결과에 작성자명·발행일 스니펫 노출 가능
2. Google Discover, 뉴스 탭 등 특정 노출 채널의 자격 요건 충족
3. 검색엔진이 사이트 전체를 "블로그"로 이해하는 데 도움

`BlogPosting`은 schema.org(구글·빙·야후가 공동 제정한 표준 vocabulary)에 정의된 타입 중 블로그 포스트에 정확히 맞는 스키마라서 이걸 사용한다.

**Q. 컴포넌트명은 뭐라고 해?**

`JsonLd` (파일: `src/components/post/JsonLd.tsx`, export 함수명도 `JsonLd`). 기존 컨벤션(`PostDetail.tsx`처럼 파일명 = 컴포넌트명 PascalCase)을 그대로 따랐다.

**Q. 스키마 조립은 어떻게 하면 되는거야?**

특별한 라이브러리 없이 평범한 JS 객체 리터럴을 만들어 `JSON.stringify`로 문자열화하면 된다.

접근 순서: (1) props에서 필요한 값 구조분해 (2) `BlogPosting` 모양 객체 조립 (3) `<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />`로 렌더.

`'@context'`, `'@type'`처럼 `@`가 붙은 키는 JSON-LD/schema.org 표준 문법이라 그대로 따옴표로 감싸 쓴다(JS 식별자로 못 쓰니까). `headline`, `datePublished` 같은 나머지 필드명은 schema.org가 `BlogPosting` 타입에 대해 정의해둔 고정 필드명 — 임의로 짓는 게 아니라 규격을 따르는 것이다. `author`는 중첩 객체로 schema.org의 `Person` 타입 규격을 따른다.

**실수 노트**

1. `JsonLd` 컴포넌트에서 `import { env } from "process"`(Node.js 원시 `process.env`, zod 미검증)를 잘못 썼다가 `import { env } from "@/lib/env"`(검증된 env)로 수정. Day 16의 metadataBase 교훈과 동일한 패턴의 실수.
2. `generateMetadata`에서 `openGraph`/`twitter`/`alternates`를 반환 객체 최상위(flat)에 잘못 넣었다가, `Metadata` 타입 구조에 맞게 중첩시키는 걸로 수정. 반환 타입을 `Promise<Metadata>`로 명시하지 않아서 tsc가 못 잡았던 실수 — 이후 타입 명시로 검증 가능해짐.

## Day 20 — PostCard / PostListCard 서버 컴포넌트 전환

**Q1. article 전체를 링크로 감싸면 안되는건가?**

A: 안 된다. 이유는 이벤트 버블링 충돌 때문.

PostCard가 렌더하는 TagList.tsx는 `<button onClick={() => router.push('/tags/'+tag)}>`로 태그 이동을 처리하고, UserAvartar.tsx는 `<div onClick={() => router.push('/'+username)}>`로 유저 프로필 이동을 처리한다. 둘 다 실제 `<a>` 태그가 아니라 button/div에 onClick을 건 방식이라 클릭 이벤트가 버블링되어 부모까지 전파된다.

만약 article 전체를 하나의 `<Link href="/posts/...">`로 감쌌다면: 사용자가 태그를 클릭 → TagList의 onClick이 먼저 실행되어 router.push('/tags/xxx') 호출 → 근데 이 클릭 이벤트가 stopPropagation() 없이 버블링되어 바깥 Link까지 도달 → Link도 자기 href(포스트 상세)로 네비게이션을 시도 → 결과적으로 태그를 눌렀는데 포스트 상세로 튕기거나 두 네비게이션이 경합하는 버그.

그래서 이미지 영역과 제목/설명 영역만 각각 별도의 좁은 `<Link>`로 감쌌다. 태그·유저아바타는 그 Link 영역 바깥에 있어서 클릭 충돌이 발생하지 않는다.

**실수 노트**

1. **PostCard.tsx**: `useRouter` import가 실제로는 안 쓰이는데(handleClick 삭제 후에도) 남아있었음. ESLint(`no-unused-vars` 룰 미설정)와 tsc(`noUnusedLocals` 미설정) 둘 다 이걸 못 잡아냄 — 툴이 안 잡아준다고 안전한 게 아니라는 걸 보여준 사례. 수동 코드 리뷰로 발견 후 제거.

2. **PostCard.tsx — `grow` flex 위치 버그**: 기존엔 `<div className='grow flex flex-col cursor-pointer' onClick={handleClick}>`가 부모 flex 컨테이너(`grow px-3 py-2 flex flex-col`)의 직속 자식이라 `grow`(flex-grow)가 정상 동작했음. `<Link>`로 교체하면서 className을 안쪽 div에 그대로 두고 Link로만 감쌌더니, 실제 flex item은 이제 Link가 되고 grow가 붙은 div는 한 단계 더 안쪽으로 밀려나 grow가 무효화됨. `flex-grow`는 flex 컨테이너의 직속 자식(flex item)에만 적용된다는 CSS 규칙 때문. 해결: className(`grow flex flex-col cursor-pointer`)을 안쪽 div가 아니라 Link 자체로 옮김.

3. **PostListCard.tsx — 같은 버그의 변형**: Link 자체에 className(`mt-1.5 flex flex-col h-full`)을 옮기는 것까진 맞게 했는데, 그 안에 불필요한 wrapping `<div>` 하나를 추가로 넣어서 제목/설명/날짜 세 블록을 감쌌음. 이러면 `grow`가 붙은 설명 div의 실제 부모가 그 wrapping div가 되고, wrapping div는 flex 컨테이너가 아니라서 grow가 또 무효화됨. 해결: wrapping div를 없애고 세 블록(제목 div, 설명 div, 날짜/좋아요 div)을 Link의 직속 자식으로 나란히 둠 — Link는 여러 자식을 직접 가질 수 있으므로 감싸는 div 자체가 불필요했음.

## Day 21 — 홈 페이지 서버 컴포넌트 전환 (SWR fallbackData hydration)

**Q. 페이지에서 호출하려는거야?**

맞다. `page.tsx`는 서버 컴포넌트라 서비스 함수(`getAllPostsData()`)를 직접 호출할 수 있고, 그 결과를 `<FullPosts initialPosts={posts} />`처럼 클라이언트 컴포넌트에 prop으로 내려주는 게 서버→클라이언트 데이터 전달의 전형적 패턴이다. `FullPosts` 자신은 `'use client'`라 서버 함수를 직접 호출하지 못한다.

**Q. 왜 페이지에서 호출하고 하위에서 또 호출하는거야?**

역할이 다르기 때문이다. 서버 호출(`page.tsx`)은 요청당 1회, 최초 HTML을 만들기 위한 것 — 이 결과가 첫 응답에 그대로 박혀 크롤러/초기 페인트에 즉시 반영된다. 클라이언트 호출(`useSWR`)은 마운트 후 도는 것으로, `fallbackData`가 있으면 첫 렌더는 서버 값을 그대로 쓰고 그 이후부터 SWR이 평소처럼(포커스 시 재검증 등) 최신 상태를 유지하는 역할을 한다. 즉 최초 표시는 서버가 책임지고, 이후 신선도 유지는 SWR이 책임지는 분업 구조 — `fallbackData`가 그 둘을 잇는 다리다.

**Q. 그런데 client 패칭 할 필요가 있으려나?**

코드베이스 전체에서 `mutate('/api/posts')`처럼 홈 목록을 직접 갱신하는 로직은 없음(grep으로 확인 — 좋아요/댓글/팔로우는 각자 다른 SWR key를 갱신할 뿐). 그래도 SWR을 유지하는 이유는 `SWRConfigContext`에 `revalidateOnFocus`를 끄는 설정이 없어서, 탭을 벗어났다가 돌아오면 SWR이 자동으로 최신 데이터를 다시 가져오는 기본 동작이 여전히 유효하기 때문. 또한 SWR을 완전히 제거하려면 PostGrid 렌더 방식과 로딩/에러 처리를 통째로 재설계해야 해서 Day 21 스코프(초기 HTML 노출 문제 해결)를 벗어난다 — 필요하다면 별도 리팩터 트랙으로 다룰 사안.

**실수 노트**

1. **`useFullPost.ts` — SWR `fallbackData` + `isLoading` 함정**: `useSWR(url, null, { fallbackData })`로 초기값을 넣었는데도 첫 렌더(SSR)에서 `isLoading`이 여전히 `true`로 나와 `FullPosts.tsx`가 스켈레톤만 그리고 실제 포스트 그리드를 안 그리는 버그가 있었다. `pnpm build && pnpm start` 후 `curl localhost:3000/`로 검증하다가 발견됨(초기 HTML에 `/posts/` 링크가 0건이었음).

   원인: SWR(v2.2.1) 내부에서 `isLoading`은 `fallbackData` 유무와 무관하게, `revalidateIfStale`(기본값 true) 때문에 "마운트 시 재검증이 필요하다"고 판단되면 첫 렌더에 `true`로 계산된다. `fallbackData`는 `data` 값만 채워줄 뿐 `isLoading` 계산 경로엔 반영되지 않는 SWR의 알려진 함정.

   해결: `useFullPost.ts`의 반환값을 `isLoading: !posts`(데이터 존재 여부 기반 파생)로 직접 수정. `fallbackData`가 있으면 `posts`가 즉시 채워져 `isLoading=false`가 되고, 없는 경우(다른 소비자인 `TagsPosts.tsx`)엔 기존처럼 `undefined`라 `isLoading=true` 유지 — 회귀 없이 해결.

   재검증 결과: `pnpm build && pnpm start` 후 `curl localhost:3000/`에서 `/posts/` 링크 8건, `<article>` 8건, 스켈레톤(`animate-pulse`) 0건 확인 — Day 20 `#5`(초기 HTML 링크 노출)와 Day 21 목표가 함께 충족됨.

## Day 22 — 좋아요 중복 fetch 제거 (PostIcons)

**Q. 왜 그런데 useSWR가 아니라 useState로 하려는거야?**

Day 21의 홈 포스트 목록은 여러 사용자가 계속 새 글을 올리는 대상이라 SWR의 백그라운드 재검증(`revalidateOnFocus` 등)이 의미 있어서 SWR+`fallbackData`를 유지했다. 반면 좋아요 배열은 `PostIcons`가 스스로 진실의 원천을 가질 필요가 없는 데이터 — 좋아요를 누르면 `PUT /api/likes`가 `revalidateTag('posts/${username}')`를 호출해서 다음에 상세 페이지에 서버 렌더로 재진입할 때 최신값이 반영된다. "새로고침 없이 실시간 반영"이 필요한 데이터가 아니라 본인 클릭에만 즉시 반응하면 충분한 UI라서, SWR을 쓰려면 `revalidateOnMount`/`revalidateOnFocus`를 다 꺼야 하는데 그러면 SWR을 쓰는 이점이 거의 안 남고, `useState`가 의도를 더 명확히 드러낸다.

**Q. (심화 논증) 그럼 `revalidateOnFocus: false`만 하면 되는 거 아닌가? — 아니, `revalidateOnMount`도 꺼야 완전히 중복 fetch가 없어짐. 근데 그러면 SWR의 이점이 거의 안 남음.**

정확한 지적이었고, 이 논증 전체를 인정했다. 기술적으로는 `revalidateOnMount: false` + `revalidateOnFocus: false`를 설정한 SWR로도 중복 fetch 제거가 가능하지만, 그 경우 SWR을 쓰는 이점(캐시 공유·재검증)이 거의 남지 않으므로 `useState`가 이 케이스에 더 적합하다는 것이 최종 판단. "SWR을 쓰면 안 된다"가 아니라 "SWR의 장점을 실제로 활용하는 데이터에만 SWR을 쓰자"가 핵심.

**Q. 데이터를 가져오는건 다 swr로 통일했던거 아닐까?**

CLAUDE.md의 "클라이언트 동적 갱신은 SWR" 원칙과 배치되는 게 아닌지 확인차 `useMe.ts`의 북마크 토글 로직을 실제로 살펴봤는데, 거기도 SWR `mutate`의 optimisticData 패턴을 쓰고 있었다. 다만 이유가 다르다: `useMe()`의 `loggedInUser`는 `/api/${username}/me/profile`이라는 **하나의 캐시 키를 여러 컴포넌트가 동시에 공유**하는 데이터라 SWR의 진짜 가치(여러 소비자 간 캐시 공유+조율된 재검증)가 실제로 쓰인다. 반면 `PostIcons`의 좋아요는 소비자가 그 컴포넌트 하나뿐이고 초기값이 이미 서버 렌더로 확보돼 있어서 캐시 공유가 필요 없다. 즉 "클라이언트 동적 갱신은 SWR" 원칙은 "여러 곳에서 공유되거나 실시간성이 의미 있는 데이터"를 겨냥한 규칙이지 모든 클라이언트 상태에 무조건 SWR을 쓰라는 뜻이 아니다.

**Q. `loggedInUser?.username` 이런거 username으로 구분지으면 안되는거 아니야? id여야 할거 같은데**

좋은 지적이고 실제로 맞았다. Sanity 저장 자체는 ID 기반(`likePost`/`dislikePost`가 `{ _ref: userId }` 참조로 추가/제거)인데, 조회용 GROQ projection이 `"likes":likes[]->username`으로 참조를 username으로 역참조해서 내려주기 때문에 클라이언트 비교 로직이 username 기준이 된 것. 지금 당장 버그는 아님(username 변경 기능 자체가 없고, 역참조가 매 요청 시점 값을 가져오므로) — 하지만 원칙적으로는 안정적인 `_id` 비교가 더 견고하다는 데 동의, Day 22 스코프 밖이라 백로그로 `week4-issues.md`에 기록.

**Q. 초기값 detail에서 가져옴 -> useState로 로컬 업데이트만 하자 이런건가?**

맞다. 정리: (1) 초기값은 `getPostDetail()`이 서버에서 가져온 `currentPost.likes`를 `PostDetail`→`PostIcons`로 prop 전달, (2) 로컬 업데이트는 `useState` 초깃값으로 삼아 클릭 시 낙관적 갱신, (3) 서버 반영은 `PUT /api/likes`가 `revalidateTag`로 캐시 무효화 → 다음 방문(서버 렌더) 시 최신값 재확보. "이번 세션 UI 반응"은 `useState`가, "다음 방문의 진짜 최신값"은 서버 페칭+`revalidateTag`가 나눠서 책임지는 구조.

