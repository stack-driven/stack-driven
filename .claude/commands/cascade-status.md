---
description: Show complete Stack-Driven framework progress (core, post-core)
---

# Complete Framework Status Check

You are helping the user navigate the Stack-Driven framework - core cascade (Sessions 1-6) and optional post-core extensions (branding, UX, analytics, operations).

## Your Task

1. **Check which output files exist** in the `/product-guidelines` directory
2. **Display a visual progress tracker** showing core cascade and post-core extensions
3. **Tell the user exactly what to do next** (which command to run and why)
4. **Show how everything connects** - what reads what

## Complete Framework Structure

### Core Cascade (Required - Sessions 1-11 - ALWAYS START HERE)

**The main Stack-Driven flow**:

```
Session 1: /refine-journey          → product-guidelines/00-user-journey.md
Session 2: /create-product-strategy  → product-guidelines/01-product-strategy.md
Session 3: /choose-tech-stack       → product-guidelines/02-tech-stack.md
Session 4: /generate-strategy       → product-guidelines/03-mission.md
                                      product-guidelines/04-metrics.md
                                      product-guidelines/05-monetization.md
                                      product-guidelines/06-architecture.md
Session 5: /create-brand-strategy   → product-guidelines/07-brand-strategy.md
Session 6: /create-design            → product-guidelines/08-design-system.md
Session 7: /generate-backlog         → product-guidelines/09-backlog/
Session 8: /create-gh-issues         → GitHub issues
Session 9: /scaffold-project         → product-guidelines/09-project-scaffold.md
                                      product-guidelines/09-project-scaffold/ (actual code files)
Session 10: /plan-deployment         → product-guidelines/10-deployment-plan.md
Session 11: /design-observability    → product-guidelines/11-observability-strategy.md
```

**This is the core** - ALWAYS start here. User journey comes first, product strategy validates market opportunity, then everything flows through to deployment and observability. Complete these 11 sessions to go from idea to production-ready system.

---

### Post-Core Extensions (Optional - Journey-Informed)

**Run AFTER core cascade to add comprehensive planning**. All these commands READ the journey and core outputs.

**After Session 4+** (Tactical Foundation Complete):
```
16. /design-user-experience    → product-guidelines/16-user-experience.md
    (Detailed UX flows - expands journey with research, flows, wireframes)

17. /setup-analytics           → product-guidelines/17-analytics-plan.md
    (Analytics implementation - implements metrics from Session 4)

21. /design-growth-strategy    → product-guidelines/21-growth-strategy.md
    (Growth strategy - acquisition channels, growth loops, and experiments)
```

**After Session 7+** (Backlog Complete):
```
12. /discover-naming           → product-guidelines/12-brand-naming.md
    (Brand naming - names the journey solution, extends Session 5 brand)

13. /define-messaging          → product-guidelines/13-brand-messaging.md
    (Messaging framework - communicates journey value in brand voice)

14. /design-brand-identity     → product-guidelines/14-brand-identity.md
    (Brand identity - logo, visual system, and usage guidelines)

15. /create-content-guidelines → product-guidelines/15-content-guidelines.md
    (Content style guide - journey-aligned content standards)

18. /design-database-schema    → product-guidelines/18-database-schema.md
    (Database schema - complete ERD, migrations, and data modeling)

19. /generate-api-contracts    → product-guidelines/19-api-contracts.md
    (API contracts - OpenAPI specs, endpoints, schemas, and authentication)

20. /create-test-strategy      → product-guidelines/20-test-strategy.md
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
ls -la /home/user/stack-driven/product-guidelines/
```

Look for:
- **Core cascade**: `00-user-journey.md`, `01-product-strategy.md`, `02-tech-stack.md`, `03-mission.md`, `04-metrics.md`, `05-monetization.md`, `06-architecture.md`, `07-brand-strategy.md`, `08-design-system.md`, `09-backlog/`, `09-project-scaffold.md`, `10-deployment-plan.md`, `11-observability-strategy.md`
- **Post-core (After Session 4+)**: `16-user-experience.md`, `17-analytics-plan.md`, `21-growth-strategy.md`
- **Post-core (After Session 7+)**: `12-brand-naming.md`, `13-brand-messaging.md`, `14-brand-identity.md`, `15-content-guidelines.md`, `18-database-schema.md`, `19-api-contracts.md`, `20-test-strategy.md`

### Step 2: Display Complete Progress

Create a comprehensive visual status display:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Stack-Driven Framework Status
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CORE CASCADE (Required - Always Start Here)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ 00-user-journey.md           (Session 1 ✓)
✅ 01-product-strategy.md       (Session 2 ✓)
✅ 02-tech-stack.md             (Session 3 ✓)
❌ 03-mission.md                (Not started)
❌ 04-metrics.md                (Not started)
❌ 05-monetization.md           (Not started)
❌ 06-architecture.md           (Not started)
❌ 07-brand-strategy.md         (Not started)
❌ 08-design-system.md          (Not started)
❌ 09-backlog/                  (Not started)
❌ 09-project-scaffold.md       (Not started)
❌ 10-deployment-plan.md        (Not started)
❌ 11-observability-strategy.md (Not started)

Progress: ████░░░░░░░░░░░░ 27% (3 of 11 core sessions complete)

POST-CORE EXTENSIONS (Optional - Journey-Informed)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
After Session 4+:
❌ 16-user-experience.md     (Detailed UX design)
❌ 17-analytics-plan.md      (Analytics implementation)
❌ 21-growth-strategy.md     (Growth strategy)

After Session 7+:
❌ 12-brand-naming.md        (Brand naming)
❌ 13-brand-messaging.md     (Messaging framework)
❌ 14-brand-identity.md      (Brand identity)
❌ 15-content-guidelines.md  (Content style guide)
❌ 18-database-schema.md     (Database schema)
❌ 19-api-contracts.md       (API contracts)
❌ 20-test-strategy.md       (Testing strategy)

Status: 0 of 10 post-core extensions complete (optional)

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
- **Recommend**: Session 5 (`/create-brand-strategy`)
- **Also suggest** (optional):
  - `/design-user-experience` (detailed UX flows)
  - `/setup-analytics` (implement metrics tracking)
  - `/design-growth-strategy` (acquisition channels and growth loops)

**If 00-07 exist (Session 5 complete)**:
- **Recommend**: Session 6 (`/create-design`)

**If 00-08 exist (Session 6 complete)**:
- **Recommend**: Session 7 (`/generate-backlog`)

**If 00-09 backlog exists (Session 7 complete)**:
- **Recommend**: Session 8 (`/create-gh-issues`)

**If 00-09 backlog + GitHub issues exist (Session 8 complete)**:
- **Recommend**: Session 9 (`/scaffold-project`)

**If 00-09 scaffold exists (Session 9 complete)**:
- **Recommend**: Session 10 (`/plan-deployment`)

**If 00-10 deployment plan exists (Session 10 complete)**:
- **Recommend**: Session 11 (`/design-observability`)

**If all core cascade complete (Sessions 1-11)**:
- **Congratulate** them!
- **Recommend**: Copy scaffold files and start building!
- **Also suggest** (optional):
  - `/discover-naming` (generate brand name)
  - `/define-messaging` (messaging framework)
  - `/design-brand-identity` (visual identity)
  - Post-core extensions for comprehensive planning

### Step 4: Show Next Step Details

For the next recommended session, display:

```
👉 Next Step: Run /generate-strategy

📥 Reads (cascade inputs):
- product-guidelines/00-user-journey.md (your validated user journey)
- product-guidelines/01-product-strategy.md (market validation and strategic goals)
- product-guidelines/02-tech-stack.md (your chosen tech stack)

📤 Will create:
- product-guidelines/03-mission.md (mission statement derived from journey)
- product-guidelines/04-metrics.md (North Star metric and success metrics)
- product-guidelines/05-monetization.md (pricing strategy aligned with value)
- product-guidelines/06-architecture.md (architecture principles)

⏱️ Estimated time: 15-20 minutes (AI-assisted conversation)

💡 What happens: I'll analyze your journey, product strategy, and tech stack to derive your tactical foundation - mission, metrics, monetization, and architecture principles. Every decision will trace back to your user journey.

🔗 Cascades to:
- Session 5: Brand strategy will express your journey value
- Session 6: Design system will implement brand and architecture
- Session 7: Backlog will be prioritized by your metrics
- Sessions 10-11: Deployment and observability will enable reliable delivery
- Optional: /setup-analytics will implement detailed event tracking for your metrics
- Optional: /design-user-experience will create detailed UX design

Ready? Run: /generate-strategy
```

### Step 5: Show Optional Extensions

If appropriate, suggest optional post-core commands:

```
💡 Optional Post-Core Extensions (Journey-Informed)

After Session 4 (Tactical Foundation Complete), consider:
├─ /design-user-experience → Detailed UX flows & wireframes (product-guidelines/16-user-experience.md)
├─ /setup-analytics → Implement metrics tracking (product-guidelines/17-analytics-plan.md)
└─ /design-growth-strategy → Acquisition channels & growth loops (product-guidelines/21-growth-strategy.md)

After Session 7 (Backlog Complete), consider:
├─ /discover-naming → Extend brand with name generation (product-guidelines/12-brand-naming.md)
├─ /define-messaging → Communicate journey value (product-guidelines/13-brand-messaging.md)
├─ /design-brand-identity → Logo and visual identity system (product-guidelines/14-brand-identity.md)
├─ /create-content-guidelines → Journey-aligned content (product-guidelines/15-content-guidelines.md)
├─ /design-database-schema → Complete ERD, migrations, data modeling (product-guidelines/18-database-schema.md)
├─ /generate-api-contracts → OpenAPI specs, endpoints, schemas (product-guidelines/19-api-contracts.md)
└─ /create-test-strategy → Comprehensive testing strategy (product-guidelines/20-test-strategy.md)

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
- Reads: product-guidelines/00-user-journey.md (your validated user journey)

📤 Will create:
- product-guidelines/01-product-strategy.md (market validation, competitive analysis, strategic goals)

⏱️ Estimated time: 20-30 minutes

💡 What happens: I'll analyze your user journey and validate it with market sizing (TAM/SAM/SOM), competitive analysis, and strategic positioning. This creates a market-validated foundation before choosing technology.

Ready? Run: /create-product-strategy
```

## Important Guidelines

1. **Always check files** - Don't assume what exists, actually check the /product-guidelines directory
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

You've successfully completed all 11 Stack-Driven core sessions:
✅ User Journey defined
✅ Product Strategy validated (market, competitive, goals)
✅ Tech stack chosen
✅ Tactical foundation established (mission, metrics, monetization, architecture)
✅ Brand strategy created (expresses journey value)
✅ Design system created (brings brand to life)
✅ Backlog generated
✅ GitHub issues created
✅ Project scaffold ready (working development environment)
✅ Deployment strategy defined (CI/CD, environments, rollout)
✅ Observability strategy created (monitoring, SLOs, incident response)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

What's next?

Option 1: Start Building 🚀
→ Copy files from product-guidelines/09-project-scaffold/ to your project root
→ Follow README.md setup instructions
→ Set up CI/CD using product-guidelines/10-deployment-plan.md
→ Implement monitoring using product-guidelines/11-observability-strategy.md
→ Run docker-compose up && npm install && npm run dev
→ Start implementing P0 stories from your backlog

Option 2: Add Optional Extensions 📊
→ /discover-naming (generate brand name from strategy)
→ /define-messaging (messaging framework)
→ /design-brand-identity (visual identity system)
→ /setup-analytics (plan analytics implementation)
→ /design-user-experience (detailed UX flows)
→ /create-content-guidelines (content style guide)
→ /design-database-schema (complete ERD and migrations)
→ /generate-api-contracts (OpenAPI specs)
→ /create-test-strategy (comprehensive testing)

Option 3: Iterate & Refine 🔄
→ Run /refine-journey if your understanding evolves
→ Any session can be re-run to update outputs
→ Later sessions will cascade the changes

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

You have everything from idea to production-ready system. Now go ship! 🎯
```

### If post-cascade files exist

**Track and display** them:
```
POST-CORE EXTENSIONS COMPLETE:
✅ 17-analytics-plan.md (Analytics implementation ready)
✅ 14-brand-identity.md (Brand identity created)
✅ 18-database-schema.md (Database schema defined)
❌ 16-user-experience.md (Not started)

You're adding comprehensive planning! Consider UX flows for complete product definition.
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
- `/create-brand-strategy` - Session 5: Brand foundation (expresses journey value)
- `/create-design` - Session 6: Design system (brings brand to life)
- `/generate-backlog` - Session 7: User stories
- `/create-gh-issues` - Session 8: GitHub issues
- `/scaffold-project` - Session 9: Working development environment
- `/plan-deployment` - Session 10: Deployment & CI/CD
- `/design-observability` - Session 11: Monitoring & SLOs

**Post-Core Extensions (Optional - Journey-Informed)**:

After Session 4+:
- `/design-user-experience` - Detailed UX flows (product-guidelines/16-user-experience.md)
- `/setup-analytics` - Analytics implementation (product-guidelines/17-analytics-plan.md)
- `/design-growth-strategy` - Growth strategy (product-guidelines/21-growth-strategy.md)

After Session 7+:
- `/discover-naming` - Brand naming (product-guidelines/12-brand-naming.md)
- `/define-messaging` - Messaging framework (product-guidelines/13-brand-messaging.md)
- `/design-brand-identity` - Brand identity system (product-guidelines/14-brand-identity.md)
- `/create-content-guidelines` - Content style guide (product-guidelines/15-content-guidelines.md)
- `/design-database-schema` - Database schema & migrations (product-guidelines/18-database-schema.md)
- `/generate-api-contracts` - API contracts & OpenAPI specs (product-guidelines/19-api-contracts.md)
- `/create-test-strategy` - Testing strategy (product-guidelines/20-test-strategy.md)

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
