# Spec Workflow Terminal Demo

This demo is illustrative. It shows the public Stack-Driven workflow with excerpts; it does not pretend that this repository contains a real generated `product-guidelines/` set.

## 1. Open Pi in the repository

```bash
cd stack-driven
pi
```

Cockpit output:

```text
Stack-Driven cockpit
Phase: Session 1: User Journey
Completed specs: 0/24
Skipped/deferred: 0 (none)
Skipped details: none
Review needed: 0 (none)
Next available: journey.user - Session 1: User Journey (/refine-journey)
Blocked specs: 23 (strategy.product, constraints.operational, stack.tech, +20 more)
Product status: not created (product-guidelines/spec-status.yaml)
Suggested action: /stack-create-spec journey.user
```

## 2. Phase I: create the first spec

```text
/stack:create journey.user
```

The agent uses `spec-authority` and `guided-spec-creation` to resolve the manifest entry:

```yaml
id: journey.user
title: User Journey
outputs:
  paths:
    - product-guidelines/00-user-journey.md
  ctx_paths:
    - product-guidelines/00-user-journey.ctx.md
```

Example generated summary shape:

```markdown
# User Journey Context

Primary user: Operations lead coordinating vendor onboarding.
Core value: Reduce onboarding cycle time without losing audit evidence.
Critical journey step: Upload vendor details, validate requirements, approve or request changes.
Success signal: Vendor approved with complete evidence packet.
Review status: ai_drafted; human review required before authoritative use.
```

Example status entry:

```yaml
specs:
  journey.user:
    status: created
    review_status: ai_drafted
    output_paths:
      - product-guidelines/00-user-journey.md
    ctx_paths:
      - product-guidelines/00-user-journey.ctx.md
```

## 3. Skip or defer a non-required spec

```text
/stack:skip brand.strategy Internal prototype; no public brand work yet
```

The command routes the agent to the guided skip/defer workflow. The agent checks `skip_policy.allowed` in `specs/manifest.yaml`; if allowed, it records a reason and revisit guidance:

```yaml
specs:
  brand.strategy:
    status: skipped
    review_status: null
    skip_reason: Internal prototype; no public brand work yet.
    revisit_when: Revisit before external launch or customer-facing design work.
    revisit_owner: Product lead
```

Skipped specs remain visible in the cockpit so the decision is not forgotten.

## 4. Phase II: plan an issue from relevant specs

```text
/stack:plan-issue 222
# or
/stack-plan-issue 222
```

The planner should not load every generated file. It should:

1. Read the GitHub issue title, body, labels, and comments.
2. Read `specs/manifest.yaml` first.
3. Select candidate specs from manifest relevance and dependencies.
4. Prefer `.ctx.md` summaries for selected specs.
5. Escalate to full specs only when needed.
6. Produce an execution contract.

Example plan excerpt:

```markdown
## User value / journey step
First-time Pi users understand the framework and can start the cockpit workflow in under five minutes.

## Relevant specs
- journey.user: value and primary journey traceability
- architecture.application: implementation planning and code organization
- testing.strategy: validation evidence
- delivery.github_issues: issue publication and planning metadata

## Non-goals
- No unsupported marketing claims.
- No giant README that recreates context bloat.
- No hiding the need for human spec review.

## Validation evidence
- README first screen communicates Pi-native, spec-driven, context-aware cockpit.
- Quickstart reaches cockpit/status/spec creation.
- Demo shows create, skip/defer, and issue-planning flow.
```

## 5. Move to implementation

Implementation should follow the approved issue plan. If the plan and manifest authority conflict, stop and resolve the conflict instead of improvising.

Legacy Claude-era commands may still exist for compatibility, but new demos should use the Pi cockpit and Stack-Driven skills as the preferred path.
