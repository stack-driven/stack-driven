---
description: PRE-CASCADE - Create comprehensive brand strategy foundation
---

# Create Brand Strategy (Pre-Cascade Optional)

You are helping the user create a comprehensive brand strategy BEFORE they start the Stack-Driven cascade. This is an optional pre-cascade step that establishes brand identity.

## When to Use This

**Run BEFORE Session 1** if:
- You're starting a new product from scratch
- You need to establish brand identity before defining user journey
- You want brand thinking to inform all downstream decisions

**Skip this** if:
- You already have established branding
- You're building an internal tool without brand needs
- You want to start with user journey and add branding later

## Your Task

Create a comprehensive brand strategy document by following the prompt in `/prompts/branding/brand-strategy.md`.

### Steps to Execute

1. **Read the brand strategy prompt**:
   ```bash
   Read /prompts/branding/brand-strategy.md
   ```

2. **Read the template structure**:
   ```bash
   Read /templates/0a-brand-strategy-template.md
   ```

3. **Interview the user** following the brand strategy prompt:
   - Brand purpose (why the brand exists beyond profit)
   - Core values (3-5 values that guide decisions)
   - Brand personality (tone, voice, character traits)
   - Brand promise (what customers can count on)
   - Visual direction (aesthetic, mood, references)
   - Differentiation (how you're different from competitors)

4. **Generate the brand strategy**:
   - Fill out the template with specific, actionable content
   - Ensure all sections connect to the brand purpose
   - Make it memorable and distinctive

5. **Write the output**:
   ```bash
   Write output/0a-brand-strategy.md
   ```

## Output Location

`output/0a-brand-strategy.md`

This will be read by:
- `/discover-naming` (Session 0b) - Uses brand strategy to generate names
- `/define-messaging` (Session 0c) - Uses brand strategy for messaging framework
- `/refine-journey` (Session 1) - Can reference brand values in journey thinking

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
You: Let's create your brand strategy. First, why does this product exist beyond making money? What problem in the world does it solve?

User: [Explains purpose]

You: Great. Now, what are 3-5 core values that will guide every decision you make? Think about trade-offs - what won't you compromise on?

User: [Lists values]

[Continue through all sections...]

You: Perfect! I've captured your brand strategy in output/0a-brand-strategy.md.

Next steps:
- Run /discover-naming to generate brand names that fit this strategy
- Or skip to /refine-journey if you already have a name
```

## After This Session

**Recommended next**: `/discover-naming` (to generate a name that fits your brand)
**Or skip to**: `/refine-journey` (Session 1) if you already have a name

Your brand strategy will inform naming, messaging, and can be referenced throughout the cascade.

---

**Remember**: This is OPTIONAL. Many users start with `/refine-journey` and add branding later. Use your judgment based on the user's needs.
