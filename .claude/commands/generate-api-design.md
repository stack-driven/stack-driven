---
description: Session 8 - High-level API architectural decisions (paradigm, serialization, auth, rate limiting)
---

# Generate API Design (Session 8)

You are helping the user make high-level API architectural decisions including API paradigm choice (REST, GraphQL, gRPC, WebSocket, hybrid), serialization format (JSON, Protobuf, MessagePack), authentication strategy, rate limiting, pagination, and error handling philosophy. This happens after defining the database schema (Session 7) and BEFORE generating technical API contracts (Session 8b).

## When to Use This

**This is Session 8** in the core Stack-Driven cascade. Run it:
- After Session 7 (`/design-database-schema` - data model)
- Before Session 8b (`/generate-api-contracts` - technical implementation)
- When you need to make architectural API decisions based on journey requirements

**Skip this** if:
- You're building a frontend-only application (no backend)
- Your product doesn't expose APIs
- You prefer to evolve API architecture incrementally during development

## Your Task

Make high-level API architectural decisions:
- API Paradigm Choice (REST, GraphQL, gRPC, WebSocket, hybrid)
- Serialization Format (JSON, Protobuf, MessagePack, hybrid)
- Journey-based reasoning for all decisions
- Authentication strategy (method, token placement, lifetime)
- Rate limiting strategy (per-user/team, limits by tier)
- Pagination approach (cursor vs offset)
- Error handling philosophy (standard format, status codes)
- Scale-forward strategy (how to evolve as needs grow)

---

## Process

### Step 1: Read Previous Outputs

**Required inputs:**

```
Read: product-guidelines/00-user-journey.ctx.md  # (context version for token efficiency)
Read: product-guidelines/02-tech-stack.ctx.md  # (context version for token efficiency)
Read: product-guidelines/04-architecture.ctx.md  # (context version for token efficiency)
Read: product-guidelines/07-database-schema.ctx.md  # (context version for token efficiency)
```

**Context Optimization**: We read .ctx.md files for significant context reduction. The database schema context file (~56% smaller) contains table list, ERD, relationships, and data access patterns—sufficient for API design without column details, indexes, and migrations.

**Extract from Journey**:
- What user actions require API endpoints?
- What are the critical path operations and their latency requirements?
- Are there real-time collaboration features? (<1s updates)
- Are there async operations? (30s-5min: document processing, AI analysis)
- What integration points exist with external systems?
- What are the bandwidth constraints? (mobile, embedded)
- What is the scale? (requests/day, concurrent users)

**Extract from Tech Stack**:
- Backend framework (FastAPI, Express, NestJS, Django, etc.)
- Authentication method (JWT, OAuth, API keys, Clerk, Auth0)
- Current API style preference (if any): REST, GraphQL, gRPC
- Documentation tools (Swagger UI, Redoc, Postman)

**Extract from Architecture**:
- Is this a monolith or microservices?
- Are there service-to-service calls (internal APIs)?
- Are there third-party integrations (external APIs)?
- What are the security requirements?
- What is the caching strategy?
- What is the multi-tenancy implementation?

**Extract from Database Schema (required):**
- What entities exist?
- What relationships need API exposure?
- What query patterns are expected?

**Example**: compliance-saas journey → Document upload (async processing), framework selection (simple CRUD), assessment results (polling), report sharing (public access) → Need: REST (simple), JSON (universal), JWT auth, multi-tenant filtering

---

### Step 2: Analyze API Paradigm Requirements

**Decision Tree - API Paradigm (5 Points):**

Analyze the journey and tech stack to determine the optimal API paradigm:

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

3. Check architecture (Session 3 Tech Stack + Session 4 Architecture):
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

**IMPORTANT - Journey Traceability:**
- For EACH criterion you evaluate, cite specific journey steps, metrics, or architecture decisions
- Example: "Journey Step 2 (document upload → assessment) has 2-4min processing → REST with polling (not WebSocket)"
- Example: "Journey has no mobile app (desktop web only) → No bandwidth constraints → REST sufficient (not GraphQL)"
- Example: "Architecture chose monolith (Session 4) → No service-to-service calls → REST (not gRPC)"

**Output Format:**

```markdown
## API Paradigm Decision

### Chosen Paradigm: [REST / GraphQL / gRPC / WebSocket / Hybrid]

### Journey-Based Analysis:

1. **Real-time requirements**: [Analysis with journey citation]
   - [Finding with journey step reference]

2. **Data fetching flexibility**: [Analysis with journey citation]
   - [Finding with journey step reference]

3. **Architecture**: [Analysis with architecture reference]
   - [Finding with Session 4 reference]

4. **Third-party integrations**: [Analysis with product strategy reference]
   - [Finding with Session 2 reference]

5. **Performance requirements**: [Analysis with metrics reference]
   - [Finding with journey or Session 4 reference]

### Recommendation: [Paradigm]

**Reasoning**: [2-3 sentences tracing decision to journey steps, architecture, and requirements]

**Scale-Forward Strategy**: [How this paradigm evolves as needs grow]
```

---

### Step 2a: Define REST Design Patterns (Conditional)

**ONLY execute this step if API paradigm decision = REST.**

If you chose GraphQL, gRPC, or WebSocket as the primary paradigm, skip this step and proceed to Step 3.

**Purpose**: Define RESTful API design conventions to ensure consistency, discoverability, and adherence to REST principles.

**Decision Tree - REST Design Patterns:**

```
1. Resource Naming Conventions
   ├─ Collections: Plural nouns (/users, /orders, /documents)
   ├─ Single resource: /{collection}/{id} (/users/123, /orders/456)
   ├─ Nested resources: /{parent}/{id}/{child} (/teams/5/members, /orders/123/items)
   └─ Actions: Avoid verbs in URLs, use HTTP verbs instead
      - Bad: POST /createUser, GET /getUsers
      - Good: POST /users, GET /users

2. HTTP Verb Usage and Idempotency Semantics
   ├─ GET: Retrieve resource (idempotent, safe, cacheable)
      - Returns 200 OK with resource
      - Returns 404 Not Found if resource doesn't exist
   ├─ POST: Create resource (NOT idempotent without Idempotency-Key)
      - Returns 201 Created with Location header
      - Use Idempotency-Key header to make idempotent
   ├─ PUT: Replace entire resource (idempotent)
      - Returns 200 OK or 204 No Content
      - Requires ALL fields (full replacement)
   ├─ PATCH: Partial update (idempotent with Idempotency-Key)
      - Returns 200 OK
      - Requires only changed fields
      - Use Idempotency-Key to prevent duplicate updates
   └─ DELETE: Remove resource (idempotent)
      - Returns 204 No Content or 200 OK
      - Subsequent DELETE of same resource returns 404

3. Query Parameter Standards
   ├─ Filtering: ?status=active&role=admin
      - Use field names as keys
      - Multiple values: ?tag=security&tag=compliance OR ?tag=security,compliance
   ├─ Sorting: ?sort=-created_at,name
      - Comma-separated fields
      - Prefix with - for descending order
      - No prefix or + for ascending order
   ├─ Field Selection (Sparse Fieldsets): ?fields=id,name,email
      - Comma-separated field names
      - Returns only requested fields (reduces bandwidth)
   ├─ Search: ?q=search+term OR ?search=query
      - Full-text search across multiple fields
   └─ Pagination: ?page=1&limit=20 OR ?cursor=abc&limit=20
      - Covered in Step 5 (pagination strategy)

4. Response Envelope Consistency
   ├─ Single resource: Return object directly {id: 123, name: "..."}
   ├─ Collection: Return array with metadata {data: [...], pagination: {...}}
   └─ Errors: Standard format {error: {code, message, details}}
```

**Journey-Based REST Pattern Analysis:**

For each REST convention, trace to journey requirements:

**Resource Naming**:
- Which journey steps access resources? (from Session 1)
- What entities exist? (from Session 7 database schema)
- Are there nested relationships? (teams → members, orders → items)

**Example**: "Journey Step 2 (upload document) creates documents resource → POST /api/documents. Journey Step 4 (share with team) creates nested relationship → GET /api/teams/:id/shared-documents"

**HTTP Verb Usage**:
- Which journey steps create resources? (POST)
- Which journey steps update resources? (PATCH for partial, PUT for full replacement)
- Which journey steps require idempotency? (payments, orders → Idempotency-Key)

**Example**: "Journey Step 5 (update document metadata) only changes title, not content → PATCH /api/documents/:id (partial update). Journey Step 7 (process payment) cannot duplicate → POST /api/payments with Idempotency-Key"

**Query Parameters**:
- Which journey steps filter data? (search, dashboards)
- Which journey steps sort data? (lists, tables)
- Which journey steps need selective fields? (mobile apps with bandwidth constraints)

**Example**: "Journey Step 3 (filter documents by status) → GET /api/documents?status=approved&sort=-created_at. Journey Step 6 (mobile document list) → GET /api/documents?fields=id,title,created_at (reduce bandwidth)"

**Output Format:**

```markdown
## REST Design Patterns

**Note**: This section applies because API paradigm chosen = REST (from Step 2).

### Resource Naming Conventions

**Collections** (plural nouns):
- `/users` - User collection
- `/documents` - Document collection
- `/teams` - Team collection
- [List other collections from journey and Session 7 database schema]

**Single Resources** (ID in path):
- `/users/:id` - Specific user
- `/documents/:id` - Specific document
- `/teams/:id` - Specific team

**Nested Resources** (parent-child relationships):
- `/teams/:teamId/members` - Team members (nested under team)
- `/documents/:docId/versions` - Document versions (nested under document)
- [List other nested resources from Session 7 relationships]

**Journey-Based Reasoning**:
[2-3 sentences tracing resource naming to journey steps and database schema]

Example: "Journey Step 2 creates user-owned documents → `/users/:userId/documents` resource. Session 7 database schema defines teams → members relationship → `/teams/:teamId/members` endpoint for Journey Step 4 (invite team members)."

---

### HTTP Verb Usage

**GET** (Retrieve, idempotent, safe, cacheable):
- `GET /documents` - List documents
- `GET /documents/:id` - Get single document
- **Journey context**: [Which journey steps read data?]

**POST** (Create, NOT idempotent without Idempotency-Key):
- `POST /documents` - Create document
- **Returns**: 201 Created + Location header
- **Idempotency**: Use Idempotency-Key for financial/critical operations
- **Journey context**: [Which journey steps create resources? Which require idempotency?]

**PUT** (Replace entire resource, idempotent):
- `PUT /documents/:id` - Replace document (requires ALL fields)
- **Returns**: 200 OK or 204 No Content
- **Journey context**: [Which journey steps replace entire resources?]

**PATCH** (Partial update, idempotent with key):
- `PATCH /documents/:id` - Update specific fields
- **Returns**: 200 OK
- **Idempotency**: Use Idempotency-Key for critical updates
- **Journey context**: [Which journey steps update partial fields?]

**DELETE** (Remove resource, idempotent):
- `DELETE /documents/:id` - Delete document
- **Returns**: 204 No Content or 200 OK
- **Journey context**: [Which journey steps delete resources?]

**Journey-Based Reasoning**:
[3-4 sentences tracing HTTP verb usage to journey operations]

Example: "Journey Step 2 (upload document) creates new resource → POST /documents (201 Created). Journey Step 5 (update document title) only changes one field → PATCH /documents/:id (partial update). Journey Step 7 (process payment) cannot duplicate → POST /payments with Idempotency-Key (see Step 6a for full idempotency strategy)."

---

### Query Parameter Standards

**Filtering** (narrow results):
- Pattern: `?{field}={value}&{field2}={value2}`
- Examples:
  - `GET /documents?status=approved&category=compliance`
  - `GET /users?role=admin&active=true`
- Multiple values: `?tag=security&tag=compliance` OR `?tag=security,compliance`
- **Journey context**: [Which journey steps filter data? What filters are needed?]

**Sorting** (order results):
- Pattern: `?sort={field1},{field2}` (ascending) or `?sort=-{field1}` (descending)
- Examples:
  - `GET /documents?sort=-created_at` (newest first)
  - `GET /documents?sort=title,-updated_at` (title A-Z, then newest)
- **Journey context**: [Which journey steps sort data? Default sort order?]

**Field Selection** (sparse fieldsets, reduce bandwidth):
- Pattern: `?fields={field1},{field2},{field3}`
- Examples:
  - `GET /documents?fields=id,title,created_at` (minimal fields for list view)
  - `GET /users?fields=id,name,email` (exclude sensitive fields)
- **Journey context**: [Which journey steps need selective fields? Mobile bandwidth constraints?]

**Search** (full-text search):
- Pattern: `?q={search_term}` OR `?search={query}`
- Examples:
  - `GET /documents?q=compliance+framework`
  - `GET /users?search=john+doe`
- **Journey context**: [Which journey steps search across multiple fields?]

**Journey-Based Reasoning**:
[3-4 sentences tracing query parameters to journey search, filtering, and bandwidth needs]

Example: "Journey Step 3 (filter documents by status and category) → `/documents?status=approved&category=compliance`. Journey Step 4 (sort by date) → `/documents?sort=-created_at` (newest first). Journey Step 6 (mobile document list from behavioral profile: 40% mobile users) → `/documents?fields=id,title,status` reduces bandwidth by 70% (Session 1: mobile optimization critical)."

---

### Response Envelope Consistency

**Single Resource Response**:
```json
GET /documents/123
{
  "id": 123,
  "title": "Document Title",
  "status": "approved",
  "created_at": "2025-02-01T10:30:00Z"
}
```

**Collection Response** (with pagination metadata):
```json
GET /documents?page=1&limit=20
{
  "data": [
    {"id": 123, "title": "Doc 1"},
    {"id": 124, "title": "Doc 2"}
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 47,
    "total_pages": 3
  }
}
```

**Error Response** (see Step 6 for full error handling):
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Document title is required",
    "field": "title"
  }
}
```

**Journey-Based Reasoning**:
[1-2 sentences on consistency benefits for journey]

Example: "Consistent response envelopes simplify client-side parsing across Journey Steps 2-7 (all document operations). Pagination metadata enables Journey Step 3 (browse large document lists) with clear navigation."
```

**Important:**
- Only document REST patterns if paradigm = REST
- Skip this section entirely if GraphQL, gRPC, or WebSocket chosen
- Reference this section from Step 6 (error handling) and Step 5 (pagination)

**Reconsider if:**
- Paradigm changes from REST to GraphQL/gRPC
- Journey adds mobile app with bandwidth constraints (consider GraphQL field selection)
- Service-to-service communication grows (consider gRPC for internal APIs)

---

### Step 3: Analyze Serialization Format Requirements

**Decision Tree - Serialization Format:**

Reference the serialization guide (`reference-material/serialization-guide.md`) decision tree:

```
1. Do humans need to read/edit this data?
   YES → JSON (or YAML for config files)
   NO → Continue to #2

2. Is high performance/bandwidth critical?
   YES → Continue to #3
   NO → JSON (default for REST APIs)

3. Do you have a schema defined?
   YES → Protobuf (best compression + speed)
   NO → MessagePack (binary JSON alternative)

4. Is this financial data (exact decimals)?
   YES → JSON with string numbers OR Protobuf with custom decimal type
   NO → Continue to format recommendations

5. Is this analytics/data warehouse?
   YES → Parquet (columnar format)
   NO → Continue to format recommendations

6. Is this IoT/embedded (constrained devices)?
   YES → MessagePack or CBOR (compact, low overhead)
   NO → Default to JSON

Default: JSON (if no criteria match or debugging important)
```

**Format Recommendations by Paradigm:**
- **REST** → JSON (default), MessagePack (internal high-performance endpoints)
- **GraphQL** → JSON (standard, universal support)
- **gRPC** → Protobuf (native, type-safe)
- **WebSocket** → JSON (simple) or MessagePack (high-performance real-time)
- **Hybrid** → JSON (external REST/GraphQL), Protobuf (internal gRPC)

**IMPORTANT - Journey Traceability:**
- Cite specific journey requirements (bandwidth, debugging, performance)
- Example: "Journey Step 3 has mobile users uploading documents → Bandwidth matters → Consider MessagePack for internal processing, JSON for client-facing (browser compatibility)"
- Example: "Journey has no performance bottleneck (< 100 req/min) → JSON sufficient (human-readable for debugging)"
- Example: "Architecture chose microservices with internal gRPC → Protobuf for service-to-service, JSON for external REST"

**Output Format:**

```markdown
## Serialization Format Decision

### Chosen Format: [JSON / Protobuf / MessagePack / Hybrid]

### Journey-Based Analysis:

1. **Human readability**: [Do developers need to debug? Do clients consume directly?]
   - [Finding with journey or development workflow reference]

2. **Performance/bandwidth**: [Analysis with journey step citation]
   - [Finding with latency/bandwidth requirements]

3. **Schema availability**: [Do we have schema from database/contracts?]
   - [Finding with Session 7 reference]

4. **Financial data**: [Does journey involve money/pricing?]
   - [Finding with journey step or product strategy reference]

5. **Use case specifics**: [Analytics? IoT? Cache? Queue?]
   - [Finding with architecture or tech stack reference]

### Recommendation: [Format]

**Reasoning**: [2-3 sentences tracing decision to paradigm choice, journey requirements, and architecture]

**Implementation**:
- External APIs (client-facing): [Format]
- Internal APIs (service-to-service): [Format]
- Cache/queue: [Format]
- Configuration: [Format]

**Scale-Forward Strategy**: [When to introduce binary formats or hybrid approach]
```

---

### Step 4: Define Authentication Strategy

**Decision Tree - Auth Method:**

```
From tech stack (Session 3), determine auth method:

1. What's the auth provider?
   ├─ Clerk → Use Clerk session tokens
   ├─ Auth0 → Use Auth0 JWT
   ├─ Custom JWT → Implement JWT signing/verification
   ├─ API Keys → Implement API key management
   └─ OAuth 2.0 → Implement OAuth flow

2. Where is the token sent?
   ├─ Header → Authorization: Bearer <token> (recommended)
   ├─ Cookie → Set-Cookie with HttpOnly, Secure flags
   └─ Query param → ?api_key=xxx (only for public read endpoints)

3. What's the token lifetime?
   ├─ Short-lived (15min-1hr) + refresh token → High security
   ├─ Medium (1-7 days) → Balance
   └─ Long-lived (30+ days) → Convenience over security

4. How to handle authorization?
   ├─ User owns resource → Check userId matches
   ├─ Team resource → Check user belongs to team
   ├─ Admin only → Check user role
   └─ Public → No auth required
```

**Output Format:**

```markdown
## Authentication Strategy

### Method: [JWT / OAuth / API Keys / Clerk / Auth0]

**Token Placement**: [Header / Cookie / Query]
**Token Lifetime**: [Duration]
**Refresh Strategy**: [How tokens are refreshed]

### Authorization Patterns:

- **User-owned resources**: [How to check ownership]
- **Team resources**: [How to check team membership]
- **Admin-only resources**: [How to check admin role]
- **Public resources**: [No auth required]

### Journey-Based Reasoning:

[2-3 sentences tracing auth choice to journey, tech stack, and security requirements]
```

---

### Step 4a: Define OWASP API Top 10 2023 Protection Patterns

**Reference**: `reference-material/owasp-api-security-2023-checklist.md` for complete threat descriptions

Analyze the journey, database schema (Session 7), and architecture (Session 4) to identify which OWASP API Security Top 10 2023 risks apply to your API. For each applicable risk, document the protection pattern with journey-based reasoning.

**Decision Tree - Security Pattern Analysis:**

```
For each OWASP risk:
1. Check if risk applies to your journey
   ├─ YES → Document protection pattern with journey citation
   └─ NO → Document why risk is not applicable
```

**OWASP API Security Top 10 2023:**

#### API1:2023 - Broken Object Level Authorization (BOLA)

**Risk**: Users accessing resources they don't own (e.g., viewing other users' documents)

**Pattern**: Always validate resource ownership before returning data

```python
# Anti-pattern (VULNERABLE)
GET /api/documents/:id
-> SELECT * FROM documents WHERE id = :id  # No ownership check!

# Correct pattern
GET /api/documents/:id
-> SELECT * FROM documents WHERE id = :id AND user_id = :current_user_id
```

**Journey-Based Analysis**:
- Which endpoints return user-specific resources? (from Session 7 database schema)
- Which journey steps involve accessing owned resources?
- Document ownership check pattern for EACH resource type

**Example**: "Journey Step 2 (document upload) creates user-owned documents → BOLA protection: `WHERE user_id = :current_user_id` in documents table query"

**Output Format**:
```markdown
#### API1:2023 - Broken Object Level Authorization (BOLA)

**Applicability**: [YES / NO]

**Journey Analysis**:
- Journey Step [X]: [Resource access scenario]
- Database tables with user ownership: [List from Session 7]

**Protection Pattern**:
- Ownership check: `WHERE user_id = :current_user_id`
- Affected endpoints: [List endpoints]

**Reconsider if**: Multi-tenant features added, team-shared resources introduced
```

---

#### API3:2023 - Broken Object Property Level Authorization

**Risk**: Sensitive fields exposed in API responses (PII, SSN, internal IDs)

**Pattern**: Filter sensitive fields from API responses based on user role

```json
// Admin sees PII
GET /api/users/123 (as admin)
-> {"id": 123, "email": "user@example.com", "ssn": "123-45-6789", "internal_notes": "..."}

// Regular user sees limited fields
GET /api/users/123 (as self)
-> {"id": 123, "email": "user@example.com"}  // No SSN, no internal_notes
```

**Journey-Based Analysis**:
- Which entities have sensitive fields? (from Session 7 database schema)
- What user roles exist? (from Session 4 architecture or Session 1 journey)
- Document field-level permissions by role

**Example**: "Users table has `ssn`, `payment_info` fields → Only admin role sees these → Regular users see `id`, `email`, `name` only"

**Output Format**:
```markdown
#### API3:2023 - Broken Object Property Level Authorization

**Applicability**: [YES / NO]

**Journey Analysis**:
- Sensitive fields in schema: [List from Session 7]
- User roles: [Admin / User / Public]

**Protection Pattern**:
- Admin response: [All fields]
- User response: [Limited fields]
- Field-level filtering logic: [How implemented]

**Reconsider if**: New sensitive fields added (payment info, health data), compliance requirements change (GDPR, HIPAA)
```

---

#### API5:2023 - Broken Function Level Authorization (BFLA)

**Risk**: Unauthorized admin/owner actions (e.g., regular user deletes other users)

**Pattern**: Enforce role checks at endpoint level

```
POST /api/users (create user)
-> Require: role = 'admin' OR self-registration enabled

DELETE /api/teams/:id
-> Require: user is team owner OR role = 'admin'

PUT /api/settings/global
-> Require: role = 'admin'
```

**Journey-Based Analysis**:
- Which endpoints are admin-only? (from journey and architecture)
- Which endpoints require owner permissions?
- Document role enforcement pattern

**Example**: "Journey has team-based collaboration → Team owner can DELETE /api/teams/:id → Regular team members cannot"

**Output Format**:
```markdown
#### API5:2023 - Broken Function Level Authorization (BFLA)

**Applicability**: [YES / NO]

**Journey Analysis**:
- Admin-only endpoints: [List]
- Owner-only endpoints: [List]
- Public endpoints: [List]

**Protection Pattern**:
- Admin check: `if user.role != 'admin': return 403`
- Owner check: `if resource.owner_id != current_user_id: return 403`

**Reconsider if**: New admin features added, team hierarchy introduced (owner > admin > member)
```

---

#### API6:2023 - Unrestricted Access to Sensitive Business Flows

**Risk**: Abuse of password resets, order creation, refunds, invitations

**Pattern**: Business logic rate limiting separate from API limits

```
POST /api/auth/password-reset
-> Limit: 3 attempts per email per hour (prevent enumeration)

POST /api/orders
-> Limit: 10 orders per user per day (prevent fraud)

POST /api/teams/:id/invitations
-> Limit: 50 invitations per team per day (prevent spam)
```

**Journey-Based Analysis**:
- Which journey steps are sensitive business flows? (password reset, payments, invitations)
- What abuse scenarios exist? (fraud, spam, enumeration)
- Document business logic limits

**Example**: "Journey Step 5 (invite team members) → Limit 50 invitations/day to prevent spam abuse"

**Output Format**:
```markdown
#### API6:2023 - Unrestricted Access to Sensitive Business Flows

**Applicability**: [YES / NO]

**Journey Analysis**:
- Sensitive flows: [password reset / orders / invitations / etc.]
- Abuse scenarios: [fraud / spam / enumeration]

**Protection Pattern**:
- Endpoint: POST /api/auth/password-reset
  - Limit: 3 attempts per email per hour
  - Reason: Prevent email enumeration
- Endpoint: POST /api/orders
  - Limit: 10 orders per user per day
  - Reason: Prevent fraudulent orders

**Reconsider if**: Payment processing added, invitation system introduced, account recovery flows added
```

---

#### API7:2023 - Server-Side Request Forgery (SSRF)

**Risk**: Internal network access via webhook URLs, file fetching

**Pattern**: Validate and sanitize all user-provided URLs

```
POST /api/webhooks
-> Validate: HTTPS required
-> Block: Internal IPs (127.0.0.1, 10.0.0.0/8, 192.168.0.0/16, 169.254.0.0/16)
-> Allowlist: Specific domains if possible

POST /api/documents/import
-> Validate: Only allow S3/GCS URLs (not arbitrary URLs)
```

**Journey-Based Analysis**:
- Does journey accept user-provided URLs? (webhooks, file imports, integrations)
- What internal services exist? (from Session 4 architecture)
- Document URL validation pattern

**Example**: "Journey has webhook subscriptions → Users provide webhook URL → Validate HTTPS + block internal IPs"

**Output Format**:
```markdown
#### API7:2023 - Server-Side Request Forgery (SSRF)

**Applicability**: [YES / NO]

**Journey Analysis**:
- User-provided URLs: [webhooks / file imports / none]
- Internal services: [from Session 4 architecture]

**Protection Pattern**:
- URL validation: HTTPS required, block internal IPs
- Allowlist: [Specific domains if applicable]

**Reconsider if**: Webhook system added, file import from URLs introduced, third-party integrations allow URL configuration
```

---

#### API8:2023 - Security Misconfiguration

**Risk**: Missing security headers, default credentials, unnecessary endpoints

**Pattern**: Require security headers on ALL responses

```http
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Content-Security-Policy: default-src 'self'
X-Request-ID: req_abc123
```

**Journey-Based Analysis**:
- What security headers are needed for your application type? (web app, API-only, hybrid)
- Are there default endpoints to disable? (/admin, /debug)
- Document required headers

**Example**: "Web-based journey requires CSP to prevent XSS → Content-Security-Policy: default-src 'self'"

**Output Format**:
```markdown
#### API8:2023 - Security Misconfiguration

**Applicability**: YES (always applicable)

**Required Security Headers**:
- `Strict-Transport-Security`: max-age=31536000; includeSubDomains
- `X-Content-Type-Options`: nosniff
- `X-Frame-Options`: [DENY / SAMEORIGIN]
- `Content-Security-Policy`: [Policy based on journey]
- `X-Request-ID`: [For request tracing]

**Journey-Based Reasoning**:
[Why these headers matter for your specific journey]

**Disabled Endpoints**:
- [List any default endpoints to disable: /admin, /debug, /metrics if not needed]
```

---

#### API10:2023 - Unsafe Consumption of APIs

**Risk**: Third-party API failures cascade to our API (timeouts, malicious responses)

**Pattern**: Timeout + circuit breaker for third-party APIs

```
Third-party API configuration:
- Timeout: 5 seconds (fail fast)
- Circuit breaker: Open after 5 consecutive failures
- Half-open: Retry after 30 seconds
- Fallback: Return cached data or degraded response
```

**Journey-Based Analysis**:
- Which journey steps depend on third-party APIs? (payment gateways, AI services, integrations)
- What happens if third-party API fails? (from Session 7 and Session 4)
- Document timeout and fallback strategy

**Example**: "Journey Step 3 (AI document analysis) calls OpenAI API → Timeout: 30s → Fallback: Return 'processing' status, retry later"

**Output Format**:
```markdown
#### API10:2023 - Unsafe Consumption of APIs

**Applicability**: [YES / NO]

**Journey Analysis**:
- Third-party APIs: [List from journey and architecture]
- Journey steps affected: [Which steps depend on third-party]

**Protection Pattern**:
- API: [Name]
  - Timeout: [X seconds]
  - Circuit breaker: Open after [N] failures
  - Fallback: [Return cached data / degraded response / error]

**Reconsider if**: Third-party integrations added (payment, AI, analytics), webhook consumption from external sources
```

---

**Output Format Summary**:

For the API design document, include a new section "Security Protection Patterns (OWASP API Top 10)" after Authentication Strategy with:
- Analysis for each applicable risk
- Protection pattern with code examples
- Journey-based reasoning
- "Reconsider if" conditions for currently non-applicable risks

**Important**:
- Only document applicable risks (don't force-fit every risk)
- Cite specific journey steps and database tables
- Focus on journey-driven analysis, not generic security advice

---

### Step 4b: Define Input Validation Strategy

**Reference**: `reference-material/api-security-blueprint.md` for validation fundamentals

All user input must be validated on the server side. Define validation approach based on API paradigm and journey requirements.

**Decision Tree - Validation Approach:**

```
1. What's your API paradigm? (from Step 2)
   ├─ REST → JSON Schema, Pydantic, Joi, Zod
   ├─ GraphQL → Schema enforces types automatically (still validate business logic)
   └─ gRPC → Protobuf enforces types automatically (still validate ranges/formats)

2. What validation library matches tech stack? (from Session 3)
   ├─ Python (FastAPI) → Pydantic
   ├─ Node.js (Express) → Joi, Zod, AJV
   ├─ TypeScript (NestJS) → class-validator, Zod
   └─ Go → validator, govalidator

3. What input types need validation? (from journey and database schema)
   ├─ Email addresses → RFC 5322 format
   ├─ URLs → HTTPS required, domain allowlist
   ├─ Phone numbers → E.164 format (+1234567890)
   ├─ Dates → ISO 8601 (YYYY-MM-DD)
   ├─ UUIDs → UUIDv4 or UUIDv7
   ├─ Strings → Max length limits (prevent DoS)
   ├─ Numbers → Range validation (min/max)
   ├─ Files → MIME type, size limits
   └─ JSON → Schema validation
```

**Journey-Based Analysis**:
- Which journey steps accept user input? (forms, uploads, search, filters)
- What input types are in database schema? (from Session 7)
- What abuse scenarios exist? (SQL injection, XSS, file upload attacks)

**Example**: "Journey Step 2 (document upload) accepts PDF files → Validate MIME type (application/pdf), size limit (10MB), scan for malware"

**Validation Rules**:

#### String Validation
```
- Max length: Prevent DoS (e.g., 255 chars for names, 5000 for descriptions)
- Min length: Prevent empty inputs (e.g., min 3 chars for search)
- Pattern: Regex for specific formats (alphanumeric, no special chars)
- Trim: Remove leading/trailing whitespace
```

#### Email Validation
```
- Format: RFC 5322 (basic: \S+@\S+\.\S+)
- Max length: 254 characters
- Normalization: Lowercase
- DNS check (optional): Verify domain exists
```

#### URL Validation
```
- Protocol: HTTPS required (or HTTP for dev)
- Domain allowlist: Only allow specific domains if applicable
- Block internal IPs: 127.0.0.1, 10.0.0.0/8, 192.168.0.0/16 (prevent SSRF)
- Max length: 2048 characters
```

#### Phone Number Validation
```
- Format: E.164 (+1234567890)
- Library: libphonenumber (validates country codes)
```

#### Date/Time Validation
```
- Format: ISO 8601 (2025-02-01T10:30:00Z)
- Range: Prevent dates in distant past/future (e.g., 1900-2100)
- Timezone: Store in UTC, convert to user timezone
```

#### Numeric Validation
```
- Type: Integer or float
- Range: Min/max values (e.g., quantity: 1-1000)
- Precision: For decimals (e.g., currency: 2 decimal places)
```

#### File Upload Validation
```
- MIME type: Allowlist (e.g., application/pdf, image/jpeg, image/png)
- File size: Max limit (e.g., 10MB)
- File extension: Double-check (don't trust client)
- Virus scanning: Integrate malware scanner (ClamAV, VirusTotal API)
- Storage: Rename file (prevent directory traversal)
```

#### Sanitization
```
- HTML input: Strip tags OR allowlist safe tags (<b>, <i>, <a>)
- SQL: ALWAYS use parameterized queries (prevent SQL injection)
- Command injection: Never pass user input to shell commands
- Path traversal: Validate file paths, use allowlist
```

**Output Format**:

```markdown
## Input Validation Strategy

### Validation Approach
**Paradigm**: [REST / GraphQL / gRPC]
**Library**: [Pydantic / Joi / Zod / class-validator] (from tech stack Session 3)

### Validation Rules by Input Type

#### Email Addresses
- Format: RFC 5322
- Max length: 254 characters
- Normalization: Lowercase
- Journey context: [Which journey steps use email?]

#### URLs
- Protocol: HTTPS required
- Domain allowlist: [Specific domains OR any]
- Block internal IPs: YES (SSRF protection)
- Journey context: [Which journey steps accept URLs?]

#### File Uploads
- Allowed MIME types: [application/pdf, image/jpeg, image/png]
- Max file size: [10MB]
- Virus scanning: [YES / NO]
- Journey context: [Journey Step X: document upload → PDF only, 10MB max]

#### [Other Input Types]
[Document based on journey and database schema]

### Sanitization Strategy

**HTML Input**:
- Approach: [Strip all tags / Allowlist safe tags]
- Library: [DOMPurify / bleach / sanitize-html]
- Journey context: [Which fields allow rich text?]

**SQL Injection Prevention**:
- Method: Parameterized queries (ALWAYS)
- ORM: [Prisma / TypeORM / SQLAlchemy] (from tech stack)

**Command Injection Prevention**:
- Rule: NEVER pass user input to shell commands
- Alternative: Use libraries, not shell commands

### Journey-Based Reasoning
[3-5 sentences tracing validation strategy to:
- Journey input scenarios (forms, uploads, search)
- Database schema input types (Session 7)
- Security requirements (prevent injection, XSS, DoS)]
```

---

### Step 5: Define Rate Limiting and Pagination

**Decision Tree - Rate Limiting:**

```
1. What's the pricing model? (from product strategy)
   ├─ Free tier → Aggressive limits (10-100 req/min)
   ├─ Paid tier → Generous limits (100-1000 req/min)
   └─ Enterprise → Custom limits or no limits

2. What's the limiting strategy?
   ├─ Per user → Limit by user_id
   ├─ Per team → Limit by team_id (better for multi-user teams)
   ├─ Per IP → Limit by IP (for unauthenticated endpoints)
   └─ Sliding window → More accurate than fixed window

3. What endpoints need stricter limits?
   ├─ Expensive operations (AI, file processing) → Lower limit
   ├─ Read operations (GET) → Higher limit
   └─ Public endpoints → Strictest limit (prevent abuse)
```

**Decision Tree - Pagination:**

```
1. How many total records? (from database schema + journey scale)
   ├─ <1K records → Simple offset pagination
   ├─ 1K-100K records → Cursor pagination (recommended)
   └─ >100K records → Cursor + search optimization

2. Do results change frequently?
   ├─ YES → Cursor pagination (stable)
   ├─ NO → Offset pagination (simpler)

3. Do users need random page access?
   ├─ YES → Offset pagination (supports page=5)
   ├─ NO → Cursor pagination (next/previous only)
```

**Output Format:**

```markdown
## Rate Limiting Strategy

### Limits by Tier:
- **Free**: [X req/min, Y req/hour]
- **Pro**: [X req/min, Y req/hour]
- **Enterprise**: [Custom or unlimited]

### Limiting Approach:
- **Strategy**: [Per user / Per team / Per IP]
- **Window**: [Sliding / Fixed]
- **Headers**: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

### Endpoint-Specific Limits:
- **Expensive ops** (uploads, AI processing): [Stricter limits]
- **Read ops** (GET): [Standard limits]
- **Public endpoints**: [Strictest limits]

### Journey-Based Reasoning:

[2-3 sentences tracing rate limiting to pricing model, journey scale, and cost structure]

---

## Pagination Strategy

### Approach: [Cursor / Offset / Hybrid]

**Format**:
- Cursor: `?cursor=abc&limit=20` → `{data[], pagination: {nextCursor, prevCursor, hasMore}}`
- Offset: `?page=1&limit=20` → `{data[], pagination: {page, limit, total, totalPages}}`

### When to Use:
- **Cursor**: [Which resources? Why?]
- **Offset**: [Which resources? Why?]

### Journey-Based Reasoning:

[2-3 sentences tracing pagination choice to data volume, UX needs, and database schema]
```

---

### Step 5b: Define HTTP Caching Strategy

**Reference**: HTTP caching optimizes performance by reducing server load and network bandwidth

Analyze the journey and API paradigm to determine optimal caching strategy for different resource types.

**Decision Tree - HTTP Caching:**

```
1. What resources are cacheable? (from journey and database schema)
   ├─ Public content (blog posts, docs, public reports) → Cache-Control: public
   ├─ User-specific content (documents, settings) → Cache-Control: private
   ├─ Sensitive data (payments, PII) → Cache-Control: no-store
   └─ Dynamic frequently-changing → Cache-Control: no-cache

2. How long should cache last? (from journey update frequency)
   ├─ Static content (rarely changes) → max-age=3600 (1 hour) or 86400 (1 day)
   ├─ Semi-static (updates daily) → max-age=300 (5 min)
   ├─ Dynamic (frequent updates) → max-age=0, must-revalidate
   └─ Never cache → no-store

3. Do clients need conditional requests? (from journey data volume)
   ├─ YES (large responses, check if modified) → ETag + If-None-Match
   ├─ Time-based validation → Last-Modified + If-Modified-Since
   └─ NO (small responses, always fetch) → No ETag needed

4. Should responses be compressed? (from journey bandwidth)
   ├─ Responses >1KB → gzip, brotli (Accept-Encoding: br, gzip)
   ├─ Already compressed (images, videos) → No additional compression
   └─ <1KB responses → Compression overhead not worth it
```

**Journey-Based Caching Analysis:**

For each resource type from journey:
- Which journey steps access this resource?
- How often does it change? (never, hourly, daily, constantly)
- Who can access it? (public, user-owned, team, admin-only)
- What's the response size? (bytes, KB, MB)
- What's the bandwidth constraint? (desktop, mobile, global CDN)

**Example Journey Analysis:**

```markdown
**Journey Step 2: View compliance framework list**
- Resource: GET /api/frameworks
- Change frequency: Weekly (new frameworks added)
- Access: Public (anyone can view)
- Response size: 50KB
- **Cache strategy**: Cache-Control: public, max-age=3600 (1 hour), ETag for revalidation

**Journey Step 3: View user's uploaded documents**
- Resource: GET /api/documents/:id
- Change frequency: Never (documents immutable after upload)
- Access: User-owned (private)
- Response size: Varies (metadata only: 2KB)
- **Cache strategy**: Cache-Control: private, max-age=300 (5 min), ETag for revalidation

**Journey Step 5: Payment processing**
- Resource: POST /api/payments
- **Cache strategy**: Cache-Control: no-store (sensitive financial data)
```

---

#### ETag and Conditional Requests

**Pattern: ETag for Efficient Revalidation**

```http
# Initial request
GET /api/frameworks
Accept-Encoding: br, gzip

# Server response
HTTP/1.1 200 OK
ETag: "v1-abc123"
Cache-Control: public, max-age=3600
Content-Encoding: br
Content-Type: application/json

[...response body...]
```

```http
# Client revalidates after cache expires
GET /api/frameworks
If-None-Match: "v1-abc123"

# Resource unchanged
HTTP/1.1 304 Not Modified
ETag: "v1-abc123"
Cache-Control: public, max-age=3600
# No body → saves bandwidth
```

**ETag Generation Strategies:**

- **Content hash**: Hash response body (MD5, SHA256) → Accurate but expensive
- **Version number**: Increment on resource update (`v1`, `v2`) → Fast but requires tracking
- **Last modified timestamp**: Use `updated_at` field → Simple, works for DB entities
- **Composite**: Combine ID + updated_at (`resource-123-20250201T103000Z`) → Balanced

**Journey-Based ETag Selection:**

```markdown
- GET /api/frameworks → ETag: Hash of framework list JSON (updates weekly, small list)
- GET /api/documents/:id → ETag: `doc-${id}-${updated_at}` (immutable after upload)
- GET /api/reports/:id → ETag: Version number from database (incremental updates)
```

---

#### Cache-Control Directives

**Pattern: Cache-Control Header Based on Resource Type**

**Public Cacheable Content** (CDN can cache):
```http
Cache-Control: public, max-age=3600
```
- Use for: Public resources (blogs, docs, frameworks, public reports)
- CDN benefit: Serves from edge locations, reduces origin load

**Private Cacheable Content** (browser only, not CDN):
```http
Cache-Control: private, max-age=300
```
- Use for: User-specific resources (user settings, private documents, dashboards)
- Security: Prevents shared caches (proxies, CDN) from storing

**Sensitive Data** (never cache):
```http
Cache-Control: no-store
```
- Use for: Financial data, PII, auth tokens, payment info
- Security: Prevents any caching (browser, proxy, CDN)

**Dynamic Content** (validate before use):
```http
Cache-Control: no-cache, must-revalidate
```
- Use for: Frequently changing data (live dashboards, real-time feeds)
- Behavior: Cache stores response but validates with server before using

**Immutable Content** (never changes):
```http
Cache-Control: public, max-age=31536000, immutable
```
- Use for: Versioned assets (CSS, JS with hash in filename)
- Benefit: Browser never revalidates (saves requests)

---

#### Compression Strategy

**Pattern: Accept-Encoding and Content-Encoding**

```http
# Client declares compression support
GET /api/documents
Accept-Encoding: br, gzip, deflate

# Server responds with compressed content
HTTP/1.1 200 OK
Content-Encoding: br
Content-Type: application/json
Content-Length: 1234 (compressed size)

[...brotli-compressed JSON...]
```

**Compression Decision Tree:**

```
1. Response size:
   ├─ <1KB → No compression (overhead not worth it)
   ├─ 1KB-100KB → gzip (widely supported, good compression)
   └─ >100KB → Brotli (better compression than gzip)

2. Content type:
   ├─ Text (JSON, HTML, CSS, JS, XML) → Compress (70-90% reduction)
   ├─ Already compressed (JPEG, PNG, MP4, GZIP files) → Don't compress (wastes CPU)
   └─ Binary formats (Protobuf) → Compress if >1KB

3. Client support:
   ├─ Client sends "Accept-Encoding: br" → Use Brotli (best compression)
   ├─ Client sends "Accept-Encoding: gzip" → Use gzip (universal support)
   └─ No Accept-Encoding → No compression (old clients)
```

**Journey-Based Compression Strategy:**

```markdown
**Journey Step 2: List frameworks** (GET /api/frameworks)
- Response: 50KB JSON
- Strategy: Brotli compression (50KB → ~10KB = 80% reduction)
- Client support: Modern browsers (2025)

**Journey Step 4: Download report PDF** (GET /api/reports/:id/pdf)
- Response: 2MB PDF (already compressed)
- Strategy: No additional compression (wastes CPU)

**Journey Step 6: Get user settings** (GET /api/users/me/settings)
- Response: 500 bytes JSON
- Strategy: No compression (<1KB threshold)
```

---

**Output Format:**

```markdown
## HTTP Caching Strategy

### Cache Strategy by Resource Type

**Public Content** (cacheable by CDN):
- Resources: [List from journey - e.g., GET /api/frameworks, GET /public/reports/:token]
- Cache-Control: public, max-age=[3600 / 86400]
- ETag: [YES / NO]
- Reasoning: [Journey step + change frequency]

**Private Content** (browser cache only):
- Resources: [List from journey - e.g., GET /api/documents/:id, GET /api/users/me]
- Cache-Control: private, max-age=[300 / 600]
- ETag: [YES / NO]
- Reasoning: [Journey step + user-specific data]

**Sensitive Data** (no caching):
- Resources: [List from journey - e.g., POST /api/payments, GET /api/users/:id/payment-methods]
- Cache-Control: no-store
- Reasoning: [Journey step + security requirement]

**Dynamic Content** (validate before use):
- Resources: [List from journey - e.g., GET /api/dashboards/live]
- Cache-Control: no-cache, must-revalidate
- Reasoning: [Journey step + real-time requirement]

### ETag Implementation

**ETag Generation Strategy**: [Content hash / Version number / Timestamp / Composite]

**Journey-Based ETag Usage**:
- Resource: [GET /api/resource]
  - ETag format: [Example: "v1-abc123"]
  - Generation method: [Hash / DB version / updated_at]
  - Why: [Reasoning from journey]

**Conditional Request Flow**:
1. Client requests resource → Server returns 200 + ETag
2. Client caches response with ETag
3. Cache expires → Client sends If-None-Match: [ETag]
4. Resource unchanged → Server returns 304 (no body)
5. Resource changed → Server returns 200 + new ETag + updated body

### Compression Configuration

**Response Size Thresholds**:
- <1KB: No compression (overhead not worth it)
- 1KB-100KB: gzip (widely supported)
- >100KB: Brotli (better compression)

**Content-Type Compression Map**:
- application/json: Compress with Brotli/gzip (70-90% reduction)
- text/html: Compress with Brotli/gzip
- image/jpeg, image/png: No compression (already compressed)
- application/pdf: No compression (already compressed)
- [Other types from journey]

**Journey-Based Compression**:
- Journey Step [X]: [Resource with large response]
  - Response size: [50KB]
  - Compression: Brotli (50KB → 10KB = 80% reduction)
  - Reasoning: [Mobile users, bandwidth savings]

### Journey-Based Caching Reasoning

[3-5 sentences tracing caching strategy to:
- Journey resource access patterns (which steps read which resources)
- Data update frequency (from Session 7 database schema and journey flows)
- Bandwidth constraints (mobile users, global access, CDN benefits)
- Security requirements (public vs private vs sensitive data)
- Performance goals (Session 4 metrics - response time, concurrent users)]

**Example**: "Journey Step 2 (view compliance frameworks) accesses public framework list updated weekly → Cache-Control: public, max-age=3600 enables CDN edge caching → Reduces origin server load for 10,000 monthly users. Journey Step 3 (view private documents) returns user-owned document metadata → Cache-Control: private, max-age=300 allows browser caching without CDN exposure. Brotli compression on JSON responses reduces 50KB framework list to 10KB → 80% bandwidth savings for mobile users in APAC region (from journey behavioral profile)."

### Performance Impact

**Metrics to track** (for Session 14 observability):
- Cache hit rate (% requests served from cache)
- Bandwidth savings (MB saved via caching + compression)
- 304 Not Modified response rate (% revalidations that skip body transfer)
- Average response size (before/after compression)
- Origin server load reduction (requests avoided via caching)

**Target metrics** (journey-based):
- Cache hit rate: [60-80%] for public content
- Bandwidth reduction: [70-80%] via Brotli compression
- 304 response rate: [40-60%] for cacheable resources with ETag
```

**Important:**
- Only implement HTTP caching if API paradigm is REST or HTTP-based
- GraphQL has its own caching strategy (persisted queries, APQ)
- gRPC uses different caching mechanisms (not HTTP Cache-Control)
- WebSocket doesn't use HTTP caching (real-time, not request-response)

**Reconsider if:**
- Paradigm changes from REST to GraphQL/gRPC
- Journey adds real-time requirements (caching conflicts with <1s updates)
- All content becomes highly dynamic (no cacheable resources)
- Security requirements mandate no caching for all endpoints

---

### Step 5a: Check for Internationalization (i18n) Requirements

**If constraints file exists**, check for i18n requirement:

Read `product-guidelines/02a-constraints.ctx.md` and look for:
- "Internationalization requirements (i18n, l10n)" marked as required
- Multi-language or multi-region requirements

**If i18n IS required**, add localization support to API design:

**1. Accept-Language Header Support**

Document that APIs accept locale via:
```http
GET /api/products
Accept-Language: de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7
```

Or query parameter for explicit override:
```http
GET /api/products?locale=es-ES
```

**Locale Selection Strategy:**
```
1. Check ?locale query parameter (explicit user choice)
2. Check Accept-Language header (browser preference)
3. Check user.preferred_locale from database (saved preference)
4. Fallback to default locale (e.g., en-US)
```

**2. Localized Error Messages**

Ensure error responses include localized messages:
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Le champ email est requis",  // Localized based on Accept-Language
    "message_key": "errors.validation.email_required",  // For client-side translation
    "details": {
      "field": "email"
    }
  }
}
```

**3. Locale Fallback Chain**

Document fallback strategy for missing translations:
```
Requested: de-CH (German, Switzerland)
Fallback chain:
1. de-CH (specific variant)
2. de-DE (German, Germany) or de (generic German)
3. en-US (default)
```

**Example**: User requests `Accept-Language: de-CH` → API tries de-CH → falls back to de-DE → falls back to en-US

**4. Content Negotiation Response**

Return Content-Language header to indicate actual locale used:
```http
HTTP/1.1 200 OK
Content-Language: de-DE
Content-Type: application/json
```

**5. Journey-Based i18n Design**

Document which API responses include localized content based on journey:
- **User-facing strings**: Error messages, validation feedback, status labels
- **Database content**: Entities with translation tables (e.g., product names, descriptions)
- **NOT localized**: Technical identifiers, timestamps, API keys, log messages

**Output Format:**

```markdown
## Internationalization (i18n) Support

### Locale Detection Strategy:
1. Query parameter `?locale=xx-XX` (explicit override)
2. `Accept-Language` header (browser default)
3. User preference from database (if authenticated)
4. Default locale: en-US

### Localized API Responses:
- **Error messages**: Translated based on locale
- **Validation feedback**: Translated field names and constraints
- **[Entity] content**: Fetched from `[entity]_translations` table

### Locale Fallback Chain:
[Specific variant] → [Generic language] → [Default locale]

Example: `es-MX → es-ES → en-US`

### Content-Language Header:
All responses include `Content-Language` header indicating actual locale used.

### Journey-Based i18n Requirements:
[Which journey steps require localized content? Reference specific steps from Session 00.]
```

**If i18n is NOT required**: Skip this subsection and proceed with webhook endpoint design (if applicable).

---

### Step 5c: Webhook Endpoint Design (if webhooks exist from Session 2a)

**Check for webhooks**: If `product-guidelines/02a-constraints.ctx.md` exists and identifies webhook integrations in Phase 2a (Question 8: event-driven integrations), include webhook endpoint design.

**Sub-Agent Invocation**:
```
Use Task tool to invoke:
  Agent: /.claude/agents/design-webhook-endpoints.md
  Inputs:
    - Webhook requirements from 02a-constraints.ctx.md (providers requiring webhooks)
    - API paradigm chosen in Session 8 (REST, GraphQL, gRPC)
    - Backend framework from Session 3 tech stack
    - Journey requirements for webhook use cases
    - Database schema from Session 7 (check if webhook_events table exists)
  Output: Webhook Endpoint Design section to append to API design file
```

The sub-agent will:
1. Analyze webhook requirements (Stripe, PayPal, Salesforce, SendGrid, etc.)
2. Determine processing pattern (synchronous <5s vs asynchronous queue-based)
3. Design idempotency strategy (event ID deduplication with UNIQUE constraint)
4. Design signature verification (HMAC-SHA256 per provider)
5. Design endpoint versioning (versioned vs unversioned)
6. Design scale-forward strategy (MVP single endpoint → dedicated webhook service)
7. Generate Webhook Endpoint Design section with journey-traced reasoning

**Example Output** (what sub-agent generates):

```markdown
## Step 5c: Webhook Endpoint Design

### Webhook Endpoints:
- `/webhooks/stripe` - Stripe payment and subscription events
- `/webhooks/salesforce` - Salesforce Change Data Capture (CDC) events
- `/webhooks/sendgrid` - Email delivery and bounce events

### Processing Pattern: Asynchronous

**Reasoning**: Payment confirmation webhook (Stripe payment_intent.succeeded) triggers 3 operations:
subscription activation (database write), access provisioning (external API call), confirmation email
(SendGrid API). Estimated processing time: 2-4 seconds. Asynchronous processing required to respond
to Stripe within <1s and prevent timeout retries.

**Implementation**: Webhook endpoint returns 200 OK immediately after signature verification + event
deduplication. Event enqueued to Redis (LPUSH webhook:queue). Background worker (webhook-processor
service) consumes queue and processes events.

### Idempotency:
- **Deduplication Key**: Provider event_id
- **Storage**: webhook_events table with UNIQUE constraint on (provider, event_id)
- **Retry Handling**: Return 200 OK for duplicate events (already processed)

### Security:
- **Verification Method**: HMAC-SHA256 signature verification
- **Stripe**: Requires raw body BEFORE JSON parsing (use express.raw() middleware)
- **Salesforce**: X-Salesforce-Signature header
- **SendGrid**: X-Twilio-Email-Event-Webhook-Signature header
- **Secret Storage**: Environment variables per provider (STRIPE_WEBHOOK_SECRET, etc.)

### Scale-Forward Strategy:
- **MVP (0-100 events/hour)**: Single endpoint per provider, Redis queue + 1 worker
- **Growth (100-1,000 events/hour)**: Separate webhook service, 3-5 workers, Redis Cluster
- **Scale (>1,000 events/hour)**: Event bus (Kafka/EventBridge), auto-scaling workers

**Reference**: `/reference-material/third-party-integration-patterns.md` (lines 25-118) for webhook patterns
**Examples**: `/examples/integration-patterns-examples.md` Section 4 for code examples
```

**Why This Matters**: Eliminates ad-hoc webhook design decisions. Ensures systematic async processing, idempotency, signature verification, and scale-forward planning. Prevents production issues like duplicate processing, forged webhooks, and timeout retries.

**If webhooks do NOT exist**: Skip this subsection and proceed with error handling.

---

### Step 6: Define Error Handling Philosophy

**Standard Error Format:**

```json
{
  "error": {
    "code": "ERROR_CODE",              // Machine-readable constant
    "message": "Human-readable error", // User-facing message
    "details": {},                     // Optional: additional context
    "field": "fieldName",              // Optional: which field caused error
    "request_id": "req_abc123"         // Optional: for support debugging
  }
}
```

**Security Headers (Required on ALL Responses):**

All API responses (success and error) must include security headers:

```http
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
Content-Security-Policy: default-src 'self'
X-Request-ID: req_abc123
```

**Header Descriptions:**
- `Strict-Transport-Security` (HSTS): Forces HTTPS for 1 year, prevents downgrade attacks
- `X-Content-Type-Options`: Prevents MIME-type sniffing (security risk)
- `X-Frame-Options`: Prevents clickjacking (DENY for APIs, SAMEORIGIN if embedding allowed)
- `Content-Security-Policy`: Restricts resource loading (API-only: `default-src 'self'`)
- `X-Request-ID`: Request tracing for debugging and security auditing

**HTTP Status Codes:**

```
Success:
200 OK           - Successful GET, PATCH, DELETE
201 Created      - Successful POST (resource created)
202 Accepted     - Async operation started
204 No Content   - Successful DELETE (no body)

Client Errors:
400 Bad Request          - Invalid input (validation failed)
401 Unauthorized         - Missing or invalid auth token
403 Forbidden            - Valid token but insufficient permissions
404 Not Found            - Resource doesn't exist
409 Conflict             - Resource state conflict (e.g., duplicate)
413 Payload Too Large    - Request body/file too large
422 Unprocessable Entity - Semantic error (valid format, invalid business logic)
429 Too Many Requests    - Rate limit exceeded

Server Errors:
500 Internal Server Error - Unexpected server error
502 Bad Gateway           - Upstream service failed
503 Service Unavailable   - Temporary unavailable (maintenance, overload)
504 Gateway Timeout       - Upstream service timeout
```

---

### Step 6a: Define Idempotency and Retry Strategies

**Reference**: Idempotency prevents duplicate operations (critical for payments, orders, mutations)

Analyze the journey to identify operations that require idempotency protection and retry guidance.

**Decision Tree - Idempotency Requirements:**

```
1. Does journey include financial transactions?
   ├─ Payments (charges, refunds) → CRITICAL: Idempotency-Key required
   ├─ Orders (purchases, subscriptions) → CRITICAL: Idempotency-Key required
   └─ No financial operations → Continue to #2

2. Does journey include state-changing operations that must not duplicate?
   ├─ User creation (invitations, signups) → Idempotency-Key recommended
   ├─ Resource creation (documents, reports) → Idempotency-Key recommended
   ├─ Email/notification sending → Idempotency-Key recommended
   └─ Read-only operations (GET) → No idempotency needed

3. Does journey include async operations?
   ├─ Long-running tasks (AI processing, exports) → Idempotency-Key + polling
   └─ Synchronous operations → Standard idempotency
```

**Journey-Based Analysis**:
- Which journey steps involve POST/PATCH operations? (from Session 1)
- Which operations involve money? (from Session 4: monetization)
- Which operations cannot safely be retried? (duplicate orders, duplicate emails)

**Example**: "Journey Step 4 (payment processing) creates charges → Network timeout risk → Idempotency-Key prevents duplicate charges"

#### Idempotency Pattern

**For POST and PATCH endpoints that create resources or mutate state:**

```http
POST /api/orders
Idempotency-Key: 550e8400-e29b-41d4-a716-446655440000
Content-Type: application/json

{
  "product_id": 123,
  "quantity": 2
}
```

**Server-Side Idempotency Logic:**

```
1. Client generates UUIDv4 as Idempotency-Key
2. Client sends request with Idempotency-Key header
3. Server checks if key exists in idempotency store (Redis, database table)
   ├─ Key exists → Return cached response (200 OK with original response body)
   └─ Key doesn't exist → Process request, store result with key, return response
4. Key expires after 24 hours (configurable based on journey)
```

**Journey-Based Idempotency Design:**

```markdown
### Idempotency-Protected Endpoints

**Financial Operations** (CRITICAL):
- POST /api/payments
  - Idempotency-Key: Required
  - Expiry: 24 hours
  - Journey context: [Journey Step X: payment processing]
  - Duplicate prevention: Prevents duplicate charges if network fails

**Resource Creation**:
- POST /api/orders
  - Idempotency-Key: Required
  - Expiry: 24 hours
  - Journey context: [Journey Step X: order placement]
- POST /api/documents
  - Idempotency-Key: Recommended
  - Expiry: 1 hour
  - Journey context: [Journey Step X: document upload]

**Notification Operations**:
- POST /api/invitations
  - Idempotency-Key: Recommended
  - Expiry: 1 hour
  - Journey context: [Journey Step X: send invitations]
```

**Implementation Requirements:**
- Idempotency store: Redis (fast lookup) or database table (`idempotency_keys` with `key`, `response_body`, `created_at`, `expires_at`)
- Key format: UUIDv4 (client-generated)
- Response caching: Store full HTTP response (status code, headers, body)
- Expiry: 24 hours (financial), 1 hour (non-financial), configurable per endpoint
- **Journey context: MUST cite specific journey steps requiring idempotency protection** (e.g., "Journey Step 4: payment processing") for each protected endpoint

---

#### Retry Strategy Pattern

**For rate limit and temporary failure responses:**

```http
HTTP/1.1 429 Too Many Requests
Retry-After: 60
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1709251200

{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded. Please retry after 60 seconds.",
    "retry_after_seconds": 60,
    "request_id": "req_abc123"
  }
}
```

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

**Retry-After Header Usage:**

- **429 Too Many Requests**: Retry-After = seconds until rate limit resets
- **503 Service Unavailable**: Retry-After = estimated recovery time (30-120 seconds)
- **202 Accepted** (async operations): Retry-After = polling interval (e.g., 5 seconds)

**Client Retry Guidance:**

```
Client should implement exponential backoff with jitter:
1. First retry: Wait Retry-After seconds (or 1s if not provided)
2. Second retry: Wait 2x previous (2s, 4s, 8s, 16s)
3. Max retries: 5 attempts
4. Jitter: Add random 0-1s to prevent thundering herd
5. Max backoff: Cap at 60 seconds
```

**Journey-Based Retry Design:**

```markdown
### Retry Strategy by Endpoint Type

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
```

---

#### Circuit Breaker Pattern (Third-Party API Protection)

**For third-party API consumption (API10:2023 - Unsafe Consumption of APIs):**

Protect your API from third-party service failures cascading to users.

**Pattern Configuration:**

```
Third-party API: [Name, e.g., "Stripe Payment API"]

1. Timeout: 5-30 seconds (fail fast, don't block user request)
2. Circuit States:
   ├─ CLOSED: Normal operation, requests pass through
   ├─ OPEN: 5 consecutive failures → Stop sending requests, return fallback immediately
   └─ HALF-OPEN: After 30s cooldown → Try 1 request to test recovery
3. Fallback Strategy:
   ├─ Return cached data (if applicable)
   ├─ Return degraded response (partial data, "unavailable" status)
   └─ Return user-facing error with actionable message
```

**Journey-Based Circuit Breaker Design:**

```markdown
### Circuit Breaker Configuration by Third-Party API

**Payment Gateway** (e.g., Stripe, PayPal):
- Journey Step: [X - payment processing]
- Timeout: 10 seconds
- Circuit: Open after 5 failures
- Half-open retry: After 60 seconds
- Fallback: Return "Payment processing delayed, please try again in 1 minute" (503)
- Why: Payment failures must inform user immediately, not hang

**AI Service** (e.g., OpenAI, Anthropic):
- Journey Step: [Y - document analysis]
- Timeout: 30 seconds
- Circuit: Open after 5 failures
- Half-open retry: After 30 seconds
- Fallback: Return "processing" status, queue for later retry (202 Accepted)
- Why: AI processing can be async, queue for retry without blocking user

**Email Service** (e.g., SendGrid, Mailgun):
- Journey Step: [Z - send notification]
- Timeout: 5 seconds
- Circuit: Open after 10 failures
- Half-open retry: After 60 seconds
- Fallback: Queue email for later delivery, return success to user
- Why: Email delivery can be delayed without impacting user flow
```

**Implementation Requirements:**
- Circuit breaker library: Polly (.NET), resilience4j (Java), circuitbreaker (Python), opossum (Node.js)
- Metrics: Track failure rate, circuit state, fallback usage (for Session 14 observability)
- Alerting: Notify team when circuit opens (indicates third-party degradation)

---

**Output Format:**

```markdown
## Idempotency and Retry Strategies

### Idempotency-Protected Endpoints

**Pattern**: Idempotency-Key header for POST/PATCH operations

#### Financial Operations (CRITICAL)
- Endpoint: POST /api/payments
  - Idempotency-Key: Required
  - Expiry: 24 hours
  - Journey context: [Journey Step X: payment processing]
  - Duplicate prevention: Network retry doesn't create duplicate charges

#### Resource Creation
- Endpoint: POST /api/orders
  - Idempotency-Key: Required
  - Journey context: [Journey Step X: order placement]
  - Expiry: 24 hours
- Endpoint: POST /api/documents
  - Idempotency-Key: Recommended
  - Journey context: [Journey Step X: document upload]
  - Expiry: 1 hour

### Retry Strategy

**Retry-After Header Usage**:
- 429 Too Many Requests: Include `Retry-After` header (seconds until reset)
- 503 Service Unavailable: Include `Retry-After` header (estimated recovery time)
- 202 Accepted (async): Include `Retry-After` header (polling interval)

**Client Retry Guidance**:
- Exponential backoff: 1s, 2s, 4s, 8s, 16s (max 60s)
- Max retries: 5 attempts
- Jitter: Random 0-1s to prevent thundering herd

### Circuit Breaker Configuration

**Third-Party API Protection**:

#### [Third-Party API Name, e.g., "Stripe Payment API"]
- Journey Step: [Which step depends on this API]
- Timeout: [5-30 seconds]
- Circuit: Open after [5] consecutive failures
- Half-open retry: After [30-60 seconds]
- Fallback: [Return cached data / degraded response / user error message]
- Reasoning: [Why this configuration serves the journey]

### Journey-Based Reasoning

[3-5 sentences tracing idempotency, retry, and circuit breaker strategies to:
- Journey operations requiring idempotency (payments, orders, mutations)
- Journey steps tolerating retries (async operations, non-critical actions)
- Third-party dependencies from Session 4 architecture
- User experience impact (prevent duplicate charges, handle downtime gracefully)]
```

---

**Output Format:**

```markdown
## Error Handling Philosophy

### Standard Error Format:

[Document JSON error format with examples]

### Status Code Usage:

[List common scenarios and their status codes]

### Journey-Based Error Design:

[How do errors relate to journey steps? What errors do users need to recover from?]

### Examples:

- `400 VALIDATION_ERROR`: [When? Example?]
- `401 INVALID_TOKEN`: [When? Example?]
- `429 RATE_LIMIT_EXCEEDED`: [When? Example? Recovery?]
- `422 INSUFFICIENT_CREDITS`: [When? Example? Recovery?]
```

---

### Step 7: Document Design Decisions and Create Context Version

Use template at `/templates/08-api-design-template.md` for complete structure.

Write `product-guidelines/08-api-design.md` with:
- **Overview**: API paradigm, serialization format, versioning strategy
- **API Paradigm Decision**: Full analysis with journey traceability
- **Serialization Format Decision**: Full analysis with paradigm alignment
- **Authentication Strategy**: Method, placement, lifetime, authorization patterns
- **Rate Limiting Strategy**: Limits by tier, endpoint-specific rules
- **Pagination Strategy**: Approach, format, when to use which method
- **Error Handling Philosophy**: Format, status codes, journey-based error design
- **Scale-Forward Strategy**: How decisions evolve as product grows
- **"What We DIDN'T Choose"**: At least 3 paradigm alternatives + 3 serialization alternatives with reasoning

**Create Context Version** at `product-guidelines/08-api-design.ctx.md`:

After writing the full API design, invoke the distillation sub-agent:

```bash
Task tool with:
- subagent_type: distill-context
- Source file: product-guidelines/08-api-design.md
- Output file: product-guidelines/08-api-design.ctx.md
```

The distillation agent will create a condensed version (50-100 lines) for Session 10 (backlog generation):

**What to include**:
- Paradigm choice (1 line)
- Serialization format (1 line)
- Auth method (1 line)
- Rate limiting approach (2-3 lines)
- Pagination approach (2-3 lines)
- Error format (2-3 lines)
- Brief reasoning (2-3 sentences per decision)
- Reference to full file for complete analysis

**What to EXCLUDE**:
- Full decision tree analysis
- Complete journey traceability citations
- Scale-forward strategy details
- "What We DIDN'T Choose" alternatives
- Detailed examples

---

## What We DIDN'T Choose (And Why)

Include at least 3 API paradigm alternatives and 3 serialization format alternatives:

### GraphQL API
**What**: Query language letting clients request exact data needed
**Why not**: [Journey-based reasoning]
**Reconsider if**: Mobile app needs bandwidth optimization, UI needs highly variable data shapes, 50+ optional fields per entity

### gRPC API
**What**: High-performance RPC with Protocol Buffers (binary)
**Why not**: [Journey-based reasoning]
**Reconsider if**: Microservices with service-to-service calls, need bidirectional streaming, internal-only APIs

### WebSocket for Real-Time
**What**: Persistent bidirectional connection
**Why not**: [Journey-based reasoning]
**Reconsider if**: Need <500ms updates (real-time collab), many users watching same resource

### Protobuf Serialization
**What**: Binary schema-based format (compact, fast)
**Why not**: [Journey-based reasoning]
**Reconsider if**: Performance bottleneck, mobile bandwidth constraints, microservices with gRPC

### MessagePack Serialization
**What**: Binary JSON alternative (no schema required)
**Why not**: [Journey-based reasoning]
**Reconsider if**: Need binary format but no schema, cache optimization, internal APIs

### XML Serialization
**What**: Verbose text format with schema (SOAP legacy)
**Why not**: [Journey-based reasoning]
**Reconsider if**: Legacy system integration, enterprise SOAP requirements

---

## Output Files

1. **`product-guidelines/08-api-design.md`**: Full documentation (paradigm, serialization, auth, rate limiting, pagination, errors, scale-forward, alternatives)
2. **`product-guidelines/08-api-design.ctx.md`**: Condensed version for Session 10 (backlog generation) - decisions only (~50-100 lines)

---

## Quality Checklist

Before completing this session, verify:

**Journey Alignment:**
- [ ] API paradigm decision traces to specific journey steps
- [ ] REST design patterns documented (if paradigm = REST)
- [ ] API documentation standards defined (naming convention, timestamps, UUIDs, null handling)
- [ ] Serialization format aligns with performance/bandwidth needs from journey
- [ ] Authentication strategy matches journey security requirements
- [ ] Rate limiting aligns with pricing model and journey scale
- [ ] Pagination approach fits data volume and UX needs
- [ ] Security patterns reference specific journey steps and database tables

**Decision Traceability:**
- [ ] Each decision cites journey steps, tech stack, or architecture
- [ ] Paradigm choice references at least 3 of 5 decision criteria
- [ ] Serialization format references paradigm alignment
- [ ] No decisions are arbitrary or "best practice" without reasoning
- [ ] OWASP patterns cite journey steps or database schema (Session 7)
- [ ] Input validation traces to journey input scenarios

**Completeness:**
- [ ] All 5 API paradigm criteria analyzed
- [ ] All 6 serialization format criteria analyzed
- [ ] Authentication strategy includes method, placement, lifetime, authorization
- [ ] OWASP API Top 10 protection patterns documented for applicable risks
- [ ] Input validation strategy includes paradigm-specific approach and sanitization
- [ ] Security headers documented (HSTS, X-Content-Type-Options, X-Frame-Options, CSP)
- [ ] Rate limiting includes limits by tier and endpoint-specific rules
- [ ] Pagination includes approach, format, and when to use
- [ ] HTTP caching strategy documented (if REST/HTTP-based paradigm)
- [ ] Error handling includes format, status codes, and journey-based design

**Security Coverage (OWASP API Top 10 2023):**
- [ ] API1 (BOLA) - Analyzed for user-owned resources
- [ ] API3 (Property-Level Auth) - Analyzed for sensitive fields
- [ ] API5 (BFLA) - Analyzed for admin/owner endpoints
- [ ] API6 (Business Flows) - Analyzed for abuse scenarios (password reset, orders, invitations)
- [ ] API7 (SSRF) - Analyzed for user-provided URLs
- [ ] API8 (Security Misconfiguration) - Security headers documented
- [ ] API10 (Unsafe API Consumption) - Analyzed for third-party API dependencies
- [ ] Input validation strategy complete with sanitization rules

**Technical Quality:**
- [ ] Paradigm choice matches tech stack capabilities
- [ ] Serialization format compatible with paradigm
- [ ] Auth method from tech stack implemented correctly
- [ ] Rate limiting prevents abuse without hindering UX
- [ ] Error format actionable and user-friendly
- [ ] Security patterns are journey-specific (not generic security advice)
- [ ] Validation library matches tech stack (from Session 3)

**Documentation:**
- [ ] "What We DIDN'T Choose" section complete (3+ paradigm + 3+ format alternatives)
- [ ] Each alternative has "Reconsider if" conditions
- [ ] Scale-forward strategy explains evolution path
- [ ] Context file created and condensed (not full analysis)
- [ ] Security patterns preserved in context file for Session 10

**Context Version (for backlog generation):**
- [ ] Context file created at `08-api-design.ctx.md`
- [ ] File is 50-100 lines (not bloated with analysis)
- [ ] Includes all decisions with brief reasoning
- [ ] References full file for complete analysis

---

## After This Session

**Next steps**:
- Run `/generate-api-contracts` (Session 8b) to create technical implementation (OpenAPI spec, schemas, endpoints)
- Session 8b will read `08-api-design.md` to implement paradigm and serialization decisions

**Use design for**:
- Guiding Session 8b technical contracts
- Informing Session 10 backlog (API-driven stories)
- Communicating architecture to team
- Evaluating scale needs

---

## Remember

**Every API decision must serve the user journey.**

Don't choose paradigms or formats because they're "modern" or "best practice". Design based on:
1. What journey steps require APIs? → Paradigm
2. What are the latency/bandwidth requirements? → Serialization
3. What security does the journey need? → Auth
4. What scale does the journey reach? → Rate limiting
5. What data volume do users see? → Pagination

If you can't trace a decision back to a journey step, tech stack choice, or architecture requirement, reconsider.

**Reference files:**
- Journey: `product-guidelines/00-user-journey.ctx.md`
- Tech stack: `product-guidelines/02-tech-stack.md`
- Architecture: `product-guidelines/04-architecture.ctx.md`
- Database schema: `product-guidelines/07-database-schema.ctx.md` (from previous session)
- Serialization guide: `reference-material/serialization-guide.md` (decision tree lines 939-1071)

---

**Now, read previous outputs and make API design decisions that serve your users' journey!**

## After Generating API Design Document

Once you've written `product-guidelines/08-api-design.md`, invoke the distillation agent to create a context file:

Use the Task tool:
- **subagent_type**: `general-purpose`
- **description**: `Generate API design context file`
- **prompt**:
  ```
  Invoke the context distillation agent to create token-optimized context file.

  Source file: product-guidelines/08-api-design.md
  Output file: product-guidelines/08-api-design.ctx.md

  Follow the distillation agent specification in .claude/agents/distill-context.md to:
  1. Extract ALL API paradigm, serialization, auth, rate limiting decisions (CRITICAL)
  2. Extract ALL OWASP API security protection patterns (CRITICAL for Session 10 backlog)
  3. Extract input validation strategy (validation library, key rules)
  4. Extract security headers configuration
  5. Extract key design decisions and patterns
  6. Remove detailed rationale, examples, and decision tree explanations
  7. Preserve section structure from source file
  8. Achieve 60-65% token reduction (slightly lower due to critical security content)
  9. Add source reference header
  10. Write to output file path
  ```

## Output Format

IMPORTANT: Do not use emojis in generated outputs. Use plain text for all communication.
