# CLAUDE.md

This file provides core guidance to Claude Code when working with the Stack-Driven framework.

---

## What is Stack-Driven?

Stack-Driven is a **generative product development framework** that transforms user journeys into production-ready systems through 14 progressive sessions. Unlike prescriptive templates, it analyzes each user's specific journey and derives optimal decisions for tech stack, strategy, architecture, and implementation.

**Core Philosophy:**
1. **User journey comes first** - Everything flows from understanding users, not technology
2. **Cascading decisions** - Each session reads previous outputs, maintaining coherence
3. **Generative, not prescriptive** - AI analyzes requirements and recommends optimal solutions
4. **Traced to value** - Every decision references specific user value
5. **Journey-driven tech choices** - Stack chosen based on journey requirements, not trends

---

## Conditional Context Loading

**IMPORTANT:** Load additional context based on the user's task to optimize performance and relevance.

### Context Loading Guide

| If user asks about... | Load context file | Contains |
|----------------------|------------------|----------|
| Running cascade sessions, session order, checkpoints | `ctx/CLAUDE-CASCADE.ctx.md` | Session workflows, dependencies, meta commands |
| GitHub issues, PRs, implementation, debugging | `ctx/CLAUDE-DEVELOPMENT.ctx.md` | Dev commands, Git workflows, debugging patterns |
| Framework philosophy, patterns, architecture | `ctx/CLAUDE-ARCHITECTURE.ctx.md` | Design patterns, repo structure, decomposition |
| Quality validation, reviews, testing | `ctx/CLAUDE-VALIDATION.ctx.md` | Validation framework, review criteria, anti-patterns |
| Multiple areas | Load relevant combinations | Only what's needed |

### Quick Command Reference

**Cascade Commands** (see `ctx/CLAUDE-CASCADE.ctx.md` for details):
- `/refine-journey` - Session 1: Define user journey
- `/cascade-status` - Check progress
- `/run` - Automated execution
- [38 total commands]

**Development Commands** (see `ctx/CLAUDE-DEVELOPMENT.ctx.md` for details):
- `/plan-issue [number]` - Create implementation plan
- `/implement-issue [number]` - Implement with plan
- `/review-pr [number]` - Review and post to GitHub
- `/fix-bug` - Hypothesis-driven debugging

**Validation Commands** (see `ctx/CLAUDE-VALIDATION.ctx.md` for details):
- `/validate-outputs` - Check cascade quality
- `/review-code` - General code review

---

## Repository Quick Reference

**Framework Core:**
- `/.claude/commands/` - Slash commands (sessions + dev + meta)
- `/.claude/agents/` - Sub-agents for complex operations
- `/templates/` - Output structure templates
- `/ctx/` - Task-specific context files

**User-Generated (GITIGNORED):**
- `/product-guidelines/` - Cascade outputs (00-14.md files)
- `/.claude/memory/` - Debugging state tracking

---

## Critical Rules

1. **Always respect cascade order** - Never skip sessions, dependencies matter
2. **Journey traceability required** - Every decision must reference user value
3. **Specificity over genericity** - Outputs must be product-specific, not generic
4. **Context efficiency** - Sessions 1-9b always create .ctx.md versions (60-70% reduction)
5. **Anti-bloat enforcement** - Commands <400 lines, use conditional sub-agents
6. **Human checkpoints** - Pause at Sessions 3, 4, 7, 10 for validation

---

## Performance Optimization

This modular context approach provides:
- **60-80% token reduction** vs monolithic loading
- **Faster response times** through targeted context
- **Better relevance** by loading only needed information
- **Easier maintenance** with separated concerns

**Example:** User asking about database schema only loads CASCADE context (15k chars) instead of full 41k documentation.

---

## Getting Started

1. **New project?** Start with `/refine-journey` (loads CASCADE context)
2. **Check progress?** Run `/cascade-status`
3. **Implement feature?** Use `/plan-issue` then `/implement-issue` (loads DEVELOPMENT context)
4. **Validate quality?** Run `/validate-outputs` (loads VALIDATION context)

---

## Important Notes

- **product-guidelines/ is gitignored** - Each user generates unique outputs
- **Templates guide structure** - Commands read templates to know output format
- **Philosophy over prescription** - Framework analyzes and recommends, never prescribes
- **No emojis unless requested** - Professional, concise communication

---

**Remember:** Load only the context you need. When in doubt, check the Context Loading Guide above.