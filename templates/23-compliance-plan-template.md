# Compliance Plan: [Product Name]

> **IMPORTANT DISCLAIMER**: This compliance plan provides educational guidance based on industry best practices and regulatory frameworks. It is NOT legal advice and does NOT constitute certified compliance consulting. You MUST consult qualified legal counsel and compliance professionals before making any compliance decisions. Regulatory requirements vary by jurisdiction and change over time.
>
> **Last Updated**: [Date]
> **Regulatory Information Current As Of**: January 2025

> **Context**: Comprehensive compliance implementation roadmap derived from user journey, product strategy, and technical architecture. This plan translates regulatory requirements into actionable technical implementations with costs, timelines, and backlog integration.
>
> **Derived from**:
> - `product-guidelines/00-user-journey.md` (Where user data is collected/processed)
> - `product-guidelines/01-product-strategy.md` (Market geography, customer segments, TAM)
> - `product-guidelines/02a-constraints.md` (Basic compliance requirements identified)
> - `product-guidelines/07-database-schema.md` (Data handling, retention, storage)
> - `product-guidelines/08-api-design.md` (Data export, deletion, API security)
> - `product-guidelines/08b-api-contracts.md` (Technical API specifications)
> - `product-guidelines/10-backlog/` (Integration with product backlog)

---

## Executive Summary

**Product Compliance Landscape**: [Brief description of compliance requirements for this product]

**Applicable Regulations**:

| Regulation | Priority | Implementation Timeline | Estimated Year 1 Cost |
|------------|----------|------------------------|----------------------|
| [GDPR] | Required / Competitive / Aspirational | MVP / Growth / Scale | $[XX]k-$[XX]k |
| [HIPAA] | Required / Competitive / Aspirational | MVP / Growth / Scale | $[XX]k-$[XX]k |
| [SOC2 Type II] | Required / Competitive / Aspirational | MVP / Growth / Scale | $[XX]k-$[XX]k |
| [PCI-DSS] | Required / Competitive / Aspirational | MVP / Growth / Scale | $[XX]k-$[XX]k |

**Total Year 1 Compliance Investment**:
- **One-time costs**: $[XX]k-$[XX]k (legal review, initial audits, implementation)
- **Ongoing costs**: $[XX]k-$[XX]k (recertification, personnel, compliance platforms)
- **Total Year 1**: $[XX]k-$[XX]k
- **Total Year 2+**: $[XX]k-$[XX]k/year

**Key Compliance Milestones**:
- **Month [X]**: [Milestone 1 - e.g., "GDPR-compliant privacy policy live"]
- **Month [X]**: [Milestone 2 - e.g., "HIPAA security controls implemented"]
- **Month [X]**: [Milestone 3 - e.g., "SOC2 Type II audit begins"]
- **Month [X]**: [Milestone 4 - e.g., "SOC2 Type II certification received"]

**Risk Summary**:
1. **[Highest Risk]**: [Description - e.g., "Non-compliance with GDPR could block EU launch"]
2. **[Medium Risk]**: [Description - e.g., "Delayed SOC2 could lose $XXXk enterprise pipeline"]
3. **[Lower Risk]**: [Description - e.g., "CCPA applies to <10% of customer base"]

**Journey-Specific Compliance Drivers**:
- [Journey Step X] collects [PII/PHI/payment data] → triggers [Regulation]
- [Journey Step Y] processes [sensitive data] → requires [specific control]
- [Journey Step Z] stores [data type] for [duration] → mandates [retention policy]

---

## Applicable Regulations

### Overview

This section identifies which regulations apply to this product and why, based on:
1. **Market geography** (from product strategy)
2. **Data types handled** (from user journey)
3. **Customer segments** (from product strategy)
4. **Business model** (from monetization strategy)

---

### Regulation 1: [GDPR (General Data Protection Regulation)]

**Applicability**: [Required / Competitive / Aspirational]

**Why Applicable**:
- **Geography**: Product strategy shows [X]% of TAM in EU/EEA (triggers GDPR)
- **Data handling**: User journey collects personal data (names, emails, [other]) from EU residents
- **Processing activities**: [Describe processing - e.g., "Stores user profiles, tracks behavior, sends marketing emails"]

**Priority**: [Required for launch / Competitive advantage / Future consideration]

**Implementation Timeline**:
- **MVP (Month 0-3)**: Legal minimums to launch in EU
- **Growth (Month 4-12)**: Full compliance to scale EU operations
- **Scale (Year 2+)**: Advanced controls, DPO appointment

**Estimated Costs** (all figures in 2025 USD):
- **Legal review**: $3,000-$5,000 (Privacy Policy, Data Processing Agreement, Cookie Policy)
- **Implementation**: 2-4 weeks engineering time ($10,000-$20,000 equivalent)
- **Ongoing**: Data Protection Officer (DPO) $50,000-$80,000/year when processing >5,000 EU residents
- **Annual compliance audit**: $5,000-$10,000 (optional but recommended)
- **Total Year 1**: $18,000-$35,000

**Regulation Source**: Regulation (EU) 2016/679

---

### Regulation 2: [HIPAA (Health Insurance Portability and Accountability Act)]

**Applicability**: [Required / Competitive / Aspirational]

**Why Applicable**:
- **Data type**: User journey handles Protected Health Information (PHI): [list specific PHI collected]
- **Covered entities**: Product serves healthcare providers, health plans, or healthcare clearinghouses
- **Business Associate status**: Product processes PHI on behalf of covered entities

**Priority**: [Required for launch / Competitive advantage / Not applicable]

**Implementation Timeline**:
- **MVP (Month 0-6)**: HIPAA Security Rule technical safeguards implemented
- **Growth (Month 6-12)**: HIPAA Privacy Rule policies, BAAs with customers
- **Scale (Year 2+)**: Annual risk assessments, ongoing security updates

**Estimated Costs** (all figures in 2025 USD):
- **Legal review**: $5,000-$10,000 (Business Associate Agreement templates, policies)
- **Implementation**: 6-8 weeks engineering time ($30,000-$40,000 equivalent)
- **Compliance platform**: $1,000-$3,000/month (e.g., Vanta, Drata with HIPAA module)
- **Annual risk assessment**: $3,000-$5,000
- **Ongoing**: HIPAA Security Officer (can be part-time) $20,000-$40,000/year
- **Total Year 1**: $70,000-$120,000
- **Total Year 2+**: $40,000-$80,000/year

**Regulation Source**: 45 CFR Parts 160, 162, and 164

---

### Regulation 3: [SOC2 Type II (Service Organization Control 2)]

**Applicability**: [Required / Competitive / Aspirational]

**Why Applicable**:
- **Customer segment**: Product strategy targets enterprise B2B ($[X]K+ ACV)
- **Procurement requirement**: [X]% of enterprise deals require SOC2 for security due diligence
- **Competitive positioning**: Competitors have SOC2, lack of certification blocks [X]% of pipeline

**Priority**: [Required for enterprise sales / Competitive advantage / Future consideration]

**Implementation Timeline**:
- **Month 6-9 (Pre-audit)**: Implement controls, document policies, hire auditor
- **Month 9-12 (Observation)**: 3-6 month observation period (auditor monitors controls)
- **Month 12 (Certification)**: Receive SOC2 Type II report
- **Ongoing**: Annual recertification

**Estimated Costs** (all figures in 2025 USD):
- **Initial audit**: $15,000-$50,000 (depends on scope: TSC only or +availability/confidentiality)
- **Implementation**: 4-6 weeks engineering time ($20,000-$30,000 equivalent)
- **Compliance platform**: $500-$2,000/month (Vanta, Drata, Secureframe)
- **Annual recertification**: $10,000-$25,000
- **Ongoing**: Compliance manager (part-time to full-time) $50,000-$120,000/year
- **Total Year 1**: $50,000-$110,000
- **Total Year 2+**: $30,000-$70,000/year

**Sales Impact**: Unblocks $[XXX]k-$[X]M annual pipeline (enterprise deals requiring SOC2)

**Standard Source**: AICPA Trust Services Criteria

---

### Regulation 4: [PCI-DSS (Payment Card Industry Data Security Standard)]

**Applicability**: [Required / Competitive / Aspirational]

**Why Applicable**:
- **Payment processing**: User journey involves accepting credit/debit card payments
- **Merchant level**: Based on projected transaction volume: [Level 1-4]
- **Data handling**: [Direct card processing / Tokenized via Stripe/PayPal]

**Priority**: [Required if handling cards directly / Lower priority if using payment processor]

**WARNING: PCI-DSS 4.0 CRITICAL DEADLINE: March 31, 2025**

All future-dated requirements are now MANDATORY:
- MFA for ALL CDE access (not just admin)
- 12-character minimum passwords (up from 7)
- **Quarterly ASV scans now required for SAQ A merchants**
- Script management controls for payment pages (Req 6.4.3)
- Change/tamper detection for payment pages (Req 11.6.1)

**Budget Impact**: Add $500/quarter ($2,000/year) for quarterly ASV scans even for SAQ A.

**Implementation Timeline**:
- **MVP**: Use payment processor (Stripe, PayPal) to avoid direct card handling → Level 4 SAQ-A
- **Growth**: Maintain SAQ-A compliance (self-assessment questionnaire)
- **Scale**: Annual vulnerability scans, penetration testing

**Estimated Costs** (all figures in 2025 USD):
- **If using payment processor (Stripe/PayPal)**: Minimal costs
  - **SAQ-A self-assessment**: $0-$2,000 (can self-complete or use consultant)
  - **Quarterly ASV scans**: $2,000/year (NEW PCI-DSS 4.0 requirement)
  - **Implementation**: 1-2 weeks engineering time ($5,000-$10,000 equivalent)
  - **Annual compliance**: $0-$2,000 (re-submit SAQ annually)
  - **Total Year 1**: $7,000-$16,000

- **If handling cards directly**: Significantly higher costs
  - **Initial assessment**: $10,000-$30,000 (PCI compliance audit)
  - **Implementation**: 8-12 weeks engineering ($40,000-$60,000 equivalent)
  - **Quarterly vulnerability scans**: $2,000-$5,000/year
  - **Annual penetration testing**: $5,000-$15,000
  - **Annual compliance audit**: $15,000-$40,000
  - **Total Year 1**: $70,000-$150,000

**Recommendation**: Use payment processor (Stripe) to minimize PCI scope and costs

**Standard Source**: PCI Security Standards Council (PCI-DSS 4.0 effective March 31, 2025)

---

### Regulation 5: [CCPA (California Consumer Privacy Act)]

**Applicability**: [Required / Competitive / Aspirational]

**Why Applicable**:
- **Geography**: Product strategy targets California residents
- **Revenue threshold**: CCPA applies if annual revenue >$25M OR >50% from selling data OR process >100K CA residents
- **Current status**: [Below threshold / Approaching threshold / Above threshold]

**Priority**: [Required now / Required when revenue >$25M / Aspirational]

**Implementation Timeline**:
- **MVP (if required)**: Privacy policy with CCPA disclosures, "Do Not Sell" link
- **Growth**: Data mapping, consumer request process
- **Scale**: Automated request fulfillment

**Estimated Costs** (all figures in 2025 USD):
- **Legal review**: $2,000-$4,000 (Privacy Policy updates, CCPA disclosures)
- **Implementation**: 1-2 weeks engineering time ($5,000-$10,000 equivalent)
- **Consumer request process**: Manual initially, automated later (~$10,000 for automation)
- **Total Year 1**: $17,000-$24,000

**Regulation Source**: California Civil Code §1798.100 et seq.

---

### Regulation 6: [ISO 27001 (Information Security Management)]

**Applicability**: [Required / Competitive / Aspirational]

**Why Applicable**:
- **Customer requirement**: [X]% of enterprise/government customers require ISO 27001 certification
- **International markets**: European/APAC enterprise customers prefer ISO 27001 over SOC2
- **Competitive positioning**: Differentiator for security-conscious markets

**Priority**: [Required for global enterprise / Competitive advantage / Future consideration]

**Implementation Timeline**:
- **Year 1**: Implement Information Security Management System (ISMS)
- **Year 2**: Certification audit (Stage 1 + Stage 2)
- **Year 3+**: Surveillance audits (annual), recertification (every 3 years)

**Estimated Costs** (all figures in 2025 USD):
- **ISMS implementation**: 3-6 months, $50,000-$100,000 (consulting + engineering)
- **Certification audit**: $20,000-$40,000
- **Annual surveillance audits**: $10,000-$20,000
- **Recertification (every 3 years)**: $15,000-$30,000
- **Total Year 1**: $70,000-$140,000
- **Total Year 2+**: $10,000-$20,000/year

**Standard Source**: ISO/IEC 27001:2022

---

### Regulations We DIDN'T Choose (And Why)

**[FedRAMP (Federal Risk and Authorization Management Program)]**:
- **Why considered**: Government contractor requirements
- **Why excluded**: Product strategy targets commercial B2B, not government agencies (<5% TAM)
- **Future consideration**: Evaluate if government sales become >20% of TAM

**[COPPA (Children's Online Privacy Protection Act)]**:
- **Why considered**: Potential for users under 13
- **Why excluded**: User journey targets [adult professionals/businesses], explicitly excludes children <13 in Terms of Service
- **Future consideration**: Re-evaluate if product pivots to education or family use cases

**[GLBA (Gramm-Leach-Bliley Act)]**:
- **Why considered**: Financial services regulation
- **Why excluded**: Product does not collect/process consumer financial information for financial institutions
- **Future consideration**: If pivot to banking/insurance vertical

---

## Detailed Requirements by Regulation

### GDPR: Detailed Implementation Requirements

**Article 6: Lawful Basis for Processing**

**Requirement**: Must have lawful basis for processing personal data (consent, contract, legitimate interest, etc.)

**Technical Implementation**:
- **Session 7 (Database)**: Add `consent_records` table to track user consent
  - Fields: `user_id`, `consent_type`, `consent_given_at`, `consent_text`, `ip_address`, `user_agent`
- **Session 8 (API)**: POST `/api/users/consent` endpoint to record consent
- **Session 12 (Scaffold)**: Consent banner component on signup/login

**Backlog Story**: "Implement GDPR consent tracking and management"
- **RICE**: R=High, I=High, C=Medium, E=High → Score: [X]
- **Effort**: 3 days
- **Timeline**: MVP (required for EU launch)
- **Acceptance criteria**:
  - [ ] Users can grant/withdraw consent for processing, marketing, analytics
  - [ ] Consent records stored with timestamp, IP, user agent
  - [ ] Consent banner shown on first visit
  - [ ] Admin dashboard shows consent status per user

**Cost**: $[X]k (engineering time)

**Article Source**: GDPR Article 6

---

**Article 15: Right of Access (Data Portability)**

**Requirement**: Users can request copy of their personal data in structured, machine-readable format

**Technical Implementation**:
- **Session 7 (Database)**: Identify all tables containing user personal data
  - Tables: `users`, `profiles`, `activity_logs`, `preferences`, etc.
- **Session 8 (API)**: GET `/api/users/me/export` endpoint
  - Returns JSON with all user data
  - Includes data from all related tables
  - Optionally: CSV format for non-technical users
- **Session 12 (Scaffold)**: Export button in user settings

**Backlog Story**: "Implement GDPR data export API"
- **RICE**: R=High, I=High, C=Medium, E=Medium → Score: [X]
- **Effort**: 5 days
- **Timeline**: MVP (required for EU launch)
- **Acceptance criteria**:
  - [ ] Export endpoint returns all user personal data
  - [ ] JSON format includes nested relationships
  - [ ] Export completes in <30 seconds for typical user
  - [ ] Rate limited to prevent abuse (1 export per user per 24 hours)

**Cost**: $[X]k (engineering time)

**Article Source**: GDPR Article 15, Article 20

---

**Article 17: Right to Erasure ("Right to be Forgotten")**

**Requirement**: Users can request deletion of their personal data (with exceptions)

**Technical Implementation**:
- **Session 7 (Database)**: Implement soft delete pattern
  - Add `deleted_at` column to `users` table
  - Cascade soft deletes to related tables (`profiles`, `preferences`, etc.)
  - Hard delete after 30-day grace period (automated job)
- **Session 8 (API)**: DELETE `/api/users/me` endpoint
  - Soft deletes user and related data
  - Returns confirmation with 30-day restoration period
- **Session 12 (Scaffold)**: Delete account button in settings with confirmation modal

**Backlog Story**: "Implement GDPR right to erasure (soft delete)"
- **RICE**: R=High, I=High, C=High, E=Medium → Score: [X]
- **Effort**: 8 days
- **Timeline**: MVP (required for EU launch)
- **Acceptance criteria**:
  - [ ] Soft delete sets `deleted_at` timestamp, hides from queries
  - [ ] User can restore account within 30 days
  - [ ] Hard delete job runs nightly, permanently removes >30-day soft deletes
  - [ ] Exceptions: retain data for legal/accounting purposes (annotate as "deleted user")

**Cost**: $[X]k (engineering time)

**Article Source**: GDPR Article 17

---

**Article 32: Security of Processing**

**Requirement**: Implement appropriate technical and organizational measures to ensure data security

**Technical Implementation**:
- **Session 7 (Database)**: Encryption at rest for sensitive fields
  - Encrypt: PII fields (names, emails, addresses, etc.)
  - Use database-level encryption or application-level encryption
- **Session 8 (API)**: HTTPS only, TLS 1.3
- **Session 12 (Scaffold)**: Password hashing (bcrypt/Argon2), MFA support

**Backlog Story**: "Implement GDPR security controls (encryption, TLS, MFA)"
- **RICE**: R=High, I=High, C=High, E=Medium → Score: [X]
- **Effort**: 10 days
- **Timeline**: MVP (required for EU launch)
- **Acceptance criteria**:
  - [ ] All PII fields encrypted at rest
  - [ ] All API endpoints enforce HTTPS with TLS 1.3
  - [ ] Passwords hashed with bcrypt (cost factor 12+)
  - [ ] MFA available (TOTP via authenticator app)

**Cost**: $[X]k (engineering time)

**Article Source**: GDPR Article 32

---

**Article 33: Breach Notification**

**Requirement**: Report data breaches to supervisory authority within 72 hours

**Technical Implementation**:
- **Session 14 (Observability)**: Monitoring and alerting for security events
  - Monitor: Failed login attempts, unusual data access patterns, API abuse
  - Alert: Slack/email to security team for investigation
- **Session 12 (Scaffold)**: Incident response runbook (docs, not code)

**Backlog Story**: "Implement GDPR breach detection and alerting"
- **RICE**: R=High, I=Medium, C=Medium, E=High → Score: [X]
- **Effort**: 5 days
- **Timeline**: Post-MVP (Month 4-6)
- **Acceptance criteria**:
  - [ ] Alert triggers on >10 failed login attempts in 5 minutes
  - [ ] Alert triggers on bulk data export (>1000 records)
  - [ ] Incident response runbook documented
  - [ ] Legal counsel contact info documented for breach reporting

**Cost**: $[X]k (engineering time)

**Article Source**: GDPR Article 33

---

### HIPAA: Detailed Implementation Requirements

(Repeat structure for HIPAA, SOC2, PCI-DSS as needed based on applicable regulations)

**Administrative Safeguards (§164.308)**:
- Security Management Process
- Assigned Security Responsibility
- Workforce Security
- Information Access Management
- Security Awareness and Training
- Security Incident Procedures
- Contingency Plan
- Evaluation

**Physical Safeguards (§164.310)**:
- Facility Access Controls
- Workstation Use
- Workstation Security
- Device and Media Controls

**Technical Safeguards (§164.312)**:
- Access Control
- Audit Controls
- Integrity
- Person or Entity Authentication
- Transmission Security

[For each safeguard, detail:]
- **Requirement**: [What HIPAA mandates]
- **Technical Implementation**: [Database/API/Code changes needed]
- **Backlog Story**: [User story with RICE score]
- **Cost**: [Engineering time + tools]
- **Timeline**: [MVP/Growth/Scale]
- **Regulation Source**: [45 CFR §164.XXX]

---

### SOC2: Detailed Implementation Requirements

**Trust Services Criteria (TSC)**:

**CC1: Control Environment**
- Demonstrates commitment to integrity and ethical values
- Board oversight of risk and compliance
- Organizational structure and assignment of authority
- Competence of personnel
- Accountability mechanisms

**CC2: Communication and Information**
- Quality of information for control objectives
- Internal communication of objectives and responsibilities
- External communication of control deficiencies

**CC3: Risk Assessment**
- Specification of objectives
- Identification and analysis of risks
- Assessment of fraud risk
- Identification of significant changes

**CC4: Monitoring Activities**
- Evaluation of controls
- Deficiency communication and remediation

**CC5: Control Activities**
- Selection and development of controls
- Technology controls
- Deployment through policies and procedures

**CC6: Logical and Physical Access Controls**
- User provisioning/deprovisioning
- Authentication (MFA, password policies)
- Authorization (RBAC, least privilege)
- Physical security (data centers)

**CC7: System Operations**
- Capacity planning and monitoring
- Incident management
- Change management
- Backup and recovery

**CC8: Change Management**
- Controlled software development lifecycle
- Change approval process
- Testing before deployment

**CC9: Risk Mitigation**
- Identification of threats and vulnerabilities
- Security monitoring
- Incident response and business continuity

[For each criterion, detail:]
- **Requirement**: [What SOC2 auditor will validate]
- **Technical Implementation**: [Systems/processes needed]
- **Backlog Story**: [User story if technical work required]
- **Evidence Collection**: [What auditor needs to see]
- **Cost**: [Engineering time + compliance platform]
- **Timeline**: [Pre-audit/Observation/Certification]

---

## Compliance-to-Implementation Mapping

**Journey traceability**: This table maps each user journey step to compliance requirements and technical implementation.

| Journey Step | Data Collected | Compliance Requirement | Technical Implementation | Session Affected | Backlog Story | Timeline | Cost |
|--------------|----------------|------------------------|--------------------------|------------------|---------------|----------|------|
| **Step 1**: [User signup] | Email, name, password | GDPR Art. 6 (consent), HIPAA §164.308 (auth) | Consent tracking, password hashing, MFA | Session 7 (DB), 8 (API), 12 (UI) | AUTH-001: Implement signup with consent | MVP | $[X]k |
| **Step 2**: [Profile creation] | PII, preferences | GDPR Art. 32 (encryption), SOC2 CC6 (access control) | Encrypt PII fields, RBAC for profile access | Session 7 (DB), 8 (API) | DATA-001: Encrypt PII at rest | MVP | $[X]k |
| **Step 3**: [Upload document] | PHI, files | HIPAA §164.312 (encryption), GDPR Art. 32 | Encrypt files at rest (S3), audit logs | Session 7 (DB), 12 (storage) | FILE-001: Implement encrypted file storage | MVP | $[X]k |
| **Step 4**: [View analysis] | Usage data, analytics | GDPR Art. 6 (legitimate interest), SOC2 CC7 (monitoring) | Activity logging, consent for analytics | Session 7 (DB), 14 (observability) | LOG-001: Implement audit logging | Growth | $[X]k |
| **Step 5**: [Export report] | Generated report, PHI | GDPR Art. 15 (portability), HIPAA §164.312 (transmission) | Secure export API, encryption in transit | Session 8 (API) | API-001: Implement secure export | MVP | $[X]k |
| **Step 6**: [Delete account] | All user data | GDPR Art. 17 (erasure), HIPAA §164.530 (termination) | Soft delete, 30-day grace, hard delete | Session 7 (DB), 8 (API) | DATA-002: Implement right to erasure | MVP | $[X]k |

**Total Implementation Cost**: $[XX]k (sum of all backlog stories)

**Total Timeline**: [X] weeks (MVP), [X] weeks (Growth), [X] weeks (Scale)

---

## Compliance Backlog Stories

**Foundation Epic: Compliance & Legal** (epic number is dynamic based on journey)

### Story AUTH-001: Implement GDPR Consent Tracking and Management

**User Story**: As a user, I want to control my data processing consent so that I comply with GDPR requirements

**Journey Traceability**: Serves Step 1 (Signup) - ensures lawful basis for processing per GDPR Article 6

**Acceptance Criteria**:
- [ ] Users can grant/withdraw consent for processing, marketing, analytics
- [ ] Consent records stored with timestamp, IP address, user agent
- [ ] Consent banner shown on first visit (GDPR-compliant UI)
- [ ] Admin dashboard shows consent status per user
- [ ] Granular consent options (not all-or-nothing)

**Technical Specifications**:
- **Database** (Session 7):
  - Create `consent_records` table: `id`, `user_id`, `consent_type`, `consent_given_at`, `consent_text`, `ip_address`, `user_agent`, `withdrawn_at`
  - Types: `processing` (required), `marketing` (optional), `analytics` (optional)
- **API** (Session 8):
  - POST `/api/users/consent` - Record consent
  - PATCH `/api/users/consent/:type` - Update/withdraw consent
  - GET `/api/users/me/consents` - Retrieve consent history
- **UI** (Session 12):
  - Consent banner component (cookie consent pattern)
  - Settings page with consent toggles
  - Privacy Policy link

**RICE Prioritization**:
- **Reach**: High (100% of EU users = [X]% of total)
- **Impact**: High (required for EU launch, blocks revenue)
- **Confidence**: High (clear GDPR requirement)
- **Effort**: Medium (3 days)
- **RICE Score**: [X]

**Effort**: 3 days

**Dependencies**: Privacy Policy (legal team)

**Compliance Regulations**: GDPR Article 6, Article 7

**Cost**: $[X]k (engineering time)

---

### Story DATA-001: Implement GDPR Right to Erasure (Soft Delete)

**User Story**: As a user, I want to delete my account and data so that I exercise my GDPR "right to be forgotten"

**Journey Traceability**: Serves Step 6 (Account deletion) - enables users to remove their data per GDPR Article 17

**Acceptance Criteria**:
- [ ] Soft delete sets `deleted_at` timestamp on `users` table
- [ ] User can restore account within 30-day grace period
- [ ] Hard delete job runs nightly, permanently removes accounts soft-deleted >30 days ago
- [ ] Cascade soft delete to related tables: `profiles`, `preferences`, `activity_logs`, `files`
- [ ] Retain minimal data for legal/accounting (annotate as "deleted user #[ID]")
- [ ] Confirmation email sent on deletion (with restore link)

**Technical Specifications**:
- **Database** (Session 7):
  - Add `deleted_at` column to `users`, `profiles`, `files` tables
  - Create `deletion_jobs` table: `id`, `user_id`, `scheduled_for`, `status`, `completed_at`
  - Modify all queries to filter `WHERE deleted_at IS NULL` (use global scope)
- **API** (Session 8):
  - DELETE `/api/users/me` - Soft delete current user
  - POST `/api/users/me/restore` - Restore soft-deleted user (within 30 days)
  - Background job: `HardDeleteJob` runs nightly, deletes >30-day soft deletes
- **UI** (Session 12):
  - "Delete Account" button in settings with confirmation modal
  - "Are you sure?" warning with consequences explained
  - Restore account page (accessible via email link)

**RICE Prioritization**:
- **Reach**: Medium (estimated [X]% of users will delete accounts annually)
- **Impact**: High (required for GDPR compliance, legal risk if missing)
- **Confidence**: High (clear GDPR requirement)
- **Effort**: High (8 days - complex cascade logic)
- **RICE Score**: [X]

**Effort**: 8 days

**Dependencies**: Email service (SendGrid/Postmark)

**Compliance Regulations**: GDPR Article 17

**Cost**: $[X]k (engineering time)

---

### Story API-001: Implement GDPR Data Export API

**User Story**: As a user, I want to export my data in JSON/CSV format so that I comply with GDPR data portability requirements

**Journey Traceability**: Serves Step 5 (Export) - enables users to retrieve their data per GDPR Article 15/20

**Acceptance Criteria**:
- [ ] Export endpoint returns all user personal data in JSON format
- [ ] Includes data from all related tables: `users`, `profiles`, `activity_logs`, `files`, `preferences`
- [ ] Optionally: CSV format for non-technical users
- [ ] Export completes in <30 seconds for typical user
- [ ] Rate limited to prevent abuse: 1 export per user per 24 hours
- [ ] Email notification when export is ready (async job for large datasets)

**Technical Specifications**:
- **Database** (Session 7):
  - Query all tables containing user data
  - Join related tables (1-to-many, many-to-many)
- **API** (Session 8):
  - GET `/api/users/me/export?format=json` - Returns JSON export
  - GET `/api/users/me/export?format=csv` - Returns CSV export (zipped)
  - Background job: `ExportJob` for users with >10k records
- **UI** (Session 12):
  - "Export My Data" button in settings
  - Loading spinner during export
  - Download link (or email link if async)

**RICE Prioritization**:
- **Reach**: Low (estimated [X]% of users will export data)
- **Impact**: High (required for GDPR compliance, legal risk if missing)
- **Confidence**: High (clear GDPR requirement)
- **Effort**: Medium (5 days)
- **RICE Score**: [X]

**Effort**: 5 days

**Dependencies**: Background job queue (Sidekiq/Bull)

**Compliance Regulations**: GDPR Article 15, Article 20

**Cost**: $[X]k (engineering time)

---

### Story SEC-001: Implement SOC2 Access Controls and Audit Logging

**User Story**: As a system administrator, I want to enforce role-based access control and audit all data access so that we meet SOC2 requirements

**Journey Traceability**: Supports all steps (security applies across entire journey) - required for SOC2 CC6 (Logical Access)

**Acceptance Criteria**:
- [ ] Role-Based Access Control (RBAC): `admin`, `user`, `read-only`
- [ ] Least privilege: Users can only access their own data (admins can access all)
- [ ] Audit logging: Log all data access, modifications, deletions
- [ ] Audit log includes: `user_id`, `action`, `resource`, `timestamp`, `ip_address`, `result`
- [ ] Audit logs stored securely, immutable (append-only)
- [ ] Audit log retention: 1 year minimum (SOC2 requirement)

**Technical Specifications**:
- **Database** (Session 7):
  - Create `audit_logs` table: `id`, `user_id`, `action`, `resource_type`, `resource_id`, `changes`, `ip_address`, `created_at`
  - Create `roles` and `permissions` tables (RBAC)
  - Add `role` column to `users` table
- **API** (Session 8):
  - Middleware: `authorize(role)` checks user role before allowing action
  - Middleware: `auditLog()` logs all actions to `audit_logs`
  - GET `/api/admin/audit-logs` - Admin view of audit logs
- **UI** (Session 12):
  - Admin dashboard with audit log viewer
  - Filters: user, action, date range

**RICE Prioritization**:
- **Reach**: High (affects SOC2 certification, blocks enterprise sales)
- **Impact**: High (required for SOC2 Type II, $[XXX]k+ pipeline)
- **Confidence**: High (clear SOC2 requirement)
- **Effort**: High (10 days - RBAC + audit logging is complex)
- **RICE Score**: [X]

**Effort**: 10 days

**Dependencies**: None

**Compliance Regulations**: SOC2 CC6.1, CC6.2, CC6.6

**Cost**: $[X]k (engineering time)

---

### Story SEC-002: Implement HIPAA Encryption (At Rest and In Transit)

**User Story**: As a healthcare provider, I want all PHI encrypted at rest and in transit so that we meet HIPAA security requirements

**Journey Traceability**: Serves Step 3 (Upload document) and Step 5 (Export report) - protects PHI per HIPAA §164.312

**Acceptance Criteria**:
- [ ] All PHI fields encrypted at rest using AES-256
- [ ] Database-level encryption OR application-level encryption for sensitive fields
- [ ] All API endpoints enforce HTTPS with TLS 1.3
- [ ] File uploads encrypted in S3 (server-side encryption)
- [ ] Encryption keys managed securely (AWS KMS, HashiCorp Vault)
- [ ] Key rotation policy documented and implemented

**Technical Specifications**:
- **Database** (Session 7):
  - Enable database encryption at rest (PostgreSQL transparent data encryption)
  - OR: Application-level encryption for fields: `name`, `email`, `ssn`, `diagnosis`, etc.
- **API** (Session 8):
  - Enforce HTTPS: Redirect HTTP → HTTPS
  - TLS 1.3 only (disable TLS 1.0, 1.1, 1.2)
  - HSTS header: `Strict-Transport-Security: max-age=31536000`
- **File Storage** (Session 12):
  - S3 bucket: Enable server-side encryption (SSE-KMS)
  - Pre-signed URLs for file downloads (expire after 15 minutes)

**RICE Prioritization**:
- **Reach**: High (required for HIPAA compliance, blocks healthcare customers)
- **Impact**: High (HIPAA violation penalties: $100-$50K per violation)
- **Confidence**: High (clear HIPAA requirement)
- **Effort**: High (10 days - encryption + key management)
- **RICE Score**: [X]

**Effort**: 10 days

**Dependencies**: AWS KMS or HashiCorp Vault

**Compliance Regulations**: HIPAA §164.312(a)(2)(iv), §164.312(e)(2)(ii)

**Cost**: $[X]k (engineering time) + $[X]k (AWS KMS)

---

## Compliance Monitoring Strategy

(For Session 14 Observability Integration)

**Purpose**: Define metrics, alerts, and audit requirements to continuously monitor compliance status

---

### Compliance Automation Strategies

**Policy as Code (Open Policy Agent)**:
- Evaluate Terraform/CloudFormation against compliance policies in CI/CD
- Block non-compliant infrastructure before deployment (e.g., prevent unencrypted S3 buckets, non-TLS endpoints)
- Integration: AWS Config, Azure Policy, GCP Organization Policy
- Example: OPA Gatekeeper for Kubernetes admission control

**IaC Scanning in CI/CD Pipelines**:

| Tool | License | Built-in Policies | Best For |
|------|---------|-------------------|----------|
| Checkov | Apache 2.0 | 2,000+ | Comprehensive coverage |
| Trivy | Apache 2.0 | 1,500+ | Unified scanning (IaC + containers) |
| KICS | Apache 2.0 | 1,900+ | Broad platform support |
| Terrascan | Apache 2.0 | 500+ | Policy-as-code focus |
| Snyk IaC | Commercial | 400+ | Developer workflow integration |

**Integration Pattern**:
- Pre-commit hooks: Immediate feedback for developers
- CI (Pull Requests): Gate merges on high-severity findings
- CD (Deployment): Block deployment on critical violations

**Cloud Security Posture Management (CSPM)**:

| Platform | Approach | Key Strength | Pricing |
|----------|----------|--------------|---------|
| Wiz | Agentless | Security graph, attack path analysis | Enterprise |
| Prisma Cloud | Agent/Agentless | Full CNAPP coverage | Tiered |
| Orca Security | SideScanning | Deep agentless scanning | Per asset |
| Lacework | Agent-based | Behavioral threat detection | Usage-based |

**Automation ROI** (mid-market organization):
- Audit prep time: 3-6 months → 2-4 weeks (75% reduction)
- Evidence collection: 40-60 hours → 4-8 hours (85% reduction)
- Compliance staff hours: 65% reduction per framework
- Audit findings: 60% reduction

**Financial ROI**:
- Internal labor savings: $40,000-$80,000/year
- External audit fee reduction: $20,000-$50,000/year
- Regulatory fine avoidance: $50,000-$100,000/year
- Breach risk reduction: $80,000-$250,000/year
- **Total annual savings**: $190,000-$480,000
- **Platform cost**: $50,000-$150,000/year
- **Payback period**: 6-12 months

---

### GDPR Monitoring

**Metrics to Track**:
- **Consent opt-in rate**: % of users granting consent (target: >95% for processing, >40% for marketing)
- **Data export requests**: Count per month (expect <5% of users)
- **Data deletion requests**: Count per month (expect <2% of users)
- **Deletion fulfillment time**: Average time from request to completion (target: <24 hours for soft delete)

**Audit Trail Requirements**:
- **Consent logs**: Track every consent grant/withdrawal with timestamp, IP, user agent
- **Export logs**: Track every data export request with timestamp, format, status
- **Deletion logs**: Track every deletion request with timestamp, completion status, hard delete date

**Incident Response Triggers**:
- **Data breach**: Alert if >100 records accessed by single user in <1 hour
- **Failed exports**: Alert if >10 export requests fail in 24 hours
- **Deletion failures**: Alert if any deletion job fails

**Reporting Cadence**:
- **Monthly**: Review consent opt-in rates, export/deletion request volume
- **Quarterly**: Audit consent logs for compliance with GDPR Article 7
- **Annually**: Full GDPR audit (review all data processing activities)

---

### HIPAA Monitoring

**Metrics to Track**:
- **Failed login attempts**: Count per user (lock account after 5 failures)
- **PHI access logs**: Count per user per day (alert on unusual patterns)
- **Encryption status**: % of PHI fields encrypted (target: 100%)
- **Backup status**: Last successful backup timestamp (target: <24 hours ago)

**Audit Trail Requirements**:
- **Access logs**: Track every PHI access (read/write/delete) with user, timestamp, IP
- **Authentication logs**: Track all login attempts (success/failure) with MFA status
- **Configuration changes**: Track all security configuration changes (firewall, encryption, etc.)

**Incident Response Triggers**:
- **Brute force attack**: Alert if >10 failed logins for any user in 5 minutes
- **Bulk data access**: Alert if single user accesses >1000 PHI records in 1 hour
- **Encryption failure**: Alert if any PHI field fails to encrypt

**Reporting Cadence**:
- **Weekly**: Review failed login attempts, unusual access patterns
- **Monthly**: Review access logs for unauthorized PHI access
- **Annually**: HIPAA Security Risk Assessment (required by §164.308(a)(1))

---

### SOC2 Monitoring

**Metrics to Track**:
- **System uptime**: % uptime (target: 99.9% for availability criteria)
- **Incident response time**: Average time to acknowledge/resolve (target: <1 hour ack, <24 hours resolve)
- **Change success rate**: % of changes deployed without rollback (target: >95%)
- **Vulnerability remediation time**: Average days to fix critical vulnerabilities (target: <7 days)

**Audit Trail Requirements**:
- **User provisioning logs**: Track all user account creations/deletions with approver
- **Change logs**: Track all production deployments with approver, timestamp, rollback status
- **Incident logs**: Track all security incidents with description, impact, remediation

**Incident Response Triggers**:
- **Service outage**: Alert if uptime <99.5% in any 7-day period
- **Critical vulnerability**: Alert if critical CVE identified in dependencies
- **Unauthorized access**: Alert if any user accesses resources outside their role

**Reporting Cadence**:
- **Monthly**: Review incident logs, uptime, vulnerability remediation
- **Quarterly**: Board report on SOC2 compliance status
- **Annually**: SOC2 Type II audit (6-month observation period)

---

### PCI-DSS Monitoring

**Metrics to Track**:
- **Payment processor usage**: 100% of payments via Stripe (no direct card handling)
- **SAQ-A compliance**: Annual self-assessment completion (target: 100%)
- **Vulnerability scans**: Quarterly scans with no critical findings (target: 100%)

**Audit Trail Requirements**:
- **Payment logs**: Track all payment transactions with processor ID, amount, status (no card numbers)
- **Refund logs**: Track all refunds with reason, approver

**Incident Response Triggers**:
- **Payment failure spike**: Alert if >10% of payments fail in 1 hour
- **Suspected fraud**: Alert if >5 failed payments from single IP in 1 hour

**Reporting Cadence**:
- **Quarterly**: Vulnerability scan (if applicable)
- **Annually**: SAQ-A self-assessment submission

---

## Compliance Roadmap by Stage

**Purpose**: Define what compliance work happens at each product stage (MVP → Growth → Scale)

---

### MVP (Month 0-3): Legal Minimums to Launch

**Goal**: Implement only compliance features REQUIRED to legally launch and accept first customers

**GDPR (if applicable)**:
- [x] Privacy Policy with GDPR disclosures
- [x] Cookie consent banner
- [x] Basic consent tracking (processing consent only)
- [x] Data export API (JSON format)
- [x] Data deletion API (soft delete)
- [x] HTTPS with TLS 1.2+

**HIPAA (if applicable)**:
- [x] Business Associate Agreement (BAA) template
- [x] Encryption at rest (database-level)
- [x] Encryption in transit (HTTPS)
- [x] Password hashing (bcrypt)
- [x] Basic audit logging (authentication events)

**SOC2 (if applicable)**:
- [ ] Not required for MVP (defer to Growth stage)

**PCI-DSS (if applicable)**:
- [x] Use payment processor (Stripe) to avoid direct card handling
- [x] No storage of card numbers (tokenized only)

**Compliance Costs (MVP)**:
- **Legal review**: $5,000-$10,000 (Privacy Policy, Terms, BAA)
- **Engineering time**: 4-6 weeks ($20,000-$30,000 equivalent)
- **Total MVP**: $25,000-$40,000

**Timeline**: Month 0-3

**Success Criteria**:
- [ ] Can legally accept EU customers (GDPR basics)
- [ ] Can sign BAAs with healthcare customers (HIPAA basics)
- [ ] No critical compliance blockers for launch

---

### Growth (Month 4-12): Full Compliance to Scale SMB

**Goal**: Implement full compliance to confidently sell to SMB customers and scale operations

**GDPR**:
- [x] Enhanced consent (granular: marketing, analytics, third-party)
- [x] Data export in CSV format (user-friendly)
- [x] Data portability (export includes all related data)
- [x] Privacy by design (default settings are privacy-preserving)
- [x] DPO appointment (if >5,000 EU residents processed)

**HIPAA**:
- [x] Full audit logging (all PHI access, modifications, deletions)
- [x] MFA required for all users
- [x] Annual Security Risk Assessment
- [x] HIPAA training for all employees
- [x] Incident response plan documented

**SOC2 Type II**:
- [x] Implement SOC2 controls (CC1-CC9)
- [x] Compliance platform setup (Vanta, Drata)
- [x] Policies and procedures documented
- [x] Begin observation period (3-6 months)

**PCI-DSS**:
- [x] Annual SAQ-A self-assessment
- [x] Vulnerability scans (if applicable)

**Compliance Costs (Growth)**:
- **Legal**: $5,000-$10,000 (policy updates, DPO consultation)
- **Engineering time**: 6-8 weeks ($30,000-$40,000 equivalent)
- **Compliance platform**: $6,000-$24,000/year (Vanta/Drata)
- **SOC2 audit (start observation)**: $15,000-$30,000
- **Total Growth**: $56,000-$104,000

**Timeline**: Month 4-12

**Success Criteria**:
- [ ] GDPR fully compliant (can scale EU operations)
- [ ] HIPAA fully compliant (can sell to large healthcare providers)
- [ ] SOC2 observation period underway (certification in 6 months)

---

### Scale (Year 2+): Certifications to Sell Enterprise

**Goal**: Achieve certifications (SOC2, ISO 27001) to unblock enterprise sales and international markets

**GDPR**:
- [x] DPO appointed (full-time if >50,000 EU residents)
- [x] DPIA (Data Protection Impact Assessment) for high-risk processing
- [x] Regular GDPR audits (annual)
- [x] Cross-border data transfer mechanisms (Standard Contractual Clauses)

**HIPAA**:
- [x] HIPAA Security Officer (dedicated role)
- [x] Annual penetration testing
- [x] Annual HIPAA compliance audit (external auditor)

**SOC2 Type II**:
- [x] SOC2 Type II certification received (Month 12-15)
- [x] Annual recertification
- [x] Expanded scope (add Availability, Confidentiality criteria if needed)

**ISO 27001** (optional, for international enterprise):
- [x] ISMS implementation (6-12 months)
- [x] ISO 27001 certification audit
- [x] Annual surveillance audits

**PCI-DSS**:
- [x] Continue SAQ-A (if using payment processor)
- [x] OR: Full PCI audit (if handling cards directly - not recommended)

**Compliance Costs (Scale)**:
- **DPO**: $50,000-$80,000/year
- **HIPAA Security Officer**: $60,000-$100,000/year
- **SOC2 recertification**: $10,000-$25,000/year
- **ISO 27001 (optional)**: $70,000-$140,000 (Year 1), $10,000-$20,000/year (ongoing)
- **Compliance platform**: $12,000-$24,000/year
- **External audits**: $15,000-$40,000/year
- **Total Scale**: $150,000-$300,000/year

**Timeline**: Year 2+

**Success Criteria**:
- [ ] SOC2 Type II certified (unblocks enterprise sales)
- [ ] ISO 27001 certified (optional, for international enterprise)
- [ ] HIPAA audit passed (for healthcare enterprise)
- [ ] Compliance is "turn-key" (processes documented, automated)

---

## Compliance Cost Summary

**Year 1 Total**:
- **MVP (Month 0-3)**: $25,000-$40,000
- **Growth (Month 4-12)**: $56,000-$104,000
- **Total Year 1**: $81,000-$144,000

**Year 2+ Total**:
- **Annual recertification**: $30,000-$70,000
- **Ongoing personnel** (DPO, HIPAA Officer): $110,000-$180,000
- **Compliance platform**: $12,000-$24,000
- **External audits**: $15,000-$40,000
- **Total Year 2+**: $167,000-$314,000/year

**ROI Analysis**:
- **Enterprise sales unlocked**: $[XXX]k-$[X]M annual pipeline (SOC2 certification)
- **EU market unlocked**: [X]% of TAM ($[XX]M) requires GDPR compliance
- **Healthcare market unlocked**: [X]% of TAM ($[XX]M) requires HIPAA compliance
- **Compliance cost as % of revenue**: Year 1: [X]%, Year 2: [X]%, Year 3: [X]%

**Recommendation**: [Based on product strategy, is compliance investment justified? Which certifications are highest priority?]

---

## What We DIDN'T Choose (And Why)

**Alternative Approach: Delay All Compliance Until Post-Launch**

**Why considered**:
- Reduce time-to-market (ship faster)
- Lower upfront costs (defer $81k Year 1 investment)
- Validate product-market fit before investing in compliance

**Why rejected**:
- **Legal risk**: Launching without GDPR/HIPAA compliance exposes to fines ($XXk-$XXM)
- **Market access**: Cannot sell to [X]% of TAM (EU, healthcare, enterprise) without compliance
- **Reputational risk**: Data breach or non-compliance damages brand irreparably
- **Retrofit cost**: Implementing compliance post-launch is 3-5x more expensive (technical debt, data migration)
- **Competitive disadvantage**: Competitors with SOC2/HIPAA certifications will win enterprise deals

**When this might be right**:
- B2C product with no PII/PHI (extremely rare)
- US-only market with no enterprise customers (limits TAM)
- Prototype/MVP for internal use only (not production)

---

**Alternative Approach: Build In-House Compliance Platform**

**Why considered**:
- Avoid $12k-$24k/year compliance platform subscription (Vanta, Drata)
- Full control over compliance workflows
- Custom integrations with internal tools

**Why rejected**:
- **Build cost**: 3-6 months engineering time ($150k-$300k equivalent) to build internal compliance platform
- **Maintenance burden**: Ongoing updates for regulation changes, SOC2 criteria updates
- **Audit risk**: Auditors trust established platforms (Vanta, Drata), custom solutions may require more evidence
- **Opportunity cost**: Engineering time better spent on product features
- **Total cost**: Building in-house costs MORE over 3 years vs. using Vanta/Drata

**When this might be right**:
- Company >500 employees with dedicated compliance engineering team
- Highly specialized compliance needs not served by existing platforms
- Enterprise with existing security/compliance infrastructure

---

**Alternative Approach: Outsource Compliance to Consultant**

**Why considered**:
- Expert guidance for complex regulations (HIPAA, SOC2)
- Faster implementation with experienced consultant
- Reduce internal workload

**Why rejected**:
- **Cost**: Compliance consultants charge $150-$300/hour ($50k-$150k for full engagement)
- **Knowledge transfer**: Internal team doesn't learn compliance, becomes dependent on consultant
- **Ongoing dependency**: Regulations change, need consultant for every update
- **Hybrid approach better**: Use consultant for initial guidance ($10k-$20k), build internal capability

**When this might be right**:
- First-time founders with no compliance experience (use for initial setup)
- Complex multi-jurisdictional compliance (GDPR + HIPAA + FedRAMP)
- Time-constrained (need SOC2 in 6 months for enterprise deal)

**Our recommendation**: Hybrid approach - consultant for initial guidance, compliance platform (Vanta) for ongoing management, internal team for implementation

---

## Validation Checklist

Before finalizing this compliance plan, verify:

**Journey Alignment**:
- [x] Every regulation traces to specific journey step (where data is collected/processed)
- [x] Compliance requirements are NOT generic (specific to THIS product's journey)
- [x] "Compliance-to-Implementation Mapping" table shows clear journey → requirement → implementation flow

**Specificity**:
- [x] Costs are specific ranges with year noted (not vague "legal costs needed")
- [x] Timelines are realistic (SOC2 audit: 6-12 months, not "1 month")
- [x] Regulation sources cited (GDPR Article 17, HIPAA §164.312)
- [x] Backlog stories include RICE scores and acceptance criteria

**Completeness**:
- [x] All applicable regulations identified (based on journey geography, data types, customer segments)
- [x] Each regulation includes detailed requirements (not just "be compliant")
- [x] Each requirement maps to technical implementation (database, API, UI changes)
- [x] Compliance roadmap shows MVP → Growth → Scale stages clearly
- [x] "What We DIDN'T Choose" includes 2+ alternative approaches

**Technical Soundness**:
- [x] Database changes specified (tables, columns, encryption)
- [x] API endpoints specified (routes, methods, rate limits)
- [x] Security controls specified (encryption, MFA, RBAC, audit logging)
- [x] Monitoring and alerting specified (metrics, triggers, cadence)

**Cost Accuracy**:
- [x] Legal costs: $3k-$10k per regulation (ranges based on 2025 market rates)
- [x] Engineering costs: Estimated as weeks × $50k-$60k average developer salary / 50 weeks
- [x] Compliance platform: $500-$2k/month (Vanta, Drata pricing as of 2025)
- [x] Audit costs: $15k-$50k SOC2, $20k-$40k ISO 27001 (2025 market rates)
- [x] Personnel costs: $50k-$120k DPO, HIPAA Officer (2025 US market rates)

**Timeline Realism**:
- [x] SOC2 Type II: 6-12 month observation period (not 1 month)
- [x] ISO 27001: 6-12 month ISMS implementation + 3-6 month certification (not 3 months total)
- [x] HIPAA: 6-8 weeks technical implementation + ongoing policy work
- [x] GDPR: 2-4 weeks technical implementation for MVP features

---

## Next Steps

1. **Validate Assumptions**: Review this compliance plan with legal counsel (budget $3k-$5k for legal review)
2. **Prioritize Regulations**: Confirm which regulations are Required vs. Competitive vs. Aspirational
3. **Add to Backlog**: Import compliance stories to Session 10 backlog (Foundation epic: Compliance & Legal)
4. **Integrate with Session 14**: Use monitoring strategy to add compliance metrics to observability plan
5. **Schedule Legal Review**: Engage legal counsel for Privacy Policy, Terms of Service, BAA templates
6. **Procurement**: Evaluate compliance platforms (Vanta, Drata, Secureframe) for SOC2/HIPAA needs
7. **Timeline Alignment**: Ensure compliance milestones align with product launch timeline (Session 13 deployment plan)
8. **Run `/cascade-status`** to see your complete framework progress

---

**Compliance Plan Version**: 1.0
**Created**: [Date]
**Last Updated**: [Date]
**Next Review**: [Date + 90 days]
**Legal Disclaimer**: This plan is educational guidance only, not legal advice. Consult qualified legal counsel for compliance decisions.
