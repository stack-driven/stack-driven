# Create test-strategy-essentials.md template for backlog generation

## Problem

The `test-strategy-template.md` file is **715 lines** with detailed testing philosophy, unit/integration/E2E examples, test data management, performance testing scenarios, security testing, TDD/BDD workflows, and extensive "What We DIDN'T Choose" sections. When Session 10 (backlog generation) reads this file, it loads **~2,860 tokens** of testing implementation details.

**Bloat level: 80%** (CRITICAL)

## What Backlog Generation Actually Needs

Backlog generation needs:
- Coverage targets (for story estimation)
- Test types required (unit, integration, E2E)
- Testing tools (from tech stack)
- Quality gates (for acceptance criteria)

Backlog generation does NOT need:
- Testing philosophy
- Detailed test examples
- Test data management strategies
- Performance testing scenarios
- Security testing details
- TDD/BDD workflow explanations
- Testing checklists
- "What We DIDN'T Choose" sections
- Setup instructions
- CI/CD integration details

## Solution

Create `templates/19-test-strategy-essentials-template.md` that contains only the test requirements needed for backlog generation.

**Target size: 80-120 lines (~320-480 tokens)**
**Reduction: 85% (715 → 100 lines)**

## Essential Template Structure

```markdown
# Test Strategy Essentials (For Backlog Generation)

> This is a condensed version for Session 10 (backlog generation).
> See `09-test-strategy.md` for complete testing strategy with examples.

## Coverage Targets (for story estimation)

| Component | Target Coverage | Test Type |
|-----------|----------------|-----------|
| Business logic | 90%+ | Unit tests |
| API endpoints | 70-80% | Integration tests |
| Database operations | 70% | Integration tests |
| UI components | 50-60% | Unit + E2E tests |
| Critical user flows | 100% | E2E tests |

**Overall target**: 70% code coverage minimum

## Test Types (for story scope)

### Unit Tests
- All business logic and algorithms
- Validation rules
- Utilities and helpers
- Complex component logic

### Integration Tests
- All API endpoints (request/response, auth, errors)
- Database operations (queries, transactions)
- External service integrations

### E2E Tests
- Critical user flows (Journey Steps 1-3)
- Complete happy path scenarios
- Error handling flows

## Testing Tools (from tech stack)

**Backend**: [Pytest/Jest/etc.]
**Frontend**: [Vitest/Jest + Testing Library]
**E2E**: [Playwright/Cypress]
**Coverage**: [Coverage tool]

## Quality Gates (for acceptance criteria)

Stories cannot be marked "Done" unless:
- [ ] All tests pass
- [ ] Coverage >= 70% for new code
- [ ] No high/critical security vulnerabilities
- [ ] Code review approved

## Test Requirements in Stories

Each story should include:
1. **Unit test scope**: Which functions/components need unit tests
2. **Integration test scope**: Which API endpoints or database operations need tests
3. **E2E test scope**: Which user flows need E2E coverage (if applicable)

**Estimation guidance**:
- Add 30-40% to development time for test writing
- E2E tests take longer to write and maintain
```

## Implementation Checklist

- [ ] Create `templates/19-test-strategy-essentials-template.md`
- [ ] Update `.claude/commands/create-test-strategy.md` to generate BOTH versions
- [ ] Update `.claude/commands/generate-backlog.md` to read essentials instead of full file
- [ ] Test with example project
- [ ] Verify stories include appropriate test requirements

## Success Criteria

- Essentials file is 80-120 lines
- Contains coverage targets and quality gates
- Stories include test requirements without needing detailed examples
- Context usage reduced by ~2,400 tokens

## Impact

- **Lines reduced**: 715 → 100 (86% reduction)
- **Token reduction**: ~2,860 → ~400 tokens
- **Context savings**: ~2,460 tokens per backlog generation

## Labels

`enhancement`, `context-optimization`, `templates`, `high-impact`
