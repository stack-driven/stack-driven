# Integration Strategy: API-First Architecture

> Every product eventually needs to integrate with other tools. Design for integration from day 1, and you'll unlock exponential distribution and value.

---

## The Integration Imperative

### Why API-First Matters

**Users don't work in isolation**. They have:
- Existing workflows (Slack, email, project management)
- Data sources (CRMs, databases, file storage)
- Compliance requirements (audit logs, SSO)
- Automation needs (Zapier, custom scripts)

**Products that integrate win** because:
- Lower switching costs (works with existing tools)
- Higher perceived value (multiplier, not replacement)
- Viral distribution (users share integrations)
- Stickier retention (embedded in workflows)

---

## Integration Principles

### 1. Every Workflow Gets Its Own Endpoint

**Pattern**: Treat each user workflow as an independent API endpoint.

**Why**: Users integrate workflows, not features.

**Example:**
```markdown
## Document Assessment Workflow

Endpoint: POST /api/v1/workflows/assess-document

Input:
- document_url (string)
- compliance_framework (string)
- callback_url (optional string)

Output:
- assessment_id (string)
- status (string: "processing" | "complete" | "failed")
- result (object, when complete)
```

**Benefits:**
- Self-documenting (endpoint = workflow)
- Versioning per workflow (evolve independently)
- Easy to deprecate (sunset old workflows without breaking others)

### 2. Simple Authentication (API Keys)

**Pattern**: API key authentication with scoped permissions.

**Why**: Simplicity drives adoption.

**Example:**
```bash
curl https://api.yourproduct.com/v1/workflows/assess \
  -H "Authorization: Bearer sk_live_abc123" \
  -H "Content-Type: application/json" \
  -d '{
    "document_url": "https://s3.../doc.pdf",
    "framework": "iso-27001"
  }'
```

**Key Management:**
```python
# Generate API key
api_key = f"sk_{'live' if env=='production' else 'test'}_{secrets.token_urlsafe(32)}"

# Scope by permission
key_scopes = ["read:assessments", "write:assessments", "admin:webhooks"]

# Rate limit by key
rate_limit = 100 requests/minute per key
```

**For Enterprise:**
- Add OAuth 2.0 for delegation
- Add JWTs for service-to-service
- Add IP whitelisting

### 3. Webhooks for Async Results

**Pattern**: Long-running workflows send results via webhook.

**Why**: Users don't want to poll. Push beats pull.

**Example:**
```markdown
## Webhook Registration

POST /api/v1/webhooks
{
  "url": "https://customer.com/callbacks/assessment",
  "events": ["assessment.completed", "assessment.failed"],
  "secret": "whsec_abc123" (for signature verification)
}

## Webhook Payload (Sent to customer)

POST https://customer.com/callbacks/assessment
{
  "event": "assessment.completed",
  "timestamp": "2025-11-10T12:00:00Z",
  "data": {
    "assessment_id": "asmt_123",
    "status": "complete",
    "result": {
      "compliant": true,
      "score": 0.95,
      "issues": []
    }
  }
}

Headers:
X-Signature: sha256=abc...  (HMAC of payload with secret)
```

**Implementation:**
```python
import hmac
import hashlib

# When sending webhook
def send_webhook(url, payload, secret):
    body = json.dumps(payload)
    signature = hmac.new(
        secret.encode(),
        body.encode(),
        hashlib.sha256
    ).hexdigest()

    requests.post(url, json=payload, headers={
        'X-Signature': f'sha256={signature}'
    })

# Customer verifies signature
def verify_webhook(request, secret):
    signature = request.headers['X-Signature']
    expected = 'sha256=' + hmac.new(
        secret.encode(),
        request.body,
        hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(signature, expected)
```

**Webhook Reliability:**
- Retry failed deliveries (exponential backoff)
- Max 3 retries
- Log all delivery attempts
- Provide webhook logs in dashboard

### 4. OpenAPI Spec Auto-Generated

**Pattern**: Generate API docs from code automatically.

**Why**: Docs drift from reality. Code is truth.

**With FastAPI:**
```python
from fastapi import FastAPI

app = FastAPI(
    title="Assessment API",
    description="Compliance assessment workflows",
    version="1.0.0"
)

@app.post("/v1/workflows/assess", response_model=AssessmentResponse)
async def assess_document(request: AssessmentRequest):
    """
    Assess a document for compliance.

    - **document_url**: URL to document (PDF, DOCX)
    - **framework**: Compliance framework (iso-27001, gdpr, etc.)

    Returns assessment_id for tracking.
    """
    return await run_assessment(request)
```

**Auto-generated docs at:**
- `/docs` - Interactive Swagger UI
- `/redoc` - ReDoc documentation
- `/openapi.json` - OpenAPI 3.0 spec

**Benefits:**
- Always accurate (generated from code)
- Try-it-out functionality (Swagger UI)
- Client library generation (openapi-generator)

---

## The Standard Integration Setup

### Every Workflow Gets:

1. **Unique API Endpoint**
   - RESTful naming: `POST /v1/workflows/{workflow-name}`
   - Version in URL: `/v1/`, `/v2/`
   - Resource-oriented

2. **API Key Authentication**
   - Header: `Authorization: Bearer {api_key}`
   - Key format: `sk_{env}_{random}`
   - Scoped permissions

3. **Webhook for Results**
   - User provides callback URL
   - Signed payload (HMAC-SHA256)
   - Automatic retries

4. **OpenAPI Spec**
   - Auto-generated from code
   - Interactive documentation
   - Client SDK generation

5. **Rate Limiting**
   - Per API key: 100 req/min (free), 1000 req/min (paid)
   - Return headers: `X-RateLimit-Remaining`, `X-RateLimit-Reset`
   - Status 429 when exceeded

6. **Error Handling**
   - Standard HTTP status codes
   - Consistent error format:
   ```json
   {
     "error": {
       "type": "invalid_request",
       "message": "document_url is required",
       "code": "missing_field"
     }
   }
   ```

---

## Integration Examples

### Example 1: Document Assessment Workflow

```markdown
## Endpoint

POST /api/v1/workflows/assess-document

## Request

{
  "document_url": "https://storage.com/doc.pdf",
  "compliance_framework": "iso-27001",
  "callback_url": "https://customer.com/webhook" (optional)
}

## Response (Async)

{
  "assessment_id": "asmt_1234567890",
  "status": "processing",
  "estimated_seconds": 30
}

## Webhook Callback (When Complete)

POST https://customer.com/webhook
{
  "event": "assessment.completed",
  "assessment_id": "asmt_1234567890",
  "result": {
    "compliant": true,
    "score": 0.95,
    "findings": [...],
    "recommendations": [...]
  }
}

## Alternative: Polling (If No Webhook)

GET /api/v1/assessments/{assessment_id}

Response:
{
  "id": "asmt_1234567890",
  "status": "complete",
  "result": {...}
}
```

### Example 2: Batch Assessment Workflow

```markdown
## Endpoint

POST /api/v1/workflows/assess-batch

## Request

{
  "documents": [
    {"url": "https://s3.com/doc1.pdf", "id": "doc1"},
    {"url": "https://s3.com/doc2.pdf", "id": "doc2"}
  ],
  "compliance_framework": "gdpr",
  "callback_url": "https://customer.com/webhook"
}

## Response

{
  "batch_id": "batch_abc123",
  "total_documents": 2,
  "status": "processing"
}

## Webhook Callback (Per Document)

POST https://customer.com/webhook
{
  "event": "assessment.completed",
  "batch_id": "batch_abc123",
  "document_id": "doc1",
  "result": {...}
}

## Webhook Callback (Batch Complete)

POST https://customer.com/webhook
{
  "event": "batch.completed",
  "batch_id": "batch_abc123",
  "total": 2,
  "successful": 2,
  "failed": 0
}
```

### Example 3: Real-Time Monitoring Workflow

```markdown
## Endpoint (WebSocket)

WS /api/v1/workflows/monitor

## Connection

const ws = new WebSocket('wss://api.yourproduct.com/v1/workflows/monitor');
ws.send(JSON.stringify({
  auth: 'Bearer sk_live_abc123',
  filters: {
    frameworks: ['iso-27001'],
    min_score: 0.8
  }
}));

## Server Messages

{
  "event": "assessment.completed",
  "data": {...}
}

## Use Case

Real-time dashboard showing all assessments across organization.
```

---

## Integration Distribution Strategy

### Phase 1: Native Integrations (High-Value Platforms)

Build direct integrations with platforms where your users already work.

**Example Priorities:**
1. **Slack** - Notifications, commands (`/assess document.pdf`)
2. **Google Drive** - Right-click "Assess for Compliance"
3. **Microsoft Teams** - Similar to Slack
4. **Salesforce** - For enterprise customers
5. **GitHub** - For developer tools

**ROI Calculation:**
- % of users on platform × integration effort hours = priority score

### Phase 2: Zapier/Make Integration

**Why**: 5,000+ apps for the cost of one integration.

**Implementation:**
```markdown
## Zapier Triggers

1. "Assessment Completed"
2. "Assessment Failed"
3. "New Document Uploaded"

## Zapier Actions

1. "Assess Document"
2. "Get Assessment Result"
3. "Create Compliance Report"

## Example Zap

Trigger: New file in Google Drive
Action: Assess document (your API)
Action: Send to Slack if non-compliant
```

**Effort**: ~40 hours to build + Zapier review
**Reach**: Millions of potential workflows

### Phase 3: Public API + Developer Community

**Provide:**
- Comprehensive API docs (OpenAPI)
- Client SDKs (Python, JavaScript, Go)
- Code examples for common use cases
- Postman collection
- Developer Discord/forum

**Developer Resources:**
```markdown
# Quick Start (Python)

pip install yourproduct

from yourproduct import Client

client = Client(api_key='sk_test_...')

result = client.assess(
    document_url='https://...',
    framework='iso-27001'
)

print(result.score)  # 0.95
```

---

## API Versioning Strategy

### URL Versioning (Recommended)

```
/api/v1/workflows/assess
/api/v2/workflows/assess
```

**Why:**
- Explicit, obvious version
- Can run multiple versions simultaneously
- Easy to deprecate

### Deprecation Process

**Timeline:**
1. **v2 Launch**: Announce v1 deprecation (6-month notice)
2. **Month 3**: Email all v1 users
3. **Month 5**: Warning in API responses (`X-API-Deprecated: true`)
4. **Month 6**: v1 shutdown

**Communication:**
```markdown
## API Changelog

### 2025-11-10: v2 Released
- New: Batch assessment endpoint
- Breaking: `compliance_framework` now required (was optional)
- Migration guide: /docs/v1-to-v2

### 2025-05-10: v1 Deprecation Notice
- v1 will sunset on 2025-11-10
- All users must migrate to v2
- v2 is backward-compatible except [specific changes]
```

---

## API Monitoring & Analytics

### Track These Metrics

**Usage Metrics:**
- Requests per endpoint per day
- Response time (p50, p95, p99)
- Error rate by endpoint
- Top consumers by API key

**Business Metrics:**
- API adoption rate (% of users with API keys)
- API revenue (if charging per call)
- Integration retention (users still calling API after 30 days)

**Dashboard:**
```markdown
## API Health Dashboard

Uptime (30d):        99.95%
Total Requests:      1.2M
Avg Response Time:   145ms
Error Rate:          0.3%

Top Endpoints:
1. /v1/workflows/assess - 800K requests
2. /v1/assessments/{id} - 300K requests

Top Consumers:
1. Acme Corp - 150K requests/day
2. Startup Inc - 80K requests/day
```

---

## Integration Security

### API Key Security

**Storage:**
- Hash keys before storing (like passwords)
- Show full key only at creation
- Allow users to rotate keys

**Transmission:**
- HTTPS only (reject HTTP)
- Never in URL query params
- Header: `Authorization: Bearer {key}`

**Scoping:**
```python
# Create scoped API key
scopes = [
    "read:assessments",   # Can fetch assessment results
    "write:assessments",  # Can create assessments
    "admin:webhooks"      # Can manage webhooks
]

# Validate scope
@require_scope("write:assessments")
async def create_assessment(request):
    ...
```

### Webhook Security

**Signature Verification:**
- Always sign payloads
- Use HMAC-SHA256
- Include timestamp (prevent replay attacks)

**HTTPS Callback URLs:**
```python
# Reject HTTP webhooks
if not callback_url.startswith('https://'):
    raise ValueError("Webhook URL must use HTTPS")

# Verify SSL cert (don't allow self-signed in prod)
```

### Rate Limiting

**Strategy:**
```python
# Per API key, per minute
limits = {
    'free': 100,
    'paid': 1000,
    'enterprise': 10000
}

# Sliding window (Redis)
key = f"ratelimit:{api_key}:{current_minute}"
count = redis.incr(key)
redis.expire(key, 60)

if count > limit:
    return Response(
        {"error": "Rate limit exceeded"},
        status=429,
        headers={
            'X-RateLimit-Remaining': 0,
            'X-RateLimit-Reset': next_minute_timestamp
        }
    )
```

---

## Integration with Other Guidelines

### ← User Journey (../foundation/01-user-journey.md)
APIs enable integration into user's existing workflows

### ← Monetization (../foundation/04-monetization.md)
API access can be a paid tier or usage-based revenue

### ← Tech Stack (./tech-stack.md)
FastAPI + Redis enables simple, performant API implementation

### → Architecture (./architecture-principles.md)
API-first architecture influences all design decisions

---

## For AI Coding Agents

When building API features, agents should:

1. **RESTful conventions**: Follow URL patterns
2. **Auto-document**: Use type hints for OpenAPI generation
3. **Webhook delivery**: Implement retry logic
4. **Rate limiting**: Apply per endpoint
5. **Error handling**: Return consistent error format

**Example Agent Context:**
```json
{
  "integration_context": {
    "api_version": "v1",
    "auth_method": "bearer_token",
    "rate_limit": "100_per_minute",
    "webhook_signature": "hmac_sha256",
    "conventions": {
      "url_pattern": "/api/v1/workflows/{workflow-name}",
      "error_format": {"error": {"type": "", "message": ""}},
      "pagination": "cursor-based"
    }
  }
}
```

Agents reference `.context/integration.json` for API patterns.

---

## Template: Your Integration Strategy

```markdown
# Integration Strategy: [Your Product]

## Core Workflows as APIs

### Workflow 1: [Name]
- **Endpoint**: POST /api/v1/workflows/{name}
- **Input**: [Fields]
- **Output**: [Fields]
- **Webhook Event**: [event.name]

### Workflow 2: [Name]
[Repeat structure]

## Authentication
- **Method**: [API key / OAuth]
- **Format**: `Authorization: Bearer {key}`
- **Scopes**: [read:*, write:*, admin:*]

## Webhooks
- **Registration**: POST /api/v1/webhooks
- **Signature**: HMAC-SHA256
- **Retries**: 3 attempts, exponential backoff

## Rate Limits
- Free: [X] req/min
- Paid: [Y] req/min
- Enterprise: [Z] req/min

## Distribution Plan
1. [Month 1]: Public API + docs
2. [Month 2]: Zapier integration
3. [Month 3]: [Platform] native integration
4. [Month 6]: SDK in [languages]

## Success Metrics
- API adoption: [X]% of users
- Requests/day: [Y]
- Integration retention: [Z]% at 30d
```

---

**Remember**: Every feature you expose as an API becomes a distribution channel. Design workflows, not just endpoints.

**Next Steps**: Proceed to [architecture-principles.md](./architecture-principles.md) to establish system design patterns.
