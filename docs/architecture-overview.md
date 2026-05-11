# Architecture Overview

Stack-Driven is organized around a small authority layer and Pi-native workflows that keep generated product context out of the model until it is needed.

## Core authority model

`specs/manifest.yaml` is the canonical registry. It defines:

- spec IDs, titles, sessions, and commands;
- required, recommended, conditional, optional, and support modes;
- required and optional dependencies;
- lifecycle and default review status;
- output paths and `.ctx.md` summary paths;
- template mappings;
- skip/defer policy;
- relevance hints for context loading.

`specs/index.md` is a human-readable companion. It helps people browse the model, but it does not override the manifest.

## Product-run state

Generated product outputs live under `product-guidelines/`, which is intentionally gitignored. Each user or product run can produce different specs.

When present, `product-guidelines/spec-status.yaml` records per-product state:

```yaml
schema_version: 1
manifest_id: stack-driven.spec-authority
specs:
  journey.user:
    status: created
    review_status: ai_drafted
    output_paths:
      - product-guidelines/00-user-journey.md
    ctx_paths:
      - product-guidelines/00-user-journey.ctx.md
  brand.strategy:
    status: skipped
    review_status: null
    skip_reason: Not needed for the internal prototype.
    revisit_when: Revisit before public launch.
    revisit_owner: Product lead
```

AI drafts are not authoritative until a human review promotes them.

## Pi cockpit

`.pi/extensions/stack-cockpit.ts` is a thin extension that:

1. Finds the repository root by locating `specs/manifest.yaml`.
2. Parses the manifest and optional product-run state.
3. Infers completed specs from configured outputs and status records.
4. Shows completed, skipped/deferred, review-needed, available, blocked, and next specs.
5. Registers Stack-Driven commands such as `/stack`, `/stack:status`, `/stack:start`, `/stack:create`, `/stack:skip`, and `/stack:plan-issue`.

The cockpit is deliberately compact. It orients the user without loading every generated spec into the conversation.

## Skills and prompts

Project-local Pi resources live under `.pi/`:

- `.pi/skills/spec-authority/`: resolves manifest authority, dependencies, skip policy, output paths, and conflict hierarchy.
- `.pi/skills/guided-spec-creation/`: guides Phase I creation, AI drafting, review markings, `.ctx.md` summaries, and skip/defer records.
- `.pi/skills/spec-driven-planning/`: turns GitHub issues into execution contracts grounded in selected specs.
- `.pi/prompts/stack-start.md`, `.pi/prompts/stack-create-spec.md`, `.pi/prompts/stack-status.md`: entry points for guided spec workflow.
- `.pi/prompts/stack-plan-issue.md`, `.pi/prompts/stack-plan-issue-checklist.md`, `.pi/prompts/stack-implement-issue.md`: Phase II planning and implementation prompts.

## Context-control strategy

Stack-Driven avoids context bloat with three rules:

1. Use the manifest to select candidate specs instead of scanning every file.
2. Prefer `.ctx.md` summaries when the manifest says `prefer_ctx: true`.
3. Load full generated specs only when summaries cannot answer the question or when creating/reviewing/updating that spec.

This is why Phase II issue planning can cite `journey.user`, `architecture.application`, or `testing.strategy` without loading the entire cascade.

## Phase I and Phase II

### Phase I: Spec creation

Phase I creates the product-specific authority set. The user journey comes first, then downstream strategy, constraints, stack, architecture, data, API, testing, application, backlog, deployment, and observability specs become available according to manifest dependencies.

### Phase II: Spec-driven delivery

Phase II uses the completed specs to plan and implement work. An issue plan should include:

- user value or journey step;
- relevant specs selected from the manifest;
- spec gaps or stale specs;
- non-goals;
- testable acceptance criteria;
- implementation outline;
- validation evidence;
- whether specs need updating before implementation.

The plan becomes an execution contract. Implementation should follow it exactly unless manifest authority or reviewed specs conflict.

## Conflict hierarchy

When sources disagree, use the manifest-defined hierarchy:

1. Human-reviewed or authoritative manifest-listed output.
2. Approved issue plan or reviewed ADR that explicitly amends a spec.
3. Implementation detail in code or command files.
4. AI-drafted generated output.
5. Templates, examples, or informal notes.

## Legacy assets

The repository still contains Claude-era assets such as `.claude/commands/`, `CLAUDE.md`, and compact `ctx/CLAUDE-*.ctx.md` files. They are transitional compatibility material. New workflows should prefer the Pi cockpit, `.pi/prompts/`, and `.pi/skills/` unless the task explicitly targets legacy Claude support.
