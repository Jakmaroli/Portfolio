"use client";

/**
 * Contact — "git push origin hire-jak"
 *
 * Terminal-styled form with a blinking block cursor in the message
 * textarea. The cursor uses a CSS animation (cursor-blink class
 * defined in globals.css).
 *
 * Stage 2: static layout, no form submission logic yet.
 */

import { motion, useReducedMotion } from "framer-motion";
import { EASE, DUR } from "@/lib/motion";

export default function Contact() {
  const prefersReduced = useReducedMotion();
  const reduced = prefersReduced === true;

  return (
    <section id="contact" className="px-6 py-16 md:px-16 lg:px-24">
      <motion.h2
        className="mb-2 font-mono text-sm uppercase tracking-wider text-muted"
        initial={reduced ? {} : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: DUR.base, ease: EASE }}
      >
        Contact
      </motion.h2>

      <motion.p
        className="mb-8 font-mono text-lg text-lane-main"
        initial={reduced ? {} : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.06, duration: DUR.base, ease: EASE }}
      >
        <span className="cursor-blink">$ git push origin hire-jak</span>
      </motion.p>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* Terminal form */}
        <motion.div
          className="rounded-lg border border-border bg-surface"
          initial={reduced ? {} : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: DUR.base, ease: EASE }}
        >
          {/* Traffic-light title bar */}
          <div className="flex items-center gap-2 border-b border-border px-4 py-2">
            <span className="h-3 w-3 rounded-full bg-[#FF5F56]" />
            <span className="h-3 w-3 rounded-full bg-[#FFBD2E]" />
            <span className="h-3 w-3 rounded-full bg-[#27C93F]" />
            <span className="ml-2 font-mono text-xs text-muted">
              ~/hire-jak
            </span>
          </div>

          <form className="space-y-4 p-6">
            <div>
              <label
                htmlFor="name"
                className="mb-1 block font-mono text-xs text-muted"
              >
                name
              </label>
              <input
                id="name"
                type="text"
                placeholder="Your name"
                className="w-full rounded border border-border bg-background px-3 py-2 font-mono text-sm text-foreground placeholder:text-muted/50 focus:border-lane-main focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-1 block font-mono text-xs text-muted"
              >
                email
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="w-full rounded border border-border bg-background px-3 py-2 font-mono text-sm text-foreground placeholder:text-muted/50 focus:border-lane-main focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="mb-1 block font-mono text-xs text-muted"
              >
                message
              </label>
              <textarea
                id="message"
                rows={4}
                placeholder="Let's build something..."
                className="w-full resize-none rounded border border-border bg-background px-3 py-2 font-mono text-sm text-foreground placeholder:text-muted/50 focus:border-lane-main focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded border border-lane-main bg-lane-main/10 px-4 py-2.5 font-mono text-sm text-lane-main transition-colors hover:bg-lane-main/20"
            >
              git push
            </button>
          </form>
        </motion.div>

        {/* Direct links */}
        <motion.div
          className="flex flex-col justify-center gap-4"
          initial={reduced ? {} : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ delay: 0.1, duration: DUR.base, ease: EASE }}
        >
          <a
            href="mailto:akumarjanaki@gmail.com"
            className="group flex items-center gap-3 font-mono text-sm text-muted transition-colors hover:text-foreground"
          >
            <span className="text-lane-main">→</span>
            akumarjanaki@gmail.com
          </a>
          <a
            href="https://github.com/Jakmaroli"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 font-mono text-sm text-muted transition-colors hover:text-foreground"
          >
            <span className="text-lane-main">→</span>
            github.com/Jakmaroli
          </a>
          {/* TODO(jak): add LinkedIn, Twitter/X, or other social links */}
        </motion.div>
      </div>
    </section>
  );
}
