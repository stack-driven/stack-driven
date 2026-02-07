# CLAUDE.md Refactoring Migration Guide

## What Changed

We've refactored CLAUDE.md from a monolithic 41.3k character file to a modular context system with conditional loading, following Stack-Driven's own architectural principles.

### Before
- **Single file:** 41.3k characters
- **Always loaded:** Every interaction loads everything
- **Performance impact:** Slower responses, higher costs
- **Anti-pattern:** Monolithic context blob

### After
- **Core file:** 4.6k characters (89% reduction)
- **Context modules:** 4 specialized files (4-5k each)
- **Conditional loading:** Only load what's needed
- **Best practice:** Agentic context engineering

## New Structure

```
CLAUDE.md (4.6k) - Core context + routing logic
└── ctx/
    ├── CLAUDE-CASCADE.ctx.md (4.8k) - Cascade sessions
    ├── CLAUDE-DEVELOPMENT.ctx.md (4.1k) - Dev workflows
    ├── CLAUDE-ARCHITECTURE.ctx.md (5.0k) - Patterns & philosophy
    └── CLAUDE-VALIDATION.ctx.md (4.9k) - Quality & review
```

## Performance Improvements

| Scenario | Before | After | Reduction |
|----------|---------|---------|---------|
| User runs cascade session | 41.3k | 4.6k + 4.8k = 9.4k | 77% |
| User implements issue | 41.3k | 4.6k + 4.1k = 8.7k | 79% |
| User asks about patterns | 41.3k | 4.6k + 5.0k = 9.6k | 77% |
| User validates outputs | 41.3k | 4.6k + 4.9k = 9.5k | 77% |

**Average token reduction: 77-79%**

## How It Works

1. **Claude reads core CLAUDE.md** (always, 4.6k chars)
2. **Evaluates user task** using Context Loading Guide
3. **Loads specific context** from ctx/ directory
4. **Executes with optimal context** (only what's needed)

## Benefits

### Immediate
- ✅ Under 40k threshold warning resolved
- ✅ 77-79% token reduction per interaction
- ✅ Faster response times
- ✅ Lower API costs

### Long-term
- ✅ Easier maintenance (separated concerns)
- ✅ Better modularity (update one file, not everything)
- ✅ Follows Stack-Driven's own principles
- ✅ Scalable for future additions

## Migration Complete

No action required from users. The new structure is backward compatible and transparent to command usage.

## Irony Resolution

We've resolved the meta-irony where Stack-Driven preached anti-bloat architecture (Epic #167) while CLAUDE.md itself was a 41k monolithic blob. Now CLAUDE.md follows its own medicine:
- Decomposition into focused modules
- Conditional loading based on need
- Context compression principles
- Under 400-line equivalent for core file

"Eat your own dog food" ✅