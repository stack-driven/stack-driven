---
description: Execute full Stack-Driven framework automatically
---

# Run Cascade - Automated Framework Execution

You are orchestrating the Stack-Driven cascade. Your job is to **automatically execute sessions sequentially** from the current progress point, respecting dependencies and the sacred cascade order.

## Your Role

You will:
1. **Check current progress** - Determine which files exist
2. **Identify next sessions** - Based on cascade decision logic
3. **Execute sessions automatically** - Run slash commands in sequence
4. **Track progress** - Show status between sessions
5. **Stop at natural points** - Pause at logical milestones or user request

## Critical Philosophy

**The cascade order is sacred** - User journey comes first, everything flows from it. Never skip required dependencies. Each session reads outputs from previous sessions to maintain the generative cascade flow.

**This is automated execution** - Unlike `/cascade-status` which just shows status, this command RUNS the sessions for the user automatically.

## Execution Process

### Step 1: Check Current Progress

First, check which files exist in `product-guidelines/`:

```bash
ls -la product-guidelines/
```

Identify which sessions are complete based on these files:
- `00-user-journey.md` → Session 1 complete
- `01-product-strategy.md` + `01-product-strategy.ctx.md` → Session 2 complete
- `02a-constraints.md` + `02a-constraints.ctx.md` → Session 2a complete
- `02-tech-stack.md` → Session 3 complete
- `02b-coding-standards.md` + `02b-coding-standards.ctx.md` → Session 3b complete
- `02c-ai-integration-strategy.md` + `02c-ai-integration-strategy.ctx.md` → Session 3c complete (optional)
- `03a-mission.md` + `03b-metrics.md` + `03c-monetization.md` + `04-architecture.md` → Session 4 complete
- `05-brand-strategy.md` + `05-brand-strategy.ctx.md` → Session 5 complete
- `06-design-system.md` + `06-design-system.ctx.md` → Session 6 complete
- `07-database-schema.md` → Session 7 complete
- `08-api-design.md` + `08-api-design.ctx.md` → Session 8 complete
- `08b-api-contracts.md` + `08b-api-contracts.ctx.md` → Session 8b complete
- `09-test-strategy.md` → Session 9 complete
- `09b-application-architecture.md` + `09b-application-architecture.ctx.md` → Session 9b complete
- `10-backlog/` directory → Session 10 complete
- `12-project-scaffold.md` → Session 12 complete
- `13-deployment-plan.md` → Session 13 complete
- `14-observability-strategy.md` → Session 14 complete

### Step 2: Determine Next Sessions to Run

Use this decision logic to determine what to execute:

**If no files exist:**
- Start with Session 1: `/refine-journey`
- Then ask user if they want to continue to Session 2

**If only 00-user-journey.md exists:**
- Run Session 2: `/create-product-strategy`
- Then ask user if they want to continue

**If 00-01 exist (both full and context files) but not 02a:**
- Run Session 2a: `/document-constraints`
- Then ask user if they want to continue

**If 00-02a exist (both full and context files):**
- Run Session 3: `/choose-tech-stack`
- Then ask user if they want to continue

**If 00-02 exist but not 02b:**
- Run Session 3b: `/define-coding-standards`
- Then ask user if they want to continue

**If 00-02b exist (both full and context files):**
- Check if `02-tech-stack.md` contains "AI Integration: Required"
- If yes: Run Session 3c: `/define-ai-integration-strategy`
- If "AI Integration: Not Required": Run Session 4: `/generate-strategy`
- If neither (old format): Run Session 4 with note about re-running Session 3
- Then ask user if they want to continue

**If 00-02c exist (optional AI integration complete):**
- Run Session 4: `/generate-strategy`
- Then ask user if they want to continue

**If 00-04 architecture exists (Session 4 complete):**
- Run Session 5: `/create-brand-strategy`
- Then ask user if they want to continue

**If 00-05 brand exists (Session 5 complete):**
- Run Session 6: `/create-design`
- Then ask user if they want to continue

**If 00-06 design exists (Session 6 complete):**
- User has reached first major milestone
- Check Session 7 status (micro-sessions or monolithic)
- If `07-database-schema.md` exists: Session 7 complete, continue to Session 8
- If `.cascade/session-7-state.json` exists: Check micro-session progress
- Otherwise: Start Session 7 with `/generate-core-tables` (7a)
- Ask: "Continue with Session 7 or explore optional extensions?"
- Options:
  - Continue to Session 7 (database schema)
  - Run optional: `/design-user-experience`, `/setup-analytics`, `/design-growth-strategy`, `/create-financial-model`
  - Stop here

**If Session 7 in progress (state file exists):**
- Read `.cascade/session-7-state.json`
- Display micro-session progress visualization
- Identify next pending micro-session
- Execute next micro-session:
  - 7a: `/generate-core-tables` (Core Tables)
  - 7b: `/generate-relationships` (Relationships)
  - 7c: `/generate-special-tables` (Special Tables - conditional)
  - 7d: `/generate-schema-optimization` (Optimization & Synthesis)
- After each micro-session, prompt: "Continue with [next micro-session]? [yes/all/stop]"
  - yes: Run next micro-session only
  - all: Run all remaining Session 7 micro-sessions
  - stop: Pause execution
- Only proceed to Session 8 after `07-database-schema.md` exists

**If 00-07 exist (Session 7 complete):**
- Check Session 8 status (micro-sessions or monolithic)
- If `08-api-design.md` exists: Session 8 complete, continue to Session 8b
- If `.cascade/session-8-state.json` exists: Check micro-session progress
- Otherwise: Start Session 8 with `/generate-api-paradigm` (8.1)

**If Session 8 in progress (state file exists):**
- Read `.cascade/session-8-state.json`
- Display micro-session progress visualization
- Identify next pending micro-session
- Execute next micro-session:
  - 8.1: `/generate-api-paradigm` (API Paradigm)
  - 8.2: `/generate-api-security` (API Security)
  - 8.3: `/generate-api-performance` (API Performance)
  - 8.4: `/generate-api-synthesis` (API Synthesis)
- After each micro-session, prompt: "Continue with [next micro-session]? [yes/all/stop]"
  - yes: Run next micro-session only
  - all: Run all remaining Session 8 micro-sessions
  - stop: Pause execution
- Only proceed to Session 8b after `08-api-design.md` exists

**If 00-08 api design exist (both full and context files):**
- Run Session 8b: `/generate-api-contracts`
- Then ask user if they want to continue

**If 00-08b api contracts exist (both full and context files):**
- Run Session 9: `/create-test-strategy`
- Then ask user if they want to continue

**If 00-09 exist but not 09b:**
- Run Session 9b: `/model-application`
- Then ask user if they want to continue

**If 00-09b exist (both full and context files):**
- Check Session 10 status (micro-sessions or monolithic)
- If `10-backlog/` directory exists: Session 10 complete, continue to Session 11
- If `.cascade/session-10-state.json` exists: Check micro-session progress
- Otherwise: Start Session 10 with `/generate-epics` (10a)

**If Session 10 in progress (state file exists):**
- Read `.cascade/session-10-state.json`
- Display micro-session progress visualization
- Identify next pending micro-session
- Execute next micro-session:
  - 10a: `/generate-epics` (Epic Structure)
  - 10b: `/generate-epic-stories` (Stories per Epic - iterative)
- After each micro-session, prompt: "Continue with [next micro-session]? [yes/all/stop]"
  - yes: Run next micro-session only
  - all: Run all remaining Session 10 micro-sessions
  - stop: Pause execution
- Only proceed to Session 11 after `10-backlog/` directory exists

**If 00-10 backlog exists:**
- Ask user: "Run Session 11 to push to GitHub? (/create-gh-issues)"
- This requires GitHub access, so confirm first
- Check Session 11 status (micro-sessions or monolithic)
- If Session 11 already complete: Skip to Session 12
- If `.cascade/session-11-state.json` exists: Check micro-session progress
- Otherwise: Start Session 11 with `/create-gh-issues-index` (11a)

**If Session 11 in progress (state file exists):**
- Read `.cascade/session-11-state.json`
- Display micro-session progress visualization
- Identify next pending micro-session
- Execute next micro-session:
  - 11a: `/create-gh-issues-index` (Index backlog)
  - 11b: `/create-gh-issues-plan` (Plan batches)
  - 11c: `/create-gh-issues-execute` (Execute creation - iterative)
- After each micro-session, prompt: "Continue with [next micro-session]? [yes/all/stop]"
  - yes: Run next micro-session only
  - all: Run all remaining Session 11 micro-sessions
  - stop: Pause execution
- Only proceed to Session 12 after all Session 11 micro-sessions complete

**If 00-11 GitHub issues complete:**
- Run Session 12: `/scaffold-project`
- Then ask user if they want to continue

**If 00-12 scaffold exists:**
- Run Session 13: `/plan-deployment`
- Then ask user if they want to continue

**If 00-13 deployment exists:**
- Run Session 14: `/design-observability`
- After completion, celebrate - core cascade complete!

**If all 14 core sessions complete:**
- Congratulate user
- Suggest optional post-cascade extensions
- Suggest they start building

### Step 2.5: Handle Micro-Session State Tracking

**For Sessions 7, 8, 10, and 11 (decomposed into micro-sessions):**

These sessions use state files in `.cascade/` directory to track micro-session progress:
- `.cascade/session-7-state.json` - Database schema micro-sessions
- `.cascade/session-8-state.json` - API design micro-sessions
- `.cascade/session-10-state.json` - Backlog generation micro-sessions
- `.cascade/session-11-state.json` - GitHub issue creation micro-sessions

**State File Format:**
```json
{
  "session": 7,
  "status": "in_progress",
  "phases_completed": ["core-tables", "relationships"],
  "phases_remaining": ["special-tables", "optimization"],
  "current_phase": "special-tables",
  "started_at": "2026-02-07T10:00:00Z",
  "last_updated": "2026-02-07T10:30:00Z"
}
```

**Checking Micro-Session Status:**

1. **Priority Order** (check in this order):
   - First: Check if monolithic output file exists (backward compatibility)
     - Session 7: `07-database-schema.md`
     - Session 8: `08-api-design.md`
     - Session 10: `10-backlog/` directory
     - Session 11: GitHub issues pushed marker
   - Second: Check if state file exists in `.cascade/`
   - Third: Assume session not started

2. **Reading State Files:**
```bash
# Check if state file exists
if [ -f ".cascade/session-7-state.json" ]; then
  cat .cascade/session-7-state.json
fi
```

3. **Determining Next Micro-Session:**

**Session 7 Micro-Sessions:**
- Phase "core-tables" → Command: `/generate-core-tables`
- Phase "relationships" → Command: `/generate-relationships`
- Phase "special-tables" → Command: `/generate-special-tables`
- Phase "optimization" → Command: `/generate-schema-optimization`
- Complete when: `07-database-schema.md` exists

**Session 8 Micro-Sessions:**
- Phase "paradigm" → Command: `/generate-api-paradigm`
- Phase "security" → Command: `/generate-api-security`
- Phase "performance" → Command: `/generate-api-performance`
- Phase "synthesis" → Command: `/generate-api-synthesis`
- Complete when: `08-api-design.md` exists

**Session 10 Micro-Sessions:**
- Phase "epics" → Command: `/generate-epics`
- Phase "stories" → Command: `/generate-epic-stories`
- Complete when: `10-backlog/` directory exists with all files

**Session 11 Micro-Sessions:**
- Phase "index" → Command: `/create-gh-issues-index`
- Phase "plan" → Command: `/create-gh-issues-plan`
- Phase "execute" → Command: `/create-gh-issues-execute`
- Complete when: All batches pushed to GitHub

**Progress Visualization Format:**
```
Session 7 Progress: [███████░░░] 75% (3/4 phases)
  [✓] 7a: Core Tables (generate-core-tables)
  [✓] 7b: Relationships (generate-relationships)
  [✓] 7c: Special Tables (generate-special-tables)
  [→] 7d: Optimization (generate-schema-optimization) ← NEXT
```

**User Prompt Format:**
```
Continue with 7d: Optimization (generate-schema-optimization)?
  [yes]  - Run next micro-session only
  [all]  - Run all remaining micro-sessions for Session 7
  [stop] - Pause here (resume later with /run)

Your choice:
```

**Handling State File Errors:**

1. **Validate JSON format:**
   ```bash
   # Validate and capture in one step (single read + parse for efficiency)
   if [ -f ".cascade/session-7-state.json" ]; then
     if STATE=$(cat .cascade/session-7-state.json | jq . 2>/dev/null); then
       # Valid JSON - STATE already contains parsed value
     else
       # Invalid/corrupted JSON - ignore and fall back to file system
       echo "Warning: Corrupted state file, falling back to file detection"
     fi
   fi
   ```

2. **Handle specific error scenarios:**
   - If state file is corrupted or invalid JSON: Ignore it, detect from file system
   - If state file shows phase complete but output missing: Re-run that phase
   - If no state file but partial outputs exist: Reconstruct state from files

3. **Reconstructing State from Partial Outputs:**

   If state file missing but outputs exist, rebuild state from detected files:

   ```bash
   # Session 7 example: Check for partial micro-session outputs
   PHASES_COMPLETED=()
   [ -f ".cascade/07a-core-tables.md" ] && PHASES_COMPLETED+=("core-tables")
   [ -f ".cascade/07b-relationships.md" ] && PHASES_COMPLETED+=("relationships")
   [ -f ".cascade/07c-special-tables.md" ] && PHASES_COMPLETED+=("special-tables")
   [ -f ".cascade/07d-optimization.md" ] && PHASES_COMPLETED+=("optimization")

   # Determine current phase (first missing output)
   CURRENT_PHASE=""
   [ ! -f ".cascade/07a-core-tables.md" ] && CURRENT_PHASE="core-tables"
   [ -z "$CURRENT_PHASE" ] && [ ! -f ".cascade/07b-relationships.md" ] && CURRENT_PHASE="relationships"
   [ -z "$CURRENT_PHASE" ] && [ ! -f ".cascade/07c-special-tables.md" ] && CURRENT_PHASE="special-tables"
   [ -z "$CURRENT_PHASE" ] && [ ! -f ".cascade/07d-optimization.md" ] && CURRENT_PHASE="optimization"

   # Build reconstructed state object
   # (In practice, you would format this as JSON and write to .cascade/session-7-state.json)
   ```

   **Apply this pattern to all decomposed sessions:**
   - **Session 8:** Check for `.cascade/08.1-api-paradigm.md`, `.cascade/08.2-api-security.md`, etc.
   - **Session 10:** Check for `.cascade/10a-epics.md`, `.cascade/10b-stories.md`
   - **Session 11:** Check for `.cascade/11a-index.md`, `.cascade/11b-plan.md`, `.cascade/11c-execute.md`

### Step 3: Execute Sessions with Progress Tracking

For each session you're about to run:

1. **Announce the session:**
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 Executing Session X: [Session Name]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Inputs: Reading cascade inputs:
- [List files this session reads]

Outputs: Will create:
- [List files this session creates]

Time: Estimated time: [X] minutes
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

2. **Execute the session using SlashCommand tool:**
   - Use the SlashCommand tool to run the appropriate command
   - Examples: `/refine-journey`, `/create-product-strategy`, etc.

3. **After session completes, show progress:**
```
[✓] Session X Complete!

Created:
- [List new files]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 Overall Progress: X of 14 core sessions complete
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

4. **Ask about continuation:**
```
Continue to next session? (yes/no/status)
- yes: Continue to Session [X+1]
- no: Stop here (you can resume later with /run)
- status: Show full cascade status
```

### Step 4: Handle Natural Stopping Points

**Major Milestones** (pause and ask user):
1. **After Session 1** - Journey defined, ask if ready to continue
2. **After Session 4** - Tactical foundation complete, continue to brand
3. **After Session 6** - Brand & design complete, offer optional extensions or continue
4. **After Session 10** - Backlog complete, offer optional marketing extensions or continue
5. **After Session 14** - Core cascade complete, celebrate!

**Between other sessions** - Quick confirmation to continue

### Step 5: Handle Edge Cases

**If user says "stop" or "pause":**
```
[PAUSED] Cascade paused after Session X

You can resume anytime by running /run again.
It will pick up right where you left off.

Current status:
[✓] Sessions 1-X complete
[x] Sessions [X+1]-14 remaining

To see full status: /cascade-status
To continue: /run
```

**If session encounters an error:**
```
(Warning) Session X encountered an issue

Error: [Describe what happened]

Options:
1. Fix the issue and re-run /run (it will retry Session X)
2. Run the session manually: /[session-command]
3. Stop here: Check /cascade-status for current state
```

**If user has skipped sessions (missing files):**
```
(Warning) Warning: Cascade order broken

Expected files from previous sessions are missing:
- [List missing files]

The cascade works best sequentially because each session reads previous outputs.

Options:
1. Run missing sessions first (recommended)
2. Continue anyway (later sessions won't have full context)
3. Start over from Session 1

What would you like to do?
```

## Important Guidelines

1. **Actually execute commands** - Don't just tell the user what to run, USE the SlashCommand tool to run commands automatically
2. **Respect dependencies** - Never skip required prerequisites
3. **Show progress clearly** - User should always know where they are
4. **Pause at milestones** - Give user chance to breathe and review
5. **Handle interruptions gracefully** - User can stop anytime and resume later
6. **Be encouraging** - This is a journey, celebrate each milestone
7. **Track time** - Let user know estimated time for each session

## Execution Modes

### Default Mode (Sequential from Current Point)
When user runs `/run` with no arguments:
- Check current progress
- Start from next incomplete session
- Execute sessions one by one with confirmations
- Stop at major milestones

### Batch Mode (User Specifies Range)
If user says "run sessions X to Y" or "complete the cascade":
- Confirm the range
- Execute sessions in sequence
- Still pause at major milestones
- Show consolidated progress

### Resume Mode (Auto-detect)
When `/run` is run after a pause:
- Detect where user left off
- Offer to resume
- Continue from that point

## Communication Style

**Be concise but clear:**
- Show what's happening now
- Show what's next
- Show overall progress
- Ask clear yes/no questions

**Progress indicators:**
```
Core Cascade Progress: ████████░░░░░░ 57% (8/14 sessions)
```

**Visual separation:**
Use `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━` to separate sections

## Example Execution Flow

Here's what a typical run looks like:

```
Checking cascade progress...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 Current Progress
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[✓] Session 1: User Journey (00-user-journey.md)
[✓] Session 2: Product Strategy (01-product-strategy.md, 01-product-strategy.ctx.md)
[✓] Session 3: Tech Stack (02-tech-stack.md)
[x] Session 4: Tactical Foundation (not started)
[x] Sessions 7-14: Pending

Progress: ███░░░░░░░░░░░ 21% (3/14 sessions)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Next up: Session 4 - Generate Strategy
This will create mission, metrics, monetization, and architecture.

Ready to continue? (yes/no)
```

User: yes

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 Executing Session 4: Generate Strategy
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Inputs: Reading:
- product-guidelines/00-user-journey.md
- product-guidelines/01-product-strategy.md
- product-guidelines/01-product-strategy.ctx.md
- product-guidelines/02-tech-stack.md

Outputs: Will create:
- product-guidelines/03a-mission.md
- product-guidelines/03b-metrics.md
- product-guidelines/03c-monetization.md
- product-guidelines/04-architecture.md

Time: Estimated time: 15-20 minutes
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Execute /generate-strategy command]

[... Session runs interactively ...]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[✓] Session 4 Complete!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Created:
- product-guidelines/03a-mission.md
- product-guidelines/03b-metrics.md
- product-guidelines/03c-monetization.md
- product-guidelines/04-architecture.md

 Progress: ████░░░░░░░░░░ 29% (4/14 sessions)

 Major Milestone: Tactical Foundation Complete!

You now have:
[✓] User journey validated
[✓] Market strategy defined
[✓] Tech stack chosen
[✓] Mission, metrics, monetization, and architecture established

Next: Session 5 - Create Brand Strategy
Continue? (yes/no)
```

## Reference

**Core cascade order:**
1. `/refine-journey` → 00-user-journey.md
2. `/create-product-strategy` → 01-product-strategy.md, 01-product-strategy.ctx.md
2a. `/document-constraints` → 02a-constraints.md, 02a-constraints.ctx.md
3. `/choose-tech-stack` → 02-tech-stack.md
3b. `/define-coding-standards` → 02b-coding-standards.md, 02b-coding-standards.ctx.md
3c. `/define-ai-integration-strategy` → 02c-ai-integration-strategy.md (conditional)
4. `/generate-strategy` → 03a-mission, 03b-metrics, 03c-monetization, 04-architecture
5. `/create-brand-strategy` → 05-brand-strategy
6. `/create-design` → 06-design-system
7. **Session 7 - Database Schema (micro-sessions):**
   - 7a: `/generate-core-tables` → Core tables
   - 7b: `/generate-relationships` → Relationships
   - 7c: `/generate-special-tables` → Special tables (conditional)
   - 7d: `/generate-schema-optimization` → 07-database-schema.md
8. **Session 8 - API Design (micro-sessions):**
   - 8.1: `/generate-api-paradigm` → API paradigm
   - 8.2: `/generate-api-security` → API security
   - 8.3: `/generate-api-performance` → API performance
   - 8.4: `/generate-api-synthesis` → 08-api-design.md, 08-api-design.ctx.md
8b. `/generate-api-contracts` → 08b-api-contracts.md, 08b-api-contracts.ctx.md
9. `/create-test-strategy` → 09-test-strategy
9b. `/model-application` → 09b-application-architecture.md, 09b-application-architecture.ctx.md
10. **Session 10 - Backlog Generation (micro-sessions):**
   - 10a: `/generate-epics` → Epic structure
   - 10b: `/generate-epic-stories` → 10-backlog/ directory
11. **Session 11 - GitHub Issues (micro-sessions):**
   - 11a: `/create-gh-issues-index` → Index backlog
   - 11b: `/create-gh-issues-plan` → Plan batches
   - 11c: `/create-gh-issues-execute` → Push to GitHub
12. `/scaffold-project` → 12-project-scaffold
13. `/plan-deployment` → 13-deployment-plan
14. `/design-observability` → 14-observability-strategy

**Optional extensions** (offer after Session 6 or 10):
- `/design-user-experience`, `/setup-analytics`, `/design-growth-strategy`, `/create-financial-model`
- `/discover-naming`, `/define-messaging`, `/design-brand-identity`, `/create-content-guidelines`

## Implementation Notes

**Key Differences from /cascade-status:**
- `/cascade-status` = SHOWS progress, recommends next step
- `/run` = EXECUTES sessions automatically in sequence

**Use SlashCommand tool:**
When executing a session, use: `SlashCommand` tool with the command name

**Track state:**
Keep checking filesystem between sessions to track progress

**User control:**
Always give user control - they can stop anytime

Now, check the current progress and begin automatic cascade execution!

## Output Format

IMPORTANT: Do not use emojis in generated outputs. Use plain text for all communication.
