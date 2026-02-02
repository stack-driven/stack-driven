# Security Testing Guide

*Last Updated: February 2026*

## Overview

Security testing verifies your application is protected against vulnerabilities. This guide covers SAST (Static Application Security Testing), container scanning, DAST (Dynamic Application Security Testing), and OWASP Top 10 coverage.

**Why It Matters:**
- **Data Breach Cost:** Average $4.45M per breach (IBM 2023)
- **Compliance:** GDPR, HIPAA, PCI DSS require security controls
- **Reputation:** 65% of consumers lose trust after a breach
- **Legal:** Negligence lawsuits from preventable vulnerabilities

---

## SAST (Static Application Security Testing)

### Tool Comparison (2025)

| Tool | Best For | Accuracy | Speed | Languages | Cost |
|------|----------|----------|-------|-----------|------|
| **CodeQL** | GitHub-native, semantic analysis | **88%** (5% FP) | Medium | 30+ | Free (public) / Paid (private) |
| **Semgrep** | Custom rules, open-source | **82%** (12% FP) | **20-100K loc/sec** | 30+ | Free / Paid |
| **SonarQube** | 30+ languages, quality + security | Good | 0.4K loc/sec | 30+ | Free (Community) / Paid |
| **Snyk Code** | AI-trained, low false positives | Good | Fast | 10+ | Free / Paid |

**Accuracy Data:** Independent testing by OWASP Benchmark, NIST SATE.

**What SAST Tools Catch:**
- ✅ SQL injection vulnerabilities
- ✅ XSS (Cross-Site Scripting)
- ✅ Hard-coded credentials
- ✅ Insecure crypto usage
- ✅ Command injection
- ✅ Path traversal

**What SAST Tools MISS:**
- ❌ Logic flaws (business logic vulnerabilities)
- ❌ Authorization issues (access control bugs)
- ❌ Context-dependent vulnerabilities (runtime state)
- ❌ Configuration issues (deployment settings)

### CodeQL (GitHub Advanced Security)

**Why CodeQL?**
- Native GitHub integration (code scanning alerts in PRs)
- 88% accuracy (highest among SAST tools)
- Semantic analysis (understands code flow, not just pattern matching)
- Free for public repositories

**Setup:**

```yaml
# .github/workflows/codeql.yml
name: CodeQL

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  schedule:
    - cron: '0 0 * * 1'  # Weekly Monday scan

jobs:
  analyze:
    name: Analyze
    runs-on: ubuntu-latest
    permissions:
      security-events: write

    strategy:
      matrix:
        language: ['javascript', 'python']

    steps:
      - uses: actions/checkout@v3

      - name: Initialize CodeQL
        uses: github/codeql-action/init@v2
        with:
          languages: ${{ matrix.language }}

      - name: Autobuild
        uses: github/codeql-action/autobuild@v2

      - name: Perform CodeQL Analysis
        uses: github/codeql-action/analyze@v2
```

**Custom Queries:**

```ql
// .github/codeql/custom-queries/hardcoded-secrets.ql
import python

from StringLiteral s
where s.getText().regexpMatch(".*(?:password|api[_-]?key|secret).*=.*")
select s, "Potential hardcoded credential"
```

**Severity Levels:**
- **Critical/High:** Block PR merge
- **Medium:** Warn (don't block)
- **Low:** Informational

### Semgrep (Speed + Custom Rules)

**Why Semgrep?**
- 20-100K lines/sec (50-250x faster than CodeQL)
- YAML-based custom rules (easy to write)
- Great for monorepos (fast enough for large codebases)

**Setup:**

```yaml
# .github/workflows/semgrep.yml
name: Semgrep

on: [pull_request]

jobs:
  semgrep:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Run Semgrep
        uses: returntocorp/semgrep-action@v1
        with:
          config: >-
            p/security-audit
            p/owasp-top-ten
            p/python
```

**Custom Rule Example:**

```yaml
# .semgrep/rules/detect-sql-injection.yml
rules:
  - id: sql-injection-django
    pattern: |
      cursor.execute($QUERY, ...)
    message: Potential SQL injection. Use parameterized queries.
    severity: ERROR
    languages: [python]
    metadata:
      cwe: "CWE-89"
      owasp: "A03:2021 - Injection"
```

### SonarQube (Quality + Security)

**Why SonarQube?**
- Combines code quality + security
- Excellent for polyglot projects (30+ languages)
- Quality gates (block merge if tech debt too high)

**Setup (Self-Hosted):**

```yaml
# .github/workflows/sonarqube.yml
- name: SonarQube Scan
  uses: sonarsource/sonarqube-scan-action@master
  env:
    SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
    SONAR_HOST_URL: ${{ secrets.SONAR_HOST_URL }}
```

**Quality Gate:**
```properties
# sonar-project.properties
sonar.projectKey=compliance-saas
sonar.sources=src
sonar.tests=tests
sonar.qualitygate.wait=true
sonar.qualitygate.timeout=300

# Fail if:
# - New vulnerabilities: > 0
# - New code coverage: < 80%
# - New duplications: > 3%
```

### Recommendation by Use Case

| Use Case | Recommended Tool | Rationale |
|----------|------------------|-----------|
| **GitHub users** | CodeQL | Native integration, 88% accuracy, free for public repos |
| **Speed priority** | Semgrep | 20-100K loc/sec, custom rules easy |
| **Custom rules** | Semgrep | YAML-based rule creation |
| **Multi-language monorepo** | SonarQube | 30+ languages, quality + security |
| **AI-assisted scanning** | Snyk Code | AI-trained, low false positives |

---

## Container Security Scanning

### Trivy (Industry Standard 2025)

**Why Trivy?**
- Comprehensive: OS packages, app dependencies, IaC, secrets, licenses
- Fast: Scans complete in 10-30 seconds
- Free and open-source (CNCF project)
- Multi-format support: Docker, OCI, Kubernetes, Terraform

**Installation:**

```bash
# macOS
brew install trivy

# Linux
sudo apt-get install trivy

# Docker
docker run aquasec/trivy image nginx:latest
```

### Basic Usage

**Scan Docker Image:**
```bash
# Scan image
trivy image nginx:latest

# Scan with severity filter
trivy image --severity HIGH,CRITICAL nginx:latest

# Output as JSON
trivy image --format json --output results.json nginx:latest

# Fail CI if vulnerabilities found
trivy image --exit-code 1 --severity HIGH,CRITICAL myapp:latest
```

**Scan Filesystem:**
```bash
# Scan project directory
trivy fs .

# Scan specific dependency files
trivy fs --scanners vuln package.json
```

**Scan Kubernetes Cluster:**
```bash
# Scan all resources in cluster
trivy k8s --report summary cluster

# Scan specific namespace
trivy k8s --namespace production deployment/myapp
```

**Scan IaC (Terraform, Dockerfile, Kubernetes manifests):**
```bash
# Scan Terraform files
trivy config ./terraform

# Scan Dockerfile
trivy config Dockerfile

# Scan Kubernetes manifests
trivy config k8s/
```

**Scan for Secrets:**
```bash
# Scan for hardcoded secrets (AWS keys, API tokens, etc.)
trivy fs --scanners secret .

# Example output:
# HIGH: AWS Access Key ID found in config.py
# HIGH: GitHub Personal Access Token found in .env
```

### CI/CD Integration

```yaml
# .github/workflows/container-security.yml
name: Container Security

on: [push, pull_request]

jobs:
  trivy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Build Docker image
        run: docker build -t myapp:${{ github.sha }} .

      - name: Run Trivy vulnerability scanner
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: myapp:${{ github.sha }}
          format: 'sarif'
          output: 'trivy-results.sarif'
          severity: 'HIGH,CRITICAL'
          exit-code: '1'  # Fail build if vulnerabilities found

      - name: Upload Trivy results to GitHub Security
        uses: github/codeql-action/upload-sarif@v2
        with:
          sarif_file: 'trivy-results.sarif'
```

### Best Practices

**1. Use Minimal Base Images**
```dockerfile
# BAD: Large attack surface (1000+ packages)
FROM ubuntu:latest

# GOOD: Minimal (10-20 packages)
FROM alpine:latest

# BETTER: Distroless (zero OS packages)
FROM gcr.io/distroless/python3-debian11
```

**2. Prefer Specific Tags Over `latest`**
```dockerfile
# BAD: Unpredictable (tag changes over time)
FROM nginx:latest

# GOOD: Pinned version
FROM nginx:1.25.3-alpine
```

**3. Multi-Stage Builds (Exclude Build Tools)**
```dockerfile
# Stage 1: Build
FROM node:18 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Runtime (only production files)
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
CMD ["node", "dist/index.js"]
```

**4. Scan at Build Time AND in Registry**
```yaml
# Build-time scan (catch before push)
- run: trivy image --exit-code 1 myapp:latest

# Registry scan (catch new CVEs over time)
- uses: aquasecurity/trivy-action@master
  with:
    image-ref: registry.example.com/myapp:latest
    scan-type: 'image'
```

**5. Implement Image Signing (Supply Chain Security)**
```bash
# Sign image with Cosign (Sigstore)
cosign sign --key cosign.key myapp:latest

# Verify signature before deployment
cosign verify --key cosign.pub myapp:latest
```

---

## SAST/DAST/IAST Integration Strategy

| Stage | Type | Tools | Purpose | Blocking |
|-------|------|-------|---------|----------|
| **IDE / Pre-commit** | SAST | SonarLint, Semgrep | Catch before commit | No (warnings) |
| **Pull Request** | SAST | CodeQL, Snyk, Trivy | Prevent vulnerable code merging | **Yes (HIGH/CRIT)** |
| **Merge to main** | SCA | Trivy (container scan) | Prevent vulnerable images | **Yes (HIGH/CRIT)** |
| **QA Environment** | IAST | Contrast Security | Runtime vulnerability detection | No (informational) |
| **Pre-Release** | DAST | OWASP ZAP | External attack simulation | **Yes (HIGH/CRIT)** |
| **Production** | RASP | Contrast Protect | Real-time attack blocking | No (monitor/block) |

### IAST (Interactive Application Security Testing)

**What Is IAST?**
Gray-box testing: Instruments application runtime during functional testing to detect vulnerabilities in real execution paths.

**Benefits:**
- Lower false positives than SAST (sees actual runtime behavior)
- Faster than DAST (piggybacks on functional tests)
- Detects issues SAST misses (runtime state, complex data flows)

**Tools:**
- Contrast Security (Java, .NET, Node.js, Python)
- Synopsys Seeker

**When to Use:**
- During QA functional testing (free vulnerability detection)
- Integration tests (real database, message queues)
- Staging environment (pre-production validation)

---

## DAST (Dynamic Application Security Testing)

### OWASP ZAP (Industry Standard)

**What Is DAST?**
Black-box testing: Attacks running application from outside (like real attacker).

**What It Catches:**
- ✅ Authentication bypasses
- ✅ SQL injection (runtime exploitation)
- ✅ XSS (reflected, stored, DOM-based)
- ✅ Security misconfigurations (HTTPS issues, headers)
- ✅ SSRF (Server-Side Request Forgery)

**Setup:**

```python
# tests/security/test_dast.py
from zapv2 import ZAPv2
import pytest

@pytest.fixture(scope="session")
def zap():
    """Start OWASP ZAP proxy"""
    zap = ZAPv2(proxies={'http': 'http://localhost:8080', 'https': 'http://localhost:8080'})
    yield zap

def test_application_security(zap):
    """Run DAST scan against staging environment"""
    target_url = 'https://staging.example.com'

    # Spider (crawl application)
    zap.urlopen(target_url)
    scan_id = zap.spider.scan(target_url)

    # Wait for spider to finish
    while int(zap.spider.status(scan_id)) < 100:
        time.sleep(2)

    # Active scan (attack)
    scan_id = zap.ascan.scan(target_url)

    # Wait for scan to finish
    while int(zap.ascan.status(scan_id)) < 100:
        time.sleep(5)

    # Generate report
    alerts = zap.core.alerts(baseurl=target_url)

    # Fail if high-risk vulnerabilities found
    high_alerts = [a for a in alerts if a['risk'] == 'High']
    assert len(high_alerts) == 0, f"Found {len(high_alerts)} high-risk vulnerabilities:\n{format_alerts(high_alerts)}"

def format_alerts(alerts):
    output = []
    for alert in alerts:
        output.append(f"- {alert['alert']}: {alert['url']}")
    return '\n'.join(output)
```

**CI/CD Integration:**

```yaml
# .github/workflows/dast.yml
name: DAST Scan

on:
  schedule:
    - cron: '0 2 * * 1'  # Weekly Monday 2am

jobs:
  zap-scan:
    runs-on: ubuntu-latest
    steps:
      - name: Run OWASP ZAP scan
        uses: zaproxy/action-baseline@v0.7.0
        with:
          target: 'https://staging.example.com'
          rules_file_name: '.zap/rules.tsv'
          cmd_options: '-a'  # Include alpha rules
```

---

## OWASP Top 10 (2021) Test Coverage

| Vulnerability | Test Strategy | Tools |
|---------------|---------------|-------|
| **A01: Broken Access Control** | Authorization tests (unit + integration) | Custom tests, DAST (ZAP) |
| **A02: Cryptographic Failures** | TLS enforcement, encryption at rest tests | Semgrep, Trivy, ZAP |
| **A03: Injection** | SQL injection, XSS, command injection tests | CodeQL, Semgrep, ZAP |
| **A04: Insecure Design** | Threat modeling, security requirements | Manual review, design docs |
| **A05: Security Misconfiguration** | Default credentials, debug mode checks | Trivy (IaC), ZAP, custom tests |
| **A06: Vulnerable Components** | Dependency scanning | Trivy, Snyk, Dependabot |
| **A07: Authentication Failures** | Password strength, session management tests | Custom tests, ZAP |
| **A08: Software/Data Integrity** | CI/CD pipeline security, code signing | Cosign, GitHub Actions OIDC |
| **A09: Logging/Monitoring Failures** | Audit log tests, alerting validation | Custom tests, Sentry |
| **A10: SSRF** | Server-side request forgery prevention tests | CodeQL, ZAP |

**Reference:** https://owasp.org/Top10/

### Example: Testing for Broken Access Control

```python
# tests/security/test_authorization.py
import pytest
from app.models import User, Document

def test_user_cannot_access_other_users_documents(client, db_session):
    """Test horizontal privilege escalation (A01: Broken Access Control)"""
    # Create two users
    user1 = User(email='user1@example.com')
    user2 = User(email='user2@example.com')
    db_session.add_all([user1, user2])

    # User 1 creates document
    doc = Document(owner_id=user1.id, content='Secret data')
    db_session.add(doc)
    db_session.commit()

    # User 2 attempts to access User 1's document
    response = client.get(
        f'/api/documents/{doc.id}',
        headers={'Authorization': f'Bearer {user2.token}'}
    )

    # Should be forbidden (403)
    assert response.status_code == 403
    assert 'not authorized' in response.json()['error'].lower()
```

---

## Security Test Execution Schedule

| Test Type | Frequency | Duration | Blocking |
|-----------|-----------|----------|----------|
| **SAST (CodeQL/Semgrep)** | Every PR | 2-5 min | Yes (HIGH/CRIT) |
| **Container Scan (Trivy)** | Every PR + Registry | 10-30 sec | Yes (HIGH/CRIT) |
| **Dependency Scan** | Daily (Dependabot) | N/A | Yes (CRIT) |
| **DAST (OWASP ZAP)** | Weekly (staging) | 30-60 min | Yes (HIGH/CRIT) |
| **Manual Penetration Test** | Quarterly | 1-2 weeks | No (report findings) |

---

## Resources

**SAST:**
- CodeQL Documentation: https://codeql.github.com/docs/
- Semgrep Rules: https://semgrep.dev/r
- SonarQube: https://www.sonarqube.org/

**Container Security:**
- Trivy Documentation: https://aquasecurity.github.io/trivy/
- Sigstore/Cosign: https://www.sigstore.dev/

**DAST:**
- OWASP ZAP: https://www.zaproxy.org/
- Burp Suite: https://portswigger.net/burp

**Standards:**
- OWASP Top 10: https://owasp.org/Top10/
- OWASP ASVS: https://owasp.org/www-project-application-security-verification-standard/
- CWE Top 25: https://cwe.mitre.org/top25/

---

## Summary

| Aspect | Recommendation |
|--------|----------------|
| **SAST Tool** | CodeQL (GitHub users, 88% accuracy) or Semgrep (speed, custom rules) |
| **Container Scanning** | Trivy (industry standard, comprehensive coverage) |
| **DAST Tool** | OWASP ZAP (open-source, OWASP Top 10 coverage) |
| **CI/CD Strategy** | SAST + Container scan on every PR (blocking), DAST weekly (staging) |
| **Severity Blocking** | HIGH/CRITICAL block PR merge, MEDIUM warn, LOW informational |
| **OWASP Top 10** | 100% coverage via SAST + DAST + custom authorization tests |

**Key Takeaway:** Layered security testing (SAST → Container Scan → DAST) catches vulnerabilities at multiple stages. CodeQL/Semgrep for code, Trivy for containers, OWASP ZAP for runtime. Block PR merge on HIGH/CRITICAL findings.
