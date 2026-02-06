---
description: Session 7 - Design complete database schema with migrations (orchestrator)
---

# Session 7: Design Database Schema (Orchestrator)

This is **Session 7** of the cascade. You'll create a comprehensive database schema through a progressive, multi-phase approach that avoids context exhaustion. This command orchestrates 4 micro-sessions to build the schema incrementally.

## Configuration

**STATE_FILE_PATH**: `.cascade/session-7-state.json`

## Your Role

You are the orchestrator for database schema generation, managing the four-phase approach:
1. **Phase 7a**: Generate core tables with minimal context
2. **Phase 7b**: Add relationships and constraints
3. **Phase 7c**: Conditionally add special tables (i18n, integrations, multi-tenant, audit)
4. **Phase 7d**: Optimize with indexes and synthesize final schema

## Critical Philosophy

- **Progressive Building**: Each phase builds on the previous, using minimal context
- **State Persistence**: Track progress to enable interruption and resumption
- **Conditional Loading**: Only add special patterns that are actually required
- **Token Efficiency**: Target <80k tokens total vs 480k monolithic approach

## Architecture Overview

```
Session 7 Orchestrator:
├── Check for existing state (STATE_FILE_PATH)
├── If no state: Run Session 7a (core tables)
├── Run Session 7b (relationships)
├── Conditionally run Session 7c (special tables)
├── Run Session 7d (optimization & synthesis)
└── Complete with final schema + context file
```

## Steps to Execute

### Step 1: Check Current State

Check if STATE_FILE_PATH exists:

**If state file exists:**
- Read the state to understand progress
- Determine which phases are complete
- Resume from last checkpoint

**If no state file exists:**
- This is a fresh start
- Proceed to Step 2 to generate core tables

### Step 2: Generate Core Tables (If Not Done)

If `phase` is not "core-tables" completed or state doesn't exist:

```
Invoke: /generate-core-tables

This will:
1. Read minimal context (15k tokens)
2. Extract entities from journey
3. Design core table structures
4. Create 07a-core-tables.md
5. Initialize state tracking file
```

After core table generation completes, reload the state file.

### Step 3: Generate Relationships (If Not Done)

If core tables are done but relationships are not:

```
Invoke: /generate-relationships

This will:
1. Read only 07a-core-tables.md (10k tokens)
2. Design foreign keys and junction tables
3. Define cascade behaviors
4. Create 07b-relationships.md
5. Update state to mark phase complete
```

### Step 4: Check and Generate Special Tables (If Needed)

If relationships are done but special tables phase not complete:

```
Invoke: /generate-special-tables

This will:
1. Check requirements from constraints/architecture (10k tokens)
2. Determine which patterns are needed (i18n, integrations, etc.)
3. Invoke only relevant sub-agents
4. Create 07c-special-tables.md (or skip if none needed)
5. Update state with patterns applied
```

Note: This phase may be skipped entirely if no special patterns are required.

### Step 5: Optimize and Synthesize (Final Phase)

If previous phases complete but optimization not done:

```
Invoke: /generate-schema-optimization

This will:
1. Read all partial schemas (20k tokens total)
2. Design performance indexes
3. Synthesize complete schema
4. Generate migration scripts
5. Create 07-database-schema.md + .ctx.md
6. Mark session as complete
```

### Step 6: Handle User Response

After each phase completes, present options to the user:

**Options:**
1. **"continue"** - Process next phase (default)
2. **"continue all"** - Process all remaining phases automatically
3. **"stop"** - Pause processing (state saved for later)
4. **"review"** - User wants to review before continuing

**If "continue all" selected:**
- Loop through remaining phases automatically
- Show progress after each phase
- No further prompts until complete

**If "stop" or "review" selected:**
- Save state and exit
- User can resume later with `/design-database-schema`

### Step 7: Complete Schema Generation

When all phases are processed:

1. Generate final summary
2. Show statistics:
   ```
   ✅ Session 7 Complete: Database Schema Designed

   Schema Statistics:
   - Total Tables: [N]
   - Core Business Tables: [N]
   - Special Purpose Tables: [N]
   - Indexes: [N]
   - Foreign Keys: [N]

   Patterns Applied:
   - ✓ Core Tables
   - ✓ Relationships
   - [✓/✗] Internationalization
   - [✓/✗] Integrations
   - [✓/✗] Multi-tenancy
   - [✓/✗] Audit/Compliance

   Token Usage:
   - Total: ~[X]k tokens (vs ~480k monolithic)
   - Reduction: [Y]%

   Files created:
   - product-guidelines/07-database-schema.md (full)
   - product-guidelines/07-database-schema.ctx.md (condensed)

   Next step: Run `/generate-api-design` for Session 8
   ```

## State Management

**State File Path**: `.cascade/session-7-state.json`

**State Schema**:
```json
{
  "session": "7",
  "phase": "core-tables|relationships|special-tables|optimization|complete",
  "phases_completed": ["core-tables", ...],
  "status": "in-progress|complete",
  "generated_at": "ISO timestamp",
  "completed_at": "ISO timestamp (when complete)",
  "statistics": {
    "core_tables_count": number,
    "relationships_count": number,
    "special_tables_count": number,
    "patterns_applied": ["i18n", "audit", ...],
    "total_tables": number,
    "total_indexes": number
  },
  "special_patterns": {
    "i18n": boolean,
    "integrations": boolean,
    "multi_tenant": boolean,
    "audit": boolean
  },
  "token_usage": {
    "phase_7a": number,
    "phase_7b": number,
    "phase_7c": number,
    "phase_7d": number,
    "total": number
  }
}
```

**State Updates**:
- After each phase completion, update phase and statistics
- Track which special patterns were applied
- Record token usage per phase for monitoring
- Set status to "complete" only after phase 7d

## Phase Detection Logic

```python
# Pseudocode for phase detection
if not state_exists():
    next_phase = "7a-core-tables"
elif "core-tables" not in phases_completed:
    next_phase = "7a-core-tables"
elif "relationships" not in phases_completed:
    next_phase = "7b-relationships"
elif "special-tables" not in phases_completed:
    next_phase = "7c-special-tables"
elif "optimization" not in phases_completed:
    next_phase = "7d-optimization"
else:
    next_phase = "complete"
```

## Error Handling

**If micro-session fails**:
- Log which phase failed
- Save partial progress in state
- Display error and recovery instructions
- Allow retry of failed phase

**If state file corrupted**:
- Validate JSON structure on read
- If invalid, offer recovery:
  - Start fresh with `/design-database-schema --reset`
  - Manually fix JSON
  - Check file permissions

**If user interrupts**:
- State automatically saved after each phase
- Can resume anytime with `/design-database-schema`
- Will continue from last completed phase

## Important Notes

1. **Progressive approach** reduces tokens from 480k to <80k
2. **Each phase** uses minimal context by reading only what's needed
3. **Special tables** phase may be skipped if no patterns required
4. **Final synthesis** combines all parts into production-ready schema
5. **Both output files** required: .md for humans, .ctx.md for AI
6. **State persistence** enables multi-session work

## Breaking Changes from Previous Version

This refactored version changes from monolithic sub-agent invocation to progressive micro-sessions:

**Old approach** (480k tokens):
- Read all context once
- Invoke 7 sub-agents with full inheritance
- Generate complete schema in one pass

**New approach** (< 80k tokens):
- Phase 7a: Core tables (15k)
- Phase 7b: Relationships (10k)
- Phase 7c: Special tables (10k, conditional)
- Phase 7d: Optimization & synthesis (20k)
- Total: ~55k typical, <80k maximum

Users will now see 4 prompts during Session 7 but can use "continue all" for automated execution.