---
description: Session 11b - Plan batch organization for GitHub issue creation
---

# Session 11b: Batch Planning

This is **Session 11b** (Batch Planning phase) of the cascade. You'll read the lightweight issue index and organize issues into batches for safe, rate-limited execution.

## Your Role

You're reading `.cascade/issue-index.json` (lightweight metadata) and creating batch definitions that group issues for execution. Epics are created first, then stories are grouped by epic with 10 issues per batch.

## Critical Philosophy

**Batch Organization**: GitHub has rate limits (30 requests/minute). By organizing issues into batches BEFORE execution, we can:
1. Create all epics first (so stories can reference parent epic numbers)
2. Group stories by epic (logical organization)
3. Limit batch size to 10 issues (safe rate limiting with 2-second delays)
4. Enable progress tracking and failure recovery

**Why this works**: Planning phase reads only the index (~2k tokens) to create batch definitions (~3k tokens). Execution phase then processes one batch at a time (10 issues = ~15k tokens), never loading all issues simultaneously.

## Process

### Step 1: Verify Prerequisites

Check that issue index exists:

```bash
test -f .cascade/issue-index.json && echo "Index found" || echo "Index not found"
```

If index not found:
```
[x] Session 11b failed: Issue index not found

Prerequisites:
- Run /create-gh-issues-index (Session 11a) first to create the index

The index file should exist at:
.cascade/issue-index.json

Run: /create-gh-issues-index
```

Stop execution if index doesn't exist.

### Step 2: Read Issue Index

Use Read tool to load `.cascade/issue-index.json`:

```
Read: .cascade/issue-index.json
```

Extract:
- `total_issues`: Total count
- `epics_count`: Number of epics
- `stories_count`: Number of stories
- `issues`: Array of issue metadata

This should be ~2k tokens for 100 issues.

### Step 3: Read Backlog Summary (Optional Context)

Optionally read the backlog summary for epic context:

```
Read: product-guidelines/10-backlog/BACKLOG.md
```

This provides epic titles and priorities for reference during batch planning.

### Step 4: Partition Issues into Batches

Create batch definitions following this strategy:

**Batch 1**: All epics (priority order)
- Rationale: Epics must be created first so stories can reference parent epic numbers
- Size: All epics (typically 5-10 issues)
- Sort by: Priority (P0 first), then ID

**Batch 2-N**: Stories grouped by epic, 10 per batch
- Rationale: Logical grouping by epic, safe rate limiting
- Size: 10 stories per batch (last batch may have fewer)
- Sort by: Epic ID, then story priority, then story ID

**Example for 7 epics + 50 stories**:
```
Batch 1: epic-01, epic-02, ..., epic-07 (7 epics)
Batch 2: story-001 to story-010 (Epic 01, 10 stories)
Batch 3: story-011 to story-015 (Epic 01, 5 stories)
Batch 4: story-016 to story-025 (Epic 02, 10 stories)
Batch 5: story-026 to story-030 (Epic 02, 5 stories)
...
```

### Step 5: Generate Batch Definitions Structure

Create a JSON structure defining all batches:

```json
{
  "planned_at": "2025-02-07T10:35:00Z",
  "total_batches": 6,
  "total_issues": 57,
  "batches": [
    {
      "batch_id": 1,
      "type": "epics",
      "description": "All epics (priority order)",
      "issue_ids": ["epic-01", "epic-02", "epic-03", "epic-04", "epic-05", "epic-06", "epic-07"],
      "issue_count": 7
    },
    {
      "batch_id": 2,
      "type": "stories",
      "epic_id": "epic-01",
      "description": "Epic 01 stories (001-010)",
      "issue_ids": ["story-001", "story-002", ..., "story-010"],
      "issue_count": 10
    },
    {
      "batch_id": 3,
      "type": "stories",
      "epic_id": "epic-01",
      "description": "Epic 01 stories (011-015)",
      "issue_ids": ["story-011", "story-012", "story-013", "story-014", "story-015"],
      "issue_count": 5
    },
    ...
  ]
}
```

### Step 6: Write Batch Plan File

Use Write tool to create `.cascade/issue-batches.json`:

```json
{
  "planned_at": "[ISO 8601 timestamp]",
  "total_batches": [count],
  "total_issues": [count],
  "batches": [array of batch definition objects]
}
```

This file should be ~3k tokens for 100 issues across 10 batches.

### Step 7: Initialize Progress Tracker

Use Write tool to create `.cascade/batch-progress.json`:

```json
{
  "initialized_at": "[ISO 8601 timestamp]",
  "total_batches": [count],
  "total_issues": [count],
  "completed_batches": [],
  "current_batch": 1,
  "issues_created": 0,
  "failed_batches": []
}
```

This file will be updated by Session 11c as batches complete.

### Step 8: Display Summary

Show checkpoint message:

```
[✓] Session 11b complete! Batch plan created.

FILE LOCATIONS:
- .cascade/issue-batches.json (batch definitions)
- .cascade/batch-progress.json (execution tracker)

BATCH ORGANIZATION:
- Batch 1: [X] epics (all epics, priority order)
- Batches 2-[N]: [Y] stories ([M] batches of ~10 stories, grouped by epic)
- Total: [N] batches for [Z] issues

BATCH SIZE:
- Max issues per batch: 10
- Estimated tokens per batch: ~15k (safe execution)

RATE LIMITING:
- 2-second delay between batches
- Stays under GitHub limit (30 req/min)

EPIC GROUPING:
- Epic 01: [count] stories ([X] batches)
- Epic 02: [count] stories ([X] batches)
- Epic 03: [count] stories ([X] batches)
...

NEXT STEP:
Run /create-gh-issues-execute (Session 11c) to start creating GitHub issues batch by batch.

Or run /create-gh-issues to execute the full workflow automatically.
```

## Important Guidelines

1. **Epics first**: Always create Batch 1 with ALL epics before any stories
2. **Epic grouping**: Group stories by their parent epic for logical organization
3. **Batch size**: Limit story batches to 10 issues maximum (rate limit safety)
4. **Priority sorting**: Within each epic, sort stories by priority (P0 first)
5. **Progress initialization**: Create `batch-progress.json` with `current_batch: 1`
6. **Context efficiency**: Planning phase should use <10% context
7. **Ephemeral state**: All `.cascade/*.json` files are gitignored and regenerated each run

## Edge Cases

**If no epics found**:
```
Warning: No epics found in index. Creating story-only batches.

All batches will be stories grouped by priority (10 per batch).
```

**If fewer than 10 stories**:
```
Note: Only [X] stories found. Creating single story batch.

Batch 2: [X] stories (all stories)
```

**If more than 500 issues**:
```
Note: [X] issues found (large backlog).

This will create [N] batches. Execution phase will process iteratively.

Estimated time: ~[M] minutes with 2-second delays between batches.
```

## Fallback

If issue index is malformed or unreadable:

```
[x] Session 11b failed: Could not read issue index

Error: [error message]

Fix: Re-run /create-gh-issues-index (Session 11a) to regenerate the index.

The index should contain:
- indexed_at: ISO timestamp
- total_issues: number
- issues: array of issue metadata

Run: /create-gh-issues-index
```

## Output Format

IMPORTANT: Do not use emojis in generated outputs. Use plain text for all communication.
