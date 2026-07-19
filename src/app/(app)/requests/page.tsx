import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { RequestsTable } from "@/components/leave/requests-table";
import { NewRequestButton } from "@/components/leave/new-request-button";

export const metadata: Metadata = { title: "My Requests" };

export default async function RequestsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const requests = await db.leaveRequest.findMany({
    where: { userId: session.user.id, deletedAt: null },
    include: { leaveType: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">My Requests</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {requests.length} request{requests.length !== 1 ? "s" : ""}
          </p>
        </div>
        <NewRequestButton />
      </div>

      <RequestsTable requests={requests} />
    </div>
  );
}
