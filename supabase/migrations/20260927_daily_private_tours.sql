-- One-day private tours.
-- A daily package with `is_private` = true is a private day trip: the guest
-- picks any date on the tour page and the car, driver and itinerary are for
-- their party only. These are listed on the Private Tours page instead of the
-- shared Daily Packages page, and have no fixed `tour_date`.

alter table daily_packages
  add column if not exists is_private boolean not null default false;

alter table daily_packages
  alter column tour_date drop not null;

notify pgrst, 'reload schema';
