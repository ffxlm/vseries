'use client';

import { useState } from 'react';
import SeriesCard, { SeriesProps } from '@/components/SeriesCard';
import { getApiUrl } from '@/lib/api';
import { SeriesGridSkeleton } from '@/components/Skeletons';

type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

type CategorySeriesGridProps = {
  category: string;
  initialSeries: SeriesProps[];
  initialPagination: Pagination | null;
};

export default function CategorySeriesGrid({
  category,
  initialSeries,
  initialPagination,
}: CategorySeriesGridProps) {
  const [series, setSeries] = useState(initialSeries);
  const [pagination, setPagination] = useState(initialPagination);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');

  const loadMore = async () => {
    if (!pagination?.hasNextPage || loadingMore) return;

    setLoadingMore(true);
    setError('');

    try {
      const apiUrl = getApiUrl();
      const nextPage = pagination.page + 1;
      const response = await fetch(`${apiUrl}/series?category=${category}&limit=24&page=${nextPage}`);

      if (!response.ok) {
        setError('โหลดรายการเพิ่มเติมไม่สำเร็จ');
        return;
      }

      const json = await response.json();
      setSeries((current) => [...current, ...(json.data || [])]);
      setPagination(json.pagination || null);
    } catch {
      setError('โหลดรายการเพิ่มเติมไม่สำเร็จ');
    } finally {
      setLoadingMore(false);
    }
  };

  if (series.length === 0) return null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-3 md:grid-cols-4 md:gap-4 lg:grid-cols-6">
        {series.map((item) => (
          <SeriesCard key={item._id} series={item} />
        ))}
      </div>

      {loadingMore && <SeriesGridSkeleton count={6} />}

      {error && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-center text-sm font-semibold text-red-200">
          {error}
        </div>
      )}

      {pagination?.hasNextPage && (
        <div className="flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={loadMore}
            disabled={loadingMore}
            className="rounded-md bg-[var(--color-primary)] px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loadingMore ? 'กำลังโหลด' : 'โหลดเพิ่ม'}
          </button>
          <span className="text-sm font-semibold text-[var(--color-text-secondary)]">
            แสดง {series.length.toLocaleString()} / {pagination.total.toLocaleString()} เรื่อง
          </span>
        </div>
      )}
    </div>
  );
}
