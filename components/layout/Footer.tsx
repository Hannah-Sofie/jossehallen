import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Jossehallen"
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
        </div>

        <div>
          <h3 className="text-sm font-semibold">Lenker</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link href="/kurs" className="hover:text-foreground">Kurs</Link></li>
            <li><Link href="/leie" className="hover:text-foreground">Leie hall</Link></li>
            <li><Link href="/kontakt" className="hover:text-foreground">Kontakt</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold">Kontakt</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <MapPin className="h-4 w-4" aria-hidden />
              <span>Adresse kommer</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4" aria-hidden />
              <a href="tel:" className="hover:text-foreground">Telefon kommer</a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4" aria-hidden />
              <a href="mailto:" className="hover:text-foreground">E-post kommer</a>
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
