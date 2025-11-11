---
description: Session 5 - Generate complete backlog from journey through to design
---

# Session 5: Generate Backlog

This is **Session 5** of the cascade. You'll create a production-ready backlog where every issue traces to user value.

## Your Role

You're a technical product manager creating a systematic backlog from all cascade outputs.

## Process

### Step 1: Read ALL Previous Outputs

```
Read: output/00-user-journey.md
Read: output/01-tech-stack.md
Read: output/02-mission.md
Read: output/03-metrics.md
Read: output/04-monetization.md
Read: output/05-architecture.md
Read: output/06-design-system.md
```

### Step 2: Generate Epic Structure

**Create 1 epic per journey step** (typically 3-5 epics):
- Epic 01: Onboarding (Journey Steps 1-2)
- Epic 02: Core Value Delivery (Journey Step 3 - THE KEY EPIC)
- Epic 03: Results & Actions (Journey Steps 4-5)
- Epic 04: Foundation (Auth, database, infrastructure)
- Epic 05: Design System Implementation
- Epic 06: Metrics & Analytics

### Step 3: Generate User Stories (30-50 total)

For EACH journey step, create stories that:

1. **Enable that step's user value**
2. **Use specified tech stack**
3. **Implement designed components**
4. **Track defined metrics**

**Story Format** (use `/templates/issue-template.md`):
```markdown
# [STORY-001] OAuth-based signup with Google

Type: Story
Journey Step: Step 1 (Onboarding)
Priority: P0

## User Value
When a compliance officer wants to try the product, they want frictionless signup, so they can reach value quickly.

Value: Reduces signup friction, improves activation rate (key metric).

## Acceptance Criteria
- [ ] User clicks "Sign up with Google"
- [ ] OAuth flow completes, creates user in PostgreSQL
- [ ] User lands in empty dashboard (ready for Step 2)

## Technical Approach
Tech Stack: Clerk for auth, PostgreSQL for user storage, Next.js frontend

## Dependencies
Blocked By: EPIC-04 (Database schema setup)

## Estimation
Effort: 2 days (1 day Clerk integration, 1 day user creation flow)
```

### Step 4: Apply RICE Prioritization

For each story, calculate RICE:

**R (Reach)**: How many users affected per time period?
**I (Impact)**: Journey improvement (0.25 = minimal, 0.5 = low, 1 = medium, 2 = high, 3 = massive)
**C (Confidence)**: Evidence level (50% = low, 80% = medium, 100% = high)
**E (Effort)**: Person-days

**RICE Score** = (R × I × C) ÷ E

**Priority Assignment**:
- P0: RICE > [threshold], critical for MVP
- P1: Important, post-MVP
- P2: Nice-to-have, defer

### Step 5: Map Dependencies

For each story, note:
- **Blocks**: What stories can't start until this is done?
- **Blocked By**: What must be done first?

Example:
- STORY-001 (OAuth) blocks STORY-010 (User dashboard)
- STORY-001 blocked by EPIC-04 (Database setup)

## Generating the Output

### Create Directory Structure:

```
output/07-backlog/
├── BACKLOG.md (summary)
└── issues/
    ├── epic-01-onboarding.md
    ├── epic-02-core-value.md
    ├── story-001-oauth-signup.md
    ├── story-002-document-upload.md
    └── ... (30-50 stories total)
```

### BACKLOG.md Contents:

- Epic summary (6-8 epics)
- Priority distribution (X P0 stories, Y P1, Z P2)
- Estimated timeline (total effort in weeks)
- Journey mapping (which stories serve which journey steps)

### Issue File Contents:

Use `/templates/issue-template.md` for EVERY story.

**Critical**: Each story must have:
- Journey step reference
- Clear user value
- Acceptance criteria (testable)
- Tech stack components used
- RICE score and priority
- Dependencies

## Validation Checklist

- [ ] Every issue references a journey step?
- [ ] All P0 issues have clear acceptance criteria?
- [ ] Dependencies are mapped?
- [ ] Estimates are reasonable (nothing >5 days)?
- [ ] Total backlog enables complete journey (Step 1→5)?
- [ ] Tech stack is used (stories reference chosen tech)?
- [ ] Design components are built (stories implement design system)?
- [ ] Metrics are tracked (analytics instrumented)?

## After Generation

```
✅ Session 5 complete! Production backlog generated.

Your Backlog:
📦 [X] epics covering full user journey
📋 [Y] user stories (prioritized with RICE)
   - [A] P0 stories (critical for MVP)
   - [B] P1 stories (important, post-MVP)
   - [C] P2 stories (nice-to-have)

Estimated MVP timeline: [Z] weeks

File created: output/07-backlog/BACKLOG.md + [Y] issue files

Next, we'll validate feasibility before pushing to GitHub.
```

## Validation Checkpoint: Build Feasibility

**⚠️ CRITICAL: Validate you can actually build this**

Before pushing issues to GitHub, validate that your backlog is actually buildable. This prevents scope creep and unrealistic timelines.

### Checkpoint Requirements

Ask the user:

```
🚦 VALIDATION CHECKPOINT: Build Feasibility

You've created a backlog with [X] P0 stories estimated at [Y] weeks.

Let's validate this is realistic:

**Can you build and ship 1 P0 epic in 2 weeks?**

Consider:
- [ ] Team capacity (how many hours/week can you dedicate?)
- [ ] Technical complexity (are there unknowns/research needed?)
- [ ] Dependencies (are tools/APIs/services available?)
- [ ] Testing requirements (time for QA, not just coding?)
- [ ] Your skill level (familiar with the tech stack?)

This isn't about working 80-hour weeks - it's about honest assessment.

Please respond with:
1. "Yes, realistic" - you can build 1 epic in 2 weeks
2. "No, need to rescope" - backlog is too ambitious
3. "Not sure" - I'll help you assess feasibility
```

### If User Says "Yes, realistic"

Ask them to document their capacity:
1. **Team Composition**: Solo? Team of X? Skills?
2. **Time Availability**: Hours per week dedicated to this?
3. **First Epic**: Which P0 epic will you build first?
4. **2-Week Plan**: What stories from that epic fit in 2 weeks?
5. **Risk Factors**: What could slow you down?

**Create feasibility assessment**:
```bash
Write output/07-backlog-feasibility.md
```

**Contents**:
```markdown
# Backlog Feasibility Assessment

**Assessment Date**: [Date]
**Backlog File**: output/07-backlog/BACKLOG.md

## Team & Capacity

### Team Composition
- **Size**: [Solo / Team of X]
- **Roles**: [Full-stack dev / Frontend + Backend / etc.]
- **Skills**: [Tech stack proficiency: 1-10]

### Time Availability
- **Hours per week**: [X hours]
- **Weeks until launch target**: [Y weeks]
- **Total capacity**: [X hours × Y weeks = Z hours]

### Backlog Scope
- **Total P0 stories**: [A stories]
- **Total P0 effort**: [B developer-days]
- **Required capacity**: [B days × 8 hours = C hours]

**Capacity Check**: [Z hours available] vs [C hours required]
- ✅ Have buffer (Z > C × 1.3) - healthy
- ⚠️ Tight fit (Z = C × 1.1-1.3) - risky
- ❌ Over capacity (Z < C) - must rescope

## First Epic: 2-Week Validation

### Selected P0 Epic
**Epic**: [Name, e.g., "Epic 02: Core Value Delivery"]
**Why this first**: [Strategic reason - enables other epics, delivers core value, etc.]

### 2-Week Sprint Plan

**Stories in scope** (total: ≤10 days of effort):
1. [STORY-XXX]: [Name] - [X days]
2. [STORY-YYY]: [Name] - [Y days]
3. [STORY-ZZZ]: [Name] - [Z days]

**Total**: [Sum] days (with [%] buffer)

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests written and passing
- [ ] Code reviewed (self or peer)
- [ ] Deployed to staging
- [ ] User can complete journey step

### Risk Factors

**Technical Risks**:
- [Risk 1: e.g., "OAuth integration - never done before" - Mitigation: Allocate 1 day for learning]
- [Risk 2: e.g., "Database migrations" - Mitigation: Use migration tool from scaffold]

**Time Risks**:
- [Risk 1: e.g., "Day job commitments" - Mitigation: Front-load work on weekends]
- [Risk 2: e.g., "Scope creep" - Mitigation: Strict adherence to acceptance criteria]

**Dependency Risks**:
- [Risk 1: e.g., "Third-party API rate limits" - Mitigation: Test API first, have fallback]

## Success Metrics

**After 2 weeks**:
- [ ] Epic completed (all stories done)
- [ ] Can demo to user (real or test user)
- [ ] Learned actual velocity (planned vs actual)
- [ ] Adjusted timeline for remaining epics

**If successful**: Proves backlog is feasible, continue to Session 6
**If not**: Rescope backlog, reduce P0 scope, extend timeline

## Velocity Calibration

After first 2-week epic:
- **Planned effort**: [X days]
- **Actual effort**: [Y days] (update after sprint)
- **Velocity factor**: [Y/X = Z] (e.g., 1.5 = estimates were 50% optimistic)

**Apply to remaining backlog**:
- Original timeline: [A weeks]
- Adjusted timeline: [A × Z weeks]
- New launch target: [Date]

---

**Gate Status**: ✅ PASS (Realistic) / ⚠️ PROCEED WITH CAUTION (Tight) / ❌ FAIL (Must rescope)

**Recommendation**: [Proceed to Session 6 / Rescope backlog / Extend timeline]
```

**Gate Logic**:
- **Capacity buffer >30%**: ✅ Healthy, proceed
- **Capacity buffer 10-30%**: ⚠️ Tight, proceed but monitor
- **No buffer (<10%)**: ❌ Recommend rescoping
- **Over capacity**: ❌ Must rescope or extend timeline

### If User Says "No, need to rescope"

**Help them rescope**:

```
Let's rescope to make this realistic. We have a few options:

**Option 1: Reduce MVP Scope**
- Keep only the absolute P0 stories (ruthlessly cut nice-to-haves)
- Which journey steps are ESSENTIAL for aha moment (Step 3)?
- Can we defer Steps 4-5 to post-launch?

**Option 2: Extend Timeline**
- Current capacity: [X hours/week]
- Required capacity: [Y hours]
- Realistic timeline: [Y/X weeks]
- New launch target: [Date]

**Option 3: Increase Capacity**
- Add team members (contractor, co-founder, intern)
- Reduce day job hours (if possible)
- Focus time blocks (fewer hours but more focused)

**Option 4: Simplify Technical Scope**
- Are you over-engineering? (Do you need microservices for MVP?)
- Can you use more no-code/low-code tools?
- Can you cut features that don't impact journey?

Which option resonates? Or combination?
```

**After discussing**, update the backlog:

```bash
# Read current backlog
Read output/07-backlog/BACKLOG.md

# Revise based on rescoping decisions
Edit output/07-backlog/BACKLOG.md
[Update P0/P1/P2 priorities, adjust estimates, remove stories]

# Document rescope decision
Write output/07-backlog-rescope.md
```

**Rescope documentation**:
```markdown
# Backlog Rescope Decision

**Rescope Date**: [Date]
**Original Backlog**: output/07-backlog/BACKLOG.md (original)
**Reason**: Feasibility checkpoint identified scope/capacity mismatch

## Original Scope
- **P0 Stories**: [X]
- **Estimated Timeline**: [Y weeks]
- **Required Capacity**: [Z hours]

## Capacity Reality
- **Available Capacity**: [A hours]
- **Gap**: [Z - A = B hours] ([C%] over capacity)

## Rescope Strategy

**Chosen Approach**: [Reduce scope / Extend timeline / Increase capacity / Simplify tech]

### Changes Made

**Stories Moved P0 → P1** (defer to post-launch):
- [STORY-XXX]: [Name] - [Reason: Not critical for aha moment]
- [STORY-YYY]: [Name] - [Reason: Can launch without this]

**Stories Removed** (cut entirely):
- [STORY-ZZZ]: [Name] - [Reason: Nice-to-have, not core value]

**Stories Simplified**:
- [STORY-AAA]: [Name] - [Changed from X to Y approach, saves Z days]

**Timeline Adjusted**:
- Original: [X weeks]
- New: [Y weeks]
- Reason: [Realistic given actual capacity]

## New MVP Scope

**Revised P0 Stories**: [X] (down from [Y])
**Revised Timeline**: [Z weeks]
**Revised Capacity Requirement**: [A hours]

**Buffer**: [B%] (healthy: >20%)

## What We Kept (Must-Haves)

**Journey Step 1** (Entry):
- [Stories that enable user to start]

**Journey Step 3** (Aha Moment):
- [Stories that deliver core value - NON-NEGOTIABLE]

**Foundation**:
- [Auth, database, core infrastructure]

## What We Deferred (Post-Launch)

**Journey Steps 4-5**:
- [Results/actions - can add after validating Step 3 works]

**Nice-to-Haves**:
- [Features that don't impact core value delivery]

## Success Criteria for Revised MVP

After launch with revised scope, user can:
1. [Journey Step 1: Entry point]
2. [Journey Step 2: Setup/config]
3. [Journey Step 3: AHA MOMENT - core value]

That's it. Everything else is post-launch iteration.

---

**Result**: ✅ Backlog is now realistic and buildable

**Next Step**: Proceed to Session 6 (/create-gh-issues) with rescoped backlog
```

### If User Says "Not sure"

**Create feasibility assessment guide**:
```bash
Write output/07-feasibility-assessment-guide.md
```

**Contents**:
```markdown
# Build Feasibility Self-Assessment

Use this guide to honestly assess if your backlog is realistic.

## Step 1: Calculate Your Capacity

### Time Availability
Answer honestly:
1. How many hours per WEEK can you dedicate to this project?
   - [ ] 5-10 hours (side project, have day job)
   - [ ] 20-30 hours (part-time focus)
   - [ ] 40+ hours (full-time)

2. How many WEEKS until you want to launch?
   - [ ] 4 weeks (1 month sprint)
   - [ ] 8 weeks (2 month timeline)
   - [ ] 12+ weeks (3+ months)

**Your Total Capacity**: [Hours/week × Weeks = Total hours]

Example: 10 hrs/week × 8 weeks = 80 hours

### Team Reality
3. Are you solo or team?
   - [ ] Solo (all roles: frontend, backend, design, etc.)
   - [ ] Team of 2-3 (can parallelize work)
   - [ ] Team of 4+ (can split epics)

4. What's your skill level with chosen tech stack? (1-10)
   - [ ] 1-3: Learning as I go (add 50% time buffer)
   - [ ] 4-7: Comfortable but not expert (add 30% buffer)
   - [ ] 8-10: Expert (add 20% buffer for unknowns)

**Adjusted Capacity**: [Total hours × (1 - buffer%) = Effective hours]

Example: 80 hours × 0.7 (30% buffer) = 56 effective hours

## Step 2: Calculate Backlog Scope

From your `output/07-backlog/BACKLOG.md`:

1. Count P0 stories: [X stories]
2. Sum P0 effort estimates: [Y developer-days]
3. Convert to hours: [Y days × 8 hours = Z hours]

Example: 15 stories, 20 dev-days = 160 hours

## Step 3: Compare Capacity vs Scope

**Capacity**: [A effective hours]
**Scope**: [B required hours]

**Math**:
- If A > B × 1.3: ✅ Healthy buffer, realistic
- If A = B × 1.1-1.3: ⚠️ Tight but doable, risky
- If A < B: ❌ Over capacity, MUST rescope

Example: 56 hours vs 160 hours = 0.35x capacity = ❌ Need to rescope

## Step 4: The 2-Week Epic Test

Pick your FIRST P0 epic (usually "Core Value Delivery"):

1. List all stories in that epic
2. Sum effort estimates
3. Can you complete it in 2 weeks with your available hours?

**2-Week Capacity**: [Hours/week × 2 = X hours]
**Epic Scope**: [Y hours]

- If Y < X: ✅ Pass - backlog is realistic
- If Y > X: ❌ Fail - backlog is too ambitious, rescope

## Step 5: Decision Tree

### ✅ PASS (Healthy Capacity)
→ Proceed to Session 6 (/create-gh-issues)
→ Document plan in output/07-backlog-feasibility.md
→ Set realistic milestones

### ⚠️ CAUTION (Tight Fit)
→ Proceed BUT with strict scope discipline
→ No scope creep during development
→ Have contingency: which P0 stories could move to P1 if you're behind?

### ❌ FAIL (Over Capacity)
You have 3 options:

**Option 1: Reduce Scope (Recommended)**
- Cut P0 stories to ONLY aha moment (Journey Step 3)
- Defer Steps 4-5 to post-launch
- Remove "nice to haves"
→ Rerun /generate-backlog with narrower focus

**Option 2: Extend Timeline**
- Required hours: [X]
- Your weekly capacity: [Y hours/week]
- Realistic timeline: [X/Y = Z weeks]
→ Adjust launch date, communicate to stakeholders

**Option 3: Increase Capacity**
- Add team member (co-founder, contractor)
- Reduce day job hours
- Use no-code/low-code tools to save dev time
→ Recalculate capacity with new resources

## Step 6: Document Your Decision

After assessment, create:
- output/07-backlog-feasibility.md (if realistic)
- output/07-backlog-rescope.md (if you reduced scope)

---

**Remember**: It's better to ship a small MVP in 2 months than abandon a huge backlog after 6 months of burnout.

Start small, prove value, iterate.
```

**Then tell user**:
```
✅ Feasibility assessment guide created!

I've created output/07-feasibility-assessment-guide.md to help you assess if your backlog is realistic.

Work through the 6 steps:
1. Calculate your capacity (hours available)
2. Calculate backlog scope (hours required)
3. Compare (do you have buffer?)
4. Test with 1 epic in 2 weeks
5. Make decision (proceed / rescope / extend timeline)
6. Document your decision

This is the "reality check" moment. Better to rescope now than burn out halfway through.

Come back when you've completed the assessment and tell me: Pass / Caution / Fail
```

## Continue After Validation

Once feasibility is validated (or backlog is rescoped):

```
✅ Session 5 complete! Production backlog generated and validated.

Your Backlog:
📦 [X] epics covering full user journey
📋 [Y] user stories (prioritized with RICE)
   - [A] P0 stories (critical for MVP)
   - [B] P1 stories (important, post-MVP)
   - [C] P2 stories (nice-to-have)

Estimated MVP timeline: [Z] weeks
Feasibility status: ✅ Validated realistic

File created: output/07-backlog/BACKLOG.md + [Y] issue files
Validation: output/07-backlog-feasibility.md

Next, we can push these issues to GitHub.

When ready, run: /create-gh-issues
Or check progress: /cascade-status
```

## Important Guidelines

1. **Every issue traces to journey**: No "nice to have" features disconnected from user value
2. **Use specified tech stack**: Stories should reference chosen technologies
3. **Implement design system**: Stories should reference designed components
4. **Track metrics**: Include analytics instrumentation stories
5. **Reasonable estimates**: No story >5 days (break down if larger)
6. **Clear acceptance criteria**: Every story testable

## Reference

- Template: `/templates/issue-template.md`
- Example: `/examples/compliance-saas/backlog/` (if created)

---

**Now, synthesize all cascade outputs into a complete, prioritized backlog!**
