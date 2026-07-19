"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import {
  LayoutDashboard, ClipboardList, CalendarDays,
  Users, Settings, LogOut, Moon, Sun, Plus, X,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { useTheme } from "@/components/theme-provider";

interface CommandPaletteProps {
  role: string;
  onNewRequest?: () => void;
}

export function CommandPalette({ role, onNewRequest }: CommandPaletteProps) {
  const [open, setOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const router = useRouter();
  const { toggle } = useTheme();
  const isAdmin = role === "ADMIN" || role === "MANAGER";

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, [open]);

  const down = useCallback((e: KeyboardEvent) => {
    if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || e.key === "/") {
      e.preventDefault();
      setOpen((o) => !o);
    }
    if (e.key === "Escape") setOpen(false);
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [down]);

  const run = (fn: () => void) => { fn(); setOpen(false); };

  const pages = [
    { label: "Dashboard",       icon: LayoutDashboard, href: "/dashboard" },
    { label: "My Requests",     icon: ClipboardList,   href: "/requests" },
    { label: "Team Calendar",   icon: CalendarDays,    href: "/calendar" },
    ...(isAdmin ? [
      { label: "Manage Requests", icon: ClipboardList, href: "/admin/requests" },
      { label: "Employees",       icon: Users,         href: "/admin/users" },
      { label: "Leave Types",     icon: Settings,      href: "/admin/leave-types" },
    ] : []),
  ];

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 dark:bg-black/70" onClick={() => setOpen(false)} />

      {/* Panel */}
      <div className="relative w-full max-w-lg mx-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4">
        <Command className="flex flex-col" label="Command Menu">
          <div className="flex items-center gap-3 px-4 border-b border-gray-100 dark:border-gray-800">
            <svg className="h-4 w-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <Command.Input
              autoFocus
              placeholder="Search pages and actions…"
              className="flex-1 py-3.5 text-sm bg-transparent outline-none text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
            />
            <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 rounded-md">
              <X className="h-4 w-4" />
            </button>
          </div>

          <Command.List className="max-h-80 overflow-y-auto p-2">
            <Command.Empty className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
              No results found.
            </Command.Empty>

            <Command.Group heading="Navigate" className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-gray-400 dark:[&_[cmdk-group-heading]]:text-gray-500">
              {pages.map((p) => (
                <Command.Item
                  key={p.href}
                  value={p.label}
                  onSelect={() => run(() => router.push(p.href))}
                  className="flex items-center gap-3 px-2 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-300 cursor-pointer aria-selected:bg-indigo-50 dark:aria-selected:bg-indigo-950 aria-selected:text-indigo-700 dark:aria-selected:text-indigo-300 transition-colors"
                >
                  <p.icon className="h-4 w-4 shrink-0" />
                  {p.label}
                </Command.Item>
              ))}
            </Command.Group>

            <Command.Separator className="my-1 border-t border-gray-100 dark:border-gray-800" />

            <Command.Group heading="Actions" className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-gray-400 dark:[&_[cmdk-group-heading]]:text-gray-500">
              {onNewRequest && (
                <Command.Item
                  value="new leave request"
                  onSelect={() => run(() => onNewRequest())}
                  className="flex items-center gap-3 px-2 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-300 cursor-pointer aria-selected:bg-indigo-50 dark:aria-selected:bg-indigo-950 aria-selected:text-indigo-700 dark:aria-selected:text-indigo-300 transition-colors"
                >
                  <Plus className="h-4 w-4 shrink-0" />
                  New Leave Request
                </Command.Item>
              )}
              <Command.Item
                value="toggle dark light mode"
                onSelect={() => run(() => { toggle(); setIsDark(v => !v); })}
                className="flex items-center gap-3 px-2 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-300 cursor-pointer aria-selected:bg-indigo-50 dark:aria-selected:bg-indigo-950 aria-selected:text-indigo-700 dark:aria-selected:text-indigo-300 transition-colors"
              >
                {isDark ? <Sun className="h-4 w-4 shrink-0" /> : <Moon className="h-4 w-4 shrink-0" />}
                {isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              </Command.Item>
              <Command.Item
                value="sign out logout"
                onSelect={() => run(() => signOut({ callbackUrl: "/login" }))}
                className="flex items-center gap-3 px-2 py-2 rounded-lg text-sm text-red-600 dark:text-red-400 cursor-pointer aria-selected:bg-red-50 dark:aria-selected:bg-red-950 transition-colors"
              >
                <LogOut className="h-4 w-4 shrink-0" />
                Sign Out
              </Command.Item>
            </Command.Group>
          </Command.List>

          <div className="border-t border-gray-100 dark:border-gray-800 px-4 py-2 flex items-center gap-4 text-xs text-gray-400 dark:text-gray-500">
            <span><kbd className="font-mono">↑↓</kbd> navigate</span>
            <span><kbd className="font-mono">↵</kbd> select</span>
            <span><kbd className="font-mono">Esc</kbd> close</span>
          </div>
        </Command>
      </div>
    </div>
  );
}
