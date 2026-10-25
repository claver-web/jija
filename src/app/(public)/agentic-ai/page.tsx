import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ProjectCategory } from "@prisma/client";
import { Bot, Cpu, Sparkles, ExternalLink, ArrowRight, Zap, Network, ShieldCheck } from "lucide-react";
import { GithubIcon } from "@/components/ui/Icons";

export const metadata: Metadata = {
  title: "Autonomous Agentic AI Systems",
  description: "Production-ready autonomous AI agents, tool-augmented cognitive pipelines, and multi-agent coordination frameworks.",
};

export const revalidate = 60;

function isImageFormat(url: string | null | undefined): boolean {
  if (!url) return false;
  if (/\.pdf($|\?)/i.test(url)) return false;
  return /\.(png|jpe?g|webp|gif|svg|avif)($|\?)/i.test(url) || url.startsWith("data:image/");
}

export default async function AgenticAIPage() {
  let projects: Array<{
    id: string;
    title: string;
    slug: string;
    description: string;
    liveUrl: string | null;
    repoUrl: string | null;
    techStack: string[];
    thumbnail: string | null;
  }> = [];

  try {
    projects = await prisma.project.findMany({
      where: { category: ProjectCategory.AGENTIC_AI },
      orderBy: { order: "asc" },
    });
  } catch (error) {
    console.error("Failed to fetch agentic AI projects:", error);
  }

  return (
    <div className="py-16 md:py-24">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Agentic AI Hero Section */}
        <section className="mb-20 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-950/60 p-8 sm:p-12 lg:p-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-neutral-300/30 dark:bg-neutral-800/30 rounded-full blur-[120px] pointer-events-none" />

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs font-mono text-neutral-800 dark:text-neutral-200 mb-6 shadow-sm">
              <Bot className="w-3.5 h-3.5 text-emerald-500" />
              <span>Specialized Autonomous Intelligence</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-neutral-950 dark:text-white mb-6">
              Deterministic Engineering for Non-Deterministic Models
            </h1>

            <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed mb-10">
              Moving beyond basic prompt engineering to create robust autonomous agent loops, deterministic verification harnesses, persistent memory graphs, and high-concurrency tool execution.
            </p>

            {/* Architecture Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-neutral-200 dark:border-neutral-800">
              <div className="flex items-start gap-3">
                <Network className="w-5 h-5 text-neutral-800 dark:text-neutral-200 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">Multi-Agent Swarms</h4>
                  <p className="text-xs text-neutral-500 mt-1">Hierarchical delegation with deterministic rollback state.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Zap className="w-5 h-5 text-neutral-800 dark:text-neutral-200 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">Tool Invocation</h4>
                  <p className="text-xs text-neutral-500 mt-1">Type-safe schema execution and sandboxed environments.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-neutral-800 dark:text-neutral-200 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">Self-Reflection</h4>
                  <p className="text-xs text-neutral-500 mt-1">Automated test generation and iterative repair loops.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Projects Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
              Agentic Systems Catalog
            </h2>
            <p className="text-sm text-neutral-500 mt-1">
              Active frameworks, orchestration engines, and autonomous tools.
            </p>
          </div>
        </div>

        {/* Project Cards */}
        {projects.length === 0 ? (
          <div className="p-16 text-center border border-dashed border-neutral-300 dark:border-neutral-800 rounded-xl">
            <p className="text-neutral-500 text-sm">
              No Agentic AI projects found yet. You can add them anytime in the admin dashboard!
            </p>
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
                      <Bot className="w-3 h-3 text-emerald-400" />
                      Agentic AI
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

                  <h3 className="text-xl font-semibold tracking-tight text-neutral-900 dark:text-white mb-2 group-hover:text-neutral-700 dark:group-hover:text-neutral-200 transition-colors">
                    <Link href={`/projects/${project.slug}`}>{project.title}</Link>
                  </h3>

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
    </div>
  );
}
