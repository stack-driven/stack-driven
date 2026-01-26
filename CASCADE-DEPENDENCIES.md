# Stack-Driven Cascade Dependencies

**Visual dependency map showing which sessions read which files.**

This document shows EXACTLY what each session reads as inputs, making it easy to:
- Spot missing dependencies when adding features
- Understand the impact radius of changes to outputs
- Debug cascade failures by tracing data flow
- Verify essentials file usage for token optimization

---

## Dependency Legend

```
📄 Full file
📋 Essentials file (condensed version)
🔧 Template file
```

---

## Core Cascade Flow (Sessions 1-14)

### Session 1: `/refine-journey`
**Outputs:** `00-user-journey.md`

**Reads:**
- 🔧 `/templates/00-user-journey-template.md`
- 🔧 `/templates/00-user-journey-interview-template.md`

**Dependencies:** None (first session)

---

### Session 2: `/create-product-strategy`
**Outputs:**
- `01-product-strategy.md`
- `01-product-strategy-essentials.md`

**Reads:**
```
├─ 📄 product-guidelines/00-user-journey.md
└─ 🔧 /templates/01-product-strategy-template.md
```

**Dependencies:** Session 1

**Downstream consumers of essentials:**
- Session 4 (generate-strategy)
- Session 10 (generate-backlog)
- Session 12 (scaffold-project)

---

### Session 2a: `/document-constraints`
**Outputs:**
- `02a-constraints.md`
- `02a-constraints-essentials.md`

**Reads:**
```
├─ 📄 product-guidelines/00-user-journey.md
├─ 📄 product-guidelines/01-product-strategy.md
├─ 🔧 /templates/02a-constraints-template.md
└─ 🔧 /templates/02a-constraints-essentials-template.md
```

**Dependencies:** Sessions 1, 2

**Downstream consumers of essentials:**
- Session 3 (choose-tech-stack)
- Session 4 (generate-strategy)
- Session 10 (generate-backlog)
- Session 12 (scaffold-project)

---

### Session 3: `/choose-tech-stack`
**Outputs:** `02-tech-stack.md`

**Reads:**
```
├─ 📄 product-guidelines/00-user-journey.md
├─ 📄 product-guidelines/01-product-strategy.md
├─ 📋 product-guidelines/02a-constraints.md (if exists)
├─ 📋 product-guidelines/02a-constraints-essentials.md (if exists)
└─ 🔧 /templates/02-tech-stack-template.md
```

**Dependencies:** Sessions 1, 2, 2.5 (if exists)

**Why read full 01 not essentials?** Tech stack needs detailed market analysis, competitive positioning, and roadmap themes from full strategy to derive optimal technical choices.

---

### Session 3b: `/define-coding-standards`
**Outputs:**
- `02b-coding-standards.md`
- `02b-coding-standards-essentials.md`

**Reads:**
```
├─ 📄 product-guidelines/00-user-journey.md
├─ 📄 product-guidelines/01-product-strategy.md
├─ 📄 product-guidelines/02-tech-stack.md
├─ 📄 product-guidelines/03-mission.md
└─ 🔧 /templates/02b-coding-standards-template.md
```

**Dependencies:** Sessions 1, 2, 3, 4 (03-mission.md from generate-strategy)

**Downstream consumers of essentials:**
- Session 4 (generate-strategy)
- Session 9b (model-application)
- Session 10 (generate-backlog)
- Session 12 (scaffold-project)

---

### Session 3c: `/define-ai-integration-strategy` (Optional)
**Outputs:**
- `02c-ai-integration-strategy.md`
- `02c-ai-integration-strategy-essentials.md`

**Reads:**
```
├─ 📄 product-guidelines/00-user-journey.md
├─ 📄 product-guidelines/01-product-strategy.md
├─ 📄 product-guidelines/02-tech-stack.md
├─ 🔧 /templates/02c-ai-integration-strategy-template.md
└─ 🔧 /templates/02c-ai-integration-strategy-essentials-template.md
```

**Dependencies:** Sessions 1, 2, 3

**Condition:** Only runs if AI provider is present in tech stack

**Downstream consumers of essentials:**
- Session 4 (generate-strategy)
- Session 7 (database-schema) - for vector DB if RAG
- Session 8 (api-contracts) - for AI endpoints
- Session 9b (model-application) - for AI service layer
- Session 10 (generate-backlog) - for AI implementation stories
- Session 12 (scaffold-project) - for AI SDK configuration
- Session 13 (deployment) - for API key management
- Session 14 (observability) - for token tracking

---

### Session 4: `/generate-strategy`
**Outputs:**
- `03-mission.md`
- `04-metrics.md`
- `04-monetization.md`
- `04-architecture.md`

**Reads:**
```
├─ 📄 product-guidelines/00-user-journey.md
├─ 📋 product-guidelines/01-product-strategy-essentials.md
├─ 📄 product-guidelines/02-tech-stack.md
├─ 📋 product-guidelines/02a-constraints-essentials.md (if exists)
├─ 📋 product-guidelines/02b-coding-standards-essentials.md
├─ 📋 product-guidelines/02c-ai-integration-strategy-essentials.md (if exists)
└─ 🔧 /templates/03-mission-template.md
    /templates/04-metrics-template.md
    /templates/04-monetization-template.md
    /templates/04-architecture-template.md
```

**Dependencies:** Sessions 1, 2, 2.5 (if exists), 3, 3b, 3c (optional)

**Why essentials for 01 and 02b?** Session 4 needs vision, positioning, goals, and principles (in essentials) but not detailed market analysis. Similarly needs coding patterns but not detailed implementation examples.

---

### Session 5: `/create-brand-strategy`
**Outputs:** `05-brand-strategy.md`

**Reads:**
```
├─ 📄 product-guidelines/00-user-journey.md
├─ 📄 product-guidelines/01-product-strategy.md
├─ 📄 product-guidelines/03-mission.md
├─ 📄 product-guidelines/04-metrics.md (optional)
└─ 🔧 /templates/05-brand-strategy-template.md
```

**Dependencies:** Sessions 1, 2, 4

**No essentials file created.** Session 5 is only read by post-cascade extensions (discover-naming, define-messaging, design-brand-identity) which need full brand personality and positioning. Session 10 and 12 don't read brand strategy.

---

### Session 6: `/create-design`
**Outputs:** `06-design-system.md`

**Reads:**
```
├─ 📄 product-guidelines/00-user-journey.md
├─ 📋 product-guidelines/01-product-strategy-essentials.md
├─ 📄 product-guidelines/05-brand-strategy.md
└─ 🔧 /templates/06-design-system-template.md
```

**Dependencies:** Sessions 1, 2, 5

**No essentials file created.** Session 6 is only read by post-cascade extensions and dev-time commands (design-user-experience, implement-issue), which need full component specifications and design tokens. Session 10 and 12 don't read design system. Template already small (1.7KB).

---

### Session 7: `/design-database-schema`
**Outputs:**
- `07-database-schema.md`
- `07-database-schema-essentials.md`

**Reads:**
```
├─ 📄 product-guidelines/00-user-journey.md
├─ 📄 product-guidelines/02-tech-stack.md
├─ 📄 product-guidelines/04-architecture.md
└─ 🔧 /templates/07-database-schema-template.md
```

**Dependencies:** Sessions 1, 3, 4

**Downstream consumers of essentials:**
- Session 8 (generate-api-contracts)
- Session 9 (create-test-strategy)
- Session 9b (model-application)
- Session 10 (generate-backlog)
- Session 12 (scaffold-project)

**Why essentials?** 56% reduction. Contains table list, ERD, relationships—sufficient for API design and architecture without column details, indexes, migrations.

---

### Session 8: `/generate-api-contracts`
**Outputs:**
- `08-api-contracts.md`
- `08-api-contracts-essentials.md`

**Reads:**
```
├─ 📄 product-guidelines/00-user-journey.md
├─ 📄 product-guidelines/02-tech-stack.md
├─ 📄 product-guidelines/04-architecture.md
├─ 📋 product-guidelines/07-database-schema-essentials.md
└─ 🔧 /templates/08-api-contracts-template.md
```

**Dependencies:** Sessions 1, 3, 4, 7

**Downstream consumers of essentials:**
- Session 9 (create-test-strategy)
- Session 9b (model-application)
- Session 10 (generate-backlog)
- Session 12 (scaffold-project)

**Why essentials?** 80% reduction. Contains endpoint list organized by journey step—sufficient for test strategy and backlog without full request/response schemas, validation rules, error codes.

---

### Session 9: `/create-test-strategy`
**Outputs:**
- `09-test-strategy.md`
- `09-test-strategy-essentials.md`

**Reads:**
```
├─ 📄 product-guidelines/00-user-journey.md
├─ 📄 product-guidelines/02-tech-stack.md
├─ 📄 product-guidelines/04-architecture.md
├─ 📋 product-guidelines/07-database-schema-essentials.md
├─ 📋 product-guidelines/08-api-contracts-essentials.md
└─ 🔧 /templates/09-test-strategy-template.md
```

**Dependencies:** Sessions 1, 3, 4, 7, 8

**Downstream consumers of essentials:**
- Session 10 (generate-backlog)
- Session 12 (scaffold-project)

**Why essentials?** 66% reduction. Contains coverage targets, test types, quality gates—sufficient for backlog and scaffold without detailed test patterns and examples.

---

### Session 9b: `/model-application`
**Outputs:**
- `09b-application-architecture.md`
- `09b-application-architecture-essentials.md`

**Reads:**
```
├─ 📄 product-guidelines/00-user-journey.md
├─ 📄 product-guidelines/02-tech-stack.md
├─ 📋 product-guidelines/02b-coding-standards-essentials.md
├─ 📄 product-guidelines/04-architecture.md
├─ 📋 product-guidelines/07-database-schema-essentials.md
├─ 📋 product-guidelines/08-api-contracts-essentials.md
└─ 🔧 /templates/09b-application-architecture-template.md
```

**Dependencies:** Sessions 1, 3, 3b, 4, 7, 8

**Downstream consumers of essentials:**
- Session 10 (generate-backlog) - needs method signatures for implementation stories
- Session 12 (scaffold-project) - needs class structure for code skeleton generation

**Why essentials for inputs?** Architecture doesn't need full schemas/contracts—just table list, relationships, endpoint list. Needs essentials of coding standards for framework patterns without detailed examples.

**Why essentials for output?** 60% reduction. Contains service list with method signatures, repository methods, controller endpoint mappings—sufficient for backlog story generation and scaffold code skeletons without detailed architecture decision records and pattern explanations.

---

### Session 10: `/generate-backlog`
**Outputs:** `10-backlog/BACKLOG.md` + individual story files

**Reads:**
```
├─ 📄 product-guidelines/00-user-journey.md
├─ 📋 product-guidelines/01-product-strategy-essentials.md
├─ 📄 product-guidelines/02-tech-stack.md
├─ 📋 product-guidelines/02a-constraints-essentials.md (if exists)
├─ 📋 product-guidelines/02b-coding-standards-essentials.md
├─ 📋 product-guidelines/02c-ai-integration-strategy-essentials.md (if exists)
├─ 📄 product-guidelines/03-mission.md
├─ 📄 product-guidelines/04-metrics.md
├─ 📄 product-guidelines/04-monetization.md
├─ 📄 product-guidelines/04-architecture.md
├─ 📋 product-guidelines/07-database-schema-essentials.md
├─ 📋 product-guidelines/08-api-contracts-essentials.md
├─ 📋 product-guidelines/09-test-strategy-essentials.md
├─ 📋 product-guidelines/09b-application-architecture-essentials.md
└─ 🔧 /templates/issue-template.md
```

**Dependencies:** Sessions 1, 2, 2.5 (if exists), 3, 3b, 3c (if exists), 4, 7, 8, 9, 9b

**Why all these files?** Backlog is the convergence point where all previous decisions materialize into user stories:
- 00 (journey) → Epic structure, story prioritization
- 01-essentials (product-strategy) → Vision, goals for story context
- 02 (tech-stack) → Technical implementation approach in stories
- 02b-essentials (coding-standards) → File organization, naming for implementation tasks
- 03 (mission) → Product context in story descriptions
- 04 (metrics/monetization/architecture) → Success criteria, tracking, technical constraints
- 07-essentials (database-schema) → Data model references in stories
- 08-essentials (api-contracts) → Endpoint implementation stories
- 09-essentials (test-strategy) → Testing acceptance criteria
- 09b-essentials (application-architecture) → Service/method implementation stories ("Implement DocumentService.uploadDocument()")

**Note:** Sessions 5 (brand-strategy) and 6 (design-system) NOT read. Backlog focuses on technical implementation user stories. Design/brand context comes from journey and product strategy.

---

### Session 11: `/create-gh-issues`
**Outputs:** GitHub issues created via `gh` CLI

**Reads:**
```
└─ 📄 product-guidelines/10-backlog/BACKLOG.md
   📄 product-guidelines/10-backlog/*.md (individual stories)
```

**Dependencies:** Session 10

**No template file.** Uses `gh issue create` directly with backlog story content.

---

### Session 12: `/scaffold-project`
**Outputs:**
- `12-project-scaffold.md` (documentation)
- Code files in repository root (package.json, docker-compose.yml, src/*, etc.)

**Reads:**
```
├─ 📄 product-guidelines/00-user-journey.md
├─ 📋 product-guidelines/01-product-strategy-essentials.md
├─ 📄 product-guidelines/02-tech-stack.md
├─ 📋 product-guidelines/02a-constraints-essentials.md (if exists)
├─ 📋 product-guidelines/02b-coding-standards-essentials.md
├─ 📋 product-guidelines/02c-ai-integration-strategy-essentials.md (if exists)
├─ 📄 product-guidelines/04-architecture.md
├─ 📋 product-guidelines/07-database-schema-essentials.md
├─ 📋 product-guidelines/08-api-contracts-essentials.md
├─ 📋 product-guidelines/09-test-strategy-essentials.md
├─ 📋 product-guidelines/09b-application-architecture-essentials.md
├─ 📄 product-guidelines/10-backlog/BACKLOG.md
└─ 🔧 /templates/12-project-scaffold-template.md
```

**Dependencies:** Sessions 1, 2, 2.5 (if exists), 3, 3b, 3c (if exists), 4, 7, 8, 9, 9b, 10

**Why all these essentials files?** Scaffold GENERATES actual code:
- 00 (journey) → Project name, domain concepts
- 01-essentials (product-strategy) → Vision for code comments
- 02 (tech-stack) → Languages, frameworks, tools to scaffold
- 02b-essentials (coding-standards) → Directory structure, file organization, naming conventions
- 04 (architecture) → Monorepo/multi-repo, service structure
- 07-essentials (database-schema) → Entity classes, repository interfaces
- 08-essentials (api-contracts) → Controller/handler method stubs
- 09-essentials (test-strategy) → Test file structure, coverage setup
- 09b-essentials (application-architecture) → Service classes with method signatures, dependency injection
- 10 (backlog) → TODO comments linking to user stories

**Important:** Scaffold uses framework-specific best practices (e.g., Next.js App Router patterns), NOT generic templates. Code placed in repository root, not product-guidelines/.

---

### Session 13: `/plan-deployment`
**Outputs:** `13-deployment-plan.md`

**Reads:**
```
├─ 📄 product-guidelines/02-tech-stack.md
├─ 📄 product-guidelines/04-architecture.md
└─ 🔧 /templates/13-deployment-plan-template.md
```

**Dependencies:** Sessions 3, 4

**Why only 02 and 04?** Deployment needs to know:
- What to deploy (tech stack)
- How it's structured (architecture)
Journey, strategy, schemas not needed for infrastructure decisions.

---

### Session 14: `/design-observability`
**Outputs:** `14-observability-strategy.md`

**Reads:**
```
├─ 📄 product-guidelines/04-architecture.md
├─ 📄 product-guidelines/04-metrics.md
├─ 📄 product-guidelines/13-deployment-plan.md (optional)
└─ 🔧 /templates/14-observability-strategy-template.md
```

**Dependencies:** Session 4, optionally Session 13

**Why 04-metrics?** Business metrics inform technical monitoring (e.g., track "documents processed" metric with counters, measure "processing time" with histograms).

---

## Post-Cascade Extensions

### `/discover-naming`
**Reads:**
```
├─ 📄 product-guidelines/00-user-journey.md
├─ 📄 product-guidelines/01-product-strategy.md
├─ 📄 product-guidelines/03-mission.md
└─ 📄 product-guidelines/05-brand-strategy.md
```

**When to run:** After Session 5 (brand-strategy)

---

### `/define-messaging`
**Reads:**
```
├─ 📄 product-guidelines/00-user-journey.md
├─ 📄 product-guidelines/01-product-strategy.md
├─ 📄 product-guidelines/03-mission.md
└─ 📄 product-guidelines/05-brand-strategy.md
```

**When to run:** After Session 5 (brand-strategy)

---

### `/design-brand-identity`
**Reads:**
```
├─ 📄 product-guidelines/00-user-journey.md
├─ 📄 product-guidelines/05-brand-strategy.md
└─ 📄 product-guidelines/06-design-system.md
```

**When to run:** After Session 6 (design-system)

---

### `/design-user-experience`
**Reads:**
```
├─ 📄 product-guidelines/00-user-journey.md
├─ 📄 product-guidelines/01-product-strategy.md
├─ 📄 product-guidelines/05-brand-strategy.md
└─ 📄 product-guidelines/06-design-system.md
```

**When to run:** After Session 6 (design-system)

---

### `/setup-analytics`
**Reads:**
```
├─ 📄 product-guidelines/00-user-journey.md
├─ 📄 product-guidelines/02-tech-stack.md
├─ 📄 product-guidelines/04-metrics.md
└─ 📄 product-guidelines/06-design-system.md
```

**When to run:** After Session 6 (design-system)

---

### `/design-growth-strategy`
**Reads:**
```
├─ 📄 product-guidelines/00-user-journey.md
├─ 📄 product-guidelines/01-product-strategy.md
├─ 📄 product-guidelines/03-mission.md
├─ 📄 product-guidelines/04-metrics.md
└─ 📄 product-guidelines/04-monetization.md
```

**When to run:** After Session 4 (generate-strategy)

---

### `/create-financial-model`
**Reads:**
```
├─ 📄 product-guidelines/00-user-journey.md
├─ 📄 product-guidelines/01-product-strategy.md
├─ 📄 product-guidelines/04-metrics.md
└─ 📄 product-guidelines/04-monetization.md
```

**When to run:** After Session 4 (generate-strategy)

---

### `/create-content-guidelines`
**Reads:**
```
├─ 📄 product-guidelines/00-user-journey.md
├─ 📄 product-guidelines/05-brand-strategy.md
└─ 📄 product-guidelines/06-design-system.md
```

**When to run:** After Session 6 (design-system)

---

## Dev-Time Commands

### `/validate-outputs`
**Reads:**
```
ALL files in product-guidelines/
```

**Purpose:** Quality assurance for cascade outputs. Validates journey alignment, philosophy adherence, completeness, consistency, specificity, technical soundness.

---

### `/implement-issue [issue-number]`
**Reads (conditionally):**
```
├─ 📄 product-guidelines/02-tech-stack.md (ALWAYS)
├─ 📄 product-guidelines/06-design-system.md (if UI work)
├─ 📄 product-guidelines/07-database-schema.md (if database work)
└─ 📄 product-guidelines/08-api-contracts.md (if API work)
```

**Purpose:** Implement GitHub issue following approved plan. Loads relevant guardrails based on work type.

**Why full files, not essentials?** Implementation needs:
- Full schema with indexes, constraints, migrations (not just table list)
- Full API contracts with validation rules, error codes (not just endpoint list)
- Full design tokens and component specs (no essentials file exists)

---

### `/plan-issue [issue-number]`
**Reads (same as implement-issue):**
```
├─ 📄 product-guidelines/02-tech-stack.md (ALWAYS)
├─ 📄 product-guidelines/06-design-system.md (if UI work)
├─ 📄 product-guidelines/07-database-schema.md (if database work)
└─ 📄 product-guidelines/08-api-contracts.md (if API work)
```

**Purpose:** Create detailed implementation plan for GitHub issue.

---

### `/review-code`
**Reads:**
```
├─ 📄 product-guidelines/02-tech-stack.md
├─ 📋 product-guidelines/02b-coding-standards-essentials.md
└─ Changed files in current git diff
```

**Purpose:** Guide code review with comprehensive framework.

---

## Essentials Files: Token Optimization Strategy

**Files WITH essentials versions:**
- `01-product-strategy-essentials.md` (65% reduction)
- `02b-coding-standards-essentials.md` (70% reduction)
- `07-database-schema-essentials.md` (56% reduction)
- `08-api-contracts-essentials.md` (80% reduction)
- `09-test-strategy-essentials.md` (66% reduction)
- `09b-application-architecture-essentials.md` (60% reduction)

**Files WITHOUT essentials versions:**
- `05-brand-strategy.md` - Only read by post-cascade extensions needing full context
- `06-design-system.md` - Only read by post-cascade/dev-time needing full component specs, template already small (1.7KB)

**When to use essentials vs full:**

**Use essentials when:**
- Session 10 (backlog) or Session 12 (scaffold) reads it
- File is large with detailed specs/examples
- High-level structure sufficient (table list, endpoint list, service signatures)
- Token reduction critical for cascade performance

**Use full file when:**
- Session 3 (tech-stack) needs market analysis from product strategy
- Sessions 5/6 (brand/design) need positioning and personality
- Dev commands (implement-issue) need indexes, validation rules, error codes
- Post-cascade extensions need complete context

---

## Impact Analysis: Changing an Output

### If you modify `00-user-journey.md`:
**Direct impact:**
- ✅ Session 2 (product-strategy)
- ✅ Session 3 (tech-stack)
- ✅ Session 3b (coding-standards)
- ✅ Session 4 (generate-strategy)
- ✅ Session 5 (brand-strategy)
- ✅ Session 6 (create-design)
- ✅ Session 7 (database-schema)
- ✅ Session 8 (api-contracts)
- ✅ Session 9 (test-strategy)
- ✅ Session 9b (model-application)
- ✅ Session 10 (backlog)
- ✅ Session 12 (scaffold)

**Cascade impact:** Essentially everything (journey is foundation)

**Action:** Regenerate ALL subsequent sessions

---

### If you modify `02-tech-stack.md`:
**Direct impact:**
- ✅ Session 3b (coding-standards) - needs framework choices
- ✅ Session 4 (generate-strategy) - architecture depends on tech
- ✅ Session 7 (database-schema) - ORM/migration tool choice
- ✅ Session 8 (api-contracts) - API framework patterns
- ✅ Session 9 (test-strategy) - testing frameworks
- ✅ Session 9b (model-application) - framework-specific patterns
- ✅ Session 10 (backlog) - technical approach in stories
- ✅ Session 12 (scaffold) - languages/frameworks to scaffold
- ✅ Session 13 (deployment) - what to deploy

**Cascade impact:** Moderate-to-high (affects technical implementation)

**Action:** Regenerate Sessions 3b, 4, 7-14

---

### If you modify `07-database-schema.md`:
**Direct impact:**
- ✅ Session 8 (api-contracts) - depends on database structure
- ✅ Session 9 (test-strategy) - database testing patterns
- ✅ Session 9b (model-application) - entity/repository modeling
- ✅ Session 10 (backlog) - data model references
- ✅ Session 12 (scaffold) - entity classes, migrations

**Cascade impact:** Moderate (affects data layer and above)

**Action:** Regenerate Sessions 8-12

---

### If you modify `05-brand-strategy.md`:
**Direct impact:**
- ✅ Session 6 (create-design) - brand personality → design decisions
- ✅ Post-cascade: discover-naming, define-messaging, design-brand-identity, design-user-experience

**Cascade impact:** Low (NOT read by Sessions 10-14)

**Action:** Regenerate Session 6 and related post-cascade extensions only

---

### If you modify `09b-application-architecture.md`:
**Direct impact:**
- ✅ Session 10 (backlog) - service/method implementation stories
- ✅ Session 12 (scaffold) - code skeleton generation

**Cascade impact:** Low (affects story granularity and code structure)

**Action:** Regenerate Sessions 10, 12

---

## Dependency Verification Checklist

When adding a new session or modifying an existing one:

1. **Identify inputs:**
   - [ ] Which previous outputs does this session need?
   - [ ] Do I need full files or essentials versions?
   - [ ] What template(s) provide output structure?

2. **Verify essentials usage:**
   - [ ] If reading 01, 02b, 07, 08, 09, 09b → use essentials if available
   - [ ] Exception: Session 3 reads full 01 (needs market analysis)
   - [ ] Exception: Dev commands read full files (need implementation details)

3. **Document downstream impact:**
   - [ ] Which sessions read MY output?
   - [ ] Do I need to create an essentials version?
   - [ ] Which sections are critical for downstream consumers?

4. **Update this document:**
   - [ ] Add session to appropriate section
   - [ ] List all inputs with 📄/📋 notation
   - [ ] Document why essentials vs full
   - [ ] Add to impact analysis section

5. **Test cascade flow:**
   - [ ] Does session generate journey-specific output?
   - [ ] Can downstream sessions consume my output?
   - [ ] Are token counts reasonable with essentials files?

---

## Token Budget Reference

Essentials files target **30-80% reduction** from full versions:

| File | Full Size | Essentials Size | Reduction | Primary Consumers |
|------|-----------|----------------|-----------|-------------------|
| 01-product-strategy | ~12KB | ~4KB | 65% | Sessions 4, 10, 12 |
| 02b-coding-standards | ~15KB | ~4.5KB | 70% | Sessions 4, 9b, 10, 12 |
| 07-database-schema | ~18KB | ~8KB | 56% | Sessions 8, 9, 9b, 10, 12 |
| 08-api-contracts | ~20KB | ~4KB | 80% | Sessions 9, 9b, 10, 12 |
| 09-test-strategy | ~12KB | ~4KB | 66% | Sessions 10, 12 |
| 09b-application-architecture | ~15KB | ~6KB | 60% | Sessions 10, 12 |

**Total savings in Session 10 (backlog):** ~40KB → ~15KB (62% reduction)
**Total savings in Session 12 (scaffold):** ~35KB → ~12KB (66% reduction)

---

## Quick Reference: Sacred Cascade Order

```
1  → refine-journey           00-user-journey.md
2  → create-product-strategy  01-product-strategy.md + essentials
3  → choose-tech-stack        02-tech-stack.md
3b → define-coding-standards  02b-coding-standards.md + essentials
4  → generate-strategy        03-mission, 04-metrics/monetization/architecture
5  → create-brand-strategy    05-brand-strategy.md
6  → create-design            06-design-system.md
7  → design-database-schema   07-database-schema.md + essentials
8  → generate-api-contracts   08-api-contracts.md + essentials
9  → create-test-strategy     09-test-strategy.md + essentials
9b → model-application        09b-application-architecture.md + essentials
10 → generate-backlog         10-backlog/
11 → create-gh-issues         (GitHub issues)
12 → scaffold-project         12-project-scaffold.md + code files
13 → plan-deployment          13-deployment-plan.md
14 → design-observability     14-observability-strategy.md
```

**Never skip sessions.** Each session reads outputs from previous sessions for context and coherence.

---

**Last Updated:** 2026-01-19
**Version:** 1.0
