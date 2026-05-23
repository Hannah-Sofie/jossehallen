import { PawPrint } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Merkevaretilpasset plassholder som vises når et kurs eller en instruktør
 * mangler bilde. Varm terracotta-tone + pote-ikon i stedet for flat grå
 * gradient, slik at tomme bilder ser bevisste ut.
 */
export function BildeFallback({
  className,
  iconClassName,
}: {
  className?: string;
  iconClassName?: string;
}) {
  return (
    <div
      className={cn(
        "flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/15 via-primary/[0.07] to-secondary",
        className,
      )}
      aria-hidden
    >
      <PawPrint
        className={cn("h-1/3 w-1/3 max-h-20 max-w-20 text-primary/30", iconClassName)}
      />
    </div>
  );
}
