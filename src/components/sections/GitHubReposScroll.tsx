"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import type { GitHubRepo, RepoArchitectureDoc } from "@/lib/github";
import { GithubIcon } from "@/components/ui/Icons";
import {
  Star,
  GitFork,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  FolderGit2,
  LayoutGrid,
  Columns,
  Loader2,
  FileText,
  X,
  Copy,
  Check,
  ExternalLink,
  BookOpen,
  Sparkles,
} from "lucide-react";

interface GitHubReposScrollProps {
  initialRepos: GitHubRepo[];
  title?: string;
  subtitle?: string;
  badge?: string;
}

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f7df1e",
  Python: "#3572A5",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Rust: "#dea584",
  "C++": "#f34b7d",
  Shell: "#89e051",
  Dart: "#00B4AB",
};

export function GitHubReposScroll({
  initialRepos,
  title = "GitHub Repositories & Architecture Docs",
  subtitle = "Live engineering codebases with instant Architecture Documentation viewers, stars, and language telemetry.",
  badge = "Live Codebases & Architecture",
}: GitHubReposScrollProps) {
  const [repos, setRepos] = useState<GitHubRepo[]>(initialRepos);
  const [viewMode, setViewMode] = useState<"scroll" | "grid">("scroll");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("ALL");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialRepos.length >= 6);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Docs Modal State
  const [selectedRepoForDocs, setSelectedRepoForDocs] = useState<string | null>(null);
  const [docsData, setDocsData] = useState<RepoArchitectureDoc | null>(null);
  const [isLoadingDocs, setIsLoadingDocs] = useState(false);
  const [copiedClone, setCopiedClone] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Extract unique languages
  const languages = [
    "ALL",
    ...Array.from(new Set(repos.map((r) => r.language).filter(Boolean) as string[])),
  ];

  const filteredRepos = repos.filter((repo) => {
    if (selectedLanguage === "ALL") return true;
    return repo.language === selectedLanguage;
  });

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === "left" ? -380 : 380;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const loadMoreRepos = async () => {
    setIsLoadingMore(true);
    try {
      const nextPage = page + 1;
      const res = await fetch(`/api/github/repos?page=${nextPage}&limit=6`);
      const data = await res.json();

      if (data.repos && Array.isArray(data.repos)) {
        setRepos((prev) => {
          const existingIds = new Set(prev.map((r) => r.id));
          const newUnique = data.repos.filter((r: GitHubRepo) => !existingIds.has(r.id));
          return [...prev, ...newUnique];
        });
        setPage(nextPage);
        setHasMore(data.hasMore);
      }
    } catch (err) {
      console.error("Failed to load more repos:", err);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const openDocsModal = async (repoName: string) => {
    setSelectedRepoForDocs(repoName);
    setIsLoadingDocs(true);
    setDocsData(null);
    setCopiedClone(false);

    try {
      const res = await fetch(`/api/github/docs?repo=${encodeURIComponent(repoName)}`);
      const data = await res.json();
      setDocsData(data);
    } catch (err) {
      console.error("Failed to fetch doc:", err);
    } finally {
      setIsLoadingDocs(false);
    }
  };

  const closeDocsModal = () => {
    setSelectedRepoForDocs(null);
    setDocsData(null);
  };

  // Close modal on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDocsModal();
    };
    if (selectedRepoForDocs) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [selectedRepoForDocs]);

  const copyCloneCommand = (url: string) => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(`git clone ${url}.git`);
      setCopiedClone(true);
      setTimeout(() => setCopiedClone(false), 2500);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    } catch {
      return dateStr;
    }
  };

  return (
    <section className="py-24 border-b border-neutral-200 dark:border-neutral-900 bg-neutral-50/30 dark:bg-neutral-950/40 relative overflow-hidden">
      {/* Background ambient gradient */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-neutral-300/20 dark:bg-neutral-800/20 rounded-full blur-[140px] pointer-events-none" />

      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-neutral-500 mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              {badge}
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-950 dark:text-white">
              {title}
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1 max-w-xl">
              {subtitle}
            </p>
          </div>

          {/* Controls: View toggle & Scroll navigation */}
          <div className="flex items-center gap-3">
            {/* View Mode Toggle */}
            <div className="inline-flex rounded-lg border border-neutral-300 dark:border-neutral-800 p-1 bg-white dark:bg-neutral-900 text-xs shadow-sm">
              <button
                onClick={() => setViewMode("scroll")}
                className={`p-1.5 rounded-md transition-colors ${
                  viewMode === "scroll"
                    ? "bg-black text-white dark:bg-white dark:text-black shadow-sm"
                    : "text-neutral-500 hover:text-black dark:hover:text-white"
                }`}
                title="Horizontal Carousel View"
              >
                <Columns className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-md transition-colors ${
                  viewMode === "grid"
                    ? "bg-black text-white dark:bg-white dark:text-black shadow-sm"
                    : "text-neutral-500 hover:text-black dark:hover:text-white"
                }`}
                title="Grid Catalog View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>

            {/* Scroll buttons (Active in scroll view mode) */}
            {viewMode === "scroll" && (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => scroll("left")}
                  className="p-2.5 rounded-lg border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors shadow-sm"
                  aria-label="Scroll left"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => scroll("right")}
                  className="p-2.5 rounded-lg border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors shadow-sm"
                  aria-label="Scroll right"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Filter Pills */}
        {languages.length > 2 && (
          <div className="flex flex-wrap items-center gap-1.5 mb-8">
            {languages.map((lang) => (
              <button
                key={lang}
                onClick={() => setSelectedLanguage(lang)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                  selectedLanguage === lang
                    ? "bg-black text-white dark:bg-white dark:text-black font-semibold shadow-sm"
                    : "bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600"
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        )}

        {/* Repository Items Presentation */}
        {filteredRepos.length === 0 ? (
          <div className="p-16 text-center border border-dashed border-neutral-300 dark:border-neutral-800 rounded-xl bg-white dark:bg-neutral-950">
            <FolderGit2 className="w-8 h-8 text-neutral-400 mx-auto mb-3" />
            <p className="text-sm text-neutral-500">No repositories matching selected filter.</p>
          </div>
        ) : viewMode === "scroll" ? (
          /* Horizontal Parallax / Snap Scroll */
          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto pb-6 pt-2 scroll-smooth snap-x snap-mandatory no-scrollbar [mask-image:linear-gradient(to_right,black_85%,transparent)]"
            style={{ scrollbarWidth: "none" }}
          >
            {filteredRepos.map((repo, idx) => (
              <motion.div
                key={repo.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: Math.min(idx * 0.03, 0.25) }}
                className="w-[340px] sm:w-[380px] shrink-0 snap-start flex flex-col justify-between rounded-xl border border-neutral-200 dark:border-neutral-800/80 bg-white dark:bg-neutral-950 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-neutral-900 dark:hover:border-neutral-100 hover:shadow-xl dark:hover:shadow-[0_0_25px_rgba(255,255,255,0.06)]"
              >
                <div>
                  {/* Top Bar: Language & Links */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    {repo.language ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-mono text-neutral-700 dark:text-neutral-300 px-2.5 py-0.5 rounded border border-neutral-200 dark:border-neutral-800 bg-neutral-100/70 dark:bg-neutral-900">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{
                            backgroundColor: LANGUAGE_COLORS[repo.language] || "#71717a",
                          }}
                        />
                        <span>{repo.language}</span>
                      </span>
                    ) : (
                      <span className="text-[11px] font-mono text-neutral-400">Codebase</span>
                    )}

                    <div className="flex items-center gap-2">
                      <a
                        href={repo.htmlUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-neutral-400 hover:text-black dark:hover:text-white transition-colors p-1"
                        aria-label="View on GitHub"
                      >
                        <GithubIcon className="w-4 h-4" />
                      </a>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold tracking-tight text-neutral-950 dark:text-white mb-2 font-mono">
                    <a
                      href={repo.htmlUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline flex items-center justify-between"
                    >
                      <span className="truncate">{repo.name}</span>
                      <ArrowUpRight className="w-4 h-4 text-neutral-400 shrink-0 ml-1" />
                    </a>
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-3 leading-relaxed mb-4 font-normal min-h-[44px]">
                    {repo.description || "Open source software project and technical architecture."}
                  </p>

                  {/* Architecture Docs Button */}
                  <div className="mb-4">
                    <button
                      onClick={() => openDocsModal(repo.name)}
                      className="w-full inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/80 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-xs font-mono font-medium transition-colors shadow-sm hover:border-neutral-400 dark:hover:border-neutral-600"
                    >
                      <FileText className="w-3.5 h-3.5 text-neutral-500" />
                      <span>Architecture Docs</span>
                      <BookOpen className="w-3 h-3 text-neutral-400 ml-auto" />
                    </button>
                  </div>
                </div>

                <div>
                  {/* Topics badges */}
                  {repo.topics.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {repo.topics.slice(0, 3).map((topic) => (
                        <span
                          key={topic}
                          className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-900 text-neutral-500 border border-neutral-200/50 dark:border-neutral-800/50"
                        >
                          #{topic}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Footer Meta: Stars, Forks, Updated Date */}
                  <div className="flex items-center justify-between pt-3 border-t border-neutral-100 dark:border-neutral-900 text-xs font-mono text-neutral-500">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-neutral-400" />
                        <span>{repo.stars}</span>
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <GitFork className="w-3.5 h-3.5 text-neutral-400" />
                        <span>{repo.forks}</span>
                      </span>
                    </div>

                    <span className="text-[11px] text-neutral-400">
                      {formatDate(repo.updatedAt)}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          /* Grid View Mode */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRepos.map((repo, idx) => (
              <motion.div
                key={repo.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: Math.min(idx * 0.03, 0.25) }}
                className="flex flex-col justify-between rounded-xl border border-neutral-200 dark:border-neutral-800/80 bg-white dark:bg-neutral-950 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-neutral-900 dark:hover:border-neutral-100 hover:shadow-xl dark:hover:shadow-[0_0_25px_rgba(255,255,255,0.06)]"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    {repo.language ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-mono text-neutral-700 dark:text-neutral-300 px-2.5 py-0.5 rounded border border-neutral-200 dark:border-neutral-800 bg-neutral-100/70 dark:bg-neutral-900">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{
                            backgroundColor: LANGUAGE_COLORS[repo.language] || "#71717a",
                          }}
                        />
                        <span>{repo.language}</span>
                      </span>
                    ) : (
                      <span className="text-[11px] font-mono text-neutral-400">Codebase</span>
                    )}

                    <a
                      href={repo.htmlUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-neutral-400 hover:text-black dark:hover:text-white transition-colors p-1"
                      aria-label="View on GitHub"
                    >
                      <GithubIcon className="w-4 h-4" />
                    </a>
                  </div>

                  <h3 className="text-lg font-bold tracking-tight text-neutral-950 dark:text-white mb-2 font-mono">
                    <a
                      href={repo.htmlUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline flex items-center justify-between"
                    >
                      <span className="truncate">{repo.name}</span>
                      <ArrowUpRight className="w-4 h-4 text-neutral-400 shrink-0 ml-1" />
                    </a>
                  </h3>

                  <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-3 leading-relaxed mb-4 font-normal min-h-[44px]">
                    {repo.description || "Open source software project and technical architecture."}
                  </p>

                  {/* Architecture Docs Button */}
                  <div className="mb-4">
                    <button
                      onClick={() => openDocsModal(repo.name)}
                      className="w-full inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/80 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-xs font-mono font-medium transition-colors shadow-sm hover:border-neutral-400 dark:hover:border-neutral-600"
                    >
                      <FileText className="w-3.5 h-3.5 text-neutral-500" />
                      <span>Architecture Docs</span>
                      <BookOpen className="w-3 h-3 text-neutral-400 ml-auto" />
                    </button>
                  </div>
                </div>

                <div>
                  {repo.topics.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {repo.topics.slice(0, 3).map((topic) => (
                        <span
                          key={topic}
                          className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-900 text-neutral-500 border border-neutral-200/50 dark:border-neutral-800/50"
                        >
                          #{topic}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-3 border-t border-neutral-100 dark:border-neutral-900 text-xs font-mono text-neutral-500">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-neutral-400" />
                        <span>{repo.stars}</span>
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <GitFork className="w-3.5 h-3.5 text-neutral-400" />
                        <span>{repo.forks}</span>
                      </span>
                    </div>

                    <span className="text-[11px] text-neutral-400">
                      {formatDate(repo.updatedAt)}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Load More Button */}
        {hasMore && (
          <div className="mt-12 text-center">
            <button
              onClick={loadMoreRepos}
              disabled={isLoadingMore}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 text-xs font-mono hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-sm disabled:opacity-50"
            >
              {isLoadingMore ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Loading additional repositories...</span>
                </>
              ) : (
                <>
                  <FolderGit2 className="w-4 h-4 text-neutral-400" />
                  <span>Load More Repositories ({repos.length} loaded)</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Architecture Documentation Modal */}
      <AnimatePresence>
        {selectedRepoForDocs && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-4xl max-h-[90vh] rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Modal Top Bar */}
              <div className="p-6 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between gap-4 bg-neutral-50/50 dark:bg-neutral-900/40">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 rounded-lg bg-black text-white dark:bg-white dark:text-black">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold font-mono tracking-tight text-neutral-950 dark:text-white truncate">
                        {selectedRepoForDocs}
                      </h3>
                      {docsData?.source && (
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 text-neutral-500 shrink-0">
                          {docsData.source === "database"
                            ? "Verified Case Study"
                            : docsData.source === "github"
                            ? "GitHub Markdown"
                            : "Architecture Blueprint"}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-500 font-mono">
                      System Architecture Specifications & README Documentation
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {docsData?.projectSlug && (
                    <Link
                      href={`/projects/${docsData.projectSlug}`}
                      target="_blank"
                      className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black text-white dark:bg-white dark:text-black text-xs font-semibold hover:opacity-90 transition-opacity"
                    >
                      <span>Full Case Study</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  )}

                  <button
                    onClick={closeDocsModal}
                    className="p-2 rounded-lg border border-neutral-200 dark:border-neutral-800 text-neutral-500 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                    aria-label="Close modal"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Modal Body: Markdown Docs Viewer */}
              <div className="flex-1 overflow-y-auto p-6 sm:p-8">
                {isLoadingDocs ? (
                  <div className="py-24 flex flex-col items-center justify-center gap-3 text-neutral-400">
                    <Loader2 className="w-8 h-8 animate-spin" />
                    <span className="text-xs font-mono">Compiling architecture documentation...</span>
                  </div>
                ) : docsData ? (
                  <div className="space-y-6">
                    {/* Action bar inside docs */}
                    <div className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/60 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                      <div className="flex items-center gap-2">
                        <GithubIcon className="w-4 h-4 text-neutral-500" />
                        <span className="text-neutral-500">Repository:</span>
                        <a
                          href={docsData.repoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-neutral-900 dark:text-white font-medium hover:underline flex items-center gap-1"
                        >
                          <span>{selectedRepoForDocs}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>

                      {docsData.repoUrl && (
                        <button
                          onClick={() => copyCloneCommand(docsData.repoUrl!)}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                        >
                          {copiedClone ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-500" />
                              <span>Copied Clone Command</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3 text-neutral-400" />
                              <span>Copy `git clone`</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>

                    {/* Markdown Content */}
                    <div className="prose prose-neutral dark:prose-invert max-w-none text-xs sm:text-sm leading-relaxed prose-headings:tracking-tight prose-headings:font-bold prose-pre:bg-neutral-950 prose-pre:border prose-pre:border-neutral-800">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeHighlight, rehypeRaw]}
                      >
                        {docsData.doc}
                      </ReactMarkdown>
                    </div>
                  </div>
                ) : (
                  <div className="py-20 text-center text-neutral-400 text-sm">
                    Unable to load architecture documentation.
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}

export default GitHubReposScroll;
