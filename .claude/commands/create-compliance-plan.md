---
description: POST-CASCADE - Create comprehensive compliance plan with regulatory implementation guidance
---

# POST-CASCADE: Create Compliance Plan

This is a **post-core extension** that creates a comprehensive compliance implementation roadmap for compliance-heavy products. Run this AFTER Session 2a (constraints) to translate regulatory requirements into actionable technical implementations with costs, timelines, and backlog integration.

## When to Run This

**Run AFTER Session 2a (constraints)** when you have:
- [✓] User journey defined (`product-guidelines/00-user-journey.md`)
- [✓] Product strategy validated (`product-guidelines/01-product-strategy.md`)
- [✓] Constraints documented (`product-guidelines/02a-constraints.md`)

**Ideally after technical design** when you also have:
- [✓] Database schema designed (`product-guidelines/07-database-schema.md`)
- [✓] API contracts defined (`product-guidelines/08-api-design.md`, `08b-api-contracts.md`)
- [✓] Backlog generated (`product-guidelines/10-backlog/`)
- So compliance implementation can be mapped to specific technical components

**Skip this** if:
- Your product has minimal compliance needs (constraints template is sufficient)
- You have a compliance team that handles regulatory planning
- You're building internal tools with no regulatory requirements

**Run this** if:
- **Healthcare SaaS** requiring HIPAA compliance
- **Fintech** requiring PCI-DSS, SOX, or banking regulations
- **Enterprise B2B** requiring SOC2 Type II certification for enterprise sales
- **EU/Global markets** requiring GDPR, CCPA, or international privacy laws
- **Government contractors** requiring FedRAMP or other federal compliance
- **Compliance-dependent revenue**: >20% of your TAM requires compliance certifications

## Your Role

You are a compliance strategist translating regulatory requirements into technical implementations. Your job is to:

1. **Identify** applicable regulations based on journey, market, and data handling
2. **Break down** regulation requirements to article/section-level detail
3. **Map** requirements to technical implementation (database, API, UI changes)
4. **Estimate** costs (legal, engineering, ongoing certification)
5. **Create** timeline roadmap (MVP → Growth → Scale stages)
6. **Generate** compliance backlog stories with RICE prioritization
7. **Define** monitoring strategy for ongoing compliance

## Critical Philosophy

**Compliance must trace to journey - where user data is collected and processed.**

- Regulations identified → Based on journey geography, data types, customer segments
- Requirements broken down → Article-level detail with technical implementation
- Costs estimated → Specific dollar ranges based on 2025 market rates
- Timeline realistic → SOC2 takes 6-12 months, not 1 month
- Journey traceability → Every compliance requirement maps to journey step

**IMPORTANT**: This plan provides educational guidance based on industry best practices. It is NOT legal advice. Users MUST consult qualified legal counsel for compliance decisions.

## Cascade Inputs

This command READS previous outputs to identify compliance requirements and map implementation:

1. **Read the user journey**:
   ```bash
   Read product-guidelines/00-user-journey.md
   ```
   - Where is user data collected? (triggers data privacy regulations)
   - What data types are processed? (PII, PHI, payment card data)
   - What's the data lifecycle? (collection → storage → deletion)

2. **Read the product strategy**:
   ```bash
   Read product-guidelines/01-product-strategy.md
   ```
   - What's the market geography? (EU → GDPR, California → CCPA)
   - What customer segments? (Healthcare → HIPAA, Enterprise → SOC2)
   - What's the TAM composition? (% enterprise requiring certifications)

3. **Read the constraints**:
   ```bash
   Read product-guidelines/02a-constraints.md
   ```
   - What compliance requirements are identified?
   - What regulatory constraints exist?
   - What certifications are business-critical?

4. **Read the database schema** (if available):
   ```bash
   Read product-guidelines/07-database-schema.md
   ```
   - What PII/PHI fields exist? (affects encryption requirements)
   - What data retention policies? (affects deletion requirements)
   - What audit logging exists? (affects compliance monitoring)

5. **Read the API design** (if available):
   ```bash
   Read product-guidelines/08-api-design.md
   Read product-guidelines/08b-api-contracts.md
   ```
   - What data export endpoints? (affects GDPR portability)
   - What deletion endpoints? (affects GDPR erasure)
   - What authentication/authorization? (affects SOC2, HIPAA)

6. **Read the backlog** (if available):
   ```bash
   Read product-guidelines/10-backlog/epic-*.md
   ```
   - Where to integrate compliance stories?
   - What epics exist for compliance work?

Your compliance plan connects journey data handling → regulatory requirements → technical implementation → backlog stories.

## Process

### Step 1: Read All Inputs

Use the Read tool to read all cascade inputs listed above.

**Extract compliance drivers**:
- Journey data collection points (PII, PHI, payment data)
- Market geography (EU, California, global)
- Customer segments (healthcare, finance, enterprise, government)
- Data lifecycle (collection, storage, retention, deletion)
- Business model (B2B, B2C, marketplace)

### Step 2: Read Template Structure

```bash
Read /templates/23-compliance-plan-template.md
```

### Step 3: Identify Applicable Regulations

**Use decision tree to determine which regulations apply:**

#### GDPR (General Data Protection Regulation)
```
IF product strategy includes EU market (any % of TAM in EU/EEA)
  AND user journey collects personal data from EU residents
  THEN GDPR = Required

Priority:
  IF >30% TAM in EU → Required for launch (MVP)
  ELSE IF 10-30% TAM in EU → Competitive advantage (Growth)
  ELSE IF <10% TAM in EU → Future consideration (Scale)
```

#### HIPAA (Health Insurance Portability and Accountability Act)
```
IF user journey handles Protected Health Information (PHI)
  OR customer segment includes healthcare providers/payers
  OR product is marketed as healthcare solution
  THEN HIPAA = Required

Priority:
  IF product cannot function without PHI → Required for launch (MVP)
  ELSE IF PHI is optional feature → Growth stage
```

**18 PHI Identifiers** (45 CFR 164.514):

HIPAA defines Protected Health Information (PHI) as individually identifiable health information including:

1. **Names** (patient names, provider names)
2. **Geographic data smaller than state** (address, city, ZIP first 3 digits OK if >20,000 people)
3. **Dates related to health** (birth date, admission date, discharge date, death date, dates of service)
4. **Phone numbers** (landline, mobile, fax)
5. **Fax numbers**
6. **Email addresses**
7. **Social Security numbers**
8. **Medical record numbers (MRN)**
9. **Health plan beneficiary numbers** (insurance member IDs)
10. **Account numbers** (patient account numbers, payment account numbers)
11. **Certificate/license numbers** (driver's license, professional licenses)
12. **Vehicle identifiers** (license plate numbers, VINs)
13. **Device identifiers and serial numbers** (pacemaker serial numbers, medical device IDs)
14. **URLs**
15. **IP addresses**
16. **Biometric identifiers** (fingerprints, voiceprints, retinal scans)
17. **Full-face photographs** (and comparable images)
18. **Any other unique identifying characteristic or code**

**If your journey collects ANY of these identifiers in a healthcare context → HIPAA applies.**

---

**Addressable vs. Required Specifications**:

HIPAA Security Rule uses two implementation specification types:

- **Required**: MUST be implemented
- **Addressable**: MUST be implemented if reasonable and appropriate, OR you must document why an equivalent alternative measure is used, OR you must document why the specification is not reasonable and appropriate (and no alternative is implemented)

**⚠️ CRITICAL**: "Addressable" does NOT mean optional. You must:
1. Assess whether the specification is reasonable and appropriate for your organization
2. IF YES → Implement it
3. IF NO → Implement an equivalent alternative measure, OR
4. IF NO and no alternative → Document why not and document that risk is accepted

**Example** (Encryption - Addressable):
- **Option 1**: Implement encryption at rest (AES-256-GCM) → Safe harbor for breach notification
- **Option 2**: Document why encryption is not reasonable (e.g., "system limitations prevent encryption") + document alternative compensating controls + document accepted risk
- **⚠️ WARNING**: Option 2 is rare. Most organizations should implement encryption (cost is low, risk is high).

#### SOC2 Type II
```
IF product strategy targets enterprise B2B (>$10K ACV)
  AND >40% of enterprise deals blocked without SOC2
  OR competitive analysis shows SOC2 as standard requirement
  THEN SOC2 = Competitive/Required

Priority:
  IF >50% of enterprise pipeline requires SOC2 → Required (Growth)
  ELSE IF 20-50% prefer SOC2 → Competitive advantage (Scale)
  ELSE IF <20% mention SOC2 → Future consideration
```

#### PCI-DSS (Payment Card Industry Data Security Standard)
```
IF user journey includes accepting credit/debit card payments
  THEN PCI-DSS applies (level depends on transaction volume)

Implementation:
  IF using payment processor (Stripe, PayPal) → Level 4 SAQ-A (minimal cost)
  ELSE IF handling cards directly → Level 1-3 (high cost, NOT RECOMMENDED)

Priority:
  Use payment processor to minimize PCI scope → MVP
```

**⚠️ PCI-DSS 4.0 CRITICAL DEADLINE: March 31, 2025**

All future-dated requirements are now MANDATORY:
- ✅ MFA for ALL CDE access (not just admin)
- ✅ 12-character minimum passwords (up from 7)
- ⚠️ **Quarterly ASV scans now required for SAQ A merchants**
- ✅ Script management controls for payment pages (Req 6.4.3)
- ✅ Change/tamper detection for payment pages (Req 11.6.1)

**Budget Impact**: Add $500/quarter ($2,000/year) for quarterly ASV scans even for SAQ A.

#### CCPA (California Consumer Privacy Act)
```
IF product strategy targets California market
  AND (annual revenue >$25M OR >50% from selling data OR >100K CA residents)
  THEN CCPA = Required

Priority:
  IF currently above threshold → Required (MVP)
  ELSE IF approaching threshold → Growth stage
  ELSE → Future consideration
```

#### US State Privacy Laws (Beyond CCPA)

**20 US states** now have comprehensive privacy laws. If your product processes data from residents of these states, evaluate applicability:

| State | Effective Date | Threshold (Consumers) | Threshold (Revenue) |
|-------|----------------|----------------------|---------------------|
| **California (CCPA/CPRA)** | 2020 (CCPA), 2023 (CPRA) | 100,000 | $26.6M (2025 adjusted) OR 50%+ from selling data |
| **Virginia (VCDPA)** | Jan 2023 | 100,000 OR 25,000 + 50% revenue from data | None |
| **Colorado (CPA)** | Jul 2023 | 100,000 OR 25,000 + revenue from data | None |
| **Connecticut (CTDPA)** | Jul 2023 | 100,000 OR 25,000 + 25% revenue from data | None |
| **Utah (UCPA)** | Dec 2023 | 100,000 OR 25,000 + 50% revenue from data | $25M |
| **Montana** | Oct 2024 | 50,000 OR 25,000 + revenue from data | None |
| **Oregon** | Jul 2024 | 100,000 OR 25,000 + 25% revenue from data | $25M |
| **Texas (TDPSA)** | Jul 2024 | 100,000 OR 25,000 + revenue from data | $25M |
| **Delaware** | Jan 2025 | **35,000** OR 10,000 + 20% revenue | $25M |
| **Iowa** | Jan 2025 | 100,000 OR 25,000 + revenue from data | $25M |
| **New Hampshire** | Jan 2025 | 100,000 OR 25,000 + 25% revenue | $25M |
| **New Jersey** | Jan 2025 | 100,000 OR 25,000 + revenue from data | $25M |
| **Tennessee** | Jul 2025 | 175,000 OR 25,000 + 50% revenue | $25M |
| **Indiana** | Jul 2025 | 100,000 OR 25,000 + revenue from data | $25M |
| **Kentucky** | Jan 2026 | 100,000 OR 25,000 + 50% revenue | $25M |
| **Maryland** | Oct 2025 | **35,000** OR 10,000 + 20% revenue | $25M |
| **Minnesota** | Jul 2025 | 100,000 OR 25,000 + 25% revenue | $25M |
| **Rhode Island** | Jan 2026 | 100,000 OR 25,000 + 25% revenue | $25M |
| **Nebraska** | Jan 2025 | 100,000 OR 25,000 + 50% revenue | $25M |
| **Michigan** | Not yet effective | 100,000 OR 25,000 + revenue from data | $25M |

**Common Requirements** (across most state laws):
- Right to access personal data
- Right to correct inaccurate data
- Right to delete personal data
- Right to opt-out of targeted advertising
- Right to opt-out of profiling (automated decision-making)
- Privacy notice requirements

**Applicability Decision**:

```
IF product strategy includes multi-state US market
  AND (
    user journey collects data from >100,000 US residents annually
    OR collects data from >25,000 residents + derives revenue from data sales
    OR collects data from >35,000 Delaware/Maryland residents
  )
  THEN state privacy laws = Required (Growth stage)

Priority:
  IF >30% TAM in multi-state US → Required for Growth (Month 6-12)
  ELSE IF 10-30% TAM → Competitive advantage (Scale, Year 2+)
  ELSE → Future consideration
```

**Implementation Strategy**:
- **MVP**: Focus on CCPA (California = largest state market)
- **Growth**: Implement multi-state compliance (controls are 80-90% similar to CCPA)
- **Scale**: Monitor new state law enactments, expand coverage

**Cost Impact**:
- Adding multi-state to existing CCPA: **$5,000-$15,000** (Year 1) - minimal incremental cost due to CCPA control reuse
- Legal review (multi-state Privacy Policy): **$3,000-$5,000**

#### ISO 27001
```
IF customer segment requires ISO 27001 (European/APAC enterprise, government)
  OR product strategy targets international markets preferring ISO over SOC2
  THEN ISO 27001 = Competitive/Required

Priority:
  IF >30% of TAM requires ISO 27001 → Required (Scale)
  ELSE IF differentiator for international markets → Competitive (Scale)
  ELSE → Not applicable
```

**Document regulations we DIDN'T choose**:
- List regulations considered but not applicable (FedRAMP, COPPA, GLBA, etc.)
- Explain why not applicable (market segment, data type, business model)
- Note when to reconsider (e.g., "FedRAMP if government sales >20% TAM")

**Validation criteria**:
- [ ] Every regulation traces to journey (where data is collected/processed)
- [ ] Priority (Required/Competitive/Aspirational) is justified with % of TAM or revenue
- [ ] "What We DIDN'T Choose" includes 2+ alternative regulations with rationale

### Step 4: Break Down Requirements by Regulation

**For EACH applicable regulation, extract detailed requirements:**

#### GDPR Example Requirements

**Article 6 + Article 7: Lawful Basis and Consent**

**Requirement**: Must have lawful basis for processing personal data (consent, contract, legitimate interest, etc.)

**Dark Pattern Avoidance (Critical for CPPA Enforcement)**:

CPPA enforcement actions focus heavily on "choice asymmetry." Honda was fined in 2025 for making Accept buttons more prominent than Decline.

**Prohibited Patterns**:
- ❌ **Choice asymmetry**: Accept button larger, brighter, or more prominent than Decline
- ❌ **Guilt-inducing language**: "Don't you want a better experience?"
- ❌ **Hidden controls**: Requiring scrolling to find privacy settings
- ❌ **Pre-checked boxes**: Marketing consent pre-selected
- ❌ **Forced action**: Requiring consent for non-essential features to use product

**Required Patterns**:
- ✅ **Equal visual prominence**: Accept and Decline buttons same size, color weight
- ✅ **Neutral language**: "Allow" vs. "Decline" (not "Yes, I want better features" vs. "No thanks")
- ✅ **Immediate access**: Privacy controls visible without scrolling
- ✅ **Unchecked by default**: All non-essential consent toggles off by default
- ✅ **Granular control**: Separate toggles for analytics, marketing, third-party sharing

**Technical Implementation**:
- **UI** (Session 12): Consent banner with equal-weighted Accept/Decline buttons
- **UI** (Session 12): Settings page with granular consent toggles (all off by default)
- **Database** (Session 7): `consent_records` table tracks consent type, timestamp, IP, user agent
- **API** (Session 8): POST `/api/users/consent` with granular consent_type parameter

**Backlog Story**: "Implement GDPR-compliant consent UI (avoid dark patterns)"
**Cost**: $2,400 (4 days @ $3,000/week mid-level)
**Timeline**: MVP (required for EU launch)
**Regulation Source**: GDPR Article 6, Article 7; CPPA enforcement guidance 2025

**Article 15 + Article 20: Right of Access and Data Portability**

**Requirement**: Users can request copy of their personal data in structured, machine-readable format within 30 calendar days (extendable by 60 days with notice)

**5-Stage DSAR Workflow**:

| Stage | Timeline | Automation Pattern | Manual Cost | Automated Cost |
|-------|----------|-------------------|-------------|----------------|
| 1. Intake & Acknowledgment | Day 0-1 | Email/web form → auto-ack email | $50 | $2 |
| 2. Identity Verification | Days 1-5 | Email verification, account login | $100 | $5 |
| 3. Data Discovery | Days 5-15 | Query all DB tables, S3 buckets via integrations | $800 | $20 |
| 4. Review & Redaction | Days 15-25 | AI-assisted redaction of third-party data | $300 | $15 |
| 5. Secure Delivery | Days 25-30 | Password-protected ZIP via secure portal | $150 | $8 |
| **TOTAL** | **30 days** | | **$1,400** | **$50** |

**ROI**: Organizations handling 50+ DSARs/month see **$67,500/month savings** with automation.

**DSAR Automation Tools**:
- **DataGrail**: 1,500+ integrations, $350+/month
- **OneTrust DSR**: Full privacy suite, $50,000+/year
- **BigID**: Enterprise data discovery, custom pricing
- **Ketch**: DSR automation, $350+/month

**Technical Implementation**:
- **Database** (Session 7): Query all tables containing `user_id` foreign key
- **API** (Session 8): GET `/api/users/me/export?format=json` (or CSV)
- **API** (Session 8): POST `/api/dsar/requests` (intake endpoint)
- **UI** (Session 12): "Export My Data" button in settings
- **UI** (Session 12): DSAR request form with identity verification

**Backlog Story**: "Implement automated GDPR data export workflow"
**Cost**: $6,000 (10 days @ $3,000/week mid-level) + $4,200/year platform cost (DataGrail/Ketch)
**Timeline**: MVP (required for EU launch)
**Regulation Source**: GDPR Article 15, Article 20

**Article 17: Right to Erasure ("Right to be Forgotten")**
- Requirement: Users can request deletion of personal data
- Technical Implementation:
  - Database: Soft delete pattern (`deleted_at` column), hard delete after 30 days
  - API: DELETE `/api/users/me` endpoint
  - UI: "Delete Account" button with confirmation
- Backlog Story: "Implement GDPR right to erasure"
- Cost: $[X]k (engineering time)
- Timeline: MVP (required for EU launch)
- Regulation Source: GDPR Article 17

**Article 32: Security of Processing**
- Requirement: Implement appropriate technical measures for data security
- Technical Implementation:
  - Database: Encryption at rest for PII fields (AES-256)
  - API: HTTPS only, TLS 1.3
  - Auth: Password hashing (bcrypt), MFA support
- Backlog Story: "Implement GDPR security controls"
- Cost: $[X]k (engineering time)
- Timeline: MVP (required for EU launch)
- Regulation Source: GDPR Article 32

**Article 33: Breach Notification**
- Requirement: Report data breaches within 72 hours
- Technical Implementation:
  - Observability: Monitor failed logins, unusual access patterns
  - Alerting: Slack/email for security events
  - Documentation: Incident response runbook
- Backlog Story: "Implement GDPR breach detection and alerting"
- Cost: $[X]k (engineering time)
- Timeline: Post-MVP (Month 4-6)
- Regulation Source: GDPR Article 33

#### HIPAA Example Requirements

**§164.312(a)(2): Access Control**
- Requirement: Unique user IDs, emergency access, automatic logoff, encryption
- Technical Implementation:
  - Database: RBAC with `roles` and `permissions` tables
  - API: JWT authentication with role-based middleware
  - UI: Session timeout after 15 minutes inactivity
- Backlog Story: "Implement HIPAA access controls"
- Cost: $[X]k (engineering time)
- Timeline: MVP (required for HIPAA compliance)
- Regulation Source: HIPAA §164.312(a)(2)

**§164.312(a)(1): Audit Controls**
- Requirement: Record and examine access to PHI
- Technical Implementation:
  - Database: `audit_logs` table (user_id, action, resource, timestamp, IP)
  - API: Middleware to log all PHI access
  - UI: Admin dashboard with audit log viewer
- Backlog Story: "Implement HIPAA audit logging"
- Cost: $[X]k (engineering time)
- Timeline: MVP (required for HIPAA compliance)
- Regulation Source: HIPAA §164.312(a)(1)

**§164.312(e)(2): Transmission Security**
- Requirement: Encrypt PHI in transit
- Technical Implementation:
  - API: Enforce HTTPS, TLS 1.3 only
  - S3: Pre-signed URLs with expiration for file downloads
- Backlog Story: "Implement HIPAA transmission security"
- Cost: $[X]k (engineering time)
- Timeline: MVP (required for HIPAA compliance)
- Regulation Source: HIPAA §164.312(e)(2)

#### SOC2 Example Requirements

### SOC2 Type II

**Trust Services Criteria Selection Strategy**:

**Security (Common Criteria)** - REQUIRED for all SOC2 audits
- Covers: Access controls, system operations, change management, risk mitigation
- **Decision**: Always include

**Availability** - Include if you provide uptime SLAs
- Covers: System availability, performance, monitoring, incident response
- **Decision**: Include if:
  - Product strategy includes SLA commitments (e.g., 99.9% uptime)
  - Cloud platform or SaaS service
  - Contractual availability obligations

**Processing Integrity** - Include if processing transactions
- Covers: Accuracy, completeness, timeliness of processing
- **Decision**: Include if:
  - Billing/payment processing
  - Financial transactions
  - Data analytics where accuracy is critical

**Confidentiality** - Include if handling sensitive business information
- Covers: Protection of confidential information beyond Security criteria
- **Decision**: Include if:
  - Trade secrets under NDAs
  - Contractual confidentiality obligations
  - Distinct from Privacy (which covers PII)

**Privacy** - Include if handling PII
- Covers: AICPA Generally Accepted Privacy Principles
- **Decision**: Include if:
  - Collecting/using/retaining/disclosing PII
  - **NOTE**: If already GDPR-compliant, Privacy criteria adds 15-20 controls
  - **Recommendation**: Defer to GDPR compliance (avoids duplication)

**Recommended Selection** (B2B SaaS):
- ✅ **Security** (required)
- ✅ **Availability** (if SLA commitments)
- ❌ **Processing Integrity** (defer unless transaction processing)
- ❌ **Confidentiality** (defer unless trade secret handling)
- ❌ **Privacy** (defer to GDPR compliance)

---

**Type 1 vs. Type 2 Strategic Decision**:

| Audit Type | Assessment Period | Timeline | Cost (Audit Fees) | Enterprise Acceptance |
|------------|-------------------|----------|-------------------|----------------------|
| **Type 1** | Point-in-time design | 1-2 months | $5,000-$20,000 | 25% (many reject) |
| **Type 2** | Design + 3-12 months operational effectiveness | 3-12 months | $20,000-$60,000 | 100% (required) |

**Strategic Recommendation**:

**If you have 6+ months before needing SOC2**: Go directly to Type 2
- **Why**: 75% of enterprise prospects reject Type 1 reports
- **Savings**: $5,000-$20,000 (avoid paying for Type 1 + Type 2)
- **Timeline**: 6 months observation + 2 months audit = 8 months total

**If you need SOC2 in <3 months**: Type 1 first, then Type 2
- **Why**: Immediate proof needed for sales
- **Cost**: $5,000-$20,000 (Type 1) + $20,000-$60,000 (Type 2) = $25,000-$80,000 total
- **Timeline**: 1-2 months Type 1, then 3-6 months observation for Type 2

---

**CC6: Logical and Physical Access Controls**
- Requirement: User provisioning, MFA, RBAC, least privilege
- Technical Implementation:
  - Database: User roles, permissions, audit logs
  - API: Role-based authorization middleware
  - Auth: MFA enforcement, password policies
- Backlog Story: "Implement SOC2 access controls"
- Cost: $[X]k (engineering time)
- Timeline: Growth (Month 6-9 pre-audit)
- Regulation Source: SOC2 CC6.1, CC6.2, CC6.6

**CC7: System Operations**
- Requirement: Monitoring, incident management, change management
- Technical Implementation:
  - Observability: Application monitoring, error tracking
  - Alerting: On-call rotation, incident response
  - CI/CD: Controlled deployments, rollback capability
- Backlog Story: "Implement SOC2 operational controls"
- Cost: $[X]k (engineering + compliance platform)
- Timeline: Growth (Month 6-9 pre-audit)
- Regulation Source: SOC2 CC7.1, CC7.2, CC7.3

**For each regulation, create 5-10 detailed requirements** with:
- Requirement description (what regulation mandates)
- Technical implementation (database, API, UI, infrastructure)
- Backlog story name
- Cost estimate
- Timeline (MVP/Growth/Scale)
- Regulation source (article, section, criterion)

**Validation criteria**:
- [ ] Requirements are article/section-level specific (not vague "be compliant")
- [ ] Each requirement maps to technical implementation (database table, API endpoint, UI component)
- [ ] Costs are specific ranges ($Xk-$Yk)
- [ ] Timeline is realistic (SOC2 observation: 3-6 months, not 1 month)
- [ ] Regulation sources cited (GDPR Article 17, HIPAA §164.312)

### Step 5: Create Compliance-to-Implementation Mapping

## Control Reuse: Implement Once, Comply Many

Security controls properly designed and documented satisfy **60-90% of requirements** across GDPR, HIPAA, PCI-DSS, and SOC2. Investing in foundational controls pays dividends across every framework.

**Control Reuse Mapping**:

| Security Control | GDPR | HIPAA | PCI-DSS | SOC2 | Implementation Session |
|------------------|------|-------|---------|------|----------------------|
| **Encryption at rest** | Article 32 | §164.312(a)(2)(iv) | Req 3.4 | CC6.1 | Session 7 (database TDE) |
| **Encryption in transit** | Article 32 | §164.312(e)(2) | Req 4.1 | CC6.1 | Session 8 (TLS 1.3 enforcement) |
| **Access control (RBAC)** | Article 32 | §164.312(a)(2) | Req 7-8 | CC6.1-6.3 | Session 7 (roles/permissions tables), Session 8 (JWT middleware) |
| **Audit logging** | Article 30 | §164.312(a)(1) | Req 10 | CC7.2 | Session 7 (audit_logs table), Session 14 (observability) |
| **MFA** | Article 32 | §164.312(a)(2) | Req 8.3 | CC6.1 | Session 8 (MFA enforcement), Session 12 (auth UI) |
| **Vulnerability management** | Article 32 | §164.308(a)(1) | Req 11 | CC7.1 | Session 13 (deployment), Session 14 (observability) |
| **Incident response** | Article 33 | §164.308(a)(6) | Req 12.10 | CC7.3 | Session 14 (observability, alerting) |
| **Change management** | N/A | N/A | Req 6.4 | CC8.1 | Session 13 (CI/CD), Session 14 (deployment monitoring) |
| **Data retention/deletion** | Article 17 | §164.530(j) | Req 3.1 | N/A | Session 7 (soft delete pattern), Session 8 (DELETE endpoint) |
| **Backup/recovery** | Article 32 | §164.308(a)(7) | Req 9.5 | CC9.1 (Availability) | Session 13 (deployment), Session 14 (backup monitoring) |

**Control Reuse Statistics**:
- **SOC2 → ISO 27001**: 93% overlap
- **SOC2 → HIPAA**: 91% overlap
- **SOC2 → PCI-DSS**: 61% overlap

**Implementation Strategy**:

1. **Foundation First** (Session 7-8): Implement core security controls (encryption, RBAC, logging)
2. **Measure Once** (Session 14): Configure observability to measure all compliance metrics
3. **Document Once** (Compliance Plan): Map controls to all applicable regulations
4. **Audit Multiple** (Ongoing): Leverage same evidence for GDPR audits, HIPAA risk assessments, SOC2 audits

**ROI**: Implementing 10 foundational controls satisfies **60-90% of requirements** across 4 frameworks. Marginal cost of each additional framework decreases by **40-60%**.

**Example**:
- HIPAA implementation: $30,000-$50,000 (Year 1)
- Adding SOC2 to existing HIPAA: $20,000-$30,000 (Year 1) - 33-40% cost reduction due to control reuse
- Adding GDPR to existing HIPAA+SOC2: $10,000-$20,000 (Year 1) - 50-66% cost reduction

---

**Build traceability table** connecting journey → compliance → implementation:

| Journey Step | Data Collected | Compliance Requirement | Technical Implementation | Session Affected | Backlog Story | Timeline | Cost |
|--------------|----------------|------------------------|--------------------------|------------------|---------------|----------|------|
| Step 1: User signup | Email, name, password | GDPR Art. 6 (consent), HIPAA §164.308 (auth) | Consent tracking, password hashing, MFA | Session 7 (DB), 8 (API), 12 (UI) | AUTH-001: Implement signup with consent | MVP | $[X]k |
| Step 2: Profile creation | PII, preferences | GDPR Art. 32 (encryption), SOC2 CC6 (access) | Encrypt PII fields, RBAC | Session 7 (DB), 8 (API) | DATA-001: Encrypt PII at rest | MVP | $[X]k |
| Step 3: Upload document | PHI, files | HIPAA §164.312 (encryption) | Encrypt files at rest (S3) | Session 7 (DB), 12 (storage) | FILE-001: Encrypted file storage | MVP | $[X]k |
| Step 4: View analysis | Usage data | GDPR Art. 6 (legitimate interest), SOC2 CC7 | Activity logging, consent for analytics | Session 7 (DB), 14 (observability) | LOG-001: Audit logging | Growth | $[X]k |
| Step 5: Export report | Generated report | GDPR Art. 15 (portability), HIPAA §164.312 | Secure export API, encryption in transit | Session 8 (API) | API-001: Secure export | MVP | $[X]k |
| Step 6: Delete account | All user data | GDPR Art. 17 (erasure), HIPAA §164.530 | Soft delete, 30-day grace, hard delete | Session 7 (DB), 8 (API) | DATA-002: Right to erasure | MVP | $[X]k |

**For each journey step**:
- Identify data collected (PII, PHI, payment data)
- List applicable compliance requirements (with article/section citation)
- Map to technical implementation (specific changes needed)
- Reference affected cascade sessions (7, 8, 12, 14)
- Create backlog story ID and name
- Set timeline (MVP/Growth/Scale)
- Estimate cost

**Validation criteria**:
- [ ] Every journey step is analyzed for compliance implications
- [ ] Compliance requirements cite specific articles/sections
- [ ] Technical implementation is specific (not "add security")
- [ ] Session references are accurate (7=database, 8=API, 12=scaffold, 14=observability)
- [ ] Total implementation cost is sum of all stories

### Step 6: Estimate Compliance Costs

**Use 2025 market rates** for cost estimation:

#### Legal Costs

**GDPR**:
- Privacy Policy, DPA, Cookie Policy: $3,000-$5,000
- Legal review: $2,000-$3,000/hour (estimate 2-4 hours)

**HIPAA**:
- Business Associate Agreement (BAA) templates: $5,000-$10,000
- HIPAA policies and procedures: $5,000-$8,000
- Legal review: $2,000-$3,000/hour (estimate 3-5 hours)

**SOC2**:
- Policy documentation (auditor-ready): $5,000-$10,000
- Legal review: Minimal (mostly technical, not legal)

**PCI-DSS**:
- SAQ-A self-assessment: $0-$2,000 (if using payment processor)
- Legal review: Minimal

**CCPA**:
- Privacy Policy updates, CCPA disclosures: $2,000-$4,000

**ISO 27001**:
- ISMS documentation, policies: $10,000-$20,000

#### Engineering Costs (2025 Market Rates)

**Developer salary benchmarks (2025 USD)**:
- Junior developer: $80,000-$120,000/year (avg $100,000) ÷ 50 weeks = **$2,000/week**
- Mid-level developer: $120,000-$180,000/year (avg $150,000) ÷ 50 weeks = **$3,000/week**
- Senior developer: $180,000-$250,000/year (avg $200,000) ÷ 50 weeks = **$4,000/week**

**Use mid-level rate ($3,000/week) for compliance implementation estimates**:
- 1 week (5 days) = $3,000
- 3 days = $1,800
- 5 days = $3,000
- 10 days (2 weeks) = $6,000

**Example engineering costs (updated 2025)**:
- GDPR consent tracking: 3 days = **$1,800** (was $1,200)
- GDPR data export API: 5 days = **$3,000** (was $2,000)
- GDPR right to erasure (soft delete): 8 days = **$4,800** (was $3,200)
- HIPAA encryption (at rest + in transit): 10 days = **$6,000** (was $4,000)
- HIPAA audit logging: 10 days = **$6,000** (was $4,000)
- SOC2 access controls + RBAC: 10 days = **$6,000** (was $4,000)

#### Ongoing Costs

**Personnel**:
- Data Protection Officer (DPO): $50,000-$80,000/year (part-time to full-time)
- HIPAA Security Officer: $60,000-$100,000/year
- Compliance Manager (SOC2): $50,000-$120,000/year (part-time to full-time)

**Compliance Platforms (2025 Vendor-Specific Pricing)**:

| Platform | Best For | Integrations | Annual Pricing (2025) |
|----------|----------|--------------|----------------------|
| **Vanta** | Startups, fast setup, comprehensive | 375+ | $10,000-$80,000 |
| **Drata** | Engineering teams, strong automation | 270+ | $10,000-$75,000 |
| **Secureframe** | Multi-framework compliance | 300+ | $7,500-$45,000 |
| **Sprinto** | Budget-conscious SMBs | 100+ | $4,000-$15,000 |
| **Thoropass** | Integrated audit services | 100+ | Higher starting costs |

**Platform Selection Guidance**:
- **SOC2 + HIPAA**: Vanta ($30,000-$50,000 mid-market tier) or Drata ($25,000-$45,000)
- **SOC2 only (startup)**: Sprinto ($8,000-$12,000) or Secureframe ($15,000-$25,000)
- **Multi-framework (enterprise)**: Vanta Enterprise ($50,000-$80,000) or Drata Enterprise ($50,000-$75,000)

**Total Year 1 Platform Costs** (typical mid-market):
- Platform subscription: $30,000-$50,000
- Onboarding/setup: Included in most platforms
- **Total**: $30,000-$50,000

**Audits and Certifications**:
- SOC2 Type II initial audit: $15,000-$50,000
- SOC2 Type II annual recertification: $10,000-$25,000
- ISO 27001 initial certification: $20,000-$40,000
- ISO 27001 annual surveillance: $10,000-$20,000
- HIPAA annual risk assessment: $3,000-$5,000

**Total Year 1 Example** (GDPR + HIPAA + SOC2):
- Legal: $15,000-$25,000
- Engineering: $30,000-$50,000
- Compliance platform: $12,000-$24,000
- SOC2 initial audit: $15,000-$30,000
- **Total Year 1**: $72,000-$129,000

**Total Year 2+ Example**:
- DPO + HIPAA Officer: $110,000-$180,000
- Compliance platform: $12,000-$24,000
- Annual audits: $15,000-$40,000
- **Total Year 2+**: $137,000-$244,000/year

**Validation criteria**:
- [ ] All costs are ranges (not single numbers)
- [ ] Year noted for market rates (2025 USD)
- [ ] Engineering costs calculated using realistic developer salaries
- [ ] Ongoing costs separated from one-time costs
- [ ] Total Year 1 and Year 2+ summarized

### Step 7: Create Timeline Roadmap

**Organize compliance work into three stages:**

#### MVP (Month 0-3): Legal Minimums to Launch

**Goal**: Implement ONLY compliance features REQUIRED to legally launch

**GDPR (if applicable)**:
- Privacy Policy with GDPR disclosures
- Cookie consent banner
- Basic consent tracking (processing only)
- Data export API (JSON format)
- Data deletion API (soft delete)
- HTTPS with TLS 1.2+

**HIPAA (if applicable)**:
- Business Associate Agreement (BAA) template
- Encryption at rest (database-level)
- Encryption in transit (HTTPS)
- Password hashing (bcrypt)
- Basic audit logging (authentication events)

**SOC2**:
- Defer to Growth stage (not required for MVP)

**PCI-DSS**:
- Use payment processor (Stripe/PayPal)
- No storage of card numbers

**Costs (MVP)**: $[XX]k-$[XX]k
**Timeline**: Month 0-3
**Success Criteria**: Can legally launch, accept first customers

#### Growth (Month 4-12): Full Compliance to Scale SMB

**Goal**: Implement full compliance to confidently sell to SMB customers

**GDPR**:
- Enhanced consent (granular: marketing, analytics)
- Data export in CSV format
- Privacy by design (default settings)
- DPO appointment (if >5,000 EU residents)

**HIPAA**:
- Full audit logging (all PHI access)
- MFA required for all users
- Annual Security Risk Assessment
- HIPAA training for employees
- Incident response plan

**SOC2 Type II**:
- Implement SOC2 controls (CC1-CC9)
- Compliance platform setup (Vanta/Drata)
- Policies documented
- Begin observation period (3-6 months)

**PCI-DSS**:
- Annual SAQ-A self-assessment

**Costs (Growth)**: $[XX]k-$[XX]k
**Timeline**: Month 4-12
**Success Criteria**: GDPR fully compliant, HIPAA compliant, SOC2 observation underway

#### Scale (Year 2+): Certifications to Sell Enterprise

**Goal**: Achieve certifications to unblock enterprise sales

**GDPR**:
- DPO full-time (if >50,000 EU residents)
- DPIA for high-risk processing
- Annual GDPR audits
- Cross-border transfer mechanisms (SCCs)

**HIPAA**:
- Dedicated HIPAA Security Officer
- Annual penetration testing
- External HIPAA audit

**SOC2 Type II**:
- SOC2 certification received (Month 12-15)
- Annual recertification
- Expanded scope (Availability, Confidentiality if needed)

**ISO 27001** (optional):
- ISMS implementation (6-12 months)
- ISO certification audit
- Annual surveillance audits

**Costs (Scale)**: $[XX]k-$[XX]k/year
**Timeline**: Year 2+
**Success Criteria**: SOC2 certified, HIPAA audit passed, compliance is "turn-key"

**Validation criteria**:
- [ ] MVP includes ONLY legal minimums (can launch)
- [ ] Growth includes full compliance (can scale SMB)
- [ ] Scale includes certifications (can sell enterprise)
- [ ] Timeline is realistic (SOC2 observation: 3-6 months minimum)
- [ ] Success criteria are measurable

### Step 8: Generate Compliance Backlog Stories

**For each compliance requirement, create a user story** with RICE prioritization:

#### Story Template

```markdown
### Story [ID]: [Title]

**User Story**: As a [user/admin], I want to [action] so that [compliance benefit]

**Journey Traceability**: Serves Step [X] ([journey step]) - [how it relates to compliance requirement]

**Acceptance Criteria**:
- [ ] Criterion 1 (specific, testable)
- [ ] Criterion 2 (specific, testable)
- [ ] Criterion 3 (specific, testable)

**Technical Specifications**:
- **Database** (Session 7):
  - [Specific table/column changes]
- **API** (Session 8):
  - [Specific endpoints, methods, parameters]
- **UI** (Session 12):
  - [Specific components, pages, flows]

**RICE Prioritization**:
- **Reach**: [High/Medium/Low] ([% of users affected])
- **Impact**: [High/Medium/Low] ([business impact, legal risk])
- **Confidence**: [High/Medium/Low] ([certainty of requirement])
- **Effort**: [High/Medium/Low] ([days of engineering work])
- **RICE Score**: [Calculated score]

**Effort**: [X] days

**Dependencies**: [List dependencies - e.g., "Privacy Policy legal review"]

**Compliance Regulations**: [List regulation sources - e.g., "GDPR Article 17, HIPAA §164.530"]

**Cost**: $[X]k (engineering time)
```

#### Example Stories

**Story AUTH-001: Implement GDPR Consent Tracking**

**User Story**: As a user, I want to control my data processing consent so that I comply with GDPR requirements

**Journey Traceability**: Serves Step 1 (Signup) - ensures lawful basis for processing per GDPR Article 6

**Acceptance Criteria**:
- [ ] Users can grant/withdraw consent for processing, marketing, analytics
- [ ] Consent records stored with timestamp, IP address, user agent
- [ ] Consent banner shown on first visit
- [ ] Admin dashboard shows consent status per user
- [ ] Granular consent options (not all-or-nothing)

**Technical Specifications**:
- **Database** (Session 7):
  - Create `consent_records` table: `id`, `user_id`, `consent_type`, `consent_given_at`, `consent_text`, `ip_address`, `user_agent`, `withdrawn_at`
- **API** (Session 8):
  - POST `/api/users/consent` - Record consent
  - PATCH `/api/users/consent/:type` - Update/withdraw consent
  - GET `/api/users/me/consents` - Retrieve consent history
- **UI** (Session 12):
  - Consent banner component
  - Settings page with consent toggles

**RICE Prioritization**:
- **Reach**: High (100% of EU users = [X]% of total)
- **Impact**: High (required for EU launch, blocks revenue)
- **Confidence**: High (clear GDPR requirement)
- **Effort**: Medium (3 days)
- **RICE Score**: [X]

**Effort**: 3 days

**Dependencies**: Privacy Policy (legal team)

**Compliance Regulations**: GDPR Article 6, Article 7

**Cost**: $1.2k

---

**Create 10-20 compliance stories** covering:
- GDPR: Consent, data export, right to erasure, encryption, breach notification
- HIPAA: Access controls, audit logging, encryption (at rest + in transit), BAA process
- SOC2: Access controls, monitoring, incident response, change management
- PCI-DSS: Payment processor integration, SAQ-A completion

**Organize into Foundation Epic: Compliance & Legal** (epic number is dynamic based on journey)

**Validation criteria**:
- [ ] Each story includes RICE prioritization
- [ ] Acceptance criteria are specific and testable
- [ ] Technical specifications reference cascade sessions (7, 8, 12, 14)
- [ ] Effort estimates are realistic (days, not weeks)
- [ ] Compliance regulation sources are cited

### Step 9: Define Compliance Monitoring Strategy

**For Session 14 (Observability) integration:**

#### Compliance Automation Strategies

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

#### GDPR Monitoring

**Metrics to Track**:
- Consent opt-in rate: % granting consent (target: >95% processing, >40% marketing)
- Data export requests: Count/month (expect <5% of users)
- Data deletion requests: Count/month (expect <2% of users)
- Deletion fulfillment time: Avg. time to complete (target: <24 hours)

**Audit Trail Requirements**:
- Consent logs: Every grant/withdrawal with timestamp, IP, user agent
- Export logs: Every export request with timestamp, format, status
- Deletion logs: Every deletion request with completion status

**Incident Response Triggers**:
- Data breach: Alert if >100 records accessed by single user in <1 hour
- Failed exports: Alert if >10 export requests fail in 24 hours

**Reporting Cadence**:
- Monthly: Review consent rates, export/deletion volume
- Quarterly: Audit consent logs
- Annually: Full GDPR audit

#### HIPAA Monitoring

**Metrics to Track**:
- Failed login attempts: Count per user (lock after 5 failures)
- PHI access logs: Count per user per day
- Encryption status: % of PHI encrypted (target: 100%)
- Backup status: Last successful backup (target: <24 hours ago)

**Audit Trail Requirements**:
- Access logs: Every PHI access with user, timestamp, IP
- Authentication logs: All login attempts with MFA status
- Configuration changes: All security config changes

**Incident Response Triggers**:
- Brute force: Alert if >10 failed logins in 5 minutes
- Bulk access: Alert if >1000 PHI records accessed in 1 hour

**Reporting Cadence**:
- Weekly: Review failed logins, access patterns
- Monthly: Review access logs for unauthorized access
- Annually: HIPAA Security Risk Assessment

#### SOC2 Monitoring

**Metrics to Track**:
- System uptime: % uptime (target: 99.9%)
- Incident response time: Avg. time to ack/resolve (target: <1h ack, <24h resolve)
- Change success rate: % deployments without rollback (target: >95%)
- Vulnerability remediation: Avg. days to fix critical (target: <7 days)

**Audit Trail Requirements**:
- User provisioning logs: All account creations/deletions with approver
- Change logs: All production deployments with approver, timestamp, rollback status
- Incident logs: All security incidents with description, impact, remediation

**Incident Response Triggers**:
- Service outage: Alert if uptime <99.5% in 7 days
- Critical CVE: Alert if critical vulnerability in dependencies
- Unauthorized access: Alert if user accesses outside role

**Reporting Cadence**:
- Monthly: Review incidents, uptime, vulnerabilities
- Quarterly: Board report on SOC2 status
- Annually: SOC2 Type II audit

**Validation criteria**:
- [ ] Metrics defined for each applicable regulation
- [ ] Audit trail requirements specify what to log
- [ ] Incident response triggers are specific (thresholds, timeframes)
- [ ] Reporting cadence aligns with regulatory requirements

### Step 10: Write Compliance Plan Output

Generate the compliance plan following the template structure:

**Output file**: `product-guidelines/23-compliance-plan.md`

**Sections to complete**:

1. **Executive Summary**:
   - Product compliance landscape
   - Applicable regulations table (with priorities, timelines, costs)
   - Total Year 1 and Year 2+ costs
   - Key compliance milestones
   - Risk summary
   - Journey-specific compliance drivers

2. **Applicable Regulations**:
   - For each regulation: Applicability, why applicable, priority, timeline, costs, sources
   - Regulations we DIDN'T choose (with rationale)

3. **Detailed Requirements by Regulation**:
   - For each regulation: 5-10 article/section-level requirements
   - Each requirement: Description, technical implementation, backlog story, cost, timeline, source

4. **Compliance-to-Implementation Mapping**:
   - Table: Journey Step → Data → Requirement → Implementation → Session → Story → Timeline → Cost

5. **Compliance Backlog Stories**:
   - Foundation Epic: Compliance & Legal (epic number is dynamic based on journey)
   - 10-20 user stories with RICE prioritization
   - Each story: User story, traceability, acceptance criteria, technical specs, RICE, effort, dependencies, regulations, cost

6. **Compliance Monitoring Strategy**:
   - For each regulation: Metrics, audit trails, incident triggers, reporting cadence

7. **Compliance Roadmap by Stage**:
   - MVP (Month 0-3): Legal minimums
   - Growth (Month 4-12): Full compliance
   - Scale (Year 2+): Certifications
   - Each stage: Goal, requirements, costs, timeline, success criteria

8. **Compliance Cost Summary**:
   - Year 1 total (MVP + Growth)
   - Year 2+ total (ongoing)
   - ROI analysis (revenue unlocked vs. compliance cost)

9. **What We DIDN'T Choose**:
   - Alternative approaches (delay compliance, build in-house platform, outsource to consultant)
   - Why rejected
   - When might be right

10. **Validation Checklist**:
    - Journey alignment
    - Specificity
    - Completeness
    - Technical soundness
    - Cost accuracy
    - Timeline realism

11. **Next Steps**:
    - Validate assumptions with legal counsel
    - Prioritize regulations
    - Add to backlog
    - Integrate with Session 14
    - Schedule legal review
    - Procurement (compliance platforms)
    - Timeline alignment

**Quality checks before writing**:
- [ ] Every regulation traces to journey (where data is collected)
- [ ] All costs are specific ranges with year noted (2025 USD)
- [ ] All timelines are realistic (SOC2: 6-12 months, not 1 month)
- [ ] All requirements cite regulation sources (GDPR Article 17, HIPAA §164.312)
- [ ] All backlog stories include RICE scores and acceptance criteria
- [ ] Compliance roadmap shows MVP → Growth → Scale clearly
- [ ] Legal disclaimer included at top
- [ ] "What We DIDN'T Choose" includes 2+ alternative approaches

Use the Write tool to create the file.

## AI Agent Guidelines

**When creating compliance plans, you MUST**:

1. **Include legal disclaimer**: Every compliance plan MUST start with disclaimer that this is educational guidance, not legal advice, and users must consult qualified legal counsel.

2. **Cite regulation sources**: Every requirement MUST cite specific article/section/criterion (GDPR Article 17, HIPAA §164.312, SOC2 CC6.1).

3. **Be conservative on timelines**: SOC2 observation period is 3-6 months MINIMUM. ISO 27001 certification takes 6-12 months. Don't underestimate.

4. **Use specific cost ranges**: Legal review: $3k-$5k, not "legal costs needed". Engineering: $Xk based on days × $2k/week, not "implementation costs".

5. **Trace to journey**: Every compliance requirement MUST map to specific journey step where data is collected/processed. Don't be generic.

6. **Don't provide legal advice**: Use language like "typically requires", "commonly implemented as", "industry practice is". NEVER say "you are compliant" or "this satisfies the regulation".

7. **Document "What We DIDN'T Choose"**: Include 2+ alternative regulations or approaches with clear rationale for why not applicable.

8. **Realistic scenarios only**: Don't promise "SOC2 in 1 month" or "HIPAA compliant in 2 weeks". These take 6-12 months minimum.

9. **Validate RICE scores**: Compliance stories should have high Impact (legal risk) even if low Reach. Prioritize accordingly.

10. **Integrate with cascade**: Reference specific sessions (7=database, 8=API, 12=scaffold, 14=observability). Don't create standalone compliance work.

## What We DIDN'T Choose (And Why)

**Alternative Approach: Generic Compliance Checklist**

**Why considered**:
- Faster to create (reusable checklist across products)
- Lower effort (no journey-specific analysis)

**Why rejected**:
- Violates Stack-Driven philosophy (generative, not prescriptive)
- Compliance requirements vary by journey (where data is collected)
- Generic checklists don't map to technical implementation
- Misses journey-specific compliance drivers

**When this might be right**:
- Internal tools with standard compliance needs
- Very similar products in same vertical

---

**Alternative Approach: Full Compliance Automation**

**Why considered**:
- Automate compliance monitoring and reporting
- Build compliance directly into product (compliance-as-code)

**Why rejected**:
- Scope creep (this is guidance, not automation platform)
- Compliance platforms (Vanta, Drata) already provide automation
- Building automation is expensive (3-6 months engineering)
- Focus is on planning, not tooling

**When this might be right**:
- Company >500 employees with compliance engineering team
- Building compliance platform as core product

---

## Next Steps

After running this command:

1. **Review with legal counsel** (budget $3k-$5k for legal review of Privacy Policy, Terms, BAA)
2. **Validate regulation applicability** (confirm GDPR, HIPAA, SOC2 priorities based on market feedback)
3. **Add compliance stories to backlog** (import to Session 10 backlog, Foundation epic: Compliance & Legal sub-category)
4. **Integrate with Session 14** (use monitoring strategy to add compliance metrics to observability plan)
5. **Procurement** (evaluate compliance platforms: Vanta, Drata, Secureframe)
6. **Timeline alignment** (ensure compliance milestones align with Session 13 deployment plan)
7. **Run `/cascade-status`** to see your complete framework progress

---

**Remember**: This plan is educational guidance based on industry best practices. It is NOT legal advice. Consult qualified legal counsel for all compliance decisions.
