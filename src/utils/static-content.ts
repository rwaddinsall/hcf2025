/**
 * Static Content Helper
 *
 * Provides TypeScript-safe access to statically fetched Strapi content.
 * This replaces runtime API calls with build-time static content access.
 *
 * Usage:
 *   import { getAllInfoPages, getInfoPageBySlug } from '../utils/static-content';
 *   const pages = getAllInfoPages();
 *   const page = getInfoPageBySlug('accessibility');
 */

import staticContent from "../data/strapi-content.json";
import type {
  InfoPage,
  Artist,
  ScrollingHeaderText,
  AcknowledgementOfCountry,
  ApplicationsPage,
  GeneralPage,
} from "../interfaces/strapi";

// Type-safe access to static content
const content = staticContent as any;

/**
 * Info Pages Functions
 */

export function getAllInfoPages(): InfoPage[] {
  return content.infoPages || [];
}

export function getInfoPageBySlug(slug: string): InfoPage | null {
  const pages = getAllInfoPages();
  return pages.find((page) => page.slug === slug) || null;
}

export function getInfoPagesForNavigation() {
  return content.infoPagesForNavigation || [];
}

/**
 * General Pages Functions
 */

export function getAllGeneralPages(): GeneralPage[] {
  return content.generalPagesForFooter || [];
}

export function getGeneralPageBySlug(slug: string): GeneralPage | null {
  const pages = getAllGeneralPages();
  return pages.find((page) => page.slug === slug) || null;
}

/**
 * Artists Functions
 */

export function getAllArtists(): Artist[] {
  return content.artists || [];
}

export function getArtistBySlug(slug: string): Artist | null {
  const artists = getAllArtists();
  return (
    artists.find(
      (artist) => artist.name?.toLowerCase().replace(/\s+/g, "-") === slug
    ) || null
  );
}

/**
 * Scrolling Text Functions
 */

export function getScrollingHeaderText(): ScrollingHeaderText | null {
  return content.scrollingHeaderText;
}

export function getAcknowledgementOfCountry(): AcknowledgementOfCountry | null {
  return content.acknowledgementOfCountry;
}

/**
 * Call-to-Action Functions
 */

export function getBigLinkData(): any | null {
  return content.bigLink;
}

/**
 * Applications Page Functions
 */

export function getApplicationsPage(): ApplicationsPage | null {
  return content.applicationsPage || null;
}

/**
 * Footer Functions
 */

export function getGeneralPagesForFooter(): any[] {
  return content.generalPagesForFooter || [];
}

/**
 * Utility Functions
 */

export function getContentMetadata() {
  return {
    fetchedAt: content.fetchedAt,
    strapiUrl: content.strapiUrl,
    totalInfoPages: content.infoPages?.length || 0,
    totalArtists: content.artists?.length || 0,
  };
}

/**
 * Generate static paths for dynamic routes
 * Used by getStaticPaths() in Astro pages
 */

export function getInfoPageStaticPaths() {
  const pages = getAllInfoPages();
  return pages.map((page) => ({
    params: { slug: page.slug },
    props: { page },
  }));
}

export function getGeneralPageStaticPaths() {
  const pages = getAllGeneralPages();
  return pages.map((page) => ({
    params: { slug: page.slug },
    props: { page },
  }));
}

export function getArtistStaticPaths() {
  const artists = getAllArtists();
  return artists.map((artist) => ({
    params: {
      slug: artist.name?.toLowerCase().replace(/\s+/g, "-") || "unknown",
    },
    props: { artist },
  }));
}

/**
 * Helper function to construct Strapi media URLs
 * (Copied from existing strapi.ts for compatibility)
 */
export function getStrapiImageUrl(image: any): string | null {
  if (!image) return null;

  // Handle Strapi 5 media format
  if (image.url) {
    return image.url.startsWith("http")
      ? image.url
      : `${content.strapiUrl}${image.url}`;
  }

  return null;
}

/**
 * Helper function to format Strapi dates
 * (Copied from existing strapi.ts for compatibility)
 */
export function formatStrapiDate(dateString: string): string {
  try {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
}
