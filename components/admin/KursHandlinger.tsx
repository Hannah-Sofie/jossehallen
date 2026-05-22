"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

import { settAktiv, slettKurs } from "@/lib/admin/kurs";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

export function KursHandlinger({
  id,
  navn,
  aktiv,
}: {
  id: string;
  navn: string;
  aktiv: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  function toggle() {
    startTransition(async () => {
      const res = await settAktiv(id, !aktiv);
      if (res.ok) {
        toast.success(aktiv ? "Kurs skjult" : "Kurs publisert");
        router.refresh();
      } else toast.error(res.feil);
    });
  }

  function slett() {
    startTransition(async () => {
      const res = await slettKurs(id);
      if (res.ok) {
        toast.success("Kurs slettet");
        setOpen(false);
        router.refresh();
      } else toast.error(res.feil);
    });
  }

  return (
    <div className="flex flex-wrap justify-end gap-2">
      <Link
        href={`/admin/kurs/${id}`}
        className={buttonVariants({ variant: "outline", size: "sm" })}
      >
        Rediger
      </Link>
      <Button variant="ghost" size="sm" onClick={toggle} disabled={pending}>
        {aktiv ? "Skjul" : "Publiser"}
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <Button
          variant="ghost"
          size="sm"
          className="text-destructive"
          onClick={() => setOpen(true)}
        >
          Slett
        </Button>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Slette kurset?</DialogTitle>
            <DialogDescription>
              «{navn}» og alle påmeldinger til kurset slettes permanent. Dette kan
              ikke angres.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose
              render={<Button variant="outline">Avbryt</Button>}
            />
            <Button
              variant="destructive"
              onClick={slett}
              disabled={pending}
            >
              {pending ? "Sletter..." : "Slett kurs"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
