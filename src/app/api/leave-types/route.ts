import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const leaveTypes = await db.leaveType.findMany({
    where: { isActive: true },
    select: { id: true, name: true, color: true, defaultDays: true },
    orderBy: { name: "asc" },
  });

  return NextResponse.json(leaveTypes);
}
