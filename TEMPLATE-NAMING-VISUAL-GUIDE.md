# Template Naming: Visual Breakdown

## The "04-" Problem at a Glance

```
Session 4 Output Files (4 files, 2 different prefixes):

✅ 03-mission.md          ← Clearly Session 4, Output #3
✅ 04-metrics.md          ← Clearly Session 4, Output #4
❌ 04-monetization.md     ← CONFUSING! Should be 05-monetization.md
❌ 04-architecture.md     ← CONFUSING! Should be 06-architecture.md
   ↑
   Both start with 04, but aren't duplicates!
```

## Timeline: What Happened

```
Creation:  Session 4 outputs created with broken numbering
           (04-monetization, 04-architecture instead of 05, 06)
   ↓
Later:     Brand strategy file renamed 08 → 05
           (Probably to fix numbering mess)
   ↓
Problem:   Templates still reference 08-brand-strategy.md
           But the actual file is 05-brand-strategy.md
   ↓
Result:    15-brand-naming & 16-brand-messaging point to wrong file!
```

## Cascade File References (Simplified)

```
Core Cascade Outputs:
┌─────────────────────────────────────────────┐
│ 00-user-journey.md      (Session 1)         │
├─────────────────────────────────────────────┤
│ 01-product-strategy.md  (Session 2)         │
├─────────────────────────────────────────────┤
│ 02-tech-stack.md        (Session 3)         │
├─────────────────────────────────────────────┤
│ 03-mission.md           │                   │
│ 04-metrics.md           ├─ Session 4        │
│ 04-monetization.md ❌   │ (file numbers     │
│ 04-architecture.md ❌   │  are confusing)   │
├─────────────────────────────────────────────┤
│ 05-brand-strategy.md    (Session 5)         │
├─────────────────────────────────────────────┤
│ 06-design-system.md     (Session 6)         │
│ ...                     (Sessions 7-9b)     │
└─────────────────────────────────────────────┘

Later Sessions Reference This:
┌─────────────────────────────────────────────┐
│ 15-brand-naming.md      │                   │
│ References: 08-brand-strategy.md ❌         │
│ Should be: 05-brand-strategy.md ✅          │
├─────────────────────────────────────────────┤
│ 16-brand-messaging.md   │                   │
│ References: 08-brand-strategy.md ❌         │
│ Should be: 05-brand-strategy.md ✅          │
└─────────────────────────────────────────────┘
```

## The "Missing Templates" (Sessions 10-12)

```
Core Cascade Structure:
├─ Sessions 1-9b:      Have templates ✅
├─ Session 10:         NO TEMPLATE ❓ (Generate backlog from decisions)
├─ Session 11:         NO TEMPLATE ❓ (Push to GitHub, no output file)
├─ Session 12:         NO TEMPLATE ❓ (Generate code, not template-based)
├─ Sessions 13-14:     Have templates ✅
└─ Sessions 15-22:     Have templates ✅ (Post-cascade extensions)

This is intentional but not documented!
Users might think these sessions are broken.
```

## File Reference Audit

**PROBLEM 1: Wrong file references in templates**

```bash
15-brand-naming-template.md:21
  References: product-guidelines/08-brand-strategy.md
  Actual file: product-guidelines/05-brand-strategy.md
  Status: ❌ BROKEN

16-brand-messaging-template.md:28
  References: product-guidelines/08-brand-strategy.md
  Actual file: product-guidelines/05-brand-strategy.md
  Status: ❌ BROKEN
```

**PROBLEM 2: Commands reference wrong files**

```bash
generate-strategy.md:182,192,203,215
  Outputs generated to:
    - 03-mission.md ✅
    - 04-metrics.md ✅
    - 04-monetization.md ❌ (should be 05)
    - 04-architecture.md ❌ (should be 06)
```

## Proposed Fix: Clean Naming

```
OPTION A: Fix Sequential Numbering
═══════════════════════════════════
Current:                        After Fix:
│                              │
├─ 03-mission.md              ├─ 03-mission.md ✅ (no change)
├─ 04-metrics.md              ├─ 04-metrics.md ✅ (no change)
├─ 04-monetization.md ❌      ├─ 05-monetization.md ✓ (renamed)
├─ 04-architecture.md ❌      ├─ 06-architecture.md ✓ (renamed)
├─ 05-brand-strategy.md       ├─ 07-brand-strategy.md ✓ (renumbered)
├─ 06-design-system.md        ├─ 08-design-system.md ✓ (renumbered)
└─ ...                        └─ ... (all adjusted)

Benefit: Sequential numbering matches session count
Cost: File rename, command update, template reference update


OPTION B: Accept Dual Numbering
════════════════════════════════
Document that Session 4 outputs don't follow sequential numbering.

Current (with documentation):
├─ 03-mission.md              (Session 4, Output A)
├─ 04-metrics.md              (Session 4, Output B)
├─ 04-monetization.md         (Session 4, Output C - not sequential!)
├─ 04-architecture.md         (Session 4, Output D - not sequential!)

Benefit: No file renames needed
Cost: Confusing naming remains, requires documentation
```

## Quick Reference: All Issues

| File | Issue | Line(s) | Fix |
|------|-------|---------|-----|
| 04-monetization-template.md | Filename should be 05 | - | Rename to 05-monetization-template.md |
| 04-architecture-template.md | Filename should be 06 | - | Rename to 06-architecture-template.md |
| 15-brand-naming-template.md | References wrong file | 21 | Change `08-brand-strategy.md` → `05-brand-strategy.md` |
| 16-brand-messaging-template.md | References wrong file | 28 | Change `08-brand-strategy.md` → `05-brand-strategy.md` |
| generate-strategy.md | Creates wrong filenames | 203, 215 | Update output filenames |
| CLAUDE.md | Doesn't explain Sessions 10-12 | - | Document why no templates |
| CLAUDE.md | Doesn't explain 15-22 numbering | - | Document post-cascade naming |

