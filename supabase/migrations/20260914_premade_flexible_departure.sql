-- Flexible departures for premade (group) packages.
-- When `flexible_departure` is true the guest picks their own start date on
-- the public page and follows the itinerary day by day from there; the fixed
-- rows in `premade_package_dates` are not used for that package.

alter table premade_packages
  add column if not exists flexible_departure boolean not null default false;

notify pgrst, 'reload schema';
