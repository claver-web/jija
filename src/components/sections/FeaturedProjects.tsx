import React from "react";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { ArrowRight, ExternalLink, Terminal, Bot } from "lucide-react";
import { GithubIcon } from "@/components/ui/Icons";

function isImageFormat(url: string | null | undefined): boolean {
  if (!url) return false;
  if (/\.pdf($|\?)/i.test(url)) return false;
  return /\.(png|jpe?g|webp|gif|svg|avif)($|\?)/i.test(url) || url.startsWith("data:image/");
}

export async function FeaturedProjects() {
  let projects: Array<{
    id: string;
    title: string;
    slug: string;
    description: string;
    liveUrl: string | null;
    repoUrl: string | null;
    techStack: string[];
    category: string;
    thumbnail: string | null;
  }> = [];

  try {
    projects = await prisma.project.findMany({
      where: { featured: true },
      orderBy: { order: "asc" },
      take: 6,
    });

    if (projects.length === 0) {
      projects = await prisma.project.findMany({
        orderBy: { order: "asc" },
        take: 3,
      });
    }
  } catch (error) {
    console.error("Failed to fetch featured projects:", error);
  }

  return (
    <section id="projects" className="py-24 border-b border-neutral-200 dark:border-neutral-900">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-neutral-500 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-900 dark:bg-neutral-100" />
              Selected Engineering
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white">
              Featured Work
            </h2>
          </div>
          <Link
            href="/projects"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors"
          >
            <span>View all projects</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {projects.length === 0 ? (
          <div className="p-12 text-center border border-dashed border-neutral-300 dark:border-neutral-800 rounded-xl">
            <p className="text-neutral-500 text-sm">No featured projects found. Add projects from the admin panel.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                className="group relative flex flex-col justify-between rounded-xl border border-neutral-200 dark:border-neutral-800/80 bg-white dark:bg-neutral-950 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-neutral-900 dark:hover:border-neutral-100 hover:shadow-xl dark:hover:shadow-[0_0_25px_rgba(255,255,255,0.07)]"
              >
                <div>
                  {/* Category & Status */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono uppercase tracking-wider px-2 py-0.5 rounded border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300">
                      {project.category === "AGENTIC_AI" && <Bot className="w-3 h-3" />}
                      {project.category === "WEBSITE" && <Terminal className="w-3 h-3" />}
                      {project.category.replace("_", " ")}
                    </span>

                    <div className="flex items-center gap-2">
                      {project.repoUrl && (
                        <a
                          href={project.repoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-neutral-400 hover:text-black dark:hover:text-white transition-colors"
                          aria-label="Repository link"
                        >
                          <GithubIcon className="w-4 h-4" />
                        </a>
                      )}
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-neutral-400 hover:text-black dark:hover:text-white transition-colors"
                          aria-label="Live preview link"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Thumbnail if present */}
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

                  {/* Title */}
                  <h3 className="text-xl font-semibold tracking-tight text-neutral-900 dark:text-white mb-2 group-hover:text-neutral-700 dark:group-hover:text-neutral-200 transition-colors">
                    <Link href={`/projects/${project.slug}`}>{project.title}</Link>
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-3 leading-relaxed mb-6 font-normal">
                    {project.description}
                  </p>
                </div>

                <div>
                  {/* Tech stack badges */}
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

                  {/* Details Link */}
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
    </section>
  );
}

export default FeaturedProjects;
