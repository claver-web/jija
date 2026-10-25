import React from "react";
import { PublicNav } from "@/components/sections/PublicNav";
import { PublicFooter } from "@/components/sections/PublicFooter";
import { ScrollProgress } from "@/components/motion/ScrollProgress";
import { CursorGlow } from "@/components/motion/CursorGlow";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen relative">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-black focus:text-white dark:focus:bg-white dark:focus:text-black focus:rounded-md focus:shadow-xl focus:outline-none font-mono text-xs"
      >
        Skip to main content
      </a>
      <ScrollProgress />
      <CursorGlow />
      <PublicNav />
      <main id="main-content" className="flex-1" tabIndex={-1}>
        {children}
      </main>
      <PublicFooter />
    </div>
  );
}
