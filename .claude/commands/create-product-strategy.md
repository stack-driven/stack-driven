---
description: POST-CASCADE - Create comprehensive product strategy (market, competitive, roadmap)
---

# Create Product Strategy (Post-Core Extension)

You are helping the user create a comprehensive product strategy that validates their user journey with market analysis, competitive positioning, vision, goals, and roadmap.

## When to Use This

**Run AFTER Session 3** (`/generate-strategy`) when you have:
- ✅ User journey defined (`output/00-user-journey.md`)
- ✅ Mission statement (`output/02-mission.md`)
- ✅ Metrics identified (`output/03-metrics.md`)
- ✅ Architecture outlined (`output/05-architecture.md`)

Use this to validate and expand your journey with market reality, competitive analysis, and long-term vision.

**Skip this** if:
- You're building an MVP without needing investor/stakeholder documentation
- You prefer emergent strategy over planned roadmaps
- You don't need comprehensive market analysis

**How This Differs from Session 3** (`/generate-strategy`):
- **Session 3**: Derives mission, metrics, monetization, architecture FROM user journey (tactical foundation)
- **This command**: Validates journey with market analysis, competitive positioning, product vision, roadmap (strategic validation)
- **Both are valuable**: Session 3 provides tactical foundation; this validates with market context

## Cascade Inputs

This command READS previous outputs to ground product strategy in reality:

1. **Read the user journey**:
   ```bash
   Read output/00-user-journey.md
   ```
   - Who is the target audience? (market segment to size)
   - What problem are they solving? (market need validation)
   - What value do you deliver? (competitive differentiation)

2. **Read the mission**:
   ```bash
   Read output/02-mission.md
   ```
   - Mission = foundation for product vision
   - What's your 3-5 year mission trajectory?

3. **Read the metrics**:
   ```bash
   Read output/03-metrics.md
   ```
   - What defines success? (strategic goal basis)
   - What should you measure? (success metrics)

4. **Read the architecture**:
   ```bash
   Read output/05-architecture.md
   ```
   - What technical bets are you making? (assumptions to validate)
   - What's the technical roadmap? (informs product themes)

5. **Read brand strategy** (if exists):
   ```bash
   Read output/08-brand-strategy.md  # If exists
   ```
   - Align product positioning with brand purpose

Your product strategy validates and extends the journey with market context.

## Your Task

Create a comprehensive product strategy that validates your journey with market analysis and competitive positioning.

### Steps to Execute

1. **FIRST: Read cascade inputs** (see "Cascade Inputs" section above):
   ```bash
   Read output/00-user-journey.md
   Read output/02-mission.md
   Read output/03-metrics.md
   Read output/05-architecture.md
   Read output/08-brand-strategy.md  # If exists
   ```

2. **Read the template structure**:
   ```bash
   Read templates/11-product-strategy-template.md
   ```

3. **Interview the user** with journey-informed questions:

   **Vision (journey-grounded)**:
   - "Your mission is [mission]. Project this forward: 3-5 years from now, how has [journey audience] been transformed at scale? What's the aspirational future?"

   **Market Analysis (journey-based)**:
   - "Your journey targets [audience]. Let's size this: How many [audience] exist? What would they pay to solve [journey problem]? Show me bottom-up math."

   **Competitive Landscape (journey-differentiated)**:
   - "You solve [journey problem] with [journey solution]. Who else solves this today? How do they position? What's YOUR unique approach from the journey?"

   **Strategic Goals (mission-aligned)**:
   - "Your mission is [mission], metrics are [metrics]. What 3-5 things MUST be true in 12-24 months to get there?"

   **Product Principles (journey-derived)**:
   - "Your journey shows [key moments]. What principles guide decisions about THIS journey? What won't you compromise?"

   **Roadmap Themes (architecture-informed)**:
   - "Your architecture is [architecture]. What are the major initiative areas to deliver [journey value]?"

4. **Develop product strategy** grounded in journey:
   - Vision statement = [Mission] projected 3-5 years forward
   - Market sizing = Bottom-up calculation for [journey audience]
   - Competitive analysis = How others solve [journey problem], your differentiation
   - Positioning = Who ([journey audience]) + What ([journey solution]) + How (unique approach) + Why (mission)
   - Strategic goals = What must be true to achieve [mission] given [metrics]
   - Product principles = Decision guides derived from [journey insights]
   - Roadmap themes = Major initiatives to deliver [journey value] with [architecture]
   - Risks = Assumptions about [journey], [market], [architecture] that could be wrong

5. **Write the output**:
   ```bash
   Write output/11-product-strategy.md
   ```

## Output Location

`output/11-product-strategy.md`

This validates:
- User journey (with market sizing and competitive analysis)
- Mission (with 3-5 year vision)
- Metrics (with strategic goals)
- Architecture (with roadmap themes)

Use for investor/stakeholder conversations and long-term planning.

## Template Structure

The output follows this structure:
- Product Vision (3-5 year aspirational future)
- Market Analysis (TAM/SAM/SOM, trends, dynamics)
- Competitive Landscape (who, how positioned, gaps)
- Product Positioning (who/what/how/why)
- Strategic Goals (12-24 month objectives)
- Product Principles (decision-making guides)
- Roadmap Themes (major initiative areas)
- Risks and Assumptions (what could go wrong)
- Success Metrics (how to measure progress)

## Key Principles

1. **Be honest about market** - Don't inflate TAM; use bottom-up sizing
2. **Know your competition** - Don't claim "no competitors"; everyone has alternatives
3. **Be specific on positioning** - "Better" is not positioning; "10x faster for X" is
4. **Make principles actionable** - "Quality matters" is vague; "Ship with tests or don't ship" is clear
5. **Theme roadmap** - Don't commit to specific features; commit to problem areas
6. **Name your risks** - Ignoring risks doesn't make them go away

## Example Prompt Flow

```
You: I've read your user journey, mission, metrics, and architecture. Let's validate these with comprehensive product strategy.

Your mission is "[mission]". Project this 3-5 years forward - your product is wildly successful serving [journey audience]. What does that world look like? How many users? What's changed?

User: [Describes vision]

You: Love it - that's your mission at scale. Now let's validate the market. Your journey targets [audience] with [problem]. Bottom-up: how many [audience] exist? What would they pay to solve [problem]? Show me your math.

User: [Calculates market size]

You: Great, that's credible TAM/SAM/SOM. Now competitors: you solve [journey problem] with [journey solution]. Who else solves this today? How do THEY position?

User: [Describes competitive landscape]

You: Perfect. Your differentiation is [unique approach from journey]. Now strategic goals: given your mission and metrics, what 3-5 things MUST be true in 12-24 months?

User: [Lists strategic goals]

[Continue through product principles, roadmap themes, risks...]

You: Excellent. I've captured your product strategy in output/11-product-strategy.md:
- Vision: [mission projected forward]
- Market: [TAM/SAM/SOM for journey audience]
- Positioning: [journey differentiation vs. competitors]
- 5 strategic goals (aligned with metrics)
- 4 product principles (from journey insights)
- 6 roadmap themes (from architecture)
- Risk register (journey/market/architecture assumptions)

This validates your journey with market context. Everything traces back to the user journey.
```

## Validation Checkpoint: Market Demand Evidence

**⚠️ CRITICAL: Do not proceed without demand signals**

After creating your product strategy, you must validate that real demand exists. This prevents the "perfect strategy, no customers" trap.

### Checkpoint Requirements

Ask the user:

```
🚦 VALIDATION CHECKPOINT: Market Demand

You've created a comprehensive product strategy. Now let's validate there's real demand.

Do you have evidence of market demand? (Choose one or more)

Required evidence (at least ONE):
- [ ] 5+ Letters of Intent (LOIs) from potential customers
- [ ] 10+ email signups expressing serious interest
- [ ] 3+ pre-orders or paid pilots
- [ ] Survey results showing 50+ respondents would pay
- [ ] Waitlist with 100+ signups
- [ ] Partnership interest from relevant companies

This isn't about perfection - it's about signal vs noise. Do people actually want this?

Please respond with:
1. "Yes, have evidence" - describe what you have
2. "No, need help getting evidence" - I'll create a validation playbook
3. "Skip for now" - (not recommended, but I'll note this)
```

### If User Says "Yes, have evidence"

Ask them to provide:
1. **Evidence Type**: What kind of demand signal do they have?
2. **Quantity**: How many LOIs/signups/pre-orders?
3. **Quality**: Are these from ideal customers (match persona)?
4. **Commitment Level**: Just interested, or willing to pay/commit?
5. **Timeline**: When did they collect this evidence?

**Create validation file**:
```bash
Write output/11-product-strategy-validation.md
```

**Contents**:
```markdown
# Product Strategy Market Validation

**Validation Date**: [Date]
**Strategy File**: output/11-product-strategy.md

## Demand Evidence

### Evidence Collected
- **Type**: [LOIs / Email signups / Pre-orders / Survey / Waitlist / Partnerships]
- **Quantity**: [Number]
- **Quality**: [How well they match target persona]
- **Commitment Level**: [Interest only / Email signup / Pre-order / Paid pilot / LOI]

### Evidence Details

#### [Evidence Type 1]
- **Who**: [Company/person names, roles]
- **What they said**: [Key quotes, commitments]
- **Value to them**: [Why they want this]
- **Timeline**: [When they need it]
- **Budget**: [If discussed]

#### [Evidence Type 2]
[Repeat for each type of evidence]

## Demand Signal Strength

**Scoring**:
- LOI with budget/timeline: 10 points each
- Pre-order/paid pilot: 8 points each
- Serious email inquiry: 3 points each
- Waitlist signup: 1 point each

**Total Score**: [X] points

**Gate Threshold**: 50+ points = STRONG SIGNAL

### Signal Quality Assessment
- ✅ Evidence from ideal customer persona? [Y/N + explanation]
- ✅ Willingness to pay validated? [Y/N + evidence]
- ✅ Timeline urgency confirmed? [Y/N + when they need it]
- ✅ Budget authority confirmed? [Y/N + who has budget]

## Market Validation Insights

### What This Confirms ✅
- [Market need from strategy is real]
- [Pricing assumptions validated/adjusted]
- [Target segment confirmed]

### What This Challenges ❌
- [Any strategy assumptions that evidence contradicts]
- [Adjustments needed to product strategy]

## Competitive Intel from Conversations
[What did prospects say about current solutions? Gaps? Frustrations?]

## Next Steps Based on Evidence

**If STRONG SIGNAL (50+ points)**:
- ✅ Proceed with confidence
- Convert LOIs to design partners for Session 4
- Use their feedback to validate backlog in Session 5

**If WEAK SIGNAL (<50 points)**:
- ⚠️ Get more evidence before building
- Focus on 5 LOIs from ideal customers
- Consider pivoting strategy based on feedback

---

**Gate Status**: ✅ PASS (Strong demand signal) / ⚠️ PROCEED WITH CAUTION (Weak signal) / ❌ FAIL (No signal)

**Recommendation**: [Next steps based on signal strength]
```

**Gate Logic**:
- **50+ points**: ✅ Strong demand signal, proceed with confidence
- **20-49 points**: ⚠️ Weak signal, get more evidence before building
- **<20 points**: ❌ Insufficient evidence, focus on customer development
- **No evidence**: ⚠️ HIGH RISK, strongly discourage proceeding

### If User Says "No, need help getting evidence"

**Create demand validation playbook**:
```bash
Write output/11-demand-validation-playbook.md
```

**Contents**:
```markdown
# Market Demand Validation Playbook

Use this playbook to collect evidence that validates your product strategy.

## Goal
Get 5 LOIs (Letters of Intent) OR 50+ strong demand signals before building.

## What Is an LOI (Letter of Intent)?

A simple document where a potential customer says:
- "We have [problem] that costs us [amount]"
- "If you build [solution], we commit to [pilot/trial/purchase]"
- "Timeline: We need this by [date]"
- "Budget: We can allocate [amount] for this"

**It's NOT a binding contract** - it's a signal that demand is real.

## Target: [X] LOIs from [Persona]

Based on your product strategy:
- **Persona**: [from output/11-product-strategy.md]
- **Market segment**: [TAM/SAM/SOM from strategy]
- **Ideal customer profile**: [company size, industry, pain level]

## How to Get LOIs

### Step 1: Identify 20 Target Companies (Week 1)

Create list of 20 companies that match your ICP:
- **Size**: [from product strategy]
- **Industry**: [from product strategy]
- **Pain signal**: [how to identify they have the problem]

**Where to find them**:
- LinkedIn Sales Navigator (filter by title, company size, industry)
- Industry communities (Slack, Discord, forums)
- Conference attendee lists
- Your network's 2nd connections

### Step 2: Craft Outreach (Week 1)

**Email Template** (personalize heavily):
```
Subject: [Company Name] + [Problem Area] research

Hi [Name],

I noticed [company] is [relevant context - recent news, job posting, growth signal].

I'm researching how [persona type] at [company type] handle [problem from product strategy]. Specifically, [pain point].

Would you have 15 minutes this week to share how your team approaches this? No sales pitch - just learning.

[Your calendar link]

Thanks,
[Your name]
```

**Goal**: 15-minute discovery call, NOT a sales pitch.

### Step 3: Run Discovery Calls (Weeks 2-3)

Use this script (from product strategy):

1. "How do you currently handle [problem]?" (10 min)
   - Listen for pain, cost, frequency

2. "What would it be worth to solve this?" (3 min)
   - Quantify value

3. "I'm exploring building [solution]. Would that interest you?" (2 min)
   - Gauge interest level

**If they're interested**:
4. "Would you be open to trying an early version as a design partner?"
   - If YES: "Can I send you a simple LOI to formalize that interest?"

### Step 4: Send LOI (Same Day)

**LOI Template**:
```
Letter of Intent - [Product Name] Design Partnership

[Company Name] acknowledges:

1. **Problem**: We currently face [problem] which costs us [time/money/risk].

2. **Interest**: We are interested in exploring [solution] to address this.

3. **Commitment**: If [Company/You] builds [solution] that meets our needs, we commit to:
   - [ ] Pilot program (3-6 months) starting [timeframe]
   - [ ] Budget allocation: $[amount] (or [X] hours of team time)
   - [ ] Feedback and iteration partnership

4. **Timeline**: We would need this solution by [date] to address [business driver].

5. **Decision Maker**: [Name, Title] has budget authority for this purchase.

This is a non-binding expression of interest to help [Company/You] validate market demand.

Signed: ___________________
Date: ___________________
```

Send via DocuSign or simple email reply works too.

### Step 5: Track Progress

**Success Metrics**:
- Week 1: 20 target companies identified, 20 emails sent
- Week 2: 10 discovery calls completed
- Week 3: 5 LOIs received OR 50+ demand signal points

**Tracking Spreadsheet**:
| Company | Contact | Email Sent | Call Booked | Call Done | Interest Level | LOI Status |
|---------|---------|------------|-------------|-----------|----------------|------------|
| Acme Co | Jane D  | 2024-01-15 | 2024-01-18  | ✅        | High (9/10)    | Sent       |

## Alternative: Lighter-Weight Validation

If LOIs feel too heavy, collect these instead:

**Option 1: Waitlist with Intent**
- Landing page explaining the solution
- Signup form asking: "Would you pay $X/month for this?" (Yes/No/Maybe)
- Goal: 100+ "Yes" responses

**Option 2: Pre-Orders**
- Offer early-bird pricing: "Reserve your spot for $X (refundable)"
- Goal: 10+ pre-orders
- This is STRONGER signal than LOIs

**Option 3: Design Partner Commitments**
- Email asking: "Will you commit 2 hours/month to give feedback if we build this?"
- Goal: 5 design partners
- Validates engagement, not just interest

## Validation Timeline

**Week 1**: Outreach (send 20 emails)
**Week 2**: Discovery calls (complete 10)
**Week 3**: LOI collection (receive 5)
**Week 4**: Analyze and document in output/11-product-strategy-validation.md

## After Validation

Come back and run `/create-product-strategy` again - tell me what you learned:
- Did evidence validate your strategy?
- Did you learn something that changes TAM/SAM/SOM?
- Did pricing assumptions hold?
- Should you adjust positioning?

Then we'll update output/11-product-strategy.md and proceed to next sessions.

---

**Remember**: This feels like sales, but it's actually de-risking. Better to learn "no one wants this" before you build than after.

You've got this! 🎯
```

**Then tell user**:
```
✅ Demand validation playbook created!

I've created output/11-demand-validation-playbook.md with:
- How to get 5 LOIs in 3 weeks
- Email templates and call scripts
- Alternative validation methods (waitlist, pre-orders)
- Tracking spreadsheet template

Next steps:
1. Identify 20 target companies (Week 1)
2. Send outreach emails (Week 1)
3. Run 10 discovery calls (Week 2)
4. Collect 5 LOIs or 50 demand signal points (Week 3)
5. Come back and document in output/11-product-strategy-validation.md

This is the difference between "perfect strategy" and "validated strategy."

Good luck! 🚀
```

### If User Says "Skip for now"

**Warning message**:
```
⚠️ WARNING: Proceeding without market demand validation

You're choosing to skip demand validation. This is high risk because:
- Product strategy without demand evidence is just hypothesis
- 42% of startups fail due to "no market need" (CB Insights)
- You might have perfect strategy for a market that doesn't exist

I'll note this in your cascade, but I strongly recommend:
1. Get 5 LOIs before writing code
2. Get 1 paid pilot before launch
3. Validate pricing with real budget holders

I'm documenting this decision in output/11-validation-skipped.md.

Continue anyway? (type "yes" to proceed, "no" to use validation playbook)
```

**Create skip documentation**:
```bash
Write output/11-validation-skipped.md
```

```markdown
# ⚠️ Market Demand Validation Skipped

**Date**: [Date]
**Reason**: User chose to skip demand validation checkpoint
**Strategy File**: output/11-product-strategy.md

## Risk Assessment

By skipping market demand validation, you accept these risks:

1. **Strategy ≠ Reality**: Your TAM/SAM/SOM might be theoretical
2. **No Demand Signal**: You don't know if anyone actually wants this
3. **Pricing Unvalidated**: Your monetization strategy is untested
4. **Competitive Positioning Unvalidated**: You don't know if differentiation resonates
5. **Wasted Resources**: Might build something nobody will buy

## Validation Debt

This is "validation debt" similar to technical debt - it accumulates interest:
- Cost to validate NOW: 3 weeks of outreach
- Cost to pivot at BACKLOG (Session 5): 1 month of planning wasted
- Cost to pivot at CODE (Session 7+): 3-6 months of development wasted
- Cost to pivot at LAUNCH: 6-12 months + team morale damage

**Debt interest rate**: 10x per stage

## Recommended Validation Gates

Before proceeding further:
- [ ] **Before Session 5 (Backlog)**: Get 3 LOIs minimum
- [ ] **Before Session 7 (Scaffold)**: Get 5 LOIs or 1 paid pilot
- [ ] **Before Launch**: Get 10 paying customers or 50 active pilots

## How to Validate Later

Use output/11-demand-validation-playbook.md when you're ready.

The playbook shows you how to:
1. Get 5 LOIs in 3 weeks
2. Run effective discovery calls
3. Convert interest to commitment

---

**Status**: ⚠️ DEMAND VALIDATION SKIPPED (HIGH RISK)

**Next Validation Checkpoint**: Before Session 5 (/generate-backlog)
```

## After This Session

**Recommended next**:
- Use this for investor/stakeholder presentations
- Run `/create-brand-strategy` if you need brand positioning
- Continue with Session 4-6 if you haven't completed core cascade

**Important**: This validates your journey with market reality. It's strategic documentation of the tactical foundation you built in Sessions 1-3.

---

**Remember**: This is POST-CORE. It validates journey with market context, not created in isolation. Everything connects back to the user journey.
