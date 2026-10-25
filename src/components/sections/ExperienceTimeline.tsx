"use client";

import React from "react";
import { motion } from "framer-motion";
import { Briefcase, Calendar, MapPin } from "lucide-react";

interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  description: string;
  startDate: string;
  endDate: string | null;
  current: boolean;
  location: string | null;
}

export function ExperienceTimeline({ experiences }: { experiences: ExperienceItem[] }) {
  if (experiences.length === 0) {
    return (
      <div className="p-12 text-center border border-dashed border-neutral-300 dark:border-neutral-800 rounded-xl">
        <p className="text-neutral-500 text-sm">No work experience listed yet.</p>
      </div>
    );
  }

  return (
    <div className="relative border-l border-neutral-200 dark:border-neutral-800 ml-4 md:ml-8 pl-6 md:pl-10 space-y-12">
      {experiences.map((exp, index) => {
        const initials = exp.company
          .split(" ")
          .map((n) => n[0])
          .slice(0, 2)
          .join("")
          .toUpperCase();

        return (
          <motion.div
            key={exp.id}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="relative group"
          >
            {/* Timeline bullet with initials */}
            <div className="absolute -left-[41px] md:-left-[57px] top-1 w-8 h-8 md:w-9 md:h-9 rounded-full bg-black text-white dark:bg-white dark:text-black flex items-center justify-center font-mono text-xs font-bold ring-4 ring-white dark:ring-black shadow-md">
              {initials}
            </div>

            <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-6 md:p-8 transition-all duration-300 hover:border-neutral-400 dark:hover:border-neutral-600 hover:shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <h3 className="text-xl font-bold text-neutral-950 dark:text-white">
                  {exp.role} <span className="text-neutral-400 dark:text-neutral-500 font-normal">at</span>{" "}
                  <span className="text-neutral-900 dark:text-neutral-100">{exp.company}</span>
                </h3>

                <div className="inline-flex items-center gap-1.5 text-xs font-mono text-neutral-500 shrink-0">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>
                    {exp.startDate} — {exp.current ? "Present" : exp.endDate || "N/A"}
                  </span>
                </div>
              </div>

              {exp.location && (
                <div className="inline-flex items-center gap-1 text-xs text-neutral-500 mb-4">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{exp.location}</span>
                </div>
              )}

              <p className="text-neutral-600 dark:text-neutral-400 text-sm sm:text-base leading-relaxed whitespace-pre-line font-normal">
                {exp.description}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
