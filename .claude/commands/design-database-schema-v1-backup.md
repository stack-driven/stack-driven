---
description: Session 7 - Design complete database schema with migrations
---

# Design Database Schema (Session 7)

<!--
STEP NUMBERING CONVENTION:
- Main steps: Numbered 1-9 (Step 1, Step 2, Step 7, etc.)
- Lettered substeps: 2a, 2b, 2c, 2d, 6a, 6a1, 6b (inserted between main steps)
- Conditional subsections: 2-Hybrid (optional patterns with IF/SKIP gates)
- Nested substeps: 6a1 (sub-level under 6a)

When adding new optional patterns, use letter notation (2e, 6c) to avoid renumbering main steps.
-->

You are helping the user create a comprehensive database schema design based on their chosen database paradigm. This may include entity relationship diagrams (relational), collection structures (document), node/relationship definitions (graph), measurements (time-series), or key patterns (key-value), depending on the tech stack choice. This happens after defining architecture and brand strategy, but BEFORE generating the backlog, so that backlog items can be informed by the technical data model.

## When to Use This

**This is Session 7** in the core Stack-Driven cascade. Run it:
- After Session 6 (`/create-design` - design system)
- Before Session 10 (`/generate-backlog` - implementation planning)
- When you need to define your data model based on journey and architecture

**Skip this** if:
- You're using a no-code/low-code platform
- Your product doesn't require a database
- You prefer to evolve schema incrementally during development

## Your Task

Create a comprehensive database schema design including:
- **For Relational Databases (PostgreSQL, MySQL)**: Entity relationship diagrams (ERD), table definitions with columns/types/constraints, indexes, foreign keys, migration files
- **For Document Databases (MongoDB, Firestore)**: Collection design with document structure, embedded vs referenced relationships, compound indexes, sharding strategy
- **For Graph Databases (Neo4j)**: Node types, relationship types, properties, graph patterns, indexes
- **For Time-Series Databases (InfluxDB, TimescaleDB)**: Measurement design, tags, fields, retention policies, continuous aggregates
- **For Key-Value Stores (Redis)**: Key patterns, value types, TTL strategies, data structures
- Data modeling decisions with journey-based reasoning

---

## Process

### Step 1: Read Previous Outputs

**Required inputs:**

```
Read: product-guidelines/00-user-journey.ctx.md  # (context version for token efficiency)
Read: product-guidelines/01-product-strategy.ctx.md  # (context version for token efficiency)
Read: product-guidelines/02-tech-stack.ctx.md  # (context version for token efficiency)
Read: product-guidelines/02a-constraints.ctx.md  # (context version for token efficiency, if exists)
Read: product-guidelines/02b-coding-standards.ctx.md  # (context version for token efficiency, if exists)
Read: product-guidelines/02c-ai-integration-strategy.ctx.md  # (context version for token efficiency, if exists)
Read: product-guidelines/04-architecture.ctx.md  # (context version for token efficiency)
Read: product-guidelines/05-brand-strategy.ctx.md  # (context version for token efficiency)
```

**Optional inputs (if available):**

```
Read: product-guidelines/10-backlog/BACKLOG.md (if exists - backlog comes after schema in Session 10)
Read: product-guidelines/12-project-scaffold.md (if exists - scaffold comes after in Session 12)
```

**Extract from Journey**:
- What entities exist in the user's world?
- What data needs to persist across sessions?
- What relationships exist between entities?

**Extract from Tech Stack**:
- Database choice (PostgreSQL, MongoDB, MySQL, etc.)
- ORM/migration tool (Prisma, Alembic, TypeORM, Sequelize, etc.)
- Programming language (affects migration syntax)

**Extract from Architecture**:
- Existing schema decisions (if any)
- Data access patterns
- Performance requirements
- Multi-tenancy strategy

**Extract from Backlog (if available)**:
- What features need what data?
- What queries will be common?
- What relationships are needed?
- Note: Backlog is generated AFTER this session, so focus on journey and architecture if backlog doesn't exist yet

**Example (from compliance-saas):**
- Journey entities: Users, Documents, Assessments, Frameworks, Teams
- Database: PostgreSQL (from tech stack)
- ORM: Prisma (TypeScript) or Alembic (Python)
- Pattern: Multi-tenant (team-based isolation)
- Critical queries: "Get all assessments for user", "Calculate usage for billing"

---

### Step 2: Identify Core Entities

**Decision Tree - Entity Identification:**

```
For each journey step, ask:

1. What nouns appear in this step?
   - These are potential entities
   - Example: "User uploads document" → User, Document

2. Does this noun need to persist?
   - YES → It's an entity
   - NO → It's transient data (session, cache)

3. Does this noun belong to users?
   - YES → Add user_id foreign key
   - NO → It's a system entity

4. Does this noun have multiple instances per user?
   - YES → Separate table
   - NO → Could be part of User table
```

**Example (compliance-saas):**

```
Journey Step 1: User uploads compliance document
→ Entities: User, Document

Journey Step 2: User selects compliance frameworks
→ Entities: Framework (system entity)
→ Relationship: Many-to-many (documents can be assessed against multiple frameworks)

Journey Step 3: AI assesses document against frameworks
→ Entities: Assessment (links Document + Framework)
→ Stores results, status, timing

Journey Step 4: User reviews and shares report
→ No new entities
→ Assessment has sharable URL
```

**Core entities identified:**
- User (authentication, profile)
- Team (multi-tenancy)
- Document (uploaded files)
- Framework (compliance standards - SOC2, GDPR, etc.)
- Assessment (processing job + results)
- UsageEvent (billing tracking)

---

### Step 2-Hybrid: Hybrid/Polyglot Architecture Decision Tree

**Modern Pattern**: Combine specialized databases for optimal performance (polyglot persistence)

**When to use multiple databases**:

```
IF >80% of queries hit cache layer (sessions, rate limits)
  → Add Redis (in-memory, sub-millisecond latency)

IF >1M timestamped events per day (metrics, logs, IoT)
  → Add TimescaleDB/InfluxDB (10-20x better compression)

IF complex graph traversals (social network, fraud detection)
  → Add Neo4j (O(1) relationship queries vs O(n²) in SQL)

IF full-text search required (product search, documentation)
  → Add Elasticsearch (inverted indexes, fuzzy matching)
```

**Example Architecture** (SaaS application):

```
┌──────────────┐
│ PostgreSQL   │ ← Primary data store (users, billing, transactions)
└──────┬───────┘   - ACID guarantees
       │           - Complex relationships
       │           - Source of truth
       ↓
┌──────────────┐
│ Redis        │ ← Cache layer (sessions, rate limits, leaderboards)
└──────┬───────┘   - TTL-based eviction
       │           - Pub/sub for real-time
       │           - 10-100x faster than PostgreSQL
       ↓
┌──────────────┐
│ TimescaleDB  │ ← Observability (metrics, logs, traces)
└──────────────┘   - Time-bucketed storage
                    - Continuous aggregates
                    - 90-day retention → archive
```

**Data Flow**:
1. Write to PostgreSQL (source of truth)
2. Cache in Redis (read-through pattern)
3. Stream metrics to TimescaleDB (async)

**Trade-offs**:
- Optimal performance per use case
- Operational complexity (3 databases to maintain)
- Data consistency challenges (eventual consistency across stores)

**When NOT to use polyglot**:
- Team <3 engineers (operational burden too high)
- MVP stage (premature optimization)
- Simple CRUD app (PostgreSQL sufficient)

**If single database chosen**: Skip this subsection and proceed with i18n requirements.

---

### Step 2a: Check for Internationalization (i18n) Requirements

**If constraints file exists**, check for i18n requirement:

Read `product-guidelines/02a-constraints.ctx.md` and look for:
- "Internationalization requirements (i18n, l10n)" marked as required
- Multi-language or multi-region requirements

**If i18n IS required**, apply translation patterns to your schema:

**Pattern 1: Locale Column for User-Facing Content**
Add `locale` column to tables with translatable content:
```sql
-- For content that varies by user's language preference
CREATE TABLE products (
  id UUID PRIMARY KEY,
  sku VARCHAR(50) NOT NULL,
  price_cents INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Separate translation table (recommended for multiple languages)
CREATE TABLE product_translations (
  id UUID PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  locale VARCHAR(10) NOT NULL, -- e.g., 'en-US', 'es-ES', 'de-DE'
  name VARCHAR(255) NOT NULL,
  description TEXT,
  UNIQUE(product_id, locale)
);

CREATE INDEX idx_product_translations_locale ON product_translations(locale);
CREATE INDEX idx_product_translations_product_id ON product_translations(product_id);
```

**Pattern 2: User Locale Preference**
Track user's preferred language:
```sql
ALTER TABLE users ADD COLUMN preferred_locale VARCHAR(10) DEFAULT 'en-US';
CREATE INDEX idx_users_preferred_locale ON users(preferred_locale);
```

**Pattern 3: Accept-Language Tracking (if analytics required)**
For understanding locale distribution:
```sql
CREATE TABLE user_sessions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  detected_locale VARCHAR(10), -- From Accept-Language header
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Decision Tree - What Needs Translation?**
```
For each entity, ask:

1. Is this content user-facing?
   ├─ NO → Skip translation (internal IDs, timestamps, metrics)
   └─ YES → Continue to 2

2. Does this content vary by language?
   ├─ NO → Keep in main table (names, emails, numeric values)
   └─ YES → Add translation pattern

3. How many languages?
   ├─ 1-2 languages → Consider locale column in main table
   └─ 3+ languages → Use separate translation table (cleaner)
```

**Example (EU compliance SaaS with German, French, Spanish):**
```
Entities requiring translation:
- Framework names/descriptions (SOC2, GDPR shown in user's language)
- Error messages (validation, processing failures)
- Email templates (assessment complete notifications)
- UI labels (stored in codebase translation files, not database)

Entities NOT requiring translation:
- User emails, names (user-provided data)
- Document filenames (original upload names)
- Timestamps, IDs, status codes (system data)
- Audit logs (compliance requirement for English)
```

**If i18n is NOT required**: Skip this subsection and proceed with standard entity design.

---

### Step 2b: Implement Row-Level Security (RLS) for Multi-Tenancy

**Check Session 4**: If architecture uses multi-tenant pattern (shared schema with team-based isolation), implement Row-Level Security for defense-in-depth data protection.

**If NOT multi-tenant**: Skip this subsection and proceed with integration requirements.

**Why RLS is the 2025 standard**:
- Defense-in-depth: Prevents data leakage from coding errors
- Database-level enforcement: Cannot be bypassed by application bugs
- Compliance-ready: Required for SOC2, ISO 27001 certification

**Step 1: Enable RLS on tenant-scoped tables**
```sql
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_events ENABLE ROW LEVEL SECURITY;
```

**Step 2: Create tenant isolation policy using session variable**
```sql
-- Policy: Users can only see their team's data
CREATE POLICY tenant_isolation_policy ON documents
  FOR ALL
  USING (team_id = current_setting('app.tenant_id', true)::UUID);

CREATE POLICY tenant_isolation_policy ON assessments
  FOR ALL
  USING (team_id = current_setting('app.tenant_id', true)::UUID);
```

**Step 3: Force policy for all roles (prevents superuser bypass)**
```sql
ALTER TABLE documents FORCE ROW LEVEL SECURITY;
ALTER TABLE assessments FORCE ROW LEVEL SECURITY;
```

**Application Integration** (Node.js example):
```typescript
// Set tenant context at request start (middleware)
await db.query('SET app.tenant_id = $1', [user.teamId]);

// All subsequent queries automatically filtered by RLS
const docs = await db.query('SELECT * FROM documents');
// Returns only current tenant's docs, even with SELECT *
```

**Security Validation**:
```sql
-- Test tenant isolation
SET app.tenant_id = '00000000-0000-0000-0000-000000000001';
SELECT * FROM documents; -- Should only see Team 1 docs

SET app.tenant_id = '00000000-0000-0000-0000-000000000002';
SELECT * FROM documents; -- Should only see Team 2 docs
```

**When to use RLS**:
- Multi-tenant SaaS with shared schema (team_id on every table)
- Compliance requirements (HIPAA, SOC2, GDPR)
- High-risk data (financial, healthcare, PII)

**When NOT to use RLS**:
- Separate database per tenant (physical isolation)
- Single-tenant applications
- Performance-critical systems (adds ~5-10% query overhead)

**If multi-tenancy is NOT required**: Skip this subsection and proceed with integration requirements.

---

### Step 2c: Check for Integration Requirements

**Check Session 2a for third-party integrations**: If `product-guidelines/02a-constraints.ctx.md` identifies external system integrations, add integration-specific tables to the schema.

**If NO third-party integrations**: Skip this subsection and proceed with GDPR compliance patterns.

#### Integration-Specific Tables

**When to include**:
- `integration_credentials`: If ANY API integration exists
- `webhook_events`: If ANY integration sends webhooks to you
- `sync_jobs`: If bidirectional sync is required (from Session 2a)
- `external_resource_mappings`: If sync_jobs table is needed

#### integration_credentials
**Purpose**: Store encrypted API keys, OAuth tokens, refresh tokens
**When needed**: Any API integration requiring authentication

```sql
CREATE TABLE integration_credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,

  -- Integration identity
  provider VARCHAR(50) NOT NULL, -- 'stripe', 'sendgrid', 'salesforce'
  environment VARCHAR(20) NOT NULL DEFAULT 'production', -- 'production', 'test'

  -- Credentials (encrypted at application layer)
  api_key_encrypted TEXT,
  access_token_encrypted TEXT,
  refresh_token_encrypted TEXT,

  -- Token lifecycle
  expires_at TIMESTAMPTZ,
  last_refreshed_at TIMESTAMPTZ,

  -- Metadata
  scopes TEXT[], -- OAuth scopes granted
  external_account_id TEXT, -- Their account ID (Stripe customer ID, etc.)

  -- Audit
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(team_id, provider, environment)
);

CREATE INDEX idx_integration_credentials_team ON integration_credentials(team_id);
CREATE INDEX idx_integration_credentials_expires ON integration_credentials(expires_at)
  WHERE expires_at IS NOT NULL;
```

**Encryption Key Management Note:**
- Credentials stored in `*_encrypted` columns MUST be encrypted at application layer before storage
- Use environment-specific encryption keys (separate keys for dev/staging/production)
- Recommended: Use key management service (AWS KMS, GCP KMS, HashiCorp Vault) for key storage
- Never commit encryption keys to version control
- Implement key rotation strategy with backward compatibility during rotation period
- Consider using envelope encryption pattern for large-scale deployments

#### webhook_events
**Purpose**: Log incoming webhook payloads for idempotency and debugging
**When needed**: Any integration that sends webhooks (Stripe, SendGrid, Salesforce)

```sql
CREATE TABLE webhook_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Event identity (for idempotency)
  provider VARCHAR(50) NOT NULL, -- 'stripe', 'sendgrid'
  event_id VARCHAR(255) NOT NULL, -- Provider's event ID
  event_type VARCHAR(100) NOT NULL, -- 'payment_intent.succeeded'

  -- Payload
  payload JSONB NOT NULL, -- Full webhook payload
  signature VARCHAR(500), -- HMAC signature for verification

  -- Processing status
  status VARCHAR(50) NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'processing', 'processed', 'failed', 'ignored')),
  processed_at TIMESTAMPTZ,
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,

  -- Audit
  received_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(provider, event_id) -- Idempotency constraint
);

CREATE INDEX idx_webhook_events_provider_type ON webhook_events(provider, event_type);
CREATE INDEX idx_webhook_events_status ON webhook_events(status)
  WHERE status IN ('pending', 'failed');
CREATE INDEX idx_webhook_events_received ON webhook_events(received_at DESC);
```

#### sync_jobs
**Purpose**: Track background synchronization with external systems
**When needed**: Bidirectional sync integrations (CRM sync, data imports)

```sql
CREATE TABLE sync_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,

  -- Sync identity
  provider VARCHAR(50) NOT NULL, -- 'salesforce', 'hubspot'
  resource_type VARCHAR(100) NOT NULL, -- 'contacts', 'leads', 'opportunities'
  direction VARCHAR(20) NOT NULL -- 'import', 'export', 'bidirectional'
    CHECK (direction IN ('import', 'export', 'bidirectional')),

  -- Sync status
  status VARCHAR(50) NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'running', 'completed', 'failed', 'cancelled')),

  -- Progress tracking
  total_records INTEGER,
  processed_records INTEGER DEFAULT 0,
  failed_records INTEGER DEFAULT 0,

  -- Timing
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  next_sync_at TIMESTAMPTZ, -- For recurring syncs

  -- Results
  summary JSONB, -- {created: 10, updated: 5, skipped: 2, errors: [{...}]}
  error_message TEXT,

  -- Audit
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_sync_jobs_team ON sync_jobs(team_id);
CREATE INDEX idx_sync_jobs_status ON sync_jobs(status);
CREATE INDEX idx_sync_jobs_next_sync ON sync_jobs(next_sync_at)
  WHERE next_sync_at IS NOT NULL;
```

#### external_resource_mappings
**Purpose**: Map internal IDs to external system IDs for bidirectional sync
**When needed**: Any sync integration where you need to track "this user = that Salesforce contact"

```sql
CREATE TABLE external_resource_mappings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Internal resource
  internal_id UUID NOT NULL,
  internal_type VARCHAR(50) NOT NULL, -- 'user', 'document', 'assessment'

  -- External resource
  provider VARCHAR(50) NOT NULL, -- 'salesforce', 'stripe'
  external_id VARCHAR(255) NOT NULL, -- Their ID
  external_type VARCHAR(100), -- 'Contact', 'Customer', 'Subscription'

  -- Metadata
  last_synced_at TIMESTAMPTZ,
  sync_direction VARCHAR(20), -- 'inbound', 'outbound', 'bidirectional'

  -- Audit
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(provider, external_id),
  UNIQUE(internal_type, internal_id, provider)
);

CREATE INDEX idx_external_mappings_internal ON external_resource_mappings(internal_type, internal_id);
CREATE INDEX idx_external_mappings_provider ON external_resource_mappings(provider, external_id);
```

**Adapt for database paradigm**: If the user's tech stack uses a non-relational database (from Session 3), adapt these patterns accordingly:
- Document databases (MongoDB, DynamoDB): Use embedded documents for credentials, separate collections for webhook_events
- Graph databases (Neo4j): Model integrations as nodes with relationships to teams/resources
- Time-series (InfluxDB): webhook_events as time-series data, credentials in separate store

---

### Step 2d: GDPR Compliance Patterns

**Check Session 2a**: If GDPR compliance marked as required OR product serves EU users, implement Right to Erasure workflow.

**If GDPR compliance is NOT required**: Skip this subsection and proceed with entity relationships.

**The Problem**: Standard `DELETE` leaves data in backups, replicas, event logs, and cloud storage time-travel snapshots.

**Multi-Layer Deletion Pattern** (required for complete data removal):

```sql
-- PHASE 1: Soft Delete (30-day safety period)
UPDATE users
SET deleted_at = NOW(),
    deletion_requested_by = 'user_request'
WHERE id = $user_id;

-- Notify external integrations immediately
-- POST to Stripe API: DELETE /customers/{id}
-- POST to SendGrid API: DELETE /contacts/{id}

-- PHASE 2: Upstream Deletion (event streams)
-- Remove from Kafka topics, Redis cache, message queues
DELETE FROM kafka_offset_tracking WHERE user_id = $user_id;
-- REDIS DEL user:session:{user_id};

-- PHASE 3: Hard Delete After Verification (30 days later)
BEGIN;
  -- Delete user-owned data (CASCADE handles relationships)
  DELETE FROM users
  WHERE id = $user_id
    AND deleted_at < NOW() - INTERVAL '30 days';

  -- Anonymize audit logs (retain compliance records but remove PII)
  UPDATE audit_log
  SET old_data = jsonb_set(old_data, '{email}', '"[REDACTED]"'::jsonb),
      new_data = jsonb_set(new_data, '{email}', '"[REDACTED]"'::jsonb)
  WHERE user_id = $user_id;

  -- Anonymize analytics events (preserve metrics, remove identity)
  UPDATE analytics_events
  SET user_id = '00000000-0000-0000-0000-000000000000',
      properties = properties - 'email' - 'name' - 'phone'
  WHERE user_id = $user_id;
COMMIT;

-- PHASE 4: Physical Purge (reclaim disk space)
VACUUM FULL users; -- PostgreSQL: Physically removes deleted rows
```

**For Cloud Data Warehouses** (Snowflake, Databricks):
```sql
-- Override 30-day time travel retention (critical for GDPR)
DELETE FROM bronze.user_events WHERE user_id = $user_id;
VACUUM TABLE bronze.user_events; -- Snowflake
-- or
PURGE TABLE bronze.user_events; -- Databricks

-- Verify time-travel snapshots deleted
SELECT * FROM bronze.user_events AT (TIMESTAMP => DATEADD(day, -1, CURRENT_TIMESTAMP()))
WHERE user_id = $user_id; -- Should return 0 rows
```

**GDPR Deletion Validation Checklist**:
- [ ] User data deleted from all application tables (via CASCADE)
- [ ] Audit logs anonymized (PII replaced with `[REDACTED]`)
- [ ] External integrations notified (webhooks sent to Stripe, SendGrid, etc.)
- [ ] Event streams purged (Kafka topics, Redis cache)
- [ ] Data warehouse time-travel snapshots purged
- [ ] Backups older than retention period excluded from restores
- [ ] Deletion logged in compliance audit trail with timestamp

**Retention Exceptions** (do NOT delete):
- Financial records required by law (invoices, tax records) - 7 years
- Fraud prevention data (hashed identifiers only)
- Aggregated analytics with no PII (metric totals)

**PII Data Masking for Dev/Test Environments**:

Pattern: Hash/scramble PII in non-production environments to prevent leaks:

```sql
-- Anonymize production snapshot for dev/staging (run after DB restore)
UPDATE users SET
  email = md5(email::text) || '@example.com',
  first_name = 'User',
  last_name = substring(md5(id::text), 1, 8),
  phone = NULL,
  address = NULL
WHERE TRUE; -- Apply to all rows

-- Verify no real PII remains
SELECT * FROM users WHERE email NOT LIKE '%@example.com'; -- Should be empty
```

**Automation**: Add to CI/CD pipeline for staging database refreshes.

**If GDPR compliance is NOT required**: Skip this subsection and proceed with entity relationships.

---

### Step 3: Define Entity Relationships

**Relationship Patterns:**

**One-to-Many:**
```
User has many Documents
Team has many Users
User has many Assessments
```

**Many-to-Many:**
```
Assessment → Many Frameworks
Framework → Many Assessments
(Requires join table: assessment_frameworks)
```

**One-to-One:**
```
User has one UserProfile (optional, for extended attributes)
```

**Decision Tree - Relationship Type:**

```
1. Can Entity A have multiple Entity B?
   ├─ NO → Continue to 2
   └─ YES → Continue to 2

2. Can Entity B belong to multiple Entity A?
   ├─ NO → One-to-Many (A → B)
   └─ YES → Many-to-Many (A ←→ B, needs join table)

3. Is the relationship optional?
   ├─ NO → Foreign key NOT NULL
   └─ YES → Foreign key NULLABLE
```

**Example ERD (compliance-saas):**

```
┌─────────────┐       ┌──────────────┐
│    Teams    │───────│    Users     │
└─────────────┘  1:N  └──────┬───────┘
                              │ 1:N
                      ┌───────▼────────┐
                      │   Documents    │
                      └───────┬────────┘
                              │ 1:N
                      ┌───────▼────────┐       ┌──────────────┐
                      │  Assessments   │───────│  Frameworks  │
                      └────────────────┘  M:N  └──────────────┘
                              │ 1:N
                      ┌───────▼────────┐
                      │  UsageEvents   │
                      └────────────────┘
```

---

### Step 4: Define Table Schemas

For EACH entity, define:
- **Primary key** (UUID recommended for distributed systems)
- **Columns** with types, nullability, defaults
- **Foreign keys** with referential integrity
- **Constraints** (unique, check constraints)
- **Indexes** for query patterns

**Decision Tree - Column Type Selection:**

```
1. What kind of data?
   ├─ ID/Reference → UUID (or BIGINT for high throughput)
   ├─ Short text (<255 chars) → VARCHAR(255) or TEXT
   ├─ Long text (>255 chars) → TEXT
   ├─ Number (integer) → INTEGER or BIGINT
   ├─ Number (decimal) → NUMERIC(precision, scale)
   ├─ True/False → BOOLEAN
   ├─ Date/Time → TIMESTAMPTZ (timezone-aware)
   ├─ JSON → JSONB (PostgreSQL), JSON (others)
   ├─ Array → ARRAY (PostgreSQL), separate table (others)
   └─ Enum → ENUM or TEXT with CHECK constraint

2. Can it be NULL?
   ├─ Required from start → NOT NULL
   ├─ Optional but important → NULLABLE
   └─ Computed/async → NULLABLE with default

3. Does it need a default?
   ├─ Auto-generated → DEFAULT (uuid, now(), etc.)
   ├─ Business default → DEFAULT value
   └─ User-provided → No default
```

**Example table definition (Assessments):**

```sql
CREATE TABLE assessments (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Foreign Keys
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,

  -- Status tracking
  status VARCHAR(50) NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'processing', 'completed', 'failed')),

  -- Results (flexible structure from AI)
  results JSONB,
  error_message TEXT,

  -- Performance tracking
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  duration_ms INTEGER,

  -- Audit
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

**Why these choices:**
- UUID: Non-guessable, distributed-safe
- JSONB: Flexible results structure (Claude output evolves)
- CHECK constraint: Enforce valid status values at database level
- TIMESTAMPTZ: Timezone-aware for global users
- NOT NULL where appropriate: Fail fast on missing data

---

### Step 5: Design Indexes with Specialized Types

**Index Type Decision Tree** (PostgreSQL 17):

For PostgreSQL databases, choose the optimal index type based on query patterns:

```
1. Is this a foreign key or equality/range query?
   → Use B-tree (default): CREATE INDEX idx_assessments_user_id ON assessments(user_id);

2. Is this a JSONB containment or full-text search query?
   → Use GIN (Generalized Inverted Index):
   CREATE INDEX idx_assessments_results_gin ON assessments USING GIN (results);

   Query pattern: SELECT * FROM assessments WHERE results @> '{"status": "passed"}';
   Performance: 10-100x faster than B-tree on JSONB columns

3. Is this a massive time-ordered table (>10M rows)?
   → Use BRIN (Block Range Index):
   CREATE INDEX idx_usage_events_created_brin ON usage_events USING BRIN (created_at);

   Performance: 99% smaller than B-tree, ideal for usage_events, audit_log, webhook_events

4. Is this geometric/spatial data?
   → Use GiST: CREATE INDEX idx_locations_geom ON locations USING GiST (geom);
```

**Validation Checklist for Specialized Indexes**:
- [ ] All JSONB columns have GIN indexes if queried with `@>`, `?`, `?|`, `?&` operators
- [ ] Time-ordered tables >1M rows use BRIN indexes on timestamp columns
- [ ] All foreign keys have B-tree indexes
- [ ] Run `EXPLAIN ANALYZE` on critical queries to verify index usage (no Seq Scan on large tables)

**Indexing Strategy:**

**Index based on query patterns from backlog:**

```
Query: "Get all assessments for a user"
→ Index: CREATE INDEX idx_assessments_user_id ON assessments(user_id);

Query: "Show recent assessments first"
→ Index: CREATE INDEX idx_assessments_created ON assessments(created_at DESC);

Query: "Find all pending assessments"
→ Index: CREATE INDEX idx_assessments_status ON assessments(status) WHERE status = 'pending';

Query: "Calculate monthly usage for billing"
→ Index: CREATE INDEX idx_usage_team_month ON usage_events(team_id, date_trunc('month', created_at));

Query: "Search assessments by JSONB results"
→ Index: CREATE INDEX idx_assessments_results ON assessments USING GIN (results);
```

**Decision Tree - Should I Index This?**

```
1. Is this column used in WHERE clauses?
   ├─ YES, frequently → Index it (choose type from decision tree above)
   └─ NO → Don't index

2. Is this column used in ORDER BY?
   ├─ YES → Index it (with DESC if sorting descending)
   └─ NO → Continue

3. Is this column a foreign key?
   ├─ YES → Almost always index (for joins) - use B-tree
   └─ NO → Continue

4. Does this query filter on multiple columns?
   ├─ YES → Composite index (most selective first)
   └─ NO → Single-column index

5. Is this a large table (>100K rows)?
   ├─ YES → Indexes are critical
   └─ NO → Indexes help but less critical
```

**Index Guidelines:**
- **DO index**: Foreign keys, frequently queried columns, sort columns
- **DON'T index**: Small tables (<1000 rows), columns rarely queried, frequently updated columns (index maintenance cost)
- **Composite indexes**: Order matters - most selective column first
- **Partial indexes**: For queries with common WHERE conditions (e.g., `WHERE status = 'active'`)

**Example index set (compliance-saas):**

```sql
-- Foreign key indexes (joins) - B-tree
CREATE INDEX idx_assessments_user_id ON assessments(user_id);
CREATE INDEX idx_assessments_document_id ON assessments(document_id);
CREATE INDEX idx_documents_user_id ON documents(user_id);
CREATE INDEX idx_users_team_id ON users(team_id);

-- Query pattern indexes - B-tree
CREATE INDEX idx_assessments_created ON assessments(created_at DESC);
CREATE INDEX idx_assessments_status ON assessments(status);

-- JSONB indexes - GIN for containment queries
CREATE INDEX idx_assessments_results ON assessments USING GIN (results);

-- Time-series indexes - BRIN for massive tables
CREATE INDEX idx_usage_events_created ON usage_events USING BRIN (created_at);
CREATE INDEX idx_audit_log_timestamp ON audit_log USING BRIN (action_timestamp);

-- Composite indexes (multiple columns commonly queried together)
CREATE INDEX idx_assessments_user_status ON assessments(user_id, status);

-- Partial indexes (filtered queries)
CREATE INDEX idx_assessments_processing ON assessments(user_id)
  WHERE status IN ('pending', 'processing');

-- Billing queries
CREATE INDEX idx_usage_team_month ON usage_events(
  team_id,
  date_trunc('month', created_at)
);
```

---

### Step 6: Add Data Constraints

**Constraints ensure data integrity:**

**Types of Constraints:**

1. **NOT NULL**: Column must have a value
   ```sql
   email TEXT NOT NULL
   ```

2. **UNIQUE**: No duplicate values
   ```sql
   email TEXT UNIQUE
   clerk_id TEXT UNIQUE NOT NULL
   ```

3. **CHECK**: Custom validation
   ```sql
   status TEXT CHECK (status IN ('pending', 'processing', 'completed', 'failed'))
   price_cents INTEGER CHECK (price_cents >= 0)
   ```

4. **FOREIGN KEY**: Reference another table
   ```sql
   user_id UUID REFERENCES users(id) ON DELETE CASCADE
   ```

5. **DEFAULT**: Value if not provided
   ```sql
   created_at TIMESTAMPTZ DEFAULT NOW()
   status TEXT DEFAULT 'pending'
   ```

**Decision Tree - Referential Actions:**

```
When defining foreign keys, choose ON DELETE behavior:

1. What happens when parent is deleted?
   ├─ Child should be deleted too → ON DELETE CASCADE
   │  Example: User deleted → Delete their documents
   │
   ├─ Child should become orphaned (no reference) → ON DELETE SET NULL
   │  Example: Team disbanded → User.team_id = NULL
   │
   └─ Deletion should be prevented if child exists → ON DELETE RESTRICT
      Example: Can't delete Framework if Assessments reference it
```

**Example constraints (compliance-saas):**

```sql
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_size_bytes INTEGER NOT NULL CHECK (file_size_bytes > 0),
  status TEXT NOT NULL DEFAULT 'uploading'
    CHECK (status IN ('uploading', 'ready', 'error')),
  s3_key TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

### Step 6a: Implement Audit Logging (if compliance required)

**Check Session 2a**: If regulatory compliance (HIPAA, SOC2, GDPR) marked as required, implement immutable audit trail with row-level change tracking.

**If compliance is NOT required**: Skip this subsection and proceed with temporal tables.

**Pattern**: Trigger-based audit logging with JSONB deltas

```sql
CREATE TABLE audit_log (
  id BIGSERIAL PRIMARY KEY,
  table_name TEXT NOT NULL,
  action_type TEXT NOT NULL, -- 'INSERT', 'UPDATE', 'DELETE'
  record_id UUID NOT NULL,    -- ID of affected row

  -- Full row snapshots
  old_data JSONB,             -- Row state before change
  new_data JSONB,             -- Row state after change

  -- Delta (what actually changed)
  changed_fields JSONB,       -- {"email": {"old": "a@x.com", "new": "b@x.com"}}

  -- Context
  user_id UUID,               -- Who made the change
  user_ip INET,               -- IP address (for fraud detection)
  user_agent TEXT,            -- Browser/API client

  -- Timing
  action_timestamp TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_log_table_action ON audit_log(table_name, action_timestamp DESC);
CREATE INDEX idx_audit_log_record ON audit_log(table_name, record_id);
CREATE INDEX idx_audit_log_user ON audit_log(user_id);

-- Trigger function to capture changes automatically
CREATE OR REPLACE FUNCTION log_audit_changes() RETURNS TRIGGER AS $$
DECLARE
  old_json JSONB;
  new_json JSONB;
  delta JSONB;
BEGIN
  -- Convert rows to JSONB
  old_json := CASE WHEN TG_OP = 'DELETE' THEN row_to_json(OLD)::jsonb ELSE NULL END;
  new_json := CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN row_to_json(NEW)::jsonb ELSE NULL END;

  -- Calculate delta (only for UPDATEs)
  IF TG_OP = 'UPDATE' THEN
    SELECT jsonb_object_agg(key, jsonb_build_object('old', old_val, 'new', new_val))
    INTO delta
    FROM jsonb_each(old_json) o(key, old_val)
    JOIN jsonb_each(new_json) n(key, new_val) USING (key)
    WHERE old_val IS DISTINCT FROM new_val;
  END IF;

  -- Insert audit record
  INSERT INTO audit_log (
    table_name,
    action_type,
    record_id,
    old_data,
    new_data,
    changed_fields,
    user_id
  ) VALUES (
    TG_TABLE_NAME,
    TG_OP,
    COALESCE(NEW.id, OLD.id),
    old_json,
    new_json,
    delta,
    current_setting('app.user_id', true)::UUID -- Set by application
  );

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Apply to sensitive tables
CREATE TRIGGER users_audit
  AFTER INSERT OR UPDATE OR DELETE ON users
  FOR EACH ROW EXECUTE FUNCTION log_audit_changes();

CREATE TRIGGER assessments_audit
  AFTER INSERT OR UPDATE OR DELETE ON assessments
  FOR EACH ROW EXECUTE FUNCTION log_audit_changes();
```

**Why Triggers Over Application Code**:
- 100% coverage: Captures direct SQL, CLI, migrations, manual updates
- Tamper-proof: Application cannot bypass (compliance requirement)
- Automatic: No developer action required for new tables

**Query Examples**:

```sql
-- Who deleted this user?
SELECT user_id, action_timestamp, old_data->>'email'
FROM audit_log
WHERE table_name = 'users'
  AND record_id = '...'
  AND action_type = 'DELETE';

-- What changed in last 24 hours?
SELECT table_name, action_type, changed_fields
FROM audit_log
WHERE action_timestamp > NOW() - INTERVAL '24 hours'
ORDER BY action_timestamp DESC;

-- Track specific user's changes
SELECT table_name, action_type, changed_fields, action_timestamp
FROM audit_log
WHERE user_id = '...'
ORDER BY action_timestamp DESC;
```

**Retention**: Archive audit_log older than 7 years to cold storage (compliance requirement).

**If compliance is NOT required**: Skip this subsection and proceed with temporal tables.

---

### Step 6a1: Temporal Tables for Point-in-Time Forensics

**When to use**: Financial services, healthcare, legal (Session 2a compliance requirements)

**Pattern** (PostgreSQL with temporal_tables extension):

```sql
-- Install extension
CREATE EXTENSION IF NOT EXISTS temporal_tables;

-- Main table with system versioning columns
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,

  -- System versioning (managed automatically)
  valid_from TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  valid_to TIMESTAMPTZ NOT NULL DEFAULT 'infinity'
);

-- History table (exact copy of structure)
CREATE TABLE users_history (LIKE users);

-- Trigger to automatically version changes
CREATE TRIGGER users_versioning
  BEFORE UPDATE OR DELETE ON users
  FOR EACH ROW EXECUTE FUNCTION versioning(
    'valid_from', 'valid_to', 'users_history', true
  );
```

**How it works**:
- Every UPDATE/DELETE copies old row to `users_history` with `valid_to = NOW()`
- New row gets `valid_from = NOW()`, `valid_to = 'infinity'`
- Full history of every change preserved

**Point-in-time queries**:

```sql
-- What was this user's email on 2025-01-15?
SELECT email FROM users_history
WHERE id = '...'
  AND valid_from <= '2025-01-15'
  AND valid_to > '2025-01-15';

-- Reconstruct entire table as of specific date
SELECT * FROM users_history
WHERE valid_from <= '2025-01-15'
  AND valid_to > '2025-01-15'
UNION ALL
SELECT * FROM users
WHERE valid_from <= '2025-01-15';
```

**Compliance use case**: Regulator asks "prove this user consented to terms on 2024-06-01"
```sql
SELECT consented_to_terms, valid_from
FROM users_history
WHERE id = '...'
  AND valid_from <= '2024-06-01'
  AND valid_to > '2024-06-01';
-- Returns: consented_to_terms = true, valid_from = 2024-05-28
```

**Storage cost**: ~2-3x main table size (acceptable for compliance)

**If temporal tables NOT required**: Skip this subsection and proceed with zero-downtime migrations.

---

### Step 6b: Zero-Downtime Migration Strategies

**For production deployments with <1 minute downtime tolerance**, use these migration patterns:

**Pattern 1: Expand-Contract (Backward-Compatible Changes)**

Use case: Renaming column `name` → `full_name` in `users` table with 10M rows

Traditional approach (5+ minutes downtime):
```sql
-- BAD: ALTER TABLE locks table, blocks all writes
ALTER TABLE users RENAME COLUMN name TO full_name;
```

Zero-downtime approach (3-phase deployment):

**Phase 1 - Expand** (Deploy v1 application + migration):
```sql
-- Add new column (doesn't lock table)
ALTER TABLE users ADD COLUMN full_name TEXT;

-- Backfill in batches (avoids lock escalation)
UPDATE users SET full_name = name WHERE full_name IS NULL LIMIT 1000;
-- Repeat until backfill complete

-- Add index without blocking writes
CREATE INDEX CONCURRENTLY idx_users_full_name ON users(full_name);
```

Application code v1 (writes to BOTH columns):
```typescript
await db.query(
  'UPDATE users SET name = $1, full_name = $1 WHERE id = $2',
  [newName, userId]
);
```

**Phase 2 - Migrate** (Wait 1 week, monitor for issues):
- All reads now use `full_name`
- Writes still go to both columns
- Monitor for any remaining `name` column usage

**Phase 3 - Contract** (Deploy v2 application + migration):
```sql
-- Safe to drop old column (no readers/writers remain)
ALTER TABLE users DROP COLUMN name;
```

Downtime: 0 seconds (old and new schemas coexist during migration)

---

**Pattern 2: Online Index Creation (PostgreSQL)**

Use case: Adding index to 100M row `assessments` table

```sql
-- WRONG: Locks table for writes (5+ minutes downtime)
CREATE INDEX idx_assessments_created ON assessments(created_at);

-- CORRECT: Builds index without blocking writes
CREATE INDEX CONCURRENTLY idx_assessments_created ON assessments(created_at);
```

Tradeoffs:
- CONCURRENTLY takes 2-3x longer to build (acceptable for zero downtime)
- If build fails mid-way, leaves INVALID index (must DROP and retry)

Validation:
```sql
-- Check for invalid indexes
SELECT indexrelid::regclass AS index_name, indisvalid
FROM pg_index
WHERE NOT indisvalid;

-- Drop invalid indexes and retry
DROP INDEX CONCURRENTLY idx_assessments_created; -- if invalid
CREATE INDEX CONCURRENTLY idx_assessments_created ON assessments(created_at);
```

---

**Pattern 3: Blue-Green Database Migration**

Use case: Migrating PostgreSQL RDS → Aurora (different database engine)

Architecture:
1. Blue (current production): PostgreSQL RDS
2. Green (new): Aurora cluster
3. Replication: AWS Database Migration Service (DMS) - continuous sync Blue → Green

Migration Steps:

```bash
# Day 1: Start replication
aws dms create-replication-task \
  --source=postgresql-rds \
  --target=aurora-cluster \
  --mode=full-load-and-cdc # Full copy + ongoing changes

# Days 2-7: Monitor replication lag
aws dms describe-replication-tasks | jq '.ReplicationLag'
# Target: <1 second lag

# Day 8: Cutover (maintenance window)
# 1. Stop application writes (maintenance mode) - 10 seconds
# 2. Wait for replication lag = 0
# 3. Update application DATABASE_URL → Aurora
# 4. Resume application writes

# Day 9-14: Monitor Green performance
# Keep Blue running as hot standby

# Day 15: Decommission Blue (if no issues)
```

Rollback Plan:
- If issues detected on Green: Update DATABASE_URL → Blue (10 second switch)
- Keep Blue for 2 weeks minimum before deletion

Downtime: ~10-30 seconds (application restart with new connection string)

---

**Pattern 4: Change Data Capture (CDC) for Large Migrations**

Use case: 500GB database migration with <5 minute cutover

Tools:
- Debezium (Kafka-based CDC)
- AWS DMS (managed service)
- pg_logical (PostgreSQL native)

Pattern:
```bash
# 1. Initial snapshot (runs in background, days/weeks)
debezium capture --mode=snapshot --source=prod-db --target=new-db

# 2. Continuous replication (captures ongoing changes)
debezium capture --mode=cdc --source=prod-db --target=new-db

# 3. Monitor lag until <1 second
debezium lag-monitor

# 4. Cutover (short maintenance window)
# - Stop writes to source
# - Wait for lag = 0
# - Switch application to target
# - Resume writes
```

Validation: Run queries on both databases, compare results:
```sql
-- Source DB
SELECT COUNT(*), MAX(created_at) FROM users;

-- Target DB (should match exactly)
SELECT COUNT(*), MAX(created_at) FROM users;
```

---

**Pattern 5: Shadow Testing for Risky Migrations**

Use case: Major schema refactor (e.g., splitting monolithic table)

Pattern:
1. Deploy new schema alongside old schema
2. Write to BOTH schemas (old + new) for 1 week
3. Compare results: `SELECT * FROM old_table EXCEPT SELECT * FROM new_table_view`
4. Switch reads to new schema if validation passes
5. Drop old schema after 2 weeks

Example (splitting `users` table):
```sql
-- Old schema
CREATE TABLE users (id, email, name, address, phone, ...); -- 50 columns

-- New schema (normalized)
CREATE TABLE users (id, email, name);
CREATE TABLE user_profiles (user_id, address, phone, ...);

-- Write to both (application layer)
BEGIN;
  INSERT INTO users (id, email, name) VALUES (...);
  INSERT INTO user_profiles (user_id, address, phone) VALUES (...);
COMMIT;

-- Validation query
SELECT old.id FROM users_old old
LEFT JOIN users new ON old.id = new.id
LEFT JOIN user_profiles prof ON old.id = prof.user_id
WHERE new.id IS NULL OR prof.user_id IS NULL;
-- Should return 0 rows
```

---

**Migration Validation Checklist**

Before deploying ANY schema change to production:

- [ ] Tested on staging with production-size dataset (not empty database)
- [ ] Rollback plan documented with exact commands to revert
- [ ] Monitoring alerts configured (replication lag, error rate, query latency)
- [ ] Lock timeout set to prevent indefinite blocking:
  ```sql
  SET lock_timeout = '5s'; -- Fail fast if lock unavailable
  ALTER TABLE users ADD COLUMN ...;
  ```
- [ ] Index creation uses CONCURRENTLY (PostgreSQL)
- [ ] Large updates batched (1000-10000 rows per transaction)
- [ ] Customer communication sent (if any user-facing impact)

---

### Step 7: Generate Migration Files

Based on tech stack, generate actual migration files.

**Decision Tree - Migration Tool:**

```
From tech stack, determine ORM/migration tool:

1. Language = TypeScript/JavaScript?
   ├─ Framework = Next.js + mentioned Prisma → Use Prisma
   ├─ Framework = NestJS → Use TypeORM
   ├─ Framework = Express → Ask user preference
   └─ Default → Prisma (best DX)

2. Language = Python?
   ├─ Framework = FastAPI → Use Alembic
   ├─ Framework = Django → Use Django migrations
   └─ Default → Alembic

3. Language = Go?
   ├─ Use golang-migrate or Goose
   └─ Default → SQL files

4. Language = Ruby?
   └─ Use Rails migrations
```

**Migration File Examples:**

**Prisma (TypeScript):**

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  clerkId   String   @unique @map("clerk_id")
  email     String   @unique
  teamId    String?  @map("team_id")
  createdAt DateTime @default(now()) @map("created_at")

  team        Team?        @relation(fields: [teamId], references: [id])
  documents   Document[]
  assessments Assessment[]

  @@index([teamId])
  @@map("users")
}

model Document {
  id            String   @id @default(cuid())
  userId        String   @map("user_id")
  fileName      String   @map("file_name")
  fileSizeBytes Int      @map("file_size_bytes")
  status        String   @default("uploading")
  s3Key         String   @unique @map("s3_key")
  createdAt     DateTime @default(now()) @map("created_at")

  user        User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  assessments Assessment[]

  @@index([userId])
  @@index([createdAt(sort: Desc)])
  @@map("documents")
}

model Assessment {
  id          String    @id @default(cuid())
  userId      String    @map("user_id")
  documentId  String    @map("document_id")
  status      String    @default("pending")
  results     Json?
  startedAt   DateTime? @map("started_at")
  completedAt DateTime? @map("completed_at")
  durationMs  Int?      @map("duration_ms")
  createdAt   DateTime  @default(now()) @map("created_at")

  user     User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  document Document @relation(fields: [documentId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([documentId])
  @@index([status])
  @@index([createdAt(sort: Desc)])
  @@map("assessments")
}
```

**Alembic (Python):**

```python
# alembic/versions/001_initial_schema.py
"""Initial schema

Revision ID: 001
Revises:
Create Date: 2025-11-11 12:00:00.000000
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers
revision = '001'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # Create users table
    op.create_table(
        'users',
        sa.Column('id', postgresql.UUID(), server_default=sa.text('gen_random_uuid()'), nullable=False),
        sa.Column('clerk_id', sa.String(), nullable=False),
        sa.Column('email', sa.String(), nullable=False),
        sa.Column('team_id', postgresql.UUID(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('clerk_id'),
        sa.UniqueConstraint('email')
    )
    op.create_index('idx_users_team_id', 'users', ['team_id'])

    # Create documents table
    op.create_table(
        'documents',
        sa.Column('id', postgresql.UUID(), server_default=sa.text('gen_random_uuid()'), nullable=False),
        sa.Column('user_id', postgresql.UUID(), nullable=False),
        sa.Column('file_name', sa.String(), nullable=False),
        sa.Column('file_size_bytes', sa.Integer(), nullable=False),
        sa.Column('status', sa.String(), server_default='uploading', nullable=False),
        sa.Column('s3_key', sa.String(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.CheckConstraint('file_size_bytes > 0', name='check_file_size_positive'),
        sa.CheckConstraint("status IN ('uploading', 'ready', 'error')", name='check_document_status'),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('s3_key')
    )
    op.create_index('idx_documents_user_id', 'documents', ['user_id'])
    op.create_index('idx_documents_created', 'documents', [sa.text('created_at DESC')])

    # Create assessments table
    op.create_table(
        'assessments',
        sa.Column('id', postgresql.UUID(), server_default=sa.text('gen_random_uuid()'), nullable=False),
        sa.Column('user_id', postgresql.UUID(), nullable=False),
        sa.Column('document_id', postgresql.UUID(), nullable=False),
        sa.Column('status', sa.String(), server_default='pending', nullable=False),
        sa.Column('results', postgresql.JSONB(), nullable=True),
        sa.Column('error_message', sa.Text(), nullable=True),
        sa.Column('started_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('completed_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('duration_ms', sa.Integer(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.CheckConstraint("status IN ('pending', 'processing', 'completed', 'failed')", name='check_assessment_status'),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['document_id'], ['documents.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('idx_assessments_user_id', 'assessments', ['user_id'])
    op.create_index('idx_assessments_document_id', 'assessments', ['document_id'])
    op.create_index('idx_assessments_status', 'assessments', ['status'])
    op.create_index('idx_assessments_created', 'assessments', [sa.text('created_at DESC')])


def downgrade():
    op.drop_table('assessments')
    op.drop_table('documents')
    op.drop_table('users')
```

---

### Step 8: Document Design Decisions

Create comprehensive documentation explaining:
- Why each table exists (traces to journey)
- Why this schema structure (alternatives considered)
- Why these data types (trade-offs)
- Why these indexes (query patterns)
- How to extend (adding columns, new tables)

**Template structure:**

```markdown
# Database Schema Design

## Overview
[High-level description, entity count, key relationships]

## Entity Relationship Diagram
[Visual ERD using Mermaid or ASCII art]

## Table Definitions

### [Table Name]

**Purpose**: [Why this table exists - journey connection]

**Columns**:
| Column | Type | Constraints | Purpose |
|--------|------|-------------|---------|
| id | UUID | PRIMARY KEY | Unique identifier |
| ... | ... | ... | ... |

**Indexes**:
- `idx_[name]`: [Why - query pattern served]

**Relationships**:
- Belongs to: [Parent table]
- Has many: [Child tables]

**Design Decisions**:
- [Why UUID vs BIGINT]
- [Why JSONB for results]
- [Why soft delete vs hard delete]

## Migration Files
[Instructions for applying migrations]

## Query Examples

### Critical Path Queries (Journey Steps 1-3)

**Query 1**: [Description from journey]
```sql
[SQL query]
```

**EXPLAIN ANALYZE Notes**:
- Index used: `[index_name]`
- Estimated rows: [number]
- Execution time: [milliseconds]

### N+1 Query Prevention

**The Problem**: ORM fetches related records in loop (1 + N queries instead of 1 query with JOIN)

**Example (BAD - N+1)**:
```typescript
// 1 query to get users
const users = await db.query('SELECT * FROM users LIMIT 100');

// 100 queries to get each user's documents (N+1!)
for (const user of users) {
  user.documents = await db.query('SELECT * FROM documents WHERE user_id = $1', [user.id]);
}
```

**Fixed (GOOD - 1 query with JOIN)**:
```typescript
const usersWithDocs = await db.query(`
  SELECT
    u.*,
    json_agg(d.*) AS documents
  FROM users u
  LEFT JOIN documents d ON u.id = d.user_id
  GROUP BY u.id
  LIMIT 100
`);
```

**Validation**:
- [ ] All list endpoints use JOINs, not loops
- [ ] ORM configured with eager loading for relationships
- [ ] Query count logged in development (warn if >5 queries per request)

## Scaling Considerations

### Tail Latency Optimization (p99)

**The Problem**: Average latency hides slow queries affecting real users

**Metrics to track**:
- **p50** (median): 50% of queries faster than this
- **p95**: 95% of queries faster than this
- **p99**: 99% of queries faster than this ← **Most important for UX**

**Formula**: `Throughput (X) = Concurrency (NC) / Latency (R)`

**Example**:
- p50 latency: 20ms
- p99 latency: 500ms ← 1% of users wait 25x longer!

**Optimization**:
```sql
-- Find slow queries (p99)
SELECT query, mean_exec_time, max_exec_time
FROM pg_stat_statements
ORDER BY max_exec_time DESC
LIMIT 10;
```

**SLO Target**: p99 latency <200ms for critical path queries (journey steps 1-3)

[Partitioning, sharding, read replicas]
```

---

## Generating the Output

Use `/templates/07-database-schema-template.md`.

This template will guide you through creating comprehensive database schema documentation that traces every decision back to the user journey.

---

### Step 9: Validate Schema Design

**Quality Checklist:**

**Journey Alignment:**
- [ ] All entities from journey steps are represented
- [ ] Critical path (Steps 1-3) fully supported by schema
- [ ] No tables that don't serve journey steps

**Completeness:**
- [ ] All backlog features have necessary tables
- [ ] Audit columns (created_at, updated_at) on mutable tables
- [ ] Foreign keys defined with proper CASCADE/RESTRICT
- [ ] Unique constraints on business keys (email, etc.)

**Performance:**
- [ ] Indexes on all foreign keys
- [ ] Indexes on frequently queried columns
- [ ] Indexes on sort columns (created_at, etc.)
- [ ] No over-indexing (updates are slowed)

**Data Integrity:**
- [ ] NOT NULL on required columns
- [ ] CHECK constraints for enum-like fields
- [ ] Foreign keys prevent orphaned records
- [ ] Defaults for status fields

**Tech Stack Alignment:**
- [ ] Migration format matches ORM choice
- [ ] Data types supported by chosen database
- [ ] Naming convention matches tech stack (snake_case for SQL, camelCase for Prisma)

**Scalability:**
- [ ] UUID primary keys (if distributed future)
- [ ] Partitioning strategy for large tables (if needed)
- [ ] No many-to-many without join table
- [ ] Timestamp columns are timezone-aware

---

## Schema Anti-Patterns to Avoid

### Anti-Pattern 1: Missing Foreign Key Indexes

**Problem**: PostgreSQL does NOT automatically index foreign keys (unlike MySQL).

```sql
-- BAD: Foreign key without index = slow JOINs
ALTER TABLE documents ADD COLUMN user_id UUID REFERENCES users(id);

-- GOOD: Always index foreign keys
CREATE INDEX idx_documents_user_id ON documents(user_id);
```

**Impact**: 100-1000x slower JOINs on tables >10K rows.

---

### Anti-Pattern 2: UUID Primary Keys Without Default

**Problem**: Application must generate UUIDs (error-prone, inconsistent).

```sql
-- BAD: No default = application burden
id UUID PRIMARY KEY

-- GOOD: Database generates UUIDs
id UUID PRIMARY KEY DEFAULT gen_random_uuid()
```

---

### Anti-Pattern 3: TIMESTAMP Instead of TIMESTAMPTZ

**Problem**: Timezone bugs when users span multiple regions.

```sql
-- BAD: Stores local time (ambiguous)
created_at TIMESTAMP DEFAULT NOW()

-- GOOD: Stores UTC with timezone
created_at TIMESTAMPTZ DEFAULT NOW()
```

**Real bug**: User in NYC creates record at "2025-03-09 02:30 AM" during DST transition → time doesn't exist!

---

### Anti-Pattern 4: Indexing Low-Cardinality Columns

**Problem**: Indexes on boolean/enum rarely used by query planner.

```sql
-- BAD: Only 2 values (true/false), index rarely helps
CREATE INDEX idx_users_is_active ON users(is_active);

-- GOOD: Use partial index for specific value
CREATE INDEX idx_users_active ON users(id) WHERE is_active = true;
```

---

### Anti-Pattern 5: JSONB Without GIN Index

**Problem**: Full table scans on JSONB containment queries.

```sql
-- BAD: Slow containment queries
CREATE TABLE assessments (results JSONB);
SELECT * FROM assessments WHERE results @> '{"status": "passed"}';

-- GOOD: GIN index for 10-100x speedup
CREATE INDEX idx_assessments_results ON assessments USING GIN (results);
```

---

### Anti-Pattern 6: No CHECK Constraints on Enums

**Problem**: Invalid states slip through, caught only at application layer.

```sql
-- BAD: Any string accepted
status TEXT NOT NULL

-- GOOD: Database enforces valid values
status TEXT NOT NULL CHECK (status IN ('pending', 'processing', 'completed', 'failed'))
```

---

### Anti-Pattern 7: Over-Normalization

**Problem**: Premature optimization leads to complex JOINs for simple queries.

```sql
-- BAD: Separate table for user address (rarely changes, always fetched with user)
CREATE TABLE user_addresses (user_id, street, city, zip);

-- GOOD: Embed address in user table (until proven performance issue)
CREATE TABLE users (id, email, address_street, address_city, address_zip);
```

**When to normalize**: When data changes independently OR grows unbounded (e.g., order_items table for e-commerce).

---

## What We DIDN'T Choose (And Why)

### NoSQL / Document Database (MongoDB)

**What it is**: Schema-less database storing JSON documents, flexible structure

**Why not (for this journey)**:
- Journey has **stable entities** (users, documents, assessments) - structure won't change rapidly
- **Relationships matter** (user → documents → assessments) - relational model is clearer
- **ACID transactions needed** for billing (can't lose usage events)
- **PostgreSQL JSONB** provides flexibility where needed (assessment results) while keeping relational benefits
- **Team expertise** (from tech stack) - team comfortable with SQL

**When to reconsider**:
- IF schema changes weekly (rapid product iteration with unstable entities)
- IF documents have highly variable structure (e.g., each compliance framework = different schema)
- IF horizontal scaling needed immediately (MongoDB shards more easily)
- IF tech stack already heavily invested in Node.js ecosystem

**Example**: A content management system with 100+ content types, each with different fields - MongoDB would shine. Compliance assessments have predictable structure.

---

### GraphQL with Relay-style Global IDs

**What it is**: Using GraphQL global object IDs (`Base64(typename:id)`) instead of database UUIDs

**Why not (for this journey)**:
- **API pattern is REST** (from architecture) - GraphQL adds complexity without clear benefit
- **Global IDs obscure database relationships** - harder to debug, harder to write raw SQL
- **Team expertise** (from tech stack) - team familiar with REST + UUIDs
- **Simpler is better** for MVP - UUIDs work perfectly fine

**When to reconsider**:
- IF switching to GraphQL API (then global IDs are idiomatic)
- IF building public API where obscuring database IDs matters for security
- IF need to refactor without breaking API (global IDs allow moving entities between tables)

**Example**: Public API for partners where you don't want to expose database structure - global IDs prevent leaking implementation details.

---

### Event Sourcing / CQRS

**What it is**: Store all changes as events (AssessmentCreated, AssessmentCompleted), rebuild state from event log

**Why not (for this journey)**:
- **Journey is straightforward CRUD** - assessments have simple lifecycle (created → processing → completed)
- **Complexity is massive** - event store, event handlers, projections, eventual consistency
- **Team size is small** (1-3 engineers) - can't maintain complex architecture
- **No audit requirement** justifies event sourcing complexity (simple audit log suffices)

**When to reconsider**:
- IF regulatory requirement for complete audit trail (every field change)
- IF need to replay history (e.g., "what would assessment look like with old AI model?")
- IF doing complex analytics on state changes over time
- IF team has event sourcing expertise

**Example**: Financial trading system where every state change must be auditable and replayable. Compliance assessments = simpler use case.

---

### Multi-Table Inheritance / Polymorphic Associations

**What it is**: Documents table with type discriminator + separate tables for each type (ComplianceDocument, ContractDocument, etc.)

**Why not (for this journey)**:
- **All documents are similar** - compliance documents have same attributes (file, size, status)
- **No type-specific logic** - assessment process is same regardless of document type
- **Queries become complex** - JOINs across multiple tables, NULL fields everywhere
- **Simpler to add JSONB metadata** column if documents need type-specific fields

**When to reconsider**:
- IF document types have radically different attributes (e.g., video vs PDF vs audio)
- IF type-specific validation logic (each type has different required fields)
- IF querying specific type frequently ("show me only contract documents")

**Example**: Digital asset management system with images (dimensions, color profile), videos (duration, codec), documents (page count) - each type has unique attributes. Compliance docs = uniform structure.

---

### Soft Deletes (deleted_at column)

**What it is**: Instead of `DELETE`, set `deleted_at = NOW()` and filter in queries

**Why not (for this journey)**:
- **GDPR compliance** - users have "right to be forgotten" (must actually delete data)
- **Query complexity** - every query needs `WHERE deleted_at IS NULL`
- **Index bloat** - indexes grow with soft-deleted records
- **Billing accuracy** - don't want to accidentally count deleted records

**When to reconsider**:
- IF undo feature required ("restore deleted document")
- IF legal requirement to retain deleted data for N days
- IF analytics need historical deleted records
- IF using ORM with built-in soft delete support (handles WHERE clause automatically)

**Example**: SaaS with "trash" feature (recover for 30 days) - soft deletes make sense. Compliance platform = hard delete after user requests.

---

## Setup Instructions

After generating schema files:

### For Prisma (TypeScript):

```bash
# 1. Copy schema to your project
cp product-guidelines/07-database-schema/prisma/schema.prisma ./prisma/schema.prisma

# 2. Create initial migration
npx prisma migrate dev --name initial_schema

# 3. Generate Prisma client
npx prisma generate

# 4. (Optional) Open Prisma Studio to view data
npx prisma studio
```

### For Alembic (Python):

```bash
# 1. Copy migration to your project
cp product-guidelines/07-database-schema/alembic/versions/001_initial_schema.py ./alembic/versions/

# 2. Run migration
alembic upgrade head

# 3. (Optional) Generate future migrations
alembic revision --autogenerate -m "description"
```

### For raw SQL:

```bash
# 1. Copy schema file
cp product-guidelines/07-database-schema/schema.sql ./

# 2. Apply to database
psql $DATABASE_URL -f schema.sql

# Or for MySQL:
mysql -u user -p database_name < schema.sql
```

---

## Output Files

This command generates:

**1. Full Documentation** (`product-guidelines/07-database-schema.md`):
- Entity relationship diagram
- Design decisions and rationale
- Table definitions with detailed explanations (columns, types, constraints)
- Index strategies and query optimization
- Query patterns and EXPLAIN ANALYZE examples
- Scaling strategy (partitioning, sharding, replicas)
- Data types rationale
- Testing strategy
- "What We DIDN'T Choose" alternatives (3+ options)

**2. Context Documentation** (`product-guidelines/07-database-schema.ctx.md`):

After writing the full schema, you'll invoke the distillation agent to create a condensed version. See "After Generating Database Schema Document" section below for instructions.

**3. Migration Files** (`product-guidelines/07-database-schema/migrations/`):
- Prisma schema (if TypeScript)
- Alembic migration (if Python)
- Raw SQL (as fallback)
- Seed data (optional)

**4. Type Definitions** (if applicable):
- TypeScript types generated from Prisma
- Python SQLAlchemy models
- Database documentation

---

## Quality Checklist

Before completing this session, verify:

**Journey Alignment:**
- [ ] All entities from user journey are represented in schema
- [ ] Critical path (journey steps 1-3) fully supported
- [ ] No tables exist that don't serve a journey step
- [ ] Data relationships match journey flow

**Completeness:**
- [ ] All backlog features have necessary database support
- [ ] Audit columns (created_at, updated_at) on all tables
- [ ] Foreign keys defined with appropriate CASCADE/RESTRICT
- [ ] Unique constraints on natural keys (email, external IDs)

**Technical Quality:**
- [ ] Primary keys are UUIDs (or appropriate for scale)
- [ ] Indexes on all foreign keys
- [ ] Indexes on frequently filtered/sorted columns
- [ ] CHECK constraints for enum-like fields
- [ ] NOT NULL constraints where appropriate
- [ ] Timestamps are timezone-aware (TIMESTAMPTZ)

**Performance:**
- [ ] Query patterns from backlog have appropriate indexes
- [ ] No over-indexing (every index has clear purpose)
- [ ] Composite indexes ordered correctly (most selective first)
- [ ] Partial indexes for common filtered queries

**Tech Stack Alignment:**
- [ ] Migration format matches ORM choice from tech stack
- [ ] Data types supported by database choice
- [ ] Naming conventions match team standards
- [ ] ORM patterns follow tech stack decisions

**Documentation:**
- [ ] Full schema file (`07-database-schema.md`) complete with all details
- [ ] Context file (`07-database-schema.ctx.md`) generated for backlog use
- [ ] "What We DIDN'T Choose" section complete (3+ alternatives) in full file
- [ ] Each table has purpose explanation
- [ ] Design decisions reference journey
- [ ] Setup instructions clear and tested

---

## After This Session

**Next steps:**
1. **Apply migrations** to your development database
2. **Generate ORM client** (Prisma generate, etc.)
3. **Implement repositories/DAOs** in your application code
4. **Write database tests** (seed data, query tests)
5. **Update API endpoints** to use new schema

**Use this schema for:**
- Feature development (reference table definitions)
- API design (know what data is available)
- Testing (seed realistic data)
- Documentation (understand data model)

**Future extensions:**
- Add tables as backlog evolves
- Optimize indexes based on production query patterns
- Consider read replicas if query load increases
- Plan partitioning strategy for time-series tables

---

## Remember

**Every table must serve the user journey.**

Don't create tables "just in case". Design schema based on:
1. What data do journey steps need? → Entities
2. How do users interact with data? → Relationships
3. How will we query this data? → Indexes
4. What constraints ensure correctness? → NOT NULL, CHECK, FK

If you can't trace a table back to a journey step, you probably don't need it.

**Reference files:**
- Journey: `product-guidelines/00-user-journey.ctx.md`
- Tech stack: `product-guidelines/02-tech-stack.md`
- Architecture: `product-guidelines/04-architecture.ctx.md`
- Backlog: `product-guidelines/10-backlog/BACKLOG.md` (generated AFTER this session in Session 10)

---

**Now, read previous outputs and design a database schema that serves your users' journey!**

## After Generating Database Schema Document

Once you've written `product-guidelines/07-database-schema.md`, invoke the distillation agent to create a context file:

Use the Task tool:
- **subagent_type**: `general-purpose`
- **description**: `Generate database schema context file`
- **prompt**:
  ```
  Invoke the context distillation agent to create token-optimized context file.

  Source file: product-guidelines/07-database-schema.md
  Output file: product-guidelines/07-database-schema.ctx.md

  Follow the distillation agent specification in .claude/agents/distill-context.md to:
  1. Extract ALL table definitions, relationships, and indexes (CRITICAL)
  2. Extract entity relationship diagram and key design decisions
  3. Remove detailed column explanations, migration code, query examples
  4. Preserve section structure from source file
  5. Achieve ~56% token reduction (Session 7 target due to preserving detailed schema structures)
  6. Add source reference header
  7. Write to output file path
  ```

## CRITICAL CHECKPOINT

Session 7 complete! Your database schema is your product's data foundation.

Before proceeding, validate that your schema correctly represents your user journey and will support all planned features efficiently.

**REVIEW CHECKLIST:**
- [ ] All entities from user journey steps are represented in schema
- [ ] Foreign keys are defined with proper CASCADE/RESTRICT and indexed
- [ ] No obvious N+1 query patterns (check for missing indexes on frequently queried columns)
- [ ] Schema supports key metrics tracking (from Session 4)

**What happens next:**
Session 8 will design your API endpoints using this schema. Session 10 will generate backlog stories that implement these tables. Session 12 will scaffold migration files.

**If you found issues:**
Run `/design-database-schema` again to regenerate with fresh analysis (preserves same journey context).

**If everything looks good:**
Type "continue" when ready to proceed to Session 8 (API design).

---

## Output Format

IMPORTANT: Do not use emojis in generated outputs. Use plain text for all communication.
