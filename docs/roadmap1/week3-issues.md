# Week 3 이슈 로그

## Day 20 — `#5` 검증 항목 보류

`#5 브라우저 View Source에서 포스트 카드 HTML(링크 등)이 초기 응답에 포함되는지 확인`은 이번 Day에서 충족되지 않았다.

홈(`/`)이 아직 CSR-only(SWR client fetch, `fallbackData` 없음)라 초기 서버 응답 HTML에는 포스트 카드 자체가 없다 (`curl localhost:3000/`로 확인, `/posts/` href 0건). `PostCard`/`PostListCard`가 실제 `<a href>`를 만들도록 고치는 것 자체는 완료했지만, 그 링크가 "초기 응답"에 나타나려면 Day 21(홈 페이지 서버 컴포넌트 전환, `fallbackData` hydration)이 먼저 끝나야 한다.

`#1~#4`는 완료·검증(빌드/lint/tsc 통과, 코드 리뷰로 실제 회귀 2건 발견·수정 확인). `#5`는 Day 21 완료 시점에 함께 재검증 필요 — Day 21의 검증 항목과 사실상 동일한 내용이라 그때 한 번에 확인.

또한 브라우저 자동화 도구가 세션에 없어 마우스오버 시 실제 상태표시줄 URL 확인은 Claude가 직접 하지 못함 — 사용자가 `pnpm dev`로 수동 확인 필요.

**해소(Day 21)**: `src/app/page.tsx`에서 `getAllPostsData()`를 서버에서 페칭해 `FullPosts`에 `initialPosts`로 전달, SWR `fallbackData`로 hydration하도록 변경 완료. `pnpm build && pnpm start` 후 `curl localhost:3000/`로 재검증 — `/posts/` 링크 8건, `<article>` 8건, 스켈레톤(`animate-pulse`) 0건 확인. Day 20 `#5`, Day 21 `#1~#3, #5` 모두 ✅ 처리.

## Day 21 — SWR `fallbackData` + `isLoading` 함정

`useSWR(url, null, { fallbackData })`로 초기값을 넣었는데도 첫 렌더(SSR)에서 `isLoading`이 여전히 `true`로 나와 `FullPosts.tsx`가 스켈레톤만 그리고 실제 포스트 그리드를 안 그리는 문제가 있었다.

**원인**: SWR(`v2.2.1`, `node_modules/swr/core/dist/index.mjs`)에서 `isLoading`은 `fallbackData` 유무와 무관하게, `revalidateIfStale`(기본값 `true`) 때문에 "마운트 시 재검증이 필요하다"고 판단되면 첫 렌더에 `true`로 계산된다. `fallbackData`는 `data` 값만 채워줄 뿐 `isLoading` 계산 경로(`getSnapshot`)엔 반영되지 않는다 — SWR 커뮤니티에 알려진 함정.

**해결**: `useFullPost.ts`의 반환값을 `isLoading: !posts`(데이터 존재 여부 기반)로 재정의. `fallbackData`가 있으면 `posts`가 즉시 채워져 `isLoading=false`, 없으면(예: `TagsPosts.tsx`) 기존처럼 `undefined`라 `isLoading=true` 유지 — 회귀 없음(소비자 2곳 grep으로 확인).

## Day 21 — Lighthouse 측정 보류

로드맵 `#4`(Lighthouse Performance/SEO 점수 기록)는 세션에 브라우저 자동화 도구가 없어 Claude가 직접 측정하지 못함. 사용자가 `pnpm build && pnpm start` 후 Chrome DevTools Lighthouse 탭 또는 `npx lighthouse http://localhost:3000`로 수동 측정 필요.
