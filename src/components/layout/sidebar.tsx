"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, CalendarDays, ClipboardList,
  Users, Settings, LogOut, Palmtree, Moon, Sun,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";
import { useTheme } from "@/components/theme-provider";

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  adminOnly?: boolean;
}

const navItems: NavItem[] = [
  { href: "/dashboard",         label: "Dashboard",       icon: LayoutDashboard },
  { href: "/requests",          label: "My Requests",     icon: ClipboardList },
  { href: "/calendar",          label: "Calendar",        icon: CalendarDays },
  { href: "/admin/requests",    label: "Manage Requests", icon: ClipboardList, adminOnly: true },
  { href: "/admin/users",       label: "Employees",       icon: Users,         adminOnly: true },
  { href: "/admin/leave-types", label: "Leave Types",     icon: Settings,      adminOnly: true },
];

interface SidebarProps {
  role: string;
  userName: string;
  userEmail: string;
}

export function Sidebar({ role, userName, userEmail }: SidebarProps) {
  const pathname = usePathname();
  const { isDark, toggle } = useTheme();
  const isAdmin = role === "ADMIN" || role === "MANAGER";
  const visible = navItems.filter((item) => !item.adminOnly || isAdmin);

  return (
    <aside className="flex h-screen w-60 flex-col border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2 px-6 py-5 border-b border-gray-100 dark:border-gray-800">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
          <Palmtree className="h-4 w-4 text-white" />
        </div>
        <span className="text-base font-semibold text-gray-900 dark:text-white flex-1">LeaveLedger</span>
        <kbd className="hidden sm:inline-flex items-center gap-1 rounded border border-gray-200 dark:border-gray-700 px-1.5 py-0.5 text-xs text-gray-400 dark:text-gray-500 font-mono">⌘K</kbd>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {visible.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors duration-150",
                active
                  ? "bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-medium"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="border-t border-gray-100 dark:border-gray-800 p-3 space-y-0.5">
        {/* Dark mode toggle — reads isDark from context, always in sync */}
        <button
          onClick={toggle}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          aria-label="Toggle dark mode"
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          {isDark ? "Light mode" : "Dark mode"}
        </button>

        {/* User info */}
        <div className="flex items-center gap-3 rounded-lg px-3 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 text-xs font-semibold shrink-0">
            {userName?.slice(0, 2).toUpperCase() ?? "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{userName}</p>
            <p className="text-xs text-gray-500 dark:text-gray-500 truncate">{userEmail}</p>
          </div>
        </div>

        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
