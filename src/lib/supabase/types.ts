// Hand-written types mirroring supabase/schema.sql

// ---------------------------------------------------------------------------
// site_content jsonb shapes — one per known key
// ---------------------------------------------------------------------------

export interface HomeHeroData {
  headline_top: string;
  headline_em: string;
  sub: string;
  kicker: string;
  hero_image?: string;
  cta_browse?: string;
  cta_chauffeur?: string;
}

export interface HomeAboutData {
  heading: string;
  body: string;
  kicker?: string;
}

export interface HomeHowItWorksStep {
  num: string;
  heading: string;
  body: string;
  icon: string;
}

export interface HomeHowItWorksData {
  section_heading: string;
  steps: HomeHowItWorksStep[];
  cta_label?: string;
}

export interface HomeQuoteData {
  quote: string;
  attribution: string;
}

export interface HomeFeaturedHeadingData {
  section_heading: string;
  featured_slugs: string[];
  kicker?: string;
  cta_label?: string;
}

export interface HomeGroupPackagesData {
  section_heading?: string;
  kicker?: string;
  cta_label?: string;
}

export interface ToursHeroData {
  page_heading: string;
  page_lede: string;
}

export interface HotelsPageData {
  kicker?: string;
  page_heading?: string;
  page_lede?: string;
  property_singular?: string;
  property_plural?: string;
  region_index_kicker?: string;
  region_index_heading?: string;
  region_index_lede?: string;
  region_section_heading_template?: string;
  region_section_cta_label?: string;
  region_card_eyebrow_label?: string;
  region_card_stay_label?: string;
  hotel_card_cta_label?: string;
}

export interface TransportHeroData {
  hero_heading_top: string;
  hero_heading_em: string;
  hero_sub: string;
  fleet_heading: string;
}

// ---------------------------------------------------------------------------
// Row types — mirror exact column names from schema.sql
// ---------------------------------------------------------------------------

export interface HomeFeaturedHotelsHeadingData {
  section_heading: string;
  kicker?: string;
  cta_label?: string;
}

export type SiteContentKey =
  | 'home_hero'
  | 'home_about'
  | 'home_how_it_works'
  | 'home_quote'
  | 'home_featured_heading'
  | 'home_featured_hotels_heading'
  | 'home_group_packages'
  | 'tours_hero'
  | 'transport_hero'
  | 'hotels_page';

export interface SiteContentDataMap {
  home_hero: HomeHeroData;
  home_about: HomeAboutData;
  home_how_it_works: HomeHowItWorksData;
  home_quote: HomeQuoteData;
  home_featured_heading: HomeFeaturedHeadingData;
  home_featured_hotels_heading: HomeFeaturedHotelsHeadingData;
  home_group_packages: HomeGroupPackagesData;
  tours_hero: ToursHeroData;
  transport_hero: TransportHeroData;
  hotels_page: HotelsPageData;
}

export interface SiteContentRow {
  id: string;
  data: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface TransportAirportRow {
  id: string;
  code: string;
  label: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export type VehicleId = string;

export interface TransportVehicleRow {
  id: string;
  vehicle_id: VehicleId;
  label: string;
  capacity: string;
  note: string;
  from_price: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

// ---------------------------------------------------------------------------
// Database shape for use with the Supabase client generic
// ---------------------------------------------------------------------------

export interface Database {
  public: {
    PostgrestVersion: "12";
    Tables: {
      site_content: {
        Row: SiteContentRow;
        Insert: Omit<SiteContentRow, 'created_at' | 'updated_at'> & Partial<Pick<SiteContentRow, 'created_at' | 'updated_at'>>;
        Update: Partial<Omit<SiteContentRow, 'id'>>;
        Relationships: [];
      };
      transport_airports: {
        Row: TransportAirportRow;
        Insert: Omit<TransportAirportRow, 'id' | 'created_at' | 'updated_at'> & Partial<Pick<TransportAirportRow, 'id' | 'created_at' | 'updated_at'>>;
        Update: Partial<Omit<TransportAirportRow, 'id'>>;
        Relationships: [];
      };
      transport_vehicles: {
        Row: TransportVehicleRow;
        Insert: Omit<TransportVehicleRow, 'id' | 'created_at' | 'updated_at'> & Partial<Pick<TransportVehicleRow, 'id' | 'created_at' | 'updated_at'>>;
        Update: Partial<Omit<TransportVehicleRow, 'id'>>;
        Relationships: [];
      };
    };
  };
}
