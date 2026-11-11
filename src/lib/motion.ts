/**
 * Shared motion tokens — every animation on the site uses these
 * so timings stay consistent and are easy to tweak in one place.
 *
 * EASE: a custom cubic-bezier that starts fast and decelerates smoothly.
 *       Used for every non-spring animation sitewide.
 *
 * DUR:  duration presets in seconds.
 */

export const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const DUR = {
  fast: 0.3,   // micro-interactions (hover, toggle)
  base: 0.6,   // standard reveals
  slow: 1.1,   // hero-level moments
} as const;
