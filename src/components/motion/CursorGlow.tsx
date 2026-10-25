"use client";

import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";

export function CursorGlow() {
  const shouldReduceMotion = useReducedMotion();
  const [isDesktop, setIsDesktop] = useState(false);

  const mouseX = useMotionValue(-500);
  const mouseY = useMotionValue(-500);

  const springConfig = { damping: 30, stiffness: 200 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Only enable on devices with fine pointer (mouse/trackpad, not touch)
    const media = window.matchMedia("(pointer: fine)");
    setIsDesktop(media.matches);

    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    media.addEventListener("change", handler);

    let rafId: number | null = null;
    const onMouseMove = (e: MouseEvent) => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        mouseX.set(e.clientX - 160);
        mouseY.set(e.clientY - 160);
        rafId = null;
      });
    };

    if (media.matches) {
      window.addEventListener("mousemove", onMouseMove, { passive: true });
    }

    return () => {
      media.removeEventListener("change", handler);
      window.removeEventListener("mousemove", onMouseMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [mouseX, mouseY]);

  if (shouldReduceMotion || !isDesktop) {
    return null;
  }

  return (
    <motion.div
      style={{
        x: smoothX,
        y: smoothY,
      }}
      className="pointer-events-none fixed top-0 left-0 w-80 h-80 rounded-full bg-neutral-300/30 dark:bg-neutral-800/25 blur-[120px] z-10"
    />
  );
}

export default CursorGlow;
