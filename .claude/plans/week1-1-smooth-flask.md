# CLAUDE.md에 30-day-plan 완료 표기 규칙 한 줄 추가

## Context

`.claude/docs/30-day-plan.md`의 Day별 작업 표에는 0편처럼 이미 완료된 항목에 ✅ 이모지가 붙어 있다. Day 1 작업이 끝났으니 앞으로도 같은 규칙으로 완료 항목을 표시하고 싶음. 이 규칙을 `CLAUDE.md`에 한 줄로 명시해서 향후 작업에서 빠뜨리지 않도록 함.

## 변경

`.claude/CLAUDE.md` 끝부분에 새 섹션 한 줄 추가 (방금 추가된 "Git 규칙" 섹션 아래):

```md
### 30-day-plan 진행 표기

- `.claude/docs/30-day-plan.md`의 Day 작업을 완료하면 해당 행 앞에 ✅ 이모지 추가
```

## 변경 파일

- `.claude/CLAUDE.md` (Edit 1회)

## 검증

- `cat .claude/CLAUDE.md | tail -10` 으로 새 섹션이 들어갔는지 확인
