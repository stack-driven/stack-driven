---
description: DEV-TIME - Review GitHub PR with framework validation and automated posting
---

# Review PR (Development Tool)

You are reviewing a GitHub pull request with a comprehensive three-layer validation approach and automatically posting structured feedback to GitHub.

## When to Use This

**Use during development** when:
- Reviewing Stack-Driven framework pull requests
- Need automated framework consistency validation via VALIDATION-CHECKLIST.md
- Want to post structured review comments directly to GitHub
- Need systematic PR quality assessment

**This is NOT part of the cascade** - it's a development-time tool for PR workflow automation.

**For general code review without GitHub posting**, use `/review-code` instead.

## Your Task

Review the GitHub PR using a three-layer architecture, then post structured feedback as a GitHub comment.

## Three-Layer Review Architecture

### Layer 1: Framework Validation (VALIDATION-CHECKLIST.md)

Apply Stack-Driven framework consistency rules with smart detection:

**1. Read VALIDATION-CHECKLIST.md**
```bash
Read VALIDATION-CHECKLIST.md
```

**2. Detect Changed File Types**

Fetch PR diff and categorize changed files:
```bash
gh pr diff [PR-number]
```

File type mapping:
- `.claude/commands/*.md` → Apply Categories 1-4, 6-10
- `templates/*.md` → Apply Category 5
- `CLAUDE.md`, `README.md` → Apply Categories 6-7
- `.github/workflows/*.yml` → Skip framework rules (Layer 3 only)
- Other files → Layer 3 only

**3. Apply Smart Rule Detection**

Only check rules relevant to changed content:

**Category 1 (File Reference Integrity):**
- Always check for command files
- Rule 1.4 (Context vs Full): Check if file read references changed

**Category 2 (Session Numbering):**
- Check if "Session X" appears in diff
- Verify format: "Session X" or "Session Xb" (no leading zeros)

**Category 3 (Naming Consistency):**
- Check if table names mentioned (apply 3.1)
- Check if epic numbers mentioned (apply 3.2)

**Category 4 (Propagation Patterns):**
- Detect i18n keywords → check 4.1
- Detect AI keywords → check 4.2
- Detect integration keywords → check 4.3

**Category 5 (Template Alignment):**
- Only if `templates/` or `.claude/commands/` changed

**Categories 6-10:**
- Apply to relevant documentation files

**4. Report Rule Status**

For each applicable rule:
- ✅ Pass - Rule satisfied
- ⚠️ Issue - Rule violated (cite file:line)
- N/A - Rule not applicable to these changes

**Status Format:**
```markdown
## Framework Validation (VALIDATION-CHECKLIST.md)

**Tier 1 (Critical):**
- ✅ Rule 1.4 (Context vs Full File): Pass - All sessions read .ctx.md correctly
- ⚠️ Rule 2.1 (Session Numbering): Issue at CLAUDE.md:135 - "Session 8" should be "Session 8b"
- N/A Rule 3.1 (Table Name Consistency): No database changes

**Tier 2 (Important):**
- ✅ Rule 4.1 (i18n Propagation): Pass
- ✅ Rule 6.3 (Decision Matrix): Pass

**Tier 3 (Nice-to-have):**
- ⚠️ Rule 7.2 (Token Reduction): Inconsistent percentage at design-database-schema.md:1135
```

### Layer 2: PR Quality Assessment

Validate PR metadata and structure:

**1. Fetch PR Metadata**
```bash
gh pr view [PR-number] --json title,body,headRefName,baseRefName,commits,reviews,statusCheckRollup
```

**2. Check:**
- **Linked Issue:** Does PR body contain "Closes #X" or "Fixes #X"?
- **CI Status:** Are all status checks passing?
- **Diff Scope:** How many files changed? Lines added/removed?
- **Commit Messages:** Do commits follow conventional format (feat:, fix:, docs:)?
- **Branch Naming:** Does branch follow convention (feature/*, fix/*, [issue-number]-*)?

**3. Report:**
```markdown
## PR Quality Assessment

**Linked Issue:** ✅ Closes #123
**CI Status:** ✅ Passing (3/3 checks)
**Diff Scope:** 5 files changed, +127/-43 lines
**Commit Messages:** ⚠️ 1 commit missing conventional format
**Branch Naming:** ✅ Follows convention (137-pr-review-command)
```

### Layer 3: Code Quality Review

Apply general code review framework:

**1. Security Review**
- SQL injection vulnerabilities?
- XSS vulnerabilities?
- Authentication/authorization issues?
- Sensitive data exposure?
- Input validation missing?

**2. Performance Review**
- N+1 query problems?
- Unnecessary loops or iterations?
- Missing caching opportunities?
- Inefficient data structures?

**3. Testing Review**
- Are tests included?
- Do tests cover happy path?
- Do tests cover edge cases?
- Are tests readable?

**4. Error Handling**
- Are errors caught appropriately?
- Are error messages helpful?
- Are failures logged?
- Are resources cleaned up?

**5. Code Quality**
- Readability and maintainability
- Naming conventions
- Function sizing
- Documentation completeness

## Review Output Format

Generate structured markdown review:

```markdown
# PR Review: [PR Title]

**Review Round:** X of 5
**Reviewer:** Claude Code
**Date:** YYYY-MM-DD

---

## Summary

This PR [brief description]. Found [X] critical issues, [Y] important suggestions, [Z] nits.

**Recommendation:** [Request Changes | Approve with Comments | Approve]

---

[Layer 1 Output: Framework Validation]

---

[Layer 2 Output: PR Quality Assessment]

---

## Code Quality Review

### High Priority (Must Fix)

**1. [Issue Title]**
- **File:** `path/to/file.ts:42`
- **Severity:** Security | Performance | Correctness
- **Issue:** [Description]
- **Fix:**
  ```[language]
  // Suggested change
  ```
- **Why:** [Rationale]

### Medium Priority (Should Fix)

[Similar structure]

### Low Priority (Nits)

[Similar structure]

---

## What's Done Well

- [Positive feedback point 1]
- [Positive feedback point 2]

---

## Next Steps

1. Address [X] high priority issues
2. Review [Y] medium priority suggestions
3. Update PR and request re-review

If you have questions about any feedback, reply to this comment.
```

## GitHub Integration

### Posting Review

**1. Save Review to Temporary File**
```bash
# Create review.md with generated content
```

**2. Post to GitHub**
```bash
gh pr comment [PR-number] --body-file review.md
```

**3. Clean Up**
```bash
rm review.md
```

### Iteration Tracking

**1. Count Existing Claude Code Comments**
```bash
gh pr view [PR-number] --json comments --jq '[.comments[] | select(.author.login == "github-actions" or (.body | contains("Claude Code")))] | length'
```

**2. Check Iteration Limit**
- If count >= 5: Warn user about review fatigue
- Suggest human discussion instead of 6th automated review
- Include "Review Round X of 5" in comment header

**3. Warning Message (if >= 5)**
```
This PR has already received 5 automated reviews. Further automated reviews may not be productive.

Consider:
1. Having a synchronous discussion about remaining issues
2. Pairing on complex fixes
3. Breaking PR into smaller chunks

I can still review if you'd like, but human collaboration may be more effective at this point.
```

## Steps to Execute

1. **Validate Prerequisites**
   - Ensure `gh` CLI is installed and authenticated
   - Ensure VALIDATION-CHECKLIST.md exists in repo

2. **Fetch PR Context**
   - Get PR number from user: `/review-pr [PR-number]`
   - Fetch PR metadata via `gh pr view`
   - Fetch PR diff via `gh pr diff`

3. **Layer 1: Framework Validation**
   - Read VALIDATION-CHECKLIST.md
   - Detect changed file types from diff
   - Apply smart rule detection
   - Report rule status (Pass/Issue/N/A)

4. **Layer 2: PR Quality**
   - Check linked issue
   - Check CI status
   - Analyze diff scope
   - Validate commit messages
   - Validate branch naming

5. **Layer 3: Code Quality**
   - Security review
   - Performance review
   - Testing review
   - Error handling review
   - General code quality

6. **Generate Review**
   - Combine three layers into structured markdown
   - Prioritize by severity (High/Medium/Low)
   - Include positive feedback
   - Provide actionable next steps

7. **Check Iteration Count**
   - Count existing Claude Code comments
   - Warn if >= 5 reviews already exist

8. **Post to GitHub**
   - Save review to temporary file
   - Post via `gh pr comment`
   - Clean up temporary file

9. **Confirm Posting**
   - Verify comment posted successfully
   - Provide link to review comment

## Key Principles

1. **Smart Detection** - Only apply relevant rules based on changed files
2. **Three Layers** - Framework consistency, PR quality, code quality
3. **Actionable Feedback** - Specific file:line references with suggested fixes
4. **Positive + Negative** - Always include "What's Done Well" section
5. **Prevent Fatigue** - Track iterations, warn after 5 reviews
6. **Human-in-the-Loop** - Suggest changes, never auto-merge

## Example Execution Flow

```
User: /review-pr 142

You: I'll review PR #142 with comprehensive three-layer validation and post results to GitHub.

[Fetch PR context]
[Read VALIDATION-CHECKLIST.md]
[Detect changed files: .claude/commands/generate-backlog.md, CLAUDE.md]
[Apply relevant rules from Categories 1-4, 6-7]
[Check PR quality metrics]
[Review code changes]
[Generate structured review]
[Check iteration count: 2 of 5]
[Post to GitHub]

You: Review posted successfully to PR #142!

**Summary:**
- 1 critical issue (Tier 1 rule violation)
- 2 important suggestions
- 3 nits

**Recommendation:** Request changes to fix Rule 2.1 violation (session numbering format)

View the full review: [GitHub PR #142 comment link]
```

## No Output File

This command does NOT write to `/product-guidelines`. It posts review comments directly to GitHub.

## After This Session

**Next steps:**
1. PR author addresses feedback
2. PR author updates branch and requests re-review
3. Reviewer (you or human) validates fixes
4. Iterate until approval or 5-round limit

**For addressing review feedback**, the PR author should use `/address-review` command if available.

---

**Remember**: This command completes the PR workflow automation suite:
- `/plan-issue` → Creates implementation plan
- `/implement-issue` → Implements feature
- `/review-pr` → Reviews and posts to GitHub (THIS COMMAND)
- `/address-review` → Applies feedback

**Output Format**

IMPORTANT: Do not use emojis in generated outputs. Use plain text for all communication.
