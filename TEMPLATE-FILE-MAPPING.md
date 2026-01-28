# Complete Template File Mapping

## All Template Files in Repository

```
CORE CASCADE TEMPLATES (Sessions 1-14)

Session 1 (Journey):
  ✅ templates/00-user-journey-template.md
  ✅ templates/00-user-journey-interview-template.md

Session 2 (Product Strategy):
  ✅ templates/01-product-strategy-template.md
  ✅ templates/01-product-strategy-essentials-template.md

Session 2a (Constraints - Optional):
  ✅ templates/02a-constraints-template.md
  ✅ templates/02a-constraints-essentials-template.md

Session 3 (Tech Stack):
  ✅ templates/02-tech-stack-template.md

Session 3b (Coding Standards):
  ✅ templates/02b-coding-standards-template.md
  ✅ templates/02b-coding-standards-essentials-template.md

Session 3c (AI Integration - Optional):
  ✅ templates/02c-ai-integration-strategy-template.md
  ✅ templates/02c-ai-integration-strategy-essentials-template.md

Session 4 (Strategy - Mission, Metrics, Monetization, Architecture):
  ✅ templates/03-mission-template.md
  ✅ templates/04-metrics-template.md
  ❌ templates/04-monetization-template.md (WRONG! Should be 05-)
  ❌ templates/04-architecture-template.md (WRONG! Should be 06-)

Session 5 (Brand Strategy):
  ✅ templates/05-brand-strategy-template.md

Session 6 (Design System):
  ✅ templates/06-design-system-template.md

Session 7 (Database Schema):
  ✅ templates/07-database-schema-template.md
  ✅ templates/07-database-schema-essentials-template.md

Session 8 (API Design):
  ✅ templates/08-api-design-template.md
  ✅ templates/08-api-design-essentials-template.md

Session 8b (API Contracts):
  ✅ templates/08b-api-contracts-template.md
  ✅ templates/08b-api-contracts-essentials-template.md

Session 9 (Test Strategy):
  ✅ templates/09-test-strategy-template.md
  ✅ templates/09-test-strategy-essentials-template.md

Session 9b (Application Architecture):
  ✅ templates/09b-application-architecture-template.md
  ✅ templates/09b-application-architecture-essentials-template.md

Session 10 (Backlog Generation):
  ❌ NO TEMPLATE (generates dynamically from decisions)

Session 11 (GitHub Issues):
  ❌ NO TEMPLATE (pushes to GitHub, no local output)

Session 12 (Project Scaffold):
  ❌ NO TEMPLATE (generates code, not template-based)

Session 13 (Deployment):
  ✅ templates/13-deployment-plan-template.md

Session 14 (Observability):
  ✅ templates/14-observability-strategy-template.md


POST-CASCADE EXTENSIONS (Sessions 15-22) - OPTIONAL DEEP-DIVES

Session 15 (Brand Naming):
  ✅ templates/15-brand-naming-template.md
  ❌ References 08-brand-strategy.md (WRONG! Should be 05-)

Session 16 (Brand Messaging):
  ✅ templates/16-brand-messaging-template.md
  ❌ References 08-brand-strategy.md (WRONG! Should be 05-)

Session 17 (Brand Identity):
  ✅ templates/17-brand-identity-template.md

Session 18 (Content Guidelines):
  ✅ templates/18-content-guidelines-template.md

Session 19 (User Experience):
  ✅ templates/19-user-experience-template.md

Session 20 (Analytics):
  ✅ templates/20-analytics-plan-template.md

Session 21 (Growth Strategy):
  ✅ templates/21-growth-strategy-template.md

Session 22 (Financial Model):
  ✅ templates/22-financial-model-template.md


OTHER:
  ✅ templates/issue-template.md (for GitHub issues)
  ✅ templates/README.md
```

---

## Files With Issues

### CRITICAL: Wrong File References

**15-brand-naming-template.md (line 21)**
```
CURRENT: **Brand personality** (from `product-guidelines/08-brand-strategy.md`):
SHOULD BE: **Brand personality** (from `product-guidelines/05-brand-strategy.md`):
```

**16-brand-messaging-template.md (line 28)**
```
CURRENT: **Brand voice** (from `product-guidelines/08-brand-strategy.md`):
SHOULD BE: **Brand voice** (from `product-guidelines/05-brand-strategy.md`):
```

### HIGH: Incorrect Filenames

**04-monetization-template.md**
```
CURRENT FILENAME: 04-monetization-template.md
SHOULD BE: 05-monetization-template.md
REASON: Sequential numbering - outputs should be 03, 04, 05, 06
```

**04-architecture-template.md**
```
CURRENT FILENAME: 04-architecture-template.md
SHOULD BE: 06-architecture-template.md
REASON: Sequential numbering - outputs should be 03, 04, 05, 06
```

### MEDIUM: Missing Documentation

**No template for Session 10** (/generate-backlog)
- Status: Intentional (dynamic generation)
- Risk: Users might think it's broken
- Fix: Document in CLAUDE.md

**No template for Session 11** (/create-gh-issues)
- Status: Intentional (GitHub API output)
- Risk: Users might think it's broken
- Fix: Document in CLAUDE.md

**No template for Session 12** (/scaffold-project)
- Status: Intentional (code generation)
- Risk: Users might think it's broken
- Fix: Document in CLAUDE.md

### LOW: Unclear Naming Convention

Post-cascade extensions (15-22) numbering not explained in CLAUDE.md
- Status: Minor clarity issue
- Fix: Document that 15-22 are optional extensions

---

## Cascade Effects of Fixing

If we rename files 04-06 to fix the numbering, all subsequent files cascade:

**Cascading Renames Needed**:
```
Current → After Fix
────────────────────
04-monetization-template.md → 05-monetization-template.md
04-architecture-template.md → 06-architecture-template.md
05-brand-strategy-template.md → 07-brand-strategy-template.md
06-design-system-template.md → 08-design-system-template.md
07-database-schema-template.md → 09-database-schema-template.md
07-database-schema-essentials-template.md → 09-database-schema-essentials-template.md
08-api-design-template.md → 10-api-design-template.md
08-api-design-essentials-template.md → 10-api-design-essentials-template.md
08b-api-contracts-template.md → 10b-api-contracts-template.md
08b-api-contracts-essentials-template.md → 10b-api-contracts-essentials-template.md
09-test-strategy-template.md → 11-test-strategy-template.md
09-test-strategy-essentials-template.md → 11-test-strategy-essentials-template.md
09b-application-architecture-template.md → 11b-application-architecture-template.md
09b-application-architecture-essentials-template.md → 11b-application-architecture-essentials-template.md
13-deployment-plan-template.md → 15-deployment-plan-template.md
14-observability-strategy-template.md → 16-observability-strategy-template.md
15-brand-naming-template.md → 17-brand-naming-template.md
16-brand-messaging-template.md → 18-brand-messaging-template.md
17-brand-identity-template.md → 19-brand-identity-template.md
18-content-guidelines-template.md → 20-content-guidelines-template.md
19-user-experience-template.md → 21-user-experience-template.md
20-analytics-plan-template.md → 22-analytics-plan-template.md
21-growth-strategy-template.md → 23-growth-strategy-template.md
22-financial-model-template.md → 24-financial-model-template.md
```

**Total files to rename**: 25 template files

**Total commands to update**: 14+ cascade commands would need file reference updates

**Total users affected**: All existing cascades using old file names (breaking change)

---

## Recommended Action Plan

### Phase 1: Quick Wins (Low Risk)
- Fix broken file references in templates 15 and 16 (08 → 05)
- Add documentation to CLAUDE.md about sessions 10-12 and 15-22

### Phase 2: Major Refactor (Medium Risk)
- Rename files 04-06 to 05-07 (and cascade the rest)
- Update all commands that reference these files
- Test thoroughly before merge
- Document breaking change for existing users

### Phase 3: User Communication
- If Phase 2 happens, provide migration guide for existing cascades
- Document the naming convention clearly in CLAUDE.md

