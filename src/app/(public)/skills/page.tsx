import React from "react";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { SkillsClient } from "@/components/sections/SkillsClient";

export const metadata: Metadata = {
  title: "Skills & Technical Stack",
  description: "Detailed proficiency ratings across programming languages, AI engineering frameworks, databases, and infrastructure.",
};

export const revalidate = 60;

export default async function SkillsPage() {
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
    console.error("Failed to load skills:", error);
  }

  if (skills.length === 0) {
    skills = [
      { id: "1", name: "TypeScript", category: "LANGUAGE", proficiency: 95 },
      { id: "2", name: "Python", category: "LANGUAGE", proficiency: 92 },
      { id: "3", name: "Next.js 14", category: "FRAMEWORK", proficiency: 96 },
      { id: "4", name: "React", category: "FRAMEWORK", proficiency: 95 },
      { id: "5", name: "LangChain & LangGraph", category: "AI_ML", proficiency: 88 },
      { id: "6", name: "Autonomous Multi-Agent Architecture", category: "AI_ML", proficiency: 90 },
      { id: "7", name: "PostgreSQL & Prisma", category: "DATABASE", proficiency: 90 },
      { id: "8", name: "Docker & CI/CD", category: "TOOL", proficiency: 84 },
      { id: "9", name: "Tailwind CSS", category: "FRAMEWORK", proficiency: 94 },
    ];
  }

  return (
    <div className="py-16 md:py-24">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="max-w-2xl mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-neutral-500 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-900 dark:bg-neutral-100" />
            Core Competencies
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-neutral-950 dark:text-white mb-4">
            Technical Proficiency
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 text-base sm:text-lg">
            Production experience quantified across full-stack engineering, distributed databases, and generative/agentic AI models.
          </p>
        </div>

        <SkillsClient skills={skills} />
      </div>
    </div>
  );
}
