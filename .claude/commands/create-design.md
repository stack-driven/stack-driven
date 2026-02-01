---
description: Session 6 - Create design system optimized for user journey
---

# Session 6: Create Design System

This is **Session 6** of the cascade. You'll create a design system that serves the user journey and brings your brand strategy to life. This is not a generic component library, but a design system optimized for your specific journey and brand.

## Your Role

Infer design needs from journey context and create a system optimized for the specific user flows.

## Process

### Step 1: Read Previous Outputs

```
Read: product-guidelines/00-user-journey.ctx.md (context version for token efficiency)
Read: product-guidelines/01-product-strategy.ctx.md (context version for token efficiency)
Read: product-guidelines/02-tech-stack.ctx.md (context version for token efficiency)
Read: product-guidelines/02a-constraints.ctx.md (context version for token efficiency, if exists)
Read: product-guidelines/02b-coding-standards.ctx.md (context version for token efficiency, if exists)
Read: product-guidelines/02c-ai-integration-strategy.ctx.md (context version for token efficiency, if exists)
Read: product-guidelines/04-architecture.ctx.md (context version for token efficiency)
Read: product-guidelines/05-brand-strategy.ctx.md (context version for token efficiency)
```

**Context Optimization**: We read .ctx.md files for all previous sessions (1-5) for significant token efficiency (~60-70% reduction per file). This provides sufficient context for design system generation without full rationale and alternatives.

### Step 2: Extract Brand Personality & Visual Direction

**From Brand Strategy** (`product-guidelines/05-brand-strategy.md`):
- **Brand Personality**: What attributes are defined? (Professional, playful, trustworthy, innovative, etc.)
- **Core Values**: What values should the design express? (Speed, clarity, trust, creativity, etc.)
- **Visual Direction**: What aesthetic guidance is provided? (Color preferences, mood, style)
- **Brand Promise**: What should users always experience?

Use these as the foundation for design decisions. Don't infer brand—read it from Session 5 output.

### Step 3: Map Brand to Design Needs

**Apply Brand Personality to Design**:
- Trustworthy + Professional → Blues, clear hierarchy, conservative spacing
- Playful + Creative → Vibrant colors, organic shapes, generous whitespace
- Efficient + Technical → Monochrome + accent, tight spacing, monospace fonts

**Component Requirements** (from journey steps):
- Step 1 (Upload)? → File upload component, drag-drop zone
- Step 3 (AI processing)? → Progress indicators, status displays
- Step 4 (Results review)? → Data tables, filtering, expandable cards

**Interaction Patterns**:
- Fast/efficiency-focused? → Keyboard shortcuts, minimal animations
- Exploratory? → Hover states, progressive disclosure
- Careful/high-stakes? → Confirmation dialogs, undo capabilities

**Accessibility**:
- Industry standards? (Healthcare/finance often require WCAG AA)
- User needs? (Older users, accessibility-first contexts)

**Accessibility Requirements** (detailed in Step 6 below):
- WCAG 2.1 AA compliance for most products
- WCAG AAA for government/healthcare
- Color contrast ratios: 4.5:1 (text), 3:1 (large text/UI)
- Keyboard navigation for all journey-critical actions
- Screen reader support with semantic HTML and ARIA labels

### Step 4: Define Design Tokens

**Colors**: Implement brand personality from Session 5
- Trust-focused? → Blues
- Creative? → Vibrant multi-color
- Efficient? → Monochrome + accent

**Typography**: Match use case
- Dense information? → High legibility (Inter, etc.)
- Marketing-heavy? → Distinctive brand fonts
- Technical? → Monospace for code/data

**Typography Scale** (modular scale approach):

Choose scale ratio based on brand personality:
- **1.125 (Major Second)**: Conservative, dense (B2B tools, dashboards)
- **1.250 (Major Third)**: Balanced (most products)
- **1.333 (Perfect Fourth)**: Moderate contrast (content-heavy)
- **1.5 (Perfect Fifth)**: High contrast (marketing, creative)
- **1.618 (Golden Ratio)**: Maximum contrast (landing pages)

**Example Scale (1.250 ratio, 16px base)**:
```
xs:   12px (0.75rem)  → Captions, helper text
sm:   14px (0.875rem) → Secondary text, labels
base: 16px (1rem)     → Body text, forms
lg:   20px (1.25rem)  → Subheadings, card titles
xl:   25px (1.563rem) → Section headings
2xl:  31px (1.953rem) → Page titles
3xl:  39px (2.441rem) → Hero headings
```

**Journey Mapping**:
- Step instructions: `lg` (20px) - needs visibility
- Form labels: `sm` (14px) - standard
- Button text: `base` (16px) - readable at distance
- Error messages: `sm` (14px) with bold weight

**Font Pairing**:
- **Headings**: Inter (B2B), Poppins (friendly), IBM Plex Sans (technical)
- **Body**: Inter, system fonts, or Source Sans Pro
- **Monospace**: Fira Code, JetBrains Mono (for code/data display)

**Spacing**: Match information density needs
- Power users? → Tighter spacing (more on screen)
- Casual users? → Generous spacing (less overwhelming)

**Spacing Scale** (8px base system):
```
0:   0px      → No spacing
1:   4px      → Tight (icon + label)
2:   8px      → Compact (between form elements)
3:   12px     → Default (paragraph spacing)
4:   16px     → Comfortable (between sections)
5:   24px     → Loose (between major sections)
6:   32px     → Spacious (between journey steps)
8:   48px     → Extra spacious (page margins)
10:  64px     → Maximum (hero sections)
```

**Journey Step Spacing**:
- Within forms (Step 1, 2): `space-4` (16px) between fields
- Between journey steps: `space-6` (32px) visual separation
- Card padding: `space-4` (mobile), `space-5` (desktop)
- Page margins: `space-6` to `space-8` depending on density needs

### Step 4b: Generate Design Token Hierarchy (DTCG Format)

After defining brand tokens in Step 4, transform them into industry-standard W3C Design Tokens Community Group (DTCG) format with three-tier hierarchy.

**Three-Tier Token Architecture**:

1. **Primitive Tokens**: Raw values (colors, sizes) without semantic meaning
2. **Semantic Tokens**: Purpose-based tokens that reference primitives
3. **Component Tokens**: Component-specific tokens that reference semantic tokens

**DTCG Format Structure**:
```json
{
  "color": {
    "primitive": {
      "blue": {
        "500": { "$value": "#0066cc", "$type": "color" }
      }
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
        "background": {
          "primary": { "$value": "{color.semantic.action.primary}" }
        }
      }
    }
  }
}
```

**Generation Process**:

1. **Transform brand colors to primitive tokens**:
   - Each brand color becomes a primitive token with $value and $type
   - Use consistent naming: `color.primitive.[hue].[scale]`
   - Include spacing primitives: `space.primitive.[n]` (4px, 8px, 16px, etc.)

2. **Create semantic tokens from journey context**:
   - Map journey actions to semantic tokens (e.g., action.primary, action.secondary)
   - Create semantic spacing tokens (e.g., layout.section, layout.component)
   - Add $description field explaining journey context for each semantic token

3. **Define component tokens**:
   - Map components from Step 5 to component tokens
   - Reference semantic tokens (not primitives) for themability
   - Example: button.background.primary → semantic.action.primary → primitive.blue.500

**Journey Token Mapping Table**:

Create table showing which tokens serve which journey steps:

| Journey Step | Semantic Tokens Used | Component Tokens | Rationale |
|--------------|---------------------|------------------|-----------|
| Step 1 Upload | action.primary, status.idle | button.background.primary, upload.border.default | High-visibility CTA |
| Step 2 Selection | action.selected, interactive.hover | card.border.selected, checkbox.background.checked | Clear selection state |
| Step 3 Processing | status.processing, feedback.info | progress.fill, spinner.color | Reassuring progress |
| Step 4 Results | status.success, status.warning | card.background.success, badge.color.warning | At-a-glance status |

**Style Dictionary Configuration** (for token transformation):

Include Style Dictionary v4 configuration for transforming tokens to platform-specific formats (CSS variables, Tailwind config, iOS Swift, Android Compose):

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

**Why This Matters**:
- **Themability**: Can implement light/dark mode by swapping semantic token values
- **Multi-platform**: Generate iOS, Android, Web tokens from single source
- **Design handoff**: Sync with Figma Variables via Tokens Studio plugin
- **Maintainability**: Change `#0066cc` once (primitive) vs find/replace across codebase

**Validation**:
- [ ] Three token tiers generated (primitive, semantic, component)
- [ ] All colors reference tokens (no inline hex values in components)
- [ ] Journey mapping table documents semantic token usage per step
- [ ] Style Dictionary config included for platform transforms

### Step 5: Map Components to Journey

Create table showing:
| Journey Step | UI Components Needed | Design Priority |
|--------------|---------------------|-----------------|
| Step 1 | Upload zone, file list | Large touch targets, clear feedback |
| Step 2 | Checkbox list, search | Smart defaults, fast selection |
| Step 3 | Progress bar, status | Real-time updates, clear ETA |
| Step 4 | Data cards, filters | Scannable, information density |

### Step 6: Component Decision Trees

Apply these rules to determine when to create reusable components vs inline implementations:

**Component Creation Rules**:
```
Does this pattern appear 3+ times in the journey?
├─ YES → Create reusable component
└─ NO ─→ Does it vary by only 1-2 props?
          ├─ YES → Create component with variants
          └─ NO ─→ Is it highly context-specific?
                   ├─ YES → Inline/page-specific component
                   └─ NO ─→ Create component (future reuse likely)
```

**Variant vs New Component**:
```
Does new design differ only in:
  • Color/size?
  • Icon/label?
  • Layout direction (horizontal/vertical)?

├─ YES → Add variant to existing component
└─ NO ─→ Create new component
```

**Examples from Compliance SaaS Journey**:

- **Button** (appears everywhere) → Core component with variants
  - Primary: Main journey actions ("Generate Assessment")
  - Secondary: Cancel, back actions
  - Danger: Delete, remove actions

- **File Upload** (Step 1 only) → Dedicated component (critical path)
  - Multiple props: accept types, max size, drag-drop
  - Complex states: uploading, error, success

- **Framework Selector** (Step 2) → Page-specific component
  - Only used once in journey
  - Highly specific to compliance frameworks
  - Don't over-engineer for reuse

- **Assessment Card** (Step 4 results) → Reusable component
  - Used in dashboard, history, results
  - Variants: collapsed, expanded, with-actions

- **Progress Indicator** (Step 3) → Core component
  - Reused: AI processing, document analysis, export generation
  - States: determinate, indeterminate, with ETA

**Decision Matrix**:
| Pattern | Usage Count | Variance | Decision |
|---------|-------------|----------|----------|
| Form Input | 10+ | Style only | Core component + variants |
| Upload Zone | 1 | N/A | Dedicated component (critical) |
| Status Badge | 8 | Color/text | Core component |
| Onboarding Card | 1 | High context | Inline component |
| Modal Dialog | 5+ | Content | Core component + slots |

### Step 7: Accessibility Standards & Implementation

Accessibility is non-negotiable for journey-critical actions. Define standards based on your user context:

**WCAG Compliance Level** (choose based on context):
- **WCAG 2.1 AA**: Standard for most B2B/B2C products
- **WCAG 2.1 AAA**: Required for government, healthcare, education
- **Section 508**: US federal accessibility requirements

**Color Contrast Requirements**:
```
Text Contrast (WCAG AA):
  • Normal text (< 18pt): 4.5:1 minimum
  • Large text (≥ 18pt or 14pt bold): 3:1 minimum
  • UI components & graphics: 3:1 minimum

Journey-Critical Elements:
  • Primary CTA buttons: 4.5:1 minimum (treat as text)
  • Error messages: 4.5:1 minimum
  • Status indicators: 3:1 + icon/pattern (don't rely on color alone)
```

**Keyboard Navigation Patterns**:

Map to journey steps:
1. **Tab order** follows journey flow (Step 1 → Step 2 → Step 3)
2. **Journey-critical actions** accessible via keyboard:
   - File upload: `Enter` to trigger, `Esc` to cancel
   - Form submission: `Enter` on input, `Cmd/Ctrl+Enter` in textarea
   - Results filtering: Arrow keys, `Space` to select
3. **Focus indicators**: Visible 2px outline on all interactive elements
4. **Skip links**: "Skip to results" for Step 4, "Skip to upload" for Step 1

**ARIA Labels for Journey Actions**:

Label patterns by journey step:
- **Step 1 (Upload)**: `aria-label="Upload compliance documents"`, `aria-describedby="file-requirements"`
- **Step 2 (Selection)**: `aria-label="Select frameworks for assessment"`, `role="listbox"`
- **Step 3 (Processing)**: `role="status"`, `aria-live="polite"` for progress updates
- **Step 4 (Results)**: `aria-label="Assessment results"`, `role="region"` for result cards

**Screen Reader Considerations**:
- Use semantic HTML: `<button>`, `<nav>`, `<main>`, `<aside>`
- Don't use `div` with `onclick` → Use `<button>`
- Loading states: Announce "Processing assessment" to screen readers
- Error messages: `role="alert"` for journey-blocking errors

**Testing Checklist**:
- [ ] All journey steps navigable with keyboard only
- [ ] Color contrast passes for all text/UI elements
- [ ] Screen reader announces journey progress
- [ ] Focus never trapped (can always Esc or Tab out)
- [ ] Error messages are announced and clear

### Step 7b: WCAG 2.2 Compliance (October 2023 Standard)

After defining WCAG 2.1 accessibility standards in Step 7, add the three new success criteria from WCAG 2.2 (published October 2023).

**WCAG 2.2 New Success Criteria**:

**1. Success Criterion 2.5.8: Target Size (Minimum) - Level AA**

**Requirement**: All interactive targets must be at least 24×24 CSS pixels, with exceptions for:
- Inline links within sentences
- Targets controlled by user agent (browser controls)
- Essential targets where size is critical to information

**Journey Application**:

Map target size requirements to journey-critical interactions:

| Journey Step | Interactive Element | Required Size | Implementation |
|--------------|-------------------|---------------|----------------|
| Step 1 Upload | Upload button, file select | 48×48px | Exceeds minimum, thumb-friendly |
| Step 2 Selection | Framework checkboxes, cards | 24×24px (checkbox) | Meets minimum, card click area larger |
| Step 3 Processing | Cancel button, pause control | 32×32px | Exceeds minimum for accessibility |
| Step 4 Results | Filter buttons, action icons | 32×32px | Comfortable interaction on touch |

**Mobile Considerations**:
- Increase to 44×44px minimum on mobile (Apple iOS HIG standard)
- Provide adequate spacing between touch targets (8px minimum)
- Test with real devices to ensure thumb-friendly zones

**Validation**:
- [ ] All buttons, links, form controls ≥24×24px
- [ ] Touch targets on mobile ≥44×44px
- [ ] Spacing between adjacent targets ≥8px
- [ ] Inline text links exempt (but still clearly clickable)

**2. Success Criterion 2.4.11: Focus Not Obscured (Minimum) - Level AA**

**Requirement**: When a user interface component receives keyboard focus, the focused element must not be entirely hidden by author-created content (sticky headers, fixed footers, modals).

**Journey Application**:

Identify potential focus obscuring scenarios in journey:

| Journey Step | Potential Obstruction | Solution |
|--------------|----------------------|----------|
| Step 1 Form | Sticky header (64px) | Scroll focused element into view with offset |
| Step 2 Selection | Fixed action bar (80px) | Ensure 200% zoom doesn't hide focus indicators |
| Step 4 Results | Floating filter panel | Collapse panel when keyboard navigating table |

**Implementation Pattern**:

```javascript
// Auto-scroll focused elements into view with offset
element.addEventListener('focus', () => {
  const headerHeight = 64; // Sticky header height
  const elementTop = element.getBoundingClientRect().top;

  if (elementTop < headerHeight) {
    window.scrollBy({
      top: elementTop - headerHeight - 16, // 16px padding
      behavior: 'smooth'
    });
  }
});
```

**Testing Requirements**:
- Test keyboard navigation through entire journey
- Test with browser zoom at 200% (Level AA requirement)
- Test with sticky headers/footers visible
- Verify focus indicators always partially visible

**Validation**:
- [ ] Focused elements never fully hidden by fixed/sticky elements
- [ ] Keyboard navigation scrolls focused elements into view automatically
- [ ] Focus indicators visible at 200% zoom
- [ ] Modal overlays don't obscure focused elements behind them

**3. Success Criterion 3.3.8: Accessible Authentication - Level AA**

**Requirement**: Authentication processes must not rely on cognitive function tests (CAPTCHA, puzzles, remembering patterns). Alternatives required:

- Object recognition (alternative method provided)
- Personal content recognition (alternative method provided)
- Cognitive function tests are allowed if:
  - Alternative authentication mechanism provided
  - Password managers are supported

**Journey Application**:

If authentication is required in journey (common for Step 1 or Step 4 results access):

| Auth Method | WCAG 2.2 Compliant | Recommendation |
|-------------|-------------------|----------------|
| Username + Password | ✅ Yes (if password manager supported) | Ensure autocomplete="username" and autocomplete="current-password" |
| CAPTCHA | ❌ No (unless alternative provided) | Replace with invisible reCAPTCHA or WebAuthn |
| Magic Links (email/SMS) | ✅ Yes | No cognitive load, accessibility-friendly |
| WebAuthn / Passkeys | ✅ Yes | Modern, no memory required |
| OAuth (Google, Microsoft) | ✅ Yes | Delegates auth, no cognitive tests |
| Security Questions | ❌ No (memory test) | Avoid or provide password manager alternative |

**Recommended Pattern for Compliance SaaS**:

```
Primary: Email + Password (with password manager support)
Secondary: Magic link fallback (no CAPTCHA)
Enterprise: SSO via SAML/OAuth (no cognitive tests)
MFA: TOTP or WebAuthn (not SMS puzzles)
```

**Implementation Checklist**:
- [ ] Login forms support password managers (autocomplete attributes)
- [ ] No CAPTCHA on critical journey paths (upload, submission)
- [ ] If CAPTCHA used, provide alternative (magic link, WebAuthn)
- [ ] Security questions not required (or have alternative)
- [ ] MFA doesn't rely on cognitive tests (no pattern recall)

**Rationale**: WCAG 3.3.8 addresses cognitive disabilities. For enterprise SaaS, this aligns with procurement requirements where accessibility is mandatory.

**Journey Impact Analysis**:

| Journey Step | Auth Requirement | WCAG 2.2 Consideration |
|--------------|-----------------|----------------------|
| Step 1 Upload | Login required | Support password managers, no CAPTCHA |
| Step 2 Selection | Authenticated session | Session persists, no re-auth |
| Step 4 Results | Access control | Share links bypass auth, or magic link access |

**Validation**:
- [ ] Authentication flow documented in design system
- [ ] No cognitive function tests (CAPTCHA, puzzles) on critical paths
- [ ] Alternative auth methods provided where cognitive tests exist
- [ ] Password manager support confirmed (autocomplete attributes)

### Step 8: Responsive Strategy & Breakpoints

Define responsive behavior based on which journey steps happen on mobile vs desktop:

**Journey Step Analysis**:
```
Which steps happen on mobile?
├─ ALL steps → Mobile-first approach
├─ First 1-2 steps → Progressive enhancement
└─ Desktop-only → Desktop-first (with mobile fallback)
```

**Compliance SaaS Example**:
- Step 1 (Upload): Mostly desktop (uploading large policy docs)
- Step 2 (Selection): Both (mobile for quick selections, desktop for detailed)
- Step 3 (Processing): Both (passive waiting)
- Step 4 (Results): Desktop-primary (reviewing detailed assessments)

**Decision: Desktop-first with mobile support for Steps 2-3**

**Breakpoint Philosophy**:

**Mobile-First** (progressive enhancement):
- Base styles: 320px+ (mobile)
- Tablet: 768px+ (add columns, expand spacing)
- Desktop: 1024px+ (full feature set)

**Desktop-First** (graceful degradation):
- Base styles: 1440px (desktop)
- Tablet: 1024px and down (simplify layouts)
- Mobile: 768px and down (single column, essential features)

**Responsive Component Behavior** (map to journey):

| Component | Mobile Behavior | Desktop Behavior |
|-----------|----------------|------------------|
| File Upload | Camera + file picker | Drag-drop zone |
| Framework Selector | Accordion (collapsed) | Multi-column grid |
| Progress Indicator | Full-width bar | Inline with details |
| Assessment Card | Stack (single column) | Grid (2-3 columns) |
| Data Table | Horizontal scroll OR card view | Full table |
| Navigation | Hamburger menu | Full horizontal nav |

**Responsive Patterns**:

1. **Information Density**:
   - Mobile: 1 key metric per screen
   - Desktop: Dashboard with 6-8 metrics

2. **Navigation**:
   - Mobile: Bottom tab bar (thumb-friendly)
   - Desktop: Sidebar or top nav

3. **Forms** (Step 1, 2):
   - Mobile: Full-width inputs, larger touch targets (44px min)
   - Desktop: Multi-column forms, keyboard shortcuts

4. **Data Display** (Step 4):
   - Mobile: Card-based list view
   - Desktop: Table with sorting/filtering

**Breakpoint Values** (choose based on journey):
```
Standard (B2B tools):
  sm: 640px
  md: 768px
  lg: 1024px
  xl: 1280px

Content-Heavy (documentation, reading):
  sm: 640px
  md: 768px
  lg: 1024px
  xl: 1440px (wider for readability)
```

### Step 9: Component Patterns & States (Compliance SaaS Examples)

Expand beyond basic components with real journey-specific patterns:

**1. File Upload Component (Step 1 - Upload Documents)**

States & Variants:
- **Default**: Drag-drop zone with "Upload policy documents" label
- **Dragging**: Border highlight, "Drop files here" feedback
- **Uploading**: Progress bar, filename, cancel button
- **Success**: Green checkmark, file size, "Upload another" action
- **Error**: Red border, "File too large (max 10MB)" message
- **Disabled**: Grayed out (when processing Step 3)

Design tokens:
- Border: 2px dashed, color: `gray-300` (default) / `blue-500` (dragging)
- Padding: `space-6` (48px) for large hit area
- Min height: 200px (easy targeting)

**2. Framework Selector (Step 2 - Choose Compliance Frameworks)**

Pattern: Multi-select checkbox grid with search
- **Component**: `<FrameworkCard>` with checkbox, logo, description
- **Layout**: CSS Grid, 3 columns (desktop) / 1 column (mobile)
- **States**:
  - Unselected: Gray border, `bg-white`
  - Hovered: Blue border, `shadow-sm`
  - Selected: Blue border, `bg-blue-50`, checkmark icon
  - Disabled: Grayed out (e.g., "Premium framework - Upgrade required")

Design considerations:
- Each card shows: Framework name, description (2 lines), estimated time
- Selected count: "3 frameworks selected" sticky header
- Quick filters: "Show all", "Popular", "My saved"

**3. Processing Status (Step 3 - AI Assessment)**

Pattern: Indeterminate → Determinate progress
- **Phase 1**: Spinner + "Initializing assessment..."
- **Phase 2**: Progress bar + "Analyzing documents (45% complete)"
- **Phase 3**: Status updates:
  - "Parsing policies..."
  - "Checking SOC 2 requirements..."
  - "Generating gap analysis..."
- **Complete**: Success animation → Auto-transition to Step 4

Design tokens:
- Progress bar: Height 8px, rounded, animated gradient
- Status text: `text-sm`, `text-gray-600`, updates every 2-3 seconds
- Container: `space-8` padding, centered on page

**4. Assessment Results Card (Step 4 - Review Results)**

Variant patterns:
- **Collapsed**: Framework name, overall score (83%), expand icon
- **Expanded**: Requirements list, gap analysis, action items
- **With Actions**: "Export PDF", "Share", "Start remediation"

Visual hierarchy:
- Score badge: Large (48px), color-coded (red <60%, yellow 60-80%, green >80%)
- Requirements: Nested checklist with icons (✓ pass, [Warning] partial, [x] fail)
- Action buttons: Secondary (ghost), aligned right

**5. Empty States**

Journey-specific empty states:
- **No documents uploaded**: "Upload your first policy document to get started"
  - Illustration: Document icon
  - Primary CTA: "Upload document"
- **No frameworks selected**: "Select frameworks to assess compliance"
  - Helper text: "Popular: SOC 2, ISO 27001, GDPR"
- **Processing**: Not empty, but loading state
- **No results**: "Assessment complete - no gaps found!" (positive empty state)

### Step 10: Performance Optimization Strategy

After defining components (Step 9), create a performance optimization strategy that ensures the design system delivers excellent Core Web Vitals and minimizes bundle size.

**Performance Philosophy**:
Design systems often become performance bottlenecks when implemented poorly. This step ensures production-ready performance from the start.

**1. Bundle Splitting Configuration**

For design system packages, configure per-component exports to enable tree-shaking:

```json
{
  "name": "@company/design-system",
  "version": "1.0.0",
  "sideEffects": ["**/*.css"],
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "types": "./dist/index.d.ts"
    },
    "./button": {
      "import": "./dist/button/index.js",
      "types": "./dist/button/index.d.ts"
    },
    "./modal": {
      "import": "./dist/modal/index.js",
      "types": "./dist/modal/index.d.ts"
    },
    "./upload": {
      "import": "./dist/upload/index.js",
      "types": "./dist/upload/index.d.ts"
    }
  }
}
```

**Why This Matters**:
- Without per-component exports: Apps bundle entire design system (300KB+)
- With per-component exports: Apps bundle only used components (50KB typical)
- `sideEffects: ["**/*.css"]` tells bundlers CSS must always be included

**Journey Impact**:
- Step 1 page imports only Button + Upload components (not entire library)
- Step 4 results page imports only Table + Card + Badge (not full library)
- Reduces initial bundle by 70-80% compared to monolithic import

**2. Icon Optimization Strategy**

Icons are often the largest performance bottleneck in design systems. Choose the right strategy:

| Method | Bundle Size | Performance | Tree-Shaking | Recommendation |
|--------|-------------|-------------|--------------|----------------|
| **SVG Sprites** | ~5KB total | Excellent | N/A (shared file) | ✅ Use (70-90% reduction) |
| **React Icon Components** | 300-400KB | Poor | Yes | ❌ Avoid |
| **Icon Fonts** | ~50KB | Good | No | ⚠️ Legacy fallback |

**Recommended: SVG Sprite Implementation**

```tsx
// Icon component using sprites (70-90% size reduction)
export const Icon = ({ name, size = 24, ...props }: IconProps) => (
  <svg
    width={size}
    height={size}
    aria-hidden="true"
    focusable="false"
    {...props}
  >
    <use href={`/icons/sprite.svg#${name}`} />
  </svg>
);

// Usage in journey components
<Icon name="upload" size={24} />      // Step 1: Upload
<Icon name="check-circle" size={20} /> // Step 2: Selected frameworks
<Icon name="spinner" size={32} />      // Step 3: Processing
<Icon name="download" size={20} />     // Step 4: Export results
```

**SVG Sprite Generation** (build-time):

```javascript
// Build script to generate sprite from individual SVGs
import { readdir, readFile, writeFile } from 'fs/promises';
import { join } from 'path';

const icons = await readdir('./src/icons');
const svgContents = await Promise.all(
  icons.map(f => readFile(join('./src/icons', f), 'utf-8'))
);

const sprite = `
<svg xmlns="http://www.w3.org/2000/svg" style="display: none;">
  ${svgContents.map((svg, i) => {
    const id = icons[i].replace('.svg', '');
    return svg
      .replace('<svg', `<symbol id="${id}"`)
      .replace('</svg>', '</symbol>');
  }).join('\n')}
</svg>
`;

await writeFile('./public/icons/sprite.svg', sprite);
```

**Journey Icon Count Analysis**:
- Step 1 (Upload): 5 icons (upload, file, check, x, info)
- Step 2 (Selection): 4 icons (search, check-circle, info, chevron)
- Step 3 (Processing): 2 icons (spinner, clock)
- Step 4 (Results): 8 icons (download, share, filter, sort, expand, collapse, check, alert)

Total: ~20 unique icons × 1KB each = **20KB as React components vs 5KB as sprite** (75% reduction)

**3. Font Optimization**

Fonts are critical for brand but can block rendering. Optimize with these patterns:

```css
/* Variable font reduces requests and supports full weight range */
@font-face {
  font-family: 'Design System';
  src: url('/fonts/inter-variable.woff2') format('woff2');
  font-display: swap; /* Prevent flash of invisible text (FOIT) */
  font-weight: 100 900; /* Variable font supports all weights */
  unicode-range: U+0000-00FF, U+0131, U+0152-0153; /* Latin subset only */
  font-stretch: 75% 125%; /* If variable width supported */
}

/* Fallback for older browsers */
@font-face {
  font-family: 'Design System Fallback';
  src: local('Arial'), local('Helvetica');
  size-adjust: 105%; /* Match metrics to reduce layout shift */
  ascent-override: 90%;
  descent-override: 22%;
  line-gap-override: 0%;
}
```

**Why Variable Fonts**:
- Traditional: 6 font files (regular, medium, semi-bold × 2 weights) = 240KB
- Variable: 1 font file with all weights = 80KB (67% reduction)
- Supports any weight value (font-weight: 450) for precise typography

**Font Loading Strategy**:

```html
<!-- Preload critical fonts for LCP -->
<link
  rel="preload"
  href="/fonts/inter-variable.woff2"
  as="font"
  type="font/woff2"
  crossorigin
/>

<!-- Inline font-face CSS in <head> to prevent render-blocking -->
<style>
  @font-face {
    font-family: 'Design System';
    src: url('/fonts/inter-variable.woff2') format('woff2');
    font-display: swap;
    font-weight: 100 900;
  }
</style>
```

**Journey Impact**:
- Step 1 hero text loads instantly (swap prevents FOIT)
- Brand font doesn't block journey-critical interactions
- Variable font covers all typography scale weights without additional downloads

**4. Performance Budgets**

Set performance budgets to prevent regressions:

| Asset Type | Budget | Rationale | Journey Context |
|-----------|--------|-----------|-----------------|
| **CSS** | <50KB compressed | Design tokens + components | Critical for FCP |
| **JavaScript** | <100KB compressed | Component logic + interactions | Affects TTI |
| **Fonts** | <100KB total | Variable font + fallback | Affects LCP |
| **Icons** | <10KB | SVG sprite | Fast icon rendering |
| **Images** | <200KB per page | Journey screenshots, empty states | Affects LCP on Step 1 |

**Enforcement** (Bundler Plugins):

```javascript
// webpack.config.js or vite.config.js
export default {
  performance: {
    maxAssetSize: 100000, // 100KB
    maxEntrypointSize: 200000, // 200KB
    hints: 'error' // Fail build if budget exceeded
  }
};
```

**Core Web Vitals Targets** (Journey-Mapped):

| Metric | Target | Journey Step | Optimization |
|--------|--------|--------------|--------------|
| **LCP** (Largest Contentful Paint) | <2.5s | Step 1 Upload | Preload hero image, font-display: swap |
| **FID** (First Input Delay) | <100ms | Step 2 Selection | Code-split heavy components, defer non-critical JS |
| **CLS** (Cumulative Layout Shift) | <0.1 | All steps | Size-adjust on fallback fonts, reserve space for images |
| **INP** (Interaction to Next Paint) | <200ms | Step 4 Filters | Debounce search, virtualize long lists |

**5. Journey-Specific Performance Analysis**

Map performance optimizations to journey steps where they matter most:

| Journey Step | Performance Priority | Optimization Strategy | Impact |
|--------------|---------------------|----------------------|--------|
| **Step 1: Upload** | LCP (hero section) | Preload hero image, critical CSS inline | First impression speed |
| **Step 2: Selection** | INP (checkbox interaction) | Debounce search, optimize re-renders | Smooth filtering |
| **Step 3: Processing** | N/A (passive wait) | Skeleton screens, optimistic UI updates | Perceived performance |
| **Step 4: Results** | FCP, INP (table rendering) | Virtual scrolling for >100 rows, lazy load cards | Fast results display |

**6. Monitoring & Validation**

Include performance monitoring guidance:

```javascript
// Track Core Web Vitals in production
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function sendToAnalytics(metric) {
  // Send to your analytics service
  analytics.track('Web Vitals', {
    name: metric.name,
    value: metric.value,
    id: metric.id
  });
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

**Performance Testing Checklist**:
- [ ] Run Lighthouse on each journey step (target: 90+ performance score)
- [ ] Test on 3G throttled connection (target: <5s LCP)
- [ ] Verify bundle sizes within budgets (CSS <50KB, JS <100KB)
- [ ] Check icon sprite file generated correctly (<10KB)
- [ ] Validate font loading doesn't cause FOIT (swap strategy working)
- [ ] Measure CLS on all steps (target: <0.1)

**Validation**:
- [ ] Bundle splitting config includes per-component exports
- [ ] Icon strategy documented (SVG sprites recommended with 70-90% reduction claim)
- [ ] Font optimization pattern includes variable fonts, font-display: swap, unicode-range subset
- [ ] Performance budgets specified for all asset types
- [ ] Core Web Vitals targets mapped to journey steps
- [ ] Performance monitoring code included

## Generating the Output

Use `/templates/06-design-system-template.md`.

**Key Sections**:

1. **Design Philosophy** (derived from user context)
2. **Brand Personality** (based on journey context, not arbitrary)
3. **Color System** (with rationale)
4. **Typography** (with use case justification)
5. **Spacing System**
6. **Component Library** (journey-mapped)
   - For each key journey step, define needed components
   - Include states (default, hover, error, loading)
   - Interaction patterns
7. **Component-Journey Mapping** (table)
8. **Accessibility Standards**
9. **Responsive Behavior** (if multi-device)
10. **Design Decisions & Trade-offs** (what we didn't choose and why)

## Design Decisions: What We DIDN'T Choose (And Why)

Document the decisions you made and alternatives you rejected. This prevents future debates and explains the rationale:

**1. Styling Approach: Custom CSS-in-JS vs Tailwind vs Component Library (2025 Update)**

**What we chose**: [Based on tech stack from Session 2]

Read `02-tech-stack.ctx.md` to determine frontend framework, then apply decision tree:

```
Frontend Framework?
├─ React + velocity focus → Tailwind CSS v4 (5x faster builds, zero-runtime)
├─ React + type safety → Panda CSS (zero-runtime, Chakra-like DX, RSC-compatible)
├─ TypeScript-first → Vanilla Extract (compile-time type safety)
├─ Legacy codebase with CSS-in-JS → Emotion (with migration plan)
└─ Vue/Svelte → TailwindCSS v4 or framework-specific solutions
```

**2025 CSS Tooling Landscape**:

| Tool | Status | Build Speed | Runtime Cost | Type Safety | Recommendation |
|------|--------|-------------|--------------|-------------|----------------|
| **Tailwind CSS v4** | Active | 5x faster | Zero | Config-based | ✅ Default choice (fastest, most mature) |
| **Panda CSS** | Active | Fast | Zero | Full TypeScript | ✅ For Chakra migration, RSC apps |
| **Vanilla Extract** | Active | Fast | Zero | Full TypeScript | ✅ For strict type requirements |
| **Emotion** | Active | Standard | 20-30KB | Limited | ⚠️ Legacy codebases only |
| **styled-components** | Maintenance | Standard | 20-30KB | Limited | ❌ MAINTENANCE MODE (March 2025) - Avoid new projects |

**IMPORTANT: styled-components Deprecation Notice**:
- ⚠️ **MAINTENANCE MODE** as of March 2025 (no new features, security fixes only)
- Migration path: Emotion (short-term) → Zero-runtime solution (long-term)
- Do NOT use for new projects - industry has shifted to zero-runtime solutions

**Zero-Runtime vs Runtime CSS-in-JS**:

| Aspect | Zero-Runtime (Tailwind, Panda, Vanilla Extract) | Runtime CSS-in-JS (Emotion, styled-components) |
|--------|-----------------------------------------------|---------------------------------------------|
| Bundle Size | CSS file only (~30KB) | CSS + 20-30KB JS runtime |
| Hydration | Instant | Delayed (JS must parse first) |
| SSR | No FOUC | Flash of unstyled content (FOUC) risk |
| React Server Components | ✅ Compatible | ❌ Incompatible |
| Core Web Vitals | Better FCP, LCP | Worse FCP, LCP (runtime overhead) |
| TypeScript | Full compile-time checking (Panda, Vanilla Extract) | Runtime-only checking |

**Why This Matters**:
- **Performance**: Runtime CSS-in-JS adds 20-30KB + parsing overhead → slower hydration, worse LCP
- **Future-proof**: React Server Components incompatible with runtime CSS-in-JS
- **DX**: Zero-runtime tools have better TypeScript integration and build performance

**CSS Custom Properties Theming Pattern** (for light/dark mode):

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

/* Prevent flash of incorrect theme (FOIT) */
<script>
  // Execute BEFORE first paint
  const saved = localStorage.getItem('theme');
  if (saved === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else if (saved === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
  } else {
    // Respect system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }
</script>
```

**Example Decision for Compliance SaaS (2025)**:

```markdown
**Decision**: Tailwind CSS v4

**Rationale**:
- Journey requires fast iteration (compliance frameworks change frequently)
- Zero-runtime ensures optimal Core Web Vitals for enterprise procurement
- Design tokens via tailwind.config.ts align with DTCG format (Step 4b)
- Team familiar with utility-first approach
- 5x faster builds vs Tailwind v3 reduce CI/CD time

**Trade-offs**:
- Utility class proliferation in templates (mitigated with @apply for complex components)
- Less dynamic styling vs runtime CSS-in-JS (not needed for journey)

**Migration Path** (if existing styled-components):
1. Phase 1: Install Tailwind CSS v4 alongside styled-components
2. Phase 2: Convert new components to Tailwind (journey-critical first)
3. Phase 3: Gradually migrate existing components
4. Phase 4: Remove styled-components (target: 6 months)
```

**Validation**:
- [ ] CSS architecture decision based on tech stack from Session 2
- [ ] styled-components marked MAINTENANCE MODE if mentioned
- [ ] Zero-runtime options (Tailwind v4, Panda CSS, Vanilla Extract) listed first with checkmarks
- [ ] Performance comparison documents runtime cost (20-30KB overhead)
- [ ] CSS custom properties theming pattern includes FOIT prevention script
- [ ] Decision traces to journey requirements (not arbitrary technology choice)

**2. Design Tokens: Hard-coded vs Design Token System**

**What we chose**: Design token system (CSS variables or Tailwind config)

Why tokens matter:
- **With tokens**: Change `--color-primary` once → updates everywhere
- **Without tokens**: Find/replace 47 instances of `#3B82F6` (error-prone)

**Decision**: Tailwind theme config as source of truth
- Colors, spacing, typography defined centrally
- Can export to Figma tokens for designer handoff

**3. Component Library: MUI / Chakra / shadcn/ui vs Custom**

**Options**:
- **Material UI (MUI)**: Full component library, opinionated design
  - [✓] Choose if: Need rapid development, Material Design acceptable
  - [x] Avoid if: Need custom brand, concerned about bundle size

- **Chakra UI**: Accessible, composable, flexible
  - [✓] Choose if: Accessibility priority, need flexibility
  - [x] Avoid if: Don't need that many components

- **shadcn/ui**: Copy-paste components, full control
  - [✓] Choose if: Want control, can maintain components
  - [x] Avoid if: Team too small to maintain

- **Custom Components**: Built from scratch
  - [✓] Choose if: Unique brand, specific needs, have design resources
  - [x] Avoid if: Small team, tight timeline

**Decision for Compliance SaaS**: shadcn/ui + custom journey components
- Rationale: Flexibility for unique journey flows (upload, assessment)
- Use shadcn for generic (buttons, forms), custom for journey-specific
- Trade-off: More maintenance, but full control over critical path

**4. Icon System: Icon Font vs SVG Components vs Icon Library**

**Options**:
- **Heroicons / Lucide**: SVG component library
  - [✓] Choose if: React/Vue, want tree-shaking, modern approach
- **Font Awesome**: Icon font, wide selection
  - [✓] Choose if: Need huge variety, legacy compatibility
- **Custom SVG sprites**: Minimal, only icons you need
  - [✓] Choose if: Performance-critical, limited icon needs

**Decision**: Lucide React
- Rationale: Tree-shakeable, consistent style, good coverage
- Journey needs: Upload, check, alert, loading, download (~15 icons)

**5. Animation Strategy: Framer Motion vs CSS vs None**

**Philosophy**: Animations should serve journey clarity, not delight

**Decision**: Minimal CSS transitions + loading states
- Button hover: 150ms ease
- Modal enter/exit: 200ms fade
- Loading states: Spinner for <2s, progress bar for >2s
- **No** page transitions (distraction from workflow)
- **No** microinteractions (business tool, not consumer app)

Rationale: B2B users prioritize speed over delight

## Validation

- [ ] Design personality matches brand strategy from Session 5?
- [ ] Colors, typography, and visual style align with brand?
- [ ] Every component maps to a journey step?
- [ ] Information density matches user needs?
- [ ] Accessibility standards appropriate for industry?

## After Generation

```
[✓] Session 6 complete! Design system created.

Your design brings your brand to life and optimizes for [journey context]:
- Brand Personality (from Session 5): [Attributes]
- Visual Expression: [Colors, typography aligned with brand]
- Key components for journey Step [X]
- Accessibility: [Standard]

File created: product-guidelines/06-design-system.md

Next, we'll design your database schema.

When ready, run: /design-database-schema
Or check progress: /cascade-status
```

## Reference

- Template: `/templates/06-design-system-template.md`
- Example: `/examples/compliance-saas/design/06-design-system.md`

---

**Now, create a design system optimized for this specific journey!**

## After Generating Design System Document

Once you've written `product-guidelines/06-design-system.md`, invoke the distillation agent to create a context file:

Use the Task tool:
- **subagent_type**: `general-purpose`
- **description**: `Generate design system context file`
- **prompt**:
  ```
  Invoke the context distillation agent to create token-optimized context file.

  Source file: product-guidelines/06-design-system.md
  Output file: product-guidelines/06-design-system.ctx.md

  Follow the distillation agent specification in .claude/agents/distill-context.md to:
  1. Extract ALL design specifications: colors, typography, components, tokens (CRITICAL)
  2. Extract component states and accessibility standards
  3. Remove design philosophy elaboration, pattern explanations
  4. Preserve section structure from source file
  5. Achieve 60-70% token reduction
  6. Add source reference header
  7. Write to output file path
  ```

## Output Format

IMPORTANT: Do not use emojis in generated outputs. Use plain text for all communication.
