---
description: POST-CASCADE - Create comprehensive compliance plan with regulatory implementation guidance
---

# POST-CASCADE: Create Compliance Plan

This is a **post-core extension** that creates a comprehensive compliance implementation roadmap for compliance-heavy products. Run this AFTER Session 2a (constraints) to translate regulatory requirements into actionable technical implementations with costs, timelines, and backlog integration.

## When to Run This

**Run AFTER Session 2a (constraints)** when you have:
- [✓] User journey defined (`product-guidelines/00-user-journey.md`)
- [✓] Product strategy validated (`product-guidelines/01-product-strategy.md`)
- [✓] Constraints documented (`product-guidelines/02a-constraints.md`)

**Ideally after technical design** when you also have:
- [✓] Database schema designed (`product-guidelines/07-database-schema.md`)
- [✓] API contracts defined (`product-guidelines/08-api-design.md`, `08b-api-contracts.md`)
- [✓] Backlog generated (`product-guidelines/10-backlog/`)

**Skip this** if:
- Your product has minimal compliance needs (constraints template is sufficient)
- You have a compliance team that handles regulatory planning
- You're building internal tools with no regulatory requirements

**Run this** if:
- **Healthcare SaaS** requiring HIPAA compliance
- **Fintech** requiring PCI-DSS, SOX, or banking regulations
- **Enterprise B2B** requiring SOC2 Type II certification for enterprise sales
- **EU/Global markets** requiring GDPR, CCPA, or international privacy laws
- **Compliance-dependent revenue**: >20% of your TAM requires compliance certifications

## Your Role

You are a compliance orchestrator coordinating specialized sub-agents to generate a comprehensive compliance plan. Your job is to:

1. **Analyze** user journey, strategy, and constraints to determine which regulations apply
2. **Conditionally invoke** specialized sub-agents for applicable regulations (GDPR, HIPAA, SOC2, PCI-DSS)
3. **Always invoke** cost estimation and automation strategy sub-agents
4. **Synthesize** sub-agent outputs into unified compliance plan
5. **Generate** final output file with journey traceability and realistic timelines

## Critical Philosophy

**Compliance must trace to journey - where user data is collected and processed.**

- Regulations identified → Based on journey geography, data types, customer segments
- Requirements broken down → Article-level detail with technical implementation
- Costs estimated → Specific dollar ranges based on 2025 market rates
- Timeline realistic → SOC2 takes 6-12 months, not 1 month
- Journey traceability → Every compliance requirement maps to journey step

**IMPORTANT**: This plan provides educational guidance based on industry best practices. It is NOT legal advice. Users MUST consult qualified legal counsel for compliance decisions.

## Process

### Step 1: Read Context Files

Read the following files to gather compliance requirements:

```bash
Read product-guidelines/00-user-journey.md  # Where user data is collected
Read product-guidelines/01-product-strategy.md  # Market geography, customer segments
Read product-guidelines/02a-constraints.md  # Identified compliance requirements
```

**Optionally read** (if available):
```bash
Read product-guidelines/07-database-schema.md  # PII/PHI fields
Read product-guidelines/08-api-design.md  # Data export/deletion endpoints
Read product-guidelines/10-backlog/epic-*.md  # Existing epics
```

Extract:
- Journey data collection points (PII, PHI, payment data)
- Market geography (EU, California, global)
- Customer segments (healthcare, finance, enterprise)
- Data lifecycle (collection, storage, retention, deletion)

### Step 2: Determine Applicable Regulations

Use decision logic to determine which regulations apply:

#### GDPR Decision
```
IF product_strategy includes EU market (any % of TAM in EU/EEA)
  AND user_journey collects personal_data from EU residents
  THEN GDPR = Required

Priority:
  IF >30% TAM in EU → Required for launch (MVP)
  ELSE IF 10-30% TAM in EU → Competitive advantage (Growth)
  ELSE IF <10% TAM in EU → Future consideration (Scale)
```

#### HIPAA Decision
```
IF user_journey handles Protected Health Information (PHI)
  OR customer_segment includes healthcare providers/payers
  OR product marketed as healthcare solution
  THEN HIPAA = Required

Priority: Always MVP (required for launch if handling PHI)
```

#### SOC2 Decision
```
IF product_strategy targets enterprise B2B (>$10K ACV)
  AND >40% of enterprise deals blocked without SOC2
  THEN SOC2 = Required/Competitive

Priority:
  IF >50% pipeline requires SOC2 → Required (Growth)
  ELSE IF 20-50% prefer SOC2 → Competitive (Scale)
```

#### PCI-DSS Decision
```
IF user_journey includes accepting credit/debit card payments
  THEN PCI-DSS = Required

Implementation: Always recommend payment processor (Stripe) → Level 4 SAQ-A
```

**Document your analysis** in a structured format:
```yaml
applicability_analysis:
  gdpr:
    applicable: true/false
    reason: "Product targets 35% of TAM in EU, collects names/emails"
    priority: "Required"
    timeline: "MVP"
  hipaa:
    applicable: true/false
    reason: "Handles medical records (PHI) from healthcare providers"
    priority: "Required"
    timeline: "MVP"
  soc2:
    applicable: true/false
    reason: "60% of enterprise pipeline requires SOC2 report"
    priority: "Required"
    timeline: "Growth"
  pci_dss:
    applicable: true/false
    reason: "Accepts card payments via Stripe"
    priority: "Required"
    timeline: "MVP"
```

### Step 3: Conditionally Invoke Sub-Agents

Based on applicability analysis, invoke specialized sub-agents:

#### GDPR Sub-Agent (Conditional)
```
IF gdpr.applicable == true:
  Task tool:
    subagent_type: general-purpose
    description: "Extract GDPR compliance requirements"
    prompt: |
      You are invoking the GDPR compliance sub-agent.

      Read /.claude/agents/compliance-gdpr.md and follow its instructions.

      Inputs to provide:
      - 00-user-journey.md content (where EU data collected)
      - 01-product-strategy.md content (% TAM in EU)
      - 07-database-schema.md content (if exists)
      - 08-api-design.md content (if exists)
      - applicability_analysis.gdpr (priority, timeline)

      Return structured YAML output as specified in compliance-gdpr.md.
```

#### HIPAA Sub-Agent (Conditional)
```
IF hipaa.applicable == true:
  Task tool:
    subagent_type: general-purpose
    description: "Extract HIPAA compliance requirements"
    prompt: |
      You are invoking the HIPAA compliance sub-agent.

      Read /.claude/agents/compliance-hipaa.md and follow its instructions.

      Inputs to provide:
      - 00-user-journey.md content (where PHI collected)
      - 01-product-strategy.md content (customer segments)
      - 07-database-schema.md content (if exists)
      - applicability_analysis.hipaa (priority, timeline)

      Return structured YAML output as specified in compliance-hipaa.md.
```

#### SOC2 Sub-Agent (Conditional)
```
IF soc2.applicable == true:
  Task tool:
    subagent_type: general-purpose
    description: "Extract SOC2 compliance requirements"
    prompt: |
      You are invoking the SOC2 compliance sub-agent.

      Read /.claude/agents/compliance-soc2.md and follow its instructions.

      Inputs to provide:
      - 01-product-strategy.md content (enterprise ACV, pipeline)
      - 04-architecture.md content (if exists)
      - applicability_analysis.soc2 (priority, timeline)

      Return structured YAML output as specified in compliance-soc2.md.
```

#### PCI-DSS Sub-Agent (Conditional)
```
IF pci_dss.applicable == true:
  Task tool:
    subagent_type: general-purpose
    description: "Extract PCI-DSS compliance requirements"
    prompt: |
      You are invoking the PCI-DSS compliance sub-agent.

      Read /.claude/agents/compliance-pci-dss.md and follow its instructions.

      Inputs to provide:
      - 00-user-journey.md content (payment flow)
      - 01-product-strategy.md content (transaction volume)
      - applicability_analysis.pci_dss (priority, timeline)

      Return structured YAML output as specified in compliance-pci-dss.md.
```

#### Cost Estimation Sub-Agent (Always)
```
Task tool:
  subagent_type: general-purpose
  description: "Calculate compliance costs"
  prompt: |
    You are invoking the compliance cost estimation sub-agent.

    Read /.claude/agents/compliance-cost-estimation.md and follow its instructions.

    Inputs to provide:
    - List of applicable regulations (GDPR, HIPAA, SOC2, PCI-DSS)
    - 02-tech-stack.md content (engineering complexity)
    - Engineering effort estimates from regulation sub-agents

    Return structured YAML cost_summary as specified.
```

#### Automation Strategy Sub-Agent (Conditional)
```
IF number_of_regulations >= 3 OR organization_size > 50:
  Task tool:
    subagent_type: general-purpose
    description: "Recommend compliance automation strategies"
    prompt: |
      You are invoking the compliance automation sub-agent.

      Read /.claude/agents/compliance-automation.md and follow its instructions.

      Inputs to provide:
      - Number of applicable regulations
      - 04-architecture.md content (cloud-native? Kubernetes?)
      - 02-tech-stack.md content (IaC usage)

      Return structured YAML automation_recommendations as specified.
```

### Step 4: Synthesize Sub-Agent Outputs

Collect outputs from all invoked sub-agents and synthesize into unified compliance plan:

1. **Merge requirements**: Combine GDPR/HIPAA/SOC2/PCI-DSS requirements into single list
2. **Identify control reuse**: Flag where HIPAA encryption satisfies GDPR Article 32, etc.
3. **Calculate total costs**: Sum legal, engineering, platform, audit costs from cost sub-agent
4. **Build compliance roadmap**: Organize requirements into MVP → Growth → Scale stages
5. **Generate backlog stories**: Create user stories for each requirement with RICE prioritization

### Step 5: Read Template and Generate Output

```bash
Read /templates/23-compliance-plan-template.md
```

Generate `product-guidelines/23-compliance-plan.md` following template structure:

**Sections to complete**:

1. **Executive Summary**: Applicable regulations, Year 1/Year 2+ costs, key milestones, risks
2. **Applicable Regulations**: For each regulation: why applicable, priority, timeline, costs, sources
3. **Detailed Requirements by Regulation**: Article/section-level requirements from sub-agents
4. **Compliance-to-Implementation Mapping**: Journey step → data → requirement → implementation → story → cost
5. **Compliance Backlog Stories**: Foundation Epic with 10-20 stories (RICE prioritized)
6. **Compliance Monitoring Strategy**: Metrics, audit trails, incident triggers, reporting cadence
7. **Compliance Roadmap by Stage**: MVP/Growth/Scale with costs and success criteria
8. **Compliance Cost Summary**: Year 1 total, Year 2+ total, ROI analysis
9. **What We DIDN'T Choose**: Alternative approaches with rationale
10. **Validation Checklist**: Journey alignment, specificity, completeness, technical soundness
11. **Next Steps**: Legal review, procurement, timeline alignment

**Quality checks before writing**:
- [ ] Every regulation traces to journey (where data is collected)
- [ ] All costs are specific ranges with year noted (2025 USD)
- [ ] All timelines are realistic (SOC2: 6-12 months, not 1 month)
- [ ] All requirements cite regulation sources (GDPR Article 17, HIPAA §164.312)
- [ ] All backlog stories include RICE scores and acceptance criteria
- [ ] Compliance roadmap shows MVP → Growth → Scale clearly
- [ ] Legal disclaimer included at top
- [ ] "What We DIDN'T Choose" includes 2+ alternative approaches

Use the Write tool to create the file.

## AI Agent Guidelines

**When orchestrating compliance sub-agents, you MUST**:

1. **Include legal disclaimer**: Every compliance plan MUST start with disclaimer that this is educational guidance, not legal advice
2. **Use conditional invocation**: Only invoke sub-agents for applicable regulations (don't load HIPAA if no PHI)
3. **Cite regulation sources**: Every requirement MUST cite specific article/section/criterion
4. **Be conservative on timelines**: SOC2 observation period is 3-6 months MINIMUM
5. **Use specific cost ranges**: From cost estimation sub-agent, not generic estimates
6. **Trace to journey**: Every compliance requirement MUST map to specific journey step
7. **Document control reuse**: Identify where HIPAA → GDPR, SOC2 → ISO 27001 overlap exists (20-40% savings)
8. **Realistic scenarios only**: Don't promise "SOC2 in 1 month" or "HIPAA compliant in 2 weeks"
9. **Validate RICE scores**: Compliance stories should have high Impact (legal risk) even if low Reach
10. **Integrate with cascade**: Reference specific sessions (7=database, 8=API, 12=scaffold, 14=observability)

## What We DIDN'T Choose (And Why)

**Alternative Approach: Monolithic Command (906 Lines)**

**Why rejected**:
- Violates Epic #167 anti-bloat architecture (<400 line orchestrator rule)
- Loads all compliance patterns unconditionally (40-60% token waste for single-regulation users)
- Harder to maintain when regulations change (e.g., GDPR amendments require editing 906-line file)

**When this might have been right**:
- Before Epic #167 was defined
- If Stack-Driven never planned to add more regulations (static framework)

**Our approach**: Orchestrator (350 lines) + 6 conditional sub-agents (200-300 lines each) = 40% token reduction for GDPR-only users

---

**Alternative Approach: Generic Compliance Checklist**

**Why rejected**:
- Violates Stack-Driven philosophy (generative, not prescriptive)
- Compliance requirements vary by journey (where data is collected)
- Generic checklists don't map to technical implementation

**When this might be right**:
- Internal tools with standard compliance needs
- Very similar products in same vertical

---

## Next Steps

After running this command:

1. **Review with legal counsel** (budget $3k-$5k for legal review of Privacy Policy, Terms, BAA)
2. **Validate regulation applicability** (confirm GDPR, HIPAA, SOC2 priorities based on market feedback)
3. **Add compliance stories to backlog** (import to Session 10 backlog, Foundation epic: Compliance & Legal sub-category)
4. **Integrate with Session 14** (use monitoring strategy to add compliance metrics to observability plan)
5. **Procurement** (evaluate compliance platforms: Vanta, Drata, Secureframe)
6. **Timeline alignment** (ensure compliance milestones align with Session 13 deployment plan)
7. **Run `/cascade-status`** to see your complete framework progress

---

**Remember**: This plan is educational guidance based on industry best practices. It is NOT legal advice. Consult qualified legal counsel for all compliance decisions.
