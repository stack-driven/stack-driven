# Stack-Driven Spec Index

This index is the human-readable companion to `specs/manifest.yaml`. The manifest is canonical for machine-readable authority metadata.

## Authority summary

- Root dependency: `journey.user` (`/refine-journey`).
- Generated product outputs live under `product-guidelines/` and default to `ai_drafted`.
- Human review promotes a concrete output to `human_reviewed` or `authoritative`.
- `.ctx.md` files are loading shortcuts; they do not override full `.md` specs.
- Optional/conditional specs require a recorded skip reason and revisit guidance when skipped.

## Dependency graph

```text
journey.user
  -> strategy.product
    -> constraints.operational (recommended)
    -> stack.tech
      -> standards.coding
      -> strategy.ai_integration (conditional)
      -> strategy.mission
      -> metrics.success
      -> monetization.strategy
      -> architecture.principles
      -> analytics.strategy
        -> brand.strategy
          -> design.system
            -> data.core_tables -> data.relationships -> data.special_tables (conditional)
            -> data.schema
              -> api.design -> api.contracts
                -> testing.strategy -> architecture.application -> backlog.product
                  -> delivery.github_issues
                  -> scaffold.project -> deployment.plan -> observability.strategy

Post-core optional extensions:
  brand.strategy -> brand.naming -> brand.messaging -> brand.identity
  brand.strategy -> content.guidelines
  design.system -> ux.design
  metrics.success + analytics.strategy -> analytics.implementation
  strategy.product + metrics.success + monetization.strategy -> growth.strategy -> finance.model
  constraints.operational + data.schema + api.contracts -> compliance.plan
```

## Core cascade specs

| ID | Session | Command | Required mode | Primary output |
|---|---:|---|---|---|
| `journey.user` | 1 | `/refine-journey` | required | `product-guidelines/00-user-journey.md` |
| `strategy.product` | 2 | `/create-product-strategy` | required | `product-guidelines/01-product-strategy.md` |
| `constraints.operational` | 2a | `/document-constraints` | recommended | `product-guidelines/02a-constraints.md` |
| `stack.tech` | 3 | `/choose-tech-stack` | required | `product-guidelines/02-tech-stack.md` |
| `standards.coding` | 3b | `/define-coding-standards` | required | `product-guidelines/02b-coding-standards.md` |
| `strategy.ai_integration` | 3c | `/define-ai-integration-strategy` | conditional | `product-guidelines/02c-ai-integration-strategy.md` |
| `strategy.mission` | 4 | `/generate-strategy` | required | `product-guidelines/03a-mission.md` |
| `metrics.success` | 4 | `/generate-strategy` | required | `product-guidelines/03b-metrics.md` |
| `monetization.strategy` | 4 | `/generate-strategy` | required | `product-guidelines/03c-monetization.md` |
| `analytics.strategy` | 4 | `/generate-strategy` | required | `product-guidelines/03d-analytics-strategy.md` |
| `architecture.principles` | 4 | `/generate-strategy` | required | `product-guidelines/04-architecture.md` |
| `brand.strategy` | 5 | `/create-brand-strategy` | required | `product-guidelines/05-brand-strategy.md` |
| `design.system` | 6 | `/create-design` | required | `product-guidelines/06-design-system.md` |
| `data.core_tables` | 7a | `/generate-core-tables` | support | `product-guidelines/07a-core-tables.md` |
| `data.relationships` | 7b | `/generate-relationships` | support | `product-guidelines/07b-relationships.md` |
| `data.special_tables` | 7c | `/generate-special-tables` | conditional | `product-guidelines/07c-special-tables.md` |
| `data.schema` | 7 | `/design-database-schema` | required | `product-guidelines/07-database-schema.md` |
| `api.design` | 8 | `/generate-api-design` | required | `product-guidelines/08-api-design.md` |
| `api.contracts` | 8b | `/generate-api-contracts` | required | `product-guidelines/08b-api-contracts.md` |
| `testing.strategy` | 9 | `/create-test-strategy` | required | `product-guidelines/09-test-strategy.md` |
| `architecture.application` | 9b | `/model-application` | required | `product-guidelines/09b-application-architecture.md` |
| `backlog.product` | 10 | `/generate-backlog` | required | `product-guidelines/10-backlog/` |
| `delivery.github_issues` | 11 | `/create-gh-issues` | required | `product-guidelines/11-github-issues.md` |
| `scaffold.project` | 12 | `/scaffold-project` | required | `product-guidelines/12-project-scaffold.md` |
| `deployment.plan` | 13 | `/plan-deployment` | required | `product-guidelines/13-deployment-plan.md` |
| `observability.strategy` | 14 | `/design-observability` | required | `product-guidelines/14-observability-strategy.md` |

## Post-core optional specs

| ID | Command | Primary output | Revisit when skipped |
|---|---|---|---|
| `brand.naming` | `/discover-naming` | `product-guidelines/15-brand-naming.md` | Before public launch, marketing collateral, or identity work. |
| `brand.messaging` | `/define-messaging` | `product-guidelines/16-brand-messaging.md` | Before marketing site, sales collateral, onboarding copy, or launch. |
| `brand.identity` | `/design-brand-identity` | `product-guidelines/17-brand-identity.md` | Before logo, marketing asset, or visual refresh decisions. |
| `content.guidelines` | `/create-content-guidelines` | `product-guidelines/18-content-guidelines.md` | Before localization, onboarding copy, error states, or content-heavy features. |
| `ux.design` | `/design-user-experience` | `product-guidelines/19-user-experience.md` | Before high-fidelity UI, usability testing, or complex workflow implementation. |
| `analytics.implementation` | `/setup-analytics` | `product-guidelines/20-analytics-plan.md` | Before instrumentation, growth experiments, or observability dashboards. |
| `growth.strategy` | `/design-growth-strategy` | `product-guidelines/21-growth-strategy.md` | Before acquisition campaigns, referral loops, or growth experiments. |
| `finance.model` | `/create-financial-model` | `product-guidelines/22-financial-model.md` | Before pricing changes, fundraising, hiring plan, or revenue forecasting. |
| `compliance.plan` | `/create-compliance-plan` | `product-guidelines/23-compliance-plan.md` | When regulated data, enterprise customers, payments, healthcare, EU users, or audit requirements enter scope. |

## Loading guidance

Use `relevance.load_when` and `relevance.load_priority` from the manifest for Phase II loading decisions. General rules:

1. Start with the smallest direct spec set for the task.
2. Add required dependencies until `journey.user` is reachable.
3. Prefer `.ctx.md` when `prefer_ctx: true` and a context path exists.
4. Read the full `.md` when resolving conflicts, reviewing authority, or updating a spec.
5. Do not load optional specs unless the task or condition requires them.

## Conflict rule

If two sources disagree, prefer: human-reviewed/authoritative spec, then approved issue plan/ADR, then implementation detail, then AI draft, then templates/examples. A stale implementation detail should create a migration or bug task; it should not silently override the spec.
