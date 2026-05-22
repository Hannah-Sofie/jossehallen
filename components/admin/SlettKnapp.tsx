"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function SlettKnapp({
  slett,
  label = "Slett",
}: {
  slett: () => Promise<{ ok: true } | { ok: false; feil: string }>;
  label?: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function onClick() {
    startTransition(async () => {
      const res = await slett();
      if (res.ok) {
        toast.success("Slettet");
        router.refresh();
      } else toast.error(res.feil);
    });
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className="text-destructive"
      onClick={onClick}
      disabled={pending}
    >
      {pending ? "..." : label}
    </Button>
  );
}
