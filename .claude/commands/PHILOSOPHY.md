---
description: FRAMEWORK PHILOSOPHY - Read this first before modifying Stack-Driven
---

# Stack-Driven Framework Philosophy

**CRITICAL**: Read this before adding, modifying, or removing any commands or templates.

---

## The Core Axiom

**User Experience is the Core of Every Product.**

Everything flows FROM the user journey:
- Your mission → Promise to deliver value at a specific journey step
- Your metrics → Measure progress through the journey
- Your monetization → Charge where value is delivered
- Your tech stack → Optimize critical journey steps
- Your architecture → Enable journey optimization
- Your design → Components for specific user flows
- Your backlog → Stories that deliver journey value

**Start with the user, and everything else follows.**

This is NOT negotiable. This is NOT one option among many. This IS the framework.

---

## What We Believe

**✓ User experience is the foundation** (not technology, not branding, not market analysis)
**✓ Journey dictates stack** (not generic "best practices")
**✓ Every decision traces to value** (no arbitrary choices)
**✓ Generative > Prescriptive** (analyze → recommend, don't dictate)
**✓ Focus is the ultimate advantage** (say no often)

## What We Reject

**✗ Technology-first thinking** (choosing tech before understanding users)
**✗ Feature-first thinking** (builds what's interesting, not valuable)
**✗ One-size-fits-all stacks** (Next.js isn't always the answer)
**✗ Build-it-all syndrome** (can't say no to features)
**✗ Resume-driven development** (Kubernetes because it's trendy)

---

## The Cascade Order IS Sacred

```
Session 1: USER JOURNEY (/refine-journey)
   ↓ Everything starts here. Users first. Always.

Session 2: TECH STACK (/choose-tech-stack)
   ↓ Journey requirements → Tech recommendations

Session 3: STRATEGY (/generate-strategy)
   ↓ Journey + Tech → Mission, Metrics, Monetization, Architecture

Session 4: DESIGN (/create-design)
   ↓ Journey + Strategy → Design system

Session 5: BACKLOG (/generate-backlog)
   ↓ Journey + Everything → Prioritized user stories

Session 6: GITHUB (/create-gh-issues)
   ↓ Ship features aligned with strategy
```

**Why this order?**

Because each session READS previous outputs:
- Session 2 reads the journey to recommend tech
- Session 3 reads journey + tech to derive strategy
- Session 4 reads everything to create design
- Session 5 reads everything to generate backlog

**This is a CASCADE**: Water flows downhill. User journey is the source. Everything else flows from it.

---

## When Adding New Commands

### Ask These Questions FIRST:

1. **Does this command require understanding the user journey?**
   - If YES: It belongs AFTER Session 1 (core or post-cascade)
   - If NO: Question whether it belongs in Stack-Driven at all

2. **Does this command analyze and derive from previous outputs?**
   - If YES: Good, it follows the cascade pattern
   - If NO: It's prescriptive, not generative (wrong approach)

3. **Can you trace this command's output to specific user value?**
   - If YES: It fits the philosophy
   - If NO: It's arbitrary (wrong approach)

4. **Does this command say "do X" or "analyze journey, then recommend X or Y"?**
   - If "analyze then recommend": Good, generative
   - If "do X": Bad, prescriptive

### Examples of GOOD Commands:

**✓ `/setup-analytics` (post-cascade)**:
- Reads: Session 3 metrics (derived from journey)
- Does: Creates implementation plan for THOSE specific metrics
- Traces to: Measuring progress through the user journey
- Pattern: Generative (analyzes metrics → recommends tools)

**✓ `/design-user-experience` (post-cascade)**:
- Reads: Session 1 journey + Session 3 strategy
- Does: Creates detailed UX for THOSE specific flows
- Traces to: Optimizing specific journey steps
- Pattern: Generative (analyzes journey → designs UX)

### Examples of QUESTIONABLE Commands:

**⚠️ `/create-brand-strategy` (pre-cascade)**:
- Problem: Runs BEFORE understanding users
- Why questionable: Branding should express journey value, not precede it
- Better approach: Derive brand from journey (post Session 3?)
- Current status: Optional, but philosophically backwards

**⚠️ `/create-product-strategy` (pre-cascade)**:
- Problem: Product strategy without user journey is abstract
- Why questionable: Market analysis should validate journey, not precede it
- Better approach: Validate journey with market data (post Session 1?)
- Current status: Optional, but philosophically backwards

---

## The Pre-Cascade Problem

**Current state**: We have 4 pre-cascade commands (branding, naming, messaging, product strategy) that run BEFORE Session 1.

**The problem**: This violates the core axiom. You cannot create authentic brand strategy, messaging, or product strategy without understanding users first.

**Why they exist**: Good intentions - comprehensive planning.

**Why they're wrong**: They put the cart before the horse.

### Three Options for Pre-Cascade Commands:

**Option 1: Delete them entirely**
- Most philosophically pure
- Forces users to start with journey (as intended)
- Removes temptation to skip to "fun stuff"

**Option 2: Move them post-cascade**
- `/create-brand-strategy` becomes post-Session 3 (derive brand from mission)
- `/create-product-strategy` becomes post-Session 3 (validate strategy with market)
- Makes them journey-informed instead of journey-ignorant

**Option 3: Keep but clearly mark as "anti-pattern"**
- Useful for legacy brands with existing identity
- Document that they're exceptions, not the norm
- Always recommend starting with journey instead

**Recommendation**: Choose Option 2. Make branding and strategy commands journey-informed.

---

## How to Maintain Philosophy

### When reviewing PRs or changes:

1. **Check the cascade direction**: Does water flow uphill? (Wrong) or downhill? (Right)
2. **Check for user-centricity**: Does it reference the journey? Trace to value?
3. **Check for generative approach**: Does it analyze then recommend? Or prescribe?
4. **Check for focus**: Does it add essential value? Or feature creep?

### Red flags:

- ❌ "This command runs before understanding users"
- ❌ "This prescribes technology X for everyone"
- ❌ "This doesn't reference the user journey"
- ❌ "This is best practice regardless of context"
- ❌ "Users might want to do X first" (No. Journey first. Always.)

### Green flags:

- ✅ "This reads the journey and derives Y"
- ✅ "This adapts recommendations based on journey requirements"
- ✅ "This traces to value at journey step Z"
- ✅ "Different journeys → different outputs"
- ✅ "This is optional after core cascade completes"

---

## Real Examples from README

### Compliance Document SaaS

**Journey**: Upload PDF → Select frameworks → AI assesses (60s) → Review shareable report

**Result**: Next.js (SSR for sharing) + FastAPI (Python for docs) + PostgreSQL

**Why**: Journey requirements (document processing + AI + shareable reports) drove tech choice

### Real-Time Multiplayer Game

**Journey**: Join on mobile → 10 players draw → See changes <100ms → Save replay

**Result**: React Native (mobile) + Node.js (real-time) + Redis (fast state) + PostgreSQL (history)

**Why**: Journey requirements (mobile + real-time <100ms) drove tech choice

**Same framework. Different journeys. Different stacks.**

This is what generative means. This is what user-first means.

---

## Commands That Exemplify Philosophy

### `/refine-journey` (Session 1)
**Perfect example of philosophy**:
- Starts with "Who are your users? What's their problem?"
- NOT "What technology do you want to use?"
- NOT "What's your brand strategy?"
- Forces user-first thinking from the start

### `/choose-tech-stack` (Session 2)
**Perfect example of generative approach**:
- Reads journey requirements
- Analyzes: Real-time needs? Data complexity? SEO? Mobile?
- Recommends tech that SERVES those requirements
- NOT "Here's the best stack for everyone"

### `/generate-strategy` (Session 3)
**Perfect example of cascading**:
- Reads journey + tech
- Derives mission from journey "aha moment"
- Derives metrics from journey progress
- Derives monetization from value delivery
- NOT abstract strategy disconnected from users

---

## The Test

Before adding/changing ANY command, answer this:

**"How does this command serve the user journey?"**

- If you can answer clearly → Good
- If you have to think hard → Questionable
- If you can't answer → Wrong

**"Does this command require reading the user journey to generate output?"**

- If YES → Belongs in cascade (after Session 1)
- If NO → Probably doesn't belong in Stack-Driven

**"Would this produce different outputs for different user journeys?"**

- If YES → Generative (good)
- If NO → Prescriptive (bad)

---

## Remember

From the README:

> "Everything flows from understanding users:
> - Not 'I want to build X technology'
> - But 'Users struggle with Y problem, here's their journey...'"

> "User experience is the foundation (not technology)"

> "Journey dictates stack (not generic 'best practices')"

> "Every decision traces to value (no arbitrary choices)"

**This is not marketing copy. This is the architecture of the framework.**

---

## For the Next Agent

If you're working on Stack-Driven:

1. **Read this file first** before touching any commands
2. **Read the README** to internalize the philosophy
3. **Challenge any command** that doesn't trace to user journey
4. **Preserve the cascade order** - water flows downhill
5. **Keep it generative** - analyze → recommend, don't prescribe
6. **Stay focused** - say no to feature creep
7. **Protect the core axiom** - user journey first, always

**The framework is perfect when you can't add anything, but also can't remove anything, without breaking the philosophy.**

We're not there yet. Pre-cascade commands are a deviation. Consider fixing them.

---

## Commands by Philosophy Alignment

### ✅ EXCELLENT (Pure Philosophy):
- `/refine-journey` - Journey first
- `/choose-tech-stack` - Journey-driven tech
- `/generate-strategy` - Journey-derived strategy
- `/create-design` - Journey-optimized design
- `/generate-backlog` - Journey value stories
- `/create-gh-issues` - Ships journey value

### ✅ GOOD (Post-Cascade Extensions):
- `/setup-analytics` - Implements journey metrics
- `/design-user-experience` - Deep dive on journey flows
- `/plan-deployment` - Ships journey value faster
- `/design-observability` - Monitors journey success
- `/create-content-guidelines` - Journey-aligned communication
- `/review-code` - Maintains journey alignment

### ⚠️ QUESTIONABLE (Pre-Cascade - Philosophy Violation):
- `/create-brand-strategy` - Before knowing users?
- `/discover-naming` - Before understanding value?
- `/define-messaging` - Before defining journey?
- `/create-product-strategy` - Before validating with users?

**Recommendation**: Move these post-Session 3 or delete them.

---

**Last Updated**: 2025-11-11
**Purpose**: Preserve Stack-Driven philosophy for future contributors
**Status**: REQUIRED READING before any framework changes

---

**The user journey is not just the first session. It is the foundation of the entire framework. Protect it.**
