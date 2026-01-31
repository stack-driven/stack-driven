# Stack-Driven Label System

This repository uses a **scoped label methodology** for clear, scannable issue management.

## Label Categories

### 1. Type Labels (Exactly one per issue)
**Color: Purple (`#5843AD`)**

| Label | Description | When to Use |
|-------|-------------|-------------|
| `type::epic` | Collection of related stories | For high-level feature collections |
| `type::story` | User story delivering journey value | For user-facing features |
| `type::task` | Technical task (no direct user value) | Infrastructure, setup, refactoring |
| `type::bug` | Something broken | Defects, regressions |
| `type::spike` | Research/investigation task | POCs, technical spikes |
| `type::legal` | Legal/compliance document | Terms, Privacy Policy, DPA |
| `type::migration` | Database migration or breaking change | Schema changes, major upgrades |

---

### 2. Domain Labels (0 to many - can combine)
**Color: Blue (`#1D76DB`)**

**Core Technical:**
- `domain::frontend` - UI/UX, components, client-side
- `domain::backend` - Server-side logic, business rules
- `domain::database` - Schema, migrations, queries
- `domain::api` - API endpoints, contracts
- `domain::testing` - Test infrastructure, test cases

**Infrastructure & Operations:**
- `domain::infrastructure` - DevOps, deployment, CI/CD
- `domain::monitoring` - Observability, logging, alerting
- `domain::security` - Auth, encryption, vulnerabilities
- `domain::performance` - Optimization, caching, scaling

**Specialized:**
- `domain::integration` - Third-party API/webhook integrations
- `domain::ai` - AI/ML features, prompts, RAG
- `domain::i18n` - Internationalization, localization
- `domain::analytics` - Metrics tracking, instrumentation
- `domain::design-system` - Design components, patterns
- `domain::legal` - Compliance, legal documents
- `domain::accessibility` - a11y, WCAG compliance
- `domain::documentation` - Guides, READMEs, API docs

---

### 3. Priority Labels (Exactly one per issue)
**Color: Red spectrum (dark → light)**

| Label | Color | Description |
|-------|-------|-------------|
| `priority::p0` | Dark Red (`#B60205`) | Critical MVP blocker (must ship for launch) |
| `priority::p1` | Red-Orange (`#D93F0B`) | Important early feature (ship within 4 weeks post-MVP) |
| `priority::p2` | Orange/Yellow (`#FBCA04`) | Nice to have, deferred (backlog for later) |

---

## Label Application Rules

| Category | Cardinality | Example |
|----------|-------------|---------|
| `type::` | **Exactly 1** | `type::story` |
| `domain::` | **0 to many** | `domain::frontend` + `domain::api` |
| `priority::` | **Exactly 1** | `priority::p0` |

---

## Examples

### Full-Stack User Story
```
type::story
domain::frontend
domain::backend
domain::database
priority::p0
```

### Infrastructure Task
```
type::task
domain::infrastructure
domain::monitoring
priority::p1
```

### Legal Document
```
type::legal
domain::legal
priority::p0
```

### AI Feature with i18n
```
type::story
domain::ai
domain::i18n
domain::frontend
priority::p1
```

---

## Setup Instructions

### 1. Initial Sync (One-Time)

Apply these labels to this repository:

```bash
gh label sync --file .github/labels.yml
```

### 2. Clone to New Repos

When creating a new product repository, clone the label structure:

```bash
gh label clone bru-digital/stack-driven --repo yourorg/new-product
```

### 3. Automatic Application

The `/create-gh-issues` command automatically applies appropriate labels when generating issues from Session 10 backlog.

---

## Naming Conventions

- **All lowercase:** `type::story` not `Type::Story`
- **Double colon scope:** `category::value`
- **Hyphenated values:** `priority::p0`, `design-system`
- **Consistent prefixes:** All categories use the same pattern

---

## Philosophy

This label system follows Stack-Driven's core principles:

1. **Clarity over brevity:** `domain::integration` is clearer than `integration`
2. **Consistency:** Scoped labels prevent conflicts (e.g., `type::bug` vs `domain::bug-tracking`)
3. **Scannability:** Color-coded categories make boards visually parseable
4. **Flexibility:** Multiple domain labels allow complex cross-functional work

---

## Maintenance

- **Add labels:** Edit `.github/labels.yml`, then run `gh label sync`
- **Update descriptions:** Modify `.github/labels.yml` and sync
- **Remove labels:** Delete from `.github/labels.yml`, sync with `--force` flag

---

For questions or suggestions, open an issue with `type::task` + `domain::documentation`.
