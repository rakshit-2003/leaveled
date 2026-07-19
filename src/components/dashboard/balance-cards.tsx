import { Card, CardContent } from "@/components/ui/card";

interface Balance {
  id: string;
  allocated: number;
  used: number;
  pending: number;
  leaveType: { name: string; color: string };
}

export function BalanceCards({ balances }: { balances: Balance[] }) {
  if (balances.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-8 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">No leave balances configured yet.</p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Ask your admin to set up leave types.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {balances.map((b) => {
        const available = b.allocated - b.used - b.pending;
        const usedPct = b.allocated > 0 ? (b.used / b.allocated) * 100 : 0;
        return (
          <Card key={b.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: b.leaveType.color }} />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{b.leaveType.name}</span>
                </div>
                <span className="text-xs text-gray-400 dark:text-gray-500">{b.allocated}d total</span>
              </div>
              <div className="mb-3">
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                  <span>{b.used}d used</span>
                  <span className="font-medium text-gray-900 dark:text-white">{available}d left</span>
                </div>
                <div className="h-1.5 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(usedPct, 100)}%`, backgroundColor: b.leaveType.color }} />
                </div>
              </div>
              {b.pending > 0 && (
                <p className="text-xs text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-950 rounded-md px-2 py-1">
                  {b.pending}d pending approval
                </p>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
