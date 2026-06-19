import { SeriesGridSkeleton } from '@/components/Skeletons';

export default function HomeLoading() {
  return (
    <div className="mx-auto max-w-7xl space-y-10 px-4 py-6 sm:px-6 lg:px-8">
      {Array.from({ length: 3 }).map((_, index) => (
        <section key={index} className="space-y-4">
          <div className="h-7 w-48 animate-pulse rounded bg-white/10" />
          <SeriesGridSkeleton count={12} />
        </section>
      ))}
    </div>
  );
}
