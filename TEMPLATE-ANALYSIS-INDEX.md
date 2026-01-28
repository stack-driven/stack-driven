# Template Naming Analysis - Documentation Index

This directory contains a comprehensive analysis of template naming issues in the Stack-Driven framework.

## Quick Start

Start here if you have 5 minutes:
- **TEMPLATE-NAMING-ISSUES.md** - Executive summary with critical findings and quick fixes

Read this if you have 15 minutes:
- **TEMPLATE-NAMING-VISUAL-GUIDE.md** - Visual diagrams showing problems and solutions

## Complete Analysis (30+ minutes)

For a deep dive into the issues:

1. **TEMPLATE-NAMING-ISSUES.md** (Executive Summary)
   - Critical issues found
   - Fix priority and effort estimates
   - Quick fixes section
   - Related files section

2. **TEMPLATE-NAMING-ANALYSIS.md** (Comprehensive Breakdown)
   - Current template naming pattern (table)
   - Detailed problem explanations
   - Root cause analysis
   - Recommended fixes with options
   - Impact assessment
   - Summary table of all issues

3. **TEMPLATE-NAMING-VISUAL-GUIDE.md** (Visual Reference)
   - "04-" problem at a glance
   - Timeline of what happened
   - Cascade file references diagram
   - File reference audit
   - Proposed fix options

4. **TEMPLATE-FILE-MAPPING.md** (Complete Reference)
   - All 31 template files listed by session
   - Files with issues marked
   - Cascade effects of renaming
   - Recommended action plan (phased approach)

## Key Findings Summary

### Issue 1: Broken File References (CRITICAL)
- Templates 15 and 16 reference `08-brand-strategy.md`
- Actual file is `05-brand-strategy.md`
- Commands will fail when executed
- **Fix**: 2-line change in two files

### Issue 2: Confusing File Numbering (HIGH)
- Session 4 outputs: 03-mission, 04-metrics, 04-monetization, 04-architecture
- Two files start with "04-" (non-sequential)
- Should be: 03, 04, 05, 06
- **Fix**: Rename 2 template files + 25 cascading renames

### Issue 3: Undocumented Exceptions (MEDIUM)
- Sessions 10, 11, 12 have no templates (intentional but undocumented)
- Users might think these are broken
- **Fix**: Add 10 lines to CLAUDE.md

### Issue 4: Unclear Naming Convention (LOW)
- Post-cascade extensions (15-22) not explained
- **Fix**: Add 15 lines to CLAUDE.md

## Files to Review

All affected files are in `/Users/bru/dev/stack-driven/`:

**Templates with issues**:
- `templates/04-monetization-template.md` - Wrong filename
- `templates/04-architecture-template.md` - Wrong filename
- `templates/15-brand-naming-template.md` - Wrong reference (line 21)
- `templates/16-brand-messaging-template.md` - Wrong reference (line 28)

**Commands with issues**:
- `.claude/commands/generate-strategy.md` - Creates wrong filenames

**Documentation with gaps**:
- `CLAUDE.md` - Doesn't explain sessions 10-12 or post-cascade naming

## Recommendations

Choose one of three approaches:

**Option A: Quick Fix (2 minutes)**
- Fix broken references in templates 15-16
- Best for: Immediate relief from blocking issues

**Option B: Quick Fix + Documentation (20 minutes)**
- Fix broken references
- Document exceptions in CLAUDE.md
- Best for: Users and maintainers

**Option C: Full Refactor (1-2 hours)**
- Fix broken references
- Rename files 04-22 for sequential numbering
- Update all commands and documentation
- Breaking change for existing users
- Best for: Long-term clarity and consistency

## Implementation Guide

Each analysis document includes:
- Specific line numbers for changes
- Before/after code examples
- Step-by-step instructions
- Risk assessment
- Impact analysis

See TEMPLATE-NAMING-ISSUES.md for "Quick Fixes Needed" section with exact commands.

## Related Documentation

- `CLAUDE.md` - Framework documentation (contains session definitions)
- `.claude/commands/generate-strategy.md` - Session 4 command
- `templates/` - All template files
- `product-guidelines/` (gitignored) - Generated user outputs

## Questions?

Each analysis document is self-contained and can be read independently. 
Start with the issue that interests you most, or follow the "Quick Start" path above.

