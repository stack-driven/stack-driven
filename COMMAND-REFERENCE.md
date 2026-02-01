# Command Reference

Quick reference for all 38 Stack-Driven slash commands.

---

## Overview

Stack-Driven includes **38 slash commands** organized into four categories:

1. **Core Cascade Commands** (19) - Sequential framework sessions (1-14)
2. **Post-Cascade Extensions** (9) - Optional deep-dive sessions
3. **Meta Commands** (2) - Framework management
4. **Development Commands** (8) - Code review, implementation, and debugging workflow

**For detailed philosophy and cascade flow**, see README.md and CLAUDE.md.

---

## Quick Command Index

### Core Cascade (Sessions 1-14)

| Command | Session | Time | Output File(s) |
|---------|---------|------|----------------|
| `/refine-journey` | 1 | 30-45 min | `00-user-journey.md` + `.ctx.md` |
| `/create-product-strategy` | 2 | 45-60 min | `01-product-strategy.md` + `.ctx.md` |
| `/document-constraints` | 2a | 20-30 min | `02a-constraints.md` + `.ctx.md` |
| `/choose-tech-stack` | 3 | 15-20 min | `02-tech-stack.md` + `.ctx.md` |
| `/define-coding-standards` | 3b | 20-30 min | `02b-coding-standards.md` + `.ctx.md` |
| `/define-ai-integration-strategy` | 3c | 30-40 min | `02c-ai-integration-strategy.md` + `.ctx.md` |
| `/generate-strategy` | 4 | 45-60 min | `03a-mission.md` + `.ctx.md`, `03b-metrics.md` + `.ctx.md`, `03c-monetization.md` + `.ctx.md`, `04-architecture.md` + `.ctx.md` |
| `/create-brand-strategy` | 5 | 30-45 min | `05-brand-strategy.md` + `.ctx.md` |
| `/create-design` | 6 | 30-40 min | `06-design-system.md` + `.ctx.md` |
| `/design-database-schema` | 7 | 45-60 min | `07-database-schema.md` + `.ctx.md` (paradigm-agnostic) |
| `/generate-api-design` | 8 | 25 min | `08-api-design.md` + `.ctx.md` |
| `/generate-api-contracts` | 8b | 45-60 min | `08b-api-contracts.md` + `.ctx.md` |
| `/create-test-strategy` | 9 | 30-45 min | `09-test-strategy.md` + `.ctx.md` |
| `/model-application` | 9b | 45-60 min | `09b-application-architecture.md` + `.ctx.md` |
| `/generate-backlog` | 10 | 60-90 min | `10-backlog/*.md` (30-50 issues) |
| `/create-gh-issues` | 11 | 10-15 min | GitHub issues |
| `/scaffold-project` | 12 | 30-45 min | `12-project-scaffold.md`, code files in root |
| `/plan-deployment` | 13 | 30-45 min | `13-deployment-plan.md` |
| `/design-observability` | 14 | 30-45 min | `14-observability-strategy.md` |

**Total core cascade time:** 8-10 hours

### Post-Cascade Extensions (Optional)

| Command | When to Run | Time | Output File(s) |
|---------|-------------|------|----------------|
| `/discover-naming` | After Session 5 | 30-45 min | `15-brand-naming.md` |
| `/define-messaging` | After naming | 30-45 min | `16-brand-messaging.md` |
| `/design-brand-identity` | After messaging | 60-90 min | `17-brand-identity.md` |
| `/create-content-guidelines` | After messaging | 30-45 min | `18-content-guidelines.md` |
| `/design-user-experience` | After Session 4 | 60-90 min | `19-user-experience.md` |
| `/setup-analytics` | After Session 4 | 30-45 min | `20-analytics-plan.md` |
| `/design-growth-strategy` | After Session 4 | 60-90 min | `21-growth-strategy.md` |
| `/create-financial-model` | After Session 4 | 60-90 min | `22-financial-model.md` |
| `/create-compliance-plan` | After Session 2a or 10 | 45-60 min | `23-compliance-plan.md` |

### Meta Commands

| Command | When to Run | Purpose |
|---------|-------------|---------|
| `/cascade-status` | Anytime | Check cascade progress and what to do next |
| `/run-cascade` | Session 1 start | Automatically execute all sessions sequentially |

### Development Commands

| Command | When to Run | Purpose |
|---------|-------------|---------|
| `/validate-outputs` | During/after cascade | Validate cascade outputs for quality and completeness |
| `/review-code` | During development | Guide comprehensive code review |
| `/plan-issue [issue-number]` | Before implementation | Create detailed implementation plan for GitHub issue |
| `/implement-issue [issue-number]` | During development | Implement GitHub issue following approved plan and create PR |
| `/update-claudemd` | After code changes | Automatically update CLAUDE.md file based on recent code changes |
| `/fix-bug [issue-number]` | Bug reported in issue | Fix bugs using hypothesis-driven debugging with intelligent loop prevention |
| `/address-review [pr-number]` | PR has review feedback | Apply code review feedback directly to existing PR with test validation |
| `/distill-logs [file\|paste]` | Verbose error logs | Extract essential debugging info from verbose logs (500+ lines → 5-10 lines) |

---

## Understanding Context Files (.ctx.md)

**Universal Rule:** ALL sessions 1-9b create TWO files:
1. **Source file (.md)** - Complete documentation for humans (full rationale, alternatives, examples)
2. **Context file (.ctx.md)** - Condensed version for AI (60-70% token reduction, decisions only)

### Why Context Files Exist

**Token Efficiency:** Session 10 (`/generate-backlog`) reads outputs from ALL previous sessions:
- Without .ctx.md: ~40K tokens (expensive, slow)
- With .ctx.md: ~15K tokens (62% reduction)

**What Gets Removed:** Rationale, alternatives, detailed examples, validation checklists
**What Gets Kept:** ALL architectural decisions, tech choices, design specs, schemas, API contracts

### Which Sessions Create .ctx.md Files?

**Sessions 1-9b (ALL create .ctx.md):**
- `00-user-journey.ctx.md` - Journey steps, value quantification
- `01-product-strategy.ctx.md` - Vision, goals, positioning
- `02-tech-stack.ctx.md` - Tech choices with 1-2 line justifications
- `02a-constraints.ctx.md` - Business/technical/organizational limits
- `02b-coding-standards.ctx.md` - Framework patterns, file organization
- `02c-ai-integration-strategy.ctx.md` - AI provider, model, patterns (optional)
- `03a-mission.ctx.md`, `03b-metrics.ctx.md`, `03c-monetization.ctx.md`, `04-architecture.ctx.md`
- `05-brand-strategy.ctx.md`, `06-design-system.ctx.md`
- `07-database-schema.ctx.md`, `08-api-design.ctx.md`, `08b-api-contracts.ctx.md`
- `09-test-strategy.ctx.md`, `09b-application-architecture.ctx.md`

**No .ctx.md for final outputs (Sessions 10-14):** User stories, scaffold docs, deployment/observability plans

### When to Read Which Version?

**Simple Rule:** Sessions ALWAYS read `.ctx.md` when available (Sessions 2-14).

**Exception:** Only read full `.md` for validation (`/validate-outputs`), user requests to explain decisions, or manual human review.

**See CLAUDE.md** for complete decision matrix showing which file version each session reads.

---

## Core Cascade Commands (Sessions 1-14)

### Session 1: `/refine-journey` (30-45 min)
Define user journey through 21 progressive questions (including Phase 1b: Behavioral Profile). Creates persona, pain points, user behavioral characteristics (tech proficiency, device preference, learning style, communication preferences, onboarding expectations), aha moment (value delivery step), and quantified value ratio (e.g., "4 hours → 60 seconds = 240x faster"). Start here—everything flows from this. Outputs: `00-user-journey.md` + `.ctx.md`

### Session 2: `/create-product-strategy` (45-60 min)
Validate journey with market analysis (TAM/SAM/SOM), competitive positioning, strategic vision, and product roadmap. Reads journey file. Outputs: `01-product-strategy.md` + `.ctx.md`

### Session 2a: `/document-constraints` (20-30 min)
Document real-world constraints (technical: team skills, budget; organizational: timeline, team size; compliance: HIPAA, GDPR). Identifies journey-optimal vs. constraint-realistic trade-offs. Reads journey + strategy. Outputs: `02a-constraints.md` + `.ctx.md`

### Session 3: `/choose-tech-stack` (15-20 min)
AI analyzes journey requirements and recommends optimal tech stack (frontend, backend, database, hosting) with reasoning. Detects if AI integration required (does NOT choose AI provider—that's Session 3c). Reads journey + strategy + constraints (if exists). Outputs: `02-tech-stack.md` + `.ctx.md`

### Session 3b: `/define-coding-standards` (20-30 min)
Framework-specific patterns (React hooks, FastAPI services), file organization, cross-stack naming conventions (DB ↔ API ↔ frontend), testing patterns. Reads journey + strategy + tech stack. Outputs: `02b-coding-standards.md` + `.ctx.md`

### Session 3c: `/define-ai-integration-strategy` (30-40 min)
**Optional—only if AI in tech stack.** Makes ALL AI decisions: provider (OpenAI/Anthropic/other), model selection, implementation pattern (Direct API/RAG/Function Calling/Agents), cost projections, security guardrails. Updates `02-tech-stack.md` with AI choices. Reads journey + strategy + tech stack. Outputs: `02c-ai-integration-strategy.md` + `.ctx.md`

### Session 4: `/generate-strategy` (45-60 min)
Derive mission (from aha moment), North Star metric (measures mission), pricing strategy (aligned with value), architecture principles (journey-optimized). Reads journey through constraints + coding standards + AI strategy (if exists). Outputs: `03a-mission.md` + `.ctx.md`, `03b-metrics.md` + `.ctx.md`, `03c-monetization.md` + `.ctx.md`, `04-architecture.md` + `.ctx.md`

### Session 5: `/create-brand-strategy` (30-45 min)
Brand positioning, personality, voice guidelines aligned with user persona and journey value. Reads journey through architecture. Outputs: `05-brand-strategy.md` + `.ctx.md`

### Session 6: `/create-design` (30-40 min)
Design system (colors, typography, components) optimized for specific user flows—not generic design system. Components map to journey steps. Reads journey through brand. Outputs: `06-design-system.md` + `.ctx.md`

### Session 7: `/design-database-schema` (45-60 min)
Complete database schema design. **Paradigm-agnostic:** supports relational (PostgreSQL ERD, tables, foreign keys), document (MongoDB collections, embedded vs referenced), graph (Neo4j nodes/relationships), time-series (InfluxDB measurements), key-value (Redis patterns). Includes indexes, constraints, migrations. Reads journey through design. Outputs: `07-database-schema.md` + `.ctx.md`

### Session 8: `/generate-api-design` (25 min)
High-level API architecture: paradigm choice (REST/GraphQL/gRPC/WebSocket), serialization format (JSON/Protobuf), auth/authorization approach, rate limiting, pagination. **NEW in 2025:** OWASP API Security Top 10 2023 protection patterns (BOLA, property-level authorization, BFLA, business flow abuse, SSRF, security misconfiguration, unsafe third-party consumption), input validation strategy, HTTP caching (ETag, Cache-Control, compression), idempotency/retry patterns, circuit breakers, security headers (HSTS, CSP). Reads journey + tech stack + architecture + database schema. Outputs: `08-api-design.md` + `.ctx.md`

### Session 8b: `/generate-api-contracts` (45-60 min)
Complete OpenAPI 3.0 specification with all endpoints, request/response schemas, authentication, error handling. Every journey step has API support. Reads API design + journey + database schema + tech stack + architecture. Outputs: `08b-api-contracts.md` + `.ctx.md`

### Session 9: `/create-test-strategy` (30-45 min)
Comprehensive testing strategy (unit, integration, E2E, performance). Focus on critical journey paths. Coverage targets (~80%), testing frameworks, CI/CD integration. Reads journey through API contracts. Outputs: `09-test-strategy.md` + `.ctx.md`

### Session 9b: `/model-application` (45-60 min)
Model application architecture layer: services, repositories, controllers based on database schema and API contracts. Defines class structures, method signatures, dependency injection patterns. Reads journey + tech stack + coding standards + architecture + database schema + API contracts. Outputs: `09b-application-architecture.md` + `.ctx.md`

### Session 10: `/generate-backlog` (60-90 min)
Generate 30-50 prioritized user stories with RICE scores (Reach, Impact, Confidence, Effort), P0/P1/P2 labels, dependencies. Every story traces to journey step. **Reads ALL .ctx.md files from Sessions 1-9b** (maximum token efficiency). Outputs: `10-backlog/*.md`

### Session 11: `/create-gh-issues` (10-15 min)
Push all backlog stories to GitHub as issues with proper labels (P0, P1, P2), milestones, project board organization. Reads backlog directory. Outputs: GitHub issues in repository

### Session 12: `/scaffold-project` (30-45 min)
Generate working development environment: package manager configs (package.json/pyproject.toml), Docker Compose, environment templates, CI/CD pipeline (GitHub Actions), setup docs. **Generates code skeletons** in repository root (services, repositories, controllers, tests from Session 9b). Reads ALL .ctx.md files including API contracts and application architecture. Outputs: `12-project-scaffold.md`, config files in root

### Session 13: `/plan-deployment` (30-45 min)
Deployment strategy: environments (dev/staging/prod), CI/CD workflow, infrastructure requirements, monitoring integration, rollback procedures, cost estimates. Reads tech stack + architecture + metrics. Outputs: `13-deployment-plan.md`

### Session 14: `/design-observability` (30-45 min)
Monitoring strategy (metrics, logs, traces), alerting rules, SLO/SLI definitions, incident response procedures, dashboard designs, performance budgets. Monitor journey critical paths. Reads journey + metrics + deployment plan. Outputs: `14-observability-strategy.md`

---

## Post-Cascade Extensions (Optional)

### `/discover-naming` (30-45 min)
Generate 20-30 brand name candidates with evaluation criteria, domain availability checks, trademark considerations. Run after Session 5. Outputs: `15-brand-naming.md`

### `/define-messaging` (30-45 min)
Brand messaging framework: hierarchy, value propositions for different audiences, voice/tone guidelines, key messages. Run after naming or Session 5. Outputs: `16-brand-messaging.md`

### `/design-brand-identity` (60-90 min)
Comprehensive brand identity: logo concepts, color system, typography, visual language, brand guidelines. Run after messaging. Outputs: `17-brand-identity.md`

### `/create-content-guidelines` (30-45 min)
Content style guide, microcopy patterns (buttons, errors, success messages), editorial guidelines, SEO considerations. Run after messaging. Outputs: `18-content-guidelines.md`

### `/design-user-experience` (60-90 min)
Detailed UX research plan, user flows, wireframes for key screens, interaction specifications, usability testing criteria. Run after Session 4. Outputs: `19-user-experience.md`

### `/setup-analytics` (30-45 min)
Analytics implementation plan: tool recommendations, event tracking plan, funnel analysis setup, dashboard designs, privacy/compliance considerations. Run after Session 4. Outputs: `20-analytics-plan.md`

### `/design-growth-strategy` (60-90 min)
Data-driven growth strategy: acquisition channel analysis, growth loops identification, experiment roadmap, channel-specific tactics, CAC/LTV projections. Run after Session 4. Outputs: `21-growth-strategy.md`

### `/create-financial-model` (60-90 min)
Comprehensive financial model: unit economics (CAC, LTV, payback), revenue projections (3-5 years), cost structure analysis, scenario planning, fundraising considerations. Run after Session 4. Outputs: `22-financial-model.md`

### `/create-compliance-plan` (45-60 min)
Compliance implementation roadmap for compliance-heavy products (healthcare, fintech, enterprise B2B). Identifies applicable regulations (GDPR, HIPAA, SOC2, PCI-DSS, CCPA, ISO 27001) based on journey geography and data types. Generates detailed requirements by regulation (article/section-level), compliance-to-implementation mapping (journey → requirement → technical implementation), compliance backlog stories with RICE prioritization, compliance monitoring strategy (for Session 14 integration), compliance roadmap by stage (MVP → Growth → Scale), and cost estimates (legal, engineering, certification). Reads journey, product strategy, constraints, database schema, API design, and backlog to create comprehensive compliance plan. Run after Session 2a (constraints) or Session 10 (backlog). Outputs: `23-compliance-plan.md`

---

## Meta & Development Commands

### `/cascade-status`
Check cascade progress anytime. Shows completed sessions, what comes next, cascade flow, inputs/outputs for each session, missing dependencies. Informational only (no files created). Use when starting framework, lost track, or need to know next step.

### `/run-cascade`
Automatically execute all sessions sequentially from current progress point. Pauses at major milestones for review. Handles dependencies. Can resume after interruptions. Use for rapid progress vs. manual step-by-step. Full cascade: 8-10 hours (can pause/resume).

### `/validate-outputs`
Validate all cascade outputs against Stack-Driven quality standards. Checks: journey alignment (decisions trace to user value), philosophy adherence (user-first, generative), completeness (template sections filled, alternatives considered), consistency (cross-file references match), specificity (concrete vs. generic), technical soundness (proper indexes, error handling, SLOs). Provides actionable recommendations. Run after key milestones (Sessions 4, 10, 14) or before sharing with team.

### `/review-code`
Guide comprehensive code review with quality framework. Checks alignment with architecture principles, design system, API contracts, testing strategy. Reviews security vulnerabilities, performance issues, code quality, journey alignment. Use when reviewing PRs or before deployment.

### `/plan-issue [issue-number]`
Fetch GitHub issue details, load relevant product-guidelines (.ctx.md files: tech-stack, coding-standards, conditionally architecture/design/database/API based on issue type), create detailed implementation plan. Plan posted to issue as comment for approval. Run before implementation.

**Third-Party Integration Research (Automatic):**
When detecting new library/SDK integration, automatically performs 2-3 minute research phase:
- Finds official documentation (not blog posts)
- Identifies officially recommended packages/SDKs
- Documents critical gotchas (script placement, performance, breaking changes)
- Compares 2-3 implementation approaches with pros/cons
- Embeds findings in implementation plan for human review

Prevents trial-and-error implementations (Calendly 12-commit disaster → 1-commit success).

### `/implement-issue [issue-number]`
Fetch approved plan from issue comments, create branch `[number]-slug`, implement following plan exactly, commit with "feat: description (closes #[number])", create PR with "Closes #[number]". Uses plan as complete context (plan already contains necessary guidelines). Run after plan approved.

### `/update-claudemd`
Automatically update CLAUDE.md file based on recent code changes. Analyzes git diff, updates repository architecture, command structure, design patterns sections. Maintains CLAUDE.md accuracy as codebase evolves. Run after significant code changes.

---

## Command Workflows

### Minimum Viable Cascade (3 hours)

Essential sessions only:

```bash
/refine-journey          # 45 min
/create-product-strategy # 45 min
/choose-tech-stack       # 20 min
/generate-strategy       # 60 min
```

**Result:** Strategic foundation (journey, market, tech, mission, metrics, monetization, architecture)

---

### Complete Core Cascade (8-10 hours)

All core sessions:

```bash
/refine-journey
/create-product-strategy
/document-constraints       # Optional but recommended
/choose-tech-stack
/define-coding-standards
/define-ai-integration-strategy  # Only if AI in stack
/generate-strategy
/create-brand-strategy
/create-design
/design-database-schema
/generate-api-design
/generate-api-contracts
/create-test-strategy
/model-application
/generate-backlog
/create-gh-issues
/scaffold-project
/plan-deployment
/design-observability
```

**Result:** Production-ready system from idea to deployment + monitoring + code skeletons

---

### Full Framework + Extensions (12-15 hours)

Core + selected extensions:

```bash
# Core cascade (8-10 hours)
/refine-journey ... /design-observability

# Branding extensions (3-4 hours)
/discover-naming
/define-messaging
/design-brand-identity
/create-content-guidelines

# Growth extensions (2-3 hours)
/design-growth-strategy
/create-financial-model
/setup-analytics
```

**Result:** Complete product, brand, and growth strategy

---

### Rerunning Sessions

Any session can be re-run to regenerate outputs:

```bash
# Initial run
/refine-journey

# ... later, after user interviews ...
# Refine and regenerate
/refine-journey        # Updates journey
/choose-tech-stack     # Regenerates with new journey
/generate-strategy     # Regenerates with new tech
# etc.
```

**Cascade automatically updates downstream sessions.**

---

### Partial Cascade Examples

**Just want tech stack recommendation?**
```bash
/refine-journey
/choose-tech-stack
```

**Just want backlog?**
```bash
/refine-journey
/create-product-strategy
/choose-tech-stack
/generate-strategy
/generate-backlog
```

**Just want development environment?**
```bash
# Complete Sessions 1-11 first
/scaffold-project
```

---

## Troubleshooting

### "I don't see my output files"

Output files are saved to `product-guidelines/` (gitignored by default).

```bash
ls product-guidelines/
```

---

### "Command says it can't find previous session file"

You may have skipped a required session. Run `/cascade-status` to see what's missing.

```bash
/cascade-status
```

---

### "I want to change a previous decision"

Re-run the session that made that decision. Downstream sessions will automatically reference the updated file.

```bash
# Change tech stack
/choose-tech-stack  # Make different choices

# Regenerate strategy with new tech
/generate-strategy
```

---

### "Session output doesn't match my needs"

Provide more specific constraints when running the command:
- Mention team capabilities ("we're Python experts")
- State limitations ("budget is $50/month")
- Reference specific requirements from journey

You can also edit the output files directly and re-run downstream sessions.

---

## Additional Resources

- **README.md** - Framework overview and philosophy
- **CLAUDE.md** - Detailed codebase instructions for Claude Code
- **CASCADE-DEPENDENCIES.md** - Visual dependency map showing which sessions read which files
- **PHILOSOPHY.md** - Framework principles and architecture (if exists)
- **TROUBLESHOOTING.md** - Common issues and solutions (if exists)

For detailed guidance on creating new slash commands that integrate with the cascade, see command files in `.claude/commands/`.

---

**Last Updated:** 2025-01-30
**Version:** 2.0.0

**Remember:** This is a quick reference. For detailed instructions, run individual commands or see CLAUDE.md.
