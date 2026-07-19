"use client";

import { CommandPalette } from "@/components/command-palette";

interface AppShellProps {
  role: string;
  children: React.ReactNode;
}

export function AppShell({ role, children }: AppShellProps) {
  return (
    <>
      <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-950">
        {children}
      </main>
      <CommandPalette role={role} />
    </>
  );
}
