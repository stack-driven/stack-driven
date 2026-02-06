#!/bin/bash

# Quick script to measure session bloat
# Usage: ./scripts/measure-bloat.sh

set -e

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Session Bloat Measurement"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

GUIDELINES_DIR="product-guidelines"

if [ ! -d "$GUIDELINES_DIR" ]; then
    echo "❌ Error: $GUIDELINES_DIR directory not found"
    echo "This directory is gitignored (user-specific outputs)"
    exit 1
fi

echo "Measuring line counts for all .md files..."
echo ""

# Table header
printf "%-45s %10s %10s\n" "File" "Lines" "Tokens (est)"
printf "%-45s %10s %10s\n" "----" "-----" "------------"

total_lines=0
total_tokens=0

# Process each .md file (excluding .ctx.md)
for file in "$GUIDELINES_DIR"/*.md; do
    # Skip if no .md files exist
    [ -e "$file" ] || continue

    # Skip .ctx.md files
    if [[ "$file" == *".ctx.md" ]]; then
        continue
    fi

    basename=$(basename "$file")
    lines=$(wc -l < "$file")
    tokens=$((lines * 5))  # Rough estimate: 5 tokens per line

    printf "%-45s %10d %10d\n" "$basename" "$lines" "$tokens"

    total_lines=$((total_lines + lines))
    total_tokens=$((total_tokens + tokens))
done

echo ""
printf "%-45s %10s %10s\n" "----" "-----" "------------"
printf "%-45s %10d %10d\n" "TOTAL" "$total_lines" "$total_tokens"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Context File Compression"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

printf "%-35s %10s %10s %10s\n" "File" "Full Lines" "Ctx Lines" "Reduction"
printf "%-35s %10s %10s %10s\n" "----" "----------" "---------" "---------"

# Compare .md with .ctx.md
for file in "$GUIDELINES_DIR"/*.md; do
    # Skip if no .md files exist
    [ -e "$file" ] || continue

    # Skip .ctx.md files
    if [[ "$file" == *".ctx.md" ]]; then
        continue
    fi

    ctx_file="${file%.md}.ctx.md"

    # Skip if .ctx.md doesn't exist
    if [ ! -f "$ctx_file" ]; then
        continue
    fi

    basename=$(basename "$file" .md)
    full_lines=$(wc -l < "$file")
    ctx_lines=$(wc -l < "$ctx_file")
    reduction=$(awk "BEGIN {printf \"%.1f%%\", (1 - $ctx_lines / $full_lines) * 100}")

    printf "%-35s %10d %10d %10s\n" "$basename" "$full_lines" "$ctx_lines" "$reduction"
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Analysis"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Count how many files exceed limits
declare -A limits
limits["00-user-journey.md"]=600
limits["01-product-strategy.md"]=600
limits["02-tech-stack.md"]=500
limits["02a-constraints.md"]=600
limits["02b-coding-standards.md"]=500
limits["02c-ai-integration-strategy.md"]=500
limits["03a-mission.md"]=150
limits["03b-metrics.md"]=150
limits["03c-monetization.md"]=150
limits["03d-analytics-strategy.md"]=150
limits["04-architecture.md"]=600
limits["05-brand-strategy.md"]=700
limits["06-design-system.md"]=700
limits["07-database-schema.md"]=800
limits["08-api-design.md"]=800
limits["08b-api-contracts.md"]=800
limits["09-test-strategy.md"]=800
limits["09b-application-architecture.md"]=800

bloated_count=0
total_count=0
total_excess=0

for file in "$GUIDELINES_DIR"/*.md; do
    [ -e "$file" ] || continue
    if [[ "$file" == *".ctx.md" ]]; then
        continue
    fi

    basename=$(basename "$file")
    lines=$(wc -l < "$file")
    limit=${limits[$basename]}

    if [ -n "$limit" ]; then
        total_count=$((total_count + 1))
        if [ "$lines" -gt "$limit" ]; then
            excess=$((lines - limit))
            percent=$(awk "BEGIN {printf \"%.0f%%\", ($lines / $limit - 1) * 100}")
            echo "❌ BLOATED: $basename ($lines lines, limit $limit, +$excess = $percent over)"
            bloated_count=$((bloated_count + 1))
            total_excess=$((total_excess + excess))
        fi
    fi
done

echo ""
echo "Summary:"
echo "  Total files: $total_count"
echo "  Bloated files: $bloated_count"
echo "  Compliant files: $((total_count - bloated_count))"
echo "  Total excess lines: $total_excess"
echo "  Estimated excess tokens: $((total_excess * 5))"
echo ""

if [ "$bloated_count" -eq 0 ]; then
    echo "✅ All files within limits!"
else
    echo "⚠️  $bloated_count file(s) exceed limits (see above)"
    echo ""
    echo "Next steps:"
    echo "  1. Read .github/DEBLOAT-EPIC.md"
    echo "  2. Start with Issue #201 (audit)"
    echo "  3. Fix bloated sessions (Issues #204-#208)"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
