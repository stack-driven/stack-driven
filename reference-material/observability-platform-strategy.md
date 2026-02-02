# Observability Platform Strategy for AI Systems

**Purpose**: This reference guide consolidates observability platform guidance for AI systems, coordinating Session 3c (AI integration), Session 13 (deployment), and Session 14 (observability strategy).

**Cross-Session Coordination**:
- **Session 3c** (AI integration): Selects AI-specific observability platform (Helicone, Langfuse, LangSmith, Datadog LLM)
- **Session 13** (deployment): Defines infrastructure monitoring (APM, logs, traces)
- **Session 14** (observability): Unifies AI + infrastructure metrics, defines SLOs, incident response

**Last Updated**: 2025-02-02
**Related Issues**: #152 (Session 3c enhancement), #154 (Session 14 enhancement), #155 (Session 13 enhancement)

---

## Platform Comparison Matrix

| Platform | Best For | Free Tier | Paid Pricing | Integration Effort | Key Strengths | Best Use Cases |
|----------|----------|-----------|--------------|-------------------|---------------|----------------|
| **Helicone** | Quick setup, cost tracking | 10K requests/month | $20/month (100K requests) | 1 line of code | Fastest setup, semantic caching built-in, real-time cost tracking | MVPs, cost-conscious teams, simple observability needs |
| **Langfuse** | Open-source, full-featured | 50K events/month | Self-host (free) or Cloud ($50/month) | SDK integration (moderate) | Prompt versioning, user feedback, detailed traces, self-host option | Prompt engineering workflows, teams needing audit trails, data sovereignty requirements |
| **LangSmith** | LangChain users | None (paid only) | $39/user/month | Automatic (if using LangChain) | Seamless LangChain integration, automated evaluations, dataset versioning | LangChain-based applications, complex agent workflows, teams with >$200/month budget |
| **Datadog LLM** | Existing Datadog customers | None (consumption-based) | ~$0.65 per 1M tokens observed | APM integration (moderate) | Unified APM + LLM, mature alerting, enterprise features (RBAC, audit logs) | Enterprises already on Datadog, teams >10 engineers, unified monitoring requirements |

---

## Decision Tree

```
START: Choosing AI Observability Platform

Q1: Are you already using Datadog for application monitoring?
├─ YES → Consider Datadog LLM Observability
│   └─ Q1a: Is your team >10 engineers AND budget >$500/month?
│       ├─ YES → **Datadog LLM** (unified monitoring, enterprise features)
│       └─ NO → Consider Langfuse or Helicone (Datadog LLM may be too expensive)
│
└─ NO → Continue to Q2

Q2: Are you using LangChain or building agentic workflows?
├─ YES → Consider LangSmith
│   └─ Q2a: Is your observability budget >$200/month (5+ engineers × $39/user)?
│       ├─ YES → **LangSmith** (seamless LangChain integration, automated evals)
│       └─ NO → Consider Langfuse (open-source, LangChain compatible)
│
└─ NO → Continue to Q3

Q3: Do you need self-hosting OR detailed prompt versioning/tracking?
├─ YES → **Langfuse** (open-source, self-host option, best prompt management)
│
└─ NO → Continue to Q4

Q4: Are you in MVP stage OR need quick setup?
├─ YES → **Helicone** (1-line integration, fastest setup, generous free tier)
│
└─ NO → Evaluate between Helicone and Langfuse based on feature needs

Q5: Do you have complex debugging needs (detailed traces, user feedback)?
├─ YES → **Langfuse** (50K events/month free, full-featured)
│
└─ NO → **Helicone** (simpler, faster, cost-focused)

RECOMMENDATION COMPLETE
```

---

## Platform Deep Dives

### Helicone

#### When to Choose

**Ideal For**:
- ✅ MVPs needing observability in <1 hour
- ✅ Cost-conscious teams (generous free tier, then $20/month)
- ✅ Simple use cases (classification, generation) without complex debugging needs
- ✅ Teams prioritizing cost tracking over detailed traces

**Not Ideal For**:
- ❌ Complex prompt engineering workflows (limited prompt versioning UI)
- ❌ Detailed trace debugging (less granular than Langfuse/LangSmith)
- ❌ User feedback collection (no built-in thumbs up/down)

#### Key Features

1. **Fastest Setup** (1 line of code):
   ```python
   import openai
   openai.api_base = "https://oai.hconeai.com/v1"
   openai.default_headers = {"Helicone-Auth": f"Bearer {HELICONE_API_KEY}"}
   # All requests automatically logged
   ```

2. **Built-in Semantic Caching**:
   - No separate implementation needed
   - 67-73% cost reduction typical
   - Configure similarity threshold in dashboard

3. **Real-Time Cost Tracking**:
   - Cost per user, per model, per feature
   - Aggregate dashboards for stakeholders
   - Budget alerts (email/Slack)

4. **Pricing**:
   - Free: 10K requests/month
   - Paid: $20/month for 100K requests
   - No per-user fees (team-friendly)

#### Coordination with Session 14

**Session 3c provides to Session 14**:
- Platform: Helicone
- Key metrics: Cost per request, latency P50/P95, request volume
- Cost alerting thresholds: Daily budget × 1.2

**Session 14 integrates**:
- Helicone cost data with business metrics (revenue per user, conversion rate)
- Helicone latency with infrastructure metrics (database query time, API latency)
- Unified dashboard: AI costs + application health

---

### Langfuse

#### When to Choose

**Ideal For**:
- ✅ Prompt engineering workflows (A/B testing prompts, versioning)
- ✅ User feedback loops (thumbs up/down, ratings)
- ✅ Detailed trace debugging (see every LLM call in chain)
- ✅ Data sovereignty requirements (self-host option)
- ✅ Budget-conscious with complex needs (50K events/month free)

**Not Ideal For**:
- ❌ Need <1 hour setup (requires SDK integration, more complex)
- ❌ Very simple use cases (Helicone is faster for basic needs)

#### Key Features

1. **Prompt Versioning & Management**:
   - Store prompts with semantic versioning (v1.0, v1.1, v1.2)
   - Track prompt → performance metrics
   - A/B test prompts (50% control, 50% treatment)
   - Roll back to previous prompt versions

2. **Detailed Trace Debugging**:
   - See every LLM call in chain (RAG retrieval → generation → reranking)
   - Inspect inputs, outputs, latency per step
   - Identify bottlenecks (slow retrieval vs slow generation)

3. **User Feedback Collection**:
   - Thumbs up/down, 1-5 star ratings
   - Link feedback to specific prompts/traces
   - Analyze: Which prompts get thumbs down? Why?

4. **Self-Hosting**:
   - Open-source (free to self-host)
   - PostgreSQL + Redis backend
   - Full control over data (GDPR/HIPAA compliance)

5. **Pricing**:
   - Free: 50K events/month (cloud)
   - Paid: $50/month for 500K events (cloud)
   - Self-host: $0 (infrastructure costs only)

#### Setup Example

```python
from langfuse import Langfuse
langfuse = Langfuse(
    public_key=os.getenv("LANGFUSE_PUBLIC_KEY"),
    secret_key=os.getenv("LANGFUSE_SECRET_KEY")
)

# Trace a generation
trace = langfuse.trace(name="support_ticket_classification")
generation = trace.generation(
    name="classify",
    model="gpt-4o-mini",
    input=user_query,
    output=classification_result,
    metadata={"prompt_version": "v1.3"}
)

# Collect user feedback
langfuse.score(
    trace_id=trace.id,
    name="user_feedback",
    value=1  # thumbs up
)
```

#### Coordination with Session 14

**Session 3c provides to Session 14**:
- Platform: Langfuse
- Key metrics: Prompt version → accuracy, user feedback (thumbs up rate), trace latency
- Feedback integration: Link user satisfaction to business outcomes

**Session 14 integrates**:
- Langfuse feedback data with product analytics (Mixpanel, Amplitude)
- Track: Users who thumbs down AI features → churn rate correlation
- SLO: >70% thumbs up rate for AI features

---

### LangSmith

#### When to Choose

**Ideal For**:
- ✅ Teams already using LangChain (zero extra code)
- ✅ Complex agent workflows needing detailed debugging
- ✅ Automated evaluation pipelines (run tests on every prompt change)
- ✅ Dataset versioning (track eval sets over time)
- ✅ Budget >$200/month for observability (5+ engineers)

**Not Ideal For**:
- ❌ Non-LangChain users (less value without LangChain)
- ❌ Budget <$200/month (no free tier)
- ❌ Simple use cases (overkill for basic classification)

#### Key Features

1. **Seamless LangChain Integration**:
   ```bash
   export LANGCHAIN_TRACING_V2=true
   export LANGCHAIN_API_KEY=<your-key>
   # All LangChain calls automatically traced (zero code changes)
   ```

2. **Automated Evaluations**:
   - Run eval sets on every prompt change
   - Compare prompt versions side-by-side
   - Block deployment if accuracy <threshold

3. **Dataset Versioning**:
   - Track eval sets over time (v1, v2, v3)
   - Know which eval set was used for each model version
   - Reproduce historical evaluations

4. **Agent Debugging**:
   - See agent reasoning steps
   - Inspect tool calls and results
   - Identify where agents go off-track

5. **Pricing**:
   - $39/user/month (no free tier)
   - Minimum: $195/month (5-user team)

#### Coordination with Session 14

**Session 3c provides to Session 14**:
- Platform: LangSmith
- Key metrics: Agent success rate, tool call latency, evaluation accuracy
- Automated alerts: Accuracy drops >5% on eval set

**Session 14 integrates**:
- LangSmith eval accuracy with deployment pipeline (block deploy if accuracy <threshold)
- Agent success rate with business KPIs (task completion rate)

---

### Datadog LLM Observability

#### When to Choose

**Ideal For**:
- ✅ Enterprises already on Datadog (unified monitoring)
- ✅ Teams >10 engineers needing centralized observability
- ✅ Regulated industries (audit logs, RBAC, compliance features)
- ✅ Correlate LLM performance with infrastructure health

**Not Ideal For**:
- ❌ MVPs or small teams (<5 engineers) - too expensive
- ❌ Not using Datadog for application monitoring - overhead not justified

#### Key Features

1. **Unified APM + LLM**:
   - Single pane of glass (application + AI metrics)
   - Correlate: LLM latency spike → database slowdown
   - Trace requests end-to-end (HTTP → LLM → database)

2. **Mature Alerting**:
   - PagerDuty, Slack, OpsGenie integrations
   - Anomaly detection (ML-based alerts)
   - Escalation policies (alert engineer → manager → on-call)

3. **Enterprise Features**:
   - RBAC (role-based access control)
   - Audit logs (who viewed what, when)
   - Multi-team support (isolate metrics per team)
   - SOC2 compliance (Datadog is SOC2 certified)

4. **Pricing**:
   - Consumption-based: ~$0.65 per 1M tokens observed
   - Example: 100M tokens/month = $65/month (on top of base Datadog costs)
   - No per-user fees (team-friendly)

#### Setup Example

```python
from ddtrace import tracer
from ddtrace.llmobs import LLMObs

# Initialize LLM observability
LLMObs.enable(
    ml_app="support-ticket-classifier",
    agentless_enabled=True,
    api_key=os.getenv("DD_API_KEY")
)

# Trace LLM call
with tracer.trace("classify_ticket", service="ai") as span:
    span.set_tag("llm.model", "gpt-4o-mini")
    response = openai.ChatCompletion.create(...)
    span.set_tag("llm.tokens", response.usage.total_tokens)
```

#### Coordination with Session 14

**Session 3c provides to Session 14**:
- Platform: Datadog LLM
- Key metrics: LLM latency, tokens, cost, error rate
- Correlation: LLM errors → downstream application errors

**Session 14 integrates**:
- Datadog LLM with existing Datadog APM
- Create unified dashboards: AI health + app health + infrastructure health
- Define SLOs: 99% uptime for AI-powered features

---

## Multi-Platform Strategy (Advanced)

For large-scale systems, consider using multiple platforms:

### Example: Helicone (Cost) + Langfuse (Quality)

**Use Case**: High-volume production system needing both cost tracking and detailed quality insights

**Setup**:
- **Helicone**: Cost tracking, semantic caching, budget alerts (all requests)
- **Langfuse**: Detailed traces, user feedback, prompt versioning (sample 10% of requests)

**Benefits**:
- Helicone tracks 100% for cost (lightweight overhead)
- Langfuse provides deep insights on 10% sample (detailed traces)
- Combined: Cost efficiency + quality visibility

**Cost**: Helicone ($20/month) + Langfuse ($50/month) = $70/month

---

## Metrics Framework by Platform

### Helicone Metrics

**Primary Focus**: Cost & Volume

- **Cost per Request**: $ spent per API call
- **Cost per User**: Aggregate by user_id tag
- **Cost per Feature**: Aggregate by feature_id tag
- **Request Volume**: Requests/day, requests/hour
- **Model Distribution**: % requests per model (if routing)
- **Cache Hit Rate**: % requests served from semantic cache

**Alerting**:
- Cost spike: Daily cost >120% of 7-day average
- Volume spike: Request volume >150% of 7-day average

---

### Langfuse Metrics

**Primary Focus**: Quality & User Feedback

- **Prompt Version → Accuracy**: Track quality per prompt version
- **User Feedback Rate**: Thumbs up/down, ratings
- **Trace Latency**: P50/P95/P99 per trace component (retrieval, generation, reranking)
- **User Satisfaction Trends**: Thumbs up rate over time
- **Prompt Performance**: Compare v1.2 vs v1.3 accuracy

**Alerting**:
- Quality degradation: Thumbs down rate >30%
- Prompt regression: New prompt version accuracy <95% of baseline

---

### LangSmith Metrics

**Primary Focus**: Agent Performance & Evaluations

- **Agent Success Rate**: % of tasks completed successfully
- **Tool Call Latency**: Time per tool invocation
- **Evaluation Accuracy**: % passing eval set
- **Dataset Drift**: Are eval examples still representative?
- **Prompt Comparison**: Side-by-side accuracy of variants

**Alerting**:
- Agent failure: Success rate <80%
- Eval regression: Accuracy drops >5% on eval set

---

### Datadog LLM Metrics

**Primary Focus**: Unified Observability & Correlation

- **End-to-End Latency**: HTTP request → LLM → database → response
- **Error Correlation**: LLM errors → application errors
- **Resource Utilization**: LLM calls → CPU/memory impact
- **Cost vs Performance**: $ per request vs latency trade-offs
- **Business Metrics Integration**: LLM cost vs revenue per user

**Alerting**:
- Service degradation: LLM P95 latency >5s correlates with app P95 >10s
- Cost anomaly: LLM cost per user >3x average

---

## Coordination with Session 13 (Deployment) & Session 14 (Observability)

### Session 3c Responsibilities

**What Session 3c Defines**:
- AI observability platform choice (Helicone/Langfuse/LangSmith/Datadog LLM)
- AI-specific metrics to track (latency, tokens, cost, quality)
- Cost alerting thresholds (budget-based)
- Streaming performance targets (if applicable)

**Output to Session 14**:
- Platform name: "Helicone"
- Key metrics: "P50/P95 latency, cost per request, cache hit rate"
- Thresholds: "Alert if daily cost >$50"

---

### Session 13 Responsibilities (Deployment)

**What Session 13 Defines**:
- Infrastructure monitoring (APM, logs, traces)
- Deployment environments (dev, staging, prod)
- CI/CD pipeline integration
- Infrastructure alerting (CPU, memory, disk)

**Example**: Datadog APM for application monitoring, AWS CloudWatch for infrastructure

---

### Session 14 Responsibilities (Observability)

**What Session 14 Defines**:
- **Unified Dashboards**: Integrate AI metrics (Session 3c) + infrastructure metrics (Session 13)
- **SLOs (Service Level Objectives)**: Define uptime, latency, error rate targets for AI features
- **Incident Response**: Runbooks for AI-specific incidents (cost spike, quality degradation, latency issues)
- **Alerting Workflows**: PagerDuty, Slack, OpsGenie integrations
- **Business Metrics Correlation**: Link AI performance to business KPIs (conversion, revenue, churn)

**Example Session 14 Output**:

```markdown
## Unified Observability Dashboard

**AI Metrics** (from Session 3c - Helicone):
- Cost per day: $25 (target: <$50)
- P95 latency: 2.1s (target: <5s)
- Cache hit rate: 68% (target: >60%)

**Infrastructure Metrics** (from Session 13 - Datadog APM):
- API response time: 150ms (target: <500ms)
- Database query time: 80ms (target: <200ms)
- Error rate: 0.3% (target: <1%)

**Business Metrics**:
- Conversion rate (AI users): 12% (vs 8% non-AI users)
- Revenue per user (AI users): $45 (vs $30 non-AI users)

## SLOs

**AI Feature Uptime**: 99.5% (downtime budget: 3.6 hours/month)
**AI Feature Latency**: P95 <5s (95% of requests complete within 5 seconds)
**AI Feature Quality**: >70% thumbs up rate (user satisfaction)

## Incident Response

**Cost Spike** (daily cost >$100):
1. Check Helicone dashboard for volume spike or routing issue
2. Validate no bot traffic (check user_agent logs)
3. If legitimate traffic, trigger rate limiting
4. Escalate to engineering lead if unresolved in 1 hour

**Quality Degradation** (thumbs down >40%):
1. Check Langfuse for recent prompt changes
2. Compare current prompt version accuracy vs baseline
3. Roll back to previous prompt version if accuracy dropped >5%
4. Escalate to ML team if issue persists
```

---

## Free Tier Analysis (MVP Stage)

**For teams in MVP stage with <$100/month budget**:

| Platform | Free Tier Limit | Suitable For | Cost When Exceed Free Tier |
|----------|-----------------|--------------|---------------------------|
| **Helicone** | 10K requests/month | 330 requests/day | $20/month for 100K (3,300/day) |
| **Langfuse** | 50K events/month | 1,660 events/day | $50/month for 500K (16,660/day) |
| **LangSmith** | None | N/A | $39/user/month (no free option) |
| **Datadog LLM** | None | N/A | Consumption-based (~$65 for 100M tokens) |

**Recommendation for MVPs**:
- Start with **Langfuse** if need detailed prompt tracking/debugging (best free tier: 50K events)
- Start with **Helicone** if prioritize cost tracking and fastest setup (10K requests sufficient for initial testing)
- Avoid LangSmith and Datadog LLM in MVP stage (no free tier, too expensive)

---

## Summary Decision Matrix

| Your Situation | Recommended Platform | Rationale |
|----------------|---------------------|-----------|
| MVP, need setup in <1 hour | **Helicone** | 1-line integration, generous free tier |
| MVP, need detailed traces | **Langfuse** | Best free tier (50K events), full-featured |
| Using LangChain | **LangSmith** | Seamless integration, automated evals |
| Already on Datadog | **Datadog LLM** | Unified monitoring (APM + LLM) |
| Prompt engineering focus | **Langfuse** | Best prompt versioning & A/B testing |
| Cost-tracking focus | **Helicone** | Real-time cost dashboards, budget alerts |
| Regulated industry | **Langfuse (self-host)** or **Datadog LLM** | Audit logs, RBAC, compliance features |
| Budget <$50/month | **Langfuse** (free tier) or **Helicone** (free tier) | Best free tiers, upgrade path when needed |
| Budget >$200/month, complex needs | **LangSmith** or **Datadog LLM** | Advanced features, enterprise support |

---

**Next Steps**: After choosing platform in Session 3c, Session 14 will integrate with infrastructure monitoring (Session 13) and define unified SLOs, dashboards, and incident response workflows.
