# Week 5: 에디터 교체 + 타입·네이밍·UX 부채 청산 (Day 31–37)

> **전제**: Week 4(Day 23~30)의 잔여 작업(블로그 6·7·8편, 이미지 성능, 접근성, error 경계, API 핸들러, CI)이 끝난 뒤 착수한다.
>
> 구 "30일 이후 선택 트랙" 중 **Track B(에디터 교체)·Track D(네이밍 정리)** 를 이 주차로 편입. **Track C(테스트)는 성능 측정과 묶어 Week 6으로 분리** (상세 week6.md는 추후 작성).

| D | 작업 | 변경 파일 |
|---|---|---|
| 31 | **에디터 교체 1** — `@uiw/react-md-editor` 설치, `TuiEditors.tsx` → `MdEditor.tsx` 재작성 (value/onChange 제어, 이미지 업로드 drop/paste → `POST /api/image`, 다크모드 `data-color-mode` 연동), `WritePostForm.tsx` ref 로직 단순화 | `src/components/post/MdEditor.tsx` (신규), `WritePostForm.tsx`, `package.json` |
| 32 | **에디터 교체 2** — `@toast-ui/*` 4패키지 제거, `pnpm-workspace.yaml`의 `tui-color-picker` override/patch/publicHoistPattern 제거, `patches/tui-color-picker@2.2.8.patch`·`tuiEditor.css`·`TuiEditors.tsx` 삭제, 글쓰기/수정 스모크 | `package.json`, `pnpm-workspace.yaml`, `patches/`, `src/components/post/` |
| 33 | **typegen 채택 1** — `src/service/posts.ts` 반환 타입을 typegen 타입(`src/sanity/types.ts`)으로 전환, `as unknown as` 캐스트 2곳 제거 | `src/service/posts.ts`, `src/model/post.ts` 사용처 일부 |
| 34 | **typegen 채택 2** — `src/service/user.ts` 캐스트 3곳 + 나머지 service 전환, `src/model/*.ts` 사용처 점진 대체 (컴포넌트 파급 범위 확인하며 진행) | `src/service/user.ts` 외 service 전체, `src/model/*.ts` |
| 35 | **네이밍 정리(Track D)** — `Avartar` → `Avatar` 11파일 `git mv` + import 일괄 수정, `components/post` ↔ `components/posts` 폴더 통합 | `src/components/ui/Avartar.tsx` 외 10파일, `src/components/post*/` |
| 36 | **UX** — toast 알림 컴포넌트 신설 + `alert()` 12곳 교체 (`RegisterForm.tsx`의 "알림 컴포넌트 만들어야 함" 주석 해소) | toast 컴포넌트 (신규), `WritePostForm.tsx`·`PostIcons.tsx`·`CommentForm.tsx`·`SigninForm.tsx`·`RegisterForm.tsx`·`LogDetail.tsx`·`ProfileForm.tsx` |
| 37 | **위생 마무리** — axios 11파일 → fetch 일원화 후 `axios` 의존성 제거, 미사용 `@types/nodemailer` 제거, 좋아요 `_id` 기반 전환(week4 백로그) 착수 여부 재평가 | `src/hooks/*.ts`, 컴포넌트 8파일, `package.json` |

## 검증

- 빌드/린트/타입: `pnpm build && pnpm lint && pnpm exec tsc --noEmit` 무경고 (매 Day)
- **에디터 단계(Day 31~32)**: 글쓰기/수정 페이지에서 마크다운 작성·이미지 업로드·다크모드 전환 스모크. 기존 포스트가 새 에디터에서 깨짐 없이 로드되는지 확인. Day 32 후 `pnpm install` 클린 상태에서 빌드 재확인
- **typegen 단계(Day 33~34)**: `pnpm typegen` 재생성 후 타입 에러 0. `as unknown as` 검색 결과 0건
- **네이밍 단계(Day 35)**: `grep -rn "Avartar" src` 0건, import 깨짐 없이 빌드 통과
- **UX 단계(Day 36~37)**: `grep -rn "alert(" src` 0건(핵심 플로우), `grep -rln "axios" src` 0건

---

## Day별 상세 할일

#### Day 31 — 에디터 교체 1 (@uiw/react-md-editor 도입)

| # | 할 일 | ✓ |
|---|---|---|
| 1 | `pnpm add @uiw/react-md-editor` 설치 | [ ] |
| 2 | `src/components/post/MdEditor.tsx` 신규 작성 — value/onChange 제어 컴포넌트, `next/dynamic({ ssr: false })` 로드 | [ ] |
| 3 | 이미지 업로드: drop/paste 핸들러에서 `POST /api/image` 호출 후 마크다운 이미지 문법 삽입 (기존 `addImageBlobHook` 대체) | [ ] |
| 4 | 다크모드: `next-themes` theme → `data-color-mode` 속성 연동 | [ ] |
| 5 | `WritePostForm.tsx`를 ref(`getInstance().getMarkdown()`) 대신 state 기반으로 단순화 | [ ] |
| 6 | `pnpm build` 통과 + 글쓰기/수정 스모크 (새 글 작성, 기존 글 로드) | [ ] |

#### Day 32 — 에디터 교체 2 (TUI 의존성 청산)

| # | 할 일 | ✓ |
|---|---|---|
| 1 | `TuiEditors.tsx`, `tuiEditor.css` 삭제 | [ ] |
| 2 | `package.json`에서 `@toast-ui/editor`, `@toast-ui/react-editor`, `@toast-ui/editor-plugin-*` 2종 제거 (`prismjs`는 다른 사용처 확인 후 판단) | [ ] |
| 3 | `pnpm-workspace.yaml`에서 `tui-color-picker` override·patchedDependencies·publicHoistPattern 제거, `patches/tui-color-picker@2.2.8.patch` 삭제 | [ ] |
| 4 | `pnpm install` 후 lockfile 정리 확인 | [ ] |
| 5 | `pnpm build && pnpm lint && pnpm exec tsc --noEmit` 통과 + 글쓰기/수정/상세 스모크 | [ ] |

#### Day 33 — typegen 채택 1 (posts service)

| # | 할 일 | ✓ |
|---|---|---|
| 1 | `src/sanity/types.ts`의 쿼리 결과 타입과 `src/model/post.ts` 수동 타입 간 차이 목록화 | [ ] |
| 2 | `src/service/posts.ts:86` `as unknown as SimplePost[]` 제거 — typegen 타입 기반으로 전환 | [ ] |
| 3 | `src/service/posts.ts:168` `as unknown as PostData` 제거 | [ ] |
| 4 | 파급된 컴포넌트/훅 타입 정리 (`SimplePost`/`PostData` 사용처) | [ ] |
| 5 | `pnpm typegen && pnpm exec tsc --noEmit` 통과 | [ ] |

#### Day 34 — typegen 채택 2 (나머지 service + model 정리)

| # | 할 일 | ✓ |
|---|---|---|
| 1 | `src/service/user.ts:121,153,183` `as unknown as` 3곳 제거 | [ ] |
| 2 | `src/service/comment.ts`의 `any` 2곳(`:65`, `:78`) typegen 타입으로 대체 | [ ] |
| 3 | 사용처가 사라진 `src/model/*.ts` 타입 삭제 (전부 대체 안 되면 남는 것 목록화해 이슈 기록) | [ ] |
| 4 | `pnpm typegen && pnpm build && pnpm exec tsc --noEmit` 통과 | [ ] |

#### Day 35 — 네이밍 정리 (Track D)

| # | 할 일 | ✓ |
|---|---|---|
| 1 | `git mv src/components/ui/Avartar.tsx src/components/ui/Avatar.tsx` + 컴포넌트/타입명 리네이밍 | [ ] |
| 2 | `UserAvartar.tsx` → `UserAvatar.tsx` 동일 처리 | [ ] |
| 3 | import하는 나머지 9파일 일괄 수정 (`grep -rn "Avartar" src` 0건 확인) | [ ] |
| 4 | `components/post` ↔ `components/posts` 폴더 역할 정리·통합 (도메인 기준 재배치) | [ ] |
| 5 | `pnpm build && pnpm lint` 통과 | [ ] |

#### Day 36 — toast 알림 도입

| # | 할 일 | ✓ |
|---|---|---|
| 1 | toast 컴포넌트/컨텍스트 신설 (라이브러리 vs 자체 구현 결정 포함) | [ ] |
| 2 | `alert()` 12곳 교체 — `WritePostForm`(2) · `PostIcons`(2) · `CommentForm`(3) · `SigninForm`(1) · `RegisterForm`(1) · `LogDetail`(1) · `ProfileForm`(2) | [ ] |
| 3 | `RegisterForm.tsx`의 `//알림 컴포넌트 만들어야 함` 주석 제거 | [ ] |
| 4 | `pnpm build` 통과 + 성공/실패 토스트 노출 스모크 | [ ] |

#### Day 37 — HTTP 클라이언트 일원화 + 의존성 위생

| # | 할 일 | ✓ |
|---|---|---|
| 1 | axios 사용 11파일(훅 3 + 컴포넌트 8)을 fetch 기반으로 전환 | [ ] |
| 2 | `axios` 의존성 제거 | [ ] |
| 3 | 미사용 `@types/nodemailer` 제거 | [ ] |
| 4 | 좋아요 `_id` 기반 전환(week4-issues.md 백로그) — Week 5에서 처리할지 Week 6 이후로 보낼지 재평가·기록 | [ ] |
| 5 | `pnpm build && pnpm lint && pnpm exec tsc --noEmit` 통과 + 좋아요/북마크/댓글/팔로우 스모크 | [ ] |
