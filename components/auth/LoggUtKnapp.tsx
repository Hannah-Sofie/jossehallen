"use client";

import { useTransition } from "react";
import { LogOut } from "lucide-react";
import { loggUt } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";

export function LoggUtKnapp({
  variant = "outline",
}: {
  variant?: "outline" | "ghost" | "default";
}) {
  const [pending, startTransition] = useTransition();
  return (
    <Button
      variant={variant}
      size="sm"
      disabled={pending}
      onClick={() => startTransition(() => loggUt())}
    >
      <LogOut className="mr-1 h-4 w-4" />
      {pending ? "Logger ut..." : "Logg ut"}
    </Button>
  );
}
