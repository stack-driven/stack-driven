# Stack-Driven

Stack-Driven is a Pi-native framework for turning user journeys into implementation-ready product and technical specs, then using those specs to plan work without flooding the agent context window.

First screen promise:

- **Pi-native**: project-local Pi extension, prompts, and skills live under `.pi/`.
- **Spec-driven**: `specs/manifest.yaml` is the authority for spec order, dependencies, outputs, review status, and skip/defer rules.
- **Context-aware**: generated `.ctx.md` summaries are loaded before full specs, and only when relevant.
- **Interactive cockpit**: opening Pi shows current spec state, next actions, blocked specs, skipped specs, and review needs.

Stack-Driven is not an autopilot. It helps an agent ask better questions, draft better specs, and plan implementation from the right evidence. Human review still decides what becomes authoritative.

## Five-minute tour

1. **Start with the journey.** Define the user, problem, value, and success signals.
2. **Create specs in dependency order.** The manifest determines what can be created next.
3. **Review or skip intentionally.** AI drafts are marked for review; optional specs can be skipped or deferred with revisit guidance.
4. **Use the cockpit.** Pi displays status without loading every product document.
5. **Plan implementation from selected specs.** Phase II issue planning loads the relevant spec summaries instead of the whole cascade.

```text
Stack-Driven cockpit
Phase: Session 1: User Journey
Completed specs: 0/24
Skipped/deferred: 0 (none)
Review needed: 0 (none)
Next available: journey.user - Session 1: User Journey (/refine-journey)
Suggested action: /stack-create-spec journey.user
```

## Quickstart for Pi users

```bash
git clone https://github.com/stack-driven/stack-driven.git
cd stack-driven
pi
```

With a Pi version/configuration that supports project-local extensions, opening this repository loads `.pi/extensions/stack-cockpit.ts`; it reads `specs/manifest.yaml` and shows the cockpit. The commands below route agent workflows rather than bypassing review or skip policy:

```text
/stack:start                         # start or resume guided spec creation
/stack:create journey.user           # create a specific available spec
/stack:skip <spec-id> <reason>       # record a policy-checked skip/defer decision
/stack:status                        # refresh status
/stack:plan-issue 222                # cockpit route for spec-driven issue planning
/stack-plan-issue 222                 # prompt template for a full issue plan
/stack-implement-issue 222            # implement from an approved spec-driven plan
```

See [`docs/pi-quickstart.md`](docs/pi-quickstart.md) for setup details and [`examples/spec-workflow-demo.md`](examples/spec-workflow-demo.md) for a terminal demo with manifest and generated-spec excerpts.

## Phase I vs Phase II

| Phase | Purpose | Primary files |
| --- | --- | --- |
| **Phase I: Spec creation** | Create, review, skip, or defer product specs from the user journey outward. | `specs/manifest.yaml`, `.pi/prompts/stack-*.md`, `.pi/skills/guided-spec-creation/`, `product-guidelines/` |
| **Phase II: Spec-driven delivery** | Turn issues into execution contracts using only relevant specs and `.ctx.md` summaries. | `.pi/prompts/stack-plan-issue.md`, `.pi/prompts/stack-implement-issue.md`, `.pi/skills/spec-driven-planning/`, GitHub issues, implementation plans |

## Architecture at a glance

```text
specs/manifest.yaml
  -> defines spec authority, dependencies, outputs, ctx paths, skip policy
.pi/extensions/stack-cockpit.ts
  -> renders current state and routes Pi commands
.pi/skills/*
  -> enforce spec authority, guided creation, and issue planning workflows
product-guidelines/
  -> user-generated outputs; gitignored; may include compact .ctx.md summaries
```

Read [`docs/architecture-overview.md`](docs/architecture-overview.md) for the full authority and context-control model.

## What is in this repository?

- `specs/manifest.yaml` and `specs/index.md`: canonical Stack-Driven spec registry.
- `.pi/extensions/stack-cockpit.ts`: Pi cockpit and Stack-Driven commands.
- `.pi/prompts/`: project prompt templates for guided spec creation, status, issue planning, and implementation.
- `.pi/skills/`: workflows for spec authority, guided spec creation, and spec-driven planning.
- `templates/`: structures used when generating product specs.
- `ctx/`: compact maintainer context for cascade, development, architecture, and validation work.
- `examples/`: public examples and demos.
- `product-guidelines/`: intentionally gitignored user outputs.

## Example spec model excerpt

```yaml
- id: journey.user
  title: User Journey
  command: /refine-journey
  dependencies:
    required: []
  outputs:
    paths:
      - product-guidelines/00-user-journey.md
    ctx_paths:
      - product-guidelines/00-user-journey.ctx.md
  relevance:
    prefer_ctx: true
```

Generated product specs belong to the user running the workflow. This repo includes templates and examples, not a universal `product-guidelines/` output.

## Legacy Claude assets

Stack-Driven began as a Claude-oriented cascade. Those assets are still present for continuity:

- `.claude/commands/`: legacy/transitional slash commands.
- `CLAUDE.md` and `ctx/CLAUDE-*.ctx.md`: maintainer guidance and compact context.
- `specs/migration-note.md`: transition notes from hard-coded cascade commands to manifest-authoritative Pi workflows.

Prefer the Pi cockpit, `.pi/prompts/`, and `.pi/skills/` for new work. Treat Claude-era commands as compatibility material unless a task explicitly targets them.

## Principles

- User journey before technology.
- Cascading decisions with traceable dependencies.
- Generated, product-specific specs over generic templates.
- Compact context first; full documents only when needed.
- AI drafting is useful, but human review controls authority.
