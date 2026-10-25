"use client";

import React, { useState } from "react";
import Link from "next/link";
import { deleteProject, toggleFeaturedProject, syncGitHubProjectsAction } from "@/lib/actions/projects";
import { toast } from "@/components/ui/Toaster";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Star,
  ExternalLink,
  Bot,
  Terminal,
  Sparkles,
  Eye,
  RefreshCw,
} from "lucide-react";

interface ProjectItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  status: string;
  featured: boolean;
  order: number;
  liveUrl: string | null;
  updatedAt: Date;
}

export function ProjectsTable({ initialProjects }: { initialProjects: ProjectItem[] }) {
  const [projects, setProjects] = useState<ProjectItem[]>(initialProjects);
  const [search, setSearch] = useState("");

  const filtered = projects.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.slug.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleToggleFeatured = async (id: string, current: boolean) => {
    try {
      await toggleFeaturedProject(id, !current);
      setProjects((prev) =>
        prev.map((p) => (p.id === id ? { ...p, featured: !current } : p))
      );
      toast.success(!current ? "Marked as featured" : "Removed from featured");
    } catch {
      toast.error("Failed to toggle featured status");
    }
  };

  const [isSyncing, setIsSyncing] = useState(false);

  const handleSyncGitHub = async () => {
    setIsSyncing(true);
    try {
      const res = await syncGitHubProjectsAction();
      toast.success(`Successfully synced ${res.count} projects from GitHub!`);
      window.location.reload();
    } catch (err: any) {
      toast.error(err.message || "Failed to sync GitHub projects");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${title}"?`)) return;

    try {
      await deleteProject(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
      toast.success("Project deleted successfully");
    } catch {
      toast.error("Failed to delete project");
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Project Catalog
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Manage your engineering case studies, README architectures, and live demos.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSyncGitHub}
            disabled={isSyncing}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 text-xs font-semibold hover:border-black dark:hover:border-white transition-colors disabled:opacity-50"
            title="Fetch latest repos and READMEs from GitHub and sync to database"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin" : ""}`} />
            <span>{isSyncing ? "Syncing..." : "Sync from GitHub"}</span>
          </button>

          <Link
            href="/admin/projects/new"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-black text-white dark:bg-white dark:text-black text-xs font-semibold hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            <span>New Project</span>
          </Link>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter by title, slug, or category..."
          className="w-full px-4 py-2.5 pl-10 rounded-lg border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-xs focus:outline-none focus:border-black dark:focus:border-white"
        />
        <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
      </div>

      {/* Table */}
      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 overflow-hidden shadow-sm">
        {filtered.length === 0 ? (
          <div className="p-16 text-center text-neutral-500 text-sm">
            {projects.length === 0
              ? "No projects created yet. Click 'New Project' to get started."
              : "No projects matching your search."}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-900/50 text-neutral-500 text-xs font-mono uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3.5">Featured</th>
                  <th className="px-6 py-3.5">Title</th>
                  <th className="px-6 py-3.5">Category</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60 font-sans">
                {filtered.map((project) => (
                  <tr
                    key={project.id}
                    className="hover:bg-neutral-50/50 dark:hover:bg-neutral-900/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleFeatured(project.id, project.featured)}
                        className={`p-1 rounded-md transition-colors ${
                          project.featured
                            ? "text-amber-400 hover:text-amber-500"
                            : "text-neutral-300 dark:text-neutral-700 hover:text-neutral-400"
                        }`}
                        title={project.featured ? "Featured on Home" : "Click to feature"}
                      >
                        <Star className="w-4 h-4 fill-current" />
                      </button>
                    </td>

                    <td className="px-6 py-4">
                      <div className="font-semibold text-neutral-900 dark:text-neutral-100">
                        {project.title}
                      </div>
                      <div className="text-xs font-mono text-neutral-400">
                        /projects/{project.slug}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase px-2 py-0.5 rounded border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300">
                        {project.category === "AGENTIC_AI" && <Bot className="w-3 h-3 text-emerald-400" />}
                        {project.category === "WEBSITE" && <Terminal className="w-3 h-3 text-neutral-400" />}
                        {project.category === "FUTURE" && <Sparkles className="w-3 h-3 text-amber-400" />}
                        {project.category.replace("_", " ")}
                      </span>
                    </td>

                    <td className="px-6 py-4 font-mono text-xs">
                      <span
                        className={`px-2 py-0.5 rounded ${
                          project.status === "LIVE"
                            ? "bg-emerald-500/10 text-emerald-500 dark:text-emerald-400"
                            : project.status === "IN_PROGRESS"
                            ? "bg-amber-500/10 text-amber-500 dark:text-amber-400"
                            : "bg-blue-500/10 text-blue-500 dark:text-blue-400"
                        }`}
                      >
                        {project.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <Link
                          href={`/projects/${project.slug}`}
                          target="_blank"
                          className="p-1.5 rounded-md text-neutral-400 hover:text-black dark:hover:text-white transition-colors"
                          title="View public case study"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/admin/projects/${project.id}`}
                          className="p-1.5 rounded-md text-neutral-500 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(project.id, project.title)}
                          className="p-1.5 rounded-md text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProjectsTable;
