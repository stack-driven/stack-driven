---
description: PRE-CASCADE - Create comprehensive product strategy (market, competitive, roadmap)
---

# Create Product Strategy (Pre-Cascade Optional)

You are helping the user create a comprehensive product strategy that covers market analysis, competitive positioning, vision, goals, and roadmap. This is an optional pre-cascade step that's broader than the cascade's Session 3.

## When to Use This

**Run BEFORE Session 1** if:
- You need to analyze market and competitive landscape
- You're pitching to investors or stakeholders
- You need a long-term product vision and roadmap
- You want strategic thinking before tactical cascade

**Skip this** if:
- You want to start with user journey and discover strategy through cascade
- You prefer emergent strategy over planned strategy
- You're building an MVP without long-term planning

**How This Differs from Session 3** (`/generate-strategy`):
- **Session 3**: Derives mission, metrics, monetization, architecture FROM user journey (tactical foundation)
- **This command**: Creates market analysis, competitive positioning, product vision, roadmap (strategic context)
- **Both are valuable**: This provides strategic context; Session 3 provides tactical foundation

## Your Task

Create a comprehensive product strategy document using the prompt in `/prompts/product/product-strategy.md`.

### Steps to Execute

1. **Read the product strategy prompt**:
   ```bash
   Read /prompts/product/product-strategy.md
   ```

2. **Read the template structure**:
   ```bash
   Read /templates/0d-product-strategy-template.md
   ```

3. **Check for brand inputs** (optional):
   ```bash
   Read output/0a-brand-strategy.md
   ```
   - If exists: Align product strategy with brand purpose
   - If not exists: Product strategy can inform brand later

4. **Interview the user** following the product strategy prompt:
   - **Vision**: Where is the product going? (3-5 year horizon)
   - **Market analysis**: TAM/SAM/SOM, trends, dynamics
   - **Competitive landscape**: Who else solves this? How are you different?
   - **Positioning**: How do customers perceive you?
   - **Strategic goals**: What must be true for success? (12-24 months)
   - **Product principles**: What guides your product decisions?
   - **Roadmap themes**: What are the major initiatives?
   - **Risks and assumptions**: What could go wrong?

5. **Develop product strategy**:
   - Vision statement (aspirational but credible)
   - Market sizing with bottom-up validation
   - Competitive analysis (2x2 positioning map)
   - Positioning statement (who, what, how, why)
   - 3-5 strategic goals with success criteria
   - Product principles (decision-making framework)
   - Roadmap themes (not detailed features)
   - Risk register with mitigations

6. **Write the output**:
   ```bash
   Write output/0d-product-strategy.md
   ```

## Output Location

`output/0d-product-strategy.md`

This will inform:
- `/refine-journey` (Session 1) - Journey should support strategic goals
- `/generate-strategy` (Session 3) - Mission/metrics should align with vision
- Investor/stakeholder conversations
- Long-term product planning

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
You: Let's create your product strategy. First, paint me a picture: it's 3 years from now and your product is wildly successful. What does that look like? Who's using it? How has the world changed?

User: [Describes vision]

You: Love it. Now let's ground that in market reality. Who are your competitors? Don't say "no one" - who do your customers use TODAY to solve this problem, even if it's manual?

User: [Describes competitive landscape]

You: Perfect. Now let's size the market. Forget the "$2 trillion industry" top-down nonsense. Bottom-up: how many potential customers are there? What would they pay? Show me your math.

User: [Calculates market size]

You: Great, that's much more credible. Now: what are 3-5 things that MUST be true in the next 12-24 months for you to achieve your vision?

User: [Lists strategic goals]

[Continue through all sections...]

You: Excellent. I've captured your complete product strategy in output/0d-product-strategy.md:
- Vision: [one-liner]
- Market: [TAM/SAM/SOM]
- Positioning: [differentiation]
- 5 strategic goals with success criteria
- 4 product principles
- 6 roadmap themes
- Risk register

This gives you the strategic context. When you're ready, run /refine-journey to start the tactical cascade.
```

## After This Session

**Recommended next**: `/refine-journey` (Session 1) to start the core cascade
**Optional**: Run branding commands if you haven't yet

**Important**: This document is strategic context. The cascade (Sessions 1-6) will create the tactical execution plan. Both are valuable and complementary.

---

**Remember**: This is OPTIONAL. Many successful products start with user journey and discover strategy through building. Use this if you need strategic clarity before tactical execution.
