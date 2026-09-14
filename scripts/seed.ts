/**
 * Seed script — run with: npm run seed
 * Idempotently populates all static data into Supabase.
 */

import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

// ---------------------------------------------------------------------------
// 0. Env
// ---------------------------------------------------------------------------

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error(
    "✗ Missing env vars. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local"
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { persistSession: false },
});

const PUBLIC_DIR = path.resolve(process.cwd(), "public");
const BUCKET = "media";

// ---------------------------------------------------------------------------
// 1. Static data (inlined to avoid Next.js import resolution issues)
// ---------------------------------------------------------------------------

// --- Transport ---

const AIRPORTS = [
  { code: "IST", label: "Istanbul Airport (IST)" },
  { code: "SAW", label: "Istanbul Sabiha Gökçen (SAW)" },
  { code: "AYT", label: "Antalya (AYT)" },
  { code: "ASR", label: "Cappadocia / Kayseri (ASR)" },
  { code: "ADB", label: "Izmir (ADB)" },
  { code: "BJV", label: "Bodrum (BJV)" },
  { code: "DLM", label: "Dalaman (DLM)" },
];

const VEHICLES = [
  {
    id: "car",
    label: "Van",
    capacity: "1–4 guests",
    note: "Mercedes E-Class or equivalent",
    from: "from €70",
  },
  {
    id: "luxury",
    label: "Minibus",
    capacity: "1–7 guests",
    note: "Mercedes Vito executive with chauffeur",
    from: "from €260",
  },
  {
    id: "minibus",
    label: "Bus",
    capacity: "1–16 guests",
    note: "Mercedes Sprinter or equivalent",
    from: "from €180",
  },
];

// --- Site content ---

const SITE_CONTENT = [
  {
    id: "home_hero",
    data: {
      headline_top: "Turkey,",
      headline_em: "considered.",
      sub: "Slow itineraries through a country that rewards patience — built one guest, one driver, one road at a time.",
      kicker: "Boutique tours · Private chauffeur · Türkiye",
      image: "/home.png",
    },
  },
  {
    id: "home_about",
    data: {
      heading:
        "We do not run a booking site. We run a small atelier of guides, drivers and friends across seven regions.",
      body: "sabrina-turizm is a boutique agency working with a hand-picked roster of fewer than thirty private guides and chauffeurs. We do not aggregate, we do not sell rooms in bulk, and we do not take more than two parties to the same town in the same week. Every itinerary is drawn by a person who has driven the road, eaten in the kitchen, and stayed the night.",
    },
  },
  {
    id: "home_how_it_works",
    data: {
      heading: "Three steps. One conversation.",
      steps: [
        {
          num: "01",
          heading: "Browse",
          body: "Read the itineraries the way you would a magazine. Filter by region, dates, group size — or simply by curiosity.",
          icon: "compass",
        },
        {
          num: "02",
          heading: "Select",
          body: "Pick a package and a tier — Essential, Signature, or Private. Or describe the journey you have in mind, and we will draw it.",
          icon: "suitcase",
        },
        {
          num: "03",
          heading: "Confirm via WhatsApp",
          body: "A real person on our team replies within the hour, in your language. We confirm dates, send a quote, and hold the booking.",
          icon: "whatsapp",
        },
      ],
    },
  },
  {
    id: "home_quote",
    data: {
      quote:
        "The kind of trip you remember in fragments — a particular afternoon light on the Bosphorus, the quiet of a cave at five in the morning, a fisherman's lunch you didn't expect.",
      attribution: "— Condé Nast Traveller, on a sabrina itinerary",
    },
  },
  {
    id: "home_featured_heading",
    data: {
      heading: "Three to begin with.",
    },
  },
  {
    id: "tours_hero",
    data: {
      heading: "Six routes through Türkiye.",
      lede: "Filter by group size, dates and region. Every itinerary runs in three tiers — Essential, Signature, Private — and every reservation is confirmed by a person, on WhatsApp.",
      image: "/tours.png",
    },
  },
  {
    id: "transport_hero",
    data: {
      heading_top: "A car, a driver,",
      heading_em: "and the road of your choosing.",
      sub: "Mercedes E-Class, V-Class and S-Class. English-speaking, licensed, in dark suits. From an airport pickup to a multi-day cross-country drive — quoted by the hour or by the route.",
      fleet_heading: "Four vehicle classes.",
      image: "/driver.webp",
    },
  },
];

// ---------------------------------------------------------------------------
// 2. Image upload helpers
// ---------------------------------------------------------------------------

/** List all objects in a Storage folder to build an existence set. */
async function listStorageFolder(prefix: string): Promise<Set<string>> {
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .list(prefix, { limit: 1000 });
  if (error) return new Set();
  return new Set((data ?? []).map((f) => `${prefix}/${f.name}`));
}

/** Upload a single file; skip if already present in existingPaths. */
async function uploadImage(
  localFilename: string, // e.g. "/istanbul-hero1.png"
  storagePath: string, // e.g. "packages/istanbul-classics/istanbul-hero1.png"
  existingPaths: Set<string>
): Promise<{ skipped: boolean }> {
  if (existingPaths.has(storagePath)) return { skipped: true };

  const absPath = path.join(PUBLIC_DIR, localFilename.replace(/^\//, ""));
  if (!fs.existsSync(absPath)) {
    console.warn(`  ⚠ File not found locally, skipping: ${localFilename}`);
    return { skipped: true };
  }

  const fileBuffer = fs.readFileSync(absPath);
  const ext = path.extname(localFilename).toLowerCase();
  const contentType =
    ext === ".png"
      ? "image/png"
      : ext === ".jpg" || ext === ".jpeg"
      ? "image/jpeg"
      : ext === ".svg"
      ? "image/svg+xml"
      : ext === ".webp"
      ? "image/webp"
      : "application/octet-stream";

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, fileBuffer, { contentType, upsert: false });

  if (error && !error.message.includes("already exists")) {
    throw new Error(`Upload failed for ${storagePath}: ${error.message}`);
  }

  existingPaths.add(storagePath);
  return { skipped: false };
}

// ---------------------------------------------------------------------------
// 3. Main seed
// ---------------------------------------------------------------------------

async function main() {
  console.log("▶ Sabrina Tourism — seed starting\n");

  let totalUploaded = 0;
  let totalSkipped = 0;

  // -------------------------------------------------------------------------
  // 3a. Site content
  // -------------------------------------------------------------------------

  // Pre-fetch existing Storage paths for page-level images
  const pageStorageExisting = await listStorageFolder("pages");

  // Collect page images that need uploading
  const pageImages: { local: string; storagePath: string }[] = [
    { local: "/home.png", storagePath: "pages/home/home.png" },
    { local: "/tours.png", storagePath: "pages/tours/tours.png" },
    { local: "/driver.webp", storagePath: "pages/transport/driver.webp" },
  ];

  for (const img of pageImages) {
    const { skipped } = await uploadImage(
      img.local,
      img.storagePath,
      pageStorageExisting
    );
    skipped ? totalSkipped++ : totalUploaded++;
  }

  // Rewrite image paths in site_content data to Storage paths
  const siteContentRows = SITE_CONTENT.map((row) => {
    const data = { ...row.data } as Record<string, unknown>;
    if (row.id === "home_hero") data.image = "pages/home/home.png";
    if (row.id === "tours_hero") data.image = "pages/tours/tours.png";
    if (row.id === "transport_hero")
      data.image = "pages/transport/driver.webp";
    return { id: row.id, data };
  });

  const { error: scError } = await supabase
    .from("site_content")
    .upsert(siteContentRows, { onConflict: "id" });
  if (scError)
    throw new Error(`site_content upsert failed: ${scError.message}`);
  console.log(`✓ Seeded site_content (${siteContentRows.length})`);

  // -------------------------------------------------------------------------
  // 3b. Transport: airports & vehicles
  // -------------------------------------------------------------------------

  const { error: airportError } = await supabase
    .from("transport_airports")
    .upsert(
      AIRPORTS.map((a, i) => ({
        code: a.code,
        label: a.label,
        sort_order: i,
      })),
      { onConflict: "code" }
    );
  if (airportError)
    throw new Error(
      `transport_airports upsert failed: ${airportError.message}`
    );
  console.log(`✓ Seeded transport_airports (${AIRPORTS.length})`);

  const { data: existingVehicleRows, error: existingVehicleError } =
    await supabase.from("transport_vehicles").select("vehicle_id,label");
  if (existingVehicleError)
    throw new Error(
      `transport_vehicles read failed: ${existingVehicleError.message}`
    );

  const existingVehicleLabels = new Map(
    (existingVehicleRows ?? []).map((v) => [v.vehicle_id, v.label])
  );

  const { error: vehicleError } = await supabase
    .from("transport_vehicles")
    .upsert(
      VEHICLES.map((v, i) => ({
        vehicle_id: v.id,
        label: existingVehicleLabels.get(v.id) ?? v.label,
        capacity: v.capacity,
        note: v.note,
        from_price: v.from,
        sort_order: i,
      })),
      { onConflict: "vehicle_id" }
    );
  if (vehicleError)
    throw new Error(
      `transport_vehicles upsert failed: ${vehicleError.message}`
    );
  console.log(`✓ Seeded transport_vehicles (${VEHICLES.length})`);

  // -------------------------------------------------------------------------
  // Summary
  // -------------------------------------------------------------------------

  console.log("\n═══════════════════════════════════════");
  console.log("  Seed complete");
  console.log("  Site content rows:   " + siteContentRows.length);
  console.log("  Airports:            " + AIRPORTS.length);
  console.log("  Vehicles:            " + VEHICLES.length);
  console.log("  Images uploaded:     " + totalUploaded);
  console.log("  Images skipped:      " + totalSkipped);
  console.log("═══════════════════════════════════════\n");
}

main().catch((err) => {
  console.error("✗ Seed failed:", err.message ?? err);
  process.exit(1);
});
