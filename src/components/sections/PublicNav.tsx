"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Menu, X, Shield, Terminal } from "lucide-react";

const NAV_LINKS = [
  { href: "/#live-deployments", label: "Live Sites" },
  { href: "/projects", label: "Projects" },
  { href: "/agentic-ai", label: "Agentic AI" },
  { href: "/experience", label: "Experience" },
  { href: "/skills", label: "Skills" },
  { href: "/certificates", label: "Certificates" },
];

export function PublicNav() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-200 dark:border-neutral-900 bg-white/90 dark:bg-black/90 backdrop-blur-md transition-colors">
      <div className="container mx-auto px-4 max-w-6xl h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <Link
          href="/"
          className="group flex items-center gap-2.5 min-h-[44px] text-sm font-semibold tracking-tight text-neutral-900 dark:text-white"
        >
          <div className="w-8 h-8 rounded-lg bg-black text-white dark:bg-white dark:text-black flex items-center justify-center font-mono text-xs font-bold transition-transform duration-200 group-hover:scale-105 shadow-sm">
            <Terminal className="w-4 h-4" />
          </div>
          <span className="font-mono text-sm tracking-wider">SHUBHAM SHARMA</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`min-h-[44px] inline-flex items-center px-3.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                  isActive
                    ? "bg-neutral-100 text-black dark:bg-neutral-900 dark:text-white font-semibold"
                    : "text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-900/50"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Controls: Theme Toggle & Admin Shortcut */}
        <div className="flex items-center gap-2">
          <ThemeToggle />

          <Link
            href="/admin"
            aria-label="Admin panel"
            className="min-w-[44px] min-h-[44px] inline-flex items-center justify-center rounded-lg border border-neutral-200 dark:border-neutral-800 text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
            title="Admin Login"
          >
            <Shield className="w-4 h-4" />
          </Link>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden min-w-[44px] min-h-[44px] inline-flex items-center justify-center rounded-lg border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile navigation drop-down */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-neutral-200 dark:border-neutral-900 bg-white dark:bg-black px-4 py-4 space-y-1">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`min-h-[44px] flex items-center px-4 rounded-lg text-sm font-medium ${
                  isActive
                    ? "bg-neutral-100 dark:bg-neutral-900 text-black dark:text-white font-semibold"
                    : "text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}

export default PublicNav;
