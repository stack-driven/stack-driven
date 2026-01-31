# How to Use Stack-Driven for Your Product

This guide explains the **practical workflow** for using Stack-Driven to build your product. For understanding the framework itself, see [README.md](README.md).

---

## Quick Start: From Clone to Production

### Step 1: Set Up Your Repository

**Clone and create your product repo:**

```bash
# Option A: Fork Stack-Driven (keeps connection for updates)
# Fork https://github.com/bru-digital/stack-driven on GitHub
git clone https://github.com/YOUR-USERNAME/stack-driven.git my-product
cd my-product

# Option B: Clone directly (clean start)
git clone https://github.com/bru-digital/stack-driven.git my-product
cd my-product
rm -rf .git
git init
```

**Set up new remote:**

```bash
# Create new empty repo on GitHub (e.g., "acme-saas")
git remote add origin https://github.com/YOUR-USERNAME/acme-saas.git
git branch -M main
git add .
git commit -m "Initial commit: Stack-Driven framework"
git push -u origin main
```

**Configure GitHub CLI:**

```bash
# Install gh if needed
brew install gh  # macOS
# or sudo apt install gh  # Linux

# Authenticate
gh auth login

# Verify you're in the right repo
gh repo view
```

**You now have:**
- All 38 slash commands in `/.claude/commands/`
- All templates in `/templates/`
- Examples in `/examples/` (reference only)
- Clean `/product-guidelines/` directory (gitignored)

### Step 2: Configure GitHub Actions (Optional but Recommended)

**Set up Claude Code OAuth token:**

1. Go to https://claude.ai/settings/tokens
2. Generate a new token
3. Add as repository secret:
   ```bash
   gh secret set CLAUDE_CODE_OAUTH_TOKEN
   # Paste your token when prompted
   ```

**Enable workflows:**

The repository includes 4 powerful GitHub Actions:
- `claude-plan-issue.yml` - Auto-generates implementation plans for issues
- `claude-implement-issue.yml` - Auto-implements issues following approved plans
- `claude-code-review.yml` - Reviews PRs against product-guidelines
- `claude-update-claudemd.yml` - Keeps CLAUDE.md synchronized with codebase

These are automatically enabled once you push. They'll activate on issue creation, plan approval, PR creation, and merges to main.

### Step 3: Run the Cascade for YOUR Product

**Check your starting point:**

```bash
/cascade-status
```

You'll see all 14 sessions marked as incomplete.

**Start Session 1 (User Journey):**

```bash
/refine-journey
```

I'll ask 21 progressive questions (including Phase 1b: Behavioral Profile) to understand:
- Who your users are
- What problem they face
- Their current painful workflow
- Their desired outcome
- Their behavioral characteristics (tech proficiency, device preference, learning style, communication preferences, onboarding expectations)
- The value ratio (e.g., "4 hours → 60 seconds = 240x faster")

**Output:** `product-guidelines/00-user-journey.md`

**Continue the cascade:**

After each session, I'll tell you what to run next. The complete flow:

```bash
/refine-journey              # Session 1: User journey
/create-product-strategy     # Session 2: Market analysis
/choose-tech-stack           # Session 3: Tech recommendations
/generate-strategy           # Session 4: Mission, metrics, architecture
/create-brand-strategy       # Session 5: Brand positioning
/create-design               # Session 6: Design system
/design-database-schema      # Session 7: Database design
/generate-api-design         # Session 8: High-level API architecture
/generate-api-contracts      # Session 8b: OpenAPI specifications
/create-test-strategy        # Session 9: Testing approach
/generate-backlog            # Session 10: User stories (30-50)
/create-gh-issues            # Session 11: Push to GitHub
/scaffold-project            # Session 12: Generate code files
/plan-deployment             # Session 13: Deployment strategy
/design-observability        # Session 14: Monitoring setup
```

**Or use automation:**

```bash
/run-cascade
```

This executes sessions automatically, pausing at major milestones for your review.

**Time commitment:** 8-10 hours total for all 14 sessions.

### Step 4: Review Your Generated Strategy

After running the cascade, your `/product-guidelines/` directory contains:

```
product-guidelines/
├── 00-user-journey.md          # Your specific user journey
├── 01-product-strategy.md      # Market analysis, positioning
├── 02-tech-stack.md            # Recommended stack with reasoning
├── 03a-mission.md               # Your product mission
├── 03b-metrics.md               # Success metrics (North Star, etc.)
├── 03c-monetization.md          # Pricing strategy
├── 04-architecture.md          # System architecture
├── 05-brand-strategy.md        # Brand positioning
├── 06-design-system.md         # UI components, colors, typography
├── 07-database-schema.md       # Complete database design
├── 08-api-contracts.md         # OpenAPI specifications
├── 09-test-strategy.md         # Testing approach
├── 10-backlog/                 # 30-50 user stories
└── 12-project-scaffold/        # Actual code files
    ├── package.json
    ├── docker-compose.yml
    ├── .env.template
    └── README.md
```

**Quality check:**

```bash
/validate-outputs
```

This analyzes your cascade for:
- Journey alignment (decisions trace to user value)
- Specificity (concrete, not generic)
- Technical soundness (indexes, error handling, etc.)
- Completeness (all sections filled)

If issues are found, regenerate specific sessions.

### Step 5: Set Up Your Development Environment

**Copy scaffold files to your project root:**

```bash
# If using monorepo structure (recommended)
cp -r product-guidelines/12-project-scaffold/* .

# Or create separate src/ directory
mkdir src
cp -r product-guidelines/12-project-scaffold/* src/
```

**Install dependencies:**

```bash
# Node.js projects
npm install

# Python projects
pip install -r requirements.txt
# or
poetry install

# Docker-based projects
docker-compose up -d
```

**Configure environment:**

```bash
cp .env.template .env
# Edit .env with your actual values
```

**Verify setup:**

```bash
# Run tests
npm test  # or pytest, or whatever your test command is

# Start development server
npm run dev  # or make dev, or docker-compose up
```

---

## Day-to-Day Development Workflow

### Working with GitHub Issues

Your backlog is now in GitHub (from Session 11). Here's the workflow:

**1. Pick an issue from backlog:**

```bash
gh issue list --label "planned"
```

**2. Auto-generate implementation plan:**

The `claude-plan-issue.yml` workflow triggers automatically when:
- You add `needs-plan` label to an issue
- You comment `@claude-plan` on an issue
- You create an issue with `@claude-plan` in the description

**Or trigger manually:**

```bash
gh workflow run claude-plan-issue.yml -f issue_number=42
```

**What happens:**
- Claude reads the issue
- Loads relevant product-guidelines (tech-stack, design-system, etc.)
- Analyzes requirements
- Posts detailed implementation plan as comment
- Adds `planned` label to issue

**3. Review and approve the plan:**

Check the plan comment on the issue. If it looks good, you're ready to implement.

**4. Implement the issue:**

You have two options:

**Option A: Automated Implementation** (recommended for simpler issues)

The `claude-implement-issue.yml` workflow triggers automatically when:
- You comment `@claude-implement` on an issue with a plan
- You add `auto-implement` or `ready-to-implement` label
- Manual trigger: `gh workflow run claude-implement-issue.yml -f issue_number=42`

**What happens:**
- Verifies approved plan exists
- Creates branch: `42-issue-slug`
- Implements following plan exactly (no re-reading guidelines)
- Runs tests, linting, type checking
- Commits changes with conventional commit message
- Creates PR with "Closes #42"
- Adds `implemented` label to issue

**When to use:**
- Simple, well-defined issues
- Issues with clear, detailed plans
- Non-critical changes where you trust the plan
- Rapid iteration on features

**Option B: Manual Implementation** (recommended for complex issues)

```bash
/implement-issue 42
```

Run this in Claude Code for more control and visibility during implementation.

**When to use:**
- Complex issues requiring judgment calls
- Issues where you want to see the implementation process
- Critical changes requiring oversight
- Debugging or investigation needed

**5. Code review (automatic):**

When you create a PR, the `claude-code-review.yml` workflow:
- Analyzes code changes
- Checks against product-guidelines
- Verifies design system compliance
- Checks API contract alignment
- Posts review comment on PR

**6. Merge:**

After review and approval, merge the PR. The issue auto-closes.

**7. CLAUDE.md auto-update:**

After merge to main, the `claude-update-claudemd.yml` workflow:
- Detects structural changes
- Updates CLAUDE.md with new context
- Commits updates directly to main (no PR needed)

---

### Multi-Round Automation Workflows

Stack-Driven now supports **two levels of automation** for issue implementation:

**1. Semi-Automated (`/post-plan`):** Generate plan → Human reviews → Manual approval → Implement
**2. Fully-Automated (`/post-plan-and-implement`):** Generate plan → Auto-implement → Auto-review → Auto-fix (up to 5 rounds)

#### Semi-Automated Workflow: `/post-plan`

**Use this when:**
- Issue is well-defined but you want to review the plan first
- You want control before implementation starts
- The issue is moderately complex

**How it works:**

```bash
# Comment on any issue
/post-plan

# OR trigger via GitHub workflow
gh issue comment 42 --body "/post-plan"
```

**What happens:**
1. (✓) Implementation plan generated (1-2 minutes)
2. (✓) Plan posted as comment on issue
3. (✓) `plan-ready` label added
4. **Waits for human approval**
5. Human reviews plan, then comments `@claude-implement` to proceed
6. Implementation runs automatically
7. PR created with code review
8. Multi-round auto-fix runs (up to 5 rounds)

**Timeline:** Review plan (5 min) → Approve → PR ready (15-30 min)

#### Fully-Automated Workflow: `/post-plan-and-implement`

**Use this when:**
- Issue is simple and well-scoped
- Requirements are clear and unambiguous
- You trust the automated planning + implementation
- You want zero manual intervention until PR review

**How it works:**

```bash
# Comment on any issue
/post-plan-and-implement

# OR trigger via GitHub workflow
gh issue comment 42 --body "/post-plan-and-implement"
```

**What happens:**
1. (✓) Implementation plan generated (1-2 minutes)
2. (✓) Plan posted as comment on issue
3. (✓) `full-automation` label added
4. (✓) `@claude-implement` comment posted automatically (triggers implementation)
5. (✓) Implementation runs (10-20 minutes)
6. (✓) PR created automatically
7. (✓) Code review runs automatically
8. (✓) Multi-round auto-fix cycles (up to 5 rounds)
9. 👀 **You review final PR and merge**

**Timeline:** Issue → PR ready in 30-60 minutes (zero manual intervention)

#### Multi-Round Code Review & Auto-Fix

Both workflows include **automatic review/fix cycles** to improve code quality:

**How it works:**

1. **PR created** → Code review runs automatically
2. **Review categorizes issues by severity:**
   - 🔴 **High Priority (blocking):** Security vulnerabilities, critical bugs, data corruption
   - 🟡 **Medium Priority (should fix):** Code quality, missing tests, guideline violations
   - 🟢 **Low Priority (optional):** Style improvements, refactoring suggestions

3. **Auto-fix triggered if:**
   - High or medium priority issues found
   - Review round < 5

4. **Auto-fix process:**
   - Parses review findings
   - Implements fixes for 🔴 high + 🟡 medium issues only
   - Runs tests to verify fixes
   - Commits to PR branch
   - Triggers new review round

5. **Loop continues until:**
   - No high/medium issues remain ((✓) PR approved)
   - OR 5 rounds reached (⛔ adds `review-blocked` label, requires manual intervention)

**Example flow:**

```
PR created → Review Round 1: 10 issues found
  ↓
Auto-fix commits fixes → Review Round 2: 3 issues found
  ↓
Auto-fix commits fixes → Review Round 3: 1 issue found
  ↓
Auto-fix commits fixes → Review Round 4: 0 issues found
  ↓
(✓) PR approved (stopped before round 5)
```

**If max rounds (5) reached:**

```
Review Round 5: 2 issues remain
  ↓
⛔ `review-blocked` label added
  ↓
Human reviews remaining issues
  ↓
Manual fixes applied
  ↓
Remove `review-blocked` label to re-enable automation
```

#### Choosing the Right Workflow

| Workflow | Best For | Time to PR | Human Oversight |
|----------|----------|------------|-----------------|
| **Manual (`/implement-issue`)** | Complex issues, critical changes | Immediate | Full control during implementation |
| **Semi-Auto (`/post-plan`)** | Moderate complexity, want plan review | 15-30 min | Review plan before implementation |
| **Full-Auto (`/post-plan-and-implement`)** | Simple issues, clear requirements | 30-60 min | Review only at PR stage |

**Recommendations:**
- **Simple bug fixes, small features:** Use `/post-plan-and-implement`
- **Moderate features, refactors:** Use `/post-plan`
- **Complex features, breaking changes:** Use manual `/implement-issue`
- **Critical security/infrastructure:** Always use manual `/implement-issue`

#### Troubleshooting Multi-Round Automation

**Issue: "Review blocked after 5 rounds"**

This means automated fixes couldn't resolve all issues after 5 attempts.

**Solution:**
1. Review latest code review comment
2. Manually fix remaining 🔴 high and 🟡 medium issues
3. Push changes to PR branch
4. Remove `review-blocked` label: `gh pr edit <number> --remove-label "review-blocked"`
5. Automation will resume on next push

**Issue: "Auto-fix made no changes"**

This means the auto-fix process ran but couldn't apply fixes.

**Solution:**
1. Review findings may be unclear or already fixed
2. Manually review code review comment
3. Apply fixes manually if needed
4. Or close review findings as not applicable

**Issue: "Auto-fix broke tests"**

Auto-fix commits are rejected if tests fail.

**Solution:**
1. Check workflow logs for test failure details
2. Fix tests or code manually
3. Push to PR branch
4. Auto-fix will retry on next review round

---

### Complete Automated Workflow

For fully hands-off development (great for simple issues):

```bash
# 1. Create issue or pick from backlog
gh issue create --title "Add feature X" --body "Description..."

# 2. Trigger automatic planning
gh issue edit 42 --add-label "needs-plan"
# OR comment: @claude-plan

# 3. Wait for plan (1-2 minutes)
# Review plan comment on issue

# 4. Trigger automatic implementation
gh issue comment 42 --body "@claude-implement"
# OR: gh issue edit 42 --add-label "auto-implement"

# 5. Wait for PR creation (5-15 minutes depending on complexity)
# Automatic code review runs

# 6. Review PR and merge
gh pr view 123
gh pr merge 123

# 7. CLAUDE.md auto-updates on merge
# Done!
```

**Timeline:** Issue → Production in 20-30 minutes with minimal human intervention.

### Manual Implementation Workflow

If you prefer to implement manually:

**1. Create branch:**

```bash
git checkout -b 42-feature-name
```

**2. Load guidelines:**

Before coding, review relevant product-guidelines:
- **Always**: `02-tech-stack.md`
- **UI work**: `06-design-system.md`
- **API work**: `08-api-contracts.md`
- **Database work**: `07-database-schema.md`

**3. Implement:**

Follow the guidelines as guardrails. Every decision should trace back to the cascade.

**4. Test:**

```bash
npm test  # or your test command
npm run lint
npm run type-check
```

**5. Commit and push:**

```bash
git add .
git commit -m "feat: add feature X (closes #42)"
git push -u origin 42-feature-name
```

**6. Create PR:**

```bash
gh pr create --fill --title "feat: add feature X (closes #42)"
```

Make sure PR body contains "Closes #42" for auto-linking.

---

## Advanced Workflows

### Updating Product Strategy

**When requirements change:**

Let's say your user journey evolves. You can regenerate specific sessions:

```bash
# Update journey
/refine-journey

# Cascade the change through dependent sessions
/create-product-strategy  # Reads updated journey
/choose-tech-stack        # Reads updated strategy
# etc.
```

**Validate after changes:**

```bash
/validate-outputs
```

### Adding Post-Cascade Extensions

After completing core cascade (Sessions 1-14), you can run optional deep-dives:

```bash
/design-user-experience     # Detailed UX research, wireframes
/discover-naming            # Brand name generation
/design-growth-strategy     # Acquisition channels, growth loops
/define-messaging           # Brand messaging framework
/create-content-guidelines  # Content style guide
/design-brand-identity      # Logo, visual identity
/setup-analytics            # Analytics implementation plan
/create-financial-model     # Unit economics, projections
```

These read from core cascade outputs but can run in any order.

### Working Across Team Members

**Scenario:** Multiple developers using the same product-guidelines.

**Setup:**

1. One person runs the cascade
2. Commit `product-guidelines/` to version control (remove from .gitignore)
3. Team members pull latest
4. Everyone has same context

**Modify .gitignore:**

```bash
# Remove this line from .gitignore:
product-guidelines/

# Commit the change
git add .gitignore product-guidelines/
git commit -m "docs: add product-guidelines to version control"
git push
```

Now product-guidelines are shared source of truth.

### Maintaining Multiple Products

**Scenario:** You want to use Stack-Driven for multiple products.

**Approach 1: Separate repos (recommended)**

```bash
# Product 1
git clone stack-driven acme-saas
cd acme-saas
# Run cascade...

# Product 2
git clone stack-driven acme-mobile
cd acme-mobile
# Run cascade...
```

Each product has its own cascade outputs.

**Approach 2: Monorepo with subdirectories**

```bash
mkdir products
cd products

# Product 1
mkdir acme-saas
cd acme-saas
# Copy .claude/commands/, run cascade, outputs in product-guidelines/

# Product 2
mkdir acme-mobile
cd acme-mobile
# Copy .claude/commands/, run cascade, outputs in product-guidelines/
```

---

## Troubleshooting

### "Session X failed, what do I do?"

**Check dependencies:**

Each session reads previous outputs. If Session 8 fails, check that Sessions 1-7 completed successfully.

```bash
/cascade-status
```

**Regenerate specific session:**

```bash
/generate-api-contracts  # Re-run Session 8
```

### "My tech stack changed, how do I update?"

**Regenerate Session 3:**

```bash
/choose-tech-stack
```

Specify new constraints (e.g., "must use Go instead of Python").

**Cascade updates:**

Sessions that depend on tech-stack (7, 8, 9, 12) should be regenerated:

```bash
/design-database-schema
/generate-api-contracts
/create-test-strategy
/scaffold-project
```

### "Implementation plan doesn't match my needs"

**Edit the plan comment on GitHub:**

1. Go to issue
2. Find plan comment
3. Click "..." → Edit
4. Modify plan
5. Run `/implement-issue X` (reads edited plan)

**Or regenerate plan:**

Comment `@claude-plan` again on the issue.

### "GitHub workflows not triggering"

**Check token:**

```bash
gh secret list
```

Should show `CLAUDE_CODE_OAUTH_TOKEN`.

**Check workflow files:**

```bash
ls .github/workflows/
```

Should show:
- `claude-plan-issue.yml`
- `claude-implement-issue.yml`
- `claude-code-review.yml`
- `claude-update-claudemd.yml`

**Check workflow runs:**

```bash
gh run list
```

**Enable workflows manually:**

Go to GitHub → Actions tab → Enable workflows

### "Automated implementation failed"

**Check workflow logs:**

```bash
gh run list --workflow=claude-implement-issue.yml
gh run view <run-id> --log
```

**Common failures:**
- **No plan found**: Add `needs-plan` label first to generate plan
- **Tests failing**: Plan may need adjustment, or codebase has issues
- **Linting errors**: Plan may not follow code style
- **Timeout**: Issue too complex, use manual `/implement-issue` instead

**Retry after fixing:**

```bash
# Edit plan comment if needed, then:
gh issue comment 42 --body "@claude-implement"
```

### "Automated implementation creating low-quality PRs"

**Solutions:**

1. **Improve plan quality**: More detailed plans → better implementations
2. **Use manual for complex issues**: Run `/implement-issue` locally for oversight
3. **Adjust trigger strategy**: Only use `auto-implement` label for simple issues
4. **Review and iterate**: Edit plan based on PR quality, regenerate

---

## Best Practices

### Do's

**✓ Run cascade in order** - Don't skip sessions
**✓ Validate outputs** - Use `/validate-outputs` regularly
**✓ Trace decisions to journey** - Every choice should reference user value
**✓ Use product-guidelines as guardrails** - Reference them during implementation
**✓ Keep CLAUDE.md updated** - Helps future Claude sessions understand your codebase
**✓ Review auto-generated plans** - Don't blindly implement, verify plan makes sense
**✓ Commit cascade outputs** - If working in a team, version control product-guidelines
**✓ Use automated workflows for simple issues** - Saves time on straightforward implementations
**✓ Use manual `/implement-issue` for complex work** - Maintain oversight on critical changes

### Don'ts

**✗ Copy examples** - They're reference implementations, not templates
**✗ Skip validation** - Generic outputs violate framework philosophy
**✗ Add features not in journey** - Scope creep kills products
**✗ Ignore breaking changes** - Follow migration paths in implementation plans
**✗ Bypass product-guidelines** - They're the source of truth
**✗ Auto-implement without reviewing plan** - Always review plan quality first
**✗ Use automated workflow for critical/complex changes** - Manual oversight is safer

---

## Workflow Summary

### Initial Setup (One-time)

1. Clone Stack-Driven → Create new repo
2. Configure GitHub CLI
3. Add CLAUDE_CODE_OAUTH_TOKEN secret
4. Run `/cascade-status`

### Generate Strategy (8-10 hours)

1. Run `/refine-journey` (or `/run-cascade` for automation)
2. Progress through 14 sessions
3. Run `/validate-outputs`
4. Copy scaffold files to project root

### Development (Daily)

**Automated workflow:**
1. Pick issue from GitHub backlog
2. Add `needs-plan` label → plan auto-generated
3. Review plan → comment `@claude-implement` → PR auto-created
4. Code review runs automatically
5. Merge → CLAUDE.md auto-updates

**Manual workflow:**
1. Pick issue from GitHub backlog
2. Run `/plan-issue X` to generate plan
3. Review plan → run `/implement-issue X` locally
4. PR created, code review runs automatically
5. Merge → CLAUDE.md auto-updates

### Iteration (As needed)

1. Update journey if requirements change
2. Regenerate affected sessions
3. Validate with `/validate-outputs`
4. Update GitHub issues

---

## Next Steps

**Just starting?**

```bash
/cascade-status
/refine-journey
```

**Already have cascade?**

```bash
/validate-outputs
/create-gh-issues
/scaffold-project
```

**Ready to build?**

Pick an issue and either:
- Automated: Add `needs-plan` label → review → comment `@claude-implement`
- Manual: Run `/plan-issue X` → review → run `/implement-issue X`

---

**Questions?** Check [README.md](README.md) for framework details or [CLAUDE.md](CLAUDE.md) for technical documentation.

**Ready to build your product?** → `/cascade-status`
