"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { leaveRequestSchema, reviewRequestSchema } from "@/lib/validators";
import { calculateWorkingDays } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function createLeaveRequest(
  input: z.infer<typeof leaveRequestSchema>
) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  const parsed = leaveRequestSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const { leaveTypeId, startDate, endDate, reason } = parsed.data;
  const start = new Date(startDate);
  const end = new Date(endDate);
  const days = calculateWorkingDays(start, end);

  if (days <= 0) return { error: "No working days in selected range." };

  // Check balance
  const year = start.getFullYear();
  const balance = await db.leaveBalance.findUnique({
    where: {
      userId_leaveTypeId_year: {
        userId: session.user.id,
        leaveTypeId,
        year,
      },
    },
  });

  if (!balance) return { error: "No leave balance found for this leave type." };

  const available = balance.allocated - balance.used - balance.pending;
  if (days > available) {
    return { error: `Insufficient balance. Available: ${available} days.` };
  }

  // Check for overlapping requests
  const overlap = await db.leaveRequest.findFirst({
    where: {
      userId: session.user.id,
      deletedAt: null,
      status: { in: ["PENDING", "APPROVED"] },
      OR: [
        { startDate: { lte: end }, endDate: { gte: start } },
      ],
    },
  });

  if (overlap) {
    return { error: "You already have a leave request overlapping this period." };
  }

  const request = await db.leaveRequest.create({
    data: {
      userId: session.user.id,
      leaveTypeId,
      startDate: start,
      endDate: end,
      days,
      reason,
      status: "PENDING",
    },
  });

  // Update pending balance
  await db.leaveBalance.update({
    where: {
      userId_leaveTypeId_year: {
        userId: session.user.id,
        leaveTypeId,
        year,
      },
    },
    data: { pending: { increment: days } },
  });

  // Log activity
  await db.activityLog.create({
    data: {
      userId: session.user.id,
      action: "CREATED",
      entity: "LeaveRequest",
      entityId: request.id,
      metadata: { days, leaveTypeId },
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/requests");
  return { success: true, requestId: request.id };
}

export async function cancelLeaveRequest(requestId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  const request = await db.leaveRequest.findUnique({
    where: { id: requestId },
  });

  if (!request) return { error: "Request not found." };
  if (request.userId !== session.user.id) return { error: "Forbidden." };
  if (request.status !== "PENDING") {
    return { error: "Only pending requests can be cancelled." };
  }

  await db.leaveRequest.update({
    where: { id: requestId },
    data: { status: "CANCELLED", deletedAt: new Date() },
  });

  // Restore pending balance
  const year = request.startDate.getFullYear();
  await db.leaveBalance.update({
    where: {
      userId_leaveTypeId_year: {
        userId: request.userId,
        leaveTypeId: request.leaveTypeId,
        year,
      },
    },
    data: { pending: { decrement: request.days } },
  });

  await db.activityLog.create({
    data: {
      userId: session.user.id,
      action: "CANCELLED",
      entity: "LeaveRequest",
      entityId: requestId,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/requests");
  return { success: true };
}

export async function reviewLeaveRequest(
  requestId: string,
  input: z.infer<typeof reviewRequestSchema>
) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  const userRole = (session.user as any).role;
  if (userRole !== "ADMIN" && userRole !== "MANAGER") {
    return { error: "Insufficient permissions." };
  }

  const parsed = reviewRequestSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const request = await db.leaveRequest.findUnique({
    where: { id: requestId },
  });

  if (!request) return { error: "Request not found." };
  if (request.status !== "PENDING") {
    return { error: "Only pending requests can be reviewed." };
  }

  await db.leaveRequest.update({
    where: { id: requestId },
    data: {
      status: parsed.data.status,
      reviewNote: parsed.data.reviewNote,
      reviewedBy: session.user.id,
      reviewedAt: new Date(),
    },
  });

  const year = request.startDate.getFullYear();

  if (parsed.data.status === "APPROVED") {
    await db.leaveBalance.update({
      where: {
        userId_leaveTypeId_year: {
          userId: request.userId,
          leaveTypeId: request.leaveTypeId,
          year,
        },
      },
      data: {
        used: { increment: request.days },
        pending: { decrement: request.days },
      },
    });
  } else {
    // REJECTED — restore pending
    await db.leaveBalance.update({
      where: {
        userId_leaveTypeId_year: {
          userId: request.userId,
          leaveTypeId: request.leaveTypeId,
          year,
        },
      },
      data: { pending: { decrement: request.days } },
    });
  }

  await db.activityLog.create({
    data: {
      userId: session.user.id,
      action: parsed.data.status,
      entity: "LeaveRequest",
      entityId: requestId,
      metadata: { reviewNote: parsed.data.reviewNote },
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/admin/requests");
  return { success: true };
}
