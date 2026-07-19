import { Skeleton } from "@/components/ui/skeleton";

export default function RequestsLoading() {
  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-6 w-36" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="h-9 w-32" />
      </div>

      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        <div className="border-b border-gray-100 bg-gray-50 px-4 py-3 flex gap-8">
          {[80, 120, 60, 80, 80].map((w, i) => (
            <Skeleton key={i} className={`h-3 w-${w === 60 ? 16 : w === 80 ? 20 : 28}`} />
          ))}
        </div>
        <div className="divide-y divide-gray-100">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-6 px-4 py-3">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-10" />
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
