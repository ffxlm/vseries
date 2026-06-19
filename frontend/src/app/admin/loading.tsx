import { PageHeaderSkeleton, StatCardsSkeleton } from '@/components/Skeletons';

export default function AdminLoading() {
  return (
    <div className="space-y-6">
      <PageHeaderSkeleton />
      <StatCardsSkeleton />
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="h-48 animate-pulse rounded-lg border border-white/10 bg-white/10" />
        <div className="h-48 animate-pulse rounded-lg border border-white/10 bg-white/10" />
      </div>
    </div>
  );
}
