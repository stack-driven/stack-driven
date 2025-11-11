---
description: PRE-CASCADE - Create brand messaging framework and voice guidelines
---

# Define Brand Messaging (Pre-Cascade Optional)

You are helping the user create a comprehensive brand messaging framework that defines how they communicate with customers. This is an optional pre-cascade step.

## When to Use This

**Run BEFORE Session 1** if:
- You need to establish brand voice and messaging
- You have a brand name and need messaging to match
- You want consistent communication across all touchpoints

**Skip this** if:
- You want to start with user journey and add messaging later
- You're building an internal tool without marketing needs
- You prefer to develop voice organically

## Your Task

Create a brand messaging framework using the prompt in `/prompts/branding/messaging.md`.

### Steps to Execute

1. **Read the messaging prompt**:
   ```bash
   Read /prompts/branding/messaging.md
   ```

2. **Read the template structure**:
   ```bash
   Read /templates/0c-brand-messaging-template.md
   ```

3. **Check for brand inputs** (optional):
   ```bash
   Read output/0a-brand-strategy.md
   Read output/0b-brand-naming.md
   ```
   - If exist: Use brand strategy and chosen name to inform messaging
   - If not exist: Ask user directly about brand direction and name

4. **Interview the user** following the messaging prompt:
   - Target audience (who are you talking to?)
   - Value proposition (what's the core promise?)
   - Brand voice (how do you sound? formal? casual? witty?)
   - Key messages (what do you need to communicate?)
   - Elevator pitch (15-second version)
   - Messaging pillars (3-5 core themes)

5. **Develop messaging framework**:
   - Value proposition (one sentence)
   - Elevator pitch (15-30 seconds)
   - Extended pitch (1 minute)
   - Messaging pillars (3-5 themes with supporting points)
   - Voice and tone guidelines (with examples)
   - Sample copy for key scenarios

6. **Create sample copy** for:
   - Homepage hero headline
   - About us summary
   - Product descriptions
   - Email outreach
   - Social media bio
   - Customer support responses

7. **Write the output**:
   ```bash
   Write output/0c-brand-messaging.md
   ```

## Output Location

`output/0c-brand-messaging.md`

This will be read by:
- `/create-content-guidelines` (Session 08) - Uses messaging for detailed content guide
- `/refine-journey` (Session 1) - Can reference messaging in journey thinking
- User's marketing and content creation efforts

## Template Structure

The output follows this structure:
- Value Proposition (one-line promise)
- Target Audience (who we serve)
- Elevator Pitch (15-second, 30-second, 1-minute versions)
- Messaging Pillars (3-5 core themes)
- Voice Guidelines (how we sound)
- Tone Variations (adjusting for context)
- Sample Copy (real examples)
- Messaging Do's and Don'ts

## Key Principles

1. **Be specific** - "Fast and easy" is generic; "Deploy in 60 seconds" is specific
2. **Lead with benefit** - Customers care about outcomes, not features
3. **Be consistent** - Voice should be recognizable across channels
4. **Be authentic** - Don't fake a personality that doesn't match your values
5. **Test comprehension** - Can a stranger understand your value in 5 seconds?
6. **Show, don't tell** - Demonstrate voice through examples, not descriptions

## Example Prompt Flow

```
You: Let's define your brand messaging. First, let me check if you have brand strategy...

[Check for outputs]

You: I see your brand emphasizes [values] and you're considering names like [finalists]. Now, who is your primary audience? Be specific - title, pain points, context.

User: [Describes audience]

You: Perfect. Now, in one sentence: what's the core value you deliver to this audience? What changes for them when they use your product?

User: [Explains value]

You: Great value prop. Now let's develop your voice. On a scale, where do you fall?
- Formal ←→ Casual
- Professional ←→ Playful
- Serious ←→ Witty
- Corporate ←→ Rebellious

User: [Describes voice]

[Continue developing messaging...]

You: Excellent. Let me create sample copy to demonstrate this voice...

[Generate examples]

You: I've captured your complete messaging framework in output/0c-brand-messaging.md, including:
- Your value proposition: "[specific one-liner]"
- Elevator pitches (15s, 30s, 1min)
- 4 messaging pillars
- Voice guidelines with 10+ examples
- Sample copy for key scenarios

Try reading the homepage hero out loud - does it sound like YOU?
```

## After This Session

**Recommended next**: `/create-content-guidelines` (Session 08) for detailed content style guide
**Or skip to**: `/refine-journey` (Session 1) to start the core cascade

Your messaging framework will serve as the foundation for all customer communication.

---

**Remember**: This is OPTIONAL. Messaging can evolve over time. Some teams prefer to develop voice through real content creation rather than upfront planning.
