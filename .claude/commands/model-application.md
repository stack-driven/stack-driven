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
Read: product-guidelines/00-user-journey.md (for journey steps and user actions)
Read: product-guidelines/02-tech-stack.md (for framework choices, patterns)
Read: product-guidelines/02b-coding-standards.ctx.md (for framework-specific patterns)
Read: product-guidelines/04-architecture.md (for high-level architectural patterns)
Read: product-guidelines/07-database-schema.ctx.md (for entities and relationships)
Read: product-guidelines/08b-api-contracts.ctx.md (for endpoints and operations)
```

**Context Optimization**: We read .ctx.md files for coding standards, database schema, and API contracts for significant context reduction while maintaining necessary information for architecture modeling.

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

### Step 2: Identify Services (Business Logic Layer)

**Decision Tree - Service Identification:**

```
For each journey step or major domain entity, ask:

1. Does this require business logic (not just CRUD)?
   - YES → Create dedicated Service class
   - NO → Repository methods may be sufficient

2. Does this involve multiple entities or complex workflows?
   - YES → Service coordinates multiple repositories
   - NO → Simple service with single repository

3. Does this integrate with external systems?
   - YES → Service uses Integration Adapters
   - NO → Service handles logic internally

4. What's the granularity?
   - One service per journey step → Clear boundaries, journey-focused
   - One service per entity → Data-focused, might be too granular
   - One service per domain aggregate → DDD approach, good for complex domains
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

**Example**:

```markdown
### DocumentService
**Responsibility**: Document lifecycle management (upload, validation, storage, retrieval)
**Journey Step**: Step 1 (Document Upload)
**Dependencies**: DocumentRepository, StorageClient, UserService

**Interface**:
- uploadDocument(userId, file, metadata) → Document
  - Validates file type and size (from API contracts: max 100MB, PDF/DOCX only)
  - Uploads to storage (S3/GCS via StorageClient)
  - Creates database record (via DocumentRepository)
  - Returns document with signed download URL
  - Journey: Enables Step 1 "Upload compliance document"

- getDocument(documentId, userId) → Document | null
  - Checks ownership (user_id matches or team member)
  - Retrieves from database
  - Generates fresh signed URL if needed
  - Journey: Supports viewing uploaded documents

- deleteDocument(documentId, userId) → void
  - Verifies ownership
  - Deletes from storage
  - Soft-deletes database record (status = 'deleted')
  - Journey: Allows cleanup before assessment
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

2. What operations does each entity need?
   ├─ Just CRUD → Base repository with findById, create, update, delete
   ├─ Specialized queries → Add custom methods (findByUserIdWithStatus, etc.)
   └─ Complex aggregations → Add reporting methods

3. Should we use a base repository class?
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

**Example**:

```markdown
### DocumentRepository
**Entity**: documents table (from Session 7)
**ORM**: Prisma (from Session 3)

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
- Errors: 400 (invalid file), 413 (too large), 422 (business logic)
- Journey: Implements Step 1 document upload

#### GET /api/documents (listDocuments)
- Handler: listDocumentsHandler(req, res)
- Validates: Query params (cursor, limit, status from Session 8)
- Calls: DocumentService.listUserDocuments(req.user.id, req.query)
- Returns: 200 with paginated list (Session 8 pagination format)
- Journey: Lists uploaded documents for selection

#### GET /api/documents/:id (getDocument)
- Handler: getDocumentHandler(req, res)
- Validates: ID format
- Calls: DocumentService.getDocument(req.params.id, req.user.id)
- Returns: 200 with document, 403 (not owner), 404 (not found)
- Journey: View document details

#### DELETE /api/documents/:id (deleteDocument)
- Handler: deleteDocumentHandler(req, res)
- Validates: ID format
- Calls: DocumentService.deleteDocument(req.params.id, req.user.id)
- Returns: 204 No Content
- Journey: Remove document before assessment
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

### Step 7: Document Architecture Decisions

**For each major architectural decision, document**:

```markdown
## Architecture Decisions

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
- `templates/09b-application-architecture-template.md` for full version

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
- [ ] Essentials file is ~60% size of full file

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

- Template (full): `/templates/09b-application-architecture-template.md`
- Template (context): `/templates/09b-application-architecture-template.ctx.md`
- Example: `/examples/compliance-saas/09b-application-architecture.md`

---

**Now, read previous outputs and model the application architecture that implements your user journey!**

## Output Format

IMPORTANT: Do not use emojis in generated outputs. Use plain text for all communication.
