# Fix: "violates not-null constraint" when saving admin content

**Date:** 2026-09-11
**Status:** Fixed, type-checked. Not yet verified against a live database.

---

## The symptom

Creating a new daily tour in the admin panel failed with:

> Couldn't save daily tour — Stops could not be saved: null value in column
> `"place_translations"` of relation `"daily_package_stops"` violates not-null constraint

The tour's core row saved fine; the save only blew up when it got to writing the
child rows (the stops).

---

## Root cause

Every text field in the content tables has a companion `*_translations` JSONB
column holding the TR/AR/ES/IT copy. They are all declared the same way in
`supabase/migrations/20260507_content_translations.sql`:

```sql
ALTER TABLE daily_package_stops
  ADD COLUMN IF NOT EXISTS place_translations       jsonb NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS description_translations jsonb NOT NULL DEFAULT '{}';
```

`NOT NULL` **with** a default — so an omitted column is fine, but an explicit
`null` is rejected.

The save action carries existing translations across by position, so that
re-saving a tour doesn't wipe the translated copy. The fallback was wrong:

```ts
// src/app/admin/(authed)/daily/[id]/actions.ts
const stopRows = data.stops.map((s, i) => ({
  package_id: pkgId, stop_time: "", place: s.place, description: s.description, sort_order: i,
  place_translations: existingStops?.[i]?.place_translations ?? null,        // <-- bug
  description_translations: existingStops?.[i]?.description_translations ?? null,
}));
```

`existingStops` is the list of stops *already in the database*. Two cases send a
literal `null` to Postgres:

1. **A brand-new tour** — there are no existing stops at all, so `existingStops`
   is empty and every single stop resolves to `null`. This is the case that was
   hit.
2. **An existing tour gaining stops** — going from 3 stops to 5 means indexes
   `3` and `4` have no counterpart, so those two rows resolve to `null`.

A DEFAULT only applies when the column is *omitted* from the INSERT. Supabase
serialises the key with an explicit `null`, so the default never fires and the
`NOT NULL` constraint rejects the row.

### Why the whole save failed rather than half-saving

`src/lib/admin/replace-children.ts` inserts the new child rows **before**
deleting the old ones, specifically so a failed write can't strip a tour of its
stops while the editor reports "Saved". That worked as designed here — the
insert failed, the delete never ran, and the error surfaced in the UI. No data
was lost.

---

## The fix

Fall back to `{}` — the same value as the column default — instead of `null`:

```ts
place_translations: existingStops?.[i]?.place_translations ?? {},
description_translations: existingStops?.[i]?.description_translations ?? {},
```

The identical mistake was present in the two sibling editors and would have
failed the same way, so all three were fixed together:

| File | Child rows fixed |
| --- | --- |
| `src/app/admin/(authed)/daily/[id]/actions.ts` | stops, inclusions, exclusions |
| `src/app/admin/(authed)/fixed-dates/[id]/actions.ts` | itinerary days, tiers, inclusions, exclusions |
| `src/app/admin/(authed)/hotels/[id]/actions.ts` | amenities, room types |

19 lines changed in total. Applied with:

```sh
sed -i -E 's/(_translations: existing[A-Za-z]*\?\.\[i\]\?\.[a-z_]*_translations \?\? )null,/\1{},/' <file>
```

### Note on `daily_package_not_included`

That table's `text_translations` was created as plain nullable `jsonb` in
`20260514_season_hotel_icons_pricing.sql`, so it wasn't crashing. It was changed
to `{}` anyway for consistency — downstream code then never has to distinguish
"no translations" from `null`.

---

## Verification

- `npx tsc --noEmit` — passes clean.
- Not run against the app or the database. Re-creating a daily tour with stops
  is the real confirmation.

---

## Takeaway

When a column is `NOT NULL DEFAULT '<x>'`, **never** send an explicit `null` for
it. Either omit the key entirely or send the default value. In a
carry-across-by-position pattern like this one, any index past the end of the
existing array is the case that catches you out — and it's the one that fires on
every brand-new record, which is exactly the path that gets tested last.
