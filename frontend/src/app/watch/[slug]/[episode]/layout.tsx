import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { createPageMetadata, fetchSeriesSeo, siteDescription, trimDescription } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; episode: string }>;
}): Promise<Metadata> {
  const { slug, episode } = await params;
  const series = await fetchSeriesSeo(slug);
  const episodeNumber = Number.parseInt(episode, 10) || 1;

  if (!series) {
    return createPageMetadata({
      title: `รับชมตอนที่ ${episodeNumber}`,
      description: siteDescription,
      canonical: `/watch/${encodeURIComponent(slug)}/${episodeNumber}`,
      noIndex: true,
    });
  }

  return createPageMetadata({
    title: `${series.title} ตอนที่ ${episodeNumber}`,
    description: trimDescription(`ดู ${series.title} ตอนที่ ${episodeNumber} บน SeriesApp`),
    image: series.posterUrl,
    canonical: `/watch/${encodeURIComponent(slug)}/${episodeNumber}`,
    noIndex: true,
  });
}

export default function WatchLayout({ children }: { children: ReactNode }) {
  return children;
}
