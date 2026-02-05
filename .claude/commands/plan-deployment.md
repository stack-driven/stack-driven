---
description: Session 13 - Create deployment strategy and CI/CD pipeline plan
---

# Plan Deployment (Session 13 - Core)

You are helping the user create a comprehensive deployment strategy using journey-driven decision frameworks and production-grade DevOps patterns. This session implements **Epic #167 agentic sub-agent architecture**, conditionally invoking specialized sub-agents based on journey requirements.

## When to Use This

**Run AFTER Session 12** (`/scaffold-project`):
- You have a working development environment and need deployment strategy
- You're ready to plan production infrastructure
- You want CI/CD automation from day one

**This is now a CORE session** because:
- Every product needs a deployment strategy to ship
- CI/CD and infrastructure decisions are foundational, not optional
- Deployment planning ensures reliable delivery of journey value

---

## Orchestrator Architecture

This command is an **orchestrator** (<400 lines per Epic #167) that:
1. Analyzes journey requirements to determine deployment complexity
2. Conditionally invokes specialized sub-agents
3. Synthesizes sub-agent outputs into unified deployment plan

**Token Efficiency**: Loads only relevant sub-agents (40-60% savings vs monolithic command)

---

## Steps to Execute

### Step 1: Read Cascade Context

Read previous cascade outputs for journey-driven decision making:

```bash
# Core context (always read)
Read product-guidelines/00-user-journey.ctx.md
Read product-guidelines/01-product-strategy.ctx.md
Read product-guidelines/02-tech-stack.ctx.md
Read product-guidelines/04-architecture.ctx.md
Read product-guidelines/07-database-schema.ctx.md
Read product-guidelines/09-test-strategy.ctx.md

# Optional context (read if exists)
If product-guidelines/02a-constraints.ctx.md exists:
  Read product-guidelines/02a-constraints.ctx.md

If product-guidelines/02c-ai-integration-strategy.ctx.md exists:
  Read product-guidelines/02c-ai-integration-strategy.ctx.md

If product-guidelines/14-observability-strategy.md exists:
  Read product-guidelines/14-observability-strategy.md
```

---

### Step 2: Analyze Journey Requirements

Extract key deployment requirements from cascade outputs:

**From Session 1 (User Journey)**:
- Journey criticality: life-critical? financial? productivity? entertainment?
- Downtime tolerance: zero? seconds? minutes? hours?
- Peak usage patterns: when do users need the system most?

**From Session 2 (Product Strategy)**:
- SLA requirement: 99.999%? 99.99%? 99.9%? 99%?
- Deployment frequency target: hourly? daily? weekly?
- Product stage: startup? growth? scale? enterprise?
- Team size: <10? 10-50? >50 engineers?

**From Session 2a (Constraints - if exists)**:
- Compliance requirements: HIPAA? SOC2? PCI-DSS?
- Cloud provider constraints: AWS? GCP? Azure? multi-cloud?
- Geographic/data residency requirements

**From Session 3 (Tech Stack)**:
- Source control: GitHub? GitLab? Bitbucket?
- Orchestration needs: frontend framework? backend runtime?
- Programming language preference (for IaC tool selection)

**From Session 4 (Architecture)**:
- System complexity: monolith? modular monolith? microservices?
- Scaling requirements: horizontal? vertical? auto-scale?

**From Session 7 (Database Schema)**:
- Database complexity: simple (<5 tables)? medium (5-20)? complex (>20)?

**From Session 14 (Observability - if exists)**:
- Monitoring stack: Datadog? Langfuse+Grafana? Grafana Stack?
- Defined SLIs/SLOs
- Alert routing and incident response procedures

---

### Step 3: Determine Deployment Complexity

Calculate deployment complexity tier:

```markdown
deployment_complexity = calculate_tier()

FUNCTION calculate_tier():
  IF (sla >= "99.99%" OR criticality == "life-critical" OR criticality == "financial"):
    RETURN "enterprise-complex"  # Requires Kubernetes, DR, canary, comprehensive security

  ELSE IF (sla >= "99.9%" OR team_size > 10 OR microservices):
    RETURN "saas-moderate"  # Requires good CI/CD, some HA, basic DR

  ELSE:
    RETURN "startup-simple"  # Simple deployment, rolling updates, basic monitoring
```

---

### Step 4: Conditional Sub-Agent Invocation

Invoke sub-agents based on journey requirements using Task tool (Epic #167 pattern):

#### 4.1: Select Deployment Strategy (ALWAYS)

Use the Task tool:
- **subagent_type**: `general-purpose`
- **description**: `Select deployment strategy`
- **prompt**:
  ```
  Invoke the deployment strategy selection sub-agent to recommend optimal deployment pattern.

  Agent path: .claude/agents/select-deployment-strategy.md

  Inputs:
  - Journey criticality: [From 00-user-journey.ctx.md - life-critical/financial/productivity/entertainment]
  - SLA requirement: [From 01-product-strategy.ctx.md - 99.999%/99.99%/99.9%/99%/none]
  - Deployment frequency target: [From 01-product-strategy.ctx.md - hourly/daily/weekly/monthly]
  - Regulated industry: [From 02a-constraints.ctx.md if exists - boolean]
  - Journey downtime tolerance: [From 00-user-journey.ctx.md - zero/seconds/minutes/hours]
  - Team size: [From 01-product-strategy.ctx.md - number]
  - Product stage: [From 01-product-strategy.ctx.md - startup/growth/scale/enterprise]

  Follow the agent specification to:
  1. Validate all required inputs are present
  2. Apply decision tree based on criticality and SLA
  3. Recommend deployment pattern (rolling/blue-green/canary/feature-flags)
  4. Provide journey traceability for recommendation
  5. Document rollback plan and trade-offs

  Return structured output with:
  - Recommended deployment pattern
  - Journey traceability (why this pattern for this journey)
  - Rollback plan
  - Trade-offs accepted
  - Alternatives NOT chosen (2+ patterns)
  ```

#### 4.2: Design CI/CD Pipeline (ALWAYS)

Use the Task tool:
- **subagent_type**: `general-purpose`
- **description**: `Design CI/CD pipeline`
- **prompt**:
  ```
  Invoke the CI/CD pipeline design sub-agent to select platform and define pipeline stages.

  Agent path: .claude/agents/design-cicd-pipeline.md

  Inputs:
  - Source control: [From 02-tech-stack.ctx.md - GitHub/GitLab/Bitbucket]
  - Tech stack: [From 02-tech-stack.ctx.md - languages, frameworks, build tools]
  - Test strategy: [From 09-test-strategy.ctx.md - unit/integration/E2E requirements]
  - Deployment targets: ["development", "staging", "production"]
  - Container registry: [Inferred from cloud provider or source control]
  - Deployment pattern: [From Step 4.1 output - rolling/blue-green/canary]

  Follow the agent specification to:
  1. Select CI/CD platform based on source control and team size
  2. Define pipeline stages (lint, security scan, test, build, deploy, verify)
  3. Design build optimizations (caching, parallelization)
  4. Configure deployment automation per environment
  5. Integrate with deployment pattern from Step 4.1

  Return structured output with:
  - CI/CD platform selection with rationale
  - Pipeline stages with specific commands
  - Build optimization strategies
  - Environment-specific configurations
  - Integration with deployment pattern
  ```

#### 4.3: Design IaC Setup (ALWAYS)

Use the Task tool:
- **subagent_type**: `general-purpose`
- **description**: `Design Infrastructure as Code setup`
- **prompt**:
  ```
  Invoke the IaC design sub-agent to select IaC tool and define module structure.

  Agent path: .claude/agents/design-iac-setup.md

  Inputs:
  - Cloud provider: [From 02a-constraints.ctx.md if exists OR 02-tech-stack.ctx.md - AWS/GCP/Azure/multi-cloud]
  - Programming language preference: [From 02-tech-stack.ctx.md - primary backend language]
  - Compliance requirements: [From 02a-constraints.ctx.md if exists - HIPAA/SOC2/PCI-DSS]
  - Team size: [From 01-product-strategy.ctx.md - number]
  - Infrastructure components: [From 04-architecture.ctx.md - services, databases, message queues]
  - Deployment complexity: [From Step 3 - startup-simple/saas-moderate/enterprise-complex]

  Follow the agent specification to:
  1. Select IaC tool (Terraform, Pulumi, CDK, CloudFormation) based on language and team
  2. Design module structure (networking, compute, data, security)
  3. Define state management strategy
  4. Integrate policy-as-code if compliance required
  5. Plan for multi-environment management

  Return structured output with:
  - IaC tool selection with rationale
  - Module structure and organization
  - State management strategy
  - Policy-as-code integration (if applicable)
  - Multi-environment strategy
  ```

#### 4.4: Integrate Observability (ALWAYS)

Use the Task tool:
- **subagent_type**: `general-purpose`
- **description**: `Integrate deployment observability`
- **prompt**:
  ```
  Invoke the observability integration sub-agent to configure deployment monitoring.

  Agent path: .claude/agents/integrate-observability.md

  Inputs:
  - Session 14 exists: [Check if product-guidelines/14-observability-strategy.md exists]
  - Monitoring stack: [From 14-observability-strategy.md if exists OR default recommendations]
  - SLA requirement: [From 01-product-strategy.ctx.md - 99.999%/99.99%/99.9%/99%]
  - Deployment pattern: [From Step 4.1 output - rolling/blue-green/canary/feature-flags]
  - SLIs defined: [From 14-observability-strategy.md if exists OR defaults]
  - Critical journey steps: [From 00-user-journey.ctx.md - top 3 steps]

  Follow the agent specification to:
  1. Configure DORA metrics tracking (deployment frequency, lead time, MTTR, change failure rate)
  2. Define automated rollback triggers based on SLIs
  3. Design alert routing for deployment failures
  4. Integrate with deployment pattern health checks
  5. Plan deployment verification tests

  Return structured output with:
  - DORA metrics configuration
  - Automated rollback triggers
  - Alert routing strategy
  - Deployment verification tests
  - Health check integration
  ```

---

#### 4.5: Design Kubernetes Config (CONDITIONAL)

**Condition**: `deployment_complexity` in ["saas-moderate", "enterprise-complex"] OR tech stack mentions "kubernetes" OR microservices architecture

**Skip if**: Serverless deployment, managed platforms (Vercel, Railway, Heroku)

Use Task tool to invoke `.claude/agents/design-kubernetes-config.md`:

**Inputs to provide**:
- SLA requirement: [From 01-product-strategy.ctx.md]
- Expected users: [Estimated from 01-product-strategy.ctx.md market analysis]
- Expected requests per second: [Estimated from journey scale and user count]
- Compliance requirements: [From 02a-constraints.ctx.md if exists]
- Journey load pattern: [From 00-user-journey.ctx.md - steady/spiky/unpredictable]
- App name: [From product name in Session 1]
- Container image: [Inferred from CI/CD registry]
- App port: [From 02-tech-stack.ctx.md backend framework default]
- Health check path: "/healthz" or "/health"

**Expected output**:
- Production Kubernetes manifests (Deployment, Service, HPA, PDB)
- Resource sizing recommendations (CPU, memory requests/limits)
- Security contexts and network policies
- Health probe configurations

**If condition NOT met**: Skip this agent. Document: "Skipping Kubernetes configuration (deployment strategy is {strategy} - not requiring container orchestration)"

#### 4.6: Design Disaster Recovery (CONDITIONAL)

**Condition**: `sla_requirement` >= "99.9%" OR `journey_criticality` in ["life-critical", "financial"] OR compliance requirements exist

**Skip if**: Low-criticality journeys with SLA < 99.9% and no compliance

Use Task tool to invoke `.claude/agents/design-disaster-recovery.md`:

**Inputs to provide**:
- Journey criticality: [From 00-user-journey.ctx.md]
- SLA requirement: [From 01-product-strategy.ctx.md]
- Database complexity: [From 07-database-schema.ctx.md - number of tables, relationships]
- Compliance requirements: [From 02a-constraints.ctx.md if exists]
- RTO/RPO requirements: [From 02a-constraints.ctx.md if exists OR derived from SLA]

**Expected output**:
- RTO/RPO tier classification
- Backup strategy (3-2-1-1-0 rule implementation)
- Failover procedures (automated vs manual)
- Chaos engineering experiment recommendations
- DR testing schedule

**If condition NOT met**: Skip this agent. Document: "Skipping disaster recovery planning (SLA {sla} and criticality {criticality} do not require formal DR - basic backups sufficient)"

#### 4.7: Design Security Ops (CONDITIONAL)

**Condition**: Compliance requirements exist (Session 2a) OR `sla_requirement` >= "99.99%" OR journey handles sensitive data (PII, financial, health)

**Skip if**: Internal tools, non-sensitive data, low-security requirements

Use Task tool to invoke `.claude/agents/design-security-ops.md`:

**Inputs to provide**:
- Orchestration platform: [From Step 4.5 output OR Step 4.2 deployment target - kubernetes/ecs/cloud-run/fargate]
- Cloud provider: [From 02a-constraints.ctx.md OR 02-tech-stack.ctx.md]
- Compliance requirements: [From 02a-constraints.ctx.md if exists]
- Secret types: [database credentials, API keys, encryption keys, third-party tokens]
- Data sensitivity: [From 00-user-journey.ctx.md - PII/financial/health data handling]

**Expected output**:
- Secret management solution (AWS Secrets Manager, HashiCorp Vault, etc.)
- NetworkPolicy/security group configurations
- TLS certificate automation (cert-manager, ACM)
- Compliance control implementation (encryption at rest/transit, audit logging)
- Security scanning integration (container, dependency, secrets)

**If condition NOT met**: Skip this agent. Document: "Skipping security ops planning (no compliance requirements, handles non-sensitive data - basic secret management sufficient)"

---

### Step 5: Synthesize Sub-Agent Outputs (INCREMENTAL APPROACH)

**CRITICAL**: Do NOT load all sub-agent outputs into context simultaneously. Process ONE AT A TIME to prevent context explosion (sub-agents may return 30-50k tokens each = 200k+ total if loaded together).

**Template**: `/templates/13-deployment-plan-template.md`

**Incremental Synthesis Pattern** (process sequentially, not simultaneously):

1. **Write Header + Overview** → Include deployment complexity tier (from Step 3), total agents invoked, journey criticality, SLA requirement

2. **Write Deployment Strategy Overview** (from Step 4.1):
   - Extract ONLY Step 4.1 output
   - Append section: Chosen pattern (rolling/blue-green/canary/feature-flags)
   - Include journey traceability, rollback plan, trade-offs accepted
   - **Clear context** before next section

3. **Write Environment Architecture** (orchestrator-generated):
   - dev, staging, production configurations
   - Ephemeral preview environments (if needed)
   - Infrastructure isolation strategy

4. **Write CI/CD Pipeline** (from Step 4.2):
   - Extract ONLY Step 4.2 output
   - Append section: Platform selection, pipeline stages, build optimizations
   - **Clear context** before next section

5. **Write Infrastructure as Code** (from Step 4.3):
   - Extract ONLY Step 4.3 output
   - Append section: IaC tool, module structure, state management, policy-as-code
   - **Clear context** before next section

6. **Write Kubernetes Configuration** (from Step 4.5 - if invoked):
   - IF Step 4.5 was invoked:
     - Extract ONLY Step 4.5 output
     - Append section: Manifests, resource sizing, security contexts, health probes
     - **Clear context** before next section
   - ELSE: Skip this section

7. **Write Deployment Observability** (from Step 4.4):
   - Extract ONLY Step 4.4 output
   - Append section: DORA metrics, rollback triggers, alert routing
   - **Clear context** before next section

8. **Write Disaster Recovery** (from Step 4.6 - if invoked):
   - IF Step 4.6 was invoked:
     - Extract ONLY Step 4.6 output
     - Append section: RTO/RPO tier, backup strategy, failover procedures, chaos engineering
     - **Clear context** before next section
   - ELSE: Skip this section

9. **Write Security Operations** (from Step 4.7 - if invoked):
   - IF Step 4.7 was invoked:
     - Extract ONLY Step 4.7 output
     - Append section: Secret management, network security, TLS automation, compliance controls
     - **Clear context** before next section
   - ELSE: Skip this section

10. **Write Closing Sections** (orchestrator-generated):
    - **Cost Estimation**: Monthly infrastructure cost breakdown, optimization strategies [PLACEHOLDER: Reference /reference-material/cost-estimation-2025.md deployment tiers after PR #155 merges]
    - **Pre-Deployment Checklist**: Code quality gates, testing validation, communication requirements
    - **Post-Deployment Verification**: Immediate (0-5 min), short-term (5-30 min), medium-term (30 min - 2 hours)
    - **Runbooks**: Generate 5-10 runbooks based on journey failure modes (database connection failure, high error rate after deploy, slow performance after deploy)
    - **What We DIDN'T Choose**: 2+ deployment alternatives NOT selected with rationales

**Token Efficiency**: Max 50k tokens per step (vs 200k+ if all loaded together). Only ONE sub-agent output in context at a time.

---

### Step 6: Write Unified Deployment Plan

```bash
Write product-guidelines/13-deployment-plan.md
```

Use template structure from `/templates/13-deployment-plan-template.md` and populate with synthesized sub-agent outputs.

**CRITICAL: Journey Traceability**
- Every deployment decision must reference specific journey step, SLA requirement, or compliance constraint
- Example: "Canary deployment chosen because journey handles financial data (Session 2a: SOC2 compliance) requiring <0.1% error rate blast radius."

---

## Output Location

`product-guidelines/13-deployment-plan.md`

This will be used by:
- Engineers setting up CI/CD
- DevOps/Platform teams managing infrastructure
- Product managers understanding deploy cadence
- On-call engineers executing rollbacks

---

## Critical Orchestrator Rules

1. **Always invoke 4 core agents** - Deployment strategy, CI/CD, IaC, observability are universal requirements
2. **Conditional loading only** - Don't load Kubernetes/DR/SecOps agents for patterns not in journey
3. **Incremental synthesis (CRITICAL)** - Process sub-agent outputs ONE AT A TIME in Step 5, never load all simultaneously (prevents 200k+ token context explosion)
4. **Journey-specific synthesis** - Outputs must reference actual journey steps, SLA requirements, compliance constraints
5. **Token efficiency** - Track and report token savings vs monolithic approach
6. **Template compliance** - Follow `/templates/13-deployment-plan-template.md` structure exactly
7. **Explicit Task tool invocation** - All sub-agents invoked via Task tool (no pseudo-code "Invoke:")

---

## Quick Reference

**Conditional Loading Logic** (from Step 4):
- Kubernetes: IF deployment_complexity in ["saas-moderate", "enterprise-complex"] OR microservices
- Disaster Recovery: IF sla_requirement >= "99.9%" OR criticality in ["life-critical", "financial"]
- Security Ops: IF compliance_requirements EXISTS OR sla_requirement >= "99.99%"

**Outputs**: `13-deployment-plan.md` (comprehensive deployment guide, 15-25 pages)

---

## Key Principles

1. **Journey-driven decisions** - All deployment choices trace to user value, SLA, or compliance
2. **Automate everything** - Manual deploys create inconsistency
3. **Test in production-like** - Staging should mirror prod
4. **Deploy frequently** - Small deploys = lower risk
5. **Always have rollback** - Things will go wrong
6. **Monitor deploys** - Deployment is not done when code ships
7. **Security by default** - Secrets never in code, principle of least privilege

---

## After This Session

**Next step**: Run Session 14 (`/design-observability`) if not already completed

**Implementation steps**:
1. Set up CI/CD pipeline (GitHub Actions, GitLab CI, etc.)
2. Create infrastructure as code (Terraform, Pulumi, CDK)
3. Configure environments (dev, staging, prod)
4. Implement secrets management
5. Test deployment with a simple change
6. Document runbooks for your team

---

## Epic #167 Compliance

**Command Size**: <400 lines (orchestrator only, sub-agents conditionally loaded)
**Token Efficiency**: 40-60% reduction vs monolithic command
**Sub-Agent Count**: 7 specialized agents (4 always invoked, 3 conditional)

**This is the FIRST implementation of Epic #167 decomposition pattern**, establishing the blueprint for subsequent command refactors (#162-166).

---

## Output Format

IMPORTANT: Do not use emojis in generated outputs. Use plain text for all communication.
