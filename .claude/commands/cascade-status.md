---
description: Show complete Stack-Driven framework progress (core, post-core)
---

# Complete Framework Status Check

You are helping the user navigate the Stack-Driven framework - core cascade (Sessions 1-6) and optional post-core extensions (branding, UX, analytics, operations).

## Your Task

1. **Check which output files exist** in the `/output` directory
2. **Display a visual progress tracker** showing core cascade and post-core extensions
3. **Tell the user exactly what to do next** (which command to run and why)
4. **Show how everything connects** - what reads what

## Complete Framework Structure

### Core Cascade (Required - Sessions 1-8 - ALWAYS START HERE)

**The main Stack-Driven flow**:

```
Session 1: /refine-journey         → output/00-user-journey.md
Session 2: /create-product-strategy → output/01-product-strategy.md
Session 3: /choose-tech-stack      → output/02-tech-stack.md
Session 4: /generate-strategy      → output/03-mission.md
                                     output/04-metrics.md
                                     output/05-monetization.md
                                     output/06-architecture.md
Session 5: /create-design           → output/07-design-system.md
Session 6: /generate-backlog        → output/08-backlog/
Session 7: /create-gh-issues        → GitHub issues
Session 8: /scaffold-project        → output/08-project-scaffold.md
                                     output/08-project-scaffold/ (actual code files)
```

**This is the core** - ALWAYS start here. User journey comes first, product strategy validates market opportunity, then everything else flows from there.

---

### Post-Core Extensions (Optional - Journey-Informed)

**Run AFTER core cascade to add comprehensive planning**. All these commands READ the journey and core outputs.

**After Session 4+** (Tactical Foundation Complete):
```
13. /design-user-experience    → output/13-user-experience.md
    (Detailed UX flows - expands journey with research, flows, wireframes)

14. /setup-analytics           → output/14-analytics-plan.md
    (Analytics implementation - implements metrics from Session 4)
```

**After Session 6+** (Backlog Complete):
```
09. /create-brand-strategy     → output/09-brand-strategy.md
    (Brand foundation - expresses journey value through brand lens)

10. /discover-naming           → output/10-brand-naming.md
    (Brand naming - names the journey solution)

11. /define-messaging          → output/11-brand-messaging.md
    (Messaging framework - communicates journey value in brand voice)

12. /create-content-guidelines → output/12-content-guidelines.md
    (Content style guide - journey-aligned content standards)

15. /plan-deployment           → output/15-deployment-plan.md
    (Deployment strategy - ships journey value via CI/CD)

16. /design-observability      → output/16-observability-strategy.md
    (Monitoring & SLOs - monitors journey success)

17. /design-database-schema    → output/17-database-schema.md
    (Database schema - complete ERD, migrations, and data modeling)

18. /generate-api-contracts    → output/18-api-contracts.md
    (API contracts - OpenAPI specs, endpoints, schemas, and authentication)

19. /create-test-strategy      → output/19-test-strategy.md
    (Testing strategy - unit, integration, E2E, performance, and security testing)
```

**During Development**:
```
XX. /review-code               → (No output file - code review framework)
```

## Steps to Execute

### Step 1: Check Output Directory

Use Bash to check which files exist:

```bash
ls -la /home/user/stack-driven/output/
```

Look for:
- **Core cascade**: `00-user-journey.md`, `01-product-strategy.md`, `02-tech-stack.md`, `03-mission.md`, `04-metrics.md`, `05-monetization.md`, `06-architecture.md`, `07-design-system.md`, `08-backlog/`, `08-project-scaffold.md`
- **Post-core (After Session 4+)**: `13-user-experience.md`, `14-analytics-plan.md`
- **Post-core (After Session 6+)**: `09-brand-strategy.md`, `10-brand-naming.md`, `11-brand-messaging.md`, `12-content-guidelines.md`, `15-deployment-plan.md`, `16-observability-strategy.md`, `17-database-schema.md`, `18-api-contracts.md`, `19-test-strategy.md`

### Step 2: Display Complete Progress

Create a comprehensive visual status display:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Stack-Driven Framework Status
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CORE CASCADE (Required - Always Start Here)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ 00-user-journey.md        (Session 1 ✓)
✅ 01-product-strategy.md    (Session 2 ✓)
✅ 02-tech-stack.md          (Session 3 ✓)
❌ 03-mission.md             (Not started)
❌ 04-metrics.md             (Not started)
❌ 05-monetization.md        (Not started)
❌ 06-architecture.md        (Not started)
❌ 07-design-system.md       (Not started)
❌ 08-backlog/               (Not started)
❌ 08-project-scaffold.md    (Not started)

Progress: ████░░░░░░░░ 38% (3 of 8 core sessions complete)

POST-CORE EXTENSIONS (Optional - Journey-Informed)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
After Session 4+:
❌ 13-user-experience.md     (Detailed UX design)
❌ 14-analytics-plan.md      (Analytics implementation)

After Session 6+:
❌ 09-brand-strategy.md      (Brand foundation)
❌ 10-brand-naming.md        (Brand naming)
❌ 11-brand-messaging.md     (Messaging framework)
❌ 12-content-guidelines.md  (Content style guide)
❌ 15-deployment-plan.md     (Deployment strategy)
❌ 16-observability-strategy.md (Monitoring & SLOs)
❌ 17-database-schema.md     (Database schema)
❌ 18-api-contracts.md       (API contracts)
❌ 19-test-strategy.md       (Testing strategy)

Status: 0 of 12 post-core extensions complete (optional)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Step 3: Determine Next Step

Based on what files exist, determine the next recommended action:

#### Decision Logic:

**If no core cascade files exist**:
- **Recommend**: Start with Session 1 (`/refine-journey`)
- **NEVER suggest branding first** - journey ALWAYS comes first

**If only 00-user-journey.md exists**:
- **Recommend**: Session 2 (`/create-product-strategy`)

**If 00 and 01 exist**:
- **Recommend**: Session 3 (`/choose-tech-stack`)

**If 00-02 exist**:
- **Recommend**: Session 4 (`/generate-strategy`)

**If 00-06 exist (Session 4 complete)**:
- **Recommend**: Session 5 (`/create-design`)
- **Also suggest** (optional):
  - `/design-user-experience` (detailed UX flows)
  - `/setup-analytics` (implement metrics tracking)

**If 00-07 exist (Session 5 complete)**:
- **Recommend**: Session 6 (`/generate-backlog`)

**If 00-08 backlog exists (Session 6 complete)**:
- **Recommend**: Session 7 (`/create-gh-issues`)

**If 00-08 backlog + GitHub issues exist (Session 7 complete)**:
- **Recommend**: Session 8 (`/scaffold-project`)
- **Also suggest** (optional):
  - `/create-brand-strategy` (express journey value through brand)
  - `/plan-deployment` (deployment strategy)
  - `/design-observability` (monitoring & SLOs)

**If all core cascade complete (Sessions 1-8)**:
- **Congratulate** them!
- **Recommend**: Copy scaffold files and start building!
- **Also suggest**: Post-core extensions (branding, UX, analytics, ops) for comprehensive planning

### Step 4: Show Next Step Details

For the next recommended session, display:

```
👉 Next Step: Run /generate-strategy

📥 Reads (cascade inputs):
- output/00-user-journey.md (your validated user journey)
- output/01-product-strategy.md (market validation and strategic goals)
- output/02-tech-stack.md (your chosen tech stack)

📤 Will create:
- output/03-mission.md (mission statement derived from journey)
- output/04-metrics.md (North Star metric and success metrics)
- output/05-monetization.md (pricing strategy aligned with value)
- output/06-architecture.md (architecture principles)

⏱️ Estimated time: 15-20 minutes (AI-assisted conversation)

💡 What happens: I'll analyze your journey, product strategy, and tech stack to derive your tactical foundation - mission, metrics, monetization, and architecture principles. Every decision will trace back to your user journey.

🔗 Cascades to:
- Session 5: Design system will implement your architecture principles
- Session 6: Backlog will be prioritized by your metrics
- Optional: /setup-analytics will implement detailed event tracking for your metrics
- Optional: /design-user-experience will create detailed UX design

Ready? Run: /generate-strategy
```

### Step 5: Show Optional Extensions

If appropriate, suggest optional post-core commands:

```
💡 Optional Post-Core Extensions (Journey-Informed)

After Session 4 (Tactical Foundation Complete), consider:
├─ /design-user-experience → Detailed UX flows & wireframes (output/13-user-experience.md)
└─ /setup-analytics → Implement metrics tracking (output/14-analytics-plan.md)

After Session 6 (Backlog Complete), consider:
├─ /create-brand-strategy → Express journey value through brand (output/09-brand-strategy.md)
├─ /discover-naming → Name the journey solution (output/10-brand-naming.md)
├─ /define-messaging → Communicate journey value (output/11-brand-messaging.md)
├─ /create-content-guidelines → Journey-aligned content (output/12-content-guidelines.md)
├─ /plan-deployment → Ship journey value via CI/CD (output/15-deployment-plan.md)
├─ /design-observability → Monitor journey success (output/16-observability-strategy.md)
├─ /design-database-schema → Complete ERD, migrations, data modeling (output/17-database-schema.md)
├─ /generate-api-contracts → OpenAPI specs, endpoints, schemas (output/18-api-contracts.md)
└─ /create-test-strategy → Comprehensive testing strategy (output/19-test-strategy.md)

During development:
└─ /review-code → Code review framework (use anytime)

All post-core extensions READ the journey - nothing precedes the user journey.
```

## Example Output

Here's an example of what you should output:

```
📊 Stack-Driven Cascade Status

Your Cascade Progress:
✅ 00-user-journey.md        (Session 1 complete)
❌ 01-product-strategy.md    (Not started)
❌ 02-tech-stack.md          (Not started)
❌ 03-mission.md             (Not started)
❌ 04-metrics.md             (Not started)
❌ 05-monetization.md        (Not started)
❌ 06-architecture.md        (Not started)
❌ 07-design-system.md       (Not started)
❌ 08-backlog/               (Not started)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Progress: ██░░░░░░░░░░ 13% (1 of 8 sessions complete)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

👉 Next Step: Run /create-product-strategy

📥 Inputs needed:
- Reads: output/00-user-journey.md (your validated user journey)

📤 Will create:
- output/01-product-strategy.md (market validation, competitive analysis, strategic goals)

⏱️ Estimated time: 20-30 minutes

💡 What happens: I'll analyze your user journey and validate it with market sizing (TAM/SAM/SOM), competitive analysis, and strategic positioning. This creates a market-validated foundation before choosing technology.

Ready? Run: /create-product-strategy
```

## Important Guidelines

1. **Always check files** - Don't assume what exists, actually check the /output directory
2. **Be encouraging** - This is a journey, celebrate progress
3. **Be specific** - Tell them EXACTLY what command to run next
4. **Show connections** - Explain how previous outputs inform the next session
5. **Keep it visual** - Use emojis, progress bars, clear sections

## Edge Cases

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

You've successfully completed all 8 Stack-Driven core sessions:
✅ User Journey defined
✅ Product Strategy validated (market, competitive, goals)
✅ Tech stack chosen
✅ Tactical foundation established (mission, metrics, monetization, architecture)
✅ Design system created
✅ Backlog generated
✅ GitHub issues created
✅ Project scaffold ready (working development environment)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

What's next?

Option 1: Start Building 🚀
→ Copy files from output/08-project-scaffold/ to your project root
→ Follow README.md setup instructions
→ Run docker-compose up && npm install && npm run dev
→ Start implementing P0 stories from your backlog

Option 2: Add Optional Extensions 📊
→ /setup-analytics (plan analytics implementation)
→ /plan-deployment (advanced deployment strategy)
→ /design-observability (monitoring and alerting)
→ /design-user-experience (detailed UX flows)
→ /create-content-guidelines (content style guide)

Option 3: Iterate & Refine 🔄
→ Run /refine-journey if your understanding evolves
→ Any session can be re-run to update outputs
→ Later sessions will cascade the changes

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

You have everything from idea to working dev environment. Now go ship! 🎯
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

**Core Cascade (Required - Always Start Here)**:
- `/refine-journey` - Session 1: User journey
- `/create-product-strategy` - Session 2: Market validation, competitive analysis, strategic goals
- `/choose-tech-stack` - Session 3: Tech stack
- `/generate-strategy` - Session 4: Mission, metrics, monetization, architecture
- `/create-design` - Session 5: Design system
- `/generate-backlog` - Session 6: User stories
- `/create-gh-issues` - Session 7: GitHub issues
- `/scaffold-project` - Session 8: Working development environment

**Post-Core Extensions (Optional - Journey-Informed)**:

After Session 4+:
- `/design-user-experience` - Detailed UX flows (output/13-user-experience.md)
- `/setup-analytics` - Analytics implementation (output/14-analytics-plan.md)

After Session 6+:
- `/create-brand-strategy` - Brand foundation (output/09-brand-strategy.md)
- `/discover-naming` - Brand naming (output/10-brand-naming.md)
- `/define-messaging` - Messaging framework (output/11-brand-messaging.md)
- `/create-content-guidelines` - Content style guide (output/12-content-guidelines.md)
- `/plan-deployment` - Deployment & CI/CD (output/15-deployment-plan.md)
- `/design-observability` - Monitoring & SLOs (output/16-observability-strategy.md)
- `/design-database-schema` - Database schema & migrations (output/17-database-schema.md)
- `/generate-api-contracts` - API contracts & OpenAPI specs (output/18-api-contracts.md)
- `/create-test-strategy` - Testing strategy (output/19-test-strategy.md)

Dev-time:
- `/review-code` - Code review framework (anytime)

**Meta**:
- `/cascade-status` - Show this status (what you're running now!)

## Reference Files

Mention if helpful:
- `/examples/compliance-saas/` - Complete cascade example
- `/templates/` - All template files
- `README.md` - Framework overview
- `GETTING-STARTED.md` - Onboarding guide

Now, check the output directory and show the user their complete framework status!
