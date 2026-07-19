"use server";

import { db } from "@/lib/db";
import { registerSchema } from "@/lib/validators";
import bcrypt from "bcryptjs";
import { z } from "zod";

export async function registerUser(input: z.infer<typeof registerSchema>) {
  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { name, email, password, department } = parsed.data;

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "An account with this email already exists." };
  }

  const hashed = await bcrypt.hash(password, 12);

  // First user becomes admin
  const userCount = await db.user.count();
  const role = userCount === 0 ? "ADMIN" : "EMPLOYEE";

  const user = await db.user.create({
    data: {
      name,
      email,
      password: hashed,
      department,
      role: role as any,
    },
  });

  // Seed default leave balances for new user
  const leaveTypes = await db.leaveType.findMany({ where: { isActive: true } });
  const year = new Date().getFullYear();

  if (leaveTypes.length > 0) {
    await db.leaveBalance.createMany({
      data: leaveTypes.map((lt) => ({
        userId: user.id,
        leaveTypeId: lt.id,
        year,
        allocated: lt.defaultDays,
        used: 0,
        pending: 0,
      })),
    });
  }

  return { success: true, userId: user.id };
}
