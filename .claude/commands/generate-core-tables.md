---
description: Session 7a - Generate core database tables from user journey (minimal context)
---

# Generate Core Tables (Session 7a)

You are a database architect responsible for generating the core database tables for the application. This is the FIRST phase of Session 7, where you identify and define core business entities WITHOUT relationships, indexes, or special patterns yet.

## Your Role

Extract core entities from the user journey to define primary table structures, using minimal context (~15k tokens) to preserve capacity for later schema refinement phases.

## Critical Philosophy

- **Journey-Driven**: Tables emerge from user journey entities, not technical assumptions
- **Minimal Context**: Read only essential files to preserve tokens for later phases
- **Core Tables Only**: Define primary entities without relationships or optimizations
- **State Initialization**: Create tracking state for progressive schema building

## Steps to Execute

### Step 1: Read Minimal Context

Read ONLY these essential files (targeting ~15k tokens total):
1. `product-guidelines/00-user-journey.ctx.md` - For entity extraction
2. `product-guidelines/02-tech-stack.ctx.md` - For database paradigm and ORM choice

Skip all other files to preserve context capacity.

### Step 2: Extract Core Entities from Journey

Analyze the user journey to identify core business entities:

1. **Identify nouns** that represent persistent data:
   - Users, documents, assessments, teams, projects, etc.
   - Look for things that get created, updated, deleted
   - Find entities that have relationships

2. **Classify entities by type**:
   - **Primary entities**: Core to the business (users, main objects)
   - **Supporting entities**: Enable features (sessions, preferences)
   - **System entities**: Technical necessities (jobs, queues)

3. **Map journey steps to entities**:
   - For each journey step, identify what data is created/read
   - Note which entities are central to value delivery
   - Document entity purpose and journey alignment

### Step 3: Invoke Core Tables Sub-Agent

Use the Task tool to design core table structures:

```yaml
subagent_type: general-purpose
description: Design core database tables
prompt: |
  Invoke the design-core-tables sub-agent to create table definitions.

  Agent path: .claude/agents/design-core-tables.md

  Inputs:
  - Core entities identified: [list from Step 2]
  - Database paradigm: [from tech-stack]
  - ORM tool: [from tech-stack]

  Follow the agent specification to:
  1. Map entities to tables
  2. Define columns with types and constraints
  3. Choose primary key strategy
  4. Add base columns (created_at, updated_at)
  5. Document journey traceability

  Return structured output with table definitions.
```

### Step 4: Generate and Write Core Tables File

**IMPORTANT**: You MUST create the file `product-guidelines/07a-core-tables.md` with the core table structure. This file is required for Session 7b to read.

Write the core table definitions to `product-guidelines/07a-core-tables.md` with this structure:

```markdown
# Database Schema - Core Tables

Generated: [timestamp]
Database: [database from tech-stack]
Total Core Tables: [count]

## Core Entity Mapping

| Entity | Table Name | Journey Alignment | Purpose |
|--------|------------|-------------------|---------|
| User | users | All steps - authentication | System users and profiles |
| Document | documents | Step 2: Upload | Compliance documents |
| Assessment | assessments | Step 3: Analysis | AI assessment results |
...

## Table Definitions

### Table: users
**Purpose**: Store user accounts and authentication data
**Journey**: Required for all authenticated actions

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| email | VARCHAR(255) | UNIQUE, NOT NULL | User email |
| password_hash | VARCHAR(255) | NOT NULL | Bcrypt password |
| created_at | TIMESTAMP | NOT NULL | Record creation |
| updated_at | TIMESTAMP | NOT NULL | Last modification |

### Table: documents
**Purpose**: Store uploaded compliance documents
**Journey**: Step 2 - Document upload and management

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| title | VARCHAR(500) | NOT NULL | Document title |
| file_path | TEXT | NOT NULL | Storage location |
| file_size | BIGINT | NOT NULL | Size in bytes |
| mime_type | VARCHAR(100) | NOT NULL | Content type |
| status | VARCHAR(50) | NOT NULL | Processing status |
| created_at | TIMESTAMP | NOT NULL | Upload time |
| updated_at | TIMESTAMP | NOT NULL | Last modification |

[Continue for all core tables...]

## Summary Statistics

- Primary Entities: [count]
- Supporting Entities: [count]
- System Entities: [count]
- Total Columns: [count]
- Storage Estimate: [rough estimate based on expected row counts]
```

### Step 5: Initialize State Tracking

Create `.cascade/session-7-state.json` with initial state:

```json
{
  "session": "7",
  "phase": "core-tables",
  "phases_completed": ["core-tables"],
  "status": "in-progress",
  "generated_at": "[timestamp]",
  "statistics": {
    "core_tables_count": [number],
    "entities_identified": [number],
    "next_phase": "relationships"
  },
  "tables": [
    {
      "name": "users",
      "type": "primary",
      "columns_count": [number]
    },
    {
      "name": "documents",
      "type": "primary",
      "columns_count": [number]
    }
  ]
}
```

### Step 6: Display Completion and Next Steps

After generating core tables, display:

```
✅ Session 7a Complete: Core Tables Generated

Generated [N] core tables:
- Primary entities: [list]
- Supporting entities: [list]
- System entities: [list]

Files created:
- product-guidelines/07a-core-tables.md
- .cascade/session-7-state.json

Next phase: Relationships and constraints
Type "continue" to run Session 7b (generate-relationships)
Or type "stop" to review and resume later
```

## Configuration

**STATE_FILE_PATH**: `.cascade/session-7-state.json`

## State Management

**State File Path**: `.cascade/session-7-state.json`

**State Schema**:
- `session`: Always "7"
- `phase`: Current phase (core-tables, relationships, special-tables, optimization, complete)
- `phases_completed`: Array of completed phase names
- `status`: in-progress | complete
- `statistics`: Metrics about generation
- `tables`: List of tables created with metadata

**State Updates**:
- After successful generation, update phase to "core-tables" completed
- Record table count and entity mapping
- Set next_phase to "relationships"

## Error Handling

**If journey file missing**:
- Error: "Cannot find user journey file. Please run Session 1 first."

**If tech-stack missing**:
- Error: "Cannot find tech stack file. Please run Session 3 first."

**If sub-agent fails**:
- Retry once with clearer prompt
- If still fails, save partial progress in state
- Display error and recovery instructions

## Important Notes

1. **DO NOT** design relationships in this phase (that's Session 7b)
2. **DO NOT** create indexes yet (that's Session 7d)
3. **DO NOT** add i18n or audit columns (that's Session 7c if needed)
4. **Focus only** on core entity tables with basic columns
5. **Preserve context** by reading minimal files
6. **Create state file** for progression tracking

This micro-session should use <30% of context capacity, leaving room for subsequent phases to add relationships, special tables, and optimizations.