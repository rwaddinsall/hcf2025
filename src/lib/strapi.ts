interface Props {
  endpoint: string;
  query?: Record<string, string>;
  wrappedByKey?: string;
  wrappedByList?: boolean;
}

/**
 * Fetches data from the Strapi API
 * @param endpoint - The endpoint to fetch from
 * @param query - The query parameters to add to the url
 * @param wrappedByKey - The key to unwrap the response from
 * @param wrappedByList - If the response is a list, unwrap it
 * @returns
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

  console.log("Fetching from URL:", url.toString()); // Debug log

  const res = await fetch(url.toString());

  if (!res.ok) {
    console.error(
      `Failed to fetch from Strapi: ${res.status} ${res.statusText}`,
    );
    throw new Error(
      `Failed to fetch from Strapi: ${res.status} ${res.statusText}`,
    );
  }

  let data = await res.json();
  console.log("Raw response data:", data); // Debug log

  if (wrappedByKey) {
    data = data[wrappedByKey];
  }

  if (wrappedByList) {
    data = data[0];
  }

  return data as T;
}

/**
 * Fetches a single info page by slug from Strapi
 */
export async function fetchInfoPageBySlug(slug: string) {
  return fetchApi<import("../interfaces/strapi").SingleInfoPageResponse>({
    endpoint: "info-pages",
    query: {
      "filters[slug][$eq]": slug,
      "filters[publishedAt][$notNull]": "true",
      "populate[pageHeader][populate]": "*",
      "populate[faqs][populate]": "*",
      "populate[faqs][sort]": "displayOrder:asc",
    },
    wrappedByKey: "data",
    wrappedByList: true,
  });
}
