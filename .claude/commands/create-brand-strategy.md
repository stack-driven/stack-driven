---
description: POST-CASCADE - Create comprehensive brand strategy foundation
---

# Create Brand Strategy (Post-Core Extension)

You are helping the user create a comprehensive brand strategy AFTER they have completed the core cascade. This strategy expresses the value they deliver through their user journey.

## When to Use This

**Run AFTER Session 5** (`/generate-backlog`) when you have:
- ✅ User journey defined (`output/00-user-journey.md`)
- ✅ Mission statement (`output/02-mission.md`)
- ✅ Metrics identified (`output/03-metrics.md`)
- ✅ Backlog created (`output/07-backlog/`)

Your brand should EXPRESS the value you deliver in the user journey, not be created in a vacuum.

**Skip this** if:
- You already have established branding
- You're building an internal tool without brand needs
- You don't need formal brand strategy documentation

## Cascade Inputs

This command READS previous outputs to ground your brand in reality:

1. **Read the user journey**:
   ```bash
   Read output/00-user-journey.md
   ```
   - Identify: What problem do users struggle with?
   - Identify: What's the "aha moment" in the journey?
   - Identify: Where does value get delivered?

2. **Read the mission**:
   ```bash
   Read output/02-mission.md
   ```
   - Your mission = the promise to deliver journey value
   - Brand purpose should express WHY you keep this promise

3. **Read the metrics** (optional):
   ```bash
   Read output/03-metrics.md
   ```
   - What defines success? Brand should communicate this.

Your brand strategy must connect to these inputs. Don't create brand in isolation.

## Your Task

Create a comprehensive brand strategy document by following the prompt in `/prompts/branding/brand-strategy.md`.

### Steps to Execute

1. **FIRST: Read cascade inputs** (see "Cascade Inputs" section above):
   ```bash
   Read output/00-user-journey.md
   Read output/02-mission.md
   Read output/03-metrics.md  # Optional
   ```

2. **Read the template structure**:
   ```bash
   Read templates/08-brand-strategy-template.md
   ```

3. **Interview the user** with journey-informed questions:

   **Brand Purpose (journey-grounded)**:
   - "I've read your user journey. Users struggle with [X problem] at [journey step]. Your mission is to [mission from output/02]. Why are YOU the one solving this problem? What drives you to deliver this value?"

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
   Write output/08-brand-strategy.md
   ```

## Output Location

`output/08-brand-strategy.md`

This will be read by:
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

You: Excellent! I've captured your brand strategy in output/08-brand-strategy.md. Every section traces back to your user journey and mission.

Next steps:
- Run /discover-naming to generate a brand name that expresses this journey value
- Run /define-messaging to create journey-aligned messaging
```

## After This Session

**Recommended next**:
- `/discover-naming` - Generate brand name that expresses journey value
- `/define-messaging` - Create messaging framework from brand + journey

**Alternative**:
- `/create-content-guidelines` - Skip naming and go straight to content strategy

Your brand strategy is now grounded in the user journey and can inform all downstream brand work.

---

**Remember**: This is POST-CORE. Only run after you have user journey, mission, and strategy defined. Brand expresses journey value, it doesn't precede it.
