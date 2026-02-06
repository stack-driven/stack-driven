---
description: Phase 8.3 - Design conditional API performance patterns (micro-session 3 of 4)
---

# Generate API Performance (Phase 8.3)

You are an API performance optimization specialist. This is the THIRD micro-session of Session 8, where you design conditional performance patterns (caching, idempotency, circuit breakers, i18n, webhooks) based on journey requirements with minimal context usage.

## Your Role

Design performance patterns ONLY for those that apply to the journey and architecture. You will use minimal context (~10k tokens) and apply patterns conditionally, not universally.

## Critical Philosophy

- **Conditional Application**: Only apply patterns that match requirements
- **Journey-Driven Performance**: Each pattern must serve specific journey needs
- **Paradigm-Aware**: Patterns adapt to REST/GraphQL/gRPC from Phase 8.1
- **State Continuation**: Check conditional flags from state file

## Steps to Execute

### Step 1: Read State and Minimal Context

Read state and context files (targeting ~10k tokens total):

1. `product-guidelines/session-8.state` - Get paradigm and conditional flags
2. `product-guidelines/08-phase1-paradigm.md` - Paradigm choice
3. `product-guidelines/04-architecture.ctx.md` - For integrations and scale
4. `product-guidelines/02a-constraints.ctx.md` (if exists) - For i18n and compliance

Skip journey and database files to preserve context capacity.

### Step 2: Determine Which Patterns Apply

Check conditional flags from state file to determine which patterns to design:

```javascript
conditionalPatterns: {
  httpCaching: true if paradigm is REST/HTTP-based
  idempotency: true if financial operations OR high traffic
  circuitBreakers: true if third-party APIs exist
  i18nHeaders: true if i18n marked required in constraints
  webhooks: true if webhook-based integrations exist
}
```

**CRITICAL**: Only design patterns where flag is true. Skip others entirely.

### Step 3: Design Applicable Performance Patterns

#### Pattern 3.1: HTTP Caching Strategy (If httpCaching = true)

**Condition**: Paradigm is REST or HTTP-based
**Skip if**: GraphQL, gRPC, or WebSocket

Design caching strategy:
```
Cache-Control Directives by Resource Type:
- Public static assets: max-age=31536000, immutable
- User profiles: private, max-age=300
- Sensitive data: no-store, no-cache
- Dynamic lists: max-age=60, must-revalidate

ETag Strategy:
- Entity version: Use updated_at timestamp
- Collection: Hash of IDs + updated_at
- Implementation: Weak ETags (W/"...")

Compression:
- Algorithm: Brotli (primary), gzip (fallback)
- Min size: 1KB threshold
- Content-Types: application/json, text/*
```

#### Pattern 3.2: Idempotency & Retry (If idempotency = true)

**Condition**: Financial operations OR high traffic architecture
**Skip if**: Read-only API with no critical operations

Design idempotency strategy:
```
Idempotency-Protected Endpoints:
- Payment processing: POST /payments
- Order creation: POST /orders
- Resource creation: POST /[resources]

Idempotency Key:
- Header: Idempotency-Key
- Format: UUID v4
- Storage: Redis/cache with 24h TTL
- Conflict response: 409 with original response

Retry Strategy:
- 429 Too Many Requests: Retry-After header
- 503 Service Unavailable: Exponential backoff
- 202 Accepted: Poll with Location header
```

#### Pattern 3.3: Circuit Breakers (If circuitBreakers = true)

**Condition**: Architecture lists third-party APIs
**Skip if**: No external API dependencies

Design circuit breaker configuration per third-party API:
```
Per Third-Party Service:
- Service: [Name from architecture]
- Timeout: [Based on SLA]
- Failure threshold: [% before opening]
- Recovery timeout: [Cool-down period]
- Fallback: [Cached data, default, or error]

Example:
- Payment Provider:
  - Timeout: 10s
  - Threshold: 50% failures in 10 requests
  - Recovery: 30s
  - Fallback: Queue for retry

- Email Service:
  - Timeout: 5s
  - Threshold: 30% failures in 5 requests
  - Recovery: 60s
  - Fallback: Local queue
```

#### Pattern 3.4: Internationalization Headers (If i18nHeaders = true)

**Condition**: Session 2a marks i18n as required
**Skip if**: No i18n requirement

Design i18n header strategy:
```
Locale Detection Priority:
1. Query parameter: ?locale=en-US
2. User preference: Profile setting
3. Accept-Language header: Browser preference
4. Default: en-US

Request Headers:
- Accept-Language: en-US,en;q=0.9

Response Headers:
- Content-Language: en-US
- Vary: Accept-Language

Locale Fallback Chain:
- Requested: zh-CN
- Fallback 1: zh (language only)
- Fallback 2: en-US (default)

Error Message Localization:
- Store error keys, not text
- Client-side translation
- Fallback to English
```

#### Pattern 3.5: Webhook Endpoints (If webhooks = true)

**Condition**: Third-party integrations use webhooks
**Skip if**: No webhook-based services

Design webhook endpoint strategy:
```
Processing Pattern:
- Sync (<5s): Process inline, return 200
- Async (>5s): Queue, return 202

Idempotency:
- Use provider's event_id
- Deduplicate in database
- Store: webhook_events table

Signature Verification:
[Per provider from architecture]
- Stripe: HMAC-SHA256 with timestamp
- PayPal: Certificate validation
- Shopify: HMAC-SHA256
- Custom: Shared secret + HMAC

Scale-Forward:
- MVP: Single endpoint /webhooks/[provider]
- Growth: Queue-based processing
- Scale: Dedicated webhook service
```

### Step 4: Write API Performance Patterns

Write `product-guidelines/08-phase3-performance.md`:

```markdown
# API Performance Patterns (Phase 8.3)

Generated: [timestamp]
Phase: 8.3 of 8 (API Design micro-sessions)
Paradigm: [from Phase 8.1]

## Applied Performance Patterns

[Only include sections where conditional flag = true]

### HTTP Caching Strategy
[Include if httpCaching = true]

**Cache-Control by Resource Type**:
- [Resource]: [Directive]
- [Resource]: [Directive]

**ETag Implementation**:
- Strategy: [Version/hash approach]
- Weak ETags: [Yes/No]

**Compression Configuration**:
- Primary: [Algorithm]
- Fallback: [Algorithm]
- Threshold: [Size]

### Idempotency and Retry Strategy
[Include if idempotency = true]

**Protected Endpoints**:
- [Endpoint]: [Operation type]
- [Endpoint]: [Operation type]

**Idempotency Key Configuration**:
- Header: Idempotency-Key
- Storage: [Backend]
- TTL: [Duration]

**Retry Patterns**:
- 429: [Strategy]
- 503: [Strategy]
- 202: [Strategy]

### Circuit Breaker Configuration
[Include if circuitBreakers = true]

**Per Service Configuration**:

| Service | Timeout | Threshold | Recovery | Fallback |
|---------|---------|-----------|----------|----------|
| [Service 1] | [Time] | [%] | [Time] | [Strategy] |
| [Service 2] | [Time] | [%] | [Time] | [Strategy] |

### Internationalization Support
[Include if i18nHeaders = true]

**Locale Detection Priority**:
1. [Method 1]
2. [Method 2]
3. [Method 3]
4. Default: [Locale]

**Header Configuration**:
- Request: [Headers]
- Response: [Headers]

**Fallback Chain**:
- [Locale] → [Fallback 1] → [Default]

### Webhook Endpoint Design
[Include if webhooks = true]

**Processing Decision**:
- Sync threshold: [Time]
- Async pattern: [Queue/worker]

**Provider Configurations**:

| Provider | Signature Method | Deduplication | Endpoint |
|----------|-----------------|---------------|----------|
| [Provider] | [Method] | [Field] | [Path] |

**Scale Evolution**:
- MVP: [Approach]
- Growth: [Approach]
- Scale: [Approach]

## Patterns NOT Applied

[List patterns that were evaluated but skipped due to requirements]

- [Pattern]: Not needed because [reason from journey/architecture]
- [Pattern]: Not needed because [reason from journey/architecture]

## Next Steps
- Phase 8.4 will synthesize all decisions into final API design
- Will combine paradigm, security, and performance patterns
```

### Step 5: Update State Tracking

Update `product-guidelines/session-8.state`:

```json
{
  ...existing state...,
  "phases": {
    "phase1": {...existing...},
    "phase2": {...existing...},
    "phase3": {
      "name": "API Performance Patterns",
      "complete": true,
      "timestamp": "[timestamp]",
      "patternsApplied": ["list of applied patterns"],
      "patternsSkipped": ["list of skipped patterns"]
    },
    ...other phases...
  },
  "status": "ready_for_synthesis",
  "last_updated": "[timestamp]"
}
```

### Step 6: Provide User Instructions

Output completion message with applied patterns summary.

## Success Criteria

- [ ] Uses <10k tokens of context
- [ ] Only designs patterns where conditional flag = true
- [ ] Each pattern has journey/architecture justification
- [ ] Skipped patterns explicitly noted with reasons
- [ ] State file updated
- [ ] Ready for synthesis in Phase 8.4

## Output Format

The command should create/update:
1. `product-guidelines/08-phase3-performance.md` - Performance patterns (only applicable ones)
2. `product-guidelines/session-8.state` - Updated state tracking

Then output:
```
✅ Phase 8.3 Complete: Performance Patterns Designed

Patterns Applied:
[List only those with flag = true]
- HTTP Caching: [If applied]
- Idempotency: [If applied]
- Circuit Breakers: [If applied]
- i18n Headers: [If applied]
- Webhooks: [If applied]

Patterns Skipped:
[List those with flag = false]
- [Pattern]: Not needed for this journey

Total patterns: [X] applied, [Y] skipped

Next: Phase 8.4 will synthesize all API decisions into final design.
Run `/generate-api-design` to continue the API design process.
```

## Remember

**Only apply patterns that serve the journey.**

Avoid pattern collection. Each performance optimization must:
1. Address a specific journey requirement
2. Match the paradigm from Phase 8.1
3. Align with architecture decisions
4. Provide measurable value

If a pattern doesn't have clear journey justification, skip it.