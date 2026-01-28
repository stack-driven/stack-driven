# Template Naming Issues: Executive Summary

## Critical Issues Found

### Issue 1: Broken File References (BLOCKING)

**Severity: HIGH - Commands will fail**

Two template files reference the wrong filename:

| File | Line | Wrong Reference | Correct Reference |
|------|------|-----------------|-------------------|
| `/templates/15-brand-naming-template.md` | 21 | `08-brand-strategy.md` | `05-brand-strategy.md` |
| `/templates/16-brand-messaging-template.md` | 28 | `08-brand-strategy.md` | `05-brand-strategy.md` |

**Impact**: When users run `/discover-naming` or `/define-messaging` commands, they will try to read from `product-guidelines/08-brand-strategy.md`, which doesn't exist. The actual file is `05-brand-strategy.md`.

**Root Cause**: At some point, the brand-strategy output file was renamed from `08-` to `05-`, but these template references were never updated.

**Fix**:
```bash
# In 15-brand-naming-template.md, line 21:
OLD: **Brand personality** (from `product-guidelines/08-brand-strategy.md`):
NEW: **Brand personality** (from `product-guidelines/05-brand-strategy.md`):

# In 16-brand-messaging-template.md, line 28:
OLD: **Brand voice** (from `product-guidelines/08-brand-strategy.md`):
NEW: **Brand voice** (from `product-guidelines/05-brand-strategy.md`):
```

---

### Issue 2: Confusing File Numbering

**Severity: HIGH - Confusing, error-prone**

Session 4 generates 4 outputs with inconsistent numbering:

```
03-mission.md          ← Clear: Mission is output #3
04-metrics.md          ← Clear: Metrics is output #4
04-monetization.md     ← CONFUSING: Should be 05 (not 04!)
04-architecture.md     ← CONFUSING: Should be 06 (not 04!)
```

**Problem**: Two files start with "04-" when they should be "05-" and "06-". This creates:
- Visual confusion (looks like duplicate files)
- Naming ambiguity (which 04-* file do you mean?)
- Non-sequential numbering

**Templates Affected**:
- `04-monetization-template.md` → should be `05-monetization-template.md`
- `04-architecture-template.md` → should be `06-architecture-template.md`

**Commands Affected**:
- `/generate-strategy` creates outputs with wrong numbering

**Files Updated by This Fix**:
- `templates/04-monetization-template.md` → `templates/05-monetization-template.md`
- `templates/04-architecture-template.md` → `templates/06-architecture-template.md`
- `templates/05-brand-strategy-template.md` → `templates/07-brand-strategy-template.md` (cascade effect)
- `templates/06-design-system-template.md` → `templates/08-design-system-template.md` (cascade effect)
- ... all subsequent files

**Cascade Effect**: Fixing files 04-06 means all files 05-22 need renumbering. This is a **breaking change** for existing users.

---

### Issue 3: Missing Template Documentation

**Severity: MEDIUM - Users confused about sessions 10-12**

Sessions 10, 11, 12 have no templates:
- Session 10 (`/generate-backlog`) - Generates backlog dynamically, no template
- Session 11 (`/create-gh-issues`) - Pushes to GitHub, no template
- Session 12 (`/scaffold-project`) - Generates code, no template

**Problem**: Users might think these sessions are broken or incomplete. The CLAUDE.md doesn't explain why these sessions are different.

**Fix**: Add documentation to CLAUDE.md explaining:
```markdown
### Sessions Without Templates (10, 11, 12)

These sessions generate outputs dynamically based on previous decisions,
rather than using templates:

- **Session 10** (/generate-backlog): Analyzes decisions from Sessions 1-9b
  and generates user stories. Backlog structure is dynamic, not templated.
- **Session 11** (/create-gh-issues): Converts backlog into GitHub issues.
  No local output file created.
- **Session 12** (/scaffold-project): Generates project code files and
  directory structure based on tech stack and architecture. Code generation
  is framework-specific, not templated.
```

---

### Issue 4: Post-Cascade Numbering Not Explained

**Severity: LOW - Minor clarity issue**

Post-cascade extensions (Sessions 15-22) aren't clearly distinguished from core cascade.

**CLAUDE.md mentions**:
- "14 progressive sessions"
- "8 optional deep-dive commands"

But doesn't clearly explain why numbering jumps from 14 → 15, or that sessions 15-22 are optional extensions.

**Fix**: Document in CLAUDE.md:
```markdown
### Post-Cascade Extensions (Sessions 15-22)

The core cascade consists of 14 sessions (1-14). Additionally, there are
8 optional "deep-dive" commands (Sessions 15-22) that extend specific areas:

- 15: Brand naming discovery
- 16: Brand messaging
- 17: Brand identity
- 18: Content guidelines
- 19: User experience design
- 20: Analytics plan
- 21: Growth strategy
- 22: Financial modeling

These are OPTIONAL and can be run in any order after their prerequisites
are complete.
```

---

## Fix Priority

| Issue | Priority | Effort | Risk | Recommendation |
|-------|----------|--------|------|-----------------|
| Broken file references (08 → 05) | CRITICAL | 5 min | Low | Fix immediately |
| File numbering (04 duplicate) | HIGH | Low-Med | Medium | Fix (or document if too risky) |
| Missing template docs | MEDIUM | 15 min | None | Document in CLAUDE.md |
| Post-cascade naming | LOW | 10 min | None | Document in CLAUDE.md |

---

## Quick Fixes Needed (All files are in `/Users/bru/dev/stack-driven/`)

### Fix #1: Broken References (5 minutes)

```bash
# In templates/15-brand-naming-template.md, line 21
sed -i '' 's|08-brand-strategy|05-brand-strategy|g' templates/15-brand-naming-template.md

# In templates/16-brand-messaging-template.md, line 28
sed -i '' 's|08-brand-strategy|05-brand-strategy|g' templates/16-brand-messaging-template.md
```

### Fix #2: File Numbering (30 minutes + testing)

This requires renaming multiple template files and updating the generate-strategy command. 
See TEMPLATE-NAMING-ANALYSIS.md for full migration plan.

### Fix #3: Documentation (20 minutes)

Update CLAUDE.md with explanations for sessions 10-12 and post-cascade naming.

---

## Related Files

For detailed analysis, see:
- `/Users/bru/dev/stack-driven/TEMPLATE-NAMING-ANALYSIS.md` - Comprehensive breakdown
- `/Users/bru/dev/stack-driven/TEMPLATE-NAMING-VISUAL-GUIDE.md` - Visual explanations

