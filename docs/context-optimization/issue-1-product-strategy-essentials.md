# Create product-strategy-essentials.md template for backlog generation

## Problem

The `product-strategy-template.md` file is **435 lines** with extensive market analysis, competitive landscape, and strategic details. When Session 10 (backlog generation) reads this file, it loads **~1,740 tokens** of context, most of which is not needed for story creation.

**Bloat level: 65%**

## What Backlog Generation Actually Needs

Backlog generation needs:
- Vision statement (1 sentence)
- Product positioning (brief)
- Strategic goals (names + metrics only)
- Product principles (for story decisions)
- Roadmap themes (for epic prioritization)

Backlog generation does NOT need:
- Market analysis (TAM/SAM/SOM calculations)
- Market dynamics and trends
- Competitive landscape comparison tables
- Competitive positioning maps
- Detailed risk and assumptions analysis
- Go-to-market details
- Document control metadata

## Solution

Create `templates/11-product-strategy-essentials-template.md` that contains only the essential information needed for backlog generation.

**Target size: 120-150 lines (~480-600 tokens)**
**Reduction: 65% (435 → 130 lines)**

## Essential Template Structure

```markdown
# Product Strategy Essentials (For Backlog Generation)

> This is a condensed version for Session 10 (backlog generation).
> See `01-product-strategy.md` for full strategic context.

## Vision (1 sentence)
By [year], [product] will [achievement] for [audience]

## Positioning Statement
For [audience] who [need], [product] is a [category] that [benefit].
Unlike [competitor], we [differentiation].

## Strategic Goals
1. **[Goal 1]**: [Metric target]
2. **[Goal 2]**: [Metric target]
3. **[Goal 3]**: [Metric target]

## Product Principles (for story prioritization)
1. **[Principle 1]**: [1-2 sentence explanation]
2. **[Principle 2]**: [1-2 sentence explanation]
3. **[Principle 3]**: [1-2 sentence explanation]

## Roadmap Themes (for epic structure)
- **Q1 [Year]**: [Theme name] - [Key outcomes]
- **Q2 [Year]**: [Theme name] - [Key outcomes]
- **Q3 [Year]**: [Theme name] - [Key outcomes]
```

## Implementation Checklist

- [ ] Create `templates/11-product-strategy-essentials-template.md`
- [ ] Update `.claude/commands/create-product-strategy.md` to generate BOTH versions
- [ ] Update `.claude/commands/generate-backlog.md` to read essentials instead of full file
- [ ] Test with example project
- [ ] Verify context reduction

## Success Criteria

- Essentials file is 120-150 lines
- Contains all information needed for story creation
- Backlog generation works without reading full strategy file
- Context usage reduced by ~1,100 tokens

## Impact

- **Lines reduced**: 435 → 130 (65% reduction)
- **Token reduction**: ~1,740 → ~520 tokens
- **Context savings**: ~1,220 tokens per backlog generation

## Labels

`enhancement`, `context-optimization`, `templates`
