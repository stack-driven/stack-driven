# Enhance `/create-design` with 2025 Design System Engineering Best Practices

## Summary

The `/create-design` cascade command (Session 6) demonstrates **exceptional journey-driven design philosophy** but lacks critical technical depth in modern design system engineering. This issue proposes enhancements based on industry standards from Material Design 3, IBM Carbon, Shopify Polaris, and the W3C Design Tokens Community Group.

**Current Grade:** B+ (Philosophy) / C (Technical Implementation)
**Target Grade:** A+ (Philosophy & Technical)

**Impact:** Affects Sessions 6, 12 (scaffold), and all downstream product quality. Design system outputs currently lack:
- Industry-standard token architecture (DTCG format)
- 2025 CSS tooling recommendations (zero-runtime solutions)
- WCAG 2.2 compliance (October 2023 standard)
- Performance optimization patterns
- Headless accessibility libraries
- Documentation and versioning strategies

---

## Problem Statement

### Current State

The `/create-design` command generates journey-optimized design systems with excellent component-to-user-flow mapping, but outputs lack technical implementation depth that modern design systems require. Key gaps:

1. **No design token hierarchy** - Outputs use inline hex values instead of DTCG-formatted tokens with primitive → semantic → component tiers
2. **Outdated CSS recommendations** - Still suggests styled-components (entered maintenance mode March 2025) without zero-runtime alternatives
3. **Missing WCAG 2.2 compliance** - References generic WCAG 2.1 without new success criteria (Target Size, Focus Not Obscured, Accessible Authentication)
4. **No performance strategy** - Doesn't guide bundle splitting, icon optimization (SVG sprites vs React components), or tree-shaking
5. **Missing accessibility primitives** - Recommends building custom components without headless library foundation (Radix UI, React Aria)
6. **No evolution plan** - Generates design system without versioning, deprecation patterns, or migration codemods

### Impact on Cascade

**Session 6 (Design System):** Outputs lack technical completeness for production implementation

**Session 12 (Scaffold):** Cannot generate:
- Proper token configuration files (tailwind.config.ts, panda.config.ts)
- Type-safe component variants (CVA patterns)
- Accessibility primitives (Radix/Headless UI imports)
- Performance-optimized build configs

**Long-term:** Teams manually retrofit modern patterns post-cascade, undermining Stack-Driven's "production-ready" value proposition

---

## Detailed Findings

### A. Design Token Architecture (CRITICAL GAP)

**Current State:**
```markdown
**Primary Blue**: #0066cc (Trust-focused brand personality)
```

**Industry Standard (DTCG Format):**
```json
{
  "color": {
    "primitive": {
      "blue": { "500": { "$value": "#0066cc", "$type": "color" } }
    },
    "semantic": {
      "action": {
        "primary": {
          "$value": "{color.primitive.blue.500}",
          "$description": "Primary action for journey-critical CTAs"
        }
      }
    },
    "component": {
      "button": {
        "background": { "$value": "{color.semantic.action.primary}" }
      }
    }
  }
}
```

**Why This Matters:**
- **Theming:** Can't implement light/dark mode without semantic token layer
- **Multi-platform:** Can't generate iOS Swift, Android Compose, CSS variables from same source
- **Design handoff:** Can't sync with Figma Variables via Tokens Studio
- **Maintainability:** Changing `#0066cc` requires find/replace vs single token update

**Reference:** W3C Design Tokens Community Group v2025.10 standard, adopted by Figma, Adobe, Sketch

---

### B. CSS Architecture (CRITICAL GAP)

**Current State:**
```markdown
**Decision**: Tailwind CSS
- Rationale: Fast iteration, design tokens via config, team familiar
- Trade-off: Less custom styling, utility class proliferation

**Alternatives:**
- Styled Components / Emotion: CSS-in-JS, component-scoped styles
```

**Problems:**
1. Recommends styled-components without deprecation warning (maintenance mode March 2025)
2. Doesn't mention Tailwind v4 (5x faster builds, released 2025)
3. Missing zero-runtime alternatives: Panda CSS, Vanilla Extract
4. No theming implementation pattern (CSS custom properties, FOIT prevention)
5. No performance comparison (runtime CSS-in-JS adds 20-30KB + parsing overhead)

**Industry Standard (2025):**

| Tool | Status | Build Speed | Runtime Cost | Recommendation |
|------|--------|-------------|--------------|----------------|
| **Tailwind CSS v4** | Active | 5x faster | Zero | ✅ Default choice |
| **Panda CSS** | Active | Fast | Zero | ✅ Chakra migration |
| **Vanilla Extract** | Active | Fast | Zero | ✅ TypeScript-first |
| **Emotion** | Active | Standard | 20-30KB | ⚠️ Legacy only |
| **styled-components** | Maintenance | Standard | 20-30KB | ❌ Avoid new projects |

**Missing Pattern (CSS Custom Properties Theming):**
```css
:root {
  --color-bg: #ffffff;
  --color-text: #1a1a1a;
}

[data-theme="dark"] {
  --color-bg: #1a1a1a;
  --color-text: #f0f0f0;
}

/* Prevent flash of incorrect theme */
<script>
  const saved = localStorage.getItem('theme');
  if (saved) document.documentElement.setAttribute('data-theme', saved);
</script>
```

**Why This Matters:**
- **Performance:** Runtime CSS-in-JS slows hydration, hurts Core Web Vitals
- **DX:** Zero-runtime tools have better TypeScript integration
- **Future-proof:** Industry shifted decisively away from runtime solutions

---

### C. Accessibility Engineering (CRITICAL GAP)

**Current State:**
```markdown
**WCAG Compliance Level**: AA
**Color Contrast Requirements**:
- Body text: 4.5:1 minimum
- Large text: 3:1 minimum
```

**Missing WCAG 2.2 Success Criteria (October 2023):**

| Criterion | Level | Requirement | Journey Impact |
|-----------|-------|-------------|----------------|
| **2.5.8 Target Size** | AA | Min 24×24px touch targets | Upload buttons, checkboxes, filters |
| **2.4.11 Focus Not Obscured** | AA | Focused element partially visible | Sticky headers can't hide focused elements |
| **3.3.8 Accessible Authentication** | AA | No cognitive function tests | Can't use CAPTCHA for login |

**Missing ARIA Patterns by Component Type:**

Current command lists generic requirements. Industry standard provides component-specific patterns:

| Component | Role | Key Attributes | Keyboard Navigation |
|-----------|------|----------------|---------------------|
| Dialog | `dialog`, `aria-modal="true"` | `aria-labelledby`, `aria-describedby` | Esc closes, Tab trapped |
| Menu | `menu`, `menuitem` | `aria-expanded`, `aria-haspopup` | Arrows navigate, Enter selects |
| Tabs | `tablist`, `tab`, `tabpanel` | `aria-selected`, `aria-controls` | Arrows switch tabs |
| Combobox | `combobox` | `aria-activedescendant` | Arrows navigate options |
| Slider | `slider` | `aria-valuenow`, `aria-valuemin/max` | Arrows adjust value |

**Missing Headless Accessibility Libraries:**

Command recommends building accessibility from scratch. Industry uses production-tested primitives:

| Library | Components | Framework | Key Features |
|---------|------------|-----------|--------------|
| **Radix UI** | 32+ | React | Unstyled, `asChild` composition, comprehensive |
| **React Aria** | 40+ | React | Adobe, hooks-based, extensive i18n |
| **Headless UI** | 10 | React, Vue | Tailwind-optimized, minimal |
| **Ark UI** | 37 | React, Vue, Solid | State machines, full accessibility |

**Example Missing Pattern (Focus Trap):**
```tsx
import * as Dialog from '@radix-ui/react-dialog';

function Modal({ open, onClose }) {
  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content aria-describedby="modal-desc">
          <Dialog.Title>Assessment Complete</Dialog.Title>
          {/* Radix automatically handles:
              - Focus trap (Tab/Shift+Tab cycles within modal)
              - Escape to close
              - aria-modal, role="dialog"
              - Focus restoration on close
              - Scroll locking */}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
```

**Why This Matters:**
- **Legal compliance:** Enterprise SaaS procurement requires WCAG 2.2 AA
- **Security:** WCAG 3.3.8 affects authentication UX (no CAPTCHA allowed)
- **Quality:** Headless libraries prevent reinventing accessibility wheels
- **Maintenance:** Focus trap bugs are common when building from scratch

---

### D. Performance Optimization (CRITICAL GAP)

**Current State:** No performance guidance in design system output

**Missing Patterns:**

#### 1. Bundle Splitting Configuration
```json
{
  "name": "@company/design-system",
  "sideEffects": ["**/*.css"],
  "exports": {
    ".": { "import": "./dist/index.js" },
    "./button": { "import": "./dist/button/index.js" },
    "./modal": { "import": "./dist/modal/index.js" }
  }
}
```

**Impact:** Without per-component exports, consuming apps bundle entire design system (300KB+) vs needed components (50KB)

#### 2. Icon Optimization

| Method | Bundle Size | Performance | Recommendation |
|--------|-------------|-------------|----------------|
| React Icon Components | 300-400KB | Poor (JS parsing) | ❌ Avoid |
| SVG Sprites | ~5KB total | Excellent (cached) | ✅ Use (70-90% reduction) |
| Icon Fonts | ~50KB | Good | ⚠️ Legacy fallback |

**Example SVG Sprite Pattern:**
```tsx
// Icon component using sprites (70-90% size reduction)
export const Icon = ({ name, size = 24 }) => (
  <svg width={size} height={size} aria-hidden="true">
    <use href={`/icons/sprite.svg#${name}`} />
  </svg>
);
```

#### 3. Font Optimization
```css
@font-face {
  font-family: 'Design System';
  src: url('/fonts/variable.woff2') format('woff2');
  font-display: swap; /* Prevent flash of invisible text */
  font-weight: 100 900; /* Variable font reduces requests */
  unicode-range: U+0000-00FF; /* Subset to Latin only */
}
```

**Why This Matters:**
- **UX:** 300KB vs 50KB = 2.5 seconds load time difference on 3G
- **Costs:** 70% size reduction = 70% CDN bandwidth savings
- **Core Web Vitals:** Affects LCP, FID, CLS scores (SEO ranking factor)

---

### E. Component Architecture (HIGH GAP)

**Current State:**
- Lists component states (default, hover, error, loading)
- Provides journey-specific examples
- Decision trees for reusable vs inline components

**Missing Composition Patterns:**

#### 1. Compound Components (React)
```tsx
const SelectContext = createContext<SelectContextValue>(null);

function Select({ children, value, onChange }) {
  return (
    <SelectContext.Provider value={{ value, onChange }}>
      <div role="listbox">{children}</div>
    </SelectContext.Provider>
  );
}

function Option({ value, children }) {
  const { value: selected, onChange } = useContext(SelectContext);
  return (
    <div role="option" aria-selected={value === selected}>
      {children}
    </div>
  );
}

Select.Option = Option;

// Usage (Journey Step 2 - Framework Selector)
<Select value={frameworks} onChange={setFrameworks}>
  <Select.Option value="soc2">SOC 2</Select.Option>
</Select>
```

#### 2. Type-Safe Variants (CVA)
```typescript
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md',
  {
    variants: {
      intent: {
        primary: 'bg-blue-600 text-white',
        secondary: 'bg-gray-100 text-gray-900',
      },
      size: { sm: 'h-8 px-3', md: 'h-10 px-4' },
    },
    defaultVariants: { intent: 'primary', size: 'md' },
  }
);

type ButtonProps = VariantProps<typeof buttonVariants>;
```

#### 3. Polymorphic Components (asChild)
```tsx
import { Slot } from '@radix-ui/react-slot';

const Button = ({ asChild, ...props }: ButtonProps) => {
  const Comp = asChild ? Slot : 'button';
  return <Comp {...props} />;
};

// Usage - render as anchor with button styles
<Button asChild>
  <a href="/home">Go Home</a>
</Button>
```

**Why This Matters:**
- **DX:** Session 12 (scaffold) can't generate proper component architecture
- **Type safety:** CVA provides compile-time variant validation
- **Flexibility:** Polymorphic components prevent prop-drilling and wrapper hell

---

### F. Documentation & Versioning (HIGH GAP)

**Current State:** No documentation or versioning guidance

**Missing Documentation Tooling:**

| Tool | Version | Best For | Key Features |
|------|---------|----------|--------------|
| **Storybook 10** | 10.1.11 | Component libraries | ESM-only (29% smaller), native Vitest |
| **Docusaurus** | 3.9.2 | Full docs sites | AI search, versioning, MDX |
| **Ladle** | v3 | React performance | 4x faster than Storybook |
| **Histoire** | 1.0.0-beta | Vue/Svelte | Vite-native |

**Example Storybook Configuration:**
```typescript
// Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';

const meta: Meta<typeof Button> = {
  component: Button,
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary'] },
  },
};

export const JourneyStep1Upload: Story = {
  args: { variant: 'primary', size: 'lg', children: 'Upload Document' },
  parameters: {
    docs: {
      description: {
        story: 'Primary CTA for Journey Step 1 - Document Upload'
      }
    }
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button'));
    await expect(canvas.getByRole('button')).toHaveFocus();
  },
};
```

**Missing Versioning Strategy:**

| Change Type | Version Bump | Examples |
|-------------|--------------|----------|
| **API Breaking** | MAJOR | Remove props, rename components |
| **Visual Breaking** | MAJOR | Typography affecting layout, spacing changes |
| **New Features** | MINOR | New components, new optional props |
| **Deprecations** | MINOR | Mark deprecated (with warnings) |
| **Bug Fixes** | PATCH | Fix defects, improve performance |

**Missing Migration Pattern:**
```javascript
// Codemod for prop migrations
export default function transformer(file, api) {
  const j = api.jscodeshift;

  return j(file.source)
    .find(j.JSXAttribute, { name: { name: 'isDisabled' } })
    .replaceWith(path =>
      j.jsxAttribute(j.jsxIdentifier('disabled'), path.node.value)
    )
    .toSource();
}

// Run: npx jscodeshift -t transforms/v2-migrate.js src/
```

**Why This Matters:**
- **Adoption:** Design systems without docs have <30% team adoption
- **Testing:** Visual regression testing prevents unintended changes
- **Evolution:** Design systems need versioning for long-term maintainability
- **Migration:** Codemods reduce breaking change friction (see Material UI, Ant Design)

---

## Proposed Solution

### Phase 1: Critical Foundation (Week 1-2) - MUST HAVE

#### 1.1 Add Design Token Hierarchy

**Files:** `.claude/commands/create-design.md`, `/templates/06-design-system-template.md`

**Changes:**
- Update Step 4 to generate DTCG-formatted tokens
- Three-tier hierarchy: primitive → semantic → component
- Style Dictionary v4 configuration
- Figma Variables integration (Tokens Studio)

**Output Structure:**
```markdown
## Design Tokens (DTCG Format)

### Primitive Tokens
{
  "color": { "primitive": { "blue": { "500": { "$value": "#0066cc" } } } },
  "space": { "primitive": { "4": { "$value": "16px" } } }
}

### Semantic Tokens
{
  "color": { "semantic": { "action": { "primary": { "$value": "{color.primitive.blue.500}" } } } }
}

### Component Tokens
{
  "button": { "background": { "primary": { "$value": "{color.semantic.action.primary}" } } }
}

### Journey Mapping
- Step 1 (Upload): Uses `color.action.primary` for primary CTA
- Step 2 (Selection): Uses `color.semantic.selected` for framework cards
```

**Validation:**
- [ ] Three token tiers generated
- [ ] All colors/spacing reference tokens (no inline hex values)
- [ ] Journey mapping documents semantic token usage
- [ ] Style Dictionary config included

---

#### 1.2 Update CSS Architecture (2025 Standards)

**Files:** `.claude/commands/create-design.md`

**Changes:**
- Mark styled-components as **MAINTENANCE MODE** with warning
- Add Tailwind CSS v4, Panda CSS, Vanilla Extract as primary options
- Include decision tree based on tech stack
- Add CSS custom properties theming pattern with FOIT prevention
- Document performance implications (runtime vs zero-runtime)

**Decision Tree:**
```
Read 02-tech-stack.md for frontend framework
├─ React + velocity focus → Tailwind CSS v4 (5x faster builds)
├─ React + type safety → Panda CSS (zero runtime, Chakra-like DX)
├─ TypeScript-first → Vanilla Extract (compile-time safety)
└─ Legacy CSS-in-JS → Emotion (with migration plan to zero-runtime)
```

**Theming Pattern:**
```css
:root {
  --color-bg: #ffffff;
  --color-text: #1a1a1a;
}

[data-theme="dark"] {
  --color-bg: #1a1a1a;
  --color-text: #f0f0f0;
}

/* Prevent flash of incorrect theme */
<script>
  const saved = localStorage.getItem('theme');
  if (saved) document.documentElement.setAttribute('data-theme', saved);
</script>
```

**Validation:**
- [ ] styled-components shows deprecation warning
- [ ] Zero-runtime options recommended first
- [ ] Theming pattern includes FOIT prevention
- [ ] Performance comparison table included

---

#### 1.3 Add WCAG 2.2 Compliance

**Files:** `.claude/commands/create-design.md`, `/templates/06-design-system-template.md`

**Changes:**
- Add WCAG 2.2 new success criteria section after existing accessibility
- Document 2.5.8 (Target Size), 2.4.11 (Focus Not Obscured), 3.3.8 (Accessible Authentication)
- Map requirements to journey steps
- Add validation checklist

**Output:**
```markdown
### WCAG 2.2 New Success Criteria (October 2023)

**2.5.8 Target Size (Minimum) - Level AA**
- **Requirement**: All touch targets minimum 24×24px
- **Journey Application**:
  - Step 1 upload buttons: 48×48px (exceeds minimum)
  - Step 2 framework checkboxes: 24×24px (meets minimum)
  - Step 4 filter buttons: 32×32px (exceeds minimum)
- **Mobile**: Increase to 44×44px for thumb-friendly zones

**2.4.11 Focus Not Obscured (Minimum) - Level AA**
- **Requirement**: Focused element must be partially visible
- **Implementation**:
  - Sticky headers can't obscure focused elements
  - Scroll focused elements into view during keyboard navigation
  - Test with browser zoom at 200%

**2.3.8 Accessible Authentication - Level AA**
- **Requirement**: No cognitive function tests (CAPTCHA, puzzle)
- **Alternative**: WebAuthn, OAuth, magic links
- **Journey Impact**: If auth required in Step 1, use passwordless

**Validation Checklist:**
- [ ] All interactive elements ≥24×24px
- [ ] Focus indicators never hidden by sticky/fixed elements
- [ ] Authentication doesn't require CAPTCHA/puzzle
```

**Validation:**
- [ ] Three new success criteria documented
- [ ] Journey-specific examples included
- [ ] Validation checklist updated
- [ ] Template includes 2.2 requirements

---

#### 1.4 Add Performance Optimization Strategy

**Files:** `.claude/commands/create-design.md`, `/templates/06-design-system-template.md`

**Changes:**
- Add new Step 10: Performance Optimization Strategy
- Include bundle splitting config (`sideEffects`, per-component exports)
- Add icon optimization decision matrix
- Include font optimization (variable fonts, unicode-range, font-display)
- Add journey-specific performance analysis

**Output:**
```markdown
### Step 10: Performance Optimization Strategy

**Bundle Splitting** (for design system package):
```json
{
  "name": "@company/design-system",
  "sideEffects": ["**/*.css"],
  "exports": {
    ".": { "import": "./dist/index.js" },
    "./button": { "import": "./dist/button/index.js" },
    "./modal": { "import": "./dist/modal/index.js" }
  }
}
```

**Icon Optimization Decision:**

| Method | Bundle Size | Performance | Recommendation |
|--------|-------------|-------------|----------------|
| React Icon Components | 300-400KB | Poor | ❌ Avoid |
| SVG Sprites | ~5KB | Excellent | ✅ Use (70-90% reduction) |
| Icon Fonts | ~50KB | Good | ⚠️ Legacy fallback |

**SVG Sprite Implementation:**
```tsx
export const Icon = ({ name, size = 24 }) => (
  <svg width={size} height={size} aria-hidden="true">
    <use href={`/icons/sprite.svg#${name}`} />
  </svg>
);
```

**Font Optimization:**
```css
@font-face {
  font-family: 'Design System';
  src: url('/fonts/variable.woff2') format('woff2');
  font-display: swap;
  font-weight: 100 900;
  unicode-range: U+0000-00FF;
}
```

**Journey Impact Analysis:**
- Step 1 (Upload): Optimize file preview thumbnails
- Step 3 (Processing): Skeleton screens reduce perceived wait
- Step 4 (Results): Virtualization if >100 rows

**Performance Budget:**
- CSS: <50KB compressed
- JavaScript: <100KB compressed
- Fonts: <100KB total
- Icons: <10KB (SVG sprites)
```

**Validation:**
- [ ] Bundle splitting config included
- [ ] Icon optimization shows 70-90% reduction
- [ ] Font optimization pattern included
- [ ] Journey-specific performance analysis

---

### Phase 2: Component Architecture (Week 3) - SHOULD HAVE

#### 2.1 Add Component Composition Patterns

**Files:** `.claude/commands/create-design.md`

**Changes:**
- Add new Step 5b: Component Composition Patterns
- Read `02-tech-stack.md` to determine framework
- Add framework-specific patterns:
  - React: Compound Components, CVA for variants, asChild polymorphism
  - Vue: Composables pattern
  - Angular: Service-based composition
- Map composition patterns to journey components

**Example Output:**
```markdown
### Step 5b: Component Composition Patterns

**React - Compound Components:**
```tsx
const SelectContext = createContext<SelectContextValue>(null);

function Select({ children, value, onChange }) {
  return (
    <SelectContext.Provider value={{ value, onChange }}>
      {children}
    </SelectContext.Provider>
  );
}

Select.Option = Option;

// Usage (Journey Step 2 - Framework Selector)
<Select value={frameworks} onChange={setFrameworks}>
  <Select.Option value="soc2">SOC 2</Select.Option>
</Select>
```

**Type-Safe Variants (CVA):**
```typescript
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva('base-styles', {
  variants: {
    intent: { primary: 'bg-blue-600', secondary: 'bg-gray-100' },
    size: { sm: 'h-8', md: 'h-10' },
  },
  defaultVariants: { intent: 'primary', size: 'md' },
});
```

**Journey Application:**
- Step 1 Upload: Polymorphic Button (can render as `<a>` for "Choose file")
- Step 2 Selector: Compound Select component
- Step 4 Results: CVA variants for card states (collapsed, expanded, with-actions)
```

**Validation:**
- [ ] Framework-specific patterns based on tech stack
- [ ] CVA type-safety examples included
- [ ] Patterns mapped to journey components

---

#### 2.2 Add Headless Accessibility Libraries

**Files:** `.claude/commands/create-design.md`

**Changes:**
- Add headless library recommendations to Step 7 (Accessibility)
- Include decision tree: React + Tailwind → Headless UI, React custom → Radix UI, etc.
- Add library comparison table
- Show integration examples for journey components (Dialog, Menu, Tabs)
- Include ARIA patterns by component type

**Example Output:**
```markdown
### Headless Accessibility Libraries

| Library | Components | Framework | Recommendation |
|---------|------------|-----------|----------------|
| **Radix UI** | 32+ | React | Most flexible, `asChild` composition |
| **React Aria** | 40+ | React | Adobe, comprehensive i18n |
| **Headless UI** | 10 | React, Vue | Tailwind-optimized |
| **Ark UI** | 37 | React, Vue, Solid | State machines |

**Decision Tree:**
```
Read 02-tech-stack.md for frontend framework
├─ React + Tailwind → Headless UI
├─ React + custom styling → Radix UI
├─ React + i18n required → React Aria
└─ Vue → Headless UI Vue or Ark UI
```

**Example Integration (Radix Dialog):**
```tsx
import * as Dialog from '@radix-ui/react-dialog';

function AssessmentModal({ open, onClose }) {
  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content>
          <Dialog.Title>Assessment Complete</Dialog.Title>
          {/* Auto-handles: focus trap, Esc, aria-modal, scroll lock */}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
```

**ARIA Patterns by Component:**

| Component | Radix Primitive | Auto-Handled |
|-----------|----------------|--------------|
| Dialog | `@radix-ui/react-dialog` | Focus trap, Esc, aria-modal |
| Menu | `@radix-ui/react-dropdown-menu` | Arrow keys, aria-expanded |
| Tabs | `@radix-ui/react-tabs` | Arrow keys, aria-selected |
```

**Validation:**
- [ ] Library recommendation aligns with tech stack
- [ ] Integration examples for journey components
- [ ] ARIA patterns table included

---

#### 2.3 Add Documentation Tooling

**Files:** `.claude/commands/create-design.md`, `/templates/06-design-system-template.md`

**Changes:**
- Add new Step 11: Documentation & Tooling Strategy
- Include tool comparison (Storybook 10, Docusaurus, Ladle, Histoire)
- Add decision tree based on framework
- Include Storybook config with journey-mapped stories
- Add visual regression testing pattern (Playwright)

**Example Output:**
```markdown
### Step 11: Documentation & Tooling Strategy

**Tool Selection:**

| Tool | Best For | Key Features |
|------|---------|--------------|
| **Storybook 10** | Component libraries | ESM-only (29% smaller), native Vitest |
| **Docusaurus** | Full docs sites | AI search, versioning |
| **Ladle** | React performance | 4x faster than Storybook |
| **Histoire** | Vue/Svelte | Vite-native |

**Decision Tree:**
```
Read 02-tech-stack.md
├─ React → Storybook 10 OR Ladle (performance)
├─ Vue/Svelte → Histoire
└─ Docs site needed → Docusaurus + Storybook
```

**Storybook Configuration:**
```typescript
// Button.stories.tsx
export const JourneyStep1Upload: Story = {
  args: { variant: 'primary', size: 'lg', children: 'Upload Document' },
  parameters: {
    docs: {
      description: {
        story: 'Journey Step 1 - Document Upload. Large size for visibility.'
      }
    }
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button'));
    await expect(canvas.getByRole('button')).toHaveFocus();
  },
};
```

**Visual Regression Testing:**
```typescript
import { test, expect } from '@playwright/test';

test('button visual - journey step 1', async ({ page }) => {
  await page.goto('/storybook/iframe.html?id=button--journey-step-1');
  await expect(page.locator('.button')).toHaveScreenshot('upload-btn.png');
});
```
```

**Validation:**
- [ ] Tool recommendation based on framework
- [ ] Journey-mapped stories included
- [ ] Visual regression testing pattern

---

### Phase 3: Evolution & Maintenance (Week 4) - NICE TO HAVE

#### 3.1 Add Versioning & Migration Strategy

**Files:** `/templates/06-design-system-template.md`

**Changes:**
- Add new section: Versioning & Migration Strategy
- Document semantic versioning for design systems
- Include 6-month deprecation timeline
- Add codemod example
- Include deprecation pattern

**Example Output:**
```markdown
## Versioning & Migration Strategy

**Semantic Versioning:**

| Change Type | Version Bump | Examples |
|-------------|--------------|----------|
| **API Breaking** | MAJOR | Remove props, rename components |
| **Visual Breaking** | MAJOR | Typography affecting layout |
| **New Features** | MINOR | New components, optional props |
| **Deprecations** | MINOR | Mark deprecated (with warnings) |
| **Bug Fixes** | PATCH | Fix defects, improve performance |

**Deprecation Timeline (6-month standard):**
1. **Month 0**: Announce, add warnings, publish codemods
2. **Month 3**: Warnings become errors in dev
3. **Month 6**: Remove in next major

**Codemod Example:**
```javascript
// transforms/v2-migrate.js
export default function transformer(file, api) {
  const j = api.jscodeshift;
  return j(file.source)
    .find(j.JSXAttribute, { name: { name: 'isDisabled' } })
    .replaceWith(path =>
      j.jsxAttribute(j.jsxIdentifier('disabled'), path.node.value)
    )
    .toSource();
}
```
```

**Validation:**
- [ ] Semantic versioning includes visual breaking changes
- [ ] 6-month deprecation timeline
- [ ] Codemod example included

---

#### 3.2 Strengthen Behavioral Profile Integration

**Files:** `.claude/commands/create-design.md`

**Changes:**
- Add new Step 3b: Behavioral Profile → Design Decisions
- Map behavioral characteristics to design choices:
  - Tech proficiency → information density
  - Device preference → responsive strategy
  - Visual processing → typography scale
  - Learning style → onboarding patterns
  - Trust requirements → design personality

**Example Output:**
```markdown
### Step 3b: Behavioral Profile → Design Decisions

**Tech Proficiency → Information Density:**
- **Power users**: Tight spacing (`space-2`), keyboard shortcuts
- **Casual users**: Generous spacing (`space-4`), touch-friendly

**Device Preference → Responsive Strategy:**
- **Mobile-primary**: Mobile-first breakpoints, 44×44px touch targets
- **Desktop-primary**: Desktop-first, multi-column layouts
- **Tablet-primary**: Hybrid approach at 768px

**Visual Processing → Typography Scale:**
- **Fast scanners**: High contrast scale (1.333+), bold headings
- **Deliberate readers**: Moderate scale (1.250), serif fonts

**Example Mapping:**
```
Behavioral Profile (Session 1):
- Tech Proficiency: High (compliance officers, enterprise tools)
- Device: Desktop-primary (75% desktop, 25% tablet)
- Visual Processing: Fast scanners (hundreds of documents)

Design Decisions:
- Spacing: Tight scale (space-2 default) for density
- Responsive: Desktop-first, tablet optimization
- Typography: High contrast (1.333), bold headings
- Colors: Blues (trust), 4.5:1 minimum contrast
```
```

**Validation:**
- [ ] Behavioral profile loaded from Session 1
- [ ] Design decisions trace to profile characteristics
- [ ] Example mapping included

---

## Success Criteria

### Phase 1 (Critical) - MUST COMPLETE
- [ ] Design system outputs include DTCG-formatted tokens (3 tiers)
- [ ] CSS architecture recommendations current as of 2025
- [ ] WCAG 2.2 success criteria documented with journey examples
- [ ] Performance optimization section with bundle/icon/font strategies
- [ ] Session 12 (scaffold) can generate token config files
- [ ] `/validate-outputs` checks for new sections

### Phase 2 (High Priority) - SHOULD COMPLETE
- [ ] Component composition patterns based on tech stack
- [ ] Headless accessibility library recommendations
- [ ] Documentation tooling strategy with journey-mapped stories
- [ ] Session 12 generates component skeletons with CVA variants
- [ ] Session 12 includes accessibility library dependencies

### Phase 3 (Nice to Have) - MAY COMPLETE
- [ ] Versioning strategy with codemods
- [ ] Behavioral profile mapped to design decisions
- [ ] Cross-platform consistency guidance (if multi-platform)

### Quality Gates
- [ ] Run `/create-design` on compliance SaaS example → all new sections present
- [ ] Context file (`.ctx.md`) preserves critical design decisions
- [ ] Token reduction 60-70% for context file
- [ ] Session 12 scaffold integration validated
- [ ] Three example design systems created (B2B SaaS, Consumer Mobile, Enterprise)

---

## Testing Plan

### Unit Testing (Per Phase)

**Phase 1:**
1. Run `/create-design` with example journey (compliance SaaS)
2. Verify output includes:
   - Design Tokens section with DTCG format
   - CSS Architecture with zero-runtime recommendations
   - WCAG 2.2 section with 3 new success criteria
   - Performance Optimization with bundle splitting
3. Check `.ctx.md` file generation preserves tokens
4. Validate token reduction (60-70%)

**Phase 2:**
1. Test with React tech stack → verify Compound Components pattern
2. Test with Vue tech stack → verify Composables pattern
3. Verify headless library recommendation aligns with tech stack
4. Check Storybook config includes journey-mapped stories

**Phase 3:**
1. Verify versioning section in template
2. Check behavioral profile from Session 1 loaded
3. Confirm design decisions trace to profile

---

### Integration Testing (End-to-End)

**Test Case 1: Complete Cascade (Sessions 1-12)**
1. Run Sessions 1-6 with test journey (compliance SaaS)
2. Verify Session 6 output complete with all new sections
3. Run Session 12 (scaffold)
4. Verify scaffold generates:
   - Token config file (`tailwind.config.ts` or `panda.config.ts`)
   - Component skeletons with CVA variants
   - Accessibility library imports (`@radix-ui/react-dialog`)
   - Storybook configuration (if recommended)

**Test Case 2: Different Tech Stacks**
1. React + Tailwind → Verify Tailwind v4, Headless UI, Storybook
2. React + Custom → Verify Panda CSS, Radix UI, Storybook
3. Vue + Vite → Verify Panda CSS, Headless UI Vue, Histoire

**Test Case 3: Different Journey Types**
1. B2B SaaS (desktop, power users) → Tight spacing, Radix UI, Storybook
2. Consumer Mobile (mobile-first, casual) → Generous spacing, React Aria, Ladle
3. Enterprise Dashboard (desktop-only, technical) → Minimal spacing, Vanilla Extract, Storybook + Chromatic

---

### Validation Testing

**Run `/validate-outputs` after Session 6:**
- [ ] Design token hierarchy present? (primitive → semantic → component)
- [ ] CSS architecture matches 2025 standards? (zero-runtime)
- [ ] WCAG 2.2 success criteria included?
- [ ] Performance optimization strategy defined?
- [ ] Component composition patterns specified?
- [ ] Headless library recommendation aligns with tech stack?
- [ ] Documentation tooling strategy included?

---

## Example Outputs

### Before (Current State)
```markdown
## Color System

**Primary Blue**: #0066cc (Trust-focused brand personality)
**Success Green**: #059669
**Error Red**: #dc2626

## CSS Architecture

**Decision**: Tailwind CSS
- Rationale: Fast iteration
- Trade-off: Utility class proliferation
```

### After (Phase 1 Complete)
```markdown
## Design Tokens (DTCG Format)

### Primitive Tokens
```json
{
  "color": {
    "primitive": {
      "blue": { "500": { "$value": "#0066cc", "$type": "color" } },
      "green": { "500": { "$value": "#059669", "$type": "color" } },
      "red": { "500": { "$value": "#dc2626", "$type": "color" } }
    }
  }
}
```

### Semantic Tokens
```json
{
  "color": {
    "semantic": {
      "action": {
        "primary": {
          "$value": "{color.primitive.blue.500}",
          "$description": "Primary action - blue conveys trust for compliance data"
        }
      },
      "feedback": {
        "success": { "$value": "{color.primitive.green.500}" },
        "error": { "$value": "{color.primitive.red.500}" }
      }
    }
  }
}
```

### Component Tokens
```json
{
  "button": {
    "background": {
      "primary": { "$value": "{color.semantic.action.primary}" }
    }
  }
}
```

### Journey Mapping
- Step 1 (Upload): Uses `color.action.primary` for upload button
- Step 3 (Processing): Uses `color.feedback.success` for completion
- Step 4 (Results): Uses `color.feedback.error` for gap highlights

## CSS Architecture (2025 Standards)

**Decision**: Tailwind CSS v4

**Rationale:**
- Fast iteration (5x faster builds vs v3)
- Design tokens via theme config (DTCG integration)
- Zero runtime (no JS overhead, better Core Web Vitals)
- Team familiar with utility-first

**Why NOT styled-components:**
- ❌ Entered maintenance mode March 2025
- Runtime overhead (20-30KB + parsing)
- Slower hydration in SSR

**Configuration:**
```css
@theme {
  --color-action-primary: {color.primitive.blue.500};
  --space-component-padding: {space.primitive.2};
}
```

**Theming:**
```css
:root {
  --color-bg: #ffffff;
  --color-text: #1a1a1a;
}

[data-theme="dark"] {
  --color-bg: #1a1a1a;
  --color-text: #f0f0f0;
}

/* Prevent flash of incorrect theme */
<script>
  const saved = localStorage.getItem('theme');
  if (saved) document.documentElement.setAttribute('data-theme', saved);
</script>
```

## WCAG 2.2 Compliance (October 2023)

**2.5.8 Target Size (Minimum) - Level AA**
- All touch targets minimum 24×24px
- Journey application:
  - Step 1 upload button: 48×48px ✓
  - Step 2 framework checkboxes: 24×24px ✓
  - Step 4 filter buttons: 32×32px ✓
- Mobile: 44×44px for thumb-friendly zones

**2.4.11 Focus Not Obscured (Minimum) - Level AA**
- Focused element must be partially visible
- Sticky headers won't obscure focused elements
- Scroll focused elements into view during keyboard nav

**2.3.8 Accessible Authentication - Level AA**
- No CAPTCHA/puzzle for login
- Use WebAuthn, OAuth, magic links

## Performance Optimization

**Bundle Splitting:**
```json
{
  "sideEffects": ["**/*.css"],
  "exports": {
    "./button": { "import": "./dist/button/index.js" }
  }
}
```

**Icon Strategy:** SVG Sprites (70% size reduction)
- 15 icons needed → 5KB sprite vs 60KB React components

**Font Strategy:**
```css
@font-face {
  font-family: 'Inter';
  src: url('/fonts/inter-variable.woff2') format('woff2');
  font-display: swap;
  font-weight: 100 900;
  unicode-range: U+0000-00FF;
}
```

**Performance Budget:**
- CSS: <40KB compressed
- JavaScript: <80KB compressed
- Fonts: <100KB total
- Icons: <10KB
```

---

## Implementation Roadmap

### Week 1-2: Phase 1 (Critical Foundation)
- [ ] Day 1-2: Design token hierarchy (Task 1.1)
- [ ] Day 3-4: CSS architecture update (Task 1.2)
- [ ] Day 5-6: WCAG 2.2 compliance (Task 1.3)
- [ ] Day 7-8: Performance optimization (Task 1.4)
- [ ] Day 9-10: Integration testing with Session 12

### Week 3: Phase 2 (Component Architecture)
- [ ] Day 1-2: Component composition patterns (Task 2.1)
- [ ] Day 3-4: Headless accessibility libraries (Task 2.2)
- [ ] Day 5-7: Documentation tooling (Task 2.3)

### Week 4: Phase 3 (Evolution & Maintenance)
- [ ] Day 1-2: Versioning strategy (Task 3.1)
- [ ] Day 3-4: Behavioral profile integration (Task 3.2)
- [ ] Day 5: Cross-platform guidance (optional)

### Week 5: Testing & Documentation
- [ ] Day 1-2: End-to-end cascade testing
- [ ] Day 3-4: Create three example design systems
- [ ] Day 5: Update CLAUDE.md, COMMAND-REFERENCE.md

---

## References

### Industry Standards
- **W3C Design Tokens Community Group** v2025.10 - DTCG format specification
- **WCAG 2.2** (October 2023) - Web Content Accessibility Guidelines
- **Material Design 3** (Google) - Token architecture, component patterns
- **IBM Carbon Design System** - Design token hierarchy, versioning
- **Shopify Polaris** - Component composition, accessibility

### Tools & Libraries
- **Style Dictionary v4** - Token transformation
- **Tailwind CSS v4** - Zero-runtime utility-first CSS
- **Panda CSS** - Zero-runtime type-safe styling
- **Vanilla Extract** - TypeScript-first CSS
- **Radix UI** - Headless accessible React components
- **React Aria** (Adobe) - Accessible component hooks
- **Storybook 10** - Component documentation
- **Class Variance Authority (CVA)** - Type-safe variant management

### Reference Material
- `/reference-material/design-system-engineering.md` - Comprehensive best practices guide
- Stack-Driven Session 3 - Tech stack selection (influences CSS architecture)
- Stack-Driven Session 12 - Scaffold generation (consumes design system)

---

## Questions for Discussion

1. **Scope**: Should Phase 3 (versioning, behavioral profile) be included in initial PR or separate follow-up?
2. **Examples**: Should we create three full example design systems immediately or add incrementally?
3. **Backward Compatibility**: Should we update existing example outputs or only apply to new generations?
4. **Template Split**: Should we split `/templates/06-design-system-template.md` into multiple files (tokens, components, accessibility) for maintainability?
5. **Session 12 Integration**: Does Session 12 need simultaneous updates to consume new design system structure?

---

## Related Issues

- None currently (this is the first comprehensive design system validation)

**Potential Follow-ups:**
- Session 12 (scaffold) enhancement to consume DTCG tokens
- Session 3 (tech-stack) alignment with CSS architecture recommendations
- `/validate-outputs` enhancement to check design system quality

---

## Labels

- `enhancement` - Adding new functionality
- `design-system` - Relates to design system generation
- `session-6` - Affects Session 6 (create-design)
- `session-12` - Affects Session 12 (scaffold)
- `critical` - Phase 1 tasks are critical for production readiness
- `documentation` - Requires docs updates (CLAUDE.md, COMMAND-REFERENCE.md)
- `validation` - Affects validation framework

---

## Assignees

TBD based on maintainer availability

---

**Estimated Effort:** 4-5 weeks (1 developer)
- Phase 1: 10 days (critical)
- Phase 2: 7 days (high priority)
- Phase 3: 5 days (nice to have)
- Testing & docs: 5 days

**Risk Level:** Medium
- Changes affect core Session 6 output structure
- Session 12 integration dependency
- Requires comprehensive testing with different tech stacks

**User Impact:** High
- Improves production-readiness of generated design systems
- Aligns with 2025 industry standards
- Enhances Session 12 scaffold quality
- Reduces post-cascade manual retrofitting
