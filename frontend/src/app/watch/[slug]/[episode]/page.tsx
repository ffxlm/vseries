'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faListUl, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { getApiUrl } from '@/lib/api';
import { WatchSkeleton } from '@/components/Skeletons';

const HlsVideoPlayer = dynamic(() => import('@/components/HlsVideoPlayer'), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse bg-white/10" />,
});

interface WatchData {
  seriesId: string;
  title: string;
  slug: string;
  posterUrl?: string;
  totalEpisodes: number;
  currentEpisodeId: string | null;
  currentEpisodeUrl: string;
  nextEpisodeUrl: string;
  hasCurrentEpisode: boolean;
}

interface WatchHistoryItem {
  slug: string;
  title: string;
  posterUrl: string;
  lastWatchedEpisode: number;
  totalEpisodes: number;
  progressPercentage: number;
  timestamp: number;
}


export default function WatchPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const episode = parseInt(params.episode as string) || 1;
  const trackedRef = useRef(false);
  const prefetchedNextRouteRef = useRef('');
  const prefetchedNextManifestRef = useRef('');
  
  const [seriesData, setSeriesData] = useState<WatchData | null>(null);
  const [missingSeries, setMissingSeries] = useState(false);

  useEffect(() => {
    let cancelled = false;
    trackedRef.current = false;
    queueMicrotask(() => {
      if (!cancelled) {
        setSeriesData(null);
        setMissingSeries(false);
      }
    });

    async function fetchWatchData() {
      try {
        const apiUrl = getApiUrl();
        const res = await fetch(`${apiUrl}/series/${slug}/watch/${episode}`);

        if (cancelled) return;

        if (!res.ok) {
          setMissingSeries(true);
          return;
        }

        const json = await res.json();
        setSeriesData(json.data);
        if (json.data && !json.data.hasCurrentEpisode) {
          setMissingSeries(true);
        }
      } catch {
        console.error('Error fetching watch data');
        setMissingSeries(true);
      }
    }
    
    fetchWatchData();

    return () => {
      cancelled = true;
    };
  }, [slug, episode]);

  useEffect(() => {
    if (!seriesData || !seriesData.hasCurrentEpisode || !seriesData.currentEpisodeId) return;
    
    // Check if this episode has already been tracked in this session
    const sessionKey = `viewed_${seriesData.seriesId}_${seriesData.currentEpisodeId}`;
    const alreadyTrackedInSession = sessionStorage.getItem(sessionKey);

    let timer: NodeJS.Timeout;

    if (!trackedRef.current && !alreadyTrackedInSession) {
      // Delay tracking by 10 seconds to ensure the user is actually watching
      timer = setTimeout(() => {
        trackedRef.current = true;
        sessionStorage.setItem(sessionKey, 'true');
        
        const apiUrl = getApiUrl();
        fetch(`${apiUrl}/series/view`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            seriesId: seriesData.seriesId, 
            episodeId: seriesData.currentEpisodeId 
          })
        }).catch(() => console.error('Tracking error'));
      }, 10000); // 10 seconds delay
    }
    
    // Update local watch history
    const historyStr = localStorage.getItem('watchHistory') || '[]';
    let history: WatchHistoryItem[] = [];
    try {
      history = JSON.parse(historyStr);
    } catch {}

    const existingIndex = history.findIndex((item) => item.slug === slug);
    const newEntry: WatchHistoryItem = {
      slug,
      title: seriesData.title,
      posterUrl: seriesData.posterUrl || 'https://placehold.co/300x400/2C2C2E/8E8E93?text=Cover',
      lastWatchedEpisode: episode,
      totalEpisodes: seriesData.totalEpisodes,
      progressPercentage: Math.round((episode / Math.max(seriesData.totalEpisodes, 1)) * 100),
      timestamp: new Date().getTime(),
    };

    if (existingIndex > -1) {
      history[existingIndex] = newEntry;
    } else {
      history.unshift(newEntry);
    }

    localStorage.setItem('watchHistory', JSON.stringify(history.slice(0, 10)));

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [seriesData, episode, slug]);

  useEffect(() => {
    if (!seriesData?.hasCurrentEpisode) return;

    setTimeout(() => {
      const activeEl = document.getElementById('active-episode');
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }, 100);
  }, [seriesData, episode]);

  useEffect(() => {
    if (!seriesData || episode >= seriesData.totalEpisodes) return;

    const nextPath = `/watch/${slug}/${episode + 1}`;
    if (prefetchedNextRouteRef.current === nextPath) return;

    prefetchedNextRouteRef.current = nextPath;
    router.prefetch(nextPath);
  }, [episode, router, seriesData, slug]);

  const canWarmNextEpisodeManifest = () => {
    const connection = (navigator as Navigator & {
      connection?: { saveData?: boolean; effectiveType?: string };
    }).connection;

    if (connection?.saveData) return false;
    if (connection?.effectiveType === 'slow-2g' || connection?.effectiveType === '2g') return false;
    return true;
  };

  const isHlsManifestUrl = (value: string) => {
    try {
      return new URL(value, window.location.href).pathname.toLowerCase().endsWith('.m3u8');
    } catch {
      return value.toLowerCase().split('?')[0].endsWith('.m3u8');
    }
  };

  const warmNextEpisodeManifest = (currentTime: number, duration: number) => {
    if (!seriesData?.nextEpisodeUrl || !Number.isFinite(duration) || duration <= 0) return;
    if (duration - currentTime > 45) return;
    if (!isHlsManifestUrl(seriesData.nextEpisodeUrl)) return;
    if (!canWarmNextEpisodeManifest()) return;
    if (prefetchedNextManifestRef.current === seriesData.nextEpisodeUrl) return;

    prefetchedNextManifestRef.current = seriesData.nextEpisodeUrl;
    fetch(seriesData.nextEpisodeUrl, {
      method: 'GET',
      cache: 'force-cache',
      credentials: 'omit',
    }).catch(() => {
      prefetchedNextManifestRef.current = '';
    });
  };

  const handleVideoEnded = () => {
    if (seriesData && episode < seriesData.totalEpisodes) {
      router.push(`/watch/${slug}/${episode + 1}`);
    }
  };

  if (!seriesData && !missingSeries) {
    return <WatchSkeleton />;
  }

  if (missingSeries || !seriesData || !seriesData.hasCurrentEpisode) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-white/10 bg-[#1b1b1d] px-4 py-12 text-center">
          <h1 className="text-2xl font-bold">ตอนนี้ยังไม่พร้อมรับชม</h1>
          <p className="mt-3 text-sm text-[var(--color-text-secondary)]">
            อาจยังไม่มีตอนนี้ในระบบ หรือวิดีโอยังไม่ได้ถูกเพิ่ม
          </p>
          <Link href={`/series/${slug}`} className="mt-6 inline-flex rounded-md bg-[var(--color-primary)] px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-blue-600">
            กลับไปหน้าซีรีส์
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-5xl flex-col space-y-5 px-0 py-0 sm:px-6 sm:py-6 lg:px-8">
      <div className="relative flex aspect-[9/9] w-full items-center justify-center overflow-hidden bg-black sm:aspect-video sm:rounded-lg sm:border sm:border-white/10">
        <HlsVideoPlayer
          className="h-full w-full object-contain"
          src={seriesData.currentEpisodeUrl}
          onEnded={handleVideoEnded}
          onTimeUpdate={warmNextEpisodeManifest}
        />
      </div>

      <div className="space-y-5 px-4 sm:px-0">
        <Link href={`/series/${slug}`} className="inline-flex items-center gap-2 text-sm font-bold text-[var(--color-primary)] hover:underline">
          <FontAwesomeIcon icon={faArrowLeft} />
          <span>กลับไปหน้าซีรีส์</span>
        </Link>
        
        <div className="flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{seriesData.title}</h1>
            <p className="mt-1 text-[var(--color-text-secondary)]">ตอนที่ {episode}</p>
          </div>
          
          <div className="flex w-full items-center gap-2 sm:w-auto">
            {episode > 1 && (
              <Link 
                href={`/watch/${slug}/${episode - 1}`}
                className="flex items-center gap-2 rounded-md bg-[#1b1b1d] px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-white/10"
              >
                <FontAwesomeIcon icon={faChevronLeft} />
                <span>ตอนก่อนหน้า</span>
              </Link>
            )}
            
            {episode < seriesData.totalEpisodes && (
              <Link 
                href={`/watch/${slug}/${episode + 1}`}
                className="ml-auto flex items-center gap-2 rounded-md bg-[var(--color-primary)] px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-blue-600 sm:ml-0"
              >
                <span>ตอนถัดไป</span>
                <FontAwesomeIcon icon={faChevronRight} />
              </Link>
            )}
          </div>
        </div>

        <section className="space-y-4">
          <h2 className="flex items-center gap-2 text-lg font-bold">
            <FontAwesomeIcon icon={faListUl} />
            <span>ตอนอื่นๆ</span>
          </h2>
          
          <div className="flex snap-x gap-3 overflow-x-auto pb-4">
            {Array(seriesData.totalEpisodes).fill(null).map((_, i) => (
              <Link 
                key={i}
                id={episode === i + 1 ? 'active-episode' : undefined}
                href={`/watch/${slug}/${i + 1}`}
                className={`snap-center shrink-0 rounded-md border px-6 py-3 font-bold transition-colors ${
                  episode === i + 1 
                    ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white' 
                    : 'border-white/10 bg-[#1b1b1d] hover:bg-white/10'
                }`}
              >
                ตอน {i + 1}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
