"use client";

import { motion } from "framer-motion";

/* ── shape type ── */
export interface ShapeDef {
  type: "diamond" | "circle" | "ring" | "triangle" | "cross" | "hexagon" | "square";
  top: string;
  left: string;
  size: number;
  rotate: number;
  delay: number;
  duration: number;
  color: string;
  opacity?: number;
}

/* ── per-section shape sets ── */
const HERO_SHAPES: ShapeDef[] = [
  {
    type: "diamond",
    top: "6%",
    left: "4%",
    size: 16,
    rotate: 45,
    delay: 0,
    duration: 7,
    color: "var(--color-primary-600)",
  },
  {
    type: "circle",
    top: "12%",
    left: "92%",
    size: 10,
    rotate: 0,
    delay: 1,
    duration: 6,
    color: "var(--color-accent-cyan)",
  },
  {
    type: "triangle",
    top: "78%",
    left: "8%",
    size: 14,
    rotate: 15,
    delay: 0.5,
    duration: 8,
    color: "var(--color-primary-400)",
  },
  {
    type: "ring",
    top: "82%",
    left: "88%",
    size: 20,
    rotate: 0,
    delay: 2,
    duration: 9,
    color: "var(--color-primary-700)",
  },
  {
    type: "cross",
    top: "28%",
    left: "94%",
    size: 11,
    rotate: 20,
    delay: 1.5,
    duration: 7,
    color: "var(--color-primary-300)",
    opacity: 0.08,
  },
  {
    type: "hexagon",
    top: "45%",
    left: "2%",
    size: 18,
    rotate: 30,
    delay: 0.8,
    duration: 8.5,
    color: "var(--color-accent-pink)",
    opacity: 0.07,
  },
  {
    type: "square",
    top: "65%",
    left: "96%",
    size: 12,
    rotate: 12,
    delay: 3,
    duration: 7.5,
    color: "var(--color-primary-600)",
    opacity: 0.09,
  },
  {
    type: "circle",
    top: "90%",
    left: "50%",
    size: 6,
    rotate: 0,
    delay: 2.5,
    duration: 6.5,
    color: "var(--color-primary-400)",
    opacity: 0.1,
  },
  {
    type: "diamond",
    top: "3%",
    left: "55%",
    size: 10,
    rotate: 45,
    delay: 1.2,
    duration: 7,
    color: "var(--color-accent-cyan)",
    opacity: 0.06,
  },
];

const JOURNEY_SHAPES: ShapeDef[] = [
  {
    type: "triangle",
    top: "5%",
    left: "88%",
    size: 16,
    rotate: -20,
    delay: 0.3,
    duration: 8,
    color: "var(--color-primary-400)",
  },
  {
    type: "ring",
    top: "15%",
    left: "4%",
    size: 18,
    rotate: 0,
    delay: 1,
    duration: 7.5,
    color: "var(--color-accent-cyan)",
  },
  {
    type: "diamond",
    top: "40%",
    left: "93%",
    size: 14,
    rotate: 45,
    delay: 0.6,
    duration: 6.5,
    color: "var(--color-primary-600)",
  },
  {
    type: "circle",
    top: "60%",
    left: "2%",
    size: 8,
    rotate: 0,
    delay: 2,
    duration: 7,
    color: "var(--color-primary-300)",
  },
  {
    type: "cross",
    top: "75%",
    left: "90%",
    size: 12,
    rotate: -10,
    delay: 1.5,
    duration: 8.5,
    color: "var(--color-primary-700)",
  },
  {
    type: "hexagon",
    top: "88%",
    left: "6%",
    size: 15,
    rotate: 15,
    delay: 0.9,
    duration: 9,
    color: "var(--color-accent-pink)",
    opacity: 0.08,
  },
  {
    type: "square",
    top: "30%",
    left: "96%",
    size: 10,
    rotate: 22,
    delay: 2.2,
    duration: 7,
    color: "var(--color-primary-400)",
    opacity: 0.07,
  },
  {
    type: "circle",
    top: "50%",
    left: "95%",
    size: 6,
    rotate: 0,
    delay: 3,
    duration: 6,
    color: "var(--color-accent-cyan)",
    opacity: 0.09,
  },
  {
    type: "triangle",
    top: "92%",
    left: "85%",
    size: 10,
    rotate: 40,
    delay: 1.8,
    duration: 7.5,
    color: "var(--color-primary-600)",
    opacity: 0.06,
  },
];

const CRAFT_SHAPES: ShapeDef[] = [
  {
    type: "hexagon",
    top: "8%",
    left: "3%",
    size: 20,
    rotate: 10,
    delay: 0.2,
    duration: 8,
    color: "var(--color-primary-400)",
  },
  {
    type: "circle",
    top: "10%",
    left: "94%",
    size: 12,
    rotate: 0,
    delay: 1.3,
    duration: 7,
    color: "var(--color-accent-pink)",
  },
  {
    type: "diamond",
    top: "50%",
    left: "1%",
    size: 14,
    rotate: 45,
    delay: 0.7,
    duration: 6.5,
    color: "var(--color-primary-600)",
  },
  {
    type: "cross",
    top: "35%",
    left: "96%",
    size: 13,
    rotate: 15,
    delay: 2,
    duration: 8.5,
    color: "var(--color-primary-300)",
    opacity: 0.08,
  },
  {
    type: "ring",
    top: "80%",
    left: "5%",
    size: 16,
    rotate: 0,
    delay: 1.5,
    duration: 9,
    color: "var(--color-accent-cyan)",
  },
  {
    type: "triangle",
    top: "85%",
    left: "92%",
    size: 12,
    rotate: -25,
    delay: 0.4,
    duration: 7.5,
    color: "var(--color-primary-700)",
  },
  {
    type: "square",
    top: "25%",
    left: "2%",
    size: 10,
    rotate: 30,
    delay: 2.5,
    duration: 7,
    color: "var(--color-accent-pink)",
    opacity: 0.07,
  },
  {
    type: "circle",
    top: "65%",
    left: "97%",
    size: 7,
    rotate: 0,
    delay: 3.2,
    duration: 6.5,
    color: "var(--color-primary-400)",
    opacity: 0.09,
  },
  {
    type: "diamond",
    top: "4%",
    left: "60%",
    size: 8,
    rotate: 45,
    delay: 1.8,
    duration: 7,
    color: "var(--color-primary-600)",
    opacity: 0.06,
  },
  {
    type: "hexagon",
    top: "70%",
    left: "50%",
    size: 10,
    rotate: 20,
    delay: 2.8,
    duration: 8,
    color: "var(--color-accent-cyan)",
    opacity: 0.05,
  },
];

const ABOUT_SHAPES: ShapeDef[] = [
  {
    type: "diamond",
    top: "6%",
    left: "82%",
    size: 18,
    rotate: 45,
    delay: 0,
    duration: 6,
    color: "var(--color-primary-600)",
  },
  {
    type: "circle",
    top: "16%",
    left: "5%",
    size: 10,
    rotate: 0,
    delay: 1.2,
    duration: 7,
    color: "var(--color-accent-cyan)",
  },
  {
    type: "triangle",
    top: "32%",
    left: "90%",
    size: 14,
    rotate: 20,
    delay: 0.5,
    duration: 8,
    color: "var(--color-primary-400)",
  },
  {
    type: "ring",
    top: "70%",
    left: "3%",
    size: 22,
    rotate: -15,
    delay: 2,
    duration: 9,
    color: "var(--color-accent-pink)",
  },
  {
    type: "cross",
    top: "4%",
    left: "15%",
    size: 12,
    rotate: 12,
    delay: 0.8,
    duration: 6.5,
    color: "var(--color-primary-700)",
  },
  {
    type: "circle",
    top: "55%",
    left: "95%",
    size: 8,
    rotate: 0,
    delay: 1.5,
    duration: 7.5,
    color: "var(--color-primary-300)",
  },
  {
    type: "diamond",
    top: "85%",
    left: "88%",
    size: 14,
    rotate: 45,
    delay: 3,
    duration: 8,
    color: "var(--color-primary-600)",
  },
  {
    type: "triangle",
    top: "48%",
    left: "2%",
    size: 10,
    rotate: -30,
    delay: 2.5,
    duration: 7,
    color: "var(--color-accent-cyan)",
  },
  {
    type: "hexagon",
    top: "25%",
    left: "4%",
    size: 16,
    rotate: 8,
    delay: 1,
    duration: 8.5,
    color: "var(--color-primary-400)",
    opacity: 0.07,
  },
  {
    type: "square",
    top: "60%",
    left: "92%",
    size: 11,
    rotate: -18,
    delay: 1.8,
    duration: 7,
    color: "var(--color-accent-pink)",
    opacity: 0.08,
  },
  {
    type: "ring",
    top: "90%",
    left: "12%",
    size: 13,
    rotate: 0,
    delay: 3.5,
    duration: 6.5,
    color: "var(--color-primary-300)",
    opacity: 0.06,
  },
  {
    type: "cross",
    top: "42%",
    left: "96%",
    size: 9,
    rotate: 25,
    delay: 2.2,
    duration: 7.5,
    color: "var(--color-primary-700)",
    opacity: 0.09,
  },
];

const CONTACT_SHAPES: ShapeDef[] = [
  {
    type: "ring",
    top: "8%",
    left: "90%",
    size: 20,
    rotate: 0,
    delay: 0.5,
    duration: 8,
    color: "var(--color-primary-400)",
  },
  {
    type: "diamond",
    top: "15%",
    left: "3%",
    size: 14,
    rotate: 45,
    delay: 1,
    duration: 7,
    color: "var(--color-accent-cyan)",
  },
  {
    type: "triangle",
    top: "40%",
    left: "94%",
    size: 12,
    rotate: -15,
    delay: 0.3,
    duration: 7.5,
    color: "var(--color-primary-600)",
  },
  {
    type: "circle",
    top: "60%",
    left: "4%",
    size: 9,
    rotate: 0,
    delay: 2,
    duration: 6.5,
    color: "var(--color-primary-300)",
  },
  {
    type: "hexagon",
    top: "75%",
    left: "92%",
    size: 16,
    rotate: 20,
    delay: 1.5,
    duration: 9,
    color: "var(--color-accent-pink)",
  },
  {
    type: "cross",
    top: "85%",
    left: "7%",
    size: 11,
    rotate: -8,
    delay: 0.8,
    duration: 8,
    color: "var(--color-primary-700)",
  },
  {
    type: "square",
    top: "30%",
    left: "2%",
    size: 10,
    rotate: 35,
    delay: 2.5,
    duration: 7,
    color: "var(--color-primary-400)",
    opacity: 0.08,
  },
  {
    type: "circle",
    top: "5%",
    left: "50%",
    size: 7,
    rotate: 0,
    delay: 3,
    duration: 6,
    color: "var(--color-accent-cyan)",
    opacity: 0.07,
  },
  {
    type: "diamond",
    top: "52%",
    left: "96%",
    size: 9,
    rotate: 45,
    delay: 1.8,
    duration: 7.5,
    color: "var(--color-primary-600)",
    opacity: 0.06,
  },
];

export const SECTION_SHAPES: Record<string, ShapeDef[]> = {
  hero: HERO_SHAPES,
  journey: JOURNEY_SHAPES,
  craft: CRAFT_SHAPES,
  about: ABOUT_SHAPES,
  contact: CONTACT_SHAPES,
};

/* ── individual shape renderer ── */
function FloatingShape({ shape }: { shape: ShapeDef }) {
  const baseStyle: React.CSSProperties = {
    position: "absolute",
    top: shape.top,
    left: shape.left,
    opacity: shape.opacity ?? 0.12,
    pointerEvents: "none",
  };

  const floatVariants = {
    animate: {
      y: [0, -12, 0, 8, 0],
      rotate: [shape.rotate, shape.rotate + 6, shape.rotate - 4, shape.rotate],
      transition: {
        duration: shape.duration,
        repeat: Infinity,
        ease: "easeInOut" as const,
        delay: shape.delay,
      },
    },
  };

  if (shape.type === "circle") {
    return (
      <motion.div
        style={{
          ...baseStyle,
          width: shape.size,
          height: shape.size,
          borderRadius: "50%",
          backgroundColor: shape.color,
        }}
        variants={floatVariants}
        animate="animate"
      />
    );
  }

  if (shape.type === "ring") {
    return (
      <motion.div
        style={{
          ...baseStyle,
          width: shape.size,
          height: shape.size,
          borderRadius: "50%",
          border: `1.5px solid ${shape.color}`,
          backgroundColor: "transparent",
        }}
        variants={floatVariants}
        animate="animate"
      />
    );
  }

  if (shape.type === "diamond") {
    return (
      <motion.div
        style={{
          ...baseStyle,
          width: shape.size,
          height: shape.size,
          backgroundColor: shape.color,
          transform: `rotate(${shape.rotate}deg)`,
          borderRadius: 2,
        }}
        variants={floatVariants}
        animate="animate"
      />
    );
  }

  if (shape.type === "square") {
    return (
      <motion.div
        style={{
          ...baseStyle,
          width: shape.size,
          height: shape.size,
          border: `1.5px solid ${shape.color}`,
          backgroundColor: "transparent",
          borderRadius: 3,
          transform: `rotate(${shape.rotate}deg)`,
        }}
        variants={floatVariants}
        animate="animate"
      />
    );
  }

  if (shape.type === "cross") {
    return (
      <motion.svg
        width={shape.size}
        height={shape.size}
        viewBox="0 0 24 24"
        style={baseStyle}
        variants={floatVariants}
        animate="animate"
      >
        <line x1="12" y1="4" x2="12" y2="20" stroke={shape.color} strokeWidth="1.5" strokeLinecap="round" />
        <line x1="4" y1="12" x2="20" y2="12" stroke={shape.color} strokeWidth="1.5" strokeLinecap="round" />
      </motion.svg>
    );
  }

  if (shape.type === "hexagon") {
    return (
      <motion.svg
        width={shape.size}
        height={shape.size}
        viewBox="0 0 24 24"
        style={baseStyle}
        variants={floatVariants}
        animate="animate"
      >
        <polygon
          points="12,2 21.4,7 21.4,17 12,22 2.6,17 2.6,7"
          fill="none"
          stroke={shape.color}
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </motion.svg>
    );
  }

  // triangle (default)
  return (
    <motion.svg
      width={shape.size}
      height={shape.size}
      viewBox="0 0 24 24"
      style={baseStyle}
      variants={floatVariants}
      animate="animate"
    >
      <polygon points="12,2 22,22 2,22" fill="none" stroke={shape.color} strokeWidth="1.5" strokeLinejoin="round" />
    </motion.svg>
  );
}

/* ── public component ── */
export default function FloatingShapes({ section }: { section: string }) {
  const shapes = SECTION_SHAPES[section] ?? [];

  return (
    <>
      {shapes.map((shape, i) => (
        <FloatingShape key={`${section}-${i}`} shape={shape} />
      ))}
    </>
  );
}
