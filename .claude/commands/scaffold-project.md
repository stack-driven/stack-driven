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
4. **Create actual config files** that developers can use immediately
5. **Generate code skeletons** from Session 9b architecture
6. **Validate generated code** to ensure it compiles without errors
7. **Document setup process** so team can get running in minutes

## Critical Philosophy

**This is where strategy meets reality.**

After 11 sessions, users have:
- [✓] Validated user journey
- [✓] Validated product strategy
- [✓] Chosen optimal tech stack
- [✓] Defined strategy (mission, metrics, monetization, architecture)
- [✓] Designed database schema
- [✓] Generated API contracts
- [✓] Created testing strategy
- [✓] Generated prioritized backlog
- [✓] Created GitHub issues

**What they DON'T have**: A single line of working code.

**Session 12 fixes this.** Generate a development environment where the first story can be implemented immediately.

---

## Process

### Step 1: Read ALL Previous Outputs

```
Read: product-guidelines/00-user-journey.ctx.md (context version for token efficiency)
Read: product-guidelines/01-product-strategy.ctx.md (context version for token efficiency)
Read: product-guidelines/02-tech-stack.md (no .ctx version, always read full file)

# Check if constraints exist (Session 2a is optional)
If product-guidelines/02a-constraints.ctx.md exists:
  Read: product-guidelines/02a-constraints.ctx.md (context version for token efficiency)

Read: product-guidelines/02b-coding-standards.ctx.md (context version for token efficiency)

# Check if AI integration strategy exists (Session 3c is optional)
If product-guidelines/02c-ai-integration-strategy.ctx.md exists:
  Read: product-guidelines/02c-ai-integration-strategy.ctx.md (context version for token efficiency)

Read: product-guidelines/04-architecture.md (no .ctx version, always read full file)
Read: product-guidelines/07-database-schema.ctx.md (context version for token efficiency)
Read: product-guidelines/08b-api-contracts.ctx.md (context version for token efficiency)
Read: product-guidelines/09-test-strategy.ctx.md (context version for token efficiency)
Read: product-guidelines/09b-application-architecture.ctx.md (context version for token efficiency)
Read: product-guidelines/10-backlog/BACKLOG.md
```

**Context Optimization**: We read .ctx.md files for significant context reduction:
- `00-user-journey.ctx.md` (~70% smaller) - Contains journey steps, aha moment, and value ratio
- `01-product-strategy.ctx.md` (~65% smaller) - Contains vision, positioning, goals, principles, and roadmap themes
- `02a-constraints.ctx.md` (if exists, ~70% smaller) - Contains critical technical, organizational, and compliance constraints with trade-off decisions
- `02b-coding-standards.ctx.md` (~70% smaller) - Contains framework-specific patterns, file organization, and naming conventions essential for project structure
- `02c-ai-integration-strategy.ctx.md` (if exists, ~70% smaller) - Contains AI SDK configuration, model selection, and implementation patterns needed for scaffold
- `07-database-schema.ctx.md` (~56% smaller) - Contains table list, ERD, relationships sufficient for scaffold generation
- `08b-api-contracts.ctx.md` (Session 8b, ~80% smaller) - Contains endpoint list organized by journey step for controller/route generation
- `09-test-strategy.ctx.md` (~66% smaller) - Contains coverage targets, test types, and quality gates
- `09b-application-architecture.ctx.md` (~60% smaller) - Contains service list with method signatures, repository methods, controller endpoint mappings, and component hierarchy for code skeleton generation

**Extract**:
- **Project name** (from journey)
- **Tech stack choices** (languages, frameworks, databases, tools)
- **Coding standards** (directory structure patterns, file organization, naming conventions)
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

**Example (compliance-saas):**
- **Services**: Web app (Next.js), Background worker (Python)
- **Shared code**: Data models, API contracts, validation schemas
- **Team size**: 2 developers
- **Decision**: **Monorepo with Turborepo**
  - `apps/web/` - Next.js frontend
  - `apps/worker/` - Python background jobs
  - `packages/shared/` - TypeScript types, utilities
  - `packages/database/` - Prisma schema

---

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

**Example structures:**

**JavaScript/TypeScript Monorepo (Turborepo):**
```
project-name/
├── apps/
│   ├── web/                 # Next.js frontend
│   │   ├── src/
│   │   ├── public/
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── api/                 # Express/Fastify API
│       ├── src/
│       ├── package.json
│       └── tsconfig.json
├── packages/
│   ├── ui/                  # Shared React components
│   ├── database/            # Prisma schema & client
│   ├── typescript-config/   # Shared tsconfig
│   └── eslint-config/       # Shared ESLint rules
├── docker-compose.yml       # Local dev services
├── .env.template            # Environment variables
├── turbo.json              # Turborepo config
├── package.json            # Root package
└── README.md
```

**Python Monorepo:**
```
project-name/
├── apps/
│   ├── api/                # FastAPI backend
│   │   ├── src/
│   │   ├── tests/
│   │   └── pyproject.toml
│   └── worker/             # Celery worker
│       ├── src/
│       ├── tests/
│       └── pyproject.toml
├── packages/
│   ├── shared/             # Shared utilities
│   └── models/             # SQLAlchemy models
├── docker-compose.yml
├── .env.template
└── pyproject.toml          # Root config
```

**Simple Single-Repo (No monorepo tool):**
```
project-name/
├── src/                    # Application code
├── tests/
├── public/                 # Static assets
├── docker-compose.yml
├── .env.template
├── package.json (or pyproject.toml)
└── README.md
```

---

### Step 4: Generate Configuration Files

For EACH file, create ACTUAL working configuration (not templates).

#### A. Package Manager Config

**JavaScript/TypeScript - package.json:**

```json
{
  "name": "project-name",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "test": "turbo run test",
    "lint": "turbo run lint",
    "type-check": "turbo run type-check",
    "db:migrate": "cd packages/database && prisma migrate dev",
    "db:studio": "cd packages/database && prisma studio"
  },
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "devDependencies": {
    "turbo": "^1.10.0",
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "eslint": "^8.50.0",
    "prettier": "^3.0.0",
    "typescript": "^5.2.0"
  }
}
```

**Python - pyproject.toml:**

```toml
[tool.poetry]
name = "project-name"
version = "0.1.0"
description = "Description from user journey"
authors = ["Your Name <you@example.com>"]

[tool.poetry.dependencies]
python = "^3.11"
# Add dependencies from tech stack

[tool.poetry.group.dev.dependencies]
pytest = "^7.4.0"
pytest-cov = "^4.1.0"
black = "^23.7.0"
ruff = "^0.0.285"
mypy = "^1.5.0"

[build-system]
requires = ["poetry-core"]
build-backend = "poetry.core.masonry.api"

[tool.black]
line-length = 100
target-version = ['py311']

[tool.ruff]
line-length = 100
select = ["E", "F", "I"]

[tool.mypy]
python_version = "3.11"
strict = true
```

#### B. Docker Compose (Local Development)

**Generate based on architecture services:**

```yaml
version: '3.8'

services:
  # Database (from tech stack - PostgreSQL example)
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: ${DB_NAME:-app_dev}
      POSTGRES_USER: ${DB_USER:-postgres}
      POSTGRES_PASSWORD: ${DB_PASSWORD:-postgres}
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Redis (if in tech stack)
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Development database UI (optional but useful)
  pgadmin:
    image: dpage/pgadmin4:latest
    environment:
      PGADMIN_DEFAULT_EMAIL: ${PGADMIN_EMAIL:-admin@example.com}
      PGADMIN_DEFAULT_PASSWORD: ${PGADMIN_PASSWORD:-admin}
    ports:
      - "5050:80"
    depends_on:
      postgres:
        condition: service_healthy

volumes:
  postgres_data:
  redis_data:
```

**Customize based on tech stack:**
- PostgreSQL → Use above
- MongoDB → Replace with mongo:7 image
- MySQL → Replace with mysql:8 image
- Add services from architecture: Message queues (RabbitMQ), caching (Redis), search (Elasticsearch)

#### C. Environment Configuration

**Create `.env.template`** (developers copy to `.env`):

```bash
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=app_dev
DB_USER=postgres
DB_PASSWORD=postgres
DATABASE_URL=postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}

# Redis Configuration (if applicable)
REDIS_URL=redis://localhost:6379

# API Configuration
API_PORT=3000
API_URL=http://localhost:3000

# Authentication (example - adjust based on tech stack)
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d

# Third-party services (from tech stack integrations)
# STRIPE_SECRET_KEY=sk_test_...
# SENDGRID_API_KEY=SG...

# AI Configuration (if AI integration strategy exists - Session 3c)
# Based on chosen provider and patterns from 02c-ai-integration-strategy.md
# OPENAI_API_KEY=sk-...  # If using OpenAI
# ANTHROPIC_API_KEY=sk-...  # If using Claude
# GEMINI_API_KEY=...  # If using Gemini
# AZURE_OPENAI_API_KEY=...  # If using Azure OpenAI
# AZURE_OPENAI_ENDPOINT=https://...  # If using Azure OpenAI

# Vector Database (if using RAG pattern from Session 3c)
# PINECONE_API_KEY=...  # If using Pinecone
# WEAVIATE_URL=http://localhost:8080  # If using Weaviate
# QDRANT_URL=http://localhost:6333  # If using Qdrant

# Environment
NODE_ENV=development

# Feature flags (optional but recommended)
# FEATURE_DOCUMENT_PROCESSING=true
# FEATURE_AI_EXTRACTION=false
```

**Add variables based on:**
- Tech stack integrations (Stripe, payment providers, etc.)
- Authentication method (Clerk, Auth0, etc.)
- Deployment target (Vercel, AWS, etc.)
- AI integration strategy (if Session 3c exists - API keys, vector DB URLs, model configs)

#### D. CI/CD Pipeline (GitHub Actions)

**Create `.github/workflows/ci.yml`:**

```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  # Job 1: Lint and Type Check
  lint:
    name: Lint and Type Check
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run linter
        run: npm run lint

      - name: Run type check
        run: npm run type-check

  # Job 2: Unit Tests
  test:
    name: Run Tests
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:15-alpine
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: test_db
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run database migrations
        run: npm run db:migrate
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test_db

      - name: Run tests
        run: npm run test
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test_db

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        if: always()

  # Job 3: Build Check
  build:
    name: Build Application
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build
```

**Customize based on tech stack:**
- Python: Use `setup-python` action, `pip install`, `pytest`
- Go: Use `setup-go` action, `go test`, `go build`
- Multi-language: Add multiple jobs for each language

**Add deployment job** (if architecture specifies):
```yaml
  deploy:
    name: Deploy to Staging
    runs-on: ubuntu-latest
    needs: [lint, test, build]
    if: github.ref == 'refs/heads/develop'

    steps:
      - uses: actions/checkout@v4
      # Add deployment steps based on target (Vercel, AWS, Railway, etc.)
```

#### E. Development Documentation (README.md)

**Create comprehensive setup instructions:**

```markdown
# [Project Name]

[One-sentence description from user journey]

## Quick Start

### Prerequisites

- Node.js 20+ (or Python 3.11+)
- Docker & Docker Compose
- Git

### Setup

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd project-name
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.template .env
   # Edit .env with your local values
   ```

4. **Start local services**
   ```bash
   docker-compose up -d
   ```

5. **Run database migrations**
   ```bash
   npm run db:migrate
   ```

6. **Start development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   - Web app: http://localhost:3000
   - API: http://localhost:3001
   - Database UI: http://localhost:5050

## Project Structure

[Generated structure from Step 3]

## Available Scripts

- `npm run dev` - Start development servers
- `npm run build` - Build for production
- `npm run test` - Run tests
- `npm run lint` - Run linter
- `npm run type-check` - Run TypeScript type checking
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open database UI

## Tech Stack

[List from 02-tech-stack.md]

## Architecture

[Key points from 04-architecture.md]

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for development guidelines.

## License

[License information]
```

#### F. Additional Configuration Files

**TypeScript Configuration (tsconfig.json):**
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022"],
    "module": "commonjs",
    "moduleResolution": "node",
    "esModuleInterop": true,
    "strict": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

**ESLint Configuration (.eslintrc.json):**
```json
{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier"
  ],
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint"],
  "root": true,
  "rules": {
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "@typescript-eslint/explicit-function-return-type": "off"
  }
}
```

**Prettier Configuration (.prettierrc):**
```json
{
  "semi": false,
  "singleQuote": true,
  "trailingComma": "es5",
  "printWidth": 100,
  "tabWidth": 2
}
```

**.gitignore:**
```gitignore
# Dependencies
node_modules/
.pnp/
.pnp.js

# Testing
coverage/
*.lcov

# Production
dist/
build/
.next/
out/

# Environment
.env
.env*.local

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Database
*.db
*.sqlite

# Logs
logs/
*.log
npm-debug.log*
```

---

### Step 4.5: Generate Code Skeletons (from Session 9b)

**IMPORTANT**: This step generates actual code files in the **repository root** (not `product-guidelines/`). These are working code files that developers can immediately run and implement.

**Prerequisites**: Check if `product-guidelines/09b-application-architecture.ctx.md` exists. If it doesn't, skip this step gracefully and proceed with config-only scaffold (backward compatible with projects that haven't run Session 9b).

**Philosophy**: This is a **GENERATIVE** process, not template-based. Generate code that follows best practices for the SPECIFIC tech stack chosen in Session 3, adhering to coding standards from Session 3b. Do NOT use generic templates - analyze the stack and generate appropriate code.

**Why**: Bridges gap between configuration and implementation. Developers get 60-80% of boilerplate code pre-generated with proper structure, allowing them to focus on business logic.

**Generative Code Generation Process**:

1. **Load Cascade Context**:
   - Read `02-tech-stack.md` - Understand language, framework, ORM, testing tools
   - Read `02b-coding-standards.ctx.md` - Understand file structure, naming conventions, patterns
   - Read `09b-application-architecture.ctx.md` - Extract services, repositories, controllers, adapters

2. **Analyze Tech Stack** and determine:
   - **Backend language**: TypeScript, Python, Go, Java, C#, Ruby, PHP, Rust, etc.
   - **Backend framework**: Express, FastAPI, NestJS, Django, Flask, Spring Boot, ASP.NET, Rails, Gin, etc.
   - **ORM/Database library**: Prisma, TypeORM, SQLAlchemy, Drizzle, Diesel, Entity Framework, ActiveRecord, etc.
   - **Testing framework**: Jest, Vitest, pytest, Go testing, JUnit, xUnit, RSpec, etc.
   - **DI pattern**: Framework-specific (NestJS decorators, FastAPI Depends, Spring annotations, manual DI container, etc.)

3. **Generate Code Files** using best practices for the specific stack:
   - **File placement**: Follow Session 3b directory structure exactly
   - **Naming conventions**: Follow Session 3b (PascalCase, snake_case, etc.)
   - **Code style**: Follow Session 3b patterns (class-based, functional, composition)
   - **Type annotations**: Use language's type system appropriately
   - **Error handling**: Use framework-specific error patterns
   - **Dependency injection**: Use framework's DI approach (decorators, Depends, manual, etc.)
   - **TODO comments**: Use simple "TODO: Implement" markers without story references

4. **Validate Generated Code**:
   - Ensure all imports resolve correctly
   - Run type checker if applicable:
     - TypeScript: `tsc --noEmit`
     - Python: `mypy`
     - Go: `go build`
   - Verify code compiles/runs without syntax errors
   - If errors occur, fix and document in scaffold output

#### A. Service Files

For each service from Session 9b, **generate** a code file following the tech stack's best practices:

**What to include**:
- Class/module definition appropriate to language (class for OOP, module for functional)
- Constructor/initialization with dependencies (from architecture)
- Method signatures with proper type annotations (from architecture)
- Simple TODO comments for implementation
- Business rules documentation from Session 9b
- Journey step context comments for each method
- Error handling patterns specific to framework

**File Location**: Follow Session 3b directory structure exactly (varies by stack and project preferences)

**Generation Guidelines by Stack**:
- **TypeScript OOP**: Classes with private readonly dependencies, async methods, proper types
- **Python**: Classes or functions based on coding standards, type hints, async/await if needed
- **Go**: Structs with methods, interfaces for dependencies, error returns
- **Java**: Classes with private final fields, dependency injection annotations
- **Rust**: Structs with impl blocks, Result types, async if needed
- **Ruby**: Classes with initialize method, instance variables
- **PHP**: Classes with type declarations (PHP 8+), constructor property promotion
- Use framework-specific patterns (NestJS decorators, FastAPI routers, etc.)

**Example (TypeScript with Express):**
```typescript
// src/features/documents/services/DocumentService.ts

import { DocumentRepository } from '../repositories/DocumentRepository';
import { StorageAdapter } from '@/integrations/storage/StorageAdapter';
import { Document, CreateDocumentDto, Metadata } from '@/types';

/**
 * DocumentService handles document upload and management
 * @journey Serves Journey Step 2: Document Upload and Processing
 */
export class DocumentService {
  constructor(
    private readonly documentRepository: DocumentRepository,
    private readonly storageAdapter: StorageAdapter
  ) {}

  /**
   * Upload document to storage and create database record
   * TODO: Implement document upload functionality
   */
  async uploadDocument(
    userId: string,
    file: File,
    metadata: Metadata
  ): Promise<Document> {
    throw new Error('Not implemented');
  }

  /**
   * Retrieve document by ID with access control
   * TODO: Implement document retrieval with access control
   */
  async getDocument(documentId: string, userId: string): Promise<Document | null> {
    throw new Error('Not implemented');
  }
}
```

**Example (Python with FastAPI):**
```python
# src/services/assessment_service.py

from typing import Optional
from ..repositories.assessment_repository import AssessmentRepository
from ..integrations.ai_adapter import AIAdapter
from ..types import Assessment, CreateAssessmentDto

class AssessmentService:
    """
    AssessmentService handles document assessment and AI processing
    @journey Serves Journey Step 3: AI Assessment Generation
    """

    def __init__(
        self,
        assessment_repository: AssessmentRepository,
        ai_adapter: AIAdapter
    ):
        self.assessment_repository = assessment_repository
        self.ai_adapter = ai_adapter

    async def create_assessment(
        self,
        document_id: str,
        frameworks: list[str]
    ) -> Assessment:
        """
        Create new compliance assessment for document
        TODO: Implement assessment creation logic
        """
        raise NotImplementedError()
```

**Example (Go):**
```go
// internal/services/document_service.go

package services

import (
    "context"
    "myapp/internal/repositories"
    "myapp/internal/types"
)

// DocumentService handles document operations
// @journey Serves Journey Step 2: Document Upload
type DocumentService struct {
    repo    repositories.DocumentRepository
    storage StorageAdapter
}

func NewDocumentService(repo repositories.DocumentRepository, storage StorageAdapter) *DocumentService {
    return &DocumentService{
        repo:    repo,
        storage: storage,
    }
}

// UploadDocument uploads file and creates database record
// TODO: Implement document upload
func (s *DocumentService) UploadDocument(ctx context.Context, userID string, file []byte) (*types.Document, error) {
    return nil, fmt.Errorf("not implemented")
}
```

#### B. Repository Files

For each repository from Session 9b, **generate** a data access layer file:

**What to include**:
- Class/interface/struct definition appropriate to language and ORM
- Constructor/initialization with ORM client dependency
- CRUD method signatures (create, findById, findMany, update, delete)
- Specialized query methods from architecture
- Index usage comments from Session 7 (which indexes are used by which queries)
- Journey context for specialized queries
- Error handling for not found/duplicate cases

**File Location**: Follow Session 3b directory structure

**Generation Guidelines by ORM**:
- **Prisma (TypeScript)**: Class wrapping PrismaClient, typed inputs/outputs, async methods
- **TypeORM (TypeScript)**: Repository pattern with EntityRepository, QueryBuilder for complex queries
- **SQLAlchemy (Python)**: Classes with session management, query methods using ORM syntax
- **Diesel (Rust)**: Structs with connection pool, query DSL, Result types
- **Drizzle (TypeScript)**: Functions or classes using Drizzle ORM query builder
- **Entity Framework (C#)**: Repository classes with DbContext, LINQ queries
- **ActiveRecord (Ruby)**: Model classes with scopes and query methods
- Raw SQL with proper parameterization if no ORM

**Example (Prisma/TypeScript):**
```typescript
// src/features/documents/repositories/DocumentRepository.ts

import { PrismaClient, Document, Prisma } from '@prisma/client';

/**
 * DocumentRepository handles document data access
 * Uses indexes: documents_user_id_idx, documents_created_at_idx (from Session 7)
 */
export class DocumentRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: Prisma.DocumentCreateInput): Promise<Document> {
    // TODO: Implement create method
    return this.prisma.document.create({ data });
  }

  async findById(id: string): Promise<Document | null> {
    // TODO: Implement findById method
    return this.prisma.document.findUnique({ where: { id } });
  }

  // Specialized query using documents_user_id_idx + documents_created_at_idx
  async findRecentByUserId(userId: string, limit: number = 10): Promise<Document[]> {
    // TODO: Implement recent documents query
    return this.prisma.document.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit
    });
  }
}
```

#### C. Controller/Handler Files

For each controller from Session 9b, **generate** an HTTP handler file:

**What to include**:
- Class/router/handler functions (based on framework conventions)
- Constructor/initialization with service dependencies
- Endpoint handler methods matching API contracts from Session 8
- Middleware chain documentation
- Request validation logic placeholders
- **SECURE error handling** (see security note below)
- OpenAPI spec references from Session 8

**File Location**: Follow Session 3b directory structure

**Generation Guidelines by Framework**:
- **Express (TypeScript)**: Controller classes with Request/Response, middleware chain
- **NestJS (TypeScript)**: Controllers with decorators (@Get, @Post), DTOs, exception filters
- **FastAPI (Python)**: Router functions with Depends for DI, Pydantic models for validation
- **Django (Python)**: ViewSets or APIView classes with serializers
- **Flask (Python)**: Blueprint routes with request validation
- **Spring Boot (Java)**: @RestController classes with @RequestMapping, @Valid
- **ASP.NET (C#)**: Controller classes inheriting from ControllerBase, action methods
- **Rails (Ruby)**: Controller classes with action methods, strong parameters
- **Gin (Go)**: Handler functions with gin.Context, middleware chain

**CRITICAL - Error Handling Security**:
- **NEVER expose raw error messages to clients in production** (risk of information leakage)
- Use error codes/types instead of detailed messages
- Only include error details in development environment
- Use framework's error handling middleware when available

**Example (Express/TypeScript with Secure Error Handling):**
```typescript
// src/features/documents/controllers/DocumentController.ts

import { Request, Response, NextFunction } from 'express';
import { DocumentService } from '../services/DocumentService';

/**
 * DocumentController handles document HTTP endpoints
 * Implements endpoints from Session 8 API contracts
 */
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  async uploadDocument(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // TODO: Implement upload document endpoint
      // 1. Validate request (file type, size, metadata)
      // 2. Call documentService.uploadDocument()
      // 3. Return response with document ID and signed URL
      res.status(501).json({
        success: false,
        error: 'NOT_IMPLEMENTED',
        message: 'Endpoint not yet implemented'
      });
    } catch (error) {
      // SECURITY: Don't expose raw error messages
      // Pass to error middleware if available
      if (next) {
        next(error);
      } else {
        res.status(500).json({
          success: false,
          error: 'INTERNAL_ERROR',
          // Only include details in development
          ...(process.env.NODE_ENV === 'development' && {
            details: error instanceof Error ? error.message : String(error)
          })
        });
      }
    }
  }
}
```

**Example (FastAPI/Python):**
```python
# src/routers/documents.py

from fastapi import APIRouter, Depends, UploadFile, HTTPException
from ..services.document_service import DocumentService
from ..types import Document, DocumentMetadata

router = APIRouter(prefix="/api/documents", tags=["documents"])

def get_document_service() -> DocumentService:
    # TODO: Implement dependency injection
    pass

@router.post("/", response_model=Document)
async def upload_document(
    file: UploadFile,
    metadata: DocumentMetadata,
    service: DocumentService = Depends(get_document_service)
):
    """
    Upload document endpoint
    TODO: Implement upload document endpoint
    Implements: POST /api/documents from Session 8
    """
    # TODO: 1. Validate file type and size
    # TODO: 2. Call service.upload_document()
    # TODO: 3. Return document with signed URL
    raise HTTPException(status_code=501, detail="Not implemented")
```

#### D. Test Stubs

For each service/repository/controller, **generate** test files with proper structure:

**What to include**:
- Test suite structure (describe/test/it blocks, or equivalent)
- Mock/stub setup for dependencies
- Test case placeholders with TODO markers
- Test case names from Session 9 test strategy
- Arrange-Act-Assert (AAA) structure comments

**File Location**: Follow Session 3b test directory structure

**Generation Guidelines by Testing Framework**:
- **Jest/Vitest (TypeScript)**: describe/it blocks, vi.fn() or jest.fn() mocks, beforeEach setup
- **pytest (Python)**: Test classes or functions, fixtures for setup, pytest-mock for mocking
- **Go testing**: Functions with *testing.T, table-driven tests, mock interfaces
- **JUnit (Java)**: @Test annotated methods, @Mock annotations, setUp/tearDown
- **xUnit (C#)**: [Fact]/[Theory] attributes, Moq library for mocking
- **RSpec (Ruby)**: describe/it blocks, allow/expect for mocking
- **PHPUnit (PHP)**: Test classes extending TestCase, createMock for dependencies

**Example (Vitest/TypeScript):**
```typescript
// src/features/documents/services/DocumentService.test.ts

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { DocumentService } from './DocumentService';
import { DocumentRepository } from '../repositories/DocumentRepository';
import { StorageAdapter } from '@/integrations/storage/StorageAdapter';

/**
 * DocumentService Tests
 * TODO: Implement tests based on Session 9 test strategy
 */
describe('DocumentService', () => {
  let documentService: DocumentService;
  let mockDocumentRepository: DocumentRepository;
  let mockStorageAdapter: StorageAdapter;

  beforeEach(() => {
    // Arrange: Set up mocks
    mockDocumentRepository = {
      create: vi.fn(),
      findById: vi.fn(),
    } as any;

    mockStorageAdapter = {
      uploadFile: vi.fn(),
      getSignedUrl: vi.fn(),
    } as any;

    documentService = new DocumentService(mockDocumentRepository, mockStorageAdapter);
  });

  describe('uploadDocument', () => {
    it.todo('should upload document to storage');
    it.todo('should create document record in database');
    it.todo('should return document with signed URL');
    it.todo('should throw error for invalid file type');
    it.todo('should throw error for file exceeding size limit');
  });

  describe('getDocument', () => {
    it.todo('should return document if found');
    it.todo('should return null if not found');
    it.todo('should throw error if user lacks access');
  });
});
```

**Example (pytest/Python):**
```python
# tests/unit/services/test_assessment_service.py

import pytest
from unittest.mock import Mock, AsyncMock
from src.services.assessment_service import AssessmentService
from src.repositories.assessment_repository import AssessmentRepository
from src.integrations.ai_adapter import AIAdapter

class TestAssessmentService:
    """
    AssessmentService Tests
    TODO: Implement tests based on Session 9 test strategy
    """

    @pytest.fixture
    def mock_repository(self):
        return Mock(spec=AssessmentRepository)

    @pytest.fixture
    def mock_ai_adapter(self):
        return Mock(spec=AIAdapter)

    @pytest.fixture
    def service(self, mock_repository, mock_ai_adapter):
        return AssessmentService(mock_repository, mock_ai_adapter)

    @pytest.mark.asyncio
    async def test_create_assessment_success(self, service):
        """TODO: Implement test for successful assessment creation"""
        pytest.skip("Not implemented")

    @pytest.mark.asyncio
    async def test_create_assessment_invalid_framework(self, service):
        """TODO: Implement test for invalid framework error"""
        pytest.skip("Not implemented")
```

#### E. Dependency Injection Setup

**Generate** DI/wiring code based on framework's DI approach:

**What to include**:
- Framework-appropriate DI implementation (see guidelines below)
- Registration/resolution for all services, repositories, adapters from Session 9b
- Dependency graph resolution in correct order
- Singleton/scoped lifetime management where appropriate

**File Location**: Follow Session 3b structure or framework conventions

**Generation Guidelines by Framework DI Pattern**:

**Manual DI Container** (Express, custom frameworks):
- Create a DIContainer class with singleton pattern
- Register dependencies in correct order (repositories → services → controllers)
- Provide get/resolve methods for accessing services

**Framework-Native DI** (NestJS, Spring Boot, ASP.NET):
- Use framework's DI decorators (@Injectable, @Service, etc.)
- Create module/provider registration files
- No manual container needed - framework handles it

**Functional DI** (FastAPI, Flask with dependencies):
- Create factory functions that return instances
- Use framework's dependency injection (FastAPI Depends, Flask g)
- Document dependency chain in function signatures

**No DI** (Simple projects, Go without DI library):
- Create main/bootstrap file that manually wires dependencies
- Use constructor injection pattern
- Document initialization order

**Example (Manual DI Container - Express/TypeScript):**
```typescript
// src/config/di-container.ts

import { PrismaClient } from '@prisma/client';
import { DocumentService } from '@/features/documents/services/DocumentService';
import { DocumentRepository } from '@/features/documents/repositories/DocumentRepository';
import { S3StorageAdapter } from '@/integrations/storage/S3StorageAdapter';

/**
 * Dependency Injection Container
 * Manages service lifetimes and dependency resolution
 */
export class DIContainer {
  private static instance: DIContainer;
  private services: Map<string, any> = new Map();

  private constructor() {
    this.registerServices();
  }

  private registerServices() {
    // TODO: Register dependencies from Session 9b in correct order

    // 1. Database connections (singleton)
    const prisma = new PrismaClient();
    this.services.set('PrismaClient', prisma);

    // 2. Integration adapters (singleton)
    const storageAdapter = new S3StorageAdapter();
    this.services.set('StorageAdapter', storageAdapter);

    // 3. Repositories (singleton)
    const documentRepository = new DocumentRepository(prisma);
    this.services.set('DocumentRepository', documentRepository);

    // 4. Services (singleton)
    const documentService = new DocumentService(documentRepository, storageAdapter);
    this.services.set('DocumentService', documentService);

    // TODO: Add other services, repositories, adapters from Session 9b
  }

  static getInstance(): DIContainer {
    if (!DIContainer.instance) {
      DIContainer.instance = new DIContainer();
    }
    return DIContainer.instance;
  }

  get<T>(serviceName: string): T {
    return this.services.get(serviceName);
  }
}
```

**Example (Functional DI - FastAPI/Python):**
```python
# src/dependencies.py

from functools import lru_cache
from sqlalchemy.orm import Session
from .database import SessionLocal
from .services.assessment_service import AssessmentService
from .repositories.assessment_repository import AssessmentRepository
from .integrations.ai_adapter import AIAdapter

def get_db():
    """Database session dependency"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@lru_cache()
def get_ai_adapter() -> AIAdapter:
    """Singleton AI adapter instance"""
    return AIAdapter()

def get_assessment_repository(db: Session = Depends(get_db)) -> AssessmentRepository:
    """Factory for AssessmentRepository"""
    return AssessmentRepository(db)

def get_assessment_service(
    repository: AssessmentRepository = Depends(get_assessment_repository),
    ai_adapter: AIAdapter = Depends(get_ai_adapter)
) -> AssessmentService:
    """Factory for AssessmentService with injected dependencies"""
    return AssessmentService(repository, ai_adapter)

# TODO: Add other service/repository factories from Session 9b
```

**Example (Manual Wiring - Go):**
```go
// cmd/api/main.go

package main

import (
    "database/sql"
    "log"
    "myapp/internal/repositories"
    "myapp/internal/services"
)

func main() {
    // TODO: Wire dependencies from Session 9b

    // 1. Initialize database connection
    db, err := sql.Open("postgres", connString)
    if err != nil {
        log.Fatal(err)
    }
    defer db.Close()

    // 2. Initialize repositories
    documentRepo := repositories.NewDocumentRepository(db)

    // 3. Initialize adapters
    storageAdapter := NewS3Adapter()

    // 4. Initialize services
    documentService := services.NewDocumentService(documentRepo, storageAdapter)

    // 5. Initialize handlers
    documentHandler := NewDocumentHandler(documentService)

    // TODO: Add other components from Session 9b
}
```

**Benefits of Code Skeletons**:
- Developers know exactly what to implement (no architectural decisions needed)
- Test stubs prevent forgetting to write tests
- DI setup ensures proper dependency management
- TODO comments mark implementation points clearly
- Generated code compiles/type-checks immediately
- Architecture from Session 9b enforced in code structure
- Clean separation of concerns (services, repositories, controllers)

#### F. AI Integration Adapters (If Session 3c Exists)

**Generate** AI SDK integration files if `02c-ai-integration-strategy.md` exists:

**What to include**:
- AI provider SDK initialization (OpenAI, Anthropic, Gemini, etc.)
- Model configuration from Session 3c choices
- Prompt templates for each AI feature
- Error handling and fallback strategies
- Rate limiting and retry logic
- Cost tracking utilities
- RAG components if using retrieval pattern (vector store client, chunking utilities)

**File Location**:
- `src/integrations/ai/` or `src/adapters/ai/`
- Separate files per provider if using multiple models

**Example (TypeScript with OpenAI):**
```typescript
// src/integrations/ai/OpenAIAdapter.ts

import OpenAI from 'openai';

/**
 * OpenAI Integration Adapter
 * @ai-strategy Implements Session 3c AI integration patterns
 */
export class OpenAIAdapter {
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  /**
   * Generate assessment based on document content
   * TODO: Implement prompt engineering from Session 3c
   */
  async generateAssessment(
    documentContent: string,
    frameworks: string[]
  ): Promise<string> {
    // TODO: Implement with prompt template
    throw new Error('Not implemented');
  }
}
```

**Example (Python with Anthropic):**
```python
# src/integrations/ai/anthropic_adapter.py

import os
import anthropic
from typing import List

class AnthropicAdapter:
    """
    Anthropic Claude Integration Adapter
    @ai-strategy Implements Session 3c AI integration patterns
    """

    def __init__(self):
        self.client = anthropic.Anthropic(
            api_key=os.environ.get("ANTHROPIC_API_KEY")
        )

    async def generate_assessment(
        self,
        document_content: str,
        frameworks: List[str]
    ) -> str:
        """
        Generate assessment using Claude
        TODO: Implement prompt engineering from Session 3c
        """
        raise NotImplementedError()
```

**Package Dependencies to Add**:

For JavaScript/TypeScript projects, add to appropriate package.json:
```json
{
  "dependencies": {
    "openai": "^4.0.0",  // if using OpenAI
    "@anthropic-ai/sdk": "^0.20.0",  // if using Anthropic
    "@google/generative-ai": "^0.1.0",  // if using Gemini
    "@pinecone-database/pinecone": "^2.0.0",  // if using Pinecone for RAG
    "langchain": "^0.1.0"  // if using LangChain for orchestration
  }
}
```

For Python projects, add to pyproject.toml:
```toml
[tool.poetry.dependencies]
openai = "^1.0.0"  # if using OpenAI
anthropic = "^0.20.0"  # if using Anthropic
google-generativeai = "^0.1.0"  # if using Gemini
pinecone-client = "^3.0.0"  # if using Pinecone for RAG
langchain = "^0.1.0"  # if using LangChain for orchestration
```

**Code Generation Summary**:

After completing Step 4.5, the repository should contain:
- [✓] Service classes with method signatures (business logic layer)
- [✓] Repository classes/interfaces (data access layer)
- [✓] Controller/handler files (HTTP endpoint layer)
- [✓] Test stub files (testing scaffolding)
- [✓] Dependency injection container (wiring)
- [✓] AI integration adapters (if Session 3c exists)
- [✓] All code compiles without errors (type-checked)
- [✓] TODO comments mark implementation points
- [✓] Files organized per Session 3b coding standards

---

### Step 5: Validate Generated Code

**CRITICAL**: Before proceeding, validate that all generated code is syntactically correct and compiles without errors.

**Validation Steps**:

1. **Run Type Checker** (if applicable):
   - TypeScript: `npm run type-check` or `tsc --noEmit`
   - Python: `mypy .` or `mypy src/`
   - Go: `go build ./...`
   - Rust: `cargo check`
   - Java: `mvn compile` or `gradle build`
   - C#: `dotnet build`

2. **Verify All Imports Resolve**:
   - Check that all import statements reference valid modules/packages
   - Ensure relative imports use correct paths
   - Verify external dependencies are listed in package.json/pyproject.toml/go.mod

3. **Check Dependency Injection Wiring**:
   - Verify DI container registers all services, repositories, and adapters
   - Ensure dependency graph has no circular dependencies
   - Confirm correct initialization order (database → repositories → services → controllers)

4. **Ensure TODO Comments Are Present**:
   - Every method/function should have a TODO comment marking implementation point
   - TODO comments should be descriptive (not just "TODO: Implement")
   - Journey context should be documented in service/controller files

5. **Verify File Organization**:
   - Files placed in correct directories per Session 3b coding standards
   - Naming conventions followed (PascalCase, snake_case, etc.)
   - Test files mirror source file structure

**If Validation Fails**:
- Fix syntax errors, import issues, or type errors immediately
- Document any fixes in the scaffold output (Step 6)
- Re-run validation until all checks pass

**If Validation Passes**:
- Proceed to Step 6 (Generate Scaffold Output)
- Include validation results in scaffold documentation

---

### Step 6: Generate Scaffold Output

Create two outputs:

#### A. Documentation (product-guidelines/12-project-scaffold.md)

```markdown
# Project Scaffold

**Generated**: [Date]
**Based on**: Sessions 1-11 outputs (journey through backlog)

## Decisions Made

### Repository Structure
**Decision**: [Monorepo/Multi-repo/Simple]
**Tool**: [Turborepo/Nx/Poetry/None]
**Reasoning**: [Why this structure fits the architecture and team]

### Development Environment
**Services**: [List Docker services]
**Database**: [PostgreSQL/MongoDB/etc.]
**Caching**: [Redis/Memcached/None]
**Message Queue**: [RabbitMQ/SQS/None]

### CI/CD Pipeline
**Platform**: GitHub Actions
**Jobs**: Lint, Test, Build, [Deploy if applicable]
**Test Database**: [How tests run]
**Deployment Target**: [Vercel/AWS/Railway/Manual]

## Generated Files

### Configuration
- [✓] `package.json` (or `pyproject.toml`)
- [✓] `docker-compose.yml`
- [✓] `.env.template`
- [✓] `turbo.json` (if monorepo)
- [✓] `tsconfig.json` (if TypeScript)
- [✓] `.eslintrc.json`
- [✓] `.prettierrc`
- [✓] `.gitignore`

### CI/CD
- [✓] `.github/workflows/ci.yml`

### Documentation
- [✓] `README.md`

### Directory Structure
[Full tree from Step 3]

## Setup Instructions

1. Copy all files from `product-guidelines/12-project-scaffold/` to your project root
2. Run `docker-compose up -d` to start local services
3. Copy `.env.template` to `.env` and fill in values
4. Run `npm install` (or `poetry install`)
5. Run `npm run dev` to start development

## Next Steps

After copying the scaffold:

1. **Initialize Git** (if not already)
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Project scaffold"
   ```

2. **Set up GitHub repository**
   ```bash
   gh repo create project-name --private
   git remote add origin <repo-url>
   git push -u origin main
   ```

3. **Start implementing backlog**
   - Reference `product-guidelines/10-backlog/` for prioritized stories
   - Start with P0 (critical) stories
   - Each story references tech stack and design system

4. **Configure deployment**
   - Set up deployment target (Vercel/AWS/etc.)
   - Add deployment secrets to GitHub
   - Update CI/CD to deploy on merge to main
```

#### B. Actual Files (product-guidelines/12-project-scaffold/)

Create a directory with ALL generated files:

```
product-guidelines/12-project-scaffold/
├── package.json
├── docker-compose.yml
├── .env.template
├── turbo.json
├── tsconfig.json
├── .eslintrc.json
├── .prettierrc
├── .gitignore
├── .github/
│   └── workflows/
│       └── ci.yml
├── README.md
└── apps/ (or src/)
    └── .gitkeep
```

---

### Step 7: Validate Scaffold

**Quality Checklist:**

- [ ] Repository structure matches architecture decisions?
- [ ] All tech stack choices reflected in configs?
- [ ] Docker Compose includes all required services from architecture?
- [ ] CI/CD pipeline runs tests and linting?
- [ ] Environment template includes all necessary variables?
- [ ] README documents complete setup process?
- [ ] Developer can run `docker-compose up && npm install && npm run dev` and see working app?
- [ ] All generated files use correct syntax (valid JSON, YAML, etc.)?
- [ ] Monorepo tool configured correctly (if applicable)?
- [ ] Git ignores sensitive files (.env, node_modules, etc.)?

**Test the scaffold mentally:**
1. Imagine developer clones empty repo
2. They copy scaffold files
3. They follow README
4. Can they start coding first story in <15 minutes?
5. If NO: Scaffold is incomplete

---

## What We DIDN'T Choose (And Why)

### Kubernetes for Local Development

**What it is**: Container orchestration platform, industry standard for production

**Why not (for this journey)**:
- **Journey is MVP stage** (< 1000 users expected from backlog)
- **Team is 1-3 people** (Kubernetes operational overhead is massive)
- **Docker Compose is sufficient** for local dev and small-scale production
- **"Boring is beautiful"** principle - Docker Compose is simpler, well-understood
- **Can migrate later** if scale demands it (Kubernetes is deployment, not architecture change)

**When to reconsider**:
- IF hitting >100K requests/day with scaling bottlenecks
- IF need multi-region deployment (Kubernetes excels at this)
- IF team grows DevOps/platform engineering capability
- IF using managed Kubernetes (GKE, EKS) reduces operational burden

**Example**: If compliance document processing hits 50K docs/day and single-region deployment can't keep up, migrate worker service to Kubernetes for auto-scaling while keeping web app on simpler platform.

---

### Microservices Architecture from Day 1

**What it is**: Each feature as independent service with own database and deployment

**Why not (for this journey)**:
- **Journey is early stage** (MVP, unvalidated scale)
- **Premature optimization** - microservices solve problems you don't have yet
- **Operational complexity** is high (distributed tracing, service mesh, etc.)
- **Team is small** (1-3 people can't maintain 10 services effectively)
- **Data consistency is simpler** in monolith (no distributed transactions)

**When to reconsider**:
- IF team grows >10 engineers (need autonomous teams)
- IF different features need independent scaling (parse service 100x more load than UI)
- IF services have truly different tech requirements (ML service in Python, real-time in Go)
- IF organizational structure demands it (Conway's Law)

**Example**: Monolith for MVP. When document parsing becomes bottleneck (10K docs/day), extract ONLY that service to independent microservice with dedicated resources. Keep rest as monolith.

---

### Feature Branch Deployment (Vercel/Netlify Preview)

**What it is**: Every git branch gets deployed preview URL automatically

**Why not initially**:
- **Great feature but adds complexity** to CI/CD pipeline
- **Cost increases** with many preview deploys
- **MVP focus** - optimize for shipping, not preview URLs
- **Can add later** easily (doesn't require architecture change)

**When to reconsider**:
- IF team grows and wants design/PM review of features
- IF doing A/B testing or customer preview before production
- IF budget allows ($20-50/month for preview deploys)

**Example**: Start with main branch → staging/production only. Add preview deploys when you have 3+ developers and need feature review workflow.

---

### Multi-Stage Docker Builds for Local Dev

**What it is**: Optimized Docker images for production, dev uses docker-compose

**Why not initially**:
- **Local dev with Docker is slower** than native (hot reload, volume mounts)
- **Docker Compose is for infrastructure** (DB, Redis), not app code
- **Better DX to run app natively** and only use Docker for services
- **Can containerize later** for production deployment

**When to reconsider**:
- IF deploying to production via Docker (not Vercel/serverless)
- IF team has environment inconsistencies ("works on my machine")
- IF app has complex native dependencies (image processing, etc.)

**Example**: Dev runs `npm run dev` natively, Docker Compose for PostgreSQL/Redis. When ready for production, create Dockerfile for deployment to Railway/Fly.io/AWS.

---

### Separate Infrastructure Repository

**What it is**: Terraform/Pulumi in separate repo from application code

**Why not**:
- **Journey is pre-launch** (no production infrastructure yet)
- **Managed platforms handle infrastructure** (Vercel, Railway, etc.)
- **Team is small** (infrastructure-as-code is overkill)
- **Can extract later** if infrastructure grows complex

**When to reconsider**:
- IF using AWS/GCP with custom infrastructure (VPCs, load balancers, etc.)
- IF need reproducible infrastructure (disaster recovery, multi-region)
- IF DevOps engineer joins team

**Example**: Start with Vercel/Railway (zero infrastructure code). When scaling to 100K+ users on AWS, extract infrastructure to Terraform repo.

---

## After Generation

```
[✓] Session 12 complete! Development environment ready.

Your Scaffold:
  Complete directory structure
  Configuration files (package.json, docker-compose.yml, etc.)
  CI/CD pipeline (GitHub Actions)
  Developer documentation (README.md)
  Local development services (Docker Compose)

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
5. **One command to rule them all**: `docker-compose up` should start everything needed
6. **Documentation is critical**: README must be complete, step-by-step, tested

## Reference

- Previous session: `/create-gh-issues` (Session 7)
- Next: Start building! Reference backlog in `product-guidelines/10-backlog/` or GitHub issues
- Example: `/examples/compliance-saas/scaffold/` (if created)

---

**Now, bridge the gap from strategy to working code! Generate a complete development environment!**

## Output Format

IMPORTANT: Do not use emojis in generated outputs. Use plain text for all communication.
