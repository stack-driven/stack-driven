# Getting Started with Stack-Driven

Welcome! This guide will walk you through using Stack-Driven to build your product from user journey to shipped code.

---

## What You'll Achieve

By following this guide, you'll:
1. ✅ Define your product's strategic foundation
2. ✅ Choose an opinionated technology stack
3. ✅ Set up agentic context for AI coding agents
4. ✅ Start shipping features aligned with your mission

**Time Required**: 3-6 hours for initial setup, then continuous iteration.

---

## Prerequisites

**You Need:**
- An idea or product you want to build
- Basic understanding of your target users
- Willingness to be strategic before tactical

**You Don't Need:**
- A team (this works for solo founders)
- Technical expertise (AI agents will help)
- Perfect clarity (you'll refine as you go)

---

## Step 1: Define Your User Journey (2-3 hours)

### Why This Matters
Every decision flows from understanding your users. Skip this and you'll build the wrong thing.

### Action Steps

1. **Open** [`foundation/01-user-journey.md`](./foundation/01-user-journey.md)

2. **Answer These Questions** (write them down):
   ```markdown
   ## My User Journey

   ### Who are my users?
   Primary Persona: [Specific role/person, not "everyone"]

   ### What problem do they have?
   Pain Points:
   - [Specific pain 1]
   - [Specific pain 2]
   - [Specific pain 3]

   ### What job are they hiring my product to do?
   When I [situation], I want to [motivation], so I can [outcome]

   ### What does success look like for them?
   [Specific, measurable outcome]
   ```

3. **Map Your Core Flow** (3-5 steps maximum):
   ```markdown
   Step 1: [Entry point] → User gets [value]
   Step 2: [Key action] → User gets [value]
   Step 3: [Aha moment] → User realizes full value
   ```

4. **Identify Friction Points**:
   - Where might users get stuck?
   - What might confuse them?
   - What would cause them to quit?

5. **Define Time to Value**:
   - How long from signup to "aha moment"?
   - Target: <10 minutes for MVP

### Example

```markdown
User: Compliance officers drowning in document review

Pain Points:
- Manually reviewing 50+ page documents takes 2+ hours
- Easy to miss critical compliance issues
- Inconsistent review quality across team

Job to Be Done:
When I receive a document for compliance review,
I want to quickly identify issues,
so I can approve or reject within minutes.

Core Flow:
1. Upload document → System accepts and processes
2. Select framework → System knows what to check
3. Review results → Clear pass/fail with explanations

Time to Value: <5 minutes
```

### Validation

Before moving on:
- [ ] I can describe my primary user in one sentence
- [ ] I can explain their core problem without jargon
- [ ] I know exactly what "success" means to them
- [ ] My core flow is 3-5 steps (not 20)

**If stuck**: Talk to 3-5 potential users. Ask about their problems, not your solution.

---

## Step 2: Craft Your Mission Statement (30 minutes)

### Why This Matters
Your mission is your decision-making filter. "Does this advance our mission?" If no, don't build it.

### Action Steps

1. **Open** [`foundation/02-mission-statement.md`](./foundation/02-mission-statement.md)

2. **Use This Formula**:
   ```
   We help [specific user persona]
   [achieve specific outcome]
   by [unique approach]
   ```

3. **Test Your Mission**:
   - Can only describe YOUR product? ✓
   - Describes an outcome users care about? ✓
   - Highlights what makes you different? ✓
   - Team can recite it? ✓

### Example

```markdown
We help compliance officers
approve documents 10x faster
by transforming regulatory requirements into automated assessments.
```

**Why it works:**
- Specific user (compliance officers, not "everyone")
- Measurable outcome (10x faster)
- Unique approach (automated assessments from requirements)

---

## Step 3: Define Success Metrics (30 minutes)

### Why This Matters
Metrics without strategy are vanity. Your North Star Metric should directly measure mission success.

### Action Steps

1. **Open** [`foundation/03-success-metrics.md`](./foundation/03-success-metrics.md)

2. **Define Your North Star Metric**:
   ```markdown
   North Star: [Core action that represents value]
   Definition: [Exact calculation]
   Why: [Connection to mission]
   Current: [Where you are]
   Target: [Where you want to be]
   ```

3. **Identify 2-3 Input Metrics** (what drives North Star):
   ```markdown
   Input 1: [Metric that increases North Star]
   Input 2: [Another driver]
   Input 3: [Another driver]
   ```

4. **Set MVP Success Criteria**:
   ```markdown
   Week 1: [X] activated users
   Week 4: [Y]% activation rate, [Z]% D7 retention
   ```

### Example

```markdown
North Star: Weekly Assessments Completed
Definition: Number of document assessments completed per week
Why: Directly measures our mission (helping officers approve faster)
Current: 0 (pre-launch)
Target: 1,000/week by end of Q1

Input Metrics:
1. Active Users (more users = more assessments)
2. Assessments per User (frequency of use)
3. Completion Rate (% of started assessments finished)

MVP Success (First 30 Days):
- 100 activated users
- 40% activation rate
- 30% D7 retention
```

---

## Step 4: Design Monetization (30 minutes)

### Why This Matters
Dead simple pricing aligned with value delivery. Users should understand costs in <30 seconds.

### Action Steps

1. **Open** [`foundation/04-monetization.md`](./foundation/04-monetization.md)

2. **Choose Your Model**:
   - **Freemium**: Free tier + paid upgrade
   - **Pay-As-You-Go**: $X per value unit
   - **Subscription**: Fixed monthly price
   - **Hybrid**: Base subscription + usage overages

3. **Define Value Metric**:
   ```markdown
   We charge for: [Unit that aligns with value]
   Users get: [10x value for what they pay]
   ```

4. **Set Pricing**:
   ```markdown
   Free: [Generous enough to validate]
   Paid: $[X] per [unit] OR $[Y]/month
   Enterprise: Custom (when to trigger)
   ```

### Example

```markdown
Model: Freemium + Pay-As-You-Go

Value Metric: Per assessment completed
Rationale: Directly measures value delivered

Pricing:
- Free: 100 assessments/month
- Paid: $0.10 per assessment
- Enterprise: >10,000/month, custom pricing + SLA

Why it works:
- Free tier lets users validate
- $0.10 per assessment saves them $10+ in manual time
- Natural expansion as usage grows
```

---

## Step 5: Choose Your Tech Stack (1 hour)

### Why This Matters
Technology should serve users, not developer preferences. Choose boring, proven tech.

### Action Steps

1. **Open** [`stack/tech-stack.md`](./stack/tech-stack.md)

2. **Use Default Stack** (recommended for most products):
   ```markdown
   Frontend: Next.js + Tailwind CSS
   Backend: FastAPI (Python) OR Node/Express (TypeScript)
   Database: PostgreSQL
   Cache: Redis
   Storage: S3 / Cloudflare R2
   AI: Claude (Anthropic)
   Auth: Clerk or Auth0
   Hosting: Vercel (frontend) + Railway (backend)
   ```

3. **Only Deviate If**:
   - Team has strong expertise in different stack
   - Specific user journey need requires it
   - Your mission demands it

4. **Document Your Stack** in `.context/tech-stack.json`:
   ```json
   {
     "frontend": {"framework": "next.js"},
     "backend": {"framework": "fastapi", "language": "python"},
     "database": {"primary": "postgresql"}
   }
   ```

---

## Step 6: Set Up Agentic Context (30 minutes)

### Why This Matters
AI coding agents need structured context to make decisions aligned with your strategy.

### Action Steps

1. **Review** [`.context/README.md`](./.context/README.md)

2. **Customize Template Files**:

   **`.context/user-journey.json`**:
   - Replace `[Your Primary User]` with actual persona
   - Fill in real pain points
   - Define actual core flow steps

   **`.context/mission.json`**:
   - Insert your actual mission statement
   - Define your decision framework

   **`.context/metrics.json`**:
   - Set your North Star metric
   - Define input metrics
   - Set real targets

   **`.context/priorities.json`**:
   - Set current stage (pre_pmf / early_pmf / growth)
   - Define quarterly goals
   - List "Now" features

3. **Test With AI Agent**:
   ```markdown
   Prompt: "Based on .context/ files, what should I build first?"

   Expected Response: Agent references your mission, metrics, and priorities
   to recommend features aligned with your North Star.
   ```

---

## Step 7: Start Building (Ongoing)

### Your First Sprint

**Week 1 Goal**: Ship MVP core flow

**Checklist**:
- [ ] Set up project (use tech stack)
- [ ] Implement Step 1 of core flow
- [ ] Implement Step 2 of core flow
- [ ] Implement Step 3 of core flow (aha moment)
- [ ] Add basic metrics tracking (North Star event)
- [ ] Deploy to production

**Use AI Agents**:
```markdown
Prompt: "I need to implement [feature]. Reference .context/ files to ensure:
1. This serves user journey step [X]
2. Uses tech stack [Y]
3. Follows architecture patterns
4. Tracks metric [Z]"
```

### Ongoing Workflow

**Every Sprint**:
1. **Review metrics**: Is North Star growing?
2. **Update priorities**: What matters most this sprint?
3. **Prioritize features**: Use `stack/prioritization.md`
4. **Build & measure**: Ship → Measure → Learn → Iterate

**Every Month**:
- Review and update `.context/priorities.json`
- Assess if mission/metrics need evolution
- Validate user journey still accurate

**Every Quarter**:
- Deep dive on foundation docs
- Update tech stack if needed
- Set new North Star targets

---

## Common Pitfalls

### ❌ Skipping User Journey
**Symptom**: Building features that sound cool but users don't use
**Fix**: Go back to Step 1. Talk to users.

### ❌ Unclear Mission
**Symptom**: Team debates every feature endlessly
**Fix**: Write mission that passes all tests in Step 2

### ❌ Vanity Metrics
**Symptom**: "We have 10K signups!" but no one uses product
**Fix**: Focus on North Star (value delivery), not signups

### ❌ Technology First
**Symptom**: Choosing Kubernetes before understanding users
**Fix**: User journey → Mission → Tech stack (in that order)

### ❌ Build Everything
**Symptom**: 50 features on roadmap, none shipped
**Fix**: Use `stack/prioritization.md` to say no ruthlessly

---

## Success Checklist

You're ready to ship when:

- [ ] I can explain my user's core problem in one sentence
- [ ] My mission statement passes all 6 tests
- [ ] I know my North Star Metric and current value
- [ ] My pricing model is one sentence
- [ ] I've chosen a tech stack (with rationale)
- [ ] My `.context/` files are customized
- [ ] I know what to build first (and why)
- [ ] I know how to measure success

---

## Next Steps

### For Product Development
1. Work through `prompts/` for specific tasks
2. Use `stack/architecture-principles.md` for design decisions
3. Reference `stack/prioritization.md` for feature decisions

### For Team Alignment
1. Share foundation docs with team
2. Use mission as decision filter
3. Review metrics weekly
4. Update priorities monthly

### For Agentic Development
1. Configure AI agents to read `.context/` files
2. Reference context in prompts
3. Iterate on context as you learn
4. Share patterns that work

---

## Getting Help

**Stuck on user journey?**
→ Interview 5 users. Listen more than you talk.

**Can't define mission?**
→ What specific outcome would make users say "I can't live without this"?

**Confused about metrics?**
→ What single number proves users are getting value?

**Overwhelmed by tech choices?**
→ Use the default stack. Iterate later.

**Don't know what to build first?**
→ Whatever gets you to "aha moment" fastest for first user.

---

## Quick Reference

### The Flow
```
User Journey → Mission → Metrics → Monetization
     ↓
Tech Stack → Architecture → Prioritization
     ↓
Build → Measure → Learn → Iterate
```

### Key Documents
- **Start**: `foundation/01-user-journey.md`
- **Decide**: `stack/prioritization.md`
- **Build**: `.context/` + `prompts/`
- **Measure**: `foundation/03-success-metrics.md`

### Essential Questions
1. Who is this for? (User journey)
2. What outcome do we promise? (Mission)
3. How do we measure success? (Metrics)
4. What do we build first? (Prioritization)

---

**You're ready.** Start with the user journey → [`foundation/01-user-journey.md`](./foundation/01-user-journey.md)

**Remember**: Strategy first, tactics second. User value always.

Good luck shipping! 🚀
