# Integration Testing Patterns

*Last Updated: February 2026*

## Overview

Integration testing verifies that multiple components work together correctly. This guide covers modern patterns for database integration, contract testing, and message queue testing.

**Key Principle:** Use real infrastructure (PostgreSQL, Redis, Kafka) via **testcontainers** instead of mocks. This catches real-world issues (serialization, transactions, network errors) that mocks miss.

---

## Testcontainers Pattern (Industry Standard 2025)

### What Are Testcontainers?

Lightweight, disposable Docker containers for integration tests.

**Benefits:**
- ✅ Real database (not mocks/in-memory DBs)
- ✅ Isolated (each test gets fresh state)
- ✅ Reproducible (same env locally + CI)
- ✅ Fast (containers start in 2-5 seconds)

**Supported Infrastructure:**
- Databases: PostgreSQL, MySQL, MongoDB, Redis, Elasticsearch
- Message queues: Kafka, RabbitMQ, Pulsar
- Cloud services: LocalStack (AWS), Azurite (Azure)
- Custom: Any Docker image

### Installation

**Python:**
```bash
pip install testcontainers[postgres]  # Or mysql, mongodb, etc.
```

**JavaScript/TypeScript:**
```bash
npm install --save-dev @testcontainers/postgresql
```

---

## Database Integration Testing

### Python Example (PostgreSQL + SQLAlchemy)

```python
# tests/integration/conftest.py
import pytest
from testcontainers.postgres import PostgresContainer
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.database import Base

@pytest.fixture(scope="session")
def postgres_container():
    """Start PostgreSQL container for all tests in session"""
    with PostgresContainer("postgres:15") as postgres:
        yield postgres

@pytest.fixture
def db_session(postgres_container):
    """Create fresh database for each test with transaction rollback"""
    engine = create_engine(postgres_container.get_connection_url())

    # Create tables
    Base.metadata.create_all(engine)

    # Start transaction
    connection = engine.connect()
    transaction = connection.begin()

    Session = sessionmaker(bind=connection)
    session = Session()

    yield session

    # Rollback transaction (clean up test data)
    session.close()
    transaction.rollback()
    connection.close()

# tests/integration/test_user_repository.py
from app.models import User
from app.repositories import UserRepository

def test_user_creation(db_session):
    """Test user creation in real PostgreSQL database"""
    repo = UserRepository(db_session)

    user = repo.create(email="test@example.com", name="Test User")

    # Verify user exists
    found_user = repo.find_by_email("test@example.com")
    assert found_user is not None
    assert found_user.name == "Test User"
    assert found_user.id is not None  # Auto-generated ID

def test_user_uniqueness_constraint(db_session):
    """Test database enforces unique email constraint"""
    repo = UserRepository(db_session)

    repo.create(email="test@example.com", name="User 1")

    # Duplicate email should raise IntegrityError
    with pytest.raises(IntegrityError):
        repo.create(email="test@example.com", name="User 2")
```

### TypeScript Example (PostgreSQL + Prisma)

```typescript
// tests/integration/database.test.ts
import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';

describe('Database Integration', () => {
  let container: StartedPostgreSqlContainer;
  let prisma: PrismaClient;

  beforeAll(async () => {
    // Start PostgreSQL container
    container = await new PostgreSqlContainer('postgres:15').start();

    // Set DATABASE_URL for Prisma
    process.env.DATABASE_URL = container.getConnectionUri();

    // Run migrations
    execSync('npx prisma migrate deploy', { stdio: 'inherit' });

    // Create Prisma client
    prisma = new PrismaClient();
  }, 60000);  // 60s timeout for container startup

  afterAll(async () => {
    await prisma.$disconnect();
    await container.stop();
  });

  afterEach(async () => {
    // Clean up data after each test
    await prisma.user.deleteMany();
    await prisma.document.deleteMany();
  });

  it('creates user and retrieves it', async () => {
    // Create user
    const user = await prisma.user.create({
      data: {
        email: 'test@example.com',
        name: 'Test User'
      }
    });

    // Retrieve user
    const found = await prisma.user.findUnique({
      where: { email: 'test@example.com' }
    });

    expect(found).not.toBeNull();
    expect(found?.name).toBe('Test User');
  });

  it('enforces unique email constraint', async () => {
    await prisma.user.create({
      data: { email: 'test@example.com', name: 'User 1' }
    });

    // Duplicate email should throw
    await expect(
      prisma.user.create({
        data: { email: 'test@example.com', name: 'User 2' }
      })
    ).rejects.toThrow();
  });
});
```

---

## Database Reset Strategies

| Strategy | Speed | Isolation | Best For |
|----------|-------|-----------|----------|
| **Transaction Rollback** | ⚡ Fastest (microseconds) | ✅ Perfect | Most tests |
| **TRUNCATE Tables** | ⚡ Fast (milliseconds) | ✅ Good | Tests that commit |
| **Fresh Container** | 🐌 Slow (2-5 seconds) | ✅ Perfect | Cross-test isolation |
| **DROP/CREATE Database** | 🐌 Slow (1-3 seconds) | ✅ Perfect | Migration tests |

### Transaction Rollback (Recommended for Most Tests)

**Pros:**
- ⚡ Fastest (no disk I/O)
- ✅ Perfect isolation
- ✅ No need to track tables

**Cons:**
- ❌ Can't test code that commits transactions
- ❌ Can't test SERIALIZABLE isolation level

**Example (Python):**
```python
@pytest.fixture
def db_session(engine):
    connection = engine.connect()
    transaction = connection.begin()

    Session = sessionmaker(bind=connection)
    session = Session()

    yield session

    session.close()
    transaction.rollback()  # Undo all changes
    connection.close()
```

### TRUNCATE Tables (For Tests That Commit)

**Pros:**
- ✅ Allows testing transaction commits
- ⚡ Fast (milliseconds)

**Cons:**
- ❌ Must track all tables
- ❌ Foreign key constraints can complicate

**Example (TypeScript):**
```typescript
afterEach(async () => {
  // Order matters (foreign keys)
  await prisma.$executeRaw`TRUNCATE TABLE documents CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE users CASCADE`;
  await prisma.$executeRaw`ALTER SEQUENCE users_id_seq RESTART WITH 1`;
});
```

### Fresh Container (For Maximum Isolation)

**Pros:**
- ✅ Perfect isolation
- ✅ No cleanup needed

**Cons:**
- 🐌 Slow (2-5 seconds per test)

**When to use:**
- Migration testing
- Schema evolution tests
- Cross-test contamination concerns

**Example:**
```python
@pytest.fixture
def fresh_db():
    """New container for each test (slow but isolated)"""
    with PostgresContainer("postgres:15") as postgres:
        engine = create_engine(postgres.get_connection_url())
        Base.metadata.create_all(engine)
        yield engine
```

---

## Contract Testing for Microservices

### What Is Contract Testing?

**Problem:** Service A calls Service B. Service B changes API. Service A breaks in production.

**Solution:** Contract testing verifies that:
1. **Consumer** (Service A) expects specific API behavior
2. **Provider** (Service B) fulfills that contract

**Tool:** Pact (industry standard for consumer-driven contracts)

### Pact Workflow

```
1. Consumer writes test → Generates contract (JSON)
2. Contract stored in Pact Broker
3. Provider verifies against contract
4. CI/CD checks compatibility with can-i-deploy
```

### Consumer Test (Frontend calling Assessment API)

```javascript
// tests/pact/assessment-api.pact.test.js
const { Pact } = require('@pact-foundation/pact');
const { fetchAssessment } = require('@/api/assessments');

describe('Assessment API Pact', () => {
  const provider = new Pact({
    consumer: 'ComplianceUI',
    provider: 'AssessmentAPI',
    port: 8080,
    log: './logs/pact.log',
    dir: './pacts'
  });

  beforeAll(() => provider.setup());
  afterEach(() => provider.verify());
  afterAll(() => provider.finalize());

  it('retrieves assessment results', async () => {
    await provider.addInteraction({
      state: 'assessment 123 exists',
      uponReceiving: 'a request for assessment results',
      withRequest: {
        method: 'GET',
        path: '/api/assessments/123',
        headers: {
          'Authorization': 'Bearer token123',
          'Accept': 'application/json'
        }
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
    expect(result.status).toBe('complete');
  });

  it('handles not found', async () => {
    await provider.addInteraction({
      state: 'assessment does not exist',
      uponReceiving: 'a request for non-existent assessment',
      withRequest: {
        method: 'GET',
        path: '/api/assessments/999',
        headers: { 'Authorization': 'Bearer token123' }
      },
      willRespondWith: {
        status: 404,
        body: {
          error: 'Assessment not found'
        }
      }
    });

    await expect(fetchAssessment(999)).rejects.toThrow('Assessment not found');
  });
});
```

**Output:** `pacts/ComplianceUI-AssessmentAPI.json` contract file.

### Provider Verification (Backend)

```python
# tests/pact/verify_pacts.py
from pact import Verifier
from app import create_app
from app.database import db
from app.models import Assessment

def setup_provider_state(state: str):
    """Create database state for pact verification"""
    if state == 'assessment 123 exists':
        db.session.add(Assessment(id=123, score=85, status='complete'))
        db.session.commit()
    elif state == 'assessment does not exist':
        pass  # Nothing to set up

app = create_app()

verifier = Verifier(
    provider='AssessmentAPI',
    provider_base_url='http://localhost:8000',
    provider_states_setup_url='http://localhost:8000/_pact/setup'
)

# Verify against consumer contracts
verifier.verify_pacts(
    './pacts/ComplianceUI-AssessmentAPI.json',
    enable_pending=False,
    publish_version='1.0.0',
    provider_version_branch='main'
)
```

### CI/CD Integration with Pact Broker

**1. Publish Contracts (Consumer CI)**

```yaml
# .github/workflows/consumer-ci.yml
- name: Run Pact tests
  run: npm test

- name: Publish contracts to Pact Broker
  run: |
    npx pact-broker publish ./pacts \
      --consumer-app-version $GITHUB_SHA \
      --branch $GITHUB_REF_NAME \
      --broker-base-url $PACT_BROKER_URL \
      --broker-token $PACT_BROKER_TOKEN
```

**2. Verify Contracts (Provider CI)**

```yaml
# .github/workflows/provider-ci.yml
- name: Verify Pact contracts
  run: pytest tests/pact/

- name: Publish verification results
  run: |
    pact-broker publish-verification-results \
      --provider-app-version $GITHUB_SHA \
      --branch $GITHUB_REF_NAME
```

**3. Check Deployment Compatibility**

```yaml
# .github/workflows/deploy.yml
- name: Can I deploy?
  run: |
    pact-broker can-i-deploy \
      --pacticipant AssessmentAPI \
      --version $GITHUB_SHA \
      --to production
```

**Output:**
```
CONSUMER        | C.VERSION | PROVIDER     | P.VERSION | SUCCESS?
----------------|-----------|--------------|-----------|----------
ComplianceUI    | abc123    | AssessmentAPI| def456    | true

Result: Computer says yes \o/
```

### When to Use Contract Testing

✅ **Use When:**
- Microservices architecture (Session 4 architecture)
- Multiple teams owning different services
- Services deployed independently
- API changes need coordination

❌ **Don't Use When:**
- Monolithic architecture
- Single team owns all services
- Services always deployed together
- E2E tests sufficient

---

## Message Queue Testing

### Kafka Integration Testing

```python
# tests/integration/test_message_queue.py
from testcontainers.kafka import KafkaContainer
from kafka import KafkaProducer, KafkaConsumer
from tenacity import retry, stop_after_delay, wait_fixed
import pytest
import json

@pytest.fixture(scope="session")
def kafka_container():
    """Start Kafka container for queue testing"""
    with KafkaContainer() as kafka:
        yield kafka

@pytest.fixture
def kafka_producer(kafka_container):
    """Create Kafka producer"""
    producer = KafkaProducer(
        bootstrap_servers=kafka_container.get_bootstrap_server(),
        value_serializer=lambda v: json.dumps(v).encode('utf-8')
    )
    yield producer
    producer.close()

@retry(stop=stop_after_delay(10), wait=wait_fixed(0.5))
def wait_for_message_processed(order_id, order_repo):
    """Wait for async processing with timeout (up to 10 seconds)"""
    order = order_repo.find_by_id(order_id)
    assert order is not None, f"Order {order_id} not found"
    assert order.status == "processed", f"Order {order_id} status is {order.status}, expected 'processed'"

def test_order_processing(kafka_producer, kafka_container, order_repo):
    """Test async order processing via Kafka"""
    # Start consumer (in background thread)
    consumer_thread = start_order_consumer(kafka_container)

    # Publish message to Kafka
    kafka_producer.send('orders', {
        'order_id': 'order_123',
        'items': ['item1', 'item2'],
        'customer_id': 'customer_456'
    })
    kafka_producer.flush()

    # Wait for async processing (up to 10 seconds)
    wait_for_message_processed('order_123', order_repo)

    # Verify order was processed correctly
    order = order_repo.find_by_id('order_123')
    assert order.status == "processed"
    assert order.items == ['item1', 'item2']

    consumer_thread.stop()
```

### RabbitMQ Integration Testing

```typescript
// tests/integration/rabbitmq.test.ts
import { RabbitMQContainer, StartedRabbitMQContainer } from '@testcontainers/rabbitmq';
import amqp from 'amqplib';

describe('RabbitMQ Integration', () => {
  let container: StartedRabbitMQContainer;
  let connection: amqp.Connection;
  let channel: amqp.Channel;

  beforeAll(async () => {
    container = await new RabbitMQContainer().start();
    connection = await amqp.connect(container.getConnectionUrl());
    channel = await connection.createChannel();
  });

  afterAll(async () => {
    await channel.close();
    await connection.close();
    await container.stop();
  });

  it('publishes and consumes messages', async () => {
    const queue = 'test_queue';
    await channel.assertQueue(queue, { durable: false });

    // Publish message
    channel.sendToQueue(queue, Buffer.from('Hello World'));

    // Consume message
    const message = await new Promise<string>((resolve) => {
      channel.consume(queue, (msg) => {
        if (msg) {
          resolve(msg.content.toString());
          channel.ack(msg);
        }
      });
    });

    expect(message).toBe('Hello World');
  });
});
```

### Message Queue Test Patterns

**1. Async Verification (Awaitility Pattern)**

```python
from tenacity import retry, stop_after_delay, wait_fixed

@retry(stop=stop_after_delay(10), wait=wait_fixed(0.5))
def wait_for_condition(check_fn):
    """Poll until condition true (max 10s)"""
    assert check_fn(), "Condition not met within timeout"

# Usage
wait_for_condition(lambda: order_repo.count() == 1)
```

**2. Dead Letter Queue Testing**

```python
def test_dead_letter_queue(kafka_producer, kafka_container):
    """Test messages moved to DLQ after max retries"""
    # Send invalid message
    kafka_producer.send('orders', {'invalid': 'data'})

    # Wait for DLQ
    dlq_consumer = KafkaConsumer(
        'orders.dlq',
        bootstrap_servers=kafka_container.get_bootstrap_server()
    )

    message = next(dlq_consumer, timeout=10)
    assert message.value == {'invalid': 'data'}
```

**3. Partition Ordering Guarantees**

```python
def test_partition_ordering(kafka_producer, kafka_container):
    """Test messages with same key go to same partition"""
    # Send 3 messages with same key
    for i in range(3):
        kafka_producer.send(
            'orders',
            key=b'customer_123',  # Same key
            value={'order_id': f'order_{i}'}
        )

    # Consume in order
    consumer = KafkaConsumer('orders', group_id='test')
    messages = [next(consumer) for _ in range(3)]

    # Verify ordering preserved
    assert messages[0].value['order_id'] == 'order_0'
    assert messages[1].value['order_id'] == 'order_1'
    assert messages[2].value['order_id'] == 'order_2'
```

**4. Schema Registry Testing (Avro/Protobuf)**

```python
def test_schema_compatibility(kafka_container, schema_registry):
    """Test producer/consumer use compatible schemas"""
    # Register schema v1
    schema_v1 = {
        "type": "record",
        "name": "Order",
        "fields": [
            {"name": "id", "type": "string"},
            {"name": "amount", "type": "float"}
        ]
    }
    schema_registry.register('orders-value', schema_v1)

    # Produce with v1
    producer.send('orders', {'id': 'order_123', 'amount': 99.99})

    # Register schema v2 (backward compatible)
    schema_v2 = {
        "type": "record",
        "name": "Order",
        "fields": [
            {"name": "id", "type": "string"},
            {"name": "amount", "type": "float"},
            {"name": "currency", "type": "string", "default": "USD"}  # New field with default
        ]
    }
    schema_registry.register('orders-value', schema_v2)

    # Consume with v2 (should work)
    message = consumer.poll()
    assert message['currency'] == 'USD'  # Default value
```

---

## CI/CD Integration

### GitHub Actions Example

```yaml
# .github/workflows/integration-tests.yml
name: Integration Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Set up Docker
        uses: docker/setup-buildx-action@v2

      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'

      - name: Install dependencies
        run: |
          pip install -r requirements.txt
          pip install testcontainers[postgres,kafka]

      - name: Run integration tests
        run: pytest tests/integration/ -v
        env:
          TESTCONTAINERS_RYUK_DISABLED: false  # Enable cleanup
```

### Test Execution Time Budget

| Test Type | Budget | Optimization |
|-----------|--------|--------------|
| Unit | < 5 min | Parallelize (pytest-xdist) |
| Integration (testcontainers) | < 15 min | Reuse session-scoped containers |
| E2E | < 30 min | Run critical paths only |

**Optimization Tip:** Use `scope="session"` for containers to start once per test suite (not per test):

```python
@pytest.fixture(scope="session")  # Start once for all tests
def postgres_container():
    with PostgresContainer("postgres:15") as postgres:
        yield postgres
```

---

## Summary

| Pattern | When to Use | Tool | Speed |
|---------|-------------|------|-------|
| **Testcontainers** | Database/queue integration | testcontainers | ⚡ Fast (2-5s startup) |
| **Contract Testing** | Microservices API | Pact | ⚡ Fast |
| **Message Queue Testing** | Async workflows | testcontainers | ⚡⚡ Medium |
| **Transaction Rollback** | Most DB tests | Native SQL | ⚡⚡⚡ Fastest |
| **Fresh Container** | Maximum isolation | testcontainers | 🐌 Slow |

**Key Takeaway:** Modern integration testing uses **real infrastructure** (not mocks) via testcontainers. This catches production issues early while maintaining fast, isolated tests.
