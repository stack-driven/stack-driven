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

Invoke sub-agents based on journey requirements (Epic #167 pattern):

#### ALWAYS Invoked (4 core sub-agents):

**1. Select Deployment Strategy**
```bash
Invoke: .claude/agents/select-deployment-strategy.md
Inputs: {
  journey_criticality: [extracted from Session 1],
  sla_requirement: [extracted from Session 2],
  deployment_frequency_target: [extracted from Session 2],
  regulated_industry: [from Session 2a],
  journey_downtime_tolerance: [from Session 1],
  team_size: [from Session 2],
  product_stage: [from Session 2]
}
Output: Deployment pattern (rolling/blue-green/canary/feature-flags) with journey traceability
```

**2. Design CI/CD Pipeline**
```bash
Invoke: .claude/agents/design-cicd-pipeline.md
Inputs: {
  source_control: [from Session 3],
  tech_stack: [from Session 3],
  test_strategy: [from Session 9],
  deployment_targets: ["development", "staging", "production"],
  container_registry: [inferred from cloud provider]
}
Output: CI/CD platform selection, pipeline stages, build optimizations
```

**3. Design IaC Setup**
```bash
Invoke: .claude/agents/design-iac-setup.md
Inputs: {
  cloud_provider: [from Session 2a constraints OR Session 3],
  programming_language_preference: [from Session 3],
  compliance_requirements: [from Session 2a],
  team_size: [from Session 2],
  infrastructure_components: [from Session 4 architecture]
}
Output: IaC tool selection, module structure, state management, policy-as-code
```

**4. Integrate Observability**
```bash
Invoke: .claude/agents/integrate-observability.md
Inputs: {
  session_14_exists: [check if file exists],
  monitoring_stack: [from Session 14 OR default recommendations],
  sla_requirement: [from Session 2],
  deployment_pattern: [from sub-agent 1 output],
  slis_defined: [from Session 14 OR defaults]
}
Output: DORA metrics tracking, automated rollback triggers, alert routing
```

---

#### CONDITIONAL Invocation (3 sub-agents):

**5. Design Kubernetes Config** (if orchestration == "kubernetes" OR replicas > 1)
```bash
CONDITION: deployment_complexity in ["saas-moderate", "enterprise-complex"]
           OR tech_stack mentions "kubernetes"
           OR microservices architecture

Invoke: .claude/agents/design-kubernetes-config.md
Inputs: {
  sla_requirement: [from Session 2],
  expected_users: [estimated from Session 2 strategy],
  expected_requests_per_second: [estimated from journey scale],
  compliance_requirements: [from Session 2a],
  journey_load_pattern: [from Session 1: steady/spiky/unpredictable],
  app_name: [from product name],
  container_image: [inferred from CI/CD],
  app_port: [from tech stack],
  health_check_path: "/healthz"
}
Output: Production Kubernetes manifests (Deployment, Service, HPA, PDB)
```

**6. Design Disaster Recovery** (if SLA > 99.9% OR criticality in ["life-critical", "financial"])
```bash
CONDITION: sla_requirement >= "99.9%"
           OR journey_criticality in ["life-critical", "financial"]
           OR compliance_requirements exists

Invoke: .claude/agents/design-disaster-recovery.md
Inputs: {
  journey_criticality: [from Session 1],
  sla_requirement: [from Session 2],
  database_complexity: [from Session 7],
  compliance_requirements: [from Session 2a]
}
Output: RTO/RPO tier, backup strategy (3-2-1-1-0 rule), failover procedures, chaos engineering
```

**7. Design Security Ops** (if compliance exists OR security_tier == "high")
```bash
CONDITION: compliance_requirements exists (Session 2a)
           OR sla_requirement >= "99.99%"
           OR journey handles sensitive data

Invoke: .claude/agents/design-security-ops.md
Inputs: {
  orchestration_platform: [kubernetes/ecs/cloud-run],
  cloud_provider: [from Session 2a OR Session 3],
  compliance_requirements: [from Session 2a],
  secret_types: [database_credentials, api_keys, encryption_keys]
}
Output: Secret management, NetworkPolicy, TLS automation, compliance controls
```

---

### Step 5: Synthesize Sub-Agent Outputs

Combine sub-agent recommendations into unified deployment plan:

1. **Deployment Strategy Overview** (from sub-agent 1)
   - Chosen pattern (rolling/blue-green/canary/feature-flags)
   - Journey traceability
   - Rollback plan
   - Trade-offs accepted

2. **Environment Architecture**
   - dev, staging, production configurations
   - Ephemeral preview environments (if needed)

3. **CI/CD Pipeline** (from sub-agent 2)
   - Platform selection
   - Pipeline stages (lint, security, test, build, deploy, verify)
   - Build optimizations

4. **Infrastructure as Code** (from sub-agent 3)
   - IaC tool and module structure
   - State management
   - Policy-as-code integration

5. **Kubernetes Configuration** (from sub-agent 5 - if invoked)
   - Production-grade manifests
   - Resource sizing
   - Security contexts
   - Health probes

6. **Deployment Observability** (from sub-agent 4)
   - DORA metrics tracking
   - Automated rollback triggers
   - Alert routing

7. **Disaster Recovery** (from sub-agent 6 - if invoked)
   - RTO/RPO tier
   - Backup strategy
   - Failover procedures
   - Chaos engineering experiments

8. **Security Operations** (from sub-agent 7 - if invoked)
   - Secret management
   - Network security
   - TLS automation
   - Compliance controls

9. **Cost Estimation**
   - Monthly infrastructure cost breakdown
   - Optimization strategies
   - [PLACEHOLDER: Reference /reference-material/cost-estimation-2025.md deployment tiers after PR #155 merges]

10. **Pre-Deployment Checklist**
   - Code quality gates
   - Testing validation
   - Communication requirements

11. **Post-Deployment Verification**
   - Immediate (0-5 min), short-term (5-30 min), medium-term (30 min - 2 hours)

12. **Runbooks**
   - Database connection failure
   - High error rate after deploy
   - Slow performance after deploy
   - [Generate 5-10 runbooks based on journey failure modes]

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
