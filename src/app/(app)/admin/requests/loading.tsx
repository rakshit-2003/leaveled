import { Skeleton } from "@/components/ui/skeleton";

export default function AdminRequestsLoading() {
  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-6 w-44" />
        <Skeleton className="h-4 w-28" />
      </div>
      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        <div className="border-b border-gray-100 bg-gray-50 px-4 py-3 flex gap-8">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-3 w-20" />
          ))}
        </div>
        <div className="divide-y divide-gray-100">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-6 px-4 py-3">
              <div className="space-y-1 w-32">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-3 w-20" />
              </div>
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-4 w-8" />
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-8 w-16 ml-auto" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
