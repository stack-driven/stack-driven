# AI Integration Strategy: [Product Name]

> **Derived from**: product-guidelines/00-user-journey.md, 01-product-strategy.md, 02-tech-stack.md

---

## AI Feature Requirements (Journey-Mapped)

[For each journey step using AI, include:]

### Step [N]: [Step Name]

**AI Task**: [Classification / Generation / Conversation / Search / Analysis / Code]
**Latency Requirement**: [<500ms / 2-5s / Background acceptable]
**Interaction Pattern**: [One-shot / Multi-turn / Streaming required]
**Data Involved**: [Document types, sensitivity level]
**Expected Usage**: [X users × Y interactions = Z per day]
**Quality Bar**: [Helpful suggestions / Must be accurate / Mission-critical]

---

## Strategic Context (From Product Strategy)

**Competitive Positioning**: [Core differentiator / Table stakes / Nice-to-have]
**Scale Targets**: MVP: [X users] → 6 months: [Y users]
**Budget Context**: $[Amount]/month implied from monetization
**Risk Tolerance**: [Fast iteration / Conservative / Regulated industry]
**Geographic Scope**: [Single region / Global / EU-specific]

---

## Implementation Pattern Decision

**Chosen Approach**: [Direct API / RAG / Function Calling / Agent Framework / Hybrid]

**Rationale**:
[Explain why this pattern fits the journey requirements. Reference specific journey steps.]

**Alternatives Considered**:
- [x] [Pattern not chosen]: [Why it doesn't fit]
- [x] [Pattern not chosen]: [Why it doesn't fit]
- [✓] [Chosen pattern]: [Why this is the best fit]

**Architecture Implications**:
[What this means for system design - vector DB needed? Streaming? Background jobs?]

---

## Model Selection & Routing Strategy

**Primary Model**: [GPT-4o mini / Claude Sonnet / etc.]
**Rationale**: [Why this model for primary use case. Cost vs quality trade-off.]

**Model Routing** (if applicable):
- Simple queries → [Cheap fast model]: [Specific use cases]
- Complex queries → [Expensive capable model]: [Specific use cases]
- Routing logic: [How to determine complexity]

**Cost Projections**:

| Feature | Model | Usage Estimate | Monthly Cost |
|---------|-------|----------------|--------------|
| [Feature 1] | [Model] | [X users × Y interactions × Z tokens] | $[Amount] |
| [Feature 2] | [Model] | [X users × Y interactions × Z tokens] | $[Amount] |
| **Total (before caching)** | | | **$[Amount]** |
| **Total (with 65% cache hit)** | | | **$[Amount]** |

**Budget Validation**: [[✓] Fits within $X budget / (Warning) Exceeds by Y% - mitigation plan]

---

## Prompt Engineering Strategy (always included)

### Six-Component Prompt Framework

**1. Task Definition** (Role/Persona):
```
[Define what the AI is and what it does]
Example: "You are a compliance analyst with expertise in GDPR..."
```

**2. Tone and Style Context**:
```
Tone: [professional/friendly/technical/concise]
Style: [formal/conversational/bullet-points/detailed]
Audience: [end-users/developers/executives]
```

**3. Background Data and Context**:
```
[Relevant background information, user-specific data, domain knowledge]
Example: "User tier: Premium, Previous issues: 2 billing problems"
```

**4. Detailed Instructions** (Step-by-Step for complex tasks):
```
Instructions:
1. [First action]
2. [Second action]
3. [Third action]
```

**5. Few-Shot Examples** (2-3 examples):
```
Example 1:
Input: [Example input]
Output: [Expected output]

Example 2:
Input: [Example input]
Output: [Expected output]
```

**6. Explicit Output Format**:
```
Output format:
{
  "field1": "type (constraints)",
  "field2": "type (constraints)"
}
Do not include any text outside the JSON object.
```

### Advanced Patterns

**Chain-of-Thought (CoT)**:
[Using / Not using]
- **Use for**: [Complex reasoning tasks - e.g., compliance analysis, code generation]
- **Pattern**:
  ```
  Think through your analysis step-by-step within <thinking> tags:
  <thinking>
  1. [Step 1]
  2. [Step 2]
  </thinking>

  <answer>
  [Final output]
  </answer>
  ```
- **Benefits**: [+15-30% accuracy for complex tasks]
- **Costs**: [+50-200 tokens per query]

**Prefilling** (for consistent output structure):
[Using / Not using]
- **Use for**: [Force JSON structure, prevent preambles]
- **Pattern**:
  ```python
  messages = [
      {"role": "user", "content": "Classify this ticket..."},
      {"role": "assistant", "content": '{"category": "'}  # Prefill
  ]
  # Model completes: billing", "confidence": 0.95}
  ```
- **Benefits**: [Near-100% format consistency]

**Prompt Chaining** (multi-step workflows):
[Using / Not using]
- **Use for**: [Complex workflows requiring iterative refinement]
- **Example**: Analysis → Prioritization → Recommendations → Executive summary
- **Costs**: [4x LLM calls, only use for high-value tasks]

### Prompt Versioning & A/B Testing

**Version Control Strategy**:
- Store prompts in Git with semantic versioning (v1.0, v1.1, v1.2)
- Document changes: "v1.2: Added CoT for 15% accuracy improvement"
- Track: prompt_version → accuracy, latency, cost, user satisfaction

**A/B Testing Plan**:
- Test: [50% control, 50% treatment]
- Metrics: [Accuracy, latency, cost, user feedback]
- Decision criteria: [>5% accuracy improvement OR >20% cost reduction]

**Performance Tracking**:
- Log: prompt_version, input_hash, output_hash, latency, cost, feedback
- Aggregate weekly: Which prompts perform best?
- Alert: If new prompt degrades accuracy >5%

### Token Optimization

**System Prompt Caching**:
- Move repeated instructions to system prompt (cached after first call)
- **Savings**: [50-70%] on input tokens for instruction-heavy prompts

**Prompt Compression**:
- Remove: "please", "kindly", "thank you", filler words
- Use imperative voice: "Classify" not "Please classify"
- **Savings**: [10-15%] token reduction

**Variable Extraction**:
- Extract repeated data to variables
- **Savings**: [20-30%] for repetitive data

---

## RAG Architecture (if RAG sub-agent invoked)

[If not using RAG, write: "Not applicable - AI tasks don't require document retrieval"]

[If using RAG:]

### RAG Pattern Selection

**Chosen Pattern**: [Naive RAG / Modular RAG / Agentic RAG / Hybrid RAG]

**Rationale**:
[Explain why this RAG variant fits the journey requirements. Reference document types, query patterns, quality requirements.]

**Architecture Flow**:
[Describe the RAG pipeline: Indexing → Query → Retrieval → Generation]

**Alternatives Considered**:
- [x] [Pattern not chosen]: [Why it doesn't fit]
- [✓] [Chosen pattern]: [Why this is the best fit]

### Vector Database Selection

**Vector Database**: [pgvector / Pinecone / Chroma / Qdrant / Weaviate]

**Decision Criteria**:
- [Key factor 1 from tech stack - e.g., "Already using PostgreSQL"]
- [Key factor 2 from scale/budget - e.g., "MVP stage, need low cost"]

**Rationale**: [Why this choice given tech stack and scale]

**Cost**: $[X]/month (or $0 if pgvector/Chroma embedded)

### Chunking Strategy

- **Chunk size**: [256-512 tokens / 1024 tokens / 2048 tokens]
- **Approach**: [Fixed-size / Semantic / Sliding window]
- **Overlap**: [0 / 100 tokens] if sliding window
- **Rationale**: [Why this fits document type and query pattern from journey]

**Example**:
```
Document: 100-page compliance PDF
Chunks: ~200 chunks of 1,024 tokens each
Overlap: 100 tokens (prevent context loss at boundaries)
```

### Retrieval Optimization

**Reranking**: [Yes / No]
- If Yes: [Cohere Rerank / Jina Reranker]
- Cost: $[X] per 1K searches
- Benefit: [X%] precision improvement

**Lost-in-the-Middle Mitigation**: [Yes / No]
- Strategy: [Reorder chunks, most relevant at start/end]

**Hybrid Search (Vector + BM25)**: [Yes / No]
- If Yes: Rationale: [Need exact term matching for regulations/product names]
- Implementation: [Weaviate built-in / Custom RRF fusion]

**Top-k**: [3-5 chunks typical]
**Similarity threshold**: [0.7-0.8]

**Embedding Model**: [text-embedding-3-small / bge-m3 / etc.]
**Embedding Cost**: $[X] per million tokens

---

## Error Handling & Fallback Strategy

**Graceful Degradation Chain**:

1. **Primary**: [Primary AI model] - Full functionality
2. **Fallback Model**: [Simpler model] - Reduced quality, faster
3. **Rule-Based**: [Deterministic logic] - Limited but reliable
4. **Cached Response**: [Pre-computed] - For common queries
5. **Human Escalation**: [Support queue] - Critical decisions
6. **Defer Processing**: [Background queue] - Non-urgent tasks

**Retry Logic**:
- Retry on: [429 rate limit, 5xx errors]
- Max retries: [3]
- Backoff: [Exponential: 1s, 2s, 4s]
- Timeout: [30s per request]

**Circuit Breaker**:
- Open after: [5 consecutive failures]
- Half-open after: [60s]
- Close after: [3 consecutive successes]

**User-Facing Messages**:
- Rate limit: "[Specific message]"
- Timeout: "[Specific message]"
- Error: "[Specific message]"

---

## Cost Optimization Strategy (if Cost Optimization sub-agent invoked)

### Baseline Cost Analysis

**Current Projected Cost**: $[X]/month (without optimization)
- Usage: [Y users/day × Z interactions/user × N tokens/interaction]
- Model: [Model name] at $[price]/1M tokens
- **Journey Context**: [Reference usage patterns from journey]

### Semantic Caching Strategy

[If caching applicable:]
**Semantic Caching**: Yes

**Multi-Layer Architecture**:
1. **Exact Key Matching** (Redis/Memcached, <5ms latency)
2. **Semantic Similarity Search** (Vector DB, 20-50ms latency, similarity >0.95)
3. **LLM Inference** (Cloud API, 500ms-2s latency)

**Safe to Cache** (from journey analysis):
- ✅ [Specific query types from journey - e.g., FAQ-style questions]
- ✅ [e.g., Classification tasks]
- ✅ [e.g., Summarization of static content]

**Never Cache** (risk analysis):
- ❌ [Specific risks for this product - e.g., Personalized responses]
- ❌ [e.g., Time-sensitive information]
- ❌ [e.g., Transactional confirmations]

**Expected Hit Rate**: [67-73%] (based on query pattern analysis)

**Cost Savings**:
- Before caching: $[X]/month
- After caching ([Y%] hit rate): $[Z]/month
- **Net Savings**: $[X-Z]/month ([%] reduction)
- Infrastructure cost: $[Redis/cache cost]/month
- **Total Savings**: $[net savings after infrastructure]/month

**Implementation**: [Helicone built-in / LangChain SemanticCache / Custom pgvector]

[If not applicable:]
**Semantic Caching**: No
- Rationale: [Why caching doesn't apply - e.g., "All queries are unique, no repetition"]

### Model Routing Strategy

[If routing applicable:]
**Model Routing**: Yes

**Routing Logic**:
- **Simple queries** ([X%] of volume): [Cheap model - e.g., GPT-4o mini]
  - Criteria: [Length <100 chars, no technical keywords]
- **Complex queries** ([Y%] of volume): [Expensive model - e.g., Claude Sonnet]
  - Criteria: [Length >100 chars OR technical keywords OR low confidence]

**Cost Savings**:
- Without routing (all → expensive model): $[A]/month
- With routing ([X%] → cheap, [Y%] → expensive): $[B]/month
- **Savings**: $[A-B]/month ([%] reduction)

**Quality Impact**: 95% of expensive model quality maintained (RouteLLM benchmark)

**Implementation**: [RouteLLM / Manual rule-based / Amazon Bedrock Intelligent Routing]

[If not applicable:]
**Model Routing**: No
- Rationale: [Why routing doesn't apply - e.g., "All tasks require highest accuracy, no room for cheaper models"]

### Combined Strategy: Caching + Routing

[If both applicable:]
**Maximum Cost Optimization**:
- Baseline: $[X]/month
- After caching: $[Y]/month ([Z%] reduction)
- After routing (on cache misses): $[W]/month
- **Total Savings**: $[X-W]/month ([%] reduction)

**ROI**: $[annual savings] saved annually for [X weeks] implementation effort

### Token Optimization

**System Prompt Caching**:
- Move repeated instructions to system prompt (cached by providers after first call)
- **Savings**: [20-30%] token reduction on repeated instructions

**Prompt Compression**:
- Remove filler words ("please", "kindly", redundancy)
- Use imperative voice
- **Savings**: [10-15%] token reduction

**Output Token Limiting**:
- Classification: 50 tokens max
- Short answers: 100-200 tokens
- Summaries: 300-500 tokens
- **Savings**: [X%] on output tokens (often most expensive)

### Cost Monitoring & Alerting

**Budget Thresholds**:
- Daily budget: $[X] (alert at 120% = $[1.2X])
- Monthly budget: $[Y] (alert at 110% = $[1.1Y])
- Emergency threshold: $[Z] (alert at 200%, trigger rate limiting)

**Anomaly Detection**:
- Request volume: Alert if >150% of 7-day average
- Cost per request: Alert if >130% of 7-day average
- Model usage drift: Alert if expensive model usage >50% (should be ~[X%])

**Per-User Caps**:
- Daily: [X] requests per user
- Monthly: [Y] requests per user

**Rate Limiting**:
- Per-user: [X requests/minute, Y tokens/hour]
- Per-feature: [Z requests/day]
- Rationale: [Prevent abuse, manage costs]

---

## Security & Compliance Guardrails (if Security/Compliance sub-agent invoked)

[If not regulated industry, write: "Basic security only - no regulated data"]

[If regulated industry or sensitive data:]

### OWASP LLM Top 10 2025 Mitigation

**Priority Risks for This Product** (top 3-5 applicable):

**1. Prompt Injection** (Priority: CRITICAL)
- **Mitigation**:
  - Privilege separation (XML tags: `<instructions>` vs `<user_input>`)
  - Input sanitization (blocklist injection patterns)
  - Output validation (ensure expected format only)
- **Implementation**: [Code snippet or reference]

**2. Sensitive Information Disclosure** (Priority: [CRITICAL for regulated | HIGH for others])
- **Mitigation**:
  - PII filtering before LLM (regex + NER for names)
  - Zero data retention (BAA/DPA with providers)
  - Output scanning (detect accidental PII in responses)
- **Implementation**: [PII filter patterns for this industry]

**3. [Other relevant risk]** (Priority: [CRITICAL/HIGH/MEDIUM])
- **Mitigation**: [Specific mitigations for this risk]
- **Implementation**: [Code or framework reference]

[Continue for top 3-5 risks applicable to this product]

### PII Filtering Strategy

[If handling sensitive data:]
**Applicable Regulations**: [HIPAA / GDPR / Both]

**Filtering Patterns**:
```python
# Patterns to filter before sending to LLM
- SSN: r'\d{3}-\d{2}-\d{4}'
- Credit cards: r'\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}'
- Emails: r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'
- [Industry-specific: Medical record numbers, case numbers, etc.]
```

**When to Apply**:
- ✅ Before sending to LLM (primary defense)
- ✅ After receiving from LLM (defense in depth)

**Implementation**: [spaCy NER for names + regex for structured data]

### API Key Management

**Secrets Manager**: [AWS Secrets Manager / HashiCorp Vault / 1Password]

**Rotation Policy**:
- Frequency: Every [30 | 14 | 7] days
- Automated: [Yes | Planned for Phase 2]

**Scope Separation**:
- Separate keys per environment (dev/staging/prod)
- Separate keys per service (if multiple AI features)

**Monitoring**:
- Alert if usage >200% of baseline
- Alert on geographic anomalies

### Audit Logging

**What to Log**:
- Timestamp, request_id, user_id, feature, model
- Input/output hashes (NOT actual content - PII risk)
- Tokens, cost, latency, confidence
- Human review flag, errors

**What NOT to Log**:
- ❌ Actual user input (PII risk)
- ❌ Actual LLM output (PII risk)

**Retention**: [6 years (HIPAA) | As required by GDPR | 2 years (SOC2)]

**Access Controls**:
- Compliance/security team only
- Append-only (cannot modify or delete)
- Audit log access itself is logged

### Input/Output Validation

**Input Validation**:
- Max length: [10,000 characters]
- Encoding: UTF-8 only
- Injection pattern detection

**Output Validation**:
- Format check (JSON schema validation)
- PII detection (scan outputs)
- System prompt leakage detection

---

## Testing & Evaluation Strategy (if Evaluation sub-agent invoked)

[If quality requirements are not mission-critical, write: "Basic monitoring only - use observability metrics"]

[If mission-critical or A/B testing planned:]

### Testing Framework Selection

**Recommended Framework**: [DeepEval / Promptfoo / RAGAS]

**Rationale**: [Why this framework fits the use case]
- **DeepEval**: For regression testing LLM outputs like unit tests (CI/CD integration)
- **Promptfoo**: For rapid prompt iteration and side-by-side comparison
- **RAGAS**: For RAG pipeline evaluation (retrieval + generation quality)

**Use Cases**:
- [Specific task 1 from journey - e.g., "Ticket classification regression tests"]
- [Specific task 2 - e.g., "Prompt A/B testing before launch"]

### Evaluation Metrics

**Business Metrics** (Primary):
- [Metric 1 from journey - e.g., "Conversion rate with AI feature"]
- [Metric 2 - e.g., "Time to task completion"]
- [Metric 3 - e.g., "Revenue per user (AI vs non-AI)"]

**Learning Metrics** (Product Health):
- Feature adoption: Target >[X%]
- Repeat usage: Target >[Y%]
- NPS impact: [Before AI vs After AI]

**AI-Specific Metrics** (Quality):
- **Accuracy**: Target >[X%] on eval set (how measured: [test set / human eval])
- **Latency**: P50 <[Y]s, P95 <[Z]s
- **User Satisfaction**: Target >[70%] thumbs up
- **Fallback Rate**: Target <[10%] (graceful degradation triggers)

### Labeled Evaluation Set

**Size**: [100-200 examples (MVP) | 500+ examples (production)]

**Creation Process**:
1. Sample real user queries ([N] diverse examples)
2. Human experts label ground truth outputs
3. Store in version control (eval_set_v1.json)

**Frequency**:
- Before launch: Establish baseline accuracy
- After prompt changes: Regression test (did quality improve or degrade?)
- Weekly: Track quality trends over time

### Regression Testing

**Golden Test Set**: [X examples]

**Run On**:
- Every prompt change (CI/CD integration)
- Model upgrades
- Weekly trend tracking

**Alert If**:
- Accuracy drops >5%
- Latency increases >20%
- Fallback rate increases >5%

**Regression Test Automation**:
```bash
# Run on every deploy
pytest tests/llm_tests.py

# Block deployment if accuracy <threshold
exit_code=$?
if [ $exit_code -ne 0 ]; then
    echo "LLM tests failed - blocking deployment"
    exit 1
fi
```

### A/B Testing Strategy

**Test Framework**:
- 50% control (baseline prompt/model)
- 50% treatment (new variant)
- Minimum [1,000] samples per group
- Run for [1-2 weeks]

**Metrics to Track**:
- Accuracy: [Target >+5% improvement]
- Latency: [Acceptable if <+20% increase]
- Cost: [Acceptable if <+20% increase]
- User satisfaction: [Target >+10% thumbs up]

**Decision Criteria**:
- Deploy if: Accuracy improves >5% AND cost increase <20%
- Revert if: Accuracy degrades >5% OR user satisfaction drops >10%

### Human-in-the-Loop Patterns

[If high-stakes decisions:]

**Confidence-Based Routing**:
```python
if confidence > 0.9:
    auto_apply()  # High confidence
elif confidence > 0.7:
    show_for_approval()  # Medium confidence
else:
    route_to_human()  # Low confidence
```

**Approval Flows** (for high-stakes):
- [List specific decisions requiring human approval based on journey]
- Example: "Medical advice always requires physician approval"
- Example: "Code deployment requires developer approval before execution"

**Feedback Collection**:
- Thumbs up/down on every AI response
- Track task completion (did user accept suggestion?)
- Use feedback for prompt tuning and confidence calibration

### Continuous Evaluation

**Daily Monitoring**:
- Sample [100] requests/day
- Human label sample
- Calculate daily accuracy
- Alert if accuracy drops >5%

**Weekly Review**:
- Aggregate: Accuracy, latency, cost, user satisfaction by prompt version
- Decide: Keep, iterate, or revert

**Quarterly Deep Dive**:
- Analyze thumbs-down examples (what's failing?)
- Update eval set with new edge cases
- Consider fine-tuning if >10K labeled examples

---

## Monitoring & Observability

**Platform**: [Helicone / Langfuse / LangSmith / Datadog]
**Rationale**: [Why this choice]

**Key Metrics**:
- Latency: p50/p95/p99 (targets: [specify])
- Token usage: By feature breakdown
- Cost: Per request/user/feature
- Errors: Rate by type
- Cache: Hit/miss ratio (target: >60%)
- Quality: User feedback signals

**Alerting**:
- Latency p95 > [3s] → Notify
- Error rate > [5%] → Investigate
- Daily cost > [2× budget] → Alert
- Cache hit < [50%] → Review

**Dashboards**:
- Cost tracking dashboard
- Performance dashboard
- Quality metrics dashboard

---

## MVP Implementation Plan

### Phase 1: MVP Launch (Immediate)

**Must-Have**:
- [Feature 1] with [Model] via [Pattern]
- Basic error handling
- Simple caching (if applicable)
- Cost tracking
- Basic monitoring

**Rationale**: Minimum viable for product-market fit validation

**Timeline**: [X weeks]
**Cost**: $[Y]/month estimated

### Phase 2: Optimization (At Scale)

**Add When**:
- Usage > [Z users/day] OR
- Costs > $[A]/month OR
- Quality issues emerge

**Enhancements**:
- Semantic caching (65% cost reduction)
- Model routing (30% additional savings)
- Advanced fallbacks
- Comprehensive monitoring
- A/B testing framework

**Timeline**: After validation (3-6 months typical)

### Phase 3: Advanced Features (If Needed)

**Consider When**:
- Product-market fit validated
- Revenue supports investment
- Differentiation requires it

**Potential**:
- Fine-tuning for domain
- Complex agent workflows
- Custom model architecture

---

## Compliance Approach (if applicable)

[If not handling regulated data, write: "Not applicable - no regulated data"]

[If handling regulated data:]

**Data Type**: [HIPAA / SOC2 / GDPR]

**Compliance Strategy**: API with [BAA/DPA]

**Provider & Agreement**:
- Provider: [OpenAI / Anthropic / Azure / etc.]
- Agreement: [BAA / DPA with SCCs]
- Configuration: [Zero retention, data residency]

**Requirements Met**:
- [✓] [Agreement signed]
- [✓] [Zero retention configured]
- [✓] [Encryption in transit/rest]
- [✓] [Access controls]
- [✓] [Audit logging]
- [✓] [Data residency if required]

**Timeline**: [Days for API setup vs months for self-hosting]
**Cost**: [Same as standard API vs $200K+/year self-hosting]

**Rationale**: [Why API with agreements sufficient]

---

## What We DIDN'T Choose (And Why)

### [Alternative Approach 1]

**Why Not**: [Specific reason based on journey/constraints]

### [Alternative Approach 2]

**Why Not**: [Specific reason based on journey/constraints]

---

## Scaling Triggers: When to Revisit

**Revisit this strategy when:**

1. **Usage grows 10x**: Current: [X] → Trigger: [10X]
   - Re-evaluate: Model routing, caching, infrastructure

2. **Costs exceed $[threshold]/month**
   - Consider: Self-hosting economics, fine-tuning

3. **Quality requirements change**
   - Consider: Larger models, fine-tuning, advanced patterns

4. **New AI capabilities emerge** (check quarterly)
   - Evaluate: New models, patterns, cost reductions

5. **Compliance requirements change**
   - Re-evaluate: Provider agreements, controls

---

**Next in Cascade**: This AI strategy informs architecture (Session 4), database schema (Session 7), API contracts (Session 8), and all downstream technical decisions.