"use client";

import React, { useState } from "react";
import { Mail, Phone, Copy, Check, ArrowRight } from "lucide-react";

interface CTASectionProps {
  email?: string;
  phone?: string;
}

export function CTASection({
  email = "contact@portfolio.local",
  phone = "9877335163",
}: CTASectionProps) {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  const copyEmail = () => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(email);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2500);
    }
  };

  const copyPhone = () => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(phone);
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2500);
    }
  };

  return (
    <section className="py-28 px-4 sm:px-6 lg:px-8 border-b border-neutral-200 dark:border-neutral-900 bg-white dark:bg-black relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-neutral-200/40 dark:bg-neutral-900/60 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-neutral-500 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-neutral-900 dark:bg-neutral-100" />
          Get In Touch
        </div>

        <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-neutral-950 dark:text-white mb-6">
          Let’s build something remarkable together.
        </h2>

        <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto mb-10 leading-relaxed font-normal">
          Whether you’re architecting an agentic AI system, scaling a mission-critical web platform, or exploring new collaborations.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <a
            href={`tel:${phone}`}
            className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-lg bg-black text-white dark:bg-white dark:text-black font-medium text-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg"
          >
            <Phone className="w-4 h-4" />
            <span>Call {phone}</span>
            <ArrowRight className="w-4 h-4" />
          </a>

          <button
            onClick={copyPhone}
            className="inline-flex items-center gap-2 px-5 py-3.5 rounded-lg border border-neutral-300 dark:border-neutral-800 bg-neutral-50/80 dark:bg-neutral-900/80 text-neutral-900 dark:text-neutral-200 font-mono text-xs transition-all duration-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            aria-label="Copy phone number"
          >
            {copiedPhone ? (
              <>
                <Check className="w-4 h-4 text-emerald-500" />
                <span>Copied Phone</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-neutral-500" />
                <span>{phone}</span>
              </>
            )}
          </button>

          <a
            href={`mailto:${email}`}
            className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-lg border border-neutral-300 dark:border-neutral-800 bg-neutral-50/80 dark:bg-neutral-900/80 text-neutral-900 dark:text-neutral-200 font-medium text-sm transition-all duration-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            <Mail className="w-4 h-4" />
            <span>Send Email</span>
          </a>

          <button
            onClick={copyEmail}
            className="inline-flex items-center gap-2 px-5 py-3.5 rounded-lg border border-neutral-300 dark:border-neutral-800 bg-neutral-50/80 dark:bg-neutral-900/80 text-neutral-900 dark:text-neutral-200 font-mono text-xs transition-all duration-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            aria-label="Copy email address"
          >
            {copiedEmail ? (
              <>
                <Check className="w-4 h-4 text-emerald-500" />
                <span>Copied Email</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-neutral-500" />
                <span>{email}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}

export default CTASection;
