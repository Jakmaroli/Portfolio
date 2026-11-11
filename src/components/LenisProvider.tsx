"use client";

/**
 * Initialises Lenis smooth-scroll at the document level.
 *
 * lerp 0.08 gives light inertia (spec: "about 0.1").
 * smoothTouch is off so mobile touch scrolling stays native.
 * Skipped entirely when prefers-reduced-motion is set.
 */

import { useEffect } from "react";
import Lenis from "lenis";

export default function LenisProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Respect the OS-level reduced-motion preference
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      lerp: 0.08,
      syncTouch: false,
    });

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
