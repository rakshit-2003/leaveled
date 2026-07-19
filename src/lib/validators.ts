import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[0-9]/, "Must contain at least one number"),
  department: z.string().optional(),
});

export const leaveRequestSchema = z
  .object({
    leaveTypeId: z.string().min(1, "Please select a leave type"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    reason: z.string().min(10, "Reason must be at least 10 characters").max(500),
  })
  .refine(
    (data) => new Date(data.startDate) <= new Date(data.endDate),
    { message: "End date must be after start date", path: ["endDate"] }
  );

export const reviewRequestSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED"]),
  reviewNote: z.string().max(500).optional(),
});

export const leaveTypeSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  defaultDays: z.number().min(0).max(365),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid color"),
  requiresProof: z.boolean().default(false),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  department: z.string().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type LeaveRequestInput = z.infer<typeof leaveRequestSchema>;
export type ReviewRequestInput = z.infer<typeof reviewRequestSchema>;
export type LeaveTypeInput = z.infer<typeof leaveTypeSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
