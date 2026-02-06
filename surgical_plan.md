# Root Cause Analysis & Surgical Fix for Issue #181

## Root Cause Analysis 🔍

After examining the issue and command file, I've identified the **core problem**:

### The Paradox
The `/plan-issue` command file **ALREADY contains explicit posting instructions** (lines 499-527, Steps 4b/4c/5) with:
- TodoWrite tracking for enforcement
- Mandatory posting via `gh issue comment`
- Programmatic verification gates
- Error handling for failures

**BUT** Claude isn't consistently executing these steps.

### The Real Root Cause

**Cognitive Execution Gap**: The command has a critical **execution break point** at line 453-481 where a "CRITICAL CHECKPOINT" warning block creates a mental pause that causes Claude to sometimes stop execution prematurely.

The checkpoint says:
```
⚠️ CRITICAL CHECKPOINT - READ BEFORE PROCEEDING ⚠️
You have generated plan content. The user CANNOT see this yet.
```

This checkpoint, while well-intentioned, creates an **artificial cognitive boundary** that can cause Claude to:
1. Generate the plan content
2. Read the checkpoint warning
3. Output the plan to the user (incorrectly interpreting "output" as the end goal)
4. Never reach Steps 4b/4c that actually post to GitHub

### Evidence
- Multiple failed attempts in issue comments show plans being generated but not posted
- Users consistently ask "did you post the plan?" after execution
- The command SAYS to post but Claude DOESN'T consistently do it

## Surgical Fix Plan 🛠️

### Solution: Restructure Command Flow

**Remove the cognitive break point** and create a **single atomic operation** that cannot be interrupted:

1. **Consolidate Steps 4a/4b/4c** into a single unbreakable flow
2. **Remove the checkpoint** that creates the pause
3. **Add inline enforcement** that makes posting non-optional
4. **Strengthen the TodoWrite contract** with clearer failure states

### Specific Changes to `.claude/commands/plan-issue.md`:

#### Change 1: Add Execution Contract (After line 30)

```markdown
**EXECUTION CONTRACT:** 
Claude MUST complete ALL steps including GitHub posting. 
Outputting plan text to user WITHOUT posting = FAILURE.
The plan must be visible on GitHub issue #$1 to count as complete.
```

#### Change 2: Restructure Step 4 (Replace lines 240-527)

```markdown
## Step 4: Generate Plan and Post to GitHub (ATOMIC OPERATION)

**CRITICAL: This is ONE STEP with three mandatory sub-operations that MUST complete:**
1. Generate plan content from template
2. Save to plan.md  
3. Post to GitHub via gh issue comment

**DO NOT output anything to the user until ALL THREE complete.**

### Execute NOW (do not pause between sub-steps):

[Keep existing template from lines 256-449]

# Save immediately to plan.md
cat > plan.md << 'PLAN_EOF'
[generated content]
PLAN_EOF

# Post immediately without pausing
gh issue comment $1 --body-file plan.md && \
gh issue edit $1 --add-label "planned"

# Update TodoWrite items as completed
```

#### Change 3: Remove Problematic Checkpoint

**Delete lines 453-481** (the entire "CRITICAL CHECKPOINT" warning block) that creates the cognitive break.

#### Change 4: Simplify Verification (Line 559-583)

Consolidate verification into a single check:

```markdown
## Step 5: Verify Success

Run ONE verification command:
```bash
gh issue view $1 --json comments --jq '.comments[-1].body' | head -5
```

If you see "# Plan for #$1" in the output, posting succeeded.
If not, the command failed - inform user immediately.
```

### Why This Fix Works

1. **Removes cognitive boundaries** - No checkpoint to create pause
2. **Atomic operation** - Can't stop mid-execution
3. **Clear contract** - Failure is explicitly defined
4. **Simpler flow** - Less opportunity for misinterpretation

### Testing the Fix

1. Apply changes to `.claude/commands/plan-issue.md`
2. Run `/plan-issue [test-issue-number]`
3. Verify plan posts WITHOUT user prompting
4. Confirm "planned" label added automatically

### Impact

- **Eliminates user friction** - No more "did you post?" questions
- **Aligns with documentation** - CLAUDE.md line 140 becomes accurate
- **Enables workflow** - `/implement-issue` can find plans reliably
- **Creates audit trail** - Plans visible in issue history

## Implementation Priority

**High** - This is a core framework command that blocks the plan→implement workflow. Every user encounters this friction.

**Effort**: 30 minutes (edit command file, test on 2-3 issues)

**Risk**: Low - Only affects prompt engineering, no code changes

---

✅ This fix will make `/plan-issue` behave as documented and expected, posting plans automatically to GitHub without requiring user intervention.
