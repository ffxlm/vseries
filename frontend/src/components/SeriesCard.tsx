import Link from 'next/link';
import ExternalImage from './ExternalImage';
import LanguageBadge from './LanguageBadge';

export interface SeriesProps {
  _id: string;
  title: string;
  slug: string;
  posterUrl: string;
  languageType: 'thai_dub' | 'thai_sub';
  totalEpisodes: number;
  views: number;
}

export default function SeriesCard({ series }: { series: SeriesProps }) {
  return (
    <Link href={`/series/${series.slug}`} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden rounded-lg border border-white/10 bg-[#1b1b1d] shadow-sm transition-all duration-200 group-hover:-translate-y-0.5 group-hover:border-[var(--color-primary)]/60">
        <ExternalImage
          src={series.posterUrl}
          alt={series.title}
          fill
          sizes="(max-width: 640px) 45vw, (max-width: 1024px) 22vw, 180px"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
        <LanguageBadge languageType={series.languageType} className="absolute left-2 top-2" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/70 to-transparent opacity-80" />
      </div>
      <div className="pt-2">
        <h3 className="line-clamp-2 text-sm font-bold leading-snug text-white transition-colors group-hover:text-[var(--color-primary)] md:text-[15px]">
          {series.title}
        </h3>
      </div>
    </Link>
  );
}
