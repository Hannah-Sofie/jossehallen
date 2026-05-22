"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowUp } from "lucide-react";
import { forfremFraVenteliste } from "@/lib/admin/paameldinger";
import { Button } from "@/components/ui/button";

export function ForfremKnapp({ id }: { id: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function onClick() {
    startTransition(async () => {
      const res = await forfremFraVenteliste(id);
      if (res.ok) {
        toast.success("Forfremmet fra venteliste");
        router.refresh();
      } else toast.error(res.feil);
    });
  }

  return (
    <Button variant="outline" size="sm" onClick={onClick} disabled={pending}>
      <ArrowUp className="mr-1 h-3.5 w-3.5" />
      {pending ? "..." : "Forfrem"}
    </Button>
  );
}
