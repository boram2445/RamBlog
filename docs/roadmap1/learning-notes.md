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

## Day 24 — 이미지 성능 최적화 (priority·sizes)

**Q. sizes는 어떤식으로 영향을 주는거야?**

`sizes`가 없으면 next/image는 이미지를 "고정 크기"로 간주해서 `width` 값 기준으로 딱 두 개(1x, 2x)짜리 srcset만 만든다 — 브라우저는 뷰포트와 무관하게 자기 DPR만 보고 둘 중 하나를 고른다. 그런데 `PostCard.tsx`의 `<Image>`는 `width={300} height={200}`을 쓰면서도 className에 `w-full`이 있어서 실제 렌더 폭이 300px 고정이 아니라 그리드 컬럼 폭(뷰포트 비율)만큼 늘어난다 — sizes 없이는 이 사실을 브라우저가 전혀 모른다.

`sizes`를 추가하면 next/image가 next.config의 deviceSizes/imageSizes(16~3840px 사이 여러 브레이크포인트) 전체로 촘촘한 srcset을 만들고, 브라우저는 `sizes`의 미디어쿼리를 현재 뷰포트에 대입해 실제 렌더 폭을 계산한 뒤 DPR을 곱해 가장 적합한 srcset 항목을 고른다. PostGrid의 그리드 컬럼(1→2@640px→3@1024px→4@1280px)에 맞춰 `sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"`를 넣었다 — 4K 데스크톱에서 300px 고정 가정으로 이미지가 흐리게 확대되거나, 모바일에서 불필요하게 큰 이미지를 받는 문제를 둘 다 방지한다.

**Q. 그럼 Priority는 무슨 역할을 하는거야?**

기본값은 `loading="lazy"` — 뷰포트 근처에 올 때까지 요청을 미룬다. `priority`를 주면 (1) `loading="eager"`로 전환되고 (2) `fetchpriority="high"`가 붙고 (3) `<head>`에 `<link rel="preload">`가 자동 삽입돼서 HTML 파서가 `<img>` 태그에 도달하기 전에 preload scanner가 미리 요청을 시작한다.

이건 LCP(Largest Contentful Paint, Core Web Vitals 지표) 개선이 목적이다 — 화면에서 가장 큰 콘텐츠(보통 첫 카드 이미지)가 lazy면 요청 시작이 늦어져 LCP도 늦어진다. 문제는 `PostCard`가 기존에 모든 카드에 무조건 `priority`를 걸고 있었다는 것 — 화면 밖 이미지까지 전부 high 우선순위로 동시 요청하면 정작 진짜 LCP 후보와 대역폭을 나눠 가지면서 오히려 역효과가 난다. `index < 3`(스크롤 없이 보이는 첫 줄만) 조건부로 바꿔야 의도한 효과가 남는다.

**Q. 지금 PostCard랑 PostListCard랑 차이점이 뭐야?**

`PostCard`는 `PostGrid`에서 그리드로 배치되어 컬럼 수가 뷰포트에 따라 1~4개로 변하고, 이미지가 카드 폭만큼 늘어나 실제 렌더 크기가 뷰포트 비율로 변한다 — 그래서 vw 기반 `sizes`와, 첫 줄만 조건부로 켜는 `priority`가 필요했다.

반면 `PostListCard`는 `PostList`에서 세로 리스트로 쌓이고 이미지가 `width={160} height={160}` 고정, className에 반응형 확장 클래스가 없어 실제 렌더 크기도 항상 160px 그대로다 — 그리드처럼 vw 계산이 필요 없다. 게다가 유저 프로필 페이지에서만 쓰여 홈처럼 트래픽이 몰리는 진입점이 아니라서 `priority`도 로드맵 대상에서 제외됐다.

**Q. width랑 height가 있어도 sizes가 필요한거야?**

원래 계획은 `PostListCard`에도 `sizes="160px"`를 추가하는 것이었는데, 이 질문에 답하는 과정에서 불필요하다는 게 밝혀져 그 작업 단계를 생략했다.

Next.js 공식 문서 기준 `sizes`가 실제로 필요한 조건은 "width/height가 있냐 없냐"가 아니라 **"실제 CSS 렌더 크기가 width/height 값과 다를 때, 또는 fill을 쓸 때"**다. `PostCard`는 `width=300`을 줬지만 CSS(`w-full`)로 실제 크기가 달라져서 sizes가 필요했다. 반면 `PostListCard`는 `width=160 height=160`이 실제 렌더 크기와 정확히 일치(반응형 확장 클래스 없음)해서, 이 경우 sizes 없이도 Next.js 기본 동작(고정 크기 가정, 160/320 srcset)이 이미 정확하다.

결론적으로 `PostListCard`의 sizes 추가는 생략하고, 대신 진짜 문제가 있던 곳(fill인데 sizes 누락된 `ProjectModal.tsx`)을 고치는 쪽으로 계획을 수정했다.

## Day 27 — error 경계 추가

**Q1. 링크를 버튼처럼 만들려면 어떻게 해?**

`Button` 컴포넌트는 내부가 실제 `<button>` 엘리먼트라 `onClick`만 받고 `href`는 못 받는다. 대신 `<Link>`에 `Button.tsx`가 쓰는 것과 같은 톤의 Tailwind 클래스를 직접 입혀서 "버튼처럼 보이는 링크"를 만들면 된다. `Button.tsx`의 클래스 조합(공통: `border rounded-full transition-all font-semibold`, `black` 색상: `bg-gray-800 hover:bg-gray-700 text-white dark:bg-slate-100 dark:text-neutral-800 dark:hover:opacity-80`, `small` 사이즈: `py-1 px-3 text-sm`)을 그대로 `<Link>`의 `className`에 복사하면 시각적으로 동일하게 나온다. 컴포넌트를 재사용하는 게 아니라 클래스 조합만 복사하는 방식이다. `<Link href="/"><Button>...</Button></Link>`처럼 감싸는 방법도 가능하지만, `Link`가 기본 `inline`이라 `<button>` 자식과 겹치면 클릭 영역이 어색해질 수 있어 클래스만 가져다 쓰는 편이 더 깔끔하다.

**Q2. (next-themes 관련 콘솔 경고를 붙여넣으며) 이건 무슨 에러인거지?**

`not-found.tsx` 작업과 무관한, 기존에 있던 `next-themes`(다크모드) 관련 경고다. `next-themes`의 `ThemeProvider`는 SSR 시 `<html>`에 다크모드 클래스를 붙이기 위해 내부적으로 `<script>` 태그를 하나 렌더링한다(하이드레이션 전에 테마를 미리 적용해 깜빡임(FOUC)을 막는 트릭). 이 스크립트는 `dangerouslySetInnerHTML`로 서버 HTML에 직접 박혀서 브라우저가 HTML을 파싱하며 즉시 실행하는 방식이라 React가 만든 게 아니라 브라우저가 실행한다. 그런데 React 19는 하이드레이션 과정에서 이 `<script>` DOM 노드를 마주치면 "React 컴포넌트 안에서 script 태그를 만나면 클라이언트에서 실행 안 됨"이라는 경고를 새로 띄우기 시작했다. `next-themes`가 아직 이 React 19 경고에 맞춰 `<template>` 방식으로 바꾸지 않아서 생기는 알려진 라이브러리 호환성 경고이며, 실제 영향은 없다 — 다크모드는 정상 동작한다(스크립트가 이미 서버 HTML 파싱 시점에 실행 완료돼 하이드레이션과 무관). Day 27 스코프 밖이라 지금은 손대지 않고 넘어감.

**Q3. error.tsx의 역할이 뭔지 설명해줄 수 있어?**

`error.tsx`는 그 폴더(세그먼트)의 콘텐츠 전체를 자동으로 React Error Boundary로 감싸주는 Next.js 컨벤션이다. 5가지 핵심 규칙:

1. **잡는 범위**: 같은 폴더의 `page.tsx`(및 그 자식들) + 하위 세그먼트에서 렌더링 중 던져진 예외를 잡는다. 더 가까운(구체적인) `error.tsx`가 있으면 그게 먼저 잡는다. 단, **같은 폴더의 `layout.tsx`에서 난 에러는 못 잡는다** — Next.js가 `error.tsx`를 `page.tsx`(및 자식)만 감싸고 그 위의 `layout.tsx` 자체는 감싸지 않는 구조로 배치하기 때문. 그래서 layout까지 포함해 전부 실패하는 최악의 경우를 위해 `global-error.tsx`가 별도로 필요하다.
2. **언제 발동하나**: "렌더링 중 throw"만 잡는다. `onClick` 핸들러 안에서 난 에러나 이미 `.catch()`로 잡은 에러는 렌더링 예외가 아니므로 관여하지 않는다.
3. **reset()**: 전체 페이지 새로고침 없이 React가 그 세그먼트의 렌더링을 다시 시도하게 만드는 함수. 일시적 네트워크 오류였다면 재시도로 정상 렌더링될 가능성이 있다.
4. **왜 'use client' 필수인가**: React Error Boundary는 `componentDidCatch`/`getDerivedStateFromError` 같은 클래스 컴포넌트 생명주기로 구현되는데, 이건 클라이언트에서 React가 실제로 트리를 재조정하며 동작하는 메커니즘이다. 서버 컴포넌트는 이런 생명주기가 없어서 클라이언트 런타임이 필요하다.
5. **error.digest**: 프로덕션 빌드에서는 보안상 에러 상세 메시지를 클라이언트에 노출하지 않고 Next.js가 잘라낸다. 대신 서버 로그와 대조 가능한 해시값(`digest`)만 남긴다.

**Q4. (error.tsx 작성 후) NoContent 텍스트에 error(error.message)를 대신 넣는 게 좋을까?**

추천하지 않는다. 두 가지 이유:
1. **보안 — 내부 정보 유출**: `error.message`엔 종종 내부 구현 디테일(GROQ 쿼리 문자열, DB 연결 정보, 스택 트레이스 파일 경로 등)이 그대로 담긴다. 공격자에게 시스템 구조 힌트를 주는 셈이라 프로덕션에서는 일반 메시지만 보여주는 게 원칙(Next.js도 프로덕션 빌드에서 `error.message`를 자동으로 잘라내고 `digest` 해시만 남긴다).
2. **UX — 사용자에게 의미 없는 정보**: `error.message`는 대개 `"Cannot read properties of undefined"` 같은 개발자용 디버깅 메시지라, 일반 사용자에겐 "오류가 발생했습니다 + 다시 시도" 버튼이 훨씬 명확하고 실행 가능하다.

대안으로 `error.message` 대신 `error.digest`(프로덕션에서 서버 로그와 대조 가능한 해시)를 작게 덧붙이는 정도는 안전한 선택지이지만, 이번 스코프에선 필수가 아니라 고정 메시지를 유지했다.

**Q5. (global-error.tsx 작성 시) 왜 이번엔 최상위가 `<div>`가 아니라 `<html lang="ko"><body>...</body></html>`이어야 해?**

`global-error.tsx`가 활성화되는 시점엔 `layout.tsx`가 아예 렌더링되지 않은 상태이기 때문이다. 평소엔 `layout.tsx`가 `<html>`/`<body>`를 만들고, `error.tsx`는 그 안에 `page.tsx` 자리에 끼워지는 방식으로 동작한다 — `<html>`/`<body>`는 언제나 `layout.tsx`가 책임진다. 그런데 `global-error.tsx`가 필요해지는 상황은 **`layout.tsx` 자체가 깨진 경우**다 — `layout.tsx`가 렌더링을 실패했으니 그 안에 있던 `<html>`/`<body>`도 애초에 만들어지지 않는다. `error.tsx`처럼 "누군가 이미 만들어준 `<html>`/`<body>` 안에 끼워지는" 게 아니라 **아무도 `<html>`/`<body>`를 만들어주지 않는 상황**인 것. 그래서 `global-error.tsx`는 `layout.tsx`를 대체하는 역할까지 겸한다 — Next.js가 이 파일을 렌더링할 땐 `layout.tsx`를 건너뛰고 이 파일이 문서 전체(루트)가 된다. `<div>`만 반환하면 브라우저가 `<html>`/`<body>` 없는 비정상 문서를 받게 되고 React 하이드레이션도 루트에서 기대하는 형태와 어긋난다.

**Q6. 왜 하위(도메인별) 경계까지 만들어야 하는거야?**

두 가지 이유:
1. **실패 범위(blast radius)를 좁혀서 나머지 UI를 살려둠**: 전역 `error.tsx`만 있으면, 예를 들어 포스트 상세 페칭 실패 시 그 에러가 계속 위로 전파돼 `layout.tsx`가 렌더링한 `Header`/`Footer`까지 포함된 전체 화면이 전역 `error.tsx`로 통째로 갈아치워진다. 도메인 경계(`[user]/posts/error.tsx`)를 두면 그 에러는 거기서 잡히고 `Header`/`Footer`, 네비게이션은 그대로 살아있어서 사용자가 다른 링크로 바로 이동할 수 있다.
2. **더 정확한 메시지**: 전역 경계는 "무슨 일이 있었는지 모르니" 뭉뚱그린 메시지(`"오류가 발생했습니다"`, `"페이지를 찾을 수 없습니다"`)만 줄 수 있다. 도메인 경계는 발동 조건을 정확히 알기 때문에 `"존재하지 않는 사용자입니다"`, `"포스트를 불러오지 못했습니다"`처럼 원인이 분명한 메시지를 줄 수 있다.

정리하면 전역 경계는 안전망, 도메인 경계는 실패를 더 작고 이해 가능한 단위로 가두는 역할이다.

**실수 노트**

1. `[user]/(home)/layout.tsx`의 `if (!user) notFound()`가 URL 파라미터(항상 truthy)를 검사하던 버그. 조회 결과가 없을 때를 판단하려면 실제 조회된 데이터의 식별 필드(`userData?.username`)를 봐야 하고, `getUserForProfile`처럼 실패 시에도 기본값이 채워진 truthy 객체를 반환하는 함수라면 `!userData` 체크만으로는 부족하다는 교훈.
2. `not-found.tsx`를 처음 `notFound()`가 호출되는 바로 그 폴더(`(home)/`)에 뒀다가, "같은 세그먼트의 layout.tsx는 못 잡는다"는 error.tsx와 동일한 규칙 때문에 무효했던 경험. 도메인 경계를 배치할 때는 "실제 throw/notFound()가 `page.tsx`에서 나는지 `layout.tsx`에서 나는지"부터 확인하고, `layout.tsx`라면 그보다 한 단계 위에 경계를 둬야 한다는 교훈.

## Day 28 — API 공통 에러 핸들러

`src/lib/api-handler.ts`에 `HttpError` 클래스와 `withErrorHandler` 고차함수(HOF)를 만들어, 22개 API route.ts에 제각각으로 흩어져 있던 에러 처리(`JSON.stringify(error)`, plain text 응답, 아예 무처리 등)를 하나로 통일하는 작업.

**Q1. 왜 HttpError를 class로 만든거야?**

`class ... extends Error`로 만든 이유는 세 가지다.

1. **throw/catch와 자연스럽게 맞물림**: JS는 아무 값이나 throw할 수 있지만(`throw "문자열"`도 가능), 관례상 Error(또는 서브클래스)를 던지는 게 표준이다. 그래야 `.stack`(발생 위치 추적), `.message`, `console.error` 출력 포맷 등 JS 엔진과 툴링이 기대하는 동작을 그대로 받는다. `throw { status, message }`처럼 평범한 객체를 던지면 동작은 하지만 `.stack`이 없고 `instanceof Error`가 false가 되어 다른 코드(로깅 등)가 "이게 진짜 에러인가?"를 판단할 때 어긋날 수 있다.
2. **instanceof로 안전하게 타입 구분**: `withErrorHandler`의 catch 블록이 하는 일이 정확히 "이 에러가 어떤 종류냐에 따라 다른 응답을 만든다"이다. `error instanceof HttpError`로 체크하면 TypeScript가 그 if 블록 안에서 `error`의 타입을 자동으로 `HttpError`로 좁혀줘서(narrowing) `error.status`/`error.message`에 타입 에러 없이 접근 가능하다. 평범한 객체였다면 `instanceof`를 못 쓰고 `'status' in error` 같은 덕타이핑으로 체크해야 하는데, 이건 "우연히 같은 모양을 가진 다른 객체"와 구분이 안 되는 약한 체크다.
3. **status라는 우리만의 필드를 안전하게 추가**: 내장 Error엔 HTTP 상태 코드 개념이 없다. extends Error로 만들면 `.message`/`.stack` 같은 기존 기능은 그대로 물려받으면서 우리 도메인에 필요한 `status` 필드만 얹어 확장할 수 있다 — 상속의 전형적인 용도다.

여러 서브클래스(UnauthorizedError, ForbiddenError 등)로 안 나누고 하나로 통일한 이유도 있다: 프로젝트에 기존 에러 타입 구분 관례가 전혀 없었고, 이후 16개 라우트에 이 패턴을 반복 적용해야 하니 `new HttpError(403, '...')`처럼 상태 코드를 인자로 주는 단일 클래스가 매번 새 서브클래스를 만드는 것보다 간단하고 반복 작업 부담이 적다.

**Q2. withErrorHandler도 설명해줘, 코드 전반적으로 이해가 잘 안돼**

Next.js App Router의 Route Handler(API)에서 공통으로 에러를 처리하기 위한 Higher-Order Function(HOF)이다. API마다 try-catch를 쓰지 말고 `withErrorHandler()`가 대신 처리해주는 패턴이다.

`RouteHandler` 타입은 `(req: NextRequest, context: any) => Promise<Response>` — Next.js route handler(`export async function GET(req, context) {...}`)의 모양을 타입으로 정의한 것이다. 실제 각 route.ts의 GET/POST/PUT/DELETE 함수가 전부 이 모양을 따른다.

`withErrorHandler` 자체는 `handler`(원래 라우트 로직)를 받아서 새로운 handler를 리턴하는 고차 함수다. 구조는 원래 Handler → `withErrorHandler()` → try-catch가 추가된 새 Handler. 반환된 함수는 클로저로 원래 `handler`를 기억하고 있다가, 실제 요청이 오면 그 handler를 try 블록 안에서 실행한다.

에러 종류별로 분기한다:

- **HttpError**: `throw new HttpError(404, "존재하지 않습니다.")`가 발생하면 catch에서 `NextResponse.json({ error: error.message }, { status: error.status })`로 응답 — 결과는 `{ "error": "존재하지 않습니다." }` + status 404.
- **ZodError**: zod 스키마 검증 실패(`z.object({ email: z.string().email() })`에 잘못된 값이 들어오는 경우 등) 시 자동으로 발생하는 ZodError를 `error.flatten().fieldErrors`로 단순화해서 `{ "email": ["Invalid email"] }` 같은 필드별 에러 목록을 만들고, `{ error: {...} }` + status 400으로 응답한다.
- **그 외 모든 에러**: DB 연결 실패, 코드 버그 등 예상 못 한 에러는 `console.error(error)`로 서버 로그에만 남기고(DB 비밀번호, stack trace, 파일 경로, SQL, 환경변수 같은 내부 정보가 클라이언트에 노출되는 걸 막기 위해), 클라이언트에는 `{ error: "서버 오류가 발생했습니다" }` + status 500만 내려준다.

실제 사용 예시:

```ts
export const GET = withErrorHandler(async () => {
  const user = await getUser();
  if (!user) {
    throw new HttpError(404, "유저를 찾을 수 없습니다.");
  }
  return NextResponse.json(user);
});
```

여기엔 try-catch가 없지만, 내부적으로는 handler 전체가 try-catch로 감싸진 것과 동일하게 동작한다 — API마다 같은 try-catch를 반복 작성할 필요가 없어진다.

이 패턴의 장점: 중복 제거(모든 API에서 try-catch 반복 불필요), 일관된 응답 형식(항상 `{ error: ... }`), 상태 코드 관리(HttpError만 던지면 적절한 HTTP 상태 코드 자동 설정), 검증 에러 분리(ZodError는 400, 그 외는 500), 보안(예상 못한 내부 오류 상세를 클라이언트에 노출 안 함, 서버 로그에만 남김).

비유하자면 `withErrorHandler`는 가게 입구에 서 있는 경비원 같은 존재다 — 가게 안에서 실제로 물건 파는 일(라우트 로직)은 경비원이 하지 않지만, 안에서 사고가 나면(예외 발생) 경비원이 손님에게 정리된 안내를 대신 전달해준다.

**Q3. 그런데 원래 그런식으로 개발하나?**

A: 네, 실제로 흔한 패턴이다. 실제 사례:

1. **Express의 `asyncHandler` 패턴**: Express는 원래 async 라우트 핸들러 안 에러를 자동으로 못 잡아서, 커뮤니티가 `asyncHandler(fn)` 래퍼로 모든 라우트를 감싸고 중앙에서 에러를 처리하는 게 예전부터 표준 관행이었다(Express 5부터는 내장됨).
2. **NestJS의 `HttpException` + Exception Filter**: 지금 만든 것과 거의 동일한 구조. `throw new HttpException('메시지', 403)`처럼 상태 코드를 가진 에러를 던지면 프레임워크의 전역 Exception Filter가 잡아서 일관된 JSON 응답으로 변환한다.
3. **Next.js 생태계**: App Router의 Route Handler엔 Express 같은 전역 에러 미들웨어가 없어서, "핸들러를 감싸는 HOF + 커스텀 에러 클래스" 패턴이 커뮤니티 해법으로 흔히 쓰인다.

이 패턴으로 수렴하는 이유: "실패는 타입 있는 예외로 던지고, 처리는 경계(boundary) 한 곳에서 한다"는 원칙 때문 — 각 라우트가 자기만의 에러 포맷을 만들면 중복/불일치가 생기는데, wrapper 하나로 모으면 라우트 코드는 "무엇이 실패인지"만 선언(throw)하고 "실패를 응답으로 바꾸는 방법"은 wrapper가 전담한다. 참고로 프로젝트의 기존 `withSessionUser`도 이미 같은 방향(cross-cutting concern 분리)의 패턴이라, `withErrorHandler`가 새 스타일을 들여오는 게 아니라 있던 방향을 에러 처리로 확장한 것에 가깝다.

**Q4. 이렇게 바꾸는 이유가 뭐였지? 어떤 문제가 있기 때문이었어?**

A: 조사에서 확인한 4가지 문제:

1. **`JSON.stringify(error)`가 `NextResponse.json`이 아니라 `new Response(...)`를 씀**: `Content-Type: application/json` 헤더가 안 붙어서 클라이언트 `res.json()` 파싱 시 헤더 불일치 문제가 생길 수 있음. CLAUDE.md 규칙(`JSON.stringify(error) 금지`)에도 위배.
2. **try/catch가 프로젝트 전체에 하나도 없음**: `.then()`은 있는데 `.catch()`가 없는 라우트가 대부분이라, 서비스 함수가 reject하면 아무 데도 안 잡혀서 API인데 Next.js 기본 500 HTML 에러 페이지가 나갈 수 있는 상태였음.
3. **plain text 에러 응답이 라우트마다 제각각**: `new Response('Bad Request', { status: 400 })`처럼 JSON이 아니라 순수 텍스트 응답이 대부분이었고, `'Bad Reqest'`(오타)가 8개 라우트에 반복.
4. **zod 검증 실패 처리 방식이 파일마다 다름**: `auth/register`만 `{ error: parsed.error.flatten().fieldErrors }`로 제대로 구조화, `comment/[id]`는 같은 zod 검증 실패를 그냥 `'Bad Request'` 텍스트로 뭉개서 어떤 필드가 왜 틀렸는지 정보를 버림.

정리: API 전체가 "무엇을 에러 응답으로 내려줄지"에 대한 공통 규칙이 없었다는 게 근본 문제였고, `withErrorHandler`+`HttpError`는 이걸 한 곳에서 강제해서 응답 형식(`{ error }` + 정확한 status + JSON 헤더)을 통일하는 목적.

**Q5. JSON.stringify(error)가 NextResponse.json 이 두개의 차이가 뭔데?**

A: 두 가지 차이가 있는데, 두 번째가 더 치명적이다.

**1. HTTP 헤더 차이**: `new Response(문자열, { status })`는 날것의 Web API Response 생성자라서 헤더를 직접 안 넣으면 `Content-Type: application/json`이 자동으로 안 붙는다. `NextResponse.json(data, { status })`는 Next.js 전용 헬퍼라서 `data`를 알아서 `JSON.stringify`해주고 `Content-Type: application/json` 헤더도 자동으로 붙여준다.

**2. (더 중요) `JSON.stringify(error)`는 Error 객체를 직렬화하면 사실상 `{}`가 된다**: `JSON.stringify`는 "열거 가능한(enumerable) 속성"만 변환하는데, `Error` 인스턴스의 `message`/`stack` 프로퍼티는 enumerable하지 않게 정의되어 있어서 `JSON.stringify`가 순회할 때 아예 안 보인다.

```ts
const error = new Error("실패했습니다");
JSON.stringify(error); // => "{}"
```

일반 plain object(`{ name: "Kim", age: 20 }`)는 `name`/`age`가 enumerable이라 정상적으로 `{"name":"Kim","age":20}`로 변환되지만, `Error`는 다르다. 그래서 기존 코드의 `.catch((error) => new Response(JSON.stringify(error), { status: 500 }))`는 Sanity 호출이 진짜 `Error` 객체로 reject됐다면 클라이언트에 `"{}"`라는 사실상 빈 문자열을 보내고 있었을 가능성이 높다 — 에러 메시지 정보가 통째로 날아간 것.

**해결**: `error.message`만 꺼내서 **새로운 plain object**를 만들면 된다.

```ts
NextResponse.json({ error: error.message }, { status: 500 });
```

이 객체의 `error` 프로퍼티는 enumerable이므로 정상적으로 `{"error":"DB 연결 실패"}`로 변환된다. 핵심은 "원본 Error 객체를 그대로 보내지 말고, 필요한 값(message)만 꺼내서 새 plain object를 만들어라"는 것.

**`NextResponse.json()`이 내부적으로 하는 일**을 풀어 쓰면 다음과 같다:

```ts
// NextResponse.json({ error: "DB 연결 실패" }, { status: 500 })는
// 아래와 동일한 일을 대신 해준다:
new Response(
  JSON.stringify({ error: "DB 연결 실패" }),
  { status: 500, headers: { "Content-Type": "application/json" } }
);
```

그래서 `NextResponse.json()`을 쓰면 (1) `JSON.stringify()`를 직접 호출할 필요가 없고, (2) `Content-Type` 헤더가 자동 설정되며, (3) 응답 형식이 프로젝트 전체에서 일관되게 유지된다.

**결론**: `withErrorHandler`의 핵심 역할은 단순히 try/catch를 줄이는 게 아니라 (1) 어떤 예외가 발생하든 항상 JSON 형태로 응답하고, (2) Error 객체를 그대로 직렬화하는 실수를 막고, (3) 상태 코드와 응답 형식을 프로젝트 전체에서 통일하는 것이다.

## Day 29 — Prettier(format-on-save) + CI 인프라

**Q1. 이 작업의 목적이 뭐야?**

지금 프로젝트엔 코드 품질을 자동으로 강제하는 안전장치가 없다는 게 출발점이었다 — 포매터도 없고 CI도 없어서, 스타일을 맞추는 것도 빌드가 되는지 확인하는 것도 전부 사람이 매번 신경 써야 하는 구조였다. 목적은 이 역할을 도구가 자동으로 보증하게 만드는 것. 원래 계획은 세 축으로 짰다.

1. **Prettier** — 포맷 통일. 예를 들어 Day 28 작업만 봐도 새로 만든 파일은 쌍따옴표를, 기존 파일은 홑따옴표를 섞어 쓰는 식으로 스타일이 파일마다 흩어져 있었다.
2. **(원래 계획했던) Husky pre-commit 훅** — `lint-staged`로 커밋 시점에 자동 검사/포맷을 걸어서, 사람이 깜빡하더라도 위반 사항이 아예 커밋에 들어가지 못하게 막는 장치.
3. **GitHub Actions CI** — push/PR마다 원격 서버에서 lint+typecheck+build를 강제로 돌린다. 로컬 훅을 `--no-verify`로 우회하거나 로컬 환경이 남과 다르더라도 최종적으로 걸러주는 마지막 방어선. 특히 30일 리팩터링이 끝나고 main에 머지하기 전에 "그동안 쌓아온 게 실제로 빌드되는가"를 자동으로 검증해줄 장치라 중요도가 높다.

**Q2. 그냥 저장하는 시점에 코드가 통일되게 하면(에디터 format-on-save) 되는 거 아니야? 왜 커밋 훅까지 필요해?**

이 질문을 계기로 원안(Prettier + Husky + lint-staged + CI 풀세트)에서 경량안(format-on-save + CI, Husky/lint-staged는 제외)으로 계획을 축소했다. 핵심은 "포맷팅"과 "검사"가 서로 다른 축이라는 점을 구분하는 것.

- 저장 시 포맷(에디터 확장)은 **포맷팅 문제만** 해결한다 — 따옴표, 들여쓰기, 세미콜론 같은 것. 이건 질문에서 말한 그대로 맞다.
- 하지만 타입 에러(`tsc --noEmit`), 빌드가 실제로 되는지(`next build` — 특히 env 검증처럼 로컬에선 통과해도 다른 환경에선 깨질 수 있는 것들), eslint 규칙 위반(`<div onClick>` 같은 패턴) 같은 건 저장 시 포맷으로는 전혀 못 잡는다. 이건 "포맷팅"이 아니라 "검사"의 영역이라 별도 도구가 필요하다.
- 커밋 훅(Husky/lint-staged)은 포맷 통일이라는 면에서는 에디터 format-on-save와 상당 부분 겹친다 — 그래서 혼자 하는 사이드 프로젝트에서는 굳이 둘 다 둘 필요가 없다고 판단해 커밋 훅 쪽은 계획에서 뺐다.
- 반면 CI는 유일하게 typecheck/build까지 원격 환경에서 보증해주는 최종 방어선이라 대체 불가 — 그대로 유지했다.

정리하면 포맷 통일(에디터)과 코드 검사(CI)는 서로 다른 축이고, 그중 겹치는 부분(커밋 훅)은 프로젝트 규모에 맞춰 얼마든지 뺄 수 있다는 게 이번에 정리된 인사이트.

## Day 31 — 에디터 교체 1 (Toast UI → @uiw/react-md-editor)

**Q. resolvedTheme을 써야 하는 이유?**

`next-themes`의 `useTheme()`이 반환하는 `theme`은 사용자가 고른 원래 선택값이라 `"system"`일 수도 있다. 반면 `resolvedTheme`은 `"system"`일 때 실제 OS/브라우저 설정을 반영해 계산된 최종 `"light"`/`"dark"` 값이다. `data-color-mode`처럼 실제 색상 모드를 렌더링에 써야 하는 곳에서는 `theme`을 쓰면 `"system"`이 그대로 들어가 버그가 나므로 반드시 `resolvedTheme`을 써야 한다.

**Q. FileList가 왜 유사 배열이야? Array.from은 어떤 역할?**

`input[type=file].files`나 드래그/붙여넣기 이벤트의 `dataTransfer.files`/`clipboardData.files`는 브라우저 DOM API가 반환하는 `FileList` 타입인데, 이는 length와 인덱스 접근(`files[0]`)은 되지만 진짜 `Array`가 아니라서 `.forEach`, `.map` 같은 배열 메서드가 없다(유사 배열, array-like). `Array.from(fileList)`는 유사 배열이나 이터러블을 순회하며 진짜 `Array` 인스턴스로 복사·변환해줘서, 그 이후로 배열 메서드나 `for...of`를 자유롭게 쓸 수 있게 해준다.

**Q. 왜 여러 파일을 연달아 업로드하면 일부가 사라지는(stale closure) 버그가 났는가?**

비동기 루프 안에서 컴포넌트의 `value` prop을 직접 읽어 이어붙이고 `onChange(value + ...)`를 호출하면, prop은 함수 호출 도중에 리렌더링되어 갱신되지 않으므로 매 반복마다 같은 최초 `value`를 읽어버린다(stale closure). 그 결과 여러 이미지를 연속 삽입하면 마지막에 삽입한 것만 남고 앞서 삽입한 내용이 덮어써진다.

해결책은 `let updatedValue = value`처럼 로컬 누적 변수를 두고, 매 반복마다 `updatedValue = updatedValue + ...`로 갱신한 뒤 그 값을 `onChange`에 넘기는 것.

**Q. HTML5 drag&drop에서 onDrop에 preventDefault를 했는데도 왜 브라우저가 새 탭에서 파일을 열어버리는가?**

`onDrop`의 `preventDefault()`만으로는 부족하다. 브라우저는 `dragover` 이벤트에서도 `preventDefault()`가 호출되지 않으면 해당 엘리먼트를 "유효하지 않은 드롭 대상"으로 취급해서 기본 동작(파일을 새 탭에서 열기)으로 fallback한다. 그래서 `onDragOver`에도 `preventDefault()`를 추가해야 drop이 정상 동작한다.

**Q. 에디터 미리보기와 실제 발행된 글의 렌더링이 다른 이유는? (다음 줄 처리 등)**

`@uiw/react-md-editor`의 기본 미리보기는 내부적으로 `@uiw/react-markdown-preview`(react-markdown v10, remark-gfm v4, rehype-raw 포함)를 쓰는 반면, 실제 발행 글은 `MarkDownPost.tsx`가 별도로 react-markdown v8 + remark-gfm v3 + 커스텀 `<br>` 치환 로직으로 렌더링한다. 두 파이프라인의 라이브러리 버전과 플러그인 구성이 다르니 마크다운 소프트 브레이크(줄바꿈) 처리, GFM 확장, 코드/이미지 렌더링 방식이 서로 달라 미리보기가 실제 결과를 대변하지 못하는 문제(WYSIWYG 불일치)가 있었다.

해결책은 `MDEditor`의 `components.preview`를 실제 발행 렌더러인 `MarkDownPost`로 교체해서 편집기 미리보기와 발행 결과가 완전히 동일한 파이프라인을 타도록 통일한 것.

**Q. 마크다운에서 Enter 한 번이 왜 줄바꿈이 안 되는가? remark-breaks는 뭘 하는가?**

CommonMark 표준 마크다운은 Enter 한 번(줄 안에서의 개행)을 "soft break"로 취급해 렌더링 시 공백(스페이스) 하나로 처리한다 — 실제 줄바꿈(`<br>`)이 되려면 원래는 문단 사이 빈 줄이 필요하거나, 줄 끝에 스페이스 2칸을 넣어야 한다.

`remark-breaks`는 이 soft break를 강제로 hard break(`<br>`)로 바꿔주는 remark 플러그인으로, 도입하면 Enter 한 번만으로도 실제 줄바꿈이 된다. 다만 이건 렌더링 방식 자체를 바꾸는 것이라 이미 발행된 기존 글들의 렌더링에도 전부 영향을 준다(사이트 전역 적용).

**Q. (ESLint) `react-hooks/refs` 에러 — ref를 함수 인자로 넘겼는데 왜 "render 중에 ref.current를 읽을 수 있다"는 경고가 뜨는가?**

`{ ...commands.image, execute: () => fileInputRef.current?.click() }`처럼 `ref.current`를 읽는 클로저를 담은 객체를, 헬퍼 함수(`translateTooltip(...)`) 호출의 인자로 넘기면, ESLint는 그 헬퍼 함수가 렌더링 도중 실행되면서 인자로 전달된 객체(그리고 그 안의 클로저)를 렌더링 중에 평가/실행할 수도 있다고 정적으로 판단해 경고를 낸다(실제로 실행되는지 여부와 무관하게, 함수 호출에 ref를 감싼 객체를 인자로 넘기는 패턴 자체를 위험하다고 본다).

해결책은 이런 객체를 함수 호출 경유 없이 순수 객체 리터럴/스프레드로 직접 구성하는 것 — 즉 `translateTooltip`으로 감싸지 않고 `imageUploadCommand`를 인라인 객체 리터럴로 직접 만들었다.

**Q. TypeScript에서 `'children' in cmd`로는 왜 유니온 타입이 좁혀지지 않는가?**

`@uiw/react-md-editor`의 `ICommand<T>`는 `ICommandChildCommands<T> | ICommandChildHandle<T>` 유니온인데, 두 변형 모두 `children` 프로퍼티를 갖고 있다(단, 타입이 다름 — 하나는 배열, 하나는 렌더 함수). `in` 연산자를 이용한 narrowing은 "그 프로퍼티가 존재하는 변형만 걸러내는" 방식인데, 유니온의 양쪽 모두 이미 `children`을 갖고 있으므로 `'children' in cmd`는 아무것도 좁혀주지 못한다(둘 다 조건을 만족).

대신 `Array.isArray(cmd.children)`을 쓰면 런타임에 실제 값이 배열인지 확인하는 것이므로, TypeScript가 이를 근거로 배열 변형(`ICommandChildCommands`)으로 정확히 좁혀준다.

## Day 33 — 계정 중복 생성 수정 (구글 재로그인 안정화)

**Q1. addEmailUser는 왜 랜덤 id를 쓰는거야?**

Sanity의 `client.create()`는 `_id`를 지정하지 않으면 랜덤 id를 자동 생성한다(이메일 회원가입 경로, `src/service/user.ts`의 `addEmailUser`). 반면 구글 OAuth 가입 경로(`addUser`)는 `client.createIfNotExists({ _id: id, ... })`로 특정 `_id`를 명시적으로 지정해, 이미 그 id의 문서가 있으면 아무 것도 안 하는(no-op) 멱등 동작을 한다.

이 두 경로가 서로 다른 `_id` 발급 방식을 쓴다는 게 이후 "구글 재로그인마다 계정이 중복 생성되는" 버그의 배경이 된다 — `createIfNotExists`가 멱등하다는 보장은 넘겨주는 `_id` 값 자체가 매번 같아야 성립하는데, NextAuth의 `user.id`가 로그인마다 랜덤이라 그 전제가 깨졌다.

**Q2. signIn 콜백을 canonical id 헬퍼로 재설계해야 하는 이유는?**

NextAuth v5(`@auth/core`)에서 데이터베이스 adapter 없이 JWT 세션 전략을 쓰면, OAuth 로그인마다 `user.id`가 `crypto.randomUUID()`로 매번 새로 발급된다 — `@auth/core` 소스 코드(`lib/actions/callback/oauth/callback.js`)에 "user는 provider와 독립적이어야 한다"는 의도적 설계 주석이 달려 있다.

그래서 `user.id`를 그대로 Sanity 문서의 `_id`로 쓰면, 같은 사람이 재로그인할 때마다 새 문서가 생성된다. 해결책은 `signIn` 콜백에서 매번 랜덤인 `user.id` 대신, 로그인할 때마다 같은 값이 나오도록 계산되는 canonical id를 만들어주는 헬퍼를 두고 그 값을 Sanity `_id`로 쓰는 것.

**Q3. user가 원래 구글에서 제공해주는 유저 아이디 아니었나?**

아니다. `user.id`는 구글이 주는 고정 식별자가 아니라 `@auth/core`가 세션 전략상 임의로 만들어낸 값이다. 구글의 실제 안정적 식별자(OAuth의 `sub` 클레임)는 `account.providerAccountId`에 별도로 보존돼 있다 — 그래서 재로그인해도 변하지 않는 canonical id를 만들려면 `user.id`가 아니라 `account.providerAccountId` 기반으로 만들어야 한다(`google.${account.providerAccountId}` 형태 채택).

즉 `user`(프로필 정보)와 `account`(어떤 provider로, 어떤 식별자로 로그인했는지)는 NextAuth 콜백에서 서로 다른 목적을 가진 별개의 인자이고, "재로그인해도 변하지 않는 값"이 필요할 때는 `user` 쪽이 아니라 `account` 쪽을 봐야 한다는 게 이번에 정리된 포인트.

**Q4. 그럼 기존 user.id를 계속 쓰면 왜 안 되는건데?**

`user.id`는 매 로그인마다 랜덤이라 재로그인 시 이전 로그인 때의 값과 달라진다. 세션(`session.user.id`)에 이 값을 계속 쓰면, 재로그인 후에는 예전에 작성한 글의 `author._ref`(과거 로그인 시점의 랜덤 id)와 새로 발급된 `session.user.id`가 서로 달라져 `assertPostOwner` 같은 소유권 검증이 실패한다 — 즉 재로그인하면 자기가 쓴 글을 더 이상 수정/삭제할 수 없게 되는 부수 피해가 생긴다.

`account.providerAccountId`(구글 sub)는 같은 구글 계정이면 항상 동일하므로, 이를 기반으로 한 canonical id만이 재로그인 전후로 안정적이다. 결국 이번 수정의 핵심은 "계정을 식별하는 값"과 "세션마다 새로 발급되는 값"을 구분해서, 소유권 검증처럼 영속성이 필요한 곳에는 전자만 써야 한다는 것.

## Day 34a — identity/소유권 판정 username → `_id`

**Q1. targetId가 뭔데? follow랑**

`toggleFollow(targetId, follow)`는 `useMe.ts`에 이미 있던 함수 시그니처. `targetId`는 지금 팔로우 버튼이 붙어있는 프로필 주인의 Sanity `_id`(`FollowButton`의 `userId` prop을 그대로 전달). `follow`는 이 액션 후 도달해야 할 목표 상태를 나타내는 boolean으로, `FollowButton`이 `toggleFollow(userId, !following)`처럼 현재 팔로우 상태의 반대값을 넘겨서 클릭마다 상태가 토글되게 만든다.

**Q2. followers 배열로 낙관적 업데이트를 만들었는데 slice를 어떻게 해야 할지 모르겠다**

세 가지를 짚어야 했다.

1. `followers`가 아니라 `following`을 조작해야 한다 — `followers`는 "나를 팔로우하는 사람들", `following`은 "내가 팔로우하는 사람들"인데, `FollowButton`이 "내가 이 사람을 팔로우했는지" 판정에 읽는 건 `loggedInUser.following`이다.
2. 배열에서 특정 id를 가진 항목을 제거하려면 인덱스 범위로 잘라내는 `slice`가 아니라, 조건에 맞는 항목만 남기는 `filter`를 써야 한다:
   ```ts
   following.filter((item) => item.id !== targetId);
   ```
3. SWR의 `optimisticData`는 배열 자체가 아니라 `loggedInUser` 전체를 스프레드하고 `following` 필드만 교체한 객체여야 한다:
   ```ts
   { ...loggedInUser, following: 새배열 }
   ```
   `setBookmark`가 이미 이 패턴을 쓰고 있었다.

**Q3. `{ id: targetId, username: '', name: '', image: '', title: '' }`처럼 빈 값으로 채우는 이유는?**

SWR의 `optimisticData`는 서버 응답이 오기 전까지 잠깐 화면에 보여줄 임시(낙관적) 데이터다. `following` 배열 항목의 타입(`SimpleUser`)은 `id`/`username`/`name`/`image`/`title` 다섯 필드를 모두 요구하는데, 이 시점(클라이언트에서 방금 팔로우 버튼을 눌렀을 때)에 실제로 아는 값은 대상의 `id`뿐이다.

나머지 필드는 실제로 그 값을 읽어서 화면에 표시하는 곳이 코드베이스 어디에도 없다는 걸 확인했고(팔로우 여부 판정은 `item.id` 비교뿐), 이후 서버 재검증이 오면 실제 값으로 자동 교체되므로 빈 문자열 placeholder로 채워도 안전하다. 즉 타입을 만족시키기 위한 최소한의 더미 값이고, 실질적으로 화면에 노출될 일이 없다.

**Q4. revalidateTag(tag, 'max')가 Next.js에서 올바른 사용법인지 (공식 문서로 검증)**

Next.js 16 공식 문서를 확인한 결과, `'max'`는 버그가 아니라 "블로그 글처럼 약간의 지연이 허용되는 콘텐츠"를 위한 공식 권장 기본값(stale-while-revalidate 방식)이다.

다만 "다음 방문 때도 우선 stale 콘텐츠를 보여준 뒤 백그라운드에서 갱신"하는 방식이라, 사용자가 방금 한 뮤테이션(팔로우, 좋아요, 댓글, 프로필 수정 등)을 즉시 자기 화면에서 확인해야 하는(read-your-own-writes) 라우트에는 적합하지 않다. 이런 경우 공식 문서가 명시한 즉시 무효화 방법은 `revalidateTag(tag, { expire: 0 })`이며, Server Action이 아닌 Route Handler에서는(`updateTag`를 못 쓰므로) 이게 유일한 즉시 무효화 수단이다.

RamBlog의 mutation 라우트 17곳이 전부 `'max'`를 쓰고 있어서, 사용자가 방금 한 행동에 즉시 반영이 필요한 이 라우트들에는 `{ expire: 0 }`으로 일괄 전환했다.

## Day 34b — slug 기반 URL/식별 전환

**Q1. (T1-2 `addUser` 함수 수정 지시 중) "2번은 알려줘 모르겠어"**

`addUser`는 구글 로그인 시 유저 문서를 생성하는 함수인데, 원래는 `{ id, username, email, image, name }`만 받아 그대로 Sanity 문서 필드에 채워 넣고 있었다. 여기에 `slug`도 함께 받아 저장하도록 만드는 게 목표. 즉 (1) 함수 구조분해에 `slug`를 추가해서 호출부(`auth.ts`)가 넘겨준 slug 값을 받고, (2) `client.createIfNotExists({...})`에 넘기는 객체 안에도 `slug` 필드를 넣어 실제 Sanity 문서에 저장되게 하는 것.

**Q2. (auth.ts의 구글 signIn 콜백을 리팩터링한 diff를 보고) "username은 @앞부분이 맞잖아 왜 제거하는거야?"**

diff에서 `username: email.split('@')[0] || ''` 한 줄이 빨간 줄(삭제)로, `username,` 이 초록 줄(추가)로 보여서 username 필드가 삭제된 것처럼 보였지만, 실제로는 삭제가 아니라 값 계산 위치를 변수로 뽑아 재사용한 것이다. `slug` 생성에도 동일한 `email.split('@')[0] || ''` 값이 필요해서(같은 값이 username 필드와 slug 생성의 base 둘 다에 쓰임) 미리 `const username = email.split('@')[0] || '';`로 변수화하고, `generateUniqueSlug(username)`으로 slug를 만든 뒤 `addUser({ ..., username, slug })`처럼 shorthand로 넘긴 것이다. diff에서 빨간 줄과 초록 줄이 나란히 보인 건 "계산식이 있던 자리"가 "변수 참조로 바뀐 것"뿐이고, `username` 필드에 실제로 들어가는 값은 이전과 동일하다.

**Q3. (T1-4 백필 스크립트를 Learn by Doing Step 1로 요청받은 시점에) "이건 근데 왜 만들어야 하는거야?"**

slug 필드는 T1-1에서 스키마에 막 추가한 신규 필드라, 그 전에 만들어진 기존 유저 문서들은 전부 slug가 비어 있다. 그런데 이후 단계(서비스 레이어 조회 전환)에서 프로필/글/댓글 등의 조회 기준을 `username == $username`에서 `slug == $slug`로 바꾸면, slug가 없는 기존 유저는 이 쿼리에 걸리지 않아 프로필·글목록·글상세가 전부 404가 된다. 그래서 전환 전에 기존 문서에 `slug = username`을 미리 채워둬야 기존 URL(`/{username}`)이 그대로 보존된다 — 이게 백필이 필요한 이유다. 다만 실제 처리 방식은 유저 수가 적은 걸 확인하고 별도 스크립트 대신 Sanity Studio에서 직접 slug 칸에 값을 입력하는 수동 방식으로 진행하기로 결정했다(스크립트는 유저가 많거나 username 중복이 많을 때 필요한 안전장치).

