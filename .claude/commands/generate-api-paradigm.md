---
description: Phase 8.1 - Select API paradigm and serialization format (micro-session 1 of 4)
---

# Generate API Paradigm (Phase 8.1)

You are an API paradigm selection specialist. This is the FIRST micro-session of Session 8, where you analyze the user journey, tech stack, and architecture to recommend the optimal API paradigm (REST, GraphQL, gRPC, WebSocket, or hybrid) with minimal context usage.

## Your Role

Select the API paradigm and serialization format based on journey requirements using a systematic decision tree approach. You will use minimal context (~15k tokens) to preserve capacity for later micro-sessions.

## Critical Philosophy

- **Journey-Driven**: API paradigm must trace to specific journey steps and requirements
- **Minimal Context**: Read only essential files to preserve tokens
- **Paradigm Decision Only**: Focus solely on paradigm and serialization (security/performance in later phases)
- **State Initialization**: Create tracking state for the multi-phase process

## Steps to Execute

### Step 1: Read Minimal Context

Read ONLY these essential files (targeting ~15k tokens total):
1. `product-guidelines/00-user-journey.ctx.md` - For real-time needs, data requirements
2. `product-guidelines/02-tech-stack.ctx.md` - For backend framework, API preferences
3. `product-guidelines/04-architecture.ctx.md` - For microservices, integrations, scale

Skip database schema and other files to preserve context capacity.

### Step 2: Apply 5-Factor Decision Tree

Analyze the journey and tech stack using this decision tree:

```
1. Check for real-time requirements (Journey Steps):
   - <1s updates needed? → WebSocket or Server-Sent Events
   - Collaborative features (live editing, presence)? → WebSocket
   - 30s-5min async operations (document processing)? → REST with polling
   - No real-time needs? → Continue to #2

2. Check for data fetching flexibility (Journey + Strategy):
   - Mobile app with bandwidth constraints? → GraphQL (selective fields)
   - Variable data shapes (50+ optional fields)? → GraphQL
   - Clients need different field subsets? → GraphQL
   - Simple CRUD with predictable queries? → REST
   - Unsure? → Continue to #3

3. Check architecture (Tech Stack + Architecture):
   - Microservices architecture chosen? → gRPC internal + REST external (hybrid)
   - Need high-throughput service-to-service calls? → gRPC
   - Monolith architecture? → REST
   - Unsure? → Continue to #4

4. Check third-party integrations (Product Strategy):
   - Need marketplace/partner APIs (discoverability)? → REST + HATEOAS
   - Building platform with third-party apps? → REST or GraphQL (standard)
   - Internal/single-client only? → Simple REST or gRPC
   - Unsure? → Continue to #5

5. Check performance requirements (Journey + Metrics):
   - High-throughput service-to-service (>10K req/sec)? → gRPC
   - Need bidirectional streaming? → gRPC or WebSocket
   - Standard B2B SaaS patterns? → REST
   - Unsure? → Default to REST

Default: REST (if no criteria match or first MVP iteration)
```

### Step 3: Document Journey-Based Analysis

For EACH of the 5 criteria, provide specific journey citations:
- Example: "Journey Step 2 (document upload → assessment) has 2-4min processing → REST with polling (not WebSocket)"
- Example: "Journey has no mobile app (desktop web only) → No bandwidth constraints → REST sufficient (not GraphQL)"
- Example: "Architecture chose monolith (Session 4) → No service-to-service calls → REST (not gRPC)"

### Step 4: Select Serialization Format

Based on the chosen paradigm, select serialization format:
- **REST** → JSON (default), MessagePack (internal high-performance endpoints)
- **GraphQL** → JSON (standard, universal support)
- **gRPC** → Protobuf (native, type-safe)
- **WebSocket** → JSON (simple) or MessagePack (high-performance real-time)
- **Hybrid** → JSON (external REST/GraphQL), Protobuf (internal gRPC)

Include journey-based reasoning for the format choice (bandwidth constraints, performance needs, client compatibility).

### Step 5: Write API Paradigm Decision

Write `product-guidelines/08-phase1-paradigm.md`:

```markdown
# API Paradigm Decision (Phase 8.1)

Generated: [timestamp]
Phase: 8.1 of 8 (API Design micro-sessions)

## Chosen Paradigm: [REST / GraphQL / gRPC / WebSocket / Hybrid]

## Journey-Based Analysis

### 1. Real-time Requirements
**Finding**: [Analysis with journey citation]
- [Specific journey step reference]
- [Impact on paradigm choice]

### 2. Data Fetching Flexibility
**Finding**: [Analysis with journey citation]
- [Specific journey step reference]
- [Impact on paradigm choice]

### 3. Architecture Pattern
**Finding**: [Analysis with architecture reference]
- [Session 4 architecture decision]
- [Impact on paradigm choice]

### 4. Third-party Integrations
**Finding**: [Analysis with product strategy reference]
- [Integration requirements]
- [Impact on paradigm choice]

### 5. Performance Requirements
**Finding**: [Analysis with metrics reference]
- [Journey or architecture reference]
- [Impact on paradigm choice]

## Paradigm Recommendation: [Paradigm]

**Reasoning**: [2-3 sentences tracing decision to journey steps, architecture, and requirements]

**Scale-Forward Strategy**: [How this paradigm evolves as needs grow]
- MVP: [Initial implementation]
- Growth: [6-month evolution]
- Scale: [12-month maturity]

## Serialization Format: [JSON / Protobuf / MessagePack]

**Alignment**: [Brief recommendation based on paradigm and journey requirements]
- Bandwidth considerations: [Journey reference]
- Performance needs: [Architecture reference]
- Client compatibility: [Tech stack reference]

## Alternatives NOT Chosen

### Alternative 1: [Paradigm]
**Why not**: [Journey-based reason for rejection]

### Alternative 2: [Paradigm]
**Why not**: [Journey-based reason for rejection]

### Alternative 3: [Paradigm]
**Why not**: [Journey-based reason for rejection]

## Next Steps
- Phase 8.2 will design OWASP security patterns
- Phase 8.3 will add performance patterns (caching, idempotency, etc.)
- Phase 8.4 will synthesize into complete API design
```

### Step 6: Initialize State Tracking

Create `product-guidelines/session-8.state`:

```json
{
  "session": "8",
  "phase": "paradigm",
  "generated_at": "[timestamp]",
  "phases": {
    "phase1": {
      "name": "API Paradigm Selection",
      "complete": true,
      "timestamp": "[timestamp]",
      "paradigm": "[selected-paradigm]",
      "serialization": "[selected-format]"
    },
    "phase2": {
      "name": "API Security Design",
      "complete": false,
      "timestamp": null
    },
    "phase3": {
      "name": "API Performance Patterns",
      "complete": false,
      "timestamp": null
    },
    "phase4": {
      "name": "API Synthesis",
      "complete": false,
      "timestamp": null
    }
  },
  "conditionalPatterns": {
    "httpCaching": [true if REST/HTTP],
    "idempotency": [true if financial/high-traffic],
    "circuitBreakers": [true if third-party APIs],
    "i18nHeaders": [true if i18n required],
    "webhooks": [true if webhook integrations]
  },
  "status": "ready_for_security",
  "last_updated": "[timestamp]"
}
```

### Step 7: Provide User Instructions

Output a message explaining:
1. API paradigm has been selected
2. Decision traced to journey requirements
3. State initialized for multi-phase processing
4. Next phase will handle security patterns

## Success Criteria

- [ ] Uses <15k tokens of context (minimal file reading)
- [ ] All 5 decision criteria evaluated with journey citations
- [ ] Paradigm decision traces to specific journey steps
- [ ] Serialization format aligned with paradigm
- [ ] State file created with paradigm decision
- [ ] Ready for security patterns in Phase 8.2

## Output Format

The command should create:
1. `product-guidelines/08-phase1-paradigm.md` - Paradigm decision with journey traceability
2. `product-guidelines/session-8.state` - State tracking file (or update if exists)

Then output:
```
✅ Phase 8.1 Complete: API Paradigm Selected

Chosen Paradigm: [paradigm]
Serialization Format: [format]

Decision based on:
- [Primary journey factor]
- [Secondary architecture factor]

Conditional patterns identified:
- HTTP Caching: [Yes/No - applies to REST only]
- Idempotency: [Yes/No - based on requirements]
- Circuit Breakers: [Yes/No - based on third-party APIs]

Next: Phase 8.2 will design OWASP security patterns.
Run `/generate-api-design` to continue the API design process.
```

## Error Handling

If required context files are missing:
```
❌ Cannot proceed - Missing required context files:
- [List missing files]

Please complete the following sessions first:
- [Required sessions]

Then run `/generate-api-paradigm` again.
```

## Remember

**Every paradigm decision must serve the user journey.**

Don't choose paradigms because they're "modern". Choose based on:
1. What journey steps need real-time updates?
2. What are the data fetching patterns?
3. What architecture was chosen?
4. What integrations are needed?
5. What performance is required?

If you can't trace the paradigm choice to a journey step or architecture decision, reconsider.