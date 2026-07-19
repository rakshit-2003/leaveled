"use client";

import React, { useState, useTransition } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { reviewLeaveRequest } from "@/server/actions/leave";
import { formatDate } from "@/lib/utils";
import { Check, X, Loader2 } from "lucide-react";

interface Request {
  id: string;
  days: number;
  status: string;
  reason: string;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  user: { id: string; name: string | null; email: string; department: string | null };
  leaveType: { name: string; color: string };
}

const statusVariant: Record<string, "default" | "success" | "destructive" | "warning" | "secondary"> = {
  PENDING: "warning", APPROVED: "success", REJECTED: "destructive", CANCELLED: "secondary",
};

export function AdminRequestsTable({ requests }: { requests: Request[] }) {
  const [reviewingId, setReviewingId] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleReview = (id: string, status: "APPROVED" | "REJECTED") => {
    startTransition(async () => {
      const result = await reviewLeaveRequest(id, { status, reviewNote: note });
      if (result.error) { toast.error(result.error); }
      else { toast.success(`Request ${status.toLowerCase()}.`); setReviewingId(null); setNote(""); }
    });
  };

  if (requests.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-12 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">No requests to review.</p>
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
              {["Employee","Type","Dates","Days","Status",""].map((h,i) => (
                <th key={i} className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {requests.map((r) => (
              <React.Fragment key={r.id}>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{r.user.name ?? r.user.email}</p>
                      {r.user.department && <p className="text-xs text-gray-500 dark:text-gray-400">{r.user.department}</p>}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: r.leaveType.color }} />
                      {r.leaveType.name}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{formatDate(r.startDate)} — {formatDate(r.endDate)}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{r.days}d</td>
                  <td className="px-4 py-3">
                    <Badge variant={statusVariant[r.status] ?? "secondary"}>
                      {r.status.charAt(0) + r.status.slice(1).toLowerCase()}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {r.status === "PENDING" && (
                      <Button size="sm" variant="ghost" className="text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950"
                        onClick={() => setReviewingId(reviewingId === r.id ? null : r.id)}>
                        Review
                      </Button>
                    )}
                  </td>
                </tr>
                {reviewingId === r.id && (
                  <tr className="bg-gray-50 dark:bg-gray-800/50">
                    <td colSpan={6} className="px-4 py-3">
                      <div className="flex flex-col gap-2 max-w-lg">
                        <p className="text-xs text-gray-500 dark:text-gray-400 italic">Reason: {r.reason}</p>
                        <Textarea placeholder="Optional review note…" rows={2} value={note} onChange={(e) => setNote(e.target.value)} />
                        <div className="flex gap-2">
                          <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" disabled={isPending} onClick={() => handleReview(r.id, "APPROVED")}>
                            {isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />} Approve
                          </Button>
                          <Button size="sm" variant="destructive" disabled={isPending} onClick={() => handleReview(r.id, "REJECTED")}>
                            {isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <X className="h-3 w-3" />} Reject
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => { setReviewingId(null); setNote(""); }}>Cancel</Button>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden divide-y divide-gray-100 dark:divide-gray-800">
        {requests.map((r) => (
          <div key={r.id} className="p-4 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{r.user.name ?? r.user.email}</p>
                {r.user.department && <p className="text-xs text-gray-500 dark:text-gray-400">{r.user.department}</p>}
              </div>
              <Badge variant={statusVariant[r.status] ?? "secondary"}>
                {r.status.charAt(0) + r.status.slice(1).toLowerCase()}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: r.leaveType.color }} />
              {r.leaveType.name} · {r.days}d
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(r.startDate)} — {formatDate(r.endDate)}</p>
            {r.status === "PENDING" && (
              <div className="space-y-2">
                {reviewingId === r.id ? (
                  <>
                    <Textarea placeholder="Optional review note…" rows={2} value={note} onChange={(e) => setNote(e.target.value)} />
                    <div className="flex gap-2">
                      <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white flex-1" disabled={isPending} onClick={() => handleReview(r.id, "APPROVED")}>
                        {isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />} Approve
                      </Button>
                      <Button size="sm" variant="destructive" className="flex-1" disabled={isPending} onClick={() => handleReview(r.id, "REJECTED")}>
                        {isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <X className="h-3 w-3" />} Reject
                      </Button>
                    </div>
                    <Button size="sm" variant="ghost" className="w-full" onClick={() => { setReviewingId(null); setNote(""); }}>Cancel</Button>
                  </>
                ) : (
                  <Button size="sm" variant="outline" className="w-full" onClick={() => setReviewingId(r.id)}>Review</Button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
