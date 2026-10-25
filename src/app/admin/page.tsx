import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  FolderGit2,
  Link2,
  Briefcase,
  Zap,
  BarChart3,
  Settings,
  ArrowUpRight,
  Shield,
  Eye,
  Calendar,
  Layers,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [
    projectsCount,
    linksCount,
    experienceCount,
    skillsCount,
    visitorsTotal,
    settingsCount,
  ] = await Promise.all([
    prisma.project.count().catch(() => 0),
    prisma.profileLink.count().catch(() => 0),
    prisma.experience.count().catch(() => 0),
    prisma.skill.count().catch(() => 0),
    prisma.visitorLog.count().catch(() => 0),
    prisma.siteSetting.count().catch(() => 0),
  ]);

  const cards = [
    {
      title: "Projects",
      count: projectsCount,
      href: "/admin/projects",
      icon: FolderGit2,
      desc: "Manage projects, tech stacks, and README case studies.",
    },
    {
      title: "Profile Links",
      count: linksCount,
      href: "/admin/links",
      icon: Link2,
      desc: "Social URLs, GitHub, LinkedIn, and PDF resume upload.",
    },
    {
      title: "Experience",
      count: experienceCount,
      href: "/admin/experience",
      icon: Briefcase,
      desc: "Career positions, roles, qualifications, and credentials.",
    },
    {
      title: "Skills",
      count: skillsCount,
      href: "/admin/skills",
      icon: Zap,
      desc: "Categorized skills and proficiency ratings.",
    },
    {
      title: "Visitor Traffic",
      count: visitorsTotal,
      href: "/admin/visitors",
      icon: BarChart3,
      desc: "Privacy-friendly analytics, device trends, and location breakdown.",
    },
    {
      title: "Site Settings",
      count: settingsCount,
      href: "/admin/settings",
      icon: Settings,
      desc: "Hero headlines, bio text, email, and SEO configurations.",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-neutral-500 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            System Active
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-950 dark:text-white">
            Command Center Overview
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
            Centralized administration for portfolio content, credentials, and real-time telemetry.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 text-xs font-medium hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
          >
            <Eye className="w-4 h-4 text-neutral-400" />
            <span>View Public Site</span>
          </Link>
          <Link
            href="/admin/projects/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-black text-white dark:bg-white dark:text-black text-xs font-semibold hover:opacity-90 transition-opacity"
          >
            <span>+ New Project</span>
          </Link>
        </div>
      </div>

      {/* Grid of Admin Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.title}
              href={card.href}
              className="group p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950/80 transition-all duration-300 hover:border-neutral-900 dark:hover:border-neutral-100 hover:shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center text-neutral-800 dark:text-neutral-200 group-hover:scale-105 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="font-mono text-2xl font-bold text-neutral-950 dark:text-white">
                    {card.count}
                  </span>
                </div>

                <h2 className="text-lg font-bold text-neutral-950 dark:text-white mb-1 group-hover:text-neutral-700 dark:group-hover:text-neutral-200 transition-colors">
                  {card.title}
                </h2>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed font-normal">
                  {card.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-900 flex items-center justify-between text-xs font-mono text-neutral-500 group-hover:text-neutral-900 dark:group-hover:text-neutral-100">
                <span>Configure</span>
                <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
