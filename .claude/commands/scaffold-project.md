---
description: Session 12 - Project scaffold from backlog to working codebase
---

# Session 12: Scaffold Project

This is **Session 12** of the cascade. You'll generate a complete, runnable development environment that bridges the gap between your strategic backlog and actual code implementation.

## Your Role

You are a senior engineer setting up a new project. Your job is to:

1. **Read previous outputs** (journey, tech stack, architecture, backlog)
2. **Generate working development environment** (not just documentation)
3. **Create actual config files** that developers can use immediately
4. **Set up CI/CD pipeline** for automated testing and deployment
5. **Document setup process** so team can get running in minutes

## Critical Philosophy

**This is where strategy meets reality.**

After 11 sessions, users have:
- ✅ Validated user journey
- ✅ Validated product strategy
- ✅ Chosen optimal tech stack
- ✅ Defined strategy (mission, metrics, monetization, architecture)
- ✅ Designed database schema
- ✅ Generated API contracts
- ✅ Created testing strategy
- ✅ Generated prioritized backlog
- ✅ Created GitHub issues

**What they DON'T have**: A single line of working code.

**Session 12 fixes this.** Generate a development environment where the first story can be implemented immediately.

---

## Process

### Step 1: Read ALL Previous Outputs

```
Read: product-guidelines/00-user-journey.md
Read: product-guidelines/01-product-strategy-essentials.md
Read: product-guidelines/02-tech-stack.md
Read: product-guidelines/02b-coding-standards-essentials.md
Read: product-guidelines/04-architecture.md
Read: product-guidelines/07-database-schema-essentials.md
Read: product-guidelines/08-api-contracts-essentials.md
Read: product-guidelines/09-test-strategy-essentials.md
Read: product-guidelines/09b-application-architecture-essentials.md
Read: product-guidelines/10-backlog/BACKLOG.md
```

**Context Optimization**: We read essentials versions for significant context reduction:
- `01-product-strategy-essentials.md` (~65% smaller) - Contains vision, positioning, goals, principles, and roadmap themes
- `02b-coding-standards-essentials.md` (~70% smaller) - Contains framework-specific patterns, file organization, and naming conventions essential for project structure
- `07-database-schema-essentials.md` (~56% smaller) - Contains table list, ERD, relationships sufficient for scaffold generation
- `08-api-contracts-essentials.md` (~80% smaller) - Contains endpoint list organized by journey step
- `09-test-strategy-essentials.md` (~66% smaller) - Contains coverage targets, test types, and quality gates
- `09b-application-architecture-essentials.md` (~60% smaller) - Contains service list with method signatures, repository methods, controller endpoint mappings, and component hierarchy for code skeleton generation

**Extract**:
- **Project name** (from journey)
- **Tech stack choices** (languages, frameworks, databases, tools)
- **Coding standards** (directory structure patterns, file organization, naming conventions)
- **Architecture decisions** (monorepo vs multi-repo, patterns, modules)
- **Services/modules needed** (from backlog epics)

### Step 2: Determine Repository Structure

**Read architecture decision** (from `05-architecture.md`):
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
# OPENAI_API_KEY=sk-...
# SENDGRID_API_KEY=SG...

# Environment
NODE_ENV=development

# Feature flags (optional but recommended)
# FEATURE_DOCUMENT_PROCESSING=true
# FEATURE_AI_EXTRACTION=false
```

**Add variables based on:**
- Tech stack integrations (Stripe, OpenAI, etc.)
- Authentication method (Clerk, Auth0, etc.)
- Deployment target (Vercel, AWS, etc.)

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

[Key points from 05-architecture.md]

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

**Prerequisites**: Check if `product-guidelines/09b-application-architecture-essentials.md` exists. If it doesn't, skip this step gracefully and proceed with config-only scaffold (backward compatible with projects that haven't run Session 9b).

**Based on** `09b-application-architecture-essentials.md`, generate initial code files with method signatures.

**Why**: Bridges gap between configuration and implementation. Developers can immediately start implementing services with proper structure.

**Code Generation Process**:

1. **Read Architecture Essentials**: Load `09b-application-architecture-essentials.md` to extract:
   - Service list with method signatures
   - Repository list with key methods
   - Controller endpoint mappings
   - Component hierarchy (if frontend)
   - Integration adapters

2. **Determine Language/Framework**: From `02-tech-stack.md`, identify:
   - Backend language (TypeScript/Python/Go)
   - Backend framework (Express/FastAPI/NestJS/Django)
   - Frontend framework (Next.js/React/Vue or none)
   - ORM (Prisma/TypeORM/SQLAlchemy)

3. **Select Templates**: Based on language, use templates from `/templates/code-skeletons/`:
   - `service-{language}.template` for service classes
   - `repository-{language}.template` for repository classes
   - `controller-{language}.template` for controllers/handlers
   - `test-{language}.template` for test stubs
   - `di-container-{language}.template` for dependency injection

4. **Generate Files**: For each architectural component, render template and write to repository root:
   - Place files according to coding standards from Session 2b
   - Include TODO comments with backlog story references
   - Add proper imports and type annotations
   - Ensure dependency injection is set up correctly

5. **Validate Generated Code**: Run type checker to ensure code compiles:
   - TypeScript: `tsc --noEmit` (if TypeScript project)
   - Python: `mypy` (if Python project)
   - If errors, fix and regenerate

#### A. Service Files

For each service from Session 9b, create file with:
- Class definition
- Constructor with dependencies (from architecture)
- Method signatures (from architecture)
- TODO comments referencing backlog stories
- Business rules from Session 9b
- Journey step context for each method

**File Location**: Place in repository root following coding standards from Session 2b:
- TypeScript projects: `src/features/{feature-name}/services/{ServiceName}.ts`
- Python projects: `src/services/{service_name}.py` or `app/services/{service_name}.py`
- Use directory structure from Session 2b coding standards

**Template Used**: `/templates/code-skeletons/service-{language}.template`

**Data Mapping**:
- `serviceName`: From Session 9b service list
- `serviceResponsibility`: From Session 9b service description
- `journeyStep`: Which journey step(s) this serves
- `dependencies`: Repository and adapter dependencies
- `methods`: Method signatures with parameters and return types
- `storyNumber`: Reference to Session 10 backlog stories (fuzzy match by method name)

**Example (TypeScript):**
```typescript
// apps/api/src/features/documents/services/DocumentService.ts

import { DocumentRepository } from '../repositories/DocumentRepository';
import { StorageAdapter } from '@/integrations/storage/StorageAdapter';
import { Document, CreateDocumentDto, Metadata } from '@/types';

export class DocumentService {
  constructor(
    private readonly documentRepository: DocumentRepository,
    private readonly storageAdapter: StorageAdapter
  ) {}

  async uploadDocument(
    userId: string,
    file: File,
    metadata: Metadata
  ): Promise<Document> {
    // TODO: Implement (Story #42 - Document Upload)
    throw new Error('Not implemented');
  }

  async getDocument(documentId: string, userId: string): Promise<Document | null> {
    // TODO: Implement (Story #43 - Document Retrieval)
    throw new Error('Not implemented');
  }

  // ... other methods from Session 9b
}
```

**Example (Python):**
```python
# apps/worker/src/services/assessment_service.py

from typing import Optional
from ..repositories.assessment_repository import AssessmentRepository
from ..integrations.ai_adapter import AIAdapter
from ..types import Assessment, CreateAssessmentDto

class AssessmentService:
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
        TODO: Implement (Story #52 - Create Assessment)
        """
        raise NotImplementedError()

    # ... other methods from Session 9b
```

#### B. Repository Files

For each repository from Session 9b, create file with:
- Class/interface definition
- Constructor with ORM client dependency
- CRUD method signatures
- Specialized query methods from architecture
- Index usage comments from Session 7
- Journey context for specialized queries

**File Location**: Place in repository root following coding standards:
- TypeScript: `src/features/{feature-name}/repositories/{RepositoryName}.ts`
- Python: `src/repositories/{repository_name}.py` or `app/repositories/{repository_name}.py`

**Template Used**: `/templates/code-skeletons/repository-{language}.template`

**Data Mapping**:
- `repositoryName`: From Session 9b repository list
- `entityName`: Database table/entity name from Session 7
- `ormName`: ORM from tech stack (Prisma/TypeORM/SQLAlchemy)
- `methods`: CRUD + specialized query methods
- `indexUsed`: Database indexes from Session 7 schema
- `queryPattern`: SQL pattern comment for clarity

**Example:**
```typescript
// apps/api/src/features/documents/repositories/DocumentRepository.ts

import { PrismaClient, Document, Prisma } from '@prisma/client';

export class DocumentRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: Prisma.DocumentCreateInput): Promise<Document> {
    // TODO: Implement (Story #44 - Document Repository)
    return this.prisma.document.create({ data });
  }

  async findById(id: string): Promise<Document | null> {
    // TODO: Implement
    return this.prisma.document.findUnique({ where: { id } });
  }

  // ... other methods from Session 9b
}
```

#### C. Controller/Handler Files

For each controller from Session 9b, create file with:
- Class definition (or router/handler functions depending on framework)
- Constructor with service dependencies
- Endpoint handler methods matching API contracts from Session 8
- Middleware chain comments
- Request validation logic
- Error handling patterns
- OpenAPI spec references

**File Location**: Place in repository root following coding standards:
- TypeScript: `src/features/{feature-name}/controllers/{ControllerName}.ts`
- Python FastAPI: `src/routers/{resource_name}.py` or `app/routers/{resource_name}.py`
- Framework-specific patterns from Session 2b

**Template Used**: `/templates/code-skeletons/controller-{language}.template`

**Data Mapping**:
- `controllerName`: From Session 9b controller list
- `resourceName`: API resource name (e.g., "documents")
- `basePath`: API path prefix from Session 8 (e.g., "/api/documents")
- `endpoints`: Handler methods for each API endpoint from Session 8
- `middleware`: Authentication, validation, rate limiting
- `openApiReference`: Link to Session 8 API contract

**Example:**
```typescript
// apps/api/src/features/documents/controllers/DocumentController.ts

import { Request, Response } from 'express';
import { DocumentService } from '../services/DocumentService';

export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  async uploadDocument(req: Request, res: Response): Promise<void> {
    try {
      // TODO: Implement (Story #45 - Upload Document Endpoint)
      // 1. Validate request
      // 2. Call service
      // 3. Return response
      res.status(501).json({ error: 'Not implemented' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // ... other endpoints from Session 9b
}
```

#### D. Test Stubs

For each service/repository, create test file with:
- Test suite structure (describe/test blocks)
- Mock setup for dependencies
- Test case placeholders with TODO markers
- Test case descriptions from Session 9 test strategy

**File Location**: Mirror source file structure in test directory:
- TypeScript: `src/features/{feature-name}/services/{ServiceName}.test.ts`
- Python: `tests/unit/services/test_{service_name}.py`

**Template Used**: `/templates/code-skeletons/test-{language}.template`

**Data Mapping**:
- `testSuiteName`: Test suite name (e.g., "DocumentService Tests")
- `componentName`: Component under test
- `testType`: Unit/Integration from Session 9
- `testGroups`: One per method with multiple test cases
- `storyNumber`: Link to backlog story

**Example:**
```typescript
// src/features/documents/services/DocumentService.test.ts

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { DocumentService } from './DocumentService';
import { DocumentRepository } from '../repositories/DocumentRepository';
import { StorageAdapter } from '@/integrations/storage/StorageAdapter';

describe('DocumentService', () => {
  let documentService: DocumentService;
  let mockDocumentRepository: DocumentRepository;
  let mockStorageAdapter: StorageAdapter;

  beforeEach(() => {
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
  });

  // TODO: Add tests for other methods from Session 9b
});
```

#### E. Dependency Injection Setup

Create DI container that wires all dependencies together:
- Singleton pattern for container
- Register all services, repositories, adapters
- Resolve dependencies in correct order
- Helper functions for service resolution

**File Location**: Place in config directory:
- TypeScript: `src/config/di-container.ts`
- Python: `src/config/di_container.py` or use framework's DI (FastAPI Depends)

**Template Used**: `/templates/code-skeletons/di-container-{language}.template`

**Data Mapping**:
- Extract all services, repositories, adapters from Session 9b
- Determine dependency graph (which services need which repositories)
- Generate registration code in correct order

**Example:**
```typescript
// apps/api/src/config/di-container.ts

import { PrismaClient } from '@prisma/client';
import { DocumentService } from '@/features/documents/services/DocumentService';
import { DocumentRepository } from '@/features/documents/repositories/DocumentRepository';
import { S3StorageAdapter } from '@/integrations/storage/S3StorageAdapter';

export class DIContainer {
  private static instance: DIContainer;
  private services: Map<string, any> = new Map();

  private constructor() {
    this.registerServices();
  }

  private registerServices() {
    // Database
    const prisma = new PrismaClient();
    this.services.set('PrismaClient', prisma);

    // Adapters
    const storageAdapter = new S3StorageAdapter();
    this.services.set('StorageAdapter', storageAdapter);

    // Repositories
    const documentRepository = new DocumentRepository(prisma);
    this.services.set('DocumentRepository', documentRepository);

    // Services
    const documentService = new DocumentService(documentRepository, storageAdapter);
    this.services.set('DocumentService', documentService);

    // TODO: Register other services from Session 9b
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

#### E. Test Stubs

For each service/repository, create test file:

**Example:**
```typescript
// apps/api/src/features/documents/services/DocumentService.test.ts

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { DocumentService } from './DocumentService';
import { DocumentRepository } from '../repositories/DocumentRepository';
import { StorageAdapter } from '@/integrations/storage/StorageAdapter';

describe('DocumentService', () => {
  let documentService: DocumentService;
  let mockDocumentRepository: DocumentRepository;
  let mockStorageAdapter: StorageAdapter;

  beforeEach(() => {
    // Create mocks
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
    it.todo('should throw error for file too large');
  });

  // TODO: Add tests for other methods from Session 9b
});
```

**Benefits of Code Skeletons**:
- Developers know exactly what to implement (no architectural decisions needed)
- Test stubs prevent forgetting to write tests
- DI setup ensures proper dependency management
- TODO comments reference specific backlog stories
- Generated code compiles/type-checks immediately
- Architecture from Session 9b enforced in code structure
- Backlog stories from Session 10 linked via TODO comments

**Code Generation Summary**:

After completing Step 4.5, the repository should contain:
- ✅ Service classes with method signatures (business logic layer)
- ✅ Repository classes/interfaces (data access layer)
- ✅ Controller/handler files (HTTP endpoint layer)
- ✅ Test stub files (testing scaffolding)
- ✅ Dependency injection container (wiring)
- ✅ All code compiles without errors (type-checked)
- ✅ TODO comments link to Session 10 backlog stories
- ✅ Files organized per Session 2b coding standards

**Validation**:
- Run type checker: `npm run type-check` (TypeScript) or `mypy .` (Python)
- Verify all imports resolve correctly
- Check that DI container registers all components
- Ensure TODO comments include story numbers

---

### Step 5: Generate Scaffold Output

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
- ✅ `package.json` (or `pyproject.toml`)
- ✅ `docker-compose.yml`
- ✅ `.env.template`
- ✅ `turbo.json` (if monorepo)
- ✅ `tsconfig.json` (if TypeScript)
- ✅ `.eslintrc.json`
- ✅ `.prettierrc`
- ✅ `.gitignore`

### CI/CD
- ✅ `.github/workflows/ci.yml`

### Documentation
- ✅ `README.md`

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

### Step 6: Validate Scaffold

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
✅ Session 8 complete! Development environment ready.

Your Scaffold:
📁 Complete directory structure
⚙️ Configuration files (package.json, docker-compose.yml, etc.)
🔧 CI/CD pipeline (GitHub Actions)
📝 Developer documentation (README.md)
🐳 Local development services (Docker Compose)

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
