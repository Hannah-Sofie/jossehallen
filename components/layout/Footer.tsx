import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div>
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt=""
              width={48}
              height={48}
              className="h-12 w-12"
            />
            <span className="font-brand text-lg font-extrabold tracking-wide">
              JOSSEHALLEN
            </span>
          </Link>
          <p className="mt-3 text-sm text-muted-foreground">
            Innendørs hundehall i Moelv. Kurs, trening og utleie.
          </p>
          <div className="mt-4 flex gap-4 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground">
              Facebook
            </a>
            <a href="#" className="hover:text-foreground">
              Instagram
            </a>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold">Lenker</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link href="/kurs" className="hover:text-foreground">Kurs</Link></li>
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

      {/* Kart */}
      <div className="mx-auto max-w-6xl px-4 pb-12 sm:px-6">
        <div className="overflow-hidden rounded-2xl border">
          <iframe
            title="Kart til Jossehallen"
            src="https://www.google.com/maps?q=Moelv&z=13&output=embed"
            className="h-64 w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
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
