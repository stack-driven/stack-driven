---
description: Session 7 - Design complete database schema with migrations
---

# Design Database Schema (Session 7) - Orchestrator

You are helping the user create a comprehensive database schema design based on their chosen database paradigm. This orchestrator conditionally invokes specialized sub-agents to design tables, relationships, indexes, and optional patterns (i18n, integrations, multi-tenancy, audit logging).

## When to Use This

**This is Session 7** in the core Stack-Driven cascade. Run it:
- After Session 6 (`/create-design` - design system)
- Before Session 10 (`/generate-backlog` - implementation planning)
- When you need to define your data model based on journey and architecture

**Skip this** if:
- You're using a no-code/low-code platform
- Your product doesn't require a database
- You prefer to evolve schema incrementally during development

## Process

### Step 1: Read Previous Outputs

**Required inputs:**

```
Read: product-guidelines/00-user-journey.ctx.md
Read: product-guidelines/01-product-strategy.ctx.md
Read: product-guidelines/02-tech-stack.ctx.md
Read: product-guidelines/02a-constraints.ctx.md (if exists)
Read: product-guidelines/02b-coding-standards.ctx.md (if exists)
Read: product-guidelines/02c-ai-integration-strategy.ctx.md (if exists)
Read: product-guidelines/04-architecture.ctx.md
Read: product-guidelines/05-brand-strategy.ctx.md
```

**Extract key information:**
- **From Journey**: What entities exist? What data persists? What relationships?
- **From Tech Stack**: Database choice (PostgreSQL, MongoDB, MySQL), ORM/migration tool
- **From Architecture**: Multi-tenancy pattern, data access patterns, performance requirements
- **From Constraints**: i18n requirements, third-party integrations, compliance requirements

### Step 2: Analyze Requirements for Conditional Patterns

**Check for i18n requirement:**
- Read `product-guidelines/02a-constraints.ctx.md` (if exists)
- Look for "Internationalization requirements (i18n, l10n)" marked as required
- If found: Set `i18n_required = TRUE`
- If not found: Set `i18n_required = FALSE`

**Check for third-party integrations:**
- Read `product-guidelines/02a-constraints.ctx.md` (if exists)
- Look for list of third-party integrations (Stripe, SendGrid, Salesforce, etc.)
- If list is non-empty: Set `integrations_exist = TRUE`
- If list is empty: Set `integrations_exist = FALSE`

**Check for multi-tenancy:**
- Read `product-guidelines/04-architecture.ctx.md`
- Look for "Multi-tenancy" or "team-based isolation" or "workspace isolation"
- If found: Set `multi_tenant = TRUE`
- If not found: Set `multi_tenant = FALSE`

**Check for compliance requirements:**
- Read `product-guidelines/02a-constraints.ctx.md` (if exists)
- Look for regulatory compliance (HIPAA, SOC2, GDPR, ISO 27001) OR PII handling
- If found: Set `compliance_required = TRUE`
- If not found: Set `compliance_required = FALSE`

### Step 3: Invoke Core Sub-Agents (ALWAYS)

**3.1: Design Core Tables** (ALWAYS invoked)

Use the Task tool:
- **subagent_type**: `general-purpose`
- **description**: `Design core database tables`
- **prompt**:
  ```
  Invoke the design-core-tables sub-agent to identify core entities and design table definitions.

  Agent path: .claude/agents/design-core-tables.md

  Inputs:
  - User journey steps: [Paste journey from 00-user-journey.ctx.md]
  - Database paradigm: [Database choice from 02-tech-stack.ctx.md]
  - ORM/migration tool: [Tool from 02-tech-stack.ctx.md]
  - Architecture decisions: [Paste from 04-architecture.ctx.md]

  Follow the agent specification to:
  1. Identify core entities from journey steps
  2. Map entities to tables
  3. Define columns with types and constraints
  4. Choose primary key type (UUID vs BIGINT)
  5. Add foreign keys with CASCADE/RESTRICT behavior
  6. Trace each table back to journey step

  Return structured output with:
  - Core tables identified (count)
  - Entity-to-table mapping
  - Table definitions with full schema
  - Journey traceability
  - Design decisions rationale
  ```

**3.2: Design Relationships** (ALWAYS invoked)

Use the Task tool:
- **subagent_type**: `general-purpose`
- **description**: `Design entity relationships`
- **prompt**:
  ```
  Invoke the design-relationships sub-agent to define relationships, foreign keys, and join tables.

  Agent path: .claude/agents/design-relationships.md

  Inputs:
  - Core entity list: [From design-core-tables agent]
  - Table definitions: [From design-core-tables agent]
  - Journey steps: [From 00-user-journey.ctx.md]
  - Database paradigm: [From 02-tech-stack.ctx.md]

  Follow the agent specification to:
  1. Identify one-to-many relationships
  2. Identify many-to-many relationships (create join tables)
  3. Choose ON DELETE behavior (CASCADE/RESTRICT/SET NULL)
  4. Draw entity relationship diagram
  5. Trace relationships back to journey

  Return structured output with:
  - Total relationships (one-to-many, many-to-many)
  - Entity relationship diagram (ASCII or Mermaid)
  - Foreign key definitions with reasoning
  - Join table definitions
  ```

**3.3: Design Indexes** (ALWAYS invoked)

Use the Task tool:
- **subagent_type**: `general-purpose`
- **description**: `Design database indexes`
- **prompt**:
  ```
  Invoke the design-indexes sub-agent to design indexes based on query patterns.

  Agent path: .claude/agents/design-indexes.md

  Inputs:
  - Table definitions: [From design-core-tables agent]
  - Relationships: [From design-relationships agent]
  - Journey steps: [From 00-user-journey.ctx.md]
  - Database choice: [From 02-tech-stack.ctx.md]

  Follow the agent specification to:
  1. Analyze query patterns from journey steps
  2. Choose index types (B-tree, GIN, BRIN, GiST for PostgreSQL)
  3. Design composite indexes (column order matters)
  4. Design partial indexes (filtered queries)
  5. Document index rationale (query pattern, frequency)

  Return structured output with:
  - Index strategy summary (total indexes, types)
  - Index definitions per table
  - Specialized indexes (GIN for JSONB, BRIN for time-series)
  - Query performance validation
  ```

### Step 4: Invoke Conditional Sub-Agents

**4.1: Design i18n Tables** (CONDITIONAL)

**Condition**: `i18n_required == TRUE` (from Step 2)

**IF** i18n required:

Use the Task tool:
- **subagent_type**: `general-purpose`
- **description**: `Design i18n translation tables`
- **prompt**:
  ```
  Invoke the design-i18n-tables sub-agent to design translation patterns.

  Agent path: .claude/agents/design-i18n-tables.md

  Inputs:
  - Core entity list: [From design-core-tables agent]
  - Supported locales: [From 02a-constraints.ctx.md]
  - Database paradigm: [From 02-tech-stack.ctx.md]

  Follow the agent specification to:
  1. Identify translatable content (user-facing, varies by language)
  2. Design translation tables ([entity]_translations)
  3. Design locale fallback strategy
  4. Add user locale preference column
  5. Document query patterns with fallback

  Return structured output with:
  - Supported locales list
  - Translation table definitions
  - Locale fallback hierarchy
  - User locale preference design
  ```

**ELSE**: Skip this sub-agent.

**4.2: Design Integration Tables** (CONDITIONAL)

**Condition**: `integrations_exist == TRUE` (from Step 2)

**IF** integrations exist:

Use the Task tool:
- **subagent_type**: `general-purpose`
- **description**: `Design integration tables`
- **prompt**:
  ```
  Invoke the design-integration-tables sub-agent to design integration schema.

  Agent path: .claude/agents/design-integration-tables.md

  Inputs:
  - Integration list: [From 02a-constraints.ctx.md]
  - Multi-tenant: [From Step 2 analysis]
  - Database paradigm: [From 02-tech-stack.ctx.md]

  Follow the agent specification to:
  1. Create integration_credentials table (API keys, OAuth tokens)
  2. Create webhook_events table (if webhooks received)
  3. Create sync_jobs table (if bidirectional sync)
  4. Create external_resource_mappings table (if ID mapping needed)
  5. Document encryption strategy (KMS, key rotation)

  Return structured output with:
  - Integrations identified (from Session 2a)
  - Tables needed (credentials, webhooks, sync, mappings)
  - Encryption strategy documentation
  - Idempotency patterns (webhook_events)
  ```

**ELSE**: Skip this sub-agent.

**4.3: Design Multi-Tenancy** (CONDITIONAL)

**Condition**: `multi_tenant == TRUE` (from Step 2)

**IF** multi-tenant:

Use the Task tool:
- **subagent_type**: `general-purpose`
- **description**: `Design multi-tenancy RLS`
- **prompt**:
  ```
  Invoke the design-multi-tenancy sub-agent to implement Row-Level Security.

  Agent path: .claude/agents/design-multi-tenancy.md

  Inputs:
  - Table definitions: [From design-core-tables agent]
  - Tenant identifier: [From 04-architecture.ctx.md - team_id, workspace_id, org_id]
  - Database choice: [From 02-tech-stack.ctx.md]

  Follow the agent specification to:
  1. Identify tenant-scoped tables
  2. Enable Row-Level Security (ALTER TABLE ... ENABLE ROW LEVEL SECURITY)
  3. Create isolation policies (using session variable app.tenant_id)
  4. Force RLS for all roles (FORCE ROW LEVEL SECURITY)
  5. Document application integration (middleware)
  6. Provide security validation tests

  Return structured output with:
  - Tenant-scoped tables list
  - RLS policies (SQL statements)
  - Application integration example
  - Security validation tests
  ```

**ELSE**: Skip this sub-agent.

**4.4: Design Audit Logging** (CONDITIONAL)

**Condition**: `compliance_required == TRUE` (from Step 2)

**IF** compliance required:

Use the Task tool:
- **subagent_type**: `general-purpose`
- **description**: `Design audit logging`
- **prompt**:
  ```
  Invoke the design-audit-logging sub-agent to implement audit trail.

  Agent path: .claude/agents/design-audit-logging.md

  Inputs:
  - Table definitions: [From design-core-tables agent]
  - Compliance requirements: [From 02a-constraints.ctx.md]
  - Database choice: [From 02-tech-stack.ctx.md]

  Follow the agent specification to:
  1. Identify sensitive tables (PII, financial data)
  2. Create audit_log table
  3. Create audit trigger function (captures INSERT/UPDATE/DELETE)
  4. Attach triggers to sensitive tables
  5. Design temporal tables (if high compliance)
  6. Document retention policy (7 years for financial, etc.)

  Return structured output with:
  - Sensitive tables identified
  - Audit log table definition
  - Trigger function (PL/pgSQL)
  - Triggers applied to tables
  - Retention policy documentation
  ```

**ELSE**: Skip this sub-agent.

### Step 5: Synthesize Sub-Agent Outputs

**Combine outputs into unified schema document:**

1. **Read template**: `templates/07-database-schema-template.md`
2. **Synthesize sections**:
   - Overview (from all sub-agents)
   - Entity Relationship Diagram (from design-relationships)
   - Table Definitions (from design-core-tables)
   - Relationships (from design-relationships)
   - Indexes Strategy (from design-indexes)
   - i18n Translation Patterns (IF i18n_required from design-i18n-tables)
   - Integration Schema (IF integrations_exist from design-integration-tables)
   - Multi-Tenancy & RLS (IF multi_tenant from design-multi-tenancy)
   - Audit Logging (IF compliance_required from design-audit-logging)
   - Data Constraints (from design-core-tables)
   - Migration Files (generated from tech stack)
   - Query Examples (from design-indexes)
   - Schema Anti-Patterns to Avoid (compile from all agents)
   - What We DIDN'T Choose (3+ alternatives with reasoning)

3. **Write full schema**: `product-guidelines/07-database-schema.md`

### Step 6: Generate Context File

After writing the full schema, invoke the distillation agent to create token-optimized context file.

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

### Step 7: Checkpoint (User Validation)

Display checkpoint message:

```
Session 7 complete! Your database schema is your product's data foundation.

Before proceeding, validate that your schema correctly represents your user journey and will support all planned features efficiently.

REVIEW CHECKLIST:
- [ ] All entities from user journey steps are represented in schema
- [ ] Foreign keys are defined with proper CASCADE/RESTRICT and indexed
- [ ] No obvious N+1 query patterns (check for missing indexes on frequently queried columns)
- [ ] Schema supports key metrics tracking (from Session 4)

What happens next:
Session 8 will design your API endpoints using this schema. Session 10 will generate backlog stories that implement these tables. Session 12 will scaffold migration files.

If you found issues:
Run `/design-database-schema` again to regenerate with fresh analysis (preserves same journey context).

If everything looks good:
Type "continue" when ready to proceed to Session 8 (API design).
```

## Output Files

This command generates:

1. **Full Documentation** (`product-guidelines/07-database-schema.md`): Complete schema with ERD, tables, indexes, migrations, query examples
2. **Context Documentation** (`product-guidelines/07-database-schema.ctx.md`): Condensed version for Sessions 8b, 9b, 10, 12 (56% token reduction)

## Conditional Logic Summary

**ALWAYS invoked:**
- design-core-tables.md
- design-relationships.md
- design-indexes.md

**CONDITIONALLY invoked:**
- design-i18n-tables.md (IF i18n required in Session 2a)
- design-integration-tables.md (IF third-party integrations exist in Session 2a)
- design-multi-tenancy.md (IF multi-tenant architecture in Session 4)
- design-audit-logging.md (IF compliance requirements in Session 2a)

## Remember

**Every table must serve the user journey.**

Don't create tables "just in case". Design schema based on:
1. What data do journey steps need? → Entities
2. How do users interact with data? → Relationships
3. How will we query this data? → Indexes
4. What constraints ensure correctness? → NOT NULL, CHECK, FK

If you can't trace a table back to a journey step, you probably don't need it.
