"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import * as Dialog from "@radix-ui/react-dialog";
import { leaveRequestSchema, type LeaveRequestInput } from "@/lib/validators";
import { createLeaveRequest } from "@/server/actions/leave";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, X } from "lucide-react";
import { calculateWorkingDays } from "@/lib/utils";

interface LeaveType {
  id: string;
  name: string;
  color: string;
}

export function NewRequestDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [workingDays, setWorkingDays] = useState(0);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LeaveRequestInput>({
    resolver: zodResolver(leaveRequestSchema),
  });

  const startDate = watch("startDate");
  const endDate = watch("endDate");

  useEffect(() => {
    if (startDate && endDate) {
      const days = calculateWorkingDays(new Date(startDate), new Date(endDate));
      setWorkingDays(days > 0 ? days : 0);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    if (open) {
      fetch("/api/leave-types")
        .then((r) => r.json())
        .then(setLeaveTypes)
        .catch(() => {});
    }
  }, [open]);

  const onSubmit = async (data: LeaveRequestInput) => {
    const result = await createLeaveRequest(data);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success("Leave request submitted.");
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 dark:bg-black/70 z-40 animate-in fade-in" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 shadow-xl animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-center justify-between mb-5">
            <Dialog.Title className="text-base font-semibold text-gray-900 dark:text-white">
              New Leave Request
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-md p-0.5 focus-visible:ring-2 focus-visible:ring-indigo-500">
                <X className="h-4 w-4" />
              </button>
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div className="space-y-1.5">
              <Label>Leave Type</Label>
              <Select onValueChange={(v) => setValue("leaveTypeId", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select leave type" />
                </SelectTrigger>
                <SelectContent>
                  {leaveTypes.map((lt) => (
                    <SelectItem key={lt.id} value={lt.id}>
                      <div className="flex items-center gap-2">
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: lt.color }}
                        />
                        {lt.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.leaveTypeId && (
                <p className="text-xs text-red-600">{errors.leaveTypeId.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  {...register("startDate")}
                />
                {errors.startDate && (
                  <p className="text-xs text-red-600">{errors.startDate.message}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  min={startDate || new Date().toISOString().split("T")[0]}
                  {...register("endDate")}
                />
                {errors.endDate && (
                  <p className="text-xs text-red-600">{errors.endDate.message}</p>
                )}
              </div>
            </div>

            {workingDays > 0 && (
              <p className="text-xs text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 rounded-md px-3 py-2">
                {workingDays} working day{workingDays !== 1 ? "s" : ""} selected
              </p>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="reason">Reason</Label>
              <Textarea
                id="reason"
                placeholder="Brief description of your leave (min. 10 characters)"
                rows={3}
                {...register("reason")}
              />
              {errors.reason && (
                <p className="text-xs text-red-600">{errors.reason.message}</p>
              )}
            </div>

            <div className="flex gap-3 pt-1">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Submitting…
                  </>
                ) : (
                  "Submit Request"
                )}
              </Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
