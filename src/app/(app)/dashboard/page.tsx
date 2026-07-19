import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { BalanceCards } from "@/components/dashboard/balance-cards";
import { RecentRequests } from "@/components/dashboard/recent-requests";
import { NewRequestButton } from "@/components/leave/new-request-button";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const year = new Date().getFullYear();

  const [balances, recentRequests] = await Promise.all([
    db.leaveBalance.findMany({
      where: { userId: session.user.id, year },
      include: { leaveType: true },
      orderBy: { leaveType: { name: "asc" } },
    }),
    db.leaveRequest.findMany({
      where: { userId: session.user.id, deletedAt: null },
      include: { leaveType: true },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  const userName = session.user.name?.split(" ")[0] ?? "there";

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            Good {getGreeting()}, {userName} 👋
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Here&apos;s your leave overview for {year}
          </p>
        </div>
        <NewRequestButton />
      </div>

      {/* Balance cards */}
      <BalanceCards balances={balances} />

      {/* Recent requests */}
      <RecentRequests requests={recentRequests} />
    </div>
  );
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  return "evening";
}
