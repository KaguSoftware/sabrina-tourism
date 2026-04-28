import type { Region } from "@/lib/packages/types";

export interface SignatureDestination {
  name: string;
  region: Region;
  kicker: string;
  image: string;
}
