"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { NewRequestDialog } from "./new-request-dialog";

export function NewRequestButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)} size="sm">
        <Plus className="h-4 w-4" />
        New Request
      </Button>
      <NewRequestDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
