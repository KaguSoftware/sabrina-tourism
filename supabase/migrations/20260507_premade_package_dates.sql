-- Multiple fixed departure dates per premade package
CREATE TABLE IF NOT EXISTS premade_package_dates (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id  uuid        NOT NULL REFERENCES premade_packages (id) ON DELETE CASCADE,
  start_date  date        NOT NULL,
  end_date    date        NOT NULL,
  sort_order  int         NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE premade_package_dates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_premade_dates"  ON premade_package_dates;
DROP POLICY IF EXISTS "auth_write_premade_dates"   ON premade_package_dates;

CREATE POLICY "public_read_premade_dates"
  ON premade_package_dates FOR SELECT TO anon USING (true);

CREATE POLICY "auth_write_premade_dates"
  ON premade_package_dates FOR ALL TO authenticated USING (true) WITH CHECK (true);
