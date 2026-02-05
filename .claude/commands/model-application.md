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
**Skip if**: Small team (<= 5), simple app with <= 10 entities, no bounded contexts

Use Task tool to invoke `.claude/agents/validate-architectural-style.md`:

**Prompt for agent**:
"""
You are an architectural style validation expert. Analyze the provided context and determine the optimal architectural style (Simple Monolith / Modular Monolith / Microservices) for this application.

**Inputs**:
- Journey steps: [count from Session 1]
- Entity count: [count from Session 7]
- Team size: [from Session 2a or 4, default 3-5 if unspecified]
- Deployment frequency: [from Session 4, default "weekly" if unspecified]
- Bounded contexts: [identified clusters from journey steps]
- Operational maturity: [from Session 2a or inferred from team size, default "low" for new teams]
- Journey context: [brief description of user journey]

**Expected Output**:
- Architectural style: (Simple Monolith / Modular Monolith / Microservices)
- Module structure: (if Modular Monolith chosen, define modules)
- Boundary enforcement config: (if applicable, tooling/patterns to enforce boundaries)
- Journey-based rationale: Trace decision to journey scale, team size, deployment needs
"""

**Store result** for synthesis in Step 4.

**If condition NOT met**: Skip this agent. Document: "Simple Monolith (team size [X], entities [Y], no module boundaries needed)"

---

#### 3.2: Domain Layer Modeling

**Condition**: `entity_count > 5 AND (domain_complexity == "medium" OR domain_complexity == "high")`
**Skip if**: Simple CRUD domain with <= 5 entities or low complexity

Use Task tool to invoke `.claude/agents/model-domain-layer.md`:

**Prompt for agent**:
"""
You are a domain modeling expert specializing in Domain-Driven Design (DDD). Analyze the database entities and journey steps to determine if rich domain entities are needed, and if so, design them.

**Inputs**:
- Database entities: [list entities from Session 7 with columns, relationships]
- Journey steps: [from Session 1, highlighting business logic requirements]
- Domain complexity: [assessed from Step 2: low/medium/high]

**Expected Output**:
- Domain entities: List of entities that need business logic methods (beyond CRUD)
- Value objects: Immutable value objects for domain concepts
- Aggregates: Aggregate roots and their boundaries
- Anemic domain model prevention: How to avoid anemic entities
- Journey-based rationale: Trace domain design to journey steps requiring business logic
"""

**Store result** for synthesis in Step 4.

**If condition NOT met**: Skip this agent. Document: "Simple CRUD domain - services handle business logic without rich domain entities"

---

#### 3.3: Transaction Boundaries

**Condition**: `multi_entity_workflows == true OR external_integrations.length > 0`
**Skip if**: Simple single-entity workflows with no external integrations

Use Task tool to invoke `.claude/agents/design-transaction-boundaries.md`:

**Prompt for agent**:
"""
You are a transaction boundary design expert. Analyze service methods and workflows to determine transaction scopes, compensation patterns, and saga requirements.

**Inputs**:
- Service methods: [list derived from journey steps + API endpoints from Session 8b]
- External integrations: [from Session 4 architecture, e.g., S3, OpenAI API, payment gateways]
- Journey steps: [from Session 1, for user impact analysis of transaction failures]

**Expected Output**:
- Transaction scopes: Classify each service method (single repository / multi-repository / external+DB / saga pattern)
- Compensation patterns: For multi-step workflows, define rollback/compensation logic
- Journey impact: How transaction failures affect user journey steps
- Journey-based rationale: Trace transaction design to workflow complexity and failure scenarios
"""

**Store result** for synthesis in Step 4.

**If condition NOT met**: Skip this agent. Document: "Simple single-entity workflows - standard database transactions sufficient"

---

#### 3.4: ORM Pattern Selection

**Condition**: `entity_count > 10 OR domain_complexity == "high" OR testing_requirements == "heavy_unit_testing"`
**Skip if**: <= 10 entities AND low/medium complexity AND light testing requirements

Use Task tool to invoke `.claude/agents/choose-orm-pattern.md`:

**Prompt for agent**:
"""
You are an ORM pattern selection expert. Analyze the entity count, domain complexity, and testing requirements to choose between Active Record and Data Mapper patterns.

**Inputs**:
- Entity count: [from Session 7 database schema]
- Domain complexity: [from Step 2 assessment: low/medium/high]
- Testing requirements: [from Session 9 test strategy: light/moderate/heavy unit testing]
- Team familiarity: [framework_default or explicit_architecture from Session 2a/4]
- Use case: [mvp/production/enterprise from journey maturity]
- Domain entities with logic: [true if Step 3.2 invoked, false otherwise]
- Clean architecture enforced: [from Session 4 architecture decisions]

**Expected Output**:
- ORM pattern: Active Record OR Data Mapper
- Rationale: Why this pattern fits the entity count, domain complexity, testing needs
- Integration with domain layer: How ORM pattern aligns with domain entities (if Step 3.2 invoked)
- Journey-based rationale: Trace ORM choice to testing needs, domain richness, team constraints
"""

**Store result** for synthesis in Step 4.

**If condition NOT met**: Skip this agent. Document: "Framework default (Active Record for simplicity with <= 10 entities)"

---

#### 3.5: Rate Limiting Strategy

**Condition**: `public_api_endpoints.length > 0`
**Skip if**: Internal/admin-only APIs with no public endpoints

Use Task tool to invoke `.claude/agents/design-rate-limiting.md`:

**Prompt for agent**:
"""
You are a rate limiting strategy expert. Analyze API endpoints and their resource costs to design appropriate rate limiting configurations.

**Inputs**:
- API endpoints: [from Session 8b with auth requirements to identify public vs authenticated endpoints]
- Resource costs: Map each endpoint type to cost level:
  - Storage operations (uploads, file operations): high
  - AI processing (inference, embeddings): high
  - Database queries (complex joins, aggregations): medium
  - Simple reads (cached data, single-row lookups): low

**Expected Output**:
- Rate limit configs: For each public endpoint, specify algorithm (Token Bucket / Sliding Window), scope (per user / per IP / per team), limits (requests per minute/hour)
- Journey integration: How rate limits align with expected user behavior from journey steps
- Journey-based rationale: Trace rate limiting decisions to resource costs, pricing tiers, abuse prevention
"""

**Store result** for synthesis in Step 4.

**If condition NOT met**: Skip this agent. Document: "Internal/admin-only APIs - no rate limiting needed"

---

#### 3.6: Cross-Cutting Concerns (ALWAYS INVOKE)

**Condition**: ALWAYS (production-grade concerns needed for all systems)

Use Task tool to invoke `.claude/agents/design-cross-cutting-concerns.md`:

**Prompt for agent**:
"""
You are a cross-cutting concerns expert. Design caching, circuit breakers, outbox pattern (if event-driven), and observability for production-grade systems.

**Inputs**:
- Third-party APIs: [list from Session 4 architecture, e.g., S3, OpenAI API, payment gateways]
- Cache candidates: [list operations with read/write ratio > 10:1 from journey steps and API endpoints]
- Event-driven: [true if Session 4 mentions events/messaging/notifications, false otherwise]
- Architectural style: [from Step 3.1 output if invoked, otherwise default to "Simple Monolith"]

**Expected Output**:
- Caching strategy: Cache layers (in-memory, Redis), cache keys, TTL, invalidation patterns for read-heavy operations
- Circuit breakers: For each third-party API, specify timeout, failure threshold, fallback behavior
- Outbox pattern: (if event-driven=true) Event storage, publishing mechanism, retry logic
- Observability config: Logging patterns, metrics to track, distributed tracing (if applicable)
- Journey-based rationale: Trace cross-cutting concerns to reliability requirements, performance needs, debugging needs
"""

**Store result** for synthesis in Step 4.

**This sub-agent is ALWAYS invoked** - all production systems need caching, resilience, and observability.

---

### Step 4: Synthesize Sub-Agent Outputs

After sub-agents complete via Task tool invocations in Step 3, synthesize their outputs into unified architecture document:

**Synthesis Strategy**:

1. **Combine architectural decisions**: Integrate outputs from Task tool results for Step 3.1 (style), 3.2 (domain), 3.4 (ORM) into coherent architecture
2. **Integrate transaction patterns**: Merge outputs from Task tool result for Step 3.3 with service method definitions
3. **Add rate limiting to controllers**: Annotate controller endpoints with configurations from Task tool result for Step 3.5
4. **Overlay cross-cutting concerns**: Add caching/circuit breakers from Task tool result for Step 3.6 to relevant service methods

**Important**: Only synthesize outputs from sub-agents that were actually invoked. If a sub-agent was skipped (condition not met), use the documented default behavior instead.

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
