# Issue #201: Audit Generated File Sizes and Bloat Percentage

**Epic**: #200 (Remove Session Bloat)
**Priority**: P0
**Status**: Ready for Work
**Estimated Time**: 2-4 hours

---

## Objective

Measure the actual damage from session bloat by auditing all generated files in `product-guidelines/` and calculating:
1. Total line count per file
2. Estimated bloat percentage (reference material vs. decisions)
3. Token count per file
4. Recommendations for target size

---

## Acceptance Criteria

- [ ] Create `/docs/BLOAT-AUDIT.md` with findings
- [ ] Audit ALL `.md` files in `product-guidelines/` (Sessions 00-09b)
- [ ] For each file, document:
  - Current line count
  - Estimated bloat % (via spot-check analysis)
  - Token count (estimate: ~5 tokens per line)
  - Recommended target line count (300-800 lines)
  - Bloat type (examples? theory? patterns? repetition?)
- [ ] Rank sessions by bloat severity (highest token waste first)
- [ ] Calculate total token savings if all sessions hit target

---

## Audit Template

For each session, fill out:

```markdown
### Session X: [Name]

**Current State**:
- File: `XX-name.md`
- Line count: XXXX lines
- Estimated tokens: XXXX (~5 tokens/line)
- .ctx.md line count: XXX lines (XX% reduction)

**Bloat Analysis** (spot-check 3-5 sections):
- Essential decisions: ~XX% (keep)
- Examples/patterns: ~XX% (move to /reference-material/)
- Educational theory: ~XX% (remove)
- Repetition: ~XX% (remove)

**Target State**:
- Recommended line count: XXX lines
- Token savings: XXXX tokens (XX% reduction)
- Priority: High/Medium/Low

**Bloat Type**:
- [ ] Comprehensive examples (e.g., 10+ test scenarios when 3 would suffice)
- [ ] Educational theory (e.g., "what is property-based testing")
- [ ] Pattern catalogs (e.g., all 12 transaction patterns when journey needs 3)
- [ ] Repetition (e.g., same GDPR compliance mentioned in 5 sections)
- [ ] Non-journey-specific content (e.g., generic advice applicable to any product)
```

---

## Sessions to Audit

Priority order (highest suspected bloat first):

1. **Session 9** (09-test-strategy.md): 2,563 lines ← START HERE
2. **Session 9b** (09b-application-architecture.md): ~8,000 lines (estimated from 5 sub-agents)
3. **Session 8b** (08b-api-contracts.md): Unknown
4. **Session 8** (08-api-design.md): Unknown
5. **Session 7** (07-database-schema.md): Unknown
6. **Session 6** (06-design-system.md): Unknown
7. **Session 5** (05-brand-strategy.md): Unknown
8. **Session 4** (04-architecture.md): Unknown
9. **Session 3c** (02c-ai-integration-strategy.md): Unknown
10. **Session 3b** (02b-coding-standards.md): 1,000 lines (.ctx.md)
11. **Session 3** (02-tech-stack.md): Unknown
12. **Session 2a** (02a-constraints.md): Unknown
13. **Session 2** (01-product-strategy.md): Unknown
14. **Session 1** (00-user-journey.md): Unknown

---

## Method

For each file:

1. **Read the file**: Use `wc -l` to get line count
2. **Spot-check 3-5 sections**: Identify what's essential vs. bloat
3. **Classify content**:
   - Essential: Journey-specific decisions, traceability, chosen options
   - Bloat: Examples, theory, patterns, repetition
4. **Estimate bloat %**: Based on spot-check sample
5. **Calculate token count**: Line count × 5 tokens/line (rough estimate)
6. **Recommend target**: 300-800 lines depending on session complexity

---

## Deliverable Format

Create `/docs/BLOAT-AUDIT.md`:

```markdown
# Session Bloat Audit Report

**Date**: 2026-02-05
**Auditor**: [Name]
**Journey Tested**: MyClosly (fashion recommendation app)

---

## Executive Summary

- **Total lines generated**: XXXXX lines across 14 sessions
- **Estimated bloat**: XX% (XXXXX lines unnecessary)
- **Token cost**: XXXXX tokens (current) → XXXXX tokens (target) = XX% reduction
- **Highest bloat sessions**: Session 9b (XX%), Session 9 (XX%), Session 8b (XX%)

---

## Session-by-Session Analysis

[Paste audit template for each session]

---

## Recommendations

1. **Immediate fixes** (P0): Sessions 9, 9b, 8b (highest token cost)
2. **High priority** (P1): Sessions 7, 8 (feed into later sessions)
3. **Medium priority** (P2): Sessions 4, 5, 6 (strategic, but less bloat suspected)

---

## Token Savings Projection

If all sessions hit 300-800 line target:
- Current: XXXXX tokens
- Target: XXXXX tokens
- Savings: XXXXX tokens (XX% reduction)
- Impact: Cascade completes within token budget ✅
```

---

## Notes

- Use MyClosly journey as test case (product-guidelines/ is gitignored, so this is real user data)
- Focus on HIGH BLOAT sessions first (9, 9b, 8b) for quick wins
- Spot-check is acceptable (don't need line-by-line analysis)
- Goal: Quantify problem → justify fix effort
