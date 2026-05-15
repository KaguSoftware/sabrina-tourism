"use client";

import { useState } from "react";
import { toast } from "sonner";
import { DatabaseZap } from "lucide-react";

interface Props {
  seedAction: () => Promise<{ error?: string }>;
}

export function SeedButton({ seedAction }: Props) {
  const [loading, setLoading] = useState(false);

  async function handleSeed() {
    setLoading(true);
    try {
      const { error } = await seedAction();
      if (error) toast.error(error);
      else toast.success("DB seeded from JSON files successfully");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleSeed}
      disabled={loading}
      className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.16em] uppercase px-4 py-2 border border-ochre text-ochre hover:bg-ochre/10 transition-colors duration-150 disabled:opacity-50 whitespace-nowrap flex-shrink-0"
    >
      <DatabaseZap size={13} />
      {loading ? "Seeding…" : "Seed DB from JSON files"}
    </button>
  );
}
