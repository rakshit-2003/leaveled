import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-9 w-32" />
      </div>

      {/* Balance cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-xl border border-gray-200 bg-white p-4 space-y-3">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-3 w-16" />
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3 w-16" />
              </div>
              <Skeleton className="h-1.5 w-full" />
            </div>
          </div>
        ))}
      </div>

      {/* Recent requests */}
      <div className="rounded-xl border border-gray-200 bg-white">
        <div className="p-6 border-b border-gray-100">
          <Skeleton className="h-5 w-36" />
        </div>
        <div className="divide-y divide-gray-100">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-4 px-6 py-3">
              <Skeleton className="h-2 w-2 rounded-full" />
              <div className="flex-1 space-y-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-48" />
              </div>
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
