---
description: Fix bugs using hypothesis-driven debugging with intelligent loop prevention
---

# Fix Bug (Hypothesis-Driven Debugging)

## Your Role

You are an expert debugger using hypothesis-driven approach with intelligent failure tracking. You test ONE hypothesis per execution, validate locally before creating PRs, and leverage persistent tracking to prevent circular debugging loops.

## Critical Philosophy

- **One attempt per execution**: Test ONE hypothesis, exit, let user decide next step (fresh context each run)
- **Test locally first**: Never create PR until tests pass (prevents PR spam)
- **Track everything**: Update tracking after EVERY attempt (persistence is key)
- **Detect duplicates**: Stop if same error 3x (escalate to human)
- **Exit strategically**: Terminate after each attempt (prevents token exhaustion)

## When to Use This Command

- Reported bugs in GitHub issues
- Failing tests in CI/CD
- Production errors requiring investigation
- Bugs that need systematic hypothesis testing

**NOT for code review feedback** (use `/address-review` instead)

## Steps to Execute

### Step 1: Fetch Bug Issue and Load Context

1. Get issue number from command argument: `$1`
2. Fetch issue details:
   ```bash
   gh issue view $1 --json title,body,labels,comments
   ```
3. Extract:
   - Bug description
   - Steps to reproduce
   - Expected vs actual behavior
   - Error logs (if provided)
   - Previous tracking comment (look for "## 🔍 Debugging Tracker")

### Step 2: Load Previous Attempts (If Exist)

1. Check for tracking file: `.claude/memory/issue-$1-attempts.json`
2. If exists:
   - Read file content
   - Count previous attempts
   - Review error signatures
   - Note hypotheses already tried
3. If doesn't exist:
   - This is attempt #1
   - Will create tracking file after testing

### Step 3: Validate Progress (Invoke Progress Validation Agent)

**ONLY if previous attempts exist** (skip on first attempt):

1. Invoke Progress Validation Agent via Task tool:
   ```
   Task(
     subagent_type="general-purpose",
     description="Validate debugging progress",
     prompt="You are the Progress Validation Agent from .claude/agents/validate-progress.md.

     Tracking file: .claude/memory/issue-$1-attempts.json

     Analyze previous attempts and determine: ADVANCING | UNCLEAR | STUCK

     Follow the agent instructions exactly. Return structured analysis."
   )
   ```

2. Read agent output:
   - Status: ADVANCING | UNCLEAR | STUCK
   - Evidence
   - Recommendation: CONTINUE | PIVOT | ESCALATE

3. **If status is STUCK**:
   - Add label "needs-human" to issue:
     ```bash
     gh issue edit $1 --add-label "needs-human"
     ```
   - Post escalation comment to issue:
     ```
     ## ⚠️ Debugging Escalation Required

     Automated debugging has reached stuck state after {N} attempts.

     **Pattern Detected:** {stuck evidence from agent}

     **Last Error:** {most recent error signature}

     **Attempts Summary:**
     {list of hypotheses tried}

     **Recommendation:** Human review required. Consider:
     - Pair programming session
     - Architecture review
     - Different debugging approach (debugger, logging, profiling)

     Automated attempts halted.
     ```
   - **EXIT IMMEDIATELY** (do not proceed to hypothesis generation)

4. If status is ADVANCING or UNCLEAR: Continue to next step

### Step 4: Generate Hypotheses About Root Cause

Generate 3-5 hypotheses about what's causing the bug:

1. **Analyze available information**:
   - Error message (type, message, location)
   - Stack trace (top frames)
   - Steps to reproduce
   - Expected vs actual behavior
   - Code context (read relevant files if needed)

2. **Generate hypotheses** (avoid previous attempts):
   - Use diverse debugging lenses:
     - Data flow: "Missing null check in data transformation"
     - Control flow: "Race condition in async operation"
     - State management: "Stale closure in event handler"
     - Integration: "API contract mismatch"
     - Environment: "Configuration missing in test env"
   - Each hypothesis should be:
     - **Specific**: Name exact function/line suspected
     - **Testable**: Can be validated with code change
     - **Distinct**: Different from previous attempts

3. **Rank by likelihood** (1=most likely):
   - Consider error location (top of stack = most likely)
   - Consider error type (TypeError → null/undefined issues)
   - Consider reproducibility (consistent → logic error, intermittent → race condition)
   - Prioritize hypotheses NOT yet tried

4. **Format hypotheses**:
   ```
   HYPOTHESES (Ranked by Likelihood)
   ==================================

   [1] Missing null check before property access
       Location: src/parser.js:42
       Evidence: TypeError "Cannot read property 'x' of undefined"
       Test: Add null guard before user.profile.x access

   [2] Async data race in user loading
       Location: src/auth.js:128
       Evidence: Error occurs intermittently in tests
       Test: Add await before accessing user object

   [3] Configuration missing in test environment
       Location: config/test.js
       Evidence: Works in dev, fails in test
       Test: Add missing env vars to test config
   ```

### Step 5: Test Top Hypothesis Locally

**Test ONLY the #1 ranked hypothesis** (one attempt per execution):

1. **Design validation test**:
   - What specific code change will test this hypothesis?
   - What should pass/fail if hypothesis is correct/incorrect?

2. **Apply fix for hypothesis**:
   - Make minimal code change to test hypothesis
   - Use Edit tool to modify file
   - Keep change focused (don't fix multiple things)

3. **Run relevant tests**:
   ```bash
   # Run tests related to bug (adjust command based on project)
   npm test -- --testPathPattern=parser
   # OR
   npm test tests/parser.test.js
   # OR
   npm test  # if targeted tests unknown
   ```

4. **Capture test output**:
   - Record full output (stdout + stderr)
   - Note exit code (0=pass, non-zero=fail)
   - Count line length of output

5. **If output > 500 lines**: Invoke Log Summarization Agent
   ```
   Task(
     subagent_type="general-purpose",
     description="Summarize test output",
     prompt="You are the Log Summarization Agent from .claude/agents/summarize-logs.md.

     Log content: {test output}

     Extract error type, message, location, stack trace, and generate error signature.
     Follow agent instructions exactly. Return structured summary."
   )
   ```
   - Use summarized output for tracking (not full 500+ lines)

### Step 6: Record Attempt (Invoke Failure Tracking Agent)

**Always invoke after testing** (pass or fail):

1. Invoke Failure Tracking Agent via Task tool:
   ```
   Task(
     subagent_type="general-purpose",
     description="Track debugging attempt",
     prompt="You are the Failure Tracking Agent from .claude/agents/track-failures.md.

     Issue number: $1
     Attempt details:
       - Hypothesis: {hypothesis #1 description}
       - Fix applied: {code change made}
       - Test result: PASSED | FAILED
       - Error type: {if failed}
       - Error message: {if failed}
       - Error location: {file:line if failed}

     Load tracking file (or create new), record attempt, detect duplicates, check escalation.
     Follow agent instructions exactly. Return tracking summary."
   )
   ```

2. Read agent output:
   - Tracking file path
   - Attempt count (e.g., "3 of 5")
   - Duplicate status (yes/no, similarity %)
   - Escalation status (triggered/not triggered)
   - Recommendation

3. **If escalation triggered**:
   - Follow Step 3 escalation procedure
   - EXIT immediately

### Step 7: Update Issue Tracking Comment

Update or create tracking comment on GitHub issue:

1. **Load existing tracking comment** (if exists):
   - Search issue comments for "## 🔍 Debugging Tracker"
   - Extract comment ID for update

2. **Generate tracking table**:
   ```markdown
   ## 🔍 Debugging Tracker

   **⚠️ AUTO-GENERATED - DO NOT EDIT MANUALLY**

   ### Attempt Log
   | # | Hypothesis | Local Test | Result | Error Sig |
   |---|-----------|------------|---------|----------|
   | 1 | Missing null check in parser | ❌ Failed | TypeError | TypeError-undefined-parser:42 |
   | 2 | Race condition in async load | ❌ Failed | TypeError | TypeError-undefined-parser:42 |
   | 3 | Config missing in test env | ✅ Passed | N/A | N/A |

   ### Status
   **Current:** 3 of 5 attempts
   **Outcome:** ✅ RESOLVED | 🔄 IN PROGRESS | ⚠️ NEEDS HUMAN

   ### Next Steps
   {If resolved: "PR created: #123"}
   {If in progress: "Re-run /fix-bug {issue} to test next hypothesis"}
   {If needs human: "Escalated - see comment above"}
   ```

3. **Post or update comment**:
   - If first attempt: Create new comment
     ```bash
     gh issue comment $1 --body "{tracking table}"
     ```
   - If subsequent attempt: Update existing comment
     ```bash
     gh issue comment {comment-id} --edit --body "{tracking table}"
     ```

### Step 8: Determine Outcome and Exit

**If tests PASSED**:

1. **Create PR with fix**:
   - Commit changes:
     ```bash
     git add .
     git commit -m "fix: {hypothesis description} (closes #$1)"
     ```
   - Push branch:
     ```bash
     git push -u origin HEAD
     ```
   - Create PR:
     ```bash
     gh pr create --title "Fix: {bug title}" --body "## Summary
     Resolves #{$1}

     ## Root Cause
     {Hypothesis #1 that worked}

     ## Fix Applied
     {Code changes made}

     ## Testing
     - [x] Tests pass locally
     - [x] Bug no longer reproducible

     Closes #$1"
     ```

2. **Update issue**:
   - Post success comment:
     ```markdown
     ## ✅ Bug Resolved

     **Root Cause:** {hypothesis description}

     **Fix:** {brief description of code change}

     **PR:** #{pr-number}

     Tests passing. Ready for review.
     ```

3. **Update tracking comment**: Set outcome to "✅ RESOLVED"

4. **Report to user**:
   ```
   ✅ Bug fixed successfully!

   Root cause: {hypothesis}
   PR created: #{pr-number}
   Tests passing.

   Debugging attempts: {N} of 5
   ```

5. **EXIT**

**If tests FAILED**:

1. **Update issue**:
   - Post attempt comment:
     ```markdown
     ## 🔄 Debugging Attempt #{N}

     **Hypothesis Tested:** {hypothesis description}

     **Fix Applied:** {code change}

     **Result:** ❌ Tests failed

     **Error:**
     ```
     {error signature}
     {error message}
     {location}
     ```

     **Next:** Run `/fix-bug {$1}` to test next hypothesis.
     ```

2. **Revert changes** (don't leave failed fix in codebase):
   ```bash
   git restore .
   ```

3. **Update tracking comment**: Increment attempt count, add row to table

4. **Report to user**:
   ```
   ❌ Hypothesis #{N} did not resolve bug.

   Hypothesis tested: {description}
   Error persists: {error signature}

   Progress: {ADVANCING | UNCLEAR | STUCK}
   Attempts: {N} of 5

   Run /fix-bug {$1} again to test next hypothesis.
   ```

5. **EXIT** (user decides whether to run again)

## Termination Conditions

Auto-escalate and EXIT when:

1. **Max attempts reached**: 5 attempts exhausted
2. **Same error 3x**: Identical error signature in 3 attempts
3. **Stuck status**: Progress Validation Agent returns STUCK
4. **Tests pass**: Bug resolved, PR created

## Example Usage

```bash
# User runs command
/fix-bug 123

# Claude executes:
# 1. Fetches issue #123
# 2. Loads tracking (if exists)
# 3. Validates progress (if prior attempts)
# 4. Generates 5 hypotheses
# 5. Tests hypothesis #1
# 6. Records attempt via Failure Tracking Agent
# 7. Updates tracking comment on issue
# 8. Creates PR (if pass) OR reports failure (if fail) and exits
```

## Important Notes

- **One attempt per run**: External loop control (user decides when to re-run)
- **Fresh context**: Each execution starts clean (no token exhaustion)
- **Test locally**: Never push until tests pass (prevents PR spam)
- **Track persistently**: Tracking file + GitHub comments (dual persistence)
- **Auto-escalate**: Stop when stuck (prevent infinite loops)
- **Hypothesis diversity**: Avoid repeating similar approaches
- **Minimal fixes**: Test hypothesis with smallest code change possible

## Error Handling

- If issue doesn't exist: Error and exit
- If tracking file corrupted: Create fresh, note in comment
- If tests won't run: Escalate immediately (can't validate)
- If gh CLI fails: Fallback to manual comment, warn user

## Quality Checks

Before exiting, verify:

1. ✅ Tracking file updated (if path returned by agent)
2. ✅ GitHub tracking comment updated (check comment ID)
3. ✅ Changes either committed (if pass) or reverted (if fail)
4. ✅ User knows next step (run again, review PR, or escalated)
