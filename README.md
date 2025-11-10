# Stack-Driven: AI Product Development Powerhouse

> **Mission**: Create a curated stack of opinionated guidelines that guide product development from user journey to shipped code—elegantly integrated with agentic coding environments.

**License:** Apache License 2.0 - See the `LICENSE` file for details.

---

## What is Stack-Driven?

Stack-Driven is a comprehensive framework for building products the right way:

1. **Start with user experience** (the post-modern axiom)
2. **Let strategic decisions flow from user value**
3. **Make opinionated technology choices**
4. **Enable AI agents to make aligned decisions**

This isn't just a prompt collection—it's a complete product development system that helps you and your AI coding agents ship faster while staying true to your mission.

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

## Repository Structure

### Layer 1: Foundation (Strategic Decisions)

**Start Here** → These strategic documents guide all other decisions.

```
foundation/
├── 01-user-journey.md          ⭐ PRIMARY ENTRY POINT
├── 02-mission-statement.md      → Your promise to users
├── 03-success-metrics.md        → How you measure success
└── 04-monetization.md           → Business model aligned with value
```

**Purpose**: Establish the strategic foundation that informs every decision.

### Layer 2: Stack (Opinionated Implementation)

**Implementation Guidelines** → Concrete recommendations derived from foundation.

```
stack/
├── tech-stack.md                → Technology choices (Next.js, FastAPI, etc.)
├── integration-strategy.md      → API-first approach
├── architecture-principles.md   → Design patterns for scale
└── prioritization.md            → Making trade-offs
```

**Purpose**: Provide battle-tested patterns and guardrails for development.

### Layer 3: Prompts (Detailed Execution)

**Tactical Prompts** → AI-powered prompts for specific tasks.

```
prompts/
├── branding/                    → Brand strategy, naming, messaging
├── design/                      → Design systems, UX research
├── product/                     → Product strategy, user stories
├── technical/                   → Architecture, code review
├── operations/                  → Deployment, monitoring
└── analytics/                   → Metrics, A/B testing
```

**Purpose**: AI assistant prompts informed by foundation and stack.

### Layer 4: Context (Agentic Integration)

**Machine-Readable Context** → JSON files for AI coding agents.

```
.context/
├── README.md                    → How to use context files
├── user-journey.json            → Structured user journey
├── mission.json                 → Mission and decision criteria
├── metrics.json                 → Metrics and targets
├── monetization.json            → Pricing model and metering
├── tech-stack.json              → Approved technologies
├── architecture.json            → Architecture patterns
└── priorities.json              → Current focus areas
```

**Purpose**: Enable AI agents (Claude, Cursor, Copilot) to make decisions aligned with your strategy.

---

## Quick Start

### For Product Teams

**3-Step Process:**

1. **Define Your Foundation** (2-4 hours)
   - Work through `foundation/01-user-journey.md`
   - Complete your mission, metrics, and monetization
   - This becomes your product's north star

2. **Choose Your Stack** (1-2 hours)
   - Review `stack/tech-stack.md` recommendations
   - Customize based on your needs
   - Document decisions in `.context/`

3. **Start Building** (minutes)
   - Use prompts from `prompts/` for specific tasks
   - Feed `.context/` files to AI coding agents
   - Ship features aligned with your foundation

**Result**: Clear strategic direction + tactical execution support.

### For AI Coding Agents

**Integration Pattern:**

```markdown
## Agent Configuration

Before generating code, reference:
- User Journey: .context/user-journey.json
- Tech Stack: .context/tech-stack.json
- Architecture: .context/architecture.json
- Priorities: .context/priorities.json

Ensure every implementation:
1. Serves a user journey step
2. Uses approved technologies
3. Follows architectural patterns
4. Advances key metrics
```

**Supported Agents**: Claude Code, Cursor, GitHub Copilot, any LLM-powered tool.

---

## Key Principles

### 1. User-Centered Development
Every decision traces back to user value. If it doesn't serve a user journey step, question it.

### 2. Opinionated Yet Adaptable
We provide strong opinions (Next.js, FastAPI, PostgreSQL) but explain the "why" so you can adapt.

### 3. Strategic Before Tactical
Foundation (mission, metrics) before Stack (tech choices) before Prompts (execution).

### 4. Agentic-First
Designed for human-AI collaboration. Context files help AI agents make aligned decisions.

### 5. Dead Simple Execution
Complex strategy, simple execution. One-sentence pricing. Clear tech choices. Obvious priorities.

---

## The Flow

```
1. USER JOURNEY (foundation/01-user-journey.md)
   ↓
   What problem are we solving for whom?

2. MISSION (foundation/02-mission-statement.md)
   ↓
   What outcome do we promise to deliver?

3. METRICS (foundation/03-success-metrics.md)
   ↓
   How do we measure if we're succeeding?

4. MONETIZATION (foundation/04-monetization.md)
   ↓
   How do we charge for value delivered?

5. TECH STACK (stack/tech-stack.md)
   ↓
   What technologies best serve the journey?

6. ARCHITECTURE (stack/architecture-principles.md)
   ↓
   What patterns enable scale?

7. PRIORITIZATION (stack/prioritization.md)
   ↓
   What do we build first?

8. BUILD (prompts/ + .context/)
   ↓
   Ship features using prompts + AI agents
```

---

## Use Cases

### Startup Founders
Get a complete product development framework without hiring a CPO, CTO, and Head of Design.

### Product Teams
Align on strategy before building. Use as shared decision-making framework.

### Solo Developers
Ship products that feel like they were built by a full team.

### AI Coding Agents
Reference `.context/` files to generate code aligned with product strategy.

### Engineering Teams
Understand the "why" behind architectural decisions. Maintain coherence as you scale.

---

## Featured Resources

### Most Important Document
**[foundation/01-user-journey.md](./foundation/01-user-journey.md)**
Start here. Everything flows from understanding your users.

### Most Practical Guide
**[stack/tech-stack.md](./stack/tech-stack.md)**
Opinionated technology recommendations for modern web products.

### Most Strategic Framework
**[stack/prioritization.md](./stack/prioritization.md)**
Say "yes" to the right things and "no" to everything else.

### Most Innovative Feature
**[.context/](./.context/)**
Machine-readable context files that make AI agents strategy-aware.

---

## Examples & Templates

### Complete Example: Document Assessment SaaS

```markdown
Foundation:
- User: Compliance officers drowning in manual review
- Mission: Reduce manual review time by 90%
- Metrics: Weekly assessments completed
- Monetization: $0.10 per assessment

Stack:
- Frontend: Next.js + Tailwind
- Backend: FastAPI + PostgreSQL
- AI: Claude Sonnet for complex analysis
- Hosting: Vercel + Railway

Result:
- MVP shipped in 4 weeks
- $0-100/month operating costs
- Scales to 100K assessments/month
```

### Template Files Included

All `.context/` files are templates. Customize for your product:
- Replace `[Your Product]` with your actual product name
- Fill in metrics with real targets
- Specify your exact tech stack
- Define your current priorities

---

## Philosophy

### We Believe:

**✓ User experience is the foundation** (not technology)
**✓ Boring technology is beautiful** (proven > exciting)
**✓ Simple beats clever** (ship fast, iterate)
**✓ Metrics must matter** (vanity < actionable)
**✓ AI amplifies strategy** (agents need context)
**✓ Focus is the ultimate advantage** (say no often)

### We Reject:

**✗ Feature-first thinking** (builds what's interesting, not valuable)
**✗ Technology-first thinking** (chooses tech before understanding users)
**✗ Resume-driven development** (Kubernetes because it's cool)
**✗ Build-it-all syndrome** (can't say no to features)
**✗ AI without strategy** (agents making random decisions)

---

## Contributing

We welcome contributions that:
- Add new prompts for different disciplines
- Improve existing frameworks
- Share real-world examples
- Enhance agentic integration

**Guidelines:**
1. Maintain the user-first philosophy
2. Be opinionated but explain why
3. Provide templates and examples
4. Test with AI assistants
5. Keep it practical and actionable

---

## Community & Support

- **Documentation**: You're reading it! Start with `foundation/01-user-journey.md`
- **Issues**: Found something unclear? Open an issue
- **Discussions**: Share your experience using Stack-Driven
- **Examples**: Show us what you built!

---

## Why This Exists

Most product teams struggle with:
- Starting with technology instead of user needs
- Losing strategic clarity as they build
- Inconsistent decision-making
- AI agents that don't understand product context

**Stack-Driven solves this** by providing:
- Clear starting point (user journey)
- Strategic framework (foundation)
- Opinionated guidance (stack)
- Tactical execution (prompts)
- Agentic integration (context)

**Result**: Products that feel intentional, not accidental.

---

## Getting Started

1. **Read**: [foundation/01-user-journey.md](./foundation/01-user-journey.md)
2. **Complete**: Your foundation (user journey → mission → metrics → monetization)
3. **Customize**: `.context/` files with your specifics
4. **Build**: Use prompts + AI agents to ship
5. **Iterate**: Update context as you learn

**Ready?** → [Start with the User Journey](./foundation/01-user-journey.md)

---

## Roadmap

### v1.0 (Current)
- ✅ Complete foundation layer
- ✅ Opinionated stack guidelines
- ✅ Agentic context files
- ✅ Prompt collection

### v1.1 (Planned)
- [ ] Real-world case studies
- [ ] Video walkthroughs
- [ ] VS Code extension for context integration
- [ ] Community-contributed prompts

### v2.0 (Future)
- [ ] Multi-product strategy guidance
- [ ] Platform/marketplace patterns
- [ ] Enterprise scaling guides
- [ ] Advanced AI agent patterns

---

**Last Updated**: 2025-11-10
**Version**: 1.0.0
**License**: Apache 2.0

---

**Remember**: The best products start with understanding users, not choosing frameworks. Begin your journey → [foundation/01-user-journey.md](./foundation/01-user-journey.md)
