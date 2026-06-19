type SeriesGridSkeletonProps = {
  count?: number;
};

type TableSkeletonProps = {
  rows?: number;
  columns?: number;
};

export function PageHeaderSkeleton() {
  return (
    <div className="space-y-2">
      <div className="h-4 w-32 animate-pulse rounded bg-white/10" />
      <div className="h-8 w-64 animate-pulse rounded bg-white/10" />
    </div>
  );
}

export function SeriesGridSkeleton({ count = 12 }: SeriesGridSkeletonProps) {
  return (
    <div className="grid grid-cols-3 gap-3 md:grid-cols-4 md:gap-4 lg:grid-cols-6">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="space-y-2">
          <div className="aspect-[3/4] animate-pulse rounded-lg border border-white/10 bg-white/10" />
          <div className="h-4 animate-pulse rounded bg-white/10" />
          <div className="h-4 w-2/3 animate-pulse rounded bg-white/10" />
        </div>
      ))}
    </div>
  );
}

export function TableSkeleton({ rows = 6, columns = 4 }: TableSkeletonProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-white/10 bg-[#1b1b1d]">
      <div className="border-b border-white/10 bg-white/5 px-4 py-3">
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
          {Array.from({ length: columns }).map((_, index) => (
            <div key={index} className="h-4 animate-pulse rounded bg-white/10" />
          ))}
        </div>
      </div>
      <div className="divide-y divide-white/10">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="grid gap-4 px-4 py-4" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
            {Array.from({ length: columns }).map((_, columnIndex) => (
              <div key={columnIndex} className="h-4 animate-pulse rounded bg-white/10" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function StatCardsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="rounded-lg border border-white/10 bg-[#1b1b1d] p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="h-4 w-24 animate-pulse rounded bg-white/10" />
            <div className="h-4 w-4 animate-pulse rounded bg-white/10" />
          </div>
          <div className="mt-3 h-8 w-20 animate-pulse rounded bg-white/10" />
        </div>
      ))}
    </div>
  );
}

export function WatchSkeleton() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col space-y-5 px-0 py-0 sm:px-6 sm:py-6 lg:px-8">
      <div className="aspect-[9/9] w-full animate-pulse bg-white/10 sm:aspect-video sm:rounded-lg sm:border sm:border-white/10" />
      <div className="space-y-5 px-4 sm:px-0">
        <div className="h-5 w-40 animate-pulse rounded bg-white/10" />
        <div className="flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <div className="h-8 w-64 animate-pulse rounded bg-white/10" />
            <div className="h-5 w-20 animate-pulse rounded bg-white/10" />
          </div>
          <div className="h-10 w-32 animate-pulse rounded bg-white/10" />
        </div>
        <div className="space-y-4">
          <div className="h-6 w-28 animate-pulse rounded bg-white/10" />
          <div className="flex gap-3 overflow-hidden">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="h-12 w-24 shrink-0 animate-pulse rounded-md bg-white/10" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function SeriesDetailSkeleton() {
  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-6 sm:px-6 lg:px-8">
      <section className="grid gap-6 md:grid-cols-[240px_minmax(0,1fr)] md:gap-8">
        <div className="mx-auto aspect-[3/4] w-full max-w-[240px] animate-pulse rounded-lg border border-white/10 bg-white/10 md:mx-0" />
        <div className="flex min-w-0 flex-col justify-center space-y-4">
          <div className="h-10 w-3/4 animate-pulse rounded bg-white/10" />
          <div className="h-5 w-44 animate-pulse rounded bg-white/10" />
          <div className="space-y-2">
            <div className="h-4 animate-pulse rounded bg-white/10" />
            <div className="h-4 animate-pulse rounded bg-white/10" />
            <div className="h-4 w-2/3 animate-pulse rounded bg-white/10" />
          </div>
          <div className="flex gap-3 pt-2">
            <div className="h-12 w-40 animate-pulse rounded-md bg-white/10" />
            <div className="h-12 w-12 animate-pulse rounded-md bg-white/10" />
          </div>
        </div>
      </section>
      <div className="h-7 w-48 animate-pulse rounded bg-white/10" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="h-20 animate-pulse rounded-lg border border-white/10 bg-white/10" />
        ))}
      </div>
    </div>
  );
}

export function ContactSkeleton() {
  return (
    <div className="mx-auto max-w-2xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center space-y-4 text-center">
        <div className="h-10 w-48 animate-pulse rounded bg-white/10" />
        <div className="h-5 w-80 animate-pulse rounded bg-white/10" />
      </div>
      <div className="space-y-3 rounded-lg border border-white/10 bg-[#1b1b1d] p-4 sm:p-6">
        {Array.from({ length: 3 }).map((_, idx) => (
          <div key={idx} className="flex items-center gap-4 rounded-md p-4">
            <div className="h-12 w-12 shrink-0 animate-pulse rounded-md bg-white/10" />
            <div className="space-y-2">
              <div className="h-6 w-32 animate-pulse rounded bg-white/10" />
              <div className="h-4 w-48 animate-pulse rounded bg-white/10" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SearchHeaderSkeleton() {
  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl space-y-3 text-center">
        <div className="mx-auto h-10 w-48 animate-pulse rounded bg-white/10" />
        <div className="mx-auto h-5 w-64 animate-pulse rounded bg-white/10" />
      </div>
      <div className="mx-auto h-14 max-w-2xl animate-pulse rounded-lg bg-white/10" />
    </div>
  );
}

export function HistorySkeleton() {
  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between gap-4">
        <div className="h-10 w-48 animate-pulse rounded bg-white/10" />
      </div>
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, idx) => (
          <div key={idx} className="flex gap-4 rounded-lg border border-white/10 bg-[#1b1b1d] p-3 sm:p-4">
            <div className="aspect-[3/4] w-20 shrink-0 animate-pulse rounded-md bg-white/10 sm:w-24" />
            <div className="flex-1 flex flex-col justify-center space-y-3">
              <div className="h-6 w-3/4 animate-pulse rounded bg-white/10" />
              <div className="h-4 w-1/2 animate-pulse rounded bg-white/10" />
              <div className="h-1.5 w-full animate-pulse rounded-full bg-white/10" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
