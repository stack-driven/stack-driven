# Prioritization Framework: Making Trade-Offs

> With infinite ideas and finite resources, prioritization is the most important skill. This framework helps you say "yes" to the right things and "no" to everything else.

---

## The Prioritization Hierarchy

All decisions flow from your strategic foundation:

```
1. User Journey (foundation/01-user-journey.md)
   → Does this serve a critical journey step?

2. Mission (foundation/02-mission-statement.md)
   → Does this advance our mission outcome?

3. Metrics (foundation/03-success-metrics.md)
   → Does this improve our North Star or input metrics?

4. Monetization (foundation/04-monetization.md)
   → Does this enable or enhance monetization?
```

**If a feature doesn't connect to at least one of these, it's a distraction.**

---

## The RICE Framework (Reach × Impact × Confidence ÷ Effort)

### Formula

```
Priority Score = (Reach × Impact × Confidence) ÷ Effort
```

### Components

**Reach**: How many users will this affect in a time period?
- Measured in users/quarter
- Example: 1,000 users will use this feature in next quarter

**Impact**: How much will this improve the user experience or metrics?
- Scale: 0.25 (minimal), 0.5 (low), 1.0 (medium), 2.0 (high), 3.0 (massive)
- Example: 2.0 (significantly improves key journey step)

**Confidence**: How sure are we about reach and impact?
- Scale: 50% (low data), 80% (medium data), 100% (high data)
- Example: 80% (we have user interviews but no A/B test data)

**Effort**: How much time will this take?
- Measured in person-months
- Example: 2 person-months

### Calculation Example

```
Feature: Batch document assessment

Reach: 500 users will use this in Q1
Impact: 2.0 (high - saves significant time)
Confidence: 80% (validated through interviews)
Effort: 1 person-month

Score = (500 × 2.0 × 0.8) ÷ 1 = 800
```

---

## The Value vs Effort Matrix

### Four Quadrants

```
High Value, Low Effort     → DO NOW (Quick Wins)
High Value, High Effort    → DO NEXT (Big Bets)
Low Value, Low Effort      → DO LATER (Fill-ins)
Low Value, High Effort     → DON'T DO (Money Pits)
```

### Mapping Features

**Quick Wins (Do Now):**
- **Example**: Add export to CSV button
- **Why**: Users requested, takes 4 hours, clear value

**Big Bets (Do Next):**
- **Example**: Build batch processing workflow
- **Why**: High impact on North Star, but 3-week effort

**Fill-ins (Do Later):**
- **Example**: Dark mode
- **Why**: Nice to have, easy to build, but not critical

**Money Pits (Don't Do):**
- **Example**: Custom report builder with visual editor
- **Why**: 2-month effort, only 5 users asked for it

---

## The MoSCoW Method

### Must Have
**Criteria**: Product doesn't work without this. Mission-critical.

**Examples:**
- User authentication
- Core workflow (document assessment)
- Payment processing

**Test**: "Would we delay launch without this?" → Yes = Must Have

### Should Have
**Criteria**: Important but not vital. Product works without it, but much better with it.

**Examples:**
- Email notifications
- Usage dashboard
- Team collaboration features

**Test**: "Would users complain if missing?" → Loudly = Should Have

### Could Have
**Criteria**: Nice to have if time permits. Small impact on experience.

**Examples:**
- Dark mode
- Keyboard shortcuts
- Custom branding

**Test**: "Would 10% of users notice?" → Yes = Could Have

### Won't Have (This Time)
**Criteria**: Good idea, wrong time. Explicitly deferred.

**Examples:**
- Mobile app (focus on web first)
- Enterprise SSO (when we have enterprise customers)
- Multi-language support (when we expand markets)

**Test**: "Is this strategic for our current stage?" → No = Won't Have

---

## The ICE Framework (Impact × Confidence × Ease)

Simpler than RICE, good for rapid prioritization.

### Formula

```
Score = Impact × Confidence × Ease
```

**Scale**: Each component rated 1-10

### Example

```
Feature: One-click compliance report

Impact: 8 (directly serves mission outcome)
Confidence: 9 (users explicitly requested this)
Ease: 7 (straightforward to implement)

Score = 8 × 9 × 7 = 504
```

---

## The Kano Model (Delighters vs Table Stakes)

### Categories

**Basic Expectations (Table Stakes)**
- Presence: Expected (no delight)
- Absence: Angry users
- **Examples**: Security, uptime, data accuracy
- **Strategy**: Must do, but don't over-invest

**Performance Features (Linear Value)**
- More = Better (linearly)
- **Examples**: Speed, accuracy, cost
- **Strategy**: Optimize continuously

**Delighters (Differentiators)**
- Presence: Wow factor
- Absence: No complaint (they don't expect it)
- **Examples**: AI-powered insights, beautiful design, automation
- **Strategy**: Focus here for competitive advantage

**Indifferent**
- Presence/Absence: Users don't care
- **Examples**: Features you think are cool but users ignore
- **Strategy**: Don't build these

### Test Framework

Survey users:
1. "How would you feel if we **had** this feature?"
2. "How would you feel if we **didn't have** this feature?"

**Responses:**
- I like it / I expect it / I'm neutral / I can tolerate it / I dislike it

**Classification:**
- **Delighter**: Like it + Neutral about absence
- **Performance**: Like it + Dislike absence (linear)
- **Basic**: Expect it + Dislike absence
- **Indifferent**: Neutral + Neutral

---

## Prioritization by Product Stage

### Pre-PMF: Prioritize Learning

**Question**: What will teach us the most about product-market fit?

**Framework**:
```
Priority = Learning Value ÷ Effort
```

**Examples:**
- ✅ Ship minimal feature to 10 users → High learning
- ✅ User interview with key persona → High learning
- ❌ Polish UI before validating value → Low learning
- ❌ Build scalability before proving demand → Low learning

**Metrics**: Qualitative feedback, retention rate, "would you be disappointed without this product?"

### Early PMF: Prioritize Core Loop

**Question**: What strengthens the core value delivery loop?

**Framework**:
```
Priority = Impact on North Star ÷ Effort
```

**Examples:**
- ✅ Reduce time to first value
- ✅ Increase frequency of core action
- ✅ Improve success rate of core workflow
- ❌ Add secondary features
- ❌ Optimize edge cases

**Metrics**: Activation rate, retention, frequency of core action

### Growth: Prioritize Expansion

**Question**: What unlocks the next order of magnitude of users?

**Framework**:
```
Priority = (New Users Unlocked × LTV) ÷ Effort
```

**Examples:**
- ✅ Remove onboarding friction (widen funnel)
- ✅ Add viral/referral mechanics
- ✅ Build integrations with popular platforms
- ✅ Self-serve enterprise features
- ❌ Power-user features (small audience)

**Metrics**: Activation rate, viral coefficient, channel diversity

### Scale: Prioritize Efficiency & Moats

**Question**: What increases margin or defensibility?

**Framework**:
```
Priority = (Cost Savings + Competitive Moat) ÷ Effort
```

**Examples:**
- ✅ Infrastructure optimization (reduce costs)
- ✅ Platform/marketplace features (network effects)
- ✅ Unique data advantages
- ✅ Enterprise features (higher LTV)
- ❌ Me-too features (no moat)

**Metrics**: Gross margin, NPS, switching costs, market share

---

## The One Thing Framework

**Question**: If you could only ship ONE thing this quarter, what would it be?

**Why This Works:**
- Forces brutal prioritization
- Reveals true priorities (not nice-to-haves)
- Creates focus

**Process:**
1. List all potential features
2. Force rank them (#1, #2, #3...)
3. Ask: "If we could only ship #1, would we achieve our quarterly goal?"
   - Yes → Ship #1, consider #2
   - No → Re-evaluate goals or #1 choice

**Example:**
```
Q1 Goal: Increase North Star (weekly assessments) by 50%

Options:
1. Batch assessment feature → Enables 10x more assessments per user
2. Mobile app → Enables on-the-go usage
3. Team collaboration → Enables multiple users per account

One Thing: Batch assessment (directly 10x's North Star metric)
```

---

## Feature Request Framework

### Handling User Requests

Not all user requests should be built.

**Questions to Ask:**

1. **How many users requested this?**
   - 1 user = Probably not
   - 10 users = Investigate
   - 50% of users = Prioritize

2. **Does it align with our mission?**
   - Yes → Consider
   - No → Politely decline

3. **What's the underlying need?**
   - User says: "I want a custom report builder"
   - Underlying need: "I need to show specific metrics to my boss"
   - Solution: Pre-built report templates (10% of effort)

4. **Can they pay for it now?**
   - Willing to pay today → High priority
   - "I would pay if it existed" → Medium priority
   - Free users requesting → Low priority

5. **Is there a workaround?**
   - Yes → Document workaround, defer feature
   - No → Higher priority

### Response Template

```
Thanks for the suggestion! We're always looking for ways to improve.

A few questions to help us prioritize:
1. How often would you use this feature?
2. What's your current workaround?
3. If we don't build this, would it prevent you from using our product?

This helps us understand the importance relative to other requests.
```

---

## The Product Roadmap Structure

### Now (Current Quarter)

**Contents**: Committed work, actively being built

**Characteristics:**
- Specific features with clear specs
- Assigned to teams/individuals
- Measurable success criteria

**Example:**
```
Q1 2025 - Now
✓ Batch assessment workflow (increases North Star 2x)
✓ Email notifications (reduces support burden)
⧗ API v2 with webhooks (enables integrations)
```

### Next (1-2 Quarters)

**Contents**: Planned work, not yet committed

**Characteristics:**
- Feature themes, not detailed specs
- Dependent on "Now" success
- Subject to change based on learnings

**Example:**
```
Q2-Q3 2025 - Next
- Mobile app (pending validation of mobile use cases)
- Enterprise SSO (when we have 5+ enterprise customers)
- Advanced analytics dashboard (pending user research)
```

### Later (3+ Quarters)

**Contents**: Ideas and possibilities

**Characteristics:**
- Strategic bets
- Market-dependent
- Very subject to change

**Example:**
```
H2 2025 & Beyond - Later
- AI-powered compliance recommendations
- Industry-specific workflows
- White-label offering
```

### Never (Explicitly Declined)

**Contents**: Requests we've decided not to build

**Why**: Clarifies scope, prevents re-discussion

**Example:**
```
Decided Not to Build:
- Desktop app (web covers use cases)
- Blockchain integration (no user value)
- Gamification (not aligned with mission)
```

---

## Decision-Making Framework

### For Any Feature Request

```
1. Strategic Fit
   ☐ Serves user journey step?
   ☐ Advances mission outcome?
   ☐ Improves key metric?
   ☐ Enables/enhances monetization?

2. User Validation
   ☐ How many users requested? _____
   ☐ Validated through interviews? Yes / No
   ☐ Would they pay for it? Yes / No / NA
   ☐ Frequency of use: Daily / Weekly / Monthly / Rare

3. Impact Estimation
   ☐ Expected impact on North Star: _____
   ☐ Expected impact on input metrics: _____
   ☐ Confidence level: Low / Medium / High

4. Effort Estimation
   ☐ Engineering effort: _____ person-weeks
   ☐ Design effort: _____ person-weeks
   ☐ Dependencies: _____
   ☐ Technical risk: Low / Medium / High

5. Alternatives Considered
   ☐ Could a simpler solution work?
   ☐ Is there a third-party tool?
   ☐ Can users use a workaround?

6. Decision
   ☐ Do Now
   ☐ Do Next (add to roadmap)
   ☐ Do Later (parking lot)
   ☐ Don't Do (explain why)
```

---

## Integration with Other Guidelines

### ← User Journey (../foundation/01-user-journey.md)
Prioritize features that optimize critical journey steps

### ← Mission (../foundation/02-mission-statement.md)
Features must advance mission outcome

### ← Metrics (../foundation/03-success-metrics.md)
Prioritize by expected impact on North Star

### ← Monetization (../foundation/04-monetization.md)
Consider revenue impact in prioritization

---

## For AI Coding Agents

When evaluating implementation approaches, agents should:

1. **Prefer simple over clever**: Simple ships faster
2. **Question scope**: Can we ship 20% of this for 80% of value?
3. **Consider maintenance**: Will this create ongoing burden?
4. **Check reversibility**: Can we easily roll back if wrong?

**Example Agent Context:**
```json
{
  "prioritization_context": {
    "current_focus": "improve_activation_rate",
    "north_star_goal": "50% increase in weekly assessments",
    "framework": "RICE",
    "quick_wins_threshold": "< 3 days effort AND > 10% impact",
    "must_have_criteria": "blocks_mission_outcome",
    "should_defer": "< 5 user requests OR low confidence"
  }
}
```

Agents reference `.context/priorities.json` for decision guidance.

---

## Template: Feature Prioritization

```markdown
# Feature: [Name]

## Strategic Alignment
- User Journey: [Which step does this serve?]
- Mission: [How does this advance mission?]
- Metrics: [Expected impact on metrics]
- Monetization: [Revenue impact?]

## User Validation
- Requests: [Number of users who asked]
- Interviews: [Summary of feedback]
- Willingness to Pay: [Yes/No]
- Usage Frequency: [Daily/Weekly/Monthly]

## RICE Score
- Reach: [Users affected per quarter]
- Impact: [0.25 / 0.5 / 1.0 / 2.0 / 3.0]
- Confidence: [50% / 80% / 100%]
- Effort: [Person-months]
- **Score**: [Calculation]

## Decision
- [ ] Do Now (this sprint/quarter)
- [ ] Do Next (next 1-2 quarters)
- [ ] Do Later (3+ quarters)
- [ ] Don't Do (explain why)

## Success Criteria
If we ship this, we expect:
- [Metric 1]: [Current] → [Target]
- [Metric 2]: [Current] → [Target]
```

---

**Remember**: Saying "no" is as important as saying "yes". Focus is the ultimate competitive advantage.

**The key insight**: Your users don't want features—they want their problem solved. Everything else is noise until you nail the core loop.
