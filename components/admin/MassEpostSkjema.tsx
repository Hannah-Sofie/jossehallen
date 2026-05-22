"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { sendMassEpost } from "@/lib/admin/deltakerliste";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export function MassEpostSkjema({ kursId }: { kursId: string }) {
  const [emne, setEmne] = useState("");
  const [melding, setMelding] = useState("");
  const [pending, startTransition] = useTransition();

  function send() {
    startTransition(async () => {
      const res = await sendMassEpost(kursId, emne, melding);
      if (res.ok) {
        toast.success(`Sendt til ${res.antall} deltakere`);
        setEmne("");
        setMelding("");
      } else toast.error(res.feil);
    });
  }

  return (
    <div className="space-y-3 rounded-lg border bg-muted/30 p-4">
      <p className="text-sm font-medium">Send melding til aktive deltakere</p>
      <div className="space-y-1">
        <Label htmlFor="emne">Emne</Label>
        <Input
          id="emne"
          value={emne}
          onChange={(e) => setEmne(e.target.value)}
          placeholder="f.eks. Endret oppmøtested"
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="melding">Melding</Label>
        <Textarea
          id="melding"
          rows={4}
          value={melding}
          onChange={(e) => setMelding(e.target.value)}
        />
      </div>
      <Button onClick={send} disabled={pending || !emne.trim() || !melding.trim()}>
        {pending ? "Sender..." : "Send til deltakere"}
      </Button>
      <p className="text-xs text-muted-foreground">
        Sendes til alle med status «venter betaling» eller «bekreftet».
      </p>
    </div>
  );
}
