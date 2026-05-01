import { createServiceClient } from './server';

const BUCKET = 'media';

export async function uploadImage(
  file: File,
  folder: string,
): Promise<{ path: string; error: Error | null }> {
  const supabase = createServiceClient();

  const slug = file.name
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, '-')
    .replace(/^-+|-+$/g, '');
  const path = `${folder}/${Date.now()}-${slug}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    upsert: false,
    contentType: file.type,
  });

  if (error) return { path: '', error: new Error(error.message) };
  return { path, error: null };
}
