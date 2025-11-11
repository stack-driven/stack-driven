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

## After This Session

**Recommended next**:
- Use this for investor/stakeholder presentations
- Run `/create-brand-strategy` if you need brand positioning
- Continue with Session 4-6 if you haven't completed core cascade

**Important**: This validates your journey with market reality. It's strategic documentation of the tactical foundation you built in Sessions 1-3.

---

**Remember**: This is POST-CORE. It validates journey with market context, not created in isolation. Everything connects back to the user journey.
