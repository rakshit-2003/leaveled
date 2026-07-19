import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, differenceInBusinessDays, isWeekend, addDays } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  return format(new Date(date), "MMM d, yyyy");
}

export function formatDateTime(date: Date | string): string {
  return format(new Date(date), "MMM d, yyyy 'at' h:mm a");
}

/**
 * Calculate working days between two dates (excluding weekends)
 */
export function calculateWorkingDays(start: Date, end: Date): number {
  let count = 0;
  let current = new Date(start);
  while (current <= end) {
    if (!isWeekend(current)) count++;
    current = addDays(current, 1);
  }
  return count;
}

export function getStatusColor(status: string): string {
  switch (status) {
    case "APPROVED":
      return "text-green-700 bg-green-50 border-green-200";
    case "REJECTED":
      return "text-red-700 bg-red-50 border-red-200";
    case "PENDING":
      return "text-yellow-700 bg-yellow-50 border-yellow-200";
    case "CANCELLED":
      return "text-gray-600 bg-gray-50 border-gray-200";
    default:
      return "text-gray-600 bg-gray-50 border-gray-200";
  }
}

export function getInitials(name: string | null | undefined): string {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}
