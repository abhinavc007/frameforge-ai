"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";

const styleOptions = [
  "Cinematic anime",
  "Dark fantasy",
  "Cyberpunk",
  "Slice of life",
  "Manga storyboard",
];

export default function CreateProjectPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [screenplay, setScreenplay] = useState("");
  const [style, setStyle] = useState("Cinematic anime");
  const [characterNotes, setCharacterNotes] = useState("");

  const wordCount = useMemo(() => {
    return screenplay.trim() ? screenplay.trim().split(/\s+/).length : 0;
  }, [screenplay]);

  const canGenerate = title.trim().length > 2 && screenplay.trim().length > 20;

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,#7c3aed44,transparent_30%),radial-gradient(circle_at_top_right,#ec489944,transparent_30%),radial-gradient(circle_at_bottom,#2563eb33,transparent_35%)]" />

      <div className="mx-auto max-w-7xl px-6 py-6">
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
            <Link
              href="/dashboard"
              className="rounded-full border border-white/15 px-5 py-2 text-sm text-white/70 transition hover:text-white"
            >
              Dashboard
            </Link>
          </div>
        </motion.nav>

        <section className="py-12">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-10"
          >
            <p className="mb-4 inline-flex rounded-full border border-purple-400/30 bg-purple-400/10 px-4 py-2 text-sm text-purple-200">
              New Storyboard Project
            </p>

            <h1 className="max-w-3xl text-4xl font-black tracking-tight md:text-5xl">
              Start with a screenplay. Forge it into storyboard frames.
            </h1>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/60">
              Add your project title, paste a scene or screenplay, choose a
              visual style, and prepare it for AI-powered scene and shot
              generation.
            </p>
          </motion.div>

          <div className="grid gap-8 lg:grid-cols-[1.35fr_0.65fr]">
            <motion.form
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 md:p-8"
            >
              <div className="grid gap-6">
                <div>
                  <label className="mb-3 block text-sm font-medium text-white/80">
                    Project Title
                  </label>
                  <input
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="Example: The Last Lantern"
                    className="w-full rounded-2xl border border-white/10 bg-black/40 px-5 py-4 text-white outline-none transition placeholder:text-white/30 focus:border-purple-400/50"
                  />
                </div>

                <div>
                  <div className="mb-3 flex items-center justify-between gap-4">
                    <label className="block text-sm font-medium text-white/80">
                      Screenplay / Scene Text
                    </label>
                    <span className="text-xs text-white/40">
                      {wordCount} words
                    </span>
                  </div>

                  <textarea
                    value={screenplay}
                    onChange={(event) => setScreenplay(event.target.value)}
                    placeholder={`EXT. RAINY VILLAGE ROAD - NIGHT\n\nA young boy walks alone under a broken umbrella. Thunder flashes across the sky. In the distance, a lantern flickers beside an abandoned shrine.`}
                    rows={13}
                    className="w-full resize-none rounded-2xl border border-white/10 bg-black/40 px-5 py-4 leading-7 text-white outline-none transition placeholder:text-white/30 focus:border-purple-400/50"
                  />
                </div>

                <div>
                  <label className="mb-3 block text-sm font-medium text-white/80">
                    Visual Style
                  </label>

                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {styleOptions.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setStyle(option)}
                        className={`rounded-2xl border px-4 py-3 text-left text-sm transition ${
                          style === option
                            ? "border-purple-400/50 bg-purple-500/15 text-purple-100"
                            : "border-white/10 bg-black/30 text-white/55 hover:text-white"
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-3 block text-sm font-medium text-white/80">
                    Character / World Notes
                    <span className="text-white/35"> — optional</span>
                  </label>
                  <textarea
                    value={characterNotes}
                    onChange={(event) => setCharacterNotes(event.target.value)}
                    placeholder="Example: Main character is a quiet 17-year-old boy with messy black hair, tired eyes, school uniform, and a red scarf."
                    rows={5}
                    className="w-full resize-none rounded-2xl border border-white/10 bg-black/40 px-5 py-4 leading-7 text-white outline-none transition placeholder:text-white/30 focus:border-purple-400/50"
                  />
                </div>

                <div className="flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
                  <Link
                    href="/dashboard"
                    className="rounded-full border border-white/15 px-6 py-3 text-center text-sm font-semibold text-white/70 transition hover:text-white"
                  >
                    Cancel
                  </Link>

                  <button
  type="button"
  disabled={!canGenerate}
  onClick={() => {
  if (canGenerate) {
    const projectDraft = {
      title: title.trim(),
      screenplay: screenplay.trim(),
      style,
      characterNotes: characterNotes.trim(),
      createdAt: new Date().toISOString(),
    };

    sessionStorage.setItem(
      "frameforge-current-project",
      JSON.stringify(projectDraft)
    );

    router.push("/projects/demo");
  }
}}
  className={`rounded-full px-8 py-4 font-semibold transition ${
    canGenerate
      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:scale-[1.03]"
      : "cursor-not-allowed bg-white/10 text-white/35"
  }`}
>
  Generate Storyboard
</button>
                </div>
              </div>
            </motion.form>

            <motion.aside
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.08] to-white/[0.03] p-6">
                <h2 className="text-xl font-bold">Generation Plan</h2>
                <p className="mt-3 text-sm leading-6 text-white/50">
                  FrameForge AI will process your screenplay through a structured
                  storyboard pipeline.
                </p>

                <div className="mt-6 space-y-4">
                  {[
                    "Extract scenes",
                    "Generate cinematic shots",
                    "Create visual prompts",
                    "Build storyboard panels",
                  ].map((item, index) => (
                    <div
                      key={item}
                      className="flex items-center gap-4 rounded-2xl bg-black/30 p-4"
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/20 text-sm text-purple-300">
                        {index + 1}
                      </div>
                      <p className="text-sm text-white/70">{item}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
                <h2 className="text-xl font-bold">Project Preview</h2>

                <div className="mt-5 rounded-2xl border border-white/10 bg-black/35 p-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-white/35">
                    Title
                  </p>
                  <p className="mt-2 font-semibold text-white/80">
                    {title || "Untitled Project"}
                  </p>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl bg-white/[0.04] p-4">
                      <p className="text-xs text-white/35">Style</p>
                      <p className="mt-2 text-sm text-white/75">{style}</p>
                    </div>
                    <div className="rounded-2xl bg-white/[0.04] p-4">
                      <p className="text-xs text-white/35">Words</p>
                      <p className="mt-2 text-sm text-white/75">{wordCount}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-purple-400/20 bg-purple-500/10 p-6">
                <h2 className="text-lg font-bold text-purple-100">
                  Writing tip
                </h2>
                <p className="mt-3 text-sm leading-6 text-purple-100/65">
                  Strong visual scenes produce better storyboard results. Include
                  location, mood, character action, and important visual details.
                </p>
              </div>
            </motion.aside>
          </div>
        </section>
      </div>
    </main>
  );
}