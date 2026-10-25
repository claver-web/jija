"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ExternalLink,
  Globe,
  Sparkles,
  Lock,
  ArrowRight,
  Layers,
  GraduationCap,
  Building2,
  CheckCircle2,
  Maximize2,
} from "lucide-react";

export interface LiveWebsite {
  id: string;
  title: string;
  domain: string;
  url: string;
  image: string;
  badge: string;
  category: string;
  icon: any;
  description: string;
  techStack: string[];
  caseStudyUrl: string;
  status: string;
  highlights: string[];
}

export const LIVE_WEBSITES: LiveWebsite[] = [
  {
    id: "langgpt",
    title: "LangGPT — Autonomous Context Memory AI Chat",
    domain: "langgpt.shubhamport.online",
    url: "https://langgpt.shubhamport.online",
    image: "/screenshots/langgpt.png",
    badge: "AI & LLM Platform",
    category: "Autonomous AI System",
    icon: Sparkles,
    description:
      "High-performance conversational AI platform powered by LangChain and Google Gemini 2.5 on Next.js 16 (React 19). Features dynamic narrative memory synthesis that maintains persistent user context across sessions without rigid key-value schemas.",
    techStack: ["Next.js 16", "LangChain", "Gemini 2.5", "React 19", "Tailwind CSS", "Zustand"],
    caseStudyUrl: "/projects/langgpt",
    status: "Production Live",
    highlights: [
      "Gemini 2.5 Flash & Pro Multi-Model Engine",
      "Asynchronous Narrative Profile Memory",
      "Streaming Markdown with Code Syntax Highlighting",
    ],
  },
  {
    id: "coursey",
    title: "Coursey — Online Learning Platform & Marketplace",
    domain: "coursey.shubhamport.online",
    url: "https://coursey.shubhamport.online",
    image: "/screenshots/coursey.png",
    badge: "EdTech & Marketplace",
    category: "Full-Stack Web Application",
    icon: GraduationCap,
    description:
      "Modern, secure course-selling marketplace by Radiantus with enterprise authentication, video streaming pipelines, interactive course curriculums, and administrative control suites.",
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "PostgreSQL", "Prisma", "Stripe"],
    caseStudyUrl: "/projects/coursey",
    status: "Production Live",
    highlights: [
      "Modular Video Curriculums & Enrollments",
      "Secure Payment & Checkout Workflows",
      "Dedicated Instructor & Admin Management Portal",
    ],
  },
  {
    id: "radiantus",
    title: "Vishram Sthal — Luxury Hotel & Spiritual Retreat",
    domain: "www.radiantus.buzz",
    url: "https://www.radiantus.buzz",
    image: "/screenshots/radiantus.png",
    badge: "Hospitality & Venue Suite",
    category: "Commercial Web Application",
    icon: Building2,
    description:
      "High-conversion hospitality web platform for a luxury retreat and wedding venue in Dehra Gopipur, Himachal Pradesh. Features interactive venue discovery, booking management, Google Maps integration, and event reservation workflows.",
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "Google Maps API"],
    caseStudyUrl: "/projects/vishram-sthal",
    status: "Production Live",
    highlights: [
      "Specialized Wedding & Luxury Venue Switcher",
      "Embedded Interactive Google Maps Geolocation",
      "High-Performance Responsive Media & Animations",
    ],
  },
];

export function LiveWebsitesShowcase() {
  const [activeSite, setActiveSite] = useState<LiveWebsite>(LIVE_WEBSITES[0]);

  return (
    <section id="live-deployments" className="py-24 border-b border-neutral-200 dark:border-neutral-900 bg-neutral-50/50 dark:bg-neutral-950/60 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 -right-20 w-[450px] h-[450px] bg-neutral-300/20 dark:bg-neutral-800/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-[450px] h-[450px] bg-neutral-300/20 dark:bg-neutral-800/20 rounded-full blur-[140px] pointer-events-none" />

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-neutral-500 mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Deployments • Shipped Web Products
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-neutral-950 dark:text-white">
              Websites & Systems in Production
            </h2>
            <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400 mt-2 max-w-2xl font-normal leading-relaxed">
              Explore real-world client platforms and AI applications engineered by Shubham Sharma — deployed live with custom domain routing, responsive architectures, and active user bases.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 text-xs font-mono px-3 py-1.5 rounded-full border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            3 Active Live Domains
          </div>
        </div>

        {/* Interactive Spotlight Hero Card */}
        <div className="mb-20">
          {/* Spotlight Tabs */}
          <div className="flex flex-wrap items-center gap-2 mb-6 p-1.5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/80 backdrop-blur-md w-full sm:w-max shadow-sm">
            {LIVE_WEBSITES.map((site) => {
              const Icon = site.icon;
              const isActive = activeSite.id === site.id;
              return (
                <button
                  key={site.id}
                  onClick={() => setActiveSite(site)}
                  className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-mono transition-all duration-200 ${
                    isActive
                      ? "bg-black text-white dark:bg-white dark:text-black shadow-md font-semibold"
                      : "text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800/60"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{site.domain}</span>
                </button>
              );
            })}
          </div>

          {/* Large Hero Browser Card */}
          <motion.div
            key={activeSite.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 shadow-2xl overflow-hidden"
          >
            {/* macOS Browser Window Top Bar */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200 dark:border-neutral-850 bg-neutral-100/80 dark:bg-neutral-900/90 backdrop-blur-md">
              {/* Traffic Light Dots */}
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e]" />
                <span className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123]" />
                <span className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29]" />
              </div>

              {/* URL Address Pill */}
              <div className="flex items-center gap-2 px-4 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-xs font-mono text-neutral-700 dark:text-neutral-300 shadow-inner max-w-sm sm:max-w-md w-full justify-center truncate">
                <Lock className="w-3 h-3 text-emerald-500 shrink-0" />
                <span className="text-neutral-400 dark:text-neutral-500">https://</span>
                <span className="font-semibold text-neutral-900 dark:text-neutral-100 truncate">{activeSite.domain}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0 ml-1" />
              </div>

              {/* Window Controls / Actions */}
              <div className="flex items-center gap-2">
                <a
                  href={activeSite.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
                  title="Open live site in new tab"
                >
                  <span className="hidden sm:inline">Launch</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Split Content: Screenshot on Left/Top, Details on Right/Bottom */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
              {/* Image Preview Container */}
              <div className="lg:col-span-7 relative bg-neutral-950 border-b lg:border-b-0 lg:border-r border-neutral-200 dark:border-neutral-800/80 group overflow-hidden">
                <div className="relative aspect-[16/10] w-full overflow-hidden">
                  <Image
                    src={activeSite.image}
                    alt={activeSite.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
                    priority
                  />
                  {/* Subtle Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </div>

                {/* Floating "View Live" Banner on Hover */}
                <a
                  href={activeSite.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-4 right-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-black/80 dark:bg-white/90 text-white dark:text-black text-xs font-mono backdrop-blur-md shadow-lg opacity-90 hover:opacity-100 hover:scale-105 transition-all"
                >
                  <span>Visit {activeSite.domain}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Details & Architecture Specs */}
              <div className="lg:col-span-5 p-6 sm:p-8 md:p-10 flex flex-col justify-between bg-white dark:bg-neutral-950">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-md border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200">
                      {activeSite.badge}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-emerald-600 dark:text-emerald-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      {activeSite.status}
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-950 dark:text-white mb-3">
                    {activeSite.title}
                  </h3>

                  <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed font-normal mb-6">
                    {activeSite.description}
                  </p>

                  {/* Highlights Bullet List */}
                  <div className="mb-6 space-y-2">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-400 dark:text-neutral-500 font-semibold">
                      Key Engineering Capabilities
                    </h4>
                    <ul className="space-y-1.5">
                      {activeSite.highlights.map((h, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-neutral-700 dark:text-neutral-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-neutral-400 dark:text-neutral-600 shrink-0 mt-0.5" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Tech Stack Chips */}
                  <div className="mb-8">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-400 dark:text-neutral-500 font-semibold mb-2">
                      Stack & Tools
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {activeSite.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="text-[11px] font-mono px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-800"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-6 border-t border-neutral-200 dark:border-neutral-900">
                  <a
                    href={activeSite.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-black text-white dark:bg-white dark:text-black text-xs font-semibold hover:opacity-90 transition-opacity shadow-sm"
                  >
                    <span>Visit Live Website</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  {activeSite.caseStudyUrl && (
                    <Link
                      href={activeSite.caseStudyUrl}
                      className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-neutral-300 dark:border-neutral-800 hover:border-black dark:hover:border-white text-neutral-800 dark:text-neutral-200 text-xs font-semibold transition-colors"
                    >
                      <span>Case Study</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* 3-Card Comparative Showcase Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
            <h3 className="text-xl font-bold tracking-tight text-neutral-950 dark:text-white">
              All 3 Live Deployed Platforms
            </h3>
            <span className="text-xs font-mono text-neutral-500">Click any card to launch</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {LIVE_WEBSITES.map((site) => (
              <div
                key={site.id}
                className="group flex flex-col justify-between rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-4 transition-all duration-300 hover:-translate-y-1.5 hover:border-neutral-900 dark:hover:border-neutral-100 hover:shadow-xl dark:hover:shadow-[0_0_25px_rgba(255,255,255,0.06)]"
              >
                <div>
                  {/* Browser Window Frame Preview */}
                  <div className="rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-900 mb-4 shadow-md">
                    {/* Tiny Top Bar */}
                    <div className="flex items-center justify-between px-3 py-2 bg-neutral-100 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#ff5f56]" />
                        <span className="w-2 h-2 rounded-full bg-[#ffbd2e]" />
                        <span className="w-2 h-2 rounded-full bg-[#27c93f]" />
                      </div>
                      <span className="text-[10px] font-mono text-neutral-500 dark:text-neutral-400 truncate max-w-[160px]">
                        {site.domain}
                      </span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    </div>

                    {/* Image */}
                    <a
                      href={site.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block relative aspect-[16/10] w-full overflow-hidden"
                    >
                      <Image
                        src={site.image}
                        alt={site.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[2px]">
                        <span className="px-3 py-1.5 rounded-lg bg-white text-black text-xs font-semibold font-mono flex items-center gap-1.5 shadow-lg">
                          <span>Visit Live</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </a>
                  </div>

                  {/* Header Meta */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-800">
                      {site.badge}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-500 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Live
                    </span>
                  </div>

                  {/* Title & Domain */}
                  <h4 className="text-lg font-bold tracking-tight text-neutral-950 dark:text-white mb-1 group-hover:text-neutral-700 dark:group-hover:text-neutral-200 transition-colors">
                    <a href={site.url} target="_blank" rel="noopener noreferrer">
                      {site.title.split("—")[0].trim()}
                    </a>
                  </h4>

                  <p className="text-xs font-mono text-neutral-400 dark:text-neutral-500 mb-3">
                    {site.domain}
                  </p>

                  <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed font-normal line-clamp-3 mb-4">
                    {site.description}
                  </p>
                </div>

                <div>
                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-1 mb-4 pt-3 border-t border-neutral-100 dark:border-neutral-900">
                    {site.techStack.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-50 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border border-neutral-200/60 dark:border-neutral-800/60"
                      >
                        {tech}
                      </span>
                    ))}
                    {site.techStack.length > 4 && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-900 text-neutral-500">
                        +{site.techStack.length - 4}
                      </span>
                    )}
                  </div>

                  {/* Links */}
                  <div className="flex items-center justify-between gap-2">
                    <a
                      href={site.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-neutral-900 dark:text-white hover:underline underline-offset-4"
                    >
                      <span>Open Website</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    {site.caseStudyUrl && (
                      <Link
                        href={site.caseStudyUrl}
                        className="text-[11px] font-mono text-neutral-500 hover:text-black dark:hover:text-white transition-colors"
                      >
                        Case Study →
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default LiveWebsitesShowcase;
