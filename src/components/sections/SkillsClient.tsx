"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Code, Layers, Sparkles, Database, Wrench, Cpu } from "lucide-react";

interface SkillItem {
  id: string;
  name: string;
  category: string;
  proficiency: number;
}

const CATEGORY_MAP: Record<string, { label: string; icon: React.ComponentType<{ className?: string }> }> = {
  ALL: { label: "All Skills", icon: Cpu },
  LANGUAGE: { label: "Languages", icon: Code },
  FRAMEWORK: { label: "Frameworks", icon: Layers },
  AI_ML: { label: "Agentic AI / ML", icon: Sparkles },
  DATABASE: { label: "Databases", icon: Database },
  TOOL: { label: "Tools & DevOps", icon: Wrench },
  OTHER: { label: "Other", icon: Cpu },
};

export function SkillsClient({ skills }: { skills: SkillItem[] }) {
  const [activeTab, setActiveTab] = useState<string>("ALL");

  const categories = ["ALL", ...Array.from(new Set(skills.map((s) => s.category)))];

  const filteredSkills =
    activeTab === "ALL" ? skills : skills.filter((s) => s.category === activeTab);

  return (
    <div>
      {/* Category Tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-12 border-b border-neutral-200 dark:border-neutral-800 pb-4">
        {categories.map((cat) => {
          const info = CATEGORY_MAP[cat] || { label: cat, icon: Cpu };
          const Icon = info.icon;
          const isActive = activeTab === cat;

          return (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-black text-white dark:bg-white dark:text-black shadow-sm"
                  : "bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white hover:bg-neutral-200 dark:hover:bg-neutral-800"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{info.label}</span>
            </button>
          );
        })}
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredSkills.map((skill, index) => (
          <motion.div
            key={skill.id}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.04 }}
            className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800/80 bg-white dark:bg-neutral-950/80 shadow-sm hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="font-semibold text-neutral-900 dark:text-neutral-100 text-sm">
                {skill.name}
              </span>
              <span className="font-mono text-xs text-neutral-500">{skill.proficiency}%</span>
            </div>

            {/* Animated progress bar */}
            <div className="w-full h-2 rounded-full bg-neutral-100 dark:bg-neutral-900 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${skill.proficiency}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                className="h-full bg-black dark:bg-white rounded-full"
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
