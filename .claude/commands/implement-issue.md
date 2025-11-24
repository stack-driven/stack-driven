---
allowed-tools: Bash(gh:*), Bash(git:*), Bash(glab:*), Read, Write, Edit, MultiEdit, Grep, Glob, Task
argument-hint: [issue-number]
description: Implement GitHub/GitLab issue following approved plan and create PR/MR
---

You are an elite software engineer implementing an issue with precision and excellence.

## Context

**Issue Details:**
- Issue #$1: use gh to view the issue

**Approved Plan:**
- Study the approved plan that has been added as a comment "🧭 Plan for"

**Current Branch:**
!`git branch --show-current`

**Repository Status:**
!`git status --porcelain`

## Your Task

Implement the issue following the approved plan exactly. Work systematically through each step.

### Implementation Steps:

1. **Load Relevant Product Guidelines**

   Before writing any code, review the issue content and determine which product guidelines are relevant.

   **Available Guidelines** (in `product-guidelines/`):
   - `00-user-journey.md` - User journey steps and value delivery
   - `02-tech-stack.md` - Technology choices and rationale
   - `03-mission.md` - Product mission and vision
   - `04-metrics.md` - Success metrics and KPIs
   - `04-architecture.md` - System architecture decisions
   - `06-design-system.md` - UI components, patterns, and styling
   - `07-database-schema.md` - Database tables and relationships
   - `08-api-contracts.md` - API endpoints and specifications
   - `09-test-strategy.md` - Testing approach and coverage requirements

   **Selection Logic**:
   - **Always read**: `02-tech-stack.md` (ensures correct technology usage)
   - **UI/Frontend work**: read `06-design-system.md`
   - **API endpoints**: read `08-api-contracts.md`
   - **Database changes**: read `07-database-schema.md`
   - **New features**: read `00-user-journey.md` to understand user value
   - **Metrics/analytics**: read `04-metrics.md`
   - **Tests**: read `09-test-strategy.md`

   Read the selected guidelines and keep them in mind as guardrails during implementation.

2. **Create Issue-Linked Branch**
   - Fetch issue details to get title: `gh issue view $1` or `glab issue view $1`
   - Create branch from issue: `git checkout -b $1-issue-slug`
   - Ensure branch name includes issue number for automatic linking

3. **Follow the Approved Plan**
   - Implement each component as specified in the plan
   - Modify only the files identified in "Files to Change"
   - Create the functions described in "Functions" section
   - Follow the exact scope defined in "Scope (In/Out)"

4. **Quality Assurance**
   - Run all tests and ensure they pass
   - Run linter and type checker if available
   - Verify implementation meets acceptance criteria

5. **Create Pull/Merge Request**
   - Commit changes with message format: `feat: [description] (closes #$1)`
   - Push branch to remote with upstream tracking
   - Create PR/MR:
     - GitHub: `gh pr create --fill --title "[Title] (closes #$1)"`
     - GitLab: `glab mr create --fill --source-branch [branch] --title "[Title] (closes #$1)"`
   - Ensure body contains "Closes #$1" for automatic issue closure

### Requirements:

- **Code Quality**: Follow existing code patterns and conventions
- **Testing**: Implement tests as specified in the plan
- **Documentation**: Update relevant documentation
- **Security**: Follow security best practices
- **Performance**: Consider performance implications

### PR/MR Template Format:
```markdown
## Summary
Brief description of implementation

## Changes
- List key changes made

## Acceptance Criteria
- [ ] Criterion 1 from plan
- [ ] Criterion 2 from plan
- [ ] All tests pass
- [ ] Code follows project conventions

## Testing
- Describe testing approach
- List test cases covered

Closes #$1
```

### Integration Best Practices:

**Branch Naming**: Use format `$1-brief-description` (e.g., `131-implement-feature`)
**Commit Messages**: Use conventional commits with issue reference: `feat: description (closes #$1)`
**PR/MR Creation**: Always include "Closes #$1" in description for automatic issue closure
**Issue Linking**: Ensure branch name starts with issue number for auto-linking

**Focus**: Deliver production-ready code that precisely matches the approved plan.
