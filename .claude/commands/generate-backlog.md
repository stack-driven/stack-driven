---
description: Session 10 - Generate complete backlog from journey through to technical specs
---

# Session 10: Generate Backlog (Orchestrator)

This is **Session 10** of the cascade. You'll create a production-ready backlog where every issue traces to user value and is informed by technical specifications. This command now orchestrates a multi-phase, iterative approach to handle large backlogs without context exhaustion.

## Configuration

**STATE_FILE_PATH**: `.cascade/session-10-state.json`

## Your Role

You are the orchestrator for backlog generation, managing the two-phase approach:
1. **Phase 10a**: Generate epic structure with minimal context
2. **Phase 10b**: Iteratively generate stories for each epic

## Critical Philosophy

- **Epic-by-Epic Processing**: Never load all stories into context at once
- **State Persistence**: Track progress to enable interruption and resumption
- **Minimal Context**: Each phase uses only essential context (<20k for epics, <15k per epic)
- **User Control**: Checkpoints between epics for review and continuation

## Architecture Overview

```
Session 10 Orchestrator:
├── Check for existing state (STATE_FILE_PATH)
├── If no state: Run Session 10a (generate epics)
├── Loop: Run Session 10b for each unprocessed epic
├── User prompts between epics (continue/stop)
└── Complete when all epics processed
```

## Steps to Execute

### Step 1: Check Current State

Check if STATE_FILE_PATH (`.cascade/session-10-state.json`) exists:

**If state file exists:**
- Read the state to understand progress
- Determine if epic generation is complete
- Check how many epics have been processed
- Resume from last checkpoint

**If no state file exists:**
- This is a fresh start
- Proceed to Step 2 to generate epics

### Step 2: Generate Epic Structure (If Not Done)

If `epics_generated` is false or state doesn't exist:

```
Invoke: /generate-epics

This will:
1. Read minimal context (20k tokens)
2. Extract activities from journey
3. Generate epic definitions
4. Create 10a-epics.md
5. Initialize state tracking file
```

After epic generation completes, reload the state file.

### Step 3: Check Processing Status

Read STATE_FILE_PATH and determine:
- Total number of epics
- Number of epics processed
- Total stories generated so far
- Next epic to process

**If all epics are processed:**
- Jump to Step 6 (completion)

**If epics remain:**
- Continue to Step 4

### Step 4: Process Next Epic

For the next unprocessed epic:

```
Invoke: /generate-epic-stories

This will:
1. Load state and identify next epic
2. Read minimal context for that epic (15k tokens)
3. Generate 10-15 stories for the epic
4. Write story files to 10-backlog/issues/
5. Update state to mark epic as processed
6. Return with continuation prompt
```

### Step 5: Handle User Response

After each epic completes, the user will see a prompt:

**Options:**
1. **"continue"** - Process next epic (go to Step 4)
2. **"continue all"** - Process all remaining epics automatically
3. **"stop"** - Pause processing (state saved for later)
4. **"review"** - User wants to review before continuing

**If "continue all" selected:**
- Loop through remaining epics automatically
- Show progress after each epic
- No further prompts until complete

**If "stop" or "review" selected:**
- Save state and exit
- User can resume later with `/generate-backlog`

### Step 6: Complete Backlog Generation

When all epics are processed:

1. Generate final summary
2. Show statistics:
   - Total epics processed
   - Total stories generated
   - Priority distribution
   - Estimated effort

3. Provide next steps:
   ```
   ✅ Session 10 Complete: Backlog Generated

   Generated [N] stories across [M] epics:
   - Epic 01: Foundation Infrastructure (15 stories)
   - Epic 02: [Name] (12 stories)
   - [Continue for all epics...]

   Priority Distribution:
   - P0: [X] stories (MVP critical)
   - P1: [Y] stories (Important)
   - P2: [Z] stories (Nice to have)

   Files created in: product-guidelines/10-backlog/

   Next step: Run `/create-gh-issues` to push stories to GitHub
   ```

## State Management

The orchestrator relies on STATE_FILE_PATH:

```json
{
  "session": "10",
  "phase": "epic-generation|story-generation|complete",
  "epics_generated": true,
  "epics": [
    {
      "id": "epic-01",
      "name": "Foundation Infrastructure",
      "processed": true,
      "stories_generated": 15
    }
  ],
  "processed_count": 1,
  "total_stories_generated": 15,
  "current_epic": null,
  "status": "awaiting_continuation|complete"
}
```

## Resumption Logic

If the user runs `/generate-backlog` after partial completion:

1. **Check state file** - Understand where we left off
2. **Skip completed work** - Don't regenerate existing epics/stories
3. **Resume from checkpoint** - Continue with next unprocessed epic
4. **Maintain progress** - Update state as we go

## Error Recovery

**If Session 10a fails:**
- Delete STATE_FILE_PATH
- Re-run `/generate-backlog` to start fresh
- Check for missing product-guidelines files that caused failure

**If Session 10b fails for an epic:**
- State shows which epic failed (check `current_epic` field)
- Can retry that specific epic by running `/generate-epic-stories`
- Or manually mark epic as processed in state file to skip it
- State file preserves already-generated stories

**Partial story generation within an epic:**
- If story generation is interrupted mid-epic:
  - Stories already written to disk are preserved
  - STATE_FILE_PATH shows last epic being processed
  - Re-run `/generate-epic-stories` to complete the epic
  - Agent will append remaining stories to existing file

**Network failures during state updates:**
- If network fails when updating state:
  - Previous state is preserved (atomic writes)
  - Epic stories already written remain valid
  - Re-run command to sync state with actual files

**Malformed story data from sub-agent:**
- If write-epic-stories agent returns invalid data:
  - Error displayed with specific epic ID
  - Manual inspection of `product-guidelines/10-backlog/epic-XX-*.md`
  - Fix malformed stories manually or delete and regenerate epic

**If state file is corrupted:**
- Detect invalid JSON with clear error message
- Show which fields are missing/invalid
- Option 1: Delete STATE_FILE_PATH and restart (`/generate-backlog --reset`)
- Option 2: Manually fix JSON structure (preserve `processed: true` for completed epics)
- Option 3: Reconstruct state from existing `10-backlog/` files

## Command Options

Support these options for advanced users:

- `/generate-backlog --continue-all` - Auto-process all remaining epics
- `/generate-backlog --reset` - Delete state and start fresh
- `/generate-backlog --status` - Show current progress without processing

## Success Metrics

The refactored approach achieves:
- **Never exceeds 40% context** per operation
- **Handles 10+ epics** without issues
- **Generates 100+ stories** successfully
- **Maintains story quality** throughout
- **Enables interruption** and resumption
- **Provides user control** at each step

## Important Notes

1. **DO NOT** try to load all stories at once (causes context exhaustion)
2. **DO NOT** skip state management (breaks resumption)
3. **DO NOT** regenerate completed epics (wastes tokens)
4. **ALWAYS** respect user choice to stop/review
5. **ALWAYS** show clear progress indicators
6. **ALWAYS** save state after each epic

## Dependencies

- `/generate-epics` (Session 10a) - Creates epic structure
- `/generate-epic-stories` (Session 10b) - Processes individual epics
- `.claude/agents/write-epic-stories.md` - Expands story outlines to files
- STATE_FILE_PATH - Tracks progress

## Output Structure

```
product-guidelines/
├── 10a-epics.md                    # Epic definitions (from 10a)
├── 10-backlog/
│   ├── issues/                     # Individual story files
│   │   ├── issue-01-001-*.md
│   │   ├── issue-01-002-*.md
│   │   └── ...
│   ├── epic-01-summary.md         # Per-epic summaries
│   ├── epic-02-summary.md
│   └── BACKLOG.md                 # Overall summary
└── .cascade/
    └── session-10-state.json      # Progress tracking
```

## Next Steps

After successful completion, the user should:
1. Review the generated backlog in `product-guidelines/10-backlog/`
2. Run `/create-gh-issues` to push stories to GitHub (Session 11)
3. Continue with `/scaffold-project` for code generation (Session 12)