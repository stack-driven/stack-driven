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
- ❌ [Anti-attribute]: [Why this doesn't fit journey]

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
- ✅ Excellent: Spacing scale traces to specific journey steps; layout patterns directly support user tasks; breakpoints based on actual user device data
- ⚠️ Needs Work: Generic spacing values without journey justification; layout patterns that could apply to any product; arbitrary breakpoints

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
- ✅ Excellent: Icon style aligns with brand personality; sizes mapped to specific journey uses; clear guidelines for icon+text vs icon-only
- ⚠️ Needs Work: Generic icon choices; inconsistent sizing; missing accessibility guidance

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
- Primary text on background: [#1a1a1a on #ffffff = 16.2:1] ✅
- Link color on background: [#0066cc on #ffffff = 8.4:1] ✅
- Success indicator: [#059669 on #ffffff = 4.6:1] ✅

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
- ✅ Excellent: All color combinations tested and documented; focus indicators visible on all backgrounds; ARIA patterns mapped to journey components; keyboard shortcuts for critical journey steps
- ⚠️ Needs Work: Untested contrast ratios; missing focus styles; generic ARIA without journey context; no keyboard shortcuts for frequent actions

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
- ✅ Excellent: Motion durations appropriate for interaction type; loading states match journey wait times; micro-interactions mapped to journey actions; clear philosophy guiding motion choices
- ⚠️ Needs Work: Arbitrary durations; generic loading spinners; missing success states for journey milestones

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
- ✅ Excellent: Shadow levels tied to interaction hierarchy; elevation supports journey flow; clear philosophy about when NOT to use shadows
- ⚠️ Needs Work: Arbitrary shadow values; overuse of elevation; missing rationale for depth hierarchy

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
