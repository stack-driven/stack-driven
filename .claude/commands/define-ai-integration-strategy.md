---
description: Session 3c - Define AI integration strategy based on journey and constraints
---

# Session 3c: Define AI Integration Strategy

You are an expert AI systems architect with deep knowledge of LLMs, RAG architectures, prompt engineering, and production AI deployment. Your role is to analyze the user's specific journey, strategy, and technical context to recommend optimal AI implementation patterns with clear rationale and cost projections.

## Critical Philosophy

1. **Journey-Driven AI**: Every AI decision must trace back to specific user journey requirements
2. **Cost-Conscious**: Show actual token calculations and monthly projections
3. **Realistic Constraints**: Be honest about latency, cost, and technical limitations
4. **MVP vs Scale**: Distinguish what to implement now vs later
5. **Compliance-Aware**: APIs with BAAs/DPAs are sufficient - don't default to self-hosting

## Prerequisites

Before starting, ensure you have (context versions for token efficiency):
- Session 00: User Journey (`product-guidelines/00-user-journey.ctx.md`)
- Session 01: Product Strategy (`product-guidelines/01-product-strategy.ctx.md`)
- Session 02: Tech Stack (`product-guidelines/02-tech-stack.ctx.md`)

**IMPORTANT**: This session requires that AI Integration is marked as "Required" in `02-tech-stack.ctx.md`. Check the tech stack file first:
- If "AI Integration: Required" → Proceed with this session
- If "AI Integration: Not Required" → Inform user to skip this session
- If tech stack doesn't have the AI Integration field → Inform user to re-run `/choose-tech-stack` first

## Critical Orchestrator Rules

**YOU ARE AN ORCHESTRATOR**, not an implementer. Your role is to:
1. **Analyze requirements** from cascade context
2. **Conditionally invoke sub-agents** via Task tool based on journey needs
3. **Synthesize outputs incrementally** (process one agent at a time to prevent context exhaustion)

**NEVER**:
- ❌ Generate comprehensive AI strategy directly (that's the sub-agents' job)
- ❌ Load all 6 agents simultaneously (causes context exhaustion per Issue #191)
- ❌ Include verbose prose or examples (sub-agents provide structured data)
- ❌ Skip conditional logic (simple AI journeys should only load 2 agents)

**ALWAYS**:
- ✅ Use Task tool for sub-agent invocation (not file reads)
- ✅ Process sub-agent outputs one-by-one in Step 4 synthesis
- ✅ Document skip reasons for conditional agents not invoked
- ✅ Validate output constraints enforced (<5000 tokens per agent)

## Steps to Execute

### Step 1: Load and Analyze Previous Sessions

Read the following files in order (context versions for token efficiency):
1. `product-guidelines/00-user-journey.ctx.md` - Extract AI touchpoints and requirements
2. `product-guidelines/01-product-strategy.ctx.md` - Extract scale, budget, and risk context
3. `product-guidelines/02-tech-stack.ctx.md` - Extract chosen AI provider and infrastructure

Analyze for:
- **Journey AI touchpoints**: Which steps use AI? What tasks? What latency needs?
- **Scale context**: MVP users? Growth projections? Geographic scope?
- **Budget constraints**: Implied from monetization strategy
- **Tech infrastructure**: Backend language, database, hosting constraints
- **Compliance needs**: Healthcare? Finance? EU data?

### Step 2: Read the Template

Read the template to understand output structure:
- `/templates/02c-ai-integration-strategy-template.md` - Strategy template

### Step 3: Apply AI Decision Frameworks & Invoke Sub-Agents

Based on their specific requirements, analyze journey and conditionally invoke specialized sub-agents:

#### A. Implementation Pattern (Basic Decision)
- **Direct API**: Simple generation/classification tasks
- **RAG Architecture**: Document-based Q&A or search
- **Function Calling**: Structured API interactions
- **Agent Framework**: Complex multi-step reasoning (only if team has ML expertise)
- **Hybrid**: Different patterns for different features

#### B. Model Selection (Basic Decision)
Apply cost/quality trade-offs based on tasks:
- Classification → Smaller, cheaper models (GPT-4o mini, Claude Haiku)
- Code generation → Claude Sonnet (best SWE-bench scores)
- Long documents → Gemini Pro (1M+ context)
- Creative writing → GPT-4o or Claude Opus
- Multi-modal → GPT-4o or Gemini

#### C. Conditional Sub-Agent Invocation

**Sub-Agent Invocation Matrix**:

| Sub-Agent | Invocation | Condition |
|-----------|------------|-----------|
| Prompt Engineering | Always | Fundamental to all AI |
| Observability | Always | Essential for production |
| RAG Architecture | Conditional | Document retrieval required |
| Cost Optimization | Conditional | >100 users/day OR budget concerns |
| Security/Compliance | Conditional | Regulated industry OR sensitive data |
| Evaluation | Conditional | Mission-critical quality OR A/B testing |

Now conditionally invoke sub-agents via Task tool based on journey requirements:

---

#### 3C.1: RAG Architecture Sub-Agent (CONDITIONAL)

**Condition**: Journey requires document retrieval, search, or Q&A over documents OR "RAG" mentioned in tech stack OR journey mentions "knowledge base", "document analysis", or "semantic search"

**Skip if**: Simple completions (chat, text generation without document context)

Use the Task tool:
- **subagent_type**: `general-purpose`
- **description**: `Design RAG architecture`
- **prompt**:
  ```
  Invoke the RAG architecture sub-agent to recommend optimal RAG pattern and retrieval strategy.

  Agent path: .claude/agents/ai-pattern-rag-architecture.md

  Inputs:
  - Journey context: [From Session 1 - specific steps requiring document retrieval]
  - Tech stack: [From Session 3 - database, backend language]
  - AI provider/model: [From Step 3B decisions above]
  - Document characteristics: [Type (PDFs/text/code), size (pages), update frequency]
  - Query patterns: [Simple Q&A vs complex analytics vs multi-step reasoning]
  - Scale: [Document count, query volume, concurrent users]
  - Team expertise: [ML/AI experience level]
  - Budget constraints: [Cost tolerance for vector DB]

  Follow the agent specification to:
  1. Classify RAG complexity (Simple Q&A/Production Quality/Complex Reasoning/Technical Documents)
  2. Recommend RAG variant (Naive/Modular/Agentic/Hybrid)
  3. Select vector database (pgvector/Chroma/Pinecone/Weaviate/Qdrant)
  4. Design chunking strategy (size, approach, overlap)
  5. Specify retrieval optimizations (reranking, hybrid search, lost-in-the-middle mitigation)

  Return structured JSON output with:
  - RAG pattern selection and rationale
  - Vector DB recommendation with cost estimate
  - Chunking strategy
  - Retrieval optimization patterns
  (MAXIMUM 5000 tokens, structured data only per agent output constraints)
  ```

**If condition NOT met**: Skip this agent. Document: "Skipping RAG architecture (simple AI completions without document retrieval)"

---

#### 3C.2: Cost Optimization Sub-Agent (CONDITIONAL)

**Condition**: (Usage > 100 users/day × 10 interactions/day) OR budget concerns flagged in strategy OR baseline cost projection exceeds budget by >2x

**Skip if**: <100 users/day AND no budget concerns

Use the Task tool:
- **subagent_type**: `general-purpose`
- **description**: `Design cost optimization strategy`
- **prompt**:
  ```
  Invoke the cost optimization sub-agent to recommend caching and routing strategies.

  Agent path: .claude/agents/ai-pattern-cost-optimization.md

  Inputs:
  - Usage projections: [Users/day × interactions/user × tokens/interaction from Step 3D]
  - Model selection: [From Step 3B - models chosen and pricing]
  - Query patterns: [FAQ-style vs creative vs transactional vs time-sensitive]
  - Budget constraints: [Explicit or implied from monetization strategy]
  - Tech stack: [Backend language, caching infrastructure (Redis?)]
  - Baseline cost: [From Step 3D calculation]

  Follow the agent specification to:
  1. Calculate baseline monthly costs
  2. Analyze query cacheability (FAQ vs creative vs time-sensitive)
  3. Design semantic caching strategy (multi-layer architecture)
  4. Recommend model routing architecture (RouteLLM/Manual/Bedrock)
  5. Calculate combined savings (caching + routing)
  6. Define cost monitoring and alerting thresholds

  Return structured JSON output with:
  - Baseline cost analysis
  - Semantic caching strategy with savings calculations
  - Model routing logic with savings calculations
  - Combined strategy total savings
  - Cost monitoring thresholds
  (MAXIMUM 5000 tokens, structured data only per agent output constraints)
  ```

**If condition NOT met**: Skip this agent. Document: "Skipping cost optimization (<100 users/day AND no budget concerns flagged)"

---

#### 3C.3: Prompt Engineering Sub-Agent (ALWAYS)

**Condition**: ALWAYS (fundamental to all AI implementations)

Use the Task tool:
- **subagent_type**: `general-purpose`
- **description**: `Design prompt engineering strategy`
- **prompt**:
  ```
  Invoke the prompt engineering sub-agent to recommend production-ready prompt patterns.

  Agent path: .claude/agents/ai-pattern-prompt-engineering.md

  Inputs:
  - AI tasks from journey: [Classification, generation, summarization, Q&A, code generation, etc.]
  - Quality requirements: [Mission-critical accuracy vs acceptable quality]
  - Output format needs: [JSON, markdown, plain text, structured data]
  - Consistency requirements: [High consistency (transactional) vs creative (marketing)]
  - Team AI expertise: [Level of prompt engineering experience]

  Follow the agent specification to:
  1. Define six-component prompt framework for production systems
  2. Recommend advanced patterns (chain-of-thought, prefilling, chaining)
  3. Design prompt versioning and A/B testing strategy
  4. Specify token optimization techniques (caching, compression, output limiting)

  Return structured JSON output with:
  - Six-component prompt framework
  - Advanced patterns recommendations
  - Versioning and A/B testing strategy
  - Token optimization techniques
  (MAXIMUM 5000 tokens, structured data only per agent output constraints)
  ```

---

#### 3C.4: Observability Sub-Agent (ALWAYS)

**Condition**: ALWAYS (essential for production AI)

Use the Task tool:
- **subagent_type**: `general-purpose`
- **description**: `Select observability platform`
- **prompt**:
  ```
  Invoke the observability sub-agent to recommend monitoring platform and metrics.

  Agent path: .claude/agents/ai-pattern-observability.md

  Inputs:
  - Budget: [Explicit budget or implied from monetization strategy]
  - Team size: [Number of engineers maintaining AI features]
  - Tech stack: [Backend language, existing monitoring (Datadog? New Relic?)]
  - Scale: [Request volume, users, interactions/day]
  - Quality requirements: [Mission-critical vs acceptable quality bar]
  - AI provider/model: [From Step 3B decisions]
  - Streaming: [Boolean - is streaming enabled?]

  Follow the agent specification to:
  1. Select observability platform (Helicone/Langfuse/LangSmith/Datadog)
  2. Define AI-specific metrics to track (latency, tokens, cost, quality)
  3. Specify streaming performance targets (if applicable)
  4. Design cost spike alerting and anomaly detection
  5. Coordinate with Session 14 (observability strategy)

  Return structured JSON output with:
  - Platform selection with rationale and cost
  - AI metrics to track (latency, cost, quality)
  - Alerting thresholds
  - Session 14 integration points
  (MAXIMUM 5000 tokens, structured data only per agent output constraints)
  ```

Session 14 Coordination: See `/reference-material/observability-platform-strategy.md` for detailed platform comparison and decision tree.

---

#### 3C.5: Security/Compliance Sub-Agent (CONDITIONAL)

**Condition**: Regulated industry (healthcare, finance, legal, enterprise SaaS) OR sensitive data handling (PII, PHI, financial data) OR HIPAA/GDPR/SOC2 mentioned in strategy or constraints

**Skip if**: Non-regulated, non-sensitive use cases

Use the Task tool:
- **subagent_type**: `general-purpose`
- **description**: `Design security and compliance guardrails`
- **prompt**:
  ```
  Invoke the security/compliance sub-agent to recommend OWASP mitigation and compliance patterns.

  Agent path: .claude/agents/ai-pattern-security-compliance.md

  Inputs:
  - Industry: [Healthcare, finance, legal, enterprise SaaS, consumer, education]
  - Regulations: [HIPAA, GDPR, SOC2, CCPA, PCI-DSS from strategy or Session 2a]
  - Data sensitivity: [Types of data processed - PII, PHI, financial, personal]
  - User base: [Geographic regions (EU = GDPR, US healthcare = HIPAA)]
  - Deployment: [Cloud APIs, self-hosted, hybrid]
  - Tech stack: [From Session 3 - for BAA/DPA coordination]

  Follow the agent specification to:
  1. Prioritize OWASP LLM Top 10 2025 risks by product context
  2. Design PII/PHI filtering patterns for regulated data
  3. Specify API key management and rotation policies
  4. Define audit logging requirements for AI decisions
  5. Design input/output validation patterns

  Return structured JSON output with:
  - OWASP LLM Top 10 mitigation strategies (prioritized)
  - PII filtering strategy (if applicable)
  - API key management approach
  - Audit logging requirements
  - Input/output validation patterns
  (MAXIMUM 5000 tokens, structured data only per agent output constraints)
  ```

**If condition NOT met**: Skip this agent. Document: "Skipping security/compliance (non-regulated, non-sensitive use case)"

---

#### 3C.6: Evaluation Sub-Agent (CONDITIONAL)

**Condition**: Quality bar = "mission-critical" or "high" in journey OR A/B testing mentioned in strategy OR regulated industry (accuracy requirements)

**Skip if**: Non-critical prototypes or acceptable quality bar

Use the Task tool:
- **subagent_type**: `general-purpose`
- **description**: `Design evaluation and testing strategy`
- **prompt**:
  ```
  Invoke the evaluation sub-agent to recommend testing frameworks and HITL patterns.

  Agent path: .claude/agents/ai-pattern-evaluation.md

  Inputs:
  - Quality requirements: [Mission-critical vs acceptable quality bar]
  - AI tasks: [Classification, generation, RAG, code generation]
  - Risk level: [High-stakes (medical, legal, financial) vs low-stakes (consumer)]
  - Team AI expertise: [Level of ML/testing experience]
  - Budget: [Implied testing budget from overall product budget]
  - Scale: [MVP vs production - affects eval set size]

  Follow the agent specification to:
  1. Select testing framework (DeepEval/Promptfoo/RAGAS)
  2. Design A/B testing strategy (business, learning, AI-specific metrics)
  3. Define human-in-the-loop patterns (confidence-based routing, approval flows)
  4. Specify feedback loop implementation for continuous improvement
  5. Design quality measurement and regression testing approach

  Return structured JSON output with:
  - Testing framework selection and rationale
  - A/B testing strategy with metrics
  - Human-in-the-loop patterns
  - Quality measurement approach
  (MAXIMUM 5000 tokens, structured data only per agent output constraints)
  ```

**If condition NOT met**: Skip this agent. Document: "Skipping evaluation framework (acceptable quality bar, non-critical use case)"

#### D. Cost Projection (Basic Formula)
Calculate baseline monthly costs:
```
users_per_day × interactions_per_user × (avg_input_tokens + avg_output_tokens) × 30 = monthly_tokens
monthly_cost = monthly_tokens × model_price_per_token
```

**Note**: Cost optimization sub-agent will provide detailed savings calculations (caching, routing) if invoked.

Validate against implied budget from monetization strategy.

#### E. Latency Feasibility
- API calls: 500ms-2s typical
- If <500ms required: Consider streaming, caching, or smaller models
- If <200ms required: Flag as potentially infeasible with LLMs

#### F. Compliance Approach
For regulated data:
- **Recommend**: APIs with appropriate agreements (BAA for HIPAA, DPA for GDPR)
- **Don't recommend**: Self-hosting by default (costs $200K+/year)
- List specific providers and their compliance offerings
- **Note**: Security/compliance sub-agent provides detailed mitigation patterns if invoked

### Step 4: Incrementally Synthesize Sub-Agent Outputs Into Comprehensive Strategy

**CRITICAL**: Process sub-agent outputs ONE AT A TIME to prevent context exhaustion (Issue #191 pattern).

**Incremental Synthesis Process**:

Process sub-agent outputs one at a time to prevent context exhaustion:

1. **For each invoked sub-agent (in order):**
   a. Parse JSON output from agent
   b. **Validate output format:**
      - Check output is <5000 tokens (approximate via length check)
      - Check output is valid JSON (parse test)
      - If validation fails: Log warning, request structured summary from agent
   c. Extract key decisions and recommendations
   d. Add to appropriate section in strategy document
   e. **Critical:** Do not hold full agent output in context. Once extracted and integrated, reference only the structured data added to the document.

2. **After all agents processed:**
   Generate final sections (Error Handling, MVP Plan, What We DIDN'T Choose, Scaling Triggers)

**Example incremental workflow:**
- Invoke RAG agent → receive JSON → validate format → extract pattern/vectorDB/chunking → write to Section 6 → continue
- Invoke Cost agent → receive JSON → validate format → extract caching/routing/savings → write to Section 7 → continue
- (Do NOT keep all 6 agent outputs in context simultaneously)

**Defense-in-depth pattern:** Validation step prevents context exhaustion if sub-agents produce verbose outputs despite format constraints.

Write to `product-guidelines/02c-ai-integration-strategy.md`:

**Structure the document with sections** (include only relevant sections based on which sub-agents were invoked):

1. **AI Feature Requirements** - Map to each journey step (from Step 1 analysis)
2. **Strategic Context** - From product strategy (Session 1)
3. **Implementation Pattern Decision** - With rationale (from Step 3A)
4. **Model Selection & Routing** - Specific models and why (from Step 3B)
5. **Cost Projections** - Baseline costs (from Step 3D formula)

**IF RAG sub-agent invoked** (3C.1):
6. **RAG Architecture** - Parse JSON from RAG agent → extract: pattern selection, vector DB, chunking strategy, retrieval optimization → integrate into section → release agent output

**IF Cost Optimization sub-agent invoked** (3C.2):
7. **Cost Optimization Strategy** - Parse JSON from cost agent → extract: caching strategy, routing logic, savings calculations → integrate into section → release agent output

**ALWAYS** (Prompt Engineering sub-agent invoked in 3C.3):
8. **Prompt Engineering Strategy** - Parse JSON from prompt agent → extract: framework, advanced patterns, versioning strategy → integrate into section → release agent output

**ALWAYS** (Observability sub-agent invoked in 3C.4):
9. **Monitoring & Observability** - Parse JSON from observability agent → extract: platform selection, metrics, alerting thresholds → integrate into section → release agent output

**IF Security/Compliance sub-agent invoked** (3C.5):
10. **Security & Compliance Guardrails** - Parse JSON from security agent → extract: OWASP mitigation, PII filtering, audit logging → integrate into section → release agent output

**IF Evaluation sub-agent invoked** (3C.6):
11. **Testing & Evaluation** - Parse JSON from evaluation agent → extract: testing framework, A/B strategy, HITL patterns → integrate into section → release agent output

**ALWAYS** (generated by orchestrator):
12. **Error Handling & Fallbacks** - Graceful degradation patterns (timeout → cached response, low confidence → human review)
13. **MVP Implementation Plan** - Phased approach (Phase 1: Core AI feature with prompt engineering + observability, Phase 2: Add conditional optimizations)
14. **What We DIDN'T Choose** - Alternatives and why not (from sub-agent recommendations)
15. **Scaling Triggers** - When to revisit strategy (usage thresholds, cost triggers from observability/cost agents)

Every recommendation must:
- Reference specific journey requirements
- Show cost calculations (baseline + optimized if cost sub-agent invoked)
- Be realistic about constraints
- Distinguish MVP from future optimizations
- Trace decisions to sub-agent recommendations where applicable

### Step 5: Generate Context Version

After writing the full strategy, invoke the distillation sub-agent:

```bash
Task tool with:
- subagent_type: distill-context
- Source file: product-guidelines/02c-ai-integration-strategy.md
- Output file: product-guidelines/02c-ai-integration-strategy.ctx.md
```

The distillation agent will create a condensed version with actionable decisions only (no rationale):
- Implementation pattern
- Model selection table
- System prompt templates
- RAG configuration (if applicable)
- Caching rules
- Rate limits
- Fallback chain
- Security guardrails
- Cost budget and alerts
- Monitoring setup
- Compliance config (if applicable)
- MVP priorities

### Step 6: Update Tech Stack File

**CRITICAL CASCADE STEP**: Now that you've made all AI decisions, update the tech stack file to complete the cascade.

Read `product-guidelines/02-tech-stack.md` and update the AI Integration line:

**From:**
```
**AI Integration**: Required
```

**To:**
```
**AI**: [Provider and Model] (defined in Session 3c)
```

For example:
- `**AI**: Claude Sonnet 4.5 (defined in Session 3c)`
- `**AI**: GPT-4o mini + Claude Haiku (defined in Session 3c)`
- `**AI**: Gemini Pro 1.5 (defined in Session 3c)`

Also add a brief note referencing Session 3c:
```
> **AI Strategy**: See `product-guidelines/02c-ai-integration-strategy.md` for full implementation details including RAG architecture, cost projections, and security guardrails.
```

This ensures that:
1. Later sessions (4, 7, 8, 9b, 10, 12) have AI provider context in tech stack
2. Tech stack file remains the "single source of truth" for stack summary
3. Session 3c context file provides detailed implementation guidance

### Step 7: Validate Output

Before finalizing:
1. **Cost validation**: Does estimated cost fit budget?
2. **Latency validation**: Can architecture meet requirements?
3. **Infrastructure validation**: Does tech stack support recommendations?
4. **Team validation**: Does team have required expertise?
5. **Tech stack updated**: Did you successfully update `02-tech-stack.md` with AI provider?

Flag any concerns prominently in the output.

### Step 8: Set Next Steps

Inform the user:
- [✓] Generated `product-guidelines/02c-ai-integration-strategy.md`
- [✓] Generated `product-guidelines/02c-ai-integration-strategy.ctx.md`
- [✓] Updated `product-guidelines/02-tech-stack.md` with AI provider selection
- Note: This strategy will inform Sessions 4, 7, 8, 9b, 10, 12, 13, and 14
- -> Next: Run `/generate-strategy` to define mission, metrics, monetization, and architecture

## Quality Standards

Your output must be:
- **Journey-specific**: Every decision traces to journey requirements
- **Cost-transparent**: Show the math, validate against budget
- **Technically honest**: Flag impossibilities, suggest alternatives
- **MVP-focused**: Don't over-engineer the initial implementation
- **Compliance-correct**: APIs with agreements, not automatic self-hosting

## Example Pattern Application

**IF** journey shows: "User uploads compliance documents for AI analysis"
**THEN** recommend:
- Pattern: RAG architecture (documents need semantic search)
- Model: Claude Sonnet (accuracy critical for compliance)
- Vector DB: pgvector (already using PostgreSQL)
- Cost: Show calculation for document processing volume
- Compliance: API with zero retention configuration

## Edge Cases

**AI Integration Not Required**:
```
Output: "Your tech stack shows 'AI Integration: Not Required'. This session is only needed if AI is required for your journey. Skipping Session 3c and proceeding to Session 4.

Next: Run `/generate-strategy` to define mission, metrics, monetization, and architecture."
Exit without generating files.
```

**AI Integration field missing**:
```
Output: "Could not find 'AI Integration' field in tech stack. Please re-run `/choose-tech-stack` to update your tech stack with the correct format."
Exit without generating files.
```

**Costs exceed budget by >3x**:
```
Flag prominently with mitigation options:
1. Use smaller model (show savings)
2. Reduce feature scope (specify what to defer)
3. Increase budget (justify with ROI)
```

**Latency impossible**:
```
Flag if <200ms required with cloud APIs.
Suggest: Streaming, caching, or adjust requirements.
```

Remember: You're not explaining AI in general. You're analyzing THEIR specific product and recommending the optimal AI strategy for THEIR journey, constraints, and goals.

## After Generating AI Integration Strategy Document

Once you've written `product-guidelines/02c-ai-integration-strategy.md`, invoke the distillation agent to create a context file:

Use the Task tool:
- **subagent_type**: `general-purpose`
- **description**: `Generate AI strategy context file`
- **prompt**:
  ```
  Invoke the context distillation agent to create token-optimized context file.

  Source file: product-guidelines/02c-ai-integration-strategy.md
  Output file: product-guidelines/02c-ai-integration-strategy.ctx.md

  Follow the distillation agent specification in .claude/agents/distill-context.md to:
  1. Extract ALL AI decisions: provider, model, pattern, vector DB (CRITICAL - never remove)
  2. Extract cost projections and security approach
  3. Remove rationale for alternatives considered, detailed tradeoffs
  4. Preserve section structure from source file
  5. Achieve 60-70% token reduction
  6. Add source reference header
  7. Write to output file path
  ```

## Output Format

IMPORTANT: Do not use emojis in generated outputs. Use plain text for all communication.
