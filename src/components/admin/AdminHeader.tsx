"use client";

import React from "react";
import { signOut } from "next-auth/react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LogOut, Menu, UserCircle } from "lucide-react";

export function AdminHeader({
  userEmail,
  onMenuToggle,
}: {
  userEmail?: string;
  onMenuToggle: () => void;
}) {
  return (
    <header className="sticky top-0 z-30 h-16 w-full border-b border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md px-4 sm:px-8 flex items-center justify-between">
      {/* Mobile toggle */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-lg text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <span className="hidden sm:inline-block font-mono text-xs uppercase tracking-wider text-neutral-400">
          Portfolio Control Panel
        </span>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-4">
        {/* User email badge */}
        {userEmail && (
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-xs font-mono text-neutral-700 dark:text-neutral-300">
            <UserCircle className="w-4 h-4 text-neutral-400" />
            <span>{userEmail}</span>
          </div>
        )}

        <ThemeToggle />

        {/* Logout */}
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-red-500 hover:border-red-300 dark:hover:border-red-900 hover:bg-red-50 dark:hover:bg-red-950/30 text-xs font-medium transition-colors"
          title="Sign Out"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}

export default AdminHeader;
