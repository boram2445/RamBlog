# Lighthouse 비교 — main(리팩토링 전) vs refactor/migration(Day 24까지)

## 측정 방법

- **프로덕션 빌드 기준**: `next build && next start` (dev 서버는 최적화가 꺼져 있어 비교 무의미).
- **main**: `git worktree`로 별도 체크아웃(현재 브랜치 작업 트리에 영향 없음) → `.env.local` 복사 → `npm install --legacy-peer-deps`(main은 `yarn.lock` 기반 Next 13.5.3/React 18.2.0이라 pnpm 대신 npm 사용) → `PORT=3001 npm run start`.
- **현재 브랜치(refactor/migration)**: `pnpm build` → `PORT=3000 pnpm start`.
- **Lighthouse**: `npx lighthouse <url> --output=json --only-categories=performance,accessibility,best-practices,seo --chrome-flags="--headless --no-sandbox"`. Mobile 프리셋(기본값).
- **격리 측정**: 두 서버를 동시에 띄운 채 측정했더니 리소스 경쟁으로 Performance 점수가 실행마다 뒤집히는 걸 확인(홈 재측정 시 main/current 우열이 바뀜) → **한 번에 서버 하나만 띄운 상태**로 재측정해 아래 표에 반영.
- **실데이터**: `username=boram2445`, `postId=Trit8qk7vTChvkiNSMkscy`, `tag=BlogProject` (현재 브랜치 홈 렌더 HTML에서 추출, main도 라우트 구조 동일해 같은 값 사용).
- **⚠️ Performance 점수 유의사항**: 단일 실행 기준이라 노이즈가 크다. 같은 페이지를 격리 상태로 재실행해도 ±5~15점 변동을 직접 관측했음(예: `userhome` current 81→93→82). **방향성 참고용으로만 사용**. 반면 Accessibility/Best Practices/SEO는 타이밍이 아닌 정적 감사라 재실행해도 값이 안정적.

## 점수 비교

| 페이지 | 브랜치 | Performance | Accessibility | Best Practices | SEO |
|---|---|---|---|---|---|
| `/` (홈) | main | 77 | 96 | 100 | 92 |
| | current | 76 | 92 | 96 | **100** |
| `/[user]` (유저 홈) | main | 82 | 87 | 100 | 92 |
| | current | 82 | 87 | 96 | **100** |
| `/[user]/posts/[id]` (포스트 상세) | main | 74 | 92 | 100 | 92 |
| | current | 59 | 92 | 96 | 92 |
| `/tags/[keyword]` (태그) | main | 81 | 96 | 100 | 92 |
| | current | 75 | 92 | 96 | **100** |
| `/search` (검색) | main | 90 | 96 | 100 | 92 |
| | current | 87 | 96 | 96 | **100** |
| `/auth/signin` (로그인) | main | 91 | 92 | 100 | 92 |
| | current | **N/A** (아래 이슈 참고) | | | |

## Core Web Vitals (주요 지표)

| 페이지 | 브랜치 | LCP | FCP | Speed Index | TBT |
|---|---|---|---|---|---|
| 홈 | main | 5.9s | 2.0s | 2.0s | 0ms |
| | current | 5.1s | 2.9s | 2.9s | 10ms |
| 유저 홈 | main | 4.3s | 2.4s | 2.4s | 0ms |
| | current | 3.0s | 1.7s | 1.7s | 10ms |
| 포스트 상세 | main | 4.1s | 2.6s | 2.6s | 390ms |
| | current | 5.9s | 3.0s | 4.6s | 450ms |
| 태그 | main | 4.8s | 2.0s | 2.0s | 0ms |
| | current | 6.8s | 2.1s | 2.1s | 10ms |
| 검색 | main | 3.4s | 2.0s | 2.0s | 0ms |
| | current | 3.8s | 2.1s | 2.1s | 0ms |

## 관찰 사항

- **SEO 92→100 (홈/유저홈/태그/검색)**: Day 9~11 메타데이터·JSON-LD·sitemap 작업이 그대로 반영됨. 유일하게 포스트 상세만 양쪽 다 92인데, `meta-description` 감사 실패 — 이 특정 포스트(`Trit8qk7vTChvkiNSMkscy`)의 Sanity `description` 필드가 비어 있어서로, **콘텐츠 데이터 문제지 코드 문제 아님** (main에도 동일하게 92).
- **Accessibility 96→92 (홈/태그)**: 신규 `target-size` 위반(TagList 태그 pill 버튼이 터치 타겟보다 작음, Day 25 범위 밖) + 기존부터 있던 `link-name`(헤더 로고 `<a>` 이름 없음, main에도 존재) 조합. Day 25(`PostUserProfile`, 폼 5개 라벨) 작업은 이 카테고리를 더 개선하는 방향.
- **Best Practices 100→96**: `errors-in-console` — NextAuth `server configuration` 에러 + `/api/auth/session` 500. 아래 이슈 참고.
- **포스트 상세 Performance 저하 (74→59, 재측정 63→59)**: `total-byte-weight` 782KiB→842KiB, TBT 390ms→450ms로 소폭 증가. 방향은 일관되게 current가 느림 — 원인 미조사(TUI Editor 관련 청크이거나 React 19/Next 16 런타임 차이로 추정). 백로그로 기록.
- **유저 홈/검색은 대체로 비슷하거나 소폭 개선**, 홈/태그의 LCP 상승은 이 문서의 Performance 노이즈 경고에 해당하는 범위로 보임(위 유의사항 참고).

## 알려진 이슈 (백로그, `week4-issues.md`에도 기록)

1. **`/auth/signin`이 세션 없이도 홈으로 307 리다이렉트됨** (current branch만 재현, main은 정상 200) — `src/app/auth/signin/page.tsx`의 `if (session) redirect('/')`에서 쿠키 없는 요청인데도 `auth()`가 truthy를 반환하는 것으로 추정. Lighthouse로 이 페이지를 측정할 수 없어 N/A 처리.
2. **TagList 태그 pill 버튼 터치 타겟 부족** (`target-size` 위반) — Day 25 범위 밖, 별도 개선 필요.
3. **포스트 상세 페이지 바이트웨이트/TBT 소폭 증가** — 원인 미조사, 추후 성능 트랙에서 확인 필요.
