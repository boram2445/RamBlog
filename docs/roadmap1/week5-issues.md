# Week 5 이슈 로그

## Day 31 — 삭제 후 목록 stale 조사 중 발견한 연관 버그 2건 (백로그, 이번엔 수정 안 함)

에디터 교체 스모크 테스트 중 "글 삭제해도 목록에 계속 보임"을 조사하다가, 직접 원인(SWR `mutate` 누락, 아래 별도 기록)과는 독립적으로 더 깊은 버그 2건이 드러났다. 범위가 커서 이번엔 손대지 않고 기록만 남긴다.

1. **동일 이메일로 user 문서가 2개 생성됨 (계정 연동 결함)** — 이메일 회원가입(`src/service/user.ts`의 `addEmailUser` → `client.create`, 랜덤 `_id`)과 구글 OAuth 로그인(`src/auth.ts:42-52`의 `signIn` → `addUser` → `client.createIfNotExists({ _id: id })`, `id`는 구글 provider sub)이 서로 다른 `_id` 체계를 쓰고, `signIn` 콜백이 email로 기존 사용자를 조회하지 않고 무조건 `addUser`를 호출한다. 그 결과 같은 이메일로 이메일 가입 후 구글 로그인하면 email이 동일한 user 문서가 2개 생긴다.
2. **username에 유일성 제약이 없어 라우팅/조회가 임의의 계정을 집음** — `sanity-studio/schemas/user.js`의 `username`/`email` 필드 모두 `type: 'string'`만 있고 `Rule.unique()`가 없다. 구글 OAuth는 `username: email.split('@')[0]`로 자동 생성해 충돌 검사가 아예 없다(이메일 가입 경로만 `register/route.ts`의 `checkUsernameValid`로 검사). username이 중복되면 `getUserForProfile`/`getUserByUsername`(`user.ts`)의 `username==$username][0]`이 임의의 첫 문서를 집고, `getAllUserPosts`(`posts.ts`)의 `author->username==$username`가 두 계정의 글을 한 목록에 섞는다. "내 블로그"(`Header.tsx`) 링크가 세션 username으로 이동하는데, 그 문서가 본인 게 아닐 수 있어 남의 블로그로 열릴 수 있다.

**왜 이번엔 안 고치나**: 인증/계정 연동 설계 변경(email 기준 upsert, 스키마 유일성 제약, 기존 중복 문서 데이터 마이그레이션까지 필요)이라 범위가 크고 위험도가 있다. Day 31 스코프(에디터 교체)를 벗어난다. 추후 별도 Day/트랙으로 다룰 백로그.

## Day 31 — `revalidateTag(tag, 'max')`의 무효화 시점 확인 필요 (Day 34a에서 해소)

`src/app/api/posts/[id]/route.ts` 등 mutation 라우트 전반이 `revalidateTag(tag, 'max')` 형태로 두 번째 인자(`'max'` cache-life 프로파일)를 넘긴다. Next 16.2.6에서 이 두 번째 인자는 필수(안 주면 deprecation 경고)이며, 프로파일이 지정된 경우 즉시(read-your-writes) 무효화가 아니라 stale-while-revalidate 방식일 수 있다(`node_modules/next/dist/.../revalidate.js`의 `revalidate()` 내부에서 `profile` 유무에 따라 `pathWasRevalidated` 처리가 갈림). 실제 즉시성 여부는 런타임 확인이 필요 — 이번 Day 31에서는 SWR `mutate` 추가로 클라이언트 목록 갱신은 해결되므로 급하지 않지만, 서버 Data Cache 자체의 무효화 타이밍은 추후 검증 대상.

**Day 34a에서 확정**: Next.js 공식 문서(v16.2.10) 확인 결과 `'max'`는 "약간의 지연이 허용되는 콘텐츠"용 공식 권장 기본값이며 stale-while-revalidate 방식이 맞다(버그 아님) — 다만 "다음 방문 때도 우선 stale을 보여준 뒤 백그라운드 갱신"이라 뮤테이션 직후 read-your-own-writes가 필요한 라우트엔 안 맞는 선택이었다. 문서가 명시한 즉시 무효화 방법(`revalidateTag(tag, { expire: 0 })`, Route Handler에서 `updateTag`를 못 쓰는 경우의 대안)으로 프로젝트 전체 17곳을 전환해 해결(팔로우 버튼 상태가 한 번 더 눌러야 반영되던 증상의 근본 원인이었음).

## Day 31 — 툴바 버튼 hover 툴팁, title 속성은 정상인데 브라우저에 표시가 안 됨 (백로그)

`MdEditor.tsx`의 `commandsFilter`에서 `@uiw/react-md-editor` 툴바 커맨드의 `buttonProps.title`/`aria-label`을 한국어로 번역하는 로직을 추가했다(라이브러리 커맨드가 기본 제공하는 네이티브 `title` 속성 hover 툴팁을 활용하는 방식). devtools로 확인한 결과 `<button>`의 `title` 속성엔 한국어 텍스트가 정확히 들어가 있고, 코드 자체(`commandsFilter` → `useReducer` 초기 상태 반영 경로)도 라이브러리 소스 추적 결과 문제가 없어 보인다. 그런데 Chrome에서 버튼 위에 마우스를 올려도(2초 이상 정지 포함) 네이티브 툴팁이 전혀 뜨지 않는다. Safari의 button title 미지원 이슈는 배제됨(Chrome/Edge에서 재현). 원인 미확정 — React 재렌더링으로 인한 DOM 노드 재생성이 hover 타이머를 리셋하는지, 혹은 다른 브라우저/환경 요인인지 추후 조사 필요.

**왜 이번엔 안 고치나**: 코드(title 속성 자체)는 정상 삽입되고 있고, 순수 브라우저 렌더링/타이밍 문제로 추정되나 확실한 재현 조건을 못 잡았다. Day 31 스코프를 벗어나는 탐구라 보류하고 기록만 남긴다. 필요시 CSS-only 커스텀 툴팁(예: `title` 대신 `data-tooltip` + `::after` 가상요소)으로 대체하는 방안도 고려 가능.

## Day 37 — `comment.ts`의 `any` 2곳은 typegen 쿼리 타입이 아니라 write payload였음 (설계 확인)

roadmap week5.md의 Day 37 항목은 "`src/service/comment.ts`의 `any` 2곳을 typegen 타입으로 대체"라고 적혀 있었는데, 실제로 `addNestedComment`/`addTopLevelComment`의 `commentTypeProjection: any`는 GROQ 쿼리 결과(`client.fetch`)가 아니라 `client.patch().append()`에 넘기는 **write(뮤테이션) payload**다. Sanity TypeGen은 `src/service/**/*.ts`의 GROQ 쿼리만 스캔해 결과 타입을 생성하므로, 쓰기 payload에는 애초에 대응하는 생성 타입이 없다. 대신 `loggedInUserComment`/`guestComment` 두 write shape의 명시 union 타입(`CommentWritePayload`)을 직접 선언해 `any`를 제거했다(`addComment`의 `let commentTypeProjection: CommentWritePayload`도 `else if` → `else`로 정리해 definitely-assigned 확보). typegen 도입만으로는 커버 안 되는 영역이 있다는 걸 보여주는 사례라 남겨둔다.
