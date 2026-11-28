/**
 * GitHub Pages serves project sites from a subpath (/<repo>), so every plain
 * anchor needs the same prefix Next applies to <Link> and to its own assets.
 */
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function withBase(path: string): string {
  if (!path.startsWith("/")) return path;
  return `${basePath}${path}`;
}
