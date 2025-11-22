"use client";

import { motion } from "framer-motion";

export function Reveal({
  children,
  delay = 0,
  amount = 0.4,
}: {
  children: React.ReactNode;
  delay?: number;
  amount?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.4, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
}
