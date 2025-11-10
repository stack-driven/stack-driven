---
description: Session 4 - Create design system optimized for user journey
---

# Session 4: Create Design System

This is **Session 4** of the cascade. You'll create a design system that serves the user journey, not a generic component library.

## Your Role

Infer design needs from journey context and create a system optimized for the specific user flows.

## Process

### Step 1: Read Previous Outputs

```
Read: output/00-user-journey.md (for user context, interaction needs)
Read: output/01-tech-stack.md (for technical constraints)
```

### Step 2: Infer Design Needs

**Brand Personality** (from journey context):
- B2B SaaS compliance tool? → Trustworthy, professional, efficient
- Consumer creative app? → Playful, inspiring, expressive
- Internal enterprise tool? → Efficient, clear, minimal friction

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

### Step 3: Define Design Tokens

**Colors**: Match brand personality
- Trust-focused? → Blues
- Creative? → Vibrant multi-color
- Efficient? → Monochrome + accent

**Typography**: Match use case
- Dense information? → High legibility (Inter, etc.)
- Marketing-heavy? → Distinctive brand fonts
- Technical? → Monospace for code/data

**Spacing**: Match information density needs
- Power users? → Tighter spacing (more on screen)
- Casual users? → Generous spacing (less overwhelming)

### Step 4: Map Components to Journey

Create table showing:
| Journey Step | UI Components Needed | Design Priority |
|--------------|---------------------|-----------------|
| Step 1 | Upload zone, file list | Large touch targets, clear feedback |
| Step 2 | Checkbox list, search | Smart defaults, fast selection |
| Step 3 | Progress bar, status | Real-time updates, clear ETA |
| Step 4 | Data cards, filters | Scannable, information density |

## Generating the Output

### Create: `output/06-design-system.md`

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

## Validation

- [ ] Design personality matches user context (not arbitrary)?
- [ ] Every component maps to a journey step?
- [ ] Information density matches user needs?
- [ ] Accessibility standards appropriate for industry?

## After Generation

```
✅ Session 4 complete! Design system created.

Your design optimized for [journey context]:
- Personality: [Attributes]
- Key components for journey Step [X]
- Accessibility: [Standard]

File created: output/06-design-system.md

Next, we'll generate a backlog of user stories derived from your journey.

When ready, run: /generate-backlog
Or check progress: /cascade-status
```

## Reference

- Template: `/templates/06-design-system-template.md`
- Example: `/examples/compliance-saas/design/06-design-system.md`

---

**Now, create a design system optimized for this specific journey!**
