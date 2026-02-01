---
description: Session 4 - Generate tactical foundation (mission, metrics, monetization, architecture)
---

# Session 4: Generate Strategy

This is **Session 4** of the cascade. You'll synthesize the user journey, product strategy, and tech stack into a complete tactical foundation.

## Your Role

You are a product strategist deriving tactical decisions from previous cascade outputs. Your job is to:

1. **Read** journey (`product-guidelines/00-user-journey.ctx.md`), product strategy (`product-guidelines/01-product-strategy.ctx.md`), and tech stack (`product-guidelines/02-tech-stack.md`)
2. **Derive mission** from the journey's aha moment (usually Step 3)
3. **Define North Star metric** that measures mission fulfillment
4. **Design monetization** aligned with value delivery
5. **Establish architecture principles** based on journey + tech stack

## Critical Philosophy

**Every strategic decision must trace back to the user journey.**

- Mission → Promises the journey outcome (Step 3 value)
- North Star → Measures journey completion
- Monetization → Charges where journey delivers value
- Architecture → Optimizes journey critical path

## Steps Overview

This session follows a structured flow:

1. **Read previous outputs** (journey, strategy, tech stack, constraints, coding standards, AI integration)
2. **Select metrics framework** (AARRR / HEART / North Star) based on product stage
3. **Derive mission statement** from journey's aha moment (Step 3)
4. **Define metric tree** (L0→L1→L2→L3 hierarchical structure with team ownership)
5. **Design monetization strategy** aligned with value delivery
6. **Establish architecture principles** based on journey + tech stack
   - 6a. **Integration architecture patterns** (if third-party integrations exist)
7. **Analytics implementation strategy** (event taxonomy, tool selection, privacy compliance)

## Process

### Step 1: Read Previous Outputs

```
Read: product-guidelines/00-user-journey.ctx.md
Read: product-guidelines/01-product-strategy.ctx.md
Read: product-guidelines/02-tech-stack.ctx.md

# Check if constraints exist (Session 2a is optional)
If product-guidelines/02a-constraints.ctx.md exists:
  Read: product-guidelines/02a-constraints.ctx.md

Read: product-guidelines/02b-coding-standards.ctx.md

# Check if AI integration strategy exists (Session 3c is optional)
If product-guidelines/02c-ai-integration-strategy.ctx.md exists:
  Read: product-guidelines/02c-ai-integration-strategy.ctx.md
```

**Context Optimization**: We read the .ctx.md files for optimal context reduction:
- `01-product-strategy.ctx.md` (~65% smaller) - Contains vision, positioning, strategic goals, and product principles—sufficient for generating mission, metrics, monetization, and architecture without detailed market analysis.
- `02a-constraints.ctx.md` (~70% smaller, if exists) - Contains technical, organizational, and compliance constraints—provides boundaries for architecture decisions.
- `02b-coding-standards.ctx.md` (~70% smaller) - Contains framework-specific patterns, file organization, and naming conventions—provides context for architecture decisions without detailed implementation examples.
- `02c-ai-integration-strategy.ctx.md` (~60% smaller, if exists) - Contains AI implementation patterns, model choices, and cost projections—provides critical AI architecture decisions without detailed compliance documentation.

**Extract from Journey**:
- Step 3 (aha moment) - where primary value is delivered
- Economic value (time/money saved, ROI)
- Primary user persona
- Success metrics already defined

**Extract from Product Strategy**:
- Product vision (3-5 year aspirational future)
- Strategic goals
- Product principles

**Extract from Tech Stack**:
- Core technologies chosen
- Journey-tech mappings
- Technical constraints/capabilities

**Extract from Constraints (if exists)**:
- Budget constraints (affects monetization strategy)
- Timeline constraints (affects architecture complexity)
- Compliance requirements (affects data architecture)
- Non-negotiable journey elements (affects metrics)

**Extract from Coding Standards**:
- Framework-specific architectural patterns
- File organization and module structure
- Naming conventions and code organization principles

**Extract from AI Integration Strategy (if exists)**:
- AI implementation patterns chosen (direct API, RAG, agents, etc.)
- Model routing decisions and fallback strategies
- Cost projections and optimization strategies
- MVP vs scale phasing for AI features

### Step 2: Select Metrics Framework

**Decision Tree**:
- **AARRR (Pirate Metrics)** if:
  - Early-stage startup (pre-PMF or early growth)
  - Growth funnel optimization is priority
  - Clear conversion stages in journey (acquisition → activation → retention → referral → revenue)
- **HEART (Google)** if:
  - Established product with focus on UX quality
  - Journey emphasizes task efficiency or satisfaction
  - Multiple user segments with different success criteria
- **North Star** if:
  - Single metric represents core value delivery
  - Journey has clear "aha moment" (Step 3)
  - Cross-functional alignment around one measure

**For most Stack-Driven journeys**: North Star is optimal (journey-driven, aha moment focus)

**Document selected framework and rationale** in `03b-metrics.md`

### Step 3: Derive Mission Statement

**Formula**: "We help [user persona] [achieve outcome] by [unique approach]"

**How to Derive**:
1. User persona: From journey (primary user)
2. Achieve outcome: From journey Step 3 (aha moment value)
3. Unique approach: From tech stack + journey (how you deliver value differently)

**Example**:
- Journey Step 3: "Compliance officer gets assessment results in 2 minutes instead of 2 hours"
- Tech Stack: Claude API + FastAPI for AI-powered analysis
- Mission: "We help compliance officers approve documents 10x faster by transforming framework requirements into automated AI assessments"

**Validation**:
- Does it reference the journey aha moment? [✓]
- Is it specific (not generic)? [✓]
- Does it promise measurable outcome? [✓]

### Step 4: Define Metric Tree

**Formula**: North Star = [Core Action] from journey Step 3

**How to Derive**:
1. What action represents Step 3 value delivery?
2. That's your North Star (L0)

**Example**:
- Journey Step 3: AI assessment completed
- North Star: "Weekly Active Assessments" (measures mission fulfillment)

**Metric Tree** (hierarchical North Star decomposition):

**L0 - North Star**: [Core Action from Step 3]
- Example: "Weekly Active Assessments"

**L1 - Direct Drivers** (3-5 metrics that mathematically compose North Star):
- New Active Users (acquisition)
- Assessment Completion Rate (activation)
- Weekly Retention Rate (retention)
- Formula: `North Star = New Users × Completion Rate × Retention Rate`

**L2 - Driver Metrics** (per L1 input, team-level actions):
- For "Assessment Completion Rate":
  - Onboarding completion rate (product team)
  - Feature discovery rate (product team)
  - Time-to-first-assessment (product + design)
- For "New Active Users":
  - Signup conversion rate (growth team)
  - Activation rate (product team)

**L3 - Granular Metrics** (per team, daily tasks):
- For "Onboarding completion rate":
  - Tutorial video completion
  - Sample document upload rate
  - Help doc engagement

**Validation**:
- [ ] MECE (Mutually Exclusive, Collectively Exhaustive - no overlap, full coverage)
- [ ] Clear ownership (each metric assigned to team)
- [ ] Influence relationships mapped (L3 → L2 → L1 → L0)
- [ ] 60%+ of L2/L3 metrics are leading indicators (predictive, actionable)

**Leading vs Lagging Classification**:
- **Leading indicators** (60%+ of metrics): Predictive, actionable daily, teams can influence
  - Example: Onboarding completion rate (predicts activation)
- **Lagging indicators**: Validation, reporting, slower-moving
  - Example: Monthly Recurring Revenue, NPS

**Input Metric Controllability Check**:
For each L2/L3 metric, validate:
- [ ] Team can influence through daily actions (not purely external)
- [ ] Updates frequently enough for feedback loops (weekly or daily)
- [ ] Clear ownership: Which team/role owns moving this?

**Example**:
- Good: "Onboarding completion rate" (product team owns, controllable)
- Bad: "Market growth rate" (external, uncontrollable)

**Health Metrics** (guardrails):
- Retention (D7, D30)
- NPS
- Error rates
- API performance

**Counter-Metrics** (prevent gaming):
- What quality measures must NOT degrade as North Star increases?
- Example: Won't improve assessment speed by reducing accuracy
  - Counter-metric: Assessment accuracy rate (maintain >95%)
- Example: Won't boost signups by degrading UX
  - Counter-metric: NPS, support ticket rate (maintain baseline)

**Rule**: Minimum 2 counter-metrics required per North Star

### Step 5: Design Monetization

**Principle**: Charge where value is delivered (journey Step 3)

**How to Derive**:
1. Identify value delivery moment: Journey Step 3
2. What unit of value? (per assessment, per user, per feature unlocked?)
3. Calculate value ratio: What user gets ÷ What user pays (target: 10:1+)

**Model Selection**:
- **Freemium**: If low marginal cost, viral potential
- **Pay-as-you-go**: If variable usage, clear value per unit
- **Subscription**: If predictable usage, enterprise customers
- **Hybrid**: Combine for flexibility

**Pricing Tiers**:
- Free: Generous enough to validate, limited enough to convert
- Paid: Aligned with value metric, clear upgrade path
- Enterprise: Custom for specific needs (SSO, SLA, etc.)

**Example**:
- Value delivered: Each assessment saves 2-4 hours ($150-300 value)
- Pricing: $0.10 per assessment
- Value ratio: 1,500x - 3,000x
- Model: Freemium (100 free) + PAYG ($0.10 each) + Business ($299/month includes 3,500)

### Step 6: Establish Architecture Principles

**How to Derive** (from journey + tech stack):

**Critical Path Optimization**:
- Journey Step 3 is critical → Optimize this path
- Example: "Assessment processing <60 seconds" → Async architecture, progress indicators

**Tech Stack Patterns**:
- Based on chosen tech, establish patterns
- Example: "PostgreSQL JSONB for flexible assessment results, Redis for framework caching"

**Principles** (typically 3-5):
1. Journey-step optimization (optimize critical path, not theoretical scale)
2. Boring technology + strategic innovation (proven tech 90%, innovate 10%)
3. API-first design (enables integrations)
4. Fail-safe (compliance = reliability critical)
5. Observable (measure everything)

### Step 6a: Integration Architecture Patterns (if integrations exist)

**Check for integrations**: If `product-guidelines/02a-constraints.ctx.md` exists and identifies third-party integrations, include integration architecture patterns in `product-guidelines/04-architecture.md`.

**Integration Registry**:
Create a table listing all third-party integrations from Session 2a:

| Integration | Purpose | Journey Step | Pattern | Priority |
|-------------|---------|--------------|---------|----------|
| Stripe | Payment processing | Step 4 | API + Webhooks | P0 |
| SendGrid | Transactional email | Steps 1, 4 | API only | P0 |
| Salesforce | CRM sync | Step 5 | API + Outbound Msgs | P1 |

**Credential Management Strategy**:
- Storage location: Environment variables / AWS Secrets Manager / HashiCorp Vault
- Rotation policy: Manual / Automated with X-day rotation
- Access control: Who/what can access credentials
- Example: "Production API keys stored in AWS Secrets Manager, accessed via IAM role, rotated every 90 days automatically"

**Resilience Patterns**:
- **Retry Logic**: Exponential backoff (1s → 2s → 4s → 8s → 16s), max 5 attempts
- **Circuit Breaker**: Open after 5 consecutive failures, half-open after 60s, applies to non-critical integrations
- **Fallback Behavior**: Define what happens when each integration is unavailable
  - Example: "Stripe down → Queue payment for processing, show 'Payment pending' to user"

**Webhook Infrastructure** (if webhooks identified in Session 2a):
- Endpoint pattern: `/webhooks/[provider-name]`
- Verification: HMAC signature validation (SHA-256)
- Processing: Async queue (Redis/SQS) + background workers
- Idempotency: Check `webhook_events.event_id` before processing
- Retry strategy: Provider-dependent (Stripe retries 3 days, SendGrid 72 hours)

**Rate Limiting (Outbound)**:
Track third-party API rate limits and implement client-side limiting:

| Integration | Rate Limit | Strategy |
|-------------|------------|----------|
| Stripe | 100 req/sec | Client-side limiter, queue excess |
| SendGrid | 600 req/min | Batch emails, respect limits |
| Salesforce | 15K req/day | Cache reads, batch writes |

**Monitoring & Alerting**:
- Track integration success/failure rates (target: >99.5% success)
- Alert on: 5+ consecutive failures, rate limit exceeded, credential expiration
- Dashboard: Integration health metrics per provider

### Step 7: Analytics Implementation Strategy

**Event Taxonomy Design**:
Based on journey steps and North Star metric, define core events:

**Naming Convention** (enforce strictly):
- **Casing**: snake_case (e.g., `assessment_completed`)
- **Tense**: Past tense (action already occurred)
- **Syntax**: `[object]_[past_tense_verb]` (e.g., `document_uploaded`, `user_signed_up`)
- **Properties**: Use event properties for context, not separate events
  - Good: `feature_used` with `feature_name` property
  - Bad: `ai_assessment_used`, `manual_assessment_used` (event explosion)

**Core Event Set** (map to journey steps):
- Step 1: `page_viewed`, `signup_started`, `user_signed_up`
- Step 2: `document_uploaded`, `framework_selected`
- Step 3: `assessment_started`, `assessment_completed` [North Star event]
- Step 4: `result_viewed`, `report_downloaded`

**User Identification Strategy**:
- Anonymous tracking: Assign `anonymous_id` on first visit (pre-signup)
- Identified tracking: Assign `user_id` on signup/login
- Identity stitching: Merge anonymous → identified user history

**Session Tracking**:
- Web: 30-minute inactivity timeout
- Mobile: 5-minute background timeout
- Max session: 24 hours (prevent tab pollution)

**Analytics Tool Recommendation**:
Based on team size, tech stack, and privacy needs:
- **PostHog** if: Engineering-led, need session replay + feature flags, <$50k ARR
- **Mixpanel** if: Product-led growth, non-technical PMs need self-service
- **Amplitude** if: Enterprise scale, complex behavioral segmentation
- **Matomo** if: Healthcare/Finance/EU, GDPR/HIPAA strict compliance

**Privacy & Compliance**:
- [ ] GDPR consent (EU visitors): Opt-in required before tracking
- [ ] IP anonymization: Mask last octet (192.168.1.XXX)
- [ ] PII handling: Hash emails with salt, never log passwords
- [ ] Data retention: Define deletion policy (30/90/365 days)

## Generating the Outputs

Create 5 files:

### 1. `product-guidelines/03a-mission.md`

Use `/templates/03a-mission-template.md`.

**Key Sections**:
- Mission statement (one sentence)
- Who we serve, value delivered, how we're different
- Mission tests (feature, partnership, hiring decisions)
- Connection to journey (which step), to metrics (North Star), to monetization

### 2. `product-guidelines/03b-metrics.md`

Use `/templates/03b-metrics-template.md`.

**Key Sections**:
- North Star metric (definition, why, targets)
- Input metrics (3-5 that drive North Star, with formula)
- Health metrics (engagement, retention, revenue, product health)
- Counter-metrics (what won't sacrifice)
- Connection to journey steps, to monetization

### 3. `product-guidelines/03c-monetization.md`

Use `/templates/03c-monetization-template.md`.

**Key Sections**:
- Pricing model (with rationale from journey)
- Pricing tiers (Free, Paid, Enterprise with clear purpose)
- Value metric justification (why this unit, value ratio calculation)
- Unit economics (ARPU, LTV, CAC targets)
- Revenue targets (30/90/365 days)
- Connection to journey (where charged), mission (what charged for)

### 4. `product-guidelines/04-architecture.md`

Use `/templates/04-architecture-template.md`.

**Key Sections**:
- Architecture overview (diagram if helpful)
- Core principles (3-5, journey-derived)
- Data flow for critical journey step
- Database schema (key tables)
- Scaling strategy (current capacity, bottlenecks)
- Connection to journey (optimizes Step X)

### 5. `product-guidelines/03d-analytics-strategy.md`

Use `/templates/03d-analytics-strategy-template.md`.

**Key Sections**:
- Event taxonomy table with naming conventions
- Core events mapped to journey steps
- User identification strategy (anonymous → identified → stitching)
- Session tracking rules (web vs mobile timeouts)
- Analytics tool recommendation with rationale
- Privacy compliance checklist (GDPR, IP anonymization, PII, retention)

## Validation Checklist

Before writing files:

### Framework & Mission
- [ ] Metrics framework selected with rationale (AARRR/HEART/North Star)
- [ ] Mission references journey aha moment?

### Metric Tree Quality
- [ ] North Star measures mission outcome?
- [ ] L0→L1→L2→L3 hierarchy with influence relationships mapped
- [ ] MECE validation (no overlap, full coverage)
- [ ] Team ownership assigned to each L2/L3 metric
- [ ] 60%+ of L2/L3 metrics are leading indicators
- [ ] All input metrics are controllable by teams
- [ ] Minimum 2 counter-metrics defined

### Monetization
- [ ] Monetization charges where value delivered?
- [ ] Pricing has clear value ratio (10:1+)?

### Architecture
- [ ] Architecture optimizes journey critical path?

### Analytics Implementation
- [ ] Event taxonomy defined (snake_case, past tense)
- [ ] Core events mapped to journey steps + North Star
- [ ] Analytics tool selected with rationale
- [ ] User ID strategy (anonymous → identified → stitching)
- [ ] Privacy compliance (GDPR, IP, PII, retention)

### Overall
- [ ] All decisions trace to journey?

## After Generation

Show summary:
```
[✓] Session 4 complete! Tactical foundation established.

Your Strategy:
  Mission: [One-sentence mission]
  Metrics Framework: [AARRR/HEART/North Star]
  North Star: [Metric name]
  Pricing: [Model summary]
  Architecture: [Key principle]
  Analytics: [Tool recommendation]

Files created:
- product-guidelines/03a-mission.md
- product-guidelines/03b-metrics.md
- product-guidelines/03c-monetization.md
- product-guidelines/04-architecture.md
- product-guidelines/03d-analytics-strategy.md

Next, we'll create a brand strategy that expresses your journey value.

When ready, run: /create-brand-strategy
Or check progress: /cascade-status
```

## Important Guidelines

1. **Trace everything to journey**: Don't invent new personas/problems
2. **Be specific**: Use actual numbers from journey (time saved, cost, etc.)
3. **Show connections**: Explicitly link mission→metrics→monetization
4. **Validate value ratio**: User should get 10x+ what they pay
5. **Keep architecture simple**: Optimize for journey, not theoretical scale

## Reference Files

- Templates: `/templates/03a-mission-template.md`, `/templates/03b-metrics-template.md`, `/templates/03c-monetization-template.md`, `/templates/04-architecture-template.md`, `/templates/03d-analytics-strategy-template.md`
- Examples: `/examples/compliance-saas/foundation/` and `/examples/compliance-saas/stack/`

---

**Now, read the journey, product strategy, and tech stack, then generate all 5 tactical foundation files!**

## After Generating Strategy Documents

Once you've written all 5 files (`03a-mission.md`, `03b-metrics.md`, `03c-monetization.md`, `04-architecture.md`, `03d-analytics-strategy.md`), invoke the distillation agent to create context files for each:

Use the Task tool (5 separate invocations):

1. **Mission context file**:
   - **subagent_type**: `general-purpose`
   - **description**: `Generate mission context file`
   - **prompt**:
     ```
     Invoke the context distillation agent to create token-optimized context file.

     Source file: product-guidelines/03a-mission.md
     Output file: product-guidelines/03a-mission.ctx.md

     Follow the distillation agent specification in .claude/agents/distill-context.md to:
     1. Extract mission statement, vision, and core principles (CRITICAL)
     2. Remove elaboration, examples, validation content
     3. Preserve section structure from source file
     4. Achieve 60-70% token reduction
     5. Add source reference header
     6. Write to output file path
     ```

2. **Metrics context file**:
   - **subagent_type**: `general-purpose`
   - **description**: `Generate metrics context file`
   - **prompt**:
     ```
     Invoke the context distillation agent to create token-optimized context file.

     Source file: product-guidelines/03b-metrics.md
     Output file: product-guidelines/03b-metrics.ctx.md

     Follow the distillation agent specification in .claude/agents/distill-context.md to:
     1. Extract metric names, target values, and measurement approach (CRITICAL)
     2. Remove rationale for metric selection, detailed examples
     3. Preserve section structure from source file
     4. Achieve 60-70% token reduction
     5. Add source reference header
     6. Write to output file path
     ```

3. **Monetization context file**:
   - **subagent_type**: `general-purpose`
   - **description**: `Generate monetization context file`
   - **prompt**:
     ```
     Invoke the context distillation agent to create token-optimized context file.

     Source file: product-guidelines/03c-monetization.md
     Output file: product-guidelines/03c-monetization.ctx.md

     Follow the distillation agent specification in .claude/agents/distill-context.md to:
     1. Extract pricing model, tiers, and value alignment (CRITICAL)
     2. Remove market research, competitive pricing details
     3. Preserve section structure from source file
     4. Achieve 60-70% token reduction
     5. Add source reference header
     6. Write to output file path
     ```

4. **Architecture context file**:
   - **subagent_type**: `general-purpose`
   - **description**: `Generate architecture context file`
   - **prompt**:
     ```
     Invoke the context distillation agent to create token-optimized context file.

     Source file: product-guidelines/04-architecture.md
     Output file: product-guidelines/04-architecture.ctx.md

     Follow the distillation agent specification in .claude/agents/distill-context.md to:
     1. Extract ALL architectural decisions: patterns, services, communication (CRITICAL)
     2. Remove pattern explanations, detailed examples
     3. Preserve section structure from source file
     4. Achieve 60-70% token reduction
     5. Add source reference header
     6. Write to output file path
     ```

5. **Analytics Strategy context file**:
   - **subagent_type**: `general-purpose`
   - **description**: `Generate analytics strategy context file`
   - **prompt**:
     ```
     Invoke the context distillation agent to create token-optimized context file.

     Source file: product-guidelines/03d-analytics-strategy.md
     Output file: product-guidelines/03d-analytics-strategy.ctx.md

     Follow the distillation agent specification in .claude/agents/distill-context.md to:
     1. Extract event taxonomy, core events, tool selection, privacy rules (CRITICAL)
     2. Remove detailed examples, rationale for tool choices
     3. Preserve section structure from source file
     4. Achieve 60-70% token reduction
     5. Add source reference header
     6. Write to output file path
     ```

## CRITICAL CHECKPOINT

Session 4 complete! You've established your tactical foundation.

Before proceeding, validate that these strategic decisions align with your user journey and will serve as a solid foundation for all remaining sessions.

**REVIEW CHECKLIST:**
- [ ] Metrics framework selected with clear rationale (AARRR/HEART/North Star)
- [ ] Mission statement references journey aha moment (typically Step 3)
- [ ] Metric tree has L0→L1→L2→L3 hierarchy with team ownership
- [ ] North Star metric measures user value delivery (not vanity metrics)
- [ ] Minimum 2 counter-metrics defined to prevent gaming
- [ ] Monetization model charges where value is delivered (value ratio >10:1)
- [ ] Architecture principles optimize journey critical path
- [ ] Analytics implementation includes event taxonomy, tool selection, privacy

**What happens next:**
These decisions cascade through Sessions 5-14. Session 5 will create your brand strategy using this mission as foundation. Sessions 7-9 will use these architecture principles for technical design.

**If you found issues:**
Run `/generate-strategy` again to regenerate with fresh analysis (preserves same journey context).

**If everything looks good:**
Type "continue" when ready to proceed to Session 5 (brand strategy).

---

## Output Format

IMPORTANT: Do not use emojis in generated outputs. Use plain text for all communication.
