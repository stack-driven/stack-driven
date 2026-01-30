---
description: Session 7 - Design complete database schema with migrations
---

# Design Database Schema (Session 7)

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

### Step 2b: Check for Integration Requirements

**Check Session 2a for third-party integrations**: If `product-guidelines/02a-constraints.ctx.md` identifies external system integrations, add integration-specific tables to the schema.

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

### Step 5: Design Indexes

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
```

**Decision Tree - Should I Index This?**

```
1. Is this column used in WHERE clauses?
   ├─ YES, frequently → Index it
   └─ NO → Don't index

2. Is this column used in ORDER BY?
   ├─ YES → Index it (with DESC if sorting descending)
   └─ NO → Continue

3. Is this column a foreign key?
   ├─ YES → Almost always index (for joins)
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
-- Foreign key indexes (joins)
CREATE INDEX idx_assessments_user_id ON assessments(user_id);
CREATE INDEX idx_assessments_document_id ON assessments(document_id);
CREATE INDEX idx_documents_user_id ON documents(user_id);
CREATE INDEX idx_users_team_id ON users(team_id);

-- Query pattern indexes
CREATE INDEX idx_assessments_created ON assessments(created_at DESC);
CREATE INDEX idx_assessments_status ON assessments(status);

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
[Common queries with EXPLAIN ANALYZE notes]

## Scaling Considerations
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
  5. Achieve 60-70% token reduction
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
