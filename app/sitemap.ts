import type { MetadataRoute } from "next";
import { hentAktiveKurs } from "@/lib/kurs";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const statiske: MetadataRoute.Sitemap = [
    "",
    "/kurs",
    "/leie",
    "/kontakt",
    "/vilkar",
    "/personvern",
  ].map((p) => ({
    url: `${siteUrl}${p}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: p === "" ? 1 : 0.7,
  }));

  let kurs: MetadataRoute.Sitemap = [];
  try {
    const aktive = await hentAktiveKurs();
    kurs = aktive.map((k) => ({
      url: `${siteUrl}/kurs/${k.id}`,
      lastModified: new Date(k.opprettet),
      changeFrequency: "weekly",
      priority: 0.6,
    }));
  } catch {
    // Hvis DB ikke er tilgjengelig under bygg, hopp over kurs-URL-er
  }

  return [...statiske, ...kurs];
}
