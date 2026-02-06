---
description: Session 10b - Generate stories for one epic at a time (iterative processing)
---

# Generate Epic Stories (Session 10b)

You are responsible for iteratively generating user stories for individual epics, processing one epic at a time to avoid context exhaustion. This is the SECOND phase of Session 10, executed multiple times until all epics are processed.

## Your Role

Load the current state, identify the next unprocessed epic, generate 10-15 stories for that epic with minimal context usage (<15k tokens per epic), update tracking state, and prompt the user to continue or stop.

## Critical Philosophy

- **One Epic at a Time**: Process exactly one epic per invocation
- **Minimal Context Per Epic**: Load only essential context for the current epic
- **State Persistence**: Track progress to enable interruption and resumption
- **Quality Over Quantity**: Better to generate fewer high-quality stories than exhaust context

## Steps to Execute

### Step 1: Load and Validate Current State

Read `.cascade/session-10-state.json` to understand:
- Which epics have been processed
- Which epic is next
- Total stories generated so far
- Current processing status

If state file doesn't exist, error and tell user to run `/generate-epics` first.

### Step 1.5: Validate State Structure

**Required validation before using state:**

Verify the state file contains all required fields:
- `epics` (array) - Each epic must have `id`, `processed` (boolean), `name`, `type`
- `processed_count` (number) - Must be >= 0 and <= total epic count
- `phase` (string) - Must be one of: "epic-generation", "story-generation", "complete"
- `session` (string) - Must be "10"
- `status` (string) - Valid values

**If validation fails:**
- Display specific error about missing/invalid fields
- Example: "State file missing 'epics' array" or "'processed_count' is not a number"
- Suggest recovery options:
  1. Run `/generate-backlog --reset` to start fresh
  2. Manually fix the JSON structure
  3. Check if file was corrupted during write

**If validation passes:**
- Continue to Step 2

### Step 2: Determine Next Epic

From the state file:
1. Find the first epic where `processed: false`
2. If all epics are processed, inform user that backlog generation is complete
3. Set `current_epic` in state to the epic being processed

### Step 3: Read Minimal Epic Context

Read ONLY what's needed for the current epic (~15k tokens):

**For ALL epics, read:**
1. `product-guidelines/10a-epics.md` - Epic definitions (to understand current epic)
2. `product-guidelines/00-user-journey.ctx.md` - Journey context

**For FOUNDATION epic specifically, also read:**
3. `product-guidelines/02-tech-stack.ctx.md` - Technical choices
4. `product-guidelines/04-architecture.ctx.md` - Architecture patterns

**For BUSINESS epics specifically, also read:**
3. The specific journey steps related to this epic (identified in epic definition)
4. `product-guidelines/06-design-system.ctx.md` - If UI-related epic
5. `product-guidelines/07-database-schema.ctx.md` - If data-heavy epic

**For ENABLER epics specifically, also read:**
3. The specific technical context files relevant to the enabler type
4. `product-guidelines/09-test-strategy.ctx.md` - If quality/testing epic

### Step 4: Generate Stories for Current Epic

For the current epic, generate 10-15 user stories following this approach:

**Story Structure:**
- **ID**: `ISSUE-[epic-number]-[story-number]` (e.g., ISSUE-02-001)
- **Title**: Clear, actionable story title
- **Type**: story | spike | task | bug
- **Priority**: P0 | P1 | P2
- **Size**: XS (1-2h) | S (2-4h) | M (4-8h) | L (1-2d) | XL (2-5d)
- **Labels**: Appropriate labels from journey context
- **User Story**: "As a [persona], I want [feature], so that [value]"
- **Acceptance Criteria**: 3-5 specific, testable criteria
- **Technical Notes**: Implementation guidance

**Story Generation Rules:**
1. Start with highest priority stories (authentication, core models)
2. Follow logical build sequence (infrastructure before features)
3. Include both frontend and backend stories where applicable
4. Add testing stories (unit tests, integration tests)
5. Include documentation stories where important

### Step 5: Invoke Story Writing Agent

Call the `write-epic-stories` agent with:
- The generated story outlines for this epic
- The epic metadata (name, type, number)
- Output directory: `product-guidelines/10-backlog/issues/`

The agent will expand the outlines and write individual story files.

### Step 6: Update State File

Update `.cascade/session-10-state.json`:
1. Mark current epic as `processed: true`
2. Update `processed_count`
3. Add to `total_stories_generated`
4. Clear `current_epic`
5. Update `status` to "awaiting_continuation" or "complete"

Example updated state:
```json
{
  "session": "10",
  "phase": "story-generation",
  "epics": [
    {
      "id": "epic-01",
      "processed": true,
      "stories_generated": 15,
      "completed_at": "[timestamp]"
    },
    {
      "id": "epic-02",
      "processed": false
    }
  ],
  "processed_count": 1,
  "total_stories_generated": 15,
  "current_epic": null,
  "status": "awaiting_continuation"
}
```

### Step 7: Report Token Usage

After processing each epic, report token usage to validate architecture efficiency:

```
✅ Epic 02: User Management processed
   Stories generated: 12
   Token usage: 14.2k tokens (94% of 15k target)
   Context efficiency: Within target range ✓
```

If token usage exceeds target:
```
⚠️ Epic 03: Analytics Dashboard processed
   Stories generated: 15
   Token usage: 16.8k tokens (112% of 15k target)
   Note: Slightly exceeded target due to complex requirements
```

This helps validate the multi-phase architecture is achieving its token efficiency goals and provides transparency about resource usage.

### Step 8: Prompt for Continuation

Based on remaining epics, output one of these messages:

**If more epics remain:**
```
✅ Epic 01: Foundation Infrastructure - Complete!
Generated 15 stories for this epic.

Progress: 1 of 5 epics processed (20%)
Total stories generated: 15

Next epic: Epic 02: [Name]
Estimated stories: ~12

To continue with the next epic, run: `/generate-epic-stories`
To process all remaining epics automatically: `/generate-backlog --continue-all`
To stop and review: Check product-guidelines/10-backlog/
```

**If all epics complete:**
```
🎉 Backlog Generation Complete!

All 5 epics have been processed.
Total stories generated: 73

Summary:
- Epic 01: Foundation Infrastructure (15 stories)
- Epic 02: [Name] (12 stories)
- Epic 03: [Name] (14 stories)
- Epic 04: [Name] (16 stories)
- Epic 05: [Name] (16 stories)

The complete backlog is in: product-guidelines/10-backlog/
Next step: Run `/create-gh-issues` to push stories to GitHub.
```

## Error Handling

**No state file:**
```
❌ No state file found at .cascade/session-10-state.json

Please run `/generate-epics` first to create the epic structure.
```

**All epics already processed:**
```
✅ All epics have already been processed.

Backlog generation is complete with [N] total stories.
To regenerate, delete .cascade/session-10-state.json and run `/generate-backlog` again.
```

**Interrupted processing:**
If state shows `current_epic` is set, resume processing that epic:
```
ℹ️ Resuming Epic [N]: [Name]
Previous processing was interrupted. Continuing from where we left off...
```

## Error Recovery Documentation

### Corrupted State Files

**Symptoms:** Invalid JSON, missing required fields, or type mismatches in state file.

**Recovery Steps:**
1. Display clear error message showing which fields are invalid
2. Offer recovery options:
   - Option A: Delete state and restart (`rm .cascade/session-10-state.json && /generate-backlog`)
   - Option B: Manually fix JSON structure (preserve `processed: true` for completed epics)
   - Option C: Reconstruct state from existing `10-backlog/` files

**Example recovery prompt:**
```
❌ State file is corrupted: Missing field 'epics_generated'

Recovery options:
1. Start fresh: Delete .cascade/session-10-state.json
2. Fix manually: Add missing field to JSON
3. Reconstruct: Analyze existing 10-backlog/ files to rebuild state

Run `/generate-backlog --reset` to start over.
```

### Partial Epic Processing Failures

**Symptoms:** Story generation fails mid-epic (network issues, token limits, malformed data).

**Recovery Steps:**
1. Stories already written to disk are preserved
2. Check state file for `current_epic` field
3. Re-run `/generate-epic-stories` to complete the epic
4. Agent will detect existing stories and append only missing ones

**Example recovery:**
```
⚠️ Epic 03 partially processed (7 of 12 stories generated)

Detected existing stories in:
10-backlog/epic-03-user-management.md

Generating remaining 5 stories...
```

### Network Failures During State Updates

**Symptoms:** Command completes but state file not updated.

**Recovery Steps:**
1. State file uses atomic writes (temp file + rename)
2. Previous valid state is preserved
3. Re-run command to sync state with actual files
4. Command detects existing story files and updates state accordingly

**Example:**
```
ℹ️ Detected state/file mismatch

State shows Epic 04 as pending, but stories exist in:
10-backlog/epic-04-notifications.md (15 stories found)

Updating state to mark Epic 04 as processed...
```

### Malformed Story Data from Sub-Agent

**Symptoms:** Write-epic-stories agent returns invalid JSON or malformed story structure.

**Recovery Steps:**
1. Display error with specific epic ID and field causing issue
2. Provide path to problematic file
3. Options:
   - Manual fix: Edit the markdown file directly
   - Regenerate: Delete epic file and re-run for that epic
   - Skip: Mark epic as processed and continue with next

**Example:**
```
❌ Epic 05 story generation failed: Invalid story format

File: 10-backlog/epic-05-analytics.md
Issue: Missing 'Acceptance Criteria' section in Story 08

Options:
1. Fix manually: Edit the file and add missing sections
2. Regenerate: rm 10-backlog/epic-05-analytics.md && /generate-epic-stories
3. Skip epic: Mark as processed and continue
```

## Success Criteria

- [ ] Each invocation uses <15k tokens
- [ ] Generates 10-15 high-quality stories per epic
- [ ] State correctly tracks progress
- [ ] Can resume from any interruption
- [ ] Clear user prompts between epics
- [ ] Stories follow proper format and structure
- [ ] Total context never exceeds 40%

## Dependencies

- Requires `product-guidelines/10a-epics.md` to exist (from Session 10a)
- Requires `.cascade/session-10-state.json` to exist (from Session 10a)
- Creates story files in `product-guidelines/10-backlog/issues/`
- Updates state file after each epic completion