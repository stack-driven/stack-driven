# Performance Testing Guide

*Last Updated: February 2026*

## Overview

Performance testing ensures your application meets speed, responsiveness, and scalability requirements. This guide covers load testing, Core Web Vitals, and database query optimization.

**Business Impact:**
- Vodafone: 31% LCP improvement → **8% sales increase**
- Pinterest: 40% faster perceived wait → **15% SEO traffic increase**
- BBC: 1s faster load time → **10% more users**
- Amazon: 100ms latency increase → **1% revenue decrease**

---

## Performance Testing Tools (2025)

| Tool | Best For | Key Strength | Language | Resource Usage |
|------|----------|--------------|----------|----------------|
| **k6** | Modern DevOps, CI/CD | Low resource usage, JS scripting | JavaScript | **10x lower than JMeter** |
| **Gatling** | Enterprise scale | Massive load from single system | Scala/Java/JS | Medium |
| **Locust** | Python teams | Event-based efficiency, Python scripts | Python | Low |
| **JMeter** | Wide protocol support | Extensive plugins, mature ecosystem | Java (GUI) | High |
| **Artillery** | Quick scripting | YAML config, CI/CD friendly | JavaScript | Low |

**Recommendation: k6** (industry standard 2025)
- Testing-as-code philosophy (JavaScript scripts)
- 10x lower resource usage vs JMeter
- Native Grafana Cloud integration
- Excellent CI/CD integration
- Large community, active development

---

## k6 Load Testing Examples

### Installation

```bash
# macOS
brew install k6

# Linux
sudo gpg -k
sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
sudo apt-get update
sudo apt-get install k6

# Docker
docker pull grafana/k6
```

### Example 1: Simple Load Test

```javascript
// load-test.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '1m', target: 10 },   // Ramp up to 10 users over 1 minute
    { duration: '3m', target: 10 },   // Stay at 10 users for 3 minutes
    { duration: '1m', target: 50 },   // Ramp up to 50 users over 1 minute
    { duration: '5m', target: 50 },   // Stay at 50 users for 5 minutes
    { duration: '1m', target: 0 },    // Ramp down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(95)<500', 'p(99)<2000'], // 95% < 500ms, 99% < 2s
    http_req_failed: ['rate<0.01'],                  // Error rate < 1%
  },
};

export default function () {
  // Document upload scenario
  const uploadResponse = http.post('https://api.example.com/documents', {
    file: http.file(open('sample.pdf', 'b'), 'sample.pdf'),
  });

  check(uploadResponse, {
    'upload status is 201': (r) => r.status === 201,
    'upload took < 2s': (r) => r.timings.duration < 2000,
  });

  sleep(1);

  // Assessment status check
  const statusResponse = http.get('https://api.example.com/assessments/123');

  check(statusResponse, {
    'status is 200': (r) => r.status === 200,
    'response < 500ms': (r) => r.timings.duration < 500,
  });

  sleep(2);
}
```

**Run:**
```bash
k6 run load-test.js
```

### Example 2: Realistic User Scenarios

```javascript
// scenarios.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  scenarios: {
    // Scenario 1: Normal browsing users
    browsing: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '2m', target: 20 },
        { duration: '5m', target: 20 },
        { duration: '2m', target: 0 },
      ],
      exec: 'browsingScenario',
    },

    // Scenario 2: Heavy uploaders
    uploading: {
      executor: 'constant-arrival-rate',
      rate: 10,                    // 10 uploads per second
      duration: '5m',
      preAllocatedVUs: 50,
      exec: 'uploadScenario',
    },

    // Scenario 3: API polling (dashboard)
    polling: {
      executor: 'per-vu-iterations',
      vus: 100,
      iterations: 200,
      maxDuration: '10m',
      exec: 'pollingScenario',
    },
  },
};

export function browsingScenario() {
  http.get('https://example.com/');
  sleep(2);
  http.get('https://example.com/assessments');
  sleep(3);
}

export function uploadScenario() {
  const res = http.post('https://api.example.com/documents', {
    file: http.file(open('sample.pdf', 'b'), 'sample.pdf'),
  });
  check(res, { 'upload succeeded': (r) => r.status === 201 });
}

export function pollingScenario() {
  const res = http.get('https://api.example.com/assessments/status');
  check(res, { 'polling succeeded': (r) => r.status === 200 });
  sleep(1);
}
```

### Example 3: Stress Testing (Find Breaking Point)

```javascript
// stress-test.js
import http from 'k6/http';

export const options = {
  stages: [
    { duration: '2m', target: 50 },    // Normal load
    { duration: '5m', target: 50 },
    { duration: '2m', target: 100 },   // 2x load
    { duration: '5m', target: 100 },
    { duration: '2m', target: 200 },   // 4x load
    { duration: '5m', target: 200 },
    { duration: '2m', target: 300 },   // 6x load (breaking point?)
    { duration: '5m', target: 300 },
    { duration: '5m', target: 0 },     // Recovery
  ],
};

export default function () {
  const res = http.get('https://api.example.com/assessments');

  // Log failures to identify breaking point
  if (res.status !== 200) {
    console.error(`Failed request: ${res.status} at ${new Date().toISOString()}`);
  }
}
```

**Analysis:**
- Breaking point: When error rate > 5% or p95 latency > 2s
- Verify system fails gracefully (503, not 500)
- Document maximum throughput (e.g., "Handles 200 concurrent users")

---

## Core Web Vitals (Frontend Performance)

### What Are Core Web Vitals?

Google's user-centric performance metrics (affects SEO rankings):

| Metric | Good | Poor | Measures | Impact |
|--------|------|------|----------|--------|
| **LCP** (Largest Contentful Paint) | ≤2.5s | >4.0s | Loading performance | SEO ranking, conversion |
| **INP** (Interaction to Next Paint) | ≤200ms | >500ms | Responsiveness | User experience |
| **CLS** (Cumulative Layout Shift) | ≤0.1 | >0.25 | Visual stability | User frustration |

**Why They Matter:**
- Google uses Core Web Vitals as SEO ranking factor (2021+)
- Slow sites = lower search rankings = less traffic
- Business impact proven (Vodafone +8% sales, Pinterest +15% traffic)

### Setting Performance Budgets

**Budget by Page Type:**

| Page Type | LCP Target | INP Target | CLS Target | Rationale |
|-----------|------------|------------|------------|-----------|
| Homepage/Landing | ≤2.0s | ≤150ms | ≤0.05 | First impression, SEO critical |
| Product/Checkout | ≤2.5s | ≤200ms | ≤0.1 | Conversion funnel |
| Dashboard/Tools | ≤3.5s | ≤200ms | ≤0.1 | Logged-in users (relaxed) |

### Lighthouse CI Integration

**Installation:**
```bash
npm install -g @lhci/cli
```

**Configuration:**
```json
// .lighthouserc.json
{
  "ci": {
    "collect": {
      "url": [
        "http://localhost:3000/",
        "http://localhost:3000/dashboard",
        "http://localhost:3000/assessments"
      ],
      "numberOfRuns": 3
    },
    "assert": {
      "preset": "lighthouse:recommended",
      "assertions": {
        "largest-contentful-paint": ["error", {"maxNumericValue": 2500}],
        "interactive": ["error", {"maxNumericValue": 5000}],
        "cumulative-layout-shift": ["error", {"maxNumericValue": 0.1}],
        "total-blocking-time": ["warn", {"maxNumericValue": 500}]
      }
    },
    "upload": {
      "target": "temporary-public-storage"
    }
  }
}
```

**CI/CD Integration:**
```yaml
# .github/workflows/performance.yml
name: Performance Tests

on: [pull_request]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Install dependencies
        run: npm install

      - name: Build application
        run: npm run build

      - name: Start server
        run: npm run start &

      - name: Run Lighthouse CI
        run: |
          npm install -g @lhci/cli
          lhci autorun

      - name: Upload Lighthouse results
        if: failure()
        uses: actions/upload-artifact@v3
        with:
          name: lighthouse-results
          path: .lighthouseci/
```

### Core Web Vitals Optimization Techniques

**LCP (Largest Contentful Paint) Optimization:**
```html
<!-- BAD: Large hero image blocks LCP -->
<img src="hero.jpg" width="1920" height="1080">

<!-- GOOD: Preload critical image -->
<link rel="preload" as="image" href="hero.jpg">
<img src="hero.jpg" width="1920" height="1080" fetchpriority="high">

<!-- BETTER: Responsive images with modern formats -->
<picture>
  <source srcset="hero.avif" type="image/avif">
  <source srcset="hero.webp" type="image/webp">
  <img src="hero.jpg" width="1920" height="1080" fetchpriority="high" alt="Hero">
</picture>
```

**INP (Interaction to Next Paint) Optimization:**
```javascript
// BAD: Long synchronous task blocks main thread
function processLargeDataset(data) {
  return data.map(item => expensiveOperation(item));
}

// GOOD: Break into smaller chunks
async function processLargeDataset(data) {
  const results = [];
  for (let i = 0; i < data.length; i += 100) {
    const chunk = data.slice(i, i + 100);
    const chunkResults = chunk.map(item => expensiveOperation(item));
    results.push(...chunkResults);

    // Yield to main thread
    await new Promise(resolve => setTimeout(resolve, 0));
  }
  return results;
}
```

**CLS (Cumulative Layout Shift) Optimization:**
```html
<!-- BAD: Image without dimensions causes layout shift -->
<img src="profile.jpg" alt="Profile">

<!-- GOOD: Reserve space with width/height -->
<img src="profile.jpg" width="400" height="400" alt="Profile">

<!-- BAD: Injected ads cause layout shift -->
<div id="ad-slot"></div>

<!-- GOOD: Reserve space for ads -->
<div id="ad-slot" style="min-height: 250px;"></div>
```

---

## Database Query Performance Testing

### N+1 Query Problem (Most Common ORM Bug)

**The Problem:**
```python
# Django - BAD (N+1 queries)
users = User.objects.all()  # 1 query
for user in users:
    print(user.profile.bio)  # N queries (1 per user)
# Total: 1 + N queries (101 queries for 100 users)
```

**The Solution:**
```python
# Django - GOOD (1 query with JOIN)
users = User.objects.select_related('profile').all()
for user in users:
    print(user.profile.bio)
# Total: 1 query
```

### ORM-Specific Solutions

| ORM | One-to-One / Many-to-One | One-to-Many / Many-to-Many |
|-----|--------------------------|----------------------------|
| **Django** | `select_related('profile')` | `prefetch_related('documents')` |
| **SQLAlchemy** | `joinedload(User.profile)` | `selectinload(User.documents)` |
| **Prisma** | `include: { profile: true }` | `include: { documents: true }` |
| **Entity Framework** | `.Include(u => u.Profile)` | `.Include(u => u.Documents)` |
| **TypeORM** | `relations: ['profile']` | `relations: ['documents']` |

### Detection Tools

**Django Debug Toolbar (Development):**
```python
# settings.py
INSTALLED_APPS += ['debug_toolbar']
MIDDLEWARE += ['debug_toolbar.middleware.DebugToolbarMiddleware']
```

Shows SQL queries panel with:
- Total query count
- Duplicate queries
- Slow queries (highlighted)

**Sentry Performance Monitoring (Production):**
```python
import sentry_sdk
from sentry_sdk.integrations.django import DjangoIntegration

sentry_sdk.init(
    dsn="your-dsn",
    integrations=[DjangoIntegration()],
    traces_sample_rate=0.1,  # Sample 10% of transactions
)
```

Detects:
- N+1 queries
- Slow database queries
- Missing indexes

### Performance Testing N+1 Queries

**Django Example:**
```python
# tests/performance/test_n_plus_1.py
import pytest
from django.test.utils import override_settings
from app.models import User

@pytest.mark.django_db
def test_user_list_no_n_plus_1(django_assert_num_queries):
    """Verify user list endpoint doesn't have N+1 queries"""
    # Create test data
    for i in range(10):
        user = User.objects.create(email=f'user{i}@example.com')
        Profile.objects.create(user=user, bio=f'Bio {i}')

    # Should use 1 query (select_related), not 11 (1 + N)
    with django_assert_num_queries(1):
        users = User.objects.select_related('profile').all()
        for user in users:
            _ = user.profile.bio  # Access related field
```

**SQLAlchemy Example:**
```python
# tests/performance/test_queries.py
from sqlalchemy import event
from sqlalchemy.engine import Engine

@pytest.fixture
def query_counter():
    """Count queries executed during test"""
    queries = []

    @event.listens_for(Engine, "before_cursor_execute")
    def receive_before_cursor_execute(conn, cursor, statement, *args):
        queries.append(statement)

    yield queries

def test_user_list_efficient(db_session, query_counter):
    """Verify efficient query usage"""
    # Create test data
    for i in range(10):
        user = User(email=f'user{i}@example.com')
        user.profile = Profile(bio=f'Bio {i}')
        db_session.add(user)
    db_session.commit()

    # Query with joinedload
    users = db_session.query(User).options(joinedload(User.profile)).all()
    for user in users:
        _ = user.profile.bio

    # Should execute 1 query, not 11
    assert len(query_counter) == 1, f"Expected 1 query, got {len(query_counter)}"
```

---

## CI/CD Performance Testing Strategy

### Test Execution Time Budgets

| Test Type | Budget | Optimization Technique |
|-----------|--------|------------------------|
| **Unit** | < 5 min | Parallelize (pytest-xdist, Jest --maxWorkers) |
| **Integration** | < 15 min | Reuse session-scoped containers |
| **E2E** | < 30 min | Run critical paths only, shard tests |
| **Load (k6)** | < 10 min | Reduced duration for CI (full tests nightly) |

### Test Sharding (Parallel Execution)

**Playwright Sharding:**
```yaml
# .github/workflows/e2e.yml
strategy:
  matrix:
    shard: [1, 2, 3, 4]
steps:
  - name: Run E2E tests (shard ${{ matrix.shard }}/4)
    run: npx playwright test --shard=${{ matrix.shard }}/4
```

**Pytest Parallel:**
```bash
# Run tests across 4 workers
pytest -n 4 tests/
```

**Sweet Spot:** 3-5 workers (diminishing returns after 5).

### Affected Test Detection

**Nx (Monorepo Tool):**
```bash
# Only run tests affected by changes
nx affected:test --base=origin/main
```

**Jest:**
```bash
# Only run tests related to changed files
jest --onlyChanged
```

**Time Savings:** 60-80% reduction in CI time.

---

## Resources

**Load Testing:**
- k6 Documentation: https://k6.io/docs/
- k6 Examples: https://github.com/grafana/k6/tree/master/examples
- Gatling: https://gatling.io/

**Core Web Vitals:**
- Web Vitals Official: https://web.dev/vitals/
- Lighthouse CI: https://github.com/GoogleChrome/lighthouse-ci
- PageSpeed Insights: https://pagespeed.web.dev/

**Database Performance:**
- Django Performance: https://docs.djangoproject.com/en/4.2/topics/db/optimization/
- Prisma Best Practices: https://www.prisma.io/docs/guides/performance-and-optimization
- Use The Index, Luke: https://use-the-index-luke.com/

---

## Summary

| Aspect | Recommendation |
|--------|----------------|
| **Load Testing Tool** | k6 (10x lower resource usage than JMeter) |
| **Success Criteria** | p95 < 500ms, p99 < 2s, error rate < 1% |
| **Core Web Vitals** | LCP ≤2.5s, INP ≤200ms, CLS ≤0.1 (WCAG 2.2 AA) |
| **CI/CD Integration** | Lighthouse CI on every PR (blocking) |
| **Database Performance** | Test for N+1 queries with query counters |
| **Test Budget** | E2E < 30 min (shard into 3-5 workers) |

**Key Takeaway:** Performance testing prevents production incidents. Use k6 for load testing (modern standard), Lighthouse CI for Core Web Vitals (SEO impact), and query counters for N+1 detection (most common database issue).
