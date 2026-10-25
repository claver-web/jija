import React from "react";
import { prisma } from "@/lib/prisma";
import {
  GitBranch,
  Code2,
  FileText,
  Mail,
  Globe,
  ArrowUpRight,
} from "lucide-react";
import { GithubIcon, LinkedinIcon, TwitterIcon } from "@/components/ui/Icons";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  github: GithubIcon,
  githubWork: GitBranch,
  linkedin: LinkedinIcon,
  leetcode: Code2,
  resume: FileText,
  email: Mail,
  twitter: TwitterIcon,
  website: Globe,
};

export async function SocialLinks() {
  let links: Array<{
    id: string;
    key: string;
    label: string;
    url: string;
    icon: string | null;
  }> = [];

  try {
    links = await prisma.profileLink.findMany({
      orderBy: { order: "asc" },
    });
  } catch (error) {
    console.error("Failed to load profile links:", error);
  }

  if (links.length === 0) {
    links = [
      { id: "1", key: "github", label: "GitHub (Personal)", url: "https://github.com", icon: "github" },
      { id: "2", key: "githubWork", label: "GitHub (Work)", url: "https://github.com", icon: "githubWork" },
      { id: "3", key: "linkedin", label: "LinkedIn", url: "https://linkedin.com", icon: "linkedin" },
      { id: "4", key: "leetcode", label: "LeetCode", url: "https://leetcode.com", icon: "leetcode" },
      { id: "5", key: "resume", label: "Resume", url: "/resume.pdf", icon: "resume" },
    ];
  }

  return (
    <section className="py-12 border-b border-neutral-200 dark:border-neutral-900 bg-neutral-50/50 dark:bg-neutral-950/50">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          {links.map((link) => {
            const Icon = ICON_MAP[link.key] || (link.icon ? ICON_MAP[link.icon] : null) || Globe;
            const isExternal = link.url.startsWith("http");

            return (
              <a
                key={link.id}
                href={link.url}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
                className="group relative flex items-center gap-2.5 px-4 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/80 hover:border-neutral-400 dark:hover:border-neutral-600 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm"
              >
                <div className="p-1 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 group-hover:text-black dark:group-hover:text-white transition-colors">
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-xs sm:text-sm font-medium text-neutral-700 dark:text-neutral-300 group-hover:text-black dark:group-hover:text-white transition-colors">
                  {link.label}
                </span>
                <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default SocialLinks;
