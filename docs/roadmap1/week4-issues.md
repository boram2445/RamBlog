# Week 4 이슈 로그

## Day 22 — 좋아요 식별자가 username 기반 (백로그)

`PostIcons`/`getPostDetail`의 좋아요 비교 로직이 유저의 안정적인 `_id`가 아니라 **username**을 기준으로 한다.

Sanity 저장 자체는 ID 기반이다 (`src/service/posts.ts`의 `likePost`/`dislikePost`가 `{ _ref: userId }` 참조를 추가/제거). 하지만 조회용 GROQ projection이 `"likes":likes[]->username`으로 **참조를 username으로 역참조**해서 클라이언트에 내려주기 때문에, `PostIcons`의 `likes.includes(loggedInUser?.username)` 비교가 username 문자열 기준이 됐다.

**지금 당장 버그는 아님**: 이 앱엔 username 변경 기능 자체가 없다 (`ProfileForm.tsx` 확인 — `title`/`introduce`/`name`/이미지/링크만 수정 가능). `->username` 역참조는 매 요청 시점의 실제 username을 가져오므로, 설령 나중에 username 변경 기능이 생겨도 비교 시점 기준으론 즉시 깨지지 않는다.

**그래도 원칙적으로는 개선 대상**: 표시 이름(변경 가능한 필드)에 식별 로직을 얹지 않고 안정적인 `_id`로 비교하는 게 더 견고하다. 고치려면 projection을 `_id` 기반으로 바꾸고 `PostIcons`/`PostDetail`/`loggedInUser` 쪽 비교 로직도 함께 손봐야 해서 범위가 커진다 — Day 22 스코프(중복 fetch 제거) 밖이라 별도 개선 트랙으로 남김.

## Day 22 — `getTagPosts` 태그가 로드맵 원문과 다름 (확인 후 문제없음)

로드맵 원문은 `getTagPosts`에 `next: { tags: ['posts', 'tags'] }`를 기대했지만, 실제 코드(`src/service/posts.ts:128`)는 이미 `next: { tags: ['posts'] }`만 쓰고 있었다. 좋아요/글 작성 mutation이 `posts`(및 `posts/${username}`) 태그만 `revalidateTag`하고 `tags`라는 별도 태그를 쓰는 mutation은 없으므로(grep 확인), 현행 `['posts']` 하나로 충분 — 코드 변경 없이 로드맵 표기만 정정.

