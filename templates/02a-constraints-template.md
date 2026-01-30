# Constraints Documentation

## Overview
This document captures all limitations and restrictions that constrain technical and operational decisions for [Product Name]. Constraints differ from requirements—they define boundaries within which solutions must operate, often non-negotiable.

## How Constraints Relate to Journey
- **Journey defines**: Optimal user experience and value delivery
- **Constraints define**: Real-world limitations we must work within
- **Tech stack becomes**: Best solution for journey given constraint boundaries

---

## 1. Technical Constraints
Fixed technical decisions that absolutely cannot be changed.

### 1.1 Platform & Runtime Constraints
- [ ] Operating system requirements (Windows, Linux, macOS, iOS, Android)
- [ ] Browser support requirements (Chrome 90+, Safari 14+, etc.)
- [ ] Mobile platform requirements (native vs. web)
- [ ] Runtime environment constraints (Node.js version, Python version)

**Example**:
- **Constraint**: Must support Safari 14+ (30% of target users on older iPhones)
- **Impact on tech**: Cannot use bleeding-edge CSS features, must polyfill
- **Journey step affected**: Step 1-5 (all frontend interactions)

### 1.2 Technology Mandates
- [ ] Required programming languages
- [ ] Required frameworks or libraries
- [ ] Prohibited technologies (licensing, security, policy)
- [ ] Required cloud provider (AWS, GCP, Azure)

**Example**:
- **Constraint**: Must use AWS (existing corporate account, credits available)
- **Impact on tech**: AWS-specific services (RDS, S3, Lambda) over alternatives
- **Cost impact**: $0/month for 12 months (free tier)

### 1.3 Integration Requirements
- [ ] Must integrate with existing systems (name each: Salesforce, SAP, etc.)
- [ ] Required authentication provider (corporate SSO, Auth0, etc.)
- [ ] Required payment processor (Stripe, PayPal, corporate account)
- [ ] API compatibility requirements (REST, GraphQL, SOAP)

**Example**:
- **Constraint**: Must integrate with Salesforce for lead capture (B2B sales process)
- **Impact on tech**: Need Salesforce SDK, OAuth flow, webhook handling
- **Journey step affected**: Step 5 (export/share results) → auto-create Salesforce opportunity

### 1.4 Performance & Scale Constraints
- [ ] Response time requirements (<1s, <100ms, etc.)
- [ ] Concurrent user targets (10, 100, 1K, 10K, 100K+)
- [ ] Data volume constraints (1GB, 100GB, 1TB+)
- [ ] Uptime requirements (99%, 99.9%, 99.99%)

**Example**:
- **Constraint**: MVP targets <500 users in first 6 months (from product strategy)
- **Impact on tech**: Can use simpler architecture (monolith vs. microservices)
- **Prevents over-engineering**: Don't need Kubernetes, don't need multi-region

### 1.5 Security & Compliance Constraints
- [ ] Data residency requirements (US-only, EU-only, specific regions)
- [ ] Encryption requirements (at-rest, in-transit, end-to-end)
- [ ] Authentication standards (OAuth 2.0, SAML, multi-factor)
- [ ] Regulatory compliance (HIPAA, GDPR, PCI-DSS, SOC2)

**Example**:
- **Constraint**: GDPR compliance required (15% of target users in EU per strategy)
- **Impact on tech**: Cookie consent, data export, right-to-delete, audit logging
- **Journey step affected**: Step 1 (signup), ongoing (data handling)

---

## 2. Organizational Constraints
Internal resourcing, tooling standards, process requirements.

### 2.1 Team Constraints
- [ ] Team size (solo founder, 2 devs, 10-person team)
- [ ] Team expertise (languages known, frameworks comfortable with)
- [ ] Team availability (full-time, part-time, nights/weekends)
- [ ] Team location (time zones, distributed vs. co-located)

**Example**:
- **Constraint**: Solo founder, 15 hours/week, full-time job until revenue
- **Impact on tech**: Must choose stack founder knows well (no time to learn new framework)
- **Impact on timeline**: 12-week journey-optimal timeline → realistic 6-9 months
- **Prevents**: Choosing trendy but unfamiliar tech (Rust, Elixir) over familiar (Python/JS)

### 2.2 Budget & Resource Constraints
- [ ] Infrastructure budget (monthly cloud costs limit)
- [ ] Third-party service budget (AI APIs, auth, monitoring)
- [ ] Licensing budget (paid tools, fonts, assets)
- [ ] Total development budget (if fixed scope)

**Example**:
- **Constraint**: $50/month infrastructure budget for first 12 months (bootstrapped)
- **Impact on tech**: Maximize free tiers (Vercel, Supabase, Railway vs. dedicated servers)
- **Impact on journey**: Step 3 (AI assessment) → use cheaper GPT-3.5 Turbo vs. Claude Opus
- **Value ratio recalculation**: Must maintain 10:1 value ratio despite cheaper AI

### 2.3 Timeline Constraints
- [ ] Hard launch deadline (regulatory deadline, event, funding milestone)
- [ ] Phased rollout requirements (MVP → Beta → GA)
- [ ] Maintenance windows (can only deploy Saturday nights)

**Example**:
- **Constraint**: Must launch MVP by March 15, 2026 (regulatory deadline for compliance tool)
- **Impact on scope**: Journey has 5 steps, MVP can only implement Steps 1-3 (aha moment)
- **Impact on tech**: Choose rapid development stack (Next.js, Supabase) over custom
- **Deferred**: Steps 4-5 (review results, export) → post-MVP roadmap

### 2.4 Development Process Constraints
- [ ] Required version control (GitHub, GitLab, Bitbucket)
- [ ] Required CI/CD pipeline (GitHub Actions, Jenkins, custom)
- [ ] Required code review process (2 approvers, security review)
- [ ] Required testing coverage (80% unit test, E2E required)

**Example**:
- **Constraint**: Corporate policy requires GitHub, GitHub Actions, branch protection
- **Impact on tech**: Use GitHub-native tooling (Actions vs. CircleCI)
- **Impact on workflow**: Cannot merge without passing tests + Dependabot checks

### 2.5 Tooling Standards
- [ ] Required project management tool (Jira, Linear, GitHub Projects)
- [ ] Required communication tool (Slack, Teams, Discord)
- [ ] Required monitoring/observability platform (Datadog, New Relic, Sentry)
- [ ] Required documentation platform (Notion, Confluence, GitHub Wiki)

**Example**:
- **Constraint**: Existing Datadog license (already paying, must use)
- **Impact on tech**: Use Datadog APM, RUM, logs vs. self-hosted alternatives
- **Benefit**: $0 incremental cost, already familiar to team

---

## 3. Conventions & Compliance
Standards, legal requirements, and best practices.

### 3.1 Regulatory & Legal Compliance
- [ ] Healthcare: HIPAA, HITECH
- [ ] Finance: PCI-DSS, SOX
- [ ] Privacy: GDPR, CCPA, PIPEDA
- [ ] Security: SOC2 Type II, ISO 27001
- [ ] Industry-specific regulations

**Example**:
- **Constraint**: SOC2 Type II required for enterprise customers (from strategy)
- **Impact on tech**: Audit logging, access controls, encryption, vendor management
- **Timeline impact**: 6-12 month audit process → plan for Year 2
- **Cost impact**: $50K+ audit costs → factor into unit economics

### 3.2 Accessibility & Usability Standards
- [ ] WCAG 2.1 Level A, AA, or AAA
- [ ] Section 508 compliance (US government)
- [ ] Mobile accessibility standards
- [ ] Internationalization requirements (i18n, l10n)

**Example (Accessibility)**:
- **Constraint**: WCAG 2.1 AA required (government agency customers = 40% TAM)
- **Impact on tech**: Accessible component library, screen reader testing, keyboard navigation
- **Journey step affected**: All steps (frontend interactions must be accessible)
- **Design impact**: Color contrast ratios, focus indicators, ARIA labels

**Example (Internationalization)**:
- **Constraint**: Multi-language support required for EU market (German, French, Spanish)
- **Impact on tech**: i18n library (next-intl, react-i18next), translation management, locale detection
- **Journey step affected**: All steps (UI, error messages, email notifications must be localized)
- **Database impact**: Translation tables for user-facing content (product names, descriptions)
- **API impact**: Accept-Language header support, localized error responses
- **Content impact**: Translation workflow, professional translation services vs. machine translation

### 3.3 API & Integration Standards
- [ ] RESTful API design principles
- [ ] OpenAPI 3.0 specification required
- [ ] GraphQL schema standards
- [ ] Webhook reliability standards

**Example**:
- **Constraint**: Corporate standard requires OpenAPI 3.0 documentation for all APIs
- **Impact on tech**: Use FastAPI (auto-generates OpenAPI) vs. Flask (manual docs)
- **Benefit**: Auto-generated client SDKs, interactive API docs

### 3.4 Code Quality & Documentation Standards
- [ ] Programming style guides (PEP 8, Airbnb JS, Google)
- [ ] Documentation requirements (JSDoc, Sphinx, inline comments)
- [ ] Code review standards (approval requirements, linting)
- [ ] Testing standards (unit, integration, E2E coverage targets)

**Example**:
- **Constraint**: Team already uses ESLint with Airbnb config for other projects
- **Impact on tech**: Maintain consistency, reduce context-switching
- **Journey impact**: None (internal code quality, not user-facing)

---

## 4. Constraint-Journey Trade-offs

### Journey-Optimal vs. Constraint-Realistic

For each major constraint, document how it affects the journey-optimal solution:

| Journey Requirement | Journey-Optimal Choice | Constraint | Constraint-Realistic Choice | Trade-off Impact |
|---------------------|------------------------|------------|----------------------------|------------------|
| Step 3: AI assessment <60s | Claude Opus (best reasoning) | Budget: $50/month | GPT-3.5 Turbo | 10-15s slower, 5% less accurate, still 10x better than manual |
| Step 1: Mobile-first | React Native | Team: No mobile devs | Next.js PWA | Web-first with mobile-optimized design, defer native app to Year 2 |
| Real-time collaboration | WebSocket-based | Timeline: 3 months to MVP | Polling every 5s | Acceptable for MVP, real-time in v2 |

### What We're NOT Compromising

List journey elements that are NON-NEGOTIABLE even with constraints:

- **Step 3 aha moment**: AI assessment must complete in <2 minutes (or journey fails)
- **Value ratio**: Must maintain 10:1 value ratio (adjust pricing if using cheaper AI)
- **Core flow**: Steps 1-3 must work perfectly (can defer Steps 4-5 if needed)

---

## 5. Constraint Impact on Cascade Sessions

### Impact on Session 3 (Tech Stack)
- [ ] List constraints that directly influence tech stack choices
- [ ] Identify where constraints override journey-optimal decisions

**Example**:
- Constraint: Team only knows Python → Backend must be Python (FastAPI or Flask)
- Constraint: $50/month budget → Use free tiers (Vercel, Supabase, Railway)
- Constraint: Must integrate with Salesforce → Need Salesforce SDK

### Impact on Session 7 (Database Schema)
- [ ] Data residency constraints
- [ ] Compliance constraints affecting data model (audit logs, soft deletes)
- [ ] Integration constraints requiring specific schemas

### Impact on Session 10 (Backlog)
- [ ] Timeline constraints affecting MVP scope
- [ ] Team size constraints affecting story complexity
- [ ] Budget constraints affecting third-party integrations

### Impact on Session 13 (Deployment)
- [ ] Platform constraints (must deploy to AWS)
- [ ] Compliance constraints (SOC2 requirements)
- [ ] Process constraints (deployment windows)

---

## 6. Constraint Validation & Evolution

### Validation Questions
For each constraint, ask:
- [ ] Is this constraint truly non-negotiable? (Or is it an assumption?)
- [ ] What's the cost of violating this constraint? (Regulatory fine? Team friction?)
- [ ] Can this constraint be removed with reasonable effort/cost?

**Example**:
- **Constraint stated**: "Must use PostgreSQL (corporate standard)"
- **Validation**: Is this enforced? Or just preferred?
- **Finding**: Preference, not policy → Can choose journey-optimal database
- **Action**: Remove from constraints, add to tech stack decision factors

### Constraint Evolution
Constraints change over time:
- **Timeline constraints**: Expire after launch
- **Team constraints**: Change with hiring
- **Budget constraints**: Change with revenue/funding

**Document**:
- When constraint becomes irrelevant (e.g., "after MVP launch")
- What changes when constraint is removed (e.g., "migrate to Claude Opus for better accuracy")

---

## Validation Checklist

Before considering this document complete:
- [ ] Every constraint includes concrete impact on tech/journey
- [ ] Every constraint is truly non-negotiable (not just preference)
- [ ] Constraint-journey trade-offs are explicit and quantified
- [ ] Non-negotiable journey elements are identified
- [ ] Constraints are categorized correctly (technical/org/compliance)
- [ ] Each constraint references specific journey step affected (if applicable)

---

## Connection to Cascade

**This constraints document informs**:
- Session 3 (tech-stack): Choose stack within constraint boundaries
- Session 4 (architecture): Design within constraints
- Session 7 (database-schema): Schema design respecting constraints
- Session 10 (backlog): Scope decisions based on timeline/team/budget constraints
- Session 13 (deployment): Infrastructure choices respecting platform/compliance constraints

**This constraints document reads**:
- Session 1 (journey): To understand journey-optimal requirements
- Session 2 (product-strategy): To understand scale, market, timeline expectations