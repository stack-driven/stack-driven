# Analytics Implementation Strategy: [Your Product Name]

> **Derived from**: product-guidelines/00-user-journey.md + product-guidelines/03b-metrics.md

---

## Event Taxonomy

### Naming Conventions (Enforce Strictly)

**Casing**: snake_case (all lowercase with underscores)
**Tense**: Past tense (action already occurred)
**Syntax**: `[object]_[past_tense_verb]`

**Examples**:
- ✅ Good: `document_uploaded`, `user_signed_up`, `assessment_completed`
- ❌ Bad (wrong casing): `DocumentUploaded`, `signUp`
- ❌ Bad (wrong tense): `sign_up`, `assessment_complete`, `upload_document`

**Properties vs Separate Events**:
- ✅ Use event properties for context: `feature_used` with `feature_name` property
- ❌ Don't create event explosion: `ai_assessment_used`, `manual_assessment_used`

---

## Core Events (Mapped to Journey + North Star)

### Journey Step 1: [Step Name]
| Event Name | Description | Properties | Frequency |
|------------|-------------|------------|-----------|
| `page_viewed` | User lands on marketing site | `page_url`, `referrer`, `utm_source` | High |
| `signup_started` | User begins registration | `signup_method` (email/google/github) | Medium |
| `user_signed_up` | Registration complete | `user_id`, `signup_method`, `plan_tier` | Medium |

### Journey Step 2: [Step Name]
| Event Name | Description | Properties | Frequency |
|------------|-------------|------------|-----------|
| `[object]_[action]` | [What happened] | `property1`, `property2` | [High/Medium/Low] |

### Journey Step 3: [Step Name] - **North Star Event**
| Event Name | Description | Properties | Frequency |
|------------|-------------|------------|-----------|
| `[north_star_event]` | [Aha moment action] | `property1`, `property2` | [Target frequency] |

### Journey Step 4: [Step Name]
| Event Name | Description | Properties | Frequency |
|------------|-------------|------------|-----------|
| `[object]_[action]` | [What happened] | `property1`, `property2` | [High/Medium/Low] |

**Total Events**: [Count] core events (avoid event explosion - aim for <30 events)

---

## User Identification Strategy

### Anonymous Tracking (Pre-Signup)
- **anonymous_id**: Generated on first visit (UUID v4)
- **Persistence**: LocalStorage (web) / Keychain (mobile)
- **Lifespan**: Permanent until cleared

### Identified Tracking (Post-Signup)
- **user_id**: Assigned on signup/login (database primary key)
- **Properties**: `email` (hashed), `plan_tier`, `created_at`, `company_id`

### Identity Stitching (Anonymous → Identified)
When user signs up:
1. Call `analytics.identify(user_id, { email_hash, plan_tier })`
2. Merge `anonymous_id` events with `user_id` in analytics tool
3. Preserve full user journey from first visit → conversion

**Example Flow**:
```
Visit 1: anonymous_id=abc123 → page_viewed
Visit 2: anonymous_id=abc123 → signup_started
Visit 2: anonymous_id=abc123 + user_id=456 → user_signed_up [STITCH POINT]
Visit 3: user_id=456 → [north_star_event]
```

---

## Session Tracking

### Session Definition

**Web Application**:
- **Timeout**: 30-minute inactivity
- **Max session**: 24 hours (prevent tab pollution)
- **New session triggers**: 30min+ gap, new day (midnight UTC), campaign parameter change

**Mobile Application**:
- **Timeout**: 5-minute background
- **Max session**: 24 hours
- **New session triggers**: 5min+ background, new day

### Session Properties
| Property | Description | Example |
|----------|-------------|---------|
| `session_id` | Unique session identifier | UUID v4 |
| `session_start` | Timestamp of first event | `2025-02-01T10:00:00Z` |
| `session_referrer` | Where session originated | `google.com`, `direct`, `newsletter` |
| `utm_source` | Campaign source (if applicable) | `google`, `facebook`, `email` |

---

## Analytics Tool Recommendation

### Decision Tree

**PostHog** if:
- Engineering-led team (developers drive product decisions)
- Need session replay + feature flags + A/B testing (all-in-one)
- Budget: <$50k ARR (generous free tier)
- Self-hosted option desired (data sovereignty)

**Mixpanel** if:
- Product-led growth focus
- Non-technical PMs need self-service analytics
- Advanced funnel analysis and cohort retention critical
- Budget: $50k-$500k ARR

**Amplitude** if:
- Enterprise scale (millions of events/month)
- Complex behavioral segmentation (multi-step funnels, predictive analytics)
- Executive dashboards and stakeholder reporting needed
- Budget: $500k+ ARR

**Matomo** if:
- Healthcare, Finance, or EU-based (GDPR/HIPAA strict compliance)
- Absolute data privacy required (no third-party data sharing)
- Self-hosted mandatory
- Budget: Variable (open-source or cloud)

### Selected Tool

**Tool**: [PostHog / Mixpanel / Amplitude / Matomo]

**Rationale**: [Why this tool fits your team, tech stack, budget, and privacy requirements]

**Implementation**:
- SDK: [Language/framework-specific SDK - e.g., `posthog-js`, `mixpanel-python`]
- Server-side tracking: [Yes/No - if yes, for which events?]
- Client-side tracking: [Yes/No - for which events?]

---

## Privacy & Compliance

### GDPR Compliance (EU Visitors)

**Consent Requirement**:
- [ ] Opt-in required BEFORE tracking (no cookies/localStorage until consent)
- [ ] Cookie banner with "Accept" / "Reject" options
- [ ] Granular consent: Analytics separate from marketing cookies

**Implementation**:
```javascript
if (userLocation === 'EU' && !hasConsent) {
  // Show cookie banner, wait for consent
  // Do NOT initialize analytics SDK
}
if (consentGiven) {
  analytics.init(API_KEY);
}
```

### IP Anonymization

**Strategy**: Mask last octet of IP address

**Example**:
- Original: `192.168.1.100`
- Anonymized: `192.168.1.XXX` (or `192.168.1.0`)

**Implementation**: Enable in analytics tool settings (PostHog: `ip_anonymization: true`)

### PII Handling

**Rules**:
- [ ] Hash emails with salt before sending to analytics (SHA-256)
- [ ] NEVER log passwords, credit cards, SSNs
- [ ] Strip PII from URLs (e.g., `/users/email@example.com` → `/users/:id`)
- [ ] Sanitize form field values (track `form_submitted` not field content)

**Email Hashing Example**:
```javascript
const emailHash = sha256(email + SALT);
analytics.identify(userId, { email_hash: emailHash });
```

### Data Retention Policy

**Retention Period**: [30 days / 90 days / 365 days / 2 years]

**Rationale**: [Why this period - balance compliance with analytics needs]

**Deletion Process**:
- Automated: Analytics tool deletes events older than retention period
- Manual: User requests data deletion via GDPR request (respond within 30 days)

---

## Validation Checklist

### Event Taxonomy
- [ ] All events use snake_case naming
- [ ] All events use past tense
- [ ] Event count <30 (avoid explosion)
- [ ] Properties defined for context (not separate events)

### Journey Mapping
- [ ] Core events mapped to every journey step
- [ ] North Star event identified and tracked
- [ ] Event frequency estimates provided

### User Identification
- [ ] Anonymous ID strategy defined
- [ ] User ID strategy defined
- [ ] Identity stitching process documented

### Session Tracking
- [ ] Session timeout rules defined (web vs mobile)
- [ ] Session properties specified

### Tool Selection
- [ ] Analytics tool selected with clear rationale
- [ ] Tool matches team capabilities and budget
- [ ] SDK implementation plan documented

### Privacy Compliance
- [ ] GDPR consent strategy (if EU traffic)
- [ ] IP anonymization enabled
- [ ] PII handling rules defined (hash emails, no passwords)
- [ ] Data retention policy specified

---

**Connection to Metrics**:
- North Star event `[event_name]` measures `[North Star metric]`
- L1 driver events: `[event_1]`, `[event_2]`, `[event_3]`

**Connection to Journey**:
- Events track all 4 journey steps from visit → aha moment
- Session tracking captures full user path to conversion
