---
description: Show Stack-Driven cascade progress and next steps
---

# Cascade Status Check

You are helping the user navigate the Stack-Driven cascade - a systematic approach to building product strategy from user journey through to backlog.

## Your Task

1. **Check which output files exist** in the `/output` directory
2. **Display a visual progress tracker** showing completed and pending sessions
3. **Tell the user exactly what to do next** (which command to run)
4. **Show inputs and outputs** for each cascade stage

## The Cascade Structure

```
Session 1: /refine-journey       → output/00-user-journey.md
Session 2: /choose-tech-stack    → output/01-tech-stack.md
Session 3: /generate-strategy    → output/02-mission.md
                                   output/03-metrics.md
                                   output/04-monetization.md
                                   output/05-architecture.md
Session 4: /create-design         → output/06-design-system.md
Session 5: /generate-backlog      → output/07-backlog/
Session 6: /create-gh-issues      → GitHub issues
```

## Steps to Execute

### Step 1: Check Output Directory

Use the Bash tool or Read tool to check which files exist in `/output`:
- Look for: `00-user-journey.md`, `01-tech-stack.md`, `02-mission.md`, `03-metrics.md`, `04-monetization.md`, `05-architecture.md`, `06-design-system.md`, `07-backlog/`

### Step 2: Display Progress

Create a visual status display like this:

```
📊 Stack-Driven Cascade Status

✅ 00-user-journey.md        (Session 1 complete)
✅ 01-tech-stack.md          (Session 2 complete)
❌ 02-mission.md             (Not started)
❌ 03-metrics.md             (Not started)
❌ 04-monetization.md        (Not started)
❌ 05-architecture.md        (Not started)
❌ 06-design-system.md       (Not started)
❌ 07-backlog/               (Not started)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Progress: ████░░░░░░░░ 33% (2 of 6 sessions complete)
```

### Step 3: Determine Next Step

Based on what files exist, determine the next session:

- **If no files exist**: Next is Session 1 (`/refine-journey`)
- **If only 00-user-journey.md exists**: Next is Session 2 (`/choose-tech-stack`)
- **If 00 and 01 exist**: Next is Session 3 (`/generate-strategy`)
- **If 00-05 exist**: Next is Session 4 (`/create-design`)
- **If 00-06 exist**: Next is Session 5 (`/generate-backlog`)
- **If 00-07 exist**: Next is Session 6 (`/create-gh-issues`)
- **If all exist**: Cascade is complete! Show maintenance options.

### Step 4: Show Next Step Details

For the next session, display:

```
👉 Next Step: Run /generate-strategy

📥 Inputs needed:
- Reads: output/00-user-journey.md (your validated user journey)
- Reads: output/01-tech-stack.md (your chosen tech stack)

📤 Will create:
- output/02-mission.md (mission statement derived from journey)
- output/03-metrics.md (North Star metric and success metrics)
- output/04-monetization.md (pricing strategy aligned with value)
- output/05-architecture.md (architecture principles)

⏱️ Estimated time: 15-20 minutes (AI-assisted conversation)

💡 What happens: I'll analyze your journey and tech stack to derive your strategic foundation - mission, metrics, monetization, and architecture principles. Every decision will trace back to your user journey.
```

### Step 5: Provide Context

Add helpful context:

- **If they're just starting**: Explain the cascade concept
- **If they're mid-cascade**: Show how previous sessions inform the next
- **If they're done**: Congratulate them and suggest next steps (implement, iterate, etc.)

## Example Output

Here's an example of what you should output:

```
📊 Stack-Driven Cascade Status

Your Cascade Progress:
✅ 00-user-journey.md        (Session 1 complete)
❌ 01-tech-stack.md          (Not started)
❌ 02-mission.md             (Not started)
❌ 03-metrics.md             (Not started)
❌ 04-monetization.md        (Not started)
❌ 05-architecture.md        (Not started)
❌ 06-design-system.md       (Not started)
❌ 07-backlog/               (Not started)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Progress: ██░░░░░░░░░░ 17% (1 of 6 sessions complete)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

👉 Next Step: Run /choose-tech-stack

📥 Inputs needed:
- Reads: output/00-user-journey.md (your validated user journey)

📤 Will create:
- output/01-tech-stack.md (tech stack optimized for YOUR journey)

⏱️ Estimated time: 10-15 minutes

💡 What happens: I'll analyze your specific user journey requirements (real-time needs? data complexity? scale? SEO? mobile?) and recommend the optimal tech stack. Different journeys = different tech stacks. For example, a real-time multiplayer game needs different tech than a document processing SaaS.

Your journey will dictate the stack, not generic best practices.

Ready? Run: /choose-tech-stack
```

## Important Guidelines

1. **Always check files** - Don't assume what exists, actually check the /output directory
2. **Be encouraging** - This is a journey, celebrate progress
3. **Be specific** - Tell them EXACTLY what command to run next
4. **Show connections** - Explain how previous outputs inform the next session
5. **Keep it visual** - Use emojis, progress bars, clear sections

## Edge Cases

**If output files exist but are malformed**:
- Note which files might need regeneration
- Suggest they can re-run sessions to overwrite

**If they've skipped sessions**:
- Warn that cascade works best sequentially
- Explain which missing inputs will be needed

**If all sessions complete**:
```
🎉 Cascade Complete!

You've successfully completed all 6 Stack-Driven sessions:
✅ User Journey defined
✅ Tech stack chosen
✅ Strategy established (mission, metrics, monetization, architecture)
✅ Design system created
✅ Backlog generated
✅ GitHub issues created

What's next?
1. 🚀 Start building! Your backlog is prioritized and ready
2. 🔄 Iterate: Run /refine-journey if your understanding evolves
3. 📊 Track metrics: Implement the metrics from output/03-metrics.md
4. 💰 Validate pricing: Test monetization hypotheses from output/04-monetization.md

Reference any output file anytime to guide development decisions.
```

## Reference Files

If helpful, you can also mention:
- `/examples/compliance-saas/` - Complete cascade example for reference
- `/templates/` - Template files used by cascade commands
- `README.md` - Overview of Stack-Driven approach

Now, check the output directory and show the user their cascade status!
