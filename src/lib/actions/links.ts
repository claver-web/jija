"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const linkSchema = z.object({
  id: z.string().optional(),
  key: z.string().min(1, "Key is required"),
  label: z.string().min(1, "Label is required"),
  url: z.string().min(1, "URL is required"),
  icon: z.string().optional().nullable(),
  order: z.number().int().default(0),
});

async function requireAuth() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function saveProfileLink(input: z.infer<typeof linkSchema>) {
  await requireAuth();

  const validated = linkSchema.parse(input);

  if (validated.id) {
    await prisma.profileLink.update({
      where: { id: validated.id },
      data: {
        key: validated.key,
        label: validated.label,
        url: validated.url,
        icon: validated.icon ?? null,
        order: validated.order,
      },
    });
  } else {
    // If no id, check if key exists to update or create
    await prisma.profileLink.upsert({
      where: { key: validated.key },
      update: {
        label: validated.label,
        url: validated.url,
        icon: validated.icon ?? null,
        order: validated.order,
      },
      create: {
        key: validated.key,
        label: validated.label,
        url: validated.url,
        icon: validated.icon ?? null,
        order: validated.order,
      },
    });
  }

  revalidatePath("/admin/links");
  revalidatePath("/");
  return { success: true };
}

export async function deleteProfileLink(id: string) {
  await requireAuth();

  await prisma.profileLink.delete({
    where: { id },
  });

  revalidatePath("/admin/links");
  revalidatePath("/");
  return { success: true };
}

export async function reorderProfileLinks(orderedIds: string[]) {
  await requireAuth();

  await prisma.$transaction(
    orderedIds.map((id, index) =>
      prisma.profileLink.update({
        where: { id },
        data: { order: index + 1 },
      })
    )
  );

  revalidatePath("/admin/links");
  revalidatePath("/");
  return { success: true };
}
