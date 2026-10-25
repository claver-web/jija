import { PrismaClient, ProjectCategory, ProjectStatus, SkillCategory } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding for Shubham Sharma...");

  // 1. Admin User
  const adminEmail = process.env.ADMIN_EMAIL || "shubham";
  const adminRawPassword = process.env.ADMIN_PASSWORD || "@shubham321";
  const hashedPassword = await bcrypt.hash(adminRawPassword, 12);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      name: "Shubham Sharma",
      password: hashedPassword,
    },
    create: {
      email: adminEmail,
      name: "Shubham Sharma",
      password: hashedPassword,
      role: "admin",
    },
  });
  console.log(`👤 Admin user seeded: ${admin.email}`);

  // 2. Default Profile Links
  const defaultLinks = [
    {
      key: "github",
      label: "GitHub (Personal)",
      url: "https://github.com",
      icon: "Github",
      order: 1,
    },
    {
      key: "githubWork",
      label: "GitHub (Work)",
      url: "https://github.com",
      icon: "GitBranch",
      order: 2,
    },
    {
      key: "linkedin",
      label: "LinkedIn",
      url: "https://linkedin.com",
      icon: "Linkedin",
      order: 3,
    },
    {
      key: "leetcode",
      label: "LeetCode",
      url: "https://leetcode.com",
      icon: "Code2",
      order: 4,
    },
    {
      key: "resume",
      label: "Resume",
      url: "/resume.pdf",
      icon: "FileText",
      order: 5,
    },
  ];

  for (const link of defaultLinks) {
    await prisma.profileLink.upsert({
      where: { key: link.key },
      update: {
        label: link.label,
        url: link.url,
        icon: link.icon,
        order: link.order,
      },
      create: link,
    });
  }
  console.log(`🔗 Seeded ${defaultLinks.length} profile links`);

  // 3. Site Settings
  const settings = [
    { key: "heroTitle", value: "Crafting High-Impact Intelligent Systems" },
    { key: "tagline", value: "Full Stack Engineer & AI Specialist passionate about autonomous agents and modern web architectures." },
    { key: "bio", value: "I design and engineer end-to-end full-stack applications and autonomous agentic AI workflows. Dedicated to clean code, robust performance, and minimalist monochrome UI." },
    { key: "resumeUrl", value: "/resume.pdf" },
    { key: "email", value: "contact@portfolio.local" },
    { key: "phone", value: "9877335163" },
    { key: "name", value: "Shubham Sharma" },
    { key: "location", value: "Chandigarh, India / Remote" },
    { key: "githubReposUrl", value: "https://api.github.com/users/claver-web/repos" },
  ];

  for (const s of settings) {
    await prisma.siteSetting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: s,
    });
  }
  console.log(`⚙️ Seeded ${settings.length} site settings`);

  // 4. Skills
  const sampleSkills = [
    { name: "TypeScript", category: SkillCategory.LANGUAGE, proficiency: 95, order: 1 },
    { name: "Python", category: SkillCategory.LANGUAGE, proficiency: 92, order: 2 },
    { name: "Next.js / React", category: SkillCategory.FRAMEWORK, proficiency: 96, order: 3 },
    { name: "Node.js", category: SkillCategory.FRAMEWORK, proficiency: 88, order: 4 },
    { name: "PostgreSQL & Prisma", category: SkillCategory.DATABASE, proficiency: 90, order: 5 },
    { name: "LangChain / LangGraph", category: SkillCategory.AI_ML, proficiency: 88, order: 6 },
    { name: "Autonomous Multi-Agent Architecture", category: SkillCategory.AI_ML, proficiency: 90, order: 7 },
    { name: "Docker & CI/CD", category: SkillCategory.TOOL, proficiency: 84, order: 8 },
    { name: "Tailwind CSS", category: SkillCategory.FRAMEWORK, proficiency: 94, order: 9 },
  ];

  for (const skill of sampleSkills) {
    const existing = await prisma.skill.findFirst({ where: { name: skill.name } });
    if (existing) {
      await prisma.skill.update({
        where: { id: existing.id },
        data: skill,
      });
    } else {
      await prisma.skill.create({ data: skill });
    }
  }
  console.log(`⚡ Seeded ${sampleSkills.length} skills`);

  // 5. Projects
  const projects = [
    {
      title: "GoalBook — Distributed Microservices & Multi-Agent Architecture",
      slug: "goalbook-servers",
      description: "Enterprise distributed ecosystem featuring a 3-node PostgreSQL replication cluster, FastAPI AI vector search with ChromaDB & PyMuPDF, Next.js web application, and React Native Expo mobile app.",
      readme: `# GoalBook Distributed Architecture\n\nBuilt with ❤️ by **Shubham Sharma** • Multi-Agent microservices platform.`,
      liveUrl: null,
      repoUrl: "https://github.com/shubham-sharma/GoalBook_Servers",
      techStack: ["Next.js", "FastAPI", "PostgreSQL", "Docker", "ChromaDB", "TypeScript"],
      category: ProjectCategory.WEBSITE,
      status: ProjectStatus.LIVE,
      featured: true,
      order: 1,
    },
    {
      title: "LangGPT — Autonomous Context Memory AI Chat",
      slug: "langgpt",
      description: "High-performance conversational AI platform powered by LangChain and Google Gemini 2.5 on Next.js 16 (React 19). Features dynamic narrative memory synthesis that maintains persistent user context across sessions without rigid key-value schemas.",
      readme: `# LangGPT\n\nHigh-performance AI chat interface with persistent narrative context memory engineered by **Shubham Sharma**.`,
      liveUrl: "https://langgpt.shubhamport.online",
      repoUrl: "https://github.com/shubham-sharma/LangGPT",
      techStack: ["Next.js 16", "LangChain", "Gemini 2.5", "React 19", "Tailwind CSS", "Zustand"],
      category: ProjectCategory.AGENTIC_AI,
      status: ProjectStatus.LIVE,
      featured: true,
      thumbnail: "/screenshots/langgpt.png",
      order: 2,
    },
    {
      title: "SystemAccentChanger — Real-Time AI Audio Accent Converter & Virtual Mic",
      slug: "system-accent-changer",
      description: "Real-time bidirectional speech conversion pipeline integrating Google Gemini Live WebSockets with a PulseAudio/PipeWire virtual microphone null-sink and low-latency DSP noise gate.",
      readme: `# SystemAccentChanger\n\nReal-Time AI Audio Accent Converter & Virtual Microphone engineered by **Shubham Sharma**.`,
      liveUrl: null,
      repoUrl: "https://github.com/shubham-sharma/SystemAccentChanger",
      techStack: ["Python", "FastAPI", "WebSockets", "PulseAudio", "DSP"],
      category: ProjectCategory.AGENTIC_AI,
      status: ProjectStatus.LIVE,
      featured: true,
      order: 3,
    },
    {
      title: "Coursey — Online Learning Platform & Marketplace",
      slug: "coursey",
      description: "Modern, secure course-selling marketplace with enterprise authentication, video streaming pipelines, interactive course curriculums, and administrative control suites.",
      readme: `# Coursey\n\nProduction Online Learning Platform & Marketplace engineered by **Shubham Sharma**.`,
      liveUrl: "https://coursey.shubhamport.online",
      repoUrl: null,
      techStack: ["Next.js", "TypeScript", "Tailwind CSS", "PostgreSQL", "Prisma", "Stripe"],
      category: ProjectCategory.WEBSITE,
      status: ProjectStatus.LIVE,
      featured: true,
      thumbnail: "/screenshots/coursey.png",
      order: 4,
    },
    {
      title: "Vishram Sthal — Luxury Hotel & Spiritual Retreat",
      slug: "vishram-sthal",
      description: "High-conversion hospitality web platform for a luxury retreat and wedding venue. Features interactive venue discovery, booking management, Google Maps integration, and event reservation workflows.",
      readme: `# Vishram Sthal\n\nLuxury Hotel & Retreat hospitality platform engineered by **Shubham Sharma**.`,
      liveUrl: "https://www.radiantus.buzz",
      repoUrl: null,
      techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "Google Maps API"],
      category: ProjectCategory.WEBSITE,
      status: ProjectStatus.LIVE,
      featured: true,
      thumbnail: "/screenshots/radiantus.png",
      order: 5,
    },
  ];

  for (const proj of projects) {
    await prisma.project.upsert({
      where: { slug: proj.slug },
      update: proj,
      create: proj,
    });
  }
  console.log(`🚀 Seeded ${projects.length} projects`);

  // 6. Experience
  const experiences = [
    {
      company: "Radiantus",
      role: "Full Stack Engineer & Proprietor",
      description: "Architected and delivered production web platforms with responsive architectures, full-stack microservices, and database pipelines.",
      startDate: new Date("2024-11-01"),
      endDate: null,
      current: true,
      location: "Chandigarh",
      order: 1,
    },
    {
      company: "The Get Now Solution",
      role: "AI & Software Engineering Intern",
      description: "Engineered real-time bidirectional speech conversion pipeline integrating LLM WebSockets with low-latency DSP.",
      startDate: new Date("2025-12-21"),
      endDate: null,
      current: true,
      location: "Remote",
      order: 2,
    },
    {
      company: "Freelance",
      role: "Web Developer",
      description: "Making websites and bespoke software architectures for commercial businesses and startups.",
      startDate: new Date("2022-01-07"),
      endDate: new Date("2024-10-07"),
      current: false,
      location: "Remote",
      order: 3,
    },
  ];

  await prisma.experience.deleteMany({});
  for (const exp of experiences) {
    await prisma.experience.create({ data: exp });
  }
  console.log(`💼 Seeded ${experiences.length} experiences`);

  // 7. Qualifications
  const qualifications = [
    {
      degree: "Bachelor of Computer Applications (BCA)",
      institution: "Shoolini University",
      year: "2027",
      description: "Specializing in software architecture, algorithms, and distributed computing.",
      order: 1,
    },
    {
      degree: "Computer Web Application",
      institution: "Academy",
      year: "2022",
      description: "Modern full-stack web development and responsive UI design.",
      order: 2,
    },
    {
      degree: "BSc Agriculture",
      institution: "Rayat Bahara University",
      year: "2021",
      description: null,
      order: 3,
    },
  ];

  await prisma.qualification.deleteMany({});
  for (const q of qualifications) {
    await prisma.qualification.create({ data: q });
  }
  console.log(`🎓 Seeded ${qualifications.length} qualifications`);

  // 8. Certificates
  await prisma.certificate.deleteMany({});
  await prisma.certificate.create({
    data: {
      title: "Learn Python Programming - Beginner to Master",
      issuer: "Abdul Bari (Udemy)",
      issueDate: new Date("2026-01-01"),
      imageUrl: "/uploads/pythoncertificate_1791366399992.pdf",
      order: 1,
    },
  });
  console.log(`📜 Seeded certificate for Shubham Sharma`);

  console.log("✅ Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
