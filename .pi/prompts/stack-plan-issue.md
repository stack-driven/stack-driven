---
description: Plan a GitHub issue using manifest-first spec selection
argument-hint: "[issue-number]"
---
# Plan a GitHub Issue

Use `.pi/skills/spec-authority/SKILL.md` and `.pi/skills/spec-driven-planning/SKILL.md`.

Requested issue: `$ARGUMENTS`

Workflow:

- Read `specs/manifest.yaml` first.
- Read `product-guidelines/spec-status.yaml` when present.
- Use `.pi/prompts/stack-plan-issue-checklist.md` to select relevant specs.
- Load `.ctx.md` summaries for candidate specs first.
- Load full `.md` specs only if the summaries are insufficient.
- Identify:
  - user value / journey step
  - relevant specs
  - spec gaps or stale specs
  - non-goals
  - acceptance criteria
  - implementation outline
  - validation evidence
  - whether specs need updating first
- If the issue needs spec updates before implementation, say so explicitly.
- Keep the plan traceable to user value and authoritative specs.
- Do not blanket load `product-guidelines/`.

Output:

- A concise issue-ready plan
- A clear next action: revise specs first or proceed to implementation
