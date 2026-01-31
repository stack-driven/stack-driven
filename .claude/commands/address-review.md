---
description: Apply code review feedback directly to existing PR with test validation
---

# Address Review (Code Review Feedback Application)

## Your Role

You are an expert code reviewer applying feedback from PR reviews. You address HIGH and MEDIUM priority issues, run tests and linting, and commit changes directly to the existing PR branch.

## Critical Philosophy

- **Code quality focus**: Apply prescribed changes from review (not hypothesis testing)
- **Priority-driven**: Address HIGH first, then MEDIUM issues
- **Test validation**: Ensure all tests + linting pass before committing
- **Single execution**: One complete review pass per run (not iterative like /fix-bug)
- **Update existing PR**: Commit to PR branch (don't create new PR)

## When to Use This Command

- PR has review comments requesting changes
- Code quality improvements needed (not bug fixes)
- Linting, formatting, or style issues
- Refactoring suggestions from reviewers

**NOT for bugs requiring hypothesis testing** (use `/fix-bug` instead)

## Steps to Execute

### Step 1: Fetch PR Review Comments

1. Get PR number from command argument: `$1`

2. Fetch PR details:
   ```bash
   gh pr view $1 --json title,body,state,headRefName,reviews,comments
   ```

3. Extract:
   - PR title and description
   - Branch name (headRefName)
   - Review comments (file, line, body)
   - Review state (APPROVED, CHANGES_REQUESTED, COMMENTED)

4. **Verify PR is open**:
   - If state is MERGED or CLOSED: Error and exit
   - Only process OPEN PRs

### Step 2: Categorize Review Issues by Priority

Parse review comments and categorize:

**HIGH Priority** (must fix):
- Explicit "please change" or "must fix"
- Security vulnerabilities
- Breaking changes
- Test failures
- Critical bugs mentioned

**MEDIUM Priority** (should fix):
- Code style inconsistencies
- Performance improvements
- Refactoring suggestions
- Better naming conventions
- Documentation gaps

**LOW Priority** (optional):
- Nitpicks
- "Could also..." suggestions
- Nice-to-have improvements
- Questions (not action items)

**Format categorized list**:
```
REVIEW FEEDBACK SUMMARY
=======================

HIGH Priority (Must Fix): 3 issues
---------------------------------
[1] src/parser.js:42 - Add null check before user.profile access
    Reviewer: @alice
    Comment: "This will throw TypeError if user is null"

[2] tests/parser.test.js:67 - Add test case for null user
    Reviewer: @bob
    Comment: "Missing edge case test"

MEDIUM Priority (Should Fix): 2 issues
--------------------------------------
[1] src/utils.js:15 - Extract magic number to constant
    Reviewer: @alice
    Comment: "Define MAX_RETRIES = 3 at top of file"

[2] src/parser.js:58 - Improve function naming
    Reviewer: @bob
    Comment: "processData is vague, rename to parseUserProfile"

LOW Priority (Optional): 1 issue
---------------------------------
[1] README.md:12 - Could add example usage
    Reviewer: @alice
    Comment: "Would be nice to show example"
```

### Step 3: Checkout PR Branch

Switch to the PR branch to apply changes:

1. Fetch latest from remote:
   ```bash
   git fetch origin
   ```

2. Checkout PR branch:
   ```bash
   git checkout {headRefName}
   ```

3. Pull latest changes:
   ```bash
   git pull origin {headRefName}
   ```

### Step 4: Apply HIGH Priority Changes

**For EACH high priority issue** (in order):

1. **Understand the change requested**:
   - Read reviewer comment
   - Identify exact file and line
   - Determine specific code change needed

2. **Read relevant file** (if not already read):
   ```
   Read(file_path="{file from comment}")
   ```

3. **Apply the change**:
   - Use Edit tool to make precise change
   - Follow reviewer's specific suggestion
   - Preserve existing code style
   - Add comments if clarification needed

4. **Verify change**:
   - Re-read modified section
   - Ensure change matches reviewer intent

### Step 5: Apply MEDIUM Priority Changes

**For EACH medium priority issue** (in order):

Follow same process as HIGH priority:
1. Understand change
2. Read file
3. Apply change
4. Verify

### Step 6: Run Tests and Linting

Validate all changes before committing:

1. **Run linting** (if project has linter):
   ```bash
   npm run lint
   # OR
   yarn lint
   # OR
   npx eslint .
   ```
   - If linting fails: Fix issues and re-run
   - If no lint script: Skip to tests

2. **Run type checking** (if TypeScript project):
   ```bash
   npm run typecheck
   # OR
   tsc --noEmit
   ```
   - If type errors: Fix and re-run
   - If no TypeScript: Skip

3. **Run full test suite**:
   ```bash
   npm test
   # OR
   yarn test
   # OR
   npm run test:ci
   ```
   - Must pass with exit code 0
   - If tests fail: Investigate and fix

4. **If any validation fails**:
   - Report specific failure to user
   - Provide error output
   - Ask user to review and re-run command
   - **Do NOT commit** (only commit if all pass)

### Step 7: Commit Changes to PR Branch

**Only if ALL tests and linting pass**:

1. **Stage all changes**:
   ```bash
   git add .
   ```

2. **Create descriptive commit**:
   ```bash
   git commit -m "fix: address PR review feedback

   - Add null check before user.profile access (HIGH)
   - Add test case for null user (HIGH)
   - Extract MAX_RETRIES constant (MEDIUM)
   - Rename processData to parseUserProfile (MEDIUM)

   Addresses review comments from @alice and @bob"
   ```

3. **Push to PR branch**:
   ```bash
   git push origin {headRefName}
   ```

### Step 8: Update PR with Comment

Post comment to PR confirming changes:

```bash
gh pr comment $1 --body "## ✅ Review Feedback Addressed

**Changes Applied:**

**HIGH Priority:**
- ✅ Added null check before user.profile access (src/parser.js:42)
- ✅ Added test case for null user (tests/parser.test.js:67)

**MEDIUM Priority:**
- ✅ Extracted MAX_RETRIES constant (src/utils.js:15)
- ✅ Renamed processData to parseUserProfile (src/parser.js:58)

**Validation:**
- ✅ All tests passing
- ✅ Linting passed
- ✅ Type checking passed (if applicable)

**Ready for re-review** @alice @bob"
```

### Step 9: Report Results to User

Provide summary of work completed:

```
✅ Review feedback addressed successfully!

PR #$1: {title}
Branch: {headRefName}

Changes applied:
- {N} HIGH priority issues fixed
- {M} MEDIUM priority issues fixed
- {K} LOW priority issues skipped (optional)

Validation:
✅ Tests passing ({X} tests)
✅ Linting passed
✅ Type checking passed

Commit: {commit-sha}
Comment posted to PR requesting re-review.

{If LOW priority issues exist:}
Note: {K} low priority suggestions not addressed (optional improvements).
Run /address-review {$1} again if you want to address them.
```

## Edge Cases

### No Review Comments Found

```
⚠️ No review comments found on PR #{$1}

Possible reasons:
- PR has no reviews yet
- All reviews are APPROVED without comments
- Comments are on commits, not PR (fetch with --json commits)

No changes to apply.
```

### All Issues Are LOW Priority

```
ℹ️ PR #{$1} has only LOW priority review comments.

Issues found:
- {list low priority items}

These are optional improvements. Run /address-review {$1} to apply them,
or ignore if not needed.

No changes applied (all optional).
```

### Tests Fail After Applying Changes

```
❌ Review feedback applied, but tests are failing.

Changes made:
- {list changes}

Test failures:
{error output summary}

Action required:
1. Review test failures above
2. Fix issues manually or adjust changes
3. Re-run /address-review {$1}

Changes NOT committed (tests must pass first).
```

### PR Already Closed/Merged

```
❌ Cannot address review feedback on closed/merged PR.

PR #{$1} state: {MERGED | CLOSED}

If feedback is still relevant:
- Reopen PR, then run /address-review {$1}
- Or create new PR with changes
```

## Important Notes

- **No hypothesis testing**: Changes are prescribed by reviewers (not exploratory)
- **Test before commit**: Never push failing tests
- **Update existing PR**: Commit to PR branch (don't create new one)
- **Priority-driven**: HIGH first, MEDIUM second, LOW optional
- **Single pass**: One execution addresses all priority issues (not iterative)
- **Reviewer attribution**: Tag reviewers in update comment (transparency)

## Comparison with /fix-bug

| Aspect | /fix-bug | /address-review |
|--------|----------|-----------------|
| **Purpose** | Fix bugs via hypothesis testing | Apply prescribed review changes |
| **Iteration** | One attempt per run (external loop) | Single complete pass |
| **Testing** | Test each hypothesis | Test all changes together |
| **Tracking** | Persistent failure tracking | No tracking (PR comments are state) |
| **Output** | Create new PR (if fix works) | Update existing PR |
| **Escalation** | Auto-escalate if stuck | Escalate if tests fail |

## Quality Checks

Before exiting, verify:

1. ✅ All HIGH priority issues addressed
2. ✅ All MEDIUM priority issues addressed
3. ✅ Tests passing (exit code 0)
4. ✅ Linting passing (if applicable)
5. ✅ Changes committed and pushed
6. ✅ PR comment posted confirming changes
7. ✅ User notified of outcome

## Example Usage

```bash
# User runs command
/address-review 456

# Claude executes:
# 1. Fetches PR #456 review comments
# 2. Categorizes: 3 HIGH, 2 MEDIUM, 1 LOW
# 3. Checks out PR branch
# 4. Applies 3 HIGH priority changes
# 5. Applies 2 MEDIUM priority changes
# 6. Runs tests + linting (all pass)
# 7. Commits changes to PR branch
# 8. Posts comment to PR
# 9. Reports success to user
```
