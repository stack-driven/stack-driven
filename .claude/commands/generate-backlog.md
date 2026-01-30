---
description: Session 10 - Generate complete backlog from journey through to technical specs
---

# Session 10: Generate Backlog

This is **Session 10** of the cascade. You'll create a production-ready backlog where every issue traces to user value and is informed by technical specifications (database schema, API contracts, testing strategy).

## Your Role

You're a technical product manager creating a systematic backlog from all cascade outputs.

## Process

### Step 1: Read ALL Previous Outputs

```
Read: product-guidelines/00-user-journey.ctx.md
Read: product-guidelines/01-product-strategy.ctx.md
Read: product-guidelines/02-tech-stack.md

# Check if constraints exist (Session 2a is optional)
If product-guidelines/02a-constraints.ctx.md exists:
  Read: product-guidelines/02a-constraints.ctx.md

Read: product-guidelines/02b-coding-standards.ctx.md

# Check if AI integration strategy exists (Session 3c is optional)
If product-guidelines/02c-ai-integration-strategy.ctx.md exists:
  Read: product-guidelines/02c-ai-integration-strategy.ctx.md

Read: product-guidelines/03a-mission.ctx.md
Read: product-guidelines/03b-metrics.ctx.md
Read: product-guidelines/03c-monetization.ctx.md
Read: product-guidelines/04-architecture.ctx.md
Read: product-guidelines/07-database-schema.ctx.md
Read: product-guidelines/08-api-design.ctx.md
Read: product-guidelines/08b-api-contracts.ctx.md
Read: product-guidelines/09-test-strategy.ctx.md
Read: product-guidelines/09b-application-architecture.ctx.md
```

**Context Optimization**: We read .ctx.md files for significant context reduction:
- `01-product-strategy.ctx.md` (not `01-product-strategy.md`) - 65% reduction: Contains vision, positioning, goals, principles, and roadmap themes—without market analysis and competitive landscape.
- `02a-constraints.ctx.md` (if exists) - 70% reduction: Contains critical technical, organizational, and compliance constraints with trade-off decisions—without detailed constraint explanations and validation checklists.
- `02b-coding-standards.ctx.md` (not `02b-coding-standards.md`) - 70% reduction: Contains framework-specific patterns, file organization, and naming conventions—without detailed implementation examples and migration guides.
- `02c-ai-integration-strategy.ctx.md` (if exists) - 60% reduction: Contains AI implementation patterns, model choices, cost projections, and MVP phasing—without detailed compliance documentation and fallback strategies.
- `07-database-schema.ctx.md` (not `07-database-schema.md`) - 56% reduction: Contains table list, ERD, relationships, and data access patterns—without column details, indexes, migrations, and scaling considerations.
- `08-api-design.ctx.md` (Session 8) - Condensed: Contains API paradigm (REST/GraphQL/gRPC), serialization format (JSON/Protobuf/MessagePack), auth method, rate limiting, pagination approach, and error format—without decision trees, journey analysis, and alternatives.
- `08b-api-contracts.ctx.md` (Session 8b) - 80% reduction: Contains endpoint list organized by journey step with brief descriptions—without OpenAPI schemas, request/response definitions, error schemas, and authentication flow details.
- `09-test-strategy.ctx.md` (not `09-test-strategy.md`) - 66% reduction: Contains coverage targets, test types, testing tools, and quality gates—without testing philosophy, detailed examples, test data management, performance testing, security testing, and TDD/BDD workflows.
- `09b-application-architecture.ctx.md` (not `09b-application-architecture.md`) - ~60% reduction: Contains service list with method signatures, repository methods, controller endpoint mappings, and component hierarchy—without business rules, implementation details, design decisions, and architecture rationale.

Note: Brand strategy (formerly 07) and design system (formerly 08) are now POST-CASCADE extensions if needed, not required for backlog generation.

### Step 2: Generate Epic Structure

**Create 1 epic per journey step** (typically 3-5 epics):
- Epic 01: Onboarding (Journey Steps 1-2)
- Epic 02: Core Value Delivery (Journey Step 3 - THE KEY EPIC)
- Epic 03: Results & Actions (Journey Steps 4-5)
- Epic 04: Foundation (Auth, database, infrastructure, legal/compliance)
- Epic 05: Design System Implementation
- Epic 06: Metrics & Analytics

### Step 3: Generate User Stories (30-50 total)

For EACH journey step, create stories that:

1. **Enable that step's user value**
2. **Use specified tech stack**
3. **Implement designed components**
4. **Track defined metrics**
5. **If AI integration exists, implement AI features** (prompt engineering, RAG setup, model routing, etc.)

**Story Format** (use `/templates/issue-template.md`):
```markdown
# [STORY-001] OAuth-based signup with Google

Type: Story
Journey Step: Step 1 (Onboarding)
Priority: P0

## User Value
When a compliance officer wants to try the product, they want frictionless signup, so they can reach value quickly.

Value: Reduces signup friction, improves activation rate (key metric).

## Acceptance Criteria
- [ ] User clicks "Sign up with Google"
- [ ] OAuth flow completes, creates user in PostgreSQL
- [ ] User lands in empty dashboard (ready for Step 2)

## Technical Approach
Tech Stack: Clerk for auth, PostgreSQL for user storage, Next.js frontend

## Dependencies
Blocked By: EPIC-04 (Database schema setup)

## Estimation
Effort: 2 days (1 day Clerk integration, 1 day user creation flow)
```

**Required Foundation Stories (Epic 04)**:

Every backlog MUST include these legal/compliance stories:
- **Terms of Service/Conditions**: Legal agreement users accept when signing up
- **Privacy Policy**: How user data is collected, used, stored, and protected
- **Cookie Policy** (if applicable): Cookie usage and consent management
- **Data Processing Agreement** (for B2B/Enterprise): GDPR/compliance requirements

These are P0 priorities - production applications cannot launch without them.

**AI-Specific Stories (if 02c-ai-integration-strategy exists)**:

When AI integration strategy is present, include these stories based on the chosen patterns:
- **Prompt Engineering**: Stories for crafting and testing prompts for each AI feature
- **RAG Implementation** (if using RAG): Vector store setup, chunking strategy, retrieval optimization
- **Model Routing** (if using multiple models): Router implementation, fallback logic
- **Cost Monitoring**: Usage tracking, budget alerts, optimization stories
- **AI Quality Assurance**: Response validation, accuracy testing, feedback loops
- **Compliance Setup** (if regulated): DPA configuration, data retention policies

### Step 4: Apply RICE Prioritization

For each story, calculate RICE:

**R (Reach)**: How many users affected per time period?
**I (Impact)**: Journey improvement (0.25 = minimal, 0.5 = low, 1 = medium, 2 = high, 3 = massive)
**C (Confidence)**: Evidence level (50% = low, 80% = medium, 100% = high)
**E (Effort)**: Person-days

**RICE Score** = (R × I × C) ÷ E

**Priority Assignment**:
- P0: RICE > [threshold], critical for MVP
- P1: Important, post-MVP
- P2: Nice-to-have, defer

### Step 5: Map Dependencies

For each story, note:
- **Blocks**: What stories can't start until this is done?
- **Blocked By**: What must be done first?

Example:
- STORY-001 (OAuth) blocks STORY-010 (User dashboard)
- STORY-001 blocked by EPIC-04 (Database setup)

## Generating the Output

### Create Directory Structure:

```
product-guidelines/10-backlog/
├── BACKLOG.md (summary)
└── issues/
    ├── epic-01-onboarding.md
    ├── epic-02-core-value.md
    ├── story-001-oauth-signup.md
    ├── story-002-document-upload.md
    └── ... (30-50 stories total)
```

### BACKLOG.md Contents:

- Epic summary (6-8 epics)
- Priority distribution (X P0 stories, Y P1, Z P2)
- Estimated timeline (total effort in weeks)
- Journey mapping (which stories serve which journey steps)

### Issue File Contents:

Use `/templates/issue-template.md` for EVERY story.

**Critical**: Each story must have:
- Journey step reference
- Clear user value
- Acceptance criteria (testable)
- Tech stack components used
- RICE score and priority
- Dependencies

## Validation Checklist

- [ ] Every issue references a journey step?
- [ ] All P0 issues have clear acceptance criteria?
- [ ] Dependencies are mapped?
- [ ] Estimates are reasonable (nothing >5 days)?
- [ ] Total backlog enables complete journey (Step 1→5)?
- [ ] Tech stack is used (stories reference chosen tech)?
- [ ] Design components are built (stories implement design system)?
- [ ] Metrics are tracked (analytics instrumented)?
- [ ] Legal/compliance documents included (Terms of Service, Privacy Policy)?

## After Generation

```
[✓] Session 10 complete! Production backlog generated.

Your Backlog:
  [X] epics covering full user journey
  [Y] user stories (prioritized with RICE)
   - [A] P0 stories (critical for MVP)
   - [B] P1 stories (important, post-MVP)
   - [C] P2 stories (nice-to-have)

Estimated MVP timeline: [Z] weeks

File created: product-guidelines/10-backlog/BACKLOG.md + [Y] issue files

Next, we can push these issues to GitHub.

When ready, run: /create-gh-issues
Or check progress: /cascade-status
```

## Important Guidelines

1. **Every issue traces to journey**: No "nice to have" features disconnected from user value
2. **Use specified tech stack**: Stories should reference chosen technologies
3. **Implement design system**: Stories should reference designed components
4. **Track metrics**: Include analytics instrumentation stories
5. **Reasonable estimates**: No story >5 days (break down if larger)
6. **Clear acceptance criteria**: Every story testable
7. **Include legal compliance**: Every backlog MUST include Terms of Service, Privacy Policy, and other required legal documents (P0 priority)

## Reference

- Template: `/templates/issue-template.md`
- Example: `/examples/compliance-saas/backlog/` (if created)

---

**Now, synthesize all cascade outputs into a complete, prioritized backlog!**

## Output Format

IMPORTANT: Do not use emojis in generated outputs. Use plain text for all communication.
