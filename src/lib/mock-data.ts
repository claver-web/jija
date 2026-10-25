import bcrypt from "bcryptjs";

export const initialSiteSettings: Record<string, string> = {
  heroTitle: "Crafting High-Impact Intelligent Systems",
  tagline: "Full Stack Engineer & AI Specialist passionate about autonomous agents and modern web architectures.",
  bio: "I design and engineer end-to-end full-stack applications and autonomous agentic AI workflows. Dedicated to clean code, robust performance, and minimalist monochrome UI.",
  resumeUrl: "/resume.pdf",
  email: "contact@portfolio.local",
  phone: "9877335163",
  location: "Chandigarh, India / Remote",
  name: "Shubham Sharma",
  githubReposUrl: "https://api.github.com/users/claver-web/repos",
};

export const initialProfileLinks = [
  { id: "1", key: "github", label: "GitHub (Personal)", url: "https://github.com", icon: "Github", order: 1 },
  { id: "2", key: "githubWork", label: "GitHub (Work)", url: "https://github.com", icon: "GitBranch", order: 2 },
  { id: "3", key: "linkedin", label: "LinkedIn", url: "https://linkedin.com", icon: "Linkedin", order: 3 },
  { id: "4", key: "leetcode", label: "LeetCode", url: "https://leetcode.com", icon: "Code2", order: 4 },
  { id: "5", key: "resume", label: "Resume", url: "/resume.pdf", icon: "FileText", order: 5 },
];

export const initialProjects = [
  {
    id: "proj_1",
    title: "GoalBook — Distributed Microservices & Multi-Agent Architecture",
    slug: "goalbook-servers",
    description: "Enterprise distributed ecosystem featuring a 3-node PostgreSQL replication cluster, FastAPI AI vector search with ChromaDB & PyMuPDF, Next.js web application, and React Native Expo mobile app.",
    readme: `# GoalBook Distributed Architecture\n\nBuilt with ❤️ by **Shubham Sharma** • Multi-Agent microservices platform.`,
    liveUrl: null,
    repoUrl: "https://github.com/shubham-sharma/GoalBook_Servers",
    techStack: ["Next.js", "FastAPI", "PostgreSQL", "Docker", "ChromaDB", "TypeScript"],
    category: "WEBSITE",
    status: "LIVE",
    featured: true,
    thumbnail: null,
    order: 1,
    createdAt: new Date("2026-09-01"),
    updatedAt: new Date("2026-10-24"),
  },
  {
    id: "proj_2",
    title: "LangGPT — Autonomous Context Memory AI Chat",
    slug: "langgpt",
    description: "High-performance conversational AI platform powered by LangChain and Google Gemini 2.5 on Next.js 16 (React 19). Features dynamic narrative memory synthesis that maintains persistent user context across sessions without rigid key-value schemas.",
    readme: `# LangGPT\n\nHigh-performance AI chat interface with persistent narrative context memory engineered by **Shubham Sharma**.`,
    liveUrl: "https://langgpt.shubhamport.online",
    repoUrl: "https://github.com/shubham-sharma/LangGPT",
    techStack: ["Next.js 16", "LangChain", "Gemini 2.5", "React 19", "Tailwind CSS", "Zustand"],
    category: "AGENTIC_AI",
    status: "LIVE",
    featured: true,
    thumbnail: "/screenshots/langgpt.png",
    order: 2,
    createdAt: new Date("2026-09-10"),
    updatedAt: new Date("2026-10-24"),
  },
  {
    id: "proj_3",
    title: "SystemAccentChanger — Real-Time AI Audio Accent Converter & Virtual Mic",
    slug: "system-accent-changer",
    description: "Real-time bidirectional speech conversion pipeline integrating Google Gemini Live WebSockets with a PulseAudio/PipeWire virtual microphone null-sink and low-latency DSP noise gate.",
    readme: `# SystemAccentChanger\n\nReal-Time AI Audio Accent Converter & Virtual Microphone engineered by **Shubham Sharma**.`,
    liveUrl: null,
    repoUrl: "https://github.com/shubham-sharma/SystemAccentChanger",
    techStack: ["Python", "FastAPI", "WebSockets", "PulseAudio", "DSP", "Gemini Live"],
    category: "AGENTIC_AI",
    status: "LIVE",
    featured: true,
    thumbnail: null,
    order: 3,
    createdAt: new Date("2026-09-15"),
    updatedAt: new Date("2026-10-24"),
  },
  {
    id: "proj_4",
    title: "Coursey — Online Learning Platform & Marketplace",
    slug: "coursey",
    description: "Modern, secure course-selling marketplace with enterprise authentication, video streaming pipelines, interactive course curriculums, and administrative control suites.",
    readme: `# Coursey\n\nProduction Online Learning Platform & Marketplace engineered by **Shubham Sharma**.`,
    liveUrl: "https://coursey.shubhamport.online",
    repoUrl: null,
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "PostgreSQL", "Prisma", "Stripe"],
    category: "WEBSITE",
    status: "LIVE",
    featured: true,
    thumbnail: "/screenshots/coursey.png",
    order: 4,
    createdAt: new Date("2026-09-20"),
    updatedAt: new Date("2026-10-24"),
  },
  {
    id: "proj_5",
    title: "Vishram Sthal — Luxury Hotel & Spiritual Retreat",
    slug: "vishram-sthal",
    description: "High-conversion hospitality web platform for a luxury retreat and wedding venue. Features interactive venue discovery, booking management, Google Maps integration, and event reservation workflows.",
    readme: `# Vishram Sthal\n\nLuxury Hotel & Retreat hospitality platform engineered by **Shubham Sharma**.`,
    liveUrl: "https://www.radiantus.buzz",
    repoUrl: null,
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "Google Maps API"],
    category: "WEBSITE",
    status: "LIVE",
    featured: true,
    thumbnail: "/screenshots/radiantus.png",
    order: 5,
    createdAt: new Date("2026-09-25"),
    updatedAt: new Date("2026-10-24"),
  },
];

export const initialExperiences = [
  {
    id: "exp_1",
    company: "Radiantus",
    role: "Full Stack Engineer & Proprietor",
    description: "Architected and delivered production web platforms with responsive architectures, full-stack microservices, and database pipelines.",
    startDate: new Date("2024-11-01"),
    endDate: null,
    current: true,
    location: "Chandigarh",
    order: 1,
    createdAt: new Date("2024-11-01"),
    updatedAt: new Date("2026-10-24"),
  },
  {
    id: "exp_2",
    company: "The Get Now Solution",
    role: "AI & Software Engineering Intern",
    description: "Engineered real-time bidirectional speech conversion pipeline integrating LLM WebSockets with low-latency DSP.",
    startDate: new Date("2025-12-21"),
    endDate: null,
    current: true,
    location: "Remote",
    order: 2,
    createdAt: new Date("2025-12-21"),
    updatedAt: new Date("2026-10-24"),
  },
  {
    id: "exp_3",
    company: "Freelance",
    role: "Web Developer",
    description: "Making websites and bespoke software architectures for commercial businesses and startups.",
    startDate: new Date("2022-01-07"),
    endDate: new Date("2024-10-07"),
    current: false,
    location: "Remote",
    order: 3,
    createdAt: new Date("2022-01-07"),
    updatedAt: new Date("2026-10-24"),
  },
];

export const initialQualifications = [
  {
    id: "qual_1",
    degree: "Bachelor of Computer Applications (BCA)",
    institution: "Shoolini University",
    year: "2027",
    description: "Specializing in software architecture, algorithms, and distributed computing.",
    order: 1,
    createdAt: new Date("2024-08-01"),
    updatedAt: new Date("2026-10-24"),
  },
  {
    id: "qual_2",
    degree: "Computer Web Application",
    institution: "Academy",
    year: "2022",
    description: "Modern full-stack web development and responsive UI design.",
    order: 2,
    createdAt: new Date("2022-01-01"),
    updatedAt: new Date("2026-10-24"),
  },
  {
    id: "qual_3",
    degree: "BSc Agriculture",
    institution: "Rayat Bahara University",
    year: "2021",
    description: null,
    order: 3,
    createdAt: new Date("2021-01-01"),
    updatedAt: new Date("2026-10-24"),
  },
];

export const initialCertificates = [
  {
    id: "cert_1",
    title: "Learn Python Programming - Beginner to Master",
    issuer: "Abdul Bari (Udemy)",
    issueDate: new Date("2026-01-01"),
    credentialUrl: null,
    imageUrl: "/uploads/pythoncertificate_1791366399992.pdf",
    order: 1,
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-10-24"),
  },
];

export const initialSkills = [
  { id: "s1", name: "TypeScript", category: "LANGUAGE", proficiency: 95, order: 1 },
  { id: "s2", name: "Python", category: "LANGUAGE", proficiency: 92, order: 2 },
  { id: "s3", name: "Next.js 14", category: "FRAMEWORK", proficiency: 96, order: 3 },
  { id: "s4", name: "React", category: "FRAMEWORK", proficiency: 95, order: 4 },
  { id: "s5", name: "LangChain & LangGraph", category: "AI_ML", proficiency: 88, order: 5 },
  { id: "s6", name: "Autonomous Multi-Agent Architecture", category: "AI_ML", proficiency: 90, order: 6 },
  { id: "s7", name: "PostgreSQL & Prisma", category: "DATABASE", proficiency: 90, order: 7 },
  { id: "s8", name: "Docker & CI/CD", category: "TOOL", proficiency: 84, order: 8 },
  { id: "s9", name: "Tailwind CSS", category: "FRAMEWORK", proficiency: 94, order: 9 },
];

export class MockDataStore {
  siteSettings: Record<string, string> = { ...initialSiteSettings };
  profileLinks: any[] = [...initialProfileLinks];
  projects: any[] = [...initialProjects];
  experiences: any[] = [...initialExperiences];
  qualifications: any[] = [...initialQualifications];
  certificates: any[] = [...initialCertificates];
  skills: any[] = [...initialSkills];
  visitorLogs: any[] = [];
  adminUser = {
    id: "user_shubham",
    email: "shubham",
    name: "Shubham Sharma",
    role: "admin",
    password: bcrypt.hashSync("@shubham321", 10),
  };

  createProxy() {
    const store = this;

    const models: Record<string, any> = {
      user: {
        findFirst: async ({ where }: any = {}) => {
          return store.adminUser;
        },
        findUnique: async () => store.adminUser,
        findMany: async () => [store.adminUser],
        upsert: async () => store.adminUser,
        update: async () => store.adminUser,
      },
      siteSetting: {
        findMany: async () => {
          return Object.entries(store.siteSettings).map(([key, value]) => ({
            id: `set_${key}`,
            key,
            value,
            updatedAt: new Date(),
          }));
        },
        findUnique: async ({ where }: any) => {
          const val = store.siteSettings[where.key];
          if (val === undefined) return null;
          return { id: `set_${where.key}`, key: where.key, value: val, updatedAt: new Date() };
        },
        upsert: async ({ where, update, create }: any) => {
          const val = update?.value ?? create?.value ?? "";
          store.siteSettings[where.key] = val;
          return { id: `set_${where.key}`, key: where.key, value: val, updatedAt: new Date() };
        },
      },
      profileLink: {
        findMany: async ({ orderBy }: any = {}) => {
          return [...store.profileLinks].sort((a, b) => a.order - b.order);
        },
        findUnique: async ({ where }: any) => {
          return store.profileLinks.find((l) => l.key === where.key || l.id === where.id) || null;
        },
        create: async ({ data }: any) => {
          const item = { id: `link_${Date.now()}`, ...data };
          store.profileLinks.push(item);
          return item;
        },
        update: async ({ where, data }: any) => {
          const idx = store.profileLinks.findIndex((l) => l.id === where.id || l.key === where.key);
          if (idx !== -1) {
            store.profileLinks[idx] = { ...store.profileLinks[idx], ...data };
            return store.profileLinks[idx];
          }
          return data;
        },
        upsert: async ({ where, update, create }: any) => {
          const idx = store.profileLinks.findIndex((l) => l.key === where.key);
          if (idx !== -1) {
            store.profileLinks[idx] = { ...store.profileLinks[idx], ...update };
            return store.profileLinks[idx];
          }
          const item = { id: `link_${Date.now()}`, ...create };
          store.profileLinks.push(item);
          return item;
        },
        delete: async ({ where }: any) => {
          store.profileLinks = store.profileLinks.filter((l) => l.id !== where.id);
          return { id: where.id };
        },
        count: async () => store.profileLinks.length,
      },
      project: {
        findMany: async ({ where, orderBy, take }: any = {}) => {
          let list = [...store.projects];
          if (where?.category) {
            list = list.filter((p) => p.category === where.category);
          }
          if (where?.featured !== undefined) {
            list = list.filter((p) => p.featured === where.featured);
          }
          list.sort((a, b) => a.order - b.order);
          if (take) list = list.slice(0, take);
          return list;
        },
        findUnique: async ({ where }: any) => {
          return store.projects.find((p) => p.slug === where.slug || p.id === where.id) || null;
        },
        findFirst: async ({ where }: any = {}) => {
          if (!where) return store.projects[0] || null;
          return (
            store.projects.find((p) => {
              if (where.slug && p.slug === where.slug) return true;
              if (where.title && p.title.toLowerCase().includes(where.title.toLowerCase())) return true;
              return false;
            }) || null
          );
        },
        create: async ({ data }: any) => {
          const item = { id: `proj_${Date.now()}`, ...data };
          store.projects.push(item);
          return item;
        },
        update: async ({ where, data }: any) => {
          const idx = store.projects.findIndex((p) => p.id === where.id || p.slug === where.slug);
          if (idx !== -1) {
            store.projects[idx] = { ...store.projects[idx], ...data };
            return store.projects[idx];
          }
          return data;
        },
        delete: async ({ where }: any) => {
          store.projects = store.projects.filter((p) => p.id !== where.id);
          return { id: where.id };
        },
        count: async () => store.projects.length,
        upsert: async ({ where, update, create }: any) => {
          const idx = store.projects.findIndex((p) => p.slug === where.slug);
          if (idx !== -1) {
            store.projects[idx] = { ...store.projects[idx], ...update };
            return store.projects[idx];
          }
          const item = { id: `proj_${Date.now()}`, ...create };
          store.projects.push(item);
          return item;
        },
      },
      experience: {
        findMany: async ({ orderBy }: any = {}) => {
          return [...store.experiences].sort((a, b) => a.order - b.order);
        },
        create: async ({ data }: any) => {
          const item = { id: `exp_${Date.now()}`, ...data };
          store.experiences.push(item);
          return item;
        },
        update: async ({ where, data }: any) => {
          const idx = store.experiences.findIndex((e) => e.id === where.id);
          if (idx !== -1) {
            store.experiences[idx] = { ...store.experiences[idx], ...data };
            return store.experiences[idx];
          }
          return data;
        },
        delete: async ({ where }: any) => {
          store.experiences = store.experiences.filter((e) => e.id !== where.id);
          return { id: where.id };
        },
        count: async () => store.experiences.length,
      },
      qualification: {
        findMany: async ({ orderBy }: any = {}) => {
          return [...store.qualifications].sort((a, b) => a.order - b.order);
        },
        create: async ({ data }: any) => {
          const item = { id: `qual_${Date.now()}`, ...data };
          store.qualifications.push(item);
          return item;
        },
        update: async ({ where, data }: any) => {
          const idx = store.qualifications.findIndex((q) => q.id === where.id);
          if (idx !== -1) {
            store.qualifications[idx] = { ...store.qualifications[idx], ...data };
            return store.qualifications[idx];
          }
          return data;
        },
        delete: async ({ where }: any) => {
          store.qualifications = store.qualifications.filter((q) => q.id !== where.id);
          return { id: where.id };
        },
        count: async () => store.qualifications.length,
      },
      certificate: {
        findMany: async ({ orderBy }: any = {}) => {
          return [...store.certificates].sort((a, b) => a.order - b.order);
        },
        create: async ({ data }: any) => {
          const item = { id: `cert_${Date.now()}`, ...data };
          store.certificates.push(item);
          return item;
        },
        update: async ({ where, data }: any) => {
          const idx = store.certificates.findIndex((c) => c.id === where.id);
          if (idx !== -1) {
            store.certificates[idx] = { ...store.certificates[idx], ...data };
            return store.certificates[idx];
          }
          return data;
        },
        delete: async ({ where }: any) => {
          store.certificates = store.certificates.filter((c) => c.id !== where.id);
          return { id: where.id };
        },
        count: async () => store.certificates.length,
      },
      skill: {
        findMany: async ({ orderBy, take }: any = {}) => {
          let list = [...store.skills].sort((a, b) => a.order - b.order);
          if (take) list = list.slice(0, take);
          return list;
        },
        findFirst: async ({ where }: any = {}) => {
          return store.skills.find((s) => s.name === where.name) || null;
        },
        create: async ({ data }: any) => {
          const item = { id: `skill_${Date.now()}`, ...data };
          store.skills.push(item);
          return item;
        },
        update: async ({ where, data }: any) => {
          const idx = store.skills.findIndex((s) => s.id === where.id);
          if (idx !== -1) {
            store.skills[idx] = { ...store.skills[idx], ...data };
            return store.skills[idx];
          }
          return data;
        },
        delete: async ({ where }: any) => {
          store.skills = store.skills.filter((s) => s.id !== where.id);
          return { id: where.id };
        },
        count: async () => store.skills.length,
      },
      visitorLog: {
        create: async ({ data }: any) => ({ id: `log_${Date.now()}`, ...data, createdAt: new Date() }),
        findFirst: async () => null,
        findMany: async () => [],
        count: async () => 142,
        groupBy: async () => [],
        deleteMany: async () => ({ count: 0 }),
      },
    };

    return new Proxy(models, {
      get(target, prop: string) {
        if (prop === "$transaction") {
          return async (fnOrArray: any) => {
            if (Array.isArray(fnOrArray)) {
              return Promise.all(fnOrArray);
            }
            if (typeof fnOrArray === "function") {
              return fnOrArray(models);
            }
            return [];
          };
        }
        if (prop in target) {
          return target[prop];
        }
        return {
          findMany: async () => [],
          findUnique: async () => null,
          findFirst: async () => null,
          create: async ({ data }: any) => ({ id: "mock_id", ...data }),
          update: async ({ data }: any) => ({ id: "mock_id", ...data }),
          delete: async () => ({ id: "mock_id" }),
          count: async () => 0,
          upsert: async ({ create }: any) => ({ id: "mock_id", ...create }),
        };
      },
    });
  }
}

export const mockStore = new MockDataStore();
export const mockPrisma = mockStore.createProxy();
