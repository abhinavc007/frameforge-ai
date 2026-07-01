"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import GradientBackground from "@/components/GradientBackground";
import AppNavbar from "@/components/AppNavbar";

type ProjectStatus = "Completed" | "Processing" | "Draft";

type Project = {
  id: string;
  title: string;
  status: ProjectStatus;
  scenes: number;
  panels: number;
  updated: string;
  description: string;
};

const demoProjects: Project[] = [
  {
    id: "last-lantern",
    title: "The Last Lantern",
    status: "Completed",
    scenes: 6,
    panels: 24,
    updated: "2 hours ago",
    description: "A rainy village story about a boy searching for a lost light.",
  },
  {
    id: "neon-samurai",
    title: "Neon Samurai",
    status: "Processing",
    scenes: 4,
    panels: 12,
    updated: "Today",
    description: "A cyberpunk anime sequence with action-heavy storyboard shots.",
  },
  {
    id: "moonlit-classroom",
    title: "Moonlit Classroom",
    status: "Draft",
    scenes: 2,
    panels: 0,
    updated: "Yesterday",
    description: "A quiet emotional scene between two students after school.",
  },
];

const dashboardSlides = [
  "/landing/shot1.png",
  "/landing/shot2.png",
  "/landing/shot3.png",
  "/landing/shot4.png",
];

const statusStyles: Record<ProjectStatus, string> = {
  Completed: "bg-green-400/10 text-green-300 border-green-400/20",
  Processing: "bg-blue-400/10 text-blue-300 border-blue-400/20",
  Draft: "bg-yellow-400/10 text-yellow-300 border-yellow-400/20",
};

const deletedProjectsStorageKey = "frameforge-deleted-dashboard-projects";

export default function DashboardPage() {
  const [deletedProjectIds, setDeletedProjectIds] = useState<string[]>([]);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const savedDeletedProjects = localStorage.getItem(deletedProjectsStorageKey);

    if (!savedDeletedProjects) {
      return;
    }

    try {
      setDeletedProjectIds(JSON.parse(savedDeletedProjects));
    } catch {
      setDeletedProjectIds([]);
    }
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveSlide((currentSlide) =>
        currentSlide === dashboardSlides.length - 1 ? 0 : currentSlide + 1
      );
    }, 3500);

    return () => window.clearInterval(interval);
  }, []);

  const visibleProjects = useMemo(
    () =>
      demoProjects.filter(
        (project) => !deletedProjectIds.includes(project.id)
      ),
    [deletedProjectIds]
  );

  const totalProjects = visibleProjects.length;
  const completedProjects = visibleProjects.filter(
    (project) => project.status === "Completed"
  ).length;
  const processingProjects = visibleProjects.filter(
    (project) => project.status === "Processing"
  ).length;
  const draftProjects = visibleProjects.filter(
    (project) => project.status === "Draft"
  ).length;

  const stats = [
    { label: "Total Projects", value: totalProjects },
    { label: "Completed", value: completedProjects },
    { label: "Processing", value: processingProjects },
    { label: "Drafts", value: draftProjects },
  ];

  function deleteProject(projectId: string) {
    const shouldDelete = window.confirm(
      "Delete this project from recent projects?"
    );

    if (!shouldDelete) {
      return;
    }

    setDeletedProjectIds((currentIds) => {
      const updatedIds = [...currentIds, projectId];

      localStorage.setItem(
        deletedProjectsStorageKey,
        JSON.stringify(updatedIds)
      );

      return updatedIds;
    });
  }

  function restoreProjects() {
    localStorage.removeItem(deletedProjectsStorageKey);
    setDeletedProjectIds([]);
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <GradientBackground />

      <div className="mx-auto max-w-7xl px-6 py-6">
        <AppNavbar
          secondaryHref="/"
          secondaryLabel="Home"
          ctaHref="/projects/new"
          ctaLabel="New Project"
        />

        <section className="py-10">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-black/40 md:p-10"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={dashboardSlides[activeSlide]}
                initial={{ opacity: 0, x: 90, scale: 1.04 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -90, scale: 1.04 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${dashboardSlides[activeSlide]})`,
                }}
              />
            </AnimatePresence>

            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/40" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#ec489944,transparent_35%)]" />

            <div className="relative z-10 flex min-h-[320px] flex-col justify-between gap-8 lg:flex-row lg:items-end">
              <div>
                <p className="mb-4 inline-flex rounded-full border border-purple-400/30 bg-purple-400/10 px-4 py-2 text-sm text-purple-100 backdrop-blur">
                  Creator Dashboard
                </p>

                <h1 className="max-w-3xl text-4xl font-black tracking-tight md:text-6xl">
                  Manage your anime storyboard projects
                </h1>

                <p className="mt-5 max-w-2xl text-lg leading-8 text-white/70">
                  Create projects, track storyboard generation, and continue
                  building visual sequences from your screenplays.
                </p>
              </div>

              <Link
                href="/projects/new"
                className="w-fit rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-4 text-center font-semibold transition-transform duration-300 hover:scale-[1.03]"
              >
                Create New Project
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.12,
                },
              },
            }}
            className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
          >
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                variants={{
                  hidden: { opacity: 0, y: 18 },
                  visible: { opacity: 1, y: 0 },
                }}
                className="rounded-3xl border border-white/10 bg-white/[0.04] p-6"
              >
                <p className="text-sm text-white/50">{stat.label}</p>
                <p className="mt-4 text-4xl font-black">{stat.value}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        <section className="pb-16">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold">Recent Projects</h2>
              <p className="mt-2 text-sm text-white/50">
                Your latest storyboard projects and generation progress.
              </p>
            </div>

            {deletedProjectIds.length > 0 ? (
              <button
                onClick={restoreProjects}
                className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white/70 transition hover:text-white"
              >
                Restore
              </button>
            ) : null}
          </div>

          {visibleProjects.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-10 text-center">
              <h3 className="text-2xl font-bold">No recent projects</h3>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-white/50">
                Deleted demo projects are hidden from your dashboard. Restore
                them or create a new storyboard project.
              </p>

              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <button
                  onClick={restoreProjects}
                  className="rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white/80 transition hover:text-white"
                >
                  Restore Projects
                </button>

                <Link
                  href="/projects/new"
                  className="rounded-full bg-white px-6 py-3 text-sm font-bold text-black transition hover:bg-white/90"
                >
                  Create New Project
                </Link>
              </div>
            </div>
          ) : (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: 0.12,
                  },
                },
              }}
              className="grid gap-6 lg:grid-cols-3"
            >
              {visibleProjects.map((project, projectIndex) => {
                const thumbnailIndex =
                  (activeSlide + projectIndex) % dashboardSlides.length;

                const thumbnailImage = dashboardSlides[thumbnailIndex];

                return (
                  <motion.article
                    key={project.id}
                    variants={{
                      hidden: { opacity: 0, y: 20, scale: 0.98 },
                      visible: { opacity: 1, y: 0, scale: 1 },
                    }}
                    whileHover={{ y: -4 }}
                    className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.08] to-white/[0.03] p-6"
                  >
                    <div className="mb-6 h-40 overflow-hidden rounded-2xl border border-white/10 bg-black/30">
                      <AnimatePresence mode="wait">
                        <motion.img
                          key={`${project.id}-${thumbnailImage}`}
                          src={thumbnailImage}
                          alt={`${project.title} preview`}
                          initial={{ opacity: 0, x: 60, scale: 1.04 }}
                          animate={{ opacity: 1, x: 0, scale: 1 }}
                          exit={{ opacity: 0, x: -60, scale: 1.04 }}
                          transition={{
                            duration: 0.65,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                          className="h-full w-full object-cover"
                        />
                      </AnimatePresence>
                    </div>

                    <div className="flex items-start justify-between gap-4">
                      <h3 className="text-xl font-bold">{project.title}</h3>

                      <span
                        className={`rounded-full border px-3 py-1 text-xs ${statusStyles[project.status]}`}
                      >
                        {project.status}
                      </span>
                    </div>

                    <p className="mt-3 min-h-16 text-sm leading-6 text-white/50">
                      {project.description}
                    </p>

                    

                    <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-5">
                      <p className="text-xs text-white/40">
                        Updated {project.updated}
                      </p>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => deleteProject(project.id)}
                          className="rounded-full border border-red-400/20 px-4 py-2 text-sm font-semibold text-red-200/70 transition hover:text-red-100"
                        >
                          Delete
                        </button>

                        <Link
                          href="/projects/demo"
                          className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white/75 transition hover:text-white"
                        >
                          Open
                        </Link>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </motion.div>
          )}
        </section>
      </div>
    </main>
  );
}