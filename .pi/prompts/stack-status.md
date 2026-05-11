---
description: Show guided Stack-Driven spec workflow status
argument-hint: "[detail]"
---
# Stack-Driven Spec Status

Use `.pi/skills/spec-authority/SKILL.md` to read `specs/manifest.yaml` and optional `product-guidelines/spec-status.yaml`.

User request: `$ARGUMENTS`

Report concisely:

- Current root and manifest path.
- Completed specs inferred from configured outputs and product-run state.
- AI-drafted specs requiring review.
- Skipped/deferred specs with reason and revisit guidance.
- Next available specs in dependency order.
- Blocked specs and their missing required dependencies.
- Whether each next spec has mapped templates and `.ctx.md` outputs.

Do not dump the full manifest. Prefer `.ctx.md` files only when explaining already-created specs; use the manifest for dependency and loading decisions.
