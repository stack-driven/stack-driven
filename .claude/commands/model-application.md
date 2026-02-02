---
description: Session 9b - Model application architecture layer
---

# Model Application Architecture (Session 9b)

You are helping the user model the application's structural organization - service layer, repositories, controllers, components - based on journey steps, database entities, API endpoints, and tech stack choices. This bridges the gap between API specifications (Session 8) and implementation (Session 10 backlog, Session 12 scaffold).

## When to Use This

**This is Session 9b** in the core Stack-Driven cascade. Run it:
- After Session 9 (`/create-test-strategy` - testing approach)
- Before Session 10 (`/generate-backlog` - implementation planning)
- When you need to define how your application code should be organized

**Skip this** if:
- You're building a static site with no application logic
- Your project is a library/framework (not an application)

## Your Task

Create comprehensive application architecture including:
- Service layer architecture (business logic classes and methods)
- Repository/data access layer (database interactions)
- Controller/handler layer (HTTP endpoint handlers)
- Frontend component architecture (if applicable from tech stack)
- Integration adapters (third-party service abstractions)
- Architecture decision records (what/why for each pattern)

This enables:
- **Session 10** to generate specific, implementation-ready user stories ("Implement DocumentService.uploadDocument()")
- **Session 12** to generate actual code skeletons with method signatures and dependency injection
  - Session 12 reads the context file from this session
  - Generates service classes, repository interfaces, controller handlers, test stubs
  - Places generated code in repository root (not product-guidelines/)
  - Includes TODO comments referencing Session 10 backlog stories
  - Ensures generated code compiles/type-checks before completion

---

## Process

### Step 1: Read Previous Outputs

**Required inputs:**

```
Read: product-guidelines/00-user-journey.ctx.md  # (context version for token efficiency)
Read: product-guidelines/02-tech-stack.ctx.md  # (context version for token efficiency)
Read: product-guidelines/02b-coding-standards.ctx.md  # (context version for token efficiency)
Read: product-guidelines/04-architecture.ctx.md  # (context version for token efficiency)
Read: product-guidelines/07-database-schema.ctx.md  # (context version for token efficiency)
Read: product-guidelines/08b-api-contracts.ctx.md  # (context version for token efficiency)
```

**Context Optimization**: We read .ctx.md files for journey, coding standards, database schema, and API contracts for significant context reduction (~60-80% smaller) while maintaining necessary information for architecture modeling.

**Extract from Journey**:
- What are the main journey steps that need code implementation?
- What user actions require business logic?
- What data transformations occur between steps?
- What third-party integrations are needed?

**Extract from Tech Stack**:
- Backend framework (FastAPI, Express, NestJS, Django, etc.)
- Frontend framework (Next.js, React, Vue, etc.)
- ORM/Database library (Prisma, TypeORM, SQLAlchemy, etc.)
- State management (React Query, Redux, Zustand, etc.)
- Architecture patterns recommended by framework

**Extract from Coding Standards**:
- Naming conventions for classes, methods, files
- Code organization patterns (feature-based, layer-based)
- Dependency injection approach
- Error handling patterns
- Async/await conventions

**Extract from Architecture**:
- Architectural style (monolith, modular monolith, microservices)
- Layer separation philosophy
- Multi-tenancy approach
- Caching strategy
- Security patterns

**Extract from Database Schema**:
- What entities exist? (each entity → potential service + repository)
- What relationships need traversal in application code?
- What query patterns are expected?

**Extract from API Contracts**:
- What endpoints exist? (each endpoint → controller method)
- What request/response transformations are needed?
- What special operations beyond CRUD? (custom actions → service methods)

**Example**: Compliance SaaS journey has document upload (Step 1) → framework selection (Step 2) → AI assessment (Step 3) → results review (Step 4). Database has documents, frameworks, assessments entities. API has /api/documents (upload), /api/assessments (create, status, results). Tech stack: Next.js + FastAPI + Prisma.

---

### Step 1.5: Validate Architectural Style

**Purpose**: Validate the architectural style choice from Session 4 against concrete journey requirements. Prevents premature adoption of microservices (distributed monolith anti-pattern) and identifies when modular monolith boundaries provide benefits without distribution costs.

**Decision Framework - Architectural Style Selection:**

```
Extract from context:
1. Team size → Read from Session 2a constraints (if exists) or Session 4 architecture
2. Entity count → Count tables from Session 7 database schema
3. Deployment frequency → Read from Session 4 architecture or Session 13 deployment plan (if exists)
4. Domain boundaries → Analyze journey steps - are there clear clusters of functionality?

Apply decision matrix:

| Factor | Monolith | Modular Monolith | Microservices |
|--------|----------|------------------|---------------|
| **Team size** | 1-15 engineers | 10-50 engineers | 50+ engineers |
| **Entity count** | < 10 entities | 10-30 entities | > 30 entities |
| **Deployment frequency** | Weekly/monthly | Daily/weekly | Multiple per day |
| **Bounded contexts** | Unclear | Evolving | Stable (3+ months) |
| **Operational maturity** | Low | Moderate | High (CI/CD, observability) |

Recommendation based on majority alignment:
- 3+ factors align with Monolith → Recommend Monolith
- 3+ factors align with Modular Monolith → Recommend Modular Monolith
- 4+ factors align with Microservices AND team has distributed systems expertise → Recommend Microservices
- Otherwise → Recommend Modular Monolith (safe default with evolution path)
```

**For the journey, document:**

```markdown
### Architectural Style Validation

**Journey Analysis:**
- Journey steps: [Count from Session 1]
- Database entities: [Count from Session 7]
- Team size: [From Session 2a constraints or Session 4]
- Deployment frequency: [From Session 4 or Session 13, or estimate: "Weekly releases"]
- Bounded contexts identified: [Analyze journey for clear clusters]
  - Example: Documents module, Assessments module, Reports module

**Decision Matrix Application:**
[Show table with actual values filled in]

**Recommendation**: **[Monolith / Modular Monolith / Microservices]**

**Rationale**:
- Team size ([X]) suits [single deployment / module boundaries / independent services]
- Entity count ([Y]) [manageable in one codebase / benefits from modules / requires service boundaries]
- Deployment: [Weekly / Daily] releases [don't justify / benefit from / require] [microservices / module isolation]
- Bounded contexts: [Clear/Unclear/Stable] → [Monolith / Modular Monolith / Microservices]
- Journey connection: [Explain how architectural choice serves user experience]
```

**If Monolith (simplest):**

```markdown
**Structure**: Single deployable, shared codebase, no enforced boundaries

**Directory Structure**:
```
src/
├── services/        # All services together
├── repositories/    # All repositories together
├── controllers/     # All controllers together
└── models/          # All domain models together
```

**Pros**:
- Simplest to build and deploy
- No distributed system complexity
- Easiest debugging (single process, single database transaction)

**Cons**:
- No enforced module boundaries (risk of tight coupling)
- Must deploy entire application for any change
- Shared database limits independent scaling

**Evolution Path**: Refactor to Modular Monolith when team > 10 or entities > 15
```

**If Modular Monolith (recommended default):**

```markdown
**Structure**: Single deployable with enforced module boundaries (Packwerk/ArchUnit style)

**Module Identification** (from journey step clusters):
```
/src
  /modules
    /[module-1]       # Journey Step X
      /domain         # Domain entities, value objects
      /services       # Business logic
      /repositories   # Data access
      /controllers    # HTTP handlers
      index.ts        # Public API - ONLY this exported to other modules
    /[module-2]       # Journey Step Y
      ...
    /shared
      /domain         # Shared value objects (Money, Email, etc.)
      /middleware     # Shared HTTP middleware
```

**Boundary Enforcement**:
- Modules communicate ONLY through public APIs (exported from index.ts)
- No direct imports of internal classes (service, repository, controller)
- Enforce with dependency-cruiser (TypeScript), ArchUnit (Java), Packwerk (Ruby)

**Example Public API**:
```typescript
// /src/modules/documents/index.ts (PUBLIC API)
export { uploadDocument, getDocument, deleteDocument } from './services/DocumentService';

// /src/modules/assessments/controller.ts
import { getDocument } from '@modules/documents'; // ✅ Public API
// import { DocumentRepository } from '@modules/documents/repositories/DocumentRepository'; // ❌ FORBIDDEN - internal implementation
```

**Boundary Enforcement Config** (TypeScript example with dependency-cruiser):
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

**Pros**:
- Enforced boundaries prevent tight coupling
- Single deployment (no distributed complexity)
- Clear ownership (team can own module)
- Can extract to microservice later (module already isolated)

**Cons**:
- More complex than simple monolith (tooling, discipline needed)
- Shared database (modules can't scale independently)
- Must coordinate schema changes across modules

**Evolution Path**:
1. **Start**: Modular Monolith with 2-4 modules (journey step clusters)
2. **Evolve**: Add modules as journey grows, keep boundaries enforced
3. **Extract**: Selective microservices only when needed (independent scaling, different tech stack)

**Microservices Extraction Criteria** (Future):
- Module has 10x different scaling needs (AI processing vs document upload)
- Module needs different tech stack (Python for ML, Node for API)
- Module team is 15+ developers (organizational boundary)
- Module domain is stable 6+ months (won't change frequently)
```

**If Microservices (rare for new journeys):**

```markdown
**⚠️ WARNING: Microservices Anti-Patterns**

Before choosing microservices, validate you're NOT building a **Distributed Monolith**:

**Distributed Monolith Anti-Patterns** (Worst of Both Worlds):
- ❌ Services share database tables (can't deploy independently)
- ❌ Synchronous request chains: Service A → B → C → D (cascading failures)
- ❌ Services require coordinated deployments ("deploy A then B then C")
- ❌ Tight coupling via shared libraries with business logic
- ❌ No bounded contexts - services organized by layers not domains

**If 2+ anti-patterns apply → Choose Modular Monolith instead**

**Structure** (Only if criteria met):
```
services/
├── document-service/
│   ├── src/
│   ├── database/ (dedicated DB)
│   └── Dockerfile
├── assessment-service/
│   ├── src/
│   ├── database/ (dedicated DB)
│   └── Dockerfile
└── report-service/
    └── ...
```

**Microservices Requirements**:
- Operational maturity: Kubernetes, service mesh, distributed tracing, centralized logging
- Team expertise: Distributed systems, eventual consistency, saga patterns
- Observability: OpenTelemetry, metrics aggregation, distributed debugging tools
- Resilience: Circuit breakers, timeouts, retries, bulkheads between services

**Pros**:
- Independent scaling (scale AI service 100x, not entire app)
- Independent deployment (ship document service without assessment service)
- Technology heterogeneity (Python for AI, Go for document processing)

**Cons**:
- Operational complexity (10x harder to debug, deploy, monitor)
- Distributed transactions (saga patterns, eventual consistency)
- Network latency (in-process call → HTTP call adds 10-100ms)
- Data consistency challenges (no ACID across services)

**Journey Connection**: [Explain which journey steps justify distribution costs]
```

**Example (Compliance SaaS)**:

```markdown
### Architectural Style Validation

**Journey Analysis:**
- Journey steps: 4 main steps (Upload → Select Framework → Assess → View Results)
- Database entities: 8 tables (documents, users, frameworks, assessments, results, audit_logs, sessions, integrations)
- Team size: 3 developers (from Session 2a constraints)
- Deployment frequency: Weekly releases (from Session 4 architecture)
- Bounded contexts identified:
  - **Documents Module**: Upload, storage, metadata (Journey Step 1)
  - **Assessments Module**: Framework selection, AI analysis, results (Journey Steps 2-4)
  - **Shared**: User auth, audit logging (cross-cutting)

**Decision Matrix Application:**

| Factor | This Journey | Monolith | Modular Monolith | Microservices |
|--------|--------------|----------|------------------|---------------|
| Team size | 3 engineers | ✅ | ✅ | ❌ |
| Entity count | 8 entities | ✅ | ✅ | ❌ |
| Deployment | Weekly | ✅ | ✅ | ❌ |
| Contexts | 2 clear (Documents, Assessments) | ❌ | ✅ | ~ |
| Ops maturity | Low (new team) | ✅ | ✅ | ❌ |

**Scores**: Monolith (4/5), Modular Monolith (5/5), Microservices (0/5)

**Recommendation**: **Modular Monolith**

**Rationale**:
- Team size (3) suits single deployment - no need for distributed coordination or multiple on-call rotations
- Entity count (8) manageable in one codebase - not overwhelming complexity
- Weekly releases don't justify microservices deployment complexity
- **Key insight**: 2 clear bounded contexts (Documents, Assessments) benefit from module boundaries
  - Documents module isolates file upload/storage concerns
  - Assessments module isolates AI integration complexity
  - Boundaries prevent tight coupling as journey evolves
- Operational maturity is low - team learning product, can't handle distributed systems yet
- **Journey connection**: Users experience simple linear flow (Step 1 → 4), don't need distributed benefits
- **Evolution path**: If AI assessment (Step 3) requires 100x scaling vs upload, extract as microservice later

**Module Structure**:
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
        Money.ts
      /middleware    # Shared HTTP middleware
        authenticate.ts
        rateLimiter.ts
```

**Boundary Enforcement**:
- Documents module cannot import AssessmentService directly
- Must use public API: `import { createAssessment } from '@modules/assessments'`
- Enforced via dependency-cruiser with .dependency-cruiser.js config
- CI/CD fails if boundary violations detected

**Public API Example**:
```typescript
// documents/index.ts (Public API)
export { uploadDocument, getDocument } from './services/DocumentService';

// assessments/services/AssessmentService.ts
import { getDocument } from '@modules/documents'; // ✅ Allowed (public API)
// import { DocumentRepository } from '@modules/documents/repositories/DocumentRepository'; // ❌ FORBIDDEN (internal)

async createAssessment(documentId: string, frameworkId: string): Promise<Assessment> {
  // Fetch document via public API (enforces boundary)
  const document = await getDocument(documentId);
  if (document.status !== 'ready') throw new Error('Document not ready');

  // Assessment logic here...
}
```

**Evolution Path**:
1. **Now**: Modular Monolith (2 modules: Documents, Assessments)
2. **If team grows to 15+**: Consider splitting modules into separate repositories (still monolith, clearer ownership)
3. **If AI assessment becomes bottleneck**: Extract Assessments module as microservice (Python service for ML, Node for API)
4. **If compliance frameworks become marketplace**: Extract Frameworks module as separate service (different scaling, different team)

**What We DIDN'T Choose**:
- **Simple Monolith**: Lost opportunity for module boundaries - as team grows, tight coupling will slow development
- **Microservices**: Massive over-engineering - 3 developers can't manage distributed system, 8 entities don't need distribution
```

**Design Decision:**

```markdown
### Decision: Modular Monolith with Enforced Boundaries

**Decision**: Use Modular Monolith architecture with dependency-cruiser enforcement

**Rationale**:
- Journey has clear bounded contexts (Documents, Assessments) that benefit from isolation
- Team is small (3 developers) - doesn't need distributed system complexity
- Single deployment simplifies operations (no Kubernetes, service mesh)
- Enforced boundaries prevent coupling as journey evolves
- Can extract to microservices later if scaling requires it (modules already isolated)

**Alternative Rejected**: Simple Monolith (no enforced boundaries)
- Risk: Tight coupling emerges as team adds features (DocumentService imports AssessmentRepository directly)
- Cost: Refactoring later is expensive (untangle spaghetti)
- Journey Impact: No immediate user benefit, but technical debt slows future features

**Alternative Rejected**: Microservices
- Over-engineering: 3 developers managing distributed system is unsustainable
- Operational cost: Kubernetes, service mesh, distributed tracing, saga patterns
- Journey Impact: Users don't benefit from distribution (simple linear flow)
- Premature optimization: Extract services later if/when scaling demands it

**Reconsider If**:
- Team grows to 15+ developers (organizational boundaries justify microservices)
- AI assessment requires 100x scaling vs other components
- Different modules need different tech stacks (Python for ML, Go for document processing)
- Bounded contexts stabilize 6+ months (safe to commit to service boundaries)

**Journey Connection**: Modular monolith enables fast iteration (single deployment) while maintaining clean architecture (enforced boundaries) - users benefit from velocity without distribution costs.
```

---

### Step 1.6: Model Domain Layer

**Purpose**: Identify domain entities, value objects, and aggregates from database schema before jumping to services. This prevents the anemic domain model anti-pattern where all business logic lives in services.

**Decision Tree - Domain Pattern Identification:**

```
For each table from Session 7 database schema, ask:

1. Does this concept have identity that persists through state changes?
   - YES → Domain Entity
   - NO → Might be Value Object

2. Is this compared by value (not identity)?
   - YES → Value Object (e.g., Money, EmailAddress)
   - NO → Entity

3. Does this enforce invariants across multiple entities?
   - YES → Aggregate Root
   - NO → Entity within an aggregate

4. Where should business rules live?
   - Complex domain logic → Domain Entity methods
   - Simple CRUD → Repository may suffice
   - Orchestration across entities → Service
```

**Domain Patterns Explained:**

**Entity Pattern**:
- Has unique identity (ID field)
- State can change over time
- Business logic methods (NOT just getters/setters)
- Example: `Order.confirm()`, `Document.markAsProcessed()`

**Value Object Pattern**:
- Immutable (cannot change after creation)
- Compared by value, not identity
- Example: `Money(amount, currency)`, `EmailAddress(value)`

**Aggregate Pattern**:
- Cluster of entities with consistency boundary
- Aggregate Root is entry point for modifications
- Example: `Order` (root) contains `OrderItems` (children)

**For each domain entity from Session 7, define:**

```markdown
### [Entity Name] (Domain Entity)
**Database Table**: [table name from Session 7]
**Identity**: [ID field name and type]
**Journey Step**: [Which journey step does this serve?]
**Business Rules**:
- [Rule 1 traced to journey - e.g., "Cannot confirm empty order (Step 3: Checkout must have items)"]
- [Rule 2 traced to journey]
- [Rule 3 traced to journey]

**Methods** (business logic in domain, NOT services):
- `confirm(): void` - [What this does, why it's here not in service]
- `cancel(): void` - [Business rule it enforces]
- `calculateTotal(): Money` - [Domain calculation]

**Value Objects**: [List value objects this entity uses]
**Is Aggregate Root?**: [Yes/No - if yes, list child entities]
```

**For each value object, define:**

```markdown
### [ValueObject Name] (Value Object)
**Compared By**: [Value comparison - e.g., amount + currency for Money]
**Immutability**: [Explain why immutable]
**Journey Context**: [Where used in journey]

**Example**:
```typescript
class Money {
  constructor(readonly amount: Decimal, readonly currency: string) {}

  add(other: Money): Money {
    if (this.currency !== other.currency) throw new Error("Currency mismatch");
    return new Money(this.amount + other.amount, this.currency);
  }
}
```
```

**Aggregate Boundaries:**

Identify aggregates (consistency boundaries):

```markdown
### [Aggregate Name] (Aggregate Root: [Root Entity])

**Boundary**: [Which entities are inside this consistency boundary?]
**Invariants**: [What rules must always be true across these entities?]
- [Invariant 1 - e.g., "Order total must equal sum of line items"]
- [Invariant 2]

**Child Entities**: [List entities within aggregate that have no identity outside it]
- OrderItem (no identity outside Order)

**Why this boundary?**: [Journey reason - e.g., "User expects atomic checkout (Step 3) - all items or none"]
```

**Clean Architecture Connection:**

Domain entities live in the **innermost layer** with **zero dependencies**:
- ❌ NO framework imports (no Express, FastAPI, NestJS)
- ❌ NO database imports (no Prisma, TypeORM, SQLAlchemy)
- ❌ NO HTTP/REST concepts (no req/res, status codes)
- ✅ ONLY pure business logic and value objects

**Example (Compliance SaaS)**:

```markdown
### Document (Domain Entity - Aggregate Root)
**Database Table**: documents (Session 7)
**Identity**: DocumentId (UUID)
**Journey Step**: Step 1 (Document Upload)

**Business Rules**:
- Cannot assess unprocessed document (Journey Step 3 requires "ready" status)
- Cannot delete document with active assessments (preserves audit trail for Step 4)
- Storage key must be immutable once set (prevents orphaned S3 objects)

**Methods**:
- `markAsReady(): void` - Transitions status from 'processing' to 'ready' after validation passes
- `markAsError(reason: string): void` - Records processing failure for user visibility
- `canBeDeleted(): boolean` - Checks if safe to delete (no active assessments)
- `generateDisplayName(): string` - Business rule for UI display (filename without extension)

**Value Objects**: FileSize, DocumentStatus, StorageKey
**Is Aggregate Root?**: Yes (no child entities, standalone)
**Why Not in Service?**: Status transitions have domain rules (can't go from 'error' to 'ready' directly)

### DocumentStatus (Value Object)
**Values**: 'pending' | 'processing' | 'ready' | 'error' | 'deleted'
**Compared By**: String value
**Immutability**: Status changes create new instance, old state preserved in events
**Journey Context**: Displayed in Step 1 document list, gates Step 3 assessment creation

**Example**:
```typescript
class DocumentStatus {
  private constructor(readonly value: string) {}

  static PENDING = new DocumentStatus('pending');
  static READY = new DocumentStatus('ready');

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

### Assessment (Domain Entity - Aggregate Root)
**Database Table**: assessments (Session 7)
**Identity**: AssessmentId (UUID)
**Journey Step**: Steps 2-3 (Framework Selection → AI Assessment)

**Business Rules**:
- Cannot start assessment on unready document (requires Document.status === 'ready')
- Cannot view results until status === 'completed' (Journey Step 4 dependency)
- Framework must be active (references framework catalog validity)

**Methods**:
- `start(): void` - Validates preconditions, transitions to 'running'
- `complete(results: AssessmentResults): void` - Stores results, transitions to 'completed'
- `fail(error: ErrorDetails): void` - Records failure for retry logic
- `isViewable(): boolean` - Checks if results can be shown to user (Step 4)

**Value Objects**: AssessmentStatus, ComplianceScore
**Is Aggregate Root?**: Yes (Assessment contains AssessmentResults as child value object)

### Aggregates Identified:
1. **Document Aggregate** (Root: Document) - Boundary: Single document, no children
2. **Assessment Aggregate** (Root: Assessment) - Boundary: Assessment + Results (stored together, consistency required)
```

**Design Decisions:**

```markdown
### Decision: Entity vs Service for Business Logic

**Decision**: Business logic lives in domain entities, not services

**Rationale**:
- Entities know their own rules (Order knows when it can be confirmed)
- Services become thin orchestrators (call entity methods, save via repository)
- Testable without database (entity unit tests don't need ORM)
- Journey alignment: Domain entities model real-world concepts users understand

**Anti-Pattern Avoided**: Anemic Domain Model
- Entities with only getters/setters
- All logic in services (OrderService.calculateTotal, not Order.calculateTotal)
- Leads to procedural code, not object-oriented

**Reconsider If**:
- Domain is trivial CRUD (no complex rules)
- Team prefers functional programming over OOP
```

---

### Step 2: Identify Services (Business Logic Layer)

**Purpose**: Services orchestrate domain entities, repositories, and integrations. They do NOT contain business logic—that lives in domain entities (Step 1.6). Services coordinate workflows and manage transactions.

**Decision Tree - Service Identification:**

```
For each journey step or major domain aggregate, ask:

1. Does this require orchestration (not just single entity method)?
   - YES → Create dedicated Service class
   - NO → Direct repository access may suffice (rare)

2. Does this involve multiple entities or external systems?
   - YES → Service coordinates domain entities + repositories + adapters
   - NO → Simple service calling entity methods + single repository

3. What does the service DO?
   - ✅ Fetch entities from repositories
   - ✅ Call domain entity methods (entity.confirm(), entity.calculate())
   - ✅ Save entities via repositories
   - ✅ Coordinate integrations (storage, email, AI)
   - ✅ Manage transactions (Unit of Work pattern)
   - ❌ NOT contain business rules (those live in domain entities)

4. What's the granularity?
   - One service per journey step → Clear boundaries, journey-focused (RECOMMENDED)
   - One service per aggregate → DDD approach, good for complex domains
   - One service per entity → Too granular, avoid unless CRUD-only
```

**Service Patterns**:

**Journey-Driven Services** (Recommended):
- DocumentService (handles journey Step 1: upload, process, store)
- AssessmentService (handles journey Step 2-3: create assessment, run AI analysis)
- ReportService (handles journey Step 4: generate, format, share results)

**Entity-Driven Services** (Alternative):
- DocumentService (CRUD for documents)
- FrameworkService (CRUD for frameworks)
- Each service = thin wrapper around repository (anti-pattern if no business logic)

**Anti-Pattern: Generic "Manager" or "Helper" Services** (Avoid):
- [x] DataManager (what data? what management operations?)
- [x] DocumentHelper (what help? too vague)
- [x] ProcessingManager (what processing? which entities?)
- [✓] DocumentService (handles document lifecycle - clear responsibility)
- [✓] AssessmentService (handles compliance assessment workflow - specific)

**For each service, define**:
- **Responsibility**: What business capability does this service provide?
- **Journey Mapping**: Which journey step(s) does this serve?
- **Dependencies**: What repositories, integrations, or other services does it need?
- **Methods**: What operations does it expose?
  - Method signature (name, parameters, return type)
  - Business rules (validations, constraints, transformations)
  - Journey connection (why does this method exist?)

**Example (showing domain entity orchestration)**:

```markdown
### DocumentService
**Responsibility**: Orchestrate document lifecycle across repositories and storage
**Journey Step**: Step 1 (Document Upload)
**Dependencies**: DocumentRepository, StorageAdapter, Document (domain entity)

**Interface**:
- uploadDocument(userId, file, metadata) → Document
  - Validates file type and size (from API contracts: max 100MB, PDF/DOCX only)
  - Uploads to storage (S3/GCS via StorageAdapter)
  - Creates domain entity: document = Document.create(userId, storageKey, fileSize)
  - Entity business logic: document.markAsProcessing() (validates state transition)
  - Saves via DocumentRepository.save(document)
  - Returns document with signed download URL
  - Journey: Enables Step 1 "Upload compliance document"
  - NOTE: File validation is in service (I/O concern), status transition is in entity (business rule)

- markDocumentReady(documentId, userId) → Document
  - Fetches: document = await DocumentRepository.findById(documentId)
  - Checks ownership (service concern, not domain rule)
  - Entity business logic: document.markAsReady() (enforces 'processing' → 'ready' transition)
  - Saves via DocumentRepository.save(document)
  - Journey: Step 1 processing complete, now available for Step 3 assessment

- deleteDocument(documentId, userId) → void
  - Fetches: document = await DocumentRepository.findById(documentId)
  - Verifies ownership (service concern)
  - Entity business logic: canDelete = document.canBeDeleted() (checks no active assessments)
  - If canDelete: Deletes from StorageAdapter, then document.markAsDeleted()
  - Saves via DocumentRepository.save(document)
  - Journey: Allows cleanup before assessment
  - NOTE: "Can delete?" logic is in entity (business rule), actual storage deletion is service concern

**Design Note**: This service is THIN—it fetches entities, calls their methods, saves them. Business rules live in Document entity (Step 1.6).
```

**Transaction Boundaries:**

For each service method, decide transaction scope to ensure data consistency:

**Decision Tree - Transaction Scope:**

```
For each service method, ask:

1. How many entities/tables are modified?
   - Single entity, single repository → Repository handles transaction (automatic)
   - Multiple entities, same aggregate → Service-level transaction
   - Multiple aggregates, strong consistency needed → Unit of Work pattern
   - Multiple aggregates, eventual consistency OK → Saga pattern or domain events

2. Are there external calls (storage, API, email)?
   - NO external calls → Standard database transaction
   - External call BEFORE database → Simple try/catch, no compensation needed
   - External call AFTER database → Use compensation (rollback external if DB fails)
   - External call DURING database → Use Unit of Work + compensation

3. What happens if operation fails midway?
   - User retries manually → Idempotency required
   - System retries automatically → Compensating actions required
   - Failure is acceptable → No special handling
```

**Transaction Scope Patterns:**

**Pattern 1: Single Repository (Automatic Transaction)**
```typescript
// Simple case - repository handles transaction
async markDocumentReady(documentId: string): Promise<Document> {
  const document = await this.documentRepo.findById(documentId);
  document.markAsReady(); // Domain entity method
  await this.documentRepo.save(document); // Repository transaction
  return document;
}
```

**Pattern 2: Multi-Repository (Unit of Work)**
```typescript
// Multiple entities must be updated atomically
async uploadDocumentAndCreateAssessment(
  userId: string,
  file: Buffer,
  frameworkId: string
): Promise<{ document: Document; assessment: Assessment }> {
  const uow = new UnitOfWork(this.dataSource);

  try {
    await uow.beginTransaction();

    // Step 1: Create document (IN transaction)
    const document = Document.create(userId, file.name, file.size);
    await uow.documentRepository.save(document);

    // Step 2: Create assessment (IN transaction)
    const assessment = Assessment.create(document.id, frameworkId);
    await uow.assessmentRepository.save(assessment);

    await uow.commit();

    return { document, assessment };
  } catch (error) {
    await uow.rollback();
    throw new Error('Failed to create document and assessment');
  }
}
```

**Pattern 3: External Call + Database (Compensation)**
```typescript
// External call (S3) + database write requires compensation
async uploadDocument(userId: string, file: Buffer): Promise<Document> {
  let storageKey: string | null = null;

  try {
    // Step 1: External call (S3 upload) - OUTSIDE transaction, cannot rollback
    const storageObj = await this.storageAdapter.uploadFile(file, generateKey());
    storageKey = storageObj.key;

    // Step 2: Database write (IN transaction)
    const document = Document.create(userId, storageKey, storageObj.size);
    await this.documentRepo.save(document);

    return document;

  } catch (error) {
    // Compensate: Clean up uploaded file if database failed
    if (storageKey) {
      await this.storageAdapter.deleteFile(storageKey).catch(err =>
        this.logger.error('Failed to delete orphaned file', { storageKey, error: err })
      );
    }
    throw error;
  }
}
```

**Pattern 4: Saga Pattern (Eventual Consistency)**
```typescript
// Long-running workflow across multiple aggregates
async processDocumentWorkflow(documentId: string): Promise<void> {
  // Step 1: Mark document as processing
  await this.documentService.markDocumentProcessing(documentId);

  try {
    // Step 2: Extract text (long-running, can fail)
    const text = await this.textExtractionService.extractText(documentId);

    // Step 3: Store extracted text
    await this.documentService.updateDocumentText(documentId, text);

    // Step 4: Create assessment (eventual consistency OK)
    await this.assessmentService.createAssessmentAsync(documentId);

  } catch (error) {
    // Compensate: Mark document as error state
    await this.documentService.markDocumentError(documentId, error.message);
    throw error;
  }
}
```

**For each service method, document:**

```markdown
### [ServiceMethod]

**Transaction Scope**: [Single repository / Multi-repository / External + DB / Saga]
**Consistency Requirement**: [Strong (atomic) / Eventual]
**Compensating Actions**: [What to do if transaction fails after external call]
**Journey Impact**: [What user sees if this operation fails]

**Implementation**:
```typescript
[Pseudocode showing transaction handling]
```

**Failure Scenarios**:
- [Scenario 1]: [What fails] → [User experience]
- [Scenario 2]: [What fails] → [Compensation action]
```

**Example (Compliance SaaS)**:

```markdown
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

**Journey Impact**: User sees upload failure immediately. Can retry without orphaned files in S3. Clean error message: "Upload failed, please try again."

---

### AssessmentService.createAssessmentWithDocument()

**Transaction Scope**: Multi-repository (Unit of Work)
**Consistency Requirement**: Strong (assessment must reference valid document)

**Steps**:
1. Fetch document (validate it exists and is ready)
2. Create assessment record (atomic with document status update)

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

**Journey Impact**: User in Step 3 (Assessment Creation) sees immediate feedback if document isn't ready. Atomic operation ensures no orphaned assessments.
```

**Design Decision:**

```markdown
### Decision: Compensation Over Distributed Transactions

**Decision**: Use compensating actions for external calls (S3, AI API), not distributed transactions (2PC)

**Rationale**:
- External services (S3, OpenAI) don't support 2PC (two-phase commit)
- Compensating actions are simpler (delete S3 file if DB fails)
- Journey tolerates brief inconsistency (file uploaded but not recorded → cleaned up asynchronously)
- User sees atomic behavior (either upload succeeds completely or fails cleanly)

**Alternative Rejected**: Two-Phase Commit (2PC)
- Not supported by S3, OpenAI, most third-party APIs
- Performance overhead (locks held during network calls)
- Brittle (coordinator failure = deadlock)

**Alternative Rejected**: No Compensation
- Orphaned files in S3 (cost accumulation, confuses operations)
- User might retry, see duplicate uploads
- Manual cleanup required

**Reconsider If**:
- All integrations support 2PC (rare)
- Journey can tolerate inconsistency (eventual consistency acceptable)

**Journey Connection**: Users expect upload to be all-or-nothing (Step 1). Compensation ensures clean failures that users can retry safely.
```

---

### Step 3: Model Repositories (Data Access Layer)

**Decision Tree - Repository Pattern:**

```
1. What ORM/database library?
   ├─ ORM with active record (Prisma, TypeORM, SQLAlchemy) → Thin repositories
   │  - Repository is lightweight wrapper around ORM client
   │  - Focus on specialized queries beyond basic CRUD
   │
   ├─ Query builder (Knex, Kysely) → Medium repositories
   │  - Repository builds and executes queries
   │  - Maps raw results to domain models
   │
   └─ Raw SQL (pg, mysql2) → Full repositories
      - Repository handles all SQL construction
      - Complex mapping and transaction management

2. Active Record vs Data Mapper - ORM Pattern Choice:

   **Active Record Pattern**:
   - Domain entity knows how to save/load itself (entity.save(), entity.find())
   - Entity is coupled to database (imports ORM, has persistence methods)
   - Simple, less code (no separate repository layer needed)
   - Harder to test (entity has database dependencies)
   - Example ORMs: Active Record (Rails), Eloquent (Laravel), Django ORM

   **Data Mapper Pattern**:
   - Domain entity is pure (no database knowledge, just business logic)
   - Repository handles all persistence (entity is passed to repository)
   - More code (separate entity + repository classes)
   - Easier to test (entity is just plain object, no database mocking)
   - Better for complex domains (DDD, clean architecture)
   - Example ORMs: TypeORM (Data Mapper mode), Doctrine (PHP), Hibernate (Java)

   **Decision Matrix**:

   | Factor | Active Record | Data Mapper |
   |--------|---------------|-------------|
   | **Entity count** | < 10 entities | > 10 entities |
   | **Domain complexity** | Simple CRUD | Complex business rules |
   | **Testing needs** | Integration tests OK | Heavy unit testing |
   | **Team familiarity** | Framework default | Explicit architecture |
   | **Use case** | Simple apps, MVPs | DDD, clean architecture |

   **Recommendation**:
   - Use **Active Record** if:
     - Entity count < 10 (simple domain)
     - Domain is mostly CRUD operations (little business logic in entities)
     - Team is familiar with framework (Rails, Laravel, Django defaults)
     - Rapid prototyping/MVP (less code to write)

   - Use **Data Mapper** if:
     - Entity count > 10 (complex domain)
     - Rich domain model with business logic in entities (see Step 1.6 Domain Layer)
     - Clean architecture enforced (see Step 7: Hexagonal Architecture)
     - Heavy unit testing without database (pure entity tests)

   **For this journey, choose**:
   ```markdown
   **ORM Pattern**: [Active Record / Data Mapper]

   **Rationale**:
   - Entity count: [X entities from Session 7]
   - Domain complexity: [Simple CRUD / Medium / Complex business rules]
   - Testing strategy: [Integration tests OK / Heavy unit testing required]
   - Journey connection: [How this pattern serves implementation velocity and quality]

   **Trade-offs**:
   - Active Record: Faster development (less code), but couples entities to database (harder to test, violates clean architecture)
   - Data Mapper: Cleaner separation (testable entities), but more code (entity + repository + mapper)
   ```

3. What operations does each entity need?
   ├─ Just CRUD → Base repository with findById, create, update, delete
   ├─ Specialized queries → Add custom methods (findByUserIdWithStatus, etc.)
   └─ Complex aggregations → Add reporting methods

4. Should we use a base repository class?
   ├─ YES → If many entities share patterns (generic CRUD)
   ├─ NO → If repositories are highly specialized
```

**For each repository, define**:
- **Entity**: Which database table/entity does this access?
- **ORM**: What library is used? (from tech stack)
- **Methods**:
  - Core CRUD operations
  - Specialized queries (based on API contracts and journey needs)
  - Query optimizations (references Session 7 indexes)

**Example (with ORM Pattern Decision)**:

```markdown
### ORM Pattern Decision

**Pattern Chosen**: Data Mapper

**Rationale**:
- Entity count: 8 entities (documents, users, frameworks, assessments, results, audit_logs, sessions, integrations)
- Domain complexity: Medium - Entities have business rules (Document status transitions, Assessment validation)
- Testing strategy: Heavy unit testing required (Step 1.6 domain entities have business logic)
- Clean architecture: Enforced (Step 7 - repository interfaces in domain, implementations in infrastructure)
- Journey connection: Domain entities model real-world concepts (Document, Assessment) with behavior that needs testing without database

**Trade-offs Accepted**:
- More code (entity + repository + mapper classes) vs Active Record simplicity
- Benefit: Domain entities testable without database, supports clean architecture (Step 7)

---

### DocumentRepository
**Entity**: documents table (from Session 7)
**ORM**: Prisma (from Session 3)
**Pattern**: Data Mapper (entity is pure, repository handles persistence)

**Interface**:
- create(data: CreateDocumentDto) → Document
  - Inserts new document record
  - Returns created document with generated ID

- findById(id: string) → Document | null
  - Retrieves single document by ID
  - Uses primary key index (from Session 7)

- findByUserId(userId: string, options: ListOptions) → Document[]
  - Retrieves documents for user (ownership filtering)
  - Uses idx_documents_user_id index (from Session 7)
  - Supports pagination, sorting, status filtering

- findByUserIdWithStatus(userId: string, status: DocumentStatus) → Document[]
  - Specialized query for journey Step 1 (show "ready" documents)
  - Uses composite index idx_documents_user_status (from Session 7)

- update(id: string, data: UpdateDocumentDto) → Document
  - Partial update support
  - Returns updated document

- softDelete(id: string) → void
  - Sets status = 'deleted', deleted_at = now()
  - Preserves data for audit trail
```

---

### Step 4: Model Controllers/Handlers (HTTP Layer)

**Decision Tree - Controller Organization:**

```
1. What backend framework?
   ├─ Express/Fastify → Controllers or route handlers
   ├─ NestJS → Controllers with decorators
   ├─ FastAPI → Path operation functions or APIRouter classes
   ├─ Django → ViewSets or APIViews
   └─ Next.js API routes → Route handlers in app/api/[resource]/route.ts

2. How to organize endpoints?
   ├─ One controller per resource → DocumentController, AssessmentController
   ├─ One handler file per resource → routes/documents.ts
   └─ Grouped by feature → features/documents/controller.ts

3. What middleware is needed?
   ├─ Authentication → Applied globally or per-route
   ├─ Validation → Request schema validation
   ├─ Rate limiting → Per-endpoint or per-resource
   └─ Error handling → Global error handler
```

**For each controller/handler, define**:
- **Resource**: What API resource does this handle?
- **Base Path**: What's the route prefix? (from Session 8)
- **Middleware Chain**: What middleware runs before handlers?
- **Endpoints**: Map each API endpoint to handler method
  - HTTP method and path
  - Handler method name
  - Service method it calls
  - Request validation (references Session 8 schemas)
  - Response format (references Session 8 schemas)

**Rate Limiting Strategy:**

For each endpoint, decide rate limiting configuration to prevent abuse and protect resources:

**Decision Tree - Rate Limiting:**

```
For each controller endpoint, ask:

1. What's the resource cost of this operation?
   - High cost (upload, AI processing, bulk operations) → Strict limits (Token Bucket for bursts)
   - Medium cost (list queries, single record reads) → Moderate limits (Sliding Window for smooth limits)
   - Low cost (health checks, static content) → Loose limits or no rate limiting

2. What's the scope of rate limiting?
   - Per-user → Most common (protects per-user resources, prevents single user from overwhelming system)
   - Per-IP → Anonymous endpoints (prevents DDoS from single IP, signup endpoints)
   - Global → Shared resources (external API quotas, database connection pool)

3. What algorithm fits the usage pattern?
   - Bursty operations (file uploads, batch operations) → Token Bucket (allows bursts, refills over time)
   - Steady operations (API queries, data fetching) → Sliding Window (smooth limits, no burst spikes)
```

**Rate Limiting Algorithms:**

**Token Bucket Pattern:**
- Fixed capacity (e.g., 10 tokens)
- Refill rate (e.g., 1 token per minute)
- Allows bursts up to capacity
- Good for: Upload endpoints, batch operations, user actions with natural bursts

**Sliding Window Pattern:**
- Fixed requests per time window (e.g., 100 requests per 5 minutes)
- Smooth limiting (no burst allowed)
- Good for: API queries, list endpoints, steady-state operations

**For each endpoint, document:**

```markdown
### [Endpoint]: [METHOD /path]

**Rate Limiting**:
- **Algorithm**: [Token Bucket / Sliding Window]
- **Scope**: [Per-user / Per-IP / Global]
- **Limits**: [Capacity/refill for Token Bucket OR requests/window for Sliding Window]
- **Rationale**: [Why this limit? Cost analysis, abuse prevention, journey UX]

**Example**:
- Upload endpoint: Token Bucket (10 uploads capacity, refill 1/min), per-user
  - Allows burst of 10 uploads (user might upload multiple documents)
  - Prevents spam (refills slowly at 1/min)
  - Journey: Users typically upload 1-5 documents in burst, then wait
- List endpoint: Sliding Window (100 req/5min), per-user
  - Prevents excessive polling (user refreshing page repeatedly)
  - Allows normal usage (pagination, filtering)
  - Journey: Users browse documents occasionally, not continuously
```

**Example**:

```markdown
### DocumentController
**Resource**: Documents
**Base Path**: /api/documents (from Session 8)
**Middleware**: [authenticate, validateRequest, rateLimitUpload]

**Endpoints**:

#### POST /api/documents (uploadDocument)
- Handler: uploadDocumentHandler(req, res)
- Validates:
  - File present (multipart/form-data)
  - File type (PDF, DOCX from Session 8)
  - File size (max 100MB from Session 8)
- Calls: DocumentService.uploadDocument(req.user.id, req.file, req.body)
- Returns: 201 with document metadata (Session 8 schema)
- Errors: 400 (invalid file), 413 (too large), 422 (business logic), 429 (rate limit exceeded)
- Journey: Implements Step 1 document upload
- **Rate Limiting**:
  - Algorithm: Token Bucket
  - Scope: Per-user
  - Limits: 10 uploads capacity, refill 1 token per minute
  - Rationale: High cost operation (storage, processing). Allows burst of 10 documents (user uploading batch), prevents spam with slow refill. Journey: Users upload 1-5 documents in burst, then wait for processing.

#### GET /api/documents (listDocuments)
- Handler: listDocumentsHandler(req, res)
- Validates: Query params (cursor, limit, status from Session 8)
- Calls: DocumentService.listUserDocuments(req.user.id, req.query)
- Returns: 200 with paginated list (Session 8 pagination format)
- Journey: Lists uploaded documents for selection
- **Rate Limiting**:
  - Algorithm: Sliding Window
  - Scope: Per-user
  - Limits: 100 requests per 5 minutes (20 req/min average)
  - Rationale: Medium cost (database query with pagination). Prevents excessive polling while allowing normal browsing. Journey: Users check document list occasionally, not continuously.

#### GET /api/documents/:id (getDocument)
- Handler: getDocumentHandler(req, res)
- Validates: ID format
- Calls: DocumentService.getDocument(req.params.id, req.user.id)
- Returns: 200 with document, 403 (not owner), 404 (not found)
- Journey: View document details
- **Rate Limiting**:
  - Algorithm: Sliding Window
  - Scope: Per-user
  - Limits: 200 requests per 5 minutes (40 req/min average)
  - Rationale: Low cost (single record fetch by primary key). Generous limit allows viewing details repeatedly. Journey: Users might view same document multiple times during assessment.

#### DELETE /api/documents/:id (deleteDocument)
- Handler: deleteDocumentHandler(req, res)
- Validates: ID format
- Calls: DocumentService.deleteDocument(req.params.id, req.user.id)
- Returns: 204 No Content
- Journey: Remove document before assessment
- **Rate Limiting**:
  - Algorithm: Sliding Window
  - Scope: Per-user
  - Limits: 20 requests per 5 minutes (4 req/min average)
  - Rationale: Destructive operation with compensation cost (S3 cleanup). Lower limit prevents accidental bulk deletion. Journey: Users rarely delete documents (cleanup before uploading corrected version).
```

---

### Step 5: Model Component Architecture (Frontend, if applicable)

**Decision Tree - Component Organization:**

```
1. Does tech stack include frontend?
   ├─ NO → Skip this section
   └─ YES → Model component hierarchy

2. What frontend framework?
   ├─ React/Next.js → Component tree with hooks
   ├─ Vue → Component tree with composables
   ├─ Svelte → Component tree with stores
   └─ Framework-agnostic → Just describe pages and major sections

3. How to organize components?
   ├─ Feature-based → features/documents/DocumentsPage.tsx
   ├─ Layer-based → pages/Documents.tsx + components/DocumentCard.tsx
   └─ Hybrid → pages/Documents.tsx + features/documents/components/

4. What state management?
   ├─ Server state (API data) → React Query, SWR, Apollo
   ├─ Client state (UI) → useState, Zustand, Redux
   └─ URL state → Route params, query strings
```

**For each major page/feature, define**:
- **Route**: What URL path?
- **Journey Step**: What journey step does this serve?
- **Component Tree**: Hierarchical structure
- **State Management**: How data flows (from coding standards)
- **Data Flow**: Fetching, mutations, optimistic updates

**Example**:

```markdown
### DocumentsPage
**Route**: /documents
**Journey Step**: Step 1 (Document Upload Interface)
**State**: React Query for documents list, useState for upload modal

**Component Tree**:
```
DocumentsPage
├── DocumentsHeader
│   ├── PageTitle ("Your Documents")
│   └── UploadButton (triggers modal)
├── DocumentsList
│   ├── DocumentsFilter (status filter)
│   ├── DocumentsGrid
│   │   └── DocumentCard[] (each document)
│   │       ├── DocumentStatus (ready/processing/error)
│   │       ├── DocumentActions (view, delete)
│   │       └── DocumentMetadata (size, date, type)
│   └── DocumentsPagination (cursor-based from Session 8)
└── UploadModal (conditional render)
    ├── FileDropzone (drag-drop + click)
    ├── MetadataForm (optional name, frameworks)
    ├── UploadProgress (during upload)
    └── UploadActions (cancel, upload)
```

**Data Flow**:
- Fetch: useQuery('documents', fetchDocuments) → GET /api/documents
- Upload: useMutation(uploadDocument) → POST /api/documents
  - Optimistic update: Add document to list immediately
  - On success: Invalidate 'documents' query
  - On error: Revert optimistic update, show error toast
- Delete: useMutation(deleteDocument) → DELETE /api/documents/:id
  - Optimistic update: Remove from list
  - On success: Invalidate 'documents' query

**Props & State**:
- DocumentCard props: { document: Document, onDelete: () => void }
- UploadModal state: selectedFile, uploadProgress, error
```

---

### Step 6: Model Integration Adapters (Third-Party Services)

**Decision Tree - Integration Abstraction:**

```
1. Does the journey require external services?
   ├─ NO → Skip this section
   └─ YES → Identify integrations

2. Which services?
   ├─ File storage (S3, GCS, Azure Blob)
   ├─ Email (SendGrid, AWS SES, Postmark)
   ├─ Payments (Stripe, PayPal)
   ├─ Auth providers (Clerk, Auth0, custom)
   ├─ AI/ML (OpenAI, Anthropic, Hugging Face)
   └─ Monitoring (Sentry, DataDog, PostHog)

3. Should we abstract the integration?
   ├─ YES, abstract if:
   │  - Might swap providers (S3 → GCS)
   │  - Used in multiple services
   │  - Complex integration logic
   │
   └─ NO, use directly if:
      - Single use case
      - Provider unlikely to change
      - Simple SDK usage

4. What's the abstraction pattern?
   ├─ Interface/Protocol → Define contract, implement per provider
   ├─ Adapter class → Wraps provider SDK
   └─ Facade → Simplifies complex SDK
```

**For each integration, define**:
- **Purpose**: What capability does this provide?
- **Provider**: What service is used? (from tech stack)
- **Abstraction**: Interface or adapter class
- **Methods**: What operations are exposed?
- **Why Abstract**: Reasoning for abstraction (or why not)

**Example**:

```markdown
### StorageAdapter
**Purpose**: Abstract file storage for documents
**Provider**: AWS S3 (from Session 3 tech stack)
**Why Abstract**: Journey might scale to multi-cloud, or switch providers

**Interface**:
```typescript
interface StorageAdapter {
  uploadFile(file: Buffer, key: string, metadata: object): Promise<StorageObject>
  getSignedUrl(key: string, expiresIn: number): Promise<string>
  deleteFile(key: string): Promise<void>
  listFiles(prefix: string): Promise<StorageObject[]>
}
```

**Implementations**:
- S3StorageAdapter (current)
- GCSStorageAdapter (future, if needed)
- LocalStorageAdapter (dev/testing)

**Usage in DocumentService**:
```typescript
class DocumentService {
  constructor(
    private storage: StorageAdapter,  // Injected
    private documentRepo: DocumentRepository
  ) {}

  async uploadDocument(userId, file, metadata) {
    // Upload to storage
    const storageObj = await this.storage.uploadFile(file, key, metadata);

    // Create DB record
    const doc = await this.documentRepo.create({
      userId,
      storageKey: storageObj.key,
      fileSize: storageObj.size,
      ...
    });

    // Get signed URL for download
    const downloadUrl = await this.storage.getSignedUrl(doc.storageKey, 3600);

    return { ...doc, downloadUrl };
  }
}
```

---

### Step 6.5: Design Cross-Cutting Concerns

**Purpose**: Add production-grade patterns for caching, resilience, messaging reliability, and observability. These concerns span multiple layers and significantly impact performance and operational readiness.

**Decision Tree - Cross-Cutting Concern Selection:**

```
For each concern, ask:

1. CACHING - Is this operation read-heavy?
   - Read/write ratio > 10:1 → Implement caching
   - Frequently accessed, rarely changed → Cache with TTL
   - Real-time critical (payment status, never stale) → Skip caching

2. RESILIENCE - Does this call external services?
   - External API (AI, payment, storage) → Circuit breaker + retry
   - Third-party SaaS → Timeout configuration + fallback
   - Internal service → Depends on architecture (microservices need it)

3. MESSAGING RELIABILITY - Do you publish events?
   - Database write + message publish → Outbox pattern (prevent dual-write problem)
   - Event ordering matters → Sequence numbers or partitioning

4. OBSERVABILITY - Is this production code?
   - All production systems → Structured logging, correlation IDs, metrics
   - Distributed architecture → Distributed tracing (OpenTelemetry)
```

**For each cached operation, define:**

```markdown
### Caching: [Operation Name] (Journey Step X)

**Operation**: [Service.method()]
**Pattern**: [Cache-Aside / Read-Through / Write-Through]
**Rationale**: [Why cache? Read-heavy? Expensive computation? External API cost?]

**Configuration**:
- **Cache key strategy**: `[pattern, e.g., "documents:user:{userId}"]`
- **TTL with jitter**: [Base TTL] ± [jitter %] (prevent thundering herd)
- **Invalidation strategy**: [Write-through / TTL expiration / Manual purge / Event-driven]
- **Multi-level** (optional): L1 in-memory (100μs) → L2 Redis (1-5ms) → Database (10-100ms)

**Pseudocode**:
```typescript
async function getCachedData(key: string): Promise<Data> {
  // Check cache
  const cached = await redis.get(key);
  if (cached) return JSON.parse(cached);

  // Cache miss - fetch from source
  const data = await fetchFromDatabase(key);

  // Store with TTL jitter
  const ttl = 300 + (Math.random() * 60 - 30); // 270-330 seconds
  await redis.setex(key, ttl, JSON.stringify(data));

  return data;
}
```

**Journey Connection**: [Which journey step benefits? How does caching improve UX?]
```

**For each external integration, define:**

```markdown
### Circuit Breaker: [Integration Name] (Journey Step X)

**Integration**: [External service - OpenAI API, Stripe, AWS S3]
**Pattern**: Circuit Breaker + Retry with Exponential Backoff
**Rationale**: [Why resilience needed? External API can fail, rate limits, outages?]

**Configuration**:
- **Failure threshold**: [e.g., 50% failure rate over 10 requests]
- **Wait duration**: [e.g., 60 seconds in OPEN state]
- **Half-open test**: [e.g., 3 requests before closing circuit]
- **Retry strategy**:
  - Max retries: [e.g., 3]
  - Backoff: [e.g., 100ms, 200ms, 400ms exponential]
  - Only retry transient failures (network errors, 5xx, rate limits)
- **Timeout configuration**:
  - Connection timeout: [e.g., 5 seconds]
  - Request timeout: [e.g., 30 seconds]
- **Fallback**: [What happens when circuit is OPEN? Return cached data? Queue for later? Return error?]

**Metrics** (for observability):
- `[service]_circuit_breaker_state` (closed/open/half-open)
- `[service]_request_duration_seconds` (p50, p95, p99)
- `[service]_failure_rate` (percentage)

**Pseudocode**:
```typescript
class CircuitBreaker {
  constructor(
    private failureThreshold = 0.5,
    private waitDuration = 60000,
    private halfOpenRequests = 3
  ) {}

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureTime >= this.waitDuration) {
        this.state = 'HALF_OPEN';
      } else {
        throw new Error('Circuit breaker OPEN');
      }
    }

    try {
      const result = await this.retryWithBackoff(fn);
      this.recordSuccess();
      return result;
    } catch (error) {
      this.recordFailure();
      throw error;
    }
  }

  private async retryWithBackoff<T>(fn: () => Promise<T>): Promise<T> {
    for (let i = 0; i < 3; i++) {
      try {
        return await fn();
      } catch (error) {
        if (!this.isTransient(error) || i === 2) throw error;
        await this.delay(100 * Math.pow(2, i)); // 100ms, 200ms, 400ms
      }
    }
  }
}
```

**Journey Connection**: [Which journey step depends on this? What user experience is preserved by fallback?]
```

**For event-driven systems, define:**

```markdown
### Outbox Pattern: [Event Publishing]

**Problem**: Dual-write problem - database write succeeds, message publish fails → inconsistency
**Solution**: Outbox pattern - write entity + event to outbox table in same transaction

**Implementation**:

1. **Outbox Table** (add to Session 7 schema if not present):
```sql
CREATE TABLE outbox_events (
  id UUID PRIMARY KEY,
  aggregate_type VARCHAR(50) NOT NULL,
  aggregate_id UUID NOT NULL,
  event_type VARCHAR(100) NOT NULL,
  payload JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  processed BOOLEAN DEFAULT FALSE,
  processed_at TIMESTAMP
);
CREATE INDEX idx_outbox_unprocessed ON outbox_events(processed, created_at) WHERE NOT processed;
```

2. **Service writes to outbox**:
```typescript
@Transactional
async createOrder(orderData: OrderData): Promise<Order> {
  // Save business entity
  const order = await this.orderRepo.save(new Order(orderData));

  // Save event to outbox (same transaction)
  await this.outboxRepo.save({
    aggregateType: 'Order',
    aggregateId: order.id,
    eventType: 'OrderCreated',
    payload: JSON.stringify(order),
    processed: false
  });

  return order;
}
```

3. **Background processor publishes from outbox**:
```typescript
@Scheduled(fixedDelay = 1000)
async processOutbox(): Promise<void> {
  const events = await this.outboxRepo.findUnprocessed();

  for (const event of events) {
    try {
      await this.messageBus.publish(event.eventType, event.payload);
      event.processed = true;
      event.processedAt = new Date();
      await this.outboxRepo.save(event);
    } catch (error) {
      // Log error, retry on next cycle
      this.logger.error('Failed to publish event', { event, error });
    }
  }
}
```

**Journey Connection**: [Which journey flows produce events? Why is reliability critical?]
```

**For all services, define observability:**

```markdown
### Observability Strategy

**Structured Logging**:
- **Format**: JSON logs with timestamp, level, service, correlation_id, user_id, message, context
- **Levels**: ERROR (failures), WARN (degraded), INFO (key events), DEBUG (development only)
- **What to log**:
  - Request start/end with duration
  - External service calls with latency
  - Business events (order confirmed, document uploaded)
  - Errors with stack traces + context

**Example**:
```typescript
logger.info('Document uploaded', {
  correlationId: req.correlationId,
  userId: req.user.id,
  documentId: document.id,
  fileSize: document.fileSize,
  duration: Date.now() - startTime
});
```

**Correlation IDs**:
- Generate UUID per request (middleware generates, attaches to req object)
- Propagate through all service layers (pass to repository, adapter calls)
- Include in all logs (enables trace reconstruction)
- Pass to external services via HTTP headers (`X-Correlation-ID`)

**Distributed Tracing** (if microservices):
- Instrument with OpenTelemetry
- Trace spans: HTTP request → Service method → Repository query → External API call
- Attributes: service.name, http.method, http.status_code, db.statement

**Metrics** (key metrics for dashboards/alerts):
- **Cache metrics**: hit rate, miss rate, eviction rate
- **Circuit breaker metrics**: state (closed/open/half-open), failure rate
- **Request metrics**: request count, duration (p50, p95, p99), error rate
- **Business metrics**: documents uploaded, assessments completed (from Session 4 metrics)

**Journey Connection**: [How do metrics map to Session 4 L0/L1/L2/L3 metrics?]
```

**Example (Compliance SaaS)**:

```markdown
### Caching: Document List (Journey Step 1)

**Operation**: `DocumentService.listUserDocuments(userId)`
**Pattern**: Cache-Aside
**Rationale**: Read-heavy - users view document list 10x more than upload

**Configuration**:
- Cache key: `documents:user:{userId}:status:{status}`
- TTL: 300 seconds (5 minutes) ± 30 seconds jitter
- Invalidation: On document upload/delete, invalidate user's cache
- Storage: Redis (L2 cache)

**Pseudocode** (shown above)

**Journey Connection**: Step 1 - Users refresh document list frequently while waiting for processing. Caching reduces database load and improves perceived performance.

---

### Circuit Breaker: AI Assessment API (Journey Step 3)

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
- `ai_api_circuit_breaker_state`
- `ai_api_request_duration_seconds`
- `ai_api_failure_rate`

**Journey Connection**: Step 3 - AI assessment is critical but external. Circuit breaker prevents cascading failures. Fallback (queue for later) preserves UX when API is down.

---

### Outbox Pattern: Assessment Events

**Problem**: Assessment completed → publish event for notifications → event lost if publish fails
**Solution**: Outbox pattern ensures event is eventually published

**Implementation** (shown above)

**Journey Connection**: Step 4 - Users expect notification when assessment completes. Outbox ensures event isn't lost even if notification service is temporarily down.

---

### Observability: All Services

**Structured Logging**: JSON format with correlation IDs
**Correlation IDs**: Generated per request, propagated through all layers
**Metrics**:
- Cache hit rate for document list: target >80%
- AI API p95 latency: target <5 seconds
- Document upload success rate: target >99%
- Maps to Session 4 L2 metrics: "Time to assessment" (performance)

**Journey Connection**: Observability enables tracking Session 4 metrics and debugging production issues without disrupting users.
```

**Design Decisions:**

```markdown
### Decision: Caching Strategy

**Decision**: Cache-Aside pattern with Redis for read-heavy operations

**Rationale**:
- Journey has asymmetric read/write (document list viewed 10x more than updated)
- Cache-Aside is simple, battle-tested, handles cache failures gracefully
- Redis provides distributed cache (multiple app instances share cache)

**Alternative Rejected**: Write-Through
- Higher write latency (sequential write to DB + cache)
- Journey is read-optimized, write latency less critical

**Reconsider If**: Write latency becomes critical, or need strong read-after-write consistency

---

### Decision: Circuit Breaker for External APIs Only

**Decision**: Implement circuit breakers only for external integrations (AI API, Storage), not internal services

**Rationale**:
- Monolithic/modular monolith architecture (Session 4) - internal calls are in-process, reliable
- External APIs have unpredictable failure modes (rate limits, outages)
- Circuit breakers add complexity - use only where needed

**Alternative Rejected**: Circuit breakers everywhere
- Over-engineering for in-process calls
- Adds latency and complexity without benefit

**Reconsider If**: Migrate to microservices - then circuit breakers needed between services
```

---

### Step 7: Document Architecture Decisions

**For each major architectural decision, document**:

```markdown
## Architecture Decisions

### 0. Clean Architecture Enforcement (Hexagonal Architecture / Ports & Adapters)

**Decision**: Enforce Hexagonal Architecture with dependency inversion and layer separation

**Rationale**:
- Domain layer stays pure (no framework/database imports) → testable without infrastructure
- Application layer (services) orchestrates use cases
- Infrastructure layer (repositories, adapters) implements technical details
- Ports (interfaces) defined in domain, adapters (implementations) in infrastructure
- Enables technology swaps (change database, framework) without changing domain logic
- Journey connection: Domain entities model real-world concepts users understand (Step 1.6)

**Layer Responsibilities**:

| Layer | Contains | Can Import | Cannot Import |
|-------|----------|------------|---------------|
| **Domain** | Entities, Value Objects, Aggregates, Domain Events | Nothing (pure) | Framework, Database, HTTP |
| **Application** | Services, Use Cases | Domain | Infrastructure, Controllers |
| **Infrastructure** | Repository Impls, Adapters | Domain, Application | Controllers |
| **Controllers** | HTTP handlers, GraphQL resolvers | Application | Domain (must go through services) |

**Dependency Rules (Critical)**:
1. Domain layer has **zero dependencies** - pure business logic
2. Application depends on domain interfaces
3. Infrastructure implements domain interfaces (dependency inversion)
4. Controllers depend on application services (NOT repositories directly)
5. All dependencies flow INWARD toward domain

**Enforcement Pattern - Repository Interfaces in Domain**:

```typescript
// domain/repositories/IOrderRepository.ts (INTERFACE in domain)
export interface IOrderRepository {
  findById(id: OrderId): Promise<Order | null>;
  save(order: Order): Promise<void>;
}

// infrastructure/repositories/PrismaOrderRepository.ts (IMPLEMENTATION in infrastructure)
import { IOrderRepository } from '@domain/repositories/IOrderRepository';
import { PrismaClient } from '@prisma/client';

export class PrismaOrderRepository implements IOrderRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: OrderId): Promise<Order | null> {
    const row = await this.prisma.order.findUnique({ where: { id: id.value } });
    return row ? OrderMapper.toDomain(row) : null;
  }

  async save(order: Order): Promise<void> {
    const data = OrderMapper.toPersistence(order);
    await this.prisma.order.upsert({
      where: { id: order.id.value },
      update: data,
      create: data
    });
  }
}
```

**Services Depend on Interfaces (Dependency Inversion)**:

```typescript
// application/services/OrderService.ts
import { IOrderRepository } from '@domain/repositories/IOrderRepository';
import { Order } from '@domain/entities/Order';

export class OrderService {
  constructor(private orderRepo: IOrderRepository) {}  // Interface, not Prisma implementation!

  async confirmOrder(orderId: OrderId): Promise<void> {
    const order = await this.orderRepo.findById(orderId);
    if (!order) throw new Error('Order not found');

    order.confirm();  // Business logic in domain entity (Step 1.6)

    await this.orderRepo.save(order);
  }
}
```

**Testing Benefits**:

```typescript
// tests/services/OrderService.test.ts
class MockOrderRepository implements IOrderRepository {
  private orders = new Map<string, Order>();

  async findById(id: OrderId): Promise<Order | null> {
    return this.orders.get(id.value) ?? null;
  }

  async save(order: Order): Promise<void> {
    this.orders.set(order.id.value, order);
  }
}

describe('OrderService', () => {
  it('confirms order and saves', async () => {
    const mockRepo = new MockOrderRepository();
    const service = new OrderService(mockRepo);

    // Test without database - just domain logic + mock
    await service.confirmOrder(orderId);
    // Assertions...
  });
});
```

**Directory Structure (Hexagonal Architecture)**:

```
src/
├── domain/                      # Core business logic (zero dependencies)
│   ├── entities/
│   │   ├── Order.ts             # Domain entity with business methods
│   │   └── Document.ts
│   ├── value-objects/
│   │   ├── Money.ts
│   │   └── DocumentStatus.ts
│   ├── repositories/            # Repository INTERFACES (ports)
│   │   ├── IOrderRepository.ts
│   │   └── IDocumentRepository.ts
│   └── events/
│       └── OrderCreatedEvent.ts
├── application/                 # Use cases and orchestration
│   └── services/
│       ├── OrderService.ts      # Depends on domain interfaces
│       └── DocumentService.ts
├── infrastructure/              # Technical implementations (adapters)
│   ├── repositories/
│   │   ├── PrismaOrderRepository.ts   # Implements IOrderRepository
│   │   └── PrismaDocumentRepository.ts
│   ├── integrations/
│   │   ├── S3StorageAdapter.ts
│   │   └── OpenAIAdapter.ts
│   └── mappers/                 # ORM ↔ Domain entity conversion
│       └── OrderMapper.ts
└── controllers/                 # HTTP/API layer
    ├── OrderController.ts       # Depends on OrderService
    └── DocumentController.ts
```

**Alternative Rejected**: Direct repository imports in services (no interfaces)
- Couples application to specific ORM (Prisma, TypeORM)
- Cannot swap database without changing service code
- Tests require database or complex mocking
- Violates dependency inversion principle

**Reconsider If**:
- Team < 3 developers AND domain is trivial CRUD (over-engineering risk)
- Framework enforces different architecture (Rails Active Record, Django ORM)
- Journey has NO complex business rules (pure CRUD operations)

**Journey Connection**:
- Clean architecture enables Session 12 scaffold to generate domain-first code
- Domain entities model user journey concepts (Document, Assessment from Step 1-4)
- Testability enables confidence when implementing Session 10 backlog stories

---

### X. Dependency Injection Configuration

**Decision**: Framework-specific DI container with constructor injection pattern

**Rationale**:
- Constructor injection makes dependencies explicit (service requires repository, adapter)
- Enables testing (inject mocks instead of real implementations)
- Framework DI container handles lifecycle (singleton services, scoped repositories)
- Journey connection: Clean dependency graph enables Session 12 to generate wiring code

**Framework-Specific Patterns**:

**NestJS (TypeScript)**:
```typescript
// app.module.ts - DI container setup
@Module({
  providers: [
    DocumentService,  // Auto-wired via @Injectable() decorator
    {
      provide: 'IDocumentRepository',  // Interface token
      useClass: PrismaDocumentRepository  // Implementation
    },
    {
      provide: 'StorageAdapter',
      useFactory: (config: ConfigService) => {
        return config.get('STORAGE_PROVIDER') === 's3'
          ? new S3StorageAdapter(config.get('AWS_CONFIG'))
          : new LocalStorageAdapter(config.get('LOCAL_STORAGE_PATH'));
      },
      inject: [ConfigService]
    }
  ]
})
export class AppModule {}

// Document service with constructor injection
@Injectable()
export class DocumentService {
  constructor(
    @Inject('IDocumentRepository') private repo: IDocumentRepository,
    @Inject('StorageAdapter') private storage: StorageAdapter
  ) {}
}
```

**FastAPI (Python)**:
```python
# dependencies.py - DI container setup
from fastapi import Depends
from typing import Annotated

def get_document_repo() -> IDocumentRepository:
    return PrismaDocumentRepository(get_db())

def get_storage_adapter() -> StorageAdapter:
    if settings.STORAGE_PROVIDER == 's3':
        return S3StorageAdapter(settings.AWS_CONFIG)
    return LocalStorageAdapter(settings.LOCAL_STORAGE_PATH)

# Document service with dependency injection
class DocumentService:
    def __init__(
        self,
        repo: Annotated[IDocumentRepository, Depends(get_document_repo)],
        storage: Annotated[StorageAdapter, Depends(get_storage_adapter)]
    ):
        self.repo = repo
        self.storage = storage

# Controller using service
@app.post("/api/documents")
async def upload_document(
    file: UploadFile,
    service: Annotated[DocumentService, Depends()]
):
    return await service.upload_document(file)
```

**Express (TypeScript with tsyringe/InversifyJS)**:
```typescript
// container.ts - DI container setup
import { container } from 'tsyringe';

// Register implementations
container.register<IDocumentRepository>('IDocumentRepository', {
  useClass: PrismaDocumentRepository
});

container.register<StorageAdapter>('StorageAdapter', {
  useFactory: (c) => {
    const config = c.resolve<ConfigService>('ConfigService');
    return config.get('STORAGE_PROVIDER') === 's3'
      ? new S3StorageAdapter(config.get('AWS_CONFIG'))
      : new LocalStorageAdapter(config.get('LOCAL_STORAGE_PATH'));
  }
});

// Document service with constructor injection
@injectable()
class DocumentService {
  constructor(
    @inject('IDocumentRepository') private repo: IDocumentRepository,
    @inject('StorageAdapter') private storage: StorageAdapter
  ) {}
}

// Controller using service
const documentController = container.resolve(DocumentController);
app.post('/api/documents', documentController.upload.bind(documentController));
```

**Configuration Management**:

**Hierarchy** (environment-specific overrides):
1. **Defaults** (hardcoded in code for local development)
2. **Environment variables** (override defaults, set in .env file or container env)
3. **Secrets** (override env vars, fetched from vault/secrets manager)

**Configuration Service**:
```typescript
@Injectable()
export class ConfigService {
  constructor(
    private defaults: DefaultConfig,
    private envVars: NodeJS.ProcessEnv,
    private secretsProvider: SecretsProvider  // Vault, AWS Secrets Manager
  ) {}

  async get(key: string): Promise<string> {
    // Priority: Secrets > Env Vars > Defaults
    const secretValue = await this.secretsProvider.get(key);
    if (secretValue) return secretValue;

    const envValue = this.envVars[key];
    if (envValue) return envValue;

    const defaultValue = this.defaults[key];
    if (defaultValue) return defaultValue;

    throw new Error(`Configuration key not found: ${key}`);
  }
}
```

**Secrets Management**:

**Development**: `.env` file (gitignored, not committed)
```
DATABASE_URL=postgresql://localhost:5432/dev
AWS_ACCESS_KEY_ID=dev_key
AWS_SECRET_ACCESS_KEY=dev_secret
```

**Production Options**:

1. **HashiCorp Vault**:
```typescript
class VaultSecretsProvider implements SecretsProvider {
  async get(key: string): Promise<string | null> {
    const response = await this.vaultClient.read(`secret/data/${key}`);
    return response.data.data.value;
  }
}
```

2. **AWS Secrets Manager**:
```typescript
class AWSSecretsProvider implements SecretsProvider {
  async get(key: string): Promise<string | null> {
    const response = await this.secretsManager.getSecretValue({ SecretId: key });
    return response.SecretString;
  }
}
```

3. **Environment Variables** (Kubernetes secrets, Docker secrets):
```yaml
# kubernetes-deployment.yaml
env:
  - name: DATABASE_URL
    valueFrom:
      secretKeyRef:
        name: app-secrets
        key: database-url
```

**Testability Pattern**:

```typescript
// Unit test - inject mocks
describe('DocumentService', () => {
  it('uploads document', async () => {
    const mockRepo = createMock<IDocumentRepository>();
    const mockStorage = createMock<StorageAdapter>();
    const service = new DocumentService(mockRepo, mockStorage);

    // Test without real database or S3
    await service.uploadDocument(userId, file);

    expect(mockStorage.uploadFile).toHaveBeenCalled();
    expect(mockRepo.save).toHaveBeenCalled();
  });
});

// Integration test - inject real repo, mock external services
describe('DocumentService Integration', () => {
  let service: DocumentService;
  let repo: IDocumentRepository;

  beforeEach(async () => {
    repo = new PrismaDocumentRepository(testDb);  // Real repository with test database
    const mockStorage = createMock<StorageAdapter>();  // Mock S3
    service = new DocumentService(repo, mockStorage);
  });

  it('saves document to database', async () => {
    await service.uploadDocument(userId, file);
    const saved = await repo.findById(documentId);
    expect(saved).toBeDefined();
  });
});
```

**Design Decisions**:

**Why Constructor Injection**:
- Dependencies explicit in constructor signature
- Compile-time errors if dependencies missing (TypeScript)
- Easier to test (pass mocks to constructor)
- Immutable dependencies (set once in constructor, can't change)

**Alternative Rejected**: Property Injection
- Dependencies hidden (not in constructor signature)
- Can be changed after construction (mutable state)
- Runtime errors if dependencies missing

**Alternative Rejected**: Service Locator Pattern
- Global registry of services (tight coupling)
- Hard to test (global state)
- Dependencies hidden (called inside methods, not constructor)

**Reconsider If**:
- Framework doesn't support DI (legacy codebase)
- Circular dependencies force property injection
- Team prefers functional programming over OOP (use function parameters instead)

**Journey Connection**: DI configuration enables Session 12 to generate wiring code that connects services, repositories, and adapters. Clean dependency graph enables Session 10 backlog stories to reference specific service methods.

---

### 1. Service Granularity
**Decision**: One service per journey step (not per entity)
**Rationale**:
- Clear boundaries aligned with user value
- Easier to test and reason about
- Services orchestrate multiple repositories as needed
**Alternative Rejected**: One service per entity
- Would create too many small services with minimal logic
- Harder to see journey flow in code
**Reconsider If**: Domain becomes significantly more complex (100+ entities)

### 2. Data Access Pattern
**Decision**: Repository pattern with Prisma ORM
**Rationale**:
- Type safety from Prisma-generated types
- Query builder flexibility for complex queries
- Testable (can mock repositories in service tests)
**Alternative Rejected**: Active Record pattern
- Couples domain models to database
- Harder to test (models have DB dependencies)
**Reconsider If**: Need to support multiple databases simultaneously

### 3. Component Organization
**Decision**: Feature-based structure (not layer-based)
**Rationale**:
- Collocates related components, hooks, utils
- Scales better as features grow
- Matches journey step organization
**Alternative Rejected**: Layer-based (all components/, all hooks/)
- Poor cohesion (related code scattered)
- Harder to find code for a feature
**Reconsider If**: Team < 3 people (simpler structure may suffice)

### 4. State Management
**Decision**: React Query for server state, useState for UI state
**Rationale**:
- React Query handles caching, invalidation, optimistic updates
- No need for Redux complexity for this journey
- Keeps server and UI state separate
**Alternative Rejected**: Redux Toolkit
- Over-engineering for CRUD operations
- More boilerplate for simple data fetching
**Reconsider If**: Complex client-side state machines, offline support needed
```

---

### Step 8: Create Dependency Graph

Visualize how architectural layers depend on each other:

```markdown
## Dependency Graph

```
Controller/Handler Layer
  ├─> Service Layer
  │     ├─> Repository Layer
  │     │     └─> Database
  │     └─> Integration Adapters
  │           └─> External Services
  └─> Validation/Middleware
```

**Dependency Rules**:
- Controllers depend on Services (not Repositories directly)
- Services depend on Repositories and Adapters
- Repositories depend only on database client
- No circular dependencies
- All dependencies injected (not hardcoded)

**Example: Document Upload Flow**
```
POST /api/documents
  ↓ [middleware: authenticate, validateMultipart, rateLimitUpload]
DocumentController.uploadDocumentHandler()
  ↓
DocumentService.uploadDocument()
  ├─> StorageAdapter.uploadFile() → S3
  └─> DocumentRepository.create() → Prisma → PostgreSQL
  ↓
Return 201 with Document (includes signed URL)
```
```

---

### Step 9: Generate Output Files

Use templates:
- `/templates/09b-application-architecture-template.md` for full version

First, write the full version to `product-guidelines/09b-application-architecture.md`:

**Full version includes**:
- Journey mapping (services to journey steps)
- Service layer (responsibilities, methods, business rules)
- Repository layer (entities, methods, query optimizations)
- Controller/handler layer (endpoints, middleware, validations)
- Component architecture (pages, component tree, state management)
- Integration adapters (abstractions, implementations)
- Architecture decisions (what/why/alternatives)
- Dependency graph (visual and textual)

Then, invoke the distillation sub-agent to create the context file:

```bash
Task tool with:
- subagent_type: distill-context
- Source file: product-guidelines/09b-application-architecture.md
- Output file: product-guidelines/09b-application-architecture.ctx.md
```

**Context version includes** (for backlog generation, ~60% smaller):
- Service list with method signatures only
- Repository list with key methods
- Controller endpoint mappings
- Component hierarchy (no props/state details)
- Key architecture decisions (1-2 sentences each)
- **Excludes**: Business rules details, implementation notes, examples, decision rationale

---

### Step 10: Validate Architecture Quality

**Quality Checklist**:

**Journey Alignment**:
- [ ] Every service maps to specific journey step(s)
- [ ] Every controller endpoint implements API contract from Session 8
- [ ] Every repository corresponds to entity from Session 7
- [ ] No services/controllers/components that don't serve journey

**Completeness**:
- [ ] All journey steps have corresponding services
- [ ] All API endpoints have controller handlers
- [ ] All database entities have repositories
- [ ] All third-party integrations have adapters or usage notes

**Consistency**:
- [ ] Naming follows coding standards (Session 3b)
- [ ] Dependency injection pattern consistent across services
- [ ] Error handling approach consistent
- [ ] All services have same structure (responsibility, dependencies, methods)

**Tech Stack Alignment**:
- [ ] Framework patterns match tech stack choice (NestJS decorators, FastAPI dependency injection, etc.)
- [ ] ORM usage matches database library from Session 3
- [ ] State management matches coding standards from Session 3b
- [ ] Component organization matches framework conventions

**Enablement for Future Sessions**:
- [ ] Session 10 can reference specific services/methods in backlog stories
- [ ] Session 12 can generate code skeletons from service/repository signatures
- [ ] Architecture decisions explain reasoning for implementation choices

---

## What We DIDN'T Choose (And Why)

### Hexagonal Architecture (Ports & Adapters)
**What**: Strict separation of domain, application, and infrastructure layers with port/adapter pattern
**Why not**: Over-engineering for current journey complexity (4 main steps, ~8 entities)
- High upfront cost (define ports for everything)
- Team learning curve (unfamiliar pattern)
- Journey is straightforward CRUD + AI processing (not complex domain logic)
**Reconsider if**:
- Team > 10 developers (boundaries prevent conflicts)
- Complex business rules emerge (100+ business logic classes)
- Need to swap entire infrastructure layer (e.g., migrating cloud providers)

### Event-Driven Architecture
**What**: Services communicate via events (uploaded document → event → trigger assessment)
**Why not**: Journey is primarily request-response, not reactive
- No need for real-time updates across services (polling is acceptable for Step 3 status)
- Added complexity (event bus, message ordering, eventual consistency)
- Harder to debug (trace events across services)
**Reconsider if**:
- Real-time collaboration needed (multiple users watching same assessment)
- Need to decouple services (microservices architecture)
- Audit log is critical (events provide immutable history)

### Microservices Architecture
**What**: Separate services for documents, assessments, reports (each with own database)
**Why not**: Journey doesn't warrant operational overhead
- Shared data model (documents, assessments, frameworks are tightly coupled)
- Small team (1-5 developers can manage monolith)
- No independent scaling needs (all journey steps have similar load)
- Distributed transaction complexity (upload document + create assessment = 2 services?)
**Reconsider if**:
- Team > 15 developers (organizational boundaries)
- Need to scale components independently (AI processing is 100x load of document upload)
- Different tech stacks per component (Python for AI, Node for API)

### CQRS (Command Query Responsibility Segregation)
**What**: Separate models for writes (commands) and reads (queries)
**Why not**: Read and write patterns are similar
- No heavy read optimization needed (not serving millions of queries)
- Journey has balanced read/write (upload → assess → view results)
- Added complexity (sync read model with write model)
**Reconsider if**:
- Read patterns vastly different from write (dashboards with complex aggregations)
- Event sourcing needed (replay events to rebuild state)
- Extreme read scalability required (read replicas + CQRS read model)

### GraphQL API Layer
**What**: Add GraphQL layer on top of REST API for flexible data fetching
**Why not**: Journey has fixed UI requirements (not flexible/dynamic)
- API contracts from Session 8 already fit UI needs (no over-fetching problem)
- Team knows REST better (GraphQL has learning curve)
- Added layer = more complexity (REST → GraphQL → Services)
**Reconsider if**:
- Mobile app needs bandwidth optimization (fetch only needed fields)
- Many UI variations (admin vs user vs mobile each need different data shapes)
- Clients want to explore API programmatically

---

## Output Files

1. **`product-guidelines/09b-application-architecture.md`**: Full documentation (600-800 lines)
   - Complete service/repository/controller definitions
   - Business rules and journey mappings
   - Component architecture with props/state
   - Detailed architecture decisions with alternatives

2. **`product-guidelines/09b-application-architecture.ctx.md`**: Condensed for backlog (200-300 lines, ~60% reduction)
   - Service list with method signatures
   - Repository list with key methods
   - Controller endpoint mappings
   - Component hierarchy (no implementation details)
   - Brief architecture decisions (1-2 sentences each)

---

## Quality Validation

Before completing, verify:

**Journey Alignment**:
- [ ] Every service references specific journey step(s) in its documentation
- [ ] All journey steps have corresponding application components
- [ ] No architecture elements exist that don't serve journey

**Enablement**:
- [ ] Session 10 can create specific stories like "Implement DocumentService.uploadDocument()"
- [ ] Session 12 can generate code files with method signatures from this architecture
- [ ] Acceptance criteria in Session 10 can reference architecture layers ("DocumentRepository.create() called")

**Completeness**:
- [ ] All API endpoints from Session 8 have controller methods
- [ ] All database entities from Session 7 have repositories
- [ ] All third-party services from tech stack have integration notes
- [ ] Frontend pages map to journey steps (if applicable)

**Architecture Quality**:
- [ ] Dependency graph has no circular dependencies
- [ ] Each layer has single responsibility
- [ ] Service methods include business rules from journey
- [ ] Integration adapters properly abstract third-party services

**Documentation**:
- [ ] "What We DIDN'T Choose" section has 3+ alternatives with reasoning
- [ ] Each service has clear responsibility statement
- [ ] Dependency injection approach is documented
- [ ] Context file is ~60% size of full file

---

## After This Session

**Next Steps**:
```
[✓] Session 9b complete! Application architecture modeled.

Your architecture bridges the gap between specifications and implementation:
- Services: [Count] services mapped to journey steps
- Repositories: [Count] repositories for database entities
- Controllers: [Count] controllers implementing API endpoints
- Components: [Count] page components (if frontend)

This architecture enables:
- Session 10: Specific backlog stories ("Implement XService.method()")
- Session 12: Code skeleton generation with method signatures

Files created:
- product-guidelines/09b-application-architecture.md
- product-guidelines/09b-application-architecture.ctx.md

Next, we'll generate your product backlog.

When ready, run: /generate-backlog
Or check progress: /cascade-status
```

---

## Reference

- Template: `/templates/09b-application-architecture-template.md`
- Example: `/examples/compliance-saas/09b-application-architecture.md`

---

**Now, read previous outputs and model the application architecture that implements your user journey!**

## After Generating Application Architecture Document

Once you've written `product-guidelines/09b-application-architecture.md`, invoke the distillation agent to create a context file:

Use the Task tool:
- **subagent_type**: `general-purpose`
- **description**: `Generate application architecture context file`
- **prompt**:
  ```
  Invoke the context distillation agent to create token-optimized context file.

  Source file: product-guidelines/09b-application-architecture.md
  Output file: product-guidelines/09b-application-architecture.ctx.md

  Follow the distillation agent specification in .claude/agents/distill-context.md to:
  1. Extract ALL service/repository/controller class structures and methods (CRITICAL)
  2. Extract component architecture and integration adapters
  3. Remove detailed implementation patterns, code examples, architecture rationale
  4. Preserve section structure from source file
  5. Achieve 60-70% token reduction
  6. Add source reference header
  7. Write to output file path
  ```

## Output Format

IMPORTANT: Do not use emojis in generated outputs. Use plain text for all communication.
