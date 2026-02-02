---
description: Session 8b - Generate technical API contracts (OpenAPI/Protobuf specs, schemas, endpoints)
---

# Generate API Contracts (Session 8b)

You are helping the user create technical API implementation specifications including OpenAPI/Protobuf schemas, endpoint definitions, request/response examples, and validation rules. This happens after defining high-level API design (Session 8), implementing the paradigm and serialization format decisions.

## When to Use This

**This is Session 8b** in the core Stack-Driven cascade. Run it:
- After Session 8 (`/generate-api-design` - paradigm, serialization, auth strategy)
- After Session 7 (`/design-database-schema` - data model)
- Before Session 9 (`/create-test-strategy` - testing approach)
- When you need to define technical API contracts based on API design decisions

**Skip this** if:
- You're building a frontend-only application (no backend)
- Your product doesn't expose APIs
- You prefer to evolve APIs incrementally during development

## Your Task

Create technical API implementation specifications:
- OpenAPI 3.1 specification (if REST)
- GraphQL SDL schema (if GraphQL)
- Protocol Buffers schemas (if gRPC)
- MessagePack/CBOR contract structure (if binary schemaless formats)
- Endpoint definitions with HTTP methods, paths, and parameters
- Request and response schemas with validation rules
- Component schemas and reusable definitions
- Example requests and responses
- Validation rules and constraints

---

## Process

### Step 0: Read API Design Decisions (Session 8)

**CRITICAL - Read this first:**

```
Read: product-guidelines/08-api-design.ctx.md (context version for token efficiency)
```

**Extract from API Design**:
- **API Paradigm**: REST, GraphQL, gRPC, WebSocket, or hybrid
- **Serialization Format**: JSON, Protobuf, MessagePack, or hybrid
- **Authentication Strategy**: Method, token placement, lifetime
- **Rate Limiting Strategy**: Limits by tier, endpoint-specific rules
- **Pagination Approach**: Cursor-based or offset-based
- **Error Handling Format**: Standard error structure and status codes

**Why this matters**: Session 8b implements the architectural decisions from Session 8. If API design chose gRPC, you'll create Protocol Buffer schemas. If it chose REST with JSON, you'll create OpenAPI specs. If it chose hybrid (gRPC internal + REST external), you'll create both.

---

### Step 1: Read Previous Outputs

**Required inputs:**

```
Read: product-guidelines/00-user-journey.ctx.md  # (context version for token efficiency)
Read: product-guidelines/02-tech-stack.ctx.md  # (context version for token efficiency)
Read: product-guidelines/04-architecture.ctx.md  # (context version for token efficiency)
Read: product-guidelines/07-database-schema.ctx.md  # (context version for token efficiency)
Read: product-guidelines/08-api-design.ctx.md  # (context version for token efficiency)
```

**Context Optimization**: We read .ctx.md files for significant context reduction. The database schema context file (~56% smaller) contains table list, ERD, relationships, and data access patterns—sufficient for API implementation without column details, indexes, and migrations. The API design context file contains high-level decisions (paradigm, serialization, auth) without full analysis.

**Optional inputs (if available):**

```
Read: product-guidelines/02a-constraints.ctx.md (if exists - regulatory requirements)
Read: product-guidelines/10-backlog/BACKLOG.md (if exists - backlog comes after API contracts in Session 10)
Read: product-guidelines/12-project-scaffold.md (if exists - scaffold comes after in Session 12)
```

**Extract from Journey**:
- What user actions require API endpoints?
- What data flows through the system?
- What are the critical path operations?
- What integration points exist with external systems?

**Extract from Tech Stack**:
- Backend framework (FastAPI, Express, NestJS, Django, etc.)
- Authentication method (JWT, OAuth, API keys, Clerk, Auth0)
- API style preference (REST, GraphQL, gRPC)
- Documentation tools (Swagger UI, Redoc, Postman)

**Extract from Architecture**:
- API design patterns (REST principles, HATEOAS, etc.)
- Security requirements
- Rate limiting strategy
- Caching approach
- Multi-tenancy implementation

**Extract from Backlog (if available)**:
- What features need what endpoints?
- What data operations are required (CRUD, search, bulk)?
- What integrations are planned (webhooks, third-party APIs)?
- Note: Backlog is generated AFTER this session, so focus on journey and architecture if backlog doesn't exist yet

**Extract from Database Schema (required):**
- What entities exist?
- What relationships need API exposure?
- What query patterns should be supported?

**Extract from Constraints (if available):**
- What regulatory requirements apply (GDPR, HIPAA, PCI DSS, SOC 2)?
- Are there EU users requiring GDPR compliance?
- What compliance frameworks are in scope?

**Example**: compliance-saas needs document upload, framework selection, assessment results, report sharing → FastAPI REST API with JWT auth, multi-tenant, rate-limited

---

### Step 2: Identify Core Resources

**Decision Tree - Resource Identification:**

```
For each entity in database schema or backlog, ask:

1. Does this entity need CRUD operations via API?
   - YES → Create resource endpoints (/api/resources)
   - NO → Skip or create specialized endpoints only

2. Is this a user-owned resource?
   - YES → Add authentication + ownership filtering
   - NO → It's a system resource (may be public or admin-only)

3. Does this resource have relationships?
   - YES → Decide on nested routes vs query params
   - NO → Simple flat resource structure

4. Does this resource need special operations beyond CRUD?
   - YES → Add custom action endpoints
   - NO → Standard REST operations suffice
```

**Example**: compliance-saas journey → Resources: `/api/documents` (upload, CRUD), `/api/frameworks` (read-only), `/api/assessments` (create, poll status, results), `/api/teams` (multi-tenancy), special endpoints for sharing (`/api/assessments/:id/share`, `/public/reports/:token`)

---

### Step 3: Define Endpoint Structure

**Endpoint Naming Conventions:**

Follow REST best practices (if using REST):

```
Pattern: /api/{version}/{resource}/{id?}/{sub-resource?}/{action?}

Collection operations:
GET    /api/v1/documents          - List all (paginated)
POST   /api/v1/documents          - Create new
DELETE /api/v1/documents          - Bulk delete (optional)

Single resource operations:
GET    /api/v1/documents/:id      - Get one
PUT    /api/v1/documents/:id      - Full update
PATCH  /api/v1/documents/:id      - Partial update
DELETE /api/v1/documents/:id      - Delete one

Sub-resources:
GET    /api/v1/documents/:id/assessments   - List document's assessments
POST   /api/v1/documents/:id/assessments   - Create assessment for document

Custom actions (non-CRUD):
POST   /api/v1/documents/:id/process       - Trigger document processing
POST   /api/v1/assessments/:id/share       - Generate shareable link
POST   /api/v1/teams/:id/invite            - Invite member to team

Query parameters for filtering, sorting, pagination:
GET /api/v1/documents?status=pending&sort=created_at&limit=20&cursor=abc123
```

**GraphQL naming** (if using GraphQL):
- Queries: `document(id: ID!)`, `documents(filter: DocumentFilter, limit: Int)`
- Mutations: `createDocument(input: CreateDocumentInput!)`, `updateDocument(id: ID!, input: UpdateDocumentInput!)`
- Subscriptions: `documentProcessed(documentId: ID!)`

**gRPC naming** (if using gRPC):
- Service: `DocumentService`
- RPCs: `GetDocument(GetDocumentRequest)`, `ListDocuments(ListDocumentsRequest)`, `CreateDocument(CreateDocumentRequest)`

---

### Step 4: Invoke Phase 1 Agent (Security & Data Integrity) - ALWAYS REQUIRED

**Phase 1 is mandatory for ALL API contracts.**

**Read Phase 1 agent for comprehensive guidance:**

```
Read: .claude/agents/api-contracts-phase1-security.md
```

**Apply Phase 1 patterns** (see agent for complete details):

**1. PII Field Identification and Marking:**
- Scan Session 7 database schema for PII fields (email, name, phone, address, SSN, etc.)
- Mark all PII fields in API schemas with `x-pii: true` extension
- Add `x-gdpr-category` for classification (direct-identifier, indirect-identifier, sensitive-data)

**2. GDPR Export Endpoint (Conditional):**
- **IF** Session 2a indicates EU users or GDPR requirements
- **THEN** add mandatory `/api/users/{user_id}/export` endpoint
- Returns all personal data in machine-readable JSON format (Article 20 compliance)

**3. Database-to-API Type Mapping:**
- `NUMERIC/DECIMAL` (money) → `string` (not float, prevents precision loss)
- `BIGINT` → `string` in JSON (JavaScript safety, no truncation)
- `TIMESTAMP` → ISO 8601 with timezone (`2024-01-15T10:30:00Z`)
- `UUID` → `string` with `format: uuid`

**4. Validation Rules Enforcement:**
- Propagate all DB constraints to API validation
- `NOT NULL` → `required: true`
- `VARCHAR(255)` → `maxLength: 255`
- `CHECK` constraints → regex patterns or enums
- Add input sanitization rules per field type (see Phase 1 agent)

**5. DoS Prevention Limits:**
- Max request body size: 10 MB (50 MB for file uploads)
- Max nesting depth: 10 levels
- Max array length: 1,000 items
- Request timeout: 30 seconds
- Max URL length: 2,048 characters

**6. Deserialization Security Warnings:**
- Never use Python pickle, `yaml.load()` without SafeLoader, `eval()`
- Always use `JSON.parse()`, `yaml.safe_load()`, XML with disabled external entities
- Document safe deserialization practices in API spec

**Why Phase 1 matters**: Prevents money precision loss ($1.99 becomes $1.9899999), JavaScript ID truncation (large integers corrupted), timezone ambiguity, GDPR violations, and security vulnerabilities.

**Output from Phase 1:**
- PII fields marked in all schemas
- GDPR export endpoint (if applicable)
- Type mappings applied to all schemas
- Validation rules on all request schemas
- Security warnings in API documentation

---

### Step 5: Define Authentication and Authorization

**Authentication Strategy:**

**Decision Tree - Auth Method:**

```
From tech stack, determine auth method:

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

**Example auth**: Clerk JWT in `Authorization: Bearer <token>` header, applied to all endpoints except `/public/*`

**Authorization patterns:**
- User-owned: `WHERE user_id = :current_user_id`
- Team resource: `WHERE team_id = :current_user_team_id`
- Admin only: `WHERE role = 'admin' OR team_id = :id`
- Rate limit: Check `usage < plan_limits`

---

### Step 6: Define Error Handling

**Error Response Format:**

**Standardize all errors:**

```json
{
  "error": {
    "code": "ERROR_CODE",              // Machine-readable constant
    "message": "Human-readable error", // User-facing message
    "details": {},                     // Optional: additional context
    "field": "fieldName",              // Optional: which field caused error
    "requestId": "req_abc123"          // Optional: for support debugging
  }
}
```

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

**Example errors**: All use format `{error: {code, message, details?, field?, requestId?}}`
- 400: `VALIDATION_ERROR` (invalid input)
- 401: `INVALID_TOKEN` (auth failed)
- 429: `RATE_LIMIT_EXCEEDED` (includes limit, remaining, resetAt)
- 422: `INSUFFICIENT_CREDITS` (business logic error)

**Webhook Endpoint Schema Templates (if webhooks exist from Session 2a/8):**

If Session 8 included webhook endpoint design (Step 5c), add OpenAPI schemas for webhook endpoints:

**Reference**: `/examples/integration-patterns-examples.md` Section 5 (OpenAPI Webhook Schema Templates) for complete webhook schemas including:
- Stripe webhook endpoint (`/webhooks/stripe`) with Stripe-Signature header, event types enum, and 200 OK response
- Salesforce CDC webhook endpoint (`/webhooks/salesforce`) with X-Salesforce-Signature header and change event structure
- SendGrid webhook endpoint (`/webhooks/sendgrid`) with X-Twilio-Email-Event-Webhook-Signature header and email events
- PayPal webhook endpoint (`/webhooks/paypal`) with PAYPAL-* headers and postback verification pattern
- Generic HMAC webhook pattern (HubSpot, Twilio) with signature verification headers

**Key Webhook Schema Characteristics**:
- `security: []` (no bearer token, uses signature verification headers instead)
- Signature header as required parameter (X-Stripe-Signature, X-Salesforce-Signature, etc.)
- Event ID property (for idempotency tracking)
- Event type enum (provider-specific event types like payment_intent.succeeded, contact.updated)
- 200 OK response with `{received: true, duplicate?: boolean}` format
- 401 Unauthorized response for invalid signature

**Example** (abbreviated Stripe webhook schema):

```yaml
/webhooks/stripe:
  post:
    summary: Stripe webhook receiver
    description: Receives payment and subscription events from Stripe
    tags:
      - Webhooks
    security: []  # No bearer token
    parameters:
      - name: Stripe-Signature
        in: header
        required: true
        schema:
          type: string
        description: HMAC-SHA256 signature (format: t=<timestamp>,v1=<signature>)
    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            required: [id, type, data, created]
            properties:
              id:
                type: string
                description: Unique event ID (for idempotency)
                example: "evt_1NqPNJ2eZvKYlo2C9xQpZ8Vz"
              type:
                type: string
                enum:
                  - payment_intent.succeeded
                  - customer.subscription.created
                  - invoice.payment_failed
              data:
                type: object
              created:
                type: integer
    responses:
      '200':
        description: Webhook received and queued
        content:
          application/json:
            schema:
              type: object
              properties:
                received:
                  type: boolean
                  example: true
                duplicate:
                  type: boolean
                  example: false
      '401':
        description: Invalid signature
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Error'
```

**Include webhook schemas for all providers** identified in Session 8 webhook endpoint design. Copy complete schemas from `/examples/integration-patterns-examples.md` Section 5.

**If webhooks do NOT exist**: Skip webhook schema templates.

---

### Step 7: Invoke Phase 3 Agent (Performance Optimization) - CONDITIONAL

**Conditional Invocation Decision:**

```
Does the journey have ANY of:
1. Mobile users (bandwidth constraints)?
2. High-volume traffic (>10K requests/day)?
3. Large payloads (lists, nested data)?
4. Real-time requirements?

├─ YES → Invoke Phase 3 (performance critical)
└─ NO → Skip Phase 3 (performance not critical)
```

**If Phase 3 invoked, read the agent:**

```
Read: .claude/agents/api-contracts-phase3-performance.md
```

**Apply Phase 3 patterns** (see agent for complete details):

**1. Response Size Limits:**
- Default list limit: 100 items
- Maximum list limit: 1000 items
- Enforce via `limit` query parameter with validation

**2. Compression Strategy:**
- JSON: gzip (default), Brotli (higher compression, slower)
- Protobuf: LZ4 (fast, low CPU), Snappy (balanced), or no compression (if already small)
- Configure `Accept-Encoding` header support

**3. Field Selection Patterns:**
- REST: Sparse fieldsets (`?fields=id,name,email` excludes other fields)
- GraphQL: Native field selection (query only needed fields)
- gRPC: `google.protobuf.FieldMask` for partial responses

**4. HTTP Caching:**
- GET endpoints: `Cache-Control: max-age=3600` for static data
- Conditional requests: `ETag` / `If-None-Match` (304 Not Modified)
- `Last-Modified` / `If-Modified-Since` for time-based caching

**5. Protobuf Varint Optimization:**
- Use `int32`/`int64` (varint encoding) for small numbers
- Use `fixed32`/`fixed64` for large numbers (> 2^28)

**Why Phase 3 matters**: Reduces bandwidth usage by 60-80%, improves mobile performance, lowers server costs, prevents DoS from large payloads.

**If Phase 3 skipped**: Document that performance optimization was deferred. Can be added later if needed.

---

### Step 8: Invoke Phase 2 Agent (API Versioning & Evolution) - ALWAYS REQUIRED

**Phase 2 is mandatory for ALL API contracts.**

**Read Phase 2 agent for comprehensive guidance:**

```
Read: .claude/agents/api-contracts-phase2-versioning.md
```

**Apply Phase 2 patterns** (see agent for complete details):

**1. Breaking Change Matrix:**
- Document what changes break clients (removed fields, type changes, renamed endpoints)
- Document safe changes (new optional fields, new endpoints, new enum values with fallback)

**2. Versioning Strategy Selection:**
- URL versioning: `/api/v1/resources`, `/api/v2/resources` (most common, visible)
- Header versioning: `X-API-Version: 2` or `Accept: application/vnd.api+json; version=2`
- Media type versioning: `Accept: application/vnd.myapi.v2+json`
- Choose ONE strategy, document in API design spec

**3. Protobuf Reserved Fields:**
- When removing/renaming fields, add to `reserved` statement
- Prevents field number reuse, ensures backward compatibility
- Example: `reserved 2, 15, 9 to 11; reserved "foo", "bar";`

**4. OpenAPI Deprecation Annotations:**
- Mark deprecated endpoints: `deprecated: true`
- Add sunset date: `x-sunset-date: "2025-12-31"`
- Add replacement: `x-replacement-endpoint: "/api/v2/resources"`

**5. Migration Strategies:**
- **Dual-write**: Write to both v1 and v2 schemas during transition
- **Feature flags**: Gradual rollout of breaking changes
- **Adapter pattern**: v1 endpoints wrap v2 with translation layer

**6. Deprecation Timeline:**
- Announce deprecation: 6-12 months before removal (public APIs)
- Monitor usage: Track deprecated endpoint traffic
- Sunset date: Hard deadline for removal
- Communication: Email notifications, API headers (`Sunset: Sat, 31 Dec 2025 23:59:59 GMT`)

**Why Phase 2 matters**: Prevents breaking existing clients, enables evolution without disruption, maintains API contract trust.

**Output from Phase 2:**
- Breaking change matrix documented
- Versioning strategy chosen and documented
- Protobuf reserved fields (if gRPC)
- OpenAPI deprecation annotations (if REST)
- Migration timeline for future changes

---

### Step 9: Webhook Endpoints (If Applicable)

**Decision Tree - Webhook Requirements:**

```
Does the journey require event notifications to external systems?
├─ YES → Define webhook endpoints
└─ NO → Skip webhooks
```

**If webhooks needed**, define inbound webhook endpoints for third-party integrations:

**Endpoint Pattern**: `/webhooks/{provider}`

**For each provider that sends webhooks, create specification:**

```yaml
paths:
  /webhooks/stripe:
    post:
      summary: Stripe webhook handler
      description: |
        Receives webhook events from Stripe for payment processing.

        **Security**: Verifies Stripe signature using webhook secret.
        **Idempotency**: Checks event_id before processing (webhook_events table).
        **Processing**: Enqueues for async processing, returns 200 immediately.
      operationId: handleStripeWebhook
      tags: [Webhooks]
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                id:
                  type: string
                  description: Unique event identifier (for idempotency)
                  example: evt_1234567890
                type:
                  type: string
                  description: Event type
                  example: payment_intent.succeeded
                data:
                  type: object
                  description: Event payload
      responses:
        '200':
          description: Webhook received and queued for processing
          content:
            application/json:
              schema:
                type: object
                properties:
                  received:
                    type: boolean
                    example: true
        '400':
          description: Invalid signature or malformed payload
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
```

**Key Elements for Each Webhook Endpoint:**
- Request body schema (provider-specific)
- Signature verification method (if applicable)
- Idempotency strategy (how duplicate events are handled)
- Response format (typically 200 with `{received: true}`)
- Error responses (400 for invalid signature, 422 for invalid payload)

---

### Step 10: Invoke Phase 5 Agent (Format Coverage) - CONDITIONAL

**Conditional Invocation Decision:**

```
What API paradigm and format was chosen in Session 8?

├─ REST + JSON only → Skip Phase 5 (OpenAPI 3.1 sufficient)
├─ GraphQL → Invoke Phase 5 (GraphQL SDL generation)
├─ gRPC/Protobuf → Already covered in Phase 1-4 (Protobuf patterns)
├─ MessagePack → Invoke Phase 5 (MessagePack contract structure)
├─ CBOR → Invoke Phase 5 (CBOR contract structure)
└─ Hybrid (REST+gRPC, REST+GraphQL) → Invoke Phase 5 (mapping between formats)
```

**If Phase 5 invoked, read the agent:**

```
Read: .claude/agents/api-contracts-phase5-formats.md
```

**Apply Phase 5 patterns** (see agent for complete details):

**1. GraphQL SDL Schema Generation:**
- Define types for all resources
- Define queries, mutations, subscriptions
- Add directives for auth, caching, deprecation
- Validate against journey requirements (no over-fetching)

**2. MessagePack Contract Structure:**
- Define message schemas (similar to JSON, but binary-efficient)
- Document type mappings (map keys, arrays, integers, strings)
- Add validation rules (manual, no schema validation like JSON Schema)

**3. CBOR Contract Structure:**
- Define CDDL (Concise Data Definition Language) schemas
- Document CBOR tags for typed data (timestamps, bigints, URIs)
- Add validation rules using CDDL

**4. Hybrid Architecture Mapping:**
- Document translation between REST and gRPC
- Define gateway layer (Envoy, custom REST gateway)
- Map error codes (gRPC status → HTTP status)
- Map timestamps (ISO 8601 → google.protobuf.Timestamp)

**Why Phase 5 matters**: Ensures format-specific best practices, prevents over-fetching (GraphQL), optimizes bandwidth (MessagePack/CBOR), enables hybrid architectures.

**If Phase 5 skipped**: Only OpenAPI 3.1 spec needed for REST+JSON (default case).

---

### Step 11: Invoke Phase 4 Agent (Code Generation & Contract Testing) - ALWAYS REQUIRED

**Phase 4 is mandatory for ALL API contracts.**

**Read Phase 4 agent for comprehensive guidance:**

```
Read: .claude/agents/api-contracts-phase4-codegen.md
```

**Apply Phase 4 patterns** (see agent for complete details):

**1. OpenAPI Client SDK Generation:**
- TypeScript: `openapi-generator-cli generate -g typescript-axios`
- Python: `openapi-generator-cli generate -g python`
- Go: `oapi-codegen` (better than openapi-generator)
- Document commands, output paths, configuration options

**2. Protobuf Client SDK Generation:**
- Define `protoc` commands with language-specific plugins
- TypeScript: `protoc --plugin=protoc-gen-ts_proto --ts_proto_out=./src/api`
- Python: `python -m grpc_tools.protoc --python_out=. --grpc_python_out=.`
- Go: `protoc --go_out=. --go-grpc_out=.`

**3. Session 12 Scaffold Integration:**
- Document WHERE generated code should be placed:
  - Frontend: `src/api-client/` or `lib/api/`
  - Backend: `internal/api/` or `src/generated/`
- Add generation scripts to `package.json` / `Makefile`
- Define `npm run generate:api` or `make generate-api` commands

**4. Contract Testing Tool Selection:**
- **REST APIs**: Dredd (OpenAPI contract testing), Pact (consumer-driven)
- **gRPC APIs**: grpc-testing, protoc-gen-validate
- **GraphQL APIs**: Apollo Client devtools, GraphQL Inspector
- Document configuration (dredd.yml, authentication hooks)

**5. Type Consistency Validation:**
- Create validation script template that checks:
  - Database schema types → API response types
  - API request types → Client SDK types
  - Ensures no type drift across layers

**6. CI/CD Pipeline Integration:**
- Add contract testing to `.github/workflows/test.yml`
- Run on every PR, block merge if contracts violated
- Generate and publish HTML reports

**Why Phase 4 matters**: Eliminates manual client SDK creation, prevents type drift, catches API breaking changes before deployment, ensures client-server compatibility.

**Output from Phase 4:**
- Client SDK generation commands for all tech stack languages
- Session 12 integration guidance (where to place generated code)
- Contract testing tool configuration
- Type consistency validation script template
- CI/CD pipeline integration examples

---

### Step 12: Generate API Specification

**Based on paradigm from Session 8, generate the appropriate specification:**

#### For REST APIs (JSON serialization):

Create complete **OpenAPI 3.1** specification. Use template at `/templates/08b-api-contracts-template.md` for detailed structure.

**Why OpenAPI 3.1?**
- Full JSON Schema 2020-12 support (better validation than 3.0)
- Improved schema composition (`prefixItems`, `unevaluatedProperties`)
- Native `null` type (no more `nullable: true` workaround)
- Better const/enum handling for stricter validation

**Key sections to include:**
- `info`: title, description (with auth/rate limit/error conventions), version, contact
- `servers`: production, staging, local development URLs
- `tags`: group endpoints by resource type
- `paths`: each endpoint with summary, description, tags, security, parameters, requestBody, responses
- `components`: securitySchemes (bearerAuth), schemas (all data models), responses (reusable error responses)

**Best practices:**
- Use `$ref` for reusable schemas and responses
- Include examples in schemas
- Mark required fields explicitly
- Use JSON Schema 2020-12 validation (formats, min/max, enums, patterns)
- Document all error responses (4xx, 5xx)

#### For GraphQL APIs:

Create **GraphQL SDL schema** with types, queries, mutations, subscriptions. See Phase 5 agent for complete guidance.

#### For gRPC APIs:

Create **Protocol Buffers `.proto` files** with service definitions, message types, and field options. Apply patterns from Phases 1-4.

#### For Hybrid APIs:

Generate both OpenAPI and Protobuf specs with mapping documentation. See Phase 5 agent for translation layer guidance.

---

### Step 13: Document API Technical Implementation

Write `product-guidelines/08b-api-contracts.md` with:

**Structure:**
1. **Overview**
   - Link to `08-api-design.md` for paradigm/serialization decisions
   - Endpoint count, resource count
   - Applied phases summary (Phase 1: Security, Phase 2: Versioning, Phase 3: Performance if applicable, Phase 4: Code Generation, Phase 5: Format Coverage if applicable)

2. **Core Resources**
   - For each resource: purpose (journey connection), endpoints table

3. **API Specification**
   - OpenAPI 3.1 spec (complete or link to `openapi.yaml`)
   - GraphQL SDL (if GraphQL)
   - Protobuf schemas (if gRPC, link to `.proto` files)

4. **Phase 1: Security & Data Integrity**
   - PII fields marked in schemas
   - GDPR export endpoint (if applicable)
   - Type mappings applied (NUMERIC→string, BIGINT→string, etc.)
   - Validation rules summary
   - Deserialization security warnings

5. **Phase 2: API Versioning & Evolution**
   - Breaking change matrix
   - Versioning strategy chosen
   - Deprecation timeline template
   - Migration strategies

6. **Phase 3: Performance Optimization** (if applicable)
   - Response size limits
   - Compression strategy
   - Field selection patterns
   - HTTP caching rules

7. **Phase 4: Code Generation & Contract Testing**
   - Client SDK generation commands (TypeScript, Python, Go, etc.)
   - Session 12 integration (where generated code goes)
   - Contract testing tool configuration
   - Type consistency validation script

8. **Phase 5: Format Coverage** (if applicable)
   - GraphQL SDL schema (if GraphQL)
   - MessagePack contract structure (if MessagePack)
   - Hybrid architecture mapping (if hybrid)

9. **Request/Response Examples**
   - Sample payloads for key endpoints

10. **Testing**
    - Example curl/httpie/grpcurl commands
    - Dredd/Pact configuration

**Note**: High-level design decisions (paradigm, serialization, auth strategy, rate limiting, pagination) are in `08-api-design.md` (Session 8). This file focuses on technical implementation with all 5 phases applied.

---

### Step 14: Create Context Version for Scaffold Generation

**IMPORTANT**: After writing the full contracts file, invoke the distillation sub-agent:

```bash
Task tool with:
- subagent_type: distill-context
- Source file: product-guidelines/08b-api-contracts.md
- Output file: product-guidelines/08b-api-contracts.ctx.md
```

**Distillation instructions** (for the sub-agent):

```
Create token-optimized context file from Session 8b API contracts.

Target: 80% token reduction (API contracts are highly structured, mostly endpoint lists).

KEEP:
- Endpoint list with methods and paths
- Core resource list
- Applied phases summary (Phases 1, 2, 3 if applicable, 4, 5 if applicable)
- Journey-to-endpoint mapping
- Client SDK generation commands summary
- Contract testing tool chosen

REMOVE:
- Full OpenAPI/Protobuf/GraphQL schemas (Session 12 reads full file for code gen)
- Request/response examples
- Detailed validation rules
- Testing curl commands
- Webhook endpoint details
- Detailed phase explanations

Session 12 (scaffold) will read .ctx.md for endpoint overview, then read full .md for complete schemas and generation commands.
```

---

### Step 15: Validate API Design

**Quality Checklist:**

**Journey Alignment:**
- [ ] All journey actions have corresponding API endpoints
- [ ] Critical path (Steps 1-3) fully supported by API
- [ ] No endpoints that don't serve journey steps
- [ ] API enables all features in backlog

**Consistency:**
- [ ] Naming conventions consistent (camelCase vs snake_case)
- [ ] Error format consistent across all endpoints
- [ ] Pagination format consistent
- [ ] Authentication method consistent

**Completeness:**
- [ ] All CRUD operations defined where needed
- [ ] All request schemas have validation rules
- [ ] All responses include success and error cases
- [ ] Authentication and authorization documented
- [ ] Rate limiting specified
- [ ] Error codes documented

**Tech Stack Alignment:**
- [ ] API style matches tech stack decision (REST/GraphQL/etc.)
- [ ] Auth method matches tech stack choice
- [ ] Framework-specific features leveraged
- [ ] OpenAPI format compatible with chosen tools

**Phase 1: Security & Data Integrity (ALWAYS REQUIRED):**
- [ ] PII fields marked with x-pii: true in schemas
- [ ] GDPR data export endpoint included (if EU users in Session 2a)
- [ ] Input sanitization rules documented per field type
- [ ] DoS prevention limits specified (max request size, nesting depth, timeout)
- [ ] Deserialization security warnings included (no pickle/unsafe YAML)
- [ ] Authentication required on protected endpoints
- [ ] Authorization checks documented
- [ ] Sensitive data not exposed in URLs
- [ ] Database NUMERIC/DECIMAL mapped to string (not float) for money
- [ ] Database BIGINT mapped to string in JSON (JavaScript safety)
- [ ] Timestamps use ISO 8601 format with timezone
- [ ] UUIDs use string type with format: uuid
- [ ] All DB constraints propagated to API validation (NOT NULL, CHECK, VARCHAR length)

**Phase 2: API Versioning & Evolution (ALWAYS REQUIRED):**
- [ ] Breaking change matrix documented (what changes break vs safe)
- [ ] Protobuf reserved fields documented for deleted/renamed fields (if gRPC)
- [ ] OpenAPI deprecation annotations present (deprecated: true, x-sunset-date, x-replacement-*) (if REST)
- [ ] API versioning strategy chosen (URL/header/query param versioning)
- [ ] Migration strategies documented for breaking changes (dual-write, feature flags, adapter)
- [ ] Deprecation timeline defined (6-12 months minimum for public APIs)
- [ ] Version history documented (what changed between versions)
- [ ] Backward compatibility rules followed (no removed fields, no type changes)

**Phase 3: Performance Optimization (CONDITIONAL):**
- [ ] If mobile users OR >10K requests/day OR large payloads → Phase 3 applied
- [ ] Response size limits specified per endpoint type (default 100, max 1000 for lists)
- [ ] Compression strategy documented per format (gzip for JSON, LZ4/Snappy for Protobuf)
- [ ] Field selection patterns documented (sparse fieldsets, FieldMask, GraphQL fields)
- [ ] Caching headers specified for GET endpoints (Cache-Control, ETag, Last-Modified)
- [ ] Protobuf varint guidance provided for integer fields (int32/int64 vs fixed32/fixed64)
- [ ] Pagination prevents large payloads
- [ ] Heavy operations are async (return 202 Accepted)

**Phase 4: Code Generation & Contract Testing (ALWAYS REQUIRED):**
- [ ] Client SDK generation commands documented for all tech stack languages (TypeScript, Python, Go, etc.)
- [ ] OpenAPI generator configuration specified (typescript-axios, python/httpx, oapi-codegen for Go)
- [ ] Protobuf/gRPC code generation commands documented (protoc plugins for each language) (if gRPC)
- [ ] Session 12 integration documented (where generated code should be placed)
- [ ] Build scripts specified (package.json scripts, Makefile targets)
- [ ] Type consistency validation script template provided (DB → API → Client type checking)
- [ ] Contract testing tool selection documented (Dredd for REST, grpc-testing for gRPC, Pact for consumer-driven)
- [ ] Contract testing configuration examples provided (dredd.yml with authentication hooks)
- [ ] CI/CD pipeline integration examples provided (.github/workflows/test.yml)

**Phase 5: Format Coverage (CONDITIONAL):**
- [ ] If GraphQL → GraphQL SDL schema generated with journey validation
- [ ] If MessagePack → MessagePack contract structure documented
- [ ] If CBOR → CBOR CDDL schema documented
- [ ] If hybrid (REST+gRPC, REST+GraphQL) → Mapping between formats documented

---

## Note on Architectural Alternatives

**Paradigm alternatives** (REST vs GraphQL vs gRPC) are covered in Session 8 (`08-api-design.md`). This session implements the chosen paradigm with technical specifications.

If you discover that the chosen paradigm doesn't fit specific endpoints during implementation, document it but don't override Session 8. Discuss with the user and potentially re-run `/generate-api-design` with updated analysis.

---

## Setup Instructions

**FastAPI**: `pip install fastapi[all]` → auto-generated docs at `/docs` (Swagger) and `/redoc`
**Express**: `npm i swagger-ui-express yamljs` → serve with `app.use('/api-docs', swaggerUi.setup(openapi))`
**Django**: `pip install drf-spectacular` → configure in settings → `python manage.py spectacular`
**Client SDKs**: Use `openapi-generator-cli generate -i openapi.yaml -g typescript-axios` (or python, java, etc.)

---

## Output Files

1. **`product-guidelines/08b-api-contracts.md`**: Full technical specification (endpoints, schemas, validation rules, all phases, examples, testing)
2. **`product-guidelines/08b-api-contracts.ctx.md`**: Condensed version for Session 9b/10 (~80% reduction) - endpoint lists, phases summary, no detailed schemas
3. **`product-guidelines/08b-api-contracts/openapi.yaml`** (if REST): Complete OpenAPI 3.1 spec (all endpoints, schemas, security)
4. **`product-guidelines/08b-api-contracts/schema.graphql`** (if GraphQL): GraphQL SDL schema with types, queries, mutations, subscriptions
5. **`product-guidelines/08b-api-contracts/*.proto`** (if gRPC): Protocol Buffer service and message definitions
6. **`product-guidelines/08b-api-contracts/postman-collection.json`** (optional): Postman/Insomnia collection with pre-configured requests

**Note**: Session 12 (scaffold) will read full `.md` file to access complete schemas and generation commands for code generation. Context file is for Session 9b/10 only.

---

## After This Session

**Next steps**:
- Run `/create-test-strategy` (Session 9) to define testing approach
- Session 9b (`/model-application`) will use `08b-api-contracts.ctx.md` for controller/service modeling
- Session 10 (`/generate-backlog`) will use `08b-api-contracts.ctx.md` for API-driven stories
  - Adds "API Contract Testing" story to backlog (Dredd/Pact setup, CI/CD integration) from Phase 4
- Session 12 (`/scaffold-project`) will use full `08b-api-contracts.md` to:
  - Auto-generate type-safe client SDKs from contracts (Phase 4)
  - Generate endpoint stubs/controllers
  - Place generated code in project structure (frontend/src/api-client/, backend/internal/api/)
  - Add generation scripts to package.json/Makefile
  - Validate type consistency (DB → API → Client)

**Use contracts for**:
- Backend implementation (controllers, routes, handlers)
- Frontend development (auto-generated type-safe API client)
- API documentation (Swagger UI, Redoc, grpcui)
- Client SDK generation (openapi-generator, protoc plugins) - **AUTOMATED in Session 12 (Phase 4)**
- Contract testing (Dredd, Pact, grpc-testing) - **Story added to Session 10 backlog (Phase 4)**

---

## Remember

**Implement the decisions from Session 8 (API Design).**

This session focuses on technical implementation with 5-phase enhancement:
1. **Phase 1** (Always): Security & Data Integrity (PII marking, type mapping, validation)
2. **Phase 2** (Always): API Versioning & Evolution (breaking changes, deprecation)
3. **Phase 3** (Conditional): Performance Optimization (compression, caching, field selection)
4. **Phase 4** (Always): Code Generation & Contract Testing (SDK gen, contract tests)
5. **Phase 5** (Conditional): Format Coverage (GraphQL, MessagePack, CBOR, hybrid)

Don't make new architectural decisions here. Instead:
1. Read `08-api-design.ctx.md` for paradigm, serialization, auth, rate limiting, pagination decisions
2. Conditionally invoke phase agents based on requirements
3. Create technical specs (OpenAPI/Protobuf/GraphQL) that implement those decisions
4. Apply all relevant phase patterns
5. Define endpoints, schemas, and validation rules
6. Provide examples and testing guidance

If you find the API design decisions don't work for a specific endpoint, note it but don't override Session 8. Discuss with the user and potentially re-run Session 8 with updated analysis.

**Reference files:**
- **API Design** (Session 8): `product-guidelines/08-api-design.ctx.md` - **READ THIS FIRST**
- Journey: `product-guidelines/00-user-journey.ctx.md`
- Tech stack: `product-guidelines/02-tech-stack.ctx.md`
- Architecture: `product-guidelines/04-architecture.ctx.md`
- Database schema: `product-guidelines/07-database-schema.ctx.md`
- Constraints: `product-guidelines/02a-constraints.ctx.md` (if exists)

**Phase agents:**
- **Phase 1**: `.claude/agents/api-contracts-phase1-security.md` (always invoke)
- **Phase 2**: `.claude/agents/api-contracts-phase2-versioning.md` (always invoke)
- **Phase 3**: `.claude/agents/api-contracts-phase3-performance.md` (conditional: mobile/high-volume/large-payloads)
- **Phase 4**: `.claude/agents/api-contracts-phase4-codegen.md` (always invoke)
- **Phase 5**: `.claude/agents/api-contracts-phase5-formats.md` (conditional: GraphQL/MessagePack/CBOR/hybrid)

---

**Now, read API design decisions (Session 8), conditionally invoke phase agents, and create technical API contracts!**
