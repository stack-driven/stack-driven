# Template Naming Conventions Analysis

## Executive Summary

The Stack-Driven framework has **significant naming inconsistencies** that create confusion about:
1. The relationship between Session numbers and Output file numbers
2. Why three templates share the "04-" prefix
3. Why brand-strategy is file 05 but referred to as 08-brand-strategy in later templates
4. The overall numbering logic

These inconsistencies reduce clarity and create maintenance risks.

---

## Current Template Naming Pattern

### Core Cascade (Sessions 1-14)

| Session | Command | Output Files | Templates |
|---------|---------|--------------|-----------|
| 1 | `/refine-journey` | `00-user-journey.md` | `00-user-journey-template.md`, `00-user-journey-interview-template.md` |
| 2 | `/create-product-strategy` | `01-product-strategy.md` | `01-product-strategy-template.md`, `01-product-strategy-essentials-template.md` |
| 2a | `/document-constraints` | `02a-constraints.md` | `02a-constraints-template.md`, `02a-constraints-essentials-template.md` |
| 3 | `/choose-tech-stack` | `02-tech-stack.md` | `02-tech-stack-template.md` |
| 3b | `/define-coding-standards` | `02b-coding-standards.md` | `02b-coding-standards-template.md`, `02b-coding-standards-essentials-template.md` |
| 3c | `/define-ai-integration-strategy` | `02c-ai-integration-strategy.md` | `02c-ai-integration-strategy-template.md`, `02c-ai-integration-strategy-essentials-template.md` |
| 4 | `/generate-strategy` | `03-mission.md`, `04-metrics.md`, `04-monetization.md`, `04-architecture.md` | `03-mission-template.md`, `04-metrics-template.md`, `04-monetization-template.md`, `04-architecture-template.md` |
| 5 | `/create-brand-strategy` | `05-brand-strategy.md` | `05-brand-strategy-template.md` |
| 6 | `/create-design` | `06-design-system.md` | `06-design-system-template.md` |
| 7 | `/design-database-schema` | `07-database-schema.md` | `07-database-schema-template.md`, `07-database-schema-essentials-template.md` |
| 8 | `/generate-api-design` | `08-api-design.md` | `08-api-design-template.md`, `08-api-design-essentials-template.md` |
| 8b | `/generate-api-contracts` | `08b-api-contracts.md` | `08b-api-contracts-template.md`, `08b-api-contracts-essentials-template.md` |
| 9 | `/create-test-strategy` | `09-test-strategy.md` | `09-test-strategy-template.md`, `09-test-strategy-essentials-template.md` |
| 9b | `/model-application` | `09b-application-architecture.md` | `09b-application-architecture-template.md`, `09b-application-architecture-essentials-template.md` |
| 10 | `/generate-backlog` | `10-backlog/` (directory) | ❌ **NO TEMPLATE** |
| 11 | `/create-gh-issues` | GitHub issues | ❌ **NO TEMPLATE** |
| 12 | `/scaffold-project` | `12-project-scaffold.md` + code | ❌ **NO TEMPLATE** |
| 13 | `/plan-deployment` | `13-deployment-plan.md` | `13-deployment-plan-template.md` |
| 14 | `/design-observability` | `14-observability-strategy.md` | `14-observability-strategy-template.md` |

### Post-Cascade Extensions (Sessions 15-22)

| File Number | Command | Output File | Template |
|-------------|---------|-------------|----------|
| 15 | `/discover-naming` | `15-brand-naming.md` | `15-brand-naming-template.md` |
| 16 | `/define-messaging` | `16-brand-messaging.md` | `16-brand-messaging-template.md` |
| 17 | `/design-brand-identity` | `17-brand-identity.md` | `17-brand-identity-template.md` |
| 18 | `/create-content-guidelines` | `18-content-guidelines.md` | `18-content-guidelines-template.md` |
| 19 | `/design-user-experience` | `19-user-experience.md` | `19-user-experience-template.md` |
| 20 | `/setup-analytics` | `20-analytics-plan.md` | `20-analytics-plan-template.md` |
| 21 | `/design-growth-strategy` | `21-growth-strategy.md` | `21-growth-strategy-template.md` |
| 22 | `/create-financial-model` | `22-financial-model.md` | `22-financial-model-template.md` |

---

## Problems Identified

### 1. **The "04-" Problem: Three Templates with Same Prefix**

**Issue**: Session 4 produces THREE separate outputs with different file numbers:
- `03-mission.md` (output #3)
- `04-metrics.md` (output #4)
- `04-monetization.md` (output #5 should be!)
- `04-architecture.md` (output #6 should be!)

**Why This Is Confusing**:
- Two files start with "04-" when they should be "05-" and "06-"
- The template files follow the same broken pattern
- Visually looks like duplicate files or a naming error
- Makes it unclear which outputs are from Session 4

**Example Problem**:
```
When a command says "read 04-architecture.md" are they asking for:
a) Output from Session 4 (yes)
b) Output #4 (no, it's actually output #6)
```

### 2. **Brand Strategy: File "05-" But Referenced as "08-"**

**Critical Error**: The brand-strategy templates reference the brand strategy output as `08-brand-strategy.md`:

```markdown
# From 15-brand-naming-template.md, line 21:
**Brand personality** (from `product-guidelines/08-brand-strategy.md`):

# From 16-brand-messaging-template.md, line 28:
**Brand voice** (from `product-guidelines/08-brand-strategy.md`):
```

But the actual file is `05-brand-strategy.md` (Session 5, output #5).

**Why This Matters**:
- Post-cascade commands will fail to read the correct file
- Creates maintenance debt (someone has to fix these references later)
- Suggests the file numbering was changed post-template-creation

### 3. **Inconsistent File Numbering Logic**

The framework uses two different numbering schemes:
- **Session numbers**: 1, 2, 2a, 3, 3b, 3c, 4, 5... 14, 15... 22
- **Output file numbers**: 00, 01, 02, 02a, 02b, 02c, 03, 04... 14, 15... 22

**The Disconnect**:
- Session 4 produces outputs 03, 04, 04(?), 04(?)
- Session 5 produces output 05
- But templates refer to output 08
- This creates confusion about which output corresponds to which session

### 4. **Missing Templates for Sessions 10, 11, 12**

**Session 10** (`/generate-backlog`):
- Produces `10-backlog/` directory with user stories
- Has NO template file (commands generate backlog dynamically from decisions)
- This is intentional but undocumented

**Session 11** (`/create-gh-issues`):
- Pushes to GitHub (no local output file)
- Has NO template file
- This is intentional but undocumented

**Session 12** (`/scaffold-project`):
- Produces `12-project-scaffold.md` + generated code files
- Has NO template file (code generation is dynamic, not template-based)
- This is intentional but undocumented

**Why This Matters**:
- Users might assume every session has a template
- The CLAUDE.md doesn't explain why these are different
- Creates doubt about whether sessions 10-12 work correctly

### 5. **Post-Cascade Numbering Jumps From 14 to 15**

**Issue**: Post-cascade extensions start at 15, but CLAUDE.md doesn't clearly explain this gap.

The template list shows 15-22, but the CLAUDE.md only mentions "14 progressive sessions" + "8 optional deep-dive commands".

**Why This Matters**:
- Not clear that 15-22 are post-cascade (they should be labeled differently)
- Could confuse users about cascade completion

---

## Root Cause Analysis

### How Did This Happen?

1. **Session 4 Design**: The command generates 4 outputs (mission, metrics, monetization, architecture) but numbered them 03, 04, 04(?), 04(?). This suggests someone intended:
   - `03-mission.md`
   - `04-metrics.md`
   - `05-monetization.md` (but accidentally wrote `04-monetization.md`)
   - `06-architecture.md` (but accidentally wrote `04-architecture.md`)

2. **Brand Strategy File Number Change**: At some point, `08-brand-strategy.md` was renamed to `05-brand-strategy.md` (probably to fix numbering), but the template files that reference it were never updated.

3. **Post-Cascade Extensions Added Later**: Sessions 15-22 were added after the core 14 sessions, but the naming convention wasn't established clearly in CLAUDE.md.

---

## Recommended Fixes

### Option A: Fix the Broken Filenames (Recommended)

Rename files to match sequential numbering:

**Session 4 Outputs**:
- `03-mission.md` → Keep as is
- `04-metrics.md` → Keep as is  
- `04-monetization.md` → `05-monetization.md`
- `04-architecture.md` → `06-architecture.md`

**Update Template Files**:
- `04-monetization-template.md` → `05-monetization-template.md`
- `04-architecture-template.md` → `06-architecture-template.md`

**Fix Brand Strategy References**:
- All references to `08-brand-strategy.md` → `05-brand-strategy.md`
- Files affected:
  - `15-brand-naming-template.md` (line 21)
  - `16-brand-messaging-template.md` (line 28)
  - Any commands that read brand-strategy

**Update generate-strategy.md Command**:
- Change output references:
  - `product-guidelines/04-monetization.md` → `product-guidelines/05-monetization.md`
  - `product-guidelines/04-architecture.md` → `product-guidelines/06-architecture.md`

### Option B: Document the Current Pattern Clearly

If renaming files is too disruptive, document the exception in CLAUDE.md:

```markdown
### Session 4 Special Case: Multiple Outputs with 04 Prefix

Session 4 generates 4 outputs with a non-sequential naming scheme:
- `03-mission.md` - Mission statement
- `04-metrics.md` - Success metrics
- `04-monetization.md` - Pricing strategy (Note: starts with 04 not 05)
- `04-architecture.md` - Architecture principles (Note: starts with 04 not 06)

This exception exists for [REASON]. When reading outputs, use the full filename.
```

Then document the brand-strategy error:

```markdown
### Known Issue: Brand Strategy File Reference

Templates 15-22 incorrectly reference `08-brand-strategy.md`. 
The actual file is `05-brand-strategy.md`.
```

---

## Comprehensive Solution: Better Naming Convention

### Proposed New Convention

Instead of trying to make all outputs sequential, use a clearer convention:

**Option 1: Session-Based Numbering** (Clearest)
```
Session-Output Format:
00-user-journey.md       (Session 1, Output A)
01-product-strategy.md   (Session 2, Output A)
02-tech-stack.md         (Session 3, Output A)
02a-constraints.md       (Session 2a, Output A)
02b-coding-standards.md  (Session 3b, Output A)
02c-ai-integration.md    (Session 3c, Output A)
04-mission.md            (Session 4, Output A)
04-metrics.md            (Session 4, Output B)
04-monetization.md       (Session 4, Output C)
04-architecture.md       (Session 4, Output D) ✓ CONSISTENT
05-brand-strategy.md     (Session 5, Output A)
06-design-system.md      (Session 6, Output A)
...
```

**Option 2: Explicit Session Prefixes** (Most Explicit)
```
s01-user-journey.md
s02-product-strategy.md
s02a-constraints.md
s03-tech-stack.md
s04-mission.md
s04-metrics.md
s04-monetization.md
s04-architecture.md    ✓ All session 4 outputs clearly grouped
s05-brand-strategy.md
...
```

---

## Impact Assessment

### If Option A (Rename) Is Chosen:

**Files to change**:
- 2 template files (04-monetization, 04-architecture → 05, 06)
- 1 command file (generate-strategy.md)
- 2 template files (15-brand-naming, 16-brand-messaging)
- Any product-guidelines examples

**Effort**: Low (straightforward renames)
**Risk**: Medium (users might have existing cascades with old filenames)
**Benefit**: High (clarity and consistency)

### If Option B (Document) Is Chosen:

**Files to update**:
- CLAUDE.md (add exceptions section)
- Possibly template comments

**Effort**: Very low (documentation only)
**Risk**: Low (no file renames)
**Benefit**: Medium (clarifies confusion)

---

## Summary Table: What's Wrong

| Issue | Severity | Impact | Recommendation |
|-------|----------|--------|-----------------|
| Two "04-" files instead of sequential numbering | High | Naming confusion, hard to distinguish outputs | Rename to 05-, 06- |
| Brand strategy referenced as "08-" not "05-" | High | Commands will fail to find correct file | Fix all references |
| Sessions 10-12 have no templates | Medium | Unclear if these sessions work correctly | Document in CLAUDE.md |
| Post-cascade numbering (15-22) not explained | Low | Minor confusion about cascade completion | Document in CLAUDE.md |
| Overall numbering logic not documented | Medium | Hard for users to understand file numbering | Document conventions |

