import type { Metadata } from "next";
import { DM_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from "@/components/ui/sonner";
import { hentBruker } from "@/lib/auth";

// DM Sans brukes både for brødtekst og overskrifter/wordmark (én font overalt).
const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Jossehallen – innendørs hundehall i Moelv",
    template: "%s | Jossehallen",
  },
  description:
    "Innendørs hundehall i Moelv for kurs, trening og leie. Meld deg på kurs eller bestill halltid.",
  keywords: [
    "hundehall",
    "hundekurs",
    "Moelv",
    "valpekurs",
    "agility",
    "hundetrening",
    "leie hall",
  ],
  openGraph: {
    title: "Jossehallen – innendørs hundehall i Moelv",
    description: "Kurs, trening og leie av innendørs hundehall i Moelv.",
    url: siteUrl,
    siteName: "Jossehallen",
    locale: "nb_NO",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jossehallen",
    description: "Innendørs hundehall i Moelv for kurs, trening og leie.",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const auth = await hentBruker();
  const bruker = auth
    ? { fornavn: auth.profil.fornavn, rolle: auth.profil.rolle }
    : null;

  return (
    <html
      lang="nb"
      className={`${dmSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Header bruker={bruker} />
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
