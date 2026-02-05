---
description: Session 9 - Create comprehensive testing strategy (unit, integration, E2E, performance)
---

# Create Test Strategy (Session 9) - ORCHESTRATOR

You are the orchestrator for Session 9, coordinating specialized sub-agents to generate a comprehensive testing strategy. Your role is to analyze requirements, conditionally invoke sub-agents based on journey characteristics, and synthesize their outputs into a cohesive test strategy document.

## When to Use This

**This is Session 9** in the core Stack-Driven cascade. Run it:
- After Session 8b (`/generate-api-contracts` - API surface)
- Before Session 10 (`/generate-backlog` - implementation planning)
- When you need to define testing strategy based on journey, architecture, database, and APIs

**Skip this** if:
- You're pre-MVP and validating quickly (test later)
- You have a QA team that defines testing strategy
- Your product doesn't require high reliability (internal tools, prototypes)

---

## Orchestrator Process

### Step 1: Read Context

Load ALL context files needed for analysis:

```
REQUIRED:
Read: product-guidelines/00-user-journey.ctx.md
Read: product-guidelines/02-tech-stack.ctx.md
Read: product-guidelines/04-architecture.ctx.md
Read: product-guidelines/07-database-schema.ctx.md
Read: product-guidelines/08-api-design.ctx.md
Read: product-guidelines/08b-api-contracts.ctx.md

OPTIONAL (if exists):
Read: product-guidelines/02a-constraints.ctx.md
Read: product-guidelines/09b-application-architecture.ctx.md
```

---

### Step 2: Analyze Requirements

Determine which sub-agents to invoke based on journey characteristics:

**Architecture Classification:**
```
What's your architecture?
├─ Frontend SPA (React/Vue/Svelte) → Testing Trophy
├─ Backend API/Microservices → Testing Diamond
├─ Traditional Monolith → Testing Pyramid
└─ Hybrid Full-Stack → Modified Trophy (30% unit, 45% integration, 25% E2E)
```

**Risk Level Detection:**
```
Risk indicators (from journey + constraints):
├─ handles_pii OR handles_financial_data → HIGH risk
├─ compliance_requirements (GDPR, HIPAA, SOC2) → HIGH risk
├─ customer_decisions_depend_on_accuracy → HIGH risk
├─ B2B SaaS OR e-commerce → MEDIUM risk
└─ internal_tools OR MVPs → LOW risk
```

**Integration Points Analysis:**
```
From architecture/API contracts, count:
- external_integrations (AI APIs, payment, email, storage)
- database (PostgreSQL, MongoDB, etc.)
- third_party_services
```

**Extract Key Characteristics:**
- frontend_framework (from tech stack)
- architectural_style (from 04-architecture or 09b-application-architecture)
- slos_defined (from 04-architecture)
- entity_count (from 07-database-schema)
- domain_complexity (from journey - simple CRUD vs complex algorithms)

---

### Step 3: Conditional Sub-Agent Invocation

Based on analysis, invoke applicable sub-agents using Task tool. **Critical**: Only load agents relevant to journey.

#### Step 3.1: Unit Testing Strategy (ALWAYS)

**Condition**: ALWAYS (every codebase needs unit tests)

Use Task tool to invoke `.claude/agents/design-unit-testing-strategy.md`:

**Inputs to provide**:
- Journey context: [from 00-user-journey.ctx.md]
- Tech stack: [from 02-tech-stack.ctx.md]
- Architecture: [from 04-architecture.ctx.md]
- Risk level: [detected in Step 2]

**Expected output**:
- Testing philosophy (TDD/BDD/Pragmatic) based on risk level
- Unit test scope (what gets tested vs not tested)
- Framework selection matching tech stack
- Coverage targets by component
- Mocking strategy
- Test organization patterns

#### Step 3.2: Integration Testing Strategy (CONDITIONAL)

**Condition**: `external_integrations > 0 OR database EXISTS`
**Skip if**: Frontend-only app with no backend

Use Task tool to invoke `.claude/agents/design-integration-testing-strategy.md`:

**Inputs to provide**:
- Architecture: [from 04-architecture.ctx.md]
- Database schema: [from 07-database-schema.ctx.md]
- API contracts: [from 08b-api-contracts.ctx.md]
- Tech stack: [from 02-tech-stack.ctx.md]

**Expected output**:
- Integration strategy (real dependencies vs mocks)
- Testcontainers configuration (if Docker used)
- API contract tests
- Database migration tests

**If condition NOT met**: Skip this agent. Document: "Skipping integration testing (frontend-only app with no backend)"

#### Step 3.3: E2E Testing Strategy (CONDITIONAL)

**Condition**: `frontend_framework != null`
**Skip if**: Backend API-only (no UI to test)

Use Task tool to invoke `.claude/agents/design-e2e-testing-strategy.md`:

**Inputs to provide**:
- User journey: [from 00-user-journey.ctx.md]
- Tech stack: [from 02-tech-stack.ctx.md]
- Architecture: [from 04-architecture.ctx.md]

**Expected output**:
- Critical user journeys to test end-to-end
- Playwright/Cypress configuration
- Test execution strategy (local/CI)
- Visual regression testing approach

**If condition NOT met**: Skip this agent. Document: "Skipping E2E testing (backend API-only, no UI to test)"

#### Step 3.4: Performance Testing Strategy (CONDITIONAL)

**Condition**: `slos_defined (Session 4 or 14) OR expected_traffic == "high"`
**Skip if**: MVP, internal tools, or low traffic

Use Task tool to invoke `.claude/agents/design-performance-testing-strategy.md`:

**Inputs to provide**:
- Architecture SLOs: [from 04-architecture.ctx.md or 14-observability-strategy.ctx.md if exists]
- Journey operations: [from 00-user-journey.ctx.md]
- Tech stack: [from 02-tech-stack.ctx.md]

**Expected output**:
- Load testing strategy (k6, Locust, or Artillery)
- Core Web Vitals performance budgets
- N+1 query prevention strategies
- Database query performance tests

**If condition NOT met**: Skip this agent. Document: "Skipping performance testing (MVP/internal tools/low traffic)"

#### Step 3.5: Security Testing Strategy (CONDITIONAL)

**Condition**: `handles_pii OR handles_financial_data OR authentication_required`
**Skip if**: Public read-only app with no auth or sensitive data

Use Task tool to invoke `.claude/agents/design-security-testing-strategy.md`:

**Inputs to provide**:
- Constraints (PII/compliance): [from 02a-constraints.ctx.md if exists]
- API design: [from 08-api-design.ctx.md]
- Architecture: [from 04-architecture.ctx.md]
- Tech stack: [from 02-tech-stack.ctx.md]

**Expected output**:
- Authentication and authorization test suite
- OWASP Top 10 coverage (injection, XSS, CSRF, etc.)
- SAST/DAST tool configuration
- Trivy container scanning setup

**If condition NOT met**: Skip this agent. Document: "Skipping security testing (public read-only app with no sensitive data)"

#### Step 3.6: Contract Testing Strategy (CONDITIONAL)

**Condition**: `architectural_style == "Microservices"`
**Skip if**: Monolith or Modular Monolith (use integration tests instead)

Use Task tool to invoke `.claude/agents/design-contract-testing-strategy.md`:

**Inputs to provide**:
- Architecture: [from 04-architecture.ctx.md]
- Application architecture: [from 09b-application-architecture.ctx.md if exists]
- Tech stack: [from 02-tech-stack.ctx.md]

**Expected output**:
- Pact workflow (consumer-driven contracts)
- Service boundary definitions
- Pact Broker configuration
- Contract versioning strategy

**If condition NOT met**: Skip this agent. Document: "Skipping contract testing (monolith/modular monolith - using integration tests instead)"

#### Step 3.7: Property-Based Testing Strategy (CONDITIONAL)

**Condition**: `domain_complexity == "high" OR complex_business_rules EXISTS`
**Skip if**: Simple CRUD with no complex algorithms

Use Task tool to invoke `.claude/agents/design-property-based-testing-strategy.md`:

**Inputs to provide**:
- User journey: [from 00-user-journey.ctx.md]
- Database schema: [from 07-database-schema.ctx.md]
- Application architecture: [from 09b-application-architecture.ctx.md if exists]
- Tech stack: [from 02-tech-stack.ctx.md]

**Expected output**:
- Property definitions for complex algorithms
- Hypothesis/fast-check configuration
- Custom generator implementations
- Shrinking strategies

**If condition NOT met**: Skip this agent. Document: "Skipping property-based testing (simple CRUD with no complex algorithms)"

---

### Step 4: Synthesize Sub-Agent Outputs

Combine all sub-agent outputs into unified test strategy document following template:

**Template**: `/templates/09-test-strategy-template.md`

**Synthesis Process:**
1. **Overview Section**: Combine architecture classification, risk level, coverage goals
2. **Testing Philosophy**: Extract from unit testing agent philosophy
3. **Unit Testing**: Insert unit testing agent output
4. **Integration Testing**: Insert integration testing agent output (if invoked)
5. **E2E Testing**: Insert E2E testing agent output (if invoked)
6. **Test Coverage & Quality Gates**: Combine coverage targets from all agents
7. **Test Data Management**: Extract from integration testing agent
8. **Performance Testing**: Insert performance agent output (if invoked)
9. **Security Testing**: Insert security agent output (if invoked)
10. **Testing Workflows**: Add TDD/BDD/Regression patterns
11. **CI/CD Integration**: Combine execution strategies from all agents
12. **What We DIDN'T Choose**: Document alternatives not selected (4+ items)

**Example Synthesis (Compliance SaaS)**:
```markdown
## Overview
Architecture: Hybrid full-stack (Modified Trophy: 30% unit, 45% integration, 25% E2E)
Risk Level: HIGH (customer compliance decisions)
Coverage Goal: 70% overall, 95% for assessment algorithms

[Unit testing section from unit agent]
[Integration testing section from integration agent]
[E2E testing section from E2E agent]
[Performance testing section from performance agent]
[Security testing section from security agent]
```

---

### Step 5: Generate Context File

After writing full test strategy, generate condensed context file for Session 10:

Use Task tool with:
```
subagent_type: general-purpose
description: Generate test strategy context file
prompt: |
  Invoke the context distillation agent to create token-optimized context file.

  Source file: product-guidelines/09-test-strategy.md
  Output file: product-guidelines/09-test-strategy.ctx.md

  Follow .claude/agents/distill-context.md to:
  1. Extract ALL testing frameworks, patterns, quality gates (CRITICAL)
  2. Extract unit/integration/E2E strategies and coverage goals
  3. Remove detailed examples, code samples, framework comparisons
  4. Preserve section structure
  5. Achieve 60-70% token reduction
  6. Add source reference header
```

---

### Step 6: Inform User

Tell user what was generated and next steps:

```
## Session 9 Complete!

I've created your comprehensive testing strategy with conditional sub-agent loading.

**Sub-Agents Invoked:**
- ✓ Unit testing (always)
- [✓/✗] Integration testing (reason)
- [✓/✗] E2E testing (reason)
- [✓/✗] Performance testing (reason)
- [✓/✗] Security testing (reason)
- [✓/✗] Contract testing (reason)
- [✓/✗] Property-based testing (reason)

**Generated Files:**
- product-guidelines/09-test-strategy.md (full strategy)
- product-guidelines/09-test-strategy.ctx.md (condensed for Session 10)

**Key Decisions:**
- Test distribution: [Pyramid/Trophy/Diamond/Modified Trophy]
- Overall coverage target: [%]
- Testing frameworks: [Pytest, Vitest, Playwright, k6, etc.]
- Quality gates: [What blocks CI/CD]

**Token Efficiency:**
- Loaded [X] lines instead of 2,387 ([Y]% reduction)
- Only relevant testing patterns for your journey

**Next Step:**
Run `/generate-backlog` (Session 10) to create implementation stories with test requirements.
```

---

## Critical Orchestrator Rules

1. **Always invoke unit testing** - Universal requirement
2. **Conditional loading only** - Don't load agents for patterns not in journey
3. **Journey-specific synthesis** - Outputs must reference actual features, not generic examples
4. **Token efficiency** - Track and report token savings vs monolithic approach
5. **Template compliance** - Follow `/templates/09-test-strategy-template.md` structure exactly
6. **Context file generation** - Always create .ctx.md for Session 10
7. **Centralized examples** - Reference `/examples/compliance-saas-testing.md`, don't duplicate

---

## Decision Trees (Quick Reference)

**Integration Testing?**
```
IF external_integrations > 0 OR database EXISTS → YES
ELSE → NO (frontend-only)
```

**E2E Testing?**
```
IF frontend_framework != null → YES
ELSE → NO (backend API-only)
```

**Performance Testing?**
```
IF slos_defined OR expected_traffic == "high" → YES
ELSE → NO (MVP/internal tools)
```

**Security Testing?**
```
IF handles_pii OR handles_financial_data OR auth_required → YES
ELSE → NO (public read-only)
```

**Contract Testing?**
```
IF architectural_style == "Microservices" → YES
ELSE → NO (monolith uses integration tests)
```

**Property-Based Testing?**
```
IF domain_complexity == "high" OR complex_algorithms EXISTS → YES
ELSE → NO (simple CRUD)
```

---

## Example Orchestrator Execution

**Journey**: Compliance SaaS
**Analysis**:
- Architecture: Hybrid full-stack
- Risk: HIGH (PII, customer decisions)
- Frontend: React (yes)
- External integrations: 2 (AI API, S3)
- Database: PostgreSQL (multi-tenant)
- Architectural style: Modular Monolith
- Complex logic: YES (assessment scoring)

**Sub-Agents Invoked**:
1. ✓ Unit testing (always)
2. ✓ Integration testing (database + external APIs)
3. ✓ E2E testing (React frontend)
4. ✓ Performance testing (B2B SaaS, high traffic)
5. ✓ Security testing (handles PII, multi-tenant)
6. ✗ Contract testing (not microservices)
7. ✓ Property-based testing (complex scoring algorithm)

**Token Usage**: 1,500 lines (37% reduction from 2,387)

---

## Output Files

1. **Full Testing Strategy** (`product-guidelines/09-test-strategy.md`):
   - All sub-agent outputs synthesized
   - Complete with examples, setup instructions
   - "What We DIDN'T Choose" section
   - 8-12 pages of detailed strategy

2. **Context Documentation** (`product-guidelines/09-test-strategy.ctx.md`):
   - Condensed version (66% reduction)
   - Coverage targets, test types, tools
   - Quality gates for Session 10 backlog
   - 3-4 pages optimized for AI consumption

---

## Remember

**Test what matters, not everything.**

This orchestrator ensures you only load testing patterns relevant to YOUR journey, achieving 40-70% token reduction through conditional sub-agent invocation while maintaining output quality.

**Focus on:**
1. Critical path operations (journey steps 1-3)
2. Business logic and algorithms
3. Security boundaries (auth, multi-tenant isolation)
4. Performance bottlenecks
5. User data integrity

**Avoid waste:**
- Testing framework code
- 100% coverage goals
- Every UI state
- Patterns not in your architecture

---

**Now execute Steps 1-6 to generate the testing strategy!**
