import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { AdminRequestsTable } from "@/components/admin/admin-requests-table";

export const metadata: Metadata = { title: "Manage Requests" };

export default async function AdminRequestsPage() {
  const session = await auth();
  const role = (session?.user as any)?.role;
  if (!session?.user?.id || (role !== "ADMIN" && role !== "MANAGER")) {
    redirect("/dashboard");
  }

  const requests = await db.leaveRequest.findMany({
    where: { deletedAt: null },
    include: {
      user: { select: { id: true, name: true, email: true, department: true } },
      leaveType: true,
    },
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
  });

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Manage Requests</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          {requests.filter((r) => r.status === "PENDING").length} pending review
        </p>
      </div>

      <AdminRequestsTable requests={requests} />
    </div>
  );
}
