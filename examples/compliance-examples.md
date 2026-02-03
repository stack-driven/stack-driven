# Compliance Examples

This file centralizes compliance implementation examples referenced by sub-agents in `/.claude/agents/compliance-*.md`.

## Journey-to-Compliance Mapping Examples

### Example 1: Healthcare SaaS (PHI Processing)

**Journey Step 3: Upload Medical Document**
- **Data Collected**: Patient medical records (PHI), diagnoses, treatment plans
- **Applicable Regulations**: HIPAA §164.312(a)(2)(iv) (encryption), GDPR Article 32 (if EU patients)
- **Technical Implementation**:
  - Database: `documents` table with `encrypted_at_rest` flag, `encryption_key_id` reference
  - Storage: S3 with SSE-KMS encryption, pre-signed URLs (15-min expiry)
  - API: POST `/api/documents/upload` with virus scanning, file type validation
  - Audit: Log every upload with `user_id`, `patient_id`, `document_type`, `timestamp`, `ip_address`
- **Backlog Story**: FILE-001: Implement HIPAA-compliant encrypted file storage
- **Cost**: $15k-$20k (10 days engineering + AWS KMS setup)
- **Timeline**: MVP (required for HIPAA compliance)

### Example 2: EU B2B SaaS (GDPR Focus)

**Journey Step 1: User Signup with Marketing Consent**
- **Data Collected**: Email, name, company, role, marketing preferences
- **Applicable Regulations**: GDPR Article 6 (lawful basis), Article 7 (consent conditions)
- **Technical Implementation**:
  - Database: `consent_records` table tracking granular consent (processing, marketing, analytics)
  - UI: Consent banner with clear language ("We use cookies to..."), separate checkboxes (not pre-checked)
  - API: POST `/api/consent` to record consent with IP, user agent, timestamp, consent text version
  - Dark pattern avoidance: No "Continue" button that implies consent, explicit Agree/Disagree buttons
- **Backlog Story**: AUTH-001: Implement GDPR consent tracking with dark pattern avoidance
- **Cost**: $5k-$7k (3-4 days engineering + legal review)
- **Timeline**: MVP (required for EU launch)

### Example 3: Enterprise B2B (SOC2 Type II)

**Journey Step 4: Admin Views Audit Logs**
- **Data Collected**: User activity logs, access patterns, system events
- **Applicable Regulations**: SOC2 CC6.6 (audit logging), CC7.2 (incident detection)
- **Technical Implementation**:
  - Database: `audit_logs` table (append-only, immutable), 1-year retention
  - Fields: `user_id`, `action`, `resource_type`, `resource_id`, `changes` (JSON), `ip_address`, `created_at`
  - API: GET `/api/admin/audit-logs?filter=user_id&date_range=30d` with pagination
  - UI: Admin dashboard with filters (user, action, date), export to CSV
  - Monitoring: Alert if audit log write fails (potential tampering)
- **Backlog Story**: SEC-001: Implement SOC2 audit logging with 1-year retention
- **Cost**: $10k-$12k (6-7 days engineering)
- **Timeline**: Growth (Month 6-9, pre-SOC2 audit)

## Regulation Applicability Decision Trees

### GDPR Applicability

```
IF product_strategy.market_geography includes EU/EEA
  AND user_journey collects personal_data (names, emails, IP addresses, etc.)
  THEN GDPR = Required

Priority:
  IF >30% TAM in EU → Required for launch (MVP)
  ELSE IF 10-30% TAM in EU → Competitive advantage (Growth)
  ELSE IF <10% TAM in EU → Future consideration (Scale)
  ELSE → Not applicable
```

**Example**: US-based B2B SaaS with 15% TAM in Germany
- **Result**: GDPR = Growth stage (competitive advantage, not launch blocker)
- **Justification**: Can launch US-only, add GDPR compliance in Month 4-6 to unlock EU market

### HIPAA Applicability

```
IF user_journey handles PHI (Protected Health Information)
  OR customer_segment includes covered_entities (healthcare providers, health plans)
  OR product_marketed_as "healthcare solution"
  THEN HIPAA = Required

PHI Definition:
  - Medical records, diagnoses, treatment information
  - Health insurance information
  - Payment data related to healthcare services
  - Genetic information
  - Biometric data used for health purposes
```

**Example**: Wellness app tracking steps and heart rate (not medical diagnoses)
- **Result**: HIPAA = Not required (wellness data, not PHI)
- **Justification**: Heart rate monitoring is wellness, not diagnosis/treatment; Terms of Service explicitly states "not a medical device"

### SOC2 Applicability

```
IF product_strategy.customer_segment includes enterprise_b2b (>$10K ACV)
  AND (>40% enterprise_deals blocked without SOC2
       OR competitive_analysis shows SOC2 standard_requirement)
  THEN SOC2 = Required/Competitive

Priority:
  IF >50% pipeline requires SOC2 → Required (Growth)
  ELSE IF 20-50% prefer SOC2 → Competitive (Scale)
  ELSE IF <20% mention SOC2 → Future consideration
```

**Example**: B2B SaaS with $25K ACV, 60% of enterprise deals ask for SOC2 report
- **Result**: SOC2 Type II = Required (Growth stage, Month 6-12)
- **Justification**: Blocking majority of enterprise pipeline; ROI = $500k-$1M annual pipeline unlocked

## Cost Estimation Examples (2025 Market Rates)

### Example 1: GDPR Full Implementation (EU B2B SaaS)

**Legal Costs**:
- Privacy Policy with GDPR disclosures: $3,000-$5,000 (legal counsel review)
- Data Processing Agreement (DPA) template: $2,000-$3,000
- Cookie Policy: $1,000-$2,000
- Total Legal: $6,000-$10,000

**Engineering Costs** (Mid-level developer rate: $100k/year ÷ 50 weeks = $2,000/week):
- Consent tracking (3 days): $1,200
- Data export API (5 days): $2,000
- Right to erasure (8 days): $3,200
- Encryption controls (5 days): $2,000
- Breach detection (3 days): $1,200
- Total Engineering: $9,600 (~$10k)

**Ongoing Costs**:
- Data Protection Officer (DPO) part-time: $25,000-$40,000/year (if >5K EU residents)
- Annual GDPR audit (optional): $5,000-$10,000

**Year 1 Total**: $16,000-$20,000 (legal + engineering)
**Year 2+ Total**: $30,000-$50,000/year (DPO + audit)

### Example 2: SOC2 Type II (Enterprise B2B SaaS)

**Pre-Audit Costs (Month 1-6)**:
- Compliance platform (Vanta/Drata): $1,000-$2,000/month × 6 = $6,000-$12,000
- Engineering implementation (4 weeks): $8,000-$10,000
- Policy documentation: $5,000-$10,000 (consultant or internal)
- Initial audit fee: $15,000-$30,000 (auditor selection, kickoff)
- Total Pre-Audit: $34,000-$62,000

**Observation Period (Month 7-12)**:
- Compliance platform: $1,000-$2,000/month × 6 = $6,000-$12,000
- Auditor observation: Included in audit fee
- Total Observation: $6,000-$12,000

**Certification (Month 12)**:
- Final audit report: $10,000-$20,000
- Total Certification: $10,000-$20,000

**Year 1 Total**: $50,000-$94,000
**Year 2+ Recertification**: $10,000-$25,000/year + $12,000-$24,000/year (platform) = $22,000-$49,000/year

**ROI**: Unlocks $500k-$2M enterprise pipeline (assuming 5-10 enterprise deals × $50K-$200K ACV)

### Example 3: Multi-Framework (GDPR + HIPAA + SOC2)

**Control Reuse Strategy**:
- HIPAA encryption requirements → satisfies GDPR Article 32 (security)
- SOC2 audit logging → satisfies HIPAA §164.312(a)(1)
- GDPR consent tracking → partially satisfies HIPAA §164.506 (authorization)
- Result: ~30% cost savings vs. implementing separately

**Year 1 Total**:
- GDPR: $16,000-$20,000
- HIPAA: $60,000-$100,000 (most expensive due to BAA, encryption, audit logging)
- SOC2: $50,000-$94,000
- Control reuse savings: -$25,000-$40,000
- Total Year 1: $101,000-$174,000 (vs $126,000-$214,000 without reuse)

**Year 2+ Total**:
- GDPR DPO: $25,000-$40,000
- HIPAA Security Officer: $60,000-$100,000
- SOC2 recertification: $22,000-$49,000
- Compliance platform: $12,000-$24,000
- Total Year 2+: $119,000-$213,000/year

## Backlog Story Examples

### Example 1: GDPR Consent Tracking (AUTH-001)

**User Story**: As a user, I want to control my data processing consent so that I comply with GDPR requirements

**Journey Traceability**: Serves Step 1 (Signup) - ensures lawful basis for processing per GDPR Article 6

**Acceptance Criteria**:
- [ ] Users can grant/withdraw consent for processing, marketing, analytics separately
- [ ] Consent records stored with timestamp, IP address, user agent, consent text version
- [ ] Consent banner shown on first visit with clear language (no dark patterns)
- [ ] Admin dashboard shows consent status per user
- [ ] Granular consent options (not all-or-nothing)
- [ ] Withdrawal takes effect immediately (no 30-day delay)

**Technical Specifications**:
- **Database** (Session 7):
  ```sql
  CREATE TABLE consent_records (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    consent_type VARCHAR(50) NOT NULL, -- 'processing', 'marketing', 'analytics'
    consent_given_at TIMESTAMP NOT NULL,
    consent_text TEXT NOT NULL, -- versioned for audit
    consent_version INT NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    withdrawn_at TIMESTAMP
  );
  CREATE INDEX idx_consent_user_type ON consent_records(user_id, consent_type);
  ```
- **API** (Session 8):
  - POST `/api/users/consent` - Record consent (body: `{type, given, version}`)
  - PATCH `/api/users/consent/:type` - Update/withdraw consent
  - GET `/api/users/me/consents` - Retrieve consent history
- **UI** (Session 12):
  - Consent banner with separate checkboxes (processing, marketing, analytics)
  - Settings page: "Privacy & Data Controls" with toggle switches
  - Consent history viewer (read-only, for audit)

**RICE Prioritization**:
- **Reach**: High (100% of EU users = 30% of total TAM per strategy)
- **Impact**: High (required for EU launch, blocks €500k revenue)
- **Confidence**: High (clear GDPR Article 6/7 requirement)
- **Effort**: Medium (3 days = 1.5 story points)
- **RICE Score**: (100 × 3 × 100%) / 3 = 100

**Effort**: 3 days
**Dependencies**: Privacy Policy (legal team must provide consent text)
**Compliance Regulations**: GDPR Article 6, Article 7
**Cost**: $1,200 (3 days × $400/day mid-level rate)

### Example 2: HIPAA Audit Logging (SEC-002)

**User Story**: As a system administrator, I want to audit all PHI access so that we meet HIPAA §164.312(a)(1) requirements

**Journey Traceability**: Supports all steps involving PHI (Steps 3, 4, 5) - required for HIPAA Administrative Safeguards

**Acceptance Criteria**:
- [ ] All PHI read/write/delete operations logged automatically (middleware)
- [ ] Audit logs include: user_id, action, resource_type, resource_id, changes (before/after), IP, timestamp
- [ ] Audit logs stored in append-only table (no updates/deletes)
- [ ] 1-year retention minimum (HIPAA requirement)
- [ ] Admin dashboard with filters (user, action, date range, resource type)
- [ ] Export to CSV for auditor review
- [ ] Alert if audit log write fails (potential tampering detection)

**Technical Specifications**:
- **Database** (Session 7):
  ```sql
  CREATE TABLE audit_logs (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id),
    action VARCHAR(50) NOT NULL, -- 'CREATE', 'READ', 'UPDATE', 'DELETE'
    resource_type VARCHAR(50) NOT NULL, -- 'patient', 'document', 'report'
    resource_id UUID NOT NULL,
    changes JSONB, -- {before: {...}, after: {...}}
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
  );
  CREATE INDEX idx_audit_user_date ON audit_logs(user_id, created_at DESC);
  CREATE INDEX idx_audit_resource ON audit_logs(resource_type, resource_id);
  -- Prevent updates/deletes (append-only)
  REVOKE UPDATE, DELETE ON audit_logs FROM app_user;
  ```
- **API** (Session 8):
  - Middleware: `auditLogMiddleware()` wraps all PHI endpoints
  - GET `/api/admin/audit-logs?user_id=&action=&date_from=&date_to=` (paginated)
  - GET `/api/admin/audit-logs/export` (CSV export for auditors)
- **Monitoring** (Session 14):
  - Alert: If audit log write fails (Slack/PagerDuty)
  - Metric: Audit log volume (expect 100-1000/day)
  - Dashboard: Real-time audit log stream for security team

**RICE Prioritization**:
- **Reach**: High (required for HIPAA, blocks 70% of healthcare TAM)
- **Impact**: High (HIPAA violation penalties: $100-$50K per violation)
- **Confidence**: High (clear HIPAA §164.312 requirement)
- **Effort**: High (6 days = 3 story points)
- **RICE Score**: (100 × 3 × 100%) / 6 = 50

**Effort**: 6 days
**Dependencies**: None (foundational security control)
**Compliance Regulations**: HIPAA §164.312(a)(1), §164.308(a)(1)(ii)(D)
**Cost**: $2,400 (6 days × $400/day mid-level rate)

## Monitoring Strategy Examples

### GDPR Compliance Monitoring

**Metrics Dashboard**:
- **Consent opt-in rate**: 96% processing, 42% marketing, 38% analytics (target: >95%, >40%, >35%)
- **Data export requests**: 12/month (0.3% of users) - within normal range
- **Data deletion requests**: 5/month (0.1% of users) - low churn indicator
- **Deletion fulfillment time**: Avg 4.2 hours (target: <24 hours) - excellent

**Alert Thresholds**:
- Data breach: >100 records accessed by single user in <1 hour → Slack alert to security team
- Failed exports: >10 export requests fail in 24 hours → Engineering on-call
- Consent opt-in drop: <90% processing consent → Product team review (possible UI issue)

**Audit Cadence**:
- Weekly: Review consent trends (automated Slack report)
- Monthly: Review export/deletion volume (automated email to compliance team)
- Quarterly: Manual audit of consent logs (sample 50 records, verify timestamp/IP/user-agent)
- Annually: Full GDPR audit (external auditor reviews all data processing activities)

### HIPAA Compliance Monitoring

**Metrics Dashboard**:
- **Failed login attempts**: 23 yesterday (0.5% of logins) - normal
- **PHI access volume**: Avg 250 records/user/day - within expected range
- **Encryption status**: 100% PHI fields encrypted (target: 100%)
- **Backup status**: Last backup 6 hours ago (target: <24 hours)

**Alert Thresholds**:
- Brute force: >10 failed logins for single user in 5 minutes → Lock account, alert security
- Bulk access: Single user accesses >1,000 PHI records in 1 hour → Alert security team (potential breach)
- Encryption failure: Any PHI field fails encryption check → Page on-call engineer (P0 incident)
- Backup failure: Backup >24 hours old → Alert DevOps team

**Incident Response Runbook**:
1. **Suspected breach** (bulk access alert triggered):
   - Immediately lock user account
   - Review audit logs for accessed records
   - Contact HIPAA Security Officer
   - Document incident (who, what, when, how many records)
   - If confirmed breach: Notify affected patients within 60 days (HIPAA §164.404)
2. **Encryption failure**:
   - Investigate root cause (key rotation issue? Database misconfiguration?)
   - Quarantine affected records
   - Re-encrypt or delete unencrypted data
   - Post-mortem: Update encryption checks

**Audit Cadence**:
- Daily: Automated review of failed logins, unusual access patterns (security dashboard)
- Weekly: Manual review of top PHI accessors (ensure legitimate use)
- Monthly: Audit log sampling (50 records, verify completeness)
- Annually: HIPAA Security Risk Assessment (required by §164.308(a)(1)) - external consultant $5k-$10k

### SOC2 Compliance Monitoring

**Metrics Dashboard** (Trust Services Criteria):
- **System uptime** (CC7.1): 99.97% this month (target: 99.9%)
- **Incident response time** (CC7.2): Avg 18 min ack, 3.2 hours resolve (target: <1h ack, <24h resolve)
- **Change success rate** (CC8.1): 97% deployments without rollback (target: >95%)
- **Vulnerability remediation** (CC9.1): Avg 4.1 days for critical (target: <7 days)

**Alert Thresholds**:
- Service outage: Uptime <99.5% in any 7-day period → Page on-call, escalate to CTO
- Critical CVE: Dependabot alert for critical vulnerability → Slack security channel, 48-hour SLA
- Unauthorized access: User accesses resource outside their role → Lock account, alert security team
- Change rollback: Production deployment rolled back → Incident post-mortem required

**Evidence Collection** (For SOC2 Audit):
- **CC6.6 (Audit Logging)**: Export 90 days of audit logs, demonstrate 1-year retention policy
- **CC7.2 (Incident Management)**: Export incident logs, show avg response time <1h acknowledge
- **CC8.1 (Change Management)**: Export deployment logs, show rollback rate <5%
- **CC9.1 (Vulnerability Management)**: Export Dependabot/Snyk reports, show critical remediation <7 days

**Audit Cadence**:
- Weekly: Review incident logs, uptime, change success rate (automated Slack report)
- Monthly: Export evidence for auditor (audit logs, incident logs, change logs)
- Quarterly: Internal control testing (simulate incident, verify response)
- Annually: SOC2 Type II audit (6-month observation period, auditor validates controls)

## Control Reuse Mapping Examples

### Example 1: HIPAA → GDPR Reuse

| HIPAA Control | HIPAA Requirement | GDPR Equivalent | Reuse Strategy |
|---------------|-------------------|-----------------|----------------|
| §164.312(a)(2)(iv) Encryption | PHI encrypted at rest | Article 32 (Security of Processing) | Same encryption implementation (AES-256) satisfies both |
| §164.312(e)(2) Transmission Security | PHI encrypted in transit (TLS 1.3) | Article 32 (Security of Processing) | HTTPS enforcement satisfies both |
| §164.312(a)(1) Audit Controls | Log all PHI access | Article 30 (Records of Processing Activities) | Audit logs satisfy both (HIPAA needs PHI-specific, GDPR needs all processing) |

**Savings**: ~20% engineering cost reduction (e.g., $8k HIPAA encryption + $6k GDPR encryption = $14k total, but with reuse = $10k)

### Example 2: SOC2 → ISO 27001 Reuse

| SOC2 Control | SOC2 TSC | ISO 27001 Control | Reuse Strategy |
|--------------|----------|-------------------|----------------|
| Access Controls | CC6.1, CC6.2 | A.9.2 (User Access Management) | RBAC system satisfies both |
| Audit Logging | CC6.6 | A.12.4 (Logging and Monitoring) | Same audit logs satisfy both |
| Incident Management | CC7.2 | A.16.1 (Management of Incidents) | Same incident response process satisfies both |
| Change Management | CC8.1 | A.12.1 (Operational Procedures) | Same CI/CD pipeline satisfies both |

**Savings**: ~40% audit cost reduction (SOC2 audit: $15k-$30k, ISO 27001 audit: $20k-$40k, but auditor can leverage SOC2 evidence = $25k-$50k total vs $35k-$70k separate)

---

**Usage Instructions for Sub-Agents**:
- Reference specific sections by heading (e.g., "See /examples/compliance-examples.md Section 'GDPR Applicability'")
- Copy cost calculation formulas for consistency (e.g., "Mid-level rate: $2,000/week")
- Use journey-to-compliance mapping pattern for traceability
- Adapt examples to user's specific journey (don't copy verbatim)
