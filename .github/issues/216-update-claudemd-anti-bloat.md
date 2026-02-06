# Issue #216: Update CLAUDE.md with Anti-Bloat Principles

**Epic**: #200 (Remove Session Bloat)
**Priority**: P1
**Status**: Blocked (wait for #201-#215 completion)
**Estimated Time**: 2-3 hours
**Depends On**: #201 (Audit), #202 (Policy), #204-#208 (Session rewrites)

---

## Objective

Update `/CLAUDE.md` to embed anti-bloat principles into the framework documentation, ensuring future contributors understand:
1. Why lean outputs matter
2. How to write lean commands
3. What content belongs in sessions vs. reference material
4. How to enforce output limits

This prevents regression after Epic #200 completes.

---

## Changes to CLAUDE.md

### 1. Add New Section: "Anti-Bloat Architecture"

Insert after "Command Size Policy" section:

```markdown
---

## Anti-Bloat Architecture (Output Conciseness)

**Problem Solved**: Sessions 1-9b originally generated 2,000-2,500+ line outputs (70-85% bloat), causing cascade token exhaustion and user frustration.

**Solution**: Strict output line limits (300-800 lines per session) with content rules.

### Principles

1. **Output Target**: 300-800 lines per session (decisions only, not encyclopedias)
2. **Quality Bar**: "Good enough to generate backlog" (not "comprehensive reference guide")
3. **Journey-Specific**: Every decision traces to specific journey step (no generic advice)
4. **Reference, Don't Duplicate**: Link to `/reference-material/`, don't embed patterns
5. **Validation**: If output >800 lines → it's bloated (exception: S10 backlog, S12 scaffold)

### Content Rules

**✅ KEEP (Essential)**:
- Journey-specific decisions with one-line rationale
- Traceability to journey steps/aha moment
- Chosen options + key alternatives (3-5 max)
- Validation criteria

**❌ REMOVE (Bloat)**:
- Educational theory ("what is X?") → `/reference-material/`
- Comprehensive examples (>3 per decision)
- Pattern catalogs (all 12 patterns when journey needs 3)
- Framework comparisons → just state the choice
- Generic advice applicable to any product

### Command Design Pattern

Every session command MUST include:

1. **Line count target** in output step:
   ```markdown
   ## Step X: Write Output (500 lines max)

   **STRICT ENFORCEMENT**: If output >600 lines, it's bloated. Cut examples, not decisions.
   ```

2. **Reference material links** (don't duplicate):
   ```markdown
   For comprehensive testing patterns, see `/reference-material/testing-patterns.md`
   (do NOT include these patterns in output)
   ```

3. **Validation checklist**:
   ```markdown
   ## Validation Before Completion

   - [ ] Output ≤[target] lines
   - [ ] All decisions trace to journey
   - [ ] No educational sections
   - [ ] Max 2-3 examples per decision
   - [ ] "What We Didn't Choose" section present (≤5 alternatives)
   ```

### Line Limits by Session

| Session Type | Max Lines | Examples |
|--------------|-----------|----------|
| Journey/Strategy | 400-600 | S1, S2, S2a |
| Technical Foundation | 300-500 | S3, S3b, S3c |
| Strategic | 400-600 | S4 (mission/metrics/monetization/analytics) |
| Design | 500-700 | S5, S6 (brand, design system) |
| Architecture | 500-800 | S7, S8, S8b, S9, S9b |
| Deployment/Observability | 400-600 | S13, S14 |

**Exceptions**: S10 (backlog stories), S12 (code scaffold)

### Enforcement

**Pre-Generation** (command design):
- Line count targets in command instructions
- Reference material links (not duplication)

**Post-Generation** (validation):
- `/validate-outputs` checks line counts (fail if >120% of limit)
- VALIDATION-CHECKLIST.md Category 13 (Output Conciseness)

**PR Review**:
- Measure output with test journey
- Reject if bloated

### Reference Material Strategy

Commands should REFERENCE patterns, not DUPLICATE them.

**What goes in `/reference-material/`**:
- Educational guides (what is X? how does X work?)
- Comprehensive pattern catalogs
- Framework comparison matrices
- Best practices checklists
- Detailed examples

**Current reference material**:
- `property-based-testing-guide.md` ✅
- `integration-testing-patterns.md` ✅
- `security-testing-guide.md` ✅
- `accessibility-testing-guide.md` ✅
- `performance-testing-guide.md` ✅
- `api-security-fundamentals.md` ✅

### Why This Matters

**Before anti-bloat architecture**:
- Session 9: 2,563 lines, 6 sub-agents, ~400k tokens
- Session 9b: ~8,000 lines, 5 sub-agents, ~210k tokens
- Cascade failed due to token exhaustion
- Users couldn't read/understand outputs

**After anti-bloat architecture**:
- Session 9: 500 lines, single command, ~15-20k tokens (75% reduction)
- Session 9b: 600 lines, single command, ~20-25k tokens (88% reduction)
- Cascade completes within token budget
- Users read/understand in 10-15 minutes

### Historical Context

Epic #167 (Command Size Policy) addressed command bloat (>400 line commands) by decomposing into sub-agents. However, sub-agents inherited output bloat, creating orchestration overhead without solving root cause.

Epic #200 (Remove Session Bloat) reversed Epic #167, recognizing that **lean outputs eliminate the need for sub-agents**. The .ctx.md files proved decisions can be condensed 60-70%, so we now generate lean outputs from the start.

**Lesson**: Treat the disease (content bloat), not the symptom (context overflow).

---
```

### 2. Update "Command Size Policy" Section

Add cross-reference to Anti-Bloat Architecture:

```markdown
## Command Size Policy (Anti-Bloat Architecture)

**CRITICAL**: Stack-Driven follows agentic coding best practices. Commands MUST NOT become monolithic context blobs.

**Note**: This policy addresses **command code size**. For **output size limits**, see "Anti-Bloat Architecture (Output Conciseness)" section above.

[Rest of section unchanged]
```

### 3. Update "Context Files Pattern" Section

Add output size context:

```markdown
### 4. Context Files Pattern

**UNIVERSAL RULE: ALL sessions 1-9b create TWO files:**
- **Full version (.md)**: Complete detailed specification for humans (**300-800 lines**, journey-specific decisions only)
- **Context file (.ctx.md)**: Condensed for AI consumption by later sessions (**60-70% reduction**)

**Why context files exist**: Even with lean outputs (300-800 lines), further compression for AI consumption provides token efficiency across cascade.

[Rest of section unchanged]
```

### 4. Update "Quality Validation Framework" Section

Add output conciseness check:

```markdown
### 6. Quality Validation Framework

`/validate-outputs` checks for:
- **Output conciseness** (critical): 300-800 lines per session (exceptions: S10, S12), no educational sections, max 2-3 examples per decision
- **Journey alignment** (critical): References specific journey steps, quantified value ratio
- **Philosophy adherence** (critical): User-first thinking, generative approach
- **Specificity** (critical): Named personas, concrete examples (not "users want better experience")
[Rest of section unchanged]
```

### 5. Update "When Adding New Commands" Section

Add bloat prevention guidance:

```markdown
### When Adding New Commands

[Existing content]

**Prevent bloat**:
- Set line count target (300-800 lines depending on session type)
- Reference `/reference-material/` for patterns (don't duplicate)
- Include validation checklist in command
- Test with real journey (measure output line count)
- If output >800 lines → trim examples, not decisions

[Rest of section unchanged]
```

---

## Acceptance Criteria

- [ ] New "Anti-Bloat Architecture" section added (see above)
- [ ] "Command Size Policy" cross-references Anti-Bloat section
- [ ] "Context Files Pattern" mentions lean outputs (300-800 lines)
- [ ] "Quality Validation Framework" includes output conciseness check
- [ ] "When Adding New Commands" includes bloat prevention guidance
- [ ] Historical context documented (Epic #167 → Epic #200 evolution)
- [ ] Line limits table included (by session type)
- [ ] Reference material strategy explained
- [ ] Before/after metrics shown (token savings)

---

## Success Metrics

**Adoption**:
- New contributors understand anti-bloat principles
- PR reviews catch bloated outputs before merge

**Compliance**:
- 90%+ of new sessions within line limits
- 0 regressions (sessions growing >800 lines)

---

## Validation

After merge:
1. Ask new contributor to read CLAUDE.md
2. Have them create a test session command
3. Verify they include line count targets and reference material links
4. Measure if output is within limits

---

## Related Issues

- #200: Epic (Remove Session Bloat)
- #201: Audit (provides before/after metrics)
- #202: Output Limits Policy (defines rules)
- #204-#208: Session rewrites (examples of lean approach)

---

## Rollout Plan

1. Complete all session rewrites (#204-#208)
2. Measure token savings (update BLOAT-AUDIT.md)
3. Update CLAUDE.md with final metrics
4. Announce in README.md (Epic #200 completion)
5. Train future contributors during PR reviews
