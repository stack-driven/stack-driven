#!/bin/bash
# validate-agent-sizes.sh
# Validates sub-agent file sizes against 400-line target

set -e

echo "=== Sub-Agent Size Validation ==="
echo ""

EXIT_CODE=0
DOCUMENTED_EXCEPTIONS=(
  "design-cross-cutting-concerns.md"
  "design-transaction-boundaries.md"
)

# Check all agents in .claude/agents/
for agent_file in .claude/agents/*.md; do
  if [ ! -f "$agent_file" ]; then
    continue
  fi

  filename=$(basename "$agent_file")
  lines=$(wc -l < "$agent_file")

  # Check if this is a documented exception
  is_exception=false
  for exception in "${DOCUMENTED_EXCEPTIONS[@]}"; do
    if [ "$filename" = "$exception" ]; then
      is_exception=true
      break
    fi
  done

  if [ $lines -gt 400 ]; then
    if [ "$is_exception" = true ]; then
      echo "⚠️  $filename: $lines lines (>400 limit - DOCUMENTED EXCEPTION)"
    else
      echo "❌ $filename: $lines lines (>400 limit - VIOLATION)"
      echo "   Agent exceeds size limit without documented exception in CLAUDE.md."
      echo "   Either refactor to <400 lines OR add exception with justification."
      EXIT_CODE=1
    fi
  else
    echo "✅ $filename: $lines lines"
  fi
done

echo ""
if [ $EXIT_CODE -eq 0 ]; then
  echo "✅ All sub-agent sizes validated successfully"
else
  echo "❌ Sub-agent size violations found"
  echo ""
  echo "To fix:"
  echo "1. Refactor violating agent to <400 lines (preferred)"
  echo "2. OR add documented exception in CLAUDE.md 'Documented Exceptions' section"
  echo "   with explicit justification for why splitting would harm design"
fi

exit $EXIT_CODE
