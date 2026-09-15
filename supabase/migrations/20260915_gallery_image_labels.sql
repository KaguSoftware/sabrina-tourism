-- Admin-written caption for each tour gallery image.
-- The public carousel shows this in the tag on the image (e.g. "Bedroom",
-- "Old Town") instead of a fixed label picked by the image's position.
-- An empty label hides the tag.

alter table premade_package_gallery
  add column if not exists label text not null default '';

alter table daily_package_gallery
  add column if not exists label text not null default '';

notify pgrst, 'reload schema';
