---
description: Start or resume the guided Stack-Driven spec workflow
argument-hint: "[product idea or instructions]"
---
# Start Stack-Driven Guided Spec Workflow

Use the project skills:

1. Read `.pi/skills/spec-authority/SKILL.md`.
2. Read `.pi/skills/guided-spec-creation/SKILL.md`.

User input: `$ARGUMENTS`

Workflow:

- Treat `specs/manifest.yaml` as the canonical spec registry.
- Treat `product-guidelines/spec-status.yaml` as product-run state when it exists.
- If `product-guidelines/00-user-journey.md` does not exist and `journey.user` is not recorded as created/reviewed, start with `journey.user`; do not offer downstream specs first.
- If the user journey exists, show concise status and offer the next available specs in dependency order.
- For each available spec, offer the user these choices:
  1. Answer guided questions (recommended).
  2. Skip/defer when the manifest allows it, recording reason and revisit path.
  3. Let AI draft, marking the result `ai_drafted` and requiring review.
- Load only required dependencies and relevant optional specs according to the manifest.
- When creating a spec, write the configured `.md` output and update any configured `.ctx.md` summary.
