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
- OpenAPI 3.0 specification (if REST/GraphQL)
- Protocol Buffers schemas (if gRPC)
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

**Example**: compliance-saas needs document upload, framework selection, assessment results, report sharing → FastAPI REST API with JWT auth, multi-tenant, rate-limited

---

### Step 2.5: Identify Security & Compliance Requirements

**CRITICAL - Analyze before generating contracts:**

Before defining schemas, identify security and compliance requirements that affect API design.

**Read Constraints (if available):**
```
Read: product-guidelines/02a-constraints.ctx.md (if exists - regulatory requirements)
```

**PII Field Identification:**

Scan Session 7 database schema for personally identifiable information (PII) fields. Common patterns:
- **Direct identifiers**: email, name, phone, address, SSN, passport, driver_license
- **Indirect identifiers**: IP address, device ID, user agent, geolocation
- **Sensitive data**: health records, financial data, biometric data, political opinions

**For each PII field, mark in API schemas:**
```yaml
# OpenAPI example
components:
  schemas:
    User:
      properties:
        email:
          type: string
          format: email
          x-pii: true  # Custom extension for tooling
          x-gdpr-category: "direct-identifier"
          description: User email address (PII - handle with care)
```

**GDPR Compliance (if Session 2a indicates EU users or GDPR requirements):**

Add **mandatory** data export endpoint per GDPR Article 20 (Right to Data Portability):
```yaml
paths:
  /api/users/{user_id}/export:
    get:
      summary: Export all user data (GDPR Article 20 compliance)
      description: |
        Returns all personal data in machine-readable JSON format.
        Required by GDPR Article 20 (Right to Data Portability).

        **Access Control**: Only the user themselves can export their data.
        **Data Included**: All PII fields across all tables.
        **Format**: JSON (machine-readable, structured)
      parameters:
        - name: user_id
          in: path
          required: true
          schema:
            type: string
            format: uuid
      responses:
        '200':
          description: User data export
          content:
            application/json:
              schema:
                type: object
                properties:
                  user:
                    $ref: '#/components/schemas/User'
                  documents:
                    type: array
                    items:
                      $ref: '#/components/schemas/Document'
                  # Include all user-owned resources
```

**Input Sanitization Rules:**

Define sanitization requirements per field type to prevent injection attacks:

| Field Type | Max Length | Pattern/Validation | Sanitization |
|------------|------------|-------------------|--------------|
| Email | 255 chars | RFC 5322 regex | Lowercase, trim whitespace |
| Name | 100 chars | Letters, spaces, hyphens, apostrophes | Strip HTML, escape special chars |
| Phone | 20 chars | E.164 format (+1234567890) | Remove formatting, validate country code |
| URL | 2048 chars | Valid URL scheme (http/https) | Validate protocol, check allowlist |
| Text Input | 10,000 chars | No control characters | Strip HTML tags, escape for XSS prevention |
| Rich Text | 50,000 chars | Allowed HTML tags only | Sanitize with DOMPurify or equivalent |

**DoS Prevention Limits:**

Specify limits to prevent denial-of-service attacks:
- **Max request body size**: 10 MB (configurable per endpoint, e.g., 50 MB for file uploads)
- **Max nesting depth**: 10 levels (prevents deeply nested JSON/XML bombs)
- **Max array length**: 1,000 items (prevents memory exhaustion)
- **Request timeout**: 30 seconds (prevents long-running requests tying up resources)
- **Max URL length**: 2,048 characters

**Deserialization Security Warnings:**

**CRITICAL - Avoid unsafe deserialization:**

| Format | Vulnerability | Safe Alternative |
|--------|---------------|------------------|
| **Python pickle** | Arbitrary code execution | Use JSON or MessagePack |
| **YAML** | `yaml.load()` executes code | Use `yaml.safe_load()` |
| **XML** | XXE (External Entity) attacks | Disable external entity processing |
| **JavaScript eval** | Code injection | Use `JSON.parse()` only |
| **Java ObjectInputStream** | Gadget chain attacks | Use JSON with allowlists |

**Never deserialize untrusted data with:**
- Python: `pickle.loads()`, `yaml.load()` without SafeLoader
- JavaScript: `eval()`, `Function()` constructor
- Java: `ObjectInputStream` without filtering
- Ruby: `Marshal.load()` on user input

**Example warning in API docs:**
```markdown
## Security Notice

This API uses JSON for all request/response bodies. **Never** use Python pickle,
YAML unsafe loading, or XML with external entities for deserialization. These
formats allow arbitrary code execution when processing untrusted input.
```

**Decision Tree - Security Requirements:**

```
1. Does the API handle EU user data?
   ├─ YES → Add GDPR data export endpoint
   └─ NO → Skip GDPR requirements

2. Does database schema contain PII fields?
   ├─ YES → Mark all PII fields in API schemas (x-pii: true)
   └─ NO → No PII marking needed

3. What regulatory requirements apply (from Session 2a)?
   ├─ HIPAA → Add audit logging, encryption at rest/transit requirements
   ├─ PCI DSS → Add credit card data handling requirements (never log/store plaintext)
   ├─ SOC 2 → Add access control, audit logging requirements
   └─ None → Standard security best practices suffice

4. Does API accept user-generated content?
   ├─ YES → Add input sanitization rules, max length limits, HTML escaping
   └─ NO → Basic validation only

5. Does API handle file uploads?
   ├─ YES → Add MIME type validation, file size limits, virus scanning requirement
   └─ NO → Skip file upload security
```

**Output from this step:**
- List of PII fields to mark in schemas
- GDPR export endpoint requirement (if applicable)
- Input sanitization rules per field type
- DoS prevention limits
- Deserialization security warnings

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

**Decision Tree - REST Resource Design:**

```
1. What type of operation?
   ├─ CRUD on collection → Use standard REST verbs
   │  - GET /api/resources (list)
   │  - POST /api/resources (create)
   │  - GET /api/resources/:id (read)
   │  - PUT /api/resources/:id (update)
   │  - DELETE /api/resources/:id (delete)
   │
   ├─ Action on resource → Use POST with action name
   │  - POST /api/resources/:id/action
   │  - Example: POST /api/assessments/:id/cancel
   │
   └─ Complex query → Use GET with query params
      - GET /api/resources?filter=value&sort=field
      - Example: GET /api/documents?status=ready&sort=-created_at

2. Should endpoints be nested?
   ├─ Strong parent-child relationship → Nest
   │  - GET /api/documents/:id/assessments
   │  - "Get all assessments for this document"
   │
   └─ Loose relationship → Flat with filtering
      - GET /api/assessments?document_id=123
      - "Get assessments, optionally filtered by document"
```

**Example**: compliance-saas endpoints:
- Documents: GET/POST `/api/documents`, GET/DELETE `/api/documents/:id`
- Frameworks: GET `/api/frameworks`, GET `/api/frameworks/:id`
- Assessments: GET/POST `/api/assessments`, GET/POST `/api/assessments/:id/{cancel,share}`
- Public: GET `/public/reports/:token` (no auth)
- Teams: GET/PATCH `/api/teams/:id`, GET `/api/teams/:id/usage`

---

### Step 4: Define Request and Response Schemas

For EACH endpoint, define:
- **Request schema** (path params, query params, headers, body)
- **Response schema** (success and error cases)
- **Validation rules** (required fields, formats, constraints)

**CRITICAL: Database-to-API Type Mapping**

When mapping database columns to API schema types, use this table to prevent precision loss and data corruption:

| Database Type | JSON Type | Protobuf Type | Precision Notes |
|---------------|-----------|---------------|-----------------|
| **NUMERIC/DECIMAL** | `string` | `string` | **CRITICAL**: Never use `float` or `number` - binary floats cannot represent 0.1, 0.01 exactly. Use string to preserve exact decimal values (e.g., "19.99" for money). |
| **BIGINT** | `string` | `int64` | **CRITICAL**: JavaScript `Number.MAX_SAFE_INTEGER` is 2^53 (9,007,199,254,740,992). IDs/counts beyond this truncate. Use string in JSON for IDs. |
| **INTEGER/INT** | `number` | `int32` | Safe for values within ±2.1 billion. Use for counts, quantities, ages. |
| **SMALLINT** | `number` | `int32` | Safe for values within ±32,767. |
| **BOOLEAN** | `boolean` | `bool` | Direct mapping, no precision issues. |
| **TIMESTAMP/DATETIME** | `string` (ISO 8601) | `google.protobuf.Timestamp` | Use ISO 8601 format: "2025-01-15T14:30:00Z". Always include timezone. |
| **DATE** | `string` (ISO 8601 date) | `string` | Format: "2025-01-15" (YYYY-MM-DD). |
| **TIME** | `string` (ISO 8601 time) | `string` | Format: "14:30:00" or "14:30:00.123Z". |
| **JSONB/JSON** | `object` | `google.protobuf.Struct` | Dynamic structure. Validate depth/size to prevent bombs. |
| **UUID** | `string` (uuid format) | `string` | Use OpenAPI `format: uuid` for validation. Example: "123e4567-e89b-12d3-a456-426614174000". |
| **TEXT/VARCHAR** | `string` | `string` | Add `maxLength` constraint from DB. Sanitize for XSS if user-generated. |
| **BYTEA/BLOB** | `string` (base64) | `bytes` | Use base64 encoding in JSON. Protobuf has native bytes type. |
| **ARRAY (PostgreSQL)** | `array` | `repeated` | Map array element type recursively. |
| **ENUM** | `string` (enum) | `enum` | Define enum values in schema. OpenAPI: `enum: [value1, value2]`. |

**Why This Matters - Common Bugs Prevented:**

**Bug 1: Money Precision Loss**
```javascript
// Database: NUMERIC(10,2) storing $19.99
// WRONG - loses precision:
{"price": 19.99}  // Becomes 19.990000000000002 in binary float

// CORRECT - preserves exact value:
{"price": "19.99"}  // String preserves decimal precision
```

**Bug 2: JavaScript ID Truncation**
```javascript
// Database: BIGINT storing ID 9007199254740993
// WRONG - truncates in JavaScript:
{"user_id": 9007199254740993}  // Becomes 9007199254740992 (loses 1)

// CORRECT - no truncation:
{"user_id": "9007199254740993"}  // String preserves full value
```

**Bug 3: Timezone Loss**
```sql
-- Database: TIMESTAMP WITH TIME ZONE '2025-01-15 14:30:00+00'
-- WRONG - loses timezone:
{"created_at": "2025-01-15 14:30:00"}  // Ambiguous timezone

// CORRECT - includes timezone:
{"created_at": "2025-01-15T14:30:00Z"}  // ISO 8601 with UTC indicator
```

**Implementation Guidance:**

1. **Read Session 7 database schema** and identify column types
2. **For each API schema property**, apply type mapping from table above
3. **Add OpenAPI format constraints** where applicable (uuid, email, date-time, uri)
4. **Document precision requirements** in schema descriptions
5. **Propagate DB constraints**:
   - `NOT NULL` → `required: true` in schema
   - `CHECK (age >= 0)` → `minimum: 0` in validation
   - `UNIQUE` → document uniqueness constraint (enforced server-side)
   - `VARCHAR(255)` → `maxLength: 255` in validation

**Validation Rules Enforcement:**

**MANDATORY: Every request/response schema MUST include validation constraints.**

For JSON APIs (OpenAPI), use JSON Schema validation:

```yaml
# Comprehensive validation example
components:
  schemas:
    User:
      type: object
      required:
        - email
        - name
        - role
      properties:
        email:
          type: string
          format: email  # RFC 5322 email validation
          minLength: 5
          maxLength: 255
          pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
          description: User email address (PII)
        name:
          type: string
          minLength: 1
          maxLength: 100
          pattern: '^[a-zA-Z\s\-\']+$'  # Letters, spaces, hyphens, apostrophes
          description: User full name (PII)
        age:
          type: integer
          minimum: 0
          maximum: 150
          description: User age in years
        role:
          type: string
          enum: [admin, user, guest]
          description: User role for authorization
        website:
          type: string
          format: uri
          maxLength: 2048
          pattern: '^https?://'  # Only http/https schemes
          description: User website URL
        phone:
          type: string
          pattern: '^\+[1-9]\d{1,14}$'  # E.164 format
          minLength: 10
          maxLength: 20
          description: Phone number in E.164 format (PII)
        created_at:
          type: string
          format: date-time  # ISO 8601
          description: Account creation timestamp
```

For Protobuf APIs, use protoc-gen-validate:

```protobuf
syntax = "proto3";
import "validate/validate.proto";

message CreateUserRequest {
  string email = 1 [(validate.rules).string = {
    email: true,
    min_len: 5,
    max_len: 255
  }];

  string name = 2 [(validate.rules).string = {
    min_len: 1,
    max_len: 100,
    pattern: "^[a-zA-Z\\s\\-']+$"
  }];

  int32 age = 3 [(validate.rules).int32 = {
    gte: 0,
    lte: 150
  }];

  Role role = 4;  // enum validation automatic

  string website = 5 [(validate.rules).string = {
    uri: true,
    max_len: 2048
  }];

  string phone = 6 [(validate.rules).string = {
    pattern: "^\\+[1-9]\\d{1,14}$"
  }];
}

enum Role {
  ROLE_UNSPECIFIED = 0;  // Always include zero value
  ROLE_ADMIN = 1;
  ROLE_USER = 2;
  ROLE_GUEST = 3;
}
```

**Validation Checklist (MUST include for ALL endpoints):**

For **request schemas**, validate:
- [ ] **Required fields**: Mark all non-optional fields as `required`
- [ ] **String length**: `minLength` and `maxLength` for all string fields
- [ ] **Number ranges**: `minimum` and `maximum` for integers/numbers
- [ ] **Formats**: Use `format` for email, uri, uuid, date-time, etc.
- [ ] **Patterns**: Add `pattern` regex for structured strings (phone, SSN, etc.)
- [ ] **Enums**: Define allowed values for categorical fields
- [ ] **Array constraints**: `minItems`, `maxItems` for arrays
- [ ] **Cross-field validation**: Document dependencies in descriptions

For **file upload endpoints**, validate:
- [ ] **File size**: Max 50 MB default, specify per endpoint
- [ ] **MIME types**: Allowlist only (e.g., `["image/png", "image/jpeg", "application/pdf"]`)
- [ ] **Filename**: Sanitize for directory traversal (no `../`, absolute paths)
- [ ] **File content**: Consider virus scanning requirement for user uploads

**Validation Failure Response:**

All validation errors return 400 Bad Request with this format:
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed",
    "details": {
      "field": "email",
      "constraint": "format",
      "message": "Invalid email format",
      "value": "notanemail"
    }
  }
}
```

**Decision Tree - Schema Design:**

```
1. What data format?
   ├─ Simple CRUD → JSON request/response
   ├─ File upload → multipart/form-data (add file validation)
   ├─ Bulk operations → JSON array or newline-delimited JSON
   └─ Real-time updates → WebSocket or Server-Sent Events

2. What validation is needed? (ALWAYS ALL OF THESE)
   ├─ Required fields → Mark as required in schema
   ├─ Format validation → Use JSON Schema formats (email, url, uuid, date-time)
   ├─ Length/range validation → minLength, maxLength, minimum, maximum
   ├─ Pattern validation → regex for structured fields (phone, SSN, custom IDs)
   ├─ Enum validation → Define allowed values for categorical fields
   └─ Cross-field validation → Note dependencies in schema description

3. How to handle pagination?
   ├─ Offset-based → ?page=1&limit=20
   ├─ Cursor-based → ?cursor=xyz&limit=20 (better for large datasets)
   └─ Default: Cursor-based if >10K records expected, else offset

4. How to handle errors?
   ├─ Use standard HTTP status codes
   ├─ Consistent error response format (see above)
   └─ Include actionable error messages with field names
```

**Example schemas:**

```yaml
# Document Upload
POST /api/documents (multipart/form-data)
→ 201: {id, name, fileSize, status, uploadedAt, userId, frameworks}
→ 400: {error: {code: "INVALID_FILE_TYPE", message, field}}
→ 413: {error: {code: "FILE_TOO_LARGE", message, limit, received}}

# Assessment Status
GET /api/assessments/:id
→ 200: {id, documentId, status, progress, frameworks, results: {score, findings[], summary}, timing}
→ 404: {error: {code: "ASSESSMENT_NOT_FOUND", message}}
```

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

---

### Step 7: Define Rate Limiting and Pagination

**Rate Limiting Strategy:**

**Decision Tree - Rate Limiting:**

```
1. What's the pricing model?
   ├─ Free tier → Aggressive limits (10 req/min)
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

**Example**: Headers `X-RateLimit-{Limit,Remaining,Reset}` on all responses. Limits by tier: Free (100 req/min), Pro (1000 req/min), Enterprise (unlimited). Expensive ops (uploads, assessments) have stricter per-hour/day limits.

**Pagination Strategy:**

**Decision Tree - Pagination:**

```
1. How many total records?
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

**Example**: Cursor-based for large datasets (`?cursor=abc&limit=20` → `{data[], pagination: {nextCursor, prevCursor, hasMore}}`), offset-based for small datasets (`?page=1&limit=20` → `{data[], pagination: {page, limit, total, totalPages}}`)

---

### Webhook Endpoints (Inbound)

When generating `product-guidelines/08b-api-contracts.md`, if Session 2a identifies integrations that send webhooks, include webhook endpoint specifications:

**Endpoint Pattern**: `/webhooks/{provider}`

**For each provider that sends webhooks, create an endpoint specification**:

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

  /webhooks/sendgrid:
    post:
      summary: SendGrid webhook handler
      description: |
        Receives email event webhooks from SendGrid (delivered, bounced, opened, etc.).

        **Security**: ECDSA signature verification via X-Twilio-Email-Event-Webhook-Signature header.
        **Fallback**: Validate sending IP against SendGrid's IP ranges if signature verification unavailable.
      operationId: handleSendGridWebhook
      tags: [Webhooks]
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: array
              items:
                type: object
                properties:
                  email:
                    type: string
                  event:
                    type: string
                    enum: [delivered, bounce, open, click]
                  timestamp:
                    type: integer
      responses:
        '200':
          description: Webhook received
```

**Key Elements for Each Webhook Endpoint**:
- Request body schema (provider-specific)
- Signature verification method (if applicable)
- Idempotency strategy (how duplicate events are handled)
- Response format (typically 200 with `{received: true}`)
- Error responses (400 for invalid signature, 422 for invalid payload)

---

### Step 8: Generate API Specification

**For REST/GraphQL** (JSON serialization):
Create complete OpenAPI 3.0 specification. Use template at `/templates/08b-api-contracts-template.md` for detailed structure.

**For gRPC** (Protobuf serialization):
Create Protocol Buffer `.proto` files with service definitions, message types, and RPC methods.

**For Hybrid** (e.g., gRPC internal + REST external):
Create both OpenAPI specs (external REST API) and Protobuf schemas (internal gRPC services).

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
- Use JSON Schema validation (formats, min/max, enums)
- Document all error responses (4xx, 5xx)

---

### Step 9: Document API Technical Implementation

Write `product-guidelines/08b-api-contracts.md` with:
- **Overview**: Link to `08-api-design.md` for paradigm/serialization decisions, endpoint count
- **Core Resources**: For each resource: purpose (journey connection), endpoints table
- **OpenAPI Spec**: Complete specification or link to `openapi.yaml` file
- **Protobuf Schemas**: (if gRPC) Complete `.proto` files or links
- **Request/Response Examples**: Sample payloads for key endpoints
- **Validation Rules**: Field constraints, required fields, formats
- **Testing**: Example curl/httpie/grpcurl commands

**Note**: High-level design decisions (paradigm, serialization, auth strategy, rate limiting, pagination) are in `08-api-design.md` (Session 8). This file focuses on technical implementation.

---

### Step 10: Create Context Version for Scaffold Generation

**IMPORTANT**: After writing the full contracts file, invoke the distillation sub-agent:

```bash
Task tool with:
- subagent_type: distill-context
- Source file: product-guidelines/08b-api-contracts.md
- Output file: product-guidelines/08b-api-contracts.ctx.md
```

The distillation agent will create a condensed version optimized for Session 12 (scaffold generation).

**What to include** (target: 100-150 lines):
- API configuration (reference to 08-api-design.md for decisions)
- Endpoint lists organized by journey step
- Brief description for each endpoint (one line)
- Common patterns (pagination params, response codes)
- Implementation guidance for scaffold generation

**What to EXCLUDE** (these belong in full `08b-api-contracts.md`):
- Complete OpenAPI 3.0 specification
- Request/response schemas
- Error response definitions
- Component schemas
- Example requests/responses
- Validation rules
- Rate limit headers

**Why**: Session 12 (scaffold generation) only needs the endpoint list to create controller/route stubs. Loading the full 782-line OpenAPI spec bloats context by ~3,128 tokens when only ~280 tokens are needed.

**Format**:
```markdown
# API Contracts Context (For Backlog Generation)

> See `08-api-contracts.md` for complete OpenAPI 3.0 specification

## API Configuration
- API Style: [REST/GraphQL]
- Authentication: [JWT/OAuth]
...

## Endpoints by Journey Step

### Authentication (Journey Step 0)
- `POST /api/auth/login` - User login
...

### [Resource] Endpoints (Journey Step X)
- `POST /api/[resource]` - Create [resource]
- `GET /api/[resource]` - List [resource] (paginated)
...
```

---

### Step 11: Validate API Design

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

**Security & Compliance (Phase 1):**
- [ ] PII fields marked with x-pii: true in schemas
- [ ] GDPR data export endpoint included (if EU users in Session 2a)
- [ ] Input sanitization rules documented per field type
- [ ] DoS prevention limits specified (max request size, nesting depth, timeout)
- [ ] Deserialization security warnings included (no pickle/unsafe YAML)
- [ ] Authentication required on protected endpoints
- [ ] Authorization checks documented
- [ ] Sensitive data not exposed in URLs
- [ ] Rate limiting prevents abuse
- [ ] CORS policy considered
- [ ] HTTPS enforced in production

**Type Safety (Phase 1):**
- [ ] Database NUMERIC/DECIMAL mapped to string (not float) for money
- [ ] Database BIGINT mapped to string in JSON (JavaScript safety)
- [ ] Timestamps use ISO 8601 format with timezone
- [ ] UUIDs use string type with format: uuid
- [ ] All DB constraints propagated to API validation (NOT NULL, CHECK, VARCHAR length)

**Validation (Phase 1):**
- [ ] All request schemas have required field markers
- [ ] String fields have minLength and maxLength constraints
- [ ] Number fields have minimum and maximum constraints
- [ ] Structured fields have pattern regex (email, phone, URLs)
- [ ] Enum fields define all allowed values
- [ ] File uploads have size limits and MIME type allowlists
- [ ] Validation error responses use consistent format with field names

**Performance:**
- [ ] Pagination prevents large payloads
- [ ] Heavy operations are async (return 202 Accepted)
- [ ] Caching headers specified for cacheable endpoints
- [ ] File uploads support chunking/resumable uploads

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

1. **`product-guidelines/08b-api-contracts.md`**: Full technical specification (endpoints, schemas, validation rules, examples, testing)
2. **`product-guidelines/08b-api-contracts.ctx.md`**: Condensed version for Session 12 (scaffold generation) - endpoint lists only (~150 lines)
3. **`product-guidelines/08b-api-contracts/openapi.yaml`** (if REST/GraphQL): Complete OpenAPI 3.0 spec (all endpoints, schemas, security)
4. **`product-guidelines/08b-api-contracts/*.proto`** (if gRPC): Protocol Buffer service and message definitions
5. **`product-guidelines/08b-api-contracts/postman-collection.json`** (optional): Postman/Insomnia collection with pre-configured requests

---

## Quality Checklist

Before completing this session, verify:

**Journey Alignment:**
- [ ] All user actions from journey have API endpoints
- [ ] Critical path (journey steps 1-3) fully supported
- [ ] No endpoints exist that don't serve a journey step
- [ ] API enables all features in backlog

**Completeness:**
- [ ] All CRUD operations defined where needed
- [ ] Request and response schemas complete
- [ ] Validation rules specified
- [ ] Error cases documented
- [ ] Authentication and authorization clear
- [ ] Rate limiting and pagination specified

**Technical Quality:**
- [ ] OpenAPI 3.0 specification valid (use validator)
- [ ] Consistent naming conventions
- [ ] Consistent error format
- [ ] HTTP status codes used correctly
- [ ] Security best practices followed (HTTPS, auth, rate limits)

**API Design Alignment (Session 8):**
- [ ] Paradigm matches `08-api-design.md` decision (REST/GraphQL/gRPC/hybrid)
- [ ] Serialization format matches decision (JSON/Protobuf/MessagePack)
- [ ] Auth method from `08-api-design.md` implemented
- [ ] Rate limiting strategy from `08-api-design.md` applied
- [ ] Pagination approach from `08-api-design.md` used
- [ ] Error format from `08-api-design.md` followed

**Tech Stack Alignment:**
- [ ] Framework-specific patterns leveraged
- [ ] Documentation tool compatible with stack

**Documentation:**
- [ ] Each endpoint has purpose explanation
- [ ] Endpoints reference journey steps
- [ ] Testing examples provided (curl/httpie/grpcurl)
- [ ] Setup instructions clear
- [ ] Link to `08-api-design.md` for high-level decisions

**Context Version (for scaffold generation):**
- [ ] Context file created at `08b-api-contracts.ctx.md`
- [ ] All endpoints listed with journey step mapping
- [ ] File is 100-200 lines (not bloated with schemas)
- [ ] Includes API config references to `08-api-design.md`
- [ ] References full file for complete specification

---

## After This Session

**Next steps**:
- Run `/create-test-strategy` (Session 9) to define testing approach
- Session 10 (`/generate-backlog`) will use `08-api-design.ctx.md` for API-driven stories
- Session 12 (`/scaffold-project`) will use `08b-api-contracts.ctx.md` to generate endpoint stubs

**Use contracts for**:
- Backend implementation (controllers, routes, handlers)
- Frontend development (know available APIs)
- API documentation (Swagger UI, Redoc, grpcui)
- Client SDK generation (openapi-generator, protoc plugins)
- Contract testing (Pact, Dredd, grpc-testing)

---

## Remember

**Implement the decisions from Session 8 (API Design).**

This session focuses on technical implementation. Don't make new architectural decisions here. Instead:
1. Read `08-api-design.ctx.md` for paradigm, serialization, auth, rate limiting, pagination decisions
2. Create technical specs (OpenAPI/Protobuf) that implement those decisions
3. Define endpoints, schemas, and validation rules
4. Provide examples and testing guidance

If you find the API design decisions don't work for a specific endpoint, note it but don't override Session 8. Discuss with the user and potentially re-run Session 8 with updated analysis.

**Reference files:**
- **API Design** (Session 8): `product-guidelines/08-api-design.ctx.md` - **READ THIS FIRST**
- Journey: `product-guidelines/00-user-journey.ctx.md`
- Tech stack: `product-guidelines/02-tech-stack.ctx.md`
- Architecture: `product-guidelines/04-architecture.ctx.md`
- Database schema: `product-guidelines/07-database-schema.ctx.md`

---

**Now, read API design decisions (Session 8) and create technical API contracts!**

## After Generating API Contracts Document

Once you've written `product-guidelines/08b-api-contracts.md`, invoke the distillation agent to create a context file:

Use the Task tool:
- **subagent_type**: `general-purpose`
- **description**: `Generate API contracts context file`
- **prompt**:
  ```
  Invoke the context distillation agent to create token-optimized context file.

  Source file: product-guidelines/08b-api-contracts.md
  Output file: product-guidelines/08b-api-contracts.ctx.md

  Follow the distillation agent specification in .claude/agents/distill-context.md to:
  1. Extract ALL endpoint definitions, schemas, and validation rules (CRITICAL)
  2. Extract component schemas and request/response formats
  3. Remove example requests/responses, testing guidance, detailed explanations
  4. Preserve section structure from source file
  5. Achieve 60-70% token reduction
  6. Add source reference header
  7. Write to output file path
  ```

## Output Format

IMPORTANT: Do not use emojis in generated outputs. Use plain text for all communication.
