# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## What is Stack-Driven?

Stack-Driven is a **generative product development framework** that guides users through a cascading system of 14 progressive sessions, transforming a user journey into a production-ready system with complete technical specifications. Unlike prescriptive templates, Stack-Driven analyzes each user's specific journey and derives optimal decisions for tech stack, strategy, architecture, and implementation.

**Core Philosophy:**
1. **User journey comes first** - Everything flows from understanding users, not technology
2. **Cascading decisions** - Each session reads previous outputs, maintaining coherence
3. **Generative, not prescriptive** - AI analyzes requirements and recommends optimal solutions
4. **Traced to value** - Every decision references specific user value
5. **Journey-driven tech choices** - Stack chosen based on journey requirements, not trends

---

## Development Commands

### Testing & Validation
```bash
# Validate cascade outputs for quality and completeness
/validate-outputs

# Check cascade progress and next steps
/cascade-status

# Review code during development
/review-code
```

No traditional build/test commands - this is a prompt-driven framework executed through Claude Code slash commands.

---

## Repository Architecture

### Core Structure

**`/.claude/commands/`** - The slash commands that power the framework (38 total)
- Core cascade: 19 session commands (refine-journey → design-observability, including optional sessions)
- Post-cascade extensions: 9 optional deep-dive commands (naming, UX, analytics, growth, compliance)
- Meta commands: cascade-status, run-cascade
- Dev commands: validate-outputs, review-code, implement-issue, plan-issue, update-claudemd, fix-bug, address-review, distill-logs
- Each command is a markdown file with detailed prompts for Claude

**`/.claude/agents/`** - Specialized sub-agents for complex operations
- Agents invoked via Task tool by commands for specific workflows
- **CRITICAL ARCHITECTURAL PRINCIPLE**: Commands >400 lines MUST decompose into sub-agents with conditional loading (see "Command Size Policy" below)
- **Context & Utility Agents:**
  - distill-context.md: Condenses .md files to .ctx.md (60-70% token reduction)
  - track-failures.md: Records debugging attempts, detects duplicates, triggers escalation
  - validate-progress.md: Analyzes debugging progress (ADVANCING/UNCLEAR/STUCK)
  - summarize-logs.md: Extracts essential info from verbose logs (99%+ reduction)
- **API Contracts Phase Agents** (Session 8b - conditional loading):
  - api-contracts-phase1-security.md: PII marking, GDPR compliance, type mapping, validation (always required)
  - api-contracts-phase2-versioning.md: Breaking changes, migration strategies, Protobuf evolution (always required)
  - api-contracts-phase3-performance.md: Compression, caching, response limits (conditional: mobile/high-traffic only)
  - api-contracts-phase4-codegen.md: SDK generation, contract testing, Session 12 integration (always required)
  - api-contracts-phase5-formats.md: GraphQL SDL, MessagePack, CBOR, hybrid architectures (conditional: non-REST only)
- Each agent has specific role, inputs, and structured output format

**`/templates/`** - Template files used by commands to generate user outputs
- One template per output file (e.g., `00-user-journey-template.md`)
- Include structured interview template for Session 1
- Define output structure, validation criteria, and quality standards
- Commands READ templates to know what to generate

**`/product-guidelines/`** - **GITIGNORED** - User-specific generated outputs
- Each user generates their own cascade (not committed to repo)
- Contains 00-22.md files as users progress through sessions
- Session outputs: user-journey, product-strategy, tech-stack, mission, metrics, etc.
- Scaffold subdirectory: actual code files (package.json, docker-compose.yml, etc.)

**`/examples/`** - Reserved for future reference implementations
- Directory structure maintained for future examples
- Will demonstrate how different journeys lead to different tech stacks

**`/aspects/`** - High-level framework documentation (13 aspects)
- Explains concepts like core-design, style-guide, user-journey, backlog-organization
- Reference material, not prescriptive guides
- Provides context for the philosophy behind the framework

**`/reference-material/`** - Educational guides and reference documentation
- Standalone educational resources not tied to specific cascade sessions
- Referenced by commands but not generated as cascade outputs
- **Testing Guides:** property-based-testing-guide.md, integration-testing-patterns.md, accessibility-testing-guide.md, performance-testing-guide.md, security-testing-guide.md
- **AI/API Guides:** API security fundamentals, serialization guide, AI best practices, AI debugging framework
- These guides provide foundational knowledge that can be consulted at any time

**`/.claude/memory/`** - **GITIGNORED** - Debugging tracking state
- Stores user-specific debugging attempt history (not committed to repo)
- Generated by `/fix-bug` command automatically
- Contains: `issue-{number}-attempts.json` files with hypothesis tracking
- Separate from product-guidelines (debugging state vs product decisions)
- Enables persistent tracking across sessions while preventing circular loops

---

## How Commands Work

### The Cascade Order (Sacred Sequential Flow)

The cascade order is **sacred** - user journey comes first, everything flows from it. See "Quick Reference: Session Dependencies" section below for complete cascade flow.

**Key Dependencies:**
- Session 2a (constraints) reads 00-journey + 01-strategy
- Session 3 (tech-stack) reads 00-journey + 01-strategy + 02a-constraints (if exists); **ONLY detects if AI is required**, does NOT choose AI provider; **Detects i18n requirement** from constraints and selects i18n library; **NEW in 2025**: Generates state management (client/server/form), build tooling (build tool, package manager, testing, code quality), and auth provider decisions
- Session 3b (coding-standards) reads 00-journey + 01-strategy + 02-tech-stack
- Session 3c (ai-integration-strategy) reads 00-journey + 01-strategy + 02-tech-stack (optional: only if "AI Integration: Required" in tech stack); **makes ALL AI decisions** (provider, model, pattern) and **updates tech stack file**
- Session 4 (generate-strategy) reads 00-02a (if exists) + 02b + (02c if it exists); generates mission, metrics (with L0→L1→L2→L3 hierarchy), monetization, architecture, and analytics implementation strategy
- **Session 7 (database-schema)** checks 02a-constraints for i18n requirement → generates translation tables and locale columns if needed
- **Session 8 (api-design)** checks 02a-constraints for i18n requirement → adds Accept-Language header support and locale fallback strategy if needed; **NEW in 2025**: Integrates OWASP API Security Top 10 2023 protection patterns (BOLA, property-level auth, BFLA, business flow abuse, SSRF, security misconfiguration, unsafe third-party consumption), input validation strategy, HTTP caching strategy (ETag, Cache-Control, compression), idempotency/retry patterns, and circuit breakers
- Session 8b (api-contracts) reads 08-api-design + 00-journey + 02-tech-stack + 04-architecture + 07-database-schema.ctx.md
- Session 9b (application-architecture) reads 00-journey + 02-tech-stack + 02b-coding-standards.ctx.md + 04-architecture + 07-database-schema.ctx.md + 08b-api-contracts.ctx.md
- **Session 10 (backlog)** checks 02a-constraints for i18n requirement → generates i18n infrastructure stories (translation setup, locale switching UI, string extraction) if needed
- **Session 12 (scaffold)** checks 02a-constraints for i18n requirement → generates `/locales/` folder structure, translation files, and i18n config if needed

**Never skip sessions** - later sessions need previous outputs for context.

**Constraint Propagation Patterns:**

- **i18n/l10n** (when Session 2a marks required): S3 selects library → S7 adds locale columns/translation tables → S8 adds Accept-Language headers → S10 generates i18n stories → S12 generates `/locales/` structure
- **Third-party integrations** (when Session 2a specifies): S3 selects SDKs → S4 includes integration patterns → S7 generates integration tables (`integration_credentials`, `sync_jobs`, `webhook_events`) → S8/8b designs webhook endpoints → S10 generates integration stories → S12 generates adapter skeletons
- **AI integration** (when Session 3 detects): S3c makes ALL AI decisions (provider, model, pattern) and updates tech stack → propagates through S4 (architecture), S7 (vector storage if needed), S10 (AI stories)

### Checkpoint System (Critical Decision Validation)

Stack-Driven implements **Human-in-the-Loop (HITL) checkpoints** at critical cascade sessions where decisions have significant downstream impact. These checkpoints pause execution for user review before cascading decisions flow to later sessions.

**Checkpoints are implemented at:**
- **Session 3** (`/choose-tech-stack`) - Tech stack validation
- **Session 4** (`/generate-strategy`) - Mission, metrics (framework + hierarchy), monetization, architecture, analytics validation
- **Session 7** (`/design-database-schema`) - Database schema validation
- **Session 10** (`/generate-backlog`) - Backlog quality validation

**Why checkpoints matter:**
Decisions made in Sessions 3, 4, 7, and 10 cascade through all remaining sessions. For example:
- Session 4 mission → informs Session 5 brand strategy, Session 6 design system
- Session 7 schema → informs Session 8 API design, Session 10 backlog stories, Session 12 scaffold
- Session 10 backlog → determines implementation order and effort estimates

Early validation prevents hours of downstream rework if issues exist.

**Checkpoint structure:**
Each checkpoint includes:
1. **Completion confirmation** - "Session X complete! [What was established]"
2. **Review checklist** - Session-specific validation criteria (journey alignment, completeness, etc.)
3. **Cascade explanation** - What happens next, which sessions depend on these decisions
4. **Rollback instructions** - How to regenerate if issues found (`/[session-name]` to re-run)
5. **Continue prompt** - User types "continue" to proceed to next session

**Design rationale:**
Checkpoints implement Human-in-the-Loop (HITL) pattern from agentic coding research. By pausing at decision boundaries, users can:
- Review outputs before they become inputs to downstream processes (Reflection pattern)
- Catch errors early when they're cheap to fix (vs. late when cascade has progressed)
- Understand context flow (semantic, lineage, operational, policy dimensions)
- Maintain control over generative process (user validates, AI generates)

This aligns with Stack-Driven's Grade A+ HITL implementation at agent boundaries (plan→implement→review), extending the pattern deeper into the cascade workflow.

### Command Execution Pattern

Each command follows this pattern:
1. **Read previous outputs** from `product-guidelines/` directory
2. **Read template file** from `/templates/` for structure
3. **Analyze and generate** specific recommendations based on journey
4. **Write output file** to `product-guidelines/`
5. **Tell user what to run next**

### Meta Commands

**`/cascade-status`** - Check progress and get next step
- Lists all sessions with [COMPLETE] or [NOT STARTED]
- Shows which files exist in `product-guidelines/`
- Recommends exactly which command to run next
- Explains inputs, outputs, and estimated time

**`/run-cascade`** - Automated sequential execution
- Detects current progress
- Executes sessions automatically in sequence
- Pauses at major milestones for user confirmation
- Handles interruptions gracefully (resume later)

### Development Commands

**`/plan-issue [issue-number]`** - Create implementation plan for GitHub issue
- Fetches issue details via `gh` CLI
- Analyzes issue and creates comprehensive implementation plan
- **NEW:** Automatically researches third-party integrations (official docs, gotchas, approaches)
- Posts plan with research findings to GitHub issue for approval
- Loads relevant product-guidelines context based on issue type

**`/implement-issue [issue-number]`** - Implement GitHub issue
- Fetches issue details via `gh` CLI
- Reads approved plan from issue comments
- Loads relevant product-guidelines for context (tech-stack, design-system, etc.)
- Creates issue-linked branch: `[number]-issue-slug`
- Implements following plan exactly
- Creates PR with "Closes #[number]"

**`/review-pr [PR-number]`** - Review GitHub PR with framework validation and automated posting
- Fetches PR details and diff via `gh` CLI
- Three-layer review architecture:
  - **Layer 1:** Framework validation using VALIDATION-CHECKLIST.md with smart rule detection
  - **Layer 2:** PR quality checks (linked issue, CI status, commit messages, diff scope)
  - **Layer 3:** Code quality review (security, performance, testing, error handling)
- Reports pass/fail status for applicable VALIDATION-CHECKLIST rules
- Generates structured review with prioritized feedback (High/Medium/Low)
- Posts review as GitHub comment automatically
- Tracks review iterations (warns after 5 rounds to prevent fatigue)
- Use `/review-code` for general code review without GitHub posting

**`/validate-outputs`** - Quality assurance for cascade outputs
- Reads ALL files in `product-guidelines/`
- Validates against quality criteria:
  - Journey alignment (decisions trace to user value)
  - Philosophy adherence (user-first, generative, journey-driven)
  - Completeness (all template sections filled)
  - Consistency (cross-file alignment)
  - Specificity vs genericity (concrete, not abstract)
  - Technical soundness (indexes, error handling, SLOs)
- Generates detailed quality report with prioritized recommendations
- Suggests which sessions to regenerate

---

## Key Design Patterns

### 1. Generative Cascade Architecture

Each command is a **generative session**, not a template filler:
- Commands analyze user's SPECIFIC journey
- Recommendations are derived from requirements, not prescribed
- Same cascade, different journeys → different outputs

### 2. Progressive Interrogation (Session 1)

Session 1 uses **structured interview framework** (`/templates/00-user-journey-interview-template.md`):
- 21 progressive questions in 4 phases (including Phase 1b: Behavioral Profile)
- One question at a time, adaptive based on answers
- Extracts human need, not solution idea
- Captures behavioral characteristics (tech proficiency, device preference, learning style, communication preferences, onboarding expectations) that drive technical decisions in Sessions 3, 6, 8, 12
- Quantifies value ratio (e.g., "4 hours → 60 seconds = 240x faster")
- Validates completeness (including behavioral profile) before generating output

### 3. Journey Traceability

Every decision must trace back to user journey:
- Tech choice? "PostgreSQL because journey needs complex relationships with JSONB flexibility for compliance frameworks"
- Feature priority? "Serves Step 2 of journey (document upload → assessment)"
- Design decision? "Blue conveys trustworthy professional for compliance officers"

**Validation check:** Could this decision apply to a different product? If yes, it's too generic.

### 4. Context Files Pattern

**UNIVERSAL RULE: ALL sessions 1-9b create TWO files:**
- **Full version (.md)**: Complete detailed specification for humans
- **Context file (.ctx.md)**: Condensed for AI consumption by later sessions

**ALL sessions 1-9b have context files:**
- `00-user-journey.md` + `00-user-journey.ctx.md` (70% reduction)
- `01-product-strategy.md` + `01-product-strategy.ctx.md` (65% reduction)
- `02-tech-stack.md` + `02-tech-stack.ctx.md` (65% reduction)
- `02a-constraints.md` + `02a-constraints.ctx.md` (70% reduction)
- `02b-coding-standards.md` + `02b-coding-standards.ctx.md` (70% reduction)
- `02c-ai-integration-strategy.md` + `02c-ai-integration-strategy.ctx.md` (70% reduction)
- `03a-mission.md` + `03a-mission.ctx.md` (65% reduction)
- `03b-metrics.md` + `03b-metrics.ctx.md` (65% reduction)
- `03c-monetization.md` + `03c-monetization.ctx.md` (65% reduction)
- `03d-analytics-strategy.md` + `03d-analytics-strategy.ctx.md` (65% reduction)
- `04-architecture.md` + `04-architecture.ctx.md` (60% reduction)
- `05-brand-strategy.md` + `05-brand-strategy.ctx.md` (65% reduction)
- `06-design-system.md` + `06-design-system.ctx.md` (60% reduction)
- `07-database-schema.md` + `07-database-schema.ctx.md` (56% reduction)
- `08-api-design.md` + `08-api-design.ctx.md` (60-65% reduction, high decision density from security/resilience enhancements)
- `08b-api-contracts.md` + `08b-api-contracts.ctx.md` (80% reduction)
- `09-test-strategy.md` + `09-test-strategy.ctx.md` (66% reduction)
- `09b-application-architecture.md` + `09b-application-architecture.ctx.md` (60% reduction)

**NO context files for final outputs (sessions 10-14):**
- `10-backlog/` - User stories are already concise (Session 11 reads directly from backlog files)
- Session 11 - No output file (pushes Session 10 issues to GitHub via `gh` CLI)
- `12-project-scaffold.md` - Final scaffold documentation
- `13-deployment-plan.md` - Final deployment plan
- `14-observability-strategy.md` - Final observability strategy

**Why this universal approach?**
1. **Consistency** - No complex decision matrix needed
2. **Future-proof** - If a new session needs file X, .ctx.md already exists
3. **Token efficiency everywhere** - Any command loading guidelines gets optimized context
4. **Simpler mental model** - "Full .md for humans, .ctx.md for AI" applies universally

**How context files are generated:**
Context files are automatically created using the **distillation sub-agent** (`.claude/agents/distill-context.md`):
1. Session command generates full source file (`.md`)
2. Command invokes distillation agent with source and output paths
3. Agent applies universal extraction rules with **critical preservation**:
   - **KEEP:** ALL architectural decisions, user journey steps, tech choices, design specs (including DTCG token hierarchies, WCAG 2.2 criteria, performance configs), constraints, database schemas, API specifications
   - **REMOVE:** Rationale (keep 1-2 line summaries), alternatives considered, detailed examples, validation checklists
4. Agent preserves source file structure, achieves 60-70% token reduction (Note: Session 6 design-system may achieve 55-65% reduction due to preserving detailed DTCG token hierarchies, WCAG 2.2 tables, and performance optimization configs)
5. Agent validates ALL critical decisions preserved before writing

### 5. Simplified Decision Matrix: When to Read .ctx.md vs .md

**UNIVERSAL RULE: Sessions ALWAYS read .ctx.md when available (all sessions 1-9b have .ctx.md files).**

**Read .ctx.md (Default for ALL Cascade Sessions):**

ALL sessions 2-14 read `.ctx.md` versions of previous sessions 1-9b:
- **Token efficiency** - 60-70% reduction per file, cumulative savings across cascade
- **Decisions only** - No rationale, alternatives, or explanations needed
- **Consistency** - Simple rule: if .ctx.md exists, read it
- **Performance** - Faster execution, lower costs, better context window usage

**Exception: Read Full .md Only When:**
- User explicitly requests full document review
- `/validate-outputs` command (needs rationale to check quality)
- Understanding "why" decisions were made (design reviews, challenges)
- Manual human review and stakeholder communication

### 6. Quality Validation Framework

`/validate-outputs` checks for:
- **Journey alignment** (critical): References specific journey steps, quantified value ratio
- **Philosophy adherence** (critical): User-first thinking, generative approach
- **Specificity** (critical): Named personas, concrete examples (not "users want better experience")
- **Completeness** (important): "What We DIDN'T Choose" sections with 2+ alternatives
- **Consistency** (important): Tech aligns with journey, mission aligns with aha moment
- **Technical soundness** (important): Indexes in schemas, error responses in APIs, SLO/SLI in observability

### 7. Issue Implementation Pattern

See "Development Commands" section above for full details on `/plan-issue`, `/implement-issue`, and `/review-pr` workflows.

---

## Working with This Repository

### When Making Changes to Commands

**Understand the cascade dependencies:**
- If you modify Session 1 output structure, update sessions that read it (2, 3, 4, 10)
- If you modify Session 7 (database-schema), update Session 8b (api-contracts) that depends on it
- Context files must stay condensed for token efficiency

**Test with actual journey:**
- Don't test with generic examples
- Use a real, specific journey (e.g., "Compliance officers reviewing 100-page documents")
- Verify outputs are journey-specific, not templated

### When Adding New Commands

**Follow naming convention:**
- Session commands: `verb-noun.md` (e.g., `refine-journey.md`, `create-design.md`)
- Use description in YAML frontmatter for `/help` output

**Follow command structure:**
```markdown
---
description: Brief description for command list
---

# Title

## Your Role
[What Claude's role is]

## Critical Philosophy
[Key principles to follow]

## Steps to Execute
[Detailed step-by-step instructions]

## Output Format
[What to generate]
```

**Test cascade integration:**
- Which previous files does this read?
- Which files does this create?
- Where does this fit in cascade order?
- Update `/cascade-status` logic if needed

### When Adding Templates

Templates should include:
- Clear section headings
- Validation criteria (what makes "excellent" vs "needs work")
- "What We DIDN'T Choose" sections for major decisions
- Examples of journey traceability
- Reminder to be specific, not generic

### Understanding Philosophy

**We reject:**
- One-size-fits-all stacks
- Technology-first thinking
- Resume-driven development
- Arbitrary decisions without reasoning
- Generic advice that could apply to any product

**We believe:**
- User experience is the foundation
- Journey dictates stack
- Every decision traces to value
- Boring is beautiful (proven tech over exotic)
- Generative > Prescriptive
- Focus is the ultimate advantage

---

## Common Patterns to Maintain

### 1. Journey-First Validation
When reviewing PRs or adding features, always ask:
- Does this maintain journey-first philosophy?
- Could this lead to technology-first thinking?
- Does it encourage tracing decisions to user value?

### 2. Specificity Over Genericity
Outputs should NEVER be copy-pasteable between products:
- Bad: "Users want to save time"
- Good: "Compliance officers spend 4 hours reviewing documents → 60 seconds with AI"

### 3. Decision Traceability
Every recommendation needs reasoning:
- Bad: "Use PostgreSQL"
- Good: "PostgreSQL chosen because journey requires complex compliance framework relationships (relational) with flexibility for varying assessment criteria (JSONB)"

### 4. Cascade Coherence
Sessions must build on each other:
- Session 9b (application-architecture) models services/repositories/controllers from database schema (Session 7) and API contracts (Session 8b)
- Session 10 (backlog) reads outputs from Sessions 1-9b and **extracts activities/goals from journey** to generate business epics (Jeff Patton Story Mapping methodology: activities → epics), then adds Foundation epic (always Epic 01) + conditional enabler epics (0-5 based on requirements)
- Session 12 (scaffold) **generatively creates** code skeletons by analyzing tech stack (Session 3), coding standards (Session 3b), and architecture (Session 9b) - uses framework-specific best practices, NOT generic templates (places generated code in repository root, not product-guidelines/)
- Session 14 (observability) measures metrics from Session 4

---

## File Organization Principles

**What's committed to repo:**
- Commands (`/.claude/commands/`)
- Templates (`/templates/`)
- Documentation (`README.md`, `COMMAND-REFERENCE.md`)
- Aspects (`/aspects/`)

**What's NOT committed (gitignored):**
- User-specific cascade outputs (`/product-guidelines/*`)
- Each user generates their own journey and strategy
- This ensures framework stays generative, not prescriptive

**Why this matters:**
- Framework can't become "just use Next.js" if no default outputs exist
- Forces each user to go through generative process
- Maintains journey-driven approach

---

## Integration Points

### GitHub CLI (`gh`)
Commands like `/create-gh-issues` and `/implement-issue` use `gh` CLI:
- Requires GitHub authentication
- Creates issues with journey traceability using scoped labels (see `.github/LABELS.md`)
- Links issues to backlog files
- Auto-closes issues via PR body

### Template System
Commands read templates to know output structure:
```javascript
// Pattern in command files
1. Read /templates/XX-name-template.md
2. Extract structure and validation criteria
3. Read previous cascade outputs
4. Generate journey-specific content
5. Write to /product-guidelines/XX-name.md
```

---

## Important Notes for Claude Code

1. **Always respect cascade order** - Never recommend skipping sessions
2. **Read before writing** - Commands must read previous outputs for context
3. **Journey traceability** - Every decision must reference specific user value
4. **Specificity matters** - Generic outputs violate framework philosophy
5. **Templates guide structure** - Read templates to understand output format
6. **Context files** - ALL sessions 1-9b create .ctx.md versions for token efficiency
7. **product-guidelines/ is gitignored** - Each user generates their own outputs
8. **Validation is critical** - Use `/validate-outputs` to ensure quality
9. **Philosophy over prescription** - This framework analyzes and recommends, never prescribes

---

## Quick Reference: Session Dependencies

```
Session 1 (journey) → Generates .md + .ctx.md
  ↓ CAPTURES: user journey + behavioral profile (tech proficiency, device, learning style, communication, onboarding, trust)
Session 2 (product-strategy) [reads: 00.ctx.md] → Generates .md + .ctx.md
  ↓
Session 2a (constraints) [reads: 00.ctx.md, 01.ctx.md] → Generates .md + .ctx.md
  ↓
Session 3 (tech-stack) [reads: 00.ctx.md, 01.ctx.md, 02a.ctx.md (if exists)] → Generates .md + .ctx.md
  ↓ OUTPUTS: Core Stack (Frontend, Backend, Database, Storage, AI detection, i18n library if required, Auth provider)
  ↓ NEW in 2025: State Management (client/server/form), Build Tooling (build tool, package manager, testing, code quality)
  ↓ ONLY detects if AI required, does NOT choose provider
Session 3b (coding-standards) [reads: 00.ctx.md, 01.ctx.md, 02.ctx.md] → Generates .md + .ctx.md
  ↓
Session 3c (ai-integration-strategy) [reads: 00.ctx.md, 01.ctx.md, 02.ctx.md] → Generates .md + .ctx.md
  ↓ OPTIONAL - only if "AI Integration: Required"; Makes ALL AI decisions and UPDATES 02-tech-stack.md
Session 4 (generate-strategy) [reads: 00-02c.ctx.md (all .ctx versions)] → Generates .md + .ctx.md for each (5 files: mission, metrics, monetization, architecture, analytics)
  ↓
Session 5 (brand-strategy) [reads: 00-04.ctx.md] → Generates .md + .ctx.md
  ↓
Session 6 (design) [reads: 00-05.ctx.md] → Generates .md + .ctx.md
  ↓ GENERATES: DTCG token hierarchy (primitive→semantic→component), 2025 CSS architecture (Tailwind v4, Panda CSS, Vanilla Extract with styled-components deprecation), WCAG 2.2 compliance (Target Size, Focus Not Obscured, Accessible Authentication), performance optimization (bundle splitting, icon/font optimization, Core Web Vitals targets)
  ↓
Session 7 (database-schema) [reads: 00-06.ctx.md] → Generates .md + .ctx.md
  ↓
Session 8 (api-design) [reads: 00.ctx.md, 02.ctx.md, 04.ctx.md, 07.ctx.md] → Generates .md + .ctx.md
  ↓ GENERATES: Paradigm choice (REST/GraphQL/gRPC), OWASP API Top 10 2023 protections (BOLA, BFLA, SSRF, etc.), input validation strategy, HTTP caching (ETag, Cache-Control), idempotency/retry patterns, circuit breakers for third-party APIs, security headers (HSTS, CSP)
  ↓
Session 8b (api-contracts) [reads: 00.ctx.md, 02.ctx.md, 04.ctx.md, 07.ctx.md, 08.ctx.md] → Generates .md + .ctx.md
  ↓ USES 5 PHASE-BASED SUB-AGENTS with conditional loading: Phase 1 (security/validation - always), Phase 2 (versioning - always), Phase 3 (performance - if mobile/high-traffic), Phase 4 (codegen - always), Phase 5 (formats - if non-REST)
  ↓
Session 9 (test-strategy) [reads: 00-08b.ctx.md] → Generates .md + .ctx.md
  ↓
Session 9b (application-architecture) [reads: 00.ctx.md, 02.ctx.md, 02b.ctx.md, 04.ctx.md, 07.ctx.md, 08b.ctx.md] → Generates .md + .ctx.md
  ↓
Session 10 (backlog) [reads: ALL .ctx.md files from 00-09b] → Generates backlog stories (no .ctx.md)
  ↓
Session 11 (create-gh-issues) [reads: 10-backlog/] → Pushes to GitHub
  ↓
Session 12 (scaffold) [reads: ALL .ctx.md files from 00-09b] → Generates scaffold (no .ctx.md)
  ↓
Session 13 (deployment) [reads: ALL .ctx.md files from 00-09b] → Generates plan (no .ctx.md)
  ↓
Session 14 (observability) [reads: ALL .ctx.md files from 00-09b] → Generates strategy (no .ctx.md)
```

**Key Pattern:** Sessions ALWAYS read .ctx.md versions when available. Context files provide 60-70% token reduction, cumulative savings across cascade.

---

## Post-Cascade Extensions

Post-cascade extensions are **optional deep-dive commands** that run AFTER core cascade (Sessions 1-14) for specialized product needs.

| Command | When | For Whom | Generates | Key Outputs |
|---------|------|----------|-----------|-------------|
| **`/discover-naming`** | After S5 | Brand name needed | 15-brand-naming.md | 20-30 candidates, trademark research, top 3 recommendations |
| **`/define-messaging`** | After S5 | Copy templates needed | 16-brand-messaging.md | Value prop, elevator pitches, voice guidelines, sample copy |
| **`/design-brand-identity`** | After S5 | Visual identity needed | 17-brand-identity.md | 3-5 logo concepts, color palettes, typography, usage guidelines |
| **`/create-compliance-plan`** | After S2a/S10 | Compliance-heavy (healthcare, fintech, B2B) | 23-compliance-plan.md | Regulations mapping, backlog stories, roadmap, cost estimates |

**Notes**:
- Brand extensions (naming/messaging/identity) REQUIRE Session 5 (brand-strategy) first
- Compliance plan reads 00-02a, 07-10 for technical implementation mapping
- Post-cascade extensions don't create .ctx.md files

---

## Command Size Policy (Anti-Bloat Architecture)

**CRITICAL**: Stack-Driven follows agentic coding best practices. Commands MUST NOT become monolithic context blobs.

### Rules

**Rule 1: Command Size Limit**
- Orchestrator commands: **<400 lines** (strict)
- Sub-agents: **150-400 lines** (one pattern per agent)
- Violation triggers: Decomposition required (see Epic #167 pattern)

**Rule 2: Conditional Loading**
- Commands MUST use sub-agents with conditional invocation
- Load only patterns relevant to user's journey (not encyclopedic dumps)
- Example: Skip Kubernetes sub-agent if deployment is serverless

**Rule 3: Centralized Examples**
- NO inline example duplication across sections
- Centralize in `/examples/[topic]-examples.md`
- Sub-agents reference by section: "See /examples/compliance-saas.md Section 2.1"

**Rule 4: Enhancement Review**
- Enhancement PRs adding >400 lines to a command MUST decompose into sub-agents
- Reviewer MUST flag monolithic additions in PR review
- See VALIDATION-CHECKLIST.md Category 12 (Command Size)

### Why This Matters

**Research Evidence** (Singh 2025, Anthropic 2024, Google ADK):
- **Agentic RAG**: Conditional retrieval, not encyclopedic loading (40-60% token waste in monoliths)
- **Context Engineering**: Isolate and select patterns (not 2,000+ line blobs)
- **Multi-Agent Architecture**: Specialized sub-agents with clear boundaries

**Framework Impact**:
- 5 bloated commands identified (11,328 lines total, 46% waste)
- Epic #167 tracks decomposition: /model-application, /create-test-strategy, /design-database-schema, /generate-api-design, /scaffold-project
- Post-decomposition: 40-50% API cost reduction, better maintainability

### Decomposition Pattern (from Epic #167)

```
/.claude/commands/[command-name].md (400 lines max - ORCHESTRATOR)
  ├── Step 1: Read Context
  ├── Step 2: Analyze Requirements → Determine which patterns needed
  ├── Step 3: Conditional Sub-Agent Invocation
  │   ├── If condition_A: Invoke pattern-a.md
  │   ├── If condition_B: Invoke pattern-b.md
  │   ├── If condition_C: Invoke pattern-c.md
  │   └── Always: Invoke core-pattern.md
  └── Step 4: Synthesize sub-agent outputs

/.claude/agents/
  ├── pattern-a.md (150-400 lines, one concern)
  ├── pattern-b.md (150-400 lines, one concern)
  └── pattern-c.md (150-400 lines, one concern)

/examples/
  └── [command-name]-examples.md (centralized, referenced by all)
```

**Example Conditional Logic**:
```markdown
### Step 3.2: Domain Layer Modeling
Condition: entity_count > 5 AND domain_complexity == "high"
Agent: /.claude/agents/model-domain-layer.md
Inputs: {database_entities from Session 7, journey_steps from Session 1}
Output: Domain entities with business logic methods
Skip if: Simple CRUD app with <5 entities
```

### Documented Exceptions

**Agent Size Exceptions** (with explicit justification):

- **`design-cross-cutting-concerns.md` (564 lines)**: Cohesive cross-cutting pattern group (caching, circuit breakers, outbox pattern, observability) with high operational coupling. Production systems typically need all four patterns together, so splitting into separate agents would increase orchestration complexity without significant token savings. Patterns share common implementation concerns (error handling, monitoring, resource management) that benefit from unified presentation. Exception approved in PR #171 (Epic #167).

- **`design-transaction-boundaries.md` (432 lines)**: Single-pattern agent with 8% overage due to comprehensive distributed transaction guidance (saga patterns, compensation logic, event sourcing). Tight coupling between transaction types makes splitting counterproductive. Minor overage accepted in PR #171 (Epic #167).

### Enforcement

**Pre-PR**: Run command size check
```bash
for f in .claude/commands/*.md; do
  lines=$(wc -l < "$f")
  if [ $lines -gt 400 ]; then
    echo "❌ BLOAT: $(basename $f) = $lines lines (>400)"
  fi
done
```

**During PR Review**: Use `/review-pr` with VALIDATION-CHECKLIST.md Category 12
**Post-Merge**: Epic #167 tracks refactor of existing bloated commands

---

**Remember:** Stack-Driven is a generative framework that derives optimal decisions from user journey analysis. Maintain journey-first philosophy, ensure decision traceability, prioritize specificity over genericity, and **enforce agentic architecture through sub-agent decomposition**.
