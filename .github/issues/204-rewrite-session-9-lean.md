# Issue #204: Rewrite Session 9 (Test Strategy) as Lean Decision Engine

**Epic**: #200 (Remove Session Bloat)
**Priority**: P0
**Status**: Ready for Work
**Estimated Time**: 1-2 days
**Depends On**: #201 (Audit - for baseline measurements)

---

## Objective

Rewrite `/create-test-strategy` (Session 9) to generate **500-line outputs** (down from 2,563 lines) by:
1. Removing all 6 sub-agents (unit, integration, E2E, performance, security, property-based)
2. Rewriting command as single 200-line file
3. Focusing on journey-specific decisions only (no comprehensive patterns)
4. Moving reference material to `/reference-material/testing-patterns.md`

---

## Current State (Bloated)

**Command Structure**:
- Orchestrator: `/.claude/commands/create-test-strategy.md` (~400 lines)
- Sub-agents: 6 agents in `/.claude/agents/` (~1,500+ lines total)
- Total command code: ~1,900 lines

**Output Generated**:
- `09-test-strategy.md`: 2,563 lines
- Token consumption: ~60-90k tokens per sub-agent = ~400k tokens total
- User experience: Unusable (who reads 2,563 lines?)

**What's bloated**:
- Comprehensive testing patterns (all scenarios, not journey-specific)
- Educational theory ("what is property-based testing?")
- Example catalogs (10+ examples when 2 would suffice)
- Framework comparisons (Pytest vs unittest, Patrol vs flutter_driver)
- Non-journey-specific advice ("test your API endpoints")

---

## Target State (Lean)

**Command Structure**:
- Single file: `/.claude/commands/create-test-strategy.md` (200 lines)
- No sub-agents
- No orchestration complexity

**Output Generated**:
- `09-test-strategy.md`: **500 lines max**
- Token consumption: ~15-20k tokens (75% reduction)
- User experience: Readable in 10-15 minutes

**What to KEEP**:
- Testing philosophy (1 paragraph: why test this way for THIS journey)
- Framework choices (with 1-line rationale each)
- Coverage targets (with journey justification)
- Critical tests (5-10 examples tied to journey steps)
- Risk classification (HIGH/MEDIUM/LOW with evidence)

**What to REMOVE**:
- Comprehensive pattern catalogs
- Educational sections
- Framework comparisons (just state the choice)
- Extensive examples (2-3 max per category)
- Generic advice

---

## Implementation Plan

### Step 1: Extract Essential Decisions (2-4 hours)

Read current `09-test-strategy.md` and extract ONLY:
1. Testing philosophy (why this approach for THIS journey)
2. Framework selections (backend, frontend, E2E, load, security)
3. Coverage targets (with rationale)
4. Architecture classification (Trophy/Pyramid/etc)
5. Risk level (HIGH/MEDIUM/LOW)
6. 5-10 critical tests (tied to journey steps)
7. What We Didn't Choose (3-5 alternatives, 1 line each)

Create `/docs/session-9-decisions-only.md` as extraction output.

### Step 2: Migrate Reference Material (1-2 hours)

Create `/reference-material/testing-patterns.md`:
- Property-based testing guide
- Contract testing guide
- Performance testing patterns
- Security testing checklist (OWASP)
- E2E testing patterns

Move ALL educational/pattern content from current command to this file.

### Step 3: Rewrite Command (3-4 hours)

Create new `/.claude/commands/create-test-strategy.md` (200 lines):

```markdown
---
description: Generate lean test strategy (500 lines max)
---

# Session 9: Create Test Strategy

## Your Role
You generate a **concise test strategy** (500 lines max) with journey-specific decisions.

## Critical Principle: LEAN DECISIONS ONLY

**Output target**: 500 lines max
**Content rule**: Journey-specific decisions, not comprehensive patterns
**Quality bar**: "Good enough to generate backlog" (Session 10)

## Steps

### Step 1: Read Context
Read .ctx.md files:
- 00-user-journey.ctx.md (journey steps, aha moment, risk factors)
- 02-tech-stack.ctx.md (frameworks to test)
- 04-architecture.ctx.md (architecture style)
- 07-database-schema.ctx.md (entities, relationships)
- 08b-api-contracts.ctx.md (API endpoints)

### Step 2: Analyze Journey Requirements

**Architecture Classification**:
- Monolith = Pyramid (70% unit, 20% integration, 10% E2E)
- Microservices = Trophy (30% unit, 50% integration, 20% E2E)
- Hybrid = Modified Trophy

**Risk Level Detection**:
- HIGH RISK if: PII data OR financial data OR compliance requirements OR business-critical algorithm
- MEDIUM RISK if: User accounts OR social features OR third-party integrations
- LOW RISK if: Simple CRUD OR internal tools

**Testing Scope**:
- Unit: Always required
- Integration: If database OR external APIs
- E2E: If user-facing app (web/mobile)
- Performance: If SLOs defined OR high traffic expected
- Security: If HIGH RISK
- Property-based: If HIGH domain complexity (algorithms, validation logic)

### Step 3: Make Framework Decisions

For each test type (from Step 2 scope):
1. Choose framework (tech stack informs choice)
2. One-line rationale (journey-specific)
3. Reference `/reference-material/testing-patterns.md` for patterns (don't duplicate)

### Step 4: Define Critical Tests

Extract 5-10 critical tests from journey:
- Map to journey steps (Step 2 = onboarding, Step 3 = aha moment, etc.)
- Focus on highest risk areas
- Tie to business metrics (e.g., "validate 70-85% accuracy requirement")

### Step 5: Write Output (500 lines max)

Use template: `/templates/09-test-strategy-template.md` (needs update)

Structure:
1. Executive Summary (50 lines)
2. Testing Philosophy (50 lines)
3. Framework Decisions (100 lines)
4. Critical Tests (200 lines)
5. Journey Traceability (50 lines)
6. What We Didn't Choose (50 lines)

**STRICT ENFORCEMENT**: If output >600 lines, it's bloated. Cut examples, not decisions.

### Step 6: Generate Context File

Invoke distill-context agent to create 09-test-strategy.ctx.md (target: 60-70% reduction).

### Step 7: Validation Checklist

Before completion:
- [ ] Output ≤500 lines
- [ ] All framework choices trace to journey
- [ ] No educational sections (theory goes in /reference-material/)
- [ ] No comprehensive examples (2-3 max per category)
- [ ] Critical tests map to journey steps
- [ ] "What We Didn't Choose" section present

## Output Format

[Simplified template structure - see Step 5]

## Reference Material

For comprehensive testing patterns, see:
- `/reference-material/testing-patterns.md`
- `/reference-material/property-based-testing-guide.md`
- `/reference-material/security-testing-guide.md`

Commands should REFERENCE these (don't duplicate content).
```

### Step 4: Update Template (1 hour)

Simplify `/templates/09-test-strategy-template.md`:
- Remove verbose sections
- Add line count targets per section
- Emphasize "decisions only, no examples"

### Step 5: Test with MyClosly Journey (2 hours)

1. Delete current `09-test-strategy.md` and `.ctx.md`
2. Run new `/create-test-strategy` command
3. Measure output:
   - Line count (target: ≤500 lines)
   - Token count (target: ≤2,500 tokens = ~15-20k tokens during generation)
   - Readability (can you understand it in 10 minutes?)
4. Verify Session 10 compatibility:
   - Read new `09-test-strategy.ctx.md`
   - Check if Session 10 can still generate backlog stories

### Step 6: Document Savings (30 min)

Update `BLOAT-AUDIT.md`:
- Before: 2,563 lines, ~400k tokens
- After: XXX lines, ~15-20k tokens
- Savings: XX% reduction
- Session 10 compatibility: ✅/❌

---

## Acceptance Criteria

- [ ] `/create-test-strategy` is single 200-line file (no sub-agents)
- [ ] Output is ≤500 lines (measured with MyClosly journey)
- [ ] Token consumption ≤20k during generation (75%+ reduction)
- [ ] All decisions trace to journey (spot-check 5 decisions)
- [ ] Session 10 still works with new input (run `/generate-backlog`)
- [ ] Reference material moved to `/reference-material/testing-patterns.md`
- [ ] BLOAT-AUDIT.md updated with measurements
- [ ] VALIDATION-CHECKLIST.md updated (Category 13: Output Conciseness)

---

## Success Metrics

**Primary**:
- Output line count: 2,563 → ≤500 (80%+ reduction)
- Token consumption: ~400k → ~15-20k (95%+ reduction)

**Secondary**:
- User readability: Can understand in 10-15 minutes (vs. 2+ hours)
- Cascade compatibility: Session 10 generates same quality backlog

---

## Risks & Mitigations

**Risk**: Session 10 breaks with lean input
**Mitigation**: Test `/generate-backlog` after rewrite, compare backlog quality

**Risk**: Users complain about missing details
**Mitigation**: Reference material still exists, just not in user output

**Risk**: Too aggressive trimming (lose essential decisions)
**Mitigation**: Keep extraction doc (`/docs/session-9-decisions-only.md`) for reference

---

## Rollback Plan

If Session 10 breaks:
1. Keep sub-agent architecture
2. Enforce 2,000-word limit per sub-agent (reduce bloat within current structure)
3. Document why lean approach failed

---

## Related Issues

- #201: Audit (provides baseline)
- #205: Session 9b rewrite (same pattern)
- #209: Move testing patterns to /reference-material/ (content migration)

---

## Definition of Done

- [ ] PR merged with new lean command
- [ ] Tested with MyClosly journey (output ≤500 lines)
- [ ] Session 10 compatibility verified
- [ ] Measurements documented in BLOAT-AUDIT.md
- [ ] CLAUDE.md updated with anti-bloat principles
