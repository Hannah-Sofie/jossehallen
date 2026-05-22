import { Resend } from "resend";
import {
  kursBekreftelseHtml,
  kursBekreftelseEmne,
  type KursBekreftelseData,
} from "@/lib/email/templates";

const apiKey = process.env.RESEND_API_KEY;
const fra = process.env.EMAIL_FROM || "Jossehallen <onboarding@resend.dev>";

const resend = apiKey ? new Resend(apiKey) : null;

type SendResultat = { sendt: boolean; feil?: string };

/**
 * Sender kursbekreftelse. Feiler ALDRI hardt — hvis Resend ikke er konfigurert
 * eller sending feiler, logges det og flyten fortsetter (påmeldingen er allerede lagret).
 */
export async function sendKursBekreftelse(
  til: string,
  data: KursBekreftelseData,
): Promise<SendResultat> {
  if (!resend) {
    console.warn("[email] RESEND_API_KEY mangler — hopper over e-post til", til);
    return { sendt: false, feil: "ikke konfigurert" };
  }
  try {
    const { error } = await resend.emails.send({
      from: fra,
      to: til,
      subject: kursBekreftelseEmne(data),
      html: kursBekreftelseHtml(data),
    });
    if (error) {
      console.error("[email] Resend-feil:", error);
      return { sendt: false, feil: error.message };
    }
    return { sendt: true };
  } catch (e) {
    console.error("[email] Uventet feil:", e);
    return { sendt: false, feil: e instanceof Error ? e.message : "ukjent" };
  }
}
