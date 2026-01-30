# Architecture Principles: [Your Product Name]

> **Derived from**: product-guidelines/02-tech-stack.md and journey requirements

---

## Architecture Overview

```
[Create architecture diagram showing main components]
```

---

## Core Architectural Principles

### 1. Journey-Step Optimization
**Principle**: Optimize architecture for critical journey steps, not theoretical scale.

**Application**:
- Step [X]: [Architectural decision]
- Step [Y]: [Architectural decision]

### 2. [Principle Name]
**Principle**: [Principle statement]

**Application**: [How you apply this]

---

## Data Flow: [Critical Journey Step]

```
1. User [action]
   ↓
2. Frontend → Backend: [API call]
   ↓
3. Backend [processing]
   ↓
4. [Service] → [External API]
   ↓
5. Results stored in [database]
   ↓
6. Frontend displays [result]
```

**Why This Architecture**: [Reasoning tied to journey requirements]

---

## Database Schema (Key Tables)

[Include key table structures relevant to journey]

---

## Scaling Strategy

### Current Capacity
- [Metric]: [Current capacity]
- [Metric]: [Current capacity]

### Bottlenecks & Solutions
**Bottleneck**: [Potential bottleneck]
**Solution**: [How to address when needed]

---

## Third-Party Integration Architecture (if applicable)

[If integrations exist from Session 2a, document:]

### Integration Registry
[Table of all integrations with purpose, journey mapping, pattern, priority]

| Integration | Purpose | Journey Step | Pattern | Priority |
|-------------|---------|--------------|---------|----------|
| [Provider] | [Purpose] | Step X | API / API+Webhooks / Bidirectional Sync | P0/P1 |

### Credential Management
**Storage**: [Environment variables / AWS Secrets Manager / HashiCorp Vault]
**Rotation**: [Manual / Automated with X-day rotation]
**Access Control**: [Who/what can access credentials]

**Example**: Production API keys stored in [location], accessed via [method], rotated [frequency]

### Resilience Patterns
**Retry Logic**:
- Exponential backoff: 1s → 2s → 4s → 8s → 16s
- Max retries: 5 attempts
- Applies to: [Which integrations]

**Circuit Breaker**:
- Open circuit after 5 consecutive failures
- Half-open after 60 seconds (test with single request)
- Close if successful
- Applies to: [Non-critical integrations]

**Fallback Behavior**:
- [Integration name]: [What happens when unavailable]
- Example: "Stripe down → Queue payment for processing, show 'Payment pending' to user"

### Webhook Infrastructure (if webhooks exist)
**Endpoint Pattern**: `/webhooks/[provider-name]`
**Verification**: HMAC signature validation (SHA-256)
**Processing**: Async queue (Redis/SQS) + background workers
**Idempotency**: Check `webhook_events.event_id` before processing
**Retry Strategy**: Provider-dependent (document per provider)

### Rate Limiting (Outbound)
[Track third-party API rate limits and implement client-side limiting]

| Integration | Rate Limit | Strategy |
|-------------|------------|----------|
| [Provider] | [X req/sec or req/min or req/day] | [Strategy] |

### Monitoring & Alerting
- Track integration success/failure rates (target: >99.5% success)
- Alert on: 5+ consecutive failures, rate limit exceeded, credential expiration
- Dashboard: Integration health metrics per provider

---

**Connection to Journey**: Architecture optimizes [Journey Step X] (critical path)
