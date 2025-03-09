# Resume Builder Styling Guide

This document outlines the styling and color standards for the Resume Builder application.

## Color Themes

The application uses a set of predefined color themes that can be applied to resumes. Each theme consists of a primary and secondary color.

### Available Color Themes

| Theme Name | Primary Color | Secondary Color | Use Case |
|------------|--------------|----------------|----------|
| Blue       | #2563eb      | #93c5fd        | Default, professional |
| Green      | #059669      | #a7f3d0        | Finance, healthcare |
| Purple     | #7c3aed      | #c4b5fd        | Creative, design |
| Red        | #dc2626      | #fca5a5        | Marketing, sales |
| Amber      | #d97706      | #fcd34d        | Education, hospitality |
| Gray       | #4b5563      | #d1d5db        | Corporate, legal |
| Teal       | #0d9488      | #99f6e4        | Medical, science |
| Indigo     | #4338ca      | #a5b4fc        | Technology, IT |
| Rose       | #e11d48      | #fda4af        | Fashion, beauty |
| Cyan       | #0891b2      | #a5f3fc        | Travel, hospitality |
| Emerald    | #059669      | #6ee7b7        | Environmental, sustainability |
| Slate      | #334155      | #cbd5e1        | Business, finance |

## Dark Mode Support

The application supports both light and dark modes. The color themes are designed to work well in both modes.

### Dark Mode Colors

- Background: `bg-gray-900`
- Text: `text-gray-100`
- Card Background: `bg-gray-800`
- Border: `border-gray-700`

### Light Mode Colors

- Background: `bg-gray-50`
- Text: `text-gray-900`
- Card Background: `bg-white`
- Border: `border-gray-200`

## Typography

The application uses the following font families:

- Sans-serif: Inter, system-ui, sans-serif
- Serif: Merriweather, Georgia, serif
- Monospace: Roboto Mono, monospace

### Font Sizes

- Headings:
  - h1: `text-2xl` (1.5rem)
  - h2: `text-xl` (1.25rem)
  - h3: `text-lg` (1.125rem)
  - h4: `text-base` (1rem)
  - h5: `text-sm` (0.875rem)
  - h6: `text-xs` (0.75rem)

- Body: `text-base` (1rem)
- Small: `text-sm` (0.875rem)
- Extra Small: `text-xs` (0.75rem)

## Component Styling

### Buttons

The application provides several button styles and sizes:

#### Button Variants

```html
<!-- Primary Button -->
<button class="btn btn-primary">Primary Button</button>

<!-- Secondary Button -->
<button class="btn btn-secondary">Secondary Button</button>

<!-- Danger Button -->
<button class="btn btn-danger">Danger Button</button>

<!-- Success Button -->
<button class="btn btn-success">Success Button</button>

<!-- Warning Button -->
<button class="btn btn-warning">Warning Button</button>

<!-- Info Button -->
<button class="btn btn-info">Info Button</button>

<!-- Outline Primary Button -->
<button class="btn btn-outline-primary">Outline Primary</button>

<!-- Outline Secondary Button -->
<button class="btn btn-outline-secondary">Outline Secondary</button>
```

#### Button Sizes

```html
<!-- Extra Small Button -->
<button class="btn btn-primary btn-xs">Extra Small</button>

<!-- Small Button -->
<button class="btn btn-primary btn-sm">Small</button>

<!-- Default Size Button -->
<button class="btn btn-primary">Default</button>

<!-- Large Button -->
<button class="btn btn-primary btn-lg">Large</button>

<!-- Extra Large Button -->
<button class="btn btn-primary btn-xl">Extra Large</button>

<!-- Icon Button -->
<button class="btn btn-primary btn-icon">
  <svg><!-- Icon SVG --></svg>
</button>
```

#### Button with Icon

```html
<!-- Button with Icon -->
<button class="btn btn-primary">
  <svg class="mr-2 h-4 w-4"><!-- Icon SVG --></svg>
  Button with Icon
</button>
```

### Inputs

```html
<!-- Standard Input -->
<input type="text" class="input" placeholder="Enter text">
```

### Cards

```html
<!-- Standard Card -->
<div class="card">
  <h3 class="text-lg font-semibold mb-2">Card Title</h3>
  <p>Card content goes here.</p>
</div>
```

## Transitions and Animations

All color transitions use a duration of 300ms for a smooth experience:

```css
* {
  transition: background-color 0.3s, 
              border-color 0.3s, 
              color 0.3s,
              fill 0.3s,
              stroke 0.3s;
}
```

## Responsive Design

The application is designed to be responsive across all device sizes:

- Mobile: < 640px
- Tablet: 640px - 768px
- Laptop: 768px - 1024px
- Desktop: > 1024px

## Accessibility

All color combinations meet WCAG 2.1 AA standards for contrast. The application supports keyboard navigation and screen readers.

## Implementation

The styling is implemented using Tailwind CSS. The color themes are defined in `src/utils/themeUtils.ts` and the global styles are defined in `src/index.css`.

To use the styling in your components, import the appropriate utilities and apply the classes as needed.

```tsx
import { useTheme } from '../contexts/ThemeContext';

function MyComponent() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={`card ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
      <h3 className="text-lg font-semibold mb-2">My Component</h3>
      <p>Content goes here.</p>
      <button className="btn btn-primary">Click Me</button>
    </div>
  );
}
``` 