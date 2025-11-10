# Stack-Driven v2.0: Generative Product Development

> **Mission**: A cascading system where AI analyzes your user journey and derives optimal decisions - not prescriptive templates, but generative strategy.

**License:** Apache License 2.0 - See the `LICENSE` file for details.

---

## What Changed in v2.0?

**v1.0 (Old)**: "Use Next.js, FastAPI, and PostgreSQL"
**v2.0 (New)**: "Tell me about your users, and I'll recommend the optimal stack for YOUR journey"

Stack-Driven is now a **generative cascade** - each session builds upon previous outputs, deriving decisions from your specific user journey rather than prescribing generic solutions.

---

## The Core Insight

**Different user journeys require different solutions.**

- A real-time multiplayer game needs different tech than a compliance SaaS
- A mobile-first app needs different architecture than a desktop tool
- An AI-heavy workflow needs different stack than a CRUD app

**Your user journey dictates your decisions. Let it.**

---

## The Cascade

Stack-Driven guides you through **6 progressive sessions**, each building on previous outputs:

```
Session 1: /refine-journey       → output/00-user-journey.md
  ↓ (AI reads journey, analyzes requirements)

Session 2: /choose-tech-stack    → output/01-tech-stack.md
  ↓ (AI reads journey + tech, derives strategy)

Session 3: /generate-strategy    → output/02-mission.md
                                  output/03-metrics.md
                                  output/04-monetization.md
                                  output/05-architecture.md
  ↓ (AI reads all previous, creates design)

Session 4: /create-design         → output/06-design-system.md
  ↓ (AI reads everything, generates backlog)

Session 5: /generate-backlog      → output/07-backlog/
  ↓ (Push to GitHub)

Session 6: /create-gh-issues      → GitHub issues
```

**In 5-6 sessions** (3-5 hours total), you go from idea to production-ready backlog.

---

## Quick Start

### 1. Check Your Status

```bash
/cascade-status
```

See where you are in the cascade and what to do next.

### 2. Start the Cascade

```bash
/refine-journey
```

I'll ask questions about your users, their problems, and their journey. Through progressive interrogation, we'll map your complete user flow.

### 3. Follow the Flow

After each session, I'll tell you exactly what to run next:
- `/choose-tech-stack` - Analyzes your journey, recommends optimal tech
- `/generate-strategy` - Derives mission, metrics, monetization, architecture
- `/create-design` - Creates design system for your journey
- `/generate-backlog` - Generates 30-50 prioritized user stories
- `/create-gh-issues` - Pushes backlog to GitHub

### 4. Build

Your backlog is prioritized (P0/P1/P2), traced to user value, and ready for development.

**Total time**: 3-5 hours to go from idea to validated backlog.

---

## How It's Different

### Old Way (Prescriptive)
```
"Use Next.js for frontend"
"Use FastAPI for backend"
"Use PostgreSQL for database"
```
→ Same stack for everyone, regardless of needs

### New Way (Generative)
```
"Your journey requires real-time <100ms updates + mobile-first..."
→ "I recommend React Native + Node.js + Socket.io because..."

"Different journey: SEO-critical + document processing..."
→ "I recommend Next.js + FastAPI + PostgreSQL because..."
```
→ Optimal stack for YOUR journey

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

## Repository Structure

### `/examples/` - Reference Implementations

**Don't copy these** - they show the cascade in action with DIFFERENT journeys leading to DIFFERENT stacks.

```
examples/
├── README.md (explains examples)
├── compliance-saas/ (Next.js, FastAPI, PostgreSQL)
│   ├── foundation/ (journey, mission, metrics, monetization)
│   ├── stack/ (tech decisions, architecture)
│   ├── design/ (design system)
│   └── backlog/ (generated issues)
└── [future: real-time-collaboration, etc.]
```

**Use them to**: See how journey requirements drove specific tech choices.

### `/templates/` - Blank Starting Points

Used by slash commands to generate your outputs. You don't edit these directly.

### `/output/` - YOUR Generated Strategy

**This is gitignored** - each user generates their own cascade:
```
output/
├── 00-user-journey.md (Session 1)
├── 01-tech-stack.md (Session 2)
├── 02-mission.md (Session 3)
├── 03-metrics.md (Session 3)
├── 04-monetization.md (Session 3)
├── 05-architecture.md (Session 3)
├── 06-design-system.md (Session 4)
└── 07-backlog/ (Session 5)
```

### `/foundation/` & `/stack/` - Framework Guides

High-level frameworks explaining concepts. NOT prescriptive. Use as reference.

### `/.claude/commands/` - The Cascade Commands

The slash commands that power the cascade. These prompt AI to read previous outputs and generate next steps.

---

## Example: How Cascade Adapts

### Scenario 1: Compliance Document SaaS

**Journey**:
- Step 1: Upload 100-page PDF
- Step 2: Select compliance frameworks
- Step 3: AI assesses in 60 seconds
- Step 4: Review shareable report (SEO matters)

**Tech Stack Derived**:
- Frontend: Next.js (SSR for shareable reports)
- Backend: FastAPI (Python for document processing + AI)
- Database: PostgreSQL (JSONB for flexible assessment results)
- AI: Claude Sonnet (deep reasoning for compliance)

**Why This Stack**: Journey requires document processing + AI reasoning + shareable reports → Python ecosystem + SSR

### Scenario 2: Real-Time Multiplayer Game

**Journey**:
- Step 1: Join room on mobile
- Step 2: 10 players draw simultaneously
- Step 3: See changes <100ms
- Step 4: Save game replay

**Tech Stack Derived**:
- Frontend: React Native (mobile-first requirement)
- Backend: Node.js + Socket.io (real-time WebSockets)
- Database: Redis (fast state) + PostgreSQL (history)
- Hosting: Railway (WebSocket support)

**Why This Stack**: Journey requires mobile + real-time <100ms → React Native + Node.js + WebSockets

**Same framework. Different journeys. Different stacks.**

---

## Philosophy

### We Believe:

✅ **User experience is the foundation** (not technology)
✅ **Journey dictates stack** (not generic "best practices")
✅ **Every decision traces to value** (no arbitrary choices)
✅ **Boring is beautiful** (proven tech > exotic tech)
✅ **Generative > Prescriptive** (analyze → recommend, don't dictate)
✅ **Simple execution** (5-6 clear sessions, not 50 fragmented tasks)

### We Reject:

❌ **One-size-fits-all stacks** (Next.js isn't always the answer)
❌ **Feature-first thinking** (builds what's interesting, not valuable)
❌ **Resume-driven development** (Kubernetes because it's trendy)
❌ **Technology-first thinking** (choosing tech before understanding users)

---

## Real-World Results

**After completing the cascade, you have**:

📋 **Strategic Foundation**:
- Mission statement (derived from journey aha moment)
- North Star metric (measures mission fulfillment)
- Pricing strategy (aligned with value delivery)

🛠️ **Technical Decisions**:
- Tech stack (optimized for YOUR requirements)
- Architecture principles (journey-optimized)
- Design system (components for your specific flows)

🎯 **Execution Backlog**:
- 30-50 user stories (prioritized with RICE)
- Every story traced to journey step
- Dependencies mapped
- Ready for GitHub

**Time investment**: 3-5 hours
**Output**: Production-ready strategy + backlog
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

### "Do I have to do all 6 sessions?"

Sessions 1-3 are critical (journey → stack → strategy).
Sessions 4-5 are highly valuable (design → backlog).
Session 6 is convenience (push to GitHub).

Minimum viable cascade: Sessions 1-3 (1-2 hours).

---

## Getting Started

```bash
# 1. Check your cascade status
/cascade-status

# 2. Start Session 1 (define your user journey)
/refine-journey

# 3. Follow the cascade (each session tells you what's next)
# /choose-tech-stack
# /generate-strategy
# /create-design
# /generate-backlog
# /create-gh-issues

# 4. Build your product!
```

**Ready?** → Run `/cascade-status` to begin.

---

## Contributing

We welcome:
- Additional example implementations (different journeys)
- Improvements to cascade prompts
- Better decision frameworks
- Documentation enhancements

**Guidelines**:
1. Maintain generative (not prescriptive) approach
2. Always trace decisions to user journey
3. Provide clear reasoning for recommendations
4. Test cascade with diverse journey types

---

## Support & Community

- **Issues**: Found a bug or unclear prompt? Open an issue
- **Discussions**: Share your cascade results
- **Examples**: Completed a cascade? Consider contributing as example

---

## Version History

**v2.0 (Current)**: Generative cascade approach
- Removed prescriptive stack recommendations
- Added 6-session cascade flow
- Slash commands for AI-guided sessions
- Examples showing different journeys → different stacks

**v1.0**: Opinionated guidelines (prescriptive approach)

---

**Remember**: The best products start with understanding users, not choosing frameworks.

**Start your cascade** → Run `/cascade-status`

---

**Last Updated**: 2025-11-10
**Version**: 2.0.0
**License**: Apache 2.0
