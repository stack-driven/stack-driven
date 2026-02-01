---
description: Session 3 - Choose optimal tech stack based on your user journey and product strategy
---

# Session 3: Choose Tech Stack

This is **Session 3** of the cascade. You'll analyze the user's journey and product strategy, then recommend a tech stack optimized for THEIR specific requirements - not generic "best practices."

## Your Role

You are a thoughtful tech architect. Your job is to:

1. **Read and analyze** the user journey (`product-guidelines/00-user-journey.ctx.md`) and product strategy (`product-guidelines/01-product-strategy.ctx.md`)
2. **Extract technical requirements** from journey steps and strategic goals
3. **Apply decision logic** (not prescriptions!)
4. **Recommend optimal tech stack** with clear journey-based reasoning
5. **Explain trade-offs** (what you didn't choose and why)

## Critical Philosophy

**Let the journey dictate the stack.**

- A real-time multiplayer game needs different tech than a document processing SaaS
- Mobile-first needs different tech than web-first
- AI-heavy workflows need different tech than CRUD apps
- SEO-critical needs different tech than internal tools

**DO NOT prescribe Next.js/FastAPI unless the journey requires it.**

## Process

### Step 1: Read User Journey, Product Strategy, and Constraints

Use the Read tool to read (context versions for token efficiency):
- `product-guidelines/00-user-journey.ctx.md`
- `product-guidelines/01-product-strategy.ctx.md`
- `product-guidelines/02a-constraints.ctx.md` (if it exists)

**Extract from Journey**:
- Core user flow (Steps 1-5)
- Technical implications of each step
- User context (mobile? web? both?)

**Extract from Product Strategy**:
- Scale expectations (from market sizing)
- Competitive positioning (technical differentiators)
- Strategic goals (technical capabilities needed)
- Roadmap themes (future technical requirements)

**Extract from Constraints (if exists)**:
- Technical constraints (required platforms, tech mandates, integrations)
- Organizational constraints (team skills, budget, timeline)
- Compliance requirements (GDPR, HIPAA, SOC2, etc.)
- Internationalization requirements (i18n/l10n)
- Journey-optimal vs. constraint-realistic trade-offs
- Non-negotiable journey elements

### Step 2: Analyze Technical Requirements

For each journey step, identify technical requirements:

**Questions to Ask (internally)**:

**Real-Time Needs?**
- Does Step 3 require <1 second updates?
- Are multiple users collaborating simultaneously?
- → If yes: Consider WebSocket-friendly backends (Node.js, Go), real-time databases

**Data Complexity?**
- Is data highly relational (users → teams → projects → tasks)?
- Or document-heavy with flexible schemas?
- Or key-value patterns?
- → PostgreSQL for relational, PostgreSQL JSONB for flexible, Redis for key-value

**Scale Expectations?**
- MVP (100s of users)?
- Growth (10,000s)?
- Scale (100,000s+)?
- → Choose tech that scales without rewrites, but don't over-engineer for scale you don't have

**SEO Requirements?**
- Are shareable links important (compliance reports, portfolios)?
- Do pages need to be indexed by search engines?
- → If yes: Server-side rendering (Next.js, SvelteKit, etc.)
- → If no: SPA is fine (Vite + React, etc.)

**Mobile vs Web?**
- Is this mobile-first?
- Desktop-only internal tool?
- Both?
- → Mobile-first: Consider React Native, Flutter
- → Web-first: React/Next.js, Vue, Svelte
- → Both: Next.js for web + React Native for mobile (share some code)

**Processing Complexity?**
- Heavy AI/ML integration?
- Document/image processing?
- Simple CRUD?
- Complex calculations?
- → AI/ML: Python ecosystem (better libraries)
- → Document processing: Python (PyPDF2, python-docx)
- → Simple CRUD: Any modern framework works
- → Real-time: Node.js, Go

**Integration Needs?**
- Lots of third-party APIs?
- Webhook-heavy?
- → Consider ecosystem size (npm > PyPI > others in absolute numbers)

### Step 3: Apply Constraints (if they exist)

**If constraints file exists, adjust recommendations:**

1. **Technical Constraints Override Journey-Optimal**:
   - If constraint says "must use AWS", choose AWS services even if GCP would be journey-optimal
   - If constraint says "team only knows Python", use Python even if Node.js would be faster for real-time

2. **Budget Constraints Affect Choices**:
   - $50/month budget → Maximize free tiers (Vercel, Supabase, Railway)
   - Limited AI budget → Use GPT-3.5 Turbo instead of Claude Opus

3. **Timeline Constraints Affect Architecture**:
   - 3-month deadline → Choose familiar tech, no learning curves
   - MVP urgency → Monolith over microservices, proven over cutting-edge

4. **Compliance Constraints Add Requirements**:
   - HIPAA → Require encryption, audit logging, BAA-capable providers
   - GDPR → Data residency, privacy-by-design, right-to-delete

**Remember**: Constraints are non-negotiable boundaries. Journey defines the ideal; constraints define the possible.

### Step 4: Apply Decision Framework

For each layer (frontend, backend, database, etc.), apply this logic (adjusted for any constraints):

**Frontend Decision Tree:**
```
Is it mobile-first?
  Yes → Mobile framework
    UI-rich with complex animations?
      Yes → Flutter (60-120 FPS, native performance, 90-95% code sharing)
      No → Team knows React?
           Yes → React Native (70-90% code sharing with web)
           No → Flutter
  No → Web framework (continue below)

Web framework selection:
  Does journey require SEO/shareable links?
    Yes → Meta-framework with SSR
      Content-heavy (blog, docs, marketing)?
        Yes → Astro (zero JS by default, 5x less JS than Next.js)
        No → Continue below

      Data-heavy dashboards with complex forms?
        Yes → Remix (loader/action pattern, web standards, form-first)
        No → Continue below

      React ecosystem preference?
        Yes → Next.js 15 (Server Components, Turbopack, largest ecosystem)
        No → Vue ecosystem?
             Yes → Nuxt 3 (Nitro server, auto-imports)
             No → SvelteKit (smallest bundles, compiled performance)

    No → SPA framework
      Performance-critical (bundle size)?
        Yes → Svelte (1.6KB vs React 42KB)
        No → React + Vite (60% job market, huge ecosystem)
```

**Build & Development Tooling:**

Note: If you selected Next.js, Remix, Nuxt, or SvelteKit in the meta-framework section above, build tool configuration is pre-configured. This section primarily applies to standalone React/Vue/Svelte SPAs.

```
Build tool selection:
  Starting new project?
    Yes → Vite (40x faster dev server vs Webpack, 68x faster HMR)
    No → Existing Webpack config?
         Migration effort high?
           Yes → Rspack (drop-in Webpack replacement, 23x faster)
           No → Vite (full migration, best DX)

  Next.js project?
    Yes → Turbopack (built-in via --turbo flag)

Package manager:
  New project or monorepo?
    Yes → pnpm (4x faster than npm, 70% disk savings, strict dependencies)
    No → Continue with npm (migrate opportunistically)

Testing frameworks:
  Unit/integration tests?
    → Vitest (10-20x faster than Jest, Jest-compatible API)

  E2E tests?
    → Playwright (cross-browser, parallel execution, faster at scale)

Code quality:
  Maximum CI speed needed?
    Yes → Oxlint (50-100x faster than ESLint, 520+ rules) + Prettier
    No → Biome (10-20x faster, replaces ESLint + Prettier, simpler)
```

**Backend Decision Tree:**
```
Does journey require heavy AI/ML integration?
  Yes → Python (FastAPI, Flask)
  No → Check other requirements

Does journey require real-time <1s updates?
  Yes → Node.js (Express, Fastify) or Go
  No → Python or Node.js (both work)

Does team have strong preferences/expertise?
  Use that (boring is good)
```

**State Management Decision Tree:**
```
Client state (component-level UI state):
  Complex global state shared across many components?
    Yes → Zustand (1-3KB, minimal boilerplate, modern default for 2025)
    No → React Context + useState (built-in, sufficient for simple needs)

  Note: For very simple apps with 2-3 pages and minimal state, vanilla useState with props drilling may be sufficient. Don't add state management complexity until you need it.

Server state (API data, caching, synchronization):
  REST API with complex caching needs?
    Yes → TanStack Query (13KB, advanced caching, optimistic updates, devtools)
    No → SWR (4KB, simple caching for Next.js)

  GraphQL API?
    Yes → Apollo Client (30KB, normalized cache)

Form state (user input, validation):
  Complex forms with multi-step validation?
    Yes → React Hook Form (12KB) + Zod (12KB, better TypeScript than Yup)
    No → Controlled components (built-in useState)
```

**Database Decision Tree:**
```
Is data highly relational?
  Yes → PostgreSQL

Is schema unpredictable/evolving rapidly?
  Yes → PostgreSQL with JSONB (best of both worlds)
  Extreme case → MongoDB (but reconsider if PostgreSQL JSONB works)

Is it key-value or cache-heavy?
  Yes → Redis

Need graph queries?
  Yes → PostgreSQL with extensions or Neo4j

Is data primarily time-series (metrics, logs, events)?
  Yes → InfluxDB, TimescaleDB, or Prometheus

Need full-text search across large content?
  Yes → Elasticsearch, Meilisearch, or Typesense

Need vector similarity search (AI embeddings, recommendations)?
  Yes → Pinecone, Weaviate, or PostgreSQL with pgvector
```

**Auth Provider Decision Tree:**
```
Data sovereignty required (GDPR, HIPAA strict interpretation)?
  Yes → Self-hosted
    DevOps expertise available?
      Yes → Keycloak (complete SSO/SAML/OAuth)
      No → SuperTokens (simpler self-hosted option)

  No → Managed auth (SaaS)
    Next.js project with standard OAuth providers?
      Yes → Auth.js (free, OAuth 2.0, built for Next.js, formerly NextAuth.js)
      No → Continue below

    High MAU volume (>50K users)?
      Yes → Supabase Auth ($25/month for 100K MAU, includes database)
      No → Modern DX priority with budget?
           Yes → Clerk (~$25/month for 10K MAU, beautiful UI)
           No → Supabase Auth (best value)

Note: Use HttpOnly cookies for JWTs (NOT localStorage, prevents XSS).
```

**AI Requirement Detection:**

Analyze the journey for AI/ML requirements:
- Does journey involve document processing, text generation, classification, or understanding?
- Does journey require image/vision processing?
- Does journey need intelligent automation or recommendations?
- Does journey involve natural language understanding or generation?

If YES to any: Set "AI Integration: Required" in tech stack output
If NO to all: Set "AI Integration: Not Required" in tech stack output

**IMPORTANT**: Do NOT choose AI provider or model here. That decision happens in Session 3c (`/define-ai-integration-strategy`) to maintain proper cascade ordering.

**Internationalization (i18n) Requirement Detection:**

Check `02a-constraints.ctx.md` if it exists:
- Look for "Internationalization requirements (i18n, l10n)" constraint marked as required
- Check for multi-language/multi-region requirements in journey or strategy

If i18n IS required, select appropriate i18n library based on frontend choice:
- **Next.js** → `next-intl` (native Next.js integration, App Router support)
- **React (SPA)** → `react-i18next` (most popular, battle-tested)
- **Vue** → `vue-i18n` (official Vue ecosystem)
- **Svelte** → `svelte-i18n` (official Svelte ecosystem)
- **Angular** → Built-in i18n (Angular's @angular/localize)

Document in tech stack:
- **i18n Library**: [Selected library] (journey requires multi-language support)
- **Translation file strategy**: JSON-based locale files (e.g., `/locales/en-US/common.json`)
- **Locale detection**: Accept-Language header + user preference
- **Implementation reference**: See `/reference-material/i18n-implementation-guide.md` for detailed patterns

If i18n is NOT required: Omit from tech stack output (don't force everyone to think about i18n).

### Step 4: Make Recommendations

For each technology choice, provide:

1. **The choice**: "Frontend: Next.js"
2. **Journey requirement it serves**: "Step 4 requires shareable compliance reports (SEO matters)"
3. **Why this vs alternatives**: "Next.js provides SSR for SEO, React ecosystem for rich UI. SvelteKit would work too, but team knows React."
4. **Trade-offs**: "More complex than SPA, but journey requires it."

### Step 5: Explain What You DIDN'T Choose

This is critical for learning:

```
## What We DIDN'T Choose (And Why)

### Kubernetes / Microservices
**Why Not**: Over-engineering. Journey shows MVP scale (100s of users). Monolith scales to millions of requests. Add complexity only when needed.

### GraphQL
**Why Not**: REST is simpler. Journey doesn't show complex relational queries from frontend. KISS.
```

## Generating the Output

### Create: `product-guidelines/02-tech-stack.md`

Use `/templates/02-tech-stack-template.md` as structure.

**Required Sections**:

1. **Core Stack** (Summary)
   - Frontend: [Choice]
   - Backend: [Choice]
   - Database: [Choice]
   - Cache: [Choice if needed]
   - Storage: [Choice if needed]
   - AI Integration: [Required / Not Required]
   - i18n: [Library if required, otherwise omit]
   - Auth: [Provider - Clerk, Auth0, Supabase, Keycloak, SuperTokens, etc.]
   - Hosting: [Where it runs]
   - State Management:
     - Client State: [Zustand / React Context + useState / Not applicable]
     - Server State: [TanStack Query / SWR / Apollo Client / Not applicable]
     - Form State: [React Hook Form + Zod / Controlled components / Not applicable]
   - Build & Development Tooling:
     - Build Tool: [Vite / Rspack / Turbopack / Other]
     - Package Manager: [pnpm / npm / yarn]
     - Testing: [Vitest for unit/integration, Playwright for E2E]
     - Code Quality: [Biome / Oxlint + Prettier / ESLint + Prettier]

2. **Why This Stack (Journey-Driven Decisions)**
   - For EACH choice, explain:
     - Journey requirement it serves (reference specific steps)
     - Why this technology satisfies that requirement
     - Alternatives considered and why not chosen

3. **Stack Mapping to Journey**
   - Table showing: Journey Step → Technical Requirement → Technology Solution
   - Makes journey→tech connection crystal clear

4. **Cost Estimate (MVP Phase)**
   - Be realistic about free tiers
   - Show total monthly cost for MVP scale
   - Include: hosting, database, AI APIs, auth, monitoring, etc.

5. **What We DIDN'T Choose**
   - List 3-5 technologies commonly used but not right for this journey
   - Explain why (based on journey, not opinion)

## Validation Checklist

Before writing the file, verify:
- [ ] Every tech choice references a specific journey requirement
- [ ] Alternatives are considered (not just defaulting to "popular" tech)
- [ ] Stack is cohesive (technologies work well together)
- [ ] MVP cost is realistic (<$200/month for most MVPs)
- [ ] No over-engineering (Kubernetes for 10 users, etc.)
- [ ] Clear explanation of trade-offs

## Example Decision Logic

**Scenario: Real-Time Multiplayer Drawing Game**

**Journey Analysis**:
- Step 2: 10 players drawing simultaneously
- Step 3: Changes visible in <100ms to all players
- Context: Mobile-first, creative tool

**Stack Recommendation**:
```
Frontend: React Native (mobile-first requirement)
Backend: Node.js + Socket.io (real-time <100ms requirement)
Database: Redis (fast state), PostgreSQL (game history persistence)
Hosting: Railway (simple deploys, WebSocket support)

NOT Next.js (not web-first, doesn't need SEO)
NOT FastAPI (Python slower for real-time WebSockets)
NOT DynamoDB (want relational game history)
```

**Reasoning**: Journey requires mobile + real-time → React Native + Node.js + Socket.io.

## After Generation

Once you've created the file:

1. **Show a summary**:
   ```
   [✓] Tech stack chosen!

   Your stack optimized for [key journey requirement]:
   - Frontend: [Choice] (for [journey reason])
   - Backend: [Choice] (for [journey reason])
   - Database: [Choice] (for [journey reason])
   - AI Integration: [Required/Not Required] (for [journey reason])

   Estimated MVP cost: $[X]/month
   ```

2. **Highlight key decisions**:
   - "Chose [tech] over [alternative] because your journey requires [requirement]"

3. **Next steps**:

   **If AI Integration is Required:**
   ```
   [✓] Session 3 complete!

   You have a tech stack optimized for YOUR journey (not generic best practices).

   Your journey requires AI integration. Next, you'll define your AI strategy:
   - AI provider and model selection
   - Implementation patterns (RAG, function calling, etc.)
   - Cost projections and optimization
   - Security and compliance approach

   When ready, run: /define-ai-integration-strategy

   Or check your progress: /cascade-status
   ```

   **If AI Integration is NOT Required:**
   ```
   [✓] Session 3 complete!

   You have a tech stack optimized for YOUR journey (not generic best practices).

   Next, we'll derive your tactical foundation: mission, metrics, monetization, and architecture principles - all from your journey and tech choices.

   When ready, run: /generate-strategy

   Or check your progress: /cascade-status
   ```

## Important Guidelines

1. **Be adaptive**: Different journeys yield different stacks. Don't prescribe.
2. **Show your work**: Always explain WHY a choice was made
3. **Consider boring**: Boring, proven tech is often the right choice
4. **Avoid resume-driven development**: No tech for tech's sake
5. **Think total cost**: Include all services, be realistic about free tiers
6. **Consider team**: If user mentions team expertise, factor it in

## Reference Files

- Template: `/templates/02-tech-stack-template.md`
- Example (don't copy!): `/examples/compliance-saas/stack/04-tech-stack.md`
- Current stack opinions (to avoid prescribing): `/stack/tech-stack.md`

---

**Now, read the user journey and product strategy, then recommend an optimal tech stack!**

Read `product-guidelines/00-user-journey.ctx.md` and `product-guidelines/01-product-strategy.ctx.md`, analyze requirements, and generate `product-guidelines/02-tech-stack.md`.

## After Generating Tech Stack Document

Once you've written `product-guidelines/02-tech-stack.md`, invoke the distillation agent to create a context file:

Use the Task tool:
- **subagent_type**: `general-purpose`
- **description**: `Generate tech stack context file`
- **prompt**:
  ```
  Invoke the context distillation agent to create token-optimized context file.

  Source file: product-guidelines/02-tech-stack.md
  Output file: product-guidelines/02-tech-stack.ctx.md

  Follow the distillation agent specification in .claude/agents/distill-context.md to:
  1. Extract ALL tech stack choices with 1-2 line justifications (CRITICAL - never remove)
  2. Extract AI integration decision (Required/Not Required)
  3. Extract estimated costs
  4. Remove alternatives considered, detailed tradeoff analysis
  5. Preserve section structure from source file
  6. Achieve 60-70% token reduction
  7. Add source reference header
  8. Write to output file path
  ```

## CRITICAL CHECKPOINT

Session 3 complete! Your tech stack has been chosen based on your specific journey requirements.

Before proceeding, validate that your technology choices align with your journey needs and aren't driven by trends or resume-building.

**REVIEW CHECKLIST:**
- [ ] Each tech choice references specific journey requirements (not generic "best practices")
- [ ] Stack is cohesive (technologies work well together, same ecosystem where possible)
- [ ] MVP cost estimate is realistic (typically <$200/month for most MVPs)
- [ ] No over-engineering (complexity matches current scale, not theoretical future scale)

**What happens next:**
Session 4 will derive your mission, metrics, and architecture principles using this tech stack. Sessions 7-12 will generate technical designs (database, API, tests, scaffold) based on these choices.

**If you found issues:**
Run `/choose-tech-stack` again to regenerate with fresh analysis (preserves same journey context).

**If everything looks good:**
Type "continue" when ready to proceed to Session 4 (tactical foundation).

---

## Output Format

IMPORTANT: Do not use emojis in generated outputs. Use plain text for all communication.
