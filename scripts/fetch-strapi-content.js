#!/usr/bin/env node

/**
 * Strapi Content Fetcher
 *
 * This script fetches all content from Strapi at build time and saves it
 * to a static JSON file for use during static site generation.
 *
 * Purpose: Convert runtime API calls to build-time static content generation
 * Result: 95%+ reduction in Strapi API calls during site operation
 */

import { writeFileSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

// Get current file directory for relative paths
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Configuration
const STRAPI_URL = process.env.PUBLIC_STRAPI_URL || 'https://healing-dance-c1ea66b091.strapiapp.com'
const OUTPUT_DIR = join(__dirname, '../src/data')
const OUTPUT_FILE = join(OUTPUT_DIR, 'strapi-content.json')

console.log('🚀 Starting Strapi content fetch...')
console.log(`📡 Strapi URL: ${STRAPI_URL}`)

/**
 * Generic fetch function with error handling
 */
async function fetchFromStrapi(endpoint, queryParams = {}) {
  const url = new URL(`${STRAPI_URL}/api/${endpoint}`)

  // Add query parameters
  Object.entries(queryParams).forEach(([key, value]) => {
    url.searchParams.append(key, value)
  })

  try {
    console.log(`   🔄 Fetching: ${endpoint}`)
    const response = await fetch(url.toString())

    if (!response.ok) {
      if (response.status === 404) {
        console.log(`   ⚠️  Content type '${endpoint}' not found (404) - skipping`)
        return null
      }
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()

    // Handle Strapi error responses
    if (data.error) {
      throw new Error(data.error.message || 'Unknown Strapi error')
    }

    const count = Array.isArray(data.data) ? data.data.length : data.data ? 1 : 0
    console.log(`   ✅ Success: ${count} items`)

    return data
  } catch (error) {
    console.error(`   ❌ Error fetching ${endpoint}:`, error.message)
    return null
  }
}

/**
 * Main content fetching function
 */
async function fetchAllContent() {
  const content = {
    // Metadata
    fetchedAt: new Date().toISOString(),
    strapiUrl: STRAPI_URL,

    // Content types (based on your existing API calls)
    infoPages: [],
    artists: [],
    scrollingHeaderText: null,
    acknowledgementOfCountry: null,
    bigLink: null,
    applicationsPage: null, // Add applications page

    // Navigation helpers
    infoPagesForNavigation: [],
    generalPagesForFooter: [], // Will be empty but prevents errors
  }

  try {
    console.log('\n📂 Fetching content types...\n')

    // 1. Info Pages (for main content)
    const infoPages = await fetchFromStrapi('info-pages', {
      'filters[publishedAt][$notNull]': 'true',
      'populate[accordion][populate]': '*',
      sort: 'heading:asc',
    })
    if (infoPages?.data) {
      content.infoPages = infoPages.data
    }

    // 2. Info Pages for Navigation (lightweight)
    const infoNavPages = await fetchFromStrapi('info-pages', {
      'filters[publishedAt][$notNull]': 'true',
      fields: 'slug,heading',
      sort: 'heading:asc',
    })
    if (infoNavPages?.data) {
      content.infoPagesForNavigation = infoNavPages.data
    }

    // 3. Artists
    const artists = await fetchFromStrapi('artists', {
      'filters[publishedAt][$notNull]': 'true',
      populate: '*',
      sort: 'displayOrder:asc',
    })
    if (artists?.data) {
      content.artists = artists.data
    }

    // 4. Scrolling Header Text
    const scrollingHeader = await fetchFromStrapi('scrolling-header-text')
    if (scrollingHeader?.data) {
      content.scrollingHeaderText = scrollingHeader.data
    }

    // 5. Acknowledgement of Country
    const acknowledgement = await fetchFromStrapi('acknowledgement-of-country')
    if (acknowledgement?.data) {
      content.acknowledgementOfCountry = acknowledgement.data
    }

    // 6. Big Link (CTA)
    const bigLink = await fetchFromStrapi('big-link', {
      'populate[BigTicketLink]': '*',
    })
    if (bigLink?.data) {
      content.bigLink = bigLink.data
    }

    // 7. Applications Page (with proper nested population for FAQ accordions)
    const applicationsPage = await fetchFromStrapi('applications-page', {
      'populate[Header]': '*',
      'populate[FAQ][populate][accordions]': '*',
    })
    if (applicationsPage?.data) {
      content.applicationsPage = applicationsPage.data
    }

    // 8. General Pages (legal/static pages like Terms & Conditions, Privacy Policy)
    // Include fields required by GeneralPageLayout (title, slug, subtitle, content, meta)
    const generalPages = await fetchFromStrapi('general-pages', {
      'filters[publishedAt][$notNull]': 'true',
      // Strapi v5: comma-separated list for fields
      fields: 'slug,title,subtitle,content,metaTitle,metaDescription',
      sort: 'title:asc',
    })
    if (generalPages?.data) {
      content.generalPagesForFooter = generalPages.data
    }
  } catch (error) {
    console.error('\n❌ Fatal error during content fetch:', error)
    throw error
  }

  return content
}

/**
 * Save content to JSON file
 */
function saveContent(content) {
  try {
    // Ensure output directory exists
    mkdirSync(OUTPUT_DIR, { recursive: true })

    // Write JSON file with pretty formatting
    writeFileSync(OUTPUT_FILE, JSON.stringify(content, null, 2), 'utf8')

    console.log(`\n💾 Content saved to: ${OUTPUT_FILE}`)

    // Log summary
    console.log('\n📊 Content Summary:')
    console.log(`   Info Pages: ${content.infoPages.length}`)
    console.log(`   Navigation Pages: ${content.infoPagesForNavigation.length}`)
    console.log(`   Artists: ${content.artists.length}`)
    console.log(`   Scrolling Header: ${content.scrollingHeaderText ? '✅' : '❌'}`)
    console.log(`   Acknowledgement: ${content.acknowledgementOfCountry ? '✅' : '❌'}`)
    console.log(`   Big Link: ${content.bigLink ? '✅' : '❌'}`)
    console.log(`   Applications Page: ${content.applicationsPage ? '✅' : '❌'}`)
    console.log(`   General Pages: ${content.generalPagesForFooter.length}`)
  } catch (error) {
    console.error('\n❌ Error saving content:', error)
    throw error
  }
}

/**
 * Main execution
 */
async function main() {
  try {
    const content = await fetchAllContent()
    saveContent(content)

    console.log('\n🎉 Content fetch completed successfully!')
    console.log('👉 Your site can now use static content instead of API calls')
  } catch (error) {
    console.error('\n💥 Content fetch failed:', error.message)
    process.exit(1)
  }
}

// Execute if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}

export default main
