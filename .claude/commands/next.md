---
description: RamBlog 30일 로드맵에서 다음 미완료 작업을 파악하고 착수한다
---

`docs/roadmap1/ROADMAP.md`와 `docs/roadmap1/week{N}.md` 전체(1~4)를 확인해 Day별 summary 표의 ✅ 표시 여부로 진행 상황을 파악한다.

1. **Day 번호 순으로 첫 번째 미완료(✅ 없는) Day**를 찾는다. 코드 Day와 블로그 발행 Day가 섞여 있을 수 있다.
2. 여러 Day가 동시에 미완료 상태로 밀려 있으면(코드 Day 우선 진행으로 블로그 Day가 건너뛰어진 경우 등), 어느 것부터 할지 AskUserQuestion으로 확인한다 — 임의로 넘겨짚지 않는다.
3. **코드 작업 Day**라면:
   - 해당 Day의 상세 표(`#1, #2...`)를 확인하고 관련 파일을 탐색
   - Plan mode로 계획을 세워 승인받는다
   - 승인 후에는 `rules/task-execution.md` `## Learn by Doing` 규칙에 따라 단계별로 진행한다 (사용자가 이 실행에 `/auto`를 함께 지시하지 않는 한, Claude가 코드를 직접 쓰지 않는다)
4. **블로그 발행 Day**라면 `/write-blog-post day {N}` 스킬 사용을 제안한다 (직접 대신 써주지 않는다 — 스킬을 통해서만 초안 생성).
5. task/step 완료 후:
   - `docs/roadmap1/week{N}.md`의 summary 표 + 해당 Day 상세 표에 ✅ 마킹
   - `rules/task-execution.md` `## 2단 ask`(코드 검토 요청 → 승인 후 다음 스텝 확인) 준수
   - Learn by Doing 중 나온 개념 질문·답변은 `docs/roadmap1/learning-notes.md`에 서브에이전트로 위임해 기록 (`## 이슈 기록` 컨벤션)

$ARGUMENTS
