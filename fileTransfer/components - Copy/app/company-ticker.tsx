"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";

const companyGroups = [
  ["Netflix", "Apple", "Google", "Meta", "Amazon"],
  ["Bloomberg", "Microsoft", "Shopify", "IBM", "Intuit"]
];

const companyLogos: Record<string, string> = {
  "Netflix": "https://cdn.simpleicons.org/netflix/white",
  "Apple": "https://cdn.simpleicons.org/apple/white",
  "Google": "https://upload.wikimedia.org/wikipedia/commons/3/3c/Google_Favicon_2025.svg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original",
  "Meta": "https://cdn.simpleicons.org/meta/white",
  "Amazon": "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
  "Bloomberg": "https://upload.wikimedia.org/wikipedia/commons/5/56/Bloomberg_logo.svg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original",
  "Microsoft": "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg",
  "Shopify": "https://cdn.simpleicons.org/shopify/white",
  "IBM": "https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg",
  "Intuit": "https://upload.wikimedia.org/wikipedia/commons/a/ae/Intuit_Logo.svg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original"
};

function LogoRow({ companies }: { companies: string[] }) {
  return (
    <>
      {companies.map((company) => (
        <div
          key={company}
          className="flex-1 flex items-center justify-center h-full px-8"
        >
          <img
            src={companyLogos[company]}
            alt={company}
            className="h-6 w-auto opacity-70 hover:opacity-100 transition-opacity filter brightness-0 invert"
          />
        </div>
      ))}
    </>
  );
}

export function CompanyTicker() {
  const [activeIndex, setActiveIndex] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % companyGroups.length);
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  // After the first render, enable entrance animations for subsequent groups
  useEffect(() => {
    hasAnimated.current = true;
  }, []);

  return (
    <div className="w-full glass-ticker relative z-10 mt-0 border border-white/10 rounded-sm">
      <div className="max-w-7xl mx-auto flex items-stretch">
        {/* Left text */}
        <div className="flex items-center px-6 md:px-8 h-[72px] border-r border-white/10 shrink-0">
          <p className="text-sm text-gray-400 font-semibold max-w-[180px] leading-snug">
            Questions sourced from real interviews at:
          </p>
        </div>

        {/* Logo ticker area */}
        <div className="flex-1 overflow-hidden relative h-[72px]">
          {/* Static borders overlay */}
          <div className="absolute inset-0 flex pointer-events-none z-20">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex-1 border-r border-white/10 last:border-r-0" />
            ))}
          </div>

          <AnimatePresence mode="popLayout">
            <motion.div
              key={activeIndex}
              className="absolute inset-0 flex items-stretch h-[72px]"
              initial={hasAnimated.current ? { y: "100%" } : false}
              animate={{ y: "0%" }}
              exit={{ y: "-100%" }}
              transition={{
                duration: 0.5,
                ease: [0.4, 0, 0.2, 1],
              }}
            >
              <LogoRow companies={companyGroups[activeIndex]} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
