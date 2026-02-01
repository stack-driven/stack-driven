# OWASP API Security Top 10 2023 - Reference Checklist

> **Purpose**: Educational reference for the OWASP API Security Top 10 2023 risks. This guide provides detailed threat descriptions, real-world examples, mitigation patterns, and journey-based analysis questions for Session 8 (API Design).

**Reference**: https://owasp.org/API-Security/editions/2023/en/0x11-t10/

---

## Overview

The OWASP API Security Top 10 2023 identifies the most critical security risks to APIs based on real-world vulnerability data. Unlike the OWASP Top 10 for web applications, this list focuses specifically on API attack vectors and architectural vulnerabilities.

**Key Changes from 2019**:
- **API6:2023** - Unrestricted Access to Sensitive Business Flows (NEW)
- **API8:2023** - Security Misconfiguration (expanded scope)
- **API10:2023** - Unsafe Consumption of APIs (NEW)

**Coverage in Stack-Driven**:
- Session 8 (API Design) addresses 8 of 10 risks
- Session 7 (Database Schema) addresses BOLA through ownership columns
- Session 9 (Test Strategy) addresses security testing

---

## API1:2023 - Broken Object Level Authorization (BOLA)

### Threat Description

**Severity**: Critical

**What**: APIs that fail to validate object-level permissions allow attackers to access resources they don't own by manipulating object IDs in requests.

**Attack Vector**:
```http
# Attacker is user_id = 123
GET /api/documents/456  # Document belongs to user_id = 789

# Vulnerable API:
SELECT * FROM documents WHERE id = 456  # No ownership check!

# Result: Attacker sees other user's document
```

**Common Vulnerability Pattern**:
- Relying on client-side enforcement (hiding UI elements)
- Using predictable IDs (sequential integers: 1, 2, 3...)
- Checking authentication but not authorization

### Real-World Example

**GitHub 2020**: Private repository visibility bug allowed users to view private repos of other organizations by changing repo ID in API calls.

### Mitigation Pattern

**Always validate resource ownership**:

```python
# Correct pattern
def get_document(document_id, current_user_id):
    document = db.query(
        "SELECT * FROM documents WHERE id = ? AND user_id = ?",
        document_id,
        current_user_id  # Ownership check
    )
    if not document:
        return 404  # Not found (don't reveal existence)
    return document
```

**Defense in Depth**:
1. **Database query**: Include ownership check (`WHERE user_id = :current_user_id`)
2. **ORM/Query builder**: Use scoped queries (e.g., `current_user.documents.find(id)`)
3. **Authorization layer**: Implement policy-based access control (e.g., Pundit, Casbin)
4. **UUIDs**: Use unpredictable IDs (UUIDv4, UUIDv7) instead of sequential integers

### Journey-Based Analysis Questions

- **Which database tables have user ownership?** (from Session 7 schema)
- **Which journey steps involve accessing owned resources?** (documents, reports, invoices, orders)
- **Are there team-owned resources?** (check `team_id` instead of `user_id`)
- **Are there public resources?** (shareable links with tokens)

### Implementation Checklist

- [ ] All user-owned resources have ownership check in query
- [ ] 404 returned for both "not found" and "not authorized" (don't leak existence)
- [ ] UUIDs used instead of sequential IDs (if applicable)
- [ ] Authorization tests written (user A cannot access user B's resources)

---

## API3:2023 - Broken Object Property Level Authorization

### Threat Description

**Severity**: High

**What**: APIs that return sensitive object properties (PII, SSN, payment info) to unauthorized users, or allow unauthorized modification of sensitive fields.

**Attack Vector**:
```http
# Regular user requests their profile
GET /api/users/123

# Vulnerable API returns ALL fields:
{
  "id": 123,
  "email": "user@example.com",
  "ssn": "123-45-6789",        # Should be admin-only!
  "payment_token": "tok_xxx",   # Should be hidden!
  "internal_notes": "Flagged"   # Should be admin-only!
}
```

**Common Vulnerability Pattern**:
- Returning entire database row without field filtering
- Using same serializer/DTO for admin and user responses
- Allowing mass assignment (updating sensitive fields via API)

### Real-World Example

**Peloton 2021**: API exposed private user data (age, weight, workout history) for all users, including celebrities and government officials.

### Mitigation Pattern

**Field-level authorization**:

```python
# Role-based serializers
class UserSerializer:
    def serialize(self, user, current_user_role):
        base_fields = ["id", "email", "name"]

        if current_user_role == "admin":
            return {**base_fields, "ssn", "payment_info", "internal_notes"}
        elif current_user_role == "user":
            return base_fields  # Limited fields only
        else:
            return ["id", "name"]  # Public profile
```

**Prevent mass assignment**:
```python
# Allowlist editable fields per role
EDITABLE_FIELDS = {
    "user": ["name", "email", "preferences"],
    "admin": ["name", "email", "preferences", "role", "status"]
}

def update_user(user_id, data, current_user_role):
    allowed_fields = EDITABLE_FIELDS[current_user_role]
    filtered_data = {k: v for k, v in data.items() if k in allowed_fields}
    # Update only allowed fields
```

### Journey-Based Analysis Questions

- **Which database fields are sensitive?** (from Session 7 schema: PII, payment, health, internal)
- **What user roles exist?** (admin, user, owner, public)
- **Which fields should admins see?** (compliance, debugging)
- **Which fields can users edit?** (prevent privilege escalation)

### Implementation Checklist

- [ ] Separate serializers/DTOs for admin vs user vs public
- [ ] Sensitive fields documented (PII, payment, internal notes)
- [ ] Mass assignment protection (allowlist editable fields)
- [ ] Tests for field-level access control

---

## API5:2023 - Broken Function Level Authorization (BFLA)

### Threat Description

**Severity**: High

**What**: APIs that fail to enforce function-level permissions allow regular users to access admin/owner-only endpoints.

**Attack Vector**:
```http
# Regular user tries admin endpoint
DELETE /api/users/456  # Should be admin-only!

# Vulnerable API:
if authenticated:  # Only checks authentication, not role!
    delete_user(456)
    return 204
```

**Common Vulnerability Pattern**:
- Checking authentication but not authorization
- Relying on client-side role hiding (UI doesn't show admin buttons)
- Inconsistent role checks across endpoints

### Real-World Example

**USPS 2018**: Informed Visibility API allowed any authenticated user to access admin-only search functionality, exposing 60 million users' account data.

### Mitigation Pattern

**Enforce role-based access control**:

```python
# Decorator/middleware pattern
@require_role("admin")
def delete_user(user_id):
    db.delete("users", user_id)
    return 204

# Policy-based authorization
def delete_team(team_id, current_user):
    team = db.get_team(team_id)

    # Check ownership or admin
    if current_user.id != team.owner_id and current_user.role != "admin":
        return 403  # Forbidden

    db.delete_team(team_id)
    return 204
```

### Journey-Based Analysis Questions

- **Which endpoints are admin-only?** (user management, settings, reports)
- **Which endpoints require ownership?** (delete team, transfer billing)
- **Which endpoints are public?** (no authentication required)
- **Are there hierarchical roles?** (owner > admin > member)

### Implementation Checklist

- [ ] All admin endpoints have role check
- [ ] Owner-only endpoints check resource ownership
- [ ] Consistent authorization middleware/decorators
- [ ] Tests for unauthorized access (403 Forbidden)

---

## API6:2023 - Unrestricted Access to Sensitive Business Flows

### Threat Description

**Severity**: Medium to High

**What**: APIs that don't implement business logic rate limiting allow abuse of sensitive workflows (password resets, order creation, invitations, refunds).

**Attack Vector**:
```http
# Attacker enumerates valid email addresses
POST /api/auth/password-reset
{"email": "victim1@example.com"}  # 200 OK
{"email": "victim2@example.com"}  # 200 OK
# ... 10,000 requests to enumerate users

# Attacker creates fraudulent orders
POST /api/orders
{"product_id": 123, "quantity": 1000}  # Repeat 50 times
```

**Common Vulnerability Pattern**:
- Only global API rate limits (e.g., 1000 req/min)
- No flow-specific limits (password reset, orders, invitations)
- No CAPTCHA or proof-of-work for sensitive flows

### Real-World Example

**Coupon abuse**: E-commerce APIs without order rate limiting allowed attackers to place 1000+ orders to exploit single-use coupon codes.

### Mitigation Pattern

**Business logic rate limiting**:

```python
# Separate limits for sensitive flows
BUSINESS_FLOW_LIMITS = {
    "password_reset": (3, "1 hour", "per email"),
    "order_creation": (10, "1 day", "per user"),
    "team_invitation": (50, "1 day", "per team"),
    "refund_request": (5, "1 day", "per user")
}

@rate_limit("password_reset", key=lambda req: req.data["email"])
def reset_password(email):
    # Limit: 3 attempts per email per hour
    send_reset_email(email)
    return 200  # Always return 200 (don't leak existence)
```

**Additional protections**:
- CAPTCHA for password reset (prevent automation)
- Email confirmation for high-value actions (orders, refunds)
- Account lockout after N failed attempts

### Journey-Based Analysis Questions

- **Which flows are sensitive?** (password reset, orders, payments, invitations, refunds)
- **What abuse scenarios exist?** (enumeration, fraud, spam)
- **What's the legitimate usage pattern?** (1 password reset/month, 5 orders/week)
- **Which flows need CAPTCHA?** (account creation, password reset)

### Implementation Checklist

- [ ] Business flow rate limits separate from API limits
- [ ] Sensitive flows documented (password reset, orders, invitations)
- [ ] Rate limits based on legitimate usage patterns
- [ ] CAPTCHA or proof-of-work for high-risk flows

---

## API7:2023 - Server-Side Request Forgery (SSRF)

### Threat Description

**Severity**: Medium to Critical

**What**: APIs that accept user-provided URLs (webhooks, file imports) can be exploited to access internal services or perform port scanning.

**Attack Vector**:
```http
# Attacker provides internal URL
POST /api/webhooks
{"url": "http://169.254.169.254/latest/meta-data/"}  # AWS metadata service!

# Vulnerable API fetches without validation:
response = requests.get(user_provided_url)
# Result: Attacker retrieves AWS credentials from metadata service
```

**Common Vulnerability Pattern**:
- Accepting arbitrary URLs without validation
- Not blocking internal IP ranges (127.0.0.1, 10.0.0.0/8, 192.168.0.0/16)
- Following redirects (URL validates, then redirects to internal service)

### Real-World Example

**Capital One 2019**: SSRF vulnerability in web application firewall allowed attacker to access AWS metadata service and retrieve IAM credentials, exposing 100 million customer records.

### Mitigation Pattern

**URL validation and allowlisting**:

```python
import ipaddress
import urllib.parse

BLOCKED_IP_RANGES = [
    "127.0.0.0/8",      # Localhost
    "10.0.0.0/8",       # Private network
    "172.16.0.0/12",    # Private network
    "192.168.0.0/16",   # Private network
    "169.254.0.0/16",   # Link-local (AWS metadata)
]

def validate_webhook_url(url):
    # Require HTTPS
    parsed = urllib.parse.urlparse(url)
    if parsed.scheme != "https":
        raise ValidationError("HTTPS required")

    # Resolve hostname to IP
    ip = socket.gethostbyname(parsed.hostname)

    # Block internal IPs
    for blocked_range in BLOCKED_IP_RANGES:
        if ipaddress.ip_address(ip) in ipaddress.ip_network(blocked_range):
            raise ValidationError("Internal IPs not allowed")

    # Optional: Allowlist specific domains
    ALLOWED_DOMAINS = ["hooks.slack.com", "discord.com"]
    if parsed.hostname not in ALLOWED_DOMAINS:
        raise ValidationError("Domain not allowed")

    return url
```

**Disable redirects**:
```python
# Don't follow redirects (prevent redirect to internal service)
response = requests.get(url, allow_redirects=False, timeout=5)
```

### Journey-Based Analysis Questions

- **Does journey accept user-provided URLs?** (webhooks, file imports, integrations)
- **What internal services exist?** (databases, caches, admin panels)
- **Can URLs be allowlisted?** (specific domains like Slack, Discord)
- **Are there file imports from URLs?** (S3 only, not arbitrary URLs)

### Implementation Checklist

- [ ] HTTPS required for all user-provided URLs
- [ ] Internal IP ranges blocked (127.0.0.1, 10.0.0.0/8, 192.168.0.0/16, 169.254.0.0/16)
- [ ] Domain allowlist if applicable
- [ ] Redirects disabled or validated
- [ ] Timeout configured (5-10 seconds)

---

## API8:2023 - Security Misconfiguration

### Threat Description

**Severity**: Medium

**What**: Missing security headers, default credentials, verbose error messages, unnecessary endpoints, and insecure defaults expose APIs to attacks.

**Attack Vector**:
```http
# Missing HSTS header allows downgrade attack
# Attacker performs MITM, downgrades HTTPS to HTTP

# Verbose error reveals stack trace
GET /api/users/invalid
500 Internal Server Error
{
  "error": "Traceback (most recent call last):\n  File /app/models.py...",
  "database": "postgresql://user:pass@db-internal:5432/prod"
}
```

**Common Vulnerability Pattern**:
- No security headers (HSTS, CSP, X-Content-Type-Options)
- Verbose error messages in production (stack traces, SQL queries)
- Default credentials not changed (admin/admin)
- Unnecessary endpoints enabled (/debug, /admin, /metrics)

### Real-World Example

**Equifax 2017**: Failure to patch Apache Struts vulnerability (security misconfiguration) led to breach of 147 million records.

### Mitigation Pattern

**Required security headers**:

```http
# All API responses MUST include:
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Content-Security-Policy: default-src 'self'
X-Request-ID: req_abc123
```

**Production error handling**:
```python
# Development: Verbose errors
if DEBUG:
    return {"error": traceback.format_exc()}

# Production: Generic errors
return {
    "error": {
        "code": "INTERNAL_ERROR",
        "message": "An unexpected error occurred",
        "request_id": "req_abc123"  # For support debugging
    }
}
```

**Disable unnecessary endpoints**:
```python
# Disable in production
if not DEBUG:
    app.routes.remove("/debug")
    app.routes.remove("/admin")
```

### Journey-Based Analysis Questions

- **What security headers are needed?** (web app: CSP, API-only: basic headers)
- **Are default endpoints disabled?** (/admin, /debug, /metrics, /health)
- **Is error logging separate from responses?** (log stack trace, return generic error)
- **Are default credentials changed?** (database, admin panel, monitoring)

### Implementation Checklist

- [ ] HSTS header configured (max-age=31536000)
- [ ] X-Content-Type-Options: nosniff
- [ ] X-Frame-Options: DENY or SAMEORIGIN
- [ ] Content-Security-Policy configured
- [ ] Generic error messages in production (no stack traces)
- [ ] Unnecessary endpoints disabled
- [ ] Default credentials changed

---

## API10:2023 - Unsafe Consumption of APIs

### Threat Description

**Severity**: Medium to High

**What**: APIs that consume third-party APIs without proper timeout, validation, and error handling are vulnerable to cascading failures and malicious responses.

**Attack Vector**:
```http
# Third-party API is slow or malicious
POST /api/process-document
# Calls external AI service

# Vulnerable pattern:
response = requests.get("https://third-party-api.com/analyze", timeout=None)
# No timeout! Hangs for hours, exhausts server resources

# Or: Third-party returns malicious data
response = {"file_url": "http://attacker.com/malware.exe"}
# API fetches file without validation (SSRF + malware)
```

**Common Vulnerability Pattern**:
- No timeout for third-party API calls (hangs indefinitely)
- No circuit breaker (cascading failures)
- Trusting third-party responses without validation
- No fallback for third-party failures

### Real-World Example

**AWS S3 Outage 2017**: Cascading failures across services that depended on S3 without proper timeout and fallback mechanisms.

### Mitigation Pattern

**Timeout and circuit breaker**:

```python
import requests
from circuitbreaker import circuit

# Configure timeout
THIRD_PARTY_TIMEOUT = 5  # seconds

# Circuit breaker pattern
@circuit(failure_threshold=5, recovery_timeout=30)
def call_third_party_api(data):
    try:
        response = requests.post(
            "https://third-party-api.com/analyze",
            json=data,
            timeout=THIRD_PARTY_TIMEOUT
        )
        response.raise_for_status()
        return response.json()
    except requests.Timeout:
        # Fallback: return cached result or degraded response
        return get_cached_result(data) or {"status": "processing"}
    except requests.RequestException:
        # Log error, return fallback
        logger.error("Third-party API failed")
        return {"status": "error", "message": "Service temporarily unavailable"}
```

**Validate third-party responses**:
```python
def validate_third_party_response(response):
    # Don't trust third-party URLs
    if "file_url" in response:
        validate_webhook_url(response["file_url"])  # SSRF protection

    # Validate data schema
    if not isinstance(response.get("score"), float):
        raise ValidationError("Invalid response format")

    return response
```

### Journey-Based Analysis Questions

- **Which third-party APIs are consumed?** (payment, AI, email, analytics)
- **What happens if third-party API fails?** (block user, degrade gracefully, retry)
- **What's acceptable timeout?** (5s for sync, 30s for AI processing)
- **Is cached data available for fallback?** (stale data better than failure)

### Implementation Checklist

- [ ] All third-party API calls have timeout (5-30s)
- [ ] Circuit breaker implemented (open after N failures)
- [ ] Fallback strategy defined (cached data, degraded response, error)
- [ ] Third-party responses validated (schema, URLs)
- [ ] Retries with exponential backoff

---

## Risks Not Covered in Session 8

### API2:2023 - Broken Authentication

**Why Session 8 Skips This**:
- Session 3 (Tech Stack) selects authentication provider (Clerk, Auth0, custom JWT)
- Session 8 documents auth method (token placement, lifetime) but doesn't implement

**Where Addressed**: Session 3 tech stack selection, Session 12 scaffold implementation

---

### API4:2023 - Unrestricted Resource Consumption

**Why Session 8 Skips This**:
- Partially addressed by rate limiting (Step 5)
- Full resource limits (memory, CPU, disk) are infrastructure concerns

**Where Addressed**: Session 13 (Deployment Plan) - resource limits, auto-scaling, load balancing

---

### API9:2023 - Improper Inventory Management

**Why Session 8 Skips This**:
- API versioning strategy documented (URL versioning /v1/, /v2/)
- Full inventory (API catalog, deprecation tracking) is operational concern

**Where Addressed**: Session 14 (Observability) - API monitoring, version usage tracking

---

## Integration with Stack-Driven Cascade

### Session Dependencies

**Session 7 (Database Schema) → Session 8 (API Design)**:
- BOLA protection requires ownership columns (`user_id`, `team_id`)
- Property-level auth requires identifying sensitive fields
- Database schema informs input validation rules

**Session 8 (API Design) → Session 10 (Backlog)**:
- OWASP patterns generate security stories (implement BOLA checks, add security headers)
- Input validation generates validation library integration story

**Session 8 (API Design) → Session 12 (Scaffold)**:
- Security patterns guide middleware implementation
- Validation rules guide request validation setup

### Journey Traceability

**Every OWASP pattern must cite**:
- Specific journey steps (which steps involve owned resources?)
- Database tables (from Session 7 schema)
- User roles (from Session 1 journey or Session 4 architecture)

**Anti-pattern**: Generic security advice without journey citation
- ❌ "Use BOLA protection because it's a best practice"
- ✅ "Journey Step 2 (document upload) creates user-owned documents in `documents` table → BOLA protection: `WHERE user_id = :current_user_id`"

---

## Validation Questions for Session 8

Before considering OWASP coverage complete:

**Coverage**:
- [ ] All 8 applicable risks analyzed (API1, 3, 5, 6, 7, 8, 10)
- [ ] Non-applicable risks have "Reconsider if" conditions
- [ ] API2, 4, 9 skipped (addressed in other sessions)

**Journey Traceability**:
- [ ] Each pattern cites specific journey steps
- [ ] Database tables referenced (from Session 7)
- [ ] User roles documented (admin, user, owner, public)

**Specificity**:
- [ ] Protection patterns are journey-specific (not generic)
- [ ] Code examples use actual table/field names from schema
- [ ] Business flow limits based on legitimate usage patterns

**Completeness**:
- [ ] Input validation strategy complete
- [ ] Security headers documented
- [ ] Third-party API dependencies identified

---

## References

- **OWASP API Security Top 10 2023**: https://owasp.org/API-Security/editions/2023/en/0x11-t10/
- **OWASP API Security Project**: https://owasp.org/www-project-api-security/
- **Stack-Driven Session 8**: `.claude/commands/generate-api-design.md`
- **API Security Blueprint**: `reference-material/api-security-blueprint.md`

---

**Last Updated**: 2025-02-01
**Stack-Driven Version**: Session 8 enhancement (Issue #145)
