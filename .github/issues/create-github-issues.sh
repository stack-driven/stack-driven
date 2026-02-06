#!/bin/bash

# Script to create GitHub issues from markdown files
# Usage: ./create-github-issues.sh

set -e

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Creating GitHub Issues for Epic #200"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
    echo "❌ Error: GitHub CLI (gh) is not installed"
    echo "Install it with: brew install gh"
    exit 1
fi

# Check if authenticated
if ! gh auth status &> /dev/null; then
    echo "❌ Error: Not authenticated with GitHub CLI"
    echo "Run: gh auth login"
    exit 1
fi

# Create labels if they don't exist
echo "Creating labels..."
gh label create "epic" --description "Epic (meta-issue tracking multiple issues)" --color "8B4789" --force
gh label create "P0" --description "Critical priority" --color "D93F0B" --force
gh label create "P1" --description "High priority" --color "FBCA04" --force
gh label create "bloat" --description "Session bloat / output conciseness" --color "E99695" --force
gh label create "documentation" --description "Documentation improvements" --color "0075CA" --force

echo "✅ Labels created"
echo ""

# Function to create issue from markdown file
create_issue() {
    local file=$1
    local title=$2
    local labels=$3

    if [ ! -f "$file" ]; then
        echo "⚠️  Skipping $file (not found)"
        return
    fi

    echo "Creating issue: $title"

    # Extract body (everything after the first # heading)
    body=$(tail -n +2 "$file")

    # Create issue
    issue_url=$(gh issue create \
        --title "$title" \
        --body "$body" \
        --label "$labels" \
        2>&1)

    if [ $? -eq 0 ]; then
        echo "✅ Created: $issue_url"
    else
        echo "❌ Failed to create issue: $title"
        echo "$issue_url"
    fi
    echo ""
}

# Create Epic first
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Phase 1: Create Epic"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Read epic file and create issue
epic_body=$(cat ../DEBLOAT-EPIC.md)
epic_url=$(gh issue create \
    --title "Epic #200: Remove Session Bloat (Reverse Epic #167)" \
    --body "$epic_body" \
    --label "epic,P0,bloat" \
    2>&1)

if [ $? -eq 0 ]; then
    echo "✅ Epic created: $epic_url"
    EPIC_NUMBER=$(echo "$epic_url" | grep -o '[0-9]*$')
    echo "Epic number: #$EPIC_NUMBER"
else
    echo "❌ Failed to create epic"
    exit 1
fi
echo ""

# Phase 1: Document & Establish Limits
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Phase 1: Document & Establish Limits"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

create_issue "201-audit-session-bloat.md" \
    "Audit Generated File Sizes and Bloat Percentage" \
    "P0,bloat,documentation"

create_issue "202-output-limits-policy.md" \
    "Establish Output Line Limits Policy" \
    "P0,bloat,documentation"

# Phase 2: Surgical Debloat
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Phase 2: Surgical Debloat"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

create_issue "204-rewrite-session-9-lean.md" \
    "Rewrite Session 9 (Test Strategy) as Lean Decision Engine" \
    "P0,bloat"

# Phase 4: Documentation
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Phase 4: Documentation"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

create_issue "216-update-claudemd-anti-bloat.md" \
    "Update CLAUDE.md with Anti-Bloat Principles" \
    "P1,bloat,documentation"

# Summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Summary"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Created issues:"
echo "  ✅ Epic #200"
echo "  ✅ Issue #201 (Audit)"
echo "  ✅ Issue #202 (Policy)"
echo "  ✅ Issue #204 (Session 9 rewrite)"
echo "  ✅ Issue #216 (CLAUDE.md update)"
echo ""
echo "Next steps:"
echo "  1. Create remaining issues manually (205-215) using same pattern"
echo "  2. Link all issues to Epic #200"
echo "  3. Start with Issue #201 (Audit)"
echo ""
echo "View all issues:"
echo "  gh issue list --label bloat"
echo ""
