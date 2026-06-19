import { PageHeaderSkeleton, SeriesGridSkeleton } from '@/components/Skeletons';

export default function CategoryLoading() {
  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PageHeaderSkeleton />
        <div className="flex gap-2">
          <div className="h-10 w-20 animate-pulse rounded-md bg-white/10" />
          <div className="h-10 w-24 animate-pulse rounded-md bg-white/10" />
          <div className="h-10 w-20 animate-pulse rounded-md bg-white/10" />
        </div>
      </div>
      <SeriesGridSkeleton count={24} />
    </div>
  );
}
