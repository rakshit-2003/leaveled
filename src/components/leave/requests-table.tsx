"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cancelLeaveRequest } from "@/server/actions/leave";
import { formatDate } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface Request {
  id: string;
  days: number;
  status: string;
  reason: string;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  leaveType: { name: string; color: string };
}

const statusVariant: Record<string, "default" | "success" | "destructive" | "warning" | "secondary"> = {
  PENDING: "warning", APPROVED: "success", REJECTED: "destructive", CANCELLED: "secondary",
};

export function RequestsTable({ requests }: { requests: Request[] }) {
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const handleCancel = (id: string) => {
    setCancellingId(id);
    startTransition(async () => {
      const result = await cancelLeaveRequest(id);
      if (result.error) { toast.error(result.error); }
      else { toast.success("Request cancelled."); }
      setCancellingId(null);
    });
  };

  if (requests.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-12 text-center">
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">No leave requests yet</p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Click "New Request" to submit your first one.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden">
      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
              {["Type","Dates","Days","Status","Submitted",""].map((h,i) => (
                <th key={i} className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {requests.map((r) => (
              <tr key={r.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: r.leaveType.color }} />
                    <span className="font-medium text-gray-900 dark:text-white">{r.leaveType.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{formatDate(r.startDate)} — {formatDate(r.endDate)}</td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{r.days}d</td>
                <td className="px-4 py-3">
                  <Badge variant={statusVariant[r.status] ?? "secondary"}>
                    {r.status.charAt(0) + r.status.slice(1).toLowerCase()}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-gray-500 dark:text-gray-500">{formatDate(r.createdAt)}</td>
                <td className="px-4 py-3 text-right">
                  {r.status === "PENDING" && (
                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                      disabled={cancellingId === r.id} onClick={() => handleCancel(r.id)}>
                      {cancellingId === r.id ? <Loader2 className="h-3 w-3 animate-spin" /> : "Cancel"}
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden divide-y divide-gray-100 dark:divide-gray-800">
        {requests.map((r) => (
          <div key={r.id} className="p-4 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: r.leaveType.color }} />
                <span className="font-medium text-gray-900 dark:text-white text-sm">{r.leaveType.name}</span>
              </div>
              <Badge variant={statusVariant[r.status] ?? "secondary"}>
                {r.status.charAt(0) + r.status.slice(1).toLowerCase()}
              </Badge>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {formatDate(r.startDate)} — {formatDate(r.endDate)} · {r.days}d
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">Submitted {formatDate(r.createdAt)}</p>
            {r.status === "PENDING" && (
              <Button variant="outline" size="sm" className="w-full mt-1 text-red-600 border-red-200 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-950"
                disabled={cancellingId === r.id} onClick={() => handleCancel(r.id)}>
                {cancellingId === r.id ? <Loader2 className="h-3 w-3 animate-spin" /> : "Cancel Request"}
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
