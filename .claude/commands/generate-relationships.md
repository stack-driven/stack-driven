---
description: Session 7b - Generate table relationships and constraints (progressive building)
---

# Generate Relationships (Session 7b)

You are a database architect responsible for designing relationships between the core tables. This is the SECOND phase of Session 7, where you add foreign keys, junction tables, and constraints to the core tables defined in Session 7a.

## Your Role

Read the core tables from Session 7a, identify relationships based on business logic, and design foreign keys, junction tables, and constraints. Use minimal context (~10k tokens) by reading only the previous phase output.

## Critical Philosophy

- **Progressive Building**: Build on top of Session 7a core tables
- **Minimal Context**: Read only 07a-core-tables.md to preserve tokens
- **Relationship Focus**: Only design relationships, not indexes or special patterns
- **State Progression**: Update tracking state for next phase

## Steps to Execute

### Step 1: Load and Validate Current State

Read `.cascade/session-7-state.json` to verify:
- Phase "core-tables" is completed
- Core tables have been generated
- Ready for relationship design

If state file doesn't exist or core-tables not completed:
- Error: "Please run /generate-core-tables first"

### Step 2: Read Core Tables Only

Read ONLY this file (targeting ~10k tokens):
1. `product-guidelines/07a-core-tables.md` - Core table definitions

This contains all tables and columns needed to design relationships.

### Step 3: Analyze Relationships

From the core tables, identify:

1. **One-to-Many Relationships**:
   - User → Documents (one user owns many documents)
   - Document → Assessments (one document has many assessments)
   - Team → Users (one team has many members)

2. **Many-to-Many Relationships**:
   - Users ↔ Roles (users can have multiple roles)
   - Projects ↔ Tags (projects can have multiple tags)
   - Documents ↔ Categories (documents in multiple categories)

3. **Self-Referential Relationships**:
   - Users → Users (manager relationship)
   - Categories → Categories (parent-child hierarchy)
   - Comments → Comments (threaded replies)

4. **Polymorphic Relationships** (if applicable):
   - Attachments → (Documents|Comments|Messages)
   - Activities → (any auditable entity)

### Step 4: Invoke Relationships Sub-Agent

Use the Task tool to design relationships:

```yaml
subagent_type: general-purpose
description: Design database relationships
prompt: |
  Invoke the design-relationships sub-agent to create relationship definitions.

  Agent path: .claude/agents/design-relationships.md

  Inputs:
  - Core tables from 07a-core-tables.md: [list tables]
  - Identified relationships: [from Step 3]
  - Database paradigm: [from state or tables file]

  Follow the agent specification to:
  1. Design foreign key columns
  2. Create junction tables for many-to-many
  3. Define CASCADE/RESTRICT behaviors
  4. Add relationship constraints
  5. Ensure referential integrity

  Return structured output with:
  - Foreign key definitions
  - Junction table schemas
  - Constraint specifications
```

### Step 5: Generate and Write Relationships File

Write the relationship definitions to `product-guidelines/07b-relationships.md`:

```markdown
# Database Schema - Relationships & Constraints

Generated: [timestamp]
Base Tables: [count from 07a]
Relationships Added: [count]
Junction Tables Created: [count]

## Relationship Summary

| From Table | To Table | Type | Via | Description |
|------------|----------|------|-----|-------------|
| users | documents | 1:N | documents.user_id | User owns documents |
| documents | assessments | 1:N | assessments.document_id | Document has assessments |
| users | roles | N:M | user_roles | Users have multiple roles |
...

## Foreign Key Definitions

### Table: documents (modifications)
**Added Columns**:

| Column | Type | Constraints | References | On Delete |
|--------|------|-------------|------------|-----------|
| user_id | UUID | NOT NULL | users(id) | CASCADE |
| folder_id | UUID | NULL | folders(id) | SET NULL |
| team_id | UUID | NULL | teams(id) | CASCADE |

**Indexes for FKs**:
- idx_documents_user_id ON (user_id)
- idx_documents_folder_id ON (folder_id)
- idx_documents_team_id ON (team_id)

### Table: assessments (modifications)
**Added Columns**:

| Column | Type | Constraints | References | On Delete |
|--------|------|-------------|------------|-----------|
| document_id | UUID | NOT NULL | documents(id) | CASCADE |
| reviewer_id | UUID | NULL | users(id) | SET NULL |

**Indexes for FKs**:
- idx_assessments_document_id ON (document_id)
- idx_assessments_reviewer_id ON (reviewer_id)

## Junction Tables

### Table: user_roles
**Purpose**: Many-to-many relationship between users and roles

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| user_id | UUID | NOT NULL | References users(id) |
| role_id | UUID | NOT NULL | References roles(id) |
| granted_at | TIMESTAMP | NOT NULL | When role was granted |
| granted_by | UUID | NULL | Who granted the role |
| expires_at | TIMESTAMP | NULL | Optional expiration |

**Constraints**:
- PRIMARY KEY (user_id, role_id)
- FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
- FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
- FOREIGN KEY (granted_by) REFERENCES users(id) ON DELETE SET NULL

**Indexes**:
- idx_user_roles_user_id ON (user_id)
- idx_user_roles_role_id ON (role_id)

[Continue for all junction tables...]

## Constraint Definitions

### Referential Integrity Rules

**CASCADE Deletions**:
- Deleting a user cascades to their documents
- Deleting a document cascades to its assessments
- Deleting a team cascades to team memberships

**RESTRICT Deletions**:
- Cannot delete a role that has users assigned
- Cannot delete a category with subcategories

**SET NULL Deletions**:
- Deleting a reviewer sets assessment.reviewer_id to NULL
- Deleting a folder sets document.folder_id to NULL

### Check Constraints

```sql
-- Ensure valid status values
ALTER TABLE documents ADD CONSTRAINT chk_document_status
  CHECK (status IN ('draft', 'pending', 'processing', 'completed', 'failed'));

-- Ensure positive values
ALTER TABLE documents ADD CONSTRAINT chk_file_size_positive
  CHECK (file_size > 0);

-- Ensure dates are logical
ALTER TABLE user_roles ADD CONSTRAINT chk_role_dates
  CHECK (expires_at IS NULL OR expires_at > granted_at);
```

## Relationship Integrity Verification

Queries to verify relationship integrity:

```sql
-- Find orphaned documents (should return 0)
SELECT COUNT(*) FROM documents d
LEFT JOIN users u ON d.user_id = u.id
WHERE u.id IS NULL;

-- Find users without any role (might be valid)
SELECT u.* FROM users u
LEFT JOIN user_roles ur ON u.id = ur.user_id
WHERE ur.user_id IS NULL;
```

## Statistics

- One-to-Many Relationships: [count]
- Many-to-Many Relationships: [count]
- Self-Referential: [count]
- Junction Tables: [count]
- Foreign Keys Added: [count]
- Check Constraints: [count]
```

### Step 6: Update State Tracking

Update `.cascade/session-7-state.json`:

```json
{
  "session": "7",
  "phase": "relationships",
  "phases_completed": ["core-tables", "relationships"],
  "status": "in-progress",
  "generated_at": "[timestamp]",
  "statistics": {
    "core_tables_count": [from previous],
    "relationships_count": [number],
    "junction_tables_count": [number],
    "foreign_keys_count": [number],
    "next_phase": "special-tables"
  },
  "relationships": [
    {
      "from": "documents",
      "to": "users",
      "type": "many-to-one",
      "via": "user_id"
    }
  ]
}
```

### Step 7: Display Completion and Next Steps

Display completion message:

```
✅ Session 7b Complete: Relationships & Constraints Added

Added to [N] core tables:
- Foreign keys: [count]
- Junction tables: [count]
- Check constraints: [count]

Relationship types:
- One-to-Many: [count]
- Many-to-Many: [count]
- Self-referential: [count]

Files created:
- product-guidelines/07b-relationships.md

Next phase: Special-purpose tables (if needed)
Type "continue" to run Session 7c (generate-special-tables)
Or type "stop" to review and resume later
```

## Error Handling

**If 07a-core-tables.md missing**:
- Error: "Core tables file not found. Please run /generate-core-tables first."

**If state shows phase not ready**:
- Error: "Previous phase not completed. Current phase: [phase]"

**If relationships conflict**:
- Warn about circular dependencies
- Suggest resolution strategies
- Continue with valid relationships

## Important Notes

1. **DO NOT** create indexes for performance yet (that's Session 7d)
2. **DO NOT** add i18n, audit, or integration tables (that's Session 7c)
3. **Focus only** on relationships between existing core tables
4. **Always add** foreign key indexes for query performance
5. **Consider** ON DELETE behaviors carefully
6. **Maintain** state file for progression tracking

This micro-session should use <20% of context capacity, preserving space for special tables and optimization phases.