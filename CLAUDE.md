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

**`/.claude/commands/`** - The 27 slash commands that power the framework
- Core cascade: 14 session commands (refine-journey → design-observability)
- Post-cascade extensions: 8 optional deep-dive commands (naming, UX, analytics, growth)
- Meta commands: cascade-status, run-cascade
- Dev commands: validate-outputs, review-code, implement-issue
- Each command is a markdown file with detailed prompts for Claude

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

**`/examples/`** - Reference implementations showing different journeys
- `compliance-saas/` - Document processing SaaS example (Next.js, FastAPI, PostgreSQL)
- `b2b-saas-nextjs-postgres/` - B2B SaaS example
- `fintech-api-go-gcp/` - Fintech API example (Go, GCP)
- Demonstrates how different journeys lead to different tech stacks
- DO NOT copy examples - generate specific outputs for each journey

**`/aspects/`** - High-level framework documentation (13 aspects)
- Explains concepts like core-design, style-guide, user-journey, backlog-organization
- Reference material, not prescriptive guides
- Provides context for the philosophy behind the framework

---

## How Commands Work

### The Cascade Order (Sacred Sequential Flow)

The cascade order is **sacred** - user journey comes first, everything flows from it:

```
Session 1: /refine-journey              → 00-user-journey.md
Session 2: /create-product-strategy     → 01-product-strategy.md, 01-essentials
Session 3: /choose-tech-stack           → 02-tech-stack.md
Session 3.5: /define-coding-standards   → 02b-coding-standards.md, 02b-essentials
Session 4: /generate-strategy           → 03-mission, 04-metrics/monetization/architecture
Session 5: /create-brand-strategy       → 05-brand-strategy.md
Session 6: /create-design               → 06-design-system.md
Session 7: /design-database-schema      → 07-database-schema.md
Session 8: /generate-api-contracts      → 08-api-contracts.md
Session 9: /create-test-strategy        → 09-test-strategy.md
Session 9b: /model-application          → 09b-application-architecture.md, 09b-essentials
Session 10: /generate-backlog           → 10-backlog/ (30-50 user stories)
Session 11: /create-gh-issues           → Push to GitHub
Session 12: /scaffold-project           → 12-project-scaffold.md + code files
Session 13: /plan-deployment            → 13-deployment-plan.md
Session 14: /design-observability       → 14-observability-strategy.md
```

**Dependencies:** Each session READS previous outputs. For example:
- Session 3 (tech-stack) reads 00-journey + 01-strategy + 01-essentials
- Session 3.5 (coding-standards) reads 00-journey + 01-strategy + 02-tech-stack
- Session 4 (generate-strategy) reads 00-02b
- Session 9b (application-architecture) reads 00-journey + 02-tech-stack + 02b-essentials + 04-architecture + 07-essentials + 08-essentials
- Session 10 (backlog) reads ALL previous sessions (00-09b including 02b) and essentials files

**Never skip sessions** - later sessions need previous outputs for context.

### Command Execution Pattern

Each command follows this pattern:
1. **Read previous outputs** from `product-guidelines/` directory
2. **Read template file** from `/templates/` for structure
3. **Analyze and generate** specific recommendations based on journey
4. **Write output file** to `product-guidelines/`
5. **Tell user what to run next**

### Meta Commands

**`/cascade-status`** - Check progress and get next step
- Lists all sessions with ✅ (complete) or ❌ (not started)
- Shows which files exist in `product-guidelines/`
- Recommends exactly which command to run next
- Explains inputs, outputs, and estimated time

**`/run-cascade`** - Automated sequential execution
- Detects current progress
- Executes sessions automatically in sequence
- Pauses at major milestones for user confirmation
- Handles interruptions gracefully (resume later)

### Development Commands

**`/implement-issue [issue-number]`** - Implement GitHub issue
- Fetches issue details via `gh` CLI
- Reads approved plan from issue comments
- Loads relevant product-guidelines for context (tech-stack, design-system, etc.)
- Creates issue-linked branch: `[number]-issue-slug`
- Implements following plan exactly
- Creates PR with "Closes #[number]"

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
- Example: Compliance SaaS gets Next.js+FastAPI (document processing + SEO), real-time game gets React Native+Node.js+WebSockets (mobile + <100ms latency)

### 2. Progressive Interrogation (Session 1)

Session 1 uses **structured interview framework** (`/templates/00-user-journey-interview-template.md`):
- 16 progressive questions in 4 phases
- One question at a time, adaptive based on answers
- Extracts human need, not solution idea
- Quantifies value ratio (e.g., "4 hours → 60 seconds = 240x faster")
- Validates completeness before generating output

### 3. Journey Traceability

Every decision must trace back to user journey:
- Tech choice? "PostgreSQL because journey needs complex relationships with JSONB flexibility for compliance frameworks"
- Feature priority? "Serves Step 2 of journey (document upload → assessment)"
- Design decision? "Blue conveys trustworthy professional for compliance officers"

**Validation check:** Could this decision apply to a different product? If yes, it's too generic.

### 4. Essentials Files Pattern

Some sessions create TWO files:
- Full version: Complete detailed specification
- Essentials version: Condensed for consumption by later sessions

Examples:
- `01-product-strategy.md` + `01-product-strategy-essentials.md`
- `02b-coding-standards.md` + `02b-coding-standards-essentials.md`
- `07-database-schema.md` + `07-database-schema-essentials.md`
- `08-api-contracts.md` + `08-api-contracts-essentials.md`
- `09b-application-architecture.md` + `09b-application-architecture-essentials.md`

**Why?** Keeps token usage manageable when Session 10 (/generate-backlog) and Session 12 (/scaffold-project) read all previous sessions.

### 5. Quality Validation Framework

`/validate-outputs` checks for:
- **Journey alignment** (critical): References specific journey steps, quantified value ratio
- **Philosophy adherence** (critical): User-first thinking, generative approach
- **Specificity** (critical): Named personas, concrete examples (not "users want better experience")
- **Completeness** (important): "What We DIDN'T Choose" sections with 2+ alternatives
- **Consistency** (important): Tech aligns with journey, mission aligns with aha moment
- **Technical soundness** (important): Indexes in schemas, error responses in APIs, SLO/SLI in observability

### 6. Issue Implementation Pattern

`/implement-issue` follows strict workflow:
1. Load relevant product-guidelines as guardrails (always read `02-tech-stack.md`)
2. UI work → read `06-design-system.md`
3. API work → read `08-api-contracts.md`
4. Database work → read `07-database-schema.md`
5. Create branch: `[issue-number]-slug`
6. Implement following approved plan
7. Commit: `feat: description (closes #[number])`
8. PR with "Closes #[number]" in body

---

## Working with This Repository

### When Making Changes to Commands

**Understand the cascade dependencies:**
- If you modify Session 1 output structure, update sessions that read it (2, 3, 4, 10)
- If you modify Session 7 (database-schema), update Session 8 (api-contracts) that depends on it
- Essentials files must stay condensed for token efficiency

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
- Session 9b (application-architecture) models services/repositories/controllers from database schema (Session 7) and API contracts (Session 8)
- Session 10 (backlog) reads outputs from Sessions 1-9b (including Session 3.5 coding standards and Session 9b architecture)
- Session 12 (scaffold) implements tech choices from Session 3, coding patterns from Session 3.5, and generates code skeletons from Session 9b
- Session 14 (observability) measures metrics from Session 4

---

## File Organization Principles

**What's committed to repo:**
- Commands (`/.claude/commands/`)
- Templates (`/templates/`)
- Examples (`/examples/`)
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
- Creates issues with journey traceability
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

### Examples as Quality Benchmarks
Examples serve as reference implementations:
- Show journey → tech stack derivation
- Demonstrate specificity vs genericity
- Illustrate decision traceability
- NOT meant to be copied

---

## Important Notes for Claude Code

1. **Always respect cascade order** - Never recommend skipping sessions
2. **Read before writing** - Commands must read previous outputs for context
3. **Journey traceability** - Every decision must reference specific user value
4. **Specificity matters** - Generic outputs violate framework philosophy
5. **Templates guide structure** - Read templates to understand output format
6. **Essentials files** - Some sessions create condensed versions for token efficiency
7. **product-guidelines/ is gitignored** - Each user generates their own outputs
8. **Examples are benchmarks** - Reference quality, don't copy content
9. **Validation is critical** - Use `/validate-outputs` to ensure quality
10. **Philosophy over prescription** - This framework analyzes and recommends, never prescribes

---

## Quick Reference: Session Dependencies

```
Session 1 (journey)
  ↓
Session 2 (product-strategy) [reads: 00]
  ↓
Session 3 (tech-stack) [reads: 00, 01]
  ↓
Session 3.5 (coding-standards) [reads: 00-02]
  ↓
Session 4 (generate-strategy) [reads: 00-02b]
  ↓
Session 5 (brand-strategy) [reads: 00-04]
  ↓
Session 6 (design) [reads: 00-05]
  ↓
Session 7 (database-schema) [reads: 00-06]
  ↓
Session 8 (api-contracts) [reads: 00-07]
  ↓
Session 9 (test-strategy) [reads: 00-08]
  ↓
Session 9b (application-architecture) [reads: 00, 02, 02b-essentials*, 04, 07-essentials*, 08-essentials*]
  * Essentials files used to reduce token usage (architecture doesn't need full schemas/contracts)
  ↓
Session 10 (backlog) [reads: 00-09b including 02b + all essentials files]
  ↓
Session 11 (create-gh-issues) [reads: 10-backlog/]
  ↓
Session 12 (scaffold) [reads: 00-11 including 02b, 09b-essentials]
  ↓
Session 13 (deployment) [reads: 00-12]
  ↓
Session 14 (observability) [reads: 00-13]
```

Post-cascade extensions read from core cascade outputs but are optional and can run in any order after their prerequisites.

---

**Remember:** Stack-Driven is a generative framework that derives optimal decisions from user journey analysis. Maintain journey-first philosophy, ensure decision traceability, and prioritize specificity over genericity in all outputs.
