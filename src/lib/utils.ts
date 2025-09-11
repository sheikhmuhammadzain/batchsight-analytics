import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Generate a random ID that works across environments (older browsers, build preview, etc.)
// Preference order:
// 1) crypto.randomUUID (if available)
// 2) crypto.getRandomValues + UUID v4 polyfill
// 3) timestamp + Math.random fallback
export function randomId(): string {
  try {
    const g: any = (typeof globalThis !== 'undefined') ? globalThis : undefined;
    const c = g?.crypto;
    if (c && typeof c.randomUUID === 'function') {
      return c.randomUUID();
    }
    if (c && typeof c.getRandomValues === 'function') {
      const buf = new Uint8Array(16);
      c.getRandomValues(buf);
      // Set version (4) and variant bits per RFC 4122
      buf[6] = (buf[6] & 0x0f) | 0x40;
      buf[8] = (buf[8] & 0x3f) | 0x80;
      const hex = Array.from(buf, (b) => b.toString(16).padStart(2, '0')).join('');
      return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
    }
  } catch {
    // ignore and fall through
  }
  // Last-resort fallback (not RFC compliant but unique enough for UI keys)
  return `id-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
