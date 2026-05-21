import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const PUB_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

const supabase = createClient(SUPABASE_URL, SERVICE_KEY || PUB_KEY, { auth: { persistSession: false } });

async function main() {
  // Insert packages directly using the Supabase client
  const packages = [
    { slug: "princes-islands", name: "Princes Islands Day Trip", tour_date: "2026-06-15", start_time: "09:00", end_time: "20:00", hero_image: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1200&q=80", card_image: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1200&q=80", vehicle: "Private Transfer", driver: "Ahmet", price: 150, currency: "USD", short_description: "Escape the city on a ferry to the car-free Princes Islands — pine-shaded paths, horse-drawn carriages, and fresh seafood by the sea.", region: "Istanbul", is_published: true, sort_order: 10 },
    { slug: "sapanca-masukiye", name: "Sapanca & Maşukiye Nature Day", tour_date: "2026-06-20", start_time: "08:30", end_time: "20:00", hero_image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1200&q=80", card_image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1200&q=80", vehicle: "Mercedes-Benz Vito", driver: "Kerem", price: 140, currency: "USD", short_description: "Lakeside serenity and mountain waterfalls — a refreshing escape to Sapanca Lake and the lush Maşukiye valley.", region: "Istanbul", is_published: true, sort_order: 11 },
    { slug: "istanbul-asian-side", name: "Asian Side of Istanbul", tour_date: "2026-06-22", start_time: "09:00", end_time: "20:00", hero_image: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1200&q=80", card_image: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1200&q=80", vehicle: "Private Transfer", driver: "Emre", price: 130, currency: "USD", short_description: "Cross the Bosphorus and discover Istanbul's calmer, leafy Asian shore — Kadıköy markets, Moda cafés, and the Maiden's Tower at sunset.", region: "Istanbul", is_published: true, sort_order: 12 },
    { slug: "istanbul-european-side", name: "European Side of Istanbul", tour_date: "2026-06-24", start_time: "09:00", end_time: "21:00", hero_image: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1200&q=80", card_image: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1200&q=80", vehicle: "Mercedes-Benz V-Class", driver: "Hasan", price: 160, currency: "USD", short_description: "The full sweep of Istanbul's European heart — Hagia Sophia, Grand Bazaar, Galata Tower, and a Bosphorus evening cruise.", region: "Istanbul", is_published: true, sort_order: 13 },
    { slug: "istanbul-aquarium-florya", name: "İstanbul Aquarium & Aqua Florya", tour_date: "2026-07-01", start_time: "10:00", end_time: "20:00", hero_image: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1200&q=80", card_image: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1200&q=80", vehicle: "Private Transfer", driver: "Selim", price: 120, currency: "USD", short_description: "Dive into Europe's largest aquarium with underwater tunnels and thousands of sea creatures, then explore the stylish Aqua Florya Mall on the seafront.", region: "Istanbul", is_published: true, sort_order: 14 },
    { slug: "vialand-theme-park", name: "Vialand Theme Park & Shopping Mall", tour_date: "2026-07-05", start_time: "09:30", end_time: "21:00", hero_image: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1200&q=80", card_image: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1200&q=80", vehicle: "Private Transfer", driver: "Yusuf", price: 130, currency: "USD", short_description: "A full day of thrills at Vialand — Istanbul's premier theme park — followed by an evening at the adjacent shopping and entertainment complex.", region: "Istanbul", is_published: true, sort_order: 15 },
    { slug: "sile-agva", name: "Şile & Ağva Black Sea Day", tour_date: "2026-07-08", start_time: "08:00", end_time: "21:00", hero_image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1200&q=80", card_image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1200&q=80", vehicle: "Mercedes-Benz Vito", driver: "Baran", price: 145, currency: "USD", short_description: "A scenic drive along the Black Sea coast to Şile's lighthouse beach and the tranquil river village of Ağva.", region: "Istanbul", is_published: true, sort_order: 16 },
    { slug: "antalya-city-cruise", name: "Antalya City Tour & Cruise", tour_date: "2026-07-12", start_time: "09:00", end_time: "21:00", hero_image: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1200&q=80", card_image: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1200&q=80", vehicle: "Mercedes-Benz Sprinter", driver: "Ali", price: 180, currency: "USD", short_description: "The best of Antalya in one day — ancient Kaleiçi, Hadrian's Gate, and a Mediterranean cruise along the turquoise coastline.", region: "Mediterranean", is_published: true, sort_order: 20 },
    { slug: "antalya-rafting", name: "Antalya Rafting Day Trip", tour_date: "2026-07-15", start_time: "08:00", end_time: "19:00", hero_image: "https://images.unsplash.com/photo-1530866926602-bde218ef1f4e?w=1200&q=80", card_image: "https://images.unsplash.com/photo-1530866926602-bde218ef1f4e?w=1200&q=80", vehicle: "Mercedes-Benz Sprinter", driver: "Murat", price: 160, currency: "USD", short_description: "White-water rafting on the Köprüçay River through the Taurus Mountains — the most thrilling rapids in Turkey.", region: "Mediterranean", is_published: true, sort_order: 21 },
    { slug: "land-of-legends", name: "Evening Tour — The Land of Legends", tour_date: "2026-07-18", start_time: "16:00", end_time: "23:30", hero_image: "https://images.unsplash.com/photo-1563252722-6434563a985d?w=1200&q=80", card_image: "https://images.unsplash.com/photo-1563252722-6434563a985d?w=1200&q=80", vehicle: "Private Transfer", driver: "Serkan", price: 140, currency: "USD", short_description: "An enchanting evening at the Land of Legends theme park — live shows, dazzling light displays, and world-class entertainment under the Mediterranean sky.", region: "Mediterranean", is_published: true, sort_order: 22 },
  ];

  for (const pkg of packages) {
    const { data, error } = await supabase
      .from("daily_packages")
      .upsert(pkg, { onConflict: "slug", ignoreDuplicates: true })
      .select("id,slug")
      .single();
    
    if (error) {
      console.error(`✗ ${pkg.slug}:`, error.message);
    } else {
      console.log(`✓ ${pkg.slug} → ${data.id}`);
    }
  }
}

main().catch(console.error);

// Debug
console.log("URL:", process.env.NEXT_PUBLIC_SUPABASE_URL?.slice(0, 40));
console.log("KEY:", process.env.SUPABASE_SERVICE_ROLE_KEY?.slice(0, 30));
