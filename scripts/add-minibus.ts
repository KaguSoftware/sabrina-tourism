import * as path from "path";
import * as dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

async function main() {
  const { error } = await supabase.from("transport_vehicles").upsert(
    {
      vehicle_id: "minibus",
      label: "Bus",
      capacity: "1–16 guests",
      note: "Mercedes Sprinter",
      from_price: "from €280",
      sort_order: 5,
    },
    { onConflict: "vehicle_id" }
  );

  if (error) {
    console.error("Error:", error.message);
    process.exit(1);
  } else {
    console.log("✓ Minibus vehicle added to transport_vehicles");
  }
}

main();
