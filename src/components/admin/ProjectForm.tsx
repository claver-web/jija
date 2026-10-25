"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { saveProject } from "@/lib/actions/projects";
import { toast } from "@/components/ui/Toaster";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import {
  Upload,
  Loader2,
  Check,
  ArrowLeft,
  Eye,
  FileCode,
  X,
  ExternalLink,
  Bot,
  Terminal,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

interface ProjectFormProps {
  initialData?: {
    id?: string;
    title: string;
    slug: string;
    description: string;
    readme?: string | null;
    liveUrl?: string | null;
    repoUrl?: string | null;
    techStack: string[];
    category: "WEBSITE" | "AGENTIC_AI" | "FUTURE";
    status: "LIVE" | "IN_PROGRESS" | "PLANNED";
    featured: boolean;
    thumbnail?: string | null;
    order?: number;
  } | null;
}

export function ProjectForm({ initialData }: ProjectFormProps) {
  const router = useRouter();

  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [readme, setReadme] = useState(initialData?.readme || "");
  const [liveUrl, setLiveUrl] = useState(initialData?.liveUrl || "");
  const [repoUrl, setRepoUrl] = useState(initialData?.repoUrl || "");
  const [category, setCategory] = useState<"WEBSITE" | "AGENTIC_AI" | "FUTURE">(
    initialData?.category || "WEBSITE"
  );
  const [status, setStatus] = useState<"LIVE" | "IN_PROGRESS" | "PLANNED">(
    initialData?.status || "LIVE"
  );
  const [featured, setFeatured] = useState(initialData?.featured || false);
  const [thumbnail, setThumbnail] = useState(initialData?.thumbnail || "");
  const [techStack, setTechStack] = useState<string[]>(initialData?.techStack || []);
  const [techInput, setTechInput] = useState("");

  const [readmeTab, setReadmeTab] = useState<"write" | "preview">("write");
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingThumb, setIsUploadingThumb] = useState(false);

  // Auto-generate slug from title if user hasn't typed a custom slug
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!initialData) {
      setSlug(
        val
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, "")
          .replace(/[\s_-]+/g, "-")
          .replace(/^-+|-+$/g, "")
      );
    }
  };

  const addTechBadge = () => {
    const trimmed = techInput.trim();
    if (trimmed && !techStack.includes(trimmed)) {
      setTechStack([...techStack, trimmed]);
      setTechInput("");
    }
  };

  const removeTechBadge = (t: string) => {
    setTechStack(techStack.filter((item) => item !== t));
  };

  // Upload .md file client-side
  const handleReadmeFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setReadme(content);
        toast.success(`Loaded ${file.name} successfully!`);
      }
    };
    reader.readAsText(file);
  };

  // Upload thumbnail
  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingThumb(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      setThumbnail(data.url);
      toast.success("Thumbnail uploaded!");
    } catch (err: any) {
      toast.error(err.message || "Failed to upload thumbnail");
    } finally {
      setIsUploadingThumb(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !slug || !description) {
      toast.error("Please fill in Title, Slug, and Description.");
      return;
    }

    setIsSaving(true);
    try {
      await saveProject({
        id: initialData?.id,
        title,
        slug,
        description,
        readme,
        liveUrl: liveUrl || null,
        repoUrl: repoUrl || null,
        techStack,
        category,
        status,
        featured,
        thumbnail: thumbnail || null,
        order: initialData?.order ?? 0,
      });

      toast.success(initialData?.id ? "Project updated successfully!" : "Project created successfully!");
      router.push("/admin/projects");
      router.refresh();
    } catch (err: any) {
      toast.error(err?.message || "Failed to save project.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/projects"
            className="p-2 rounded-lg border border-neutral-200 dark:border-neutral-800 text-neutral-500 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
              {initialData?.id ? `Edit: ${initialData.title}` : "New Engineering Project"}
            </h1>
            <p className="text-xs text-neutral-500 mt-0.5">
              Fill in technical attributes, README markdown documentation, and media assets.
            </p>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-black text-white dark:bg-white dark:text-black text-xs font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 shadow-md"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
          <span>{initialData?.id ? "Save Changes" : "Publish Project"}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title & Slug */}
          <div className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-neutral-500 mb-1.5">
                Project Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. Autonomous Agentic Orchestrator"
                required
                className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm focus:outline-none focus:border-black dark:focus:border-white font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-neutral-500 mb-1.5">
                URL Slug *
              </label>
              <div className="flex items-center">
                <span className="px-3 py-2.5 rounded-l-lg border border-r-0 border-neutral-300 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 text-xs font-mono text-neutral-500">
                  /projects/
                </span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="project-slug"
                  required
                  className="flex-1 px-4 py-2.5 rounded-r-lg border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs font-mono focus:outline-none focus:border-black dark:focus:border-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-neutral-500 mb-1.5">
                Short Description *
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Brief technical summary displayed on project cards and SEO preview..."
                required
                className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm focus:outline-none focus:border-black dark:focus:border-white leading-relaxed"
              />
            </div>
          </div>

          {/* README Markdown Editor with Live Preview */}
          <div className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-neutral-500" />
                <span className="text-xs font-mono uppercase tracking-wider text-neutral-700 dark:text-neutral-300 font-semibold">
                  README.md Documentation
                </span>
              </div>

              <div className="flex items-center gap-3">
                <label className="cursor-pointer inline-flex items-center gap-1.5 text-xs font-mono text-neutral-500 hover:text-black dark:hover:text-white px-2.5 py-1 rounded border border-neutral-300 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload .md file</span>
                  <input
                    type="file"
                    accept=".md,.markdown,text/markdown,text/plain"
                    className="hidden"
                    onChange={handleReadmeFileUpload}
                  />
                </label>

                {/* Tab switch */}
                <div className="inline-flex rounded-lg border border-neutral-300 dark:border-neutral-800 p-0.5 bg-neutral-100 dark:bg-neutral-900">
                  <button
                    type="button"
                    onClick={() => setReadmeTab("write")}
                    className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                      readmeTab === "write"
                        ? "bg-white dark:bg-neutral-800 text-black dark:text-white shadow-sm"
                        : "text-neutral-500 hover:text-black dark:hover:text-white"
                    }`}
                  >
                    Write
                  </button>
                  <button
                    type="button"
                    onClick={() => setReadmeTab("preview")}
                    className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                      readmeTab === "preview"
                        ? "bg-white dark:bg-neutral-800 text-black dark:text-white shadow-sm"
                        : "text-neutral-500 hover:text-black dark:hover:text-white"
                    }`}
                  >
                    Preview
                  </button>
                </div>
              </div>
            </div>

            {readmeTab === "write" ? (
              <div>
                <textarea
                  value={readme}
                  onChange={(e) => setReadme(e.target.value)}
                  rows={16}
                  placeholder="# Architectural Case Study&#10;&#10;Explain system design, state machines, tradeoffs, benchmarks..."
                  className="w-full px-4 py-3 rounded-lg border border-neutral-300 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/60 font-mono text-xs focus:outline-none focus:border-black dark:focus:border-white leading-relaxed resize-y"
                />
                <p className="text-[11px] font-mono text-neutral-400 mt-1.5">
                  Supports GitHub Flavored Markdown (GFM), syntax highlighting, tables, and raw HTML.
                </p>
              </div>
            ) : (
              <div className="p-6 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40 min-h-[300px] overflow-y-auto max-h-[500px]">
                {readme.trim() ? (
                  <div className="prose prose-neutral dark:prose-invert max-w-none text-xs sm:text-sm">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeHighlight, rehypeRaw]}
                    >
                      {readme}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <p className="text-neutral-400 text-xs italic">Nothing to preview yet.</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Controls */}
        <div className="space-y-6">
          {/* Metadata Controls */}
          <div className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-wider text-neutral-500 pb-3 border-b border-neutral-100 dark:border-neutral-800 font-semibold">
              Classification & State
            </h3>

            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm focus:outline-none"
              >
                <option value="WEBSITE">Website / Platform</option>
                <option value="AGENTIC_AI">Agentic AI</option>
                <option value="FUTURE">Future Concept</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm focus:outline-none"
              >
                <option value="LIVE">Live Production</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="PLANNED">Planned</option>
              </select>
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="w-4 h-4 rounded text-black dark:text-white border-neutral-400 focus:ring-0"
                />
                <div>
                  <span className="text-xs font-semibold text-neutral-900 dark:text-white">
                    Featured on Homepage
                  </span>
                  <p className="text-[11px] text-neutral-500">
                    Display in the top featured grid on the homepage.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Tech Stack Tags */}
          <div className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-neutral-500 pb-2 border-b border-neutral-100 dark:border-neutral-800 font-semibold">
              Tech Stack
            </h3>

            <div className="flex gap-2">
              <input
                type="text"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === ",") {
                    e.preventDefault();
                    addTechBadge();
                  }
                }}
                placeholder="Type and hit Enter..."
                className="flex-1 px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs focus:outline-none"
              />
              <button
                type="button"
                onClick={addTechBadge}
                className="px-3 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-xs font-medium hover:bg-neutral-200 dark:hover:bg-neutral-700"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-2">
              {techStack.map((tech) => (
                <span
                  key={tech}
                  className="inline-flex items-center gap-1.5 text-xs font-mono px-2.5 py-1 rounded bg-neutral-100 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-800"
                >
                  <span>{tech}</span>
                  <button
                    type="button"
                    onClick={() => removeTechBadge(tech)}
                    className="text-neutral-400 hover:text-black dark:hover:text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* URLs */}
          <div className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-neutral-500 pb-2 border-b border-neutral-100 dark:border-neutral-800 font-semibold">
              External URLs
            </h3>

            <div>
              <label className="block text-xs text-neutral-500 mb-1">Live URL</label>
              <input
                type="url"
                value={liveUrl}
                onChange={(e) => setLiveUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs font-mono focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs text-neutral-500 mb-1">GitHub Repo</label>
              <input
                type="url"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="https://github.com/..."
                className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs font-mono focus:outline-none"
              />
            </div>
          </div>

          {/* Thumbnail Image */}
          <div className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-neutral-500 pb-2 border-b border-neutral-100 dark:border-neutral-800 font-semibold">
              Thumbnail
            </h3>

            {thumbnail && (
              <div className="relative w-full h-36 rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-800 mb-3">
                <Image src={thumbnail} alt="Thumbnail preview" fill className="object-cover" />
                <button
                  type="button"
                  onClick={() => setThumbnail("")}
                  className="absolute top-2 right-2 p-1 rounded-full bg-black/70 text-white hover:bg-black"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <label className="cursor-pointer flex flex-col items-center justify-center p-4 border border-dashed border-neutral-300 dark:border-neutral-800 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors">
              {isUploadingThumb ? (
                <Loader2 className="w-5 h-5 animate-spin text-neutral-500" />
              ) : (
                <Upload className="w-5 h-5 text-neutral-400 mb-1" />
              )}
              <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                {isUploadingThumb ? "Uploading Image..." : "Upload Cover Image"}
              </span>
              <span className="text-[10px] text-neutral-400 mt-0.5">PNG, JPG, WebP ≤ 5MB</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleThumbnailUpload}
                disabled={isUploadingThumb}
              />
            </label>
          </div>
        </div>
      </div>
    </form>
  );
}

export default ProjectForm;
