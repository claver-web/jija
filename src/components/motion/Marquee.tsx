"use client";

import React from "react";
import { useReducedMotion } from "framer-motion";

interface MarqueeProps {
  children: React.ReactNode;
  speed?: number; // seconds
  pauseOnHover?: boolean;
  className?: string;
}

export function Marquee({
  children,
  speed = 25,
  pauseOnHover = true,
  className = "",
}: MarqueeProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return (
      <div className={`flex flex-wrap gap-4 overflow-x-auto ${className}`}>
        {children}
      </div>
    );
  }

  return (
    <div
      className={`group relative flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] ${className}`}
    >
      <div
        className={`flex min-w-full shrink-0 items-center justify-around gap-4 animate-marquee ${
          pauseOnHover ? "group-hover:[animation-play-state:paused]" : ""
        }`}
        style={{ animationDuration: `${speed}s` }}
      >
        {children}
      </div>
      <div
        aria-hidden="true"
        className={`flex min-w-full shrink-0 items-center justify-around gap-4 animate-marquee ${
          pauseOnHover ? "group-hover:[animation-play-state:paused]" : ""
        }`}
        style={{ animationDuration: `${speed}s` }}
      >
        {children}
      </div>
    </div>
  );
}

export default Marquee;
