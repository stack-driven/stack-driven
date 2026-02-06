---
allowed-tools: Bash(gh:*), Bash(glab:*), Read, Grep, Glob
argument-hint: [issue-number]
description: Create detailed implementation plan for GitHub issue
---

# Create Implementation Plan for GitHub Issue

You are a senior product engineer creating a detailed, actionable implementation plan for a GitHub issue. For third-party integrations, you research official documentation and identify critical gotchas BEFORE planning implementation. This plan will be used by `/implement-issue` to execute the work.

## Critical Requirements - READ THIS FIRST

⚠️ **MANDATORY WORKFLOW ENFORCEMENT** ⚠️

This command uses TodoWrite tool for execution tracking. You MUST:

1. Create TodoWrite tracker in Step 1.5 (9 tracked tasks)
2. Mark each todo "in_progress" BEFORE starting it
3. Mark each todo "completed" IMMEDIATELY after finishing it
4. Complete ALL todos before outputting completion message

**The task is NOT complete until:**
- [ ] Plan generated from template
- [ ] Plan saved to `plan.md` file
- [ ] Plan posted as comment to issue #$1 via `gh issue comment`
- [ ] "planned" label added to issue #$1
- [ ] Posting verified programmatically (Step 5 bash checks)
- [ ] ALL TodoWrite items marked "completed"

**CRITICAL:** Outputting the plan in chat does NOT count. The plan MUST be posted to the GitHub issue. Step 5 programmatically verifies this happened.

**EXECUTION CONTRACT:**
Claude MUST complete ALL steps including GitHub posting.
Outputting plan text to user WITHOUT posting = FAILURE.
The plan must be visible on GitHub issue #$1 to count as complete.

**COMMON FAILURE MODE TO AVOID:**
Do NOT show the plan to the user and stop. You MUST execute the bash commands in Step 4 that save the plan to plan.md and post it via `gh issue comment`. The brackets like {YOUR_ACTUAL_PLAN_CONTENT} are placeholders for you to REPLACE with your actual content, not examples to show.

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

---

## Step 1.5: Initialize Task Tracker (MANDATORY)

Before proceeding, create a task tracker using TodoWrite to ensure ALL steps complete:

Use TodoWrite tool with these exact todos:

```json
[
  {
    "content": "Fetch issue #$1 details from GitHub",
    "status": "completed",
    "activeForm": "Fetching issue details"
  },
  {
    "content": "Load relevant product-guidelines files",
    "status": "in_progress",
    "activeForm": "Loading product-guidelines files"
  },
  {
    "content": "Analyze requirements and guideline alignment",
    "status": "pending",
    "activeForm": "Analyzing requirements"
  },
  {
    "content": "Research third-party integrations (if detected)",
    "status": "pending",
    "activeForm": "Researching third-party integrations"
  },
  {
    "content": "Generate plan content from template",
    "status": "pending",
    "activeForm": "Generating plan content"
  },
  {
    "content": "Save plan to plan.md file",
    "status": "pending",
    "activeForm": "Saving plan to plan.md"
  },
  {
    "content": "Post plan.md to issue #$1 via gh issue comment",
    "status": "pending",
    "activeForm": "Posting plan to GitHub issue"
  },
  {
    "content": "Add 'planned' label to issue #$1",
    "status": "pending",
    "activeForm": "Adding 'planned' label"
  },
  {
    "content": "Verify posting succeeded (check gh command output)",
    "status": "pending",
    "activeForm": "Verifying posting succeeded"
  }
]
```

**CRITICAL RULES:**
- Mark each todo "in_progress" BEFORE starting it
- Mark each todo "completed" IMMEDIATELY after finishing it
- DO NOT skip todos - complete them in order
- DO NOT output completion message until ALL todos show "completed"

The user can see this tracker. It proves you completed all steps.

---

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

**Update TodoWrite:** Mark "Load relevant product-guidelines files" as "completed"

---

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

**Update TodoWrite:** Mark "Analyze requirements and guideline alignment" as "completed"

---

## Step 3.5: Research Third-Party Integrations (If Detected)

**Detection Criteria:**

Check issue body and title for third-party integration indicators:
- Keywords: "npm install", "new package", "library", "SDK", "widget", "API integration"
- Specific services: "Calendly", "Stripe", "Twilio", "SendGrid", etc.
- Phrases: "integrate with", "add [Service]", "implement [Service]"

**Skip research if:**
- Library already exists in codebase (check package.json, imports)
- Issue is purely internal code (no third-party dependencies)
- Library is a well-known framework already in tech-stack.md

**Perform research if:**
- NEW third-party library/service being added
- Unfamiliar integration (not recently used)

**Research Process (Time box: 2-3 minutes):**

If third-party integration detected:

1. **Find Official Documentation**
   - Use WebSearch to find official docs (prioritize official domain)
   - Extract 2-3 key installation/setup excerpts
   - Note: latest stable version, official recommended approach

2. **Identify Officially Recommended Package**
   - Search for official SDK/wrapper (e.g., "react-calendly" vs custom script)
   - Check npm if relevant (official package vs community packages)
   - Verify: Is there an official wrapper for our framework?

3. **Document Critical Gotchas**
   - Search for common issues: "[Library] common issues", "[Library] [Framework] problems"
   - Look for: script placement, render-blocking, async loading, CSP issues
   - Prioritize: Performance pitfalls, breaking changes, framework-specific issues

4. **Compare 2-3 Implementation Approaches**
   - Official SDK/package (if exists)
   - Direct API integration (if SDK not available)
   - Script/widget embedding (if applicable)
   - List pros/cons for each (1-2 lines)

**Output:**
Store research findings in a variable to include in Step 4 (plan generation).

**Update TodoWrite:** Mark "Research third-party integrations (if detected)" as "completed" (or skip if no third-party integrations detected)

---

## Step 4: Generate Plan and Post to GitHub (ATOMIC OPERATION)

**CRITICAL: This is ONE STEP with three mandatory sub-operations that MUST complete:**
1. Generate plan content from template
2. Save to plan.md
3. Post to GitHub via gh issue comment

**DO NOT output anything to the user until ALL THREE complete.**

### Execute NOW (do not pause between sub-steps):

Generate your plan using the template below:

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

{IF THIRD-PARTY INTEGRATION DETECTED:}

## Third-Party Integration Research

**Library/Service:** {Name and official URL}

**Official Documentation:**
- {Link to official docs}
- Key excerpt 1: {relevant installation/setup note}
- Key excerpt 2: {relevant usage note}

**Officially Recommended Approach:**
- {Package/SDK name if exists, or "Direct API integration"}
- Version: {latest stable version}
- Installation: {command or setup method}

**Critical Gotchas:**
- {Gotcha 1 with specific detail (e.g., "Script must be placed before </body>, not in <head>")}
- {Gotcha 2 with specific detail (e.g., "CSS in <head> causes render-blocking - use async loading")}
- {Gotcha 3 if applicable}

**Implementation Approaches Comparison:**

| Approach | Pros | Cons | Recommendation |
|----------|------|------|----------------|
| {Approach 1} | {1-2 pros} | {1-2 cons} | {recommended/not recommended} |
| {Approach 2} | {1-2 pros} | {1-2 cons} | {recommended/not recommended} |
| {Approach 3} | {1-2 pros} | {1-2 cons} | {recommended/not recommended} |

**Recommended Approach:** {Specific recommendation with 1-sentence rationale}

**References:**
- Official docs: {URL}
- Community best practices: {URL if found}

---

{END IF}

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

### Save and Post Immediately

**MANDATORY EXECUTION - DO NOT SKIP THIS STEP**

You have now generated the plan content. You MUST immediately:
1. Save the ACTUAL generated plan content (not placeholders) to plan.md
2. Post it to GitHub using gh issue comment
3. These are NOT examples - EXECUTE these commands with your actual plan content

**EXECUTE THIS NOW** (replace {YOUR_ACTUAL_PLAN_CONTENT} with the plan you just generated above):

```bash
# Step 1: Save YOUR ACTUAL GENERATED PLAN to file (not the placeholder text)
cat > plan.md << 'PLAN_EOF'
{YOUR_ACTUAL_PLAN_CONTENT}
PLAN_EOF

# Step 2: IMMEDIATELY post to GitHub (this is MANDATORY, not optional)
gh issue comment $1 --body-file plan.md

# Step 3: Add label (ignore error if label doesn't exist)
gh issue edit $1 --add-label "planned" 2>/dev/null || true
```

**CRITICAL**: The text "{YOUR_ACTUAL_PLAN_CONTENT}" above means insert the ENTIRE plan you generated from the template (from "# Plan for #$1" through "Note: This plan was generated..."). This is NOT a placeholder to leave as-is. You MUST substitute your actual generated content and RUN these bash commands.

For GitLab:
```bash
# Save YOUR ACTUAL PLAN and post for GitLab
cat > plan.md << 'PLAN_EOF'
{YOUR_ACTUAL_PLAN_CONTENT}
PLAN_EOF

glab issue note $1 --message "$(cat plan.md)"
glab issue update $1 --label "planned" 2>/dev/null || true
```

**Update TodoWrite items as completed:**
- Mark "Generate plan content from template" as "completed"
- Mark "Save plan to plan.md file" as "completed"
- Mark "Post plan.md to issue #$1 via gh issue comment" as "completed"
- Mark "Add 'planned' label to issue #$1" as "completed"

### Error Handling

If posting failed, diagnose and fix:

| Error Type | Detection | Fix |
|------------|-----------|-----|
| **Auth error** | `gh auth status` shows "Not logged into any GitHub hosts" | Run `gh auth login` and select github.com |
| **Rate limit** | HTTP 403 or "rate limit" in error | Check quota: `gh api rate_limit`. Wait until reset or use auth token |
| **Network error** | DNS/timeout errors | Check connection: `curl -I https://api.github.com`. If persistent, save plan.md locally and inform user to post manually |
| **Permission error** | HTTP 403 permission denied | Check: `gh repo view --json viewerPermission`. Need triage+ permission. Ask repo owner for access |

**If error persists after troubleshooting:**
- Save plan.md to current directory (already done)
- Output error message to user with plan content
- Instruct user to post manually via GitHub web UI

---

## Step 4.5: Research Quality Check

If research was performed, verify:
- [ ] Official documentation URL included (not just blog posts)
- [ ] At least 2 critical gotchas documented (or note "None found")
- [ ] 2-3 implementation approaches compared with pros/cons
- [ ] Specific recommendation made (not "depends on requirements")
- [ ] Version numbers included for packages/SDKs

## Step 5: Verify Success

Run ONE verification command:
```bash
gh issue view $1 --json comments --jq '.comments[-1].body' | head -5
```

If you see "# Plan for #$1" in the output, posting succeeded.
If not, the command failed - inform user immediately.

**Update TodoWrite:** Mark "Verify posting succeeded (check gh command output)" as "completed"

---

## Step 6: Completion Output (Only After Verification Passes)

**GATE CHECK:** Before outputting this message, confirm ALL TodoWrite items show "completed" status.

Only after ALL verifications pass AND ALL todos are complete, output:

```
✓ Plan created and posted to issue #$1.

Guidelines referenced: {list files that were loaded}

View plan: gh issue view $1 --comments

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
- [ ] [NEW] If third-party integration: Includes research findings with official docs, gotchas, and recommended approach

**Avoid:**
- Generic advice like "follow best practices"
- Vague steps like "implement feature"
- Missing guideline references
- Technology choices that contradict tech-stack.md
- [NEW] Trial-and-error implementations without consulting official docs

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
