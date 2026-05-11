---
description: Create or update the next/requested Stack-Driven spec through guided choices
argument-hint: "[spec-id|next] [instructions]"
---
# Create a Stack-Driven Spec

Use the project skills:

1. Read `.pi/skills/spec-authority/SKILL.md`.
2. Read `.pi/skills/guided-spec-creation/SKILL.md`.

Requested target/instructions: `$ARGUMENTS`

Workflow:

- Resolve the requested spec by `id`, command, or title. If no target is provided, select the first available spec in manifest order.
- Enforce dependency order from `specs/manifest.yaml`; never create a spec before required dependencies are satisfied, skipped, or deferred according to policy.
- If `journey.user` is missing, route to `journey.user` first even when a downstream target was requested.
- Use `templates.paths` from the manifest when present. If no template is mapped, use the command/sub-agent workflow named by the manifest and state the missing template explicitly.
- Offer the user the three per-spec choices: guided questions, skip/defer when allowed, or AI draft requiring review.
- For AI draft or guided creation, write the configured output path(s), generate/update configured `.ctx.md` summaries, and record product-run state in `product-guidelines/spec-status.yaml` with `review_status: ai_drafted` until human review promotes it.
- Do not load unrelated optional/post-core specs.
