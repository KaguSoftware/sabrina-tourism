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
}

export interface HomeAboutData {
  heading: string;
  body: string;
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
}

export interface HomeQuoteData {
  quote: string;
  attribution: string;
}

export interface HomeFeaturedHeadingData {
  section_heading: string;
  featured_slugs: string[];
}

export interface ToursHeroData {
  page_heading: string;
  page_lede: string;
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

export type SiteContentKey =
  | 'home_hero'
  | 'home_about'
  | 'home_how_it_works'
  | 'home_quote'
  | 'home_featured_heading'
  | 'tours_hero'
  | 'transport_hero';

export interface SiteContentDataMap {
  home_hero: HomeHeroData;
  home_about: HomeAboutData;
  home_how_it_works: HomeHowItWorksData;
  home_quote: HomeQuoteData;
  home_featured_heading: HomeFeaturedHeadingData;
  tours_hero: ToursHeroData;
  transport_hero: TransportHeroData;
}

export interface SiteContentRow {
  id: string;
  data: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export type PackageRegion =
  | 'Istanbul'
  | 'Cappadocia'
  | 'Aegean'
  | 'Mediterranean'
  | 'Black Sea'
  | 'Eastern Anatolia';

export interface PackageRow {
  id: string;
  slug: string;
  name: string;
  region: PackageRegion;
  duration: string;
  duration_days: number;
  short_description: string;
  overview: string;
  hero_image: string;
  card_image: string | null;
  min_people: number;
  max_people: number;
  available_from: string;
  available_to: string;
  is_published: boolean;
  is_featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface PackageItineraryDayRow {
  id: string;
  package_id: string;
  day_number: number;
  title: string;
  description: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export type PackageTierName = 'Essential' | 'Signature' | 'Private';

export interface PackageTierRow {
  id: string;
  package_id: string;
  tier_name: PackageTierName;
  vehicle_class: string;
  accommodation: string;
  group_size: string;
  guide_languages: string[];
  meals_included: string;
  highlights: string[];
  created_at: string;
  updated_at: string;
}

export interface PackageGalleryRow {
  id: string;
  package_id: string;
  image_path: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export type InclusionKind = 'included' | 'not_included';

export interface PackageInclusionRow {
  id: string;
  package_id: string;
  kind: InclusionKind;
  text: string;
  sort_order: number;
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

export type VehicleId = 'sedan' | 'suv' | 'van' | 'luxury';

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

export interface PackageSlugHistoryRow {
  id: string;
  package_id: string;
  old_slug: string;
  created_at: string;
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
      packages: {
        Row: PackageRow;
        Insert: Omit<PackageRow, 'id' | 'created_at' | 'updated_at'> & Partial<Pick<PackageRow, 'id' | 'created_at' | 'updated_at'>>;
        Update: Partial<Omit<PackageRow, 'id'>>;
        Relationships: [];
      };
      package_itinerary_days: {
        Row: PackageItineraryDayRow;
        Insert: Omit<PackageItineraryDayRow, 'id' | 'created_at' | 'updated_at'> & Partial<Pick<PackageItineraryDayRow, 'id' | 'created_at' | 'updated_at'>>;
        Update: Partial<Omit<PackageItineraryDayRow, 'id'>>;
        Relationships: [];
      };
      package_tiers: {
        Row: PackageTierRow;
        Insert: Omit<PackageTierRow, 'id' | 'created_at' | 'updated_at'> & Partial<Pick<PackageTierRow, 'id' | 'created_at' | 'updated_at'>>;
        Update: Partial<Omit<PackageTierRow, 'id'>>;
        Relationships: [];
      };
      package_gallery: {
        Row: PackageGalleryRow;
        Insert: Omit<PackageGalleryRow, 'id' | 'created_at' | 'updated_at'> & Partial<Pick<PackageGalleryRow, 'id' | 'created_at' | 'updated_at'>>;
        Update: Partial<Omit<PackageGalleryRow, 'id'>>;
        Relationships: [];
      };
      package_inclusions: {
        Row: PackageInclusionRow;
        Insert: Omit<PackageInclusionRow, 'id' | 'created_at' | 'updated_at'> & Partial<Pick<PackageInclusionRow, 'id' | 'created_at' | 'updated_at'>>;
        Update: Partial<Omit<PackageInclusionRow, 'id'>>;
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
      package_slug_history: {
        Row: PackageSlugHistoryRow;
        Insert: Omit<PackageSlugHistoryRow, 'id' | 'created_at'> & Partial<Pick<PackageSlugHistoryRow, 'id' | 'created_at'>>;
        Update: Partial<Omit<PackageSlugHistoryRow, 'id'>>;
        Relationships: [];
      };
    };
  };
}
