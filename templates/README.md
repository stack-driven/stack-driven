# Stack-Driven Templates

This directory contains template files that define the structure, validation criteria, and quality standards for cascade session outputs.

---

## Template Numbering Philosophy

### Templates That Exist

**Session 1 (Refine Journey):**
- `00-user-journey-template.md` - Output structure
- `00-user-journey-interview-template.md` - Progressive interrogation framework

**Sessions 2-9b (Core Cascade):**
- `01-product-strategy-template.md`
- `02-tech-stack-template.md`
- `02b-coding-standards-template.md`
- `03-mission-template.md`
- `04-metrics-template.md`
- `04-monetization-template.md`
- `04-architecture-template.md`
- `05-brand-strategy-template.md`
- `06-design-system-template.md`
- `07-database-schema-template.md`
- `08-api-contracts-template.md`
- `09-test-strategy-template.md`
- `09b-application-architecture-template.md`

**Sessions 13-14 (Infrastructure & Observability):**
- `13-deployment-plan-template.md`
- `14-observability-strategy-template.md`

**Post-Cascade Extensions (15-22):**
- `15-ux-research-template.md`
- `16-naming-candidates-template.md`
- `17-messaging-framework-template.md`
- `18-content-guidelines-template.md`
- `19-brand-identity-template.md`
- `20-analytics-plan-template.md`
- `21-growth-strategy-template.md`
- `22-financial-model-template.md`

### Templates That Intentionally Don't Exist

**Session 10 (Generate Backlog):**
- **No `10-backlog-template.md`**
- Reason: Generates 30-50 individual user story files, not a single document
- Instead uses: `backlog-issue-template.md` for story structure
- Output: `product-guidelines/10-backlog/` directory with `story-001.md`, `story-002.md`, etc.

**Session 11 (Create GitHub Issues):**
- **No `11-template.md`**
- Reason: Operational command that pushes Session 10 stories to GitHub via `gh` CLI
- No file output - creates GitHub issues directly
- References: Existing backlog stories from Session 10

**Session 12 (Scaffold Project):**
- **No `12-project-scaffold-template.md`**
- Reason: **Generative code creation**, not document generation
- Creates actual code files (package.json, docker-compose.yml, directory structure)
- Each tech stack requires different scaffolding (Next.js ≠ Go ≠ React Native)
- Outputs:
  - `product-guidelines/12-project-scaffold.md` - Scaffold documentation
  - Actual code files in repository root (framework-specific)
- Template would be meaningless - can't template code for unknown tech stacks

### Why "04" Appears Three Times

Session 4 (`/generate-strategy`) creates **four separate tactical foundation files**:
- `03-mission.md` - Your product's purpose and core values
- `04-metrics.md` - North Star metric and success measurements
- `04-monetization.md` - Revenue model and pricing strategy
- `04-architecture.md` - High-level technical architecture

All are created in a single session but stored as separate documents for modularity and focused reference.

---

## The Essentials File Pattern

### What Are Essentials Files?

Some sessions create TWO files:
1. **Full version** (`XX-name.md`) - Complete detailed specification
2. **Essentials version** (`XX-name-essentials.md`) - Condensed for downstream consumption

### When to Create Essentials Files

Create an essentials file when **ALL THREE** conditions are met:

1. **Read by core cascade Sessions 10 (backlog) and/or 12 (scaffold)**
2. **Full file is large** (>5KB) with extensive schemas, specs, or examples
3. **Token reduction matters** - Downstream sessions don't need every detail

### Sessions WITH Essentials Files

| Session | Full File | Essentials | Reduction | Why? |
|---------|-----------|------------|-----------|------|
| 01 | `01-product-strategy.md` | `01-product-strategy-essentials.md` | 65% | Backlog needs strategic context, not full competitive analysis |
| 02b | `02b-coding-standards.md` | `02b-coding-standards-essentials.md` | 70% | Backlog/scaffold need key standards, not every linting rule |
| 07 | `07-database-schema.md` | `07-database-schema-essentials.md` | 56% | API contracts need table relationships, not full migration SQL |
| 08 | `08-api-contracts.md` | `08-api-contracts-essentials.md` | 80% | Backlog needs endpoint list, not full OpenAPI specs |
| 09 | `09-test-strategy.md` | `09-test-strategy-essentials.md` | 66% | Scaffold needs test approach, not detailed test case examples |
| 09b | `09b-application-architecture.md` | `09b-application-architecture-essentials.md` | 60% | Scaffold needs layer structure, not every class/function |

### Sessions WITHOUT Essentials Files

**Session 05 (Brand Strategy):**
- No essentials file
- Reason: Only read by **post-cascade extensions** (discover-naming, define-messaging, design-brand-identity)
- Those commands need full brand personality, not condensed version
- Not read by Sessions 10 or 12

**Session 06 (Design System):**
- No essentials file
- Reason: Only read by **post-cascade extensions** and **dev-time commands** (plan-issue, implement-issue)
- UI implementation needs complete component specs, color tokens, spacing system
- Not read by Sessions 10 or 12
- Template already small (1.7KB) - condensing wouldn't save tokens

### How to Create Essentials Files

Essentials templates define condensed structure:
- `01-product-strategy-essentials-template.md`
- `02b-coding-standards-essentials-template.md`
- `07-database-schema-essentials-template.md`
- `08-api-contracts-essentials-template.md`
- `09-test-strategy-essentials-template.md`
- `09b-application-architecture-essentials-template.md`

Commands generate both files in the same session:
```markdown
## Steps to Execute

1. Read previous cascade outputs
2. Generate full specification
3. Write `XX-name.md`
4. Create condensed version for downstream sessions
5. Write `XX-name-essentials.md`
```

---

## Template File Naming Convention

### Standard Pattern
`[session-number]-[output-name]-template.md`

Examples:
- `00-user-journey-template.md`
- `02-tech-stack-template.md`
- `09b-application-architecture-template.md`

### Special Cases

**Interview templates:**
- `00-user-journey-interview-template.md` (used during Session 1 progressive interrogation)

**Essentials templates:**
- `[session-number]-[output-name]-essentials-template.md`
- Example: `01-product-strategy-essentials-template.md`

**Backlog story template:**
- `backlog-issue-template.md` (used by Session 10 for each user story)

---

## Template Structure

Every template should include:

### 1. Section Headings
Clear structure for output organization

### 2. Validation Criteria
What makes "excellent" vs "needs work"

### 3. Decision Rationale Sections
"What We DIDN'T Choose" for major decisions with 2+ alternatives

### 4. Journey Traceability Reminders
Prompt to reference specific user journey steps and value ratios

### 5. Specificity Examples
Show concrete examples vs generic antipatterns

### 6. Quality Standards
- Journey alignment (references specific journey steps)
- Specificity (named personas, concrete examples)
- Completeness (all sections filled)
- Technical soundness (indexes, error handling, SLOs)

---

## Common Questions

**Q: Why doesn't Session 10 have a numbered template?**
A: Session 10 generates many files (30-50 stories), not one document. Uses `backlog-issue-template.md` instead.

**Q: Why doesn't Session 12 have a template?**
A: Session 12 generates actual code files (package.json, docker-compose.yml) specific to chosen tech stack. Can't template code for unknown technologies.

**Q: When should I create an essentials file?**
A: Only when the session is read by Sessions 10/12 AND the full file is large enough that token reduction matters.

**Q: Why don't Sessions 5 and 6 have essentials files?**
A: They're only read by post-cascade extensions that need full context, not by Sessions 10/12.

**Q: Can I add a new template?**
A: Yes, but follow the cascade integration pattern:
1. Determine session number and output name
2. Define what makes output "excellent" (validation criteria)
3. Include journey traceability prompts
4. Update corresponding command to read template
5. Test with real journey (not generic example)

---

**Remember:** Templates guide structure and quality standards. They're read by commands to know what to generate, not filled in like forms. The framework is generative, not prescriptive.
