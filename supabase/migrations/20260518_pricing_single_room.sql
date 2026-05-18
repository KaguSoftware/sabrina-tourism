alter table premade_packages
  drop column if exists price_3_people,
  add column if not exists price_single_room_supplement numeric,
  add column if not exists price_per_child numeric;

alter table daily_packages
  drop column if exists price_3_people,
  add column if not exists price_single_room_supplement numeric,
  add column if not exists price_per_child numeric;

notify pgrst, 'reload schema';
