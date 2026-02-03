# Compliance SaaS Testing Examples

**Purpose**: Centralized testing examples for compliance assessment SaaS journey
**Referenced by**: All test strategy sub-agents
**Journey**: Upload document → Select frameworks → AI assessment → View results → Share report

This file consolidates all test examples to avoid duplication across sub-agents. Sub-agents reference specific sections instead of duplicating code.

---

## Section 1: Unit Testing Examples

### 1.1 Backend Unit Test (Assessment Scoring Algorithm)

**File**: `tests/unit/test_assessment.py`
**Language**: Python
**Framework**: Pytest

```python
# tests/unit/test_assessment.py
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

def test_compliance_score_handles_extra_findings():
    """Test that extra findings beyond requirements don't affect score"""
    requirements = ["encryption", "access_control"]
    findings = ["encryption", "access_control", "audit_logs", "mfa"]

    score = calculate_compliance_score(requirements, findings)

    assert score == 100  # All requirements met
```

### 1.2 Frontend Unit Test (Assessment Results Component)

**File**: `src/components/AssessmentResults.test.tsx`
**Language**: TypeScript
**Framework**: Vitest + React Testing Library

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

  it('shows empty state when no findings', () => {
    render(<AssessmentResults score={100} findings={[]} />);

    expect(screen.getByText('No compliance issues found')).toBeInTheDocument();
  });
});
```

### 1.3 Property-Based Test (Python with Hypothesis)

**File**: `tests/unit/test_assessment_properties.py`
**Language**: Python
**Framework**: Pytest + Hypothesis

```python
# tests/unit/test_assessment_properties.py
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
    from app.parser import parse_document

    # Property: Parser never crashes on valid inputs
    try:
        result = parse_document(size=document_size, format=format)
        assert result is not None
        assert isinstance(result.text, str)
    except ValueError as e:
        # Expected failures for invalid combinations
        assert "unsupported" in str(e).lower()
```

---

## Section 2: Integration Testing Examples

### 2.1 API Integration Test (Document Upload)

**File**: `tests/integration/test_document_api.py`
**Language**: Python
**Framework**: Pytest + FastAPI TestClient

```python
# tests/integration/test_document_api.py
import pytest
from fastapi.testclient import TestClient
from app.main import app
from tests.factories import UserFactory

client = TestClient(app)

@pytest.fixture
def authenticated_user(test_db):
    """Create test user and return auth token"""
    user = UserFactory()
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
    assert response.json()["detail"] == "Not authenticated"

def test_list_documents_shows_only_user_documents(authenticated_user, test_db):
    """Test multi-tenant isolation: users see only their documents"""
    from tests.factories import DocumentFactory

    # Create documents for user A (authenticated)
    DocumentFactory(user_id=1, name="User A Doc")
    # Create documents for user B (different user)
    DocumentFactory(user_id=2, name="User B Doc")

    response = client.get("/api/documents", headers=authenticated_user)

    assert response.status_code == 200
    documents = response.json()["data"]
    assert len(documents) == 1
    assert documents[0]["name"] == "User A Doc"
```

### 2.2 Database Integration Test (Testcontainers)

**File**: `tests/integration/conftest.py`
**Language**: Python
**Framework**: Pytest + Testcontainers

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
    from app.models import User

    user = User(email="test@example.com", name="Test User")
    test_db.add(user)
    test_db.commit()

    # Verify user exists
    found_user = test_db.query(User).filter_by(email="test@example.com").first()
    assert found_user is not None
    assert found_user.name == "Test User"
```

### 2.3 External Service Integration Test (AI API Mock)

**File**: `tests/integration/test_ai_service.py`
**Language**: Python
**Framework**: Pytest + responses (mocking library)

```python
# tests/integration/test_ai_service.py
import pytest
import responses
from app.services.ai import assess_document

@responses.activate
def test_ai_assessment_success():
    """Test AI API integration with mocked response"""
    # Mock AI API response
    responses.add(
        responses.POST,
        "https://api.anthropic.com/v1/messages",
        json={
            "content": [{"text": "Document is GDPR compliant. Found: encryption, access control, audit logs."}]
        },
        status=200
    )

    result = assess_document(
        document_text="Privacy policy with encryption and access controls",
        frameworks=["GDPR"]
    )

    assert result.framework == "GDPR"
    assert result.score >= 80
    assert "encryption" in result.findings
    assert "access control" in result.findings

@responses.activate
def test_ai_assessment_retry_on_timeout():
    """Test retry logic when AI API times out"""
    # First request times out
    responses.add(
        responses.POST,
        "https://api.anthropic.com/v1/messages",
        body=requests.exceptions.Timeout()
    )
    # Second request succeeds
    responses.add(
        responses.POST,
        "https://api.anthropic.com/v1/messages",
        json={"content": [{"text": "Assessment complete"}]},
        status=200
    )

    result = assess_document("doc", ["SOC2"])

    assert result is not None
    assert len(responses.calls) == 2  # Verify retry happened
```

---

## Section 3: E2E Testing Examples

### 3.1 Complete Assessment Flow (Playwright)

**File**: `tests/e2e/assessment-flow.spec.ts`
**Language**: TypeScript
**Framework**: Playwright

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

### 3.2 Accessibility Testing (axe-playwright)

**File**: `tests/e2e/accessibility.spec.ts`
**Language**: TypeScript
**Framework**: Playwright + axe-playwright

```typescript
// tests/e2e/accessibility.spec.ts
import { test } from '@playwright/test';
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

test('assessment results accessibility with specific WCAG rules', async ({ page }) => {
  await page.goto('/assessments/test-assessment-id');
  await injectAxe(page);

  // Check specific WCAG 2.2 AA rules
  await checkA11y(page, null, {
    rules: {
      'color-contrast': { enabled: true },
      'button-name': { enabled: true },
      'image-alt': { enabled: true },
      'target-size': { enabled: true } // WCAG 2.2 new rule
    }
  });
});
```

---

## Section 4: Test Data Factories

### 4.1 Backend Factories (FactoryBoy)

**File**: `tests/factories.py`
**Language**: Python
**Framework**: FactoryBoy + Faker

```python
# tests/factories.py
import factory
from faker import Faker
from app.models import User, Document, Assessment, Framework

fake = Faker()

class UserFactory(factory.Factory):
    class Meta:
        model = User

    id = factory.Sequence(lambda n: n)
    email = factory.LazyFunction(lambda: fake.email())
    name = factory.LazyFunction(lambda: fake.name())
    team_id = factory.LazyAttribute(lambda _: TeamFactory().id)
    created_at = factory.LazyFunction(lambda: fake.date_time_this_year())

class DocumentFactory(factory.Factory):
    class Meta:
        model = Document

    id = factory.Sequence(lambda n: f"doc_{n}")
    name = factory.LazyFunction(lambda: fake.file_name(extension='pdf'))
    file_size = factory.LazyFunction(lambda: fake.random_int(min=1000, max=5000000))
    status = "ready"
    user_id = factory.LazyAttribute(lambda _: UserFactory().id)
    s3_url = factory.LazyFunction(lambda: f"s3://bucket/{fake.uuid4()}.pdf")

class FrameworkFactory(factory.Factory):
    class Meta:
        model = Framework

    id = factory.Sequence(lambda n: n)
    name = factory.Iterator(["GDPR", "SOC2", "ISO 27001", "HIPAA", "PCI DSS"])
    requirements = factory.LazyFunction(lambda: [
        "encryption",
        "access_control",
        "audit_logs",
        "data_retention"
    ])

class AssessmentFactory(factory.Factory):
    class Meta:
        model = Assessment

    id = factory.Sequence(lambda n: f"assessment_{n}")
    document_id = factory.LazyAttribute(lambda _: DocumentFactory().id)
    framework_id = factory.LazyAttribute(lambda _: FrameworkFactory().id)
    score = factory.LazyFunction(lambda: fake.random_int(min=0, max=100))
    status = factory.Iterator(["pending", "processing", "complete", "failed"])
    findings = factory.LazyFunction(lambda: [
        {"issue": fake.sentence(), "severity": fake.random_element(["high", "medium", "low"])}
        for _ in range(fake.random_int(min=0, max=5))
    ])
```

### 4.2 Frontend Factories (Fishery)

**File**: `tests/factories.ts`
**Language**: TypeScript
**Framework**: Fishery + Faker

```typescript
// tests/factories.ts
import { Factory } from 'fishery';
import { faker } from '@faker-js/faker';
import type { User, Document, Assessment } from '@/types';

export const UserFactory = Factory.define<User>(({ sequence }) => ({
  id: sequence,
  email: faker.internet.email(),
  name: faker.person.fullName(),
  teamId: faker.number.int({ min: 1, max: 100 }),
  createdAt: faker.date.recent()
}));

export const DocumentFactory = Factory.define<Document>(({ sequence }) => ({
  id: `doc_${sequence}`,
  name: faker.system.fileName({ extensionCount: 1 }),
  fileSize: faker.number.int({ min: 1000, max: 5000000 }),
  status: faker.helpers.arrayElement(['processing', 'ready', 'failed']),
  userId: faker.number.int({ min: 1, max: 1000 }),
  s3Url: `s3://bucket/${faker.string.uuid()}.pdf`
}));

export const AssessmentFactory = Factory.define<Assessment>(({ sequence }) => ({
  id: `assessment_${sequence}`,
  documentId: `doc_${faker.number.int()}`,
  frameworkId: faker.number.int({ min: 1, max: 5 }),
  score: faker.number.int({ min: 0, max: 100 }),
  status: faker.helpers.arrayElement(['pending', 'processing', 'complete', 'failed']),
  findings: Array.from({ length: faker.number.int({ min: 0, max: 5 }) }, () => ({
    issue: faker.lorem.sentence(),
    severity: faker.helpers.arrayElement(['high', 'medium', 'low'])
  }))
}));
```

---

## Section 5: Performance Testing Examples

### 5.1 Load Testing (k6)

**File**: `tests/performance/load-test.js`
**Language**: JavaScript
**Framework**: k6

```javascript
// tests/performance/load-test.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '2m', target: 10 },  // Ramp up to 10 users
    { duration: '5m', target: 10 },  // Stay at 10 users
    { duration: '2m', target: 50 },  // Ramp up to 50 users
    { duration: '5m', target: 50 },  // Stay at 50 users
    { duration: '2m', target: 0 },   // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500', 'p(99)<2000'],  // 95% < 500ms, 99% < 2s
    http_req_failed: ['rate<0.05'],  // Error rate < 5%
  },
};

export default function () {
  // 1. Upload document
  const uploadPayload = {
    file: http.file(open('sample.pdf', 'b'), 'sample.pdf', 'application/pdf')
  };
  const uploadRes = http.post(
    'https://staging.complianceapp.com/api/documents',
    uploadPayload,
    {
      headers: { 'Authorization': `Bearer ${__ENV.API_TOKEN}` }
    }
  );

  check(uploadRes, {
    'upload status is 201': (r) => r.status === 201,
    'upload response time < 500ms': (r) => r.timings.duration < 500,
  });

  const documentId = uploadRes.json('id');

  // 2. Start assessment
  const assessmentPayload = JSON.stringify({
    documentId: documentId,
    frameworkIds: [1, 2]  // GDPR, SOC2
  });
  const assessmentRes = http.post(
    'https://staging.complianceapp.com/api/assessments',
    assessmentPayload,
    {
      headers: {
        'Authorization': `Bearer ${__ENV.API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    }
  );

  check(assessmentRes, {
    'assessment created': (r) => r.status === 201,
  });

  sleep(1);
}
```

---

## Section 6: Security Testing Examples

### 6.1 Authorization Tests (Multi-Tenant Isolation)

**File**: `tests/security/test_authorization.py`
**Language**: Python
**Framework**: Pytest

```python
# tests/security/test_authorization.py
import pytest
from fastapi.testclient import TestClient
from app.main import app
from tests.factories import UserFactory, DocumentFactory

client = TestClient(app)

def test_user_cannot_access_other_tenant_documents():
    """CRITICAL: Test multi-tenant data isolation (OWASP BOLA)"""
    # Create User A with documents
    user_a = UserFactory(team_id=1)
    doc_a = DocumentFactory(user_id=user_a.id, team_id=1)

    # Create User B with documents
    user_b = UserFactory(team_id=2)
    doc_b = DocumentFactory(user_id=user_b.id, team_id=2)

    # User A tries to access User B's document
    token_a = generate_jwt_token(user_a.id)
    response = client.get(
        f"/api/documents/{doc_b.id}",
        headers={"Authorization": f"Bearer {token_a}"}
    )

    # Should be forbidden (403) or not found (404)
    assert response.status_code in [403, 404]
    assert "id" not in response.json()  # Don't leak doc existence

def test_role_based_access_control():
    """Test RBAC: Regular user can't delete team documents"""
    user = UserFactory(role="user")  # Not admin
    doc = DocumentFactory(user_id=user.id)

    token = generate_jwt_token(user.id)
    response = client.delete(
        f"/api/documents/{doc.id}",
        headers={"Authorization": f"Bearer {token}"}
    )

    assert response.status_code == 403
    assert "insufficient permissions" in response.json()["detail"].lower()
```

### 6.2 Input Validation Tests (SQL Injection, XSS)

**File**: `tests/security/test_input_validation.py`
**Language**: Python
**Framework**: Pytest

```python
# tests/security/test_input_validation.py
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_sql_injection_prevention():
    """Test SQL injection is prevented via parameterized queries"""
    malicious_email = "admin' OR '1'='1"

    response = client.post(
        "/api/auth/login",
        json={"email": malicious_email, "password": "password"}
    )

    # Should return 401 (unauthorized), not 200 (successful login)
    assert response.status_code == 401
    # Should NOT leak SQL error
    assert "sql" not in response.text.lower()

def test_xss_prevention_in_document_name():
    """Test XSS prevention via input sanitization"""
    malicious_name = "<script>alert('XSS')</script>document.pdf"

    response = client.post(
        "/api/documents",
        files={"file": ("test.pdf", b"content", "application/pdf")},
        data={"name": malicious_name},
        headers={"Authorization": f"Bearer {valid_token}"}
    )

    # Document created but name sanitized
    assert response.status_code == 201
    data = response.json()
    assert "<script>" not in data["name"]
    assert "document.pdf" in data["name"]

def test_file_upload_validation():
    """Test file upload validation (type, size)"""
    # Test 1: Invalid file type
    response = client.post(
        "/api/documents",
        files={"file": ("malicious.exe", b"MZ", "application/x-msdownload")},
        headers={"Authorization": f"Bearer {valid_token}"}
    )

    assert response.status_code == 400
    assert "invalid file type" in response.json()["detail"].lower()

    # Test 2: File too large (>10MB)
    large_file = b"x" * (11 * 1024 * 1024)  # 11MB
    response = client.post(
        "/api/documents",
        files={"file": ("large.pdf", large_file, "application/pdf")},
        headers={"Authorization": f"Bearer {valid_token}"}
    )

    assert response.status_code == 400
    assert "file too large" in response.json()["detail"].lower()
```

---

## Section 7: CI/CD Configuration Examples

### 7.1 GitHub Actions Test Workflow

**File**: `.github/workflows/test.yml`
**Language**: YAML

```yaml
# .github/workflows/test.yml
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
        run: npx playwright test --grep-invert flaky

      - name: Run flaky E2E tests (non-blocking)
        run: npx playwright test --grep flaky || true

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

## Usage Instructions

**For Sub-Agents**:
Instead of duplicating examples, reference sections:

```markdown
### Example Unit Test (Backend)
See `/examples/compliance-saas-testing.md` Section 1.1 for assessment scoring algorithm test

### Example Integration Test (API)
See `/examples/compliance-saas-testing.md` Section 2.1 for document upload API test

### Example E2E Test
See `/examples/compliance-saas-testing.md` Section 3.1 for complete assessment flow

### Example Factories
See `/examples/compliance-saas-testing.md` Section 4.1 for FactoryBoy patterns
```

**For Users**:
Copy examples from this file when implementing tests for the compliance SaaS journey.

---

**Last Updated**: 2025-02-02
**Journey**: Compliance Assessment SaaS
**Test Frameworks**: Pytest, Vitest, Playwright, k6
