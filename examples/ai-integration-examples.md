# AI Integration Strategy Examples

This file provides three comprehensive examples of AI integration strategies for different journey archetypes. Sub-agents reference these examples when providing recommendations.

**Purpose**: Centralized examples prevent duplication across sub-agents and demonstrate how AI decisions trace back to specific user journey requirements.

---

## Example 1: RAG-Heavy Use Case (Compliance Document Analysis)

### Journey Context

**Product**: ComplianceAI - Regulatory document analysis for compliance officers

**User Journey**:
- **Before**: Compliance officers spend 4 hours manually reviewing 100-page regulatory documents for GDPR compliance gaps
- **After**: Upload document → AI analyzes in 60 seconds → Highlights specific compliance gaps with regulation citations
- **Value Ratio**: 240x faster (4 hours → 60 seconds)

**Key Journey Steps**:
1. Officer uploads regulatory document (PDF, 50-200 pages)
2. AI extracts text and chunks document (1,024 token chunks)
3. AI searches for data processing practices
4. AI cross-references against GDPR articles
5. AI flags compliance gaps with severity levels
6. Officer reviews findings and takes action

### AI Integration Strategy (Session 3c Output)

#### Implementation Pattern

**Pattern**: Modular RAG with Hybrid Search (vector + BM25)

**Rationale**:
- Journey requires semantic understanding ("data processing" vs "personal data handling")
- AND exact term matching (GDPR Article 17 vs Article 18)
- Production quality requirements (customer-facing, compliance-critical)
- Hybrid RAG provides both concept matching and keyword precision

---

#### RAG Architecture (from ai-pattern-rag-architecture sub-agent)

**RAG Variant**: Modular RAG
- Separate indexing pipeline (optimize document processing offline)
- Query pipeline with metadata filtering (date ranges, document types)
- Reranking for top-k quality improvement

**Vector Database**: pgvector
- Decision Criteria:
  - Already using PostgreSQL for user/document data
  - Keep vectors with relational data (documents, users, findings)
  - Zero additional infrastructure costs
- Cost: $0 (PostgreSQL extension)

**Chunking Strategy**:
- **Chunk Size**: 1,024 tokens
- **Rationale**: Complex compliance analysis requires sufficient context to understand data processing practices
- **Approach**: Semantic chunking (respect section boundaries in regulatory documents)
- **Overlap**: 100 tokens (prevent information loss at boundaries)

**Hybrid Search**:
- **Vector Search**: Semantic similarity for concepts ("data retention" matches "storage limitation")
- **BM25 Keyword Search**: Exact matches for regulation numbers ("GDPR Article 17")
- **Fusion**: Reciprocal Rank Fusion (RRF) to combine results

**Retrieval Optimization**:
- **Reranking**: Cohere Rerank (improves top-5 precision by 20%)
- **Lost-in-the-middle mitigation**: Place most relevant chunks at start/end of context
- **Cost**: +$0.001 per query (reranking), +100ms latency

---

#### Cost Optimization (from ai-pattern-cost-optimization sub-agent)

**Baseline Cost** (without optimization):
- 50 compliance officers × 20 documents/month × 5 queries/document = 5,000 queries/month
- Average query: 8,000 tokens input (retrieved context) + 500 tokens output = 8,500 tokens
- Model: Claude Sonnet 4.5 ($3 input / $15 output per 1M tokens)
- Cost: (5,000 × 8,000 / 1M × $3) + (5,000 × 500 / 1M × $15) = $120 + $37.50 = **$157.50/month**

**Semantic Caching Strategy**:
- **Safe to Cache**: Document structure analysis (same doc → same structure), general GDPR article lookups
- **Never Cache**: Personalized findings, time-sensitive compliance updates
- **Expected Hit Rate**: 45% (lower than typical due to document uniqueness)
- **Cached Cost**: $157.50 × (1 - 0.45) = $86.63/month
- **Savings**: $70.87/month (45% reduction)

**Model Routing**: Not applicable (all queries require accuracy - no room for cheaper models)

**Net Monthly Cost**: ~$87/month (well within $500/month budget)

---

#### Prompt Engineering (from ai-pattern-prompt-engineering sub-agent)

**Six-Component Framework**:

1. **Task Definition**:
   ```
   You are a GDPR compliance analyst with expertise in data privacy regulations.
   Your task is to review documents and identify compliance gaps or risks.
   ```

2. **Tone/Style**:
   ```
   Tone: Technical and precise
   Style: Structured findings with regulation citations
   Audience: Compliance officers and legal teams
   ```

3. **Background Context**:
   ```
   Context:
   - Regulation: GDPR (General Data Protection Regulation)
   - Focus: Articles 5-17 (core principles, rights, obligations)
   - Company operates in: EU
   - Industry: [from user profile]

   Retrieved documents:
   <document id="1">[Chunk 1 from vector search]</document>
   <document id="2">[Chunk 2 from vector search]</document>
   ```

4. **Instructions**:
   ```
   Instructions:
   1. Read the retrieved document sections carefully
   2. Identify all data processing practices mentioned
   3. For each practice, check compliance with GDPR articles:
      - Article 5: Principles (lawfulness, fairness, transparency)
      - Article 6: Legal basis for processing
      - Article 13-14: Information to data subjects
      - Article 17: Right to erasure
   4. Flag any missing requirements or gaps
   5. Assign severity: Critical (legal violation), Moderate (best practice gap), Low (minor improvement)
   6. Cite specific GDPR articles for each finding
   ```

5. **Few-Shot Examples**:
   ```
   Example 1:
   Input: "We collect email addresses for marketing purposes."
   Output: "Gap: Missing explicit consent mechanism. GDPR Article 6(1)(a) requires clear affirmative action for marketing. Severity: Critical"

   Example 2:
   Input: "User data is retained for analytics."
   Output: "Gap: No retention period specified. GDPR Article 5(1)(e) requires storage limitation with defined periods. Severity: Critical"
   ```

6. **Output Format**:
   ```
   Return JSON:
   {
     "findings": [
       {
         "practice": "string (data processing practice identified)",
         "gap": "string (compliance issue)",
         "article": "string (GDPR Article X)",
         "severity": "Critical|Moderate|Low",
         "recommendation": "string (action to take)"
       }
     ]
   }
   ```

**Advanced Pattern**: Chain-of-Thought for complex analysis
```
Think through your analysis step-by-step within <thinking> tags:
<thinking>
1. Identify data processing practice
2. Determine applicable GDPR article
3. Check if practice meets requirements
4. If gap exists, assess severity
5. Formulate recommendation
</thinking>

<findings>
[JSON output here]
</findings>
```

---

#### Security & Compliance (from ai-pattern-security-compliance sub-agent)

**Regulatory Context**: GDPR (EU data privacy) + SOC2 (enterprise SaaS customers)

**OWASP LLM Top 10 Mitigation**:

1. **Prompt Injection** (CRITICAL):
   - Use XML tags to separate instructions from document content
   - Validate outputs match expected JSON schema only
   - Monitor for system prompt leakage attempts

2. **Sensitive Information Disclosure** (CRITICAL):
   - Use AWS Bedrock Claude with zero retention + DPA
   - PII filtering before LLM (redact names, emails in documents)
   - Output scanning (ensure no PII in findings)

3. **Supply Chain** (MEDIUM):
   - AWS Bedrock SOC2 Type 2 certified
   - DPA signed for GDPR compliance

**PII Filtering**:
```python
# Before sending document to LLM
filtered_doc, redactions = pii_filter.filter(document_text)
# Patterns: names (NER), emails, phone numbers

# Send filtered doc to LLM
llm_response = analyze_document(filtered_doc)
```

**API Key Management**:
- AWS Secrets Manager for Bedrock credentials
- Rotation every 30 days
- Separate keys per environment (dev/prod)

**Audit Logging** (GDPR Article 30 - Records of Processing):
```python
audit_log = {
    "timestamp": "2025-02-02T14:30:00Z",
    "officer_id": "user_789",
    "document_id": "doc_456",
    "model": "claude-sonnet-4.5",
    "input_hash": sha256(document),  # NOT actual doc (PII risk)
    "findings_count": 5,
    "critical_findings": 2,
    "cost": 0.045
}
# Retention: 6 years (GDPR Article 30 requirement)
```

---

#### Observability (from ai-pattern-observability sub-agent)

**Platform**: Langfuse (50K events/month free tier)

**Decision Criteria**:
- Need detailed prompt tracking (compliance audit trail)
- User feedback collection (officers rate findings quality)
- Self-host option for data sovereignty if needed
- Budget: Free tier covers 5,000 queries/month

**AI-Specific Metrics**:
- **Latency**: P50 <3s, P95 <8s (acceptable for 100-page doc analysis)
- **Cost per Analysis**: ~$0.03 per document
- **Quality**: Thumbs up target >80% (officers approve findings)
- **Fallback Rate**: <5% (low confidence → human review)

**Alerting**:
- Cost: Alert if daily cost >$10 (3x expected)
- Quality: Alert if thumbs down rate >30%
- Latency: Alert if P95 >15s (indicates infrastructure issue)

---

#### Evaluation (from ai-pattern-evaluation sub-agent)

**Testing Framework**: RAGAS (RAG pipeline evaluation)

**Metrics**:
- **Context Relevance**: Target >0.85 (retrieved chunks are relevant)
- **Answer Faithfulness**: Target >0.90 (findings grounded in document)
- **Answer Correctness**: Target >0.80 (findings match human expert labels)

**Evaluation Set**:
- 100 labeled documents (human expert identifies compliance gaps)
- Run RAGAS eval on every prompt change
- Block deployment if faithfulness <0.85

**Human-in-the-Loop**:
- Confidence-based routing:
  ```
  if confidence > 0.9: auto_display_findings()
  elif confidence > 0.7: flag_for_officer_review()
  else: route_to_legal_expert()
  ```

**A/B Testing**:
- Test: Hybrid RAG (v1.3) vs Vector-only RAG (v1.2)
- Metrics: Context relevance, user satisfaction, latency
- Decision: Hybrid improved relevance by 15%, worth +200ms latency

---

#### MVP Implementation Plan

**Phase 1 (Weeks 1-3)**: Core RAG
- Implement vector search with pgvector
- Basic prompt with 6-component framework
- Helicone for cost tracking
- Deploy to 5 beta users

**Phase 2 (Weeks 4-6)**: Hybrid Search + Quality
- Add BM25 keyword search
- Implement reranking (Cohere)
- Add chain-of-thought prompting
- Expand to 20 users

**Phase 3 (Weeks 7-8)**: Optimization + Scale
- Implement semantic caching (45% savings)
- Add confidence-based routing to legal experts
- Migrate to Langfuse for detailed tracking
- Launch to all 50 officers

---

## Example 2: High-Volume Classification (Customer Support Ticket Routing)

### Journey Context

**Product**: SupportFlow - Automated support ticket routing for SaaS companies

**User Journey**:
- **Before**: 500 support tickets/day manually routed by agents, 2-3 min/ticket = 16-25 hours of manual work
- **After**: AI instantly classifies tickets → routes to correct team → agents respond immediately
- **Value Ratio**: 100% of routing time saved, 50% faster response time

**Key Journey Steps**:
1. Customer submits support ticket (email or chat)
2. AI classifies ticket (billing, technical, account, feature_request)
3. AI assigns priority (low, medium, high)
4. AI routes to appropriate team queue
5. Agent receives pre-classified ticket and responds

### AI Integration Strategy (Session 3c Output)

#### Implementation Pattern

**Pattern**: Direct API with Model Routing + Semantic Caching

**Rationale**:
- Simple classification task (4 categories)
- High volume (500 tickets/day = 15,000/month)
- Cost-sensitive (freemium SaaS product)
- Model routing can reduce costs by 70% (most tickets are simple)

---

#### Cost Optimization (from ai-pattern-cost-optimization sub-agent)

**Baseline Cost** (without optimization):
- 15,000 tickets/month
- Average: 200 input tokens (ticket text) + 50 output tokens (JSON classification) = 250 tokens
- Model: Claude Sonnet 4.5 ($3 input / $15 output per 1M tokens)
- Cost: (15,000 × 200 / 1M × $3) + (15,000 × 50 / 1M × $15) = $9 + $11.25 = **$20.25/month**

**Semantic Caching Strategy**:
- **Safe to Cache**: FAQ-style tickets ("How do I reset my password?", "What are your hours?")
- **Never Cache**: User-specific issues, transactional confirmations
- **Expected Hit Rate**: 73% (support tickets are repetitive)
- **Cached Cost**: $20.25 × (1 - 0.73) = $5.47/month
- **Savings**: $14.78/month (73% reduction)

**Model Routing Strategy**:
- **Simple tickets** (80% of volume): GPT-4o mini ($0.15 input / $0.60 output per 1M tokens)
- **Complex tickets** (20% of volume): Claude Sonnet 4.5
- **Routing logic**: Ticket length <100 chars + no technical keywords → mini; else → Sonnet

**Cost with Caching + Routing**:
```python
# After 73% caching: 27% require LLM = 4,050 tickets/month
cache_misses = 15,000 × 0.27 = 4,050

# 80% to GPT-4o mini, 20% to Claude Sonnet
mini_tickets = 4,050 × 0.80 = 3,240
sonnet_tickets = 4,050 × 0.20 = 810

# Costs
mini_cost = (3,240 × 200 / 1M × $0.15) + (3,240 × 50 / 1M × $0.60) = $0.10 + $0.10 = $0.20
sonnet_cost = (810 × 200 / 1M × $3) + (810 × 50 / 1M × $15) = $0.49 + $0.61 = $1.10

total_cost = $0.20 + $1.10 = $1.30/month
savings = $20.25 - $1.30 = $18.95/month (94% reduction)
```

**Net Monthly Cost**: ~$1.30/month + $15 (Redis caching) = **$16.30/month total**

---

#### Prompt Engineering (from ai-pattern-prompt-engineering sub-agent)

**Six-Component Prompt** (optimized for classification):

```python
system_prompt = """
You are a customer support specialist who categorizes incoming support tickets.

Tone: Professional and efficient
Output: JSON only (no explanatory text)

Categories:
- billing: Payment, subscription, invoicing issues
- technical: Bugs, errors, performance problems
- account: Login, password, user management
- feature_request: Product suggestions, new features

Instructions:
1. Read the ticket text
2. Identify the primary issue
3. Assign category and confidence (0.0-1.0)
4. Assign priority based on urgency keywords
5. Return JSON with category, confidence, priority

Output format:
{
  "category": "billing|technical|account|feature_request",
  "confidence": 0.0-1.0,
  "priority": "low|medium|high"
}
"""

# User query (prefilling forces JSON structure)
user_message = f"Classify this ticket: {ticket_text}"
assistant_prefill = '{"category": "'  # Forces JSON output
```

**Token Optimization**:
- System prompt cached (free after first call)
- User message minimal (only ticket text, no instructions)
- Prefilling prevents "Here is the classification:" preambles
- Max tokens: 50 (classification only needs short JSON)

**Savings**: 70% input token reduction via system prompt caching

---

#### Observability (from ai-pattern-observability sub-agent)

**Platform**: Helicone (10K requests/month free, then $20/month for 100K)

**Decision Criteria**:
- Fastest setup (1 line of code)
- Built-in semantic caching (no separate implementation)
- Real-time cost tracking (critical for freemium model)
- Budget: Free tier covers 10K, then $20/month (15K tickets)

**Metrics**:
- **Latency**: P50 <500ms, P95 <1.5s (instant routing)
- **Cost per Ticket**: $0.001 (after caching + routing)
- **Accuracy**: >95% (matches human classification)
- **Routing**: 80% to GPT-4o mini (validates routing logic)

---

#### Evaluation (from ai-pattern-evaluation sub-agent)

**Testing Framework**: DeepEval (regression testing in CI/CD)

**Evaluation Set**: 200 labeled tickets (human expert classified)

**Metrics**:
- **Accuracy**: Target >95%
- **Precision per category**: >90% (avoid misrouting)
- **Confidence calibration**: High confidence (>0.9) should have >98% accuracy

**Regression Testing**:
```bash
# Run on every deploy
pytest tests/classification_tests.py

# Block deployment if accuracy <0.93
```

**A/B Testing**:
- Test: Prefilling (v1.2) vs No prefilling (v1.1)
- Result: Prefilling improved JSON consistency from 92% → 99.5%
- Decision: Deploy v1.2 (prefilling)

---

## Example 3: Code Generation (Developer Tools with Chain-of-Thought)

### Journey Context

**Product**: BoilerplateAI - CRUD code generation for backend developers

**User Journey**:
- **Before**: Developers spend 30 minutes writing boilerplate CRUD operations (create, read, update, delete) for each database entity
- **After**: Describe entity → AI generates TypeScript API routes + database queries + tests in 2 minutes
- **Value Ratio**: 15x faster (30 min → 2 min)

**Key Journey Steps**:
1. Developer describes entity (e.g., "User with email, password, role")
2. AI generates TypeScript types/interfaces
3. AI generates Next.js API routes (create, read, update, delete)
4. AI generates Drizzle ORM database queries
5. AI generates 3-5 unit test cases
6. Developer reviews code diff and approves

### AI Integration Strategy (Session 3c Output)

#### Implementation Pattern

**Pattern**: Function Calling with Chain-of-Thought

**Rationale**:
- Code generation requires multi-step reasoning (types → routes → queries → tests)
- Chain-of-thought improves code quality by 20% (shows planning)
- Human-in-the-loop approval (show diff before applying)

---

#### Model Selection

**Model**: Claude Sonnet 4.5

**Rationale**:
- Best SWE-bench scores (43.5% vs GPT-4o 38.2%)
- Excellent TypeScript and framework understanding
- Longer context window for reading existing codebase patterns

**Cost**: $3 input / $15 output per 1M tokens

---

#### Cost Projection (from ai-pattern-cost-optimization sub-agent)

**Usage**:
- 20 developers × 5 entities/week × 4 weeks = 400 generations/month
- Average: 3,000 input tokens (entity spec + codebase context) + 2,000 output tokens (generated code) = 5,000 tokens

**Baseline Cost**:
- Input: (400 × 3,000 / 1M) × $3 = $3.60
- Output: (400 × 2,000 / 1M) × $15 = $12.00
- **Total**: $15.60/month

**Caching**: Not applicable (each entity is unique, low cache hit rate)

**Model Routing**: Not applicable (always use best model for code quality)

**Net Monthly Cost**: ~$16/month (well within budget)

---

#### Prompt Engineering (from ai-pattern-prompt-engineering sub-agent)

**Chain-of-Thought Pattern**:

```python
system_prompt = """
You are an expert TypeScript engineer specializing in Next.js 14 and Drizzle ORM.

Your task is to generate production-ready CRUD operations for a database entity.

Tech Stack Context:
- Framework: Next.js 14 with App Router
- Database: PostgreSQL with Drizzle ORM
- Auth: NextAuth.js with session-based auth
- Testing: Vitest

Instructions:
Think through your implementation step-by-step within <thinking> tags:

<thinking>
1. Analyze the entity specification and identify fields
2. Design the TypeScript types/interfaces
3. Plan the API routes (POST, GET, PATCH, DELETE)
4. Design database queries with Drizzle ORM
5. Identify edge cases for error handling
6. Plan 3-5 unit test cases
</thinking>

Then generate code in this order:
<code>
1. Type definitions (types.ts)
2. API routes (app/api/[entity]/route.ts)
3. Database queries (db/queries/[entity].ts)
4. Unit tests (tests/[entity].test.ts)
</code>

Output format:
Return code blocks with clear file paths. No markdown code fences outside the code.
"""

user_message = f"""
Entity: {entity_name}
Fields: {entity_fields}

Existing codebase patterns:
{read_codebase_examples()}
"""
```

**Example with Chain-of-Thought**:

```
User: Entity "User" with fields: email (string), password (string), role (enum: admin, user)

AI Output:

<thinking>
1. Entity analysis:
   - Primary key: id (auto-generated UUID)
   - Unique constraint: email
   - Password should be hashed (never store plain text)
   - Role enum limits values to admin/user

2. Type design:
   - CreateUserInput (email, password, role)
   - User (id, email, hashedPassword, role, createdAt)
   - Exclude password from API responses (security)

3. API routes:
   - POST /api/users - Create user (hash password, check email uniqueness)
   - GET /api/users/[id] - Get user by ID (exclude password)
   - PATCH /api/users/[id] - Update user (re-hash if password changed)
   - DELETE /api/users/[id] - Delete user (soft delete with deletedAt?)

4. Database queries:
   - insertUser(data) - Drizzle insert with hashed password
   - selectUserById(id) - Drizzle select with password excluded
   - updateUser(id, data) - Drizzle update with partial data
   - deleteUser(id) - Drizzle delete

5. Edge cases:
   - Email already exists → 409 Conflict
   - User not found → 404 Not Found
   - Invalid role → 400 Bad Request
   - Unauthorized access → 401 Unauthorized

6. Test cases:
   - Create user with valid data → 201 Created
   - Create user with duplicate email → 409 Conflict
   - Get user by ID → 200 OK with user data (no password)
   - Update user role → 200 OK
   - Delete user → 204 No Content
</thinking>

<code>
// types/user.ts
export enum UserRole {
  ADMIN = 'admin',
  USER = 'user'
}

export interface CreateUserInput {
  email: string
  password: string
  role: UserRole
}

export interface User {
  id: string
  email: string
  role: UserRole
  createdAt: Date
}

// db/schema/user.ts
import { pgTable, uuid, varchar, timestamp, pgEnum } from 'drizzle-orm/pg-core'

export const userRoleEnum = pgEnum('user_role', ['admin', 'user'])

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  hashedPassword: varchar('hashed_password', { length: 255 }).notNull(),
  role: userRoleEnum('role').notNull().default('user'),
  createdAt: timestamp('created_at').notNull().defaultNow()
})

// ... [API routes, queries, tests continue] ...
</code>
```

**Benefits of CoT**:
- +20% code quality (fewer bugs, better error handling)
- Easier to debug (see AI's reasoning)
- Developer trust (shows planning process)

**Costs**:
- +500 tokens per generation (thinking tokens)
- +$0.01 per generation (worth it for quality)

---

#### Evaluation (from ai-pattern-evaluation sub-agent)

**Testing Framework**: Promptfoo (rapid prompt iteration)

**A/B Testing**:
- Test: Chain-of-thought (v2.0) vs No CoT (v1.0)
- Metrics:
  - Code quality (passes tests): v2.0 = 92%, v1.0 = 76%
  - Developer acceptance rate: v2.0 = 85%, v1.0 = 68%
  - Latency: v2.0 = 8s, v1.0 = 5s
- Decision: Deploy v2.0 (quality justifies +3s latency)

**Human-in-the-Loop**:
- ALWAYS show code diff for developer approval
- Never auto-apply generated code
- Track: acceptance rate, modification rate, rejection rate

**Feedback Loop**:
- Collect: accepted code, rejected code, modifications made
- Use rejected examples to improve prompts
- Quarterly review: identify common failure patterns

---

## Key Takeaways Across Examples

### Pattern Selection by Journey

- **Document analysis** (Example 1) → RAG (needs semantic search over documents)
- **Classification** (Example 2) → Direct API (simple categorization)
- **Code generation** (Example 3) → Function calling with CoT (complex multi-step reasoning)

### Cost Optimization by Volume

- **Low volume** (<1K requests/month) → No optimization needed
- **Medium volume** (1-15K/month) → Semantic caching (60-73% savings)
- **High volume** (>15K/month) → Caching + model routing (85-94% savings)

### Model Selection by Task

- **Accuracy-critical** (compliance, legal) → Claude Sonnet 4.5 (best quality)
- **High-volume simple** (classification) → GPT-4o mini with routing (80% cheaper)
- **Code generation** (SWE tasks) → Claude Sonnet 4.5 (best SWE-bench scores)

### Observability by Stage

- **MVP** (<10K requests/month) → Helicone free tier (quick setup, cost tracking)
- **Production** (10-50K/month) → Langfuse (detailed traces, feedback collection)
- **Enterprise** (existing Datadog) → Datadog LLM (unified monitoring)

### Security by Industry

- **Regulated** (HIPAA, GDPR) → PII filtering, audit logging, zero retention, BAA/DPA
- **Enterprise SaaS** → SOC2 compliance, API key rotation, OWASP mitigation
- **Consumer** → Basic input validation, rate limiting

### Evaluation by Risk Level

- **High-stakes** (medical, legal, financial) → Human-in-the-loop (confidence-based approval)
- **Mission-critical** (compliance, accuracy) → Comprehensive eval set (500+ examples), RAGAS
- **Low-risk** (consumer features) → Basic A/B testing (100-example eval set), user feedback
