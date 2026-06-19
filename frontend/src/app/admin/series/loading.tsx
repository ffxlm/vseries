import { PageHeaderSkeleton, TableSkeleton } from '@/components/Skeletons';

export default function AdminSeriesLoading() {
  return (
    <div className="space-y-6">
      <PageHeaderSkeleton />
      <div className="h-16 animate-pulse rounded-lg border border-white/10 bg-white/10" />
      <TableSkeleton rows={6} columns={5} />
    </div>
  );
}
