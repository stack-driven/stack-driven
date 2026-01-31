---
description: Session 10 - Generate complete backlog from journey through to technical specs
---

# Session 10: Generate Backlog

This is **Session 10** of the cascade. You'll create a production-ready backlog where every issue traces to user value and is informed by technical specifications (database schema, API contracts, testing strategy).

## Your Role

You're a technical product manager creating a systematic backlog from all cascade outputs.

## Process

### Step 1: Read ALL Previous Outputs

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

Read: product-guidelines/03a-mission.ctx.md
Read: product-guidelines/03b-metrics.ctx.md
Read: product-guidelines/03c-monetization.ctx.md
Read: product-guidelines/04-architecture.ctx.md
Read: product-guidelines/07-database-schema.ctx.md
Read: product-guidelines/08-api-design.ctx.md
Read: product-guidelines/08b-api-contracts.ctx.md
Read: product-guidelines/09-test-strategy.ctx.md
Read: product-guidelines/09b-application-architecture.ctx.md
```

**Context Optimization**: We read .ctx.md files for significant context reduction:
- `01-product-strategy.ctx.md` (not `01-product-strategy.md`) - 65% reduction: Contains vision, positioning, goals, principles, and roadmap themes—without market analysis and competitive landscape.
- `02a-constraints.ctx.md` (if exists) - 70% reduction: Contains critical technical, organizational, and compliance constraints with trade-off decisions—without detailed constraint explanations and validation checklists.
- `02b-coding-standards.ctx.md` (not `02b-coding-standards.md`) - 70% reduction: Contains framework-specific patterns, file organization, and naming conventions—without detailed implementation examples and migration guides.
- `02c-ai-integration-strategy.ctx.md` (if exists) - 60% reduction: Contains AI implementation patterns, model choices, cost projections, and MVP phasing—without detailed compliance documentation and fallback strategies.
- `07-database-schema.ctx.md` (not `07-database-schema.md`) - 56% reduction: Contains table list, ERD, relationships, and data access patterns—without column details, indexes, migrations, and scaling considerations.
- `08-api-design.ctx.md` (Session 8) - Condensed: Contains API paradigm (REST/GraphQL/gRPC), serialization format (JSON/Protobuf/MessagePack), auth method, rate limiting, pagination approach, and error format—without decision trees, journey analysis, and alternatives.
- `08b-api-contracts.ctx.md` (Session 8b) - 80% reduction: Contains endpoint list organized by journey step with brief descriptions—without OpenAPI schemas, request/response definitions, error schemas, and authentication flow details.
- `09-test-strategy.ctx.md` (not `09-test-strategy.md`) - 66% reduction: Contains coverage targets, test types, testing tools, and quality gates—without testing philosophy, detailed examples, test data management, performance testing, security testing, and TDD/BDD workflows.
- `09b-application-architecture.ctx.md` (not `09b-application-architecture.md`) - ~60% reduction: Contains service list with method signatures, repository methods, controller endpoint mappings, and component hierarchy—without business rules, implementation details, design decisions, and architecture rationale.

Note: Brand strategy (formerly 07) and design system (formerly 08) are now POST-CASCADE extensions if needed, not required for backlog generation.

### Step 2: Generate Epic Structure (Activity-Based, Journey-Driven)

**IMPORTANT**: Epic structure is generative, NOT prescriptive. Extract ACTIVITIES/GOALS from journey, not step counts.

#### Step 2.1: Extract Activities (User Goals) from Journey

Read `product-guidelines/00-user-journey.ctx.md`:

**For each journey step, identify the high-level USER GOAL:**
- What is the user trying to ACHIEVE? (not what are they doing)
- Group consecutive steps that serve the same goal into ONE activity
- Abstract from features/tasks to goals

**Process:**
1. Read journey step descriptions carefully
2. For each step, ask: "What user goal does this serve?"
3. Group steps by shared goal/purpose
4. Name each activity using goal-based naming

**Activity naming examples:**
- "Get Access" (goal: enter the system)
- "Provide Input" (goal: submit data for processing)
- "Receive Value" (goal: get core product value)
- "Act on Results" (goal: use insights/outputs)

**Result:** 2-5 activities (depends on journey goal complexity, NOT step count)

**Example:**

Journey (7 steps):
1. Sign up for account
2. Verify email
3. Upload compliance document
4. AI analyzes document
5. Review assessment results
6. Generate compliance report
7. Share report with team

Activities extracted:
- Activity 1: Get Access (Steps 1-2) → Goal: "Get into the system"
- Activity 2: Submit Document (Step 3) → Goal: "Provide input for analysis"
- Activity 3: Receive AI Assessment (Step 4) → Goal: "Get automated analysis"
- Activity 4: Act on Results (Steps 5-7) → Goal: "Use insights from analysis"

Result: 7 steps → 4 activities

#### Step 2.2: Validate Activity Size

For each activity, estimate implementation scope:

**Each activity should:**
- Take weeks/months to implement (not days)
- Span 2-6 sprints
- Contain 5-20+ user stories

**Adjustments:**
- If activity too small (1-4 stories): Merge with related activity
- If activity too large (25+ stories): Split into sub-activities with distinct goals

**Validation questions:**
- Does this activity represent a distinct user goal?
- Can this be implemented in 2-6 sprints?
- Does this group have 5-20+ stories?

#### Step 2.3: Convert Activities → Business Epics

Each validated activity = One business epic

**Epic naming format:**
- ✅ "Get Access" (goal-based)
- ✅ "Submit for Assessment" (goal-based)
- ✅ "Receive AI Analysis" (goal-based)
- ❌ "Onboarding (Steps 1-2)" (step-range, FORBIDDEN)
- ❌ "Epic 01: User Journey Start" (generic, FORBIDDEN)

**Business epics will be numbered Epic 02+ (Foundation is always Epic 01)**

#### Step 2.4: Add Enabler Epics

**CRITICAL: Epic numbering follows implementation order**

**Epic 01: Foundation (Always First)**

This enabler epic ALWAYS comes first (blocks all business epics):
- Authentication & authorization
- Database setup & migrations
- Infrastructure (CI/CD, deployment)
- Legal/compliance (Terms of Service, Privacy Policy, Cookie Policy, DPA)
- Integration infrastructure (if third-party APIs exist)
- Error handling & logging baseline

**Epic 02 through Epic N: Business Epics (Journey Activities)**

Number business epics in journey chronological order:
- Epic 02: [First Activity] (e.g., "Get Access")
- Epic 03: [Second Activity] (e.g., "Submit Document")
- Epic 04: [Third Activity] (e.g., "Receive Assessment")
- ...

**Epic N+1 onwards: Conditional Enabler Epics**

Add these ONLY if criteria met:

**Epic: Design System**
- **Detection**: Read `product-guidelines/06-design-system.ctx.md` if exists
- **Criteria**: Add if >20 components OR design-heavy product
  - Design-heavy heuristics:
    - Journey mentions visual appeal, aesthetics, design quality as critical
    - Multi-platform requirements (3+ device types)
    - Design-sensitive personas (designers, marketers, content creators)
    - Brand-critical products (trust through visual consistency)
    - Consumer-facing B2C (vs. B2B functionality-focused)
- **Alternative**: If <20 components AND not design-heavy, embed design stories in journey epics

**Epic: Metrics & Analytics**
- **Detection**: Read `product-guidelines/03b-metrics.ctx.md`
- **Criteria**: Add if complex funnel tracking needed:
  - Multi-stage conversion funnel with 4+ tracked steps
  - A/B testing planned for 3+ journey steps
  - Advanced analytics (cohort analysis, retention curves, attribution)
- **Alternative**: If simple metrics, add instrumentation as acceptance criteria in journey stories

**Epic: AI/ML Features**
- **Detection**: Check if `product-guidelines/02c-ai-integration-strategy.ctx.md` exists
- **Criteria**: Add if AI is core to value delivery (not peripheral)
- **Contains**: Prompt engineering, RAG setup, model routing, cost monitoring
- **Alternative**: If AI is peripheral feature, embed in journey epics

**Epic: i18n/l10n**
- **Detection**: Read `product-guidelines/02a-constraints.ctx.md`
- **Criteria**: Add if "Internationalization requirements (i18n, l10n)" marked as required
- **Alternative**: If single market MVP, skip or embed i18n infrastructure in Foundation epic

**Epic: Third-Party Integrations**
- **Detection**: Read `product-guidelines/02a-constraints.ctx.md`
- **Criteria**: Add if 3+ third-party APIs (Stripe, SendGrid, Salesforce, etc.)
- **Alternative**: If 0-2 integrations, embed integration stories in journey epics

#### Step 2.5: Generate Epic Structure Rationale

Create an "Epic Structure Rationale" section for BACKLOG.md explaining:

**Required content:**
- Total epic count and breakdown (1 foundation + X business + Y conditional enabler)
- List of activities extracted from journey with step mappings
- Explanation of why activities were grouped this way
- Which conditional epics were included and why
- Note: "Epic numbering follows implementation order: Foundation (Epic 01) → Business (Epic 02+) → Conditional Enablers"

**Example Epic Structure Rationale:**

```markdown
## Epic Structure Rationale

Generated 5 epics by extracting 3 user goals from 5-step journey:

**Epic 01: Foundation (Enabler)**
- Auth, database, infrastructure, legal/compliance
- Blocks all business epics (must implement first)

**Business Epics (3 epics from journey activities):**
- Epic 02: Get Access (Journey Steps 1-2)
  - User goal: "Get into the system"
  - Estimated: 8 stories, 2 sprints
- Epic 03: Submit Document (Journey Step 3)
  - User goal: "Provide input for analysis"
  - Estimated: 12 stories, 3 sprints
- Epic 04: Receive Assessment (Journey Steps 4-5)
  - User goal: "Get AI insights and act on results"
  - Estimated: 15 stories, 3 sprints

**Conditional Enabler Epics (1 epic):**
- Epic 05: Design System
  - Criteria met: 24 components detected in Session 6, design-heavy product (consumer-facing, visual trust critical)
  - Estimated: 18 stories, 4 sprints

**Total:** 5 epics (1 foundation + 3 business + 1 conditional)

This structure aligns with Stack-Driven's generative philosophy: epic count emerges from journey goal analysis, not prescriptive step-counting formulas.
```

### Step 3: Generate User Stories (30-50 total)

For EACH journey step, create stories that:

1. **Enable that step's user value**
2. **Use specified tech stack**
3. **Implement designed components**
4. **Track defined metrics**
5. **If AI integration exists, implement AI features** (prompt engineering, RAG setup, model routing, etc.)

**Story Format** (use `/templates/issue-template.md`):
```markdown
# [STORY-001] OAuth-based signup with Google

Type: Story
Journey Step: Step 1 (Onboarding)
Priority: P0

## User Value
When a compliance officer wants to try the product, they want frictionless signup, so they can reach value quickly.

Value: Reduces signup friction, improves activation rate (key metric).

## Acceptance Criteria
- [ ] User clicks "Sign up with Google"
- [ ] OAuth flow completes, creates user in PostgreSQL
- [ ] User lands in empty dashboard (ready for Step 2)

## Technical Approach
Tech Stack: Clerk for auth, PostgreSQL for user storage, Next.js frontend

## Dependencies
Blocked By: EPIC-04 (Database schema setup)

## Estimation
Effort: 2 days (1 day Clerk integration, 1 day user creation flow)
```

**Required Foundation Stories (Epic 01: Foundation)**:

Every backlog MUST include these legal/compliance stories:
- **Terms of Service/Conditions**: Legal agreement users accept when signing up
- **Privacy Policy**: How user data is collected, used, stored, and protected
- **Cookie Policy** (if applicable): Cookie usage and consent management
- **Data Processing Agreement** (for B2B/Enterprise): GDPR/compliance requirements

These are P0 priorities - production applications cannot launch without them.

**Third-Party Integration Stories** (if integrations exist from Session 2a):

For EACH third-party integration identified in Session 2a, create stories following these patterns:

#### Integration Infrastructure (Epic 01: Foundation) - Create Once
Before individual integration stories, create shared infrastructure:
- [ ] **Integration credential storage**: Database schema (integration_credentials table), encryption setup (application-layer encryption using libsodium or similar)
- [ ] **Webhook infrastructure** (if webhooks exist): Endpoint routing, signature verification middleware, async processing queue (Redis/SQS), background workers
- [ ] **Integration monitoring**: Health checks, success rate tracking (>99.5% target), alerting setup (5+ consecutive failures)
- [ ] **Rate limiting client**: Client-side rate limiter, track provider limits, queue excess requests

#### Per-Integration Story Patterns

**Pattern 1: API-only integrations** (e.g., SendGrid, Twilio)

```markdown
# [STORY-XXX] [Provider] API Integration

Type: Story
Journey Step: [Which step requires this integration]
Priority: P0/P1 (P0 if MVP-required from Session 2a)

## User Value
When a [user persona] wants to [action], they need [integration capability], so they can [outcome].

Example: "When a compliance officer completes assessment, they need email notification via SendGrid, so they can review results immediately (serves Step 4 of journey)."

## Acceptance Criteria
- [ ] [Provider] SDK/client library installed and configured
- [ ] API credentials stored securely in integration_credentials table (encrypted at application layer)
- [ ] [Core API functionality] implemented (send email, create resource, fetch data, etc.)
- [ ] Error handling with retry logic (exponential backoff: 1s → 2s → 4s → 8s → 16s, max 5 attempts)
- [ ] Rate limiting client-side (respect provider's rate limits from Session 4 architecture)
- [ ] Integration health metrics tracked (success rate, latency, error types)
- [ ] Unit tests for API client wrapper (mock provider responses)
- [ ] Integration tests with provider's test mode/sandbox environment

## Technical Approach
Tech Stack: [Backend framework from Session 3], [Provider SDK]
Database: integration_credentials table for API key storage
Patterns: Retry with exponential backoff, circuit breaker if non-critical (from Session 4 architecture)

## Dependencies
Blocked By: STORY-XXX (Integration infrastructure setup)

## Estimation
Effort: [2-3 days] (1 day setup + SDK integration, 1 day core implementation, 0.5 day testing)
```

**Pattern 2: Webhook integrations** (e.g., Stripe, Salesforce)

```markdown
# [STORY-XXX] [Provider] Webhook Integration

Type: Story
Journey Step: [Which step requires real-time updates]
Priority: P0 (webhooks are often critical for real-time updates)

## User Value
When [external event occurs], the system needs to receive real-time notification from [provider], so [user] can see [updated state] immediately.

Example: "When Stripe confirms payment, system needs webhook notification, so user's account is activated instantly without manual check (serves Step 5 of journey)."

## Acceptance Criteria
- [ ] Webhook endpoint created: POST /webhooks/[provider] (matches Session 8b API contract)
- [ ] Signature verification implemented (HMAC-SHA256 validation using webhook secret)
- [ ] Idempotency check (webhook_events table, unique constraint on provider + event_id)
- [ ] Async processing (enqueue event to Redis/SQS, return 200 within 5 seconds)
- [ ] Background worker processes webhook events from queue
- [ ] Retry handling for failed webhook processing (max 5 attempts with exponential backoff)
- [ ] Webhook events logged to webhook_events table for debugging and audit
- [ ] Provider's webhook registered in their dashboard (endpoint URL, events to subscribe, verification)
- [ ] Integration tests with provider's webhook test events

## Technical Approach
Tech Stack: [Backend framework], webhook_events table, [Queue: Redis/SQS from Session 4]
Security: HMAC-SHA256 signature verification using webhook secret (from Session 4 architecture)
Processing: Async to avoid timeout (provider expects 200 within 5s per Session 8b)

## Dependencies
Blocked By: STORY-XXX (Webhook infrastructure setup)

## Estimation
Effort: [3-4 days] (1 day endpoint + verification, 1 day processing logic, 1 day testing, 0.5 day monitoring)
```

**Pattern 3: Bidirectional sync integrations** (e.g., Salesforce CRM sync)

```markdown
# [STORY-XXX] [Provider] Bidirectional Sync

Type: Story
Journey Step: [Which step requires data consistency]
Priority: P1 (often post-MVP)

## User Value
When [user action occurs], data should sync to [external system], and when [external event occurs], changes should sync back, so [user] has consistent data everywhere.

Example: "When compliance officer completes assessment, create Salesforce opportunity, and when sales rep closes deal in Salesforce, update user's account status here (serves Step 6 of journey: sharing results with sales team)."

## Acceptance Criteria
- [ ] Outbound sync: [Action] creates/updates [resource] in [provider] via API
- [ ] Inbound sync: [Provider webhook/polling] updates [resource] locally
- [ ] External resource mappings stored (external_resource_mappings table: internal_id ↔ external_id)
- [ ] Sync jobs tracked (sync_jobs table with status, progress, errors, retry count)
- [ ] Conflict resolution strategy implemented (last-write-wins, manual review, or custom per Session 2a)
- [ ] Background sync workers process sync_jobs queue
- [ ] Sync health dashboard (last sync time, success rate, failed records count)
- [ ] Manual sync trigger (admin can force re-sync for debugging)
- [ ] Error handling with retry (max 3 attempts, then flag for manual review)

## Technical Approach
Tech Stack: [Backend framework], [Provider SDK], sync_jobs + external_resource_mappings tables
Sync Frequency: [Real-time via webhooks / Scheduled every X minutes based on Session 2a]
Conflict Resolution: [Strategy based on Session 2a requirements: last-write-wins, timestamp-based, manual review]

## Dependencies
Blocked By: STORY-XXX ([Provider] API integration), STORY-XXX ([Provider] webhook integration if applicable)

## Estimation
Effort: [5-8 days] (2 days outbound sync, 2 days inbound sync, 2 days conflict handling + mappings, 1-2 days testing)
```

**Story Generation Logic**:
1. Read Session 2a constraints for list of integrations
2. For each integration, determine type:
   - API-only: No webhooks mentioned
   - Webhook: Session 2a mentions "receive events" or "webhooks"
   - Bidirectional: Session 2a mentions "sync" or "two-way"
3. Generate infrastructure stories first (once for all integrations)
4. Generate individual stories per pattern
5. Set priority based on Session 2a "Integration timeline priority" (MVP-required = P0, post-MVP = P1)

**AI-Specific Stories (if 02c-ai-integration-strategy exists)**:

When AI integration strategy is present, include these stories based on the chosen patterns:
- **Prompt Engineering**: Stories for crafting and testing prompts for each AI feature
- **RAG Implementation** (if using RAG): Vector store setup, chunking strategy, retrieval optimization
- **Model Routing** (if using multiple models): Router implementation, fallback logic
- **Cost Monitoring**: Usage tracking, budget alerts, optimization stories
- **AI Quality Assurance**: Response validation, accuracy testing, feedback loops
- **Compliance Setup** (if regulated): DPA configuration, data retention policies

**Internationalization (i18n) Stories (if 02a-constraints.ctx.md marks i18n as required)**:

Check `product-guidelines/02a-constraints.ctx.md` for "Internationalization requirements (i18n, l10n)" marked as required.

When i18n is required, include these Foundation epic stories:

**i18n Infrastructure Setup**:
```markdown
# [STORY-XXX] Set up i18n translation file structure

Type: Story
Epic: Epic 01 (Foundation)
Priority: P0

## User Value
When users from different regions use the product, they want content in their native language, so they can understand and use the product effectively.

Value: Enables multi-language support as required by constraints (Session 2a).

## Acceptance Criteria
- [ ] Create `/locales/` directory structure with subdirectories for each supported language
- [ ] Initialize translation files (e.g., `common.json`, `errors.json`) for each locale
- [ ] Configure i18n library ([from Session 3: next-intl/react-i18next/vue-i18n/etc.])
- [ ] Implement locale detection (Accept-Language header + user preference)
- [ ] Add locale fallback chain (e.g., de-CH → de-DE → en-US)

## Technical Approach
Tech Stack: [i18n library from Session 3], JSON translation files
Database: User.preferred_locale column (from Session 7)
API: Accept-Language header support (from Session 8)

## Dependencies
Blocked By: Database schema setup (User table with preferred_locale)

## Estimation
Effort: 2 days (1 day structure and config, 1 day locale detection logic)
```

**Locale Switching UI**:
```markdown
# [STORY-XXX] Implement locale switching UI component

Type: Story
Epic: Epic 01 (Foundation)
Priority: P0

## User Value
When users want to change their language preference, they want a simple dropdown/selector, so they can switch languages immediately.

Value: Enables users to override browser defaults and save preferences.

## Acceptance Criteria
- [ ] Create locale selector component (dropdown or similar)
- [ ] Display available locales (from Session 2a constraints)
- [ ] Save preference to user.preferred_locale in database
- [ ] Page content updates immediately without refresh
- [ ] Persist selection across sessions

## Technical Approach
Component: LanguageSelector (design system component)
API: PATCH /api/users/{id} with preferred_locale field
State: Update i18n context/provider with new locale

## Dependencies
Blocked By: i18n infrastructure setup, User API endpoints

## Estimation
Effort: 1.5 days
```

**Extract Hardcoded Strings to Translation Keys**:
```markdown
# [STORY-XXX] Extract hardcoded UI strings to translation files

Type: Story
Epic: Epic 01 (Foundation)
Priority: P1 (can be done incrementally per feature)

## User Value
When users switch languages, they want ALL UI text translated, so the experience is fully localized.

Value: Ensures consistent multi-language experience across the product.

## Acceptance Criteria
- [ ] Audit codebase for hardcoded strings in components
- [ ] Extract strings to translation keys (e.g., "Sign Up" → t('auth.signUp'))
- [ ] Create translation entries for all supported locales
- [ ] Verify no hardcoded user-facing strings remain
- [ ] Document translation key naming convention

## Technical Approach
Tools: i18n library's translation function (e.g., useTranslation hook, $t function)
Pattern: Namespace-based keys (e.g., 'auth.signUp', 'errors.validation.required')

## Dependencies
Blocked By: i18n infrastructure setup

## Estimation
Effort: 3-5 days (depends on codebase size; can be split by feature/epic)
```

**Translation Requirement Markers**:
When generating other user stories, check if they involve user-facing content:
- If UI components, forms, or messages: Add acceptance criterion "[ ] All user-facing strings use translation keys"
- If API endpoints: Add acceptance criterion "[ ] Error messages localized based on Accept-Language"
- If database entities (e.g., Product, Framework): Reference translation table pattern from Session 7

### Step 4: Apply RICE Prioritization

For each story, calculate RICE:

**R (Reach)**: How many users affected per time period?
**I (Impact)**: Journey improvement (0.25 = minimal, 0.5 = low, 1 = medium, 2 = high, 3 = massive)
**C (Confidence)**: Evidence level (50% = low, 80% = medium, 100% = high)
**E (Effort)**: Person-days

**RICE Score** = (R × I × C) ÷ E

**Priority Assignment**:
- P0: RICE > [threshold], critical for MVP
- P1: Important, post-MVP
- P2: Nice-to-have, defer

### Step 5: Map Dependencies

For each story, note:
- **Blocks**: What stories can't start until this is done?
- **Blocked By**: What must be done first?

Example:
- STORY-001 (OAuth) blocks STORY-010 (User dashboard)
- STORY-001 blocked by EPIC-04 (Database setup)

## Generating the Output

### Create Directory Structure:

```
product-guidelines/10-backlog/
├── BACKLOG.md (summary)
└── issues/
    ├── epic-01-onboarding.md
    ├── epic-02-core-value.md
    ├── story-001-oauth-signup.md
    ├── story-002-document-upload.md
    └── ... (30-50 stories total)
```

### BACKLOG.md Contents:

- Epic summary (6-8 epics)
- Priority distribution (X P0 stories, Y P1, Z P2)
- Estimated timeline (total effort in weeks)
- Journey mapping (which stories serve which journey steps)

### Issue File Contents:

Use `/templates/issue-template.md` for EVERY story.

**Critical**: Each story must have:
- Journey step reference
- Clear user value
- Acceptance criteria (testable)
- Tech stack components used
- RICE score and priority
- Dependencies

## Validation Checklist

- [ ] **Activity extraction validation**: Each business epic traces to a user GOAL (not step range)
- [ ] **Epic count validation**: Epic count = activities extracted (NOT step count formula)
- [ ] **Epic naming validation**: Names are goal-based ("Get Access", not "Onboarding (Steps 1-2)")
- [ ] **Epic numbering validation**: Epic 01 is always Foundation (enabler)
- [ ] **Business epic order**: Epic 02+ numbered in journey chronological order
- [ ] **Epic sizing validation**: Each epic estimated at 5-20+ stories (appropriate size)
- [ ] **Epic Structure Rationale exists**: BACKLOG.md explains activity extraction and grouping decisions
- [ ] **Dependencies mapped**: All business epics show "Blocked By: Epic 01 (Foundation)"
- [ ] Every issue references a journey step?
- [ ] All P0 issues have clear acceptance criteria?
- [ ] Dependencies are mapped?
- [ ] Tech stack alignment (using Session 3 choices)?
- [ ] Required legal stories included (Terms, Privacy Policy, Cookie Policy, DPA)?
- [ ] Third-party integration stories follow pattern (if integrations exist)?
- [ ] AI integration stories included (if 02c-ai-integration-strategy exists)?
- [ ] i18n stories included (if 02a-constraints marks i18n required)?

## After Generation

```
[✓] Session 10 complete! Production backlog generated.

Your Backlog:
  [X] epics covering full user journey
  [Y] user stories (prioritized with RICE)
   - [A] P0 stories (critical for MVP)
   - [B] P1 stories (important, post-MVP)
   - [C] P2 stories (nice-to-have)

Estimated MVP timeline: [Z] weeks

File created: product-guidelines/10-backlog/BACKLOG.md + [Y] issue files

Next, we can push these issues to GitHub.

When ready, run: /create-gh-issues
Or check progress: /cascade-status
```

## Important Guidelines

1. **Every issue traces to journey**: No "nice to have" features disconnected from user value
2. **Use specified tech stack**: Stories should reference chosen technologies
3. **Implement design system**: Stories should reference designed components
4. **Track metrics**: Include analytics instrumentation stories
5. **Reasonable estimates**: No story >5 days (break down if larger)
6. **Clear acceptance criteria**: Every story testable
7. **Include legal compliance**: Every backlog MUST include Terms of Service, Privacy Policy, and other required legal documents (P0 priority)

## Reference

- Template: `/templates/issue-template.md`
- Example: `/examples/compliance-saas/backlog/` (if created)

---

**Now, synthesize all cascade outputs into a complete, prioritized backlog!**

## Session 10 Checkpoint

After generating the backlog, STOP and present this checkpoint:

---

**Session 10 complete! Production backlog generated.**

**REVIEW CHECKLIST:**
- [ ] Each business epic traces to a user GOAL (not step range)
- [ ] Epic count matches activities extracted from journey (NOT step count)
- [ ] Epic names are goal-based ("Get Access", not "Onboarding (Steps 1-2)")
- [ ] Epic 01 is Foundation (enabler epic)
- [ ] Business epics (Epic 02+) follow journey chronological order
- [ ] Each epic estimated at 5-20+ stories (weeks/months of work)
- [ ] Epic Structure Rationale section exists and explains activity extraction
- [ ] Dependencies clearly mapped (business epics blocked by Epic 01)
- [ ] Journey traceability: Stories reference specific journey steps and value

**What happens next:**
Session 11 (`/create-gh-issues`) will push these issues to GitHub. Epic structure becomes your project roadmap.

**If you found issues:**
Run `/generate-backlog` again to regenerate with fresh analysis.

**If everything looks good:**
Type "continue" when ready to proceed to Session 11 (push to GitHub).

---

## Output Format

IMPORTANT: Do not use emojis in generated outputs. Use plain text for all communication.
