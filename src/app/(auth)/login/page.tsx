import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";
import { Palmtree } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = { title: "Sign In" };

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center gap-2 mb-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600">
            <Palmtree className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">LeaveLedger</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Sign in to your account</p>
        </div>

        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
          <LoginForm />
        </div>

        <p className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium">
            Create one
          </Link>
        </p>
      </div>
    </main>
  );
}
