import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { cache } from 'react';
import SeriesClientView from '@/components/SeriesClientView';
import { createPageMetadata, getSiteUrl, jsonLdScriptProps } from '@/lib/seo';
import { getRequiredApiUrl } from '@/lib/api';

export const revalidate = 60;

const getSeriesDetails = cache(async (slug: string) => {
  const apiUrl = getRequiredApiUrl('series details');
  const decodedSlug = decodeURIComponent(slug);
  const res = await fetch(`${apiUrl}/series/${encodeURIComponent(decodedSlug)}`, {
    next: { revalidate: 60 }
  });

  if (!res.ok) return null;
  const json = await res.json();
  return json.data;
});

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const series = await getSeriesDetails(slug);
  
  if (!series) {
    return createPageMetadata({
      title: 'ไม่พบซีรีส์',
      description: 'ขออภัย ไม่พบซีรีส์ที่คุณกำลังตามหา',
      canonical: `/series/${encodeURIComponent(decodeURIComponent(slug))}`,
    });
  }

  return createPageMetadata({
    title: series.title,
    description: series.description,
    image: series.posterUrl,
    canonical: `/series/${encodeURIComponent(decodeURIComponent(slug))}`,
  });
}

export default async function SeriesDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const series = await getSeriesDetails(slug);

  if (!series) {
    notFound();
  }

  const seriesUrl = `${getSiteUrl()}/series/${encodeURIComponent(decodeURIComponent(slug))}`;
  const seriesJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TVSeries',
    name: series.title,
    description: series.description,
    image: series.posterUrl,
    url: seriesUrl,
    inLanguage: 'th-TH',
    numberOfEpisodes: series.totalEpisodes,
  };
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'หน้าแรก',
        item: getSiteUrl(),
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: series.title,
        item: seriesUrl,
      },
    ],
  };

  return (
    <>
      <script {...jsonLdScriptProps(seriesJsonLd)} />
      <script {...jsonLdScriptProps(breadcrumbJsonLd)} />
      <SeriesClientView series={series} />
    </>
  );
}
