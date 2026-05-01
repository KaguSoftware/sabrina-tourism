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
