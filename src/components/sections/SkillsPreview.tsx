import React from "react";
import { prisma } from "@/lib/prisma";
import { Code, Cpu, Database, Wrench, Sparkles, Layers } from "lucide-react";

const CATEGORY_LABELS: Record<string, { label: string; icon: React.ComponentType<{ className?: string }> }> = {
  LANGUAGE: { label: "Languages", icon: Code },
  FRAMEWORK: { label: "Frameworks & Runtimes", icon: Layers },
  AI_ML: { label: "Agentic AI & ML", icon: Sparkles },
  DATABASE: { label: "Databases & Storage", icon: Database },
  TOOL: { label: "Infrastructure & DevOps", icon: Wrench },
  OTHER: { label: "Specialties", icon: Cpu },
};

export async function SkillsPreview() {
  let skills: Array<{
    id: string;
    name: string;
    category: string;
    proficiency: number;
  }> = [];

  try {
    skills = await prisma.skill.findMany({
      orderBy: [{ category: "asc" }, { order: "asc" }],
    });
  } catch (error) {
    console.error("Failed to load skills for preview:", error);
  }

  if (skills.length === 0) {
    skills = [
      { id: "1", name: "TypeScript", category: "LANGUAGE", proficiency: 95 },
      { id: "2", name: "Python", category: "LANGUAGE", proficiency: 92 },
      { id: "3", name: "Next.js 14", category: "FRAMEWORK", proficiency: 96 },
      { id: "4", name: "PostgreSQL", category: "DATABASE", proficiency: 88 },
      { id: "5", name: "LangChain / LangGraph", category: "AI_ML", proficiency: 86 },
      { id: "6", name: "Autonomous Agents", category: "AI_ML", proficiency: 90 },
      { id: "7", name: "Docker", category: "TOOL", proficiency: 82 },
      { id: "8", name: "Tailwind CSS", category: "FRAMEWORK", proficiency: 94 },
    ];
  }

  // Duplicate for seamless infinite marquee loop
  const marqueeItems = [...skills, ...skills];

  return (
    <section className="py-20 border-b border-neutral-200 dark:border-neutral-900 overflow-hidden bg-neutral-900/[0.02] dark:bg-neutral-900/20">
      <div className="container mx-auto px-4 max-w-6xl mb-10">
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-neutral-500 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-900 dark:bg-neutral-100" />
            Core Capabilities
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Engineering & AI Toolset
          </h2>
        </div>
      </div>

      {/* Infinite marquee banner */}
      <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div className="flex w-max gap-4 animate-marquee py-3">
          {marqueeItems.map((skill, index) => (
            <div
              key={`${skill.id}-${index}`}
              className="flex items-center gap-3 px-5 py-2.5 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm shadow-sm whitespace-nowrap"
            >
              <span className="w-2 h-2 rounded-full bg-neutral-900 dark:bg-white" />
              <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100 font-sans">
                {skill.name}
              </span>
              <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-neutral-500 px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800">
                {CATEGORY_LABELS[skill.category]?.label || skill.category}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SkillsPreview;
