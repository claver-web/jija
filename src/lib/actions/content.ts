"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SkillCategory } from "@prisma/client";
import { z } from "zod";

async function requireAuth() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  return session;
}

// ---------------- EXPERIENCE ----------------
const experienceSchema = z.object({
  id: z.string().optional(),
  company: z.string().min(1, "Company is required"),
  role: z.string().min(1, "Role is required"),
  description: z.string().min(1, "Description is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional().nullable(),
  current: z.boolean().default(false),
  location: z.string().optional().nullable(),
  order: z.number().int().default(0),
});

export async function saveExperience(input: z.infer<typeof experienceSchema>) {
  await requireAuth();
  const val = experienceSchema.parse(input);

  const data = {
    company: val.company,
    role: val.role,
    description: val.description,
    startDate: new Date(val.startDate),
    endDate: val.current || !val.endDate ? null : new Date(val.endDate),
    current: val.current,
    location: val.location || null,
    order: val.order,
  };

  if (val.id) {
    await prisma.experience.update({ where: { id: val.id }, data });
  } else {
    await prisma.experience.create({ data });
  }

  revalidatePath("/admin/experience");
  revalidatePath("/experience");
  revalidatePath("/");
  return { success: true };
}

export async function deleteExperience(id: string) {
  await requireAuth();
  await prisma.experience.delete({ where: { id } });
  revalidatePath("/admin/experience");
  revalidatePath("/experience");
  revalidatePath("/");
  return { success: true };
}

// ---------------- QUALIFICATIONS ----------------
const qualSchema = z.object({
  id: z.string().optional(),
  degree: z.string().min(1, "Degree is required"),
  institution: z.string().min(1, "Institution is required"),
  year: z.string().min(1, "Year is required"),
  description: z.string().optional().nullable(),
  order: z.number().int().default(0),
});

export async function saveQualification(input: z.infer<typeof qualSchema>) {
  await requireAuth();
  const val = qualSchema.parse(input);

  const data = {
    degree: val.degree,
    institution: val.institution,
    year: val.year,
    description: val.description || null,
    order: val.order,
  };

  if (val.id) {
    await prisma.qualification.update({ where: { id: val.id }, data });
  } else {
    await prisma.qualification.create({ data });
  }

  revalidatePath("/admin/qualifications");
  revalidatePath("/experience");
  revalidatePath("/");
  return { success: true };
}

export async function deleteQualification(id: string) {
  await requireAuth();
  await prisma.qualification.delete({ where: { id } });
  revalidatePath("/admin/qualifications");
  revalidatePath("/experience");
  revalidatePath("/");
  return { success: true };
}

// ---------------- CERTIFICATES ----------------
const certSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  issuer: z.string().min(1, "Issuer is required"),
  issueDate: z.string().min(1, "Issue date is required"),
  credentialUrl: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  order: z.number().int().default(0),
});

export async function saveCertificate(input: z.infer<typeof certSchema>) {
  await requireAuth();
  const val = certSchema.parse(input);

  const data = {
    title: val.title,
    issuer: val.issuer,
    issueDate: new Date(val.issueDate),
    credentialUrl: val.credentialUrl || null,
    imageUrl: val.imageUrl || null,
    order: val.order,
  };

  if (val.id) {
    await prisma.certificate.update({ where: { id: val.id }, data });
  } else {
    await prisma.certificate.create({ data });
  }

  revalidatePath("/admin/certificates");
  revalidatePath("/certificates");
  revalidatePath("/");
  return { success: true };
}

export async function deleteCertificate(id: string) {
  await requireAuth();
  await prisma.certificate.delete({ where: { id } });
  revalidatePath("/admin/certificates");
  revalidatePath("/certificates");
  revalidatePath("/");
  return { success: true };
}

// ---------------- SKILLS ----------------
const skillSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Skill name is required"),
  category: z.nativeEnum(SkillCategory).default(SkillCategory.OTHER),
  proficiency: z.number().min(1).max(100).default(80),
  order: z.number().int().default(0),
});

export async function saveSkill(input: z.infer<typeof skillSchema>) {
  await requireAuth();
  const val = skillSchema.parse(input);

  const data = {
    name: val.name,
    category: val.category,
    proficiency: val.proficiency,
    order: val.order,
  };

  if (val.id) {
    await prisma.skill.update({ where: { id: val.id }, data });
  } else {
    await prisma.skill.create({ data });
  }

  revalidatePath("/admin/skills");
  revalidatePath("/skills");
  revalidatePath("/");
  return { success: true };
}

export async function deleteSkill(id: string) {
  await requireAuth();
  await prisma.skill.delete({ where: { id } });
  revalidatePath("/admin/skills");
  revalidatePath("/skills");
  revalidatePath("/");
  return { success: true };
}
