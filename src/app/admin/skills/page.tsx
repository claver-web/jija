import React from "react";
import { prisma } from "@/lib/prisma";
import { SkillManager } from "@/components/admin/forms/SkillManager";

export const dynamic = "force-dynamic";

export default async function AdminSkillsPage() {
  const skills = await prisma.skill.findMany({
    orderBy: [{ category: "asc" }, { order: "asc" }],
  });

  return <SkillManager initialSkills={skills} />;
}
