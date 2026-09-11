"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

interface StabilityGaugeProps {
  value: number;
  size?: number;
  className?: string;
}

function toneForValue(value: number): string {
  if (value >= 70) return "var(--primary)";
  if (value >= 40) return "var(--chart-3)";
  return "var(--destructive)";
}

export function StabilityGauge({ value, size = 128, className }: StabilityGaugeProps) {
  const reduceMotion = useReducedMotion();
  const stroke = 10;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(100, Math.max(0, value));
  const offset = circumference * (1 - clamped / 100);
  const color = toneForValue(clamped);

  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={stroke}
          className="stroke-muted"
          fill="none"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={stroke}
          stroke={color}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: reduceMotion ? offset : circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: reduceMotion ? 0 : 1, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono text-2xl font-semibold tabular-nums text-foreground">
          {Math.round(clamped)}
        </span>
        <span className="text-[10px] uppercase tracking-wide text-muted-foreground">Stability</span>
      </div>
    </div>
  );
}
