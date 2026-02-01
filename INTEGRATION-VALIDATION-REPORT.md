# Third-Party Integration Constraint Validation Report

**Objective**: Validate third-party integration constraint detection and propagation across Stack-Driven cascade (Sessions 2a → 3 → 4 → 7 → 8 → 8b → 10 → 12)

**Date**: 2026-02-01
**Reference Guide**: `/reference-material/third-party-integration-patterns.md`

---

## Executive Summary

### Cascade Flow Assessment

**STRONG**: Integration constraint propagation is comprehensive and well-structured across most sessions.

**KEY FINDING**: The cascade successfully propagates integration requirements from Session 2a through all technical sessions, with **Session 7 (database schema)** providing the strongest integration-specific implementation guidance.

**GAPS IDENTIFIED**:
1. **Session 3 (Tech Stack)**: No explicit SDK/client library selection process
2. **Session 8 (API Design)**: Missing webhook-specific design guidance
3. **Session 10 (Backlog)**: Excellent per-integration story patterns, but lacks prioritization guidance

---

## Session-by-Session Findings

### Session 2a: Document Constraints ✅ EXCELLENT

**Coverage**: 9.5/10

**Strengths**:
- **Comprehensive integration discovery** (Questions 6-10 in Phase 2a)
  - External systems (payment, CRM, communication, analytics)
  - Platform integrations (Shopify, Slack, Salesforce AppExchange)
  - Webhook requirements
  - Bidirectional vs unidirectional sync
  - Integration timeline priority (MVP vs post-MVP)
- **Proper constraint framing**: Treats integrations as constraints, not requirements
- **Trade-off analysis**: Section 4 captures journey-optimal vs constraint-realistic trade-offs

**Gaps**:
- No specific question about **authentication requirements per integration** (OAuth scopes, API key permissions)
- No question about **rate limit expectations** from providers (could inform MVP phasing)

**Recommendations**:
```markdown
## Add to Phase 2a (Integration Requirements):

**Question 10a: "What authentication/authorization do these integrations require?"**
- OAuth 2.0 scopes needed? (read-only, write, admin)
- API key permission levels?
- User consent flow requirements? (GDPR, OAuth consent screen)

**Listen for**: Integration complexity, user consent flows, permission management

**Question 10b: "What are the provider's rate limits and usage tiers?"**
- Free tier limits? (Stripe: 100 req/sec, SendGrid: 100 emails/day free)
- Paid tier costs if MVP exceeds free limits?
- Rate limit impact on journey performance?

**Listen for**: Cost projections, MVP phasing constraints
```

---

### Session 3: Tech Stack ⚠️ NEEDS ENHANCEMENT

**Coverage**: 6/10

**Strengths**:
- References constraint file (`02a-constraints.ctx.md`) for integration requirements
- Auth provider selection decision tree includes "third-party integrations"
- i18n library selection pattern (strong example of constraint propagation)

**Critical Gaps**:

#### Gap 1: No SDK/Client Library Selection Process

**Current state**: Session 3 chooses database, framework, auth provider, but **does NOT guide SDK selection for third-party integrations**.

**Impact**: Developers must independently research which Stripe SDK (official vs stripe-node vs @stripe/stripe-js), which SendGrid client (official vs alternatives), which Salesforce library (jsforce vs salesforce-api), etc.

**Expected behavior** (based on i18n pattern at line 306-324):
```markdown
### Integration SDK Selection (if integrations exist from Session 2a)

Check `02a-constraints.ctx.md` if it exists:
- Look for third-party integrations identified (payment, CRM, communication, etc.)

If integrations exist, select appropriate SDK/client library per integration:

**Payment Processors**:
- **Stripe** → `stripe` (official Node.js SDK) or `stripe-python` (official Python SDK)
- **PayPal** → `@paypal/checkout-server-sdk` (official Node.js) or `paypalrestsdk` (Python)
- **Square** → `square` (official SDKs for Node.js, Python, Ruby, PHP, Java)

**Communication Services**:
- **SendGrid** → `@sendgrid/mail` (Node.js) or `sendgrid` (Python official SDK)
- **Twilio** → `twilio` (official SDKs for all major languages)
- **AWS SES** → AWS SDK (`@aws-sdk/client-ses` for Node.js, `boto3` for Python)

**CRM/ERP Systems**:
- **Salesforce** → `jsforce` (Node.js, most mature) or `simple-salesforce` (Python)
- **HubSpot** → `@hubspot/api-client` (official Node.js) or `hubspot-api-client` (Python)
- **Zoho CRM** → Official SDKs per language (check Zoho developer docs)

**Analytics**:
- **Segment** → `@segment/analytics-node` (server-side) or `analytics.js` (client-side)
- **Mixpanel** → `mixpanel` (Node.js) or `mixpanel` (Python)

**Auth Providers (beyond primary auth)**:
- **OAuth integrations** → `passport` strategies (Node.js) or `authlib` (Python)

**Decision Criteria**:
1. Official SDK preferred (better support, faster updates, OAuth compliance)
2. Community SDK if official doesn't exist (check GitHub stars, maintenance, issue velocity)
3. Direct REST API calls only if no SDK exists or SDK is unmaintained

Document in tech stack:
- **Integration SDKs**: [List per integration with version and rationale]
- **Installation**: Add to package.json/pyproject.toml during scaffold (Session 12)
```

**Placement**: Insert after "i18n Requirement Detection" section (line 305), before "Step 4: Make Recommendations" (line 326)

---

#### Gap 2: No Service-Specific Configuration Guidance

**Example missing pattern**: Session 3 doesn't guide configuration decisions like:
- Stripe: Should we use Payment Intents API (recommended 2024+) or legacy Charges API?
- SendGrid: Transactional templates vs dynamic content API?
- Salesforce: REST API vs SOAP API vs Bulk API selection based on volume?

**Recommendation**: Add integration pattern selection to Session 3, similar to state management decision tree (lines 218-240).

---

### Session 4: Generate Strategy ✅ GOOD (with optional enhancement)

**Coverage**: 7.5/10

**Strengths**:
- **Step 6a: Integration Architecture Patterns** (lines 259-305) is comprehensive
  - Integration Registry table (line 265)
  - Credential Management Strategy (line 272)
  - Resilience Patterns (retry, circuit breaker, fallback) (line 278)
  - Webhook Infrastructure (line 284)
  - Rate Limiting (Outbound) (line 292)
  - Monitoring & Alerting (line 300)
- **Conditional inclusion**: Step 6a only runs if `02a-constraints.ctx.md` identifies integrations
- **Journey traceability**: Integration registry maps to journey steps (line 267)

**Minor Gap**:
- **Vendor-specific gotchas** from reference guide (lines 890-906) are NOT referenced in Session 4
  - Example: Stripe webhook signature requires raw body (line 892)
  - Example: PayPal mock webhooks don't support postback verification (line 894)
  - Example: Salesforce Mixed DML errors (line 896)

**Recommendation**:
```markdown
## Add to Session 4, Step 6a (Integration Architecture Patterns):

### Vendor-Specific Implementation Notes

For each integration in the registry, document known gotchas from production systems:

**Stripe**:
- Webhook signature verification requires raw request body BEFORE JSON parsing
- Different webhook secrets for test mode vs live mode
- Events can arrive out of order (use idempotency keys)

**PayPal**:
- Must return HTTP 200 within 30 seconds (use async processing)
- Webhook body must be posted back exactly as received for verification
- Mock simulator events don't support postback verification (test with sandbox instead)

**Salesforce**:
- Governor limits reset per transaction (bulkify operations)
- Mixed DML errors prevent updating setup and non-setup objects together
- Bulk API doesn't support subqueries or aggregate functions
- CDC events limited to 750K/day by default (check usage if high-volume)

**HubSpot**:
- Batch contacts limited to 10 per call (other objects: 100 per call)
- Rate limits shared across all apps in account (coordinate with other integrations)
- Custom object webhooks require "Expand object support" opt-in

**Twilio**:
- 10DLC registration required for US A2P messaging (2-4 week approval)
- Error codes 30003-30007 indicate delivery issues requiring different handling

**AWS SES**:
- Requires sandbox exit approval (24-48 hours, production-ready use case description)
- Complex CloudWatch setup for delivery logs (consider managed alternatives like SendGrid/Postmark)

**Apple Sign In**:
- Only sends user's name on FIRST authentication (store immediately, never re-requested)
- Mandatory for iOS apps with any social login (App Store rejection if missing)

Reference: `/reference-material/third-party-integration-patterns.md` (lines 890-906)
```

**Placement**: Add as final subsection in Step 6a (after "Monitoring & Alerting", before Step 7)

---

### Session 7: Database Schema ✅ EXCELLENT

**Coverage**: 9.5/10

**Strengths**:
- **Step 2b: Check for Integration Requirements** (lines 230-405) is the most comprehensive integration guidance in the entire cascade
- **Four integration-specific tables** with complete SQL schemas:
  - `integration_credentials` (line 242): Encrypted API key/OAuth token storage
  - `webhook_events` (line 288): Idempotent webhook processing with retry tracking
  - `sync_jobs` (line 324): Background sync orchestration
  - `external_resource_mappings` (line 368): Bidirectional ID mapping
- **Encryption key management note** (line 280): Critical security guidance often overlooked
- **Conditional inclusion logic** (line 235): Only adds tables if Session 2a identifies integrations
- **Database paradigm adaptations** (line 401): Guidance for non-relational databases

**Minor Enhancement Opportunity**:
- **Webhook event retention policy**: No guidance on how long to keep webhook_events records
  - Production systems often retain 30-90 days for debugging, then archive/delete
  - Could add to `webhook_events` table schema comment

**Recommendation** (optional):
```sql
-- Add to webhook_events table schema (line 288):

-- Retention policy:
-- - Active events (pending, processing, failed): Keep indefinitely until resolved
-- - Processed events: Retain 90 days for debugging, then archive to cold storage
-- - Ignored events: Retain 30 days, then delete
-- - Set up automated cleanup job (see Session 10 backlog story: "Webhook event cleanup")
```

---

### Session 8: API Design ⚠️ NEEDS ENHANCEMENT

**Coverage**: 5/10

**Strengths**:
- **Step 1: Read Previous Outputs** includes `02a-constraints.ctx.md` (line 42)
- **Extract section** mentions "third-party integrations" (line 55)
- **Auth Decision Tree** (line 249) includes API key method (useful for partner APIs)

**Critical Gaps**:

#### Gap 1: No Webhook-Specific API Design Guidance

**Current state**: Session 8 makes high-level API paradigm decisions (REST, GraphQL, gRPC) but **does NOT address webhook endpoint design**, despite webhook requirements being captured in Session 2a.

**Impact**: Developers must independently decide:
- Should webhook endpoints be versioned? (`/webhooks/v1/stripe` vs `/webhooks/stripe`)
- Should webhooks share auth middleware or use signature verification only?
- Should webhooks be synchronous (200 OK after processing) or asynchronous (200 OK immediately, queue for processing)?

**Expected behavior** (based on reference guide lines 25-85):
```markdown
### Step 5a: Webhook Endpoint Design (if webhooks exist from Session 2a)

**Check for webhooks**: If `02a-constraints.ctx.md` identifies webhook integrations, include webhook-specific API design decisions.

**Decision Tree - Webhook Processing Pattern:**

```
1. Can webhook processing complete within 5 seconds?
   ├─ YES → Synchronous processing (process inline, return 200 OK after completion)
   │  - Use case: Simple state updates (user.status = 'active')
   │  - Risk: Provider timeout if processing takes >5s (Stripe times out at 30s)
   │
   └─ NO → Asynchronous processing (return 200 OK immediately, queue for background processing)
      - Use case: Multi-step workflows, external API calls, heavy computation
      - Pattern: Enqueue to Redis/SQS, background worker processes from queue
      - Reference: `/reference-material/third-party-integration-patterns.md` lines 55-58

2. How to ensure idempotency? (providers retry failed webhooks)
   - Unique event ID check: Store provider's event_id in database (UNIQUE constraint)
   - Processing lock: Use Redis lock pattern during processing
   - Reference: Lines 60-84 in third-party-integration-patterns.md

3. How to verify webhook authenticity?
   - HMAC signature verification: Compute HMAC-SHA256 using webhook secret
   - Constant-time comparison: Use hmac.compare_digest() to prevent timing attacks
   - Reference: Lines 29-58 in third-party-integration-patterns.md

4. Should webhooks be versioned?
   - YES if: Multiple API versions exist, breaking changes expected
   - NO if: Single API version, provider doesn't support versioned webhooks
   - Recommended pattern: `/webhooks/[provider-name]` (no version for MVP)
```

**Output Format:**

```markdown
## Webhook Design (if applicable)

### Webhook Endpoints:
- `/webhooks/stripe` - Stripe payment events
- `/webhooks/sendgrid` - Email delivery events
- `/webhooks/salesforce` - CRM data change notifications

### Processing Pattern: [Synchronous / Asynchronous]

**Reasoning**: [Trace to journey performance requirements, processing complexity]

### Security:
- **Verification Method**: HMAC-SHA256 signature verification
- **Secret Storage**: Environment variable per provider (STRIPE_WEBHOOK_SECRET, etc.)
- **Constant-time Comparison**: Yes (prevent timing attacks)

### Idempotency:
- **Deduplication Key**: Provider event_id
- **Storage**: webhook_events table (UNIQUE constraint on provider + event_id)
- **Retry Handling**: Return 200 OK for duplicate events (already processed)

### Scale-Forward Strategy:
- **MVP**: Single webhook endpoint per provider, async processing
- **Scale**: Dedicated webhook service if >1000 events/hour, auto-scaling workers
```

**Placement**: Insert after "Step 5: Performance Requirements" analysis, before "Step 6: Define Authentication Strategy" (around line 248)

---

#### Gap 2: No API Rate Limiting Design for Integration Calls

**Current state**: Session 8 discusses **inbound** rate limiting (protect your API from abuse) but **does NOT discuss outbound rate limiting** (respect third-party API limits).

**Expected behavior**: Should reference Session 4's "Rate Limiting (Outbound)" table (line 292) and translate to implementation decisions (client-side vs gateway-level).

---

### Session 8b: API Contracts ⚠️ NEEDS ENHANCEMENT

**Coverage**: 6/10

**Strengths**:
- **Step 0: Read API Design** explicitly references Session 8 for paradigm/serialization decisions (line 36)
- **Auth patterns** include JWT, OAuth, API keys (line 234)
- **Error format** includes field-level validation (line 287)

**Gaps**:

#### Gap 1: No Webhook-Specific OpenAPI Schema Patterns

**Current state**: Session 8b generates OpenAPI schemas for REST endpoints but **does NOT provide webhook request/response schema templates**.

**Impact**: Developers must independently model:
- Webhook request body schema (provider-specific event structure)
- Signature verification headers (X-Stripe-Signature, X-Hub-Signature-256, etc.)
- Response schema (empty 200 OK vs error details)

**Recommendation**:
```yaml
# Add to Session 8b schema templates:

# Webhook endpoint example (Stripe)
/webhooks/stripe:
  post:
    summary: Stripe webhook receiver
    description: Receives payment and subscription events from Stripe
    tags:
      - Webhooks
    security: []  # No bearer token, uses signature verification
    parameters:
      - name: Stripe-Signature
        in: header
        required: true
        schema:
          type: string
        description: HMAC-SHA256 signature for request verification
    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            properties:
              id:
                type: string
                description: Unique event ID (for idempotency)
              type:
                type: string
                enum:
                  - payment_intent.succeeded
                  - payment_intent.payment_failed
                  - customer.subscription.created
                  - customer.subscription.deleted
              data:
                type: object
                description: Event-specific payload
              created:
                type: integer
                description: Unix timestamp
    responses:
      '200':
        description: Webhook received and queued for processing
        content:
          application/json:
            schema:
              type: object
              properties:
                received:
                  type: boolean
                  example: true
      '401':
        description: Invalid signature
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Error'
```

**Placement**: Add to "Step 6: Define Error Handling" section as subsection (after standard error format, before schema generation)

---

#### Gap 2: No Guidance on External API Client Schemas

**Current state**: Session 8b defines schemas for **your API's endpoints** but not for **calling third-party APIs**.

**Example missing content**: If Session 2a identified Salesforce integration, Session 8b could generate:
- Salesforce request schemas (create Contact, upsert Lead)
- Salesforce response schemas (success, error formats)
- Type definitions for Salesforce objects

**Recommendation**: Lower priority (can be added in Session 12 scaffold), but would improve consistency.

---

### Session 10: Backlog ✅ EXCELLENT (with minor enhancement)

**Coverage**: 9/10

**Strengths**:
- **Integration Infrastructure story pattern** (lines 304-310) creates shared infrastructure once
  - Credential storage with encryption guidance (line 306)
  - Webhook infrastructure with async processing (line 307)
  - Monitoring and alerting (line 308)
  - Rate limiting client (line 309)
- **Per-Integration Story Patterns** (lines 312-400) are comprehensive and production-ready:
  - **Pattern 1: API-only integrations** (line 314) - SendGrid, Twilio, AWS SES
  - **Pattern 2: Webhook integrations** (line 350) - Stripe, Salesforce
  - **Pattern 3: Bidirectional sync** (line 386) - CRM/ERP systems
- **Acceptance criteria** include:
  - Error handling with exponential backoff (line 331)
  - Rate limiting client-side (line 332)
  - Integration health metrics (line 333)
  - Idempotency checks for webhooks (line 366)
  - Signature verification (line 365)
- **Dependencies** properly reference Foundation epic infrastructure (line 343, 380)

**Minor Gap**:
- **No guidance on integration story prioritization** relative to journey epics
  - Example: Should Stripe integration (Epic 01: Foundation) be implemented before Epic 02 (Get Access), or can they run in parallel?
  - Epic dependency graphs don't show integration blocking relationships

**Recommendation**:
```markdown
## Add to Session 10, Step 2.4 (Add Enabler Epics):

### Integration Epic Prioritization

**P0 Integrations (Epic 01: Foundation)**:
Integrations marked as "MVP required" in Session 2a MUST be in Foundation epic:
- Payment processing (blocks monetization, Step 5+ of journey)
- Authentication providers (blocks all journey steps)
- Critical communication (transactional email for signup verification)

**P1 Integrations (Parallel with Business Epics)**:
Integrations that enhance but don't block journey steps can run parallel:
- Analytics integrations (Segment, Mixpanel) - can be added during Epic 02-04
- Marketing automation (Mailchimp, ConvertKit) - can be added during Epic 03-05
- CRM sync (Salesforce, HubSpot) - can be added after core journey validated

**P2 Integrations (Post-MVP)**:
Integrations marked "Enterprise tier" in Session 2a should be separate epic:
- Advanced integrations (SSO providers, data warehouse connectors)
- White-label/partner APIs
- Compliance integrations (audit logging services, DLP tools)

**Epic Dependency Example**:
```
Epic 01: Foundation (includes Stripe for payment, SendGrid for email)
  ↓ (blocks)
Epic 02: Get Access (requires SendGrid for email verification)
  ↓ (blocks)
Epic 03: Submit Document (can run parallel with Analytics integration)
  ↓ (blocks)
Epic 04: Receive Assessment (requires Stripe for paid tier users)
```

**Placement**: Add as subsection under "Step 2.4: Add Enabler Epics", after "Epic: Third-Party Integrations" (around line 205)

---

### Session 12: Scaffold ✅ GOOD

**Coverage**: 7.5/10

**Strengths**:
- Reads `02a-constraints.ctx.md` if exists (line 52)
- Reads `02c-ai-integration-strategy.ctx.md` for AI SDK configuration (line 59)
- Generates docker-compose.yml for local development services (line 291)
- Package manager configuration includes dependencies from tech stack (line 223, 256)

**Gap**:
- **No explicit SDK installation guidance** in generated package.json/pyproject.toml
  - Session 12 reads Session 3 for tech stack, but Session 3 doesn't select integration SDKs (Gap 1 from Session 3 analysis)
  - Result: Integration SDKs must be manually added during implementation

**Recommendation**: Fix Session 3 gap first (add SDK selection), then Session 12 will automatically include them via Step 4A (lines 221-289).

---

## Cross-Session Integration Patterns: Quality Assessment

### Pattern 1: Payment Processing (Stripe, PayPal, Square)

**Reference Guide Coverage** (lines 189-298):
- Provider comparison table (line 192)
- PaymentIntent pattern (Stripe, line 197)
- PCI compliance scope reduction (line 235)
- Subscription lifecycle management (line 265)
- Webhook signature verification differences (line 298)

**Cascade Coverage**:
- ✅ **Session 2a**: Captures payment processor choice (Question 6)
- ✅ **Session 7**: `integration_credentials` table for tokens (line 242)
- ✅ **Session 7**: `webhook_events` table for idempotency (line 288)
- ⚠️ **Session 3**: Missing SDK selection (stripe vs @stripe/stripe-js)
- ⚠️ **Session 4**: Missing PCI scope reduction architecture note
- ⚠️ **Session 8b**: Missing webhook schema templates (Stripe signature header)
- ✅ **Session 10**: Excellent story patterns (lines 314-385)

**Quality Score**: 7/10 (strong database + backlog, weak API design)

---

### Pattern 2: Communication Services (SendGrid, Twilio, AWS SES)

**Reference Guide Coverage** (lines 301-408):
- Email service comparison (line 307)
- Bounce handling webhooks (line 331)
- SMS delivery callbacks (line 349)
- Push notification token management (line 401)

**Cascade Coverage**:
- ✅ **Session 2a**: Captures communication provider (Question 6)
- ✅ **Session 7**: `webhook_events` table for delivery tracking (line 288)
- ⚠️ **Session 3**: Missing SDK selection (@sendgrid/mail vs twilio)
- ⚠️ **Session 4**: No email authentication guidance (SPF, DKIM, DMARC from line 342)
- ⚠️ **Session 8**: No webhook design for bounce/delivery events
- ✅ **Session 10**: Good story pattern (line 314)

**Quality Score**: 6.5/10 (missing email infrastructure best practices)

---

### Pattern 3: Authentication Providers (OAuth 2.0, Social Login, MFA)

**Reference Guide Coverage** (lines 411-527):
- OAuth 2.0 with PKCE (line 413)
- Social login gotchas (Apple name capture, line 458)
- TOTP implementation (line 491)
- Backup code security (line 522)

**Cascade Coverage**:
- ✅ **Session 3**: Auth provider decision tree (line 266)
- ⚠️ **Session 4**: No OAuth scope management guidance
- ✅ **Session 7**: User table supports social login (via examples)
- ⚠️ **Session 8**: No OAuth 2.0 PKCE flow documentation
- ⚠️ **Session 8b**: No OAuth token exchange endpoint schemas
- ⚠️ **Session 10**: No social login account linking story pattern

**Quality Score**: 6/10 (auth provider selection strong, OAuth implementation guidance weak)

---

### Pattern 4: CRM/ERP Integration (Salesforce, HubSpot)

**Reference Guide Coverage** (lines 530-661):
- Salesforce API selection (REST/SOAP/Bulk, line 532)
- Governor limits table (line 536)
- Bulkified operations (line 546)
- HubSpot batch limits (line 579)
- Bi-directional sync conflict resolution (line 625)

**Cascade Coverage**:
- ✅ **Session 2a**: Captures CRM requirements, sync direction (Questions 6, 9)
- ⚠️ **Session 3**: Missing CRM SDK selection (jsforce vs simple-salesforce)
- ✅ **Session 4**: Rate limiting table mentions Salesforce (line 298)
- ✅ **Session 7**: Comprehensive sync tables (sync_jobs, external_resource_mappings, lines 324-399)
- ⚠️ **Session 8**: No bulk operation API design guidance
- ✅ **Session 10**: Excellent bidirectional sync story pattern (line 386)

**Quality Score**: 8/10 (strong database + backlog, weak API design for bulk operations)

---

### Pattern 5: Error Handling & Resilience

**Reference Guide Coverage** (lines 665-774):
- Circuit breaker implementation (line 668)
- Graceful degradation patterns (line 728)
- Monitoring SLOs for dependencies (line 766)

**Cascade Coverage**:
- ✅ **Session 4**: Resilience patterns (retry, circuit breaker, fallback, line 278)
- ✅ **Session 4**: Monitoring & alerting for integrations (line 300)
- ⚠️ **Session 8**: No API error handling for third-party failures
- ⚠️ **Session 8b**: No circuit breaker state tracking in API schemas
- ✅ **Session 10**: Error handling in story acceptance criteria (line 331)

**Quality Score**: 7.5/10 (architecture strong, API implementation guidance weak)

---

### Pattern 6: Testing Third-Party Integrations

**Reference Guide Coverage** (lines 777-887):
- Mock service patterns (nock, responses, line 781)
- Contract testing with Pact (line 824)
- Test data isolation (line 863)

**Cascade Coverage**:
- ⚠️ **Session 9**: Test strategy likely mentions integration testing (not read in this validation)
- ✅ **Session 10**: Integration tests in story acceptance criteria (line 335)
- ⚠️ **No session addresses**: Mock service setup, contract testing, sandbox environment strategy

**Quality Score**: 5/10 (basic testing mentioned, no advanced patterns)

---

## Prioritized Improvements

### High Priority (Implement in Next Release)

**1. Session 3: Add Integration SDK Selection** (Critical Gap)
- **Impact**: Currently, developers manually research SDKs for Stripe, SendGrid, Salesforce, etc.
- **Effort**: Medium (2-3 hours to write decision trees per integration category)
- **Placement**: After i18n detection (line 305), before Step 4
- **Pattern**: Mirror i18n library selection logic (lines 306-324)

**2. Session 8: Add Webhook Endpoint Design** (Critical Gap)
- **Impact**: Webhook implementations are ad-hoc, no systematic async processing guidance
- **Effort**: Medium (2-3 hours to write decision tree + templates)
- **Placement**: After performance requirements (Step 5), before auth strategy (Step 6)
- **Reference**: Lines 25-85 in third-party-integration-patterns.md

**3. Session 4: Add Vendor-Specific Gotchas** (Quality Enhancement)
- **Impact**: Prevents common production issues (Stripe signature verification, Salesforce governor limits)
- **Effort**: Low (1 hour to copy from reference guide lines 890-906)
- **Placement**: End of Step 6a (after Monitoring & Alerting)

---

### Medium Priority (Consider for Future Enhancement)

**4. Session 8b: Add Webhook Schema Templates**
- **Impact**: Standardizes webhook OpenAPI documentation
- **Effort**: Medium (2-3 hours per major provider)
- **Placement**: Step 6 (Error Handling), subsection on webhook schemas

**5. Session 10: Add Integration Epic Prioritization Guidance**
- **Impact**: Clarifies when integrations block journey epics vs run parallel
- **Effort**: Low (1 hour to write prioritization rules)
- **Placement**: Step 2.4 (Add Enabler Epics), after Epic: Third-Party Integrations

**6. Session 4: Add Email Infrastructure Best Practices**
- **Impact**: Improves deliverability for communication service integrations
- **Effort**: Low (1 hour to document SPF/DKIM/DMARC setup)
- **Placement**: Step 6a subsection on email integrations

---

### Low Priority (Nice to Have)

**7. Session 8: Add Outbound Rate Limiting Design**
- **Impact**: Prevents third-party API rate limit violations
- **Effort**: Medium (reference Session 4's rate limiting table)
- **Placement**: Step 4 or Step 5 as subsection

**8. Session 9: Add Integration Testing Patterns**
- **Impact**: Improves test coverage for third-party integrations
- **Effort**: High (requires new section on mock services, contract testing)
- **Placement**: New subsection in test strategy (not read in this validation)

**9. Session 3: Add Service-Specific Configuration Guidance**
- **Impact**: Guides Stripe Payment Intents vs Charges, SendGrid templates vs dynamic API
- **Effort**: High (research per integration, ongoing maintenance)
- **Placement**: After SDK selection

---

## Strengths of Current Implementation

### Excellent Patterns to Preserve

**1. Session 7: Integration-Specific Database Tables** (lines 230-405)
- Most comprehensive integration guidance in entire cascade
- Four tables cover 90% of integration use cases
- Encryption key management note prevents security issues
- Conditional inclusion logic (only if Session 2a identifies integrations)

**2. Session 10: Per-Integration Story Patterns** (lines 304-400)
- Production-ready acceptance criteria
- Proper dependency tracking (blocked by Foundation epic)
- Estimation guidance per pattern type
- Three distinct patterns (API-only, webhook, bidirectional sync)

**3. Session 2a: Comprehensive Integration Discovery** (Questions 6-10)
- Captures all integration dimensions (external systems, platform, webhooks, sync direction, timeline)
- Treats integrations as constraints (proper framing)

**4. Session 4: Integration Architecture Registry** (lines 259-305)
- Centralized registry table maps integrations to journey steps
- Resilience patterns (retry, circuit breaker, fallback)
- Monitoring baseline (>99.5% success rate target)

---

## Conclusion

**Overall Integration Propagation Quality**: **7.5/10** (Good, with room for improvement)

**Strengths**:
- Session 2a captures integration requirements comprehensively
- Session 7 provides excellent database schema patterns
- Session 10 generates production-ready backlog stories
- Session 4 establishes solid resilience architecture

**Critical Gaps**:
- Session 3 missing SDK selection (blocks scaffold generation)
- Session 8 missing webhook design guidance (leads to ad-hoc implementations)
- Session 8b missing webhook schema templates (inconsistent API documentation)

**Recommended Next Steps**:
1. Implement **High Priority** improvements (Session 3 SDK selection, Session 8 webhook design, Session 4 gotchas)
2. Validate improvements with real integration scenarios (Stripe + SendGrid + Salesforce)
3. Consider adding integration-specific templates to `/templates/` directory
4. Update CLAUDE.md with integration propagation flow diagram

**Comparison to Reference Guide**:
The cascade successfully implements **70-80%** of patterns from the reference guide. Main gaps are in API design/contracts (Sessions 8/8b) and advanced testing patterns (Session 9). Database and backlog sessions exceed reference guide quality.
