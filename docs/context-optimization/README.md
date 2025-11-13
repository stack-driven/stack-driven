# Context Optimization: Guideline Size Reduction

This directory contains issue templates for reducing the size of product guideline templates to optimize context usage during Session 10 (backlog generation).

## Problem

By Session 10, the backlog generation agent must read ~2,821 lines across 10 guideline files, consuming ~11,284 tokens of context. Much of this content is implementation detail not needed for story creation.

## Solution

Create "-essentials" versions of the 4 largest template files that contain only the information needed for backlog generation.

## Issues

### High-Impact Issues (90%+ reduction)

1. **issue-3-api-contracts-essentials.md**
   - Reduction: 782 → 70 lines (91%)
   - Token savings: ~2,848 tokens
   - Impact: CRITICAL

### Critical Issues (85%+ reduction)

2. **issue-4-test-strategy-essentials.md**
   - Reduction: 715 → 100 lines (86%)
   - Token savings: ~2,460 tokens
   - Impact: CRITICAL

### Significant Issues (65-75% reduction)

3. **issue-2-database-schema-essentials.md**
   - Reduction: 436 → 120 lines (72%)
   - Token savings: ~1,264 tokens
   - Impact: HIGH

4. **issue-1-product-strategy-essentials.md**
   - Reduction: 435 → 130 lines (65%)
   - Token savings: ~1,220 tokens
   - Impact: HIGH

## Total Impact

- **Lines reduced**: 2,368 → 420 (82% reduction for these 4 files)
- **Token reduction**: ~9,472 → ~1,680 tokens
- **Context savings**: ~7,792 tokens per backlog generation
- **Overall reduction**: From 11,284 → 3,492 tokens (68% total reduction)

## Implementation Approach

Each issue follows the same pattern:

1. Create new `-essentials-template.md` file
2. Update the relevant command (e.g., `/create-product-strategy`) to generate BOTH versions
3. Update `/generate-backlog` to read essentials instead of full files
4. Test with example project
5. Verify context reduction

## Benefits

- **Faster backlog generation**: Less context to process
- **More focused stories**: Agent focuses on essentials, not noise
- **Room for growth**: Sessions 11-14 won't hit context limits
- **No information loss**: Full files preserved for reference and implementation

## How to Create These Issues

You can create these issues in GitHub using the templates in this directory. Each template includes:

- Problem statement
- Solution with target metrics
- Essential template structure
- Implementation checklist
- Success criteria
- Impact analysis
- Suggested labels

Simply copy the content of each file and create a new GitHub issue with it.
