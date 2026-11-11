"use client";

/**
 * Page transition wrapper.
 *
 * Adds a subtle fade + slide-up entrance when navigating to
 * non-home pages (case studies). Skipped on the home page so
 * the hero renders immediately for LCP, and when reduced motion
 * is preferred.
 */

import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { EASE, DUR } from "@/lib/motion";

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reduced = useReducedMotion();

  if (pathname === "/" || reduced) return <>{children}</>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: DUR.fast, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
