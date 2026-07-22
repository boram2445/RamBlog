# Week 6: 시리즈 기능 + 위생 마무리 + 테스트·성능 트랙 (Day 41–)

> Day 41은 신규 기능(벨로그 스타일 시리즈, 설계는 `.claude/plans/cozy-waddling-neumann.md` 참조). 이어서 Week 5(Day 31–38)에서 착수 전 이월된 Day 42(삭제 stale 수정)·43(toast 알림)·44(axios→fetch 위생) + 원래 계획된 **Track C(테스트+성능 측정)** 를 진행. 이월된 3개 Day는 번호만 42/43/44로 바뀌었을 뿐 범위는 `week5.md`의 원안(Day 35/39/40)과 동일.

| D | 작업 |
|---|---|
| 41 | **시리즈 기능(벨로그 스타일)** — post→series reference 모델, 유저 페이지 Posts 탭 상단 섹션(최대 4개+전체 보기) + 시리즈 상세 페이지 + 글쓰기 폼에서 시리즈 선택/즉석 생성 |
| 41b | **시리즈 만들기 모달 + 전용 대표 이미지** — 글쓰기 폼 안에서 벨로그처럼 시리즈를 만드는 모달을 두고, 이때 이름·설명과 함께 시리즈 전용 대표 이미지를 직접 업로드. 대표 이미지를 "첫 글 파생"에서 "직접 지정"으로 전환 (Day 41 서브태스크 5·6 완료 후 착수) |
| 42 | **삭제 후 목록/상세 stale 수정(별도 태스크)** — 포스트 삭제 성공 시 목록·상세 캐시(SWR `mutate` + `revalidateTag`) 무효화로 stale 화면 제거 |
| 43 | **UX** — toast 알림 컴포넌트 신설 + `alert()` 12곳 교체 (`RegisterForm.tsx`의 "알림 컴포넌트 만들어야 함" 주석 해소) |
| 44 | **위생 마무리** — axios 11파일 → fetch 일원화 후 `axios` 의존성 제거, 미사용 `@types/nodemailer` 제거, 좋아요 `_id` 기반 전환(week4 백로그) 착수 여부 재평가 |
| 45~ | **Track C — 테스트 + 성능 측정** (상세 미정, 착수 시 이 파일에 작성) — Vitest 도입 + GROQ 파라미터 바인딩 회귀 테스트 + Playwright 핵심 플로우를 Lighthouse 등 성능 측정과 묶어 진행 |

## 검증

- 빌드/린트/타입: `pnpm build && pnpm lint && pnpm exec tsc --noEmit` 무경고 (매 Day)
- **시리즈(Day 41)**: ① 폼에서 새 시리즈 즉석 생성해 글 3개 발행 → 상단 섹션 노출·개수 표시 ② 상세 페이지에서 발행순 번호 나열 ③ Studio에서 `seriesOrder` 지정+Publish → 순서 변경 반영 ④ 소속 글 삭제 → 상세·카운트에서 제외 ⑤ 시리즈 없는 유저 페이지에 섹션 미노출 ⑥ 수정 폼에 기존 시리즈 초기값 + 해제 동작 ⑦ 없는 id/다른 유저 slug 조합 → 404
- **삭제 반영(Day 42)**: 글 삭제 즉시 목록/상세에서 사라지는지 확인(재조회·재접속 없이), SWR `mutate` + `revalidateTag` 이중 무효화 동작 확인
- **UX 단계(Day 43~44)**: `grep -rn "alert(" src` 0건(핵심 플로우), `grep -rln "axios" src` 0건
- **Track C**: 착수 시 이 섹션에 구체 검증 기준 작성

---

## Day별 상세 할일

#### Day 41 — 시리즈 기능 (벨로그 스타일)

> 설계 전문: `.claude/plans/cozy-waddling-neumann.md`. 핵심 결정 — post가 `series` reference 보유(태그와 동형 쓰기), 순서는 시간 오름차순 + nullable `seriesOrder`, 소유권은 이름+세션 userId 서버 upsert(시리즈 `_id`를 클라이언트에서 받지 않음 → IDOR 차단), `/api/series` 신설 없이 기존 `api/posts` route 확장. 하루 분량으로 도전적 — 미완 시 남은 행을 다음 Day로 이월.

| # | 할 일 | ✓ |
|---|---|---|
| 1 | **스키마** — series 문서 타입을 새로 만들고(이름 필수, 작성자 참조, 설명), post 스키마에 시리즈 참조와 순서 번호 필드를 추가한 뒤 typegen 재생성. Studio에서 시리즈 2개를 만들어 기존 포스트 서너 개를 연결하고 Publish해 이후 단계의 시드 데이터로 삼는다 | [x] |
| 2 | **서비스 계층** — 시리즈 전용 서비스 파일을 새로 만들어 유저별 시리즈 목록 쿼리(포스트 수·대표 썸네일 파생)와 시리즈 상세 쿼리(순서 번호 우선, 없으면 발행 시간순 정렬)를 작성한다. 모든 쿼리는 파라미터 바인딩. 포스트 서비스 쪽은 시리즈 이름을 함께 내려주도록 상세 projection을 넓히고, 글 생성/수정 함수가 시리즈 이름을 받아 upsert 후 연결하도록 확장. 끝나면 typegen 재실행 + 타입체크 | [ ] |
| 3 | **시리즈 상세 페이지** — 포스트 상세 페이지 패턴을 그대로 따라 새 라우트를 만든다. 없는 id거나 URL의 유저와 시리즈 작성자가 다르면 404, 소속 포스트는 순번 배지를 붙여 기존 리스트 카드로 나열 | [ ] |
| 4 | **Posts 탭 상단 섹션** — 시리즈 카드 섹션 컴포넌트를 만들어 유저 페이지 글 목록 위에 얹는다. 최대 4개까지만 보이고 초과분은 "펼치기" 버튼으로 토글(토글 버튼만 client 컴포넌트, 카드는 서버 렌더). 시리즈가 하나도 없으면 섹션 자체를 숨긴다 | [ ] |
| 5 | **글쓰기 폼** — 태그 입력 아래에 시리즈 선택 UI를 추가한다. 기존 시리즈 중에서 고르거나 새 이름을 입력하면 즉석 생성. 수정 폼에는 현재 소속 시리즈가 초기값으로 뜨고, 비워서 제출하면 해제로 처리(빈 값도 항상 전송하는 규약) | [ ] |
| 6 | **API** — 글 생성/수정 route가 폼의 시리즈 값을 받아 연결·해제를 처리하도록 확장하고, 글 생성·수정·삭제 세 곳에서 시리즈 캐시 태그를 무효화한다. 시리즈는 항상 세션 유저 명의로만 upsert되므로 타인 시리즈에 붙일 경로가 없다(설계 의도를 주석으로 남길 것) | [ ] |
| 7 | **검증** — 빌드·린트 통과 후 위 `## 검증`의 시리즈 시나리오 ①~⑦을 스모크. 미뤄둔 항목(Sanity webhook 미도입, 시리즈 upsert 동시 요청 경합)은 `week6-issues.md`에 백로그로 기록 | [ ] |
| 8 | Day 작업 중 나온 개념 질문·답변 중 중요한 내용을 서브에이전트(general-purpose)에 위임해 `learning-notes.md`에 기록 | [ ] |

**변경 파일**: `sanity-studio/schemas/series.js`(신규) · `sanity-studio/schemas/post.js` · `sanity-studio/schemas/index.ts` · `src/service/series.ts`(신규) · `src/service/posts.ts` · `src/model/post.ts` · `src/app/[user]/series/[id]/page.tsx`(신규) · `src/app/[user]/(home)/page.tsx` · `src/components/series/`(신규: SeriesSection·SeriesCard·SeriesSelect·SeriesTitle) · `src/components/post/WritePostForm.tsx` · `src/hooks/useUserPost.ts` · `src/app/write/page.tsx` · `src/app/write/[id]/page.tsx` · `src/app/api/posts/route.ts` · `src/app/api/posts/[id]/route.ts`

#### Day 41b — 시리즈 만들기 모달 + 전용 대표 이미지

> 배경: 시리즈 기능(Day 41)은 별도 관리 페이지 없이 글쓰기 폼에서 이름만으로 즉석 생성하는 설계라, 시리즈 전용 이미지를 올릴 UI가 없어 대표 썸네일을 첫 글 `mainImage`에서 파생해 왔다. 벨로그처럼 발행 흐름 안에서 시리즈를 "제대로 만드는" 모달을 두면 전용 대표 이미지를 직접 지정할 수 있다. Day 41 서브태스크 5(폼 시리즈 선택)·6(API 연결) 위에 얹히므로 그 뒤에 착수한다.

| # | 할 일 | ✓ |
|---|---|---|
| 1 | series 스키마에 대표 이미지 필드를 추가하고 typegen을 재생성한다 | [ ] |
| 2 | 글쓰기 폼의 시리즈 선택에서 "새 시리즈 만들기"를 고르면 이름·설명·대표 이미지를 입력하는 모달을 띄운다. 별도 관리 페이지 없이 발행 흐름 안에서 생성하며, 이미지는 기존 이미지 업로드 경로를 재사용한다 | [ ] |
| 3 | 시리즈 목록·상세 쿼리가 전용 대표 이미지를 우선 반환하고, 없으면 기존처럼 첫 글 이미지로 폴백하도록 넓힌다. upsert 시 이미지도 함께 저장한다 | [ ] |
| 4 | 소비 측(홈 시리즈 카드·상세 헤더)이 전용 이미지를 우선 사용하도록 반영한다 | [ ] |
| 5 | 빌드·린트·타입체크 통과 후 새 시리즈를 이미지와 함께 만들어 카드·상세 헤더에 반영되는지 스모크 | [ ] |
| 6 | Day 작업 중 나온 개념 질문·답변 중 중요한 내용을 서브에이전트(general-purpose)에 위임해 `learning-notes.md`에 기록 | [ ] |

**변경 파일**: `sanity-studio/schemas/series.js` · `src/service/series.ts` · `src/components/series/`(신규 시리즈 만들기 모달) · `src/components/series/SeriesSelect.tsx` · `src/components/series/SeriesCard.tsx` · `src/components/series/SeriesTitle.tsx` · `src/app/api/posts/route.ts` · `src/app/api/posts/[id]/route.ts`

#### Day 42 — 삭제 후 목록/상세 stale 수정 (별도 태스크)

| # | 할 일 | ✓ |
|---|---|---|
| 1 | `src/components/post/PostButtonList.tsx:25-37` 삭제 성공 후 SWR `mutate`로 목록 키 무효화 추가 (`useUserPost`의 `/api/.../posts` 키) | [ ] |
| 2 | `router.refresh()`/`router.push` 순서 및 `revalidateTag`(서버) ↔ SWR(클라) 이중 캐시 정합성 점검 | [ ] |
| 3 | 스모크: 글 삭제 즉시 목록·상세에서 사라지는지 확인 (재조회/재접속 없이) | [ ] |
| 4 | Day 작업 중 개념 질문·답변 중 중요한 내용을 서브에이전트(general-purpose)에 위임해 `learning-notes.md`에 기록 | [ ] |

**변경 파일**: `src/components/post/PostButtonList.tsx` · `src/hooks/useUserPost.ts` · service `revalidateTag` 호출부

#### Day 43 — toast 알림 도입

| # | 할 일 | ✓ |
|---|---|---|
| 1 | toast 컴포넌트/컨텍스트 신설 (라이브러리 vs 자체 구현 결정 포함) | [ ] |
| 2 | `alert()` 12곳 교체 — `WritePostForm`(2) · `PostIcons`(2) · `CommentForm`(3) · `SigninForm`(1) · `RegisterForm`(1) · `LogDetail`(1) · `ProfileForm`(2) | [ ] |
| 3 | `RegisterForm.tsx`의 `//알림 컴포넌트 만들어야 함` 주석 제거 | [ ] |
| 4 | `pnpm build` 통과 + 성공/실패 토스트 노출 스모크 | [ ] |
| 5 | Day 작업 중 나온 개념 질문·답변 중 중요한 내용을 서브에이전트(general-purpose)에 위임해 `learning-notes.md`에 기록 | [ ] |

**변경 파일**: toast 컴포넌트(신규) · `WritePostForm.tsx` · `PostIcons.tsx` · `CommentForm.tsx` · `SigninForm.tsx` · `RegisterForm.tsx` · `LogDetail.tsx` · `ProfileForm.tsx`

#### Day 44 — HTTP 클라이언트 일원화 + 의존성 위생

| # | 할 일 | ✓ |
|---|---|---|
| 1 | axios 사용 11파일(훅 3 + 컴포넌트 8)을 fetch 기반으로 전환 | [ ] |
| 2 | `axios` 의존성 제거 | [ ] |
| 3 | 미사용 `@types/nodemailer` 제거 | [ ] |
| 4 | 좋아요 `_id` 기반 전환(week4-issues.md 백로그) — 이번 주에 처리할지 이후로 보낼지 재평가·기록 | [ ] |
| 5 | `pnpm build && pnpm lint && pnpm exec tsc --noEmit` 통과 + 좋아요/북마크/댓글/팔로우 스모크 | [ ] |
| 6 | Day 작업 중 나온 개념 질문·답변 중 중요한 내용을 서브에이전트(general-purpose)에 위임해 `learning-notes.md`에 기록 | [ ] |

**변경 파일**: `src/hooks/*.ts`(훅 3) · 컴포넌트 8파일 · `package.json`

#### Day 45~ — Track C: 테스트 + 성능 측정 (상세 미정)

> 착수 시 Vitest 셋업, GROQ 파라미터 바인딩 회귀 테스트 범위, Playwright 핵심 플로우 목록, Lighthouse 비교 기준(기존 `lighthouse-comparison.md` 참고)을 이 섹션에 구체화한다.
