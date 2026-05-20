"use client";

import { motion } from "motion/react";
import { ReactNode } from "react";

interface ScrollAnimationProps {
  children: ReactNode;
  direction?: "left" | "right" | "down";
  className?: string;
}

export function ScrollAnimation({ children, direction = "down", className = "" }: ScrollAnimationProps) {
  const getInitial = () => {
    switch (direction) {
      case "left":
        return { opacity: 0, x: -100, y: 0 };
      case "right":
        return { opacity: 0, x: 100, y: 0 };
      case "down":
        return { opacity: 0, x: 0, y: 100 };
      default:
        return { opacity: 0, x: 0, y: 0 };
    }
  };

  return (
    <motion.div
      initial={getInitial()}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
