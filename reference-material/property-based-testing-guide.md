# Property-Based Testing Guide

*Last Updated: February 2026*

## Overview

Property-based testing verifies that code behaves correctly across a wide range of inputs by defining **properties** (invariants that ALWAYS hold true) and automatically generating hundreds/thousands of test cases.

Unlike example-based testing (test specific inputs), property-based testing generates random inputs to discover edge cases you didn't think of.

## When to Use Property-Based Testing

**High-Value Scenarios:**
- ✅ Complex algorithms with many edge cases
- ✅ Document parsers (PDFs, DOCXs with various formats)
- ✅ Assessment/scoring logic (mathematical properties)
- ✅ Date/time calculations (timezones, leap years)
- ✅ Currency formatting and conversions
- ✅ String manipulation (encoding, sanitization)
- ✅ Data serialization/deserialization

**Not Worth It:**
- ❌ Simple CRUD operations
- ❌ UI component rendering (use example-based tests)
- ❌ Third-party API integrations (use mocks)

---

## Tools by Language

| Language | Tool | Ecosystem | Maturity |
|----------|------|-----------|----------|
| Python | [Hypothesis](https://hypothesis.readthedocs.io/) | Excellent | Production-ready |
| JavaScript/TypeScript | [fast-check](https://github.com/dubzzz/fast-check) | Excellent | Production-ready |
| Scala | ScalaCheck | Excellent | Production-ready |
| Haskell | QuickCheck (original) | Excellent | Production-ready |
| Java | jqwik / QuickTheories | Good | Production-ready |
| Rust | proptest | Excellent | Production-ready |

**Recommendation:** Hypothesis (Python) and fast-check (JavaScript) are the 2025 industry standards.

---

## Python Examples (Hypothesis)

### Installation

```bash
pip install hypothesis
pytest  # Hypothesis integrates with pytest
```

### Example 1: Compliance Score Calculation

**Property:** Score is always between 0-100, regardless of inputs.

```python
# tests/test_assessment.py
from hypothesis import given, strategies as st
from app.assessment import calculate_compliance_score

@given(
    requirements=st.lists(st.text(min_size=1, max_size=50), min_size=0, max_size=20),
    findings=st.lists(st.text(min_size=1, max_size=50), min_size=0, max_size=20)
)
def test_compliance_score_always_in_range(requirements, findings):
    """Property: Score is ALWAYS between 0-100"""
    score = calculate_compliance_score(requirements, findings)

    assert 0 <= score <= 100, f"Score {score} out of range for reqs={requirements}, findings={findings}"
```

**What Hypothesis does:**
1. Generates 100+ random combinations of `requirements` and `findings`
2. Runs test with each combination
3. If failure found, **shrinks** input to minimal failing case
4. Reports: "Failed with requirements=['abc'], findings=['xyz']"

### Example 2: Document Parser (PDF Format Variations)

**Property:** Parser never crashes, always returns structured data OR error.

```python
from hypothesis import given, strategies as st
from app.parser import parse_document

@given(
    file_bytes=st.binary(min_size=0, max_size=1024*1024),  # Up to 1MB
    file_type=st.sampled_from(['pdf', 'docx', 'txt'])
)
def test_parser_never_crashes(file_bytes, file_type):
    """Property: Parser ALWAYS returns result OR raises known exception"""
    try:
        result = parse_document(file_bytes, file_type)

        # If successful, verify structure
        assert 'text' in result
        assert isinstance(result['text'], str)
        assert 'metadata' in result

    except (ValueError, UnsupportedFormatError) as e:
        # Known exceptions are OK
        pass
```

**Discovered Bug Example:**
```
Hypothesis found failing case:
  file_bytes=b'%PDF-1.4\n%\xe2\xe3\xcf\xd3\n' (truncated PDF header)
  file_type='pdf'
  Error: IndexError (parser assumed header always complete)
```

### Example 3: Date Calculations

**Property:** Adding N days then subtracting N days returns original date.

```python
from hypothesis import given, strategies as st
from datetime import datetime, timedelta

@given(
    start_date=st.datetimes(min_value=datetime(2000, 1, 1), max_value=datetime(2030, 12, 31)),
    days=st.integers(min_value=-365, max_value=365)
)
def test_date_addition_is_reversible(start_date, days):
    """Property: add_days(start, N) - N days == start"""
    from app.utils import add_business_days

    end_date = add_business_days(start_date, days)
    back_to_start = add_business_days(end_date, -days)

    assert back_to_start.date() == start_date.date()
```

### Example 4: Stateful Testing (Session Management)

**Property:** Login → Logout → Login again always works.

```python
from hypothesis.stateful import RuleBasedStateMachine, rule
import requests

class UserSessionStateMachine(RuleBasedStateMachine):
    def __init__(self):
        super().__init__()
        self.session_token = None

    @rule()
    def login(self):
        """Login creates valid session"""
        response = requests.post('/api/login', json={'email': 'test@example.com', 'password': 'pass'})
        assert response.status_code == 200
        self.session_token = response.json()['token']

    @rule()
    def logout(self):
        """Logout invalidates session"""
        if self.session_token:
            response = requests.post('/api/logout', headers={'Authorization': f'Bearer {self.session_token}'})
            assert response.status_code == 200
            self.session_token = None

    @rule()
    def access_protected(self):
        """Protected routes require valid session"""
        response = requests.get('/api/dashboard', headers={'Authorization': f'Bearer {self.session_token}'})

        if self.session_token:
            assert response.status_code == 200
        else:
            assert response.status_code == 401

TestUserSession = UserSessionStateMachine.TestCase
```

---

## JavaScript/TypeScript Examples (fast-check)

### Installation

```bash
npm install --save-dev fast-check
```

### Example 1: String Sanitization

**Property:** Sanitized output never contains script tags.

```typescript
// tests/sanitizer.test.ts
import fc from 'fast-check';
import { sanitizeHTML } from '@/utils/sanitizer';

test('sanitized HTML never contains script tags', () => {
  fc.assert(
    fc.property(
      fc.string(),  // Any string input
      (input) => {
        const sanitized = sanitizeHTML(input);

        // Property: Output never contains <script>
        expect(sanitized).not.toMatch(/<script/i);
        expect(sanitized).not.toMatch(/<\/script>/i);
      }
    ),
    { numRuns: 1000 }  // Run 1000 test cases
  );
});
```

### Example 2: JSON Serialization Roundtrip

**Property:** serialize(deserialize(data)) === data

```typescript
import fc from 'fast-check';
import { serialize, deserialize } from '@/utils/codec';

test('serialization roundtrip preserves data', () => {
  fc.assert(
    fc.property(
      fc.record({
        id: fc.nat(),
        name: fc.string(),
        tags: fc.array(fc.string()),
        metadata: fc.dictionary(fc.string(), fc.anything())
      }),
      (data) => {
        const serialized = serialize(data);
        const deserialized = deserialize(serialized);

        expect(deserialized).toEqual(data);
      }
    )
  );
});
```

### Example 3: Assessment Score Properties

**Properties:**
1. Score ∈ [0, 100]
2. All requirements met → score = 100
3. No requirements met → score = 0

```typescript
import fc from 'fast-check';
import { calculateComplianceScore } from '@/assessment/scoring';

describe('Compliance Score Properties', () => {
  test('score is always in range 0-100', () => {
    fc.assert(
      fc.property(
        fc.array(fc.string()),  // requirements
        fc.array(fc.string()),  // findings
        (requirements, findings) => {
          const score = calculateComplianceScore(requirements, findings);
          expect(score).toBeGreaterThanOrEqual(0);
          expect(score).toBeLessThanOrEqual(100);
        }
      )
    );
  });

  test('all requirements met yields 100% score', () => {
    fc.assert(
      fc.property(
        fc.array(fc.string(), { minLength: 1 }),
        (requirements) => {
          const findings = [...requirements];  // All requirements met
          const score = calculateComplianceScore(requirements, findings);
          expect(score).toBe(100);
        }
      )
    );
  });

  test('no requirements met yields 0% score', () => {
    fc.assert(
      fc.property(
        fc.array(fc.string(), { minLength: 1 }),
        (requirements) => {
          const findings: string[] = [];  // No requirements met
          const score = calculateComplianceScore(requirements, findings);
          expect(score).toBe(0);
        }
      )
    );
  });
});
```

---

## Property-Based Testing Strategy

### Identifying Properties

**Common Property Patterns:**

1. **Invariants** - Always true regardless of input
   - `0 <= score <= 100`
   - `sorted(list) has same elements as list`

2. **Inverse Functions** - Round-trip equality
   - `decrypt(encrypt(x)) == x`
   - `parse(serialize(x)) == x`

3. **Idempotence** - Applying twice = applying once
   - `sanitize(sanitize(x)) == sanitize(x)`
   - `sort(sort(list)) == sort(list)`

4. **Commutativity** - Order doesn't matter
   - `add(a, b) == add(b, a)`
   - `merge(x, y) == merge(y, x)` (if commutative merge)

5. **Metamorphic Relations** - Output changes predictably
   - `score(requirements, findings + [new_finding]) >= score(requirements, findings)`

### Combining with Example-Based Testing

**Best Practice:** Use BOTH approaches.

```python
# Example-based: Specific known cases
def test_compliance_score_known_case():
    assert calculate_compliance_score(['a', 'b'], ['a']) == 50

# Property-based: General invariants
@given(requirements=st.lists(st.text()), findings=st.lists(st.text()))
def test_compliance_score_always_in_range(requirements, findings):
    score = calculate_compliance_score(requirements, findings)
    assert 0 <= score <= 100
```

**When to Use Each:**

| Scenario | Example-Based | Property-Based |
|----------|---------------|----------------|
| Known edge cases | ✅ Yes | ❌ Overkill |
| Regression bugs | ✅ Yes | ⚠️ Maybe |
| General correctness | ⚠️ Limited | ✅ Yes |
| Complex algorithms | ⚠️ Partial | ✅ Yes |
| API contracts | ✅ Yes | ⚠️ Complement |

---

## Common Pitfalls

### 1. Weak Properties

**Bad:**
```python
@given(st.integers())
def test_increment(x):
    assert increment(x) != x  # TOO WEAK (fails for INT_MAX)
```

**Good:**
```python
@given(st.integers(min_value=-1000000, max_value=1000000))
def test_increment(x):
    assert increment(x) == x + 1  # STRONG property
```

### 2. Flaky Properties (Randomness in Code Under Test)

If your code uses randomness, properties must account for it:

```python
# Bad: Flaky test
@given(st.lists(st.integers()))
def test_shuffle_changes_order(lst):
    assert shuffle(lst) != lst  # FLAKY (might randomly preserve order)

# Good: Test invariants that hold despite randomness
@given(st.lists(st.integers()))
def test_shuffle_preserves_elements(lst):
    shuffled = shuffle(lst)
    assert sorted(shuffled) == sorted(lst)  # Elements preserved
```

### 3. Performance Issues with Large Inputs

Hypothesis/fast-check can generate LARGE inputs (huge lists, deep objects).

**Solution:** Constrain generators.

```python
# Bad: Can generate 10,000-element lists (slow tests)
@given(st.lists(st.integers()))

# Good: Reasonable max size
@given(st.lists(st.integers(), max_size=100))
```

---

## CI/CD Integration

### Pytest (Hypothesis)

```yaml
# .github/workflows/test.yml
- name: Run property-based tests
  run: |
    pytest tests/property/ -v --hypothesis-show-statistics
```

**Configuration:**

```python
# tests/conftest.py
from hypothesis import settings

# Increase test cases for CI (more thorough)
settings.register_profile("ci", max_examples=1000)
settings.register_profile("dev", max_examples=100)

import os
settings.load_profile("ci" if os.getenv("CI") else "dev")
```

### Jest (fast-check)

```json
// package.json
{
  "scripts": {
    "test:property": "jest --testPathPattern=property"
  }
}
```

```yaml
# .github/workflows/test.yml
- name: Run property-based tests
  run: npm run test:property
```

---

## Resources

**Official Documentation:**
- Hypothesis: https://hypothesis.readthedocs.io/
- fast-check: https://github.com/dubzzz/fast-check
- Property-Based Testing Book: https://www.propertesting.com/

**Tutorials:**
- Hypothesis Quick Start: https://hypothesis.readthedocs.io/en/latest/quickstart.html
- fast-check Examples: https://github.com/dubzzz/fast-check/tree/main/examples

**Academic Papers:**
- QuickCheck (original): https://www.cs.tufts.edu/~nr/cs257/archive/john-hughes/quick.pdf

---

## Summary

| Aspect | Recommendation |
|--------|----------------|
| **When to use** | Complex algorithms, parsers, math operations |
| **Tools** | Hypothesis (Python), fast-check (JavaScript) |
| **Strategy** | Combine with example-based tests (not replace) |
| **Properties** | Invariants, inverse functions, idempotence |
| **CI/CD** | Run in CI with higher `max_examples` (1000+) |
| **Coverage** | Complements code coverage (finds edge cases) |

Property-based testing is a **force multiplier** - write 1 test, get 1000+ test cases. Ideal for compliance/assessment products where edge cases can cause regulatory issues.
