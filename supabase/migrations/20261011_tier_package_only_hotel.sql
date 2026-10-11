-- Package-only hotels for fixed-date (group) tour tiers.
-- A tier can either link to a hotel from the public hotel list (hotel_id) or
-- carry its own hotel details here. A hotel stored on the tier lives only on
-- that tour: it never appears on the hotels page, region pages, the custom
-- tour wizard or the sitemap, and it goes away with the tier.
-- An empty custom_hotel_name means the tier has no package-only hotel.

alter table premade_package_tiers
  add column if not exists custom_hotel_name   text not null default '',
  add column if not exists custom_hotel_region text not null default '',
  add column if not exists custom_hotel_stars  int,
  add column if not exists custom_hotel_image  text not null default '';

notify pgrst, 'reload schema';
