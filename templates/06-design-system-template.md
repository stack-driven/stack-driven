# Design System: [Your Product Name]

> **Derived from**: product-guidelines/00-user-journey.md (user context informs brand personality)

---

## Design Philosophy

[Core design philosophy based on user context and journey]

---

## Brand Personality (Derived from Journey Context)

**Primary Attributes**:
1. [Attribute 1]: [Why, based on user context]
2. [Attribute 2]: [Why, based on user context]
3. [Attribute 3]: [Why, based on user context]

**NOT**:
- [x] [Anti-attribute]: [Why this doesn't fit journey]

---

## Color System

### Primary Palette

**Primary [Color]** ([Why this color]):
- [Shade]-[Number]: [Hex] ([Usage])
- [Shade]-[Number]: [Hex] ([Usage])

**Semantic Colors**:
- success-[Number]: [Hex] ([Usage])
- warning-[Number]: [Hex] ([Usage])
- error-[Number]: [Hex] ([Usage])

**Rationale**: [Why these colors fit the user context]

---

## Design Tokens (DTCG Format)

> **W3C Design Tokens Community Group standard for multi-platform design systems**

### Primitive Tokens (Raw Values)

```json
{
  "color": {
    "primitive": {
      "[hue]": {
        "[scale]": { "$value": "[hex]", "$type": "color" }
      }
    }
  },
  "space": {
    "primitive": {
      "[n]": { "$value": "[px]", "$type": "dimension" }
    }
  }
}
```

**Example**:
```json
{
  "color": {
    "primitive": {
      "blue": {
        "500": { "$value": "#0066cc", "$type": "color" },
        "600": { "$value": "#0052a3", "$type": "color" }
      },
      "gray": {
        "100": { "$value": "#f7f7f7", "$type": "color" },
        "900": { "$value": "#1a1a1a", "$type": "color" }
      }
    }
  },
  "space": {
    "primitive": {
      "4": { "$value": "16px", "$type": "dimension" },
      "6": { "$value": "32px", "$type": "dimension" }
    }
  }
}
```

### Semantic Tokens (Purpose-Based)

```json
{
  "color": {
    "semantic": {
      "action": {
        "primary": {
          "$value": "{color.primitive.blue.500}",
          "$description": "[Journey context - e.g., 'Primary action for journey-critical CTAs']"
        }
      },
      "status": {
        "success": {
          "$value": "{color.primitive.green.500}",
          "$description": "[Journey context]"
        }
      }
    }
  },
  "layout": {
    "section": {
      "$value": "{space.primitive.6}",
      "$description": "[Journey context - e.g., 'Spacing between journey steps']"
    }
  }
}
```

### Component Tokens (Component-Specific)

```json
{
  "button": {
    "background": {
      "primary": { "$value": "{color.semantic.action.primary}" }
    },
    "padding": {
      "default": { "$value": "{space.primitive.4}" }
    }
  },
  "upload": {
    "border": {
      "default": { "$value": "{color.semantic.interactive.idle}" },
      "active": { "$value": "{color.semantic.action.primary}" }
    }
  }
}
```

### Journey Token Mapping

| Journey Step | Semantic Tokens Used | Component Tokens | Rationale |
|--------------|---------------------|------------------|-----------|
| [Step 1] | [action.primary, status.idle] | [button.background.primary, upload.border.default] | [Why these tokens serve this step] |
| [Step 2] | [action.selected, interactive.hover] | [card.border.selected, checkbox.background.checked] | [Why these tokens serve this step] |
| [Step 3] | [status.processing, feedback.info] | [progress.fill, spinner.color] | [Why these tokens serve this step] |
| [Step 4] | [status.success, status.warning] | [card.background.success, badge.color.warning] | [Why these tokens serve this step] |

### Style Dictionary Configuration

```javascript
// style-dictionary.config.js
module.exports = {
  source: ['tokens/**/*.json'],
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: 'dist/css/',
      files: [{
        destination: 'variables.css',
        format: 'css/variables'
      }]
    },
    tailwind: {
      transformGroup: 'js',
      buildPath: 'dist/',
      files: [{
        destination: 'tailwind-tokens.js',
        format: 'javascript/module'
      }]
    }
  }
};
```

**Validation Criteria**:
- [✓] Excellent: Three token tiers present (primitive/semantic/component); no inline hex values in component tokens; journey mapping documents which tokens serve which steps; Style Dictionary config for platform transforms
- (Warning) Needs Work: Missing token tiers; inline hex values in components; no journey mapping; no transformation config

---

## Typography

### Font Families

**Primary Font**: [Font name]
- [Why chosen based on user context]

**Monospace** (if needed): [Font name]
- [Usage]

**Rationale**: [Why this typography system]

### Type Scale

[Include relevant type scale for your product]

---

## Spacing & Layout System

**Base Unit**: [Value] (e.g., 8px, 4px)
**Rationale**: [Why this base unit serves the user journey - e.g., "8px base unit supports dense information layout needed for compliance officers scanning multiple documents (Journey Step 2)"]

### Spacing Scale

| Token | Value | Usage | Journey Context |
|-------|-------|-------|-----------------|
| xs | [4px] | [Tight spacing within components] | [Where users need compact information] |
| sm | [8px] | [Default component padding] | [Standard interaction spacing] |
| md | [16px] | [Section spacing] | [Visual grouping for journey steps] |
| lg | [24px] | [Major sections] | [Clear separation between journey phases] |
| xl | [32px] | [Page-level spacing] | [Top-level navigation and organization] |
| 2xl | [48px] | [Hero/landing sections] | [First impression, entry points] |

### Grid System

**Columns**: [12-column / 4-column mobile]
**Gutters**: [16px mobile, 24px desktop]
**Max Width**: [1280px / custom]
**Breakpoints**:
- Mobile: [0-640px]
- Tablet: [641-1024px]
- Desktop: [1025px+]

**Journey Context**: [Why these breakpoints matter - e.g., "Mobile-first breakpoints chosen because 65% of compliance officers review on tablets during site visits (Journey Step 3)"]

### Layout Patterns (Journey-Mapped)

| Journey Step | Layout Pattern | Spacing Emphasis | Rationale |
|--------------|----------------|------------------|-----------|
| [Step 1: Discovery] | [Hero + 3-column features] | [xl vertical padding] | [First impression needs breathing room] |
| [Step 2: Core Task] | [Sidebar + main content] | [sm tight spacing] | [Dense workspace for focused work] |
| [Step 3: Review] | [Single column, card grid] | [md consistent rhythm] | [Scannable results display] |

**Validation Criteria**:
- [✓] Excellent: Spacing scale traces to specific journey steps; layout patterns directly support user tasks; breakpoints based on actual user device data
- (Warning) Needs Work: Generic spacing values without journey justification; layout patterns that could apply to any product; arbitrary breakpoints

---

## Iconography

**Style**: [Outline / Filled / Duotone]
**Stroke Width**: [1.5px / 2px] (if outline style)
**Rationale**: [Why this style serves user context - e.g., "Outline icons chosen for professional, uncluttered interface that compliance officers expect in enterprise tools"]

### Icon Sizes

| Size | Dimensions | Usage | Journey Context |
|------|------------|-------|-----------------|
| sm | [16px] | [Inline with text, subtle indicators] | [Step labels, metadata] |
| md | [24px] | [Buttons, navigation, key actions] | [Primary interactions in journey] |
| lg | [32px] | [Feature highlights, empty states] | [Journey entry points] |
| xl | [48px] | [Hero sections, major milestones] | [Journey completion celebrations] |

**Icon Library**: [Heroicons / Lucide / Phosphor / Custom]
**Rationale**: [Why this library - e.g., "Heroicons chosen for comprehensive coverage and MIT license suitable for SaaS product"]

### Usage Guidelines

**When to use icons vs. text**:
- Icons alone: [Only for universally recognized actions in journey - e.g., "Search, Settings, Close"]
- Icon + label: [For journey-critical actions - e.g., "Submit Assessment, Generate Report"]
- Text only: [For complex or domain-specific actions - e.g., "Run Compliance Check"]

**Accessibility**: All icons include aria-label or accompanying visible text

**Validation Criteria**:
- [✓] Excellent: Icon style aligns with brand personality; sizes mapped to specific journey uses; clear guidelines for icon+text vs icon-only
- (Warning) Needs Work: Generic icon choices; inconsistent sizing; missing accessibility guidance

---

## Accessibility Standards

**WCAG Compliance Level**: [AA / AAA]
**Rationale**: [Why this level for target users - e.g., "AA required for enterprise procurement; AAA text contrast chosen because compliance officers work in varying lighting conditions"]

### Color Contrast

**Requirements**:
- Body text (16px+): [4.5:1 minimum]
- Large text (24px+): [3:1 minimum]
- UI components: [3:1 minimum against adjacent colors]
- All color combinations validated: [Yes - using WebAIM Contrast Checker / Stark]

**Examples** (from color system):
- Primary text on background: [#1a1a1a on #ffffff = 16.2:1] [✓]
- Link color on background: [#0066cc on #ffffff = 8.4:1] [✓]
- Success indicator: [#059669 on #ffffff = 4.6:1] [✓]

### Focus Indicators

**Style**: [2px solid outline / 3px offset ring]
**Color**: [Primary color / high contrast]
**Contrast**: [3:1 minimum against all background colors]
**Policy**: Never remove focus indicators - essential for keyboard navigation through journey

**Journey Mapping**: Focus order follows logical journey flow (Step 1 → Step 2 → Step 3)

### Screen Reader Support

**Semantic HTML**: All journey-critical elements use semantic tags (nav, main, section, article, button)
**ARIA Patterns**:
- [Modals]: dialog role, aria-labelledby, focus trap
- [Forms]: aria-describedby for errors, aria-required for required fields
- [Data tables]: th with scope, caption for context
- [Journey progress]: aria-valuenow/valuemax for multi-step flows

**Alt Text Guidelines**:
- Decorative images: Empty alt=""
- Journey-critical images: [Descriptive alt - e.g., "Document processing workflow showing 3 steps"]
- Charts/graphs: [Full data table alternative for screen readers]

### Keyboard Navigation

**Tab Order**: Follows visual journey flow (top to bottom, left to right)
**Interactive Elements**: All clickable elements keyboard-accessible (button, a, input)
**Shortcuts** (if applicable):
- [/ - Focus search] (Journey Step 1: Discovery)
- [n - New document] (Journey Step 2: Core task)
- [Esc - Close modals] (Universal)

**Journey Context**: [Keyboard shortcuts map to high-frequency journey actions for power users]

**Validation Criteria**:
- [✓] Excellent: All color combinations tested and documented; focus indicators visible on all backgrounds; ARIA patterns mapped to journey components; keyboard shortcuts for critical journey steps
- (Warning) Needs Work: Untested contrast ratios; missing focus styles; generic ARIA without journey context; no keyboard shortcuts for frequent actions

---

## WCAG 2.2 Compliance (October 2023 Standard)

> **Three new Level AA success criteria that affect enterprise procurement and legal compliance**

### 2.5.8 Target Size (Minimum) - Level AA

**Requirement**: All interactive targets minimum 24×24 CSS pixels

| Journey Step | Interactive Element | Required Size | Implementation |
|--------------|-------------------|---------------|----------------|
| [Step 1] | [Upload button, file select] | [48×48px] | [Exceeds minimum, thumb-friendly] |
| [Step 2] | [Framework checkboxes, cards] | [24×24px] | [Meets minimum, card area larger] |
| [Step 3] | [Cancel button, pause control] | [32×32px] | [Exceeds minimum] |
| [Step 4] | [Filter buttons, action icons] | [32×32px] | [Comfortable touch interaction] |

**Mobile**: Increase to 44×44px minimum (Apple iOS HIG standard)

**Validation**:
- [ ] All buttons/links/controls ≥24×24px
- [ ] Mobile touch targets ≥44×44px
- [ ] Spacing between targets ≥8px
- [ ] Inline text links exempt but clearly clickable

### 2.4.11 Focus Not Obscured (Minimum) - Level AA

**Requirement**: Focused elements not entirely hidden by fixed/sticky content

| Journey Step | Potential Obstruction | Solution |
|--------------|----------------------|----------|
| [Step 1 Form] | [Sticky header 64px] | [Auto-scroll focused elements with offset] |
| [Step 2 Selection] | [Fixed action bar 80px] | [Ensure 200% zoom doesn't hide focus] |
| [Step 4 Results] | [Floating filter panel] | [Collapse panel during keyboard navigation] |

**Implementation Pattern**:
```javascript
element.addEventListener('focus', () => {
  const headerHeight = 64;
  const elementTop = element.getBoundingClientRect().top;
  if (elementTop < headerHeight) {
    window.scrollBy({
      top: elementTop - headerHeight - 16,
      behavior: 'smooth'
    });
  }
});
```

**Validation**:
- [ ] Focused elements never fully hidden by fixed/sticky elements
- [ ] Auto-scroll works at 200% zoom
- [ ] Focus indicators always partially visible
- [ ] Modal overlays don't obscure background focused elements

### 3.3.8 Accessible Authentication - Level AA

**Requirement**: No cognitive function tests (CAPTCHA, puzzles, pattern recall) unless alternative provided

| Auth Method | WCAG 2.2 Compliant | Recommendation |
|-------------|-------------------|----------------|
| Username + Password | ✅ Yes (if password manager supported) | autocomplete="username" and "current-password" |
| CAPTCHA | ❌ No (unless alternative provided) | Replace with invisible reCAPTCHA or WebAuthn |
| Magic Links | ✅ Yes | No cognitive load, accessible |
| WebAuthn / Passkeys | ✅ Yes | Modern, no memory required |
| OAuth | ✅ Yes | Delegates auth, no cognitive tests |
| Security Questions | ❌ No (memory test) | Avoid or provide alternative |

**Recommended Pattern**:
```
Primary: Email + Password (with password manager support)
Secondary: Magic link fallback (no CAPTCHA)
Enterprise: SSO via SAML/OAuth (no cognitive tests)
MFA: TOTP or WebAuthn (not SMS puzzles)
```

**Journey Impact**:

| Journey Step | Auth Requirement | WCAG 2.2 Consideration |
|--------------|-----------------|----------------------|
| [Step 1] | [Login required] | [Support password managers, no CAPTCHA] |
| [Step 2] | [Authenticated session] | [Session persists, no re-auth] |
| [Step 4] | [Access control] | [Share links bypass auth, or magic link] |

**Validation**:
- [ ] Authentication flow documented
- [ ] No CAPTCHA on critical journey paths
- [ ] Alternative auth methods for cognitive tests
- [ ] Password manager support (autocomplete attributes)

**Validation Criteria**:
- [✓] Excellent: All three WCAG 2.2 criteria documented with journey-specific examples; target sizes mapped to journey interactions; focus obscuring scenarios identified with solutions; auth method compliance table with recommendations
- (Warning) Needs Work: Missing WCAG 2.2 criteria; generic guidance without journey context; no auth method analysis; untested target sizes

---

## CSS Architecture (2025 Standards)

> **Zero-runtime CSS tooling has replaced runtime CSS-in-JS as industry standard**

**Decision**: [Based on tech stack from Session 2]

**2025 CSS Tooling Landscape**:

| Tool | Status | Build Speed | Runtime Cost | Recommendation |
|------|--------|-------------|--------------|----------------|
| **Tailwind CSS v4** | Active | 5x faster | Zero | ✅ Default choice |
| **Panda CSS** | Active | Fast | Zero | ✅ For Chakra migration, RSC apps |
| **Vanilla Extract** | Active | Fast | Zero | ✅ For TypeScript-first |
| **Emotion** | Active | Standard | 20-30KB | ⚠️ Legacy only |
| **styled-components** | Maintenance | Standard | 20-30KB | ❌ MAINTENANCE MODE (March 2025) |

**IMPORTANT**: styled-components entered MAINTENANCE MODE March 2025 (security fixes only, no new features). Do NOT use for new projects.

**Decision**: [Your choice - e.g., "Tailwind CSS v4"]

**Rationale**:
- [Journey requirement - e.g., "Fast iteration needed for compliance framework changes"]
- [Performance requirement - e.g., "Zero-runtime ensures optimal Core Web Vitals for enterprise"]
- [Team context - e.g., "Team familiar with utility-first approach"]
- [Build performance - e.g., "5x faster builds reduce CI/CD time"]

**Trade-offs**:
- [What you gave up - e.g., "Utility class proliferation (mitigated with @apply)"]
- [What you gained - e.g., "Zero runtime cost improves LCP by 200ms"]

**CSS Custom Properties Theming** (light/dark mode):

```css
:root {
  --color-bg: #ffffff;
  --color-text: #1a1a1a;
  --color-primary: #0066cc;
}

[data-theme="dark"] {
  --color-bg: #1a1a1a;
  --color-text: #f0f0f0;
  --color-primary: #3b8eea;
}

/* Prevent flash of incorrect theme */
<script>
  const saved = localStorage.getItem('theme');
  if (saved) document.documentElement.setAttribute('data-theme', saved);
</script>
```

**Validation Criteria**:
- [✓] Excellent: CSS tool aligns with tech stack; styled-components marked MAINTENANCE MODE if mentioned; zero-runtime options recommended; performance comparison documented; theming pattern includes FOIT prevention
- (Warning) Needs Work: Arbitrary CSS choice; no styled-components deprecation warning; runtime CSS-in-JS recommended without trade-off analysis; missing theming pattern

---

## Performance Optimization Strategy

> **Design systems are often the largest performance bottleneck - optimize from the start**

### Bundle Splitting Configuration

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

**Impact**: Apps bundle only used components (50KB) vs entire library (300KB) = 83% reduction

### Icon Optimization Strategy

| Method | Bundle Size | Performance | Recommendation |
|--------|-------------|-------------|----------------|
| **SVG Sprites** | ~5KB total | Excellent | ✅ Use (70-90% reduction) |
| **React Icon Components** | 300-400KB | Poor | ❌ Avoid |
| **Icon Fonts** | ~50KB | Good | ⚠️ Legacy fallback |

**Implementation**:
```tsx
export const Icon = ({ name, size = 24 }) => (
  <svg width={size} height={size} aria-hidden="true">
    <use href={`/icons/sprite.svg#${name}`} />
  </svg>
);
```

**Journey Icon Count**: [~20 unique icons: upload, check, spinner, download, etc.]

### Font Optimization

```css
@font-face {
  font-family: 'Design System';
  src: url('/fonts/inter-variable.woff2') format('woff2');
  font-display: swap; /* Prevent FOIT */
  font-weight: 100 900; /* Variable font */
  unicode-range: U+0000-00FF; /* Latin subset only */
}
```

**Impact**: 1 variable font (80KB) vs 6 static fonts (240KB) = 67% reduction

### Performance Budgets

| Asset Type | Budget | Rationale |
|-----------|--------|-----------|
| CSS | <50KB compressed | Design tokens + components |
| JavaScript | <100KB compressed | Component logic |
| Fonts | <100KB total | Variable font + fallback |
| Icons | <10KB | SVG sprite |

### Core Web Vitals Targets (Journey-Mapped)

| Metric | Target | Journey Step | Optimization |
|--------|--------|--------------|--------------|
| **LCP** | <2.5s | [Step 1] | Preload hero image, font-display: swap |
| **FID** | <100ms | [Step 2] | Code-split components, defer non-critical JS |
| **CLS** | <0.1 | All steps | Reserve space for images, size-adjust fonts |
| **INP** | <200ms | [Step 4] | Debounce search, virtualize long lists |

**Validation Criteria**:
- [✓] Excellent: Bundle splitting config with per-component exports; icon strategy shows 70-90% reduction; font optimization uses variable fonts; performance budgets for all asset types; Core Web Vitals mapped to journey steps
- (Warning) Needs Work: No bundle splitting; React icon components recommended; static fonts without optimization; missing performance budgets; no Core Web Vitals targets

---

## Motion & Interaction Patterns

**Philosophy**: [Motion purpose - e.g., "Subtle motion provides feedback without distraction; enterprise users prioritize clarity over delight"]

### Transition Durations

| Speed | Duration | Usage | Journey Context |
|-------|----------|-------|-----------------|
| instant | 0ms | [Immediate feedback needed] | [Toggle switches, selections] |
| fast | 150ms | [Hover states, focus indicators] | [Responsiveness in frequent interactions] |
| base | 300ms | [Modals, dropdowns, slides] | [Standard UI transitions] |
| slow | 500ms | [Page transitions, major state changes] | [Journey step changes, loading states] |

**Easing**: [cubic-bezier(0.4, 0.0, 0.2, 1) / ease-in-out]
**Rationale**: [Why this easing curve - e.g., "Ease-out for entering elements (quick start, slow finish) feels responsive and natural"]

### Loading States

**Skeleton Screens**: Used for [journey-critical content - e.g., "Document preview (Journey Step 2)"]
- Structure: [Mimics final content layout]
- Animation: [Subtle shimmer, 1.5s duration]

**Spinners**: Used for [actions with unknown duration - e.g., "AI processing (Journey Step 3)"]
- Style: [Circular, branded color]
- Size: [24px inline, 48px full-screen]

**Progress Indicators**: Used for [multi-step journey flows with known duration]
- Type: [Linear bar / stepped progress]
- Shows: [Current step, total steps, percentage if available]

### Micro-interactions

**Button Feedback**:
- Hover: [Background darken 10%, 150ms transition]
- Active: [Scale 0.98, background darken 15%]
- Success: [Brief checkmark animation, 300ms]

**Form Validation**:
- Real-time: [After blur, not on every keystroke]
- Success: [Subtle green border, checkmark icon]
- Error: [Red border, error message slides in below field]

**Success Confirmations** (Journey Milestones):
- [Toast notification, 3s duration, auto-dismiss]
- [Modal for critical completions - e.g., "Assessment submitted"]

**Journey Context**: [Micro-interactions provide confidence at each journey decision point]

**Validation Criteria**:
- [✓] Excellent: Motion durations appropriate for interaction type; loading states match journey wait times; micro-interactions mapped to journey actions; clear philosophy guiding motion choices
- (Warning) Needs Work: Arbitrary durations; generic loading spinners; missing success states for journey milestones

---

## Elevation & Shadow System

**Philosophy**: [When to use elevation - e.g., "Minimal shadows; elevation reserved for interactive elements and modals to maintain professional aesthetic"]

### Shadow Levels

| Level | Shadow | Usage | Journey Context |
|-------|--------|-------|-----------------|
| 0 | none | [Default state, flat surfaces] | [Body content, non-interactive elements] |
| 1 | [0 1px 3px rgba(0,0,0,0.12)] | [Cards, subtle lift] | [Document cards in list (Journey Step 1)] |
| 2 | [0 4px 6px rgba(0,0,0,0.1)] | [Hover states, dropdowns] | [Interactive elements users can click] |
| 3 | [0 10px 15px rgba(0,0,0,0.15)] | [Modals, popovers] | [Focus-demanding elements in journey] |
| 4 | [0 20px 25px rgba(0,0,0,0.2)] | [Drag states, major overlays] | [Active manipulation, drag-and-drop] |

**Rationale**: [How depth hierarchy guides user - e.g., "Progressive elevation draws attention to interactive elements; Level 3 shadows for modal workflows ensure focus on critical journey decisions"]

**Validation Criteria**:
- [✓] Excellent: Shadow levels tied to interaction hierarchy; elevation supports journey flow; clear philosophy about when NOT to use shadows
- (Warning) Needs Work: Arbitrary shadow values; overuse of elevation; missing rationale for depth hierarchy

---

## Component Library (Journey-Mapped)

### [Component Name] (Journey Step [X])

**Design**: [Description or ASCII mockup]

**States**:
- Default: [Styling]
- Hover: [Styling]
- Active: [Styling]
- Error: [Styling]

**Interaction**: [How users interact with this]

---

## Component-Journey Mapping

| Journey Step | Key Components | Design Priority |
|--------------|----------------|-----------------|
| Step 1: [Name] | [Components] | [Priority] |
| Step 2: [Name] | [Components] | [Priority] |
| Step 3: [Name] | [Components] | [Priority] |

---

**Next in Cascade**: Design system informs backlog (which components to build, implementation tasks)
