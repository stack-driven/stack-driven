# Production-Ready DevOps Best Practices Guide

**Organizations implementing these patterns achieve 40-60% faster deployment velocity and 35-50% cost reductions** while maintaining enterprise-grade reliability. This guide synthesizes current best practices across deployment strategies, container orchestration, CI/CD, infrastructure as code, observability, disaster recovery, security operations, and cost optimization—providing actionable decision trees, production configurations, and runbooks that teams can implement immediately.

---

## 1. Deployment strategy selection

Modern deployment strategies balance risk mitigation against velocity. The right choice depends on application criticality, team maturity, and infrastructure constraints.

### Strategy comparison matrix

| Strategy | Downtime | Resource Overhead | Rollback Speed | Risk Profile | Best For |
|----------|----------|-------------------|----------------|--------------|----------|
| **Blue-Green** | Zero | 2× infrastructure | Instant | Low | Major releases, strict SLA requirements |
| **Canary** | Near-zero | 10-20% extra | Fast (minutes) | Very low | High-risk changes, data-driven teams |
| **Rolling** | Zero | None | Slow (minutes-hours) | Medium | Frequent, low-risk updates |
| **Feature Flags** | None | Minimal | Instant | Very low | Runtime control, A/B testing |

### Deployment strategy decision tree

```
┌─────────────────────────────────────────────────────────────┐
│                DEPLOYMENT STRATEGY SELECTION                 │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
                 ┌───────────────────────┐
                 │ Is this a high-risk   │
                 │ or major change?      │
                 └───────────────────────┘
                      │           │
                     YES         NO
                      │           │
                      ▼           ▼
        ┌─────────────────┐   ┌─────────────────┐
        │ Need instant    │   │ ROLLING         │
        │ rollback?       │   │ DEPLOYMENT      │
        └─────────────────┘   └─────────────────┘
             │       │              
            YES     NO            
             │       │              
             ▼       ▼              
      ┌──────────┐ ┌──────────────────┐
      │Can afford│ │Strong monitoring │
      │2x infra? │ │in place?         │
      └──────────┘ └──────────────────┘
          │ │           │
         YES NO        YES
          │  │          │
          ▼  ▼          ▼
    ┌─────────┐  ┌─────────────┐
    │BLUE-    │  │   CANARY    │
    │GREEN    │  │ DEPLOYMENT  │
    └─────────┘  └─────────────┘
```

### Kubernetes canary deployment configuration

```yaml
# canary-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp-stable
spec:
  replicas: 9  # 90% of traffic
  selector:
    matchLabels:
      app: myapp
      track: stable
  template:
    metadata:
      labels:
        app: myapp
        track: stable
    spec:
      containers:
      - name: myapp
        image: myregistry/myapp:v1.0.0
        ports:
        - containerPort: 8080
        readinessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 5
          periodSeconds: 10
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp-canary
spec:
  replicas: 1  # 10% of traffic
  selector:
    matchLabels:
      app: myapp
      track: canary
  template:
    metadata:
      labels:
        app: myapp
        track: canary
    spec:
      containers:
      - name: myapp
        image: myregistry/myapp:v2.0.0
        ports:
        - containerPort: 8080
---
apiVersion: v1
kind: Service
metadata:
  name: myapp-service
spec:
  selector:
    app: myapp  # Routes to both stable and canary
  ports:
  - protocol: TCP
    port: 80
    targetPort: 8080
```

### GitOps with ArgoCD

ArgoCD leads for teams needing visual management and SSO integration, while Flux suits platform engineers preferring Kubernetes-native CRDs.

```yaml
# argocd-application.yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: myapp-production
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/myorg/gitops-repo.git
    targetRevision: main
    path: apps/production/myapp
    kustomize:
      images:
        - myregistry/myapp:v2.0.0
  destination:
    server: https://kubernetes.default.svc
    namespace: myapp-production
  syncPolicy:
    automated:
      prune: true      # Auto-delete removed resources
      selfHeal: true   # Auto-revert manual changes
    syncOptions:
      - CreateNamespace=true
    retry:
      limit: 5
      backoff:
        duration: 5s
        factor: 2
        maxDuration: 3m
```

### Feature flag tools comparison

| Tool | Best For | Pricing | Key Strengths |
|------|----------|---------|---------------|
| **LaunchDarkly** | Enterprise teams | $$$ | 35+ SDKs, advanced targeting, best scale |
| **Split.io** | Mid-market | $$ | Deep analytics, automated rollback |
| **Unleash** | Open-source first | Free/$ | Self-hosted, CNCF ecosystem |
| **Flagsmith** | Flexibility | Free/$ | Open-source with optional cloud |

**Key practice**: Always promote artifacts between environments—never rebuild. The same binary tested in staging must deploy to production.

---

## 2. Container orchestration patterns

### Production-ready Kubernetes deployment

This configuration implements **Guaranteed QoS**, topology spread constraints for high availability, security context hardening, and comprehensive health probes.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: production-app
  labels:
    app.kubernetes.io/name: production-app
    app.kubernetes.io/version: "1.2.3"
spec:
  replicas: 3
  revisionHistoryLimit: 5
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 25%
      maxUnavailable: 25%
  selector:
    matchLabels:
      app.kubernetes.io/name: production-app
  template:
    metadata:
      labels:
        app.kubernetes.io/name: production-app
      annotations:
        prometheus.io/scrape: "true"
    spec:
      serviceAccountName: production-app
      securityContext:
        runAsNonRoot: true
        seccompProfile:
          type: RuntimeDefault
      
      # High-availability across zones
      topologySpreadConstraints:
      - maxSkew: 1
        topologyKey: topology.kubernetes.io/zone
        whenUnsatisfiable: DoNotSchedule
        labelSelector:
          matchLabels:
            app.kubernetes.io/name: production-app
      
      containers:
      - name: app
        image: myregistry.io/production-app:1.2.3
        securityContext:
          allowPrivilegeEscalation: false
          readOnlyRootFilesystem: true
          capabilities:
            drop: ["ALL"]
        
        # Guaranteed QoS (requests == limits)
        resources:
          requests:
            cpu: "250m"
            memory: "512Mi"
          limits:
            cpu: "250m"
            memory: "512Mi"
        
        # Startup probe for slow-starting apps
        startupProbe:
          httpGet:
            path: /healthz
            port: 8080
          failureThreshold: 30
          periodSeconds: 5
        
        # Liveness detects deadlocks
        livenessProbe:
          httpGet:
            path: /healthz
            port: 8080
          periodSeconds: 10
          failureThreshold: 3
        
        # Readiness controls traffic routing
        readinessProbe:
          httpGet:
            path: /ready
            port: 8080
          periodSeconds: 5
          failureThreshold: 3
---
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: production-app-pdb
spec:
  minAvailable: 2
  selector:
    matchLabels:
      app.kubernetes.io/name: production-app
```

### Service mesh adoption decision tree

```
Do you need a service mesh?
│
├─► 50+ microservices? ──────────────────────► LIKELY YES
├─► Strict mTLS/zero-trust requirements? ────► LIKELY YES
├─► Advanced traffic management needed? ─────► CONSIDER
└─► None of the above ───────────────────────► NOT NEEDED

IF MESH NEEDED:
├─► Priority: SIMPLICITY + PERFORMANCE ──────► Linkerd
│   (Easiest setup, lowest overhead, mTLS auto-enabled)
├─► Priority: FEATURES + ENTERPRISE ─────────► Istio
│   (Most mature, multi-cluster, advanced traffic mgmt)
└─► Priority: eBPF + NETWORK POLICY ─────────► Cilium
    (Already using Cilium CNI, L7-aware policies)
```

**Performance benchmarks**: Linkerd adds **5-10% latency overhead**, Istio **25-35%**, Cilium **20-40%**.

### Helm chart values pattern

```yaml
# values.yaml - Production defaults
replicaCount: 3

image:
  repository: myregistry.io/myapp
  tag: ""  # Set via CI
  pullPolicy: IfNotPresent

resources:
  requests:
    cpu: 250m
    memory: 512Mi
  limits:
    cpu: 500m
    memory: 1Gi

autoscaling:
  enabled: true
  minReplicas: 3
  maxReplicas: 10
  targetCPUUtilization: 70

podDisruptionBudget:
  enabled: true
  minAvailable: 2

podSecurityContext:
  runAsNonRoot: true
  seccompProfile:
    type: RuntimeDefault

containerSecurityContext:
  allowPrivilegeEscalation: false
  readOnlyRootFilesystem: true
  capabilities:
    drop: ["ALL"]
```

---

## 3. CI/CD pipeline design

### Platform selection decision tree

```
What's your primary source control?
├── GitHub ────────► GitHub Actions (native integration)
├── GitLab ────────► GitLab CI (integrated DevSecOps)
├── Multiple/Bitbucket:
│   ├─► Need K8s-native? ──► Tekton
│   ├─► Max customization? ─► Jenkins
│   └─► Speed/simplicity? ──► CircleCI
└── Enterprise + legacy ───► Jenkins
```

**Real-world metrics**: Shopify migrated Jenkins→GitLab CI with **40% faster deployments**; Stripe reduced CI times from **45 minutes to 7 minutes** using Bazel.

### GitHub Actions with security scanning

```yaml
name: CI/CD with Security Scanning
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

permissions:
  contents: read
  security-events: write
  packages: write

jobs:
  security-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      # SAST with CodeQL
      - name: Initialize CodeQL
        uses: github/codeql-action/init@v3
        with:
          languages: javascript, typescript

      - name: Perform CodeQL Analysis
        uses: github/codeql-action/analyze@v3

      # Dependency scanning
      - name: Run Snyk
        uses: snyk/actions/node@master
        continue-on-error: true
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        with:
          args: --severity-threshold=high

      # Secret scanning
      - name: Run Gitleaks
        uses: gitleaks/gitleaks-action@v2
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

  build:
    needs: security-scan
    runs-on: ubuntu-latest
    outputs:
      image_tag: ${{ steps.meta.outputs.tags }}
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - run: npm ci
      - run: npm test -- --coverage
      - run: npm run build

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Build and push with BuildKit caching
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

  container-scan:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - name: Run Trivy vulnerability scanner
        uses: aquasecurity/trivy-action@0.33.1
        with:
          image-ref: ${{ needs.build.outputs.image_tag }}
          format: 'sarif'
          severity: 'CRITICAL,HIGH'

  deploy-staging:
    needs: [build, container-scan]
    environment: staging
    runs-on: ubuntu-latest
    steps:
      - name: Deploy and smoke test
        run: |
          helm upgrade --install myapp ./charts/myapp \
            --set image.tag=${{ github.sha }} \
            --namespace staging --wait
          curl -f https://staging.example.com/health
```

### Build optimization checklist

- **Dependency caching**: Use lockfile hash as cache key with fallback keys
- **Docker BuildKit**: Enable with `DOCKER_BUILDKIT=1` for **40% faster builds**
- **Multi-stage builds**: Separate dependency installation from compilation
- **Parallel execution**: Run independent jobs concurrently
- **Affected detection**: Use Turborepo/Nx/Bazel for monorepos

---

## 4. Infrastructure as code

### Tool selection decision tree

```
What's your primary requirement?
│
├── Multi-cloud infrastructure?
│   ├─► Team primarily developers? ─────► Pulumi
│   └─► Ops-focused team? ──────────────► Terraform/OpenTofu
│
├── AWS-only environment? ──────────────► AWS CDK
│
├── Complex programming logic needed? ──► Pulumi
│
├── Vendor lock-in a concern? ──────────► OpenTofu + Terragrunt
│
└── Configuration management focus? ────► Ansible
```

| Feature | Terraform | Pulumi | AWS CDK | Ansible |
|---------|-----------|--------|---------|---------|
| **Language** | HCL | Python/TS/Go | TS/Python | YAML |
| **Cloud Support** | 1000+ providers | 500+ | AWS only | Multi-cloud |
| **State** | External (S3) | Pulumi Cloud | CloudFormation | Stateless |
| **Testing** | Terratest, Checkov | Native unit tests | CDK Assertions | Molecule |

### Terraform module structure

```
modules/vpc/
├── main.tf           # Primary resources
├── variables.tf      # Input declarations with validation
├── outputs.tf        # Output values
├── versions.tf       # Provider constraints
├── README.md         # Documentation
├── examples/         # Usage examples
│   └── complete/
└── test/             # Terratest files
```

**Example variables.tf with validation:**
```hcl
variable "vpc_cidr" {
  description = "CIDR block for the VPC"
  type        = string
  default     = "10.0.0.0/16"

  validation {
    condition     = can(cidrhost(var.vpc_cidr, 0))
    error_message = "Must be a valid CIDR block."
  }
}

variable "name" {
  description = "Name prefix for all resources"
  type        = string

  validation {
    condition     = length(var.name) <= 24
    error_message = "Name must be 24 characters or less."
  }
}
```

### State management with S3 (Terraform 1.10+)

```hcl
terraform {
  backend "s3" {
    bucket       = "mycompany-terraform-state"
    key          = "environments/prod/terraform.tfstate"
    region       = "us-west-2"
    encrypt      = true
    use_lockfile = true  # Native S3 locking (new!)
    kms_key_id   = "alias/terraform-state-key"
  }
}
```

### Multi-environment with Terragrunt

```
infrastructure/
├── modules/              # Shared modules
├── environments/
│   ├── _env/            # Shared configs
│   │   └── app.hcl
│   ├── dev/
│   │   ├── env.hcl      # environment = "dev"
│   │   └── app/
│   │       └── terragrunt.hcl
│   └── prod/
│       ├── env.hcl      # environment = "prod"
│       └── app/
│           └── terragrunt.hcl
└── root.hcl             # Remote state config
```

---

## 5. Monitoring and observability stack

### Three pillars of observability

| Signal | Purpose | When to Use |
|--------|---------|-------------|
| **Metrics** | "How much" | Real-time alerting, SLO tracking, capacity planning |
| **Logs** | "What happened" | Debugging, compliance, forensic analysis |
| **Traces** | "Where/Why" | Distributed debugging, latency analysis |

### Tool selection decision tree

```
Budget constraint primary concern?
├─► YES → Platform engineering capacity?
│   ├─► YES → Grafana Stack (LGTM)
│   └─► NO → Grafana Cloud or New Relic Free
└─► NO → Continue...

Need comprehensive security monitoring?
├─► YES → Datadog (strong DevSecOps)
└─► NO → Continue...

Kubernetes/cloud-native focus?
├─► YES + Already using Prometheus → Grafana Stack
└─► NO → Datadog or New Relic (easier onboarding)
```

| Feature | Datadog | New Relic | Grafana Stack |
|---------|---------|-----------|---------------|
| **100 hosts cost** | $1,500-5,000/mo | $1,000-3,000/mo | Free (self-hosted) |
| **Vendor lock-in** | High | Medium | Low (OTel) |
| **Setup complexity** | Low | Low | Medium-High |

### SLI/SLO template

```yaml
service_name: "checkout-api"
owner: "payments-team"

slis:
  - name: "availability"
    formula: |
      sum(rate(http_requests_total{status!~'5..'}[5m])) 
      / sum(rate(http_requests_total[5m]))
    
  - name: "latency_p99"
    formula: |
      histogram_quantile(0.99, rate(http_request_duration_seconds_bucket[5m]))
    threshold: "< 500ms"

slos:
  - name: "Checkout Availability"
    sli: "availability"
    target: 99.9%
    window: "30 days (rolling)"
    error_budget: "43.2 minutes/month"

error_budget_policy:
  - condition: "Budget > 50%"
    action: "Normal development velocity"
  - condition: "Budget 25-50%"
    action: "Increased review for risky changes"
  - condition: "Budget < 25%"
    action: "Feature freeze, focus on reliability"
```

### Prometheus alerting rules

```yaml
groups:
  - name: service-alerts
    rules:
      - alert: HighErrorRate
        expr: |
          (sum(rate(http_requests_total{status=~"5.."}[5m])) by (service)
          / sum(rate(http_requests_total[5m])) by (service)) > 0.05
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High error rate on {{ $labels.service }}"
          runbook_url: "https://runbooks.example.com/high-error-rate"

      - alert: SLOBurnRateHigh
        expr: |
          (sum(rate(http_requests_total{status=~"5.."}[1h])) by (service)
          / sum(rate(http_requests_total[1h])) by (service)) > (14.4 * 0.001)
          and
          (sum(rate(http_requests_total{status=~"5.."}[5m])) by (service)
          / sum(rate(http_requests_total[5m])) by (service)) > (14.4 * 0.001)
        for: 2m
        labels:
          severity: critical
        annotations:
          summary: "SLO burn rate 14.4x sustainable for {{ $labels.service }}"
```

### Alert fatigue prevention

| Severity | Response Time | Notification Channel |
|----------|---------------|---------------------|
| **P1 Critical** | Immediate | Page on-call, auto-escalate 15min |
| **P2 High** | 30 minutes | Page business hours only |
| **P3 Medium** | 4 hours | Slack, ticket creation |
| **P4 Low** | Next business day | Email, dashboard only |

**Target**: <2 pages per on-call shift, >30% actionable alert rate.

---

## 6. Disaster recovery planning

### RTO/RPO matrix by tier

| Tier | Classification | RTO | RPO | Strategy | Monthly Cost |
|------|---------------|-----|-----|----------|-------------|
| **0** | Infrastructure Critical | <1 min | Near-zero | Active-active | $$$$$ |
| **1** | Mission Critical | <15 min | <1 min | Hot standby | $$$$ |
| **2** | Business Critical | 1-4 hours | 1-2 hours | Warm standby | $$$ |
| **3** | Business Operational | 8-24 hours | 4-8 hours | Cold standby | $$ |
| **4** | Non-Critical | 24-72 hours | 24 hours | Archive backups | $ |

### The 3-2-1-1-0 backup rule

| Component | Meaning | Implementation |
|-----------|---------|----------------|
| **3** | Three copies | Production + 2 backups |
| **2** | Two media types | Disk + cloud storage |
| **1** | One offsite | Different region/datacenter |
| **1** | One immutable | Object lock, WORM storage |
| **0** | Zero recovery errors | Regular restore testing |

### Velero backup configuration

```yaml
apiVersion: velero.io/v1
kind: Schedule
metadata:
  name: production-daily-backup
  namespace: velero
spec:
  schedule: "0 2 * * *"  # Daily at 2 AM UTC
  template:
    ttl: "720h"  # 30 days retention
    includedNamespaces:
      - production
    excludedResources:
      - events
      - pods
    snapshotVolumes: true
    hooks:
      resources:
        - name: database-hook
          includedNamespaces:
            - production
          labelSelector:
            matchLabels:
              app: postgresql
          pre:
            - exec:
                container: postgresql
                command: ["/bin/sh", "-c", 
                  "pg_dump -U postgres mydb > /backup/pre-snapshot.sql"]
                timeout: 5m
```

### Chaos Mesh experiment

```yaml
apiVersion: chaos-mesh.org/v1alpha1
kind: NetworkChaos
metadata:
  name: network-delay-experiment
spec:
  action: delay
  mode: all
  selector:
    namespaces:
      - production
    labelSelectors:
      app: payment-service
  delay:
    latency: "100ms"
    jitter: "10ms"
  duration: "5m"
```

### Incident response runbook template

```markdown
# INCIDENT RESPONSE PLAYBOOK

## 1. DETECTION (First 5 minutes)
- [ ] Acknowledge alert
- [ ] Assess severity using classification matrix
- [ ] Create incident channel: #incident-YYYY-MM-DD-description
- [ ] Page incident commander if SEV-1/SEV-2

## 2. ROLE ASSIGNMENT
| Role | Responsibility |
|------|----------------|
| Incident Commander | Coordination, decisions |
| Technical Lead | Investigation, remediation |
| Communications Lead | Status updates |
| Scribe | Timeline documentation |

## 3. INVESTIGATION
- [ ] Check recent deployments: `kubectl rollout history`
- [ ] Check logs: `kubectl logs -l app=<service> --since=1h`
- [ ] Review metrics dashboards
- [ ] Check external dependencies

## 4. MITIGATION (Priority Order)
1. Rollback recent changes: `kubectl rollout undo`
2. Scale resources: `kubectl scale deployment --replicas=+2`
3. Failover to healthy region
4. Deploy targeted fix

## 5. POST-INCIDENT
- [ ] Schedule postmortem within 48 hours
- [ ] Create follow-up action items
- [ ] Update runbooks with learnings
```

---

## 7. Security operations

### Secret management decision tree

```
Multi-cloud/Hybrid environment?
├─► YES → HashiCorp Vault
│   • Dynamic secrets, fine-grained policies
│
└─► NO → Single cloud?
    ├─► AWS → AWS Secrets Manager
    │   • Native RDS/Lambda integration, auto-rotation
    ├─► Azure → Azure Key Vault
    │   • AAD integration, HSM options
    └─► Need simplicity → Doppler
        • Developer-friendly, built-in sync
```

### Vault Kubernetes integration

```yaml
# Pod with Vault sidecar injection
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp
spec:
  template:
    metadata:
      annotations:
        vault.hashicorp.com/agent-inject: "true"
        vault.hashicorp.com/role: "myapp-role"
        vault.hashicorp.com/agent-inject-secret-db-creds: "database/creds/myapp"
        vault.hashicorp.com/agent-inject-template-db-creds: |
          {{- with secret "database/creds/myapp" -}}
          DB_USERNAME={{ .Data.username }}
          DB_PASSWORD={{ .Data.password }}
          {{- end }}
    spec:
      serviceAccountName: myapp-sa
      containers:
      - name: myapp
        command: ["/bin/sh", "-c"]
        args:
          - source /vault/secrets/db-creds && exec ./myapp
```

### cert-manager for automatic TLS

```yaml
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: myapp-tls
  namespace: production
spec:
  secretName: myapp-tls-secret
  duration: 2160h    # 90 days
  renewBefore: 360h  # 15 days before expiry
  privateKey:
    algorithm: ECDSA
    size: 256
    rotationPolicy: Always
  dnsNames:
    - myapp.company.com
  issuerRef:
    name: letsencrypt-prod
    kind: ClusterIssuer
```

### Kubernetes NetworkPolicy (default deny + selective allow)

```yaml
# Default deny all
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny-all
  namespace: production
spec:
  podSelector: {}
  policyTypes:
  - Ingress
  - Egress
---
# Allow frontend to backend
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: backend-allow-frontend
spec:
  podSelector:
    matchLabels:
      app: backend
  ingress:
  - from:
    - podSelector:
        matchLabels:
          app: frontend
    ports:
    - protocol: TCP
      port: 8080
```

### Kyverno policy: require resource limits

```yaml
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: require-requests-limits
spec:
  validationFailureAction: Enforce
  rules:
  - name: validate-resources
    match:
      any:
      - resources:
          kinds:
          - Pod
    validate:
      message: "CPU and memory requests/limits are required."
      pattern:
        spec:
          containers:
          - resources:
              requests:
                memory: "?*"
                cpu: "?*"
              limits:
                memory: "?*"
```

---

## 8. Cost optimization

### Cost strategy decision tree

```
Analyze Workload
│
├─► Stateless + tolerates interruptions?
│   └─► Spot Instances (60-90% savings)
│       • Batch, CI/CD, dev/test
│
├─► Stateful + predictable usage?
│   └─► Reserved/Savings Plans (30-72% savings)
│       • Databases, core services
│
├─► Containerized (Kubernetes)?
│   ├─► VPA/Goldilocks for right-sizing
│   ├─► Karpenter for node provisioning
│   │   ├─ Critical → On-Demand + PDBs
│   │   └─ Non-critical → Spot NodePool
│   └─► Kubecost/OpenCost for monitoring
│
└─► Commitment Strategy
    ├─ Baseline × 70-80% → Savings Plans
    ├─ Variable/fault-tolerant → Spot
    └─ Remainder → On-Demand
```

### Karpenter spot configuration

```yaml
apiVersion: karpenter.sh/v1
kind: NodePool
metadata:
  name: spot-general
spec:
  disruption:
    consolidationPolicy: WhenEmptyOrUnderutilized
    consolidateAfter: 1m
    budgets:
    - nodes: 10%
  template:
    spec:
      requirements:
      - key: karpenter.sh/capacity-type
        operator: In
        values: ["spot", "on-demand"]
      - key: kubernetes.io/arch
        operator: In
        values: ["amd64", "arm64"]
      - key: karpenter.k8s.aws/instance-category
        operator: In
        values: ["c", "m", "r"]
      - key: karpenter.k8s.aws/instance-generation
        operator: Gt
        values: ["4"]
  limits:
    cpu: "1000"
    memory: 1000Gi
```

### FinOps maturity checklist

**Walk Phase (Target 6 months):**
- [ ] 70-80% tag compliance
- [ ] Showback reports automated
- [ ] Right-sizing recommendations automated
- [ ] 50%+ Savings Plans coverage
- [ ] Spot instances for eligible workloads
- [ ] Budget alerts configured

**Run Phase (Target 12 months):**
- [ ] 95%+ tag compliance
- [ ] Full chargeback implemented
- [ ] 80%+ commitment coverage
- [ ] 35%+ effective savings rate
- [ ] Unit economics tracked (cost per transaction)
- [ ] Cost integrated in CI/CD (Infracost)

### Cost optimization benchmarks

| Strategy | Typical Savings | Effort |
|----------|-----------------|--------|
| Right-sizing | 20-35% | Medium |
| Reserved/Savings Plans | 30-72% | Low |
| Spot instances | 60-90% | Medium |
| Idle resource cleanup | 10-25% | Low |
| Scheduling (dev/test) | 60-70% | Low |

**Organizations implementing comprehensive FinOps achieve 35-50% cost reduction** while maintaining performance.

---

## Quick reference: decision trees summary

| Decision | Key Factors | Recommended Default |
|----------|-------------|---------------------|
| **Deployment** | Risk level, rollback needs | Canary for production |
| **Service Mesh** | Scale, mTLS requirements | Linkerd for simplicity |
| **CI/CD Platform** | Source control, team size | GitHub Actions for GitHub users |
| **IaC Tool** | Cloud diversity, team skills | Terraform/OpenTofu |
| **Observability** | Budget, K8s focus | Grafana Stack for cost-conscious |
| **Secret Management** | Cloud diversity | Vault for multi-cloud |
| **Compute Strategy** | Workload tolerance | 70% committed + 30% Spot/OD |

This guide provides the foundation for production-grade DevOps. Start with the highest-impact areas for your organization—typically deployment automation and observability—then progressively implement security, cost optimization, and disaster recovery practices as your platform matures.