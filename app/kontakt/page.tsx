import type { Metadata } from "next";
import { Mail, Phone, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "Kontakt",
  description: "Kontakt Jossehallen.",
};

export default function KontaktPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
      <h1 className="text-4xl font-semibold tracking-tight">Kontakt oss</h1>
      <p className="mt-4 text-muted-foreground">
        Lurer du på noe om kurs, leie eller hallen generelt? Ta kontakt.
      </p>

      <ul className="mt-8 space-y-4">
        <li className="flex items-center gap-3">
          <MapPin className="h-5 w-5 text-muted-foreground" aria-hidden />
          <span>Adresse kommer</span>
        </li>
        <li className="flex items-center gap-3">
          <Phone className="h-5 w-5 text-muted-foreground" aria-hidden />
          <a href="tel:" className="hover:underline">Telefon kommer</a>
        </li>
        <li className="flex items-center gap-3">
          <Mail className="h-5 w-5 text-muted-foreground" aria-hidden />
          <a href="mailto:" className="hover:underline">E-post kommer</a>
        </li>
      </ul>
    </div>
  );
}
