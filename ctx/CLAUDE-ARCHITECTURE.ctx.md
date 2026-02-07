# CLAUDE-ARCHITECTURE.ctx.md

Context for Stack-Driven architecture, patterns, and philosophy. Load when discussing design decisions, patterns, or framework philosophy.

## Core Philosophy

### What We Believe
- **User journey comes first** - Everything flows from understanding users
- **Cascading decisions** - Each session reads previous outputs
- **Generative, not prescriptive** - AI analyzes and recommends
- **Traced to value** - Every decision references user value
- **Journey-driven tech** - Stack chosen based on journey, not trends
- **Boring is beautiful** - Proven tech over exotic

### What We Reject
- One-size-fits-all stacks
- Technology-first thinking
- Resume-driven development
- Arbitrary decisions
- Generic advice

## Key Design Patterns

### 1. Generative Cascade Architecture
Commands analyze SPECIFIC journey → derive recommendations → different journeys = different outputs

### 2. Progressive Interrogation
Session 1: 21 questions in 4 phases including behavioral profile
- Tech proficiency drives complexity choices
- Device preference influences responsive design
- Learning style affects onboarding
- Communication preferences shape notifications

### 3. Journey Traceability
Every decision traces to journey:
- "PostgreSQL because journey needs complex relationships with JSONB for compliance"
- "Blue conveys trustworthy professional for compliance officers"

Validation: Could this apply to different product? If yes, too generic.

### 4. Context Compression (.ctx.md)
- All sessions 1-9b create full + context versions
- 60-70% token reduction
- Decisions only, no rationale
- AI reads .ctx.md, humans read .md

### 5. Conditional Loading
Load only what's needed:
- Simple CRUD → Skip complex patterns
- No AI → Skip AI integration
- Small team → Skip enterprise patterns

### 6. Anti-Bloat Architecture
Commands <400 lines → decompose into sub-agents
- Orchestrator manages flow
- Sub-agents handle specific patterns
- Conditional invocation based on requirements

## Repository Structure

**`/.claude/`** - Framework core
- `/commands/` - 38 slash commands (sessions + dev + meta)
- `/agents/` - Specialized sub-agents for complex operations
- `/memory/` - GITIGNORED debugging state

**`/templates/`** - Output structure templates
- One per session output
- Define structure + validation criteria

**`/product-guidelines/`** - GITIGNORED user outputs
- Generated cascade files (00-14.md)
- Each user's unique journey

**`/reference-material/`** - Educational guides
- Testing patterns
- AI best practices
- API fundamentals

## Command Architecture

### Size Limits (Epic #167)
- Orchestrators: <400 lines
- Sub-agents: 150-400 lines
- Violation → decomposition required

### Decomposition Pattern
```
orchestrator.md (400 lines)
├── Read context
├── Analyze requirements
├── Conditional sub-agent invocation
│   ├── If A: invoke pattern-a.md
│   ├── If B: invoke pattern-b.md
│   └── Always: invoke core.md
└── Synthesize outputs
```

### Completed Decompositions
**Session 7:** 280-line orchestrator + 4 micro-sessions + 7 sub-agents
- 83% token reduction (55k vs 480k monolithic)
- Progressive building with state tracking

**Session 8:** 416-line orchestrator + 7 conditional sub-agents
- 30-50% token reduction through conditional loading

## Quality Validation

### Critical Checks
- **Journey alignment** - References specific steps
- **Philosophy adherence** - User-first, generative
- **Specificity** - Concrete, not generic
- **Completeness** - All sections filled
- **Consistency** - Cross-file alignment
- **Technical soundness** - Proper patterns

### Validation Command
`/validate-outputs` checks all guidelines against criteria

## Important Patterns

### Specificity Examples
❌ "Users want better experience"
✅ "Compliance officers reduce document review from 4 hours to 60 seconds"

### Decision Tracing
❌ "Use PostgreSQL"
✅ "PostgreSQL for complex compliance relationships with JSONB flexibility"

### Context Efficiency
- Read .ctx.md by default (60-70% reduction)
- Full .md only for human review
- Cumulative savings across cascade

### State Management
Session state in `.cascade/session-[N]-state.json`:
- Enables pause/resume
- Tracks progress
- Prevents re-work

## Framework Exceptions

### Documented Size Exceptions
- `design-cross-cutting-concerns.md` (564 lines) - Cohesive pattern group
- `design-transaction-boundaries.md` (432 lines) - 8% overage for completeness
- `design-webhook-endpoints.md` (434 lines) - 8% overage for decision trees

All exceptions require explicit justification in PRs.

## Enforcement

### Pre-PR Checks
```bash
# Command size check
for f in .claude/commands/*.md; do
  lines=$(wc -l < "$f")
  [ $lines -gt 400 ] && echo "❌ BLOAT: $(basename $f) = $lines lines"
done
```

### During PR Review
Use `/review-pr` with VALIDATION-CHECKLIST.md Category 12

### Post-Merge
Epic #167 tracks bloated command refactoring