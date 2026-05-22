-- Per-tier pricing for premade (group) packages.
-- Moves pricing from the package row into individual tier rows so each
-- tier (Essential / Signature / Private, etc.) can have its own prices.
-- Legacy columns on `premade_packages` are kept for now so PDF/voucher
-- consumers continue to work via derived values in the read layer.

alter table premade_package_tiers
  add column if not exists price_2_people numeric,
  add column if not exists price_single_room_supplement numeric,
  add column if not exists price_per_child numeric;

update premade_package_tiers t
set price_2_people = p.price_2_people,
    price_single_room_supplement = p.price_single_room_supplement,
    price_per_child = p.price_per_child
from premade_packages p
where t.package_id = p.id;

notify pgrst, 'reload schema';
