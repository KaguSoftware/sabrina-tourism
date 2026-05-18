-- Add data_translations JSONB column to site_content for home/tours-page/etc localisation.
-- Shape: { "tr": { fieldKey: "val", ... }, "ar": { ... }, "es": { ... }, "it": { ... } }
alter table site_content
  add column if not exists data_translations jsonb not null default '{}';

notify pgrst, 'reload schema';
