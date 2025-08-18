# Flowbite Accordion Component Usage Guide

## Overview

Your new `Accordion.astro` component uses Flowbite for enhanced functionality while respecting your existing design system. Here's how to migrate from the old accessible-astro-components accordion to this new implementation.

## Key Features

✅ **Flowbite-powered** - Uses Flowbite's robust accordion functionality
✅ **Custom styling** - Black hover background with white text as requested
✅ **Design system integration** - Uses your CSS custom properties and design tokens
✅ **TypeScript support** - Fully typed interfaces
✅ **Accessibility** - Maintains WCAG compliance with proper ARIA attributes
✅ **Flexible** - Supports both collapse and always-open modes

## Migration Example

### OLD (accessible-astro-components):

```astro
---
import { Accordion, AccordionItem } from 'accessible-astro-components'
---

<Accordion>
  {
    faqData.flatMap((section) =>
      (section.accordions || []).map((accordion) => (
        <AccordionItem title={accordion.title}>
          <div set:html={accordion.details} />
        </AccordionItem>
      )),
    )
  }
</Accordion>
```

### NEW (Flowbite-based):

```astro
---
import Accordion from '../components/Accordion.astro'

// Transform your data into the expected format
const accordionSections = faqData.flatMap((section) =>
  (section.accordions || []).map((accordion) => ({
    title: accordion.title,
    details: accordion.details,
    category: accordion.category,
  })),
)
---

<Accordion sections={accordionSections} name="sustainability-faq" alwaysOpen={false} className="mx-auto max-w-4xl" />
```

## Component Props

| Prop         | Type                 | Default  | Description                                           |
| ------------ | -------------------- | -------- | ----------------------------------------------------- |
| `sections`   | `AccordionSection[]` | Required | Array of accordion sections                           |
| `name`       | `string`             | Required | Unique identifier for the accordion group             |
| `alwaysOpen` | `boolean`            | `false`  | If true, multiple sections can be open simultaneously |
| `className`  | `string`             | `''`     | Additional CSS classes                                |

## AccordionSection Interface

```typescript
interface AccordionSection {
  title: string // Section header text
  details: any // HTML content (can be string or sanitized HTML)
  category?: string // Optional categorization
}
```

## Styling Customization

The component uses your existing design tokens:

- **Colors**: Uses `--color-neutral-*` variables from your `_root.scss`
- **Typography**: Uses `--font-heading` and `--font-body` variables
- **Spacing**: Uses `--space-*` variables for consistent spacing
- **Animations**: Uses `--animation-speed-*` and `--cubic-bezier` variables

### Custom Hover Behavior

As requested, accordion titles have:

- **Default**: Light gray text (`text-neutral-700`)
- **Hover**: Black background (`bg-neutral-900`) with white text (`text-white`)
- **Active**: Maintains the black/white theme when expanded

## Installation Steps

1. **✅ Flowbite is already installed** in your `package.json`
2. **✅ Component is created** at `src/components/Accordion.astro`
3. **Update your pages** to use the new component (see examples below)

## Example Usage in Your Pages

### For sustainability.astro:

```astro
---
import DefaultLayout from '../layouts/DefaultLayout.astro'
import Accordion from '../components/Accordion.astro'
import { fetchSustainabilityPage } from '../lib/strapi'

// ... your existing data fetching code ...

// Transform FAQ data for the new accordion
const accordionSections = faqData.flatMap((section) =>
  (section.accordions || []).map((accordion) => ({
    title: accordion.title,
    details: accordion.details,
    category: accordion.category,
  })),
)
---

<DefaultLayout title="Sustainability" description="...">
  <section class="bg-neutral-50 py-16">
    <div class="container">
      <div class="mx-auto max-w-4xl">
        <!-- Your existing content -->

        <Accordion sections={accordionSections} name="sustainability-faq" alwaysOpen={false} className="mt-8" />
      </div>
    </div>
  </section>
</DefaultLayout>
```

### For applications.astro:

```astro
---
import Accordion from '../components/Accordion.astro'

// ... existing code ...

const applicationSections = faqData.flatMap((section) =>
  (section.accordions || []).map((accordion) => ({
    title: accordion.title,
    details: accordion.details,
    category: accordion.category,
  })),
)
---

<Accordion
  sections={applicationSections}
  name="applications-faq"
  alwaysOpen={true}
  <!--
  Allow
  multiple
  sections
  open
  at
  once
  --
>
  className="max-w-4xl mx-auto" /></Accordion
>
```

## Advanced Features

### Multiple Accordions on Same Page

```astro
<!-- FAQ Accordion -->
<Accordion sections={faqSections} name="faq" alwaysOpen={false} />

<!-- Instructions Accordion -->
<Accordion sections={instructionSections} name="instructions" alwaysOpen={true} />
```

### Custom Styling

```astro
<Accordion sections={sections} name="custom" className="rounded-xl border-2 border-red-500 shadow-lg" />
```

## Browser Support

- ✅ Modern browsers (Chrome, Firefox, Safari, Edge)
- ✅ Mobile responsive
- ✅ Keyboard navigation
- ✅ Screen reader compatible

## Performance Notes

- Flowbite JavaScript is loaded once and handles all accordions
- CSS animations use hardware acceleration
- Minimal DOM manipulation for smooth performance
