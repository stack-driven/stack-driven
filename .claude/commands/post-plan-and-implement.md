---
allowed-tools: Bash(gh:*), Bash(glab:*), Read, Grep, Glob
argument-hint: [issue-number]
description: Generate plan and auto-implement (full automation)
---

# Generate Plan and Auto-Implement Issue

You are creating an implementation plan and immediately triggering automatic implementation. This is a **fully-automated** workflow that goes from planning to PR without human intervention.

## Context

**Issue Number:** $1

**Workflow Type:** Fully-automated (plan → implement → PR → review → auto-fix cycles)

**Repository:** Run `gh repo view --json nameWithOwner -q .nameWithOwner` to get current repo

**Product Guidelines:** Available in `product-guidelines/` directory (if they exist)

## Your Task

1. Generate a detailed implementation plan (using /plan-issue logic)
2. Post plan as comment on the issue
3. Add `full-automation` label to track automation status
4. Immediately post `@claude-implement` comment to trigger implementation
5. Confirm full automation workflow is active

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
- `00-user-journey.md` - Understand which journey step this serves
- `02-tech-stack.md` - Technology choices and patterns

**Conditionally read based on issue labels/content:**

| Issue Type | Guidelines to Load |
|------------|-------------------|
| UI/Frontend | `06-design-system.md` |
| API/Backend | `08-api-contracts.md`, `04-architecture.md` |
| Database | `07-database-schema.md` |
| New Feature | `00-user-journey.md`, `04-metrics.md` |
| Bug Fix | Relevant technical specs only |
| Testing | `09-test-strategy.md` |
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

**Success Metric:** {Which metric from 04-metrics.md this impacts}

## Product Context & Guidelines

**Tech Stack Alignment:**
{Reference specific technologies from 02-tech-stack.md}
- Framework: {Framework and version}
- Language: {Language and patterns}
- Tools: {Relevant tools}

**Design System Patterns:** {If UI work}
{Reference components, colors, typography from 06-design-system.md}

**API Contract Reference:** {If API work}
{Reference endpoints, request/response schemas from 08-api-contracts.md}

**Database Schema Reference:** {If database work}
{Reference tables, relationships from 07-database-schema.md}

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

**Approval:** Auto-approved for full automation

**Implementation approach:** Automatic implementation triggered immediately
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

**Add "full-automation" label to track automation status:**
```bash
gh issue edit $1 --add-label "full-automation"
```

Or GitLab:
```bash
glab issue update $1 --label "full-automation"
```

## Step 4: Trigger Automatic Implementation

**Post @claude-implement comment to trigger the implementation workflow:**

```bash
gh issue comment $1 --body "@claude-implement

🤖 **Full automation triggered**

This issue is being implemented automatically via the `/post-plan-and-implement` workflow.

**Automation stages:**
1. ✅ Plan generated and posted
2. ⏳ Implementation in progress...
3. ⏳ PR creation pending...
4. ⏳ Code review pending...
5. ⏳ Auto-fix cycles (up to 5 rounds) pending...

**Timeline:**
- Simple issues: ~30-40 minutes to PR ready
- Complex issues: ~45-60 minutes to PR ready

**You will be notified when:**
- PR is created and ready for review
- Code review completes
- Auto-fix cycles complete (or manual intervention required)

Monitor progress at: https://github.com/$(gh repo view --json nameWithOwner -q .nameWithOwner)/actions"
```

Or GitLab:
```bash
glab issue note $1 --message "@claude-implement

🤖 **Full automation triggered**

This issue is being implemented automatically via the \`/post-plan-and-implement\` workflow.

**Automation stages:**
1. ✅ Plan generated and posted
2. ⏳ Implementation in progress...
3. ⏳ MR creation pending...
4. ⏳ Code review pending...
5. ⏳ Auto-fix cycles (up to 5 rounds) pending...

**Timeline:**
- Simple issues: ~30-40 minutes to MR ready
- Complex issues: ~45-60 minutes to MR ready

**You will be notified when:**
- MR is created and ready for review
- Code review completes
- Auto-fix cycles complete (or manual intervention required)"
```

## Step 5: Confirm Completion

Output to user:

```markdown
✅ Full automation workflow initiated for issue #$1

**Plan includes:**
- Journey traceability to {step}
- Technical approach with {X} components
- {Y} implementation steps
- {Z} success criteria

**Product guidelines referenced:**
- {list of loaded guidelines}

**Automation status:**
- Plan posted: ✅ Complete
- Implementation triggered: ✅ Complete
- Label added: ✅ full-automation

**View plan:** {issue URL}

**Next steps (Fully-Automated Workflow):**
1. ⏳ Implementation will start automatically (15-30 min)
2. ⏳ PR will be created automatically
3. ⏳ Code review will run automatically
4. ⏳ Auto-fix cycles will run (up to 5 rounds)
5. 👀 You review final PR and merge

**Estimated time to PR ready:** 30-60 minutes

**Monitor progress:**
- Issue comments: {issue URL}
- GitHub Actions: https://github.com/{repo}/actions

**Workflow type:** Full automation - no manual intervention required until PR review
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
- Proceed with full automation (code quality checks still apply)

**If issue is poorly defined:**
- Still attempt to create plan based on available information
- Flag ambiguities in the plan
- Implementation will proceed but may need human fixes

**If issue conflicts with guidelines:**
- Flag the conflict explicitly in plan
- Proceed with automation but note the conflict
- Human review will catch guideline violations

## Remember

This is a **fully-automated workflow**:
- Plan is posted AND implementation is triggered immediately
- No human approval required before implementation starts
- Code review and auto-fix cycles run automatically
- Human intervention only needed if:
  - Auto-fix fails after 5 rounds (adds `review-blocked` label)
  - Tests fail repeatedly
  - Guideline violations are severe

**Contrast with `/post-plan`:**
- That command requires human approval (semi-automation)
- This command triggers immediate implementation (full automation)
- Use `/post-plan` for complex/risky issues
- Use `/post-plan-and-implement` for well-defined simple issues

**Automation confidence:**
- Simple issues (well-scoped, clear requirements): High confidence
- Complex issues (many components, breaking changes): Lower confidence, consider `/post-plan` instead
