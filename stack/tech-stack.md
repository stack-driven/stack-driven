# Technical Stack: Opinionated Recommendations

> Technology choices should serve user needs, not developer preferences. This guide provides battle-tested stack recommendations optimized for speed, reliability, and maintainability.

---

## The Stack-Driven Philosophy

### Choose Boring Technology (Mostly)

**Rule**: Use proven, boring technology for 90% of your stack. Reserve innovation budget for your unique value proposition.

**Why:**
- Boring = documented, debugged, community support
- Exotic = you're the QA team
- Your innovation should be in solving user problems, not infrastructure

### Optimize for These Priorities

1. **Speed to Value**: How fast can you ship value to users?
2. **Developer Experience**: Can you hire for this? Is debugging painful?
3. **Operational Simplicity**: Can you sleep at night?
4. **Cost Efficiency**: Does this scale economically?
5. **Future Flexibility**: Can you evolve without rewrites?

---

## The Opinionated Stack

### For Most Modern Web Products

```markdown
Frontend:    Next.js (React)
Backend:     FastAPI (Python) or Node/Express (TypeScript)
Database:    PostgreSQL
Cache:       Redis
Storage:     S3 (or equivalent)
AI:          Anthropic Claude via API
Queue:       Redis + BullMQ
Auth:        Clerk or Auth0
Hosting:     Vercel (frontend) + Railway/Render (backend)
Monitoring:  Sentry + PostHog
```

**Why This Stack:**
- ✅ Fast development velocity
- ✅ Excellent developer experience
- ✅ Proven at scale (millions of users)
- ✅ Rich ecosystem and community
- ✅ Can hire developers easily
- ✅ Generous free tiers for MVP
- ✅ Clear upgrade path to enterprise

---

## Layer-by-Layer Recommendations

### Frontend: Next.js

**Why Next.js:**
- Server-side rendering (SSR) for performance and SEO
- File-based routing (simple, intuitive)
- API routes for backend functions
- Excellent TypeScript support
- Deploy to Vercel with zero config
- React ecosystem (largest component library)

**When to Choose Differently:**

**Use SvelteKit if:**
- Team prefers simpler mental model than React
- Need extremely small bundle sizes
- Writing lots of interactive UI

**Use vanilla HTML/Alpine.js if:**
- Ultra-simple product (few interactions)
- Marketing site with light interactivity
- SEO is paramount, complexity is minimal

**Styling: Tailwind CSS**
- Utility-first (fast development)
- Small production bundle
- Consistent design system
- No context switching between CSS and HTML

**State Management: Start Simple**
- MVP: React Context + useState
- Growing: Zustand (simple) or Jotai (atomic)
- Complex: Avoid Redux unless you must

---

### Backend: FastAPI (Python) or Node/Express (TypeScript)

**Choose FastAPI (Python) if:**
- Heavy AI/ML integration (Claude, OpenAI, ML models)
- Data processing/analysis
- Team knows Python
- Auto-generated API docs needed (OpenAPI)

**Why FastAPI:**
```python
from fastapi import FastAPI

app = FastAPI()

@app.post("/assess")
async def assess_document(doc: Document):
    result = await claude.assess(doc)
    return result
```
- Async by default (performant)
- Type hints = automatic validation
- Auto-generated OpenAPI spec
- Fast to write, fast to run

**Choose Node/Express (TypeScript) if:**
- Sharing types between frontend/backend
- Real-time features (WebSockets)
- Team knows JavaScript/TypeScript
- Lots of I/O-bound operations

**Why Node/Express:**
```typescript
import express from 'express';

const app = express();

app.post('/assess', async (req, res) => {
  const result = await claude.assess(req.body);
  res.json(result);
});
```
- Same language as frontend
- Huge ecosystem (npm)
- Great for I/O-heavy workloads
- Easy deployment

**API Pattern: RESTful with Clear Conventions**
```
GET    /api/v1/assessments
GET    /api/v1/assessments/:id
POST   /api/v1/assessments
PUT    /api/v1/assessments/:id
DELETE /api/v1/assessments/:id
```

---

### Database: PostgreSQL

**Why PostgreSQL:**
- Most reliable open-source database
- Rich feature set (JSON, full-text search, arrays)
- Scales to billions of rows
- ACID compliant (data integrity)
- Excellent tooling (pgAdmin, Postico)

**Hosting Options:**
- **MVP**: Render, Railway, Supabase (generous free tiers)
- **Growth**: AWS RDS, Google Cloud SQL
- **Scale**: AWS Aurora, managed Postgres

**Schema Pattern: Normalized with Strategic Denormalization**
```sql
-- Core entities normalized
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE assessments (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  document_url TEXT,
  status TEXT,
  result JSONB, -- Flexible for AI results
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes on query patterns
CREATE INDEX idx_assessments_user_id ON assessments(user_id);
CREATE INDEX idx_assessments_status ON assessments(status);
```

**When to Use Different Databases:**

**MongoDB if:**
- Schema is truly unpredictable
- Document-heavy workflows
- BUT: PostgreSQL JSONB can handle 90% of these cases

**DynamoDB if:**
- Serverless architecture (AWS Lambda)
- Need predictable single-digit ms latency
- Simple key-value access patterns

---

### Cache: Redis

**Why Redis:**
- In-memory speed (<1ms latency)
- Pub/sub for real-time features
- Session storage
- Rate limiting
- Background job queue

**Use Cases:**
```python
# Session cache
await redis.setex(f"session:{user_id}", 3600, session_data)

# Rate limiting
requests = await redis.incr(f"rate:{user_id}:{minute}")
if requests > 100:
    raise RateLimitError()

# Background jobs (with BullMQ)
await queue.add('assess-document', {doc_id: '123'})
```

**Hosting:**
- **MVP**: Upstash (generous free tier, serverless)
- **Growth**: Redis Cloud, AWS ElastiCache

---

### Object Storage: S3 (or equivalent)

**Why S3:**
- Unlimited scalable storage
- 99.999999999% durability
- Global CDN integration
- Industry standard

**Use Cases:**
- Document uploads
- Generated reports
- User assets
- Backups

**Alternatives:**
- Cloudflare R2 (S3-compatible, no egress fees)
- Google Cloud Storage
- Azure Blob Storage

**Pattern:**
```python
# Generate presigned upload URL (secure)
upload_url = s3.generate_presigned_url(
    'put_object',
    Params={'Bucket': 'docs', 'Key': doc_id},
    ExpiresIn=300
)

# User uploads directly to S3 (not through your server)
```

---

### AI: Anthropic Claude via API

**Why Claude:**
- Best reasoning capabilities
- Long context windows (200K+ tokens)
- Strong instruction following
- Reasonable cost
- Anthropic's commitment to safety

**Implementation Pattern:**
```python
import anthropic

client = anthropic.Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])

response = client.messages.create(
    model="claude-sonnet-4",
    max_tokens=4096,
    messages=[{
        "role": "user",
        "content": f"Assess this document for compliance: {document}"
    }]
)
```

**Cost Optimization:**
- Use Claude Haiku for simple tasks ($0.25/M tokens)
- Use Claude Sonnet for complex reasoning ($3/M tokens)
- Cache prompts for repeated assessments
- Streaming for better UX

**Alternative: OpenAI**
If you need:
- Function calling for complex workflows
- Vision models (GPT-4 Vision)
- Fine-tuning capabilities

---

### Background Jobs: Redis + BullMQ

**Why BullMQ:**
- Reliable job processing
- Built on Redis (one less service)
- Job priorities, delays, retries
- Great observability

**Use Cases:**
- Document processing (async)
- Email sending
- Webhook delivery
- Report generation

**Pattern:**
```typescript
import { Queue, Worker } from 'bullmq';

// Add job
await assessmentQueue.add('process', {
  docId: '123',
  userId: 'abc'
});

// Process job
const worker = new Worker('assessment', async (job) => {
  const result = await processDocument(job.data);
  return result;
});
```

**Alternatives:**
- **AWS SQS + Lambda**: If fully serverless
- **Celery (Python)**: If heavy Python ecosystem
- **Kafka**: If you're processing millions of events/sec (you're probably not)

---

### Authentication: Clerk or Auth0

**Why Outsource Auth:**
- ❌ Don't build your own auth (security is hard)
- ✅ Get enterprise features (SSO, MFA) for free
- ✅ Compliance covered (SOC2, GDPR)
- ✅ Focus on your core product

**Choose Clerk if:**
- Modern, beautiful UI out of the box
- React/Next.js focused
- Generous free tier (10,000 MAU)

**Choose Auth0 if:**
- Enterprise customers day 1
- Need extensive customization
- Multi-platform (mobile, web, desktop)

**Pattern (Clerk + Next.js):**
```typescript
import { auth } from '@clerk/nextjs';

export default async function handler(req, res) {
  const { userId } = auth();
  if (!userId) return res.status(401);

  // User is authenticated
  const data = await getUserData(userId);
  res.json(data);
}
```

---

### Hosting: Vercel + Railway/Render

**Frontend on Vercel:**
- Zero-config Next.js deployment
- Global CDN (fast everywhere)
- Automatic HTTPS
- Preview deployments per PR
- Generous free tier

**Backend on Railway or Render:**
- Git push to deploy
- Auto-scaling
- Built-in PostgreSQL/Redis
- Fair pricing ($5-20/month to start)

**Alternatives:**

**AWS if:**
- Enterprise compliance requirements
- Need specific AWS services (SageMaker, etc.)
- Team has AWS expertise

**Google Cloud if:**
- Heavy AI/ML (Vertex AI)
- Team prefers GCP ecosystem

**Docker + DigitalOcean if:**
- Want full control
- Lower costs at scale
- Team comfortable with DevOps

---

### Monitoring & Analytics

**Error Tracking: Sentry**
- Catches every error (frontend + backend)
- Source maps for readable stack traces
- Release tracking
- User context (who hit the error)

**Product Analytics: PostHog**
- Open-source alternative to Mixpanel
- Event tracking
- Session replay
- Feature flags
- A/B testing
- Can self-host (control your data)

**Infrastructure Monitoring:**
- **Vercel Analytics**: Frontend performance
- **Railway/Render**: Built-in metrics
- **Better Uptime**: Uptime monitoring ($10/month)

**Pattern:**
```typescript
// Track key events
posthog.capture('assessment_completed', {
  assessment_id: id,
  duration_ms: elapsed,
  accuracy: score
});

// Feature flags
if (posthog.isFeatureEnabled('new-assessment-flow')) {
  return <NewFlow />;
}
```

---

## The Full Stack Example

### MVP Document Assessment Platform

```markdown
## Architecture

Frontend (Vercel):
- Next.js 14 with App Router
- Tailwind CSS
- Clerk for auth

Backend (Railway):
- FastAPI (Python)
- PostgreSQL (documents, users, assessments)
- Redis (cache, queues)
- S3 (document storage)

AI:
- Claude Haiku ($0.25/M tokens) for simple checks
- Claude Sonnet ($3/M tokens) for complex analysis

Monitoring:
- Sentry (errors)
- PostHog (analytics)
- Better Uptime (availability)

## Cost Estimate (1,000 users, 10,000 assessments/month)

- Vercel: $0 (free tier)
- Railway: $20 (hobby tier)
- PostgreSQL: Included
- Redis: Included
- S3: $5 (storage + transfer)
- Clerk: $0 (free tier)
- Claude API: $30 (mostly Haiku)
- Sentry: $0 (free tier)
- PostHog: $0 (free tier)

Total: ~$55/month
```

---

## Stack Decision Framework

### For Each Technology Choice, Ask:

1. **Does this serve a user journey step?**
   - If no → Don't add it

2. **Can we use boring/proven technology?**
   - If yes → Use it (save innovation budget)

3. **Do we have expertise in-house?**
   - If no → Can we hire for it? Is learning curve worth it?

4. **What's the operational burden?**
   - Can we deploy it? Monitor it? Debug it at 2am?

5. **Does it have a generous free tier?**
   - MVP should cost <$100/month total

6. **Can it scale to 1M users?**
   - Don't over-engineer, but avoid dead-ends

---

## Anti-Patterns to Avoid

### ❌ Resume-Driven Development
"Let's use Kubernetes because it's cool"
**Problem**: Complexity with no user value
**Fix**: Choose what solves user problems simply

### ❌ Premature Optimization
"We need Kafka to handle scale"
**Problem**: You have 10 users
**Fix**: PostgreSQL can handle millions of events

### ❌ Not Invented Here Syndrome
"Let's build our own auth system"
**Problem**: You're not an auth company
**Fix**: Use Clerk/Auth0, focus on your value

### ❌ Vendor Lock-In Paranoia
"Can't use AWS, we might need to migrate"
**Problem**: Spending engineering time solving imaginary future problems
**Fix**: Use managed services, migrate if/when needed (rarely happens)

### ❌ Polyglot Everything
"Frontend in TypeScript, backend in Go, workers in Python, scripts in Ruby"
**Problem**: Context switching, hiring difficulty
**Fix**: One language for backend (Python OR Node, not both)

---

## Integration with Other Guidelines

### ← User Journey (../foundation/01-user-journey.md)
Tech stack optimizes critical journey steps (speed, reliability)

### ← Metrics (../foundation/03-success-metrics.md)
Instrumentation for tracking North Star and input metrics

### ← Monetization (../foundation/04-monetization.md)
Billing infrastructure (Stripe), usage metering (Redis)

### → Integration Strategy (./integration-strategy.md)
API-first architecture enables partner integrations

---

## For AI Coding Agents

When generating code, agents should:

1. **Use stack technologies**: Don't introduce new dependencies without reason
2. **Follow stack patterns**: Match established conventions
3. **Consider operational impact**: Will this complicate deployment?
4. **Optimize for stack strengths**: Use Postgres JSON, Redis caching, etc.

**Example Agent Context:**
```json
{
  "tech_stack": {
    "frontend": "next.js",
    "backend": "fastapi",
    "database": "postgresql",
    "cache": "redis",
    "ai": "claude",
    "patterns": {
      "api": "RESTful",
      "auth": "clerk",
      "storage": "s3"
    },
    "conventions": {
      "python_style": "black",
      "typescript_style": "prettier",
      "api_versioning": "/api/v1/"
    }
  }
}
```

Agents reference `.context/tech-stack.json` for consistency.

---

## Template: Your Tech Stack

```markdown
# Tech Stack: [Your Product]

## Core Stack

Frontend: [Framework]
Backend: [Language/Framework]
Database: [Primary DB]
Cache: [Cache layer]
Storage: [Object storage]
AI: [AI provider]
Auth: [Auth provider]
Hosting: [Where deployed]

## Why This Stack

[User journey step] requires [capability]
→ [Technology] provides [benefit]

## Cost Estimate (MVP)

- [Service]: $[X]
- [Service]: $[Y]
Total: $[Z]/month

## Decision Log

### Why [Technology]?
- [Reason 1]
- [Reason 2]
- Alternative considered: [X] (rejected because [Y])

## Upgrade Path

When we reach [milestone], we'll need to:
- [Upgrade/change]
- [Upgrade/change]
```

---

**Remember**: The best stack is the one that helps you ship value to users quickly and reliably. Boring is beautiful. Complexity is expensive.

**Next Steps**: Proceed to [integration-strategy.md](./integration-strategy.md) to design your API-first approach.
