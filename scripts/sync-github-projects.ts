import { PrismaClient, ProjectCategory, ProjectStatus } from "@prisma/client";
import https from "https";

const prisma = new PrismaClient();

function fetchHttps(url: string, headers: Record<string, string> = {}): Promise<string> {
  return new Promise((resolve, reject) => {
    https
      .get(url, { headers: { "User-Agent": "Portfolio-App", ...headers } }, (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => resolve(data));
      })
      .on("error", reject);
  });
}

interface GitHubRepoRaw {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  default_branch: string;
  topics: string[];
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

export async function syncGitHubReposToProjects() {
  const owner = process.env.GITHUB_USERNAME || "claver-web";
  console.log(`==> Fetching repos from https://api.github.com/users/${owner}/repos to populate Projects...`);
  const reposJson = await fetchHttps(`https://api.github.com/users/${owner}/repos`);
  const repos: GitHubRepoRaw[] = JSON.parse(reposJson);

  console.log(`==> Found ${repos.length} repositories`);

  for (const repo of repos) {
    console.log(`\nProcessing repository: ${repo.name}...`);

    // Fetch README from raw GitHub URL
    let readmeContent = "";
    const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo.name}/${repo.default_branch || "main"}/README.md`;
    try {
      const fetched = await fetchHttps(rawUrl);
      if (fetched && !fetched.includes("404: Not Found") && fetched.length > 30) {
        readmeContent = fetched;
        console.log(`  ✓ Fetched README.md (${readmeContent.length} chars)`);
      }
    } catch (e) {
      console.warn(`  ! Could not fetch raw README for ${repo.name}`);
    }

    // Fallback: fetch via GitHub API
    if (!readmeContent) {
      try {
        const apiReadmeRaw = await fetchHttps(
          `https://api.github.com/repos/${owner}/${repo.name}/readme`
        );
        const parsed = JSON.parse(apiReadmeRaw);
        if (parsed.content && parsed.encoding === "base64") {
          readmeContent = Buffer.from(parsed.content, "base64").toString("utf-8");
          console.log(`  ✓ Fetched README.md via GitHub API (${readmeContent.length} chars)`);
        }
      } catch (e) {
        console.warn(`  ! Could not fetch API README for ${repo.name}`);
      }
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

    // Upsert project into database
    const saved = await prisma.project.upsert({
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

    console.log(`  ✓ Synced Project to DB: "${saved.title}" (slug: /projects/${saved.slug})`);
  }

  console.log("\n==> Successfully synced all GitHub repositories to Projects!");
}

if (require.main === module) {
  syncGitHubReposToProjects()
    .then(() => prisma.$disconnect())
    .catch((err) => {
      console.error("Sync error:", err);
      prisma.$disconnect();
      process.exit(1);
    });
}
