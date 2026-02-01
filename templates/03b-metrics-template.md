# Success Metrics: [Your Product Name]

> **Derived from**: product-guidelines/03a-mission.md (North Star = mission outcome quantified)

---

## Metrics Framework Selection

**Framework Chosen**: [AARRR / HEART / North Star]

**Rationale**: [Why this framework fits your product stage, journey, and goals]
- AARRR: Early-stage startup with clear growth funnel
- HEART: Established product focused on UX quality
- North Star: Single metric represents core value, clear aha moment

---

## North Star Metric (L0)

**Metric**: [Name of single most important metric]

**Definition**: [Exact calculation]

**Why This**: [Connection to mission outcome and user value - must reference journey Step 3]

**Current**: [Current value]
**Target**: [Goal] by [date]

---

## Metric Tree (Hierarchical Decomposition)

### L1 - Direct Drivers (3-5 metrics that mathematically compose North Star)

**Formula**: `North Star = [L1 Metric 1] × [L1 Metric 2] × [L1 Metric 3]`

#### L1.1: [Driver Name] (e.g., New Active Users)
**Definition**: [How it's measured]
**Current**: [Current value]
**Target**: [Goal]
**Owner**: [Team responsible - e.g., Growth Team]

#### L1.2: [Driver Name] (e.g., Completion Rate)
**Definition**: [How it's measured]
**Current**: [Current value]
**Target**: [Goal]
**Owner**: [Team responsible - e.g., Product Team]

#### L1.3: [Driver Name] (e.g., Retention Rate)
**Definition**: [How it's measured]
**Current**: [Current value]
**Target**: [Goal]
**Owner**: [Team responsible - e.g., Product Team]

---

### L2 - Driver Metrics (Team-level actions per L1)

**For L1.1 [Driver Name]:**
- **L2.1.1**: [Metric name] (Owner: [Team])
  - Definition: [How measured]
  - Target: [Goal]
  - Type: [Leading/Lagging]

- **L2.1.2**: [Metric name] (Owner: [Team])
  - Definition: [How measured]
  - Target: [Goal]
  - Type: [Leading/Lagging]

**For L1.2 [Driver Name]:**
- **L2.2.1**: [Metric name] (Owner: [Team])
  - Definition: [How measured]
  - Target: [Goal]
  - Type: [Leading/Lagging]

---

### L3 - Granular Metrics (Daily operational metrics per team)

**For L2.1.1 [Metric Name]:**
- **L3.1.1.1**: [Granular metric] - [How measured]
- **L3.1.1.2**: [Granular metric] - [How measured]

**For L2.2.1 [Metric Name]:**
- **L3.2.1.1**: [Granular metric] - [How measured]
- **L3.2.1.2**: [Granular metric] - [How measured]

---

## Metric Tree Validation

**MECE Check** (Mutually Exclusive, Collectively Exhaustive):
- [ ] No overlap between metrics (each measures distinct driver)
- [ ] Full coverage of North Star drivers (nothing missing)

**Influence Relationships**:
- L3 → L2: [Example: Higher tutorial completion rate (L3) increases onboarding completion rate (L2)]
- L2 → L1: [Example: Higher onboarding completion rate (L2) increases assessment completion rate (L1)]
- L1 → L0: [Mathematical formula: North Star = L1.1 × L1.2 × L1.3]

*Replace bracketed examples with your product's actual metric relationships*

**Team Ownership Matrix**:
| Metric Level | Metric | Owner Team | Update Frequency |
|--------------|--------|------------|------------------|
| L1.1 | [Metric] | [Team] | Daily |
| L2.1.1 | [Metric] | [Team] | Daily |
| L3.1.1.1 | [Metric] | [Team] | Real-time |

**Leading vs Lagging**:
- Leading indicators (60%+ required): [List metrics that are predictive and actionable daily]
- Lagging indicators: [List metrics that are reactive and slower-moving]

**Controllability Check**:
- [ ] All L2/L3 metrics can be influenced by teams through daily actions
- [ ] All L2/L3 metrics update frequently enough for feedback loops (daily/weekly)
- [ ] Clear ownership assigned for every metric

---

## Health Metrics (Guardrails)

### Engagement Health
- **Weekly Active Users**: [Current] (target: >[X])
- **Sessions per User**: [Current] per week (target: >[Y])

### Retention Health
- **D7 Retention**: [Current]% (target: >[X]%)
- **D30 Retention**: [Current]% (target: >[Y]%)

### Product Health
- **Error Rate**: [Current]% (target: <[X]%)
- **NPS**: [Current] (target: >[Y])

---

## Counter-Metrics (Will Not Sacrifice)

**Rule**: Minimum 2 counter-metrics required to prevent gaming

We will NOT improve [North Star] by degrading:

### 1. [Counter-Metric Name]
**Definition**: [What it measures]
**Threshold**: Must stay above/below [X]
**Why Protected**: [Reason - must reference quality dimension or user experience]

### 2. [Counter-Metric Name]
**Definition**: [What it measures]
**Threshold**: Must stay above/below [X]
**Why Protected**: [Reason - must reference quality dimension or user experience]

**Examples**:
- Won't improve assessment speed by reducing accuracy → Counter-metric: Assessment accuracy rate (maintain >95%)
- Won't boost signups by degrading UX → Counter-metric: NPS (maintain >40), Support ticket rate (maintain <5%)

---

**Connection to Journey**:
- [Metric] measures [Journey Step X]
- [Metric] measures [Journey Step Y]

**Connection to Monetization**:
- North Star growth drives revenue because [reason]
