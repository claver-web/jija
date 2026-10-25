import React from "react";
import { prisma } from "@/lib/prisma";
import { CertificateManager } from "@/components/admin/forms/CertificateManager";

export const dynamic = "force-dynamic";

export default async function AdminCertificatesPage() {
  const certificates = await prisma.certificate.findMany({
    orderBy: [{ issueDate: "desc" }, { order: "asc" }],
  });

  return <CertificateManager initialItems={certificates} />;
}
