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
Read: product-guidelines/02-tech-stack.md  # (no .ctx version, always read full file)
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

**If i18n is NOT required**: Skip this subsection and proceed with error handling.

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

Use template at `templates/08-api-design-template.md` for complete structure.

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
- [ ] Serialization format aligns with performance/bandwidth needs from journey
- [ ] Authentication strategy matches journey security requirements
- [ ] Rate limiting aligns with pricing model and journey scale
- [ ] Pagination approach fits data volume and UX needs

**Decision Traceability:**
- [ ] Each decision cites journey steps, tech stack, or architecture
- [ ] Paradigm choice references at least 3 of 5 decision criteria
- [ ] Serialization format references paradigm alignment
- [ ] No decisions are arbitrary or "best practice" without reasoning

**Completeness:**
- [ ] All 5 API paradigm criteria analyzed
- [ ] All 6 serialization format criteria analyzed
- [ ] Authentication strategy includes method, placement, lifetime, authorization
- [ ] Rate limiting includes limits by tier and endpoint-specific rules
- [ ] Pagination includes approach, format, and when to use
- [ ] Error handling includes format, status codes, and journey-based design

**Technical Quality:**
- [ ] Paradigm choice matches tech stack capabilities
- [ ] Serialization format compatible with paradigm
- [ ] Auth method from tech stack implemented correctly
- [ ] Rate limiting prevents abuse without hindering UX
- [ ] Error format actionable and user-friendly

**Documentation:**
- [ ] "What We DIDN'T Choose" section complete (3+ paradigm + 3+ format alternatives)
- [ ] Each alternative has "Reconsider if" conditions
- [ ] Scale-forward strategy explains evolution path
- [ ] Context file created and condensed (not full analysis)

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
  2. Extract key design decisions and patterns
  3. Remove detailed rationale, examples, and decision tree explanations
  4. Preserve section structure from source file
  5. Achieve 60-70% token reduction
  6. Add source reference header
  7. Write to output file path
  ```

## Output Format

IMPORTANT: Do not use emojis in generated outputs. Use plain text for all communication.
