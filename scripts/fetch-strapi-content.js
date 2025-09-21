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
    console.log('   🔄 Fetching general pages...')

    const generalPages = await fetchFromStrapi('general-pages', {
      'filters[publishedAt][$notNull]': 'true',
      fields: 'slug,title,subtitle,content,metaTitle,metaDescription',
      sort: 'title:asc',
    })

    if (generalPages?.data && generalPages.data.length > 0) {
      console.log(`   ✅ Found ${generalPages.data.length} general pages`)
      content.generalPagesForFooter = generalPages.data
    } else {
      console.log('   ⚠️ No general pages found or endpoint does not exist')
      console.log('   📝 Creating fallback Terms & Conditions page...')

      // Create a fallback entry for the terms page with full content
      content.generalPagesForFooter = [
        {
          id: 9999,
          documentId: 'terms-conditions-manual',
          slug: 'terms',
          title: 'Terms & Conditions',
          subtitle: 'Terms and Conditions of Ticket Sales',
          content: `<section>
            <h2>1. Definitions</h2>

            <p><strong>1.1</strong> Australian Consumer Law means Schedule 2 of the Competition and Consumer Act 2010 (Cth).</p>

            <p><strong>1.2</strong> Claim means any allegation, debt, cause of action, liability, proceeding, suit or demand of any nature, whether present or future, actual or contingent.</p>

            <p><strong>1.3</strong> Consumer has the meaning in the Australian Consumer Law.</p>

            <p><strong>1.4</strong> Event IP means all intellectual property developed or used to promote the Event.</p>

            <p><strong>1.5</strong> Loss means any cost, expense or damage, including legal costs on a full indemnity basis, whether direct or indirect.</p>

            <p><strong>1.6</strong> Prohibited Items include glass, fireworks, flares, weapons, illegal drugs, N2O chargers, gas bottles, cooking gear, generators, large sound systems, drones, professional audiovisual equipment, lithium batteries that are unsafe or non-compliant, umbrellas and tents outside camping areas, and any other item we deem unsafe or unsuitable.</p>

            <p><strong>1.7</strong> Prohibited <u>Behaviour</u> includes harassment, assault, vandalism, theft, trespass, damage to property, climbing structures, <u>unauthorised</u> fires, disruptive or unsafe conduct, excessive intoxication, littering, anti-social or discriminatory conduct, ignoring safety instructions, or disrupting local communities.</p>

            <p><strong>1.8</strong> Representative means any director, staff, contractor, volunteer, security or agent acting for Hopkins Creek Events.</p>
        </section>

        <section>
            <h2>2. Eligibility, Ticketing and Entry</h2>

            <p><strong>2.1</strong> The Event is strictly 18+. A valid government-issued photo ID is required.</p>

            <p><strong>2.2</strong> Tickets are sold only via Humanitix. Do not buy from <u>unauthorised</u> sellers.</p>

            <p><strong>2.3</strong> Tickets may not be resold above face value, subject to applicable resale laws, including the Major Events Act 2009 (Vic) if declared.</p>

            <p><strong>2.4</strong> Tickets remain the property of Hopkins Creek Events until the gate closes on the final day.</p>

            <p><strong>2.5</strong> Entry requires a valid barcoded ticket and ID. On arrival, your ticket will be exchanged for a wristband. Wristbands must be worn at all times. Once removed, a wristband is void and cannot be reused or replaced.</p>
        </section>

        <section>
            <h2>3. Refunds, Changes and Cancellations</h2>

            <p><strong>3.1</strong> All sales are final. A change in personal circumstances, including illness, travel issues or inability to attend, does not entitle you to a refund or exchange.</p>

            <p><strong>3.2</strong> The Event may change the venue, line up, program, amenities or schedule without notice. Subject to your rights under the Australian Consumer Law, such changes do not entitle you to a refund.</p>

            <p><strong>3.3</strong> Force <u>Majeure</u>. If the Event is cancelled, postponed, curtailed or relocated due to events outside our reasonable control, including fire, flood, extreme weather, natural disaster, public health orders, pandemics, strikes, actions of authorities, or other acts of God:</p>

            <p><strong>a)</strong> If cancellation is announced before gates open, we may offer a refund in line with law, less reasonable administrative or booking fees.</p>

            <p><strong>b)</strong> If the Event is postponed within 12 months, tickets will automatically roll over to the new dates. You may request a refund within 14 days of the postponement announcement, after which rollover applies.</p>

            <p><strong>c)</strong> If cancellation or curtailment occurs on the scheduled event dates after gates have opened, no refunds will be issued, except as required by law.</p>

            <p><strong>3.4</strong> No refunds are provided if you are refused entry or evicted for breaching these Terms, or if you arrive late, leave early, miss performances, or purchase the wrong ticket type.</p>

            <p><strong>3.5</strong> We strongly recommend travel and accommodation insurance to cover losses from cancellation, rescheduling or relocation.</p>

            <p><strong>3.6</strong> Any valid refund will be processed to the original payment method where practicable. Postage, merchant and booking fees are not refundable unless required by law.</p>
        </section>

        <section>
            <h2>4. Site Rules, <u>Behaviour</u> and Safety</h2>

            <p><strong>4.1</strong> Respect attendees, staff, volunteers, <u>neighbours</u> and the environment. Aggressive, threatening or discriminatory <u>behaviour</u> is not tolerated.</p>

            <p><strong>4.2</strong> Follow all lawful and reasonable directions from Representatives and emergency services.</p>

            <p><strong>4.3</strong> Prohibited Items are not allowed on site. Confiscated items will not be returned, replaced or reimbursed.</p>

            <p><strong>4.4</strong> The following are expressly prohibited: moshing, stage diving, crowd surfing, swimming in dams or waterways, or entering any area within 10 <u>metres</u> of food vendors or in water catchment areas.</p>
        </section>

        <section>
            <h2>5. Alcohol, Smoking and Prescription Medication</h2>

            <p><strong>5.1</strong> The Event is a licensed venue. You must be 18+ to purchase or consume alcohol and you must carry valid photo ID.</p>

            <p><strong>5.2</strong> BYO is permitted in limited personal quantities for campsite use only. Kegs and amounts that suggest resale or supply are prohibited.</p>

            <p><strong>5.3</strong> Free voluntary breath testing may be available before exiting. You are responsible for ensuring you are safe and legal to drive.</p>

            <p><strong>5.4</strong> Smoking and vaping are only permitted in designated areas and never within 10 <u>metres</u> of food vendors.</p>

            <p><strong>5.5</strong> Prescription medication. Bring medications in original containers with pharmacy labels that match your ID. Quantities must be limited to personal needs for the Event duration. If you do not meet these requirements, medication may be treated as a Prohibited Item.</p>
        </section>

        <section>
            <h2>6. Intellectual Property, Filming and Photography</h2>

            <p><strong>6.1</strong> All Event IP, designs, text, logos, imagery and artwork are owned by Hopkins Creek Events or <u>licensors</u>. Use without permission is prohibited.</p>

            <p><strong>6.2</strong> By attending, you consent to being photographed, filmed or recorded, and grant us a royalty free, perpetual <u>licence</u> to use such material in any media for promotion and related purposes.</p>

            <p><strong>6.3</strong> Personal mobile phones and non professional compact cameras are permitted. Professional audiovisual equipment, including detachable lens cameras, telephoto lenses, drones and recording gear, is prohibited without written approval. We may cloak or remove <u>unauthorised</u> equipment and may direct deletion or removal of <u>unauthorised</u> content where lawful.</p>
        </section>

        <section>
            <h2>7. Risk, Medical and Third Party Services</h2>

            <p><strong>7.1</strong> Entry is at your own risk. You acknowledge inherent risks including injury or death.</p>

            <p><strong>7.2</strong> You warrant that you are medically and physically fit to attend.</p>

            <p><strong>7.3</strong> We may arrange medical assessment, treatment or evacuation if necessary. You are responsible for any additional costs.</p>
        </section>

        <section>
            <h2>8. Liability, Release and Indemnity</h2>

            <p><strong>8.1</strong> Nothing in these Terms limits your rights or our obligations under the Australian Consumer Law.</p>

            <p><strong>8.2</strong> To the full extent permitted by law:</p>

            <p><strong>a)</strong> Hopkins Creek Events and its Representatives are not liable for any Loss or Claim arising from or in connection with your attendance, including property loss or damage, system outages, third party actions, weather and similar causes beyond our control.</p>

            <p><strong>b)</strong> You release us and our Representatives from all Claims relating to the Event.</p>

            <p><strong>c)</strong> You indemnify us against any Claim or Loss arising from your acts or omissions or your breach of these Terms.</p>

            <p><strong>8.3</strong> This waiver does not exclude liability that cannot be excluded by law, including liability arising from our gross negligence under Victorian law.</p>
        </section>

        <section>
            <h2>9. Privacy and Data</h2>

            <p><strong>9.1</strong> We may collect and hold personal information, including your name, contact details and payment information, to administer the Event.</p>

            <p><strong>9.2</strong> We may disclose your personal information as required by law or to service providers assisting with Event operations. See our website for our privacy statement.</p>

            <p><strong>9.3</strong> You must not conduct surveys, interviews or collect data on site without our written consent.</p>
        </section>

        <section>
            <h2>10. General</h2>

            <p><strong>10.1</strong> These Terms are the entire agreement between you and Hopkins Creek Events.</p>

            <p><strong>10.2</strong> If any part of these Terms is invalid, the remainder continues in effect.</p>

            <p><strong>10.3</strong> We may assign or <u>novate</u> our rights and obligations under these Terms without notice.</p>

            <p><strong>10.4</strong> These Terms are governed by the laws of Victoria, Australia. You submit to the non exclusive jurisdiction of the Victorian courts.</p>
        </section>

        <section>
            <h2>11. Contact</h2>

            <p>Questions or complaints: info@hopkins-creek.com</p>

            <p><strong>Warning:</strong> Participation in the Event may involve recreational services under the Fair Trading Act 1999 (Vic). If you are killed or injured, your rights to sue may be excluded, restricted or modified under the Fair Trading (Recreational Services) Regulations 2004. This does not apply in cases of gross negligence.</p>
        </section>`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          publishedAt: new Date().toISOString(),
        },
      ]
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
