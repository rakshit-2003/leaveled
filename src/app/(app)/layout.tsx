import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { CommandPalette } from "@/components/command-palette";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const role = (session.user as any).role ?? "EMPLOYEE";

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        role={role}
        userName={session.user.name ?? "User"}
        userEmail={session.user.email ?? ""}
      />
      <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-950">
        {children}
      </main>
      <CommandPalette role={role} />
    </div>
  );
}
