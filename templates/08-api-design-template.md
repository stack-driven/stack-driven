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

## Security Protection Patterns (OWASP API Top 10 2023)

**Reference**: `reference-material/owasp-api-security-2023-checklist.md`

Document protection patterns for applicable OWASP API Security Top 10 2023 risks based on your journey requirements.

### API1:2023 - Broken Object Level Authorization (BOLA)

**Applicability**: [YES / NO]

**Journey Analysis**:
- Journey Step [X]: [Specific resource access scenario]
- Database tables with user ownership: [List from Session 7]
- Example: "Journey Step 2 (document upload) creates user-owned documents in `documents` table"

**Protection Pattern**:
- Ownership check: `WHERE user_id = :current_user_id`
- Affected endpoints:
  - GET /api/documents/:id
  - PUT /api/documents/:id
  - DELETE /api/documents/:id

**Reconsider if**: Multi-tenant features added, team-shared resources introduced

---

### API3:2023 - Broken Object Property Level Authorization

**Applicability**: [YES / NO]

**Journey Analysis**:
- Sensitive fields in database schema: [List from Session 7 - e.g., `ssn`, `payment_info`, `internal_notes`]
- User roles: [Admin / User / Owner / Public]

**Protection Pattern**:
- Admin response fields: [All fields including sensitive data]
- User response fields: [Limited fields, no PII]
- Public response fields: [Minimal fields only]
- Field-level filtering: [How implemented - serializers, DTOs, response mappers]

**Reconsider if**: New sensitive fields added (payment info, health data, SSN), compliance requirements change (GDPR, HIPAA)

---

### API5:2023 - Broken Function Level Authorization (BFLA)

**Applicability**: [YES / NO]

**Journey Analysis**:
- Admin-only endpoints: [List endpoints that require admin role]
- Owner-only endpoints: [List endpoints that require resource ownership]
- Public endpoints: [List endpoints with no auth required]

**Protection Pattern**:
- Admin check: `if user.role != 'admin': return 403 Forbidden`
- Owner check: `if resource.owner_id != current_user_id: return 403 Forbidden`
- Role enforcement: [Middleware / decorator / route guard]

**Reconsider if**: New admin features added, team hierarchy introduced (owner > admin > member)

---

### API6:2023 - Unrestricted Access to Sensitive Business Flows

**Applicability**: [YES / NO]

**Journey Analysis**:
- Sensitive business flows: [password reset / order creation / invitations / refunds / etc.]
- Abuse scenarios: [fraud / spam / account enumeration]

**Protection Pattern**:
- Endpoint: POST /api/auth/password-reset
  - Limit: 3 attempts per email per hour
  - Reason: Prevent email enumeration
- Endpoint: POST /api/orders
  - Limit: 10 orders per user per day
  - Reason: Prevent fraudulent orders
- Endpoint: POST /api/teams/:id/invitations
  - Limit: 50 invitations per team per day
  - Reason: Prevent invitation spam

**Reconsider if**: Payment processing added, invitation system introduced, account recovery flows implemented

---

### API7:2023 - Server-Side Request Forgery (SSRF)

**Applicability**: [YES / NO]

**Journey Analysis**:
- User-provided URLs accepted: [webhooks / file imports / third-party integrations / none]
- Internal services: [List from Session 4 architecture - databases, caches, internal APIs]

**Protection Pattern**:
- URL validation: HTTPS required, HTTP blocked
- Blocked IP ranges: 127.0.0.1, 10.0.0.0/8, 192.168.0.0/16, 169.254.0.0/16 (internal networks)
- Domain allowlist: [Specific domains if applicable OR "No allowlist - validate only"]
- Validation library: [URL parsing library from tech stack]

**Reconsider if**: Webhook system added, file import from URLs introduced, third-party integrations allow URL configuration

---

### API8:2023 - Security Misconfiguration

**Applicability**: YES (always applicable)

**Required Security Headers** (on ALL responses):
```http
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: [DENY / SAMEORIGIN]
Content-Security-Policy: [default-src 'self' / custom policy]
X-Request-ID: [UUID for request tracing]
```

**Journey-Based Header Configuration**:
- `X-Frame-Options`: [DENY for API-only / SAMEORIGIN if web app embeds API]
- `Content-Security-Policy`: [Journey-specific CSP policy]

**Disabled Endpoints**:
- [List any default endpoints to disable: /admin, /debug, /metrics, /health if not needed]

**Journey-Based Reasoning**:
[Why these headers matter for your journey - e.g., "Web-based journey requires CSP to prevent XSS attacks"]

---

### API10:2023 - Unsafe Consumption of APIs

**Applicability**: [YES / NO]

**Journey Analysis**:
- Third-party APIs consumed: [Payment gateway / AI service / Analytics / Email service / etc.]
- Journey steps affected: [Which steps depend on third-party APIs]

**Protection Pattern**:
- API: [Third-party API name, e.g., "OpenAI GPT-4"]
  - Timeout: [5-30 seconds depending on operation]
  - Circuit breaker: Open after [5] consecutive failures
  - Half-open retry: After [30 seconds]
  - Fallback: [Return cached data / degraded response / user-facing error message]
  - Journey context: [Journey Step X depends on this API]

**Reconsider if**: Third-party integrations added (payment gateways, AI services, analytics), webhook consumption from external sources

---

## Idempotency and Retry Strategies

Document idempotency protection and retry guidance for operations that require resilience against network failures and service disruptions.

### Idempotency-Protected Endpoints

**Pattern**: Idempotency-Key header for POST/PATCH operations

#### Financial Operations (CRITICAL)
- Endpoint: POST /api/payments
  - Idempotency-Key: Required
  - Expiry: 24 hours
  - Journey context: [Journey Step X: payment processing]
  - Duplicate prevention: [How idempotency prevents duplicate charges]

#### Resource Creation
- Endpoint: POST /api/orders
  - Idempotency-Key: Required
  - Journey context: [Journey Step X: order placement]
  - Expiry: 24 hours
- Endpoint: POST /api/documents
  - Idempotency-Key: Recommended
  - Journey context: [Journey Step X: document upload]
  - Expiry: 1 hour

**Implementation Requirements**:
- Idempotency store: [Redis / Database table `idempotency_keys`]
- Key format: UUIDv4 (client-generated)
- Response caching: Store full HTTP response (status code, headers, body)
- Expiry: [24 hours for financial, 1 hour for non-financial, configurable per endpoint]

### Retry Strategy

**Retry-After Header Usage**:
- 429 Too Many Requests: Include `Retry-After` header (seconds until reset)
- 503 Service Unavailable: Include `Retry-After` header (estimated recovery time)
- 202 Accepted (async): Include `Retry-After` header (polling interval)

**Client Retry Guidance**:
- Exponential backoff: 1s, 2s, 4s, 8s, 16s (max 60s)
- Max retries: 5 attempts
- Jitter: Random 0-1s to prevent thundering herd

**Journey-Based Retry Design**:

**Rate-Limited Endpoints** (429):
- Response includes: `Retry-After` header + `retry_after_seconds` in error body
- Client behavior: Wait specified time before retry
- Journey context: [Which endpoints have strict rate limits?]

**Temporarily Unavailable** (503):
- Response includes: `Retry-After: 30` (maintenance, overload)
- Client behavior: Exponential backoff (30s, 60s, 120s)
- Journey context: [Which journey steps tolerate temporary downtime?]

**Async Operations** (202):
- Response includes: `Retry-After: 5` (polling interval)
- Client behavior: Poll at specified interval until completion (200/201)
- Journey context: [Journey Step X: AI document processing takes 2-5min]

### Circuit Breaker Configuration

**Third-Party API Protection**:

#### [Third-Party API Name, e.g., "Stripe Payment API"]
- Journey Step: [Which step depends on this API]
- Timeout: [5-30 seconds]
- Circuit: Open after [5] consecutive failures
- Half-open retry: After [30-60 seconds]
- Fallback: [Return cached data / degraded response / user error message]
- Reasoning: [Why this configuration serves the journey]

**Implementation Requirements**:
- Circuit breaker library: [Polly (.NET) / resilience4j (Java) / circuitbreaker (Python) / opossum (Node.js)]
- Metrics: Track failure rate, circuit state, fallback usage (for Session 14 observability)
- Alerting: Notify team when circuit opens (indicates third-party degradation)

### Journey-Based Reasoning

[3-5 sentences tracing idempotency, retry, and circuit breaker strategies to:
- Journey operations requiring idempotency (payments, orders, mutations)
- Journey steps tolerating retries (async operations, non-critical actions)
- Third-party dependencies from Session 4 architecture
- User experience impact (prevent duplicate charges, handle downtime gracefully)]

---

## Input Validation Strategy

Document server-side validation for ALL user input based on journey requirements and database schema.

### Validation Approach

**API Paradigm**: [REST / GraphQL / gRPC] (from paradigm decision)
**Validation Library**: [Pydantic / Joi / Zod / class-validator / AJV] (from Session 3 tech stack)

**Journey-Based Selection Reasoning**:
[Why this library matches your tech stack - e.g., "FastAPI backend uses Pydantic for automatic request validation"]

### Validation Rules by Input Type

#### Email Addresses
- **Format**: RFC 5322 (`\S+@\S+\.\S+`)
- **Max length**: 254 characters
- **Normalization**: Lowercase
- **Journey context**: [Which journey steps use email input - e.g., "Journey Step 1: User registration form"]

#### URLs
- **Protocol**: HTTPS required (HTTP for dev only)
- **Domain allowlist**: [Specific domains OR "Any HTTPS domain"]
- **Block internal IPs**: YES (SSRF protection - 127.0.0.1, 10.0.0.0/8, 192.168.0.0/16)
- **Max length**: 2048 characters
- **Journey context**: [Which journey steps accept URLs - e.g., "Journey Step 4: Webhook subscription"]

#### Phone Numbers
- **Format**: E.164 (+1234567890)
- **Validation library**: libphonenumber
- **Journey context**: [If journey requires phone numbers]

#### Dates/Timestamps
- **Format**: ISO 8601 (YYYY-MM-DDTHH:MM:SSZ)
- **Range**: [1900-2100] or journey-specific range
- **Timezone**: Store in UTC, convert to user timezone
- **Journey context**: [Which journey steps use dates]

#### File Uploads
- **Allowed MIME types**: [application/pdf, image/jpeg, image/png, etc.]
- **Max file size**: [10MB / 50MB / etc.]
- **File extension validation**: Double-check (don't trust client-side extension)
- **Virus scanning**: [YES - ClamAV / VirusTotal API / NO]
- **Storage sanitization**: Rename uploaded files (prevent directory traversal)
- **Journey context**: [Journey Step X: document upload → PDF only, 10MB max, virus scan required]

#### Strings (General Text Input)
- **Max length**: [255 for names, 5000 for descriptions, journey-specific]
- **Min length**: [Prevent empty inputs - e.g., min 3 chars for search queries]
- **Pattern**: [Alphanumeric only / Allow spaces / Regex for specific format]
- **Trim**: Remove leading/trailing whitespace
- **Journey context**: [Which fields accept text input]

#### Numbers (Integers/Floats)
- **Type**: Integer or Float
- **Range**: Min/max values (e.g., quantity: 1-1000, price: 0.01-999999.99)
- **Precision**: For decimals (e.g., currency: 2 decimal places)
- **Journey context**: [Which journey steps use numeric input]

#### UUIDs
- **Format**: UUIDv4 or UUIDv7
- **Validation**: Regex or library validation
- **Journey context**: [Which resources use UUID identifiers]

### Sanitization Strategy

#### HTML Input
- **Approach**: [Strip all tags / Allowlist safe tags (<b>, <i>, <a>, <p>)]
- **Library**: [DOMPurify / bleach / sanitize-html] (from tech stack)
- **Journey context**: [Which fields allow rich text - e.g., "Comment fields allow basic formatting"]

#### SQL Injection Prevention
- **Method**: Parameterized queries (ALWAYS, NEVER string concatenation)
- **ORM**: [Prisma / TypeORM / SQLAlchemy / Sequelize] (from Session 3 tech stack)
- **Journey-Based Reasoning**: All database queries use ORM with parameterized queries

#### Command Injection Prevention
- **Rule**: NEVER pass user input to shell commands
- **Alternative**: Use libraries instead of shell commands (e.g., use `fs` module, not `exec('cat file')`)
- **Journey context**: [If journey requires file operations, image processing, etc.]

#### Path Traversal Prevention
- **Rule**: Validate all file paths, use allowlist for directories
- **Pattern**: Reject `../`, `..\\`, absolute paths
- **Journey context**: [If journey involves file operations]

### Journey-Based Validation Reasoning

[3-5 sentences tracing validation strategy to:
- Journey input scenarios (forms, uploads, search, filters)
- Database schema input types (Session 7 - which fields accept user input)
- Security requirements (prevent SQL injection, XSS, file upload attacks, DoS via large inputs)]

**Example**: "Journey Step 2 (document upload) requires strict file validation: only PDF/DOCX allowed (MIME type check), max 10MB (prevent DoS), virus scanning with ClamAV (prevent malware). Journey Step 3 (search documents) requires input sanitization: max 500 chars (prevent DoS), trim whitespace, escape SQL (parameterized queries via Prisma ORM)."

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

## HTTP Caching Strategy

**Note**: Only applicable for REST or HTTP-based APIs. GraphQL has its own caching strategy (persisted queries), gRPC uses different mechanisms.

### Cache Strategy by Resource Type

**Public Content** (cacheable by CDN):
- **Resources**: [List from journey - e.g., GET /api/frameworks, GET /public/reports/:token]
- **Cache-Control**: public, max-age=[3600 / 86400]
- **ETag**: [YES / NO]
- **Journey context**: [Which journey steps access this? How often does content change?]
- **Reasoning**: [Why public caching benefits the journey - e.g., "Framework list accessed by 10,000 users monthly, updated weekly → CDN caching reduces origin load"]

**Private Content** (browser cache only):
- **Resources**: [List from journey - e.g., GET /api/documents/:id, GET /api/users/me]
- **Cache-Control**: private, max-age=[300 / 600]
- **ETag**: [YES / NO]
- **Journey context**: [Which journey steps access user-specific data?]
- **Reasoning**: [Why browser-only caching serves the journey - e.g., "User document metadata changes infrequently → Browser caching for 5 min reduces API calls without exposing private data to CDN"]

**Sensitive Data** (no caching):
- **Resources**: [List from journey - e.g., POST /api/payments, GET /api/users/:id/payment-methods]
- **Cache-Control**: no-store
- **Journey context**: [Which journey steps involve financial/PII data?]
- **Reasoning**: [Security requirement from journey - e.g., "Payment processing involves sensitive financial data → no-store prevents any caching (browser, proxy, CDN)"]

**Dynamic Content** (validate before use):
- **Resources**: [List from journey - e.g., GET /api/dashboards/live]
- **Cache-Control**: no-cache, must-revalidate
- **Journey context**: [Which journey steps require fresh data?]
- **Reasoning**: [Journey real-time requirement - e.g., "Live dashboard shows real-time metrics → must-revalidate ensures users see current data"]

### ETag Implementation

**ETag Generation Strategy**: [Content hash / Version number / Timestamp / Composite]

**Journey-Based ETag Usage**:
- **Resource**: GET /api/[resource]
  - **ETag format**: [Example: "v1-abc123" / "resource-123-20250201T103000Z"]
  - **Generation method**: [Hash of response body / Database version column / updated_at timestamp / Composite ID+timestamp]
  - **Journey reasoning**: [Why this ETag strategy serves the journey]

**Example**:
```
Resource: GET /api/frameworks
- ETag format: "frameworks-v1-20250201"
- Generation: Hash of framework list JSON
- Why: Framework list is small (50KB), updates weekly → Hash generation cost is minimal, provides accurate cache validation
```

**Conditional Request Flow**:
1. Client requests resource → Server returns 200 OK + ETag header
2. Client caches response with ETag value
3. Cache expires (based on max-age) → Client sends If-None-Match: [ETag]
4. Resource unchanged → Server returns 304 Not Modified (no body → saves bandwidth)
5. Resource changed → Server returns 200 OK + new ETag + updated response body

**Journey-Based ETag Reasoning**:
[2-3 sentences explaining which resources benefit from ETags based on:
- Response size (large responses benefit more from 304 Not Modified)
- Update frequency (frequently updated resources need efficient revalidation)
- Access patterns (high-traffic endpoints benefit from bandwidth savings)]

### Compression Configuration

**Response Size Thresholds**:
- **<1KB**: No compression (overhead not worth it)
- **1KB-100KB**: gzip (widely supported, good compression ratio)
- **>100KB**: Brotli (better compression than gzip, supported by modern browsers)

**Content-Type Compression Map**:
- **application/json**: Compress with Brotli/gzip (typical 70-90% reduction)
- **text/html**: Compress with Brotli/gzip
- **text/css, text/javascript**: Compress with Brotli/gzip
- **image/jpeg, image/png**: No compression (already compressed formats)
- **application/pdf**: No compression (already compressed)
- **video/mp4**: No compression (already compressed)
- **[Other content types from journey]**: [Compress or not? Why?]

**Journey-Based Compression Examples**:

**Journey Step [X]**: [Resource description]
- **Response size**: [50KB uncompressed]
- **Content-Type**: [application/json]
- **Compression**: Brotli (50KB → 10KB = 80% reduction)
- **Journey reasoning**: [Mobile users in APAC region → Bandwidth savings critical for user experience]

**Journey Step [Y]**: [Resource description]
- **Response size**: [500 bytes]
- **Content-Type**: [application/json]
- **Compression**: None (<1KB threshold)
- **Journey reasoning**: [Small response, compression overhead exceeds benefit]

### Journey-Based Caching Reasoning

[3-5 sentences tracing HTTP caching strategy to:
- **Journey resource access patterns**: Which steps read which resources? How often?
- **Data update frequency**: From Session 7 database schema and journey flows (e.g., "documents table: immutable after upload → Cache-Control: private, max-age=3600")
- **Bandwidth constraints**: Mobile users? Global access? CDN benefits?
- **Security requirements**: Public vs private vs sensitive data (from journey and Session 4 architecture)
- **Performance goals**: Session 4 metrics (response time targets, concurrent user load, cost optimization)]

**Example**: "Journey Step 2 (view compliance frameworks) accesses public framework list updated weekly (from Session 7: frameworks table has weekly sync job) → Cache-Control: public, max-age=3600 enables CDN edge caching → Reduces origin server load by 70% for 10,000 monthly users globally. Journey Step 3 (view private documents) returns user-owned document metadata (Session 7: documents table, user_id ownership) → Cache-Control: private, max-age=300 allows browser caching without exposing private data to CDN. Brotli compression on JSON responses reduces average 50KB framework list to 10KB → 80% bandwidth savings critical for mobile users in APAC region identified in journey behavioral profile (Session 1: 40% mobile traffic, 30% from low-bandwidth regions)."

### Performance Impact

**Metrics to Track** (link to Session 14 observability):
- **Cache hit rate**: % of requests served from cache (target: 60-80% for public content)
- **Bandwidth savings**: MB saved via caching + compression (target: 70-80% reduction)
- **304 Not Modified rate**: % of revalidations that skip body transfer (target: 40-60% for ETags)
- **Average response size**: Before/after compression (track compression ratio)
- **Origin server load reduction**: Requests avoided via caching (% reduction in origin traffic)

**Journey-Based Performance Targets**:
- **Journey Step [X]** (public content):
  - Cache hit rate: [70%] (CDN edge serving)
  - Origin load reduction: [70%] of requests
- **Journey Step [Y]** (private content):
  - 304 rate: [50%] (ETag revalidation)
  - Bandwidth savings: [80%] (Brotli compression)

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
```http
HTTP/1.1 429 Too Many Requests
Retry-After: 60
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1699315200

{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded. Please retry after 60 seconds.",
    "retry_after_seconds": 60,
    "request_id": "req_abc123"
  }
}
```

**Service Unavailable Error** (503):
```http
HTTP/1.1 503 Service Unavailable
Retry-After: 30

{
  "error": {
    "code": "SERVICE_TEMPORARILY_UNAVAILABLE",
    "message": "Service temporarily unavailable. Please retry after 30 seconds.",
    "retry_after_seconds": 30,
    "request_id": "req_abc123"
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
- [ ] Security patterns reference specific journey steps and database tables
- [ ] Rate limiting aligns with pricing model and journey scale
- [ ] Pagination approach fits data volume and UX needs

**Decision Traceability**:
- [ ] Each decision cites journey steps, tech stack (Session 3), or architecture (Session 4)
- [ ] Paradigm choice references at least 3 of 5 decision criteria
- [ ] Serialization format references paradigm alignment
- [ ] OWASP patterns cite journey steps or database schema (Session 7)
- [ ] Input validation traces to journey input scenarios
- [ ] No decisions are arbitrary or "best practice" without reasoning

**Completeness**:
- [ ] All 5 API paradigm criteria analyzed
- [ ] All 5+ serialization format criteria analyzed
- [ ] Authentication includes method, placement, lifetime, authorization patterns
- [ ] OWASP API Top 10 protection patterns documented for applicable risks
- [ ] Input validation strategy includes paradigm-specific approach and sanitization
- [ ] Security headers documented (HSTS, X-Content-Type-Options, X-Frame-Options, CSP)
- [ ] Rate limiting includes limits by tier and endpoint-specific rules
- [ ] Pagination includes approach, format, and when to use
- [ ] HTTP caching strategy documented (if REST/HTTP-based paradigm)
- [ ] Error handling includes format, status codes, and journey-based design
- [ ] Scale-forward strategy for MVP → Growth → Maturity

**Security Coverage (OWASP API Top 10 2023)**:
- [ ] API1 (BOLA) - Analyzed for user-owned resources
- [ ] API3 (Property-Level Auth) - Analyzed for sensitive fields
- [ ] API5 (BFLA) - Analyzed for admin/owner endpoints
- [ ] API6 (Business Flows) - Analyzed for abuse scenarios (password reset, orders, invitations)
- [ ] API7 (SSRF) - Analyzed for user-provided URLs
- [ ] API8 (Security Misconfiguration) - Security headers documented
- [ ] API10 (Unsafe API Consumption) - Analyzed for third-party API dependencies
- [ ] Input validation strategy complete with sanitization rules

**Technical Quality**:
- [ ] Paradigm choice matches tech stack capabilities (Session 3)
- [ ] Serialization format compatible with paradigm
- [ ] Auth method from tech stack implemented correctly
- [ ] Security patterns are journey-specific (not generic security advice)
- [ ] Validation library matches tech stack (from Session 3)
- [ ] Rate limiting prevents abuse without hindering UX
- [ ] Error format actionable and user-friendly

**Documentation**:
- [ ] "What We DIDN'T Choose" section complete (3+ paradigm + 3+ format alternatives)
- [ ] Each alternative has "Reconsider if" conditions
- [ ] Each alternative traces back to journey or architecture
- [ ] Scale-forward strategy explains evolution path
- [ ] Security patterns preserved in context file for Session 10

---

## Next Steps

After completing this file:
1. Run `/generate-api-contracts` (Session 8b) to create technical implementation
2. Session 8b will read this file to implement paradigm and serialization decisions
3. Session 10 (backlog) will read `08-api-design.ctx.md` for API-driven stories
