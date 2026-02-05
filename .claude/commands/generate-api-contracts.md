---
description: Session 8b - Generate technical API contracts (OpenAPI/Protobuf specs, schemas, endpoints)
---

# Generate API Contracts (Session 8b) - Orchestrator

You are helping the user create technical API implementation specifications using an agentic architecture. This orchestrator conditionally invokes 5 specialized phase agents to generate OpenAPI/Protobuf schemas, endpoint definitions, security patterns, versioning strategies, performance optimizations, code generation tooling, and format-specific contracts.

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

Create technical API implementation specifications by conditionally invoking phase agents:
- **Phase 1** (ALWAYS): Security & Data Integrity (PII marking, type mapping, validation)
- **Phase 2** (ALWAYS): API Versioning & Evolution (breaking changes, deprecation)
- **Phase 3** (CONDITIONAL): Performance Optimization (compression, caching, field selection)
- **Phase 4** (ALWAYS): Code Generation & Contract Testing (SDK gen, contract tests)
- **Phase 5** (CONDITIONAL): Format Coverage (GraphQL, MessagePack, CBOR, hybrid)

---

## Process

### Step 1: Read Previous Outputs

**Required inputs:**

```
Read: product-guidelines/00-user-journey.ctx.md
Read: product-guidelines/02-tech-stack.ctx.md
Read: product-guidelines/04-architecture.ctx.md
Read: product-guidelines/07-database-schema.ctx.md
Read: product-guidelines/08-api-design.ctx.md
```

**Optional inputs (if available):**

```
Read: product-guidelines/02a-constraints.ctx.md (if exists - regulatory requirements)
```

**Context Optimization**: We read .ctx.md files for significant context reduction while retaining all critical decisions.

**Extract key information:**

**From API Design (08-api-design.ctx.md)** - CRITICAL:
- API Paradigm: REST, GraphQL, gRPC, WebSocket, or hybrid
- Serialization Format: JSON, Protobuf, MessagePack, or hybrid
- Authentication Strategy: Method, token placement, lifetime
- Rate Limiting Strategy: Limits by tier, endpoint-specific rules
- Pagination Approach: Cursor-based or offset-based
- Error Handling Format: Standard error structure and status codes

**From Journey (00-user-journey.ctx.md)**:
- What user actions require API endpoints?
- What data flows through the system?
- What are the critical path operations?
- What integration points exist with external systems?
- User volume estimates (for Phase 3 conditional)

**From Tech Stack (02-tech-stack.ctx.md)**:
- Backend framework (FastAPI, Express, NestJS, Django, etc.)
- Authentication method (JWT, OAuth, API keys, Clerk, Auth0)
- API style preference (REST, GraphQL, gRPC)
- Documentation tools (Swagger UI, Redoc, Postman)
- Supported languages (for Phase 4 SDK generation)

**From Architecture (04-architecture.ctx.md)**:
- API design patterns (REST principles, HATEOAS, etc.)
- Security requirements
- Rate limiting strategy
- Caching approach
- Multi-tenancy implementation
- Traffic volume estimates (for Phase 3 conditional)

**From Database Schema (07-database-schema.ctx.md)**:
- What entities exist?
- What PII fields need marking? (for Phase 1)
- What relationships need API exposure?
- What query patterns should be supported?

**From Constraints (02a-constraints.ctx.md, if available)**:
- What regulatory requirements apply (GDPR, HIPAA, PCI DSS, SOC 2)?
- Are there EU users requiring GDPR compliance? (for Phase 1)
- What compliance frameworks are in scope?
- What third-party integrations exist? (for webhook endpoints)

---

### Step 2: Analyze Requirements for Conditional Phases

**CRITICAL**: Before invoking agents, determine which phases are needed based on journey characteristics.

**Check for Phase 3 (Performance Optimization) requirement:**

```
Does the journey have ANY of:
1. Mobile users (bandwidth constraints)?
2. High-volume traffic (>10K requests/day)?
3. Large payloads (lists with >100 items, nested data)?
4. Real-time requirements?

IF YES → Set phase3_needed = TRUE
IF NO → Set phase3_needed = FALSE
```

**Check for Phase 5 (Format Coverage) requirement:**

```
What API paradigm and format was chosen in Session 8?

IF REST + JSON only → Set phase5_needed = FALSE
IF GraphQL → Set phase5_needed = TRUE
IF gRPC/Protobuf → Set phase5_needed = FALSE (covered in Phases 1-4)
IF MessagePack → Set phase5_needed = TRUE
IF CBOR → Set phase5_needed = TRUE
IF Hybrid (REST+gRPC, REST+GraphQL) → Set phase5_needed = TRUE
```

**Document conditional decisions:**

```
Phase 3 (Performance): [INVOKE / SKIP] - Reason: [mobile users / high traffic / simple internal tool]
Phase 5 (Format Coverage): [INVOKE / SKIP] - Reason: [GraphQL / hybrid / REST+JSON only]
```

---

### Step 3: Identify Core Resources

**Before invoking phase agents**, identify core API resources from database schema and journey:

**Decision Tree - Resource Identification:**

```
For each entity in database schema, ask:

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

**Output**: List of core resources with their purposes and journey connections.

---

### Step 4: Invoke Phase 1 Agent (Security & Data Integrity) - ALWAYS REQUIRED

**Phase 1 is mandatory for ALL API contracts.**

Use the Task tool:
- **subagent_type**: `general-purpose`
- **description**: `Apply security and data integrity patterns`
- **prompt**:
  ```
  Invoke the api-contracts-phase1-security sub-agent to apply security and data integrity patterns.

  Agent path: .claude/agents/api-contracts-phase1-security.md

  Inputs:
  - Database schema with PII fields: [From 07-database-schema.ctx.md]
  - Constraints (GDPR requirements): [From 02a-constraints.ctx.md if exists]
  - API paradigm: [From 08-api-design.ctx.md]
  - Core resources list: [From Step 3]

  Follow the agent specification to:
  1. Identify PII fields from database schema
  2. Mark all PII fields in API schemas with x-pii: true
  3. Add GDPR data export endpoint if EU users exist
  4. Map database types to API types (NUMERIC→string, BIGINT→string, TIMESTAMP→ISO 8601)
  5. Propagate all DB constraints to API validation (NOT NULL, VARCHAR, CHECK)
  6. Define DoS prevention limits (max request size, nesting depth, timeout)
  7. Document deserialization security warnings (no pickle/unsafe YAML)

  Return structured output with:
  - PII fields marked (list with x-pii annotations)
  - GDPR export endpoint schema (if applicable)
  - Type mapping table (DB type → API type)
  - Validation rules per field type
  - Security warnings summary
  ```

**Expected output from Phase 1:**
- PII fields marked in all schemas
- GDPR export endpoint (if applicable)
- Type mappings applied to all schemas
- Validation rules on all request schemas
- Security warnings documented

---

### Step 5: Invoke Phase 2 Agent (API Versioning & Evolution) - ALWAYS REQUIRED

**Phase 2 is mandatory for ALL API contracts.**

Use the Task tool:
- **subagent_type**: `general-purpose`
- **description**: `Design API versioning and evolution strategy`
- **prompt**:
  ```
  Invoke the api-contracts-phase2-versioning sub-agent to design versioning and evolution strategy.

  Agent path: .claude/agents/api-contracts-phase2-versioning.md

  Inputs:
  - API paradigm: [From 08-api-design.ctx.md]
  - Core resources: [From Step 3]
  - Tech stack: [From 02-tech-stack.ctx.md]

  Follow the agent specification to:
  1. Document breaking change matrix (what changes break vs safe)
  2. Choose versioning strategy (URL/header/media type versioning)
  3. Define Protobuf reserved fields for deleted/renamed fields (if gRPC)
  4. Add OpenAPI deprecation annotations (deprecated: true, x-sunset-date) (if REST)
  5. Define migration strategies (dual-write, feature flags, adapter)
  6. Create deprecation timeline template (6-12 months for public APIs)

  Return structured output with:
  - Breaking change matrix documented
  - Versioning strategy chosen
  - Protobuf reserved fields (if gRPC)
  - OpenAPI deprecation annotations (if REST)
  - Migration timeline template
  ```

**Expected output from Phase 2:**
- Breaking change matrix documented
- Versioning strategy chosen and documented
- Protobuf reserved fields (if gRPC)
- OpenAPI deprecation annotations (if REST)
- Migration timeline for future changes

---

### Step 6: Invoke Phase 3 Agent (Performance Optimization) - CONDITIONAL

**Conditional Invocation**: Only invoke if `phase3_needed = TRUE` (from Step 2).

**IF phase3_needed = TRUE:**

Use the Task tool:
- **subagent_type**: `general-purpose`
- **description**: `Apply performance optimization patterns`
- **prompt**:
  ```
  Invoke the api-contracts-phase3-performance sub-agent to apply performance optimization patterns.

  Agent path: .claude/agents/api-contracts-phase3-performance.md

  Inputs:
  - Journey traffic estimates: [From 00-user-journey.ctx.md and 04-architecture.ctx.md]
  - Mobile users flag: [TRUE/FALSE from journey analysis]
  - Payload sizes: [From database schema and resource analysis]
  - API paradigm: [From 08-api-design.ctx.md]

  Follow the agent specification to:
  1. Define response size limits (default 100, max 1000 for lists)
  2. Choose compression strategy (gzip/Brotli for JSON, LZ4/Snappy for Protobuf)
  3. Define field selection patterns (sparse fieldsets, FieldMask, GraphQL)
  4. Configure HTTP caching (Cache-Control, ETag, Last-Modified)
  5. Add Protobuf varint guidance (int32/int64 vs fixed32/fixed64)

  Return structured output with:
  - Response size limits per endpoint type
  - Compression strategy documented
  - Field selection patterns defined
  - Caching headers specified
  - Protobuf optimization guidance (if gRPC)
  ```

**Expected output from Phase 3:**
- Response size limits specified
- Compression strategy documented
- Field selection patterns defined
- HTTP caching rules configured
- Protobuf varint guidance (if applicable)

**IF phase3_needed = FALSE:**

Document that Phase 3 was skipped:
```
Phase 3 (Performance Optimization): SKIPPED
Reason: [Simple internal tool / Low traffic (<10K/day) / No mobile users / Small payloads]
Note: Performance optimization can be added later if requirements change.
```

---

### Step 7: Invoke Phase 4 Agent (Code Generation & Contract Testing) - ALWAYS REQUIRED

**Phase 4 is mandatory for ALL API contracts.**

Use the Task tool:
- **subagent_type**: `general-purpose`
- **description**: `Generate code generation and contract testing tooling`
- **prompt**:
  ```
  Invoke the api-contracts-phase4-codegen sub-agent to generate code generation and contract testing tooling.

  Agent path: .claude/agents/api-contracts-phase4-codegen.md

  Inputs:
  - Tech stack languages: [From 02-tech-stack.ctx.md - frontend/backend languages]
  - API paradigm: [From 08-api-design.ctx.md]
  - Project structure preferences: [From 04-architecture.ctx.md]

  Follow the agent specification to:
  1. Generate OpenAPI client SDK generation commands (TypeScript, Python, Go, etc.)
  2. Generate Protobuf client SDK generation commands (if gRPC)
  3. Define Session 12 integration (where generated code should be placed)
  4. Add generation scripts to package.json / Makefile
  5. Choose contract testing tool (Dredd for REST, grpc-testing for gRPC, Pact)
  6. Create type consistency validation script template
  7. Provide CI/CD pipeline integration examples

  Return structured output with:
  - Client SDK generation commands for all languages
  - Session 12 integration guidance (file paths)
  - Build scripts (npm run generate:api, make generate-api)
  - Contract testing tool configuration
  - Type consistency validation script template
  - CI/CD pipeline integration examples
  ```

**Expected output from Phase 4:**
- Client SDK generation commands for all tech stack languages
- Session 12 integration guidance (where to place generated code)
- Contract testing tool configuration
- Type consistency validation script template
- CI/CD pipeline integration examples

---

### Step 8: Invoke Phase 5 Agent (Format Coverage) - CONDITIONAL

**Conditional Invocation**: Only invoke if `phase5_needed = TRUE` (from Step 2).

**IF phase5_needed = TRUE:**

Use the Task tool:
- **subagent_type**: `general-purpose`
- **description**: `Generate format-specific contracts`
- **prompt**:
  ```
  Invoke the api-contracts-phase5-formats sub-agent to generate format-specific contracts.

  Agent path: .claude/agents/api-contracts-phase5-formats.md

  Inputs:
  - API paradigm: [From 08-api-design.ctx.md]
  - Serialization format: [From 08-api-design.ctx.md]
  - Core resources: [From Step 3]
  - Database schema: [From 07-database-schema.ctx.md]
  - Journey requirements: [From 00-user-journey.ctx.md]

  Follow the agent specification to:
  - IF GraphQL: Generate GraphQL SDL schema with types, queries, mutations, subscriptions
  - IF MessagePack: Define MessagePack contract structure with type mappings
  - IF CBOR: Define CBOR CDDL schemas with tags
  - IF Hybrid: Document translation between REST and gRPC, gateway layer, error mapping

  Return structured output with:
  - GraphQL SDL schema (if GraphQL)
  - MessagePack contract structure (if MessagePack)
  - CBOR CDDL schema (if CBOR)
  - Hybrid architecture mapping (if hybrid)
  ```

**Expected output from Phase 5:**
- GraphQL SDL schema (if GraphQL)
- MessagePack contract structure (if MessagePack)
- CBOR CDDL schema (if CBOR)
- Hybrid architecture mapping (if hybrid)

**IF phase5_needed = FALSE:**

Document that Phase 5 was skipped:
```
Phase 5 (Format Coverage): SKIPPED
Reason: [REST + JSON only - OpenAPI 3.1 spec sufficient]
Note: Only OpenAPI 3.1 specification needed for default REST+JSON paradigm.
```

---

### Step 9: Define Endpoint Structure and Authentication

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

**Authentication Strategy:**

Extract from `08-api-design.ctx.md`:
- Auth provider (Clerk, Auth0, custom JWT, API keys)
- Token placement (Authorization header, Cookie, Query param)
- Token lifetime (short-lived + refresh, medium, long-lived)
- Authorization patterns (user-owned, team resource, admin only, public)

---

### Step 10: Define Error Handling

**Error Response Format:**

Standardize all errors:

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

---

### Step 11: Webhook Endpoints (If Applicable)

**Decision Tree - Webhook Requirements:**

```
Does the journey require event notifications from external systems (third-party integrations)?
├─ YES → Define webhook endpoints for each provider
└─ NO → Skip webhooks
```

**If webhooks needed**, define inbound webhook endpoints for third-party integrations:

**Reference**: `/examples/integration-patterns-examples.md` Section 5 for complete webhook schema templates (Stripe, Salesforce, SendGrid, PayPal, generic HMAC patterns).

**Key Elements for Each Webhook Endpoint:**
- Request body schema (provider-specific)
- Signature verification method (X-Provider-Signature header)
- Idempotency strategy (event ID tracking)
- Response format (200 with `{received: true}`)
- Error responses (401 for invalid signature)

---

### Step 12: Synthesize Agent Outputs into API Specification

**Based on paradigm from Session 8, generate the appropriate specification:**

#### For REST APIs (JSON serialization):

Create complete **OpenAPI 3.1** specification. Use template at `/templates/08b-api-contracts-template.md` for detailed structure.

**Combine outputs from all invoked phases:**

1. **From Phase 1 (Security)**:
   - Mark all PII fields in schemas with `x-pii: true` and `x-gdpr-category`
   - Add GDPR export endpoint (if applicable)
   - Apply type mappings (NUMERIC→string, BIGINT→string, TIMESTAMP→ISO 8601, UUID→string with format)
   - Add validation rules from DB constraints (NOT NULL→required, VARCHAR→maxLength, CHECK→enum/pattern)
   - Document DoS prevention limits in API description
   - Add security warnings in components/schemas descriptions

2. **From Phase 2 (Versioning)**:
   - Document breaking change matrix in overview section
   - Apply chosen versioning strategy (URL/header/media type)
   - Mark deprecated endpoints with `deprecated: true`, `x-sunset-date`, `x-replacement-endpoint`
   - Document migration strategies in overview

3. **From Phase 3 (Performance)** - if invoked:
   - Add response size limit validation to list endpoints (max: 1000)
   - Document compression strategy in overview (Accept-Encoding support)
   - Add field selection parameter to GET endpoints (`?fields=id,name,email`)
   - Configure caching headers in responses (Cache-Control, ETag)

4. **From Phase 4 (Code Generation)**:
   - Add SDK generation commands to overview section
   - Document Session 12 integration (where generated code goes)
   - Add contract testing tool configuration
   - Include type validation script template

5. **From Phase 5 (Format Coverage)** - if invoked:
   - Include GraphQL SDL schema (if GraphQL)
   - Include MessagePack contract structure (if MessagePack)
   - Include hybrid mapping documentation (if hybrid)

**OpenAPI 3.1 Key Sections:**
- `info`: title, description (with auth/rate limit/error conventions, phase summary), version, contact
- `servers`: production, staging, local development URLs
- `tags`: group endpoints by resource type
- `paths`: each endpoint with summary, description, tags, security, parameters, requestBody, responses
- `components`: securitySchemes (bearerAuth), schemas (all data models with Phase 1 patterns), responses (reusable error responses)

#### For GraphQL APIs:

Create **GraphQL SDL schema** with types, queries, mutations, subscriptions using Phase 5 output.

#### For gRPC APIs:

Create **Protocol Buffers `.proto` files** with service definitions, message types, and field options, applying patterns from Phases 1-4.

#### For Hybrid APIs:

Generate both OpenAPI and Protobuf specs with mapping documentation using Phase 5 output.

---

### Step 13: Document API Technical Implementation

Write `product-guidelines/08b-api-contracts.md` with:

**Structure:**

1. **Overview**
   - Link to `08-api-design.md` for paradigm/serialization decisions
   - Endpoint count, resource count
   - Applied phases summary:
     - Phase 1: Security & Data Integrity (ALWAYS)
     - Phase 2: API Versioning & Evolution (ALWAYS)
     - Phase 3: Performance Optimization (if applicable - state INVOKED or SKIPPED with reason)
     - Phase 4: Code Generation & Contract Testing (ALWAYS)
     - Phase 5: Format Coverage (if applicable - state INVOKED or SKIPPED with reason)

2. **Core Resources**
   - For each resource: purpose (journey connection), endpoints table

3. **API Specification**
   - OpenAPI 3.1 spec (complete or link to `openapi.yaml`)
   - GraphQL SDL (if GraphQL - from Phase 5)
   - Protobuf schemas (if gRPC, link to `.proto` files)

4. **Phase 1: Security & Data Integrity** (output from Phase 1 agent)
   - PII fields marked in schemas
   - GDPR export endpoint (if applicable)
   - Type mappings applied (NUMERIC→string, BIGINT→string, etc.)
   - Validation rules summary
   - DoS prevention limits
   - Deserialization security warnings

5. **Phase 2: API Versioning & Evolution** (output from Phase 2 agent)
   - Breaking change matrix
   - Versioning strategy chosen
   - Deprecation timeline template
   - Migration strategies
   - Protobuf reserved fields (if gRPC)
   - OpenAPI deprecation annotations (if REST)

6. **Phase 3: Performance Optimization** (output from Phase 3 agent, if invoked)
   - Response size limits
   - Compression strategy
   - Field selection patterns
   - HTTP caching rules
   - Protobuf varint guidance (if gRPC)
   - OR: "Phase 3 SKIPPED - Reason: [simple internal tool / low traffic]"

7. **Phase 4: Code Generation & Contract Testing** (output from Phase 4 agent)
   - Client SDK generation commands (TypeScript, Python, Go, etc.)
   - Session 12 integration (where generated code goes)
   - Build scripts (npm run generate:api, make generate-api)
   - Contract testing tool configuration (Dredd/Pact/grpc-testing)
   - Type consistency validation script
   - CI/CD pipeline integration examples

8. **Phase 5: Format Coverage** (output from Phase 5 agent, if invoked)
   - GraphQL SDL schema (if GraphQL)
   - MessagePack contract structure (if MessagePack)
   - CBOR CDDL schema (if CBOR)
   - Hybrid architecture mapping (if hybrid)
   - OR: "Phase 5 SKIPPED - Reason: [REST+JSON only]"

9. **Request/Response Examples**
   - Sample payloads for key endpoints
   - Apply Phase 1 patterns (type mappings)
   - Apply Phase 2 patterns (versioning headers)

10. **Testing**
    - Example curl/httpie/grpcurl commands
    - Contract testing configuration from Phase 4

**Note**: High-level design decisions (paradigm, serialization, auth strategy, rate limiting, pagination) are in `08-api-design.md` (Session 8). This file focuses on technical implementation with all invoked phase patterns applied.

---

### Step 14: Create Context Version for Scaffold Generation

**IMPORTANT**: After writing the full contracts file, invoke the distillation sub-agent:

Use the Task tool:
- **subagent_type**: `general-purpose`
- **description**: `Create context version of API contracts`
- **prompt**:
  ```
  Invoke the distill-context sub-agent to create a token-optimized context file.

  Agent path: .claude/agents/distill-context.md

  Inputs:
  - Source file: product-guidelines/08b-api-contracts.md
  - Output file: product-guidelines/08b-api-contracts.ctx.md
  - Target reduction: 80% (API contracts are highly structured, mostly endpoint lists)

  Follow the agent specification to:

  KEEP:
  - Endpoint list with methods and paths
  - Core resource list
  - Applied phases summary (which phases invoked, which skipped)
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

**Phase 3: Performance Optimization (CONDITIONAL - check if invoked):**
- [ ] If invoked: Response size limits specified per endpoint type
- [ ] If invoked: Compression strategy documented per format
- [ ] If invoked: Field selection patterns documented
- [ ] If invoked: Caching headers specified for GET endpoints
- [ ] If skipped: Documented why (low traffic / no mobile users / simple tool)

**Phase 4: Code Generation & Contract Testing (ALWAYS REQUIRED):**
- [ ] Client SDK generation commands documented for all tech stack languages
- [ ] Session 12 integration documented (where generated code should be placed)
- [ ] Build scripts specified (package.json scripts, Makefile targets)
- [ ] Contract testing tool selection documented (Dredd/Pact/grpc-testing)
- [ ] Type consistency validation script template provided
- [ ] CI/CD pipeline integration examples provided

**Phase 5: Format Coverage (CONDITIONAL - check if invoked):**
- [ ] If GraphQL: GraphQL SDL schema generated with journey validation
- [ ] If MessagePack: MessagePack contract structure documented
- [ ] If CBOR: CBOR CDDL schema documented
- [ ] If hybrid: Mapping between formats documented
- [ ] If skipped: Documented why (REST+JSON only)

---

## Output Files

1. **`product-guidelines/08b-api-contracts.md`**: Full technical specification (endpoints, schemas, validation rules, all invoked phases, examples, testing)
2. **`product-guidelines/08b-api-contracts.ctx.md`**: Condensed version for Session 9b/10 (~80% reduction) - endpoint lists, phases summary, no detailed schemas
3. **`product-guidelines/08b-api-contracts/openapi.yaml`** (if REST): Complete OpenAPI 3.1 spec (all endpoints, schemas, security)
4. **`product-guidelines/08b-api-contracts/schema.graphql`** (if GraphQL): GraphQL SDL schema with types, queries, mutations, subscriptions
5. **`product-guidelines/08b-api-contracts/*.proto`** (if gRPC): Protocol Buffer service and message definitions

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

---

## Remember

**This is an ORCHESTRATOR that conditionally invokes phase agents via the Task tool.**

**Execution pattern:**
1. Read context files (Steps 1-2)
2. Analyze requirements to determine which phases needed (Step 2)
3. Identify core resources (Step 3)
4. **INVOKE Phase 1 agent** via Task tool (Step 4) - ALWAYS
5. **INVOKE Phase 2 agent** via Task tool (Step 5) - ALWAYS
6. **INVOKE Phase 3 agent** via Task tool (Step 6) - IF phase3_needed = TRUE
7. **INVOKE Phase 4 agent** via Task tool (Step 7) - ALWAYS
8. **INVOKE Phase 5 agent** via Task tool (Step 8) - IF phase5_needed = TRUE
9. Define endpoint structure and auth (Step 9)
10. Define error handling (Step 10)
11. Add webhook endpoints if needed (Step 11)
12. **SYNTHESIZE agent outputs** into final OpenAPI/Protobuf/GraphQL spec (Step 12)
13. Write comprehensive documentation (Step 13)
14. Invoke distill-context agent (Step 14)
15. Validate against checklist (Step 15)

**Token Efficiency Gains:**
- Simple journey (REST+JSON, low-traffic): Phases 1, 2, 4 invoked → ~37% token reduction
- Typical journey (mobile app, REST+JSON, high-traffic): Phases 1, 2, 3, 4 invoked → ~18% token reduction
- Complex journey (hybrid architecture): All phases invoked → properly architected with no token waste

**Reference files:**
- **API Design** (Session 8): `product-guidelines/08-api-design.ctx.md` - **READ THIS FIRST**
- Journey: `product-guidelines/00-user-journey.ctx.md`
- Tech stack: `product-guidelines/02-tech-stack.ctx.md`
- Architecture: `product-guidelines/04-architecture.ctx.md`
- Database schema: `product-guidelines/07-database-schema.ctx.md`
- Constraints: `product-guidelines/02a-constraints.ctx.md` (if exists)

**Phase agents** (invoked via Task tool):
- **Phase 1**: `.claude/agents/api-contracts-phase1-security.md` (always invoke)
- **Phase 2**: `.claude/agents/api-contracts-phase2-versioning.md` (always invoke)
- **Phase 3**: `.claude/agents/api-contracts-phase3-performance.md` (conditional: mobile/high-volume/large-payloads)
- **Phase 4**: `.claude/agents/api-contracts-phase4-codegen.md` (always invoke)
- **Phase 5**: `.claude/agents/api-contracts-phase5-formats.md` (conditional: GraphQL/MessagePack/CBOR/hybrid)

---

**Now, read API design decisions (Session 8), analyze requirements, conditionally invoke phase agents via Task tool, and synthesize outputs into technical API contracts!**
