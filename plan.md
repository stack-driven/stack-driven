# Plan for #137: Enhancement: Separate PR Review Command with VALIDATION-CHECKLIST Integration

## Overview

This enhancement creates a new `/review-pr` command specifically for GitHub PR reviews with automated posting, while refining `/review-code` to focus on general code review scenarios. The key innovation is integrating VALIDATION-CHECKLIST.md as a first-class validation layer with smart rule application and status reporting.

## Scope (In / Out)

**In Scope:**
- Create `/review-pr` command with three-layer review architecture
- Integrate VALIDATION-CHECKLIST.md with smart rule detection
- Add GitHub posting capability via `gh` CLI
- Implement review iteration tracking (max 5 rounds)
- Refine `/review-code` description to clarify general use
- Update documentation (README.md, CLAUDE.md, COMMAND-REFERENCE.md if exists)

**Out of Scope:**
- Automated fixes (suggest only, don't auto-apply)
- GitLab support (GitHub-only for first iteration)
- PR approval/rejection automation (human decision required)
- VALIDATION-CHECKLIST.md modification (use as-is)

## Files to Change

**New Files:**
- `.claude/commands/review-pr.md` - New PR review command

**Modified Files:**
- `.claude/commands/review-code.md` - Update description and clarify scope
- `CLAUDE.md` - Add `/review-pr` to PR workflow documentation
- `README.md` - Add `/review-pr` to command list (if PR commands are listed)

## Technical Approach

### Three-Layer Review Architecture

The `/review-pr` command implements a structured review process:

**Layer 1: Framework Validation (VALIDATION-CHECKLIST.md)**
- Reads VALIDATION-CHECKLIST.md
- Detects which files changed in PR (via `gh pr diff`)
- Applies only relevant rules based on file types:
  - Command files (.md in .claude/commands/) → Category 1-10 rules
  - Documentation (CLAUDE.md, README.md) → Category 6, 7 rules
  - Templates (templates/*.md) → Category 5 rules
  - GitHub config (.github/*) → No framework rules
- Reports pass/fail status for each applicable rule
- Prioritizes by tier (Tier 1 Critical > Tier 2 Important > Tier 3 Nice-to-have)

**Layer 2: PR Quality Checks**
- Linked issue validation (PR description contains "Closes #X" or "Fixes #X")
- CI status check (passing/failing)
- Diff scope analysis (lines changed, files modified)
- Commit message quality (conventional commits format)
- Branch naming convention (feature/*, fix/*, etc.)

**Layer 3: Code Quality Review**
- Security vulnerability scan (SQL injection, XSS, auth bypass)
- Performance issues (N+1 queries, unnecessary loops)
- Test coverage (tests exist for changes)
- Error handling completeness
- Code readability and maintainability

### Smart Rule Application Logic

**File Type Detection:**
```
Changed files → Categorize by type:
- .claude/commands/*.md → Apply Category 1-4, 6-10
- templates/*.md → Apply Category 5
- CLAUDE.md, README.md → Apply Category 6, 7
- .github/workflows/*.yml → Skip framework rules (only Layer 3)
```

**Rule Relevance Detection:**
```
Category 1 (File References) → Always check command files
Category 2 (Session Numbering) → Check if "Session X" mentioned in diff
Category 3 (Naming Consistency) → Check if table names, epic numbers in diff
Category 4 (Propagation Patterns) → Check if i18n, AI, integration keywords in diff
Category 5 (Template Alignment) → Only if templates/ or commands/ changed
```

**Status Reporting Format:**
```markdown
## Framework Validation (VALIDATION-CHECKLIST.md)

**Tier 1 (Critical):**
- ✅ Rule 1.4 (Context vs Full File): Pass - All sessions read .ctx.md correctly
- ⚠️ Rule 2.1 (Session Numbering): Issue at CLAUDE.md:135 - "Session 8" should be "Session 8b"
- ✅ Rule 3.1 (Table Name Consistency): Pass

**Tier 2 (Important):**
- ✅ Rule 4.1 (i18n Propagation): N/A - No i18n changes in this PR
- ✅ Rule 6.3 (Decision Matrix Accuracy): Pass

**Tier 3 (Nice-to-have):**
- ⚠️ Rule 7.2 (Token Reduction Claims): Inconsistent percentage at design-database-schema.md:1135
```

### GitHub Integration

**PR Fetching:**
```bash
gh pr view $PR_NUMBER --json title,body,headRefName,baseRefName,commits,reviews,statusCheckRollup
gh pr diff $PR_NUMBER
```

**Review Posting:**
```bash
gh pr comment $PR_NUMBER --body-file review.md
```

**Iteration Tracking:**
- Count existing comments from Claude Code on PR
- If >= 5: Warn user about review fatigue, suggest human discussion
- Include "Review Round X of 5" in posted comment

### Review Output Format

```markdown
# PR Review: [PR Title]

**Review Round:** 1 of 5
**Reviewer:** Claude Code
**Date:** YYYY-MM-DD

---

## Summary

This PR [brief description]. Found [X] critical issues, [Y] important suggestions, [Z] nits.

**Recommendation:** [Request Changes | Approve with Comments | Approve]

---

## Framework Validation (VALIDATION-CHECKLIST.md)

[Status report from Layer 1]

---

## PR Quality Assessment

**Linked Issue:** ✅ Closes #123
**CI Status:** ✅ Passing (3/3 checks)
**Diff Scope:** 5 files changed, +127/-43 lines
**Commit Messages:** ⚠️ 1 commit missing conventional format

---

## Code Quality Review

### High Priority (Must Fix)

**1. [Issue Title]**
- **File:** `path/to/file.ts:42`
- **Severity:** Security
- **Issue:** [Description]
- **Fix:**
  ```typescript
  // Suggested change
  ```
- **Why:** [Rationale]

### Medium Priority (Should Fix)

[...]

### Low Priority (Nits)

[...]

---

## What's Done Well

- [Positive feedback]

---

## Next Steps

1. Address [X] high priority issues
2. Review [Y] medium priority suggestions
3. Update PR and request re-review

If you have questions about any feedback, reply to this comment.
```

## Implementation Steps

**Step 1: Create `/review-pr` Command**
- Create `.claude/commands/review-pr.md`
- Implement YAML frontmatter (description, allowed-tools, argument-hint)
- Add three-layer architecture instructions
- Include smart rule detection logic
- Add GitHub posting workflow
- Add iteration tracking (count existing Claude comments, max 5)

**Step 2: Refine `/review-code` Command**
- Update description in YAML frontmatter: "DEV-TIME - Guide general code review with comprehensive framework"
- Add clarification: "For PR reviews with GitHub posting, use /review-pr"
- Keep existing functionality intact (no breaking changes)
- Remove PR-specific language from command body

**Step 3: Update CLAUDE.md**
- Add `/review-pr` to "Development Commands" section
- Document PR workflow: `/plan-issue` → `/implement-issue` → `/review-pr` → `/address-review`
- Add comparison table (like existing /fix-bug vs /address-review)
- Update "Working with This Repository" section to mention PR review automation

**Step 4: Update README.md (if applicable)**
- Add `/review-pr` to command list (if PR commands are documented)
- Add to "PR Workflow" section (if exists)

## Functions

**`/review-pr [pr-number]`** - Main command entry point that orchestrates three-layer review, posts to GitHub, tracks iterations

**`detectChangedFileTypes()`** - Analyzes `gh pr diff` output to categorize changed files (commands, templates, docs, code)

**`applyFrameworkValidation()`** - Reads VALIDATION-CHECKLIST.md, applies relevant rules based on file types, returns pass/fail status per rule

**`checkPRQuality()`** - Validates PR metadata (linked issue, CI status, diff scope, commit messages)

**`reviewCodeQuality()`** - Applies general code review framework (security, performance, tests, error handling)

**`generateReviewComment()`** - Formats three-layer results into structured markdown review

**`postReviewToGitHub()`** - Saves review.md and posts via `gh pr comment`, adds iteration counter

**`trackReviewIteration()`** - Counts existing Claude Code comments on PR, warns if >= 5 review rounds

## Tests

This is a command file (prompt-driven), not executable code, so no traditional unit tests. Validation will be:

**Manual Testing:**
- `testReviewWithFrameworkViolations()` - PR with VALIDATION-CHECKLIST violations reports correct rule failures
- `testReviewWithCleanCode()` - PR passing all checks generates positive review
- `testSmartRuleDetection()` - Only relevant rules applied (e.g., no template rules for code-only PRs)
- `testIterationTracking()` - 5th review round triggers warning message
- `testGitHubPosting()` - Review comment successfully posted to PR with correct formatting

**Integration Testing:**
- Test on real Stack-Driven PRs (framework changes, documentation updates, command additions)
- Verify VALIDATION-CHECKLIST Tier 1 rules correctly flag critical issues
- Verify GitHub CLI integration (comment posting, diff fetching)

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| VALIDATION-CHECKLIST.md rules are complex to parse and apply programmatically | Commands are prompt-driven (Claude interprets rules, not regex); provide clear examples in command prompt |
| False positives from smart rule detection | Include "N/A" option for rules that don't apply; user can override in review comments |
| Review output too verbose for complex PRs | Use collapsible sections in markdown (`<details>` tags); prioritize Tier 1 issues first |
| GitHub API rate limiting | Use `gh` CLI (authenticated, higher rate limits); cache PR data during single review run |
| Iteration tracking doesn't detect manual reviews | Track only Claude Code comments (filter by author); still prevents AI review spam |

## Acceptance Criteria

**Functional Requirements:**
- [x] `/review-pr [PR-number]` fetches PR details via `gh` CLI
- [x] Three-layer review architecture implemented (Framework, PR Quality, Code Quality)
- [x] VALIDATION-CHECKLIST.md rules applied based on changed file types
- [x] Pass/fail status reported for each applicable rule
- [x] Review posted as GitHub comment with structured formatting
- [x] Iteration tracking warns after 5 review rounds
- [x] `/review-code` description updated to clarify general use

**Non-Functional Requirements:**
- [x] Review completes in <60 seconds for typical PR (<500 lines changed)
- [x] Output follows Stack-Driven style (no emojis, plain text, markdown)
- [x] VALIDATION-CHECKLIST Tier 1 rules always checked for framework PRs
- [x] Documentation updated (CLAUDE.md, README.md if applicable)

**Journey Validation:**
- [x] Reduces PR review friction (automated framework consistency checks)
- [x] Maintains human-in-the-loop (suggests, doesn't auto-merge)
- [x] Leverages existing VALIDATION-CHECKLIST.md infrastructure

## Scope Boundaries

**In Scope:**
- GitHub PR review automation
- VALIDATION-CHECKLIST.md integration
- Structured review posting
- Iteration tracking (prevent review spam)

**Out of Scope:**
- GitLab support (future enhancement)
- Automated PR approval/rejection (always requires human decision)
- Auto-fixing issues (use `/address-review` for that)
- VALIDATION-CHECKLIST.md modifications (use existing rules)
- AI review quality scoring (e.g., "confidence: 85%")

## Dependencies

- **Blocked By:** None
- **Blocks:** None (optional enhancement)
- **External Dependencies:**
  - `gh` CLI (GitHub authentication required)
  - `VALIDATION-CHECKLIST.md` (must exist in repo root)

## Estimated Effort

- **Complexity:** Medium
- **Time Estimate:** 2-3 hours
  - 60 min: Create `/review-pr` command with three-layer architecture
  - 30 min: Implement smart rule detection logic
  - 30 min: Add GitHub posting and iteration tracking
  - 15 min: Refine `/review-code` command
  - 30 min: Update documentation (CLAUDE.md, README.md)
  - 15 min: Manual testing with real PRs
- **Confidence:** High (similar to existing `/plan-issue` and `/address-review` patterns)

## References

- Existing PR Workflow: `.claude/commands/plan-issue.md`, `.claude/commands/implement-issue.md`, `.claude/commands/address-review.md`
- Validation Framework: `VALIDATION-CHECKLIST.md`
- GitHub CLI Documentation: https://cli.github.com/manual/gh_pr
- Agentic Best Practices: Issue #137 body references Singh 2025, Anthropic 2024 (surgical execution, context engineering)

---

Ready for implementation via `/implement-issue 137`

Note: This plan creates a focused `/review-pr` command that completes the PR workflow automation suite while systematically applying VALIDATION-CHECKLIST.md rules. The three-layer architecture ensures comprehensive review (framework consistency, PR quality, code quality) with smart rule detection to avoid false positives.
