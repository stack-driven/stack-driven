# Stack-Driven: AI Product Development Powerhouse

> **Mission**: A cascading system where AI analyzes your user journey and derives optimal decisions for your product—from strategy to shipped code.

**License:** Apache License 2.0 - See the `LICENSE` file for details.

---

## What's New in v2.0?

**v2.0** transforms Stack-Driven from a prescriptive template collection into a **generative cascade**—AI analyzes YOUR specific user journey and recommends the optimal stack, strategy, and architecture for your needs (not generic templates).

Previous versions prescribed "use Next.js, FastAPI, and PostgreSQL" for everyone. v2.0 says "tell me about your users, and I'll recommend the optimal stack for YOUR journey."

---

## What is Stack-Driven?

Stack-Driven is a comprehensive framework for building products the right way:

1. **Start with user experience** (the post-modern axiom)
2. **Let strategic decisions flow from user value**
3. **Derive technology choices from journey requirements**
4. **Generate a complete product strategy in 3-5 hours**

This isn't just a prompt collection—it's a complete product development system that guides you through **14 progressive sessions**, each building on previous outputs, to go from idea to production-ready system.

---

## User Experience is the Core of Every Product.

Everything flows from the user journey:
- Your mission → Promise to deliver value at a specific journey step
- Your metrics → Measure progress through the journey
- Your monetization → Charge where value is delivered
- Your tech stack → Optimize critical journey steps
- Your architecture → Enable journey optimization

**Start with the user, and everything else follows.**

---

## The Cascade

Stack-Driven guides you through **14 progressive sessions**, each building on previous outputs:

```
Session 1: /refine-journey             → product-guidelines/00-user-journey.md
  ↓ (AI reads journey, validates with market)

Session 2: /create-product-strategy     → product-guidelines/01-product-strategy.md
  ↓ (AI reads journey + strategy, documents constraints)

Session 2a: /document-constraints     → product-guidelines/02a-constraints.md
                                        product-guidelines/02a-constraints.ctx.md
  ↓ (AI reads journey + strategy + constraints, chooses tech)

Session 3: /choose-tech-stack          → product-guidelines/02-tech-stack.md
  ↓ (AI reads journey + strategy + tech, defines coding standards)

Session 3b: /define-coding-standards  → product-guidelines/02b-coding-standards.md
                                       product-guidelines/02b-coding-standards.ctx.md
  ↓ (AI reads all previous + standards, defines AI strategy if AI in stack)

Session 3c: /define-ai-integration-strategy → product-guidelines/02c-ai-integration-strategy.md
                                              product-guidelines/02c-ai-integration-strategy.ctx.md
  ↓ (AI reads all previous + AI strategy, derives tactics)

Session 4: /generate-strategy          → product-guidelines/03a-mission.md
                                        product-guidelines/03b-metrics.md
                                        product-guidelines/03c-monetization.md
                                        product-guidelines/04-architecture.md
  ↓ (AI reads all previous, creates brand strategy)

Session 5: /create-brand-strategy      → product-guidelines/05-brand-strategy.md
  ↓ (AI reads brand strategy, creates design system)

Session 6: /create-design               → product-guidelines/06-design-system.md
  ↓ (AI reads all previous, designs technical specs)

Session 7: /design-database-schema     → product-guidelines/07-database-schema.md
  ↓ (AI reads schema, designs high-level API architecture)

Session 8: /generate-api-design        → product-guidelines/08-api-design.md
                                         product-guidelines/08-api-design.ctx.md
  ↓ (AI reads API design, generates detailed contracts)

Session 8b: /generate-api-contracts    → product-guidelines/08b-api-contracts.md
                                         product-guidelines/08b-api-contracts.ctx.md
  ↓ (AI reads contracts, defines testing strategy)

Session 9: /create-test-strategy       → product-guidelines/09-test-strategy.md
  ↓ (AI reads tech stack, architecture, schemas, and APIs to model application)

Session 9b: /model-application         → product-guidelines/09b-application-architecture.md
                                        product-guidelines/09b-application-architecture.ctx.md
  ↓ (AI reads everything including architecture, generates backlog)

Session 10: /generate-backlog          → product-guidelines/10-backlog/
  ↓ (Push to GitHub)

Session 11: /create-gh-issues          → GitHub issues
  ↓ (Generate working development environment)

Session 12: /scaffold-project          → product-guidelines/12-project-scaffold.md
                                        product-guidelines/12-project-scaffold/ (config files)
                                        + Code skeletons in repository root (from Session 9b)
  ↓ (Plan deployment strategy)

Session 13: /plan-deployment           → product-guidelines/13-deployment-plan.md
  ↓ (Design observability)

Session 14: /design-observability      → product-guidelines/14-observability-strategy.md
```

**In 14 sessions** (8-10 hours total), you go from idea to production-ready system with technical specifications, deployment and monitoring strategy.

---

## Quick Start

### 1. Check Your Status

```bash
/cascade-status
```

See where you are in the cascade and what to do next.

### 2. Start the Cascade

**Option A: Automated Execution** (Recommended for continuous flow)

```bash
/run-cascade
```

I'll automatically execute sessions sequentially from your current progress point, pausing at major milestones for your review. Perfect for making rapid progress through the framework.

**Option B: Manual Step-by-Step** (Recommended for learning)

```bash
/refine-journey
```

I'll ask questions about your users, their problems, and their journey. Through progressive interrogation, we'll map your complete user flow. After each session, you manually run the next command.

### 3. Follow the Flow

After each session, I'll tell you exactly what to run next:
- `/create-product-strategy` - Validates journey with market analysis and competitive positioning
- `/choose-tech-stack` - Analyzes your journey and strategy, recommends optimal tech
- `/define-coding-standards` - Defines framework-specific coding patterns and conventions
- `/generate-strategy` - Derives mission, metrics, monetization, architecture
- `/design-database-schema` - Designs complete database schema with ERD and migrations
- `/generate-api-contracts` - Generates OpenAPI specs and endpoint definitions
- `/create-test-strategy` - Defines comprehensive testing strategy (unit, integration, E2E)
- `/generate-backlog` - Generates 30-50 prioritized user stories informed by technical specs
- `/create-gh-issues` - Pushes backlog to GitHub
- `/scaffold-project` - Generates working development environment with config files and code skeletons (services, repositories, controllers, tests from Session 9b architecture)
- `/plan-deployment` - Creates deployment strategy with CI/CD and environments
- `/design-observability` - Designs monitoring, alerting, and SLO strategy

### 4. Build

Your production-ready system is ready with database schema, API contracts, testing strategy, package configs, Docker Compose, CI/CD pipeline, code skeletons with method signatures, deployment strategy, observability setup, and documentation. The generated code includes service classes, repository interfaces, controllers, test stubs, and dependency injection—all referencing your backlog stories via TODO comments. Start implementing immediately.

**Total time**: 8-10 hours to go from idea to production-ready system with complete technical specifications.

---

## Command Categories

Stack-Driven commands fall into two distinct phases:

### Phase 1: Cascade Commands (Product Guidelines Creation)

**Purpose**: Transform user journey into complete product strategy and technical specifications.

**When to use**: Before writing any implementation code. Generate `product-guidelines/` directory with strategic and technical decisions.

**Core Cascade Sessions** (Sequential execution):
- `/refine-journey` - Session 1: Define user journey through progressive interrogation
- `/create-product-strategy` - Session 2: Market validation and competitive positioning
- `/document-constraints` - Session 2a: Document business, technical, organizational constraints
- `/choose-tech-stack` - Session 3: AI analyzes journey and recommends optimal tech stack
- `/define-coding-standards` - Session 3b: Framework-specific patterns and file organization
- `/define-ai-integration-strategy` - Session 3c: AI provider, model, and pattern choices (optional)
- `/generate-strategy` - Session 4: Derive mission, metrics, monetization, architecture from journey
- `/create-brand-strategy` - Session 5: Brand positioning, personality, voice guidelines
- `/create-design` - Session 6: Design system with components for specific user flows
- `/design-database-schema` - Session 7: Complete database schema with ERD and migrations
- `/generate-api-design` - Session 8: High-level API architectural decisions
- `/generate-api-contracts` - Session 8b: Detailed OpenAPI specs and endpoint definitions
- `/create-test-strategy` - Session 9: Comprehensive testing strategy (unit, integration, E2E)
- `/model-application` - Session 9b: Model application architecture (services, repositories, controllers)
- `/generate-backlog` - Session 10: Generate 30-50 prioritized user stories with RICE scores
- `/create-gh-issues` - Session 11: Push backlog to GitHub as issues
- `/scaffold-project` - Session 12: Generate working dev environment with config files and code skeletons
- `/plan-deployment` - Session 13: Create deployment strategy with CI/CD and environments
- `/design-observability` - Session 14: Design monitoring, alerting, and SLO strategy

**Meta Commands**:
- `/cascade-status` - Check progress and see which session to run next
- `/run-cascade` - Execute cascade automatically from current progress point
- `/validate-outputs` - Quality assurance check for all product-guidelines files

**Post-Cascade Extensions** (Optional deep-dives, run after completing core cascade):
- `/design-user-experience` - Detailed UX research, flows, wireframes, interaction specs
- `/discover-naming` - Generate and evaluate brand name candidates
- `/design-growth-strategy` - Growth loops, acquisition channels, experiments
- `/define-messaging` - Brand messaging framework and voice guidelines
- `/create-content-guidelines` - Content style guide and microcopy patterns
- `/create-design-identity` - Comprehensive brand identity (logo, visual system)
- `/setup-analytics` - Detailed analytics implementation plan
- `/create-financial-model` - Unit economics, revenue projections, scenario planning

**Time Investment**: 8-10 hours for core cascade (Sessions 1-14)

**Output**: Complete `product-guidelines/` directory with strategy, tech specs, backlog, and scaffold

---

### Phase 2: Development Commands (Implementation After Guidelines)

**Purpose**: Implement features based on completed product guidelines.

**When to use**: After completing core cascade (Sessions 1-14). You now have technical specifications to reference.

**Issue Planning & Implementation**:
- `/plan-issue [issue-number]` - Fetch GitHub issue, load relevant product-guidelines (.ctx.md files), create detailed implementation plan
- `/implement-issue [issue-number]` - Fetch approved plan from issue comments, create branch, implement following plan, create PR

**Code Review**:
- `/review-code` - Guide code review with comprehensive framework

**Documentation Maintenance**:
- `/update-claudemd` - Automatically update CLAUDE.md based on recent code changes

**GitHub Workflows** (Used by implementation commands):
- `gh issue view [number]` - Fetch issue details
- `gh issue comment [number]` - Post implementation plan to issue
- `gh pr create` - Create pull request linking to issue
- `gh pr checks` - Monitor CI/CD pipeline status

**How Implementation Works**:
1. Run `/plan-issue 42` → Claude reads issue, loads relevant `.ctx.md` files (tech-stack, coding-standards, api-contracts, database-schema), generates implementation plan
2. Plan posted to issue as comment for approval
3. Run `/implement-issue 42` → Claude reads approved plan, creates branch `42-issue-slug`, implements code following plan, commits with "feat: description (closes #42)", creates PR
4. CI/CD runs tests, you merge when green

**Key Difference from Phase 1**:
- **Phase 1**: Generates strategy/specs → Creates `product-guidelines/` directory
- **Phase 2**: Implements features → Modifies repository code files (src/, api/, etc.)

**Context Files (.ctx.md)**:
Implementation commands read `.ctx.md` versions for token efficiency:
- `02-tech-stack.ctx.md` - Tech choices
- `02b-coding-standards.ctx.md` - Framework patterns
- `04-architecture.ctx.md` - System design
- `06-design-system.ctx.md` - UI components (for frontend work)
- `07-database-schema.ctx.md` - Database schema (for backend work)
- `08-api-design.ctx.md` - API patterns
- `08b-api-contracts.ctx.md` - Endpoint specs
- `09b-application-architecture.ctx.md` - Service/repository signatures

**Time Investment**: Depends on issue complexity (30 mins - 4 hours per issue)

---

## Repository Structure

### `/product-guidelines/` - YOUR Generated Strategy

**This is gitignored** - each user generates their own cascade:
```
product-guidelines/
├── 00-user-journey.md (Session 1)
├── 01-product-strategy.md (Session 2)
├── 01-product-strategy.ctx.md (Session 2)
├── 02a-constraints.md (Session 2a)
├── 02a-constraints.ctx.md (Session 2a)
├── 02-tech-stack.md (Session 3)
├── 02b-coding-standards.md (Session 3b)
├── 02b-coding-standards.ctx.md (Session 3b)
├── 03a-mission.md (Session 4)
├── 03b-metrics.md (Session 4)
├── 03c-monetization.md (Session 4)
├── 04-architecture.md (Session 4)
├── 05-brand-strategy.md (Session 5)
├── 06-design-system.md (Session 6)
├── 07-database-schema.md (Session 7)
├── 08-api-design.md (Session 8)
├── 08-api-design.ctx.md (Session 8)
├── 08b-api-contracts.md (Session 8b)
├── 08b-api-contracts.ctx.md (Session 8b)
├── 09-test-strategy.md (Session 9)
├── 10-backlog/ (Session 10)
├── 12-project-scaffold/ (Session 12 - actual code files)
│   ├── 12-project-scaffold.md (decisions documentation)
│   ├── package.json (or pyproject.toml)
│   ├── docker-compose.yml
│   ├── .env.template
│   ├── .github/workflows/ci.yml
│   └── README.md (setup instructions)
├── 13-deployment-plan.md (Session 13)
└── 14-observability-strategy.md (Session 14)
```

### `/examples/` - Reference Implementations (Coming Soon)

**Future examples** will demonstrate how different journeys lead to different tech stacks. These will be added as the framework matures.

### `/.claude/commands/` - The Cascade Commands

The slash commands that power the cascade (34 total). These prompt AI to read previous outputs and generate next steps.

### `/templates/` - Blank Starting Points

Used by slash commands to generate your outputs. You don't edit these directly.


---

## Context Files (.ctx.md) - AI-Optimized Cascade Inputs

**Every session (1-9b) generates TWO versions** of output files:

1. **Source file (.md)** - Complete documentation for humans
   - Full specifications with rationale
   - "What We DIDN'T Choose" sections explaining alternatives
   - Detailed examples and explanations
   - Used for stakeholder communication and understanding "why"

2. **Context file (.ctx.md)** - Condensed version for AI consumption
   - 60-70% token reduction
   - Keeps ALL critical decisions, configurations, and technical specs
   - Removes rationale, alternatives considered, and detailed explanations
   - Optimized for cascade sessions that need facts, not reasoning

### Universal Rule: When Context Files Exist

**ALL sessions 1-9b create .ctx.md files** (inputs to cascade):
- `00-user-journey.ctx.md` - Journey steps and value quantification (CRITICAL: never remove)
- `01-product-strategy.ctx.md` - Vision, goals, positioning
- `02-tech-stack.ctx.md` - Tech choices with 1-2 line justifications
- `02a-constraints.ctx.md` - Technical, business, organizational constraints
- `02b-coding-standards.ctx.md` - Framework patterns, file organization
- `02c-ai-integration-strategy.ctx.md` - AI provider, model, pattern choices (optional session)
- `03a-mission.ctx.md` - Mission statement, vision, principles
- `03b-metrics.ctx.md` - Metric names, targets, measurement approach
- `03c-monetization.ctx.md` - Pricing model, tiers, value alignment
- `04-architecture.ctx.md` - Architectural decisions, patterns, services
- `05-brand-strategy.ctx.md` - Brand positioning, personality, voice guidelines
- `06-design-system.ctx.md` - Design specs: colors, typography, components, tokens
- `07-database-schema.ctx.md` - Table names, relationships, indexes, constraints
- `08-api-design.ctx.md` - API paradigm, serialization, auth method
- `08b-api-contracts.ctx.md` - Endpoint lists, methods, key parameters
- `09-test-strategy.ctx.md` - Coverage targets, testing tools
- `09b-application-architecture.ctx.md` - Service/repository method signatures

**NO .ctx.md files for final outputs** (sessions 10-14):
- `10-backlog/` stories - User stories are already concise
- `12-project-scaffold.md` - Final scaffold documentation
- `13-deployment-plan.md` - Final deployment plan
- `14-observability-strategy.md` - Final observability strategy

### How Context Files Work

Context files are automatically generated by the **distillation sub-agent** at the end of each session:

```
Session completes → Writes full .md file → Invokes distillation agent → Generates .ctx.md file
```

The agent applies universal extraction rules with **critical preservation guarantees**:

**KEEP (Never Remove):**
- ALL architectural decisions and system design choices
- ALL user journey steps with value quantification
- ALL tech stack choices with 1-2 line justifications
- ALL design system specifications (components, tokens, patterns)
- ALL constraints and requirements
- ALL database schema decisions (tables, relationships, indexes)
- ALL API specifications (endpoints, methods, key parameters)
- Decisions, configurations, technical specifications, method signatures

**REMOVE (Compress Aggressively):**
- Rationale and "why we chose" explanations (keep 1-2 line summaries only)
- Alternatives considered and "What We DIDN'T Choose" sections
- Detailed examples and tutorials
- Validation checklists and quality criteria
- Market research and competitive analysis prose

### Token Savings Impact

**Session 10 (/generate-backlog)** - The critical session:
- **Before:** Reads full .md files (~40K tokens)
- **After:** Reads .ctx.md files (~15K tokens)
- **Reduction:** 62% token savings = faster execution + lower costs

**Session 12 (/scaffold-project)**:
- **Before:** ~35K tokens
- **After:** ~12K tokens
- **Reduction:** 65% token savings

### When to Read Which Version?

**Simple Rule:** Sessions ALWAYS read `.ctx.md` when available (Sessions 1-9b).

**Read .ctx.md (Default for Cascade):**
- ALL cascade sessions building on previous decisions (Sessions 2-14)
- Dev commands loading technical specs (/plan-issue, /implement-issue)
- Need decisions only, not "why" (configuration, not explanation)
- Maximum token efficiency for performance

**Read full .md (Exception Cases Only):**
- User explicitly asks to review or explain decisions
- Validation/quality checks (/validate-outputs needs rationale)
- Understanding "why" for plan challenges or design reviews
- Manual human review

**See CLAUDE.md** for complete decision matrix showing exactly which file version each session reads.

---

## Key Principles

### 1. User Journey First

Everything flows from understanding users:
- Not "I want to build X technology"
- But "Users struggle with Y problem, here's their journey..."

### 2. Cascading Decisions

Each session builds on previous outputs:
- Journey → Tech Stack (requirements drive choices)
- Journey + Tech → Strategy (mission, metrics, monetization)
- Journey + Strategy → Design (components for specific flows)
- Everything → Backlog (stories that deliver journey value)

### 3. Generative, Not Prescriptive

We don't prescribe Next.js. We:
1. Analyze your journey requirements
2. Evaluate technology options
3. Recommend best fit with reasoning
4. Explain trade-offs

### 4. Traced to Value

Every decision references user value:
- Tech choice? Serves journey step X
- Feature priority? Improves metric Y
- Design decision? Reduces friction at step Z

### 5. Self-Documenting

At any point, run `/cascade-status` to see:
- What you've completed
- What comes next
- How sessions connect

---

## The Flow

```
1. USER JOURNEY (/refine-journey)
   ↓
   What problem are we solving for whom?

2. PRODUCT STRATEGY (/create-product-strategy)
   ↓
   Market validation: TAM/SAM/SOM, competitive analysis
   Strategic positioning: Vision, goals, roadmap

3. TECH STACK (/choose-tech-stack)
   ↓
   What technologies best serve the journey and strategy?

4. TACTICS (/generate-strategy)
   ↓
   Mission: What outcome do we promise?
   Metrics: How do we measure success?
   Monetization: How do we charge for value?
   Architecture: What patterns enable scale?

5. BRAND (/create-brand-strategy)
   ↓
   How do we express journey value?

6. DESIGN (/create-design)
   ↓
   What components serve specific user flows?

7. BACKLOG (/generate-backlog)
   ↓
   What do we build first?

8. GITHUB (/create-gh-issues)
   ↓
   Ship features aligned with strategy

9. SCAFFOLD (/scaffold-project)
   ↓
   Generate working development environment

10. DEPLOYMENT (/plan-deployment)
    ↓
    How do we ship reliably?

11. OBSERVABILITY (/design-observability)
    ↓
    How do we monitor and maintain?
```

---

## Use Cases

### Startup Founders
Get a complete product development framework without hiring a CPO, CTO, and Head of Design. In 3-5 hours.

### Product Teams
Align on strategy before building. Use as shared decision-making framework.

### Solo Developers
Ship products that feel like they were built by a full team.

### AI Coding Agents
Reference generated strategy files to make decisions aligned with your product vision.

### Engineering Teams
Understand the "why" behind architectural decisions. Maintain coherence as you scale.

---

---

## Philosophy

### We Believe:

- **User experience is the foundation** (not technology)
- **Journey dictates stack** (not generic "best practices")
- **Every decision traces to value** (no arbitrary choices)
- **Boring is beautiful** (proven tech > exotic tech)
- **Generative > Prescriptive** (analyze → recommend, don't dictate)
- **Simple execution** (5-6 clear sessions, not 50 fragmented tasks)
- **Focus is the ultimate advantage** (say no often)

### We Reject:

- **One-size-fits-all stacks** (Next.js isn't always the answer)
- **Feature-first thinking** (builds what's interesting, not valuable)
- **Resume-driven development** (Kubernetes because it's trendy)
- **Technology-first thinking** (choosing tech before understanding users)
- **Build-it-all syndrome** (can't say no to features)

---

## Real-World Results

**After completing the cascade, you have**:

**Strategic Foundation**:
- Mission statement (derived from journey aha moment)
- North Star metric (measures mission fulfillment)
- Pricing strategy (aligned with value delivery)

**Technical Decisions**:
- Tech stack (optimized for YOUR requirements)
- Architecture principles (journey-optimized)
- Design system (components for your specific flows)

**Execution Backlog**:
- 30-50 user stories (prioritized with RICE)
- Every story traced to journey step
- Dependencies mapped
- Ready for GitHub

**Development Environment**:
- Complete project scaffold (monorepo or single-repo)
- Package manager configs (package.json / pyproject.toml)
- Docker Compose for local development
- CI/CD pipeline (GitHub Actions)
- Environment configuration templates
- Setup documentation

**Production Readiness**:
- Deployment strategy (environments, CI/CD, rollout)
- Observability strategy (metrics, logs, traces, SLOs)
- Incident response procedures
- Rollback and recovery plans

**Time investment**: 6-8 hours
**Output**: Production-ready system from idea to deployment + monitoring
**Approach**: Generative (analyzed), not templated (copy-pasted)

---

## Frequently Asked Questions

### "Is this just templates?"

No. Templates are static. The cascade is **generative**:
- I ask questions about YOUR users
- I analyze YOUR journey requirements
- I recommend optimal tech for YOUR needs
- I derive strategy from YOUR journey

Same cascade, different journeys → different outputs.

### "What if I disagree with a recommendation?"

The cascade shows reasoning for every decision:
- "I chose X because your journey requires Y"
- You can override any choice
- Run sessions again to regenerate with new constraints

### "Can I use my own tech stack?"

Yes! In Session 2 (/choose-tech-stack), you can:
- Specify team expertise ("we know Python")
- Note constraints ("must use AWS")
- I'll adapt recommendations to your context

### "Do I have to do all 11 sessions?"

Sessions 1-4 are critical (journey → strategy → stack → tactics).
Sessions 5-7 are highly valuable (brand → design → backlog).
Session 8 is convenience (push to GitHub).
Session 9 bridges strategy to code (scaffold dev environment).
Sessions 10-11 are essential for production (deployment + observability).

Minimum viable cascade: Sessions 1-4 (2-3 hours).
Complete core cascade: Sessions 1-11 (6-8 hours).

---

## Getting Started

```bash
# 1. Check your cascade status
/cascade-status

# 2. Start Session 1 (define your user journey)
/refine-journey

# 3. Follow the cascade (each session tells you what's next)
# /create-product-strategy
# /choose-tech-stack
# /generate-strategy
# /create-brand-strategy
# /create-design
# /generate-backlog
# /create-gh-issues
# /scaffold-project
# /plan-deployment
# /design-observability

# 4. Copy scaffold files, set up CI/CD, implement monitoring, and start building!
```

**Ready?** → Run `/cascade-status` to check your progress, or `/run-cascade` to execute the framework automatically.

---

## Contributing

We welcome contributions that:
- Improve cascade prompts and decision frameworks
- Enhance documentation

**Guidelines:**
1. Maintain the user-first philosophy
2. Keep the generative (not prescriptive) approach
3. Always trace decisions to user journey
4. Provide clear reasoning for recommendations

---

## Documentation

- **README.md** (this file): Overview, quick start, philosophy
- **CLAUDE.md**: Detailed codebase instructions for Claude Code
- **CASCADE-DEPENDENCIES.md**: Visual dependency map showing which sessions read which files
- **COMMAND-REFERENCE.md**: Complete slash command documentation

## Community & Support

- **Getting Help**: Start with `/cascade-status` to check your progress
- **Issues**: Found a bug or unclear prompt? Open an issue
- **Discussions**: Share your cascade results

---

## Why This Exists

Most product teams struggle with:
- Starting with technology instead of user needs
- Losing strategic clarity as they build
- Inconsistent decision-making
- Generic advice that doesn't fit their specific context

**Stack-Driven solves this** by providing:
- Clear starting point (user journey)
- AI-guided analysis (generative cascade)
- Opinionated recommendations (with reasoning)
- Complete strategy (in 3-5 hours)
- Execution backlog (ready for development)

**Result**: Products that feel intentional, not accidental.

---

**Last Updated**: 2025-11-10
**Version**: 2.0.0
**License**: Apache 2.0

---

**Remember**: The best products start with understanding users, not choosing frameworks.

**Start your cascade** → Run `/cascade-status`
