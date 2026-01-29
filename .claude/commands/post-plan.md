---
allowed-tools: Bash(gh:*), Bash(glab:*), Read, Grep, Glob
argument-hint: [issue-number]
description: Post implementation plan as comment to GitHub issue
---

# Post Implementation Plan to GitHub Issue

You are creating and posting an implementation plan to a GitHub issue. This is a **semi-automated** workflow where the plan is posted for human review before implementation.

## Context

**Issue Number:** $1

**Workflow Type:** Semi-automated (requires human approval before implementation)

**Repository:** Run `gh repo view --json nameWithOwner -q .nameWithOwner` to get current repo

**Product Guidelines:** Available in `product-guidelines/` directory (if they exist)

## Your Task

1. Generate a detailed implementation plan (using /plan-issue logic)
2. Post plan as comment on the issue
3. Add `plan-ready` label
4. Provide next-step instructions to the user

## Step 1: Generate Implementation Plan

Follow the same process as `/plan-issue`:

### 1.1: Fetch Issue Details

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

### 1.2: Determine Relevant Product Guidelines

Based on issue type, load these files from `product-guidelines/`:

**Always read (if they exist):**
- `00-user-journey.ctx.md` - Understand which journey step this serves
- `02-tech-stack.md` - Technology choices and patterns
- `02b-coding-standards.ctx.md` - Framework-specific patterns, file organization, naming conventions

**Conditionally read based on issue labels/content:**

| Issue Type | Guidelines to Load |
|------------|-------------------|
| UI/Frontend | `06-design-system.md` (no .ctx version) |
| API/Backend | `08-api-design.ctx.md`, `08b-api-contracts.ctx.md`, `04-architecture.md` |
| Database | `07-database-schema.ctx.md` |
| New Feature | `00-user-journey.ctx.md`, `03b-metrics.md` |
| Bug Fix | Relevant technical specs only |
| Testing | `09-test-strategy.ctx.md` |
| Infrastructure | `04-architecture.md`, `13-deployment-plan.md` |

**Use Glob to find available guidelines:**
```bash
ls product-guidelines/*.md 2>/dev/null || echo "No product guidelines found"
```

**Read relevant files:**
Only read files that exist and are relevant to this issue.

### 1.3: Analyze Requirements

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

### 1.4: Generate Implementation Plan

Create a detailed plan using this structure:

```markdown
# 🧭 Plan for #{$1}: {Issue Title}

## Journey Context

**User Journey Step:** {Step number and description from 00-user-journey.md}

**User Value:** {Specific value this delivers - be concrete}
- Example: "Reduces developer time from 2-3 hours to 10-15 minutes per issue"

**Success Metric:** {Which metric from 03b-metrics.md this impacts}

## Product Context & Guidelines

**Tech Stack Alignment:**
{Reference specific technologies from 02-tech-stack.md}
- Framework: {Framework and version}
- Language: {Language and patterns}
- Tools: {Relevant tools}

**Design System Patterns:** {If UI work}
{Reference components, colors, typography from 06-design-system.md}

**API Contract Reference:** {If API work}
{Reference API paradigm/serialization from 08-api-design.ctx.md, endpoints/schemas from 08b-api-contracts.ctx.md}

**Database Schema Reference:** {If database work}
{Reference tables, relationships from 07-database-schema.ctx.md}

## Technical Approach

### Overview
{1-2 paragraph summary of the solution}

### Components to Create
1. **{New Component/File Name}**
   - Purpose: {what this does}
   - Location: {where it goes}
   - Key functionality: {bullet points}

2. **{New Component/File Name}**
   - Purpose: ...
   - Location: ...
   - Key functionality: ...

### Files to Modify
```
{list of files to change}
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
- {Other relevant guideline references}

---

**Approval:** Ready for review

**Next Steps:**
1. Review this plan carefully
2. Edit if adjustments are needed
3. Comment `@claude-implement` to proceed with implementation
4. OR add label `auto-implement` to trigger automatic implementation
```

## Step 2: Post Plan to Issue

**Save plan to temporary file:**
```bash
cat > /tmp/plan.md <<'PLAN_EOF'
{generated plan content}
PLAN_EOF
```

**Post to GitHub:**
```bash
gh issue comment $1 --body-file /tmp/plan.md
```

**Or for GitLab:**
```bash
glab issue note $1 --message "$(cat /tmp/plan.md)"
```

## Step 3: Add Labels

**Add "plan-ready" label:**
```bash
gh issue edit $1 --add-label "plan-ready"
```

Or GitLab:
```bash
glab issue update $1 --label "plan-ready"
```

## Step 4: Confirm Completion

Output to user:

```markdown
[✓] Implementation plan posted to issue #$1

**Plan includes:**
- Journey traceability to {step}
- Technical approach with {X} components
- {Y} implementation steps
- {Z} success criteria

**Product guidelines referenced:**
- {list of loaded guidelines}

**View plan:** {issue URL}

**Next steps (Semi-Automated Workflow):**
1. Review the plan on GitHub issue #{$1}
2. Edit the plan comment if adjustments needed
3. When satisfied, comment `@claude-implement` to trigger implementation
4. OR add label `auto-implement` to trigger implementation
5. Wait for PR creation (typically 15-30 minutes)

**Workflow status:** Semi-automated - awaiting human approval
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

## Edge Cases

**If product-guidelines don't exist:**
- Note this in the plan
- Create plan based on issue description alone
- Recommend running cascade commands to generate guidelines

**If issue is poorly defined:**
- Ask clarifying questions in issue comment
- Request additional details before creating full plan
- Tag issue author for input

**If issue conflicts with guidelines:**
- Flag the conflict explicitly in plan
- Explain the discrepancy
- Recommend either: (1) update guidelines, or (2) adjust issue scope

## Remember

This is a **semi-automated workflow**:
- Plan is posted for human review
- Implementation does NOT start automatically
- Human must approve by commenting `@claude-implement`
- Allows for plan adjustments before implementation begins

**Contrast with `/post-plan-and-implement`:**
- That command triggers immediate implementation (full automation)
- This command requires human approval (semi-automation)

## Output Format

IMPORTANT: Do not use emojis in generated outputs. Use plain text for all communication.
