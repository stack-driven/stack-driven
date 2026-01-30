# API Design Template (Session 8)

This template guides the high-level architectural decisions for your API. Complete all sections with journey-based reasoning.

---

## Overview

**API Paradigm**: [REST / GraphQL / gRPC / WebSocket / Hybrid]
**Serialization Format**: [JSON / Protobuf / MessagePack / Hybrid]
**Versioning Strategy**: [URL versioning (/v1/, /v2/) / Header versioning / No versioning (breaking changes with migration)]
**Base URL**: https://api.[domain].com

---

## API Paradigm Decision

### Chosen Paradigm: [Paradigm Name]

### Journey-Based Analysis

Document the 5-point decision tree analysis:

#### 1. Real-time Requirements

**Analysis**:
- [Check journey steps for <1s latency needs]
- [Check for collaborative features (live editing, presence)]
- [Check for async operations (30s-5min processing)]

**Finding**:
- Journey Step [X]: [Specific requirement]
- Latency requirement: [<1s / 30s-5min / no real-time]
- **Decision**: [WebSocket / REST with polling / No real-time needed]

**Reasoning**: [2-3 sentences tracing to journey steps]

---

#### 2. Data Fetching Flexibility

**Analysis**:
- [Check for mobile app with bandwidth constraints]
- [Check for variable data shapes (50+ optional fields)]
- [Check if clients need different field subsets]

**Finding**:
- Journey platforms: [Desktop web / Mobile app / Both]
- Field variability: [Simple fixed schemas / Variable complex schemas]
- **Decision**: [GraphQL (flexible) / REST (simple)]

**Reasoning**: [2-3 sentences tracing to journey and client needs]

---

#### 3. Architecture

**Analysis**:
- [Check Session 3 tech stack and Session 4 architecture]
- [Monolith or microservices?]
- [Service-to-service call needs?]

**Finding**:
- Architecture: [Monolith / Microservices]
- Internal API needs: [High-throughput internal calls / No internal APIs]
- **Decision**: [gRPC internal + REST external / REST only]

**Reasoning**: [2-3 sentences referencing Session 4 architecture]

---

#### 4. Third-Party Integrations

**Analysis**:
- [Check product strategy for marketplace/partner APIs]
- [Check for platform/ecosystem building]
- [Internal-only or external partners?]

**Finding**:
- Integration needs: [Marketplace/partners / Internal-only]
- API discoverability: [Need HATEOAS / Simple REST sufficient]
- **Decision**: [REST + HATEOAS / Simple REST / GraphQL]

**Reasoning**: [2-3 sentences tracing to product strategy Session 2]

---

#### 5. Performance Requirements

**Analysis**:
- [Check metrics for throughput needs (Session 4)]
- [Check journey for performance bottlenecks]
- [Need bidirectional streaming?]

**Finding**:
- Throughput: [<100 req/min / 100-1K req/min / >10K req/min]
- Streaming needs: [Bidirectional / Server-to-client / None]
- **Decision**: [gRPC (high-throughput) / REST (standard)]

**Reasoning**: [2-3 sentences tracing to metrics and journey scale]

---

### Paradigm Recommendation: [Paradigm]

**Final Reasoning**: [3-5 sentences synthesizing all 5 decision points]

**Journey Traceability**:
- Journey Step [X]: [How paradigm serves this step]
- Journey Step [Y]: [How paradigm serves this step]
- Architecture (Session 4): [How paradigm aligns with architecture]

**Scale-Forward Strategy**:
- **Current (MVP)**: [Initial paradigm choice]
- **Growth (10x scale)**: [How paradigm evolves]
- **Maturity (100x scale)**: [Migration path if needed]

---

## Serialization Format Decision

### Chosen Format: [JSON / Protobuf / MessagePack / Hybrid]

### Journey-Based Analysis

Document the serialization format decision tree:

#### 1. Human Readability

**Analysis**:
- [Do developers need to debug API responses?]
- [Do clients (browsers) consume directly?]
- [Need configuration files?]

**Finding**:
- Debugging importance: [Critical / Nice-to-have / Not important]
- Client consumption: [Browser (JSON required) / Native apps (flexible)]
- **Decision**: [JSON (readable) / Binary format (performance)]

**Reasoning**: [2-3 sentences tracing to development workflow and clients]

---

#### 2. Performance/Bandwidth

**Analysis**:
- [Check journey for bandwidth constraints (mobile, embedded)]
- [Check journey for latency requirements]
- [Check architecture for high-throughput needs]

**Finding**:
- Journey Step [X]: [Bandwidth constraint or latency need]
- Client type: [Desktop web / Mobile / IoT]
- **Decision**: [Binary format needed / JSON sufficient]

**Reasoning**: [2-3 sentences tracing to journey and performance needs]

---

#### 3. Schema Availability

**Analysis**:
- [Do we have schema from Session 7 database schema?]
- [Can we define schema from API contracts?]

**Finding**:
- Schema defined: [Yes - from Session 7 / Yes - from contracts / No schema]
- **Decision**: [Protobuf (schema-based) / MessagePack (schema-less) / JSON]

**Reasoning**: [2-3 sentences referencing Session 7]

---

#### 4. Financial Data

**Analysis**:
- [Does journey involve money, pricing, payments?]
- [Need exact decimal representation?]

**Finding**:
- Financial data: [Yes - need exact decimals / No financial data]
- **Decision**: [JSON with string numbers / Protobuf with Decimal type / Standard JSON]

**Reasoning**: [2-3 sentences tracing to journey and product strategy]

---

#### 5. Use Case Specifics

**Analysis**:
- [Analytics/data warehouse?]
- [IoT/embedded devices?]
- [Cache optimization?]
- [Message queue?]

**Finding**:
- Specific use case: [Analytics / IoT / Cache / Queue / None]
- **Decision**: [Parquet / MessagePack/CBOR / Binary format / JSON]

**Reasoning**: [2-3 sentences tracing to architecture]

---

### Format Recommendation: [Format]

**Final Reasoning**: [3-5 sentences synthesizing all decision points and paradigm alignment]

**Format by Context**:
- **External APIs** (client-facing): [Format] - [Reasoning]
- **Internal APIs** (service-to-service): [Format] - [Reasoning]
- **Cache/Queue**: [Format] - [Reasoning]
- **Configuration**: [Format] - [Reasoning]

**Paradigm Alignment**:
- Paradigm: [REST / GraphQL / gRPC]
- Standard format: [JSON / Protobuf / MessagePack]
- **Alignment**: [How format fits paradigm]

**Scale-Forward Strategy**:
- **Current (MVP)**: [Initial format choice]
- **Growth (bandwidth matters)**: [When to introduce binary]
- **Maturity (multi-format)**: [Hybrid approach if needed]

---

## Authentication Strategy

### Method: [JWT / OAuth 2.0 / API Keys / Clerk / Auth0]

**Chosen From**: Session 3 tech stack

**Token Placement**: [Authorization: Bearer <token> (header) / Cookie (HttpOnly, Secure) / Query param (public endpoints only)]

**Token Lifetime**:
- **Access token**: [15min-1hr] (short-lived for security)
- **Refresh token**: [7-30 days] (if using refresh flow)

**Refresh Strategy**: [How tokens are refreshed - OAuth refresh flow / Sliding session / No refresh]

### Authorization Patterns

**User-Owned Resources**:
- Pattern: `WHERE user_id = :current_user_id`
- Example: GET /api/documents (returns only user's documents)

**Team Resources**:
- Pattern: `WHERE team_id = :current_user_team_id`
- Example: GET /api/teams/:id (checks user belongs to team)

**Admin-Only Resources**:
- Pattern: `WHERE role = 'admin' OR authorized_for(user, resource)`
- Example: DELETE /api/users/:id (admin only)

**Public Resources**:
- Pattern: No authentication required
- Example: GET /public/reports/:token (shareable public links)

### Journey-Based Reasoning

[3-5 sentences tracing auth choice to:
- Journey security requirements (Session 1)
- Tech stack choice (Session 3)
- Product strategy (Session 2: B2B needs team auth, B2C needs social login, etc.)]

---

## Rate Limiting Strategy

### Limits by Tier

**Free Tier**:
- Standard endpoints: [100 req/min, 5,000 req/day]
- Expensive ops: [10 req/hour, 50 req/day]

**Pro Tier**:
- Standard endpoints: [1,000 req/min, 50,000 req/day]
- Expensive ops: [100 req/hour, 500 req/day]

**Enterprise Tier**:
- Custom limits or unlimited

### Limiting Approach

**Strategy**: [Per user / Per team / Per IP]
- **Reasoning**: [Why this strategy fits the product]

**Window Type**: [Sliding window / Fixed window]
- **Reasoning**: [Accuracy vs simplicity tradeoff]

**Headers** (included in all responses):
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 847
X-RateLimit-Reset: 1699315200 (Unix timestamp)
```

### Endpoint-Specific Limits

**Expensive Operations** (uploads, AI processing, exports):
- Limits: [Stricter limits per hour/day]
- Example: POST /api/documents (10/hour free, 100/hour pro)

**Read Operations** (GET):
- Limits: [Standard tier limits]
- Example: GET /api/documents (100/min free, 1000/min pro)

**Public Endpoints** (unauthenticated):
- Limits: [Strictest per-IP limits to prevent abuse]
- Example: GET /public/reports/:token (10/min per IP)

### Journey-Based Reasoning

[3-5 sentences tracing rate limiting to:
- Pricing model (Session 4: monetization strategy)
- Journey scale (Session 1: expected usage)
- Cost structure (Session 4: protect expensive operations)]

---

## Pagination Strategy

### Approach: [Cursor-based / Offset-based / Hybrid]

### Format

**Cursor-based** (recommended for >1K records):
```
Request: GET /api/resources?cursor=abc&limit=20
Response: {
  data: [...],
  pagination: {
    next_cursor: "def456",
    prev_cursor: "abc123",
    has_more: true
  }
}
```

**Offset-based** (simpler for <1K records):
```
Request: GET /api/resources?page=1&limit=20
Response: {
  data: [...],
  pagination: {
    page: 1,
    limit: 20,
    total: 47,
    total_pages: 3
  }
}
```

### When to Use

**Cursor pagination**:
- Resources: [List resources with >1K records]
- Reasoning: [Stable pagination, better performance, no skipped results]

**Offset pagination**:
- Resources: [List resources with <1K records]
- Reasoning: [Simpler, supports random page access, lower data volume]

### Journey-Based Reasoning

[3-5 sentences tracing pagination to:
- Data volume (Session 7: database schema scale)
- UX needs (Session 1: do users need page numbers?)
- Query patterns (Session 7: how users browse data)]

---

## Error Handling Philosophy

### Standard Error Format

All errors use consistent JSON format:

```json
{
  "error": {
    "code": "ERROR_CODE",              // Machine-readable constant (e.g., VALIDATION_ERROR)
    "message": "Human-readable error", // User-facing message
    "details": {},                     // Optional: additional context
    "field": "fieldName",              // Optional: which field caused error
    "request_id": "req_abc123"         // Optional: for support debugging
  }
}
```

### Status Code Usage

**Success**:
- `200 OK` - Successful GET, PATCH, DELETE
- `201 Created` - Successful POST (resource created)
- `202 Accepted` - Async operation started
- `204 No Content` - Successful DELETE (no body)

**Client Errors**:
- `400 Bad Request` - Invalid input (validation failed)
- `401 Unauthorized` - Missing or invalid auth token
- `403 Forbidden` - Valid token but insufficient permissions
- `404 Not Found` - Resource doesn't exist
- `409 Conflict` - Resource state conflict (e.g., duplicate)
- `413 Payload Too Large` - Request body/file too large
- `422 Unprocessable Entity` - Semantic error (valid format, invalid business logic)
- `429 Too Many Requests` - Rate limit exceeded

**Server Errors**:
- `500 Internal Server Error` - Unexpected server error
- `502 Bad Gateway` - Upstream service failed
- `503 Service Unavailable` - Temporary unavailable (maintenance)
- `504 Gateway Timeout` - Upstream service timeout

### Journey-Based Error Design

**Recoverable Errors** (user can fix):
- Journey Step [X]: [Error scenario] → [Status code] → [User action]
- Example: Document upload fails (413 PAYLOAD_TOO_LARGE) → User compresses file

**System Errors** (user cannot fix):
- Journey Step [Y]: [Error scenario] → [Status code] → [System action]
- Example: AI processing fails (500 INTERNAL_ERROR) → Retry automatically, notify support

### Error Examples

**Validation Error** (400):
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed",
    "details": {
      "name": "Name is required",
      "email": "Invalid email format"
    }
  }
}
```

**Business Logic Error** (422):
```json
{
  "error": {
    "code": "INSUFFICIENT_CREDITS",
    "message": "Insufficient credits for this operation",
    "details": {
      "required": 10,
      "available": 3
    }
  }
}
```

**Rate Limit Error** (429):
```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded. Try again later.",
    "details": {
      "limit": 100,
      "remaining": 0,
      "reset_at": "2025-11-11T11:00:00Z"
    }
  }
}
```

---

## Internationalization (i18n) Support

**IF** Session 2a marks internationalization (i18n/l10n) as required, document API localization strategy:

### Locale Detection Strategy
**Order of precedence**:
1. Query parameter: `?locale=de-DE` (explicit override)
2. `Accept-Language` header: `Accept-Language: de-DE,de;q=0.9,en;q=0.8`
3. User's saved locale preference (from database)
4. Default locale: `en-US`

### Localized Response Format
- **Content-Language** response header: Indicates response locale
- **Localized error messages**: Use `message_key` + localized `message`
  ```json
  {
    "error": {
      "code": "VALIDATION_ERROR",
      "message_key": "errors.validation.required_field",
      "message": "Dieses Feld ist erforderlich", // German translation
      "field": "email"
    }
  }
  ```

### Locale Fallback Chain
Define fallback strategy for missing translations:
- Example: `de-CH` → `de-DE` → `en-US`
- Regional variant → Language default → System default

**Skip this section if i18n NOT required in constraints.**

---

## Scale-Forward Strategy

### Current (MVP - Launch to First 100 Users)

- **Paradigm**: [Current choice]
- **Format**: [Current choice]
- **Auth**: [Current choice]
- **Rate limits**: [Current tier structure]
- **Pagination**: [Current approach]

**Why**: [2-3 sentences on why this is right for MVP]

---

### Growth (10x Scale - 1,000-10,000 Users)

**Paradigm evolution**:
- [How paradigm scales or evolves]
- Example: Add WebSocket for real-time features if collaboration grows

**Format optimization**:
- [When to introduce binary formats]
- Example: Add MessagePack for internal APIs if throughput becomes bottleneck

**Auth scaling**:
- [How auth scales]
- Example: Move from Clerk to self-hosted OAuth if pricing becomes issue

**Rate limiting**:
- [Adjust limits based on usage patterns]

---

### Maturity (100x Scale - 100,000+ Users)

**Paradigm migration**:
- [Potential migration path]
- Example: Hybrid REST + GraphQL if mobile app needs flexible queries

**Format strategy**:
- [Multi-format support]
- Example: JSON (external) + Protobuf (internal microservices)

**Auth evolution**:
- [Advanced auth needs]
- Example: Add OAuth server for third-party integrations

**Infrastructure**:
- [API gateway, rate limiting infrastructure]
- Example: Kong or AWS API Gateway for advanced routing and rate limiting

---

## What We DIDN'T Choose (And Why)

### API Paradigms Not Chosen

#### GraphQL API
**What**: Query language letting clients request exact data needed
**Why not**: [Journey-based reasoning - cite specific journey steps, architecture, or requirements]
**Reconsider if**: Mobile app needs bandwidth optimization, UI needs highly variable data shapes, 50+ optional fields per entity
**Trace to journey**: [Reference specific journey steps or architecture decisions]

---

#### gRPC API
**What**: High-performance RPC with Protocol Buffers (binary)
**Why not**: [Journey-based reasoning]
**Reconsider if**: Microservices with service-to-service calls, need bidirectional streaming, internal-only APIs, >10K req/sec
**Trace to journey**: [Reference architecture or performance requirements]

---

#### WebSocket for Real-Time
**What**: Persistent bidirectional connection for real-time updates
**Why not**: [Journey-based reasoning]
**Reconsider if**: Need <500ms updates (real-time collab), many users watching same resource, live dashboards
**Trace to journey**: [Reference journey steps and latency needs]

---

### Serialization Formats Not Chosen

#### Protocol Buffers (Protobuf)
**What**: Binary schema-based format (compact, fast, type-safe)
**Why not**: [Journey-based reasoning - cite bandwidth, performance, or readability needs]
**Reconsider if**: Performance bottleneck, mobile bandwidth constraints, microservices with gRPC, >10K req/sec
**Trace to journey**: [Reference journey scale or architecture]

---

#### MessagePack
**What**: Binary JSON alternative (no schema required)
**Why not**: [Journey-based reasoning]
**Reconsider if**: Need binary format but no schema, cache optimization, internal APIs, IoT devices
**Trace to journey**: [Reference architecture or client types]

---

#### XML
**What**: Verbose text format with schema (SOAP legacy)
**Why not**: [Journey-based reasoning]
**Reconsider if**: Legacy system integration, enterprise SOAP requirements, XML-based third-party APIs
**Trace to journey**: [Reference integration requirements]

---

### Other Alternatives Not Chosen

#### Header-Based API Versioning
**What**: Version in `Accept: application/vnd.myapi.v2+json` header
**Why not**: [Reasoning]
**Reconsider if**: Building hypermedia API (HATEOAS), version applies to entire surface

---

#### Full OAuth 2.0 Server
**What**: OAuth with authorization code flow, client credentials, refresh tokens
**Why not**: [Reasoning]
**Reconsider if**: Building platform with third-party apps (Slack/GitHub-style), need programmatic API access

---

#### API Gateway (Kong, AWS API Gateway)
**What**: Centralized gateway for rate limiting, auth, logging, routing
**Why not**: [Reasoning]
**Reconsider if**: Microservices architecture, advanced rate limiting needs, detailed API analytics

---

## Validation Checklist

Before considering this session complete:

**Journey Alignment**:
- [ ] API paradigm decision traces to specific journey steps
- [ ] Serialization format aligns with performance/bandwidth needs from journey
- [ ] Authentication strategy matches journey security requirements
- [ ] Rate limiting aligns with pricing model and journey scale
- [ ] Pagination approach fits data volume and UX needs

**Decision Traceability**:
- [ ] Each decision cites journey steps, tech stack (Session 3), or architecture (Session 4)
- [ ] Paradigm choice references at least 3 of 5 decision criteria
- [ ] Serialization format references paradigm alignment
- [ ] No decisions are arbitrary or "best practice" without reasoning

**Completeness**:
- [ ] All 5 API paradigm criteria analyzed
- [ ] All 5+ serialization format criteria analyzed
- [ ] Authentication includes method, placement, lifetime, authorization patterns
- [ ] Rate limiting includes limits by tier and endpoint-specific rules
- [ ] Pagination includes approach, format, and when to use
- [ ] Error handling includes format, status codes, and journey-based design
- [ ] Scale-forward strategy for MVP → Growth → Maturity

**Technical Quality**:
- [ ] Paradigm choice matches tech stack capabilities (Session 3)
- [ ] Serialization format compatible with paradigm
- [ ] Auth method from tech stack implemented correctly
- [ ] Rate limiting prevents abuse without hindering UX
- [ ] Error format actionable and user-friendly

**Documentation**:
- [ ] "What We DIDN'T Choose" section complete (3+ paradigm + 3+ format alternatives)
- [ ] Each alternative has "Reconsider if" conditions
- [ ] Each alternative traces back to journey or architecture
- [ ] Scale-forward strategy explains evolution path

---

## Next Steps

After completing this file:
1. Run `/generate-api-contracts` (Session 8b) to create technical implementation
2. Session 8b will read this file to implement paradigm and serialization decisions
3. Session 10 (backlog) will read `08-api-design.ctx.md` for API-driven stories
