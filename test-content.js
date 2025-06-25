import { renderContent, renderSafeContent } from './src/utils/renderContent.js'

// Test the content rendering with sample data similar to what we have in static content
const testContent =
  "If you have any accessibility needs, let us know in advance by using the accessibility field at checkout or by emailing us directly. We'll do our best to support you — and having this info early makes a huge difference.\n\nThings we're working to support:\n\n- Accessible parking close to entry\n- Accessible camping (location, terrain, quiet zones)\n- Stage and viewing accessibility"

console.log('Original content:')
console.log(testContent)
console.log('\n--- RENDERED CONTENT ---')
console.log(renderContent(testContent))
console.log('\n--- SAFE RENDERED CONTENT ---')
console.log(renderSafeContent(testContent))
