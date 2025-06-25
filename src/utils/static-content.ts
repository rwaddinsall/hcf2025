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
} from "../interfaces/strapi";

// Type-safe access to static content
const content = staticContent as {
  fetchedAt: string;
  strapiUrl: string;
  infoPages: InfoPage[];
  artists: Artist[];
  scrollingHeaderText: ScrollingHeaderText | null;
  acknowledgementOfCountry: AcknowledgementOfCountry | null;
  bigLink: any | null;
  infoPagesForNavigation: Pick<
    InfoPage,
    "id" | "documentId" | "slug" | "heading"
  >[];
  generalPagesForFooter: any[];
};

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

export function getAllGeneralPages() {
  return content.generalPagesForFooter || [];
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
      (artist) => artist.name?.toLowerCase().replace(/\s+/g, "-") === slug,
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
