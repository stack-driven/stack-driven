---
description: Implement a GitHub issue from an approved spec-driven plan
argument-hint: "[issue-number]"
---
# Implement a GitHub Issue

Use `.pi/skills/spec-authority/SKILL.md` and `.pi/skills/spec-driven-planning/SKILL.md`.

Requested issue: `$ARGUMENTS`

Workflow:

- Read the issue and the approved plan.
- Re-check `specs/manifest.yaml` and only the spec summaries or files referenced by the plan.
- If the plan conflicts with manifest authority, stop and report the mismatch.
- Implement exactly what the approved plan specifies.
- Do not add scope or bypass required spec constraints.
- Use the plan's validation evidence and success criteria as the implementation contract.
- Verify the requested checks after changes are made.
- Summarize the files changed, tests run, and any spec updates still needed.

Guardrails:

- Prefer `.ctx.md` summaries before full specs.
- Load full specs only if the plan needs deeper detail.
- Do not blanket-load `product-guidelines/`.
- Do not creatively reinterpret the approved plan.
