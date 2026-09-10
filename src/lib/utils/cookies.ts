const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

/**
 * Reads a browser cookie by name. Returns null on the server.
 */
export function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

/**
 * Writes a root-scoped browser cookie. No-op on the server.
 *
 * Kept at module scope on purpose: assigning to `document.cookie` inside a
 * component body reads as a global mutation to the React Compiler lint rules.
 */
export function writeCookie(
  name: string,
  value: string,
  maxAgeSeconds: number = ONE_YEAR_SECONDS,
): void {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAgeSeconds}`;
}
