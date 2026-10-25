"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowDown, ArrowUpRight, FileText, Sparkles } from "lucide-react";

interface HeroProps {
  title?: string;
  tagline?: string;
  resumeUrl?: string;
}

export function Hero({
  title = "Engineering Scalable Systems & Autonomous AI Agents",
  tagline = "Full Stack Engineer & AI Specialist passionate about deterministic architectures, production agentic workflows, and minimalist monochrome software.",
  resumeUrl = "/resume.pdf",
}: HeroProps) {
  const words = title.split(" ");

  return (
    <section className="relative min-h-[92vh] flex flex-col justify-center items-center overflow-hidden px-4 sm:px-6 lg:px-8 border-b border-neutral-200 dark:border-neutral-900">
      {/* Ambient background glow (Hardware accelerated, lightweight) */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-neutral-300/20 dark:bg-neutral-800/20 blur-[100px] pointer-events-none -translate-x-1/2 -translate-y-1/2 will-change-transform" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-neutral-400/15 dark:bg-neutral-900/40 blur-[120px] pointer-events-none translate-x-1/2 translate-y-1/2 will-change-transform" />

      <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center">
        {/* Availability badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-neutral-200 dark:border-neutral-800 bg-neutral-100/80 dark:bg-neutral-900/80 backdrop-blur-md mb-8 text-xs font-mono tracking-wide text-neutral-800 dark:text-neutral-200 shadow-sm"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Available for High-Impact Roles & AI Architecture</span>
          <Sparkles className="w-3 h-3 text-neutral-400" />
        </motion.div>

        {/* Headline with staggered animated words */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-neutral-950 dark:text-white leading-[1.1] mb-6">
          {words.map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                delay: i * 0.04,
                ease: "easeOut",
              }}
              className="inline-block mr-[0.28em] last:mr-0"
            >
              {word}
            </motion.span>
          ))}
        </h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="text-base sm:text-lg md:text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed mb-10 font-normal"
        >
          {tagline}
        </motion.p>

        {/* Call to action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.35 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <Link
            href="#live-deployments"
            className="group inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-black text-white dark:bg-white dark:text-black font-medium text-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg"
          >
            <span>View Live Deployments</span>
            <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>

          <a
            href={resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-neutral-300 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/60 backdrop-blur-sm text-neutral-900 dark:text-neutral-200 font-medium text-sm transition-all duration-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:scale-[1.02] active:scale-[0.98]"
          >
            <FileText className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
            <span>Download Resume</span>
          </a>
        </motion.div>
      </div>

      {/* Bouncing scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-neutral-400 dark:text-neutral-500 text-xs font-mono"
      >
        <span>SCROLL</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown className="w-4 h-4" />
        </motion.div>
      </motion.div>
    </section>
  );
}

export default Hero;
