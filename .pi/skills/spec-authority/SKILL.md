---
name: spec-authority
description: Resolve Stack-Driven specs from specs/manifest.yaml, including dependencies, template mappings, output paths, review status, skip policy, and relevance-based context loading. Use before creating, skipping, reviewing, or loading Stack-Driven product specs.
---
# Stack-Driven Spec Authority

Use this skill whenever a task needs to create, skip, review, load, or reason about Stack-Driven specs.

## Canonical sources

1. `specs/manifest.yaml` is the canonical machine-readable registry for:
   - spec IDs, titles, sessions, and commands
   - required/optional dependencies
   - required/recommended/conditional/optional/support mode
   - lifecycle and default review status
   - output paths and `.ctx.md` paths
   - template mappings under `templates.paths`
   - relevance/loading hints and skip policy
2. `specs/index.md` is a human-readable companion only.
3. `product-guidelines/spec-status.yaml` is product-run state. It records what happened for a specific product; it must not redefine framework-level manifest metadata.
4. `product-guidelines/*.md` outputs are the human-readable generated specs.
5. `product-guidelines/*.ctx.md` files are loading optimizations, not independent authority.

## Product-run state schema

When a guided workflow creates, reviews, skips, or defers a spec, update `product-guidelines/spec-status.yaml`:

```yaml
schema_version: 1
manifest_id: stack-driven.spec-authority
last_updated: "YYYY-MM-DD"
specs:
  journey.user:
    status: created
    review_status: ai_drafted
    output_paths:
      - product-guidelines/00-user-journey.md
    ctx_paths:
      - product-guidelines/00-user-journey.ctx.md
  constraints.operational:
    status: skipped
    review_status: null
    skip_reason: "Why this is skipped now"
    revisit_when: "When to revisit"
    revisit_owner: "Role or owner"
```

Allowed product-run `status` values:

- `created`: output exists but human review is still pending.
- `reviewed`: human has accepted the output.
- `authoritative`: reviewed output controls conflicts.
- `skipped`: intentionally omitted with policy-compliant reason.
- `deferred`: delayed with policy-compliant revisit guidance.

Allowed `review_status` values match the manifest: `ai_drafted`, `human_reviewed`, `authoritative`, or `null` for skipped/deferred specs.

## Dependency resolution

1. Load `specs/manifest.yaml` first.
2. Determine satisfied specs from:
   - existing configured `outputs.paths`
   - product-run state with `status: created`, `reviewed`, or `authoritative`
   - policy-compliant `skipped` or `deferred` records when the manifest allows skipping
3. `journey.user` is the root dependency and must be first for a new product.
4. A spec is available when all `dependencies.required` are satisfied.
5. Preserve manifest order when multiple specs are available.
6. Optional dependencies may be loaded only when present and relevant to the requested task.
7. Conditional specs require the manifest `condition` to be true or an explicit user decision to create/defer them.
8. Required specs cannot be skipped.

## Template and output resolution

For a target spec:

1. Use `templates.paths` from the manifest. Do not guess template filenames.
2. If `templates.paths` is empty or missing, use the manifest `command`/sub-agent workflow and state that no direct template is mapped.
3. Write all configured `outputs.paths` that apply to the created artifact.
4. If `outputs.ctx_paths` is configured, generate or update the corresponding `.ctx.md` summary after the full `.md` output.
5. Generated outputs default to `review_status: ai_drafted` unless a human explicitly promotes them.

## Context loading rules

- Load the smallest useful spec set.
- Always include required dependencies transitively back to `journey.user` for product-facing work.
- Prefer `.ctx.md` when it exists and the manifest says `prefer_ctx: true`.
- Read the full `.md` when creating, reviewing, resolving conflicts, or updating a spec.
- Do not load unrelated optional/post-core specs.

## Conflict hierarchy

When sources disagree, use this order:

1. Human-reviewed or authoritative manifest-listed output.
2. Approved issue plan or reviewed ADR that explicitly amends a spec.
3. Implementation detail in code or command files.
4. AI-drafted generated output.
5. Templates, examples, or informal notes.

A stale implementation detail is a migration or bug signal; it does not silently override reviewed spec authority.

## Skip/defer rules

- Check `skip_policy.allowed` before recording a skip/defer.
- Required specs with `skip_policy.allowed: false` must not be skipped.
- Record `skip_reason`, `revisit_when`, and `revisit_owner` when skipping or deferring.
- Keep skipped/deferred specs visible in status/cockpit.
- A policy-compliant skip/defer may satisfy dependency ordering for downstream specs, but the revisit risk must remain visible.
