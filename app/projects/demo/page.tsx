"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import GradientBackground from "@/components/GradientBackground";
import AppNavbar from "@/components/AppNavbar";

type ProjectDraft = {
  title: string;
  screenplay: string;
  style: string;
  characterNotes: string;
  createdAt: string;
};

const scenes = [
  {
    title: "Scene 1 — Rainy Village Road",
    location: "Village road",
    mood: "Lonely, dramatic, mysterious",
    summary:
      "A young boy walks alone through heavy rain while a distant lantern flickers near an abandoned shrine.",
    shots: [
      "Wide shot of the empty rainy village road.",
      "Medium shot of the boy walking under a broken umbrella.",
      "Close-up of the boy’s tired eyes as thunder flashes.",
      "Low-angle shot of the lantern flickering near the shrine.",
    ],
  },
  {
    title: "Scene 2 — Abandoned Shrine",
    location: "Old shrine",
    mood: "Suspenseful, spiritual, cinematic",
    summary:
      "The boy approaches the shrine and notices the lantern glowing brighter as if reacting to his presence.",
    shots: [
      "Establishing shot of the shrine hidden behind rain and mist.",
      "Over-the-shoulder shot of the boy looking at the lantern.",
      "Close-up of the lantern flame turning blue.",
      "Wide shot of shadows moving behind the shrine gate.",
    ],
  },
];

export default function DemoProjectPage() {
  const [projectDraft, setProjectDraft] = useState<ProjectDraft | null>(null);

useEffect(() => {
  const savedProject = sessionStorage.getItem("frameforge-current-project");

  if (savedProject) {
    setProjectDraft(JSON.parse(savedProject));
  }
}, []);

const projectTitle = projectDraft?.title || "The Last Lantern";
const projectStyle = projectDraft?.style || "Cinematic anime";
    
  return (
    <main className="min-h-screen bg-black text-white">
      <GradientBackground />
      <div className="mx-auto max-w-7xl px-6 py-6">
        <AppNavbar
  secondaryHref="/dashboard"
  secondaryLabel="Dashboard"
  ctaHref="/projects/new"
  ctaLabel="New Project"
/>

        <section className="py-12">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="mb-4 inline-flex rounded-full border border-green-400/30 bg-green-400/10 px-4 py-2 text-sm text-green-200">
              Storyboard Generated
            </p>

            <h1 className="max-w-4xl text-4xl font-black tracking-tight md:text-5xl">
              {projectTitle}
            </h1>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/60">
              AI-generated scene breakdown, cinematic shot list, and {projectStyle.toLowerCase()}
              storyboard panel preview.
            </p>
          </motion.div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              { label: "Scenes", value: "2" },
              { label: "Shots", value: "8" },
              { label: "Panels", value: "8" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-3xl border border-white/10 bg-white/[0.04] p-6"
              >
                <p className="text-sm text-white/50">{stat.label}</p>
                <p className="mt-4 text-4xl font-black">{stat.value}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-8 pb-20">
          {scenes.map((scene, sceneIndex) => (
            <motion.article
              key={scene.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6 }}
              className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 md:p-8"
            >
              <div className="mb-8">
                <p className="mb-3 text-sm text-purple-300">
                  {scene.location} • {scene.mood}
                </p>
                <h2 className="text-2xl font-bold">{scene.title}</h2>
                <p className="mt-4 max-w-3xl leading-7 text-white/55">
                  {scene.summary}
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                {scene.shots.map((shot, shotIndex) => (
                  <div
                    key={shot}
                    className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.08] to-white/[0.03] p-4"
                  >
                    <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-purple-500/20 via-pink-500/10 to-blue-500/20 p-4">
                      <div className="flex h-full items-end rounded-xl bg-black/25 p-3">
                        <p className="text-xs text-white/45">
                          Panel {sceneIndex + 1}.{shotIndex + 1}
                        </p>
                      </div>
                    </div>

                    <p className="mt-4 text-sm leading-6 text-white/65">
                      {shot}
                    </p>

                    <button className="mt-5 w-full rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white/70 transition hover:text-white">
                      Regenerate Panel
                    </button>
                  </div>
                ))}
              </div>
            </motion.article>
          ))}
        </section>
      </div>
    </main>
  );
}