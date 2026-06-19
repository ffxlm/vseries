import { MetadataRoute } from 'next';
import { getRequiredApiUrl, shouldLogApiFetchError } from '@/lib/api';
import { getSiteUrl } from '@/lib/seo';

type SitemapSeries = {
  slug: string;
  updatedAt?: string;
  createdAt?: string;
};

async function getSeriesUrls(baseUrl: string): Promise<MetadataRoute.Sitemap> {
  try {
    const apiUrl = getRequiredApiUrl('sitemap generation');
    const routes: MetadataRoute.Sitemap = [];
    let page = 1;
    let hasNextPage = true;

    while (hasNextPage) {
      const res = await fetch(`${apiUrl}/series?limit=1000&page=${page}`, {
        next: { revalidate: 3600 },
      });

      if (!res.ok) return routes;

      const json = await res.json();
      const series = (json.data || []) as SitemapSeries[];

      routes.push(
        ...series
          .filter((item) => item.slug)
          .map((item) => {
            const lastModified = item.updatedAt || item.createdAt;

            return {
              url: `${baseUrl}/series/${encodeURIComponent(item.slug)}`,
              lastModified: lastModified ? new Date(lastModified) : undefined,
              changeFrequency: 'weekly' as const,
              priority: 0.7,
            };
          })
      );

      hasNextPage = Boolean(json.pagination?.hasNextPage);
      page += 1;
    }

    return routes;
  } catch (error) {
    if (shouldLogApiFetchError()) {
      console.error('Error generating dynamic sitemap entries:', error);
    }
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/category/all`,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/category/thai_dub`,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/category/thai_sub`,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/profile`,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
  ];

  const seriesRoutes = await getSeriesUrls(baseUrl);
  return [...staticRoutes, ...seriesRoutes];
}
