---
description: Session 5 - Create comprehensive brand strategy foundation
---

# Session 5: Create Brand Strategy

This is **Session 5** of the cascade. You'll create a comprehensive brand strategy that expresses the value delivered through your user journey. Brand strategy informs design decisions (colors, typography, personality), so it comes before design in the cascade.

## When to Use This

**Run AFTER Session 4** (`/generate-strategy`) when you have:
- [✓] User journey defined (`product-guidelines/00-user-journey.md`)
- [✓] Product strategy validated (`product-guidelines/01-product-strategy.md`)
- [✓] Tech stack chosen (`product-guidelines/02-tech-stack.md`)
- [✓] Tactical foundation established (`product-guidelines/03a-mission.md`, `03b-metrics.md`, `03c-monetization.md`, `04-architecture.md`)

Your brand should EXPRESS the value you deliver in the user journey, not be created in a vacuum.

**Skip this** if:
- You already have established branding (but consider documenting it)

## Cascade Inputs

This command READS previous outputs to ground your brand in reality:

1. **Read the user journey**:
   ```bash
   Read product-guidelines/00-user-journey.ctx.md  # (context version for token efficiency)
   ```
   - Identify: What problem do users struggle with?
   - Identify: What's the "aha moment" in the journey?
   - Identify: Where does value get delivered?

2. **Read the product strategy**:
   ```bash
   Read product-guidelines/01-product-strategy.ctx.md  # (context version for token efficiency)
   ```
   - Understand your market positioning and competitive differentiation

3. **Read constraints (if exists)**:
   ```bash
   Read product-guidelines/02a-constraints.ctx.md  # (context version for token efficiency, if exists)
   ```
   - Understand limitations that affect brand positioning

4. **Read coding standards (if exists)**:
   ```bash
   Read product-guidelines/02b-coding-standards.ctx.md  # (context version for token efficiency, if exists)
   ```
   - Understand technical culture that affects brand personality

5. **Read AI integration strategy (if exists)**:
   ```bash
   Read product-guidelines/02c-ai-integration-strategy.ctx.md  # (context version for token efficiency, if exists)
   ```
   - Understand AI capabilities that may inform brand messaging

6. **Read the mission**:
   ```bash
   Read product-guidelines/03a-mission.md
   ```
   - Your mission = the promise to deliver journey value
   - Brand purpose should express WHY you keep this promise

7. **Read the metrics** (optional):
   ```bash
   Read product-guidelines/03b-metrics.md
   ```
   - What defines success? Brand should communicate this.

Your brand strategy must connect to these inputs. Don't create brand in isolation.

## Your Task

Create a comprehensive brand strategy document following the instructions below.

### Steps to Execute

1. **FIRST: Read cascade inputs** (see "Cascade Inputs" section above):
   ```bash
   Read product-guidelines/00-user-journey.ctx.md  # (context version for token efficiency)
   Read product-guidelines/01-product-strategy.ctx.md  # (context version for token efficiency)
   Read product-guidelines/02-tech-stack.md  # (no .ctx version, always read full file)
   Read product-guidelines/02a-constraints.ctx.md  # (context version for token efficiency, if exists)
   Read product-guidelines/02b-coding-standards.ctx.md  # (context version for token efficiency, if exists)
   Read product-guidelines/02c-ai-integration-strategy.ctx.md  # (context version for token efficiency, if exists)
   Read product-guidelines/03a-mission.md
   Read product-guidelines/03b-metrics.md  # Optional
   Read product-guidelines/04-architecture.md  # For technical constraints
   ```

2. **Read the template structure**:
   ```bash
   Read templates/05-brand-strategy-template.md
   ```

3. **Interview the user** with journey-informed questions:

   **Brand Purpose (journey-grounded)**:
   - "I've read your user journey. Users struggle with [X problem] at [journey step]. Your mission is to [mission from product-guidelines/03]. Why are YOU the one solving this problem? What drives you to deliver this value?"

   **Core Values (journey-connected)**:
   - "Your user journey shows value gets delivered when [aha moment]. What 3-5 values guide how you deliver this? What won't you compromise on?"

   **Brand Personality**:
   - "When users experience [journey moment], how should your brand show up? Formal or casual? Professional or playful?"

   **Brand Promise (journey-specific)**:
   - "Users move through [journey steps] to get [outcome]. What can they ALWAYS count on from you? What will never change?"

   **Visual Direction**:
   - "What aesthetic fits the [problem domain] and [audience] from your journey?"

   **Differentiation**:
   - "Others solve [problem] differently. How is your approach to [journey value] unique?"

4. **Generate the brand strategy**:
   - Fill out the template connecting EVERY section back to journey/mission
   - Show how brand PURPOSE = WHY you solve [journey problem]
   - Show how brand VALUES = HOW you deliver [journey value]
   - Make it journey-traceable, not generic

5. **Write the output**:
   ```bash
   Write product-guidelines/05-brand-strategy.md
   ```

## Output Location

`product-guidelines/05-brand-strategy.md`

This will be read by:
- `/create-design` (Session 6) - Uses brand strategy to inform design decisions (colors, typography, personality)
- `/discover-naming` - Uses brand strategy to generate journey-aligned names
- `/define-messaging` - Uses brand strategy for messaging framework
- `/create-content-guidelines` - References brand for content style

## Template Structure

The output follows this structure:
- Brand Purpose (why we exist)
- Core Values (3-5 guiding principles)
- Brand Personality (how we show up)
- Brand Promise (what customers can count on)
- Visual Direction (aesthetic guidance)
- Brand Differentiation (how we're different)
- Brand Applications (where brand shows up)

## Key Principles

1. **Be specific** - "Trustworthy" is generic; "We never hide pricing or lock you in" is specific
2. **Be memorable** - Brand should be distinctive and easy to recall
3. **Be authentic** - Don't copy competitors; find your unique voice
4. **Be consistent** - All brand elements should reinforce each other
5. **Think long-term** - Brand is a foundation, not a campaign

## Example Prompt Flow

```
You: I've read your user journey and mission. Your users struggle with [problem from journey] at [journey step], and your mission is to [mission statement].

Let me help you create a brand strategy that expresses this value. First, WHY are YOU the one solving this problem? What drives you beyond profit?

User: [Explains purpose connected to journey]

You: Perfect - that connects directly to the [journey value]. Now, what 3-5 core values guide HOW you deliver this value? Think about trade-offs at [critical journey moment].

User: [Lists values connected to journey delivery]

[Continue through all sections with journey context...]

You: Excellent! I've captured your brand strategy in product-guidelines/05-brand-strategy.md. Every section traces back to your user journey and mission.

[✓] Session 5 complete! Brand strategy created.

Your brand expresses the value from your user journey:
- Purpose: [Why you exist]
- Values: [How you deliver value]
- Personality: [How you show up]

File created: product-guidelines/05-brand-strategy.md

Next, we'll create a design system that brings your brand to life.

When ready, run: /create-design
Or check progress: /cascade-status
```

## After This Session

**Recommended next**:
- `/create-design` (Session 6) - Create design system informed by your brand strategy

**Optional extensions** (can run after Session 6+):
- `/discover-naming` - Generate brand name that expresses journey value
- `/define-messaging` - Create messaging framework from brand + journey

Your brand strategy is now grounded in the user journey and will inform your design system.

## Reference

- Template: `/templates/05-brand-strategy-template.md`
- Example: `/examples/compliance-saas/branding/` (if available)

---

**Now, create a brand strategy that expresses your journey value!**

## After Generating Brand Strategy Document

Once you've written `product-guidelines/05-brand-strategy.md`, invoke the distillation agent to create a context file:

Use the Task tool:
- **subagent_type**: `general-purpose`
- **description**: `Generate brand strategy context file`
- **prompt**:
  ```
  Invoke the context distillation agent to create token-optimized context file.

  Source file: product-guidelines/05-brand-strategy.md
  Output file: product-guidelines/05-brand-strategy.ctx.md

  Follow the distillation agent specification in .claude/agents/distill-context.md to:
  1. Extract brand positioning, personality, and voice guidelines (CRITICAL)
  2. Extract key brand attributes and positioning statements
  3. Remove elaboration on brand development process
  4. Preserve section structure from source file
  5. Achieve 60-70% token reduction
  6. Add source reference header
  7. Write to output file path
  ```

## Output Format

IMPORTANT: Do not use emojis in generated outputs. Use plain text for all communication.
