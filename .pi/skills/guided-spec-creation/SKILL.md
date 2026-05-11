---
name: guided-spec-creation
description: Guide users through Stack-Driven spec creation from Pi. Use for /stack-start, /stack-create-spec, /stack-status, per-spec guided questions, skip/defer decisions, AI drafting with review required, and .ctx.md summary generation.
---
# Guided Spec Creation

Use this skill to run Phase I as a user-input-driven workflow instead of a one-click automated cascade.

Before acting, read `../spec-authority/SKILL.md` and apply its authority, dependency, skip, review, template, and context-loading rules.

## Inputs

The user may provide:

- a product idea or rough context
- a target spec ID, command, or title
- a request to create the next spec
- a request to skip/defer a spec
- a request to AI-draft a spec
- a request to review/promote an AI-drafted spec

Treat text after a `/skill:guided-spec-creation` invocation as input to this workflow, not as a separate command.

## Core workflow

1. Load `specs/manifest.yaml` via the spec-authority rules.
2. Read `product-guidelines/spec-status.yaml` when present.
3. Infer existing outputs from manifest `outputs.paths`.
4. If `journey.user` is missing and not recorded as created/reviewed, route to `journey.user` first.
5. Determine available specs in manifest dependency order.
6. Present only the next useful choice set, not the full cascade.
7. For each available spec, offer:
   - **Answer guided questions** (recommended): interview the user and then draft.
   - **Skip/defer**: allowed only when the manifest skip policy permits it; record reason and revisit path.
   - **Let AI draft**: produce a best-effort draft but mark it `ai_drafted` and requiring review.
8. Create/update the full `.md` output.
9. Generate/update configured `.ctx.md` summaries.
10. Update `product-guidelines/spec-status.yaml`.
11. Show the next available specs and any review-needed specs.

## Guided-question mode

Use guided questions when the user can supply product-specific context.

- Ask only the questions needed for the target spec and its dependencies.
- Prefer concise batches of questions.
- Tie every decision to user value and the user journey.
- For downstream specs, load only required dependency context plus relevant optional context.
- Do not ask the user to answer a downstream spec before required dependencies are satisfied.

## AI-draft mode

AI drafting is a fast path, not a trust shortcut.

When the user chooses AI draft:

- Use only manifest-approved dependencies and mapped templates.
- State assumptions inline in the generated spec.
- Set/record `review_status: ai_drafted`.
- Add the spec to `product-guidelines/spec-status.yaml` with `status: created`.
- Tell the user review is required before treating the spec as human-reviewed or authoritative.

## Skip/defer mode

When the user asks to skip or defer:

1. Resolve the target spec from the manifest.
2. Verify `skip_policy.allowed: true`.
3. Refuse to skip required specs when policy disallows it.
4. Record:
   - `status: skipped` or `status: deferred`
   - `skip_reason`
   - `revisit_when`
   - `revisit_owner`
   - `updated_at`
5. Keep the spec visible in status/cockpit.

## Spec creation requirements

For every created spec:

- Use manifest `templates.paths` when mapped.
- Use manifest `outputs.paths` and `outputs.ctx_paths` for file locations.
- Include enough metadata in the generated spec for future agents to identify:
  - `spec_id`
  - `source_manifest`
  - `review_status`
  - generated/update date
  - related `.ctx.md` path when configured
- Generate/update `.ctx.md` summaries for Phase II loading when configured.
- Update `product-guidelines/spec-status.yaml` after writing outputs.

## Status requirements

A status response must show:

- completed specs
- skipped/deferred specs with reason and revisit guidance
- AI-drafted specs requiring review
- next available specs in dependency order
- blocked specs with missing dependencies
- whether mapped templates and `.ctx.md` outputs exist for the next spec

Keep status concise. Do not dump the full manifest unless explicitly requested.

## Non-goals

- Do not run a one-click full cascade.
- Do not require every user to create every optional spec.
- Do not mutate `specs/manifest.yaml` with product-specific lifecycle decisions.
- Do not load unrelated specs just because they exist.
