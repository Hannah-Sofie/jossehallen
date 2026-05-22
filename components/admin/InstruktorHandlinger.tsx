"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

import { slettInstruktor } from "@/lib/admin/instruktorer";
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

export function InstruktorHandlinger({
  id,
  navn,
}: {
  id: string;
  navn: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  function slett() {
    startTransition(async () => {
      const res = await slettInstruktor(id);
      if (res.ok) {
        toast.success("Instruktør slettet");
        setOpen(false);
        router.refresh();
      } else toast.error(res.feil);
    });
  }

  return (
    <div className="flex justify-end gap-2">
      <Link
        href={`/admin/instruktorer/${id}`}
        className={buttonVariants({ variant: "outline", size: "sm" })}
      >
        Rediger
      </Link>
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
            <DialogTitle>Slette instruktøren?</DialogTitle>
            <DialogDescription>
              «{navn}» fjernes. Kurs som peker hit får ingen instruktør (de
              slettes ikke).
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose render={<Button variant="outline">Avbryt</Button>} />
            <Button variant="destructive" onClick={slett} disabled={pending}>
              {pending ? "Sletter..." : "Slett"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
