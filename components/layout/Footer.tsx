import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

function FacebookIkon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
      <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12Z" />
    </svg>
  );
}

function InstagramIkon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t bg-muted/40">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div>
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo.png" alt="" width={48} height={48} className="h-12 w-12" />
            <span className="font-brand text-lg font-semibold uppercase tracking-wide">
              Jossehallen
            </span>
          </Link>
          <p className="mt-3 text-sm text-muted-foreground">
            Innendørs hundehall i Moelv. Kurs, trening og utleie.
          </p>
          <div className="mt-4 flex gap-3">
            <a
              href="#"
              aria-label="Facebook"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-background text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              <FacebookIkon />
            </a>
            <a
              href="#"
              aria-label="Instagram"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-background text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              <InstagramIkon />
            </a>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold">Lenker</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link href="/kurs" className="hover:text-foreground">Kurs og treninger</Link></li>
            <li><Link href="/leie" className="hover:text-foreground">Leie hall</Link></li>
            <li><Link href="/om" className="hover:text-foreground">Om hallen</Link></li>
            <li><Link href="/kontakt" className="hover:text-foreground">Kontakt</Link></li>
            <li><Link href="/vilkar" className="hover:text-foreground">Vilkår</Link></li>
            <li><Link href="/personvern" className="hover:text-foreground">Personvern</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold">Kontakt</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <MapPin className="h-4 w-4 shrink-0" aria-hidden />
              <span>Adresse kommer, Moelv</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0" aria-hidden />
              <a href="tel:" className="hover:text-foreground">Telefon kommer</a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 shrink-0" aria-hidden />
              <a href="mailto:" className="hover:text-foreground">E-post kommer</a>
            </li>
          </ul>
          {/* Lite kart */}
          <div className="mt-4 overflow-hidden rounded-xl border">
            <iframe
              title="Kart til Jossehallen"
              src="https://www.google.com/maps?q=Moelv&z=13&output=embed"
              className="h-32 w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold">Åpningstider</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <Clock className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
              <span>
                Etter avtale og ved kurs/booking.
                <br />
                <span className="text-xs">[Fyll inn faste tider.]</span>
              </span>
            </li>
          </ul>
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
