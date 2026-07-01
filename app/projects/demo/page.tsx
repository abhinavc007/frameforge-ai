"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import AppNavbar from "@/components/AppNavbar";
import GradientBackground from "@/components/GradientBackground";

type Shot = {
  shotNumber: number;
  cameraAngle: string;
  description: string;
  visualPrompt: string;
};

type Scene = {
  sceneNumber: number;
  title: string;
  location: string;
  timeOfDay: string;
  mood: string;
  summary: string;
  shots: Shot[];
};

type GeneratedProject = {
  projectTitle: string;
  style: string;
  sceneCount: number;
  shotCount: number;
  panelCount: number;
  scenes: Scene[];
};

const fallbackProject: GeneratedProject = {
  projectTitle: "The Last Lantern",
  style: "Cinematic anime",
  sceneCount: 1,
  shotCount: 4,
  panelCount: 4,
  scenes: [
    {
      sceneNumber: 1,
      title: "Scene 1 - Rainy Village Road",
      location: "Village road",
      timeOfDay: "Night",
      mood: "Lonely, dramatic, mysterious",
      summary:
        "A young boy walks alone through heavy rain while a distant lantern flickers near an abandoned shrine.",
      shots: [
        {
          shotNumber: 1,
          cameraAngle: "Wide establishing shot",
          description: "Wide shot of the empty rainy village road.",
          visualPrompt:
            "Cinematic anime storyboard panel, rainy village road, dramatic lighting.",
        },
        {
          shotNumber: 2,
          cameraAngle: "Medium character shot",
          description: "Medium shot of the boy walking under a broken umbrella.",
          visualPrompt:
            "Cinematic anime storyboard panel, boy under umbrella, rainy atmosphere.",
        },
        {
          shotNumber: 3,
          cameraAngle: "Close-up emotional shot",
          description: "Close-up of the boy’s tired eyes as thunder flashes.",
          visualPrompt:
            "Cinematic anime storyboard panel, close-up emotional face, thunder light.",
        },
        {
          shotNumber: 4,
          cameraAngle: "Final transition shot",
          description: "Low-angle shot of the lantern flickering near the shrine.",
          visualPrompt:
            "Cinematic anime storyboard panel, glowing lantern near old shrine.",
        },
      ],
    },
  ],
};

export default function DemoProjectPage() {
  const [project, setProject] = useState<GeneratedProject>(fallbackProject);

  useEffect(() => {
    const savedGeneratedProject = sessionStorage.getItem(
      "frameforge-generated-project"
    );

    if (savedGeneratedProject) {
      setProject(JSON.parse(savedGeneratedProject));
    }
  }, []);

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
              {project.projectTitle}
            </h1>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/60">
              AI-generated scene breakdown, cinematic shot list, and{" "}
              {project.style.toLowerCase()} storyboard panel preview.
            </p>
          </motion.div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              { label: "Scenes", value: project.sceneCount },
              { label: "Shots", value: project.shotCount },
              { label: "Panels", value: project.panelCount },
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
          {project.scenes.map((scene) => (
            <motion.article
              key={`${scene.sceneNumber}-${scene.title}`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6 }}
              className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 md:p-8"
            >
              <div className="mb-8">
                <p className="mb-3 text-sm text-purple-300">
                  {scene.location} • {scene.timeOfDay} • {scene.mood}
                </p>

                <h2 className="text-2xl font-bold">{scene.title}</h2>

                <p className="mt-4 max-w-3xl leading-7 text-white/55">
                  {scene.summary}
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                {scene.shots.map((shot) => (
                  <div
                    key={`${scene.sceneNumber}-${shot.shotNumber}`}
                    className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.08] to-white/[0.03] p-4"
                  >
                    <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-purple-500/20 via-pink-500/10 to-blue-500/20 p-4">
                      <div className="flex h-full items-end rounded-xl bg-black/25 p-3">
                        <p className="text-xs text-white/45">
                          Panel {scene.sceneNumber}.{shot.shotNumber}
                        </p>
                      </div>
                    </div>

                    <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-purple-300/80">
                      {shot.cameraAngle}
                    </p>

                    <p className="mt-3 text-sm leading-6 text-white/65">
                      {shot.description}
                    </p>

                    <div className="mt-5 rounded-2xl border border-white/10 bg-black/30 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/35">
                        Visual Prompt
                      </p>
                      <p className="mt-2 text-xs leading-5 text-white/45">
                        {shot.visualPrompt}
                      </p>
                    </div>

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