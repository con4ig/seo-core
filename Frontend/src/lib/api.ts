/**
 * Helper to get Strapi URL both in Server Components (Docker bridge network)
 * and Client Components (Browser localhost).
 *
 * - STRAPI_INTERNAL_API_URL → used by Next.js server (e.g. "http://strapi:1337" in Docker)
 * - NEXT_PUBLIC_STRAPI_API_URL → used by browser (e.g. "http://localhost:1337")
 */
export function getStrapiURL(path = "") {
  const internalUrl =
    process.env.STRAPI_INTERNAL_API_URL || "http://localhost:1337";
  const publicUrl =
    process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337";

  if (typeof window === "undefined") {
    return `${internalUrl}${path}`;
  }

  return `${publicUrl}${path}`;
}

/**
 * Lightweight fetch wrapper for Strapi v5 API.
 * Returns null on failure instead of throwing, so the UI
 * can gracefully render an empty/fallback state.
 */
export async function fetchAPI<T>(
  path: string,
  urlParamsObject: Record<string, string | number | boolean> = {},
  options: RequestInit = {},
): Promise<T | null> {
  const mergedOptions: RequestInit = {
    next: { revalidate: 60 },
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  };

  const queryString = new URLSearchParams(
    urlParamsObject as Record<string, string>,
  ).toString();

  const requestUrl = getStrapiURL(
    `/api${path}${queryString ? `?${queryString}` : ""}`,
  );

  try {
    const response = await fetch(requestUrl, mergedOptions);

    if (!response.ok) {
      console.warn(
        `[Strapi] ${response.status} on ${path} - endpoint may not exist yet`,
      );
      return null;
    }

    return (await response.json()) as T;
  } catch {
    // Connection refused, network error, etc.
    // This is expected when Strapi has no content types configured yet.
    console.warn(`[Strapi] Cannot reach ${path} - is Strapi running?`);
    return null;
  }
}
