# Reference Material Research Prompts for Stack-Driven Framework

## Overview
This document contains detailed research prompts for creating best practice guides for each domain in the Stack-Driven framework. These guides will be stored in the `/reference-material/` directory.

## Existing Reference Materials (Already Completed)
1. **AI Integration Best Practices** - ✅ Complete
2. **AI Debugging Framework** - ✅ Complete
3. **API Security Blueprint** - ✅ Complete
4. **Serialization Guide** - ✅ Complete
5. **Agentic Context Injection Reference Guide** - ✅ Complete

## Missing Domain Guides - Research Prompts

---

### 1. Database Design Best Practices Guide
**Target File:** `/reference-material/database-design-guide.md`

**Research Prompt:**
```
Create a comprehensive, state-of-the-art database design guide that covers:

1. Database Paradigm Selection Decision Tree
   - When to use relational (PostgreSQL, MySQL) vs document (MongoDB, DynamoDB) vs graph (Neo4j, Neptune) vs time-series (InfluxDB, TimescaleDB) vs key-value (Redis, Memcached)
   - Decision factors: data relationships, query patterns, scalability needs, consistency requirements, operational complexity
   - Include 2025 state-of-the-art recommendations

2. Schema Design Patterns by Paradigm
   - Relational: normalization levels (when to denormalize), indexing strategies, partitioning patterns, JSONB for flexibility
   - Document: embedding vs referencing, schema versioning, aggregation patterns
   - Graph: node/edge modeling, property graphs vs RDF, traversal optimization
   - Time-series: retention policies, downsampling, continuous aggregates
   - Key-value: key design patterns, expiration strategies, memory optimization

3. Performance Optimization Strategies
   - Index design (B-tree, Hash, GiST, GIN, BRIN)
   - Query optimization techniques
   - Connection pooling and caching strategies
   - Read/write splitting and replication patterns
   - Sharding strategies and partition keys

4. Data Integrity & Constraints
   - Foreign key design patterns
   - Check constraints and triggers
   - Soft delete vs hard delete patterns
   - Audit logging and temporal tables
   - Event sourcing considerations

5. Migration & Evolution Strategies
   - Zero-downtime migration patterns
   - Schema versioning approaches
   - Data migration tools and techniques
   - Backwards compatibility patterns

6. Multi-tenancy Patterns
   - Shared database, shared schema
   - Shared database, separate schemas
   - Separate databases
   - Row-level security implementations

7. Compliance & Security Patterns
   - Encryption at rest and in transit
   - PII handling and data masking
   - GDPR right to erasure implementation
   - Audit trail requirements by regulation

Include decision trees, code examples, and performance benchmarks where applicable.
```

---

### 2. Tech Stack Selection Framework
**Target File:** `/reference-material/tech-stack-selection-guide.md`

**Research Prompt:**
```
Create a comprehensive tech stack selection guide with state-of-the-art decision trees:

1. Frontend Framework Selection Matrix
   - React vs Vue vs Angular vs Svelte vs SolidJS vs Qwik
   - Decision factors: team expertise, performance requirements, ecosystem maturity, bundle size, SEO needs
   - Meta-frameworks: Next.js vs Remix vs Nuxt vs SvelteKit vs Astro
   - Mobile considerations: React Native vs Flutter vs Ionic vs native

2. Backend Framework Selection
   - Node.js (Express vs Fastify vs NestJS vs Hono) vs Python (FastAPI vs Django) vs Go (Gin vs Echo) vs Rust (Axum vs Actix)
   - Decision factors: performance, ecosystem, type safety, developer velocity, operational complexity
   - Serverless vs containers vs VMs tradeoffs

3. State Management Patterns
   - Client state: Redux vs Zustand vs Valtio vs Jotai vs MobX
   - Server state: React Query vs SWR vs Apollo
   - Form state: React Hook Form vs Formik vs react-final-form

4. Authentication & Authorization
   - Build vs buy decision tree
   - Auth providers: Auth0 vs Clerk vs Supabase Auth vs Firebase Auth vs AWS Cognito
   - Self-hosted: Ory vs Keycloak vs FusionAuth
   - Session vs JWT patterns

5. Infrastructure & Deployment
   - Cloud provider selection: AWS vs GCP vs Azure vs Vercel vs Netlify vs Railway
   - Container orchestration: Kubernetes vs ECS vs Cloud Run vs Fly.io
   - CI/CD pipeline patterns
   - Monitoring and observability stack

6. Development Tools & DX
   - Package managers: npm vs yarn vs pnpm vs bun
   - Build tools: Vite vs Webpack vs esbuild vs Turbopack
   - Testing frameworks by language
   - Code quality tools (linting, formatting, type checking)

7. Cost Optimization Strategies
   - Vendor lock-in considerations
   - Cost modeling for different scales
   - Open source vs managed service tradeoffs

Include concrete selection criteria, performance benchmarks, and example tech stacks for common product types.
```

---

### 3. Testing Strategy Playbook
**Target File:** `/reference-material/testing-strategy-playbook.md`

**Research Prompt:**
```
Create a comprehensive testing strategy guide covering:

1. Test Pyramid vs Trophy vs Diamond Models
   - When to use each model
   - Optimal test distribution ratios
   - Cost/benefit analysis per testing level

2. Unit Testing Best Practices
   - Test structure patterns (AAA, Given-When-Then)
   - Mocking strategies and anti-patterns
   - Property-based testing
   - Snapshot testing guidelines
   - Coverage targets by project type

3. Integration Testing Patterns
   - Database testing strategies (in-memory, containers, fixtures)
   - API testing approaches
   - Message queue testing
   - Third-party service mocking

4. E2E Testing Framework Selection
   - Playwright vs Cypress vs Selenium vs Puppeteer
   - Mobile testing: Detox vs Appium
   - Visual regression testing tools
   - Accessibility testing automation

5. Performance Testing Strategies
   - Load testing tools and patterns
   - Stress testing vs spike testing
   - Performance budgets and monitoring
   - Database query performance testing

6. Security Testing Approaches
   - SAST vs DAST vs IAST
   - Dependency scanning
   - Container security scanning
   - Penetration testing frameworks

7. Test Data Management
   - Fixture patterns
   - Factory patterns
   - Seed data strategies
   - PII in test data handling

8. CI/CD Testing Optimization
   - Parallel test execution
   - Test selection strategies
   - Flaky test management
   - Test result reporting

Include decision trees, example test plans for different product types, and ROI calculations.
```

---

### 4. Application Architecture Patterns
**Target File:** `/reference-material/application-architecture-patterns.md`

**Research Prompt:**
```
Create a comprehensive application architecture guide:

1. Architectural Style Selection
   - Monolith vs Microservices vs Modular Monolith vs Serverless
   - Decision factors: team size, complexity, scale, deployment needs
   - Migration paths between styles

2. Clean Architecture Patterns
   - Hexagonal/Ports & Adapters
   - Onion Architecture
   - Domain-Driven Design (DDD) tactical patterns
   - CQRS and Event Sourcing
   - Implementation examples per framework

3. API Architecture Patterns
   - REST vs GraphQL vs gRPC vs WebSocket
   - API Gateway patterns
   - BFF (Backend for Frontend) pattern
   - Rate limiting and throttling strategies

4. Data Access Patterns
   - Repository pattern variations
   - Unit of Work pattern
   - Active Record vs Data Mapper
   - Query object pattern
   - CQRS read/write model separation

5. Service Communication Patterns
   - Synchronous vs asynchronous
   - Message queues vs event streams
   - Saga patterns for distributed transactions
   - Circuit breaker and retry patterns

6. Caching Strategies
   - Cache-aside vs read-through vs write-through
   - Multi-level caching
   - Cache invalidation patterns
   - CDN strategies

7. Security Architecture Patterns
   - Zero trust architecture
   - Defense in depth
   - Secrets management patterns
   - API security patterns

8. Scalability Patterns
   - Horizontal vs vertical scaling
   - Database sharding patterns
   - Load balancing strategies
   - Auto-scaling patterns

Include decision trees, code examples, and case studies of successful implementations.
```

---

### 5. Design System Engineering Guide
**Target File:** `/reference-material/design-system-engineering.md`

**Research Prompt:**
```
Create a comprehensive design system implementation guide:

1. Design Token Architecture
   - Token taxonomy and naming conventions
   - Platform-agnostic token formats
   - Token transformation pipelines
   - Version control and distribution strategies

2. Component Library Architecture
   - Atomic Design methodology
   - Component composition patterns
   - Prop interface design
   - Compound components vs render props vs hooks

3. CSS Architecture Patterns
   - CSS-in-JS vs CSS Modules vs Utility-first
   - Framework selection: Emotion vs Styled Components vs Stitches vs Tailwind vs UnoCSS
   - Theming strategies
   - Critical CSS and performance optimization

4. Component Documentation
   - Storybook vs Docusaurus vs custom solutions
   - Documentation automation
   - Visual regression testing integration
   - Interactive playgrounds

5. Accessibility Engineering
   - ARIA patterns by component type
   - Keyboard navigation patterns
   - Screen reader testing strategies
   - Color contrast and visual accessibility

6. Cross-Platform Consistency
   - Web vs mobile native patterns
   - Responsive vs adaptive design
   - Platform-specific adaptations
   - Design handoff workflows

7. Performance Optimization
   - Bundle splitting strategies
   - Tree shaking optimization
   - Runtime vs build-time styling
   - Icon and font optimization

8. Versioning and Migration
   - Semantic versioning for design systems
   - Breaking change management
   - Gradual migration strategies
   - Deprecation patterns

Include implementation examples for React, Vue, Angular, and Web Components.
```

---

### 6. DevOps & Deployment Strategies
**Target File:** `/reference-material/devops-deployment-guide.md`

**Research Prompt:**
```
Create a comprehensive DevOps and deployment guide:

1. Deployment Strategy Selection
   - Blue-green vs canary vs rolling deployments
   - Feature flags and progressive delivery
   - GitOps patterns
   - Environment promotion strategies

2. Container Orchestration Patterns
   - Kubernetes best practices
   - Service mesh considerations (Istio, Linkerd)
   - Helm chart patterns
   - Operator patterns

3. CI/CD Pipeline Design
   - Pipeline as code patterns
   - Build optimization strategies
   - Security scanning integration
   - Deployment automation patterns

4. Infrastructure as Code
   - Terraform vs Pulumi vs CDK vs Ansible
   - Module design patterns
   - State management strategies
   - Multi-environment management

5. Monitoring & Observability Stack
   - Metrics vs logs vs traces
   - Tool selection: Datadog vs New Relic vs Grafana stack
   - SLI/SLO/SLA definition patterns
   - Alert fatigue prevention

6. Disaster Recovery Planning
   - RTO/RPO targets by criticality
   - Backup strategies
   - Chaos engineering practices
   - Incident response playbooks

7. Security Operations
   - Secret rotation patterns
   - Zero-downtime certificate renewal
   - Network security patterns
   - Compliance automation

8. Cost Optimization
   - Resource right-sizing
   - Spot instance strategies
   - Reserved capacity planning
   - FinOps practices

Include decision trees, example configurations, and runbooks.
```

---

### 7. Product Metrics & Analytics Framework
**Target File:** `/reference-material/product-metrics-framework.md`

**Research Prompt:**
```
Create a comprehensive product metrics and analytics guide:

1. Metrics Framework Selection
   - AARRR (Pirate Metrics) vs HEART vs North Star
   - OKR vs KPI frameworks
   - Leading vs lagging indicators
   - Metric hierarchy design

2. Analytics Implementation Patterns
   - Event tracking taxonomy
   - User identification strategies
   - Session tracking patterns
   - Attribution models

3. Analytics Tool Selection
   - Build vs buy decision tree
   - Google Analytics vs Mixpanel vs Amplitude vs PostHog
   - Data warehouse integration patterns
   - Privacy-first analytics options

4. A/B Testing Infrastructure
   - Statistical significance calculations
   - Sample size determination
   - Feature flag integration
   - Experiment design patterns

5. Data Pipeline Architecture
   - ETL vs ELT patterns
   - Real-time vs batch processing
   - Data quality monitoring
   - Schema evolution strategies

6. Privacy & Compliance
   - GDPR-compliant tracking
   - Cookie consent patterns
   - Data retention policies
   - Anonymization techniques

7. Visualization & Reporting
   - Dashboard design principles
   - Self-serve analytics patterns
   - Automated reporting strategies
   - Data democratization approaches

Include metric definitions, implementation examples, and dashboard templates.
```

---

### 8. Internationalization (i18n) Implementation Guide
**Target File:** `/reference-material/i18n-implementation-guide.md`

**Research Prompt:**
```
Create a comprehensive i18n/l10n implementation guide:

1. I18n Architecture Patterns
   - Build-time vs runtime translation loading
   - Translation file organization strategies
   - Locale detection and switching patterns
   - Fallback chain configuration

2. Framework-Specific Implementation
   - React: next-intl vs react-i18next vs react-intl
   - Vue: vue-i18n patterns
   - Angular: Angular i18n
   - Backend i18n patterns

3. Translation Management Workflows
   - String extraction automation
   - Translation key naming conventions
   - Pluralization and gender handling
   - Translation memory integration

4. Content Localization Strategies
   - Database schema patterns for multilingual content
   - URL structure strategies
   - SEO considerations for multilingual sites
   - CDN and edge localization

5. Cultural Adaptation Patterns
   - Date/time formatting
   - Number and currency formatting
   - RTL/LTR layout handling
   - Cultural imagery and color considerations

6. Performance Optimization
   - Translation bundle splitting
   - Lazy loading strategies
   - Caching patterns
   - Build-time optimization

7. Testing Strategies
   - Pseudo-localization testing
   - Translation completeness validation
   - Layout testing for different text lengths
   - Automated screenshot testing

Include code examples, decision trees, and migration guides.
```

---

### 9. Third-Party Integration Patterns
**Target File:** `/reference-material/third-party-integration-patterns.md`

**Research Prompt:**
```
Create a comprehensive third-party integration guide:

1. Integration Architecture Patterns
   - Direct integration vs middleware/iPaaS
   - Webhook handling patterns
   - Polling vs webhooks vs websockets
   - Rate limiting and backoff strategies

2. Payment Processing Integration
   - Stripe vs PayPal vs Square patterns
   - PCI compliance strategies
   - Subscription management patterns
   - Webhook reconciliation

3. Communication Service Integration
   - Email: SendGrid vs AWS SES vs Postmark
   - SMS: Twilio vs AWS SNS
   - Push notifications patterns
   - Real-time messaging integration

4. Authentication Provider Integration
   - OAuth 2.0/OIDC patterns
   - SAML integration
   - Social login implementation
   - MFA provider integration

5. CRM/ERP Integration Patterns
   - Salesforce integration patterns
   - HubSpot API patterns
   - Data synchronization strategies
   - Conflict resolution patterns

6. Error Handling & Recovery
   - Retry strategies with exponential backoff
   - Circuit breaker patterns
   - Fallback mechanisms
   - Monitoring and alerting

7. Testing Third-Party Integrations
   - Mock service patterns
   - Contract testing
   - Sandbox environment strategies
   - Integration test data management

Include code examples, security considerations, and vendor-specific gotchas.
```

---

### 10. Compliance Implementation Playbook
**Target File:** `/reference-material/compliance-implementation-playbook.md`

**Research Prompt:**
```
Create a comprehensive compliance implementation guide:

1. Regulatory Landscape Navigation
   - GDPR, CCPA, HIPAA, PCI-DSS, SOC2 decision tree
   - Geographic and industry-specific requirements
   - Compliance prioritization framework
   - Cost-benefit analysis patterns

2. Data Privacy Implementation
   - Consent management patterns
   - Data subject rights implementation
   - Privacy by design patterns
   - Data minimization strategies

3. Security Compliance Patterns
   - Encryption implementation strategies
   - Access control patterns (RBAC, ABAC)
   - Audit logging requirements
   - Vulnerability management processes

4. Healthcare (HIPAA) Patterns
   - PHI handling in applications
   - BAA requirements and templates
   - Minimum necessary standard implementation
   - Breach notification procedures

5. Financial (PCI-DSS) Patterns
   - Scope reduction strategies
   - Tokenization patterns
   - Network segmentation
   - SAQ type selection

6. SOC2 Implementation
   - Control selection and implementation
   - Evidence collection automation
   - Continuous compliance monitoring
   - Audit preparation strategies

7. Compliance Automation
   - Policy as code patterns
   - Automated compliance testing
   - Continuous compliance monitoring
   - Documentation generation

Include checklists, timeline templates, and cost estimates.
```

---

## Implementation Priority Order

Based on the Stack-Driven cascade flow, I recommend creating these guides in the following order:

1. **Tech Stack Selection Framework** - Needed for Session 3
2. **Database Design Best Practices** - Needed for Session 7
3. **Application Architecture Patterns** - Needed for Session 9b
4. **Testing Strategy Playbook** - Needed for Session 9
5. **Design System Engineering** - Needed for Session 6
6. **DevOps & Deployment Strategies** - Needed for Session 13
7. **Product Metrics & Analytics Framework** - Supports Session 4
8. **I18n Implementation Guide** - Conditional need from Session 2a
9. **Third-Party Integration Patterns** - Conditional need from Session 2a
10. **Compliance Implementation Playbook** - Post-cascade extension

## Guide Format Requirements

Each guide should follow the format of existing reference materials:
- Clear decision trees with concrete criteria
- State-of-the-art recommendations (2025 best practices)
- Code examples and implementation patterns
- Performance benchmarks where applicable
- Cost considerations and trade-offs
- Migration strategies from legacy approaches

These guides will serve as standalone educational resources that commands can reference when making technical decisions, ensuring Stack-Driven generates optimal, modern solutions based on current best practices.