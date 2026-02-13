/**
 * Check if the app is running in demo mode (public preview without auth).
 * The demo_mode cookie is set by the middleware when /demo is accessed.
 * sessionStorage is set by the client router as a fallback.
 */
export const isDemoMode = (): boolean => {
  if (typeof window === 'undefined') return false;

  // Check cookie (set by middleware — available immediately on first render)
  if (document.cookie.includes('demo_mode=1')) return true;

  // Fallback: check sessionStorage (set by client router)
  try {
    if (sessionStorage.getItem('demo_mode') === '1') return true;
  } catch {
    // sessionStorage may not be available in some contexts
  }

  return false;
};
