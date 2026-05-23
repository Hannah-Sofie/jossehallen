import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin, Clock, PawPrint } from "lucide-react";

function FacebookIkon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
      <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12Z" />
    </svg>
  );
}

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t bg-primary/[0.08]">
      <PawPrint
        aria-hidden
        className="pointer-events-none absolute -right-4 top-8 h-28 w-28 rotate-12 text-primary/10"
      />
      <div className="relative mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div>
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo.png" alt="" width={48} height={48} className="h-12 w-12" />
            <span className="font-brand text-lg font-semibold uppercase tracking-wide">
              Jossehallen
            </span>
          </Link>
          <p className="mt-3 text-base text-muted-foreground">
            Innendørs hundehall i Moelv. Kurs, trening og utleie.
          </p>
          <a
            href="https://www.facebook.com/profile.php?id=61584794071924"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1877F2] text-white">
              <FacebookIkon />
            </span>
            Følg oss på Facebook
          </a>
        </div>

        <div>
          <h3 className="text-base font-semibold">Lenker</h3>
          <ul className="mt-3 space-y-2 text-base text-muted-foreground">
            <li><Link href="/kurs" className="hover:text-foreground">Kurs og treninger</Link></li>
            <li><Link href="/leie" className="hover:text-foreground">Leie hall</Link></li>
            <li><Link href="/om" className="hover:text-foreground">Om hallen</Link></li>
            <li><Link href="/kontakt" className="hover:text-foreground">Kontakt</Link></li>
            <li><Link href="/vilkar" className="hover:text-foreground">Vilkår</Link></li>
            <li><Link href="/personvern" className="hover:text-foreground">Personvern</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-base font-semibold">Kontakt</h3>
          <ul className="mt-3 space-y-3 text-base text-muted-foreground">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
              <a
                href="https://www.google.com/maps?q=Kinnevegen+62,+2390+Moelv"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground"
              >
                Kinnevegen 62, 2390 Moelv
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0" aria-hidden />
              <a href="tel:+4746805824" className="hover:text-foreground">+47 46 80 58 24</a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 shrink-0" aria-hidden />
              <a href="mailto:jossehallen@hundehall.no" className="hover:text-foreground">
                jossehallen@hundehall.no
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-base font-semibold">Åpningstider</h3>
          <ul className="mt-3 space-y-1 text-base text-muted-foreground">
            <li className="flex justify-between gap-4">
              <span>Mandag–søndag</span>
              <span>09:00–22:00</span>
            </li>
            <li className="mt-3 flex items-start gap-2 text-sm">
              <Clock className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
              <span>Ellers etter avtale ved kurs/booking.</span>
            </li>
          </ul>
          {/* Lite kart */}
          <div className="mt-4 overflow-hidden rounded-xl border">
            <iframe
              title="Kart til Jossehallen"
              src="https://www.google.com/maps?q=Kinnevegen+62,+2390+Moelv&z=15&output=embed"
              className="h-32 w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>

      <div className="border-t">
        <div className="mx-auto max-w-6xl px-4 py-4 text-center text-xs text-muted-foreground sm:px-6">
          © {year} Jossehallen
        </div>
      </div>
    </footer>
  );
}
