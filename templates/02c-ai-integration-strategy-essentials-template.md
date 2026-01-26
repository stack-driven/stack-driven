# AI Integration Strategy Essentials: [Product Name]

> **Purpose**: Distilled AI integration decisions for implementation agents. For full rationale, see 02c-ai-integration-strategy.md.

---

## Implementation Pattern

**Pattern**: [Direct API / RAG / Function Calling / Hybrid]
**Architecture**: [Key components: vector DB, queue, streaming, etc.]

---

## Model Selection

| Use Case | Model | Routing Rule |
|----------|-------|--------------|
| [Feature/Task 1] | [Model name] | [When to use] |
| [Feature/Task 2] | [Model name] | [When to use] |
| [Feature/Task 3] | [Model name] | [When to use] |

---

## System Prompts

**[Feature 1] System Prompt**:
```
[System prompt template with {{variables}}]
```

**[Feature 2] System Prompt**:
```
[System prompt template with {{variables}}]
```

---

## RAG Configuration (if applicable)

**Vector DB**: [pgvector / Pinecone / etc.]
**Chunk Size**: [X tokens]
**Overlap**: [Y tokens]
**Top-K**: [Z chunks]
**Similarity**: [0.75]
**Embedding**: [text-embedding-3-small]

---

## Caching Rules

**Enabled**: [Yes/No]
**Cache Targets**: [Query types]
**TTL**: [7-30 days]
**Similarity**: [0.95+]

---

## Rate Limits

**Per User**:
- [X] requests/minute
- [Y] tokens/hour

**Per Feature**:
- [Feature 1]: [Z] requests/day
- [Feature 2]: [Z] requests/day

---

## Fallback Chain

1. Primary: [Model]
2. Fallback: [Simpler model / cached]
3. Error: "[User message]"

---

## Security Guardrails

**Input**:
- Max: [X tokens]
- Filter: [PII, injections]

**Output**:
- Max: [Y tokens]
- Schema: [JSON validation]

**API Keys**:
- Store: [Secrets manager]
- Rotate: [24-48h]

---

## Cost Budget

**Monthly**: $[X]
**Alert**: $[1.5X]
**Stop**: $[2X]

**Per Feature**:
| Feature | Est. Monthly |
|---------|-------------|
| [Feature 1] | $[Y] |
| [Feature 2] | $[Z] |

---

## Monitoring

**Platform**: [Helicone/Langfuse]

**Metrics**:
- Latency p95: <[2s]
- Errors: <[5%]
- Cache hit: >[60%]
- Cost/day: <$[X]

**Alerts**:
- Latency > [3s]
- Errors > [5%]
- Cost > [2× daily]

---

## Compliance (if applicable)

**Type**: [HIPAA/SOC2/GDPR]
**Provider**: [With BAA/DPA]
**Config**: [Zero retention, EU region]

---

## MVP Priorities

**Implement First**:
1. [Core AI feature 1]
2. [Error handling]
3. [Basic monitoring]

**Add Later**:
1. [Semantic caching]
2. [Model routing]
3. [Advanced monitoring]