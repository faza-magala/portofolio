/**
 * Security and URL validation utilities
 */

/**
 * Validates that an external URL is safe to open in a browser.
 * Only allows HTTP, HTTPS, and mailto schemes to prevent malicious protocols like javascript:
 */
export function isSafeUrl(url: string | undefined | null): boolean {
  if (!url || typeof url !== 'string') return false;

  const trimmed = url.trim();
  if (trimmed === '' || trimmed === '#') return false;

  // Relative links and anchors are allowed on same origin
  if (trimmed.startsWith('/') || trimmed.startsWith('#')) {
    return true;
  }

  // Allow mailto
  if (trimmed.startsWith('mailto:')) {
    return /^mailto:[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(trimmed);
  }

  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}

/**
 * Returns safe rel attributes for external links
 */
export function getExternalLinkProps(url: string | undefined) {
  if (!url || !isSafeUrl(url)) {
    return { href: '#', rel: undefined, target: undefined };
  }

  const isExternal = url.startsWith('http://') || url.startsWith('https://');

  return {
    href: url,
    target: isExternal ? '_blank' : undefined,
    rel: isExternal ? 'noopener noreferrer' : undefined,
  };
}

/**
 * Validates basic email formatting
 */
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}
