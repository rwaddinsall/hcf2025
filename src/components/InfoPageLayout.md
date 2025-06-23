# InfoPageLayout Component

A reusable Astro component for creating information pages that fetch data from Strapi CMS with graceful fallbacks.

## Features

- **Strapi Integration**: Automatically fetches data using the `fetchInfoPageBySlug` function
- **Graceful Fallbacks**: Works with hardcoded content when Strapi is unavailable
- **Consistent Styling**: Follows the `applications.astro` design patterns
- **Accessibility**: Uses `accessible-astro-components` for accordion functionality
- **Responsive Design**: Optimized for mobile and desktop using existing Sass variables
- **Back Navigation**: Includes configurable back link functionality

## Design System Usage

This component follows the established design patterns from the project:

- **Sass Variables**: Uses existing `--space-*` variables for consistent spacing
- **Tailwind Classes**: Leverages Tailwind utilities for colors (`text-primary-500`, `hover:text-primary-600`)
- **Existing Components**: Reuses `PageHeader`, `Accordion`, and `AccordionItem` components
- **Typography**: Maintains consistent font weights and line heights with CSS custom properties

## Props

```typescript
interface Props {
  slug: string; // Strapi slug to fetch data for
  backLink?: {
    // Optional back navigation
    href: string;
    text: string;
  };
  fallbackTitle?: string; // Title when Strapi data unavailable
  fallbackSubtitle?: string; // Subtitle when Strapi data unavailable
  fallbackSections?: InfoSection[]; // Content when Strapi data unavailable
}
```

## Data Structure

The component expects Strapi data in this format:

```typescript
interface InfoSection {
  title: string;
  content: any[]; // Rich text blocks (paragraphs, lists)
  links?: InfoLink[];
}

interface InfoLink {
  text: string;
  url: string;
}
```

## Usage Examples

### Basic Usage with Strapi

```astro
---
import InfoPageLayout from '../../components/InfoPageLayout.astro';
---

<InfoPageLayout
  slug="camping"
  fallbackTitle="Camping Information"
/>
```

### With Custom Back Link

```astro
---
import InfoPageLayout from '../../components/InfoPageLayout.astro';
---

<InfoPageLayout
  slug="accessibility"
  backLink={{
    href: "/support",
    text: "Back to Support"
  }}
  fallbackTitle="Accessibility Information"
/>
```

### With Comprehensive Fallback Content

```astro
---
import InfoPageLayout from '../../components/InfoPageLayout.astro';

const fallbackSections = [
  {
    title: 'Getting to the Festival',
    content: [
      {
        type: 'paragraph',
        children: [
          { text: 'Hopkins Creek Festival is easily accessible by car, bus, or train.' }
        ]
      },
      {
        type: 'list',
        children: [
          { children: [{ text: 'Free parking available on-site' }] },
          { children: [{ text: 'Shuttle buses from town center' }] },
          { children: [{ text: 'Train station 2km away' }] }
        ]
      }
    ],
    links: [
      {
        text: 'View Map & Directions',
        url: 'https://maps.example.com/festival'
      },
      {
        text: 'Bus Timetables',
        url: '/transport/buses'
      }
    ]
  }
];
---

<InfoPageLayout
  slug="getting-there"
  fallbackTitle="Getting There"
  fallbackSubtitle="Travel information and directions"
  fallbackSections={fallbackSections}
/>
```

## Styling

The component uses a combination of:

- **Tailwind Classes**: For colors, spacing, and responsive design
- **Sass Variables**: For consistent spacing using `--space-*` variables
- **Accessible Components**: Maintains focus management and keyboard navigation

### Key Style Classes

- `.space-content`: Provides consistent vertical spacing between elements
- `.list-disc.list-inside`: Styled lists with proper indentation
- `.text-primary-500`: Primary link color with hover states
- `.border.border-gray-200.rounded-lg.bg-gray-50`: Subtle container styling for link sections

## Strapi Content Structure

The component expects Strapi to return data in this format:

```json
{
  "data": {
    "title": "Camping Information",
    "slug": "camping",
    "pageHeader": {
      "subtitle": "Find your perfect camping spot"
    },
    "faqs": [
      {
        "question": "What camping options are available?",
        "answer": "We offer various camping options including...",
        "links": [
          {
            "text": "Book Camping",
            "url": "https://booking.example.com"
          }
        ]
      }
    ],
    "metaDescription": "Camping information for Hopkins Creek Festival"
  }
}
```

## Error Handling

- **Network Failures**: Gracefully falls back to provided fallback content
- **Missing Data**: Uses fallback title/subtitle when Strapi fields are missing
- **Invalid Slugs**: Logs warning and displays fallback content
- **Malformed Content**: Skips unsupported rich text blocks

## Accessibility Features

- **Semantic HTML**: Uses proper heading hierarchy and list markup
- **Keyboard Navigation**: Accordion components support full keyboard interaction
- **Focus Management**: Maintains proper focus states and outlines
- **Screen Reader Support**: Includes proper ARIA attributes via accessible-astro-components
- **External Link Handling**: Automatically adds `rel="noopener noreferrer"` for external links

## Performance Considerations

- **Static Generation**: Fetches data at build time for optimal performance
- **Minimal JavaScript**: Uses accessible-astro-components for progressive enhancement
- **Image Optimization**: Ready for Astro Image component integration
- **CSS Optimization**: Uses existing design system to minimize bundle size

## Customization

To add new content types or modify styling:

1. **Content Types**: Extend the `InfoSection` interface for new rich text blocks
2. **Styling**: Add new classes to the `<style>` section following existing patterns
3. **Components**: Use the `<slot />` for additional custom content after the main sections

## Integration with Existing Pages

This component can replace hardcoded info pages like:

- `/pages/info/camping.astro`
- `/pages/info/accessibility.astro`
- `/pages/info/getting-there.astro`
- `/pages/info/tickets.astro`

Simply replace the existing content with the `InfoPageLayout` component and appropriate props.
