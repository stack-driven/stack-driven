# Application Architecture Essentials (For Backlog Generation)

**Purpose:** Condensed application architecture for Session 10 backlog generation
**Full Version:** See `09.5-application-architecture.md` for complete details
**File location:** `product-guidelines/09.5-application-architecture-essentials.md`

---

## Configuration

**Backend**: [Framework name]
**Frontend**: [Framework name or N/A]
**ORM**: [ORM name]
**State Management**: [State management approach]
**Architecture**: [Monolith/Modular Monolith/Microservices]

---

## Service Layer

### [ServiceName] → Journey Step [X]

**Methods**:
- `methodName(params) → ReturnType` - [One-line description]
- `methodName2(params) → ReturnType` - [One-line description]

### [ServiceName2] → Journey Step [Y]

**Methods**:
- `methodName(params) → ReturnType` - [One-line description]

[Repeat for each service - just list services and method signatures, no business rules or implementation details]

---

## Repository Layer

### [RepositoryName] (entity: [table_name])

**Methods**:
- `create(data) → Entity`
- `findById(id) → Entity | null`
- `findByUserId(userId, options) → Entity[]`
- `update(id, data) → Entity`
- `delete(id) → void`

### [RepositoryName2] (entity: [table_name])

**Methods**:
- [List core methods only]

[Repeat for each repository - just method signatures]

---

## Controller/Handler Layer

### [ControllerName] (/api/[resource])

**Endpoints**:
- `POST /api/[resource]` → `handlerName()` → calls `ServiceName.methodName()`
- `GET /api/[resource]` → `handlerName()` → calls `ServiceName.methodName()`
- `GET /api/[resource]/:id` → `handlerName()` → calls `ServiceName.methodName()`
- `DELETE /api/[resource]/:id` → `handlerName()` → calls `ServiceName.methodName()`

### [ControllerName2] (/api/[resource2])

**Endpoints**:
- [List endpoint → service mapping]

[Repeat for each controller - just endpoint to service method mapping]

---

## Component Architecture (Frontend)

### [PageName] → Journey Step [X]

**Component Tree**:
```
PageName
├── ComponentA
├── ComponentB
│   └── ComponentC
└── ComponentD
```

**State**: [State management approach for this page]

### [PageName2] → Journey Step [Y]

**Component Tree**: [Similar structure]

[Repeat for each page - just component hierarchy, no props/state details]

---

## Integration Adapters

### [AdapterName]

**Purpose**: [One-line - what third-party service]
**Methods**: `method1()`, `method2()`, `method3()`

### [AdapterName2]

**Purpose**: [One-line]
**Methods**: [List method names only]

---

## Architecture Patterns

**Service Granularity**: [One-line decision - e.g., "One service per journey step"]

**Data Access**: [One-line - e.g., "Repository pattern with Prisma ORM"]

**Component Organization**: [One-line - e.g., "Feature-based structure"]

**State Management**: [One-line - e.g., "React Query for server state, useState for UI state"]

**Dependency Injection**: [One-line - e.g., "Constructor injection with DI container"]

---

## Story Scoping Guidance for Session 10

**When creating backlog stories, reference this architecture**:

1. **Service Implementation Stories**:
   - Title: "Implement [ServiceName].[methodName]()"
   - Acceptance Criteria: Method signature, business rules, tests

2. **Repository Stories**:
   - Title: "Implement [RepositoryName] data access"
   - Include: All CRUD + specialized query methods

3. **Controller Stories**:
   - Title: "Implement [ControllerName] endpoints"
   - Include: All endpoints for the resource, middleware, validation

4. **Component Stories**:
   - Title: "Implement [PageName] interface"
   - Include: Component tree, state management, data fetching

5. **Integration Stories**:
   - Title: "Implement [AdapterName] integration"
   - Include: All adapter methods, error handling, configuration

**Example Story Title**: "Implement DocumentService.uploadDocument() method"

**Example Acceptance Criteria**:
- [ ] DocumentService.uploadDocument(userId, file, metadata) implemented
- [ ] Calls StorageAdapter.uploadFile() to upload to S3
- [ ] Calls DocumentRepository.create() to persist record
- [ ] Validates file type (PDF, DOCX) and size (max 100MB)
- [ ] Returns Document with signed download URL
- [ ] Unit tests with mocked dependencies
- [ ] Error handling for InvalidFileType, FileTooLarge

---

## Dependencies Summary

**Service Dependencies** (for story ordering):
- [ServiceName] depends on: [RepositoryName], [AdapterName]
- [ServiceName2] depends on: [RepositoryName2], [ServiceName]

**Implementation Order Recommendation**:
1. Integration Adapters (no dependencies)
2. Repositories (depend on ORM only)
3. Services (depend on repositories + adapters)
4. Controllers (depend on services)
5. Components (depend on API endpoints)

---

**For complete architecture details, business rules, and design decisions, see: `09.5-application-architecture.md`**
