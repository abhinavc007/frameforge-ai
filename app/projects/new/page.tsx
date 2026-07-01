"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import GradientBackground from "@/components/GradientBackground";
import AppNavbar from "@/components/AppNavbar";
import StoryboardCubeIntro from "@/components/StoryboardCubeIntro";

const styleOptions = [
  "Cinematic anime",
  "Dark fantasy",
  "Cyberpunk",
  "Slice of life",
  "Manga storyboard",
];

const pipelineSteps = [
  {
    title: "Reading story",
    description: "Scanning characters, mood, location, and story flow.",
  },
  {
    title: "Extracting scenes",
    description: "Finding meaningful scene changes and visual story moments.",
  },
  {
    title: "Planning shots",
    description: "Breaking scenes into cinematic storyboard panels.",
  },
  {
    title: "Preparing prompts",
    description: "Building image-ready prompts for anime storyboard frames.",
  },
];

const previewImages = [
  "/landing/shot1.png",
  "/landing/shot2.png",
  "/landing/shot3.png",
  "/landing/shot4.png",
];

export default function CreateProjectPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [screenplay, setScreenplay] = useState("");
  const [style, setStyle] = useState("Cinematic anime");
  const [characterNotes, setCharacterNotes] = useState("");
  const [activePipelineStep, setActivePipelineStep] = useState(0);
  const [activePreviewImage, setActivePreviewImage] = useState(0);

  const wordCount = useMemo(() => {
    return screenplay.trim() ? screenplay.trim().split(/\s+/).length : 0;
  }, [screenplay]);

  const canGenerate = title.trim().length > 2 && screenplay.trim().length > 20;

  const readinessText = canGenerate
    ? "Ready for storyboard generation"
    : "Waiting for enough story input";

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActivePipelineStep((currentStep) =>
        currentStep === pipelineSteps.length - 1 ? 0 : currentStep + 1
      );

      setActivePreviewImage((currentImage) =>
        currentImage === previewImages.length - 1 ? 0 : currentImage + 1
      );
    }, 2200);

    return () => window.clearInterval(interval);
  }, []);

  function handleGenerate() {
    if (!canGenerate) {
      return;
    }

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

    router.push("/projects/generating");
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <StoryboardCubeIntro />
      <GradientBackground />

      <div className="mx-auto max-w-7xl px-6 py-6">
        <AppNavbar secondaryHref="/dashboard" secondaryLabel="Dashboard" />

        <section className="py-10 md:py-12">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-10"
          >
            <p className="mb-4 inline-flex rounded-full border border-purple-400/30 bg-purple-400/10 px-4 py-2 text-sm text-purple-200">
              New Storyboard Project
            </p>

            <h1 className="max-w-4xl text-4xl font-black tracking-tight md:text-6xl">
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
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.7 }}
              className={`rounded-3xl border bg-white/[0.04] p-6 transition md:p-8 ${
                screenplay.trim()
                  ? "border-purple-400/25 shadow-2xl shadow-purple-950/20"
                  : "border-white/10"
              }`}
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
                    className="w-full rounded-2xl border border-white/10 bg-black/40 px-5 py-4 text-white outline-none transition placeholder:text-white/30 focus:border-purple-400/50 focus:shadow-lg focus:shadow-purple-500/10"
                  />
                </div>

                <div>
                  <div className="mb-3 flex items-center justify-between gap-4">
                    <label className="block text-sm font-medium text-white/80">
                      Screenplay / Scene Text
                    </label>

                    <span
                      className={`text-xs ${
                        wordCount > 0 ? "text-purple-200" : "text-white/40"
                      }`}
                    >
                      {wordCount} words
                    </span>
                  </div>

                  <textarea
                    value={screenplay}
                    onChange={(event) => setScreenplay(event.target.value)}
                    placeholder={`EXT. RAINY VILLAGE ROAD - NIGHT\n\nA young boy walks alone under a broken umbrella. Thunder flashes across the sky. In the distance, a lantern flickers beside an abandoned shrine.`}
                    rows={13}
                    className="w-full resize-none rounded-2xl border border-white/10 bg-black/40 px-5 py-4 leading-7 text-white outline-none transition placeholder:text-white/30 focus:border-purple-400/50 focus:shadow-lg focus:shadow-purple-500/10"
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
                            ? "border-purple-400/50 bg-purple-500/15 text-purple-100 shadow-lg shadow-purple-950/20"
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
                    className="w-full resize-none rounded-2xl border border-white/10 bg-black/40 px-5 py-4 leading-7 text-white outline-none transition placeholder:text-white/30 focus:border-purple-400/50 focus:shadow-lg focus:shadow-purple-500/10"
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
                    onClick={handleGenerate}
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
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="space-y-6 lg:sticky lg:top-6 lg:self-start"
            >
              <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.08] to-white/[0.03] p-6 shadow-2xl shadow-black/30">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={previewImages[activePreviewImage]}
                    initial={{ opacity: 0, x: 50, scale: 1.05 }}
                    animate={{ opacity: 0.28, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -50, scale: 1.05 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${previewImages[activePreviewImage]})`,
                    }}
                  />
                </AnimatePresence>

                <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/85 to-black" />

                <motion.div
                  animate={{ x: ["-140%", "140%"] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute inset-y-0 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-purple-400/15 to-transparent"
                />

                <div className="relative z-10">
                  <div className="mb-5 flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.22em] text-purple-200/60">
                        AI Pipeline
                      </p>
                      <h2 className="mt-2 text-xl font-bold">
                        Storyboard Engine
                      </h2>
                    </div>

                    <div
                      className={`rounded-full border px-3 py-1 text-xs ${
                        canGenerate
                          ? "border-green-400/20 bg-green-400/10 text-green-300"
                          : "border-white/10 bg-white/5 text-white/45"
                      }`}
                    >
                      {canGenerate ? "Ready" : "Waiting"}
                    </div>
                  </div>

                  <div className="space-y-4">
                    {pipelineSteps.map((step, index) => {
                      const isActive = activePipelineStep === index;

                      return (
                        <motion.div
                          key={step.title}
                          animate={{
                            scale: isActive ? 1.02 : 1,
                            opacity: isActive ? 1 : 0.65,
                          }}
                          transition={{ duration: 0.35 }}
                          className={`rounded-2xl border p-4 backdrop-blur ${
                            isActive
                              ? "border-purple-400/40 bg-purple-500/15 shadow-lg shadow-purple-500/10"
                              : "border-white/10 bg-black/35"
                          }`}
                        >
                          <div className="flex items-start gap-4">
                            <div
                              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm ${
                                isActive
                                  ? "bg-purple-400 text-black"
                                  : "bg-purple-500/20 text-purple-300"
                              }`}
                            >
                              {index + 1}
                            </div>

                            <div>
                              <p className="text-sm font-semibold text-white/85">
                                {step.title}
                              </p>
                              <p className="mt-1 text-xs leading-5 text-white/45">
                                {step.description}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  <div className="mt-6 rounded-2xl border border-white/10 bg-black/45 p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <p className="text-xs uppercase tracking-[0.18em] text-white/35">
                        Readiness
                      </p>
                      <p className="text-xs text-white/45">{wordCount} words</p>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-white/10">
                      <motion.div
                        animate={{
                          width: canGenerate
                            ? "100%"
                            : `${Math.min((screenplay.trim().length / 20) * 100, 75)}%`,
                        }}
                        transition={{ duration: 0.4 }}
                        className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                      />
                    </div>

                    <p
                      className={`mt-3 text-sm ${
                        canGenerate ? "text-green-300" : "text-white/45"
                      }`}
                    >
                      {readinessText}
                    </p>
                  </div>
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