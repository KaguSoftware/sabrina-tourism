import { createServiceClient } from './server';

const BUCKET = 'media';
const FALLBACK = '/placeholder.png';

export function getPublicUrl(path: string | null | undefined): string {
  if (!path) return FALLBACK;
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('/')) {
    return path;
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) throw new Error('Missing env: NEXT_PUBLIC_SUPABASE_URL');

  return `${url}/storage/v1/object/public/${BUCKET}/${path}`;
}

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
