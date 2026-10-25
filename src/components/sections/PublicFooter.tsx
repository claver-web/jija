import React from "react";
import Link from "next/link";

export function PublicFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-12 border-t border-neutral-200 dark:border-neutral-900 bg-white dark:bg-black text-neutral-500 text-xs">
      <div className="container mx-auto px-4 max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-mono text-neutral-900 dark:text-neutral-100 font-semibold">SHUBHAM SHARMA</span>
          <span>© {currentYear}. Full Stack & AI Specialist.</span>
          <a href="tel:+919877335163" className="font-mono text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white transition-colors">
            +91 9877335163
          </a>
        </div>

        <div className="flex items-center gap-6">
          <Link href="/projects" className="hover:text-black dark:hover:text-white transition-colors">
            Projects
          </Link>
          <Link href="/agentic-ai" className="hover:text-black dark:hover:text-white transition-colors">
            Agentic AI
          </Link>
          <Link href="/experience" className="hover:text-black dark:hover:text-white transition-colors">
            Experience
          </Link>
          <Link href="/admin" className="hover:text-black dark:hover:text-white transition-colors font-mono">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default PublicFooter;
