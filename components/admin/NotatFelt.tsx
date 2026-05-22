"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { lagreNotat } from "@/lib/admin/deltakerliste";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export function NotatFelt({
  paameldingId,
  start,
}: {
  paameldingId: string;
  start: string;
}) {
  const [verdi, setVerdi] = useState(start);
  const [pending, startTransition] = useTransition();
  const endret = verdi !== start;

  function lagre() {
    startTransition(async () => {
      const res = await lagreNotat(paameldingId, verdi);
      if (res.ok) toast.success("Notat lagret");
      else toast.error(res.feil);
    });
  }

  return (
    <div className="flex flex-col gap-1">
      <Textarea
        rows={2}
        value={verdi}
        onChange={(e) => setVerdi(e.target.value)}
        placeholder="Internt notat..."
        className="min-w-48 text-xs"
      />
      {endret ? (
        <Button size="sm" variant="outline" onClick={lagre} disabled={pending}>
          {pending ? "Lagrer..." : "Lagre notat"}
        </Button>
      ) : null}
    </div>
  );
}
