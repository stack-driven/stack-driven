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

**`/.claude/commands/`** - The slash commands that power the framework (34 total)
- Core cascade: 19 session commands (refine-journey → design-observability, including optional sessions)
- Post-cascade extensions: 8 optional deep-dive commands (naming, UX, analytics, growth)
- Meta commands: cascade-status, run-cascade
- Dev commands: validate-outputs, review-code, implement-issue, plan-issue, update-claudemd
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

**`/examples/`** - Reserved for future reference implementations
- Directory structure maintained for future examples
- Will demonstrate how different journeys lead to different tech stacks

**`/aspects/`** - High-level framework documentation (13 aspects)
- Explains concepts like core-design, style-guide, user-journey, backlog-organization
- Reference material, not prescriptive guides
- Provides context for the philosophy behind the framework

---

## How Commands Work

### The Cascade Order (Sacred Sequential Flow)

The cascade order is **sacred** - user journey comes first, everything flows from it:

```
Session 1: /refine-journey              → 00-user-journey.md + .ctx.md
Session 2: /create-product-strategy     → 01-product-strategy.md + .ctx.md
Session 2a: /document-constraints       → 02a-constraints.md + .ctx.md
Session 3: /choose-tech-stack           → 02-tech-stack.md + .ctx.md
Session 3b: /define-coding-standards   → 02b-coding-standards.md + .ctx.md
Session 3c: /define-ai-integration-strategy → 02c-ai-integration-strategy.md + .ctx.md
Session 4: /generate-strategy           → 03a-mission.md + .ctx.md, 03b-metrics.md + .ctx.md, 03c-monetization.md + .ctx.md, 04-architecture.md + .ctx.md
Session 5: /create-brand-strategy       → 05-brand-strategy.md + .ctx.md
Session 6: /create-design               → 06-design-system.md + .ctx.md
Session 7: /design-database-schema      → 07-database-schema.md + .ctx.md
Session 8: /generate-api-design         → 08-api-design.md + .ctx.md
Session 8b: /generate-api-contracts     → 08b-api-contracts.md + .ctx.md
Session 9: /create-test-strategy        → 09-test-strategy.md + .ctx.md
Session 9b: /model-application          → 09b-application-architecture.md + .ctx.md
Session 10: /generate-backlog           → 10-backlog/ (30-50 user stories)
Session 11: /create-gh-issues           → Push to GitHub
Session 12: /scaffold-project           → 12-project-scaffold.md + code files + code skeletons
Session 13: /plan-deployment            → 13-deployment-plan.md
Session 14: /design-observability       → 14-observability-strategy.md
```

**Dependencies:** Each session READS previous outputs. For example:
- Session 2a (constraints) reads 00-journey + 01-strategy
- Session 3 (tech-stack) reads 00-journey + 01-strategy + 02a-constraints (if exists); **ONLY detects if AI is required**, does NOT choose AI provider
- Session 3b (coding-standards) reads 00-journey + 01-strategy + 02-tech-stack
- Session 3c (ai-integration-strategy) reads 00-journey + 01-strategy + 02-tech-stack (optional: only if "AI Integration: Required" in tech stack); **makes ALL AI decisions** (provider, model, pattern) and **updates tech stack file**
- Session 4 (generate-strategy) reads 00-02a (if exists) + 02b + (02c if it exists)
- Session 8 (api-design) reads 00-journey + 02-tech-stack + 04-architecture + 07-database-schema.ctx.md
- Session 8b (api-contracts) reads 08-api-design + 00-journey + 02-tech-stack + 04-architecture + 07-database-schema.ctx.md
- Session 9b (application-architecture) reads 00-journey + 02-tech-stack + 02b-coding-standards.ctx.md + 04-architecture + 07-database-schema.ctx.md + 08b-api-contracts.ctx.md
- Session 10 (backlog) reads ALL previous sessions (00-09b including 02b) and .ctx.md files including 08-api-design.ctx.md
- Session 12 (scaffold) reads ALL previous sessions including 08b-api-contracts.ctx.md

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
- `04-architecture.md` + `04-architecture.ctx.md` (60% reduction)
- `05-brand-strategy.md` + `05-brand-strategy.ctx.md` (65% reduction)
- `06-design-system.md` + `06-design-system.ctx.md` (60% reduction)
- `07-database-schema.md` + `07-database-schema.ctx.md` (56% reduction)
- `08-api-design.md` + `08-api-design.ctx.md` (65% reduction)
- `08b-api-contracts.md` + `08b-api-contracts.ctx.md` (80% reduction)
- `09-test-strategy.md` + `09-test-strategy.ctx.md` (66% reduction)
- `09b-application-architecture.md` + `09b-application-architecture.ctx.md` (60% reduction)

**NO context files for final outputs (sessions 10-14):**
- `10-backlog/` - User stories are already concise
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
   - **KEEP:** ALL architectural decisions, user journey steps, tech choices, design specs, constraints, database schemas, API specifications
   - **REMOVE:** Rationale (keep 1-2 line summaries), alternatives considered, detailed examples, validation checklists
4. Agent preserves source file structure, achieves 60-70% token reduction
5. Agent validates ALL critical decisions preserved before writing

### 5. Simplified Decision Matrix: When to Read .ctx.md vs .md

**UNIVERSAL RULE: Sessions ALWAYS read .ctx.md when available (all sessions 1-9b have .ctx.md files).**

**Read .ctx.md (Default for ALL Cascade Sessions):**

ALL sessions 2-14 read `.ctx.md` versions of previous sessions 1-9b:
- **Token efficiency** - 60-70% reduction per file, cumulative savings across cascade
- **Decisions only** - No rationale, alternatives, or explanations needed
- **Consistency** - Simple rule: if .ctx.md exists, read it
- **Performance** - Faster execution, lower costs, better context window usage

**Session-by-Session Matrix (Simplified):**

| Session | Reads From | File Versions | Note |
|---------|-----------|--------------|------|
| 2 | 00 | .ctx.md | Journey steps only |
| 2a | 00, 01 | .ctx.md | Journey + vision |
| 3 | 00, 01, 02a (if exists) | .ctx.md | Journey + constraints |
| 3b | 00, 01, 02 | .ctx.md | Tech stack + journey |
| 3c | 00, 01, 02 | .ctx.md | AI decisions (optional session) |
| 4 | 00-02c (if exists) | .ctx.md | All previous decisions |
| 5 | 00-04 | .ctx.md | Strategic foundation |
| 6 | 00-05 | .ctx.md | Journey + brand |
| 7 | 00-06 | .ctx.md | Journey + design |
| 8 | 00, 02, 04, 07 | .ctx.md | API design decisions |
| 8b | 00, 02, 04, 07, 08 | .ctx.md | API contracts |
| 9 | 00-08b | .ctx.md | All technical specs |
| 9b | 00, 02, 02b, 04, 07, 08b | .ctx.md | Application modeling |
| 10 | 00-09b | .ctx.md for ALL | **CRITICAL** - Maximum token savings |
| 11 | 10-backlog | Full .md | Stories (no .ctx) |
| 12 | 00-11 | .ctx.md for 00-09b | Scaffold generation |
| 13 | 00-12 | .ctx.md for 00-09b | Deployment planning |
| 14 | 00-13 | .ctx.md for 00-09b | Observability strategy |

**Dev Commands:**

| Command | Reads | File Versions | Note |
|---------|-------|--------------|------|
| /plan-issue | 02, 02b, conditionally 04, 06, 07, 08, 08b, 09 | .ctx.md for all | Tech specs for planning |
| /implement-issue | Uses plan only | N/A | Plan has all context |
| /post-plan-and-implement | Same as plan-issue | .ctx.md for all | Combined workflow |

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

`/plan-issue` loads context and creates implementation plan:
1. Always read `02-tech-stack.ctx.md` (tech choices)
2. Always read `02b-coding-standards.ctx.md` (patterns, file organization)
3. Conditionally read based on issue type (all use .ctx.md):
   - UI work → `06-design-system.ctx.md`
   - API work → `08-api-design.ctx.md`, `08b-api-contracts.ctx.md`
   - Database work → `07-database-schema.ctx.md`
   - Testing → `09-test-strategy.ctx.md`
   - Infrastructure → `04-architecture.ctx.md`

`/implement-issue` follows strict workflow:
1. Fetch approved plan from issue comments
2. Uses plan as complete context (plan already contains all necessary product-guidelines)
3. Create branch: `[issue-number]-slug`
4. Implement following plan exactly
5. Commit: `feat: description (closes #[number])`
6. PR with "Closes #[number]" in body

---

## Working with This Repository

### When Making Changes to Commands

**Understand the cascade dependencies:**
- If you modify Session 1 output structure, update sessions that read it (2, 3, 4, 10)
- If you modify Session 7 (database-schema), update Session 8 (api-contracts) that depends on it
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
- Session 9b (application-architecture) models services/repositories/controllers from database schema (Session 7) and API contracts (Session 8)
- Session 10 (backlog) reads outputs from Sessions 1-9b (including Session 3b coding standards and Session 9b architecture)
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
  ↓
Session 2 (product-strategy) [reads: 00.ctx.md] → Generates .md + .ctx.md
  ↓
Session 2a (constraints) [reads: 00.ctx.md, 01.ctx.md] → Generates .md + .ctx.md
  ↓
Session 3 (tech-stack) [reads: 00.ctx.md, 01.ctx.md, 02a.ctx.md (if exists)] → Generates .md + .ctx.md
  ↓ ONLY detects if AI required, does NOT choose provider
Session 3b (coding-standards) [reads: 00.ctx.md, 01.ctx.md, 02.ctx.md] → Generates .md + .ctx.md
  ↓
Session 3c (ai-integration-strategy) [reads: 00.ctx.md, 01.ctx.md, 02.ctx.md] → Generates .md + .ctx.md
  ↓ OPTIONAL - only if "AI Integration: Required"; Makes ALL AI decisions and UPDATES 02-tech-stack.md
Session 4 (generate-strategy) [reads: 00-02c.ctx.md (all .ctx versions)] → Generates .md + .ctx.md for each (4 files)
  ↓
Session 5 (brand-strategy) [reads: 00-04.ctx.md] → Generates .md + .ctx.md
  ↓
Session 6 (design) [reads: 00-05.ctx.md] → Generates .md + .ctx.md
  ↓
Session 7 (database-schema) [reads: 00-06.ctx.md] → Generates .md + .ctx.md
  ↓
Session 8 (api-design) [reads: 00.ctx.md, 02.ctx.md, 04.ctx.md, 07.ctx.md] → Generates .md + .ctx.md
  ↓
Session 8b (api-contracts) [reads: 00.ctx.md, 02.ctx.md, 04.ctx.md, 07.ctx.md, 08.ctx.md] → Generates .md + .ctx.md
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

Post-cascade extensions read from core cascade outputs but are optional and can run in any order after their prerequisites.

---

**Remember:** Stack-Driven is a generative framework that derives optimal decisions from user journey analysis. Maintain journey-first philosophy, ensure decision traceability, and prioritize specificity over genericity in all outputs.
