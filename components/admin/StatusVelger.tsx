"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props<T extends string> = {
  verdi: T;
  valg: { value: T; label: string }[];
  endre: (verdi: T) => Promise<{ ok: true } | { ok: false; feil: string }>;
};

export function StatusVelger<T extends string>({ verdi, valg, endre }: Props<T>) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function onChange(ny: string | null) {
    if (!ny) return;
    startTransition(async () => {
      const res = await endre(ny as T);
      if (res.ok) {
        toast.success("Status oppdatert");
        router.refresh();
      } else toast.error(res.feil);
    });
  }

  return (
    <Select value={verdi} onValueChange={onChange} disabled={pending}>
      <SelectTrigger size="sm" className="w-44">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {valg.map((v) => (
          <SelectItem key={v.value} value={v.value}>
            {v.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
