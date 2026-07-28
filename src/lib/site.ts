// Set NEXT_PUBLIC_SITE_URL in your hosting provider's env vars once the
// real domain is connected. Falls back to localhost for local dev so
// nothing breaks before that's configured.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "http://localhost:3000";
