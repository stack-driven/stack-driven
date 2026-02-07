---
description: Session 11c - Execute GitHub issue creation batch by batch (iterative)
---

# Session 11c: Batch Execution

This is **Session 11c** (Batch Execution phase) of the cascade. You'll create GitHub issues batch by batch with just-in-time loading, progress tracking, and user control.

## Your Role

You're reading batch definitions, loading ONLY the issue files for the current batch, creating GitHub issues via `gh` CLI, and tracking progress. After each batch, you'll prompt the user to continue or stop.

## Critical Philosophy

**Just-In-Time Loading**: Instead of loading all 50-100 issue files upfront, we load ONLY the 10 files needed for the current batch. This achieves true context isolation - each batch execution uses ~15k tokens regardless of total backlog size.

**User Control**: After each batch, we pause and ask the user if they want to continue. This prevents runaway execution and gives users control over when to create issues (important for production repos).

**Failure Recovery**: Progress tracking enables resumption from the last completed batch if execution is interrupted.

**Why this works**: Each batch iteration reads:
- Batch definition (~300 tokens)
- 10 issue files (~15k tokens)
- Creates 10 GitHub issues via agent (~20% context)
- Updates progress and repeats

Total context per batch: <20%, enabling 500+ issue creation.

## Process

### Step 1: Verify Prerequisites

Check that batch plan and progress tracker exist:

```bash
test -f .cascade/issue-batches.json && echo "Batch plan found" || echo "Batch plan not found"
test -f .cascade/batch-progress.json && echo "Progress tracker found" || echo "Progress tracker not found"
```

If files not found:
```
[x] Session 11c failed: Batch plan or progress tracker not found

Prerequisites:
- Run /create-gh-issues-index (Session 11a) to create issue index
- Run /create-gh-issues-plan (Session 11b) to create batch plan

Missing files:
- .cascade/issue-batches.json (batch definitions)
- .cascade/batch-progress.json (progress tracker)

Run: /create-gh-issues-plan
```

Stop execution if prerequisites don't exist.

### Step 2: Check GitHub CLI Availability

Verify `gh` CLI is available and authenticated:

```bash
gh auth status 2>&1 | grep -q "Logged in" && echo "GitHub CLI authenticated" || echo "GitHub CLI not authenticated"
```

If not authenticated:
```
[x] Session 11c failed: GitHub CLI not available or not authenticated

Install and authenticate:
1. Install: brew install gh (macOS) or see https://cli.github.com/
2. Authenticate: gh auth login
3. Verify: gh auth status

Then re-run: /create-gh-issues-execute
```

Stop execution if `gh` CLI not available.

### Step 3: Read Progress Tracker

Use Read tool to load `.cascade/batch-progress.json`:

```
Read: .cascade/batch-progress.json
```

Extract:
- `total_batches`: Total number of batches
- `completed_batches`: Array of completed batch IDs
- `current_batch`: Next batch to process
- `issues_created`: Total issues created so far
- `failed_batches`: Array of failed batch IDs

If `current_batch` > `total_batches`:
```
[✓] All batches complete!

Total issues created: [X]
Completed batches: [Y] of [Z]

Proceeding to create completion marker...
```

Jump to Step 9 (Create Completion Marker).

### Step 4: Read Batch Definition

Use Read tool to load `.cascade/issue-batches.json`:

```
Read: .cascade/issue-batches.json
```

Find the batch object where `batch_id` matches `current_batch` from progress tracker.

Extract:
- `batch_id`: Batch number
- `type`: "epics" or "stories"
- `epic_id`: Epic ID (for story batches, optional)
- `description`: Human-readable description
- `issue_ids`: Array of issue IDs to process
- `issue_count`: Number of issues in batch

### Step 5: Read Issue Files for Current Batch (Just-In-Time Loading)

Use Read tool to load ONLY the issue files for `issue_ids` in current batch:

```
For each issue_id in batch.issue_ids:
  1. Lookup issue in issue-index.json to get file_path
  2. Read file: product-guidelines/10-backlog/issues/[filename]
  3. Extract full content (title, body, labels, priority)
```

This reads ONLY 10 files (~15k tokens), not all 50-100 files.

### Step 6: Sync Labels to GitHub (Before First Batch Only)

If `current_batch == 1`, sync labels before creating any issues:

```bash
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

This ensures all labels exist before issue creation.

### Step 7: Create GitHub Issues for Current Batch

For each issue in the batch, create a GitHub issue using `gh` CLI:

```bash
# For each issue:
gh issue create \
  --title "[EPIC-01] Foundation Infrastructure" \
  --body "$(cat <<'EOF'
[Full issue markdown content]
EOF
)" \
  --label "type::epic,priority::p0,domain::backend"
```

**Rate Limiting**: Sleep 0.2 seconds between issues within the batch.

**Error Handling**: If issue creation fails:
- Log the failure (issue ID, error message)
- Continue with remaining issues in batch
- Mark batch as partially failed in progress tracker

**Success Tracking**: Collect created issue URLs and numbers for reporting.

### Step 8: Update Progress Tracker

After batch completes (successfully or with failures), update `.cascade/batch-progress.json`:

**If batch succeeded (all issues created)**:
```json
{
  "initialized_at": "...",
  "total_batches": 6,
  "total_issues": 57,
  "completed_batches": [1, 2],
  "current_batch": 3,
  "issues_created": 17,
  "failed_batches": []
}
```

**If batch partially failed**:
```json
{
  "initialized_at": "...",
  "total_batches": 6,
  "total_issues": 57,
  "completed_batches": [1],
  "current_batch": 3,
  "issues_created": 7,
  "failed_batches": [
    {
      "batch_id": 2,
      "failed_issues": ["story-008", "story-009"],
      "error": "GitHub API rate limit exceeded"
    }
  ]
}
```

Increment:
- `current_batch` += 1
- `issues_created` += [number of successfully created issues]
- Append batch_id to `completed_batches`
- If failures, append to `failed_batches`

Use Edit tool to update the progress file.

### Step 8.5: Display Batch Summary

After each batch, show progress:

```
[Batch 2/6] Epic 01 stories (001-010) - Complete

Issues Created:
- [STORY-001] Database Schema Setup (#12)
- [STORY-002] API Authentication (#13)
- [STORY-003] User Registration (#14)
...
- [STORY-010] Error Handling (#21)

Batch Summary:
- Created: 10 issues
- Failed: 0 issues
- Context usage: ~18% (efficient batch execution)

Overall Progress:
- Completed: 2 of 6 batches (33%)
- Total issues created: 17 of 57 (30%)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Rate limiting: Pausing 2 seconds before next batch...
```

Sleep 2 seconds after batch completion (rate limit safety).

### Step 8.6: Prompt User to Continue

After each batch (except the last), ask the user:

```
Continue with next batch?

Next batch: Batch 3/6 - Epic 01 stories (011-015) (5 issues)

Options:
- Type "continue" or "yes" to proceed with next batch
- Type "stop" or "pause" to stop execution (progress saved, resume later)

Your choice:
```

**If user types "continue", "yes", "y", "go", "proceed"**:
- Jump back to Step 3 (Read Progress Tracker) to process next batch

**If user types "stop", "pause", "wait", "no"**:
```
[⏸] Execution paused

Progress saved to: .cascade/batch-progress.json

Resume anytime by running:
/create-gh-issues-execute

Current status:
- Completed: 2 of 6 batches
- Remaining: 4 batches ([X] issues)

Your progress is safe. No issues will be lost.
```

Stop execution and return to user.

### Step 9: Create Completion Marker (When All Batches Complete)

After the last batch completes, create `product-guidelines/11-github-issues.md`:

Use Write tool to create completion marker:

```markdown
# Session 11: GitHub Issues Created

This file marks the completion of Session 11 (GitHub issue creation).

## Summary

**Completed**: [ISO timestamp]

**Issues Created**:
- [X] epics
- [Y] stories
- Total: [Z] GitHub issues

**Batches Executed**: [N] batches

## Repository

View issues: https://github.com/[org]/[repo]/issues

**Epic Links**:
- [EPIC-01] Foundation Infrastructure: #1
- [EPIC-02] User Experience: #2
- [EPIC-03] API Development: #3
...

## Failed Issues (if any)

[If failures occurred, list them here with batch IDs and error messages]

## Next Steps

1. Review issues on GitHub
2. Optionally run /scaffold-project (Session 12) to generate working dev environment
3. Or start building! Your backlog is prioritized (P0 stories first)
4. Track metrics: Implement metrics from product-guidelines/03b-metrics.md

Check cascade status anytime: /cascade-status
```

### Step 10: Display Final Report

After completion marker is created, show final summary:

```
[✓] Session 11 complete! All GitHub issues created.

FILE LOCATION: product-guidelines/11-github-issues.md

Your Issues:
- [X] epics created
- [Y] stories created
- Total: [Z] GitHub issues

Batches Executed:
- [N] batches processed
- [M] issues per batch (average)
- Total time: ~[T] minutes

View Issues:
https://github.com/[org]/[repo]/issues

Epic Links:
- [EPIC-01] Foundation: #1
- [EPIC-02] User Experience: #2
...

Next Steps:
1. Review issues on GitHub
2. Run /scaffold-project (Session 12) for working dev environment
3. Or start building! Prioritized backlog ready

Check cascade status: /cascade-status
```

## Important Guidelines

1. **Just-in-time loading**: Read ONLY the 10 issue files for current batch, not all files
2. **User control**: Prompt after each batch for continue/stop decision
3. **Progress tracking**: Update `batch-progress.json` after each batch completes
4. **Rate limiting**: Sleep 2 seconds between batches, 0.2 seconds between issues
5. **Failure recovery**: If batch fails, log failures and continue with next batch
6. **Resume support**: Users can re-run `/create-gh-issues-execute` to resume from last completed batch
7. **Context efficiency**: Each batch should use <20% context regardless of total backlog size
8. **Completion marker**: Create `11-github-issues.md` when all batches complete (enables `/cascade-status` detection)
9. **Label sync**: Sync labels before first batch only (avoid redundant syncs)
10. **Error reporting**: Clearly report any failures with issue IDs and error messages

## Edge Cases

**If all batches already complete**:
```
[✓] All batches already complete!

Progress: .cascade/batch-progress.json shows all [N] batches finished.

Total issues created: [X]

Completion marker already exists: product-guidelines/11-github-issues.md

View issues: https://github.com/[org]/[repo]/issues

No action needed. Session 11 is complete.
```

**If GitHub API rate limit hit**:
```
[!] GitHub API rate limit exceeded during batch [X]

Error: API rate limit reached (60 req/hour for unauthenticated)

Fix:
1. Wait ~15 minutes for rate limit reset
2. Re-run /create-gh-issues-execute to resume from batch [X]

Progress saved: .cascade/batch-progress.json

Your progress is safe. Completed batches: [completed_batches]
```

**If user interrupts mid-batch**:
```
[!] Execution interrupted

Progress saved: .cascade/batch-progress.json

Completed batches: [completed_batches]
Current batch: [current_batch] (may be partially complete)

Resume anytime: /create-gh-issues-execute

Note: Some issues in batch [current_batch] may have been created.
Check GitHub issues to verify: https://github.com/[org]/[repo]/issues
```

## Fallback

If `gh` CLI fails with authentication error:

```
[x] GitHub CLI authentication failed

Error: [error message]

Fix:
1. Re-authenticate: gh auth login
2. Verify: gh auth status
3. Re-run: /create-gh-issues-execute

Your progress is saved. No issues lost.
```

## Output Format

IMPORTANT: Do not use emojis in generated outputs. Use plain text for all communication.
