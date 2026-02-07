# CLAUDE-DEVELOPMENT.ctx.md

Context for development workflows, GitHub integration, and debugging. Load when user works with issues, PRs, or code implementation.

## Development Commands

### Planning & Implementation

**`/plan-issue [issue-number]`**
- Fetches issue via `gh` CLI
- Creates comprehensive implementation plan
- Researches third-party integrations (docs, gotchas)
- Posts plan to GitHub issue
- Loads relevant product-guidelines context

**`/implement-issue [issue-number]`**
- Fetches issue and approved plan
- Creates branch: `[number]-issue-slug`
- Implements following plan exactly
- Creates PR with "Closes #[number]"
- NO creative deviations from plan

**`/challenger [issue-number]`**
- Reviews and challenges implementation plans
- Suggests improvements and alternatives

### Code Review

**`/review-pr [PR-number]`**
- Fetches PR details and diff via `gh` CLI
- Three-layer review:
  1. Framework validation (VALIDATION-CHECKLIST.md)
  2. PR quality (linked issue, CI, commits)
  3. Code quality (security, performance, testing)
- Auto-posts review to GitHub
- Tracks iterations (warns after 5 rounds)

**`/review-code`**
- General code review without GitHub posting
- Uses comprehensive review framework

**`/address-review`**
- Apply review feedback to existing PR
- Validates changes with tests

### Debugging

**`/fix-bug`**
- Hypothesis-driven debugging
- Tracks attempts in `.claude/memory/issue-{number}-attempts.json`
- Prevents circular loops
- Escalates after repeated failures

**`/distill-logs`**
- Extracts essential info from verbose logs
- 500+ lines → 5-10 lines (99% reduction)

### Repository Maintenance

**`/update-claudemd`**
- Updates CLAUDE.md based on code changes
- Keeps documentation synchronized

**`/resolve-conflicts [pr-number]`**
- Systematically resolves merge conflicts
- Verifies resolution correctness

## GitHub Integration

### Git Workflow
```bash
# Planning creates plan comment on issue
/plan-issue 123

# Implementation creates PR
/implement-issue 123  # Creates branch, implements, pushes, creates PR

# Review posts to PR
/review-pr 456
```

### Commit Standards
- Clear, concise messages focusing on "why"
- Co-authored by Claude
- Never amend others' commits
- Include Claude Code watermark

### PR Creation
1. Check git status and diff
2. Understand full branch history
3. Push with -u flag if needed
4. Use gh pr create with structured body

### Issue Tracking
- Uses scoped labels (see `.github/LABELS.md`)
- Links issues to backlog files
- Auto-closes via PR body

## Debugging Framework

### Hypothesis Tracking
```json
{
  "issue_number": 123,
  "attempts": [
    {
      "hypothesis": "Missing dependency",
      "test": "Check package.json",
      "result": "Failed",
      "learnings": "Dependency present"
    }
  ]
}
```

### Escalation Triggers
- 3+ attempts with same error
- Circular debugging patterns
- No progress across attempts

### Debug State
- Stored in `.claude/memory/` (gitignored)
- Persists across sessions
- Enables learning from failures

## Implementation Patterns

### Surgical Execution
- Zero creativity during implementation
- Follow plan exactly
- Validate against guidelines
- Test before committing

### Context Loading for Issues
Issue types load specific contexts:
- API issues → 08-api-design.ctx.md, 08b-api-contracts.ctx.md
- Database → 07-database-schema.ctx.md
- Frontend → 06-design-system.ctx.md
- Testing → 09-test-strategy.ctx.md

### PR Review Criteria
**High Priority:**
- Security vulnerabilities
- Data loss risks
- Performance regressions
- Breaking changes

**Medium Priority:**
- Code organization
- Test coverage
- Documentation
- Error handling

**Low Priority:**
- Style consistency
- Minor optimizations
- Nice-to-haves

## Important Constraints

1. **Never skip plan approval** - Always wait for human checkpoint
2. **No creative implementation** - Follow plans exactly
3. **Test before committing** - Run tests, fix failures
4. **Document decisions** - Trace to user journey
5. **Respect cascade order** - Don't skip dependencies