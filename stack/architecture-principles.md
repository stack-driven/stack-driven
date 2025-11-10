# Architecture Principles: Design Patterns for Scale

> Architecture is about making decisions that enable long-term velocity. Good architecture feels invisible; bad architecture creates friction at every turn.

---

## Core Principles

### 1. Start Simple, Evolve Deliberately

**Principle**: Use the simplest architecture that could possibly work. Add complexity only when pain is real and measurable.

**Why**: Premature optimization wastes time. Premature complexity kills velocity.

**Example Evolution:**
```
MVP (0-1K users):
- Monolithic Next.js app
- PostgreSQL database
- All code in one repo

Growth (1K-100K users):
- Separate frontend/backend
- Add caching layer (Redis)
- Background job processing

Scale (100K+ users):
- Service separation (if needed)
- Database read replicas
- CDN for static assets
```

**Rule**: Only add architectural complexity when you have concrete metrics showing you need it.

---

### 2. Design Around User Flows, Not Technical Layers

**Anti-Pattern (Technical Layers):**
```
/controllers
/services
/models
/views
```

**Better (User Flows):**
```
/features
  /assessment
    /api
    /ui
    /models
    /jobs
  /reporting
    /api
    /ui
    /models
```

**Why**:
- Features evolve together (co-located code)
- Easier to understand (follows user journey)
- Easier to test (feature-level integration)
- Easier to delete (remove entire feature)

---

### 3. API-First Architecture

**Principle**: Every feature should have an API before it has a UI.

**Why**:
- Forces clean separation of concerns
- Enables integrations from day 1
- Mobile apps can reuse APIs
- Internal tools can reuse APIs
- Testing is easier (API testing simpler than UI testing)

**Pattern:**
```
1. Design API endpoint
2. Implement API with tests
3. Build UI consuming API
4. Public API is already done (just add auth/rate limiting)
```

---

### 4. Stateless Services, Stateful Data Layer

**Principle**: Application servers should be stateless. All state lives in databases, caches, or queues.

**Why**:
- Horizontal scaling (add more servers)
- No session affinity needed (any server handles any request)
- Easy deployments (kill servers without data loss)
- Fault tolerance (server crashes don't lose state)

**Anti-Pattern:**
```python
# State in server memory (BAD)
active_sessions = {}

@app.post('/start-assessment')
def start(assessment_id):
    active_sessions[assessment_id] = {...}
```

**Better:**
```python
# State in Redis (GOOD)
@app.post('/start-assessment')
async def start(assessment_id):
    await redis.setex(
        f"assessment:{assessment_id}",
        3600,  # 1 hour TTL
        json.dumps({...})
    )
```

---

### 5. Asynchronous for Long-Running Operations

**Principle**: Operations taking >2 seconds should be asynchronous.

**Why**:
- Better user experience (immediate response)
- Prevents timeout issues
- Enables retries
- Scalable processing (queue + workers)

**Pattern:**
```python
# API accepts job
@app.post('/workflows/assess')
async def assess_document(request):
    # Create job
    job = await queue.add('assess', {
        'doc_id': request.doc_id,
        'user_id': request.user_id
    })

    # Return immediately
    return {
        'assessment_id': job.id,
        'status': 'processing',
        'estimated_seconds': 30
    }

# Worker processes job
async def process_assessment(job):
    result = await run_assessment(job.data)

    # Store result
    await db.save(result)

    # Notify user (webhook or email)
    await notify_complete(job.data.user_id, result)
```

---

### 6. Idempotent Operations

**Principle**: Repeating the same request should have the same effect as making it once.

**Why**:
- Network failures require retries
- Webhooks get redelivered
- Users double-click submit buttons
- Prevents duplicate charges, double-processing, etc.

**Pattern:**
```python
@app.post('/workflows/assess')
async def assess_document(request: AssessmentRequest):
    # Use client-provided idempotency key
    idempotency_key = request.headers.get('Idempotency-Key')

    # Check if already processed
    existing = await redis.get(f"idem:{idempotency_key}")
    if existing:
        return json.loads(existing)

    # Process request
    result = await create_assessment(request)

    # Store result with key (24-hour expiry)
    await redis.setex(
        f"idem:{idempotency_key}",
        86400,
        json.dumps(result)
    )

    return result
```

---

### 7. Explicit Over Implicit

**Principle**: Make behavior obvious in code. No magic.

**Anti-Pattern:**
```python
# Implicit behavior (BAD)
user = User.get(id)  # What does this do? DB query? Cache? API call?
```

**Better:**
```python
# Explicit behavior (GOOD)
user = await db.users.find_by_id(id)  # Clearly a DB query
user = await cache.get_user(id)       # Clearly cache lookup
user = await api.fetch_user(id)       # Clearly API call
```

**Why**:
- Easier to understand
- Easier to debug
- Easier to optimize (you know what's slow)
- Harder to make mistakes

---

### 8. Fail Fast, Fail Loud

**Principle**: Validate inputs immediately. Propagate errors clearly.

**Why**:
- Bugs found early are cheap to fix
- Silent failures are debugging nightmares
- Clear errors improve developer experience

**Pattern:**
```python
from pydantic import BaseModel, validator

class AssessmentRequest(BaseModel):
    document_url: str
    framework: str

    @validator('document_url')
    def validate_url(cls, v):
        if not v.startswith('https://'):
            raise ValueError('document_url must be HTTPS')
        return v

    @validator('framework')
    def validate_framework(cls, v):
        allowed = ['iso-27001', 'gdpr', 'soc2']
        if v not in allowed:
            raise ValueError(f'framework must be one of {allowed}')
        return v

# FastAPI validates automatically, returns 422 with details
@app.post('/assess')
async def assess(request: AssessmentRequest):
    # If we're here, request is valid
    ...
```

---

### 9. Observability Built-In

**Principle**: Every service should emit logs, metrics, and traces by default.

**Why**:
- You can't fix what you can't see
- Observability enables debugging production
- Metrics drive optimization decisions

**Pattern:**
```python
import structlog
from opentelemetry import trace

logger = structlog.get_logger()
tracer = trace.get_tracer(__name__)

@app.post('/assess')
async def assess(request: AssessmentRequest):
    with tracer.start_as_current_span("assess_document") as span:
        # Structured logging
        logger.info("assessment_started",
            doc_id=request.doc_id,
            framework=request.framework,
            user_id=request.user_id
        )

        # Add trace attributes
        span.set_attribute("doc.size_bytes", doc_size)
        span.set_attribute("framework", request.framework)

        try:
            result = await run_assessment(request)

            logger.info("assessment_completed",
                doc_id=request.doc_id,
                score=result.score,
                duration_ms=elapsed
            )

            return result

        except Exception as e:
            logger.error("assessment_failed",
                doc_id=request.doc_id,
                error=str(e)
            )
            span.set_status(trace.Status(trace.StatusCode.ERROR))
            raise
```

---

### 10. Security by Design

**Principle**: Security isn't an afterthought. It's a constraint on every design.

**Checklist for Every Endpoint:**
- [ ] Authentication required?
- [ ] Authorization enforced? (user can only access their data)
- [ ] Input validated? (prevent injection)
- [ ] Rate limited? (prevent abuse)
- [ ] Sensitive data encrypted? (at rest and in transit)
- [ ] Audit logged? (who did what when)

**Pattern:**
```python
from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session

async def get_current_user(token: str = Depends(oauth2_scheme)):
    # Verify JWT
    user = await verify_token(token)
    if not user:
        raise HTTPException(401, "Invalid token")
    return user

@app.get('/assessments/{assessment_id}')
async def get_assessment(
    assessment_id: str,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Authorization: ensure user owns this assessment
    assessment = db.query(Assessment).filter(
        Assessment.id == assessment_id,
        Assessment.user_id == user.id  # CRITICAL
    ).first()

    if not assessment:
        raise HTTPException(404, "Not found")

    # Audit log
    await audit.log("assessment.viewed", user.id, assessment_id)

    return assessment
```

---

## Architecture Patterns by Feature Type

### Pattern: CRUD Resource

**When**: Standard create/read/update/delete operations

**Structure:**
```
/features/assessments
  /models.py         # Database models
  /schemas.py        # API request/response models
  /routes.py         # API endpoints
  /service.py        # Business logic
  /tests.py          # Feature tests
```

**Example:**
```python
# models.py
class Assessment(Base):
    id = Column(UUID, primary_key=True)
    user_id = Column(UUID, ForeignKey('users.id'))
    status = Column(String)
    result = Column(JSONB)

# schemas.py
class AssessmentCreate(BaseModel):
    document_url: str
    framework: str

class AssessmentResponse(BaseModel):
    id: UUID
    status: str
    result: Optional[dict]

# routes.py
@router.post('/', response_model=AssessmentResponse)
async def create(request: AssessmentCreate, user: User = Depends(auth)):
    return await service.create_assessment(request, user.id)

@router.get('/{id}', response_model=AssessmentResponse)
async def get(id: UUID, user: User = Depends(auth)):
    return await service.get_assessment(id, user.id)
```

### Pattern: Async Workflow

**When**: Long-running operations (>2 seconds)

**Structure:**
```
/features/assessment_workflow
  /api.py            # HTTP endpoint (creates job)
  /worker.py         # Background processor
  /models.py         # Job state
  /webhooks.py       # Result delivery
```

**Example:**
```python
# api.py - Accept job
@app.post('/workflows/assess')
async def start_assessment(request: AssessmentRequest):
    job = await queue.add('assess', request.dict())
    return {'job_id': job.id, 'status': 'processing'}

# worker.py - Process job
async def process_assessment(job):
    result = await claude.assess(job.data.document_url)
    await db.save(result)
    await webhooks.notify(job.data.callback_url, result)
```

### Pattern: Event-Driven

**When**: Multiple systems need to react to events

**Structure:**
```
/events
  /publisher.py      # Emit events
  /handlers.py       # Event handlers
  /types.py          # Event schemas
```

**Example:**
```python
# publisher.py
async def publish_event(event_type: str, data: dict):
    await redis.publish('events', json.dumps({
        'type': event_type,
        'data': data,
        'timestamp': datetime.utcnow()
    }))

# handlers.py
@event_handler('assessment.completed')
async def on_assessment_complete(event):
    # Update user's compliance dashboard
    await dashboard.update(event.data.user_id)

    # Send notification
    await notifications.send(event.data.user_id, {
        'type': 'assessment_done',
        'assessment_id': event.data.id
    })

    # Track metric
    await analytics.track('assessment_completed', {
        'user_id': event.data.user_id,
        'score': event.data.result.score
    })
```

---

## Database Design Patterns

### Pattern: Audit Trail

**When**: Need to track who changed what when

**Implementation:**
```sql
-- Every table gets these
CREATE TABLE assessments (
  id UUID PRIMARY KEY,
  -- business columns
  document_url TEXT,
  result JSONB,
  -- audit columns
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES users(id),
  updated_by UUID REFERENCES users(id)
);

-- Trigger to update updated_at
CREATE TRIGGER update_assessments_updated_at
  BEFORE UPDATE ON assessments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### Pattern: Soft Deletes

**When**: Need to recover deleted data or maintain referential integrity

**Implementation:**
```sql
CREATE TABLE assessments (
  id UUID PRIMARY KEY,
  -- business columns
  -- soft delete column
  deleted_at TIMESTAMPTZ DEFAULT NULL
);

-- Queries exclude soft-deleted by default
SELECT * FROM assessments
WHERE deleted_at IS NULL;

-- Soft delete
UPDATE assessments
SET deleted_at = NOW(), updated_by = :user_id
WHERE id = :id;

-- Restore
UPDATE assessments
SET deleted_at = NULL
WHERE id = :id;
```

### Pattern: Optimistic Locking

**When**: Preventing concurrent update conflicts

**Implementation:**
```sql
CREATE TABLE assessments (
  id UUID PRIMARY KEY,
  -- business columns
  version INTEGER NOT NULL DEFAULT 1
);

-- Update with version check
UPDATE assessments
SET result = :result, version = version + 1
WHERE id = :id AND version = :expected_version;

-- If 0 rows affected, version mismatch (conflict)
```

---

## Caching Strategies

### Pattern: Cache-Aside

**When**: Expensive database queries

**Implementation:**
```python
async def get_assessment(assessment_id: str):
    # Try cache first
    cached = await redis.get(f"assessment:{assessment_id}")
    if cached:
        return json.loads(cached)

    # Cache miss - query database
    assessment = await db.query(Assessment).filter(
        Assessment.id == assessment_id
    ).first()

    # Populate cache (1-hour TTL)
    await redis.setex(
        f"assessment:{assessment_id}",
        3600,
        json.dumps(assessment.dict())
    )

    return assessment
```

### Pattern: Write-Through Cache

**When**: Data that changes frequently

**Implementation:**
```python
async def update_assessment(assessment_id: str, result: dict):
    # Update database
    await db.query(Assessment).filter(
        Assessment.id == assessment_id
    ).update({'result': result})
    await db.commit()

    # Update cache immediately
    await redis.setex(
        f"assessment:{assessment_id}",
        3600,
        json.dumps({'id': assessment_id, 'result': result})
    )
```

### Pattern: Cache Invalidation

**When**: Ensuring cache consistency

**Implementation:**
```python
async def delete_assessment(assessment_id: str):
    # Delete from database
    await db.query(Assessment).filter(
        Assessment.id == assessment_id
    ).delete()

    # Invalidate cache
    await redis.delete(f"assessment:{assessment_id}")

    # Invalidate related caches
    await redis.delete(f"user_assessments:{user_id}")
```

---

## Integration with Other Guidelines

### ← User Journey (../foundation/01-user-journey.md)
Architecture optimizes critical journey steps (speed, reliability)

### ← Metrics (../foundation/03-success-metrics.md)
Observability built-in enables metric tracking

### ← Tech Stack (./tech-stack.md)
Architecture patterns match chosen technologies

### → Prioritization (./prioritization.md)
Architecture decisions guide feasibility estimates

---

## For AI Coding Agents

When generating code, agents should:

1. **Follow established patterns**: Match existing architecture
2. **Include observability**: Add logging, tracing, metrics
3. **Validate inputs**: Use type checking and validation
4. **Handle errors**: Explicit error handling
5. **Document decisions**: Comments for non-obvious choices

**Example Agent Context:**
```json
{
  "architecture_context": {
    "patterns": {
      "long_operations": "async_job_queue",
      "state_management": "stateless_servers_stateful_data",
      "caching": "redis_cache_aside",
      "security": "jwt_auth_rbac"
    },
    "conventions": {
      "feature_structure": "colocation",
      "error_handling": "fail_fast",
      "logging": "structured_json",
      "database": "soft_deletes_audit_trail"
    }
  }
}
```

Agents reference `.context/architecture.json` for consistency.

---

## Template: Architecture Decision Record

```markdown
# ADR-001: [Decision Title]

## Status
[Proposed | Accepted | Deprecated | Superseded]

## Context
What problem are we solving?
What constraints exist?
What's the user impact?

## Decision
We will [decision].

## Alternatives Considered
1. [Alternative 1] - Rejected because [reason]
2. [Alternative 2] - Rejected because [reason]

## Consequences
Positive:
- [Benefit 1]
- [Benefit 2]

Negative:
- [Trade-off 1]
- [Trade-off 2]

## Implementation
- [Task 1]
- [Task 2]

## Metrics to Track
- [Metric 1]: [Target]
- [Metric 2]: [Target]
```

---

**Remember**: Architecture is about enabling velocity long-term. Simple beats clever. Explicit beats implicit. Boring beats exciting.

**Next Steps**: Proceed to [prioritization.md](./prioritization.md) to learn how to make feature trade-offs.
