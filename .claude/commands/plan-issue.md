---
allowed-tools: Bash(gh:*), Bash(glab:*), Read, Grep, Glob
argument-hint: [issue-number]
description: Create detailed implementation plan for GitHub issue
---

# Create Implementation Plan for GitHub Issue

You are a senior product engineer creating a detailed, actionable implementation plan for a GitHub issue. This plan will be used by `/implement-issue` to execute the work.

## Critical Requirements

This task is NOT complete until you have:

1. Generated the implementation plan
2. Saved it to `plan.md`
3. Posted it as a comment to issue #$1
4. Added the "planned" label to the issue

Do not output a completion summary until all four steps are done. The plan must be posted to the issue - outputting it to the chat is not sufficient.

## Context

- **Issue Number:** $1
- **Repository:** Run `gh repo view --json nameWithOwner -q .nameWithOwner` to get current repo
- **Product Guidelines:** Available in `product-guidelines/` directory (if they exist)
- **Platform:** Detect GitHub vs GitLab by checking which CLI is available

## Formatting Rules

- Do not use emojis in generated outputs
- Use plain text for all headings and content
- Use `[x]` style checkboxes, not emoji checkboxes

---

## Step 1: Fetch Issue Details

Run:
```bash
gh issue view $1 --json title,body,labels,comments
```

For GitLab:
```bash
glab issue view $1
```

Extract:
- Issue title
- Issue description
- Labels (frontend, backend, database, etc.)
- Any existing comments

## Step 2: Load Product Guidelines

First, check what guidelines exist:
```bash
ls product-guidelines/*.md 2>/dev/null || echo "No product-guidelines directory"
```

**Always read (if they exist):**
- `00-user-journey.ctx.md` - Understand which journey step this serves
- `02-tech-stack.md` - Technology choices and patterns
- `02b-coding-standards.ctx.md` - Framework-specific patterns, file organization, naming conventions

**Conditionally read based on issue labels/content:**

| Issue Type | Guidelines to Load |
|------------|-------------------|
| UI/Frontend | `06-design-system.md` |
| API/Backend | `08-api-design.ctx.md`, `08b-api-contracts.ctx.md`, `04-architecture.md` |
| Database | `07-database-schema.ctx.md` |
| New Feature | `00-user-journey.ctx.md`, `03b-metrics.md` |
| Bug Fix | Relevant technical specs only |
| Testing | `09-test-strategy.ctx.md` |
| Infrastructure | `04-architecture.md`, `13-deployment-plan.md` |

**Detection hints:**
- Search issue body for keywords: "API", "database", "UI", "frontend", "backend"
- Check labels: "frontend", "backend", "database", "api"
- Read files that exist, skip missing ones

## Step 3: Analyze Requirements

**Journey Traceability:**
- Which user journey step does this serve?
- What user value does this deliver?
- How does this align with product mission?

**Technical Analysis:**
- What components need to change?
- What new components need to be created?
- Are there breaking changes?
- What are the dependencies?
- What could go wrong?

**Guideline Alignment:**
- Does this follow tech stack choices?
- Does this match design system patterns?
- Does this align with API contract specifications?
- Does this follow database schema conventions?

## Step 4: Generate and Save the Plan

Generate the plan content following the template below, then save it to a file.

You must save the plan to `plan.md` before proceeding to Step 5:

```bash
cat > plan.md << 'PLAN_EOF'
{your generated plan content here}
PLAN_EOF
```

### Plan Template

```markdown
# Plan for #$1: {Issue Title}

## Journey Context

**User Journey Step:** {Step number and description from 00-user-journey.md}

**User Value:** {Specific value this delivers - be concrete}
Example: "Reduces compliance officer's document review time from 4 hours to 60 seconds"

**Success Metric:** {Which metric from 03b-metrics.md this impacts}

## Product Context and Guidelines

**Tech Stack Alignment:**
{Reference specific technologies from 02-tech-stack.md}
- Frontend: {Framework, state management, styling approach}
- Backend: {Language, framework, patterns}
- Database: {Type, specific patterns}

**Coding Standards:** {Reference patterns from 02b-coding-standards.ctx.md}
- File organization: {Directory structure, module patterns}
- Naming conventions: {Component, function, variable naming}
- Framework patterns: {Hooks, state management, error handling}

**Design System Patterns:** {If UI work, reference 06-design-system.md}

**API Contract Reference:** {If API work, reference 08-api-design.ctx.md and 08b-api-contracts.ctx.md}

**Database Schema Reference:** {If database work, reference 07-database-schema.ctx.md}

## Technical Approach

### Overview
{1-2 paragraph summary of the solution}

### Components to Change
1. **{Component/File Name}**
   - Current state: {what exists now}
   - Required changes: {what needs to change}
   - Rationale: {why this approach}

2. **{Component/File Name}**
   - Current state: ...
   - Required changes: ...
   - Rationale: ...

### Components to Create
1. **{New Component/File Name}**
   - Purpose: {what this does}
   - Location: {where it goes}
   - Key functionality: {bullet points}

### Files to Modify
- src/components/Feature.tsx
- src/api/endpoints/feature.ts
- db/migrations/001_add_feature.sql

### Implementation Steps

**Step 1: {High-level step}**
- {Specific task}
- {Specific task}
- {Specific task}

**Step 2: {High-level step}**
- {Specific task}
- {Specific task}

**Step 3: {High-level step}**
- {Specific task}

{Continue for all steps...}

### Breaking Changes
{List any breaking changes, or "None"}

**Migration Strategy:**
{If breaking changes, explain how to migrate}

## Testing Strategy

**Unit Tests:**
- {Test description} - validates {behavior}
- {Test description} - validates {behavior}

**Integration Tests:**
- {Test description} - validates {interaction}

**Manual Testing:**
- [ ] {User flow to test}
- [ ] {Edge case to verify}

**Test Coverage Target:** {X}% (per 09-test-strategy.md)

## Success Criteria

**Functional Requirements:**
- [ ] {Specific, measurable criterion}
- [ ] {Specific, measurable criterion}
- [ ] {Specific, measurable criterion}

**Non-Functional Requirements:**
- [ ] All tests passing
- [ ] Type checking passing
- [ ] Linting passing
- [ ] Code coverage >= {X}%
- [ ] Performance: {specific metric}

**Journey Validation:**
- [ ] User can complete journey step {X}
- [ ] Value delivery confirmed: {specific outcome}

## Scope Boundaries

**In Scope:**
- {What IS included in this issue}
- {What IS included in this issue}

**Out of Scope:**
- {What is NOT included - save for future issues}
- {What is NOT included}

## Risks and Mitigations

| Risk | Mitigation |
|------|------------|
| {Potential issue} | {How to address it} |
| {Potential issue} | {How to address it} |

## Dependencies

- **Blocked By:** {Other issues that must complete first, or "None"}
- **Blocks:** {Issues that depend on this, or "None"}
- **External Dependencies:** {Third-party libraries, APIs, or "None"}

## Estimated Effort

- **Complexity:** {Low / Medium / High}
- **Time Estimate:** {X hours / Y days}
- **Confidence:** {High / Medium / Low}

## References

- Journey Step: product-guidelines/00-user-journey.md #{step-number}
- Tech Stack: product-guidelines/02-tech-stack.md
- Coding Standards: product-guidelines/02b-coding-standards.ctx.md
- {Other relevant guideline references}

---

Ready for implementation via `/implement-issue $1`

Note: This plan was generated by analyzing product guidelines. Review and edit if adjustments are needed before implementation.
```

## Step 5: Post Plan to Issue and Add Label

After saving the plan to `plan.md`, you must post it to the issue.

**For GitHub:**
```bash
gh issue comment $1 --body-file plan.md
gh issue edit $1 --add-label "planned"
```

**For GitLab:**
```bash
glab issue note $1 --message "$(cat plan.md)"
glab issue update $1 --label "planned"
```

Verify the comment was posted by checking the command output for success.

## Step 6: Completion

Only after the plan has been posted to the issue, output a brief confirmation:

```
Plan created and posted to issue #$1.

Guidelines referenced: {list files that were loaded}

Next: Review the plan on the issue, then run /implement-issue $1
```

---

## Quality Checklist

Before posting, verify your plan:

- [ ] Traces to a specific user journey step
- [ ] References relevant product guidelines by filename
- [ ] Names actual files, components, and functions
- [ ] Provides actionable steps an engineer can follow
- [ ] Defines measurable success criteria
- [ ] Sets clear scope boundaries
- [ ] Identifies risks and mitigations

**Avoid:**
- Generic advice like "follow best practices"
- Vague steps like "implement feature"
- Missing guideline references
- Technology choices that contradict tech-stack.md

## Edge Cases

**If product-guidelines directory does not exist:**
- Note this in the plan
- Create plan based on issue description alone
- Recommend running `/cascade-status` to generate guidelines

**If issue is poorly defined:**
- Post a comment asking clarifying questions
- Tag the issue author for input
- Do not generate a full plan until requirements are clear

**If issue conflicts with existing guidelines:**
- Flag the conflict explicitly in plan
- Explain the discrepancy
- Recommend either: (1) update guidelines, or (2) adjust issue scope

## Anti-Patterns

| Problem | Bad Example | Good Example |
|---------|-------------|--------------|
| Technology mismatch | Recommending Vue when tech-stack specifies React | "Using React per 02-tech-stack.md, create component..." |
| Design system violation | "Use whatever colors look good" | "Using primary-blue (#2B5FE0) from 06-design-system.md..." |
| No journey reference | "This adds a feature users want" | "This serves Journey Step 3, reducing review time from 4 hours to 60 seconds" |
| Vague success criteria | "Feature works well" | "Assessment completes in <2 seconds for 100-page documents" |
| Missing breaking change analysis | Silently changing API response format | "Breaking: Response format changes from X to Y. Migration: Update clients to expect new format." |
