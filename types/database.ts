/**
 * Manuelt vedlikeholdte typer som matcher supabase/schema.sql.
 * Når schema endres → oppdater her, eller kjør:
 *   npx supabase gen types typescript --project-id <id> > types/database.ts
 */

export type PaameldingStatus = "venter_betaling" | "bekreftet" | "avbrutt";
export type BookingStatus = "venter_betaling" | "bekreftet" | "avbrutt";

export type Kurs = {
  id: string;
  navn: string;
  beskrivelse: string;
  start_dato: string; // ISO date
  slutt_dato: string | null;
  pris: number;
  maks_deltakere: number;
  aktiv: boolean;
  opprettet: string; // ISO timestamp
};

export type Kurspaamelding = {
  id: string;
  kurs_id: string;
  navn: string;
  epost: string;
  telefon: string;
  hund_navn: string;
  hund_rase: string;
  kommentar: string;
  status: PaameldingStatus;
  opprettet: string;
};

export type TilgjengeligTid = {
  id: string;
  dato: string;
  start_tid: string; // HH:MM:SS
  slutt_tid: string;
  ledig: boolean;
  opprettet: string;
};

export type Booking = {
  id: string;
  tid_id: string;
  navn: string;
  epost: string;
  telefon: string;
  formaal: string;
  status: BookingStatus;
  opprettet: string;
};

export type Database = {
  public: {
    Tables: {
      kurs: {
        Row: Kurs;
        Insert: Omit<Kurs, "id" | "opprettet" | "aktiv"> & {
          id?: string;
          opprettet?: string;
          aktiv?: boolean;
        };
        Update: Partial<Omit<Kurs, "id">>;
      };
      kurspaameldinger: {
        Row: Kurspaamelding;
        Insert: Omit<Kurspaamelding, "id" | "opprettet" | "status" | "hund_rase" | "kommentar"> & {
          id?: string;
          opprettet?: string;
          status?: PaameldingStatus;
          hund_rase?: string;
          kommentar?: string;
        };
        Update: Partial<Omit<Kurspaamelding, "id">>;
      };
      tilgjengelige_tider: {
        Row: TilgjengeligTid;
        Insert: Omit<TilgjengeligTid, "id" | "opprettet" | "ledig"> & {
          id?: string;
          opprettet?: string;
          ledig?: boolean;
        };
        Update: Partial<Omit<TilgjengeligTid, "id">>;
      };
      bookinger: {
        Row: Booking;
        Insert: Omit<Booking, "id" | "opprettet" | "status" | "formaal"> & {
          id?: string;
          opprettet?: string;
          status?: BookingStatus;
          formaal?: string;
        };
        Update: Partial<Omit<Booking, "id">>;
      };
    };
    Enums: {
      paamelding_status: PaameldingStatus;
      booking_status: BookingStatus;
    };
  };
};
