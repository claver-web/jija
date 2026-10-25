import React from "react";
import { prisma } from "@/lib/prisma";
import { QualificationManager } from "@/components/admin/forms/QualificationManager";

export const dynamic = "force-dynamic";

export default async function AdminQualificationsPage() {
  const qualifications = await prisma.qualification.findMany({
    orderBy: [{ year: "desc" }, { order: "asc" }],
  });

  return <QualificationManager initialItems={qualifications} />;
}
