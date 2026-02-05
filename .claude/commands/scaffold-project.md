---
description: Session 12 - Project scaffold from backlog to working codebase
---

# Session 12: Scaffold Project

This is **Session 12** of the cascade. You'll generate a complete, runnable development environment that bridges the gap between your strategic backlog and actual code implementation.

## Your Role

You are a senior engineer setting up a new project. Your job is to:

1. **Read previous outputs** (journey, tech stack, architecture, backlog)
2. **Determine repository structure** (monorepo vs multi-repo)
3. **Generate directory structure** following tech stack conventions
4. **Conditionally invoke specialized sub-agents** for scaffolding
5. **Create actual config files** that developers can use immediately
6. **Validate generated code** to ensure it compiles without errors
7. **Document setup process** so team can get running in minutes

## Critical Philosophy

**This is where strategy meets reality.**

After 11 sessions, users have validated journey, strategy, tech stack, architecture, database schema, API contracts, testing strategy, and backlog - but NO working code.

**Session 12 fixes this.** Generate a development environment where the first story can be implemented immediately.

---

## Process

### Step 1: Read ALL Previous Outputs

```
Read: product-guidelines/00-user-journey.ctx.md
Read: product-guidelines/01-product-strategy.ctx.md
Read: product-guidelines/02-tech-stack.ctx.md

# Check if constraints exist (Session 2a is optional)
If product-guidelines/02a-constraints.ctx.md exists:
  Read: product-guidelines/02a-constraints.ctx.md

Read: product-guidelines/02b-coding-standards.ctx.md

# Check if AI integration strategy exists (Session 3c is optional)
If product-guidelines/02c-ai-integration-strategy.ctx.md exists:
  Read: product-guidelines/02c-ai-integration-strategy.ctx.md

Read: product-guidelines/04-architecture.ctx.md
Read: product-guidelines/07-database-schema.ctx.md
Read: product-guidelines/08b-api-contracts.ctx.md
Read: product-guidelines/09-test-strategy.ctx.md
Read: product-guidelines/09b-application-architecture.ctx.md
Read: product-guidelines/10-backlog/BACKLOG.md
```

**Extract**:
- **Project name** (from journey)
- **Tech stack choices** (languages, frameworks, databases, tools)
- **Coding standards** (directory structure, file organization, naming conventions)
- **Architecture decisions** (monorepo vs multi-repo, patterns, modules)
- **Services/modules needed** (from backlog epics)
- **AI configuration (if exists)** (API keys setup, model selection, SDK initialization)

### Step 2: Determine Repository Structure

**Read architecture decision** (from `04-architecture.md`):
- Monorepo or multi-repo?
- Microservices or monolith?
- Number of distinct services?

**Decision Tree - Repository Type:**

```
1. How many deployable services/apps?
   ├─ 1 service (web app only) → Single repo, simple structure
   ├─ 2-4 services (web + API + worker) → Monorepo with workspaces
   └─ 5+ services → Multi-repo OR monorepo with build orchestration

2. Is there shared code between services?
   ├─ YES → Monorepo (easier to share types, utilities, components)
   └─ NO → Multi-repo is acceptable

3. Team size?
   ├─ 1-3 people → Monorepo (easier to manage, less overhead)
   ├─ 4-10 people → Monorepo with clear module boundaries
   └─ 10+ people → Consider multi-repo (team autonomy)

4. What's the deployment strategy?
   ├─ Everything deploys together → Monorepo, monolith structure
   ├─ Independent deployment → Monorepo with independent build/deploy
   └─ Microservices → Could be either (monorepo = easier, multi = autonomous)
```

### Step 3: Generate Directory Structure

Based on repository type and tech stack, create the appropriate structure.

**Decision Tree - Monorepo Tool:**

```
If monorepo chosen:

1. What's the primary language?
   ├─ JavaScript/TypeScript → Turborepo, Nx, or pnpm workspaces
   ├─ Python → Poetry workspaces or simple requirements structure
   ├─ Go → Go modules with replace directives
   └─ Multi-language → Turborepo (language-agnostic) or Nx

2. Need build orchestration (caching, pipelines)?
   ├─ YES → Turborepo (best DX) or Nx (enterprise features)
   └─ NO → Native workspaces (npm/pnpm/yarn)

3. Monorepo complexity?
   ├─ 2-3 packages → Native workspaces (simplest)
   ├─ 4-10 packages → Turborepo (great balance)
   └─ 10+ packages → Nx (advanced features)
```

Generate appropriate directory structure (monorepo or simple repo) based on decisions.

### Step 4: Generate Configuration Files

Generate core configuration files:

#### A. Package Manager Config
- `package.json` (Node.js) or `pyproject.toml` (Python) or equivalent
- Include dependencies from tech stack
- Include scripts for dev, build, test, lint, type-check

#### B. Environment Configuration
- `.env.template` with all required variables
- Database configuration (from Session 3)
- API keys placeholders (from Session 4 integrations)
- AI configuration (if Session 3c exists)

#### C. Development Documentation
- `README.md` with complete setup instructions
- Prerequisites, installation steps, running locally
- Tech stack summary, architecture overview

#### D. Linting/Formatting Configuration
- `.eslintrc.json` (or equivalent)
- `.prettierrc` (or equivalent)
- Language-specific linter config

#### E. `.gitignore`
- node_modules/, .env, logs/, coverage/, build artifacts

### Step 5: Conditionally Invoke Specialized Sub-Agents

**IMPORTANT**: Sub-agents generate code skeletons and configurations. Invoke them conditionally based on requirements.

#### 5.1: Backend Scaffold (ALWAYS)

Use the Task tool:
- **subagent_type**: `general-purpose`
- **description**: `Generate backend scaffold`
- **prompt**:
  ```
  Invoke the scaffold-backend sub-agent to generate backend code skeletons.

  Agent path: .claude/agents/scaffold-backend.md

  Inputs:
  - Tech stack: [From 02-tech-stack.ctx.md - backend framework, language, ORM]
  - Coding standards: [From 02b-coding-standards.ctx.md - directory structure, naming conventions]
  - Architecture: [From 09b-application-architecture.ctx.md - service layer, repository layer, controller layer patterns]
  - API contracts: [From 08b-api-contracts.ctx.md - endpoint definitions, DTOs]
  - Database schema: [From 07-database-schema.ctx.md - table definitions, ORM models]

  Follow the agent specification to:
  1. Generate service classes (business logic layer)
  2. Generate repository classes (data access layer)
  3. Generate controller classes (API endpoint handlers)
  4. Set up dependency injection container
  5. Add TODO comments for implementation (referencing Session 10 stories)

  Return structured output with:
  - Generated file paths
  - Service class skeletons
  - Repository class skeletons
  - Controller class skeletons
  - DI container configuration
  ```

#### 5.2: Frontend Scaffold (CONDITIONAL)

**Condition**: `frontend_framework != null` (from Session 3 tech stack)
**Skip if**: API-only backend with no frontend

Use Task tool to invoke `.claude/agents/scaffold-frontend.md`:

**Inputs to provide**:
- Tech stack: [From 02-tech-stack.ctx.md - frontend framework, state management, routing]
- Coding standards: [From 02b-coding-standards.ctx.md - component structure, naming conventions]
- Architecture: [From 09b-application-architecture.ctx.md - frontend patterns, data fetching]
- API contracts: [From 08b-api-contracts.ctx.md - endpoint definitions for type-safe client]
- Design system: [From 06-design-system.ctx.md - component library, styling approach]

**Expected output**:
- Component skeletons (React/Vue/Svelte based on tech stack)
- Routing configuration
- State management setup
- API client with type-safe contracts
- TODO comments referencing Session 10 stories

**If condition NOT met**: Skip this agent. Document: "Skipping frontend scaffold (API-only backend - no frontend framework specified in Session 3)"

#### 5.3: Database Scaffold (ALWAYS)

Use the Task tool:
- **subagent_type**: `general-purpose`
- **description**: `Generate database scaffold`
- **prompt**:
  ```
  Invoke the scaffold-database sub-agent to generate database setup files.

  Agent path: .claude/agents/scaffold-database.md

  Inputs:
  - Tech stack: [From 02-tech-stack.ctx.md - database choice, ORM, migration tool]
  - Database schema: [From 07-database-schema.ctx.md - table definitions, relationships, indexes]
  - Architecture: [From 09b-application-architecture.ctx.md - ORM pattern, data access patterns]

  Follow the agent specification to:
  1. Generate migration files (initial schema creation)
  2. Generate ORM models (mapping to database tables)
  3. Generate seed scripts (initial data for development)
  4. Set up connection configuration
  5. Add TODO comments for custom migrations

  Return structured output with:
  - Generated migration file paths
  - ORM model file paths
  - Seed script paths
  - Connection configuration
  ```

#### 5.4: CI/CD Scaffold (ALWAYS)

Use the Task tool:
- **subagent_type**: `general-purpose`
- **description**: `Generate CI/CD scaffold`
- **prompt**:
  ```
  Invoke the scaffold-cicd sub-agent to generate CI/CD pipeline configuration.

  Agent path: .claude/agents/scaffold-cicd.md

  Inputs:
  - Tech stack: [From 02-tech-stack.ctx.md - languages, frameworks, build tools]
  - Test strategy: [From 09-test-strategy.ctx.md - unit tests, integration tests, coverage requirements]
  - Deployment plan: [From 13-deployment-plan.md if exists - deployment strategy, environments]

  Follow the agent specification to:
  1. Generate GitHub Actions workflows (lint, test, build)
  2. Add deployment workflow if Session 13 exists
  3. Configure test coverage reporting
  4. Set up branch protection recommendations
  5. Add status badge instructions

  Return structured output with:
  - Generated workflow file paths
  - Workflow configurations (YAML)
  - Branch protection settings
  - Setup instructions
  ```

#### 5.5: Docker Scaffold (CONDITIONAL)

**Condition**: `deployment_strategy == "containers"` (from Session 13 if exists, or Session 4 architecture)
**Skip if**: Serverless deployment, managed platforms (Vercel, Railway)

Use Task tool to invoke `.claude/agents/scaffold-docker.md`:

**Inputs to provide**:
- Tech stack: [From 02-tech-stack.ctx.md - languages, frameworks, dependencies]
- Architecture: [From 04-architecture.ctx.md - services, deployment strategy]

**Expected output**:
- docker-compose.yml for local development (database, Redis, etc.)
- Production Dockerfile(s) if container deployment
- Docker build configuration
- Container orchestration recommendations

**If condition NOT met**: Skip production Docker scaffold. Document: "Skipping production Docker scaffold (deployment strategy is not containers - using {deployment_strategy} from Session 13/Session 4)". Still generate docker-compose.yml for local dev only (database, Redis, etc.).

#### 5.6: Testing Scaffold (ALWAYS)

Use the Task tool:
- **subagent_type**: `general-purpose`
- **description**: `Generate testing scaffold`
- **prompt**:
  ```
  Invoke the scaffold-testing sub-agent to generate test setup and stubs.

  Agent path: .claude/agents/scaffold-testing.md

  Inputs:
  - Tech stack: [From 02-tech-stack.ctx.md - testing frameworks, test runners]
  - Test strategy: [From 09-test-strategy.ctx.md - unit tests, integration tests, coverage requirements]
  - Architecture: [From 09b-application-architecture.ctx.md - layers to test, patterns]

  Follow the agent specification to:
  1. Generate unit test stubs for services and repositories
  2. Generate integration test stubs for API endpoints
  3. Set up test configuration (jest, pytest, etc.)
  4. Configure coverage reporting
  5. Add test helpers and fixtures

  Return structured output with:
  - Generated test file paths
  - Test configuration files
  - Coverage thresholds
  - Test running instructions
  ```

#### 5.7: i18n Scaffold (CONDITIONAL)

**Condition**: Session 2a constraints mark i18n as required
**Skip if**: i18n NOT marked as required in Session 2a

Use Task tool to invoke `.claude/agents/scaffold-i18n.md`:

**Inputs to provide**:
- Tech stack: [From 02-tech-stack.ctx.md - i18n library chosen in Session 3]
- Constraints: [From 02a-constraints.ctx.md - supported locales, default locale]
- Architecture: [From 09b-application-architecture.ctx.md - i18n integration patterns]

**Expected output**:
- `/locales/` folder structure with translation files (en.json, fr.json, etc.)
- i18n configuration file
- Locale detection setup
- Translation key extraction instructions

**If condition NOT met**: Skip this agent. Document: "Skipping i18n scaffold (internationalization not marked as required in Session 2a constraints)"

#### 5.8: Integration Adapters Scaffold (CONDITIONAL)

**Condition**: `third_party_integrations.length > 0` (from Session 4 architecture)
**Skip if**: No third-party integrations listed

Use Task tool to invoke `.claude/agents/scaffold-integrations.md`:

**Inputs to provide**:
- Tech stack: [From 02-tech-stack.ctx.md - languages, HTTP clients, SDKs]
- Architecture: [From 04-architecture.ctx.md - integration patterns, third-party services list]
- Coding standards: [From 02b-coding-standards.ctx.md - adapter patterns, error handling conventions]

**Expected output**:
- Adapter class skeletons for each third-party integration (Stripe, S3, SendGrid, etc.)
- Configuration placeholders (.env variables)
- Error handling and retry logic
- Integration test stubs

**If condition NOT met**: Skip this agent. Document: "Skipping integration adapters scaffold (no third-party integrations specified in Session 4 architecture)"

### Step 6: Synthesize Sub-Agent Outputs

Collect outputs from all INVOKED sub-agents (not skipped) and place files in repository root:
- Backend code in appropriate directories (e.g., `src/services/`, `src/repositories/`, `src/controllers/`)
- Frontend code in appropriate directories (e.g., `src/components/`, `src/pages/`, `src/store/`)
- Database migrations in ORM-specific locations (e.g., `prisma/migrations/`, `alembic/versions/`)
- Tests in test directories (e.g., `tests/unit/`, `tests/integration/`)
- Configuration files in root directory

### Step 7: Validate Generated Code

**CRITICAL**: Before proceeding, validate that all generated code is syntactically correct.

**Validation Steps**:
1. **Run Type Checker** (if applicable):
   - TypeScript: `npm run type-check` or `tsc --noEmit`
   - Python: `mypy .` or `mypy src/`
   - Go: `go build ./...`
2. **Verify All Imports Resolve**: Check import statements reference valid modules
3. **Check DI Wiring**: Ensure no circular dependencies
4. **Ensure TODO Comments Present**: Every method should have implementation markers

**If Validation Fails**: Fix errors immediately and document in output.
**If Validation Passes**: Proceed to documentation generation.

### Step 8: Generate Scaffold Documentation

Create `product-guidelines/12-project-scaffold.md` with:

**Decisions Made**:
- Repository structure chosen (monorepo/multi-repo/simple)
- Development environment services (Docker Compose)
- CI/CD pipeline configuration
- Which sub-agents were invoked (and why others were skipped)

**Generated Files**:
- List all configuration files created
- List all code skeleton files created
- Directory structure tree

**Setup Instructions**:
1. Copy files from scaffold to project root
2. Run Docker Compose to start services
3. Copy `.env.template` to `.env`
4. Install dependencies
5. Run migrations
6. Start development server

**Next Steps**:
- Initialize Git repository
- Create GitHub repository
- Start implementing backlog stories

---

## What We DIDN'T Choose (And Why)

### Kubernetes for Local Development
**Why not**: Journey is MVP stage (<1000 users), team is 1-3 people, Docker Compose is sufficient. Kubernetes operational overhead is massive. Can migrate later if scale demands it.

**When to reconsider**: IF hitting >100K requests/day, IF need multi-region deployment, IF team grows DevOps capability.

### Microservices Architecture from Day 1
**Why not**: Journey is early stage (MVP), premature optimization, operational complexity high, team is small (1-3 people), data consistency simpler in monolith.

**When to reconsider**: IF team grows >10 engineers, IF different features need independent scaling, IF truly different tech requirements.

### Feature Branch Deployment
**Why not**: Adds complexity to CI/CD, cost increases, MVP focus = optimize for shipping. Can add later easily.

**When to reconsider**: IF team grows and wants design/PM review, IF doing A/B testing, IF budget allows.

---

## After Generation

```
[✓] Session 12 complete! Development environment ready.

Your Scaffold:
  Complete directory structure
  Configuration files (package.json, docker-compose.yml, etc.)
  Code skeletons (services, repositories, controllers, components)
  CI/CD pipeline (GitHub Actions)
  Developer documentation (README.md)
  Local development services (Docker Compose)

Sub-Agents Invoked:
  [✓] Backend scaffold (always)
  [✓/✗] Frontend scaffold (conditional: frontend_framework exists)
  [✓] Database scaffold (always)
  [✓] CI/CD scaffold (always)
  [✓/✗] Docker scaffold (conditional: container deployment)
  [✓] Testing scaffold (always)
  [✓/✗] i18n scaffold (conditional: Session 2a marks required)
  [✓/✗] Integrations scaffold (conditional: third-party integrations exist)

Next Steps:
1. Copy files from product-guidelines/12-project-scaffold/ to your project root
2. Follow README.md setup instructions
3. Verify environment works (docker-compose up, npm run dev)
4. Start implementing P0 stories from product-guidelines/10-backlog/

When ready, start building or run: /cascade-status
```

---

## Important Guidelines

1. **Generate REAL files**: Not templates with placeholders - actual working configs
2. **Match tech stack**: Every generated file must reflect Session 3 tech choices
3. **Match architecture**: Structure must align with Session 4 architecture decisions
4. **Developer experience**: Setup should take <15 minutes from clone to running
5. **Conditional invocation**: ONLY invoke sub-agents when requirements exist
6. **Token efficiency**: Skip frontend for API-only, skip Docker for serverless, skip i18n when not needed

## Output Format

IMPORTANT: Do not use emojis in generated outputs. Use plain text for all communication.
