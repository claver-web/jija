import { prisma } from "@/lib/prisma";

export interface GitHubRepo {
  id: number;
  name: string;
  fullName: string;
  description: string | null;
  htmlUrl: string;
  stars: number;
  forks: number;
  language: string | null;
  topics: string[];
  updatedAt: string;
  homepage: string | null;
  isFork: boolean;
  projectSlug?: string | null;
}

export interface RepoArchitectureDoc {
  repoName: string;
  title: string;
  doc: string;
  source: "database" | "github" | "generated";
  techStack?: string[];
  projectSlug?: string | null;
  liveUrl?: string | null;
  repoUrl?: string;
}

let cachedRepos: GitHubRepo[] | null = null;
let lastReposFetchTime = 0;
const REPOS_CACHE_TTL = 10 * 60 * 1000; // 10 minutes in-memory cache

export async function fetchGitHubRepos(): Promise<GitHubRepo[]> {
  const now = Date.now();
  if (cachedRepos && cachedRepos.length > 0 && now - lastReposFetchTime < REPOS_CACHE_TTL) {
    return cachedRepos;
  }

  try {
    const setting = await prisma.siteSetting.findUnique({
      where: { key: "githubReposUrl" },
    });

    const endpoint =
      setting?.value?.trim() || "https://api.github.com/users/claver-web/repos";

    const headers: Record<string, string> = {
      "User-Agent": "Portfolio-App/1.0",
      Accept: "application/vnd.github.v3+json",
    };

    if (process.env.GITHUB_TOKEN) {
      headers["Authorization"] = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    const parsedUrl = new URL(endpoint);
    if (!parsedUrl.searchParams.has("per_page")) {
      parsedUrl.searchParams.set("per_page", "18");
    }
    if (!parsedUrl.searchParams.has("sort")) {
      parsedUrl.searchParams.set("sort", "updated");
    }

    const [res, dbProjects] = await Promise.all([
      fetch(parsedUrl.toString(), {
        headers,
        next: { revalidate: 3600 },
        signal: AbortSignal.timeout(4000),
      }),
      prisma.project.findMany({
        select: { slug: true, title: true, repoUrl: true },
      }),
    ]);

    if (!res.ok) {
      console.error(`GitHub API response error: ${res.status} ${res.statusText}`);
      return [];
    }

    const data = await res.json();
    if (!Array.isArray(data)) return [];

    const mappedRepos = data.map((repo: any) => {
      // Check if there is a matching project in the database
      const matched = dbProjects.find(
        (p) =>
          (p.repoUrl && p.repoUrl.toLowerCase().includes(repo.name.toLowerCase())) ||
          p.slug.toLowerCase() === repo.name.toLowerCase().replace(/_/g, "-") ||
          p.title.toLowerCase().includes(repo.name.toLowerCase())
      );

      return {
        id: repo.id,
        name: repo.name,
        fullName: repo.full_name,
        description: repo.description || null,
        htmlUrl: repo.html_url,
        stars: repo.stargazers_count ?? 0,
        forks: repo.forks_count ?? 0,
        language: repo.language || null,
        topics: Array.isArray(repo.topics) ? repo.topics : [],
        updatedAt: repo.updated_at,
        homepage: repo.homepage || null,
        isFork: Boolean(repo.fork),
        projectSlug: matched ? matched.slug : null,
      };
    });

    cachedRepos = mappedRepos;
    lastReposFetchTime = Date.now();
    return mappedRepos;
  } catch (error) {
    console.error("Failed to fetch GitHub repos securely:", error);
    return cachedRepos || [];
  }
}

export async function fetchRepoArchitectureDoc(
  repoName: string
): Promise<RepoArchitectureDoc> {
  const sanitizedRepoName = repoName.trim();

  try {
    // 1. Check if database has an architecture README for this project
    const dbProject = await prisma.project.findFirst({
      where: {
        OR: [
          { repoUrl: { contains: sanitizedRepoName, mode: "insensitive" } },
          { slug: { equals: sanitizedRepoName.toLowerCase().replace(/_/g, "-") } },
          { title: { contains: sanitizedRepoName, mode: "insensitive" } },
        ],
      },
    });

    if (dbProject?.readme && dbProject.readme.trim().length > 20) {
      return {
        repoName: sanitizedRepoName,
        title: dbProject.title,
        doc: dbProject.readme,
        source: "database",
        techStack: dbProject.techStack,
        projectSlug: dbProject.slug,
        liveUrl: dbProject.liveUrl,
        repoUrl: dbProject.repoUrl || `https://github.com/claver-web/${sanitizedRepoName}`,
      };
    }

    // 2. Extract owner from site setting
    const setting = await prisma.siteSetting.findUnique({
      where: { key: "githubReposUrl" },
    });
    const endpoint = setting?.value || "https://api.github.com/users/claver-web/repos";

    let owner = "claver-web";
    try {
      const match = endpoint.match(/users\/([^\/]+)/);
      if (match && match[1]) owner = match[1];
    } catch {}

    const headers: Record<string, string> = {
      "User-Agent": "Portfolio-App/1.0",
      Accept: "application/vnd.github.v3+json",
    };

    if (process.env.GITHUB_TOKEN) {
      headers["Authorization"] = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    // Attempt to fetch README.md from GitHub API
    const readmeRes = await fetch(
      `https://api.github.com/repos/${owner}/${sanitizedRepoName}/readme`,
      { headers, next: { revalidate: 3600 }, signal: AbortSignal.timeout(3000) }
    );

    if (readmeRes.ok) {
      const readmeData = await readmeRes.json();
      if (readmeData.content && readmeData.encoding === "base64") {
        const decoded = Buffer.from(readmeData.content, "base64").toString("utf-8");
        if (decoded.trim()) {
          return {
            repoName: sanitizedRepoName,
            title: sanitizedRepoName.replace(/[-_]/g, " "),
            doc: decoded,
            source: "github",
            projectSlug: dbProject?.slug || null,
            liveUrl: dbProject?.liveUrl || null,
            repoUrl: `https://github.com/${owner}/${sanitizedRepoName}`,
          };
        }
      }
    }

    // Attempt alternate docs e.g. AGENTS.md or ARCHITECTURE.md
    for (const altDoc of ["AGENTS.md", "ARCHITECTURE.md", "CLAUDE.md"]) {
      const altRes = await fetch(
        `https://api.github.com/repos/${owner}/${sanitizedRepoName}/contents/${altDoc}`,
        { headers, next: { revalidate: 3600 }, signal: AbortSignal.timeout(3000) }
      );
      if (altRes.ok) {
        const altData = await altRes.json();
        if (altData.content && altData.encoding === "base64") {
          const decoded = Buffer.from(altData.content, "base64").toString("utf-8");
          if (decoded.trim()) {
            return {
              repoName: sanitizedRepoName,
              title: `${sanitizedRepoName.replace(/[-_]/g, " ")} (${altDoc})`,
              doc: decoded,
              source: "github",
              projectSlug: dbProject?.slug || null,
              liveUrl: dbProject?.liveUrl || null,
              repoUrl: `https://github.com/${owner}/${sanitizedRepoName}`,
            };
          }
        }
      }
    }

    // 3. Fallback: Generate structured Architectural Specifications blueprint
    const fallbackDoc = `# System Architecture & Specifications: ${sanitizedRepoName}

## 1. High-Level System Architecture
**${sanitizedRepoName}** is an open-source codebase engineered with deterministic execution principles, modular decoupling, and high performance.

\`\`\`
+-----------------------------------------------------------------+
|                         Client / Ingress                        |
+-----------------------------------------------------------------+
                                |
                                v
+-----------------------------------------------------------------+
|                    Application & Routing Core                   |
+-----------------------------------------------------------------+
                                |
        +-----------------------+-----------------------+
        |                                               |
        v                                               v
+-----------------------+                       +-----------------+
|    Business Logic     |                       | Data / Storage  |
|    & Tool Runners     |                       |    Engine       |
+-----------------------+                       +-----------------+
\`\`\`

## 2. Technical Stack & Foundation
- **Target Repository**: \`${owner}/${sanitizedRepoName}\`
- **Architecture Paradigm**: Modular, type-safe, asynchronous execution pipeline
- **Repository Visibility**: Public Open-Source

## 3. Structural Decomposition
- **Core Engine**: Handles business logic orchestration and input sanitation.
- **Service Interfaces**: Manages protocols, remote procedure calls, and API integrations.
- **Persistence & State**: Enforces atomic state transitions and resilient caching.

## 4. Setup & Local Development
\`\`\`bash
# Clone the repository
git clone https://github.com/${owner}/${sanitizedRepoName}.git

# Navigate into project directory
cd ${sanitizedRepoName}
\`\`\`

---
*Tip: You can customize or expand this architecture documentation at any time by linking a project in the Admin Panel or committing a \`README.md\` to the repository.*`;

    return {
      repoName: sanitizedRepoName,
      title: sanitizedRepoName.replace(/[-_]/g, " "),
      doc: fallbackDoc,
      source: "generated",
      projectSlug: dbProject?.slug || null,
      liveUrl: dbProject?.liveUrl || null,
      repoUrl: `https://github.com/${owner}/${sanitizedRepoName}`,
    };
  } catch (error) {
    console.error(`Error generating doc for ${repoName}:`, error);
    return {
      repoName: sanitizedRepoName,
      title: sanitizedRepoName,
      doc: `# Architecture Documentation: ${sanitizedRepoName}\n\nDocumentation is being compiled. Check back shortly.`,
      source: "generated",
      repoUrl: `https://github.com/claver-web/${sanitizedRepoName}`,
    };
  }
}
