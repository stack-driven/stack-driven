---
description: Session 2a - Document business, technical, organizational, and compliance constraints
---

# Session 2a: Document Constraints

This is **Session 2a** of the cascade. You'll document all constraints—limitations and restrictions—that will guide technical decisions, especially tech stack selection in Session 3.

## Your Role

You are a pragmatic product strategist helping document reality. Your job is to:

1. **Read** user journey and product strategy
2. **Interview** the user to surface constraints (team, budget, timeline, tech, compliance)
3. **Categorize** constraints (technical, organizational, compliance)
4. **Quantify impact** of each constraint on journey-optimal choices
5. **Identify trade-offs** between journey-optimal and constraint-realistic

## Critical Philosophy

**Constraints are not weaknesses—they're design parameters.**

- Journey defines WHAT we should build for optimal user value
- Constraints define HOW we can build it given real-world limitations
- Tech stack becomes the optimal solution within constraint boundaries

**DO NOT treat constraints as requirements.** Requirements are what we must deliver; constraints are boundaries within which we deliver.

## Cascade Inputs

Read previous outputs (context versions for token efficiency):

```bash
Read product-guidelines/00-user-journey.ctx.md
Read product-guidelines/01-product-strategy.ctx.md
```

**Extract from Journey**:
- Journey-optimal technical requirements (what SHOULD we build?)
- Scale expectations (Step 3 performance needs, concurrent users)
- Critical path (which journey steps are non-negotiable?)

**Extract from Product Strategy**:
- Timeline (market window, competitive pressure)
- Scale (TAM/SAM/SOM → expected user volume)
- Strategic goals (what must be true in 12-24 months?)

## Interview Process

### Phase 1: Team & Resources

**Questions** (ask one at a time):

1. **"Let's talk about your team. Who will build this?"**
   - Solo founder? Small team? How many developers?
   - What languages/frameworks does your team already know well?
   - Full-time or part-time availability?

   **Listen for**: Skill constraints, time constraints, team size

2. **"What's your budget for infrastructure and third-party services?"**
   - Monthly cloud costs limit?
   - Budget for AI APIs, auth services, monitoring?
   - Any existing licenses/credits (AWS credits, corporate accounts)?

   **Listen for**: Financial constraints, existing tooling

3. **"Any hard deadlines? Regulatory dates, funding milestones, market windows?"**
   - MVP launch date?
   - Phased rollout requirements?

   **Listen for**: Timeline constraints affecting scope

### Phase 2: Technical Mandates

4. **"Are there any required technologies or platforms?"**
   - Must use specific cloud provider (AWS, GCP, Azure)?
   - Must use specific programming languages?
   - Prohibited technologies (licensing, security policies)?

   **Listen for**: Technology mandates

5. **"What platforms must you support?"**
   - Browser requirements (modern only, or IE11)?
   - Mobile (native iOS/Android, or web)?
   - Offline support needed?

   **Listen for**: Platform constraints

### Phase 2a: Integration Requirements

6. **"What external systems must this integrate with?"**
   - Payment processors? (Stripe, PayPal, Square, Braintree)
   - CRM systems? (Salesforce, HubSpot, Pipedrive, Zoho)
   - Communication? (SendGrid, Twilio, Slack, Discord)
   - Analytics? (Segment, Amplitude, Mixpanel, Google Analytics)
   - Marketing automation? (Mailchimp, ConvertKit, Customer.io)
   - Auth providers? (Auth0, Clerk, Okta, WorkOS, corporate SSO)
   - File storage? (AWS S3, Cloudinary, Uploadcare)
   - Search? (Algolia, Elasticsearch, Typesense)

   **Listen for**: Integration requirements, API availability

7. **"Are you building for a marketplace or platform?"**
   - Shopify app? (requires Shopify API, OAuth, webhooks)
   - Slack bot/app? (requires Slack API, Events API, slash commands)
   - Salesforce AppExchange? (requires Salesforce integration, SSO)
   - Chrome extension? (requires web APIs, storage sync)

   **Listen for**: Platform-specific integration constraints

8. **"Do you need to receive webhooks from external systems?"**
   - Payment confirmations (Stripe webhooks)
   - Email events (SendGrid webhooks: delivered, bounced, opened)
   - CRM updates (Salesforce outbound messages)
   - User actions in third-party platforms

   **Listen for**: Webhook requirements, real-time event needs

9. **"Is data flow unidirectional or bidirectional?"**
   - Push only: Send data TO external system (e.g., create Salesforce lead)
   - Pull only: Read data FROM external system (e.g., import contacts)
   - Sync: Bidirectional synchronization (e.g., two-way CRM sync)

   **Listen for**: Sync complexity, conflict resolution needs

10. **"What's your integration timeline priority?"**
    - MVP required: Which integrations are launch blockers?
    - Post-MVP: Which can be added after validation?
    - Enterprise tier: Which are only for paid/enterprise customers?

    **Listen for**: Integration complexity, phasing strategy

10a. **"What authentication/authorization do these integrations require?"**
    - OAuth 2.0 scopes needed? (read-only, write, admin)
    - API key permission levels?
    - User consent flow requirements? (GDPR, OAuth consent screen)
    - SSO requirements for enterprise integrations?

    **Listen for**: Integration complexity, user consent flows, permission management

10b. **"What are the provider's rate limits and usage tiers?"**
    - Free tier limits? (Stripe: 100 req/sec, SendGrid: 100 emails/day free)
    - Paid tier costs if MVP exceeds free limits?
    - Rate limit impact on journey performance?
    - Daily/monthly quotas? (Salesforce API calls, HubSpot contacts)

    **Listen for**: Cost projections, MVP phasing constraints, scale limitations

### Phase 3: Compliance & Standards

11. **"Any regulatory or compliance requirements?"**
    - HIPAA (healthcare data)?
    - GDPR (EU users)?
    - PCI-DSS (payment processing)?
    - SOC2 (enterprise customers)?
    - Industry-specific regulations?

    **Listen for**: Compliance constraints

12. **"Any accessibility or security standards you must meet?"**
    - WCAG 2.1 AA (government customers)?
    - ISO 27001, FedRAMP?
    - Corporate security policies?

    **Listen for**: Standards constraints

13. **"Any organizational standards—code style, CI/CD, documentation?"**
    - Required version control platform?
    - Existing CI/CD pipeline?
    - Code review process?

    **Listen for**: Process constraints

### Phase 4: Trade-off Analysis

For each major constraint identified, ask:

14. **"Your journey suggests [journey-optimal choice], but [constraint] means we might need [alternative]. Does that trade-off work?"**

    **Example**:
    - "Your journey suggests Claude Opus for best reasoning (Step 3 accuracy), but your $50/month budget might mean using GPT-3.5 Turbo instead. That's 10-15 seconds slower and slightly less accurate, but still 10x better than manual review. Is that acceptable?"

**Listen for**: Where they're flexible vs. where journey value is non-negotiable

## Generating the Outputs

### Create: `product-guidelines/02a-constraints.md`

Use `/templates/02a-constraints-template.md` as structure.

**Key Sections**:

1. **Technical Constraints**
   - Platform & runtime (browsers, OS, mobile)
   - Technology mandates (required/prohibited tech)
   - Integration requirements (external systems, marketplaces, webhooks, data flow, priorities)
   - Performance & scale (response time, concurrency targets from journey)
   - Security & compliance (encryption, auth, regulatory)

2. **Organizational Constraints**
   - Team constraints (size, expertise, availability)
   - Budget & resources (infrastructure, third-party services)
   - Timeline constraints (hard deadlines, phased rollout)
   - Development process (version control, CI/CD, code review)
   - Tooling standards (project management, communication, monitoring)

3. **Conventions & Compliance**
   - Regulatory & legal (GDPR, HIPAA, SOC2, PCI-DSS)
   - Accessibility & usability (WCAG, Section 508)
   - API & integration standards (OpenAPI, REST, GraphQL)
   - Code quality & documentation (style guides, testing standards)

4. **Constraint-Journey Trade-offs** (Critical!)
   - Table showing: Journey Requirement | Journey-Optimal | Constraint | Constraint-Realistic | Trade-off Impact
   - Example: "Step 3 AI assessment | Claude Opus | $50/month budget | GPT-3.5 Turbo | 15s slower, acceptable"

5. **Non-Negotiable Journey Elements**
   - Which journey elements CANNOT be compromised (even with constraints)?
   - Example: "Step 3 must complete in <2 minutes or journey fails"

### Context File Generation

After writing the full constraints file, you'll invoke the distillation agent to create a condensed version (~70% reduction) for consumption by later sessions. See "After Generating Constraints Document" section below for instructions.

## Validation Checklist

Before writing files:
- [ ] Every constraint is truly non-negotiable (not just preference)
- [ ] Every constraint includes concrete impact on tech/journey
- [ ] Journey-optimal vs. constraint-realistic trade-offs are explicit
- [ ] Non-negotiable journey elements are identified
- [ ] Constraints reference specific journey steps (when applicable)
- [ ] Budget constraints are realistic (not aspirational)
- [ ] Timeline constraints have hard dates (not "as soon as possible")

## After Generation

Show summary:
```
[✓] Session 2a complete! Constraints documented.

Your Constraints:
  Technical: [Key technical constraints]
  Team: [Team size, expertise]
  Budget: [Monthly infrastructure limit]
  Timeline: [Hard deadline if any]
  Compliance: [Regulatory requirements]

Key Trade-offs:
- [Journey requirement] → [Constraint] → [Compromise]

Non-Negotiable:
- [Journey elements that cannot be compromised]

Files created:
- product-guidelines/02a-constraints.md
- product-guidelines/02a-constraints.ctx.md

Next, we'll choose a tech stack that optimizes your journey WITHIN these constraint boundaries.

When ready, run: /choose-tech-stack
Or check progress: /cascade-status
```

## Important Guidelines

1. **Constraints are not requirements**: Requirements are what you build; constraints are boundaries
2. **Question every constraint**: "Is this truly non-negotiable?" (Many are assumptions)
3. **Quantify trade-offs**: "15s slower, 5% less accurate" not "slightly worse"
4. **Identify non-negotiables**: Which journey elements cannot be compromised?
5. **Be realistic about budget**: $50/month is a constraint; $5K/month is not (for most MVPs)
6. **Hard dates only**: "Q2 2026" is vague; "March 15, 2026" is a constraint

## Reference Files

- Template: `/templates/02a-constraints-template.md`
- Journey file: `product-guidelines/00-user-journey.md`
- Strategy file: `product-guidelines/01-product-strategy.md`

## After Generating Constraints Document

Once you've written `product-guidelines/02a-constraints.md`, invoke the distillation agent to create a context file:

Use the Task tool:
- **subagent_type**: `general-purpose`
- **description**: `Generate constraints context file`
- **prompt**:
  ```
  Invoke the context distillation agent to create token-optimized context file.

  Source file: product-guidelines/02a-constraints.md
  Output file: product-guidelines/02a-constraints.ctx.md

  Follow the distillation agent specification in .claude/agents/distill-context.md to:
  1. Extract all constraints (technical, business, organizational, compliance) (CRITICAL)
  2. Extract key trade-offs and non-negotiables
  3. Remove constraint discovery process details and detailed examples
  4. Preserve section structure from source file
  5. Achieve 60-70% token reduction
  6. Add source reference header
  7. Write to output file path
  ```

## Output Format

IMPORTANT: Do not use emojis in generated outputs. Use plain text for all communication.
