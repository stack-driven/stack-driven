# Observability Platform Strategy

## Overview

This document provides guidance on selecting unified vs specialized observability platforms for deployment monitoring, AI/LLM tracing, and application performance management (APM). It helps cascade sessions (particularly Sessions 13 and 14) recommend optimal monitoring stacks based on journey requirements.

---

## Platform Decision Tree

### Decision Factors

**Key Questions**:
1. Does the product use AI/LLM features? (Check Session 3 tech stack)
2. What is the budget tier? (Startup/SaaS/Enterprise from Session 2 strategy)
3. What is the team size and DevOps maturity?
4. Are there compliance requirements? (Check Session 2a constraints)

### Platform Strategies

#### Strategy 1: Datadog Unified (Enterprise-Grade)

**When to Use**:
- Enterprise budget tier ($3,000+/month infrastructure spend)
- Team >10 engineers or dedicated DevOps/SRE team
- Requires compliance (SOC2, HIPAA, PCI-DSS)
- AI/LLM features AND infrastructure monitoring both needed
- Prefer single vendor, integrated experience

**Coverage**:
- Infrastructure monitoring (servers, containers, Kubernetes)
- Application performance monitoring (APM with distributed tracing)
- **LLM Observability**: Datadog LLM Observability (native integration)
- Logs management with advanced querying
- Synthetic monitoring and RUM (Real User Monitoring)
- Security monitoring (SIEM capabilities)

**Pros**:
- Single platform for all observability needs
- Native Kubernetes/cloud provider integrations
- Strong compliance certifications
- Advanced alerting and anomaly detection
- Excellent visualization and dashboards

**Cons**:
- Expensive ($500-$3,000+/month depending on scale)
- Overkill for early-stage startups
- Vendor lock-in

**AI/LLM Monitoring Setup**:
```python
# Datadog LLM Observability (native support)
from ddtrace.llmobs import LLMObs

LLMObs.enable(
    ml_app="compliance-assessment",
    integrations_enabled=True,
    agentless_enabled=True
)

# Automatically tracks:
# - Token usage and costs
# - Latency per LLM call
# - Prompt/response content (with PII redaction)
# - Model versions
```

---

#### Strategy 2: Langfuse + Grafana Stack (Specialized, Cost-Optimized)

**When to Use**:
- Startup/SaaS budget tier (<$1,000/month infrastructure spend)
- Team <10 engineers, limited DevOps resources
- AI/LLM features are core to the product (Session 3: AI Integration Required)
- Prefer open-source or usage-based pricing
- Want specialized LLM observability with detailed prompt analytics

**Coverage**:
- **LLM Observability**: Langfuse (dedicated LLM tracing, prompt management, evaluation)
- **Infrastructure/Application Monitoring**: Grafana Stack (Prometheus + Loki + Tempo)
  - Prometheus: Metrics collection and alerting
  - Loki: Log aggregation
  - Tempo: Distributed tracing (non-LLM application traces)
- Kubernetes monitoring: Grafana + kube-prometheus-stack

**Pros**:
- Cost-effective ($0-$200/month for Langfuse Cloud, self-hosted Grafana free)
- Best-in-class LLM observability (prompt versioning, dataset management, evaluation)
- Open-source flexibility (Grafana stack)
- Specialized tools for each concern (deep LLM insights)

**Cons**:
- Requires managing 2-3 separate platforms
- More complex setup (need to integrate Langfuse + Grafana)
- Limited enterprise support (community-driven for Grafana)
- No native SIEM/security monitoring

**AI/LLM Monitoring Setup**:
```python
# Langfuse for LLM observability
from langfuse import Langfuse

langfuse = Langfuse(
    public_key=os.getenv("LANGFUSE_PUBLIC_KEY"),
    secret_key=os.getenv("LANGFUSE_SECRET_KEY"),
    host=os.getenv("LANGFUSE_HOST")  # Cloud or self-hosted
)

# Detailed LLM tracing with context
trace = langfuse.trace(
    name="assess-compliance-document",
    user_id=user.id,
    session_id=session.id
)

generation = trace.generation(
    name="extract-frameworks",
    model="gpt-4",
    input=prompt_data,
    metadata={"document_id": doc.id, "page_count": 120}
)

# Track costs, latency, prompt templates, evaluation scores
```

```yaml
# Grafana Stack for infrastructure (docker-compose.yml)
services:
  prometheus:
    image: prom/prometheus:latest
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
    ports:
      - "9090:9090"

  grafana:
    image: grafana/grafana:latest
    ports:
      - "3000:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
```

---

#### Strategy 3: Hybrid - Datadog (Infra) + Langfuse (LLM)

**When to Use**:
- Mid-market budget tier ($1,000-$3,000/month infrastructure)
- AI/LLM is core differentiator requiring specialized observability
- Infrastructure complexity requires enterprise-grade monitoring (Kubernetes, multi-region)
- Willing to manage 2 platforms for best-of-breed approach

**Coverage**:
- **Infrastructure/APM**: Datadog (full stack monitoring)
- **LLM Observability**: Langfuse (specialized LLM tracing)
- Integration: Link Langfuse traces to Datadog APM via correlation IDs

**Pros**:
- Best of both worlds (enterprise infra monitoring + specialized LLM insights)
- Detailed LLM prompt analytics (Langfuse) + comprehensive APM (Datadog)
- Flexible cost (Langfuse cheaper than Datadog LLM Observability at scale)

**Cons**:
- Increased complexity (manage 2 platforms, 2 billing relationships)
- Need to correlate traces manually (custom correlation ID strategy)
- Higher operational overhead

**Integration Pattern**:
```python
# Correlation between Datadog APM and Langfuse
from ddtrace import tracer as dd_tracer
from langfuse import Langfuse

# Extract Datadog trace ID
dd_trace_id = dd_tracer.current_trace_context().trace_id

# Pass to Langfuse as metadata
langfuse_trace = langfuse.trace(
    name="llm-operation",
    metadata={"datadog_trace_id": str(dd_trace_id)}
)
```

---

## Cost Comparison Table

| Observability Strategy | Monthly Cost (Startup) | Monthly Cost (SaaS Scale) | Monthly Cost (Enterprise) |
|------------------------|------------------------|--------------------------|---------------------------|
| **Datadog Unified** | $500-$800 (overkill) | $1,500-$2,500 | $3,000-$8,000 |
| **Langfuse + Grafana** | $50-$150 (optimal) | $200-$600 (cost-effective) | $800-$1,500 (limited at scale) |
| **Hybrid (Datadog + Langfuse)** | $600-$1,000 | $1,800-$3,000 | $4,000-$10,000 |

**Notes**:
- Startup: <1,000 users, <10 engineers, <$100k ARR
- SaaS Scale: 1,000-10,000 users, 10-50 engineers, $100k-$1M ARR
- Enterprise: >10,000 users, >50 engineers, >$1M ARR

---

## Integration with Deployment Plan (Session 13)

### Automated Rollback Triggers

Regardless of platform, Session 13 should configure automated rollback based on observability metrics:

**Datadog Rollback Automation**:
```yaml
# Kubernetes deployment with Datadog SLO-based rollback
apiVersion: argoproj.io/v1alpha1
kind: AnalysisTemplate
metadata:
  name: datadog-slo-check
spec:
  metrics:
  - name: error-rate
    provider:
      datadog:
        query: "avg:trace.servlet.request.errors{env:production}.as_count()"
    successCondition: result < 0.01  # <1% error rate
    failureLimit: 3

  - name: latency-p99
    provider:
      datadog:
        query: "avg:trace.servlet.request.duration{env:production}.p99()"
    successCondition: result < 500  # <500ms p99
    failureLimit: 3
```

**Grafana/Prometheus Rollback Automation**:
```yaml
# Flagger canary with Prometheus metrics
apiVersion: flagger.app/v1beta1
kind: Canary
metadata:
  name: api-service
spec:
  analysis:
    metrics:
    - name: request-success-rate
      thresholdRange:
        min: 99
      interval: 1m
      query: |
        sum(rate(http_requests_total{status!~"5.."}[1m]))
        /
        sum(rate(http_requests_total[1m]))
        * 100

    - name: request-duration
      thresholdRange:
        max: 500
      interval: 1m
      query: |
        histogram_quantile(0.99,
          sum(rate(http_request_duration_seconds_bucket[1m])) by (le)
        ) * 1000
```

---

## DORA Metrics Tracking

All observability strategies must support DORA metrics (Session 14 integration):

### Deployment Frequency
- **Datadog**: `deployment.count` metric, dashboard widget
- **Grafana**: Prometheus counter `deployments_total`, Grafana dashboard

### Lead Time for Changes
- **Datadog**: Custom metric from GitHub Actions workflow timestamps
- **Grafana**: Prometheus histogram from CI/CD pipeline events

### Mean Time to Recovery (MTTR)
- **Datadog**: Incident timeline from PagerDuty/Opsgenie integration
- **Grafana**: Prometheus gauge tracking incident start → resolution time

### Change Failure Rate
- **Datadog**: `deployment.failed` / `deployment.total` * 100
- **Grafana**: Prometheus query `(failed_deployments / total_deployments) * 100`

---

## Recommendation Algorithm (For Cascade Sessions)

```markdown
IF Session 3 tech stack includes "AI Integration: Required":
  IF budget tier == "Enterprise" OR compliance exists:
    RECOMMEND: Datadog Unified (LLM Observability built-in)
  ELSE IF budget tier == "Startup" OR team <10:
    RECOMMEND: Langfuse + Grafana Stack (specialized, cost-optimized)
  ELSE:
    RECOMMEND: Hybrid (Datadog infra + Langfuse LLM)
ELSE (No AI features):
  IF budget tier == "Enterprise" OR compliance exists:
    RECOMMEND: Datadog Unified (comprehensive APM)
  ELSE:
    RECOMMEND: Grafana Stack (open-source, cost-effective)
```

---

## Session 14 Integration Points

When Session 14 (observability strategy) exists, Session 13 must:

1. **Read monitoring stack decision** from Session 14
2. **Extract SLIs/SLOs** (error rate thresholds, latency targets)
3. **Configure automated rollback** using chosen platform's metrics
4. **Define alert routing** (PagerDuty/Opsgenie escalation)
5. **Generate DORA metrics tracking** (deployment frequency, MTTR, change failure rate)

**Example Session 13 Integration**:
```markdown
## Deployment Observability (from Session 14)

**Monitoring Stack**: Langfuse (LLM) + Grafana Stack (infrastructure)

**Automated Rollback Triggers**:
- Error rate > 1% for 2 minutes → Automatic rollback
- Latency p99 > 500ms for 2 minutes → Automatic rollback
- LLM error rate > 5% (Langfuse trace errors) → Automatic rollback

**DORA Metrics**:
- **Deployment Frequency**: Target 5 deploys/day
  - Tracked via: Prometheus counter `deployments_total{environment="production"}`
- **Lead Time for Changes**: Target <2 hours
  - Tracked via: GitHub Actions workflow duration → deployment timestamp
- **MTTR**: Target <15 minutes
  - Tracked via: PagerDuty incident timeline
- **Change Failure Rate**: Target <5%
  - Tracked via: `(failed_deployments / total_deployments) * 100`
```

---

## References

- **Datadog LLM Observability**: https://docs.datadoghq.com/llm_observability/
- **Langfuse Documentation**: https://langfuse.com/docs
- **Grafana Stack**: https://grafana.com/oss/
- **OpenTelemetry**: https://opentelemetry.io/ (for custom instrumentation)

---

**Document Control**
- **Last Updated**: 2025-02-02
- **Coordination**: Created for #151 (deployment plan enhancement), used by #152 (observability strategy)
