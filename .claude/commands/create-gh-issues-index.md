---
description: Session 11a - Index backlog issues for batch processing
---

# Session 11a: Issue Indexing

This is **Session 11a** (Issue Indexing phase) of the cascade. You'll create a lightweight index of all backlog issues to enable batch processing without loading all file contents upfront.

## Your Role

You're scanning `product-guidelines/10-backlog/issues/*.md` files and creating a lightweight index containing ONLY metadata (IDs, titles, priorities, types). This eliminates the need to read all 50-100 issue files in subsequent phases.

## Critical Philosophy

**Just-In-Time Loading**: Instead of loading all issue files upfront (100k+ tokens), we create an index first (~2k tokens) that contains only the essential metadata needed for batch planning. File contents are loaded later, only when needed for execution.

**Why this works**: Scanning 100 files for metadata (~20 lines per file) uses ~15k tokens. The resulting index (`issue-index.json`) is ~2k tokens for 100 issues. This 7x reduction enables Phase 11b to plan batches without exhausting context.

## Process

### Step 1: Verify Prerequisites

Check that backlog exists:

```bash
ls product-guidelines/10-backlog/issues/*.md 2>/dev/null | wc -l
```

If no files found:
```
[x] Session 11a failed: No backlog issues found

Prerequisites:
- Run /generate-backlog (Session 10) first to create issues

The backlog directory should contain:
- epic-01-*.md, epic-02-*.md, ..., epic-0N-*.md
- story-001-*.md, story-002-*.md, ..., story-0NN-*.md

Run: /generate-backlog
```

Stop execution if no backlog exists.

### Step 2: Create .cascade Directory

Ensure the state directory exists:

```bash
mkdir -p .cascade
```

This directory is gitignored and used for ephemeral state tracking.

### Step 3: Discover Issue Files

Use Glob to list all issue files:

```bash
ls product-guidelines/10-backlog/issues/*.md
```

Expected patterns:
- `epic-01-*.md`, `epic-02-*.md`, ..., `epic-0N-*.md` (epics)
- `story-001-*.md`, `story-002-*.md`, ..., `story-0NN-*.md` (stories)

Store file paths for reading.

### Step 4: Extract Metadata from Each File

For each discovered file, use Read tool to load ONLY the first 30 lines (metadata section):

**Read Strategy**:
```
Use Read tool with limit=30 to read only the header section
```

**Extract the following metadata**:

1. **ID**: Parse from filename
   - Example: `epic-01-foundation.md` → `epic-01`
   - Example: `story-042-api-endpoint.md` → `story-042`

2. **Type**: Determine from filename prefix
   - Starts with `epic-` → `epic`
   - Starts with `story-` → `story`

3. **Title**: Extract from first H1 heading
   - Example: `# [EPIC-01] Foundation Infrastructure` → `[EPIC-01] Foundation Infrastructure`
   - Strip leading `#` and whitespace

4. **Priority**: Parse from content
   - Look for: `**Priority**: P0` → `priority::p0`
   - Look for: `**Priority**: P1` → `priority::p1`
   - Look for: `**Priority**: P2` → `priority::p2`
   - Default to `priority::p1` if not found

5. **Epic ID** (for stories only): Parse from content
   - Look for: `**Journey Step**: Epic 01` → `epic-01`
   - Look for: `**Epic**: EPIC-01` → `epic-01`
   - Normalize to lowercase with hyphen (e.g., `epic-01`)

6. **File Path**: Store relative path from repo root
   - Example: `product-guidelines/10-backlog/issues/story-042-api-endpoint.md`

**Important**: Do NOT read the full file content. Read only the first 30 lines to extract metadata. This keeps context usage minimal.

### Step 5: Build Issue Index Structure

Create a JSON structure containing all metadata:

```json
{
  "indexed_at": "2025-02-07T10:30:00Z",
  "total_issues": 57,
  "epics_count": 7,
  "stories_count": 50,
  "issues": [
    {
      "id": "epic-01",
      "type": "epic",
      "title": "[EPIC-01] Foundation Infrastructure",
      "priority": "priority::p0",
      "file_path": "product-guidelines/10-backlog/issues/epic-01-foundation.md"
    },
    {
      "id": "story-001",
      "type": "story",
      "epic_id": "epic-01",
      "title": "[STORY-001] Database Schema Setup",
      "priority": "priority::p0",
      "file_path": "product-guidelines/10-backlog/issues/story-001-database-schema.md"
    },
    ...
  ]
}
```

### Step 6: Write Issue Index File

Use Write tool to create `.cascade/issue-index.json`:

```json
{
  "indexed_at": "[ISO 8601 timestamp]",
  "total_issues": [count],
  "epics_count": [epic count],
  "stories_count": [story count],
  "issues": [array of issue metadata objects]
}
```

This file should be ~2k tokens for 100 issues (20 bytes per issue metadata entry).

### Step 7: Display Summary

Show checkpoint message:

```
[✓] Session 11a complete! Issue index created.

FILE LOCATION: .cascade/issue-index.json

INDEXED ISSUES:
- [X] epics
- [Y] stories
- Total: [Z] issues

PRIORITY DISTRIBUTION:
- P0: [count] issues
- P1: [count] issues
- P2: [count] issues

FILE SIZE: ~[N]k tokens (lightweight metadata only)

NEXT STEP:
Run /create-gh-issues-plan (Session 11b) to organize issues into batches.

Or run /create-gh-issues to execute the full workflow automatically.
```

## Important Guidelines

1. **Read only metadata**: Use `Read` with `limit=30` to read only the header section (first 30 lines)
2. **Fail fast**: If no backlog exists, stop immediately with clear error message
3. **Normalize IDs**: Ensure epic IDs are lowercase with hyphens (e.g., `epic-01`, not `EPIC-01`)
4. **Priority handling**: Default to `priority::p1` if priority not found in file
5. **Context efficiency**: Index creation should use <20% context for 100 issues
6. **Ephemeral state**: `.cascade/issue-index.json` is gitignored and regenerated each run

## Fallback

If Read tool fails or files are malformed:

```
[x] Session 11a failed: Could not read issue file [filename]

Error: [error message]

Fix: Check that issue files follow the expected format:
- H1 heading with title (e.g., # [EPIC-01] Title)
- Priority metadata (e.g., **Priority**: P0)
- Valid filename format (e.g., epic-01-*.md or story-001-*.md)

You can manually fix the issue file and re-run /create-gh-issues-index.
```

## Output Format

IMPORTANT: Do not use emojis in generated outputs. Use plain text for all communication.
