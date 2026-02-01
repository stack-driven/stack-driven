# Stack-Driven Cascade Validation Roadmap

## Overview

This document provides **world-class investigation prompts** to evaluate Stack-Driven cascade commands against state-of-the-art reference material. Each investigation prompt is designed to identify gaps, validate alignment, and recommend improvements to bring the framework to the next level.

**Purpose:** Systematic validation of cascade prompts against best-practice research guides
**Status:** Ready for execution (DO NOT conduct research yourself - use these prompts)
**Scope:** 10 cascade sessions with corresponding reference materials

---

## Validation Matrix

| Session | Command | Reference Material | Status |
|---------|---------|-------------------|--------|
| Session 3 | `/choose-tech-stack` | `tech-stack-selection-guide.md` | ✅ Guide exists |
| Session 4 | `/generate-strategy` | `product-metrics-framework.md` | ✅ Guide exists |
| Session 6 | `/create-design` | `design-system-engineering.md` | ✅ Guide exists |
| Session 7 | `/design-database-schema` | `database-design-guide.md` | ✅ Guide exists |
| Session 8 | `/generate-api-design` | `api-security-blueprint.md` | ✅ Guide exists |
| Session 8b | `/generate-api-contracts` | `serialization-guide.md` | ✅ Guide exists |
| Session 9 | `/create-test-strategy` | `testing-strategy-playbook.md` | ✅ Guide exists |
| Session 9b | `/model-application` | `application-architecture-patterns.md` | ✅ Guide exists |
| Session 13 | `/plan-deployment` | `devops-deployment-guide.md` | ✅ Guide exists |
| Session 3c | `/define-ai-integration-strategy` | `ai-integration-best-practices.md` | ✅ Guide exists |
| Session 2a | `/document-constraints` (i18n) | `i18n-implementation-guide.md` | ⏳ Coming soon |
| Session 2a | `/document-constraints` (integrations) | `third-party-integration-patterns.md` | ⏳ Coming soon |
| Post-Cascade | `/create-compliance-plan` | `compliance-implementation-playbook.md` | ⏳ Coming soon |

---

## Investigation Prompts

### 1. Tech Stack Selection (Session 3)

**Cascade Command:** `.claude/commands/choose-tech-stack.md`
**Reference Material:** `reference-material/tech-stack-selection-guide.md`
**Investigation Priority:** CRITICAL (Session 3 decisions cascade through all remaining sessions)

#### Investigation Prompt

```
OBJECTIVE: Validate `/choose-tech-stack` cascade command against state-of-the-art tech stack selection framework

METHODOLOGY:
1. Read BOTH files side-by-side:
   - `.claude/commands/choose-tech-stack.md` (current cascade prompt)
   - `reference-material/tech-stack-selection-guide.md` (best practices)

2. Evaluate CASCADE PROMPT against REFERENCE GUIDE on these dimensions:

   **A. Decision Tree Completeness**
   - Does cascade prompt cover all decision factors from reference guide?
   - Missing decision criteria? (team expertise, performance, ecosystem, bundle size, SEO, etc.)
   - Are decision trees structured logically (journey → requirements → options → recommendation)?

   **B. Technology Coverage**
   - Frontend frameworks: React, Vue, Angular, Svelte, SolidJS, Qwik coverage?
   - Meta-frameworks: Next.js, Remix, Nuxt, SvelteKit, Astro coverage?
   - Backend frameworks: Node.js, Python, Go, Rust coverage adequacy?
   - Infrastructure: AWS, GCP, Azure, Vercel, Railway decision tree quality?
   - State management: Redux, Zustand, TanStack Query, SWR coverage?

   **C. Journey-Driven Approach Alignment**
   - Does cascade prompt map journey requirements → tech decisions correctly?
   - Are behavioral profile dimensions (from Session 1) used in tech selection?
   - Do examples show journey-specific tech choices (not generic stacks)?

   **D. 2025 State-of-the-Art Alignment**
   - Does cascade prompt reflect 2025 best practices from reference guide?
   - Are outdated patterns identified? (e.g., CRA instead of Vite)
   - Are emerging patterns included? (e.g., React Server Components, Edge Functions)

   **E. Quality & Specificity Validation**
   - Does cascade prompt enforce journey traceability in tech decisions?
   - Are "What We DIDN'T Choose" sections enforced with 2+ alternatives?
   - Does it prevent generic advice ("just use Next.js" without reasoning)?

   **F. Conditional Logic Accuracy**
   - AI integration detection: Does Session 3 correctly ONLY detect requirement (not choose provider)?
   - i18n library selection: Does it correctly choose framework-specific i18n libraries?
   - Does it integrate behavioral profile factors (tech proficiency, device preference)?

3. Generate STRUCTURED FINDINGS:

   **STRENGTHS:** What does cascade prompt do well?
   **GAPS:** What's missing compared to reference guide?
   **MISALIGNMENTS:** Where does cascade contradict best practices?
   **RECOMMENDATIONS:** Specific improvements to cascade prompt (quote exact sections to change)
   **PRIORITY:** Critical/High/Medium/Low for each recommendation

4. Create IMPLEMENTATION PLAN:
   - Prioritized list of cascade prompt edits
   - Template additions needed
   - New validation criteria to add
   - Example journey scenarios to test against

OUTPUT FORMAT:
- Executive summary (3-5 sentences)
- Detailed findings by dimension (A-F)
- Prioritized recommendations with specific line edits
- Test scenarios to validate improvements
```

---

### 2. Product Metrics & Strategy (Session 4)

**Cascade Command:** `.claude/commands/generate-strategy.md`
**Reference Material:** `reference-material/product-metrics-framework.md`
**Investigation Priority:** CRITICAL (Metrics define success criteria for entire product)

#### Investigation Prompt

```
OBJECTIVE: Validate `/generate-strategy` cascade command against state-of-the-art product metrics framework

METHODOLOGY:
1. Read BOTH files side-by-side:
   - `.claude/commands/generate-strategy.md` (current cascade prompt)
   - `reference-material/product-metrics-framework.md` (best practices)

2. Evaluate CASCADE PROMPT against REFERENCE GUIDE on these dimensions:

   **A. Metrics Framework Selection**
   - Does cascade prompt guide choice between AARRR, HEART, North Star frameworks?
   - Does it enforce journey-driven metric selection (not vanity metrics)?
   - Are leading vs lagging indicators distinguished correctly?

   **B. North Star Metric Quality**
   - Does cascade prompt enforce North Star = user value delivery?
   - Are counter metrics (prevent gaming) required?
   - Does it validate metric traces to journey aha moment (typically Step 3)?

   **C. OKR/KPI Structure**
   - Does cascade enforce proper OKR structure (Objective + 3-5 Key Results)?
   - Are input metrics (controllable) vs output metrics (results) distinguished?
   - Does it prevent lagging-only metric sets?

   **D. Mission Statement Alignment**
   - Does mission reference journey transformation correctly?
   - Does it avoid generic mission statements (applicable to any product)?
   - Does monetization model align with value delivery moment?

   **E. Metrics Hierarchy Design**
   - Does cascade create proper metric tree (North Star → Driver metrics → Input metrics)?
   - Are metrics MECE (Mutually Exclusive, Collectively Exhaustive)?
   - Does it validate metrics are measurable and actionable?

   **F. Analytics Implementation Guidance**
   - Does cascade provide event tracking taxonomy recommendations?
   - Does it suggest appropriate analytics tools based on journey complexity?
   - Are privacy considerations (GDPR, cookie consent) addressed?

3. Generate STRUCTURED FINDINGS:

   **STRENGTHS:** Metrics framework strengths in cascade prompt
   **GAPS:** Missing metrics patterns from reference guide
   **MISALIGNMENTS:** Where cascade contradicts metrics best practices
   **RECOMMENDATIONS:** Specific improvements to metrics selection logic
   **PRIORITY:** Critical/High/Medium/Low

4. Create IMPLEMENTATION PLAN:
   - Cascade prompt edits for metrics quality
   - Mission/metrics/monetization template improvements
   - Validation criteria additions
   - Example metric trees for different journey types

OUTPUT FORMAT:
- Executive summary
- Findings by dimension (A-F)
- Prioritized recommendations with line-level edits
- Metric quality checklist
```

---

### 3. Design System Engineering (Session 6)

**Cascade Command:** `.claude/commands/create-design.md`
**Reference Material:** `reference-material/design-system-engineering.md`
**Investigation Priority:** HIGH (Design system affects implementation velocity and consistency)

#### Investigation Prompt

```
OBJECTIVE: Validate `/create-design` cascade command against state-of-the-art design system engineering practices

METHODOLOGY:
1. Read BOTH files side-by-side:
   - `.claude/commands/create-design.md` (current cascade prompt)
   - `reference-material/design-system-engineering.md` (best practices)

2. Evaluate CASCADE PROMPT against REFERENCE GUIDE on these dimensions:

   **A. Design Token Architecture**
   - Does cascade prompt enforce design token hierarchy (semantic → component tokens)?
   - Are naming conventions (BEM, kebab-case, CUBE CSS) correctly specified?
   - Does it integrate behavioral profile factors (device preference, visual processing)?

   **B. Component Library Architecture**
   - Does cascade enforce Atomic Design methodology (atoms → molecules → organisms)?
   - Are composition patterns specified (compound components, render props, hooks)?
   - Does it guide component API design (props, slots, events)?

   **C. CSS Architecture Selection**
   - Does cascade provide decision tree for CSS-in-JS vs Utility-first vs CSS Modules?
   - Are framework-specific recommendations correct? (Tailwind + Next.js, Emotion + React)
   - Does it consider performance implications (runtime vs build-time)?

   **D. Accessibility Engineering**
   - Does cascade enforce ARIA pattern requirements per component type?
   - Are keyboard navigation patterns specified?
   - Does it validate color contrast ratios (WCAG AA/AAA)?

   **E. Journey-Driven Design**
   - Does design system reflect journey emotional arc (trust, confidence, delight)?
   - Are design decisions traced to specific journey steps?
   - Does brand personality from Session 5 correctly influence design system?

   **F. Technical Implementation Guidance**
   - Does cascade recommend appropriate tools (Storybook, Figma Tokens, Style Dictionary)?
   - Are versioning and migration strategies specified?
   - Does it provide tree-shaking and bundle optimization guidance?

3. Generate STRUCTURED FINDINGS:

   **STRENGTHS:** Design system strengths in cascade
   **GAPS:** Missing patterns from reference guide
   **MISALIGNMENTS:** Contradictions with engineering best practices
   **RECOMMENDATIONS:** Improvements to design system prompt
   **PRIORITY:** Critical/High/Medium/Low

4. Create IMPLEMENTATION PLAN:
   - Design system template improvements
   - Component documentation requirements
   - Accessibility validation checklist
   - Integration with Session 12 (scaffold) for token generation

OUTPUT FORMAT:
- Executive summary
- Findings by dimension (A-F)
- Prioritized recommendations
- Example design systems for different journey types (consumer, B2B, compliance)
```

---

### 4. Database Design (Session 7)

**Cascade Command:** `.claude/commands/design-database-schema.md`
**Reference Material:** `reference-material/database-design-guide.md`
**Investigation Priority:** CRITICAL (Schema design affects data integrity, performance, scalability)

#### Investigation Prompt

```
OBJECTIVE: Validate `/design-database-schema` cascade command against state-of-the-art database design patterns

METHODOLOGY:
1. Read BOTH files side-by-side:
   - `.claude/commands/design-database-schema.md` (current cascade prompt)
   - `reference-material/database-design-guide.md` (best practices)

2. Evaluate CASCADE PROMPT against REFERENCE GUIDE on these dimensions:

   **A. Paradigm Selection Decision Tree**
   - Does cascade correctly guide relational vs document vs graph vs time-series vs key-value?
   - Are decision factors comprehensive? (relationships, query patterns, consistency, scale)
   - Does paradigm choice trace to journey data model requirements?

   **B. Schema Design Patterns**
   - Relational: Normalization, denormalization, JSONB flexibility patterns covered?
   - Document: Embedding vs referencing decision tree quality?
   - Graph: Node/edge modeling patterns adequate?
   - Time-series: Retention policies, downsampling patterns?
   - Does cascade enforce journey-driven schema design (not generic ERD)?

   **C. Performance Optimization**
   - Does cascade enforce index requirements for all foreign keys and query patterns?
   - Are index types (B-tree, Hash, GiST, GIN, BRIN) correctly specified?
   - Does it validate N+1 query prevention patterns?
   - Are partitioning strategies covered for scale?

   **D. Data Integrity & Constraints**
   - Does cascade enforce foreign key constraints, check constraints, unique indexes?
   - Are soft delete vs hard delete patterns specified correctly?
   - Does it require audit logging patterns (created_at, updated_at, created_by)?
   - Are temporal table patterns covered for compliance use cases?

   **E. Multi-Tenancy Patterns**
   - Does cascade provide decision tree for shared schema vs separate schema vs separate DB?
   - Are row-level security (RLS) patterns specified for PostgreSQL?
   - Does tenant isolation strategy align with compliance requirements from Session 2a?

   **F. Compliance & Security Patterns**
   - Does cascade integrate i18n requirements (locale columns, translation tables)?
   - Are third-party integration tables generated (webhook_events, sync_jobs)?
   - Does it enforce encryption at rest and in transit?
   - Are GDPR right to erasure patterns (soft delete, cascade delete) specified?

   **G. Migration Strategies**
   - Does cascade specify zero-downtime migration patterns?
   - Are schema versioning approaches covered?
   - Does it integrate with tech stack (Prisma, Drizzle, TypeORM, Sequelize)?

3. Generate STRUCTURED FINDINGS:

   **STRENGTHS:** Schema design strengths
   **GAPS:** Missing patterns from reference guide
   **MISALIGNMENTS:** Contradictions with database best practices
   **RECOMMENDATIONS:** Improvements to schema prompt
   **PRIORITY:** Critical/High/Medium/Low

4. Create IMPLEMENTATION PLAN:
   - Schema template improvements (more comprehensive examples)
   - Index validation checklist additions
   - Constraint enforcement rules
   - Integration with Session 8b (API contracts) for data contract validation

OUTPUT FORMAT:
- Executive summary
- Findings by dimension (A-G)
- Prioritized recommendations with schema examples
- Schema anti-patterns to warn against
```

---

### 5. API Design & Security (Session 8)

**Cascade Command:** `.claude/commands/generate-api-design.md`
**Reference Material:** `reference-material/api-security-blueprint.md`
**Investigation Priority:** CRITICAL (API design affects security, performance, developer experience)

#### Investigation Prompt

```
OBJECTIVE: Validate `/generate-api-design` cascade command against state-of-the-art API security and design patterns

METHODOLOGY:
1. Read BOTH files side-by-side:
   - `.claude/commands/generate-api-design.md` (current cascade prompt)
   - `reference-material/api-security-blueprint.md` (best practices)

2. Evaluate CASCADE PROMPT against REFERENCE GUIDE on these dimensions:

   **A. API Paradigm Selection**
   - Does cascade guide REST vs GraphQL vs gRPC vs WebSocket selection correctly?
   - Are decision factors journey-driven (client types, real-time needs, data complexity)?
   - Does it specify when to use hybrid approaches (REST + WebSocket)?

   **B. Security Architecture**
   - Does cascade enforce authentication strategy (JWT vs session vs OAuth)?
   - Are authorization patterns specified (RBAC, ABAC, claims-based)?
   - Does it validate OWASP API Top 10 protections are addressed?
   - Are rate limiting and throttling patterns journey-specific?

   **C. RESTful Design Patterns**
   - Does cascade enforce REST maturity level 2+ (resources, HTTP verbs, status codes)?
   - Are pagination patterns specified (cursor vs offset)?
   - Does it validate filtering, sorting, field selection patterns?
   - Are versioning strategies covered (URL vs header vs media type)?

   **D. Error Handling & Resilience**
   - Does cascade enforce RFC 7807 Problem Details standard?
   - Are retry strategies with idempotency keys specified?
   - Does it require circuit breaker patterns for third-party calls?
   - Are graceful degradation patterns covered?

   **E. Performance Optimization**
   - Does cascade enforce HTTP caching headers (ETag, Cache-Control)?
   - Are compression strategies (gzip, brotli) specified?
   - Does it validate N+1 query prevention (eager loading, DataLoader)?
   - Are CDN strategies for API responses covered?

   **F. Documentation & Developer Experience**
   - Does cascade require OpenAPI/GraphQL schema specifications?
   - Are example requests/responses journey-specific (not generic)?
   - Does it enforce API design consistency (naming, structure)?

   **G. Compliance Integration**
   - Does cascade integrate i18n requirements (Accept-Language, locale fallback)?
   - Are third-party webhook handlers specified with security requirements?
   - Does it enforce GDPR data export/deletion endpoints?
   - Are audit logging requirements from compliance covered?

3. Generate STRUCTURED FINDINGS:

   **STRENGTHS:** API design strengths
   **GAPS:** Missing security patterns from reference guide
   **MISALIGNMENTS:** Contradictions with API security best practices
   **RECOMMENDATIONS:** Improvements to API design prompt
   **PRIORITY:** Critical/High/Medium/Low

4. Create IMPLEMENTATION PLAN:
   - API design template security enhancements
   - Security validation checklist additions
   - Error handling pattern examples
   - Integration with Session 8b (contracts) for security enforcement

OUTPUT FORMAT:
- Executive summary
- Findings by dimension (A-G)
- Prioritized security recommendations
- API security anti-patterns to prevent
```

---

### 6. API Contracts & Serialization (Session 8b)

**Cascade Command:** `.claude/commands/generate-api-contracts.md`
**Reference Material:** `reference-material/serialization-guide.md`
**Investigation Priority:** HIGH (Contracts define data interfaces and validation)

#### Investigation Prompt

```
OBJECTIVE: Validate `/generate-api-contracts` cascade command against state-of-the-art serialization and contract patterns

METHODOLOGY:
1. Read BOTH files side-by-side:
   - `.claude/commands/generate-api-contracts.md` (current cascade prompt)
   - `reference-material/serialization-guide.md` (best practices)

2. Evaluate CASCADE PROMPT against REFERENCE GUIDE on these dimensions:

   **A. Serialization Format Selection**
   - Does cascade guide JSON vs Protobuf vs MessagePack vs Avro selection correctly?
   - Are decision factors specified (performance, schema evolution, human readability)?
   - Does format choice align with API paradigm (REST→JSON, gRPC→Protobuf)?

   **B. Schema Definition Quality**
   - OpenAPI: Does cascade enforce OpenAPI 3.1 spec completeness?
   - Protobuf: Are message definitions, service definitions, field numbering covered?
   - GraphQL: Are type definitions, input types, enums correctly structured?
   - Does schema trace to database schema (Session 7) correctly?

   **C. Validation & Constraints**
   - Does cascade enforce schema-level validation (required fields, formats, patterns)?
   - Are business rule validations specified (e.g., start_date < end_date)?
   - Does it prevent over-fetching (GraphQL) and under-fetching (REST)?

   **D. Versioning & Evolution**
   - Does cascade specify contract versioning strategy?
   - Are breaking change patterns identified?
   - Does it enforce backwards compatibility rules?
   - Are deprecation patterns specified?

   **E. Performance Optimization**
   - Does cascade recommend pagination for list endpoints?
   - Are partial response patterns (field selection) specified?
   - Does it validate response size limits?
   - Are compression strategies integrated?

   **F. Type Safety & Code Generation**
   - Does cascade specify code generation tools (OpenAPI Generator, Protoc, GraphQL Codegen)?
   - Are type-safe client SDKs mentioned?
   - Does it validate type consistency (DB → API → Client)?

   **G. Security & Compliance**
   - Does cascade enforce PII marking in schemas?
   - Are sanitization patterns specified (HTML escaping, SQL injection prevention)?
   - Does it validate GDPR data export format consistency?

3. Generate STRUCTURED FINDINGS:

   **STRENGTHS:** Contract generation strengths
   **GAPS:** Missing serialization patterns from reference guide
   **MISALIGNMENTS:** Contradictions with contract best practices
   **RECOMMENDATIONS:** Improvements to contracts prompt
   **PRIORITY:** Critical/High/Medium/Low

4. Create IMPLEMENTATION PLAN:
   - Contract template improvements (OpenAPI examples)
   - Validation rule enforcement checklist
   - Code generation integration steps
   - Session 9b (application layer) contract integration

OUTPUT FORMAT:
- Executive summary
- Findings by dimension (A-G)
- Prioritized recommendations
- Example contracts for common patterns (CRUD, webhooks, real-time)
```

---

### 7. Testing Strategy (Session 9)

**Cascade Command:** `.claude/commands/create-test-strategy.md`
**Reference Material:** `reference-material/testing-strategy-playbook.md`
**Investigation Priority:** HIGH (Testing strategy affects quality, velocity, confidence)

#### Investigation Prompt

```
OBJECTIVE: Validate `/create-test-strategy` cascade command against state-of-the-art testing practices

METHODOLOGY:
1. Read BOTH files side-by-side:
   - `.claude/commands/create-test-strategy.md` (current cascade prompt)
   - `reference-material/testing-strategy-playbook.md` (best practices)

2. Evaluate CASCADE PROMPT against REFERENCE GUIDE on these dimensions:

   **A. Test Pyramid/Trophy Selection**
   - Does cascade guide choice between Test Pyramid, Trophy, Diamond models?
   - Are test distribution ratios journey-specific (frontend-heavy vs backend-heavy)?
   - Does it enforce cost/benefit analysis for each testing level?

   **B. Unit Testing Patterns**
   - Does cascade enforce AAA (Arrange-Act-Assert) or Given-When-Then structure?
   - Are mocking strategies specified (avoid over-mocking anti-pattern)?
   - Does it validate test coverage targets by component criticality?
   - Are property-based testing opportunities identified?

   **C. Integration Testing Strategies**
   - Does cascade specify database testing patterns (testcontainers vs in-memory)?
   - Are API testing approaches covered (supertest, rest-assured)?
   - Does it enforce third-party service mocking patterns?
   - Are message queue testing strategies specified?

   **D. E2E Testing Framework Selection**
   - Does cascade provide decision tree for Playwright vs Cypress vs Selenium?
   - Are critical user journey paths covered (from Session 1)?
   - Does it enforce visual regression testing for design system components?
   - Are accessibility testing automation patterns (axe-core) specified?

   **E. Performance Testing**
   - Does cascade require load testing for journey critical paths?
   - Are performance budgets specified (LCP, FID, CLS from Session 6)?
   - Does it validate database query performance testing?
   - Are stress testing scenarios journey-specific?

   **F. Security Testing**
   - Does cascade enforce SAST, DAST, dependency scanning?
   - Are penetration testing requirements specified for compliance products?
   - Does it validate OWASP Top 10 test coverage?

   **G. Test Data Management**
   - Does cascade specify fixture patterns (factory pattern, builders)?
   - Are seed data strategies for different environments covered?
   - Does it enforce PII handling in test data?

   **H. CI/CD Integration**
   - Does cascade specify parallel test execution strategies?
   - Are flaky test management patterns covered?
   - Does it validate test result reporting and coverage thresholds?

3. Generate STRUCTURED FINDINGS:

   **STRENGTHS:** Testing strategy strengths
   **GAPS:** Missing testing patterns from reference guide
   **MISALIGNMENTS:** Contradictions with testing best practices
   **RECOMMENDATIONS:** Improvements to testing strategy prompt
   **PRIORITY:** Critical/High/Medium/Low

4. Create IMPLEMENTATION PLAN:
   - Testing strategy template improvements
   - Test coverage validation rules
   - Journey-specific test scenario generation
   - Integration with Session 10 (backlog) for test story generation

OUTPUT FORMAT:
- Executive summary
- Findings by dimension (A-H)
- Prioritized recommendations
- Example test plans for different product types
```

---

### 8. Application Architecture (Session 9b)

**Cascade Command:** `.claude/commands/model-application.md`
**Reference Material:** `reference-material/application-architecture-patterns.md`
**Investigation Priority:** CRITICAL (Application layer design affects maintainability, scalability, testability)

#### Investigation Prompt

```
OBJECTIVE: Validate `/model-application` cascade command against state-of-the-art application architecture patterns

METHODOLOGY:
1. Read BOTH files side-by-side:
   - `.claude/commands/model-application.md` (current cascade prompt)
   - `reference-material/application-architecture-patterns.md` (best practices)

2. Evaluate CASCADE PROMPT against REFERENCE GUIDE on these dimensions:

   **A. Architectural Style Selection**
   - Does cascade guide monolith vs microservices vs modular monolith decision correctly?
   - Are decision factors journey-driven (team size, complexity, deployment frequency)?
   - Does it validate architectural style aligns with Session 4 (architecture principles)?

   **B. Clean Architecture Implementation**
   - Does cascade enforce Hexagonal/Ports & Adapters pattern correctly?
   - Are layer separation rules specified (domain → application → infrastructure)?
   - Does it validate dependency inversion principle (domain has no dependencies)?
   - Are DDD tactical patterns (Entities, Value Objects, Aggregates) correctly applied?

   **C. API Layer Patterns**
   - Does cascade specify controller/resolver patterns per API type (REST, GraphQL, gRPC)?
   - Are request validation patterns enforced at API boundary?
   - Does it validate error handling patterns (domain errors → HTTP status codes)?
   - Are middleware/interceptor patterns specified?

   **D. Service Layer Design**
   - Does cascade enforce service layer responsibilities (orchestration, transactions)?
   - Are use case patterns specified per journey activity?
   - Does it validate business logic stays in domain layer (not services)?
   - Are transaction boundary patterns covered?

   **E. Data Access Patterns**
   - Does cascade specify repository pattern correctly (interface in domain, impl in infra)?
   - Are query object patterns covered for complex queries?
   - Does it enforce N+1 query prevention at repository level?
   - Are Unit of Work patterns specified for transaction management?

   **F. Domain Modeling**
   - Does cascade generate domain models from database schema (Session 7)?
   - Are aggregate boundaries correctly identified?
   - Does it enforce value object usage for domain concepts?
   - Are domain events specified for cross-aggregate communication?

   **G. Dependency Injection & Configuration**
   - Does cascade specify DI container patterns per framework?
   - Are configuration management patterns covered (env vars, secrets)?
   - Does it validate testability (all dependencies injected)?

   **H. Cross-Cutting Concerns**
   - Does cascade specify logging, monitoring, tracing patterns?
   - Are caching strategies integrated (repository caching, HTTP caching)?
   - Does it enforce security patterns (authentication, authorization)?
   - Are resilience patterns (retry, circuit breaker) covered?

3. Generate STRUCTURED FINDINGS:

   **STRENGTHS:** Architecture modeling strengths
   **GAPS:** Missing patterns from reference guide
   **MISALIGNMENTS:** Contradictions with architecture best practices
   **RECOMMENDATIONS:** Improvements to application modeling prompt
   **PRIORITY:** Critical/High/Medium/Low

4. Create IMPLEMENTATION PLAN:
   - Application architecture template improvements
   - Layer separation validation rules
   - Domain modeling guidelines per paradigm
   - Integration with Session 12 (scaffold) for code skeleton generation

OUTPUT FORMAT:
- Executive summary
- Findings by dimension (A-H)
- Prioritized recommendations
- Example architectures for different scales (startup MVP, growth-stage, enterprise)
```

---

### 9. Deployment & DevOps (Session 13)

**Cascade Command:** `.claude/commands/plan-deployment.md`
**Reference Material:** `reference-material/devops-deployment-guide.md`
**Investigation Priority:** HIGH (Deployment strategy affects reliability, velocity, operational cost)

#### Investigation Prompt

```
OBJECTIVE: Validate `/plan-deployment` cascade command against state-of-the-art DevOps and deployment patterns

METHODOLOGY:
1. Read BOTH files side-by-side:
   - `.claude/commands/plan-deployment.md` (current cascade prompt)
   - `reference-material/devops-deployment-guide.md` (best practices)

2. Evaluate CASCADE PROMPT against REFERENCE GUIDE on these dimensions:

   **A. Deployment Strategy Selection**
   - Does cascade guide blue-green vs canary vs rolling deployment selection?
   - Are feature flag patterns specified for progressive delivery?
   - Does deployment strategy align with journey risk tolerance?
   - Are rollback procedures specified?

   **B. Container Orchestration Patterns**
   - Does cascade provide decision tree for Kubernetes vs ECS vs Cloud Run vs Fly.io?
   - Are resource limits (CPU, memory) journey-specific (load estimation)?
   - Does it specify health check patterns (liveness, readiness)?
   - Are service mesh considerations covered for microservices?

   **C. CI/CD Pipeline Design**
   - Does cascade enforce pipeline as code (GitHub Actions, GitLab CI, CircleCI)?
   - Are build optimization strategies specified (caching, parallelization)?
   - Does it validate security scanning integration (SAST, DAST, dependencies)?
   - Are deployment approval workflows specified for production?

   **D. Infrastructure as Code**
   - Does cascade guide Terraform vs Pulumi vs CDK vs Ansible selection?
   - Are module design patterns specified for reusability?
   - Does it enforce state management best practices (remote state, locking)?
   - Are multi-environment management patterns covered (dev, staging, prod)?

   **E. Monitoring & Observability Integration**
   - Does cascade integrate with Session 14 (observability strategy)?
   - Are SLI/SLO/SLA definitions deployment-specific?
   - Does it specify alert routing and escalation policies?
   - Are runbook templates provided for common incidents?

   **F. Disaster Recovery Planning**
   - Does cascade enforce RTO/RPO targets by journey criticality?
   - Are backup strategies specified (frequency, retention, testing)?
   - Does it validate multi-region failover for critical products?
   - Are chaos engineering practices covered?

   **G. Security Operations**
   - Does cascade enforce secret rotation patterns (AWS Secrets Manager, Vault)?
   - Are network security patterns specified (VPC, security groups, WAF)?
   - Does it validate compliance requirements from Session 2a?
   - Are certificate renewal strategies automated?

   **H. Cost Optimization**
   - Does cascade provide resource right-sizing guidance?
   - Are spot instance strategies covered for non-critical workloads?
   - Does it enforce cost monitoring and alerting?
   - Are reserved capacity vs on-demand tradeoffs analyzed?

3. Generate STRUCTURED FINDINGS:

   **STRENGTHS:** Deployment planning strengths
   **GAPS:** Missing DevOps patterns from reference guide
   **MISALIGNMENTS:** Contradictions with deployment best practices
   **RECOMMENDATIONS:** Improvements to deployment prompt
   **PRIORITY:** Critical/High/Medium/Low

4. Create IMPLEMENTATION PLAN:
   - Deployment plan template improvements
   - Infrastructure as code examples per cloud provider
   - CI/CD pipeline templates per tech stack
   - Disaster recovery playbook templates

OUTPUT FORMAT:
- Executive summary
- Findings by dimension (A-H)
- Prioritized recommendations
- Example deployment strategies by scale and risk tolerance
```

---

### 10. AI Integration Strategy (Session 3c)

**Cascade Command:** `.claude/commands/define-ai-integration-strategy.md`
**Reference Material:** `reference-material/ai-integration-best-practices.md`
**Investigation Priority:** HIGH (AI integration affects product value, cost, performance)

#### Investigation Prompt

```
OBJECTIVE: Validate `/define-ai-integration-strategy` cascade command against state-of-the-art AI integration patterns

METHODOLOGY:
1. Read BOTH files side-by-side:
   - `.claude/commands/define-ai-integration-strategy.md` (current cascade prompt)
   - `reference-material/ai-integration-best-practices.md` (best practices)

2. Evaluate CASCADE PROMPT against REFERENCE GUIDE on these dimensions:

   **A. AI Provider Selection**
   - Does cascade guide OpenAI vs Anthropic vs Google vs AWS vs Azure selection correctly?
   - Are decision factors journey-driven (latency, cost, privacy, capabilities)?
   - Does it enforce build vs buy decision tree for AI infrastructure?
   - Are vendor lock-in considerations addressed?

   **B. AI Pattern Selection**
   - Does cascade correctly map journey use cases → AI patterns (RAG, agents, fine-tuning)?
   - Are pattern tradeoffs specified (complexity, cost, performance)?
   - Does it validate pattern choice aligns with journey requirements?
   - Are emerging patterns covered (multi-agent systems, tool use)?

   **C. Prompt Engineering Strategy**
   - Does cascade enforce prompt versioning and management?
   - Are prompt engineering patterns specified (zero-shot, few-shot, chain-of-thought)?
   - Does it validate prompt cost optimization (token usage)?
   - Are system prompt patterns covered for consistency?

   **D. Context Management**
   - Does cascade specify RAG architecture patterns (vector DB, chunking, retrieval)?
   - Are context window optimization strategies covered?
   - Does it enforce semantic search vs keyword search selection?
   - Are reranking patterns specified for retrieval quality?

   **E. Cost Optimization**
   - Does cascade provide cost modeling per AI use case?
   - Are caching strategies specified (semantic caching, prompt caching)?
   - Does it enforce rate limiting and quota management?
   - Are model selection tradeoffs (GPT-4 vs GPT-3.5 for different tasks) covered?

   **F. Quality & Evaluation**
   - Does cascade enforce evaluation framework (accuracy, relevance, safety)?
   - Are human-in-the-loop patterns specified for critical decisions?
   - Does it validate bias detection and mitigation strategies?
   - Are A/B testing patterns for AI features covered?

   **G. Security & Compliance**
   - Does cascade enforce data privacy patterns (PII filtering, data retention)?
   - Are prompt injection prevention strategies specified?
   - Does it validate compliance with AI regulations (EU AI Act)?
   - Are audit logging requirements for AI decisions covered?

   **H. Observability & Monitoring**
   - Does cascade specify AI-specific metrics (latency, token usage, error rates)?
   - Are failure mode monitoring patterns covered?
   - Does it enforce alerting for cost spikes and quality degradation?

   **I. Tech Stack Integration**
   - Does cascade correctly UPDATE Session 2 tech stack with AI provider selection?
   - Are SDK/library choices specified per language?
   - Does it validate integration with existing architecture (Session 4)?

3. Generate STRUCTURED FINDINGS:

   **STRENGTHS:** AI integration strengths
   **GAPS:** Missing AI patterns from reference guide
   **MISALIGNMENTS:** Contradictions with AI best practices
   **RECOMMENDATIONS:** Improvements to AI integration prompt
   **PRIORITY:** Critical/High/Medium/Low

4. Create IMPLEMENTATION PLAN:
   - AI integration template improvements
   - Pattern selection decision trees
   - Cost modeling spreadsheet templates
   - Integration with Session 10 (backlog) for AI story generation

OUTPUT FORMAT:
- Executive summary
- Findings by dimension (A-I)
- Prioritized recommendations
- Example AI strategies for different use cases (RAG, agents, generation)
```

---

## Future Investigations (Pending Reference Material)

### 11. Internationalization Implementation (Session 2a)

**Cascade Command:** `.claude/commands/document-constraints.md` (i18n detection)
**Reference Material:** `reference-material/i18n-implementation-guide.md` ⏳ COMING SOON
**Investigation Priority:** MEDIUM (Affects Session 3, 7, 8, 10, 12)

#### Investigation Prompt (To Run After Reference Guide Created)

```
OBJECTIVE: Validate i18n constraint detection and propagation across cascade sessions

METHODOLOGY:
1. Read reference guide and trace i18n requirements through cascade:
   - Session 2a: i18n constraint detection
   - Session 3: i18n library selection per framework
   - Session 7: locale columns, translation tables
   - Session 8: Accept-Language headers, locale fallback
   - Session 10: i18n infrastructure stories in Foundation epic
   - Session 12: /locales/ folder structure generation

2. Evaluate CASCADE PROMPTS against REFERENCE GUIDE:

   **A. I18n Architecture Pattern Selection**
   - Build-time vs runtime translation loading decision tree quality?
   - Translation file organization strategies (namespace, feature, route)?
   - Locale detection and switching patterns coverage?

   **B. Framework Integration**
   - React: next-intl vs react-i18next decision quality?
   - Vue: vue-i18n patterns coverage?
   - Backend: i18n library selection per language?

   **C. Translation Management Workflow**
   - String extraction automation patterns?
   - Translation key naming conventions enforcement?
   - Pluralization and gender handling patterns?

   **D. Database Localization Patterns**
   - Locale columns vs translation tables decision tree?
   - Query patterns for multilingual content?
   - Performance optimization for localized queries?

   **E. API Localization**
   - Accept-Language header handling?
   - Locale fallback chain implementation?
   - Error message localization patterns?

   **F. Performance Optimization**
   - Translation bundle splitting per route?
   - Lazy loading strategies?
   - CDN strategies for translations?

3. Generate STRUCTURED FINDINGS:
   - Cross-session i18n propagation gaps
   - Inconsistencies between sessions
   - Missing patterns from reference guide
   - Recommendations for each affected session

OUTPUT FORMAT:
- Executive summary of i18n cascade flow
- Session-by-session findings (2a, 3, 7, 8, 10, 12)
- Prioritized improvements
- i18n implementation checklist template
```

---

### 12. Third-Party Integration Patterns (Session 2a)

**Cascade Command:** `.claude/commands/document-constraints.md` (integration requirements)
**Reference Material:** `reference-material/third-party-integration-patterns.md` ⏳ COMING SOON
**Investigation Priority:** MEDIUM (Affects Session 3, 4, 7, 8, 8b, 10, 12)

#### Investigation Prompt (To Run After Reference Guide Created)

```
OBJECTIVE: Validate third-party integration constraint detection and propagation across cascade

METHODOLOGY:
1. Read reference guide and trace integration requirements through cascade:
   - Session 2a: Integration constraint documentation
   - Session 3: SDK/client library selection
   - Session 4: Integration architecture patterns
   - Session 7: integration_credentials, sync_jobs, webhook_events tables
   - Session 8: Webhook endpoint design, security requirements
   - Session 8b: Webhook OpenAPI specs, signature verification
   - Session 10: Integration stories per provider (Foundation epic)
   - Session 12: Integration adapter code skeletons

2. Evaluate CASCADE PROMPTS against REFERENCE GUIDE:

   **A. Integration Architecture Patterns**
   - Direct integration vs iPaaS decision tree quality?
   - Webhook vs polling vs websocket selection?
   - Rate limiting and backoff strategies coverage?

   **B. Payment Processing**
   - Stripe vs PayPal vs Square pattern quality?
   - PCI compliance scope reduction strategies?
   - Subscription management patterns coverage?
   - Webhook reconciliation patterns?

   **C. Communication Services**
   - Email provider selection (SendGrid, SES, Postmark)?
   - SMS provider patterns (Twilio, SNS)?
   - Push notification patterns coverage?

   **D. Authentication Providers**
   - OAuth 2.0/OIDC pattern quality?
   - Social login implementation patterns?
   - MFA provider integration?

   **E. Error Handling & Resilience**
   - Retry with exponential backoff quality?
   - Circuit breaker pattern coverage?
   - Fallback mechanism strategies?

   **F. Testing Patterns**
   - Mock service patterns quality?
   - Contract testing coverage?
   - Sandbox environment strategies?

3. Generate STRUCTURED FINDINGS:
   - Cross-session integration propagation gaps
   - Vendor-specific gotchas not covered
   - Security pattern completeness
   - Recommendations per affected session

OUTPUT FORMAT:
- Executive summary of integration cascade flow
- Session-by-session findings (2a, 3, 4, 7, 8, 8b, 10, 12)
- Prioritized improvements
- Integration-specific templates (payment, auth, communication)
```

---

### 13. Compliance Implementation (Post-Cascade)

**Cascade Command:** `.claude/commands/create-compliance-plan.md`
**Reference Material:** `reference-material/compliance-implementation-playbook.md` ⏳ COMING SOON
**Investigation Priority:** MEDIUM (Post-cascade extension, not core flow)

#### Investigation Prompt (To Run After Reference Guide Created)

```
OBJECTIVE: Validate `/create-compliance-plan` command against state-of-the-art compliance implementation patterns

METHODOLOGY:
1. Read BOTH files side-by-side:
   - `.claude/commands/create-compliance-plan.md` (current post-cascade command)
   - `reference-material/compliance-implementation-playbook.md` (best practices)

2. Evaluate CASCADE PROMPT against REFERENCE GUIDE:

   **A. Regulatory Landscape Navigation**
   - GDPR, CCPA, HIPAA, PCI-DSS, SOC2 decision tree quality?
   - Geographic and industry-specific requirement detection?
   - Compliance prioritization framework alignment?

   **B. Data Privacy Implementation**
   - Consent management pattern quality?
   - Data subject rights (export, deletion, rectification) patterns?
   - Privacy by design patterns coverage?

   **C. Healthcare (HIPAA) Patterns**
   - PHI handling in applications coverage?
   - BAA requirements and templates quality?
   - Minimum necessary standard implementation?
   - Breach notification procedures coverage?

   **D. Financial (PCI-DSS) Patterns**
   - Scope reduction strategies (use Stripe to minimize)?
   - Tokenization pattern quality?
   - SAQ type selection guidance?

   **E. SOC2 Implementation**
   - Control selection and implementation mapping?
   - Evidence collection automation patterns?
   - Continuous compliance monitoring coverage?
   - Audit preparation strategies quality?

   **F. Compliance Automation**
   - Policy as code pattern quality?
   - Automated compliance testing coverage?
   - Continuous monitoring strategies?

   **G. Cost & Timeline Estimation**
   - Legal cost estimates accuracy (2025 rates)?
   - Engineering effort estimates realism?
   - Certification timeline accuracy (SOC2: 6-12mo)?

   **H. Integration with Cascade**
   - Session 7 (database) integration quality?
   - Session 8/8b (API) integration quality?
   - Session 10 (backlog) Epic 04 story generation?
   - Session 14 (observability) compliance metrics integration?

3. Generate STRUCTURED FINDINGS:
   - Compliance pattern completeness
   - Cost/timeline estimate accuracy
   - Cross-session integration gaps
   - Recommendations for compliance command

OUTPUT FORMAT:
- Executive summary
- Findings by dimension (A-H)
- Prioritized recommendations
- Example compliance plans (HIPAA, PCI-DSS, SOC2)
```

---

## Investigation Execution Guidelines

### How to Use This Roadmap

1. **For Each Investigation:**
   - Copy the investigation prompt
   - Open a NEW Claude Code session (clean context)
   - Paste the prompt
   - Let investigation run to completion
   - Save findings to `/validation-reports/[session-name]-findings.md`

2. **Priority Execution Order:**
   - **Phase 1 (CRITICAL):** Sessions 3, 4, 7, 8, 9b (architecture foundation)
   - **Phase 2 (HIGH):** Sessions 6, 8b, 9, 13 (implementation details)
   - **Phase 3 (MEDIUM):** Session 3c (AI integration)
   - **Phase 4 (FUTURE):** Sessions 11-13 (pending reference guides)

3. **Output Format for Each Investigation:**
   - Create `/validation-reports/` directory
   - Generate `[session-number]-[session-name]-findings.md` per investigation
   - Include executive summary, detailed findings, prioritized recommendations
   - Add implementation plan with line-level edits

4. **After All Investigations:**
   - Create consolidated improvement backlog
   - Prioritize improvements by impact × effort
   - Create GitHub issues for each improvement
   - Link issues to validation findings

---

## Success Metrics

**Quality Indicators:**
- Each investigation identifies 5-15 specific improvement opportunities
- Recommendations include exact line-level edits (not vague suggestions)
- Findings are prioritized (Critical/High/Medium/Low)
- Implementation plans are actionable (no research needed)

**Coverage Indicators:**
- 100% of cascade sessions with reference guides validated
- All decision trees evaluated for completeness
- All technical patterns cross-referenced
- All journey-driven principles validated

**Impact Indicators:**
- Framework alignment with 2025 state-of-the-art verified
- Gaps between cascade prompts and best practices identified
- Improvement roadmap reduces technical debt in prompts
- Enhanced cascade quality improves user outputs

---

## Next Steps

1. **DO NOT CONDUCT INVESTIGATIONS** - These prompts are ready for execution
2. Review this roadmap for completeness
3. Confirm investigation priority order aligns with cascade criticality
4. Create `/validation-reports/` directory
5. Begin Phase 1 investigations (Sessions 3, 4, 7, 8, 9b)
6. Aggregate findings into improvement backlog

---

**End of Validation Roadmap**
