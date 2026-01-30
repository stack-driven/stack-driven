# Stack-Driven Cascade Dependencies

**Visual dependency map showing which sessions read which files.**

This document shows EXACTLY what each session reads as inputs, making it easy to:
- Spot missing dependencies when adding features
- Understand the impact radius of changes to outputs
- Debug cascade failures by tracing data flow
- Verify context file usage for token optimization

---

## Dependency Legend

```
[FULL] Full file
[CTX] Context file (condensed version)
[TMPL] Template file
```

---

## Core Cascade Flow (Sessions 1-14)

### Session 1: `/refine-journey`
**Outputs:** `00-user-journey.md`

**Reads:**
- [TMPL] `/templates/00-user-journey-template.md`
- [TMPL] `/templates/00-user-journey-interview-template.md`

**Dependencies:** None (first session)

---

### Session 2: `/create-product-strategy`
**Outputs:**
- `01-product-strategy.md`
- `01-product-strategy.ctx.md`

**Reads:**
```
├─ [FULL] product-guidelines/00-user-journey.md
└─ [TMPL] /templates/01-product-strategy-template.md
```

**Dependencies:** Session 1

**Downstream consumers of context files:**
- Session 4 (generate-strategy)
- Session 10 (generate-backlog)
- Session 12 (scaffold-project)

---

### Session 2a: `/document-constraints`
**Outputs:**
- `02a-constraints.md`
- `02a-constraints.ctx.md`

**Reads:**
```
├─ [FULL] product-guidelines/00-user-journey.md
├─ [FULL] product-guidelines/01-product-strategy.md
└─ [TMPL] /templates/02a-constraints-template.md
```

**Dependencies:** Sessions 1, 2

**Downstream consumers of context files:**
- Session 3 (choose-tech-stack)
- Session 4 (generate-strategy)
- Session 10 (generate-backlog)
- Session 12 (scaffold-project)

---

### Session 3: `/choose-tech-stack`
**Outputs:**
- `02-tech-stack.md`
- `02-tech-stack.ctx.md`

**Reads:**
```
├─ [FULL] product-guidelines/00-user-journey.md
├─ [FULL] product-guidelines/01-product-strategy.md
├─ [CTX] product-guidelines/02a-constraints.ctx.md (if exists)
└─ [TMPL] /templates/02-tech-stack-template.md
```

**Dependencies:** Sessions 1, 2, 2.5 (if exists)

**Why read full 01 not context file?** Tech stack needs detailed market analysis, competitive positioning, and roadmap themes from full strategy to derive optimal technical choices.

---

### Session 3b: `/define-coding-standards`
**Outputs:**
- `02b-coding-standards.md`
- `02b-coding-standards.ctx.md`

**Reads:**
```
├─ [FULL] product-guidelines/00-user-journey.md
├─ [FULL] product-guidelines/01-product-strategy.md
├─ [FULL] product-guidelines/02-tech-stack.md
├─ [FULL] product-guidelines/03a-mission.md
└─ [TMPL] /templates/02b-coding-standards-template.md
```

**Dependencies:** Sessions 1, 2, 3, 4 (03a-mission.md from generate-strategy)

**Downstream consumers of context files:**
- Session 4 (generate-strategy)
- Session 9b (model-application)
- Session 10 (generate-backlog)
- Session 12 (scaffold-project)

---

### Session 3c: `/define-ai-integration-strategy` (Optional)
**Outputs:**
- `02c-ai-integration-strategy.md`
- `02c-ai-integration-strategy.ctx.md`

**Reads:**
```
├─ [FULL] product-guidelines/00-user-journey.md
├─ [FULL] product-guidelines/01-product-strategy.md
├─ [FULL] product-guidelines/02-tech-stack.md
└─ [TMPL] /templates/02c-ai-integration-strategy-template.md
```

**Dependencies:** Sessions 1, 2, 3

**Condition:** Only runs if AI provider is present in tech stack

**Downstream consumers of context files:**
- Session 4 (generate-strategy)
- Session 7 (database-schema) - for vector DB if RAG
- Session 8 (api-design) - for API paradigm decisions
- Session 8b (api-contracts) - for AI endpoints
- Session 9b (model-application) - for AI service layer
- Session 10 (generate-backlog) - for AI implementation stories
- Session 12 (scaffold-project) - for AI SDK configuration
- Session 13 (deployment) - for API key management
- Session 14 (observability) - for token tracking

---

### Session 4: `/generate-strategy`
**Outputs:**
- `03a-mission.md`
- `03b-metrics.md`
- `03c-monetization.md`
- `04-architecture.md`

**Reads:**
```
├─ [FULL] product-guidelines/00-user-journey.md
├─ [CTX] product-guidelines/01-product-strategy.ctx.md
├─ [FULL] product-guidelines/02-tech-stack.md
├─ [CTX] product-guidelines/02a-constraints.ctx.md (if exists)
├─ [CTX] product-guidelines/02b-coding-standards.ctx.md
├─ [CTX] product-guidelines/02c-ai-integration-strategy.ctx.md (if exists)
└─ [TMPL] /templates/03a-mission-template.md
    /templates/03b-metrics-template.md
    /templates/03c-monetization-template.md
    /templates/04-architecture-template.md
```

**Dependencies:** Sessions 1, 2, 2.5 (if exists), 3, 3b, 3c (optional)

**Why context file for 01 and 02b?** Session 4 needs vision, positioning, goals, and principles (in context file) but not detailed market analysis. Similarly needs coding patterns but not detailed implementation examples.

---

### Session 5: `/create-brand-strategy`
**Outputs:** `05-brand-strategy.md`
            `05-brand-strategy.ctx.md`

**Reads:**
```
├─ [FULL] product-guidelines/00-user-journey.md
├─ [FULL] product-guidelines/01-product-strategy.md
├─ [FULL] product-guidelines/03a-mission.md
├─ [FULL] product-guidelines/03b-metrics.md (optional)
└─ [TMPL] /templates/05-brand-strategy-template.md
```

**Dependencies:** Sessions 1, 2, 4

**Downstream consumers of context files:**
- Post-cascade extensions: discover-naming, define-messaging, design-brand-identity (read FULL .md)
- Session 6 (create-design) reads 05-brand-strategy.ctx.md

**Why context file?** 65% reduction. Contains brand positioning, personality, voice guidelines—sufficient for design system generation without full market analysis and brand exercises.

**Note:** Post-cascade extensions read FULL .md file (need complete brand personality), but Session 6 uses .ctx.md for token efficiency.

---

### Session 6: `/create-design`
**Outputs:** `06-design-system.md`
            `06-design-system.ctx.md`

**Reads:**
```
├─ [FULL] product-guidelines/00-user-journey.md
├─ [CTX] product-guidelines/01-product-strategy.ctx.md
├─ [CTX] product-guidelines/05-brand-strategy.ctx.md
└─ [TMPL] /templates/06-design-system-template.md
```

**Dependencies:** Sessions 1, 2, 5

**Downstream consumers of context files:**
- Session 7 (design-database-schema) - needs design tokens for data model naming
- Post-cascade extensions: design-user-experience, design-brand-identity (read FULL .md)
- /plan-issue (UI work) reads FULL .md file (needs complete component specs)

**Why context file?** 60% reduction. Contains design tokens, component list, pattern names—sufficient for downstream cascade sessions without detailed component specifications and usage examples.

**Note:** /plan-issue and post-cascade extensions read FULL .md file (need complete specs), but cascade sessions use .ctx.md for token efficiency.

---

### Session 7: `/design-database-schema`
**Outputs:**
- `07-database-schema.md`
- `07-database-schema.ctx.md`

**Reads:**
```
├─ [FULL] product-guidelines/00-user-journey.md
├─ [FULL] product-guidelines/02-tech-stack.md
├─ [FULL] product-guidelines/04-architecture.md
└─ [TMPL] /templates/07-database-schema-template.md
```

**Dependencies:** Sessions 1, 3, 4

**Downstream consumers of context files:**
- Session 8 (generate-api-design)
- Session 8b (generate-api-contracts)
- Session 9 (create-test-strategy)
- Session 9b (model-application)
- Session 10 (generate-backlog)
- Session 12 (scaffold-project)

**Why context file?** 56% reduction. Contains table list, ERD, relationships—sufficient for API design and architecture without column details, indexes, migrations.

---

### Session 8: `/generate-api-design`
**Outputs:**
- `08-api-design.md`
- `08-api-design.ctx.md`

**Reads:**
```
├─ [FULL] product-guidelines/00-user-journey.md
├─ [FULL] product-guidelines/02-tech-stack.md
├─ [FULL] product-guidelines/04-architecture.md
├─ [CTX] product-guidelines/07-database-schema.ctx.md
├─ [TMPL] /templates/08-api-design-template.md
└─ [REF] /reference-material/serialization-guide.md
```

**Dependencies:** Sessions 1, 3, 4, 7

**Downstream consumers of context files:**
- Session 8b (generate-api-contracts) - reads API paradigm decisions
- Session 10 (generate-backlog) - reads API paradigm and serialization for API-driven stories

**Why context file?** 79% reduction. Contains API paradigm decision (REST/GraphQL/gRPC), serialization format (JSON/Protobuf/MessagePack), auth approach, rate limiting strategy—sufficient for backlog generation without detailed analysis sections.

---

### Session 8b: `/generate-api-contracts`
**Outputs:**
- `08b-api-contracts.md`
- `08b-api-contracts.ctx.md`

**Reads:**
```
├─ [FULL] product-guidelines/08-api-design.md
├─ [FULL] product-guidelines/00-user-journey.md
├─ [FULL] product-guidelines/02-tech-stack.md
├─ [FULL] product-guidelines/04-architecture.md
├─ [CTX] product-guidelines/07-database-schema.ctx.md
└─ [TMPL] /templates/08b-api-contracts-template.md
```

**Dependencies:** Sessions 1, 3, 4, 7, 8

**Downstream consumers of context files:**
- Session 9 (create-test-strategy)
- Session 9b (model-application)
- Session 10 (generate-backlog)
- Session 12 (scaffold-project)

**Why context file?** 79% reduction. Contains endpoint list organized by journey step—sufficient for test strategy, backlog, and scaffold generation without full request/response schemas, validation rules, error codes.

---

### Session 9: `/create-test-strategy`
**Outputs:**
- `09-test-strategy.md`
- `09-test-strategy.ctx.md`

**Reads:**
```
├─ [FULL] product-guidelines/00-user-journey.md
├─ [FULL] product-guidelines/02-tech-stack.md
├─ [FULL] product-guidelines/04-architecture.md
├─ [CTX] product-guidelines/07-database-schema.ctx.md
├─ [CTX] product-guidelines/08b-api-contracts.ctx.md
└─ [TMPL] /templates/09-test-strategy-template.md
```

**Dependencies:** Sessions 1, 3, 4, 7, 8b

**Downstream consumers of context files:**
- Session 10 (generate-backlog)
- Session 12 (scaffold-project)

**Why context file?** 66% reduction. Contains coverage targets, test types, quality gates—sufficient for backlog and scaffold without detailed test patterns and examples.

---

### Session 9b: `/model-application`
**Outputs:**
- `09b-application-architecture.md`
- `09b-application-architecture.ctx.md`

**Reads:**
```
├─ [FULL] product-guidelines/00-user-journey.md
├─ [FULL] product-guidelines/02-tech-stack.md
├─ [CTX] product-guidelines/02b-coding-standards.ctx.md
├─ [FULL] product-guidelines/04-architecture.md
├─ [CTX] product-guidelines/07-database-schema.ctx.md
├─ [CTX] product-guidelines/08b-api-contracts.ctx.md
└─ [TMPL] /templates/09b-application-architecture-template.md
```

**Dependencies:** Sessions 1, 3, 3b, 4, 7, 8

**Downstream consumers of context files:**
- Session 10 (generate-backlog) - needs method signatures for implementation stories
- Session 12 (scaffold-project) - needs class structure for code skeleton generation

**Why context file for inputs?** Architecture doesn't need full schemas/contracts—just table list, relationships, endpoint list. Needs context file of coding standards for framework patterns without detailed examples.

**Why context file for output?** 60% reduction. Contains service list with method signatures, repository methods, controller endpoint mappings—sufficient for backlog story generation and scaffold code skeletons without detailed architecture decision records and pattern explanations.

---

### Session 10: `/generate-backlog`
**Outputs:** `10-backlog/BACKLOG.md` + individual story files

**Reads:**
```
├─ [FULL] product-guidelines/00-user-journey.md
├─ [CTX] product-guidelines/01-product-strategy.ctx.md
├─ [FULL] product-guidelines/02-tech-stack.md
├─ [CTX] product-guidelines/02a-constraints.ctx.md (if exists)
├─ [CTX] product-guidelines/02b-coding-standards.ctx.md
├─ [CTX] product-guidelines/02c-ai-integration-strategy.ctx.md (if exists)
├─ [FULL] product-guidelines/03a-mission.md
├─ [FULL] product-guidelines/03b-metrics.md
├─ [FULL] product-guidelines/03c-monetization.md
├─ [FULL] product-guidelines/04-architecture.md
├─ [CTX] product-guidelines/07-database-schema.ctx.md
├─ [CTX] product-guidelines/08b-api-contracts.ctx.md
├─ [CTX] product-guidelines/09-test-strategy.ctx.md
├─ [CTX] product-guidelines/09b-application-architecture.ctx.md
└─ [TMPL] /templates/issue-template.md
```

**Dependencies:** Sessions 1, 2, 2.5 (if exists), 3, 3b, 3c (if exists), 4, 7, 8, 9, 9b

**Why all these files?** Backlog is the convergence point where all previous decisions materialize into user stories:
- 00 (journey) → Epic structure, story prioritization
- 01-product-strategy.ctx → Vision, goals for story context
- 02 (tech-stack) → Technical implementation approach in stories
- 02b-coding-standards.ctx → File organization, naming for implementation tasks
- 03 (mission) → Product context in story descriptions
- 04 (metrics/monetization/architecture) → Success criteria, tracking, technical constraints
- 07-database-schema.ctx → Data model references in stories
- 08b-api-contracts.ctx → Endpoint implementation stories
- 09-test-strategy.ctx → Testing acceptance criteria
- 09b-application-architecture.ctx → Service/method implementation stories ("Implement DocumentService.uploadDocument()")

**Note:** Sessions 5 (brand-strategy) and 6 (design-system) NOT read. Backlog focuses on technical implementation user stories. Design/brand context comes from journey and product strategy.

---

### Session 11: `/create-gh-issues`
**Outputs:** GitHub issues created via `gh` CLI

**Reads:**
```
└─ [FULL] product-guidelines/10-backlog/BACKLOG.md
   [FULL] product-guidelines/10-backlog/*.md (individual stories)
```

**Dependencies:** Session 10

**No template file.** Uses `gh issue create` directly with backlog story content.

---

### Session 12: `/scaffold-project`
**Outputs:**
- `12-project-scaffold.md` (documentation)
- Code files in repository root (package.json, docker-compose.yml, src/*, etc.)

**Reads:**
```
├─ [FULL] product-guidelines/00-user-journey.md
├─ [CTX] product-guidelines/01-product-strategy.ctx.md
├─ [FULL] product-guidelines/02-tech-stack.md
├─ [CTX] product-guidelines/02a-constraints.ctx.md (if exists)
├─ [CTX] product-guidelines/02b-coding-standards.ctx.md
├─ [CTX] product-guidelines/02c-ai-integration-strategy.ctx.md (if exists)
├─ [FULL] product-guidelines/04-architecture.md
├─ [CTX] product-guidelines/07-database-schema.ctx.md
├─ [CTX] product-guidelines/08b-api-contracts.ctx.md
├─ [CTX] product-guidelines/09-test-strategy.ctx.md
├─ [CTX] product-guidelines/09b-application-architecture.ctx.md
└─ [FULL] product-guidelines/10-backlog/BACKLOG.md
```

**Dependencies:** Sessions 1, 2, 2.5 (if exists), 3, 3b, 3c (if exists), 4, 7, 8, 9, 9b, 10

**Why all these context files?** Scaffold GENERATES actual code:
- 00 (journey) → Project name, domain concepts
- 01-product-strategy.ctx → Vision for code comments
- 02 (tech-stack) → Languages, frameworks, tools to scaffold
- 02b-coding-standards.ctx → Directory structure, file organization, naming conventions
- 04 (architecture) → Monorepo/multi-repo, service structure
- 07-database-schema.ctx → Entity classes, repository interfaces
- 08b-api-contracts.ctx → Controller/handler method stubs
- 09-test-strategy.ctx → Test file structure, coverage setup
- 09b-application-architecture.ctx → Service classes with method signatures, dependency injection
- 10 (backlog) → TODO comments linking to user stories

**Important:** Scaffold uses framework-specific best practices (e.g., Next.js App Router patterns), NOT generic templates. Code placed in repository root, not product-guidelines/.

---

### Session 13: `/plan-deployment`
**Outputs:** `13-deployment-plan.md`

**Reads:**
```
├─ [FULL] product-guidelines/02-tech-stack.md
├─ [FULL] product-guidelines/04-architecture.md
└─ [TMPL] /templates/13-deployment-plan-template.md
```

**Dependencies:** Sessions 3, 4

**Why only 02 and 04?** Deployment needs to know:
- What to deploy (tech stack)
- How it's structured (architecture)
Journey, strategy, schemas not needed for infrastructure decisions.

---

### Session 14: `/design-observability`
**Outputs:** `14-observability-strategy.md`

**Reads:**
```
├─ [FULL] product-guidelines/04-architecture.md
├─ [FULL] product-guidelines/03b-metrics.md
├─ [FULL] product-guidelines/13-deployment-plan.md (optional)
└─ [TMPL] /templates/14-observability-strategy-template.md
```

**Dependencies:** Session 4, optionally Session 13

**Why 03b-metrics?** Business metrics inform technical monitoring (e.g., track "documents processed" metric with counters, measure "processing time" with histograms).

---

## Post-Cascade Extensions

### `/discover-naming`
**Reads:**
```
├─ [FULL] product-guidelines/00-user-journey.md
├─ [FULL] product-guidelines/01-product-strategy.md
├─ [FULL] product-guidelines/03a-mission.md
└─ [FULL] product-guidelines/05-brand-strategy.md
```

**When to run:** After Session 5 (brand-strategy)

---

### `/define-messaging`
**Reads:**
```
├─ [FULL] product-guidelines/00-user-journey.md
├─ [FULL] product-guidelines/01-product-strategy.md
├─ [FULL] product-guidelines/03a-mission.md
└─ [FULL] product-guidelines/05-brand-strategy.md
```

**When to run:** After Session 5 (brand-strategy)

---

### `/design-brand-identity`
**Reads:**
```
├─ [FULL] product-guidelines/00-user-journey.md
├─ [FULL] product-guidelines/05-brand-strategy.md
└─ [FULL] product-guidelines/06-design-system.md
```

**When to run:** After Session 6 (design-system)

---

### `/design-user-experience`
**Reads:**
```
├─ [FULL] product-guidelines/00-user-journey.md
├─ [FULL] product-guidelines/01-product-strategy.md
├─ [FULL] product-guidelines/05-brand-strategy.md
└─ [FULL] product-guidelines/06-design-system.md
```

**When to run:** After Session 6 (design-system)

---

### `/setup-analytics`
**Reads:**
```
├─ [FULL] product-guidelines/00-user-journey.md
├─ [FULL] product-guidelines/02-tech-stack.md
├─ [FULL] product-guidelines/03b-metrics.md
└─ [FULL] product-guidelines/06-design-system.md
```

**When to run:** After Session 6 (design-system)

---

### `/design-growth-strategy`
**Reads:**
```
├─ [FULL] product-guidelines/00-user-journey.md
├─ [FULL] product-guidelines/01-product-strategy.md
├─ [FULL] product-guidelines/03a-mission.md
├─ [FULL] product-guidelines/03b-metrics.md
└─ [FULL] product-guidelines/03c-monetization.md
```

**When to run:** After Session 4 (generate-strategy)

---

### `/create-financial-model`
**Reads:**
```
├─ [FULL] product-guidelines/00-user-journey.md
├─ [FULL] product-guidelines/01-product-strategy.md
├─ [FULL] product-guidelines/03b-metrics.md
└─ [FULL] product-guidelines/03c-monetization.md
```

**When to run:** After Session 4 (generate-strategy)

---

### `/create-content-guidelines`
**Reads:**
```
├─ [FULL] product-guidelines/00-user-journey.md
├─ [FULL] product-guidelines/05-brand-strategy.md
└─ [FULL] product-guidelines/06-design-system.md
```

**When to run:** After Session 6 (design-system)

---

## Dev-Time Commands

### `/validate-outputs`
**Reads:**
```
ALL files in product-guidelines/
```

**Purpose:** Quality assurance for cascade outputs. Validates journey alignment, philosophy adherence, completeness, consistency, specificity, technical soundness.

---

### `/implement-issue [issue-number]`
**Reads (conditionally):**
```
├─ [FULL] product-guidelines/02-tech-stack.md (ALWAYS)
├─ [FULL] product-guidelines/06-design-system.md (if UI work)
├─ [FULL] product-guidelines/07-database-schema.md (if database work)
└─ [FULL] product-guidelines/08-api-contracts.md (if API work)
```

**Purpose:** Implement GitHub issue following approved plan. Loads relevant guardrails based on work type.

**Why full files, not context files?** Implementation needs:
- Full schema with indexes, constraints, migrations (not just table list)
- Full API contracts with validation rules, error codes (not just endpoint list)
- Full design tokens and component specs (no context file exists)

---

### `/plan-issue [issue-number]`
**Reads (conditionally based on issue type):**
```
├─ [CTX] product-guidelines/02-tech-stack.ctx.md (ALWAYS)
├─ [CTX] product-guidelines/02b-coding-standards.ctx.md (ALWAYS)
├─ [CTX] product-guidelines/04-architecture.ctx.md (if infrastructure work)
├─ [FULL] product-guidelines/06-design-system.md (if UI work - reads full for complete specs)
├─ [CTX] product-guidelines/07-database-schema.ctx.md (if database work)
├─ [CTX] product-guidelines/08-api-design.ctx.md (if API work)
├─ [CTX] product-guidelines/08b-api-contracts.ctx.md (if API work)
└─ [CTX] product-guidelines/09-test-strategy.ctx.md (if testing work)
```

**Purpose:** Create detailed implementation plan for GitHub issue, then post to GitHub.

**Why context files?** Planning needs high-level technical decisions (paradigm, patterns, table list, endpoint list) but not full implementation details. Exception: 06-design-system reads FULL .md (UI planning needs complete component specs, not condensed version).

**Template Embedding:** `/plan-issue` conditionally embeds template sections based on detected work type (UI → design tokens, API → endpoint structure, database → schema format) to guide plan structure. This reduces token usage vs. loading full templates.

---

### `/review-code`
**Reads:**
```
├─ [FULL] product-guidelines/02-tech-stack.md
├─ [CTX] product-guidelines/02b-coding-standards.ctx.md
└─ Changed files in current git diff
```

**Purpose:** Guide code review with comprehensive framework.

---

## Context Files: Token Optimization Strategy

**Files WITH context files:**
- `00-user-journey.ctx.md` (70% reduction)
- `01-product-strategy.ctx.md` (65% reduction)
- `02-tech-stack.ctx.md` (65% reduction)
- `02a-constraints.ctx.md` (70% reduction)
- `02b-coding-standards.ctx.md` (70% reduction)
- `02c-ai-integration-strategy.ctx.md` (70% reduction)
- `03a-mission.ctx.md` (65% reduction)
- `03b-metrics.ctx.md` (65% reduction)
- `03c-monetization.ctx.md` (65% reduction)
- `04-architecture.ctx.md` (60% reduction)
- `05-brand-strategy.ctx.md` (65% reduction)
- `06-design-system.ctx.md` (60% reduction)
- `07-database-schema.ctx.md` (56% reduction)
- `08-api-design.ctx.md` (65% reduction)
- `08b-api-contracts.ctx.md` (80% reduction)
- `09-test-strategy.ctx.md` (66% reduction)
- `09b-application-architecture.ctx.md` (60% reduction)

**Files without context files (Sessions 10-14):**
- `10-backlog/*.md` - User stories already concise
- `12-project-scaffold.md` - Final scaffold documentation
- `13-deployment-plan.md` - Final deployment plan
- `14-observability-strategy.md` - Final observability strategy

**When to use context files vs full:**

**Use context files when:**
- Session 10 (backlog) or Session 12 (scaffold) reads it
- File is large with detailed specs/examples
- High-level structure sufficient (table list, endpoint list, service signatures)
- Token reduction critical for cascade performance

**Use full file when:**
- Session 3 (tech-stack) needs market analysis from product strategy
- Sessions 5/6 (brand/design) need positioning and personality
- Dev commands (implement-issue) need indexes, validation rules, error codes
- Post-cascade extensions need complete context

---

## Propagation Patterns: Cross-Cutting Concerns

### Third-Party Integration Propagation

When Session 2a specifies third-party integration requirements (payment processors, CRM, communication services, analytics, etc.), these requirements propagate through the cascade:

**Session 2a (document-constraints):**
- Documents integration details: provider name, integration type (API-only vs webhooks), data flow direction, technical requirements, priority level

**Session 3 (choose-tech-stack):**
- Selects appropriate SDKs/client libraries for integrations
- Adds third-party packages to tech stack (e.g., `stripe`, `@sendgrid/mail`, `@segment/analytics-node`)

**Session 4 (generate-strategy → 04-architecture.md):**
- Includes integration architecture patterns:
  - Credential management (environment variables, secrets management)
  - Webhook handling (signature verification, event processing)
  - Rate limiting strategies
  - Monitoring and alerting for external dependencies

**Session 7 (design-database-schema):**
- Generates integration-specific tables (if webhooks or sync required):
  - `integration_credentials` - API keys, OAuth tokens
  - `sync_jobs` - Background job tracking for data sync
  - `webhook_events` - Event log with deduplication, retry tracking

**Session 8 (generate-api-design):**
- Designs API endpoints for webhook handlers
- Security requirements: signature verification, idempotency keys
- Error handling for external service failures

**Session 8b (generate-api-contracts):**
- Generates OpenAPI specs for webhook endpoints
- Provider-specific security details (e.g., Stripe signature headers)
- Request/response schemas for integration callbacks

**Session 10 (generate-backlog):**
- Generates Epic 04 integration stories per provider:
  - Credential setup and environment configuration
  - SDK integration and API client setup
  - Webhook handler implementation (if required)
  - Error handling and retry logic
  - Monitoring and logging integration

**Session 12 (scaffold-project):**
- Generates integration adapter skeletons in codebase:
  - `src/integrations/StripeAdapter.ts`
  - `src/integrations/SendGridAdapter.ts`
  - Configuration files with environment variable placeholders
  - Webhook signature verification utilities

**Pattern Summary:** Like i18n, third-party integrations are detected in constraints (Session 2a) and flow through tech stack → architecture → database → API design → backlog → scaffold. This ensures comprehensive integration planning from requirements to implementation.

---

### Internationalization (i18n) Propagation

When Session 2a marks "Internationalization requirements (i18n, l10n)" as required:

**Session 3 (choose-tech-stack):**
- Selects i18n library based on frontend framework (next-intl, react-i18next, vue-i18n, svelte-i18n)

**Session 7 (design-database-schema):**
- Adds locale columns and translation table patterns

**Session 8 (generate-api-design):**
- Adds Accept-Language header support
- Defines localized error message requirements

**Session 10 (generate-backlog):**
- Generates Epic 04 i18n infrastructure stories:
  - Translation file setup
  - Locale switching UI
  - String extraction workflow

**Session 12 (scaffold-project):**
- Generates `/locales/` directory structure
- Example translation files (`common.json`, `auth.json`, `errors.json`)
- i18n configuration with locale detection

**Pattern Summary:** Constraint drives conditional technical decisions across cascade, similar to Session 3c (AI integration) precedent.

---

## Impact Analysis: Changing an Output

### If you modify `00-user-journey.md`:
**Direct impact:**
- (✓) Session 2 (product-strategy)
- (✓) Session 3 (tech-stack)
- (✓) Session 3b (coding-standards)
- (✓) Session 4 (generate-strategy)
- (✓) Session 5 (brand-strategy)
- (✓) Session 6 (create-design)
- (✓) Session 7 (database-schema)
- (✓) Session 8 (api-design)
- (✓) Session 8b (api-contracts)
- (✓) Session 9 (test-strategy)
- (✓) Session 9b (model-application)
- (✓) Session 10 (backlog)
- (✓) Session 12 (scaffold)

**Cascade impact:** Essentially everything (journey is foundation)

**Action:** Regenerate ALL subsequent sessions

---

### If you modify `02-tech-stack.md`:
**Direct impact:**
- (✓) Session 3b (coding-standards) - needs framework choices
- (✓) Session 4 (generate-strategy) - architecture depends on tech
- (✓) Session 7 (database-schema) - ORM/migration tool choice
- (✓) Session 8 (api-design) - API paradigm selection
- (✓) Session 8b (api-contracts) - API framework patterns
- (✓) Session 9 (test-strategy) - testing frameworks
- (✓) Session 9b (model-application) - framework-specific patterns
- (✓) Session 10 (backlog) - technical approach in stories
- (✓) Session 12 (scaffold) - languages/frameworks to scaffold
- (✓) Session 13 (deployment) - what to deploy

**Cascade impact:** Moderate-to-high (affects technical implementation)

**Action:** Regenerate Sessions 3b, 4, 7-14

---

### If you modify `07-database-schema.md`:
**Direct impact:**
- (✓) Session 8 (api-design) - API paradigm may change based on data model
- (✓) Session 8b (api-contracts) - depends on database structure
- (✓) Session 9 (test-strategy) - database testing patterns
- (✓) Session 9b (model-application) - entity/repository modeling
- (✓) Session 10 (backlog) - data model references
- (✓) Session 12 (scaffold) - entity classes, migrations

**Cascade impact:** Moderate (affects data layer and above)

**Action:** Regenerate Sessions 8, 8b, 9-12

---

### If you modify `05-brand-strategy.md`:
**Direct impact:**
- (✓) Session 6 (create-design) - brand personality → design decisions
- (✓) Post-cascade: discover-naming, define-messaging, design-brand-identity, design-user-experience

**Cascade impact:** Low (NOT read by Sessions 10-14)

**Action:** Regenerate Session 6 and related post-cascade extensions only

---

### If you modify `09b-application-architecture.md`:
**Direct impact:**
- (✓) Session 10 (backlog) - service/method implementation stories
- (✓) Session 12 (scaffold) - code skeleton generation

**Cascade impact:** Low (affects story granularity and code structure)

**Action:** Regenerate Sessions 10, 12

---

## Dependency Verification Checklist

When adding a new session or modifying an existing one:

1. **Identify inputs:**
   - [ ] Which previous outputs does this session need?
   - [ ] Do I need full files or context files?
   - [ ] What template(s) provide output structure?

2. **Verify context file usage:**
   - [ ] If reading 01, 02b, 07, 08, 09, 09b → use context files if available
   - [ ] Exception: Session 3 reads full 01 (needs market analysis)
   - [ ] Exception: Dev commands read full files (need implementation details)

3. **Document downstream impact:**
   - [ ] Which sessions read MY output?
   - [ ] Do I need to create a context file?
   - [ ] Which sections are critical for downstream consumers?

4. **Update this document:**
   - [ ] Add session to appropriate section
   - [ ] List all inputs with [FULL]/[CTX] notation
   - [ ] Document why context files vs full
   - [ ] Add to impact analysis section

5. **Test cascade flow:**
   - [ ] Does session generate journey-specific output?
   - [ ] Can downstream sessions consume my output?
   - [ ] Are token counts reasonable with context files?

---

## Token Budget Reference

Context files target **30-80% reduction** from full versions:

| File | Full Size | Context Size | Reduction | Primary Consumers |
|------|-----------|----------------|-----------|-------------------|
| 01-product-strategy | ~12KB | ~4KB | 65% | Sessions 4, 10, 12 |
| 02b-coding-standards | ~15KB | ~4.5KB | 70% | Sessions 4, 9b, 10, 12 |
| 07-database-schema | ~18KB | ~8KB | 56% | Sessions 8, 9, 9b, 10, 12 |
| 08-api-contracts | ~20KB | ~4KB | 80% | Sessions 9, 9b, 10, 12 |
| 09-test-strategy | ~12KB | ~4KB | 66% | Sessions 10, 12 |
| 09b-application-architecture | ~15KB | ~6KB | 60% | Sessions 10, 12 |

**Total savings in Session 10 (backlog):** ~40KB → ~15KB (62% reduction)
**Total savings in Session 12 (scaffold):** ~35KB → ~12KB (66% reduction)

---

## Quick Reference: Sacred Cascade Order

```
1  → refine-journey           00-user-journey.md
2  → create-product-strategy  01-product-strategy.md + context
2a → document-constraints     02a-constraints.md + context
3  → choose-tech-stack        02-tech-stack.md + context
3b → define-coding-standards  02b-coding-standards.md + context
3c → define-ai-integration-strategy  02c-ai-integration-strategy.md + context (optional)
4  → generate-strategy        03a-mission, 03b-metrics, 03c-monetization, 04-architecture + context
5  → create-brand-strategy    05-brand-strategy.md + context
6  → create-design            06-design-system.md + context
7  → design-database-schema   07-database-schema.md + context
8  → generate-api-design      08-api-design.md + context
8b → generate-api-contracts   08b-api-contracts.md + context
9  → create-test-strategy     09-test-strategy.md + context
9b → model-application        09b-application-architecture.md + context
10 → generate-backlog         10-backlog/
11 → create-gh-issues         (GitHub issues)
12 → scaffold-project         12-project-scaffold.md + code files
13 → plan-deployment          13-deployment-plan.md
14 → design-observability     14-observability-strategy.md
```

**Never skip sessions.** Each session reads outputs from previous sessions for context and coherence.

---

**Last Updated:** 2026-01-19
**Version:** 1.0
