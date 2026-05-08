ALTER TABLE hotels
  ADD COLUMN IF NOT EXISTS stars int NOT NULL DEFAULT 0 CHECK (stars >= 0 AND stars <= 5);
