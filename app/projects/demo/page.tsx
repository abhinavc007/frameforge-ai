"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import AppNavbar from "@/components/AppNavbar";
import GradientBackground from "@/components/GradientBackground";

type Shot = {
  shotNumber: number;
  cameraAngle: string;
  description: string;
  caption?: string;
  visualPrompt: string;
  negativePrompt?: string;
  styleNotes?: string;
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

const defaultNegativePrompt =
  "blurry, low quality, distorted face, bad anatomy, extra limbs, extra fingers, messy hands, unreadable text, watermark, logo, random letters, photorealistic, ugly composition, cropped subject";

function getImagesStorageKey(projectTitle: string) {
  const safeTitle =
    projectTitle
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "untitled-project";

  return `frameforge-generated-images-${safeTitle}`;
}

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
          caption:
            "A young boy walks alone through the empty rainy village road.",
          visualPrompt:
            "Cinematic anime storyboard panel, rainy village road, dramatic lighting.",
          negativePrompt: defaultNegativePrompt,
          styleNotes: "Cinematic anime storyboard style with dramatic mood.",
        },
        {
          shotNumber: 2,
          cameraAngle: "Medium character shot",
          description: "Medium shot of the boy walking under a broken umbrella.",
          caption:
            "The boy walks forward under a broken umbrella as rain falls around him.",
          visualPrompt:
            "Cinematic anime storyboard panel, boy under umbrella, rainy atmosphere.",
          negativePrompt: defaultNegativePrompt,
          styleNotes: "Cinematic anime storyboard style with dramatic mood.",
        },
        {
          shotNumber: 3,
          cameraAngle: "Close-up emotional shot",
          description: "Close-up of the boy’s tired eyes as thunder flashes.",
          caption:
            "Thunder flashes across the sky as the boy’s tired eyes reveal his fear.",
          visualPrompt:
            "Cinematic anime storyboard panel, close-up emotional face, thunder light.",
          negativePrompt: defaultNegativePrompt,
          styleNotes: "Cinematic anime storyboard style with dramatic mood.",
        },
        {
          shotNumber: 4,
          cameraAngle: "Final transition shot",
          description:
            "Low-angle shot of the lantern flickering near the shrine.",
          caption:
            "A distant lantern flickers near the abandoned shrine, pulling him forward.",
          visualPrompt:
            "Cinematic anime storyboard panel, glowing lantern near old shrine.",
          negativePrompt: defaultNegativePrompt,
          styleNotes: "Cinematic anime storyboard style with dramatic mood.",
        },
      ],
    },
  ],
};

export default function DemoProjectPage() {
  const [project, setProject] = useState<GeneratedProject>(fallbackProject);
  const [generatedImages, setGeneratedImages] = useState<Record<string, string>>(
    {}
  );
  const [generatingPanelKey, setGeneratingPanelKey] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const savedGeneratedProject = sessionStorage.getItem(
      "frameforge-generated-project"
    );

    if (savedGeneratedProject) {
      setProject(JSON.parse(savedGeneratedProject));
    }
  }, []);

  useEffect(() => {
    const savedImages = sessionStorage.getItem(
      getImagesStorageKey(project.projectTitle)
    );

    if (!savedImages) {
      setGeneratedImages({});
      return;
    }

    try {
      setGeneratedImages(JSON.parse(savedImages));
    } catch {
      setGeneratedImages({});
    }
  }, [project.projectTitle]);

  async function generatePanelImage(sceneNumber: number, shot: Shot) {
    const panelKey = `${sceneNumber}-${shot.shotNumber}`;

    try {
      setErrorMessage("");
      setGeneratingPanelKey(panelKey);

      const response = await fetch("/api/generate-panel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          visualPrompt: shot.visualPrompt,
          negativePrompt: shot.negativePrompt || defaultNegativePrompt,
          seed: sceneNumber * 1000 + shot.shotNumber,
        }),
      });

      if (!response.ok) {
        throw new Error("Image generation failed.");
      }

      const data = await response.json();

      setGeneratedImages((currentImages) => {
        const updatedImages = {
          ...currentImages,
          [panelKey]: data.imageUrl,
        };

        try {
          sessionStorage.setItem(
            getImagesStorageKey(project.projectTitle),
            JSON.stringify(updatedImages)
          );
        } catch {
          console.warn("Could not save generated images to sessionStorage.");
        }

        return updatedImages;
      });
    } catch {
      setErrorMessage(
        "Panel generation failed. Please check your connection and try again."
      );
    } finally {
      setGeneratingPanelKey("");
    }
  }

  const storyboardPanels = project.scenes.flatMap((scene) =>
    scene.shots.map((shot) => ({
      sceneNumber: scene.sceneNumber,
      shot,
    }))
  );

  const gridClass =
    storyboardPanels.length <= 2
      ? "mx-auto grid max-w-5xl gap-6 md:grid-cols-2 md:gap-8"
      : "grid gap-6 md:grid-cols-2 xl:grid-cols-4 md:gap-8";

  return (
    <main className="min-h-screen bg-black text-white">
      <GradientBackground />

      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-6">
        <AppNavbar
          secondaryHref="/dashboard"
          secondaryLabel="Dashboard"
          ctaHref="/projects/new"
          ctaLabel="New Project"
        />

        <section className="py-7 sm:py-12">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <p className="mx-auto mb-5 w-fit rounded-full border border-purple-400/20 bg-purple-400/10 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-purple-200/80 sm:text-xs">
              Storyboard Preview
            </p>

            <h1 className="mx-auto max-w-5xl text-4xl font-black tracking-tight sm:text-5xl md:text-7xl">
              {project.projectTitle}
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-white/50 sm:text-base sm:leading-7">
              Read each caption, then generate the panels you want to visualize.
            </p>

            {errorMessage ? (
              <div className="mx-auto mt-6 max-w-2xl rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">
                {errorMessage}
              </div>
            ) : null}
          </motion.div>
        </section>

        <section className="pb-16 sm:pb-24">
          <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.035] p-3 shadow-2xl shadow-black/40 sm:rounded-[2rem] sm:p-5 md:p-8">
            <div className={gridClass}>
              {storyboardPanels.map(({ sceneNumber, shot }, index) => {
                const panelKey = `${sceneNumber}-${shot.shotNumber}`;
                const imageUrl = generatedImages[panelKey];
                const isGenerating = generatingPanelKey === panelKey;

                return (
                  <motion.article
                    key={panelKey}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.5, delay: index * 0.04 }}
                    className="rounded-[1.5rem] border border-white/10 bg-[#111111]/90 p-3 shadow-xl shadow-black/30 sm:rounded-[1.75rem] sm:p-4"
                  >
                    <div className="overflow-hidden rounded-[1.15rem] border border-white/15 bg-neutral-900 sm:rounded-[1.25rem]">
                      <div className="aspect-[16/10] bg-gradient-to-br from-purple-500/20 via-pink-500/10 to-blue-500/20 sm:aspect-[4/3]">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={`Generated panel ${sceneNumber}.${shot.shotNumber}`}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center p-6 text-center">
                            <div>
                              <div className="mx-auto mb-4 h-10 w-10 rounded-full border border-white/10 bg-white/5" />
                              <p className="text-sm leading-6 text-white/45">
                                {isGenerating
                                  ? "Generating storyboard image..."
                                  : "Generate this panel to preview the storyboard image."}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-3 rounded-[1rem] border border-black/10 bg-[#f4efe3] p-4 text-black shadow-lg shadow-black/20 sm:mt-4 sm:rounded-[1.15rem]">
                      <p className="text-[14px] font-medium leading-7 sm:text-[15px]">
                        {shot.caption || shot.description}
                      </p>
                    </div>

                    <button
                      onClick={() => generatePanelImage(sceneNumber, shot)}
                      disabled={isGenerating}
                      className="mt-5 w-full rounded-full border border-white/15 bg-white px-4 py-3 text-sm font-bold text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isGenerating
                        ? "Generating..."
                        : imageUrl
                          ? "Regenerate Panel"
                          : "Generate Panel"}
                    </button>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}