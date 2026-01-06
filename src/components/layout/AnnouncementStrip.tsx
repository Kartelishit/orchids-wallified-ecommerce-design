"use client";

import { motion } from "framer-motion";

const messages = [
  "Build walls that feel like YOU",
  "Free shipping on prepaid orders",
  "Custom designs included",
  "Upgrade your wall today",
];

export default function AnnouncementStrip() {
  const repeatedMessages = [...messages, ...messages, ...messages]; // Duplicate for seamless loop

  return (
    <div className="bg-[#FF0000] py-2 overflow-hidden relative h-10 flex items-center">
      <motion.div
        animate={{
          x: [-1000, 0], // Move from left to right
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
        className="flex whitespace-nowrap gap-20 px-10"
      >
        {repeatedMessages.map((msg, i) => (
          <span
            key={i}
            className="text-white text-sm font-bold tracking-wider uppercase inline-block"
          >
            {msg}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
