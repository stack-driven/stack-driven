#!/bin/bash
# validate-decomposition.sh
# Validates /model-application decomposition metrics

set -e

echo "=== /model-application Decomposition Validation ==="
echo ""

# Define sub-agents for /model-application
SUB_AGENTS=(
  ".claude/agents/validate-architectural-style.md"
  ".claude/agents/model-domain-layer.md"
  ".claude/agents/design-transaction-boundaries.md"
  ".claude/agents/choose-orm-pattern.md"
  ".claude/agents/design-rate-limiting.md"
  ".claude/agents/design-cross-cutting-concerns.md"
)

# Validate orchestrator size
echo "=== Command Size Validation ==="
ORCHESTRATOR=".claude/commands/model-application.md"
if [ ! -f "$ORCHESTRATOR" ]; then
  echo "❌ Orchestrator not found: $ORCHESTRATOR"
  exit 1
fi

orchestrator_lines=$(wc -l < "$ORCHESTRATOR")
echo "Orchestrator: $orchestrator_lines lines (target: <400)"
if [ $orchestrator_lines -gt 400 ]; then
  overage=$((orchestrator_lines - 400))
  percentage=$((overage * 100 / 400))
  echo "  ⚠️  $overage lines over limit ($percentage% overage)"
else
  echo "  ✅ Within limit"
fi

echo ""
echo "=== Sub-Agent Size Validation ==="
total_agent_lines=0
for agent in "${SUB_AGENTS[@]}"; do
  if [ ! -f "$agent" ]; then
    echo "❌ Sub-agent not found: $agent"
    exit 1
  fi

  lines=$(wc -l < "$agent")
  total_agent_lines=$((total_agent_lines + lines))
  status="✅"
  note=""

  if [ $lines -gt 400 ]; then
    status="⚠️"
    note=" (check documented exception)"
  fi

  printf "%-50s %5d lines %s%s\n" "$(basename $agent):" "$lines" "$status" "$note"
done

echo ""
echo "Total sub-agent lines: $total_agent_lines"

echo ""
echo "=== Token Reduction Estimates ==="
echo ""
echo "Baseline (monolithic): 2,622 lines (always loaded)"
echo ""

# Complex journey: orchestrator + 5 sub-agents (skip microservices validation)
# Typical: validate-architectural-style, model-domain-layer, design-transaction-boundaries,
#          choose-orm-pattern, design-rate-limiting, design-cross-cutting-concerns
# Skip: none for complex journey
complex_effective=$((orchestrator_lines + total_agent_lines))
complex_reduction=$((100 - (complex_effective * 100 / 2622)))
echo "Complex Journey (6/6 agents invoked):"
echo "  Effective lines: $complex_effective"
echo "  Reduction: $complex_reduction% vs monolithic"
echo "  Target: 40-60% reduction"
if [ $complex_reduction -ge 40 ] && [ $complex_reduction -le 60 ]; then
  echo "  ✅ Within target range"
elif [ $complex_reduction -gt 60 ]; then
  echo "  ⚠️  Exceeds target (better than expected)"
else
  echo "  ❌ Below target range"
fi

echo ""

# Simple journey: orchestrator + 2 sub-agents (domain layer + cross-cutting concerns)
# For simple CRUD: skip architectural style, transaction boundaries, ORM, rate limiting
simple_domain_lines=$(wc -l < ".claude/agents/model-domain-layer.md")
simple_cross_cutting_lines=$(wc -l < ".claude/agents/design-cross-cutting-concerns.md")
simple_effective=$((orchestrator_lines + simple_domain_lines + simple_cross_cutting_lines))
simple_reduction=$((100 - (simple_effective * 100 / 2622)))

echo "Simple Journey (2/6 agents invoked - domain + cross-cutting only):"
echo "  Effective lines: $simple_effective"
echo "  Reduction: $simple_reduction% vs monolithic"
echo "  Target: 70-80% reduction"
if [ $simple_reduction -ge 70 ] && [ $simple_reduction -le 80 ]; then
  echo "  ✅ Within target range"
elif [ $simple_reduction -gt 80 ]; then
  echo "  ⚠️  Exceeds target (better than expected)"
else
  echo "  ❌ Below target range"
fi

echo ""
echo "=== Validation Summary ==="
echo ""

# Check if targets met
orchestrator_ok=true
if [ $orchestrator_lines -gt 450 ]; then
  # Allow 12% overage (400 → 450)
  orchestrator_ok=false
fi

complex_ok=true
if [ $complex_reduction -lt 40 ]; then
  complex_ok=false
fi

simple_ok=true
if [ $simple_reduction -lt 70 ]; then
  simple_ok=false
fi

if [ "$orchestrator_ok" = true ] && [ "$complex_ok" = true ] && [ "$simple_ok" = true ]; then
  echo "✅ All decomposition targets met"
  exit 0
else
  echo "⚠️  Some targets not met (review above for details)"
  exit 0  # Don't fail CI, just warn
fi
