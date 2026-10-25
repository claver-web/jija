"use client";

import React, { useState } from "react";
import { saveProfileLink, deleteProfileLink, reorderProfileLinks } from "@/lib/actions/links";
import { toast } from "@/components/ui/Toaster";
import {
  ArrowDown,
  ArrowUp,
  Edit2,
  Trash2,
  Plus,
  Upload,
  Loader2,
  ExternalLink,
  FileText,
  X,
  Check,
} from "lucide-react";

interface ProfileLinkItem {
  id: string;
  key: string;
  label: string;
  url: string;
  icon: string | null;
  order: number;
}

const SUPPORTED_KEYS = [
  { key: "github", label: "GitHub (Personal)" },
  { key: "githubWork", label: "GitHub (Work)" },
  { key: "linkedin", label: "LinkedIn" },
  { key: "leetcode", label: "LeetCode" },
  { key: "resume", label: "Resume (PDF)" },
  { key: "email", label: "Email" },
  { key: "twitter", label: "Twitter / X" },
  { key: "website", label: "Personal Website" },
];

export function LinksManager({ initialLinks }: { initialLinks: ProfileLinkItem[] }) {
  const [links, setLinks] = useState<ProfileLinkItem[]>(initialLinks);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<ProfileLinkItem | null>(null);

  // Form state
  const [key, setKey] = useState("github");
  const [label, setLabel] = useState("");
  const [url, setUrl] = useState("");
  const [icon, setIcon] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const openAddModal = () => {
    setEditingLink(null);
    setKey("github");
    setLabel("GitHub (Personal)");
    setUrl("");
    setIcon("github");
    setIsModalOpen(true);
  };

  const openEditModal = (item: ProfileLinkItem) => {
    setEditingLink(item);
    setKey(item.key);
    setLabel(item.label);
    setUrl(item.url);
    setIcon(item.icon || "");
    setIsModalOpen(true);
  };

  const handleKeySelect = (selectedKey: string) => {
    setKey(selectedKey);
    const match = SUPPORTED_KEYS.find((k) => k.key === selectedKey);
    if (match && !editingLink) {
      setLabel(match.label);
      setIcon(selectedKey);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!key || !label || !url) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsSaving(true);
    try {
      await saveProfileLink({
        id: editingLink?.id,
        key,
        label,
        url,
        icon: icon || key,
        order: editingLink ? editingLink.order : links.length + 1,
      });

      toast.success(editingLink ? "Link updated successfully!" : "Link created successfully!");
      setIsModalOpen(false);
      window.location.reload();
    } catch (err: any) {
      toast.error(err?.message || "Failed to save profile link.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, label: string) => {
    if (!confirm(`Are you sure you want to delete "${label}"?`)) return;

    try {
      await deleteProfileLink(id);
      setLinks((prev) => prev.filter((l) => l.id !== id));
      toast.success("Profile link removed.");
    } catch (err: any) {
      toast.error("Failed to delete link.");
    }
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= links.length) return;

    const reordered = [...links];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, moved);

    setLinks(reordered);

    try {
      await reorderProfileLinks(reordered.map((l) => l.id));
      toast.success("Link order updated.");
    } catch {
      toast.error("Failed to update ordering.");
    }
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Resume must be a PDF document.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("PDF exceeds 5MB size limit.");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      // Automatically update or create resume link
      const existingResume = links.find((l) => l.key === "resume");
      await saveProfileLink({
        id: existingResume?.id,
        key: "resume",
        label: "Resume",
        url: data.url,
        icon: "resume",
        order: existingResume ? existingResume.order : links.length + 1,
      });

      toast.success("Resume uploaded and link updated successfully!");
      window.location.reload();
    } catch (err: any) {
      toast.error(err.message || "Resume upload failed.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Profile Links & Resume
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Manage your external socials, developer platforms, and downloadable CV.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label className="cursor-pointer inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 text-xs font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
            {isUploading ? (
              <Loader2 className="w-4 h-4 animate-spin text-neutral-500" />
            ) : (
              <Upload className="w-4 h-4 text-neutral-500" />
            )}
            <span>{isUploading ? "Uploading..." : "Upload Resume PDF"}</span>
            <input
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={handleResumeUpload}
              disabled={isUploading}
            />
          </label>

          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-black text-white dark:bg-white dark:text-black text-xs font-semibold hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            <span>Add Link</span>
          </button>
        </div>
      </div>

      {/* Links Table */}
      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 overflow-hidden shadow-sm">
        {links.length === 0 ? (
          <div className="p-12 text-center text-neutral-500 text-sm">
            No profile links configured. Click "Add Link" to create one.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-900/50 text-neutral-500 text-xs font-mono uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3.5">Order</th>
                  <th className="px-6 py-3.5">Key</th>
                  <th className="px-6 py-3.5">Label</th>
                  <th className="px-6 py-3.5">Destination URL</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60 font-sans">
                {links.map((link, index) => (
                  <tr
                    key={link.id}
                    className="hover:bg-neutral-50/50 dark:hover:bg-neutral-900/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleMove(index, "up")}
                          disabled={index === 0}
                          className="p-1 rounded text-neutral-400 hover:text-black dark:hover:text-white disabled:opacity-20"
                          title="Move up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleMove(index, "down")}
                          disabled={index === links.length - 1}
                          className="p-1 rounded text-neutral-400 hover:text-black dark:hover:text-white disabled:opacity-20"
                          title="Move down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <span className="font-mono text-xs text-neutral-400 ml-1.5">
                          #{link.order}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-neutral-500">
                      {link.key}
                    </td>
                    <td className="px-6 py-4 font-medium text-neutral-900 dark:text-neutral-100">
                      {link.label}
                    </td>
                    <td className="px-6 py-4 text-xs font-mono text-neutral-500 max-w-xs truncate">
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:underline flex items-center gap-1"
                      >
                        <span className="truncate">{link.url}</span>
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => openEditModal(link)}
                          className="p-1.5 rounded-md text-neutral-500 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(link.id, link.label)}
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-6 shadow-2xl animate-scale-in">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800 mb-5">
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
                {editingLink ? "Edit Profile Link" : "Add Profile Link"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded text-neutral-400 hover:text-black dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-neutral-500 mb-1.5">
                  Platform Key
                </label>
                <select
                  value={key}
                  onChange={(e) => handleKeySelect(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm focus:outline-none focus:border-black dark:focus:border-white"
                >
                  {SUPPORTED_KEYS.map((k) => (
                    <option key={k.key} value={k.key}>
                      {k.label} ({k.key})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-neutral-500 mb-1.5">
                  Display Label
                </label>
                <input
                  type="text"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  placeholder="e.g. GitHub (Personal)"
                  required
                  className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm focus:outline-none focus:border-black dark:focus:border-white"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-neutral-500 mb-1.5">
                  URL / Target
                </label>
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://github.com/username or mailto:you@example.com"
                  required
                  className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm focus:outline-none focus:border-black dark:focus:border-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-black text-white dark:bg-white dark:text-black text-xs font-semibold hover:opacity-90 disabled:opacity-50"
                >
                  {isSaving ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Check className="w-3.5 h-3.5" />
                  )}
                  <span>Save Link</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default LinksManager;
