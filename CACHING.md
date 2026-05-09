# Caching architecture

Reference for how Supabase reads, page renders, and PDF generation are cached. Read this before changing data-fetching code or admin Server Actions.

## Goal

Maximize Supabase bandwidth efficiency: public traffic should serve from cache between admin edits. After an admin edit, only the affected slice is re-fetched.

## Why not Cache Components (`'use cache'`)

Tried first. Setting `cacheComponents: true` in [next.config.ts](next.config.ts) requires every dynamic API call (next-intl's `getTranslations()` / `getLocale()`, `params`, `cookies()`) to live inside a `<Suspense>` boundary or the page becomes fully dynamic. The build fails with `Uncached data was accessed outside of <Suspense>` on every public page because next-intl is used everywhere.

Wrapping the entire app in Suspense for the full Cache Components rollout is a bigger refactor that delivers no extra Supabase-bandwidth gain, since the savings come from the data layer, not the page shell. We use `unstable_cache` instead and leave `cacheComponents` off.

If we ever want to flip the flag, we'd need to: (a) remove `export const runtime = "nodejs"` from PDF route handlers, (b) remove `dynamicParams = true` and `dynamic = "force-dynamic"` declarations, (c) wrap each call to next-intl request APIs in Suspense, (d) re-convert `unstable_cache` → `'use cache'` directives.

## Layers

```
Browser ─► Next.js route ─► lib/db/* (cached) ─► Supabase
                                ▲
                                └─ unstable_cache, 30-day TTL, tag-keyed
```

### 1. Tag registry — single source of truth

[src/lib/cache/tags.ts](src/lib/cache/tags.ts) — every cache tag in the app is built through this object. Read sites and invalidation sites both import it. **Never inline tag strings**; collisions or typos break invalidation silently.

### 2. Data layer — `src/lib/db/*`

Every public-facing read function is wrapped in `unstable_cache` with:
- 30-day `revalidate` (`60 * 60 * 24 * 30` seconds)
- Tag array including a granular tag and its umbrella tag (e.g. `[tags.packages.bySlug(slug), tags.packages.all()]`)

Pattern (see [src/lib/db/packages.ts](src/lib/db/packages.ts) for canonical example):

```ts
async function _getPackageBySlug(slug: string) { /* uncached impl */ }

export async function getPackageBySlug(slug: string) {
  return unstable_cache(
    () => _getPackageBySlug(slug),
    ['packages:bySlug', slug],
    { tags: [tags.packages.bySlug(slug), tags.packages.all()], revalidate: REVALIDATE_SECONDS },
  )();
}
```

**Critical**: every runtime input that affects the result must appear in `keyParts`. Closures are NOT auto-captured. If you add an argument, add it to the key.

Files:
- [packages.ts](src/lib/db/packages.ts) — `getAllPackages`, `getPackageBySlug`, `getFeaturedPackages`, `getAllSlugs`. The admin-only `getPackageRawBySlug` is intentionally uncached.
- [premade-packages.ts](src/lib/db/premade-packages.ts) — `getAllPremadePackages` (locale-keyed), `getPremadePackageBySlug` (locale-keyed), `getAllPremadeSlugs`. Admin `getPremadePackageRawById` / `getAdminPremadePackages` uncached.
- [daily-packages.ts](src/lib/db/daily-packages.ts) — `getAllDailyPackages`, `getDailyPackageBySlug`. Admin variants uncached.
- [hotels.ts](src/lib/db/hotels.ts) — `getAllHotels`, `getHotelsByRegion`, `getHotelBySlug`, `getFeaturedHotels`. Admin variants uncached.
- [transport.ts](src/lib/db/transport.ts) — `getAirports`, `getVehicles`.
- [site-content.ts](src/lib/db/site-content.ts) — `getSiteContent` (per-key tag).

### 3. Admin Server Actions — invalidation

Every action under `src/app/admin/(authed)/.../actions.ts` calls `revalidateTag(tag, "max")` for every tag whose underlying data it just changed. The `"max"` profile is required by the Next 16 type signature; without `cacheComponents`, the runtime falls back to legacy behavior but TypeScript still requires it.

**Hotel region-change rule**: editing a hotel that moves regions invalidates BOTH the old and new region tags. See [hotels/[id]/actions.ts](src/app/admin/(authed)/hotels/[id]/actions.ts) — it reads `previousRegion` before the UPDATE.

**Hotel bulk operations** (`reorderHotels`, `setHotelPublished`, `deleteHotel`, `duplicateHotel` in [hotels/actions.ts](src/app/admin/(authed)/hotels/actions.ts)) invalidate the affected region tag(s). `reorderHotels` invalidates every region in `REGIONS` because reordering can affect any of them.

### 4. PDF generation

[src/lib/pdf/render.ts](src/lib/pdf/render.ts) wraps each PDF render in `unstable_cache` with the same package tag the data layer uses. Editing a package invalidates its data cache AND its PDF cache in one `revalidateTag` call.

The route handlers under `src/app/api/pdf/*/[*]/route.ts` are thin wrappers that:
1. Call the cached render function.
2. Send `Cache-Control: public, max-age=300, s-maxage=86400, stale-while-revalidate=604800` so browsers and CDN edges cache the PDF too.

`runtime = "nodejs"` is required because `@react-pdf/renderer` and `node:stream/consumers` need the Node runtime.

## Adding new cached reads

1. Add a tag to [src/lib/cache/tags.ts](src/lib/cache/tags.ts).
2. Write the uncached function as `_myFunc` (private convention).
3. Export `myFunc` that wraps `_myFunc` in `unstable_cache` — include all runtime args in `keyParts`, tag with the granular + umbrella tags, use `REVALIDATE_SECONDS`.
4. In every admin Server Action that mutates the underlying table, call `revalidateTag(tags.X.Y(args), "max")` for every tag the read could be cached under.

## Adding new admin mutations

For every read tag the mutation can affect, call `revalidateTag(tag, "max")`. Forgetting an invalidation = stale public pages for up to 30 days.

If the mutation can change a foreign key that's part of a tag (e.g., a hotel's `region`), read the old value first, then invalidate both old and new tags.

## Verification

- `npm run typecheck` — must pass.
- `npm run build` — must pass; reports cache info per route.
- `NEXT_PRIVATE_DEBUG_CACHE=1 npm run dev` then hit a route twice — second hit logs `FileSystemCache: get <hash> [ '<tag>' ] FETCH true` confirming the cache was served.
- Edit any record in the admin UI; reload the corresponding public page; the change should appear immediately.

## What's NOT cached and why

- **Admin pages** (`src/app/admin/(authed)/**`) — they need fresh data while editing. They use `getXRawBySlug` / `getAdminX` functions that bypass the cache.
- **Auth and middleware** ([src/proxy.ts](src/proxy.ts)) — uses `createServerClient` with cookies; cannot be cached.
- **Translations admin actions** ([src/app/admin/(authed)/translations/actions.ts](src/app/admin/(authed)/translations/actions.ts)) — uses `revalidatePath` because translations live in JSON files, not in tagged caches. Don't change unless you migrate translations to a tagged source.

## Future optimization opportunities

- **Move to Cache Components**: would let us cache the route shell too, not just the data. Requires Suspense boundaries around every next-intl translation call. See "Why not Cache Components" above.
- **Use `cache: "force-cache"` on remaining fetches**: there are none in public-render paths today (verified), but new code should opt-in explicitly.
- **`use cache: remote`**: if we deploy to Vercel and want the in-memory cache to span instances, switch to a remote cache handler (Redis/KV). Today the filesystem cache is sufficient for a single self-hosted node.
- **Add `getAdminHotels` / `getAdminPackages` etc. to a short-TTL cache**: would reduce admin-list load times without staleness risk if invalidated on every mutation. Skipped for now — admin traffic is low.
- **Image `sizes` props**: orthogonal to data caching but a big bandwidth lever — many `<Image>` components ship oversized responsive variants. Audit `next/image` usage if we want to cut total bytes shipped.

## Files touched in the original caching pass

- [next.config.ts](next.config.ts) — verified no `cacheComponents` flag (we deliberately don't use it)
- [src/lib/cache/tags.ts](src/lib/cache/tags.ts) — new
- All of `src/lib/db/*.ts` — wrapped reads
- [src/lib/pdf/render.ts](src/lib/pdf/render.ts) — new
- All `src/app/api/pdf/*/[*]/route.ts` — thin wrappers + `Cache-Control` headers
- All `src/app/admin/(authed)/**/actions.ts` — `revalidatePath` → `revalidateTag`
- Removed `export const revalidate = 60` from public pages (10 files)
