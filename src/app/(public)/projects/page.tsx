import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ProjectCategory } from "@prisma/client";
import { ExternalLink, Terminal, Bot, Sparkles, ArrowRight } from "lucide-react";
import { GithubIcon } from "@/components/ui/Icons";
import { GitHubReposSection } from "@/components/sections/GitHubReposSection";

export const metadata: Metadata = {
  title: "Projects & Architecture",
  description: "Explore engineering case studies, full-stack systems, and autonomous agentic workflows.",
};

const CATEGORIES = [
  { key: "ALL", label: "All Projects" },
  { key: "WEBSITE", label: "Websites & Platforms" },
  { key: "AGENTIC_AI", label: "Agentic AI" },
  { key: "FUTURE", label: "Future Concepts" },
];

function isImageFormat(url: string | null | undefined): boolean {
  if (!url) return false;
  if (/\.pdf($|\?)/i.test(url)) return false;
  return /\.(png|jpe?g|webp|gif|svg|avif)($|\?)/i.test(url) || url.startsWith("data:image/");
}

export const revalidate = 60;

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const selectedCategory = searchParams.category?.toUpperCase() || "ALL";

  let whereClause = {};
  if (selectedCategory !== "ALL" && Object.values(ProjectCategory).includes(selectedCategory as ProjectCategory)) {
    whereClause = { category: selectedCategory as ProjectCategory };
  }

  let projects: Array<{
    id: string;
    title: string;
    slug: string;
    description: string;
    liveUrl: string | null;
    repoUrl: string | null;
    techStack: string[];
    category: string;
    status: string;
    featured: boolean;
    thumbnail: string | null;
  }> = [];

  try {
    projects = await prisma.project.findMany({
      where: whereClause,
      orderBy: { order: "asc" },
    });
  } catch (error) {
    console.error("Failed to load projects:", error);
  }

  return (
    <div className="py-16 md:py-24">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="max-w-2xl mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-neutral-500 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-900 dark:bg-neutral-100" />
            Engineering Index
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-neutral-950 dark:text-white mb-4">
            Systems & Projects
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 text-base sm:text-lg">
            A comprehensive catalog of autonomous agents, distributed systems, and modern web applications with in-depth technical documentation.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-12 border-b border-neutral-200 dark:border-neutral-800 pb-4">
          {CATEGORIES.map((cat) => {
            const isActive =
              cat.key === selectedCategory ||
              (cat.key === "ALL" && (!searchParams.category || selectedCategory === "ALL"));

            const href = cat.key === "ALL" ? "/projects" : `/projects?category=${cat.key}`;

            return (
              <Link
                key={cat.key}
                href={href}
                className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-black text-white dark:bg-white dark:text-black shadow-sm"
                    : "bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white hover:bg-neutral-200 dark:hover:bg-neutral-800"
                }`}
              >
                {cat.label}
              </Link>
            );
          })}
        </div>

        {/* Projects Grid */}
        {projects.length === 0 ? (
          <div className="p-16 text-center border border-dashed border-neutral-300 dark:border-neutral-800 rounded-xl bg-neutral-50/50 dark:bg-neutral-950/50">
            <p className="text-neutral-500 text-sm">No projects found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                className="group relative flex flex-col justify-between rounded-xl border border-neutral-200 dark:border-neutral-800/80 bg-white dark:bg-neutral-950 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-neutral-900 dark:hover:border-neutral-100 hover:shadow-xl dark:hover:shadow-[0_0_25px_rgba(255,255,255,0.06)]"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider px-2 py-0.5 rounded border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300">
                      {project.category === "AGENTIC_AI" && <Bot className="w-3 h-3 text-emerald-400" />}
                      {project.category === "WEBSITE" && <Terminal className="w-3 h-3 text-neutral-400" />}
                      {project.category === "FUTURE" && <Sparkles className="w-3 h-3 text-amber-400" />}
                      {project.category.replace("_", " ")}
                    </span>

                    <div className="flex items-center gap-2">
                      {project.repoUrl && (
                        <a
                          href={project.repoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-neutral-400 hover:text-black dark:hover:text-white transition-colors p-1"
                          aria-label="Repository"
                        >
                          <GithubIcon className="w-4 h-4" />
                        </a>
                      )}
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-neutral-400 hover:text-black dark:hover:text-white transition-colors p-1"
                          aria-label="Live Demo"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>

                  {project.thumbnail && isImageFormat(project.thumbnail) && (
                    <div className="relative w-full h-44 mb-4 rounded-lg overflow-hidden border border-neutral-100 dark:border-neutral-800">
                      <Image
                        src={project.thumbnail}
                        alt={project.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}

                  <h2 className="text-xl font-semibold tracking-tight text-neutral-900 dark:text-white mb-2 group-hover:text-neutral-700 dark:group-hover:text-neutral-200 transition-colors">
                    <Link href={`/projects/${project.slug}`}>{project.title}</Link>
                  </h2>

                  <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-3 leading-relaxed mb-6 font-normal">
                    {project.description}
                  </p>
                </div>

                <div>
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {project.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="text-[11px] font-mono px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border border-neutral-200/60 dark:border-neutral-800/60"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <Link
                    href={`/projects/${project.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-mono text-neutral-900 dark:text-neutral-100 group-hover:underline underline-offset-4"
                  >
                    <span>Read Architecture Case Study</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <GitHubReposSection />
    </div>
  );
}
