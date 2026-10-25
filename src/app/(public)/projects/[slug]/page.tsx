import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import { ArrowLeft, ExternalLink, Bot, Terminal, Sparkles, CheckCircle2, Clock, Calendar } from "lucide-react";
import { GithubIcon } from "@/components/ui/Icons";

interface ProjectDetailProps {
  params: {
    slug: string;
  };
}

function isImageFormat(url: string | null | undefined): boolean {
  if (!url) return false;
  if (/\.pdf($|\?)/i.test(url)) return false;
  return /\.(png|jpe?g|webp|gif|svg|avif)($|\?)/i.test(url) || url.startsWith("data:image/");
}

export const revalidate = 3600; // ISR 1 hour

export async function generateStaticParams() {
  try {
    const projects = await prisma.project.findMany({
      select: { slug: true },
    });
    return projects.map((p: any) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: ProjectDetailProps): Promise<Metadata> {
  const project = await prisma.project.findUnique({
    where: { slug: params.slug },
  });

  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  return {
    title: `${project.title} — Architecture & Technical Case Study`,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      type: "article",
      images: project.thumbnail ? [{ url: project.thumbnail }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.description,
      images: project.thumbnail ? [project.thumbnail] : [],
    },
  };
}

export default async function ProjectDetailPage({ params }: ProjectDetailProps) {
  const project = await prisma.project.findUnique({
    where: { slug: params.slug },
  });

  if (!project) {
    notFound();
  }

  const defaultReadme = `# ${project.title}\n\n${project.description}\n\n## Tech Stack\n${project.techStack
    .map((t) => `- ${t}`)
    .join("\n")}\n\n## Overview\nDetailed architectural specifications and system diagrams will be displayed here.`;

  const readmeContent = project.readme || defaultReadme;

  return (
    <article className="py-16 md:py-24">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Back Link */}
        <div className="mb-8">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-xs font-mono text-neutral-500 hover:text-black dark:hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-x-1" />
            <span>BACK TO ALL PROJECTS</span>
          </Link>
        </div>

        {/* Header Meta */}
        <header className="mb-12 border-b border-neutral-200 dark:border-neutral-800 pb-10">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider px-2.5 py-1 rounded border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200">
              {project.category === "AGENTIC_AI" && <Bot className="w-3.5 h-3.5 text-emerald-400" />}
              {project.category === "WEBSITE" && <Terminal className="w-3.5 h-3.5 text-neutral-400" />}
              {project.category === "FUTURE" && <Sparkles className="w-3.5 h-3.5 text-amber-400" />}
              {project.category.replace("_", " ")}
            </span>

            <span className="inline-flex items-center gap-1 text-xs font-mono text-neutral-500">
              {project.status === "LIVE" ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Production Live</span>
                </>
              ) : project.status === "IN_PROGRESS" ? (
                <>
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                  <span>In Progress</span>
                </>
              ) : (
                <>
                  <Calendar className="w-3.5 h-3.5 text-blue-500" />
                  <span>Planned Architecture</span>
                </>
              )}
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-neutral-950 dark:text-white mb-6">
            {project.title}
          </h1>

          <p className="text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed mb-8 font-normal">
            {project.description}
          </p>

          {/* Action Links & Tech Badges */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-4 border-t border-neutral-200/60 dark:border-neutral-900">
            <div className="flex flex-wrap gap-1.5">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="text-xs font-mono px-2.5 py-1 rounded bg-neutral-100 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-800"
                >
                  {tech}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-3">
              {project.repoUrl && (
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 text-xs font-medium hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors"
                >
                  <GithubIcon className="w-4 h-4" />
                  <span>Source Code</span>
                </a>
              )}
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-black text-white dark:bg-white dark:text-black text-xs font-medium hover:opacity-90 transition-opacity"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Live Preview</span>
                </a>
              )}
            </div>
          </div>
        </header>

        {/* Thumbnail Hero if available */}
        {project.thumbnail && isImageFormat(project.thumbnail) && (
          <div className="relative w-full h-80 sm:h-96 rounded-xl overflow-hidden mb-12 border border-neutral-200 dark:border-neutral-800">
            <Image
              src={project.thumbnail}
              alt={project.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Markdown Content */}
        <section className="prose prose-neutral dark:prose-invert max-w-none prose-headings:tracking-tight prose-headings:font-bold prose-a:text-neutral-900 dark:prose-a:text-white prose-pre:bg-neutral-950 prose-pre:border prose-pre:border-neutral-800">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight, rehypeRaw]}
          >
            {readmeContent}
          </ReactMarkdown>
        </section>
      </div>
    </article>
  );
}
