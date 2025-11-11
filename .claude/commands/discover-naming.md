---
description: PRE-CASCADE - Generate and evaluate brand name candidates
---

# Discover Brand Naming (Pre-Cascade Optional)

You are helping the user discover the perfect brand name through systematic generation, trademark research, and evaluation. This is an optional pre-cascade step.

## When to Use This

**Run BEFORE Session 1** if:
- You need a brand name for your product
- You want to explore naming options systematically
- You need trademark availability checking

**Skip this** if:
- You already have a validated brand name
- You're building an internal tool without branding needs
- You want to start with user journey and name later

## Your Task

Generate brand name candidates and evaluate them using the prompt in `/prompts/branding/naming-discovery.md`.

### Steps to Execute

1. **Read the naming discovery prompt**:
   ```bash
   Read /prompts/branding/naming-discovery.md
   ```

2. **Read the template structure**:
   ```bash
   Read /templates/0b-brand-naming-template.md
   ```

3. **Check for brand strategy** (optional input):
   ```bash
   Read output/0a-brand-strategy.md
   ```
   - If exists: Use brand purpose, values, personality to guide naming
   - If not exists: Ask user directly about brand direction

4. **Interview the user** following the naming prompt:
   - Naming direction (descriptive? abstract? metaphorical?)
   - Keywords and themes to explore
   - Names to avoid (competitor names, styles)
   - Domain requirements (.com required? ok with .io?)
   - Trademark concerns (geography, industry)

5. **Generate 20-30 name candidates** across categories:
   - Descriptive names (say what you do)
   - Metaphorical names (suggest the benefit)
   - Abstract names (invented words)
   - Compound names (two words combined)
   - Acronyms (if appropriate)

6. **Trademark research** for top candidates:
   - Check USPTO database (use WebSearch or guide user to check)
   - Check domain availability (guide user to check key TLDs)
   - Flag high-risk names (too similar to existing brands)

7. **Narrow to 10 finalists** with:
   - Rationale for each name
   - Trademark risk assessment
   - Domain availability
   - Pros and cons

8. **Write the output**:
   ```bash
   Write output/0b-brand-naming.md
   ```

## Output Location

`output/0b-brand-naming.md`

This will be read by:
- `/define-messaging` (Session 0c) - Uses chosen name in messaging
- User's decision-making process (narrow to final name)

## Template Structure

The output follows this structure:
- Naming Strategy (direction and criteria)
- All Candidates (20-30 names organized by category)
- Trademark Research Summary
- 10 Finalists (with detailed analysis)
- Recommendation (top 3 with reasoning)

## Key Principles

1. **Quantity first** - Generate many options before judging
2. **Diverse styles** - Explore different naming approaches
3. **Check availability** - Don't fall in love with unavailable names
4. **Say it out loud** - Names should sound good spoken
5. **Test memorability** - Can someone recall it after one mention?
6. **Consider global** - How does it work in other languages?

## Example Prompt Flow

```
You: Let's discover your brand name. First, do you have a brand strategy document?

[Check for output/0a-brand-strategy.md]

You: Great, I see your brand strategy emphasizes [values]. Now, what naming direction appeals to you? Descriptive (like "Salesforce"), abstract (like "Google"), or metaphorical (like "Amazon")?

User: [Explains preference]

You: Perfect. Let me generate 20-30 candidates across different styles...

[Generate names]

You: Here are 30 candidates organized by category. Now let me research trademark availability for the most promising ones...

[Research]

You: Based on trademark research and brand fit, here are your 10 finalists...

[Show finalists with analysis]

You: I've saved everything to output/0b-brand-naming.md. My top 3 recommendations are:
1. [Name] - Available, memorable, fits brand
2. [Name] - Strong differentiation, .com available
3. [Name] - Safe trademark, easy to say

Which direction do you want to explore further?
```

## After This Session

**Recommended next**: `/define-messaging` (to create messaging for your chosen name)
**Or skip to**: `/refine-journey` (Session 1) if ready to start cascade

**Important**: User doesn't need to finalize name immediately. This document serves as a reference for decision-making.

---

**Remember**: This is OPTIONAL. Use only if naming is a current need. Many products evolve names over time.
