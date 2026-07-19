import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

export const metadata: Metadata = { title: "Leave Types" };

export default async function LeaveTypesPage() {
  const session = await auth();
  const role = (session?.user as any)?.role;
  if (!session?.user?.id || role !== "ADMIN") redirect("/dashboard");

  const leaveTypes = await db.leaveType.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Leave Types</h1>
        <p className="text-sm text-gray-500 mt-0.5">{leaveTypes.length} types configured</p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Description</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Default Days</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {leaveTypes.map((lt) => (
              <tr key={lt.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: lt.color }} />
                    <span className="font-medium text-gray-900">{lt.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-600">{lt.description ?? "—"}</td>
                <td className="px-4 py-3 text-gray-600">{lt.defaultDays}d</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${lt.isActive ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    {lt.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
