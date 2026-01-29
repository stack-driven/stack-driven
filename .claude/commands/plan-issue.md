---
allowed-tools: Bash(gh:*), Bash(glab:*), Read, Grep, Glob
argument-hint: [issue-number]
description: Create detailed implementation plan for GitHub issue
---

# Create Implementation Plan for GitHub Issue

You are a senior product engineer creating a detailed, actionable implementation plan for a GitHub issue. This plan will be used by `/implement-issue` to execute the work.

## Context

**Issue Number:** $1

**Repository:** Run `gh repo view --json nameWithOwner -q .nameWithOwner` to get current repo

**Product Guidelines:** Available in `product-guidelines/` directory (if they exist)

## Your Task

Create a comprehensive implementation plan that:
1. Analyzes the issue requirements
2. Loads relevant product-guidelines as context
3. Ensures journey traceability
4. Provides concrete technical approach
5. Defines clear success criteria

## Step 1: Fetch Issue Details

```bash
gh issue view $1 --json title,body,labels,comments
```

Or for GitLab:
```bash
glab issue view $1
```

Extract:
- Issue title
- Issue description
- Labels (frontend, backend, database, etc.)
- Any existing comments

## Step 2: Determine Relevant Product Guidelines

Based on issue type, load these files from `product-guidelines/`:

**Always read:**
- `00-user-journey.ctx.md` - Understand which journey step this serves
- `02-tech-stack.ctx.md` - Technology choices and patterns
- `02b-coding-standards.ctx.md` - Framework-specific patterns, file organization, naming conventions

**Conditionally read based on issue labels/content:**

| Issue Type | Guidelines to Load |
|------------|-------------------|
| UI/Frontend | `06-design-system.md` (no .ctx version) |
| API/Backend | `08-api-design.ctx.md`, `08b-api-contracts.ctx.md`, `04-architecture.ctx.md` |
| Database | `07-database-schema.ctx.md` |
| New Feature | `00-user-journey.ctx.md`, `03b-metrics.ctx.md` |
| Bug Fix | Relevant .ctx.md technical specs only |
| Testing | `09-test-strategy.ctx.md` |
| Infrastructure | `04-architecture.ctx.md`, `13-deployment-plan.ctx.md` |

**Smart detection:**
- Search issue body for keywords: "API", "database", "UI", "frontend", "backend"
- Check labels: "frontend", "backend", "database", "api"
- Read files that exist, skip missing ones

**Use Glob to find available guidelines:**
```bash
ls product-guidelines/*.md
```

**Read relevant files:**
Only read files that exist and are relevant to this issue.

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

**Reference Product Guidelines:**
- Does this follow tech stack choices?
- Does this match design system patterns?
- Does this align with API contract specifications?
- Does this follow database schema conventions?

## Step 4: Generate Implementation Plan

Create a detailed plan using this structure:

```markdown
# 🧭 Plan for #{$1}: {Issue Title}

## Journey Context

**User Journey Step:** {Step number and description from 00-user-journey.md}

**User Value:** {Specific value this delivers - be concrete}
- Example: "Reduces compliance officer's document review time from 4 hours to 60 seconds"

**Success Metric:** {Which metric from 03b-metrics.md this impacts}

## Product Context & Guidelines

**Tech Stack Alignment:**
{Reference specific technologies from 02-tech-stack.md}
- Frontend: {Framework, state management, styling approach}
- Backend: {Language, framework, patterns}
- Database: {Type, specific patterns}

**Coding Standards:** {Reference patterns from 02b-coding-standards.ctx.md}
- File organization: {Directory structure, module patterns}
- Naming conventions: {Component, function, variable naming}
- Framework patterns: {Hooks, state management, error handling}

**Design System Patterns:** {If UI work}
{Reference components, colors, typography from 06-design-system.md}

**API Contract Reference:** {If API work}
{Reference API paradigm/serialization from 08-api-design.ctx.md, endpoints/schemas from 08b-api-contracts.ctx.md}

**Database Schema Reference:** {If database work}
{Reference tables, relationships from 07-database-schema.ctx.md}

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
```
src/components/Feature.tsx
src/api/endpoints/feature.ts
db/migrations/001_add_feature.sql
```

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

## Risks & Mitigations

**Risk:** {Potential issue}
**Mitigation:** {How to address it}

**Risk:** {Potential issue}
**Mitigation:** {How to address it}

## Dependencies

**Blocked By:** {Other issues that must complete first, or "None"}

**Blocks:** {Issues that depend on this, or "None"}

**External Dependencies:** {Third-party libraries, APIs, or "None"}

## Estimated Effort

**Complexity:** {Low / Medium / High}

**Time Estimate:** {X hours / Y days}

**Confidence:** {High / Medium / Low}

## References

- Journey Step: product-guidelines/00-user-journey.md #{step-number}
- Tech Stack: product-guidelines/02-tech-stack.md
- Coding Standards: product-guidelines/02b-coding-standards.ctx.md
- {Other relevant guideline references}

---

**Approval:** [✓] Ready for implementation via `/implement-issue $1`

**Note:** This plan was generated by analyzing product guidelines. Review carefully and edit if adjustments are needed before implementation.
```

## Step 5: Post Plan to Issue

**GitHub:**
```bash
gh issue comment $1 --body-file plan.md
```

**GitLab:**
```bash
glab issue note $1 --message "$(cat plan.md)"
```

**Add "planned" label:**
```bash
gh issue edit $1 --add-label "planned"
```

Or GitLab:
```bash
glab issue update $1 --label "planned"
```

## Step 6: Confirm Completion

Output to user:

```markdown
[✓] Implementation plan created for issue #$1

**Plan includes:**
- Journey traceability to {step}
- Technical approach with {X} components
- {Y} implementation steps
- {Z} success criteria

**Product guidelines referenced:**
- {list of loaded guidelines}

**View plan:** {issue URL}

**Next steps:**
1. Review plan on GitHub issue
2. Edit plan if adjustments needed
3. Run `/implement-issue $1` when ready to implement
```

## Quality Standards

Your plan must:

**✓ Trace to journey** - Reference specific user journey step and value
**✓ Reference guidelines** - Cite tech-stack, design-system, API contracts as applicable
**✓ Be specific** - Name actual files, components, functions
**✓ Be actionable** - Clear steps an engineer can follow
**✓ Define success** - Measurable criteria, not vague goals
**✓ Respect scope** - In/Out boundaries prevent scope creep
**✓ Consider risks** - Identify what could go wrong

**✗ Avoid generic advice** - "Follow best practices" is not a plan
**✗ Avoid vague steps** - "Implement feature" is not actionable
**✗ Avoid missing context** - Always load and reference product-guidelines
**✗ Avoid ignoring guidelines** - Plan must align with established patterns

## Anti-Patterns to Avoid

**[x] Technology mismatch:**
Bad: Recommending Vue when tech-stack specifies React
Good: "Using React per 02-tech-stack.md, create component..."

**[x] Design system violation:**
Bad: "Use whatever colors look good"
Good: "Using primary-blue (#2B5FE0) from 06-design-system.md..."

**[x] No journey reference:**
Bad: "This adds a feature users want"
Good: "This serves Journey Step 3 (document assessment), reducing review time from 4 hours to 60 seconds"

**[x] Vague success criteria:**
Bad: "Feature works well"
Good: "Assessment completes in <2 seconds for 100-page documents"

**[x] Missing breaking change analysis:**
Bad: Silently changing API response format
Good: "Breaking: Response format changes from X to Y. Migration: Update clients to expect new format."

## Edge Cases

**If product-guidelines don't exist:**
- Note this in the plan
- Create plan based on issue description alone
- Recommend running `/cascade-status` to generate guidelines

**If issue is poorly defined:**
- Ask clarifying questions in issue comment
- Request additional details before creating full plan
- Tag issue author for input

**If issue conflicts with guidelines:**
- Flag the conflict explicitly in plan
- Explain the discrepancy
- Recommend either: (1) update guidelines, or (2) adjust issue scope

## Remember

The plan you create will be consumed by `/implement-issue`, so:
- Be thorough but concise
- Include all context needed (product guidelines already loaded)
- Make steps surgical and precise
- Define success unambiguously

**This plan is a contract** - the implementation will follow it exactly.

## Output Format

IMPORTANT: Do not use emojis in generated outputs. Use plain text for all communication.

IM
