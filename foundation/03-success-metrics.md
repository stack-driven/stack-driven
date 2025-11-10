# Success Metrics: Measuring What Matters

> Metrics without context are vanity. Metrics tied to user value are actionable. This guide helps you define metrics that drive the right decisions.

---

## The Metrics Hierarchy

### Level 1: North Star Metric (The One Metric That Matters)
The single metric that best captures value delivery to users.

### Level 2: Input Metrics
Leading indicators that drive the North Star.

### Level 3: Health Metrics
Guardrails that ensure sustainable growth.

### Level 4: Counter-Metrics
What you explicitly choose NOT to sacrifice.

---

## Finding Your North Star Metric

### What Makes a Great North Star?

A North Star Metric must:
- ✅ **Measure value delivery** (not vanity)
- ✅ **Reflect mission outcome** (ties to your mission)
- ✅ **Predict revenue** (leads to business success)
- ✅ **Be actionable** (teams can influence it)
- ✅ **Be simple** (everyone understands it)

### Common North Stars by Product Type

**Collaboration Tools**
- Slack: Messages sent per active team
- Figma: Files with >2 editors per week
- Notion: Pages created per workspace

**Marketplace Platforms**
- Airbnb: Nights booked
- Uber: Rides completed
- Etsy: Gross merchandise value

**SaaS Tools**
- Stripe: Total payment volume processed
- Mixpanel: Tracked events analyzed
- Intercom: Conversations resolved

**Content Platforms**
- Netflix: Hours watched
- Medium: Total time reading
- Spotify: Time spent listening

### North Star Formula

```
North Star = [Core Action] × [Value Multiplier]
```

**Examples:**
- Documents assessed × Assessment accuracy
- Features shipped × User adoption rate
- Compliance checks completed × Time saved
- Design components used × Teams using them

---

## Defining Your Metrics Stack

### Step 1: Identify Your North Star

Reference your user journey (01-user-journey.md) and mission (02-mission-statement.md):

**Questions:**
1. What single action best represents value delivery in your core user flow?
2. Which metric, if growing, means your mission is succeeding?
3. What would users measure to know they're getting value?

```markdown
## Our North Star Metric

**Metric**: [Name]
**Definition**: [Exact calculation]
**Why This**: [Connection to mission and user value]
**Target**: [Specific goal]

**Example**:
**Metric**: Weekly Active Assessments
**Definition**: Number of compliance assessments completed per week by active teams
**Why This**: Directly measures mission outcome (reduce manual review time)
**Target**: 1,000 assessments/week by end of Q2
```

### Step 2: Define Input Metrics

These are leading indicators that drive your North Star.

**Framework:**
```
North Star = f(Input 1, Input 2, Input 3)
```

**Example for "Weekly Active Assessments":**
```
Weekly Active Assessments =
  Active Teams ×
  Assessments per Team ×
  Completion Rate
```

**Input Metrics:**
1. **Active Teams**: Teams that logged in this week
2. **Assessments per Team**: Average assessments started per active team
3. **Completion Rate**: % of started assessments that finish

**Template:**
```markdown
## Input Metrics

### 1. [Input Metric Name]
**Definition**: [How it's measured]
**Why It Matters**: [How it drives North Star]
**Current**: [Current value]
**Target**: [Goal]
**Lever**: [How to improve it]

### 2. [Input Metric Name]
[Repeat structure]
```

### Step 3: Define Health Metrics

Metrics that ensure you're growing sustainably, not just quickly.

**Categories:**

**Acquisition Health**
- Cost per acquisition (CPA)
- Acquisition channel mix (avoid over-dependence)
- Signup quality score

**Engagement Health**
- Daily/Weekly/Monthly active users
- Session frequency and duration
- Feature adoption breadth

**Retention Health**
- D1, D7, D30 retention rates
- Churn rate (user and revenue)
- Cohort retention curves

**Revenue Health**
- Monthly recurring revenue (MRR)
- Customer lifetime value (LTV)
- LTV:CAC ratio
- Revenue concentration (top customers)

**Product Health**
- Error rates
- Performance metrics (page load, API response time)
- Support ticket volume
- Net Promoter Score (NPS)

**Template:**
```markdown
## Health Metrics

### Acquisition Health
- **Cost per Acquisition**: $[X] (target: <$[Y])
- **Signup Quality**: [Z]% activate within 24h (target: >[A]%)

### Engagement Health
- **Weekly Active Users**: [X] (target: >[Y])
- **Sessions per User**: [Z] per week (target: >[A])

### Retention Health
- **D7 Retention**: [X]% (target: >[Y]%)
- **D30 Retention**: [Z]% (target: >[A]%)

### Revenue Health
- **MRR**: $[X] (target: $[Y] by [date])
- **LTV:CAC**: [Z]:1 (target: >3:1)

### Product Health
- **Error Rate**: [X]% (target: <[Y]%)
- **P95 Response Time**: [Z]ms (target: <[A]ms)
```

### Step 4: Define Counter-Metrics

Metrics you explicitly will NOT sacrifice to improve North Star.

**Why Counter-Metrics Matter:**
- Growing North Star by degrading quality → Unsustainable
- Improving engagement by dark patterns → Unethical
- Boosting revenue by neglecting product → Short-sighted

**Examples:**

**If North Star = Usage Growth**
- Counter-Metrics: User satisfaction (NPS), Error rates, Support burden

**If North Star = Revenue Growth**
- Counter-Metrics: Customer satisfaction, Retention rate, Product quality

**If North Star = Feature Velocity**
- Counter-Metrics: Code quality, Bug rates, Technical debt

**Template:**
```markdown
## Counter-Metrics (What We Won't Sacrifice)

We will NOT improve [North Star] by degrading:

1. **[Counter-Metric 1]**
   - **Definition**: [What it measures]
   - **Threshold**: Must stay above [X]
   - **Why Protected**: [Reason]

2. **[Counter-Metric 2]**
   [Repeat structure]
```

---

## Metrics by Product Stage

### Pre-Product/Market Fit

**Focus**: Validation and Learning

**Primary Metrics:**
- User interview insights per week (10+)
- Prototype test sessions (5+ per week)
- Problem validation score (do users have this problem?)
- Solution validation score (does this solve it?)

**Success Criteria:**
- ✓ 10 users say "I would pay for this"
- ✓ 5 users complete entire flow without confusion
- ✓ Core value delivered within [X minutes]

### Early Product/Market Fit

**Focus**: Retention and Value Delivery

**Primary Metrics:**
- **North Star**: [Core value action]
- **Retention**: D7 and D30 retention >40%
- **Time to Value**: <[X minutes] to first success
- **Frequency**: [Y] actions per week

**Success Criteria:**
- ✓ 40%+ retention at D30
- ✓ Users returning 2+ times per week
- ✓ Organic referrals happening

### Growth Stage

**Focus**: Efficient Scaling

**Primary Metrics:**
- **North Star**: [Core value action] growing 15%+ MoM
- **Acquisition**: CAC payback <6 months
- **Monetization**: Revenue per user growing
- **Expansion**: Net revenue retention >100%

**Success Criteria:**
- ✓ Repeatable acquisition channels (3+)
- ✓ Positive unit economics
- ✓ Self-serve conversion funnel

### Scale Stage

**Focus**: Market Leadership

**Primary Metrics:**
- **Market Share**: % of addressable market
- **Brand**: Unaided awareness in target segment
- **Expansion**: Multi-product adoption
- **Efficiency**: Rule of 40 (growth% + profit% >40)

**Success Criteria:**
- ✓ Category leadership position
- ✓ Ecosystem of integrations/partners
- ✓ Profitable growth

---

## Metric Definition Template

For each metric, document precisely:

```markdown
## [Metric Name]

### Definition
**Formula**: [Exact calculation]
**Example**: [Worked example with numbers]

### Why It Matters
**Connection to Mission**: [How this ties to mission outcome]
**Connection to User Value**: [What this means for users]
**Business Impact**: [Why this matters financially]

### Measurement
**Data Source**: [Where data comes from]
**Update Frequency**: [How often measured]
**Owner**: [Who's responsible]
**Dashboard**: [Link to dashboard]

### Targets
**Current**: [Current value]
**30-day Goal**: [Target]
**90-day Goal**: [Target]
**12-month Goal**: [Target]

### Levers
What can teams do to improve this metric?
1. [Action 1]
2. [Action 2]
3. [Action 3]

### Related Metrics
- **Drives**: [Metrics this influences]
- **Driven By**: [Metrics that influence this]
- **Counter-Metrics**: [What to watch to avoid gaming]
```

---

## MVP Success Metrics

For your Minimum Viable Product, keep it simple:

### Time to Value
**Metric**: Time from signup to first successful [core action]
**Target**: <[X] minutes
**Why**: Fastest indicator of product-market fit

### Activation Rate
**Metric**: % of signups who complete [core action] within 24 hours
**Target**: >[Y]%
**Why**: Measures how clearly you communicate value

### Weekly Frequency
**Metric**: [Core actions] per user per week
**Target**: >[Z]
**Why**: Indicates habit formation

### Retention
**Metric**: % of activated users who return after 7 days
**Target**: >[A]%
**Why**: Validates sustained value delivery

### User Satisfaction
**Metric**: Would users recommend? (NPS or simple yes/no)
**Target**: >[B]% would recommend
**Why**: Qualitative validation of quantitative metrics

### Example MVP Dashboard:
```markdown
## MVP Success Dashboard

**Week 1 Goals:**
- [ ] 50 signups
- [ ] 30% activate within 10 minutes
- [ ] 20% return on D7
- [ ] 10 user interviews completed

**Week 4 Goals:**
- [ ] 200 signups
- [ ] 50% activate within 10 minutes
- [ ] 40% return on D7
- [ ] 30% would recommend to colleague
```

---

## Avoiding Metric Traps

### ❌ Trap 1: Vanity Metrics
**Example**: "We have 10,000 signups!"
**Why It's Vain**: If they're not using the product, they don't count.
**Better**: "We have 2,000 weekly active users completing 5,000 core actions."

### ❌ Trap 2: Too Many Metrics
**Example**: Dashboard with 50 metrics
**Why It's Bad**: Can't focus on all, paralysis by analysis.
**Better**: 1 North Star + 3-5 key inputs + 3-5 health checks

### ❌ Trap 3: Lagging-Only Metrics
**Example**: "Monthly revenue"
**Why It's Bad**: By the time it moves, you're too late to react.
**Better**: Leading indicators (pipeline, activation) that predict revenue

### ❌ Trap 4: Gaming Without Counter-Metrics
**Example**: Maximize engagement → Send spam notifications
**Why It's Bad**: Short-term gain, long-term user hatred.
**Better**: Engagement WITH satisfaction score as counter-metric

### ❌ Trap 5: Unchangeable Metrics
**Example**: "Industry average conversion rate"
**Why It's Bad**: Your team can't influence it.
**Better**: "Our onboarding flow conversion rate" (actionable)

---

## Metrics in Practice

### For Product Decisions
**Before building a feature:**
- Which input metric will this improve?
- By how much (hypothesis)?
- How will we measure success?
- What's the counter-metric risk?

### For Sprint Planning
**Sprint goal format:**
"Improve [input metric] by [X]% through [feature/change], while maintaining [counter-metric] above [Y]."

### For Fundraising
Investors care about:
- **Traction**: North Star growth rate
- **Efficiency**: CAC payback, LTV:CAC ratio
- **Retention**: Cohort curves that flatten (not decline)
- **Market**: TAM and your % penetration

### For Team OKRs

**Company OKR:**
- **Objective**: Become the default solution for [user persona]
- **Key Result 1**: Grow North Star to [X] by [date]
- **Key Result 2**: Improve D30 retention to [Y]%
- **Key Result 3**: Achieve LTV:CAC of 3:1

**Product Team OKR:**
- **Objective**: Accelerate time to value
- **KR1**: Reduce activation time to <[X] minutes
- **KR2**: Increase activation rate to [Y]%
- **KR3**: Maintain NPS >[Z]

**Engineering Team OKR:**
- **Objective**: Deliver reliable, fast experience
- **KR1**: P95 response time <[X]ms
- **KR2**: Error rate <[Y]%
- **KR3**: Deploy frequency: [Z] times per day

---

## Integration with Other Guidelines

### ← User Journey (01-user-journey.md)
North Star Metric = Primary value delivered at critical journey step

### ← Mission Statement (02-mission-statement.md)
North Star Metric = Quantified mission outcome

### → Monetization (04-monetization.md)
Charge when North Star value is delivered

### → Prioritization (../stack/prioritization.md)
Prioritize features by expected impact on input metrics

---

## For AI Coding Agents

When developing features, agents should ask:

1. **Which metric does this improve?**
2. **How will we measure success?**
3. **What's the expected impact?**
4. **How do we track this metric?**
5. **What counter-metrics might be affected?**

**Example Agent Context:**
```json
{
  "metrics_context": {
    "north_star": "Weekly active assessments",
    "current_focus": "Improve activation rate",
    "target_metric": "Activation rate from 30% to 50%",
    "measurement": "% of signups completing first assessment in 24h",
    "counter_metrics": ["Error rate", "NPS score"],
    "tracking": "Segment event: 'assessment_completed'"
  }
}
```

Agents reference `.context/metrics.json` for measurement guidance.

---

## Template: Your Metrics Framework

```markdown
# Success Metrics: [Your Product]

## North Star Metric
**Metric**: [Name]
**Definition**: [Calculation]
**Why**: [Connection to mission]
**Current**: [Value]
**Target**: [Goal by date]

## Input Metrics (Drive North Star)
1. **[Input 1]**: [Current] → [Target]
2. **[Input 2]**: [Current] → [Target]
3. **[Input 3]**: [Current] → [Target]

## Health Metrics (Guardrails)
- **Retention (D30)**: [Current]% (target: >[X]%)
- **NPS**: [Current] (target: >[X])
- **Error Rate**: [Current]% (target: <[X]%)

## Counter-Metrics (Will Not Sacrifice)
1. **[Metric]**: Must stay >[X]
2. **[Metric]**: Must stay <[Y]

## MVP Success Criteria (First 30 Days)
- [ ] [X] activated users
- [ ] [Y]% activation rate
- [ ] [Z]% D7 retention
- [ ] [A] NPS score

## Weekly Review Questions
1. Is North Star trending toward target?
2. Which input metric needs attention?
3. Are health metrics within acceptable ranges?
4. Any counter-metric concerns?
5. What did we learn this week about our metrics?
```

---

**Remember**: Metrics are a compass, not a destination. They guide decisions but don't make decisions for you. Always connect metrics back to user value.

**Next Steps**: Proceed to [04-monetization.md](./04-monetization.md) to design a business model aligned with your value delivery.
