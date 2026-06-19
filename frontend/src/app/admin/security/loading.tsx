import { PageHeaderSkeleton, TableSkeleton } from '@/components/Skeletons';

export default function AdminSecurityLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <PageHeaderSkeleton />
        <div className="h-10 w-28 animate-pulse rounded-md bg-white/10" />
      </div>
      <TableSkeleton rows={6} columns={5} />
    </div>
  );
}
