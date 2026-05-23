import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Rediger spørsmål/svar her etter behov.
const faq = [
  {
    sp: "Må jeg ha konto for å melde på kurs?",
    sv: "Nei. Du kan melde deg på kurs uten konto. Har du konto, fylles skjemaet ut automatisk. For å booke halltid privat må du derimot ha konto.",
  },
  {
    sp: "Hvordan betaler jeg?",
    sv: "Du betaler med Vipps eller til bankkonto, merket med referansen du får ved påmelding. Plassen bekreftes når betalingen er registrert.",
  },
  {
    sp: "Hva om kurset er fullt?",
    sv: "Da kan du sette deg på venteliste. Vi kontakter deg om en plass blir ledig.",
  },
  {
    sp: "Hvordan avbestiller jeg?",
    sv: "Ta kontakt med oss på e-post eller telefon i god tid før kurset eller bookingen. Se vilkårene for frister.",
  },
  {
    sp: "Hvordan kommer jeg inn i hallen når jeg har booket?",
    sv: "Du får en PIN-kode til døren på «Min side». Koden vises fra 15 minutter før til 15 minutter etter den tiden du har booket.",
  },
  {
    sp: "Må hunden være vaksinert?",
    sv: "Ja. Alle hunder som deltar skal være friske og vaksinert.",
  },
];

export function Faq() {
  return (
    <section className="border-t bg-muted/40">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="text-center">
          <p className="font-medium text-primary">Spørsmål og svar</p>
          <h2 className="mt-2 font-brand text-3xl font-bold tracking-tight sm:text-4xl">
            Ofte stilte spørsmål
          </h2>
        </div>
        <Accordion className="mt-10 space-y-3">
          {faq.map((f, i) => (
            <AccordionItem
              key={i}
              value={`q${i}`}
              className="rounded-2xl border bg-card px-5 shadow-sm transition-colors hover:border-primary/40 has-[[aria-expanded=true]]:border-primary/50"
            >
              <AccordionTrigger className="py-4 text-base font-medium hover:no-underline aria-expanded:text-primary">
                {f.sp}
              </AccordionTrigger>
              <AccordionContent className="text-base leading-relaxed text-muted-foreground">
                {f.sv}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
