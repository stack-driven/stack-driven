# CLAUDE-VALIDATION.ctx.md

Context for quality validation, code review, and framework adherence. Load when reviewing outputs, validating quality, or checking compliance.

## Validation Framework

### `/validate-outputs` Command
Validates ALL cascade outputs for:

**Critical Criteria:**
- Journey alignment - Decisions trace to specific journey steps
- Philosophy adherence - User-first, generative approach
- Specificity - Named personas, concrete examples
- Completeness - All template sections filled
- Consistency - Cross-file alignment
- Technical soundness - Proper patterns implemented

**Quality Grades:**
- A: Excellent - All criteria met, highly specific
- B: Good - Most criteria met, minor issues
- C: Needs Work - Missing key elements
- F: Regenerate - Fundamental issues

### Validation Checklist Categories

From VALIDATION-CHECKLIST.md:

1. **Journey Traceability** - All decisions reference journey
2. **Specificity** - Concrete, not generic
3. **Consistency** - Files align with each other
4. **Completeness** - All sections populated
5. **Technical Soundness** - Proper implementations
6. **Philosophy** - Framework principles followed
7. **Context Efficiency** - .ctx.md files created
8. **Dependency Management** - Cascade order respected
9. **Human Checkpoints** - Validation points included
10. **Documentation** - Clear, actionable
11. **Testing** - Coverage appropriate
12. **Command Size** - <400 lines, decomposed

## PR Review Framework

### Three-Layer Review

**Layer 1: Framework Validation**
- Check VALIDATION-CHECKLIST.md rules
- Report pass/fail per category
- Focus on Stack-Driven patterns

**Layer 2: PR Quality**
- Linked issue exists
- CI passes
- Commit messages clear
- Diff scope appropriate

**Layer 3: Code Quality**
- Security vulnerabilities
- Performance issues
- Test coverage
- Error handling

### Priority Levels

**High Priority (Must Fix):**
- Security vulnerabilities
- Data loss risks
- Breaking changes
- Framework violations

**Medium Priority (Should Fix):**
- Missing tests
- Poor error handling
- Documentation gaps
- Code organization

**Low Priority (Consider):**
- Style consistency
- Minor optimizations
- Nice-to-haves

## Quality Anti-Patterns

### Generic Outputs
❌ "Improve user experience"
❌ "Modern web application"
❌ "Scalable architecture"

### Missing Traceability
❌ No journey references
❌ Arbitrary tech choices
❌ Unexplained decisions

### Monolithic Blobs
❌ Commands >400 lines
❌ No conditional loading
❌ Everything always loaded

### Template Filling
❌ Copy-paste between products
❌ Default recommendations
❌ One-size-fits-all

## Validation Examples

### Good Journey Traceability
✅ "PostgreSQL chosen because compliance officers need complex framework relationships (Step 3: Assessment Configuration) with JSONB flexibility for varying criteria"

### Good Specificity
✅ "4-hour document review → 60-second AI summary = 240x efficiency gain"
✅ "Blue (#1E40AF) conveys professional trust for compliance officers"

### Good Context Efficiency
✅ Full: 07-database-schema.md (45k chars)
✅ Context: 07-database-schema.ctx.md (20k chars)
✅ Reduction: 56%

## Review Iteration Tracking

- Track review rounds
- Warn after 5 iterations (reviewer fatigue)
- Suggest escalation if stuck
- Document persistent issues

## Rollback Instructions

Each checkpoint includes rollback guidance:
```
Issues found? Regenerate with:
/[session-name]
This will overwrite current output
Previous decisions cascade forward
```

## Cascade Coherence Checks

Verify alignment across sessions:
- Tech stack → Database choices
- Journey → Backlog priorities
- Metrics → Observability measures
- Brand → Design implementation
- Architecture → Scaffold structure

## Testing Validation

Required test coverage by component:
- API endpoints: Unit + integration
- Database: Schema + migrations
- Frontend: Component + E2E
- Security: Auth + authorization
- Performance: Load + stress

## Documentation Standards

Each output must include:
- What was chosen and why
- What wasn't chosen and why
- Journey references
- Success criteria
- Validation steps

## Common Validation Failures

1. **Too Generic** - Could apply to any product
2. **Missing Context** - No .ctx.md file created
3. **Cascade Break** - Skipped dependency
4. **Monolithic Command** - >400 lines
5. **No Journey Trace** - Decisions unexplained
6. **Template Deviation** - Missing sections
7. **Checkpoint Skip** - No validation pause
8. **State Loss** - No progress tracking

## Enforcement Points

- Pre-commit: Size checks
- PR review: Framework validation
- Post-merge: Quality metrics
- User feedback: Iteration tracking

## Success Metrics

Track across projects:
- Cascade completion rate
- Validation pass rate
- Review iterations average
- Token efficiency gains
- User satisfaction scores