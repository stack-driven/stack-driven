# Pi Quickstart

This guide gets a Pi user from clone to cockpit display, then through the first Stack-Driven actions.

## 1. Clone the framework

```bash
git clone https://github.com/stack-driven/stack-driven.git
cd stack-driven
```

## 2. Install and open Pi

Install Pi using the current instructions from [pi.dev](https://pi.dev) or the `@earendil-works/pi-coding-agent` package documentation. Then open Pi from the repository root:

```bash
pi
```

With a Pi version/configuration that supports project-local resources, Pi loads prompt templates from `.pi/prompts/`, skills from `.pi/skills/`, and TypeScript extensions from `.pi/extensions/`. The Stack-Driven cockpit extension runs on session start. If it does not appear automatically, use `/stack:status` after startup.

## 3. Read the cockpit

Expected terminal/widget shape:

```text
Stack-Driven cockpit
Phase: Session 1: User Journey
Completed specs: 0/24
Skipped/deferred: 0 (none)
Skipped details: none
Review needed: 0 (none)
Next available: journey.user - Session 1: User Journey (/refine-journey)
Blocked specs: 23 (...)
Product status: not created (product-guidelines/spec-status.yaml)
Suggested action: /stack-create-spec journey.user
```

The cockpit reads:

- `specs/manifest.yaml` for canonical spec order and dependencies.
- `product-guidelines/spec-status.yaml` when present for per-product state.
- configured output paths to infer completed specs.

It does not load every generated spec into the model context.

## 4. Start Phase I: guided spec creation

Use the Pi commands or prompt templates:

```text
/stack:start
/stack:create journey.user
/stack:status
```

The guided workflow should:

1. Resolve the target spec from `specs/manifest.yaml`.
2. Check required dependencies.
3. Use mapped templates from the manifest.
4. Write the configured `product-guidelines/*.md` output.
5. Write a compact `.ctx.md` summary when configured.
6. Record AI drafts as requiring human review.

## 5. Skip or defer intentionally

Optional or conditional specs can be skipped only when the manifest policy allows it. `/stack:skip` asks the agent to run the guided skip/defer workflow; it should not silently write state without checking policy:

```text
/stack:skip brand.strategy Not needed for this internal prototype yet
```

A valid skip/defer record includes a reason, revisit trigger, and owner. Required specs whose `skip_policy.allowed` is false must not be skipped.

## 6. Start Phase II: plan an issue from specs

After relevant specs exist, use spec-driven planning:

```text
/stack:plan-issue 222      # cockpit route
/stack-plan-issue 222       # full prompt-template workflow
```

The planner should read the GitHub issue, select relevant specs from the manifest, prefer `.ctx.md` summaries, and produce an execution contract with user value, non-goals, acceptance criteria, implementation outline, validation evidence, and spec gaps. After the plan is approved, `/stack-implement-issue 222` re-checks only the cited specs and implements exactly what the plan specifies.

## Troubleshooting

- **No cockpit appears:** run `/stack:status`; verify `specs/manifest.yaml` exists and Pi is opened at or below the repository root.
- **Spec is blocked:** run `/stack:status` and create the missing required dependencies first.
- **Skip rejected:** the manifest likely marks the spec as required or disallows skipping.
- **Generated specs missing:** that is normal in a fresh clone. `product-guidelines/` is user-generated and gitignored.
