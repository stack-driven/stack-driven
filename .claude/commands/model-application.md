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

### Step 2: Analyze Requirements for Sub-Agent Invocation

Before invoking sub-agents, extract decision factors from context:

**Extract Decision Factors**:

1. **Team size** → Read from Session 2a constraints (if exists) or Session 4 architecture (default: 3-5 if unspecified)
2. **Entity count** → Count tables from Session 7 database schema
3. **Deployment frequency** → Read from Session 4 architecture (default: "weekly" if unspecified)
4. **Bounded contexts** → Analyze journey steps - are there clear clusters of functionality?
5. **Operational maturity** → Read from Session 2a constraints or infer from team size (default: "low" for new teams)
6. **Domain complexity** → Analyze if entities from Session 1.6 have business logic or just CRUD (default: "medium")
7. **External integrations** → List from Session 4 architecture (S3, OpenAI API, payment gateways, etc.)
8. **Public API endpoints** → Check Session 8b for public/authenticated endpoints (check for auth requirements)
9. **Multi-entity workflows** → Analyze journey steps - do any steps modify multiple entities?
10. **Event-driven requirements** → Check if Session 4 mentions events/messaging/notifications

**Document extracted factors**:

```markdown
## Requirements Analysis

**Architectural Scale Factors**:
- Team size: [X developers]
- Entity count: [Y entities from Session 7]
- Deployment frequency: [daily/weekly/monthly]
- Bounded contexts: [List clear clusters from journey steps]
- Operational maturity: [low/moderate/high]

**Domain Complexity Factors**:
- Domain entities with business logic: [Yes/No - check if entities have methods beyond CRUD]
- Multi-entity workflows: [Yes/No - e.g., "upload document + create assessment"]
- External integrations: [List: S3, OpenAI API, payment gateways, etc.]

**API & Performance Factors**:
- Public API endpoints: [Count from Session 8b]
- Read-heavy operations: [List operations with read/write ratio > 10:1]
- Third-party API calls: [List external services that need resilience patterns]

**Event-Driven Factors**:
- Event publishing: [Yes/No - check Session 4 for events/messaging]
- Reliability requirements: [Critical/Standard - check if events must be guaranteed]
```

---

### Step 3: Conditional Sub-Agent Invocation

**IMPORTANT**: Do NOT load all sub-agents. Only invoke sub-agents that are relevant to this journey based on Step 2 analysis.

**Conditional Logic**:

#### 3.1: Architectural Style Validation

**Condition**: `team_size > 5 OR entity_count > 10 OR bounded_contexts > 1`

**Agent**: `.claude/agents/validate-architectural-style.md`

**Inputs**:
```json
{
  "journey_steps": [count from Session 1],
  "entity_count": [count from Session 7],
  "team_size": [from Session 2a or 4],
  "deployment_frequency": [from Session 4],
  "bounded_contexts": [identified from journey clustering],
  "ops_maturity": [from Session 2a or inferred],
  "journey_context": [brief description]
}
```

**Output**: architectural_style (Monolith/Modular Monolith/Microservices), module_structure (if applicable), boundary_enforcement_config

**If condition NOT met**: Skip this sub-agent. Default to simple monolith (no module boundaries needed for small scale).

---

#### 3.2: Domain Layer Modeling

**Condition**: `entity_count > 5 AND (domain_complexity == "medium" OR domain_complexity == "high")`

**Agent**: `.claude/agents/model-domain-layer.md`

**Inputs**:
```json
{
  "database_entities": [entities from Session 7 with columns/relationships],
  "journey_steps": [from Session 1],
  "domain_complexity": [assessed from business rules]
}
```

**Output**: domain_entities[] with methods, value_objects[], aggregates[], anemic_domain_model_prevention

**If condition NOT met**: Skip this sub-agent. Domain is simple CRUD - services can handle logic without rich domain entities.

---

#### 3.3: Transaction Boundaries

**Condition**: `multi_entity_workflows == true OR external_integrations.length > 0`

**Agent**: `.claude/agents/design-transaction-boundaries.md`

**Inputs**:
```json
{
  "service_methods": [list from journey steps + API endpoints],
  "external_integrations": [from Session 4],
  "journey_steps": [for user impact analysis]
}
```

**Output**: transaction_scopes[] (single repo/multi-repo/external+DB/saga), compensation_patterns[], journey_impact

**If condition NOT met**: Skip this sub-agent. Simple workflows with single-entity operations don't need complex transaction patterns.

---

#### 3.4: ORM Pattern Selection

**Condition**: `entity_count > 10 OR domain_complexity == "high" OR testing_requirements == "heavy_unit_testing"`

**Agent**: `.claude/agents/choose-orm-pattern.md`

**Inputs**:
```json
{
  "entity_count": [from Session 7],
  "domain_complexity": [assessed],
  "testing_requirements": [from Session 9],
  "team_familiarity": [framework_default or explicit_architecture],
  "use_case": [mvp/production/enterprise],
  "domain_entities_with_logic": [from Step 3.2 output or false],
  "clean_architecture_enforced": [from Session 4]
}
```

**Output**: orm_pattern (Active Record/Data Mapper), rationale, integration_with_domain_layer

**If condition NOT met**: Skip this sub-agent. Default to framework default (usually Active Record for simplicity).

---

#### 3.5: Rate Limiting Strategy

**Condition**: `public_api_endpoints.length > 0`

**Agent**: `.claude/agents/design-rate-limiting.md`

**Inputs**:
```json
{
  "api_endpoints": [from Session 8b with resource cost],
  "resource_costs": {
    "storage_operations": "high",
    "ai_processing": "high",
    "database_queries": "medium",
    "simple_reads": "low"
  }
}
```

**Output**: rate_limit_configs[] with algorithm (Token Bucket/Sliding Window), scope, limits, journey_integration

**If condition NOT met**: Skip this sub-agent. Internal/admin-only APIs may not need rate limiting.

---

#### 3.6: Cross-Cutting Concerns (ALWAYS INVOKE)

**Condition**: ALWAYS (production-grade concerns needed for all systems)

**Agent**: `.claude/agents/design-cross-cutting-concerns.md`

**Inputs**:
```json
{
  "third_party_apis": [from Session 4],
  "cache_candidates": [operations with read/write ratio > 10:1],
  "event_driven": [true/false from Step 2],
  "architectural_style": [from Step 3.1 or default "monolith"]
}
```

**Output**: caching_strategy, circuit_breakers[], outbox_pattern (if event-driven), observability_config

**This sub-agent is ALWAYS invoked** - all production systems need caching, resilience, and observability.

---

### Step 4: Synthesize Sub-Agent Outputs

After sub-agents complete, synthesize their outputs into unified architecture document:

**Synthesis Strategy**:

1. **Combine architectural decisions**: Integrate output from Step 3.1 (style), 3.2 (domain), 3.4 (ORM) into coherent architecture
2. **Integrate transaction patterns**: Merge output from Step 3.3 with service method definitions
3. **Add rate limiting to controllers**: Annotate controller endpoints with Step 3.5 configurations
4. **Overlay cross-cutting concerns**: Add caching/circuit breakers from Step 3.6 to relevant service methods

**Output Sections** (based on what was conditionally loaded):

```markdown
## Architectural Style Validation
[Output from Step 3.1 if invoked, otherwise: "Simple Monolith (team size [X], entities [Y], no module boundaries needed)"]

## Domain Layer
[Output from Step 3.2 if invoked, otherwise: "Simple CRUD domain - services handle business logic"]

## Services (Business Logic Layer)
[Synthesized from journey steps + API endpoints + domain layer]

### [ServiceName]
**Purpose**: [Journey step it serves]
**Methods**:
- [methodName()]: [Description, transaction scope from Step 3.3]

## Repositories (Data Access Layer)
**ORM Pattern**: [Output from Step 3.4 or framework default]

### [RepositoryName]
**Entity**: [Database table]
**Methods**: [CRUD + specialized queries]

## Controllers/Handlers (HTTP Layer)
[Mapped from Session 8b endpoints]

### [ControllerName]
**Endpoints**:
- [METHOD /path]: Handler method, rate limiting from Step 3.5

## Cross-Cutting Concerns
[Output from Step 3.6]

- Caching: [Strategy for read-heavy operations]
- Circuit Breakers: [For external integrations]
- Outbox Pattern: [If event-driven]
- Observability: [Logging, metrics, tracing]

## Architecture Decision Records
[Decision records from each sub-agent]
```

---

### Step 5: Generate Output Files

Write two files:

1. **`product-guidelines/09b-application-architecture.md`** (full specification)
2. **`product-guidelines/09b-application-architecture.ctx.md`** (context version for Session 10, 12)

**Context file reduction**: 60% token reduction (remove rationale, keep decisions/structure)

---

### Step 6: Validate Architecture Quality

**Quality Checklist**:

- [ ] All journey steps mapped to services/controllers
- [ ] Transaction boundaries defined for multi-entity/external operations
- [ ] Rate limiting configured for public endpoints
- [ ] Caching strategy for read-heavy operations (if any)
- [ ] Circuit breakers for external integrations (if any)
- [ ] Architecture decisions have rationale + journey traceability
- [ ] Services are thin orchestrators (if rich domain model), not anemic DTOs
- [ ] Repository pattern matches ORM choice (Active Record vs Data Mapper)
- [ ] Cross-cutting concerns (observability) defined for all services

---

## Important Notes

**Agentic Architecture Principles**:
- **Conditional Loading**: Only invoke sub-agents relevant to this journey (not all 6 every time)
- **Token Efficiency**: Typical execution loads 2-4 sub-agents (~800-1200 lines) vs monolithic 2,622 lines
- **Specialization**: Each sub-agent is expert in ONE concern (DDD, transactions, rate limiting, etc.)
- **Centralized Examples**: All "Compliance SaaS" examples in `/examples/compliance-saas-architecture.md` (referenced, not duplicated)

**Example Execution** (Compliance SaaS):
- Step 3.1: ✅ Invoked (8 entities, 2 bounded contexts) → Modular Monolith
- Step 3.2: ✅ Invoked (8 entities, medium complexity) → Domain entities with business logic
- Step 3.3: ✅ Invoked (external S3 + DB) → Compensation pattern
- Step 3.4: ✅ Invoked (8 entities, medium domain) → Data Mapper
- Step 3.5: ✅ Invoked (public API endpoints) → Token Bucket for uploads, Sliding Window for queries
- Step 3.6: ✅ Invoked (always) → Cache document list, circuit breaker for AI API

**Token usage**: ~1,200 lines (orchestrator 400 + 5 sub-agents ~800) = 54% reduction vs monolithic 2,622 lines

**Example Execution** (Simple Todo App):
- Step 3.1: ❌ Skipped (3 entities, no bounded contexts) → Simple Monolith
- Step 3.2: ❌ Skipped (simple CRUD) → Services handle logic
- Step 3.3: ❌ Skipped (no external integrations) → Standard DB transactions
- Step 3.4: ❌ Skipped (< 10 entities) → Framework default (Active Record)
- Step 3.5: ❌ Skipped (internal API only) → No rate limiting
- Step 3.6: ✅ Invoked (always) → Basic observability

**Token usage**: ~750 lines (orchestrator 400 + 1 sub-agent ~350) = 71% reduction

---

## Next Steps

After completing this session:

1. **Checkpoint**: Review output before continuing (decisions cascade to Sessions 10, 12)
2. **Next Session**: `/generate-backlog` (Session 10) - creates user stories from this architecture
3. **Integration**: Session 12 reads `09b-application-architecture.ctx.md` to generate code skeletons

---

**Remember**: This orchestrator invokes sub-agents CONDITIONALLY based on journey requirements. Not every journey needs all 6 patterns. Start simple, add complexity only when justified by scale, domain richness, or operational needs.
