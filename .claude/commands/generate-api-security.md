---
description: Phase 8.2 - Design OWASP API security patterns and input validation (micro-session 2 of 4)
---

# Generate API Security (Phase 8.2)

You are an API security specialist. This is the SECOND micro-session of Session 8, where you design OWASP API Top 10 2023 protection patterns and input validation strategies with minimal context usage.

## Your Role

Design comprehensive security patterns based on journey requirements and the paradigm selected in Phase 8.1. You will use minimal context (~10k tokens) to preserve capacity for later micro-sessions.

## Critical Philosophy

- **Journey-Driven Security**: Protection patterns must address specific journey risks
- **OWASP API Top 10 2023**: Apply the 7 applicable risks systematically
- **Paradigm-Aware**: Security patterns adapt to REST/GraphQL/gRPC paradigm
- **State Continuation**: Update state tracking from Phase 8.1

## Steps to Execute

### Step 1: Read Session State and Minimal Context

Read state and context files (targeting ~10k tokens total):

1. `product-guidelines/session-8.state` - Get paradigm decision from Phase 8.1
2. `product-guidelines/08a-api-paradigm.md` - Paradigm and serialization choices
3. `product-guidelines/00-user-journey.ctx.md` - For security touchpoints
4. `product-guidelines/07-database-schema.ctx.md` - For data relationships

Skip architecture and other files to preserve context capacity.

### Step 2: Analyze OWASP API Top 10 2023 Risks

Evaluate the 7 applicable risks from OWASP API Top 10 2023:

#### 2.1: API1 - Broken Object Level Authorization (BOLA)
**Journey Analysis**: Which journey steps access user-owned resources?
**Risk Pattern**: Users accessing other users' data
**Protection Strategy**:
- Resource ownership validation
- User context verification
- Team/organization boundaries
- Example: "User in Step 3 uploads document → BOLA protection via user_id ownership check"

#### 2.2: API2 - Broken Authentication
**Journey Analysis**: How do users authenticate in the journey?
**Risk Pattern**: Weak authentication mechanisms
**Protection Strategy**:
- Strong password requirements (if applicable)
- MFA enforcement for sensitive operations
- Session management
- Token rotation
- Example: "Journey requires financial operations → MFA on payment endpoints"

#### 2.3: API3 - Broken Object Property Level Authorization
**Journey Analysis**: Which fields contain sensitive data?
**Risk Pattern**: Exposing sensitive fields inappropriately
**Protection Strategy**:
- Field-level permissions
- Response filtering by user role
- Sensitive field masking
- Example: "PII in user profiles → Property filtering based on viewer relationship"

#### 2.4: API5 - Broken Function Level Authorization (BFLA)
**Journey Analysis**: What admin/privileged operations exist?
**Risk Pattern**: Regular users accessing admin functions
**Protection Strategy**:
- Role-based access control
- Function-level authorization checks
- Admin endpoint isolation
- Example: "Journey has admin review step → BFLA protection on review endpoints"

#### 2.5: API8 - Security Misconfiguration
**Journey Analysis**: What are the deployment and configuration risks?
**Risk Pattern**: Insecure defaults, verbose errors, missing security headers
**Protection Strategy**:
- Security headers (HSTS, CSP, X-Frame-Options)
- Error message sanitization
- CORS configuration
- Environment-specific configs
- Example: "Production deployment → Strict CORS, sanitized errors"

#### 2.6: API9 - Improper Inventory Management
**Journey Analysis**: How will API versions evolve?
**Risk Pattern**: Deprecated endpoints, undocumented APIs
**Protection Strategy**:
- API versioning strategy
- Deprecation policy
- Documentation requirements
- Endpoint inventory
- Example: "Journey evolves quarterly → Versioning via URL path (/v1/, /v2/)"

#### 2.7: API10 - Unsafe Consumption of Third-Party APIs
**Journey Analysis**: Which third-party services are integrated?
**Risk Pattern**: Trusting external API responses
**Protection Strategy**:
- Input validation on third-party responses
- Schema validation
- Rate limiting on external calls
- Timeout configuration
- Example: "Payment provider integration → Validate webhook signatures"

### Step 3: Design Input Validation Strategy

Based on paradigm from Phase 8.1:

#### 3.1: Select Validation Approach
**REST**: Schema validation (JSON Schema, OpenAPI)
**GraphQL**: Type system validation, query depth limiting
**gRPC**: Protobuf validation, field requirements

#### 3.2: Define Validation Rules by Type

Common input types and validation:
```
Email: RFC 5322 compliant, domain verification
URL: Protocol whitelist, domain validation
Phone: E.164 format, country code validation
Date: ISO 8601, range validation
File uploads: Type whitelist, size limits, virus scanning
Text: Length limits, XSS sanitization
Numbers: Range validation, precision limits
```

#### 3.3: Sanitization Strategy
- HTML sanitization for user content
- SQL injection prevention (parameterized queries)
- Command injection prevention
- Path traversal prevention
- Example: "User submits markdown → Sanitize HTML, prevent XSS"

### Step 4: Write API Security Design

Write `product-guidelines/08b-api-security.md`:

```markdown
# API Security Design (Phase 8.2)

Generated: [timestamp]
Phase: 8.2 of 8 (API Design micro-sessions)
Paradigm: [from Phase 8.1]

## OWASP API Top 10 2023 Protection Patterns

### API1: Broken Object Level Authorization (BOLA)
**Journey Risk**: [Specific journey step where users access resources]
**Protection Pattern**:
- [Ownership validation strategy]
- [Implementation approach for paradigm]
**Example**: [Concrete example from journey]

### API2: Broken Authentication
**Journey Risk**: [Authentication points in journey]
**Protection Pattern**:
- [Authentication strategy from tech stack]
- [Session management approach]
- [MFA requirements if applicable]
**Example**: [Concrete example from journey]

### API3: Broken Object Property Level Authorization
**Journey Risk**: [Sensitive fields in database schema]
**Protection Pattern**:
- [Field filtering strategy]
- [Role-based property access]
**Example**: [Concrete example from journey]

### API5: Broken Function Level Authorization (BFLA)
**Journey Risk**: [Admin operations in journey]
**Protection Pattern**:
- [Role hierarchy]
- [Function-level checks]
**Example**: [Concrete example from journey]

### API8: Security Misconfiguration
**Configuration Requirements**:
- Security Headers: [List required headers]
- Error Handling: [Sanitization approach]
- CORS Policy: [Configuration based on clients]
**Example**: [Concrete configuration]

### API9: Improper Inventory Management
**API Lifecycle Strategy**:
- Versioning: [Strategy from journey evolution]
- Deprecation: [Policy and timeline]
- Documentation: [Requirements]
**Example**: [Version migration scenario]

### API10: Unsafe Third-Party Consumption
**Third-Party APIs**: [List from architecture]
**Protection Pattern**:
- [Validation on responses]
- [Timeout and retry strategy]
- [Signature verification if webhooks]
**Example**: [Concrete integration scenario]

## Input Validation Strategy

### Validation Library Selection
**Paradigm**: [REST/GraphQL/gRPC]
**Library**: [Based on tech stack]
**Approach**: [Schema-based, type-based, etc.]

### Validation Rules by Input Type

| Input Type | Validation Rule | Sanitization | Example |
|------------|----------------|--------------|---------|
| Email | RFC 5322, domain check | Lowercase, trim | user@example.com |
| URL | Protocol whitelist | Remove tracking params | https://example.com |
| Phone | E.164 format | Remove non-digits | +1234567890 |
| Date | ISO 8601 | Timezone normalization | 2024-01-15T10:30:00Z |
| File Upload | Type: [allowed], Size: [limit] | Virus scan | .pdf, .jpg, max 10MB |
| Text | Max length: [limit] | XSS prevention | HTML escape |
| Number | Range: [min-max] | Type coercion | 1-1000000 |

### Sanitization Strategy

**HTML Content**: [Library and approach]
**SQL Injection**: [Prevention method]
**Command Injection**: [Prevention method]
**Path Traversal**: [Prevention method]

### Security Headers (All Responses)

```http
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
Content-Security-Policy: default-src 'self'
X-Request-ID: [request tracking]
```

## Paradigm-Specific Security

[Based on paradigm from 8a, include specific patterns:]

**If REST**:
- CSRF protection strategy
- API key management
- Rate limiting headers

**If GraphQL**:
- Query depth limiting
- Query complexity analysis
- Introspection disable in production

**If gRPC**:
- TLS/mTLS configuration
- Certificate pinning
- Binary protocol security

## Next Steps
- Phase 8.3 will add performance patterns (caching, idempotency, etc.)
- Phase 8.4 will synthesize into complete API design
```

### Step 5: Update State Tracking

Update `product-guidelines/session-8.state`:

```json
{
  ...existing state...,
  "phases": {
    "8a": {...existing...},
    "8b": {
      "name": "API Security Design",
      "complete": true,
      "timestamp": "[timestamp]",
      "owaspRisksIdentified": 7,
      "validationStrategy": "[approach]"
    },
    ...other phases...
  },
  "status": "ready_for_performance",
  "last_updated": "[timestamp]"
}
```

### Step 6: Provide User Instructions

Output completion message with security summary.

## Success Criteria

- [ ] Uses <10k tokens of context
- [ ] All 7 OWASP risks evaluated with journey citations
- [ ] Input validation strategy matches paradigm
- [ ] Security headers documented
- [ ] State file updated
- [ ] Ready for performance patterns in Phase 8.3

## Output Format

The command should create/update:
1. `product-guidelines/08b-api-security.md` - Security patterns with journey traceability
2. `product-guidelines/session-8.state` - Updated state tracking

Then output:
```
✅ Phase 8.2 Complete: API Security Designed

OWASP API Top 10 Coverage:
- BOLA: [Protection approach]
- Authentication: [Strategy]
- Property Authorization: [Field filtering]
- Function Authorization: [Role-based]
- Security Config: [Headers defined]
- Inventory: [Versioning strategy]
- Third-Party: [Validation approach]

Input Validation:
- Library: [Selected library]
- Rules defined for [N] input types
- Sanitization strategy documented

Next: Phase 8.3 will add performance patterns based on requirements.
Run `/generate-api-design` to continue the API design process.
```

## Remember

**Security patterns must address specific journey risks.**

Generic security is insufficient. Every protection must trace to:
1. Which journey step creates the risk?
2. What data relationships need protection?
3. Which user roles exist in the journey?
4. What third-party integrations introduce risk?

If you can't trace a security pattern to a journey risk, it may be over-engineering.