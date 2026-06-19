import SeriesCard, { SeriesProps } from '@/components/SeriesCard';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFire, faStar, faFilm } from '@fortawesome/free-solid-svg-icons';
import { createPageMetadata } from '@/lib/seo';
import { getRequiredApiUrl, shouldLogApiFetchError } from '@/lib/api';

export const revalidate = 60;

export const metadata = createPageMetadata({
  title: 'ดูซีรีส์แนวตั้ง พากย์ไทย ซับไทย ออนไลน์ฟรี',
  description: 'แหล่งรวมซีรีส์แนวตั้งยอดนิยม พากย์ไทยและซับไทย ดูฟรีทุกตอน อัปเดตซีรีส์มาใหม่และตอนล่าสุดทุกวัน',
  canonical: '/',
});

type HomeSeries = {
  popular: SeriesProps[];
  newSeries: SeriesProps[];
  latest: SeriesProps[];
};

async function getHomeSeries(): Promise<HomeSeries> {
  try {
    const apiUrl = getRequiredApiUrl('home page series');
    const res = await fetch(`${apiUrl}/series/home`, {
      next: { revalidate: 60 },
    });
    
    if (!res.ok) {
      throw new Error(`Failed to fetch home series: ${res.status}`);
    }
    
    const json = await res.json();
    return {
      popular: json.data?.popular || [],
      newSeries: json.data?.newSeries || [],
      latest: json.data?.latest || [],
    };
  } catch (error) {
    if (shouldLogApiFetchError()) {
      console.error('Error fetching home series:', error);
    }
    throw error;
  }
}

export default async function Home() {
  const { popular, newSeries, latest } = await getHomeSeries();

  return (
    <div className="mx-auto max-w-7xl space-y-10 px-4 py-6 sm:px-6 lg:px-8">
      <SeriesSection title="ซีรีส์ยอดนิยม" icon={faFire} iconClassName="text-orange-400" series={popular} />
      <SeriesSection title="ซีรีส์มาใหม่" icon={faStar} iconClassName="text-yellow-300" series={newSeries} />
      <SeriesSection
        title="ซีรีส์ทั้งหมด"
        icon={faFilm}
        iconClassName="text-[var(--color-primary)]"
        series={latest}
        action={<Link href="/category/all" className="text-sm font-bold text-[var(--color-primary)] hover:underline">ดูเพิ่มเติม</Link>}
      />
    </div>
  );
}

function SeriesSection({
  title,
  icon,
  iconClassName,
  series,
  action,
}: {
  title: string;
  icon: typeof faFilm;
  iconClassName: string;
  series: SeriesProps[];
  action?: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="flex items-center gap-2 text-xl font-bold md:text-2xl">
          <FontAwesomeIcon icon={icon} className={iconClassName} />
          <span>{title}</span>
        </h2>
        {action}
      </div>

      {series.length > 0 ? (
        <div className="grid grid-cols-3 gap-3 md:grid-cols-4 md:gap-4 lg:grid-cols-6">
          {series.map((item) => (
            <SeriesCard key={item._id} series={item} />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-white/10 bg-[#1b1b1d] px-4 py-8 text-center text-sm text-[var(--color-text-secondary)]">
          ยังไม่มีซีรีส์ในหมวดนี้
        </div>
      )}
    </section>
  );
}
