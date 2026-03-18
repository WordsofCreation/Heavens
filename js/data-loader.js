export async function loadObjects() {
  const base = window.location.pathname.includes('/pages/') ? '..' : '.';
  const response = await fetch(`${base}/data/objects.json`);
  if (!response.ok) {
    throw new Error('Unable to load astronomy objects.');
  }
  return response.json();
}
