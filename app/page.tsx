"use client";

import { motion } from "framer-motion";

export default function Home() {
  const steps = [
    {
      title: "Paste your screenplay",
      text: "Start with a scene, screenplay, or raw story idea.",
    },
    {
      title: "AI breaks it into shots",
      text: "FrameForge AI converts scenes into cinematic storyboard shots.",
    },
    {
      title: "Generate storyboard panels",
      text: "Turn each shot into anime-style visual storyboard frames.",
    },
  ];

  const features = [
    {
      title: "Scene Breakdown",
      description:
        "Intelligently parse your screenplay into structured scenes and beats. Our AI identifies key narrative moments and visual cues to create a solid foundation for storyboarding.",
    },
    {
      title: "Shot Generation",
      description:
        "Transform scenes into cinematic shot descriptions with camera angles, movements, and timing. Each shot is optimized for anime composition and visual impact.",
    },
    {
      title: "Anime Storyboard Panels",
      description:
        "Generate anime-style visual panels from shot descriptions. Our AI creates expressive character work, dynamic compositions, and atmospheric backgrounds instantly.",
    },
    {
      title: "Regenerate Frames",
      description:
        "Iterate freely on any panel with one click. Refine compositions, adjust character expressions, or explore alternative visual directions without restarting your workflow.",
    },
  ];

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#7c3aed55,transparent_35%),radial-gradient(circle_at_top_right,#ec489955,transparent_30%),radial-gradient(circle_at_bottom,#2563eb44,transparent_35%)]" />

        <div className="relative mx-auto max-w-7xl px-6 py-6">
          <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center justify-between"
          >
            <h1 className="text-xl font-bold tracking-tight">
              FrameForge <span className="text-purple-400">AI</span>
            </h1>

            <div className="flex items-center gap-3">
              <button className="hidden rounded-full border border-white/15 px-5 py-2 text-sm text-white/80 sm:block">
                Sign In
              </button>
              <button className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-black">
                Start Creating
              </button>
            </div>
          </motion.nav>

          <div className="grid min-h-[72vh] items-center gap-12 py-16 lg:grid-cols-2">
            <div>
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="mb-5 inline-flex rounded-full border border-purple-400/30 bg-purple-400/10 px-4 py-2 text-sm text-purple-200"
              >
                AI storyboard studio for anime creators
              </motion.p>

              <motion.h2
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="max-w-3xl text-4xl font-black leading-[1.04] tracking-tight md:text-5xl xl:text-6xl"
              >
                Turn Screenplays into{" "}
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                  Anime-Style Storyboards
                </span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.32, ease: [0.22, 1, 0.36, 1] }}
                className="mt-6 max-w-2xl text-lg leading-8 text-white/65"
              >
                Paste a screenplay and generate scene breakdowns, cinematic
                shots, visual prompts, and anime-style storyboard panels with AI.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.44, ease: [0.22, 1, 0.36, 1] }}
                className="mt-9 flex flex-col gap-4 sm:flex-row"
              >
                <button className="rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-4 font-semibold transition-transform duration-300 hover:scale-[1.03]">
                  Start Creating
                </button>
                <button className="rounded-full border border-white/15 px-8 py-4 font-semibold text-white/80 transition-transform duration-300 hover:scale-[1.03]">
                  View Demo
                </button>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-2xl backdrop-blur"
              >
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-sm text-white/60">Storyboard Preview</p>
                  <p className="rounded-full bg-green-400/10 px-3 py-1 text-xs text-green-300">
                    Generated
                  </p>
                </div>

                <motion.div
                  className="grid grid-cols-2 gap-4"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: {},
                    visible: {
                      transition: {
                        staggerChildren: 0.12,
                        delayChildren: 0.5,
                      },
                    },
                  }}
                >
                  {[1, 2, 3, 4].map((item) => (
                    <motion.div
                      key={item}
                      variants={{
                        hidden: { opacity: 0, y: 14, scale: 0.96 },
                        visible: {
                          opacity: 1,
                          y: 0,
                          scale: 1,
                          transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
                        },
                      }}
                      className="aspect-[4/3] rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 to-purple-950 p-4"
                    >
                      <div className="mb-3 h-3 w-20 rounded-full bg-white/20" />
                      <div className="flex h-full items-end">
                        <p className="text-xs text-white/55">
                          Shot {item}: cinematic anime frame
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12 text-center"
        >
          <h3 className="text-3xl font-bold md:text-4xl">How It Works</h3>
          <p className="mt-4 text-white/55">
            From written scene to visual storyboard in three focused steps.
          </p>
        </motion.div>

        <motion.div
          className="grid gap-6 md:grid-cols-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.15,
              },
            },
          }}
        >
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              variants={{
                hidden: { opacity: 0, y: 24 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
                },
              }}
              className="rounded-3xl border border-white/10 bg-white/[0.04] p-8"
            >
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/20 text-purple-300">
                {index + 1}
              </div>
              <h4 className="text-xl font-semibold">{step.title}</h4>
              <p className="mt-3 leading-7 text-white/55">{step.text}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12"
        >
          <h3 className="text-3xl font-bold md:text-4xl">
            Built for visual storytellers
          </h3>
          <p className="mt-4 max-w-2xl text-white/55">
            FrameForge AI is designed to help creators move from imagination to
            storyboard faster.
          </p>
        </motion.div>

        <motion.div
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.12,
              },
            },
          }}
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={{
                hidden: { opacity: 0, y: 24, scale: 0.98 },
                visible: {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
                },
              }}
              whileHover={{ y: -4 }}
              className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.08] to-white/[0.03] p-6"
            >
              <div className="mb-8 h-28 rounded-2xl bg-gradient-to-br from-purple-500/20 via-pink-500/10 to-blue-500/20" />
              <h4 className="text-lg font-semibold">{feature.title}</h4>
              <p className="mt-3 text-sm leading-6 text-white/50">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-blue-500/10 p-12 md:p-16"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#7c3aed33,transparent_50%)]" />
          <div className="relative z-10">
            <h3 className="text-center text-3xl font-bold md:text-4xl">
              Ready to forge your first storyboard?
            </h3>
            <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-white/65">
                 Transform your screenplay into structured anime-style storyboard
                 panels — from written scenes to visual planning in minutes.
            </p>
      
            <motion.div
              className="mt-10 flex justify-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <button className="rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-10 py-4 text-lg font-semibold transition-transform duration-300 hover:scale-[1.05]">
                Start Creating
              </button>
            </motion.div>
          </div>
        </motion.div>
      </section>

      <footer className="border-t border-white/10 px-6 py-12">
  <div className="mx-auto max-w-7xl">
    <div className="mb-12 grid gap-10 md:grid-cols-3">
      <div>
        <h4 className="text-lg font-bold">
          FrameForge <span className="text-purple-400">AI</span>
        </h4>
        <p className="mt-3 max-w-sm text-sm leading-6 text-white/50">
          AI-powered storyboarding tool for anime creators. Turn screenplays
          into structured visual storyboard panels.
        </p>
      </div>

      <div>
        <h5 className="text-sm font-semibold text-white/80">Product</h5>
        <ul className="mt-4 space-y-3">
          <li>
            <a
              href="#"
              className="text-sm text-white/50 transition-colors hover:text-white/80"
            >
              Features
            </a>
          </li>
          <li>
            <a
              href="#"
              className="text-sm text-white/50 transition-colors hover:text-white/80"
            >
              Workflow
            </a>
          </li>
          <li>
            <a
              href="#"
              className="text-sm text-white/50 transition-colors hover:text-white/80"
            >
              Demo
            </a>
          </li>
        </ul>
      </div>

      <div>
        <h5 className="text-sm font-semibold text-white/80">Company</h5>
        <ul className="mt-4 space-y-3">
          <li>
            <a
              href="#"
              className="text-sm text-white/50 transition-colors hover:text-white/80"
            >
              GitHub
            </a>
          </li>
          <li>
            <a
              href="#"
              className="text-sm text-white/50 transition-colors hover:text-white/80"
            >
              Contact
            </a>
          </li>
          <li>
            <a
              href="#"
              className="text-sm text-white/50 transition-colors hover:text-white/80"
            >
              Roadmap
            </a>
          </li>
        </ul>
      </div>
    </div>

    <div className="border-t border-white/10 pt-8 text-center text-sm text-white/40">
      <p>© 2026 FrameForge AI. All rights reserved.</p>
    </div>
  </div>
</footer>
    </main>
  );
}
