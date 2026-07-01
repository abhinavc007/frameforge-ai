"use client";

import Link from "next/link";
import { motion } from "framer-motion";

type ProjectStatus = "Completed" | "Processing" | "Draft";

type Project = {
  title: string;
  status: ProjectStatus;
  scenes: number;
  panels: number;
  updated: string;
  description: string;
};

const projects: Project[] = [
  {
    title: "The Last Lantern",
    status: "Completed",
    scenes: 6,
    panels: 24,
    updated: "2 hours ago",
    description: "A rainy village story about a boy searching for a lost light.",
  },
  {
    title: "Neon Samurai",
    status: "Processing",
    scenes: 4,
    panels: 12,
    updated: "Today",
    description: "A cyberpunk anime sequence with action-heavy storyboard shots.",
  },
  {
    title: "Moonlit Classroom",
    status: "Draft",
    scenes: 2,
    panels: 0,
    updated: "Yesterday",
    description: "A quiet emotional scene between two students after school.",
  },
];

const statusStyles: Record<ProjectStatus, string> = {
  Completed: "bg-green-400/10 text-green-300 border-green-400/20",
  Processing: "bg-blue-400/10 text-blue-300 border-blue-400/20",
  Draft: "bg-yellow-400/10 text-yellow-300 border-yellow-400/20",
};

export default function DashboardPage() {
  const totalProjects = projects.length;
  const completedProjects = projects.filter(
    (project) => project.status === "Completed"
  ).length;
  const processingProjects = projects.filter(
    (project) => project.status === "Processing"
  ).length;
  const draftProjects = projects.filter(
    (project) => project.status === "Draft"
  ).length;

  const stats = [
    { label: "Total Projects", value: totalProjects },
    { label: "Completed", value: completedProjects },
    { label: "Processing", value: processingProjects },
    { label: "Drafts", value: draftProjects },
  ];

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,#7c3aed44,transparent_30%),radial-gradient(circle_at_top_right,#ec489944,transparent_30%),radial-gradient(circle_at_bottom,#2563eb33,transparent_35%)]" />

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
              href="/"
              className="hidden rounded-full border border-white/15 px-5 py-2 text-sm text-white/70 transition hover:text-white sm:block"
            >
              Home
            </Link>
            <button className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-black transition hover:bg-white/90">
              New Project
            </button>
          </div>
        </motion.nav>

        <section className="py-12">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end"
          >
            <div>
              <p className="mb-4 inline-flex rounded-full border border-purple-400/30 bg-purple-400/10 px-4 py-2 text-sm text-purple-200">
                Creator Dashboard
              </p>

              <h1 className="max-w-3xl text-4xl font-black tracking-tight md:text-5xl">
                Manage your anime storyboard projects
              </h1>

              <p className="mt-5 max-w-2xl text-lg leading-8 text-white/60">
                Create projects, track storyboard generation, and continue
                building visual sequences from your screenplays.
              </p>
            </div>

            <button className="rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-4 font-semibold transition-transform duration-300 hover:scale-[1.03]">
              Create New Project
            </button>
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
            className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
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
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Recent Projects</h2>
              <p className="mt-2 text-sm text-white/50">
                Your latest storyboard projects and generation progress.
              </p>
            </div>
          </div>

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
            {projects.map((project) => (
              <motion.article
                key={project.title}
                variants={{
                  hidden: { opacity: 0, y: 20, scale: 0.98 },
                  visible: { opacity: 1, y: 0, scale: 1 },
                }}
                whileHover={{ y: -4 }}
                className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.08] to-white/[0.03] p-6"
              >
                <div className="mb-6 h-36 rounded-2xl border border-white/10 bg-gradient-to-br from-purple-500/20 via-pink-500/10 to-blue-500/20 p-4">
                  <div className="grid h-full grid-cols-2 gap-3">
                    {[1, 2, 3, 4].map((item) => (
                      <div
                        key={item}
                        className="rounded-xl bg-black/30 ring-1 ring-white/10"
                      />
                    ))}
                  </div>
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

                <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-2xl bg-black/30 p-4">
                    <p className="text-white/40">Scenes</p>
                    <p className="mt-1 text-xl font-bold">{project.scenes}</p>
                  </div>
                  <div className="rounded-2xl bg-black/30 p-4">
                    <p className="text-white/40">Panels</p>
                    <p className="mt-1 text-xl font-bold">{project.panels}</p>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-5">
                  <p className="text-xs text-white/40">
                    Updated {project.updated}
                  </p>
                  <button className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white/75 transition hover:text-white">
                    Open
                  </button>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </section>
      </div>
    </main>
  );
}