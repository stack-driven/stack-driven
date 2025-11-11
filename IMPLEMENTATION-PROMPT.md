# Implementation Prompt for Stack-Driven Framework Issues

## Quick Context

You're implementing improvements to **Stack-Driven** - an AI-assisted product framework. A professional review scored it **8.5/10** but identified it as **"70% of a complete solution"** - brilliant at strategy, missing implementation.

**The Gap:** Framework stops at backlog. Missing: code scaffolding, database design, API contracts, testing strategy, GTM, financial modeling.

**Your Job:** Implement issues from `REVIEW-BACKLOG.md` to add the missing 30%.

---

## Core Principles (from PHILOSOPHY.md)

1. **User Experience is Core** - Every decision traces to journey
2. **Generative Cascade** - Later sessions derive from earlier ones
3. **Technology Serves Journey** - Not the other way around
4. **AI-Optimized** - Prompts detailed enough for autonomous execution

---

## Current Cascade (Sessions 1-6)

1. `/refine-journey` → User journey
2. `/choose-tech-stack` → Technology selection
3. `/generate-strategy` → Mission, metrics, monetization, architecture
4. `/create-design` → Design system
5. `/generate-backlog` → Prioritized backlog
6. `/create-gh-issues` → GitHub issues

---

## How to Implement ONE Command

### Step 1: Read the Issue
- Open `REVIEW-BACKLOG.md` and find your issue
- Understand: What's the problem? What should this generate?

### Step 2: Study Existing Commands
- Read 2-3 similar commands in `.claude/commands/`
- Match their style, depth (~200-400 lines)
- Note the structure below

### Step 3: Create Command File

**Location:** `.claude/commands/[name].md`

**Structure:**

```markdown
# Session X: [Command Name]
**Purpose:** One sentence - what this generates
**When to run:** After which session
**Time required:** Estimate

## What This Session Creates
[Detailed description + outputs]

## Inputs (What This Reads)
- `.stack-driven/00-user-journey.md` - What we extract
- `.stack-driven/01-tech-stack.md` - What we extract

## Process
### Step 1: [Action]
[Instructions + decision trees + examples]

### Step 2-4: [Continue...]

## What We DIDN'T Choose (And Why)
### [Alternative 1]
**Why not:** [Journey-based reasoning]
**When to reconsider:** [Conditions]

### [Alternative 2-3]
[Minimum 2, ideal 3-4]

## Quality Checklist
- [ ] Decisions trace to journey
- [ ] Examples included
- [ ] "What We DIDN'T Choose" complete
```

### Step 4: Create Template (Optional)
**Location:** `.claude/templates/[name].md`
- Defines output file structure
- Shows example format

### Step 5: Update Integration
- Add to `.claude/commands/cascade-status.md`
- Update `README.md`
- Create example in `examples/compliance-saas/`

---

## Key Requirements

### MUST HAVE in Every Command

1. **Journey Traceability** - Every decision references user journey
2. **Decision Trees** - For any complex choice (database, architecture, etc.)
3. **Examples** - Use compliance-saas context
4. **"What We DIDN'T Choose"** - 2-4 alternatives with reasoning
5. **Quality Checklist** - How to know it's done right

### Command Quality Standards

- **Length:** 200-400 lines (not 50, not 1000)
- **Examples:** Real, specific to compliance-saas
- **Decision trees:** 4-5 criteria with branching logic
- **Alternatives:** Each needs "When to reconsider"

---

## Common Pitfalls

❌ **Technology-first:** "Use Kubernetes"
✅ **Journey-first:** "IF >1M requests/day THEN Kubernetes ELSE Vercel"

❌ **Generic:** "Use blue color"
✅ **Traced:** "Brand = trustworthy → Blue (trust association)"

❌ **Weak alternatives:** "Didn't choose X because we chose Y"
✅ **Strong alternatives:** "X works for [scenario], but our journey has [constraint]. Reconsider if [condition]."

---

## Implementation Checklist

**For NEW commands (scaffold, database, API, testing):**
- [ ] Read backlog issue thoroughly
- [ ] Study 2-3 similar existing commands
- [ ] Create command file with structure above
- [ ] Create template if needed
- [ ] Update cascade-status
- [ ] Create compliance-saas example
- [ ] Self-review: Can AI execute this?

**For CASCADE REORDERING (brand/design flow):**
- [ ] Identify which commands read affected files
- [ ] Renumber files (e.g., `06-` → `04-`)
- [ ] Update all commands' "Reads" sections
- [ ] Update cascade-status
- [ ] Rename example files
- [ ] Update README

---

## Quick Reference: Issue Types

### Development Commands (scaffold, database, API)
- Generate **real files** (not just docs)
- Read architecture carefully
- Include setup instructions
- Example: Actual Prisma schema, not just description

### Strategy Commands (growth, financial)
- Data-driven (require numbers)
- Scenario analysis (optimistic/pessimistic)
- Tied to journey
- Example: CAC/LTV calculations with assumptions

### Validation Checkpoints
- Objective pass/fail criteria
- Require evidence (interview notes, LOIs)
- Gate framework progress
- Example: "Score ≥7/10 to proceed"

---

## Self-Review Before Committing

- [ ] Read as AI agent - can I execute unambiguously?
- [ ] Every decision has clear criteria?
- [ ] Examples for complex steps?
- [ ] "What We DIDN'T Choose" complete (2+ alternatives)?
- [ ] Maintains cascade (reads previous, writes for next)?
- [ ] Serves user journey (not just "cool tech")?

---

## Remember

You're completing the **missing 30%** of an **8.5/10 framework**. Every command should:

✅ Trace to journey
✅ Derive from previous sessions
✅ Include critical thinking
✅ Be AI-executable
✅ Generate usable outputs

**Framework mantra:** "User experience is the core. Every decision traces to journey. Technology serves users."

---

## Questions?

1. Check existing commands for patterns
2. Check `PHILOSOPHY.md` for principles
3. Check `REVIEW-BACKLOG.md` for intent
4. Default to: "Does this serve the user journey?"

Now go build. 🚀
