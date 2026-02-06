# Issue #202: Establish Output Line Limits Policy

**Epic**: #200 (Remove Session Bloat)
**Priority**: P0
**Status**: Ready for Work
**Estimated Time**: 2-3 hours
**Depends On**: #201 (Audit - for data-driven limits)

---

## Objective

Create `/docs/OUTPUT-LIMITS-POLICY.md` that defines:
1. Maximum line counts per session type
2. Content rules (what to keep vs. remove)
3. Enforcement mechanisms
4. Quality bar for outputs

This policy prevents future bloat by establishing clear boundaries.

---

## Policy Structure

### Section 1: Output Line Limits

Define maximum line counts per session category:

| Session Type | Max Lines | Rationale |
|--------------|-----------|-----------|
| **Journey/Strategy** (S1, S2, S2a) | 400-600 | Must capture behavioral profile, market analysis, constraints |
| **Technical Foundation** (S3, S3b, S3c) | 300-500 | Stack decisions, coding standards, AI integration (if applicable) |
| **Strategic** (S4: Mission/Metrics/Monetization/Analytics) | 400-600 | 4 sub-documents, each 100-150 lines |
| **Design** (S5, S6) | 500-700 | Brand strategy, design system (DTCG tokens, WCAG tables) |
| **Architecture** (S7, S8, S8b, S9, S9b) | 500-800 | Most complex sessions, but still constrained |
| **Backlog** (S10) | No limit | User stories inherently granular |
| **Scaffold** (S12) | No limit | Contains actual code files |
| **Deployment/Observability** (S13, S14) | 400-600 | Infrastructure plans |

**Exceptions**:
- Session 10 (Backlog): No limit (10-30 epic files × 20-50 stories each)
- Session 12 (Scaffold): No limit (actual code generation)

### Section 2: Content Rules

Define what content is allowed vs. prohibited:

**✅ KEEP (Essential Content)**:
1. **Journey-Specific Decisions**: Choices made for THIS product, not generic advice
2. **Traceability**: References to journey steps, aha moment, user needs
3. **Chosen Options**: The decision + one-line rationale
4. **Key Alternatives**: "What We Didn't Choose" (3-5 options, 1 line each)
5. **Validation Criteria**: How to verify this decision is correct
6. **Dependencies**: What this session reads/writes, which sessions depend on it

**❌ REMOVE (Bloat Content)**:
1. **Educational Theory**: "What is property-based testing?" → goes in `/reference-material/`
2. **Comprehensive Examples**: 10+ scenarios when 2-3 illustrate the point
3. **Pattern Catalogs**: All 12 transaction patterns when journey needs 3
4. **Framework Comparisons**: "Pytest vs unittest vs nose" → just state the choice
5. **Generic Advice**: "Test your API endpoints" (not journey-specific)
6. **Repetition**: Same compliance requirement mentioned in 5 sections
7. **Verbose Explanations**: Multi-paragraph rationales when 1-2 sentences suffice

### Section 3: Quality Bar

Define the standard for "good enough":

**Principle**: "Good enough to generate backlog" (not "comprehensive reference guide")

**Questions to Ask**:
1. Can Session 10 generate user stories from this output? (critical)
2. Can a developer understand the decision in 10-15 minutes? (usability)
3. Does every decision trace to a specific journey step? (traceability)
4. Could this output apply to a different product? If yes → too generic (specificity)
5. Would removing this section break the cascade? If no → remove it (necessity)

**Test**: If output is >800 lines, spot-check 3 sections:
- What % is journey-specific decisions? (target: 70%+)
- What % is examples/theory? (target: <20%)
- What % is repetition? (target: <10%)

### Section 4: Enforcement Mechanisms

**Pre-Generation** (Command Design):
1. Commands MUST include line count targets in instructions:
   ```markdown
   ## Step X: Write Output (500 lines max)

   **STRICT ENFORCEMENT**: If output >600 lines, it's bloated.
   ```

2. Commands MUST reference (not duplicate) `/reference-material/`:
   ```markdown
   For comprehensive testing patterns, see `/reference-material/testing-patterns.md`
   (do NOT include these patterns in output)
   ```

**Post-Generation** (Validation):
1. `/validate-outputs` checks line counts:
   - ⚠️ Warning if >80% of limit
   - ❌ Failure if >120% of limit

2. VALIDATION-CHECKLIST.md Category 13 (Output Conciseness):
   - Rule 13.1: Session output within line limit (see OUTPUT-LIMITS-POLICY.md)
   - Rule 13.2: No educational sections (theory in /reference-material/)
   - Rule 13.3: Max 2-3 examples per decision
   - Rule 13.4: "What We Didn't Choose" ≤5 alternatives

**PR Review**:
1. Any PR modifying session commands MUST measure output with test journey
2. Reviewer MUST verify output ≤ line limit
3. If bloated, request revision before merge

### Section 5: Reference Material Strategy

**Principle**: Commands should REFERENCE patterns, not DUPLICATE them.

**What Goes in `/reference-material/`**:
- Educational guides (what is X? how does X work?)
- Comprehensive pattern catalogs
- Framework comparison matrices
- Best practices checklists
- Detailed examples

**How Commands Use It**:
```markdown
## Step 3: Choose Testing Framework

1. Analyze tech stack (from Session 3)
2. Choose framework for each test type
3. One-line rationale per choice

**Reference**: For comprehensive framework comparisons, see
`/reference-material/testing-patterns.md` Section 2.3
(do NOT duplicate this in output)
```

**Current Reference Material**:
- `/reference-material/property-based-testing-guide.md` ✅
- `/reference-material/integration-testing-patterns.md` ✅
- `/reference-material/security-testing-guide.md` ✅
- Need to create: `testing-patterns.md`, `api-patterns.md`, `database-patterns.md`

---

## Policy Document Template

Create `/docs/OUTPUT-LIMITS-POLICY.md`:

```markdown
# Output Line Limits Policy

**Status**: Active
**Effective Date**: 2026-02-05
**Owner**: @bru

---

## Purpose

This policy prevents session bloat by establishing:
1. Maximum line counts per session
2. Content rules (keep vs. remove)
3. Quality bar for outputs
4. Enforcement mechanisms

---

## Line Limits by Session

[Paste Section 1 table]

## Content Rules

[Paste Section 2]

## Quality Bar

[Paste Section 3]

## Enforcement

[Paste Section 4]

## Reference Material Strategy

[Paste Section 5]

---

## Exceptions Process

If a session needs >120% of limit:
1. Open GitHub issue with justification
2. Provide specific reasons (e.g., "Session 6 design system needs DTCG token tables")
3. Get approval from repository owner
4. Document exception in policy

---

## Metrics

Track output sizes over time:
- Average lines per session (target: <600)
- % sessions within limit (target: >90%)
- Token consumption per cascade (target: <200k)

---

## Revision History

- 2026-02-05: Initial policy (based on BLOAT-AUDIT.md findings)
```

---

## Acceptance Criteria

- [ ] `/docs/OUTPUT-LIMITS-POLICY.md` created with all 5 sections
- [ ] Line limits defined per session type (data-driven from #201 audit)
- [ ] Content rules clearly articulated (keep vs. remove)
- [ ] Quality bar defined ("good enough to generate backlog")
- [ ] Enforcement mechanisms specified (pre/post/PR review)
- [ ] Reference material strategy documented
- [ ] VALIDATION-CHECKLIST.md updated (Category 13: Output Conciseness)
- [ ] CLAUDE.md updated with policy link

---

## Success Metrics

**Compliance**:
- 90%+ of sessions within line limits
- 0 sessions >120% of limit

**Quality**:
- User can read/understand output in 10-15 minutes
- Session 10 generates quality backlog from lean inputs

**Token Efficiency**:
- Cascade completes Sessions 1-14 within 200k token budget

---

## Related Issues

- #201: Audit (provides data for line limits)
- #204-#208: Session rewrites (apply policy)
- #209-#212: Reference material migration (content strategy)

---

## Next Steps After Merge

1. Update all session commands with line count targets
2. Update `/validate-outputs` to check limits
3. Train contributors on policy during PR reviews
