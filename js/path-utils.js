export function getBasePrefix(pathname = window.location.pathname) {
  const cleanPath = pathname.split('?')[0].split('#')[0];
  const segments = cleanPath.split('/').filter(Boolean);
  const repoIndex = segments.lastIndexOf('Heavens');
  const relevant = repoIndex >= 0 ? segments.slice(repoIndex + 1) : segments;
  const depth = Math.max(0, relevant.length - 1);
  return depth === 0 ? '.' : Array.from({ length: depth }, () => '..').join('/');
}

export function toAbsolutePath(relativePath, pathname = window.location.pathname) {
  const base = getBasePrefix(pathname);
  return `${base}/${relativePath}`.replace(/^\.\//, '');
}
