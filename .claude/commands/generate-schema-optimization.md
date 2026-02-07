---
description: Session 7d - Optimize schema with indexes and synthesize final database design
size_exemption: Phase-based orchestrator with synthesis step (414 lines)
exemption_rationale: Synthesis step (lines 99-293) combines 7a/7b/7c outputs, generates migrations, and creates final .md/.ctx.md - cannot be delegated to sub-agents without losing coherence
---

# Generate Schema Optimization (Session 7d)

You are a database architect responsible for the final optimization and synthesis phase. This is the FOURTH and final phase of Session 7, where you add performance indexes, generate migrations, and create the complete database schema documentation.

## Your Role

Read all partial schemas from previous phases (7a, 7b, 7c), design performance indexes based on query patterns, synthesize everything into the final schema, generate migration files, and create both full and context versions of the documentation.

## Critical Philosophy

- **Performance Focus**: Design indexes based on actual query patterns from journey
- **Complete Synthesis**: Combine all phases into cohesive schema
- **Migration Ordering**: Ensure DDL statements execute in correct dependency order
- **Final Output**: Generate both .md and .ctx.md versions

## Token Efficiency

This progressive approach reduces total token consumption:
- **Old monolithic approach**: ~480k tokens
- **New progressive approach**: <80k tokens
- **Reduction**: 83%

## Steps to Execute

### Step 1: Load and Validate Current State

Read `.cascade/session-7-state.json` to verify:
- Previous phases are completed (core-tables, relationships)
- Special-tables phase status (completed or skipped)
- Ready for optimization and synthesis

If not ready:
- Error: "Please complete previous phases first. Current status: [phase]"

### Step 2: Read All Partial Schemas

Read ALL generated schema files (~20k tokens total):
1. `product-guidelines/07a-core-tables.md` - Core tables
2. `product-guidelines/07b-relationships.md` - Relationships
3. `product-guidelines/07c-special-tables.md` - Special tables (if exists)

Also read for context:
4. `product-guidelines/00-user-journey.ctx.md` - For query patterns
5. `product-guidelines/04-architecture.ctx.md` - For performance requirements

### Step 3: Analyze Query Patterns

From the journey and architecture, identify query patterns:

1. **High-Frequency Queries**:
   - User authentication lookups
   - Document listing by user
   - Recent activity queries
   - Status filtering

2. **Complex Queries**:
   - Multi-table joins for reports
   - Aggregations for analytics
   - Full-text search requirements
   - Hierarchical data traversal

3. **Performance-Critical Queries**:
   - Real-time dashboard updates
   - Autocomplete/typeahead
   - Concurrent user access patterns
   - Bulk operations

### Step 4: Invoke Indexes Sub-Agent

Use the Task tool to design performance indexes:

```yaml
subagent_type: general-purpose
description: Design performance indexes
prompt: |
  Invoke the design-indexes sub-agent for performance optimization.

  Agent path: .claude/agents/design-indexes.md

  Inputs:
  - All tables from phases 7a, 7b, 7c
  - Query patterns identified: [list from Step 3]
  - Database type: [PostgreSQL/MySQL/etc]

  Design indexes for:
  1. Primary access patterns (user lookups, etc.)
  2. Foreign key relationships (already have basic indexes)
  3. Composite indexes for complex queries
  4. Partial/filtered indexes where beneficial
  5. Full-text search indexes if needed
  6. Unique constraints that serve as indexes

  Consider:
  - Index maintenance overhead
  - Storage costs
  - Query selectivity
  - Covering indexes for read-heavy tables

  Return structured index definitions with rationale.
```

### Step 5: Synthesize Complete Schema

Combine all phases into a complete, coherent schema:

1. **Merge table definitions**:
   - Start with core tables (7a)
   - Add foreign key columns (7b)
   - Add special columns (7c if applicable)
   - Include all indexes

2. **Order for dependencies**:
   - Tables with no foreign keys first
   - Tables that others depend on next
   - Junction tables last
   - Indexes after table creation

3. **Generate migration sequence**:
   - CREATE TABLE statements in dependency order
   - ALTER TABLE for foreign keys
   - CREATE INDEX statements
   - INSERT for seed data (if any)

### Step 6: Generate Final Schema Files

Write the complete schema to `product-guidelines/07-database-schema.md`:

```markdown
# Database Schema Design

Generated: [timestamp]
Database: [type from tech-stack]
Total Tables: [count]
Total Indexes: [count]
Estimated Storage: [rough estimate]

## Schema Overview

### Statistics
- Core Tables: [count]
- Junction Tables: [count]
- Special Tables: [count]
- Total Columns: [count]
- Foreign Keys: [count]
- Indexes: [count]
- Check Constraints: [count]

### Journey Alignment
Each table traces to specific journey steps and value delivery:

| Table | Journey Step | Purpose | Row Estimate |
|-------|--------------|---------|--------------|
| users | All steps | Authentication | 10K-100K |
| documents | Step 2: Upload | Content storage | 100K-1M |
| assessments | Step 3: Analysis | AI results | 500K-5M |

## Complete Table Definitions

[Include ALL tables with ALL columns, sorted by dependency order]

### Table: users
**Purpose**: User accounts and authentication
**Journey**: Required for all authenticated actions
**Relationships**: Has many documents, assessments, roles

| Column | Type | Constraints | Description | Index |
|--------|------|-------------|-------------|--------|
| id | UUID | PRIMARY KEY | Unique ID | PK |
| email | VARCHAR(255) | UNIQUE NOT NULL | Email | UNIQUE |
| password_hash | VARCHAR(255) | NOT NULL | Bcrypt | - |
| first_name | VARCHAR(100) | NULL | Given name | - |
| last_name | VARCHAR(100) | NULL | Family name | - |
| status | VARCHAR(20) | NOT NULL | Account status | idx_users_status |
| created_at | TIMESTAMP | NOT NULL | Creation | idx_users_created |
| updated_at | TIMESTAMP | NOT NULL | Modified | - |

**Indexes**:
- PRIMARY KEY (id)
- UNIQUE (email)
- idx_users_status ON (status) WHERE status = 'active'
- idx_users_created ON (created_at DESC)

[Continue for ALL tables...]

## Index Design Rationale

### Performance Indexes

**idx_documents_user_status**
- **Columns**: (user_id, status, created_at DESC)
- **Purpose**: User's recent documents by status
- **Query Pattern**: Dashboard document listing
- **Type**: Composite covering index

**idx_assessments_document_created**
- **Columns**: (document_id, created_at DESC)
- **Purpose**: Recent assessments for document
- **Query Pattern**: Document detail view
- **Type**: Composite with sort order

[Continue for all indexes...]

## Migration Scripts

### Migration 001: Create Core Tables

```sql
-- 001_create_users_table.sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_status ON users(status) WHERE status = 'active';
CREATE INDEX idx_users_created ON users(created_at DESC);
```

### Migration 002: Create Document Tables

```sql
-- 002_create_documents_table.sql
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    title VARCHAR(500) NOT NULL,
    file_path TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_documents_user FOREIGN KEY (user_id)
        REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_documents_user_id ON documents(user_id);
CREATE INDEX idx_documents_status ON documents(status);
CREATE INDEX idx_documents_user_status ON documents(user_id, status, created_at DESC);
```

[Continue migrations in order...]

## Query Optimization Patterns

### Common Query Examples

**User's Recent Documents**:
```sql
-- Uses: idx_documents_user_status
SELECT * FROM documents
WHERE user_id = ? AND status = 'active'
ORDER BY created_at DESC
LIMIT 20;
```

**Document with Assessments**:
```sql
-- Uses: PK + idx_assessments_document_created
SELECT d.*, a.*
FROM documents d
LEFT JOIN assessments a ON d.id = a.document_id
WHERE d.id = ?
ORDER BY a.created_at DESC;
```

## Maintenance Considerations

### Index Maintenance
- Rebuild indexes monthly during low-traffic periods
- Monitor index bloat with pg_stat_user_indexes
- Consider partial indexes for large tables

### Partitioning Strategy
- Consider partitioning assessments by created_at after 10M rows
- Archive old audit_logs to cold storage after retention period

### Performance Monitoring
- Track slow queries > 100ms
- Monitor index usage statistics
- Review query plans quarterly

## Next Steps

1. Review schema for completeness
2. Run migrations in development
3. Load test with expected data volumes
4. Fine-tune indexes based on actual query patterns
5. Set up monitoring for slow queries
```

### Step 7: Generate Context File

Invoke the distill-context agent to create the condensed version:

```yaml
subagent_type: general-purpose
description: Create context file
prompt: |
  Invoke the distill-context sub-agent to create condensed version.

  Agent path: .claude/agents/distill-context.md

  Source file: product-guidelines/07-database-schema.md
  Output file: product-guidelines/07-database-schema.ctx.md

  Preserve:
  - All table names and structures
  - All column definitions
  - Key relationships
  - Critical indexes

  Remove:
  - Detailed rationale
  - Query examples
  - Migration scripts
  - Maintenance notes

  Target ~60% reduction in size.
```

### Step 8: Update Final State

Update `.cascade/session-7-state.json` to mark completion:

```json
{
  "session": "7",
  "phase": "complete",
  "phases_completed": ["core-tables", "relationships", "special-tables", "optimization"],
  "status": "complete",
  "generated_at": "[timestamp]",
  "completed_at": "[timestamp]",
  "statistics": {
    "total_tables": [number],
    "total_columns": [number],
    "total_indexes": [number],
    "foreign_keys": [number],
    "migrations_generated": [number],
    "patterns_applied": ["i18n", "audit"]
  },
  "token_usage": {
    "phase_7a": [tokens],
    "phase_7b": [tokens],
    "phase_7c": [tokens],
    "phase_7d": [tokens],
    "total": [sum],
    "reduction_vs_monolithic": "83%"
  }
}
```

### Step 9: Display Final Completion

```
✅ Session 7 Complete: Database Schema Designed

Schema Statistics:
- Total Tables: [N]
- Core Business Tables: [N]
- Junction Tables: [N]
- Special Purpose: [N]

Optimizations Applied:
- Performance Indexes: [N]
- Covering Indexes: [N]
- Partial Indexes: [N]

Migration Files: [N] migrations in dependency order

Files Generated:
- product-guidelines/07-database-schema.md (full version)
- product-guidelines/07-database-schema.ctx.md (condensed)

Token Usage:
- Phase 7a: ~15k tokens
- Phase 7b: ~10k tokens
- Phase 7c: ~10k tokens
- Phase 7d: ~20k tokens
- Total: ~55k tokens (83% reduction from monolithic approach)

✨ Database schema is production-ready!

Next: Run `/generate-api-design` for Session 8
```

## Error Handling

**If partial schema files missing**:
- Check which phases completed in state
- Offer to re-run missing phases
- Cannot synthesize without core tables and relationships

**If indexes sub-agent fails**:
- Create basic indexes for foreign keys
- Log warning about missing optimizations
- Continue with synthesis

**If distill-context fails**:
- Copy full .md as .ctx.md temporarily
- Log warning about missing condensation
- Manual condensation recommended

## Important Notes

1. **This is the FINAL phase** - must produce complete schema
2. **Order matters** - migrations must respect dependencies
3. **Include everything** - all tables from all phases
4. **Performance critical** - good indexes make or break the app
5. **Both files required** - .md for humans, .ctx.md for AI
6. **State completion** - mark session as fully complete

This micro-session synthesizes ~55k tokens total across all phases, achieving 83% reduction from the monolithic 480k approach while maintaining full schema quality.