---
description: POST-CASCADE - Generate comprehensive API contracts with OpenAPI specification
---

# Generate API Contracts (Post-Cascade Development)

You are helping the user create comprehensive API contracts including OpenAPI/Swagger specifications, endpoint definitions, request/response schemas, authentication patterns, and error handling. This is typically done after Session 7 when you have a project scaffold and are ready to implement the API layer.

## When to Use This

**Run AFTER Session 7** (`/scaffold-project`) if:
- You have a working development environment
- You're ready to implement the API layer
- You want detailed API specifications before building features
- You need API documentation for frontend/mobile teams

**Or run AFTER Session 5** if:
- You want to design APIs early in the process
- You're planning integration architecture before scaffolding
- You have clear backlog requirements
- You need API contracts for external partners

**Skip this** if:
- You're building a frontend-only application (no backend)
- Your product doesn't expose APIs
- You prefer to evolve APIs incrementally during development

## Your Task

Create comprehensive API contracts including:
- OpenAPI 3.0 specification
- Endpoint definitions with HTTP methods, paths, and parameters
- Request and response schemas with validation rules
- Authentication and authorization patterns
- Error handling and status codes
- Rate limiting and pagination strategies
- Versioning approach
- API documentation with examples

---

## Process

### Step 1: Read Previous Outputs

**Required inputs:**

```
Read: output/00-user-journey.md
Read: output/01-tech-stack.md
Read: output/05-architecture.md
Read: output/07-backlog/BACKLOG.md
```

**Optional inputs (if available):**

```
Read: output/07-project-scaffold.md
Read: output/17-database-schema.md
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

**Extract from Backlog**:
- What features need what endpoints?
- What data operations are required (CRUD, search, bulk)?
- What integrations are planned (webhooks, third-party APIs)?

**Extract from Database Schema** (if available):
- What entities exist?
- What relationships need API exposure?
- What query patterns should be supported?

**Example (from compliance-saas):**
- Journey actions: Upload document, select frameworks, view assessment results, share report
- Tech stack: FastAPI (Python), JWT authentication, REST API, OpenAPI 3.0
- Architecture: Multi-tenant (team-based), rate-limited (100 req/min), RESTful principles
- Key entities: Users, Teams, Documents, Assessments, Frameworks
- Critical operations: Document upload (multipart/form-data), assessment status polling, results retrieval

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

**Example (compliance-saas):**

```
Journey Step 1: User uploads document
→ Resource: Documents
→ Needs: Create (upload), Read (get document), List (user's documents), Delete

Journey Step 2: User selects frameworks
→ Resource: Frameworks (system resource, read-only for users)
→ Needs: List (all available frameworks), Read (framework details)

Journey Step 3: AI assesses document
→ Resource: Assessments
→ Needs: Create (trigger assessment), Read (get results), List (user's assessments)
→ Special: Status polling endpoint, cancel operation

Journey Step 4: User shares report
→ Special endpoint: /api/assessments/:id/share (generate public URL)
→ Public endpoint: /public/reports/:token (view shared report)
```

**Core resources identified:**
- `/api/documents` - User-uploaded compliance documents
- `/api/frameworks` - System frameworks (SOC2, GDPR, etc.)
- `/api/assessments` - Document assessment jobs and results
- `/api/teams` - Team management (multi-tenancy)
- `/api/usage` - Usage tracking for billing

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

**Example endpoint structure (compliance-saas):**

```yaml
# Documents
GET    /api/documents           # List user's documents
POST   /api/documents           # Upload new document
GET    /api/documents/:id       # Get document details
DELETE /api/documents/:id       # Delete document
GET    /api/documents/:id/download  # Download original file

# Frameworks (system resources)
GET    /api/frameworks          # List all frameworks
GET    /api/frameworks/:id      # Get framework details

# Assessments
GET    /api/assessments         # List user's assessments
POST   /api/assessments         # Create new assessment
GET    /api/assessments/:id     # Get assessment details & results
POST   /api/assessments/:id/cancel  # Cancel running assessment
POST   /api/assessments/:id/share   # Generate shareable link

# Public (no auth)
GET    /public/reports/:token   # View shared assessment report

# Teams (admin only)
GET    /api/teams/:id           # Get team details
PATCH  /api/teams/:id           # Update team settings
GET    /api/teams/:id/usage     # Get team usage stats (billing)

# User management
GET    /api/users/me            # Get current user profile
PATCH  /api/users/me            # Update profile
```

---

### Step 4: Define Request and Response Schemas

For EACH endpoint, define:
- **Request schema** (path params, query params, headers, body)
- **Response schema** (success and error cases)
- **Validation rules** (required fields, formats, constraints)

**Decision Tree - Schema Design:**

```
1. What data format?
   ├─ Simple CRUD → JSON request/response
   ├─ File upload → multipart/form-data
   ├─ Bulk operations → JSON array or newline-delimited JSON
   └─ Real-time updates → WebSocket or Server-Sent Events

2. What validation is needed?
   ├─ Required fields → Mark as required in schema
   ├─ Format validation → Use JSON Schema formats (email, url, uuid)
   ├─ Business rules → Document in description, implement in backend
   └─ Cross-field validation → Note dependencies in schema

3. How to handle pagination?
   ├─ Offset-based → ?page=1&limit=20
   ├─ Cursor-based → ?cursor=xyz&limit=20 (better for large datasets)
   └─ Default: Cursor-based if >10K records expected, else offset

4. How to handle errors?
   ├─ Use standard HTTP status codes
   ├─ Consistent error response format
   └─ Include actionable error messages
```

**Example schema (Document Upload):**

```yaml
POST /api/documents
Content-Type: multipart/form-data

Request:
  file: [binary]           # Required, PDF or DOCX, max 50MB
  name: string             # Optional, defaults to filename
  frameworks: string[]     # Optional, framework IDs to assess against

Response 201 Created:
{
  "id": "doc_abc123",
  "name": "Privacy Policy 2025.pdf",
  "fileSize": 2456789,
  "status": "processing",
  "uploadedAt": "2025-11-11T10:30:00Z",
  "userId": "user_xyz",
  "frameworks": ["fw_gdpr", "fw_soc2"]
}

Response 400 Bad Request:
{
  "error": {
    "code": "INVALID_FILE_TYPE",
    "message": "File must be PDF or DOCX",
    "field": "file"
  }
}

Response 413 Payload Too Large:
{
  "error": {
    "code": "FILE_TOO_LARGE",
    "message": "File size exceeds 50MB limit",
    "limit": 52428800,
    "received": 62914560
  }
}
```

**Example schema (Assessment Status):**

```yaml
GET /api/assessments/:id

Response 200 OK:
{
  "id": "asmt_def456",
  "documentId": "doc_abc123",
  "status": "completed",        # "pending" | "processing" | "completed" | "failed"
  "progress": 100,               # 0-100
  "frameworks": ["fw_gdpr", "fw_soc2"],
  "results": {
    "score": 85,
    "findings": [
      {
        "framework": "fw_gdpr",
        "section": "Article 32",
        "severity": "high",
        "issue": "Missing encryption specification",
        "location": "Page 12, Section 4.2"
      }
    ],
    "summary": "Document is 85% compliant..."
  },
  "startedAt": "2025-11-11T10:31:00Z",
  "completedAt": "2025-11-11T10:32:15Z",
  "durationMs": 75000
}

Response 404 Not Found:
{
  "error": {
    "code": "ASSESSMENT_NOT_FOUND",
    "message": "Assessment with ID 'asmt_def456' not found"
  }
}
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

**Example auth specification (compliance-saas):**

```yaml
# Authentication
securitySchemes:
  bearerAuth:
    type: http
    scheme: bearer
    bearerFormat: JWT
    description: |
      JWT token from Clerk authentication.

      Obtain token by:
      1. User signs in via Clerk
      2. Frontend gets session token
      3. Include in Authorization header

      Example: Authorization: Bearer eyJhbGc...

# Apply to all endpoints (except public)
security:
  - bearerAuth: []

# Endpoints that DON'T require auth:
/public/reports/{token}:
  security: []  # Override: no auth needed
```

**Authorization Patterns:**

```typescript
// Example authorization checks

// Pattern 1: User owns resource
GET /api/documents/:id
→ Query: SELECT * FROM documents WHERE id = :id AND user_id = :current_user_id

// Pattern 2: Team resource
GET /api/assessments
→ Query: SELECT * FROM assessments
         WHERE user_id IN (SELECT id FROM users WHERE team_id = :current_user_team_id)

// Pattern 3: Admin only
GET /api/teams/:id/usage
→ Check: current_user.role === 'admin' OR current_user.team_id === :id

// Pattern 4: Rate limit by tier
POST /api/assessments
→ Check: usage_this_month < team.plan_limits.assessments_per_month
```

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

**Example error definitions:**

```yaml
# Validation Error
400 Bad Request:
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed",
    "details": {
      "file": "File must be PDF or DOCX",
      "frameworks": "At least one framework is required"
    }
  }
}

# Authentication Error
401 Unauthorized:
{
  "error": {
    "code": "INVALID_TOKEN",
    "message": "Authentication token is invalid or expired",
    "details": {
      "expiredAt": "2025-11-11T10:00:00Z"
    }
  }
}

# Rate Limit Error
429 Too Many Requests:
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "You have exceeded your rate limit",
    "details": {
      "limit": 100,
      "remaining": 0,
      "resetAt": "2025-11-11T11:00:00Z"
    }
  }
}

# Business Logic Error
422 Unprocessable Entity:
{
  "error": {
    "code": "INSUFFICIENT_CREDITS",
    "message": "Your team has insufficient credits for this operation",
    "details": {
      "required": 10,
      "available": 3,
      "upgradeUrl": "/billing/upgrade"
    }
  }
}
```

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

**Example rate limit specification:**

```yaml
# Rate Limit Headers (include in all responses)
X-RateLimit-Limit: 100          # Max requests per window
X-RateLimit-Remaining: 47       # Requests remaining
X-RateLimit-Reset: 1699704000   # Unix timestamp when limit resets

# Rate Limits by Endpoint Type
GET /api/*:
  - Free tier: 100 requests/min
  - Pro tier: 1000 requests/min
  - Enterprise: 10000 requests/min

POST /api/documents:
  - Free tier: 10 uploads/hour
  - Pro tier: 100 uploads/hour
  - Enterprise: Unlimited

POST /api/assessments:
  - Free tier: 5 assessments/day
  - Pro tier: 100 assessments/day
  - Enterprise: Unlimited
```

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

**Example pagination:**

```yaml
# Cursor-based pagination (recommended)
GET /api/documents?cursor=abc123&limit=20

Response:
{
  "data": [
    { "id": "doc_001", "name": "Policy.pdf", ... },
    { "id": "doc_002", "name": "Agreement.pdf", ... }
  ],
  "pagination": {
    "nextCursor": "def456",      # Use this for next page
    "prevCursor": "xyz789",      # Use this for previous page
    "hasMore": true,             # Are there more results?
    "total": null                # Optional: total count (expensive)
  }
}

# Offset-based pagination (simpler)
GET /api/frameworks?page=1&limit=20

Response:
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "totalPages": 3
  }
}
```

---

### Step 8: Generate OpenAPI Specification

Create complete OpenAPI 3.0 specification file.

**OpenAPI Structure:**

```yaml
openapi: 3.0.3
info:
  title: [Project Name] API
  description: |
    [Project description from user journey]

    ## Authentication
    [Auth instructions]

    ## Rate Limiting
    [Rate limit policy]

    ## Errors
    [Error handling conventions]
  version: 1.0.0
  contact:
    name: [Team Name]
    email: support@example.com

servers:
  - url: https://api.example.com
    description: Production
  - url: https://staging-api.example.com
    description: Staging
  - url: http://localhost:3000
    description: Local development

tags:
  - name: Documents
    description: Document upload and management
  - name: Assessments
    description: Compliance assessment operations
  - name: Frameworks
    description: Compliance framework definitions

paths:
  /api/documents:
    get:
      summary: List documents
      description: Get all documents for the authenticated user
      tags: [Documents]
      security:
        - bearerAuth: []
      parameters:
        - name: status
          in: query
          schema:
            type: string
            enum: [processing, ready, error]
        - name: cursor
          in: query
          schema:
            type: string
        - name: limit
          in: query
          schema:
            type: integer
            minimum: 1
            maximum: 100
            default: 20
      responses:
        '200':
          description: Successful response
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/DocumentList'
        '401':
          $ref: '#/components/responses/UnauthorizedError'

    post:
      summary: Upload document
      description: Upload a new compliance document for assessment
      tags: [Documents]
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          multipart/form-data:
            schema:
              type: object
              required:
                - file
              properties:
                file:
                  type: string
                  format: binary
                  description: PDF or DOCX file (max 50MB)
                name:
                  type: string
                  description: Custom document name
                frameworks:
                  type: array
                  items:
                    type: string
                  description: Framework IDs to assess against
      responses:
        '201':
          description: Document uploaded successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Document'
        '400':
          $ref: '#/components/responses/ValidationError'
        '413':
          $ref: '#/components/responses/PayloadTooLarge'

components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT

  schemas:
    Document:
      type: object
      required:
        - id
        - name
        - status
        - uploadedAt
      properties:
        id:
          type: string
          example: doc_abc123
        name:
          type: string
          example: Privacy Policy 2025.pdf
        fileSize:
          type: integer
          example: 2456789
        status:
          type: string
          enum: [processing, ready, error]
        uploadedAt:
          type: string
          format: date-time
        userId:
          type: string
        frameworks:
          type: array
          items:
            type: string

    Error:
      type: object
      required:
        - error
      properties:
        error:
          type: object
          required:
            - code
            - message
          properties:
            code:
              type: string
              example: VALIDATION_ERROR
            message:
              type: string
              example: Request validation failed
            details:
              type: object
            field:
              type: string

  responses:
    UnauthorizedError:
      description: Authentication token is missing or invalid
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'

    ValidationError:
      description: Request validation failed
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
```

---

### Step 9: Document API Design Decisions

Create comprehensive documentation explaining:
- Why these endpoints (traces to journey)
- Why this structure (alternatives considered)
- Why these schemas (trade-offs)
- Why this auth pattern (security vs convenience)
- How to version (breaking changes strategy)

**Template structure:**

```markdown
# API Contracts

## Overview
[High-level description, endpoint count, key patterns]

## API Architecture

### Style: REST
**Why REST**: [Journey-based reasoning]
**Alternatives Considered**: GraphQL, gRPC, tRPC

### Base URL
Production: https://api.example.com
Staging: https://staging-api.example.com

### Versioning
Strategy: URL versioning (/v1/, /v2/)
Current version: v1

## Authentication
[Method, token format, how to obtain, refresh strategy]

## Core Resources

### Documents
**Purpose**: [Why this resource exists - journey connection]

**Endpoints**:
| Method | Path | Description |
|--------|------|-------------|
| GET | /api/documents | List user's documents |
| POST | /api/documents | Upload new document |
| GET | /api/documents/:id | Get document details |
| DELETE | /api/documents/:id | Delete document |

**Schema**: [Link to OpenAPI schema]

**Design Decisions**:
- Why multipart/form-data upload
- Why cursor-based pagination
- Why soft delete vs hard delete

## Rate Limiting
[Policy, headers, by tier]

## Error Handling
[Format, status codes, examples]

## Pagination
[Strategy, format, when to use]

## OpenAPI Specification
[Link to openapi.yaml file]

## Testing
[How to test endpoints, example requests with curl/httpie]

## Changelog
[Version history, breaking changes]
```

---

### Step 10: Validate API Design

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

**Security:**
- [ ] Authentication required on protected endpoints
- [ ] Authorization checks documented
- [ ] Sensitive data not exposed in URLs
- [ ] Rate limiting prevents abuse
- [ ] CORS policy considered
- [ ] HTTPS enforced in production

**Performance:**
- [ ] Pagination prevents large payloads
- [ ] Heavy operations are async (return 202 Accepted)
- [ ] Caching headers specified for cacheable endpoints
- [ ] File uploads support chunking/resumable uploads

---

## What We DIDN'T Choose (And Why)

### GraphQL API

**What it is**: Query language for APIs that lets clients request exactly the data they need

**Why not (for this journey)**:
- **Journey has simple CRUD operations** - documents, assessments, results are straightforward entities
- **No over-fetching problem** - compliance data is not deeply nested or graph-like
- **Team expertise** (from tech stack) - team more familiar with REST
- **"Boring is beautiful"** - REST is proven, well-understood, simpler to debug
- **Compliance domain** - predictable data shapes, not complex querying needs

**When to reconsider**:
- IF mobile app needs precise data control (minimize bandwidth)
- IF UI needs highly variable data shapes (different views need different fields)
- IF building public API where clients want query flexibility
- IF team gains GraphQL expertise

**Example**: If compliance documents had 50+ optional fields and different dashboards needed completely different subsets, GraphQL would shine. Compliance assessments have predictable structure.

---

### gRPC API

**What it is**: High-performance RPC framework using Protocol Buffers, binary protocol

**Why not (for this journey)**:
- **Journey is web-based** - browsers don't natively support gRPC (need grpc-web proxy)
- **No performance bottleneck** - compliance assessment is IO-bound (AI processing), not network-bound
- **Developer experience** - REST/JSON is easier to debug, test, document
- **Integration complexity** - harder for third-party integrations (REST is ubiquitous)

**When to reconsider**:
- IF building microservices with service-to-service communication (gRPC excels here)
- IF hitting network bandwidth limits (binary is more compact)
- IF need bidirectional streaming (live updates)
- IF team is building internal APIs only (not public-facing)

**Example**: Internal microservice for document parsing service calling assessment service 1000x/sec - gRPC would reduce latency. Public-facing user API - stick with REST.

---

### API Versioning in Headers

**What it is**: Version specified in Accept header instead of URL path

```
Accept: application/vnd.myapi.v2+json
```

**Why not (for this journey)**:
- **URL versioning is simpler** - /v1/documents vs /v2/documents is explicit
- **Better for public APIs** - users can see version in URL
- **Easier debugging** - version visible in logs, browser dev tools
- **Framework support** - most REST frameworks have built-in URL versioning

**When to reconsider**:
- IF building hypermedia API (HATEOAS) where version is negotiated
- IF version applies to entire API surface (not individual resources)
- IF following strict REST purist principles

**Example**: Internal API with sophisticated clients that negotiate capabilities - header versioning makes sense. Public SaaS API for developers - URL versioning is clearer.

---

### OAuth 2.0 with Multiple Flows

**What it is**: Full OAuth 2.0 server with authorization code, client credentials, refresh tokens, etc.

**Why not (for this journey)**:
- **Journey is B2B SaaS** - users sign in through Clerk/Auth0, not OAuth app authorization
- **Complexity is high** - OAuth 2.0 server implementation is significant effort
- **No third-party app integrations** (yet) - don't need app authorization flow
- **JWT tokens from Clerk are sufficient** for user authentication

**When to reconsider**:
- IF building platform with third-party apps (Slack/GitHub-style integrations)
- IF need programmatic API access for automation tools
- IF enterprise customers require custom OAuth flows
- IF exposing public API for external developers

**Example**: Platform where users build custom integrations (Zapier-style) - full OAuth 2.0 is necessary. Internal SaaS product - Clerk JWT is simpler and sufficient.

---

### WebSocket API for Real-Time Updates

**What it is**: Persistent connection for bidirectional real-time communication

**Why not (for this journey)**:
- **Polling is sufficient** - assessment status checked every 2-5 seconds is acceptable
- **Complexity vs benefit** - WebSocket infrastructure (scaling, connection management) is complex
- **Journey doesn't require instant updates** - 2-second delay is tolerable for document processing
- **REST + polling is simpler** - no connection state management

**When to reconsider**:
- IF journey requires <500ms updates (real-time collaboration, live chat)
- IF many users watch same resource (broadcast updates efficiently)
- IF building mobile app (WebSocket reduces battery drain vs aggressive polling)
- IF scale justifies complexity (10K+ concurrent connections)

**Example**: Real-time collaborative document editing where users see each other's changes instantly - WebSocket essential. Asynchronous document processing with status checks - polling is fine.

---

### API Gateway (Kong, AWS API Gateway)

**What it is**: Centralized gateway for rate limiting, auth, logging, routing

**Why not (for this journey)**:
- **Journey is MVP stage** - single API service, no microservices yet
- **Premature optimization** - framework-level rate limiting (FastAPI, Express) is sufficient
- **Operational complexity** - another service to deploy, monitor, debug
- **Cost** - managed API gateways add monthly cost

**When to reconsider**:
- IF building microservices (gateway routes to multiple backend services)
- IF need advanced rate limiting (per-customer quotas, complex policies)
- IF need API analytics (detailed usage tracking across services)
- IF enterprise customers require IP whitelisting, custom auth

**Example**: 5+ microservices with complex routing and auth requirements - API gateway centralizes logic. Single FastAPI service - built-in middleware is simpler.

---

## Setup Instructions

After generating API contracts:

### For FastAPI (Python):

```bash
# 1. Copy OpenAPI spec to your project
cp output/18-api-contracts/openapi.yaml ./docs/openapi.yaml

# 2. Install FastAPI with OpenAPI support
pip install fastapi[all]

# 3. View interactive docs (auto-generated from OpenAPI)
# Start server, then visit:
http://localhost:8000/docs        # Swagger UI
http://localhost:8000/redoc       # ReDoc

# 4. Generate client SDKs (optional)
npm install -g openapi-generator-cli
openapi-generator-cli generate -i openapi.yaml -g typescript-axios -o ./sdk/typescript
```

### For Express (Node.js):

```bash
# 1. Copy OpenAPI spec
cp output/18-api-contracts/openapi.yaml ./docs/openapi.yaml

# 2. Install Swagger tools
npm install swagger-ui-express yamljs

# 3. Serve Swagger UI
# Add to your Express app:
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./docs/openapi.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

# 4. Visit docs at http://localhost:3000/api-docs
```

### For Django (Python):

```bash
# 1. Install DRF with OpenAPI
pip install djangorestframework drf-spectacular

# 2. Configure in settings.py
REST_FRAMEWORK = {
    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',
}

# 3. Generate schema
python manage.py spectacular --file openapi.yaml

# 4. Serve UI at /api/docs/
```

---

## Output Files

This command generates:

**1. Documentation** (`output/18-api-contracts.md`):
- API architecture overview
- Design decisions and rationale
- Endpoint documentation with examples
- Authentication and authorization guide
- Error handling conventions
- Testing examples (curl, httpie)

**2. OpenAPI Specification** (`output/18-api-contracts/openapi.yaml`):
- Complete OpenAPI 3.0 specification
- All endpoints with request/response schemas
- Authentication schemes
- Reusable components
- Examples for each endpoint

**3. Testing Collection** (optional) (`output/18-api-contracts/postman-collection.json`):
- Postman/Insomnia collection
- Pre-configured requests for all endpoints
- Environment variables for different stages
- Test scripts for validation

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

**Tech Stack Alignment:**
- [ ] API style matches tech stack decision
- [ ] Auth method from tech stack implemented
- [ ] Framework-specific patterns leveraged
- [ ] Documentation tool compatible with stack

**Documentation:**
- [ ] "What We DIDN'T Choose" section complete (3+ alternatives)
- [ ] Each endpoint has purpose explanation
- [ ] Design decisions reference journey
- [ ] Testing examples provided
- [ ] Setup instructions clear

---

## After This Session

**Next steps:**
1. **Copy OpenAPI spec** to your project docs folder
2. **Set up API documentation UI** (Swagger/ReDoc)
3. **Generate client SDKs** (optional, for frontend/mobile)
4. **Implement endpoints** following the spec
5. **Write API tests** using the documented examples

**Use these contracts for:**
- Backend implementation (reference for building endpoints)
- Frontend development (know what APIs are available)
- API documentation (Swagger UI for developers)
- Client SDK generation (TypeScript, Python, etc.)
- Contract testing (validate implementation matches spec)

**Future extensions:**
- Add webhooks for async events (assessment completed, etc.)
- Add GraphQL layer if query complexity grows
- Add API versioning strategy when breaking changes needed
- Consider API gateway when microservices architecture is adopted

---

## Remember

**Every endpoint must serve the user journey.**

Don't create endpoints "just in case". Design APIs based on:
1. What user actions require API support? → Endpoints
2. What data flows through the system? → Schemas
3. How do users interact with features? → Request/response patterns
4. What security is needed? → Auth and rate limiting

If you can't trace an endpoint back to a journey step or backlog feature, you probably don't need it.

**Reference files:**
- Journey: `output/00-user-journey.md`
- Tech stack: `output/01-tech-stack.md`
- Architecture: `output/05-architecture.md`
- Backlog: `output/07-backlog/BACKLOG.md`
- Database schema: `output/17-database-schema.md`

---

**Now, read previous outputs and design API contracts that serve your users' journey!**
