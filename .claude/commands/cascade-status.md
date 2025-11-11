---
description: Show complete Stack-Driven framework progress (pre-cascade, core, post-cascade)
---

# Complete Framework Status Check

You are helping the user navigate the complete Stack-Driven framework - including optional pre-cascade branding/strategy, core cascade (Sessions 1-6), and post-cascade extensions (UX, analytics, operations).

## Your Task

1. **Check which output files exist** in the `/output` directory
2. **Display a visual progress tracker** showing pre-cascade, core cascade, and post-cascade
3. **Tell the user exactly what to do next** (which command to run and why)
4. **Show how everything connects** - what reads what

## Complete Framework Structure

### Pre-Cascade (Optional - Branding & Strategy)

**Run BEFORE Session 1 if you want branding and strategic foundation**:

```
0a. /create-brand-strategy    → output/0a-brand-strategy.md
0b. /discover-naming           → output/0b-brand-naming.md
0c. /define-messaging          → output/0c-brand-messaging.md
0d. /create-product-strategy   → output/0d-product-strategy.md
```

**When to use**:
- New product needing brand identity
- Need market analysis and competitive positioning
- Want strategic context before tactical execution

**When to skip**:
- Already have established branding
- Want to start with user journey and add branding later
- Building internal tool without brand needs

---

### Core Cascade (Required - Sessions 1-6)

**The main Stack-Driven flow**:

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

**This is the core** - journey through to backlog. Always recommend starting here unless user explicitly wants branding first.

---

### Post-Cascade (Optional - Extensions)

**Run AFTER core cascade to add detailed planning**:

```
08. /create-content-guidelines  → output/08-content-guidelines.md
    (Run after 0c or Session 4 - detailed content style guide)

09. /design-user-experience     → output/09-user-experience.md
    (Run after Session 3 - detailed UX research, flows, wireframes)

10. /setup-analytics            → output/10-analytics-plan.md
    (Run after Session 3 - detailed analytics implementation)

11. /plan-deployment            → output/11-deployment-plan.md
    (Run after Session 5 - deployment strategy and CI/CD)

12. /design-observability       → output/12-observability-strategy.md
    (Run after Session 5 - monitoring, alerts, SLOs)

XX. /review-code                → (No output file - use during development)
```

## Steps to Execute

### Step 1: Check Output Directory

Use Bash to check which files exist:

```bash
ls -la /home/user/stack-driven/output/
```

Look for:
- **Pre-cascade**: `0a-brand-strategy.md`, `0b-brand-naming.md`, `0c-brand-messaging.md`, `0d-product-strategy.md`
- **Core cascade**: `00-user-journey.md`, `01-tech-stack.md`, `02-mission.md`, `03-metrics.md`, `04-monetization.md`, `05-architecture.md`, `06-design-system.md`, `07-backlog/`
- **Post-cascade**: `08-content-guidelines.md`, `09-user-experience.md`, `10-analytics-plan.md`, `11-deployment-plan.md`, `12-observability-strategy.md`

### Step 2: Display Complete Progress

Create a comprehensive visual status display:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Stack-Driven Complete Framework Status
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PRE-CASCADE (Optional - Branding & Strategy)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ 0a-brand-strategy.md      (Branding foundation)
❌ 0b-brand-naming.md         (Not started)
❌ 0c-brand-messaging.md      (Not started)
❌ 0d-product-strategy.md     (Not started)

Status: 1 of 4 pre-cascade sessions complete (optional)

CORE CASCADE (Required - Sessions 1-6)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ 00-user-journey.md        (Session 1 ✓)
✅ 01-tech-stack.md          (Session 2 ✓)
❌ 02-mission.md             (Not started)
❌ 03-metrics.md             (Not started)
❌ 04-monetization.md        (Not started)
❌ 05-architecture.md        (Not started)
❌ 06-design-system.md       (Not started)
❌ 07-backlog/               (Not started)

Progress: ████░░░░░░░░ 33% (2 of 6 core sessions complete)

POST-CASCADE (Optional - Extensions)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
❌ 08-content-guidelines.md  (Not started - run after messaging/design)
❌ 09-user-experience.md     (Not started - run after Session 3)
❌ 10-analytics-plan.md      (Not started - run after Session 3)
❌ 11-deployment-plan.md     (Not started - run after Session 5)
❌ 12-observability-strategy.md (Not started - run after Session 5)

Status: 0 of 5 post-cascade sessions complete (optional)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Step 3: Determine Next Step

Based on what files exist, determine the next recommended action:

#### Decision Logic:

**If no core cascade files exist**:
- **Recommend**: Start with Session 1 (`/refine-journey`)
- **Alternative**: If they want branding first, suggest `/create-brand-strategy`

**If pre-cascade started but incomplete**:
- **Recommend**: Continue pre-cascade OR skip to Session 1
- Explain: Pre-cascade is optional and can be done later

**If only 00-user-journey.md exists**:
- **Recommend**: Session 2 (`/choose-tech-stack`)

**If 00 and 01 exist**:
- **Recommend**: Session 3 (`/generate-strategy`)

**If 00-05 exist (Session 3 complete)**:
- **Recommend**: Session 4 (`/create-design`)
- **Also suggest** (optional): `/design-user-experience` (detailed UX before design system)
- **Also suggest** (optional): `/setup-analytics` (plan analytics implementation)

**If 00-06 exist (Session 4 complete)**:
- **Recommend**: Session 5 (`/generate-backlog`)
- **Also suggest** (optional): `/create-content-guidelines` (if messaging exists)

**If 00-07 exist (Session 5 complete)**:
- **Recommend**: Session 6 (`/create-gh-issues`)
- **Also suggest** (optional): `/plan-deployment` and `/design-observability` (ops planning)

**If all core cascade complete**:
- **Congratulate** them!
- **Recommend**: Post-cascade extensions (analytics, deployment, observability)
- **Or**: Start building! Backlog is ready.

### Step 4: Show Next Step Details

For the next recommended session, display:

```
👉 Next Step: Run /generate-strategy

📥 Reads (cascade inputs):
- output/00-user-journey.md (your validated user journey)
- output/01-tech-stack.md (your chosen tech stack)

📤 Will create:
- output/02-mission.md (mission statement derived from journey)
- output/03-metrics.md (North Star metric and success metrics)
- output/04-monetization.md (pricing strategy aligned with value)
- output/05-architecture.md (architecture principles)

⏱️ Estimated time: 15-20 minutes (AI-assisted conversation)

💡 What happens: I'll analyze your journey and tech stack to derive your strategic foundation - mission, metrics, monetization, and architecture principles. Every decision will trace back to your user journey.

🔗 Cascades to:
- Session 4: Design system will implement your architecture principles
- Session 5: Backlog will be prioritized by your metrics
- Optional: /setup-analytics will implement detailed event tracking for your metrics
- Optional: /design-user-experience will create detailed UX design

Ready? Run: /generate-strategy
```

### Step 5: Show Optional Extensions

If appropriate, suggest optional post-cascade commands:

```
💡 Optional Extensions (After Core Cascade)

After Session 3, consider:
├─ /design-user-experience → Detailed UX research, flows, wireframes
└─ /setup-analytics → Detailed analytics implementation plan

After Session 4, consider:
└─ /create-content-guidelines → Comprehensive content style guide

After Session 5, consider:
├─ /plan-deployment → Deployment strategy and CI/CD pipelines
└─ /design-observability → Monitoring, alerts, SLOs, incident response

During development:
└─ /review-code → Code review framework (use anytime)

These are optional but valuable for comprehensive product planning.
```

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

### If pre-cascade files exist but core cascade not started

**Message**:
```
I see you've started with branding/strategy (pre-cascade). Great foundation!

Now you have two options:

Option 1 (Recommended): Start the core cascade
→ Run /refine-journey to begin Sessions 1-6
→ Your brand strategy will inform the user journey

Option 2: Complete pre-cascade first
→ Run /discover-naming (if you need a brand name)
→ Run /define-messaging (to create messaging framework)
→ Then start /refine-journey

Most teams go with Option 1 and complete branding in parallel.
```

### If they've skipped sessions

**Message**:
```
⚠️ Warning: Some outputs are missing

The cascade works best sequentially because each session reads previous outputs:
- Session 1 → feeds → Session 2
- Sessions 1+2 → feed → Session 3
- etc.

Missing: [list files]

Recommendation: Either fill in the gaps or accept that later sessions won't have full context.
```

### If all core cascade complete

**Message**:
```
🎉 Core Cascade Complete!

You've successfully completed all 6 Stack-Driven core sessions:
✅ User Journey defined
✅ Tech stack chosen
✅ Strategy established (mission, metrics, monetization, architecture)
✅ Design system created
✅ Backlog generated
✅ GitHub issues created (or ready to create)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

What's next?

Option 1: Start Building 🚀
→ Your backlog is prioritized and ready
→ Reference output files to guide development

Option 2: Add Optional Extensions 📊
→ /setup-analytics (plan analytics implementation)
→ /plan-deployment (CI/CD and deployment strategy)
→ /design-observability (monitoring and alerting)
→ /design-user-experience (detailed UX flows)
→ /create-content-guidelines (content style guide)

Option 3: Iterate & Refine 🔄
→ Run /refine-journey if your understanding evolves
→ Any session can be re-run to update outputs
→ Later sessions will cascade the changes

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The framework is complete. Now go build something amazing! 🎯
```

### If post-cascade files exist

**Track and display** them:
```
POST-CASCADE EXTENSIONS COMPLETE:
✅ 10-analytics-plan.md (Analytics implementation ready)
✅ 11-deployment-plan.md (Deployment strategy defined)
❌ 12-observability-strategy.md (Not started)

You're well-prepared for production! Consider completing observability for full operational readiness.
```

## Important Guidelines

1. **Always check files** - Don't assume what exists
2. **Start with core cascade** - Unless user explicitly wants branding first
3. **Explain optional extensions** - Pre and post-cascade are valuable but optional
4. **Be encouraging** - Celebrate progress
5. **Be specific** - Tell them EXACTLY what command to run next
6. **Show connections** - Explain how outputs flow through cascade
7. **Keep it visual** - Use emojis, progress bars, clear sections
8. **Don't overwhelm** - Introduce post-cascade extensions after core is complete

## Summary of All Commands

**Pre-Cascade (Optional - Branding/Strategy)**:
- `/create-brand-strategy` - Brand foundation
- `/discover-naming` - Brand name generation
- `/define-messaging` - Messaging framework
- `/create-product-strategy` - Market analysis and strategic planning

**Core Cascade (Required)**:
- `/refine-journey` - Session 1: User journey
- `/choose-tech-stack` - Session 2: Tech stack
- `/generate-strategy` - Session 3: Mission, metrics, monetization, architecture
- `/create-design` - Session 4: Design system
- `/generate-backlog` - Session 5: User stories
- `/create-gh-issues` - Session 6: GitHub issues

**Post-Cascade (Optional - Extensions)**:
- `/create-content-guidelines` - Content style guide
- `/design-user-experience` - Detailed UX design
- `/setup-analytics` - Analytics implementation
- `/plan-deployment` - Deployment and CI/CD
- `/design-observability` - Monitoring and observability
- `/review-code` - Code review framework (dev-time)

**Meta**:
- `/cascade-status` - Show this status (what you're running now!)

## Reference Files

Mention if helpful:
- `/examples/compliance-saas/` - Complete cascade example
- `/templates/` - All template files (including new pre/post-cascade templates)
- `README.md` - Framework overview
- `GETTING-STARTED.md` - Onboarding guide

Now, check the output directory and show the user their complete framework status!
