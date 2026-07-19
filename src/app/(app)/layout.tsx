import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { AppShell } from "@/components/layout/app-shell";

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
      <AppShell role={role}>
        {children}
      </AppShell>
    </div>
  );
}
