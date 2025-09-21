/**
 * Static Strapi Data Access Utility
 *
 * Provides static access to pre-fetched Strapi content
 * Following Astro best practices for build-time data integration
 */

import type { StrapiResponse } from "../interfaces/strapi";
import strapiContent from "../data/strapi-content.json";

/**
 * Get static Strapi content by collection type
 * Provides the same interface as runtime fetching but uses pre-fetched data
 */
export function getCollection<T>(
  collection: string,
  params: Record<string, any> = {}
): StrapiResponse<T[]> {
  // Map collection names to content properties
  const collectionMap: Record<string, keyof typeof strapiContent> = {
    "info-pages": "infoPages",
    artists: "artists",
    "general-pages": "generalPagesForFooter",
  };

  const collectionKey = collectionMap[collection];

  if (!collectionKey || !strapiContent[collectionKey]) {
    console.warn(`Collection "${collection}" not found in static content`);
    return { data: [] };
  }

  // Return data in the same format as Strapi API
  return { data: strapiContent[collectionKey] as unknown as T[] };
}

/**
 * Get static Strapi content by single type
 */
export function getSingle<T>(singleType: string): StrapiResponse<T | null> {
  // Map single types to content properties
  const singleTypeMap: Record<string, keyof typeof strapiContent> = {
    "scrolling-header-text": "scrollingHeaderText",
    "acknowledgement-of-country": "acknowledgementOfCountry",
    "big-link": "bigLink",
    "applications-page": "applicationsPage",
  };

  const typeKey = singleTypeMap[singleType];

  if (!typeKey || !strapiContent[typeKey]) {
    console.warn(`Single type "${singleType}" not found in static content`);
    return { data: null };
  }

  // Return data in the same format as Strapi API
  return { data: strapiContent[typeKey] as unknown as T };
}

/**
 * Get a single item from a collection by slug
 * Mimics the behavior of fetchInfoPageBySlug, etc.
 */
export function getCollectionItemBySlug<T>(
  collection: string,
  slug: string,
  params: Record<string, any> = {}
): T | null {
  const { data } = getCollection<any>(collection, params);

  if (!Array.isArray(data)) {
    return null;
  }

  // Find item by slug
  const item = data.find((item: any) => item.slug === slug);
  return item || null;
}

/**
 * Get a single item from a collection by documentId
 * Mimics the behavior of fetchArticleByDocumentId, etc.
 */
export function getCollectionItemByDocumentId<T>(
  collection: string,
  documentId: string,
  params: Record<string, any> = {}
): T | null {
  const { data } = getCollection<any>(collection, params);

  if (!Array.isArray(data)) {
    return null;
  }

  // Find item by documentId
  const item = data.find((item: any) => item.documentId === documentId);
  return item || null;
}

/**
 * Format a Strapi date string to a localized date
 */
export function formatStrapiDate(dateString: string, locale = "en-US"): string {
  try {
    return new Date(dateString).toLocaleDateString(locale, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
}

/**
 * Get the URL for a Strapi image (handles both v4 and v5 formats)
 */
export function getStrapiImageUrl(image: any): string | null {
  if (!image) return null;

  // Handle Strapi v5 format (direct image object with url)
  if (image.url) {
    return image.url.startsWith("http")
      ? image.url
      : `${strapiContent.strapiUrl}${image.url}`;
  }

  // Handle Strapi v4 format (nested data.attributes structure)
  if (image.data?.attributes?.url) {
    const { url } = image.data.attributes;
    return url.startsWith("http") ? url : `${strapiContent.strapiUrl}${url}`;
  }

  return null;
}

/**
 * Get the URL for a Strapi media item
 */
export function getStrapiMediaUrl(url: string | null): string | null {
  if (!url) return null;

  // Handle both relative and absolute URLs
  if (url.startsWith("http")) {
    return url;
  }

  return `${strapiContent.strapiUrl}${url}`;
}

/**
 * Get metadata about the static content (when it was fetched, etc.)
 */
export function getContentMetadata() {
  return {
    fetchedAt: strapiContent.fetchedAt,
    strapiUrl: strapiContent.strapiUrl,
    // Add any other metadata from the static content
  };
}

/**
 * Helper to get navigation items for info pages
 */
export function getInfoPagesForNavigation() {
  return strapiContent.infoPagesForNavigation || [];
}

/**
 * Helper to get general pages for footer
 */
export function getGeneralPagesForFooter() {
  return strapiContent.generalPagesForFooter || [];
}
