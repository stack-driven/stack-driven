# Epic: Remove Session Bloat (Reverse Engineering of Epic #167)

**Status**: Critical
**Priority**: P0
**Estimated Timeline**: 2-3 weeks
**Created**: 2026-02-05

---

## Problem Statement

Sessions 1-9b generate **bloated outputs** (1,500-2,500+ lines) that are:
1. **70-85% reference material** (examples, patterns, theory) instead of journey-specific decisions
2. **Causing cascade failures** due to token exhaustion (610k+ tokens across Sessions 9 + 9b)
3. **Unusable by users** (who can read 2,563 lines of test strategy?)

**Root Cause**: Commands evolved into educational encyclopedias. Epic #167's sub-agent decomposition treated the symptom (context overflow) instead of the disease (content bloat).

**Evidence**:
- Session 9 (Test Strategy): 2,563 lines generated, 6 sub-agents invoked (~400k tokens)
- Session 9b (Application Architecture): 5 sub-agents invoked (~210k tokens), estimated 8,000 lines output
- Session 7 (Database Schema): 418-line orchestrator + 2,954 lines of sub-agents
- .ctx.md files achieve 60-70% reduction → proving decisions CAN be condensed

**The Insight**: If .ctx.md can condense 70%, why not generate lean outputs from the start?

---

## Success Criteria

1. ✅ Session outputs: **300-800 lines max** (decisions only, journey-specific)
2. ✅ Cascade completes Sessions 1-14 within **token budget** (no failures)
3. ✅ Users can read and understand outputs in **10-15 minutes per session**
4. ✅ Session 10 (Backlog) generates same quality stories with lean inputs
5. ✅ Sub-agents removed from Sessions 7, 8, 9, 9b (orchestration overhead eliminated)

---

## Fix Strategy

### Phase 1: Document & Establish Limits (Week 1)

**Issues**:
- [ ] #201: Audit all generated files (measure bloat)
- [ ] #202: Establish output line limits policy
- [ ] #203: Update VALIDATION-CHECKLIST.md (Category 13: Output Conciseness)

**Deliverables**:
- BLOAT-AUDIT.md with line counts, bloat %, recommendations per session
- OUTPUT-LIMITS-POLICY.md with enforcement rules
- VALIDATION-CHECKLIST.md updated

### Phase 2: Surgical Debloat (Week 2-3)

**Priority Order** (highest token cost first):

1. [ ] #204: **Session 9 (Test Strategy)** - Remove 6 sub-agents, rewrite as 200-line command → 500-line output
2. [ ] #205: **Session 9b (Application Architecture)** - Remove 6 sub-agents, rewrite as 250-line command → 600-line output
3. [ ] #206: **Session 8b (API Contracts)** - Remove 5 sub-agents, rewrite as 200-line command → 500-line output
4. [ ] #207: **Session 8 (API Design)** - Remove 7 sub-agents, rewrite as 250-line command → 600-line output
5. [ ] #208: **Session 7 (Database Schema)** - Remove 7 sub-agents, rewrite as 200-line command → 500-line output

**Approach for Each Session**:
1. Read current output (e.g., 09-test-strategy.md)
2. Extract ONLY journey-specific decisions (ignore examples, theory)
3. Rewrite command as single file (200-250 lines)
4. Generate new output (500-800 lines)
5. Verify Session 10+ still work with lean input

### Phase 3: Content Migration (Week 3)

**Issues**:
- [ ] #209: Move testing patterns to `/reference-material/testing-patterns.md`
- [ ] #210: Move API patterns to `/reference-material/api-patterns.md`
- [ ] #211: Move database patterns to `/reference-material/database-patterns.md`
- [ ] #212: Update commands to **reference** (not duplicate) patterns

### Phase 4: Validation (Week 3)

**Issues**:
- [ ] #213: Test full cascade (Sessions 1-14) with lean outputs
- [ ] #214: Measure token reduction (target: 60-70% reduction)
- [ ] #215: User testing (can they understand outputs in 10-15 min?)
- [ ] #216: Update CLAUDE.md with Anti-Bloat Principles

---

## Anti-Bloat Principles (for CLAUDE.md)

1. **Output Target**: 300-800 lines per session (decisions only)
2. **Content Rules**:
   - ✅ KEEP: Journey-specific decisions, traceability, chosen options
   - ❌ REMOVE: Comprehensive examples, educational theory, pattern catalogs
3. **Quality Bar**: "Good enough to generate backlog" (not "comprehensive reference guide")
4. **Reference Material**: Link to `/reference-material/`, don't duplicate
5. **Validation**: If output >800 lines, it's bloated (exception: Session 12 scaffold with code)

---

## Risks & Mitigations

**Risk**: Session 10 fails with lean inputs
**Mitigation**: Test Session 10 generation after each session rewrite

**Risk**: Users complain about missing details
**Mitigation**: Reference material still exists in `/reference-material/`, just not in user outputs

**Risk**: Takes 3 weeks (delays other work)
**Mitigation**: This is P0 - cascade is broken, must fix before users hit it

---

## Rollback Plan

If lean sessions break cascade:
1. Keep sub-agent architecture (Epic #167 state)
2. Enforce output limits on sub-agents (2,000 words max per agent)
3. Accept higher token costs as "cost of doing business"

---

## Dependencies

- None (this is foundational fix)

---

## Related Issues

- Epic #167 (Command Size Policy) - Was correct diagnosis, wrong treatment
- Issue #165 (Session 8 Agentic Architecture) - Introduced sub-agent pattern
- Issue #169 (Session 7 Decomposition) - Created bloated sub-agent tree

---

## Accountability

- **DRI**: @bru (repository owner)
- **Validation**: Test cascade with real MyClosly journey
- **Timeline**: Must complete before promoting framework publicly
