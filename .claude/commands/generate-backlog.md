---
description: Session 10 - Generate complete backlog from journey through to technical specs
---

# Session 10: Generate Backlog

This is **Session 10** of the cascade. You'll create a production-ready backlog where every issue traces to user value and is informed by technical specifications (database schema, API contracts, testing strategy).

## Your Role

You're a technical product manager creating a systematic backlog from all cascade outputs using a **two-phase approach**: Planning (synthesize decisions ONCE) → Execution (generate story files in batches).

## Critical Philosophy

**Research Foundation**: This command implements the research-validated embedded artifacts pattern from `reference-material/agentic-context-injection-reference-guide.md` (Lines 73-98, Grade A+):
- Planning phase: Read ALL guidelines ONCE, synthesize decisions into PLAN.md
- Human checkpoint: User reviews PLAN.md before execution
- Execution phase: Read ONLY PLAN.md (NO guideline re-reading), generate stories in batches

**Why this works**: 5,744 lines loaded ONCE (planning) → synthesized to ~1,000 lines → execution agents read 1,000 lines (not 5,744), achieving 100% completion for 50+ story backlogs.

## Process

### PHASE 1: PLANNING (Synthesize Decisions)

#### Step 1: Read ALL Previous Outputs (Context Loading)

Read all 14 .ctx.md files ONCE to load cascade context:

```
Read: product-guidelines/00-user-journey.ctx.md
Read: product-guidelines/01-product-strategy.ctx.md
Read: product-guidelines/02-tech-stack.ctx.md

# Check if constraints exist (Session 2a is optional)
If product-guidelines/02a-constraints.ctx.md exists:
  Read: product-guidelines/02a-constraints.ctx.md

Read: product-guidelines/02b-coding-standards.ctx.md

# Check if AI integration strategy exists (Session 3c is optional)
If product-guidelines/02c-ai-integration-strategy.ctx.md exists:
  Read: product-guidelines/02c-ai-integration-strategy.ctx.md

Read: product-guidelines/03a-mission.ctx.md
Read: product-guidelines/03b-metrics.ctx.md
Read: product-guidelines/03c-monetization.ctx.md
Read: product-guidelines/04-architecture.ctx.md
Read: product-guidelines/07-database-schema.ctx.md
Read: product-guidelines/08-api-design.ctx.md
Read: product-guidelines/08b-api-contracts.ctx.md
Read: product-guidelines/09-test-strategy.ctx.md
Read: product-guidelines/09b-application-architecture.ctx.md
```

**Context Loaded**: ~5,744 lines total across 14 files.

#### Step 2: Generate Epic Structure

Extract activities/goals from journey and convert to epics following the existing algorithm (see original command Lines 56-312). This step is unchanged from the original command.

**Output**: Epic structure with 2-10 epics (1 Foundation + 1-9 Business + 0-5 Conditional Enablers).

#### Step 3: Generate Story Outlines (NOT Full Files Yet)

For each journey step and foundation requirement, generate story OUTLINES with ALL decisions embedded:

**Story Outline Structure** (condensed, for PLAN.md):
```markdown
### STORY-XXX: [Title]
- Epic: [Epic ID]
- Priority: [P0/P1/P2]
- RICE: [Score] (R:[X] × I:[X] × C:[X]% ÷ E:[X])
- User Value: [1-2 sentences]
- Tech Approach: [From Session 3 - frameworks, libraries]
- Database: [From Session 7 - tables, columns]
- API: [From Session 8 - endpoints, methods]
- Design: [From Session 6 - components if exists]
- Acceptance Criteria: [3-5 bullets]
- Dependencies: [Blocked by which stories]
- Estimation: [X person-days]
- Journey Traceability: [Which journey step, why valuable]
```

**CRITICAL**: Story outlines must embed ALL technical decisions from sessions 3-9b. No external references like "see Session 7 for schema" - embed the actual table names, endpoints, components directly in outlines.

**Output**: 30-60 story outlines (depends on journey complexity).

#### Step 4: Embed Tech Stack Decisions

For each story outline, extract and embed relevant decisions from cascade:

**From Session 3 (Tech Stack)**:
- Frontend framework + version
- Backend framework + version
- Database + version
- Auth provider
- AI provider (if Session 3c exists)
- i18n library (if Session 2a marks i18n required)

**From Session 7 (Database Schema)**:
- Table names relevant to this story
- Key columns (e.g., user_id, created_at)
- Indexes if performance-critical
- Foreign keys if relationships matter

**From Session 8 (API Design)**:
- API paradigm (REST/GraphQL/gRPC)
- Endpoints this story will implement (paths + methods)
- Auth strategy (JWT, OAuth, etc.)
- OWASP protection patterns if applicable

**From Session 8b (API Contracts)**:
- Request/response schemas (condensed)
- Error codes

**From Session 9b (Application Architecture)**:
- Services/repositories/controllers this story touches

#### Step 5: Synthesize PLAN.md

Create comprehensive plan file embedding ALL decisions:

**PLAN.md Structure** (~1,000 lines):
```markdown
# Backlog Generation Plan

## Tech Stack Decisions (Embedded from Session 3)
- Frontend: [Framework]
- Backend: [Framework]
- Database: [Database + version]
- Auth: [Provider]
- AI: [Provider] (if exists)
- i18n: [Library] (if required)

## Database Schema Summary (Embedded from Session 7)
- Users: id, email, preferred_locale, created_at
- [Other tables]: [Key columns]

## API Patterns (Embedded from Session 8)
- Paradigm: [REST/GraphQL/gRPC]
- Serialization: [JSON/Protobuf]
- Auth: [Strategy]
- Rate Limiting: [Strategy]
- OWASP Patterns: [Key protections]

## Epic Structure
[List of epics with IDs, titles, descriptions]

## Story Outlines (50+ stories, ALL decisions embedded)

### STORY-001: Database Schema Setup
- Epic: Epic 01 (Foundation)
- Priority: P0 (RICE: 500.0 = R:1000 × I:2 × C:100% ÷ E:4)
- User Value: Enable data persistence for all features
- Tech Approach: Alembic migrations, PostgreSQL 15+
- Database: users(id, email, preferred_locale), products(id, title, awin_id), feeds(id, user_id, llm_score)
- API: No endpoints (foundation)
- Acceptance Criteria:
  - [ ] Users table with preferred_locale column (for i18n)
  - [ ] Products table with awin_id, price columns
  - [ ] Feeds table with llm_score, generated_at
  - [ ] Indexes: users(email), products(awin_id), feeds(user_id, generated_at)
- Dependencies: None (blocks all other stories)
- Estimation: 4 person-days
- Journey Traceability: Foundation for Steps 2-6

[... 49 more stories with ALL decisions embedded]
```

Write PLAN.md to `product-guidelines/10-backlog/PLAN.md`.

#### Step 6: Human Checkpoint (CRITICAL)

Display checkpoint message and PAUSE execution:

```
[CHECKPOINT] Session 10 Planning Complete

PLAN.md generated with 50 story outlines.

FILE LOCATION: product-guidelines/10-backlog/PLAN.md

REVIEW CHECKLIST:
- [ ] Each business epic traces to a user GOAL (not step range)
- [ ] Epic count matches activities extracted from journey
- [ ] Tech stack decisions embedded in stories (no "see Session 3" references)
- [ ] Database tables embedded in relevant stories
- [ ] API endpoints embedded in relevant stories
- [ ] RICE scores calculated for all stories
- [ ] Journey traceability present (which step, why valuable)

WHAT HAPPENS NEXT:
If you approve this plan, I will generate 50 story markdown files in batches.

ROLLBACK:
If you find issues, run /generate-backlog again to regenerate.
This will OVERWRITE product-guidelines/10-backlog/PLAN.md (previous version lost).
To preserve, copy PLAN.md to PLAN-backup.md before re-running.

Type "continue" to proceed with story file generation, or "stop" to review plan first.
```

**CRITICAL**: Do NOT proceed to Phase 2 without explicit user approval.

### PHASE 2: EXECUTION (Generate Story Files in Batches)

#### Step 7: Wait for User Approval

If user types "continue", "proceed", "yes", "go ahead" → Proceed to Step 8.

If user types "stop", "wait", "review" → END here, user will review PLAN.md manually.

#### Step 8: Partition Stories by Epic

Group story IDs by epic, create batches of 10 stories per batch:

Example:
- Batch 1: Epic 01 stories 001-010
- Batch 2: Epic 01 stories 011-015
- Batch 3: Epic 02 stories 016-025
- Batch 4: Epic 02 stories 026-030
- [etc.]

#### Step 9: Invoke Execution Agent for Each Batch

For each batch, use Task tool to invoke `.claude/agents/write-story-files.md`:

```
Use Task tool with subagent_type "general-purpose":

Prompt: "Generate story files for batch [X] using PLAN.md

INPUTS:
- PLAN.md path: product-guidelines/10-backlog/PLAN.md
- Story IDs: [001-010 OR 011-020, etc.]
- Output directory: product-guidelines/10-backlog/issues/

INSTRUCTIONS:
Follow the write-story-files agent specification in .claude/agents/write-story-files.md to:
1. Read PLAN.md (NO guideline re-reading)
2. Extract story outlines for specified story IDs
3. Expand each outline to full markdown format using /templates/issue-template.md structure
4. Write 10 story files to output directory
5. Report written file paths"
```

**Progress Display**: After each batch, show context usage from sub-agent responses:
```
[Batch 1/5] Generated Epic 01 stories 001-010 (10 files written, 42% context usage)
[Batch 2/5] Generated Epic 01 stories 011-015 (5 files written, 28% context usage)
[Batch 3/5] Generated Epic 02 stories 016-025 (10 files written, 45% context usage)
...
```

**Note**: Context usage validates <50% target (prevents exhaustion reoccurrence).

**Error Handling**: If sub-agent invocation fails mid-batch:
- Log batch failure (which batch, which story IDs)
- Continue with next batch (don't abort entire backlog)
- Report all failures at end with story IDs that need regeneration
- User can re-run /generate-backlog to retry failed batches only

#### Step 10: Generate BACKLOG.md Summary

After all batches complete, create summary file:

```markdown
# Backlog Summary

Generated [X] stories across [Y] epics.

## Epic Structure Rationale
[Explanation of how epics were derived from journey activities]

## Priority Distribution
- P0 stories: [A] (critical for MVP)
- P1 stories: [B] (important, post-MVP)
- P2 stories: [C] (nice-to-have)

## Estimated Timeline
Total effort: [Z] person-weeks

## Journey Mapping
- Journey Step 1 → Stories: 001, 002, 003
- Journey Step 2 → Stories: 004, 005, 006
[etc.]
```

Write to `product-guidelines/10-backlog/BACKLOG.md`.

## After Generation

```
[✓] Session 10 complete! Production backlog generated.

Your Backlog:
  [X] epics covering full user journey
  [Y] user stories (prioritized with RICE)
   - [A] P0 stories (critical for MVP)
   - [B] P1 stories (important, post-MVP)
   - [C] P2 stories (nice-to-have)

Estimated MVP timeline: [Z] weeks

Files created:
- product-guidelines/10-backlog/PLAN.md (synthesized plan)
- product-guidelines/10-backlog/BACKLOG.md (summary)
- product-guidelines/10-backlog/issues/*.md ([Y] story files)

Next, we can push these issues to GitHub.

When ready, run: /create-gh-issues
Or check progress: /cascade-status
```

## Important Guidelines

1. **Two-phase execution**: Planning (read all, synthesize once) → Execution (read plan, generate batches)
2. **Human checkpoint REQUIRED**: User must approve PLAN.md before story file generation
3. **Embed ALL decisions**: Story outlines in PLAN.md must have NO external references
4. **Batch processing**: 10 stories per batch (prevents context exhaustion)
5. **Progress visibility**: Show batch completion status after each agent invocation
6. **Idempotent regeneration**: Running /generate-backlog twice overwrites files safely

## Reference

- Template: `/templates/issue-template.md`
- Execution Agent: `/.claude/agents/write-story-files.md`
- Research: `reference-material/agentic-context-injection-reference-guide.md` (Lines 73-98)

## Output Format

IMPORTANT: Do not use emojis in generated outputs. Use plain text for all communication.
