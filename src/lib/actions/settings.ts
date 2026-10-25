"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireAuth() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function saveSiteSettings(settings: Record<string, string>) {
  await requireAuth();

  const entries = Object.entries(settings);

  await prisma.$transaction(
    entries.map(([key, value]) =>
      prisma.siteSetting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      })
    )
  );

  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath("/agentic-ai");
  revalidatePath("/experience");
  revalidatePath("/skills");
  revalidatePath("/certificates");
  revalidatePath("/admin/settings");
  revalidatePath("/admin");

  return { success: true };
}
