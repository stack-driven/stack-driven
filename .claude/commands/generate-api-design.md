---
description: Session 8 - High-level API architectural decisions (paradigm, serialization, auth, rate limiting)
---

# Session 8: Generate API Design (Orchestrator)

This is **Session 8** of the cascade. You'll create a comprehensive API design specification through a multi-phase, token-efficient approach. This command orchestrates 4 micro-sessions to make API architectural decisions without context exhaustion.

## Configuration

**STATE_FILE_PATH**: `product-guidelines/session-8.state`

## Your Role

You are the orchestrator for API design generation, managing the four-phase approach:
1. **Phase 8.1**: Select API paradigm and serialization format (~15k tokens)
2. **Phase 8.2**: Design OWASP security patterns and validation (~10k tokens)
3. **Phase 8.3**: Apply conditional performance patterns (~10k tokens)
4. **Phase 8.4**: Synthesize into complete API design (~20k tokens)

Total: <100k tokens (vs 700k+ in previous architecture)

## Critical Philosophy

- **Sequential Processing**: Each phase builds on previous decisions
- **Conditional Patterns**: Only apply patterns that match requirements
- **State Persistence**: Track progress and decisions across phases
- **Token Efficiency**: Each phase uses minimal necessary context

## When to Use This

**This is Session 8** in the core Stack-Driven cascade. Run it:
- After Session 7 (`/design-database-schema` - data model)
- Before Session 8b (`/generate-api-contracts` - technical implementation)
- When you need to make architectural API decisions based on journey requirements

**Skip this** if:
- You're building a frontend-only application (no backend)
- Your product doesn't expose APIs
- You prefer to evolve API architecture incrementally during development

## Architecture Overview

```
Session 8 Orchestrator:
├── Check for existing state (STATE_FILE_PATH)
├── If no state: Start with Phase 8.1 (paradigm selection)
├── If state exists: Resume from last incomplete phase
├── Run phases sequentially (8.1 → 8.2 → 8.3 → 8.4)
├── Each phase reads minimal context
├── Update state after each phase
└── Complete when 08-api-design.md is generated
```

## Steps to Execute

### Step 1: Check Current State

Check if STATE_FILE_PATH exists:

**If state file exists:**
- Read the state to understand progress
- Determine which phases are complete
- Identify next phase to execute
- Resume from checkpoint

**If no state file exists:**
- This is a fresh start
- Initialize state tracking
- Proceed to Phase 8.1

### Step 2: Execute Phase 8.1 - API Paradigm Selection

If Phase 8.1 is not complete:

```
Invoke: /generate-api-paradigm

This will:
1. Read minimal context (~15k tokens)
2. Apply 5-factor decision tree
3. Select API paradigm (REST/GraphQL/gRPC/WebSocket/Hybrid)
4. Choose serialization format
5. Write 08a-api-paradigm.md
6. Initialize/update state with paradigm decision and conditional flags
```

After Phase 8.1 completes:
- Reload state file to get paradigm decision
- Check conditional pattern flags
- Proceed to Phase 8.2

### Step 3: Execute Phase 8.2 - API Security Design

If Phase 8.2 is not complete:

```
Invoke: /generate-api-security

This will:
1. Read state and minimal context (~10k tokens)
2. Analyze 7 OWASP API Top 10 2023 risks
3. Design protection patterns (BOLA, BFLA, etc.)
4. Define input validation strategy
5. Write 08b-api-security.md
6. Update state with completion status
```

After Phase 8.2 completes:
- Reload state file
- Proceed to Phase 8.3

### Step 4: Execute Phase 8.3 - API Performance Patterns

If Phase 8.3 is not complete:

```
Invoke: /generate-api-performance

This will:
1. Read state and minimal context (~10k tokens)
2. Check conditional pattern flags from state
3. Apply ONLY patterns that match requirements:
   - HTTP Caching (if REST/HTTP paradigm)
   - Idempotency (if financial/high-traffic)
   - Circuit Breakers (if third-party APIs)
   - i18n Headers (if i18n required)
   - Webhooks (if webhook integrations)
4. Write 08c-api-performance.md
5. Update state with applied patterns
```

After Phase 8.3 completes:
- Reload state file
- Proceed to Phase 8.4

### Step 5: Execute Phase 8.4 - API Synthesis

If Phase 8.4 is not complete:

```
Invoke: /generate-api-synthesis

This will:
1. Read all micro-session outputs (~20k tokens)
2. Add core patterns (auth, rate limiting, pagination, errors)
3. Add REST patterns (if paradigm = REST)
4. Synthesize into complete API design
5. Write 08-api-design.md
6. Create 08-api-design.ctx.md (via distillation)
7. Mark session complete in state
```

After Phase 8.4 completes:
- Session 8 is complete
- Display checkpoint message for user review

## State Management

The orchestrator maintains state in `.cascade/session-8-state.json`:

```json
{
  "session": "8",
  "phase": "8a-paradigm|8b-security|8c-performance|8d-synthesis|complete",
  "generated_at": "timestamp",
  "phases": {
    "8a": {
      "name": "API Paradigm Selection",
      "complete": boolean,
      "timestamp": "when completed",
      "paradigm": "REST|GraphQL|gRPC|WebSocket|Hybrid",
      "serialization": "JSON|Protobuf|MessagePack"
    },
    "8b": {
      "name": "API Security Design",
      "complete": boolean,
      "timestamp": "when completed"
    },
    "8c": {
      "name": "API Performance Patterns",
      "complete": boolean,
      "timestamp": "when completed",
      "patternsApplied": ["list of applied patterns"]
    },
    "8d": {
      "name": "API Synthesis",
      "complete": boolean,
      "timestamp": "when completed"
    }
  },
  "conditionalPatterns": {
    "httpCaching": boolean,
    "idempotency": boolean,
    "circuitBreakers": boolean,
    "i18nHeaders": boolean,
    "webhooks": boolean
  },
  "status": "ready_for_paradigm|ready_for_security|ready_for_performance|ready_for_synthesis|complete",
  "sessionComplete": boolean
}
```

## Resumption Logic

If the user runs `/generate-api-design` after partial completion:

1. **Check state file** - Understand which phases are complete
2. **Skip completed phases** - Don't regenerate existing decisions
3. **Resume from checkpoint** - Continue with next incomplete phase
4. **Maintain progress** - Update state as phases complete

## Error Recovery

**If a phase fails:**
- State file preserves completed phases
- User can re-run `/generate-api-design` to retry
- Only the failed phase will re-execute

**If state file is corrupted:**
- Check for existing output files (08a, 08b, 08c)
- Rebuild state from existing files
- Continue from last successful phase

## Success Criteria

**Session 8 is complete when:**
- [ ] All 4 phases have executed successfully
- [ ] `08-api-design.md` exists with complete specification
- [ ] `08-api-design.ctx.md` exists for downstream sessions
- [ ] State file shows `sessionComplete: true`
- [ ] Token usage <100k total (vs 700k+ previously)

## After This Session

The checkpoint message from Phase 8.4 will guide the user to:
- Run `/generate-api-contracts` (Session 8b) for technical implementation
- Session 8b will read `08-api-design.ctx.md` for decisions

## Remember

**The orchestrator manages complexity, not the user.**

This refactored architecture:
1. Reduces token usage by 85% (700k → <100k)
2. Maintains decision quality through focused phases
3. Enables interruption and resumption
4. Preserves journey traceability
5. Applies patterns conditionally, not universally

Each phase has ONE responsibility and minimal context, following the proven Session 10 pattern for token efficiency without sacrificing output quality.
