---
description: Session 11 - Push backlog issues to GitHub
---

# Session 11: Create GitHub Issues

This is **Session 11** of the cascade. You'll push the generated backlog to GitHub for execution.

## Your Role

You're pushing issues from `product-guidelines/10-backlog/issues/*.md` to GitHub using the `gh` CLI.

## Process

### Step 1: Read Backlog Files

```
Read: product-guidelines/10-backlog/BACKLOG.md (summary)
Read: product-guidelines/10-backlog/issues/*.md (all issue files)
```

### Step 2: Dry Run (Show What Will Be Created)

**Before creating anything**, show the user:
```
Ready to create GitHub issues

I found [X] issues in product-guidelines/10-backlog/issues/:

Epics:
- EPIC-01: Onboarding
- EPIC-02: Core Value Delivery
- EPIC-03: Results & Actions
... (list all)

Stories (showing first 10):
- STORY-001: OAuth-based signup (P0, Epic-01)
- STORY-002: Document upload to S3 (P0, Epic-01)
- STORY-003: Framework selection UI (P0, Epic-02)
... (continue)

Total: [X] epics, [Y] stories

This will create [Z] total GitHub issues.

Proceed? (I'll wait for your confirmation before creating anything)
```

### Step 3: Await User Confirmation

**CRITICAL**: Do NOT create issues without explicit user confirmation.

Wait for user to say "yes", "go ahead", "proceed", etc.

### Step 3.5: Sync Labels to GitHub

**Before creating issues**, ensure all labels from `.github/labels.yml` exist in the repository:

```bash
# Parse labels.yml and create/update labels
echo "Syncing labels to GitHub..."

while IFS= read -r line; do
  if [[ $line =~ ^-\ name:\ \"(.+)\"$ ]]; then
    name="${BASH_REMATCH[1]}"
  elif [[ $line =~ ^\ \ description:\ \"(.+)\"$ ]]; then
    description="${BASH_REMATCH[1]}"
  elif [[ $line =~ ^\ \ color:\ \"(.+)\"$ ]]; then
    color="${BASH_REMATCH[1]}"
    # Create or update label (--force creates if missing, updates if exists)
    gh label create "$name" --description "$description" --color "$color" --force 2>/dev/null || \
    gh label edit "$name" --description "$description" --color "$color" 2>/dev/null
  fi
done < .github/labels.yml

echo "✓ Labels synced successfully!"
```

**Why this step:**
- Ensures all scoped labels (type::, domain::, priority::) exist before applying them to issues
- Safe to run multiple times (idempotent - updates existing labels to match labels.yml)
- Prevents "label not found" errors during issue creation

**If .github/labels.yml doesn't exist:**
- Skip this step
- Warn user: "No .github/labels.yml found. Issues will be created without scoped labels."

### Step 4: Create Issues (After Label Sync)

Use `gh issue create` for each issue with **scoped labels** (see `.github/labels.yml` for complete schema).

**Label Detection Logic:**

For EACH issue file, parse the markdown to extract:
1. **Type** (from first line or "Type:" field): `type::epic`, `type::story`, `type::task`, `type::bug`, `type::legal`, etc.
2. **Priority** (from "Priority:" field): `priority::p0`, `priority::p1`, `priority::p2`
3. **Domains** (detect from content):
   - If mentions "frontend", "UI", "component": add `domain::frontend`
   - If mentions "backend", "API endpoint", "server": add `domain::backend`
   - If mentions "database", "schema", "migration": add `domain::database`
   - If mentions "API contract", "endpoint": add `domain::api`
   - If mentions "test", "testing": add `domain::testing`
   - If mentions "infrastructure", "deployment", "CI/CD": add `domain::infrastructure`
   - If mentions "third-party", "integration", "webhook": add `domain::integration`
   - If mentions "AI", "prompt", "RAG", "LLM": add `domain::ai`
   - If mentions "i18n", "translation", "locale": add `domain::i18n`
   - If mentions "analytics", "metrics", "tracking": add `domain::analytics`
   - If mentions "design system", "component library": add `domain::design-system`
   - If mentions "legal", "compliance", "Terms of Service", "Privacy Policy": add `domain::legal`
   - If mentions "accessibility", "a11y", "WCAG": add `domain::accessibility`
   - If mentions "documentation", "README", "guide": add `domain::documentation`

**Example: Epic**
```bash
gh issue create \
  --title "[EPIC-01] Onboarding" \
  --body "$(cat product-guidelines/10-backlog/issues/epic-01-onboarding.md)" \
  --label "type::epic"
```

**Example: Story with Multiple Domains**
```bash
gh issue create \
  --title "[STORY-001] OAuth-based signup" \
  --body "$(cat product-guidelines/10-backlog/issues/story-001-oauth-signup.md)" \
  --label "type::story,priority::p0,domain::frontend,domain::backend,domain::database"
```

**Example: Legal Document**
```bash
gh issue create \
  --title "[STORY-042] Privacy Policy" \
  --body "$(cat product-guidelines/10-backlog/issues/story-042-privacy-policy.md)" \
  --label "type::legal,priority::p0,domain::legal"
```

**Label Schema Reference:**
- **Type** (exactly 1): `type::epic`, `type::story`, `type::task`, `type::bug`, `type::spike`, `type::legal`, `type::migration`
- **Priority** (exactly 1): `priority::p0` (dark red), `priority::p1` (red-orange), `priority::p2` (orange/yellow)
- **Domain** (0 to many): `domain::frontend`, `domain::backend`, `domain::database`, `domain::api`, `domain::testing`, `domain::infrastructure`, `domain::monitoring`, `domain::security`, `domain::performance`, `domain::integration`, `domain::ai`, `domain::i18n`, `domain::analytics`, `domain::design-system`, `domain::legal`, `domain::accessibility`, `domain::documentation`

See `.github/LABELS.md` for complete documentation.

### Step 5: Link Dependencies (If Possible)

After creating issues, if dependencies are clear:
- Note which issue numbers were created
- Add comments linking blocked/blocks relationships
- Or manually suggest user links them

### Step 6: Output Results

Show URLs of created issues:
```
[✓] GitHub issues created!

Epics:
- EPIC-01: https://github.com/[org]/[repo]/issues/1
- EPIC-02: https://github.com/[org]/[repo]/issues/2
...

Stories (first 10):
- STORY-001: https://github.com/[org]/[repo]/issues/3
- STORY-002: https://github.com/[org]/[repo]/issues/4
...

All [Z] issues created. View your board:
https://github.com/[org]/[repo]/issues
```

## After Generation

```
[✓] Session 8 complete! GitHub issues created.

Your issues are now on GitHub, ready for development!

Next, you can optionally generate a working development environment with:
/scaffold-project

Or start building immediately with your prioritized backlog!

What's next?
1.  Run /scaffold-project to generate working dev environment (Session 9)
2.  Or start building! Your backlog is prioritized (P0 stories first)
3.  Track metrics: Implement metrics from product-guidelines/03b-metrics.md
4.  Iterate: Run /refine-journey if your understanding evolves
5.  Validate pricing: Test monetization from product-guidelines/03c-monetization.md

Check cascade anytime: /cascade-status
```

## Important Guidelines

1. **ALWAYS dry run first**: Never create issues without showing user what will be created
2. **Wait for confirmation**: User must explicitly approve
3. **Show URLs**: Return issue URLs so user can click through
4. **Handle errors gracefully**: If `gh` fails (not authenticated, etc.), give clear instructions

## Fallback

If `gh` CLI not available or fails:
```
[x] GitHub CLI not available

Option 1: Install gh CLI
brew install gh (macOS)
Then run: gh auth login

Option 2: Manual Import
I've created all issues in product-guidelines/10-backlog/issues/
You can manually create GitHub issues from these markdown files.

Option 3: CSV Export
I can convert backlog to CSV for bulk import via GitHub UI.
```

---

**Now, read the backlog and push to GitHub (after user confirmation)!**

## Output Format

IMPORTANT: Do not use emojis in generated outputs. Use plain text for all communication.
