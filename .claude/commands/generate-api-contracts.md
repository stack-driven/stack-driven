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

### Step 7: Define Rate Limiting, Pagination, and Performance Optimization

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

**Performance Optimization Patterns (Phase 3):**

**CRITICAL - Optimize for scalability and efficiency:**

After defining pagination and rate limiting, apply performance optimization patterns to prevent bandwidth waste, slow mobile apps, and server overload.

**1. Response Size Limits**

Specify maximum response sizes per endpoint type to prevent memory exhaustion and bandwidth abuse:

**Size Limit Decision Tree:**

```
1. What's the endpoint type?
   ├─ List endpoint (collection) → Default max 100 items, absolute max 1000 items
   ├─ Single resource (GET /api/resources/:id) → No item limit (single item)
   ├─ Search/filter endpoint → Default max 100 results, absolute max 500 results
   └─ Bulk operation → Max 1000 items per request

2. What's the resource size?
   ├─ Small (<1 KB each) → Higher limits (1000 items)
   ├─ Medium (1-10 KB each) → Standard limits (100 items)
   └─ Large (>10 KB each) → Lower limits (20-50 items)

3. Should clients control limit?
   ├─ YES → Accept ?limit query param (default: 20, max: 100)
   └─ NO → Fixed server-side limit
```

**Implementation Guidance:**

For OpenAPI specs, document limits in endpoint descriptions:

```yaml
paths:
  /api/documents:
    get:
      summary: List documents
      description: |
        Returns paginated list of documents.

        **Performance Limits:**
        - Default: 20 items per page
        - Maximum: 100 items per page (enforce server-side)
        - Total response size: <1 MB (approximate 100 items × 10 KB each)
      parameters:
        - name: limit
          in: query
          schema:
            type: integer
            minimum: 1
            maximum: 100
            default: 20
          description: Number of items to return (max 100)
```

**For Protobuf APIs, add size limits to RPC comments:**

```protobuf
service DocumentService {
  // Lists documents (max 100 per request, default 20)
  // Response size limit: 1 MB
  rpc ListDocuments(ListDocumentsRequest) returns (ListDocumentsResponse);
}

message ListDocumentsRequest {
  int32 page_size = 1;  // Max 100, default 20
  string page_token = 2;
}
```

**Why This Matters:**
- Prevents clients from requesting 10,000 items and causing memory exhaustion
- Mobile clients can request smaller page sizes (20) for bandwidth savings
- Server protects itself from DoS via excessive pagination

**2. Compression Decision Matrix**

Specify when to compress responses for optimal bandwidth/CPU trade-off:

**Compression Decision Tree:**

```
1. What's the serialization format?
   ├─ JSON (text) → Always compress (70-90% size reduction)
   ├─ Protobuf (binary) → Compress for large responses (>1 KB), diminishing returns
   ├─ MessagePack (binary) → Compress for large responses, already compact
   └─ GraphQL → Always compress (text format)

2. What's the response size?
   ├─ <1 KB → Don't compress (overhead > savings)
   ├─ 1-10 KB → Compress if text format
   └─ >10 KB → Always compress

3. What's the latency requirement?
   ├─ Real-time (<10ms SLA) → Don't compress (CPU overhead matters)
   ├─ Interactive (<100ms SLA) → Use fast compression (LZ4, Snappy)
   └─ Batch/background → Use maximum compression (gzip, ZSTD)

4. What's the network condition?
   ├─ LAN (high bandwidth) → Don't compress (CPU waste)
   ├─ Internet (variable) → Compress (bandwidth savings)
   └─ Mobile (bandwidth-constrained) → Always compress (battery + cost savings)
```

**Compression Algorithm Selection:**

| Algorithm | Speed | Compression Ratio | Use Case |
|-----------|-------|-------------------|----------|
| **gzip** (level 6) | Medium | ~3× (70% reduction) | HTTP default, universal support |
| **brotli** (level 4) | Slow | ~4× (75% reduction) | Modern browsers, pre-compress static content |
| **ZSTD** (level 3) | Fast | ~3× (70% reduction) | Modern default, balanced speed/size |
| **LZ4** | Fastest | ~2× (50% reduction) | Real-time, latency-critical |
| **Snappy** | Very Fast | ~2× (50% reduction) | Internal services, gRPC |

**Implementation Guidance:**

For REST APIs, document compression in OpenAPI:

```yaml
paths:
  /api/documents:
    get:
      summary: List documents
      description: |
        Returns paginated list of documents.

        **Compression:**
        - Supports gzip and brotli (via Accept-Encoding header)
        - Responses >1 KB are automatically compressed
        - Typical compression: 400 bytes (JSON) → 100 bytes (gzip)
      responses:
        '200':
          description: Successful response
          headers:
            Content-Encoding:
              description: Compression algorithm used
              schema:
                type: string
                enum: [gzip, br, identity]
              example: gzip
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/DocumentList'
```

**Compression Impact Example:**

```yaml
# Example in API documentation
x-compression-examples:
  list_endpoint:
    uncompressed_json: 2400 bytes  # 20 items × 120 bytes each
    gzip_compressed: 600 bytes     # 75% reduction
    bandwidth_saved: 1800 bytes    # Per request
    monthly_savings:
      requests_per_month: 1000000
      uncompressed: 2.4 GB
      compressed: 0.6 GB
      savings: 1.8 GB/month
```

**For gRPC APIs, specify compression in service definition:**

```protobuf
service DocumentService {
  // Uses gzip compression for responses >1 KB
  // Enable with grpc.Compression(grpc.Gzip) client option
  rpc ListDocuments(ListDocumentsRequest) returns (ListDocumentsResponse);
}
```

**Why This Matters:**
- JSON list of 20 documents: 2.4 KB uncompressed → 600 bytes with gzip (4× smaller)
- 1 million API calls/month: 2.4 GB uncompressed → 600 MB compressed (1.8 GB savings)
- Mobile users save bandwidth costs and battery life

**3. Partial Response Patterns (Field Selection)**

Allow clients to request only needed fields for bandwidth optimization:

**Field Selection Decision Tree:**

```
1. What's the API paradigm?
   ├─ GraphQL → Built-in field selection (no additional work)
   ├─ REST → Implement sparse fieldsets or field filtering
   └─ gRPC → Use FieldMask (google.protobuf.FieldMask)

2. What's the typical use case?
   ├─ Mobile app (bandwidth-constrained) → Field selection critical
   ├─ Web app (desktop) → Nice to have
   └─ Server-to-server → Less important (LAN bandwidth)

3. What's the response size variation?
   ├─ Large variation (full: 10 KB, minimal: 1 KB) → High value field selection
   ├─ Medium variation (full: 5 KB, minimal: 3 KB) → Medium value
   └─ Low variation (full: 2 KB, minimal: 1.5 KB) → Low value, skip
```

**REST API Pattern - Sparse Fieldsets (JSON:API style):**

```yaml
paths:
  /api/users:
    get:
      summary: List users
      description: |
        Returns list of users. Use `fields` parameter to request specific fields only.

        **Field Selection Examples:**
        - Minimal: `?fields[users]=id,name` (200 bytes per user)
        - Full: No fields param (1200 bytes per user)
        - Custom: `?fields[users]=id,name,email,created_at` (400 bytes)
      parameters:
        - name: fields[users]
          in: query
          schema:
            type: string
          description: |
            Comma-separated list of fields to include.
            Available fields: id, name, email, phone, age, role, created_at, updated_at, preferences
            Example: ?fields[users]=id,name,email
          example: "id,name,email"
      responses:
        '200':
          description: User list (fields vary based on request)
          content:
            application/json:
              schema:
                type: object
                properties:
                  data:
                    type: array
                    items:
                      type: object
                      description: User object with requested fields only
```

**GraphQL Pattern (Native Field Selection):**

```graphql
# Client specifies exact fields needed
query GetUsers {
  users {
    id
    name
    email
  }
}

# vs full object
query GetUsersDetailed {
  users {
    id
    name
    email
    phone
    age
    role
    preferences {
      theme
      language
      notifications
    }
    created_at
    updated_at
  }
}
```

**gRPC Pattern - FieldMask:**

```protobuf
import "google/protobuf/field_mask.proto";

message GetUserRequest {
  string user_id = 1;
  google.protobuf.FieldMask field_mask = 2;  // Specify fields to return
}

// Client request example:
// field_mask: {paths: ["id", "name", "email"]}
```

**Implementation Guidance:**

Document field selection impact:

```yaml
x-field-selection-examples:
  full_user_object:
    fields: "all"
    size: 1200 bytes
    use_case: "Admin dashboard, detailed view"

  minimal_user_object:
    fields: "id,name"
    size: 200 bytes
    use_case: "Autocomplete, user picker"
    bandwidth_saved: 1000 bytes per user

  list_comparison:
    scenario: "List 100 users"
    full: 120 KB
    minimal: 20 KB
    savings: 100 KB per request (83% reduction)
```

**Why This Matters:**
- Mobile autocomplete: Full user (1.2 KB) vs minimal (200 bytes) = 6× bandwidth savings
- List of 100 users: 120 KB full vs 20 KB minimal = 100 KB saved per request
- Faster page loads, lower mobile data costs, better UX

**4. HTTP Caching Headers**

Specify caching strategy for GET endpoints to reduce server load and improve response times:

**Caching Decision Tree:**

```
1. What's the data volatility?
   ├─ Static (never changes) → Cache-Control: public, max-age=31536000, immutable
   ├─ Rarely changes (days) → Cache-Control: public, max-age=86400, must-revalidate
   ├─ Frequently changes (minutes) → Cache-Control: private, max-age=300, must-revalidate
   └─ Real-time (always fresh) → Cache-Control: no-store, no-cache

2. Is data user-specific?
   ├─ YES → Cache-Control: private (don't cache in CDN)
   └─ NO → Cache-Control: public (CDN-friendly)

3. Should clients revalidate?
   ├─ Critical data (auth, payments) → must-revalidate, ETag for conditional requests
   ├─ Important data (user profiles) → ETag for 304 Not Modified optimization
   └─ Less critical (public content) → max-age only, skip ETag overhead
```

**Cache-Control Patterns:**

| Endpoint Type | Cache-Control Header | ETag | Use Case |
|---------------|---------------------|------|----------|
| **Static assets** (images, fonts) | `public, max-age=31536000, immutable` | No | CDN, never changes |
| **Public content** (blog posts) | `public, max-age=3600` | Yes | CDN, hourly updates |
| **User resources** (profile) | `private, max-age=300, must-revalidate` | Yes | Expires 5min, user-specific |
| **Lists** (search results) | `private, max-age=60` | Optional | Short-lived, user-specific |
| **Real-time data** (stock prices) | `no-store, no-cache` | No | Always fetch fresh |

**Implementation Guidance:**

For OpenAPI, document caching per endpoint:

```yaml
paths:
  /api/users/{id}:
    get:
      summary: Get user by ID
      description: |
        Returns user profile. Response is cached for 5 minutes.

        **Caching Strategy:**
        - Cache-Control: private, max-age=300, must-revalidate
        - ETag: Computed from (user_id, updated_at timestamp)
        - Conditional requests: Send If-None-Match header with ETag
          - Match → 304 Not Modified (no body, instant response)
          - No match → 200 OK with full body
      responses:
        '200':
          description: User profile
          headers:
            Cache-Control:
              description: Caching policy
              schema:
                type: string
              example: "private, max-age=300, must-revalidate"
            ETag:
              description: Entity tag for conditional requests
              schema:
                type: string
              example: '"user_123_1704124800"'
            Last-Modified:
              description: Last modification timestamp
              schema:
                type: string
                format: date-time
              example: "2025-01-15T14:30:00Z"
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'

        '304':
          description: Not Modified (cached version still valid)
          headers:
            Cache-Control:
              schema:
                type: string
            ETag:
              schema:
                type: string
```

**ETag Generation Strategies:**

```yaml
x-etag-strategies:
  content_hash:
    description: "Hash of response body (strong validator)"
    example: 'ETag: "5d41402abc4b2a76b9719d911017c592"'
    pros: "Accurate, detects any change"
    cons: "Requires full serialization before hashing (CPU cost)"

  timestamp_based:
    description: "Based on last modification time (weak validator)"
    example: 'ETag: W/"user_123_1704124800"'
    pros: "Fast, no serialization needed"
    cons: "May miss changes within same second"

  version_based:
    description: "Based on resource version number"
    example: 'ETag: "v42"'
    pros: "Simplest, fast"
    cons: "Requires version tracking in database"
```

**Conditional Request Flow:**

```
1. Initial Request
   GET /api/users/123
   → 200 OK, ETag: "abc123", Cache-Control: max-age=300
   → Client caches response for 5 minutes

2. Cache Expired (after 5 minutes)
   GET /api/users/123
   If-None-Match: "abc123"

   Server checks: Has user 123 changed since ETag "abc123"?
   ├─ NO → 304 Not Modified (no body, ~100 bytes response)
   └─ YES → 200 OK with new ETag (full body, ~1200 bytes)
```

**Caching Impact Example:**

```yaml
x-caching-examples:
  scenario: "User profile endpoint, 1000 requests/minute"

  without_caching:
    requests_to_server: 1000/min
    avg_response_size: 1200 bytes
    bandwidth: 1.2 MB/min = 72 MB/hour = 1.7 GB/day

  with_cache_control_5min:
    cache_hit_ratio: 80%  # Most requests served from cache
    requests_to_server: 200/min (20% cache misses)
    bandwidth: 0.24 MB/min = 14.4 MB/hour = 346 MB/day
    savings: 1.35 GB/day (80% reduction)

  with_etag_304:
    cache_expired_requests: 200/min
    etag_match_rate: 70%  # User unchanged
    304_responses: 140/min × 100 bytes = 14 KB/min
    200_responses: 60/min × 1200 bytes = 72 KB/min
    total_bandwidth: 86 KB/min vs 240 KB/min without ETag
    additional_savings: 154 KB/min (64% reduction on cache misses)
```

**Why This Matters:**
- Reduces server load by 80% (requests served from client/CDN cache)
- 304 Not Modified responses are 10× smaller than full responses (100 bytes vs 1200 bytes)
- Faster response times (cached responses instant, 304 responses <10ms vs 50ms for full fetch)
- Lower bandwidth costs (1.7 GB/day → 346 MB/day for 1000 req/min endpoint)

**5. Protobuf Varint Optimization (if using gRPC/Protobuf)**

Optimize integer field encoding for space efficiency:

**Varint Explanation:**

Protocol Buffers use variable-length encoding (varint) for integers:
- Small numbers (0-127): 1 byte
- Medium numbers (128-16,383): 2 bytes
- Large numbers (>16,383): 3+ bytes

**Fixed-width integers (fixed32/fixed64) always use 4/8 bytes regardless of value.**

**When to Use Varint (int32/int64/sint32/sint64):**
- IDs with small values (user_id: 1, 2, 3, ...)
- Counts and quantities (count: 0-10,000)
- Timestamps (Unix seconds: ~1.7 billion, but varint saves space)
- Enums (0-100 values)

**When to Use Fixed-width (fixed32/fixed64):**
- Large numbers always (floating-point bits, hashes)
- Uniformly distributed (random IDs, UUIDs as integers)
- Performance-critical (fixed-width is faster to encode/decode)

**Decision Tree:**

```
1. What's the typical value range?
   ├─ 0-127 (1 byte varint) → Use int32/int64
   ├─ 128-16,383 (2 bytes varint) → Use int32/int64
   ├─ >16,383 but often small → Use int32/int64 (saves space most of the time)
   └─ Always large (>2^28) → Use fixed32/fixed64 (simpler, faster)

2. What's the value distribution?
   ├─ Mostly small numbers → Varint (int32/int64)
   ├─ Uniformly distributed → Fixed-width (fixed32/fixed64)
   └─ Unknown → Default to varint (more common)

3. Is this a signed number?
   ├─ Always positive → Use int32/int64 (0-127 = 1 byte)
   ├─ Can be negative → Use sint32/sint64 (zigzag encoding, efficient for small negatives)
   └─ Large negatives → Use fixed32/fixed64
```

**Example Protobuf Type Selection:**

```protobuf
message User {
  // Small IDs (1-10,000) → 1-2 bytes with varint
  int64 user_id = 1;  // NOT fixed64

  // Small counts (0-1000) → 1-2 bytes
  int32 document_count = 2;  // NOT fixed32

  // Timestamps (Unix seconds ~1.7B) → 4 bytes varint vs 4 bytes fixed32
  int64 created_at = 3;  // Use int64 (same size, more consistent)

  // Large always (UUID as 128-bit int) → fixed64 faster
  fixed64 uuid_high = 4;
  fixed64 uuid_low = 5;

  // Can be negative, small range → zigzag encoding
  sint32 balance_delta = 6;  // -100 to +100 → 1-2 bytes

  // Floating-point → always fixed32/fixed64
  float price = 7;  // 4 bytes fixed
  double balance = 8;  // 8 bytes fixed
}
```

**Varint Space Savings Example:**

```yaml
x-protobuf-varint-examples:
  scenario: "100 user records"

  using_fixed64_for_user_id:
    field: "fixed64 user_id"
    values: "1-100"
    bytes_per_field: 8 bytes (always)
    total: 800 bytes

  using_varint_int64:
    field: "int64 user_id"
    values: "1-100"
    bytes_per_field: 1 byte (values 0-127)
    total: 100 bytes
    savings: 700 bytes (87% reduction)

  large_user_ids:
    scenario: "User IDs in millions (1,000,000-9,999,999)"
    varint_bytes: 3-4 bytes
    fixed64_bytes: 8 bytes
    savings: 4-5 bytes per field (50%+ reduction)
```

**Why This Matters:**
- Small IDs (1-1000): 1 byte varint vs 8 bytes fixed64 = 87% space savings
- 1 million user records: 8 MB (fixed64) vs 1-3 MB (varint) = 5-7 MB saved
- Faster transmission over network (less data to send)

---

---

### Step 6.5: API Versioning & Evolution

**CRITICAL - Plan for safe API evolution:**

APIs evolve over time as requirements change. This section provides comprehensive guidance for safe API evolution without breaking existing clients.

**Breaking vs Non-Breaking Changes:**

Understand which changes break existing clients and which are safe:

| Change Type | Breaking? | Migration Required? | Examples |
|-------------|-----------|---------------------|----------|
| **Add optional field** | ✅ Safe | No | Add `middle_name` to User schema |
| **Add new endpoint** | ✅ Safe | No | Add `POST /api/users/{id}/verify` |
| **Add new enum value** | ⚠️ Maybe | Maybe | Add `premium_plus` to role enum (clients may reject unknown values) |
| **Add optional query param** | ✅ Safe | No | Add `?include=metadata` to GET requests |
| **Make required field optional** | ✅ Safe | No | Change `phone` from required to optional |
| **Make optional field required** | ❌ Breaking | Yes | Change `name` from optional to required |
| **Remove field** | ❌ Breaking | Yes | Remove `deprecated_field` from response |
| **Rename field** | ❌ Breaking | Yes | Rename `userId` to `user_id` |
| **Change field type** | ❌ Breaking | Yes | Change `age` from string to number |
| **Remove endpoint** | ❌ Breaking | Yes | Remove `DELETE /api/users/{id}` |
| **Change URL path** | ❌ Breaking | Yes | `/api/documents` → `/api/files` |
| **Change HTTP method** | ❌ Breaking | Yes | POST → PUT for same endpoint |
| **Change status code** | ⚠️ Maybe | Maybe | 200 → 201 (usually safe, but clients may check exact code) |
| **Change error format** | ❌ Breaking | Yes | `{error: "msg"}` → `{errors: [{code, msg}]}` |
| **Tighten validation** | ❌ Breaking | Yes | Add max length constraint to previously unlimited field |
| **Relax validation** | ✅ Safe | No | Remove max length constraint |

**Backward Compatibility Rules:**

Follow these rules to maintain backward compatibility:

**OpenAPI/REST:**
1. ✅ **DO** add new optional fields to responses (clients ignore unknown fields)
2. ✅ **DO** add new optional fields to requests (server provides defaults)
3. ✅ **DO** add new endpoints (existing endpoints unchanged)
4. ❌ **DON'T** remove fields from responses (breaks clients expecting them)
5. ❌ **DON'T** add required fields to requests (breaks old clients)
6. ❌ **DON'T** change field types (breaks type assumptions)
7. ❌ **DON'T** reuse field names with different meanings

**Protobuf:**
1. ✅ **DO** use `reserved` for deleted fields (prevents field number reuse)
2. ✅ **DO** add new fields with new field numbers
3. ✅ **DO** use default values for new fields
4. ❌ **DON'T** change field numbers (causes data corruption)
5. ❌ **DON'T** change field types (unless compatible: int32 ↔ int64, sint32 ↔ sint64)
6. ❌ **DON'T** reuse reserved field numbers
7. ❌ **DON'T** change message/field names if using JSON mapping

**Protobuf Reserved Fields Pattern:**

When removing or renaming fields in Protobuf, ALWAYS mark them as reserved:

```protobuf
// Version 1
message User {
  string name = 1;
  string email = 2;
  string status = 3;  // DEPRECATED - to be removed
}

// Version 2 (safe evolution)
message User {
  string name = 1;
  string email = 2;
  reserved 3;  // CRITICAL: Mark field 3 as reserved
  reserved "status";  // Also reserve field name

  UserStatus status_v2 = 4;  // Replacement field gets NEW number
  string middle_name = 5;  // New optional field
}

enum UserStatus {
  USER_STATUS_UNSPECIFIED = 0;  // Always include zero value
  USER_STATUS_ACTIVE = 1;
  USER_STATUS_INACTIVE = 2;
  USER_STATUS_SUSPENDED = 3;
}
```

**Why reserved fields matter:**
- Reusing field number 3 causes data corruption when old clients read new messages
- Old client sees field 3 as string, new message has enum → type mismatch
- Reserved prevents accidental reuse, forcing new field numbers

**OpenAPI Deprecation Pattern:**

Mark fields and endpoints as deprecated before removal:

```yaml
components:
  schemas:
    User:
      properties:
        user_id:
          type: string
          description: User identifier (use 'id' instead)
          deprecated: true
          x-sunset-date: "2026-06-01"
          x-replacement-field: "id"
        id:
          type: string
          description: User identifier (replaces deprecated user_id)

paths:
  /api/v1/users:
    get:
      deprecated: true
      description: |
        **DEPRECATED:** This endpoint will be removed on 2026-06-01.
        Use `/api/v2/users` instead.
      x-sunset-date: "2026-06-01"
      x-replacement-endpoint: "/api/v2/users"
```

**Deprecation Timeline Pattern:**
1. **Announce deprecation** (release notes, documentation, deprecation warnings)
2. **Deprecation period** (6-12 months minimum for public APIs)
3. **Sunset date** (specific date after which endpoint/field removed)
4. **Removal** (breaking change, requires major version bump)

**API Versioning Strategies:**

Choose versioning strategy based on API usage and team coordination:

**Strategy 1: URL Versioning (Recommended for REST)**
```
/api/v1/users  (stable, v1 schema)
/api/v2/users  (breaking changes, v2 schema)
```

**Pros:**
- Explicit version in URL (easy to see which version client uses)
- Simple routing (different controllers per version)
- Easy testing (can test both versions simultaneously)
- Clear deprecation (remove v1 routes when sunset)

**Cons:**
- URL changes (clients must update URLs)
- Code duplication (v1 and v2 controllers)

**When to use:** Public APIs, external clients, major breaking changes

**Strategy 2: Header Versioning**
```
GET /api/users
Accept: application/vnd.company.v2+json
```

**Pros:**
- URL unchanged (same endpoint, different versions)
- Clean URLs (no /v1, /v2 clutter)
- Gradual migration (clients specify version in header)

**Cons:**
- Less visible (version hidden in headers)
- More complex routing (check header to determine version)
- Harder to test (need to set headers)

**When to use:** Internal APIs, microservices, gradual rollout

**Strategy 3: Query Parameter Versioning**
```
/api/users?version=2
```

**Pros:**
- Simple to implement (check query param)
- Easy to test (just change URL param)

**Cons:**
- Pollutes query parameters (conflicts with other params)
- Easy to forget (no forcing function)
- Looks ugly in URLs

**When to use:** Quick prototyping, internal tools (avoid for production)

**Strategy 4: Content Negotiation (Media Type Versioning)**
```
GET /api/users
Accept: application/vnd.company.user.v2+json
```

**Pros:**
- RESTful standard (uses HTTP content negotiation)
- Granular versioning (per resource type)

**Cons:**
- Complex to implement (parsing media types)
- Hard to debug (non-obvious version source)
- Poor tooling support

**When to use:** Strict REST APIs, resource-specific versioning needs

**Migration Strategies:**

When making breaking changes, provide migration path for clients:

**Pattern 1: Dual-Write (Recommended for Most Breaking Changes)**

When changing field types or structures:

```javascript
// Server writes both old and new formats during transition period
const user = await createUser(data);

// Old format (deprecated)
response.user_id = user.id;  // For v1 clients

// New format (current)
response.id = user.id;  // For v2 clients
```

**Timeline:**
1. **Phase 1 (Release N)**: Add new field, write both formats (6 months)
2. **Phase 2 (Release N+1)**: Mark old field deprecated (6 months)
3. **Phase 3 (Release N+2)**: Remove old field (breaking change)

**Pattern 2: Version Field (Envelope Pattern)**

Include version in response for client detection:

```json
{
  "version": "2.0",
  "data": {
    "id": "user_123",
    "name": "Alice"
  }
}
```

**When to use:** Complex schema changes, need client-side branching logic

**Pattern 3: Feature Flags (Gradual Rollout)**

Use feature flags to enable new behavior per client:

```javascript
// Server checks feature flag per client
if (client.features.includes('new_user_schema')) {
  return newSchemaResponse(user);
} else {
  return legacySchemaResponse(user);
}
```

**When to use:** A/B testing, gradual migration, rollback capability

**Pattern 4: Proxy/Adapter Layer**

Create adapter that translates between versions:

```
Client (v1) → Adapter (v1→v2) → Server (v2)
```

**When to use:** Major rewrites, supporting many legacy clients, gradual server migration

**Decision Tree - Which Migration Strategy?**

```
1. How many clients need migration?
   ├─ <10 clients → Coordinate manual migration (direct communication)
   ├─ 10-100 clients → Dual-write with deprecation timeline (6-12 months)
   └─ >100 clients → Version URL with long support (12-24 months)

2. How critical is the API?
   ├─ High (payment, auth) → Dual-write + extensive testing + rollback plan
   ├─ Medium (features) → Feature flags + gradual rollout
   └─ Low (internal) → Direct migration with notification

3. Can you coordinate with clients?
   ├─ Yes (internal API) → Coordinated migration, shorter timeline
   └─ No (public API) → Long deprecation period, clear docs, version headers

4. How complex is the change?
   ├─ Simple (add field) → No migration needed (backward compatible)
   ├─ Medium (rename field) → Dual-write for 6-12 months
   └─ Complex (restructure) → New version URL, parallel maintenance
```

**Version Negotiation Example (OpenAPI):**

```yaml
openapi: 3.1.0
info:
  title: Example API
  version: 2.0.0
  description: |
    ## Version History
    - **v2.0** (current): User schema restructured, new endpoints
    - **v1.0** (deprecated, sunset: 2026-06-01): Legacy schema

servers:
  - url: https://api.example.com/v2
    description: Current version (v2)
  - url: https://api.example.com/v1
    description: Deprecated (v1, removes 2026-06-01)

paths:
  /users:
    get:
      summary: List users (v2)
      description: Returns users in v2 schema format
      responses:
        '200':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/UserV2'

components:
  schemas:
    UserV2:
      type: object
      properties:
        id:
          type: string
          description: User identifier (replaced deprecated user_id)
        profile:
          type: object
          description: Nested profile (v2 structure)
          properties:
            name:
              type: string
            email:
              type: string
```

**Testing Strategy for API Evolution:**

Test both old and new versions during migration:

```yaml
# Contract testing (Pact, Dredd)
tests:
  - name: v1_client_reads_v2_response
    description: Ensure v2 API doesn't break v1 clients
    client_version: v1
    server_version: v2
    expect: success  # v2 includes all v1 fields

  - name: v2_client_reads_v1_response
    description: Ensure v2 client handles v1 responses gracefully
    client_version: v2
    server_version: v1
    expect: success  # v2 client provides defaults for missing fields
```

**Output from this step:**

For OpenAPI specs, include:
- Breaking change matrix (documented above)
- Deprecation annotations (`deprecated: true`, `x-sunset-date`, `x-replacement-*`)
- Version strategy (URL versioning recommended for REST)
- Migration timeline for deprecated endpoints/fields

For Protobuf specs, include:
- Reserved field guidance (all removed fields documented)
- Field numbering best practices (never reuse, always increment)
- Backward compatibility rules (optional fields, default values)
- Enum evolution (always include zero value, never remove values)

For all APIs, document:
- Supported versions (which versions currently active)
- Deprecation timeline (sunset dates for deprecated features)
- Migration guide (how to upgrade from v1 to v2)
- Breaking change log (what changed between versions)

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

**Versioning & Evolution (Phase 2):**
- [ ] Breaking change matrix documented (what changes break vs safe)
- [ ] Protobuf reserved fields documented for deleted/renamed fields
- [ ] OpenAPI deprecation annotations present (deprecated: true, x-sunset-date, x-replacement-*)
- [ ] API versioning strategy chosen (URL/header/query param versioning)
- [ ] Migration strategies documented for breaking changes (dual-write, feature flags, adapter)
- [ ] Deprecation timeline defined (6-12 months minimum for public APIs)
- [ ] Version history documented (what changed between versions)
- [ ] Backward compatibility rules followed (no removed fields, no type changes)
- [ ] Protobuf field numbers never reused (reserved statement present)
- [ ] Contract testing covers version compatibility (v1 client reads v2 response)

**Validation (Phase 1):**
- [ ] All request schemas have required field markers
- [ ] String fields have minLength and maxLength constraints
- [ ] Number fields have minimum and maximum constraints
- [ ] Structured fields have pattern regex (email, phone, URLs)
- [ ] Enum fields define all allowed values
- [ ] File uploads have size limits and MIME type allowlists
- [ ] Validation error responses use consistent format with field names

**Performance (Phase 3):**
- [ ] Response size limits specified per endpoint type (default 100, max 1000 for lists)
- [ ] Compression strategy documented per format (gzip for JSON, LZ4/Snappy for Protobuf)
- [ ] Field selection patterns documented (sparse fieldsets, FieldMask, GraphQL fields)
- [ ] Caching headers specified for GET endpoints (Cache-Control, ETag, Last-Modified)
- [ ] Protobuf varint guidance provided for integer fields (int32/int64 vs fixed32/fixed64)
- [ ] Pagination prevents large payloads
- [ ] Heavy operations are async (return 202 Accepted)
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
