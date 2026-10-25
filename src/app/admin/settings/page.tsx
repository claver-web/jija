import React from "react";
import { prisma } from "@/lib/prisma";
import { SettingsForm } from "@/components/admin/forms/SettingsForm";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await prisma.siteSetting.findMany();

  const settingsMap: Record<string, string> = {};
  for (const s of settings) {
    settingsMap[s.key] = s.value;
  }

  return <SettingsForm initialSettings={settingsMap} />;
}
