---
description: 로컬(.next)과 Vercel의 Data/CDN 캐시를 제거해 stale 데이터를 해소
---

로컬과 Vercel의 캐시를 제거한다. Sanity Studio에서 직접 편집한 내용이 사이트에 반영 안 될 때 사용.

**인자**: `$ARGUMENTS` — `local` | `vercel` | 비어있으면 둘 다.

## 절차

### 로컬 (`local` 또는 인자 없음)

1. `rm -rf .next` 실행 — Next.js Data Cache는 `.next/cache/fetch-cache`에 파일로 저장되므로 dev 서버 재시작만으로는 사라지지 않는다.
2. 실행 후 사용자에게 안내: **dev 서버가 돌고 있었다면 재시작 필요** (`pnpm dev`). Claude가 띄운 서버가 아니면 직접 재시작을 요청한다.

### Vercel (`vercel` 또는 인자 없음)

프로젝트는 `.vercel/project.json`으로 이미 연결되어 있다 (`ram-blog-jul5`).

```bash
vercel cache purge --type data --yes
vercel cache purge --type cdn --yes
```

- Data Cache: `client.fetch`의 `force-cache` 결과 (Sanity 응답) — stale의 주범
- CDN: Full Route Cache로 페이지 자체가 남아있을 수 있어 함께 제거

### 마무리

- 두 명령의 성공 출력(`Successfully purged ...`)을 확인하고 결과를 한 줄로 보고
- 실패 시(로그인 만료 등) `vercel whoami`로 인증 상태를 확인하고 사용자에게 `vercel login` 안내

## 배경

읽기 서비스가 전부 태그 기반 `force-cache`인데, `revalidateTag`는 앱 API mutation에서만 호출된다. Sanity Studio 직접 편집은 어떤 revalidate도 트리거하지 않아 환경별 캐시가 stale해진다 (근본 해결은 Sanity 웹훅 → `/api/revalidate`, 백로그).
