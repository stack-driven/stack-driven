# Deployment Strategy Prompt

You are a DevOps engineer designing a deployment strategy for [APPLICATION/SERVICE].

**Your first task**: Prompt the user for their application type, infrastructure setup, and deployment requirements.

## DEPLOYMENT STRATEGY DESIGN

### 1. Deployment Requirements

**Application Context**:
- Type of application (web, API, mobile backend, etc.)
- Technology stack
- Current deployment state (new vs existing)
- Team size and skills

**Business Requirements**:
- Acceptable downtime (zero-downtime required?)
- Deployment frequency (daily, weekly, on-demand)
- Rollback requirements
- Compliance/audit requirements

**Technical Requirements**:
- Infrastructure (cloud provider, on-premise, hybrid)
- Traffic volume
- Geographic distribution
- Data sensitivity

### 2. Deployment Pattern Selection

Choose the appropriate deployment pattern:

**Blue-Green Deployment**:
- Two identical environments (blue = current, green = new)
- Traffic switches from blue to green after validation
- Easy rollback (switch back to blue)
- Best for: Zero-downtime requirement, easy rollback

**Canary Deployment**:
- New version deployed to small subset of users first
- Gradually increase traffic to new version
- Monitor metrics before full rollout
- Best for: Risk mitigation, gradual rollout

**Rolling Deployment**:
- Gradually replace instances with new version
- Maintain minimum capacity during deployment
- Best for: Resource-constrained environments

**Recreate Deployment**:
- Stop old version, deploy new version
- Involves downtime
- Best for: Development/staging, non-critical applications

**A/B Testing**:
- Run multiple versions simultaneously
- Route users based on criteria
- Best for: Feature testing, experimentation

### 3. Deployment Pipeline

**Pipeline Stages**:

```
1. Code Commit
   ↓
2. Build
   - Compile code
   - Run static analysis
   - Security scanning
   ↓
3. Test
   - Unit tests
   - Integration tests
   - Contract tests
   ↓
4. Package
   - Create Docker image
   - Tag with version
   - Push to registry
   ↓
5. Deploy to Staging
   - Deploy to staging environment
   - Run smoke tests
   ↓
6. Integration Tests
   - E2E tests
   - Performance tests
   - Security tests
   ↓
7. Manual Approval (optional)
   - Product owner review
   - Stakeholder approval
   ↓
8. Deploy to Production
   - Execute deployment strategy
   - Health checks
   ↓
9. Post-Deployment
   - Smoke tests in production
   - Monitor metrics
   - Automated rollback if needed
```

### 4. Environment Strategy

**Environments**:

**Development**:
- Purpose: Active development
- Deploy trigger: On commit to develop branch
- Data: Synthetic/anonymized
- Uptime: Not critical

**Staging**:
- Purpose: Pre-production testing
- Deploy trigger: On commit to main/release branch
- Data: Production-like (anonymized)
- Uptime: High availability during business hours
- Config: Mirrors production

**Production**:
- Purpose: Live user traffic
- Deploy trigger: Manual approval or automated after staging validation
- Data: Real production data
- Uptime: Maximum (99.9%+)
- Config: Production settings

**Preview/Feature Environments** (optional):
- Purpose: Test specific features in isolation
- Deploy trigger: On PR creation
- Lifecycle: Temporary (destroyed after PR merge)

### 5. Deployment Checklist

**Pre-Deployment**:
- [ ] All tests passing
- [ ] Code reviewed and approved
- [ ] Database migrations tested
- [ ] Configuration changes reviewed
- [ ] Dependencies updated and verified
- [ ] Deployment plan documented
- [ ] Rollback plan prepared
- [ ] Stakeholders notified
- [ ] Maintenance window scheduled (if needed)

**During Deployment**:
- [ ] Backup current state
- [ ] Execute database migrations
- [ ] Deploy application
- [ ] Verify health checks pass
- [ ] Smoke test critical paths
- [ ] Monitor error rates
- [ ] Monitor performance metrics
- [ ] Check logs for errors

**Post-Deployment**:
- [ ] Verify all services healthy
- [ ] Test critical user flows
- [ ] Monitor for increased errors
- [ ] Monitor for performance degradation
- [ ] Verify monitoring and alerting
- [ ] Update documentation
- [ ] Communicate success to stakeholders
- [ ] Document any issues encountered

### 6. Rollback Strategy

**Automatic Rollback Triggers**:
- Error rate exceeds threshold (e.g., >1%)
- Response time degradation (e.g., >2x baseline)
- Health check failures
- Critical service unavailable

**Manual Rollback Process**:
1. Identify the issue
2. Make decision to rollback
3. Execute rollback procedure:
   - Revert to previous application version
   - Rollback database migrations (if safe)
   - Restore configuration
4. Verify rollback successful
5. Post-mortem to prevent recurrence

**Rollback Testing**:
- Test rollback procedures regularly
- Document time to rollback
- Ensure database migration rollbacks are safe

### 7. Database Migration Strategy

**Migration Best Practices**:
- Make migrations backward-compatible when possible
- Separate schema changes from data changes
- Test migrations on production-size dataset
- Have rollback scripts ready
- Run migrations before application deployment

**Multi-Phase Migrations** (for breaking changes):
1. Add new column/table (compatible with old and new code)
2. Deploy application that writes to both old and new
3. Backfill data
4. Deploy application that only uses new schema
5. Remove old column/table

### 8. Configuration Management

**Configuration Strategy**:
- Use environment variables for environment-specific config
- Store secrets in secure vault (AWS Secrets Manager, HashiCorp Vault)
- Version control non-secret configuration
- Separate config from code
- Validate configuration before deployment

**Feature Flags**:
- Enable gradual rollout of features
- Quick feature disabling without deployment
- A/B testing capabilities
- Dark launches (deploy inactive features)

### 9. Monitoring & Alerts

**Deployment Monitoring**:
- Deployment success/failure rate
- Deployment duration
- Time to rollback
- Deployment frequency

**Application Monitoring**:
- Error rates (compare pre and post deployment)
- Response times (p50, p95, p99)
- Request rates
- Resource utilization (CPU, memory, disk)

**Alerts**:
- Critical: Immediate action required
  - Service down
  - Error rate spike
  - Data loss risk
- Warning: Investigate soon
  - Performance degradation
  - Increased error rate
  - Resource constraints

### 10. Documentation

**Deployment Runbook**:
- Step-by-step deployment instructions
- Required permissions and access
- Configuration requirements
- Database migration steps
- Health check procedures
- Rollback procedures
- Troubleshooting guide
- Contact information for escalation

**Change Log**:
- Version number
- Deployment date
- Changes included
- Database changes
- Configuration changes
- Known issues

## DELIVERABLE

Provide a comprehensive deployment plan including:
- Recommended deployment pattern and rationale
- Complete deployment pipeline specification
- Environment strategy
- Pre-deployment checklist
- Deployment steps
- Rollback procedures
- Monitoring and alerting strategy
- Database migration approach
- Deployment runbook template
- Post-deployment verification steps

This should enable safe, reliable, and repeatable deployments.
