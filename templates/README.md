# Stack-Driven Templates Directory

This directory contains all template files used by the Stack-Driven framework commands. Templates provide structured formats for creating product guidelines that flow through the cascade.

## Template Numbering System

### Core Cascade Templates (00-14)

Templates numbered `00` through `14` correspond to the **14-session core cascade**. The numbering follows the sequential flow of product development from journey to deployment:

| # | Template File | Session | Command | Output File |
|---|---------------|---------|---------|-------------|
| **00** | `00-user-journey-template.md` | Session 1 | `/refine-journey` | `00-user-journey.md` |
| **01** | `01-product-strategy-template.md` | Session 2 | `/create-product-strategy` | `01-product-strategy.md` |
| **02** | `02-tech-stack-template.md` | Session 3 | `/choose-tech-stack` | `02-tech-stack.md` |
| **03** | `03-mission-template.md` | Session 4 (1/4) | `/generate-strategy` | `03-mission.md` |
| **04** | `04-metrics-template.md` | Session 4 (2/4) | `/generate-strategy` | `04-metrics.md` |
| **04** | `04-monetization-template.md` | Session 4 (3/4) | `/generate-strategy` | `04-monetization.md` |
| **04** | `04-architecture-template.md` | Session 4 (4/4) | `/generate-strategy` | `04-architecture.md` |
| **05** | `05-brand-strategy-template.md` | Session 5 | `/create-brand-strategy` | `05-brand-strategy.md` |
| **06** | `06-design-system-template.md` | Session 6 | `/create-design` | `06-design-system.md` |
| **07** | `07-database-schema-template.md` | Session 7 | `/design-database-schema` | `07-database-schema.md` |
| **08** | `08-api-contracts-template.md` | Session 8 | `/generate-api-contracts` | `08-api-contracts.md` |
| **09** | `09-test-strategy-template.md` | Session 9 | `/create-test-strategy` | `09-test-strategy.md` |
| **10** | `issue-template.md` | Session 10 | `/generate-backlog` | `10-backlog/*.md` |
| **11** | *(Session 11 - GitHub only)* | Session 11 | `/create-gh-issues` | *(pushes to GitHub)* |
| **12** | *(Session 12 - code generation)* | Session 12 | `/scaffold-project` | `12-project-scaffold.md` + code |
| **13** | `13-deployment-plan-template.md` | Session 13 | `/plan-deployment` | `13-deployment-plan.md` |
| **14** | `14-observability-strategy-template.md` | Session 14 | `/design-observability` | `14-observability-strategy.md` |

### Why Some Numbers Are Missing

**Number 10:** Session 10 (`/generate-backlog`) uses `issue-template.md` instead of a numbered template because it generates multiple issue files rather than a single structured document.

**Number 11:** Session 11 (`/create-gh-issues`) doesn't create local files—it pushes issues directly to GitHub, so it needs no template.

**Number 12:** Session 12 (`/scaffold-project`) generates actual code files (not markdown documentation), so it doesn't use a traditional markdown template.

### Why "04" Appears Three Times

Session 4 (`/generate-strategy`) creates **four separate tactical foundation files**:
- `03-mission.md` - Your product's purpose and core values
- `04-metrics.md` - North Star metric and success measurements
- `04-monetization.md` - Revenue model and pricing strategy
- `04-architecture.md` - High-level technical architecture

All are created in a single session but stored as separate documents for modularity and focused reference.

## Essentials Templates

Some sessions create **two versions** of output:
1. **Full template** - Comprehensive documentation for human reference
2. **Essentials template** - Condensed version optimized for AI context in Session 10

### Why Essentials Exist

Session 10 (`/generate-backlog`) reads ALL previous outputs to generate a comprehensive product backlog. To optimize token usage and reduce costs, we create "essentials" versions that contain only the critical information needed for backlog generation.

| Full Template | Essentials Template | Size Reduction |
|---------------|---------------------|----------------|
| `01-product-strategy-template.md` | `11-product-strategy-essentials-template.md` | ~65% smaller |
| `07-database-schema-template.md` | `07-database-schema-essentials-template.md` | ~56% smaller |
| `08-api-contracts-template.md` | `08-api-contracts-essentials-template.md` | ~80% smaller |
| `09-test-strategy-template.md` | `09-test-strategy-essentials-template.md` | ~66% smaller |

**Note:** Essentials templates use their original session number (07, 08, 09) but product strategy essentials uses `11` because it's created in Session 2 and read specifically by Session 10.

## Post-Core Extension Templates (Unnumbered)

These templates support **optional post-cascade commands** that extend the core framework. They are unnumbered because they can be run at various points after completing core sessions:

### Branding Extensions (After Session 5+)
- `brand-naming-template.md` → `/discover-naming` → `brand-naming.md`
- `brand-messaging-template.md` → `/define-messaging` → `brand-messaging.md`
- `brand-identity-template.md` → `/design-brand-identity` → `brand-identity.md`
- `content-guidelines-template.md` → `/create-content-guidelines` → `content-guidelines.md`

### Product Extensions (After Session 6+)
- `user-experience-template.md` → `/design-user-experience` → `user-experience.md`
- `analytics-plan-template.md` → `/setup-analytics` → `analytics-plan.md`
- `growth-strategy-template.md` → `/design-growth-strategy` → `growth-strategy.md`
- `financial-model-template.md` → `/create-financial-model` → `financial-model.md`

### Special Templates
- `issue-template.md` - Used by Session 10 to generate individual backlog issue files

## Template Structure

All templates follow a consistent structure:

1. **Context sections** - Placeholders for user-specific information
2. **Decision trees** - Guided questions to help make strategic choices
3. **Examples** - Concrete illustrations of good vs. poor implementations
4. **Cross-references** - Links to related cascade outputs
5. **Validation checklists** - Ensure completeness before moving forward

## Command-Template Mapping

Each command file in `.claude/commands/` references one or more templates:

**Core Cascade Commands:**
```
Session 1:  /refine-journey           → 00-user-journey-template.md
Session 2:  /create-product-strategy  → 01-product-strategy-template.md, 11-product-strategy-essentials-template.md
Session 3:  /choose-tech-stack        → 02-tech-stack-template.md
Session 4:  /generate-strategy        → 03-mission-template.md, 04-{metrics,monetization,architecture}-template.md
Session 5:  /create-brand-strategy    → 05-brand-strategy-template.md
Session 6:  /create-design            → 06-design-system-template.md
Session 7:  /design-database-schema   → 07-database-schema-template.md, 07-database-schema-essentials-template.md
Session 8:  /generate-api-contracts   → 08-api-contracts-template.md, 08-api-contracts-essentials-template.md
Session 9:  /create-test-strategy     → 09-test-strategy-template.md, 09-test-strategy-essentials-template.md
Session 10: /generate-backlog         → issue-template.md
Session 11: /create-gh-issues         → (none - GitHub API)
Session 12: /scaffold-project         → (none - code generation)
Session 13: /plan-deployment          → 13-deployment-plan-template.md
Session 14: /design-observability     → 14-observability-strategy-template.md
```

**Post-Cascade Commands:**
```
/design-user-experience     → user-experience-template.md
/setup-analytics            → analytics-plan-template.md
/design-growth-strategy     → growth-strategy-template.md
/create-financial-model     → financial-model-template.md
/discover-naming            → brand-naming-template.md
/define-messaging           → brand-messaging-template.md
/design-brand-identity      → brand-identity-template.md
/create-content-guidelines  → content-guidelines-template.md
/review-code                → (none - code review framework)
```

## Using Templates

Templates are **structure guides**, not rigid forms:

1. **Commands read templates** to understand output format
2. **Claude interviews the user** to gather context
3. **Output files follow template structure** but with user-specific content
4. **Templates ensure consistency** across different product implementations

## Cascade Flow Visualization

```
Session 1:  00-user-journey.md                    ← Foundation
              ↓
Session 2:  01-product-strategy.md                ← Market validation
            11-product-strategy-essentials.md
              ↓
Session 3:  02-tech-stack.md                      ← Technology choices
              ↓
Session 4:  03-mission.md                         ← Tactical foundation
            04-metrics.md
            04-monetization.md
            04-architecture.md
              ↓
Session 5:  05-brand-strategy.md                  ← Brand & design
              ↓
Session 6:  06-design-system.md
              ↓
Session 7:  07-database-schema.md                 ← Technical specs
            07-database-schema-essentials.md
              ↓
Session 8:  08-api-contracts.md
            08-api-contracts-essentials.md
              ↓
Session 9:  09-test-strategy.md
            09-test-strategy-essentials.md
              ↓
Session 10: 10-backlog/                           ← Execution
              ↓
Session 11: (GitHub issues)
              ↓
Session 12: 12-project-scaffold.md + code/
              ↓
Session 13: 13-deployment-plan.md                 ← Operations
              ↓
Session 14: 14-observability-strategy.md
```

## Maintenance

When modifying templates:

1. **Preserve numbering** - Numbers match cascade order, not sequential counting
2. **Update both versions** - If a template has an essentials version, update both
3. **Check command references** - Ensure `.claude/commands/*.md` files reference correct template paths
4. **Test the cascade** - Run affected commands to verify template changes work correctly
5. **Document changes** - Update this README if template structure or purpose changes

## Questions?

- **Why is numbering not sequential?** - Numbers represent cascade sessions (1-14), not file count
- **Why do some numbers repeat?** - Session 4 creates 4 files; sessions 7-9 create full + essentials versions
- **Can I add custom templates?** - Yes, for custom post-cascade commands; use unnumbered naming
- **Should I modify templates?** - Customize for your needs, but preserve overall structure for consistency

---

**Version:** 1.0
**Last Updated:** 2025-11-14
**Framework:** Stack-Driven Product Development
