/**
 * Manuelt vedlikeholdte typer som matcher supabase/schema.sql.
 * Når schema endres → oppdater her, eller kjør:
 *   npx supabase gen types typescript --project-id <id> > types/database.ts
 */

export type Nivaa = "nybegynner" | "viderekomne" | "avansert" | "alle";
export type PaameldingStatus =
  | "venter_betaling"
  | "bekreftet"
  | "avbrutt"
  | "venteliste";
export type BookingStatus = "venter_betaling" | "bekreftet" | "avbrutt";

export type Instruktor = {
  id: string;
  navn: string;
  bio: string;
  bilde_url: string | null;
  opprettet: string;
};

export type Kurs = {
  id: string;
  navn: string;
  beskrivelse: string;
  instruktor_id: string | null;
  bilde_url: string | null;
  nivaa: Nivaa;
  sted: string;
  tidspunkt: string;
  hva_laerer: string;
  ta_med: string;
  start_dato: string;
  slutt_dato: string | null;
  pris: number;
  maks_deltakere: number;
  aktiv: boolean;
  opprettet: string;
};

export type Kurspaamelding = {
  id: string;
  kurs_id: string;
  fornavn: string;
  etternavn: string;
  epost: string;
  telefon: string;
  adresse: string;
  postnummer: string;
  poststed: string;
  hund_navn: string;
  hund_alder: number | null;
  hund_rase: string;
  kastrert: boolean;
  kommentar: string;
  status: PaameldingStatus;
  venteliste_posisjon: number | null;
  vilkar_godtatt_dato: string | null;
  opprettet: string;
};

export type TilgjengeligTid = {
  id: string;
  dato: string;
  start_tid: string;
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

type InsertOf<T, Optional extends keyof T> = Omit<T, Optional> &
  Partial<Pick<T, Optional>>;

export type Database = {
  public: {
    Tables: {
      instruktorer: {
        Row: Instruktor;
        Insert: InsertOf<Instruktor, "id" | "opprettet" | "bio" | "bilde_url">;
        Update: Partial<Omit<Instruktor, "id">>;
      };
      kurs: {
        Row: Kurs;
        Insert: InsertOf<
          Kurs,
          | "id"
          | "opprettet"
          | "aktiv"
          | "instruktor_id"
          | "bilde_url"
          | "nivaa"
          | "sted"
          | "tidspunkt"
          | "hva_laerer"
          | "ta_med"
          | "slutt_dato"
          | "pris"
          | "maks_deltakere"
          | "beskrivelse"
        >;
        Update: Partial<Omit<Kurs, "id">>;
      };
      kurspaameldinger: {
        Row: Kurspaamelding;
        Insert: InsertOf<
          Kurspaamelding,
          | "id"
          | "opprettet"
          | "status"
          | "hund_rase"
          | "hund_alder"
          | "kommentar"
          | "adresse"
          | "postnummer"
          | "poststed"
          | "kastrert"
          | "venteliste_posisjon"
          | "vilkar_godtatt_dato"
        >;
        Update: Partial<Omit<Kurspaamelding, "id">>;
      };
      tilgjengelige_tider: {
        Row: TilgjengeligTid;
        Insert: InsertOf<TilgjengeligTid, "id" | "opprettet" | "ledig">;
        Update: Partial<Omit<TilgjengeligTid, "id">>;
      };
      bookinger: {
        Row: Booking;
        Insert: InsertOf<
          Booking,
          "id" | "opprettet" | "status" | "formaal"
        >;
        Update: Partial<Omit<Booking, "id">>;
      };
    };
    Enums: {
      paamelding_status: PaameldingStatus;
      booking_status: BookingStatus;
    };
  };
};
