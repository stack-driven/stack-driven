# CLAUDE-CASCADE.ctx.md

Context for Stack-Driven cascade sessions (1-14). Load when user works with cascade commands.

## Cascade Order (Sacred Sequential Flow)

Session flow is sacred - user journey comes first, everything flows from it.

### Core Cascade (Sessions 1-14)

**Session 1** `/refine-journey` → 00-user-journey.md + .ctx.md
- Captures journey + behavioral profile (tech proficiency, device, learning style)
- 21 progressive questions in 4 phases
- Validates completeness before output

**Session 2** `/create-product-strategy` [reads: 00.ctx.md] → 01-product-strategy.md + .ctx.md

**Session 2a** `/document-constraints` [reads: 00.ctx.md, 01.ctx.md] → 02a-constraints.md + .ctx.md
- Optional but recommended
- Captures business, technical, organizational, compliance constraints

**Session 3** `/choose-tech-stack` [reads: 00.ctx.md, 01.ctx.md, 02a.ctx.md if exists] → 02-tech-stack.md + .ctx.md
- CHECKPOINT: Validate tech choices
- Detects AI requirement (doesn't choose provider)
- Selects i18n library if constraints require
- State management + build tooling decisions

**Session 3b** `/define-coding-standards` [reads: 00.ctx.md, 01.ctx.md, 02.ctx.md] → 02b-coding-standards.md + .ctx.md

**Session 3c** `/define-ai-integration-strategy` [reads: 00.ctx.md, 01.ctx.md, 02.ctx.md] → 02c-ai-integration-strategy.md + .ctx.md
- CONDITIONAL: Only if "AI Integration: Required" in tech stack
- Makes ALL AI decisions and UPDATES 02-tech-stack.md

**Session 4** `/generate-strategy` [reads: all 00-02c.ctx.md] → 5 files with .ctx.md versions
- CHECKPOINT: Validate strategy decisions
- Generates: mission, metrics, monetization, architecture, analytics

**Session 5** `/create-brand-strategy` [reads: 00-04.ctx.md] → 05-brand-strategy.md + .ctx.md

**Session 6** `/create-design` [reads: 00-05.ctx.md] → 06-design-system.md + .ctx.md
- DTCG token hierarchy, 2025 CSS architecture, WCAG 2.2 compliance

**Session 7** `/design-database-schema` → 07-database-schema.md + .ctx.md (Progressive 4-Phase)
- CHECKPOINT: Validate schema
- **Session 7a**: Generate Core Tables (15k tokens) → 07a-core-tables.md
- **Session 7b**: Generate Relationships (10k tokens) → 07b-relationships.md
- **Session 7c**: Generate Special Tables (10k tokens, conditional) → 07c-special-tables.md
- **Session 7d**: Optimize & Synthesize (20k tokens) → 07-database-schema.md + .ctx.md
- 83% token reduction vs monolithic approach (480k → <80k)

**Session 8** `/generate-api-design` [reads: context] → 08-api-design.md + .ctx.md
- Uses conditional sub-agents based on requirements

**Session 8b** `/generate-api-contracts` [reads: context] → 08b-api-contracts.md + .ctx.md
- 5 phase-based sub-agents with conditional loading

**Session 9** `/create-test-strategy` [reads: 00-08b.ctx.md] → 09-test-strategy.md + .ctx.md

**Session 9b** `/model-application` [reads: context] → 09b-application-architecture.md + .ctx.md
- 6 conditional sub-agents based on complexity

**Session 10** `/generate-backlog` → 10-backlog/ directory
- CHECKPOINT: Validate backlog
- Split into 10a (epics) and 10b (stories) to prevent context exhaustion

**Session 11** `/create-gh-issues` [reads: 10-backlog/] → Pushes to GitHub

**Session 12** `/scaffold-project` [reads: context] → Generates code scaffold

**Session 13** `/plan-deployment` [reads: context] → 13-deployment-plan.md

**Session 14** `/design-observability` [reads: context] → 14-observability-strategy.md

### Post-Cascade Extensions (Optional)

Run AFTER core cascade for specialized needs:

- `/discover-naming` - After S5, generates 15-brand-naming.md
- `/define-messaging` - After S5, generates 16-brand-messaging.md
- `/design-brand-identity` - After S5, generates 17-brand-identity.md
- `/create-compliance-plan` - After S2a/S10, generates 23-compliance-plan.md

### Context File Pattern

**UNIVERSAL RULE:** Sessions 1-9b create TWO files:
- Full .md version for humans (detailed specifications)
- .ctx.md version for AI (60-70% reduction)

Sessions ALWAYS read .ctx.md when available for token efficiency.

### Checkpoint System

Human-in-the-Loop checkpoints at critical decisions:
- Session 3: Tech stack validation
- Session 4: Strategy validation
- Session 7: Database schema validation
- Session 10: Backlog validation

Each checkpoint includes:
1. Completion confirmation
2. Review checklist
3. Cascade explanation
4. Rollback instructions
5. Continue prompt

### Constraint Propagation

**i18n/l10n:** S2a → S3 (library) → S7 (locale columns) → S8 (headers) → S10 (stories) → S12 (locales/)
**Third-party:** S2a → S3 (SDKs) → S7 (integration tables) → S8 (webhooks) → S10 (stories)
**AI:** S3 → S3c (provider/model) → S4 (architecture) → S7 (vectors) → S10 (stories)
**Compliance:** S2a → post-cascade compliance plan → S10 (Foundation epic stories)

### Meta Commands

- `/cascade-status` - Check progress, recommend next step
- `/run` - Automated sequential execution with checkpoints
- `/validate-outputs` - Quality validation of cascade outputs