---
description: Session 7c - Generate special-purpose tables conditionally (i18n, integrations, multi-tenancy, audit)
---

# Generate Special Tables (Session 7c)

You are a database architect responsible for conditionally adding special-purpose tables based on requirements. This is the THIRD phase of Session 7, where you add i18n, integration, multi-tenancy, or audit tables ONLY if needed.

## Your Role

Check requirements from constraints and architecture files to determine which special patterns are needed, then invoke only the relevant sub-agents. This phase may be skipped entirely if no special requirements exist.

## Critical Philosophy

- **Conditional Execution**: Only add tables that are actually required
- **Minimal Context**: Read only constraints/architecture files (~10k tokens)
- **Pattern-Specific**: Each pattern (i18n, integration, etc.) is independent
- **Skip if Unnecessary**: If no patterns needed, skip to next phase

## Steps to Execute

### Step 1: Load and Validate Current State

Read `.cascade/session-7-state.json` to verify:
- Phase "relationships" is completed
- Ready for special tables phase

If relationships not completed:
- Error: "Please complete /generate-relationships first"

### Step 2: Check Requirements

Read ONLY what's needed to determine requirements (~10k tokens):

**For i18n check**:
- Read `product-guidelines/02a-constraints.ctx.md` (if exists)
- Look for "Internationalization requirements" marked as required
- If found: `i18n_required = true`

**For integrations check**:
- Read `product-guidelines/02a-constraints.ctx.md` (if exists)
- Look for third-party integrations list
- If non-empty: `integrations_exist = true`

**For multi-tenancy check**:
- Read `product-guidelines/04-architecture.ctx.md` (if exists)
- Look for "multi-tenant", "workspace", or "team isolation"
- If found: `multi_tenant = true`

**For compliance/audit check**:
- Read `product-guidelines/02a-constraints.ctx.md` (if exists)
- Look for HIPAA, SOC2, GDPR, ISO 27001, or "audit trail"
- If found: `compliance_required = true`

### Step 3: Determine If Phase Needed

If ALL checks are false:
```python
if not (i18n_required or integrations_exist or multi_tenant or compliance_required):
    # Skip this entire phase
    # Update state to mark as skipped
    # Proceed directly to message in Step 7
```

If ANY check is true, continue to Step 4.

### Step 4: Conditionally Invoke Sub-Agents

For each true requirement, invoke the corresponding sub-agent:

**If i18n_required:**
```yaml
subagent_type: general-purpose
description: Design i18n tables
prompt: |
  Invoke the design-i18n-tables sub-agent for translation infrastructure.

  Agent path: .claude/agents/design-i18n-tables.md

  Inputs:
  - Core tables from 07a-core-tables.md
  - Supported locales from constraints
  - Translation strategy (database vs. file-based)

  Design:
  - translations table for UI strings
  - content_translations for user content
  - user_locales for preferences
  - Locale columns where needed

  Return structured table definitions.
```

**If integrations_exist:**
```yaml
subagent_type: general-purpose
description: Design integration tables
prompt: |
  Invoke the design-integration-tables sub-agent for third-party integrations.

  Agent path: .claude/agents/design-integration-tables.md

  Inputs:
  - Integration list from constraints: [list]
  - Core tables that need integration

  Design:
  - integration_credentials table
  - webhook_events table
  - sync_jobs table
  - integration_logs table

  Return structured table definitions.
```

**If multi_tenant:**
```yaml
subagent_type: general-purpose
description: Design multi-tenancy tables
prompt: |
  Invoke the design-multi-tenancy sub-agent for tenant isolation.

  Agent path: .claude/agents/design-multi-tenancy.md

  Inputs:
  - Architecture pattern from 04-architecture.ctx.md
  - Isolation level required

  Design:
  - tenants/organizations table
  - tenant_members table
  - tenant_settings table
  - Add tenant_id to relevant tables

  Return structured table definitions.
```

**If compliance_required:**
```yaml
subagent_type: general-purpose
description: Design audit tables
prompt: |
  Invoke the design-audit-logging sub-agent for compliance tracking.

  Agent path: .claude/agents/design-audit-logging.md

  Inputs:
  - Compliance requirements from constraints
  - Entities that need auditing

  Design:
  - audit_logs table
  - data_retention_policies table
  - user_consents table (if GDPR)
  - access_logs table (if HIPAA)

  Return structured table definitions.
```

### Step 5: Generate and Write Special Tables File

If ANY patterns were applied, write to `product-guidelines/07c-special-tables.md`:

```markdown
# Database Schema - Special-Purpose Tables

Generated: [timestamp]
Patterns Applied: [list of patterns used]
Tables Added: [count]

## Requirements Analysis

| Requirement | Source | Applied | Tables Added |
|-------------|--------|---------|--------------|
| Internationalization | constraints.md | [Yes/No] | [count] |
| Third-Party Integrations | constraints.md | [Yes/No] | [count] |
| Multi-Tenancy | architecture.md | [Yes/No] | [count] |
| Compliance/Audit | constraints.md | [Yes/No] | [count] |

[For each pattern that was applied, include its section below]

## Internationalization Tables
[Only if i18n_required]

### Table: translations
**Purpose**: Store UI string translations

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| key | VARCHAR(255) | NOT NULL, UNIQUE | Translation key |
| locale | VARCHAR(10) | NOT NULL | Locale code (en-US) |
| value | TEXT | NOT NULL | Translated text |
| namespace | VARCHAR(100) | NULL | Optional grouping |
| created_at | TIMESTAMP | NOT NULL | Creation time |
| updated_at | TIMESTAMP | NOT NULL | Last update |

**Indexes**:
- idx_translations_key_locale ON (key, locale) UNIQUE
- idx_translations_namespace ON (namespace)

### Table: content_translations
**Purpose**: Store translations for user-generated content

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| entity_type | VARCHAR(50) | NOT NULL | Table name |
| entity_id | UUID | NOT NULL | Record ID |
| field | VARCHAR(50) | NOT NULL | Field name |
| locale | VARCHAR(10) | NOT NULL | Locale code |
| value | TEXT | NOT NULL | Translated content |

**Indexes**:
- idx_content_trans_entity ON (entity_type, entity_id, field, locale) UNIQUE

## Integration Tables
[Only if integrations_exist]

### Table: integration_credentials
**Purpose**: Store encrypted credentials for third-party services

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| service | VARCHAR(50) | NOT NULL | Service name |
| tenant_id | UUID | NULL | If multi-tenant |
| credentials | JSONB | NOT NULL | Encrypted creds |
| status | VARCHAR(20) | NOT NULL | active/inactive |
| last_sync | TIMESTAMP | NULL | Last successful sync |

### Table: webhook_events
**Purpose**: Track incoming webhook events

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Event ID |
| service | VARCHAR(50) | NOT NULL | Source service |
| event_type | VARCHAR(100) | NOT NULL | Event name |
| payload | JSONB | NOT NULL | Event data |
| status | VARCHAR(20) | NOT NULL | Processing status |
| attempts | INTEGER | DEFAULT 0 | Retry count |
| received_at | TIMESTAMP | NOT NULL | Receipt time |

## Multi-Tenancy Tables
[Only if multi_tenant]

### Table: tenants
**Purpose**: Define tenant organizations

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Tenant ID |
| name | VARCHAR(255) | NOT NULL | Organization name |
| slug | VARCHAR(100) | UNIQUE, NOT NULL | URL slug |
| plan | VARCHAR(50) | NOT NULL | Subscription plan |
| settings | JSONB | NOT NULL | Tenant settings |
| created_at | TIMESTAMP | NOT NULL | Creation time |

### Modifications to Core Tables
Add `tenant_id UUID NOT NULL` to:
- users (with index)
- documents (with index)
- All other tenant-scoped tables

## Audit/Compliance Tables
[Only if compliance_required]

### Table: audit_logs
**Purpose**: Track all data changes for compliance

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | BIGSERIAL | PRIMARY KEY | Sequential ID |
| entity_type | VARCHAR(50) | NOT NULL | Table name |
| entity_id | UUID | NOT NULL | Record ID |
| action | VARCHAR(20) | NOT NULL | CREATE/UPDATE/DELETE |
| user_id | UUID | NOT NULL | Who made change |
| changes | JSONB | NOT NULL | Before/after values |
| ip_address | INET | NOT NULL | Client IP |
| user_agent | TEXT | NULL | Browser info |
| created_at | TIMESTAMP | NOT NULL | Event time |

**Indexes**:
- idx_audit_entity ON (entity_type, entity_id)
- idx_audit_user ON (user_id)
- idx_audit_created ON (created_at) -- for retention

### Table: data_retention_policies
**Purpose**: Define retention rules per entity type

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| entity_type | VARCHAR(50) | PRIMARY KEY | Table name |
| retention_days | INTEGER | NOT NULL | Days to retain |
| deletion_strategy | VARCHAR(20) | NOT NULL | soft/hard delete |
| last_cleanup | TIMESTAMP | NULL | Last cleanup run |

## Summary Statistics

- Pattern tables added: [count by pattern]
- Total new tables: [count]
- Tables modified with tenant_id: [count if multi-tenant]
- Indexes added: [count]
- Storage overhead estimate: [rough estimate]
```

### Step 6: Update State Tracking

Update `.cascade/session-7-state.json`:

```json
{
  "session": "7",
  "phase": "special-tables",
  "phases_completed": ["core-tables", "relationships", "special-tables"],
  "status": "in-progress",
  "generated_at": "[timestamp]",
  "statistics": {
    "core_tables_count": [from previous],
    "relationships_count": [from previous],
    "special_tables_count": [number],
    "patterns_applied": ["i18n", "audit"],
    "next_phase": "optimization"
  },
  "special_patterns": {
    "i18n": true,
    "integrations": false,
    "multi_tenant": false,
    "audit": true
  }
}
```

### Step 7: Display Completion and Next Steps

If patterns were applied:
```
✅ Session 7c Complete: Special Tables Added

Applied patterns:
- ✓ Internationalization: [N] tables
- ✓ Audit/Compliance: [N] tables
- ✗ Multi-tenancy: Not required
- ✗ Integrations: Not required

Files created:
- product-guidelines/07c-special-tables.md

Next phase: Performance optimization and synthesis
Type "continue" to run Session 7d (generate-schema-optimization)
```

If NO patterns needed (all false):
```
✅ Session 7c: No Special Tables Needed

Analysis complete:
- Internationalization: Not required
- Integrations: Not required
- Multi-tenancy: Not required
- Compliance/Audit: Not required

Skipping to optimization phase...
Type "continue" to run Session 7d (generate-schema-optimization)
```

## Error Handling

**If constraint files don't exist**:
- Assume all patterns are false
- Log: "No constraints file found, assuming no special requirements"
- Skip to next phase

**If architecture file missing**:
- Check for multi-tenancy in tech-stack instead
- Default to single-tenant if not found

**If sub-agent fails**:
- Log which pattern failed
- Continue with other patterns
- Mark failed pattern in state

## Important Notes

1. **This phase is OPTIONAL** - skip entirely if no requirements
2. **Be conservative** - only add tables that are clearly required
3. **Don't duplicate** - if audit exists in core tables, don't recreate
4. **Check carefully** - requirements may be implicit in journey
5. **Update state** even if phase is skipped
6. **Preserve tokens** - read minimal files for requirement checking

This micro-session should use <20% of context capacity when patterns are needed, or <5% when skipped.