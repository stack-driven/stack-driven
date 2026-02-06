# Epic #200: Remove Session Bloat - Action Plan

**Status**: Ready to Execute
**Priority**: P0 (Critical - Cascade Broken)
**Timeline**: 2-3 weeks
**Created**: 2026-02-05

---

## The Problem

Stack-Driven sessions generate **bloated outputs** (1,500-2,500+ lines, 70-85% unnecessary content), causing:
1. **Cascade failures** (610k+ tokens across Sessions 9 + 9b, token exhaustion)
2. **User frustration** (who reads 2,563 lines of test strategy?)
3. **Maintenance nightmare** (orchestration complexity, sub-agent overhead)

**Root Cause**: Commands evolved into educational encyclopedias instead of journey-specific decision engines. Epic #167's sub-agent decomposition treated the symptom (context overflow) instead of the disease (content bloat).

---

## The Solution

**Radical simplification**:
1. Remove all sub-agents (Sessions 7, 8, 8b, 9, 9b)
2. Rewrite as lean decision engines (200-line commands → 300-800 line outputs)
3. Move educational content to `/reference-material/` (reference, don't duplicate)
4. Enforce strict output limits (300-800 lines per session)

**Expected Impact**:
- 75-90% token reduction per session
- Cascade completes within budget
- Users read/understand in 10-15 minutes
- Zero orchestration overhead

---

## Quick Start

### Immediate Actions (Do These First)

1. **Read the Epic**: `.github/DEBLOAT-EPIC.md` (strategic overview)
2. **Start with Audit**: Issue #201 (measure the damage)
3. **Fix Session 9 First**: Issue #204 (biggest pain point, immediate relief)

### Week 1: Measurement & Foundation

| Day | Issue | Task | Output |
|-----|-------|------|--------|
| 1-2 | #201 | Audit all generated files | `BLOAT-AUDIT.md` with measurements |
| 3 | #202 | Create output limits policy | `OUTPUT-LIMITS-POLICY.md` |
| 4 | #203 | Update VALIDATION-CHECKLIST.md | Category 13: Output Conciseness |
| 5 | Review | Team review of audit findings | Go/no-go decision |

### Week 2: Surgical Debloat (Highest Priority)

| Day | Issue | Session | Impact |
|-----|-------|---------|--------|
| 6-7 | #204 | Session 9 (Test Strategy) | 2,563 → 500 lines (80% reduction) |
| 8-9 | #205 | Session 9b (Application Architecture) | ~8,000 → 600 lines (92% reduction) |
| 10 | Test | Run Sessions 9-10 with lean outputs | Verify backlog generation works |

### Week 3: Complete Debloat & Validation

| Day | Issue | Session | Impact |
|-----|-------|---------|--------|
| 11-12 | #206 | Session 8b (API Contracts) | 5 sub-agents → single command |
| 13-14 | #207 | Session 8 (API Design) | 7 sub-agents → single command |
| 15 | #208 | Session 7 (Database Schema) | 7 sub-agents → single command |
| 16 | #213 | Test full cascade (S1-14) | Verify everything works |
| 17 | #216 | Update CLAUDE.md | Embed anti-bloat principles |
| 18 | Wrap-up | Documentation & announcements | Epic complete |

---

## All Issues (Execution Order)

### Phase 1: Document & Establish Limits (Week 1)
- [ ] **#201**: Audit Generated File Sizes (`BLOAT-AUDIT.md`)
- [ ] **#202**: Establish Output Line Limits Policy (`OUTPUT-LIMITS-POLICY.md`)
- [ ] **#203**: Update VALIDATION-CHECKLIST.md (Category 13)

### Phase 2: Surgical Debloat (Week 2-3)
- [ ] **#204**: Rewrite Session 9 (Test Strategy) - **START HERE**
- [ ] **#205**: Rewrite Session 9b (Application Architecture)
- [ ] **#206**: Rewrite Session 8b (API Contracts)
- [ ] **#207**: Rewrite Session 8 (API Design)
- [ ] **#208**: Rewrite Session 7 (Database Schema)

### Phase 3: Content Migration (Week 3)
- [ ] **#209**: Move testing patterns to `/reference-material/testing-patterns.md`
- [ ] **#210**: Move API patterns to `/reference-material/api-patterns.md`
- [ ] **#211**: Move database patterns to `/reference-material/database-patterns.md`
- [ ] **#212**: Update commands to reference (not duplicate) patterns

### Phase 4: Validation (Week 3)
- [ ] **#213**: Test full cascade (Sessions 1-14) with lean outputs
- [ ] **#214**: Measure token reduction (target: 60-70%)
- [ ] **#215**: User testing (10-15 min readability)
- [ ] **#216**: Update CLAUDE.md with Anti-Bloat Principles

---

## Issue Files

All issues are in `.github/issues/`:
- `201-audit-session-bloat.md`
- `202-output-limits-policy.md`
- `203-update-validation-checklist.md` (to be created)
- `204-rewrite-session-9-lean.md`
- `205-rewrite-session-9b-lean.md` (to be created)
- `206-rewrite-session-8b-lean.md` (to be created)
- `207-rewrite-session-8-lean.md` (to be created)
- `208-rewrite-session-7-lean.md` (to be created)
- `209-212-migrate-reference-material.md` (to be created)
- `213-test-full-cascade.md` (to be created)
- `214-measure-token-reduction.md` (to be created)
- `215-user-testing.md` (to be created)
- `216-update-claudemd-anti-bloat.md`

---

## Success Metrics

**Primary Goals**:
- ✅ Cascade completes Sessions 1-14 within token budget (no failures)
- ✅ Session outputs: 300-800 lines (80%+ reduction from current)
- ✅ Token consumption: 60-70% reduction per session
- ✅ Users read/understand in 10-15 minutes (vs. 2+ hours)

**Secondary Goals**:
- ✅ Zero sub-agents in Sessions 7-9b (orchestration eliminated)
- ✅ 90%+ compliance with output limits (validated by `/validate-outputs`)
- ✅ Reference material organized (educational content preserved, just not in outputs)

---

## Anti-Bloat Principles (Quick Reference)

### Content Rules

**✅ KEEP**:
- Journey-specific decisions (with one-line rationale)
- Traceability to journey steps
- Chosen options + key alternatives (3-5 max)
- Validation criteria

**❌ REMOVE**:
- Educational theory → `/reference-material/`
- Comprehensive examples (>3 per decision)
- Pattern catalogs (when journey needs subset)
- Framework comparisons → just state choice
- Generic advice (applicable to any product)

### Quality Bar

**"Good enough to generate backlog"** (not "comprehensive reference guide")

**Test**:
1. Can Session 10 generate stories from this? ✅
2. Can user understand in 10-15 minutes? ✅
3. Do all decisions trace to journey? ✅
4. Is it journey-specific (not generic)? ✅

### Line Limits

| Session Type | Max Lines |
|--------------|-----------|
| Journey/Strategy (S1, S2, S2a) | 400-600 |
| Technical Foundation (S3, S3b, S3c) | 300-500 |
| Strategic (S4) | 400-600 |
| Design (S5, S6) | 500-700 |
| Architecture (S7, S8, S8b, S9, S9b) | 500-800 |
| Deployment/Observability (S13, S14) | 400-600 |

---

## Getting Started

1. **Read Epic**: `.github/DEBLOAT-EPIC.md` (5 minutes)
2. **Pick First Issue**: Start with #201 (Audit) or #204 (Session 9 rewrite)
3. **Create GitHub Issues**: Convert markdown files to actual GitHub issues
4. **Assign**: Assign issues to yourself or team members
5. **Execute**: Follow 3-week timeline above

---

## Questions?

- **Why not keep sub-agents?** Orchestration overhead without solving root cause (bloat)
- **Will Session 10 break?** No - .ctx.md files prove decisions can be condensed 70%
- **What about missing details?** Reference material preserved in `/reference-material/`, just not in user outputs
- **How long will this take?** 2-3 weeks for complete debloat, but Session 9 fix (Issue #204) gives immediate relief

---

## Rollback Plan

If lean sessions break cascade:
1. Keep sub-agent architecture
2. Enforce 2,000-word limit per sub-agent (reduce bloat within current structure)
3. Document why lean approach failed
4. Accept higher token costs

---

**DRI**: @bru
**Status Updates**: Will update this README as issues complete
**Last Updated**: 2026-02-05
