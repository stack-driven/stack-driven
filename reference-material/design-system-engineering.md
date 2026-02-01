# Design System Engineering: A Comprehensive Implementation Guide

The landscape of design system engineering has shifted dramatically toward **zero-runtime CSS, type-safe tokens, and headless component architectures**. This guide synthesizes current best practices across eight critical domains, providing framework-specific implementation patterns for React, Vue, Angular, and Web Components.

## 1. Design token architecture

Design tokens are the foundation of modern design systems, serving as the single source of truth for visual properties across platforms. The **W3C Design Tokens Community Group (DTCG) format reached its first stable release (v2025.10)** in October 2025, establishing an industry-wide standard now adopted by Figma, Adobe, Sketch, and over 10 major design tools.

### The three-tier token hierarchy

All major design systems—Material Design 3, Ant Design 5, IBM Carbon—implement a three-tier vertical architecture:

| Tier | Purpose | Naming Convention | Example |
|------|---------|-------------------|---------|
| **Primitive/Reference** | Raw values without semantic meaning | `color.blue.500`, `space.16` | `#0066cc`, `16px` |
| **Semantic/Alias** | Contextual meaning for usage | `color.action.primary`, `space.component.padding` | `{color.blue.500}` |
| **Component** | Component-specific overrides | `button.background.primary` | `{color.action.primary}` |

The DTCG format standardizes token files with JSON structure using `$`-prefixed properties:

```json
{
  "$name": "Design System Tokens",
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
          "$type": "color",
          "$description": "Primary action color for interactive elements"
        }
      }
    }
  }
}
```

### Token transformation with Style Dictionary v4

**Style Dictionary v4** provides first-class DTCG support and remains the standard tool for multi-platform token transformation:

```javascript
// style-dictionary.config.js
export default {
  source: ['tokens/**/*.tokens.json'],
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: 'dist/css/',
      files: [{
        destination: 'variables.css',
        format: 'css/variables',
        options: { outputReferences: true }
      }]
    },
    ios: {
      transformGroup: 'ios-swift',
      buildPath: 'dist/ios/',
      files: [{
        destination: 'Tokens.swift',
        format: 'ios-swift/class.swift',
        className: 'DesignTokens'
      }]
    },
    android: {
      transformGroup: 'compose',
      buildPath: 'dist/android/',
      files: [{
        destination: 'Tokens.kt',
        format: 'compose/object'
      }]
    }
  }
}
```

### Version control and distribution

The recommended distribution pipeline integrates **Tokens Studio for Figma** with Git-based version control:

```yaml
# .github/workflows/tokens.yml
name: Token Pipeline
on:
  push:
    paths: ['tokens/**']
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npx style-dictionary build
      - run: npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

Package distribution should expose platform-specific entry points:

```json
{
  "name": "@company/design-tokens",
  "exports": {
    "./css": "./dist/tokens.css",
    "./scss": "./dist/tokens.scss",
    "./js": "./dist/tokens.js",
    "./ios": "./dist/Tokens.swift"
  }
}
```

---

## 2. Component library architecture

### Atomic design in practice

Atomic Design has evolved from rigid methodology to flexible thinking. Modern implementations add a **subatomic layer (tokens)** and emphasize behavioral patterns alongside visual structure:

```
Tokens → Atoms → Molecules → Organisms → Templates → Pages
```

Organizations like Shopify's Polaris and IBM Carbon now treat tokens as the true foundation layer, with "atoms" beginning at the component level. Many teams use domain-specific naming rather than chemistry metaphors while retaining the compositional thinking.

### Component composition patterns

**Compound Components (React)** enable implicit state sharing without prop drilling:

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
    <div 
      role="option" 
      aria-selected={value === selected}
      onClick={() => onChange(value)}
    >
      {children}
    </div>
  );
}

Select.Option = Option;

// Usage
<Select value={selected} onChange={setSelected}>
  <Select.Option value="a">Option A</Select.Option>
  <Select.Option value="b">Option B</Select.Option>
</Select>
```

**Vue Composables** provide the equivalent pattern:

```typescript
// composables/useDisclosure.ts
import { ref, readonly } from 'vue';

export function useDisclosure(initial = false) {
  const isOpen = ref(initial);
  const open = () => { isOpen.value = true; };
  const close = () => { isOpen.value = false; };
  const toggle = () => { isOpen.value = !isOpen.value; };
  
  return { isOpen: readonly(isOpen), open, close, toggle };
}
```

**Angular Service-Based Composition:**

```typescript
@Injectable()
export class DisclosureService {
  private _isOpen = signal(false);
  readonly isOpen = this._isOpen.asReadonly();
  
  open() { this._isOpen.set(true); }
  close() { this._isOpen.set(false); }
  toggle() { this._isOpen.update(v => !v); }
}

@Component({
  providers: [DisclosureService],
  template: `
    <button (click)="disclosure.toggle()">Toggle</button>
    @if (disclosure.isOpen()) {
      <ng-content></ng-content>
    }
  `
})
export class DisclosureComponent {
  disclosure = inject(DisclosureService);
}
```

**Web Components with Slots:**

```javascript
class CardComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <div class="card">
        <header><slot name="header"></slot></header>
        <main><slot></slot></main>
        <footer><slot name="footer"></slot></footer>
      </div>
    `;
  }
}
customElements.define('ds-card', CardComponent);
```

### Type-safe variant management with CVA

**Class Variance Authority (CVA)** has become the standard for defining component variants with TypeScript safety:

```typescript
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md font-medium transition-colors',
  {
    variants: {
      intent: {
        primary: 'bg-blue-600 text-white hover:bg-blue-700',
        secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
        destructive: 'bg-red-600 text-white hover:bg-red-700',
      },
      size: {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4 text-base',
        lg: 'h-12 px-6 text-lg',
      },
    },
    compoundVariants: [
      { intent: 'primary', size: 'lg', class: 'uppercase tracking-wide' },
    ],
    defaultVariants: { intent: 'primary', size: 'md' },
  }
);

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> 
  & VariantProps<typeof buttonVariants>;

const Button = ({ intent, size, className, ...props }: ButtonProps) => (
  <button className={buttonVariants({ intent, size, className })} {...props} />
);
```

### Polymorphic components

The `asChild` pattern (popularized by Radix UI) provides cleaner polymorphism than traditional `as` props:

```tsx
import { Slot } from '@radix-ui/react-slot';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

const Button = ({ asChild, ...props }: ButtonProps) => {
  const Comp = asChild ? Slot : 'button';
  return <Comp {...props} />;
};

// Usage - renders as anchor with button styles
<Button asChild>
  <a href="/home">Go Home</a>
</Button>
```

---

## 3. CSS architecture patterns

The industry has shifted decisively toward **zero-runtime CSS solutions**. Styled-components entered maintenance mode in March 2025, signaling the end of runtime CSS-in-JS dominance.

### Current tool landscape

| Tool | Version | Status | Best For |
|------|---------|--------|----------|
| **Tailwind CSS** | 4.1.18 | ✅ Active | Utility-first design systems |
| **Panda CSS** | 1.8.x | ✅ Active | Type-safe CSS-in-JS replacement |
| **Vanilla Extract** | 1.18.0 | ✅ Active | TypeScript-first styling |
| **UnoCSS** | 66.6.0 | ✅ Active | Custom atomic frameworks |
| **Emotion** | 11.14.1 | ✅ Active | Legacy/migration projects |
| **styled-components** | 6.3.6 | ⚠️ Maintenance | Existing projects only |
| **Stitches** | 1.2.8 | ❌ Deprecated | Migrate away |

### Framework selection criteria

**Choose Tailwind CSS v4** for new projects prioritizing developer velocity and consistent constraints. The v4 release delivers **5x faster builds** and **100x faster incremental compilation**:

```css
/* Tailwind v4 with CSS custom properties */
@theme {
  --color-brand: oklch(0.6 0.2 250);
  --radius-card: 0.5rem;
}

@layer components {
  .btn-primary {
    @apply bg-brand text-white rounded-card px-4 py-2;
  }
}
```

**Choose Panda CSS** for teams migrating from Chakra UI or Emotion who need type-safe styling with zero runtime:

```typescript
// panda.config.ts
import { defineConfig } from '@pandacss/dev';

export default defineConfig({
  theme: {
    extend: {
      semanticTokens: {
        colors: {
          bg: {
            DEFAULT: { value: { base: '#fff', _dark: '#1a1a1a' } },
            subtle: { value: { base: '{colors.gray.50}', _dark: '{colors.gray.900}' } },
          },
        },
      },
      recipes: {
        button: {
          base: { display: 'flex', alignItems: 'center', fontWeight: 'medium' },
          variants: {
            size: {
              sm: { padding: '2', fontSize: 'sm' },
              md: { padding: '4', fontSize: 'md' },
            },
          },
        },
      },
    },
  },
});
```

**Choose Vanilla Extract** for large TypeScript codebases requiring compile-time safety:

```typescript
// styles.css.ts
import { createTheme, style, styleVariants } from '@vanilla-extract/css';

export const [lightTheme, vars] = createTheme({
  color: { bg: '#ffffff', text: '#1a1a1a', primary: '#0066cc' },
  space: { sm: '4px', md: '8px', lg: '16px' },
});

export const darkTheme = createTheme(vars, {
  color: { bg: '#1a1a1a', text: '#f0f0f0', primary: '#66b3ff' },
});

export const button = style({
  backgroundColor: vars.color.primary,
  padding: vars.space.md,
  borderRadius: '4px',
});
```

### Theming with CSS custom properties

Modern theming relies on CSS custom properties with data attributes for mode switching:

```css
:root {
  --color-bg: #ffffff;
  --color-text: #1a1a1a;
  --color-primary: #0066cc;
}

[data-theme="dark"] {
  --color-bg: #1a1a1a;
  --color-text: #f0f0f0;
  --color-primary: #66b3ff;
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --color-bg: #1a1a1a;
    --color-text: #f0f0f0;
  }
}
```

Prevent flash of incorrect theme with an inline script in `<head>`:

```html
<script>
  const saved = localStorage.getItem('theme');
  if (saved) document.documentElement.setAttribute('data-theme', saved);
  else if (matchMedia('(prefers-color-scheme: dark)').matches) 
    document.documentElement.setAttribute('data-theme', 'dark');
</script>
```

---

## 4. Component documentation

### Documentation tool comparison

| Tool | Version | Strengths | Best For |
|------|---------|-----------|----------|
| **Storybook** | 10.1.11 | Component isolation, addons ecosystem, visual testing | Component libraries |
| **Docusaurus** | 3.9.2 | Full documentation sites, AI-powered search | Design system docs portals |
| **Ladle** | v3 | 4x faster than Storybook, minimal config | React-only, performance focus |
| **Histoire** | 1.0.0-beta | Vite-native, markdown docs | Vue/Svelte projects |

**Storybook 10** introduced ESM-only architecture (29% smaller bundles) and native Vitest integration for component testing:

```typescript
// Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  component: Button,
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary'] },
  },
};
export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: { variant: 'primary', children: 'Click me' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button'));
    await expect(canvas.getByRole('button')).toHaveFocus();
  },
};
```

### Visual regression testing

**Chromatic** provides the most integrated Storybook experience, while **Playwright** offers built-in visual comparisons for E2E testing:

```typescript
// Playwright visual test
import { test, expect } from '@playwright/test';

test('button visual regression', async ({ page }) => {
  await page.goto('/storybook/iframe.html?id=button--primary');
  
  await expect(page.locator('.button')).toHaveScreenshot('button-primary.png', {
    maxDiffPixels: 50,
    threshold: 0.2,
    mask: [page.locator('[data-testid="timestamp"]')],
  });
});
```

### Documentation automation

Configure auto-generated prop tables with TypeScript extraction:

```typescript
// .storybook/main.ts
const config: StorybookConfig = {
  framework: '@storybook/react-vite',
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)', '../src/**/*.mdx'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',
    '@chromatic-com/storybook',
    '@storybook/addon-designs', // Figma integration
  ],
  typescript: {
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) => !prop.parent?.fileName.includes('node_modules'),
    },
  },
};
```

---

## 5. Accessibility engineering

### WCAG 2.2 requirements (October 2023)

WCAG 2.2 introduced critical new success criteria:

| Criterion | Level | Requirement |
|-----------|-------|-------------|
| **2.5.8 Target Size** | AA | Minimum **24×24px** touch targets |
| **2.4.11 Focus Not Obscured** | AA | Focused element must be partially visible |
| **3.3.8 Accessible Authentication** | AA | No cognitive function tests for login |

**Color contrast minimums** remain unchanged: **4.5:1** for normal text (AA), **3:1** for large text and UI components.

### ARIA patterns by component type

| Component | Role | Key Attributes | Keyboard |
|-----------|------|----------------|----------|
| **Dialog** | `dialog`, `aria-modal="true"` | `aria-labelledby`, `aria-describedby` | Escape closes, Tab trapped |
| **Menu** | `menu`, `menuitem` | `aria-expanded`, `aria-haspopup` | Arrows navigate, Enter selects |
| **Tabs** | `tablist`, `tab`, `tabpanel` | `aria-selected`, `aria-controls` | Arrows between tabs |
| **Combobox** | `combobox` | `aria-expanded`, `aria-activedescendant` | Arrows navigate, Enter selects |
| **Slider** | `slider` | `aria-valuenow`, `aria-valuemin`, `aria-valuemax` | Arrows adjust value |

### Focus management implementation

```typescript
// Focus trap hook for modals
function useFocusTrap(isOpen: boolean) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!isOpen || !containerRef.current) return;
    
    const focusable = containerRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0] as HTMLElement;
    const last = focusable[focusable.length - 1] as HTMLElement;
    
    first?.focus();
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);
  
  return containerRef;
}
```

### Headless accessibility libraries

| Library | Components | Multi-Framework | Approach |
|---------|------------|-----------------|----------|
| **Radix UI** | 32+ | React only | Unstyled primitives, `asChild` composition |
| **React Aria** | 40+ | React only | Hooks + components, extensive i18n |
| **Headless UI** | 10 | React, Vue | Tailwind-optimized, render props |
| **Ark UI** | 37 | React, Vue, Solid | State machines, full accessibility |

**React Aria** (Adobe) provides the most comprehensive accessibility implementation:

```tsx
import { useButton } from 'react-aria';
import { useRef } from 'react';

function Button(props) {
  const ref = useRef(null);
  const { buttonProps } = useButton(props, ref);
  
  return (
    <button {...buttonProps} ref={ref}>
      {props.children}
    </button>
  );
}
```

---

## 6. Cross-platform consistency

### React Native + Web code sharing

The **react-native-web** approach enables significant code reuse with platform-specific extensions:

```
src/
├── components/
│   ├── Button/
│   │   ├── Button.tsx          # Shared logic
│   │   ├── Button.styles.ts    # Shared styles
│   │   ├── Button.web.tsx      # Web-specific
│   │   └── Button.native.tsx   # iOS + Android
├── hooks/                       # Fully shared
├── utils/                       # Fully shared
└── tokens/                      # Fully shared
```

Platform detection enables conditional rendering:

```typescript
import { Platform, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    ...Platform.select({
      ios: { paddingTop: 44 },
      android: { paddingTop: 24 },
      web: { maxWidth: 1200, margin: '0 auto' },
    }),
  },
});
```

### Responsive vs adaptive patterns

**Responsive** (recommended default): Same components with fluid layouts and CSS breakpoints. Best for web-first applications requiring consistent cross-device experiences.

**Adaptive**: Different component implementations per platform. Best for native-feel experiences where platform conventions differ significantly (e.g., navigation patterns).

```tsx
// Adaptive component selection
const NavigationComponent = Platform.select({
  web: () => require('./SideNavigation').default,
  ios: () => require('./TabNavigation').default,
  android: () => require('./DrawerNavigation').default,
})();
```

### Design handoff workflow

Modern Figma-to-code pipelines use **Figma Variables** synchronized via **Tokens Studio**:

1. **Design**: Define tokens in Figma Variables
2. **Sync**: Push to Git repository via Tokens Studio
3. **Transform**: Style Dictionary generates platform outputs
4. **Distribute**: Publish via npm with platform-specific exports
5. **Update**: Pull changes back to Figma for bidirectional sync

---

## 7. Performance optimization

### Bundle splitting configuration

Configure per-component entry points for optimal tree-shaking:

```json
{
  "name": "@company/design-system",
  "sideEffects": ["**/*.css"],
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "require": "./dist/index.cjs",
      "types": "./dist/index.d.ts"
    },
    "./button": {
      "import": "./dist/button/index.js",
      "types": "./dist/button/index.d.ts"
    },
    "./modal": {
      "import": "./dist/modal/index.js",
      "types": "./dist/modal/index.d.ts"
    }
  }
}
```

### Build tool configuration

**tsup** provides the simplest configuration for library bundling:

```typescript
// tsup.config.ts
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'button/index': 'src/components/Button/index.ts',
    'modal/index': 'src/components/Modal/index.ts',
  },
  format: ['esm', 'cjs'],
  dts: true,
  splitting: true,
  treeshake: true,
  external: ['react', 'react-dom'],
  minify: true,
});
```

**Vite library mode** with `preserveModules` enables optimal tree-shaking in consuming applications:

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
      },
    },
  },
});
```

### Icon optimization

**SVG sprites** deliver **70-90% size reduction** compared to individual React icon components:

```tsx
// Icon component using sprites
export const Icon = ({ name, size = 24, ...props }) => (
  <svg width={size} height={size} aria-hidden="true" {...props}>
    <use href={`/icons/sprite.svg#${name}`} />
  </svg>
);
```

| Method | Bundle Impact | Runtime Performance |
|--------|---------------|---------------------|
| SVG Sprites | ~5KB total | Excellent (cached) |
| React components | ~300-400KB | Poor (JS parsing) |
| Icon fonts | ~50KB | Good |

### Font optimization

```css
@font-face {
  font-family: 'Design System';
  src: url('/fonts/variable.woff2') format('woff2');
  font-display: swap;
  font-weight: 100 900;
  unicode-range: U+0000-00FF; /* Subset to Latin */
}
```

---

## 8. Versioning and migration

### Semantic versioning guidelines

Design systems require nuanced versioning that accounts for both API and visual breaking changes:

| Change Type | Version Bump | Examples |
|-------------|--------------|----------|
| **API Breaking** | MAJOR | Remove props, rename components, change signatures |
| **Visual Breaking** | MAJOR | Typography affecting layout, spacing changes |
| **New Features** | MINOR | New components, new optional props |
| **Deprecations** | MINOR | Mark features deprecated (with warnings) |
| **Bug Fixes** | PATCH | Fix defects, improve performance |

### Migration automation with codemods

**jscodeshift** transforms enable automated prop migrations:

```javascript
// transforms/v2-migrate.js
export default function transformer(file, api) {
  const j = api.jscodeshift;
  
  return j(file.source)
    // Rename isDisabled -> disabled
    .find(j.JSXAttribute, { name: { name: 'isDisabled' } })
    .replaceWith(path => 
      j.jsxAttribute(j.jsxIdentifier('disabled'), path.node.value)
    )
    // Rename variant values
    .find(j.JSXAttribute, { name: { name: 'variant' } })
    .find(j.StringLiteral, { value: 'primary' })
    .replaceWith(() => j.stringLiteral('solid'))
    .toSource();
}
```

Run with: `npx jscodeshift -t transforms/v2-migrate.js src/`

### Deprecation pattern

Implement runtime warnings during the deprecation period:

```typescript
function deprecate<T extends React.ComponentType>(
  Component: T,
  message: string,
  deadline: string
): T {
  const DeprecatedComponent = (props: React.ComponentProps<T>) => {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(
        `[DesignSystem] ${message}\n` +
        `This will be removed in ${deadline}. ` +
        `See migration guide: https://docs.design-system.com/migration`
      );
    }
    return <Component {...props} />;
  };
  return DeprecatedComponent as T;
}

// Usage
export const PrimaryButton = deprecate(
  Button,
  'PrimaryButton is deprecated. Use <Button variant="primary"> instead.',
  'v3.0.0'
);
```

### Deprecation timeline

A **6-month deprecation period** is the industry standard:

1. **Month 0**: Announce deprecation, add console warnings, publish codemods
2. **Month 3**: Warnings become errors in development
3. **Month 6**: Remove deprecated features in next major version

### Lessons from major design systems

**Material UI** exemplifies best practices with comprehensive codemods:
```bash
npx @mui/codemod@latest v6.0.0/styled ./src
npx @mui/codemod@latest v6.0.0/theme-v6 ./src/theme.ts
```

**Ant Design** provides compatibility packages for gradual migration:
```bash
npm install @ant-design/compatible
npx @ant-design/codemod-v5 antd5-codemod ./src
```

**Chakra UI v3** serves as a cautionary tale—the lack of codemods and incomplete documentation led many teams to migrate to alternative systems entirely rather than upgrade.

---

## Conclusion

Modern design system engineering requires a fundamentally different approach than even two years ago. The convergence around **zero-runtime CSS** (Tailwind v4, Panda CSS, Vanilla Extract), **standardized tokens** (DTCG format, Style Dictionary v4), and **headless component architectures** (Radix, React Aria) reflects hard-won industry lessons about performance, maintainability, and developer experience.

Key strategic decisions for new design systems:

- **Tokens**: Adopt DTCG format with Style Dictionary v4 for future-proof interoperability
- **Styling**: Default to Tailwind CSS v4; use Panda CSS for Chakra-like DX with zero runtime
- **Components**: Build on Radix or React Aria primitives; use CVA for variant management
- **Documentation**: Storybook 10 with Chromatic for visual testing
- **Distribution**: Per-component exports with proper `sideEffects` configuration
- **Migration**: Invest in codemods early; plan 6-month deprecation cycles

The design system landscape will continue evolving—Rolldown promises unified dev/build tooling, and framework-agnostic solutions gain traction—but these foundational patterns provide a stable base for production systems today.