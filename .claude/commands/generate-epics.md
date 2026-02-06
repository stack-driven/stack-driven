---
description: Session 10a - Generate epic structure from user journey (minimal context)
---

# Generate Epics (Session 10a)

You are an expert in Jeff Patton's User Story Mapping methodology, responsible for generating the epic structure for the backlog. This is the FIRST phase of Session 10, where you identify and define epics WITHOUT generating individual stories yet.

## Your Role

Extract activities and goals from the user journey to define business epics, plus identify required foundation and enabler epics based on technical decisions from previous sessions. You will use minimal context (20k tokens) to preserve capacity for later story generation.

## Critical Philosophy

- **Journey-Driven**: Epics emerge from user journey activities, not technical architecture
- **Minimal Context**: Read only essential files to preserve tokens for story generation
- **Epic Structure Only**: Define epics without generating stories (that's Session 10b)
- **State Initialization**: Create tracking state for iterative processing

## Steps to Execute

### Step 1: Read Minimal Context

Read ONLY these essential files (targeting ~20k tokens total):
1. `product-guidelines/00-user-journey.ctx.md` - For activity extraction
2. `product-guidelines/01-product-strategy.ctx.md` - For strategic alignment
3. `product-guidelines/02-tech-stack.ctx.md` - For technical requirements
4. `product-guidelines/04-architecture.ctx.md` - For architectural patterns

Skip all other files to preserve context capacity.

### Step 2: Extract Business Epics from Journey

Apply Jeff Patton's User Story Mapping:
1. Identify **activities** from the user journey (verb phrases that represent goals)
2. Group related journey steps under each activity
3. Convert each activity into a **business epic**

Example mapping:
- Journey: "Users upload compliance documents" → Activity: "Document Management"
- Journey: "AI analyzes document content" → Activity: "AI Processing"
- Epic: "Document Management System" (from activity)

### Step 3: Identify Foundation and Enabler Epics

**Foundation Epic (ALWAYS Epic 01)**
- Authentication & Authorization
- Core data models
- Error handling
- Logging infrastructure
- Basic monitoring

**Conditional Enabler Epics** (0-5 based on requirements):
- **DevOps & Deployment** (if complex deployment in Session 13 plan)
- **Third-Party Integrations** (if external services in tech stack)
- **Compliance & Security** (if regulated industry in constraints)
- **Performance & Scaling** (if high scale requirements)
- **Multi-Tenancy** (if B2B SaaS architecture)

### Step 4: Generate Epic Definitions

For each epic, define:
- **Epic Number**: Sequential (Epic 01, Epic 02, etc.)
- **Epic Name**: Clear, business-focused title
- **Epic Type**: Foundation | Business | Enabler
- **Description**: 2-3 sentences explaining the epic's purpose
- **Journey Alignment**: Which journey steps/activities it serves
- **Priority**: P0 (Must Have) | P1 (Should Have) | P2 (Nice to Have)
- **Estimated Story Count**: Rough estimate (10-15 stories per epic typically)

### Step 5: Generate and Write Epic Definition File

**IMPORTANT**: You MUST create the file `product-guidelines/10a-epics.md` with the epic structure. This file is required for Session 10b to read.

Write the epic definitions to `product-guidelines/10a-epics.md` with this structure:

```markdown
# Product Backlog - Epic Structure

Generated: [timestamp]
Total Epics: [count]
Estimated Total Stories: [sum of estimates]

## Epic Summary

| Epic | Name | Type | Priority | Est. Stories |
|------|------|------|----------|--------------|
| Epic 01 | Foundation Infrastructure | Foundation | P0 | 15 |
| Epic 02 | [Business Epic 1] | Business | P0 | 12 |
| Epic 03 | [Business Epic 2] | Business | P0 | 10 |
...

## Epic Definitions

### Epic 01: Foundation Infrastructure
**Type**: Foundation
**Priority**: P0
**Estimated Stories**: 15

**Description**: Core technical infrastructure including authentication, data models, error handling, and monitoring required before any business features can be built.

**Journey Alignment**: Enables all journey steps by providing technical foundation.

**Key Components**:
- Authentication & authorization system
- Core data models and database setup
- Error handling and logging
- Basic monitoring and health checks

---

### Epic 02: [Business Epic Name]
**Type**: Business
**Priority**: P0/P1
**Estimated Stories**: [10-15]

**Description**: [2-3 sentences describing the epic's business value]

**Journey Alignment**: Serves journey steps [X-Y] where users [activity description].

**Key Components**:
- [Component 1]
- [Component 2]
- [Component 3]

[Continue for all epics...]
```

### Step 6: Generate Context File for Session 10b

After generating the epic structure, create a condensed context version for token efficiency:

Use Task tool to invoke distillation agent:
- **Source**: `product-guidelines/10a-epics.md`
- **Output**: `product-guidelines/10a-epics.ctx.md`
- **Critical to preserve**: ALL epic numbers, names, types, priorities, estimated story counts
- **Remove**: Detailed descriptions, journey alignment explanations, key components lists
- **Target reduction**: 60-70%

This maintains consistency with the framework pattern where all intermediate outputs have .ctx.md versions for token efficiency.

### Step 7: Initialize State Tracking

Create `.cascade/session-10-state.json`:

```json
{
  "session": "10",
  "phase": "epic-generation",
  "generated_at": "[timestamp]",
  "epics_generated": true,
  "epics": [
    {
      "id": "epic-01",
      "name": "Foundation Infrastructure",
      "type": "foundation",
      "priority": "P0",
      "estimated_stories": 15,
      "processed": false
    },
    {
      "id": "epic-02",
      "name": "[Business Epic 1]",
      "type": "business",
      "priority": "P0",
      "estimated_stories": 12,
      "processed": false
    }
  ],
  "total_epics": 5,
  "processed_count": 0,
  "total_stories_generated": 0,
  "current_epic": null,
  "status": "ready_for_story_generation"
}
```

### Step 8: Provide User Instructions

Output a message explaining:
1. Epic structure has been generated
2. Number of epics identified
3. Estimated total story count
4. Next step: Run `/generate-epic-stories` to process epics one by one

## Success Criteria

- [ ] Uses <20k tokens of context (minimal file reading)
- [ ] Generates 3-8 epics typically (1 foundation + 2-5 business + 0-2 enablers)
- [ ] Each epic has clear journey alignment
- [ ] State file created for tracking progress
- [ ] Epic structure follows Jeff Patton methodology
- [ ] Ready for iterative story generation in Session 10b

## Output Format

The command should create:
1. `product-guidelines/10a-epics.md` - Epic definitions (full version for humans)
2. `product-guidelines/10a-epics.ctx.md` - Condensed context version for Session 10b (60-70% reduction)
3. `.cascade/session-10-state.json` - State tracking file

**Note on Context Files**: Session 10a creates both .md and .ctx.md files to maintain consistency with the framework pattern established by Sessions 1-9b. While 10a is an intermediate step within Session 10, the context file provides token efficiency when Session 10b reads the epic structure.

Then output:
```
✅ Session 10a Complete: Epic Structure Generated

Generated [N] epics:
- 1 Foundation epic
- [X] Business epics (from journey activities)
- [Y] Enabler epics (based on requirements)

Estimated total stories: ~[total]

Next step: Run `/generate-epic-stories` to begin generating stories for each epic.
The system will process epics one at a time to avoid context exhaustion.
```