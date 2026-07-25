/**
 * Extract tenant slug from subdomain
 * e.g., acme.yourapp.com -> 'acme'
 */
export function getTenantFromSubdomain(): string | null {
  if (typeof window === 'undefined') return null;

  const hostname = window.location.hostname;
  const parts = hostname.split('.');

  // Check if subdomain exists and it's not 'www' or 'localhost'
  if (parts.length > 2) {
    const subdomain = parts[0];
    if (subdomain !== 'www' && subdomain !== 'localhost' && !subdomain.startsWith('192.168')) {
      return subdomain;
    }
  }

  return null;
}

/**
 * Extract tenant from path-based routing
 * e.g., /tenant/acme/dashboard -> 'acme'
 */
export function getTenantFromPath(): string | null {
  if (typeof window === 'undefined') return null;

  const path = window.location.pathname;
  const match = path.match(/^\/tenant\/([^/]+)/);
  return match ? match[1] : null;
}

/**
 * Get tenant slug from subdomain or path (fallback)
 */
export function getTenantSlug(): string | null {
  if (typeof window === 'undefined') return null;
  return getTenantFromSubdomain() || getTenantFromPath();
}
