# GITHUB COPILOT OPERATIONAL GUIDELINES

## PROJECT STACK

- **Frontend**: Astro 5 + Sass + Tailwind CSS
- **CMS**: Strapi (headless)
- **Starting Theme**: accessible-astro-theme
- **Key Pattern**: Static generation with dynamic CMS content

## CORE PRINCIPLES

- **One file at a time**: Focus on single file edits to prevent corruption
- **Teach while coding**: Explain what I'm doing and why
- **Plan before executing**: Always outline complex changes before implementation
- **Respect existing patterns**: Always check project's design system and styles before creating new ones

## EDIT WORKFLOW

### For Large Files (>300 lines) or Complex Changes

1. **CREATE DETAILED PLAN FIRST**

   ```
   ## PROPOSED EDIT PLAN
   Working with: [filename]
   Total planned edits: [number]

   Edit sequence:
   1. [Specific change] - Purpose: [why]
   2. [Next change] - Purpose: [why]

   Do you approve this plan?
   ```

2. **WAIT FOR CONFIRMATION** before making any edits

3. **EXECUTE ONE EDIT AT A TIME**
   - Show clear before/after snippets
   - Explain what changed and why
   - Mark progress: "✅ Completed edit [#] of [total]"

### For Simple Changes

- Proceed directly with explanation
- Still explain the reasoning behind changes

## DESIGN SYSTEM & STYLING PROTOCOL

### BEFORE Making Styling Decisions

1. **Check for existing design system files:**

   - Look for `/styles/`, `/css/`, `/scss/`, `/design-system/` directories
   - Check for `tokens.css`, `variables.css`, `design-tokens.json`, or similar
   - Review component libraries in `/components/` or `/ui/`
   - Look for style guides, README files, or documentation
   - **Check Tailwind config and custom utilities**
   - **Review Sass partials and mixins**
   - **Leverage existing mixins and functions before creating new ones**

2. **Identify existing patterns:**

   - Tailwind utility classes and custom configurations
   - Sass variables, mixins, and functions
   - Color variables and themes
   - Typography scales and font families
   - Spacing/sizing systems (margins, padding, grid systems)
   - Component naming conventions

3. **When adding new styles:**

   - **FIRST**: Use Tailwind utilities when possible
   - **SECOND**: Check existing Sass variables/mixins
   - **THIRD**: Follow established naming conventions
   - **LAST**: Only create new styles if truly necessary

4. **Document design decisions:**
   - Explain why existing styles don't meet the need
   - Reference which existing patterns influenced new styles
   - Suggest where new styles should be documented

### Example Approach:

```
"I notice you need a button component. Let me check:
- Existing button styles in `/components/Button/`
- Tailwind config for custom colors/spacing
- Sass variables in `/styles/_variables.scss`

Based on the existing system, I'll use Tailwind's `bg-primary-500` and the existing `$button-padding` Sass variable rather than hardcoding values."
```

## TECHNOLOGY STANDARDS

### Astro 5

- Prefer static rendering for performance
- Use islands architecture for JavaScript interactivity
- Leverage built-in optimizations (images, ViewTransitions)
- **Check for existing Astro component patterns before creating new ones**
- Use content collections for structured data
- Implement proper SEO with Astro's built-in features

### Sass (SCSS)

- Use modern Sass features: `@use`, `@forward`, modules
- Avoid `@import` (deprecated)
- Organize with partials: `_variables.scss`, `_mixins.scss`, `_components.scss`
- Use BEM methodology for component styling

### Tailwind CSS

- Prefer utility-first approach
- Use `@apply` sparingly, only for complex component patterns
- Leverage Tailwind's design tokens (spacing, colors, typography)
- Use responsive prefixes and state variants
- **Check tailwind.config.js for custom utilities and theme extensions**
- Combine with Sass for complex calculations and dynamic values

### Strapi CMS Integration

- Use Astro's fetch for API calls
- Implement proper error handling for CMS requests
- Cache CMS responses appropriately
- Type CMS responses with TypeScript interfaces
- Handle missing/optional CMS content gracefully
- Use environment variables for API endpoints

### PHP (8.1+)

- Use modern features: constructor property promotion, union types, match expressions, enums
- Include `declare(strict_types=1);`
- Follow PSR-12 standards
- Add PHPDoc for static analysis

### JavaScript (ES2020+)

- Use: async/await, optional chaining, nullish coalescing, arrow functions
- Avoid: `var`, jQuery, callback patterns
- Include proper error handling with try-catch
- Use ES modules

### HTML/CSS

- **FIRST**: Check existing Tailwind utilities and Sass patterns
- Semantic HTML5 elements
- WCAG 2.1 AA compliance minimum
- Modern CSS: Grid, Flexbox, custom properties, logical properties
- Responsive design with Tailwind's responsive system
- Dark mode support using Tailwind's dark: variant
- **Combine Tailwind utilities with Sass when needed for complex styling**

## CODE QUALITY REQUIREMENTS

### Accessibility

- Always include ARIA labels and roles
- Ensure keyboard navigation
- Provide alt text for images
- Use semantic markup
- Test with Tailwind's focus: and sr-only utilities

### Performance

- Optimize images with Astro's Image component
- Use code splitting for JavaScript islands
- Implement responsive images with srcset
- Leverage Astro's static generation for fast loading
- Purge unused Tailwind classes in production

### Security

- Sanitize all inputs from Strapi CMS
- Use parameterized queries
- Implement CSP headers
- Secure cookie settings
- Validate CMS content before rendering

### Error Handling

- Handle Strapi API failures gracefully
- Distinguish between network, business logic, and runtime errors
- Provide user-friendly messages for CMS content issues
- Log technical details appropriately
- Handle promise rejections explicitly

## DOCUMENTATION

- Include JSDoc comments for functions
- Document Strapi content type relationships
- Document complex Sass mixins and functions
- Provide clear parameter and return types
- Add security considerations where relevant
- **Document any new design patterns or deviations from existing styles**
- Document Tailwind config customizations

## RESPONSE FORMAT

- Use 4 backticks for code blocks with language identifier
- Include filepath comments for specific file modifications
- Use `...existing code...` to indicate unchanged sections
- Explain changes in Markdown outside code blocks
- **When making styling changes, explain which existing patterns were referenced**
- **Specify whether using Tailwind utilities, Sass, or combination**
