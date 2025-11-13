# Create database-schema-essentials.md template for backlog generation

## Problem

The `database-schema-template.md` file is **436 lines** with complete table definitions, index strategies, query examples, migration syntax, and scaling considerations. When Session 10 (backlog generation) reads this file, it loads **~1,744 tokens** of context, most of which is implementation detail.

**Bloat level: 70%**

## What Backlog Generation Actually Needs

Backlog generation needs:
- List of tables (with journey mapping)
- Entity relationships (ERD)
- Key technology choices (database type, ORM, ID strategy)
- Multi-tenancy approach

Backlog generation does NOT need:
- Complete column definitions for each table
- Index strategy with query patterns
- Data constraints philosophy
- Migration file syntax
- Query examples with EXPLAIN ANALYZE
- Data types rationale
- Scaling considerations
- Testing strategy for schema
- Maintenance guidelines
- "What We DIDN'T Choose" sections

## Solution

Create `templates/17-database-schema-essentials-template.md` that contains only the structural information needed for backlog generation.

**Target size: 100-150 lines (~400-600 tokens)**
**Reduction: 70% (436 → 120 lines)**

## Essential Template Structure

```markdown
# Database Schema Essentials (For Backlog Generation)

> This is a condensed version for Session 10 (backlog generation).
> See `07-database-schema.md` for complete schema with columns, indexes, and migrations.

## Database Technology

- **Database**: [PostgreSQL/MongoDB/MySQL from tech stack]
- **ORM**: [Prisma/TypeORM/etc.]
- **ID Strategy**: [UUIDs/BigInt]
- **Multi-tenancy**: [Approach]

## Tables (Journey Mapping)

### Core Tables
- **users** - User accounts (Step 0: Authentication)
- **teams** - Team/organization accounts (multi-tenancy)
- **[entity1]** - [Purpose] (Journey Step X)
- **[entity2]** - [Purpose] (Journey Step Y)
- **[entity3]** - [Purpose] (Journey Step Z)

### Supporting Tables
- **usage_events** - Analytics and metrics tracking
- **[join_table]** - M:N relationship between [A] and [B]

## Entity Relationships

```
┌─────────────┐       ┌──────────────┐
│    Teams    │───────│    Users     │
└─────────────┘  1:N  └──────┬───────┘
                              │ 1:N
                      ┌───────▼────────┐
                      │   [Entity1]    │
                      └───────┬────────┘
                              │ 1:N
                      ┌───────▼────────┐       ┌──────────────┐
                      │   [Entity2]    │───────│  [Entity3]   │
                      └────────────────┘  M:N  └──────────────┘
```

## Key Relationships

**One-to-Many:**
- teams → users (1:N)
- users → [entity1] (1:N)
- [entity1] → [entity2] (1:N)

**Many-to-Many:**
- [entity2] ↔ [entity3] (via [join_table])

## Data Access Patterns (for story scope)

**Critical queries** (inform story complexity):
- List [entity1] by user (filtered, paginated)
- Get [entity2] with related [entity3] (join query)
- Calculate usage for billing (aggregation)
```

## Implementation Checklist

- [ ] Create `templates/17-database-schema-essentials-template.md`
- [ ] Update `.claude/commands/design-database-schema.md` to generate BOTH versions
- [ ] Update `.claude/commands/generate-backlog.md` to read essentials instead of full file
- [ ] Test with example project
- [ ] Verify ERD and relationships are sufficient for story creation

## Success Criteria

- Essentials file is 100-150 lines
- Contains ERD and table list
- Stories can reference tables without needing column details
- Context usage reduced by ~1,100 tokens

## Impact

- **Lines reduced**: 436 → 120 (72% reduction)
- **Token reduction**: ~1,744 → ~480 tokens
- **Context savings**: ~1,264 tokens per backlog generation

## Labels

`enhancement`, `context-optimization`, `templates`
