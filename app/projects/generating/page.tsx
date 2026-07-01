"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import AppNavbar from "@/components/AppNavbar";
import GradientBackground from "@/components/GradientBackground";

const generationSteps = [
  "Reading screenplay structure",
  "Extracting scenes and mood",
  "Generating cinematic shots",
  "Creating visual prompts",
  "Preparing storyboard preview",
];

type ProjectDraft = {
  title: string;
  screenplay: string;
  style: string;
  characterNotes: string;
  createdAt: string;
};

export default function GeneratingPage() {
  const router = useRouter();
  const hasStarted = useRef(false);

  const [currentStep, setCurrentStep] = useState(0);
  const [projectDraft, setProjectDraft] = useState<ProjectDraft | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (hasStarted.current) return;
    hasStarted.current = true;

    const generateStoryboard = async () => {
      try {
        const savedProject = sessionStorage.getItem(
          "frameforge-current-project"
        );

        if (!savedProject) {
          router.push("/projects/new");
          return;
        }

        const draft = JSON.parse(savedProject) as ProjectDraft;
        setProjectDraft(draft);

        const stepTimer = setInterval(() => {
          setCurrentStep((previousStep) => {
            if (previousStep < generationSteps.length - 1) {
              return previousStep + 1;
            }

            return previousStep;
          });
        }, 700);

        const response = await fetch("/api/analyze-screenplay", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(draft),
        });

        if (!response.ok) {
          throw new Error("Failed to analyze screenplay.");
        }

        const generatedProject = await response.json();

        sessionStorage.setItem(
          "frameforge-generated-project",
          JSON.stringify(generatedProject)
        );

        clearInterval(stepTimer);
        setCurrentStep(generationSteps.length - 1);

        setTimeout(() => {
          router.push("/projects/demo");
        }, 900);
      } catch {
        setError(
          "Something went wrong while generating the storyboard. Please try again."
        );
      }
    };

    generateStoryboard();
  }, [router]);

  const progress = ((currentStep + 1) / generationSteps.length) * 100;

  return (
    <main className="min-h-screen bg-black text-white">
      <GradientBackground />

      <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-6 py-6">
        <AppNavbar secondaryHref="/dashboard" secondaryLabel="Dashboard" />

        <section className="flex flex-1 items-center justify-center py-16">
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-3xl rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-center shadow-2xl backdrop-blur md:p-12"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
              }}
              className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-purple-400/30 bg-purple-500/10"
            >
              <div className="h-10 w-10 rounded-full border-2 border-purple-300 border-t-transparent" />
            </motion.div>

            <p className="mt-8 inline-flex rounded-full border border-purple-400/30 bg-purple-400/10 px-4 py-2 text-sm text-purple-200">
              AI generation in progress
            </p>

            <h1 className="mt-6 text-3xl font-black tracking-tight md:text-5xl">
              Forging your storyboard
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-white/60">
              {projectDraft?.title
                ? `FrameForge AI is analyzing "${projectDraft.title}" and building a storyboard structure.`
                : "FrameForge AI is preparing your screenplay for storyboard generation."}
            </p>

            <div className="mt-10 rounded-2xl border border-white/10 bg-black/35 p-5 text-left">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm font-medium text-white/70">
                  {error || generationSteps[currentStep]}
                </p>
                <p className="text-sm text-white/40">{Math.round(progress)}%</p>
              </div>

              <div className="h-3 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className={`h-full rounded-full ${
                    error
                      ? "bg-red-400"
                      : "bg-gradient-to-r from-purple-500 to-pink-500"
                  }`}
                />
              </div>
            </div>

            <div className="mt-8 grid gap-3 text-left">
              {generationSteps.map((step, index) => (
                <div
                  key={step}
                  className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm transition ${
                    index <= currentStep
                      ? "border-purple-400/20 bg-purple-500/10 text-purple-100"
                      : "border-white/10 bg-white/[0.03] text-white/35"
                  }`}
                >
                  <div
                    className={`h-2.5 w-2.5 rounded-full ${
                      index <= currentStep ? "bg-purple-300" : "bg-white/20"
                    }`}
                  />
                  {step}
                </div>
              ))}
            </div>

            {error ? (
              <button
                onClick={() => router.push("/projects/new")}
                className="mt-8 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-white/90"
              >
                Back to Project Form
              </button>
            ) : (
              <p className="mt-8 text-sm text-white/40">
                Analyzing screenplay, scenes, shots, and visual prompts.
              </p>
            )}
          </motion.div>
        </section>
      </div>
    </main>
  );
}