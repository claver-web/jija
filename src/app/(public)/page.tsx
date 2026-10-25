import React from "react";
import { prisma } from "@/lib/prisma";
import { Hero } from "@/components/sections/Hero";
import { SocialLinks } from "@/components/sections/SocialLinks";
import { LiveWebsitesShowcase } from "@/components/sections/LiveWebsitesShowcase";
import { FeaturedProjects } from "@/components/sections/FeaturedProjects";
import { GitHubReposSection } from "@/components/sections/GitHubReposSection";
import { SkillsPreview } from "@/components/sections/SkillsPreview";
import { CTASection } from "@/components/sections/CTASection";

export const revalidate = 60; // Revalidate every 60 seconds

async function getSiteSettings() {
  try {
    const settings = await prisma.siteSetting.findMany();
    const map: Record<string, string> = {};
    for (const s of settings) {
      map[s.key] = s.value;
    }
    return map;
  } catch (error) {
    console.error("Error loading site settings:", error);
    return {};
  }
}

export default async function HomePage() {
  const settings = await getSiteSettings();

  return (
    <div className="flex flex-col">
      <Hero
        title={settings.heroTitle}
        tagline={settings.tagline}
        resumeUrl={settings.resumeUrl}
      />
      <SocialLinks />
      <LiveWebsitesShowcase />
      <FeaturedProjects />
      <GitHubReposSection />
      <SkillsPreview />
      <CTASection email={settings.email} phone={settings.phone || "9877335163"} />
    </div>
  );
}
