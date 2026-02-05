---
description: Session 11 - Push backlog issues to GitHub
---

# Session 11: Create GitHub Issues

This is **Session 11** of the cascade. You'll push the generated backlog to GitHub for execution using a **two-phase approach**: Planning (read story files ONCE, synthesize ISSUE-PLAN.json) → Execution (create GitHub issues in batches).

## Your Role

You're pushing issues from `product-guidelines/10-backlog/issues/*.md` to GitHub using the `gh` CLI with batched execution to avoid rate limits and context exhaustion.

## Critical Philosophy

**Research Foundation**: This command implements the research-validated embedded artifacts pattern from `reference-material/agentic-context-injection-reference-guide.md` (Lines 73-98, Grade A+):
- Planning phase: Read ALL issue files ONCE, extract metadata, synthesize into ISSUE-PLAN.json
- Human checkpoint: User reviews dry run before execution
- Execution phase: Read ONLY ISSUE-PLAN.json (NO file re-reading), create GitHub issues in batches

**Why this works**: Reading 57 issue files ONCE (planning) → synthesized to ~500-line ISSUE-PLAN.json → execution agents read 500 lines (not 6,000+ lines), achieving 100% completion for 50+ issue creation.

## Process

### PHASE 1: PLANNING (Synthesize Issue Metadata)

#### Step 1: Read Backlog Summary

```
Read: product-guidelines/10-backlog/BACKLOG.md (summary)
```

Extract:
- Total epic count
- Total story count
- Priority distribution

#### Step 2: Discover Issue Files

Use Glob or Bash to list all issue files:

```bash
ls product-guidelines/10-backlog/issues/*.md
```

Expected files:
- `epic-01-*.md`, `epic-02-*.md`, ..., `epic-0N-*.md` (epics)
- `story-001-*.md`, `story-002-*.md`, ..., `story-0NN-*.md` (stories)

Store file paths for reading.

#### Step 3: Read ALL Issue Files (ONCE)

For each discovered file, use Read tool to load content.

**Extract Metadata**:
1. **ID**: Parse from filename (e.g., `epic-01-*.md` → `epic-01`, `story-042-*.md` → `story-042`)
2. **Type**: Determine from filename prefix (`epic` vs `story`)
3. **Title**: Extract from first H1 heading (e.g., `# [EPIC-01] Foundation` → `[EPIC-01] Foundation`)
4. **Priority**: Parse from frontmatter or content (e.g., `**Priority**: P0` → `priority::p0`)
5. **Epic ID** (for stories): Parse from content (e.g., `**Journey Step**: Epic 01` → `epic-01`)
6. **Labels**: Detect from content using label detection logic (see Step 3.5)
7. **Body**: Full markdown content (will be embedded in ISSUE-PLAN.json)

Store all metadata in IssueMetadata objects.

#### Step 3.5: Label Detection Logic

For each issue, parse content to detect labels following `.github/LABELS.md` schema:

**Type Labels** (exactly 1):
- If filename starts with `epic-`: `type::epic`
- If filename starts with `story-`: `type::story`
- If mentions "Terms of Service", "Privacy Policy", "Cookie Policy", "DPA": `type::legal`

**Priority Labels** (exactly 1):
- Parse from `**Priority**: P0` → `priority::p0`
- Parse from `**Priority**: P1` → `priority::p1`
- Parse from `**Priority**: P2` → `priority::p2`

**Domain Labels** (0 to many):
- If mentions "frontend", "UI", "component", "Flutter", "React", "Vue": `domain::frontend`
- If mentions "backend", "API endpoint", "server", "FastAPI", "Express": `domain::backend`
- If mentions "database", "schema", "migration", "PostgreSQL", "MySQL": `domain::database`
- If mentions "API contract", "endpoint", "OpenAPI": `domain::api`
- If mentions "test", "testing", "Jest", "pytest": `domain::testing`
- If mentions "infrastructure", "deployment", "CI/CD", "Docker": `domain::infrastructure`
- If mentions "third-party", "integration", "webhook", "Stripe", "SendGrid": `domain::integration`
- If mentions "AI", "prompt", "RAG", "LLM", "OpenAI": `domain::ai`
- If mentions "i18n", "translation", "locale", "internationalization": `domain::i18n`
- If mentions "analytics", "metrics", "tracking", "Segment", "Mixpanel": `domain::analytics`
- If mentions "design system", "component library", "tokens": `domain::design-system`
- If mentions "legal", "compliance", "Terms", "Privacy Policy", "GDPR": `domain::legal`
- If mentions "accessibility", "a11y", "WCAG", "screen reader": `domain::accessibility`
- If mentions "documentation", "README", "guide", "docs": `domain::documentation`

Combine all detected labels into comma-separated list (e.g., `"type::story,priority::p0,domain::backend,domain::database"`).

#### Step 4: Create Batches

Partition issues into batches for rate-limit safety:

**Batch 1**: All epics (7 epics)
**Batch 2-N**: Stories grouped by epic, 10 stories per batch

Example for 50 stories across 4 epics:
- Batch 1: 7 epics
- Batch 2: Epic 01 stories 001-010 (10 stories)
- Batch 3: Epic 01 stories 011-015 (5 stories)
- Batch 4: Epic 02 stories 016-025 (10 stories)
- Batch 5: Epic 02 stories 026-030 (5 stories)
- [etc.]

Store batch definitions with batch_id, issue_ids.

#### Step 5: Synthesize ISSUE-PLAN.json

Create JSON file embedding ALL issue metadata (no file references):

**ISSUE-PLAN.json Structure**:
```json
{
  "epics": [
    {
      "id": "epic-01",
      "title": "[EPIC-01] Foundation",
      "body": "... (full markdown body embedded)",
      "labels": ["type::epic"],
      "file_path": "product-guidelines/10-backlog/issues/epic-01-foundation.md"
    },
    ...
  ],
  "stories": [
    {
      "id": "story-001",
      "epic_id": "epic-01",
      "title": "[STORY-001] Database Schema Setup",
      "body": "... (full markdown body embedded)",
      "labels": ["type::story", "priority::p0", "domain::database"],
      "file_path": "product-guidelines/10-backlog/issues/story-001-database-schema.md"
    },
    ...
  ],
  "batches": [
    {"batch_id": 1, "type": "epics", "issue_ids": ["epic-01", "epic-02", ..., "epic-07"]},
    {"batch_id": 2, "type": "stories", "epic_id": "epic-01", "issue_ids": ["story-001", ..., "story-010"]},
    ...
  ]
}
```

Write ISSUE-PLAN.json to `.github/ISSUE-PLAN.json` (ephemeral artifact, gitignored).

#### Step 6: Sync Labels to GitHub (CRITICAL)

Before creating issues, ensure all labels exist:

```bash
# Parse labels.yml and create/update labels
echo "Syncing labels to GitHub..."

while IFS= read -r line; do
  if [[ $line =~ ^-\ name:\ \"(.+)\"$ ]]; then
    name="${BASH_REMATCH[1]}"
  elif [[ $line =~ ^\ \ description:\ \"(.+)\"$ ]]; then
    description="${BASH_REMATCH[1]}"
  elif [[ $line =~ ^\ \ color:\ \"(.+)\"$ ]]; then
    color="${BASH_REMATCH[1]}"
    gh label create "$name" --description "$description" --color "$color" --force 2>/dev/null || \
    gh label edit "$name" --description "$description" --color "$color" 2>/dev/null
  fi
done < .github/labels.yml

echo "Labels synced successfully!"
```

#### Step 7: Show Dry Run (Human Checkpoint)

Display checkpoint message and PAUSE execution:

```
[CHECKPOINT] Session 11 Planning Complete

ISSUE-PLAN.json generated.

FILE LOCATION: .github/ISSUE-PLAN.json

WHAT WILL BE CREATED:
- [X] epics
- [Y] stories
- Total: [Z] GitHub issues

LABELS TO APPLY:
- Type: type::epic, type::story, type::legal
- Priority: priority::p0, priority::p1, priority::p2
- Domain: [list detected domains]

BATCHES:
- Batch 1: All epics (7 issues)
- Batch 2-N: Stories in groups of 10 ([M] batches)

RATE LIMIT SAFETY:
- 2-second delay between batches (stays under 30 req/min)

REVIEW CHECKLIST:
- [ ] Epic count matches BACKLOG.md
- [ ] Story count matches BACKLOG.md
- [ ] Labels detected correctly (check sample issues in ISSUE-PLAN.json)
- [ ] Batches partitioned by epic (logical grouping)

WHAT HAPPENS NEXT:
If you approve, I will create GitHub issues via `gh` CLI in batches.

ROLLBACK:
GitHub issues can be closed manually if needed (no automatic rollback).

Type "continue" to create GitHub issues, or "stop" to review plan first.
```

**CRITICAL**: Do NOT proceed to Phase 2 without explicit user approval.

### PHASE 2: EXECUTION (Create GitHub Issues in Batches)

#### Step 8: Wait for User Approval

If user types "continue", "proceed", "yes", "go ahead" → Proceed to Step 9.

If user types "stop", "wait", "review" → END here, user will review ISSUE-PLAN.json manually.

#### Step 9: Invoke Execution Agent for Each Batch

For each batch, use Task tool to invoke `.claude/agents/create-github-issues.md`:

```
Use Task tool with subagent_type "general-purpose":

Prompt: "Create GitHub issues for batch [X] using ISSUE-PLAN.json

INPUTS:
- ISSUE-PLAN.json path: .github/ISSUE-PLAN.json
- Batch ID: [1 OR 2 OR 3, etc.]

INSTRUCTIONS:
Follow the create-github-issues agent specification in .claude/agents/create-github-issues.md to:
1. Read ISSUE-PLAN.json (NO file re-reading)
2. Extract issues for specified batch ID
3. For each issue, execute: gh issue create --title '...' --body '...' --label '...'
4. Collect issue URLs and numbers
5. Report created issue URLs"
```

**Progress Display**: After each batch, show:
```
[Batch 1/6] Created 7 epics (https://github.com/org/repo/issues/1, ..., /issues/7)
[Batch 2/6] Created Epic 01 stories 001-010 (10 issues, /issues/8-17)
[Batch 3/6] Created Epic 01 stories 011-015 (5 issues, /issues/18-22)
...
```

**Rate Limit Handling**: Sleep 2 seconds between batch invocations (stays under 30 req/min GitHub limit).

#### Step 10: Report Completion

After all batches complete, display summary:

```
[✓] Session 11 complete! GitHub issues created.

Your Issues:
- [X] epics created
- [Y] stories created
- Total: [Z] GitHub issues

View Issues:
- All issues: https://github.com/[org]/[repo]/issues
- Epic 01: https://github.com/[org]/[repo]/issues/1
- Epic 02: https://github.com/[org]/[repo]/issues/2
...

Next Steps:
1. Review issues on GitHub
2. Optionally run /scaffold-project (Session 12) to generate working dev environment
3. Or start building! Your backlog is prioritized (P0 stories first)
4. Track metrics: Implement metrics from product-guidelines/03b-metrics.md

Check cascade anytime: /cascade-status
```

## After Generation

```
[✓] Session 11 complete! GitHub issues created.

Your issues are now on GitHub, ready for development!

Next, you can optionally generate a working development environment with:
/scaffold-project

Or start building immediately with your prioritized backlog!
```

## Important Guidelines

1. **Two-phase execution**: Planning (read files once, synthesize JSON) → Execution (read JSON, create batches)
2. **Human checkpoint REQUIRED**: User must approve dry run before GitHub issue creation
3. **Embed ALL metadata**: ISSUE-PLAN.json must contain issue bodies, labels, no file references
4. **Batch processing**: 10 issues per batch (prevents rate limits)
5. **Progress visibility**: Show batch completion status after each agent invocation
6. **Rate limit safety**: 2-second delay between batches (30 req/min limit)
7. **Label sync CRITICAL**: Run label sync before issue creation (prevents "label not found" errors)

## Fallback

If `gh` CLI not available or fails:
```
[x] GitHub CLI not available

Option 1: Install gh CLI
brew install gh (macOS)
Then run: gh auth login

Option 2: Manual Import
I've created all issues in product-guidelines/10-backlog/issues/
You can manually create GitHub issues from these markdown files.
```

## Reference

- Execution Agent: `/.claude/agents/create-github-issues.md`
- Label Schema: `.github/LABELS.md`
- Research: `reference-material/agentic-context-injection-reference-guide.md` (Lines 73-98)

## Output Format

IMPORTANT: Do not use emojis in generated outputs. Use plain text for all communication.
