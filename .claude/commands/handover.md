---
description: Transform repository from framework mode to foundation mode
---

# Handover: Cascade to Foundation Transition

You are orchestrating a one-way transformation that converts the Stack-Driven repository from generative framework mode (cascade generation) to clean foundation mode (MVP implementation).

## What This Does

After a user completes all 14 core cascade sessions (journey → observability), the repository contains:
- Product guidelines (the valuable outputs)
- Framework scaffolding (31 cascade commands, templates, aspects)

The framework served its purpose - it generated the product guidelines. Now it's time for "stage separation" - removing the framework scaffolding so developers can focus on building the MVP without clutter.

**This is a one-way transformation. There is no undo.**

## Your Task

Execute a systematic handover process that:
1. Verifies cascade completion (all core sessions 00-14 exist)
2. Deletes framework scaffolding (31 commands, templates, aspects, examples)
3. Generates foundation CLAUDE.md (product-focused, not framework-focused)
4. Generates product README.md (problem, solution, features, tech stack)
5. Commits product-guidelines/ to repository (no longer gitignored)
6. Creates handover commit
7. Displays handover report with statistics
8. Self-destructs after user confirmation

## Critical Philosophy

**One-Way Transformation**: After handover, cascade commands are gone. Users should validate outputs with `/validate-outputs` BEFORE running `/handover`.

**Clean Foundation**: The goal is a repository that contains only:
- Product guidelines (committed)
- Development commands (plan-issue, implement-issue, review-code, update-claudemd, review-pr, address-review, fix-bug, distill-logs)
- Generated code from Session 12 (if exists)
- Foundation CLAUDE.md and README.md

**No Framework Clutter**: Developers shouldn't see cascade commands, templates, or framework philosophy docs. Those served their purpose.

## Steps to Execute

### Step 1: Verify Cascade Completion

Check that all required files exist before proceeding.

**Required core session files (20 files):**
```
product-guidelines/00-user-journey.md
product-guidelines/01-product-strategy.md
product-guidelines/02a-constraints.md
product-guidelines/02-tech-stack.md
product-guidelines/02b-coding-standards.md
product-guidelines/03a-mission.md
product-guidelines/03b-metrics.md
product-guidelines/03c-monetization.md
product-guidelines/04-architecture.md
product-guidelines/05-brand-strategy.md
product-guidelines/06-design-system.md
product-guidelines/07-database-schema.md
product-guidelines/08-api-design.md
product-guidelines/08b-api-contracts.md
product-guidelines/09-test-strategy.md
product-guidelines/09b-application-architecture.md
product-guidelines/10-backlog/ (directory)
product-guidelines/12-project-scaffold.md
product-guidelines/13-deployment-plan.md
product-guidelines/14-observability-strategy.md
```

**Note**: Session 3c (02c-ai-integration-strategy.md) is optional. Session 11 creates GitHub issues (no file output).

**Required context files (17 files for sessions 00-09b):**
```
product-guidelines/00-user-journey.ctx.md
product-guidelines/01-product-strategy.ctx.md
product-guidelines/02a-constraints.ctx.md
product-guidelines/02-tech-stack.ctx.md
product-guidelines/02b-coding-standards.ctx.md
product-guidelines/03a-mission.ctx.md
product-guidelines/03b-metrics.ctx.md
product-guidelines/03c-monetization.ctx.md
product-guidelines/04-architecture.ctx.md
product-guidelines/05-brand-strategy.ctx.md
product-guidelines/06-design-system.ctx.md
product-guidelines/07-database-schema.ctx.md
product-guidelines/08-api-design.ctx.md
product-guidelines/08b-api-contracts.ctx.md
product-guidelines/09-test-strategy.ctx.md
product-guidelines/09b-application-architecture.ctx.md
```

**Optional**: 02c-ai-integration-strategy.ctx.md (only if AI integration required)

**Verification logic:**
1. Use Bash to check if each file exists: `test -f product-guidelines/00-user-journey.md && echo "exists" || echo "missing"`
2. Collect all missing files
3. If any core files missing, ABORT with message:
```
Cascade Incomplete - Handover Aborted

Missing required files:
- product-guidelines/[filename1]
- product-guidelines/[filename2]

You must complete all 14 core sessions before running /handover.

Run /cascade-status to see which sessions remain.

Recommendation: Use /validate-outputs to verify quality before handover.
```

4. If all files exist, proceed to Step 2

### Step 2: Calculate Before Statistics

Store repository statistics for before/after comparison.

```bash
# Count total files
BEFORE_FILES=$(find . -type f | wc -l | tr -d ' ')

# Calculate repository size
BEFORE_SIZE=$(du -sh . | cut -f1)
```

Store these values to display in handover report.

### Step 3: Delete Framework Scaffolding

Remove all cascade generation commands, meta commands, post-cascade extensions, and framework directories.

**Delete 31 cascade commands:**
```bash
rm -f .claude/commands/refine-journey.md
rm -f .claude/commands/create-product-strategy.md
rm -f .claude/commands/document-constraints.md
rm -f .claude/commands/choose-tech-stack.md
rm -f .claude/commands/define-coding-standards.md
rm -f .claude/commands/define-ai-integration-strategy.md
rm -f .claude/commands/generate-strategy.md
rm -f .claude/commands/create-brand-strategy.md
rm -f .claude/commands/create-design.md
rm -f .claude/commands/design-database-schema.md
rm -f .claude/commands/generate-api-design.md
rm -f .claude/commands/generate-api-contracts.md
rm -f .claude/commands/create-test-strategy.md
rm -f .claude/commands/model-application.md
rm -f .claude/commands/generate-backlog.md
rm -f .claude/commands/create-gh-issues.md
rm -f .claude/commands/scaffold-project.md
rm -f .claude/commands/plan-deployment.md
rm -f .claude/commands/design-observability.md
rm -f .claude/commands/cascade-status.md
rm -f .claude/commands/run-cascade.md
rm -f .claude/commands/validate-outputs.md
rm -f .claude/commands/discover-naming.md
rm -f .claude/commands/design-user-experience.md
rm -f .claude/commands/define-messaging.md
rm -f .claude/commands/create-content-guidelines.md
rm -f .claude/commands/design-brand-identity.md
rm -f .claude/commands/setup-analytics.md
rm -f .claude/commands/design-growth-strategy.md
rm -f .claude/commands/create-financial-model.md
rm -f .claude/commands/create-compliance-plan.md
```

**Keep 8 development commands:**
- plan-issue.md (plan implementations from GitHub issues)
- implement-issue.md (implement issues following approved plans)
- review-code.md (code review framework)
- review-pr.md (PR review with framework validation)
- address-review.md (apply review feedback to PR)
- update-claudemd.md (evolve CLAUDE.md as codebase grows)
- fix-bug.md (hypothesis-driven debugging)
- distill-logs.md (extract essential info from verbose logs)

**Delete directories:**
```bash
rm -rf templates/
rm -rf aspects/
rm -rf examples/
```

**Delete framework documentation:**
```bash
rm -f README.md
rm -f COMMAND-REFERENCE.md
rm -f VALIDATION-CHECKLIST.md  # Framework validation checklist, not needed in foundation mode
```

**Keep agents (useful for future operations):**
- .claude/agents/distill-context.md
- .claude/agents/track-failures.md
- .claude/agents/validate-progress.md
- .claude/agents/summarize-logs.md

### Step 4: Generate Foundation CLAUDE.md

Create a product-focused CLAUDE.md by extracting key information from product-guidelines context files.

**Read these context files:**
- product-guidelines/00-user-journey.ctx.md (product description, target users)
- product-guidelines/02-tech-stack.ctx.md (technology choices)
- product-guidelines/02b-coding-standards.ctx.md (coding patterns, file organization)
- product-guidelines/04-architecture.ctx.md (architecture principles)
- product-guidelines/09-test-strategy.ctx.md (testing standards)

**Generate CLAUDE.md with this structure:**

```markdown
# CLAUDE.md

## What is This Project?

[Extract product description from 00-user-journey.ctx.md - who uses this, what problem it solves, key value proposition]

## Product Guidelines

This project was generated using the Stack-Driven framework. Product guidelines are committed to the repository in `product-guidelines/`:

**Core Guidelines (Read These):**
- `00-user-journey.ctx.md` - User journey and value delivery
- `01-product-strategy.ctx.md` - Market strategy and positioning
- `02-tech-stack.ctx.md` - Technology choices and rationale
- `02b-coding-standards.ctx.md` - Coding patterns and file organization
- `04-architecture.ctx.md` - Architecture principles
- `06-design-system.ctx.md` - UI components and styling
- `07-database-schema.ctx.md` - Database tables and relationships
- `08-api-design.ctx.md` - API design decisions
- `08b-api-contracts.ctx.md` - API endpoints and specifications
- `09-test-strategy.ctx.md` - Testing approach and coverage
- `09b-application-architecture.ctx.md` - Application layer modeling

**When to read guidelines:**
- Planning features: Read `00-user-journey.ctx.md`, `10-backlog/`
- Writing code: Read `02b-coding-standards.ctx.md`, `04-architecture.ctx.md`
- Building UI: Read `06-design-system.ctx.md`
- Working with APIs: Read `08-api-contracts.ctx.md`
- Writing tests: Read `09-test-strategy.ctx.md`
- Database changes: Read `07-database-schema.ctx.md`

## Development Workflow

### Planning Implementation
```bash
/plan-issue [issue-number]
```
- Fetches GitHub issue via `gh` CLI
- Analyzes issue and creates comprehensive plan
- Posts plan to issue for approval

### Implementing Features
```bash
/implement-issue [issue-number]
```
- Reads approved plan from issue comments
- Creates issue-linked branch
- Implements following plan exactly
- Creates PR with "Closes #[number]"

### Code Review
```bash
/review-pr [pr-number]  # Review PR and post to GitHub
/review-code            # General code review (no GitHub posting)
```
- Framework validation (VALIDATION-CHECKLIST.md)
- Code quality review (security, performance, testing)
- Posts structured review to GitHub

### Addressing Feedback
```bash
/address-review [pr-number]
```
- Apply review feedback directly to PR
- Validate tests still pass
- Update PR with changes

### Debugging
```bash
/fix-bug [issue-number]    # Hypothesis-driven debugging
/distill-logs [file-path]  # Extract essential info from logs (500+ lines → 5-10 lines)
```

### Maintenance
```bash
/update-claudemd
```
- Automatically updates this file based on code changes

## Key Principles

[Extract 3-5 key principles from product-guidelines]

[From 04-architecture.ctx.md - architecture principles]
[From 02b-coding-standards.ctx.md - coding patterns]
[From 00-user-journey.ctx.md - user-first thinking]

## Architecture Overview

[Extract high-level architecture summary from 04-architecture.ctx.md]

## Tech Stack

[Extract tech stack from 02-tech-stack.ctx.md - framework, database, deployment, etc.]

## Common Patterns

[Extract key coding patterns from 02b-coding-standards.ctx.md]
- File organization
- Naming conventions
- Error handling
- State management (if applicable)

## Testing Standards

[Extract testing standards from 09-test-strategy.ctx.md]
- Test levels (unit, integration, E2E)
- Coverage requirements
- Key testing patterns

---

This file provides guidance to Claude Code when working with this codebase. For full product context, see `product-guidelines/`.
```

**Implementation approach:**
1. Read the 5 context files listed above
2. Extract relevant sections based on the structure above
3. Generate CLAUDE.md with product-specific content (not framework-generic)
4. Write to repository root: `CLAUDE.md`

### Step 5: Generate Product README.md

Create a product-specific README by extracting key information from product-guidelines.

**Read these files:**
- product-guidelines/00-user-journey.ctx.md (problem, solution, value proposition)
- product-guidelines/01-product-strategy.ctx.md (vision, market positioning)
- product-guidelines/02-tech-stack.md (full tech stack with versions - keep full version for detailed tech info)
- product-guidelines/04-architecture.ctx.md (high-level architecture)
- product-guidelines/10-backlog/ (extract top 5-7 P0 features)

**Generate README.md with this structure:**

```markdown
# [Product Name - extract from journey or backlog]

[One-line description from journey - what problem does this solve for whom?]

## Problem

[Extract from 00-user-journey.md - who struggles with what problem? Include quantified pain points.]

## Solution

[Extract value proposition from 00-user-journey.md - the aha moment, the transformation, the value ratio]

## Key Features

[Extract top 5-7 features from product-guidelines/10-backlog/ - focus on P0 stories that deliver core value]

- **[Feature 1]**: [Brief description]
- **[Feature 2]**: [Brief description]
- **[Feature 3]**: [Brief description]
- **[Feature 4]**: [Brief description]
- **[Feature 5]**: [Brief description]

## Tech Stack

[Extract from 02-tech-stack.md - list key technologies with brief rationale]

**Frontend:**
- [Framework] - [Why chosen]
- [UI library] - [Why chosen]

**Backend:**
- [Framework] - [Why chosen]
- [Database] - [Why chosen]

**Deployment:**
- [Platform] - [Why chosen]

**Full details:** See `product-guidelines/02-tech-stack.md`

## Getting Started

### Prerequisites

[Extract from 02-tech-stack.md - required versions]
- Node.js [version]
- [Database] [version]
- Docker (optional)

### Installation

```bash
# Clone repository
git clone [repo-url]
cd [repo-name]

# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your configuration

# Run database migrations
npm run migrate

# Start development server
npm run dev
```

[Adjust based on actual tech stack from Session 12 scaffold]

### Running Tests

```bash
npm run test        # Run all tests
npm run test:unit   # Unit tests only
npm run test:e2e    # E2E tests only
```

## Architecture

[Extract high-level architecture from 04-architecture.md - 2-3 paragraphs summarizing approach]

**Full details:** See `product-guidelines/04-architecture.md`

## Development

### Workflow

1. **Plan**: `/plan-issue [number]` - Create implementation plan
2. **Implement**: `/implement-issue [number]` - Follow approved plan
3. **Review**: `/review-pr [number]` - Get code review
4. **Address**: `/address-review [number]` - Apply feedback
5. **Merge**: Merge approved PR

### Product Guidelines

This project was generated using Stack-Driven. All product guidelines are in `product-guidelines/`:
- User journey and value proposition
- Tech stack and architecture decisions
- Design system and API contracts
- Database schema and test strategy

See `CLAUDE.md` for guidance on when to read each guideline.

## License

[If applicable - extract from product strategy or constraints]

---

Generated with [Stack-Driven](https://github.com/stack-driven/stack-driven) - User journey to production-ready system.
```

**Implementation approach:**
1. Read the files listed above
2. Extract relevant sections based on structure
3. Generate README.md with product-specific content
4. Write to repository root: `README.md`

### Step 6: Update .gitignore

Remove the exclusion of product-guidelines/ so they get committed.

**Current .gitignore contains:**
```
# Product guidelines (user-specific, not committed)
/product-guidelines/*
!product-guidelines/.gitkeep
```

**Target state:**
Remove these lines entirely (product-guidelines should be committed in foundation mode).

**Implementation:**
```bash
# Check if .gitignore has the product-guidelines exclusion
if grep -q "/product-guidelines/" .gitignore; then
  # Remove lines containing /product-guidelines/
  sed -i.bak '/\/product-guidelines\//d' .gitignore
  rm .gitignore.bak
fi
```

**Note**: Use `sed -i.bak` for macOS compatibility, then remove .bak file.

### Step 7: Create Handover Commit

Stage all changes and create a comprehensive commit message.

```bash
# Stage all changes
git add -A

# Create commit with heredoc message
git commit -m "$(cat <<'EOF'
feat: complete cascade handover to foundation mode

- Remove framework scaffolding (31 cascade commands, templates, aspects)
- Generate foundation CLAUDE.md focused on implementation
- Generate product-specific README.md
- Commit product-guidelines as foundation documentation
- Keep dev commands: plan-issue, implement-issue, review-code, update-claudemd, review-pr, address-review, fix-bug, distill-logs

Handover complete. Repository now in foundation mode for MVP implementation.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

### Step 8: Calculate After Statistics

Calculate final repository state for comparison.

```bash
# Count total files after
AFTER_FILES=$(find . -type f | wc -l | tr -d ' ')

# Calculate repository size after
AFTER_SIZE=$(du -sh . | cut -f1)

# Calculate reduction percentage
REDUCTION=$(echo "scale=1; (($BEFORE_FILES - $AFTER_FILES) * 100) / $BEFORE_FILES" | bc)
```

### Step 9: Generate Handover Report

Display comprehensive handover summary with before/after statistics.

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Handover Complete: Framework → Foundation
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

REMOVED (Framework Scaffolding)
- 31 cascade commands deleted
- templates/ directory deleted
- aspects/ directory deleted
- examples/ directory deleted
- README.md (framework) deleted
- COMMAND-REFERENCE.md deleted

GENERATED (Foundation)
- CLAUDE.md (product-focused, 80-90% shorter)
- README.md (product-specific)

COMMITTED (Product Guidelines)
- product-guidelines/ now part of repository
- All 00-14 core session outputs committed
- All .ctx.md context files committed

KEPT (Development Commands)
- plan-issue.md
- implement-issue.md
- review-code.md
- review-pr.md
- address-review.md
- update-claudemd.md
- fix-bug.md
- distill-logs.md

KEPT (Agents)
- distill-context.md
- track-failures.md
- validate-progress.md
- summarize-logs.md

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

REPOSITORY STATISTICS

Before Handover:
- Files: [BEFORE_FILES]
- Size: [BEFORE_SIZE]

After Handover:
- Files: [AFTER_FILES]
- Size: [AFTER_SIZE]

Reduction: [REDUCTION]% smaller

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PRODUCT GUIDELINES (Foundation)

Core Sessions:
- 00-user-journey.md + .ctx.md
- 01-product-strategy.md + .ctx.md
- 02a-constraints.md + .ctx.md
- 02-tech-stack.md + .ctx.md
- 02b-coding-standards.md + .ctx.md
- 03a-mission.md + .ctx.md
- 03b-metrics.md + .ctx.md
- 03c-monetization.md + .ctx.md
- 04-architecture.md + .ctx.md
- 05-brand-strategy.md + .ctx.md
- 06-design-system.md + .ctx.md
- 07-database-schema.md + .ctx.md
- 08-api-design.md + .ctx.md
- 08b-api-contracts.md + .ctx.md
- 09-test-strategy.md + .ctx.md
- 09b-application-architecture.md + .ctx.md
- 10-backlog/ (user stories)
- 12-project-scaffold.md
- 13-deployment-plan.md
- 14-observability-strategy.md

[If post-cascade extensions exist, list them here]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

NEXT STEPS

1. Review Generated Files
   - Read CLAUDE.md (product guidance for Claude Code)
   - Read README.md (product overview)

2. Begin MVP Implementation
   - Run: /plan-issue [first-issue-number]
   - Create issues from product-guidelines/10-backlog/ as needed
   - Follow implementation workflow in CLAUDE.md

3. Set Up Development Environment
   - Follow README.md setup instructions
   - Copy scaffold files from product-guidelines/12-project-scaffold/ (if exists)
   - Set up CI/CD using product-guidelines/13-deployment-plan.md
   - Implement monitoring using product-guidelines/14-observability-strategy.md

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Repository is now in foundation mode. Happy building!
```

### Step 10: Self-Destruct

Prompt user for confirmation to delete the /handover command itself.

**Display prompt:**
```
Handover complete. Delete /handover command? [Y/n]:
```

**If user confirms (Y, y, yes, or empty input):**
```bash
rm -f .claude/commands/handover.md
```

**Display:**
```
Handover command deleted. Foundation mode active.
```

**If user declines (n, no):**
```
Handover command kept. You can delete it manually later with:
rm .claude/commands/handover.md
```

## Edge Cases

### Incomplete Cascade

**If core files missing:**
```
Cascade Incomplete - Handover Aborted

Missing required files:
- product-guidelines/07-database-schema.md
- product-guidelines/08-api-design.md
- product-guidelines/08-api-design.ctx.md

You must complete all 14 core sessions before running /handover.

Next step: Run /cascade-status to see which sessions remain.

Recommendation: Use /validate-outputs to verify quality before handover.
```

### Optional Post-Cascade Extensions

If post-cascade files exist (15-brand-naming.md, 19-user-experience.md, etc.), include them in the "PRODUCT GUIDELINES (Foundation)" section of the handover report.

**Don't require them for handover** - they're optional.

### No product-guidelines Directory

If `product-guidelines/` doesn't exist at all:
```
Product guidelines directory not found.

The /handover command is for repositories that have completed the Stack-Driven cascade.

If you're using Stack-Driven:
1. Run /cascade-status to see where you are
2. Complete Sessions 1-14
3. Then run /handover

If you're not using Stack-Driven, this command isn't needed.
```

### Git Working Directory Dirty

If there are uncommitted changes before handover:
```
Uncommitted changes detected.

The /handover command will commit product-guidelines/ as part of the transition.

Current git status:
[show git status output]

Options:
1. Commit your changes first, then run /handover
2. Stash your changes, then run /handover
3. Continue anyway (handover commit will include everything)

Proceed? [y/N]:
```

If user confirms, continue. If user declines, abort.

## Important Notes

1. **One-Way Transformation**: This cannot be undone (except via git revert). Users should validate outputs BEFORE running /handover.

2. **Cascade Must Be Complete**: All 20 core files + 17 context files must exist. Missing files = abort.

3. **No Framework Recovery**: After handover, cascade commands are gone. To regenerate cascade, user must clone fresh Stack-Driven repo and copy product-guidelines/ back.

4. **Product Guidelines Become Foundation**: Previously gitignored (user-specific), now committed (product-specific).

5. **Dev Commands Remain**: plan-issue, implement-issue, review-code, etc. are still useful for MVP implementation.

6. **Self-Destruct is Final Step**: The /handover command deletes itself after displaying the report.

## Success Criteria

After successful handover:
- [ ] All 31 cascade commands deleted
- [ ] templates/ directory deleted
- [ ] aspects/ directory deleted
- [ ] examples/ directory deleted
- [ ] Framework README.md deleted
- [ ] COMMAND-REFERENCE.md deleted
- [ ] Foundation CLAUDE.md generated (product-specific, 80-100 lines)
- [ ] Product README.md generated (problem, solution, features, tech stack)
- [ ] .gitignore updated to commit product-guidelines/
- [ ] Handover commit created with detailed message
- [ ] product-guidelines/ files committed to repository
- [ ] Handover report displays before/after statistics
- [ ] 8 dev commands remain
- [ ] Agents remain (distill-context, track-failures, etc.)
- [ ] /handover command deletes itself (if user confirms)

## Output Format

IMPORTANT: Do not use emojis in generated outputs. Use plain text for all communication.
