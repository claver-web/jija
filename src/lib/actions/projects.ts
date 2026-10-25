"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ProjectCategory, ProjectStatus } from "@prisma/client";
import { z } from "zod";

const projectSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().min(1, "Description is required"),
  readme: z.string().optional().nullable(),
  liveUrl: z.string().optional().nullable(),
  repoUrl: z.string().optional().nullable(),
  techStack: z.array(z.string()).default([]),
  category: z.nativeEnum(ProjectCategory).default(ProjectCategory.WEBSITE),
  status: z.nativeEnum(ProjectStatus).default(ProjectStatus.LIVE),
  featured: z.boolean().default(false),
  thumbnail: z.string().optional().nullable(),
  order: z.number().int().default(0),
});

async function requireAuth() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function saveProject(input: z.infer<typeof projectSchema>) {
  await requireAuth();

  const validated = projectSchema.parse(input);

  // Clean empty strings to null
  const payload = {
    title: validated.title,
    slug: validated.slug.toLowerCase().trim().replace(/[^a-z0-9_-]/g, "-"),
    description: validated.description,
    readme: validated.readme || null,
    liveUrl: validated.liveUrl?.trim() || null,
    repoUrl: validated.repoUrl?.trim() || null,
    techStack: validated.techStack,
    category: validated.category,
    status: validated.status,
    featured: validated.featured,
    thumbnail: validated.thumbnail?.trim() || null,
    order: validated.order,
  };

  if (validated.id) {
    await prisma.project.update({
      where: { id: validated.id },
      data: payload,
    });
  } else {
    await prisma.project.create({
      data: payload,
    });
  }

  revalidatePath("/admin/projects");
  revalidatePath("/projects");
  revalidatePath(`/projects/${payload.slug}`);
  revalidatePath("/agentic-ai");
  revalidatePath("/");
  return { success: true };
}

export async function deleteProject(id: string) {
  await requireAuth();

  const project = await prisma.project.delete({
    where: { id },
  });

  revalidatePath("/admin/projects");
  revalidatePath("/projects");
  revalidatePath(`/projects/${project.slug}`);
  revalidatePath("/agentic-ai");
  revalidatePath("/");
  return { success: true };
}

export async function toggleFeaturedProject(id: string, featured: boolean) {
  await requireAuth();

  await prisma.project.update({
    where: { id },
    data: { featured },
  });

  revalidatePath("/admin/projects");
  revalidatePath("/projects");
  revalidatePath("/");
  return { success: true };
}

export async function syncGitHubProjectsAction() {
  await requireAuth();

  const setting = await prisma.siteSetting.findUnique({
    where: { key: "githubReposUrl" },
  });
  const endpoint = setting?.value?.trim() || "https://api.github.com/users/claver-web/repos";

  let owner = "claver-web";
  try {
    const match = endpoint.match(/users\/([^\/]+)/);
    if (match && match[1]) owner = match[1];
  } catch {}

  const res = await fetch(endpoint, {
    headers: {
      "User-Agent": "Portfolio-App/1.0",
      Accept: "application/vnd.github.v3+json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch repositories from GitHub (${res.status})`);
  }

  const repos = await res.json();
  if (!Array.isArray(repos)) {
    throw new Error("Invalid GitHub response");
  }

  const PROJECT_CONFIGS: Record<
    string,
    {
      title: string;
      slug: string;
      description: string;
      category: ProjectCategory;
      status: ProjectStatus;
      techStack: string[];
      featured: boolean;
      order: number;
    }
  > = {
    GoalBook_Servers: {
      title: "GoalBook — Distributed Microservices & Multi-Agent Architecture",
      slug: "goalbook-servers",
      description:
        "Enterprise distributed ecosystem featuring a 3-node PostgreSQL replication cluster, FastAPI AI vector search with ChromaDB & PyMuPDF, Next.js web application, and React Native Expo mobile app.",
      category: ProjectCategory.AGENTIC_AI,
      status: ProjectStatus.LIVE,
      techStack: [
        "FastAPI",
        "Python",
        "PostgreSQL",
        "Docker",
        "ChromaDB",
        "Next.js",
        "Expo",
        "Clerk",
        "TypeScript",
      ],
      featured: true,
      order: 1,
    },
    LangGPT: {
      title: "LangGPT — AI Chat Interface with Narrative Context Memory",
      slug: "langgpt",
      description:
        "Modern conversational AI interface powered by LangChain and Google Gemini 2.5 on Next.js 16 (React 19), featuring dynamic narrative biography memory persisted to local storage.",
      category: ProjectCategory.AGENTIC_AI,
      status: ProjectStatus.LIVE,
      techStack: [
        "Next.js 16",
        "React 19",
        "TypeScript",
        "LangChain",
        "Google Gemini",
        "Tailwind CSS",
        "Zustand",
      ],
      featured: true,
      order: 2,
    },
    SystemAccentChanger: {
      title: "SystemAccentChanger — Real-Time AI Audio Accent Converter & Virtual Mic",
      slug: "system-accent-changer",
      description:
        "Real-time bidirectional speech conversion pipeline integrating Google Gemini Live WebSockets with a PulseAudio/PipeWire virtual microphone null-sink and low-latency DSP noise gate.",
      category: ProjectCategory.AGENTIC_AI,
      status: ProjectStatus.LIVE,
      techStack: [
        "Python",
        "Google Gemini Live",
        "PulseAudio",
        "PipeWire",
        "WebSockets",
        "DSP",
        "Audio Engineering",
      ],
      featured: true,
      order: 3,
    },
    webAccentchanger: {
      title: "VoiceLink — Real-Time WebRTC Mesh Voice Calling Network",
      slug: "web-accent-changer",
      description:
        "Ultra-low latency P2P encrypted mesh audio web application built with Next.js 14, SimplePeer WebRTC, Socket.IO signaling server, and Web Audio API RMS active speaker detection.",
      category: ProjectCategory.WEBSITE,
      status: ProjectStatus.LIVE,
      techStack: [
        "Next.js 14",
        "WebRTC",
        "Socket.IO",
        "TypeScript",
        "Tailwind CSS",
        "Zustand",
        "Docker",
      ],
      featured: true,
      order: 4,
    },
  };

  let count = 0;

  for (const repo of repos) {
    let readmeContent = "";
    try {
      const rawRes = await fetch(
        `https://raw.githubusercontent.com/${owner}/${repo.name}/${repo.default_branch || "main"}/README.md`,
        { cache: "no-store" }
      );
      if (rawRes.ok) {
        readmeContent = await rawRes.text();
      }
    } catch {}

    if (!readmeContent) {
      try {
        const apiRes = await fetch(
          `https://api.github.com/repos/${owner}/${repo.name}/readme`,
          {
            headers: {
              "User-Agent": "Portfolio-App/1.0",
              Accept: "application/vnd.github.v3+json",
            },
            cache: "no-store",
          }
        );
        if (apiRes.ok) {
          const json = await apiRes.json();
          if (json.content && json.encoding === "base64") {
            readmeContent = Buffer.from(json.content, "base64").toString("utf-8");
          }
        }
      } catch {}
    }

    const conf = PROJECT_CONFIGS[repo.name] || {
      title: repo.name.replace(/[-_]/g, " "),
      slug: repo.name.toLowerCase().replace(/_/g, "-"),
      description: repo.description || `Engineering project: ${repo.name}`,
      category: ProjectCategory.WEBSITE,
      status: ProjectStatus.LIVE,
      techStack: repo.language ? [repo.language] : ["TypeScript"],
      featured: true,
      order: 10,
    };

    await prisma.project.upsert({
      where: { slug: conf.slug },
      update: {
        title: conf.title,
        description: conf.description,
        readme: readmeContent || null,
        repoUrl: repo.html_url,
        techStack: conf.techStack,
        category: conf.category,
        status: conf.status,
        featured: conf.featured,
        order: conf.order,
      },
      create: {
        title: conf.title,
        slug: conf.slug,
        description: conf.description,
        readme: readmeContent || null,
        repoUrl: repo.html_url,
        techStack: conf.techStack,
        category: conf.category,
        status: conf.status,
        featured: conf.featured,
        order: conf.order,
      },
    });

    count++;
  }

  revalidatePath("/admin/projects");
  revalidatePath("/projects");
  revalidatePath("/agentic-ai");
  revalidatePath("/");
  return { success: true, count };
}
