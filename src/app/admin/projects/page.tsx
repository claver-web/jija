import React from "react";
import { prisma } from "@/lib/prisma";
import { ProjectsTable } from "@/components/admin/ProjectsTable";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: { order: "asc" },
  });

  return <ProjectsTable initialProjects={projects} />;
}
