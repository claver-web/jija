"use client";

import React, { useState } from "react";
import Image from "next/image";
import { saveSiteSettings } from "@/lib/actions/settings";
import { toast } from "@/components/ui/Toaster";
import {
  Check,
  Loader2,
  Upload,
  Globe,
  FileText,
  Mail,
  MapPin,
  Sparkles,
  Search,
} from "lucide-react";
import { GithubIcon } from "@/components/ui/Icons";

function isImageFormat(url: string | null | undefined): boolean {
  if (!url) return false;
  if (/\.pdf($|\?)/i.test(url)) return false;
  return /\.(png|jpe?g|webp|gif|svg|avif)($|\?)/i.test(url) || url.startsWith("data:image/") || url.startsWith("/");
}

interface SettingsFormProps {
  initialSettings: Record<string, string>;
}

export function SettingsForm({ initialSettings }: SettingsFormProps) {
  const [formData, setFormData] = useState<Record<string, string>>({
    heroTitle: initialSettings.heroTitle || "Engineering Scalable Systems & Autonomous AI Agents",
    tagline: initialSettings.tagline || "Full Stack Engineer & AI Specialist passionate about deterministic architectures and minimalist monochrome software.",
    bio: initialSettings.bio || "I design and build end-to-end distributed applications and autonomous agentic AI workflows.",
    location: initialSettings.location || "San Francisco, CA / Remote",
    email: initialSettings.email || "contact@portfolio.local",
    resumeUrl: initialSettings.resumeUrl || "/resume.pdf",
    ogImage: initialSettings.ogImage || "/og-image.png",
    seoTitle: initialSettings.seoTitle || "Portfolio — Engineer & AI Specialist",
    seoDescription: initialSettings.seoDescription || "Production-grade portfolio showcasing full-stack engineering and autonomous AI systems.",
    githubReposUrl: initialSettings.githubReposUrl || "https://api.github.com/users/claver-web/repos",
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingResume, setIsUploadingResume] = useState(false);
  const [isUploadingOg, setIsUploadingOg] = useState(false);

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    targetKey: "resumeUrl" | "ogImage",
    setLoading: (val: boolean) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const body = new FormData();
    body.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      handleChange(targetKey, data.url);
      toast.success(`${targetKey === "resumeUrl" ? "Resume" : "OG image"} uploaded!`);
    } catch (err: any) {
      toast.error(err.message || "Failed to upload file");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await saveSiteSettings(formData);
      toast.success("Site settings updated successfully!");
    } catch (err: any) {
      toast.error(err?.message || "Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Site Configuration & SEO
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Global metadata, hero headlines, contact coordinates, and social share previews.
          </p>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-black text-white dark:bg-white dark:text-black text-xs font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 shadow-md"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
          <span>Save Changes</span>
        </button>
      </div>

      {/* 1. Hero & Branding */}
      <div className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-neutral-100 dark:border-neutral-800">
          <Sparkles className="w-4 h-4 text-neutral-500" />
          <h2 className="text-xs font-mono uppercase tracking-wider font-semibold text-neutral-800 dark:text-neutral-200">
            Hero & Identity
          </h2>
        </div>

        <div>
          <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
            Hero Headline
          </label>
          <input
            type="text"
            value={formData.heroTitle}
            onChange={(e) => handleChange("heroTitle", e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
            Tagline (Hero Subtitle)
          </label>
          <textarea
            value={formData.tagline}
            onChange={(e) => handleChange("tagline", e.target.value)}
            rows={2}
            className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm focus:outline-none leading-relaxed"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
            Bio
          </label>
          <textarea
            value={formData.bio}
            onChange={(e) => handleChange("bio", e.target.value)}
            rows={3}
            className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm focus:outline-none leading-relaxed"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
              Contact Email
            </label>
            <div className="relative">
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="w-full px-3.5 py-2 pl-9 rounded-lg border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm focus:outline-none"
              />
              <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
              Location
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleChange("location", e.target.value)}
                className="w-full px-3.5 py-2 pl-9 rounded-lg border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm focus:outline-none"
              />
              <MapPin className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Media & Assets */}
      <div className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-neutral-100 dark:border-neutral-800">
          <FileText className="w-4 h-4 text-neutral-500" />
          <h2 className="text-xs font-mono uppercase tracking-wider font-semibold text-neutral-800 dark:text-neutral-200">
            Media & Downloadable Assets
          </h2>
        </div>

        <div>
          <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
            Resume PDF URL
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={formData.resumeUrl}
              onChange={(e) => handleChange("resumeUrl", e.target.value)}
              className="flex-1 px-3.5 py-2 rounded-lg border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs font-mono focus:outline-none"
            />
            <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-xs font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800">
              {isUploadingResume ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
              <span>Upload PDF</span>
              <input
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={(e) => handleFileUpload(e, "resumeUrl", setIsUploadingResume)}
                disabled={isUploadingResume}
              />
            </label>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
            Open Graph Share Image
          </label>
          {formData.ogImage && isImageFormat(formData.ogImage) && (
            <div className="relative w-full h-32 rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-800 mb-2">
              <Image src={formData.ogImage} alt="OG Image Preview" fill className="object-cover" />
            </div>
          )}
          <div className="flex gap-2">
            <input
              type="text"
              value={formData.ogImage}
              onChange={(e) => handleChange("ogImage", e.target.value)}
              className="flex-1 px-3.5 py-2 rounded-lg border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs font-mono focus:outline-none"
            />
            <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-xs font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800">
              {isUploadingOg ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
              <span>Upload Image</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileUpload(e, "ogImage", setIsUploadingOg)}
                disabled={isUploadingOg}
              />
            </label>
          </div>
        </div>
      </div>

      {/* 3. SEO Metadata */}
      <div className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-neutral-100 dark:border-neutral-800">
          <Search className="w-4 h-4 text-neutral-500" />
          <h2 className="text-xs font-mono uppercase tracking-wider font-semibold text-neutral-800 dark:text-neutral-200">
            Search Engine Optimization (SEO)
          </h2>
        </div>

        <div>
          <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
            Default Meta Title
          </label>
          <input
            type="text"
            value={formData.seoTitle}
            onChange={(e) => handleChange("seoTitle", e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
            Default Meta Description
          </label>
          <textarea
            value={formData.seoDescription}
            onChange={(e) => handleChange("seoDescription", e.target.value)}
            rows={2}
            className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm focus:outline-none leading-relaxed"
          />
        </div>
      </div>

      {/* 4. GitHub Live Repositories */}
      <div className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-neutral-100 dark:border-neutral-800">
          <GithubIcon className="w-4 h-4 text-neutral-500" />
          <h2 className="text-xs font-mono uppercase tracking-wider font-semibold text-neutral-800 dark:text-neutral-200">
            GitHub Live Repositories (Server-Side Proxy)
          </h2>
        </div>

        <div>
          <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
            GitHub Repositories API URL
          </label>
          <input
            type="text"
            value={formData.githubReposUrl}
            onChange={(e) => handleChange("githubReposUrl", e.target.value)}
            placeholder="https://api.github.com/users/claver-web/repos"
            className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs font-mono focus:outline-none"
          />
          <p className="text-[11px] text-neutral-500 mt-1.5">
            🔒 Kept completely private on the server. The frontend never accesses or exposes this endpoint directly; repositories are fetched and cached server-side.
          </p>
        </div>
      </div>
    </form>
  );
}

export default SettingsForm;
