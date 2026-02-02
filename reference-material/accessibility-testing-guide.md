# Accessibility Testing Guide

*Last Updated: February 2026*

## Overview

Accessibility testing ensures your application is usable by people with disabilities. **Automated testing can catch ~57% of WCAG issues**, but manual testing is still required for comprehensive coverage.

**Why It Matters:**
- 🏛️ **Legal Compliance:** Section 508 (government), ADA (US), AODA (Canada), EAA (EU)
- 💰 **Market Size:** 15% of global population has disabilities (1.3 billion people)
- ⚖️ **Legal Risk:** Accessibility lawsuits cost $10K-$100K+ in settlements
- 🎯 **Better UX:** Accessibility improvements benefit all users (keyboard nav, color contrast, clear labels)

**Critical For:**
- Government contracts (Section 508 compliance mandatory)
- Healthcare/compliance products (ADA requirements)
- Large enterprises (legal risk mitigation, procurement requirements)
- B2B SaaS (enterprise customers often require WCAG 2.1 AA compliance)

---

## WCAG Standards (Web Content Accessibility Guidelines)

| Level | Compliance | Typical Requirement |
|-------|------------|---------------------|
| **A** | Minimum | Basic accessibility (rare requirement) |
| **AA** | Standard | Most government/enterprise contracts |
| **AAA** | Highest | Specialized accessibility products (rarely required) |

**Recommendation:** Target **WCAG 2.2 Level AA** (current standard as of 2023).

**Key WCAG 2.2 AA Requirements:**
- Color contrast: 4.5:1 for normal text, 3:1 for large text
- Keyboard navigation: All functionality accessible via keyboard
- Focus indicators: Visible focus states for interactive elements
- Alt text: All images have descriptive alternatives
- Form labels: All inputs have associated labels
- Heading structure: Logical h1 → h2 → h3 hierarchy
- ARIA attributes: Proper use (not overuse) of ARIA roles

---

## Automated Accessibility Testing (57% WCAG Coverage)

### axe-core (Industry Standard)

**axe-core** by Deque Systems is the most widely adopted automated accessibility testing engine.

**What It Catches:**
- ✅ Color contrast issues (~12% of WCAG violations)
- ✅ Missing alt text on images (~10%)
- ✅ Missing form labels (~8%)
- ✅ Keyboard navigation issues (~7%)
- ✅ ARIA misuse (~20%)
- ✅ Heading structure problems
- ✅ Missing skip links
- ✅ Language attributes

**What It DOESN'T Catch (Manual Testing Required):**
- ❌ Focus order logic (tab sequence makes sense?)
- ❌ Screen reader experience (ARIA labels meaningful?)
- ❌ Cognitive load issues (content understandable?)
- ❌ Mobile touch target sizes (some, but not all)
- ❌ Context-dependent issues (image alt text quality)

**Coverage:** ~57% of WCAG 2.1 AA issues (independent testing by Deque).

---

## Playwright + axe-playwright Integration

### Installation

```bash
npm install --save-dev @playwright/test axe-core axe-playwright
```

### Basic Usage

```typescript
// tests/e2e/accessibility.spec.ts
import { test, expect } from '@playwright/test';
import { injectAxe, checkA11y } from 'axe-playwright';

test('homepage accessibility', async ({ page }) => {
  await page.goto('/');

  // Inject axe-core library
  await injectAxe(page);

  // Run accessibility scan
  await checkA11y(page);
  // Fails test if violations found
});

test('dashboard accessibility', async ({ page }) => {
  // Login first
  await page.goto('/login');
  await page.fill('[data-testid="email-input"]', 'test@example.com');
  await page.fill('[data-testid="password-input"]', 'password123');
  await page.click('[data-testid="login-button"]');

  // Check dashboard accessibility
  await page.waitForURL('/dashboard');
  await injectAxe(page);
  await checkA11y(page);
});
```

### Selective Rule Testing

```typescript
test('assessment results accessibility - critical rules only', async ({ page }) => {
  await page.goto('/assessments/test-assessment-id');
  await injectAxe(page);

  // Check specific WCAG rules
  await checkA11y(page, null, {
    rules: {
      'color-contrast': { enabled: true },
      'button-name': { enabled: true },
      'image-alt': { enabled: true },
      'label': { enabled: true },
      'link-name': { enabled: true }
    }
  });
});
```

### Excluding False Positives

```typescript
test('homepage accessibility - exclude known issues', async ({ page }) => {
  await page.goto('/');
  await injectAxe(page);

  // Exclude third-party widget (known issue, tracked separately)
  await checkA11y(page, {
    exclude: [['.third-party-widget']]
  });
});

test('form accessibility - disable problematic rule', async ({ page }) => {
  await page.goto('/signup');
  await injectAxe(page);

  await checkA11y(page, null, {
    rules: {
      // Disable color-contrast check (custom dark mode, verified manually)
      'color-contrast': { enabled: false }
    }
  });
});
```

### CI/CD Integration

```yaml
# .github/workflows/test.yml
- name: Run E2E tests with accessibility checks
  run: npm run test:e2e

- name: Upload accessibility report
  if: failure()
  uses: actions/upload-artifact@v3
  with:
    name: accessibility-report
    path: playwright-report/
```

---

## Pytest + axe-selenium-python Integration

### Installation

```bash
pip install axe-selenium-python selenium pytest
```

### Basic Usage

```python
# tests/e2e/test_accessibility.py
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from axe_selenium_python import Axe
import pytest

@pytest.fixture
def selenium():
    options = Options()
    options.add_argument('--headless')
    driver = webdriver.Chrome(options=options)
    yield driver
    driver.quit()

def test_homepage_accessibility(selenium):
    """Test homepage for WCAG 2.1 AA compliance"""
    selenium.get('http://localhost:3000')
    axe = Axe(selenium)

    # Run axe scan
    results = axe.run()

    # Fail if violations found
    violations = results['violations']
    assert len(violations) == 0, f"Found {len(violations)} accessibility violations:\n{format_violations(violations)}"

    # Optionally generate HTML report
    axe.write_results(results, 'accessibility-report.html')

def format_violations(violations):
    """Format violations for readable output"""
    output = []
    for violation in violations:
        output.append(f"\n{violation['impact'].upper()}: {violation['help']}")
        output.append(f"  Rule: {violation['id']}")
        output.append(f"  Affected elements: {len(violation['nodes'])}")
        for node in violation['nodes'][:3]:  # First 3 nodes
            output.append(f"    - {node['html'][:100]}")
    return '\n'.join(output)
```

### Selective Testing

```python
def test_form_accessibility(selenium):
    """Test form with specific WCAG 2.1 AA tags"""
    selenium.get('http://localhost:3000/upload')
    axe = Axe(selenium)

    # Scan with specific tags (WCAG 2.1 AA only)
    results = axe.run(options={
        'runOnly': {
            'type': 'tag',
            'values': ['wcag2aa', 'wcag21aa']
        }
    })

    assert len(results['violations']) == 0

def test_dashboard_accessibility_excluding_widget(selenium):
    """Test dashboard excluding third-party widget"""
    selenium.get('http://localhost:3000/dashboard')
    axe = Axe(selenium)

    # Exclude specific elements
    results = axe.run(
        context={'exclude': [['.third-party-widget']]}
    )

    assert len(results['violations']) == 0
```

### Custom Rules

```python
def test_custom_accessibility_rules(selenium):
    """Test with custom axe rules"""
    selenium.get('http://localhost:3000')
    axe = Axe(selenium)

    # Disable specific rules
    results = axe.run(options={
        'rules': {
            'color-contrast': {'enabled': False},  # Verified manually
            'image-alt': {'enabled': True}
        }
    })

    assert len(results['violations']) == 0
```

---

## Common Accessibility Issues and Fixes

### 1. Color Contrast (12% of Violations)

**Issue:** Text has insufficient contrast with background.

**WCAG Requirement:**
- Normal text (< 18pt): 4.5:1 contrast ratio
- Large text (≥ 18pt or ≥ 14pt bold): 3:1 contrast ratio

**Example Violation:**
```html
<!-- BAD: #767676 on #FFFFFF = 3.98:1 (fails 4.5:1) -->
<p style="color: #767676;">Insufficient contrast</p>
```

**Fix:**
```html
<!-- GOOD: #595959 on #FFFFFF = 4.54:1 (passes) -->
<p style="color: #595959;">Sufficient contrast</p>
```

**Tool:** Use [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

### 2. Missing Alt Text (10% of Violations)

**Issue:** Images lack descriptive alt text.

**Example Violation:**
```html
<!-- BAD: Missing alt attribute -->
<img src="chart.png">

<!-- BAD: Empty alt for meaningful image -->
<img src="user-profile.png" alt="">
```

**Fix:**
```html
<!-- GOOD: Descriptive alt text -->
<img src="chart.png" alt="Compliance score trend showing 85% increase from January to June">

<!-- GOOD: Empty alt for decorative images -->
<img src="decorative-border.png" alt="" role="presentation">
```

### 3. Missing Form Labels (8% of Violations)

**Issue:** Form inputs lack associated labels.

**Example Violation:**
```html
<!-- BAD: No label -->
<input type="email" placeholder="Email address">
```

**Fix:**
```html
<!-- GOOD: Explicit label with for/id -->
<label for="email">Email address</label>
<input type="email" id="email" name="email">

<!-- GOOD: Implicit label (wrapping) -->
<label>
  Email address
  <input type="email" name="email">
</label>

<!-- GOOD: ARIA label (when visible label not desired) -->
<input type="email" aria-label="Email address" placeholder="Email">
```

### 4. Keyboard Navigation (7% of Violations)

**Issue:** Functionality not accessible via keyboard.

**Example Violation:**
```html
<!-- BAD: onClick on div (not keyboard accessible) -->
<div onclick="handleClick()">Click me</div>
```

**Fix:**
```html
<!-- GOOD: Button element (keyboard accessible by default) -->
<button onclick="handleClick()">Click me</button>

<!-- GOOD: If div required, add keyboard support -->
<div
  role="button"
  tabindex="0"
  onclick="handleClick()"
  onkeypress="handleKeyPress(event)"
>
  Click me
</div>
```

**Keyboard Testing Checklist:**
- ✅ All interactive elements reachable via Tab
- ✅ Tab order logical (matches visual flow)
- ✅ Enter/Space activate buttons
- ✅ Escape closes modals/dropdowns
- ✅ Arrow keys navigate menus/lists
- ✅ Focus indicators visible

### 5. ARIA Misuse (20% of Violations)

**Issue:** Incorrect ARIA attributes confuse screen readers.

**Common Mistakes:**

```html
<!-- BAD: role="button" on actual button (redundant) -->
<button role="button">Submit</button>

<!-- BAD: aria-label overrides visible text (confusing) -->
<button aria-label="Click here">Submit Form</button>
```

**Best Practices:**
```html
<!-- GOOD: Use semantic HTML first (no ARIA needed) -->
<button>Submit</button>

<!-- GOOD: ARIA only when semantic HTML insufficient -->
<div role="alert" aria-live="polite">
  Form submitted successfully
</div>

<!-- GOOD: aria-label supplements (not replaces) visible text -->
<button aria-label="Submit assessment form">
  Submit
</button>
```

**ARIA Golden Rule:** "No ARIA is better than bad ARIA." Use semantic HTML first.

---

## Manual Accessibility Testing

### Screen Reader Testing (Required for Compliance)

**Tools:**
- **macOS:** VoiceOver (built-in, Cmd+F5)
- **Windows:** NVDA (free), JAWS (paid, enterprise standard)
- **Mobile:** iOS VoiceOver, Android TalkBack

**Testing Checklist:**
1. ✅ All content announced by screen reader
2. ✅ Interactive elements identified correctly (button, link, etc.)
3. ✅ Form inputs have clear labels
4. ✅ Error messages announced
5. ✅ Dynamic content changes announced (aria-live)
6. ✅ Images have meaningful alt text
7. ✅ Heading structure logical (screen reader users navigate by headings)

**Example Test Flow (VoiceOver):**
```
1. Navigate to /signup
2. Use Cmd+F5 to start VoiceOver
3. Tab through form inputs
4. Verify each input label announced
5. Submit form with errors
6. Verify error messages announced
7. Fix errors and submit successfully
8. Verify success message announced
```

### Keyboard-Only Testing

**Test with keyboard only (no mouse):**
1. ✅ Navigate entire app using only Tab, Shift+Tab, Enter, Space, Escape, Arrow keys
2. ✅ All interactive elements reachable
3. ✅ Focus indicator always visible
4. ✅ Tab order logical
5. ✅ No keyboard traps (can escape from modals, dropdowns)

### Color Blindness Testing

**Tools:**
- Chrome extension: [Colorblindly](https://chrome.google.com/webstore/detail/colorblindly/floniaahmccleoclneebhhmnjgdfijgg)
- Figma plugin: Color Blind

**Types to Test:**
- Deuteranopia (green-blind, 5% of males)
- Protanopia (red-blind, 2.5% of males)
- Tritanopia (blue-blind, rare)

**Don't rely on color alone:**
```html
<!-- BAD: Color only to indicate status -->
<span style="color: red;">Failed</span>

<!-- GOOD: Color + text/icon -->
<span style="color: red;">
  <svg aria-hidden="true"><!-- X icon --></svg>
  Failed
</span>
```

---

## Accessibility Testing Strategy

### Test Pyramid

```
        Manual Screen Reader Testing (5%)
           - Critical user flows only
           - Before major releases

      Keyboard Navigation Testing (10%)
        - All interactive pages
        - CI/CD (automated Playwright tests)

    Automated axe-core Tests (85%)
      - Every page
      - Every PR (CI/CD)
```

### When to Run

| Test Type | Frequency | Blocking | Duration |
|-----------|-----------|----------|----------|
| **Automated (axe-core)** | Every PR | Yes | 1-3 min |
| **Keyboard navigation** | Every PR | Yes | 2-5 min |
| **Screen reader** | Weekly / Before release | No | 30-60 min |
| **Color blind simulation** | Monthly | No | 15 min |

### CI/CD Integration Example

```yaml
# .github/workflows/accessibility.yml
name: Accessibility Tests

on: [pull_request]

jobs:
  axe-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Install dependencies
        run: npm install

      - name: Run axe-core tests
        run: npm run test:e2e -- accessibility.spec.ts

      - name: Upload accessibility report
        if: failure()
        uses: actions/upload-artifact@v3
        with:
          name: accessibility-violations
          path: playwright-report/

  keyboard-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Run keyboard navigation tests
        run: npm run test:e2e -- keyboard.spec.ts
```

---

## Accessibility Checklist (Pre-Release)

**Automated (axe-core):**
- [ ] All pages scanned with axe-core
- [ ] Zero critical/serious violations
- [ ] Color contrast meets WCAG 2.1 AA (4.5:1 normal, 3:1 large)
- [ ] All images have alt text
- [ ] All form inputs have labels
- [ ] ARIA used correctly (not overused)

**Keyboard Navigation:**
- [ ] All interactive elements reachable via Tab
- [ ] Focus indicators visible (at least 3:1 contrast with background)
- [ ] Tab order logical
- [ ] No keyboard traps
- [ ] Modals closeable with Escape

**Screen Reader:**
- [ ] Critical user flows tested with VoiceOver/NVDA
- [ ] Form errors announced
- [ ] Dynamic content changes announced (aria-live)
- [ ] Heading structure logical (h1 → h2 → h3)

**Mobile:**
- [ ] Touch targets ≥ 44x44 CSS pixels (WCAG 2.2 new criterion)
- [ ] Pinch-to-zoom enabled (no maximum-scale=1.0)
- [ ] VoiceOver (iOS) / TalkBack (Android) tested

**Documentation:**
- [ ] Accessibility statement published
- [ ] Known issues documented with workarounds
- [ ] Contact info for accessibility feedback

---

## Resources

**Standards:**
- WCAG 2.2: https://www.w3.org/WAI/WCAG22/quickref/
- Section 508: https://www.section508.gov/
- ADA: https://www.ada.gov/

**Tools:**
- axe DevTools (browser extension): https://www.deque.com/axe/devtools/
- WAVE (browser extension): https://wave.webaim.org/
- Lighthouse (Chrome DevTools): Built-in

**Testing:**
- WebAIM Contrast Checker: https://webaim.org/resources/contrastchecker/
- NVDA Screen Reader: https://www.nvaccess.org/
- Color blindness simulator: https://www.color-blindness.com/coblis-color-blindness-simulator/

**Training:**
- Deque University: https://dequeuniversity.com/
- WebAIM Articles: https://webaim.org/articles/

---

## Summary

| Aspect | Recommendation |
|--------|----------------|
| **Standard** | WCAG 2.2 Level AA (government/enterprise requirement) |
| **Automated Testing** | axe-core with Playwright/Pytest (57% coverage) |
| **Manual Testing** | Screen reader (VoiceOver/NVDA) + keyboard-only testing |
| **CI/CD Integration** | Run axe-core on every PR (blocking) |
| **Coverage Goal** | 100% of user-facing pages scanned, zero critical violations |
| **Release Checklist** | Automated tests + keyboard nav + screen reader (critical flows) |

**Key Takeaway:** Automated testing (axe-core) catches 57% of WCAG issues. Manual testing (screen reader, keyboard) required for the remaining 43%. Critical for government, healthcare, and enterprise B2B products.
