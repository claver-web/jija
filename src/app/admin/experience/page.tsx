import React from "react";
import { prisma } from "@/lib/prisma";
import { ExperienceManager } from "@/components/admin/forms/ExperienceManager";

export const dynamic = "force-dynamic";

export default async function AdminExperiencePage() {
  const experiences = await prisma.experience.findMany({
    orderBy: [{ current: "desc" }, { startDate: "desc" }, { order: "asc" }],
  });

  return <ExperienceManager initialItems={experiences} />;
}
