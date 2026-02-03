# Compliance SaaS Architecture Example

## Journey Overview

**Product**: Compliance document assessment SaaS
**User**: Compliance officers at regulated companies
**Journey**: 4 steps
1. Upload compliance documents (PDF, DOCX)
2. Select compliance framework (ISO 27001, SOC 2, HIPAA)
3. AI assessment (analyze document against framework)
4. View results (compliance score, gaps, recommendations)

**Value Prop**: 4 hours manual review → 60 seconds with AI = 240x faster

## System Overview

**Entities**: 8 tables
- documents, users, frameworks, assessments, results, audit_logs, sessions, integrations

**Team**: 3 developers
**Stack**: Next.js (frontend) + FastAPI (backend) + Prisma (ORM) + PostgreSQL (database) + S3 (storage) + OpenAI API (AI)
**Deployment**: Weekly releases

---

## Section 1: Architectural Style (Modular Monolith)

### Decision Matrix Application

| Factor | This Journey | Monolith | Modular Monolith | Microservices |
|--------|--------------|----------|------------------|---------------|
| Team size | 3 engineers | ✅ | ✅ | ❌ |
| Entity count | 8 entities | ✅ | ✅ | ❌ |
| Deployment | Weekly | ✅ | ✅ | ❌ |
| Contexts | 2 clear (Documents, Assessments) | ❌ | ✅ | ~ |
| Ops maturity | Low (new team) | ✅ | ✅ | ❌ |

**Scores**: Monolith (4/5), Modular Monolith (5/5), Microservices (0/5)

### Recommendation: Modular Monolith

**Rationale**:
- Team size (3) suits single deployment - no need for distributed coordination
- Entity count (8) manageable in one codebase
- Weekly releases don't justify microservices deployment complexity
- **Key insight**: 2 clear bounded contexts benefit from module boundaries
  - Documents module isolates file upload/storage concerns
  - Assessments module isolates AI integration complexity
  - Boundaries prevent tight coupling as journey evolves
- Operational maturity is low - team learning product, can't handle distributed systems yet

**Journey Connection**: Users experience simple linear flow (Step 1 → 4), don't need distributed benefits

### Module Structure

```
/src
  /modules
    /documents       # Journey Step 1: Upload
      /domain
        Document.ts  # Domain entity
        DocumentStatus.ts  # Value object
      /services
        DocumentService.ts
      /repositories
        DocumentRepository.ts
      /controllers
        DocumentController.ts
      index.ts       # Public API: uploadDocument(), getDocument(), deleteDocument()

    /assessments     # Journey Steps 2-4: Assess
      /domain
        Assessment.ts  # Domain entity
        ComplianceScore.ts  # Value object
      /services
        AssessmentService.ts
      /repositories
        AssessmentRepository.ts
      /controllers
        AssessmentController.ts
      index.ts       # Public API: createAssessment(), getResults()

    /shared
      /domain        # Shared value objects
        UserId.ts
        Email.ts
      /middleware    # Shared HTTP middleware
        authenticate.ts
        rateLimiter.ts
```

### Boundary Enforcement

**Config (dependency-cruiser)**:
```javascript
// .dependency-cruiser.js
module.exports = {
  forbidden: [
    {
      name: 'no-cross-module-internal-imports',
      severity: 'error',
      from: { path: '^src/modules/([^/]+)' },
      to: {
        path: '^src/modules/(?!\\1)[^/]+/(?!index\\.ts)',
        pathNot: '^src/modules/shared'
      }
    }
  ]
};
```

**Public API Example**:
```typescript
// documents/index.ts (PUBLIC API)
export { uploadDocument, getDocument } from './services/DocumentService';

// assessments/services/AssessmentService.ts
import { getDocument } from '@modules/documents'; // ✅ Public API
// import { DocumentRepository } from '@modules/documents/repositories/DocumentRepository'; // ❌ FORBIDDEN
```

### Evolution Path

1. **Now**: Modular Monolith (2 modules: Documents, Assessments)
2. **If team grows to 15+**: Split modules into separate repositories (still monolith, clearer ownership)
3. **If AI assessment becomes bottleneck**: Extract Assessments module as microservice (Python service for ML)
4. **If compliance frameworks become marketplace**: Extract Frameworks module as separate service

---

## Section 2: Domain Layer (DDD)

### Document Entity (Aggregate Root)

**Database Table**: documents (Session 7)
**Identity**: DocumentId (UUID)
**Journey Step**: Step 1 (Document Upload)

**Business Rules**:
- Cannot assess unprocessed document (Journey Step 3 requires "ready" status)
- Cannot delete document with active assessments (preserves audit trail for Step 4)
- Storage key must be immutable once set (prevents orphaned S3 objects)

**Methods**:
```typescript
class Document {
  private id: DocumentId;
  private userId: UserId;
  private storageKey: StorageKey;
  private status: DocumentStatus;

  markAsReady(): void {
    if (this.status.value !== 'processing') {
      throw new DomainError('Can only mark processing documents as ready');
    }
    this.status = DocumentStatus.READY;
  }

  markAsError(reason: string): void {
    this.status = DocumentStatus.ERROR;
    this.errorReason = reason;
  }

  canBeDeleted(): boolean {
    // Check if safe to delete (no active assessments)
    return this.assessmentCount === 0 || this.status.value === 'error';
  }

  generateDisplayName(): string {
    // Business rule for UI display
    return this.fileName.replace(/\.[^/.]+$/, ''); // Remove extension
  }
}
```

**Value Objects**: FileSize, DocumentStatus, StorageKey
**Is Aggregate Root?**: Yes (no child entities, standalone)
**Why Not in Service?**: Status transitions have domain rules (can't go from 'error' to 'ready' directly)

### DocumentStatus Value Object

**Values**: 'pending' | 'processing' | 'ready' | 'error' | 'deleted'
**Compared By**: String value
**Immutability**: Status changes create new instance

```typescript
class DocumentStatus {
  private constructor(readonly value: string) {}

  static PENDING = new DocumentStatus('pending');
  static PROCESSING = new DocumentStatus('processing');
  static READY = new DocumentStatus('ready');
  static ERROR = new DocumentStatus('error');
  static DELETED = new DocumentStatus('deleted');

  canTransitionTo(newStatus: DocumentStatus): boolean {
    // Domain rule: status transition validity
    const validTransitions = {
      'pending': ['processing', 'error'],
      'processing': ['ready', 'error'],
      'ready': ['deleted'],
      'error': ['deleted']
    };
    return validTransitions[this.value]?.includes(newStatus.value) ?? false;
  }
}
```

**Journey Context**: Displayed in Step 1 document list, gates Step 3 assessment creation

### Assessment Entity (Aggregate Root)

**Database Table**: assessments (Session 7)
**Identity**: AssessmentId (UUID)
**Journey Step**: Steps 2-3 (Framework Selection → AI Assessment)

**Business Rules**:
- Cannot start assessment on unready document (requires Document.status === 'ready')
- Cannot view results until status === 'completed' (Journey Step 4 dependency)
- Framework must be active (references framework catalog validity)

**Methods**:
```typescript
class Assessment {
  private id: AssessmentId;
  private documentId: DocumentId;
  private frameworkId: FrameworkId;
  private status: AssessmentStatus;
  private results: AssessmentResults | null;

  start(): void {
    if (this.status.value !== 'pending') {
      throw new DomainError('Assessment already started');
    }
    this.status = AssessmentStatus.RUNNING;
    this.startedAt = new Date();
  }

  complete(results: AssessmentResults): void {
    if (this.status.value !== 'running') {
      throw new DomainError('Assessment not running');
    }
    this.results = results;
    this.status = AssessmentStatus.COMPLETED;
    this.completedAt = new Date();
  }

  fail(error: ErrorDetails): void {
    this.status = AssessmentStatus.FAILED;
    this.error = error;
  }

  isViewable(): boolean {
    // Checks if results can be shown to user (Step 4)
    return this.status.value === 'completed' && this.results !== null;
  }
}
```

**Value Objects**: AssessmentStatus, ComplianceScore
**Is Aggregate Root?**: Yes (Assessment contains AssessmentResults as child value object)

### Aggregates Summary

1. **Document Aggregate** (Root: Document)
   - Boundary: Single document, no children
   - Invariants: Storage key immutable, status transitions valid

2. **Assessment Aggregate** (Root: Assessment)
   - Boundary: Assessment + Results (stored together, consistency required)
   - Invariants: Results only viewable when status === 'completed'

---

## Section 3: Transaction Boundaries

### DocumentService.uploadDocument()

**Transaction Scope**: External + DB with compensation
**Consistency Requirement**: Strong (atomic from user perspective)

**Steps**:
1. Upload file to S3 (external, cannot rollback)
2. Create document record in database (transactional)

**Failure Scenarios**:
- S3 upload fails → Return error to user, no database write occurs
- Database insert fails → Delete file from S3 (compensation), return error to user
- S3 delete compensation fails → Log error for manual cleanup, still return error to user

**Implementation**:
```typescript
async uploadDocument(userId: string, file: Buffer): Promise<Document> {
  let storageKey: string | null = null;

  try {
    // Step 1: External call (no transaction)
    const storageObj = await this.storageAdapter.uploadFile(file, generateKey());
    storageKey = storageObj.key;

    // Step 2: Database write (transactional)
    const document = Document.create(userId, storageKey, storageObj.size);
    document.markAsProcessing(); // Domain logic
    await this.documentRepo.save(document);

    return document;

  } catch (error) {
    // Compensate: Clean up orphaned file
    if (storageKey) {
      await this.storageAdapter.deleteFile(storageKey).catch(err =>
        this.logger.error('Failed to delete orphaned file', { storageKey, error: err })
      );
    }
    throw new Error('Upload failed - no data saved');
  }
}
```

**Journey Impact**: User sees upload failure immediately. Can retry without orphaned files in S3.

### AssessmentService.createAssessment()

**Transaction Scope**: Multi-repository (Unit of Work)
**Consistency Requirement**: Strong (assessment must reference valid document)

**Steps**:
1. Fetch document (validate it exists and is ready)
2. Create assessment record (atomic with document validation)

**Failure Scenarios**:
- Document not found → Return 404, no assessment created
- Document not ready → Return 422 "Document still processing", user can retry
- Assessment create fails → No database changes (rolled back)

**Implementation**:
```typescript
async createAssessment(documentId: string, frameworkId: string): Promise<Assessment> {
  const uow = new UnitOfWork(this.dataSource);

  try {
    await uow.beginTransaction();

    // Fetch and validate document
    const document = await uow.documentRepository.findById(documentId);
    if (!document) throw new Error('Document not found');
    if (!document.canBeAssessed()) throw new Error('Document not ready');

    // Create assessment
    const assessment = Assessment.create(documentId, frameworkId);
    await uow.assessmentRepository.save(assessment);

    await uow.commit();

    return assessment;

  } catch (error) {
    await uow.rollback();
    throw error;
  }
}
```

**Journey Impact**: User in Step 3 sees immediate feedback if document isn't ready. Atomic operation ensures no orphaned assessments.

---

## Section 4: ORM Pattern (Data Mapper)

### Decision

**Pattern Chosen**: Data Mapper

**Decision Matrix Analysis**:

| Factor | This Journey | Active Record | Data Mapper |
|--------|--------------|---------------|-------------|
| Entity count | 8 entities | ✅ | ✅ |
| Domain complexity | Medium (business rules) | ❌ | ✅ |
| Testing needs | Heavy unit testing | ❌ | ✅ |
| Team familiarity | Explicit architecture | ❌ | ✅ |
| Use case | Production SaaS | ~ | ✅ |

**Score**: Data Mapper (4/5), Active Record (1/5)

**Rationale**:
- Entity count: 8 entities - manageable, but benefits from Data Mapper separation
- Domain complexity: Medium - Entities have business rules (Document status transitions, Assessment validation)
- Testing strategy: Heavy unit testing required (domain entities have business logic from Section 2)
- Clean architecture: Enforced (repository interfaces in domain, Prisma implementations in infrastructure)
- Journey connection: Domain entities model real-world concepts (Document, Assessment) with behavior that needs testing without database

**Trade-offs Accepted**:
- More code (entity + repository + mapper classes) vs Active Record simplicity
- Benefit: Domain entities testable without database, supports clean architecture

### Repository Example

```typescript
// DocumentRepository interface (in domain layer)
interface IDocumentRepository {
  findById(id: DocumentId): Promise<Document | null>;
  save(document: Document): Promise<void>;
  findByUserId(userId: UserId): Promise<Document[]>;
}

// DocumentRepository implementation (in infrastructure layer)
class PrismaDocumentRepository implements IDocumentRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: DocumentId): Promise<Document | null> {
    const row = await this.prisma.document.findUnique({
      where: { id: id.value }
    });
    return row ? this.toDomain(row) : null;
  }

  async save(document: Document): Promise<void> {
    await this.prisma.document.upsert({
      where: { id: document.id.value },
      create: this.toDb(document),
      update: this.toDb(document)
    });
  }

  private toDomain(row: any): Document {
    // Map database row to domain entity
    return new Document(
      new DocumentId(row.id),
      new UserId(row.userId),
      new StorageKey(row.storageKey),
      DocumentStatus.fromString(row.status)
    );
  }

  private toDb(document: Document): any {
    // Map domain entity to database row
    return {
      id: document.id.value,
      userId: document.userId.value,
      storageKey: document.storageKey.value,
      status: document.status.value
    };
  }
}
```

---

## Section 5: Rate Limiting

### POST /api/documents (uploadDocument)

**Algorithm**: Token Bucket
**Scope**: Per-user
**Limits**:
- Capacity: 10 uploads
- Refill rate: 1 token per minute (60 uploads per hour)

**Rationale**:
- High cost operation: Storage (S3), processing (file validation, text extraction)
- Allows burst of 10 documents (user uploading batch of compliance documents)
- Prevents spam with slow refill (1/min)

**Journey Integration**: Users typically upload 1-5 documents in burst (Step 1), then wait for processing

**429 Response**: "Upload limit exceeded. You can upload 1 document per minute (10 burst allowed)."

**Configuration**:
```yaml
endpoint: POST /api/documents
rate_limit:
  algorithm: token_bucket
  capacity: 10
  refill_rate: 1 per minute
  scope: per_user
  key: user_id
```

### GET /api/documents (listDocuments)

**Algorithm**: Sliding Window
**Scope**: Per-user
**Limits**: 100 requests per 5 minutes (20 req/min average)

**Rationale**:
- Medium cost: Database query with pagination
- Prevents excessive polling (user refreshing page repeatedly)
- Allows normal browsing (pagination, filtering)

**Journey Integration**: Users check document list occasionally (Step 1), typical usage: 5-10 requests per session

**Configuration**:
```yaml
endpoint: GET /api/documents
rate_limit:
  algorithm: sliding_window
  limit: 100
  window: 5 minutes
  scope: per_user
```

### DELETE /api/documents/:id (deleteDocument)

**Algorithm**: Sliding Window
**Scope**: Per-user
**Limits**: 20 requests per 5 minutes (4 req/min average)

**Rationale**:
- Destructive operation with compensation cost (S3 cleanup)
- Lower limit prevents accidental bulk deletion
- Rare operation in typical workflow

**Journey Integration**: Users rarely delete documents (cleanup before uploading corrected version)

---

## Section 6: Cross-Cutting Concerns

### 6.1 Caching: Document List

**Operation**: `DocumentService.listUserDocuments(userId)`
**Pattern**: Cache-Aside
**Rationale**: Read-heavy - users view document list 10x more than upload

**Configuration**:
- Cache key: `documents:user:{userId}:status:{status}`
- TTL: 300 seconds (5 minutes) ± 30 seconds jitter
- Invalidation: On document upload/delete, invalidate user's cache
- Storage: Redis (L2 cache)

**Implementation**:
```typescript
async listUserDocuments(userId: string, status?: string): Promise<Document[]> {
  const cacheKey = `documents:user:${userId}:status:${status || 'all'}`;

  // Check cache
  const cached = await this.redis.get(cacheKey);
  if (cached) return JSON.parse(cached);

  // Cache miss - fetch from database
  const documents = await this.documentRepo.findByUserId(userId, { status });

  // Store with TTL jitter
  const ttl = 300 + (Math.random() * 60 - 30); // 270-330 seconds
  await this.redis.setex(cacheKey, ttl, JSON.stringify(documents));

  return documents;
}
```

**Journey Connection**: Step 1 - Users refresh document list frequently while waiting for processing. Caching reduces database load and improves perceived performance (faster page load).

### 6.2 Circuit Breaker: AI Assessment API

**Integration**: OpenAI API for compliance assessment
**Pattern**: Circuit Breaker + Retry
**Rationale**: External API can fail (rate limits, model outages, network issues)

**Configuration**:
- Failure threshold: 50% over 10 requests
- Wait duration: 60 seconds
- Retry: 3 attempts with 100ms, 200ms, 400ms backoff
- Timeout: 30 seconds per request
- Fallback: Return "assessment queued" status, process asynchronously

**Metrics**:
- `ai_api_circuit_breaker_state` (closed/open/half-open)
- `ai_api_request_duration_seconds` (p50, p95, p99)
- `ai_api_failure_rate` (percentage)

**Journey Connection**: Step 3 - AI assessment is critical but external. Circuit breaker prevents cascading failures. Fallback (queue for later) preserves UX when API is down - user sees "Assessment queued" instead of timeout error.

### 6.3 Observability: All Services

**Structured Logging**: JSON format
```json
{
  "timestamp": "2025-02-02T10:30:45Z",
  "level": "INFO",
  "service": "document-service",
  "correlationId": "uuid-123",
  "userId": "user-456",
  "message": "Document uploaded",
  "context": {
    "documentId": "doc-789",
    "fileSize": 1024000,
    "duration": 234
  }
}
```

**Correlation IDs**: Generated per request, propagated through all layers

**Metrics**:
- Cache hit rate for document list: target >80%
- AI API p95 latency: target <5 seconds
- Document upload success rate: target >99%
- Maps to Session 4 L2 metrics: "Time to assessment" (performance)

**Journey Connection**: Observability enables tracking Session 4 metrics (user journey KPIs) and debugging production issues without disrupting users.

---

## Summary

This Compliance SaaS architecture demonstrates:

1. **Modular Monolith** (Section 1): Balances simplicity (single deployment) with clear boundaries (modules prevent coupling)
2. **Rich Domain Model** (Section 2): Business logic in entities (Document.markAsReady), not services
3. **Transaction Patterns** (Section 3): Compensation for external calls (S3), Unit of Work for multi-repo operations
4. **Data Mapper** (Section 4): Testable domain entities (no database coupling)
5. **Rate Limiting** (Section 5): Token Bucket for bursts (upload), Sliding Window for steady ops (list/delete)
6. **Production Readiness** (Section 6): Caching (performance), Circuit Breakers (resilience), Observability (debugging)

All decisions trace to **user journey** (4 steps: Upload → Select → Assess → Results) and serve **user value** (240x faster compliance review).
