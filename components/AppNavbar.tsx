"use client";

import Link from "next/link";
import { motion } from "framer-motion";

type AppNavbarProps = {
  secondaryHref?: string;
  secondaryLabel?: string;
  ctaHref?: string;
  ctaLabel?: string;
};

export default function AppNavbar({
  secondaryHref,
  secondaryLabel,
  ctaHref,
  ctaLabel,
}: AppNavbarProps) {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex items-center justify-between border-b border-white/10 pb-6"
    >
      <Link href="/" className="text-xl font-bold tracking-tight">
        FrameForge <span className="text-purple-400">AI</span>
      </Link>

      <div className="flex items-center gap-3">
        {secondaryHref && secondaryLabel ? (
          <Link
            href={secondaryHref}
            className="hidden rounded-full border border-white/15 px-5 py-2 text-sm text-white/70 transition hover:text-white sm:block"
          >
            {secondaryLabel}
          </Link>
        ) : null}

        {ctaHref && ctaLabel ? (
          <Link
            href={ctaHref}
            className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-black transition hover:bg-white/90"
          >
            {ctaLabel}
          </Link>
        ) : null}
      </div>
    </motion.nav>
  );
}