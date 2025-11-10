# User Journey: The Foundation of Everything

> **Start Here** | This is the primary entry point for your Stack-Driven development process. Every decision, feature, and line of code should trace back to user value.

---

## The Post-Modern Axiom

**User Experience is the Core of Every Product.**

All strategic decisions—from technology choices to monetization models—flow from understanding and optimizing the user journey. This isn't just a philosophy; it's a systematic approach to building products that matter.

---

## Why User Journey First?

### 1. Validates the Problem
Before building solutions, understand the problem through the user's eyes. What job are they trying to do? What's their current struggle?

### 2. Informs Strategic Decisions
- **Monetization**: Users pay for value. Define value first.
- **Tech Stack**: Choose technologies that serve user needs, not developer preferences.
- **Features**: Build what users need, not what's technically interesting.
- **Metrics**: Measure what matters to users, not vanity metrics.

### 3. Prevents Feature Bloat
Each feature must serve a specific step in the user journey. If it doesn't, it's bloat.

### 4. Enables Agentic Development
When AI agents understand the user journey, they generate code that serves user needs, not just technical requirements.

---

## User Journey Canvas

Use this framework to map your complete user journey. AI assistants and coding agents should reference this when making development decisions.

### Phase 1: Discovery & Problem Definition

**Questions to Answer:**
- Who are your users? (Be specific, not "everyone")
- What problem are they trying to solve?
- What's their current solution? (Including "doing nothing")
- What triggers them to seek a new solution?
- What's the cost of not solving this problem?

**Output:**
```markdown
## User Personas

### Primary Persona: [Name]
- **Role**:
- **Context**:
- **Pain Points**:
  1.
  2.
  3.
- **Current Workarounds**:
- **Success Looks Like**:
- **Willingness to Pay**:

### Secondary Persona: [Name]
[Repeat structure]
```

---

### Phase 2: Jobs to Be Done

**Framework**: "When I [situation], I want to [motivation], so I can [expected outcome]."

**Example:**
- When I receive a complex document, I want to quickly understand its compliance status, so I can make approval decisions without reading 50 pages.

**Your Jobs:**
```markdown
## Primary Job
When I _____________,
I want to _____________,
so I can _____________.

## Secondary Jobs
1. When _____________, I want _____________, so _____________.
2. When _____________, I want _____________, so _____________.
3. When _____________, I want _____________, so _____________.
```

---

### Phase 3: Core User Flow (Happy Path)

Map the ideal journey from problem awareness to value realization.

**Template:**
```markdown
## Core Flow: [Flow Name]

### Step 1: [Entry Point]
- **User Action**: What they do
- **System Response**: What happens
- **User Feels**: Emotional state
- **Value Delivered**: What they get
- **Potential Friction**: Where they might get stuck
- **Success Metric**: How we measure this step

### Step 2: [Next Action]
[Repeat structure]

### Step 3: [Value Realization]
[Repeat structure]

### Step 4: [Habit Formation]
[Repeat structure]
```

**Time to Value**: How long from signup to "aha moment"?
**Target**: < [X minutes/hours/days]

---

### Phase 4: Friction Points & Solutions

Every journey has friction. Identify and design solutions.

**Template:**
```markdown
## Friction Analysis

| Journey Step | Friction Point | User Impact | Priority | Solution Design |
|--------------|----------------|-------------|----------|-----------------|
| Onboarding   | Account setup  | Drop-off    | High     | OAuth + 1-click |
| First use    | Empty state    | Confusion   | High     | Sample data     |
| [Step]       | [Friction]     | [Impact]    | [P]      | [Solution]      |
```

**Optimization Principle**: Remove friction that doesn't add value. Add friction that prevents mistakes.

---

### Phase 5: Journey Map with Touchpoints

Visualize the complete experience across all touchpoints.

**Template:**
```markdown
## Journey Map: [User Persona]

### Stage 1: Awareness
**Touchpoints**: Website, social media, referral
**User Needs**: Understand what this solves
**User Actions**: Research, compare alternatives
**Emotions**: Skeptical, curious
**Opportunities**: Clear value prop, social proof

### Stage 2: Consideration
**Touchpoints**: Product tour, documentation, pricing page
**User Needs**: Evaluate fit for their specific problem
**User Actions**: Try demo, check pricing, read docs
**Emotions**: Hopeful, evaluating risk
**Opportunities**: Interactive demo, clear ROI, risk mitigation

### Stage 3: Activation
**Touchpoints**: Signup, onboarding, first success
**User Needs**: Quick win, confidence in decision
**User Actions**: Create account, complete setup, first task
**Emotions**: Excited, slightly overwhelmed
**Opportunities**: Guided first experience, early success moment

### Stage 4: Adoption
**Touchpoints**: Daily usage, support, updates
**User Needs**: Efficiency, reliability, support when stuck
**User Actions**: Regular use, explore features, contact support
**Emotions**: Satisfied, habitual
**Opportunities**: Power user features, automation, community

### Stage 5: Advocacy
**Touchpoints**: Referrals, reviews, testimonials
**User Needs**: Share success, get recognition
**User Actions**: Recommend to peers, write reviews
**Emotions**: Proud, evangelical
**Opportunities**: Referral program, case studies, community leadership
```

---

### Phase 6: Value Delivery Framework

Define exactly what value means for your users.

**Template:**
```markdown
## Value Definition

### Functional Value
What does your product DO for users?
- Save time: [Quantify]
- Save money: [Quantify]
- Reduce risk: [Quantify]
- Enable new capability: [Describe]

### Emotional Value
How does your product MAKE USERS FEEL?
- Confident
- In control
- Relieved
- Empowered
- [Your specific emotions]

### Economic Value
What's the ROI for users?
- Direct cost savings: $[X] per [time period]
- Time savings: [Y hours] per [time period] × $[hourly rate]
- Revenue impact: [Z]% increase/decrease
- Risk reduction: [Quantified insurance value]

### Value Equation
[User Gets] ÷ [What User Gives] = Value Ratio

**Target Ratio**: 10:1 or higher
(Users should get 10x more value than what they pay/invest)
```

---

### Phase 7: Metrics That Matter

Connect journey steps to measurable outcomes.

**Template:**
```markdown
## Journey Metrics

### Awareness → Consideration
- **Metric**: Website visit to signup rate
- **Target**: [X]%
- **Why It Matters**: Validates value proposition clarity

### Consideration → Activation
- **Metric**: Signup to first success
- **Target**: [Y]% within [Z] minutes
- **Why It Matters**: Measures onboarding effectiveness

### Activation → Adoption
- **Metric**: Weekly active usage
- **Target**: [X] sessions per week
- **Why It Matters**: Indicates habit formation

### Adoption → Retention
- **Metric**: 30-day retention rate
- **Target**: [Y]%
- **Why It Matters**: Validates sustained value delivery

### Retention → Advocacy
- **Metric**: NPS score, referral rate
- **Target**: NPS > [X], [Y]% referral rate
- **Why It Matters**: Indicates exceptional value delivery
```

---

### Phase 8: Alternative Paths & Edge Cases

Not all journeys are linear. Map the variations.

**Template:**
```markdown
## Journey Variations

### Power User Path
- **Trigger**: [What makes someone a power user]
- **Different Needs**:
- **Optimization Opportunities**:

### Struggling User Path
- **Warning Signs**:
- **Intervention Points**:
- **Recovery Flow**:

### Team/Enterprise Path
- **Different Decision Process**:
- **Additional Stakeholders**:
- **Modified Journey**:

### Mobile-First Path
- **Context Differences**:
- **Interaction Constraints**:
- **Optimizations**:
```

---

## Integration with Other Guidelines

### → Mission Statement (02-mission-statement.md)
Your mission should be a promise to deliver value at a specific journey step.

### → Success Metrics (03-success-metrics.md)
North Star Metric = Primary value delivered in core journey step.

### → Monetization (04-monetization.md)
Charge where value is delivered, not arbitrarily.

### → Tech Stack (../stack/tech-stack.md)
Choose technologies that optimize critical journey steps.

### → Architecture (../stack/architecture-principles.md)
Design systems around user flows, not technical silos.

---

## For AI Coding Agents

When making development decisions, agents should ask:

1. **Which journey step does this code serve?**
2. **Does this reduce friction or add necessary friction?**
3. **How does this improve time-to-value?**
4. **Does this support the primary job-to-be-done?**
5. **Will this metric improve if we implement this well?**

**Example Agent Context:**
```json
{
  "user_journey_context": {
    "current_work": "Onboarding flow optimization",
    "journey_step": "Activation - First Success",
    "success_metric": "Time to first completed assessment < 10 minutes",
    "user_goal": "Quickly validate solution works for their use case",
    "friction_to_remove": "Manual configuration, unclear next steps",
    "value_to_deliver": "Working assessment with real results"
  }
}
```

Agents can reference `.context/user-journey.json` for structured guidance.

---

## Getting Started

### Step 1: Complete This Canvas
Work through each phase with your team or AI assistant. Be specific, not generic.

### Step 2: Validate with Real Users
Interview 5-10 potential users. Adjust your journey map based on reality, not assumptions.

### Step 3: Prioritize Journey Steps
Which step, if optimized, creates the most value? Start there.

### Step 4: Cascade Decisions
Use your validated journey to inform:
- Mission statement
- Success metrics
- Monetization strategy
- Tech stack choices
- Feature roadmap

### Step 5: Reference Continuously
Every sprint planning, every architecture decision, every feature spec should reference the user journey.

---

## Anti-Patterns to Avoid

### ❌ Technology-First Thinking
"We should use microservices because they're scalable"
**Instead**: "Our users need sub-second response times at their peak usage moments, so we need [specific architecture]"

### ❌ Feature-First Thinking
"Let's add AI because everyone's doing it"
**Instead**: "Users struggle at [journey step] because [reason]. AI could [specific solution]."

### ❌ Vanity Metrics
"We have 10,000 signups!"
**Instead**: "85% of users complete their first assessment within 10 minutes"

### ❌ Assumed Journeys
"Users will figure it out"
**Instead**: Test with real users and measure actual behavior

### ❌ One-Size-Fits-All
"All users follow the same path"
**Instead**: Map variations and optimize for each persona

---

## Template: Quick Start

Copy and fill this out:

```markdown
# User Journey: [Your Product]

## Primary User Persona
- **Who**:
- **Problem**:
- **Current Solution**:
- **Our Solution**:

## Primary Job-to-Be-Done
When I _____________, I want to _____________, so I can _____________.

## Core Flow (Happy Path)
1. User [action] → System [response] → User feels [emotion]
2. User [action] → System [response] → User feels [emotion]
3. User [action] → System [response] → Value delivered! ✓

## Key Friction Points
1. [Friction] → [Solution]
2. [Friction] → [Solution]

## North Star Metric
[The one metric that proves users are getting value]

## Success Criteria
- Time to value: < [X] minutes
- Activation rate: > [Y]%
- Retention: > [Z]% at 30 days
```

---

**Remember**: This document is living. Update it as you learn from users. The user journey you design today will evolve—and that's healthy.

**Next Steps**: Proceed to [02-mission-statement.md](./02-mission-statement.md) to translate your user journey into a clear mission.
