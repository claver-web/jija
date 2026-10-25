import React from "react";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ExperienceTimeline } from "@/components/sections/ExperienceTimeline";
import { GitHubReposSection } from "@/components/sections/GitHubReposSection";
import { GraduationCap, Award, Building2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Experience & Qualifications",
  description: "Professional engineering career track, system design roles, and academic qualifications.",
};

export const revalidate = 60;

export default async function ExperiencePage() {
  let experiences: Array<{
    id: string;
    company: string;
    role: string;
    description: string;
    startDate: Date;
    endDate: Date | null;
    current: boolean;
    location: string | null;
  }> = [];

  let qualifications: Array<{
    id: string;
    degree: string;
    institution: string;
    year: string;
    description: string | null;
  }> = [];

  try {
    [experiences, qualifications] = await Promise.all([
      prisma.experience.findMany({
        orderBy: [{ current: "desc" }, { startDate: "desc" }, { order: "asc" }],
      }),
      prisma.qualification.findMany({
        orderBy: [{ year: "desc" }, { order: "asc" }],
      }),
    ]);
  } catch (error) {
    console.error("Failed to load experience & qualifications:", error);
  }

  // Format dates for client
  const formattedExperiences = experiences.map((e) => ({
    id: e.id,
    company: e.company,
    role: e.role,
    description: e.description,
    startDate: new Date(e.startDate).toLocaleDateString("en-US", { month: "short", year: "numeric" }),
    endDate: e.endDate
      ? new Date(e.endDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })
      : null,
    current: e.current,
    location: e.location,
  }));

  return (
    <div className="py-16 md:py-24">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-neutral-500 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-900 dark:bg-neutral-100" />
            Career Trajectory
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-neutral-950 dark:text-white mb-4">
            Experience & Journey
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 text-base sm:text-lg">
            Engineering leadership, full-stack architecture, and autonomous AI system implementations.
          </p>
        </div>

        {/* Work Experience Timeline */}
        <section className="mb-8">
          <div className="flex items-center gap-2.5 mb-10 pb-4 border-b border-neutral-200 dark:border-neutral-800">
            <Building2 className="w-5 h-5 text-neutral-800 dark:text-neutral-200" />
            <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
              Professional Experience
            </h2>
          </div>

          <ExperienceTimeline experiences={formattedExperiences} />
        </section>
      </div>

      {/* Repositories & Architecture Documentation */}
      <div className="my-16">
        <GitHubReposSection
          badge="Live Repositories & Systems"
          title="Repositories & Architecture Docs"
          subtitle="Explore the open-source engineering codebases and architectural documentation behind real-world systems."
        />
      </div>

      <div className="container mx-auto px-4 max-w-4xl">
        {/* Academic & Qualifications Section */}
        <section>
          <div className="flex items-center gap-2.5 mb-8 pb-4 border-b border-neutral-200 dark:border-neutral-800">
            <GraduationCap className="w-5 h-5 text-neutral-800 dark:text-neutral-200" />
            <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
              Academic & Professional Qualifications
            </h2>
          </div>

          {qualifications.length === 0 ? (
            <div className="p-10 text-center border border-dashed border-neutral-300 dark:border-neutral-800 rounded-xl">
              <p className="text-neutral-500 text-sm">No qualifications listed yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {qualifications.map((q) => (
                <div
                  key={q.id}
                  className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400">
                      {q.year}
                    </span>
                    <Award className="w-4 h-4 text-neutral-400" />
                  </div>
                  <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-1">
                    {q.degree}
                  </h3>
                  <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-3">
                    {q.institution}
                  </p>
                  {q.description && (
                    <p className="text-xs text-neutral-500 leading-relaxed font-normal">
                      {q.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
