const adminApiBase = '/api/backend';
const unsafeMethods = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

function getCookieValue(name: string) {
  if (typeof document === 'undefined') return undefined;

  return document.cookie
    .split(';')
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith(`${name}=`))
    ?.slice(name.length + 1);
}

export async function adminFetch(path: string, init: RequestInit = {}) {
  const method = (init.method || 'GET').toUpperCase();
  const headers = new Headers(init.headers);

  if (unsafeMethods.has(method)) {
    const csrfToken = getCookieValue('admin_csrf');
    if (csrfToken) {
      headers.set('X-CSRF-Token', decodeURIComponent(csrfToken));
    }
  }

  const response = await fetch(`${adminApiBase}${path}`, {
    ...init,
    headers,
    credentials: 'include',
  });

  if (response.status === 401 && typeof window !== 'undefined') {
    window.location.assign('/admin/login');
  }

  return response;
}
