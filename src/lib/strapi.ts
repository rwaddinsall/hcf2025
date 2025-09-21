/**
 * Strapi Static Data Integration
 *
 * This file now provides static data access instead of runtime API calls
 * Following Astro best practices for build-time data fetching
 */

import {
  getCollection,
  getSingle,
  getCollectionItemBySlug,
  getCollectionItemByDocumentId,
  formatStrapiDate as staticFormatStrapiDate,
  getStrapiImageUrl as staticGetStrapiImageUrl,
} from "./static-strapi";

import type {
  InfoPage,
  Article,
  Artist,
  ScrollingHeaderText,
  AcknowledgementOfCountry,
  GeneralPage,
  ApplicationsPage,
  SustainabilityPage,
} from "../interfaces/strapi";

/**
 * Fetches a single info page by slug from static data
 */
export async function fetchInfoPageBySlug(
  slug: string
): Promise<InfoPage | null> {
  return getCollectionItemBySlug<InfoPage>("info-pages", slug);
}

/**
 * Fetches all published articles from static data
 * Note: Articles may not be included in current static build
 */
export async function fetchArticles(): Promise<Article[]> {
  const { data } = getCollection<Article>("articles");
  return data;
}

/**
 * Fetches a single article by documentId from static data
 */
export async function fetchArticleByDocumentId(
  documentId: string
): Promise<Article | null> {
  return getCollectionItemByDocumentId<Article>("articles", documentId);
}

/**
 * Fetches all artists/performers from static data
 */
export async function fetchArtists(): Promise<Artist[]> {
  const { data } = getCollection<Artist>("artists");
  return data;
}

/**
 * Fetches scrolling header text from static data
 */
export async function fetchScrollingHeaderText(): Promise<ScrollingHeaderText | null> {
  const { data } = getSingle<ScrollingHeaderText>("scrolling-header-text");
  return data;
}

/**
 * Fetches acknowledgement of country text from static data
 */
export async function fetchAcknowledgementOfCountry(): Promise<AcknowledgementOfCountry | null> {
  const { data } = getSingle<AcknowledgementOfCountry>(
    "acknowledgement-of-country"
  );
  return data;
}

/**
 * Fetches call-to-action data from static data
 */
export async function fetchCTAData(): Promise<any> {
  const { data } = getSingle<any>("big-link");
  return data;
}

/**
 * Fetches all published info pages for static generation
 */
export async function fetchAllInfoPages(): Promise<InfoPage[]> {
  const { data } = getCollection<InfoPage>("info-pages");
  return data;
}

/**
 * Fetches all published info pages for navigation with titles
 */
export async function fetchInfoPagesForNavigation(): Promise<InfoPage[]> {
  const { data } = getCollection<InfoPage>("info-pages");
  return data;
}

/**
 * Fetches all published general pages for footer legal links
 */
export async function fetchGeneralPagesForFooter(): Promise<GeneralPage[]> {
  const { data } = getCollection<GeneralPage>("general-pages");
  return data;
}

/**
 * Fetches applications page content from static data
 */
export async function fetchApplicationsPage(): Promise<ApplicationsPage | null> {
  const { data } = getSingle<ApplicationsPage>("applications-page");
  return data;
}

/**
 * Fetches sustainability page content from static data
 */
export async function fetchSustainabilityPage(): Promise<SustainabilityPage | null> {
  // Note: This would need to be added to the build script if required
  console.warn("Sustainability page not included in static build");
  return null;
}

/**
 * Helper function to construct Strapi media URLs
 * Re-exported from static utility for consistency
 */
export function getStrapiImageUrl(image: any): string | null {
  return staticGetStrapiImageUrl(image);
}

/**
 * Helper function to format Strapi dates
 * Re-exported from static utility for consistency
 */
export function formatStrapiDate(dateString: string): string {
  return staticFormatStrapiDate(dateString);
}

// Legacy support - keep the original fetchApi interface for any edge cases
interface Props {
  endpoint: string;
  query?: Record<string, string>;
  wrappedByKey?: string;
  wrappedByList?: boolean;
}

/**
 * Legacy fetchApi function - now logs a warning and suggests using static methods
 * @deprecated Use the specific fetch functions above or static-strapi utilities directly
 */
export default async function fetchApi<T>({
  endpoint,
  query,
  wrappedByKey,
  wrappedByList,
}: Props): Promise<T> {
  console.warn(
    `fetchApi is deprecated. Use specific fetch functions or static-strapi utilities for endpoint: ${endpoint}`
  );

  // For backwards compatibility, attempt to map to static data
  if (endpoint === "info-pages") {
    const { data } = getCollection<T>("info-pages");
    return wrappedByList ? (data as any)[0] : (data as T);
  }

  if (endpoint === "artists") {
    const { data } = getCollection<T>("artists");
    return data as T;
  }

  if (endpoint === "general-pages") {
    const { data } = getCollection<T>("general-pages");
    return data as T;
  }

  // Single types
  if (endpoint === "scrolling-header-text") {
    const { data } = getSingle<T>("scrolling-header-text");
    return data as T;
  }

  if (endpoint === "acknowledgement-of-country") {
    const { data } = getSingle<T>("acknowledgement-of-country");
    return data as T;
  }

  if (endpoint === "big-link") {
    const { data } = getSingle<T>("big-link");
    return data as T;
  }

  if (endpoint === "applications-page") {
    const { data } = getSingle<T>("applications-page");
    return data as T;
  }

  throw new Error(
    `Endpoint ${endpoint} not supported in static mode. Use build-time fetching instead.`
  );
}
