import Link from "next/link";
import { Palmtree } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
      <div className="text-center max-w-sm">
        <div className="flex justify-center mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-950">
            <Palmtree className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">404</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          This page doesn&apos;t exist — maybe it took a leave day.
        </p>
        <Button asChild>
          <Link href="/dashboard">Back to Dashboard</Link>
        </Button>
      </div>
    </main>
  );
}
