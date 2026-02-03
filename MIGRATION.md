# Stack-Driven Automation Update Migration Guide

**Target:** Projects that cloned Stack-Driven directly (not forked)
**Update:** Multi-round automation workflows with `/post-plan` and `/post-plan-and-implement`
**Version:** PR #78 (November 2024)

---

## What This Update Adds

1. **`/post-plan`** - Semi-automated workflow (plan → human review → implement)
2. **`/post-plan-and-implement`** - Fully-automated workflow (plan → implement → PR in 30-60 min)
3. **Multi-round code review** - Auto-fix cycles (up to 5 rounds) with severity-based issue categorization
4. **Enhanced documentation** - Complete workflow guide in HOWTO.md

---

## Pre-Migration Checklist

- [ ] Project is a clone of Stack-Driven (not a fork)
- [ ] All current work is committed (clean working directory)
- [ ] You have write access to the repository
- [ ] GitHub Actions are enabled
- [ ] `CLAUDE_CODE_OAUTH_TOKEN` secret is configured

---

## Migration Steps

### Step 1: Create Backup and Update Branch

```bash
# Create backup
git checkout -b backup-before-automation-update

# Return to main and create update branch
git checkout main
git pull origin main
git checkout -b update-automation-workflows
```

### Step 2: Download and Copy New Files

```bash
# Create temporary directory
mkdir -p /tmp/stack-driven-update
cd /tmp/stack-driven-update

# Download new slash commands
curl -o post-plan.md https://raw.githubusercontent.com/stack-driven/stack-driven/main/.claude/commands/post-plan.md
curl -o post-plan-and-implement.md https://raw.githubusercontent.com/stack-driven/stack-driven/main/.claude/commands/post-plan-and-implement.md

# Download new workflow
curl -o claude-fix-review.yml https://raw.githubusercontent.com/stack-driven/stack-driven/main/.github/workflows/claude-fix-review.yml

# Download updated workflow
curl -o claude-code-review.yml https://raw.githubusercontent.com/stack-driven/stack-driven/main/.github/workflows/claude-code-review.yml

# Download updated documentation section (for manual merge)
curl -o HOWTO-new-section.md https://raw.githubusercontent.com/stack-driven/stack-driven/main/HOWTO.md
```

### Step 3: Copy Files to Your Project

```bash
# Return to your project
cd YOUR_PROJECT_PATH

# Copy new slash commands
cp /tmp/stack-driven-update/post-plan.md .claude/commands/
cp /tmp/stack-driven-update/post-plan-and-implement.md .claude/commands/

# Copy new workflow
cp /tmp/stack-driven-update/claude-fix-review.yml .github/workflows/

# Copy updated workflow (ONLY if you haven't customized claude-code-review.yml)
# If customized, manually merge changes from /tmp/stack-driven-update/claude-code-review.yml
cp /tmp/stack-driven-update/claude-code-review.yml .github/workflows/
```

### Step 4: Update HOWTO.md

**IMPORTANT:** Do NOT overwrite HOWTO.md if you've customized it.

**Option A: You haven't customized HOWTO.md**
```bash
# Extract new section from downloaded file
# Lines 320-489 contain the new "Multi-Round Automation Workflows" section
# You'll need to manually insert this into your HOWTO.md

# Open both files and compare:
code /tmp/stack-driven-update/HOWTO-new-section.md HOWTO.md
# OR
vim -d /tmp/stack-driven-update/HOWTO-new-section.md HOWTO.md
```

**Option B: Manual merge (recommended)**

Add this section to your HOWTO.md after the "### Working with GitHub Issues" section and before "### Complete Automated Workflow":

```markdown
---

### Multi-Round Automation Workflows

Stack-Driven now supports **two levels of automation** for issue implementation:

**1. Semi-Automated (`/post-plan`):** Generate plan → Human reviews → Manual approval → Implement
**2. Fully-Automated (`/post-plan-and-implement`):** Generate plan → Auto-implement → Auto-review → Auto-fix (up to 5 rounds)

[See full section in /tmp/stack-driven-update/HOWTO-new-section.md lines 320-489]
```

Copy the complete section from the downloaded HOWTO.md and insert it into your file.

### Step 5: Review Changes

```bash
# Check what changed
git status
git diff .claude/commands/
git diff .github/workflows/
git diff HOWTO.md

# Verify workflow YAML syntax
gh workflow list
```

### Step 6: Commit Changes

```bash
git add .claude/commands/post-plan.md
git add .claude/commands/post-plan-and-implement.md
git add .github/workflows/claude-fix-review.yml
git add .github/workflows/claude-code-review.yml
git add HOWTO.md

git commit -m "chore: update Stack-Driven automation workflows

Add multi-round automation workflows:
- /post-plan (semi-automated)
- /post-plan-and-implement (fully-automated)
- Multi-round code review with auto-fix
- Enhanced documentation

Source: Stack-Driven PR #78"

git push origin update-automation-workflows
```

### Step 7: Create Pull Request (if using PR workflow)

```bash
gh pr create --title "chore: update Stack-Driven automation workflows" --body "Updates Stack-Driven framework to add multi-round automation features.

**Changes:**
- New slash commands: /post-plan and /post-plan-and-implement
- New workflow: claude-fix-review.yml
- Enhanced code review with iteration tracking
- Updated documentation in HOWTO.md

**Source:** Stack-Driven PR #78

**Testing needed:**
- Verify workflows appear in Actions tab
- Test /post-plan on a test issue
- Verify documentation renders correctly"
```

OR merge directly to main:

```bash
git checkout main
git merge update-automation-workflows
git push origin main
```

### Step 8: Cleanup

```bash
# Remove temporary files
rm -rf /tmp/stack-driven-update

# Delete backup branch (once verified update works)
git branch -D backup-before-automation-update
```

---

## Post-Migration Testing

### Test 1: Verify Workflows Loaded

```bash
gh workflow list
```

**Expected output should include:**
- Claude Code Review
- Claude Fix Review Findings (NEW)
- Claude Plan Issue
- Claude Implement Issue

### Test 2: Test Semi-Automated Workflow

```bash
# Create test issue
gh issue create --title "Test /post-plan workflow" --body "Testing new semi-automated workflow"

# Get issue number (e.g., #123)
ISSUE_NUM=123

# Comment with /post-plan
gh issue comment $ISSUE_NUM --body "/post-plan"

# Wait 1-2 minutes, then check for:
# - Implementation plan posted as comment
# - "plan-ready" label added
# - No automatic implementation (waits for approval)

gh issue view $ISSUE_NUM
```

### Test 3: Test Fully-Automated Workflow (Optional)

```bash
# Create test issue
gh issue create --title "Test /post-plan-and-implement workflow" --body "Testing new fully-automated workflow"

# Get issue number (e.g., #124)
ISSUE_NUM=124

# Comment with /post-plan-and-implement
gh issue comment $ISSUE_NUM --body "/post-plan-and-implement"

# Wait 30-60 minutes, then check for:
# - Implementation plan posted
# - "full-automation" label added
# - @claude-implement comment auto-posted
# - PR created automatically

gh issue view $ISSUE_NUM
gh pr list
```

### Test 4: Verify Documentation

```bash
# Check HOWTO.md renders correctly
gh repo view --web
# Navigate to HOWTO.md and verify new section appears
```

---

## Files Modified (Summary)

### New Files (3)
- `.claude/commands/post-plan.md` (329 lines)
- `.claude/commands/post-plan-and-implement.md` (333 lines)
- `.github/workflows/claude-fix-review.yml` (271 lines)

### Modified Files (2)
- `.github/workflows/claude-code-review.yml` (+97 lines)
- `HOWTO.md` (+168 lines)

### Never Touch (Project-Specific)
- `product-guidelines/` - Your product's cascade outputs
- `CLAUDE.md` - Your project's documentation
- `src/`, `apps/`, `services/` - Your actual code
- `.env*` - Your environment configs
- `README.md` - Likely customized

---

## Rollback Plan (If Something Breaks)

### Option 1: Revert Specific Files

```bash
git checkout HEAD~1 -- .claude/commands/post-plan.md
git checkout HEAD~1 -- .claude/commands/post-plan-and-implement.md
git checkout HEAD~1 -- .github/workflows/claude-fix-review.yml
git checkout HEAD~1 -- .github/workflows/claude-code-review.yml
git checkout HEAD~1 -- HOWTO.md

git commit -m "revert: rollback automation workflow update"
git push origin main
```

### Option 2: Revert Entire Update Commit

```bash
# Find the commit hash
git log --oneline -5

# Revert the update commit
git revert <commit-hash>
git push origin main
```

### Option 3: Reset to Backup Branch

```bash
git checkout main
git reset --hard backup-before-automation-update
git push origin main --force  # (Warning) Use with caution
```

---

## Troubleshooting

### Issue: Workflows don't appear in GitHub Actions

**Solution:**
```bash
# Verify workflow files exist
ls -la .github/workflows/

# Check YAML syntax
gh workflow list

# Push to trigger workflow detection
git commit --allow-empty -m "trigger: workflow detection"
git push origin main
```

### Issue: HOWTO.md merge conflict

**Solution:**
```bash
# Keep your version and manually add new section
git checkout --ours HOWTO.md

# Open file and manually insert new section from
# /tmp/stack-driven-update/HOWTO-new-section.md lines 320-489
```

### Issue: Customized claude-code-review.yml conflicts

**Solution:**
```bash
# Don't overwrite, manually merge changes
# Key additions needed:
# 1. "Get review iteration count" step (lines 52-62)
# 2. Updated prompt with severity levels (lines 70-206)
# 3. "Check if auto-fix should be triggered" step (lines 211-243)
# 4. "Trigger auto-fix if needed" step (lines 245-251)
# 5. "Add review-blocked label" step (lines 253-274)

# Compare files side-by-side
code .github/workflows/claude-code-review.yml /tmp/stack-driven-update/claude-code-review.yml
```

---

## Quick Reference Commands

```bash
# Download all files at once
curl -o /tmp/post-plan.md https://raw.githubusercontent.com/stack-driven/stack-driven/main/.claude/commands/post-plan.md && \
curl -o /tmp/post-plan-and-implement.md https://raw.githubusercontent.com/stack-driven/stack-driven/main/.claude/commands/post-plan-and-implement.md && \
curl -o /tmp/claude-fix-review.yml https://raw.githubusercontent.com/stack-driven/stack-driven/main/.github/workflows/claude-fix-review.yml && \
curl -o /tmp/claude-code-review.yml https://raw.githubusercontent.com/stack-driven/stack-driven/main/.github/workflows/claude-code-review.yml && \
echo "(✓) All files downloaded to /tmp/"

# Copy all files at once (from your project root)
cp /tmp/post-plan.md .claude/commands/ && \
cp /tmp/post-plan-and-implement.md .claude/commands/ && \
cp /tmp/claude-fix-review.yml .github/workflows/ && \
cp /tmp/claude-code-review.yml .github/workflows/ && \
echo "(✓) All files copied"

# Verify
git status && gh workflow list
```

---

## Support

**Questions or issues?**
- Check Stack-Driven repo: https://github.com/stack-driven/stack-driven
- Review PR #78: https://github.com/stack-driven/stack-driven/pull/78
- Consult HOWTO.md section "Multi-Round Automation Workflows"

---

**Migration complete!** Test the new workflows and enjoy automated issue implementation.
