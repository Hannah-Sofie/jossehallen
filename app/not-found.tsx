import Link from "next/link";
import { PawPrint } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center sm:px-6">
      <PawPrint className="h-12 w-12 text-muted-foreground" aria-hidden />
      <h1 className="mt-6 text-3xl font-semibold tracking-tight">
        Ops — denne siden finnes ikke
      </h1>
      <p className="mt-3 text-muted-foreground">
        Siden du leter etter er flyttet eller har aldri eksistert. La oss få deg
        tilbake på rett spor.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link href="/" className={buttonVariants()}>
          Til forsiden
        </Link>
        <Link href="/kurs" className={buttonVariants({ variant: "outline" })}>
          Se kurs
        </Link>
      </div>
    </div>
  );
}
