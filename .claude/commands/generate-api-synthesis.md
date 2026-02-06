---
description: Phase 8.4 - Synthesize API design from micro-session outputs (micro-session 4 of 4)
---

# Generate API Synthesis (Phase 8.4)

You are an API design synthesizer. This is the FINAL micro-session of Session 8, where you combine the paradigm, security, and performance decisions from Phases 8.1-8.3 into a comprehensive API design document matching the existing framework format.

## Your Role

Synthesize all micro-session outputs into the final API design document, add core patterns (authentication, rate limiting, pagination, error handling), and create both full and context versions for downstream sessions.

## Critical Philosophy

- **Synthesis Over Generation**: Combine existing decisions, don't recreate
- **Format Preservation**: Match existing template structure exactly
- **Core Pattern Addition**: Add universal patterns not covered in micro-sessions
- **Context Efficiency**: Create .ctx.md version for downstream sessions

## Steps to Execute

### Step 1: Read All Micro-Session Outputs

Read intermediate files (targeting ~20k tokens total):

1. `product-guidelines/session-8.state` - Session state and decisions
2. `product-guidelines/08-phase1-paradigm.md` - Paradigm and serialization
3. `product-guidelines/08-phase2-security.md` - OWASP patterns and validation
4. `product-guidelines/08-phase3-performance.md` - Applied performance patterns
5. `product-guidelines/02-tech-stack.ctx.md` - For auth method and framework
6. `/templates/08-api-design-template.md` - Target output structure

### Step 2: Add Core API Patterns

These patterns apply to ALL APIs regardless of paradigm:

#### 2.1: Authentication Strategy

From tech stack (Session 3):
```
Method: [JWT / OAuth / API Keys / Clerk / Auth0]
Token Placement: [Header (Authorization: Bearer) / Cookie / Query]
Token Lifetime: [Duration, refresh strategy]
Authorization Patterns:
- User-owned resources
- Team resources
- Admin-only endpoints
- Public endpoints
```

#### 2.2: Rate Limiting Strategy

From product strategy pricing model:
```
Limits by Tier:
- Free: [10-100 req/min]
- Pro: [100-1000 req/min]
- Enterprise: [custom/unlimited]

Limiting Approach: [Per user / Per team / Per IP]
Endpoint-Specific: [Expensive ops stricter]
Headers: X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset
```

#### 2.3: Pagination Strategy

Based on data volume and paradigm:
```
If REST/GraphQL:
- Cursor pagination: For >1K records, changing data
- Offset pagination: For <1K records, simple CRUD

If gRPC:
- Stream pagination with page tokens

Format examples:
- Cursor: ?cursor=abc&limit=20
- Offset: ?page=1&limit=20
```

#### 2.4: Error Handling Philosophy

Standard format for all paradigms:
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error",
    "details": {},
    "field": "fieldName",
    "request_id": "req_abc123"
  }
}
```

HTTP Status Codes (REST) / Error Codes (GraphQL/gRPC):
- Success: 200, 201, 202, 204
- Client Errors: 400, 401, 403, 404, 409, 422, 429
- Server Errors: 500, 502, 503, 504

### Step 3: Add REST Design Patterns (If Paradigm = REST)

Only include if paradigm from 8a is REST:

#### 3.1: Resource Naming Conventions
- Collections: Plural nouns (/users, /orders)
- Single resource: /{collection}/{id}
- Nested resources: /{parent}/{id}/{child}

#### 3.2: HTTP Verb Usage
- GET: Retrieve (idempotent, safe)
- POST: Create (not idempotent without key)
- PUT: Replace (idempotent)
- PATCH: Partial update (idempotent)
- DELETE: Remove (idempotent)

#### 3.3: Query Parameter Standards
- Filtering: ?status=active
- Sorting: ?sort=-created_at
- Field Selection: ?fields=id,name
- Search: ?q=term

#### 3.4: Response Envelope
- Single: Return object directly
- Collection: {data: [...], pagination: {...}}
- Errors: {error: {...}}

### Step 3.5: Validate Security and Performance Requirements

Before writing final API design, verify all required patterns per VALIDATION-CHECKLIST.md Category 11:

**Required Security Patterns (from Phase 8.2):**
- ✓ OWASP API Top 10 2023 coverage complete
- ✓ Input validation strategy present
- ✓ Authentication strategy defined

**Conditional Performance Patterns (from Phase 8.3):**
- If REST paradigm → HTTP caching strategy must be present
- If financial/high-traffic → Idempotency patterns must be present
- If third-party APIs → Circuit breaker patterns must be present

If any required pattern is missing, include warning in output header.

### Step 4: Write Final API Design

Write `product-guidelines/08-api-design.md` following template structure:

```markdown
# API Design Specification

Generated: [timestamp]
Session: 8 - API Design (Synthesized from 8a-8d micro-sessions)

## Overview

**API Paradigm**: [From 8a]
**Serialization Format**: [From 8a]
**Security Focus**: OWASP API Top 10 2023 compliance
**Performance Patterns**: [List applied from 8c]

## API Paradigm Decision

[Copy paradigm section from 08-phase1-paradigm.md]

## REST Design Patterns
[Include ONLY if paradigm = REST]

### Resource Naming Conventions
[REST patterns from Step 3]

### HTTP Verb Usage and Idempotency
[REST patterns from Step 3]

### Query Parameter Standards
[REST patterns from Step 3]

### Response Envelope Consistency
[REST patterns from Step 3]

## Serialization Format Decision

[Copy from 08-phase1-paradigm.md]

## Authentication Strategy

[Core pattern from Step 2.1 with tech stack reference]

## Security Protection Patterns (OWASP API Top 10 2023)

[Copy security patterns from 08-phase2-security.md]

## Input Validation Strategy

[Copy validation section from 08-phase2-security.md]

## HTTP Caching Strategy
[Include if applied in 8c]

[Copy from 08-phase3-performance.md if httpCaching = true]

## Idempotency and Retry Strategies
[Include if applied in 8c]

[Copy from 08-phase3-performance.md if idempotency = true]

## Circuit Breaker Configuration
[Include if applied in 8c]

[Copy from 08-phase3-performance.md if circuitBreakers = true]

## Internationalization Support
[Include if applied in 8c]

[Copy from 08-phase3-performance.md if i18nHeaders = true]

## Webhook Endpoint Design
[Include if applied in 8c]

[Copy from 08-phase3-performance.md if webhooks = true]

## Rate Limiting Strategy

[Core pattern from Step 2.2]

## Pagination Strategy

[Core pattern from Step 2.3]

## Error Handling Philosophy

[Core pattern from Step 2.4]

## Scale-Forward Strategy

**MVP (0-6 months)**:
- [Initial implementation from 8a]
- [Security baseline from 8b]
- [Performance basics from 8c]

**Growth (6-12 months)**:
- [Evolution strategy from 8a]
- [Enhanced security from 8b]
- [Performance scaling from 8c]

**Scale (12+ months)**:
- [Mature architecture from 8a]
- [Advanced security from 8b]
- [Full performance from 8c]

## What We DIDN'T Choose

### API Paradigm Alternatives
[Copy alternatives from 08a]

### Serialization Alternatives
[Copy alternatives from 08a]

### Patterns Not Applied
[Copy from 08c]

## Technical Requirements Summary

For implementation in Session 8b (API Contracts):
- Paradigm: [From 8a]
- Serialization: [From 8a]
- Auth: [Method]
- Validation: [Library]
- Security: [Key patterns]
- Performance: [Applied patterns]

## Next Steps

Run `/generate-api-contracts` (Session 8b) to create:
- Technical API specification (OpenAPI/GraphQL SDL/Protobuf)
- Request/response schemas
- Endpoint definitions
- Example payloads
```

### Step 5: Create Context Version

After writing the full API design, invoke the distillation agent to create the context version:

```
Use Task tool to invoke .claude/agents/distill-context.md:
- Source: product-guidelines/08-api-design.md
- Output: product-guidelines/08-api-design.ctx.md
- Target: 60-65% reduction
```

The distillation agent will:
- Extract ALL decisions (paradigm, serialization, auth, security patterns)
- Remove rationale and examples
- Preserve section structure

**Critical to preserve**:
- API paradigm and serialization choices
- All OWASP security patterns (for Session 10 backlog)
- Authentication and rate limiting strategies
- Applied performance patterns
- Technical requirements summary

### Step 6: Update State Tracking

Update `product-guidelines/session-8.state`:

```json
{
  ...existing state...,
  "phases": {
    "phase1": {...existing...},
    "phase2": {...existing...},
    "phase3": {...existing...},
    "phase4": {
      "name": "API Synthesis",
      "complete": true,
      "timestamp": "[timestamp]",
      "outputFiles": [
        "08-api-design.md",
        "08-api-design.ctx.md"
      ]
    }
  },
  "status": "complete",
  "sessionComplete": true,
  "last_updated": "[timestamp]"
}
```

### Step 7: Clean Up Intermediate Files (Optional)

Since the intermediate files (08a, 08b, 08c) have been synthesized into the final output, optionally note they can be removed or archived. However, keep them for audit trail.

### Step 8: Provide Checkpoint Message

Output the standard Session 8 checkpoint for user review.

## Success Criteria

- [ ] Reads all micro-session outputs successfully
- [ ] Adds core patterns (auth, rate limiting, pagination, errors)
- [ ] Includes REST patterns only if paradigm = REST
- [ ] Matches existing template structure exactly
- [ ] Creates both .md and .ctx.md versions
- [ ] State marked as complete

## Output Format

The command should create:
1. `product-guidelines/08-api-design.md` - Complete API design specification
2. `product-guidelines/08-api-design.ctx.md` - Context version (60-65% reduction)
3. `product-guidelines/session-8.state` - Final state update

Then output the checkpoint message:
```
=================================================
✅ Session 8 Complete: API Design Specification

Your API design has been established with:

**Paradigm**: [Chosen paradigm]
**Security**: OWASP API Top 10 2023 patterns
**Performance**: [List of applied patterns]
**Core Patterns**: Authentication, rate limiting, pagination, error handling

## Review Checklist

Please review the API design decisions:
- [ ] Paradigm choice aligns with journey requirements
- [ ] Security patterns address identified risks
- [ ] Performance patterns match scale needs
- [ ] Core patterns fit your product model

## What Happens Next

These API decisions will flow into:
- Session 8b: Technical API contracts (OpenAPI/GraphQL/Protobuf specs)
- Session 9: Test strategy (API testing approach)
- Session 10: Backlog (API implementation stories)

## Files Generated
- 📄 08-api-design.md (full specification)
- 📄 08-api-design.ctx.md (context version)

To continue the cascade, run: `/generate-api-contracts`

Or to regenerate this session: `/generate-api-design`
=================================================
```

## Error Handling

If any micro-session output is missing:
```
❌ Cannot synthesize - Missing micro-session outputs:
- [List missing files]

The synthesis phase requires all three micro-sessions to be complete:
- Phase 8.1: API Paradigm Selection
- Phase 8.2: API Security Design
- Phase 8.3: API Performance Patterns

Please run `/generate-api-design` to complete missing phases.
```

## Remember

**Synthesis preserves journey traceability.**

This phase combines decisions, it doesn't create new ones. Every pattern in the final document must trace back to:
1. Journey requirements (from 8a)
2. Security risks (from 8b)
3. Performance needs (from 8c)
4. Tech stack choices (core patterns)

The synthesis creates coherence while maintaining the journey-driven decisions from each micro-session.