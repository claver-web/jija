import React from "react";
import { prisma } from "@/lib/prisma";
import { LinksManager } from "@/components/admin/LinksManager";

export const dynamic = "force-dynamic";

export default async function AdminLinksPage() {
  const links = await prisma.profileLink.findMany({
    orderBy: { order: "asc" },
  });

  return <LinksManager initialLinks={links} />;
}
