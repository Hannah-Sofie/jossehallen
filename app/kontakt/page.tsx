import type { Metadata } from "next";
import { Mail, Phone, MapPin, Clock, PawPrint } from "lucide-react";
import { KontaktSkjema } from "@/components/kontakt/KontaktSkjema";

export const metadata: Metadata = {
  title: "Kontakt",
  description:
    "Kontakt Jossehallen i Moelv – spørsmål om kurs, leie eller hallen generelt.",
};

const KART =
  "https://www.google.com/maps?q=Kinnevegen+62,+2390+Moelv&z=15&output=embed";
const MAPS_LENKE = "https://www.google.com/maps?q=Kinnevegen+62,+2390+Moelv";

function FacebookIkon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
      <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12Z" />
    </svg>
  );
}

const infoChip =
  "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary";

export default function KontaktPage() {
  return (
    <div className="relative overflow-hidden">
      <PawPrint
        aria-hidden
        className="pointer-events-none absolute -right-6 top-24 h-28 w-28 rotate-12 text-primary/10"
      />
      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="max-w-2xl">
          <p className="font-medium text-primary">Kontakt</p>
          <h1 className="mt-2 font-brand text-4xl font-bold tracking-tight sm:text-5xl">
            Ta kontakt
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Lurer du på noe om kurs, leie eller hallen generelt? Send oss en
            melding, eller bruk infoen under – vi svarer så snart vi kan.
          </p>
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-2">
          {/* Venstre: kontaktinfo + kart */}
          <div className="space-y-8">
            <ul className="space-y-5">
              <li className="flex items-start gap-4">
                <span className={infoChip}>
                  <MapPin className="h-5 w-5" aria-hidden />
                </span>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Adresse
                  </p>
                  <a
                    href={MAPS_LENKE}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base transition-colors hover:text-primary"
                  >
                    Kinnevegen 62, 2390 Moelv
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <span className={infoChip}>
                  <Phone className="h-5 w-5" aria-hidden />
                </span>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Telefon
                  </p>
                  <a
                    href="tel:+4746805824"
                    className="text-base transition-colors hover:text-primary"
                  >
                    +47 46 80 58 24
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <span className={infoChip}>
                  <Mail className="h-5 w-5" aria-hidden />
                </span>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    E-post
                  </p>
                  <a
                    href="mailto:jossehallen@hundehall.no"
                    className="text-base transition-colors hover:text-primary"
                  >
                    jossehallen@hundehall.no
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <span className={infoChip}>
                  <Clock className="h-5 w-5" aria-hidden />
                </span>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Åpningstider
                  </p>
                  <p className="text-base">Alle dager 09:00–22:00</p>
                  <p className="text-sm text-muted-foreground">
                    Ellers etter avtale ved kurs/booking.
                  </p>
                </div>
              </li>
            </ul>

            <a
              href="https://www.facebook.com/profile.php?id=61584794071924"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1877F2] text-white">
                <FacebookIkon />
              </span>
              Følg oss på Facebook
            </a>

            <div className="overflow-hidden rounded-2xl border">
              <iframe
                title="Kart til Jossehallen"
                src={KART}
                className="h-64 w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Høyre: skjema */}
          <div className="rounded-3xl border bg-card p-6 shadow-sm sm:p-8">
            <h2 className="font-brand text-2xl font-bold tracking-tight">
              Send en melding
            </h2>
            <p className="mt-2 text-muted-foreground">
              Fyll ut skjemaet, så tar vi kontakt.
            </p>
            <div className="mt-6">
              <KontaktSkjema />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
