---
description: Session 8 - High-level API architectural decisions (paradigm, serialization, auth, rate limiting)
---

# Generate API Design (Session 8)

You are helping the user make high-level API architectural decisions including API paradigm choice (REST, GraphQL, gRPC, WebSocket, hybrid), serialization format (JSON, Protobuf, MessagePack), authentication strategy, rate limiting, pagination, security patterns, and error handling philosophy. This happens after defining the database schema (Session 7) and BEFORE generating technical API contracts (Session 8b).

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

Make high-level API architectural decisions through a systematic, sub-agent-driven process:
1. **API Paradigm Selection** - REST, GraphQL, gRPC, WebSocket, or hybrid
2. **OWASP Security Patterns** - BOLA, property-level auth, BFLA, business flows, SSRF, misconfiguration, third-party API consumption
3. **Input Validation** - Validation library, rules by type, sanitization
4. **HTTP Caching** (conditional) - Cache-Control, ETag, compression (REST/HTTP only)
5. **Idempotency & Retry** (conditional) - Idempotency-Key, Retry-After, circuit breakers
6. **i18n Headers** (conditional) - Accept-Language, locale fallback (if constraints require i18n)
7. **REST Design Patterns** (conditional) - Resource naming, HTTP verbs, query params (REST only)
8. **Authentication, Rate Limiting, Pagination, Error Handling** - Core patterns

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

**Optional inputs (if exist):**
```
Read: product-guidelines/02a-constraints.ctx.md  # (for i18n requirement check)
```

**Extract key information:**
- Journey: User actions requiring APIs, latency requirements, real-time needs, bandwidth constraints, scale
- Tech Stack: Backend framework, auth method, validation library, API style preference
- Architecture: Monolith vs microservices, third-party integrations, security requirements, multi-tenancy
- Database Schema: Entities, relationships, query patterns
- Constraints (if exists): i18n requirement

---

### Step 2: Invoke API Paradigm Selection Sub-Agent

Use Task tool to invoke `.claude/agents/select-api-paradigm.md`:

**Inputs to provide**:
- Journey context (from Step 1)
- Tech stack (from Step 1)
- Architecture (from Step 1)
- Database schema (from Step 1)

**Expected output**:
- Chosen paradigm (REST / GraphQL / gRPC / WebSocket / Hybrid)
- Journey-based analysis (5 decision tree criteria)
- Serialization format recommendation aligned with paradigm
- Scale-forward strategy

**Store result** in variable for use in conditional steps.

---

### Step 3: Invoke Core Security and Validation Sub-Agents (Always Execute)

These sub-agents ALWAYS execute regardless of paradigm or journey characteristics.

#### Step 3.1: OWASP Security Patterns

Use Task tool to invoke `.claude/agents/design-owasp-security-patterns.md`:

**Inputs to provide**:
- Journey context (from Step 1)
- Database schema (from Step 1)
- Architecture (from Step 1)

**Expected output**:
- Analysis of 7 applicable OWASP API Top 10 2023 risks
- Protection patterns for applicable risks (BOLA, Property-Level Auth, BFLA, Business Flows, SSRF, Security Misconfiguration, Unsafe Third-Party Consumption)
- Journey-based security reasoning

#### Step 3.2: Input Validation Strategy

Use Task tool to invoke `.claude/agents/design-input-validation.md`:

**Inputs to provide**:
- API paradigm (from Step 2)
- Tech stack (from Step 1)
- Journey context (from Step 1)
- Database schema (from Step 1)

**Expected output**:
- Validation library selection (matches tech stack)
- Validation rules by input type (email, URL, phone, date, file uploads, etc.)
- Sanitization strategy (HTML, SQL, command injection, path traversal)

---

### Step 4: Invoke Conditional Sub-Agents Based on Requirements

Analyze requirements and invoke applicable sub-agents:

#### Step 4.1: HTTP Caching Strategy (Conditional)

**Condition**: API paradigm from Step 2 is REST or HTTP-based
**Skip if**: GraphQL, gRPC, or WebSocket chosen

Use Task tool to invoke `.claude/agents/design-http-caching.md`:

**Inputs to provide**:
- API paradigm (from Step 2)
- Journey context (from Step 1)
- Database schema (from Step 1)
- Architecture (from Step 1)

**Expected output**:
- Cache-Control directives by resource type (public/private/sensitive/dynamic)
- ETag implementation strategy
- Compression configuration (Brotli/gzip)
- Performance metrics for Session 14

#### Step 4.2: Idempotency and Retry Strategy (Conditional)

**Condition**: Journey has financial operations OR expected traffic is "high" (from architecture)
**Skip if**: Read-only API with no financial/critical operations

Use Task tool to invoke `.claude/agents/design-idempotency-retry.md`:

**Inputs to provide**:
- Journey context (from Step 1)
- Architecture (from Step 1)
- Database schema (from Step 1)

**Expected output**:
- Idempotency-protected endpoints (financial operations, resource creation)
- Retry strategy (Retry-After headers for 429/503/202)
- Implementation requirements (idempotency store, key format, expiry)

#### Step 4.3: Circuit Breaker Configuration (Conditional)

**Condition**: Architecture (Session 4) lists third-party APIs with length > 0
**Skip if**: No third-party API dependencies

Use Task tool to invoke `.claude/agents/design-circuit-breakers.md`:

**Inputs to provide**:
- Journey context (from Step 1)
- Architecture (from Step 1)

**Expected output**:
- Circuit breaker config per third-party API (timeout, failure threshold, fallback)
- Observability metrics for Session 14

#### Step 4.4: Internationalization Headers (Conditional)

**Condition**: Session 2a constraints mark i18n as required
**Skip if**: No constraints file OR i18n not marked as required

Use Task tool to invoke `.claude/agents/design-i18n-headers.md`:

**Inputs to provide**:
- Constraints (from Step 1)
- Journey context (from Step 1)
- Database schema (from Step 1)

**Expected output**:
- Locale detection strategy (query param, Accept-Language header, user preference, default)
- Locale fallback chain
- Localized error messages
- Content-Language response headers

---

### Step 5: Define REST Design Patterns (Conditional)

**ONLY execute if API paradigm from Step 2 is REST.**

If paradigm is GraphQL, gRPC, or WebSocket, skip this step.

Document RESTful API design conventions:

#### 5.1: Resource Naming Conventions
- Collections: Plural nouns (/users, /orders, /documents)
- Single resource: /{collection}/{id} (/users/123, /orders/456)
- Nested resources: /{parent}/{id}/{child} (/teams/5/members)
- Actions: Use HTTP verbs, not verbs in URLs

**Journey context**: Which entities from Session 7 need API exposure? Which journey steps access resources?

#### 5.2: HTTP Verb Usage and Idempotency Semantics
- GET: Retrieve (idempotent, safe, cacheable)
- POST: Create (NOT idempotent without Idempotency-Key)
- PUT: Replace entire resource (idempotent)
- PATCH: Partial update (idempotent with key)
- DELETE: Remove resource (idempotent)

**Journey context**: Which journey steps create/update/delete resources?

#### 5.3: Query Parameter Standards
- Filtering: ?status=active&role=admin
- Sorting: ?sort=-created_at,name
- Field Selection: ?fields=id,name,email
- Search: ?q=search+term

**Journey context**: Which journey steps filter/sort/search data?

#### 5.4: Response Envelope Consistency
- Single resource: Return object directly {id: 123, name: "..."}
- Collection: Return array with metadata {data: [...], pagination: {...}}
- Errors: Standard format {error: {code, message, details}}

**Journey reasoning**: Consistency simplifies client-side parsing across journey steps.

---

### Step 6: Define Core API Patterns

Document authentication, rate limiting, pagination, and error handling:

#### 6.1: Authentication Strategy

From tech stack (Session 3):
- **Method**: JWT / OAuth / API Keys / Clerk / Auth0
- **Token Placement**: Header (Authorization: Bearer) / Cookie / Query
- **Token Lifetime**: Duration, refresh strategy
- **Authorization Patterns**: User-owned resources, team resources, admin-only, public

**Journey context**: Which journey steps require auth? What user roles exist?

#### 6.2: Rate Limiting Strategy

From product strategy pricing model:
- **Limits by Tier**: Free (10-100 req/min), Pro (100-1000 req/min), Enterprise (custom/unlimited)
- **Limiting Approach**: Per user / Per team / Per IP, Sliding window
- **Endpoint-Specific Limits**: Expensive ops (stricter), read ops (standard), public (strictest)
- **Headers**: X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset

**Journey context**: Pricing model, expected scale, cost structure.

#### 6.3: Pagination Strategy

From database schema data volume:
- **Cursor pagination**: For >1K records, frequently changing data, next/previous only
- **Offset pagination**: For <1K records, simple CRUD, random page access needed
- **Format**: Cursor (?cursor=abc&limit=20), Offset (?page=1&limit=20)

**Journey context**: Data volume, UX needs, database query patterns.

#### 6.4: Error Handling Philosophy

**Standard Error Format**:
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error",
    "details": {},
    "field": "fieldName",
    "request_id": "req_abc123"
  }
}
```

**Security Headers (Required on ALL Responses)**:
```http
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
Content-Security-Policy: default-src 'self'
X-Request-ID: req_abc123
```

**HTTP Status Codes**:
- Success: 200 OK, 201 Created, 202 Accepted, 204 No Content
- Client Errors: 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 409 Conflict, 422 Unprocessable Entity, 429 Too Many Requests
- Server Errors: 500 Internal Server Error, 502 Bad Gateway, 503 Service Unavailable, 504 Gateway Timeout

**Journey context**: Which errors do users need to recover from? What journey steps have error scenarios?

---

### Step 7: Synthesize and Write Output

Use template at `/templates/08-api-design-template.md` for complete structure.

Write `product-guidelines/08-api-design.md` with:
- **Overview**: API paradigm, serialization format, versioning strategy
- **API Paradigm Decision**: Output from Step 2 sub-agent
- **REST Design Patterns** (if paradigm=REST): Resource naming, HTTP verbs, query params (from Step 5)
- **Serialization Format Decision**: From Step 2 sub-agent
- **Authentication Strategy**: From Step 6.1
- **Security Protection Patterns (OWASP API Top 10)**: Output from Step 3.1 sub-agent
- **Input Validation Strategy**: Output from Step 3.2 sub-agent
- **HTTP Caching Strategy** (if REST/HTTP): Output from Step 4.1 sub-agent (conditional)
- **Idempotency and Retry Strategies** (if applicable): Output from Step 4.2 sub-agent (conditional)
- **Circuit Breaker Configuration** (if third-party APIs exist): Output from Step 4.3 sub-agent (conditional)
- **Internationalization Support** (if i18n required): Output from Step 4.4 sub-agent (conditional)
- **Rate Limiting Strategy**: From Step 6.2
- **Pagination Strategy**: From Step 6.3
- **Error Handling Philosophy**: From Step 6.4
- **Scale-Forward Strategy**: How decisions evolve as product grows
- **"What We DIDN'T Choose"**: At least 3 paradigm alternatives + 3 serialization alternatives with reasoning

---

### Step 8: Create Context Version

After writing the full API design, invoke the distillation sub-agent:

Use Task tool with `subagent_type: general-purpose`:

**Prompt**:
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

---

## Quality Checklist

Before completing this session, verify:

**Journey Alignment:**
- [ ] API paradigm decision traces to specific journey steps
- [ ] Security patterns reference specific journey steps and database tables
- [ ] Input validation traces to journey input scenarios
- [ ] Caching strategy (if REST) aligns with journey bandwidth/performance needs
- [ ] Idempotency protection (if applicable) covers financial operations

**Decision Traceability:**
- [ ] Each decision cites journey steps, tech stack, or architecture
- [ ] Paradigm choice references at least 3 of 5 decision criteria
- [ ] OWASP patterns cite journey steps or database schema (Session 7)
- [ ] No arbitrary decisions without journey-based reasoning

**Completeness:**
- [ ] All 5 API paradigm criteria analyzed
- [ ] OWASP API Top 10 protection patterns documented for applicable risks
- [ ] Input validation includes paradigm-specific approach and sanitization
- [ ] Security headers documented (HSTS, X-Content-Type-Options, X-Frame-Options, CSP)
- [ ] REST design patterns documented (if paradigm = REST)
- [ ] HTTP caching strategy documented (if REST/HTTP-based paradigm)

**Sub-Agent Execution:**
- [ ] API paradigm sub-agent executed (always)
- [ ] OWASP security sub-agent executed (always)
- [ ] Input validation sub-agent executed (always)
- [ ] HTTP caching sub-agent executed (if REST/HTTP)
- [ ] Idempotency/retry sub-agent executed (if financial ops or high traffic)
- [ ] Circuit breaker sub-agent executed (if third-party APIs exist)
- [ ] i18n headers sub-agent executed (if Session 2a requires i18n)

**Context File:**
- [ ] Context file created at `08-api-design.ctx.md`
- [ ] Includes all decisions with brief reasoning
- [ ] Preserves OWASP security patterns for Session 10

---

## After This Session

**Next steps**:
- Run `/generate-api-contracts` (Session 8b) to create technical implementation (OpenAPI spec, schemas, endpoints)
- Session 8b will read `08-api-design.md` to implement paradigm and security decisions

---

## Remember

**Every API decision must serve the user journey.**

Don't choose paradigms because they're "modern". Design based on:
1. What journey steps require APIs? → Paradigm
2. What are the latency/bandwidth requirements? → Serialization
3. What security does the journey need? → OWASP patterns, input validation
4. What scale does the journey reach? → Rate limiting, caching
5. What data volume do users see? → Pagination

If you can't trace a decision back to a journey step, tech stack choice, or architecture requirement, reconsider.

---

**Now, execute the systematic sub-agent orchestration to make API design decisions that serve your users' journey!**
