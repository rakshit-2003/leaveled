import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = { title: "Calendar" };

export default async function CalendarPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 2, 0);

  const requests = await db.leaveRequest.findMany({
    where: {
      deletedAt: null,
      status: { in: ["APPROVED", "PENDING"] },
      startDate: { lte: endOfMonth },
      endDate: { gte: startOfMonth },
    },
    include: {
      user: { select: { name: true, email: true } },
      leaveType: true,
    },
    orderBy: { startDate: "asc" },
  });

  const statusVariant: Record<string, "default" | "success" | "warning"> = {
    APPROVED: "success",
    PENDING: "warning",
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Team Calendar</h1>
        <p className="text-sm text-gray-500 mt-0.5">Upcoming and approved leave</p>
      </div>

      {requests.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-200 bg-white p-12 text-center">
          <p className="text-sm text-gray-500">No upcoming leave requests.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {requests.map((r) => (
            <div
              key={r.id}
              className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white px-4 py-3"
            >
              <span className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: r.leaveType.color }} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {r.user.name ?? r.user.email}
                </p>
                <p className="text-xs text-gray-500">
                  {r.leaveType.name} · {formatDate(r.startDate)} — {formatDate(r.endDate)} · {r.days}d
                </p>
              </div>
              <Badge variant={statusVariant[r.status] ?? "secondary"}>
                {r.status.charAt(0) + r.status.slice(1).toLowerCase()}
              </Badge>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
