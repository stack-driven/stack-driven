---
description: Session 9 - Create comprehensive testing strategy (unit, integration, E2E, performance)
---

# Create Test Strategy (Session 9)

You are helping the user create a comprehensive testing strategy including unit tests, integration tests, E2E tests, test coverage goals, testing frameworks, CI/CD integration, test data management, performance testing, and security testing. This happens after defining database schema (Session 7) and API contracts (Session 8), but BEFORE generating the backlog, so that backlog items can be informed by the testing approach and quality gates.

## When to Use This

**This is Session 9** in the core Stack-Driven cascade. Run it:
- After Session 8 (`/generate-api-contracts` - API surface)
- Before Session 10 (`/generate-backlog` - implementation planning)
- When you need to define testing strategy based on journey, architecture, database, and APIs

**Skip this** if:
- You're pre-MVP and validating quickly (test later)
- You have a QA team that defines testing strategy
- Your product doesn't require high reliability (internal tools, prototypes)

## Your Task

Create comprehensive testing strategy including:
- Testing philosophy (why we test, what we test)
- Unit testing strategy (scope, patterns, coverage)
- Integration testing strategy (API, database, services)
- E2E testing strategy (critical paths, user flows)
- Testing frameworks and tools (from tech stack)
- Test coverage goals and quality gates
- CI/CD integration (when tests run, blocking vs non-blocking)
- Test data management (fixtures, factories, seeding)
- Performance testing (load, stress, benchmark)
- Security testing (auth, authorization, vulnerabilities)
- Testing workflows (TDD, BDD, regression)

---

## Process

### Step 1: Read Previous Outputs

**Required inputs:**

```
Read: product-guidelines/00-user-journey.ctx.md  # (context version for token efficiency)
Read: product-guidelines/02-tech-stack.ctx.md  # (context version for token efficiency)
Read: product-guidelines/04-architecture.ctx.md  # (context version for token efficiency)
Read: product-guidelines/07-database-schema.ctx.md  # (context version for token efficiency)
Read: product-guidelines/08-api-design.ctx.md  # (context version for token efficiency)
Read: product-guidelines/08b-api-contracts.ctx.md  # (context version for token efficiency)
```

**Context Optimization**: We read .ctx.md files for significant context reduction:
- `00-user-journey.ctx.md` - Journey steps and critical paths
- `07-database-schema.ctx.md` (~56% smaller) - Table list, ERD, relationships sufficient for test planning
- `08-api-design.ctx.md` - API paradigm and auth decisions
- `08b-api-contracts.ctx.md` (~79% smaller) - Endpoint list organized by journey step, sufficient for test coverage planning

**Optional inputs (if available):**

```
Read: product-guidelines/10-backlog/BACKLOG.md (if exists - backlog comes after test strategy in Session 10)
Read: product-guidelines/12-project-scaffold.md (if exists - scaffold comes after in Session 12)
```

**Extract from Journey**:
- What are the critical path operations? (These need highest test coverage)
- What user actions MUST work reliably? (These need E2E tests)
- What are the edge cases in the user flow? (These need specific test cases)
- Where is data entered by users? (These need validation testing)

**Extract from Tech Stack**:
- Frontend framework (React, Vue, Svelte) → Component testing tools
- Backend framework (FastAPI, Express, Django) → API testing tools
- Database (PostgreSQL, MongoDB) → Integration test setup
- Testing tools already chosen (Jest, Pytest, Cypress, Playwright)
- CI/CD platform (GitHub Actions, CircleCI, GitLab CI)

**Extract from Architecture**:
- System boundaries (what needs integration tests?)
- External dependencies (what needs mocking/stubbing?)
- Performance requirements (what needs performance tests?)
- Security requirements (what needs security tests?)

**Extract from Backlog (if available)**:
- What features are P0? (These need tests first)
- What features are complex? (These need more test coverage)
- What features handle critical data? (These need thorough testing)
- Note: Backlog is generated AFTER this session, so focus on journey and architecture if backlog doesn't exist yet

**Example (from compliance-saas):**
- Journey critical path: Upload document → Select frameworks → View assessment → Share report
- Tech stack: React (frontend), FastAPI (backend), PostgreSQL (database), Pytest, Playwright
- Architecture: Multi-tenant, async processing, RESTful API
- P0 features: Document upload, AI assessment, results display
- Critical: Document processing must be reliable (customer's compliance depends on it)

---

### Step 1.5: Choose Test Distribution Model

**Decision Tree - Test Model Selection:**

```
What's your architecture?
├─ Frontend SPA (React/Vue/Svelte) → Testing Trophy (20% unit, 50% integration, 30% E2E)
├─ Backend API/Microservices → Testing Diamond (20% unit, 50% integration, 30% E2E)
├─ Traditional Monolith → Testing Pyramid (70% unit, 20% integration, 10% E2E)
└─ Hybrid Full-Stack → Modified Trophy (30% unit, 45% integration, 25% E2E)
```

**Rationale by Model:**

**Testing Pyramid** (70% unit, 20% integration, 10% E2E):
- Best for: Traditional monoliths, backend services with isolated business logic
- Why: Unit tests are fast and cheap, integration tests expensive in monoliths
- Focus: Isolated business logic, pure functions, algorithms

**Testing Trophy** (20% unit, 50% integration, 30% E2E):
- Best for: Frontend SPAs, React/Vue/Svelte applications
- Why: Integration tests provide most confidence for UI behavior (real DOM, real interactions)
- Focus: Component integration, user interactions, state management

**Testing Diamond** (20% unit, 50% integration, 30% E2E):
- Best for: Microservices architectures, distributed systems
- Why: Complexity lies in service interactions, not individual services
- Focus: API contracts, service communication, event handling

**Modified Trophy** (30% unit, 45% integration, 25% E2E):
- Best for: Hybrid full-stack applications (frontend + backend + database)
- Why: Balance between business logic testing and integration testing
- Focus: Business logic (unit), API endpoints (integration), critical paths (E2E)

**Example (compliance-saas):**

```yaml
Architecture: Hybrid full-stack (React + FastAPI + PostgreSQL)
Model: Modified Trophy

Distribution:
  - 30% Unit tests:
    - Assessment scoring algorithms
    - Document parsing logic
    - Validation rules
    - Form validation (frontend)

  - 45% Integration tests:
    - API endpoints (document upload, assessment creation)
    - Database operations (multi-tenant isolation, transactions)
    - External services (AI API, file storage)
    - Component integration (React Testing Library)

  - 25% E2E tests:
    - Complete assessment flow (upload → assess → results)
    - Report sharing flow
    - Team collaboration flow

Rationale:
- Business logic (assessment algorithms) is critical → needs unit tests
- API reliability is critical → needs integration tests
- User journeys are critical → needs E2E tests
- Integration tests provide most confidence for API + database interactions
```

**How to Use This Decision:**
1. Identify your architecture from tech stack (Session 2)
2. Choose test model based on architecture type
3. Use distribution ratios as coverage targets
4. Adjust based on product risk level (high risk → more E2E)

---

### Step 2: Define Testing Philosophy

**Decision Tree - Testing Philosophy:**

```
What's your testing approach?

1. What's the product risk level?
   ├─ High risk (financial, healthcare, compliance) → Extensive testing (80%+ coverage)
   ├─ Medium risk (SaaS, e-commerce) → Pragmatic testing (60-80% coverage)
   └─ Low risk (internal tools, MVPs) → Essential testing (40-60% coverage)

2. What's your testing mindset?
   ├─ TDD (Test-Driven Development) → Write tests before code
   ├─ BDD (Behavior-Driven Development) → Write tests as user scenarios
   └─ Pragmatic → Write tests for critical paths, add as needed

3. What's your quality gate philosophy?
   ├─ No failing tests ever → All tests block CI/CD
   ├─ Critical tests only → Unit/integration tests block, E2E tests warn
   └─ Fast feedback → Fast tests block, slow tests run async
```

**Example testing philosophy (compliance-saas):**

```
Risk Level: HIGH (customers depend on accurate compliance assessments)
Approach: Pragmatic TDD with 70% coverage target
Quality Gates: All unit/integration tests must pass, E2E tests block production

Philosophy:
1. Test what matters: Critical path, data accuracy, security
2. Unit test business logic: Assessment algorithms, validation rules
3. Integration test external dependencies: AI API, file processing
4. E2E test user journeys: Complete flows from upload to report
5. Performance test bottlenecks: Document processing, concurrent assessments
6. Security test boundaries: Auth, authorization, data isolation
```

---

### Step 3: Define Unit Testing Strategy

**Decision Tree - Unit Testing Scope:**

```
What should be unit tested?

1. Business logic (ALWAYS)
   ├─ Calculations, algorithms, transformations
   ├─ Validation rules, business rules
   └─ Pure functions (input → output, no side effects)

2. Utilities and helpers (ALWAYS)
   ├─ String formatting, data parsing
   ├─ Date calculations, currency formatting
   └─ Custom validators, converters

3. Component logic (SELECTIVE)
   ├─ YES: Complex state management, conditional rendering
   ├─ NO: Simple presentational components
   └─ Use component tests for user interactions

4. What NOT to unit test
   ├─ Framework code (React, FastAPI internals)
   ├─ External libraries (axios, lodash)
   ├─ Simple getters/setters
   └─ Configuration files
```

**Example unit testing strategy:**

```yaml
# Unit Test Coverage Targets (compliance-saas)

Backend (Python/FastAPI):
  - Assessment scoring algorithm: 100% (critical business logic)
  - Framework mapping logic: 100% (accuracy critical)
  - Document parser: 90% (handles various formats)
  - Validation rules: 100% (prevent invalid data)
  - API route handlers: 60% (test logic, not framework)
  - Database models: 40% (test custom methods only)

Frontend (React):
  - Assessment result calculations: 100% (display accuracy)
  - Form validation: 100% (prevent bad inputs)
  - State management (Zustand): 80% (complex state logic)
  - React components: 50% (focus on complex components)
  - UI utilities: 80% (formatting, helpers)

Unit Test Patterns:
  - Arrange-Act-Assert (AAA) pattern
  - One assertion per test (mostly - allow related assertions)
  - Test file co-located with source: `assessment.py` → `assessment.test.py`
  - Descriptive test names: `test_assessment_score_calculates_correctly_for_gdpr`
  - Use fixtures/factories for test data
  - Mock external dependencies (AI API, file storage)

Coverage Metrics:
  - Line coverage: % of lines executed (default in most tools)
  - Branch coverage: % of if/else branches tested (BETTER indicator)
  - Target: 70% branch coverage (stricter than line coverage)
  - Why branch matters: 100% line coverage with no branching logic tests = false confidence

Property-Based Testing (Optional - High Value):
  - When to use:
    * Complex algorithms with many edge cases
    * Document parsers (PDFs, DOCXs with various formats)
    * Assessment scoring logic (mathematical properties)
    * Date/time calculations
    * Currency formatting and conversions
  - Tools: Hypothesis (Python), fast-check (JavaScript)
  - Approach: Define properties that ALWAYS hold, generate random inputs to verify

Tools (from tech stack):
  - Backend: Pytest + pytest-asyncio + pytest-cov
  - Frontend: Vitest + Testing Library + MSW (mocking)
  - Coverage reporting: Codecov / Coveralls
  - Coverage threshold: 70% branch coverage overall, 90% for critical modules
```

**Example unit test (backend):**

```python
# tests/test_assessment.py
import pytest
from app.assessment import calculate_compliance_score

def test_compliance_score_perfect_match():
    """Test score calculation when document matches all requirements"""
    requirements = ["encryption", "access_control", "audit_logs"]
    findings = ["encryption", "access_control", "audit_logs"]

    score = calculate_compliance_score(requirements, findings)

    assert score == 100

def test_compliance_score_partial_match():
    """Test score calculation when document misses some requirements"""
    requirements = ["encryption", "access_control", "audit_logs"]
    findings = ["encryption", "access_control"]  # Missing audit_logs

    score = calculate_compliance_score(requirements, findings)

    assert score == 67  # 2/3 = 67%

def test_compliance_score_empty_requirements():
    """Test score calculation when framework has no requirements"""
    requirements = []
    findings = []

    score = calculate_compliance_score(requirements, findings)

    assert score == 100  # Nothing required = perfect compliance
```

**Example unit test (frontend):**

```typescript
// src/components/AssessmentResults.test.tsx
import { render, screen } from '@testing-library/react';
import { AssessmentResults } from './AssessmentResults';

describe('AssessmentResults', () => {
  it('displays score with correct color for high compliance', () => {
    render(<AssessmentResults score={85} findings={[]} />);

    const scoreElement = screen.getByText('85%');
    expect(scoreElement).toHaveClass('text-green-600');
  });

  it('displays score with correct color for low compliance', () => {
    render(<AssessmentResults score={45} findings={[]} />);

    const scoreElement = screen.getByText('45%');
    expect(scoreElement).toHaveClass('text-red-600');
  });

  it('lists all findings with severity indicators', () => {
    const findings = [
      { issue: 'Missing encryption', severity: 'high' },
      { issue: 'Weak passwords', severity: 'medium' }
    ];

    render(<AssessmentResults score={70} findings={findings} />);

    expect(screen.getByText('Missing encryption')).toBeInTheDocument();
    expect(screen.getByText('Weak passwords')).toBeInTheDocument();
  });
});
```

**Example property-based test (Python with Hypothesis):**

```python
# tests/test_assessment_properties.py
from hypothesis import given
import hypothesis.strategies as st
from app.assessment import calculate_compliance_score

@given(requirements=st.lists(st.text()), findings=st.lists(st.text()))
def test_compliance_score_properties(requirements, findings):
    """Test that compliance score always has valid properties"""
    score = calculate_compliance_score(requirements, findings)

    # Property 1: Score is always between 0 and 100
    assert 0 <= score <= 100

    # Property 2: Empty requirements means 100% compliance
    if not requirements:
        assert score == 100

    # Property 3: Finding all requirements means 100% compliance
    if set(findings) >= set(requirements):
        assert score == 100

@given(
    document_size=st.integers(min_value=1, max_value=10_000_000),
    format=st.sampled_from(['pdf', 'docx', 'txt'])
)
def test_document_parser_properties(document_size, format):
    """Test that document parser handles various inputs correctly"""
    # Property: Parser never crashes on valid inputs
    try:
        result = parse_document(size=document_size, format=format)
        assert result is not None
        assert isinstance(result.text, str)
    except ValueError as e:
        # Expected failures for invalid combinations
        assert "unsupported" in str(e).lower()
```

**Example property-based test (JavaScript with fast-check):**

```typescript
// src/utils/formatting.test.ts
import fc from 'fast-check';
import { formatCurrency, parseDate } from './formatting';

describe('formatCurrency properties', () => {
  it('always returns a string with currency symbol', () => {
    fc.assert(
      fc.property(
        fc.float({ min: -1000000, max: 1000000 }),
        (amount) => {
          const formatted = formatCurrency(amount, 'USD');
          expect(typeof formatted).toBe('string');
          expect(formatted).toMatch(/[$]/);
        }
      )
    );
  });

  it('round-trip: parse(format(x)) ≈ x', () => {
    fc.assert(
      fc.property(
        fc.float({ min: 0, max: 1000000 }),
        (amount) => {
          const formatted = formatCurrency(amount, 'USD');
          const parsed = parseCurrency(formatted);
          expect(Math.abs(parsed - amount)).toBeLessThan(0.01);
        }
      )
    );
  });
});
```

---

### Step 4: Define Integration Testing Strategy

**Decision Tree - Integration Testing Scope:**

```
What needs integration testing?

1. External service integrations (ALWAYS)
   ├─ AI/ML APIs (OpenAI, Anthropic)
   ├─ Payment processors (Stripe, PayPal)
   ├─ Email services (SendGrid, Resend)
   └─ File storage (S3, Cloudinary)

2. Database operations (SELECTIVE)
   ├─ YES: Complex queries, transactions, relationships
   ├─ YES: Data integrity constraints
   ├─ NO: Simple CRUD (covered by unit tests with mocks)

3. API endpoints (ALWAYS)
   ├─ Request validation
   ├─ Response format
   ├─ Authentication/authorization
   └─ Error handling

4. Inter-service communication (if microservices)
   ├─ Service-to-service APIs
   ├─ Message queues (RabbitMQ, Redis)
   └─ Event publishers/subscribers
```

**Example integration testing strategy:**

```yaml
# Integration Test Coverage (compliance-saas)

API Integration Tests:
  - Document upload endpoint: Test multipart/form-data handling
  - Assessment creation: Test async job creation + status polling
  - Results retrieval: Test pagination, filtering, authorization
  - Public report sharing: Test token generation + public access
  - Authentication: Test JWT validation, session handling
  - Rate limiting: Test per-user/team limits

Database Integration Tests:
  - Multi-tenant data isolation: User A can't see User B's documents
  - Cascading deletes: Deleting team deletes all related data
  - Transaction handling: Failed assessment doesn't corrupt data
  - Query performance: Test N+1 query prevention
  - Unique constraints: Email uniqueness, framework name uniqueness

External Service Integration Tests:
  - AI API integration: Mock responses, test retry logic
  - File storage (S3): Upload, download, signed URLs
  - Email service: Test email sending (use test mode)

Integration Test Setup:
  - Test database: Testcontainers (industry standard 2025)
  - Database migrations: Run before tests, clean after
  - Test data: Use factories (FactoryBoy) for realistic data
  - External APIs: Use mocks (responses library) or test mode
  - Isolation: Each test gets clean database state

Database Testing with Testcontainers (Industry Standard 2025):
  - Provides production parity with real database instances in Docker
  - Avoids SQL dialect differences (PostgreSQL, not SQLite)
  - Complete isolation: each test run gets fresh instance
  - Auto-cleanup: containers destroyed after tests
  - Works in CI (GitHub Actions, GitLab CI)

Database Reset Strategies:
  Strategy             | Speed    | When to Use
  ---------------------|----------|----------------------------------
  Transaction rollback | Fastest  | Default choice for most tests
  TRUNCATE tables      | Medium   | When testing transaction boundaries
  Fresh container      | Slow     | Only when complete isolation needed

Tools (from tech stack):
  - Backend: Pytest + TestClient (FastAPI) + SQLAlchemy fixtures
  - API testing: httpx + pytest-asyncio
  - Database: Testcontainers (PostgreSQL, MySQL, MongoDB)
  - Mocking: responses (Python) / MSW (JavaScript)
```

**Example integration test (API):**

```python
# tests/integration/test_document_api.py
import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.database import get_db

client = TestClient(app)

@pytest.fixture
def authenticated_user(test_db):
    """Create test user and return auth token"""
    # Create user in test database
    user = create_test_user(email="test@example.com")
    token = generate_jwt_token(user.id)
    return {"Authorization": f"Bearer {token}"}

def test_upload_document_success(authenticated_user):
    """Test document upload with authentication"""
    with open("tests/fixtures/sample.pdf", "rb") as f:
        response = client.post(
            "/api/documents",
            files={"file": ("sample.pdf", f, "application/pdf")},
            headers=authenticated_user
        )

    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "sample.pdf"
    assert data["status"] == "processing"
    assert "id" in data

def test_upload_document_unauthorized():
    """Test document upload fails without authentication"""
    with open("tests/fixtures/sample.pdf", "rb") as f:
        response = client.post(
            "/api/documents",
            files={"file": ("sample.pdf", f, "application/pdf")}
        )

    assert response.status_code == 401

def test_list_documents_shows_only_user_documents(authenticated_user, test_db):
    """Test multi-tenant isolation: users see only their documents"""
    # Create documents for user A (authenticated)
    create_test_document(user_id=1, name="User A Doc")
    # Create documents for user B (different user)
    create_test_document(user_id=2, name="User B Doc")

    response = client.get("/api/documents", headers=authenticated_user)

    assert response.status_code == 200
    documents = response.json()["data"]
    assert len(documents) == 1
    assert documents[0]["name"] == "User A Doc"
```

**Example integration test with testcontainers (Python):**

```python
# tests/integration/conftest.py
import pytest
from testcontainers.postgres import PostgresContainer
from sqlalchemy import create_engine
from app.database import Base

@pytest.fixture(scope="session")
def postgres_container():
    """Start PostgreSQL container for all tests in session"""
    with PostgresContainer("postgres:15") as postgres:
        yield postgres

@pytest.fixture
def test_db(postgres_container):
    """Create fresh database for each test with transaction rollback"""
    engine = create_engine(postgres_container.get_connection_url())

    # Create tables
    Base.metadata.create_all(engine)

    # Start transaction
    connection = engine.connect()
    transaction = connection.begin()

    yield connection

    # Rollback transaction (clean up test data)
    transaction.rollback()
    connection.close()

def test_user_creation(test_db):
    """Test user creation in real PostgreSQL database"""
    user = User(email="test@example.com", name="Test User")
    test_db.add(user)
    test_db.commit()

    # Verify user exists
    found_user = test_db.query(User).filter_by(email="test@example.com").first()
    assert found_user is not None
    assert found_user.name == "Test User"
```

**Example integration test with testcontainers (TypeScript/Node.js):**

```typescript
// tests/integration/database.test.ts
import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { Client } from 'pg';

describe('Database Integration', () => {
  let container: StartedPostgreSqlContainer;
  let client: Client;

  beforeAll(async () => {
    // Start PostgreSQL container
    container = await new PostgreSqlContainer().start();

    // Connect to container
    client = new Client({
      connectionString: container.getConnectionUri()
    });
    await client.connect();

    // Run migrations
    await client.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL
      )
    `);
  });

  afterAll(async () => {
    await client.end();
    await container.stop();
  });

  afterEach(async () => {
    // Clean up data after each test
    await client.query('TRUNCATE TABLE users CASCADE');
  });

  it('creates user and retrieves it', async () => {
    // Insert user
    await client.query(
      'INSERT INTO users (email, name) VALUES ($1, $2)',
      ['test@example.com', 'Test User']
    );

    // Query user
    const result = await client.query(
      'SELECT * FROM users WHERE email = $1',
      ['test@example.com']
    );

    expect(result.rows).toHaveLength(1);
    expect(result.rows[0].name).toBe('Test User');
  });
});
```

**Contract Testing for Microservices:**

If Session 4 architecture has microservices, use contract testing to prevent integration failures.

**Pact (Consumer-Driven Contracts):**

1. Consumer writes test defining expected interaction
2. Pact generates contract JSON
3. Provider verifies against contract
4. Pact Broker manages versions with `can-i-deploy` tool

**Example consumer test (frontend calling assessment API):**

```javascript
// tests/pact/assessment-api.pact.test.js
const { Pact } = require('@pact-foundation/pact');

describe('Assessment API Pact', () => {
  const provider = new Pact({
    consumer: 'ComplianceUI',
    provider: 'AssessmentAPI',
    port: 8080
  });

  beforeAll(() => provider.setup());
  afterAll(() => provider.finalize());

  it('retrieves assessment results', async () => {
    await provider.addInteraction({
      state: 'assessment 123 exists',
      uponReceiving: 'a request for assessment results',
      withRequest: {
        method: 'GET',
        path: '/api/assessments/123',
        headers: { 'Authorization': 'Bearer token123' }
      },
      willRespondWith: {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: {
          id: 123,
          score: 85,
          status: 'complete',
          findings: []
        }
      }
    });

    // Test your code that calls the API
    const result = await fetchAssessment(123);
    expect(result.score).toBe(85);

    await provider.verify();
  });
});
```

**Example provider verification (backend):**

```python
# tests/pact/verify_pacts.py
from pact import Verifier

verifier = Verifier(
    provider='AssessmentAPI',
    provider_base_url='http://localhost:8000'
)

# Verify against consumer contracts
verifier.verify_pacts(
    './pacts/ComplianceUI-AssessmentAPI.json',
    provider_states_setup_url='http://localhost:8000/_pact/setup'
)
```

**CI/CD Integration for Contract Testing:**

```bash
# Before deploying, check compatibility
pact-broker can-i-deploy \
  --pacticipant AssessmentAPI \
  --version $GIT_COMMIT \
  --to production
```

**When to Use Contract Testing:**
- Microservices architecture (from Session 4)
- Multiple teams owning different services
- Services deployed independently
- API changes need coordination

**Message Queue Testing (if architecture uses queues):**

```python
# tests/integration/test_message_queue.py
from testcontainers.kafka import KafkaContainer
from tenacity import retry, stop_after_delay, wait_fixed
import pytest

@pytest.fixture(scope="session")
def kafka_container():
    """Start Kafka container for queue testing"""
    with KafkaContainer() as kafka:
        yield kafka

@retry(stop=stop_after_delay(10), wait=wait_fixed(0.5))
def wait_for_message_processed(order_id, order_repo):
    """Wait for async processing with timeout"""
    order = order_repo.find_by_id(order_id)
    assert order.status == "processed"

def test_order_processing(kafka_container, order_repo):
    """Test async order processing via Kafka"""
    # Publish message to Kafka
    producer.send('orders', {
        'order_id': 'order_123',
        'items': ['item1', 'item2']
    })

    # Wait for async processing (up to 10 seconds)
    wait_for_message_processed('order_123', order_repo)

    # Verify order was processed
    order = order_repo.find_by_id('order_123')
    assert order.status == "processed"
```

**Message Queue Test Patterns:**
- Pre-populate topics with test data
- Verify partition ordering guarantees
- Test dead letter queue flows
- Validate schema registry (Avro/Protobuf)

---

### Step 5: Define E2E Testing Strategy

**Decision Tree - E2E Testing Scope:**

```
What needs E2E testing?

1. Critical user journeys (ALWAYS)
   ├─ Journey Step 1-3 (core value delivery)
   ├─ Authentication flow (signup, login, logout)
   └─ Payment flow (if monetized)

2. Happy paths (ALWAYS)
   ├─ Test complete flows start to finish
   └─ One E2E test per major user journey

3. Error scenarios (SELECTIVE)
   ├─ YES: Critical errors users will encounter
   ├─ NO: Edge cases (better in integration tests)

4. What NOT to E2E test
   ├─ Every UI state (too brittle, use component tests)
   ├─ Error handling (use integration tests)
   └─ Business logic (use unit tests)
```

**Example E2E testing strategy:**

```yaml
# E2E Test Coverage (compliance-saas)

Critical Journeys (from user journey steps 1-3):
  1. Complete compliance assessment flow:
     - User signs in
     - Uploads compliance document (PDF)
     - Selects frameworks (SOC2, GDPR)
     - Waits for assessment to complete
     - Views assessment results
     - Downloads report
     Expected: Full flow completes in <5 minutes

  2. Share report flow:
     - User completes assessment (use test account with pre-created assessment)
     - Clicks "Share Report"
     - Generates public link
     - Opens link in incognito (verify public access)
     - Verifies report displays correctly
     Expected: Public report accessible without authentication

  3. Team collaboration flow:
     - Team admin invites new user
     - New user accepts invitation
     - New user sees team's documents
     - New user creates assessment
     - Team admin sees new assessment in team view
     Expected: Multi-user collaboration works

E2E Test Patterns:
  - Page Object Model: Encapsulate page interactions
  - Test data: Use seeded test data or factories
  - Idempotent tests: Each test cleans up after itself
  - Stable selectors: Use data-testid, not CSS classes
  - Wait strategies: Wait for API responses, not arbitrary timeouts
  - Visual regression: Capture screenshots for visual changes

Test Execution:
  - Run on: Staging environment (production-like)
  - Frequency: Every PR (blocking), nightly (full suite)
  - Parallelization: Run tests in parallel (3-5 workers)
  - Retries: Retry flaky tests once (then investigate)
  - Timeouts: 30s per test, 5min per suite

Tools (from tech stack):
  - E2E framework: Playwright (cross-browser support)
  - Visual regression: Percy / Chromatic (optional)
  - Test data: Factories + database seeding
  - CI integration: GitHub Actions (matrix strategy for browsers)
```

**Example E2E test:**

```typescript
// tests/e2e/assessment-flow.spec.ts
import { test, expect } from '@playwright/test';

test('complete assessment flow', async ({ page }) => {
  // Step 1: Sign in
  await page.goto('/login');
  await page.fill('[data-testid="email-input"]', 'test@example.com');
  await page.fill('[data-testid="password-input"]', 'password123');
  await page.click('[data-testid="login-button"]');

  // Wait for redirect to dashboard
  await expect(page).toHaveURL('/dashboard');

  // Step 2: Upload document
  await page.click('[data-testid="upload-button"]');
  const fileInput = await page.locator('input[type="file"]');
  await fileInput.setInputFiles('tests/fixtures/privacy-policy.pdf');

  // Wait for upload to complete
  await expect(page.locator('[data-testid="upload-success"]')).toBeVisible();

  // Step 3: Select frameworks
  await page.click('[data-testid="framework-gdpr"]');
  await page.click('[data-testid="framework-soc2"]');
  await page.click('[data-testid="start-assessment"]');

  // Step 4: Wait for assessment to complete (poll for status)
  await page.waitForSelector('[data-testid="assessment-complete"]', {
    timeout: 60000 // 60 seconds max
  });

  // Step 5: Verify results displayed
  const score = await page.locator('[data-testid="compliance-score"]').textContent();
  expect(score).toMatch(/\d+%/); // Score displayed as percentage

  // Step 6: Download report
  const downloadPromise = page.waitForEvent('download');
  await page.click('[data-testid="download-report"]');
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toContain('compliance-report');
});

test('share report publicly', async ({ page, context }) => {
  // Use pre-seeded assessment for faster test
  await page.goto('/assessments/test-assessment-id');

  // Generate public link
  await page.click('[data-testid="share-button"]');
  const publicLink = await page.locator('[data-testid="public-link"]').textContent();

  // Open link in incognito (new context = no cookies)
  const incognitoPage = await context.newPage();
  await incognitoPage.goto(publicLink);

  // Verify report loads without authentication
  await expect(incognitoPage.locator('[data-testid="report-title"]')).toBeVisible();
  await expect(incognitoPage.locator('[data-testid="login-prompt"]')).not.toBeVisible();
});
```

**Accessibility Testing Automation:**

Integrate axe-core to catch ~57% of WCAG issues automatically. Critical for compliance products, government contracts, and large enterprises.

**Example accessibility test (Playwright + axe-playwright):**

```typescript
// tests/e2e/accessibility.spec.ts
import { test, expect } from '@playwright/test';
import { injectAxe, checkA11y } from 'axe-playwright';

test('homepage accessibility', async ({ page }) => {
  await page.goto('/');
  await injectAxe(page);
  await checkA11y(page);
});

test('dashboard accessibility', async ({ page }) => {
  // Login first
  await page.goto('/login');
  await page.fill('[data-testid="email-input"]', 'test@example.com');
  await page.fill('[data-testid="password-input"]', 'password123');
  await page.click('[data-testid="login-button"]');

  // Check dashboard accessibility
  await injectAxe(page);
  await checkA11y(page);
});

test('assessment results accessibility', async ({ page }) => {
  await page.goto('/assessments/test-assessment-id');
  await injectAxe(page);

  // Check specific WCAG rules
  await checkA11y(page, null, {
    rules: {
      'color-contrast': { enabled: true },
      'button-name': { enabled: true },
      'image-alt': { enabled: true }
    }
  });
});
```

**Example accessibility test (Pytest + axe-selenium-python):**

```python
# tests/e2e/test_accessibility.py
from selenium import webdriver
from axe_selenium_python import Axe
import pytest

@pytest.fixture
def selenium():
    driver = webdriver.Chrome()
    yield driver
    driver.quit()

def test_homepage_accessibility(selenium):
    selenium.get('http://localhost:3000')
    axe = Axe(selenium)

    # Run axe scan
    results = axe.run()

    # Fail if violations found
    assert len(results['violations']) == 0, f"Found {len(results['violations'])} accessibility violations"

    # Generate HTML report
    axe.write_results(results, 'accessibility-report.html')

def test_form_accessibility(selenium):
    selenium.get('http://localhost:3000/upload')
    axe = Axe(selenium)

    # Scan with specific tags (WCAG 2.1 AA)
    results = axe.run(options={'runOnly': {'type': 'tag', 'values': ['wcag2aa']}})

    assert len(results['violations']) == 0
```

**CI/CD Integration for Accessibility:**

```yaml
# .github/workflows/test.yml
- name: Run E2E tests with accessibility checks
  run: npm run test:e2e

- name: Upload accessibility report
  if: failure()
  uses: actions/upload-artifact@v3
  with:
    name: accessibility-report
    path: accessibility-report.html
```

**When Critical:**
- Government contracts (Section 508 compliance)
- Healthcare/compliance products (ADA requirements)
- Large enterprises (legal risk mitigation)
- B2B SaaS (enterprise customers require accessibility)

**What axe-core catches:**
- Color contrast issues (~12% of WCAG violations)
- Missing alt text on images (~10%)
- Missing form labels (~8%)
- Keyboard navigation issues (~7%)
- ARIA misuse (~20%)

**What axe-core DOESN'T catch (manual testing needed):**
- Focus order logic
- Screen reader experience
- Cognitive load issues
- Mobile touch target sizes (some)

---

### Step 6: Define Test Coverage and Quality Gates

**Decision Tree - Coverage Targets:**

```
What's the right coverage target?

1. Product risk level
   ├─ High risk (financial, healthcare, compliance) → 80%+ coverage
   ├─ Medium risk (SaaS, e-commerce) → 60-80% coverage
   └─ Low risk (internal tools, MVPs) → 40-60% coverage

2. Code criticality
   ├─ Business logic, algorithms → 90-100% coverage
   ├─ API handlers, services → 70-80% coverage
   ├─ Database models, utilities → 50-70% coverage
   └─ UI components, views → 40-60% coverage

3. What coverage measures
   ├─ Line coverage: % of lines executed (common)
   ├─ Branch coverage: % of if/else branches tested (better)
   ├─ Function coverage: % of functions called
   └─ Mutation coverage: % of code changes caught by tests (advanced)
```

**Example test coverage strategy:**

```yaml
# Test Coverage Targets (compliance-saas)

Overall Coverage Goal: 70%

Coverage by Component:
  - Assessment engine: 95% (critical business logic)
  - API routes: 80% (high user interaction)
  - Database queries: 70% (data integrity)
  - UI components: 50% (focus on complex components)
  - Utilities: 80% (reused across app)

Coverage by Test Type:
  - Unit tests: 60% coverage of codebase
  - Integration tests: 20% coverage (overlap with unit tests)
  - E2E tests: 10% coverage (critical paths only)

Quality Gates:
  1. All unit tests pass (blocking)
  2. All integration tests pass (blocking)
  3. Coverage >= 70% (blocking)
  4. No decrease in coverage vs main branch (blocking)
  5. E2E tests pass (blocking on main, warning on PR)
  6. No high/critical security vulnerabilities (blocking)
  7. Performance tests pass (non-blocking, informational)

CI/CD Integration:
  - On PR: Run unit + integration tests (< 5 min)
  - On PR: Run E2E smoke tests (5-10 min)
  - On merge to main: Run full E2E suite (20-30 min)
  - Nightly: Run full suite + performance tests (1-2 hours)
  - Before production deploy: Run full suite (required)

Coverage Reporting:
  - Tool: Codecov / Coveralls
  - Report format: HTML (for local), JSON (for CI)
  - Coverage badge: Display in README
  - Coverage trends: Track over time, alert on decreases
```

---

### Step 7: Define Test Data Management

**Decision Tree - Test Data Strategy:**

```
How to manage test data?

1. Test isolation strategy
   ├─ Fresh database per test (slow but isolated)
   ├─ Transactions + rollback (fast, requires discipline)
   └─ Database snapshots (fast, requires setup)

2. Test data creation
   ├─ Fixtures: Pre-defined data (JSON, SQL)
   ├─ Factories: Generate data programmatically (recommended)
   └─ Shared test database: Pre-seeded (fast but shared state)

3. Realistic vs minimal data
   ├─ Minimal: Just enough to test (faster)
   ├─ Realistic: Production-like data (better coverage)
   └─ Hybrid: Minimal for unit, realistic for integration/E2E
```

**Example test data management:**

```yaml
# Test Data Strategy (compliance-saas)

Test Database Setup:
  - Local testing: Docker PostgreSQL (test database)
  - CI testing: PostgreSQL service (GitHub Actions)
  - Database per test suite: pytest-postgresql fixtures
  - Migrations: Run migrations before each test suite
  - Cleanup: Truncate tables after each test class

Test Data Creation:
  - Use factories (FactoryBoy for Python, Fishery for TypeScript)
  - Generate realistic data (Faker library)
  - Minimal data for unit tests (1-2 records)
  - Realistic data for integration/E2E tests (10-20 records)

Example Factory (Python):
  ```python
  # tests/factories.py
  import factory
  from app.models import User, Document, Assessment

  class UserFactory(factory.Factory):
      class Meta:
          model = User

      id = factory.Sequence(lambda n: f"user_{n}")
      email = factory.Faker('email')
      name = factory.Faker('name')
      team_id = factory.LazyAttribute(lambda _: create_team().id)

  class DocumentFactory(factory.Factory):
      class Meta:
          model = Document

      id = factory.Sequence(lambda n: f"doc_{n}")
      name = factory.Faker('file_name', extension='pdf')
      file_size = factory.Faker('random_int', min=1000, max=5000000)
      status = "ready"
      user_id = factory.LazyAttribute(lambda _: UserFactory().id)
  ```

Example Factory Usage:
  ```python
  # tests/test_assessment.py
  def test_create_assessment():
      # Create test data with factories
      user = UserFactory()
      document = DocumentFactory(user_id=user.id)
      frameworks = [FrameworkFactory() for _ in range(2)]

      # Test assessment creation
      assessment = create_assessment(
          document_id=document.id,
          framework_ids=[f.id for f in frameworks]
      )

      assert assessment.status == "pending"
  ```

Fixtures vs Factories Decision:
  Approach  | When to Use                          | Trade-offs
  ----------|--------------------------------------|----------------------------------
  Fixtures  | Lookup tables, reference data, stable| Simple but rigid
  Factories | Test-specific data, dynamic scenarios| Flexible but requires setup
  Hybrid    | Fixtures for static, factories for   | Best balance (recommended)
            | dynamic                              |

Use Fixtures For:
  - Country codes, currencies, timezones
  - User roles, permissions
  - Framework definitions (SOC2, GDPR, ISO 27001)
  - Product categories, tags

Use Factories For:
  - User accounts (unique emails, passwords)
  - Documents (varying sizes, formats, content)
  - Assessments (different scores, statuses)
  - Dynamic test scenarios

PII Handling (for Compliance Products):
  - NEVER use real PII in non-production environments
  - Use Faker for realistic fake data (email, name, SSN, phone)
  - Compliance requirements:
    * GDPR (EU): Data minimization, pseudonymization, right to erasure
    * HIPAA (US Healthcare): Remove 18 identifiers (names, addresses, SSNs, etc.)
    * PCI DSS (Payment Cards): Mask cards (show last 4), never store CVV
  - PII detection: Use Presidio to detect PII before test execution
  - For ML models: Use synthetic data generation (SDV, Gretel.ai, Tonic.ai)

Example PII-safe factory:
  ```python
  # tests/factories.py
  from faker import Faker
  fake = Faker()

  class UserFactory(factory.Factory):
      class Meta:
          model = User

      email = factory.LazyFunction(lambda: fake.email())
      name = factory.LazyFunction(lambda: fake.name())
      ssn = factory.LazyFunction(lambda: fake.ssn())  # Fake SSN
      phone = factory.LazyFunction(lambda: fake.phone_number())
      credit_card = "4111111111111111"  # Test card number
  ```

Test Data Files:
  - Fixtures location: tests/fixtures/
  - Sample documents: tests/fixtures/sample.pdf, tests/fixtures/policy.docx
  - API responses: tests/fixtures/api-responses/ (for mocking)
  - Database seeds: tests/fixtures/seeds.sql (for E2E tests)

Test Data Cleanup:
  - After each test: Truncate tables or rollback transaction
  - After test suite: Drop test database
  - CI cleanup: Delete test database after job
```

---

### Step 8: Define Performance and Security Testing

**Performance Testing Strategy:**

```yaml
# Performance Testing (compliance-saas)

Performance Testing Tools:
  Tool      | Best For                    | Key Strength              | Language
  ----------|-----------------------------|---------------------------|----------
  k6        | Modern DevOps, CI/CD        | Low resource usage, JS    | JavaScript
  Gatling   | Enterprise scale            | Massive load from single  | Scala/Java/JS
            |                             | system                    |
  Locust    | Python teams                | Event-based efficiency    | Python
  JMeter    | Wide protocol support       | Extensive plugins, mature | Java

  Recommendation: k6 for most modern projects (2025 standard)
  - Testing-as-code philosophy
  - 10x lower resource usage than JMeter
  - Native Grafana Cloud integration
  - Excellent CI/CD integration

Load Testing:
  - Tool: k6 (recommended) / Locust / Gatling
  - Scenarios:
    1. Document upload: 10 concurrent users, 100 uploads/min
    2. Assessment status polling: 50 concurrent users, 500 requests/min
    3. Results retrieval: 20 concurrent users, 200 requests/min
  - Success criteria:
    - p95 latency < 500ms (API responses)
    - p99 latency < 2s (API responses)
    - 0% error rate under normal load
    - < 5% error rate under 2x load

Stress Testing:
  - Ramp up users until system breaks
  - Find breaking point (max concurrent users)
  - Document failure mode (graceful degradation?)
  - Success criteria:
    - System handles 2x expected load
    - System fails gracefully (returns 503, not 500)

Benchmark Testing:
  - Critical operations:
    - Document parsing: < 5s for 10MB PDF
    - AI assessment: < 60s for typical document
    - Report generation: < 2s for any assessment
  - Run before/after performance changes
  - Track performance over time

Performance Test Execution:
  - Frequency: Weekly (staging environment)
  - Before production deploy: Run load tests
  - After performance optimization: Run benchmarks
  - CI integration: Optional (long-running)

Core Web Vitals Monitoring (Frontend Products):
  - Essential for SEO and user experience (Google ranking factor)
  - Set performance budgets based on Session 6 design system

  Metric | Good    | Poor    | Impact
  -------|---------|---------|----------------------------
  LCP    | ≤2.5s   | >4.0s   | SEO ranking, conversion
  INP    | ≤200ms  | >500ms  | User experience
  CLS    | ≤0.1    | >0.25   | Visual stability

  Business Case:
  - Vodafone: 31% LCP improvement → 8% sales increase
  - Pinterest: 40% faster perceived wait → 15% SEO traffic increase
  - BBC: 1s faster load time → 10% more users

  Set budgets by page type:
  - Homepage/landing pages: Strictest (LCP ≤2.0s)
  - Product/checkout pages: Critical (LCP ≤2.5s)
  - Dashboard/internal tools: Relaxed (LCP ≤3.5s)

  Use Lighthouse CI for enforcement:
  ```json
  // .lighthouserc.json
  {
    "ci": {
      "assert": {
        "assertions": {
          "largest-contentful-paint": ["error", {"maxNumericValue": 2500}],
          "interactive": ["error", {"maxNumericValue": 5000}],
          "cumulative-layout-shift": ["error", {"maxNumericValue": 0.1}]
        }
      }
    }
  }
  ```

  ```yaml
  # .github/workflows/performance.yml
  - name: Run Lighthouse CI
    run: |
      npm install -g @lhci/cli
      lhci autorun
  ```

Database Query Performance Testing:
  - Prevent N+1 Queries (Common ORM Bug):
    ```python
    # Django - Bad (N+1)
    for user in User.objects.all():
        print(user.profile.bio)  # Separate query for each user

    # Django - Good (1 query)
    for user in User.objects.select_related('profile'):
        print(user.profile.bio)
    ```

  ORM-Specific Solutions:
    ORM               | Solution
    ------------------|---------------------------------------------
    Django            | select_related(), prefetch_related()
    SQLAlchemy        | joinedload(), selectinload()
    Prisma            | include in queries
    Entity Framework  | Include() statements

  Detection Tools:
    - Django Debug Toolbar (dev environment)
    - Scout APM (production monitoring)
    - Bullet gem (Ruby on Rails)
    - Sentry performance monitoring

  Performance Testing:
    ```python
    def test_user_list_no_n_plus_1(django_assert_num_queries):
        with django_assert_num_queries(1):
            users = User.objects.select_related('profile').all()
            for user in users:
                _ = user.profile.bio
    ```
```

**Security Testing Strategy:**

```yaml
# Security Testing (compliance-saas)

Authentication Testing:
  - Test invalid tokens (expired, malformed, wrong signature)
  - Test token expiration and refresh
  - Test password strength requirements
  - Test rate limiting on login endpoint

Authorization Testing:
  - Test user can't access other users' data (multi-tenant isolation)
  - Test role-based access (admin vs regular user)
  - Test API endpoints require authentication
  - Test public endpoints don't leak private data

Input Validation Testing:
  - Test SQL injection (parameterized queries prevent)
  - Test XSS (input sanitization)
  - Test file upload validation (PDF/DOCX only, size limits)
  - Test API input validation (400 for invalid data)

Dependency Scanning:
  - Tool: Snyk / Dependabot / npm audit
  - Frequency: Daily (CI)
  - Action: Create GitHub issue for vulnerabilities
  - Blocking: High/critical vulnerabilities block deploy

SAST (Static Application Security Testing):
  - Choose tool based on stack and needs:

  Tool       | Best For           | Accuracy | Speed        | Cost
  -----------|--------------------|----------|--------------|------
  SonarQube  | 30+ languages,     | Good     | 0.4K loc/sec | Free (Community)
             | quality + security |          |              | Paid (Enterprise)
  Semgrep    | Custom rules,      | 82%      | 20-100K      | Free / Paid
             | open-source        |          | loc/sec      |
  CodeQL     | GitHub-native,     | 88%      | Medium       | Free (public)
             | semantic analysis  |          |              | Paid (private)
  Snyk Code  | AI-trained, low    | Good     | Fast         | Free / Paid
             | false positives    |          |              |

  Accuracy Data (independent testing):
  - CodeQL: 88% accuracy, 5% false positives
  - Semgrep: 82% accuracy, 12% false positives
  - All tools struggle with: logic flaws, authorization, context-dependent vulnerabilities

  Recommendation by Stack:
  - GitHub users: CodeQL (native integration, free for public repos)
  - Speed priority: Semgrep (20-100K loc/sec)
  - Custom rules: Semgrep (YAML-based rule creation)
  - Multi-language monorepo: SonarQube (30+ languages)

  Integration:
  ```yaml
  # .github/workflows/security.yml
  - name: Run CodeQL
    uses: github/codeql-action/analyze@v2

  - name: Run Semgrep
    uses: returntocorp/semgrep-action@v1
  ```

Container Security Scanning:
  - Use Trivy (industry standard 2025):

  ```bash
  # Scan container image
  trivy image nginx:latest

  # Fail CI on HIGH/CRITICAL
  trivy image --severity HIGH,CRITICAL --exit-code 1 myapp:latest

  # Scan Kubernetes cluster
  trivy k8s --report summary cluster

  # Scan IaC files (Terraform, Dockerfile)
  trivy config .
  ```

  Trivy Coverage:
  - Container images (Docker, OCI)
  - File systems and Git repos
  - Kubernetes clusters
  - IaC misconfigurations (Terraform, CloudFormation, Dockerfile)
  - Exposed secrets (AWS keys, API tokens)
  - License issues

  CI/CD Integration:
  ```yaml
  # .github/workflows/security.yml
  - name: Run Trivy container scan
    uses: aquasecurity/trivy-action@master
    with:
      image-ref: myapp:${{ github.sha }}
      format: 'sarif'
      severity: 'HIGH,CRITICAL'
      exit-code: '1'
  ```

  Best Practices:
  - Use minimal base images (Alpine, distroless)
  - Prefer specific tags over `latest`
  - Scan at build time AND in registry
  - Implement image signing (Sigstore/Cosign)
  - Use read-only root filesystems

SAST/DAST/IAST Integration Strategy:
  Stage           | Type | Tools                   | Blocking
  ----------------|------|-------------------------|------------------
  IDE/Pre-commit  | SAST | SonarLint, Semgrep      | No (warnings)
  PR              | SAST | CodeQL, Snyk, Trivy     | Yes (HIGH/CRIT)
  Merge to main   | SCA  | Trivy (container scan)  | Yes (HIGH/CRIT)
  QA environment  | IAST | Contrast Security       | No (informational)
  Pre-release     | DAST | OWASP ZAP               | Yes (HIGH/CRIT)
  Production      | RASP | Contrast Protect        | No (monitor/block)

  IAST (Interactive Application Security Testing):
  - Gray-box: Instruments application runtime during functional testing
  - Detects vulnerabilities in real execution paths
  - Lower false positives than SAST/DAST
  - Tools: Contrast Security, Synopsys Seeker
  - Use during QA functional testing (piggyback on existing tests)

DAST (Dynamic Application Security Testing):
  - Tool: OWASP ZAP / Burp Suite
  - Frequency: Weekly (staging environment)
  - Checks: Authentication bypasses, injection attacks, misconfigurations

  DAST Configuration:
  ```python
  # OWASP ZAP automated scan
  from zapv2 import ZAPv2

  zap = ZAPv2(proxies={'http': 'http://localhost:8080'})
  zap.urlopen('http://staging.myapp.com')
  zap.spider.scan('http://staging.myapp.com')
  zap.ascan.scan('http://staging.myapp.com')

  # Generate report
  alerts = zap.core.alerts()
  high_alerts = [a for a in alerts if a['risk'] == 'High']
  assert len(high_alerts) == 0, f"Found {len(high_alerts)} high-risk vulnerabilities"
  ```

OWASP Top 10 (2021) Test Coverage:
  1. Broken Access Control → Authorization tests
  2. Cryptographic Failures → TLS enforcement, encryption at rest tests
  3. Injection → SQL injection, XSS, command injection tests
  4. Insecure Design → Threat modeling, security requirements
  5. Security Misconfiguration → Default credentials, debug mode checks
  6. Vulnerable Components → Dependency scanning (Snyk/Dependabot)
  7. Authentication Failures → Password strength, session management tests
  8. Software/Data Integrity → CI/CD pipeline security, code signing
  9. Logging/Monitoring Failures → Audit log tests, alerting validation
  10. SSRF → Server-side request forgery prevention tests

  Reference: https://owasp.org/Top10/

Security Test Execution:
  - On PR: Dependency scan + SAST + Container scan (< 3 min)
  - Weekly: DAST scan (30-60 min)
  - Before deploy: All security tests pass (SAST, Container, DAST)
```

---

### Step 9: Define Testing Workflows

**Testing Workflow (TDD Example):**

```
Test-Driven Development (TDD) Workflow:

1. Write failing test
   - Define expected behavior
   - Write test that fails (Red)

2. Write minimal code to pass test
   - Implement just enough to pass (Green)
   - Don't over-engineer

3. Refactor
   - Clean up code
   - Tests still pass (Green)

4. Repeat for next feature

Example TDD workflow (compliance assessment):
  1. Write test: test_assessment_calculates_score()
     - Input: document + framework
     - Expected: score = 85%

  2. Run test → FAIL (function doesn't exist)

  3. Implement calculate_score() function
     - Simple implementation

  4. Run test → PASS

  5. Refactor: Extract helper functions, add comments

  6. Run test → PASS

  7. Next test: test_assessment_handles_missing_requirements()
```

**Regression Testing Workflow:**

```
Regression Testing: Prevent old bugs from coming back

1. Bug discovered in production
   - User reports compliance score incorrect

2. Write test reproducing bug
   - test_compliance_score_handles_empty_sections()
   - Test FAILS (reproduces bug)

3. Fix bug
   - Update calculate_score() function

4. Test PASSES
   - Bug fixed

5. Test remains in suite
   - Prevents regression (bug coming back)

Regression test management:
  - Never delete regression tests
  - Tag tests with issue numbers (test_issue_123)
  - Run full regression suite before releases
```

---

### Step 10: Define CI/CD Integration and Flaky Test Management

**CI/CD Optimization Patterns:**

```yaml
# CI/CD Test Execution Strategy

Test Execution Time Budgets:
  - Unit tests: < 5 minutes
  - Integration tests: < 15 minutes
  - E2E tests: < 30 minutes
  - Full suite: < 60 minutes

Optimization Techniques:
  1. Test Sharding (Parallel Execution):
     - Split tests across multiple workers
     - Sweet spot: 3-5 workers (diminishing returns after)
     - Example: 1000 tests / 5 workers = 200 tests per worker

  2. Affected Test Detection:
     - Only run tests for changed code
     - Tools: Jest --onlyChanged, pytest-testmon
     - Reduces PR test time by 60-80%
     - Run full suite on merge to main

  3. Fail-Fast Strategies:
     - Stop on first failure for rapid feedback
     - Use for unit tests (< 5 min)
     - Run full suite before merge

Parallelization Example:
  ```yaml
  # .github/workflows/test.yml
  test:
    strategy:
      matrix:
        shard: [1, 2, 3, 4, 5]
    steps:
      - run: pytest --shard-id=${{ matrix.shard }} --num-shards=5
  ```

  Affected Test Detection:
  ```yaml
  - name: Run affected tests
    run: |
      if [ "${{ github.event_name }}" == "pull_request" ]; then
        npm test -- --onlyChanged
      else
        npm test  # Full suite on main
      fi
  ```
```

**Flaky Test Management (Atlassian-Proven Strategies):**

```yaml
# Flaky Test Management (compliance-saas)

Problem:
  - Flaky tests destroy CI confidence
  - Teams waste hours debugging "passes locally, fails in CI"
  - Real bugs go unnoticed when teams ignore failures

Atlassian Strategies (350M+ test executions daily):

1. Quarantine Pattern:
   - Isolate flaky tests in separate suite
   - Track separately (don't block CI)
   - Require fixing within 2 weeks or delete
   - Example:
     ```yaml
     # Run stable tests (blocking)
     - run: pytest -m "not flaky"

     # Run quarantined tests (non-blocking)
     - run: pytest -m "flaky" --continue-on-error
     ```

2. Retry with Limit:
   - Retry failed tests max 3 times
   - If passes on retry, mark as "flaky" (investigate)
   - Track flakiness % per test
   - Example:
     ```yaml
     - name: Run tests with retry
       uses: nick-invision/retry@v2
       with:
         timeout_minutes: 10
         max_attempts: 3
         command: npm test
     ```

3. Root Cause Analysis:
   - Common flaky test causes:
     * Timeout issues (insufficient wait time)
     * Race conditions (async operations)
     * Resource leaks (unclosed connections)
     * Environment dependencies (external services)
     * Test pollution (shared state between tests)

   - Debugging approach:
     1. Run test 100 times locally (identify frequency)
     2. Add logging around failure point
     3. Check for timing dependencies
     4. Verify test isolation (can run in any order?)
     5. Fix root cause (don't just increase timeout)

4. Metrics Tracking:
   - Flakiness %: (flaky runs / total runs) * 100
   - Resolution time: Days from detection to fix
   - Quarantine duration: Days in quarantine
   - Target: < 1% flakiness rate

   Example:
     ```python
     # Track flaky test metrics
     @pytest.hookimpl(tryfirst=True, hookwrapper=True)
     def pytest_runtest_makereport(item, call):
         outcome = yield
         report = outcome.get_result()

         if report.when == "call" and report.outcome == "passed":
             # Check if test was retried (flaky)
             if hasattr(item, 'execution_count') and item.execution_count > 1:
                 report_flaky_test(item.nodeid, item.execution_count)
     ```

5. Flaky Test Prevention:
   - Use explicit waits (not sleep)
   - Avoid brittle selectors (use data-testid)
   - Mock external dependencies
   - Clean up resources in teardown
   - Use database transactions (rollback after test)
   - Avoid shared state between tests
```

**CI/CD Integration Example:**

```yaml
# .github/workflows/test.yml (Complete Example)
name: Test

on: [push, pull_request]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        shard: [1, 2, 3]
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-python@v4
        with:
          python-version: '3.11'

      - name: Install dependencies
        run: pip install -r requirements.txt

      - name: Run unit tests (sharded)
        run: pytest tests/unit --shard-id=${{ matrix.shard }} --num-shards=3 --cov --cov-report=xml

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage.xml

  integration-tests:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-python@v4
        with:
          python-version: '3.11'

      - name: Install dependencies
        run: pip install -r requirements.txt

      - name: Run integration tests (with retry)
        uses: nick-invision/retry@v2
        with:
          timeout_minutes: 15
          max_attempts: 2
          command: pytest tests/integration --cov --cov-append

  e2e-tests:
    runs-on: ubuntu-latest
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install Playwright
        run: npx playwright install --with-deps

      - name: Run E2E tests (stable only)
        run: npx playwright test -m "not flaky"

      - name: Run flaky E2E tests (non-blocking)
        run: npx playwright test -m "flaky" --continue-on-error

  security-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Run Trivy container scan
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: myapp:latest
          format: 'sarif'
          severity: 'HIGH,CRITICAL'
          exit-code: '1'

      - name: Run CodeQL
        uses: github/codeql-action/analyze@v2
```

---

### Step 11: Document Testing Strategy

Create comprehensive documentation including:
- Testing philosophy and principles
- Test types and coverage targets
- Testing tools and frameworks
- Test execution workflows
- Test data management
- CI/CD integration
- Flaky test management
- Performance and security testing
- "What We DIDN'T Choose" section

---

## Generating the Output

Use `/templates/09-test-strategy-template.md`.

**Template structure:**

```markdown
# Testing Strategy

## Overview
[Testing philosophy, risk level, coverage goals]

## Testing Philosophy
[Why we test, what we test, TDD vs pragmatic]

## Unit Testing
[Scope, patterns, tools, examples]

## Integration Testing
[API tests, database tests, external services]

## E2E Testing
[Critical journeys, tools, execution]

## Test Coverage
[Targets by component, quality gates, reporting]

## Test Data Management
[Factories, fixtures, database setup, cleanup]

## Performance Testing
[Load tests, stress tests, benchmarks]

## Security Testing
[Auth tests, vulnerability scanning, SAST/DAST]

## Testing Workflows
[TDD, BDD, regression testing]

## CI/CD Integration
[When tests run, blocking vs non-blocking, parallelization]

## Testing Checklist
[Pre-commit, pre-deploy, production monitoring]

## What We DIDN'T Choose
[Alternatives with reasoning]
```

---

## What We DIDN'T Choose (And Why)

### 100% Test Coverage

**What it is**: Requiring every line of code to be tested

**Why not (for this journey)**:
- **Diminishing returns** - Last 20% takes 80% of effort
- **Coverage doesn't equal quality** - 100% coverage can still have bugs
- **Slows development** - Testing every getter/setter is wasteful
- **Journey focus** - Better to test critical paths thoroughly than everything superficially

**When to reconsider**:
- IF building safety-critical system (medical devices, aviation)
- IF regulatory requirement (some finance/healthcare)
- IF legacy system with lots of bugs (increase coverage gradually)

**Example**: Financial trading system needs 100% coverage (money at stake). SaaS compliance tool needs 70% coverage focused on critical paths.

---

### Testing Every UI State

**What it is**: Unit testing every possible UI state and combination

**Why not (for this journey)**:
- **UI changes frequently** - Tests become maintenance burden
- **Brittle tests** - Break with minor CSS/layout changes
- **Better alternatives** - E2E tests cover user flows, visual regression tests catch UI changes
- **Journey focus** - Test user interactions, not implementation details

**When to reconsider**:
- IF complex state management (30+ UI states)
- IF design system library (UI is the product)
- IF regulatory requirement (accessibility testing)

**Example**: Complex data visualization with 50 states - test state logic with unit tests, test rendering with visual regression. Simple CRUD app - use E2E tests for user flows.

---

### Mutation Testing

**What it is**: Automatically modify code to verify tests catch changes

**Why not (for this journey)**:
- **Slow** - Mutation testing is very slow (10x-100x longer)
- **Diminishing returns** - Finds edge cases, but high effort
- **Pragmatic focus** - Better to test critical paths well
- **Journey stage** - More useful for mature products, not MVP

**When to reconsider**:
- IF safety-critical system (catch all bugs)
- IF stable codebase (not changing much)
- IF have time/resources (mature product phase)

**Example**: Medical device firmware - mutation testing catches subtle bugs. SaaS MVP - focus on critical path coverage first.

---


### Full E2E Test Suite on Every PR

**What it is**: Run all E2E tests on every pull request

**Why not (for this journey)**:
- **Too slow** - E2E tests take 20-30 minutes, slows feedback
- **Expensive** - CI minutes cost money
- **Overkill** - Most PRs don't affect entire user flow
- **Pragmatic approach** - Run smoke tests on PR, full suite on merge

**When to reconsider**:
- IF E2E tests are fast (< 5 minutes)
- IF high bug rate (need more testing)
- IF few PRs per day (can afford time)

**Example**: 50 PRs/day with 30-min E2E suite = 25 hours CI time/day (expensive). Run E2E smoke tests (5 min) on PR, full suite on merge to main.

---

### Visual Regression Testing for Every Component

**What it is**: Screenshot every component and detect visual changes

**Why not (for this journey)**:
- **Maintenance burden** - Every design change requires updating screenshots
- **False positives** - Flaky tests due to timing, fonts, rendering
- **Expensive** - Visual regression services cost money (Percy, Chromatic)
- **Selective approach** - Test critical components only

**When to reconsider**:
- IF design system library (UI is the product)
- IF frequent visual bugs (lack of design discipline)
- IF large team (many contributors, need consistency)

**Example**: Design system with 100 components - visual regression catches unintended changes. Small SaaS app - manual QA + E2E tests are sufficient.

---

### Test Parallelization with 10+ Workers

**What it is**: Run tests across many parallel workers for speed

**Why not (for this journey)**:
- **Diminishing returns** - 3-5 workers is sweet spot, more doesn't help much
- **Resource limits** - CI environments have CPU/memory limits
- **Database contention** - More workers = more database connections
- **Complexity** - Requires careful test isolation

**When to reconsider**:
- IF massive test suite (>1000 tests, >1 hour)
- IF have resources (self-hosted CI with many CPUs)
- IF tests are well-isolated (no shared state)

**Example**: 1000 E2E tests taking 2 hours - parallelize with 10 workers. 100 tests taking 10 minutes - 3-5 workers is enough.

---

## Setup Instructions

After generating testing strategy:

### For Python (FastAPI/Django):

```bash
# 1. Install testing dependencies
pip install pytest pytest-asyncio pytest-cov
pip install httpx  # For API testing
pip install factory-boy faker  # For test data
pip install pytest-postgresql  # For database testing

# 2. Configure pytest
# Create pytest.ini:
[pytest]
testpaths = tests
python_files = test_*.py
python_classes = Test*
python_functions = test_*
addopts = --cov=app --cov-report=html --cov-report=term

# 3. Run tests
pytest  # Run all tests
pytest --cov  # Run with coverage
pytest tests/unit  # Run unit tests only
pytest -k test_assessment  # Run specific test

# 4. View coverage report
open htmlcov/index.html
```

### For TypeScript (React/Next.js):

```bash
# 1. Install testing dependencies
npm install -D vitest @testing-library/react @testing-library/user-event
npm install -D @playwright/test  # For E2E tests
npm install -D msw  # For API mocking
npm install -D @vitest/coverage-v8  # For coverage

# 2. Configure Vitest
# Create vitest.config.ts:
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      exclude: ['node_modules/', 'dist/']
    }
  }
});

# 3. Run tests
npm test  # Run all tests
npm run test:coverage  # Run with coverage
npm run test:e2e  # Run E2E tests (Playwright)

# 4. View coverage report
open coverage/index.html
```

### CI/CD Integration (GitHub Actions):

```yaml
# .github/workflows/test.yml
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v3

      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'

      - name: Install dependencies
        run: |
          pip install -r requirements.txt
          pip install -r requirements-dev.txt

      - name: Run unit tests
        run: pytest tests/unit --cov --cov-report=xml

      - name: Run integration tests
        run: pytest tests/integration --cov --cov-append --cov-report=xml

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage.xml

      - name: Run E2E tests
        run: pytest tests/e2e
        if: github.event_name == 'push' && github.ref == 'refs/heads/main'
```

---

## Output Files

This command generates:

**1. Full Testing Strategy** (`product-guidelines/09-test-strategy.md`):
- Testing philosophy and principles
- Unit, integration, E2E testing strategies with examples
- Test coverage goals and quality gates
- Test data management approach (factories, fixtures, cleanup)
- Performance and security testing plans
- CI/CD integration details
- Testing workflows (TDD, BDD, regression)
- Testing checklists (pre-commit, pre-deploy)
- Setup instructions (Python/TypeScript)
- "What We DIDN'T Choose" analysis (8+ alternatives)

**2. Context Documentation** (`product-guidelines/09-test-strategy.ctx.md`):

After writing the full test strategy, invoke the distillation sub-agent:

```bash
Task tool with:
- subagent_type: distill-context
- Source file: product-guidelines/09-test-strategy.md
- Output file: product-guidelines/09-test-strategy.ctx.md
```

The distillation agent will create a condensed version for Session 10 (backlog generation) - 66% smaller:
- Coverage targets (for story estimation)
- Test types required (unit, integration, E2E)
- Testing tools (from tech stack)
- Quality gates (for acceptance criteria)
- Test requirements in stories
- Story scoping guidance (simple vs complex stories)
- Common test scenarios (auth, authorization, validation)

**3. Test Configuration Files** (`product-guidelines/09-test-strategy/`):
- `pytest.ini` or `vitest.config.ts` (test runner config)
- `.coveragerc` (coverage configuration)
- `tests/conftest.py` (pytest fixtures)
- `tests/factories.py` (test data factories)
- `tests/fixtures/` (sample test data files)

**4. Example Tests** (`product-guidelines/09-test-strategy/examples/`):
- `example_unit_test.py` or `.test.ts`
- `example_integration_test.py`
- `example_e2e_test.py` or `.spec.ts`
- `example_factory.py`

---

## Quality Checklist

Before completing this session, verify:

**Journey Alignment:**
- [ ] Critical path (journey steps 1-3) has E2E tests
- [ ] Business logic from journey has unit tests
- [ ] API endpoints from journey have integration tests
- [ ] Test coverage focused on user value delivery

**Completeness:**
- [ ] Unit testing strategy defined (scope, tools, patterns)
- [ ] Integration testing strategy defined (API, database, services)
- [ ] E2E testing strategy defined (critical journeys)
- [ ] Test coverage targets set (by component, by test type)
- [ ] Test data management approach defined
- [ ] Performance testing plan defined
- [ ] Security testing plan defined
- [ ] CI/CD integration specified

**Technical Quality:**
- [ ] Testing tools match tech stack choices
- [ ] Test isolation strategy prevents flaky tests
- [ ] Quality gates prevent bad code from merging
- [ ] Coverage targets are realistic (not 100% everything)
- [ ] Test execution time is reasonable (< 10 min for PR)

**Practicality:**
- [ ] Testing strategy balances speed and thoroughness
- [ ] Tests focus on critical paths, not every edge case
- [ ] Test maintenance burden is manageable
- [ ] Team can actually follow this strategy

**Documentation:**
- [ ] Full test strategy file (`09-test-strategy.md`) complete with all details
- [ ] Context file (`09-test-strategy.ctx.md`) generated for backlog use
- [ ] "What We DIDN'T Choose" section complete (4+ alternatives) in full file
- [ ] Testing workflows documented (TDD, regression)
- [ ] Setup instructions clear and complete
- [ ] Example tests provided for each test type

---

## After This Session

**Next steps:**
1. **Copy test configuration** to your project
2. **Set up test database** (Docker PostgreSQL or similar)
3. **Install testing dependencies** (pytest, vitest, playwright)
4. **Configure CI/CD** to run tests (GitHub Actions)
5. **Write first tests** for P0 features (TDD)
6. **Set up coverage reporting** (Codecov, Coveralls)

**Use this strategy for:**
- Writing tests during feature development (TDD)
- Code review (ensure tests are included)
- CI/CD setup (quality gates)
- Team onboarding (testing standards)
- Production monitoring (regression prevention)

**Testing priority:**
1. **Phase 1**: Unit tests for business logic (Week 1)
2. **Phase 2**: Integration tests for API endpoints (Week 1-2)
3. **Phase 3**: E2E tests for critical paths (Week 2-3)
4. **Phase 4**: Performance tests for bottlenecks (Week 3+)
5. **Phase 5**: Security tests for vulnerabilities (Ongoing)

---

## Remember

**Test what matters, not everything.**

Focus testing effort on:
1. Critical path operations (journey steps 1-3)
2. Business logic and algorithms
3. User data integrity
4. Security boundaries (auth, authorization)
5. Performance bottlenecks

Don't waste time on:
- Testing framework code
- Testing simple getters/setters
- Testing every UI state
- 100% coverage goals

**Reference files:**
- Journey: `product-guidelines/00-user-journey.ctx.md`
- Tech stack: `product-guidelines/02-tech-stack.md`
- Architecture: `product-guidelines/04-architecture.ctx.md`
- Database schema: `product-guidelines/07-database-schema.ctx.md` (from Session 7)
- API contracts: `product-guidelines/08b-api-contracts.md` (from Session 8b)
- Backlog: `product-guidelines/10-backlog/BACKLOG.md` (generated AFTER this session in Session 10)
- Scaffold: `product-guidelines/12-project-scaffold.md` (generated after in Session 12)

---

**Now, read previous outputs and create a testing strategy that ensures quality without slowing development!**

## After Generating Test Strategy Document

Once you've written `product-guidelines/09-test-strategy.md`, invoke the distillation agent to create a context file:

Use the Task tool:
- **subagent_type**: `general-purpose`
- **description**: `Generate test strategy context file`
- **prompt**:
  ```
  Invoke the context distillation agent to create token-optimized context file.

  Source file: product-guidelines/09-test-strategy.md
  Output file: product-guidelines/09-test-strategy.ctx.md

  Follow the distillation agent specification in .claude/agents/distill-context.md to:
  1. Extract ALL testing frameworks, patterns, and quality gates (CRITICAL)
  2. Extract unit/integration/E2E strategies and coverage goals
  3. Remove detailed testing examples, test code samples, framework comparisons
  4. Preserve section structure from source file
  5. Achieve 60-70% token reduction
  6. Add source reference header
  7. Write to output file path
  ```

## Output Format

IMPORTANT: Do not use emojis in generated outputs. Use plain text for all communication.
