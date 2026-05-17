---
name: spec-driven-planning
description: Plan and implement GitHub issues by selecting only relevant Stack-Driven specs and .ctx.md summaries. Use when an issue must become an execution contract derived from manifest-authoritative specs.
---
# Spec-Driven Issue Planning

Use this skill to turn GitHub issues into execution contracts grounded in Stack-Driven specs.

## Canonical sources

1. `specs/manifest.yaml`
2. `specs/index.md`
3. `product-guidelines/spec-status.yaml` when present
4. Relevant `.ctx.md` summaries for candidate specs
5. Full `.md` specs only when a summary is insufficient
6. Approved issue plan for implementation

## Workflow

1. Read the issue title, body, labels, and comments.
2. Read `specs/manifest.yaml` first; do not scan all specs.
3. Select candidate specs from manifest dependency and relevance hints.
4. Load the matching `.ctx.md` summaries first.
5. Escalate to full spec files only when a summary cannot answer the question.
6. Record user value / journey step, relevant specs, spec gaps or stale specs, non-goals, acceptance criteria, implementation outline, validation evidence, and whether specs need updating first.
7. If a required spec is missing or stale, flag it before implementation.
8. When implementing, follow the approved plan exactly and keep the same spec shortlist.
9. Do not blanket-load `product-guidelines/` or invent missing authority.

## Planning checklist

- [ ] User value / journey step is explicit
- [ ] Relevant specs are selected from the manifest
- [ ] Spec gaps or stale specs are called out
- [ ] Non-goals are stated
- [ ] Acceptance criteria are testable
- [ ] Implementation outline is specific
- [ ] Validation evidence is defined
- [ ] Whether specs need updates first is answered

## Implementation guardrails

- Follow the approved plan exactly
- Re-check only the specs cited by the plan
- Stop if plan and manifest authority conflict
- Prefer `.ctx.md` summaries over full specs unless detail is missing
- Keep every decision traceable to the user value and authoritative specs
