import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { ProjectCategory, ProjectStatus, SkillCategory } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");
    const expectedSecret = process.env.SETUP_SECRET || process.env.ADMIN_PASSWORD;

    if (!expectedSecret || token !== expectedSecret) {
      return NextResponse.json(
        { error: "Unauthorized. Pass ?token=<ADMIN_PASSWORD> to initialize." },
        { status: 401 }
      );
    }

    const adminEmail = process.env.ADMIN_EMAIL || "shubham";
    const adminRawPassword = process.env.ADMIN_PASSWORD || "@shubham321";
    const hashedPassword = await bcrypt.hash(adminRawPassword, 12);

    // Upsert Admin User
    const admin = await prisma.user.upsert({
      where: { email: adminEmail },
      update: { name: "Shubham Sharma", password: hashedPassword },
      create: {
        email: adminEmail,
        name: "Shubham Sharma",
        password: hashedPassword,
        role: "admin",
      },
    });

    // Default Profile Links
    const links = [
      { key: "github", label: "GitHub (Personal)", url: "https://github.com", icon: "github", order: 1 },
      { key: "githubWork", label: "GitHub (Work)", url: "https://github.com", icon: "githubWork", order: 2 },
      { key: "linkedin", label: "LinkedIn", url: "https://linkedin.com", icon: "linkedin", order: 3 },
      { key: "leetcode", label: "LeetCode", url: "https://leetcode.com", icon: "leetcode", order: 4 },
      { key: "resume", label: "Resume", url: "/resume.pdf", icon: "resume", order: 5 },
    ];

    for (const l of links) {
      await prisma.profileLink.upsert({
        where: { key: l.key },
        update: { label: l.label, url: l.url, order: l.order },
        create: l,
      });
    }

    // Default Site Settings
    const settings = [
      { key: "heroTitle", value: "Engineering Scalable Systems & Autonomous AI Agents" },
      { key: "tagline", value: "Full Stack Engineer & AI Specialist passionate about deterministic architectures and minimalist monochrome software." },
      { key: "bio", value: "I design and build end-to-end distributed applications and autonomous agentic AI workflows." },
      { key: "resumeUrl", value: "/resume.pdf" },
      { key: "email", value: adminEmail },
      { key: "location", value: "San Francisco, CA / Remote" },
      { key: "githubReposUrl", value: "https://api.github.com/users/claver-web/repos" },
    ];

    for (const s of settings) {
      await prisma.siteSetting.upsert({
        where: { key: s.key },
        update: { value: s.value },
        create: s,
      });
    }

    // Default Project
    await prisma.project.upsert({
      where: { slug: "omni-portfolio-system" },
      update: {},
      create: {
        title: "OmniPortfolio System",
        slug: "omni-portfolio-system",
        description: "A production-grade, minimalist portfolio powered by Next.js 14, PostgreSQL, NextAuth, and privacy-first analytics.",
        readme: `# OmniPortfolio System\n\nProduction-ready monochrome engineering portfolio with CMS admin dashboard.\n\n## Stack\n- Next.js 14 App Router\n- Prisma ORM + PostgreSQL\n- Secure Admin Panel\n- Privacy-friendly telemetry`,
        techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Prisma", "PostgreSQL"],
        category: ProjectCategory.WEBSITE,
        status: ProjectStatus.LIVE,
        featured: true,
        order: 1,
      },
    });

    return NextResponse.json({
      status: "success",
      message: `Setup completed successfully! Admin: ${admin.email}`,
      admin: admin.email,
    });
  } catch (error: any) {
    console.error("Setup error:", error);
    return NextResponse.json({ error: error?.message || "Setup failed" }, { status: 500 });
  }
}
