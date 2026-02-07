---
description: Session 11 - Push backlog issues to GitHub
---

# Session 11: Create GitHub Issues

This is **Session 11** of the cascade. You'll push the generated backlog to GitHub using a **three-phase progressive approach**: Indexing → Batch Planning → Batch Execution. This enables handling 500+ issues without context exhaustion through just-in-time loading.

## Your Role

You're orchestrating the three-phase workflow that creates GitHub issues from `product-guidelines/10-backlog/issues/*.md` using true batch isolation.

## Critical Philosophy

**True Batch Isolation**: This command uses a three-phase progressive approach to eliminate context accumulation:

**Phase 11a (Indexing)**: Scan all issue files (filenames + metadata only) → Create lightweight index (~2k tokens for 100 issues)

**Phase 11b (Batch Planning)**: Read index only → Organize into batches (epics first, 10 stories per batch) → Create batch definitions (~3k tokens)

**Phase 11c (Batch Execution)**: For each batch, read ONLY 10 issue files just-in-time (~15k tokens) → Create GitHub issues → Repeat

**Why this works**: Each batch execution is isolated (reads only 10 files), enabling 500+ issue creation without exhaustion. Context per batch: <20% regardless of total backlog size.

**Comparison to Previous Approach**:
- Old: Read ALL 50-100 files upfront (100k+ tokens) → Risk of exhaustion
- New: Read 10 files per batch just-in-time (15k tokens) → Infinite scalability

## Process

This is an **orchestrator command** that sequentially invokes three sub-commands:

### Step 1: Verify Prerequisites

Check that backlog exists:

```bash
test -d product-guidelines/10-backlog/issues && echo "Backlog found" || echo "Backlog not found"
```

If backlog not found:
```
[x] Session 11 failed: No backlog found

Prerequisites:
- Run /generate-backlog (Session 10) first to create issues

The backlog directory should exist at:
product-guidelines/10-backlog/issues/

Run: /generate-backlog
```

Stop execution if no backlog exists.

Check that `gh` CLI is available:

```bash
gh --version 2>&1 | head -1
```

If `gh` not found:
```
[x] Session 11 failed: GitHub CLI not available

Install GitHub CLI:
- macOS: brew install gh
- Linux: See https://cli.github.com/
- Windows: See https://cli.github.com/

Then authenticate: gh auth login

After installation, re-run: /create-gh-issues
```

Stop execution if `gh` CLI not available.

### Step 2: Check for Resume (Existing Progress)

Check if execution is being resumed from a previous run:

```bash
test -f .cascade/batch-progress.json && echo "Progress found" || echo "Starting fresh"
```

**If progress found**:
```
[i] Found existing progress from previous run

Progress file: .cascade/batch-progress.json

Resuming execution from batch [current_batch]...

Skipping to Phase 11c (Batch Execution) to resume.
```

Jump directly to Step 5 (Phase 11c).

**If starting fresh**:
Proceed to Step 3 (Phase 11a).

### Step 3: Phase 11a - Issue Indexing

Invoke the indexing command using SlashCommand tool:

```
SlashCommand: /create-gh-issues-index
```

This will:
- Scan all issue files in `product-guidelines/10-backlog/issues/`
- Extract metadata (IDs, titles, priorities, types)
- Create `.cascade/issue-index.json` (~2k tokens for 100 issues)

Wait for Phase 11a to complete before proceeding.

**Expected output**:
```
[✓] Session 11a complete! Issue index created.
```

### Step 4: Phase 11b - Batch Planning

Invoke the planning command using SlashCommand tool:

```
SlashCommand: /create-gh-issues-plan
```

This will:
- Read `.cascade/issue-index.json` (lightweight metadata only)
- Organize issues into batches (epics first, 10 stories per batch)
- Create `.cascade/issue-batches.json` (~3k tokens)
- Initialize `.cascade/batch-progress.json` (execution tracker)

Wait for Phase 11b to complete before proceeding.

**Expected output**:
```
[✓] Session 11b complete! Batch plan created.
```

### Step 5: Phase 11c - Batch Execution

Invoke the execution command using SlashCommand tool:

```
SlashCommand: /create-gh-issues-execute
```

This will:
- Read progress tracker to determine next batch
- For each batch:
  - Read ONLY 10 issue files just-in-time (~15k tokens)
  - Sync labels to GitHub (first batch only)
  - Create GitHub issues via `gh` CLI
  - Update progress tracker
  - Prompt user to continue or stop
- Create `product-guidelines/11-github-issues.md` completion marker when done

**User interaction**: Phase 11c will prompt after each batch:
```
Continue with next batch?

Options:
- Type "continue" or "yes" to proceed with next batch
- Type "stop" or "pause" to stop execution (progress saved, resume later)
```

Wait for Phase 11c to complete.

**Expected output**:
```
[✓] Session 11 complete! All GitHub issues created.
```

## After Completion

After all three phases complete successfully, you'll see:

```
[✓] Session 11 complete! All GitHub issues created.

FILE LOCATION: product-guidelines/11-github-issues.md

Your issues are now on GitHub, ready for development!

View issues: https://github.com/[org]/[repo]/issues

Next Steps:
1. Review issues on GitHub
2. Run /scaffold-project (Session 12) for working dev environment
3. Or start building! Prioritized backlog ready

Check cascade status: /cascade-status
```

## Important Guidelines

1. **Three-phase execution**: Indexing (scan files) → Planning (organize batches) → Execution (create issues)
2. **Just-in-time loading**: Each batch loads ONLY 10 issue files, not all files upfront
3. **User control**: Execution phase prompts after each batch for continue/stop
4. **Progress tracking**: Can pause and resume anytime via `.cascade/batch-progress.json`
5. **Context isolation**: Each batch uses <20% context regardless of total backlog size
6. **Rate limit safety**: 2-second delay between batches (30 req/min GitHub limit)
7. **Completion marker**: Creates `11-github-issues.md` when done (enables `/cascade-status` detection)
8. **Scalability**: Handles 500+ issues without context exhaustion

## Resume Support

If execution is interrupted or stopped:

```
Progress saved: .cascade/batch-progress.json

Resume anytime by running: /create-gh-issues

The orchestrator will automatically detect existing progress and skip to Phase 11c (Batch Execution) to continue from the last completed batch.
```

## Reference

- Phase 11a Command: `.claude/commands/create-gh-issues-index.md`
- Phase 11b Command: `.claude/commands/create-gh-issues-plan.md`
- Phase 11c Command: `.claude/commands/create-gh-issues-execute.md`
- Label Schema: `.github/labels.yml`

## Output Format

IMPORTANT: Do not use emojis in generated outputs. Use plain text for all communication.
