interface Props {
  endpoint: string;
  query?: Record<string, string>;
  wrappedByKey?: string;
  wrappedByList?: boolean;
}

/**
 * Fetches data from the Strapi 5 API with enhanced error handling
 * @param endpoint - The endpoint to fetch from (e.g., 'articles', 'info-pages')
 * @param query - The query parameters to add to the url
 * @param wrappedByKey - The key to unwrap the response from (usually 'data')
 * @param wrappedByList - If the response is a list, unwrap it to get first item
 * @returns Promise<T> - The typed response data
 */
export default async function fetchApi<T>({
  endpoint,
  query,
  wrappedByKey,
  wrappedByList,
}: Props): Promise<T> {
  if (endpoint.startsWith("/")) {
    endpoint = endpoint.slice(1);
  }

  const url = new URL(`${import.meta.env.PUBLIC_STRAPI_URL}/api/${endpoint}`);

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
  }

  try {
    const res = await fetch(url.toString());

    if (!res.ok) {
      const errorText = await res.text();
      console.error(
        `Strapi API Error: ${res.status} ${res.statusText}`,
        "URL:",
        url.toString(),
        "Response:",
        errorText
      );

      throw new Error(
        `Failed to fetch from Strapi: ${res.status} ${res.statusText}`
      );
    }

    let data = await res.json();

    // Handle Strapi 5 error format
    if (data.error) {
      console.error("Strapi API returned error:", data.error);
      throw new Error(data.error.message || "Unknown Strapi error");
    }

    if (wrappedByKey) {
      data = data[wrappedByKey];
    }

    if (wrappedByList) {
      data = data[0];
    }

    return data as T;
  } catch (error) {
    // Re-throw API errors
    if (error instanceof Error) {
      throw error;
    }
    // Handle other errors
    throw new Error(
      `Network error while fetching from Strapi: ${String(error)}`
    );
  }
}

/**
 * Fetches a single info page by slug from Strapi 5
 */
export async function fetchInfoPageBySlug(slug: string) {
  return fetchApi<import("../interfaces/strapi").SingleInfoPageResponse>({
    endpoint: "info-pages",
    query: {
      "filters[slug][$eq]": slug,
      "filters[publishedAt][$notNull]": "true",
      "populate[accordion][populate]": "*",
    },
    wrappedByKey: "data",
    wrappedByList: true,
  });
}

/**
 * Fetches all published articles with basic population
 */
export async function fetchArticles() {
  return fetchApi<import("../interfaces/strapi").ArticleResponse>({
    endpoint: "articles",
    query: {
      "filters[publishedAt][$notNull]": "true",
      populate: "*",
      sort: "createdAt:desc",
    },
    wrappedByKey: "data",
  });
}

/**
 * Fetches a single article by documentId
 */
export async function fetchArticleByDocumentId(documentId: string) {
  return fetchApi<import("../interfaces/strapi").SingleArticleResponse>({
    endpoint: `articles/${documentId}`,
    query: {
      populate: "*",
    },
    wrappedByKey: "data",
  });
}

/**
 * Fetches all artists/performers
 */
export async function fetchArtists() {
  return fetchApi<import("../interfaces/strapi").Artist[]>({
    endpoint: "artists",
    query: {
      "filters[publishedAt][$notNull]": "true",
      populate: "*",
      sort: "displayOrder:asc",
    },
    wrappedByKey: "data",
  });
}

/**
 * Fetches scrolling header text
 */
export async function fetchScrollingHeaderText() {
  return fetchApi<import("../interfaces/strapi").ScrollingHeaderText>({
    endpoint: "scrolling-header-text",
    wrappedByKey: "data",
  });
}

/**
 * Fetches acknowledgement of country text
 */
export async function fetchAcknowledgementOfCountry() {
  return fetchApi<import("../interfaces/strapi").AcknowledgementOfCountry>({
    endpoint: "acknowledgement-of-country",
    wrappedByKey: "data",
  });
}

/**
 * Helper function to construct Strapi media URLs
 */
export function getStrapiImageUrl(image: any): string | null {
  if (!image) return null;

  // Handle Strapi 5 media format
  if (image.url) {
    return image.url.startsWith("http")
      ? image.url
      : `${import.meta.env.PUBLIC_STRAPI_URL}${image.url}`;
  }

  return null;
}

/**
 * Helper function to format Strapi dates
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

/**
 * Fetches call-to-action data from Strapi
 */
export async function fetchCTAData() {
  return fetchApi<any>({
    endpoint: "big-link",
    query: {
      "populate[BigTicketLink]": "*",
    },
    wrappedByKey: "data",
  });
}

/**
 * Fetches all published info pages for static generation
 */
export async function fetchAllInfoPages() {
  return fetchApi<import("../interfaces/strapi").InfoPageResponse>({
    endpoint: "info-pages",
    query: {
      "filters[publishedAt][$notNull]": "true",
      fields: "slug",
    },
    wrappedByKey: "data",
  });
}

/**
 * Fetches all published info pages for navigation with titles
 */
export async function fetchInfoPagesForNavigation() {
  return fetchApi<import("../interfaces/strapi").InfoPageResponse>({
    endpoint: "info-pages",
    query: {
      "filters[publishedAt][$notNull]": "true",
      fields: "slug,heading",
      sort: "heading:asc",
    },
    wrappedByKey: "data",
  });
}

/**
 * Fetches all published general pages for footer legal links
 */
export async function fetchGeneralPagesForFooter() {
  return fetchApi<import("../interfaces/strapi").GeneralPageResponse>({
    endpoint: "general-pages",
    query: {
      "filters[publishedAt][$notNull]": "true",
      fields: "slug,title",
      sort: "title:asc",
    },
    wrappedByKey: "data",
  });
}

/**
 * Fetches applications page content from Strapi
 */
export async function fetchApplicationsPage() {
  return fetchApi<import("../interfaces/strapi").ApplicationsPageResponse>({
    endpoint: "applications-page",
    query: {
      "filters[publishedAt][$notNull]": "true",
      "populate[Header]": "*",
      "populate[Body]": "*",
      "populate[FAQ][populate][accordions]": "*",
    },
    wrappedByKey: "data",
  });
}

/**
 * Fetches sustainability page content from Strapi
 */
export async function fetchSustainabilityPage() {
  return fetchApi<import("../interfaces/strapi").SustainabilityPageResponse>({
    endpoint: "sustainability-page",
    query: {
      "filters[publishedAt][$notNull]": "true",
      "populate[Header]": "*",
      "populate[Body]": "*",
      "populate[Accordion]": "*",
    },
    wrappedByKey: "data",
  });
}
