import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

interface Request {
  id: string;
  days: number;
  status: string;
  startDate: Date;
  endDate: Date;
  leaveType: { name: string; color: string };
}

const statusVariant: Record<string, "default" | "success" | "destructive" | "warning" | "secondary"> = {
  PENDING: "warning", APPROVED: "success", REJECTED: "destructive", CANCELLED: "secondary",
};

export function RecentRequests({ requests }: { requests: Request[] }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle>Recent Requests</CardTitle>
        <Link href="/requests" className="flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 hover:underline">
          View all <ArrowRight className="h-3 w-3" />
        </Link>
      </CardHeader>
      <CardContent className="p-0">
        {requests.length === 0 ? (
          <div className="px-6 pb-6 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400 py-8">No requests yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {requests.map((r) => (
              <div key={r.id} className="flex items-center gap-4 px-6 py-3">
                <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: r.leaveType.color }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{r.leaveType.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDate(r.startDate)} — {formatDate(r.endDate)} · {r.days}d
                  </p>
                </div>
                <Badge variant={statusVariant[r.status] ?? "secondary"}>
                  {r.status.charAt(0) + r.status.slice(1).toLowerCase()}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
